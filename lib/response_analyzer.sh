#!/usr/bin/env bash
# =============================================================================
# Response Analyzer Library
# Analyzes Claude's output for exit signals, errors, and completion patterns.
# =============================================================================

# Parse RALPH_STATUS block from response
ra_parse_status_block() {
  local response="$1"
  local status_line
  status_line=$(echo "${response}" | grep -i "RALPH_STATUS" | head -1)

  if [[ -z "${status_line}" ]]; then
    echo "none"
    return
  fi

  echo "${status_line}"
}

# Count completion indicators in response
ra_count_done_indicators() {
  local response="$1"
  local count=0

  # Pattern matching for various "done" phrases
  local patterns=(
    "all tasks.*complete"
    "all.*done"
    "nothing.*left"
    "no more tasks"
    "implementation.*complete"
    "feature.*complete"
    "project.*complete"
    "everything.*finished"
    "all items.*checked"
    "fix_plan.*complete"
    "tests.*pass"
    "all.*tests.*green"
  )

  for pattern in "${patterns[@]}"; do
    if echo "${response}" | grep -qi "${pattern}"; then
      count=$((count + 1))
    fi
  done

  echo "${count}"
}

# Extract EXIT_SIGNAL value
ra_get_exit_signal() {
  local response="$1"

  if echo "${response}" | grep -q "EXIT_SIGNAL.*true\|EXIT_SIGNAL: true"; then
    echo "true"
  elif echo "${response}" | grep -q "EXIT_SIGNAL.*false\|EXIT_SIGNAL: false"; then
    echo "false"
  else
    echo "absent"
  fi
}

# Detect error patterns
ra_detect_errors() {
  local response="$1"
  local errors=()

  if echo "${response}" | grep -qi "permission denied"; then
    errors+=("permission_denied")
  fi

  if echo "${response}" | grep -qi "rate.*limit\|429"; then
    errors+=("rate_limit")
  fi

  if echo "${response}" | grep -qi "timeout\|timed out"; then
    errors+=("timeout")
  fi

  if echo "${response}" | grep -qi "syntax error\|SyntaxError"; then
    errors+=("syntax_error")
  fi

  if echo "${response}" | grep -qi "module not found\|ModuleNotFoundError\|Cannot find module"; then
    errors+=("module_not_found")
  fi

  if [[ ${#errors[@]} -eq 0 ]]; then
    echo "none"
  else
    printf '%s,' "${errors[@]}" | sed 's/,$//'
  fi
}

# Check if response suggests test-only loop (test saturation)
ra_is_test_only() {
  local response="$1"

  # Check if the response is mostly about running tests
  local test_lines
  test_lines=$(echo "${response}" | grep -ci "test\|spec\|assert\|expect" || echo 0)
  local total_lines
  total_lines=$(echo "${response}" | wc -l)

  if [[ ${total_lines} -gt 0 ]]; then
    local ratio=$(( test_lines * 100 / total_lines ))
    if [[ ${ratio} -ge 70 ]]; then
      echo "true"
      return
    fi
  fi

  echo "false"
}
