// SPDX-License-Identifier: GPL-3.0-or-later

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";

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
    if (strict) {
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

/**
 * Retain one known final submit-JSON transport projection for retry eligibility.
 * The original whole-trace refusal stays authoritative and is never accepted.
 * All review semantics, including prefix validity, remain the Muse callback's.
 */
async function submitJsonTransport({ metadata, metadataFile, responseFile, stderrFile,
  submissionFile, reviewTools, verifyReviewInvocation, expectedContext, contextSha256 }) {
  const record = metadata.attempts.at(-1);
  const original = record.canonical_verdict;
  if (original.ok !== false || original.reason !== "unestablished-review-trace" ||
      original.code !== "unavailable-host-tool" || original.violations.length !== 0 ||
      !reviewTools.includes("review_submit") || !Array.isArray(expectedContext.reviewTools) ||
      !expectedContext.reviewTools.includes("review_submit")) return null;
  const response = fs.readFileSync(responseFile);
  let lines, events, omitted;
  try {
    // Keep every other raw line and ending, including the actual final stop.
    lines = new TextDecoder("utf-8", { fatal: true }).decode(response).match(/[^\n]*\n|[^\n]+$/g) ?? [];
    if (!Buffer.from(lines.join("")).equals(response)) return null;
    events = lines.map((line, index) => line.trim() ? { event: JSON.parse(line), index } : null).filter(Boolean);
    const calls = events.filter(({ event }) => event.type === "tool_use");
    const invalid = calls.filter(({ event }) => event.part?.tool === "invalid");
    if (invalid.length !== 1 || invalid[0] !== calls.at(-1) ||
        calls.some(({ event }) => event.part?.tool === "review_submit")) return null;
    const { event, index } = invalid[0];
    const part = event.part, state = part.state, input = state?.input;
    const prefix = "Invalid input for tool review_submit: JSON parsing failed: Text: ";
    const suffix = "\nError message: JSON Parse error: Unterminated string";
    if (part.type !== "tool" || state?.status !== "completed" ||
        (state.error != null && state.error !== false) || input?.tool !== "review_submit" ||
        Object.keys(input).sort().join(",") !== "error,tool" || typeof input.error !== "string" ||
        !input.error.startsWith(prefix) || !input.error.endsWith(suffix) ||
        state.output !== `The arguments provided to the tool are invalid: ${input.error}` ||
        state.metadata?.truncated !== false) return null;
    const text = input.error.slice(prefix.length, -suffix.length);
    if (!text) return null;
    try { JSON.parse(text); return null; } catch { /* Actual malformed transport DATA only. */ }
    omitted = index;
  } catch { return null; }
  const projection = Buffer.from(lines.filter((_, index) => index !== omitted).join(""));
  const omittedBytes = Buffer.from(lines[omitted]);
  const directory = path.dirname(responseFile);
  const projectionFile = path.join(directory, "review-submit-json-attempt-1.DERIVED.ndjson");
  const omittedFile = path.join(directory, "review-submit-json-attempt-1.OMITTED.ndjson");
  const proof = { tier: "DERIVED_RETRY_ELIGIBILITY_ONLY", accepted_review: false,
    original_response_sha256: record.response_sha256,
    projection_file: path.basename(projectionFile), projection_sha256: sha256(projection),
    omitted_file: path.basename(omittedFile), omitted_sha256: sha256(omittedBytes),
    omitted_line: omitted + 1, tool: "review_submit",
    call_id: events.find(({ index }) => index === omitted).event.part.callID };
  record.submit_json_transport = proof;
  /** Recheck the original and derived custody; no callback may change evidence. */
  const unchanged = () => {
    if (sha256(response) !== record.response_sha256 ||
        sha256(fs.readFileSync(responseFile)) !== record.response_sha256 ||
        sha256(fs.readFileSync(stderrFile)) !== record.stderr_sha256 || fs.existsSync(submissionFile) ||
        sha256(JSON.stringify(expectedContext)) !== contextSha256 ||
        sha256(projection) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(projectionFile)) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(omittedFile)) !== proof.omitted_sha256) {
      throw new Error("submit JSON transport evidence changed during verification");
    }
  };
  try {
    fs.writeFileSync(projectionFile, projection, { flag: "wx" });
    fs.writeFileSync(omittedFile, omittedBytes, { flag: "wx" });
    unchanged();
    const verdict = verifierEnvelope(await verifyReviewInvocation(projection, null, expectedContext));
    proof.canonical_verdict = verdict;
    unchanged();
    proof.verification_state = "returned";
    writeRecovery(metadataFile, metadata);
    if (verdict.ok !== false || verdict.reason !== "missing-review-submit" ||
        verdict.code !== "healthy-unfinished-review" || verdict.violations.length !== 0) return null;
    return proof;
  } catch (error) {
    proof.verification_state = "rejected";
    proof.verification_error = error instanceof Error ? error.message : String(error);
    writeRecovery(metadataFile, metadata);
    throw error;
  }
}

