import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import {
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  formatSize,
  truncateHead,
} from "@mariozechner/pi-coding-agent";
import { StringEnum } from "@mariozechner/pi-ai";
import { Type, type Static } from "@sinclair/typebox";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const DEFAULT_PROXY_URL = "http://127.0.0.1:8789";
const DEFAULT_MODEL = "openai/gpt-5.3-codex";

const WebSearchParamsSchema = Type.Object({
  query: Type.String({ description: "Web search query" }),
  numResults: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 20,
      description: "How many results to ask the proxy to return (default: 8)",
    }),
  ),
  searchContextSize: Type.Optional(
    StringEnum(["low", "medium", "high"] as const, {
      description: "How much context the upstream web_search tool should retrieve (default: medium)",
    }),
  ),
  allowedDomains: Type.Optional(
    Type.Array(Type.String(), {
      description: "Optional allow-list of domains (best effort)",
    }),
  ),
  model: Type.Optional(
    Type.String({
      description: `Model ID to use (default: ${DEFAULT_MODEL}).`,
    }),
  ),
});

type WebSearchParams = Static<typeof WebSearchParamsSchema>;

async function writeTemp(text: string): Promise<string> {
  const dir = path.join(os.tmpdir(), "pi-websearch");
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `websearch-${Date.now()}.md`);
  await fs.writeFile(file, text, "utf-8");
  return file;
}

function formatSourcesMd(sources: Array<{ url: string; title?: string }>): string {
  if (!Array.isArray(sources) || sources.length === 0) return "";
  return [
    "\n\nSources:",
    ...sources
      .filter((s) => s && typeof s.url === "string")
      .map((s) => `- ${typeof s.title === "string" ? `[${s.title}](${s.url})` : s.url}`),
  ].join("\n");
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "websearch",
    label: "Web Search (Open Hax)",
    description:
      "Search the web via services/open-hax-openai-proxy using stored OpenAI OAuth logins (no OPENAI_API_KEY needed).",
    promptSnippet:
      "Search the web via the Open Hax proxy (OAuth-backed) and return concise results.",
    promptGuidelines: [
      "Requires OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN (or PROXY_AUTH_TOKEN) to be set.",
      "Default proxy URL is http://127.0.0.1:8789 (override with OPEN_HAX_OPENAI_PROXY_URL).",
    ],
    parameters: WebSearchParamsSchema,

    async execute(_toolCallId, params: WebSearchParams, signal, onUpdate) {
      const proxyUrl =
        process.env.OPEN_HAX_OPENAI_PROXY_URL ??
        process.env.OPEN_HAX_PROXY_URL ??
        DEFAULT_PROXY_URL;

      const token =
        process.env.OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN ??
        process.env.OPEN_HAX_PROXY_AUTH_TOKEN ??
        process.env.PROXY_AUTH_TOKEN;

      if (!token) {
        throw new Error(
          "Missing auth token for Open Hax proxy. Set OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN (or PROXY_AUTH_TOKEN).",
        );
      }

      const endpoint = `${proxyUrl.replace(/\/+$/, "")}/api/tools/websearch`;
      const model = params.model ?? process.env.OPEN_HAX_WEBSEARCH_MODEL ?? DEFAULT_MODEL;

      onUpdate?.({
        content: [{ type: "text", text: `Calling Open Hax websearch... (${endpoint})` }],
        details: { status: "starting", endpoint, model },
      });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: params.query,
          numResults: params.numResults,
          searchContextSize: params.searchContextSize,
          allowedDomains: params.allowedDomains,
          model,
        }),
        signal,
      });

      const raw = await res.text();
      if (!res.ok) {
        throw new Error(`Open Hax websearch error (${res.status} ${res.statusText}): ${raw.slice(0, 2000)}`);
      }

      let json: any;
      try {
        json = JSON.parse(raw);
      } catch {
        throw new Error(`Open Hax websearch returned non-JSON: ${raw.slice(0, 2000)}`);
      }

      const text = typeof json?.output === "string" ? json.output : "";
      const sources = Array.isArray(json?.sources) ? json.sources : [];
      const combined = `${text}${formatSourcesMd(sources)}`.trim();

      const trunc = truncateHead(combined, {
        maxBytes: DEFAULT_MAX_BYTES,
        maxLines: DEFAULT_MAX_LINES,
      });

      let output = trunc.content;
      let outputPath: string | undefined;

      if (trunc.truncated) {
        outputPath = await writeTemp(combined);
        output += `\n\n[Output truncated: ${trunc.outputLines} of ${trunc.totalLines} lines (${formatSize(
          trunc.outputBytes,
        )} of ${formatSize(trunc.totalBytes)}). Full output saved to: ${outputPath}]`;
      }

      return {
        content: [{ type: "text", text: output }],
        details: {
          backend: "open-hax-openai-proxy",
          endpoint,
          model,
          responseId: typeof json?.responseId === "string" ? json.responseId : undefined,
          sourcesCount: sources.length,
          truncated: trunc.truncated,
          ...(outputPath ? { outputPath } : undefined),
        },
      };
    },
  });
}
