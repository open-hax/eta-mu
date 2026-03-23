import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { renderDiff } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { Text } from "@mariozechner/pi-tui";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as Diff from "diff";

// GPLv3 - produced under operation-mindfuck contract

type Hunk =
  | { type: "add"; filePath: string; contents: string }
  | { type: "delete"; filePath: string }
  | { type: "update"; filePath: string; movePath?: string; chunks: UpdateFileChunk[] };

type UpdateFileChunk = {
  old_lines: string[];
  new_lines: string[];
  change_context?: string;
  is_end_of_file?: boolean;
};

type PlannedChange =
  | { type: "add"; absPath: string; relPath: string; content: string }
  | { type: "delete"; absPath: string; relPath: string }
  | { type: "update"; absPath: string; relPath: string; content: string }
  | { type: "move"; absFrom: string; relFrom: string; absTo: string; relTo: string; content: string };

type ApplyPatchToolDetails = {
  root: string;
  changes: Array<{ type: PlannedChange["type"]; path: string; to?: string }>;
  /** Diff in the same line-numbered format as pi's built-in `edit` tool */
  diff?: string;
};

function stripHeredoc(input: string): string {
  // Matches heredoc patterns like:
  //   cat <<'EOF'\n...\nEOF
  //   <<EOF\n...\nEOF
  const m = input.match(/^(?:cat\s+)?<<['"]?(\w+)['"]?\s*\n([\s\S]*?)\n\1\s*$/);
  if (m) return m[2];
  return input;
}

function parsePatchHeader(
  lines: string[],
  startIdx: number,
): { filePath: string; movePath?: string; nextIdx: number; kind: "add" | "delete" | "update" } | null {
  const line = lines[startIdx];

  if (line.startsWith("*** Add File:")) {
    const filePath = line.slice("*** Add File:".length).trim();
    return filePath ? { kind: "add", filePath, nextIdx: startIdx + 1 } : null;
  }

  if (line.startsWith("*** Delete File:")) {
    const filePath = line.slice("*** Delete File:".length).trim();
    return filePath ? { kind: "delete", filePath, nextIdx: startIdx + 1 } : null;
  }

  if (line.startsWith("*** Update File:")) {
    const filePath = line.slice("*** Update File:".length).trim();
    let movePath: string | undefined;
    let nextIdx = startIdx + 1;

    if (nextIdx < lines.length && lines[nextIdx].startsWith("*** Move to:")) {
      movePath = lines[nextIdx].slice("*** Move to:".length).trim();
      nextIdx++;
    }

    return filePath ? { kind: "update", filePath, movePath, nextIdx } : null;
  }

  return null;
}

function parseAddFileContent(lines: string[], startIdx: number): { content: string; nextIdx: number } {
  let content = "";
  let i = startIdx;

  while (i < lines.length && !lines[i].startsWith("***")) {
    if (lines[i].startsWith("+")) {
      content += lines[i].slice(1) + "\n";
    }
    i++;
  }

  if (content.endsWith("\n")) content = content.slice(0, -1);
  return { content, nextIdx: i };
}

function parseUpdateFileChunks(lines: string[], startIdx: number): { chunks: UpdateFileChunk[]; nextIdx: number } {
  const chunks: UpdateFileChunk[] = [];
  let i = startIdx;

  while (i < lines.length && !lines[i].startsWith("***")) {
    if (!lines[i].startsWith("@@")) {
      i++;
      continue;
    }

    const contextLine = lines[i].slice(2).trim();
    i++;

    const oldLines: string[] = [];
    const newLines: string[] = [];
    let isEndOfFile = false;

    while (i < lines.length && !lines[i].startsWith("@@") && !lines[i].startsWith("***")) {
      const changeLine = lines[i];
      if (changeLine === "*** End of File") {
        isEndOfFile = true;
        i++;
        break;
      }

      if (changeLine.startsWith(" ")) {
        const content = changeLine.slice(1);
        oldLines.push(content);
        newLines.push(content);
      } else if (changeLine.startsWith("-")) {
        oldLines.push(changeLine.slice(1));
      } else if (changeLine.startsWith("+")) {
        newLines.push(changeLine.slice(1));
      }

      i++;
    }

    chunks.push({
      old_lines: oldLines,
      new_lines: newLines,
      change_context: contextLine || undefined,
      is_end_of_file: isEndOfFile || undefined,
    });
  }

  return { chunks, nextIdx: i };
}

function parsePatch(patchText: string): { hunks: Hunk[] } {
  const cleaned = stripHeredoc(patchText.trim());
  const lines = cleaned.split("\n");

  const beginMarker = "*** Begin Patch";
  const endMarker = "*** End Patch";

  const beginIdx = lines.findIndex((l) => l.trim() === beginMarker);
  const endIdx = lines.findIndex((l) => l.trim() === endMarker);

  if (beginIdx === -1 || endIdx === -1 || beginIdx >= endIdx) {
    throw new Error("Invalid patch format: missing Begin/End markers");
  }

  const hunks: Hunk[] = [];
  let i = beginIdx + 1;

  while (i < endIdx) {
    const header = parsePatchHeader(lines, i);
    if (!header) {
      i++;
      continue;
    }

    if (header.kind === "add") {
      const { content, nextIdx } = parseAddFileContent(lines, header.nextIdx);
      hunks.push({ type: "add", filePath: header.filePath, contents: content });
      i = nextIdx;
      continue;
    }

    if (header.kind === "delete") {
      hunks.push({ type: "delete", filePath: header.filePath });
      i = header.nextIdx;
      continue;
    }

    // update
    const { chunks, nextIdx } = parseUpdateFileChunks(lines, header.nextIdx);
    hunks.push({
      type: "update",
      filePath: header.filePath,
      movePath: header.movePath,
      chunks,
    });
    i = nextIdx;
  }

  return { hunks };
}

function normalizeUnicode(str: string): string {
  return str
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");
}

function normalizeToLF(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function stripBom(text: string): string {
  return text.startsWith("\uFEFF") ? text.slice(1) : text;
}

/**
 * Port of pi's internal edit-diff formatter.
 * Produces lines like:
 *   "+ 12 added"
 *   "- 10 removed"
 *   "  11 context"
 */
function generateDiffString(oldContent: string, newContent: string, contextLines = 4): { diff: string } {
  const parts = Diff.diffLines(oldContent, newContent);
  const output: string[] = [];

  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");
  const maxLineNum = Math.max(oldLines.length, newLines.length);
  const lineNumWidth = String(maxLineNum).length;

  let oldLineNum = 1;
  let newLineNum = 1;
  let lastWasChange = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const raw = part.value.split("\n");
    if (raw[raw.length - 1] === "") raw.pop();

    if (part.added || part.removed) {
      for (const line of raw) {
        if (part.added) {
          const lineNum = String(newLineNum).padStart(lineNumWidth, " ");
          output.push(`+${lineNum} ${line}`);
          newLineNum++;
        } else {
          const lineNum = String(oldLineNum).padStart(lineNumWidth, " ");
          output.push(`-${lineNum} ${line}`);
          oldLineNum++;
        }
      }
      lastWasChange = true;
    } else {
      const nextPartIsChange = i < parts.length - 1 && (parts[i + 1].added || parts[i + 1].removed);

      if (lastWasChange || nextPartIsChange) {
        let linesToShow = raw;
        let skipStart = 0;
        let skipEnd = 0;

        if (!lastWasChange) {
          skipStart = Math.max(0, raw.length - contextLines);
          linesToShow = raw.slice(skipStart);
        }

        if (!nextPartIsChange && linesToShow.length > contextLines) {
          skipEnd = linesToShow.length - contextLines;
          linesToShow = linesToShow.slice(0, contextLines);
        }

        if (skipStart > 0) {
          output.push(` ${"".padStart(lineNumWidth, " ")} ...`);
          oldLineNum += skipStart;
          newLineNum += skipStart;
        }

        for (const line of linesToShow) {
          const lineNum = String(oldLineNum).padStart(lineNumWidth, " ");
          output.push(` ${lineNum} ${line}`);
          oldLineNum++;
          newLineNum++;
        }

        if (skipEnd > 0) {
          output.push(` ${"".padStart(lineNumWidth, " ")} ...`);
          oldLineNum += skipEnd;
          newLineNum += skipEnd;
        }
      } else {
        oldLineNum += raw.length;
        newLineNum += raw.length;
      }

      lastWasChange = false;
    }
  }

  return { diff: output.join("\n") };
}

async function safeReadUtf8(absPath: string): Promise<string | null> {
  try {
    return await fs.readFile(absPath, "utf-8");
  } catch {
    return null;
  }
}

async function computePlanDiff(plan: PlannedChange[]): Promise<string> {
  const sections: string[] = [];

  for (const change of plan) {
    let header = "";
    let oldContent = "";
    let newContent = "";

    if (change.type === "add") {
      header = `# A ${change.relPath}`;
      oldContent = "";
      newContent = change.content;
    } else if (change.type === "update") {
      header = `# M ${change.relPath}`;
      oldContent = (await safeReadUtf8(change.absPath)) ?? "";
      newContent = change.content;
    } else if (change.type === "delete") {
      header = `# D ${change.relPath}`;
      oldContent = (await safeReadUtf8(change.absPath)) ?? "";
      newContent = "";
    } else if (change.type === "move") {
      header = `# R ${change.relFrom} -> ${change.relTo}`;
      oldContent = (await safeReadUtf8(change.absFrom)) ?? "";
      newContent = change.content;
    }

    const oldNorm = normalizeToLF(stripBom(oldContent));
    const newNorm = normalizeToLF(stripBom(newContent));
    const diff = generateDiffString(oldNorm, newNorm).diff;

    sections.push(header);
    sections.push(diff.trim() ? diff : "  (no content changes)");
    sections.push("");
  }

  return sections.join("\n").trimEnd();
}

type Comparator = (a: string, b: string) => boolean;

function tryMatch(
  lines: string[],
  pattern: string[],
  startIndex: number,
  compare: Comparator,
  eof: boolean,
): number {
  if (eof) {
    const fromEnd = lines.length - pattern.length;
    if (fromEnd >= startIndex) {
      let matches = true;
      for (let j = 0; j < pattern.length; j++) {
        if (!compare(lines[fromEnd + j], pattern[j])) {
          matches = false;
          break;
        }
      }
      if (matches) return fromEnd;
    }
  }

  for (let i = startIndex; i <= lines.length - pattern.length; i++) {
    let matches = true;
    for (let j = 0; j < pattern.length; j++) {
      if (!compare(lines[i + j], pattern[j])) {
        matches = false;
        break;
      }
    }
    if (matches) return i;
  }

  return -1;
}

function seekSequence(lines: string[], pattern: string[], startIndex: number, eof = false): number {
  if (pattern.length === 0) return -1;

  const exact = tryMatch(lines, pattern, startIndex, (a, b) => a === b, eof);
  if (exact !== -1) return exact;

  const rstrip = tryMatch(lines, pattern, startIndex, (a, b) => a.trimEnd() === b.trimEnd(), eof);
  if (rstrip !== -1) return rstrip;

  const trim = tryMatch(lines, pattern, startIndex, (a, b) => a.trim() === b.trim(), eof);
  if (trim !== -1) return trim;

  return tryMatch(
    lines,
    pattern,
    startIndex,
    (a, b) => normalizeUnicode(a.trim()) === normalizeUnicode(b.trim()),
    eof,
  );
}

function computeReplacements(
  originalLines: string[],
  absPath: string,
  chunks: UpdateFileChunk[],
): Array<[number, number, string[]]> {
  const replacements: Array<[number, number, string[]]> = [];
  let lineIndex = 0;

  for (const chunk of chunks) {
    if (chunk.change_context) {
      const ctxIdx = seekSequence(originalLines, [chunk.change_context], lineIndex);
      if (ctxIdx === -1) throw new Error(`Failed to find context '${chunk.change_context}' in ${absPath}`);
      lineIndex = ctxIdx + 1;
    }

    // Pure add
    if (chunk.old_lines.length === 0) {
      replacements.push([originalLines.length, 0, chunk.new_lines]);
      continue;
    }

    let pattern = chunk.old_lines;
    let newSlice = chunk.new_lines;
    let found = seekSequence(originalLines, pattern, lineIndex, Boolean(chunk.is_end_of_file));

    // retry without trailing empty line
    if (found === -1 && pattern.length > 0 && pattern[pattern.length - 1] === "") {
      pattern = pattern.slice(0, -1);
      if (newSlice.length > 0 && newSlice[newSlice.length - 1] === "") newSlice = newSlice.slice(0, -1);
      found = seekSequence(originalLines, pattern, lineIndex, Boolean(chunk.is_end_of_file));
    }

    if (found === -1) {
      throw new Error(`Failed to find expected lines in ${absPath}:\n${chunk.old_lines.join("\n")}`);
    }

    replacements.push([found, pattern.length, newSlice]);
    lineIndex = found + pattern.length;
  }

  replacements.sort((a, b) => a[0] - b[0]);
  return replacements;
}

function applyReplacements(lines: string[], replacements: Array<[number, number, string[]]>): string[] {
  const result = [...lines];

  // reverse order to avoid index shifts
  for (let i = replacements.length - 1; i >= 0; i--) {
    const [startIdx, oldLen, newSegment] = replacements[i];
    result.splice(startIdx, oldLen);
    result.splice(startIdx, 0, ...newSegment);
  }

  return result;
}

async function deriveNewContent(absPath: string, chunks: UpdateFileChunk[]): Promise<string> {
  const originalContent = await fs.readFile(absPath, "utf-8");
  let originalLines = originalContent.split("\n");

  // drop trailing empty element for consistent matching
  if (originalLines.length > 0 && originalLines[originalLines.length - 1] === "") {
    originalLines = originalLines.slice(0, -1);
  }

  const replacements = computeReplacements(originalLines, absPath, chunks);
  let newLines = applyReplacements(originalLines, replacements);

  // Ensure trailing newline
  if (newLines.length === 0 || newLines[newLines.length - 1] !== "") {
    newLines = [...newLines, ""];
  }

  return newLines.join("\n");
}

function isSubpath(root: string, target: string): boolean {
  const rel = path.relative(root, target);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

function resolveAndValidate(root: string, patchPath: string): { absPath: string; relPath: string } {
  const absPath = path.isAbsolute(patchPath) ? patchPath : path.resolve(root, patchPath);

  // Allow exact root file? (root itself may be a dir). For safety: enforce within root.
  const inside = absPath === root || isSubpath(root, absPath);
  if (!inside) {
    throw new Error(`Path escapes project root. root=${root} path=${patchPath} resolved=${absPath}`);
  }

  const relPath = path.relative(root, absPath).replaceAll("\\", "/");
  return { absPath, relPath: relPath === "" ? path.basename(absPath) : relPath };
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function isGptLikeModel(model: any | undefined): boolean {
  if (!model) return false;
  const provider = String(model.provider ?? "");
  const id = String(model.id ?? "");
  if (!provider.includes("openai") && !provider.includes("azure")) return false;

  // Mirror OpenCode's heuristic loosely: GPT models (not oss, not legacy gpt-4)
  // Users can override via env vars.
  if (!id.includes("gpt-")) return false;
  if (id.includes("oss")) return false;
  if (id.includes("gpt-4")) return false;
  return true;
}

function maybePreferApplyPatchForModel(pi: ExtensionAPI, model: any | undefined) {
  const prefer = process.env.PI_APPLY_PATCH_PREFER_FOR_GPT === "1";
  const disableEditWrite = process.env.PI_APPLY_PATCH_DISABLE_EDIT_WRITE_FOR_GPT === "1";
  if (!prefer) return;
  if (!isGptLikeModel(model)) return;

  const active = new Set(pi.getActiveTools());
  active.add("apply_patch");
  if (disableEditWrite) {
    active.delete("edit");
    active.delete("write");
  }
  pi.setActiveTools(Array.from(active));
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_e, ctx) => {
    maybePreferApplyPatchForModel(pi, ctx.model);
  });

  pi.on("model_select", async (e, _ctx) => {
    maybePreferApplyPatchForModel(pi, e.model);
  });

  pi.registerTool({
    name: "apply_patch",
    label: "apply_patch",
    description:
      "Apply a multi-file patch using the Codex/Claude patch format (*** Begin Patch / *** End Patch). This is often more reliable than repeated edit/write calls for GPT models.",
    promptSnippet: "Apply a Codex-style multi-file patch (*** Begin Patch / *** End Patch)",
    promptGuidelines: [
      "Use apply_patch for multi-file changes or when GPT models struggle with edit/write.",
      "Always include *** Begin Patch and *** End Patch markers.",
      "Use file paths relative to the current working directory unless you have a strong reason.",
    ],
    parameters: Type.Object({
      patchText: Type.String({
        description:
          "The full patch text including *** Begin Patch and *** End Patch markers and file directives.",
      }),
    }),

    renderCall(args, theme) {
      // Parse very defensively; call rendering must never throw.
      let files = 0;
      try {
        const parsed = parsePatch(String(args?.patchText ?? ""));
        files = parsed.hunks.length;
      } catch {
        // ignore
      }

      let text = theme.fg("toolTitle", theme.bold("apply_patch"));
      if (files > 0) {
        text += theme.fg("dim", ` (${files} file${files === 1 ? "" : "s"})`);
      }
      return new Text(text, 0, 0);
    },

    renderResult(result, { expanded, isPartial }, theme) {
      if (isPartial) return new Text(theme.fg("warning", "Applying patch..."), 0, 0);

      const details = result.details as ApplyPatchToolDetails | undefined;
      const diff = details?.diff ?? "";
      const changes = details?.changes ?? [];

      // Error: fall back to first line of returned text
      const content0 = result.content?.[0];
      if (content0?.type === "text" && content0.text.startsWith("Error")) {
        return new Text(theme.fg("error", content0.text.split("\n")[0] ?? "Error"), 0, 0);
      }

      const changeLines = changes.map((c) => {
        if (c.type === "add") return `A ${c.path}`;
        if (c.type === "delete") return `D ${c.path}`;
        if (c.type === "move") return `R ${c.path} -> ${c.to ?? "?"}`;
        return `M ${c.path}`;
      });

      const diffLines = diff ? diff.split("\n") : [];
      let additions = 0;
      let removals = 0;
      for (const line of diffLines) {
        if (line.startsWith("+")) additions++;
        if (line.startsWith("-")) removals++;
      }

      let text = "";
      if (diff) {
        text += theme.fg("success", `+${additions}`);
        text += theme.fg("dim", " / ");
        text += theme.fg("error", `-${removals}`);
      } else {
        text += theme.fg("success", "Applied");
      }

      if (changeLines.length) {
        const max = expanded ? changeLines.length : Math.min(8, changeLines.length);
        text += `\n${theme.fg("dim", changeLines.slice(0, max).join("\n"))}`;
        if (!expanded && changeLines.length > max) {
          text += `\n${theme.fg("muted", `... ${changeLines.length - max} more file changes`)}`;
        }
      }

      if (diff) {
        const maxDiffLines = expanded ? diffLines.length : Math.min(60, diffLines.length);
        const shown = diffLines.slice(0, maxDiffLines).join("\n");
        text += `\n\n${renderDiff(shown)}`;
        if (!expanded && diffLines.length > maxDiffLines) {
          text += `\n${theme.fg("muted", `... ${diffLines.length - maxDiffLines} more diff lines`)}`;
        }
      }

      return new Text(text, 0, 0);
    },

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      if (signal?.aborted) throw new Error("aborted");

      const root = ctx.cwd;
      const { hunks } = parsePatch(params.patchText);
      if (hunks.length === 0) throw new Error("Empty patch (no hunks)");

      const plan: PlannedChange[] = [];

      // Validate + plan
      for (const hunk of hunks) {
        if (signal?.aborted) throw new Error("aborted");

        if (hunk.type === "add") {
          const { absPath, relPath } = resolveAndValidate(root, hunk.filePath);
          if (await exists(absPath)) {
            throw new Error(`Add File failed: target already exists: ${relPath}`);
          }
          plan.push({ type: "add", absPath, relPath, content: hunk.contents });
          continue;
        }

        if (hunk.type === "delete") {
          const { absPath, relPath } = resolveAndValidate(root, hunk.filePath);
          if (!(await exists(absPath))) {
            throw new Error(`Delete File failed: file does not exist: ${relPath}`);
          }
          plan.push({ type: "delete", absPath, relPath });
          continue;
        }

        // update/move
        const from = resolveAndValidate(root, hunk.filePath);
        if (!(await exists(from.absPath))) {
          throw new Error(`Update File failed: file does not exist: ${from.relPath}`);
        }

        const newContent = await deriveNewContent(from.absPath, hunk.chunks);

        if (hunk.movePath) {
          const to = resolveAndValidate(root, hunk.movePath);
          if (await exists(to.absPath)) {
            throw new Error(`Move failed: destination already exists: ${to.relPath}`);
          }
          plan.push({
            type: "move",
            absFrom: from.absPath,
            relFrom: from.relPath,
            absTo: to.absPath,
            relTo: to.relPath,
            content: newContent,
          });
        } else {
          plan.push({ type: "update", absPath: from.absPath, relPath: from.relPath, content: newContent });
        }
      }

      // Compute diff before applying (so we capture the original state)
      const diff = await computePlanDiff(plan);

      // Apply (best effort). This is not transactional.
      const changes: Array<{ type: PlannedChange["type"]; path: string; to?: string }> = [];

      for (const change of plan) {
        if (signal?.aborted) throw new Error("aborted");

        if (change.type === "add") {
          await fs.mkdir(path.dirname(change.absPath), { recursive: true });
          await fs.writeFile(change.absPath, change.content, "utf-8");
          changes.push({ type: "add", path: change.relPath });
          continue;
        }

        if (change.type === "update") {
          await fs.writeFile(change.absPath, change.content, "utf-8");
          changes.push({ type: "update", path: change.relPath });
          continue;
        }

        if (change.type === "move") {
          await fs.mkdir(path.dirname(change.absTo), { recursive: true });
          await fs.writeFile(change.absTo, change.content, "utf-8");
          await fs.unlink(change.absFrom);
          changes.push({ type: "move", path: change.relFrom, to: change.relTo });
          continue;
        }

        if (change.type === "delete") {
          await fs.unlink(change.absPath);
          changes.push({ type: "delete", path: change.relPath });
          continue;
        }
      }

      const summary = changes
        .map((c) => {
          if (c.type === "add") return `A ${c.path}`;
          if (c.type === "delete") return `D ${c.path}`;
          if (c.type === "move") return `M ${c.to ?? c.path} (from ${c.path})`;
          return `M ${c.path}`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: diff
              ? `Success. Updated the following files:\n${summary}\n\nDiff:\n${diff}`
              : `Success. Updated the following files:\n${summary}`,
          },
        ],
        details: {
          root,
          changes,
          diff,
        } as ApplyPatchToolDetails,
      };
    },
  });
}
