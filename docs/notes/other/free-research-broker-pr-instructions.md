---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Free Research Broker PR Instructions"
summary: "PR-ready change set review and specification for the free research broker."
category: "other"
created: "2026-07-10"
---


# @GitHub Aight, lets see it

Current Mode: LocalAgentMode
Current State: PRPreparationState

## Clarified Intent

Here is the PR-ready change set for review. The branch is `feat/free-research-search-broker`, the working tree is clean of whitespace errors, and the isolated Node domain suite passes 6/6 tests.

## Artifact Specification

### Proposed PR

**Title**

```text
feat: add isolated free-first research search broker domain tests
```

**Description**

```markdown
## Summary

Add a framework-independent, free-first web-search broker foundation for an
OpenCode deep-research workspace.

The broker is intentionally independent from OpenCode custom-tool code, Docker,
provider credentials, and live HTTP. It makes provider behavior deterministic
and testable before an OpenCode adapter is introduced.

## Included

- Failure classification for timeout, rate-limit, CAPTCHA/block, configuration,
  and generic provider failures.
- Injectable-clock circuit breaker domain logic.
- SearXNG response normalization.
- URL canonicalization and cross-provider deduplication.
- Dependency-free DuckDuckGo Lite result parsing and redirect unwrapping.
- Primary-plus-fallback routing triggered only when primary coverage is thin.
- Explicit degraded-coverage semantics.
- GitHub Actions workflow running isolated Node 22 tests only.

## Explicitly excluded

- OpenCode runtime/tool imports.
- SearXNG Docker deployment.
- Live provider/API calls.
- Secrets, credentials, and paid search providers.
- Persistent health storage.
- Enabling DuckDuckGo Lite as a production-default source.

## Validation

```text
npm test

# tests 6
# pass 6
# fail 0
```

```

### Change overview

| Path | Purpose |
|---|---|
| `.github/workflows/test-free-research-broker.yml` | Node 22 CI workflow; runs only isolated domain tests |
| `package.json`, `package-lock.json` | Root test command with no runtime dependencies |
| `spaces/opencode-deep-research/src/failures.mjs` | Provider failure classification |
| `spaces/opencode-deep-research/src/health.mjs` | In-memory, injected-clock circuit breaker |
| `spaces/opencode-deep-research/src/normalize.mjs` | SearXNG normalization, canonical URL dedupe, DDG Lite parse |
| `spaces/opencode-deep-research/src/broker.mjs` | Thin-primary fallback routing plus degraded coverage |
| `spaces/opencode-deep-research/test/domain.test.mjs` | Six deterministic no-network tests |
| `spaces/opencode-deep-research/README.md` | Contracts and boundary documentation |

### CI workflow

```yaml
name: Test free research broker

on:
  pull_request:
    paths:
      - "spaces/opencode-deep-research/**"
      - "package.json"
      - ".github/workflows/test-free-research-broker.yml"
  push:
    branches: [main]
    paths:
      - "spaces/opencode-deep-research/**"
      - "package.json"
      - ".github/workflows/test-free-research-broker.yml"

permissions:
  contents: read

jobs:
  domain-tests:
    name: Domain logic (no OpenCode runtime)
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci --ignore-scripts
      - run: npm test
```

The core contract is deliberately injected: `searchWithFallback()` receives provider functions instead of importing real network adapters. That is what keeps the tests independent from OpenCode and live search infrastructure.

## Assumptions \& Constraints

- The repository branch exists only in the local sandbox; I have not pushed it or opened a remote PR.
- SearXNG remains the intended primary free search backend; it supports JSON search output when enabled, which future adapters can normalize into this domain model.[^11_1]
- DuckDuckGo Lite is intentionally treated as a fragile fallback, with parser behavior constrained to isolated tests.
- The current test suite uses Node’s built-in test runner and makes zero external network calls.


## Possible Refinements

The first follow-up PR should add captured/sanitized DuckDuckGo Lite HTML fixtures and tests for already-open circuits, invalid URLs, duplicate URLs across providers, and total provider failure.

<div align="center">⁂</div>

[^11_1]: https://docs.searxng.org/dev/search_api.html


