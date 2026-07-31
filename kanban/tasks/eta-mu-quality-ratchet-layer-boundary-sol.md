---
category: "tasks"
labels: ["tasks", "quality", "lint", "layers", "sol", "8sp"]
points: "8"
source: "kanban/epics/eta-mu-quality-ratchet.md"
title: "Layer Boundary Ratchet — sol"
priority: "P1"
status: "icebox"
uuid: "eta-mu-quality-ratchet-layer-boundary-sol"
created_at: "2026-07-31T00:00:00Z"
---

# Layer Boundary Ratchet — sol

> Parent epic: `kanban/epics/eta-mu-quality-ratchet.md`
> Points: 8

## Purpose

Clear the 17 `:layer-boundary/*` findings in `packages/sol` — the largest concentration in
the repo, 63% of the 27 total — so the package can raise both linters from `:info` to
`:error`.

## Findings (17)

### The `domain/node/*` family — a misplaced extern layer (9)

`open-hax.sol.domain.node.*` is a set of thin host wrappers that happen to live in
`domain.*`. This is the dominant sub-move: the namespaces are not wrong, their address is.
Relocating the family to `extern.node.*` clears 9 of the 17 findings in one rename.

- [ ] `domain/node/fs.cljs` — `"node:fs"`, `"node:fs/promises"`, `"node:path"` (3)
- [ ] `domain/node/path.cljs` — `"node:path"`, `"node:process"` (2)
- [ ] `domain/node/crypto.cljs` — `"node:crypto"` (1)
- [ ] `domain/contracts/loader.cljs` — `"node:fs"`, `"node:fs/promises"`, `"node:path"` (3)

### `domain/realtime.cljs` — host requires (4)

- [ ] `"node:child_process"`
- [ ] `"node:crypto"`
- [ ] `"node:os"`
- [ ] `"node:util"`

Four host modules in one domain namespace suggests `realtime` is an orchestrator wearing a
domain name, not a decision surface. Audit before relocating.

### Upward requires (4)

- [ ] `domain/text.cljs` — requires `open-hax.sol.infra.http` (upward)
- [ ] `domain/agent/agent_templates.cljs` — requires `open-hax.sol.infra.config` (upward)
- [ ] `domain/agent/agent_templates.cljs` — requires `open-hax.sol.infra.defaults` (upward)
- [ ] `domain/contracts/client.cljs` — requires `open-hax.sol.extern.fetch` (`domain → extern`)

## Scope

- Prefer relocation over rewriting. Most of these are correctly-written namespaces sitting
  at the wrong address; moving them is lower risk than restructuring them.
- `agent_templates` reaching for `infra.config`/`infra.defaults` is configuration being read
  at decision time. The usual repair is to pass the resolved config in as an argument.
- Do this in reviewable slices rather than one commit: the `node/*` rename, then `realtime`,
  then the four upward requires.

## Work items

- [ ] Relocate the `domain/node/*` family and update every consumer's `:require`.
- [ ] Audit and repair `domain/realtime.cljs`.
- [ ] Clear the four upward requires.
- [ ] Raise both linters to `:error` in `packages/sol/.clj-kondo/config.edn`.
- [ ] Confirm no finding was silenced with `:config-in-ns` instead of fixed.

## Acceptance criteria

- [ ] `pnpm -C packages/sol lint:kondo` reports zero `:layer-boundary/*` findings.
- [ ] `packages/sol/.clj-kondo/config.edn` sets both linters to `:error`.
- [ ] The sol suite stays green.
- [ ] No behavior change — placement only.

## Verification

```bash
pnpm -C packages/sol lint:kondo
pnpm -C packages/sol test
```

The ratchet, added to `packages/sol/.clj-kondo/config.edn`:

```clojure
:linters {:layer-boundary/upward-require {:level :error}
          :layer-boundary/host-require {:level :error}}
```

## Notes

- Sequence this against the open `Sol — Provider Swap and Legacy Dependency Drop` and
  `Sol Cutover Verification and Cutover-Ratchet Unblock` cards. A namespace rename across
  `domain/node/*` will conflict loudly with anything else touching sol's requires.
- 8 points is a size estimate on a card that has not been through Breakdown. If picked up,
  split it along the three slices above first.
