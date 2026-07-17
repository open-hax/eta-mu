---
uuid: "pr-134-review-should-fix-batch"
title: "PR #134: resolve remaining should-fix review findings"
status: "done"
priority: "P1"
labels: ["tasks", "rheos", "chat-ui", "github", "cljs", "pr-134", "5sp"]
created_at: "2026-06-16T00:00:00Z"
source: "Kimi/CodeRabbit review on PR #134"
points: 5
category: "tasks"
---

# PR #134: resolve remaining should-fix review findings

Batch closeout of the remaining "should-fix" findings from the Kimi/CodeRabbit
review on PR #134. Five findings across Rheos (backend + UI), chat-ui, CI
workflows, and the legacy github agent. All five are implemented; each owned
file set was lint/typecheck/test-verified green.

## 1. frontmatter-whitelist (Rheos backend)

**Finding:** `handle-update-frontmatter` in
`packages/rheos/src/rheos/backend/infra/http_server.cljs` (~144-169) passed an
arbitrary client `updates` map straight into `task-edit/update-frontmatter!`,
letting a client overwrite identity/correlation metadata (uuid, write-id,
source-path, created_at) and bypass the FSM by setting `status`.

**Done:** Added pure law namespace `rheos.backend.law.frontmatter` describing the
client-mutable shape: `mutable-keys` (#{:title :priority :labels :points
:category :description :estimate :assignee}), explicit `forbidden-keys`
(status, write-id/write_id, source-path/sourcePath/source, uuid,
created-at/created_at — snake + kebab), plus pure predicates `mutable-key?`,
`status-update?`, `disallowed-keys`, `disallowed-keys-message` (no I/O, mirrors
`law.fsm` style). Reworked the handler `cond`: normalize client keys to
keywords, then (1) reject any `:status` touch with 400 pointing at
`POST /api/task/:uuid/status`, and (2) reject any key outside the mutable set
with 400 naming offending keys. Only allow-listed updates reach
`task-edit/update-frontmatter!`.

**Files:** `packages/rheos/src/rheos/backend/law/frontmatter.cljs`,
`packages/rheos/src/rheos/backend/infra/http_server.cljs`

**Verification:** clj-kondo clean on owned files and full `src`/`test` tree
(0/0). Rheos `pnpm test` (58 tests, 164 assertions) 0 failures; browser
`shadow-cljs compile app` clean. VERIFIED GREEN.

**Follow-up (owner decision):** `disallowed-keys` currently 400s the whole
request on any unknown key rather than dropping it. Stricter and surfaces client
bugs, but a board client echoing server-set read-only fields (e.g. `createdAt`)
on save would now get a 400. If the frontend echoes server fields back, either
trim client-side or switch the handler to `select-keys`/drop. `mutable-keys` is
a best-effort vocabulary — extend if the board adds descriptive fields.

## 2. compose-regex-guard (Rheos backend)

**Finding:** `compose.cljs:26` had `:regex (re-matches (re-pattern tv) fv)`,
which throws an unhandled exception on a malformed user regex (e.g.
`title ~ [invalid`) in the user-facing query DSL, propagating into
`apply-operator` -> `filter-task`.

**Done:** Wrapped compile+match in try/catch returning false on `:default`:
`:regex (try (boolean (re-matches (re-pattern tv) fv)) (catch :default _ false))`.
Malformed regex now yields a non-match instead of crashing the query.

**Files:** `packages/rheos/src/rheos/backend/domain/compose.cljs`

**Verification:** clj-kondo clean (0/0) when run from the Rheos package dir
(picks up the package `.clj-kondo` config defining `^:async/await`). Covered by
the Rheos `pnpm test` green run above. VERIFIED GREEN.

## 3. xss-sanitize (Rheos UI + chat-ui)

**Finding:** Two React render sites injected raw `marked` output via
`dangerouslySetInnerHTML` with no sanitization (stored/DOM XSS): Rheos
`sidebar.cljs:199` (task body markdown) and chat-ui `message.cljs:28` (chat
message content). Both browser-rendered.

**Done:** Added `dompurify ^3.4.10` to both packages, ran
`pnpm -C orgs/open-hax/eta-mu install` (registry reachable, +2 packages,
lockfile updated). Required as `["dompurify" :default DOMPurify]` (correct
shadow-cljs `:js-provider :shadow` browser interop) and wrapped marked output:
`(.sanitize DOMPurify (marked ...))`. `:__html` now receives sanitized HTML.

