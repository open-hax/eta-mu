---
uuid: "frontmatter-value-typing-decision"
title: "Decide whether frontmatter values are typed, in one place"
status: "incoming"
type: "task"
priority: "P3"
points: "3"
parent: "rheos-cli-card-lifecycle-authority"
category: "tasks"
write-id: "1786030614253-0.7400xeusxcxa2o6wv5"
created_at: "2026-08-06T15:36:54.253Z"
---

# Decide whether frontmatter values are typed, in one place

## Outcome

Frontmatter values have one declared type story, applied identically by the
CLI, the HTTP `PATCH` path, and the MCP tool.

## The evidence

Raised by CodeRabbit on PR #168, against `cmd-frontmatter`: `--set points=3`
sends the string `"3"`, and nothing coerces it. Declined there on purpose —
adding coercion in the CLI would give the CLI a second opinion about frontmatter
types while `law/frontmatter` owns the key set and `domain/task-edit` owns the
plan. `PATCH /api/task/:uuid/frontmatter` does no coercion either, so the CLI
would start disagreeing with the HTTP path. Two write paths with different
typing is a worse failure than the untyped one.

Today every value is written as a YAML scalar and read back as a string, so the
round trip is at least consistent.

## The actual question

Should frontmatter be typed at all?

- **No** — say so in the law's docstring and in `docs/cli.md`, and the
  inconsistency stops being a latent surprise.
- **Yes** — the type belongs beside `mutable-keys` in `law/frontmatter`, with
  the coercion in `domain/task-edit` where both the CLI and HTTP paths already
  pass through, and a test asserting the two agree on the same input.

`points` is the field that motivates it: it is arithmetic everywhere it is read,
and it is a string everywhere it is stored.

## Scope

- Pick one of the two above and write the decision down.
- If typed: declare types in the law, coerce in the domain, and cover both write
  paths with one test.
- Leave existing card files alone; whatever is chosen applies going forward and
  on the next write of each card.

## Acceptance criteria

- The decision is recorded where the key set is declared, not only on this card.
- CLI and HTTP produce identical frontmatter for identical input, asserted by a
  test.
- No coercion lives in a CLI command function.
