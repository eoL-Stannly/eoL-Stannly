#!/usr/bin/env bash
# =============================================================================
# Ralph Wiggum Loop - Autonomous LLM Agent Runner
# Inspired by https://github.com/frankbria/ralph-claude-code
#
# A bash loop that continuously invokes Claude Code to work through tasks
# autonomously, with safety mechanisms to prevent runaway loops.
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RALPH_DIR="${SCRIPT_DIR}/.ralph"
LIB_DIR="${SCRIPT_DIR}/lib"

# ---- Configuration Defaults ----
PROJECT_NAME="${PROJECT_NAME:-llm-agents-office}"
MAX_CALLS_PER_HOUR="${MAX_CALLS_PER_HOUR:-100}"
CLAUDE_TIMEOUT_MINUTES="${CLAUDE_TIMEOUT_MINUTES:-15}"
SLEEP_BETWEEN_LOOPS="${SLEEP_BETWEEN_LOOPS:-5}"
SESSION_EXPIRY_HOURS="${SESSION_EXPIRY_HOURS:-24}"
CB_NO_PROGRESS_THRESHOLD="${CB_NO_PROGRESS_THRESHOLD:-3}"
CB_SAME_ERROR_THRESHOLD="${CB_SAME_ERROR_THRESHOLD:-5}"
SAFETY_BREAKER_THRESHOLD="${SAFETY_BREAKER_THRESHOLD:-5}"

# ---- Load project config ----
if [[ -f "${SCRIPT_DIR}/.ralphrc" ]]; then
  source "${SCRIPT_DIR}/.ralphrc"
fi

# ---- State ----
LOOP_COUNT=0
CALLS_THIS_HOUR=0
HOUR_START=$(date +%s)
CONSECUTIVE_COMPLETIONS=0
CONSECUTIVE_NO_PROGRESS=0
LAST_ERROR=""
SAME_ERROR_COUNT=0
SESSION_ID=""
SESSION_START=""
EXIT_REQUESTED=false

# ---- Color Output ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info()  { echo -e "${CYAN}[Ralph]${NC} $*"; }
log_ok()    { echo -e "${GREEN}[Ralph]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[Ralph]${NC} $*"; }
log_error() { echo -e "${RED}[Ralph]${NC} $*"; }

# ---- Ensure .ralph directory exists ----
mkdir -p "${RALPH_DIR}"

