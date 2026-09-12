# Protocol membership and NaN review recovery

This successor starts from published `1ef5c1ca4015c3e9f5c01d50d423f5a1faf5ed6a`.
It repairs actual Codex PR334 comments
[3996993467](https://github.com/open-hax/eta-mu/pull/334#discussion_r3996993467)
and [3996993469](https://github.com/open-hax/eta-mu/pull/334#discussion_r3996993469).
The canonical Clio provider card records the plan before implementation.

## Behavior

- `$in` and `$nin` use an equality predicate, so matching `false` and `nil`
  produce a boolean match independent of the stored value's truthiness.
- Missing fields keep the existing null-equality behavior. `$exists` remains
  the way to distinguish absence from an explicit null value.
- A numeric NaN in either range operand, including nested vector members,
  is a nonmatch. The numeric `==` check is intentional: generic equality can
  return true for the same boxed NaN on a JVM-compatible host.
- Ordered numeric infinity query bounds and comparable finite/vector values
  retain their behavior. Clio's separate refusal of nonfinite persisted values
  is unchanged. No persistence, provider selection, or public type changes.

## Failure-first evidence

The two new portable tests initially produced **22 failures in 50 assertions**
on the actual JVM. Six are false/null membership inversions and sixteen are
nonthrowing scalar/nested-vector NaN comparisons. The compiled JavaScript
public-service regressions independently failed both new tests: `$in: [false]`
returned no record, and `$gte: NaN` returned a persisted finite record.

The first full CLJS run had those 22 failures plus four failures in the
unchanged corruption/subscription fixture. A serial execution of the same
pre-fix compiled artifact had exactly the 22 query failures. This was not
discarded as noise: a subsequent native FIFO/threadpool barrier confirmed a
separate watcher startup race. An event written while the initial `watchFile`
stat is pending remains undelivered until another write. The watcher repair is
tracked separately; the query gates below do not establish live-update safety.

## Final query gates

From `packages/protocols`, with the restored runtime activated:

| Command | Observed result |
| --- | --- |
| `pnpm test` | CLJS 78 tests / 332 assertions; native Node 21 tests, zero failures/errors/skips/TODOs |
| Test and ESM compilation inside `pnpm test` | 140 and 112 inputs, zero warnings |
| `pnpm lint:kondo` | Zero errors and warnings |
| `pnpm test:types` | Strict declared TypeScript consumer passes |
| JVM `clojure.test` for `membership-range-test` | 2 tests / 50 assertions, zero failures/errors |

The public-service tests write real Clio records, query the actual ESM exports,
and repeat through a reopened provider. Existing independent-process tests and
the executed typed consumer remain in the 21-test native gate.

The JVM command is:

```sh
clojure -Sdeps '{:paths ["src" "test"]}' -M -e \
  '(require (quote open-hax.services.domain.membership-range-test)) (let [result (clojure.test/run-tests (quote open-hax.services.domain.membership-range-test))] (when (pos? (+ (:fail result) (:error result))) (System/exit 1)))'
```

## Obstacles and self-review

The published Git object was absent from the initial Clio object store. Fetching
the exact local published object from the restored Foresight checkout allowed
an isolated worktree without changing remote state. Frozen offline installation
reused all 112 selected packages with zero downloads.

The first test draft had one missing closing bracket. Both JVM and Shadow
rejected it before running tests; the draft was corrected and strict lint passed
before collecting behavioral RED evidence. These syntax failures are not counted
as reproductions of either product defect.

A scalar-only NaN guard would leave vector comparisons broken. Read-only peer
discovery reproduced that case, and the portable and native regressions now cover
nested vectors. The recursive check only follows vectors, the supported compound
ordered values; it does not realize arbitrary lazy sequences.

The review checked that range comparison exceptions remain isolated, membership
empty sequences still behave correctly, missing/null policy is explicit, and
the guard does not reject valid ordered infinity bounds. Independent read-only
peer review by the Clio/Rheos lane found no confirmed remaining query defect.
No remote review closure,
hosted CI success, or merge is claimed. The separate startup notification defect
is addressed by the following source commit, documented in
[the subscription startup report](protocol-watch-startup-delivery.md).

## Local log fingerprints

Logs are under `packages/protocols/target/verification/`:

| Log | SHA-256 |
| --- | --- |
| `membership-range-red-jvm.log` | `bfc8a001b3fe9d2ee758334286a84acc9f2b27fcb7251434d8537f2dbfe7b8b1` |
| `membership-range-red-serial-cljs.log` | `d45e295d2381e32b67b9cb3e68e1c0b04c08874c4a0998a30666092e2b50448b` |
| `membership-range-red-js.log` | `b6e97fc10f4d42dc1db9ca30e4aab317e496a8e7e040ade28d9a7d214c74003c` |
| `membership-range-green-test.log` | `eab8185c744be4a00d6cf03d384751bb974f2062eb1a5f0d78f099127845c05e` |
| `membership-range-green-jvm.log` | `5115beed8d2323279ad27cf13cd7c806639d97349a53bb65437e8f5b39f3edd6` |
| `membership-range-green-lint.log` | `04f86a085fd92de496e65ba6273c8326c26854aac2122b91d43eb1d39a7bb56f` |
| `membership-range-green-types.log` | `9d5d6c87905a4b981c7b35b7c43e37c7090c156ee09293f514b30ef5753393e8` |
| `watch-startup-native-probe.log` | `c5586ff5ca498cbe6c9939c934eae2fdc210724ae8c867dcf4005b036e63e48f` |
