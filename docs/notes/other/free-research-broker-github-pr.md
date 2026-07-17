---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Free Research Broker GitHub PR"
summary: "Instructions for publishing the free research broker PR to GitHub."
category: "other"
created: "2026-07-10"
---

# @GitHub [https://github.com/riatzukiza/perplexity_spaces_memory_protocol](https://github.com/riatzukiza/perplexity_spaces_memory_protocol) open a PR

Current Mode: LocalAgentMode
Current State: PRPreparationState

## Clarified Intent

The PR changes are committed locally and ready to publish to `riatzukiza/perplexity_spaces_memory_protocol`.

## Artifact Specification

**Prepared branch:** `feat/free-research-search-broker`
**Prepared commit:** `51d45cc feat: add isolated free research broker domain tests`

The commit adds 11 files / 281 lines:

- Isolated broker, circuit-breaker, URL normalization, failure classification, and DuckDuckGo Lite parsing domain modules.
- Six no-network Node tests.
- A Node 22 GitHub Actions workflow that runs the domain suite without OpenCode, provider credentials, Docker, or live search requests.
- Documentation establishing SearXNG as the intended free primary backend, with DuckDuckGo Lite as explicitly best-effort fallback; SearXNG supports a JSON API response mode for the future adapter.[^12_1]


## Assumptions \& Constraints

I cannot open the remote PR from this environment because the required GitHub connector is not available here, and the GitHub CLI (`gh`) is not installed/authenticated. I have not pushed directly, per the workspace rule.

The branch and commit are ready for the connector to publish. The exact remote operation needed is:

```text
Push: feat/free-research-search-broker
Base: main
Repository: riatzukiza/perplexity_spaces_memory_protocol
Title: feat: add isolated free research broker domain tests
```


## Possible Refinements

Once the PR is opened, the first review follow-up should add real, sanitized DuckDuckGo Lite HTML fixtures plus tests for invalid URLs, open circuits, total provider failure, and duplicate cross-provider result provenance.

<div align="center">⁂</div>

[^12_1]: https://docs.searxng.org/dev/search_api.html

