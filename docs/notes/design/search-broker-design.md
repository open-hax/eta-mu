---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Provider-Agnostic Search Broker Design"
summary: "Resilient multi-provider search broker with health checks, circuit breakers, and normalized results."
category: "design"
created: "2026-07-10"
---

# Do we have any other options for web search that are less fragile, or perhaps just as a possible strategy so when one of them does break, we are less likely to end up with a useless tool, and we can take our time addressing individual search provider failiures?

Current Mode: LocalAgentMode
Current State: DraftState

## Clarified Intent

Yes: don’t make DuckDuckGo Lite the system’s web-search dependency. Build a **provider-agnostic search broker** with multiple adapters, health checks, circuit breakers, and a normalized response contract. That way one provider can fail without turning research into a dead end.

## Artifact Specification

### Recommended provider portfolio

Use one reliable paid/official API as the primary, one self-hosted metasearch service, and one or two low-cost/best-effort fallbacks.


| Tier | Provider | Why use it | Main failure mode | Role |
| :-- | :-- | :-- | :-- | :-- |
| Primary | Brave Search API | Stable REST API, JSON responses, independent index, web/news/image/video coverage. [^7_1][^7_2] | API key, quota, billing/account outage | Default broad web retrieval |
| Primary self-hosted | SearXNG | Your own HTTP API, aggregates multiple engines, supports JSON/CSV/RSS, engine/category/language/time filters. [^7_3][^7_4] | Individual upstream engines can break or be blocked | Privacy-preserving and provider-diverse fallback |
| Secondary | DuckDuckGo Lite adapter | No dedicated paid API; useful independent-ish query path | Markup/anti-bot changes, blocks | Best-effort fallback only |
| Specialist | Tavily | Search API designed for AI/research workflows; useful for extraction-oriented search flows. [^7_5] | API key/quota, vendor dependency | Agent research fallback, not sole provider |
| Direct source | Site-specific APIs | arXiv, Bluesky, GitHub, Reddit OAuth, Stack Exchange, Wikipedia, etc. | Source-specific limits | Use before generic web search where applicable |

The most robust minimum setup is **Brave + self-hosted SearXNG + DuckDuckGo Lite**, with direct-source APIs bypassing web search where possible. Brave gives you a documented JSON service backed by its own index, while SearXNG lets you aggregate and dynamically enable/disable upstream engines.[^7_1][^7_2][^7_3][^7_4]

## Search broker contract

Make agents call **one** custom tool: `web-search`. It selects providers and returns a provider-aware, normalized result set.

```text
orchestrator / web-research-agent
  -> web-search
    -> search broker
      -> Brave adapter
      -> SearXNG adapter
      -> DuckDuckGo Lite adapter
      -> Tavily adapter
      -> result normalizer + deduplicator + health registry
```

This matters because agents should reason about *evidence*, not provider-specific response formats. The broker should normalize every result to:

```ts
type SearchResult = {
  title: string;
  url: string;
  snippet: string | null;
  publishedAt: string | null;
  sourceProvider: "brave" | "searxng" | "duckduckgo-lite" | "tavily";
  sourceEngine?: string | null;   // e.g. engine surfaced by SearXNG
  rank: number;
};

type SearchResponse = {
  query: string;
  attemptedProviders: ProviderAttempt[];
  successfulProviders: string[];
  degraded: boolean;
  results: SearchResult[];
  warnings: string[];
};

type ProviderAttempt = {
  provider: string;
  status: "success" | "timeout" | "rate_limited" | "blocked" | "misconfigured" | "failed";
  latencyMs: number;
  resultCount: number;
  error?: string;
};
```

A successful response with only one provider should set `degraded: true`; the agent can then state that coverage is reduced rather than acting as if it saw the whole web.

## Routing policy

Use explicit policy rather than “try everything every time.”

