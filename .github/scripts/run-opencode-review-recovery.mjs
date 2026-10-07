// SPDX-License-Identifier: GPL-3.0-or-later

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";

const RECOVERY_SCHEMA = "open-hax.review-recovery/v1";
const MAX_ATTEMPTS = 2;

/**
 * Hash captured bytes without interpreting their contents.
 * @param {string|Buffer|TypedArray|DataView} bytes - Hash input.
 * @returns {string} Hexadecimal SHA-256 digest.
 */
function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

/** Return whether the submission file is missing, parseable JSON, or malformed. */
function submissionState(submissionFile) {
  if (!fs.existsSync(submissionFile)) return "missing";
  try {
    JSON.parse(fs.readFileSync(submissionFile, "utf8"));
    return "present";
  } catch {
    return "malformed";
  }
}

/** Return verified unavailable-tool evidence, or null when any recovery guard fails. */
function unavailableReviewTool(responseFile, stderrFile, reviewTools, exposedTools, strict = false) {
  // Only host-produced structured tool events can identify the failed call.
  // Model prose and tool output are nested strings, never control messages.
  try {
    const response = new TextDecoder("utf-8", { fatal: true }).decode(fs.readFileSync(responseFile));
    const events = response.split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line));
    const sessionID = events[0]?.sessionID;
    if (typeof sessionID !== "string" || !sessionID) return null;
    if (events.some((event) => event.sessionID !== sessionID || !Number.isSafeInteger(event.timestamp))) return null;
    const errors = events.filter((event) => event.type === "error");
    const permissionError = "The user rejected permission to use this specific tool call.";
    if (errors.length === 0 || events.at(-1).type !== "error" ||
        errors.some((event) => event.error?.name !== "UnknownError" || event.error?.data?.message !== permissionError)) return null;

    // The third internal call is rejected before it completes. The pinned CLI
    // emits the preceding two completed calls and then a session error, not a
    // third permission-error tool result. Retain only actually emitted IDs.
    const toolCalls = events.filter((event) => event.type === "tool_use");
    const calls = toolCalls.slice(-2);
    if (calls.length !== 2) return null;
    if (strict) {
      // This exception covers only the recognized unavailable-tool tail. Earlier
      // failed or unestablished calls cannot become eligible through that tail.
      // Canonical review validity remains the supplied Muse callback's authority.
      if (toolCalls.some(({ part }) => part?.state?.status !== "completed" ||
          (part.state.error != null && part.state.error !== false))) return null;
      for (const { part } of toolCalls.slice(0, -2)) {
        if (part.tool === "invalid") return null;
        if (typeof part.tool === "string" && part.tool.startsWith("review_")) {
          if (typeof part.state.output !== "string" ||
              JSON.parse(part.state.output)?.["ok?"] !== true) return null;
        }
      }
    }
    const requested = calls[0].part?.state?.input?.tool;
    if (typeof requested !== "string" || !/^[a-z][a-z0-9_]+$/.test(requested)) return null;
    const corrected = `review_${requested}`;
    if (!reviewTools.includes(corrected)) return null;
    const expectedError = `Model tried to call unavailable tool '${requested}'. Available tools: `;
    if (calls.some(({ part }) => part?.type !== "tool" || part.sessionID !== sessionID ||
        part.tool !== "invalid" || part.state?.status !== "completed" ||
        part.state.input?.tool !== requested || typeof part.state.input?.error !== "string" ||
        !part.state.input.error.startsWith(expectedError) ||
        !part.state.input.error.slice(expectedError.length).replace(/\.$/, "").split(", ").includes(corrected) ||
        typeof part.callID !== "string" || !part.callID)) return null;
    if (new Set(calls.map(({ part }) => part.callID)).size !== 2) return null;
    const prefix = toolCalls.slice(0, -2);
    if (strict && prefix.length) {
      /**
       * Check that a transport identity field is a nonempty string after trimming.
       * @param {*} value - Field to check without coercion.
       * @returns {boolean} Whether the value is a string with non-whitespace content.
       */
      const nonblank = (value) => typeof value === "string" && value.trim().length > 0;
      if (events.some((event, index) => event.timestamp < 0 ||
          (index > 0 && event.timestamp < events[index - 1].timestamp))) return null;
      if (toolCalls.some(({ part }) => !nonblank(part?.id) || !nonblank(part.callID)) ||
          new Set(toolCalls.map(({ part }) => part.id)).size !== toolCalls.length ||
          new Set(toolCalls.map(({ part }) => part.callID)).size !== toolCalls.length) return null;
      if (prefix.some(({ part }) => part.type !== "tool" || part.sessionID !== sessionID ||
          !nonblank(part.tool) || !part.state.input || typeof part.state.input !== "object" ||
          Array.isArray(part.state.input) || typeof part.state.output !== "string")) return null;
      if (Array.isArray(exposedTools)) {
        // Retry eligibility is narrower than canonical HOST validity: bind
        // every prefix name to the caller's prepared registry and both HOST
        // availability reports. Muse alone owns generic HOST semantics.
        const available = calls.map(({ part }) =>
          part.state.input.error.slice(expectedError.length).replace(/\.$/, "").split(", "));
        if (prefix.some(({ part }) => !exposedTools.includes(part.tool) ||
            !available.every((names) => names.includes(part.tool)))) return null;
      }
    }
    const stderr = stripVTControlCharacters(fs.readFileSync(stderrFile, "utf8"));
    if (!stderr.split(/\r?\n/).some((line) => /^!\s+permission requested: doom_loop \(invalid\); auto-rejecting$/.test(line.trim()))) return null;
    return { tool: requested, corrected_tool: corrected, session_id: sessionID,
      call_ids: calls.map(({ part }) => part.callID) };
  } catch {
    return null;
  }
}

