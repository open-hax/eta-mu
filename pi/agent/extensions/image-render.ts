import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { extname, resolve } from "node:path";

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { type Static, Type } from "@sinclair/typebox";

const DEFAULT_MAX_BYTES = 8 * 1024 * 1024;

const TOOL_PARAMS = Type.Object({
  source: Type.String({
    description: "Local file path, http(s) URL, or data: URL to render.",
  }),
  mimeType: Type.Optional(
    Type.String({
      description: "Optional MIME type override (e.g. image/png).",
    }),
  ),
  maxBytes: Type.Optional(
    Type.Integer({
      description: `Maximum bytes to load (default ${DEFAULT_MAX_BYTES}).`,
      minimum: 1,
    }),
  ),
});

type ToolParams = Static<typeof TOOL_PARAMS>;

type ImagePayload = {
  data: string;
  mimeType: string;
  bytes: number;
  sourceLabel: string;
};

function expandHome(input: string): string {
  if (input.startsWith("~/")) {
    return resolve(homedir(), input.slice(2));
  }
  return input;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function mimeFromExtension(path: string): string | undefined {
  switch (extname(path).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".bmp":
      return "image/bmp";
    case ".tiff":
    case ".tif":
      return "image/tiff";
    default:
      return undefined;
  }
}

function parseDataUrl(source: string): { mimeType: string; data: string } {
  const match = /^data:([^;,]*)(;base64)?,(.*)$/i.exec(source);
  if (!match) {
    throw new Error("Invalid data URL format.");
  }
  const mimeType = match[1] || "application/octet-stream";
  const isBase64 = match[2] === ";base64";
  if (!isBase64) {
    throw new Error("Only base64-encoded data URLs are supported.");
  }
  const data = match[3] || "";
  return { mimeType, data };
}

async function loadImagePayload(params: ToolParams, cwd: string, signal?: AbortSignal): Promise<ImagePayload> {
  const source = params.source.trim();
  const maxBytes = params.maxBytes ?? DEFAULT_MAX_BYTES;

  if (source.startsWith("data:")) {
    const parsed = parseDataUrl(source);
    const buffer = Buffer.from(parsed.data, "base64");
    if (buffer.length > maxBytes) {
      throw new Error(`Image is ${formatBytes(buffer.length)} which exceeds maxBytes (${formatBytes(maxBytes)}).`);
    }
    return {
      data: parsed.data,
      mimeType: params.mimeType ?? parsed.mimeType,
      bytes: buffer.length,
      sourceLabel: "data URL",
    };
  }

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const response = await fetch(source, { signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch image (${response.status} ${response.statusText}).`);
    }
    const mimeType = params.mimeType ?? response.headers.get("content-type")?.split(";")[0]?.trim();
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > maxBytes) {
      throw new Error(`Image is ${formatBytes(buffer.length)} which exceeds maxBytes (${formatBytes(maxBytes)}).`);
    }
    if (!mimeType) {
      throw new Error("Unable to determine MIME type from response. Provide mimeType.");
    }
    return {
      data: buffer.toString("base64"),
      mimeType,
      bytes: buffer.length,
      sourceLabel: source,
    };
  }

  const expanded = expandHome(source.replace(/^file:\/\//i, ""));
  const resolved = resolve(cwd, expanded);
  const buffer = await readFile(resolved);
  if (buffer.length > maxBytes) {
    throw new Error(`Image is ${formatBytes(buffer.length)} which exceeds maxBytes (${formatBytes(maxBytes)}).`);
  }
  const mimeType = params.mimeType ?? mimeFromExtension(resolved);
  if (!mimeType) {
    throw new Error("Unable to infer MIME type from file extension. Provide mimeType.");
  }

  return {
    data: buffer.toString("base64"),
    mimeType,
    bytes: buffer.length,
    sourceLabel: resolved,
  };
}

export default function imageRenderExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "render_image",
    label: "Render image",
    description: "Render a local image file or URL in the TUI.",
    promptSnippet: "Render an image from a local path, URL, or data URL in the TUI.",
    promptGuidelines: [
      "Use this tool when the user asks to render or preview an image in the terminal.",
      "Prefer small images (default max 8MB) to avoid large tool payloads.",
    ],
    parameters: TOOL_PARAMS,
    async execute(_toolCallId, params: ToolParams, signal, onUpdate, ctx) {
      onUpdate?.({ content: [{ type: "text", text: "Loading image…" }] });
      const payload = await loadImagePayload(params, ctx.cwd, signal);
      return {
        content: [
          {
            type: "text",
            text: `Rendered image from ${payload.sourceLabel} (${payload.mimeType}, ${formatBytes(payload.bytes)}).`,
          },
          {
            type: "image",
            data: payload.data,
            mimeType: payload.mimeType,
          },
        ],
        details: {
          source: payload.sourceLabel,
          mimeType: payload.mimeType,
          bytes: payload.bytes,
        },
      };
    },
  });
}
