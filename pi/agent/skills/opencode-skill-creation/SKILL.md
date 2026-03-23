---
name: opencode-skill-creation
description: Create OpenCode skills that validate and load correctly.
---

# Skill: OpenCode Skill Creation

## Goal
Create new OpenCode skills that validate, load reliably, and follow repo conventions.

## Use This Skill When
- The user asks to create a new OpenCode skill or add reusable workflow guidance.
- You need to standardize repeated workflows into a dedicated skill.
- You are expanding the OpenCode skill catalog under `.opencode/`.

## Do Not Use This Skill When
- The change is a one-off edit or quick fix.
- You are only updating a single file without new workflow guidance.

## Inputs
- User request and target workflow context.
- Existing skills in `.opencode/skill/` and `~/.pi/agent/skills/`.
- `AGENTS.md` skill list and any local agent guidance.

## OpenCode Compatibility Rules
- **Location**: OpenCode discovers skills at:
  - Project: `.opencode/skill/<name>/SKILL.md`
  - Global: `~/.config/opencode/skill/<name>/SKILL.md`
  - Claude-compatible (project): `.claude/skills/<name>/SKILL.md`
  - Claude-compatible (global): `~/.claude/skills/<name>/SKILL.md`
- **Frontmatter**: `SKILL.md` must begin with YAML frontmatter. Only these fields are recognized: `name`, `description`, `license`, `compatibility`, `metadata`.
- **Name rules**:
  - 1–64 chars
  - lowercase alphanumeric with single hyphen separators
  - no leading/trailing hyphen, no `--`
  - must match the directory name exactly
- **Description rules**: 1–1024 chars, specific enough for the agent to choose correctly.
- **Discovery**: For project-local paths, OpenCode walks up from the current working directory to the git worktree and loads matching skills along the way.

## Steps
1. Review `.opencode/skill/skill-authoring/SKILL.md` for the standard template.
2. Pick a valid skill name (kebab-case) and folder name.
3. Create the canonical skill at `~/.pi/agent/skills/<name>/SKILL.md` so Codex can load it.
4. Ensure `SKILL.md` starts with OpenCode-compatible frontmatter.
5. Create a project-local link for OpenCode:
   - `mkdir -p .opencode/skill/<name>`
   - `ln -s ~/.pi/agent/skills/<name>/SKILL.md .opencode/skill/<name>/SKILL.md`
6. Write clear **Goal**, **Use This Skill When**, and **Do Not Use This Skill When** gates.
7. Define **Inputs**, **Steps**, **Output**, and **References**.
8. Cross-link related skills instead of duplicating content.
9. Update `AGENTS.md` to reference the new skill.

## Output
- A new skill folder under `~/.pi/agent/skills/<name>/SKILL.md`.
- A project-local OpenCode-visible link at `.opencode/skill/<name>/SKILL.md`.
- Updated `AGENTS.md` entries referencing the new skill.

## References
- Skill authoring template: `.opencode/skill/skill-authoring/SKILL.md`
- Skill index guidance: `AGENTS.md`
