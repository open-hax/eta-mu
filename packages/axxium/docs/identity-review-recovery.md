# Identity review recovery

The prior sandbox directory was removed by workspace maintenance. This slice
was reconstructed from published PR 333 and its partial source rescue; none of
the lost checkout's test results are attributed to this source.

The reference ATProto SDK owns PKCE, PAR, DPoP and one-use code exchange. Its
configured local state and session stores now retry native Clio admission
contention without repeating the exchange. Private session material is sealed
once before retrying its admission. Both SDK writes and final verified identity
admission have a 30-second deadline and a finite 1,200-attempt cap, so a reversed
clock cannot extend admission indefinitely. This bounds retry waiting, not an
in-flight synchronous filesystem operation; a final authority recheck can run
after the last 25-millisecond delay. Unrelated failures are not retried.

Password admission uses the address Fastify derives through the embedding
host's `trustProxy` policy, with the raw socket as a direct-host fallback. It
never parses or trusts forwarding headers independently. Tests exercise both
configured and untrusted proxies and distinct password admission buckets.

The real NodeOAuthClient callback, state-store consumption, session getter and
DPoP JWK serialization are exercised against a controlled issuer boundary.
Tests hold a separate native lock descriptor both before state consumption and
after one-use code exchange. The stored session reopens, pending state is
consumed, exactly one exchange occurs, and no grant is revoked on successful
local retry. These are reference-SDK and local cryptographic proofs; live
third-party consent still requires operator configuration.

Initial reconstructed fixtures failed because the controlled issuer omitted
its real DPoP key; supplying the generated key made the SDK's actual session
constructor executable. A separate real proxy test first demonstrated shared
buckets despite trusted forwarding, then passed with Fastify's client address.

The uncertain identity-write regression reproduced three failures: bytes were
visible after a rejected fsync, and a projection-only retry acknowledged them
without another flush. After integrating Clio foundation `f22199ee` and calling
its validated locked `ensure-durable!` boundary for no-change decisions, the
retry refuses until the owning descriptor is flushed and adds no duplicate fact.

Final combined recovery gates: guarded tests 89 / 775, both release outputs
121 files with zero warnings, configured lint zero errors/warnings, and the
unchanged strict boundary scan clean. The actual compiled ESM/TCP consumer
passes signup, private Clio restart, authenticated read, forged-header and
foreign-Origin refusals, logout, and POST-only account linking. That probe
prints an explicit warning that live external OAuth consent remains untested;
these local proofs do not claim operator provider configuration.
# ATProto callback state follow-up

Codex finding 3996123683 exposed a real integration gap: the SDK callback's
query `state` is a lookup key, while its returned `state` is the application's
browser challenge. These are intentionally different values. The extern facade
now reads the stored app state without consuming it. Axxium checks browser
ownership before calling the SDK, compares the returned app state with that
validated value, and rechecks current authority during admission.

The new regression crosses the actual `NodeOAuthClient` through Axxium's
`finish!`, using a real Jose key and the durable SDK stores. It reproduced three
failures before the fix. A foreign browser cannot exchange the code; a replaced
returned app state cannot append identity facts; a valid callback exchanges once
and creates a usable local session; replay cannot exchange again. Older scoped
admission fixtures were updated for the new facade operation and remain labeled
as controlled fixtures.

An additional native fault regression reproduced three failures when reopening
`identity.edn` after interrupted creation. Identity open now validates and calls
Clio's inode-and-parent durability fence before returning a provider. The
successor is based on foundation `37b720d`; its browser predecessor remains
frozen at local `e0cdf35` until the root stack repeats verification.

