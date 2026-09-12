# Clio file-alias parent durability repair

The Node and JVM adapters now bind the canonical ledger target before opening
the owning descriptor. Append, exact retry, and durability recovery sync that
target's parent even if the supplied file symlink lives elsewhere or is
retargeted while the lock is held. Caller-facing path return values are preserved.

## Review and reproduction

This repairs [Codex finding 3997117083](https://github.com/open-hax/eta-mu/pull/334#discussion_r3997117083),
thread `PRRT_kwDORu27H86hyZBc`, on published base
`e2e440c585e0373ff271c8de1afd8929adb0d6d1`. The source repair is commit
`30090a67a1f54a33cf1c2f7d74074ca59685d8cb`, tree
`b5998acee765a9e8311ee3d18a49bd98ad58f11a`.

The reviewer identified a visible ledger left by interrupted creation whose
directory entry had not been acknowledged as durable. Reopening that ledger
through a file symlink incorrectly synced the alias directory. The exact review
body was:

> **P2 Resolve ledger aliases before syncing their parent**
>
> When an interrupted creation leaves a target ledger visible but its directory entry unsynchronized, reopening it through a file symlink can incorrectly report durability: the lock token preserves the symlink spelling, so `sync-locked!` flushes the symlink's containing directory rather than the target file's parent. A power loss can then remove the target entry after `ensure-durable!` or an exact retry has succeeded; resolve the locked target before selecting the parent fence, as the public runtime append path already does.

Source discovery found the same path handling in the JVM adapter, so both
adapters received matching regressions and repairs. The tests use real files,
native file descriptors or JVM channels, existing inode locks, and actual sync
operations. Observers inject a failure at the real target parent; no fake ledger
or synthetic lock token substitutes for the filesystem.

| Case | Before repair | Required behavior |
| --- | --- | --- |
| Interrupted creation reopened through absolute or relative file symlink | Recovery succeeds while the target parent remains refused | Surface the refused target fence |
| New event appended through the alias | Append reports success after syncing the alias parent | Preserve visible event but report uncertain durability |
| Exact retry of that event | Retry reports already present without the target fence | Refuse until target parent sync succeeds; retain one event |
| Symlink retargeted after lock acquisition | Fence follows the alias directory | Continue syncing the original locked target and parent |

Before changing production source, the complete new Node durability suite
produced **12 tests / 101 assertions / 11 failures / 0 errors**. Its JVM
counterpart produced **10 tests / 93 assertions / 11 failures / 0 errors**.
The successful-retry traces also demonstrated the defect directly: they contained
the alias parent where the target parent was required.

## Implementation and review

`clio.extern.js.fs` uses its existing native `realpathSync.native` boundary before
opening the descriptor. That boundary preserves symlink followed by `..` path
semantics. The lock token keeps the supplied path and adds a separate target path;
the local ownership map, parent fences, and release use the canonical target.

`clio.extern.jvm.fs` similarly uses its existing `Path.toRealPath` boundary before
opening the channel and stores the target in the active lock entry. The existing
process guard and inode identity checks remain in force. Both implementations
retain the same read-only lock behavior and cross-process hard-link exclusion.

The root agent independently reviewed both adapter diffs against the published
base and found no introduced ownership or sequencing defect. Its review checked
resolution before open, matching ownership release, retained caller return paths,
and the retarget regression. That was source review; the following results are
actual executions in the existing Node/JVM sandbox.

## Final gates

From `packages/clio`, with the restored runtime activated:

```bash
pnpm run test:bb
pnpm run test:jvm
pnpm run test:nbb
pnpm run test:shadow
pnpm run lint:kondo
```

| Gate | Result |
| --- | --- |
| Babashka | 29 tests / 182 assertions; 0 failures, 0 errors |
| JVM | 80 tests / 388 assertions; 0 failures, 0 errors |
| NBB on Node 24.20.0 | 78 tests / 395 assertions; 0 failures, 0 errors |
| Shadow on Node 24.20.0 | 78 tests / 395 assertions; 0 failures, 0 errors |
| Shadow compile | 118 files, 117 compiled, 0 warnings |
| clj-kondo | 0 errors, 0 warnings |
| Extern boundary and diff whitespace | Clean |

The first JVM RED command also ran the full existing JVM suite, yielding
79 tests / 383 assertions / 10 failures / 0 errors before the retarget regression
was added. Those failures were retained; they were not converted to skipped tests.

Scratch execution logs are under
`/workspace/scratch/3655842e43cf/recovery/clio-alias-`: the `node-red-complete.log`
and `jvm-red-complete.log` files contain the final RED runs; `bb-green.log`,
`jvm-green.log`, `nbb-green.log`, `shadow-green.log`, and `lint.log` contain the
passing gates. A fresh worktree reused the installed pinned dependency trees
through temporary local links, avoiding another package download. The links are
removed at handoff; no package manifest or lockfile changed.

The verified companion Rheos CLI recorded the scoped plan and passing evidence
on the existing Clio card. Receipt River rejected an initial `verification` kind
before writing because it is outside the declared kind vocabulary. Using the
declared `test-run` kind produced validated receipt
`9aff7874-6812-4984-9c0b-a5ac1d027b4c`; Session Mycology recorded reflection
`8c2207e1-a438-485a-9ab0-e4d34b414021`. No policy or receipt schema was changed.

The guarantee remains limited to Clio's existing supported filesystem durability
and cooperating-writer assumptions. This does not make externally created
symlinks durable or add protection against arbitrary concurrent directory
renames. No remote review thread, branch, or PR was mutated by this repair.
