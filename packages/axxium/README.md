# Axxium

Axxium owns authentication and stable principal identity for Foresight products.
The independently runnable server and Knoxx use the same ClojureScript Fastify
plugin. Provider verification, credential enrollment, cookies and login state do
not belong to each consuming application. Knoxx continues to own its content
permissions, organization membership and review workflow.

## Run and embed

From the eta-mu workspace, install with pnpm, then:

```sh
pnpm -C packages/axxium test
pnpm -C packages/axxium lint:kondo
pnpm -C packages/axxium build
pnpm -C packages/axxium verify:identity
AXXIUM_EDN_DIRECTORY=/absolute/path/to/identity \
AXXIUM_PUBLIC_BASE_URL=http://localhost:8787 \
pnpm -C packages/axxium start
```

The default server uses Clio EDN and needs no PostgreSQL or MongoDB service.
`AXXIUM_HOST` defaults to `127.0.0.1`; `AXXIUM_PORT` defaults to `8787`.

```clojure
(require '[axxium.infra.identity :as identity]
         '[axxium.infra.identity-plugin :as plugin])

(def service
  (identity/open! {:provider :edn
                   :directory "/absolute/path/to/identity"
                   :public-base-url "http://localhost:5173"
                   :rp-id "localhost"}))

(await (plugin/register! fastify-app service {}))
(identity/resolve-principal service opaque-token)
```

`resolve-principal` synchronously replays current canonical identity facts and
returns an active principal only when its session remains unexpired and
unrevoked. Its map uses `:principal/id`, `:principal/entity-id`,
`:principal/kind`, `:principal/username`, optional `:principal/email`,
`:principal/display-name`, `:principal/status`, `:principal/roles` and
`:principal/capabilities`. Identity kinds include human, agent, service and
automation. JSON exports preserve these namespaced keys.

The `:lib` build exports `createProvider`, `registerIdentityRoutes`,
`resolvePrincipal` and `requestToken` for JavaScript consumers. Application
code should prefer the CLJS API. Client objects and raw HTTP objects are decoded
by named `extern` adapters.

## Authentication methods

`GET /api/auth/config` returns a method registry. A provider is available only
when its required server configuration exists. The UI must show missing
configuration truthfully; a local issuer test does not prove a live third-party
login completed.

| Method | Commands | Verification |
| --- | --- | --- |
| Username/email/password | `POST /api/auth/signup`, `/api/auth/local/login` | Separate unique username and email aliases; salted, versioned scrypt credentials |
| GitHub | `/api/auth/providers/github/login`, `/api/auth/callback/github` | State, PKCE, code exchange, immutable GitHub subject; only verified primary email is metadata |
| Discord | Corresponding `discord` routes | State, PKCE, code exchange, immutable Discord subject |
| Google | Corresponding `google` routes | State, PKCE and nonce; signed ID token issuer/audience/expiry verification |
| Bluesky/ATProto | Corresponding `atproto` routes; start accepts `handle` | Reference Node SDK discovery, PAR, PKCE, DPoP and token refresh; stable DID subject |
| PGP | `/api/auth/pgp/challenge`, `/enroll`, `/verify` | Exact byte challenge, full key fingerprint and detached signature |
| Passkey | `/api/auth/passkey/registration-options`, `/registration-verify`, `/authentication-options`, `/authentication-verify` | Real WebAuthn verification, expected challenge/origin/RP, user verification, credential ownership and counter checks |

All commands above except provider navigation and callbacks are POST. Signup
accepts `{username,email,password,"display-name"}`; passwords need at least 12
characters. Login accepts `{identifier,password}` where identifier is either
username or email. Successful browser login sets an HTTP-only `axxium_session`
cookie and returns `{ok,principal}` without returning its bearer secret.
`GET /api/auth/me` returns the principal. `POST /api/auth/logout` commits
revocation before clearing the cookie.

PGP enrollment and passkey registration require an already authenticated
account. This prevents possession of an arbitrary key from claiming somebody
else's username. PGP login accepts a registered fingerprint; passkeys support
discoverable credentials. Enrollment and authentication ceremonies carry a
single-use, expiring challenge bound to an HTTP-only `axxium_browser` cookie.

Cookie-authenticated mutations require the configured exact `Origin`. Agent
clients may supply a bearer token without a browser Origin. Explicit foreign
origins, malformed Authorization headers and simultaneous bearer/cookie
credentials are refused. External login redirects only accept local paths.

## Provider setup

Standalone configuration accepts these environment variables:

- `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`
- `DISCORD_OAUTH_CLIENT_ID` and `DISCORD_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`
- `ATPROTO_OAUTH_CLIENT_ID`, the public client metadata URL

Embedded consumers pass corresponding `:providers` maps with `:client-id` and
`:client-secret`. Callbacks are `<public-base-url>/api/auth/callback/<provider>`.
Real GitHub, Discord and Google authentication requires application registration
and the operator's account consent. These credentials are not fabricated by the
sandbox or supplied by the test fixtures.