The [official ATProto OAuth patterns](https://atproto.com/guides/oauth-patterns)
were checked again on 2026-09-12. Axxium retains the reference SDK for discovery,
PKCE, PAR, and DPoP, with private server storage and a local HTTP-only session.
The controlled-issuer callback proves the integration and storage boundary; it
does not claim live PDS discovery, PAR, nonce negotiation, or external consent.
Those require a reachable metadata origin and operator-selected provider setup.

Final successor gates on 2026-09-12: 91 tests / 794 assertions, no failures or
errors; server and library release builds each 121 files with zero compiler
warnings; kondo zero errors/warnings; strict boundary check clean. The actual
compiled ESM/TCP identity verifier passed signup, private restart, authentication,
forgery/Origin refusal, logout, and protected linking initiation. Its explicit
live-provider configuration warning remains applicable.

## Initialization and private-file recovery follow-up

Codex findings 3996174222, 3996174224, and 3996174226 exposed startup uncertainty
outside the already-fenced identity ledger. A visible master key can survive a
failed inode or parent flush; a ceremony checkpoint can survive a failed
post-rename parent flush; and another initial opener can win exclusive ledger
creation. Existing-key admission now validates and forces the same open key
descriptor followed by its private parent. Private directory ancestry is forced,
and ceremony pruning first validates and forces the checkpoint while holding its
stable operation lock. Reopening preserves the original key and checkpoint bytes.

Exclusive ledger creation catches only EEXIST, then validates the winner through
the normal replay and durability boundaries. Permission failures remain failures,
and malformed winning files are preserved and refused. The first concurrent
opener also needs to serialize the whole initialization: otherwise its new vault
can be mistaken by a second process for previously initialized but lost history.
A separate native initialization lock now covers this synchronous construction;
the existing nonblocking operation lock still guards later state mutations.

Real filesystem fault injection reproduced seven failing assertions before these
changes. The initial corrected suite passed 94 tests / 814 assertions, zero
compiler warnings in both 121-file release targets, configured lint and boundary
checks, and the compiled ESM/TCP identity consumer. A separate two-process public
API test paused the first opener immediately after the actual key write; the old
artifact refused the second opener as lost history, while the corrected artifact
allowed both openers and proved their key hashes match. The verifier runs this
native regression through the advertised verify:identity command. It never emits
key bytes. Additional collision refusal cases and subsequent review corrections
are included in the final combined verification recorded below.

These are syscall/failure and concurrent-process proofs, not simulated physical
power loss. Live external OAuth still requires operator provider configuration;
the controlled issuer test remains explicitly separate from a live identity
provider consent and discovery flow.

One refusal is intentionally retained: if construction stops after creating private
state but before any identity ledger exists, the next provider open cannot tell
that interrupted first initialization apart from a lost initialized history. It
refuses with `missing-ledger`; it does not manufacture an empty identity history
or replace the surviving key. Recovery of an existing store requires restoring
its original history. A confirmed never-used failed initialization can be kept
for inspection while starting with a fresh empty data directory in the same
runtime. Fully automatic recovery of that ambiguous case would require a separate
durable initialization intent/completion protocol and is not claimed here.

## Grant and PGP completion admission

Codex 3996178543 and 3996178553 are addressed by pure, validated domain decisions
and a durable completion reservation. Grant policy receives the current transaction
snapshot and explicit token hash, time, target, roles, and capabilities. It resolves
the administrator again from that snapshot, validates the target principal, and
returns one replacement transaction. Infra supplies host inputs and executes the
decision. The host retry delay also now uses the required native async/await form
(Codex 3996178550).

Both PGP enrollment and login reserve at most three proof attempts per browser-bound
challenge before OpenPGP parsing or verification. Reservation holds the existing
operation lock and publishes the counter in the durable ceremony checkpoint.
Wrong-browser, wrong-purpose, expired, and consumed challenges refuse admission.
Failed crypto remains counted across handles and restart. A failed checkpoint
publication starts no crypto; if its increment remains visible it stays spent,
so retries can advance or refuse but cannot discount it. Successful identity
transactions retain the existing single-use challenge consumption. Lock contention
uses the existing finite admission retry policy.

The first PGP harness run had a mismatched test delimiter, corrected before the
meaningful failure-first run. The separate actual behavioral RED ran 99 tests /
848 assertions with ten failures and no errors: repeated invalid signatures
reached crypto six times instead of three, and the post-publication scenario
started unaccounted crypto. The corrected focused domain/admission cases passed
seven tests / 40 assertions before the final combined run.

Final combined verification after merging immutable Clio locked-snapshot commit
690aad83ff54ef5225a1f1533b4a7bd0eaef3561: 102 tests / 864 assertions, zero failures
or errors; server and ESM release targets each compile 124 files with zero warnings;
configured kondo reports zero errors/warnings; boundary check is clean. The actual
compiled ESM/TCP restart, login, forged-header, Origin, logout, and linking checks
pass, followed by the native two-process initialization regression (one test,
zero failures or skips). That verifier explicitly warns that live external OAuth
requires operator configuration. The Clio, protocols, and Sol source trees are
byte-identical to their separately gated immutable 690aad83 successor; their test
totals are recorded with that foundation checkpoint rather than inherited from an
older identity build.

## Delegated administrator grant targets

CodeRabbit 5645971998 identified that the documented prohibition on self-grants
was missing from both the pure grant transition and the retained actor HTTP route.
Both now use the same law requiring another identified principal as the target.
This applies to role and capability updates, including requests by administrators;
an administrator can still update another principal. The retained route refuses
self-updates with HTTP 403 before reaching its SQL write boundary.

Failure-first domain and actual Fastify injection tests reproduced four failing
assertions across five tests / 23 assertions, including an unwanted SQL write.
The corrected focused suite passes the same five tests / 23 assertions, with zero
compiler warnings and zero configured lint errors or warnings. This scoped proof
does not replace the subsequent combined identity gate.

## Passkey completion admission

Codex 3996249407 reproduced the same unbounded completion path for WebAuthn.
Passkey enrollment and login now reserve their browser-bound challenge attempts
through the existing durable proof reservation before entering SDK verification.
The shared law permits the four PGP and passkey proof purposes, each with three
attempts. Passkey enrollment also checks the authenticated account binding before
verification. A wrong-account request with the correct browser binding can spend
one slot but cannot invoke cryptography; a wrong-browser request spends none.

The new regression uses ephemeral native P-256 keys, actual none-attestation wire
responses and signatures made by a different key, through the real WebAuthn SDK.
It reproduces repeated invalid signatures across reopened EDN handles, rejected
attestations, and a checkpoint publication failure that must start no crypto.
The visible uncertain reservation stays spent after reopening, preserving the
three-attempt upper bound. A positive service-level enrollment/login test checks
session creation, signature-counter advancement and single-use rejection.

After correcting a test delimiter during lint, the behavioral RED ran nine tests /
84 assertions with eleven failures and no errors. The corrected focused passkey,
PGP and existing credential crypto suite passed 13 tests / 108 assertions, with
zero compiler warnings and zero configured lint errors or warnings. Existing
WebAuthn wire-fixture helpers were extracted unchanged for reuse by both suites;
the production crypto boundary was not replaced. The final combined identity
verification is recorded separately after the owner restacks the reviewed changes.

## Independent SDK refresh lock bound

Self-review found that the reference SDK's separate native refresh lock still
used only a wall-clock deadline. The finite local-admission retry cap did not
bound this different loop. A real fs-ext contention test froze and reversed host
time while a watchdog released the held lock after 100 milliseconds: old code
incorrectly reached the callback instead of refusing within the attempt cap.
The full behavioral RED was 105 tests / 879 assertions with exactly eight failures
in the new clock regression and no errors. The watchdog made the failure proof
finite rather than leaving a hung test process.

Native refresh polling now uses the awaited host delay boundary and a 1,500-attempt
cap in addition to the 30-second wait deadline. At the nominal 20-millisecond
interval, it permits at most 1,499 waits; clock stalls or reversal cannot remove
the attempt bound. The held descriptor still closes in finally. The focused
native regression passes one test / eight assertions, 68 compiled files with zero
warnings, and configured lint zero errors/warnings. This limits polling for an
OS lock; it does not cancel an already-running SDK callback or network operation.

## Preserve the prepared login response across an uncertain append

Actual Codex 3996249402 against `161a0e4` found that a visible identity append
could consume a one-use challenge while discarding the freshly created response
token when its durability fence threw. Retrying the identity decision would then
encounter the consumed challenge instead of recovering that response.

The transaction now prepares its Clio event exactly once alongside the original
decision result. If append throws, it reads canonical history under the existing
operation lock. Only an exact matching accepted event authorizes one retry of
that same event through Clio's idempotent durability fence. The prepared result
is returned only after successful persistence. This repeats neither the decision
nor cryptographic verification and never appends a second event. An absent event
preserves the original refusal; persistent fencing errors still refuse after the
single recovery attempt.

Native failure-first tests throw at the actual file and parent-directory fsync
after the real identity bytes have been appended. The original implementation
failed seven assertions in two tests / 24 assertions. Focused GREEN is eight
tests / 70 assertions including existing durability regressions, with 121 files
compiled and zero warnings; scoped lint is clean. The returned token resolves
after reopening, exactly one event exists, and the consumed challenge cannot be
replayed. Additional cases prove no result escapes a failure before writing or
a persistent fence failure, and the decision is executed only once.

This bounded recovery handles a transient in-flight fence failure. A process
crash or persistent storage failure can still prevent delivery of the response;
it is not a durable response mailbox and does not claim recovery of plaintext
tokens across process loss. Final combined package gates and external review
are recorded on the published successor after its foundation dependency is fixed.

## Concurrent ATProto route startup selects the accepted key

Actual Codex 3996249405 against `161a0e4` found that provider initialization
released its lock before route registration selected the ATProto signing key.
Two fresh processes could both observe a missing key; the later transaction
rejected the first process's accepted key instead of reusing it. Real operation
lock contention could also abort route startup.

Key selection now runs through a pure domain decision over the current locked
identity state. It returns the accepted reference when another process won, or
records one prepared candidate when no key exists. Existing references receive
the same no-op durability fence as other identity transactions. Missing or
malformed accepted references refuse instead of replacing the signing identity.
Generation and sealing remain outside the pure transition, with one lazy
candidate per startup invocation. Only native storage contention is retried
through the existing finite admission bound. SDK construction occurs after key
selection, outside that retry. A losing candidate can leave an unreferenced
encrypted vault object; it cannot replace the accepted key or add another key
creation event.

Two failure-first native tests use the actual compiled library, separate Node
processes, real fs-ext operation locks and Fastify TCP routes. File barriers
prove both processes observed a missing key before either generation proceeds.
One case releases the second process after the first commits; the other proves
actual native lock contention before releasing the winner. Both failed against
the original library with the expected concurrent-key or busy-lock error.
The corrected library passes both tests, with no skips, after a release build
of 125 files and zero warnings; scoped lint has zero errors and warnings.
Both processes serve metadata and JWKS successfully, expose the same public-key
digest, and leave exactly one canonical key-creation event. Private key material
is neither printed nor included in evidence. Full combined identity gates are
recorded separately after the foundation restack.

## Combined review checkpoint on immutable foundation 090da40

After merging exact foundation `090da40b20c7df1d29efbc4f194d0938f84478cc`, the
advertised identity suite passes **111 tests / 933 assertions**, with no failures
or errors. Test compilation covers 186 files; server and public ESM releases
each cover 125 files, all with zero compiler warnings. Advertised lint reports
zero errors and warnings, and the unchanged JavaScript boundary checker passes.

The built ESM consumer again exercises actual TCP signup, restart/session read,
forged-header and foreign-Origin refusal, committed logout and authenticated
linking. All three native tests pass without skips: competing first provider
initialization plus both ATProto route-startup races. Its explicit existing
notice that real external OAuth requires operator configuration remains a scope
limitation, not evidence of successful live provider consent.

This checkpoint includes self-target grant refusal, durable PGP/passkey proof
admission, finite SDK refresh polling, uncertain identity append recovery and
ATProto signing-key winner recovery. Reciprocal source review found no confirmed
new defect in the last two repairs. Logs are `axxium-090-{test,build,lint,boundary,
consumer}.log` in the sandbox working root. Foundation's newly reported read-only
permission regression is being fixed separately; these results cover immutable
090 only and will not be transferred to that successor without rerunning gates.
Actual published-head reviewers and required hosted checks remain merge gates.
