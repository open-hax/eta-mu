---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "3sp"]
write-id: "1784332660628-0.gsqkge0hjb0iylp0lq"
points: "3"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Legacy Retirement"
priority: "P0"
status: "blocked"
uuid: "coding-agent-cljs-rewrite-cutover-ratchet"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Legacy Retirement (re-scoped from Cutover Ratchet)

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 3
> Re-scoped 2026-07-15; original scope preserved in the comment history below.

## Purpose

Absorb the remaining useful behavior of `packages/legacy/*` into the new CLJS
packages, then delete `packages/legacy/` in one final cleanup PR (per the
architecture inventory, 2026-07-08 update). The original in-place TS-module
replacement plan is void: the 2026-07-12 decision record dropped legacy
package/binary contract preservation and the monotonic TS-line-count ceremony.

## Scope

- Maintain a short "legacy value ledger": for each `packages/legacy/*` package,
  what behavior the new stack still lacks and which card owns porting it
  (reference behavior only — no TS interop).
- Delete each legacy package once its ledger rows are all owned-and-done or
  explicitly descoped.
- Resolve the bin collision: `packages/legacy/coding-agent` and
  `packages/eta-mu` both declare `eta-mu` and `pi` bins.
- Retire the TS-line-count baseline machinery (`scripts/ts-line-count.mjs`,
  `.ts-line-count-baseline`) when the last legacy package is deleted.

## Definition of done

- [ ] A legacy value ledger exists in this card or a linked doc, with one row
      per `packages/legacy/*` package: keep-porting (card link) / descoped
      (reason).
- [ ] `packages/legacy/` is deleted; `pnpm install` and root `pnpm test` green.
- [ ] Workspace configs, CI workflows, and docs no longer reference legacy
      paths or `@open-hax/eta-mu-cli`.
- [ ] TS-line-count guard retired.

## Blocked on

North-star parity cards for behavior the new stack still lacks: SSE streaming,
session persistence, full-screen terminal host, and the extensions/package-
manager scope decisions on the parent epic.

## Verification

```bash
pnpm install
pnpm test
git grep -l "packages/legacy" -- ':!kanban' ':!docs' | wc -l  # → 0
```

---
**Blocking assessment:** Blocked by all preceding implementation tasks: domain, extern, infra, and mode parity must be complete and tests passing before TS modules can be replaced safely.

Board triage 2026-07-15: re-scoped from 'in-place TS cutover ratchet' to 'legacy retirement'. The original premise (replace TS modules behind stable facades, monotonic line count, preserve @open-hax/eta-mu-cli binary contract) was voided by the 2026-07-12 decision record. New scope: legacy value ledger -> port-or-descope each remaining legacy behavior -> delete packages/legacy wholesale -> retire ts-line-count machinery. Stays blocked on the parity cards (SSE streaming, session persistence, terminal host) and the extensions/package-manager scope decisions on the parent epic.

NOTES FROM RUNTIME DISSOLUTION (wave 5, now done): legacy/github and legacy/coding-agent are build-green but gutted of their runtime-batch integration — cli.ts now parses the model reply directly into EtaMuAgentDecision (parseAgentDecision, lenient local fn); runtime-batch.ts + its test deleted; index.ts re-exports cleaned; coding-agent's --version surface-result call inlined. The action-batch control-plane flow (buildPlanningContext/draftBatch/parseActionBatch/publishActionBatch) died with packages/runtime — when this card's legacy value ledger is applied, those rows are already resolved. legacy/github's own vitest: 16 green.

LEGACY VALUE LEDGER (recovered from Claude session 9520e8cf Explore agent + verified against current tree): output-contract-gate=empty stub DELETED 2026-07-17; publication-components=no code consumers DELETED 2026-07-17; tui=consumers are legacy-internal (coding-agent), parity delivered via terminal-ui; agent=consumers are legacy-internal (coding-agent), parity delivered via turn-processor; coding-agent=SOL-DEP-CLEARED 2026-07-17 (was BLOCKED-BY-SOL on a packages/sol hard source dep: sol/extern/eta_mu.cljs + sol/infra/agent/mcp_tools.cljs imported @open-hax/eta-mu-cli; cleared by sol-provider-swap-legacy-drop — see the 2026-07-17 record below) + parity gaps (print/RPC modes, export-html, skills, slash-commands, themes, compaction, eta-mu-beta bin); ai=BLOCKED-BY-MULTI-PROVIDER (only OpenAI slice ported; OAuth+model-discovery+pi-ai bin lacking, ai-cljs-rewrite epic icebox); github=BLOCKED-BY-CI-MIGRATION (release-and-publish, review-resolution-gate, auto-merge, ensure-pr-to-staging workflows invoke legacy/github dev commands; replacement github-cljs-rewrite epic icebox); kanban=BLOCKED-BY-CI (kanban-sync.yml runs @open-hax/kanban-legacy sync github) + superseded by rheos+eta-mu kanban; docs=BLOCKED-BY-CI (staging-pr/main-pr-gate run packages/legacy/docs tests). EXECUTED 2026-07-17: bin collision resolved (legacy/coding-agent bins eta-mu+pi removed, new packages/eta-mu is sole owner; eta-mu-beta remains legacy-only); ts-line-count machinery retired (scripts/ts-line-count.mjs, pre-commit-ts-guard.sh, .ts-line-count-baseline, root ts:count scripts, hooks:install, AGENTS.md TS deprecation policy section, README/CLAUDE refs); stale e2e dep on eta-mu-cli removed. REMAINING for full DoD: wholesale deletion of packages/legacy awaits CI workflow migration (or explicit acceptance of those breaks) — the sol dependency that was also blocking it cleared on 2026-07-17, see the record below. pnpm install + root test green.

SOL DECOUPLING SCOPED 2026-07-17: new epic sol-turn-processor-cutover (kanban/epics/sol-turn-processor-cutover.md) with 6 task cards covering the full sol un-coupling: turn-processor session adapter (3sp), settings/model decoupling (2sp), MCP tool shape (1sp), provider swap + dependency drop (2sp), eta-mu sol command surface (2sp), cutover verification (1sp). When cards 1-4 land, sol is no longer a legacy/coding-agent consumer and this card's sol blocker clears (CI automation blockers remain).

SOL DECOUPLING LANDED 2026-07-17 (sol-provider-swap-legacy-drop): sol is no longer a legacy/coding-agent consumer. Legacy boundary deleted (extern/eta_mu.cljs, infra/agent/provider/eta_mu.cljs + legacy test stubs), @open-hax/eta-mu-cli dropped from packages/sol/package.json and shadow-cljs keep-as-import/resolve, provider swapped to open-hax.sol.infra.agent.provider.turn-processor over eta-mu.turn-processor.infra.loop + eta-mu.extern.openai. Gates: pnpm --filter @open-hax/sol test green (88 tests, 256 assertions), lint:kondo zero warnings, git grep eta-mu-cli -- packages/sol -> 0. The BLOCKED-BY-SOL ledger row on coding-agent clears; CI automation blockers (github/docs/kanban workflows) remain.

---