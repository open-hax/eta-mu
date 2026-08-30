---
category: "tasks"
labels: "rheos, security, frontmatter, serialization, round-trip"
type: "task"
write-id: "1788076844189-0.avin2gout2q2pdki54q"
points: "5"
title: "Escape and round-trip all Rheos frontmatter string values"
priority: "P0"
status: "incoming"
uuid: "escape-and-round-trip-all-rheos-frontmatter-string-values"
created_at: "2026-08-30T08:00:43.505Z"
---

# Escape and round-trip all Rheos frontmatter string values

## Outcome

Make Rheos frontmatter serialization a total, canonical, injection-safe round trip for every externally mutable string value and every string member of a serialized vector, without changing card identity, lifecycle authority, or append-only history.

## Exact reproducer

Today `serialize-frontmatter` interpolates a string directly into a quoted physical line. A title such as:

```text
safe"
uuid: "forged-card
```

can serialize as:

```yaml
uuid: "original-card"
title: "safe"
uuid: "forged-card"
status: "incoming"
```

The parser accepts the later key, so a descriptive title update can forge the parsed card UUID.

## Scope

- Define one canonical encode/decode law for scalar string values and for every string member of vector values.
- Apply the law to all externally mutable string fields: `title`, every `labels` member/projection, `category`, `description`, `estimate`, and `assignee`.
- Preserve the existing validators and ownership boundaries for `priority`, `points`, `parent`, and `dependency`; compose with them instead of replacing them.
- Use the same serialization boundary for create, frontmatter update, write-id injection, comment-preserving rewrites, HTTP, CLI, MCP, and UI callers.
- Preserve canonical key cardinality: one physical frontmatter key must decode to exactly one logical key, with no value able to introduce a key, document delimiter, or body/comment section.

## Acceptance criteria

- [ ] For every admitted scalar string `s`, parsing the canonical serialization returns exactly `s`, and serializing that parsed value returns byte-identical canonical bytes.
- [ ] The same round-trip and canonical-byte law holds independently for every string member of a serialized vector.
- [ ] Tests cover empty strings, embedded double quotes, backslashes, commas, colons, leading/trailing spaces, LF, CR, CRLF, `---`, Unicode, and combinations of those values.
- [ ] The exact title injection above remains one `title` value and cannot add or replace `uuid`, `status`, `write-id`, or any other key.
- [ ] Each externally mutable string field and the labels vector has an adversarial create/update round-trip test through the real file boundary, not only a helper-unit assertion.
- [ ] Invalid or unrepresentable input is refused before effects: card file bytes, event ledger bytes, comments, and write-id remain unchanged.
- [ ] Comment append and write-id injection preserve all unrelated frontmatter values byte-stably under the canonical form.
- [ ] Existing dependency-ID line-safety and locked-card refusal laws continue to pass unchanged.
- [ ] Documentation states the accepted string grammar, canonical escaping, compatibility behavior for existing cards, and failure boundary.
- [ ] Relevant Rheos tests, builds, clj-kondo, hosted gates, and exact-head reviews are terminal green with zero warnings before merge.

## Required adversarial tests

- Scalar and vector values containing `"`, `\\`, `\n`, `\r`, `\r\n`, commas, colons, and frontmatter delimiters.
- Multiple special characters in one value, including a quote followed by an injected-looking key line.
- Duplicate-key-looking payloads for `uuid`, `status`, and `write-id`.
- Round-trip through create and through each externally writable adapter, with exact decoded equality and physical key-count assertions.
- Refusal paths assert no partial file, ledger, comment, or correlation-token mutation.

## Adjacent non-owners

- Eta issue #306 tracks the distinct Rheos planning-metadata round-trip work and must not be widened to own generic string serialization.
- Eta issue #234 owns the distinct locked-card/body mutation boundary.
- Eta PR #312 remains frozen and does not carry this repair.

## Canonical external owner

- Eta issue #317: https://github.com/open-hax/eta-mu/issues/317

## Non-goals

- No lifecycle/FSM redesign.
- No direct edits to existing card frontmatter or append-only ledgers.
- No weakening of identity, dependency, planning-metadata, or locked-card validators.

---
Projection authority 2026-08-30: canonical external owner is eta-mu issue #317. Issue #306 is limited to planning-metadata round trips, issue #234 is limited to locked-card mutation refusal, and PR #312 remains frozen; none of those adjacent records owns generic string serialization. This card stays incoming until a separately reviewed implementation begins.
---