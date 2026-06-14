#!/usr/bin/env node
/**
 * CLI Smoke Test for eta-mu extensions.
 *
 * Starts the built CLI with built-in extensions and fails on
 * "Failed to load extension" errors.
 *
 * Usage:
 *   node scripts/cli-smoke-test.mjs
 *
 * Exit codes:
 *   0 - CLI started successfully without extension errors
 *   1 - CLI failed to start or reported extension errors
 */

import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");
const ETA_MU_ROOT = resolve(PACKAGE_ROOT, "../..");
const CLI_PATH = resolve(ETA_MU_ROOT, "packages/coding-agent/dist/cli.js");

const TIMEOUT_MS = 20_000;
const EXTENSION_ERROR_PATTERN = /Failed to load extension/i;

function runSmokeTest() {
  console.log("eta-mu CLI Smoke Test");
  console.log("====================\n");

  console.log(`CLI path: ${CLI_PATH}`);
  console.log(`Timeout: ${TIMEOUT_MS}ms\n`);

  try {
    // Run the CLI with --help to trigger extension loading
    const output = execSync(`timeout ${TIMEOUT_MS / 1000}s node "${CLI_PATH}" --help`, {
      cwd: ETA_MU_ROOT,
      env: {
        ...process.env,
        ETA_MU_NO_DEFAULT_EXTENSIONS: "0",
      },
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Check for extension loading errors
    if (EXTENSION_ERROR_PATTERN.test(output)) {
      console.error("FAIL: Extension loading error detected in output:");
      console.error(output);
      process.exit(1);
    }

    console.log("✓ CLI started successfully");
    console.log("✓ No extension loading errors detected");
    console.log("\nSmoke test passed.");
    process.exit(0);
  } catch (err) {
    if (err.status === 124) {
      console.error(`FAIL: CLI startup timed out after ${TIMEOUT_MS}ms`);
    } else {
      console.error(`FAIL: CLI startup failed with exit code ${err.status}`);
      if (err.stderr) {
        console.error("\nStderr:");
        console.error(err.stderr);
      }
      if (err.stdout) {
        console.error("\nStdout:");
        console.error(err.stdout);
      }
    }
    process.exit(1);
  }
}

runSmokeTest();
