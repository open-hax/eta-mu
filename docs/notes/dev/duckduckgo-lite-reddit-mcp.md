---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "DuckDuckGo Lite Adapter and Reddit MCP"
summary: "Dependency-free DuckDuckGo Lite adapter and official-OAuth Reddit MCP server selection."
category: "dev"
created: "2026-07-10"
---

# may as well roll our own duckduckgo. The libraries never work. Is there an existing reddit MCP server which handles doing oauth the right way?

Current Mode: LocalAgentMode
Current State: DraftState

## Clarified Intent

Yes—roll a small DuckDuckGo adapter yourselves rather than depending on fragile scraper libraries. For Reddit, there are existing MCP servers that handle OAuth, and the best fit for **read-only research** is `@enisze/reddit-mcp`; it obtains a Reddit OAuth2 client-credentials token from your app credentials and exposes subreddit post search.[^6_1]

## Artifact Specification

### DuckDuckGo: own minimal adapter

Do not present an arbitrary scrape library as infrastructure. Make the OpenCode custom tool call a local, dependency-free adapter that:

- Queries DuckDuckGo’s Lite HTML UI.
- Sends an explicit User-Agent.
- Applies a timeout and bounded retries.
- Parses result links, titles, and snippets.
- Returns a stable normalized JSON schema.
- Clearly reports blocking, CAPTCHA, markup changes, or zero-result anomalies.
- Never pretends that a scrape result is an official DuckDuckGo API response.

The core architecture should be:

```text
@duckduckgo-web-agent
  -> duckduckgo-search OpenCode custom tool
    -> local script / service: src/duckduckgo-lite.ts
      -> https://lite.duckduckgo.com/lite/?q=...
      -> normalized JSON results
```

This makes the unstable portion a single, testable adapter. The agent contract stays stable even if DuckDuckGo changes markup.

### `duckduckgo-search.ts`

Save as `.opencode/tools/duckduckgo-search.ts`:

```ts
import { tool } from "opencode/tools";
import { z } from "zod";

const resultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string().nullable(),
});

type SearchResult = z.infer<typeof resultSchema>;

function decodeDuckDuckGoRedirect(href: string): string {
  try {
    const url = new URL(href, "https://lite.duckduckgo.com");

    // DDG can use a redirect link containing uddg=<encoded destination>.
    const target = url.searchParams.get("uddg");

    return target ? decodeURIComponent(target) : url.toString();
  } catch {
    return href;
  }
}

function htmlToText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLiteResults(html: string, maxResults: number): SearchResult[] {
  const links = [
    ...html.matchAll(
      /<a[^>]+class="result-link"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ];

  const snippets = [
    ...html.matchAll(
      /<td[^>]+class="result-snippet"[^>]*>([\s\S]*?)<\/td>/gi,
    ),
  ];

  return links.slice(0, maxResults).flatMap((match, index) => {
    const url = decodeDuckDuckGoRedirect(match[^6_1]);
    const title = htmlToText(match[^6_2]);
    const snippet = htmlToText(snippets[index]?.[^6_1] ?? "") || null;

    if (!title || !url.startsWith("http")) return [];

    return [{ title, url, snippet }];
  });
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Response> {
  const signal = AbortSignal.timeout(timeoutMs);

  return fetch(url, {
    signal,
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.8",
      "User-Agent":
        "opencode-deep-research/0.1 (local research adapter; contact: local)",
    },
  });
}

export default tool({
  description:
    "Search DuckDuckGo Lite through a local dependency-free adapter and return normalized web results.",

  schema: z.object({
    query: z.string().min(1).max(500),
    maxResults: z.number().int().min(1).max(25).default(10),
    timeoutMs: z.number().int().min(2_000).max(30_000).default(12_000),
  }),

  async execute(args) {
    const params = new URLSearchParams({
      q: args.query,
      kl: "us-en",
    });

    const response = await fetchWithTimeout(
      `https://lite.duckduckgo.com/lite/?${params.toString()}`,
      args.timeoutMs,
    );

    if (!response.ok) {
      throw new Error(`DuckDuckGo Lite request failed: HTTP ${response.status}`);
    }

    const html = await response.text();

    if (/captcha|anomaly|unusual traffic/i.test(html)) {
      throw new Error(
        "DuckDuckGo Lite returned a block/challenge page; reduce request rate or use a fallback provider.",
      );
    }

    const results = parseLiteResults(html, args.maxResults);

    if (results.length === 0) {
      throw new Error(
        "DuckDuckGo Lite returned no parseable results; its HTML may have changed or the query has no results.",
      );
    }

    return JSON.stringify(
      {
        query: args.query,
        source: "duckduckgo-lite",
        resultCount: results.length,
        results: results.map((result, index) => ({
          rank: index + 1,
          ...result,
        })),
      },
      null,
      2,
    );
  },
});
```

**Important hardening:** the exact CSS class/markup should be verified with a direct fetch before committing. Add fixture-based parsing tests: archive representative Lite HTML responses, then run the parser against them. That is the actual red/green point here—not merely proving an npm package installs.

### `duckduckgo-web-agent.md` change

```markdown
---
description: >
  Broad web-search subagent. Uses the local DuckDuckGo Lite custom tool and
  reports source diversity, parser failures, blocks, and search gaps.
