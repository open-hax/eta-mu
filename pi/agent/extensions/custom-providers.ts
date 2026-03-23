import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const openHaxBaseUrl = (
    process.env.OPEN_HAX_OPENAI_PROXY_URL ??
    process.env.OPEN_HAX_PROXY_URL ??
    "http://127.0.0.1:8789"
  ).replace(/\/+$/u, "");
  const openHaxApiBaseUrl = openHaxBaseUrl.endsWith("/v1")
    ? openHaxBaseUrl
    : `${openHaxBaseUrl}/v1`;
  const openHaxToken =
    process.env.OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN ??
    process.env.PROXY_AUTH_TOKEN ??
    process.env.OPEN_HAX_AUTH_TOKEN ??
    "change-me-open-hax-proxy-token";

  const openHaxGptModels = [
    {
      id: "gpt-5.4",
      name: "GPT 5.4",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 800000,
      maxTokens: 128000,
    },
    {
      id: "gpt-5.2",
      name: "GPT 5.2",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 272000,
      maxTokens: 128000,
    },
    {
      id: "gpt-5.2-codex",
      name: "GPT 5.2 codex",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 272000,
      maxTokens: 128000,
    },
  ] as const;

  const openHaxFactoryModels = [
    {
      id: "claude-haiku-4-5-20251001",
      name: "Claude Haiku 4.5 (Factory)",
      reasoning: false,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 8192,
    },
    {
      id: "claude-sonnet-4-5-20250929",
      name: "Claude Sonnet 4.5 (Factory)",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 16384,
    },
    {
      id: "claude-sonnet-4-6",
      name: "Claude Sonnet 4.6 (Factory)",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 16384,
    },
    {
      id: "claude-opus-4-5-20251101",
      name: "Claude Opus 4.5 (Factory)",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 32000,
    },
    {
      id: "factory/claude-opus-4-6",
      name: "Claude Opus 4.6 (Factory)",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 32000,
    },
    {
      id: "factory/claude-opus-4-6-fast",
      name: "Claude Opus 4.6 Fast (Factory)",
      reasoning: true,
      input: ["text", "image"],
      output: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 32000,
    },
  ] as const;

  pi.registerProvider("anthropic", {
    baseUrl: "https://api.z.ai/api/anthropic",
  });

  pi.registerProvider("open-hax", {
    baseUrl: openHaxApiBaseUrl,
    apiKey: openHaxToken,
    api: "openai-responses",
    models: [...openHaxGptModels],
  });

  pi.registerProvider("open-hax-responses", {
    baseUrl: openHaxApiBaseUrl,
    apiKey: openHaxToken,
    api: "openai-responses",
    models: [...openHaxGptModels],
  });

  pi.registerProvider("open-hax-completions", {
    baseUrl: openHaxApiBaseUrl,
    apiKey: openHaxToken,
    api: "openai-completions",
    models: [...openHaxGptModels, ...openHaxFactoryModels],
  });

  pi.registerProvider("open-hax-compat", {
    baseUrl: openHaxApiBaseUrl,
    apiKey: openHaxToken,
    api: "openai-completions",
    models: [
      {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash Preview",
        reasoning: false,
        input: ["text", "image"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "gemini-3-pro-preview",
        name: "Gemini 3 Pro Preview",
        reasoning: false,
        input: ["text", "image"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        reasoning: false,
        input: ["text", "image"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        reasoning: false,
        input: ["text", "image"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "gemini-3.1-pro-preview",
        name: "Gemini 3.1 Pro Preview",
        reasoning: false,
        input: ["text", "image"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "DeepSeek-V3.2",
        name: "DeepSeek V3.2",
        reasoning: false,
        input: ["text"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 64000,
        maxTokens: 8192,
      },
      {
        id: "glm-5",
        name: "GLM 5",
        reasoning: false,
        input: ["text"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 131072,
        maxTokens: 16384,
      },
      {
        id: "Kimi-K2.5",
        name: "Kimi K2.5",
        reasoning: false,
        input: ["text", "image"],
        output: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 262144,
        maxTokens: 262144,
      },
    ],
  });
}
