# @open-hax/output-contract-gate

> **DEPRECATED (legacy TypeScript).** This package lives under `packages/legacy/`
> and is slated for a ClojureScript rewrite. Do not add new TypeScript here.
> See the rewrite inventory: [`docs/output-contract-gate-cljs-rewrite-inventory.md`](../../../docs/output-contract-gate-cljs-rewrite-inventory.md).
>
> Note: despite the deprecation, this package is still consumed at runtime by
> the canonical CLJS `packages/extensions` via `workspace:*`, so it remains
> buildable until that dependency is migrated.

Prototype runtime for contract-enforced agent output.

Current scope:
- parse list-form EDN response contracts
- normalize them into a usable IR
- parse Markdown into an AST
- validate the five-section ημ response shape deterministically
- compile bounded repair prompts from machine failures

## Commands

This is a TypeScript package built with `tsc`. Scripts (see `package.json`):

```bash
pnpm --filter @open-hax/output-contract-gate build       # tsc -p tsconfig.json
pnpm --filter @open-hax/output-contract-gate typecheck   # tsc --noEmit
pnpm --filter @open-hax/output-contract-gate test        # node --test dist/**/*.test.js
pnpm --filter @open-hax/output-contract-gate clean       # rm -rf dist
pnpm --filter @open-hax/output-contract-gate validate    # node dist/cli.js
```

`test` runs against compiled output, so `build` first.

## CLI

The package ships an `output-contract-gate` bin (`dist/cli.js`). Validate a
Markdown response against an EDN contract file:

```bash
pnpm --filter @open-hax/output-contract-gate build

node packages/legacy/output-contract-gate/dist/cli.js \
  --contract ./contract.example.edn \
  --response /tmp/candidate.md \
  --artifacts-root ./artifacts/output-contract-gate
```

The CLI prints JSON.

- exit `0` = structure passed
- exit `1` = structure failed; JSON includes `repairPrompt`
- exit `2` = CLI/IO/contract loading error

By default the CLI writes a run bundle under:

```text
./artifacts/output-contract-gate/<run-id>/
```

Use `--artifacts-root <dir>` to override or `--no-artifacts` to suppress writing.

Current artifact bundle:
- `input.json`
- `contract.edn`
- `contract-ir.json`
- `candidate.md`
- `candidate.ast.json`
- `validation-report.json`
- `final-decision.json`
- `repair-prompt.txt` when structure fails

### Generate mode

Generate a candidate, then pipe it through the structure gate and, on success, the review stub:

```bash
node packages/legacy/output-contract-gate/dist/cli.js generate \
  --contract ./contract.example.edn \
  --task-text "Turn this request into the required five-section response." \
  --generator fixture-valid \
  --artifacts-root ./artifacts/output-contract-gate
```

Supported generators (default `fixture-valid`):
- `fixture-valid`
- `fixture-invalid`
- `openai-chat`

`openai-chat` uses an OpenAI-compatible `POST /chat/completions` transport. The
default base URL is `OPENAI_BASE_URL` or `http://127.0.0.1:8789/v1` (the canonical
local `proxx` primary port). The default model is `gpt-5.4`; select another model
explicitly with `--model`.

Useful flags:
- `--task-file <path>`
- `--task-text <text>`
- `--generator <mode>`
- `--base-url <url>`
- `--model <id>`
- `--api-key <token>`
- `--temperature <n>`

Generate mode adds:
- `task.txt`
- `generation-report.json`

and, when structure passes, also writes:
- `review-report.json`

### Review stub

Once a structurally valid bundle exists, emit a machine-shaped stub review report:

```bash
node packages/legacy/output-contract-gate/dist/cli.js review-stub \
  --bundle ./artifacts/output-contract-gate/<run-id>
```

This writes:
- `review-report.json`

and augments:
- `final-decision.json`

The stub reviewer is deterministic and heuristic-only. It is a placeholder for the later GPT-family semantic reviewer.

## Status

Prototype only, and deprecated (see banner above).
The first reference contract is the five-section response shape:
- Signal
- Evidence
- Frames
- Countermoves
- Next

## License

Package `license` field is `GPL-3.0-only` (`package.json`). No `LICENSE` file is
present in this package directory.