**Files:** `packages/rheos/src/rheos/ui/domain/sidebar.cljs`,
`packages/rheos/package.json`,
`packages/chat-ui/src/eta_mu/chat_ui/message.cljs`,
`packages/chat-ui/package.json`, `pnpm-lock.yaml`

**Verification:** clj-kondo clean both files. chat-ui `pnpm run build` (esm
:lib) clean; chat-ui `pnpm test` (2 tests, 6 assertions) 0 failures. Rheos
`shadow-cljs compile app` clean. Confirmed dompurify bundled into both compiled
outputs and `.sanitize` survives DCE. VERIFIED GREEN.

**Blocker/note (dependency install):** required a real `pnpm install` —
completed successfully, lockfile committed. chat-ui pins `marked` to v4 (a
comment warns marked@12+ uses ES #private fields the Closure compiler can't
parse); DOMPurify 3.x built fine, but a future marked bump in chat-ui still
needs Closure-build verification. Optional: DOMPurify config
(ALLOWED_TAGS/link hooks) if specific elements should be allowed/denied —
default config already strips scripts/event-handlers and closes the hole.

## 4. workflow-harden (CI)

**Finding:** `staging-pr.yml` used mutable tag pins (checkout@v5, setup-node@v5,
pnpm/action-setup@v4) and had no permissions block; `main-pr-gate.yml` still
tag-pinned pnpm/action-setup@v4 and actions/github-script@v8 while its other
actions were SHA-pinned.

**Done:** `staging-pr.yml`: top-level `permissions: {}`, per-job
`permissions: contents: read`, `persist-credentials: false` on every checkout,
all actions SHA-pinned with version comments reusing the repo's existing pins
(checkout@93cb6ef #v5.0.0, setup-node@a0853c2 #v5.0.0,
pnpm/action-setup@b906aff #v4.3.0). `main-pr-gate.yml`: consistency pins only —
pnpm/action-setup@b906aff #v4.3.0, github-script@ed59741 #v8.0.0. SHA provenance
resolved via `gh api` (annotated tag targets) / copied from already-hardened
`deploy-production.yml`.

**Files:** `.github/workflows/staging-pr.yml`,
`.github/workflows/main-pr-gate.yml`

**Verification:** `actionlint` exits 0 on staging-pr, main-pr-gate,
deploy-production, deploy-staging. VERIFIED GREEN.

**Follow-up:** No repo-wide SHA pin existed for pnpm/action-setup; 12 other
workflows still tag-pin pnpm/action-setup@v4 and several use github-script@v7 by
tag. A follow-up pass (outside owned files) could SHA-pin those for full repo
consistency.

## 5. pi-agent-contract (legacy github)

**Finding:** In `packages/legacy/github/src/pi-agent.ts`, the ResourceLoader from
`createResourceLoader` had two bugs: `setAppendSystemPrompt` was a no-op that
discarded caller prompts (`getAppendSystemPrompt` always returned `[]`), and
`setSystemPrompt` coerced `undefined` to `""` via `?? ""`, breaking the "unset"
semantics (`getSystemPrompt` returns `string | undefined`).

**Done:** Added closure-scoped `let appendPrompts: string[] = []`;
`getAppendSystemPrompt` returns it, `setAppendSystemPrompt` stores its arg.
`setSystemPrompt` now assigns `prompt` directly (dropped `?? ""`), preserving
undefined. Widened `createResourceLoader` `systemPrompt` param from `string` to
`string | undefined` to match the interface exactly.

**Files:** `packages/legacy/github/src/pi-agent.ts`

**Verification:** `pnpm typecheck` (runtime prebuild + `tsc --noEmit`) exit 0,
zero errors. `git diff --numstat` = 5/5 = net-zero lines, satisfying the TS
net-zero-lines pre-commit guard. VERIFIED GREEN.

## Acceptance

- [x] frontmatter-whitelist: client cannot set `status` or identity/correlation
      keys; only allow-listed keys reach `update-frontmatter!`; lint + Rheos
      tests green.
- [x] compose-regex-guard: malformed user regex yields non-match, not a crash;
      lint + Rheos tests green.
- [x] xss-sanitize: both render sites route marked output through
      `DOMPurify.sanitize`; dompurify installed (lockfile updated); both builds
      clean and `.sanitize` confirmed in compiled output.
- [x] workflow-harden: staging-pr + main-pr-gate have explicit permissions,
      SHA-pinned actions, `persist-credentials: false`; actionlint exits 0.
- [x] pi-agent-contract: ResourceLoader matches the interface (append stored,
      undefined preserved); typecheck clean; net-zero TS lines.
- [ ] All edits committed and PR #134 pushed (no commit/push performed in this
      batch — working-tree only).
