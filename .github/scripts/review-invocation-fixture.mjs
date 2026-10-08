// SPDX-License-Identifier: GPL-3.0-or-later
// TRANSPORT MOCK ONLY: these fixtures do not implement or qualify Muse review law.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

/**
 * Hash transport fixture data without granting review-policy credit.
 * @param {string|Buffer|TypedArray|DataView} bytes - Hash input.
 * @returns {string} Hexadecimal SHA-256 digest.
 */
export const transportSha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const transportReviewTools = ["review_begin", "review_assess_diff_chunk", "review_submit"];

// Deliberately accepts the existing 1024-unit transport intervals. Canonical
// pagination, stages, read/assessment chronology and findings belong to Muse's
// independently compiled verifier, which the parent tests separately.
export const transportVerifierSource = `// TRANSPORT MOCK ONLY; no canonical review-policy credit.
const { createHash } = require("node:crypto");
const path = require("node:path");
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
exports.prepareReviewInvocationContext = (full, manifest, tools, submissionFile) => {
  if (!Buffer.isBuffer(full) || !Buffer.isBuffer(manifest) || !Array.isArray(tools)
      || !path.isAbsolute(submissionFile)) throw new Error("invalid transport fixture context");
  JSON.parse(manifest.toString("utf8"));
  return { fixtureAuthority: "TRANSPORT_MOCK_ONLY", fullInputSha256: digest(full),
    manifestSha256: digest(manifest), reviewTools: [...tools], submissionFile };
};
exports.verifyReviewInvocation = (response, submission, context) => {
  const refuse = reason => ({ ok: false, reason, reasonKind: reason,
    code: "transport-mock-refusal", violations: [], acceptedInvocation: null,
    fixtureAuthority: "TRANSPORT_MOCK_ONLY" });
  let events;
  try { events = response.toString("utf8").trim().split(/\\r?\\n/).map(JSON.parse); }
  catch { return refuse("unestablished-review-trace"); }
  const sessionID = events[0]?.sessionID;
  if (!sessionID || events.some(event => event.sessionID !== sessionID || event.type === "error")
      || events.at(-1)?.type !== "step_finish" || events.at(-1)?.part?.reason !== "stop") {
    return refuse("unestablished-review-trace");
  }
  if (submission === null) return refuse("missing-review-submit");
  try { JSON.parse(submission.toString("utf8")); }
  catch { return refuse("schema-mismatch"); }
  const position = events.findIndex(event => event.type === "tool_use"
    && event.part?.tool === "review_submit" && event.part?.state?.status === "completed");
  if (position < 0) return refuse("unestablished-review-trace");
  return { ok: true, reason: null, reasonKind: null, code: "verified-review-invocation",
    violations: [], sessionID, fixtureAuthority: "TRANSPORT_MOCK_ONLY",
    acceptedInvocation: { sessionID, submissionCallID: events[position].part.callID,
      submissionPosition: position, submissionFile: context.submissionFile,
      fullInputSha256: context.fullInputSha256 } };
};
// Transport fixture cannot establish unfinished-review eligibility.
exports.classifyLengthEndedReview = () => ({ eligible: false,
  classification: "unestablished-length-ended-review", code: "transport-mock-has-no-length-law", violations: [] });

`;

/** Serialize inert host events for transport tests, with a genuine fixture EOF marker. */
export function transportResponse({ text = "transport fixture", sessionID = "ses_transport", submission = true } = {}) {
  const events = [{ type: "text", timestamp: 1, sessionID, part: { text } }];
  if (submission) events.push({ type: "tool_use", timestamp: 2, sessionID,
    part: { type: "tool", id: "part_mock_submit", callID: "call_mock_submit", sessionID,
      tool: "review_submit", state: { status: "completed", input: {},
        output: JSON.stringify({ "ok?": true, fixtureAuthority: "TRANSPORT_MOCK_ONLY" }) } } });
  events.push({ type: "step_finish", timestamp: 3, sessionID, part: { reason: "stop" } });
  return Buffer.from(events.map((event) => JSON.stringify(event)).join("\n") + "\n");
}

/** Stage explicit local-only verifier, input and registry for the actual supervisor CLI. */
export function stageTransportVerifier(evidenceDirectory, { verifierFile = path.join(evidenceDirectory, "transport-verifier.cjs"),
  registryFile = path.join(evidenceDirectory, "tools.txt"), reviewTools = transportReviewTools } = {}) {
  fs.mkdirSync(path.dirname(verifierFile), { recursive: true });
  fs.mkdirSync(path.dirname(registryFile), { recursive: true });
  fs.writeFileSync(verifierFile, transportVerifierSource);
  fs.writeFileSync(registryFile, reviewTools.join("\n") + "\n");
  const full = path.join(evidenceDirectory, "basehead.diff");
  const manifest = path.join(evidenceDirectory, "input-manifest.json");
  if (!fs.existsSync(full)) fs.writeFileSync(full, "synthetic transport input\n");
  if (!fs.existsSync(manifest)) fs.writeFileSync(manifest, '{"fixtureAuthority":"TRANSPORT_MOCK_ONLY"}\n');
  const verifier = createRequire(import.meta.url)(verifierFile);
  const expectedContext = verifier.prepareReviewInvocationContext(fs.readFileSync(full), fs.readFileSync(manifest),
    reviewTools, path.join(evidenceDirectory, "submission.json"));
  const output = path.join(evidenceDirectory, "invocation-outputs");
  fs.writeFileSync(output, "");
  return { verifierFile, registryFile, output, expectedContext,
    verifierSha256: transportSha256(fs.readFileSync(verifierFile)),
    verifyReviewInvocation: verifier.verifyReviewInvocation,
    env: { REVIEW_INVOCATION_VERIFIER_FILE: verifierFile, REVIEW_TOOL_REGISTRY_FILE: registryFile, GITHUB_OUTPUT: output } };
}

/** Bind already-written valid fixture bytes BEFORE a post-guard mutation. */
export function bindTransportInvocation(evidenceDirectory, fixture) {
  const response = transportResponse();
  const submission = fs.readFileSync(path.join(evidenceDirectory, "submission.json"));
  const verdict = fixture.verifyReviewInvocation(response, submission, fixture.expectedContext);
  assert.equal(verdict.ok, true);
  const accepted = { attempt: 1, response_file: "model-response-attempt-1.txt",
    response_sha256: transportSha256(response), submission_file: "submission.json",
    submission_sha256: transportSha256(submission), session_id: verdict.sessionID,
    canonical_verdict: verdict, verifier_sha256: fixture.verifierSha256,
    expected_context_sha256: transportSha256(JSON.stringify(fixture.expectedContext)) };
  fs.writeFileSync(path.join(evidenceDirectory, accepted.response_file), response);
  fs.writeFileSync(path.join(evidenceDirectory, "opencode-stderr-attempt-1.log"), "");
  fs.writeFileSync(path.join(evidenceDirectory, "recovery.json"), JSON.stringify({
    schema: "open-hax.review-recovery/v1", max_attempts: 2, recovery_reason: null,
    attempts: [{ attempt: 1, exit_code: 0, invocation_state: "completed", submission_state: "present",
      response_file: accepted.response_file, stderr_file: "opencode-stderr-attempt-1.log" }],
    accepted_invocation: accepted }, null, 2) + "\n");
  const digest = transportSha256(JSON.stringify(accepted));
  fs.appendFileSync(fixture.output, `review_invocation_sha256=${digest}\n`);
  return digest;
}
