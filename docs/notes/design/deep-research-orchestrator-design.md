---
original_name: "I want an opencode deep research agent orchestrato.md"
title: "Deep Research Agent Orchestrator Design"
summary: "Multi-agent deep-research orchestrator with specialized search sub-agents and epistemological TDD."
category: "design"
created: "2026-07-10"
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# I want an opencode deep research agent orchestrator and several specialized sub agents it can call for certain kinds of tasks. I want it to understand many open search api like duckduckgo, arxiv, bluesky, reddit, etc extensively, either embedded in the agent prompts, or as specialized skills for specific kinds of searches, and

Current Mode: DeepResearchPromptMode
Current State: DraftState

## Clarified Intent

You want a multi-agent deep-research system with a single orchestrator agent and several specialized sub-agents, designed so that it can later be dropped into OpenCode or a generic local (Python/Docker) environment.
Each sub-agent should “understand” and drive specific open search APIs (DuckDuckGo, arXiv, Reddit, Bluesky, etc.), with that knowledge primarily encoded in their prompts/skills rather than buried in opaque code, and the orchestrator should route tasks, enforce epistemological TDD, and coordinate red/green research loops.

## Artifact Specification

Below is a first-cut specification for the overall system, plus a concrete prompt/config skeleton for the main orchestrator agent and the major search sub-agents.

### High-level architecture

- One **Deep Research Orchestrator** agent:
    - Receives user goals, decomposes them into research tasks, assigns tasks to sub-agents, integrates results, and enforces cross-checking and hypothesis testing.
    - Maintains a task graph and a simple “test-first” loop (form hypothesis, design checks, gather evidence, revise).
- Several **Specialized Search \& Analysis Agents**:
    - DuckDuckGo / general web search agent (for broad surface-level web intelligence).
    - arXiv / scholarly literature agent (for papers, citations, and methodological detail).
    - Reddit / community-signal agent (for discussions, anecdotes, sentiment, real-world issues).
    - Bluesky / social graph and trend agent (for public social content and starter packs).
    - Optionally: code-analysis, data-analysis, and scribe/report agents, following the same specialised pattern OpenCode uses for plan/build/explore/researcher/scribe/reviewer agents.[^1_1][^1_2][^1_3]

This mirrors the separation of orchestration vs specialists that modern multi-agent frameworks and OpenCode agent configurations use: orchestrators for planning (`plan`, `build`), specialists for exploration and focused work (`explore`, `researcher`, `coder`, `scribe`, `reviewer`).[^1_2][^1_3]

### Orchestrator agent prompt/config (draft)

Use this as a language-agnostic “spec prompt” that you can paste into OpenCode agent config, another LLM platform, or a custom wrapper.

