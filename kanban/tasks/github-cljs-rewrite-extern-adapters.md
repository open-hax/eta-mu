---
uuid: "github-cljs-rewrite-extern-adapters"
title: "GitHub CLJS Rewrite — Extern Adapters"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 4
category: "tasks"
---

# GitHub CLJS Rewrite — Extern Adapters

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/github.ts`, `src/config.ts`, `src/types.ts`
> Points: 4

## Purpose

Create the `extern.*` boundary layer for GitHub API calls, authentication, and config loading so raw JS interop is isolated from domain code.

## Scope

- Octokit / fetch-based GitHub client
- App/OAuth token retrieval and caching
- Config and environment adapters
- Raw response / error conversion to CLJS maps

## Work items

- [ ] Implement `eta_mu.github.extern.client` for authenticated GitHub requests.
- [ ] Implement `eta_mu.github.extern.config` for environment and file config.
- [ ] Implement `eta_mu.github.extern.error` for Octokit/fetch error normalization.
- [ ] Add conversion regression tests for each adapter.
- [ ] Run the boundary scanner and confirm no raw interop escapes `extern.*`.

## Acceptance criteria

- [ ] All GitHub API access flows through `extern.client`.
- [ ] All config access flows through `extern.config`.
- [ ] Adapter tests pass under the CLJS test target.
- [ ] Boundary scan reports zero violations outside `extern.*`.

## Verification

```bash
pnpm --dir packages/eta-mu-runtime cljs:boundary
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm --dir packages/eta-mu-runtime cljs:test
```

---
**Status note:** Blocked by `github-cljs-rewrite-inventory` (needs file/namespace mapping), `eta-mu-cljs-rewrite-boundary-adapters` (done), and `fetch-timeout-abort-controller` (epic says merge first; the fetch client adapter must incorporate the timeout).
---