# ---- Status file for the monitor ----
write_status() {
  cat > "${RALPH_DIR}/status.json" <<EOF
{
  "project": "${PROJECT_NAME}",
  "running": true,
  "loop_count": ${LOOP_COUNT},
  "calls_this_hour": ${CALLS_THIS_HOUR},
  "max_calls_per_hour": ${MAX_CALLS_PER_HOUR},
  "consecutive_completions": ${CONSECUTIVE_COMPLETIONS},
  "consecutive_no_progress": ${CONSECUTIVE_NO_PROGRESS},
  "session_id": "${SESSION_ID}",
  "uptime_seconds": $(( $(date +%s) - ${SESSION_START:-$(date +%s)} )),
  "last_update": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
}

write_stopped() {
  cat > "${RALPH_DIR}/status.json" <<EOF
{
  "project": "${PROJECT_NAME}",
  "running": false,
  "loop_count": ${LOOP_COUNT},
  "calls_this_hour": ${CALLS_THIS_HOUR},
  "stopped_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "reason": "$1"
}
EOF
}

# ---- Rate Limiting ----
check_rate_limit() {
  local now
  now=$(date +%s)
  local elapsed=$(( now - HOUR_START ))

  # Reset hourly counter
  if [[ ${elapsed} -ge 3600 ]]; then
    log_info "Hourly rate limit reset (${CALLS_THIS_HOUR} calls in last hour)"
    CALLS_THIS_HOUR=0
    HOUR_START=${now}
  fi

  if [[ ${CALLS_THIS_HOUR} -ge ${MAX_CALLS_PER_HOUR} ]]; then
    local wait_time=$(( 3600 - elapsed ))
    log_warn "Rate limit reached (${CALLS_THIS_HOUR}/${MAX_CALLS_PER_HOUR}). Waiting ${wait_time}s..."
    countdown ${wait_time}
    CALLS_THIS_HOUR=0
    HOUR_START=$(date +%s)
  fi
}

countdown() {
  local remaining=$1
  while [[ ${remaining} -gt 0 ]]; do
    printf "\r${YELLOW}[Ralph]${NC} Rate limit cooldown: %02d:%02d " $((remaining/60)) $((remaining%60))
    sleep 1
    remaining=$((remaining - 1))
  done
  echo ""
}

# ---- Session Management ----
init_session() {
  local session_file="${RALPH_DIR}/.claude_session_id"

  if [[ -f "${session_file}" ]]; then
    SESSION_ID=$(cat "${session_file}")
    SESSION_START=$(stat -c %Y "${session_file}" 2>/dev/null || date +%s)

    # Check expiry
    local now
    now=$(date +%s)
    local age=$(( now - SESSION_START ))
    local max_age=$(( SESSION_EXPIRY_HOURS * 3600 ))

    if [[ ${age} -ge ${max_age} ]]; then
      log_warn "Session expired after ${SESSION_EXPIRY_HOURS}h. Starting fresh."
      rm -f "${session_file}"
      SESSION_ID=""
    else
      log_info "Resuming session: ${SESSION_ID}"
    fi
  fi

  if [[ -z "${SESSION_ID}" ]]; then
    SESSION_ID="ralph_$(date +%s)_$$"
    echo "${SESSION_ID}" > "${session_file}"
    SESSION_START=$(date +%s)
    log_ok "New session started: ${SESSION_ID}"
  fi
}

# ---- Circuit Breaker ----
check_circuit_breaker() {
  # No progress detection
  if [[ ${CONSECUTIVE_NO_PROGRESS} -ge ${CB_NO_PROGRESS_THRESHOLD} ]]; then
    log_error "Circuit breaker: No progress for ${CONSECUTIVE_NO_PROGRESS} consecutive loops"
    return 1
  fi

  # Same error detection
  if [[ ${SAME_ERROR_COUNT} -ge ${CB_SAME_ERROR_THRESHOLD} ]]; then
    log_error "Circuit breaker: Same error repeated ${SAME_ERROR_COUNT} times"
    return 1
  fi

  # Safety breaker: too many consecutive completion signals
  if [[ ${CONSECUTIVE_COMPLETIONS} -ge ${SAFETY_BREAKER_THRESHOLD} ]]; then
    log_error "Safety breaker: ${CONSECUTIVE_COMPLETIONS} consecutive completion signals (likely stuck)"
    return 1
  fi

  return 0
}

# ---- Response Analysis ----
analyze_response() {
  local response="$1"
  local done_indicators=0
  local exit_signal="false"

  # Check for completion indicators
  if echo "${response}" | grep -qi "all tasks.*complete\|all.*done\|nothing.*left\|no more tasks"; then
    done_indicators=$((done_indicators + 1))
  fi

  if echo "${response}" | grep -qi "implementation.*complete\|feature.*complete\|project.*complete"; then
    done_indicators=$((done_indicators + 1))
  fi

  if echo "${response}" | grep -qi "tests.*pass\|all.*tests.*green"; then
    done_indicators=$((done_indicators + 1))
  fi

  # Check for explicit exit signal
  if echo "${response}" | grep -q "EXIT_SIGNAL.*true\|EXIT_SIGNAL: true"; then
    exit_signal="true"
  fi

  # Check for errors
  local has_error="false"
  if echo "${response}" | grep -qi "error\|failed\|exception\|permission denied"; then
    has_error="true"
  fi

  # Check for permission denial (immediate halt)
  if echo "${response}" | grep -qi "permission denied\|not allowed\|access denied"; then
    log_error "Permission denial detected - halting immediately"
    EXIT_REQUESTED=true
    return
  fi

  # Update progress tracking
  if [[ "${has_error}" == "true" ]]; then
    local error_sig
    error_sig=$(echo "${response}" | grep -i "error\|failed" | head -1 | tr -d '[:space:]')
    if [[ "${error_sig}" == "${LAST_ERROR}" ]]; then
      SAME_ERROR_COUNT=$((SAME_ERROR_COUNT + 1))
    else
      SAME_ERROR_COUNT=1
      LAST_ERROR="${error_sig}"
    fi
    CONSECUTIVE_NO_PROGRESS=$((CONSECUTIVE_NO_PROGRESS + 1))
  else
    SAME_ERROR_COUNT=0
    LAST_ERROR=""
    CONSECUTIVE_NO_PROGRESS=0
  fi

  # Dual-condition exit gate
  if [[ ${done_indicators} -ge 2 && "${exit_signal}" == "true" ]]; then
    log_ok "Dual-condition exit met: ${done_indicators} done indicators + EXIT_SIGNAL=true"
    EXIT_REQUESTED=true
  elif [[ ${done_indicators} -ge 2 ]]; then
    CONSECUTIVE_COMPLETIONS=$((CONSECUTIVE_COMPLETIONS + 1))
    log_warn "Completion indicators detected (${done_indicators}) but EXIT_SIGNAL not set. Continuing... (${CONSECUTIVE_COMPLETIONS}/${SAFETY_BREAKER_THRESHOLD})"
  else
    CONSECUTIVE_COMPLETIONS=0
  fi
}

# ---- Load Task Prompt ----
get_prompt() {
  local prompt_file="${RALPH_DIR}/fix_plan.md"
  local main_prompt="${RALPH_DIR}/PROMPT.md"

  if [[ ! -f "${prompt_file}" ]]; then
    if [[ -f "${main_prompt}" ]]; then
      cat "${main_prompt}"
    else
      echo "Review the project and continue working on pending tasks. Check .ralph/fix_plan.md for the task list."
    fi
    return
  fi

  cat "${prompt_file}"
}

# ---- Build Claude Command ----
build_claude_command() {
  local prompt
  prompt=$(get_prompt)

  local allowed_tools="${ALLOWED_TOOLS:-Write,Read,Edit,Bash,Glob,Grep,WebFetch}"

  local cmd="claude"
  cmd="${cmd} --output-format json"

  # Add allowed tools
  IFS=',' read -ra TOOLS <<< "${allowed_tools}"
  for tool in "${TOOLS[@]}"; do
    cmd="${cmd} --allowedTools $(echo "${tool}" | xargs)"
  done

  # Session continuity
  if [[ -n "${SESSION_ID}" ]]; then
    cmd="${cmd} --resume ${SESSION_ID}"
  fi

  # Append system context
  local system_context="You are operating inside the Ralph Wiggum autonomous loop (iteration ${LOOP_COUNT}).
When you have completed ALL tasks in .ralph/fix_plan.md, output a status block:
RALPH_STATUS: {done_indicators: N, EXIT_SIGNAL: true/false}
Set EXIT_SIGNAL: true ONLY when genuinely all work is complete."

  cmd="${cmd} --append-system-prompt '${system_context}'"
  cmd="${cmd} -p '${prompt}'"

  echo "${cmd}"
}

# ---- Graceful Shutdown ----
shutdown() {
  log_warn "Shutting down Ralph loop..."
  write_stopped "manual_shutdown"
  exit 0
}

trap shutdown SIGINT SIGTERM

# ---- Banner ----
print_banner() {
  echo -e "${CYAN}"
  echo '  ____       _       _       '
  echo ' |  _ \ __ _| |_ __ | |__    '
  echo ' | |_) / _` | | `_ \| `_ \   '
  echo ' |  _ < (_| | | |_) | | | |  '
  echo ' |_| \_\__,_|_| .__/|_| |_|  '
  echo '               |_|            '
  echo '  Wiggum Autonomous Loop      '
  echo -e "${NC}"
  echo -e "  Project:  ${GREEN}${PROJECT_NAME}${NC}"
  echo -e "  Rate:     ${YELLOW}${MAX_CALLS_PER_HOUR} calls/hour${NC}"
  echo -e "  Timeout:  ${YELLOW}${CLAUDE_TIMEOUT_MINUTES} min${NC}"
  echo -e "  Session:  ${YELLOW}${SESSION_EXPIRY_HOURS}h expiry${NC}"
  echo ""
}

# =============================================================================
# Main Loop
# =============================================================================
main() {
  print_banner
  init_session

  log_ok "Starting Ralph Wiggum loop..."
  echo ""

  while true; do
    LOOP_COUNT=$((LOOP_COUNT + 1))

    echo ""
    log_info "═══════════════════════════════════════════"
    log_info "Loop iteration #${LOOP_COUNT}"
    log_info "═══════════════════════════════════════════"

    # Write status for monitor
    write_status

    # Check rate limit
    check_rate_limit

    # Check circuit breaker
    if ! check_circuit_breaker; then
      log_error "Circuit breaker tripped. Stopping."
      write_stopped "circuit_breaker"
      exit 1
    fi

    # Check for graceful exit
    if [[ -f "${RALPH_DIR}/.stop" ]]; then
      log_warn "Stop file detected. Shutting down gracefully."
      rm -f "${RALPH_DIR}/.stop"
      write_stopped "stop_file"
      exit 0
    fi

    if [[ "${EXIT_REQUESTED}" == "true" ]]; then
      log_ok "All tasks complete. Ralph loop finished successfully!"
      write_stopped "completed"
      exit 0
    fi

    # Build and execute Claude command
    local cmd
    cmd=$(build_claude_command)

    log_info "Executing Claude Code..."
    CALLS_THIS_HOUR=$((CALLS_THIS_HOUR + 1))

    local response=""
    local exit_code=0

    # Execute with timeout
    if command -v timeout &>/dev/null; then
      response=$(eval timeout $((CLAUDE_TIMEOUT_MINUTES * 60)) "${cmd}" 2>&1) || exit_code=$?
    else
      response=$(eval "${cmd}" 2>&1) || exit_code=$?
    fi

    if [[ ${exit_code} -ne 0 ]]; then
      log_error "Claude exited with code ${exit_code}"

      # Check for API limits
      if echo "${response}" | grep -qi "rate.*limit\|429\|5.*hour"; then
        log_error "API rate limit detected. Pausing for 30 minutes..."
        sleep 1800
        continue
      fi
    fi

    # Analyze the response
    if [[ -n "${response}" ]]; then
      log_info "Response received ($(echo "${response}" | wc -c) bytes)"
      analyze_response "${response}"
    else
      log_warn "Empty response from Claude"
      CONSECUTIVE_NO_PROGRESS=$((CONSECUTIVE_NO_PROGRESS + 1))
    fi

    # Brief pause between iterations
    log_info "Sleeping ${SLEEP_BETWEEN_LOOPS}s before next iteration..."
    sleep "${SLEEP_BETWEEN_LOOPS}"
  done
}

main "$@"
