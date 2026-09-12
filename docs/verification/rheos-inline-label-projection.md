# Rheos plain inline label projection

Epiphany's unchanged `epic-10-program-relationship-graph.md` contains `labels: [graph, relationships, code, provenance]`. The rebuilt Rheos CLI projected that field as an empty vector. Both task reads and board snapshots shared a decoder that accepted only double-quoted inline string members; unsupported values were omitted and the board defaulted missing labels to `[]`.

The shared decoder now also accepts plain word/path labels, including spaces and colon-qualified names, mixed with quoted members. It validates the entire sequence before extracting members. Quoted commas remain part of their label. Plain booleans, nulls, numeric values, mapping syntax, nested collections, malformed delimiters, and trailing text remain unsupported. This remains a partial YAML decoder; it does not claim to interpret arbitrary YAML. Source cards and historical ledger records are not rewritten by reads or snapshots.

The canonical task received the scoped plan through the rebuilt Rheos CLI before implementation. A fresh filesystem regression called both the real `kanban_read_task` dispatch and board projection. Before the fix it produced three failed assertions; afterward it preserves the four labels and checks that the original card bytes are unchanged. Portable grammar coverage separately failed four assertions before the fix and passed afterward.

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