mode: subagent
hidden: true

permissions:
  duckduckgo-search: allow
  webfetch: allow
  task:
    "*": deny
  edit:
    "*": deny
  bash:
    "*": deny
---

You are the DuckDuckGo web-search subagent.

Use `duckduckgo-search` for every primary web query. Treat the tool as a
best-effort web-discovery system, not as proof of a claim.

For each assigned topic:
1. Form 2 to 4 narrow, complementary search queries.
2. Invoke `duckduckgo-search` separately for each query.
3. De-duplicate URLs and identify source types: primary documentation,
   institutional source, research paper, news report, commentary, forum.
4. Report parser errors, rate limiting, challenge pages, thin results, and
   suspected query bias explicitly.
5. Return a compact structured evidence set; do not write the final report.

Do not invoke other agents. Do not make file edits.
```


## Reddit MCP Options

### Recommended: `@enisze/reddit-mcp`

`@enisze/reddit-mcp` is purpose-built for safe, read-only Reddit research. It uses Reddit OAuth2 client-credentials authentication and offers a `search_posts` tool for searching within a specified subreddit, with sort options including relevance, hot, top, new, and comments.[^6_1]

It requires:

- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_USER_AGENT`

It does **not** require a Reddit username/password for its read-only model.[^6_1]

A typical MCP registration is:

```json
{
  "mcp": {
    "reddit": {
      "type": "local",
      "command": ["npx", "-y", "@enisze/reddit-mcp"],
      "environment": {
        "REDDIT_CLIENT_ID": "{env:REDDIT_CLIENT_ID}",
        "REDDIT_CLIENT_SECRET": "{env:REDDIT_CLIENT_SECRET}",
        "REDDIT_USER_AGENT": "opencode-deep-research/0.1"
      },
      "enabled": true
    }
  }
}
```

Verify the precise OpenCode MCP configuration shape against your local OpenCode version; the server’s command and required environment variables are documented by the project.[^6_1]

### Broader capability: `jordanburke/reddit-mcp-server`

`jordanburke/reddit-mcp-server` advertises broader operations—posts, comments, user information, and content creation—but write-capability expands the blast radius. It is inappropriate as the default tool for a research-only orchestrator unless you explicitly split it into separate read-only and write-enabled profiles.[^6_2]

### Not recommended: keyless/scraping MCPs

Several “zero-config” MCP servers use public `.json`, old Reddit, Libreddit mirrors, or scraping rather than official OAuth. One npm package documents an approximate unauthenticated rate limit of 60 requests/minute; another advertises scraping old Reddit/Libreddit.[^6_3][^6_4]

They may be useful as an **explicit fallback** for low-stakes discovery, but they do **not** “handle OAuth right.” Do not build the primary deep-research system on them.

