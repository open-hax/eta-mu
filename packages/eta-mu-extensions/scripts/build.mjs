#!/usr/bin/env node

/**
 * eta-mu build orchestrator
 *
 * Discovers CLJS extension sources in ~/.ημ/src/ and ./.ημ/src/,
 * generates wrapper files with (defn init [pi] ...) for each,
 * compiles via shadow-cljs, and deploys to both:
 *   - Pi: ~/.pi/agent/extensions/cljs-<name>/
 *   - OpenCode: ~/.config/opencode/plugins/<name>/
 *
 * Usage:
 *   node scripts/build.mjs release
 *   node scripts/build.mjs watch
 *   node scripts/build.mjs clean
 */

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globalRoot = path.join(homedir(), ".ημ");
const localRoot = path.join(process.cwd(), ".ημ");
const hasLocal = existsSync(path.join(localRoot, "src"));

const HOME = homedir();
const PI_EXTENSIONS_DIR = path.join(HOME, ".pi", "agent", "extensions");
const OPENCODE_PLUGINS_DIR = path.join(HOME, ".config", "opencode", "plugins");
const BUILD_DIR = path.join(globalRoot, ".build");

function hasLegacyPiExtension(outputName) {
  return existsSync(path.join(PI_EXTENSIONS_DIR, `${outputName}.ts`));
}

const mode = process.argv[2] || "release";

// ============================================================
// Discovery
// ============================================================

function discoverSources(rootDir, label) {
  const srcDir = path.join(rootDir, "src");
  if (!existsSync(srcDir)) return [];

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        walk(full);
      } else if (entry.isFile() && /\.(cljs|cljc)$/.test(entry.name) && !entry.name.startsWith(".")) {
        // Skip the eta-mu DSL library itself (core.cljc, pi_target.cljs, opencode_target.cljs)
        const rel = path.relative(srcDir, full);
        if (rel.startsWith("eta_mu/") && !rel.includes("/extensions/")) return;
        files.push(full);
      }
    }
  };
  walk(srcDir);
  files.sort();

  return files.map((absolutePath) => {
    const source = readFileSync(absolutePath, "utf8");
    const nsMatch = source.match(/\(ns\s+([^\s()]+)/m);
    if (!nsMatch) {
      console.error(`error: missing (ns ...) in ${absolutePath}`);
      process.exit(1);
    }

    const nsName = nsMatch[1];
    const nsParts = nsName.split(".");
    const leaf = nsParts[nsParts.length - 1];
    const buildId = leaf.replaceAll("_", "-");
    const outputName = leaf;

    const piLegacyPath = path.join(PI_EXTENSIONS_DIR, `${outputName}.ts`);

    return {
      fileName: path.basename(absolutePath),
      absolutePath,
      nsName,
      buildId,
      outputName,
      sourceRoot: rootDir,
      sourceLabel: label,
      piEnabled: !hasLegacyPiExtension(outputName),
      piLegacyPath,
      runtimeOutputDir: path.join(BUILD_DIR, "runtime", outputName),
      runtimeOutputFile: path.join(BUILD_DIR, "runtime", outputName, "runtime.js"),
      piOutputDir: path.join(PI_EXTENSIONS_DIR, `cljs-${outputName}`),
      opencodeOutputDir: path.join(OPENCODE_PLUGINS_DIR, outputName),
    };
  });
}

function getAllSources() {
  const globalSources = discoverSources(globalRoot, "global");
  const localSources = hasLocal ? discoverSources(localRoot, "local") : [];

  const localNames = new Set(localSources.map((s) => s.outputName));
  const merged = [
    ...globalSources.filter((s) => !localNames.has(s.outputName)),
    ...localSources,
  ];

  return merged.sort((a, b) => a.outputName.localeCompare(b.outputName));
}

// ============================================================
// Wrapper generation
// ============================================================

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function generateWrappers(entries) {
  mkdirSync(BUILD_DIR, { recursive: true });

  for (const entry of entries) {
    // CLJS convention: hyphens in namespace map to underscores in file paths
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

function renderShadowConfig(entries) {
  if (entries.length === 0) {
    return "{:source-paths [] :builds {}}";
  }

  const libPath = path.join(globalRoot, "lib");
  const buildLines = entries.flatMap((entry) => [
    `  :${entry.buildId}`,
    "  {:target :node-library",
    `   :output-to \"${toPosix(entry.runtimeOutputFile)}\"`,
    `   :exports {:default ${entry.wrapperNs}/init}`,
    "   :compiler-options {:externs [\"" + toPosix(path.join(globalRoot, "externs", "promise.js")) + "\"]}}",
  ]);

  const allSourcePaths = [
    ...new Set([
      toPosix(libPath),
      toPosix(BUILD_DIR),
      ...entries.map((e) => toPosix(path.join(e.sourceRoot, "src"))),
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
// Output management
// ============================================================

function ensurePiOutputDirs(entries) {
  mkdirSync(PI_EXTENSIONS_DIR, { recursive: true });
  for (const entry of entries.filter((entry) => entry.piEnabled)) {
    mkdirSync(entry.piOutputDir, { recursive: true });
  }
}

function ensureOpenCodeOutputDirs(entries) {
  mkdirSync(OPENCODE_PLUGINS_DIR, { recursive: true });
}

function writeIndexTs(entries) {
  for (const entry of entries.filter((entry) => entry.piEnabled)) {
    writeFileSync(
      path.join(entry.piOutputDir, "index.ts"),
      'import runtime from "./runtime.js";\n\nexport default runtime;\n',
      "utf8"
    );
  }
}

function deployPiRuntimes(entries) {
  for (const entry of entries.filter((entry) => entry.piEnabled)) {
    if (!existsSync(entry.runtimeOutputFile)) continue;
    mkdirSync(entry.piOutputDir, { recursive: true });
    writeFileSync(path.join(entry.piOutputDir, "runtime.js"), readFileSync(entry.runtimeOutputFile, "utf8"), "utf8");
    
    // Create symlinks for workspace dependencies that shadow-cljs requires at runtime
    // These are packages that extensions depend on but aren't bundled into runtime.js
    if (entry.outputName === "opmf-contract-gate") {
      const nodeModulesDir = path.join(entry.piOutputDir, "node_modules", "@open-hax");
      mkdirSync(nodeModulesDir, { recursive: true });
      const symlinkTarget = path.join(nodeModulesDir, "output-contract-gate");
      const sourcePackage = path.join(HOME, "devel", "orgs", "open-hax", "eta-mu", "packages", "output-contract-gate");
      if (existsSync(sourcePackage) && !existsSync(symlinkTarget)) {
        symlinkSync(sourcePackage, symlinkTarget);
        console.log(`    linked @open-hax/output-contract-gate for ${entry.outputName}`);
      }
    }
  }
}

function cleanStaleOutputs(entries) {
  ensurePiOutputDirs(entries);
  ensureOpenCodeOutputDirs(entries);

  const expectedPi = new Set(entries.filter((e) => e.piEnabled).map((e) => `cljs-${e.outputName}`));
  if (existsSync(PI_EXTENSIONS_DIR)) {
    for (const dirent of readdirSync(PI_EXTENSIONS_DIR, { withFileTypes: true })) {
      if (dirent.isDirectory() && dirent.name.startsWith("cljs-") && !expectedPi.has(dirent.name)) {
        console.log(`  cleaning stale pi extension: ${dirent.name}`);
        rmSync(path.join(PI_EXTENSIONS_DIR, dirent.name), { recursive: true, force: true });
      }
    }
  }

  const expectedOc = new Set(entries.map((e) => e.outputName));
  if (existsSync(OPENCODE_PLUGINS_DIR)) {
    for (const dirent of readdirSync(OPENCODE_PLUGINS_DIR, { withFileTypes: true })) {
      if (dirent.isDirectory() && expectedOc.has(dirent.name)) {
        const marker = path.join(OPENCODE_PLUGINS_DIR, dirent.name, ".eta-mu");
        if (existsSync(marker)) {
          console.log(`  cleaning stale opencode plugin: ${dirent.name}`);
          rmSync(path.join(OPENCODE_PLUGINS_DIR, dirent.name), { recursive: true, force: true });
        }
      }
    }
  }
}

function cleanAll(entries) {
  cleanStaleOutputs(entries);
  for (const entry of entries) {
    rmSync(entry.piOutputDir, { recursive: true, force: true });
    rmSync(entry.opencodeOutputDir, { recursive: true, force: true });
  }
  if (existsSync(BUILD_DIR)) rmSync(BUILD_DIR, { recursive: true, force: true });
  const shadowCache = path.join(globalRoot, ".shadow-cljs");
  if (existsSync(shadowCache)) rmSync(shadowCache, { recursive: true, force: true });
}

// ============================================================
// Shadow CLJS execution
// ============================================================

function resolveShadowBinary() {
  const local = path.join(globalRoot, "node_modules", ".bin", "shadow-cljs");
  return existsSync(local) ? local : "shadow-cljs";
}

function runShadow(action, entries) {
  const binary = resolveShadowBinary();
  const buildIds = entries.map((e) => e.buildId);
  if (buildIds.length === 0) {
    console.log("  no extensions to build");
    return { status: 0 };
  }

  console.log(`  running shadow-cljs ${action} ${buildIds.join(" ")}`);
  const result = spawnSync(binary, [action, ...buildIds], {
    cwd: globalRoot,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(`error: unable to start ${binary}: ${result.error.message}`);
    return { status: 1 };
  }
  return { status: result.status ?? 1 };
}

// ============================================================
// OpenCode plugin generation
// ============================================================

function toPascalCase(name) {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function renderOpenCodePluginImpl(entry) {
  const exportName = `${toPascalCase(entry.outputName)}PluginImpl`;
  const runtimeFile = `${entry.outputName}.runtime.cjs`;

  return `// Auto-generated by eta-mu build system
// GPL-3.0-or-later
// Extension: ${entry.outputName} (${entry.sourceLabel})
// Source: ${entry.absolutePath}

import { tool } from "@opencode-ai/plugin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function createNoopUi() {
  return {
    notify() {},
    setStatus() {},
  };
}

function createPiRegistry() {
  const state = {
    commands: [],
    tools: [],
    handlers: new Map(),
  };

  return {
    registerCommand(name, spec) {
      state.commands.push({ name, ...spec });
    },
    registerProvider() {
      // OpenCode provider registration is handled through config, not plugin runtime.
    },
    registerTool(spec) {
      state.tools.push(spec);
    },
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
  for (let i = 0; i < 6; i += 1) {
    if (typeof current === "function") {
      return current;
    }
    if (!current || typeof current !== "object" || !("default" in current)) {
      return current;
    }
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
  return parts
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => ({ type: "text", text: part.text }));
}

async function normalizeSDKRows(result) {
  if (Array.isArray(result)) {
    return result;
  }
  if (Array.isArray(result?.data)) {
    return result.data;
  }
  if (typeof result?.response?.json === "function") {
    const body = await result.response.json();
    if (Array.isArray(body)) {
      return body;
    }
    if (Array.isArray(body?.data)) {
      return body.data;
    }
  }
  return [];
}

async function buildBranch(client, sessionID, directory, worktree) {
  const result = await client.session.messages({
    path: { id: sessionID },
    query: { directory },
  });
  const rows = await normalizeSDKRows(result);
  return rows.map((row) => ({
    type: "message",
    message: {
      id: row.info.id,
      role: row.info.role,
      content: partsToLegacyContent(row.parts),
      sessionID: row.info.sessionID,
    },
  }));
}

async function waitForBranchMessage(client, sessionID, directory, worktree, messageID) {
  for (let i = 0; i < 8; i += 1) {
    const branch = await buildBranch(client, sessionID, directory, worktree);
    const message = branch.find((item) => item?.type === "message" && item.message?.id === messageID)?.message;
    if (message && Array.isArray(message.content) && message.content.length > 0) {
      return branch;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return buildBranch(client, sessionID, directory, worktree);
}

function createSessionApi(client, sessionID, directory, worktree) {
  return {
    async sendUserMessage(text) {
      if (typeof client.session.promptAsync === "function") {
        let agent;
        let model;
        let variant;
        let tools;

        try {
          const messagesResp = await client.session.messages({
            path: { id: sessionID },
            query: { directory },
          });
          const messages = await normalizeSDKRows(messagesResp);
          for (let i = messages.length - 1; i >= 0; i -= 1) {
            const info = messages[i]?.info;
            if (!info) continue;

            if (info.agent) {
              agent = info.agent;
            }
            if (info.model?.providerID && info.model?.modelID) {
              model = { providerID: info.model.providerID, modelID: info.model.modelID };
              variant = info.model.variant;
            } else if (info.providerID && info.modelID) {
              model = { providerID: info.providerID, modelID: info.modelID };
            }
            if (info.tools && typeof info.tools === "object") {
              tools = Object.fromEntries(
                Object.entries(info.tools).flatMap(([name, permission]) => {
                  if (permission === false || permission === "deny") return [[name, false]];
                  if (permission === true || permission === "allow" || permission === "ask") return [[name, true]];
                  return [];
                }),
              );
            }

            if (agent || model || tools) {
              break;
            }
          }
        } catch {}

        return client.session.promptAsync({
          path: { id: sessionID },
          query: { directory },
          body: {
            ...(agent ? { agent } : {}),
            ...(model ? { model } : {}),
            ...(variant ? { variant } : {}),
            ...(tools && Object.keys(tools).length > 0 ? { tools } : {}),
            parts: [{ type: "text", text: text + "\\n<!-- OMO_INTERNAL_INITIATOR -->" }],
          },
        });
      }

      return client.session.prompt({
        sessionID,
        directory,
        workspace: worktree,
        parts: [{ type: "text", text }],
      });
    },
  };
}

function createLegacyCtx(pluginInput, env = {}) {
  return {
    cwd: pluginInput.directory,
    directory: pluginInput.directory,
    worktree: pluginInput.worktree,
    hasUI: false,
    ui: createNoopUi(),
    pi: env.pi,
    sessionManager: env.branch
      ? {
          getBranch() {
            return env.branch;
          },
        }
      : undefined,
  };
}

async function dispatch(registry, name, pluginInput, event = {}, env = {}) {
  const handlers = registry._state.handlers.get(name) ?? [];
  let result;
  for (const handler of handlers) {
    const current = await handler(event, createLegacyCtx(pluginInput, env));
    if (current !== undefined) {
      result = current;
    }
  }
  return result;
}

function schemaFromSpec(spec = {}) {
  let schema;

  if (Array.isArray(spec.enum) && spec.enum.length > 0) {
    schema = tool.schema.enum(spec.enum);
  } else {
    switch (spec.type) {
      case "string":
        schema = tool.schema.string();
        break;
      case "integer":
        schema = tool.schema.number().int();
        break;
      case "number":
        schema = tool.schema.number();
        break;
      case "boolean":
        schema = tool.schema.boolean();
        break;
      case "array":
        schema = tool.schema.array(schemaFromSpec(spec.items ?? { type: "string" }));
        break;
      case "object":
        schema = tool.schema.object(argsFromSpec(spec.properties ?? {}));
        break;
      default:
        schema = tool.schema.any();
        break;
    }
  }

  if (typeof spec.description === "string" && spec.description) {
    schema = schema.describe(spec.description);
  }
  if (typeof spec.min === "number" && typeof schema.min === "function") {
    schema = schema.min(spec.min);
  }
  if (typeof spec.max === "number" && typeof schema.max === "function") {
    schema = schema.max(spec.max);
  }
  if (spec.optional) {
    schema = schema.optional();
  }
  if (Object.prototype.hasOwnProperty.call(spec, "default") && typeof schema.default === "function") {
    schema = schema.default(spec.default);
  }

  return schema;
}

function argsFromSpec(spec = {}) {
  return Object.fromEntries(
    Object.entries(spec).map(([key, value]) => [key, schemaFromSpec(value)]),
  );
}

function normalizeToolResult(result, ctx) {
  if (typeof result === "string") {
    return result;
  }

  if (result == null) {
    return "";
  }

  if (Array.isArray(result)) {
    return result.map((item) => String(item ?? "")).join("\\n");
  }

  if (typeof result === "object") {
    const textParts = Array.isArray(result.content)
      ? result.content
          .filter((part) => part?.type === "text" && typeof part.text === "string")
          .map((part) => part.text)
      : [];

    if (result.details && typeof ctx?.metadata === "function") {
      ctx.metadata({ metadata: result.details });
    }

    if (textParts.length > 0) {
      return textParts.join("\\n\\n");
    }

    if (typeof result.text === "string") {
      return result.text;
    }

    if (typeof result.output === "string") {
      return result.output;
    }

    try {
      return JSON.stringify(result, null, 2);
    } catch {}
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
          const result = await spec.execute(
            null,
            args,
            ctx.abort,
            () => {},
            createLegacyCtx(pluginInput, {
              pi: createSessionApi(pluginInput.client, ctx.sessionID, ctx.directory, ctx.worktree),
            }),
          );
          return normalizeToolResult(result, ctx);
        },
      }),
    ]),
  );
}

export const ${exportName} = async (pluginInput) => {
  const initFn = await loadRuntimeInit(new URL("./${runtimeFile}", import.meta.url));
  const registry = createPiRegistry();
  if (typeof initFn === "function") {
    initFn(registry);
  }

  const hooks = {};

  if (registry._state.tools.length > 0) {
    hooks.tool = buildToolMap(registry, pluginInput);
  }

  if ((registry._state.handlers.get("before_agent_start") ?? []).length > 0) {
    hooks["experimental.chat.system.transform"] = async (input, output) => {
      const event = { systemPrompt: output.system.join("\\n\\n") };
      const result = await dispatch(registry, "before_agent_start", pluginInput, event);
      const systemPrompt = result?.systemPrompt ?? event.systemPrompt;
      output.system = systemPrompt ? [systemPrompt] : [];
    };
  }

  if ((registry._state.handlers.get("tool_execution_start") ?? []).length > 0) {
    hooks["tool.execute.before"] = async (input, output) => {
      await dispatch(registry, "tool_execution_start", pluginInput, input, {
        pi: createSessionApi(pluginInput.client, input.sessionID, pluginInput.directory, pluginInput.worktree),
      });
    };
  }

  if ((registry._state.handlers.get("tool_execution_end") ?? []).length > 0) {
    hooks["tool.execute.after"] = async (input, output) => {
      await dispatch(registry, "tool_execution_end", pluginInput, { ...input, result: output }, {
        pi: createSessionApi(pluginInput.client, input.sessionID, pluginInput.directory, pluginInput.worktree),
      });
    };
  }

  if (registry._state.handlers.size > 0) {
    hooks.event = async ({ event }) => {
      const sessionID = event.properties?.sessionID ?? event.properties?.info?.sessionID;
      const pi = sessionID
        ? createSessionApi(pluginInput.client, sessionID, pluginInput.directory, pluginInput.worktree)
        : undefined;

      if (event.type === "session.created") {
        await dispatch(registry, "session_start", pluginInput, event.properties, { pi });
        return;
      }

      if (event.type === "session.deleted") {
        await dispatch(registry, "session_shutdown", pluginInput, event.properties, { pi });
        return;
      }

      if (event.type === "session.status" && event.properties?.status?.type === "busy") {
        await dispatch(registry, "agent_start", pluginInput, event.properties, { pi });
        return;
      }

      if (event.type === "message.updated" && event.properties?.info?.role === "assistant") {
        await dispatch(registry, "message_end", pluginInput, { message: event.properties.info }, { pi });
        return;
      }

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

function generateOpenCodePlugins(entries) {
  mkdirSync(OPENCODE_PLUGINS_DIR, { recursive: true });

  for (const entry of entries) {
    const pluginFile = path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.ts`);
    const pluginImplFile = path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.impl.mjs`);
    const runtimeFile = path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.runtime.cjs`);
    const runtimeJs = entry.runtimeOutputFile;

    const staleMjs = path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.mjs`);
    if (existsSync(staleMjs)) {
      rmSync(staleMjs, { force: true });
    }

    const staleImplTs = path.join(OPENCODE_PLUGINS_DIR, `${entry.outputName}.impl.ts`);
    if (existsSync(staleImplTs)) {
      rmSync(staleImplTs, { force: true });
    }

    writeFileSync(pluginFile, renderOpenCodePluginEntry(entry), "utf8");
    writeFileSync(pluginImplFile, renderOpenCodePluginImpl(entry), "utf8");
    if (existsSync(runtimeJs)) {
      writeFileSync(runtimeFile, readFileSync(runtimeJs, "utf8"), "utf8");
    }
  }
}

// ============================================================
// Main
// ============================================================

function main() {
  const entries = getAllSources();

  if (entries.length === 0) {
    console.log("eta-mu: no extension sources found.");
    console.log(`  Global: ${path.join(globalRoot, "src")}/**/*.cljs`);
    if (hasLocal) {
      console.log(`  Local:  ${path.join(localRoot, "src")}/**/*.cljs`);
    }
    console.log("\nCreate a .cljs file under src/ with a (ns ...) and (em/defextension ...) to get started.");
    process.exit(0);
  }

  console.log(`eta-mu: discovered ${entries.length} extension(s)`);
  const piSkipped = entries.filter((entry) => !entry.piEnabled);
  for (const entry of piSkipped) {
    console.log(`  pi-skip ${entry.outputName}: legacy extension present at ${entry.piLegacyPath}`);
  }

  if (mode === "clean") {
    console.log("  cleaning all outputs...");
    cleanAll(entries);
    console.log("  done.");
    process.exit(0);
  }

  if (mode !== "release" && mode !== "watch") {
    console.error(`error: unsupported mode: ${mode}. Use release, watch, or clean.`);
    process.exit(1);
  }

  // Generate wrapper files
  generateWrappers(entries);
  console.log("  generated wrapper files");

  // Generate shadow-cljs.edn
  writeFileSync(path.join(globalRoot, "shadow-cljs.edn"), renderShadowConfig(entries), "utf8");
  console.log("  generated shadow-cljs.edn");

  cleanStaleOutputs(entries);
  ensurePiOutputDirs(entries);
  ensureOpenCodeOutputDirs(entries);
  writeIndexTs(entries);

  const result = runShadow(mode, entries);
  if (result.status !== 0) {
    console.error("error: shadow-cljs build failed");
    process.exit(result.status);
  }

  deployPiRuntimes(entries);
  cleanStaleOutputs(entries);
  generateOpenCodePlugins(entries);

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
