# Axxium review after workspace recovery

Scope remains the `axxium-wiki-identity` card and PR #333. The sandbox maintenance removed the active checkout and toolchain. This work starts from the published `64598f0ba9a3cd0f014bf634f834a74712e2aa65` checkpoint in a newly registered worktree. Prior test results are historical evidence, not proof of this restored revision.

The review slice covers current credential readiness (Codex 3996616830), pure passkey admission (3996616831), retained bcrypt dummy work (CodeRabbit 3996646774), callback replay exchange accounting (3996646778), and the three accompanying fixture findings. The acceptance gate is the advertised full Axxium test, both release artifacts, zero-warning lint, boundary check, built ESM/TCP consumer, and actual native concurrent-startup tests.

## Session lifetime decision

The EDN identity provider intentionally uses a 24-hour absolute lifetime for opaque revocable sessions; its browser cookie also uses 86,400 seconds. This adoption keeps that policy rather than silently extending new identity sessions. Reads do not slide or renew the expiry. Logging in creates a new session, and current actor status and revocation are checked on use.

This differs from the retained PostgreSQL/JWT provider, whose `JWT_EXPIRY_HOURS` defaults to 168 hours (7 days, 604,800 seconds). That environment variable continues to configure the retained provider; it does not configure EDN identity. Consumers moving to EDN identity should expect daily authentication and separate session credentials. Multi-day EDN sessions are not currently an exposed option. This addresses eta-mu finding 3996590328 as an explicit migration behavior, not a claim of backward-compatible session duration.

## Discovery notes

The requested exact audience-rejection assertion exposes a real boundary discrepancy: Google's nonce validation returns the Axxium `:invalid-provider-response` code, but `jose` audience validation currently throws its native `JWTClaimValidationFailed` error. The regression must distinguish the `aud` claim from an unrelated transport/configuration error; a broad catch-and-pass is insufficient.

Credential health must inspect references in the current projection, rather than historical facts or arbitrary files. Retired credentials must not remain a readiness dependency. The health response must not include credential paths or private bytes.

Verification results will be appended after actual execution. No live external OAuth consent or PostgreSQL service proof is implied by local issuer/adapter fixtures.

## Recovery obstacles observed so far

- The team Git mirror clone asked for unavailable credentials. The ordinary GitHub HTTPS clone succeeded; no access control or approval bypass was used. A detached primary clone owns the registered implementation worktree.
- Surviving toolchain directory names contained no usable binaries. The restored runtime supplies the same Node/ClojureScript/Babashka/JVM stack. Axxium's frozen filtered pnpm install completed in 116 seconds: 256 packages, 251 downloaded and 5 reused from the shared store; the actual filesystem-lock native addon loaded its Node 24 prebuilt successfully.
- The first filtered install also named a nonexistent `@eta-mu/eta-mu` package. pnpm explicitly reported that filter matched nothing; the correct CLI package name is `eta-mu`. The Axxium/Clio dependency filter itself succeeded. This result does not claim the CLI was installed or built.
- The restored strict linter caught one extra parenthesis in the strengthened replay fixture and a tautological assertion in the new passkey domain tests. Both were corrected before behavioral verification. These are test-authoring mistakes, not reproduced product defects.
- A documentation append initially used a repository-relative path from the package working directory and failed without changing files. Repeating it with the package-relative path saved this note.
- The fixed bcrypt dummy digest was produced locally by the installed bcryptjs library at cost 12, matching the retained provider's default cost, and a wrong-password comparison returned false. The constant is public work material, never an account credential; the dummy path must always reject even if someone supplies its known input.

## Implemented behavior and self-review

- Readiness replays current Clio state and authenticates the referenced credential and ceremony ciphertext while holding the operation lock. This prevents checkpoint cleanup from racing the probe. Missing/corrupt material yields a sanitized 503; removed credentials and their historical references are excluded.
- Passkey verification stays in the WebAuthn extern boundary. Pure `domain.identity-passkey/login-transition` receives the verified proof and generated values, rechecks the current active actor and exact credential, validates the user handle, signature counter, browser/purpose/expiry, and refuses replacing an existing session. The counter rule matches the installed SimpleWebAuthn 13.3.3 implementation: unsupported zero may remain zero; otherwise it must increase. A successful transition atomically consumes the challenge, updates the counter and creates the session. The durable completion-attempt reservation remains outside that transition and remains spent when admission refuses.
- Retained password login performs one actual bcrypt comparison for a missing/inactive email before returning the same 401 response. The helper also refuses the known dummy password unless a real credential hash was supplied. Cost 12 matches the default; this is not a claim of strict constant-time behavior across configurable historical costs.
- The Google extern maps only the SDK's actual `JWTClaimValidationFailed` to `:invalid-provider-response` with the stable claim name. The audience fixture asserts both the code and `"aud"`; unrelated transport errors retain their existing behavior. The token, claims payload and native cause are not included in the mapped error.
- Generic callback replay asserts the provider exchange count after the replay. OAuth/PGP/passkey injected publication failures remain installed until their awaited operation settles. Native startup JSON is decoded from stdout only; combined stdout/stderr remains available for failure diagnostics. The workers deliberately emit a delayed stderr diagnostic to exercise that separation.
- The existing async test guard documentation now names its two-check-phase observation window and requires tests to await their work. It does not promise completion of arbitrary detached tasks.

