// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runReviewRecovery } from "./run-opencode-review-recovery.mjs";

const runner = fileURLToPath(new URL("./run-opencode-review-recovery.mjs", import.meta.url));
/**
 * Hash fixture data without interpreting its contents.
 * @param {string|Buffer|TypedArray|DataView} bytes - Hash input.
 * @returns {string} Hexadecimal SHA-256 digest.
 */
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const submission = Buffer.from('{"schema":"open-hax.github-review/v1","summary":"fixture"}\n');
const context = { fixture: "caller-owned context" };

/**
 * Create a temporary fixture directory and register test cleanup.
 * @param {import('node:test').TestContext} t - Owning test context.
 * @returns {string} Temporary directory path.
 */
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "invocation-integrity-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

// These injected verdicts test transport, not a second implementation of Muse law.
/**
 * Create an injected accepted verdict for transport tests, not Muse law.
 * @returns {Object} Fixed synthetic verifier result and invocation binding.
 */
function accepted() {
  return { ok: true, reason: null, reasonKind: null, code: "verified-review-invocation",
    violations: [], sessionID: "ses_fixture", pageCount: 1, reviewCallCount: 9,
    acceptedInvocation: { sessionID: "ses_fixture", submissionCallID: "call_submit",
      submissionPosition: 9, submissionFile: "/fixture/submission.json",
      fullInputSha256: "a".repeat(64), pageCount: 1 } };
}
/**
 * Create an injected refusal with no accepted invocation.
 * @param {string} [reason="stale-review-coverage"] - Fixture refusal kind.
 * @returns {Object} Synthetic refusal result.
 */
function refused(reason = "stale-review-coverage") {
  return { ok: false, reason, reasonKind: reason, code: "fixture-refusal",
    violations: [], acceptedInvocation: null };
}

/**
 * Start the supervisor with injected transport fixtures and retain its calls.
 * @param {string} directory - Fixture evidence directory.
 * @param {Object} [options] - Verdicts, exits, submissions, verifier and beforeInvoke overrides.
 * @returns {{promise: Promise<Object>, invocations: Object[], checks: Object[]}} Completion promise and recorded calls.
 */
function exercise(directory, { verdicts = [refused(), accepted()], exits = [0, 0],
  submissions = [submission, submission], verifier, beforeInvoke } = {}) {
  const invocations = [];
  const checks = [];
  const promise = runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Review all input.",
    expectedContext: context, verifierSha256: "b".repeat(64),
    verifyReviewInvocation: verifier ?? ((response, body, expected) => {
      assert.ok(Buffer.isBuffer(response));
      assert.ok(body === null || Buffer.isBuffer(body));
      assert.equal(expected, context);
      checks.push({ response: Buffer.from(response), body: body && Buffer.from(body) });
      return verdicts[checks.length - 1];
    }),
    invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
      beforeInvoke?.(attempt);
      invocations.push({ attempt, prompt });
      fs.writeFileSync(responseFile, `host fixture ${attempt}\n`);
      fs.writeFileSync(stderrFile, `stderr fixture ${attempt}\n`);
      if (submissions[attempt - 1] !== null) fs.writeFileSync(path.join(directory, "submission.json"), submissions[attempt - 1]);
      return { exitCode: exits[attempt - 1] };
    } });
  return { promise, invocations, checks };
}

test("stale parseable artifact is renamed before the sole fresh invocation", async (t) => {
  const directory = fixture(t);
  const { promise, invocations, checks } = exercise(directory, { beforeInvoke(attempt) {
    if (attempt === 2) {
      assert.equal(fs.existsSync(path.join(directory, "submission.json")), false);
      assert.deepEqual(fs.readFileSync(path.join(directory, "submission-attempt-1.json")), submission);
    }
  } });
  const metadata = await promise;
  assert.deepEqual(invocations.map((call) => call.attempt), [1, 2]);
  assert.match(invocations[1].prompt, /fresh bounded.*invocation/is);
  assert.equal(checks.length, 2);
  assert.equal(metadata.recovery_reason, "stale-review-coverage");
  assert.equal(metadata.attempts[0].retained_submission_file, "submission-attempt-1.json");
  assert.equal(metadata.attempts[0].retained_submission_sha256, sha256(submission));
  assert.equal(metadata.accepted_invocation.attempt, 2);
  assert.equal(metadata.accepted_invocation.response_sha256, sha256(checks[1].response));
  assert.equal(metadata.accepted_invocation.submission_sha256, sha256(submission));
  assert.equal(metadata.accepted_invocation.session_id, "ses_fixture");
  assert.deepEqual(metadata.accepted_invocation.canonical_verdict, accepted());
  assert.equal(metadata.accepted_invocation.verifier_sha256, "b".repeat(64));
  assert.equal(metadata.accepted_invocation.expected_context_sha256, sha256(JSON.stringify(context)));
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "host fixture 1\n");
});

test("first canonical passing submission binds its actual bytes without recovery", async (t) => {
  const directory = fixture(t);
  const { promise, invocations } = exercise(directory, { verdicts: [accepted()] });
  const metadata = await promise;
  assert.equal(invocations.length, 1);
  assert.equal(metadata.recovery_reason, null);
  assert.equal(metadata.accepted_invocation.attempt, 1);
  assert.equal(metadata.attempts[0].verification_state, "returned");
});

for (const reason of ["unestablished-review-trace", "source-mismatch", "schema-mismatch", "quota", "authentication", "unknown"]) {
  test(`canonical ${reason} refusal cannot recover or accept a parseable envelope`, async (t) => {
    const directory = fixture(t);
    const { promise, invocations } = exercise(directory, { verdicts: [refused(reason)] });
    await assert.rejects(promise, /invocation verification/);
    assert.equal(invocations.length, 1);
    const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
    assert.equal(metadata.accepted_invocation, null);
    assert.equal(metadata.attempts[0].canonical_verdict.reason, reason);
  });
}

for (const [name, verdict] of [
  ["missing verdict", undefined], ["model marker", "stale-review-coverage"],
  ["unknown envelope", {}], ["conflicting kinds", { ...refused(), reasonKind: "unestablished-review-trace" }],
  ["contradictory passing reason", { ...accepted(), reason: "stale-review-coverage" }],
  ["passing without accepted binding", { ...accepted(), acceptedInvocation: null }],
  ["session binding mismatch", { ...accepted(), sessionID: "different" }],
  ["missing typed reasonKind", { ...refused(), reasonKind: undefined }],
  ["missing violations", { ...refused(), violations: undefined }],
  ["refusal carrying accepted data", { ...refused(), acceptedInvocation: accepted().acceptedInvocation }],
]) {
  test(`${name} is a verifier fault with no retry`, async (t) => {
    const directory = fixture(t);
    const { promise, invocations } = exercise(directory, { verdicts: [verdict] });
    await assert.rejects(promise, /verifier/);
    assert.equal(invocations.length, 1);
    const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
    assert.equal(metadata.attempts[0].verification_state, "rejected");
    assert.equal(metadata.accepted_invocation, null);
  });
}

for (const exitCode of [1, 2, 17, null]) {
  test(`stale verdict with exit ${exitCode} grants no fresh process`, async (t) => {
    const directory = fixture(t);
    const { promise, invocations } = exercise(directory, { exits: [exitCode] });
    await assert.rejects(promise, /attempt 1 exited/);
    assert.equal(invocations.length, 1);
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"))).attempts[0].canonical_verdict.reason, "stale-review-coverage");
  });
}

test("malformed submission never gets stale-recovery credit", async (t) => {
  const directory = fixture(t);
  const { promise, invocations } = exercise(directory, { submissions: [Buffer.from("{broken")] });
  await assert.rejects(promise, /malformed review submission/);
  assert.equal(invocations.length, 1);
  assert.equal(fs.existsSync(path.join(directory, "submission-attempt-1.json")), false);
});

test("strict missing submission with unestablished trace does not use legacy omission recovery", async (t) => {
  const { promise, invocations } = exercise(fixture(t), { verdicts: [refused("unestablished-review-trace")], submissions: [null] });
  await assert.rejects(promise, /invocation verification/);
  assert.equal(invocations.length, 1);
});

