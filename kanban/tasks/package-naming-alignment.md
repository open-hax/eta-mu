---
uuid: "package-naming-alignment"
title: "Package Naming Alignment — folder = npm name, one scope"
status: "ready"
priority: "P1"
labels: ["tasks", "naming", "monorepo", "3sp"]
created_at: "2026-07-15T00:00:00Z"
source: "user-request:2026-07-15"
points: 3
category: "tasks"
---

# Package Naming Alignment — folder = npm name, one scope

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Motivation: folder names diverging from `package.json` names caused real
> confusion during the rewrite (maintainer, 2026-07-15).

## Purpose

Make every workspace folder name match its `package.json` name (modulo scope),
and consolidate on a single npm scope, so the board, docs, and `pnpm --filter`
invocations stop needing a mental translation table.

## Current mismatches (2026-07-15 inventory)

| Folder | npm name | Note |
|---|---|---|
| `packages/runtime` | `@open-hax/eta-mu-runtime` | rename folder or package |
| `packages/e2e` | `@open-hax/eta-mu-e2e` | |
| `packages/extensions` | `@open-hax/eta-mu-extensions` | split into `extension-core` + `extension-*` already planned |
| `packages/protocols` | `@open-hax/openplanner-protocols` | inherited name from openplanner |
| `packages/Rheos` | `@open-hax/rheos` | case mismatch; lowercase the folder |
| `packages/legacy/agent` | `@open-hax/eta-mu-agent-core` | frozen; dies with legacy retirement |
| `packages/legacy/ai` | `@open-hax/eta-mu-ai` | frozen |
| `packages/legacy/coding-agent` | `@open-hax/eta-mu-cli` | frozen; bins collide with new `eta-mu` (`eta-mu`, `pi`) |
| `packages/legacy/kanban` | `@open-hax/kanban-legacy` | frozen |
| `packages/legacy/publication-components` | `@open-hax/garden-publication-components` | frozen |
| scope split | `@eta-mu/*` (turn-processor, terminal-ui, tsconfig, contracts-output) vs `@open-hax/*` (everything else) vs unscoped `eta-mu` | pick one |

## Definition of done

- [ ] A decision comment on this card fixes: (a) the canonical scope,
      (b) folder-rename vs package-rename per mismatch row.
- [ ] Non-legacy folders match their package names (legacy rows are excluded;
      they retire via `coding-agent-cljs-rewrite-cutover-ratchet`).
- [ ] `pnpm install` + root `pnpm test` green after renames; CI workflow paths
      and docs references updated in the same PR.
- [ ] The bin collision between `packages/legacy/coding-agent` and
      `packages/eta-mu` (`eta-mu`, `pi`) is resolved or explicitly recorded as
      accepted-until-legacy-retirement.

## Open questions

- Which scope wins: `@eta-mu/*` (matches the product), `@open-hax/*` (matches
  the org), with the CLI staying unscoped `eta-mu`?
- Rename `packages/runtime` folder to `eta-mu-runtime`, or rename the package
  to `@eta-mu/runtime`? (Its `eta_mu.coding.*` namespaces may merge into
  `packages/eta-mu` anyway — see epic open questions.)

## Verification

```bash
pnpm install
pnpm test
node -e "const fs=require('fs');..." # folder-vs-name audit script, to be added
```

---
2026-07-15 maintainer decisions — both open questions on this card are resolved: (1) SCOPE: @eta-mu/* for the product family; the CLI stays unscoped eta-mu. Non-product org packages (sol, Rheos, chat-ui, protocols, kanban-orchestrator...) keep @open-hax. (2) packages/runtime: dissolved, not renamed — see kanban/tasks/dissolve-runtime-package.md; strike its row from this card's table. Additional naming law from the epic decision record: folder name == npm name (minus scope); banned words in package/namespace names: runtime, core, utils, agent (the user-facing 'eta-mu agent' command is the one exception). Remaining execution scope here: rename packages/e2e -> match its name (or rename package to @eta-mu/e2e), lowercase packages/Rheos -> packages/rheos, decide protocols' name, and resolve the eta-mu/pi bin collision row. Legacy rows still retire via the Legacy Retirement card. Moving to ready.
---
