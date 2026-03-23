# pi AGENTS.md (local)

This repo is the canonical, self-contained pi home.

## Source of truth
The full agent contract/instructions live in:

- `~/.pi/agent/operation-mindfuck/*.lisp`

They are automatically appended to the system prompt by:

- `~/.pi/agent/extensions/opencode-global-instructions.ts`
  (configured in `~/.pi/agent/settings.json`)

## Local addenda
- Canonical runtime skills live in `~/.pi/agent/skills`.
- The absorbed legacy `opencode-skills` repo lives in `~/.pi/collections/opencode-skills`.
- Use `session-mycology` when you want quiet per-turn retrospection, p-score friction tracking, or incubation of reusable skill spores across sessions.
