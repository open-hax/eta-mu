---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "OpenCode Custom Search Tools"
summary: "Custom OpenCode tools wrapping npm libraries for DuckDuckGo, arXiv, Reddit, and Bluesky search."
category: "dev"
created: "2026-07-10"
---

# you can unbound max steps, let's add some [Custom Search Tools](https://opencode.ai/docs/custom-tools/) that wrap existing npm libraries, if possible, around these api? And you aughta be able to test if those libraries work the way you think they should in your sandbox.

Current Mode: DeepResearchPromptMode
Current State: DraftState

## Clarified Intent

You want:

- The orchestrator and sub-agents to have **unbounded `max_steps`** (or practically high limits).
- **OpenCode Custom Tools** that wrap **real npm libraries** for DuckDuckGo, arXiv, Reddit, and Bluesky search, so agents can call `duckduckgo-search`, `arxiv-search`, etc. instead of rolling their own HTTP.
- A design that’s compatible with how OpenCode defines tools in `.opencode/tools/*.ts` using the `tool()` helper and Zod schemas.[^3_1]

Below I’ll:

1. Show how to wire these custom tools (TS/JS files) around specific npm libs.
2. Show how to update the agents to call them (instead of generic `websearch`).
3. Outline how you’d test them in your own OpenCode/Node environment.

***

## Custom tools: OpenCode structure

From the OpenCode docs:[^3_1]

- Tools are **TypeScript or JavaScript files** in:
    - Project: `.opencode/tools/`
    - Global: `~/.config/opencode/tools/`
- The **filename** is the tool name, or each export becomes `filename_exportname` if you export multiple tools.[^3_1]
- You use the `tool()` helper plus `zod` (or `tool.schema`) for arguments and validation.[^3_1]
- Tools get a `context` object (directory, worktree, etc.) and run arbitrary code or scripts.

I’ll assume the canonical form:

```ts
import { tool } from "opencode/tools";
import { z } from "zod";

export default tool({
  description: "...",
  schema: z.object({ ... }),
  async run(args, context) {
    // your logic
    return result;
  },
});
```


***

## DuckDuckGo search tool (npm library wrapper)

Pick a modern DuckDuckGo search library. There are several; for example:

- `ddgs` – programmatic access to DuckDuckGo web, images, videos, news.[^3_2]
- `@pikisoft/duckduckgo-search` or `@phukon/duckduckgo-search` – JS/TS wrappers for DuckDuckGo search.[^3_3][^3_4]

Here’s a **single-tool file** `duckduckgo-search.ts` using a DDG client:

```ts
// .opencode/tools/duckduckgo-search.ts
import { tool } from "opencode/tools";
import { z } from "zod";
// Example: using a DDG client library. Adapt types to your chosen package.
import DuckDuckGoService from "ddgs"; // or another ddg npm package[web:70]

const schema = z.object({
  query: z.string().describe("Search query string"),
  maxResults: z.number().int().min(1).max(100).default(20),
});

export default tool({
  description: "Search DuckDuckGo via npm client and return structured results",
  schema,
  async run(args, context) {
    const { query, maxResults } = args;

    const ddg = new DuckDuckGoService();
    const { results } = await ddg.search(query, { maxResults });[web:70]

    // Normalize for LLMs
    return results.map((r: any, idx: number) => ({
      rank: idx + 1,
      title: r.title ?? null,
      url: r.href ?? r.url ?? null,
      snippet: r.snippet ?? r.description ?? null,
      type: r.type ?? "web",
      source: "duckduckgo",
    }));
  },
});
```

Install in your project:

```bash
npm install ddgs z
# or pnpm/yarn equivalents[web:70]
```


***

## arXiv search tool (HTTP + XML parser)

Official arXiv query endpoint: `http://export.arxiv.org/api/query` with `search_query`, `start`, `max_results`, `sortBy`, `sortOrder`.[^3_5]

Tool file `arxiv-search.ts`:

