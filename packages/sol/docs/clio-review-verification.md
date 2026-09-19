# PR334 Sol and Clio durability review

The September 12 review found three distinct boundaries that needed correction:

| Finding | Reproduction | Resulting behavior |
| --- | --- | --- |
| Sol selected the Linux-only EDN provider on every Node host | Platform fixtures rejected macOS/Windows defaults; an explicitly disabled real service turn also failed | Linux defaults to EDN; other hosts default to `disabled`. An explicit disabled configuration runs an ordinary volatile turn. Selecting EDN still exposes unsupported-host or disk errors. |
| Concurrent episodes could persist different envelopes under one wire ID | A second episode committed between the first writer's snapshot and Clio append; the focused suite had three failing assertions | A separate kernel-locked `admission.lock` covers the complete wire-ID decision and canonical append across all episode streams. Exact retries preserve the first wrapper; changed same-ID facts fail. Replay also refuses already-duplicated wire IDs. |
| JVM empty-ledger creation did not force its own inode | Ordering and injected-force-failure tests produced three failing assertions | The exclusive creating `FileChannel` is forced before closing, followed by the parent directory force. A failed inode force is never acknowledged. |

Final checks on the integrated source:

- Sol: **141 tests, 599 assertions, zero failures/errors**, 213 compiler files and zero warnings. The run used the recovered native-async error guard; assertion summaries were checked independently because Shadow compilation can return zero after failed tests.
- Sol production server/typecheck: **201 files, zero warnings**.
- Sol lint and the added Node fixture lint: **zero errors/warnings**. Existing architectural `info` diagnostics remain visible; these are not claimed repaired here.
- Clio JVM suite: **64 tests, 173 assertions, zero failures/errors**. Clio lint passed without errors/warnings.
- Actual Linux processes: `node packages/sol/scripts/verify-clio-wire-concurrency.mjs` launched two independent NBB processes behind a shared barrier. Exactly one changed cross-episode wire fact committed, one was refused with `:sol.clio/id-collision`, and reopening yielded one envelope.

The process probe uses the repository's canonical Clio source and existing NBB dependency graph. Its initial file-path invocation failed to resolve Clio's dependency configuration; invoking the worker namespace with `-m` from the Clio package fixed the lookup. Worker failures and deadlines now terminate visibly instead of waiting indefinitely at the barrier.

The kernel lock is on a separate, stable inode. A process-local inode guard refuses reentrant admission before opening a second alias descriptor. This does not claim hostile writers bypassing the Sol adapter obey its lock; replay rejects duplicate wire identities introduced by such writes. Cross-host durability support is unchanged, and the macOS/Windows policy was tested by injecting the platform boundary on Linux, not by claiming execution on those hosts.