test("canonical established omission preserves original missing-submit reason and prompt", async (t) => {
  const directory = fixture(t);
  const { promise, invocations } = exercise(directory, { verdicts: [refused("missing-review-submit"), accepted()], submissions: [null, submission] });
  const metadata = await promise;
  assert.deepEqual(invocations.map((call) => call.attempt), [1, 2]);
  assert.equal(metadata.recovery_reason, "missing_review_submit");
  assert.match(invocations[1].prompt, /first completed model invocation omitted the required review_submit artifact/);
  assert.equal(metadata.attempts[0].submission_state, "missing");
  assert.equal(metadata.attempts[0].submission_sha256, null);
  assert.equal(metadata.accepted_invocation.attempt, 2);
});

test("typed omission with a present envelope is contradictory and cannot recover", async (t) => {
  const { promise, invocations } = exercise(fixture(t), { verdicts: [refused("missing-review-submit")] });
  await assert.rejects(promise, /invocation verification/);
  assert.equal(invocations.length, 1);
});

test("repeated established omission stops at the original shared two-attempt bound", async (t) => {
  const directory = fixture(t);
  const { promise, invocations } = exercise(directory, { verdicts: [refused("missing-review-submit"), refused("missing-review-submit")], submissions: [null, null] });
  await assert.rejects(promise, /omitted review_submit after 2 attempts/);
  assert.deepEqual(invocations.map((call) => call.attempt), [1, 2]);
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
});

test("typed omission with nonzero exit cannot recover", async (t) => {
  const { promise, invocations } = exercise(fixture(t), { verdicts: [refused("missing-review-submit")], submissions: [null], exits: [2] });
  await assert.rejects(promise, /attempt 1 exited 2/);
  assert.equal(invocations.length, 1);
});

test("repeated canonical stale failure stops at two and never produces accepted metadata", async (t) => {
  const directory = fixture(t);
  const { promise, invocations } = exercise(directory, { verdicts: [refused(), refused()] });
  await assert.rejects(promise, /invocation verification/);
  assert.deepEqual(invocations.map((call) => call.attempt), [1, 2]);
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(metadata.accepted_invocation, null);
  assert.equal(metadata.attempts.length, 2);
});

test("verifier exception is recorded and does not consume attempt two", async (t) => {
  const directory = fixture(t);
  const error = new Error("fixture canonical verifier fault");
  const { promise, invocations } = exercise(directory, { verifier() { throw error; } });
  await assert.rejects(promise, (actual) => actual === error);
  assert.equal(invocations.length, 1);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(metadata.attempts[0].verification_error, error.message);
});

for (const file of ["model-response-attempt-1.txt", "submission.json"]) {
  test(`changing ${file} during canonical verification revokes acceptance`, async (t) => {
    const directory = fixture(t);
    const { promise, invocations } = exercise(directory, { verifier() {
      fs.appendFileSync(path.join(directory, file), " ");
      return accepted();
    } });
    await assert.rejects(promise, /changed during.*verification/);
    assert.equal(invocations.length, 1);
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"))).accepted_invocation, null);
  });
}

test("retention collision preserves both files and records the fault without invoking again", async (t) => {
  const directory = fixture(t);
  const retained = path.join(directory, "submission-attempt-1.json");
  fs.writeFileSync(retained, "existing inert bytes");
  const { promise, invocations } = exercise(directory);
  await assert.rejects(promise, /retained submission/);
  assert.equal(invocations.length, 1);
  assert.equal(fs.readFileSync(retained, "utf8"), "existing inert bytes");
  assert.deepEqual(fs.readFileSync(path.join(directory, "submission.json")), submission);
  assert.match(JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"))).attempts[0].retention_error, /retained submission/);
});

test("pre-existing invocation evidence is never overwritten by a strict run", async (t) => {
  const directory = fixture(t);
  const responseFile = path.join(directory, "model-response-attempt-1.txt");
  fs.writeFileSync(responseFile, "prior immutable trace");
  const { promise, invocations } = exercise(directory);
  await assert.rejects(promise, /pre-existing invocation evidence/);
  assert.equal(invocations.length, 0);
  assert.equal(fs.readFileSync(responseFile, "utf8"), "prior immutable trace");
});

test("strict rejected invocation retains diagnostics and rethrows its original error", async (t) => {
  const directory = fixture(t);
  const error = new Error("synthetic child rejected");
  let verifierCalls = 0;
  await assert.rejects(runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Review input.",
    expectedContext: context, verifyReviewInvocation() { verifierCalls++; return accepted(); },
    async invokeAttempt() { throw error; } }), (actual) => actual === error);
  assert.equal(verifierCalls, 0);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(metadata.attempts.length, 1);
  assert.equal(metadata.attempts[0].verification_state, "not-run-invocation-rejected");
  assert.equal(metadata.attempts[0].response_sha256, sha256(""));
  assert.equal(metadata.accepted_invocation, null);
});

/**
 * Build a synthetic repeated unavailable-tool tail and permission error.
 * @returns {Object[]} Fixture events; not a native host trace.
 */
function unavailableEvents() {
  const sessionID = "ses_failure";
  return [1, 2].map((n) => ({ type: "tool_use", timestamp: n, sessionID,
    part: { type: "tool", id: `part_${n}`, callID: `call_${n}`, sessionID, tool: "invalid",
      state: { status: "completed", input: { tool: "assess_diff_chunk",
        error: "Model tried to call unavailable tool 'assess_diff_chunk'. Available tools: invalid, review_assess_diff_chunk, review_begin, review_submit." } } } }))
    .concat({ type: "error", timestamp: 4, sessionID,
      error: { name: "UnknownError", data: { message: "The user rejected permission to use this specific tool call." } } });
}

for (const secondStale of [false, true]) {
  test(`known unavailable tool and stale coverage share one budget; second stale=${secondStale}`, async (t) => {
    const directory = fixture(t);
    const calls = [];
    let checks = 0;
    const promise = runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Review input.",
      reviewTools: ["review_begin", "review_assess_diff_chunk", "review_submit"],
      expectedContext: context,
      verifyReviewInvocation() { return ++checks === 1 ? refused("unestablished-review-trace") : secondStale ? refused() : accepted(); },
      async invokeAttempt({ attempt, responseFile, stderrFile }) {
        calls.push(attempt);
        fs.writeFileSync(responseFile, attempt === 1 ? unavailableEvents().map((event) => JSON.stringify(event)).join("\n") + "\n" : "second host trace\n");
        fs.writeFileSync(stderrFile, attempt === 1 ? "! permission requested: doom_loop (invalid); auto-rejecting\n" : "");
        if (attempt === 2) fs.writeFileSync(path.join(directory, "submission.json"), submission);
        return { exitCode: attempt === 1 ? 1 : 0 };
      } });
    if (secondStale) await assert.rejects(promise, /invocation verification/);
    else assert.equal((await promise).accepted_invocation.attempt, 2);
    assert.deepEqual(calls, [1, 2]);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"))).recovery_reason, "unavailable_review_tool");
  });
}

/**
 * Stage a synthetic child, transport verifier and CLI inputs for a test.
 * @param {import('node:test').TestContext} t - Context owning fixture cleanup.
 * @returns {Object} Directory, child, verifier, output paths and fixture environment.
 */
function cliFixture(t) {
  const directory = fixture(t);
  const child = path.join(directory, "synthetic-child.mjs");
  const verifier = path.join(directory, "trusted-fixture-verifier.cjs");
  const prompt = path.join(directory, "prompt.md");
  const output = path.join(directory, "github-output.txt");
  fs.writeFileSync(prompt, "Full current review #{{PR_NUMBER}}.\n");
  fs.writeFileSync(path.join(directory, "basehead.diff"), "immutable synthetic full diff\n");
  fs.writeFileSync(path.join(directory, "input-manifest.json"), "{}\n");
  fs.writeFileSync(child, `#!${process.execPath}
import fs from 'node:fs'; import path from 'node:path';
if (process.env.GITHUB_OUTPUT !== undefined) process.exit(19);
const dir = process.env.REVIEW_EVIDENCE_DIR;
const counter = path.join(dir, 'child-count.txt');
const attempt = fs.existsSync(counter) ? Number(fs.readFileSync(counter, 'utf8')) + 1 : 1;
fs.writeFileSync(counter, String(attempt));
console.log(JSON.stringify({type:'text',sessionID:'ses_fixture',timestamp:attempt,part:{text:'synthetic host transport fixture'}}));
console.error('synthetic stderr ' + attempt);
if(attempt!==1 || !process.env.TEST_OMIT_FIRST) fs.writeFileSync(path.join(dir,'submission.json'), ${JSON.stringify(submission.toString())});
`);
  fs.chmodSync(child, 0o755);
  // Transport-only CJS fixture: verifies byte arguments/context preparation and
  // process completion. Actual review semantics stay in the separate Muse law.
  fs.writeFileSync(verifier, `const fs=require('node:fs'); const path=require('node:path');
exports.prepareReviewInvocationContext=(diff,manifest,tools,file)=>{
 if(!Buffer.isBuffer(diff)||!Buffer.isBuffer(manifest)||!Array.isArray(tools)||!path.isAbsolute(file)) throw Error('bad preparation arguments');
 fs.appendFileSync(path.join(path.dirname(file),'prepare-count.txt'),'prepare\\n');
 return {fixture:'prepared-before-child'};
};
exports.verifyReviewInvocation=(response,body,ctx)=>{
 if(!Buffer.isBuffer(response)||!Buffer.isBuffer(body)||ctx.fixture!=='prepared-before-child') throw Error('bad verifier arguments');
 const attempt=Number(fs.readFileSync(path.join(process.env.REVIEW_EVIDENCE_DIR,'child-count.txt'),'utf8'));
 return attempt===1 ? ${JSON.stringify(refused())} : ${JSON.stringify(accepted())};
};\n`);
  const env = { ...process.env, PR_NUMBER: "342", REVIEW_PROMPT_FILE: prompt,
    REVIEW_EVIDENCE_DIR: directory, OPENCODE_BIN: child, REVIEW_MODEL: "synthetic/fixture",
    REVIEW_INVOCATION_VERIFIER_FILE: verifier, GITHUB_OUTPUT: output };
  return { directory, child, verifier, output, env };
}

