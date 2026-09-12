# Current startup candidate review

This ordinary successor of published `d4911c4e1af3d6d0e1ca716402e9f3b749acd361` fixes three current PR333 findings. The final advertised Axxium suite passes **151 tests / 1,290 assertions**, both release builds compile without warnings, configured lint and boundary checks pass, and the compiled TCP identity consumer plus all three native process tests pass without skips. The frozen browser dependency remains untouched in its separate worktree.

| Finding | Repair | Evidence |
| --- | --- | --- |
| Codex 3997257944 | The standalone health callback uses `^:async` and awaits `health-response`. | Existing real TCP health tests still cover corrupt/missing ledgers, referenced private blobs and transient native contention. This is an async-contract correction, not a claimed dynamic RED. |
| Codex 3997257948 | Prepared bootstrap credentials use the existing cleanup boundary. A colliding managed bootstrap winner enters the existing password and coordinate restart proof; each retry rechecks its expected snapshot. A colliding ordinary signup remains refused. | Two real EDN openers finish their real password hashes behind a barrier before admission. Matching requests both return the one persisted administrator. Changed password, explicit principal ID, username or email is refused, with one remaining credential blob. |
| Codex 3997257950 | ATProto selection retains its prepared reference and runs reference-aware cleanup in `finally`. The cleanup fences current history and cannot delete an accepted key after a lost acknowledgement. | Controlled opener interleaving and actual two-process startup scenarios check persisted blobs, one admission event, real SDK JWKS and restart. Lost-ack tests for both startup paths retain readable admitted credentials. |

## Actual failures, fixes and limits

The unchanged source first compiled 140 inputs with zero warnings, then failed **11 of 31 assertions** across four direct native tests. Matching bootstrap contenders produced one success and one rejection. Bootstrap refusal and ATProto winner selection left randomized encrypted candidates unreferenced on disk. The first repair passed the same four tests and 31 assertions. Final tests add explicit lost-ack preservation and run with the final async operation-lambda form as part of the complete 151-test suite.

The strengthened existing process test also runs against the frozen old compiled library through its existing `AXXIUM_TEST_MODULE_URL` option. Its first attempt reproduced the leak in one scenario but missed the native barrier in the contention scenario: the hook imported the package copy relative to cwd while the selected artifact loaded its own copy. `createRequire(moduleUrl)` binds the hook to the artifact actually under test. With that fixture correction, **both old process scenarios failed on two remaining private-key blobs instead of one**. Both repaired scenarios pass. This records the initial barrier failure rather than treating it as a second cleanup failure or increasing its timeout.

The managed-bootstrap recovery reuses pure `bootstrap/require-restart!` and `bootstrap/restart-transition`; it introduces no new authority grant. Only a bootstrap marker can enter recovery, and the admitted current snapshot must still match after password verification. Native cryptography and persistence remain outside the domain. The existing cleanup boundary takes the operation lock, reads current references, forces durable history, and deletes only the supplied unreferenced candidates. Both new startup paths retain their current private material when a real commit succeeds and the caller loses acknowledgement.

Cleanup still has a finite retry budget and reports deferred failure without replacing the original result or exception. Process-crash orphan collection is not newly claimed. External OAuth consent remains operator-configured and untested; the existing native verification script prints this limitation explicitly. Full website acceptance, hosted review disposition and PR merge remain separate integration gates.

During implementation, a package command used the repository cwd and failed before execution, then was rerun from the explicit package cwd. An async-lambda edit briefly had an unmatched parenthesis, which configured lint rejected; naming the local operation simplified the form before the final successful build. Neither tooling failure is counted as a behavior RED.

## Reproduction

From `packages/axxium`, after activating the restored runtime:

```sh
pnpm exec shadow-cljs clj-run clojure.main/main scripts/compile-startup-candidates.clj
node --require ./scripts/shadow-test-error-guard.cjs target/startup-candidates.cjs
pnpm test
pnpm build
pnpm lint
pnpm boundary:check
pnpm verify:identity
```

Run each dependent step only after the preceding command exits successfully. The focused target writes only its own output in this isolated worktree. The final test build compiles 210 inputs (209 compiled); server and library each compile 138 inputs (81 compiled), all with zero compiler warnings. Full tests, release, lint, boundary and native verification all exit 0. No existing test assertion, compiler rule, timeout or gate was removed or weakened.

Independent read-only review by `protocol_review_repairs` found no remaining concrete issue in the three production changes, direct native tests or final process fixture. Canonical CLI commands appended the card, receipt and session reflection; complete previous history bytes remain prefixes of all three ledgers. [The evidence record](../evidence/identity-startup-candidate-review.json) captures source and gate hashes, exact output hashes, original artifact provenance, failure counts and final results.
