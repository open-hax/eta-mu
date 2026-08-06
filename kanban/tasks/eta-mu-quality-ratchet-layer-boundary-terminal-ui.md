---
category: "tasks"
labels: ["tasks", "quality", "lint", "layers", "terminal-ui", "1sp"]
points: "1"
source: "kanban/epics/eta-mu-quality-ratchet.md"
title: "Layer Boundary Ratchet — terminal-ui"
priority: "P2"
status: "icebox"
uuid: "eta-mu-quality-ratchet-layer-boundary-terminal-ui"
created_at: "2026-07-31T00:00:00Z"
---

# Layer Boundary Ratchet — terminal-ui

> Parent epic: `kanban/epics/eta-mu-quality-ratchet.md`
> Points: 1

## Purpose

Clear the single `:layer-boundary/*` finding in `packages/terminal-ui` and raise both
linters to `:error`. Smallest slice in the ratchet and a good first one to land, because it
proves the per-package `:error` mechanism end to end at almost no cost.

## Findings (1)

- [ ] `src/cljs/eta_mu/terminal_ui/shape/text_utils.cljs` — host require
      `"get-east-asian-width"`.

A `shape.*` namespace requiring a host module. Shape is meant to be pure structure, one
layer below `extern.*` where foreign data is decoded.

## Scope

Two defensible repairs — pick based on what `text_utils` actually does with the import:

1. **Wrap it in `extern.*`** if the width lookup is genuinely foreign data being decoded,
   and have `shape.text-utils` take the resolved widths as input.
2. **Silence it with `:config-in-ns`** if this is judged a legitimate exception — a pure,
   synchronous, data-only table lookup with no effects. Record the reason in the namespace.

Option 1 is the default. Option 2 is available but must be argued, not assumed.

## Work items

- [ ] Decide between the extern wrap and a documented `:config-in-ns` exception.
- [ ] Apply it.
- [ ] Raise both linters to `:error` in `packages/terminal-ui/.clj-kondo/config.edn`.

## Acceptance criteria

- [ ] `pnpm -C packages/terminal-ui lint:kondo` reports zero `:layer-boundary/*` findings.
- [ ] `packages/terminal-ui/.clj-kondo/config.edn` sets both linters to `:error`.
- [ ] If `:config-in-ns` was used, the namespace carries a comment saying why.
- [ ] The terminal-ui suite stays green.

## Verification

```bash
pnpm -C packages/terminal-ui lint:kondo
pnpm -C packages/terminal-ui test
```

The ratchet, added to `packages/terminal-ui/.clj-kondo/config.edn`:

```clojure
:linters {:layer-boundary/upward-require {:level :error}
          :layer-boundary/host-require {:level :error}}
```