test("main requires the staged verifier before starting a child", (t) => {
  const { directory, env } = cliFixture(t);
  delete env.REVIEW_INVOCATION_VERIFIER_FILE;
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /REVIEW_INVOCATION_VERIFIER_FILE is required/);
  assert.equal(fs.existsSync(path.join(directory, "child-count.txt")), false);
});

test("main requires both canonical exports rather than a legacy optional callback", (t) => {
  const { directory, verifier, env } = cliFixture(t);
  fs.writeFileSync(verifier, "exports.verifyReviewInvocation=()=>({ok:true});\n");
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /prepareReviewInvocationContext/);
  assert.equal(fs.existsSync(path.join(directory, "child-count.txt")), false);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.match(metadata.setup_error, /prepareReviewInvocationContext/);
  assert.deepEqual(metadata.attempts, []);
});

test("canonical preparation fault records rejection without child invocation", (t) => {
  const { directory, verifier, env } = cliFixture(t);
  fs.writeFileSync(verifier, "exports.verifyReviewInvocation=()=>null; exports.prepareReviewInvocationContext=()=>{throw Error('invalid context fixture')};\n");
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 1);
  assert.equal(fs.existsSync(path.join(directory, "child-count.txt")), false);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(metadata.setup_error, "invalid context fixture");
  assert.equal(metadata.accepted_invocation, null);
});

test("real child boundary requires strict CJS and prepares once before both fresh processes", (t) => {
  const { directory, child, verifier, output, env } = cliFixture(t);
  const commandFiles = ["GITHUB_OUTPUT", "GITHUB_ENV", "GITHUB_PATH", "GITHUB_STATE", "GITHUB_STEP_SUMMARY"];
  const sentinels = new Map(commandFiles.slice(1).map((name) => {
    const file = path.join(directory, `${name}.txt`);
    const bytes = `supervisor-only ${name}\n`;
    fs.writeFileSync(file, bytes);
    env[name] = file;
    return [name, { file, bytes }];
  }));
  env.REVIEW_CHILD_ENV_SENTINEL = "benign-child-environment-control";
  const counterWrite = "fs.writeFileSync(counter, String(attempt));\n";
  const probe = [
    `const commandFiles = ${JSON.stringify(commandFiles)};`,
    "fs.appendFileSync(path.join(dir, 'child-environment.ndjson'), JSON.stringify({ attempt, pid: process.pid, present: Object.fromEntries(commandFiles.map(name => [name, Object.hasOwn(process.env, name)])), benign: process.env.REVIEW_CHILD_ENV_SENTINEL }) + '\\n');",
    "for (const name of commandFiles.slice(1)) if (process.env[name]) fs.appendFileSync(process.env[name], 'child-write-attempt-' + attempt + '\\n');",
  ].join("\n") + "\n";
  const childSource = fs.readFileSync(child, "utf8");
  assert.equal(childSource.split(counterWrite).length, 2);
  fs.writeFileSync(child, childSource.replace(counterWrite, counterWrite + probe));
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 0, result.stderr);
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(fs.readFileSync(path.join(directory, "prepare-count.txt"), "utf8"), "prepare\n");
  assert.equal(fs.readFileSync(path.join(directory, "child-count.txt"), "utf8"), "2");
  assert.equal(recovery.accepted_invocation.verifier_sha256, sha256(fs.readFileSync(verifier)));
  const digest = sha256(JSON.stringify(recovery.accepted_invocation));
  assert.equal(fs.readFileSync(output, "utf8"), `review_invocation_sha256=${digest}\n`);
  for (const [file, key] of [[recovery.accepted_invocation.response_file, "response_sha256"],
    [recovery.accepted_invocation.submission_file, "submission_sha256"]]) {
    assert.equal(sha256(fs.readFileSync(path.join(directory, file))), recovery.accepted_invocation[key]);
    fs.appendFileSync(path.join(directory, file), " ");
    assert.notEqual(sha256(fs.readFileSync(path.join(directory, file))), recovery.accepted_invocation[key]);
  }
  recovery.accepted_invocation.attempt = 1;
  assert.notEqual(sha256(JSON.stringify(recovery.accepted_invocation)), digest);
  const observations = fs.readFileSync(path.join(directory, "child-environment.ndjson"), "utf8")
    .trim().split("\n").map((line) => JSON.parse(line));
  t.diagnostic(`actual child environment observations: ${JSON.stringify(observations)}`);
  assert.deepEqual(observations.map(({ attempt }) => attempt), [1, 2]);
  assert.equal(new Set(observations.map(({ pid }) => pid)).size, 2);
  for (const observation of observations) {
    assert.equal(observation.benign, env.REVIEW_CHILD_ENV_SENTINEL);
    assert.deepEqual(observation.present, Object.fromEntries(commandFiles.map((name) => [name, false])));
  }
  for (const [name, { file, bytes }] of sentinels) {
    assert.equal(fs.readFileSync(file, "utf8"), bytes);
    assert.equal(env[name], file);
  }
  assert.equal(env.GITHUB_OUTPUT, output);
});

test("CLI canonical rejection records diagnostics and emits no trusted acceptance digest", (t) => {
  const { directory, verifier, output, env } = cliFixture(t);
  const text = fs.readFileSync(verifier, "utf8").replace(`attempt===1 ? ${JSON.stringify(refused())} : ${JSON.stringify(accepted())}`, JSON.stringify(refused("unestablished-review-trace")));
  fs.writeFileSync(verifier, text);
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 1);
  assert.equal(fs.existsSync(output), false);
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(recovery.attempts.length, 1);
  assert.equal(recovery.accepted_invocation, null);
});

test("real fresh child recovers only canonically established structured omission", (t) => {
  const { directory, verifier, output, env } = cliFixture(t);
  let source = fs.readFileSync(verifier, "utf8");
  source = source.replace("!Buffer.isBuffer(body)", "!(body===null || Buffer.isBuffer(body))")
    .replace(JSON.stringify(refused()), JSON.stringify(refused("missing-review-submit")));
  fs.writeFileSync(verifier, source);
  env.TEST_OMIT_FIRST = "1";
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 0, result.stderr);
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.equal(recovery.recovery_reason, "missing_review_submit");
  assert.equal(recovery.attempts[0].submission_state, "missing");
  assert.equal(recovery.attempts[0].canonical_verdict.reason, "missing-review-submit");
  assert.equal(recovery.accepted_invocation.attempt, 2);
  assert.equal(fs.readFileSync(output, "utf8"), `review_invocation_sha256=${sha256(JSON.stringify(recovery.accepted_invocation))}\n`);
});

/**
 * Assert that a corrective prompt requires stopping on restart-required.
 * @param {string} prompt - Corrective prompt under test.
 * @returns {void}
 * @throws {AssertionError} If a required stop or recovery-bound instruction is absent.
 */
function assertRestartStopPrompt(prompt) {
  assert.match(prompt, /returned ok, unless a tool reports restart-required\?/);
  assert.match(prompt, /If restart-required\? is\s+true, stop this invocation without calling review_submit/);
  assert.match(prompt, /do not use review_begin\s+or reassessment to erase its failed history/);
  assert.match(prompt, /This is the only recovery attempt\./);
}

