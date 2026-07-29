# eta-mu

Global `eta-mu` / `pi` CLI entry point and sub-command router. This is the
`npm install -g eta-mu` binary: a coding agent with real tools (read, bash,
edit, write, find, grep, ls) driven by an OpenAI-compatible chat-completions
endpoint with SSE streaming, plus a kanban/git/contracts command surface.
It is also the composition root and command router for the package-owned
Receipt River, Session Mycology, and Fork Tax protocols.

## Status

Under active construction. The agent command runs natively in ClojureScript
via [`@eta-mu/turn-processor`](../turn-processor) for the turn loop and
[`@eta-mu/terminal-ui`](../terminal-ui) for interactive rendering. Not
everything from the legacy TypeScript coding agent
(`packages/legacy/coding-agent`) has been ported yet — see
[Roadmap](#roadmap).

## Install

```bash
pnpm install
pnpm --dir packages/eta-mu build
```

This produces `dist-cli/index.cjs`. From the repo root you can also run it via
the workspace bin: `pnpm --dir packages/eta-mu exec eta-mu ...`.

## Quick start

`eta-mu agent` (the default command) needs to know which LLM endpoint to talk
to. **If you run it with nothing configured, it will tell you exactly that** —
it does not silently fail or forward a confusing raw provider error:

```
$ eta-mu agent
No API key configured, and no alternate provider set either.
eta-mu agent needs to know which LLM to talk to before it can do anything:
  - Set an API key: --api-key <key>, or the OPENAI_AUTH_TOKEN / OPENAI_API_KEY env var.
  - Or point at a different provider/local proxy: --base-url <url>, or the OPENAI_BASE_URL env var
    (must be a full chat-completions endpoint, e.g. http://localhost:8080/v1/chat/completions).
```

Pick one of these to get going:

```bash
# Real OpenAI
OPENAI_AUTH_TOKEN=sk-... eta-mu agent "read package.json and tell me the name field"

# A local or self-hosted OpenAI-compatible proxy (LM Studio, Ollama's OpenAI
# shim, a corporate gateway, etc.) — no key required if the proxy doesn't ask for one
eta-mu agent --base-url http://localhost:11434/v1/chat/completions "hello"
```

## Provider configuration

Every environment variable and flag that affects which model you talk to,
and whether the CLI can start talking to it at all:

| Flag           | Env var (fallback order)             | Default                                    | Blocks startup if missing? |
|----------------|---------------------------------------|---------------------------------------------|-----------------------------|
| `--api-key`    | `OPENAI_AUTH_TOKEN`, then `OPENAI_API_KEY` | *(none)*                              | **Yes** — unless `--base-url`/`OPENAI_BASE_URL` is also set (see below) |
| `--base-url`   | `OPENAI_BASE_URL`                     | `https://api.openai.com/v1/chat/completions` | No |
| `--model`      | *(none)*                              | `gpt-4o-mini`                              | No |
| `--provider`   | *(none)*                              | `openai`                                    | No (label only; doesn't change request shape) |
| `--system`     | *(none)*                              | `"You are a helpful assistant."`            | No |
| `--plain`      | *(none)*                              | off (TUI is default on a TTY)               | No |

Rules of thumb:

- **Talking to real OpenAI** (default `--base-url`): you must set an API key
  via `--api-key`, `OPENAI_AUTH_TOKEN`, or `OPENAI_API_KEY`. Without one, the
  agent refuses to make a network call at all and prints the message shown
  above (it used to leak OpenAI's raw 401 JSON body here — that's fixed).
- **Talking to anything else** (`--base-url`/`OPENAI_BASE_URL` set to a
  non-default URL): no key is required. Whether the target actually needs
  auth is between you and that endpoint — pass `--api-key`/`OPENAI_AUTH_TOKEN`
  too if it does.
- `--base-url` must be the **full chat-completions endpoint**
  (e.g. `.../v1/chat/completions`), not just a host.
- `--model` is passed through verbatim to whatever `--base-url` you're
  pointed at — it only has to mean something to real OpenAI if you're
  actually using real OpenAI's default `--base-url`.
- CLI flags always win over environment variables.

## Usage

```bash
eta-mu                        # Start the agent (interactive TUI on a TTY, single-turn if piped)
eta-mu agent "do the thing"   # Single-turn, non-interactive
eta-mu agent --plain          # Interactive REPL without the terminal-ui rendering
eta-mu kanban                 # Delegate to Rheos
eta-mu contracts output       # Delegate to output-contract-gate
eta-mu receipt schemas        # Receipt River schema registry
eta-mu session schemas        # Session Mycology schema registry
eta-mu fork-tax schemas       # Fork Tax schema registry
eta-mu version --components   # Exact package/schema composition
eta-mu --help                 # Show command help
```

The temporary compatibility paths `eta-mu git receipt ...`,
`eta-mu git session ...`, and `eta-mu git fork-tax ...` invoke the same
package handlers as the canonical commands. `receipt-river` and
`session-mycology` are descriptive aliases. Agent-session inspection remains
available as `eta-mu sessions`; the 1.1.1 `eta-mu session list|show` forms are
also retained while `eta-mu session reflect|schemas` belongs to Session
Mycology.

Repository inventory begins from roots already on disk:

```bash
eta-mu receipt audit discover \
  --root ~ \
  --root /mnt/data \
  --exclude ~/.cache \
  --exclude '**/node_modules/**' \
  --output repository-inventory.edn
```

### Agent tools

The agent has seven tools wired in by default (see
`src/cljs/eta_mu/infra/tools/`): `read`, `bash`, `edit`, `write`, `find`,
`grep`, `ls`. There is no opt-out flag yet — see [Roadmap](#roadmap).

### Streaming

Responses stream incrementally over SSE (`stream: true`) — both the TUI and
`--plain` REPL render text as it arrives rather than waiting for the full
turn.

## Development

```bash
pnpm --dir packages/eta-mu dev -- agent "hello"   # compile (fast, unoptimized) + run, forwarding args
pnpm --dir packages/eta-mu build                  # release build -> dist-cli/index.cjs
pnpm --dir packages/eta-mu watch                  # shadow-cljs watch loop
```

## Test

```bash
pnpm --dir packages/eta-mu test            # fast unit suite (no network, no child processes)
pnpm --dir packages/eta-mu test:coverage   # unit suite + c8 coverage (text/lcov/json-summary)
pnpm --dir packages/eta-mu test:e2e        # builds the CLI, then spawns it for real against a mock LLM server
pnpm --dir packages/eta-mu lint:kondo
pnpm -C packages/receipt-river test
pnpm -C packages/session-mycology test
pnpm -C packages/fork-tax test
```

`test:e2e` is a real end-to-end test: it builds `dist-cli/index.cjs`, starts a
mock OpenAI-compatible HTTP server that serves a fixed queue of tool-calling
turns, spawns the actual CLI binary against it in an isolated tmp directory,
and asserts both the tool-result payloads sent back to the mock and the real
files the tools produced on disk. It's intentionally kept out of the fast
`pnpm test` unit-test loop (see the namespace docstring in
`test-e2e/cljs/eta_mu/e2e/agent_cli_e2e.cljs` for why) — run it whenever you
touch tool execution, the turn loop, or the provider client.

## Roadmap

Tracked on the kanban board (`kanban/epics/coding-agent-cljs-rewrite.md` and
related cards). Rough shape of what's not done yet:

- **Interactive TUI depth.** `infra/cli/tui_repl.cljs` is an append-only,
  scrolling REPL (colorized tool calls/results). It does not have a
  full-screen differential-render host, raw-mode input editor (multi-line
  composition, history), or a session selector — see
  [`@eta-mu/terminal-ui`](../terminal-ui)'s README for the same note from the
  component side.
- **More providers.** Only an OpenAI-compatible chat-completions client
  exists today. Anthropic/Bedrock/Google adapters are tracked under the
  `ai-cljs-rewrite-*` cards but not wired into this CLI yet.
- **Tool opt-in/opt-out.** The four tools (read/bash/edit/write) are always
  registered; there's no flag to disable one (e.g. disable `bash` in a
  sandboxed context).
- **Legacy parity gaps.** `packages/legacy/coding-agent` has extensions,
  package-manager, RPC mode, and auth-storage that have no CLJS equivalent
  yet; see `kanban/epics/coding-agent-cljs-rewrite.md`.

## License

GPL-3.0-or-later
