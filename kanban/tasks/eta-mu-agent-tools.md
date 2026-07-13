---
uuid: "eta-mu-agent-tools"
title: "Eta-mu Agent Tools — read, bash, edit, write"
status: "review"
priority: "P0"
labels: ["tasks", "cljs", "coding-agent", "eta-mu", "5sp"]
created_at: "2026-07-12T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---

# Eta-mu Agent Tools — read, bash, edit, write

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Decision record: `docs/cljs-runtime-rewrite-architecture-inventory.md` § Decision record (2026-07-12)

## Purpose

The CLJS `eta-mu agent` command currently runs with `:tools []`
(`packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/agent.cljs:27`). The
published stable eta-mu ships read, bash, edit, and write tools; without them
the agent cannot do coding work. This is the single largest parity gap toward
`npm install -g eta-mu`.

## Scope

- Tool definitions as data maps (`{:name :description :parameters :execute}`)
  per the Knoxx tool law, consumable by `eta-mu.turn-processor.infra.loop`.
- `read` — file read with offset/limit truncation.
- `bash` — command execution with timeout and output truncation
  (via `eta-mu.extern.child-process`).
- `edit` — exact-string replacement with uniqueness check.
- `write` — file create/overwrite.
- Wire the tool vector into the agent command and REPL.

No TS interop, no legacy schema compatibility. Reference behavior only:
`packages/legacy/coding-agent/src/core/tools/*`.

## Acceptance criteria

- [x] All four tools registered in the agent command's tool vector.
- [x] Tool results round-trip through the turn-processor loop against a live
      OpenAI-compatible endpoint (proxy) in a manual smoke. Verified against
      `$PROXX_URL` with model `gemma4:31b`: read, bash, edit, and write each
      executed and their results round-tripped back into the conversation.
- [x] Each tool has law schemas and unit tests (happy path + one failure mode).
- [x] `pnpm -C packages/eta-mu test` and `lint:kondo` pass with zero warnings.

## Verification

```bash
pnpm -C packages/eta-mu test
pnpm -C packages/eta-mu lint:kondo
```

---
Implemented read/bash/edit/write tools: law.tools (malli arg schemas + JSON-schema :parameters), domain.tools.{truncate,read,edit} (pure), extern.child-process/exec-shell-capture (shell exec + timeout kill), infra.tools.{read,bash,edit,write,registry} (tool maps with :execute). Wired eta-mu.infra.tools.registry/tools into agent.cljs initial-context (agent command + REPL). Fixed a latent gap in extern/openai.cljs: llm-context :tools were being sent to the chat-completions API as raw canonical tool maps instead of OpenAI function DTOs — now converted via turn-processor.shape.tool/tools->openai, which is required for tool-calling to actually work end-to-end. 77 tests / 143 assertions green, clj-kondo zero warnings.

Manual smoke test completed against the live proxy ($PROXX_URL, model gemma4:31b): read (read package.json, extracted name field), bash (wc -l on a scratch file), edit (unique-match replace, verified via a follow-up read after the model self-corrected on a re-run), and write (created a new file with content) all executed successfully and their tool-result content round-tripped back through the turn-processor loop into the assistant's final reply. All acceptance criteria now checked off.

Addressed review feedback (2026-07-12): added a real e2e test (packages/eta-mu/test-e2e/cljs/eta_mu/e2e/agent_cli_e2e.cljs, run via 'pnpm --dir packages/eta-mu test:e2e') that builds dist-cli/index.cjs, spawns it as a real child process against a mock OpenAI-compatible HTTP server serving a fixed, hand-shuffled queue of tool-calling turns, and asserts both the tool_result payloads sent back to the mock and the real filesystem side effects, isolated per-run via a random tmp dir + OS-assigned port. Also fixed the exact bug you hit: eta-mu agent used to forward OpenAI's raw 401 JSON body when no API key was configured; extern/openai.cljs now short-circuits with a clear, actionable message ('Set --api-key/OPENAI_AUTH_TOKEN/OPENAI_API_KEY, or point --base-url/OPENAI_BASE_URL at a different provider') before ever making a network call, and agent.cljs now accepts a --base-url flag (previously only available via env var, and not even threaded through turn-processor's loop.cljs -- fixed that gap too). README.md rewritten with the full provider-config table, quick start, and roadmap.
---
