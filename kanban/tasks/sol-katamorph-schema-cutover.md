---
category: "tasks"
labels: ["tasks", "cljs", "sol", "katamorph", "contracts", "3sp"]
write-id: "1784490136608-0.brstyhdk7af8qh75wk4"
points: "3"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Sol — Validate Contracts via katamorph.schema (delete law/contracts.cljs)"
priority: "P0"
status: "done"
uuid: "sol-katamorph-schema-cutover"
created_at: "2026-07-19T00:00:00Z"
---

# Sol — Validate Contracts via katamorph.schema (delete law/contracts.cljs)

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`

## Purpose

`packages/sol/src/cljs/open_hax/sol/law/contracts.cljs` (~509 lines) is a
local reimplementation of `katamorph.schema` and has already drifted (omits
`PolicyGateContract`, `FulfillmentContract`, `StrategyContract`,
`StoreContract`, `NamespaceFile`, `PipelineContract` that katamorph carries).
katamorph is already a git-ref dep of sol (`deps.edn`, v0.1.0) and already
supplies sol's agent-turn helpers (`katamorph.agent.*`). Make it supply the
contract schemas too — sol becomes an *interpreter* of katamorph contracts,
not a second definition site.

## Scope

- Diff `open-hax.sol.law.contracts` against `katamorph.schema`
  (`/home/err/spaces/katamorph/src/cljs/katamorph/schema.cljs`). Record any
  sol-only additions or field-level divergence in a comment on this card
  before deleting anything.
- Genuinely sol-specific schemas (if any) stay in a small sol namespace that
  MERGES into katamorph's registry (katamorph `registry` map + `schema-for`
  dispatch) — extension, not duplication.
- Repoint `open-hax.sol.domain.contracts.loader` (and
  `domain/contracts/{roles,resolve}.cljs`) at katamorph's `schema-for` /
  `validate` / `infer-contract-class`.
- Delete `law/contracts.cljs`. Update tests that require it.
- If the diff surfaces schema fixes needed upstream, bump katamorph first
  (coordinate with `katamorph-provider-contract`, which also wants a
  v0.2.0 tag) and pin the new sha in sol's `deps.edn`.

## Definition of done

- [x] `git grep -l "sol.law.contracts" -- packages/sol` → 0 (namespace gone).
- [x] Contract validation in sol's loader flows through `katamorph.schema`;
      test fixtures under `test/fixtures/{contracts,model-contracts}/`
      still validate.
- [x] Any sol-only schemas live in a registry-merge namespace with a comment
      naming why they are not upstreamed.
- [x] Gates green: `pnpm --filter @eta-mu/sol test` and `lint:kondo`
      (0 errors / 0 warnings), no checks relaxed.

## Verification

```bash
pnpm --filter @eta-mu/sol test
pnpm --filter @eta-mu/sol lint:kondo
git grep -n "law.contracts\|law/contracts" -- packages/sol  # → 0 code hits
```

---
DIFF RECORD (pre-deletion, per scope): sol law/contracts.cljs vs katamorph.schema v0.1.0. Sol-only defs: McpServerContract, SourceModeContract, RuntimeFeatureContract, CmsContract, UiAction, PolicyCheck, wildcard-actor, deprecated Pipeline{Step,Contract}. Field divergences: ActorContract allowed :page actor kind; AgentSpec tolerated string roles/thinking; RoleContract/AgentContract prompts any-typed; AgentContract was the lenient fallback (any :contract/kind, actors as set|seq with wildcard, top-level actor fields, :ui/actions); PolicyContract was the flat knoxx dialect (invariant PolicyCheck maps, string id, no :policy/outcome) vs katamorph's proxx tree; SubAgentContract was the flat dialect (no :parent-agent, :sub-agent/* fields); CapabilityContract :cap/tools sequential vs vector. API divergence: sol dispatched on directory-class STRINGS with agent fallback; katamorph on kind KEYWORDS, throwing on unknown. RESOLUTION: everything except deprecated pipelines UPSTREAMED to katamorph v0.2.0 (305a5e49d834aca27566f739e8510f6b409fda78) as new kinds + dialect-tolerance merges; also fixed a latent katamorph bug (PolicyContract :policy/children [:ref :unified/policy] threw invalid-ref on every :policy validation — now self-contained local registry + regression test). Sol side: new law/contract_kinds.cljs = class-string->kind mapping + lenient fallback + deprecated PipelineContract (NOT katamorph-owned, marked do-not-upstream); loader repointed; law/contracts.cljs deleted; deps.edn pinned to v0.2.0.

VERIFIED 2026-07-19: sol test 92/293 0 fail (was 88/256; +4 new contract-kinds deftests sweeping ALL fixture contracts through katamorph — contracts/, hello-world-contracts/, model-contracts/ all validate; lenient fallback + invalid-fixture rejection locked by tests), lint:kondo 0/0, build 171 files 0 warn. git grep 'law.contracts|law/contracts' -- packages/sol -> 0 code hits. katamorph standalone: 111 tests/273 assertions 0 fail, kondo 0/0 (self-contained config replacing broken ../../kondo-config path). DoD met.

---