/**
 * Recognize only the final adversarial-validation refusal for one unassessed
 * final input page. The same canonical callback validates the retained prefix;
 * this host-only projection grants retry eligibility, never review acceptance.
 */
async function finalInputCoverage({ metadata, metadataFile, responseFile, stderrFile,
  submissionFile, reviewTools, verifyReviewInvocation, expectedContext, contextSha256 }) {
  const record = metadata.attempts.at(-1), original = record.canonical_verdict;
  const count = expectedContext.pageCount;
  if (original.ok !== false || original.reason !== "unestablished-review-trace" ||
      original.code !== "stage-order" || original.violations.length !== 0 ||
      !reviewTools.includes("review_record_evidence") || !Array.isArray(expectedContext.reviewTools) ||
      !expectedContext.reviewTools.includes("review_record_evidence") ||
      !Number.isSafeInteger(count) || count < 1) return null;
  const response = fs.readFileSync(responseFile), directory = path.dirname(responseFile);
  const fullFile = path.join(directory, "basehead.diff"), manifestFile = path.join(directory, "input-manifest.json");
  let lines, omitted, call, fullDigest, manifestDigest;
  try {
    const full = fs.readFileSync(fullFile), manifest = fs.readFileSync(manifestFile);
    if (sha256(full) !== expectedContext.fullInputSha256 ||
        !isDeepStrictEqual(JSON.parse(manifest.toString("utf8")), expectedContext.inputSource)) return null;
    fullDigest = sha256(full); manifestDigest = sha256(manifest);
    lines = new TextDecoder("utf-8", { fatal: true }).decode(response).match(/[^\n]*\n|[^\n]+$/g) ?? [];
    if (!Buffer.from(lines.join("")).equals(response)) return null;
    const events = lines.map((line, index) => line.trim() ? { event: JSON.parse(line), index } : null).filter(Boolean);
    const session = events[0]?.event.sessionID, nonblank = (x) => typeof x === "string" && x.trim().length > 0;
    if (!nonblank(session) || events.some(({ event }, i) => event.sessionID !== session ||
        !Number.isSafeInteger(event.timestamp) || event.timestamp < 0 ||
        (i > 0 && event.timestamp < events[i - 1].event.timestamp)) ||
        events.at(-1)?.event.type !== "step_finish" || events.at(-1).event.part?.reason !== "stop") return null;
    const calls = events.filter(({ event }) => event.type === "tool_use");
    if (calls.some(({ event }) => event.part?.type !== "tool" || event.part.sessionID !== session ||
        !nonblank(event.part.id) || !nonblank(event.part.callID) ||
        event.part.state?.status !== "completed" || (event.part.state.error != null && event.part.state.error !== false)) ||
        new Set(calls.map(({ event }) => event.part.id)).size !== calls.length ||
        new Set(calls.map(({ event }) => event.part.callID)).size !== calls.length) return null;
    const failed = calls.filter(({ event }) => event.part.tool?.startsWith("review_") &&
      JSON.parse(event.part.state.output)?.["ok?"] !== true);
    if (failed.length !== 1 || failed[0] !== calls.at(-1) ||
        calls.some(({ event }) => event.part.tool === "review_submit" || event.part.tool === "invalid")) return null;
    const target = failed[0], part = target.event.part, state = part.state, output = JSON.parse(state.output);
    if (part.tool !== "review_record_evidence" || state.input?.stage !== "adversarial-validate" ||
        !nonblank(state.input.note) || Object.keys(output).sort().join(",") !== "error,ok?" ||
        output["ok?"] !== false || output.error !== `Unassessed full-input chunks remain: ${count}. Read and assess every changed hunk before publishing.` ||
        state.metadata?.truncated !== false) return null;
    // Extra narrow transport eligibility binds the recorded omission to the
    // prepared final page; canonical Muse still owns all review validity.
    const ids = (name) => calls.filter(({ event }) => event.part.tool === name).map(({ event }) => event.part.state.input?.id);
    const reads = ids("review_read_diff_chunk"), assessments = ids("review_assess_diff_chunk");
    const exact = (xs, size) => xs.length === size && new Set(xs).size === size &&
      xs.every((id) => Number.isSafeInteger(id) && id >= 1 && id <= size);
    const stages = calls.filter(({ event }) => event.part.tool === "review_record_evidence")
      .map(({ event }) => event.part.state.input?.stage);
    if (!exact(reads, count) || !exact(assessments, count - 1) ||
        stages.join(",") !== "deterministic,map-change,generate-candidates,adversarial-validate" ||
        stages.length !== 4) return null;
    omitted = target.index; call = part.callID;
  } catch { return null; }
  const projection = Buffer.from(lines.filter((_, index) => index !== omitted).join(""));
  const omittedBytes = Buffer.from(lines[omitted]);
  const projectionFile = path.join(directory, "final-input-coverage-attempt-1.DERIVED.ndjson");
  const omittedFile = path.join(directory, "final-input-coverage-attempt-1.OMITTED.ndjson");
  const proof = { tier: "DERIVED_RETRY_ELIGIBILITY_ONLY", accepted_review: false,
    original_response_sha256: record.response_sha256,
    projection_file: path.basename(projectionFile), projection_sha256: sha256(projection),
    omitted_file: path.basename(omittedFile), omitted_sha256: sha256(omittedBytes),
    omitted_line: omitted + 1, tool: "review_record_evidence", call_id: call,
    missing_final_page: expectedContext.pageCount, full_input_sha256: fullDigest,
    input_manifest_sha256: manifestDigest };
  record.final_input_coverage = proof;
  const unchanged = () => {
    if (sha256(response) !== record.response_sha256 ||
        sha256(fs.readFileSync(responseFile)) !== record.response_sha256 ||
        sha256(fs.readFileSync(stderrFile)) !== record.stderr_sha256 || fs.existsSync(submissionFile) ||
        sha256(JSON.stringify(expectedContext)) !== contextSha256 ||
        sha256(fs.readFileSync(fullFile)) !== fullDigest || sha256(fs.readFileSync(manifestFile)) !== manifestDigest ||
        sha256(projection) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(projectionFile)) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(omittedFile)) !== proof.omitted_sha256) {
      throw new Error("final input coverage evidence changed during verification");
    }
  };
  try {
    fs.writeFileSync(projectionFile, projection, { flag: "wx" });
    fs.writeFileSync(omittedFile, omittedBytes, { flag: "wx" });
    unchanged();
    const verdict = verifierEnvelope(await verifyReviewInvocation(projection, null, expectedContext));
    proof.canonical_verdict = verdict;
    unchanged(); proof.verification_state = "returned";
    writeRecovery(metadataFile, metadata);
    if (verdict.ok !== false || verdict.reason !== "missing-review-submit" ||
        verdict.code !== "healthy-unfinished-review" || verdict.violations.length !== 0) return null;
    return proof;
  } catch (error) {
    proof.verification_state = "rejected";
    proof.verification_error = error instanceof Error ? error.message : String(error);
    writeRecovery(metadataFile, metadata); throw error;
  }
}

