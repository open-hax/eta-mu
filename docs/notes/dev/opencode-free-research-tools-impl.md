---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "OpenCode Free Research Tools Implementation"
summary: "Validated OpenCode custom tool files for arXiv, Bluesky, Reddit OAuth, and DuckDuckGo adapter."
category: "dev"
created: "2026-07-10"
---


# Yea go ahead, hack all of those out,

Current Mode: LocalAgentMode
Current State: ValidationState

## Clarified Intent

I installed and tested the lightweight tool stack in the sandbox, then drafted the actual OpenCode custom-tool files around the APIs/libraries. arXiv and Bluesky calls worked; DuckDuckGo exposed an API mismatch that needs one small correction before it is accepted.

## Artifact Specification

The tested local package set is:

```json
{
  "dependencies": {
    "@atproto/api": "latest",
    "ddgs": "latest",
    "xml2js": "latest"
  },
  "devDependencies": {
    "tsx": "latest",
    "typescript": "latest"
  }
}
```

Installation completed successfully: 207 packages in 14 seconds. However, `@atproto/api@0.20.28` declares Node 22+, while the sandbox uses Node 20.19.5; its simple public AppView call still worked, but use Node 22+ in the actual OpenCode project. `ddgs@1.0.4` also brings Puppeteer indirectly, so I do **not** recommend it as the final DuckDuckGo dependency despite successful installation.[^5_1]

### `package.json`

```json
{
  "name": "opencode-research-tools",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "dependencies": {
    "@atproto/api": "^0.20.28",
    "xml2js": "^0.6.2"
  },
  "devDependencies": {
    "tsx": "^4.23.0",
    "typescript": "^7.0.2"
  }
}
```

I removed `ddgs` from the recommended final dependency manifest because its package metadata shows it depends on Puppeteer and stealth tooling, which is unnecessarily heavy for an OpenCode search tool.[^5_1]

## Tested Results

### arXiv: passed

The smoke script fetched the arXiv Atom endpoint, parsed the XML with `xml2js`, received HTTP 200, and parsed two entries. The first returned paper title was *PyramidTNT: Improved Transformer-in-Transformer Baselines with Pyramid Architecture*.

That validates this implementation pattern:

```ts
const response = await fetch(
  "https://export.arxiv.org/api/query?search_query=all%3Atransformer&start=0&max_results=2",
);
const feed = await parseStringPromise(await response.text());
const entries = feed.feed?.entry ?? [];
```

arXiv officially supports query construction through `search_query` plus `start`, `max_results`, sorting, and ordering parameters.[^5_2]

### Bluesky: passed

The smoke script created an `AtpAgent` against the public AppView service and successfully called:

```ts
const client = new AtpAgent({
  service: "https://public.api.bsky.app",
});

const result = await client.app.bsky.graph.searchStarterPacks({
  q: "AI",
  limit: 2,
});
```

It returned two starter-pack records. The records did not have the expected `name` property, so the normalizer should preserve the whole useful record shape or prefer `record.name` / `record.description` instead of assuming top-level fields. Bluesky documents the public AppView endpoint and `app.bsky.graph.searchStarterPacks` as a public, unauthenticated endpoint.[^5_3]

### DuckDuckGo: failed validation

The installed `ddgs` package did **not** export the assumed `DDGS` class. It exports a default `DuckDuckGoService` class, so the initial test raised:

```text
TypeError: Class constructor DuckDuckGoService cannot be invoked without 'new'
```

More importantly, it includes Puppeteer, which is a poor fit for a portable lightweight research bundle. I would replace it with a direct DuckDuckGo HTML/Lite endpoint adapter or a specifically vetted minimal package rather than putting this `ddgs` package in the project. Libraries advertising DuckDuckGo search support exist, but they should be dependency-inspected before adoption.[^5_4][^5_5][^5_6]

### Reddit: designed but not runtime-tested

The native Reddit tool is intentionally a dependency-free OAuth wrapper. It cannot be live-tested without your Reddit app credentials and a short-lived bearer token.

It fails clearly if credentials are absent:

```ts
const token = process.env.REDDIT_ACCESS_TOKEN;
if (!token) throw new Error("REDDIT_ACCESS_TOKEN is required");
```

This is preferable to the deprecated `snoowrap` route, whose install path introduced a large, obsolete Puppeteer-based dependency chain. Reddit native search has practical limitations and should be treated separately from archival/full-text search services.[^5_7][^5_8][^5_9]

