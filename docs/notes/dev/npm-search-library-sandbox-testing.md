---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "NPM Search Library Sandbox Testing"
summary: "NPM install and smoke-test results for search libraries, including snoowrap deprecation."
category: "dev"
created: "2026-07-10"
---

# Use NPM to install the libraries in your sandbox, then test them out with simple one off scripts

Current Mode: LocalAgentMode
Current State: ValidationState

## Clarified Intent

You asked for actual npm installation and live smoke testing rather than hypothetical wrappers. I attempted this in the sandbox; the full package set did not complete because one selected package, `snoowrap`, pulls an old Puppeteer dependency that tried to download Chromium and exceeded the execution timeout.

## Artifact Specification

The sandbox setup script for the attempted test was:

```bash
#!/usr/bin/env bash
set -euo pipefail

npm install --no-audit --no-fund \
  xml2js \
  @atproto/api \
  ddgs \
  snoowrap
```

The intended one-off checks were:

- **DuckDuckGo**: call the `ddgs` npm library with a simple text query.
- **arXiv**: query the official Atom/XML endpoint, parse it using `xml2js`, and inspect returned paper metadata.
- **Bluesky**: instantiate an `@atproto/api` `AtpAgent` pointed at `https://public.api.bsky.app`, then call `app.bsky.graph.searchStarterPacks`.
- **Reddit**: initially test `snoowrap`; this choice is rejected because it is deprecated and dragged in obsolete Puppeteer/request dependencies during installation.

The Bluesky direction is sound: the public AppView API supports unauthenticated calls for public `app.bsky.*` endpoints, including starter-pack search.  The arXiv tool should use the documented `export.arxiv.org/api/query` endpoint with `search_query`, pagination, and sorting parameters.[^4_1][^4_2]

## Validation Result

The npm install **timed out** while Puppeteer attempted to download browser binaries through `snoowrap`’s dependency tree. npm also reported that `snoowrap` itself is deprecated.

**Do not use `snoowrap` for this agent bundle.** It is not an appropriate lightweight dependency for an OpenCode custom tool.

For the next validation pass, I recommend the deliberately smaller dependency set:

```bash
npm install --no-audit --no-fund \
  ddgs \
  xml2js \
  @atproto/api
```

Then implement Reddit as a small authenticated native-API `fetch` wrapper, rather than a library:

```ts
const token = process.env.REDDIT_ACCESS_TOKEN;
const response = await fetch(
  `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=${limit}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "opencode-deep-research/0.1",
    },
  },
);
```

This avoids a large, outdated dependency tree and keeps credentials in environment variables. Reddit search support can be exposed through its search endpoints, although API behavior and scope should be treated as provider/authentication dependent.[^4_3][^4_4]

## Corrected Tool Choices

| Source | Recommended implementation | Install | Status |
| :-- | :-- | :-- | :-- |
| DuckDuckGo | `ddgs` npm library | `npm install ddgs` | Still needs isolated install + smoke test; package advertises DuckDuckGo web, image, video, and news search support. [^4_5] |
| arXiv | Native `fetch` plus `xml2js` | `npm install xml2js` | Good design; avoids an unnecessary dedicated package. arXiv’s API is directly queryable. [^4_2] |
| Bluesky | `@atproto/api` | `npm install @atproto/api` | Good design; official client and public AppView endpoint. [^4_1] |
| Reddit | Native OAuth `fetch` wrapper | No library required | Preferred replacement for deprecated `snoowrap`; requires an OAuth token and configured app credentials. |
| Reddit archival/full-text | Optional provider adapter | Provider-specific | Keep separate from native Reddit to avoid pretending native search is a historical archive. [^4_6] |

## Assumptions \& Constraints

- I used `/tmp` because the sandbox’s persistent home directory was unavailable after the first timed-out process.
- The test did not reach actual HTTP calls: npm left no usable `node_modules` directory after timing out.
- `max_steps` should simply be omitted from the OpenCode agent frontmatter, as you noted; a custom tool itself has no corresponding `max_steps` field.[^4_7]
- Do not hardcode Reddit secrets in an OpenCode tool file; use `process.env.REDDIT_ACCESS_TOKEN`, and place secret provisioning outside version control.


## Possible Refinements

The next implementation iteration should replace the earlier speculative snippets with a real, tested bundle containing:

- `.opencode/tools/duckduckgo-search.ts`
- `.opencode/tools/arxiv-search.ts`
- `.opencode/tools/bluesky-search.ts`
- `.opencode/tools/reddit-search.ts` (native OAuth only)
- `package.json` with only `ddgs`, `xml2js`, and `@atproto/api`
- One `smoke.mjs` script per supported source, including an expected JSON shape assertion

I would rerun the isolated three-package install and execute those smoke scripts before treating any tool wrapper as validated.

<div align="center">⁂</div>

[^4_1]: https://docs.bsky.app/docs/api/app-bsky-graph-search-starter-packs

[^4_2]: https://info.arxiv.org/help/api/user-manual.html

[^4_3]: https://www.reddit.com/r/redditdev/comments/z10wzz/how_to_do_a_reddit_search_using_api_not_a/

[^4_4]: https://www.reddit.com/r/redditdev/comments/1f3yro5/searching_all_reddit_posts_with_api/

[^4_5]: https://github.com/eudalabs/ddgs

[^4_6]: https://pullpush.io/

[^4_7]: https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration

