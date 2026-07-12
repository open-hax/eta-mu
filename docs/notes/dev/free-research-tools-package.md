---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Free Research Tools OpenCode Package"
summary: "Concrete free-first OpenCode package layout with SearXNG, broker tool, search-doctor, and web-research agent."
category: "dev"
created: "2026-07-10"
---

# continue

Current Mode: LocalAgentMode
Current State: DraftState

## Clarified Intent

Continuing means turning the free-only strategy into a concrete, composable OpenCode package: a local SearXNG deployment, a dependency-free DuckDuckGo fallback, a single `web-search` broker tool, and a `search-doctor` diagnostics tool. OpenCode custom tools are TypeScript/JavaScript files placed in `.opencode/tools/`, and their definitions may invoke scripts in any language if needed.[^9_1]

## Artifact Specification

### Project layout

```text
your-project/
├── .opencode/
│   ├── agents/
│   │   └── web-research-agent.md
│   └── tools/
│       ├── web-search.ts
│       └── search-doctor.ts
├── search/
│   ├── providers/
│   │   ├── types.ts
│   │   ├── searxng.ts
│   │   └── duckduckgo-lite.ts
│   ├── health-store.ts
│   └── broker.ts
├── infra/
│   └── searxng/
│       ├── compose.yaml
│       └── settings.yml
├── package.json
└── .env.example
```

This division is intentional:

- `.opencode/tools/` contains thin OpenCode interfaces.
- `search/providers/` isolates provider-specific failure and parsing behavior.
- `search/broker.ts` owns routing, normalization, deduplication, and degraded-mode reporting.
- `infra/searxng/` is independent infrastructure, not agent logic.


### `package.json`

No paid API dependencies; no scrape libraries; only Zod for OpenCode tool schemas.

```json
{
  "name": "opencode-free-research-tools",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "dependencies": {
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "tsx": "^4.23.0",
    "typescript": "^5.9.0"
  },
  "scripts": {
    "search:doctor": "tsx .opencode/tools/search-doctor.ts",
    "test:search": "tsx search/smoke-test.ts"
  }
}
```


### `.env.example`

```bash
# Required once SearXNG is running locally:
SEARXNG_BASE_URL=http://127.0.0.1:8080

# Optional. Keep false until the local SearXNG instance is tested.
WEB_SEARCH_ENABLE_SEARXNG=true

# Always best-effort. The broker circuit-breaks this on blocks/markup failure.
WEB_SEARCH_ENABLE_DDG_LITE=true

# No paid provider credentials belong here until funding exists.
# BRAVE_SEARCH_API_KEY=
# TAVILY_API_KEY=
```


## SearXNG setup

SearXNG supports JSON output when `json` is added to its allowed search formats. Its configuration includes per-engine failure suspension controls for access denial, CAPTCHA, and rate limiting—exactly the behavior you want beneath your own broker.[^9_2]

### `infra/searxng/compose.yaml`

```yaml
services:
  searxng:
    image: searxng/searxng:latest
    container_name: opencode-searxng
    restart: unless-stopped

    ports:
      # Localhost-only: do not accidentally expose your metasearch service.
      - "127.0.0.1:8080:8080"

    volumes:
      - ./settings.yml:/etc/searxng/settings.yml:ro

    environment:
      SEARXNG_BASE_URL: "http://127.0.0.1:8080/"
      SEARXNG_SECRET: "${SEARXNG_SECRET:?Set in infra/searxng/.env}"
```


### `infra/searxng/.env`

Generate a random secret locally; never commit this file.

```bash
SEARXNG_SECRET=replace-me-with-output-of-openssl-rand-hex-32
```

Generate it:

```bash
cd infra/searxng
printf 'SEARXNG_SECRET=%s\n' "$(openssl rand -hex 32)" > .env
chmod 600 .env
docker compose up -d
```


### `infra/searxng/settings.yml`

