---
name: atproto-auth-standardization
description: "Standardize human login, service identity, and inter-service auth around AT Protocol DIDs and Bluesky-backed one-time sign-in, while removing host-local static secrets and bespoke per-service auth flows."
compatibility: pi, opencode, codex
metadata:
  domain: auth
  protocol: atproto
  identity: did
  version: 1
---

# Skill: AT Protocol Auth Standardization

## Goal
Make AT Protocol identity the canonical auth layer across services so a human signs in once with a Bluesky/ATProto account and services stop inventing bespoke auth silos.

## Use This Skill When
- The user wants one login across multiple services or hosts.
- A system has too many static bearer tokens, `.env` secrets, or copied host-local credentials.
- A service fleet needs a shared identity model for browsers, APIs, and service-to-service traffic.
- The user explicitly asks for AT Protocol, Bluesky, DID, `did:plc`, `did:web`, or auth standardization.
- Containerized services need a common orchestration + trust layer instead of ad-hoc direct connections.

## Do Not Use This Skill When
- The task is a one-off credential fix or single token rotation.
- The system cannot use an external identity provider and the user has not chosen AT Protocol as the root identity.
- The work is only about social posting to Bluesky and does not change authentication architecture.
- The request is limited to a local prototype where bespoke auth is acceptable temporarily.

## Identity Standard
1. **Human identity primary key = AT DID**
   - Treat the user's AT Protocol DID as the canonical subject identifier.
   - For Bluesky accounts this is usually a `did:plc` identity resolved through the AT Protocol identity flow.
   - Do not standardize on email addresses, mutable handles, or local usernames as the durable principal.

2. **Service identity = stable DID, usually `did:web`**
   - Give each auth broker / service frontdoor / workload a stable DID-based identity.
   - Prefer `did:web` for services and gateways on stable domains.
   - Keep human DIDs and service DIDs distinct.

3. **One human login, many local sessions**
   - The human logs in once using the AT Protocol OAuth flow.
   - A central auth broker exchanges and refreshes tokens.
   - Downstream services trust broker-issued short-lived sessions/tokens rather than re-running login flows.

## Required Auth Behaviors
### Human login
- Use the current AT Protocol OAuth profile and discovery flow.
- Publish or otherwise serve required client metadata in the right place for the chosen client shape.
- Use PKCE and current ATProto OAuth safety requirements.
- Resolve the account through handle/DID resolution instead of hardcoding server endpoints.
- Store long-lived refresh capability only in the central broker or secret manager, not in every service.

### Browser apps
- Browser-facing apps should trust the central auth broker and receive short-lived, HTTP-only session cookies or equivalent broker-managed sessions.
- The browser should not need service-specific API keys.
- Avoid storing reusable bearer tokens in local storage unless the user explicitly accepts that tradeoff and there is no safer option.

### APIs and internal services
- Internal services should accept a standard broker-issued identity token with DID-based subject claims.
- Normalize claims around:
  - `sub` = user DID or service DID
  - `iss` = broker DID / broker origin
  - `aud` = target service identity
- Services must validate issuer, audience, expiry, and signature through a shared trust root such as broker-published JWKS.
- Do not make every service speak raw Bluesky OAuth on its own unless it is itself the broker.

### Service-to-service auth
- Service-to-service traffic should use workload identity from the orchestration layer plus broker-minted short-lived credentials.
- Do not embed long-lived cross-service bearer tokens in host `.env` files when avoidable.
- Prefer pull-time or runtime credential minting over copied secrets.

## Orchestration Standard
When auth must work “everywhere,” define the orchestration layer first.

Minimum orchestration expectations:
1. A shared service network / discovery plane.
2. A central auth broker reachable by all services.
3. A standard way to inject service identity and broker endpoints.
4. A standard way to fetch or mint short-lived credentials at runtime.
5. A migration path to retire host-local auth tokens.

Good patterns:
- One auth gateway/broker service per environment.
- One service registry / ingress layer.
- One trust bundle / JWKS publication point.
- One policy for session lifetime, refresh, and revocation.

Bad patterns:
- Every container invents its own login flow.
- Shared bearer tokens copied into many `.env` files.
- Human app passwords scattered across hosts.
- Handles/usernames used as the durable internal principal.

## Implementation Protocol
1. **Inventory**
   - List all services, hosts, current auth methods, and token storage locations.
   - Separate human auth, browser auth, API auth, and service-to-service auth.

2. **Choose the root identity model**
   - Human subject = AT DID.
   - Service subject = service DID (`did:web` on stable domains unless there is a better chosen method).
   - Document exact subject mapping rules.

3. **Define the broker contract**
   - Decide where ATProto OAuth login happens.
   - Define session issuance, refresh, revocation, and JWKS publication.
   - Define the exact normalized claims services consume.

4. **Standardize service trust**
   - Every service must consume the same issuer/audience/signature rules.
   - Every service must map auth subjects to internal authorization using the DID, not handle/email.

5. **Standardize orchestration wiring**
   - Put broker URL, issuer DID, JWKS URL, and audience naming behind one environment contract.
   - Put workload identity injection and short-lived credential flow behind one deployment contract.

6. **Migrate incrementally**
   - Add broker and trust validation first.
   - Put one service behind broker-issued sessions.
   - Convert cross-service auth next.
   - Remove static host tokens only after the new path is verified.

7. **Retire legacy secrets**
   - Remove copied bearer tokens from host `.env` files where the broker replaces them.
   - Keep only the minimum bootstrap secret material needed for the broker and secret store.

## Output
Produce:
- An ATProto auth architecture note.
- A DID mapping table for humans and services.
- A broker/session contract.
- A service validation contract (`iss`, `sub`, `aud`, expiry, JWKS).
- A migration plan showing how host-local secrets get retired.
- A rollback/safety plan.

## Guardrails
- Do not claim “single sign-on” unless the services truly share one brokered session model.
- Do not use mutable handles as durable IDs when a DID exists.
- Do not leave long-lived user auth artifacts copied across hosts if a broker can centralize them.
- Do not standardize on app-password sprawl as the final architecture.
- Keep authorization separate from authentication: ATProto/DID proves identity; local policy still decides permissions.

## References
- Bluesky OAuth client guide: `https://docs.bsky.app/docs/advanced-guides/oauth-client`
- AT Protocol OAuth spec: `https://atproto.com/specs/oauth`
- AT Protocol DID spec: `https://atproto.com/specs/did`