## Custom Tool Files

### `arxiv-search.ts`

Save as `.opencode/tools/arxiv-search.ts`.

```ts
import { tool } from "opencode/tools";
import { z } from "zod";
import { parseStringPromise } from "xml2js";

export default tool({
  description: "Search arXiv's Atom API and return normalized paper metadata.",

  schema: z.object({
    query: z
      .string()
      .describe(
        "arXiv query, such as 'cat:cs.AI AND all:agents' or 'au:Hinton_G'",
      ),
    maxResults: z.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum(["relevance", "lastUpdatedDate", "submittedDate"])
      .default("submittedDate"),
    sortOrder: z.enum(["ascending", "descending"]).default("descending"),
  }),

  async execute(args) {
    const params = new URLSearchParams({
      search_query: args.query,
      start: "0",
      max_results: String(args.maxResults),
      sortBy: args.sortBy,
      sortOrder: args.sortOrder,
    });

    const response = await fetch(
      `https://export.arxiv.org/api/query?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`arXiv request failed: HTTP ${response.status}`);
    }

    const feed = await parseStringPromise(await response.text());
    const entries = feed.feed?.entry ?? [];

    return JSON.stringify(
      entries.map((entry: any) => ({
        id: entry.id?.[^5_0] ?? null,
        title: entry.title?.[^5_0]?.trim() ?? null,
        authors: (entry.author ?? [])
          .map((author: any) => author.name?.[^5_0])
          .filter(Boolean),
        published: entry.published?.[^5_0] ?? null,
        updated: entry.updated?.[^5_0] ?? null,
        summary: entry.summary?.[^5_0]?.trim() ?? null,
        categories: (entry.category ?? [])
          .map((category: any) => category.$?.term)
          .filter(Boolean),
        links: (entry.link ?? [])
          .map((link: any) => link.$?.href)
          .filter(Boolean),
        source: "arxiv",
      })),
      null,
      2,
    );
  },
});
```


### `bluesky-search.ts`

Save as `.opencode/tools/bluesky-search.ts`.

```ts
import { tool } from "opencode/tools";
import { z } from "zod";
import { AtpAgent } from "@atproto/api";

export default tool({
  description:
    "Search public Bluesky starter packs through the public AppView API.",

  schema: z.object({
    query: z.string().describe("Keywords used to find Bluesky starter packs."),
    limit: z.number().int().min(1).max(25).default(10),
  }),

  async execute(args) {
    const client = new AtpAgent({
      service: "https://public.api.bsky.app",
    });

    const { data } = await client.app.bsky.graph.searchStarterPacks({
      q: args.query,
      limit: args.limit,
    });

    return JSON.stringify(
      data.starterPacks.map((pack: any) => ({
        uri: pack.uri ?? null,
        cid: pack.cid ?? null,
        creator: {
          did: pack.creator?.did ?? null,
          handle: pack.creator?.handle ?? null,
          displayName: pack.creator?.displayName ?? null,
        },
        record: pack.record ?? null,
        indexedAt: pack.indexedAt ?? null,
        source: "bluesky",
      })),
      null,
      2,
    );
  },
});
```


### `reddit-search.ts`

Save as `.opencode/tools/reddit-search.ts`.

```ts
import { tool } from "opencode/tools";
import { z } from "zod";

export default tool({
  description:
    "Search Reddit via the official OAuth API using REDDIT_ACCESS_TOKEN.",

  schema: z.object({
    query: z.string().describe("Terms to search for."),
    subreddit: z
      .string()
      .optional()
      .describe("Optional subreddit name, without r/."),
    limit: z.number().int().min(1).max(100).default(25),
    sort: z.enum(["relevance", "hot", "top", "new", "comments"]).default("relevance"),
    timeframe: z.enum(["hour", "day", "week", "month", "year", "all"]).default("all"),
  }),

  async execute(args) {
    const token = process.env.REDDIT_ACCESS_TOKEN;

    if (!token) {
      throw new Error(
        "REDDIT_ACCESS_TOKEN is required. Configure OAuth outside source control.",
      );
    }

    const root = args.subreddit
      ? `https://oauth.reddit.com/r/${encodeURIComponent(args.subreddit)}/search`
      : "https://oauth.reddit.com/search";

    const query = new URLSearchParams({
      q: args.query,
      limit: String(args.limit),
      sort: args.sort,
      t: args.timeframe,
      restrict_sr: args.subreddit ? "true" : "false",
      raw_json: "1",
    });

    const response = await fetch(`${root}?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "opencode-research-tools/0.1 (research assistant)",
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit request failed: HTTP ${response.status}`);
    }

    const payload = await response.json();

    return JSON.stringify(
      (payload.data?.children ?? []).map((child: any) => {
        const post = child.data;

        return {
          id: post.id ?? null,
          title: post.title ?? null,
          url: post.permalink
            ? `https://www.reddit.com${post.permalink}`
            : post.url ?? null,
          subreddit: post.subreddit ?? null,
          author: post.author ?? null,
          score: post.score ?? null,
          commentCount: post.num_comments ?? null,
          createdUtc: post.created_utc ?? null,
          selftext: post.selftext?.slice(0, 3000) ?? null,
          source: "reddit",
        };
      }),
      null,
      2,
    );
  },
});
```


### `duckduckgo-search.ts`

For now I recommend a **provider adapter**, rather than committing to an unvalidated scrape library. This keeps policy, API keys, and rate limits configurable.

Save as `.opencode/tools/duckduckgo-search.ts`:

```ts
import { tool } from "opencode/tools";
import { z } from "zod";

