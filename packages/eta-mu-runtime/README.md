# @open-hax/eta-mu-runtime

Typed movement kernel for the eta-mu control plane.

This package seeds the missing runtime layer described in the eta-mu charter and proactive-agent spec.

What is here now:

- typed belief, panel, movement, and episode models
- action-batch envelope schema
- state constructors for calm/default runtime state
- deterministic panel selection for cheap-loop planning
- conservative cheap-loop candidate ranking

What still belongs above or around it:

- persistent latent-state storage
- real event ingestion
- repo-specific actuators
- council UI integration
- breath receipts and memory writes

## Example

```ts
import {
  createActionBatch,
  createEtaBelief,
} from "@open-hax/eta-mu-runtime";

const belief = createEtaBelief({
  urgency: 0.8,
  reviewDebt: 0.7,
  deployRisk: 0.3,
});

const batch = createActionBatch({
  repo: "open-hax/proxx",
  trigger: "pull_request_review_comment",
  target: "pr#42",
  summary: "review debt is still blocking movement",
  belief,
  unresolvedReviewThreads: 3,
  quietWindowDetected: true,
});
```