The parent agent reviewed the delegated passkey extraction, and its author independently reviewed the parent's readiness/bcrypt/OIDC repairs. Neither scoped review found a blocking defect. These local reviews do not replace the actual Codex, eta-mu and CodeRabbit reviews of the published successor.

## Actual verification

1. Original infra and unchanged health/bcrypt/OIDC implementation plus new regressions: **126 tests / 1,074 assertions, 16 failures, zero errors**. The failures were six actual signed-passkey collision state assertions, four skipped-bcrypt assertions, four real TCP credential-readiness assertions, and two OIDC audience error assertions. The compiler processed 197 files with zero warnings. The five new pure domain tests passed, so the extraction itself is not falsely reported as a failing behavior.
2. The first post-fix attempt stopped on an extra closing parenthesis in the newly added dummy-password test. It was a harness parse failure and is retained separately. After fixing it, the full guarded suite passed **127 tests / 1,078 assertions, zero failures/errors**, with 197 compiler inputs and zero warnings.
3. Both advertised releases passed: server and library each processed **129 files with zero warnings** (36.21 seconds and 16.88 seconds respectively).
4. Restoring only the native tests' old combined-stream JSON parsing reproduced **three failures in three tests**, all actual JSON parse errors after child diagnostics. `finally` restored the corrected sources before the final native verification.
5. The advertised built ESM/TCP consumer passed signup, private Clio restart, authenticated read, forged-header/foreign-Origin refusal, committed logout revocation and protected linking. All **three actual native concurrent-startup tests passed with zero skips**. The output explicitly retains the warning that live external OAuth consent requires operator configuration.
6. Configured lint passed with **zero errors/warnings**, and the strict JavaScript boundary checker found no violations. A final full test/lint run follows whitespace-only fixture indentation cleanup; exact retained results and log hashes are recorded in the adjacent evidence JSON.

No dependency manifest, lockfile, Clio/protocol/Rheos source, test selector, skip, lint policy or output guard was weakened. No actual PostgreSQL deployment or external provider-consent round trip is claimed.

## Canonical provenance

The freshly built sibling eta-mu CLI was verified from this worktree with the 299-card inventory and its receipt/session schema outputs, then used to append the `axxium-wiki-identity` card, Receipt River and session reflection here. Initial singular `schema` probes were unsupported; the documented plural `schemas` commands succeeded without state changes. The card remains in progress: these package gates do not authorize a claim that the root browser/global review work is finished.

The final rerun after indentation cleanup again passed **127 tests / 1,078 assertions**, zero failures/errors; 197 compiler inputs, four recompiled files, zero warnings. Final lint was zero errors/warnings and the boundary check was clean. Runtime/build source did not change after its successful releases and native proof.

## Combined foundation verification

Published Axxium `1a47a7eadbd612107585e9f44cbff22cc455fb99` and Clio
`1ef5c1ca4015c3e9f5c01d50d423f5a1faf5ed6a` were fetched and checked against
their tested trees. A normal two-parent merge produced local source commit
`027da9ba19de31e86a72f30410b41ff11355be2b`, tree
`1fedf4314f9844d8f73ad64ce99baebaaee41db0`.

Source and test files merged without conflicts. Three evidence ledgers conflicted
because the older identity history had interleaved its appends through the common
foundation history. Resolution verified that every common line remained an ordered
subsequence, preserved the complete incoming Clio ledger byte prefix, and appended
all identity-only lines in their existing order. No record was discarded or edited.
The three files retained respectively 10, 23 and 9 identity-only records, plus each
foundation's new record. The canonical owning-card comment records this merge scope.

Fresh verification on the combined source passed:

- Axxium: 127 tests / 1,078 assertions; test 198 inputs, server and library each
  130 inputs; every compiler reported zero warnings.
- Actual built ESM/TCP signup, private Clio restart, authenticated read, forged
  identity/header and foreign-Origin refusal, durable logout and protected linking.
  Three concurrent-startup tests passed with zero skips.
- Protocols: 76 tests / 282 assertions plus 19 native tests with zero skips;
  test/library 139/112 inputs, zero compiler warnings; strict types passed.
- Both packages' configured lint reported zero errors/warnings; Axxium's boundary
  checker found no violations.

The native identity script retains its explicit operator-configuration warning for
live external OAuth consent. This is not evidence that such a consent round trip
occurred. Logs are retained in the root recovery evidence as `combined-identity-*`
and `combined-protocol-*`. The first dependency-install command used two incorrect
package filters; the corrected frozen install used `@open-hax/axxium` and
`@open-hax/protocols` before any verification. No dependency policy was weakened.

This combined package proof precedes the full Knoxx/browser and hosted-review
gates. The documentation-only closeout does not alter the verified runtime source.
