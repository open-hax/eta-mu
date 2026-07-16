#!/usr/bin/env bash
# eta-mu-publish-smoke.sh — build, pack, and globally install packages/eta-mu
# from its own tarball, then exercise the binary the way a fresh
# `npm install -g eta-mu` user would. Run before every publish.
#
# Usage: scripts/eta-mu-publish-smoke.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG_DIR="$ROOT/packages/eta-mu"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "==> Building packages/eta-mu"
pnpm --dir "$PKG_DIR" build

echo "==> npm pack"
TARBALL="$(cd "$PKG_DIR" && npm pack --pack-destination "$WORK" | tail -1)"
TARBALL_PATH="$WORK/$TARBALL"

echo "==> Global install from tarball into isolated prefix"
PREFIX="$WORK/prefix"
mkdir -p "$PREFIX"
npm install -g --prefix "$PREFIX" "$TARBALL_PATH"

BIN="$PREFIX/bin/eta-mu"
if [ ! -x "$BIN" ]; then
  echo "FAIL: $BIN was not installed" >&2
  exit 1
fi

echo "==> eta-mu --version"
"$BIN" --version

echo "==> eta-mu --help"
"$BIN" --help >/dev/null

echo "==> eta-mu agent (no key configured, expect the guidance message, not a crash)"
OUTPUT="$("$BIN" agent "hi" 2>&1 || true)"
echo "$OUTPUT"
if ! grep -q "No API key configured" <<<"$OUTPUT"; then
  echo "FAIL: expected the no-API-key guidance message" >&2
  exit 1
fi

echo "==> Smoke passed: $TARBALL"
