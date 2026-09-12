# Rheos plain inline label projection

Epiphany's unchanged `epic-10-program-relationship-graph.md` contains `labels: [graph, relationships, code, provenance]`. The rebuilt Rheos CLI projected that field as an empty vector. Both task reads and board snapshots shared a decoder that accepted only double-quoted inline string members; unsupported values were omitted and the board defaulted missing labels to `[]`.

The shared decoder now also accepts plain word/path labels, including spaces and colon-qualified names, mixed with quoted members. It validates the entire sequence before exposing decoded members. Quoted commas remain part of their label. Plain booleans, nulls, numeric values, mapping syntax, nested collections, malformed delimiters, and trailing text remain unsupported. This remains a partial YAML decoder; it does not claim to interpret arbitrary YAML. Source cards and historical ledger records are not rewritten by reads or snapshots.

Before implementation, the scoped plan was recorded through the rebuilt Rheos CLI on the Clio local-provider task. That was the wrong owner: the Rheos inline-label task still described quoted-only scope. The ownership correction below records the actual sequence without claiming that the owning contract had already been amended. A fresh filesystem regression called both the real `kanban_read_task` dispatch and board projection. Before the fix it produced three failed assertions; afterward it preserves the four labels and checks that the original card bytes are unchanged. Portable grammar coverage separately failed four assertions before the fix and passed afterward.

Fresh verification on 2026-09-12:

- Advertised `pnpm test`: 208 tests, 1,124 assertions, zero failures/errors in each advertised run; test compiler 161 files, zero warnings.
- JVM grammar tests: seven tests, 39 assertions, zero failures/errors.
- Advertised `pnpm lint`: zero errors and warnings.
- Advertised `pnpm build`: server 111 files, CLI 115 files, GitHub projector 75 files, UI 95 files; all four releases report zero compiler warnings.
- Actual rebuilt CLI against Epiphany: 116 cards and the exact four labels for `epic-10-program-relationship-graph`.
- The real Epiphany card still matches its Git HEAD bytes; SHA256 `b15484ac464c23c0da6f57433c81f0ce6681f45e0d4bca2fe5c1cb41f7a8c5cd`.
- Built CLI SHA256 `94064a910f0428fcbce33e066985870cf1f04a7b77ff582bfe2f33ba42d7de1f`; parser source SHA256 `46647cd4203e58a045ddd643010d8f0407c9ee5a1fe6496d1e8a689d9a5dd8b4`.

The first cold Clojure startup reported two existing dependency configuration warnings for Rheos's external `:paths` entries `../protocols/src` and `../chat-ui/src`. The parser change does not alter dependency metadata; these remain a separately identified configuration issue. Shared installed dependencies were linked into the isolated worktree, with no second dependency installation. The worktree needed its own verification-document directory created before writing the report.

Independent peer review found no confirmed defect in the declared string-only subset. Numeric-first plain labels and general YAML syntax remain outside that subset. The Epiphany owner regenerates the tracked board snapshot using the above CLI; this PR owns the Rheos decoder and its evidence.

The publication branch is stacked on the exact published Axxium checkpoint `fdc02c09780e984d885ef18352d0eb69fb02449c`, not on the mixed local parent used for the first verification. The parser, both tests and this report applied cleanly. Three append-only ledgers and the task card needed ancestry conflict resolution: the published prefixes and newer task comments were retained, then the original recorded Rheos suffixes and task write identity were replayed. No historical event or source card was regenerated, and the original verified worktree and CLI remain intact.

Byte checks preserve all 19,069 reflection-ledger bytes (SHA256 `b942a311a7f51b4b727c66f17c174a2bbfb31d4a7d35e5ea2c87d89f17013362`), 1,715,138 kanban-ledger bytes (`e5e14321a8055df1009f0a93a57b17cccc71f89a4e77d675b63744d146dde1a6`) and 247,048 receipt-ledger bytes (`7a09763192ec4a967dd824a501f893bb840b711e47b2ce8a9ebf27f7afb6b568`). The suffixes are exactly the original one reflection, two CLI comments and one receipt. Every appended record parses as an EDN map; the appended receipt passes the package-owned `record-errors` validator.