/** Append the sole corrective-attempt instructions to the original review prompt. */
function correctivePrompt(basePrompt, toolFailure, staleCoverage = false) {
  const cause = toolFailure
    ? `the first model invocation failed without a review after repeatedly calling the unavailable tool ${toolFailure.tool}. Use the actual exposed name ${toolFailure.corrected_tool}; do not call the unavailable spelling again.`
    : staleCoverage
      ? "the canonical host-trace verifier established stale review coverage in the first completed invocation. Its assessment history cannot be repaired. Perform one fresh bounded model invocation over the whole unchanged input; finish all reads before assessing each page."
    : "the first completed model invocation omitted the required review_submit artifact.";
  return `${basePrompt.trimEnd()}

Corrective attempt 2 of 2: ${cause} Start the evidence-first review state machine
again with review_begin; do not assume any in-memory state survived the first
process. Complete every required stage and do not end until review_submit has
returned ok, unless a tool reports restart-required?. If restart-required? is
true, stop this invocation without calling review_submit; do not use review_begin
or reassessment to erase its failed history. This is the only recovery attempt.
`;
}

/** Override same-process repair instructions when canonical verification is required. */
function strictInvocationPrompt(prompt) {
  return `${prompt.trimEnd()}

Strict invocation instructions override any earlier retry or repair instructions:
Every review tool call must succeed. If ANY review tool call fails, including
review_begin, any stage call, or review_submit, stop the current invocation
immediately without further review tool calls or submission. Never repair,
reset with review_begin, or reassess within a failed invocation.
Only the caller may start the sole fresh process, through the existing typed
stale-coverage, healthy-omission, or known-unavailable-tool recovery path.
Unknown failures must STOP without automatic retry. These instructions do not
waive any canonical result, verification guard, or the two-attempt bound.
`;
}

/** Write the current recovery metadata as formatted JSON with a trailing newline. */
function writeRecovery(metadataFile, metadata) {
  fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
}

