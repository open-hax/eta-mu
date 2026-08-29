---
uuid: "164c2de7-7495-4738-94e1-a81167edefb0"
title: "Prove reusable review gate red path in a fixture caller"
status: "ready"
priority: "P1"
labels: [""]
created_at: "2026-08-29T18:08:42.560Z"
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
write-id: "1788026953740-0.odfmi6poi7bmlp0mot6"
---

---
Acceptance: in a disposable same-repository fixture caller pinned to the merged reusable-workflow revision, run one deterministic gate that exits non-zero; prove the summary artifact records result=failure plus expected/executed/completion SHAs, the review attempt artifact remains downloadable, and the stable OpenCode evidence review gate concludes failure. Then run a zero-exit control at an exact clean head and prove that same named terminal job succeeds. Record caller PR, exact heads, workflow run IDs, artifact names, and required-check configuration; do not weaken or bypass the production workflow.

GitHub issue: https://github.com/open-hax/eta-mu/issues/297
---