## Reddit Agent Contract

Use an agent that delegates Reddit calls only through the MCP server:

```markdown
---
description: >
  Read-only Reddit research specialist. Uses the configured official-OAuth
  Reddit MCP server for subreddit-scoped post discovery and thread analysis.
mode: subagent
hidden: true

permissions:
  reddit_*: allow
  task:
    "*": deny
  edit:
    "*": deny
  bash:
    "*": deny
---

You are a read-only Reddit research specialist.

Use only the configured Reddit MCP tools. Never attempt to post, vote, subscribe,
message users, or change account state.

Research workflow:
1. If no subreddit is specified, identify 2 to 5 likely subreddits through
   a discovery task before searching.
2. Search each relevant subreddit with varied queries and sort modes.
3. Treat Reddit as anecdotal/community evidence, never as sole proof.
4. Separate recurring patterns from isolated stories.
5. Return each claim with post URLs, subreddit, approximate date, score/context,
   and a confidence label: anecdotal, recurring, or corroborated.
6. Explicitly disclose coverage limits imposed by subreddit scope, time range,
   deleted content, API search behavior, and ranking.

Never reveal OAuth credentials or include secrets in output.
```


## Assumptions \& Constraints

- An OAuth client-credentials server is correct for **app-level, read-only research**; it is not user OAuth authorization and cannot act as an individual Reddit account.[^6_1]
- The documented `@enisze/reddit-mcp` search capability is **subreddit-scoped**, so the orchestrator should have a subreddit-discovery phase or use a separate official global-search MCP/tool if that limitation matters.[^6_1]
- DuckDuckGo Lite scraping is inherently subject to markup and anti-automation changes. Your adapter must have fixture tests, a circuit breaker, response-size limits, and a configurable fallback rather than hidden retries.
- Do not commit `.env`, Reddit client secret, or tokens. Use a local secret manager or the OpenCode runtime environment.


## Possible Refinements

The next artifact should be a compact package with:

- `src/duckduckgo-lite.ts` plus HTML fixture tests.
- `.opencode/tools/duckduckgo-search.ts`.
- `.opencode/agents/duckduckgo-web-agent.md`.
- `.opencode/agents/reddit-signal-agent.md`.
- An OpenCode MCP registration file for `@enisze/reddit-mcp`.
- A `research-tools-doctor` custom tool that verifies environment variables, Node version, outbound connectivity, and each enabled backend without leaking credentials.
<span style="display:none">[^6_10][^6_11][^6_12][^6_13][^6_14][^6_15][^6_5][^6_6][^6_7][^6_8][^6_9]</span>

<div align="center">⁂</div>

[^6_1]: https://github.com/enisze/reddit-mcp

[^6_2]: https://github.com/jordanburke/reddit-mcp-server

[^6_3]: https://libraries.io/npm/reddit-connector-mcp

[^6_4]: https://github.com/namanxajmera/mcp-reddit

[^6_5]: https://github.com/karanb192/reddit-mcp-buddy

[^6_6]: https://github.com/achetronic/reddit-mcp

[^6_7]: https://github.com/Arindam200/reddit-mcp

[^6_8]: https://github.com/systempromptio/systemprompt-mcp-server

[^6_9]: https://www.reddit.com/r/opensource/comments/1t8xp6w/reddirect_reddit_mcp_server_that_works_without/

[^6_10]: https://github.com/hawstein/mcp-server-reddit

[^6_11]: https://github.com/eliasbiondo/reddit-mcp-server

[^6_12]: https://github.com/Pranay-A17/reddit-mcp-server

[^6_13]: https://www.reddit.com/r/mcp/comments/1ljaai5/reddit_remote_mcp_server/

[^6_14]: https://www.reddit.com/r/mcp/comments/1ml0lxx/how_i_built_an_mcp_server_that_creates_1000/

[^6_15]: https://www.reddit.com/r/mcp/comments/1i33zhq/githuboauth_mcp_server_facilitates_authentication/


