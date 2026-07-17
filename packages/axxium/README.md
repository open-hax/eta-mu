# Axxium

`@open-hax/axxium` — the axiomatic identity and auth kernel for the Promethean
system. A ClojureScript (shadow-cljs `:esm`/Node) Fastify + Postgres server that
proxx, knoxx, and openplanner are intended to consume as a shared identity
provider.

> **Scope note.** This README documents the **currently implemented** surface
> only. Axxium's design specs (`docs/axxium-kernel-spec.md`,
> `docs/axxium-kernel-spec-v2.md`) describe a much larger kernel — receipts,
> contract evaluation, an epistemic truth pipeline, DID auth, a full OAuth
> provider. Those are **aspirational**; see the spec files' reconciliation notes
> for what is real today.

## What is actually implemented

- **Password auth** — signup/login with `bcryptjs` hashing.
- **Sessions** — JWT (`jose`) issued as a cookie (`@fastify/cookie`); session
  rows persisted in Postgres.
- **Actor registry (read)** — list actors, fetch by id / current actor, update
  an actor's capabilities (self-or-admin gated).
- **Entity (single read)** — `GET /api/entities/:id`. Entities are created as a
  side effect of signup; there is **no** entity create/update/delete API and no
  general entity-registry surface yet.
- **Portal** — a **static landing page** (`resources/public/index.html`) served
  under `/portal/`. It is informational, not an identity-management UI.

Not yet implemented (despite appearing in specs/config/schemas): the OAuth
provider (only config flags, a Malli `OAuthClient` schema, and an
`oauth_clients` table exist — no authorization/callback/token routes), DID
auth, receipts, and contract/truth evaluation.

## Quick Start

This package is part of the eta-mu pnpm workspace. Run commands with pnpm.

```bash
# from the repo root, target this package
pnpm -C packages/axxium install   # workspace install (or `pnpm install` at root)

# environment
cp packages/axxium/.env.example packages/axxium/.env
# edit .env with your Postgres credentials and a real JWT_SECRET

# dev (shadow-cljs watch -> dist/server.js)
pnpm -C packages/axxium watch

# production build + run
pnpm -C packages/axxium build
pnpm -C packages/axxium start
```

`start` runs `node dist/server.js`. On boot the server runs `init-schema!`
(idempotent `CREATE TABLE IF NOT EXISTS` for `entities`, `actors`, `sessions`,
`oauth_clients`), so a reachable Postgres is required even in development.

## Scripts

| Script | Command | Notes |
|--------|---------|-------|
| `build` | `shadow-cljs release server` | Optimized build to `dist/` |
| `watch` | `shadow-cljs watch server` | Dev rebuild loop |
| `start` | `node dist/server.js` | Runs the built server |
| `typecheck` | `shadow-cljs compile server` | Non-release compile |
| `test` | `shadow-cljs compile test && node target/test.cjs` | **No test sources exist** — see below |
| `lint:kondo` | `clj-kondo --lint src/cljs` | |
| `boundary:check` | `node scripts/check-js-boundary.mjs --check` | See boundary policy below |

## API Endpoints

All actor/entity reads require an authenticated session (401 otherwise).

### Auth (`routes/auth.cljs`)
- `GET /api/auth/config` — public auth configuration
- `POST /api/auth/signup` — email/password registration (creates entity + actor, opens a session, sets cookie)
- `POST /api/auth/login` — email/password login
- `POST /api/auth/logout` — clears session + cookie
- `GET /api/auth/me` — resolves auth context, returns current actor

### Actors (`routes/actor.cljs`)
- `GET /api/actors` — list active actors (auth-gated, `limit`/`offset` query)
- `GET /api/actors/:id` — actor by id
- `GET /api/actors/me` — current actor
- `POST /api/actors/:id/capabilities` — replace capabilities (self-or-`:axxium/admin`)

### Entities (`routes/actor.cljs`)
- `GET /api/entities/:id` — read a single entity

### System (`routes/health.cljs`)
- `GET /health` — DB ping health check
- `GET /` — redirect to `/portal/index.html`
- `GET /portal/*` — static portal assets

## Configuration

All configuration is via environment variables (read in `config.cljs`). See
`.env.example` for the full set.

| Variable | Default | Description |
|----------|---------|-------------|
| `AXXIUM_PORT` | 8787 | HTTP server port |
| `AXXIUM_HOST` | 0.0.0.0 | Bind address |
| `AXXIUM_PUBLIC_BASE_URL` | http://localhost:8787 | Public base URL (portal link) |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | localhost / 5432 / axxium / axxium / (empty) | Postgres connection |
| `JWT_SECRET` | axxium-dev-secret-change-me | JWT signing secret — **set in production** |
| `JWT_ISSUER` | axxium | JWT issuer |
| `JWT_AUDIENCE` | promethean | JWT audience |
| `JWT_EXPIRY_HOURS` | 168 | Session token lifetime (7 days) |
| `SESSION_COOKIE_NAME` | axxium_session | Session cookie name |
| `SESSION_COOKIE_SECURE` | false | `Secure` cookie flag |
| `SESSION_COOKIE_SAME_SITE` | lax | `SameSite` policy |
| `BCRYPT_SALT_ROUNDS` | 12 | Password hashing rounds |
| `GITHUB_OAUTH_CLIENT_ID` / `_SECRET` / `_ENABLED` | (empty) / (empty) / false | Reserved for the unimplemented OAuth provider |

## JS Boundary Policy

Axxium follows the workspace CLJS layering rules (see `AGENTS.md`): raw JS
interop (`aget`, `aset`, `js->clj`, `clj->js`) belongs at `extern.*`
adapters, not scattered through domain/route code.
`scripts/check-js-boundary.mjs` enforces this by scanning `src/cljs` (excluding
files whose path contains `extern`) for those patterns.

**Current status: 56 boundary violations.** They are raw `clj->js` / `js->clj`
calls in `routes/auth.cljs`, `routes/actor.cljs`, and `routes/health.cljs` —
these routes do request/response marshalling inline rather than through an
extern adapter. `boundary:check` (i.e. `--check`) **exits non-zero (1)** on
violations, so this gate currently fails; it is not yet wired into a passing CI
step. Driving this to zero (by moving marshalling into an `extern.*` layer) is
outstanding work.

## Testing

There is a `test` script (`shadow-cljs compile test && node target/test.cjs`)
and a `:test` shadow-cljs build (ns-regexp `axxium\..*-test$`), but **there are
currently no `*-test.cljs` source files** under `src/cljs`. The build matches
nothing, so the suite is effectively empty. Real test coverage is outstanding.

## Known mismatch: bcrypt vs bcryptjs

The dependency and the code use **`bcryptjs`** (pure JS): `package.json` pins
`bcryptjs ^3.0.3` and `routes/auth.cljs` requires `["bcryptjs" :default
bcrypt]`. However, `shadow-cljs.edn` lists `"bcrypt"` (the native module) in
`:keep-as-import` for both the `:server` and `:server-dev` builds. That
`:keep-as-import` entry is **stale** — it names a module that is neither a
dependency nor imported. The canonical password library is `bcryptjs`; the
`"bcrypt"` entry in `shadow-cljs.edn` should be corrected to `"bcryptjs"`.

## License

GPL-3.0-or-later (per `package.json`).