for (const cause of ["stale-review-coverage", "missing-review-submit", "unavailable-review-tool"]) {
  test(`corrective prompt stops on restart-required after ${cause}`, async (t) => {
    const directory = fixture(t);
    let prompt;
    if (cause === "unavailable-review-tool") {
      let checks = 0;
      const metadata = await runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Review input.",
        reviewTools: ["review_begin", "review_assess_diff_chunk", "review_submit"], expectedContext: context,
        verifyReviewInvocation() { return ++checks === 1 ? refused("unestablished-review-trace") : accepted(); },
        async invokeAttempt({ attempt, prompt: currentPrompt, responseFile, stderrFile }) {
          if (attempt === 2) prompt = currentPrompt;
          fs.writeFileSync(responseFile, attempt === 1
            ? unavailableEvents().map((event) => JSON.stringify(event)).join("\n") + "\n" : "second host fixture\n");
          fs.writeFileSync(stderrFile, attempt === 1 ? "! permission requested: doom_loop (invalid); auto-rejecting\n" : "");
          if (attempt === 2) fs.writeFileSync(path.join(directory, "submission.json"), submission);
          return { exitCode: attempt === 1 ? 1 : 0 };
        } });
      assert.equal(metadata.recovery_reason, "unavailable_review_tool");
      assert.equal(metadata.accepted_invocation.attempt, 2);
    } else {
      const { promise, invocations } = exercise(directory, { verdicts: [refused(cause), accepted()],
        submissions: [cause === "missing-review-submit" ? null : submission, submission] });
      await promise;
      assert.deepEqual(invocations.map((call) => call.attempt), [1, 2]);
      prompt = invocations[1].prompt;
    }
    assertRestartStopPrompt(prompt);
  });
}

test("fresh corrective process stops on restart-required and retains stale refusal without a third", (t) => {
  const { directory, child, verifier, output, env } = cliFixture(t);
  // Owned transport fixture, not a model or another implementation of Muse law.
  const childSource = fs.readFileSync(child, "utf8")
    .replace("console.error('synthetic stderr ' + attempt);", `console.error('synthetic stderr ' + attempt);
fs.writeFileSync(path.join(dir, 'prompt-attempt-' + attempt + '.txt'), process.argv.at(-1));
fs.writeFileSync(path.join(dir, 'pid-attempt-' + attempt + '.txt'), String(process.pid));
if (attempt===2 && !process.argv.at(-1).includes('stop this invocation without calling review_submit')) process.exit(23);`)
    .replace("if(attempt!==1 || !process.env.TEST_OMIT_FIRST)", "if(attempt===1)");
  fs.writeFileSync(child, childSource);
  const verifierSource = fs.readFileSync(verifier, "utf8")
    .replace("!Buffer.isBuffer(body)", "!(body===null || Buffer.isBuffer(body))")
    .replace(`attempt===1 ? ${JSON.stringify(refused())} : ${JSON.stringify(accepted())}`, JSON.stringify(refused()));
  fs.writeFileSync(verifier, verifierSource);
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /verification failed after attempt 2: stale-review-coverage/);
  assertRestartStopPrompt(fs.readFileSync(path.join(directory, "prompt-attempt-2.txt"), "utf8"));
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  assert.deepEqual(recovery.attempts.map((attempt) => [attempt.attempt, attempt.exit_code, attempt.invocation_state]),
    [[1, 0, "completed"], [2, 0, "completed"]]);
  assert.equal(recovery.attempts[1].canonical_verdict.reason, "stale-review-coverage");
  assert.equal(recovery.attempts[1].submission_state, "missing");
  assert.equal(recovery.accepted_invocation, null);
  assert.equal(fs.existsSync(path.join(directory, "submission.json")), false);
  assert.deepEqual(fs.readFileSync(path.join(directory, "submission-attempt-1.json")), submission);
  assert.equal(fs.readFileSync(path.join(directory, "child-count.txt"), "utf8"), "2");
  assert.notEqual(fs.readFileSync(path.join(directory, "pid-attempt-1.txt"), "utf8"),
    fs.readFileSync(path.join(directory, "pid-attempt-2.txt"), "utf8"));
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
  assert.equal(fs.existsSync(output), false);
});

test("actual CLI passes the entire trusted registry to canonical preparation and verification", (t) => {
  const { directory, verifier, output, env } = cliFixture(t);
  const tools = ["phase_observations", "review_begin", "actor_list", "review_submit", "fixture_observer"];
  const registry = path.join(directory, "actual-exposed-tools.txt");
  fs.writeFileSync(registry, tools.join("\r\n") + "\r\n");
  env.REVIEW_TOOL_REGISTRY_FILE = registry;
  // Record the actual supervisor arguments in the trusted transport callback;
  // this fixture supplies no Muse semantic verdict or native review credit.
  fs.writeFileSync(verifier, `const fs=require('node:fs'); const path=require('node:path');
const {createHash}=require('node:crypto');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
exports.prepareReviewInvocationContext=(diff,manifest,tools,file)=>{
 if(!Buffer.isBuffer(diff)||!Buffer.isBuffer(manifest)||!Array.isArray(tools)||!path.isAbsolute(file)) throw Error('bad custody arguments');
 if(fs.existsSync(path.join(path.dirname(file),'child-count.txt'))) throw Error('preparation ran after child');
 const context={fixture:'TRANSPORT_MOCK_ONLY',tools:[...tools],diffSha256:digest(diff),manifestSha256:digest(manifest),submissionFile:file};
 fs.writeFileSync(path.join(path.dirname(file),'prepared-custody.json'),JSON.stringify(context));
 return context;
};
exports.verifyReviewInvocation=(response,body,context)=>{
 if(!Buffer.isBuffer(response)||!Buffer.isBuffer(body)) throw Error('bad verifier bytes');
 fs.writeFileSync(path.join(path.dirname(context.submissionFile),'verified-custody.json'),JSON.stringify(context));
 return ${JSON.stringify(refused("unestablished-review-trace"))};
};\n`);
  const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /verification failed after attempt 1: unestablished-review-trace/);
  const prepared = JSON.parse(fs.readFileSync(path.join(directory, "prepared-custody.json")));
  assert.deepEqual(prepared, { fixture: "TRANSPORT_MOCK_ONLY", tools,
    diffSha256: sha256(fs.readFileSync(path.join(directory, "basehead.diff"))),
    manifestSha256: sha256(fs.readFileSync(path.join(directory, "input-manifest.json"))),
    submissionFile: path.join(directory, "submission.json") });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory, "verified-custody.json"))), prepared);
  assert.equal(fs.readFileSync(path.join(directory, "child-count.txt"), "utf8"), "1");
  assert.equal(fs.existsSync(output), false);
});

test("actual publication preparation adapter forwards the full trusted registry without an observer allowlist", async (t) => {
  const directory = fixture(t);
  const contextDir = path.join(directory, ".review-context");
  fs.mkdirSync(path.join(contextDir, "metadata"), { recursive: true });
  const tools = ["phase_observations", "review_begin", "actor_list", "review_submit", "fixture_observer"];
  fs.writeFileSync(path.join(contextDir, "metadata/exposed-tools.txt"), tools.join("\n") + "\n");
  const { createRequire } = await import("node:module");
  const YAML = createRequire(import.meta.url)("yaml");
  const workflow = YAML.parse(fs.readFileSync(new URL("../workflows/opencode-code-review.yml", import.meta.url), "utf8"));
  const final = workflow.jobs.review.steps.find((step) => step.name === "Reverify full input and bind final submission");
  assert.ok(final);
  // Execute the production custody adapter, with an inert callback. Existing
  // full-command tests exercise the independent input/source/digest guards.
  const start = final.run.indexOf("const registry = fs.readFileSync(");
  const end = final.run.indexOf("assert.equal(sha256(JSON.stringify(invocationContext))", start);
  assert.ok(start >= 0 && end > start);
  const expected = Buffer.from("immutable transport diff\n");
  const manifestBytes = Buffer.from('{"fixture":"TRANSPORT_MOCK_ONLY"}\n');
  const calls = [];
  const verifier = { prepareReviewInvocationContext(...args) { calls.push(args); return context; } };
  const prepared = new Function("fs", "path", "contextDir", "verifier", "expected", "manifestBytes", "dir",
    `${final.run.slice(start, end)}\nreturn invocationContext;`)(fs, path, contextDir, verifier, expected, manifestBytes, directory);
  assert.equal(prepared, context);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], expected);
  assert.equal(calls[0][1], manifestBytes);
  assert.deepEqual(calls[0][2], tools);
  assert.equal(calls[0][3], path.join(directory, "submission.json"));
});

