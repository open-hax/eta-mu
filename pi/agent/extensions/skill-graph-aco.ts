// @ts-nocheck
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as crypto from "node:crypto";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

const HOME = os.homedir();
const PI_HOME = path.join(HOME, ".pi");
const PI_SETTINGS_FILE = path.join(PI_HOME, "agent", "settings.json");
const PRIMARY_SKILL_ROOT = path.join(PI_HOME, "agent", "skills");
const EXTRA_SKILL_ROOTS = [
  path.join(HOME, ".agents", "skills"),
  path.join(HOME, ".codex", "skills"),
  path.join(HOME, ".codex", "vendor_imports", "skills", "skills", ".curated"),
  path.join(HOME, ".claude", "skills"),
  PRIMARY_SKILL_ROOT,
];

const STATE_DIR = path.join(PI_HOME, "agent", "state", "skill-graph-aco");
const EVENTS_FILE = path.join(STATE_DIR, "skill-call-events.jsonl");
const GRAPH_FILE = path.join(STATE_DIR, "adaptive-skill-graph.json");
const EMBED_CACHE_FILE = path.join(STATE_DIR, "embedding-cache.json");
const STATUS_KEY = "skill-graph-aco";
const GLOBAL_KEY = "__pi_skill_graph_aco_state__";

const DEFAULT_HALF_LIFE_DAYS = Number(process.env.SKILL_GRAPH_ACO_HALF_LIFE_DAYS ?? 14);
const DEFAULT_MAX_NGRAM = Math.max(1, Number(process.env.SKILL_GRAPH_ACO_MAX_NGRAM ?? 3));
const DEFAULT_MARKOV_WEIGHT = Number(process.env.SKILL_GRAPH_ACO_MARKOV_WEIGHT ?? 0.72);
const DEFAULT_SEMANTIC_WEIGHT = Number(process.env.SKILL_GRAPH_ACO_SEMANTIC_WEIGHT ?? 0.28);
const DEFAULT_MIN_SEMANTIC_SIM = Number(process.env.SKILL_GRAPH_ACO_MIN_SEMANTIC_SIM ?? 0.58);
const DEFAULT_SEMANTIC_TOP_K = Math.max(1, Number(process.env.SKILL_GRAPH_ACO_SEMANTIC_TOP_K ?? 4));
const DEFAULT_EMBED_URL = process.env.SKILL_GRAPH_ACO_EMBED_URL || process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const DEFAULT_EMBED_MODEL = process.env.SKILL_GRAPH_ACO_EMBED_MODEL || process.env.OLLAMA_EMBED_MODEL || "qwen3-embedding:0.6b";
const EMBED_TIMEOUT_MS = Number(process.env.SKILL_GRAPH_ACO_EMBED_TIMEOUT_MS ?? 90000);
const MAX_EMBED_BODY_CHARS = Number(process.env.SKILL_GRAPH_ACO_EMBED_BODY_CHARS ?? 2400);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: unknown, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

function expandTilde(p: string) {
  if (p.startsWith("~/")) return path.join(HOME, p.slice(2));
  return p;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizePath(rawPath: string, cwd?: string) {
  const stripped = String(rawPath ?? "").replace(/^@+/, "").trim();
  if (!stripped) return "";
  return path.resolve(cwd || process.cwd(), stripped);
}

function appendJsonl(filePath: string, value: any) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, JSON.stringify(value) + "\n", "utf8");
}

function readJsonl(filePath: string) {
  if (!fs.existsSync(filePath)) return [];

  const rows: any[] = [];
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch {
      // ignore malformed historical lines
    }
  }
  return rows;
}

function readJsonFile(filePath: string, fallback: any) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath: string, value: any) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function loadConfiguredSkillRoots() {
  const roots = new Set<string>([PRIMARY_SKILL_ROOT, ...EXTRA_SKILL_ROOTS]);

  try {
    if (fs.existsSync(PI_SETTINGS_FILE)) {
      const raw = JSON.parse(fs.readFileSync(PI_SETTINGS_FILE, "utf8"));
      if (Array.isArray(raw?.skills)) {
        for (const entry of raw.skills) {
          if (typeof entry === "string" && entry.trim()) {
            roots.add(expandTilde(entry.trim()));
          }
        }
      }
    }
  } catch {
    // ignore settings parse problems, default roots are enough
  }

  return Array.from(roots).map((root) => path.resolve(root));
}

