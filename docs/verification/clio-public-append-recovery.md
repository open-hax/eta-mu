# Public append recovery after an uncertain write

Scope: actual Codex review on foundation `ff48f090965be5c17cca1e3662d7402b383510c1`, PR334 review `PRR_kwDORu27H88AAAABNSlOYw`.

The low-level kernel already revalidates and forces both inode and parent when given an identical event. The public runtime and CLI generated an event internally, then discarded its UUID and timestamp when append synchronization failed. Repeating the public append generated a different event for the same stream slot. The visible first write then correctly caused a conflict, but callers had no exact public recovery input.

## Failure-first evidence

The recovered source was restored from the actual reviewed commit in an isolated Git worktree after workspace maintenance removed the previous active checkout and tools. Existing saved receipts were treated as historical evidence; current source must run again.

The first native JVM reproduction ran 6 tests / 40 assertions, with exactly 2 failures and no errors. Both failures were missing `:clio/append-recovery` after a real event was already visible: one injected owning-channel force failure and one injected parent directory force failure. The original operation remained a failure in both cases. Log: `clio-public-jvm-red.log` in the recovery runtime logs.

Node plus the actual published launcher then ran 11 tests / 61 assertions, with 6 failures and no errors. Four assertions reproduced missing recovery data; two additional failures revealed that NBB's `binding [*out* *err*]` still sent CLI errors to stdout. The native process boundary now writes complete diagnostics synchronously to stderr before exit.

## Recovery contract

An exception from admission or persistence retains its original error data and cause and additionally carries `:clio/append-recovery`, containing the exact event and an absolute ledger path. This is a candidate to retry, not proof of durable admission. The explicit `runtime/retry-append!` operation consumes that data without generating UUIDs or timestamps. It reloads historical schema revisions, validates the event and existing ledger, and delegates to canonical locked append. An already-visible event must still pass inode and parent synchronization before returning `:already-present`.

The CLI prints the same EDN on stderr while exiting unsuccessfully, then accepts it through a separate `retry-append` command. No hidden retry, guessed identity, discarded competing write, or corruption repair is permitted. A partially written invalid EDN record remains a refusal; this recovery is for an exact candidate, including a complete visible record whose durability is uncertain.

## Peer review and path identity

Reciprocal review found that lexical absolute-path normalization could redirect a valid path containing a symbolic link followed by `..` to a different existing ledger. Native regressions created both ledgers and reproduced 4 failures per host: JVM 7 / 60 and Node 9 / 68. Simply preserving that spelling would leave the Node adapter's existing parent-path calculation forcing the lexical directory.

Recovery therefore resolves the existing target through the filesystem before admission, recording its real path. There is no fallback to appending an unresolved path after failed resolution. The extern adapters classify genuine missing-path errors; infra preserves the existing `:clio.ledger/missing-file` refusal while unrelated filesystem errors propagate.

An intermediate repair using Node `fs.realpathSync` still failed the new test: its JavaScript implementation normalizes `..` before following symbolic links. The actual native reproduction read the intended file directly, found the lexical file through `realpathSync`, and found the intended file through `realpathSync.native`. The final Node boundary uses the native resolver; JVM uses `Path.toRealPath`. This binds recovery to the resolved path, not an immutable inode guarantee.

## Final execution status

The first recovery implementation passed BB 29 / 182, JVM 76 / 351 and NBB/Shadow 74 / 358, plus strict Clio lint and boundary checks. Those results preceded the path correction and are not final-source evidence.

The final immutable implementation is `a93288017c9c1d620c90ebce863e84b5d7ea1f44`, tree `8950cab3ac81b89b33be1e1047672562529a54d1`, following protocol repair `10d42d85`. The complete advertised Clio test command exited zero: BB 29 / 182, JVM 77 / 355, NBB 75 / 362 and actual Shadow autorun 75 / 362, each with zero failures/errors. Shadow compiled 118 inputs with zero warnings. Full Clio lint reported zero errors/warnings and a clean extern boundary (one existing informational diagnostic).

The freshly rebuilt protocol consumer on that same Clio implementation passed 76 tests / 282 assertions plus 19 native JavaScript tests, with no skips or TODOs. Its test/library builds compiled 139 / 112 inputs with zero warnings; full lint and strict public TypeScript declarations passed. Real tests cover repeated native synchronization refusal, exact successful reflush, unchanged UUID/timestamp/event, changed-candidate collision refusal, actual CLI stderr/exit behavior, real symbolic-link path selection, and all three protocol review findings. A second read-only peer review of the immutable implementation found no confirmed remaining defect.

Exact log hashes and implementation identity are recorded in [the evidence manifest](evidence/clio-public-recovery.json). No source changed during the final complete Clio or protocol commands.

Mandatory eta-mu CLI gates freshly passed 174 / 391 plus workflow regression 6 / 78, lint zero errors/warnings, test compilation 200 inputs / zero warnings and release CLI 166 inputs / zero warnings. The freshly built canonical CLI also performed real read-only kanban count, receipt schemas and session schemas commands. Its supporting Rheos CLI compiled 115 inputs / zero compiler warnings; cold Clojure dependency resolution reported two pre-existing external `:paths` deprecation warnings (`../protocols/src`, `../chat-ui/src`), which are disclosed and remain outside the owned Clio/protocol source repair.

Frozen installation initially selected the legacy `@open-hax/eta-mu-cli` package; source inspection identified the actual CLI package name `eta-mu`. The corrected filtered install reused 55 packages and downloaded 25 more. Unbuilt sibling CLI bin warnings were recorded; no lockfile, dependency, gate or warning policy was changed to suppress them.

No hosted reviewer convergence or merge claim is made by this checkpoint.
