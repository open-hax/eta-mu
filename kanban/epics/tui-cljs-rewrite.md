---
uuid: "tui-cljs-rewrite"
title: "TUI Package CLJS Rewrite"
status: "incoming"
priority: "P0"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 21
category: "epics"
---

# TUI Package CLJS Rewrite

> Package: `packages/legacy/tui` (`@open-hax/eta-mu-tui`)
> Current size: ~22,081 TS lines across 53 files
> Scope: terminal UI components, input handling, markdown rendering, themes, keys

## Purpose

Rewrite the `@open-hax/eta-mu-tui` terminal UI library into ClojureScript while preserving component APIs and behavior. The TUI is heavily coupled to the coding-agent interactive mode; this epic is a prerequisite for completing `coding-agent-cljs-rewrite`.

## Public compatibility surfaces

- Package exports: `src/index.ts`
- Core TUI: `src/tui.ts`
- Components: `src/components/*.ts`
- Input/editor: `src/components/input.ts`, `src/components/editor.ts`
- Markdown: `src/components/markdown.ts`
- Terminal abstractions: `src/terminal.ts`, `src/stdin-buffer.ts`, `src/terminal-image.ts`
- Keys/bindings: `src/keys.ts`, `src/keybindings.ts`
- Utilities: `src/utils.ts`, `src/fuzzy.ts`, `src/kill-ring.ts`, `src/undo-stack.ts`
- Tests: `test/*.test.ts`

## Target namespace map

```text
eta_mu.tui.domain.*       component state decisions, input event handling
eta_mu.tui.shape.*        props↔CLJS data transforms
eta_mu.tui.law.*          Malli schemas for component props and terminal state
eta_mu.tui.extern.*       terminal/ANSI/keyboard/image/raw JS interop
eta_mu.tui.web.*          Reagent terminal components
eta_mu.tui.cli.*          stable JS facade exports
```

## Non-goals

- Do not change component APIs.
- Do not migrate off the terminal backend unless needed.

## Phases

### Phase 1 — Inventory

- Catalog components and utilities and classify into domain/shape/law/extern/web/cli.
- Identify coding-agent interactive mode dependencies.

### Phase 2 — Terminal extern adapters

- Create `extern.*` namespaces for ANSI, stdin, terminal size, images, keyboard.
- Add conversion regression tests.

### Phase 3 — Component port

- Port components to Reagent/CLJS incrementally.
- Port markdown rendering and editor behavior.

### Phase 4 — Test parity

- Port tests to CLJS or run existing tests against CLJS-backed components.
- Keep test coverage for input, keys, markdown, and overlay behavior.

### Phase 5 — CLI facade

- Keep `src/index.ts` as a thin TS compatibility shell.

### Phase 6 — Cutover

- Delete obsolete TS modules after parity tests pass.

## Acceptance criteria

- [ ] Component inventory and dependency map documented.
- [ ] `extern.*` terminal adapters exist with conversion tests.
- [ ] Core TUI components run from CLJS.
- [ ] Existing TUI test suite passes or explicit blockers are recorded.
- [ ] coding-agent interactive mode can consume the CLJS TUI package.
- [ ] `pnpm --filter @open-hax/eta-mu-tui test` passes.

## Verification gates

```bash
pnpm --filter @open-hax/eta-mu-tui test
pnpm --filter @open-hax/eta-mu-tui typecheck
node scripts/ts-line-count.mjs packages/legacy/tui
pnpm --dir packages/eta-mu-runtime cljs:verify
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite`
- `eta-mu-cljs-rewrite-boundary-adapters`

---
## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `tui-cljs-rewrite-inventory`.
- 8 tasks blocked: terminal extern and image extern await core `boundary-adapters`; core-tui awaits terminal extern; utilities also awaits terminal extern; input-editor and markdown-overlays await core-tui; test-parity and facade-cutover await all component tasks.
- Current bottleneck: core program `eta-mu-cljs-rewrite-boundary-adapters` (in_progress) and inventory acceptance.
- Concurrency: terminal-extern and image-extern can run together once boundary patterns land; input-editor, markdown-overlays, and utilities can run together once core-tui is ready.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `tui-cljs-rewrite-inventory` accepted; inventory doc `docs/tui-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/tui` is 22,081 TS lines across 53 files: the second-largest legacy package after `coding-agent`.
- Public surface: `TUI`, `ProcessTerminal`, `Terminal`, `Component`, `Container`, `Focusable`, `Overlay*`, `Editor`, `Input`, `Markdown`, `SelectList`, `SettingsList`, `Image`, `Loader`, `Box`, `Text`, keybindings, keys, autocomplete, fuzzy, terminal-image utilities.
- Only consumer inside `packages/legacy` is `packages/legacy/coding-agent` (interactive mode, config/session selectors, RPC extension UI, examples).
- Raw JS interop is concentrated in:
  - `src/terminal.ts` → `eta_mu.tui.extern.terminal` (stdin/stdout, raw mode, SIGWINCH, Kitty protocol, OSC progress)
  - `src/stdin-buffer.ts` → `eta_mu.tui.extern.stdin-buffer` (EventEmitter, Buffer, CSI/OSC/DCS parsing)
  - `src/terminal-image.ts` → `eta_mu.tui.extern.image` (Kitty/iTerm2 ANSI, image dimensions, OSC 8 hyperlinks)
  - `src/keys.ts` → `eta_mu.tui.extern.keyboard` / `eta_mu.tui.domain.keys` (Kitty CSI-u, xterm modifyOtherKeys, legacy escape tables)
  - `src/utils.ts` → `eta_mu.tui.shape.text` / `eta_mu.tui.extern.ansi` (Intl.Segmenter, ANSI extraction)
  - `src/autocomplete.ts` → `eta_mu.tui.extern.autocomplete` (child_process, fs, path)
- `src/tui.ts` (1,243 lines) is the core orchestrator; it currently mixes domain logic with raw terminal interop and must be split.
- 21 test files exist; parity tests must cover input, keys, markdown, overlays, and image encoding.

**Updated scheduling after inventory:**
- Inventory → `review` (done).
- `tui-cljs-rewrite-terminal-extern` and `tui-cljs-rewrite-image-extern` remain `blocked` until core `boundary-adapters` finishes.
- `tui-cljs-rewrite-core-tui` is blocked by terminal-extern.
- Component ports (`input-editor`, `markdown-overlays`, `utilities`) are blocked by core-tui.

**Recommended next action:** Accept inventory; drive `eta-mu-cljs-rewrite-boundary-adapters` to completion, then move `tui-cljs-rewrite-terminal-extern` to `ready` and begin porting the terminal/ANSI/keyboard extern adapters.
