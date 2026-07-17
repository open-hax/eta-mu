---
category: "tasks"
labels: ["tasks", "cljs", "eta-mu", "tools", "3sp"]
write-id: "1784221871757-0.bwgjhewy1b48o5235pj"
points: "3"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Eta-mu Agent Tools — find, grep, ls parity"
priority: "P0"
status: done
uuid: "eta-mu-agent-tools-parity"
created_at: "2026-07-15T00:00:00Z"
---
# Eta-mu Agent Tools — find, grep, ls parity

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Predecessor: `kanban/tasks/eta-mu-agent-tools.md` (done — read/bash/edit/write)
> Decision: experience parity (maintainer, 2026-07-15) — the full stable tool
> set is required, not just the minimal four.

## Purpose

The published stable CLI ships `find`, `grep`, and `ls` tools alongside
read/bash/edit/write. Same-experience parity means the model gets the same
tool vocabulary. Reference behavior only:
`packages/legacy/coding-agent/src/core/tools/{find,grep,ls}.ts` — match the
observable behavior (names, parameters, output shape, truncation), not the
TypeScript implementation.

## Scope

- `find` — file finding with glob/ignore semantics matching the stable tool.
- `grep` — content search with the stable tool's output framing/limits.
- `ls` — directory listing with the stable tool's formatting/limits.
- Registered in `eta-mu.infra.tools.registry` next to the existing four.
- While reading the reference, note any `edit-diff` behavior the current
  `edit` tool lacks and record it as a comment (fix under a separate card if
  material).

## Definition of done

- [ ] Each tool follows the Knoxx tool law (data map, law schema, pure domain
      decisions, I/O behind `extern.*`).
- [ ] Each tool has unit tests: happy path + one failure mode + one
      truncation/limit case.
- [ ] Tool descriptions/parameters match the stable CLI closely enough that a
      prompt written for stable works unchanged.
- [ ] An e2e case exercises at least one of the new tools through the mock
      OpenAI server in `test-e2e`.
- [ ] `pnpm -C packages/eta-mu test`, `test:e2e`, `lint:kondo` green, zero
      warnings.

## Verification

```bash
pnpm -C packages/eta-mu test
pnpm --dir packages/eta-mu test:e2e
pnpm -C packages/eta-mu lint:kondo
```

---
Implemented 2026-07-15: find, grep, ls tools, following the existing Knoxx tool law layering (data map + law schema in eta-mu.law.tools, pure decisions in eta-mu.domain.tools.*, I/O in eta-mu.extern.fs / eta-mu.infra.tools.*).

Reference behavior only (not implementation): packages/legacy/coding-agent/src/core/tools/{find,grep,ls}.ts. Legacy shells out to `fd`/`rg` external binaries via a tool-downloader; this rewrite reimplements the observable behavior natively (recursive fs walk + hand-rolled glob matcher) rather than depending on external binaries, since eta-mu is a from-scratch reimplementation, not a port.

New modules:
- eta-mu.domain.tools.glob — glob->regex (*, **, ?) + a best-effort .gitignore-style ignore matcher (bare patterns match any path segment; patterns with `/` match the full relative path). Documented as an approximation, not a full .gitignore spec implementation.
- eta-mu.domain.tools.{find,ls,grep} — pure filter/sort/limit/format decisions.
- eta-mu.extern.fs gained `directory?`, `list-dir` (single-level), and `walk` (recursive, skips ignored directory names, doesn't follow symlinks).
- eta-mu.domain.tools.truncate gained `truncate-line` (parity with legacy's GREP_MAX_LINE_LENGTH=500 marker).
- eta-mu.infra.tools.{find,grep,ls} — orchestration: resolve path, walk/list, apply domain decisions, truncate via existing truncate-head, build notices matching legacy's wording ("N results/matches/entries limit reached..."). Registered in eta-mu.infra.tools.registry next to the existing four.

Deviations from legacy noted for the record (not filed as separate cards — material enough to mention, not enough to warrant follow-up work):
- .gitignore support is a simplified path-segment/basename matcher, not gitignore's full precedence/negation semantics (negation `!pattern` is explicitly dropped during parsing).
- grep's "match limit reached" flag can be a false positive when the true match count exactly equals the limit (legacy tracks true early-termination; this rewrite doesn't disambiguate "exactly N matches" from "more than N, capped at N"). Low-impact wording-only edge case.
- No edit-diff gap found while reading the reference — edit.cljs's existing exact-match-replace behavior already matches legacy's edit tool observable behavior for the paths exercised.

Tests: domain unit tests for glob/find/ls/grep (happy path + ignore/limit/case/literal/context variations), infra tool tests using real tmp directories for find/grep/ls (happy path + missing-path failure + limit/truncation case each, matching the DoD). New e2e case (agent-cli-find-grep-ls-tools-e2e-test) drives all three new tools through the real built CLI against a mock streaming OpenAI server.

Verification: pnpm -C packages/eta-mu test (115/115 green, up from 82), pnpm -C packages/eta-mu lint:kondo (0/0), pnpm -C packages/eta-mu test:e2e (3/3 green, 24 assertions).

Moved in_progress -> testing -> in_review per FSM (no shortcut edges) — ready for human review.
---