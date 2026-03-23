# Spec Draft: Self-contained `~/.pi` repo

## Goal
Make `~/.pi` the canonical, self-contained git repo for pi agent runtime assets.

## Scope
- Track pi agent config, extensions, themes, operation-mindfuck contracts, and canonical skills in `~/.pi`.
- Absorb the current `open-hax/opencode-skills` repo into this repo as preserved source material.
- Stop depending on `~/.agents` and `~/.config/opencode/operation-mindfuck` as primary runtime sources.
- Ignore sessions and sensitive/runtime state.

## Open questions
- None at the moment.

## Risks
- Skill duplication if both canonical and absorbed legacy skill roots are enabled at runtime.
- Breaking runtime if settings or extension paths still point at legacy locations.
- Accidentally tracking session or auth data.

## Priorities
1. Canonicalize runtime under `~/.pi`.
2. Preserve current skills and absorbed repo contents.
3. Keep git history clean via `.gitignore`.
4. Leave legacy paths untouched but non-canonical.

## Phases
1. Create repo scaffolding (`.gitignore`, specs, receipts, docs, git init).
2. Copy canonical runtime assets into `~/.pi` (skills, operation-mindfuck contracts, metadata).
3. Update runtime config and extensions to use `~/.pi` paths.
4. Absorb `opencode-skills` as preserved in-repo source material.
5. Verify no active config depends on `~/.agents` or legacy opmf paths.

## Affected files
- `agent/AGENTS.md`
- `agent/settings.json`
- `agent/extensions/opencode-global-instructions.ts`
- `agent/extensions/opmf-contract-runtime.ts`
- `agent/skills/**`
- `agent/operation-mindfuck/**`
- `collections/opencode-skills/**`
- `.gitignore`
- `README.md`

## Definition of done
- `~/.pi` is a git repo.
- Sessions/auth/runtime state are ignored.
- Canonical runtime config points only at `~/.pi` paths.
- All current `~/.agents/skills` are present under `~/.pi`.
- Former `opencode-skills` repo contents are preserved inside `~/.pi`.
- Verification confirms no active runtime references remain to legacy skill or opmf paths.

## Status
- Local migration complete.
- Remote created at `https://github.com/open-hax/eta-mu-pi`.
- `~/.agents` converted into a compatibility shim that points at `~/.pi/agent/skills`.

## Verification
- `agent/settings.json` parses and now points at `~/.pi/agent/skills/`.
- `git check-ignore` confirms `agent/auth.json`, `agent/sessions`, `agent/state`, and `agent/bin` are ignored.
- Canonical runtime tree has 64 skills and 5 operation-mindfuck Lisp files.
- Absorbed legacy collection preserves 125 `opencode-skills` skill directories.
- `rg` over `agent/` confirms no active runtime references remain to `~/.agents` or legacy opmf paths.
- `~/.agents/skills` now resolves to `~/.pi/agent/skills`.
- `~/.agents/.skill-lock.json` now resolves to `~/.pi/agent/skills/.skill-lock.json`.
