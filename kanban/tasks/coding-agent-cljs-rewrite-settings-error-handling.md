---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "1sp"]
write-id: "1783880856718-0.ez1hlq89p2bwk4qn0bc"
points: "1"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Settings Error Handling Policy"
priority: "P1"
status: "review"
uuid: "coding-agent-cljs-rewrite-settings-error-handling"
created_at: "2026-07-11T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Settings Error Handling Policy

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 1

## Purpose

Define a consistent error handling policy for settings/auth file I/O in the CLJS rewrite.

## Current State

- `read-json-file` returns `{:ok true/false :data :error :code :path}` structured results
- `load-settings!` and `load-auth!` log warnings on errors but silently return fresh defaults
- ENOENT is silenced (expected on first run)
- Parse errors log to console but don't propagate to caller

## Decision Required

Should `load-settings!` and `load-auth!`:
1. **Throw** on parse errors (fail-fast, caller must catch)
2. **Return tagged error** (`{:ok false :error ...}`) for caller to decide
3. **Keep current behavior** (log + return defaults, silent data loss risk)

## Acceptance Criteria

- [ ] Document the chosen policy in a code comment or docstring
- [ ] Update `load-settings!` and `load-auth!` to follow the policy
- [ ] Add tests for error cases (missing file, corrupt JSON, permission denied)
- [ ] Ensure all callers handle the error path correctly

## Notes

- Silent data loss is dangerous: user edits settings.json, it gets corrupted, next load silently returns defaults
- But throwing on first-run (no file yet) would require try/catch everywhere
- Consider: throw on parse errors, return defaults on ENOENT

---
Implemented error handling policy: throw on parse/permission errors, defaults on ENOENT. Updated load-settings! and load-auth! to follow the policy. Added infra/settings_test.cljs (8 tests) and infra/auth_test.cljs (12 tests). All gates green (0 clj-kondo, 0 boundary, 336 tests/1165 assertions/0 failures).

Policy decided and implemented: throw on parse/permission errors, defaults on ENOENT. All 336 tests pass. Ready for sign-off.
---