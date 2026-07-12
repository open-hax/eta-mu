---
uuid: "opencode-compat"
title: "Opencode-Compatible API on Sol"
status: icebox
priority: "P1"
labels: ["epics", "cljs", "opencode", "api-compat", "sol"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 21
category: "epics"
---
# Opencode-Compatible API on Sol

## Purpose

Sol exposes an opencode-compatible REST API. Map the 78-operation OpenAPI surface onto sol's internal agent API.

## Phase 1: Core session ops

| Opencode | Sol internal |
|---|---|
| session.create/list/get/delete | knoxx_threads CRUD |
| session.prompt/prompt_async | Agent turn start |
| session.messages | Run message history |
| session.abort | Abort turn |
| session.status | Run status |

## Phase 2: Provider + global

| Opencode | Sol internal |
|---|---|
| global.health | Sol health |
| global.event (SSE) | Realtime WS/SSE |
| provider.list | Proxx model list |

## Constraints

- All code in CLJS
- Sol is the host
- Wire compatibility via `@opencode-ai/sdk` types
- Stubbed endpoints return proper 501

---
## QA Review (2026-06-12)

### Sub-agent findings
- **Not started.** Status is `incoming`. Zero CLJS implementation.
- Reference TypeScript scaffold exists at `orgs/reference/anomalyco/opencode-compat/` (~35 routes)
- Upstream `@opencode-ai/sdk` has 100 operations (not 78 as stated in epic)
- Reference implements ~35 of 100 operations (stub only, no real inference)

### Self-verification
- Confirmed `packages/sol/` does not exist (primary dependency)
- Confirmed reference scaffold exists with Fastify + TypeScript + Zod
- Confirmed zero git commits related to opencode-compat

### Gaps
- **No acceptance criteria.** Epic has zero `[ ]` checkboxes.
- Operation count mismatch: epic says 78, upstream has 100
- Reference scaffold is TypeScript but epic requires CLJS
- Blocked on sol-extraction (34 points, not started)

### Recommendation
Draft coverage matrix: 100 upstream ops vs 35 reference routes. Tag each as implemented/stubbed/missing. Do not start until sol reaches `in_progress`.

Board audit 2026-07-11 — moved to ready. sol-extraction is done; packages/sol/ has OpenAI-compat /v1/* surface. Primary blocker (sol existence) resolved. Ready to implement.
---