function listFilesRecursive(root: string, filename: string, maxDepth = 4) {
  const out: string[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > maxDepth) return;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name === filename) {
        out.push(fullPath);
      }
    }
  };
  walk(root, 0);
  return out;
}

function parseFrontmatter(text: string) {
  if (!text.startsWith("---\n")) return {};
  const marker = "\n---\n";
  const end = text.indexOf(marker, 4);
  if (end < 0) return {};

  const yaml = text.slice(4, end).split(/\r?\n/);
  const data: Record<string, string> = {};
  let currentKey: string | undefined;
  let buffer: string[] = [];

  const commit = () => {
    if (!currentKey) return;
    let value = buffer.join("\n").trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith(">-")) value = value.slice(2).trim();
    data[currentKey] = value.replace(/\s+/g, " ").trim();
    currentKey = undefined;
    buffer = [];
  };

  for (const line of yaml) {
    if (!line.trim()) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      commit();
      currentKey = match[1];
      buffer.push(match[2]);
      continue;
    }
    if (currentKey) buffer.push(line.trim());
  }
  commit();

  return data;
}

function buildSkillCatalog() {
  const roots = loadConfiguredSkillRoots();
  const catalog = new Map<string, any>();
  const byPath = new Map<string, any>();

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const skillPath of listFilesRecursive(root, "SKILL.md", 5).sort()) {
      const resolved = path.resolve(skillPath);
      const text = fs.readFileSync(resolved, "utf8");
      const frontmatter = parseFrontmatter(text);
      const body = text.startsWith("---\n") ? text.split(/\n---\n/, 2)[1] || "" : text;
      const name = String(frontmatter.name || path.basename(path.dirname(resolved))).trim();
      if (!name) continue;
      if (catalog.has(name)) continue;

      const description = String(frontmatter.description || "").trim();
      const embeddingText = [
        `skill: ${name}`,
        description ? `description: ${description}` : "",
        body.slice(0, MAX_EMBED_BODY_CHARS).trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      const row = {
        name,
        path: resolved,
        root,
        description,
        embeddingText,
      };
      catalog.set(name, row);
      byPath.set(resolved, row);
    }
  }

  return { roots, catalog, byPath };
}

function getState() {
  const g = globalThis as any;
  if (g[GLOBAL_KEY]) return g[GLOBAL_KEY];
  const fresh = {
    agentRun: 0,
    turn: 0,
    ordinal: 0,
    catalog: buildSkillCatalog(),
    lastGraph: undefined as any,
    semanticStatus: "unknown",
  };
  g[GLOBAL_KEY] = fresh;
  return fresh;
}

function refreshCatalog(state: any) {
  state.catalog = buildSkillCatalog();
  return state.catalog;
}

function statusLine(state: any) {
  const eventCount = readJsonl(EVENTS_FILE).length;
  const builtAt = state.lastGraph?.builtAt ? ` built=${state.lastGraph.builtAt}` : "";
  const edges = state.lastGraph?.stats?.mergedEdges ?? 0;
  return `aco:events=${eventCount} edges=${edges} semantic=${state.semanticStatus}${builtAt}`;
}

function setStatus(ctx: any, state: any) {
  if (!ctx?.hasUI) return;
  ctx.ui.setStatus(STATUS_KEY, statusLine(state));
}

function detectSkillFromReadPath(rawPath: string, cwd: string, catalogState: any) {
  const resolved = normalizePath(rawPath, cwd);
  if (!resolved || path.basename(resolved) !== "SKILL.md") return undefined;

  const direct = catalogState.byPath.get(resolved);
  if (direct) return direct;

  for (const root of catalogState.roots) {
    const rel = path.relative(root, resolved);
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) continue;
    return {
      name: path.basename(path.dirname(resolved)),
      path: resolved,
      root,
      description: "",
      embeddingText: `skill: ${path.basename(path.dirname(resolved))}`,
    };
  }

  return undefined;
}

