# Clio singular-reader process proof

Actual Codex review 3996269957 on foundation base
`310a422cd7a3b50a56d7ed3aef1f1b2a266ac31f` identified that the public
`clio.infra.ledger/read-ledger` still read without the writer lock. The plural
canonical reader already used a locked snapshot. An overlapping append could
therefore expose an incomplete final EDN line to singular readers.

## Reproduction and repair

Two regressions in the advertised JVM suite exercise the public singular reader
across actual processes, using the package's native Node and JVM filesystem
adapters:

| Writer | Reader | Failure before repair | Result after repair |
| --- | --- | --- | --- |
| Node/NBB | JVM | `:clio.ledger/invalid-edn` returned in 7 ms while Node retained its lock | JVM waits for the completed append and returns the exact typed event |
| JVM | Node/NBB | Node exits with code 1 and `:clio.ledger/invalid-edn` while JVM retains its lock | Node stays alive while blocked, then returns the exact typed event |

Each writer appends half of a real event through its owning lock descriptor.
A separate marker signals that the partial line exists. A reader marker is
written at the real filesystem boundary immediately before the path read or
lock acquisition, covering both the broken and repaired implementations.
The Node writer retains the lock for another 250 ms after that signal; the JVM
writer checks that its Node reader cannot finish within 250 ms. Each then
appends the remaining bytes and releases the same lock. This establishes
contention before measuring its outcome rather than relying on simultaneous
process startup. Marker waits and peer completion are bounded at 20 seconds.
Both finalizers stop and wait for their peer before removing the fixture tree.

The kernel owner factored one descriptor-owning snapshot helper for singular
and plural reads, keeping singular absent-file inspection as `[]` and plural
missing-file refusal intact. The Node adapter also gained a pre-open guard for
the exact device/inode identity of held locks. That preserves prompt refusal of
same-process reentry and hard-link aliases after singular reads begin locking.
The process tests do not replace or stub the actual lock operation.

## Fresh verification

- Before the kernel repair: `pnpm test:jvm` exited 1 with **69 tests, 210
  assertions, 5 failures, 0 errors**. All five failures belong to the two new
  contention cases. Both peers still completed, and the final ledgers remained
  intact.
- After the kernel repair: the same advertised command exited 0 with **69
  tests, 210 assertions, 0 failures, 0 errors**.
- Scoped `clj-kondo` over `jvm_ledger_test.clj`, `jvm_peer.nbb` and
  `partial_writer.nbb`: **0 errors, 0 warnings**. `git diff --check` passed.
- Raw command logs: `runtime/evidence/clio-single-native-red.log` and
  `runtime/evidence/clio-single-native-green.log` in the sandbox runtime.

## Self-review and limits

The fixtures call public `read-ledger`, preserve the exact UUID/instant-bearing
event, and check the complete final ledger again after the peer terminates.
The marker hooks delegate to the original filesystem function; neither the
reader result nor the native lock is substituted. The fixture uses one ledger
inode throughout and never deletes or rewrites historical event bytes.

A separate read-only review of the kernel patch checked descriptor release in
`finally`, singular versus plural missing-file behavior, exact bigint-derived
Node inode identities, and cleanup if descriptor inspection fails. No confirmed
introduced defect was found in that scope. This proof runs on the sandbox's
Linux filesystem with its actual POSIX locks; it does not claim Windows or
adversarial path-replacement coverage. The kernel owner records the remaining
host, downstream package, lint, build, and external-review results separately.

## Node guard and combined singular-reader checkpoint

The Node regression first failed three assertions for singular unlocked reads
in its full 65-test / 183-assertion run. A separate held-lock hard-link test
failed both alias-refusal assertions. The final Node suite passes 65 tests /
186 assertions through both NBB and Shadow. Descriptor failure paths release
the lock, missing optional inspection creates nothing, and same-process reads
through the original path or a hard-link alias refuse before another descriptor
can disturb the held native lock. Exact bigint device/inode pairs avoid numeric
precision loss. The guard does not add protection against concurrent malicious
path replacement.

Fresh singular-reader checkpoint results are BB 25/75, JVM 69/210, NBB and
Shadow 65/186; protocols 71/217 plus 15 actual native Node tests; Sol 142/607
plus one native worker test. No test failures, errors or skips remain. Final
Shadow compilation counts are Clio 115 files, protocols test/library 136/111,
and Sol test/server 215/201, all with zero compiler warnings. Clio, protocols
and Sol lint and boundary gates pass, as does strict protocol TypeScript.

Two authoring errors (a test delimiter and an incorrectly quoted focused test
selector) were corrected before the corresponding behavioral RED evidence.
Initial Clio/protocol builds ran all tests successfully but emitted two native
Stats inference warnings. Those builds were treated as failures despite exit 0;
an explicit host type hint removed the warnings, and both package gates were
rerun. The focused `cljs.test/test-vars` alias reproduction reports failed
assertions without a nonzero exit; the assertions, not its exit code, establish
that RED. The later identifier-integrity finding has its own subsequent gates.