/**
 * Assert that a prompt retains the strict failed-call stop instructions.
 * @param {string} prompt - Initial or corrective prompt under test.
 * @returns {void}
 * @throws {AssertionError} If a required failure-stop or shared-bound instruction is absent.
 */
function assertStrictFailedCallStopPrompt(prompt) {
  assert.match(prompt, /Strict invocation instructions override any earlier retry or repair instructions/);
  assert.match(prompt, /Every review tool call must succeed/);
  assert.match(prompt, /ANY review tool call fails, including\s+review_begin, any stage call, or review_submit/);
  assert.match(prompt, /stop the current invocation\s+immediately without further review tool calls or submission/);
  assert.match(prompt, /Never repair,\s+reset with review_begin, or reassess within a failed invocation/);
  assert.match(prompt, /Only the caller may start the sole fresh process/);
  assert.match(prompt, /existing typed\s+stale-coverage, healthy-omission, or known-unavailable-tool recovery path/);
  assert.match(prompt, /Unknown failures must STOP without automatic retry/);
  assert.match(prompt, /do not\s+waive any canonical result, verification guard, or the two-attempt bound/);
}

for (const cause of ["stale-review-coverage", "missing-review-submit", "unavailable-review-tool"]) {
  test(`actual first and sole corrective CLI prompts stop every failed review call after ${cause}`, (t) => {
    const { directory, child, verifier, output, env } = cliFixture(t);
    const registry = path.join(directory, "actual-exposed-tools.txt");
    fs.writeFileSync(registry, "phase_observations\nreview_begin\nreview_assess_diff_chunk\nreview_submit\n");
    env.REVIEW_TOOL_REGISTRY_FILE = registry;
    fs.writeFileSync(child, `#!${process.execPath}
import fs from 'node:fs'; import path from 'node:path';
if(process.env.GITHUB_OUTPUT!==undefined) process.exit(19);
const dir=process.env.REVIEW_EVIDENCE_DIR;
const counter=path.join(dir,'child-count.txt');
const attempt=fs.existsSync(counter)?Number(fs.readFileSync(counter,'utf8'))+1:1;
fs.writeFileSync(counter,String(attempt));
fs.writeFileSync(path.join(dir,'prompt-attempt-'+attempt+'.txt'),process.argv.at(-1));
fs.writeFileSync(path.join(dir,'pid-attempt-'+attempt+'.txt'),String(process.pid));
if(attempt===1 && ${JSON.stringify(cause)}==='unavailable-review-tool') {
 for(const event of ${JSON.stringify(unavailableEvents())}) console.log(JSON.stringify(event));
 console.error('! permission requested: doom_loop (invalid); auto-rejecting');
 process.exitCode=1;
} else {
 console.log(JSON.stringify({type:'text',sessionID:'ses_fixture',timestamp:attempt,part:{text:'TRANSPORT_MOCK_ONLY'}}));
 if(attempt===2 || ${JSON.stringify(cause)}!=='missing-review-submit') fs.writeFileSync(path.join(dir,'submission.json'),${JSON.stringify(submission.toString())});
}
`);
    const firstVerdict = refused(cause === "unavailable-review-tool" ? "unestablished-review-trace" : cause);
    const source = fs.readFileSync(verifier, "utf8")
      .replace("!Buffer.isBuffer(body)", "!(body===null || Buffer.isBuffer(body))")
      .replace(JSON.stringify(refused()), JSON.stringify(firstVerdict));
    fs.writeFileSync(verifier, source);
    const result = spawnSync(process.execPath, [runner], { env, encoding: "utf8", timeout: 10_000 });
    assert.equal(result.status, 0, result.stderr);
    const first = fs.readFileSync(path.join(directory, "prompt-attempt-1.txt"), "utf8");
    const second = fs.readFileSync(path.join(directory, "prompt-attempt-2.txt"), "utf8");
    assert.ok(first.startsWith("Full current review #342.\n\n"));
    assert.ok(second.startsWith("Full current review #342.\n\nCorrective attempt 2 of 2:"));
    for (const prompt of [first, second]) {
      assertStrictFailedCallStopPrompt(prompt);
      assert.equal(prompt.match(/Strict invocation instructions/g).length, 1);
      assert.ok(prompt.endsWith("verification guard, or the two-attempt bound.\n"));
    }
    assertRestartStopPrompt(second);
    assert.ok(second.includes(`returned ok, unless a tool reports restart-required?. If restart-required? is
true, stop this invocation without calling review_submit; do not use review_begin
or reassessment to erase its failed history. This is the only recovery attempt.`));
    assert.notEqual(fs.readFileSync(path.join(directory, "pid-attempt-1.txt"), "utf8"),
      fs.readFileSync(path.join(directory, "pid-attempt-2.txt"), "utf8"));
    const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
    assert.equal(metadata.max_attempts, 2);
    assert.equal(metadata.recovery_reason, cause === "stale-review-coverage" ? cause
      : cause === "missing-review-submit" ? "missing_review_submit" : "unavailable_review_tool");
    assert.deepEqual(metadata.attempts.map((entry) => entry.attempt), [1, 2]);
    assert.equal(metadata.accepted_invocation.attempt, 2);
    assert.equal(fs.readFileSync(path.join(directory, "prepare-count.txt"), "utf8"), "prepare\n");
    assert.equal(fs.readFileSync(output, "utf8"), `review_invocation_sha256=${sha256(JSON.stringify(metadata.accepted_invocation))}\n`);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
  });
}

test("callback-absent library keeps both legacy prompts byte-exact", async (t) => {
  const directory = fixture(t);
  const basePrompt = "Legacy review prompt.\nRetry a failed review_begin in this process.\n";
  const prompts = [];
  const metadata = await runReviewRecovery({ evidenceDirectory: directory, basePrompt,
    async invokeAttempt({ attempt, prompt, responseFile, stderrFile }) {
      prompts.push(prompt);
      fs.writeFileSync(responseFile, "legacy transport fixture\n");
      fs.writeFileSync(stderrFile, "");
      if (attempt === 2) fs.writeFileSync(path.join(directory, "submission.json"), submission);
      return { exitCode: 0 };
    } });
  assert.deepEqual(prompts, [basePrompt, `${basePrompt.trimEnd()}

Corrective attempt 2 of 2: the first completed model invocation omitted the required review_submit artifact. Start the evidence-first review state machine
again with review_begin; do not assume any in-memory state survived the first
process. Complete every required stage and do not end until review_submit has
returned ok, unless a tool reports restart-required?. If restart-required? is
true, stop this invocation without calling review_submit; do not use review_begin
or reassessment to erase its failed history. This is the only recovery attempt.
`]);
  assert.equal(metadata.recovery_reason, "missing_review_submit");
  assert.equal(metadata.max_attempts, 2);
  assert.equal(metadata.accepted_invocation, undefined);
});

// Final submit-JSON controls exercise the actual CLI with local child processes.
// The injected callback is a transport spy, never a replacement for Muse law.
/** Create a native-shaped, locally authored final invalid-submit stream. */
function submitJsonEvents() {
  const sessionID = "ses_json_first";
  const event = (type, timestamp, part) => ({ type, timestamp, sessionID,
    part: { id: `json_part_${timestamp}`, sessionID, ...part } });
  const error = 'Invalid input for tool review_submit: JSON parsing failed: Text: {"summary":"broken\nError message: JSON Parse error: Unterminated string';
  return [event("step_start", 1, { type: "step-start" }),
    event("tool_use", 2, { type: "tool", tool: "review_begin", callID: "json_begin", state: {
      status: "completed", input: {}, output: '{"ok?":true}' } }),
    event("tool_use", 3, { type: "tool", tool: "invalid", callID: "json_invalid", state: {
      status: "completed", input: { tool: "review_submit", error },
      output: `The arguments provided to the tool are invalid: ${error}`, metadata: { truncated: false } } }),
    event("step_finish", 4, { type: "step-finish", reason: "tool-calls" }),
    event("text", 5, { type: "text", text: "Stopped; host alone controls any fresh process." }),
    event("step_finish", 6, { type: "step-finish", reason: "stop" })];
}

