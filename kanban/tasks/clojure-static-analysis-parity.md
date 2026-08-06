---
category: "tasks"
labels: "quality, static-analysis, lint, splint, jscpd, mutation-testing, babashka, ratchet"
parent: "eta-mu-quality-ratchet"
type: "task"
points: "13"
source: "user-request:2026-07-30"
title: "Clojure static analysis parity with Truth and epiphany"
priority: "P1"
status: "incoming"
uuid: "clojure-static-analysis-parity"
created_at: "2026-07-30T18:09:00Z"
---

# Clojure static analysis parity with Truth and epiphany

## Outcome

`eta-mu` has the Clojure static analysis its sibling repos already run, behind one
orchestrator with tiered exit codes and ratchet files — so the architecture rules this
repo states in `AGENTS.md` are enforced mechanically instead of by convention.

## Why

`eta-mu` declares a strict construction order (`law.*` → `shape.*` → `extern.*` →
`domain.*` → `infra.*`) and a zero-warnings gate, but enforces them with clj-kondo
defaults plus two ad-hoc Node scripts. `../Truth` and `../epiphany` enforce comparable
rules with real tools and ratchets that prevent regression. The user asked for the
equivalent here.

## Current state in eta-mu

- clj-kondo — `.clj-kondo/` exists with **no custom `config.edn`**; defaults only.
  Invoked via `bb scripts/lint.bb`, `pnpm lint:kondo`, and a `deps.edn` `:lint` alias.
- `clojure-lsp.edn` — editor integration only, no CLI diagnostics run.
- cljfmt — `deps.edn` `:format` / `:check` aliases, no config.
- Biome — `biome.json`, legacy TS/JS only.
- Custom: `scripts/lint.bb`, `scripts/lint.mjs`, `scripts/contract-guard.mjs`,
  `scripts/check-ledger-extern-boundaries.mjs`.

## Gap inventory

| Tool | Reference implementation | Buys us |
|---|---|---|
| Splint | `../Truth/.splint.edn`, `../epiphany/.splint.edn` | idiom / anti-pattern lint (kibit successor) |
| jscpd | `../Truth/.jscpd.json` | copy-paste detection, ratcheted at 1.7% |
| Heretic | `../Truth/heretic.edn`, `../epiphany/heretic.edn` | mutation testing, pure layers only |
| smell report | `../Truth/dev/smell_report.clj` | god namespaces, mega-functions, param bloat, fan-out |
| orchestrator | `../Truth/bin/analyze` | one entry point, BLOCKING vs ADVISORY tiers, ratchets |
| boundary-check | `../epiphany` `:boundary-check` alias | layer-boundary enforcement as a real check |
| interop-inventory | `../epiphany` `:interop-inventory` alias | tracks JS interop surface |
| kondo hooks | `../Truth/.clj-kondo/hooks/` | custom macro expansion (DSL, re-export) |

## Scope

- [ ] Land the orchestrator first, in Babashka (`scripts/analyze.bb`), not a `bin/` shell
      script — `scripts/lint.bb` and `scripts/test.bb` set the precedent. Tiered exits and
      committed ratchet files are the point; the individual tools are replaceable.
- [ ] Add Splint with a config that starts permissive and ratchets down.
- [ ] Add jscpd with a committed baseline threshold; monorepo-aware ignores for
      `dist*/`, `target/`, `.shadow-cljs/`, generated TS.
- [ ] Port a smell report for CLJS namespaces.
- [ ] Promote `check-ledger-extern-boundaries.mjs` into a general construction-order
      boundary check covering all five layers — and prefer CLJS/bb over `.mjs` per the
      language policy.
- [ ] Write a real `.clj-kondo/config.edn` instead of relying on defaults; add hooks for
      this repo's macros if any need them.
- [ ] Heretic mutation testing scoped to pure layers (`law.*`, `shape.*`, `domain.*`)
      only — **evaluate last**; it is the most expensive and least certain to fit CLJS.
- [ ] Wire the orchestrator into `pnpm lint` / CI, advisory before blocking.

## Done when

`bb scripts/analyze.bb` runs the suite, fails on BLOCKING findings, reports ADVISORY ones
without failing, and refuses a ratchet regression.

## Notes

The user referred to jscpd as "JCPD". Heretic targets Clojure/JVM — confirm it can drive
ClojureScript tests at all before committing to that row; if it cannot, record that and
descope it rather than faking coverage.
