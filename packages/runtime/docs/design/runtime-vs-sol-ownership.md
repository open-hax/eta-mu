# ADR: `packages/runtime` vs `packages/sol` ownership

Status: accepted (documents current state; 2026-06)

## Context

Two CLJS packages could plausibly own the migrated eta-mu domains:

- **`packages/runtime`** (`@open-hax/eta-mu-runtime`) — a published library: a
  pure "movement kernel" compiled by shadow-cljs (`:target :esm`, `:runtime :node`)
  with a TypeScript facade. Its `runtime` domain is the control-plane core
  (belief/state/planner/envelope/message/model/session/surface/tool). It is a
  library consumed in-process; there is **no** `services/eta-mu` deployment.

- **`packages/sol`** (`@open-hax/sol`) — the Knoxx backend: a Node 22 + Fastify
  control plane (HTTP/WS transport, auth/RBAC, contract loading, agent runtime,
  MCP, OpenAI-compatible proxying). It is the deployed service, and its
  namespaces are rooted at `open-hax.sol.*`.

During the TS→CLJS rewrite, several non-control-plane domains were ported into
`packages/runtime` alongside the `runtime` core: `ai`, `coding`, `docs`,
`garden`, and `gate`. These correspond to legacy TS packages
(`legacy/ai`, `legacy/coding-agent`, `legacy/docs`, `legacy/publication-components`,
`legacy/output-contract-gate`) rather than to the Knoxx/`sol` service.

## Decision

Keep the migrated `ai`, `coding`, `docs`, `garden`, and `gate` domains in
`packages/runtime` for now. `packages/runtime` is the rewrite landing zone for
**pure, library-shaped** eta-mu domains; `packages/sol` remains the **deployed
service** and owns transport, auth, agent orchestration, and MCP.

The boundary is "library vs service", not "control-plane vs everything else":

- A domain belongs in `packages/runtime` if it is a pure CLJS library slice that
  obeys the `law → shape → extern → domain → infra` DAG with no service wiring.
- A concern belongs in `packages/sol` if it is part of the running Knoxx backend
  (routes, RBAC, agent runtime, proxying), which carries the `open-hax.sol.*`
  namespace root and `KNOXX_*` runtime config.

## Why the non-runtime domains live in `packages/runtime` today

1. The shadow-cljs spine, boundary scanner, smoke import gate, and coverage gate
   were first built in this package (see the rewrite plan docs under
   `docs/cljs-runtime-rewrite-*-plan.md`). Porting legacy TS semantics into the
   already-verified spine was lower-risk than standing up a new package per
   domain.
2. These domains are the CLJS replacements for the deprecated TS packages under
   `packages/legacy/*`, and they are pure data/morphism slices — a natural fit
   for a library, not for the `sol` service.
3. They are currently tested but **not** re-exported through the public facade,
   so colocating them does not widen the published surface.

## Consequences

- `packages/runtime` is presently broader than its name's "movement kernel"
  framing. That is intentional during the rewrite; the package's published
  facade still exposes only the `runtime` control-plane core.
- If any of these domains later need service-level wiring (transport, auth, MCP),
  the wiring goes in `packages/sol`, consuming the pure domain from
  `packages/runtime` — domains do not move into `sol` wholesale.
- A future split (e.g. extracting `coding`/`docs`/`garden`/`gate` into their own
  library packages) is possible but out of scope; revisit if the facade needs to
  export them or if build times warrant separation.
