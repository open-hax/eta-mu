---
category: "tasks"
labels: ["tasks", "cljs", "katamorph", "contracts", "providers", "2sp"]
write-id: "1784490187445-0.flezs7s09je2x2ysxrf"
points: "2"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Katamorph — ProviderContract as a First-Class Kind (v0.2.0)"
priority: "P1"
status: "done"
uuid: "katamorph-provider-contract"
created_at: "2026-07-19T00:00:00Z"
---

# Katamorph — ProviderContract as a First-Class Kind (v0.2.0)

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`
> Target repo: `/home/err/spaces/katamorph` (standalone, work happens there;
> this card tracks it on the eta-mu board).

## Purpose

The stated intent is that katamorph describes "models, providers,
capabilities" — but provider today is only a keyword *field*
(`:model/provider`, `:model-family/provider`, `:source/provider`), not a
contract kind. Consumers therefore keep provider config as env vars and
plain maps (sol: `KNOXX_*` env in `domain/models.cljs` `enrich-config`,
hardcoded `"proxx"` default, base-url/auth from settings). Add
`ProviderContract` so a provider is declared as data.

## Scope

- New `ProviderContract` in `katamorph.schema`, registered as `:provider`
  with id key `:provider/id` (add to `manifest.cljs` `kind-id-keys`).
  Fields (draft — refine against sol's actual needs in
  `infra/agent/provider.cljs` and `domain/models.cljs`):
  `:provider/id` (keyword), `:provider/label`, `:provider/base-url`,
  `:provider/auth` (mode + env-var name, never a secret value),
  `:provider/models-endpoint` (e.g. `/v1/models`),
  `:provider/model-prefix-allowlist` (vector string, optional),
  `:provider/api-shape` (enum, e.g. `:openai-chat`).
- Cross-reference: `:model/provider` should be documentable as a ref to a
  `:provider/id`.
- Tests mirroring the existing per-kind schema tests.
- Tag `v0.2.0`, push. Coordinate the tag with any schema fixes surfaced by
  `sol-katamorph-schema-cutover` so both land in one version bump.

## Definition of done

- [ ] `:provider` kind validates in `katamorph.schema` with tests green
      (standalone `shadow-cljs compile test` → `dist/test.cjs`, 0 failures).
- [ ] `manifest.cljs` grammar recognizes `:provider/id` registrations.
- [ ] `v0.2.0` tagged and pushed; consumption coordinates (`:git/tag` +
      `:git/sha`) recorded in a comment on this card.
- [ ] Follow-up noted: sol consumes `ProviderContract` for its proxx config
      (may be folded into `sol-katamorph-schema-cutover` or a new 1sp card).

## Verification

```bash
cd /home/err/spaces/katamorph && npx shadow-cljs compile test && node dist/test.cjs
git -C /home/err/spaces/katamorph tag --list 'v0.2.0'
```

---
DONE 2026-07-19, shipped in the same katamorph v0.2.0 bump as the sol schema cutover (as this card's coordination note intended). Consumption coordinates: io.github.open-hax/katamorph {:git/tag "v0.2.0" :git/sha "305a5e49d834aca27566f739e8510f6b409fda78"}. Delivered: ProviderContract registered as :provider (provider/id, label, base-url, api-shape enum [:openai-chat :openai-responses :anthropic-messages], auth map with mode enum + env-var NAME (never secret values), models-endpoint, model-prefix-allowlist); manifest.cljs kind-id-keys gained [:provider :provider/id] (+ [:mcp-server :mcp-server/id]); structural inference on :provider/id; schema tests for valid/invalid provider contracts. Standalone gates: 111 tests/273 assertions 0 fail, kondo 0/0. sol deps.edn already pinned to v0.2.0 and the contract-kinds shim maps a future "providers" contract-class -> :provider. Follow-up DoD item carded: sol-provider-contract-consumption (P2, 1sp, ready) — sol's proxx config reads the contract, env as override.
---