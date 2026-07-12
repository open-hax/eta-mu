---
uuid: "docs-fix-axxium-readme"
title: "Reconcile packages/axxium README with implemented surface and add to root docs"
status: icebox
priority: "P1"
labels: ["docs", "axxium", "identity", "3sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 3
category: "tasks"
---
# Reconcile packages/axxium README with implemented surface and add to root docs

## Context

`packages/axxium` is an active ClojureScript identity/auth server but is omitted from the top-level README. Its README overstates implemented surface (OAuth provider, full entity registry) and uses npm commands instead of pnpm.

## Findings

- Top-level README does not mention `packages/axxium`.
- `packages/axxium/README.md` advertises an "OAuth provider" and full "Entity registry" but only password auth, JWT/cookie sessions, and a single entity read endpoint are implemented.
- Portal is described but is only a static landing page.
- `docs/cljs-runtime-rewrite-architecture-inventory.md` misclassifies axxium as a "mixed TS/CLJS utility" despite being all CLJS.
- Kernel specs (`axxium-kernel-spec.md`, `axxium-kernel-spec-v2.md`) describe receipts/contracts/truth primitives not reflected in source.
- `bcrypt` vs `bcryptjs` dependency mismatch is undocumented.
- `boundary:check` reports 56 violations but README gives no guidance.
- No test files exist despite a `test` script in `package.json`.

## Acceptance

- [ ] Add `packages/axxium` to the top-level README Layout section.
- [ ] Rewrite `packages/axxium/README.md` to reflect implemented surface, use pnpm commands, document boundary policy and current violations, and note the test gap.
- [ ] Update `docs/cljs-runtime-rewrite-architecture-inventory.md` to classify axxium correctly as a CLJS-first auth/identity server.
- [ ] Add a spec-to-code reconciliation note to the kernel specs clarifying which concepts are implemented vs aspirational.
