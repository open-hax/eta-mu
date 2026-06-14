#!/usr/bin/env node
/**
 * Eta-mu Lint and Static Gates
 *
 * Runs all static quality checks for the eta-mu monorepo.
 *
 * Usage:
 *   node scripts/lint.mjs [--fix]
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const fix = args.includes("--fix");

function run(name, cmd, opts = {}) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Running: ${name}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    execSync(cmd, {
      cwd: opts.cwd || ROOT,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_OPTIONS: "--experimental-vm-modules",
      },
    });
    console.log(`\n✓ ${name} passed`);
    return true;
  } catch (err) {
    console.error(`\n✗ ${name} failed (exit code ${err.status})`);
    return false;
  }
}

const results = [];

// 1. Biome lint/format
// Use --diagnostic-level=error to only fail on errors, not warnings
const biomeCmd = fix
  ? "npx biome check --write --diagnostic-level=error ."
  : "npx biome check --diagnostic-level=error .";
results.push({ name: "Biome Lint/Format", ok: run("Biome Lint/Format", biomeCmd) });

// 2. TypeScript typecheck for key packages
results.push({
  name: "TypeScript Typecheck",
  ok: run("TypeScript Typecheck", "pnpm typecheck"),
});

// 3. CLJS boundary check for eta-mu-runtime
results.push({
  name: "CLJS Boundary Check",
  ok: run("CLJS Boundary Check", "pnpm --dir packages/eta-mu-runtime cljs:boundary"),
});

// 4. Extension path validation
results.push({
  name: "Extension Path Validation",
  ok: run("Extension Path Validation", "pnpm --dir packages/eta-mu-extensions validate-paths"),
});

// 5. Kanban markdown validation
results.push({
  name: "Kanban Markdown Validation",
  ok: run(
    "Kanban Markdown Validation",
    "node -e \"const fs=require('fs'); const files=fs.readdirSync('kanban/tasks').filter(f=>f.endsWith('.md')); let ok=true; for(const f of files){const c=fs.readFileSync('kanban/tasks/'+f,'utf8'); if(!c.includes('---')){console.error('Missing frontmatter: '+f); ok=false;}} if(ok)console.log('All kanban files have frontmatter'); process.exit(ok?0:1);\"",
  ),
});

// Summary
console.log(`\n${"=".repeat(60)}`);
console.log("LINT SUMMARY");
console.log(`${"=".repeat(60)}\n`);

let allPassed = true;
for (const r of results) {
  const status = r.ok ? "✓" : "✗";
  console.log(`  ${status} ${r.name}`);
  if (!r.ok) allPassed = false;
}

console.log(`\n${allPassed ? "All checks passed!" : "Some checks failed!"}`);
process.exit(allPassed ? 0 : 1);