function recordSkillCall(state: any, payload: any) {
  const event = {
    ts: nowIso(),
    cwd: payload.cwd,
    sessionFile: payload.sessionFile,
    agentRun: payload.agentRun,
    turn: payload.turn,
    ordinal: payload.ordinal,
    skill: payload.skill,
    source: payload.source,
    path: payload.path,
    model: payload.model,
  };
  appendJsonl(EVENTS_FILE, event);
  return event;
}

function eventSortKey(row: any) {
  return [
    row.sessionFile || row.cwd || "",
    Number(row.agentRun ?? 0),
    Number(row.turn ?? 0),
    String(row.ts || ""),
    Number(row.ordinal ?? 0),
  ];
}

function compareEventRows(a: any, b: any) {
  const ak = eventSortKey(a);
  const bk = eventSortKey(b);
  for (let i = 0; i < ak.length; i++) {
    if (ak[i] < bk[i]) return -1;
    if (ak[i] > bk[i]) return 1;
  }
  return 0;
}

function decayWeight(ts: string, halfLifeDays: number) {
  const then = Date.parse(ts);
  if (!Number.isFinite(then)) return 1;
  const ageDays = Math.max(0, (Date.now() - then) / (1000 * 60 * 60 * 24));
  const safeHalfLife = Math.max(0.25, halfLifeDays || DEFAULT_HALF_LIFE_DAYS);
  return Math.exp((-Math.log(2) * ageDays) / safeHalfLife);
}

function cosineSimilarity(a: number[], b: number[]) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na <= 0 || nb <= 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function postJson(url: string, body: any) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EMBED_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 400)}`);
    }

    try {
      return JSON.parse(text);
    } catch (error: any) {
      throw new Error(`invalid JSON from ${url}: ${String(error)} :: ${text.slice(0, 200)}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

async function fetchEmbedding(baseUrl: string, model: string, text: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  try {
    const data = await postJson(`${normalizedBase}/api/embeddings`, { model, prompt: text });
    if (Array.isArray(data?.embedding)) return data.embedding;
    throw new Error("/api/embeddings returned no embedding array");
  } catch (firstError: any) {
    const data = await postJson(`${normalizedBase}/api/embed`, { model, input: text });
    if (Array.isArray(data?.embedding)) return data.embedding;
    if (Array.isArray(data?.embeddings) && Array.isArray(data.embeddings[0])) return data.embeddings[0];
    throw new Error(`/api/embed fallback failed after /api/embeddings error: ${String(firstError?.message || firstError)}`);
  }
}

async function loadEmbeddings(catalog: Map<string, any>) {
  const cache = readJsonFile(EMBED_CACHE_FILE, { version: 1, model: DEFAULT_EMBED_MODEL, baseUrl: DEFAULT_EMBED_URL, items: {} as Record<string, any> });
  if (!cache.items || typeof cache.items !== "object") cache.items = {};

  const vectors = new Map<string, number[]>();
  let fetched = 0;
  const errors: string[] = [];
  let consecutiveFailures = 0;

  for (const skill of catalog.values()) {
    const textHash = sha256(`${DEFAULT_EMBED_MODEL}\n${skill.embeddingText}`);
    const cached = cache.items[skill.name];
    if (cached?.hash === textHash && Array.isArray(cached?.vector) && cached.vector.length > 0) {
      vectors.set(skill.name, cached.vector);
      consecutiveFailures = 0;
      continue;
    }

    try {
      const vector = await fetchEmbedding(DEFAULT_EMBED_URL, DEFAULT_EMBED_MODEL, skill.embeddingText);
      cache.items[skill.name] = {
        hash: textHash,
        vector,
        updatedAt: nowIso(),
        path: skill.path,
      };
      vectors.set(skill.name, vector);
      fetched += 1;
      consecutiveFailures = 0;
    } catch (error: any) {
      consecutiveFailures += 1;
      errors.push(`${skill.name}: ${String(error?.message || error)}`);
      if (vectors.size === 0 && consecutiveFailures >= 3) {
        errors.push(`embedding fetch aborted after ${consecutiveFailures} consecutive failures with no successful vectors`);
        break;
      }
    }
  }

  cache.version = 1;
  cache.model = DEFAULT_EMBED_MODEL;
  cache.baseUrl = DEFAULT_EMBED_URL;
  writeJsonFile(EMBED_CACHE_FILE, cache);

  return {
    vectors,
    fetched,
    errors,
    ok: errors.length === 0,
  };
}

