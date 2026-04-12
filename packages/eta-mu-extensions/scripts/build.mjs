#!/usr/bin/env node

/**
 * eta-mu manifest-driven build orchestrator
 *
 * Reads manifest.edn to discover extensions, resolves sources from
 * local paths / GitHub repos / npm packages, compiles via shadow-cljs,
 * and deploys to Pi and OpenCode.
 *
 * Source types:
 *   :local   - File on local filesystem (relative to manifest or absolute)
 *   :github  - File in a GitHub repository (fetched via git archive)
 *   :npm     - File inside an npm package (installed via pnpm)
 *
 * Usage:
 *   node scripts/build.mjs release
 *   node scripts/build.mjs watch
 *   node scripts/build.mjs clean
 *   node scripts/build.mjs install    # resolve sources only, no compile
 */

import { execSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  symlinkSync,
  statSync,
  copyFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = homedir();
const mode = process.argv[2] || "release";

// ============================================================
// EDN parser (minimal — handles the manifest subset)
// ============================================================

function tokenizeEdn(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    // Skip whitespace
    if (/\s/.test(text[i])) { i++; continue; }
    // Skip comments
    if (text[i] === ";" && (i === 0 || text[i - 1] !== "\\")) {
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    // String
    if (text[i] === '"') {
      let s = "";
      i++; // skip opening quote
      while (i < text.length && text[i] !== '"') {
        if (text[i] === "\\") { i++; s += text[i]; }
        else { s += text[i]; }
        i++;
      }
      i++; // skip closing quote
      tokens.push(s);
      continue;
    }
    // Delimiters
    if ("[]{}".includes(text[i])) {
      tokens.push(text[i]);
      i++;
      continue;
    }
    // Keyword or symbol or number
    let buf = "";
    while (i < text.length && !/[\s\[\]{}";]/.test(text[i])) {
      buf += text[i];
      i++;
    }
    if (buf.length > 0) tokens.push(buf);
  }
  return tokens;
}

function parseEdn(text) {
  const tokens = tokenizeEdn(text);
  let pos = 0;

  function parseValue() {
    if (pos >= tokens.length) throw new Error("Unexpected end of EDN");
    const tok = tokens[pos];

    if (tok === "(") {
      // List — not used in our manifest, treat as skip
      pos++;
      const items = [];
      while (pos < tokens.length && tokens[pos] !== ")") {
        items.push(parseValue());
      }
      pos++; // skip )
      return items;
    }

    if (tok === "[") {
      pos++;
      const items = [];
      while (pos < tokens.length && tokens[pos] !== "]") {
        items.push(parseValue());
      }
      pos++; // skip ]
      return items;
    }

    if (tok === "{") {
      pos++;
      const map = {};
      while (pos < tokens.length && tokens[pos] !== "}") {
        const key = parseValue();
        const val = parseValue();
        map[key] = val;
      }
      pos++; // skip }
      return map;
    }

    pos++;
    // Keyword
    if (tok.startsWith(":")) return tok;
    // Boolean
    if (tok === "true") return true;
    if (tok === "false") return false;
    if (tok === "nil") return null;
    // Number
    if (/^-?\d+(\.\d+)?$/.test(tok)) return Number(tok);
    // String (already unquoted by tokenizer) or symbol
    return tok;
  }

  return parseValue();
}

// ============================================================
// Manifest loading
// ============================================================

const GLOBAL_ROOT = path.join(HOME, ".ημ");
const LOCAL_MANIFEST = path.join(process.cwd(), ".ημ", "manifest.edn");
const GLOBAL_MANIFEST = path.join(GLOBAL_ROOT, "manifest.edn");

function loadManifest(manifestPath) {
  if (!existsSync(manifestPath)) return null;
  const text = readFileSync(manifestPath, "utf8");
  return parseEdn(text);
}

function expandPath(baseDir, p) {
  if (!p) return p;
  if (p.startsWith("~/")) return path.join(HOME, p.slice(2));
  if (path.isAbsolute(p)) return p;
  return path.resolve(baseDir, p);
}

function resolveManifest(manifest, manifestDir) {
  if (!manifest) return { extensions: [], npmDeps: [] };
  const version = manifest[":version"] || 1;
  const extensions = (manifest[":extensions"] || []).map((ext) => {
    const name = ext[":name"];
    const source = ext[":source"];
    const relPath = ext[":path"];
    const tracked = ext[":tracked"] || false;
    const description = ext[":description"] || "";
    const npmDeps = ext[":npm-deps"] || [];

    let absolutePath;
    if (source === ":local") {
      absolutePath = expandPath(manifestDir, relPath);
    } else if (source === ":github") {
      // GitHub sources get resolved into ~/.ημ/.fetched/<repo-hash>/<path>
      const repo = ext[":repo"] || "";
      const ref = ext[":ref"] || "main";
      const hash = Buffer.from(`${repo}:${ref}`).toString("hex").slice(0, 12);
      absolutePath = path.join(GLOBAL_ROOT, ".fetched", hash, relPath);
    } else if (source === ":npm") {
      // npm sources get resolved into node_modules
      const pkg = ext[":package"];
      absolutePath = path.join(GLOBAL_ROOT, "node_modules", pkg, relPath);
    } else {
      absolutePath = expandPath(manifestDir, relPath);
    }

    return {
      name,
      source,
      relPath,
      absolutePath,
      tracked,
      description,
      npmDeps,
      // GitHub-specific
      githubRepo: ext[":repo"],
      githubRef: ext[":ref"],
      // npm-specific
      npmPackage: ext[":package"],
      npmVersion: ext[":version"],
    };
  });

  const stateDir = manifest[":state-dir"] || "state";
  const buildDir = manifest[":build-dir"] || ".build";
  const deploy = manifest[":deploy"] || {};

  return {
    version,
    extensions,
    stateDir,
    buildDir,
    deploy,
    npmDeps: extensions.flatMap((e) => e.npmDeps),
  };
}

// ============================================================
// Source resolution
// ============================================================

function hasLegacyPiExtension(outputName) {
  if (outputName === "opencode-global-instructions") return false;
  return existsSync(path.join(HOME, ".pi", "agent", "extensions", `${outputName}.ts`));
}

function resolveLocalSource(ext) {
  if (existsSync(ext.absolutePath)) return true;
  console.error(`  warning: local source not found: ${ext.absolutePath}`);
  return false;
}

function resolveGithubSource(ext) {
  const { githubRepo, githubRef, absolutePath } = ext;
  if (existsSync(absolutePath)) return true;

  const hash = Buffer.from(`${githubRepo}:${githubRef}`).toString("hex").slice(0, 12);
  const fetchDir = path.join(GLOBAL_ROOT, ".fetched", hash);

  if (!githubRepo) {
    console.error(`  error: github extension "${ext.name}" missing :repo`);
    return false;
  }

  console.log(`  fetching ${githubRepo}@${githubRef} -> ${fetchDir}`);
  mkdirSync(fetchDir, { recursive: true });

  try {
    // Use git archive for a lightweight fetch
    const archiveUrl = `https://github.com/${githubRepo}/archive/${githubRef}.tar.gz`;
    const tmpArchive = path.join(tmpdir(), `eta-mu-gh-${hash}.tar.gz`);
    execSync(`curl -sL -o "${tmpArchive}" "${archiveUrl}"`, { stdio: "pipe" });
    execSync(`tar xzf "${tmpArchive}" -C "${fetchDir}" --strip-components=1`, { stdio: "pipe" });

    if (!existsSync(absolutePath)) {
      console.error(`  error: path ${ext.relPath} not found in ${githubRepo}@${githubRef}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`  error: failed to fetch ${githubRepo}@${githubRef}: ${e.message}`);
    return false;
  }
}

function resolveNpmSource(ext) {
  const { npmPackage, npmVersion, absolutePath } = ext;
  if (existsSync(absolutePath)) return true;

  if (!npmPackage) {
    console.error(`  error: npm extension "${ext.name}" missing :package`);
    return false;
  }

  console.log(`  installing npm package ${npmPackage}${npmVersion ? `@${npmVersion}` : ""}`);
  try {
    const versionSpec = npmVersion ? `@${npmVersion}` : "";
    execSync(`cd "${GLOBAL_ROOT}" && pnpm add ${npmPackage}${versionSpec}`, { stdio: "inherit" });

    if (!existsSync(absolutePath)) {
      console.error(`  error: path ${ext.relPath} not found in ${npmPackage}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`  error: failed to install ${npmPackage}: ${e.message}`);
    return false;
  }
}

function resolveAllSources(extensions) {
  let resolved = 0;
  let failed = 0;

  for (const ext of extensions) {
    console.log(`  resolving ${ext.name} (${ext.source})...`);
    let ok;
    switch (ext.source) {
      case ":local": ok = resolveLocalSource(ext); break;
      case ":github": ok = resolveGithubSource(ext); break;
      case ":npm": ok = resolveNpmSource(ext); break;
      default:
        console.error(`  error: unknown source type "${ext.source}" for ${ext.name}`);
        ok = false;
    }
    if (ok) resolved++;
    else failed++;
  }

  return { resolved, failed };
}

// ============================================================
// Extension entry building (from resolved sources)
// ============================================================

function buildEntries(extensions, rootDir) {
  return extensions
    .filter((ext) => existsSync(ext.absolutePath))
    .map((ext) => {
      const source = readFileSync(ext.absolutePath, "utf8");
      const nsMatch = source.match(/\(ns\s+([^\s()]+)/m);
      if (!nsMatch) {
        console.error(`error: missing (ns ...) in ${ext.absolutePath}`);
        process.exit(1);
      }

      const nsName = nsMatch[1];
      const nsParts = nsName.split(".");
      const leaf = nsParts[nsParts.length - 1];
      const buildId = leaf.replaceAll("_", "-");
      const outputName = leaf;

      return {
        fileName: path.basename(ext.absolutePath),
        absolutePath: ext.absolutePath,
        nsName,
        buildId,
        outputName,
        sourceRoot: rootDir,
        sourceLabel: ext.source === ":local" && ext.tracked ? "tracked" : ext.source.slice(1),
        piEnabled: !hasLegacyPiExtension(outputName),
        piLegacyPath: path.join(HOME, ".pi", "agent", "extensions", `${outputName}.ts`),
        runtimeOutputDir: path.join(rootDir, ".build", "runtime", outputName),
        runtimeOutputFile: path.join(rootDir, ".build", "runtime", outputName, "runtime.js"),
        piOutputDir: path.join(HOME, ".pi", "agent", "extensions", `cljs-${outputName}`),
        opencodeOutputDir: path.join(HOME, ".config", "opencode", "plugins", outputName),
        npmDeps: ext.npmDeps || [],
      };
    });
}

// ============================================================
// Wrapper generation
// ============================================================

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function generateWrappers(entries) {
  const BUILD_DIR = path.join(GLOBAL_ROOT, ".build");
  mkdirSync(BUILD_DIR, { recursive: true });

  for (const entry of entries) {
    const wrapperNs = `eta-mu.build.${entry.buildId}`;
    const wrapperPath = path.join(BUILD_DIR, "eta_mu", "build", `${entry.buildId.replace(/-/g, "_")}.cljs`);
    mkdirSync(path.dirname(wrapperPath), { recursive: true });

    const wrapper = `(ns ${wrapperNs}
  (:require [${entry.nsName} :as ext]))

(defn- tool-parameters->schema [params#]
  (when params#
    (let [required# (->> params#
                         (remove (fn [[_# spec#]] (:optional spec#)))
                         (map (comp name key))
                         vec)
          properties# (into {}
                            (map (fn [[k# spec#]]
                                   [(name k#) (dissoc spec# :optional)]))
                            params#)
          schema# (cond-> {:type "object"
                           :properties properties#
                           :additionalProperties false}
                    (seq required#) (assoc :required required#))]
      (clj->js schema#))))

(defn init [pi#]
  (let [spec# ext/${entry.outputName}]
    (when-let [init-fn# (:init spec#)]
      (init-fn# pi#))
    (doseq [cmd# (:commands spec#)]
      (.call (aget pi# "registerCommand")
             pi#
             (:name cmd#)
             #js {:description (:description cmd#)
                  :handler (:handler cmd#)}))
    (doseq [tool# (:tools spec#)]
      (.call (aget pi# "registerTool")
             pi#
             #js {:name (:name tool#)
                   :label (:label tool#)
                   :description (:description tool#)
                   :parameters (tool-parameters->schema (:parameters tool#))
                   :execute (:execute tool#)}))
    (doseq [evt# (:events spec#)]
      (.call (aget pi# "on") pi# (:event evt#) (:handler evt#)))
    nil))
`;

    writeFileSync(wrapperPath, wrapper, "utf8");
    entry.wrapperNs = wrapperNs;
    entry.wrapperFile = wrapperPath;
  }
}

// ============================================================
// Shadow CLJS config
// ============================================================

function renderShadowConfig(entries, rootDir) {
  if (entries.length === 0) return "{:source-paths [] :builds {}}";

  const libPath = path.join(rootDir, "lib");
  const buildLines = entries.flatMap((entry) => [
    `  :${entry.buildId}`,
    "  {:target :node-library",
    `   :output-to "${toPosix(entry.runtimeOutputFile)}"`,
    `   :exports {:default ${entry.wrapperNs}/init}`,
    "   :compiler-options {:externs [\"" + toPosix(path.join(rootDir, "externs", "promise.js")) + "\"]}}",
  ]);

  const allSourcePaths = [
    ...new Set([
      toPosix(libPath),
      toPosix(path.join(rootDir, ".build")),
      ...entries.map((e) => toPosix(path.join(rootDir, "src"))),
    ]),
  ];

  return [
    ";; Generated by eta-mu build system",
    "{:source-paths",
    ` [${allSourcePaths.map((p) => `"${p}"`).join(" ")}]`,
    " :builds",
    " {",
    ...buildLines,
    " }}",
    "",
  ].join("\n");
}

// ============================================================
// Deployment
// ============================================================

const PI_EXTENSIONS_DIR = path.join(HOME, ".pi", "agent", "extensions");
const OPENCODE_PLUGINS_DIR = path.join(HOME, ".config", "opencode", "plugins");

function ensureDirs(entries) {
  mkdirSync(PI_EXTENSIONS_DIR, { recursive: true });
  mkdirSync(OPENCODE_PLUGINS_DIR, { recursive: true });
  for (const entry of entries.filter((e) => e.piEnabled)) {
    mkdirSync(entry.piOutputDir, { recursive: true });
  }
}

function writeIndexTs(entries) {
  for (const entry of entries.filter((e) => e.piEnabled)) {
    writeFileSync(
      path.join(entry.piOutputDir, "index.ts"),
      'import runtime from "./runtime.js";\n\nexport default runtime;\n',
      "utf8"
    );
  }
}

function deployPiRuntimes(entries) {
  for (const entry of entries.filter((e) => e.piEnabled)) {
    if (!existsSync(entry.runtimeOutputFile)) continue;
    mkdirSync(entry.piOutputDir, { recursive: true });
    writeFileSync(path.join(entry.piOutputDir, "runtime.js"), readFileSync(entry.runtimeOutputFile, "utf8"), "utf8");

    // Create symlinks for npm dependencies that shadow-cljs requires at runtime
    if (entry.npmDeps.length > 0) {
      for (const dep of entry.npmDeps) {
        const nodeModulesDir = path.join(entry.piOutputDir, "node_modules");
        const parts = dep.split("/");
        // Handle scoped packages like @open-hax/output-contract-gate
        if (dep.startsWith("@")) {
          const scopeDir = path.join(nodeModulesDir, parts[0]);
          mkdirSync(scopeDir, { recursive: true });
          const symlinkTarget = path.join(scopeDir, parts[1]);
          const sourcePackage = path.join(GLOBAL_ROOT, "node_modules", dep);
          if (existsSync(sourcePackage) && !existsSync(symlinkTarget)) {
            symlinkSync(sourcePackage, symlinkTarget, "junction");
            console.log(`    linked ${dep} for ${entry.outputName}`);
          }
        } else {
          mkdirSync(nodeModulesDir, { recursive: true });
          const symlinkTarget = path.join(nodeModulesDir, dep);
          const sourcePackage = path.join(GLOBAL_ROOT, "node_modules", dep);
          if (existsSync(sourcePackage) && !existsSync(symlinkTarget)) {
            symlinkSync(sourcePackage, symlinkTarget, "junction");
            console.log(`    linked ${dep} for ${entry.outputName}`);
          }
        }
      }
    }
  }
}

function cleanStaleOutputs(entries) {
  const expectedPi = new Set(entries.filter((e) => e.piEnabled).map((e) => `cljs-${e.outputName}`));
  if (existsSync(PI_EXTENSIONS_DIR)) {
    for (const dirent of readdirSync(PI_EXTENSIONS_DIR, { withFileTypes: true })) {
      if (dirent.isDirectory() && dirent.name.startsWith("cljs-") && !expectedPi.has(dirent.name)) {
        console.log(`  cleaning stale pi extension: ${dirent.name}`);
        rmSync(path.join(PI_EXTENSIONS_DIR, dirent.name), { recursive: true, force: true });
      }
    }
  }
}

// ============================================================
// OpenCode plugin generation
// ============================================================

function toPascalCase(name) {
  return name.split(/[-_]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

function renderOpenCodePluginEntry(entry) {
  const exportName = `${toPascalCase(entry.outputName)}Plugin`;
  const implName = `${toPascalCase(entry.outputName)}PluginImpl`;
  return `// Auto-generated by eta-mu build system
// GPL-3.0-or-later
// Extension: ${entry.outputName} (${entry.sourceLabel})
// Source: ${entry.absolutePath}

import type { Plugin } from "@opencode-ai/plugin";
import { ${implName} } from "./${entry.outputName}.impl.mjs";

export const ${exportName}: Plugin = async (ctx) => ${implName}(ctx);
`;
}

function renderOpenCodePluginImpl(entry) {
  const exportName = `${toPascalCase(entry.outputName)}PluginImpl`;
  const runtimeFile = `${entry.outputName}.runtime.cjs`;

  // This is the same large template as before — it handles the full
  // Pi→OpenCode API bridge for hooks, tools, and events.
  return `// Auto-generated by eta-mu build system
// GPL-3.0-or-later
// Extension: ${entry.outputName} (${entry.sourceLabel})
// Source: ${entry.absolutePath}

import { tool } from "@opencode-ai/plugin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function createNoopUi() {
  return { notify() {}, setStatus() {} };
}

function createPiRegistry() {
  const state = { commands: [], tools: [], handlers: new Map() };
  return {
    registerCommand(name, spec) { state.commands.push({ name, ...spec }); },
    registerProvider() {},
    registerTool(spec) { state.tools.push(spec); },
    on(name, handler) {
      const list = state.handlers.get(name) ?? [];
      list.push(handler);
      state.handlers.set(name, list);
    },
    _state: state,
  };
}

function unwrapInit(value) {
  let current = value;
  for (let i = 0; i < 6; i++) {
    if (typeof current === "function") return current;
    if (!current || typeof current !== "object" || !("default" in current)) return current;
    current = current.default;
  }
  return current;
}

async function loadRuntimeInit(url) {
  const source = await Bun.file(url).text();
  const module = { exports: {} };
  const exports = module.exports;
  const factory = new Function("module", "exports", "require", source);
  factory(module, exports, require);
  return unwrapInit(module.exports);
}

function partsToLegacyContent(parts) {
  return parts.filter((p) => p?.type === "text" && typeof p.text === "string").map((p) => ({ type: "text", text: p.text }));
}

async function normalizeSDKRows(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (typeof result?.response?.json === "function") {
    const body = await result.response.json();
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.data)) return body.data;
  }
  return [];
}

async function buildBranch(client, sessionID, directory, worktree) {
  const result = await client.session.messages({ path: { id: sessionID }, query: { directory } });
  const rows = await normalizeSDKRows(result);
  return rows.map((row) => ({
    type: "message",
    message: { id: row.info.id, role: row.info.role, content: partsToLegacyContent(row.parts), sessionID: row.info.sessionID },
  }));
}

function createSessionApi(client, sessionID, directory, worktree) {
  return {
    async sendUserMessage(text) {
      if (typeof client.session.promptAsync === "function") {
        let agent, model, variant, tools;
        try {
          const messagesResp = await client.session.messages({ path: { id: sessionID }, query: { directory } });
          const messages = await normalizeSDKRows(messagesResp);
          for (let i = messages.length - 1; i >= 0; i--) {
            const info = messages[i]?.info;
            if (!info) continue;
            if (info.agent) agent = info.agent;
            if (info.model?.providerID && info.model?.modelID) {
              model = { providerID: info.model.providerID, modelID: info.model.modelID };
              variant = info.model.variant;
            }
            if (info.tools && typeof info.tools === "object") {
              tools = Object.fromEntries(Object.entries(info.tools).flatMap(([n, p]) => {
                if (p === false || p === "deny") return [[n, false]];
                if (p === true || p === "allow" || p === "ask") return [[n, true]];
                return [];
              }));
            }
            if (agent || model || tools) break;
          }
        } catch {}
        return client.session.promptAsync({
          path: { id: sessionID }, query: { directory },
          body: { ...(agent ? { agent } : {}), ...(model ? { model } : {}), ...(variant ? { variant } : {}), ...(tools && Object.keys(tools).length > 0 ? { tools } : {}), parts: [{ type: "text", text: text + "\\\\n<!-- OMO_INTERNAL_INITIATOR -->" }] },
        });
      }
      return client.session.prompt({ sessionID, directory, workspace: worktree, parts: [{ type: "text", text }] });
    },
  };
}

function createLegacyCtx(pluginInput, env = {}) {
  return {
    cwd: pluginInput.directory, directory: pluginInput.directory, worktree: pluginInput.worktree,
    hasUI: false, ui: createNoopUi(), pi: env.pi,
    sessionManager: env.branch ? { getBranch() { return env.branch; } } : undefined,
  };
}

async function dispatch(registry, name, pluginInput, event = {}, env = {}) {
  const handlers = registry._state.handlers.get(name) ?? [];
  let result;
  for (const handler of handlers) {
    const current = await handler(event, createLegacyCtx(pluginInput, env));
    if (current !== undefined) result = current;
  }
  return result;
}

function schemaFromSpec(spec = {}) {
  let schema;
  if (Array.isArray(spec.enum) && spec.enum.length > 0) { schema = tool.schema.enum(spec.enum); }
  else {
    switch (spec.type) {
      case "string": schema = tool.schema.string(); break;
      case "integer": schema = tool.schema.number().int(); break;
      case "number": schema = tool.schema.number(); break;
      case "boolean": schema = tool.schema.boolean(); break;
      case "array": schema = tool.schema.array(schemaFromSpec(spec.items ?? { type: "string" })); break;
      case "object": schema = tool.schema.object(argsFromSpec(spec.properties ?? {})); break;
      default: schema = tool.schema.any(); break;
    }
  }
  if (typeof spec.description === "string" && spec.description) schema = schema.describe(spec.description);
  if (typeof spec.min === "number" && typeof schema.min === "function") schema = schema.min(spec.min);
  if (typeof spec.max === "number" && typeof schema.max === "function") schema = schema.max(spec.max);
  if (spec.optional) schema = schema.optional();
  if (Object.prototype.hasOwnProperty.call(spec, "default") && typeof schema.default === "function") schema = schema.default(spec.default);
  return schema;
}

function argsFromSpec(spec = {}) {
  return Object.fromEntries(Object.entries(spec).map(([key, value]) => [key, schemaFromSpec(value)]));
}

function normalizeToolResult(result, ctx) {
  if (typeof result === "string") return result;
  if (result == null) return "";
  if (Array.isArray(result)) return result.map((item) => String(item ?? "")).join("\\\\n");
  if (typeof result === "object") {
    const textParts = Array.isArray(result.content) ? result.content.filter((p) => p?.type === "text" && typeof p.text === "string").map((p) => p.text) : [];
    if (result.details && typeof ctx?.metadata === "function") ctx.metadata({ metadata: result.details });
    if (textParts.length > 0) return textParts.join("\\\\n\\\\n");
    if (typeof result.text === "string") return result.text;
    if (typeof result.output === "string") return result.output;
    try { return JSON.stringify(result, null, 2); } catch {}
  }
  return String(result);
}

function buildToolMap(registry, pluginInput) {
  return Object.fromEntries(
    registry._state.tools.map((spec) => [
      spec.name,
      tool({
        description: spec.description || spec.label || spec.name,
        args: argsFromSpec(spec.parameters?.properties || {}),
        async execute(args, ctx) {
          const result = await spec.execute(null, args, ctx.abort, () => {}, createLegacyCtx(pluginInput, { pi: createSessionApi(pluginInput.client, ctx.sessionID, ctx.directory, ctx.worktree) }));
          return normalizeToolResult(result, ctx);
        },
      }),
    ])
  );
}

export const ${exportName} = async (pluginInput) => {
  const initFn = await loadRuntimeInit(new URL("./${runtimeFile}", import.meta.url));
  const registry = createPiRegistry();
  if (typeof initFn === "function") initFn(registry);

  const hooks = {};
  if (registry._state.tools.length > 0) hooks.tool = buildToolMap(registry, pluginInput);
  if ((registry._state.handlers.get("before_agent_start") ?? []).length > 0) {
    hooks["experimental.chat.system.transform"] = async (input, output) => {
      const event = { systemPrompt: output.system.join("\\\\n\\\\n") };
      const result = await dispatch(registry, "before_agent_start", pluginInput, event);
      const systemPrompt = result?.systemPrompt ?? event.systemPrompt;
      output.system = systemPrompt ? [systemPrompt] : [];
    };
  }
  if (registry._state.handlers.size > 0) {
    hooks.event = async ({ event }) => {
      const sessionID = event.properties?.sessionID ?? event.properties?.info?.sessionID;
      const pi = sessionID ? createSessionApi(pluginInput.client, sessionID, pluginInput.directory, pluginInput.worktree) : undefined;
      if (event.type === "session.created") { await dispatch(registry, "session_start", pluginInput, event.properties, { pi }); return; }
      if (event.type === "session.deleted") { await dispatch(registry, "session_shutdown", pluginInput, event.properties, { pi }); return; }
      if (event.type === "session.status" && event.properties?.status?.type === "busy") { await dispatch(registry, "agent_start", pluginInput, event.properties, { pi }); return; }
      if (event.type === "message.updated" && event.properties?.info?.role === "assistant") { await dispatch(registry, "message_end", pluginInput, { message: event.properties.info }, { pi }); return; }
      if (event.type === "session.idle" && sessionID) {
        const branch = await buildBranch(pluginInput.client, sessionID, pluginInput.directory, pluginInput.worktree);
        await dispatch(registry, "agent_end", pluginInput, event.properties, { pi, branch });
        return;
      }
    };
  }
  return hooks;
};
`;
}

function generateOpenCodePlugins(entries) {
  mkdirSync(OPENCODE_PLUGINS_DIR, { recursive: true });
  for (const entry of entries) {
    writeFileSync(path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.ts`), renderOpenCodePluginEntry(entry), "utf8");
    writeFileSync(path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.impl.mjs`), renderOpenCodePluginImpl(entry), "utf8");
    if (existsSync(entry.runtimeOutputFile)) {
      writeFileSync(path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.runtime.cjs`), readFileSync(entry.runtimeOutputFile, "utf8"), "utf8");
    }
  }
}

// ============================================================
// Pi settings.json sync
// ============================================================

const PI_SETTINGS_FILE = path.join(HOME, ".pi", "agent", "settings.json");

function syncPiSettings(entries) {
  if (!existsSync(PI_SETTINGS_FILE)) {
    console.log("  skipping settings.json sync (file not found)");
    return;
  }

  const settings = JSON.parse(readFileSync(PI_SETTINGS_FILE, "utf8"));
  const currentExtensions = settings.extensions || [];

  // Build map of expected cljs-* paths
  const expectedPaths = new Map();
  for (const entry of entries.filter((e) => e.piEnabled)) {
    const expectedPath = `~/.pi/agent/extensions/cljs-${entry.outputName}/index.ts`;
    expectedPaths.set(entry.outputName, expectedPath);
  }

  // Build new extensions array
  const newExtensions = [];
  const migrated = [];
  const added = [];
  const removed = [];

  for (const extPath of currentExtensions) {
    const expandedPath = expandPath(HOME, extPath);

    // Check if this is a stale .ts file that should be cljs-*/index.ts
    const match = extPath.match(/\/([^/]+)\.ts$/);
    if (match && !extPath.includes("/cljs-")) {
      const name = match[1];
      // Check if we have a cljs-* version for this
      const cljsPath = expectedPaths.get(name);
      if (cljsPath) {
        const cljsExpanded = expandPath(HOME, cljsPath);
        if (existsSync(cljsExpanded)) {
          newExtensions.push(cljsPath);
          migrated.push({ from: extPath, to: cljsPath });
          continue;
        }
      }
      // No cljs-* version, check if old path still exists
      if (!existsSync(expandedPath)) {
        removed.push(extPath);
        continue;
      }
    }

    // Check if this is a cljs-* path that needs updating
    const cljsMatch = extPath.match(/\/cljs-([^/]+)\/index\.ts$/);
    if (cljsMatch) {
      const name = cljsMatch[1];
      const expected = expectedPaths.get(name);

      // Check if this extension still exists on disk
      if (!existsSync(expandedPath)) {
        removed.push(extPath);
        continue;
      }

      if (expected && expected !== extPath) {
        // Path differs, use expected
        newExtensions.push(expected);
        migrated.push({ from: extPath, to: expected });
        continue;
      }
      // Path is correct, keep it
      newExtensions.push(extPath);
      expectedPaths.delete(name);
      continue;
    }

    // Keep non-cljs extensions as-is (if they exist)
    if (existsSync(expandedPath)) {
      newExtensions.push(extPath);
    } else {
      removed.push(extPath);
    }
  }

  // Add any new extensions not yet in settings
  for (const [name, expectedPath] of expectedPaths) {
    if (!newExtensions.includes(expectedPath) && existsSync(expandPath(HOME, expectedPath))) {
      newExtensions.push(expectedPath);
      added.push(expectedPath);
    }
  }

  // Only write if changed
  if (migrated.length > 0 || added.length > 0 || removed.length > 0) {
    settings.extensions = newExtensions;
    writeFileSync(PI_SETTINGS_FILE, JSON.stringify(settings, null, 2) + "\n", "utf8");

    if (migrated.length > 0) {
      console.log("  migrated stale extension paths in settings.json:");
      for (const { from, to } of migrated) {
        console.log(`    ${from} → ${to}`);
      }
    }
    if (added.length > 0) {
      console.log("  added new extension paths to settings.json:");
      for (const p of added) {
        console.log(`    + ${p}`);
      }
    }
    if (removed.length > 0) {
      console.log("  removed non-existent extension paths from settings.json:");
      for (const p of removed) {
        console.log(`    - ${p}`);
      }
    }
  } else {
    console.log("  settings.json extensions already up-to-date");
  }
}

// ============================================================
// Shadow CLJS execution
// ============================================================

function resolveShadowBinary() {
  const local = path.join(GLOBAL_ROOT, "node_modules", ".bin", "shadow-cljs");
  return existsSync(local) ? local : "shadow-cljs";
}

function runShadow(action, entries, rootDir) {
  const binary = resolveShadowBinary();
  const buildIds = entries.map((e) => e.buildId);
  if (buildIds.length === 0) { console.log("  no extensions to build"); return { status: 0 }; }

  console.log(`  running shadow-cljs ${action} ${buildIds.join(" ")}`);
  const result = spawnSync(binary, [action, ...buildIds], { cwd: rootDir, stdio: "inherit", shell: false });
  if (result.error) { console.error(`error: unable to start ${binary}: ${result.error.message}`); return { status: 1 }; }
  return { status: result.status ?? 1 };
}

// ============================================================
// Main
// ============================================================

function main() {
  // Load manifests
  const globalManifest = loadManifest(GLOBAL_MANIFEST);
  const localManifest = loadManifest(LOCAL_MANIFEST);

  if (!globalManifest && !localManifest) {
    console.log("eta-mu: no manifest.edn found.");
    console.log(`  Global: ${GLOBAL_MANIFEST}`);
    console.log(`  Local:  ${LOCAL_MANIFEST}`);
    console.log("\nCreate a manifest.edn with :extensions entries to get started.");
    process.exit(0);
  }

  const globalResolved = resolveManifest(globalManifest, GLOBAL_ROOT);
  const localResolved = localManifest ? resolveManifest(localManifest, path.join(process.cwd(), ".ημ")) : { extensions: [], npmDeps: [] };

  // Merge: local overrides global by name
  const localNames = new Set(localResolved.extensions.map((e) => e.name));
  const mergedExtensions = [
    ...globalResolved.extensions.filter((e) => !localNames.has(e.name)),
    ...localResolved.extensions,
  ];

  const rootDir = GLOBAL_ROOT;
  const stateDir = path.join(rootDir, globalResolved.stateDir);

  console.log(`eta-mu: ${mergedExtensions.length} extension(s) declared in manifest`);

  if (mode === "clean") {
    console.log("  cleaning all outputs...");
    const entries = buildEntries(mergedExtensions, rootDir);
    for (const entry of entries) {
      rmSync(entry.piOutputDir, { recursive: true, force: true });
      rmSync(entry.opencodeOutputDir, { recursive: true, force: true });
    }
    const BUILD_DIR = path.join(rootDir, ".build");
    if (existsSync(BUILD_DIR)) rmSync(BUILD_DIR, { recursive: true, force: true });
    const shadowCache = path.join(rootDir, ".shadow-cljs");
    if (existsSync(shadowCache)) rmSync(shadowCache, { recursive: true, force: true });
    console.log("  done.");
    process.exit(0);
  }

  if (mode === "install") {
    console.log("  resolving sources...");
    const { resolved, failed } = resolveAllSources(mergedExtensions);
    console.log(`  resolved: ${resolved}, failed: ${failed}`);
    process.exit(failed > 0 ? 1 : 0);
  }

  if (mode !== "release" && mode !== "watch") {
    console.error(`error: unsupported mode: ${mode}. Use release, watch, clean, or install.`);
    process.exit(1);
  }

  // Resolve sources
  console.log("  resolving sources...");
  const { resolved, failed } = resolveAllSources(mergedExtensions);
  if (failed > 0) {
    console.error(`error: ${failed} extension(s) could not be resolved`);
    process.exit(1);
  }

  // Ensure npm dependencies
  const allNpmDeps = [...new Set(mergedExtensions.flatMap((e) => e.npmDeps))];
  if (allNpmDeps.length > 0) {
    console.log(`  ensuring npm dependencies: ${allNpmDeps.join(", ")}`);
    const pkgJson = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8"));
    let changed = false;
    for (const dep of allNpmDeps) {
      if (!pkgJson.dependencies?.[dep]) {
        if (!pkgJson.dependencies) pkgJson.dependencies = {};
        pkgJson.dependencies[dep] = "workspace:*";
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(path.join(rootDir, "package.json"), JSON.stringify(pkgJson, null, 2) + "\n", "utf8");
      console.log("  updated package.json with new dependencies, running pnpm install...");
      try {
        execSync(`cd "${rootDir}" && pnpm install`, { stdio: "inherit" });
      } catch (e) {
        console.error(`  warning: pnpm install failed: ${e.message}`);
      }
    }
  }

  // Build entries from resolved sources
  const entries = buildEntries(mergedExtensions, rootDir);

  const piSkipped = entries.filter((e) => !e.piEnabled);
  for (const entry of piSkipped) {
    console.log(`  pi-skip ${entry.outputName}: legacy extension present at ${entry.piLegacyPath}`);
  }

  // Generate wrapper files
  generateWrappers(entries);
  console.log("  generated wrapper files");

  // Generate shadow-cljs.edn
  writeFileSync(path.join(rootDir, "shadow-cljs.edn"), renderShadowConfig(entries, rootDir), "utf8");
  console.log("  generated shadow-cljs.edn");

  // Clean stale outputs
  cleanStaleOutputs(entries);
  ensureDirs(entries);
  writeIndexTs(entries);

  // Ensure state directory
  mkdirSync(stateDir, { recursive: true });
  console.log(`  state directory: ${stateDir}`);

  // Compile
  const result = runShadow(mode, entries, rootDir);
  if (result.status !== 0) {
    console.error("error: shadow-cljs build failed");
    process.exit(result.status);
  }

  // Deploy
  deployPiRuntimes(entries);
  cleanStaleOutputs(entries);
  generateOpenCodePlugins(entries);

  // Sync settings.json with deployed extensions
  syncPiSettings(entries);

  console.log("\neta-mu build report:");
  console.log(`  extensions: ${entries.length}`);
  for (const entry of entries) {
    console.log(`  - ${entry.outputName} (${entry.sourceLabel})`);
    console.log(`    pi: ${entry.piEnabled ? `${entry.piOutputDir}/` : `(skipped; using legacy ${entry.piLegacyPath})`}`);
    console.log(`    opencode: ${entry.opencodeOutputDir}/`);
  }

  if (mode === "watch") {
    console.log("\n  watching for changes...");
  }
}

main();
