# `~/.pi`

Canonical self-contained home for the local pi agent setup.

## What lives here

- `agent/skills/` — canonical runtime skills migrated from `~/.agents/skills`
- `agent/extensions/` — local pi extensions
- `agent/themes/` — local TUI themes
- `agent/operation-mindfuck/` — canonical global instruction / contract files
- `collections/opencode-skills/` — absorbed legacy `open-hax/opencode-skills` repo contents
- `specs/` — migration / repo specs
- `receipts.log` — append-only execution receipts

## Canonical runtime paths

- Skills: `~/.pi/agent/skills`
- Global instructions: `~/.pi/agent/operation-mindfuck/*.lisp`
- Extensions: `~/.pi/agent/extensions/*.ts`

## Legacy paths

These may still exist locally, but are no longer the intended source of truth:

- `~/.agents` (now expected to be a compatibility shim to `~/.pi/agent/skills`)
- `~/.config/opencode/operation-mindfuck`
- `~/devel/orgs/open-hax/opencode-skills`

## Git policy

Tracked:
- config, skills, extensions, themes, contracts, docs

Ignored:
- auth/session data
- runtime state
- local binaries

## Notes

- `collections/opencode-skills/` is preserved in-repo source material; it is not the default active skill root in `agent/settings.json` to avoid overlapping skill-name collisions with the canonical runtime skill set.
- `~/.agents/skills` can safely remain present as a symlink shim for older tooling; the canonical editable source is still `~/.pi/agent/skills`.
