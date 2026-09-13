#!/usr/bin/env bash
set -euo pipefail

# Bootstrap source dependencies for eta-mu CLI from new repos.
# Session Mycology is extracted to open-hax/session-mycology.
# Other source deps (fork-tax, receipt-river, turn-processor, terminal-ui) stay in eta-mu.

SESSION_MYCOLOGY_SHA="30339f9aa3df83ef8c335d4544307272abfbb131"
SESSION_MYCOLOGY_URL="https://github.com/open-hax/session-mycology.git"
DEPS_DIR="$(cd "$(dirname "$0")/.." && pwd)/deps"

mkdir -p "$DEPS_DIR"

# Fetch Session Mycology from new repo
if [ ! -d "$DEPS_DIR/session-mycology/src/cljs" ] || [ "$(find "$DEPS_DIR/session-mycology/src/cljs" -type f | wc -l)" = "0" ]; then
  echo "Fetching Session Mycology source from open-hax/session-mycology@$SESSION_MYCOLOGY_SHA..."
  TMPDIR=$(mktemp -d)
  git clone --quiet "$SESSION_MYCOLOGY_URL" "$TMPDIR" 2>/dev/null
  git -C "$TMPDIR" checkout "$SESSION_MYCOLOGY_SHA" --quiet
  mkdir -p "$DEPS_DIR/session-mycology/src/cljs"
  cp -r "$TMPDIR/src/cljs/"* "$DEPS_DIR/session-mycology/src/cljs/" 2>/dev/null || true
  rm -rf "$TMPDIR"
  echo "  session-mycology/src/cljs: $(find "$DEPS_DIR/session-mycology/src/cljs" -type f | wc -l) files"
fi

echo "Source deps ready at $DEPS_DIR"
