# Protocol subscription startup delivery

This separate source correction follows query commit `501f7906`. It addresses
a confirmed live-update gap discovered while reproducing the PR334 query
findings. The canonical Clio provider card records the additional scope.

## Initial observation and controlled reproduction

The first query RED run reported four unexpected failures in the unchanged
`subscription-ledger-failure-reports-and-closes-test`: immediate corruption was
not reported and the subscription later received an event after repair. A
serial rerun passed those assertions. That rerun did not resolve the observation.

The real watcher used `fs.watchFile`, which establishes its initial stat
asynchronously. The existing service captures its event cursor, registers the
watcher, and immediately checks history again. A later write can still precede
that asynchronous initial stat and become the watcher's initial baseline.

A native probe isolated this interval without replacing filesystem APIs:

1. Start a fresh Node child with `UV_THREADPOOL_SIZE=1`.
2. Queue a real FIFO read to occupy the filesystem worker.
3. Subscribe through the actual compiled `createEdnServices` export, then append
   a valid Clio event while the watcher's initial stat is queued.
4. Open the FIFO's writer to release the worker and await a subsequent native
   stat barrier.
5. Observe no callback after 350 ms. Append a second event; both then arrive.

The probe output was:

```json
{"phase":"after-initial-stat","received":[]}
{"phase":"after-second-write","received":["during.initial.stat","after.initial.stat"]}
```

The committed regression instead requires the first event within the existing
3-second observation bound **without a second write**. It failed on both the
default Node 24.19.0 and restored Node 24.20.0 before the production change. The
failure is an actual empty callback list, not a compiler, fixture, or timeout
process failure. The test uses the existing sandbox and `mkfifo`; no service,
model, container, or credentials are involved.

## Correction and limits

The Node extern owns an unreferenced 50 ms interval that invokes the existing
canonical history callback directly. It does not depend on metadata change
notifications or their initial baseline. The existing cursor deduplicates
events and preserves canonical delivery order, including bursts and writes
from another process. This is read-side polling, not automatic write retries.

Closing the handle clears the timer exactly once and prevents any queued poll
from invoking the callback. A history-read failure closes the same timer before
reporting the error. The service still requires an explicit new subscription
after storage repair; callback failures retain their existing behavior.

Each active subscription now reads and validates history on idle ticks too.
That is a deliberate cost for the local EDN provider's reliable notification
behavior. It is not a large-ledger throughput claim, and a 50 ms interval is not
a guaranteed wall-clock delivery deadline when the event loop or a writer lock
is busy. The change leaves Clio locking, storage, cursor policy, and public types
unchanged.

## Verification

From `packages/protocols`, with the restored runtime activated:

| Command | Actual result |
| --- | --- |
| `node --test test/js/watch-startup.test.mjs` before repair | 1 test / 1 failure: first event never delivered |
| `pnpm test` after repair | CLJS 78 tests / 332 assertions, zero failures/errors; native Node 22 tests, zero failures/skips/TODOs |
| Test and ESM compilation inside `pnpm test` | 140 and 112 inputs, zero warnings |
| `pnpm lint:kondo` | Zero errors and warnings |
| `pnpm test:types` | Strict TypeScript declarations pass |
| `node --check` for both new native test files | Pass |

The startup test additionally proves exactly-once observation across subsequent
ticks, idempotent close, and no delivery for a write after unsubscribe. The full
suite retains the original corrupt/deleted ledger closure assertions, explicit
subscription reopening, legacy synchronous close handles, copied typed handles,
and independent-process history tests. The fixture was neither delayed nor
weakened to conceal the initial failure. Query JVM coverage remains the unchanged
2 tests / 50 assertions verified in `501f7906`.

Self-review checked timer ownership, cleanup before error reporting, queued
callback refusal after close, cursor reuse, and failure propagation. A native
directory watcher was considered but would require its own missed-notification
backstop; owned polling provides the required behavior directly. No remote
review closure, hosted CI, browser rerun, or merge is claimed by these gates.

## Local evidence fingerprints

Logs are under `packages/protocols/target/verification/`:

| Log | SHA-256 |
| --- | --- |
| `membership-range-red-cljs.log` (initial unexpected subscription failures included) | `abc081dc17e5565ead543e849eed27f52c7d7891a14c0cb86efcb95682b040d7` |
| `watch-startup-native-probe.log` | `c5586ff5ca498cbe6c9939c934eae2fdc210724ae8c867dcf4005b036e63e48f` |
| `watch-startup-red-activated.log` | `3748be5ba319be9b40dc5dec828150e420c446ffe19f055c00a97251ce98ad16` |
| `watch-startup-green-test.log` | `f427ab53d78f2bbd60eba67c0146d430181d41fb1d52b50853f2bc5161938c8e` |