A broad attempt to parse every historical receipt exposed `Invalid number: 2026-07-12T053333Z` at line 101. The exact published base fails identically: that old entry is prose in an EDN-named file. Its bytes were preserved, and this bounded parser change does not claim to validate or repair the entire historical receipt ledger. A separately scoped compatibility reader would need an explicit archival policy before treating those old records as evidence.

Fresh gates in the restacked publication worktree also pass: advertised `pnpm test` at 208 tests / 1,124 assertions; advertised `pnpm lint` at zero errors/warnings; advertised `pnpm build` at server 111, CLI 115, GitHub projector 75 and UI 95 files, all with zero compiler warnings. Those runs use the exact published prerequisite source plus this patch and shared installed dependencies.

The independently rebuilt CLI in that publication worktree has SHA256 `789a155c7ba3ab70f6488af46e14071b78371540bbd392f58e0f9176f44b0a18`; the parser source remains `46647cd4203e58a045ddd643010d8f0407c9ee5a1fe6496d1e8a689d9a5dd8b4`. Build output paths differ from the original worktree, so the two CLI artifact hashes are recorded separately.

## Review repair: bounded malformed-input cost

Actual Codex review [3996227835](https://github.com/open-hax/eta-mu/pull/335#discussion_r3996227835) found overlapping whitespace quantifiers in the mixed-member regex. The failure-first portable regression also exposed the same issue in the quoted/empty-sequence validator: malformed 50,000-space inputs took **5,827.8 ms** and **3,739.0 ms** in this sandbox's Node 24 Shadow test run. Both exceeded the generous two-second refusal bound; the run reported **209 tests / 1,128 assertions, 2 failures, 0 errors**.

Both whole-sequence regexes were replaced with a monotonic scanner. It consumes quoted or plain members and separators in order, then returns members only after the final delimiter and complete-input check. Plain scalar refusal remains unchanged. No broad YAML interpretation, truncation, dropped members, or length-based rejection was introduced. An independent source review found no confirmed grammar or complexity defect within the declared subset.

Fresh successor gates pass: advertised Rheos test runs each report **209 tests / 1,128 assertions, 0 failures, 0 errors**; JVM portable tests report **8 tests / 43 assertions, 0 failures, 0 errors**; lint reports **0 errors, 0 warnings**; releases report server **111**, CLI **115**, GitHub projector **75**, and UI **95** files, all at **0 compiler warnings**. An additional actual NBB probe rejected the two 50,000-space cases in **39.5 ms** and **18.2 ms**. These timings describe their stated runtimes, rather than a general performance guarantee.

The freshly rebuilt CLI still produces Epiphany's exact four labels and leaves the original task bytes unchanged. Its SHA256 is `f6b7b661ae6c336712a4665a4a33d44de7e34a0c167c9cb090c7141a6c9c23d7`. This successor supersedes the earlier CLI hashes for the review repair; the earlier hashes remain as provenance of their respective checkpoints.


## Review repair: owning contract and historical provenance

Actual Codex review [3996508051](https://github.com/open-hax/eta-mu/pull/335#discussion_r3996508051) found that the earlier plans and results were recorded on the unrelated Clio local-provider card. The owning [Rheos card](../../kanban/tasks/preserve-inline-yaml-label-arrays-in-rheos-projections-l-arrays.md) still deliberately refused all unquoted and mixed arrays. This was a real contract mismatch; it is not retroactively described as prior authorization in that card. The user's reported Epiphany data loss and requested repair justify the bounded scope expansion, but do not make its missing task amendment disappear.

The actual rebuilt Rheos CLI now appends an explicit current contract amendment to the owning card. It supersedes the two quoted-only scope bullets with the supported empty, quoted, plain word/path and mixed string sequence subset, while retaining malformed, nested, mapping, typed and numeric-first refusal. It links the existing failure-first and completed gate evidence rather than presenting those older runs as new executions. A second canonical comment on the Clio card links the corrected owner and explicitly identifies its four earlier Rheos comments as misplaced provenance. Card bodies remain settled; both amendments use the prescribed append-only comment operation. No parser, test or historical ledger bytes change in this correction.

Verification for this documentation/provenance successor reads both cards through the actual CLI, checks the amended contract and cross-link, confirms that their former bodies and comments remain intact, and proves that the kanban, receipt and reflection ledgers retain their complete prior byte prefixes. New records are parsed and the new receipt is validated with its package-owned validator. The parser's prior 209/1128 Shadow and 8/43 JVM gates remain the evidence for the unchanged implementation; no fresh source-test execution is claimed here.

## Review repair: trailing array whitespace and restored CLI provenance

Actual Codex review [3996586754](https://github.com/open-hax/eta-mu/pull/335#discussion_r3996586754) found that `labels: ["ci"]   ` survived board projection but disappeared from `kanban_read_task`. The flat decoder trims its input; the content decoder preserves trailing bytes, and the shared scanner incorrectly required `]` to be the very last character. Both the empty and populated closing branches now advance through trailing whitespace with the existing monotonic scanner. Any subsequent non-whitespace text still refuses the complete sequence. The supported member grammar is unchanged.

Failure-first verification reproduced **14 failed JVM assertions** and **30 failed native CLJS assertions**. The new coverage checks empty, quoted, plain and mixed arrays with spaces and tabs through direct parsing, flat parsing, real temporary-file task reads, board projection and comment rewriting. Read-only operations preserve the original card bytes. The existing malformed-input tests retain their two-second limit; additional 50,000-character suffix cases enforce the same limit for both acceptance and refusal.

The sandbox restoration exposed a second, distinct obstacle: the freshly built eta-mu router in the Clio worktree resolved that worktree's older Rheos companion. It therefore dropped all plain-array labels again while generating Epiphany's snapshot. Rebuilding only the router cannot update that sibling artifact. The Epiphany owner regenerated with the direct Rheos CLI built from parser commit `c94e789070e15a4f7c9da51baa50ed520a6d1203`, SHA256 `35eb33a238f4a869091302b1ec0c7aa7a46f7a2b0ab9f069899ee6539d5795d4`. All **116** source Markdown file hashes remained unchanged, the snapshot retained **116 tasks in 12 columns**, and every task's labels matched the prior snapshot. The `epic-10-program-relationship-graph` example again contains `[graph, relationships, code, provenance]`; its card SHA256 remains `b15484ac464c23c0da6f57433c81f0ce6681f45e0d4bca2fe5c1cb41f7a8c5cd`. Consumers must pair the router with this rebuilt companion or invoke the verified direct artifact.

The previously recorded cold Clojure warnings were reproduced rather than hidden by a warm cache. Rheos now declares the protocols and chat-ui packages as `:local/root` dependencies. The new chat-ui `deps.edn` records its source root and the same Helix/Malli versions already declared in its Shadow configuration. This follows the [Clojure CLI dependency guidance](https://clojure.org/reference/clojure_cli), which requires sibling packages to be local dependencies rather than external `:paths` or alias `:extra-paths`. `clojure -Sforce` rebuilds the dependency basis with no external-path warning; no warning suppression or dependency-version change was introduced.

Fresh repaired-source verification, repeated after the local dependency correction:

| Gate | Result |
| --- | --- |
| Forced Clojure dependency basis and portable JVM tests | 10 tests / 75 assertions; zero failures, errors or dependency warnings |
| Advertised Rheos `pnpm test` | 212 tests / 1,184 assertions in both configured runs; zero failures/errors; 161 compiler inputs, zero warnings |
| Advertised Rheos `pnpm lint` | Zero errors and warnings; eight existing architecture diagnostics remain informational |
| Advertised Rheos `pnpm build` | Server 111, CLI 115, GitHub projector 75, UI 95 compiler inputs; all four releases zero warnings |
| Required eta-mu `pnpm test` and `pnpm lint:kondo` | 174 tests / 391 assertions plus workflow tests 4 / 44; zero failures/errors; 200 compiler inputs and lint both zero warnings |
| Fresh eta-mu router build | 166 compiler inputs; zero warnings; paired with the verified Rheos companion in this same checkout |
| Independent scoped source review | No confirmed defect in closing-delimiter handling, refusal or bounded scanning coverage |

The advertised test script intentionally exercises both Shadow autorun and a separate native Node process. During the red run, compiler exit status alone did not report the assertion failures; the second native invocation returned failure. The green claim checks both actual assertion summaries as well as the final process status. Frozen filtered installs reused the shared pnpm store with **zero downloads**: 303 packages for Rheos and 51 additional packages for the required CLI gates. The corrected CLI artifact retains the SHA256 above; the parser source SHA256 is `5153313124310fb84aef7a3a99f21de716d7eb4be763ff19a4b6e9abfcbad3e5`.

The freshly paired eta-mu router appended the owning card result, one test-run receipt and one session reflection. `receipt validate 1` accepts the new event. Byte-prefix checks preserve all inherited kanban-ledger (1,722,447 bytes), receipt-ledger (250,177 bytes), reflection-ledger (21,700 bytes) and session-memory (29,831 bytes) content. These scoped checks do not claim to revalidate the malformed historical receipt discussed above. Remote review, prerequisite restacking and publication remain with the parent task.

## Restack on the published Clio/Axxium recovery

The published prerequisite `2431570f10868197484d8e2902ad7508840625e7` was fetched over HTTPS and its tree verified as `1798573556251b6fc5d42936d34f2cbce8d322ac`. Ordinary merge `707e132e50a151aec0583af77a82d6ebc347d0e9` preserves that commit and the complete Rheos candidate `d5c458595e8ddf933bb45b7bc06c1ad94188226d` as its two parents. Every Rheos source/test/config byte and the new chat-ui manifest still match the tested Rheos candidate. No source conflict, history rewrite or force push was needed.

Five metadata files conflicted. Resolution retains the complete incoming byte prefixes of the three EDN ledgers and appends the missing Rheos-only records in their original order: **8 kanban events, 4 receipts and 4 reflections**. All 16 appended records parse as EDN maps carrying event IDs; each added ID is distinct and absent from the incoming ledger. The incoming session-memory prefix is followed by the exact missing complete Rheos entry. The shared Clio card retains incoming frontmatter and body, followed by its five verbatim historical Rheos comment paragraphs, including the ownership correction. The owning Rheos card merged without conflict.

An independent read-only audit checked the staged bytes, event identities, complete memory entry and comment paragraphs. [Exact prefix sizes and hashes](evidence/rheos-restack-prefixes.json) document the resolution. The published prerequisite already contained earlier record interleaving relative to the older `fdc02c` common ancestor. This proof establishes complete **published incoming-prefix preservation** and **Rheos-only record order**; it does not claim that older ancestor was a literal prefix or that this merge reconstructed chronological history.

Fresh gates on merge `707e132e` pass: forced Clojure basis/JVM **10 tests / 75 assertions**, Rheos native **212 / 1,184** in both advertised runs, lint **0 errors / 0 warnings**, test compiler **161 inputs / 0 warnings**, and server/CLI/GitHub/UI releases **111 / 115 / 75 / 95 inputs**, all zero warnings. Rheos has no separate `typecheck` script; these CLJS compile and release targets enforce its compiler checks. The required eta-mu CLI gates also pass: **174 / 391** plus the merged workflow suite **6 / 78**, lint **0 / 0**, test **200 inputs** and release **166 inputs**, both zero warnings. The frozen install required no dependency resolution or download.

The rebuilt direct CLI was then run against the exact clean Epiphany `c72b41eee96d22915a79487148df453c34627e48`, writing its snapshot to a temporary log directory. The [native snapshot proof](evidence/rheos-restack-epiphany-snapshot.json) confirms **116 tasks / 12 columns**, every label equal to the committed snapshot, all **116 Markdown hashes unchanged**, and the Epiphany checkout still clean. CLI and example-card hashes remain unchanged. The coordinator has identified newer protocol findings after this published prerequisite; this completed Rheos verification does not claim those separate findings are closed or that the whole dependency stack is ready to merge.

## Review repair: horizontal inline whitespace

Actual [CodeRabbit comment 5647795596](https://github.com/open-hax/eta-mu/pull/335#issuecomment-5647795596)
identified a remaining contract defect on published `7fb29118a9f361987eb88a57e1d8b6a21fe7c375`:
the scanner's broad whitespace class admitted physical line feeds after the
opening bracket, commas, and closing bracket, despite the owning card's
single-line requirement. This repair preserves that requirement. Local base
`f3242759e80d9768bc5d2384157bb66712857cde` has the exact published tree
`88f62d7db049e092c5f2af84a646c22b7e0445a4`.

Source commit `c11d5e84ba5b49030662f88b346e2452db72e66d` makes scanner whitespace
explicitly spaces and tabs. A whole-input check refuses physical LF, CR, and
form feed, including inside quoted members. Literal backslash-n, backslash-r,
and backslash-f text retains its existing uninterpreted string bytes; the
decoder does not gain an escape interpreter or wider YAML grammar. Existing
scalar trimming and frontmatter line splitting are unchanged, including
ordinary CRLF document line boundaries.

Failure-first tests produced **30 failed assertions** on both JVM and compiled
Node (**12 tests / 115 assertions / 0 errors** on each). They cover separators
after opening and closing delimiters, commas, quoted members, and the contents
of quoted members. Positive cases preserve horizontal whitespace, tab characters
inside quoted strings, and literal escape text.

Reviewing the minimal repair exposed an adjacent projection problem:
`parse-flat` trimmed the value before validation and could erase a forbidden
trailing form feed. A second actual JVM RED run produced **3 failures / 0 errors
in 13 tests / 118 assertions**. Sequence values now reach the shared decoder
with their original suffix bytes; only leading spaces and tabs are removed.
This keeps the flat projection aligned with the task reader's sequence
admission. The root agent independently reviewed the scoped parser diff and
found no introduced grammar, scalar, or line-splitting defect.

Fresh final gates on the repaired source:

| Gate | Result |
| --- | --- |
| Portable JVM grammar | 13 tests / 118 assertions; 0 failures, 0 errors |
| Full Rheos Shadow autorun and separate native Node | 215 tests / 1,227 assertions in each run; 0 failures, 0 errors |
| Rheos test compilation | 161 inputs; 0 warnings |
| Rheos lint and isolated proof-script lint | 0 errors, 0 warnings |
| Server / CLI / GitHub projector / app releases | 111 / 115 / 75 / 95 inputs; all 0 warnings |
| Required eta-mu CLI tests and workflows | 174 / 391 plus 6 / 78; 0 failures, 0 errors |
| eta-mu CLI test compile and lint | 200 inputs; 0 warnings; lint 0 errors, 0 warnings |

The existing 50,000-character malformed-input and trailing-whitespace timing
guards remain unchanged and pass on both runtime families. Existing architecture
diagnostics that the repository classifies as informational remain informational;
no linter configuration or suppression changed.

The shared verified Rheos CLI and eta-mu router were in use by other agents.
The new `packages/rheos/scripts/verify-inline-sequence.clj` reads the existing
Shadow configurations and changes only build IDs and output locations. It
retains the full test namespace selection, autorun, release optimizations,
modules, and asset paths. From `packages/rheos`:

```bash
clojure -M scripts/verify-inline-sequence.clj test
node target/single-line-test/test.cjs
clojure -M scripts/verify-inline-sequence.clj release
pnpm run lint
clj-kondo --lint scripts/verify-inline-sequence.clj
```

The four releases live under `target/single-line-release`; no shared `dist`
output was overwritten. SHA256 checks after all gates confirm both shared CLI
artifacts are unchanged. The freshly built isolated Rheos CLI records the owning
card's passing evidence. No dependency manifest, lockfile, historical event,
review thread, or remote branch was changed by this repair. Parent coordination
still owns prerequisite restacking, external re-review, publication, and merge.

Scratch logs are under `/workspace/scratch/3655842e43cf/recovery/` with prefix
`rheos-single-line-`: `jvm-red.log` and `node-red.log` contain the original
30-failure runs, `parity-red.log` contains the additional 3-failure run,
`jvm-green.log`, `full-test-compile.log`, `full-native-green.log`, `releases.log`,
`lint.log`, `proof-script-lint.log`, `router-tests.log`, and `router-lint.log`
contain final gates. `shared-cli-after.log` records the unchanged artifact checks.

The fresh isolated CLI appended the result to the owning Rheos card. Receipt
`34c77f19-4310-42a0-a48b-ed72bc888c8f` passes `receipt validate 1`; Session Mycology
recorded reflection `4fb17aba-c226-4f10-86bd-4db9456a5750`. Existing ledger bytes
remain intact and new records are appended on this branch.

The final byte-prefix audit initially exceeded Node's default 1 MiB child-output
buffer while reading the 1,758,554-byte historical kanban ledger. Giving this
read-only audit an explicit 8 MiB capture buffer resolved `ENOBUFS`; no data was
truncated. It confirmed complete unchanged prefixes for the kanban ledger
(1,758,554 bytes), receipt ledger (268,854), reflections (36,579), and session
memory (32,541). The small result is retained in the scratch log
`rheos-single-line-prefix-proof.json`.
