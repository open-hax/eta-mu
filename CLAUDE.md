# CLAUDE.md

@AGENTS.md

<!--
AGENTS.md is the single source of truth for every agent harness. Claude Code
imports it here so it loads even when a parent directory has its own CLAUDE.md.
Anything below this comment must be true only for Claude Code.
-->

## Claude Code

- **Subagent models**: when delegating per AGENTS.md § Session and Turn
  Discipline, use Sonnet for coding subagents and Haiku for exploration and
  research.
- **Worktrees**: Claude Code session worktrees live under `.claude/worktrees/`,
  which is gitignored and excluded from biome (`!.claude/**` in `biome.json`).
  The AGENTS.md worktree rules still apply: push before removing a worktree, and
  remove it once its branch is pushed.
