---
category: "tasks"
dependency: []
type: "task"
write-id: "1789216999180-0.9ivybmjq2ukra33ugdk"
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

Recovery follow-up for actual PR333 findings: reconstruct real ATProto SDK local-store contention retries, bound SDK and verified identity admission without repeating provider code exchange, use Fastify trustProxy-derived client identity with direct socket fallback, mark ATProto begin native async, and reflush projection-only identity acknowledgments using the reviewed Clio kernel. Reconstruct regression fixtures against the real SDK and native locks, run fresh guarded tests/releases/lint/boundary/TCP proof, and explicitly retain live-consent limitations.

Fresh reconstructed combined gate: 89 tests and 775 assertions, zero failures/errors, native async error guard; release server/lib121files0warnings; kondo0/0 and strict boundary0. Real SDK state/session contention tests prove one exchange, retained encrypted session, consumed pending state and no revoke; deadline plus reversed-clock attempt cap refuse indefinitely busy storage. Real Fastify trust policy separates trusted forwarded clients and rejects untrusted spoofed bucket selection. Native identity fsync regression failed3assertions before no-change fence and nowpasses. Built ESM/TCP signup, private restart, authenticated read, origin/header refusal, logout and POST linking pass; live external OAuth consent remains explicitly unavailable. Foundationf221 integrated with original identity ledger bytes preserved and new foundation events appended.

Codex current-head finding 3996123683 confirms real ATProto uses distinct SDK query state and application/browser state. In an isolated successor worktree, expose non-consuming SDK app-state lookup at the extern facade, prevalidate the Axxium browser challenge with it before one-use exchange, and compare the returned app state before final admission. Add an actual reference NodeOAuthClient-to-Axxium finish regression for success, wrong-browser refusal before exchange, replay, and substituted returned app state. Preserve frozen browser source e0cdf35. Also restack the pending foundation creation/reopen durability fence and apply it to identity open.

ATProto successor integrates real SDK query-key to app-state lookup: actual SDK-to-Axxium regression RED3 then GREEN, with wrong-browser refusal before exchange, substituted returned app state refusal, one exchange, usable local session and replay refusal. Identity interrupted-creation opener RED3 then GREEN with canonical Clio fence. Restacked foundation37b720 while browser predecessor eta-identity e0cdf35 stayed unchanged. Final Axxium91tests794assertions, server/lib121files each0warnings, kondo0/0 and strictboundary clean; actual compiled ESM/TCP identity verifier green with explicit live OAuth operator-configuration warning. Three-reviewer loop remains open; no merge claim.

Current Codex findings3996174222/24/26: reflush a surviving vault key inode and private parent; validate and re-fence the ceremony checkpoint under its operation lock; recover native EEXIST during ledger creation. A separate stable initialization lock must serialize whole first-open construction so a second process cannot mistake an in-progress vault key for lost initialized history. Preserve the existing refusal for established private state with missing history. Native fault and actual concurrent opener regressions come first. Work only in eta-identity-initialization; both browser worktrees remain frozen.

Additional actual Codex findings added to current initialization scope:3996178543 move grant decisions into pure law/domain transition using current transaction authority;3996178550 declare host delay native async and await completion;3996178553 bound failed PGP completion work through durable admission before crypto. models_children owns grant and PGP source; identity_clio owns host/startup durability. New mutable worktree eta-identity-initialization only; existing browser source paths remain frozen. Initial startup regressions freshly RED7 then GREEN94/814 plus actual two-process first-opener RED/GREEN; final combined gates will rerun after these additional fixes and next Clio snapshot restack.

Completed all six actual Codex findings from fdc02c09: key/parent and ceremony checkpoint reopen fences; serialized first initialization with EEXIST-only ledger recovery; pure grant transition with current transaction authority; native async delay; durable three-attempt PGP reservation before crypto. Actual startup RED7, native concurrent-open RED1, behavioral PGP RED10 (separate initial harness parse error disclosed). Final combined immutable690 kernel:102tests864assertions, releases124files each0warnings, kondo0/0, boundary clean, compiled TCP/restart consumer plus native two-process test green. Ambiguous surviving-private-state/missing-ledger initialization remains explicit fail-closed, never reset. Existing frozen browser worktrees unchanged; publishing this tested successor for actual review.

---