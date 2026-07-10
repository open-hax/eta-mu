---
uuid: "docs-rewrite-top-level-readme"
title: "Rewrite top-level README.md to match actual monorepo"
status: "incoming"
priority: "P0"
labels: ["docs", "readme", "monorepo", "5sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 5
category: "tasks"
---

# Rewrite top-level README.md to match actual monorepo

## Context

The root `README.md` describes an aspirational package layout (`packages/eta-mu-extensions`, `packages/eta-mu-github`, `packages/eta-mu-docs`, `packages/eta-mu-truth`, `packages/eta-mu-runtime`, `packages/presence-core`, `packages/signal-*`, `packages/kanban`, `packages/opencode-reactant`, `services/agentd`, `services/eta-mu`, `pi/`, `shared/js/opencode-events`) that no longer exists in the repo. It also points to `spec/eta-mu-charter-v1.md`, but the charter lives at `kanban/eta-mu-charter-v1.md`.

## Findings

- Missing real packages: `packages/Rheos`, `packages/sol`, `packages/runtime`, `packages/chat-ui`, `packages/event-ledger`, `packages/extensions`, `packages/extensions-e2e`, `packages/kanban-orchestrator`, `packages/katamorph`, `packages/protocols`, `packages/mcp-contracts`, `packages/axxium`, `packages/kondo-config`.
- Wrong paths for legacy packages: `packages/eta-mu-github` is actually `packages/legacy/github`; `packages/kanban` is actually `packages/legacy/kanban` (`@open-hax/kanban-legacy`).
- Local commands reference non-existent packages (`pnpm --dir packages/eta-mu-runtime test`, `pnpm --dir packages/eta-mu-github test`, `pnpm --dir packages/eta-mu-docs test`, `pnpm --dir packages/kanban test`).
- The TypeScript deprecation section and `~/.ημ` symlink note are still accurate.

## Acceptance

- [ ] Replace Layout sections with the actual `packages/*` directory, grouping active CLJS packages, legacy TypeScript packages, and config/tooling packages.
- [ ] Fix the charter path to `kanban/eta-mu-charter-v1.md`.
- [ ] Update Local Commands to match `package.json` scripts and real package names.
- [ ] Add a short pointer to `docs/` and the current kanban board.
- [ ] Verify no references to deleted `services/`, `pi/`, or `shared/js/` paths remain.
