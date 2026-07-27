#!/usr/bin/env node
/**
 * Axxium JS Boundary Scanner
 * Checks that CLJS code doesn't leak raw JS interop outside extern adapters.
 *
 * Modes:
 *   --check       require zero violations
 *   --max=N       ratchet mode: fail only when the known debt exceeds N
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SOURCE_DIR = "src/cljs";

const FORBIDDEN_PATTERNS = [
  /\baget\b/,
  /\baset\b/,
  /\bjs->clj\b/,
  /\bclj->js\b/,
];

const EXCLUDED_FILES = ["extern"];

function walkDir(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walkDir(path, callback);
    } else if (extname(path) === ".cljs") {
      callback(path);
    }
  }
}

function scanFile(path) {
  const content = readFileSync(path, "utf-8");
  const issues = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(line) && !line.includes(";")) {
        issues.push({ line: i + 1, pattern: pattern.source, text: line.trim() });
      }
    }
  }

  return issues;
}

function maxViolations(args) {
  const arg = args.find((value) => value.startsWith("--max="));
  if (!arg) return null;
  const rawValue = arg.slice("--max=".length);
  if (!/^\d+$/.test(rawValue)) {
    throw new Error(`Invalid boundary maximum: ${arg}`);
  }
  return Number(rawValue);
}

function main() {
  const args = process.argv.slice(2);
  const checkMode = args.includes("--check");
  const maximum = maxViolations(args);

  let totalIssues = 0;

  walkDir(SOURCE_DIR, (path) => {
    if (EXCLUDED_FILES.some((excluded) => path.includes(excluded))) return;

    const issues = scanFile(path);
    if (issues.length > 0) {
      console.log(`\n${path}:`);
      for (const issue of issues) {
        console.log(`  Line ${issue.line}: ${issue.pattern}`);
        console.log(`    ${issue.text}`);
      }
      totalIssues += issues.length;
    }
  });

  if (totalIssues > 0) {
    console.log(`\n${totalIssues} boundary violation(s) found`);
  } else {
    console.log("No boundary violations found");
  }

  if (checkMode && totalIssues > 0) {
    process.exit(1);
  }
  if (maximum !== null && totalIssues > maximum) {
    console.error(
      `Boundary debt increased: ${totalIssues} violations exceeds baseline ${maximum}`,
    );
    process.exit(1);
  }
  if (maximum !== null) {
    console.log(`Boundary ratchet passed: ${totalIssues} <= ${maximum}`);
  }
}

main();
