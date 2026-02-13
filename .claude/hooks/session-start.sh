#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# This is a GitHub profile README repository with no dependencies.
# The hook is a placeholder for future dependency installation if the
# project grows to include code, tests, or linters.

echo "Session start hook completed successfully."