/** Validate the callback's transport envelope, without implementing review law. */
function verifierEnvelope(raw) {
  let verdict;
  try {
    verdict = JSON.parse(JSON.stringify(raw));
  } catch (cause) {
    throw new Error("canonical verifier returned a non-serializable envelope", { cause });
  }
  if (!verdict || Array.isArray(verdict) || typeof verdict.ok !== "boolean" ||
      typeof verdict.code !== "string" || !verdict.code ||
      !Array.isArray(verdict.violations) || verdict.reasonKind !== verdict.reason) {
    throw new Error("canonical verifier returned an unestablished envelope");
  }
  if (verdict.ok) {
    const binding = verdict.acceptedInvocation;
    if (verdict.reason !== null || !binding || typeof binding !== "object" || Array.isArray(binding) ||
        typeof verdict.sessionID !== "string" || !verdict.sessionID ||
        binding.sessionID !== verdict.sessionID) {
      throw new Error("canonical verifier returned an inconsistent accepted binding");
    }
  } else if (typeof verdict.reason !== "string" || !verdict.reason || verdict.acceptedInvocation !== null) {
    throw new Error("canonical verifier returned an ambiguous refusal");
  }
  return verdict;
}

/** Verify retained bytes only after child completion, and record callback faults. */
async function verifyAttempt({ metadata, metadataFile, responseFile, stderrFile,
  submissionFile, verifyReviewInvocation, expectedContext }) {
  const record = metadata.attempts.at(-1);
  try {
    const response = fs.readFileSync(responseFile);
    const submission = fs.existsSync(submissionFile) ? fs.readFileSync(submissionFile) : null;
    record.response_sha256 = sha256(response);
    record.stderr_sha256 = sha256(fs.readFileSync(stderrFile));
    record.submission_sha256 = submission === null ? null : sha256(submission);
    const verdict = verifierEnvelope(await verifyReviewInvocation(response, submission, expectedContext));
    record.canonical_verdict = verdict;
    const currentSubmission = fs.existsSync(submissionFile) ? sha256(fs.readFileSync(submissionFile)) : null;
    if (sha256(fs.readFileSync(responseFile)) !== record.response_sha256 ||
        currentSubmission !== record.submission_sha256) {
      throw new Error("review evidence changed during canonical verification");
    }
    record.verification_state = "returned";
    writeRecovery(metadataFile, metadata);
    return verdict;
  } catch (error) {
    record.verification_state = "rejected";
    record.verification_error = error instanceof Error ? error.message : String(error);
    writeRecovery(metadataFile, metadata);
    throw error;
  }
}

/** Rename a rejected parseable artifact before the sole fresh child starts. */
function retainStaleSubmission({ metadata, metadataFile, submissionFile, evidenceDirectory }) {
  const record = metadata.attempts.at(-1);
  const retainedFile = path.join(evidenceDirectory, `submission-attempt-${record.attempt}.json`);
  try {
    if (fs.existsSync(retainedFile)) throw new Error(`refusing existing retained submission: ${retainedFile}`);
    fs.renameSync(submissionFile, retainedFile);
    record.retained_submission_file = path.basename(retainedFile);
    record.retained_submission_sha256 = sha256(fs.readFileSync(retainedFile));
    if (record.retained_submission_sha256 !== record.submission_sha256) {
      throw new Error("retained submission changed after canonical verification");
    }
    writeRecovery(metadataFile, metadata);
  } catch (error) {
    record.retention_error = error instanceof Error ? error.message : String(error);
    writeRecovery(metadataFile, metadata);
    throw error;
  }
}

/** Retain attempt output files and metadata, then return the submission state. */
function recordAttempt({
  metadata,
  metadataFile,
  attempt,
  result,
  invocationError,
  invocationRejected = false,
  responseFile,
  stderrFile,
  submissionFile,
}) {
  if (!fs.existsSync(responseFile)) fs.writeFileSync(responseFile, "");
  if (!fs.existsSync(stderrFile)) fs.writeFileSync(stderrFile, "");

  const state = submissionState(submissionFile);
  const record = {
    attempt,
    exit_code: result?.exitCode ?? null,
    invocation_state: invocationRejected ? "rejected" : "completed",
    response_file: path.basename(responseFile),
    stderr_file: path.basename(stderrFile),
    submission_state: state,
  };
  if (invocationRejected) {
    record.invocation_error =
      invocationError instanceof Error ? invocationError.message : String(invocationError);
  }
  metadata.attempts.push(record);
  writeRecovery(metadataFile, metadata);
  return state;
}

