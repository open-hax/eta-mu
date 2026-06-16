---
uuid: "output-contract-gate-cljs-rewrite-infra-artifacts"
title: "Output Contract Gate CLJS Rewrite — Artifact Infra"
status: "blocked"
priority: P2
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 4
category: tasks
---

# Output Contract Gate CLJS Rewrite — Artifact Infra

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 4

## Purpose

Port artifact writing from `src/artifacts.ts` into `eta_mu.gate.infra.*` using the extern adapters.

## Deliverables

- `eta_mu.gate.infra.artifacts.run`: write run bundle (input.json, contract.edn, candidate.md, validation-report.json, final-decision.json, repair-prompt.txt).
- `eta_mu.gate.infra.artifacts.review`: append review report to an existing bundle.
- `eta_mu.gate.infra.artifacts.generation`: write task.txt and generation-report.json.
- `eta_mu.gate.infra.artifacts.repair`: write per-attempt repair candidate, report, and prompt files.
- Bundle directory naming and hash fields preserved.

## Verification gate

- [ ] Run artifact bundle contains all files expected by `cli.test.ts`.
- [ ] Review artifacts merge into `final-decision.json` without overwriting prior fields.
- [ ] Generation artifacts include `task.txt` and `generation-report.json`.
- [ ] Repair attempt artifacts match the per-attempt structure in `cli.test.ts`.
- [ ] All file I/O goes through `extern.fs`.

---

> Blocked by `output-contract-gate-cljs-rewrite-extern-adapters`: artifact writing depends on the FS/crypto/EDN extern adapters.
