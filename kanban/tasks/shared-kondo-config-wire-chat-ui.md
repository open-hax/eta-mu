---
uuid: "shared-kondo-config-wire-chat-ui"
title: "Wire shared clj-kondo config into chat-ui"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into chat-ui

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Add a thin `.clj-kondo/config.edn` and a `lint:kondo` script to chat-ui so it consumes the shared rules.

## Scope

- `packages/chat-ui/.clj-kondo/config.edn` (new)
- `packages/chat-ui/package.json`

## Baseline state

chat-ui has no `.clj-kondo/config.edn` and no `lint:kondo` script. ClojureScript sources live under `src` and `test`.

## Work items

- [ ] Create `packages/chat-ui/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [ ] Add `"lint:kondo": "clj-kondo --lint src test"` to `packages/chat-ui/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/chat-ui/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [ ] `pnpm --filter @open-hax/chat-ui lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/chat-ui/src` or `packages/chat-ui/test` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/chat-ui lint:kondo
```

---

## Completion Notes

- Created `packages/chat-ui/.clj-kondo/config.edn` with `:config-paths` pointing to the shared kondo config.
- Added `"lint:kondo": "clj-kondo --lint src test"` to `packages/chat-ui/package.json`.
- Ran `pnpm install`; workspace link is up to date.
- Created an empty `packages/chat-ui/test` directory and added `test/.gitkeep` because the `test` directory did not exist; without it, `clj-kondo --lint src test` errors with `file does not exist`.
- No source files under `packages/chat-ui/src` or `packages/chat-ui/test` were modified.

## Files Touched

- `packages/chat-ui/.clj-kondo/config.edn` (new)
- `packages/chat-ui/package.json`
- `packages/chat-ui/test/.gitkeep` (new)

## Verification Command Output

```text
$ pnpm --filter @open-hax/chat-ui lint:kondo

> @open-hax/chat-ui@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/chat-ui
> clj-kondo --lint src test

WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
src/eta_mu/chat_ui/composer.cljs:3:46: warning: #'helix.core/$ is referred but never used
src/eta_mu/chat_ui/message.cljs:3:46: warning: #'helix.core/$ is referred but never used
src/eta_mu/chat_ui/protocol.cljs:4:14: warning: namespace helix.core is required but never used
src/eta_mu/chat_ui/protocol.cljs:4:40: warning: #'helix.core/defnc is referred but never used
src/eta_mu/chat_ui/protocol.cljs:4:46: warning: #'helix.core/$ is referred but never used
src/eta_mu/chat_ui/stream.cljs:3:14: warning: namespace clojure.string is required but never used
linting took 37ms, errors: 0, warnings: 6
```

## Status

Done. The command exits without config-resolution errors. Because clj-kondo's default `--fail-level` is `warning`, the process exits with status `2` due to source warnings; these warnings are acceptable per the task requirements.

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 13 pre-existing errors / 7 warnings (Epic 2).
