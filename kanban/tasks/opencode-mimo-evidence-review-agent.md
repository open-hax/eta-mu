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


## Native OpenCode definition preservation — separately scored continuation

The one-point compatibility outcome is owned by
[preserve post-Muse native review tool definitions](preserve-post-muse-native-review-tool-definitions-59d05d0f.md)
(`4b21cb6f-160c-4c15-8410-46b959d05d0f`). This original five-point card retains
its historical implementation and unfinished canary. The child has its own
acceptance and completion; its point is additional capacity, not an unrecorded
slice of this card's five points. The two source estimates are five plus one.
Neither outcome is marked complete by this planning correction.

The child's invariant is that eta-mu's outer `tool.definition` adapter adds no
rewrite after the existing Muse hook. If that prior hook changes a description,
its changed value remains; the original pre-Muse host string is not declared
immutable. All schemas, IDs, executor references, input/output object identity,
other hooks, reviewer prompt and ACL remain subject to the child's preservation
controls.

The direct/default workflow currently installs OpenCode `1.18.18`; the Foresight
consumer separately supplies `1.18.31`. The child requires native-definition
fixtures bound to those actual selections. The dated `1.18.31`/35-ID private
capture remains historical evidence and cannot qualify default `1.18.18`
definitions. Client/version selection, compiled Muse/skills pins and the
anonymous dynamically selected latest eligible zero-cost MiMo route remain.
The historical model slugs above are dated observations.

Hosted completion is defined in the child by the existing exact-head evidence,
context, accepted-invocation, publication and final review gates, plus the current
coverage/CodeQL/sandbox checks. Downstream Foresight caller adoption and the
Services admission/rollout cards are named handoffs there; their completion is
separate from this child. This correction does not diagnose a provider 403,
supply readiness, apply the private RED/GREEN patches, or authorize a model
health probe, gate weakening or production action.

---

Implementation started 2026-07-27 from a direct operator request. The first canary's
deterministic stage passed and uploaded evidence. A later run proved anonymous
`opencode/mimo-v2.5-free` inference works, but also exposed two integration defects: the
review-context artifact initially omitted hidden files, and the pinned OpenCode GitHub action
ignored its `agent` input and fell back to the mutable built-in `build` agent. Commits
`574f37f`, `fc40dd1`, and `e9146d4` preserve the full context, remove the false API-key gate,
force the bounded reviewer through inline config, and complete the deterministic Clojure/build
environment.
