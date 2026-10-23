---
uuid: "e6310a86-b37b-40a9-9931-92e081e68fd9"
title: "Separate the Foresight MiMo waiver from deterministic evidence obligations"
labels: review, workflow, foresight
---

## Outcome

Honor the October 21 MiMo waiver for `riatzukiza/foresight` while keeping deterministic execution, context compilation, exact-head binding and clean-tree requirements mandatory.

## Scope and non-goals

Add a default-on reusable workflow model-review requirement. Only the exact waived repository may opt out, and only for the existing anonymous MiMo model selection. The MiMo job still runs and retains its actual status; native CodeRabbit/Codex approvals and findings stay with canonical PR-flow. No branch-protection bypass, fabricated passing job, other repository waiver, or deployment activation.

## Acceptance criteria

- Existing callers and direct execution continue to require successful MiMo publication.
- Foresight can select its recorded exception explicitly; invalid repository/model/boolean input fails closed.
- Every deterministic result, revision and clean-tree denial still blocks under the exception.
- Failed MiMo execution is reported honestly, never converted into approval or review credit.

## Verification

Execute the actual terminal gate with the waived and standard tuples, plus deterministic failure/skipped/missing/mismatched and foreign-scope controls; run the registered review-workflow suites.

## Provenance

https://github.com/riatzukiza/foresight/pull/47#issuecomment-6328083797 and the user's October 22 reconciliation instruction. This Markdown creates scope only; no board transition is claimed.
