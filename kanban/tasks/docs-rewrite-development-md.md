---
uuid: "docs-rewrite-development-md"
title: "Rewrite DEVELOPMENT.md for the current ClojureScript stack"
status: icebox
priority: "P1"
labels: ["docs", "development", "onboarding", "3sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 3
category: "tasks"
---
# Rewrite DEVELOPMENT.md for the current ClojureScript stack

## Context

`DEVELOPMENT.md` still describes a non-existent `services/agentd` Fastify backend, frontend on `:8700`, backend on `:8787`, and `npx shadow-cljs compile app`. The actual monorepo is ClojureScript-first with packages such as Rheos, sol, katamorph, runtime, event-ledger, and chat-ui.

## Findings

- References `services/agentd/.env.example`, `REPO_PATH`, `REPO_SLUG`, and `pnpm dev` for agentd — none of which exist.
- Architecture section describes a Reagent/WebSocket agentd backend that is not present.
- Does not explain how to install, build, test, or develop the real CLJS packages.

## Acceptance

- [ ] Remove all `services/agentd` references.
- [ ] Document the real onboarding flow: `pnpm install`, `pnpm build`, `pnpm test`, `pnpm dev` (Rheos watch), and per-package commands.
- [ ] Add a short guide for shadow-cljs workflows (`bb watch`, `pnpm --filter <pkg> test`, `pnpm --filter <pkg> cljs:verify`).
- [ ] Document how to target common packages: Rheos, sol, runtime, chat-ui, extensions, event-ledger.
- [ ] Link to `AGENTS.md` for ClojureScript construction order and namespace conventions.