/** Stage inspected local transport children and a byte-exact callback spy. */
function submitJsonCli(t, { mutate, original = { ...refused("unestablished-review-trace"), code: "unavailable-host-tool" },
  projected = { ...refused("missing-review-submit"), code: "healthy-unfinished-review" },
  mode = "", present = false, secondFailure = false, healthy = false, exitCode = 0,
  registry = ["review_begin", "review_submit"], raw, collision } = {}) {
  const directory = fixture(t), events = submitJsonEvents();
  mutate?.(events);
  const lines = events.map((event) => JSON.stringify(event) + "\r\n");
  const first = raw ?? Buffer.from("\r\n" + lines.join("") + "\r\n");
  // Expected projection is fixture DATA, not a semantic validator.
  const projection = Buffer.from("\r\n" + lines.filter((_, index) => index !== 2).join("") + "\r\n");
  const second = Buffer.from('local complete second transport fixture\n');
  for (const [name, bytes] of [["first.ndjson", first], ["projection.expected", projection], ["second.ndjson", second]])
    fs.writeFileSync(path.join(directory, name), bytes);
  const passing = accepted(); passing.sessionID = "ses_json_second";
  passing.acceptedInvocation.sessionID = passing.sessionID;
  if (collision) fs.writeFileSync(path.join(directory, collision), "retained collision sentinel");
  const plan = { original, projected, passing, mode, present, secondFailure, healthy, exitCode };
  fs.writeFileSync(path.join(directory, "plan.json"), JSON.stringify(plan));
  const child = path.join(directory, "json-child.mjs"), verifier = path.join(directory, "json-verifier.cjs");
  fs.writeFileSync(child, `#!${process.execPath}
import fs from 'node:fs'; import path from 'node:path';
const dir=process.env.REVIEW_EVIDENCE_DIR, plan=JSON.parse(fs.readFileSync(path.join(dir,'plan.json')));
if(process.env.GITHUB_OUTPUT!==undefined) throw Error('trusted output leaked to child');
const ledger=path.join(dir,'children.ndjson');
const attempt=fs.existsSync(ledger)?fs.readFileSync(ledger,'utf8').trim().split('\\n').length+1:1;
fs.appendFileSync(ledger,JSON.stringify({attempt,pid:process.pid,prompt:process.argv.at(-1)})+'\\n');
const first=attempt===1;
if((!first&&!plan.secondFailure)||plan.present||plan.healthy) fs.writeFileSync(path.join(dir,'submission.json'),${JSON.stringify(submission.toString())});
process.stdout.write(fs.readFileSync(path.join(dir,first||plan.secondFailure?'first.ndjson':'second.ndjson')));
process.exitCode=first?plan.exitCode:0;
`);
  fs.chmodSync(child, 0o755);
  fs.writeFileSync(verifier, `// TRANSPORT SPY ONLY: all review semantics remain canonical Muse.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
exports.prepareReviewInvocationContext=(full,manifest,tools,file)=>{
 assert.ok(Buffer.isBuffer(full));assert.ok(Buffer.isBuffer(manifest));
 fs.appendFileSync(path.join(path.dirname(file),'prepare.ndjson'),'prepare\\n');
 return {reviewTools:tools,submissionFile:file};
};
exports.verifyReviewInvocation=(response,body,ctx)=>{
 const dir=path.dirname(ctx.submissionFile),plan=JSON.parse(fs.readFileSync(path.join(dir,'plan.json')));
 const count=fs.readFileSync(path.join(dir,'children.ndjson'),'utf8').trim().split('\\n').length;
 const first=fs.readFileSync(path.join(dir,'first.ndjson')),projected=fs.readFileSync(path.join(dir,'projection.expected'));
 let kind;
 if(count===2&&!plan.secondFailure){assert.deepEqual(response,fs.readFileSync(path.join(dir,'second.ndjson')));kind='second';}
 else if(response.equals(first))kind='original';
 else {assert.deepEqual(response,projected);assert.equal(body,null);kind='projection';}
 fs.appendFileSync(path.join(dir,'checks.ndjson'),JSON.stringify({kind,bodyNull:body===null})+'\\n');
 if(kind==='projection'){
  if(plan.mode==='throw')throw Error('projection callback fault');
  if(plan.mode==='response')fs.appendFileSync(path.join(dir,'model-response-attempt-1.txt'),' ');
  if(plan.mode==='stderr')fs.appendFileSync(path.join(dir,'opencode-stderr-attempt-1.log'),' ');
  if(plan.mode==='projection')fs.appendFileSync(path.join(dir,'review-submit-json-attempt-1.DERIVED.ndjson'),' ');
  if(plan.mode==='omitted')fs.appendFileSync(path.join(dir,'review-submit-json-attempt-1.OMITTED.ndjson'),' ');
  if(plan.mode==='buffer')response[0]=32;
  if(plan.mode==='context')ctx.reviewTools.push('unexpected');
  if(plan.mode==='submission')fs.writeFileSync(ctx.submissionFile,'{}');
  return plan.projected;
 }
 return kind==='second'||plan.healthy?plan.passing:plan.original;
};
`);
  const prompt = path.join(directory, "prompt.md"), output = path.join(directory, "trusted-output");
  fs.writeFileSync(prompt, "Review complete unchanged input #{{PR_NUMBER}}.\n");
  fs.writeFileSync(path.join(directory, "basehead.diff"), "owned transport fixture\n");
  fs.writeFileSync(path.join(directory, "input-manifest.json"), "{}\n");
  const tools = path.join(directory, "tools.txt"); fs.writeFileSync(tools, registry.join("\n"));
  const result = spawnSync(process.execPath, [runner], { encoding: "utf8", timeout: 10_000,
    env: { ...process.env, PR_NUMBER: "345", REVIEW_PROMPT_FILE: prompt, REVIEW_EVIDENCE_DIR: directory,
      REVIEW_INVOCATION_VERIFIER_FILE: verifier, REVIEW_TOOL_REGISTRY_FILE: tools,
      GITHUB_OUTPUT: output, OPENCODE_BIN: child, REVIEW_MODEL: "local/transport-fixture" } });
  assert.equal(result.signal, null, result.stderr);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  const children = fs.readFileSync(path.join(directory, "children.ndjson"), "utf8").trim().split("\n").map(JSON.parse);
  const checks = fs.readFileSync(path.join(directory, "checks.ndjson"), "utf8").trim().split("\n").map(JSON.parse);
  return { directory, output, result, metadata, children, checks, first, projection };
}

test("submit JSON transport: one stopped invalid event admits only the fresh whole second child", (t) => {
  const c = submitJsonCli(t);
  assert.equal(c.result.status, 0, c.result.stderr);
  assert.deepEqual(c.children.map(({ attempt }) => attempt), [1, 2]);
  assert.equal(new Set(c.children.map(({ pid }) => pid)).size, 2);
  assert.deepEqual(c.checks.map(({ kind }) => kind), ["original", "projection", "second"]);
  assert.equal(fs.readFileSync(path.join(c.directory, "prepare.ndjson"), "utf8"), "prepare\n");
  assert.equal(c.metadata.recovery_reason, "review_submit_json_transport");
  const first = c.metadata.attempts[0], proof = first.submit_json_transport;
  assert.equal(first.canonical_verdict.code, "unavailable-host-tool");
  assert.equal(first.canonical_verdict.acceptedInvocation, null);
  assert.equal(first.submission_sha256, null);
  assert.equal(proof.tier, "DERIVED_RETRY_ELIGIBILITY_ONLY");
  assert.equal(proof.accepted_review, false);
  assert.equal(proof.canonical_verdict.code, "healthy-unfinished-review");
  assert.deepEqual(fs.readFileSync(path.join(c.directory, first.response_file)), c.first);
  assert.deepEqual(fs.readFileSync(path.join(c.directory, proof.projection_file)), c.projection);
  assert.equal(proof.projection_sha256, sha256(c.projection));
  assert.equal(c.metadata.accepted_invocation.attempt, 2);
  assert.equal(fs.readFileSync(c.output, "utf8"), `review_invocation_sha256=${sha256(JSON.stringify(c.metadata.accepted_invocation))}\n`);
});

