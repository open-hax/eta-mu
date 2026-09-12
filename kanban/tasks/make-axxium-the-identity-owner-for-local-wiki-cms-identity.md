---
category: "tasks"
dependency: []
type: "task"
write-id: "1789207320661-0.r3h5ab7vj1gic1zarwd"
title: "Make Axxium the identity owner for local Wiki CMS"
priority: "P0"
status: "in_progress"
uuid: "axxium-wiki-identity"
created_at: "2026-09-12T05:07:20.177Z"
---

## Intent
Axxium owns identity for the local Wiki CMS and provides the same verified principals to human and agent interfaces.

## Acceptance criteria
- Portable actor, credential, challenge, and session laws; atomic Clio facts with encrypted private credential blobs; restart, replay, and conflict evidence.
- Distinct unique username or email password login; verified issuer and subject identity with explicit linking, never implicit email merging.
- GitHub, Discord, Google, ATProto reference SDK PKCE/PAR/DPoP, PGP, and passkey providers; unavailable external credentials are surfaced honestly.
- UI and API capability parity; active actors and sessions checked on every use; no self-service capability escalation.
- Same-origin cookie and mutation protections; real cryptographic local issuer tests and explicit external verification limits.
- Knoxx adopts Axxium authentication and removes duplicated GitHub OAuth ownership.
- Actual build, tests, lint, browser walkthrough and independent PR review before merge.

## Verification
Run package build/test/lint, focused cryptographic and replay tests, then the live Knoxx browser tour with source review and agent updates. Record failures and fixes in the sandbox obstacle report.

---
Recovery and current proof: restored missing lawful ready/todo/in_progress transitions from retained breakdown state after the external worktree loss; no hand-edited status. Axxium correctness checkpoint published a7b19825fb5d7c624c38f1d41043c42e92d7f0c3 (exact local c512bd8). Integrated 66 tests/632 assertions, both release outputs118files with0warnings, lint0/0, built ESM/realTCP identity proof pass. Added fresh-session credential inventory/revocation with configured-provider last-method protection; fixed all seven Codex findings through pure external admission, native Fastify/SDK interfaces, dummy password work, browser-cookie refresh, retained-ledger vault guard and safe cleanup contention. Strict legacy boundary remains56violations/exit1 and live OAuth consent remains uncompleted pending provider configuration. PR333 current-head three-reviewer loop is active; root owns browser integration and no merge occurs before remaining issues/gates resolve.

PR333 follow-up: reproduced one-use OAuth code loss under the real native Clio admission lock and moved bootstrap creation/restart policy into pure domain transitions. Local admission retries retain a verified provider result but recheck challenge expiry and linking session on each attempt; process-crash recovery is not claimed. Actual bcrypt tests exposed and repaired an invalid default import, and actual Fastify cookies reproduced a 1000x Max-Age unit bug. Guarded full suite 83 tests/744 assertions, release server/lib 119 files each with zero warnings, kondo zero errors/warnings, unchanged strict boundary zero violations and built ESM/TCP probe pass. Live external consent still requires operator provider configuration. Full repository board review gate remains separate; no status bypass.

---