#!/usr/bin/env bash
# =============================================================================
# Ralph Wiggum Monitor - Live Dashboard
# Displays real-time status of the Ralph loop
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RALPH_DIR="${SCRIPT_DIR}/.ralph"
STATUS_FILE="${RALPH_DIR}/status.json"
REFRESH_RATE="${REFRESH_RATE:-2}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

format_uptime() {
  local seconds=$1
  local h=$((seconds / 3600))
  local m=$(( (seconds % 3600) / 60 ))
  local s=$((seconds % 60))
  printf "%02d:%02d:%02d" ${h} ${m} ${s}
}

get_json_value() {
  local json="$1"
  local key="$2"
  echo "${json}" | grep -o "\"${key}\"[[:space:]]*:[[:space:]]*[^,}]*" | head -1 | sed 's/.*:[[:space:]]*//' | tr -d '"[:space:]'
}

draw_progress_bar() {
  local current=$1
  local max=$2
  local width=${3:-30}

  if [[ ${max} -eq 0 ]]; then
    max=1
  fi

  local filled=$(( current * width / max ))
  local empty=$(( width - filled ))

  local color="${GREEN}"
  local pct=$(( current * 100 / max ))
  if [[ ${pct} -ge 80 ]]; then
    color="${RED}"
  elif [[ ${pct} -ge 60 ]]; then
    color="${YELLOW}"
  fi

  printf "${color}"
  printf '█%.0s' $(seq 1 ${filled} 2>/dev/null) || true
  printf "${DIM}"
  printf '░%.0s' $(seq 1 ${empty} 2>/dev/null) || true
  printf "${NC}"
  printf " %d/%d" ${current} ${max}
}

render() {
  clear

  echo -e "${CYAN}${BOLD}"
  echo '  ╔══════════════════════════════════════╗'
  echo '  ║     Ralph Wiggum Monitor             ║'
  echo '  ╚══════════════════════════════════════╝'
  echo -e "${NC}"

  if [[ ! -f "${STATUS_FILE}" ]]; then
    echo -e "  ${DIM}Waiting for Ralph loop to start...${NC}"
    echo ""
    echo -e "  ${DIM}Run: ${NC}${GREEN}bash ralph_loop.sh${NC}"
    return
  fi

  local json
  json=$(cat "${STATUS_FILE}")

  local running
  running=$(get_json_value "${json}" "running")
  local loop_count
  loop_count=$(get_json_value "${json}" "loop_count")
  local calls
  calls=$(get_json_value "${json}" "calls_this_hour")
  local max_calls
  max_calls=$(get_json_value "${json}" "max_calls_per_hour")
  local project
  project=$(get_json_value "${json}" "project")
  local uptime
  uptime=$(get_json_value "${json}" "uptime_seconds")
  local completions
  completions=$(get_json_value "${json}" "consecutive_completions")
  local no_progress
  no_progress=$(get_json_value "${json}" "consecutive_no_progress")
  local session
  session=$(get_json_value "${json}" "session_id")

  # Status
  if [[ "${running}" == "true" ]]; then
    echo -e "  Status:     ${GREEN}${BOLD}● RUNNING${NC}"
  else
    local reason
    reason=$(get_json_value "${json}" "reason")
    echo -e "  Status:     ${RED}${BOLD}○ STOPPED${NC} ${DIM}(${reason:-unknown})${NC}"
  fi

  echo -e "  Project:    ${BOLD}${project:-unknown}${NC}"
  echo -e "  Session:    ${DIM}${session:-none}${NC}"
  echo ""

  # Loop count
  echo -e "  Iterations: ${BOLD}${loop_count:-0}${NC}"
  echo ""

  # Rate limit bar
  echo -n "  API Calls:  "
  draw_progress_bar "${calls:-0}" "${max_calls:-100}" 30
  echo ""
  echo ""

  # Uptime
  if [[ -n "${uptime}" && "${uptime}" != "null" ]]; then
    echo -e "  Uptime:     ${BOLD}$(format_uptime "${uptime}")${NC}"
  fi
  echo ""

  # Health indicators
  echo -e "  ${BOLD}Health Indicators${NC}"
  echo -e "  ─────────────────────────"

  local comp_color="${GREEN}"
  if [[ ${completions:-0} -ge 3 ]]; then comp_color="${RED}"
  elif [[ ${completions:-0} -ge 1 ]]; then comp_color="${YELLOW}"; fi
  echo -e "  Completion signals: ${comp_color}${completions:-0}${NC}/5"

  local prog_color="${GREEN}"
  if [[ ${no_progress:-0} -ge 2 ]]; then prog_color="${RED}"
  elif [[ ${no_progress:-0} -ge 1 ]]; then prog_color="${YELLOW}"; fi
  echo -e "  No-progress streak: ${prog_color}${no_progress:-0}${NC}/3"

  echo ""
  echo -e "  ${DIM}Refreshing every ${REFRESH_RATE}s • Ctrl+C to exit${NC}"
}

# Main monitor loop
while true; do
  render
  sleep "${REFRESH_RATE}"
done