for (const [name, options] of [
  ["wrong requested tool", { mutate: (e) => { e[2].part.state.input.tool = "review_status"; } }],
  ["unknown diagnostic", { mutate: (e) => { e[2].part.state.input.error = "unknown failure"; } }],
  ["different JSON error", { mutate: (e) => { e[2].part.state.input.error = e[2].part.state.input.error.replace("Unterminated string", "Unexpected token"); } }],
  ["mismatched diagnostic output", { mutate: (e) => { e[2].part.state.output = "different output"; } }],
  ["parseable diagnostic Text", { mutate: (e) => { const input = e[2].part.state.input; input.error = 'Invalid input for tool review_submit: JSON parsing failed: Text: {"summary":"valid"}\nError message: JSON Parse error: Unterminated string'; e[2].part.state.output = `The arguments provided to the tool are invalid: ${input.error}`; } }],
  ["projection conflicting kinds", { projected: { ...refused("missing-review-submit"), code: "healthy-unfinished-review", reasonKind: "unknown" } }],
  ["projection false accepted binding", { projected: { ...refused("missing-review-submit"), code: "healthy-unfinished-review", acceptedInvocation: accepted().acceptedInvocation } }],
  ["projection wrong code", { projected: { ...refused("missing-review-submit"), code: "unknown" } }],
  ...["review-submit-json-attempt-1.DERIVED.ndjson", "review-submit-json-attempt-1.OMITTED.ndjson"].map((collision) => [`pre-existing ${collision}`, { collision }]),
  ["false invalid lifecycle", { mutate: (e) => { e[2].part.state.error = "failed"; } }],
  ["clipped diagnostic", { mutate: (e) => { e[2].part.state.metadata.truncated = true; } }],
  ["multiple invalid events", { mutate: (e) => { e.splice(2, 0, structuredClone(e[2])); } }],
  ["later tool call", { mutate: (e) => { e.splice(4, 0, structuredClone(e[1])); } }],
  ["actual submit call", { mutate: (e) => { e[1].part.tool = "review_submit"; } }],
  ["absent submit registry", { registry: ["review_begin"] }],
  ["present submission", { present: true }],
  ["nonzero child exit", { exitCode: 1 }],
  ["malformed raw event", { raw: Buffer.from('{broken\n'), original: { ...refused("unestablished-review-trace"), code: "host-decode" } }],
  ["out of order events", { mutate: (e) => { e[2].timestamp = 0; }, original: { ...refused("unestablished-review-trace"), code: "host-event-time-order" } }],
  ["mixed session", { mutate: (e) => { e[2].sessionID = "other"; }, original: { ...refused("unestablished-review-trace"), code: "host-event-schema" } }],
  ["duplicate call identity", { mutate: (e) => { e[2].part.callID = e[1].part.callID; }, original: { ...refused("unestablished-review-trace"), code: "host-call-cardinality" } }],
  ["previous failed review result", { mutate: (e) => { e[1].part.state.output = '{"ok?":false,"error":"failed"}'; }, projected: refused("unestablished-review-trace") }],
  ["previous failed HOST lifecycle", { mutate: (e) => { e[1].part.tool = "read"; e[1].part.state.status = "error"; }, original: { ...refused("unestablished-review-trace"), code: "host-tool-schema" } }],
  ["projection callback throw", { mode: "throw" }],
  ["projection passing contradiction", { projected: accepted() }],
  ["projection wrong refusal", { projected: refused("stale-review-coverage") }],
  ["projection violation", { projected: { ...refused("missing-review-submit"), code: "healthy-unfinished-review", violations: [{}] } }],
  ...["response", "stderr", "projection", "omitted", "buffer", "context", "submission"].map((mode) => [`mutated ${mode} custody`, { mode }]),
]) {
  test(`submit JSON transport: ${name} grants no second child`, (t) => {
    const c = submitJsonCli(t, options);
    assert.equal(c.result.status, 1, c.result.stdout);
    assert.equal(c.children.length, 1);
    assert.equal(c.metadata.accepted_invocation, null);
    assert.equal(c.metadata.recovery_reason, null);
    assert.equal(fs.existsSync(c.output), false);
    assert.equal(fs.existsSync(path.join(c.directory, "model-response-attempt-2.txt")), false);
    if (options.collision) assert.equal(fs.readFileSync(path.join(c.directory, options.collision), "utf8"), "retained collision sentinel");
  });
}

test("submit JSON transport: second failure stops without a third process", (t) => {
  const c = submitJsonCli(t, { secondFailure: true });
  assert.equal(c.result.status, 1);
  assert.equal(c.children.length, 2);
  assert.deepEqual(c.checks.map(({ kind }) => kind), ["original", "projection", "original"]);
  assert.equal(c.metadata.accepted_invocation, null);
  assert.equal(fs.existsSync(path.join(c.directory, "model-response-attempt-3.txt")), false);
  assert.equal(fs.existsSync(c.output), false);
});

test("submit JSON transport: healthy accepted review is not duplicated", (t) => {
  const c = submitJsonCli(t, { healthy: true });
  assert.equal(c.result.status, 0, c.result.stderr);
  assert.equal(c.children.length, 1);
  assert.equal(c.metadata.recovery_reason, null);
  assert.equal(c.metadata.attempts[0].submit_json_transport, undefined);
  assert.equal(c.metadata.accepted_invocation.attempt, 1);
});

// Final unassessed-page controls call the real supervisor. Injected verdicts
// below are transport spies only; separate source-built C136 controls own law.
function finalCoverageEvents() {
  const sessionID = "ses_coverage_first";
  let timestamp = 0;
  const event = (type, part) => ({ type, timestamp: ++timestamp, sessionID,
    part: { id: `coverage_part_${timestamp}`, sessionID, ...part } });
  const call = (tool, input, output = '{"ok?":true}', callID) => event("tool_use", {
    type: "tool", tool, callID: callID ?? `coverage_call_${timestamp + 1}`,
    state: { status: "completed", input, output, metadata: { truncated: false } } });
  const events = [event("step_start", { type: "step-start" }), call("review_begin", {})];
  for (let id = 1; id <= 3; id++) {
    events.push(call("review_read_diff_chunk", { id }));
    if (id < 3) events.push(call("review_assess_diff_chunk", { id, note: "Local fixture assessment" }));
  }
  for (const stage of ["deterministic", "map-change", "generate-candidates"])
    events.push(call("review_record_evidence", { stage, note: "Local fixture stage" }));
  events.push(call("review_record_evidence", { stage: "adversarial-validate", note: "Local final stage" },
    '{"ok?":false,"error":"Unassessed full-input chunks remain: 3. Read and assess every changed hunk before publishing."}', "coverage_final"),
    event("step_finish", { type: "step-finish", reason: "tool-calls" }),
    event("text", { type: "text", text: "STOP. Original failed invocation remains failed." }),
    event("step_finish", { type: "step-finish", reason: "stop" }));
  return events;
}

async function finalCoverageExercise(t, { mutate, original, projected, mode = "", present = false,
  secondFailure = false, healthy = false, exitCode = 0, registry = true, collision,
  changedInput = false } = {}) {
  const directory = fixture(t), events = finalCoverageEvents(); mutate?.(events);
  const raw = Buffer.from("\r\n" + events.map(x => JSON.stringify(x) + "\r\n").join("") + "\r\n");
  const projection = Buffer.from("\r\n" + events.filter(x => x.part.callID !== "coverage_final")
    .map(x => JSON.stringify(x) + "\r\n").join("") + "\r\n");
  const full = Buffer.from("owned complete input transport fixture\n"), inputSource = { full_diff: { sha256: sha256(full) } };
  const ctx = { pageCount: 3, fullInputSha256: sha256(full), inputSource,
    reviewTools: registry ? ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk", "review_record_evidence", "review_submit"] : ["review_submit"] };
  fs.writeFileSync(path.join(directory, "basehead.diff"), full);
  fs.writeFileSync(path.join(directory, "input-manifest.json"), JSON.stringify(inputSource));
  if (changedInput) fs.appendFileSync(path.join(directory, "basehead.diff"), "changed");
  if (collision) fs.writeFileSync(path.join(directory, collision), "existing custody sentinel");
  const failed = original ?? { ...refused("unestablished-review-trace"), code: "stage-order" };
  const omission = projected ?? { ...refused("missing-review-submit"), code: "healthy-unfinished-review" };
  const invocations = [], checks = [];
  const promise = runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Full unchanged review.\n",
    reviewTools: ctx.reviewTools, expectedContext: ctx, verifyReviewInvocation(response, body, expected) {
      assert.equal(expected, ctx);
      if (invocations.length === 2 && !secondFailure) {
        assert.deepEqual(response, Buffer.from("whole fresh second fixture\n")); assert.deepEqual(body, submission);
        checks.push("second"); return accepted();
      }
      if (response.equals(raw)) { checks.push("original"); return healthy ? accepted() : failed; }
      assert.deepEqual(response, projection); assert.equal(body, null); checks.push("projection");
      if (mode === "throw") throw Error("local coverage callback fault");
      const files = { response: "model-response-attempt-1.txt", stderr: "opencode-stderr-attempt-1.log",
        projection: "final-input-coverage-attempt-1.DERIVED.ndjson", omitted: "final-input-coverage-attempt-1.OMITTED.ndjson",
        full: "basehead.diff", manifest: "input-manifest.json" };
      if (files[mode]) fs.appendFileSync(path.join(directory, files[mode]), " ");
      if (mode === "context") ctx.pageCount++;
      if (mode === "buffer") response[0] = 32;
      if (mode === "submission") fs.writeFileSync(path.join(directory, "submission.json"), "{}");
      return omission;
    }, async invokeAttempt({ attempt, prompt, responseFile, stderrFile }) {
      invocations.push({ attempt, prompt });
      fs.writeFileSync(responseFile, attempt === 1 || secondFailure ? raw : "whole fresh second fixture\n");
      fs.writeFileSync(stderrFile, "");
      if (present || healthy || (attempt === 2 && !secondFailure)) fs.writeFileSync(path.join(directory, "submission.json"), submission);
      return { exitCode: attempt === 1 ? exitCode : 0 };
    } });
  let metadata, error;
  try { metadata = await promise; } catch (e) { error = e; }
  return { directory, raw, projection, invocations, checks, metadata,
    retained: JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"))), error };
}

