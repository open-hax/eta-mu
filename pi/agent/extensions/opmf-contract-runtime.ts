import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import * as crypto from "node:crypto";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

const HOME = os.homedir();
const PI_HOME = path.join(HOME, ".pi");
const OPMF_DIR = path.join(PI_HOME, "agent", "operation-mindfuck");
const LEGACY_OPMF_DIR = path.join(HOME, ".config", "opencode", "operation-mindfuck");
const LINT_DIR = path.join(HOME, ".config", "opencode", "lint");
const PI_SETTINGS_FILE = path.join(HOME, ".pi", "agent", "settings.json");
const PRIMARY_SKILL_ROOT = path.join(PI_HOME, "agent", "skills");
const COMMON_EXTERNAL_SKILL_ROOTS = [
  path.join(HOME, ".codex", "skills"),
  path.join(HOME, ".codex", "vendor_imports", "skills", "skills", ".curated"),
  path.join(HOME, ".claude", "skills"),
  PRIMARY_SKILL_ROOT,
];

function expandTilde(p: string): string {
  if (p.startsWith("~/")) return path.join(HOME, p.slice(2));
  return p;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function listFilesRecursive(root: string, opts: { filename?: string; ext?: string; maxDepth: number }): string[] {
  const out: string[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > opts.maxDepth) return;
    let ents: fs.Dirent[];
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of ents) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(p, depth + 1);
        continue;
      }
      if (opts.filename && ent.name === opts.filename) out.push(p);
      else if (opts.ext && ent.name.endsWith(opts.ext)) out.push(p);
    }
  };
  walk(root, 0);
  return out;
}

function runBb(code: string, args: string[]): { status: number; stdout: string; stderr: string } {
  const r = spawnSync("bb", ["-e", code, ...args], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    status: r.status ?? 1,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
  };
}

function loadConfiguredSkillRoots(): string[] {
  const roots = new Set<string>([PRIMARY_SKILL_ROOT, ...COMMON_EXTERNAL_SKILL_ROOTS]);

  try {
    if (!fs.existsSync(PI_SETTINGS_FILE)) return Array.from(roots);

    const raw = JSON.parse(fs.readFileSync(PI_SETTINGS_FILE, "utf8"));
    if (!isRecord(raw) || !Array.isArray(raw.skills)) return Array.from(roots);

    for (const entry of raw.skills) {
      if (typeof entry !== "string" || entry.trim().length === 0) continue;
      roots.add(expandTilde(entry));
    }
  } catch {
    // Keep the default root if settings are unreadable.
  }

  return Array.from(roots);
}

function discoverContractFiles(): string[] {
  const files = new Set<string>();

  for (const root of loadConfiguredSkillRoots()) {
    if (!fs.existsSync(root)) continue;
    for (const file of listFilesRecursive(root, { filename: "CONTRACT.edn", maxDepth: 4 })) {
      files.add(file);
    }
  }

  return Array.from(files).sort();
}

type LintRow = {
  kind: string;
  file: string;
  ok: boolean;
  forms?: number;
  error?: string;
  sha256?: string;
  time: string;
};

function lintEdnFiles(kind: string, files: string[]): LintRow[] {
  if (files.length === 0) return [];

  const code = `
(require '[clojure.edn :as edn])
(require '[cheshire.core :as json])
(import '[java.io PushbackReader StringReader])

(defn read-forms [s]
  (let [r (PushbackReader. (StringReader. s))]
    (loop [n 0]
      (let [x (edn/read {:eof ::eof} r)]
        (if (= x ::eof) n (recur (inc n)))))))

(def kind (first *command-line-args*))
(def files (rest *command-line-args*))
(doseq [f files]
  (try
    (let [s (slurp f)
          n (read-forms s)
          row {:kind kind :file f :ok true :forms n}]
      (println (json/generate-string row)))
    (catch Exception e
      (println (json/generate-string {:kind kind :file f :ok false :error (.getMessage e)})))))
`;

  const r = runBb(code, [kind, ...files]);
  const rows: LintRow[] = [];
  for (const line of r.stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      rows.push({
        kind: parsed.kind,
        file: parsed.file,
        ok: !!parsed.ok,
        forms: parsed.forms,
        error: parsed.error,
        time: new Date().toISOString(),
      });
    } catch {
      // ignore non-json noise
    }
  }
  if (r.status !== 0 && rows.length === 0) {
    // Total failure
    rows.push({
      kind,
      file: "<bb>",
      ok: false,
      error: r.stderr || r.stdout || `bb exited ${r.status}`,
      time: new Date().toISOString(),
    });
  }
  return rows;
}

type SkillNode = {
  name: string;
  v?: string;
  contract: string;
  exposes: { name: string; contract?: string; priority?: number }[];
};