/**
 * Run one review attempt and exactly one corrective attempt when, and only
 * when the first invocation omitted review_submit, or failed in a verified
 * unavailable-review-tool loop without a submission. All other failures stop.
 * A supplied canonical Muse callback is mandatory for accepting a present
 * artifact. Its unambiguous stale or established omission verdict can consume
 * the existing sole recovery, alongside the original unavailable-tool path.
 * Omitting the callback preserves the historical library contract for legacy
 * fixtures only; the CLI always requires the staged canonical implementation.
 * Live-head and changed-line publication validation remain separate.
 */
export async function runReviewRecovery({
  evidenceDirectory,
  basePrompt,
  submissionFile = path.join(evidenceDirectory, "submission.json"),
  invokeAttempt,
  reviewTools = [],
  verifyReviewInvocation,
  expectedContext,
  verifierSha256 = null,
}) {
  if (!evidenceDirectory) throw new Error("evidenceDirectory is required");
  if (typeof basePrompt !== "string" || basePrompt.trim().length === 0) {
    throw new Error("basePrompt must be a non-empty string");
  }
  if (typeof invokeAttempt !== "function") throw new Error("invokeAttempt is required");
  const strict = verifyReviewInvocation !== undefined;
  if (strict && typeof verifyReviewInvocation !== "function") throw new Error("verifyReviewInvocation must be a function");
  if (strict && (!expectedContext || typeof expectedContext !== "object" || Array.isArray(expectedContext))) {
    throw new Error("expectedContext is required for canonical invocation verification");
  }

  fs.mkdirSync(evidenceDirectory, { recursive: true });
  const metadataFile = path.join(evidenceDirectory, "recovery.json");
  if (strict && [metadataFile, ...[1, 2].flatMap((attempt) => [
    path.join(evidenceDirectory, `model-response-attempt-${attempt}.txt`),
    path.join(evidenceDirectory, `opencode-stderr-attempt-${attempt}.log`),
  ])].some((file) => fs.existsSync(file))) {
    throw new Error("refusing pre-existing invocation evidence; retained history must not be overwritten");
  }
  const metadata = {
    schema: RECOVERY_SCHEMA,
    max_attempts: MAX_ATTEMPTS,
    recovery_reason: null,
    attempts: [],
  };
  if (strict) metadata.accepted_invocation = null;

  if (fs.existsSync(submissionFile)) {
    throw new Error(`refusing pre-existing review submission: ${submissionFile}`);
  }

  let prompt = strict ? strictInvocationPrompt(basePrompt) : basePrompt;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const responseFile = path.join(evidenceDirectory, `model-response-attempt-${attempt}.txt`);
    const stderrFile = path.join(evidenceDirectory, `opencode-stderr-attempt-${attempt}.log`);
    let result;
    try {
      result = await invokeAttempt({ attempt, prompt, responseFile, stderrFile });
    } catch (invocationError) {
      recordAttempt({
        metadata,
        metadataFile,
        attempt,
        invocationError,
        invocationRejected: true,
        responseFile,
        stderrFile,
        submissionFile,
      });
      if (strict) {
        const record = metadata.attempts.at(-1);
        record.verification_state = "not-run-invocation-rejected";
        record.response_sha256 = sha256(fs.readFileSync(responseFile));
        record.stderr_sha256 = sha256(fs.readFileSync(stderrFile));
        record.submission_sha256 = fs.existsSync(submissionFile) ? sha256(fs.readFileSync(submissionFile)) : null;
        writeRecovery(metadataFile, metadata);
      }
      throw invocationError;
    }

    const state = recordAttempt({
      metadata,
      metadataFile,
      attempt,
      result,
      responseFile,
      stderrFile,
      submissionFile,
    });

    const toolFailure = attempt === 1 && result?.exitCode === 1 && state === "missing"
      ? unavailableReviewTool(responseFile, stderrFile, reviewTools, strict ? expectedContext.reviewTools : undefined, strict)
      : null;
    const verdict = strict ? await verifyAttempt({ metadata, metadataFile, responseFile, stderrFile,
      submissionFile, verifyReviewInvocation, expectedContext }) : null;
    if (result?.exitCode !== 0 && !toolFailure) {
      throw new Error(`OpenCode review attempt ${attempt} exited ${result?.exitCode ?? "without a code"}`);
    }
    if (state === "present" && (!strict || verdict.ok)) {
      if (strict) {
        const record = metadata.attempts.at(-1);
        metadata.accepted_invocation = {
          attempt,
          response_file: record.response_file,
          response_sha256: record.response_sha256,
          submission_file: path.relative(evidenceDirectory, submissionFile),
          submission_sha256: record.submission_sha256,
          session_id: verdict.sessionID,
          canonical_verdict: verdict,
          verifier_sha256: verifierSha256,
          expected_context_sha256: sha256(JSON.stringify(expectedContext)),
        };
        writeRecovery(metadataFile, metadata);
      }
      return metadata;
    }
    if (state === "malformed") {
      throw new Error(`malformed review submission after attempt ${attempt}`);
    }
    const staleCoverage = strict && verdict.ok === false && verdict.reason === "stale-review-coverage" && result?.exitCode === 0;
    const omittedSubmission = strict && verdict.ok === false && verdict.reason === "missing-review-submit" && state === "missing" && result?.exitCode === 0;
    if (strict && !toolFailure && !staleCoverage && !omittedSubmission) {
      throw new Error(`review invocation verification failed after attempt ${attempt}: ${verdict.reason ?? "submission-not-established"}`);
    }
    if (attempt === MAX_ATTEMPTS) {
      if (strict && !omittedSubmission) {
        throw new Error(`review invocation verification failed after attempt ${attempt}: ${verdict.reason}`);
      }
      throw new Error(`reviewer omitted review_submit after ${MAX_ATTEMPTS} attempts`);
    }

    metadata.recovery_reason = toolFailure ? "unavailable_review_tool" : staleCoverage ? "stale-review-coverage" : "missing_review_submit";
    if (toolFailure) metadata.attempts.at(-1).tool_failure = toolFailure;
    writeRecovery(metadataFile, metadata);
    if (staleCoverage && state === "present") {
      retainStaleSubmission({ metadata, metadataFile, submissionFile, evidenceDirectory });
    }
    prompt = correctivePrompt(basePrompt, toolFailure, staleCoverage);
    if (strict) prompt = strictInvocationPrompt(prompt);
  }

  throw new Error("unreachable review recovery state");
}

