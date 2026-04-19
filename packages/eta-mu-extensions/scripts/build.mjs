#!/usr/bin/env node

/**
 * eta-mu local deployment script
 *
 * Compiles extensions via shadow-cljs (using the committed shadow-cljs.edn)
 * then copies built runtimes to Pi and OpenCode install paths.
 *
 * shadow-cljs.edn is source-controlled and is NOT rewritten by this script.
 * To add an extension: add .cljs + build entry in shadow-cljs.edn + entry in manifest.edn.
 *
 * Usage:
 *   node scripts/build.mjs [release|watch|clean]
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
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT  = path.resolve(__dirname, "..");
const HOME      = homedir();
const mode      = process.argv[2] || "release";

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
    const piDir       = path.join(HOME, ".pi", "agent", "extensions", `cljs-${name}`);
    const ocDir       = path.join(HOME, ".config", "opencode", "plugins", name);
    return { name, source, absolutePath, runtimeFile, piDir, ocDir, npmDeps: ext[":npm-deps"] || [] };
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

// ── Deploy helpers ─────────────────────────────────────────────────────────

function deployExt(ext) {
  if (!existsSync(ext.runtimeFile)) {
    console.warn(`  warn: runtime not found for ${ext.name}, skipping deploy`);
    return;
  }

  // Pi
  mkdirSync(ext.piDir, { recursive: true });
  writeFileSync(path.join(ext.piDir, "runtime.js"), readFileSync(ext.runtimeFile, "utf8"), "utf8");
  writeFileSync(path.join(ext.piDir, "index.ts"), 'import runtime from "./runtime.js";\nexport default runtime;\n', "utf8");

  // npm dep symlinks for Pi
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

  // OpenCode
  mkdirSync(ext.ocDir, { recursive: true });
  writeFileSync(path.join(ext.ocDir, "runtime.cjs"), readFileSync(ext.runtimeFile, "utf8"), "utf8");

  console.log(`  deployed ${ext.name}`);
}

function cleanExt(ext) {
  rmSync(ext.piDir, { recursive: true, force: true });
  rmSync(ext.ocDir, { recursive: true, force: true });
  rmSync(path.dirname(ext.runtimeFile), { recursive: true, force: true });
}

// ── Pi settings.json ───────────────────────────────────────────────────────

const PI_SETTINGS = path.join(HOME, ".pi", "agent", "settings.json");

function syncPiSettings(exts) {
  if (!existsSync(PI_SETTINGS)) return;
  const settings = JSON.parse(readFileSync(PI_SETTINGS, "utf8"));
  const current  = new Set(settings.extensions || []);
  let changed = false;
  for (const ext of exts) {
    const p = `~/.pi/agent/extensions/cljs-${ext.name}/index.ts`;
    const abs = path.join(HOME, ".pi", "agent", "extensions", `cljs-${ext.name}`, "index.ts");
    if (existsSync(abs) && !current.has(p)) {
      current.add(p); changed = true;
      console.log(`  registered ${p} in settings.json`);
    }
  }
  // prune dead cljs-* entries
  for (const p of [...current]) {
    const m = p.match(/\/cljs-([^/]+)\/index\.ts$/);
    if (m) {
      const abs = path.join(HOME, ".pi", "agent", "extensions", `cljs-${m[1]}`, "index.ts");
      if (!existsSync(abs)) { current.delete(p); changed = true; console.log(`  pruned ${p}`); }
    }
  }
  if (changed) {
    settings.extensions = [...current];
    writeFileSync(PI_SETTINGS, JSON.stringify(settings, null, 2) + "\n", "utf8");
  } else {
    console.log("  settings.json up-to-date");
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

  // Deploy
  console.log("  deploying...");
  for (const ext of exts) deployExt(ext);
  syncPiSettings(exts);

  console.log("\neta-mu build complete:");
  for (const ext of exts) console.log(`  - ${ext.name}`);
}

main();
