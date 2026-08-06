---
status: incubating
created: 2026-07-30T22:51:28.028477248Z
source-session: /home/err/spaces/eta-mu/.claude/worktrees/agent-operating-standard
source-task: Split the CLI identity: eta-mu stays published, eta-mu-beta links to the working tree
p-efficiency: 0.5
p-friction: 0.5
p-skill-candidate: 0.8
promoted-to: ""
rejected-reason: ""
---

## Problem
The owner said they use eta-mu-beta 'all the fucking time'. It had been broken for three months: a global symlink in pnpm's bin pointing at /home/err/devel/orgs/open-hax/eta-mu/packages/coding-agent/dist/cli.js, a path that stopped existing when the workspace moved to /home/err/spaces/eta-mu. A dangling symlink reports 'command not found', which reads as 'never installed' rather than 'broken by a move', so it never got diagnosed.

## Pattern
Workspace relocation silently breaks every integration that recorded an absolute path OUTSIDE the repo: global bin symlinks, systemd unit ExecStart/WorkingDirectory, editor and daemon configs, CI runner paths, stale --tasks-dir defaults baked into docs and card bodies. The repo's own git history shows no sign of it because none of these files live in the repo. This is the second instance in this workspace; the Rheos board server's systemd unit was the first.

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
After moving or renaming a workspace, sweep for external references to the old path before doing anything else: grep the old path across ~/.config, ~/.local/share, ~/.volta, systemd user units, and shell rc files; test every global bin entry that should point into the repo (ls -l on the bin dir reveals dangling symlinks that 'command not found' hides). When creating such an integration, prefer a distinct name over shadowing an existing one (eta-mu-beta beside eta-mu, not a PATH reordering fight), and record the re-creation command in DEVELOPMENT.md so the link is reproducible from the repo instead of being machine lore.

## Receipt refs
- none
