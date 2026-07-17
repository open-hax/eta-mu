---
category: "tasks"
labels: ["tasks", "cljs", "eta-mu", "publish", "2sp"]
write-id: "1784221872794-0.2pp9vfeh62d0hyykhl5"
points: "2"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Eta-mu npm Publish Readiness"
priority: "P0"
status: done
uuid: "eta-mu-npm-publish-readiness"
created_at: "2026-07-12T00:00:00Z"
---
# Eta-mu npm Publish Readiness

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Decision record: `docs/cljs-runtime-rewrite-architecture-inventory.md` § Decision record (2026-07-12)

## Purpose

Make `npm install -g eta-mu` work from the public registry. The mechanical
blocker (workspace `dependencies` in `packages/eta-mu/package.json`) was fixed
on 2026-07-12: the shadow-cljs release bundle is self-contained (Node built-ins
only), so all workspace deps are now devDependencies, and `npm pack` + global
install from tarball was verified end-to-end (`eta-mu --version`, `help`).

## Remaining scope

- [x] Decide the published name/dist-tag strategy vs. the currently published
      stable `eta-mu` (avoid clobbering the stable install until parity).
- [x] `README.md` suitable for the npm page (install, proxy env vars, agent
      usage).
- [x] Version/changelog discipline for the first publish (0.x).
- [x] CI or script step that runs the tarball smoke (`npm pack` → global
      install → `--version`/`help`/agent no-op) before publish.
- [x] Dry-run `npm publish --dry-run` and record the file list.

## Acceptance criteria

- [x] A documented, repeatable publish path exists and the tarball smoke is
      automated.
- [x] Publish does not depend on any workspace package being published.

## Verification

```bash
pnpm -C packages/eta-mu build
npm pack ./packages/eta-mu
npm install -g --prefix /tmp/eta-mu-smoke ./eta-mu-*.tgz && /tmp/eta-mu-smoke/bin/eta-mu --version
```

---
Resolved 2026-07-16:

**Naming/dist-tag (open question (h) from the epic):** Checked the registry
directly. `npm view eta-mu` → 404, not registered. The "currently published
stable eta-mu" everyone was guarding against is actually published as
`@open-hax/eta-mu-cli@0.70.16` (with `bin: eta-mu, pi` — it installs the
`eta-mu`/`pi` binaries, but the *package name* is scoped). `packages/eta-mu`'s
`package.json` name is the unscoped `eta-mu`, which is unclaimed. Publishing it
does not clobber or collide with the stable package's registry entry — a user
would have to `npm install -g eta-mu` (new) vs. `npm install -g
@open-hax/eta-mu-cli` (stable) explicitly. No dist-tag gymnastics needed;
publish to `latest` under the unscoped name as already configured. This also
confirms the epic's 2026-07-15 naming decision (f) is already correctly
reflected in `packages/eta-mu/package.json`.

**Version/changelog policy:** Stay on plain semver 0.x (current: 0.1.0), bump
manually per publish; no separate CHANGELOG.md for now — kanban card history
+ commit log is the record until the API stabilizes past 0.x. Revisit if/when
this cuts 1.0.

**README:** Updated `packages/eta-mu/README.md` — it was stale (claimed 4
tools / non-streaming; actual state is 7 tools including find/grep/ls, and SSE
streaming landed 2026-07-15 via `ai-cljs-rewrite-phase-3-extern-openai`).
Fixed the intro, tool list, and roadmap section; added a short streaming note.

**Tarball smoke:** New `scripts/eta-mu-publish-smoke.sh` — build, `npm pack`,
global install into a temp prefix, then `--version`, `--help`, and an
`eta-mu agent` no-key-configured check that asserts the friendly guidance
message (not a crash). Ran it locally, passes. Wired into
`.github/workflows/release-and-publish.yml` as a step gated on
`inputs.publish-npm`, running before the actual publish step so a broken
tarball fails the job instead of reaching the registry.

**Dry-run record** (`npm publish --dry-run` from `packages/eta-mu`, 2026-07-16):

```
📦  eta-mu@0.1.0
Tarball Contents
  7.3kB README.md
  2.0MB dist-cli/index.cjs
  5.2MB dist-cli/index.cjs.map
  1.7kB package.json
package size: 1.3 MB
unpacked size: 7.3 MB
total files: 4
Publishing to https://registry.npmjs.org/ with tag latest and default access (dry-run)
+ eta-mu@0.1.0
```

All scope items and acceptance criteria checked off above. `pnpm -C
packages/eta-mu test` (115/115) and `lint:kondo` (0/0) still green after the
README/script changes (no source changes). Moving to `review`.
---