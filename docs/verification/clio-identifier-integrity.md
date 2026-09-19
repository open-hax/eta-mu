# Identifier admission preserves readable EDN

Actual Codex review 3996269954 against foundation `310a422` found that generic
JavaScript document keys such as `"bad key"` become keywords that `pr-str` writes
as unreadable EDN. The write could be acknowledged before the next replay
reported corruption. Discovery found the same gap for direct Clojure keyword
and symbol constructors, so the repair belongs in shared canonical admission.

The canonical encoder now prints an identifier, reads exactly one EDN form, and
requires the same identifier kind, namespace and name. The namespace/name checks
also refuse constructors whose embedded slash would change semantic structure
on replay. Reserved symbol literals cannot silently become numbers, booleans or
nil. Valid identifiers keep their existing canonical preimages. This is a
refusal of unsupported names; it does not introduce a mixture of string and
keyword property semantics at the JavaScript API.

The portable failure-first regression failed 14 assertions in 26 tests / 107
assertions before implementation. The public compiled JavaScript regression
independently failed both missing-rejection tests, covering top-level and nested
document keys. Its final passing assertions verify the previous ledger bytes
remain identical, a subsequent valid write succeeds, both accepted documents
survive reopening, and the rejected document never exists.

Final combined verification, including the singular-reader changes:

| Gate | Fresh result |
| --- | --- |
| Clio Babashka | 26 tests / 107 assertions |
| Clio JVM, including actual Node peers | 70 tests / 242 assertions |
| Clio NBB | 66 tests / 218 assertions |
| Clio Shadow | 66 tests / 218 assertions; 115 files, zero warnings |
| Protocols | 71 CLJS tests / 217 assertions; 17 native Node tests, no skips |
| Protocol test/library compilation | 136 / 111 files, zero warnings |
| Sol | 142 tests / 607 assertions; one native worker test, no skips |
| Sol test/server compilation | 215 / 201 files, zero warnings |
| Clio, protocols and Sol lint/boundaries | Zero errors and warnings |
| Public protocol TypeScript | Strict check exits 0 |

All listed tests finish with zero failures and errors. Logs use the prefixes
`clio-identifiers`, `protocols-identifiers`, and `sol-identifiers` under the
sandbox working root; the public RED log is recorded by its native test owner.
Initial test-authoring and inference-warning corrections for singular readers
are documented separately in `clio-single-reader-process-proof.md`.

Self-review checked recursive validation through maps, vectors and sets, exact
identifier structure rather than lossy printed-string equality, pre-append
validation, and unchanged valid canonical bytes. Existing malformed ledgers are
still refused rather than rewritten. This Linux sandbox proof does not claim
cross-platform native lock support or successful external review of a commit
that has not yet been published.
