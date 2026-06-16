---
uuid: "docs-cljs-rewrite-markdown-parser"
title: "Docs CLJS Rewrite — Markdown Parser Domain"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 5
category: tasks
---
# Docs CLJS Rewrite — Markdown Parser Domain

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 5

## Purpose

Port the pure markdown parsing logic from `packages/legacy/docs/index.cjs` into CLJS `eta_mu.docs.domain.*` namespaces, keeping all I/O and platform concerns out of this layer.

## Scope

- Frontmatter parsing (`parseFrontmatter`, `parseFrontmatterScalar`, `parseFrontmatterTags`)
- Heading extraction (`extractHeadings`)
- Tag extraction (`extractInlineTags`, `extractHashtagsLines`, `normalizeTag`)
- Wikilink extraction (`extractWikilinks`, `normalizeWikilinkKey`)
- Markdown link extraction (`extractMarkdownLinks`)
- Code-block stripping (`stripFencedCodeBlocks`)
- Line-number helper (`lineNumberAt`)
- `parseEtaMuMarkdown` orchestration

## Work items

- [ ] Implement `eta_mu.docs.domain.frontmatter` with uuid and tag extraction.
- [ ] Implement `eta_mu.docs.domain.markdown` with headings, links, and tag extractors.
- [ ] Implement `eta_mu.docs.domain.parse` composing the above into `parse-eta-mu-markdown`.
- [ ] Preserve existing output shape and normalization behavior.
- [ ] Add unit tests covering the legacy test fixture plus malformed inputs.

## Acceptance criteria

- [ ] `parse-eta-mu-markdown` returns the same keys and normalized values as the legacy function.
- [ ] No Node/fs/path/crypto interop appears in domain namespaces.
- [ ] Unit tests pass under the CLJS test target.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-docs cljs:test
pnpm --filter @open-hax/eta-mu-docs typecheck
```

---

Blocked by `docs-cljs-rewrite-schemas`: the markdown domain relies on `eta_mu.docs.law.markdown` schemas, which must exist first.

---

Work started: porting pure markdown parsing logic from `packages/legacy/docs/index.cjs` into CLJS domain namespaces under `packages/runtime/src/cljs/eta_mu/docs/domain/`.

---

Delivered:
- `packages/runtime/src/cljs/eta_mu/docs/domain/frontmatter.cljs` — frontmatter splitting, scalar extraction (`uuid`), and tag list parsing (inline and YAML-list forms).
- `packages/runtime/src/cljs/eta_mu/docs/domain/markdown.cljs` — heading extraction, inline/hashtag tag extraction, wikilink/markdown-link extraction, code-block stripping, line-number helper, and path basename helper.
- `packages/runtime/src/cljs/eta_mu/docs/domain/parse.cljs` — `parse-eta-mu-markdown` orchestration returning the legacy shape `{:uuid :title :headings :tags :links}`, validating headings and links against `eta-mu.docs.law.docs` schemas.
- `packages/runtime/test/cljs/eta_mu/docs/parse_test.cljs` — legacy fixture parity tests plus malformed-input coverage (missing/unclosed frontmatter, YAML-list tags, code-block suppression, deduplication, title fallback, line numbers).

Verification:
- `pnpm --dir packages/runtime cljs:compile` passed.
- `pnpm --dir packages/runtime cljs:test` passed (90 tests, 413 assertions, 0 failures).
- `pnpm --dir packages/runtime cljs:boundary` passed ({"ok":true,"checked":56,"extern":9}).

No Node/fs/path/crypto interop was introduced in the domain namespaces; the boundary scanner is clean. No TypeScript source files in `packages/legacy/docs` were modified.

Recommended next task: Move `docs-cljs-rewrite-dts-emit` to ready and set up TypeScript declaration emit for the new CLJS docs package surface.
