---
category: "tasks"
labels: "workflow,lint"
parent: "eta-mu-quality-ratchet"
type: "task"
write-id: "1788046652314-0.1s7jp0vafcgpk1r99fc"
points: "1"
title: "Group review-resolution gate outputs for ShellCheck SC2129"
priority: "P1"
status: "done"
uuid: "review-resolution-gate-shellcheck-sc2129"
created_at: "2026-08-29T23:03:05.043Z"
---

# Group review-resolution gate outputs for ShellCheck SC2129

## Outcome

Keep the reusable review-resolution gate warning-free by writing its three parsed target-repository outputs through one grouped redirect, without changing their names or values.

## Scope

- Change only the `Resolve target repository` output block in `.github/workflows/review-resolution-gate.yml`.
- Preserve `full_name`, `owner`, and `repository` output semantics exactly.
- Do not sweep similar workflow blocks in this slice; any independently reproduced warning elsewhere remains separate work.

## Acceptance criteria

- [ ] The three output commands use one `{ ... } >> "$GITHUB_OUTPUT"` group.
- [ ] `actionlint` 1.7.12 with ShellCheck 0.11.0 reproduces SC2129 on the pre-fix workflow.
- [ ] The same pinned command exits zero with no diagnostics after the fix.
- [ ] The workflow remains valid YAML and `git diff --check` passes.
- [ ] The implementation PR receives exact-head automated review with every finding addressed before merge.

## Evidence command

```bash
PATH=/workspace/scratch/8d4eacbf051e/actionlint.vSin5v:$PATH \
  /workspace/scratch/8d4eacbf051e/actionlint.vSin5v/actionlint \
  -color=false .github/workflows/review-resolution-gate.yml
```

## Discovery

Reported while repairing the analogous Proxx workflow in PR #358. Eta-mu main at `83d42968b42844e2809ab03ccb1b5ad3fec30148` retains the same three individual redirects in its reusable review-resolution gate.

---
Intake evidence 2026-08-29: reproduced on exact main 83d42968 with actionlint 1.7.12 and ShellCheck 0.11.0. The pinned command exits 1 at review-resolution-gate.yml:48 with SC2129 because the three target-repository outputs redirect individually. Plan remains the 1-point card scope: group only those unchanged echo commands under one redirect, rerun the identical command, verify YAML and diff hygiene, then take the exact-head PR through all automated review gates.

Implementation evidence 2026-08-29: on base 83d42968, actionlint 1.7.12 with ShellCheck 0.11.0 exited 1 with SC2129 at line 48. After grouping the same three echo commands behind one redirect in only review-resolution-gate.yml, the identical pinned command exits 0 with no diagnostics. A sample open-hax/eta-mu execution emits exactly full_name=open-hax/eta-mu, owner=open-hax, repository=eta-mu; git diff --check passes.

Merged completion evidence 2026-08-29: PR #303 merged exact reviewed head 3b43f882ebf3e8fd892f6dc8aa71469682792527 as a6d39f48587ed60eee1666d5ef1cd037898d6293. All six exact-head workflows succeeded; the OpenCode review publisher and terminal truth gate succeeded; Codex completed against 3b43f88 with no findings; CodeRabbit withdrew its only non-applicable serializer-formatting suggestion and the sole thread is resolved. Acceptance is complete.
---