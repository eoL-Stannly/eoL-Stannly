#!/usr/bin/env bash
# =============================================================================
# Circuit Breaker Library
# Detects stagnation patterns and prevents infinite loops.
# =============================================================================

CB_HISTORY_FILE="${RALPH_DIR:-.ralph}/cb_history.log"

cb_init() {
  : > "${CB_HISTORY_FILE}"
}

# Record a loop result for analysis
cb_record() {
  local loop_num="$1"
  local files_changed="$2"
  local response_length="$3"
  local had_error="$4"
  local timestamp
  timestamp=$(date +%s)

  echo "${timestamp},${loop_num},${files_changed},${response_length},${had_error}" >> "${CB_HISTORY_FILE}"
}

# Check if we're making progress (file changes happening)
cb_check_file_changes() {
  local threshold="${1:-3}"
  local recent
  recent=$(tail -n "${threshold}" "${CB_HISTORY_FILE}" 2>/dev/null || echo "")

  if [[ -z "${recent}" ]]; then
    return 0 # Not enough history
  fi

  local zero_changes=0
  while IFS=',' read -r ts loop files resp err; do
    if [[ "${files}" == "0" ]]; then
      zero_changes=$((zero_changes + 1))
    fi
  done <<< "${recent}"

  if [[ ${zero_changes} -ge ${threshold} ]]; then
    return 1 # Stagnation detected
  fi

  return 0
}

# Check if response length is declining (possible API degradation)
cb_check_response_trend() {
  local threshold="${1:-5}"
  local recent
  recent=$(tail -n "${threshold}" "${CB_HISTORY_FILE}" 2>/dev/null || echo "")

  if [[ -z "${recent}" ]]; then
    return 0
  fi

  local prev_len=0
  local declining=0
  while IFS=',' read -r ts loop files resp err; do
    if [[ ${prev_len} -gt 0 && ${resp} -lt $((prev_len / 2)) ]]; then
      declining=$((declining + 1))
    fi
    prev_len=${resp}
  done <<< "${recent}"

  if [[ ${declining} -ge $((threshold - 1)) ]]; then
    return 1 # Declining trend
  fi

  return 0
}

# Count files changed since last loop (using git)
cb_count_file_changes() {
  if command -v git &>/dev/null && git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
    git diff --name-only 2>/dev/null | wc -l | tr -d '[:space:]'
  else
    echo "0"
  fi
}
