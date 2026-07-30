---
uuid: "rheos-cli-agent-release-archive"
title: "Ship rheos as a downloadable release archive for web agents"
status: incoming
type: task
priority: P0
points: 5
labels: rheos, cli, distribution, ci, release, agents
category: tasks
parent: "rheos-cli-card-lifecycle-authority"
created_at: "2026-07-30T00:00:00Z"
---

# Ship rheos as a downloadable release archive for web agents

## Outcome

A web agent in a bare sandbox — Node 22 and `curl`, no Java, no pnpm, no repo
checkout, no GitHub credentials — can obtain a working `rheos` from one stable
URL and run board commands within a minute.

## Problem

Web agents get stuck before they reach the board at all. Of the three possible
install paths, the one that works is undocumented and the two they try both fail:

- **npm — works today, but invisible and stale.** `@eta-mu/rheos@0.1.0` is
  published (16.3 MB unpacked) and `npm i -g @eta-mu/rheos` pulls its five runtime
  deps, so this path functions. But it is documented in no README, no `AGENTS.md`,
  and no CLI help output, so agents never find it; it is pinned at `0.1.0` from
  2026-07-18, predating the EDN config work in PR #158; and it is unavailable in
  sandboxes with no registry egress. **Documenting and re-publishing this is the
  cheapest half of this card and should land first.**
- **Building from source** needs Java 21 + shadow-cljs + `pnpm install
  --frozen-lockfile` across a 774 MB workspace store, with private git deps
  (`katamorph`, `event-ledger`) that need app credentials.
- **Copying `dist/cli.cjs`** does not work. The `:node-script` bundle
  top-level-`require`s its npm deps rather than inlining them. Verified: copying
  `dist/cli.cjs` to an empty directory and running it fails with
  `Error: Cannot find module 'chokidar'`. `fastify`, `@fastify/cors`,
  `@fastify/static`, and `@modelcontextprotocol/sdk` have the same problem — and
  they are all reached on *every* invocation, including read-only verbs that need
  no server at all. This is the path an agent reaches for after a checkout, and
  the failure is silent about *why*.

The sandbox bundle in PR #156 does not solve this: it is a whole-workspace dev
snapshot (git bundle, runtime dirs, JVM/pnpm/Clojure toolchains) published as an
`actions/upload-artifact` with 30-day retention. Actions artifacts need an
authenticated API call to download, and the payload is orders of magnitude larger
than a CLI. Keep it for sandbox reconstruction; it is the wrong artifact for
"give the agent a working `rheos`".

So the archive is the zero-egress fallback, and the documentation is the actual
fix for "web agents get hung up on this tool".

## Scope

- **Make the CLI standalone-capable.** Either bundle the npm deps into the
  archive's `node_modules`, or move the server-only requires
  (`fastify`, `@fastify/*`, `chokidar`, `@modelcontextprotocol/sdk`) behind lazy
  loads so read/mutate verbs need nothing but the bundle. Prefer the lazy-load
  route where it is cheap — it shrinks the archive and cuts CLI startup — and
  bundle whatever genuinely cannot be deferred.
- **Build the archive** in CI: `dist/cli.cjs`, any required `node_modules`,
  `resources/public` (only if `serve` is in scope for the archive),
  `docs/cli.md` from [[rheos-cli-documentation-and-help]], a `bin/rheos`
  shim, `manifest.json` (repo, revision, version, node/pnpm versions, build
  time, verb list), and `SHA256SUMS`.
- **Publish as a GitHub Release asset**, not an Actions artifact — release assets
  on a public repo are fetchable with unauthenticated `curl`. Attach to
  `rheos-v<version>` tags, and maintain a rolling `rheos-cli-latest` release so
  there is one URL that never changes.
- Re-publish `@eta-mu/rheos` from the same job so the registry stops trailing the
  repo (`package.json` `files` is already `dist` + `resources/public`, so the npm
  tarball and the archive are near-identical payloads), and document
  `npm i -g @eta-mu/rheos` as the primary install path with the archive as the
  no-registry fallback.
- **Smoke-test the archive in CI** in a clean container with only Node 22: unpack,
  run `rheos --help` and `rheos read-board --json` against a fixture board, assert
  exit `0`. This test is the thing that stops the archive silently rotting.
- **Document it clearly**, at the top of `docs/cli.md` and in the Rheos README:
  the exact `curl` one-liner with the `latest` URL, checksum verification, the
  Node-22-only requirement, what the archive can and cannot do (e.g. whether
  `serve` works), and how to point it at a board via `--config` /
  `$KANBAN_CONFIG` / `openhax.kanban.edn`.
- Cross-reference from root `README.md` and `AGENTS.md` so an agent reading house
  rules finds it without knowing the package name.
- Reuse the pinned-action and `permissions:` conventions already in
  `.github/workflows/rheos.yml`; scope write permission to the release job only.

## Non-goals

- Replacing or reworking the PR #156 sandbox bundle.
- Single-file executables (`node --experimental-sea`), Docker images, or
  cross-platform native binaries.
- Vendoring the private git deps.

## Acceptance criteria

- A container with only Node 22 and `curl` can, from the documented one-liner,
  fetch and unpack the archive and run `rheos --help` and `rheos read-board`
  successfully.
- `npm i -g @eta-mu/rheos` installs a version built from current `main`, and that
  path is documented in `docs/cli.md`, both READMEs, and `AGENTS.md`.
- The `latest` URL is stable across releases and always resolves to the newest
  archive.
- `SHA256SUMS` verifies, and `manifest.json` records the exact source revision.
- The CI smoke test runs on every release and fails the release if the archive
  cannot start.
- `docs/cli.md`, `packages/rheos/README.md`, root `README.md`, and `AGENTS.md`
  all point at the same documented install path.
- The archive is under 25 MB.
- `pnpm -C packages/rheos test` and `lint:kondo` pass with zero warnings.

## Related

- PR #156 (`chore/sandbox-bundle-action`) — complementary, different purpose;
  note the distinction in that PR so the two artifacts are not conflated.
- `.github/workflows/release-and-publish.yml` — check whether the release job
  belongs there as a reusable call rather than a new workflow.
