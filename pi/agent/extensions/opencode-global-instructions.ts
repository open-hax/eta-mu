import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const PI_OPMF_DIR = path.join(os.homedir(), ".pi", "agent", "operation-mindfuck");
const LEGACY_OPMF_DIR = path.join(os.homedir(), ".config", "opencode", "operation-mindfuck");

function resolveOpencodeOperationMindfuckDir(): string | undefined {
  if (fs.existsSync(PI_OPMF_DIR)) return PI_OPMF_DIR;
  if (fs.existsSync(LEGACY_OPMF_DIR)) return LEGACY_OPMF_DIR;
  return undefined;
}

function loadOpencodeOperationMindfuck(): string | undefined {
  const opmfDir = resolveOpencodeOperationMindfuckDir();
  if (!opmfDir) return undefined;

  const entries = fs.readdirSync(opmfDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".lisp"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  const parts: string[] = [];
  for (const file of files) {
    const filePath = path.join(opmfDir, file);
    const content = fs.readFileSync(filePath, "utf8").trimEnd();
    if (!content) continue;
    parts.push(`;; --- ${file} ---\n${content}`);
  }

  if (parts.length === 0) return undefined;

  return [
    "## OpenCode Global Instructions (operation-mindfuck)",
    "This block is appended after all AGENTS.md instructions and has priority on conflicts.",
    "",
    parts.join("\n\n"),
  ].join("\n");
}

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event) => {
    const opmf = loadOpencodeOperationMindfuck();
    if (!opmf) return;

    return {
      systemPrompt: `${event.systemPrompt}\n\n${opmf}`,
    };
  });
}
