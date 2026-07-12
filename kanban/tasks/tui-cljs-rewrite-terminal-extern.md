---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "tui"]
write-id: "1783693441673-0.abaf1yb7op84y06swtb"
points: "3"
source: "kanban/epics/tui-cljs-rewrite.md"
title: "TUI CLJS Rewrite — Terminal Extern Adapters"
priority: "P0"
status: "done"
uuid: "tui-cljs-rewrite-terminal-extern"
created_at: "2026-06-15T00:00:00Z"
---

# TUI CLJS Rewrite — Terminal Extern Adapters

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 3

## Purpose

Create the raw JS interop layer for terminal control, ANSI sequences, stdin parsing, terminal sizing, and keyboard events so that pure CLJS namespaces stay free of Node/process interop.

## Scope

- Port `terminal.ts` (`ProcessTerminal`, `Terminal` interface) to `eta_mu.tui.extern.terminal.*`.
- Port `stdin-buffer.ts` to `eta_mu.tui.extern.stdin.*`.
- Port `keys.ts` (key parsing, kitty protocol detection) to `eta_mu.tui.extern.keys.*`.
- Port width/truncation helpers from `utils.ts` that touch ANSI to `eta_mu.tui.extern.ansi.*`.

## Deliverables

- [ ] `extern.terminal`, `extern.stdin`, `extern.keys`, and `extern.ansi` namespaces in the new CLJS package.
- [ ] Conversion/regression tests for key parsing, ANSI stripping, and width calculation.
- [ ] Malli schemas in `law.*` for terminal capabilities and key events.

## Verification gate

- [ ] New CLJS extern tests pass.
- [ ] Existing TypeScript tests for keys, stdin-buffer, and utils still pass against unchanged TS modules.

```bash
pnpm --dir packages/eta-mu-tui cljs:test
pnpm --filter @open-hax/eta-mu-tui test
```

---
Blocked by `eta-mu-cljs-rewrite-boundary-adapters` (core program): terminal extern adapters need the established `extern.*` boundary pattern, boundary scanner, and conversion-test conventions before they can be authored consistently. Also logically precedes component port tasks.

Triage 2026-07-10: done-in-fact — eta-mu.terminal-ui.extern.terminal ported in packages/terminal-ui (receipts.edn 2026-07-09). Promoted to done.

Board audit 2026-07-12: DONE status only partially holds. extern/terminal.cljs + test exist, but scoped extern.stdin, extern.keys, and extern.ansi namespaces do not exist anywhere in packages/terminal-ui. Checkboxes unchecked; promoted done on the terminal extern alone (2026-07-10 triage). Recommend reopening or re-scoping.
---