```yaml
providers:
  brave:
    tier: primary
    enabled_if: BRAVE_SEARCH_API_KEY
    timeout_ms: 8000
    circuit_breaker:
      failures_to_open: 3
      cooldown_ms: 300000

  searxng:
    tier: primary_self_hosted
    enabled_if: SEARXNG_BASE_URL
    timeout_ms: 10000
    circuit_breaker:
      failures_to_open: 3
      cooldown_ms: 120000

  tavily:
    tier: secondary
    enabled_if: TAVILY_API_KEY
    timeout_ms: 8000
    circuit_breaker:
      failures_to_open: 3
      cooldown_ms: 300000

  duckduckgo_lite:
    tier: best_effort
    enabled_if: true
    timeout_ms: 12000
    circuit_breaker:
      failures_to_open: 2
      cooldown_ms: 900000

strategy:
  default:
    - brave
    - searxng
  if_primary_failure:
    - tavily
    - duckduckgo_lite
  high_stakes_claim:
    - brave
    - searxng
    - source_specific_api
  cost_sensitive:
    - searxng
    - duckduckgo_lite
```

Run primary providers in parallel, but do not automatically fan out to every provider: it wastes quota, duplicates sources, and can create needless rate-limit pressure. Invoke secondary tools only on a failure, thin results, disagreement, an explicitly high-stakes task, or a query domain where a provider has weak coverage.

## Brave adapter

Brave is the strongest “boring and reliable” primary choice. Its documented web endpoint is:

```text
GET https://api.search.brave.com/res/v1/web/search?q=...
Header: X-Subscription-Token: <API_KEY>
```

The API returns structured JSON and requires an API key even on its free plan.[^7_2][^7_6]

```ts
async function searchBrave(
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) throw new Error("BRAVE_SEARCH_API_KEY is not configured");

  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("count", String(Math.min(count, 20)));

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8_000),
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Search HTTP ${response.status}`);
  }

  const body = await response.json();

  return (body.web?.results ?? []).map((item: any, index: number) => ({
    title: item.title ?? "",
    url: item.url ?? "",
    snippet: item.description ?? null,
    publishedAt: item.page_age ?? null,
    sourceProvider: "brave",
    rank: index + 1,
  }));
}
```


## SearXNG adapter

Self-host SearXNG in Docker and treat it as a **controlled metasearch gateway**. It exposes `/search` via GET or POST, and can return JSON when the `json` output format is enabled in `settings.yml`. Public instances often disable JSON, which is why self-hosting is the appropriate route here.[^7_3][^7_7][^7_8]

### `docker-compose.yml`

```yaml
services:
  searxng:
    image: searxng/searxng:latest
    container_name: opencode-searxng
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    volumes:
      - ./searxng:/etc/searxng:rw
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/
      - INSTANCE_NAME=OpenCode Research Search
```


### Required `settings.yml` fragment

```yaml
search:
  formats:
    - html
    - json

server:
  bind_address: "0.0.0.0"
  port: 8080
  secret_key: "replace-with-a-long-random-secret"

outgoing:
  request_timeout: 10.0
  max_request_timeout: 15.0
```

The key query interface is:

```text
GET http://localhost:8080/search?q=<query>&format=json
```

SearXNG can also expose source engine names, so preserve them in `sourceEngine`. This lets the broker react to engine-specific breakage—disable only the failing engine instead of disabling all metasearch.[^7_4][^7_3]

```ts
async function searchSearXNG(
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const base = process.env.SEARXNG_BASE_URL;
  if (!base) throw new Error("SEARXNG_BASE_URL is not configured");

  const url = new URL("/search", base);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`SearXNG HTTP ${response.status}`);
  }

  const body = await response.json();

  return (body.results ?? []).slice(0, count).map((item: any, index: number) => ({
    title: item.title ?? "",
    url: item.url ?? "",
    snippet: item.content ?? null,
    publishedAt: item.publishedDate ?? null,
    sourceProvider: "searxng",
    sourceEngine: item.engine ?? null,
    rank: index + 1,
  }));
}
```


## Health and fallback behavior

Do not let the LLM infer whether a provider is “probably down.” The broker should make that deterministic.

```ts
function classifySearchFailure(error: unknown): ProviderAttempt["status"] {
  const message = String(error).toLowerCase();

  if (message.includes("429") || message.includes("rate")) return "rate_limited";
  if (message.includes("captcha") || message.includes("challenge")) return "blocked";
  if (message.includes("api_key") || message.includes("not configured")) {
    return "misconfigured";
  }
  if (message.includes("timeout") || message.includes("aborted")) return "timeout";

  return "failed";
}
```

Persist the following state locally (SQLite or a small JSON state file is enough initially):

```ts
type ProviderHealth = {
  provider: string;
  state: "closed" | "open" | "half_open";
  consecutiveFailures: number;
  openedUntil: string | null;
  lastSuccessAt: string | null;
  lastFailure: string | null;
};
```

Rules:

- **Closed**: normal operation.
- **Open**: skip that provider immediately after repeated failures; return a warning.
- **Half-open**: send one periodic probe after cooldown; close the breaker only after success.
- **Misconfigured**: do not retry until environment/config changes.
- **Blocked**: use a longer cooldown than generic failures, especially for DuckDuckGo.
- **No silent fallback**: every returned result set lists provider coverage and degradation.


## Agent guidance

Change the web-research agent prompt to require broker awareness:

```markdown
Search-provider policy:
- Use `web-search`, not provider-specific tools, for general web discovery.
- Inspect `attemptedProviders`, `successfulProviders`, `degraded`, and `warnings`.
- If `degraded: true`, explicitly report reduced search coverage.
- If fewer than two providers return useful results for a material claim, request
  source-specific research or flag the claim as tentative.
