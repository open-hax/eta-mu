---
uuid: "290f0cdf-9160-453e-a69c-67211432baa7"
title: "Make reusable OpenCode review gates truth-preserving"
status: "in_progress"
priority: "P0"
labels: [""]
created_at: "2026-08-29T17:59:19.886Z"
parent: "github-actions-as-a-muse-projection-target-from-katamorph-workflow-contracts"
write-id: "1788026970050-0.ywbvv5firmmrkdvzooq"
---

---
Scoped plan: reproduce run 33266077981; checkout the event PR head explicitly and prove expected SHA equals independently observed HEAD with a clean-tree guard in deterministic and review jobs; emit deterministic result and exact-head outputs; keep evidence and review artifacts under always conditions; add one stable final required job that fails on missing or non-success outputs or failed dependencies; add a GPL-3.0-or-later validator plus unit/structural regressions, including expected/executed SHA mismatch; publish exact-head PR and merge only after current checks and review threads are truthful.

Hosted controlled red-path proof is deliberately split to ready card 164c2de7-7495-4738-94e1-a81167edefb0 and GitHub issue #297; this implementation PR carries executable local falsification plus hosted green production gates.

GitHub issue: https://github.com/open-hax/eta-mu/issues/298
---