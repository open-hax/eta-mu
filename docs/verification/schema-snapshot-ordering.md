# Schema publication and ledger snapshots

Codex `3996422913` reported that a service reader could load schema revisions,
then observe a newly appended event whose schema was published between that
refresh and the ledger lock. Both ordinary queries and provider reopening could
therefore reject valid history with `:clio.schema/unknown-revision`.

The new runtime `canonicalize-files` captures immutable, locked per-file
snapshots first, then refreshes the immutable schema inventory and validates the
captured events. A schema must already be published before a writer can append
an event referencing it. This ordering preserves that causal relationship
without retrying corruption or claiming a transaction across partition files.

Reopening also has a durability fence. Merely correcting the history read would
leave that second validation using stale revisions. `ensure-durable-with!`
therefore reads through its owning exclusive descriptor, loads revisions while
still holding that descriptor, validates, synchronizes and releases in `finally`.
The previous `ensure-durable!` API delegates with its caller-supplied fixed
revisions; new runtime-aware callers use `runtime/ensure-durable!`. Protocols
and Sol now use the ordered read/reopen helpers; protocol no-change writes use
the same refreshed durability fence.

The regression performs real schema publication and an admitted append at the
old reader's native read-lock boundary. Both query and open failed before the
fix: **72 tests / 223 assertions, two failures, zero errors**. Both pass after
the repair. Deleting the actual newly referenced schema still refuses history;
there is no unknown-revision suppression. A separate injected schema-loader
failure verifies original error propagation, unchanged ledger bytes and a
successful subsequent lock/fence. Its first test draft incorrectly expected a
nil fence result; the existing Node fence returns its path. That fixture
assumption was corrected without changing production return behavior.

The regression uses one process with a deterministic native-boundary insertion
of a complete real publisher operation. Existing separate-process partial
append proofs continue to exercise actual interprocess locking. This report
does not relabel the new schema ordering fixture as two operating-system
processes. Fixed-revision append APIs retain their explicit contract and may
still refuse a cross-schema writer race; this change does not add hidden write
retries or weaken stale-stream admission.

Final gates on the combined Unicode/schema source pass: Clio BB 29/182, JVM
75/329, NBB and Shadow 70/301; protocols 73/227 plus 17 native tests; Sol 142/607
plus one native test. No native tests were skipped. Compiler file counts are
Clio 115, protocols 137/111, Sol 215/201, all with zero warnings. Advertised lint
and boundary checks have zero errors/warnings; strict protocol TypeScript
passes. Sol retains existing information-level architecture diagnostics.

Reciprocal source review found no confirmed defect in the callback ordering or
release behavior. Published-head review and required hosted checks remain
merge gates.
