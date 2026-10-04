---
uuid: "4985bd7d-c027-4bca-8ae9-35aa21d7ba35"
title: "Bound review Discord batches by combined embed text"
status: "incoming"
type: "task"
priority: "P1"
points: 1
labels: "github, review, discord, workflow-restoration"
category: "tasks"
source: "Proxx451 native run37189134772/job111397632160"
---

# Bound review Discord batches by combined embed text

## Observed failure

[Proxx #451 run 37189134772](https://github.com/open-hax/proxx/actions/runs/37189134772)
published native MiMo COMMENTED review 5405123975, then its Discord step failed
at 2026-10-04T08:50:19Z with HTTP 400: embed size exceeds 6000. The failed job
111397632160 correctly retained a failing terminal result. Review publication
and notification success are separate observations.

The reusable workflow bounds each description to 1500 characters but sends up
to ten embeds together. [Discord's message contract](https://github.com/discord/discord-api-docs/blob/main/developers/resources/message.mdx)
limits combined title, description, field name/value, footer and author text
across the whole message to 6000 characters, with at most ten embeds.

## Scoped plan

Change only batching in the existing inline Discord effect adapter. Count all
supported embed text after the existing field truncation, accumulate embeds in
their existing order, and start a new message before either bound is exceeded.
Retain review-author fields, URLs, timestamps, allowed-mentions suppression,
fresh-comment selection, permissions, credentials and HTTP failure propagation.

## Acceptance and local verification

- Execute the actual YAML/github-script step with mock GitHub pagination and
  mock fetch enforcing Discord's combined text and embed-count limits.
- Ten long comments reproduce HTTP 400 on the unchanged merged workflow, then
  all deliver within both bounds after repair, including Unicode and field text.
- Short comments still obey the ten-embed limit; exactly 6000 text units fit
  while the next unit starts a new message. Preserve ordered payload contents.
- A genuine non-success HTTP response still rejects the step; absent webhook
  or fresh comments sends nothing.
- Run focused Node22 workflow regressions, syntax, actionlint and diff hygiene.

## Boundaries

This is a manually authored incoming card, not a board transition or operational
receipt. No new service, domain implementation, secret, model request, native
Discord probe, identity policy or caller pin change is introduced. No durable
notification deduplication is claimed by this batching repair. Parent owns PR
publication, fresh native qualification and subsequent consumer propagation.
