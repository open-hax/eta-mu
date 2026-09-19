---
category: "tasks"
dependency: []
type: "task"
write-id: "1789189650496-0.0fzv9duv8loky8hv9gum"
title: "Make Axxium the identity owner for local Wiki CMS"
priority: "P0"
status: "breakdown"
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