/** Run the configured OpenCode review and mirror stdout and stderr to retained files. */
async function invokeOpenCode({ prompt, responseFile, stderrFile }) {
  const opencodeBin = process.env.OPENCODE_BIN || "opencode";
  const reviewModel = process.env.REVIEW_MODEL;
  if (!reviewModel) throw new Error("REVIEW_MODEL is required");

  const response = fs.createWriteStream(responseFile, { flags: "w" });
  const stderr = fs.createWriteStream(stderrFile, { flags: "w" });
  const streamsFinished = Promise.allSettled([finished(response), finished(stderr)]);
  let invocationRejected = false;

  try {
    const childEnvironment = { ...process.env };
    for (const name of ["GITHUB_OUTPUT", "GITHUB_ENV", "GITHUB_PATH", "GITHUB_STATE", "GITHUB_STEP_SUMMARY"]) {
      delete childEnvironment[name];
    }
    const child = spawn(
      opencodeBin,
      ["run", "--format", "json", "--agent", "github-reviewer", "--model", reviewModel, prompt],
      { stdio: ["ignore", "pipe", "pipe"], env: childEnvironment },
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

    if (exit.signal) throw new Error(`OpenCode review terminated by ${exit.signal}`);
    return { exitCode: exit.code };
  } catch (error) {
    invocationRejected = true;
    throw error;
  } finally {
    response.end();
    stderr.end();
    const streamResults = await streamsFinished;
    if (!invocationRejected) {
      const streamFailure = streamResults.find(({ status }) => status === "rejected");
      if (streamFailure) throw streamFailure.reason;
    }
  }
}

/** Read the configured prompt and tool registry, then run bounded review recovery. */
async function main() {
  const prNumber = process.env.PR_NUMBER;
  const promptFile = process.env.REVIEW_PROMPT_FILE;
  const evidenceDirectory = process.env.REVIEW_EVIDENCE_DIR;
  const verifierFile = process.env.REVIEW_INVOCATION_VERIFIER_FILE;
  if (!/^\d+$/.test(prNumber || "")) throw new Error("PR_NUMBER must be numeric");
  if (!promptFile) throw new Error("REVIEW_PROMPT_FILE is required");
  if (!evidenceDirectory) throw new Error("REVIEW_EVIDENCE_DIR is required");
  if (!verifierFile) throw new Error("REVIEW_INVOCATION_VERIFIER_FILE is required");
  if (!path.isAbsolute(verifierFile)) throw new Error("REVIEW_INVOCATION_VERIFIER_FILE must be absolute");
  if (!process.env.GITHUB_OUTPUT) throw new Error("GITHUB_OUTPUT is required for trusted invocation binding");

  const promptTemplate = fs.readFileSync(promptFile, "utf8");
  const basePrompt = promptTemplate.replaceAll("{{PR_NUMBER}}", prNumber);
  const registryFile = process.env.REVIEW_TOOL_REGISTRY_FILE;
  const exposedTools = registryFile ? fs.readFileSync(registryFile, "utf8").trim().split(/\r?\n/).filter(Boolean) : [];
  const reviewTools = exposedTools.filter((tool) => /^review_[a-z0-9_]+$/.test(tool));
  // The caller stages this CJS from qualified Muse machinery. No model output
  // selects the module, context, semantic verdict, or trusted step output.
  const submissionFile = path.resolve(evidenceDirectory, "submission.json");
  let verifierBytes;
  let verifier;
  let expectedContext;
  try {
    verifierBytes = fs.readFileSync(verifierFile);
    verifier = createRequire(import.meta.url)(verifierFile);
    if (typeof verifier.verifyReviewInvocation !== "function" ||
        typeof verifier.prepareReviewInvocationContext !== "function") {
      throw new Error("staged verifier must export verifyReviewInvocation and prepareReviewInvocationContext");
    }
    if (sha256(fs.readFileSync(verifierFile)) !== sha256(verifierBytes)) {
      throw new Error("staged invocation verifier changed while loading");
    }
    // Canonical Muse prepares the actual lossless geometry once, before any
    // child. Keep it in trusted supervisor memory across the two-attempt bound.
    expectedContext = verifier.prepareReviewInvocationContext(
      fs.readFileSync(path.join(evidenceDirectory, "basehead.diff")),
      fs.readFileSync(path.join(evidenceDirectory, "input-manifest.json")),
      exposedTools, submissionFile,
    );
    if (!expectedContext || typeof expectedContext !== "object" || Array.isArray(expectedContext)) {
      throw new Error("canonical verifier context preparation returned no context");
    }
  } catch (error) {
    const metadataFile = path.join(evidenceDirectory, "recovery.json");
    if (!fs.existsSync(metadataFile)) {
      writeRecovery(metadataFile, {
        schema: RECOVERY_SCHEMA, max_attempts: MAX_ATTEMPTS, recovery_reason: null,
        attempts: [], accepted_invocation: null,
        setup_error: error instanceof Error ? error.message : String(error),
      });
    }
    throw error;
  }
  const metadata = await runReviewRecovery({ evidenceDirectory, basePrompt, reviewTools,
    submissionFile, invokeAttempt: invokeOpenCode,
    verifyReviewInvocation: verifier.verifyReviewInvocation, expectedContext,
    verifierSha256: sha256(verifierBytes) });
  const accepted = metadata.accepted_invocation;
  try {
    if (!accepted || sha256(fs.readFileSync(path.join(evidenceDirectory, accepted.response_file))) !== accepted.response_sha256 ||
        sha256(fs.readFileSync(submissionFile)) !== accepted.submission_sha256) {
      throw new Error("accepted invocation bytes changed before trusted output");
    }
    const digest = sha256(JSON.stringify(accepted));
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `review_invocation_sha256=${digest}\n`);
  } catch (error) {
    metadata.accepted_invocation = null;
    metadata.rejected_accepted_invocation = accepted;
    metadata.supervisor_error = error instanceof Error ? error.message : String(error);
    writeRecovery(path.join(evidenceDirectory, "recovery.json"), metadata);
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  });
}