```yaml
use_default_settings: true

general:
  instance_name: "OpenCode Local Research Search"
  debug: false

search:
  safe_search: 0
  default_lang: auto
  formats:
    - html
    - json

  # Let SearXNG disable only a bad upstream engine rather than failing all search.
  ban_time_on_fail: 5
  max_ban_time_on_fail: 120

  suspended_times:
    SearxEngineAccessDenied: 180
    SearxEngineCaptcha: 3600
    SearxEngineTooManyRequests: 180
    cf_SearxEngineCaptcha: 1296000
    cf_SearxEngineAccessDenied: 86400
    recaptcha_SearxEngineCaptcha: 604800

server:
  bind_address: "0.0.0.0"
  port: 8080
  limiter: false
  public_instance: false
  image_proxy: false
  method: GET

outgoing:
  request_timeout: 8.0
  max_request_timeout: 15.0
  pool_connections: 30
  pool_maxsize: 10

engines:
  # Start small. Add engines only after observing stable behavior.
  - name: wikipedia
    engine: wikipedia
    shortcut: wp

  - name: arxiv
    engine: arxiv
    shortcut: arx

  - name: duckduckgo
    engine: duckduckgo
    shortcut: ddg

  - name: bing
    engine: bing
    shortcut: bi
```

SearXNG’s documentation recommends generating a `server.secret_key` for a minimal configuration and documents configuration-file-based setup; it also supports local binding and configurable timeouts.[^9_2]

## Provider contract

### `search/providers/types.ts`

```ts
export type ProviderName = "searxng" | "duckduckgo-lite";

export type ProviderStatus =
  | "success"
  | "timeout"
  | "rate_limited"
  | "blocked"
  | "misconfigured"
  | "failed"
  | "skipped";

export type NormalizedResult = {
  title: string;
  url: string;
  snippet: string | null;
  publishedAt: string | null;
  provider: ProviderName;
  engine: string | null;
  rank: number;
};

export type ProviderAttempt = {
  provider: ProviderName;
  status: ProviderStatus;
  latencyMs: number;
  resultCount: number;
  error: string | null;
};

export type ProviderSearch = (
  query: string,
  maxResults: number,
) => Promise<NormalizedResult[]>;
```


### `search/providers/searxng.ts`

```ts
import type { NormalizedResult, ProviderSearch } from "./types.js";

export const searchSearXNG: ProviderSearch = async (
  query,
  maxResults,
) => {
  const baseUrl = process.env.SEARXNG_BASE_URL;

  if (!baseUrl) {
    throw new Error("SEARXNG_BASE_URL is not configured");
  }

  const url = new URL("/search", baseUrl);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("language", "auto");
  url.searchParams.set("safesearch", "0");

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`SearXNG HTTP ${response.status}`);
  }

  const payload = await response.json();

  return (payload.results ?? [])
    .slice(0, maxResults)
    .flatMap((item: any, index: number): NormalizedResult[] => {
      if (!item.url || !item.title) return [];

      return [
        {
          title: item.title,
          url: item.url,
          snippet: item.content ?? null,
          publishedAt: item.publishedDate ?? null,
          provider: "searxng",
          engine: item.engine ?? null,
          rank: index + 1,
        },
      ];
    });
};
```


## DuckDuckGo fallback

### `search/providers/duckduckgo-lite.ts`

This adapter must be considered **best-effort** and should only be called after SearXNG returns a failure or very thin coverage. It needs no npm library.