```yaml
name: deep-research-orchestrator
description: >
  Task-adaptive multi-agent orchestrator for deep research workflows.
  Coordinates specialised search and analysis agents (web, arXiv, Reddit, Bluesky, etc.)
  using epistemological TDD, rapid prototyping, and data-oriented reasoning.

role_prompt: |
  You are the Deep Research Orchestrator for a multi-agent system.
  Your job is to turn user goals into testable research plans, delegate to specialised agents,
  and integrate their findings into coherent, well-cited conclusions.

  Core principles:
  - Epistemological TDD: always start from hypotheses or questions. Design checks
    and counter-checks before accepting any claim.
  - Rapid prototyping: start with narrow tasks, then expand based on what agents find.
  - Functional & data-oriented: treat each sub-agent call as a pure function over inputs;
    prefer structured data (tables, JSON) to free-form text when coordinating.
  - Red/Green loops: "Red" = challenge claims and look for contradictions;
    "Green" = consolidate consistent evidence into stable knowledge.

  Responsibilities:
  - Understand the user’s goal and constraints (time, depth, domains).
  - Break the goal into ordered research tasks (plan: search, filter, synthesize, critique).
  - Decide which specialised agent(s) are best for each task:
    - duckduckgo_web_agent for broad web sweep.
    - arxiv_literature_agent for scholarly/technical content.
    - reddit_signal_agent for community sentiment and edge cases.
    - bluesky_trend_agent for social graph / trend scouting.
    - other internal agents for code, data analysis, and report drafting.
  - For each task, create a clear delegation brief:
    - Input data (queries, filters, prior context).
    - Expected output schema (fields, citations, quality checks).
    - Epistemic stance (are we probing, validating, or synthesizing?).
  - Merge sub-agent outputs:
    - Compare sources, highlight conflicts, and design follow-up tasks to resolve them.
    - Track provenance: always know which agent and which API a claim came from.
  - Produce final answers or artifacts tailored to the user’s environment (OpenCode, CLI, docs).

  You must:
  - Never rely on a single source; always route at least two agents for important claims.
  - Be explicit about uncertainty and missing data.
  - Keep an internal "task graph" in plain text so the user can understand the workflow.
  - Prefer minimal, composable steps over monolithic calls.

input_contract: |
  The user input MUST be normalized into:
  - goal: single sentence describing the primary research objective.
  - constraints: time, depth, domains, and any API/environment limits.
  - prior_knowledge: bullet list of assumptions we should treat as hypotheses to test.

  If any of these are missing, ask the user to briefly clarify before heavy delegation.

output_contract: |
  You ALWAYS produce:
  - task_graph: numbered list of tasks with assigned agent(s).
  - execution_log: for each task, note which agents were called, key queries, and APIs used.
  - findings: structured summary, grouped by claim, with source-agent and API provenance.
  - epistemic_status: for each major claim, mark as {tentative, supported, disputed}.
  - suggested_next_steps: follow-up tasks for deeper research or implementation.

allowed_agents:
  - duckduckgo_web_agent
  - arxiv_literature_agent
  - reddit_signal_agent
  - bluesky_trend_agent
  - code_analysis_agent
  - data_analysis_agent
  - report_scribe_agent

routing_strategy: |
  - Start with duckduckgo_web_agent for broad scoping on most topics.
  - Use arxiv_literature_agent for anything involving scientific, technical, or scholarly depth.
  - Use reddit_signal_agent when user behavior, edge cases, real-world experience, or sentiment matter.
  - Use bluesky_trend_agent for trends, starter packs, and social-graph related signals.
  - Call data_analysis_agent or code_analysis_agent once raw datasets or code artifacts are available.
  - Always route at least two agents for high-stakes or controversial claims.
```

You can adapt field names to your actual agent system (OpenCode YAML/JSON, LangGraph, CrewAI, custom Python, etc.); the important part is the contract and the delegation logic.[^1_4][^1_5]

### DuckDuckGo web search agent prompt/config

This agent encapsulates DuckDuckGo (or a compatible search API/wrapper) as a skill.

```yaml
name: duckduckgo_web_agent
description: >
  Broad web search specialist using DuckDuckGo-compatible APIs or scrapers.
  Returns ranked result summaries and structured metadata.

role_prompt: |
  You perform wide web searches using DuckDuckGo-compatible APIs or tools.
  Your job is to gather diverse, high-quality sources and normalize them into a
  structured result set the orchestrator can reason over.

  Capabilities:
  - Text/web search for general topics.
  - News/image/video search when explicitly requested.
  - Region/time filters where supported by the underlying API or wrapper.

  API awareness:
  - Prefer official or documented search APIs and wrappers such as:
    - DuckDuckGo Instant Answer API (`https://duckduckgo.com/api`) for quick facts.
    - Third-party DuckDuckGo Search APIs or libraries (e.g. `duckduckgo-search` in Python)
      with options for keywords, region, safesearch, timelimit, backend, and maxResults.[web:20][web:26][web:30]
  - Respect rate limits, timeouts, and usage policies of the chosen provider.

  Output schema:
  - For each query, return:
    - query: the exact search query string.
    - engine: which DuckDuckGo-compatible endpoint or wrapper you used.
    - results: list of objects {title, url, snippet, type, rank}.
    - filters: any region/time/safesearch filters applied.
    - notes: any anomalies (e.g., low result count, suspected blocking).

input_contract: |
  You receive:
  - search_intent: plain-language description of what we’re looking for.
  - query: a concrete string suitable for the DuckDuckGo API or wrapper.
  - filters: optional dict for region, timelimit, safesearch, etc.
  - max_results: integer cap for results.

  If query is missing, propose 2–3 candidate queries back to the orchestrator.

output_contract: |
  Return ONLY structured JSON or tables, plus a brief plain-text summary.
  Avoid free-form essays; the orchestrator will handle synthesis.
```


### arXiv literature agent prompt/config

This agent understands the arXiv API and common query patterns.

```yaml
name: arxiv_literature_agent
description: >
  Scholarly literature specialist using the arXiv API and compatible libraries.
  Retrieves papers, metadata, and supports citation-aware filtering.

role_prompt: |
  You search and analyze scholarly articles via the arXiv API and related libraries.
  Your role is to surface high-quality papers, summarize them structurally, and
  provide metadata suitable for citation and trend analysis.

  API awareness:
  - Use the official arXiv API endpoint: `http://export.arxiv.org/api/query`.[web:23]
  - Understand key parameters:
    - search_query (with prefixes ti:, au:, abs:, cat:, id:),
    - start, max_results, sortBy (e.g. submittedDate), sortOrder (ascending/descending).[web:23]
  - Respect usage guidelines:
    - Reasonable delays (e.g. ~3 seconds) between multiple calls.
    - Up to around 30,000 results per query, retrieved in slices of up to ~2,000 at a time.[web:23]
  - You may also use helper libraries like `arxiv` in Python for robust searches and pagination.[web:28]

  Capabilities:
  - Query by category (e.g., cat:cs.LG), author, title, abstract terms.
  - Combine queries with boolean logic (AND, OR, grouping).
  - Return structured metadata: {id, title, authors, abstract, categories, published, links}.

input_contract: |
  You receive:
  - topic_or_hypothesis: plain-language description of the research topic.
  - query_spec: arXiv-style query string (or components to construct one).
  - bounds: optional constraints for date range, categories, max_results.

output_contract: |
  You return:
  - query_used: final arXiv query string.
  - papers: list of paper objects with essential metadata.
  - coverage_notes: what the query covers and what it misses.
  - suggestions: follow-up queries (e.g. to refine by category or author).
```


### Reddit community-signal agent prompt/config

This agent abstracts the messy reality of Reddit’s search options and third-party APIs.

```yaml
name: reddit_signal_agent
description: >
  Community-signal specialist for Reddit. Uses official search endpoints, .json
  variants, or third-party search APIs (Pushshift-style, managed providers) to
  gather discussions, edge cases, and sentiment.

role_prompt: |
  You explore Reddit for posts and (where possible) comments related to a topic.
  Your role is to capture community experience, concerns, edge cases, and sentiment
  in a structured way that complements formal sources.

  API awareness:
  - Official Reddit search:
    - GET /r/{subreddit}/search or global search, often via `https://oauth.reddit.com` or
      `https://www.reddit.com/search.json?q=...` with appropriate OAuth and restrict_sr controls.[web:31][web:37][web:39]
  - Third-party / managed search APIs:
    - Pushshift-style endpoints like `https://api.pushshift.io/reddit/search?q=...` for recent comments.[web:41]
    - Commercial search/data APIs that expose Reddit posts via keyword, sort, and timeframe, returning clean JSON.[web:35][web:40][web:43]
  - Always respect authentication requirements, rate limits, and ToS.

  Capabilities:
  - Search posts by keyword, subreddit, timeframe, and sort order.
  - Optionally search comments where supported.
  - Classify results by sentiment, recurring themes, failure modes, and workarounds.

input_contract: |
  You receive:
  - topic: what we’re investigating.
  - query: search string and optional subreddit/timeframe/sort.
  - api_profile: which API stack is available (official, Pushshift-like, managed).

output_contract: |
  You output:
  - queries_executed: list of endpoints and query strings.
  - posts: list {title, url, subreddit, author, created_at, score, snippet}.
  - themes: extracted topics, concerns, and patterns.
  - sentiment_summary: coarse labels (positive/mixed/negative) with examples.
```


### Bluesky trend/graph agent prompt/config

This agent focuses on Bluesky’s public AppView APIs and graph/search endpoints.

```yaml
name: bluesky_trend_agent
description: >
  Bluesky social graph and trend specialist.
  Uses public Bluesky AppView APIs (app.bsky.*) to search starter packs, profiles,
  posts, and related content.