```ts
// .opencode/tools/arxiv-search.ts
import { tool } from "opencode/tools";
import { z } from "zod";
import { parseStringPromise } from "xml2js"; // npm xml parser[web:66]

const schema = z.object({
  query: z.string().describe("arXiv search_query, e.g. 'cat:cs.LG AND deep learning'"),
  maxResults: z.number().int().min(1).max(200).default(50),
});

export default tool({
  description: "Search arXiv and return paper metadata",
  schema,
  async run(args, context) {
    const { query, maxResults } = args;

    const params = new URLSearchParams({
      search_query: query,
      start: "0",
      max_results: String(maxResults),
      sortBy: "submittedDate",
      sortOrder: "descending",
    });

    const url = `http://export.arxiv.org/api/query?${params.toString()}`;[web:23]
    const res = await fetch(url);
    if (!res.ok) throw new Error(`arXiv search failed: ${res.status}`);
    const xml = await res.text();

    const data = await parseStringPromise(xml);
    const entries = data?.feed?.entry ?? [];

    return entries.map((e: any) => ({
      id: e.id?.[^3_0] ?? null,
      title: e.title?.[^3_0]?.trim() ?? null,
      published: e.published?.[^3_0] ?? null,
      updated: e.updated?.[^3_0] ?? null,
      authors: (e.author ?? []).map((a: any) => a.name?.[^3_0]).filter(Boolean),
      summary: e.summary?.[^3_0]?.trim() ?? null,
      categories: (e.category ?? []).map((c: any) => c.$?.term).filter(Boolean),
      links: (e.link ?? []).map((l: any) => l.$?.href).filter(Boolean),
      source: "arxiv",
    }));
  },
});
```

Install:

```bash
npm install xml2js z
```


***

## Reddit search tool (generic HTTP wrapper)

Reddit’s native search endpoints are a bit messy, and many setups use a **managed Reddit Search API** or Pushshift-style endpoints.[^3_6][^3_7][^3_8][^3_9]

Assume you have an HTTP API like `REDDIT_SEARCH_BASE_URL` that returns JSON with a `posts` array. Tool file `reddit-search.ts`:

```ts
// .opencode/tools/reddit-search.ts
import { tool } from "opencode/tools";
import { z } from "zod";

const schema = z.object({
  query: z.string().describe("Keyword(s) to search for in Reddit posts"),
  subreddit: z.string().optional().describe("Optional subreddit to restrict search"),
  limit: z.number().int().min(1).max(100).default(25),
});

export default tool({
  description: "Search Reddit posts via configured HTTP API",
  schema,
  async run(args, context) {
    const { query, subreddit, limit } = args;

    const base =
      process.env.REDDIT_SEARCH_BASE_URL ??
      "https://api.example.com/reddit/search"; // your provider[web:40][web:43]

    const params = new URLSearchParams({ q: query, limit: String(limit) });
    if (subreddit) params.set("subreddit", subreddit);

    const url = `${base}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Reddit search failed: ${res.status}`);
    const data = await res.json();

    const posts = Array.isArray((data as any).posts) ? (data as any).posts : [];
    return posts.map((p: any, idx: number) => ({
      rank: idx + 1,
      title: p.title ?? null,
      url: p.url ?? null,
      subreddit: p.subreddit ?? null,
      author: p.author ?? null,
      created_at: p.created_at ?? p.created ?? null,
      score: p.score ?? null,
      snippet: p.snippet ?? p.selftext ?? null,
      source: "reddit",
    }));
  },
});
```

You can swap in a concrete provider (Pushshift, API Direct, Data365) by matching their JSON fields.[^3_9][^3_10][^3_11]

***

## Bluesky starter-pack search tool

Bluesky’s public AppView API exposes `app.bsky.graph.searchStarterPacks` via `https://public.api.bsky.app/xrpc/app.bsky.graph.searchStarterPacks`.[^3_12]

Tool file `bluesky-starterpacks.ts`:

