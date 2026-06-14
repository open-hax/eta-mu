#!/usr/bin/env node
/**
 * Validate that all extension paths declared in package.json exist after build.
 *
 * This script catches missing built-in extension package targets before
 * `eta-mu-beta` or release users see startup errors.
 *
 * Usage:
 *   node scripts/validate-extension-paths.mjs
 *
 * Exit codes:
 *   0 - All extension paths exist
 *   1 - One or more extension paths are missing
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");

function loadPackageJson() {
  const pkgPath = resolve(PACKAGE_ROOT, "package.json");
  try {
    return JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch (err) {
    console.error(`Failed to read package.json: ${err.message}`);
    process.exit(1);
  }
}

function validateExtensionPaths() {
  const pkg = loadPackageJson();
  const extensions = pkg.pi?.extensions;

  if (!extensions || !Array.isArray(extensions)) {
    console.error("No pi.extensions array found in package.json");
    process.exit(1);
  }

  console.log("Validating extension paths...");
  console.log(`Package root: ${PACKAGE_ROOT}\n`);

  const missing = [];
  const valid = [];

  for (const extPath of extensions) {
    const fullPath = resolve(PACKAGE_ROOT, extPath);
    if (existsSync(fullPath)) {
      valid.push(extPath);
      console.log(`  ✓ ${extPath}`);
    } else {
      missing.push(extPath);
      console.log(`  ✗ ${extPath} (MISSING)`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Results: ${valid.length} valid, ${missing.length} missing`);

  if (missing.length > 0) {
    console.log("\nMissing extension paths:");
    for (const p of missing) {
      console.log(`  - ${p}`);
    }
    console.log("\nRecovery command:");
    console.log("  pnpm --dir packages/eta-mu-extensions build");
    process.exit(1);
  }

  console.log("\nAll extension paths validated successfully.");
  process.exit(0);
}

validateExtensionPaths();
