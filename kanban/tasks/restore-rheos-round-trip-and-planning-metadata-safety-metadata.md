---
category: "tasks"
labels: "rheos, cli, round-trip, planning"
dependency: []
type: "task"
write-id: "1788072879884-0.0ue8ic2tkgt6ud11ocb"
points: "3"
title: "Restore Rheos round-trip and planning metadata safety"
priority: "P0"
status: "review"
uuid: "rheos-roundtrip-planning-metadata"
created_at: "2026-08-30T03:09:19.638Z"
---

# Restore Rheos round-trip and planning metadata safety

## Outcome

Rheos comment and metadata rewrites preserve the semantic difference between no
dependencies and an ordered dependency vector, while creation uses the card
types declared by each repository instead of inventing a global vocabulary.

## Scope

- Normalize empty and historical blank dependency array members at the parser boundary.
- Add typed dependency create and frontmatter set/clear support to CLI and MCP/API adapters.
- Treat configured `cardDirs` keys as a closed creation vocabulary, with legacy fallback only when absent.
- Keep status, identity, provenance, and parent update protections unchanged.
- Expose the complete planning-key set for issue #234 without implementing a partial lifecycle lock here.

## Acceptance criteria

- Commenting a card with `dependency: []` persists `[]`, never `[""]`.
- Non-empty dependency vectors preserve ordered, nonblank ids through rewrites and ledger events.
- Configured repository card types create in their configured directories; undeclared types are refused.
- CLI and MCP schemas express dependency vectors, including an explicit empty-vector clear.
- Parser, law, domain, infra, CLI, and adapter regressions pass with kondo and release builds clean.

---
Scope: resolve eta-mu issues #305 and #306 with one bounded Rheos patch. Preserve empty dependency vectors on comment/update; reject or safely normalize blank dependency IDs; let creation use repository-declared card types rather than the global task/epic hard-code; accept structured dependency UUIDs at creation and guarded frontmatter update/clear; keep status and identity protections unchanged; add parser, domain, infra, CLI, API/MCP-schema, and end-to-end regression coverage. Compose with #234 by treating dependency as a planning key and leaving lifecycle lock enforcement to that card until its shared guard lands.

Verification: built Rheos CLI set dependency to the explicit empty vector and then appended this comment without introducing a phantom dependency. Package suite: 179 tests / 901 assertions green; clj-kondo 0 errors / 0 warnings; release server, cli, github-sync, and app all compiled with 0 warnings.

Final gate correction after isolating the new domain cases in a reviewable text test file: Rheos 180 tests / 902 assertions, 0 failures; clj-kondo 0 errors / 0 warnings; release server, cli, github-sync, and app all 0 warnings. Eta-mu bridge suite 174 tests / 391 assertions, 0 failures; eta-mu kondo 0 errors / 0 warnings.

Review transition remains correctly blocked by the repository-wide build hook: pnpm build stops before package builds because the managed pnpm wrapper rejects ignored dependency build scripts (canvas, esbuild, fs-ext-extra-prebuilt, koffi, msgpackr-extract, protobufjs). No supply-chain policy or lockfile was changed. The scoped Rheos tests, kondo, all four release targets, and eta-mu bridge tests/kondo remain green.

Current-main successor evidence 2026-08-30: the implementation commit was replayed onto exact eta main f0f3abef94268ac5262a205280a5bd5247e30ce7; the three append-only ledgers were reconciled as base plus both tails in event-time order, and all source/test changes apply without conflict. On this exact tree, Rheos is 180 tests / 902 assertions with zero failures, clj-kondo reports 0 errors / 0 warnings, and release server, cli, github-sync, and app each compile with 0 warnings; git diff check is clean. The eta-mu bridge remains environment-blocked before compilation because repo1.maven.org cannot resolve shadow-cljs 3.4.11. The managed pnpm dependency verifier also rewrites an allowBuilds placeholder and rejects the same ignored native scripts before package commands; that incidental rewrite was removed and no supply-chain policy changed. The card stays in_progress and PR #312 stays draft until exact hosted gates/review establish a lawful review transition; no completion is claimed.

Exact published-head hosted evidence for PR #312 at a65c8a3e52c58729a1bdde6baf27de7715f79f82 / tree 06989af78f2485bcc935149c43033717e5f31818 is terminal green. Sandbox bundle run 33296977996 job 99218238851 completed install, validate, test, build, collection, and upload successfully. Coverage run 33296978000 passed eta-mu CLI test, kondo, coverage, e2e, CLJS extensions, and TypeScript packages. Rheos run 33296978007 job 99218238643 passed tests, lint, and all release targets; sync run 33296977980 job 99218238633 passed board generation, drift history, projection dry-run, and evidence upload. CodeQL 33296978100 and the draft-safe OpenCode terminal gate 33296977982 also succeeded. This supersedes the local Maven and managed-wrapper execution blockers as exact hosted broad proof, so the card may now walk in_progress -> testing -> review; no review or completion verdict is claimed yet.
---