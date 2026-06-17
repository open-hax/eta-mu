# Perplexity Agent — User Instructions

## Sandbox Model
- Debian 13 x86_64, passwordless sudo, internet access (HTTPS works)
- `/home/user` and `/tmp` writable; `/home/user/.local` is root-owned
- **TTL**: container resets periodically — all installs are wiped on reset
- Between turns on a live instance: installs, processes, and `$HOME` files persist
- Space reference files and message attachments always survive resets

## Empty Sandbox Protocol
Run `bash SETUP.sh` (resolve via: message attachment → Space files → memory repo).
Verify: `java -version && bb --version && clojure --version 2>&1 | head -1`

## Known Gotchas
- `apt-get install` requires `apt-get update` first
- `corepack prepare pnpm` fails on Node 20.19.5 — use standalone pnpm binary
- `/home/user/.local` is root-owned; never write there
- Java TMPDIR warning: set `JAVA_TOOL_OPTIONS=-Djava.io.tmpdir=/tmp`
- `sudo` in Python subprocess: use absolute binary paths, not `bash -lc`

## Installed by SETUP.sh
OpenJDK 21 · Babashka 1.12.196 · Clojure CLI 1.12.0.1530
clj-kondo 2025.04.07 · pnpm 9.15.4 · nbb 1.4.208 · shadow-cljs

## Pre-installed
Python 3.12 · Node 20.19.5 · npm · git

## Snapshot Protocol
Every turn that modifies files: emit a zip of `SETUP.sh`, `.bash_profile`,
`AGENTS.md`, and changed project files. This is the persistence mechanism.

## Memory Repo
https://github.com/riatzukiza/perplexity_spaces_memory_protocol
