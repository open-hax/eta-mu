---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Free-First Search Provider Strategy"
summary: "Free and self-hosted search strategy with SearXNG, DuckDuckGo Lite, and deferred paid providers."
category: "design"
created: "2026-07-10"
---

# I am a broke ass bitch, no paid options for now til someone subsidizes that for me. that's gotta go on the list methinks.

Current Mode: LocalAgentMode
Current State: DraftState

## Clarified Intent

Yep—remove all paid search dependencies for now. The architecture should be **free/self-hosted first**, with commercial APIs recorded as an optional future “subsidized providers” backlog item rather than built into the current required path.[^8_1][^8_2]

## Artifact Specification

### Free-first provider strategy

```text
web-search broker
  -> SearXNG (self-hosted; primary)
  -> DuckDuckGo Lite adapter (best-effort fallback)
  -> Direct-source APIs (preferred whenever applicable)
  -> Optional community/public-instance fallback (off by default)
```

| Role | Backend | Cost | Purpose |
| :-- | :-- | --: | :-- |
| Primary general web | Self-hosted SearXNG | Free, aside from your existing compute/network | JSON-based metasearch gateway; lets you enable/disable upstream engines independently. [^8_3][^8_4] |
| Best-effort general web | Your DuckDuckGo Lite adapter | Free | Independent fallback when SearXNG or selected engines fail |
| High-quality primary sources | Direct APIs | Generally free | arXiv, Bluesky AppView, Reddit OAuth/MCP, GitHub, Stack Exchange, etc. |
| Emergency fallback | Public SearXNG instance | Free but unreliable | Development-only/manual fallback, not a production dependency |
| Deferred upgrade | Brave, Tavily, Exa, SerpAPI, etc. | Paid/subsidized | Add only once credentials and budget exist |

SearXNG supports JSON responses when enabled in its configuration, which gives your broker a stable local response contract even though individual upstream engines may vary.[^8_3][^8_5]

### Revised routing policy

```yaml
strategy:
  default_general_web:
    - searxng
    - duckduckgo_lite

  source_specific_topics:
    academic_papers:
      - arxiv_search
      - searxng
    bluesky:
      - bluesky_search
    reddit:
      - reddit_mcp
    open_source_or_package:
      - github_search
      - npm_search
      - searxng

  on_searxng_failure:
    - duckduckgo_lite
    - direct_source_api_if_applicable

  on_duckduckgo_lite_failure:
    - searxng
    - return_degraded_coverage_warning

  high_stakes_claim:
    - searxng
    - direct_source_api_or_primary_site
    - require_manual_source_fetch
```

The non-negotiable behavior is: **a provider outage produces a degraded-coverage report, not an invented answer and not a silent empty result.**

### Free-only configuration

```yaml
providers:
  searxng:
    enabled: true
    required_env:
      - SEARXNG_BASE_URL
    timeout_ms: 10000
    circuit_breaker:
      failures_to_open: 3
      cooldown_ms: 120000

  duckduckgo_lite:
    enabled: true
    timeout_ms: 12000
    circuit_breaker:
      failures_to_open: 2
      cooldown_ms: 900000

  brave:
    enabled: false
    reason: "Deferred: requires funded API key"

  tavily:
    enabled: false
    reason: "Deferred: requires funded API key"
```


### Subsidized-provider backlog

Put this in `docs/BACKLOG.md` or your project README:

```markdown
## Provider Subsidy Backlog

Current policy: the research system must remain useful with no paid search APIs.

Deferred integrations:
- Brave Search API: reliable independent-index JSON web search.
- Tavily: research-oriented search and extraction.
- Exa: semantic/neural discovery.
- SerpAPI or equivalent: broad SERP fallback.

Activation requirements:
1. A sponsor, grant, employer, or personal budget explicitly covers API use.
2. API keys are stored outside the repository.
3. The provider is added only as an optional broker adapter.
4. Health checks, quota telemetry, provider attribution, and circuit breakers exist.
5. No agent prompt assumes the provider is available.
```

This protects the system from “free tier disappeared” or “key quota exhausted” failures even after you do obtain paid access.

## Orchestrator Prompt Update

Add this block to `deep-research-orchestrator.md`:

```markdown
Search-cost policy:
- Default to free/self-hosted tools only.
- Do not request, assume, or require paid search API credentials.
- General web discovery uses `web-search`, which currently routes through
  self-hosted SearXNG and DuckDuckGo Lite.
- Prefer direct-source tools over general web search where available:
  arXiv, Bluesky AppView, Reddit OAuth MCP, GitHub, npm, and official docs.
- Treat each provider as fallible. Inspect search broker health metadata and
  report degraded coverage when one or more backends are unavailable.
- Paid providers are optional future integrations, never a prerequisite for
  completing a research task.
```


## Assumptions \& Constraints

- “Free” means no search-API bill; self-hosted SearXNG still consumes whatever compute and bandwidth you already have available.[^8_3]
- SearXNG is a resilience layer, not magic: its upstream engines can still block or change, but you control the instance, engine selection, JSON output, and failover behavior.[^8_4][^8_3]
- DuckDuckGo Lite remains explicitly best-effort. Its scraper must be isolated behind an adapter, fixture-tested, rate-limited, and circuit-broken.
- This fits your goal: provider-specific failures become localized maintenance tasks, while other adapters continue to return useful results.


## Possible Refinements

The next concrete artifact should be the free-only `web-search` OpenCode tool plus:

- `SEARXNG_BASE_URL` configuration.
- DuckDuckGo Lite adapter and parser fixtures.
- JSON health-state file with circuit breakers.
- `search-doctor` command that tests each free provider and prints exact failure classification.
- A future-provider registry where paid adapters are present but permanently disabled until subsidized.
<span style="display:none">[^8_6]</span>

<div align="center">⁂</div>

[^8_1]: DRAFT_STATE.md

[^8_2]: LOCAL_AGENT_MODE.md

[^8_3]: https://docs.searxng.org/dev/search_api.html

[^8_4]: https://docs.searxng.org/dev/engines/json_engine.html

[^8_5]: https://github.com/searxng/searxng/discussions/1789

[^8_6]: MODE_REGISTRY.md