test("final input coverage: exact failed final page permits only a fresh whole second invocation", async t => {
  const f = await finalCoverageExercise(t);
  assert.equal(f.error, undefined); assert.equal(f.invocations.length, 2);
  assert.deepEqual(f.checks, ["original", "projection", "second"]);
  assert.equal(f.metadata.recovery_reason, "final_input_coverage");
  assert.equal(f.metadata.accepted_invocation.attempt, 2);
  assert.equal(f.metadata.attempts[0].canonical_verdict.ok, false);
  assert.equal(f.metadata.attempts[0].canonical_verdict.code, "stage-order");
  const proof = f.metadata.attempts[0].final_input_coverage;
  assert.equal(proof.tier, "DERIVED_RETRY_ELIGIBILITY_ONLY"); assert.equal(proof.accepted_review, false);
  assert.equal(proof.canonical_verdict.acceptedInvocation, null);
  assert.deepEqual(fs.readFileSync(path.join(f.directory, proof.projection_file)), f.projection);
  assert.deepEqual(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt")), f.raw);
  assert.equal(proof.original_response_sha256, sha256(f.raw));
  assert.equal(proof.projection_sha256, sha256(f.projection));
  assert.match(f.invocations[1].prompt, /read but not assessed/);
  assert.match(f.invocations[1].prompt, /sole fresh process/);
  assert.ok(f.invocations[1].prompt.endsWith("verification guard, or the two-attempt bound.\n"));
  assert.equal(f.metadata.max_attempts, 2);
});

test("final input coverage: second failed process cannot launch a third or accept either trace", async t => {
  const f = await finalCoverageExercise(t, { secondFailure: true });
  assert.ok(f.error); assert.equal(f.invocations.length, 2);
  assert.equal(f.retained.accepted_invocation, null);
  assert.equal(fs.existsSync(path.join(f.directory, "model-response-attempt-3.txt")), false);
  assert.equal(f.retained.attempts[1].canonical_verdict.ok, false);
});

const coverageMutations = [
  ["incomplete earlier stage prefix", e => { const i = e.findIndex(x => x.part.tool === "review_record_evidence"); e.splice(i, 3); }],
  ["unknown refusal", e => { e.find(x => x.part.callID === "coverage_final").part.state.output = '{"ok?":false,"error":"unknown"}'; }],
  ["wrong stage", e => { e.find(x => x.part.callID === "coverage_final").part.state.input.stage = "publish"; }],
  ["failed actual submit", e => { e.find(x => x.part.callID === "coverage_final").part.tool = "review_submit"; }],
  ["earlier failed begin", e => { e.find(x => x.part.tool === "review_begin").part.state.output = '{"ok?":false,"error":"earlier failure"}'; }],
  ["earlier failed HOST", e => { e[2].part.state.status = "error"; e[2].part.state.error = "HOST error"; }],
  ["multiple failures", e => { e[3].part.state.output = '{"ok?":false,"error":"earlier assessment failure"}'; }],
  ["later call", e => { const x = structuredClone(e[2]); x.timestamp = e.at(-1).timestamp; x.part.id = "later_part"; x.part.callID = "later_call"; e.splice(-1, 0, x); }],
  ["mixed session", e => { e[0].sessionID = "other"; }],
  ["out of order", e => { e.at(-1).timestamp = 0; }],
  ["duplicate call", e => { e.at(-4).part.callID = e[1].part.callID; }],
  ["blank call", e => { e.at(-4).part.callID = " "; }],
  ["missing part", e => { delete e.at(-4).part.id; }],
  ["missing stop", e => { e.at(-1).part.reason = "tool-calls"; }],
  ["no final read", e => { e.splice(e.findIndex(x => x.part.tool === "review_read_diff_chunk" && x.part.state.input.id === 3), 1); }],
  ["final already assessed", e => { const x = structuredClone(e[3]); x.timestamp = e.at(-4).timestamp; x.part.id = "extra_part"; x.part.callID = "extra_call"; x.part.state.input.id = 3; e.splice(-4, 0, x); }],
  ["missing earlier assessment", e => { e.splice(e.findIndex(x => x.part.tool === "review_assess_diff_chunk"), 1); }],
  ["wrong missing page", e => { e.at(-4).part.state.output = e.at(-4).part.state.output.replace("remain: 3.", "remain: 2."); }],
  ["ambiguous false output", e => { e.at(-4).part.state.output = '{"ok?":false,"error":"Unassessed full-input chunks remain: 3. Read and assess every changed hunk before publishing.","restart-required?":true}'; }],
  ["malformed output", e => { e.at(-4).part.state.output = "{"; }],
  ["truncated output", e => { e.at(-4).part.state.metadata.truncated = true; }],
];
for (const [name, mutate] of coverageMutations) test(`final input coverage: denies ${name}`, async t => {
  const f = await finalCoverageExercise(t, { mutate }); assert.ok(f.error); assert.equal(f.invocations.length, 1);
  assert.equal(f.retained.accepted_invocation, null);
});
for (const [name, options] of [
  ["contradictory original reasonKind", { original: { ...refused("unestablished-review-trace"), code: "stage-order", reasonKind: "other" } }],
  ["contradictory projection reasonKind", { projected: { ...refused("missing-review-submit"), code: "healthy-unfinished-review", reasonKind: "other" } }],
  ["unknown original verdict", { original: { ...refused("unestablished-review-trace"), code: "unknown" } }],
  ["original LAST violation", { original: { ...refused("unestablished-review-trace"), code: "stage-order", violations: [{ id: 1 }] } }],
  ["unregistered stage tool", { registry: false }], ["submission present", { present: true }],
  ["child exit nonzero", { exitCode: 1 }], ["changed input before admission", { changedInput: true }],
  ["projection refusal", { projected: { ...refused("unestablished-review-trace"), code: "failed-review-tool" } }],
  ["projection violation", { projected: { ...refused("missing-review-submit"), code: "healthy-unfinished-review", violations: [{ id: 1 }] } }],
  ["projection acceptance", { projected: accepted() }], ["callback exception", { mode: "throw" }],
  ["projection collision", { collision: "final-input-coverage-attempt-1.DERIVED.ndjson" }],
  ["omitted collision", { collision: "final-input-coverage-attempt-1.OMITTED.ndjson" }],
  ...["response", "stderr", "projection", "omitted", "full", "manifest", "context", "buffer", "submission"]
    .map(mode => [`${mode} custody mutation`, { mode }]),
]) test(`final input coverage: denies ${name}`, async t => {
  const f = await finalCoverageExercise(t, options); assert.ok(f.error); assert.equal(f.invocations.length, 1);
  assert.equal(f.retained.accepted_invocation, null);
});
test("final input coverage: healthy accepted first invocation is never duplicated", async t => {
  const f = await finalCoverageExercise(t, { healthy: true }); assert.equal(f.error, undefined);
  assert.equal(f.invocations.length, 1); assert.equal(f.metadata.accepted_invocation.attempt, 1);
  assert.equal(f.metadata.recovery_reason, null); assert.equal(f.metadata.attempts[0].final_input_coverage, undefined);
});