export default tool({
  description:
    "Search DuckDuckGo through a configured compatible JSON search endpoint.",

  schema: z.object({
    query: z.string().describe("Web search query."),
    maxResults: z.number().int().min(1).max(50).default(10),
    region: z.string().optional().describe("Optional region, e.g. us-en."),
    timeLimit: z.enum(["day", "week", "month", "year"]).optional(),
  }),

  async execute(args) {
    const endpoint = process.env.DUCKDUCKGO_SEARCH_ENDPOINT;
    const apiKey = process.env.DUCKDUCKGO_SEARCH_API_KEY;

    if (!endpoint) {
      throw new Error(
        "DUCKDUCKGO_SEARCH_ENDPOINT is required. Configure a compliant DDG-compatible search provider.",
      );
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        query: args.query,
        max_results: args.maxResults,
        region: args.region,
        time_limit: args.timeLimit,
      }),
    });

    if (!response.ok) {
      throw new Error(`DuckDuckGo provider failed: HTTP ${response.status}`);
    }

    const payload = await response.json();
    const results = payload.results ?? payload.organic_results ?? [];

    return JSON.stringify(
      results.slice(0, args.maxResults).map((result: any, index: number) => ({
        rank: index + 1,
        title: result.title ?? null,
        url: result.url ?? result.link ?? null,
        snippet: result.snippet ?? result.description ?? null,
        publishedAt: result.published_at ?? result.date ?? null,
        source: "duckduckgo",
      })),
      null,
      2,
    );
  },
});
```


## Assumptions \& Constraints

- The tool code uses `async execute(args)`, which is the OpenCode custom-tools convention you pointed to; ensure this matches the current version of the OpenCode tool helper in your installed project.[^5_10]
- Use **Node 22+** for the final project because the installed current `@atproto/api` release declares that minimum version.
- Native Reddit search needs you to create/configure a Reddit OAuth application and inject `REDDIT_ACCESS_TOKEN` into the runtime environment.
- DuckDuckGo needs a conscious provider choice. A paid/compliant SERP provider, a self-hosted endpoint, or a vetted minimal library are viable options; don’t silently rely on Puppeteer scraping in a research system.


## Possible Refinements

The only unresolved design decision is the DuckDuckGo backend. Do you want the tool to target:

- A **self-hosted lightweight DDG HTML/Lite adapter** (no third-party API key),
- A **commercial SERP provider** (reliability, predictable JSON), or
- A **specific npm package** you already trust?

<div align="center">⁂</div>

[^5_1]: https://github.com/eudalabs/ddgs

[^5_2]: https://info.arxiv.org/help/api/user-manual.html

[^5_3]: https://docs.bsky.app/docs/api/app-bsky-graph-search-starter-packs

[^5_4]: https://www.npmjs.com/package/@pikisoft/duckduckgo-search

[^5_5]: https://www.npmjs.com/package/@phukon/duckduckgo-search

[^5_6]: https://libraries.io/npm/ddg-search

[^5_7]: https://www.reddit.com/r/redditdev/comments/z10wzz/how_to_do_a_reddit_search_using_api_not_a/

[^5_8]: https://www.reddit.com/r/redditdev/comments/1f3yro5/searching_all_reddit_posts_with_api/

[^5_9]: https://pullpush.io/

[^5_10]: https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration


