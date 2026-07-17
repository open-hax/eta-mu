---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Keryx Task PR Instructions'
summary: 'Shell commands to open a PR with the Keryx kanban tasks.'
category: 'other'
created: '2026-07-10'
---

# @GitHub open a PR with the task files into main.

I can’t open the PR directly from this session because no GitHub write connector is available. The target repository and PR surface are here:[^14_1]

Create the files from the prior message, then run:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b kanban/keryx-opencode-assembly

mkdir -p kanban/epics kanban/tasks

# Add:
# kanban/epics/keryx-opencode-assembly.md
# kanban/tasks/keryx-architecture-spec.md
# kanban/tasks/keryx-package-shell.md
# plus the remaining seven Incoming task cards

git add kanban/epics/keryx-opencode-assembly.md kanban/tasks/keryx-*.md
git commit -m "kanban: add Keryx OpenCode assembly epic"
git push -u origin kanban/keryx-opencode-assembly

gh pr create \
  --base main \
  --head kanban/keryx-opencode-assembly \
  --title "kanban: add Keryx OpenCode assembly epic" \
  --body-file - <<'EOF'
## Summary

Adds the Keryx planning epic and initial Incoming task cards for an
OpenCode-first ημ declaration interpreter and target compiler.

Keryx is scoped as the lawful assembly/herald layer:
- ημ remains the source of semantic declarations, contracts, and ledgers
- `extern.*` exclusively owns host/JS translation
- OpenCode is the first conformance target
- existing extensions are classified before any migration

## Included

- Keryx OpenCode assembly epic
- Architecture/specification task
- CLJS package and quality-gate task
- Core invocation/result/descriptor law task
- Declarative capability-manifest task
- OpenCode extern codec task
- `inspect_assembly` OpenCode vertical-slice task
- Secret-policy and receipt-observer task
- `.ημ` OpenCode config-composition task
- Existing-extension archaeology task

## Validation

Planning-only change. No production code or board file was edited.
Tasks begin in `Incoming` in accordance with `PROCESS.md`.
EOF
```

The PR should contain task files only and should not modify `.kanban/board.json`, because the project process specifies that task cards drive the board rather than manual board-file edits.
<span style="display:none">[^14_10][^14_2][^14_3][^14_4][^14_5][^14_6][^14_7][^14_8][^14_9]</span>

<div align="center">⁂</div>

[^14_1]: https://github.com/open-hax/eta-mu/pulls

[^14_2]: https://github.com/open-hax/eta-mu/activity

[^14_3]: https://github.com/open-hax

[^14_4]: https://github.com/open-hax/eta-mu/blob/main/AGENTS.md

[^14_5]: https://github.com/open-hax/eta-mu/blob/main/clojure-lsp.edn

[^14_6]: https://github.com/E-HAX/.github/pulls

[^14_7]: https://github.com/stateful/rollup-plugin-eta/pulls

[^14_8]: https://fabioz.github.io/mu-repo/open_url/

[^14_9]: https://github.com/cryspen/hax/pulls

[^14_10]: https://libraries.io/npm/@open-hax%2Feta-mu-extensions