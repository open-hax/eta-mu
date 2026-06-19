# Contract Model

Distilled design intent for the eta-mu contract DSL — the EDN vocabulary that
declares *who* an agent is, *what* may trigger it, *what* it may do, and *what
counts as success*.

This is a **design-intent** document promoted from working notes
([2026.04.19.08.47.39](../notes/2026.04.19.08.47.39.md),
[2026.04.19.08.56.22](../notes/2026.04.19.08.56.22.md),
[2026.04.19.08.44.04](../notes/2026.04.19.08.44.04.md)). It describes the target
shape, not a guaranteed-current implementation. The runtime that loads and
enforces these contracts lives in the `contract-runtime` /
`contract-runtime-v2` extensions
(`packages/extensions/src/eta_mu/extensions/contract_runtime.cljs`,
`contract_runtime_v2.cljs`); treat that source as ground truth where it differs.

## Core idea

Contracts are **data, not code**. Each is an EDN map with a `:contract/kind` and
a `:contract/id`. Contracts compose by reference through `:contract/uses`. The
runtime is the interpreter; the contracts are the program. This is the same
"data-as-interpreter" stance as katamorph resources.

## Contract kinds

| Kind | Role |
|------|------|
| `:capability` | A named bundle of tools (+ default config) that makes a class of work *possible*. Grants access. |
| `:policy` | Fine-grained constraints on *how* a held capability is used. Narrows, never grants. |
| `:role` | First-class identity record carrying a default system prompt and capability set. |
| `:intent` | Pre-execution gate. Fires after the trigger, before the run; must return truthy or the run is skipped. Defaults to true. |
| `:fulfillment` | Post-execution gate. Decides whether the turn counted as success. |
| `:trigger` | What causes a contract to fire (e.g. an event kind). |
| `:agent` | Binds an actor + roles + model + prompts + the contracts above into a runnable episode. |

Plus an **actor** template (`:actor/kind` ∈ `:human :agent :service :cron`) that
agent contracts instantiate.

## Capability vs. policy (the load-bearing distinction)

- **Capability grants.** If an actor lacks a capability, no policy is needed to
  stop it — absence of the capability is the lock.
- **Policy narrows.** A policy is the deadbolt *inside* a door you are already
  allowed through. It can only restrict use of a capability already held.

```clojure
;; capability — makes work possible
{:capability/id    :cap/send-messages
 :capability/doc   "Compose and deliver messages to a channel."
 :capability/tools [{:name "discord" :ops ["send-message" "edit-message"]}]}

;; policy — narrows a held capability, never grants
{:contract/id   "policy.discord.max-500-chars"
 :contract/kind :policy
 :contract/doc  "Messages must not exceed 500 chars."
 :policy/checks [{:expr '(<= (count message-text) 500)
                  :rationale "Message too long."}]}
```

## Intent and fulfillment (the two gates)

An **intent** is the inverse of a fulfillment: it runs *before* the actor
engages. Both return a normalized `{:proceed?/:fulfilled bool, :rationale
string}` shape so a verdict always carries its reason.

A **fulfillment** has two modes, and the default is **deterministic**, not an
LLM judge:

- **Deterministic (`:expr`)** — a whitelisted expression evaluated against the
  run context (e.g. "does the receipt reference a stored finding with non-empty
  evidence?"). Most checks the notes describe are deterministically checkable
  via the `ctx` map and the receipt ledger.
- **Judge** — an explicit inline/anonymous judge actor with `:prompts`, for
  genuinely subjective checks ("did the room laugh?").

```clojure
{:contract/id      "fulfillment.pr-ingested"
 :contract/kind    :fulfillment
 :fulfillment/mode :strict
 :fulfillment/check {:expr '(some? (lookup-finding ctx {:kind :github/pr
                                                        :evidence? true}))}}
```

## Composition and resolution rules

- Contracts compose via `:contract/uses` — an agent contract pulls in its
  trigger, policies, intents, and fulfillments by id.
- **Scope.** A contract at `foo/CONTRACT.edn` is implicitly in play for actions
  on `foo/bar`, but not for actions in an unrelated `baz/` subtree unless it says
  so. This implies a *tree* of contracts.
- **Collision.** When two contracts declare the same `:*/id`, the one nearest
  the runtime's current execution context wins (first encountered walking out
  from the current location).
- Agent-run overrides are additive/scoped to the run: `:additional-roles`
  appends, `:roles-override` replaces, for that episode only.

## Constitutional layer (`PRINCIPLE.edn`)

The bootstrap copies a base constitution to `PRINCIPLE.edn`. Once it exists,
bootstrap should be **skipped**, not silently overwritten. Actors may *append*
component records and may *disable* components, but may **not** delete
components of the principle contract. (The notes flag a bug in an early
`bootstrap-principle!` that overwrote edits or no-op'd on any `:disabled`
section instead of merging — see
[2026.04.19.08.56.22](../notes/2026.04.19.08.56.22.md).)

## Open gaps recorded in the notes

- The `:trigger` record was never fully specified alongside the other kinds.
- Skill contracts (from session-mycology) need to speak the v1 contract spec:
  their `fulfillment-score` should generalize to a real fulfillment contract,
  and their intent section should become an enforceable precondition.
- Verify the v2 runtime actually defines the `:intent` contract type — the notes
  observe it was missing at the time of writing.
