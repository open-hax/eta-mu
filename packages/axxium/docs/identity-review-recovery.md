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
