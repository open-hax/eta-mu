---
uuid: "review-thread-read-completeness"
title: "Require complete GitHub review-thread reads"
status: "incoming"
type: "task"
priority: "P2"
points: "1"
labels: "github, review-gate"
dependency: []
category: "tasks"
write-id: "1795047020515-0.kivwnqxupalmbfoyh2p"
created_at: "2026-11-19T00:10:20.515Z"
---

# Require complete GitHub review-thread reads

## Outcome

Review Resolution can use the thread list only after GitHub returns a complete, internally consistent paginated read for the requested PR.

## Scope

- Validate the existing legacy GitHub adapter's thread connection, thread entries, reported count and continuation metadata. Preserve successful PR and issue contexts and comment previews.
- Keep the existing gate decision and token scopes. Refuse missing review-thread evidence at the gate boundary.
- Leave the reusable workflow pin and Axxium stack for their separate promotion and qualification.

## Acceptance criteria

- [ ] Complete empty and paginated results preserve the existing caller contract.
- [ ] If a provider read cannot establish completeness, fail before returning a gate result.
- [ ] Focused and full legacy GitHub tests, typecheck, build and independent review use the exact proposed head.
- [ ] Record when the separate hosted workflow pin must be advanced.

## Source

[Axxium Integration Desk #47](https://axxium-integration-desk.enso-err.chatgpt.site), Dot report `a0000000-0000-4000-8000-000000001107`.
