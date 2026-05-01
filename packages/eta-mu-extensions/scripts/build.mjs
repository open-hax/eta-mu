#!/usr/bin/env node

/**
 * eta-mu local build + registration script
 *
 * Compiles extensions via shadow-cljs (using the committed shadow-cljs.edn)
 * then materializes eta-mu/OpenCode target wrappers under this package's dist/ dir.
 * Pi consumes these from the package metadata/built-in extension list; this script
 * must not mutate host settings.json files.
 *
 * shadow-cljs.edn is source-controlled and is NOT rewritten by this script.
 * To add an extension: add .cljs + build entry in shadow-cljs.edn + entry in manifest.edn.
 *
 * Usage:
 *   node scripts/build.mjs [release|watch|clean]
 */

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  symlinkSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT  = path.resolve(__dirname, "..");
const HOME      = homedir();
const mode      = process.argv[2] || "release";
const DIST_ROOT = path.join(PKG_ROOT, "dist");

// ── Minimal EDN parser (manifest subset only) ──────────────────────────────

function tokenizeEdn(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i])) { i++; continue; }
    if (text[i] === ";") { while (i < text.length && text[i] !== "\n") i++; continue; }
    if (text[i] === '"') {
      let s = ""; i++;
      while (i < text.length && text[i] !== '"') {
        if (text[i] === "\\") { i++; s += text[i]; } else { s += text[i]; }
        i++;
      }
      i++; tokens.push(s); continue;
    }
    if ("[]{}".includes(text[i])) { tokens.push(text[i]); i++; continue; }
    let buf = "";
    while (i < text.length && !/[\s\[\]{}";]/.test(text[i])) { buf += text[i]; i++; }
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
    if (tok === "[") {
      pos++; const items = [];
      while (pos < tokens.length && tokens[pos] !== "]") items.push(parseValue());
      pos++; return items;
    }
    if (tok === "{") {
      pos++; const map = {};
      while (pos < tokens.length && tokens[pos] !== "}") {
        const key = parseValue(); const val = parseValue(); map[key] = val;
      }
      pos++; return map;
    }
    pos++;
    if (tok === "true") return true;
    if (tok === "false") return false;
    if (tok === "nil") return null;
    if (/^-?\d+(\.\d+)?$/.test(tok)) return Number(tok);
    return tok;
  }
  return parseValue();
}

// ── Manifest ───────────────────────────────────────────────────────────────

function loadManifest() {
  const p = path.join(PKG_ROOT, "manifest.edn");
  if (!existsSync(p)) { console.error("error: manifest.edn not found at", p); process.exit(1); }
  return parseEdn(readFileSync(p, "utf8"));
}

function expandPath(p) {
  if (!p) return p;
  if (p.startsWith("~/")) return path.join(HOME, p.slice(2));
  if (path.isAbsolute(p)) return p;
  return path.resolve(PKG_ROOT, p);
}

function resolvedExtensions(manifest) {
  return (manifest[":extensions"] || []).map((ext) => {
    const name   = ext[":name"];
    const source = ext[":source"];
    const relPath = ext[":path"];
    const absolutePath = expandPath(relPath);
    // Where shadow-cljs writes the compiled output (relative to PKG_ROOT)
    const runtimeFile = path.join(PKG_ROOT, "target", "runtime", name, "runtime.js");
    const runtimeCjs  = path.join(DIST_ROOT, "runtime", `${name}.cjs`);
    const piDir       = path.join(DIST_ROOT, "pi", `cljs-${name}`);
    const piIndex     = path.join(piDir, "index.ts");
    const opencodeFile = path.join(DIST_ROOT, "opencode", `${name}.mjs`);
    return { name, source, absolutePath, runtimeFile, runtimeCjs, piDir, piIndex, opencodeFile, npmDeps: ext[":npm-deps"] || [] };
  });
}

// ── Shadow-cljs ────────────────────────────────────────────────────────────

