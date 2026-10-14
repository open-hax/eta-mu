---
category: "tasks"
labels: ["tasks", "github", "opencode", "review", "automation"]
write-id: "1792006835974-0.mwklufkd9wd11tj5v57"
points: "5"
source: "operator request 2026-07-27"
title: "Build an evidence-first OpenCode GitHub review agent using MiMo V2.5 Free"
priority: "P1"
status: "breakdown"
uuid: "opencode-mimo-evidence-review-agent"
created_at: "2026-07-27T20:35:40Z"
---

# Build an evidence-first OpenCode GitHub review agent

## Context

The existing OpenCode PR workflow uses a broad senior-maintainer prompt with Kimi and has
no automatic pull-request trigger on the current default branch. Broad open-ended review
invites generic criticism and false positives, especially from free models.

The requested replacement uses `opencode/mimo-v2.5-free` as a bounded GitHub reviewer.
Review quality is treated as the product of repository context, behavioral reasoning, and
an explicit evidence threshold. Repeated same-model consensus is not treated as proof.

The reviewer also needs the operator's portable process and compatibility surfaces without
turning those surfaces into new semantic authorities. `octave-commons/muse` therefore
compiles a restricted observer-only OpenCode plugin, while `riatzukiza/.agents` supplies the
external skills tree. Muse remains a compiler/projection boundary; skills remain method and
environment guidance rather than evidence.

## Scope

- Keep centralized review logic in eta-mu, consistent with the GitHub automation ownership
  boundary.
- Produce deterministic install/lint/test/build evidence before model review.
- Compile a pinned Muse profile containing only existing-state observer tools.
- Mount a pinned `riatzukiza/.agents` checkout at OpenCode's `~/.agents/skills` discovery
  path.
- Add one read-only OpenCode primary agent with a finite review state machine.
- Require adversarial validation before a candidate can become a reportable finding.
- Publish only changed-line, evidence-backed defects as inline comments.
- Keep test gaps and uncertain questions non-blocking.

## Acceptance

- [x] `.opencode/agents/github-reviewer.md` defines a read-only primary reviewer using
      `opencode/mimo-v2.5-free`.
- [x] The workflow runs on non-draft, same-repository pull requests.
- [x] Deterministic gate results are serialized for the reviewer without converting every
      environment failure into a bug claim.
- [x] A pinned `octave-commons/muse` revision compiles a review profile exposing only Muse,
      phase, actor, task, and agent observer projections.
- [x] Write/network-capable multiplexed tools (`receipt_river`, `edn_ledger`,
      `session_mycology`, web search) are absent from the review profile.
- [x] A pinned `riatzukiza/.agents` revision is mounted as the external skill source and its
      skill inventory is recorded in the review-context artifact.
- [x] The reviewer uses change mapping, contract auditing, semantic tracing, adversarial
      validation, and final editorial filtering.
- [x] Inline findings require changed-line evidence, a failure trace, confirmed status, and
      high confidence.
- [x] The free MiMo model uses OpenCode's anonymous public-provider path, public session
      sharing is disabled, and the reviewer has no repository-write or shell permission.
- [x] The workflow forces `github-reviewer` through inline OpenCode config because the pinned
      GitHub action currently ignores its documented `agent` input.
- [x] Agent-workflow and centralized-automation documentation describe the new contract.
- [ ] The canary run completes under the bounded `github-reviewer` agent and produces either
      evidence-backed comments or a short passing summary without modifying the branch.

## Verification

- Review the workflow permissions and trigger predicates.
- Validate the OpenCode agent frontmatter against current agent/permission syntax.
- Inspect the deterministic evidence artifact.
- Inspect the revision-bound Muse/skills context artifact and verify the forbidden tools are
  absent.
- Confirm the anonymous free-model path selects `github-reviewer`, not the built-in `build`
  agent.
- Re-run the pull-request canary and inspect its generated review output before merge.


## Native OpenCode definition preservation — compatibility continuation

### Context and outcome

The accepted eta-mu workflow at `0a4b8a8c372af1cea751d6f4bac7502e332bf5e3`
adds guidance by replacing the native `bash`, `glob`, `grep` and `read`
descriptions. Its tests deliberately require those replacements. This scoped
continuation changes that compatibility contract: the eta-mu outer adapter
preserves the host definition after the existing Muse hook, including its
description, rather than replacing it with eta-mu guidance. The existing
reviewer prompt and permissions continue to control reviewer behavior.

