# @open-hax/eta-mu-runtime

Typed movement kernel for the eta-mu control plane: belief state, panel
selection, and auditable action envelopes. The package now hosts the
ClojureScript rewrite of several eta-mu domains, with a thin TypeScript facade
preserved for downstream consumers that still import the published types.

Package path: `packages/runtime` (previously `packages/eta-mu-runtime`).

> There is **no** `services/eta-mu` runtime directory. This package is a library
> compiled by shadow-cljs + `tsc`; it is consumed in-process by other workspace
> packages, not deployed as a standalone service.

## Layout

CLJS sources live under `src/cljs/eta_mu/`. The code is organized into six
`eta_mu.*` domains, each following the workspace layer convention from
`AGENTS.md` (`law → shape → extern → domain → infra`):

| Domain   | Layers present                       | Covers |
|----------|--------------------------------------|--------|
| `runtime`| law, shape, extern, domain, infra    | The control-plane core: `breath`, `candidate`, `envelope`, `message`, `model`, `planner`, `session`, `state`, `surface`, `tool`. Exposed through `eta_mu.runtime.facade`. |
| `ai`     | law, shape, domain, extern           | LLM message modeling (no `infra` layer). |
| `coding` | law, shape, extern, domain, infra    | Coding-agent session/diagnostics over fs/git/shell/process externs. |
| `docs`   | law, shape, extern, domain, infra    | Frontmatter/markdown parsing, jsonl, and the docs indexer/mounts. |
| `garden` | law, shape, extern                   | Publication block/track shapes (no `domain` or `infra` layer). |
| `gate`   | law, shape, extern, domain           | Output-contract validate/repair/review (no `infra` layer). |

Layer rules (see `AGENTS.md`): `law.*` are Malli contracts (no I/O), `shape.*`
are pure morphisms, `extern.*` are the raw JS/Node boundaries, `domain.*` are
pure decisions over shaped data, and `infra.*` orchestrates effects. The build
and dependency order *is* this DAG.

The `runtime` domain is the "core" control plane and is the only domain wired
into the package's exported facade today; the other five domains are migrated
slices that are tested but not yet re-exported through the public entrypoints.

## Entrypoints

`package.json` exposes a dual export map:

- `.` → `dist/index.js` / `dist/index.d.ts` — the TypeScript facade.
- `./cljs` → `dist-cljs/index.js` — the compiled CLJS ESM module, with types at
  `dist/cljs-runtime.d.ts`.

### TypeScript facade (`@open-hax/eta-mu-runtime`)

`src/index.ts` re-exports the stable runtime API. The value exports delegate to
the compiled CLJS runtime while keeping the existing TS names, schemas (zod),
and declaration files:

- from `./envelope.js`: `createActionBatch`, `recommendBreath`
- from `./planner.js`: `rankCheapMuCandidates`, `selectPanelsFromContext`
- from `./state.js`: `createBreathEpisode`, `createEtaBelief`,
  `createEtaMuState`, `DEFAULT_ETA_BELIEF`
- schema values from `./types.js`: `breathEpisodeSchema`,
  `breathRecommendationSchema`, `costClassSchema`, `etaBeliefSchema`,
  `etaMuActionBatchSchema`, `etaMuPlanningContextSchema`, `etaMuStateSchema`,
  `muCandidateKindSchema`, `muCandidateSchema`, `panelNameSchema`,
  `reversibilitySchema`
- types from `./types.js`: `BreathEpisode`, `BreathRecommendation`, `CostClass`,
  `EtaBelief`, `EtaMuActionBatch`, `EtaMuPlanningContext`,
  `EtaMuPlanningContextInput`, `EtaMuState`, `MuCandidate`, `MuCandidateKind`,
  `PanelName`, `Reversibility`

### CLJS facade (`@open-hax/eta-mu-runtime/cljs`)

The CLJS entrypoint is `eta_mu.runtime.facade` (`src/cljs/eta_mu/runtime/facade.cljs`).
`shadow-cljs.edn`'s `:runtime` build (`:target :esm`, `:runtime :node`,
`:output-dir dist-cljs`) exports an additive set of constructors/morphisms,
including the facade names backing the TS facade plus message/content/tool/model/
session helpers (`createTextContent`, `createImageContent`, `createAudioContent`,
`createBashExecutionMessage`, `createCustomMessage`, `createBranchSummaryMessage`,
`createCompactionSummaryMessage`, `convertToLlmMessages`, `createToolDescriptor`,
`composeToolDescriptors`, `selectCompatibleModels`, `createSessionContext`,
`createSurfaceCommandResult`).

```ts
import { createSurfaceCommandResult } from "@open-hax/eta-mu-runtime/cljs";

const version = createSurfaceCommandResult({ command: "version", value: "0.70.15" });
console.log(version.stdout);
```

## Example

```ts
import {
  createActionBatch,
  createEtaBelief,
} from "@open-hax/eta-mu-runtime";

const belief = createEtaBelief({
  urgency: 0.8,
  reviewDebt: 0.7,
  deployRisk: 0.3,
});

const batch = createActionBatch({
  repo: "open-hax/proxx",
  trigger: "pull_request_review_comment",
  target: "pr#42",
  summary: "review debt is still blocking movement",
  belief,
  unresolvedReviewThreads: 3,
  quietWindowDetected: true,
});
```

## Scripts

Run with pnpm from `packages/runtime` (or `pnpm --dir packages/runtime <script>`):

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `cljs:compile && tsc` | Compile CLJS runtime then build the TS facade. |
| `clean` | `rm -rf dist dist-cljs target` | Remove all build outputs. |
| `typecheck` | `tsc --noEmit` | Type-check the TS facade. |
| `test` | `cljs:compile && vitest run` | Compile CLJS, then run vitest. |
| `test:watch` | `vitest` | Watch-mode vitest. |
| `lint:kondo` | `clj-kondo --lint src/cljs test/cljs` | Lint CLJS sources and tests. |
| `cljs:compile` | `shadow-cljs compile runtime` | Build the CLJS `:runtime` ESM module. |
| `cljs:test` | `shadow-cljs compile test && node target/cljs-test.cjs` | Run the CLJS node-test suite. |
| `cljs:coverage` | `c8 … --check-coverage --lines 90 --statements 90 …` | CLJS test coverage with a 90% lines/statements gate. |
| `cljs:smoke` | `node scripts/smoke-cljs-runtime.mjs` | Prove Node can import the compiled CLJS ESM exports. |
| `cljs:boundary` | `node scripts/check-cljs-boundaries.mjs` | Reject disallowed raw JS interop outside `extern.*`. |
| `cljs:verify` | `cljs:compile && cljs:test && cljs:smoke && cljs:boundary` | Full CLJS gate. |

The CLJS construction order from `AGENTS.md` applies: build/compile the lower
layers (`law`, `shape`, `extern`) before the layers that depend on them
(`domain`, `infra`). Use `cljs:verify` as the canonical pre-PR check for any CLJS
change in this package; `cljs:boundary` is intentionally strict because nothing
above `extern.*` may touch a raw host object.

## Dependencies

- runtime: `zod` (TS facade schemas)
- CLJS: `metosin/malli` (declared in `shadow-cljs.edn`)
- dev: `c8`, `shadow-cljs ^3.4.11`, `source-map-support`, `typescript ^5.6.3`,
  `vitest ^2.1.0`

## Domain ownership

Why non-runtime domains (`ai`, `coding`, `docs`, `garden`, `gate`) live here vs.
in `packages/sol`: see [`docs/design/runtime-vs-sol-ownership.md`](./docs/design/runtime-vs-sol-ownership.md).
