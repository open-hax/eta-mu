---
uuid: "kanban-comment-writer-setext-delimiter"
title: "kanban comment writer emits setext-heading-shaped comment delimiters"
status: "incoming"
priority: "P3"
labels: ["tasks", "kanban", "rheos", "markdown", "1sp"]
created_at: "2026-07-25T00:00:00Z"
source: "CodeRabbit review on PR #142 (recurring MD003 findings)"
points: 1
category: "tasks"
---

# kanban comment writer emits setext-heading-shaped comment delimiters

`eta-mu kanban comment` appends a comment as `<text>\n---`, with no blank line
between the prose and the `---` delimiter. In Markdown, a non-blank line
immediately followed by `---` parses as a **setext heading**, not as a horizontal
rule or a section delimiter — so every card comment written by the CLI turns its
own last paragraph into an `<h2>`, and markdownlint reports MD003.

This is the root cause behind a recurring class of review findings: PR #142 alone
drew six of them across different cards, and each was fixed by hand. The hand
fixes do not stop the next comment from reintroducing it.

## Scope

- [ ] Make the comment writer emit `\n<text>\n\n---\n` (blank line before the
      delimiter) so the delimiter is a delimiter and the prose stays prose.
- [ ] Keep the section-toggle semantics intact: `---` on its own line is what
      separates body from comment sections in the card format, so the fix must be
      the blank line, **not** converting the delimiter to an ATX heading.
- [ ] Confirm the board UI still renders existing comments (written without the
      blank line) identically — the parser must tolerate both shapes.
- [ ] Add a test asserting an appended comment is followed by a blank line before
      its delimiter.

## Notes

The writer currently lives in the legacy TS kanban path that
`eta-mu kanban comment` still shells out to; the rheos CLJS implementation is the
place to fix it if the cutover has reached the comment subcommand by then. See
`kanban-cli-status-validation-bug` for the same legacy-vs-CLJS split.

## Verification

```bash
# Append a comment, then confirm no prose line directly precedes a delimiter.
eta-mu kanban comment <card> "test comment"
awk 'NR>12 && prev !~ /^$/ && /^-{3,}$/ {print FILENAME" "NR; rc=1} {prev=$0} END{exit rc}' \
  kanban/tasks/<card>.md
```