```ts
import type { NormalizedResult, ProviderSearch } from "./types.js";

function decodeEntities(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function destinationUrl(href: string): string {
  const url = new URL(href, "https://lite.duckduckgo.com");
  const target = url.searchParams.get("uddg");

  return target ? decodeURIComponent(target) : url.toString();
}

export const searchDuckDuckGoLite: ProviderSearch = async (
  query,
  maxResults,
) => {
  const url = new URL("https://lite.duckduckgo.com/lite/");
  url.searchParams.set("q", query);
  url.searchParams.set("kl", "us-en");

  const response = await fetch(url, {
    signal: AbortSignal.timeout(12_000),
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.8",
      "User-Agent": "opencode-local-research/0.1",
    },
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo Lite HTTP ${response.status}`);
  }

  const html = await response.text();

  if (/captcha|unusual traffic|anomaly/i.test(html)) {
    throw new Error("DuckDuckGo Lite block or challenge response");
  }

  const matches = [
    ...html.matchAll(
      /<a[^>]*class="result-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ];

  const results = matches.slice(0, maxResults).flatMap((match, index) => {
    const title = decodeEntities(match[^9_2]);
    const href = destinationUrl(match[^9_1]);

    if (!title || !href.startsWith("http")) return [];

    return [
      {
        title,
        url: href,
        snippet: null,
        publishedAt: null,
        provider: "duckduckgo-lite" as const,
        engine: null,
        rank: index + 1,
      },
    ];
  });

  if (results.length === 0) {
    throw new Error("DuckDuckGo Lite returned no parseable search results");
  }

  return results;
};
```


## Circuit breaker

### `search/health-store.ts`

Start in-memory. Move it to SQLite only after you confirm the broker behavior is useful.

```ts
import type { ProviderName, ProviderStatus } from "./providers/types.js";

type Health = {
  failures: number;
  openUntil: number;
};

const health = new Map<ProviderName, Health>();

const policy = {
  searxng: { failuresToOpen: 3, cooldownMs: 2 * 60_000 },
  "duckduckgo-lite": { failuresToOpen: 2, cooldownMs: 15 * 60_000 },
} as const;

export function isAvailable(provider: ProviderName): boolean {
  const current = health.get(provider);

  return !current || Date.now() >= current.openUntil;
}

export function recordSuccess(provider: ProviderName): void {
  health.set(provider, { failures: 0, openUntil: 0 });
}

export function recordFailure(
  provider: ProviderName,
  status: ProviderStatus,
): void {
  if (status === "misconfigured") {
    health.set(provider, {
      failures: policy[provider].failuresToOpen,
      openUntil: Number.MAX_SAFE_INTEGER,
    });
    return;
  }

  const current = health.get(provider) ?? { failures: 0, openUntil: 0 };
  const failures = current.failures + 1;
  const shouldOpen = failures >= policy[provider].failuresToOpen;

  health.set(provider, {
    failures,
    openUntil: shouldOpen ? Date.now() + policy[provider].cooldownMs : 0,
  });
}
```


## Broker tool

### `search/broker.ts`

```ts
import { recordFailure, recordSuccess, isAvailable } from "./health-store.js";
import { searchDuckDuckGoLite } from "./providers/duckduckgo-lite.js";
import { searchSearXNG } from "./providers/searxng.js";
import type {
  NormalizedResult,
  ProviderAttempt,
  ProviderName,
  ProviderStatus,
} from "./providers/types.js";

function classify(error: unknown): ProviderStatus {
  const message = String(error).toLowerCase();

  if (message.includes("not configured")) return "misconfigured";
  if (message.includes("429") || message.includes("rate limit")) {
    return "rate_limited";
  }
  if (message.includes("captcha") || message.includes("challenge")) {
    return "blocked";
  }
  if (message.includes("timeout") || message.includes("abort")) return "timeout";

  return "failed";
}

function dedupe(results: NormalizedResult[]): NormalizedResult[] {
  const byUrl = new Map<string, NormalizedResult>();

  for (const result of results) {
    const normalized = result.url
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/\/$/, "");

    if (!byUrl.has(normalized)) {
      byUrl.set(normalized, result);
    }
  }

  return [...byUrl.values()];
}

async function tryProvider(
  provider: ProviderName,
  fn: () => Promise<NormalizedResult[]>,
): Promise<{ attempt: ProviderAttempt; results: NormalizedResult[] }> {
  if (!isAvailable(provider)) {
    return {
      attempt: {
        provider,
        status: "skipped",
        latencyMs: 0,
        resultCount: 0,
        error: "Circuit breaker is open",
      },
      results: [],
    };
  }

  const startedAt = performance.now();

  try {
    const results = await fn();
    recordSuccess(provider);

    return {
      attempt: {
        provider,
        status: "success",
        latencyMs: Math.round(performance.now() - startedAt),
        resultCount: results.length,
        error: null,
      },
      results,
    };
  } catch (error) {
    const status = classify(error);
    recordFailure(provider, status);

    return {
      attempt: {
        provider,
        status,
        latencyMs: Math.round(performance.now() - startedAt),
        resultCount: 0,
        error: String(error),
      },
      results: [],
    };
  }
}

export async function webSearch(query: string, maxResults: number) {
  const attempts: ProviderAttempt[] = [];
  const collected: NormalizedResult[] = [];

  const useSearXNG = process.env.WEB_SEARCH_ENABLE_SEARXNG !== "false";
  const useDdgLite = process.env.WEB_SEARCH_ENABLE_DDG_LITE !== "false";

  if (useSearXNG) {
    const searxng = await tryProvider("searxng", () =>
      searchSearXNG(query, maxResults),
    );

    attempts.push(searxng.attempt);
    collected.push(...searxng.results);
  }

  // Only use the fragile scraper when the primary returned fewer than 3 results.
  if (useDdgLite && collected.length < 3) {
    const ddg = await tryProvider("duckduckgo-lite", () =>
      searchDuckDuckGoLite(query, maxResults),
    );

    attempts.push(ddg.attempt);
    collected.push(...ddg.results);
  }

  const results = dedupe(collected).slice(0, maxResults);
  const successes = attempts.filter((attempt) => attempt.status === "success");

  return {
    query,
    degraded: successes.length < 2,
    attemptedProviders: attempts,
    warnings: [
      ...(successes.length === 0
        ? ["No provider returned results."]
        : []),
      ...(successes.length === 1
        ? ["Only one provider succeeded; web-search coverage is reduced."]
        : []),
    ],
    results,
  };
}
```


### `.opencode/tools/web-search.ts`

```ts
import { tool } from "opencode/tools";
import { z } from "zod";
import { webSearch } from "../../search/broker.js";

