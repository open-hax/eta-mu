// SPDX-License-Identifier: GPL-3.0-or-later

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const RECOVERY_SCHEMA = "open-hax.review-recovery/v1";
const MAX_ATTEMPTS = 2;

function submissionState(submissionFile) {
  if (!fs.existsSync(submissionFile)) return "missing";
  try {
    JSON.parse(fs.readFileSync(submissionFile, "utf8"));
    return "present";
  } catch {
    return "malformed";
  }
}

function correctivePrompt(basePrompt) {
  return `${basePrompt.trimEnd()}

Corrective attempt 2 of 2: the first completed model invocation omitted the
required review_submit artifact. Start the evidence-first review state machine
again with review_begin; do not assume any in-memory state survived the first
process. Complete every required stage and do not end until review_submit has
returned ok. This is the only recovery attempt.
`;
}

function writeRecovery(metadataFile, metadata) {
  fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
}

/**
 * Run one review attempt and exactly one corrective attempt when, and only
 * when, the first completed invocation omitted the review_submit artifact.
 * Schema validation remains a separate pre-publication boundary because it
 * requires the live pull-request changed-line index.
 */
export async function runReviewRecovery({
  evidenceDirectory,
  basePrompt,
  submissionFile = path.join(evidenceDirectory, "submission.json"),
  invokeAttempt,
}) {
  if (!evidenceDirectory) throw new Error("evidenceDirectory is required");
  if (typeof basePrompt !== "string" || basePrompt.trim().length === 0) {
    throw new Error("basePrompt must be a non-empty string");
  }
  if (typeof invokeAttempt !== "function") throw new Error("invokeAttempt is required");

  fs.mkdirSync(evidenceDirectory, { recursive: true });
  const metadataFile = path.join(evidenceDirectory, "recovery.json");
  const metadata = {
    schema: RECOVERY_SCHEMA,
    max_attempts: MAX_ATTEMPTS,
    recovery_reason: null,
    attempts: [],
  };

  if (fs.existsSync(submissionFile)) {
    throw new Error(`refusing pre-existing review submission: ${submissionFile}`);
  }

  let prompt = basePrompt;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const responseFile = path.join(evidenceDirectory, `model-response-attempt-${attempt}.txt`);
    const stderrFile = path.join(evidenceDirectory, `opencode-stderr-attempt-${attempt}.log`);
    const result = await invokeAttempt({ attempt, prompt, responseFile, stderrFile });
    if (!fs.existsSync(responseFile)) fs.writeFileSync(responseFile, "");
    if (!fs.existsSync(stderrFile)) fs.writeFileSync(stderrFile, "");

    const state = submissionState(submissionFile);
    metadata.attempts.push({
      attempt,
      exit_code: result?.exitCode ?? null,
      response_file: path.basename(responseFile),
      stderr_file: path.basename(stderrFile),
      submission_state: state,
    });
    writeRecovery(metadataFile, metadata);

    if (result?.exitCode !== 0) {
      throw new Error(`OpenCode review attempt ${attempt} exited ${result?.exitCode ?? "without a code"}`);
    }
    if (state === "present") return metadata;
    if (state === "malformed") {
      throw new Error(`malformed review submission after attempt ${attempt}`);
    }
    if (attempt === MAX_ATTEMPTS) {
      throw new Error(`reviewer omitted review_submit after ${MAX_ATTEMPTS} attempts`);
    }

    metadata.recovery_reason = "missing_review_submit";
    writeRecovery(metadataFile, metadata);
    prompt = correctivePrompt(basePrompt);
  }

  throw new Error("unreachable review recovery state");
}

async function invokeOpenCode({ prompt, responseFile, stderrFile }) {
  const opencodeBin = process.env.OPENCODE_BIN || "opencode";
  const reviewModel = process.env.REVIEW_MODEL;
  if (!reviewModel) throw new Error("REVIEW_MODEL is required");

  const response = fs.createWriteStream(responseFile, { flags: "w" });
  const stderr = fs.createWriteStream(stderrFile, { flags: "w" });
  const child = spawn(
    opencodeBin,
    ["run", "--agent", "github-reviewer", "--model", reviewModel, prompt],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  child.stdout.on("data", (chunk) => {
    response.write(chunk);
    process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    stderr.write(chunk);
    process.stderr.write(chunk);
  });

  const exit = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code, signal) => resolve({ code, signal }));
  });
  response.end();
  stderr.end();
  await Promise.all([finished(response), finished(stderr)]);

  if (exit.signal) throw new Error(`OpenCode review terminated by ${exit.signal}`);
  return { exitCode: exit.code };
}

async function main() {
  const prNumber = process.env.PR_NUMBER;
  const promptFile = process.env.REVIEW_PROMPT_FILE;
  const evidenceDirectory = process.env.REVIEW_EVIDENCE_DIR;
  if (!/^\d+$/.test(prNumber || "")) throw new Error("PR_NUMBER must be numeric");
  if (!promptFile) throw new Error("REVIEW_PROMPT_FILE is required");
  if (!evidenceDirectory) throw new Error("REVIEW_EVIDENCE_DIR is required");

  const promptTemplate = fs.readFileSync(promptFile, "utf8");
  const basePrompt = promptTemplate.replaceAll("{{PR_NUMBER}}", prNumber);
  await runReviewRecovery({ evidenceDirectory, basePrompt, invokeAttempt: invokeOpenCode });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  });
}