function shadowBinary() {
  // prefer local node_modules over global
  const candidates = [
    path.join(PKG_ROOT, "node_modules", ".bin", "shadow-cljs"),
    path.join(PKG_ROOT, "..", "..", "node_modules", ".bin", "shadow-cljs"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return "shadow-cljs"; // fall back to PATH
}

function runShadow(action, buildIds) {
  if (buildIds.length === 0) { console.log("  no build targets"); return 0; }
  const bin = shadowBinary();
  console.log(`  shadow-cljs ${action} ${buildIds.join(" ")}`);
  const r = spawnSync(bin, [action, ...buildIds], { cwd: PKG_ROOT, stdio: "inherit", shell: false });
  if (r.error) { console.error("error: could not start shadow-cljs:", r.error.message); return 1; }
  return r.status ?? 1;
}

// ── Target materialization helpers ──────────────────────────────────────────

function jsString(value) {
  return JSON.stringify(value);
}

function materializeExt(ext) {
  if (!existsSync(ext.runtimeFile)) {
    console.warn(`  warn: runtime not found for ${ext.name}, skipping target materialization`);
    return;
  }

  mkdirSync(path.dirname(ext.runtimeCjs), { recursive: true });
  writeFileSync(ext.runtimeCjs, readFileSync(ext.runtimeFile, "utf8"), "utf8");

  // eta-mu target: a tiny TypeScript wrapper consumed through built-in package
  // metadata; nothing is copied into a host-owned extensions directory.
  mkdirSync(ext.piDir, { recursive: true });
  const piRuntimeRel = path.relative(ext.piDir, ext.runtimeCjs).replaceAll(path.sep, "/");
  writeFileSync(
    ext.piIndex,
    `import runtimeModule from ${jsString(`./${piRuntimeRel}`)};\n` +
      `const runtime = (runtimeModule as { default?: unknown }).default ?? runtimeModule;\n` +
      `export default runtime;\n`,
    "utf8",
  );

  // npm dep symlinks for Pi wrappers. Keep dependencies in the package target,
  // not in host config/plugin directories.
  for (const dep of ext.npmDeps) {
    const nmDir = path.join(ext.piDir, "node_modules");
    const parts = dep.split("/");
    const scopeDir = dep.startsWith("@") ? path.join(nmDir, parts[0]) : nmDir;
    mkdirSync(scopeDir, { recursive: true });
    const linkTarget = dep.startsWith("@") ? path.join(scopeDir, parts[1]) : path.join(nmDir, dep);
    const src = path.join(HOME, ".ημ", "node_modules", dep);
    if (existsSync(src) && !existsSync(linkTarget)) {
      symlinkSync(src, linkTarget, "junction");
      console.log(`    linked ${dep} -> ${ext.name}`);
    }
  }

  // OpenCode target: ESM wrapper exporting a function, because dynamic import of
  // a raw shadow-cljs UMD/CJS bundle yields an object wrapper rather than the
  // plugin initializer function OpenCode expects.
  mkdirSync(path.dirname(ext.opencodeFile), { recursive: true });
  const ocRuntimeRel = path.relative(path.dirname(ext.opencodeFile), ext.runtimeCjs).replaceAll(path.sep, "/");
  writeFileSync(
    ext.opencodeFile,
    `import runtimeModule from ${jsString(`./${ocRuntimeRel}`)};\n` +
      `const runtime = runtimeModule.default ?? runtimeModule;\n` +
      `export default runtime;\n`,
    "utf8",
  );

  console.log(`  built targets for ${ext.name}`);
}

function cleanExt(ext) {
  rmSync(path.dirname(ext.runtimeFile), { recursive: true, force: true });
}

// ── Legacy host install cleanup ─────────────────────────────────────────────

function removeLegacyHostCopies(exts) {
  for (const ext of exts) {
    const legacyOpenCodeDir = path.join(HOME, ".config", "opencode", "plugins", ext.name);
    if (existsSync(legacyOpenCodeDir)) {
      rmSync(legacyOpenCodeDir, { recursive: true, force: true });
      console.log(`  removed legacy host copy ${legacyOpenCodeDir}`);
    }
  }
}

// ── OpenCode opencode.jsonc ─────────────────────────────────────────────────

const OPENCODE_CONFIG = path.join(HOME, ".config", "opencode", "opencode.jsonc");

function stripJsonComments(text) {
  let out = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; out += ch; continue; }
    if (ch === "/" && next === "/") { while (i < text.length && text[i] !== "\n") i++; out += "\n"; continue; }
    if (ch === "/" && next === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i++; continue; }
    out += ch;
  }
  return out.replace(/,\s*([}\]])/g, "$1");
}

