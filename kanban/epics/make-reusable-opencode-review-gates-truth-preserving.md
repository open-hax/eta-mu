---
uuid: "290f0cdf-9160-453e-a69c-67211432baa7"
title: "Make reusable OpenCode review gates truth-preserving"
status: "in_progress"
priority: "P0"
labels: [""]
created_at: "2026-08-29T17:59:19.886Z"
parent: "github-actions-as-a-muse-projection-target-from-katamorph-workflow-contracts"
write-id: "1792077206570-0.t6rnr1ist4nrzlz760"
---

---
Scoped plan: reproduce run 33266077981; checkout the event PR head explicitly and prove expected SHA equals independently observed HEAD with a clean-tree guard in deterministic and review jobs; emit deterministic result and exact-head outputs; keep evidence and review artifacts under always conditions; add one stable final required job that fails on missing or non-success outputs or failed dependencies; add a GPL-3.0-or-later validator plus unit/structural regressions, including expected/executed SHA mismatch; publish exact-head PR and merge only after current checks and review threads are truthful.

Hosted controlled red-path proof is deliberately split to ready card 164c2de7-7495-4738-94e1-a81167edefb0 and GitHub issue #297; this implementation PR carries executable local falsification plus hosted green production gates.

GitHub issue: https://github.com/open-hax/eta-mu/issues/298

Implementation PR: https://github.com/open-hax/eta-mu/pull/299 at exact published head c4746e65c7afeadcdedd98c143a260e295f02d90; remote tree d35a67f9c61f224838d95efff8728660ef4ac506 matched the local committed tree byte-for-byte before review.

Planning discovery 2026-10-15 at accepted fefa6dd52135e1045b1ad56802a346dc0779970c: anonymous producer2 cf32641a-b336-407e-b68b-c75ec7d20dbb -> trusted central collector/publisher/status5 ed4e2a2a-6055-4d53-9cea-f3971c707551 -> existing hosted-proof3 164c2de7-7495-4738-94e1-a81167edefb0. Dependency arrow means later depends earlier.10 newly identified points, not completion or reassignment of existing in_progress5 reviewer owner. This parent remains in_progress/P0 with existing metadata/history. Foresight incoming fork-review-setup3 and downstream Services consumption remain separate. Current Services per-repository App guard is publication coupling before inference; dynamic anonymous OpenCode route remains unchanged. Required status eta-mu/trusted-review-publication-v1 from expectedApp3152464 belongs on M only after trusted full-input/raw-trace/native-publication readback; producer cannot assert it. Protected central credential/ref custody and actual target grants/protection/hosted enforcement remain unproven setup, no new App/key or account permission operation authorized. Reviewed v2 design SHA309297d62946667d463560e880bdce1dbc9e55bb2afce13da76331510ff80ecb. Planning only; no app/workflow implementation or parent completion.

---