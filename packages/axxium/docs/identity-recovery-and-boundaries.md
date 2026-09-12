# Identity recovery and boundary verification

The local identity provider requires its original Clio history and encrypted
vault to remain together. A surviving key, encrypted blob, schema directory or
identity ledger establishes prior initialization. If the identity ledger is
missing, startup refuses instead of creating a new identity history around the
surviving private data. Restore the original ledger, schemas and vault from the
same backup; do not generate a replacement key. An empty private directory is
not evidence of an initialized identity.

The standalone `/health` endpoint replays current identity state for each
request. Missing or corrupt live history produces HTTP 503 with a generic
unhealthy body. It exposes no storage paths, credentials or projection facts.
Restoring valid history restores healthy responses without changing identities.

Signup accepts an absent display name or a string of at most 256 characters.
Malformed values fail with `invalid-display-name` before password derivation or
durable private allocation. The separately bounded password admission checkpoint
still records rate/concurrency admission; it is not a credential blob.

The retained PostgreSQL compatibility surface now uses named environment, JWT,
PostgreSQL, password and HTTP extern adapters. Public legacy route-registration
functions keep their native Fastify signatures. Their handlers exchange defined
CLJS request and response maps. Database result data is `{:rows ... :row-count
... :command ...}`; multi-statement migration results are vectors of those maps.
Timestamps become ISO strings, bytes become byte vectors, and SQLSTATE fields
are available in `ex-data`. Use `axxium.db/close!` to close the configured pool.
Actual JOSE and bcrypt primitives are retained. These compatibility changes do
not claim that the PostgreSQL service was available in the sandbox or that its
legacy multi-query signup has the atomic semantics of the new Clio provider.

## Test process failures

`pnpm test` preloads `scripts/shadow-test-error-guard.cjs` into both the compiler
launcher and emitted test process. The parent runner rejects the fatal marker
even if a nested launcher reports exit zero, and requires a nonzero executed
test/assertion summary with zero failures and errors.

The guard is necessary for a reproduced compiler-runner behavior: a native async
test can reject before its first assertion after the wrapper has already called
`done`. An immediate `process.exit(0)` can then hide the unhandled rejection. The
guard reports it and defers explicit exit through two event-loop check phases.
It does not wait indefinitely for detached timers or replace native async tests.

To reproduce against the same compiled artifact:

```sh
pnpm exec shadow-cljs compile test --config-merge '{:output-to "target/async-guard-probe.cjs" :ns-regexp "axxium\\.probes\\.async-guard$"}'
node target/async-guard-probe.cjs
node --require ./scripts/shadow-test-error-guard.cjs target/async-guard-probe.cjs
```

The intentional probe contains one passing assertion and one throwing async
test. In the verified compiler revision the unguarded run falsely reported
2 tests / 1 assertion, zero failures/errors and exit 0. The guarded run of that
exact artifact exited 1 with `[shadow-test-guard] FATAL`. The probe namespace is
outside the normal test-name selector; it is expected to fail when selected.

## Evidence at this checkpoint

- Failure-first live health and private-restore tests reproduced HTTP 200 after
  ledger loss and unsafe replacement history/key creation.
- Corrected display-name failure-first proof ran 1 test / 20 assertions with
  16 failures, using the real store multimethod and password implementation.
  An initial fixture intercepted a compiled multimethod incorrectly and counted
  lawful ceremony checkpoints as credential data; that evidence was replaced.
- Guarded full package suite: 75 tests / 706 assertions, zero failures/errors.
- Server and library release builds: 118 files each, zero compiler warnings.
- Full package lint: zero errors/warnings. Unchanged strict boundary scanner:
  no violations, closing the previous 56 legacy violations without exemptions.
- Compiled ESM consumer over real TCP: signup, replay, current principal,
  explicit linking Origin and committed logout verified.

Live third-party OAuth consent remains unverified without operator credentials;
local issuer/cryptographic tests are not evidence of those external logins.
