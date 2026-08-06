---
uuid: "rheos-explicit-uuid-file-name"
title: "An explicit card uuid should own its file name"
status: "incoming"
type: "task"
priority: "P3"
points: "2"
parent: "rheos-cli-card-lifecycle-authority"
category: "tasks"
write-id: "1786026749069-0.ysr3vh6kl62vjidejl"
created_at: "2026-08-06T14:32:29.069Z"
---

# An explicit card uuid should own its file name

## Outcome

A card created with an explicit `--uuid` lands at `<uuid>.md`, not at
`<title-slug>-<last-8-of-uuid>.md`.

## The evidence

Creating the card for PR #176 with `--uuid rheos-github-issue-projection`
produced:

```text
kanban/tasks/project-canonical-rheos-tasks-to-github-issues-ojection.md
```

`card-file-name` keeps a card whose uuid equals its title slug at `<slug>.md`,
and otherwise appends the uuid's last eight characters. When the uuid was
*derived* from a collision that suffix is a random hex tail and reads fine. When
the uuid was *given*, the same rule truncates a deliberate, readable identifier
into a meaningless fragment — here, `ojection`.

## Why it is more than cosmetic

Two explicit uuids that share a title and end in the same eight characters
resolve to the same file name. The exclusive `wx` write refuses the second, so
nothing is lost — but the refusal reads as "a card file already exists" rather
than naming the actual collision, which is a confusing failure for a case the
caller controls.

## Scope

- When `--uuid` is supplied and is a safe path component, name the file
  `<uuid>.md`.
- Keep the derived path exactly as it is: slug, then a random suffix on
  collision.
- Make the collision refusal name the colliding uuid, not just the path.

## Acceptance criteria

- `rheos create --title "..." --uuid my-explicit-id` writes `my-explicit-id.md`.
- Derived-uuid naming is unchanged and its existing tests still pass.
- A test covers an explicit uuid whose slug differs from it.
- Existing cards are not renamed; this changes creation only.

## Notes

Follows `check-uuid!` from PR #167 — that refuses a uuid that is not a safe path
component, which is what makes naming the file after it safe in the first place.