For ATProto, publish the SDK-generated metadata at the configured client ID.
The plugin serves `/api/auth/atproto/client-metadata.json` and
`/api/auth/atproto/jwks.json`. A persistent ES256 client signing key and SDK
DPoP/session state are encrypted in the private vault. The SDK owns discovery,
PKCE, PAR, DPoP nonces and refresh. Refresh is serialized per session locally and
with OS file locks between processes sharing the EDN directory. Metadata,
callback and JWKS reachability must be verified for the chosen public origin;
local crypto tests are not a substitute for the external authorization flow.
See [ATProto OAuth patterns](https://atproto.com/guides/oauth-patterns).

External identities are keyed by verified issuer and subject. Matching email
never merges accounts or claims an existing password account. Explicit linking
requires the already authenticated account and a browser-bound linking flow;
a subject already attached to a different account is refused. An ATProto
principal can lawfully have no email.

Linking starts with an authenticated same-origin `POST` to the registry's
`linkUrl` (`/api/auth/providers/:provider/link`), with optional `redirect` and
an ATProto `handle`. The JSON response contains `authorizationUrl`; the browser
navigates there. Browsers supply Origin on that POST naturally. A GET login URL
with `?link=true` returns 405 and never starts a linking transaction.

## Storage and authority

`identity.edn` is an append-only Clio ledger with content-addressed schemas in
`schemas/`. One accepted event atomically changes all identity, alias,
credential, challenge and session projections involved in an operation.
Concurrent writers claiming the same stream slot fail visibly; callers retry
the complete command. Projections rebuild from validated history. A missing
initialized ledger, missing encryption key or corrupt history fails startup.

Unauthenticated ceremonies use a separate expiring Clio checkpoint,
`ceremonies.edn`, and encrypted blobs in `private/ceremonies/`. Their five-minute
retention does not compact durable identity facts. Successful acceptance records
challenge consumption and the identity/session changes in the same durable
event; that consumption still wins after a crash or restart. Issuance permits
at most 8 attempts per browser and 64 globally per minute, with 256 retained
entries and a 64 KiB private payload limit. Quotas are checked before encryption.
Checkpoint replacement and identity admission share a stable OS lock. Expired
entries and unreferenced ceremony blobs are collected on startup and subsequent
issuance, keeping abandoned requests bounded even if browser cookies rotate.
ATProto pending SDK state uses this same expiring store; accepted SDK sessions
and long-lived client keys retain their private durable storage.

The event facts contain private credential references, never plaintext
passwords, password hashes, bearer tokens, OAuth tokens or DPoP private keys.
Private values are immutable AES-256-GCM encrypted EDN blobs under `private/`.
The directory has owner-only permissions and the persistent master key and
blobs have mode `0600`. A private blob is fsynced before its reference is
committed; rejected transactions may leave unreferenced encrypted blobs. Keep
this directory private and back it up together with the ledger. Encryption
protects separation of public facts from credentials; it does not protect
against someone who can read both the blobs and their local master key.

`:memory` is an explicit second provider for bounded tests; it has no restart
persistence. `create-provider`, `history`, `transact!`, `seal!` and `unseal` are
multimethods. Neither production PostgreSQL nor MongoDB is silently emulated.
The retained PostgreSQL namespaces document compatibility code and are not used
by the new default server; adoption requires explicit identity migration, not
reinterpretation of old SQL rows as new Clio events.

Initial administrator setup is an explicit trusted-server command:
`(await (identity/bootstrap! service {:username ... :email ... :password ...}))`.
It atomically creates its own marker and administrator. Repeating the same
configuration verifies the existing credential; changed credentials or a
collision with a prior signup fails. Signup cannot grant administrator rights,
and users cannot grant themselves arbitrary capabilities.

## Verification and limits

The suite tests encrypted restart replay, username/email uniqueness, session
revocation, inactive identities, duplicate challenge refusal, explicit linking,
bootstrap collision, HTTP cookie/origin handling, real OpenPGP signatures and
real signed WebAuthn fixtures. Browser tests should additionally use an actual
browser authenticator. Live external OAuth completion remains a separate gate
requiring the provider configuration above.

`verify:identity` imports the built ESM library as an independent Node consumer,
starts a real TCP Fastify listener, signs up, reopens the encrypted Clio store,
checks session identity, refuses forged headers and a foreign Origin, and proves
that logout invalidates the reopened session. It removes its own temporary data.
Both emitted builds use `:simple` optimization: an actual consumer probe caught
advanced optimization renaming a Node crypto property despite clean compilation.

The local provider favors inspectable history over speed: it replays on every
read. No legacy identity history is silently imported. Credential rotation,
recovery policy and credential-removal user interfaces need explicit contracts
before broad production adoption. Existing historical PostgreSQL route boundary
debt remains visible in `boundary:check`; new identity namespaces keep raw host
interop exclusively in `extern`.

Axxium's older kernel specifications remain design references, not claims that
all described authorization-server or DID authentication endpoints exist.
