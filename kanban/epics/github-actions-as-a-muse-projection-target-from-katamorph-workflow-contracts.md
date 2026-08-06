---
category: "epics"
labels: "katamorph, muse, workflow, dsl, ci, architecture"
type: "epic"
write-id: "1786058365805-0.72bw9h78mphf4dhxmtg"
points: "13"
title: "GitHub Actions as a Muse projection target from Katamorph workflow contracts"
priority: "P2"
status: "incoming"
uuid: "github-actions-as-a-muse-projection-target-from-katamorph-workflow-contracts"
created_at: "2026-08-06T21:29:00.829Z"
---

# GitHub Actions as a Muse projection target

## Outcome

`.github/workflows/*.yml` is a **generated projection** of EDN workflow
declarations, not hand-authored YAML. One action registry, one toolchain
vocabulary, and a single source for both CI and the local gate runner.

## Where this belongs — and it is not Katamorph's emitter

The instinct to base it in Katamorph is right for the **language** and wrong for
the **emitter**, and the repo already wrote down why. From
`muse/docs/design/contract-ownership-and-host-translation.md`:

```text
Katamorph contracts
  -> Muse assembly
  -> target-neutral resolved catalog
  -> Muse target projection
  -> host artifact or explicit incompatibility
```

Katamorph "does not read an application directory... or perform I/O". Muse
performs the Keryx role: *given lawful declarations and a target, produce a
validated host artifact or an explicit incompatibility.* The
`workflow-dsl-kanban-reference` epic already assigns "compilation of the same
portable declarations into external harness-native forms" to Muse.

So:

| Piece | Home |
|---|---|
| `WorkflowContract` and friends — the vocabulary | katamorph `schema.cljs` |
| Reference resolution, assembly | muse |
| `.github` emitter | muse, beside `shape/target/opencode.cljs` |
| Writing files, invoking the emitter | eta-mu / bb script |

## The gap this fills in Katamorph

`registry/resource.cljs` already advertises a workflow kind:

```clojure
{:id :registry/workflows :kind :workflow}
```

There is **no `WorkflowContract` in `schema.cljs`**. The registry offers a
resource class nothing defines. That hole is exactly what this epic fills, and
it is why the language half belongs upstream.

## Concept mapping — measured, not assumed

**Maps onto vocabulary that already exists:**

| GitHub | Katamorph |
|---|---|
| `on: push` / `pull_request` | `TriggerContract` — `:trigger/events`, `:trigger/condition`, `:trigger/with` |
| `on: schedule` cron | `ScheduleContract` — `:schedule/cron` is already a field |
| job / step | `ActionContract` — `:action/kind`, `:action/with` |
| `permissions:` | `CapabilityContract` — a GH permission *is* a capability grant, and `:cap/id` being a keyword gives `:contents/read` namespacing for free |
| `if:` expressions | `EvalNode` / `EvalOp` `#{:all :some :none :not :assert}` + `condition/registry` |
| required checks | `PolicyGateContract` — `:policy/match`, `:policy/action` |

**Needs new vocabulary — this is the honest part:**

- `needs:` — a job DAG. Katamorph has no dependency-ordering kind.
- `strategy` / matrix. **`StrategyContract` already exists and means something
  else** (`:policy/strategy` with `:policy/outcome [:= :try]` — a retry policy).
  A matrix kind must not reuse that name.
- `runs-on` / runner selection.
- step outputs and `$GITHUB_OUTPUT` data flow.
- `concurrency` groups.
- `workflow_call` inputs/secrets typing.
- `${{ }}` — irreducibly GitHub's. Carry it as an opaque string, do not model it.

## The payoff, measured on this repo today

23 workflows, 33 jobs, **274 steps** (130 `run`, 144 `uses`).

The same toolchain preamble is copy-pasted roughly ninety times:

```text
36  actions/checkout      18  pnpm/action-setup
23  actions/setup-node    16  actions/setup-java
20  actions/upload-artifact   8  DeLaGuardo/setup-clojure
```

And it has already drifted. **Eight actions carry more than one pin:**

```text
actions/checkout   5 distinct refs
    16x 11d5960a…   8x 93cb6efe…   5x v4   5x v6   2x d23441a4…
actions/setup-node 3 distinct refs
```

Floating tags (`v4`, `v6`) mixed with three different SHAs, in a repo where
`actions/permissions` reports `sha_pinning_required: false`. A registry with one
pin per action makes that state unrepresentable.

