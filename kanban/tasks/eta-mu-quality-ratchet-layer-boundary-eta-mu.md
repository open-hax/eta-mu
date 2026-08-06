---
category: "tasks"
labels: ["tasks", "quality", "lint", "layers", "eta-mu", "1sp"]
points: "1"
source: "kanban/epics/eta-mu-quality-ratchet.md"
title: "Layer Boundary Ratchet — eta-mu"
priority: "P2"
status: "icebox"
uuid: "eta-mu-quality-ratchet-layer-boundary-eta-mu"
created_at: "2026-07-31T00:00:00Z"
---

# Layer Boundary Ratchet — eta-mu

> Parent epic: `kanban/epics/eta-mu-quality-ratchet.md`
> Points: 1

## Purpose

Clear the single `:layer-boundary/*` finding in `packages/eta-mu` and raise both linters to
`:error`.

## Findings (1)

- [ ] `src/cljs/eta_mu/domain/session.cljs` — requires `eta-mu.extern.path`
      (`domain → extern`, upward).

The mildest crossing class in the repo: `extern.*` is only one layer below `domain.*`, and
`extern.path` is a decoder rather than an effect. It is still a crossing — `domain.*`
depends on `law`, `shape`, and its own layer, and nothing else.

## Scope

- Determine whether `session.cljs` needs path *decoding* (in which case the decoded value
  should be passed in by the caller) or path *manipulation* (in which case the helper likely
  belongs in `shape.*`, which `domain.*` may legally require).
- Small enough to land alongside the terminal-ui slice in a single PR if convenient.

## Work items

- [ ] Establish what `session.cljs` uses from `extern.path`.
- [ ] Move the dependency to `shape.*` or lift it to the caller.
- [ ] Raise both linters to `:error` in `packages/eta-mu/.clj-kondo/config.edn`.

## Acceptance criteria

- [ ] `pnpm -C packages/eta-mu lint:kondo` reports zero `:layer-boundary/*` findings.
- [ ] `packages/eta-mu/.clj-kondo/config.edn` sets both linters to `:error`.
- [ ] `pnpm -C packages/eta-mu test` stays green.
- [ ] No behavior change — placement only.

## Verification

```bash
pnpm -C packages/eta-mu lint:kondo
pnpm -C packages/eta-mu test
```

The ratchet, added to `packages/eta-mu/.clj-kondo/config.edn`:

```clojure
:linters {:layer-boundary/upward-require {:level :error}
          :layer-boundary/host-require {:level :error}}
```

## Notes

`packages/eta-mu` is the CLI users install. Once this slice is clean and gated, a layer
crossing can never silently ship in the package that everything else is reached through.