function buildSkillGraphFromContracts(contractFiles: string[]): { nodes: SkillNode[]; errors: string[] } {
  if (contractFiles.length === 0) return { nodes: [], errors: [] };

  const code = `
(require '[clojure.edn :as edn])
(require '[cheshire.core :as json])
(import '[java.io PushbackReader StringReader])

(defn read-all-forms [s]
  (let [r (PushbackReader. (StringReader. s))]
    (loop [acc []]
      (let [x (edn/read {:eof ::eof} r)]
        (if (= x ::eof) acc (recur (conj acc x)))))))

(defn clause-map [clauses]
  ;; clauses are lists like (name "x"), (v "...") etc.
  (reduce
    (fn [m c]
      (if (and (sequential? c) (symbol? (first c)))
        (assoc m (first c) (rest c))
        m))
    {} clauses))

(defn parse-entry [entry]
  (let [m (clause-map (rest entry))
        nm (first (get m 'name))
        ct (first (get m 'contract))
        pr (first (get m 'priority))]
    {:name nm :contract ct :priority pr}))

(defn parse-exposes [clauses]
  (let [m (clause-map clauses)
        ex (first (get m 'exposes))]
    (if (and (sequential? ex) (= 'skill-registry (first ex)))
      (let [entries (filter #(and (sequential? %) (= 'entry (first %))) (rest ex))]
        (mapv parse-entry entries))
      [])))

(defn first-skill-contract [forms]
  (first (filter #(and (sequential? %) (= 'skill-contract (first %))) forms)))

(defn parse-contract-file [f]
  (let [forms (read-all-forms (slurp f))
        sc (first-skill-contract forms)]
    (if (nil? sc)
      {:error (str "no skill-contract form in " f)}
      (let [m (clause-map (rest sc))
            nm (first (get m 'name))
            vv (first (get m 'v))
            ex (parse-exposes (rest sc))]
        {:node {:name nm :v vv :contract f :exposes ex}}))))

(def files *command-line-args*)
(def results
  (mapv
    (fn [f]
      (try
        (parse-contract-file f)
        (catch Exception e
          {:error (str f ": " (.getMessage e))})))
    files))
(def nodes (->> results (map :node) (remove nil?) vec))
(def errors (->> results (map :error) (remove nil?) vec))
(println (json/generate-string {:nodes nodes :errors errors}))
`;

  const r = runBb(code, contractFiles);
  if (r.status !== 0) {
    return { nodes: [], errors: [r.stderr || r.stdout || `bb exited ${r.status}`] };
  }
  try {
    const parsed = JSON.parse(r.stdout.trim());
    return {
      nodes: parsed.nodes ?? [],
      errors: parsed.errors ?? [],
    };
  } catch (e: any) {
    return { nodes: [], errors: [`failed to parse bb JSON: ${String(e)}`, r.stdout, r.stderr].filter(Boolean) };
  }
}