**The strongest argument is `scripts/ci-gates.bb`.** It mirrors the workflows by
hand so gates can run without CI, and it needed an `--audit` subcommand whose
only job is detecting drift between the mirror and the workflows. On its first
run `--audit` found the rheos gate missing five paths CI watches. If the gate
runner and the workflow were two projections of one declaration, that entire
class of drift — and the audit written to catch it — would not exist.

## Feasibility is proven, not assumed

A ~90-line Babashka probe reproduced `.github/workflows/main-pr-gate.yml` from
an EDN declaration plus an action registry. Semantic diff across all four jobs:
**empty**. The only difference was YAML 1.1 parsing bare `on:` as boolean
`true` — a footgun generation removes rather than inherits.

`clj-yaml` ships with bb, so the emitter needs no JVM and can run in CI.

## Risks that decide whether this is worth doing

- **Silent semantic loss is the failure mode.** Muse's rule already covers it:
  never drop unsupported semantics, emit an explicit incompatibility. A partial
  DSL that quietly omits a `permissions:` block is worse than the YAML.
- **A raw escape hatch is mandatory.** Something like `:github/raw` passing YAML
  through untouched, so the 10 % that does not map does not block the 90 %.
- **Generated files must be committed** — GitHub reads `.github/workflows` from
  the repo. That needs a CI check asserting generated == committed, which is the
  same tension `docs/cli.md` hit on #169 (test-checked, not generated).
- **Bootstrapping.** The workflow that regenerates workflows cannot itself be
  freshly generated; check it in and verify.
- **Debuggability.** A red job now needs mapping from generated YAML back to
  EDN. Emit a provenance comment header naming the source declaration.

## Suggested slicing

1. `WorkflowContract` + job/step/matrix/needs vocabulary in katamorph, with the
   `StrategyContract` name collision resolved explicitly.
2. Muse `shape/target/github_actions.cljs`, modelled on `target/opencode.cljs`,
   including its throw-on-incompatibility discipline.
3. Action registry with one pin per action; a check that no workflow references
   an action outside it. Fixes the 8-action drift as a side effect.
4. Emit one real workflow (`main-pr-gate.yml` — already proven) and a
   committed-vs-generated CI check.
5. Migrate the toolchain preamble; measure the step-count reduction.
6. Only then consider `ci-gates.bb` reading the same declarations, retiring
   `--audit`.

## Non-goals

- Replacing GitHub's expression language.
- Generating workflows for other repos before this one proves it.
- Migrating all 23 workflows in one pass.

## Notes

Raised 2026-08-06. Sibling of `workflow-dsl-kanban-reference`, which owns the
Rheos/Kanban interpreter of the same language — this card is the *other* target
of that vocabulary and should not fork it.

---
--text

The bare `--text` comment above is an artifact of the `eta-mu kanban` flag bug — the bridge consumed the flag name as its own value. Left in place rather than edited out: the ledger is append-only, and a card projection that quietly disagrees with it is worse than a visible piece of noise. Written here through `rheos comment` instead.

Status update, raised in review on #181 — this card describes its gap as open, and it is not.

**Slice 1 is done upstream.** `katamorph.schema/WorkflowContract` exists as of open-hax/katamorph#2, filling the hole this card identified: the registry advertised `{:id :registry/workflows :kind :workflow}` with no schema behind it. Read the "gap this fills in Katamorph" section as historical.

Four decisions settled while implementing, none obvious from the card:

- `:job/needs` is first-class — no other kind carries a DAG.
- `:job/matrix` is deliberately **not** `StrategyContract`. The card flagged the collision; the resolution is a separate key, since `StrategyContract` means a retry policy.
- Permissions are `[:map-of keyword? keyword?]`, capability-shaped, matching `CapabilityContract`.
- No expression language. `${{ }}` travels as an opaque string — what katamorph cannot interpret it also cannot silently mangle.

**Slices 2-5 shipped differently than proposed; do not read the card as the plan.** It suggested a Muse `shape/target/github_actions.cljs`. Still the right long-term home, but `packages/eta-mu` cannot consume katamorph without switching shadow-cljs to `:deps true` — too much blast radius. So the projector ships as an nbb command with eta-mu and redeclares no schema. Revisit when eta-mu can consume katamorph directly.

Shipped on #181: workflow resources under `contracts/workflows/`, projection to both GitHub Actions YAML and a local gate plan, `eta-mu workflows` and `eta-mu gates` as shipped commands, nbb bundled at a pinned version. The action registry closed the drift this card measured.

**Honest state of the last slice:** six of eight workflows carry `:workflow/emit false` — their resource owns the gate, the committed YAML still owns what CI runs. Converting those is the remainder, `sol-ci` last for its GitHub App token and private git mirrors.

---
