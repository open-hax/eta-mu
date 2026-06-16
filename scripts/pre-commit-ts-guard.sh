#!/usr/bin/env bash
# pre-commit-ts-guard.sh
# Pre-commit hook that rejects commits that increase TypeScript line count.
#
# Installation:
#   ln -sf ../../scripts/pre-commit-ts-guard.sh .git/hooks/pre-commit
#   # or for submodule:
#   ln -sf ../../../../orgs/open-hax/eta-mu/scripts/pre-commit-ts-guard.sh \
#     .git/modules/orgs/open-hax/eta-mu/hooks/pre-commit

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$REPO_ROOT/scripts/ts-line-count.mjs"
BASELINE_FILE="$REPO_ROOT/.ts-line-count-baseline"

# Ensure the counting script exists
if [ ! -f "$SCRIPT" ]; then
  echo "⚠️  ts-line-count.mjs not found, skipping TS guard"
  exit 0
fi

# If no baseline exists, create one from HEAD
if [ ! -f "$BASELINE_FILE" ]; then
  echo "📝 No TypeScript line count baseline found. Creating from HEAD..."
  # Count current lines and store as baseline
  CURRENT=$(node "$SCRIPT" --global 2>/dev/null | grep -oP '\d+' | head -1)
  if [ -z "$CURRENT" ]; then
    echo "⚠️  Could not count TypeScript lines, skipping guard"
    exit 0
  fi
  echo "$CURRENT" > "$BASELINE_FILE"
  echo "   Baseline: $CURRENT lines"
fi

# Read the baseline
PREV=$(cat "$BASELINE_FILE")

# Run the check against staged files only (for pre-commit speed)
# We count all TS lines in the working tree, which is a conservative check
CURRENT=$(node "$SCRIPT" --global 2>/dev/null | grep -oP '\d+' | head -1)

if [ -z "$CURRENT" ]; then
  echo "⚠️  Could not count TypeScript lines, skipping guard"
  exit 0
fi

# Run the check
if ! node "$SCRIPT" --check "$PREV"; then
  echo ""
  echo "💡 To see a full report: node scripts/ts-line-count.mjs"
  echo "💡 To update baseline after intentional TS changes:"
  echo "   echo $CURRENT > .ts-line-count-baseline"
  echo ""
  exit 1
fi

# On successful commit, update baseline to current count
echo "$CURRENT" > "$BASELINE_FILE"