function extractFencedEdnBlocks(text: string): { lang: string; body: string }[] {
  const blocks: { lang: string; body: string }[] = [];
  const re = /```(edn|clojure|lith)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    blocks.push({ lang: m[1], body: m[2] });
  }
  return blocks;
}

function appendJsonl(filePath: string, obj: any) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, JSON.stringify(obj) + "\n", "utf8");
}

export default function (pi: ExtensionAPI) {
  let graph: { nodes: SkillNode[]; errors: string[] } = { nodes: [], errors: [] };

  function findNodesByName(name: string): SkillNode[] {
    return graph.nodes.filter((n) => n.name === name).sort((a, b) => a.contract.localeCompare(b.contract));
  }

  function refreshGraphAndLint(ctx: any) {
    ensureDir(LINT_DIR);

    const resolvedOpmfDir = fs.existsSync(OPMF_DIR) ? OPMF_DIR : LEGACY_OPMF_DIR;

    const opmfFiles = fs.existsSync(resolvedOpmfDir)
      ? fs
          .readdirSync(resolvedOpmfDir)
          .filter((f) => f.endsWith(".lisp"))
          .map((f) => path.join(resolvedOpmfDir, f))
      : [];

    const contractFiles = discoverContractFiles();

    const lintRows = [
      ...lintEdnFiles("opmf", opmfFiles),
      ...lintEdnFiles("skill-contract", contractFiles),
    ];

    for (const row of lintRows) {
      appendJsonl(path.join(LINT_DIR, "edn-lint.jsonl"), row);
    }

    const bad = lintRows.filter((r) => !r.ok);
    if (bad.length > 0) {
      const msg = bad
        .slice(0, 3)
        .map((b) => `${b.kind}: ${b.file}: ${b.error ?? "unknown error"}`)
        .join("\n");
      ctx.ui.notify(`EDN lint warnings (${bad.length})\n${msg}`, "warn");
    }

    graph = buildSkillGraphFromContracts(contractFiles);
    for (const err of graph.errors) {
      appendJsonl(path.join(LINT_DIR, "skill-graph-errors.jsonl"), {
        time: new Date().toISOString(),
        error: err,
      });
    }

    ctx.ui.setStatus("opmf-contract-runtime", `skills:${graph.nodes.length} lint:${bad.length}`);
  }

  pi.on("session_start", async (_event, ctx) => {
    refreshGraphAndLint(ctx);
  });

  pi.on("message_end", async (event, ctx) => {
    const msg = (event as any).message;
    if (!msg || msg.role !== "assistant") return;

    const parts = Array.isArray(msg.content)
      ? msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text)
      : typeof msg.content === "string"
        ? [msg.content]
        : [];
    const text = parts.join("");
    if (!text.includes("```")) return;

    const blocks = extractFencedEdnBlocks(text);
    if (blocks.length === 0) return;

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "opmf-edn-"));
    const files: string[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const body = blocks[i].body;
      const p = path.join(tmpDir, `block-${i + 1}.edn`);
      fs.writeFileSync(p, body, "utf8");
      files.push(p);

      appendJsonl(path.join(LINT_DIR, "assistant-edn-blocks.jsonl"), {
        time: new Date().toISOString(),
        messageId: (event as any).message?.id,
        lang: blocks[i].lang,
        sha256: sha256(body),
        bytes: Buffer.byteLength(body, "utf8"),
      });
    }

    const rows = lintEdnFiles("assistant-edn", files);
    const bad = rows.filter((r) => !r.ok);
    for (const row of rows) {
      appendJsonl(path.join(LINT_DIR, "assistant-edn-lint.jsonl"), row);
    }

    if (bad.length > 0) {
      const msg = bad
        .slice(0, 2)
        .map((b) => `${b.file}: ${b.error ?? "unknown error"}`)
        .join("\n");
      ctx.ui.notify(`Assistant EDN block lint warnings (${bad.length})\n${msg}`, "warn");
    }
  });

  pi.registerCommand("skillgraph", {
    description: "Show the current skill graph derived from CONTRACT.edn files (warn-only, local).",
    handler: async (_args, ctx) => {
      if (graph.nodes.length === 0) {
        ctx.ui.notify("skill graph: no nodes found (no CONTRACT.edn files?)", "warn");
        return;
      }

      const lines: string[] = [];
      for (const n of graph.nodes.sort((a, b) => a.name.localeCompare(b.name))) {
        const kids = (n.exposes || []).map((e) => e.name).filter(Boolean);
        lines.push(`${n.name}${n.v ? ` (${n.v})` : ""}`);
        if (kids.length) {
          for (const k of kids.sort()) lines.push(`  -> ${k}`);
        }
      }

      ctx.ui.setWidget("skill-graph", lines);
      ctx.ui.notify(`skill graph loaded: ${graph.nodes.length} nodes`, "info");
    },
  });

  pi.registerTool({
    name: "skill_graph",
    label: "Skill Graph",
    description: "Query the skill graph derived from CONTRACT.edn files.",
    parameters: Type.Object({
      action: Type.Union([
        Type.Literal("list"),
        Type.Literal("show"),
      ], { description: "list: list nodes. show: show one node's exposures." }),
      name: Type.Optional(Type.String({ description: "Skill name for action=show" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      refreshGraphAndLint(ctx);

      const action = (params as any).action;
      if (action === "list") {
        const counts = new Map<string, number>();
        for (const node of graph.nodes) {
          counts.set(node.name, (counts.get(node.name) ?? 0) + 1);
        }
        const names = graph.nodes
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name) || a.contract.localeCompare(b.contract))
          .map((n) => (counts.get(n.name) ?? 0) > 1 ? `${n.name} :: ${n.contract}` : n.name);
        return {
          content: [{ type: "text", text: names.join("\n") }],
          details: { count: names.length },
        };
      }

      if (action === "show") {
        const name = (params as any).name;
        const matches = findNodesByName(name);
        if (matches.length === 0) {
          return {
            content: [{ type: "text", text: `not found: ${name}` }],
            details: { ok: false },
          };
        }

        const blocks = matches.map((node) => {
          const kids = (node.exposes || []).map((e) => `- ${e.name}${e.priority != null ? ` (priority ${e.priority})` : ""}`);
          return [
            `name: ${node.name}`,
            node.v ? `v: ${node.v}` : undefined,
            `contract: ${node.contract}`,
            "exposes:",
            ...(kids.length > 0 ? kids : ["- (none)"]),
          ].filter(Boolean).join("\n");
        });

        return {
          content: [
            {
              type: "text",
              text: blocks.join("\n\n---\n\n"),
            },
          ],
          details: { ok: true, matches: matches.length },
        };
      }

      return {
        content: [{ type: "text", text: `unknown action: ${action}` }],
        details: { ok: false },
      };
    },
  });
}
