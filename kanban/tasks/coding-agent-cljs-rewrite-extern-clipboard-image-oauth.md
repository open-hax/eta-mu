---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "2sp"]
write-id: "1783815461953-0.pr1dfvu3o4oo5bn6r4u"
points: "2"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Clipboard, Image & OAuth Extern Adapters"
priority: "P0"
status: "done"
uuid: "coding-agent-cljs-rewrite-extern-clipboard-image-oauth"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Clipboard, Image & OAuth Extern Adapters

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 2

## Purpose

Create `eta_mu.coding.extern.*` namespaces for clipboard, image conversion, and OAuth I/O used by the coding agent.

## Scope

- `src/utils/clipboard.ts`, `src/utils/clipboard-native.ts`, `src/utils/clipboard-image.ts`
- `src/utils/image-resize.ts`, `src/utils/image-convert.ts`, `src/utils/photon.ts`, `src/utils/exif-orientation.ts`
- `src/utils/mime.ts`
- `src/modes/interactive/components/oauth-selector.ts`

## Deliverables

- [ ] CLJS extern namespaces for clipboard (native + OSC52), image resize/convert, and OAuth
- [ ] Effect boundaries aligned with `eta-mu-runtime` boundary conventions
- [ ] Conversion regression tests for clipboard, image processing, and MIME detection
- [ ] No raw Node or native interop outside `extern.*` namespaces

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core acceptance and by eta-mu-cljs-rewrite-boundary-adapters (done). Image/OAuth adapters also depend on ai-cljs-rewrite provider/OAuth parity (incoming).

Board audit 2026-07-11 — moved to ready. extern-fs-git-bash dependency is done. Card's dependency chain cleared.

Starting implementation. Surveying TS clipboard/image/oauth source.

Implemented three extern adapters: clipboard.cljs (platform read/write: Wayland, X11, macOS, WSL, Termux, OSC52), mime.cljs (callback-based MIME detection: base-mime-type, image-mime-type?, audio-mime-type?, sniff-from-buffer), image.cljs (photon WASM lazy-load, EXIF orientation, resize with progressive quality reduction, convert-to-png, format-dimension-note). 228 tests, 911 assertions, 0 failures. 0 clj-kondo errors. Boundary scanner clean. OAuth selector deferred (TUI component, not a pure extern).
---