/** Append the sole corrective-attempt instructions to the original review prompt. */
function correctivePrompt(basePrompt, toolFailure, staleCoverage = false, submitJsonFailure = false, coverageFailure = false) {
  const cause = toolFailure
    ? `the first model invocation failed without a review after repeatedly calling the unavailable tool ${toolFailure.tool}. Use the actual exposed name ${toolFailure.corrected_tool}; do not call the unavailable spelling again.`
    : submitJsonFailure
      ? "the first stopped process produced the known final review_submit JSON transport diagnostic without an actual submit or artifact. Its whole trace remains refused; the retained derived projection establishes retry eligibility only. In this fresh process, pass well-formed JSON arguments to the exposed review_submit tool."
    : coverageFailure
      ? "the first stopped process failed final adversarial validation because the final full-input page was read but not assessed. Its whole trace remains failed; a separately retained canonical healthy-omission projection supplies only retry eligibility. Read and assess every full-input page anew before completing all five stages and submitting in this sole fresh process."
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


Supporting-file HOST read contract for this restricted reviewer:
- Use the host read tool's exact filePath to read summary.json and
  deterministic.log under .opencode/review-evidence. Start at offset 1 with
  limit 200. Follow the tool's returned next offset until End of file; a byte
  cap can return fewer lines than requested. Retain all gate statuses, failure
  context and environment limits. Line-content clipping is not complete input;
  do not claim coverage of material you could not retrieve.
- The pinned host grep path parameter is a directory selector. A file-valued
  path can search its parent and generated artifacts. Optional grep must use
  path .opencode/review-evidence with include deterministic.log; use equivalent
  explicit file inclusion for other searches. Grep supplements, never replaces,
  the required complete deterministic evidence reading.
- Never use bash for file inspection, listing, size/count checks or executing
  commands. Its true-only registration is compatibility, not shell authority.
  General tool help suggesting Bash or Task does not override this reviewer.
- If a HOST tool has an actual lifecycle error (status:error or state.error),
  such as a denied bash operation or a failed read/search, STOP this invocation
  without further tool calls or submission. Only the caller may admit its
  existing narrowly typed fresh recovery. A completed invalid-tool transport
  diagnostic is distinct: it remains governed by the existing unavailable-tool
  protocol, not a new recovery rule. Do not repeat calls to manufacture a
  recoverable tail. Failed review_* results and restart-required replies retain
  their existing STOP protocol. Unknown HOST failures grant no retry authority
  and no accepted review.
- These instructions preserve every immutable full-diff page, assessment,
  stage, finding, source, submission, permission and verification guard.
Caller-only final submit-JSON transport exception:
A completed invalid-tool diagnostic for the already exposed review_submit name
is transport before an actual review tool call. STOP without any further calls
or submission. The failure alone is not retry authority. Only the caller may
admit one fresh process when its narrowly typed JSON-transport policy and the
unchanged canonical callback establish eligibility. The whole failed trace
remains refused; any separately retained derived projection is retry evidence
only, never an accepted review. All failed actual review calls, unknown HOST
failures, strict input/chronology guards and the existing two-attempt bound stay
unchanged. The fresh process must complete the whole review anew.

Caller-only final input-coverage exception:
STOP after the exact final adversarial-validation refusal for the unassessed
final input page. Do not repair or resume that invocation. The failure alone
is not retry authority. Only the caller may admit the sole fresh whole process
when its narrow recorded-failure policy and the unchanged canonical callback
establish retry eligibility over a separately retained projection. The original
failed invocation remains refused. All existing input, HOST, LAST, five-stage,
source, submission and two-attempt guards remain mandatory for the fresh review.

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
 * The known final submit-JSON transport path additionally requires a retained
 * derived projection's exact healthy-omission refusal from that same callback.
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
  const contextSha256 = strict ? sha256(JSON.stringify(expectedContext)) : null;
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
    const submitJsonFailure = strict && attempt === 1 && result?.exitCode === 0 && state === "missing"
      ? await submitJsonTransport({ metadata, metadataFile, responseFile, stderrFile, submissionFile,
        reviewTools, verifyReviewInvocation, expectedContext, contextSha256 }) : null;
    const coverageFailure = strict && attempt === 1 && result?.exitCode === 0 && state === "missing"
      ? await finalInputCoverage({ metadata, metadataFile, responseFile, stderrFile, submissionFile,
        reviewTools, verifyReviewInvocation, expectedContext, contextSha256 }) : null;
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
    if (strict && !toolFailure && !staleCoverage && !omittedSubmission && !submitJsonFailure && !coverageFailure) {
      throw new Error(`review invocation verification failed after attempt ${attempt}: ${verdict.reason ?? "submission-not-established"}`);
    }
    if (attempt === MAX_ATTEMPTS) {
      if (strict && !omittedSubmission) {
        throw new Error(`review invocation verification failed after attempt ${attempt}: ${verdict.reason}`);
      }
      throw new Error(`reviewer omitted review_submit after ${MAX_ATTEMPTS} attempts`);
    }

    metadata.recovery_reason = toolFailure ? "unavailable_review_tool" : submitJsonFailure ? "review_submit_json_transport" : coverageFailure ? "final_input_coverage" : staleCoverage ? "stale-review-coverage" : "missing_review_submit";
    if (toolFailure) metadata.attempts.at(-1).tool_failure = toolFailure;
    writeRecovery(metadataFile, metadata);
    if (staleCoverage && state === "present") {
      retainStaleSubmission({ metadata, metadataFile, submissionFile, evidenceDirectory });
    }
    prompt = correctivePrompt(basePrompt, toolFailure, staleCoverage, submitJsonFailure, coverageFailure);
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
  const metadata = await runKnownGrepOverflowReviewRecovery({ evidenceDirectory, basePrompt, reviewTools,
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

// Bounded caller extension; canonical Muse retains review admission authority.
/**
 * Retain the exact known grep overflow as retry DATA, never review evidence.
 * Remove only that failed call and, when present, the sole successful submit
 * call. Every other raw line remains for the SAME canonical callback to judge.
 * The original submission and whole failed trace stay rejected and in custody.
 */
async function knownGrepOverflowTransport({ metadata, metadataFile, responseFile,
  stderrFile, submissionFile, reviewTools, verifyReviewInvocation,
  expectedContext, contextSha256 }) {
  const record = metadata.attempts[0], original = record?.canonical_verdict;
  if (metadata.max_attempts !== MAX_ATTEMPTS || metadata.attempts.length !== 1 ||
      metadata.accepted_invocation !== null || metadata.recovery_reason !== null ||
      record.attempt !== 1 || record.exit_code !== 0 || record.invocation_state !== "completed" ||
      record.verification_state !== "returned" || !["present", "missing"].includes(record.submission_state) ||
      original?.ok !== false || original.reason !== "unestablished-review-trace" ||
      original.code !== "host-tool-schema" || original.violations.length !== 0 ||
      !reviewTools.includes("review_submit") || !Array.isArray(expectedContext.reviewTools) ||
      !expectedContext.reviewTools.includes("review_submit")) return null;
  const response = fs.readFileSync(responseFile), directory = path.dirname(responseFile);
  const submission = fs.existsSync(submissionFile) ? fs.readFileSync(submissionFile) : null;
  let lines, excluded, failure;
  try {
    lines = new TextDecoder("utf-8", { fatal: true }).decode(response).match(/[^\n]*\n|[^\n]+$/g) ?? [];
    if (!Buffer.from(lines.join("")).equals(response)) return null;
    const events = lines.map((line, index) => line.trim() ? { event: JSON.parse(line), index } : null).filter(Boolean);
    const native = (x, prefix) => typeof x === "string" && new RegExp(`^${prefix}_[A-Za-z0-9]+$`).test(x);
    const natural = (x) => Number.isSafeInteger(x) && x >= 0;
    const session = events[0]?.event.sessionID;
    if (!native(session, "ses") || events.some(({ event }, i) =>
        !["step_start", "step_finish", "text", "tool_use"].includes(event.type) ||
        event.sessionID !== session || event.part?.sessionID !== session ||
        !native(event.part?.id, "prt") || !native(event.part?.messageID, "msg") ||
        !natural(event.timestamp) || (i > 0 && event.timestamp < events[i - 1].event.timestamp)) ||
        new Set(events.map(({ event }) => event.part.id)).size !== events.length ||
        events.at(-1)?.event.type !== "step_finish" || events.at(-1).event.part?.reason !== "stop") return null;
    const calls = events.filter(({ event }) => event.type === "tool_use");
    if (calls.some(({ event }) => event.part.type !== "tool" || !native(event.part.callID, "call") ||
        !natural(event.part.state?.time?.start) || !natural(event.part.state.time.end) ||
        event.part.state.time.start > event.part.state.time.end || event.part.state.time.end > event.timestamp) ||
        new Set(calls.map(({ event }) => event.part.callID)).size !== calls.length) return null;
    const failed = calls.filter(({ event }) => event.part.state.status !== "completed" ||
      (event.part.state.error != null && event.part.state.error !== false));
    if (failed.length !== 1) return null;
    const target = failed[0], { part } = target.event, state = part.state;
    if (part.tool !== "grep" || state.status !== "error" ||
        state.error !== "Ripgrep JSON record exceeded 65536 bytes" ||
        Object.keys(state).sort().join(",") !== "error,input,status,time" ||
        Object.keys(state.time).sort().join(",") !== "end,start" ||
        !isDeepStrictEqual(state.input, { path: "/home/runner/work/proxx/proxx", pattern: "complete-input eta-mu" }) ||
        (target.index > 0 && state.time.start < JSON.parse(lines[target.index - 1]).timestamp)) return null;
    const submits = calls.filter(({ event }) => event.part.tool === "review_submit");
    if (submission === null ? submits.length !== 0 : submits.length !== 1) return null;
    if (submits.length && (submits[0] !== calls.at(-1) || submits[0].index < target.index ||
        JSON.parse(submits[0].event.part.state.output)?.["ok?"] !== true ||
        JSON.parse(submits[0].event.part.state.output)?.["restart-required?"] === true)) return null;
    // Do not hide actual unsuccessful review calls, invalid-tool loops, or a
    // second HOST error in the omitted submit. Muse owns the rest of the law.
    if (calls.some(({ event }) => event.part.tool === "invalid")) return null;
    excluded = [target.index, ...submits.map(({ index }) => index)];
    failure = { session_id: session, call_id: part.callID, part_id: part.id,
      message_id: part.messageID, timestamp: target.event.timestamp, time: state.time,
      input: state.input, error: state.error };
  } catch { return null; }
  const projection = Buffer.from(lines.filter((_, index) => !excluded.includes(index)).join(""));
  const omitted = Buffer.from(lines.filter((_, index) => excluded.includes(index)).join(""));
  const projectionFile = path.join(directory, "known-grep-overflow-attempt-1.DERIVED.ndjson");
  const omittedFile = path.join(directory, "known-grep-overflow-attempt-1.OMITTED.ndjson");
  const proof = { tier: "DERIVED_RETRY_ELIGIBILITY_ONLY", accepted_review: false, ...failure,
    original_response_sha256: record.response_sha256, original_submission_sha256: record.submission_sha256,
    projection_file: path.basename(projectionFile), projection_sha256: sha256(projection),
    omitted_file: path.basename(omittedFile), omitted_sha256: sha256(omitted),
    omitted_lines: excluded.map((index) => index + 1), omitted_submit: submission !== null };
  record.known_grep_overflow_transport = proof;
  const unchanged = () => {
    const currentSubmission = fs.existsSync(submissionFile) ? sha256(fs.readFileSync(submissionFile)) : null;
    if (sha256(response) !== record.response_sha256 ||
        sha256(fs.readFileSync(responseFile)) !== record.response_sha256 ||
        sha256(fs.readFileSync(stderrFile)) !== record.stderr_sha256 ||
        (submission === null ? null : sha256(submission)) !== record.submission_sha256 ||
        currentSubmission !== record.submission_sha256 ||
        sha256(JSON.stringify(expectedContext)) !== contextSha256 ||
        sha256(projection) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(projectionFile)) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(omittedFile)) !== proof.omitted_sha256) {
      throw new Error("known grep overflow evidence changed during verification");
    }
  };
  try {
    fs.writeFileSync(projectionFile, projection, { flag: "wx" });
    fs.writeFileSync(omittedFile, omitted, { flag: "wx" });
    unchanged();
    const verdict = verifierEnvelope(await verifyReviewInvocation(projection, null, expectedContext));
    proof.canonical_verdict = verdict;
    unchanged(); proof.verification_state = "returned";
    writeRecovery(metadataFile, metadata);
    if (verdict.ok !== false || verdict.reason !== "missing-review-submit" ||
        verdict.code !== "healthy-unfinished-review" || verdict.violations.length !== 0) return null;
    return proof;
  } catch (error) {
    proof.verification_state = "rejected";
    proof.verification_error = error instanceof Error ? error.message : String(error);
    writeRecovery(metadataFile, metadata); throw error;
  }
}

/**
 * Delegate all existing behavior unchanged, and admit
 * at most one fresh invocation after its exact single-attempt overflow refusal.
 */
export async function runKnownGrepOverflowReviewRecovery(options) {
  const { evidenceDirectory, basePrompt, invokeAttempt, verifyReviewInvocation,
    expectedContext, reviewTools = [], verifierSha256 = null } = options;
  const submissionFile = options.submissionFile ?? path.join(evidenceDirectory, "submission.json");
  const strict = typeof verifyReviewInvocation === "function";
  const contextSha256 = strict ? sha256(JSON.stringify(expectedContext)) : null;
  let originalFailure, firstCompleted = false;
  const delegatedCalls = [];
  const delegatedOptions = { ...options, invokeAttempt: async (args) => {
    delegatedCalls.push(args.attempt);
    const result = await invokeAttempt(args);
    if (args.attempt === 1 && result?.exitCode === 0) firstCompleted = true;
    return result;
  } };
  try { return await runReviewRecovery(delegatedOptions); } catch (error) { originalFailure = error; }
  if (!strict || !firstCompleted || delegatedCalls.length !== 1 || delegatedCalls[0] !== 1 ||
      !fs.existsSync(path.join(evidenceDirectory, "recovery.json"))) throw originalFailure;
  const metadataFile = path.join(evidenceDirectory, "recovery.json");
  const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));
  // Completed attempts only. Setup, verification faults and consumed MAX2 are
  // never routed through the new transport path.
  if (metadata.attempts?.length !== 1 || metadata.attempts[0].verification_state !== "returned") throw originalFailure;
  const proof = await knownGrepOverflowTransport({ metadata, metadataFile,
    responseFile: path.join(evidenceDirectory, "model-response-attempt-1.txt"),
    stderrFile: path.join(evidenceDirectory, "opencode-stderr-attempt-1.log"),
    submissionFile, reviewTools, verifyReviewInvocation, expectedContext, contextSha256 });
  if (!proof) throw originalFailure;
  if (metadata.attempts[0].submission_state === "present") {
    retainStaleSubmission({ metadata, metadataFile, submissionFile, evidenceDirectory });
  }
  metadata.recovery_reason = "known_grep_overflow_transport";
  writeRecovery(metadataFile, metadata);
  const first = metadata.attempts[0];
  const checkFirstCustody = () => {
    if (sha256(fs.readFileSync(path.join(evidenceDirectory, first.response_file))) !== first.response_sha256 ||
        sha256(fs.readFileSync(path.join(evidenceDirectory, first.stderr_file))) !== first.stderr_sha256 ||
        sha256(fs.readFileSync(path.join(evidenceDirectory, proof.projection_file))) !== proof.projection_sha256 ||
        sha256(fs.readFileSync(path.join(evidenceDirectory, proof.omitted_file))) !== proof.omitted_sha256 ||
        (first.retained_submission_file && sha256(fs.readFileSync(path.join(evidenceDirectory,
          first.retained_submission_file))) !== first.submission_sha256) ||
        sha256(JSON.stringify(expectedContext)) !== contextSha256) {
      throw new Error("known grep overflow first-attempt custody changed");
    }
  };
  checkFirstCustody();
  const attempt = MAX_ATTEMPTS;
  const responseFile = path.join(evidenceDirectory, `model-response-attempt-${attempt}.txt`);
  const stderrFile = path.join(evidenceDirectory, `opencode-stderr-attempt-${attempt}.log`);
  if ([responseFile, stderrFile, submissionFile].some((file) => fs.existsSync(file))) {
    throw new Error("refusing pre-existing corrective evidence after grep overflow");
  }
  const prompt = strictInvocationPrompt(`${basePrompt.trimEnd()}

Corrective attempt 2 of 2: the first process failed the exact readonly grep
with Ripgrep JSON record exceeded 65536 bytes. Its entire invocation and any
submission remain rejected. The same canonical callback supplied only typed
retry eligibility over separately retained DERIVED DATA. Start one fresh whole
process with review_begin and complete all input, assessments and five stages
anew. Use explicit grep include selection under .opencode/review-evidence;
never repeat the unrestricted repository grep. STOP on any actual HOST or
review tool error, without further calls or submission. No third attempt.
`);
  let result;
  try { result = await invokeAttempt({ attempt, prompt, responseFile, stderrFile }); }
  catch (invocationError) {
    recordAttempt({ metadata, metadataFile, attempt, invocationError, invocationRejected: true,
      responseFile, stderrFile, submissionFile });
    const record = metadata.attempts.at(-1);
    record.verification_state = "not-run-invocation-rejected";
    record.response_sha256 = sha256(fs.readFileSync(responseFile));
    record.stderr_sha256 = sha256(fs.readFileSync(stderrFile));
    record.submission_sha256 = fs.existsSync(submissionFile) ? sha256(fs.readFileSync(submissionFile)) : null;
    writeRecovery(metadataFile, metadata); throw invocationError;
  }
  const state = recordAttempt({ metadata, metadataFile, attempt, result, responseFile, stderrFile, submissionFile });
  const verdict = await verifyAttempt({ metadata, metadataFile, responseFile, stderrFile,
    submissionFile, verifyReviewInvocation, expectedContext });
  checkFirstCustody();
  if (sha256(fs.readFileSync(stderrFile)) !== metadata.attempts.at(-1).stderr_sha256) {
    throw new Error("known grep overflow corrective stderr custody changed");
  }
  if (result?.exitCode !== 0 || state !== "present" || !verdict.ok || verdict.sessionID === proof.session_id ||
      sha256(JSON.stringify(expectedContext)) !== contextSha256) {
    throw new Error(`review invocation verification failed after attempt 2: ${verdict.reason ?? "fresh-process-binding"}`);
  }
  const record = metadata.attempts.at(-1);
  metadata.accepted_invocation = { attempt, response_file: record.response_file,
    response_sha256: record.response_sha256, submission_file: path.relative(evidenceDirectory, submissionFile),
    submission_sha256: record.submission_sha256, session_id: verdict.sessionID,
    canonical_verdict: verdict, verifier_sha256: verifierSha256, expected_context_sha256: contextSha256 };
  writeRecovery(metadataFile, metadata);
  return metadata;
}
