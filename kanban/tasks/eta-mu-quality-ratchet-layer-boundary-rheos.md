---
category: "tasks"
labels: ["tasks", "quality", "lint", "layers", "rheos", "3sp"]
points: "3"
source: "kanban/epics/eta-mu-quality-ratchet.md"
title: "Layer Boundary Ratchet — rheos"
priority: "P1"
status: "icebox"
uuid: "eta-mu-quality-ratchet-layer-boundary-rheos"
created_at: "2026-07-31T00:00:00Z"
---

# Layer Boundary Ratchet — rheos

> Parent epic: `kanban/epics/eta-mu-quality-ratchet.md`
> Points: 3

## Purpose

Clear the 8 `:layer-boundary/*` findings in `packages/rheos` so the package can raise
both linters from `:info` to `:error` and can no longer regress.

The linter landed in `packages/kondo-config` (`hooks/layer_boundaries.clj`) and reports
crossings of the `law.* → shape.* → extern.* → domain.* → infra.*` construction order at
the `:require` that causes them. It ships at `:info` repo-wide: findings print on every
lint run but never fail it. This task pays rheos's share and flips the gate shut.

## Findings (8)

Backend (3) — the smallest coherent first slice:

- [ ] `src/rheos/backend/law/fsm.cljs` — host require `"node:child_process"`.
      A `law.*` namespace shelling out is the most severe finding in the repo: law is
      supposed to be the layer with no world in it at all.
- [ ] `src/rheos/backend/domain/compose.cljs` — requires `rheos.backend.infra.task-store` (upward)
- [ ] `src/rheos/backend/domain/compose.cljs` — requires `rheos.backend.infra.ledger` (upward)

UI (5):

- [ ] `src/rheos/ui/domain/layout.cljs` — requires `rheos.ui.infra.api` (upward)
- [ ] `src/rheos/ui/domain/layout.cljs` — requires `rheos.ui.infra.ledger-stream` (upward)
- [ ] `src/rheos/ui/domain/orchestrator.cljs` — requires `rheos.ui.infra.chat-session` (upward)
- [ ] `src/rheos/ui/domain/sidebar.cljs` — host require `"marked"`
- [ ] `src/rheos/ui/domain/sidebar.cljs` — host require `"dompurify"`

## Scope

- The five `domain → infra` crossings follow the pattern already proven on this package in
  `56aa198`: the domain namespace returns a decision, a sibling `infra/` namespace performs
  it. `domain/compose.cljs` is the direct analogue of the `task-create` / `task-edit` /
  `transition` split.
- `sidebar.cljs`'s `marked` + `dompurify` are markdown/sanitize decoding — an `extern.*`
  adapter, not a domain concern.
- `law/fsm.cljs`'s `child_process` should be lifted out entirely rather than relocated;
  audit what it actually shells out for before choosing a home.

## Work items

- [ ] Clear the 3 backend findings and confirm the rheos suite stays green.
- [ ] Clear the 5 UI findings.
- [ ] Raise both linters to `:error` in `packages/rheos/.clj-kondo/config.edn`.
- [ ] Confirm no finding was silenced with `:config-in-ns` instead of fixed.

## Acceptance criteria

- [ ] `pnpm -C packages/rheos lint:kondo` reports zero `:layer-boundary/*` findings.
- [ ] `packages/rheos/.clj-kondo/config.edn` sets both linters to `:error`, so a
      reintroduced crossing fails the lint rather than printing.
- [ ] `pnpm -C packages/rheos test` stays green (82 tests / 246 assertions at time of writing).
- [ ] No behavior change — this is a placement task, not a redesign.

## Verification

```bash
pnpm -C packages/rheos lint:kondo
pnpm -C packages/rheos test
```

The ratchet, added to `packages/rheos/.clj-kondo/config.edn`:

```clojure
:linters {:layer-boundary/upward-require {:level :error}
          :layer-boundary/host-require {:level :error}}
```

## Notes

- `*-test` namespaces are exempt from the linter, which means a domain test that needs a
  filesystem will not be flagged. `test/rheos/backend/domain/compose_test.cljs` was flagged
  before the exemption was added and is a real signal about `domain/compose` regardless.
- Splitting this card into backend (3) and UI (5) is reasonable if it is picked up
  incrementally; the backend slice stands alone.