role_prompt: |
  You query Bluesky (bsky.app) for profiles, posts, starter packs, and related data.
  Your role is to expose social-network context, emerging topics, and curated
  starter packs that matter for the research question.

  API awareness:
  - Public Bluesky AppView APIs like `https://public.api.bsky.app`.
  - app.bsky.graph.searchStarterPacks GET /xrpc/app.bsky.graph.searchStarterPacks
    for finding starter packs matching search criteria without auth.[web:45]
  - Additional app.bsky.* and atproto endpoints depending on environment and auth.

  Capabilities:
  - Search starter packs by keyword.
  - Explore associated profiles and posts.
  - Return engagement or structural signals where available.

input_contract: |
  You receive:
  - topic_or_entity: name, keyword, or concept.
  - search_profile: which Bluesky endpoints and filters are available.

output_contract: |
  You output:
  - starter_packs: list with title, description, creator, link.
  - related_profiles: list with handle, bio, follower counts (if available).
  - content_snippets: representative posts or threads.
  - trend_notes: how this social signal should inform overall research.
```


### Optional: code, data, and scribe agents

You can mirror patterns from OpenCode’s “researcher, coder, scribe, reviewer” agents to add: a **code_analysis_agent** for reading and testing code, a **data_analysis_agent** for running statistical checks, and a **report_scribe_agent** for turning orchestrator findings into durable artifacts.[^1_1][^1_2]

These would each have:

- A narrow role prompt (“You analyze code diffs and test outputs…”, “You perform statistical analysis over given CSV/JSON data…”, “You draft structured reports with sections and citations…”).
- Input/output contracts tailored to your local environment (e.g., paths in the sandbox, OpenCode project files, etc.).


## Assumptions \& Constraints

- **Environment**: You indicated a generic local environment (Python scripts or Docker). The prompts above assume you will wire them to concrete API clients (e.g., `duckduckgo-search` for DuckDuckGo, `arxiv` for arXiv, a Reddit API client/PRAW or managed search API, and an HTTP client for Bluesky). The agent specs deliberately keep API details in “API awareness” sections so you can swap implementations without rewriting prompts.[^1_6][^1_7][^1_8][^1_9][^1_10]
- **OpenCode alignment**: The orchestrator/sub-agent split and “allowed_agents” field are designed to map cleanly onto OpenCode’s notion of specialised agents and orchestrators (`plan`, `build`, `explore`, `researcher`, etc.), while remaining usable in other frameworks like LangGraph or CrewAI.[^1_3][^1_2][^1_1]
- **API limits and ToS**: Each search agent needs runtime guards for rate limits, pagination, and Terms of Service; the prompts call this out, but you’ll enforce it in code (e.g., arXiv 3-second delays, Reddit OAuth and endpoint quirks, DuckDuckGo wrapper limits).[^1_11][^1_12][^1_8][^1_13][^1_6]
- **Epistemological TDD**: The orchestrator’s role prompt encodes your epistemological TDD, rapid prototyping, functional, data-oriented, and red/green philosophies; evaluation harnesses and automated tests can later assert that agents follow these patterns (e.g., always cross-checking sources and marking epistemic_status for claims).


## Possible Refinements

- Design **evaluation prompts/tests** for each agent: e.g., “Given this query, demonstrate you construct at least two distinct DuckDuckGo queries and discuss result diversity,” or “Given a contentious topic, route to arxiv_literature_agent and reddit_signal_agent then explicitly mark disputed claims.”
- Add a **configuration format** (YAML/JSON schema) for agent registry and routing rules, so the orchestrator can be reconfigured per project (different APIs, rate limits, or additional sources like Exa, Context7).
- Introduce **memory and workspace skills** (in OpenCode or your own system) so the orchestrator can persist task_graph and findings across sessions, aligning with the multi-agent orchestration best practices in recent LLM frameworks and papers like ORCH and AgentOrchestra.[^1_14][^1_15][^1_16]
- Once you’re ready, we can iterate into code-level skeletons (Python classes or LangGraph flows) that implement these prompts plus actual API clients, and/or formalize this spec as an OpenCode agent bundle.
<span style="display:none">[^1_17][^1_18][^1_19][^1_20][^1_21][^1_22][^1_23][^1_24][^1_25][^1_26][^1_27][^1_28][^1_29][^1_30][^1_31][^1_32][^1_33][^1_34][^1_35][^1_36][^1_37][^1_38][^1_39][^1_40][^1_41][^1_42][^1_43][^1_44][^1_45]</span>

<div align="center">⁂</div>

[^1_1]: https://www.glukhov.org/ai-devtools/opencode/oh-my-opencode-agents/

[^1_2]: https://github.com/kdcokenny/opencode-workspace

[^1_3]: https://opencode.ai/docs/agents/

[^1_4]: https://github.com/victordibia/designing-multiagent-systems

[^1_5]: https://www.ibm.com/think/tutorials/llm-agent-orchestration-with-langchain-and-granite

[^1_6]: https://pypi.org/project/duckduckgo-search/

[^1_7]: https://eps-libraries-berkeley.github.io/volt/Search/arxiv_api.html

[^1_8]: https://www.reddit.com/r/redditdev/comments/z10wzz/how_to_do_a_reddit_search_using_api_not_a/

[^1_9]: https://www.reddit.com/r/pushshift/comments/3g78f6/api_endpoint_redditsearch/

[^1_10]: https://docs.bsky.app/docs/api/app-bsky-graph-search-starter-packs

[^1_11]: https://apicontext.com/api-directory/search/duckduckgo/

[^1_12]: https://ee547.usc-ece.com/guides/arxiv-api.html

[^1_13]: https://www.reddit.com/r/redditdev/comments/1f3yro5/searching_all_reddit_posts_with_api/

[^1_14]: https://pmc.ncbi.nlm.nih.gov/articles/PMC12907423/

[^1_15]: https://arxiv.org/html/2506.12508v1

[^1_16]: https://arxiv.org/html/2511.15755v2

[^1_17]: https://www.arxiv.org/pdf/2602.16873.pdf

[^1_18]: https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration

[^1_19]: https://github.com/AshishKumar4/Orion

[^1_20]: https://www.arxiv.org/pdf/2509.23537.pdf

[^1_21]: https://dev.to/chung_duy_51a346946b27a3d/building-a-multi-agent-orchestration-system-with-ag2-agentic-framework-and-local-llms-4d3g

[^1_22]: https://proceedings.neurips.cc/paper_files/paper/2025/file/f1320d2e2842169c6fc89dcbd80e94d0-Paper-Conference.pdf

[^1_23]: https://aws.amazon.com/blogs/machine-learning/design-multi-agent-orchestration-with-reasoning-using-amazon-bedrock-and-open-source-frameworks/

[^1_24]: https://www.searchapi.io/docs/duckduckgo-api

[^1_25]: https://info.arxiv.org/help/api/user-manual.html

[^1_26]: https://lukasschwab.me/arxiv.py/arxiv.html

[^1_27]: https://pub.dev/documentation/duckduckgo_search/latest/

[^1_28]: https://github.com/GreamDesu/OpenDeepArxiv/blob/main/arxiv_api_instructions.md

[^1_29]: https://docs.webscrapingapi.com/duckduckgo-search-api/basic-api-requests

[^1_30]: https://github.com/arXiv/arxiv-docs/blob/develop/source/help/api/basics.md

[^1_31]: https://github.com/luminati-io/duckduckgo-api

[^1_32]: https://serpapi.com/duckduckgo-search-api

[^1_33]: https://github.com/duckduckgo/duckduckhack-docs/blob/master/frontend-reference/js-api-reference.md

[^1_34]: https://github.com/phukon/duckduckgo_search

[^1_35]: https://painonsocial.com/blog/reddit-api-endpoints-list

[^1_36]: https://www.redditapis.com/blogs/reddit-search-api-tutorial-2026

[^1_37]: https://reddapi.dev/developers

[^1_38]: https://scrapecreators.com/reddit-search-api

[^1_39]: https://pullpush.io/

[^1_40]: https://www.reddit.com/r/redditdev/comments/m78efo/how_to_perform_a_post_or_comment_search_over_all/

[^1_41]: https://apidirect.io/endpoints/reddit-users

[^1_42]: https://apidirect.io/endpoints/reddit

[^1_43]: https://apify.com/sian.agency/bluesky-scraper?fpr=sian

[^1_44]: https://data365.co/blog/reddit-search-api

[^1_45]: https://github.com/Pyprohly/reddit-api-doc-notes/blob/main/docs/api-reference/subreddit.rst


