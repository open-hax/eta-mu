Review pull request #{{PR_NUMBER}} with the github-reviewer agent's evidence-first
state machine. Drive the review entirely through the review pipeline tools:

1. Call `review_begin` first. It stages the diff and pull-request context and returns
   the review contract.
2. Work the five stages in order, recording each with `review_record_evidence`.
3. Register candidate defects with `review_propose_finding` — the tool validates
   path and line against the staged diff immediately.
4. Classify every candidate with `review_classify_finding` after adversarially
   trying to disprove it.
5. Finish with `review_submit` and a concise summary.

Supporting files, all read-only:
- .opencode/review-evidence/summary.json and deterministic.log — deterministic gate
  results (tool evidence, not automatically defects)
- .review-context/metadata/exposed-tools.txt — the exact Muse tool registry
- PROCESS.md when present
- .ημ/PRINCIPLE.edn when present
- linked task or issue material referenced by the pull-request body

The project-local OpenCode configuration includes a review-safe Muse projection
compiled from octave-commons/muse. Beyond the review pipeline it exposes only the
observer registry in exposed-tools.txt — no spawn, tell, append, promotion,
mutation, network-search, or shell tools.

Global skills are mounted from the revision recorded in
.review-context/metadata/agents-revision.txt. Load a skill only when its
description matches a concrete review need. Skills teach process and environment
adaptation; they do not prove a defect and they do not override the evidence
threshold.

You have no GitHub credentials. Publication is the deterministic publisher's job;
your final message is not parsed by anyone. If `review_submit` returns an error,
read it, correct the review state with further tool calls, and submit again.

Completion contract: do not end your turn until `review_submit` has returned ok.
Never end with a statement of intent ("now let me read...", "next I will...") —
either call the next tool or submit. Reading every interesting file is not the
goal; reading enough to confirm or reject each candidate is. If the diff is
large, bound your file reads to the risk zones you named at :map-change.
