---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "2sp"]
write-id: "1783693256221-0.w389l0z79nebdtvpcs9"
points: "2"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Messages, Diagnostics & Output Guard"
priority: "P0"
status: "ready"
uuid: "coding-agent-cljs-rewrite-messages-diagnostics-law"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Messages, Diagnostics & Output Guard

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 2

## Purpose

Port the message formatting, diagnostics, and output-guard modules into pure CLJS domain/law namespaces.

## Scope

- `src/core/messages.ts` — user/assistant/system message formatting
- `src/core/diagnostics.ts` — diagnostic collection and reporting
- `src/core/output-guard.ts` — output contract enforcement
- `src/core/auth-guidance.ts` — auth guidance messages
- `src/core/source-info.ts` — source context construction
- `src/core/resolve-config-value.ts` — config value resolution

## Deliverables

- [ ] Malli schemas in `law.*` for message parts, diagnostics, and output guard results
- [ ] Pure `domain.*` functions for message assembly and diagnostic aggregation
- [ ] `shape.*` converters for existing TS DTOs
- [ ] Regression tests covering system prompt, assistant-message, user-message, and output-guard cases

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core acceptance. Once inventory is done, this pure domain/law slice can proceed independently of agent/ai/tui child epics and can run concurrently with other domain/law tasks.
---