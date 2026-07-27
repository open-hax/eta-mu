---
category: "tasks"
labels: ["tasks", "github", "opencode", "review", "automation"]
write-id: "1785194140000-0.mimo-review-agent"
points: "5"
source: "operator request 2026-07-27"
title: "Build an evidence-first OpenCode GitHub review agent using MiMo V2.5 Free"
priority: "P1"
status: "in_progress"
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

## Scope

- Keep centralized review logic in eta-mu, consistent with the GitHub automation ownership
  boundary.
- Produce deterministic install/lint/test/build evidence before model review.
- Add one read-only OpenCode primary agent with a finite review state machine.
- Require adversarial validation before a candidate can become a reportable finding.
- Publish only changed-line, evidence-backed defects as inline comments.
- Keep test gaps and uncertain questions non-blocking.

## Acceptance

- [ ] `.opencode/agents/github-reviewer.md` defines a read-only primary reviewer using
      `opencode/mimo-v2.5-free`.
- [ ] The workflow runs on non-draft, same-repository pull requests.
- [ ] Deterministic gate results are serialized for the reviewer without converting every
      environment failure into a bug claim.
- [ ] The reviewer uses change mapping, contract auditing, semantic tracing, adversarial
      validation, and final editorial filtering.
- [ ] Inline findings require changed-line evidence, a failure trace, confirmed status, and
      high confidence.
- [ ] The workflow uses `OPENCODE_API_KEY`, disables public session sharing, and does not
      grant the model repository write or shell permissions.
- [ ] Agent-workflow and centralized-automation documentation describe the new contract.

## Verification

- Review the workflow permissions and trigger predicates.
- Validate the OpenCode agent frontmatter against current agent/permission syntax.
- Let the pull request exercise the workflow against its own changed files.
- Inspect the deterministic evidence artifact and any generated review output before merge.

---

Implementation started 2026-07-27 from a direct operator request. The slice is bounded to
one review workflow, one primary agent contract, documentation, and this task card.
