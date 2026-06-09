---
uuid: "opencode-compat"
title: "Opencode-Compatible API on Sol"
status: incoming
priority: P1
labels: ["epics", "cljs", "opencode", "api-compat", "sol"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 21
category: epics
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
