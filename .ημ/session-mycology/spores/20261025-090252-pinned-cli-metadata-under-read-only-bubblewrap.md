---
status: incubating
created: 2026-10-25T09:02:52Z
source-session: /home/err/.local/share/foresight-worktrees/eta-antigravity-review-20261023
source-task: Preserve the pinned Antigravity reviewer CLI during metadata and context diagnostics
p-efficiency: 0.62
p-friction: 0.78
p-skill-candidate: 0.82
promoted-to: ""
rejected-reason: ""
---

## Problem
A pinned Antigravity CLI path unexpectedly contained vendor 1.4.7 bytes after unconfined metadata investigation. The exact triggering command is unknown. The original 1.4.6 bytes survived in a separate `.old` backup and were restored; no settings or login mutation was found.

## Pattern
A CLI can have side effects even on metadata or inspection commands when it includes an updater. A version-pinned path is not proof that the bytes remain pinned across invocations. Treat all launches as stateful until the executable is isolated.

## Candidate skill outline
- Name suggestion: `pinned-cli-metadata-under-read-only-bubblewrap`
- Trigger phrases: inspect `--version`, list models, inspect context, or diagnose a CLI that can self-update.
- Before and after every launch, hash the exact executable path and compare it to the approved pin.
- Run metadata and interactive inspection commands inside the same read-only-root Bubblewrap boundary used for qualified review; overlay the strict settings file and keep controlled scratch separate.
- Preserve a hash-verified recovery copy; if drift occurs, record the observed hashes and restore the exact bytes atomically without renaming or launching the backup directly.
- Keep an unknown update trigger unknown; do not attribute the mutation to a particular command without evidence.
- Do not infer provider context clipping from a truncated locally persisted conversation excerpt.

## Better path
Resolve the exact binary and sandbox first. Hash it, run the requested inspection only inside the read-only sandbox, hash it again, and retain the result. If the UI cannot show context without writes or a model turn, stop and report the panel values as unknown rather than loosening the boundary.

## Receipt refs
- 2026-10-25T09:00:10Z — `:observation`, restored pinned CLI and guarded metadata boundary.