function syncOpenCodeConfig(exts) {
  if (!existsSync(OPENCODE_CONFIG)) return;
  const config = JSON.parse(stripJsonComments(readFileSync(OPENCODE_CONFIG, "utf8")));
  const current = new Set(config.plugin || []);
  const managedNames = new Set(exts.map((ext) => ext.name));
  let changed = false;

  for (const ext of exts) {
    const p = pathToFileURL(ext.opencodeFile).href;
    if (existsSync(ext.opencodeFile) && !current.has(p)) {
      current.add(p); changed = true;
      console.log(`  registered ${p} in opencode.jsonc`);
    }
  }

  for (const p of [...current]) {
    let pathname = "";
    try { pathname = p.startsWith("file://") ? fileURLToPath(p) : p; }
    catch { pathname = p; }
    const legacy = pathname.match(/\.config\/opencode\/plugins\/([^/]+)\/runtime\.cjs$/);
    const target = pathname.match(/\/dist\/opencode\/([^/]+)\.mjs$/);
    const name = legacy?.[1] || target?.[1];
    if (name && managedNames.has(name)) {
      const isPackageTarget = Boolean(target) && path.resolve(pathname).startsWith(path.join(DIST_ROOT, "opencode") + path.sep);
      if (!isPackageTarget || !existsSync(pathname)) {
        current.delete(p); changed = true; console.log(`  pruned ${p}`);
      }
    }
  }

  if (changed) {
    config.plugin = [...current];
    writeFileSync(OPENCODE_CONFIG, JSON.stringify(config, null, 2) + "\n", "utf8");
  } else {
    console.log("  opencode.jsonc up-to-date");
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const manifest = loadManifest();
  const exts     = resolvedExtensions(manifest);
  const buildIds = exts.map((e) => e.name);

  console.log(`eta-mu: ${exts.length} extension(s) in manifest`);

  if (mode === "clean") {
    console.log("  cleaning...");
    for (const ext of exts) cleanExt(ext);
    rmSync(DIST_ROOT, { recursive: true, force: true });
    const shadowCache = path.join(PKG_ROOT, ".shadow-cljs");
    if (existsSync(shadowCache)) rmSync(shadowCache, { recursive: true, force: true });
    console.log("  done.");
    return;
  }

  if (mode !== "release" && mode !== "watch") {
    console.error(`error: unsupported mode "${mode}". Use release, watch, or clean.`);
    process.exit(1);
  }

  // Compile
  const status = runShadow(mode, buildIds);
  if (status !== 0) { console.error("error: build failed"); process.exit(status); }

  if (mode === "watch") { console.log("  watching..."); return; }

  // Materialize package-root targets and remove stale managed host copies.
  // Pi registration is intentionally omitted: eta-mu ships these as built-ins
  // via package metadata, so build must not edit host settings.json files.
  console.log("  materializing package-root targets...");
  for (const ext of exts) materializeExt(ext);
  console.log("  removing legacy managed host copies...");
  removeLegacyHostCopies(exts);
  syncOpenCodeConfig(exts);

  console.log("\neta-mu build complete:");
  for (const ext of exts) console.log(`  - ${ext.name}`);
}

main();
