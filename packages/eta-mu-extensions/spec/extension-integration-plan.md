# Extension Integration Plan for eta-mu

**Status:** Active
**Created:** 2026-04-09
**Author:** eta-mu

## Overview

This document specifies the integration plan for remaining pi/opencode extensions into the eta-mu constitutional layer.

## Current State

### Ported Extensions (CLJS - 11 total)

| Extension | Lines | Status | Dependencies |
|-----------|-------|--------|--------------|
| `bootstrap.cljs` | 345 | ✅ Active | None |
| `chronos.cljs` | 9,623 | ✅ Active | None |
| `contract_runtime.cljs` | 18,197 | ✅ Active | None |
| `custom_providers.cljs` | 7,678 | ✅ Active | None |
| `image_render.cljs` | 9,220 | ✅ Active | None |
| `opencode_global_instructions.cljs` | 2,185 | ✅ Active | None |
| `opmf_contract_gate.cljs` | 17,272 | ✅ Active | `@open-hax/output-contract-gate` |
| `receipt_river.cljs` | 23,868 | ✅ Active | None |
| `session_mycology.cljs` | 30,152 | ✅ Active | None |
| `task_timing.cljs` | 7,425 | ✅ Active | None |
| `websearch_open_hax.cljs` | 5,599 | ✅ Active | None |

### Unported Extensions (TypeScript - 7 total)

| Extension | TS Lines | Priority | Dependencies | Port Complexity |
|-----------|----------|----------|--------------|-----------------|
| `analyze-image.ts` | 338 | **P1** | Vision API | Low - uses fetch API |
| `manipulate-image.ts` | 338 | **P1** | Sharp/jimp | Low - simple file ops |
| `apply-patch.ts` | 799 | **P2** | None | Medium - parsing logic |
| `desktop-ops.ts` | 705 | **P2** | KDE/Spectacle | Medium - desktop integration |
| `webpage-markdown.ts` | 758 | **P3** | Fetch, pandoc | Medium - web fetching |
| `skill-graph-aco.ts` | 1,400 | **P3** | Ollama API | High - complex state |

## Identified Patterns for Macroization

### Pattern 1: State Management (HIGH frequency)

Appears in 5/11 extensions:
- STATE-DIR constant
- EVENTS-FILE constant
- STATUS-KEY constant
- GLOBAL-KEY constant
- get-state function
- set-status! function

**Macro:** `defstate`

### Pattern 2: Event Handlers (HIGH frequency)

Appears in all extensions:
- session_start handler
- session_shutdown handler
- turn_start handler (often)
- before_agent_start handler (often)

**Macro:** `defevents`

### Pattern 3: Tool Parameter Schema (MEDIUM frequency)

Repetitive parameter definitions with:
- type specification
- description strings
- optional flags
- enum constraints

**Macro:** `deftool`

## Implementation Roadmap

### Week 1: Macro Library ✅

- [x] Create `lib/eta_mu/macros/state.cljc`
- [x] Create `lib/eta_mu/macros/event.cljc`
- [x] Create `lib/eta_mu/macros/tool.cljc`
- [ ] Refactor existing extensions to use macros

### Week 2: Image Extensions (P1) - IN PROGRESS

- [x] Create `src/eta_mu/extensions/analyze_image.cljs`
- [ ] Create `src/eta_mu/extensions/manipulate_image.cljs`
- [ ] Create integration tests
- [ ] Update build system

### Week 3: Desktop Extensions (P2)

- [ ] Port `apply-patch.ts`
- [ ] Port `desktop-ops.ts`
- [ ] Test with KDE environment

### Week 4: Advanced Extensions (P3)

- [ ] Evaluate `skill-graph-aco.ts` complexity
- [ ] Consider splitting into modules
- [ ] Port with macro support
- [ ] Merge `webpage-markdown.ts` with `websearch_open_hax.cljs`

## Testing Requirements

### Unit Tests
- State management: initialization, reset, persistence
- Event handlers: session lifecycle
- Macro expansion: verify generated code

### Integration Tests
- Extension loading via pi
- OpenCode plugin generation
- Cross-platform compatibility

## Success Metrics

- All 18 extensions load without errors
- Build time < 60 seconds
- Test coverage > 80%
- No runtime errors in production use
- Macro usage in all new extensions
