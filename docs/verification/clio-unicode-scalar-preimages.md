# Unicode scalar admission for portable Clio identities

Actual Codex finding `3996422912` on foundation commit
`6c5af6077d069620583b29a180eb925a0805e94b` identified malformed-Unicode hash
divergence. The successor was developed in the isolated
`eta-foundation-schema` worktree; the reviewed predecessor remained frozen.

## Reproduction and cause

A host string can contain an unpaired UTF-16 surrogate even though that unit is
not a Unicode scalar. The previous string and keyword/symbol paths admitted it
unchanged. Printing the canonical EDN did not prove that UTF-8 encoding would
retain the value.

Actual pre-fix calls to `canonical/canonical-edn` followed by the package's
native `crypto/sha256` produced these results on JVM/Babashka and Node/NBB:

| Canonical string payload | JVM SHA-256 | Node SHA-256 |
| --- | --- | --- |
| Literal `?` | `5f28e93f159baa4293d518ba78af83a28d0189bbda0042f9a8780d9c71161581` | Same |
| Literal U+FFFD | `be9e91236df1e242110114a62fed898b88ce4a5a47d9ca918bc1ba6b147295f5` | Same |
| Lone U+D800 | Hash of literal `?` | Hash of literal U+FFFD |

Thus the same admitted value diverged across hosts, and distinct values collided
within a host after lossy replacement. This was reproduced with native encoders,
not an imitation hash implementation.

## Repair

The canonical shape now scans one UTF-16 code unit at a time using portable
substring and string comparisons. A high/low pair advances by two units;
unpaired high or low units refuse with `:clio.canonical/invalid-unicode` and the
code-unit offset. The same guard checks identifier namespace and name before
their existing printed-EDN round-trip check. Nested values and map keys already
recurse through canonicalization, so they receive the same admission rule.

The scan is linear and uses no platform-specific character representation,
replacement policy or Unicode normalization. Valid data retains the old
preimage and hash protocol. Three exact native hashes pin mixed BMP and
supplementary text, U+10000 and U+10FFFF across all four hosts. Additional cases
retain the U+D7FF/U+E000 boundaries, literal U+FFFD, ordinary text and distinct
composed/decomposed strings.

Previously persisted bytes are not rewritten. If a malformed source value had
already been replaced during an earlier write, its lost code unit cannot be
reconstructed from the persisted replacement alone. Recovering that original
intent requires the original input or other provenance. New malformed inputs
are refused before they can enter the canonical persistence path.

## Failure-first and final gates

The new portable tests ran against the old implementation before changing the
canonical source. Each host reported exactly **57 failures and 0 errors**:

| Host | Tests / assertions before and after repair | Final result |
| --- | --- | --- |
| Babashka | 29 / 182 | 0 failures, 0 errors |
| JVM Clojure | 75 / 329 | 0 failures, 0 errors |
| Node through NBB | 70 / 301 | 0 failures, 0 errors |
| Node through Shadow CLJS | 70 / 301 | 0 failures, 0 errors |

Cases include standalone, reversed, repeated and trailing malformed units;
string values inside maps/vectors/lists/sets; string map keys; and keyword/symbol
names and namespaces. These assertions fail because rejection is absent, not
because a fixture fails to parse. Valid preimage/hash assertions passed before
and after the repair.

The final four host runs include the concurrently completed runtime/schema
snapshot-order helpers from the identity owner. Shadow compiled **115 files,
14 changed, 0 warnings** in **21.53 seconds**. The advertised package lint
completed with **0 errors, 0 warnings**, and the extern boundary gate was clean.
`git diff --check` was clean. No dependency installation or runtime change was
needed for the repair.

One verification obstacle remains relevant to the project: the failure-first
Shadow command returned exit 0 despite its 57 failed assertions. The displayed
test counters were treated as the gate. The final run's explicit zero failure
and error counts, not its process exit alone, establish the corrected result.

Reproduce from `packages/clio` with `pnpm test:bb`, `pnpm test:jvm`,
`pnpm test:nbb`, `pnpm test:shadow`, and `pnpm lint`. Fresh command logs are under
the sandbox runtime's `evidence/clio-unicode-{host}-{red,green}.log` paths.

Author and independent bounded source reviews found no confirmed introduced
defect in pair advancement, malformed-unit refusal, identifier coverage or
unchanged valid preimages. The review also checked the separate schema loader's
read → load revisions → validate → durability fence → release ordering; that
change has its own actual race regression and publication evidence.
