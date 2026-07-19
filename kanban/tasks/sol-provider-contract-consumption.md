---
category: "tasks"
labels: ["tasks", "cljs", "sol", "katamorph", "providers", "1sp"]
write-id: "1784490842777-0.l2eovaj45flu6mj41m"
points: "1"
source: "kanban/tasks/katamorph-provider-contract.md"
title: "Sol — consume ProviderContract for proxx provider config"
priority: "P2"
status: "done"
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

---
DONE 2026-07-19. Sol's proxx provider config now resolves contract-first with explicit-env override: enrich-config loads the :provider contract (katamorph ProviderContract via the contract-kinds shim) and derives :proxx-base-url, :proxx-models-endpoint, :proxx-auth-token (read from the contract-NAMED env var, e.g. :auth/env), and :model-prefix-allowlist — an explicitly SET env var (PROXX_BASE_URL / PROXX_AUTH_TOKEN / KNOXX_MODEL_PREFIX_ALLOWLIST) still wins, and with no provider contract present behavior is byte-identical to before (regression-tested). Loader gained the providers contract class (class order, normalize aliases, structural inference on :provider/id); provider-settings-map emits the contract-named apiKey env var into models.json; proxx-models-url honors a contract-declared endpoint path. Fixture: test/fixtures/provider-contracts/providers/proxx.edn. Tests: 4 new deftests with env save/restore isolation (contract-drives-config, env-overrides-contract, absent-contract-unchanged, models.json apiKey rename). Gates: sol test 97/368 0 fail, kondo 0/0 + contract-guard OK, build 171 files 0 warn.
---