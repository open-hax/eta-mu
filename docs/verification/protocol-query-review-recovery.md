# Protocol query and subscription review recovery

Owning card: `clio-local-edn-service-providers-and-deprecated-ledger-retirement`.
Review: eta-mu PR #334, comments 3996585213, 3996585219 and 3996587456.

## Discovery and scope

The restored provider validates a missing root query as an optional match-all
query. The same validator also admits a null child inside `$and` or `$or`, where
that null becomes a match-all branch. Logical children need a stricter map
contract while preserving the existing optional root query.

The public `SubscriptionHandle` declares `id` and `close()`. The EDN provider
instead calls the extra internal `close!` key. A caller can legitimately copy
only the declared fields and then fail to unsubscribe. The test must compile
against the shipped declaration and execute against the actual ESM provider.

Range filtering calls `compare` directly. Generic document fields may contain
mixed scalar and collection types, so one incompatible value can abort an
otherwise valid query. Comparison must use compatible types and treat values
that cannot be compared as nonmatches, preserving existing same-type ordering.
Only the comparison itself may be caught; unrelated query, storage and schema
failures must continue to propagate.

## Verification status

Regression tests were added before source changes. This recovered worktree
initially had no Node dependencies or compiler outputs. The coordinator restored
the same Node/CLJS toolchain and a frozen pnpm installation. The first compiler
invocation fetched the declared Malli 0.17.0 through the restored Maven proxy.
No earlier deleted-worktree result is transferred to these source bytes.

The original protocol source came from foundation `ff48f090965be5c17cca1e3662d7402b383510c1`.
The regression run compiled that protocol source before the three repairs.
Native execution then failed in the exact reviewed behavior:

| Run | Observed result |
| --- | --- |
| RED CLJS test execution | 76 tests, 282 assertions; 8 failures and 16 errors; exit 1 |
| RED real ESM and typed consumer selection | 7 tests; 4 passed, 3 failed; no skips; exit 1 |
| GREEN advertised `pnpm run test` | 76 CLJS tests / 282 assertions; 19 actual Node tests; all passed; exit 0 |
| GREEN compiler outputs | Test: 139 inputs, 16 compiled, 0 warnings; ESM: 112 inputs, 11 compiled, 0 warnings |
| `pnpm run lint` | 0 errors, 0 warnings |
| `pnpm run test:types` | Strict TypeScript consumer passed |
| `git diff --check` | Passed |

RED errors included a missing expected rejection for a null logical child,
`Cannot compare true to 2`, and a runtime call through absent `close!` from a
valid typed copied handle. The native CLJS assertions also reproduced nested
incomparable vectors and unintended non-null comparisons against null operands.
The copied handle already passed strict type checking before its runtime repair.

The final package gate executes both compiler outputs and all native JS tests,
including the existing two-process open/read and durability regressions. It ran
with the coordinator's concurrent Clio recovery implementation present; the
larger Clio and CLI suites are separately owned and are not claimed by this
protocol result. The Node suite took 13.863 seconds and reported zero skips,
cancellations or TODOs. Runtime: Node 24.20.0, pnpm 10.14.0, clj-kondo 2026.08.04.

## Repairs and limits

- Logical children must be maps before scanning data or installing a watcher.
  Empty logical sequences and explicit empty query maps retain their existing
  semantics. The optional nil root query remains supported by the CLJS API.
- EDN `unsubscribe` calls the declared `close` function, retaining `close!` as an
  internal compatibility fallback. The compiled typed consumer copies only
  `id` and `close`, unsubscribes twice, and observes no further notifications
  while an independent live subscription receives the same durable event.
- Range comparisons require the same value type, compatible numeric types or
  instants. Only the isolated comparison catches incomparable values. Existing
  ordering for booleans, keywords, symbols, vectors and instants is tested;
  storage and schema exceptions continue to propagate.

The coordinating agent performed a read-only peer review of this protocol diff
and reported no confirmed defect. This is local peer review, not a claim that
the hosted reviewers have accepted a new published head. No external service,
PR publication or merge was performed by this slice.

## Local evidence

Logs are under `packages/protocols/target/verification/`. They are generated
evidence, not tracked build outputs. SHA-256:

| Log | SHA-256 |
| --- | --- |
| `protocol-review-red-compile.log` | `7a22739e766b8488beb76e444699c4873ee7ecdc568d67745e146eecb5d70f62` |
| `protocol-review-red-cljs.log` | `4d2c426c6a23d15398a1fa55501055df7628f8883cc8c597bd6c1c6061fc0958` |
| `protocol-review-red-js.log` | `b9621930dcd55076524d9225757918610ce87f043d2bf2d74a8df726fb655873` |
| `protocol-review-green-test.log` | `b0dc772f90f977e8f5236d4bd3521ecce97b40523cb86c9d5c30c714d94c68b9` |
