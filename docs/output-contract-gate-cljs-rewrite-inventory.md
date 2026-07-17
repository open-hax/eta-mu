# Output Contract Gate CLJS Rewrite — Inventory

> Package: `packages/legacy/output-contract-gate` (`@open-hax/output-contract-gate`)
> Source: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Task: `kanban/tasks/output-contract-gate-cljs-rewrite-inventory.md`

## Summary

The package contains **16 source files** (~2,788 TS lines). Every file is classified below against the target CLJS namespace taxonomy.

| Source file | Lines (approx) | Primary target namespace | Rationale |
|---|---|---|---|
| `src/types.ts` | 173 | `eta_mu.gate.law.contract` | Pure type/schema definitions; become Malli schemas. |
| `src/edn.ts` | 223 | `eta_mu.gate.shape.contract` (compiler) + `eta_mu.gate.extern.edn` (parser adapter) | `compileAgentOutputContract` transforms EDN into the normalized IR; `parseEdnForm` wraps the `edn-data` JS parser. |
| `src/markdown.ts` | 124 | `eta_mu.gate.shape.markdown` | AST parsing, section extraction, bold-heading normalization, semantic item counting. |
| `src/fixtures.ts` | 161 | `eta_mu.gate.shape.fixtures` | EDN contract fixture and valid/invalid markdown responses. |
| `src/validate.ts` | 192 | `eta_mu.gate.domain.validate` | Deterministic admissibility logic over contract + extracted markdown. |
| `src/repair.ts` | 37 | `eta_mu.gate.domain.repair` | Repair-prompt compilation from validation failures. |
| `src/review.ts` | 365 | `eta_mu.gate.domain.review` | Stub and GPT semantic review scoring. |
| `src/generate.ts` | 178 | `eta_mu.gate.infra.generate` | Candidate generation orchestration (fixtures + OpenAI-compatible chat). |
| `src/artifacts.ts` | 198 | `eta_mu.gate.infra.artifacts` | Artifact bundle I/O, hashing, JSON serialization. |
| `src/cli.ts` | 619 | `eta_mu.gate.cli.entrypoint` | Argument parsing, command dispatch, orchestration facade. |
| `src/index.ts` | 35 | `eta_mu.gate.cli.public` | Stable public re-export surface. |
| `src/jsedn.d.ts` | 8 | — | Legacy unused declaration for `jsedn`; delete during cutover. |
| `src/edn.test.ts` | 22 | `eta_mu.gate.shape.contract-test` | Contract compilation tests. |
| `src/validate.test.ts` | 74 | `eta_mu.gate.domain.validate-test` | Structure validation tests. |
| `src/repair.test.ts` | 21 | `eta_mu.gate.domain.repair-test` | Repair prompt tests. |
| `src/cli.test.ts` | 301 | `eta_mu.gate.cli.entrypoint-test` | End-to-end CLI orchestration tests. |

## Per-file inventory

### `src/types.ts` → `eta_mu.gate.law.contract`

- **Public exports**: `ContractSection`, `ContractRule`, `RepairTemplate`, `ReviewCriterion`, `ReviewCriterionScore`, `ReviewPolicy`, `ArbitrationForm`, `NormalizedContract`, `MarkdownNode`, `MarkdownRoot`, `ExtractedSection`, `ExtractedDocument`, `ValidationFailure`, `ValidationResult`, `FailureReport`, `ArtifactBundle`, `ReviewReport`, `GptReviewConfig`, `GptReviewMessage`, `GenerationMode`, `GenerationReport`, `RepairAttemptRecord`.
- **Consumers inside `packages/legacy`**: Imported by every other module in `output-contract-gate/src`.
- **Raw JS interop surfaces**: None.
- **Contract rules currently enforced by the file**: None directly; the file is the shape contract itself. The rewrite must preserve these invariants as Malli schemas.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/edn.ts` → split across `eta_mu.gate.shape.contract` and `eta_mu.gate.extern.edn`

- **Public exports**:
  - `ContractCompileError` (used by `cli.ts`, exported from `index.ts`).
  - `compileAgentOutputContract` (used by `cli.ts`, `validate.test.ts`, `edn.test.ts`, `repair.test.ts`; exported from `index.ts`).
  - `parseEdnForm` (pure helper, exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `cli.ts`, `index.ts`, `validate.test.ts`, `edn.test.ts`, `repair.test.ts`.
- **Raw JS interop surfaces**:
  - `edn-data.parseEDNString` — JS EDN parser. The CLJS `extern.edn` namespace should isolate this call and normalize the `{list: [...]}`, `{map: [...]}`, `{key: '...'}`, `{sym: '...'}` wrapper shapes into plain CLJS data.
- **Contract rules currently enforced by the file**:
  - Root form must be `(agent-output-contract ...)`.
  - Required child forms: `name`, `v`, `target`, `structure`, `rules`, `repair`, `review`, `arbitration`.
  - Section fields: `id`, `heading`, `required`, `order`, `cardinality` (`:one` or `:many`), `allowed-node-types`, `local-rules`.
  - Rule fields: `id`, `kind`, `check`, optional `section`, `min`, `max`, `exactly`.
  - Repair template fields: `id`, `when`, `text`.
  - Review policy fields: `enabled`, `reviewer-family`, `threshold`, `criteria`.
  - Criterion fields: `id`, `weight`.
  - Type coercion with compile-time errors for keywords, strings, booleans, numbers, vectors.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/markdown.ts` → `eta_mu.gate.shape.markdown`