This is approximately a one-point compatibility slice within the existing
five-point card. It adds no new card or dependency. If work expands beyond the
one-line adapter correction and its owning tests, stop and re-estimate through
Rheos rather than silently increasing this scope.

### Scope

- Change `.github/workflows/opencode-code-review.yml` only at the native
  `tool.definition` description assignment.
- Extend the actual emitted-wrapper fixtures in
  `.github/scripts/opencode-code-review-workflow.test.mjs`.
- Preserve delegation to Muse, the prior definition hook and its result, tool
  schemas/IDs/executors, the installed reviewer profile and ACL, compiled Muse
  and skill pins, client/version selection, dynamic free-MiMo catalog selection,
  transported metadata/checksums and every existing evidence/publication gate.
- Keep the anonymous OpenCode route. Model IDs in the historical card are dated
  observations; current selection uses the unique latest eligible active,
  tool-capable, explicitly zero-cost free MiMo catalog row, with no fixed slug.

### Non-goals

No provider/account/key/credit operation, paid fallback, permission loosening,
client downgrade, new runtime/egress framework, health-guard adoption, review
policy change, gate bypass, metadata-history rewrite or production deployment.
This correction does not claim that native descriptions caused the provider's
403. The bounded private candidate reached reviewer generation but timed out
without terminal text; it supplied no causal comparison or hosted qualification.

### Acceptance criteria

1. Append four causal wrong-result regressions: the accepted wrapper replaces
   each supplied native description; the corrected wrapper preserves each one.
2. Preserve all 13 native plus 22 Muse IDs in the dated 1.18.31 fixture and their
   schema object references. This fixture count is not a universal future API
   count. No executor runs in these fixtures.
3. Delegate Muse once with the original input; preserve its complete tool map,
   executor references and other hooks. Await the prior definition hook once
   with original input/output, retain its modifications and propagate rejection.
4. Preserve installed profile/config bytes and the existing true-only Bash ACL.
   Do not rewrite OpenCode's native tool descriptions or grant shell access.
5. Explicitly correct the two old replacement assertions to the preservation
   contract while retaining their remaining schema, metadata, identity, ordering
   and failure checks. Do not remove or skip the original tests.
6. Complete canonical planning review and lawful Rheos readiness before repository
   RED. Commit the causal RED first, then apply the minimal GREEN and obtain fresh
   code review and all required native checks before protected adoption.

### Verification and risks

Use the existing workflow test surface:
`node --test .github/scripts/opencode-code-review-workflow.test.mjs`.
The private rehearsal selected 12 tests: eight passed and the four new native
preservation cases failed for wrong descriptions. The private corrected full
file passed all 82 tests with no failures or skips. Syntax and bounded actionlint
checks passed; no full repository lint or hosted result is claimed. Those
rehearsals used the existing installed YAML 2.9.0 bytes without installing or
changing dependencies; the root declaration remains 2.8.3.

Private source/test patches and complete captured evidence are frozen in
`review-state/eta-mu-native-description-preservation-source-preparation-v1` under
the deployment session evidence root. Actual pinned-CLI metadata qualification
separately observed unchanged 35 IDs/schemas and effective reviewer ACL; that
private observation is not a native review or readiness event.

Removing per-tool guidance changes the model-facing description surface. Preserve
existing prompt/ACL guidance and verify the owning workflow checks; require actual
fresh hosted qualification before claiming transport or review restoration. All
current caller evidence, approval, adoption and Services rollout gates remain.

---

Implementation started 2026-07-27 from a direct operator request. The first canary's
deterministic stage passed and uploaded evidence. A later run proved anonymous
`opencode/mimo-v2.5-free` inference works, but also exposed two integration defects: the
review-context artifact initially omitted hidden files, and the pinned OpenCode GitHub action
ignored its `agent` input and fell back to the mutable built-in `build` agent. Commits
`574f37f`, `fc40dd1`, and `e9146d4` preserve the full context, remove the false API-key gate,
force the bounded reviewer through inline config, and complete the deterministic Clojure/build
environment.
