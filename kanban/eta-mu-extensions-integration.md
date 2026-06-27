---
uuid: "orgs-open-hax-eta-mu-kanban-orgs-open-hax-eta-mu-specs-eta-mu-extensions-integration-md"
title: "eta-mu-extensions Integration Spec"
status: "done"
priority: "P3"
labels: ["specs", "migrated-spec"]
created_at: "2026-05-29T04:29:39.346Z"
source: "orgs/open-hax/eta-mu/specs/eta-mu-extensions-integration.md"
category: "specs"
---

> Source: `orgs/open-hax/eta-mu/specs/eta-mu-extensions-integration.md`
> Migrated-to-kanban: `orgs/open-hax/eta-mu/kanban/eta-mu-extensions-integration.md`

# eta-mu-extensions Integration Spec

Status: done — SUPERSEDED / HISTORICAL
Date: 2026-04-09
Reconciled: 2026-06-19
License: GPL-3.0-or-later

> **Superseded.** This card captured the *initial* TS→CLJS extension migration plan.
> The migration is complete and the live extension set is now governed by
> `packages/extensions/manifest.edn` (15 `:source :local :tracked true` extensions).
> The "Unported Extensions" table and the phased "Integration Priorities" roadmap below
> are kept only as historical record — **do not treat them as work to do**. For the current
> ported set, the source of truth is `manifest.edn`; for live planning see
> `packages/extensions/kanban/extension-integration-plan.md`. The macroization analysis
> further down did land (`lib/eta_mu/macros/{state,event,tool}.cljc`) and remains useful
> design context.

## Overview

This spec defined the integration path for unported pi TypeScript extensions into the
eta-mu-extensions CLJS package (now at `packages/extensions`), and identified repeating
patterns suitable for macroization.

## Current State (canonical)

The package now ships **15** manifest-declared CLJS extensions, all `:local` and `:tracked`:
`apply-patch`, `bootstrap`, `chronos`, `contract-runtime`, `contract-runtime-v2`,
`custom-providers`, `graph-memory`, `image-render`, `lisp-decomp-nudge`,
`opencode-global-instructions`, `opmf-contract-gate`, `receipt-river`, `session-mycology`,
`task-timing`, `websearch-open-hax`. Each has matching source under
`packages/extensions/src/eta_mu/extensions/`. See `manifest.edn` for the authoritative list.

Note `apply-patch` (listed below as "unported") **is** now CLJS. There is **no**
`analyze-image`/`manipulate-image` source or manifest entry anywhere — those were never
landed and are dropped; `image-render` is the sole image extension. `skill-graph-aco`,
`desktop-ops`, `webpage-markdown`, and `opmf-contract-runtime` were likewise never ported
to CLJS and have no source.

## Historical migration plan (superseded — not work to do)

<details>
<summary>Original "Unported Extensions" table and phased roadmap (obsolete)</summary>

### Unported Extensions (TypeScript) — OBSOLETE

These reflect the 2026-04 backlog before the migration completed. `apply-patch` was ported;
the rest were dropped (no CLJS source exists for any of them).

| Extension | Priority | Outcome |
|-----------|----------|---------|
| `apply-patch.ts` | P2 | **Ported** → `apply_patch.cljs` (in manifest) |
| `analyze-image.ts` | P1 | **Dropped** — never landed, no source |
| `manipulate-image.ts` | P1 | **Dropped** — never landed, no source |
| `desktop-ops.ts` | P2 | **Dropped** — not ported |
| `webpage-markdown.ts` | P3 | **Dropped** — not ported |
| `opmf-contract-runtime.ts` | P3 | **Dropped** — superseded by CLJS contract runtime |
| `skill-graph-aco.ts` | P1 | **Dropped** — static skill-graph/graph-memory tooling is canonical |

The original phased "Integration Priorities" (Week 1 skill-graph-aco + image extensions,
Week 2 apply-patch/desktop-ops, Week 3 webpage-markdown) is obsolete and intentionally
removed; only `apply-patch` survived into the shipped set.

</details>

## Macroization Opportunities

### Pattern Analysis

After reviewing all 11 ported CLJS extensions, these patterns repeat:

#### 1. State Management Pattern

Every extension has:
```clojure
(def ^:const GLOBAL-KEY "__pi_<name>_state__")

(defn get-state []
  (if-let [existing (aget js/globalThis GLOBAL-KEY)]
    existing
    (let [fresh #js {:enabled true ...}]
      (aset js/globalThis GLOBAL-KEY fresh)
      fresh)))
```

**Proposal: `defstate` macro**
```clojure
(defstate receipt-river
  :enabled true
  :currentTurn 0
  :turnToolNames [])
;; Expands to GLOBAL-KEY, get-state, set-state! functions
```

#### 2. State Directory Pattern

Most extensions have:
```clojure
(def ^:const HOME (.homedir os))
(def ^:const STATE-DIR (str HOME "/.pi/agent/state/<name>"))
(def ^:const EVENTS-FILE (str STATE-DIR "/events.jsonl"))
```

**Proposal: `defstate-dir` macro**
```clojure
(defstate-dir receipt-river
  :files [events-file spores-file promotions-file])
;; Expands to STATE-DIR, EVENTS-FILE, etc. constants
```

#### 3. JSONL I/O Pattern

All extensions with state use:
```clojure
(defn append-jsonl [file-path value]
  (ensure-dir (path/dirname file-path))
  (.appendFileSync fs file-path (str (js/JSON.stringify value) "\n") "utf8"))

(defn read-jsonl [file-path limit]
  ;; ... parsing logic
  )
```