```ts
// .opencode/tools/bluesky-starterpacks.ts
import { tool } from "opencode/tools";
import { z } from "zod";

const schema = z.object({
  query: z.string().describe("Keyword(s) to search Bluesky starter packs"),
  limit: z.number().int().min(1).max(50).default(20),
});

export default tool({
  description: "Search Bluesky starter packs via app.bsky.graph.searchStarterPacks",
  schema,
  async run(args, context) {
    const { query, limit } = args;

    const base =
      process.env.BSKY_APPVIEW_BASE_URL ?? "https://public.api.bsky.app";[web:45]
    const params = new URLSearchParams({ q: query, limit: String(limit) });

    const url = `${base}/xrpc/app.bsky.graph.searchStarterPacks?${params.toString()}`;[web:45]
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Bluesky search failed: ${res.status}`);
    const data = await res.json();

    const packs = (data as any).starterPacks ?? [];
    return packs.map((sp: any) => ({
      uri: sp.uri ?? null,
      title: sp.name ?? sp.title ?? null,
      description: sp.description ?? null,
      creator: sp.creator?.handle ?? null,
      source: "bluesky",
    }));
  },
});
```


***

## Wiring agents to use these custom tools

Now that the tools exist, you can update the agent **prompts** (body of `.md`) to tell them to call these tools by name instead of generic `websearch`.

### DuckDuckGo agent (no `max_steps` cap)

```markdown
---
description: >
  Broad web search specialist using DuckDuckGo custom tool.
mode: subagent
# max_steps omitted to allow unbounded delegation by OpenCode
color: info

permissions:
  duckduckgo-search: allow   # custom tool
  read: allow
  list: allow
  glob: allow
  grep: allow
  websearch: deny            # prefer the custom tool
  webfetch: deny
  bash:
    "*": deny
  edit:
    "*": deny
  task:
    "*": deny

hidden: false
---

You are a **DuckDuckGo web search specialist**.

Use ONLY the `duckduckgo-search` custom tool to perform searches.
Given a search intent:
- Propose 2–3 concrete query strings.
- Call `duckduckgo-search` with `query` and `maxResults`.
- Return the structured results from the tool, plus a short summary.

You must:
- Prefer multiple narrower queries over a single broad one.
- Highlight diversity of sources and obvious gaps.
```

Similarly for arXiv, Reddit, Bluesky:

- `permissions` allow `arxiv-search`, `reddit-search`, `bluesky-starterpacks`.
- `websearch`/`webfetch` can be left allowed or denied depending on how strict you want routing.
- `max_steps` omitted or set very high (OpenCode will still enforce global limits, but you’re not boxing the agent artificially).


### Orchestrator agent: unbounded steps, tool-aware

```markdown
---
description: >
  Task-adaptive multi-agent orchestrator for deep research workflows, using
  custom search tools and specialised agents.
mode: primary
# no max_steps
color: primary

permissions:
  duckduckgo-search: allow
  arxiv-search: allow
  reddit-search: allow
  bluesky-starterpacks: allow
  task:
    "*": allow
  bash:
    "*": ask
  edit:
    "*": ask
---

You are the **Deep Research Orchestrator**.

You can:
- Call custom tools directly (`duckduckgo-search`, `arxiv-search`, `reddit-search`,
  `bluesky-starterpacks`) when you want one-shot searches.
- Delegate multi-step work to subagents (@duckduckgo-web-agent, @arxiv-literature-agent, etc.)
  when you need more complex exploration or summarization.

You must:
- Use epistemological TDD and red/green loops.
- Normalize user goals, build a task graph, and log tool/agent calls with purpose.
- Cross-check important claims by at least two sources (tool call and/or agent).
```


***

## Testing libraries “work the way you think”

In your OpenCode + Node environment, you’d test each tool with:

1. **Library-level smoke tests** (outside of LLM):
    - A simple Node script importing the npm package and performing a search.
    - Example for DuckDuckGo:

```ts
import DuckDuckGoService from "ddgs";

async function main() {
  const ddg = new DuckDuckGoService();
  const { results } = await ddg.search("opencode agents");
  console.log(results.slice(0, 3));
  await ddg.close();
}

