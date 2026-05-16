# pi AGENTS.md (local)

This repo is the canonical, self-contained pi home.

## Source of truth
The full agent contract/instructions live in:

- `~/.pi/agent/operation-mindfuck/*.lisp`

They are automatically appended to the system prompt by the built-in CLJS runtime tool:

- `packages/eta-mu-extensions/src/eta_mu/extensions/opencode_global_instructions.cljs`
  (declared in `packages/eta-mu-extensions/manifest.edn` and package metadata)

## Local addenda
- Canonical runtime skills live in `~/.pi/agent/skills`.
- The absorbed legacy `opencode-skills` repo lives in `~/.pi/collections/opencode-skills`.
- Use `session-mycology` when you want quiet per-turn retrospection, p-score friction tracking, or incubation of reusable skill spores across sessions.
