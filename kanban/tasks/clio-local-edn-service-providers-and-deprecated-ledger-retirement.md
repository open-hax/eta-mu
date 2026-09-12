---
category: "tasks"
labels: "clio, providers, sandbox"
type: "task"
write-id: "1789172004475-0.5svp146h41lsjbl5j1b"
title: "Clio local EDN service providers and deprecated ledger retirement"
priority: "P1"
status: "review"
uuid: "clio-local-edn-service-providers-and-deprecated-ledger-retirement"
created_at: "2026-09-11T23:34:31.827Z"
---

Implement the canonical Clio EDN development path and retire eta-mu's active dependency on the deprecated event-ledger package.

Discovery: packages/clio already owns schema revisions, event identity, admission, ordering, replay and durable Node ledger writes. packages/protocols has 8 public protocols but its EDN adapter only covers legacy-envelope EventAdmission. Sol still imports the deprecated git dependency. Clio lacks a JVM host adapter needed by Epiphany.

Scope: preserve protocol contracts and existing Mongo/REST/Socket providers; add complete local EDN service implementations using Clio events and projections; add JVM host adapters sharing Clio laws; migrate Sol to Clio with explicitly configured durable local storage. Never silently fall back from a configured remote provider. Parent owns other Foresight repositories.

Delegation: JVM Clio host boundary and Sol cutover are disjoint agent slices. Protocol adapters and integration remain with the coordinating agent. Worktree: eta-mu-clio-dev, branch feat/clio-local-providers.

Acceptance: validate admission, replay after restart, identity conflict, fail-closed corrupt state, protocol CRUD/graph/labels/translations, local authentication semantics and subscriptions. Run relevant package suites, builds and zero-warning lint. Record any concrete blockers and known limitations. Existing protocol envelope is compatibility payload, never an alternative canonical ledger.

---
Implemented canonical Clio JVM/Node adapters and UUID/instant parity, all eight protocol EDN providers with selectable Mongo/per-service overrides, and Sol operational episode cutover. Deprecated git dependency/imports removed with regression guard and obsolete CI dependency reads retired. Clio tests BB24/63, JVM56/135, NBB+Shadow56/120; Sol132/570, server build/HTTP health; protocols60/167, ESM artifact restart/namespace smoke; package lint and compiler warnings zero. Full session/run mutable projection rebuilding and existing Rheos raw-board EDN import are explicitly follow-up scope, not claimed complete. No external provider fallback, no bulk workspace reinstall; frozen offline lock verified.

Final review repaired two query contracts: present nil now satisfies $exists true, and unknown query operators are refused even against empty projections. Added focused assertions; protocols61tests171assertions pass, test/lib compile and Kondo0warnings, ESM restart smoke remains green. Direct NBB source store/reopen/get also passed (protocols-clio-nbb-smoke). Follow-up commit only changes EDN query laws/implementation/tests and this provenance.

Documentation follow-up scope: reconcile current ROADMAP, root protocol ownership guidance and Rheos dependency/run guidance with canonical Clio and actual manifests; retain dated historical records and clearly distinguish raw-envelope board compatibility from deprecated package dependencies. Documentation-only validation checks references against current files and verifies whitespace; no source changes or additional broad tests.

Documentation reconciliation complete: ROADMAP now names Clio as canonical ledger owner and dates the preserved August board/copy surveys; root README names @open-hax/protocols and compatibility payload ownership; Rheos README matches actual dependencies/source paths and four-target npm build, while documenting its narrower BB build and retained raw-envelope adapter. New links and manifest claims verified, whitespace clean. No source changes.
---