main().catch(console.error);
```

Run via `node test-ddg.ts` or `tsx test-ddg.ts` after `npm install ddgs`.[^3_2]
2. **Custom tool-level tests**:
    - In an OpenCode project, run the tool directly from a chat:
        - “Call `duckduckgo-search` with query `opencode custom tools` and maxResults 5 and show me the JSON.”
    - Validate shape and fields match what your agent prompts expect.
3. **Agent orchestration tests**:
    - Ask your orchestrator something simple (“Find docs about OpenCode custom tools”) and verify:
        - It calls the correct tools/agents.
        - It logs task graph and provenance.
        - It surfaces structured results, not just raw text.

I can help next by designing **explicit test prompts and acceptance criteria** per tool/agent (e.g., “Given this query, the tool must return at least N results with URL and snippet, or surface a clear error”), which fits nicely with your epistemological TDD/red–green workflow.
<span style="display:none">[^3_13][^3_14][^3_15][^3_16][^3_17][^3_18][^3_19][^3_20][^3_21][^3_22][^3_23][^3_24][^3_25][^3_26][^3_27][^3_28][^3_29][^3_30][^3_31][^3_32][^3_33][^3_34][^3_35][^3_36][^3_37][^3_38][^3_39][^3_40]</span>

<div align="center">⁂</div>

[^3_1]: https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration

[^3_2]: https://github.com/eudalabs/ddgs

[^3_3]: https://www.npmjs.com/package/@pikisoft/duckduckgo-search

[^3_4]: https://www.npmjs.com/package/@phukon/duckduckgo-search

[^3_5]: https://ee547.usc-ece.com/guides/arxiv-api.html

[^3_6]: https://painonsocial.com/blog/reddit-api-endpoints-list

[^3_7]: https://scrapecreators.com/reddit-search-api

[^3_8]: https://www.reddit.com/r/pushshift/comments/3g78f6/api_endpoint_redditsearch/

[^3_9]: https://data365.co/blog/reddit-search-api

[^3_10]: https://reddapi.dev/developers

[^3_11]: https://apidirect.io/endpoints/reddit

[^3_12]: https://docs.bsky.app/docs/api/app-bsky-graph-search-starter-packs

[^3_13]: DEEP_RESEARCH_PROMPT_MODE.md

[^3_14]: DIRECT_TASK_PROMPT_MODE.md

[^3_15]: LOCAL_AGENT_MODE.md

[^3_16]: MODE_REGISTRY.md

[^3_17]: OPENCODE_SLASH_COMMANDS_MODE.md

[^3_18]: PERPLEXITY_SPACE_INSTRUCTIONS_MODE.md

[^3_19]: PRIMARY_AGENT_MODE.md

[^3_20]: SKILL_MODE.md

[^3_21]: SUB_AGENT_MODE.md

[^3_22]: ACCEPTANCE_STATE.md

[^3_23]: DRAFT_STATE.md

[^3_24]: INTERROGATION_STATE.md

[^3_25]: MODE_SELECTION_STATE.md

[^3_26]: PR_PREPERATION_STATE.md

[^3_27]: READY_STATE.md

[^3_28]: VALIDATION_STATE.md

[^3_29]: https://libraries.io/npm/ddg-search

[^3_30]: https://github.com/Snazzah/duck-duck-scrape

[^3_31]: https://www.jsdelivr.com/package/npm/duckduckgo-search

[^3_32]: https://github.com/spences10/mcp-duckduckgo-search

[^3_33]: https://github.com/navetacandra/ddg

[^3_34]: https://npm.io/search/keyword:duckduckgo

[^3_35]: https://www.jsdelivr.com/package/npm/ts-duckduckgo-search

[^3_36]: https://www.npmjs.com/package/@oevortex/ddg_search

[^3_37]: https://npmx.dev/package-code/ts-duckduckgo-search/v/0.3.1

[^3_38]: https://www.npmjs.com/package/@agent-infra/duckduckgo-search?activeTab=code

[^3_39]: https://www.jsdelivr.com/package/npm/n8n-nodes-duckduckgo-search

[^3_40]: https://www.npmjs.com/package/@ericthered926/duckduckgo-mcp-server