- **Public exports**:
  - `parseMarkdownAst` (exported from `index.ts`).
  - `extractMarkdownSections` (used by `validate.ts`, `review.ts`, `cli.ts`; exported from `index.ts`).
  - `countSemanticItems` (used by `validate.ts`; exported from `index.ts`).
  - `nodeText` (used by `review.ts`; exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `validate.ts`, `review.ts`, `cli.ts`, `index.ts`.
- **Raw JS interop surfaces**:
  - `unified().use(remarkParse).use(remarkGfm).parse(markdown)` — JS markdown AST parser.
  - The CLJS `extern.markdown` (or `shape.markdown` using an extern adapter) must retain the MDAST-compatible AST shape because `artifacts.ts` serializes `document.ast` as JSON.
- **Contract rules currently enforced by the file**:
  - Only top-level `##` headings start a section.
  - Bold single-line paragraphs matching known section names (`Signal`, `Evidence`, `Frames`, `Countermoves`, `Next`) are normalized to `##` headings.
  - Bold subheadings inside sections are **not** treated as section boundaries (regression guard).
  - Semantic item counting: list children count as items; `paragraph`, `blockquote`, `code`, `table` count as one item each.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/fixtures.ts` → `eta_mu.gate.shape.fixtures`

- **Public exports**:
  - `ETA_MU_FIVE_SECTION_CONTRACT_EDN` (used by all tests and `cli.ts` indirectly through fixtures; exported from `index.ts`).
  - `VALID_FIVE_SECTION_RESPONSE` (used by `generate.ts`, `validate.test.ts`, `cli.test.ts`; exported from `index.ts`).
  - `INVALID_FIVE_SECTION_RESPONSE` (used by `generate.ts`, `validate.test.ts`, `repair.test.ts`, `cli.test.ts`; exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `generate.ts`, `validate.test.ts`, `repair.test.ts`, `cli.test.ts`, `edn.test.ts`, `index.ts`.
- **Raw JS interop surfaces**: None.
- **Contract rules currently enforced by the file**: The fixture contract encodes the canonical five-section rules (`rule/required-section`, `rule/unique-section`, `rule/section-order`, `rule/allowed-node-types`, `rule/frames-cardinality`, `rule/next-exactly-one-action`) and review criteria (`criterion/contract-fidelity`, `criterion/shortcutting-risk`, `criterion/context-alignment`, `criterion/actionability`).
- **Dependencies on runtime core or boundary adapters**: None.

### `src/validate.ts` → `eta_mu.gate.domain.validate`

- **Public exports**:
  - `validateMarkdownResponse` (used by `cli.ts`; exported from `index.ts`).
  - `toFailureReport` (used by `cli.ts`, `review.ts`; exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `cli.ts`, `review.ts`, `index.ts`, `validate.test.ts`, `repair.test.ts`.
- **Raw JS interop surfaces**: None.
- **Contract rules currently enforced by the file**:
  - `rule/required-section`: every required section must appear exactly once.
  - `rule/unique-section`: no section heading may repeat.
  - `rule/section-order`: extracted headings must match contract order exactly.
  - `rule/allowed-node-types`: section nodes must be in the configured allowlist; sub-headings (`###`+) are rejected with a dedicated message.
  - Count rules: for configured rules with `min`, `max`, or `exactly`, semantic item counts must satisfy the bound.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/repair.ts` → `eta_mu.gate.domain.repair`

- **Public exports**:
  - `compileRepairPrompt` (used by `cli.ts`; exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `cli.ts`, `index.ts`, `repair.test.ts`.
- **Raw JS interop surfaces**: None.
- **Contract rules currently enforced by the file**:
  - Repair templates are selected by matching `whenRuleId` to the failure's `ruleId`.
  - Template variables `{{heading}}`, `{{order}}`, `{{min}}`, `{{max}}`, `{{exactly}}`, `{{count}}` are interpolated from `expected`/`actual`/`heading` bindings.
  - If no template matches, the raw failure message is used.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/review.ts` → `eta_mu.gate.domain.review`

- **Public exports**:
  - `buildStubReviewReport` (used by `cli.ts`; exported from `index.ts`).
  - `buildGptReviewReport` (used by `cli.ts`; exported from `index.ts`).
  - `buildReviewMessages` (exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `cli.ts`, `index.ts`.
- **Raw JS interop surfaces**:
  - `fetch` for OpenAI-compatible `chat/completions` calls.
  - `Headers` from the global JS runtime.
  - Environment variables: `OPENAI_BASE_URL`, `OUTPUT_CONTRACT_GATE_MODEL`, `MODEL`, `OUTPUT_CONTRACT_GATE_API_KEY`, `OPENAI_API_KEY`, `OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN`, `PROXY_AUTH_TOKEN`.
- **Contract rules currently enforced by the file**:
  - Stub reviewer computes weighted average of criterion scores and compares to `contract.review.threshold`.
  - `criterion/contract-fidelity` passes iff structure report is OK.
  - `criterion/shortcutting-risk` derives score from word counts in `Evidence`, `Frames`, `Countermoves`.
  - `criterion/context-alignment` returns a fixed conservative score.
  - `criterion/actionability` derives score from word count in `Next`.
  - GPT reviewer validates returned JSON shape (`criteria`, `deltas`), maps scores back to contract criteria, clamps to `[0,1]`, and falls back to stub on failure unless `noFallback` is set.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/generate.ts` → `eta_mu.gate.infra.generate`

- **Public exports**:
  - `buildGenerationMessages` (exported from `index.ts`).
  - `buildGenerationMessagesForAttempt` (used by `cli.ts` indirectly through `generateCandidate`; exported from `index.ts`).
  - `generateCandidate` (used by `cli.ts`; exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `cli.ts`, `index.ts`.
- **Raw JS interop surfaces**:
  - `fetch` for OpenAI-compatible `chat/completions` calls.
  - `Headers` from the global JS runtime.
  - Environment variables: `OPENAI_BASE_URL`, `OUTPUT_CONTRACT_GATE_MODEL`, `MODEL`, `OUTPUT_CONTRACT_GATE_API_KEY`, `OPENAI_API_KEY`, `OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN`, `PROXY_AUTH_TOKEN`.
- **Contract rules currently enforced by the file**:
  - Generation system prompt enforces the contract's required headings, frames cardinality hint, and next-action hint.
  - `fixture-valid` always returns `VALID_FIVE_SECTION_RESPONSE`.
  - `fixture-invalid` returns `INVALID_FIVE_SECTION_RESPONSE` on first attempt and `VALID_FIVE_SECTION_RESPONSE` once a repair prompt is supplied.
  - Extracts string content from chat completion payloads, including array-of-parts responses.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/artifacts.ts` → `eta_mu.gate.infra.artifacts`

- **Public exports**:
  - `writeRunArtifacts` (used by `cli.ts`; exported from `index.ts`).
  - `writeReviewArtifacts` (used by `cli.ts`; exported from `index.ts`).
  - `writeGenerationArtifacts` (used by `cli.ts`; exported from `index.ts`).
  - `writeRepairAttemptArtifacts` (used by `cli.ts`; exported from `index.ts`).
- **Consumers inside `packages/legacy`**: `cli.ts`, `index.ts`.
- **Raw JS interop surfaces**:
  - `node:fs/promises` (`mkdir`, `readFile`, `writeFile`).
  - `node:crypto` (`createHash`, `randomUUID`).
  - `node:path` (`join`, `resolve`).
- **Contract rules currently enforced by the file**:
  - Run artifact bundle has a deterministic layout: `input.json`, `contract.edn`, `contract-ir.json`, `candidate.md`, `candidate.ast.json`, `validation-report.json`, `final-decision.json`, optional `repair-prompt.txt`.
  - `final-decision.json` records hashes of contract source, candidate markdown, and candidate AST.
  - Review artifacts append to existing `final-decision.json`.
  - Generation artifacts write `task.txt`, `generation-report.json`, and update `input.json`.
  - Repair attempt artifacts write per-attempt `repair-attempt-N.md`, `.validation-report.json`, `.repair-prompt.txt`.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/cli.ts` → `eta_mu.gate.cli.entrypoint`

- **Public exports**:
  - `CliUsageError`.
  - `parseCliArgs`.
  - `runCli`.
  - `usage`.
- **Consumers inside `packages/legacy`**: `cli.test.ts`, package `bin` entry.
- **Raw JS interop surfaces**:
  - `node:fs/promises` (`readFile`).
  - `node:path` (`resolve`).
  - `node:url` (`pathToFileURL`).
  - `process.argv`, `process.cwd()`, `process.stdout`, `process.stderr`, `process.exitCode`.
- **Contract rules currently enforced by the file**:
  - Validates CLI argument combinations and rejects unknown flags.
  - `validate` mode requires `--contract` and `--response`.
  - `generate` mode requires `--contract` and exactly one of `--task-file` or `--task-text`.
  - `review-stub` and `review-gpt` require `--bundle` pointing to a structurally valid artifact bundle.
  - Orchestrates validate → repair loop (bounded by `contract.repairMaxRetries`) → review on success.
  - Exit codes: `0` success, `1` contract/review failure, `2` CLI/runtime error.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/index.ts` → `eta_mu.gate.cli.public`

- **Public exports**: Re-exports all public functions and types from other modules. This is the stable compatibility surface for the `@open-hax/output-contract-gate` package.
- **Consumers inside `packages/legacy`**: None inside `packages/legacy` (it is the public entry). The `packages/extensions` workspace package declares a dependency on `@open-hax/output-contract-gate` in its `package.json` for the `opmf_contract_gate.cljs` extension, but current extension source does not import any exported name directly.
- **Raw JS interop surfaces**: None.
- **Contract rules currently enforced by the file**: None.
- **Dependencies on runtime core or boundary adapters**: None.

### `src/jsedn.d.ts`

- **Action**: Delete during cutover. The project uses `edn-data`, not `jsedn`, and this declaration is dead code.

## Public export-to-namespace mapping

| Public export | Current source | Proposed CLJS namespace |
|---|---|---|
| `ContractCompileError` | `edn.ts` | `eta_mu.gate.shape.contract` |
| `compileAgentOutputContract` | `edn.ts` | `eta_mu.gate.shape.contract` |
| `parseEdnForm` | `edn.ts` | `eta_mu.gate.extern.edn` |
| `writeRunArtifacts` | `artifacts.ts` | `eta_mu.gate.infra.artifacts` |
| `writeReviewArtifacts` | `artifacts.ts` | `eta_mu.gate.infra.artifacts` |
| `writeGenerationArtifacts` | `artifacts.ts` | `eta_mu.gate.infra.artifacts` |
| `writeRepairAttemptArtifacts` | `artifacts.ts` | `eta_mu.gate.infra.artifacts` |
| `buildGenerationMessages` | `generate.ts` | `eta_mu.gate.infra.generate` |
| `buildGenerationMessagesForAttempt` | `generate.ts` | `eta_mu.gate.infra.generate` |
| `generateCandidate` | `generate.ts` | `eta_mu.gate.infra.generate` |
| `parseMarkdownAst` | `markdown.ts` | `eta_mu.gate.shape.markdown` |
| `extractMarkdownSections` | `markdown.ts` | `eta_mu.gate.shape.markdown` |
| `countSemanticItems` | `markdown.ts` | `eta_mu.gate.shape.markdown` |
| `nodeText` | `markdown.ts` | `eta_mu.gate.shape.markdown` |
| `buildStubReviewReport` | `review.ts` | `eta_mu.gate.domain.review` |
| `buildGptReviewReport` | `review.ts` | `eta_mu.gate.domain.review` |
| `buildReviewMessages` | `review.ts` | `eta_mu.gate.domain.review` |
| `validateMarkdownResponse` | `validate.ts` | `eta_mu.gate.domain.validate` |
| `toFailureReport` | `validate.ts` | `eta_mu.gate.domain.validate` |
| `compileRepairPrompt` | `repair.ts` | `eta_mu.gate.domain.repair` |
| `ETA_MU_FIVE_SECTION_CONTRACT_EDN` | `fixtures.ts` | `eta_mu.gate.shape.fixtures` |
| `VALID_FIVE_SECTION_RESPONSE` | `fixtures.ts` | `eta_mu.gate.shape.fixtures` |
| `INVALID_FIVE_SECTION_RESPONSE` | `fixtures.ts` | `eta_mu.gate.shape.fixtures` |
| Exported type aliases | `types.ts` | `eta_mu.gate.law.contract` (as Malli schemas) |

## Consumers inside `packages/legacy`

- All consumers are internal to `packages/legacy/output-contract-gate/src`.
- No other legacy package imports from `@open-hax/output-contract-gate`.
- `packages/extensions` declares a workspace dependency on `@open-hax/output-contract-gate` for the `opmf_contract_gate.cljs` extension, but the current CLJS extension implementation does not import any symbol from the TS package; it appears to duplicate the contract logic internally. The rewrite should reconcile this: the extension can become a direct consumer of the new CLJS namespaces.

## Raw JS interop surfaces

| Surface | Used by | JS dependency | CLJS boundary plan |
|---|---|---|---|
| EDN parsing | `edn.ts` | `edn-data` (`parseEDNString`) | `eta_mu.gate.extern.edn` wraps and normalizes output to plain CLJS data. |
| Markdown AST | `markdown.ts` | `unified`, `remark-parse`, `remark-gfm` | `eta_mu.gate.extern.markdown` (or keep in `shape.markdown` with extern adapter) must preserve MDAST JSON shape for artifact serialization. |
| File system | `artifacts.ts`, `cli.ts` | `node:fs/promises` | `eta_mu.gate.extern.fs` or boundary adapter. |
| Crypto / UUID | `artifacts.ts` | `node:crypto` | `eta_mu.gate.extern.crypto` or use CLJS equivalents. |
| HTTP fetch | `review.ts`, `generate.ts` | global `fetch`, `Headers` | Reuse existing runtime boundary adapter for OpenAI-compatible chat completions when available; otherwise `eta_mu.gate.extern.http`. |
| Environment | `review.ts`, `generate.ts`, `cli.ts` | `process.env` | `eta_mu.gate.extern.env` or pass config explicitly. |
| Path utilities | `artifacts.ts`, `cli.ts` | `node:path` | `eta_mu.gate.extern.path` or CLJS path helpers. |
| Process / stdio | `cli.ts` | `process.argv`, `process.stdout`, `process.stderr` | Keep in `cli.*` as the Node.js facade layer. |

## Contract rules enforced across the package

1. **EDN grammar** (`edn.ts`)
   - Root form and required child forms.
   - Type coercion rules for keywords, strings, booleans, numbers, vectors.
2. **Section structure** (`markdown.ts`, `validate.ts`)
   - Required sections must be present.
   - Sections must be unique.
   - Section order must match contract.
   - Allowed node types per section.
   - No sub-headings inside sections.
   - Bold single-line paragraphs for known section names are normalized to `##` headings.
3. **Count rules** (`validate.ts`)
   - `min`, `max`, `exactly` bounds over semantic item counts.
4. **Repair rules** (`repair.ts`)
   - Template selection by `ruleId`.
   - Variable interpolation.
5. **Review rules** (`review.ts`)
   - Weighted criterion scoring.
   - Threshold comparison.
   - GPT output schema validation and fallback.
6. **Artifact rules** (`artifacts.ts`)
   - Bundle layout, hashing, JSON serialization, immutable run records.
7. **CLI rules** (`cli.ts`)
   - Argument validation, command dispatch, bounded repair loop, exit-code contract.

## Dependencies on runtime core or boundary adapters

- **None currently**. The package is self-contained except for Node.js builtins and third-party JS libraries (`edn-data`, `unified`, `remark-parse`, `remark-gfm`).
- The rewrite can optionally replace the ad-hoc `fetch` calls in `review.ts` and `generate.ts` with the core boundary adapter for HTTP once `eta-mu-cljs-rewrite-boundary-adapters` is complete, but this is not a hard dependency for Phase 2.

## Recommended next task

- `kanban/tasks/output-contract-gate-cljs-rewrite-law-schemas.md` — port `src/types.ts` to Malli schemas under `eta_mu.gate.law.contract` and validate them against the fixture contract.
