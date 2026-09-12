# Foundation contract recovery, 2026-09-12

This continuation works from published PR334 head `fd7cd25645d6acf80c3e5909f3ceecb65b7b1148`.
The partial rescue `d0bf426` contains the literal typed-consumer driver and a
reconstruction specification. It does not preserve the entire earlier source
and does not carry earlier test results into this checkout.

## Review scope and discovery

The actual unresolved review findings inspected here are Codex `3995905881`
(record declarations), CodeRabbit `3995911077` (worker fixture lifetime), and
Codex `3995905880` (uncertain-write durability, owned by the companion Clio lane).
No current unresolved watch-coalescing finding was present.

The existing card is `clio-local-edn-service-providers-and-deprecated-ledger-retirement`.
Its prior plan promises generic protocol maps. The correction must describe
that behavior truthfully: unvalidated application fields require narrowing;
missing update targets may return null. Generated IDs remain strings. User
creation timestamps are server-owned and must not become mutable through the
public update method. Explicit non-map records are rejected at the boundary.

The initial recovered checkout had no runnable Rheos CLI or dependencies.
The coordinating Clio lane rebuilt the CLI and recorded this scope on the
canonical card. No direct lifecycle edit or unverified state transition was made.

## Native worker fixture lifetime

The prior verifier killed a worker and immediately removed its shared directory.
A timeout rejects the operation promise before the process and its pipes close.
The new native regression deliberately retains an inherited output pipe briefly
and checks the directory from that still-running process. With the old cleanup
body it failed: the worker reported `ready` then `missing`. After waiting on
independently captured child `close` promises, it reports `ready` then `present`,
and the directory is removed after closure. One test passes; none are skipped.

The verifier now starts the actual NBB executable with Node, avoiding a pnpm
wrapper whose death would leave its NBB child blocked on the test barrier.
Result parsing waits for `close`, ensuring stdout has drained. Timeout refusal
is preserved. The standalone native Clio concurrency verifier also freshly passed with two
actual Node/NBB processes: one accepted fact, one conflicting refusal, and
exactly one replayed envelope.

## Protocol results

The old declarations produced 11 TypeScript diagnostics with the new consumer:
incorrect narrowing and unused expected-error checks exposed falsely required
application fields and non-null update results. The corrected declarations pass
TypeScript 5.9.3 strict checking. The fixture is then actually compiled to ESM
and runs against the built public provider, preserving numeric labels and string
document content while checking missing update results.

Against the old runtime, the independent ESM cases reproduced four failures:
uncertain append retries were incorrectly acknowledged (companion Clio lane),
user creation timestamps were mutable, null record containers were admitted,
and graph neighbors could return numeric identities. All four were missing
expected refusals, not harness/import failures. After correction, generic edge
maps remain admitted unchanged; neighbor queries explicitly refuse malformed
output identities. Non-map refusal leaves the exact ledger bytes unchanged.

Fresh advertised `pnpm test`, with the recovered fatal-async guard supplied via
`NODE_OPTIONS`, passes 71 CLJS tests / 217 assertions and 8 native Node tests,
zero skips. The test build is 136 files / 0 warnings and the ESM library is
111 files / 0 warnings. Strict TypeScript and package kondo both pass; kondo
reports 0 errors / 0 warnings. Logs are captured under the shared runtime's
`evidence/protocol-types-red.log`, `protocol-runtime-red.log`,
`protocol-compile-green.log`, and `protocol-full-green.log`.

The original rescued typed driver was split so a compiler failure cannot hide
the independent timestamp, map-admission, or graph-result regressions. Earlier
identity tests are not claimed for this reconstructed source. Combined
current-head remote reviewer closure remains pending.
