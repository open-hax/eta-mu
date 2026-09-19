# Read-only Clio replay with shared native locks

Actual CodeRabbit review 5646213434 found that locked public snapshots had
regressed read-only consumers: the snapshot used the writer's `O_RDWR` or
`READ`/`WRITE` descriptor even though replay only needs read access.

Both native filesystem adapters now expose `acquire-read-lock!`. Node opens
with `O_RDONLY`, takes shared `flock` where supported, and takes an authoritative
whole-file `F_RDLCK` POSIX lock. Its Windows branch requests shared `LockFileEx`.
The JVM opens a `READ`-only FileChannel and requests a shared whole-file lock.
Writers retain their existing exclusive lock and append-capable descriptor.
All modes use the existing owning-descriptor read/release and process-local
inode alias guard. The kernel owner routes public snapshots to this API.

## Failure-first permission evidence

The initial attempt to run another UID exposed a sandbox constraint:
`setpriv --reuid=65534 --regid=65534 --clear-groups` and UID/GID 1 both failed
with `setresuid failed: Invalid argument`. The user namespace maps only UID/GID
0. An attempted capability-drop invocation also could not change that context.
No environment or capability configuration was modified.

The effective, permitted and bounding capability sets are already zero. A real
Node filesystem probe against a newly created mode-0444 file established that
`r` opens successfully and `r+` fails with **EACCES**. Permission enforcement is
therefore real in this sandbox despite its numeric UID being 0; chmod alone was
not treated as sufficient evidence.

A persisted UUID/instant-bearing event was then made mode 0444. Both the public
JVM reader and an actual NBB child reader failed against the old implementation.
The advertised JVM suite reported **71 tests, 246 assertions, 3 failures,
0 errors**, exiting 1. The original ledger bytes remained intact.

After the repair, the advertised JVM suite completed with **72 tests,
254 assertions, 0 failures, 0 errors**. Its cross-host partial-writer regressions
remain active: a reader must still wait for an incomplete append to finish.
Their readiness hooks now include the shared-lock boundary and always delegate
to the actual filesystem operation.

## Portable descriptor and lifecycle checks

New tests on both hosts also use a file that *has* write permission, then attempt
to append through the read-lock token. Node must report **EBADF**, and the JVM
must throw **NonWritableChannelException**. This independently proves the
descriptor is read-only even on hosts whose privileges bypass mode bits.
The tests check unchanged bytes, refusal of read/write lock reentry through the
same path and a hard-link alias, and a successful exclusive writer after the
read lock is released. Lock and process cleanup remains in `finally` blocks.

The author reviewed mode selection, exclusion against the existing writers,
absence of creation flags, descriptor cleanup, exact inode identities and the
unchanged append/fsync path. Linux native behavior is exercised here; the
Windows branch is not claimed as a tested Windows deployment. An independent
host-mode review found no confirmed introduced defect in that scope.

The kernel owner completed the remaining fresh gates: BB **26/107**, NBB and
Shadow **67/226**, Clio Shadow **115 files/0 warnings**; protocols **71/217 plus
17 native tests**, compiler **136/111 files/0 warnings**, strict types clean;
Sol **142/607 plus 1 native test**, compiler **215/201 files/0 warnings**. All
reported native tests ran without skips. A partial mixed-host lint invocation
reported four unresolved NBB filesystem aliases; the authoritative full-package
lint resolved the complete graph and finished **0 errors/0 warnings**, with a
clean extern boundary. No linter setting or threshold was changed.

Publication and external-review status are recorded by the kernel owner.
Sandbox logs are `runtime/evidence/clio-read-only-red.log` and
`runtime/evidence/clio-read-only-green.log`.
