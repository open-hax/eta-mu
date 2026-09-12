---
category: "tasks"
labels: "rheos, github, projection, data-integrity"
dependency: []
parent: "rheos-ledger-authoritative-projections"
type: "task"
write-id: "1789235207504-0.42ei23m7dex5ci1subu"
title: "Preserve inline YAML label arrays in Rheos projections"
priority: "P0"
status: "review"
uuid: "rheos-preserve-inline-yaml-label-arrays"
created_at: "2026-09-01T17:18:15.615Z"
---

# Preserve inline YAML label arrays in Rheos projections

## Outcome

Rheos decodes canonical top-level inline YAML string sequences without broadening its partial decoder to arbitrary YAML, so `read-task` and board projection preserve identical ordered labels. This closes open-hax/eta-mu#320.

## Scope

- Decode only empty or fully quoted, single-line top-level string sequences.
- Keep unquoted, mixed, nested, map, block, and malformed values fail-closed.
- Advertise the added decoder capability.
- Prove read-task and board-snapshot label equality and non-empty preservation.

## Acceptance criteria

- Non-empty and empty canonical label arrays retain order.
- Unsupported structural YAML remains omitted from the partial view.
- A board-level regression fails if non-empty source labels become an empty projected vector.
- Rheos tests, clj-kondo, and release build pass without warnings.

---
Verified on the combined blocker-removal candidate: 191 Rheos tests / 967 assertions, clj-kondo 0 errors and 0 warnings, all four production release builds 0 warnings, and all 252 previously affected inline task-label arrays remain nonempty. Candidate also proves exact read-task/board equality.

Exact-head review regression fixed: the shared canonical inline-sequence decoder now preserves quoted commas identically through read-task and board projection. Verified 195 tests / 992 assertions, zero failures; clj-kondo 0 errors/warnings; server, CLI, GitHub-sync, and app release builds 0 warnings.

Exact-head PR #322 review follow-up: bracket-prefixed malformed and trailing inline arrays now fail closed through the shared decoder in both read-task and board paths; parity regressions cover unterminated and trailing forms. Combined candidate verified by 197 Rheos tests / 1006 assertions, clj-kondo 0 errors / 0 warnings, and server, CLI, GitHub-sync, and app release builds with 0 warnings.

Final PR #322 review gate: Rheos comment serialization now preserves a blank line before the closing delimiter, and this card was rewritten through the ledger-backed CLI to normalize its evidence block. Final combined evidence: 197 Rheos tests / 1009 assertions, clj-kondo 0 errors / 0 warnings, and server, CLI, GitHub-sync, and app release builds with 0 warnings.

PR335 Codex3996508051 ownership correction and current contract: this Rheos task owns the inline-label decoder and its malformed-input cost repair. The September 12 plan and results were mistakenly appended to clio-local-edn-service-providers-and-deprecated-ledger-retirement; those historical comments remain evidence of when the work occurred, not its owning contract. This amendment supersedes the older Scope bullets that admit fully quoted values only and refuse every unquoted or mixed sequence. Authorized scope now accepts empty and single-line top-level string sequences containing quoted members, bounded plain word/path members, or a mixture, preserving order and quoted commas. Plain booleans, nulls, numeric-first values, mapping syntax, nesting, malformed delimiters, and trailing text still fail closed; arbitrary YAML remains unsupported. Acceptance: actual read-task and board snapshot preserve [graph, relationships, code, provenance] from the unchanged Epiphany card; quoted/plain/mixed grammar and malformed long-input regressions pass; task bytes remain unchanged during reads; Rheos tests, lint, and all four releases pass without warnings. The earlier quoted-only acceptance was deliberate historical scope, expanded here to meet the reported Epiphany loss. Verified implementation f67b232 and report docs/verification/rheos-inline-label-projection.md record failure-first evidence and final 209 tests / 1128 assertions, JVM 8 / 43, lint 0 / 0, and four zero-warning releases. This is a present-tense correction, not a claim that the owning contract was amended before implementation.

Scoped recovery for actual PR335 Codex3996586754 on b19fad7: shared inline sequence scanner rejects spaces/tabs after closing bracket while parse-flat trims them, so task reads lose labels that board projections retain. Reproduce direct portable parser and real read-task/board equality before changing implementation. Reuse monotonic whitespace scanning at the two closing branches; preserve quoted/plain/mixed member grammar, malformed suffix refusal and 50000-character timing guards. Full Rheos tests, portable grammar, lint and four release targets remain required; parent owns base restacking and publication.

PR335 Codex3996586754 repaired in c94e789: exact trailing spaces/tabs now preserve empty, quoted, plain and mixed labels across task reads, snapshots and comment rewriting. Failure-first JVM14/native30 assertions now JVM10/75 and native212/1184 green. Retained 50k whitespace two-second acceptance/refusal guards. Cold sibling-path warnings reproduced and corrected using real local/root dependencies plus minimal chat-ui manifest; forced basis rebuild has zero warnings. Final Rheos lint0/0 and all four releases0warnings; required eta-mu174/391 plus workflow4/44, lint0/0, router166inputs0warnings. Fresh direct Rheos CLI SHA35eb33a238f4a869091302b1ec0c7aa7a46f7a2b0ab9f069899ee6539d5795d4 restored Epiphany116cards/12columns and original labels with all116 Markdown hashes unchanged. Old Clio router had resolved its stale Rheos companion; pairing is now explicit. Independent scoped review found no confirmed defect. See docs/verification/rheos-inline-label-projection.md. Root owns ordinary restack, actual reviewer loop and publication; no remote merge claimed.

Ordinary restack complete at 707e132e with exact parents d5c458 and published Clio/Axxium 2431570f; Rheos and chat-ui implementation bytes unchanged. Five metadata conflicts preserve complete incoming ledger prefixes plus unique Rheos-only records in original order (8 kanban, 4 receipt, 4 reflection), incoming memory plus own entry, and all five historical Rheos comments on the shared Clio card with incoming frontmatter retained. Independent byte/ID audit found no introduced defect. Fresh forced JVM10/75, native212/1184 twice, lint0/0, test161 and releases111/115/75/95 inputs0warnings. Required CLI174/391 plus workflow6/78, lint0/0, test200/release166 inputs0warnings. Actual temporary Epiphany c72b41ee snapshot preserves116 tasks/12columns/alllabels and all116 Markdown hashes; checkout remains clean. Prefix and native snapshot JSON proofs linked in docs/verification/rheos-inline-label-projection.md. Newer protocol findings are separately owned and not claimed closed; root owns further published-base restack and publication.

---