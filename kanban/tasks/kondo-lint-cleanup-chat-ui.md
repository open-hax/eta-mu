---
uuid: "kondo-lint-cleanup-chat-ui"
title: "Clean up clj-kondo findings in chat-ui"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in chat-ui

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against chat-ui and resolve every finding per the epic fix policy.

## Scope

- `packages/chat-ui/src/**/*.cljs`
- `packages/chat-ui/test/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/eta_mu/chat_ui/protocol.cljs` | 0 | 1 | 0 |  |
| `src/eta_mu/chat_ui/stream.cljs` | 0 | 1 | 0 |  |

No promise-chain or `js-await` signals. Two files contain likely long functions.

## Work items

- [ ] Run `pnpm --filter @open-hax/chat-ui lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [ ] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/chat-ui lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/chat-ui lint:kondo
```

---

## Completion

- Status: `done`
- Completed at: 2026-06-15
- clj-kondo result: 0 errors, 0 warnings
- Changes made:
  - `packages/chat-ui/src/eta_mu/chat_ui/composer.cljs`: removed unused `helix.core/$` referral
  - `packages/chat-ui/src/eta_mu/chat_ui/message.cljs`: removed unused `helix.core/$` referral
  - `packages/chat-ui/src/eta_mu/chat_ui/panel.cljs`: no source changes (Helix component symbols now recognized by shared config)
  - `packages/chat-ui/src/eta_mu/chat_ui/protocol.cljs`: removed unused `helix.core` require; converted `:send` promise chain to `^:async` / `await` workflow
  - `packages/chat-ui/src/eta_mu/chat_ui/stream.cljs`: removed unused `clojure.string` require
  - `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn`: added `helix.core/defnc` lint-as for `cljs.core/defn` to resolve Helix prop-destructuring unresolved-symbol findings across all wired packages
- chat-ui `.clj-kondo/config.edn` and `package.json` were not modified.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
