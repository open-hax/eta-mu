---
category: "epics"
labels: ["epics", "cljs", "katamorph", "contracts", "sol", "muse", "architecture"]
write-id: "1784490211895-0.ndi3b15svrdy5gejb"
points: "12"
source: "grok-intention:2026-07-19"
title: "Katamorph as Enforced Canon — Contract Cutover"
priority: "P0"
status: "breakdown"
uuid: "katamorph-canonical-cutover"
created_at: "2026-07-19T00:00:00Z"
---

# Katamorph as Enforced Canon — Contract Cutover

> User directive 2026-07-19: the intended architecture is **one contract
> language, many interpreters** — katamorph describes the EDN contracts
> (models, providers, capabilities, agents, policies) and every system
> (knoxx, sol, muse, rheos, eta-mu CLI) interprets that data. The extraction
> to a standalone repo succeeded; **adoption never happened** and was never
> carded. This epic is the missing cutover.

## Findings (four-repo survey, 2026-07-19)

The same contract schema set exists in 4+ places, none deferring to katamorph:

| Copy | Status |
|---|---|
| `katamorph.schema` (standalone, v0.1.0) | The intended canon. Consumed by nobody for contracts. |
| knoxx `open-hax.contracts.schema` | Byte-identical lineage (katamorph was extracted from it); never cut over. |
| sol `law/contracts.cljs` | Local reimplementation, already drifted (omits PolicyGate/Fulfillment/Strategy/Store). |
| muse `dsl/schema.cljc` | Own capability/tool/plugin schemas; katamorph dep declared in deps.edn, required nowhere. |
| eta-mu `extensions/contract_runtime_v2` | Fifth runtime; docs/design/contract-model.md calls it ground truth. |

sol requires katamorph today only for `katamorph.agent.*` turn helpers.
Katamorph gap vs intent: **provider is a field on models, not a contract
kind**. Root cause of the drift: contract discipline is only load-bearing in
muse (build fails without the data pipeline); in sol/knoxx contracts are
optional config, so agents defined schemas in place. Fix = cutover + make it
enforceable, not more documentation.

## Task cards

1. `sol-katamorph-schema-cutover` (P0, 3sp) — sol validates via
   `katamorph.schema`; delete `sol/law/contracts.cljs`.
2. `katamorph-provider-contract` (P1, 2sp) — add `ProviderContract` kind to
   katamorph; tag v0.2.0. (Standalone repo work.)
3. `contract-redefinition-guard` (P1, 2sp) — CI/kondo enforcement: consumers
   may not redefine katamorph-owned schema names.
4. `capability-schema-reconciliation` (P2, 3sp) — reconcile muse capability
   vs katamorph `CapabilityContract`; blueprint is the iceboxed
   universal-agent-platform-dsl epic ("a capability is the primitive").
5. `event-ledger-envelope-truth` (P2, 2sp) — fix the event-ledger dist bug or
   descope the package to the envelope contract. (Standalone repo work.)
6. `knoxx-katamorph-cutover` (icebox) — knoxx cuts over last; reference
   implementation may lag.

## Acceptance criteria

- [ ] sol has no locally-defined duplicate of a katamorph-owned schema;
      contract validation flows through `katamorph.schema`.
- [ ] katamorph has a `ProviderContract` kind and a tagged release consumed
      by sol.
- [ ] A guard exists that fails a consumer's gate when it redefines a
      katamorph-owned schema name.
- [ ] A written decision reconciling the two capability shapes (muse vs
      katamorph), with follow-up cards if code moves.
- [ ] event-ledger either validates round-trip against its own documented
      indexes or is descoped to the envelope contract; muse's ANOMALY
      workaround has a path to retirement.

## Organization decisions recorded (not carded)

- eta-mu stays the cultivation chamber; sol/rheos graduate to standalone
  repos only when they stop churning.
- muse stays standalone (center of focus); it does not move into eta-mu.
- Contract repos (katamorph, event-ledger) stay standalone permanently.

---
Progress 2026-07-19: cards 1+2 DONE in one coordinated katamorph v0.2.0 bump (305a5e4, tagged+pushed). sol-katamorph-schema-cutover: sol/law/contracts.cljs deleted, validation flows through katamorph.schema via new law/contract_kinds.cljs shim (class-string->kind + lenient fallback + deprecated pipeline leftover), all fixtures regression-swept, gates green. katamorph-provider-contract: ProviderContract shipped; follow-up sol-provider-contract-consumption (P2 1sp) added to READY. Bonus: fixed latent katamorph bug — :policy validation always threw invalid-ref (unresolved :unified/policy ref). Epic acceptance criteria 1+2 now met. Next: contract-redefinition-guard (P1, ready) — the enforcement piece.
---