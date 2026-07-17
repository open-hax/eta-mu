---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Free Research Broker Domain Tests"
summary: "Isolated domain tests for the free research broker, CI workflow, and PR-ready change set."
category: "dev"
created: "2026-07-10"
---

# Aight, let's get a pr ready with workflows that run tests over the domain logic isolated from opencode.

Current Mode: LocalAgentMode
Current State: PRPreparationState

## Clarified Intent

A PR-ready free-first research-broker foundation is prepared on branch `feat/free-research-search-broker`. Its CI tests all search domain logic without OpenCode, provider credentials, Docker, HTTP access, or browser/scraping dependencies.

## Artifact Specification

### Proposed PR

**Title:** `feat: add isolated free-first research search broker domain tests`

**Summary:**
Adds a framework-independent core for an OpenCode research workspace. The implementation deliberately separates search-provider domain logic from OpenCode custom-tool adapters, so provider failures and routing behavior can be tested cheaply and deterministically.

### Files prepared

```text
.github/workflows/test-free-research-broker.yml
package.json
package-lock.json
spaces/opencode-deep-research/
├── README.md
├── package.json
├── src/
│   ├── broker.mjs
│   ├── failures.mjs
│   ├── health.mjs
│   ├── normalize.mjs
│   └── types.mjs
└── test/
    └── domain.test.mjs
```


### Domain contracts

The new domain layer contains no OpenCode imports:

- `failures.mjs`: deterministically classifies provider errors as `timeout`, `rate_limited`, `blocked`, `misconfigured`, or `failed`.
- `health.mjs`: injectable-clock circuit breaker; SearXNG opens after three failures, DuckDuckGo Lite after two, and configuration errors remain disabled until fixed.
- `normalize.mjs`: normalizes SearXNG JSON, strips tracking parameters, deduplicates canonical URLs, and parses/unwraps basic DuckDuckGo Lite result links.
- `broker.mjs`: runs primary provider first, triggers fallback only under thin coverage, preserves provider attempt metadata, and marks results as `degraded` when fewer than two providers succeed.
- `README.md`: documents the strict boundary between domain logic and future OpenCode tool adapters.

The SearXNG JSON adapter is intended to remain the primary free web source, while DuckDuckGo Lite is explicitly a circuit-broken, best-effort fallback. SearXNG’s documented API can produce JSON results when the JSON format is enabled.[^10_1][^10_2]

### CI workflow

The new GitHub Actions workflow:

- Runs on pull requests affecting the broker, workflow, or root package metadata.
- Runs on `main` pushes for the same paths.
- Uses Node 22.
- Executes `npm ci --ignore-scripts`.
- Executes `npm test`.
- Does not install OpenCode, start SearXNG, call provider APIs, or require secrets.


## Validation

The isolated suite currently passes **6/6 tests**:

1. Error classification: rate limit, block/CAPTCHA, timeout, missing config, generic failure.
2. Circuit opens after configured failure count, recovers after cooldown, and permanently opens for misconfiguration.
3. SearXNG result normalization plus URL deduplication and UTM stripping.
4. DuckDuckGo Lite parsing and `uddg` redirect unwrapping.
5. Fallback invocation after a thin primary result set and non-degraded two-provider coverage.
6. Degraded coverage warning when fallback blocks/fails.

The local command is:

```bash
npm test
```

It completed successfully with Node’s built-in test runner: 6 tests passed, 0 failed.

## Assumptions \& Constraints

- This is a **foundation PR**, not a finished OpenCode agent bundle. It intentionally excludes `.opencode/tools/web-search.ts` until domain behavior is accepted; that adapter should be thin and uninteresting.
- The present DuckDuckGo Lite parser is validated only against a synthetic minimal fixture. A follow-up PR should add captured, sanitized HTML fixtures and parser regression cases before enabling that provider by default.
- Health state is in-memory by design. A later change can add an injected SQLite/JSON repository without changing broker behavior.
- No remote has been modified and no PR has been opened yet.


## Possible Refinements

Before I open the PR, I recommend adding one small test set for edge cases:

- malformed/invalid URLs are discarded;
- primary circuit already open means fallback executes cleanly;
- duplicate URLs across providers preserve first-provider provenance;
- both providers fail returns empty results with a precise degraded/no-provider warning.

If you accept the current scope, say **“open the PR”** and I’ll proceed with the prepared branch and PR specification.

<div align="center">⁂</div>

[^10_1]: https://docs.searxng.org/dev/search_api.html

[^10_2]: https://github.com/searxng/searxng/discussions/1789

