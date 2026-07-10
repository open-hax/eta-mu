---
uuid: "coding-agent-cljs-rewrite-extern-clipboard-image-oauth"
title: "Coding Agent CLJS Rewrite — Clipboard, Image & OAuth Extern Adapters"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "2sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 2
category: "tasks"
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
---
