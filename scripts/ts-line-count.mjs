#!/usr/bin/env node
/**
 * ts-line-count.mjs — Count TypeScript lines in the eta-mu monorepo.
 *
 * Usage:
 *   node scripts/ts-line-count.mjs                # full report (global, per-project, per-file)
 *   node scripts/ts-line-count.mjs --global        # global total only
 *   node scripts/ts-line-count.mjs --json          # machine-readable output
 *   node scripts/ts-line-count.mjs --check <prev>  # exit 1 if current > prev
 *
 * Designed for pre-commit hook: captures a baseline, then rejects commits
 * that introduce new TypeScript lines.
 */

import { execSync } from "node:child_process";
import { resolve, relative, dirname } from "node:path";
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const ROOT = resolve(import.meta.dirname, "..");

const args = process.argv.slice(2);
const FLAG_JSON = args.includes("--json");
const FLAG_GLOBAL = args.includes("--global");
const FLAG_CHECK = args.includes("--check");
const FLAG_CHECK_VALUE = FLAG_CHECK ? args[args.indexOf("--check") + 1] : null;

// ── Collect all TS files ────────────────────────────────────────────────

function findTsFiles() {
  const raw = execSync(
    `find . -type f \\( -name '*.ts' -o -name '*.tsx' \\) ! -path '*/node_modules/*' ! -path '*/dist/*' ! -path '*/.shadow-cljs/*' ! -path '*/.git/*'`,
    { cwd: ROOT, encoding: "utf8" }
  );
  return raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((p) => p.replace(/^\.\//, ""));
}

// ── Count lines in a file ───────────────────────────────────────────────

function countLines(filePath) {
  try {
    const content = readFileSync(resolve(ROOT, filePath), "utf8");
    return content.split("\n").length;
  } catch {
    return 0;
  }
}

// ── Group by project (first two path segments: packages/X or services/X) ─

function projectKey(filePath) {
  const parts = filePath.split("/");
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return parts[0];
}

// ── Main ────────────────────────────────────────────────────────────────

const files = findTsFiles();

const fileLines = files.map((f) => ({
  file: f,
  lines: countLines(f),
}));

const globalTotal = fileLines.reduce((sum, f) => sum + f.lines, 0);

const byProject = {};
for (const { file, lines } of fileLines) {
  const proj = projectKey(file);
  byProject[proj] = (byProject[proj] || 0) + lines;
}

// ── Check mode (for pre-commit) ────────────────────────────────────────

if (FLAG_CHECK) {
  const prev = parseInt(FLAG_CHECK_VALUE, 10);
  if (isNaN(prev)) {
    console.error(`ts-line-count: invalid previous count "${FLAG_CHECK_VALUE}"`);
    process.exit(1);
  }
  if (globalTotal > prev) {
    console.error(`\n❌ TYPESCRIPT LINE COUNT INCREASED`);
    console.error(`   Previous commit: ${prev} lines`);
    console.error(`   This commit:    ${globalTotal} lines`);
    console.error(`   Delta:          +${globalTotal - prev} lines`);
    console.error(`\n   TypeScript is DEPRECATED in this repo.`);
    console.error(`   New code must be written in ClojureScript.`);
    console.error(`   If you must touch TS, ensure net line count does not increase.\n`);
    process.exit(1);
  }
  if (globalTotal < prev) {
    console.log(`✅ TypeScript lines decreased: ${prev} → ${globalTotal} (−${prev - globalTotal})`);
  } else {
    console.log(`✅ TypeScript lines unchanged: ${globalTotal}`);
  }
  process.exit(0);
}

// ── JSON output ─────────────────────────────────────────────────────────

if (FLAG_JSON) {
  console.log(
    JSON.stringify(
      {
        global: globalTotal,
        byProject,
        files: FLAG_GLOBAL ? undefined : fileLines,
      },
      null,
      2
    )
  );
  process.exit(0);
}

// ── Human-readable report ───────────────────────────────────────────────

console.log(`\n📊 TypeScript Line Count Report`);
console.log(`${"─".repeat(50)}`);
console.log(`GLOBAL TOTAL: ${globalTotal} lines\n`);

if (!FLAG_GLOBAL) {
  console.log(`By Project:`);
  const sorted = Object.entries(byProject).sort((a, b) => b[1] - a[1]);
  for (const [proj, lines] of sorted) {
    console.log(`  ${lines.toString().padStart(8)}  ${proj}`);
  }

  console.log(`\nBy File (top 30):`);
  const topFiles = [...fileLines].sort((a, b) => b.lines - a.lines).slice(0, 30);
  for (const { file, lines } of topFiles) {
    console.log(`  ${lines.toString().padStart(8)}  ${file}`);
  }
}
