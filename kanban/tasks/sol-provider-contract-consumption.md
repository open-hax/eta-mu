---
category: "tasks"
labels: ["tasks", "cljs", "sol", "katamorph", "providers", "1sp"]
write-id: "1784490184674-0.u8xwg9udq1i2f1mj8wu"
points: "1"
source: "kanban/tasks/katamorph-provider-contract.md"
title: "Sol — consume ProviderContract for proxx provider config"
priority: "P2"
status: "ready"
uuid: "sol-provider-contract-consumption"
created_at: "2026-07-19T00:00:00Z"
---

# Sol — consume ProviderContract for proxx provider config

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`
> Follow-up carded from `katamorph-provider-contract` (v0.2.0 shipped the
> schema; sol already validates `providers/` contract dirs via the
> `contract-kinds` shim, but its runtime provider config is still env-driven).

## Purpose

Sol's provider gateway is plain env/config: hardcoded `"proxx"` default,
`KNOXX_*` env vars in `domain/models.cljs` `enrich-config`, base-url/auth
from `agent-settings/provider-auth`, and a hardcoded
`default-model-prefix-allowlist`. katamorph v0.2.0's `ProviderContract`
(`:provider/id`, `:provider/base-url`, `:provider/api-shape`,
`:provider/auth` with env-var *name*, `:provider/models-endpoint`,
`:provider/model-prefix-allowlist`) can express all of it as contract data.

## Scope

- Ship a `providers/proxx.edn` contract (in sol's contract tree / fixtures)
  carrying base-url default, `:openai-chat` shape, bearer auth env-var name,
  `/v1/models` endpoint, and the current prefix allowlist.
- `domain/models.cljs` + `infra/agent/provider.cljs` read the provider
  contract first, env vars as override — not the other way around.
- The hardcoded allowlist becomes the contract's
  `:provider/model-prefix-allowlist` (code keeps it only as last-resort
  default when no provider contract is loaded).

## Definition of done

- [ ] A `:provider` contract EDN exists and loads through the contract
      loader (validated by katamorph).
- [ ] `fetch-proxx-model-ids!` / `models-config` derive base-url, endpoint,
      auth env-var, and allowlist from the contract when present.
- [ ] Existing env-only deployments keep working (contract absent → current
      behavior; regression-tested).
- [ ] Sol gates green (test / lint:kondo, 0 warnings).