---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "agent"]
write-id: "1784497552725-0.xup0dgnx8r8s3s5yvo"
points: "3"
source: "kanban/epics/agent-cljs-rewrite.md"
title: "Agent CLJS Rewrite — Boundary Adapters"
priority: "P0"
status: "incoming"
uuid: "agent-cljs-rewrite-phase-2-extern-adapters"
created_at: "2026-06-15T00:00:00Z"
---

# Agent CLJS Rewrite — Boundary Adapters

> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Phase: 2
> Points: 3

## Purpose

Create the `eta_mu.agent.extern.*` boundary layer so provider SDK payloads, HTTP streams, timers, and other raw JavaScript surfaces are isolated from the pure agent domain.

## Scope

- Provider SDK payload adapters (request/response shape conversion)
- HTTP stream adapters for agent-loop network I/O
- Timer and scheduling adapters
- Raw JS interop helpers used by `infra.*` and `cli.*`

## Work items

- [ ] Define `extern.*` namespaces for provider SDK payloads.
- [ ] Define `extern.*` namespaces for HTTP streams and timers.
- [ ] Add conversion regression tests for each extern adapter.
- [ ] Verify no raw JS interop leaks outside `extern.*` namespaces.
- [ ] Document opaque handle rules for SDK objects that must stay in JS land.

## Acceptance criteria

- [ ] Every effectful agent path has an `extern.*` adapter.
- [ ] Each adapter has at least one conversion regression test.
- [ ] Boundary scanner reports no disallowed raw JS interop outside `extern.*`.
- [ ] Adapters expose CLJS-first APIs: maps, vectors, scalars, or opaque handles.

## Verification

```bash
pnpm --dir packages/eta-mu-runtime cljs:boundary
pnpm --filter @open-hax/eta-mu-agent-core test
node scripts/ts-line-count.mjs packages/legacy/agent
```

---
Formerly blocked by `agent-cljs-rewrite-phase-1-inventory-contracts` and core program `eta-mu-cljs-rewrite-boundary-adapters`; both are done as of 2026-07-10, so this card is ready.

## State of affairs (2026-07-12)

**部分实现于 `packages/eta-mu`。** OpenAI extern adapter (`eta-mu.extern.openai`) 已在 eta-mu CLI 包中实现，支持可配置的 base URL 和 auth token（代理支持）。

Agent 的 boundary adapter 范围比 OpenAI client 更大——还需要 FS、Git、Bash、readline、child_process 等适配器。其中：
- `eta-mu.extern.fs` — 文件系统操作
- `eta-mu.extern.git` — Git 操作
- `eta-mu.extern.process` — 进程/env 读取
- `eta-mu.extern.readline` — 交互式输入
- `eta-mu.extern.openai` — LLM 通信（刚完成代理支持）

这些都在 `packages/eta-mu/src/cljs/eta_mu/extern/` 下。Agent CLI 的 extern 层基本完成，但还没有独立的 agent 包拆分。

Triage 2026-07-12: partially superseded by reality. The extern layer (fs, git, path, process, child_process, readline, openai) lives in packages/eta-mu and is consumed by @eta-mu/turn-processor (the legacy/agent successor). Remaining genuine scope from this card: (1) streaming proxy extern (legacy proxy.ts: fetch/ReadableStream/TextDecoder/AbortSignal), (2) timer/scheduling extern, (3) boundary-scanner coverage for packages/eta-mu. Verification block references stale path packages/eta-mu-runtime (now packages/runtime). BLOCKED ON DECISION: does packages/legacy/agent get its own CLJS package, or is turn-processor + eta-mu extern the target? Stays in breakdown pending that call.
---