export default tool({
  description: `
Search the web through local free providers. Returns normalized results,
per-provider health information, and a degraded-coverage indicator.
Use direct source-specific tools instead for arXiv, Reddit, Bluesky, GitHub,
and other sources with dedicated APIs.
`.trim(),

  schema: z.object({
    query: z.string().min(1).max(500),
    maxResults: z.number().int().min(1).max(20).default(10),
  }),

  async execute(args) {
    return JSON.stringify(await webSearch(args.query, args.maxResults), null, 2);
  },
});
```


## Diagnostics tool

### `.opencode/tools/search-doctor.ts`

```ts
import { tool } from "opencode/tools";
import { z } from "zod";
import { webSearch } from "../../search/broker.js";

export default tool({
  description:
    "Diagnose configured free web-search providers without exposing secrets.",

  schema: z.object({
    query: z.string().default("OpenCode custom tools"),
  }),

  async execute(args) {
    const configuration = {
      node: process.version,
      searxngConfigured: Boolean(process.env.SEARXNG_BASE_URL),
      searxngEnabled: process.env.WEB_SEARCH_ENABLE_SEARXNG !== "false",
      duckDuckGoLiteEnabled:
        process.env.WEB_SEARCH_ENABLE_DDG_LITE !== "false",
    };

    const result = await webSearch(args.query, 3);

    return JSON.stringify(
      {
        configuration,
        probe: result,
        diagnosis:
          result.results.length > 0
            ? "At least one free search provider is operational."
            : "No search provider returned usable results. Inspect attemptedProviders.",
      },
      null,
      2,
    );
  },
});
```


## Agent file

### `.opencode/agents/web-research-agent.md`

```markdown
---
description: >
  Free-first general web-research specialist. Uses the local web-search broker,
  interprets provider health, and reports degraded coverage honestly.
mode: subagent
hidden: true

permissions:
  web-search: allow
  search-doctor: allow
  webfetch: allow
  task:
    "*": deny
  edit:
    "*": deny
  bash:
    "*": deny
---

You are the free-first web-research specialist.

Use `web-search` for general web discovery. Use `search-doctor` only when a
search request fails, returns no results, or reports degraded coverage.

Operating rules:
- Form 2 to 4 complementary narrow queries for broad research tasks.
- Inspect `attemptedProviders`, `degraded`, and `warnings` in every tool result.
- If degraded is true, say search coverage was reduced.
- Do not treat an absence from results as proof that a source or event does not exist.
- Prefer direct-source tools when available: arXiv, GitHub, Reddit MCP,
  Bluesky AppView, package registries, and official documentation.
- De-duplicate results and distinguish primary sources from commentary.
- Return structured evidence and source URLs. Do not write the final answer.
```


## Assumptions \& Constraints

- SearXNG’s own configuration must explicitly allow `json`; its documented default example only lists HTML, so omitting the extra format would make the broker fail.[^9_2]
- The initial health store is in-memory and resets whenever OpenCode restarts. That is deliberate for a first working version; persist it only after the basic routing works.
- The DuckDuckGo parser is isolated, bounded, and only runs when SearXNG is thin or down. Expect its markup to change eventually.
- This package has no paid provider requirement and does not force a paid fallback.


## Possible Refinements

The correct next implementation state is **ValidationState**:

1. Create the directory/files above in an actual OpenCode repo.
2. Start local SearXNG.
3. Run `search-doctor`.
4. Add DuckDuckGo Lite HTML fixtures from real responses.
5. Write red tests for: provider timeout, blocked Lite response, malformed JSON, duplicate URLs, and both providers unavailable.
6. Write green tests until every failure produces structured degradation rather than an unhandled exception.

<div align="center">⁂</div>

[^9_1]: https://www.arxiv.org/pdf/2602.16873.pdf

[^9_2]: https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration


