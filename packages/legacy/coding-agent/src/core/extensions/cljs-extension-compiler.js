import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG_DIR_NAME = ".ημ";

function getUserEtaMuDir() {
  const root = join(homedir(), CONFIG_DIR_NAME);
  mkdirSync(root, { recursive: true });
  return root;
}

function getCacheDir() {
  return join(getUserEtaMuDir(), "agent", "extensions", ".cljs-cache");
}

function resolveEtaMuExtensionsRoot() {
  try {
    const pkgJson = import.meta.resolve("@open-hax/eta-mu-extensions/package.json");
    return dirname(fileURLToPath(pkgJson));
  } catch {
    return resolve(__dirname, "../../../../../extensions");
  }
}

function resolveShadowCljsBinary() {
  const fromPackage = join(resolveEtaMuExtensionsRoot(), "node_modules", ".bin", "shadow-cljs");
  if (existsSync(fromPackage)) return fromPackage;

  const fromSibling = resolve(__dirname, "../../../../../extensions/node_modules/.bin/shadow-cljs");
  if (existsSync(fromSibling)) return fromSibling;

  return "shadow-cljs";
}

function namespaceToPath(ns) {
  return ns.replace(/\./g, "/").replace(/-/g, "_") + ".cljs";
}

function parseNamespace(source) {
  const match = source.match(/\(ns\s+([a-zA-Z0-9.\-]+)/);
  return match ? match[1] : null;
}

function parseDefextensionSymbol(source) {
  const match = source.match(/\(\s*(?:[a-zA-Z0-9.\-]+\/)?defextension\s+([^\s()]+)/);
  return match ? match[1] : null;
}

function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

function isCacheValid(cacheDir, sourcePath) {
  const compiled = join(cacheDir, "target", "runtime.js");
  if (!existsSync(compiled)) return false;

  const source = existsSync(sourcePath) ? readFileSync(sourcePath, "utf-8") : "";
  const sourceHash = sha256(source);
  const hashFile = join(cacheDir, ".source-hash");
  if (!existsSync(hashFile)) return false;

  const cachedHash = readFileSync(hashFile, "utf-8").trim();
  return cachedHash === sourceHash;
}

function writeCacheHash(cacheDir, sourcePath) {
  const source = readFileSync(sourcePath, "utf-8");
  writeFileSync(join(cacheDir, ".source-hash"), sha256(source), "utf-8");
}

function externsPromiseJs() {
  return "var Promise = function() {};\nPromise.prototype.then = function() {};\nPromise.prototype.catch = function() {};\n";
}

function generateDefextensionWrapper(userNs, sym) {
  return `(ns eta-mu.user-extension-wrapper
  (:require [${userNs} :as ext]))

(defn- tool-parameters->schema [params]
  (when params
    (let [required (->> params
                        (remove (fn [[_ spec]] (:optional spec)))
                        (map (comp name key))
                        vec)
          properties (into {}
                           (map (fn [[k spec]]
                                  [(name k) (dissoc spec :optional)]))
                           params)
          schema (cond-> {:type "object"
                          :properties properties
                          :additionalProperties false}
                   (seq required) (assoc :required required))]
      (clj->js schema))))

(defn ^:export init [pi]
  (let [spec ext/${sym}]
    (when-let [init-fn (:init spec)]
      (init-fn pi))
    (doseq [cmd (:commands spec)]
      (.call (aget pi "registerCommand") pi (:name cmd)
             #js {:description (:description cmd) :handler (:handler cmd)}))
    (doseq [tool (:tools spec)]
      (.call (aget pi "registerTool") pi
             #js {:name        (:name tool)
                  :label       (:label tool)
                  :description (:description tool)
                  :parameters  (tool-parameters->schema (:parameters tool))
                  :execute     (:execute tool)}))
    (doseq [evt (:events spec)]
      (.call (aget pi "on") pi (:event evt) (:handler evt)))
    nil))
`;
}

function runShadowCljs(cwd, args) {
  return new Promise((resolve, reject) => {
    const bin = resolveShadowCljsBinary();
    const proc = spawn(bin, args, { cwd, stdio: "pipe" });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("error", (err) => {
      reject(err);
    });

    proc.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

/**
 * Compile a user ClojureScript extension to a loadable Node.js module.
 *
 * The .cljs file must declare a namespace and export an init function:
 *
 *   (ns my-extension)
 *   (defn ^:export init [pi]
 *     ...)
 *
 * Or use the eta-mu.core defextension DSL:
 *
 *   (ns my-extension
 *     (:require-macros [eta-mu.core :as em]))
 *   (em/defextension my-extension
 *     ...)
 *
 * Compilation artifacts are cached under ~/.ημ/agent/extensions/.cljs-cache/
 * keyed by the source file content hash, so recompilation only happens when
 * the file changes.
 */
export async function compileCljsExtension(sourcePath, options = {}) {
  if (!sourcePath.endsWith(".cljs")) {
    throw new Error(`Not a ClojureScript extension file: ${sourcePath}`);
  }

  if (!existsSync(sourcePath)) {
    throw new Error(`ClojureScript extension file not found: ${sourcePath}`);
  }

  const source = readFileSync(sourcePath, "utf-8");
  const ns = parseNamespace(source);
  if (!ns) {
    throw new Error(`Could not parse namespace from ClojureScript extension: ${sourcePath}`);
  }

  const cacheDir = join(getCacheDir(), sha256(source));
  const cacheTarget = join(cacheDir, "target", "runtime.js");

  if (isCacheValid(cacheDir, sourcePath)) {
    return { jsPath: cacheTarget, cacheHit: true };
  }

  rmSync(cacheDir, { recursive: true, force: true });
  mkdirSync(join(cacheDir, "src"), { recursive: true });
  mkdirSync(join(cacheDir, "externs"), { recursive: true });

  const defextensionSym = parseDefextensionSymbol(source);

  let entryNamespace = ns;
  let exportSymbol = "init";

  if (defextensionSym) {
    entryNamespace = "eta-mu.user-extension-wrapper";
    exportSymbol = "init";
    const wrapperPath = join(cacheDir, "src", namespaceToPath(entryNamespace));
    mkdirSync(dirname(wrapperPath), { recursive: true });
    writeFileSync(wrapperPath, generateDefextensionWrapper(ns, defextensionSym), "utf-8");
  }

  // Symlink node_modules so shadow-cljs can resolve its own npm package and any deps.
  const etaMuExtRoot = resolveEtaMuExtensionsRoot();
  const nodeModulesSrc = join(etaMuExtRoot, "node_modules");
  if (existsSync(nodeModulesSrc)) {
    try {
      symlinkSync(nodeModulesSrc, join(cacheDir, "node_modules"), "junction");
    } catch {
      // Best-effort; shadow-cljs may still resolve via global install or parent dirs.
    }
  }

  const destPath = join(cacheDir, "src", namespaceToPath(ns));
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, source, "utf-8");

  const libRel = relative(cacheDir, join(etaMuExtRoot, "lib")).replace(/\\/g, "/");

  const sourcePaths = ["src", libRel, ...(options.extraSourcePaths ?? [])];

  const shadowConfig = `{\n` +
    `:source-paths [${sourcePaths.map((p) => `"${p}"`).join(" ")}]\n` +
    `:dependencies []\n` +
    `:builds\n` +
    ` {:extension\n` +
    `  {:target :node-library\n` +
    `   :output-to "target/runtime.js"\n` +
    `   :exports {:default ${entryNamespace}/${exportSymbol}}\n` +
    `   :compiler-options {:externs ["externs/promise.js"]}}}}\n`;

  writeFileSync(join(cacheDir, "shadow-cljs.edn"), shadowConfig, "utf-8");
  writeFileSync(join(cacheDir, "externs", "promise.js"), externsPromiseJs(), "utf-8");

  const { code, stderr } = await runShadowCljs(cacheDir, ["compile", "extension"]);
  if (code !== 0) {
    throw new Error(`shadow-cljs compilation failed for ${sourcePath}:\n${stderr}`);
  }

  if (!existsSync(cacheTarget)) {
    throw new Error(`shadow-cljs did not produce expected output: ${cacheTarget}`);
  }

  writeCacheHash(cacheDir, sourcePath);

  return { jsPath: cacheTarget, cacheHit: false };
}
