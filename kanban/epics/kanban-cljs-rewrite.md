---
category: "epics"
labels: ["epics", "cljs", "kanban", "rewrite", "openplanner-protocols"]
write-id: "1783700388205-0.2tej6ym34fn50rpg9ma"
points: "55"
source: "planning-session:2026-06-08"
title: "Kanban CLJS Rewrite: Server, CLI, Frontend"
priority: "P0"
status: "done"
uuid: "kanban-cljs-rewrite"
created_at: "2026-06-08T00:00:00Z"
---

# Kanban CLJS Rewrite: Server, CLI, Frontend

> Package: `packages/legacy/kanban` (`@open-hax/kanban-legacy`)
> Parent program: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Related package epic: `kanban/epics/output-contract-gate-cljs-rewrite.md` shares board composition logic

**Status:** In progress — server FSM + ledger live; CLI write commands (comment/frontmatter) and the comment endpoint remain for TS parity. See `kanban/tasks/rheos-comments-parity.md`.

## What was built

- `packages/kanban-cljs/` — Fastify server, CLJS CLI, board composition, FSM engine, event emission
- `services/eta-mu/kanban/ecosystem.config.cjs` — updated to point to kanban-cljs
- `services/eta-mu/kanban/openhax.kanban.json` — meta fields on all 75 projects
- 21 tests, 36 assertions, 0 failures, 0 warnings
- node:fs/promises imports (knoxx pattern), ^:async/await throughout

---
**Board audit 2026-06-12 — bounced done → review.** NOT done. The card claims "CLJS kanban at feature parity" — this is false. The CLJS CLI (`cli.cljs`) exposes only board/compose/events/drift/serve; it has NO status-change, move, comment, or frontmatter commands that the legacy TS CLI provides. The server lacked a comment endpoint and any FSM enforcement, and the event ledger did not load at runtime. The child task `eta-mu-cljs-rewrite-surface-parity` is still in `review`, so the epic cannot be done. Stale `completed_at` removed. Remaining: CLI write commands, server comment route, FSM enforcement, real parity check vs TS.
---

**Session 2026-06-13 progress.** NOW DONE: server enforces FSM + records to ledger; CLI gained project-aware `move`/`events`/`drift`. REMAINING for true TS parity: comment endpoint + CLI `comment`/`frontmatter` commands (the legacy TS CLI has these). Moved review → todo.

---
**Session 2026-06-16.** Comment + frontmatter parity delivered in Rheos:
- `POST /api/task/:uuid/comment` appends a comment section and records the event.
- `PATCH /api/task/:uuid/frontmatter` updates frontmatter keys and records the event.
- CLI `comment` and `frontmatter` subcommands added.
- `write-id` correlation keeps legitimate CLI edits from being flagged as drift.

Remaining: UI editors for comment/frontmatter in the web view (not strictly CLI parity); potential routing of new Rheos subcommands through the legacy `eta-mu kanban` dispatcher.
---

[Omitted long matching line]

---
**PR #134 should-fix batch 2026-06-16.** Closed out the remaining Kimi/CodeRabbit should-fix findings in `kanban/tasks/pr-134-review-should-fix-batch.md` (status `review`). All five implemented and verified green:
- **frontmatter-whitelist** — new pure `rheos.backend.law.frontmatter` (mutable allow-list + forbidden identity/correlation keys); handler 400s `:status` and any non-mutable key so a client can no longer overwrite uuid/write-id/source-path/created_at or bypass the FSM.
- **compose-regex-guard** — `compose.cljs:26` regex match wrapped in try/catch → non-match instead of crashing the query DSL.
- **xss-sanitize** — Rheos `sidebar.cljs` + chat-ui `message.cljs` now route `marked` output through `DOMPurify.sanitize`; `dompurify ^3.4.10` added to both packages and installed (lockfile updated).
- **workflow-harden** — `staging-pr.yml` + `main-pr-gate.yml` hardened (explicit permissions, SHA-pinned actions, `persist-credentials: false`); actionlint clean.
- **pi-agent-contract** — `pi-agent.ts` ResourceLoader now honors the interface (append prompts stored; `undefined` system prompt preserved); typecheck clean, net-zero TS lines.

Verification across owned sets: clj-kondo 0/0, Rheos `pnpm test` 58/164 green, chat-ui `pnpm test` 2/6 green, both browser/esm builds clean, actionlint exit 0, `pnpm typecheck` exit 0.

**Remaining for PR #134 to merge clean:** commit + push the working-tree edits (this batch did not commit/push) — touches `packages/Rheos/{src,package.json}`, `packages/chat-ui/{src,package.json}`, `pnpm-lock.yaml`, `packages/legacy/github/src/pi-agent.ts`, `.github/workflows/{staging-pr,main-pr-gate}.yml`. Then re-run CI on the PR. Non-blocking follow-ups recorded on the card: decide whether frontmatter handler should 400 vs. drop unknown keys (board client may echo read-only fields), SHA-pin the remaining ~12 workflows still on tag pins, and revisit DOMPurify allow-list config if specific markdown elements need gating.

2026-07-10: added sidebar comment editor (POST /api/task/:uuid/comment) to close the remaining UI editor gap. Frontmatter editor was already present. The potential routing of Rheos subcommands through the legacy eta-mu kanban dispatcher is deferred as a future bridge task if needed. @open-hax/rheos build, test, and lint all pass. Moving to done.
---