async function buildAdaptiveGraph(state: any) {
  const { catalog } = refreshCatalog(state);
  const events = readJsonl(EVENTS_FILE).sort(compareEventRows);
  const grouped = new Map<string, any[]>();

  for (const row of events) {
    const key = `${row.sessionFile || row.cwd || "unknown"}::${row.agentRun || 0}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  const ngramTables = new Map<number, Map<string, any>>();
  const transitionCounts = new Map<string, Map<string, number>>();
  const transitionRawCounts = new Map<string, Map<string, number>>();
  const outgoingTotals = new Map<string, number>();
  const nodeUsage = new Map<string, number>();

  for (const eventsForRun of grouped.values()) {
    const seq = eventsForRun.filter((row) => !!row.skill);
    for (const row of seq) {
      const w = decayWeight(row.ts, DEFAULT_HALF_LIFE_DAYS);
      nodeUsage.set(row.skill, (nodeUsage.get(row.skill) ?? 0) + w);
    }

    for (let i = 0; i < seq.length; i++) {
      const target = seq[i].skill;
      const weight = decayWeight(seq[i].ts, DEFAULT_HALF_LIFE_DAYS);
      for (let n = 1; n <= DEFAULT_MAX_NGRAM; n++) {
        if (i - n < 0) break;
        const context = seq.slice(i - n, i).map((row) => row.skill);
        const key = context.join(" -> ");
        if (!ngramTables.has(n)) ngramTables.set(n, new Map());
        const table = ngramTables.get(n)!;
        const row = table.get(key) || { context, totalWeight: 0, targets: {} as Record<string, number> };
        row.totalWeight += weight;
        row.targets[target] = (row.targets[target] ?? 0) + weight;
        table.set(key, row);
      }

      if (i === 0) continue;
      const source = seq[i - 1].skill;
      if (!source || !target || source === target) continue;

      if (!transitionCounts.has(source)) transitionCounts.set(source, new Map());
      if (!transitionRawCounts.has(source)) transitionRawCounts.set(source, new Map());

      const weighted = transitionCounts.get(source)!;
      const raw = transitionRawCounts.get(source)!;
      weighted.set(target, (weighted.get(target) ?? 0) + weight);
      raw.set(target, (raw.get(target) ?? 0) + 1);
      outgoingTotals.set(source, (outgoingTotals.get(source) ?? 0) + weight);
    }
  }

  const transitionEdges: any[] = [];
  for (const [source, targets] of transitionCounts) {
    const total = outgoingTotals.get(source) ?? 0;
    for (const [target, pheromone] of targets) {
      const rawSupport = transitionRawCounts.get(source)?.get(target) ?? 0;
      transitionEdges.push({
        source,
        target,
        kind: "transition",
        pheromone,
        rawSupport,
        transitionP: total > 0 ? pheromone / total : 0,
      });
    }
  }
  transitionEdges.sort((a, b) => b.transitionP - a.transitionP || b.pheromone - a.pheromone || a.source.localeCompare(b.source) || a.target.localeCompare(b.target));

  const semanticEdges: any[] = [];
  let semanticStatus = "unavailable";
  let embeddingInfo: any = { fetched: 0, errors: [] as string[], ok: false };

  if (catalog.size > 0) {
    embeddingInfo = await loadEmbeddings(catalog);
    const vectors = embeddingInfo.vectors;
    if (vectors.size >= 2 && embeddingInfo.errors.length === 0) {
      semanticStatus = "ok";
      for (const source of catalog.keys()) {
        const sourceVector = vectors.get(source);
        if (!sourceVector) continue;

        const candidates: any[] = [];
        for (const target of catalog.keys()) {
          if (target === source) continue;
          const targetVector = vectors.get(target);
          if (!targetVector) continue;
          const similarity = cosineSimilarity(sourceVector, targetVector);
          if (similarity >= DEFAULT_MIN_SEMANTIC_SIM) {
            candidates.push({
              source,
              target,
              kind: "semantic",
              semanticSim: similarity,
            });
          }
        }

        candidates
          .sort((a, b) => b.semanticSim - a.semanticSim || a.target.localeCompare(b.target))
          .slice(0, DEFAULT_SEMANTIC_TOP_K)
          .forEach((edge) => semanticEdges.push(edge));
      }
      semanticEdges.sort((a, b) => b.semanticSim - a.semanticSim || a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
    } else if (vectors.size >= 2) {
      semanticStatus = "partial";
      const vectorNames = Array.from(vectors.keys());
      for (const source of vectorNames) {
        const sourceVector = vectors.get(source);
        const candidates: any[] = [];
        for (const target of vectorNames) {
          if (target === source) continue;
          const similarity = cosineSimilarity(sourceVector, vectors.get(target));
          if (similarity >= DEFAULT_MIN_SEMANTIC_SIM) candidates.push({ source, target, kind: "semantic", semanticSim: similarity });
        }
        candidates
          .sort((a, b) => b.semanticSim - a.semanticSim || a.target.localeCompare(b.target))
          .slice(0, DEFAULT_SEMANTIC_TOP_K)
          .forEach((edge) => semanticEdges.push(edge));
      }
      semanticEdges.sort((a, b) => b.semanticSim - a.semanticSim || a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
    }
  }

  state.semanticStatus = semanticStatus;

  const merged = new Map<string, any>();
  for (const edge of transitionEdges) {
    merged.set(`${edge.source}=>${edge.target}`, { ...edge, semanticSim: 0, combinedScore: DEFAULT_MARKOV_WEIGHT * edge.transitionP });
  }
  for (const edge of semanticEdges) {
    const key = `${edge.source}=>${edge.target}`;
    const prior = merged.get(key) || {
      source: edge.source,
      target: edge.target,
      kind: "merged",
      pheromone: 0,
      rawSupport: 0,
      transitionP: 0,
      semanticSim: 0,
      combinedScore: 0,
    };
    prior.semanticSim = edge.semanticSim;
    prior.combinedScore = DEFAULT_MARKOV_WEIGHT * (prior.transitionP || 0) + DEFAULT_SEMANTIC_WEIGHT * edge.semanticSim;
    merged.set(key, prior);
  }

  const mergedEdges = Array.from(merged.values()).sort(
    (a, b) => b.combinedScore - a.combinedScore || b.transitionP - a.transitionP || b.semanticSim - a.semanticSim || a.source.localeCompare(b.source) || a.target.localeCompare(b.target),
  );

  const nodeRows = Array.from(new Set([...catalog.keys(), ...Array.from(nodeUsage.keys())]))
    .sort()
    .map((name) => {
      const skill = catalog.get(name);
      return {
        name,
        path: skill?.path,
        description: skill?.description || "",
        usagePheromone: nodeUsage.get(name) ?? 0,
      };
    });

  const ngrams = Array.from(ngramTables.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([n, table]) => ({
      n,
      rows: Array.from(table.values())
        .map((row: any) => {
          const sortedTargets = Object.entries(row.targets)
            .sort((a: any, b: any) => Number(b[1]) - Number(a[1]))
            .map(([target, weight]) => ({
              target,
              weight,
              probability: row.totalWeight > 0 ? Number(weight) / row.totalWeight : 0,
            }));
          return {
            context: row.context,
            totalWeight: row.totalWeight,
            targets: sortedTargets,
          };
        })
        .sort((a: any, b: any) => b.totalWeight - a.totalWeight)
        .slice(0, 200),
    }));

  const graph = {
    builtAt: nowIso(),
    halfLifeDays: DEFAULT_HALF_LIFE_DAYS,
    maxNgram: DEFAULT_MAX_NGRAM,
    markovWeight: DEFAULT_MARKOV_WEIGHT,
    semanticWeight: DEFAULT_SEMANTIC_WEIGHT,
    semantic: {
      status: semanticStatus,
      model: DEFAULT_EMBED_MODEL,
      url: DEFAULT_EMBED_URL,
      minSimilarity: DEFAULT_MIN_SEMANTIC_SIM,
      topK: DEFAULT_SEMANTIC_TOP_K,
      fetched: embeddingInfo.fetched ?? 0,
      errors: (embeddingInfo.errors || []).slice(0, 20),
    },
    stats: {
      events: events.length,
      runs: grouped.size,
      skills: nodeRows.length,
      transitionEdges: transitionEdges.length,
      semanticEdges: semanticEdges.length,
      mergedEdges: mergedEdges.length,
    },
    nodes: nodeRows,
    transitionEdges,
    semanticEdges,
    mergedEdges,
    ngrams,
  };

  writeJsonFile(GRAPH_FILE, graph);
  state.lastGraph = graph;
  return graph;
}

function loadGraph(state: any) {
  const graph = readJsonFile(GRAPH_FILE, undefined);
  if (graph) {
    state.lastGraph = graph;
    state.semanticStatus = graph?.semantic?.status || state.semanticStatus;
  }
  return graph;
}

function summarizeGraph(graph: any) {
  return [
    `adaptive skill graph`,
    `built: ${graph?.builtAt || "never"}`,
    `events: ${graph?.stats?.events ?? 0}`,
    `runs: ${graph?.stats?.runs ?? 0}`,
    `skills: ${graph?.stats?.skills ?? 0}`,
    `transition edges: ${graph?.stats?.transitionEdges ?? 0}`,
    `semantic edges: ${graph?.stats?.semanticEdges ?? 0}`,
    `merged edges: ${graph?.stats?.mergedEdges ?? 0}`,
    `semantic status: ${graph?.semantic?.status || "unknown"}`,
    `semantic model: ${graph?.semantic?.model || DEFAULT_EMBED_MODEL}`,
    `semantic url: ${graph?.semantic?.url || DEFAULT_EMBED_URL}`,
    `state dir: ${STATE_DIR}`,
  ].join("\n");
}

function renderTopEdges(edges: any[], topK = 10, scoreField = "combinedScore") {
  if (!edges || edges.length === 0) return "- none yet";
  return edges.slice(0, topK).map((edge) => {
    const score = Number(edge?.[scoreField] ?? 0);
    const parts = [
      `${edge.source} -> ${edge.target}`,
      `${scoreField}=${score.toFixed(3)}`,
    ];
    if (edge.transitionP != null) parts.push(`p=${Number(edge.transitionP).toFixed(3)}`);
    if (edge.pheromone != null) parts.push(`tau=${Number(edge.pheromone).toFixed(3)}`);
    if (edge.semanticSim != null) parts.push(`sem=${Number(edge.semanticSim).toFixed(3)}`);
    if (edge.rawSupport != null) parts.push(`n=${edge.rawSupport}`);
    return `- ${parts.join(" ")}`;
  }).join("\n");
}

function renderSkillNeighbors(graph: any, name: string, topK = 8) {
  const outgoingMerged = (graph?.mergedEdges || []).filter((edge: any) => edge.source === name).slice(0, topK);
  const outgoingTransition = (graph?.transitionEdges || []).filter((edge: any) => edge.source === name).slice(0, topK);
  const outgoingSemantic = (graph?.semanticEdges || []).filter((edge: any) => edge.source === name).slice(0, topK);
  const incomingMerged = (graph?.mergedEdges || []).filter((edge: any) => edge.target === name).slice(0, topK);
  const node = (graph?.nodes || []).find((row: any) => row.name === name);
  if (!node && outgoingMerged.length === 0 && incomingMerged.length === 0 && outgoingSemantic.length === 0 && outgoingTransition.length === 0) {
    return `not found: ${name}`;
  }

  return [
    `name: ${name}`,
    node?.description ? `description: ${node.description}` : undefined,
    node?.path ? `path: ${node.path}` : undefined,
    node ? `usage-pheromone: ${Number(node.usagePheromone || 0).toFixed(3)}` : undefined,
    "",
    "merged outgoing:",
    renderTopEdges(outgoingMerged, topK),
    "",
    "transition outgoing:",
    renderTopEdges(outgoingTransition, topK, "transitionP"),
    "",
    "semantic outgoing:",
    renderTopEdges(outgoingSemantic, topK, "semanticSim"),
    "",
    "merged incoming:",
    renderTopEdges(incomingMerged, topK),
  ].filter(Boolean).join("\n");
}

function renderNgrams(graph: any, skillName?: string, topK = 10) {
  const tables = Array.isArray(graph?.ngrams) ? graph.ngrams : [];
  if (tables.length === 0) return "- no n-gram data yet";

  const blocks: string[] = [];
  for (const table of tables) {
    let rows = Array.isArray(table?.rows) ? table.rows : [];
    if (skillName) {
      rows = rows.filter((row: any) => row.context?.includes(skillName) || row.targets?.some((target: any) => target.target === skillName));
    }
    rows = rows.slice(0, topK);
    if (rows.length === 0) continue;

    blocks.push(`n=${table.n}`);
    for (const row of rows) {
      const best = (row.targets || []).slice(0, 4).map((target: any) => `${target.target} p=${Number(target.probability || 0).toFixed(3)} w=${Number(target.weight || 0).toFixed(3)}`);
      blocks.push(`- ${row.context.join(' -> ')} :: ${best.join(' ; ')}`);
    }
    blocks.push("");
  }

  return blocks.length > 0 ? blocks.join("\n").trim() : `- no n-gram rows matched ${skillName}`;
}

export default function skillGraphAco(pi: ExtensionAPI) {
  ensureDir(STATE_DIR);

  pi.registerCommand("skillgraph-aco", {
    description: "Inspect or rebuild the adaptive skill graph (/skillgraph-aco, /skillgraph-aco rebuild, /skillgraph-aco show <skill>, /skillgraph-aco top, /skillgraph-aco ngrams [skill])",
    handler: async (args, ctx) => {
      const state = getState();
      const input = String(args || "").trim();
      const [command, ...rest] = input.split(/\s+/).filter(Boolean);
      let graph = loadGraph(state);

      if (!command || command === "status") {
        const text = graph ? summarizeGraph(graph) : "adaptive skill graph not built yet";
        if (ctx.hasUI) ctx.ui.setWidget(STATUS_KEY, text.split("\n"));
        setStatus(ctx, state);
        return;
      }

      if (command === "rebuild") {
        graph = await buildAdaptiveGraph(state);
        const widget = [
          ...summarizeGraph(graph).split("\n"),
          "",
          "top merged edges:",
          ...renderTopEdges(graph.mergedEdges || [], 8).split("\n"),
        ];
        if (ctx.hasUI) ctx.ui.setWidget(STATUS_KEY, widget);
        setStatus(ctx, state);
        return;
      }

      if (command === "top") {
        if (!graph) graph = await buildAdaptiveGraph(state);
        const text = [summarizeGraph(graph), "", "top merged edges:", renderTopEdges(graph.mergedEdges || [], 12)].join("\n");
        if (ctx.hasUI) ctx.ui.setWidget(STATUS_KEY, text.split("\n"));
        setStatus(ctx, state);
        return;
      }

      if (command === "show") {
        const name = rest.join(" ").trim();
        if (!name) {
          ctx.ui.notify("usage: /skillgraph-aco show <skill-name>", "warn");
          return;
        }
        if (!graph) graph = await buildAdaptiveGraph(state);
        const text = renderSkillNeighbors(graph, name, 10);
        if (ctx.hasUI) ctx.ui.setWidget(STATUS_KEY, text.split("\n"));
        setStatus(ctx, state);
        return;
      }

      if (command === "ngrams") {
        const name = rest.join(" ").trim();
        if (!graph) graph = await buildAdaptiveGraph(state);
        const text = renderNgrams(graph, name || undefined, 12);
        if (ctx.hasUI) ctx.ui.setWidget(STATUS_KEY, text.split("\n"));
        setStatus(ctx, state);
      }
    },
  });

  pi.registerTool({
    name: "skill_graph_aco",
    label: "Skill Graph ACO",
    description: "Track skill-call sequences and inspect an adaptive skill graph built from decayed transitions and semantic similarity.",
    promptSnippet: "Inspect or rebuild the adaptive skill graph derived from skill-call telemetry, decayed transition pheromones, and semantic similarity.",
    promptGuidelines: [
      "Use this tool when you need to inspect how skills co-occur over time rather than only reading static CONTRACT exposures.",
      "Use action=rebuild after substantial new skill activity or when the user asks for graph restructuring insight.",
      "Use action=show with a skill name to inspect its learned outgoing and incoming neighbors.",
      "Use action=ngrams to inspect higher-order Markov contexts instead of only pairwise edges.",
    ],
    parameters: Type.Object({
      action: Type.String({ description: 'Action: "status", "rebuild", "show", "top", or "ngrams".' }),
      name: Type.Optional(Type.String({ description: "Skill name for action=show" })),
      topK: Type.Optional(Type.Number({ description: "Optional top-k override for action=top/show" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const state = getState();
      const action = String(params.action || "status").trim().toLowerCase();
      const topK = Math.max(1, Math.min(25, Number(params.topK || 10)));
      let graph = loadGraph(state);

      if (action === "status") {
        setStatus(ctx, state);
        return {
          content: [{ type: "text", text: graph ? summarizeGraph(graph) : "adaptive skill graph not built yet" }],
          details: { graph },
        };
      }

      if (action === "rebuild") {
        graph = await buildAdaptiveGraph(state);
        setStatus(ctx, state);
        return {
          content: [{ type: "text", text: [summarizeGraph(graph), "", "top merged edges:", renderTopEdges(graph.mergedEdges || [], topK)].join("\n") }],
          details: { graph },
        };
      }

      if (action === "top") {
        if (!graph) graph = await buildAdaptiveGraph(state);
        setStatus(ctx, state);
        return {
          content: [{ type: "text", text: renderTopEdges(graph.mergedEdges || [], topK) }],
          details: { graph },
        };
      }

      if (action === "show") {
        const name = String(params.name || "").trim();
        if (!name) throw new Error("skill_graph_aco action=show requires name");
        if (!graph) graph = await buildAdaptiveGraph(state);
        setStatus(ctx, state);
        return {
          content: [{ type: "text", text: renderSkillNeighbors(graph, name, topK) }],
          details: { graph },
        };
      }

      if (action === "ngrams") {
        if (!graph) graph = await buildAdaptiveGraph(state);
        setStatus(ctx, state);
        return {
          content: [{ type: "text", text: renderNgrams(graph, String(params.name || "").trim() || undefined, topK) }],
          details: { graph },
        };
      }

      throw new Error(`unknown skill_graph_aco action: ${params.action}`);
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    const state = getState();
    state.agentRun = 0;
    state.turn = 0;
    state.ordinal = 0;
    refreshCatalog(state);
    loadGraph(state);
    setStatus(ctx, state);
  });

  pi.on("session_switch", async (_event, ctx) => {
    const state = getState();
    state.agentRun = 0;
    state.turn = 0;
    state.ordinal = 0;
    refreshCatalog(state);
    loadGraph(state);
    setStatus(ctx, state);
  });

  pi.on("input", async (event, ctx) => {
    const state = getState();
    const match = String(event.text || "").trim().match(/^\/skill:([a-z0-9-]+)/);
    if (!match) return;

    const skill = match[1];
    state.ordinal += 1;
    recordSkillCall(state, {
      cwd: ctx.cwd,
      sessionFile: ctx.sessionManager?.getSessionFile?.(),
      agentRun: state.agentRun + 1,
      turn: 0,
      ordinal: state.ordinal,
      skill,
      source: "explicit-command",
      path: undefined,
      model: ctx?.model ? `${ctx.model.provider}/${ctx.model.id}` : "unknown",
    });
    setStatus(ctx, state);
  });

  pi.on("agent_start", async (_event, ctx) => {
    const state = getState();
    state.agentRun += 1;
    state.ordinal = 0;
    setStatus(ctx, state);
  });

  pi.on("turn_start", async (event, ctx) => {
    const state = getState();
    state.turn = typeof event.turnIndex === "number" ? event.turnIndex : state.turn + 1;
    state.ordinal = 0;
    setStatus(ctx, state);
  });

  pi.on("tool_call", async (event, ctx) => {
    const state = getState();
    if (event.toolName !== "read") return;

    const skill = detectSkillFromReadPath(event.input?.path, ctx.cwd, state.catalog);
    if (!skill) return;

    state.ordinal += 1;
    recordSkillCall(state, {
      cwd: ctx.cwd,
      sessionFile: ctx.sessionManager?.getSessionFile?.(),
      agentRun: state.agentRun,
      turn: state.turn,
      ordinal: state.ordinal,
      skill: skill.name,
      source: "skill-read",
      path: skill.path,
      model: ctx?.model ? `${ctx.model.provider}/${ctx.model.id}` : "unknown",
    });
    setStatus(ctx, state);
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    if (ctx?.hasUI) ctx.ui.setStatus(STATUS_KEY, undefined);
  });
}
