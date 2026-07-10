---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
write-id: "1783693258012-0.yqjsm9ayjm3o5wg4ce"
points: "4"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
title: "Output Contract Gate CLJS Rewrite — Extern Adapters"
priority: "P1"
status: "ready"
uuid: "output-contract-gate-cljs-rewrite-extern-adapters"
created_at: "2026-06-15T00:00:00Z"
---

# Output Contract Gate CLJS Rewrite — Extern Adapters

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 4

## Purpose

Create `eta_mu.gate.extern.*` adapters for raw JS interop: EDN parsing, markdown AST parsing, file system, hashing/UUID, and fetch.

## Deliverables

- `eta_mu.gate.extern.edn`: parse EDN strings into CLJS data via `edn-data` or equivalent.
- `eta_mu.gate.extern.markdown`: parse markdown into a CLJS AST using `unified`/`remark-parse`/`remark-gfm`.
- `eta_mu.gate.extern.fs`: read/write files and recursive mkdir.
- `eta_mu.gate.extern.crypto`: sha256 and UUID generation.
- `eta_mu.gate.extern.fetch`: OpenAI-compatible POST wrapper.

## Verification gate

- [ ] Each adapter has a round-trip or smoke unit test.
- [ ] EDN adapter parses the five-section contract fixture without data loss.
- [ ] Markdown adapter parses `VALID_FIVE_SECTION_RESPONSE` into the expected AST shape.
- [ ] FS adapter writes, reads, and removes temp files in a test.
- [ ] Crypto adapter produces stable sha256 and valid UUIDs.

---
> Blocked by `kanban/tasks/eta-mu-cljs-rewrite-boundary-adapters.md`: the core extern/infra adapter patterns and boundary scanner must land first so this gate does not duplicate or conflict with runtime boundary work.
---