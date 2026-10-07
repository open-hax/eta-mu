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
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const submission = Buffer.from('{"schema":"open-hax.github-review/v1","summary":"fixture"}\n');
const context = { fixture: "caller-owned context" };

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "invocation-integrity-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

// These injected verdicts test transport, not a second implementation of Muse law.
function accepted() {
  return { ok: true, reason: null, reasonKind: null, code: "verified-review-invocation",
    violations: [], sessionID: "ses_fixture", pageCount: 1, reviewCallCount: 9,
    acceptedInvocation: { sessionID: "ses_fixture", submissionCallID: "call_submit",
      submissionPosition: 9, submissionFile: "/fixture/submission.json",
      fullInputSha256: "a".repeat(64), pageCount: 1 } };
}
function refused(reason = "stale-review-coverage") {
  return { ok: false, reason, reasonKind: reason, code: "fixture-refusal",
    violations: [], acceptedInvocation: null };
}

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

function unavailableEvents() {
  const sessionID = "ses_failure";
  return [1, 2].map((n) => ({ type: "tool_use", timestamp: n, sessionID,
    part: { type: "tool", callID: `call_${n}`, sessionID, tool: "invalid",
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
  const { directory, verifier, output, env } = cliFixture(t);
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
