# Workflow resources

Katamorph **workflow resources** — the single declaration behind both this
repo's GitHub Actions workflows and its local CI gate runner.

## What is here

| File | Role |
|---|---|
| `resources.edn` | The resource registry: every action, pinned exactly once, plus reusable toolchain step sequences |
| `ci.edn` | Workflow resources — a katamorph namespace file (`:namespace` + `:resources`) |
| `.gates.edn` | **Generated.** The local gate plan, read by `scripts/ci-gates.bb` |

## The shape

A workflow is a **resource** like an actor, a capability, or a schedule. It has
an identity, triggers, and an ordered graph of jobs whose steps are actions. It
names no host:

```clojure
{:namespace :eta-mu.ci
 :resources
 [{:contract/kind :workflow
   :contract/id "rheos"
   :workflow/triggers [{:on/event :pull-request :on/paths ["packages/rheos/**"]}]
   :workflow/jobs
   [{:job/id "test"
     :job/gate {:gate/id "rheos" :gate/paths ["packages/rheos/"]}
     :job/steps [{:step/use :checkout}
                 {:step/run "pnpm --dir packages/rheos test"
                  :step/gate true
                  :gate/expect "0 failures, 0 errors"}]}]}]}
```

`:contract/kind :workflow` is katamorph's resource kind — the one its registry
has always advertised as `{:id :registry/workflows :kind :workflow}` and which
now has a schema in `katamorph.schema/WorkflowContract`.

## Two targets, one resource

```text
contracts/workflows/*.edn
  ├── :github-actions ──> .github/workflows/<id>.yml
  └── :local-gates    ──> .gates.edn ──> scripts/ci-gates.bb
```

`:step/gate true` marks the steps that are real verification rather than CI
housekeeping. GitHub runs every step; the local runner runs the gated subset,
because a developer's machine does not need `actions/checkout`.

## Commands

```bash
scripts/workflows.bb list          # workflow resources and their gates
scripts/workflows.bb show rheos    # one resource, expanded
scripts/workflows.bb emit          # project onto both targets
scripts/workflows.bb check         # committed YAML still matches its resource?
```

Generated YAML **is committed** — GitHub reads `.github/workflows` from the
repo. `check` is what keeps the committed artifact honest, and compares
semantically (parsed YAML), so comments and key order are not part of the
contract.

## Why the registry refuses unknown actions

An action not in `resources.edn` is refused rather than passed through. Before
this existed, **8 actions carried more than one pin** across 274 steps —
`actions/checkout` alone had five distinct refs, mixing floating tags (`v4`,
`v6`) with three different SHAs, in a repo where `sha_pinning_required` is
false. One pin per action makes that state unrepresentable instead of merely
discouraged.

## Migration is per-gate

`scripts/ci-gates.bb` still hand-mirrors most gates. Whatever is declared as a
resource is generated and wins; the rest stay mirrored, and `--list` marks
which is which. When every gate is resource-derived, `--audit` — which exists
only to detect drift between the mirror and the workflows — has nothing left to
check and can go.

## Boundary

Katamorph owns the vocabulary. Muse owns host projection
(`muse/docs/design/contract-ownership-and-host-translation.md`). `workflows.bb`
is a bb-native projector standing in for the Muse target until eta-mu can
consume katamorph directly — it deliberately does **not** redeclare the schema,
because a sixth copy of the contract vocabulary is the exact drift the roadmap
exists to stop.
