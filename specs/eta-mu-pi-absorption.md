# Eta-mu Pi Absorption

## Intent

Eta-mu owns the agent runtime stack by absorbing the Pi monorepo packages into this pnpm workspace first, without an immediate import-level rebrand.

The initial rule is: keep the absorbed package names stable (`@mariozechner/*`) so the code keeps working, then layer eta-mu-branded distro packages on top.

## Phase 1: Absorb without rebrand

Source: `/home/err/devel/orgs/badlogic/pi-mono/packages/`
Destination: `/home/err/devel/orgs/open-hax/eta-mu/packages/`

Absorbed packages:

- `packages/agent` → `@mariozechner/pi-agent-core`
- `packages/ai` → `@mariozechner/pi-ai`
- `packages/coding-agent` → `@mariozechner/pi-coding-agent`
- `packages/mom` → `@mariozechner/pi-mom`
- `packages/pods` → `@mariozechner/pi`
- `packages/tui` → `@mariozechner/pi-tui`
- `packages/web-ui` → `@mariozechner/pi-web-ui`

Internal dependencies between absorbed packages use `workspace:*`.

## Phase 2: Eta-mu distro layer

Added initial eta-mu-branded packages:

- `@open-hax/eta-mu-sdk`: barrel exports the absorbed Pi SDK/runtime packages.
- `@open-hax/eta-mu-cli`: provides the `eta-mu` binary as a thin wrapper over the absorbed `@mariozechner/pi-coding-agent` CLI.

`@open-hax/eta-mu-extensions` declares a Pi package manifest for eta-mu runtime extensions, including Receipt River, Session Mycology, contract runtime, OPMF contract gate, global instructions, graph memory, image render, web search, Chronos, and custom providers.

## Next functional divergence

The first deliberate runtime divergence should be first-class audio input support:

1. Add an `audio` content part type alongside text/image.
2. Persist audio parts in session messages.
3. Preserve audio parts through context construction.
4. Serialize audio parts in provider adapters that support them.
5. Patch Proxx request schemas/routing to accept and forward audio.
6. Simplify Knoxx agent code to depend on eta-mu SDK/runtime instead of owning contract and agent infrastructure locally.

## Packaging caveat

`workspace:*` is correct inside this monorepo. Before npm publishing, run `npm pack --dry-run` and inspect dependency rewriting for all public eta-mu wrapper packages.