**Proposal: `jsonl-file` macro**
```clojure
(jsonl-file events
  :path STATE-DIR
  :file "events.jsonl"
  :schema {:ts string? :action string? :data any?})
```

#### 4. UI Integration Pattern

Extensions with UI use:
```clojure
(defn set-status [ctx state]
  (let [ui (when (aget ctx "hasUI") (aget ctx "ui"))
        set-status-fn (and ui (aget ui "setStatus"))]
    (when set-status-fn
      (.call set-status-fn ui STATUS-KEY (format-status state)))))

(defn ui-notify [ctx message level]
  (let [ui (when (aget ctx "hasUI") (aget ctx "ui"))
        notify-fn (and ui (aget ui "notify"))]
    (when notify-fn
      (.call notify-fn ui message level))))
```

**Proposal: `ui-helpers` macro**
```clojure
(ui-helpers receipt-river
  :status format-status
  :widget format-widget)
;; Generates set-status, ui-notify, ui-set-widget
```

#### 5. Event Handler Registration Pattern

All extensions register similar events:
```clojure
(em/on "session_start" :handler (fn [_event ctx] ...))
(em/on "session_switch" :handler (fn [_event ctx] ...))
(em/on "session_shutdown" :handler (fn [_event ctx] ...))
```

**Proposal: `event-handlers` macro**
```clojure
(event-handlers
  (on-session-start [ctx]
    (reset-state!))
  (on-session-shutdown [ctx]
    (cleanup-state!)))
```

#### 6. Tool Parameter Schema Pattern

Tools have verbose parameter definitions:
```clojure
(em/tool "receipt_river"
  :label "Receipt River"
  :description "..."
  :parameters {:action {:type "string"
                        :enum ["status" "bootstrap" "append" "tail" "validate"]
                        :description "..."}
               :path {:type "string" :optional true :description "..."}
               ...})
```

**Proposal: `deftool` macro with schema DSL**
```clojure
(deftool receipt_river
  "Append-only receipts.log ledger"
  [:action [:enum "status" "bootstrap" "append" "tail" "validate"]
   :path :string?
   :kind :string?
   :lines [:int? {:min 1 :max 2000}]])
```

### Proposed Macro Library: `eta-mu.macros`

```clojure
(ns eta-mu.macros
  "Constitutional layer extension DSL macros.

   Usage:
   (ns eta-mu.extensions.my-extension
     (:require-macros [eta-mu.macros :as em])
     (:require [eta-mu.core :as core]))

   (em/defextension my-extension
     :name \"my-extension\"
     :description \"Does something useful\"

     (em/defstate
       :enabled true
       :counter 0)

     (em/defstate-dir
       :files [events-file cache-file])

     (em/deftool my_tool
       \"Tool description\"
       [:param1 :string?
        :param2 [:enum \"a\" \"b\" \"c\"]]
       (fn [params ctx]
         (implement-tool-logic params ctx)))

     (em/defcommand my_command
       \"Command description\"
       [args ctx]
       (implement-command-logic args ctx))

     (em/event-handlers
       (on-session-start [ctx]
         (reset-state!))
       (on-turn-start [event ctx]
         (increment-counter!))))")
```

## Implementation Roadmap (historical — superseded)

> The original four-week roadmap below is obsolete. What actually shipped: the macro
> library landed as `lib/eta_mu/macros/{state,event,tool}.cljc` (not a single
> `macros.cljc`); `apply-patch` was ported to CLJS; the legacy TS extension tree was
> removed. The image extensions and `skill-graph-aco`/`desktop-ops`/`webpage-markdown`
> ports were dropped, not done. Live planning continues in
> `packages/extensions/kanban/extension-integration-plan.md`.

<details>
<summary>Original four-week roadmap (obsolete)</summary>

### Week 1: Macros + skill-graph-aco

1. Create the macro library (landed as `lib/eta_mu/macros/{state,event,tool}.cljc`).
2. Refactor one existing extension to use macros.
3. ~~Port `skill-graph-aco.ts`~~ — dropped.

### Week 2: Image Extensions — DROPPED

4. ~~Port `analyze-image.ts`~~ — never landed, no source.
5. ~~Port `manipulate-image.ts`~~ — never landed, no source.

### Week 3: Workflow Extensions

7. Port `apply-patch.ts` to CLJS — **done**.
8. ~~Port `desktop-ops.ts`~~ — dropped.
9. ~~Port `webpage-markdown.ts`~~ — dropped.

### Week 4: Cleanup + Documentation

10. Remove legacy TypeScript extensions — **done**.
11. Update all extension READMEs.
12. Create extension authoring guide.

</details>

## Fork Tax Integration

After completing this spec, we commit:

1. This spec document
2. Any new macro code
3. Updated README for eta-mu-extensions
4. New CLJS extension ports

## Success Criteria (outcome)

- [x] TS→CLJS migration complete — 15 CLJS extensions declared in `manifest.edn`
      (the original "7 unported" goal is moot: `apply-patch` was ported, the rest dropped)
- [x] Macro library landed (`lib/eta_mu/macros/{state,event,tool}.cljc`)
- [x] All 15 manifest extensions compile and load without errors
- [ ] No duplicate code patterns across extensions (ongoing — macro adoption incremental)
- [ ] Documentation covers extension authoring workflow