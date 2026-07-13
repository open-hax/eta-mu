---
uuid: "eta-mu-npm-publish-readiness"
title: "Eta-mu npm Publish Readiness"
status: ready
priority: "P0"
labels: ["tasks", "cljs", "eta-mu", "publish", "2sp"]
created_at: "2026-07-12T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 2
category: "tasks"
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

- [ ] Decide the published name/dist-tag strategy vs. the currently published
      stable `eta-mu` (avoid clobbering the stable install until parity).
- [ ] `README.md` suitable for the npm page (install, proxy env vars, agent
      usage).
- [ ] Version/changelog discipline for the first publish (0.x).
- [ ] CI or script step that runs the tarball smoke (`npm pack` → global
      install → `--version`/`help`/agent no-op) before publish.
- [ ] Dry-run `npm publish --dry-run` and record the file list.

## Acceptance criteria

- [ ] A documented, repeatable publish path exists and the tarball smoke is
      automated.
- [ ] Publish does not depend on any workspace package being published.

## Verification

```bash
pnpm -C packages/eta-mu build
npm pack ./packages/eta-mu
npm install -g --prefix /tmp/eta-mu-smoke ./eta-mu-*.tgz && /tmp/eta-mu-smoke/bin/eta-mu --version
```
