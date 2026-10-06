---
title: "Recover one unfinished MiMo review after an unavailable tool loop"
uuid: "7c44b3fc-7dbe-4c96-9125-4cce4ec4796e"
labels: "workflow, review, recovery"
category: "tasks"
type: "task"
---

# Recover one unfinished MiMo review after an unavailable tool loop

## Outcome

An unfinished evidence review that terminates after repeatedly calling an unavailable review tool gets one corrective invocation using the actual staged registry. A completed review is never repeated by this recovery path.

## Scope and acceptance

- Preserve both invocation outputs, exit codes and failure evidence.
- Detect the actual host tool failure from structured OpenCode events and terminal invalid-tool permission rejection, not quoted model prose.
- Start the complete evidence-first state machine again; require every current input, stage, page assessment, schema, live-head and App publication guard unchanged.
- Share the existing two-attempt bound with omitted-submission recovery.
- Fail closed for malformed/present failed submissions, provider authentication/quota/network failures, spawn rejection, repeated failure, malformed events or unknown tool mappings.
- Transport the exact updated runner in the checksummed reusable review context.
- Verify the actual runner and packaged child-process boundary with positive and negative cases; qualify fresh native reviews and mandatory CI before normal protected merge.

## Evidence and limits

Agents17 b67 run37387058259 ended with exit1 and no submission after valid reads followed by unavailable assess_diff_chunk calls; the staged registry exposed review_assess_diff_chunk. The old two-attempt runner only recovered exit0 omission. Its later manually authorized successful attempt is immutable history, not a target for another invocation.

This is an extension of the completed bounded-review-submit-recovery card. No earlier successful wrong-tool recovery baseline has been observed, so this slice is fault-tolerance hardening, not a claimed regression restoration. No runtime tool alias or permission guard is changed. The reviewed OpenCode-first design remains docs/notes/design/opencode-first-agent-runtime.md.