- Prefer direct-source tools for primary information:
  arXiv for papers, GitHub for repositories, official documentation for products,
  Bluesky APIs for Bluesky data, and Reddit OAuth MCP for Reddit discussions.
- Never claim a source is absent from the web merely because one provider did not find it.
```


## Assumptions \& Constraints

- SearXNG reduces single-provider dependence but does **not** eliminate upstream fragility: its configured engines may be rate-limited or change HTML behavior. Its advantage is that you own the aggregator and can disable a broken engine independently.[^7_3][^7_4]
- Brave is a commercial dependency, but it uses a documented REST/JSON API and its own search index, making it more operationally predictable than scraping consumer HTML endpoints.[^7_1][^7_2]
- Tavily is useful as a specialized research fallback but should not become the only path; it is still an external API with key, quota, and availability dependencies.[^7_5]
- Keep provider credentials in runtime environment variables, never frontmatter, prompts, code, or committed configuration.


## Possible Refinements

The next implementation artifact should be a `web-search` broker custom tool with:

- `providers.ts`: adapter interface and normalized types.
- `brave.ts`, `searxng.ts`, `duckduckgo-lite.ts`, and optional `tavily.ts`.
- `health-store.ts`: SQLite-backed circuit breaker state.
- `web-search.ts`: parallel primary search, deduplication, fallback, and provenance output.
- `search-doctor.ts`: checks configuration and runs a low-frequency canary query against enabled providers.

For your next decision: should **Brave Search API** be the paid primary, or do you prefer a fully self-hosted-first strategy centered on SearXNG?
<span style="display:none">[^7_10][^7_11][^7_12][^7_13][^7_14][^7_15][^7_9]</span>

<div align="center">⁂</div>

[^7_1]: https://api-dashboard.search.brave.com/documentation

[^7_2]: https://api.search.brave.com/app/documentation/web-search/get-started

[^7_3]: https://docs.searxng.org/dev/search_api.html

[^7_4]: https://docs.searxng.org/dev/engines/json_engine.html

[^7_5]: https://docs.tavily.com/documentation/api-reference/endpoint/search

[^7_6]: https://api-dashboard.search.brave.com/documentation/quickstart

[^7_7]: https://github.com/searxng/searxng/discussions/1789

[^7_8]: https://lagnchain.readthedocs.io/en/latest/ecosystem/searx.html

[^7_9]: https://brave.com/search/api/

[^7_10]: https://api-dashboard.search.brave.com/documentation/services/web-search

[^7_11]: https://api.search.brave.com/app/documentation/web-search/responses

[^7_12]: https://api-dashboard.search.brave.com/api-reference/web/search/get

[^7_13]: https://git.jordan.im/searxng/commit/?id=abae17e6fc49e2b77fb1c090db984e4867cea723

[^7_14]: https://raw.githubusercontent.com/NeverSight/skills_feed/refs/heads/main/data/skills-md/iails01/skills/searxng-api/SKILL.md

[^7_15]: https://brave.com/search/api/guides/


