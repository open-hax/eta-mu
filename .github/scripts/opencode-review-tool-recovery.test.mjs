// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runReviewRecovery } from "./run-opencode-review-recovery.mjs";
import { stageTransportVerifier, transportResponse, transportReviewTools,
  transportSha256 } from "./review-invocation-fixture.mjs";

const permissionError = "The user rejected permission to use this specific tool call.";
const invalidInput = {
  tool: "assess_diff_chunk",
  error: "Model tried to call unavailable tool 'assess_diff_chunk'. Available tools: invalid, review_assess_diff_chunk, review_begin, review_submit.",
};

/** Build fixture events for two completed invalid calls and terminal permission rejection. */
function failureEvents() {
  const sessionID = "ses_fixture";
  return [1, 2].map((n) => ({
    type: "tool_use", timestamp: n, sessionID,
    part: { type: "tool", id: `part_${n}`, callID: `call_${n}`, sessionID,
      tool: "invalid", state: { status: "completed", input: invalidInput } },
  })).concat({ type: "error", timestamp: 4, sessionID,
    error: { name: "UnknownError", data: { message: permissionError } } });
}

/** Create an isolated test directory and register its removal after the test. */
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "review-tool-recovery-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** Read an owned Linux process identity without treating a reused PID as ours. */
function deadlineProcessIdentity(pid) {
  try {
    const raw = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
    const fields = raw.slice(raw.lastIndexOf(")") + 2).trim().split(/\s+/);
    return { pid, start: fields[19], state: fields[0] };
  } catch { return null; }
}

/** Run the actual packaged CLI against a progressing child that never exits. */
async function deadlineChildFixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "review-deadline-"));
  let processCleanup = () => {};
  t.after(() => { processCleanup(); fs.rmSync(directory, { recursive: true, force: true }); });
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/opencode-code-review.yml"), "utf8");
  const encoded = workflow.match(/<<'ETA_MU_RECOVERY_RUNNER_BASE64'\n([\s\S]*?)\n\s*ETA_MU_RECOVERY_RUNNER_BASE64/);
  assert.ok(encoded);
  const runner = path.join(directory, "runner.mjs");
  fs.writeFileSync(runner, Buffer.from(encoded[1].replace(/\s/g, ""), "base64"));
  const invocation = stageTransportVerifier(directory,
    { reviewTools: [...transportReviewTools, "review_read_diff_chunk"] });
  // An explicit transport-only healthy-omission verdict: real Muse law remains
  // independently compiled and tested by the registered owning workflow suite.
  const verifier = fs.readFileSync(invocation.verifierFile, "utf8");
  const omission = 'if (submission === null) return refuse("missing-review-submit");';
  assert.ok(verifier.includes(omission));
  fs.writeFileSync(invocation.verifierFile, verifier.replace(omission,
    'if (submission === null) return {...refuse("missing-review-submit"), code:"healthy-unfinished-review"};'));
  const sessionID = "ses_deadline_fixture";
  const progress = ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk"].map((tool, index) => ({
    type: "tool_use", timestamp: index + 1, sessionID,
    part: { type: "tool", id: `part_deadline_${index}`, callID: `call_deadline_${index}`, sessionID,
      tool, state: { status: "completed", input: {},
        output: JSON.stringify({ "ok?": true, fixtureAuthority: "TRANSPORT_MOCK_ONLY" }) } },
  })).concat({ type: "step_finish", timestamp: 4, sessionID, part: { reason: "stop" } });
  const firstResponse = progress.map((event) => JSON.stringify(event)).join("\n") + "\n";
  const child = path.join(directory, "fake-opencode.mjs");
  const identities = path.join(directory, "owned-identities.jsonl");
  fs.writeFileSync(child, `#!${process.execPath}
import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
const directory=process.env.REVIEW_EVIDENCE_DIR;
const count=path.join(directory,"count.txt");
const attempt=fs.existsSync(count)?2:1;
fs.writeFileSync(count,String(attempt));
const own=pid=>{const raw=fs.readFileSync('/proc/'+pid+'/stat','utf8');return {pid,start:raw.slice(raw.lastIndexOf(')')+2).trim().split(/\\s+/)[19]};};
fs.appendFileSync(${JSON.stringify(identities)},JSON.stringify(own(process.pid))+'\\n');
if(attempt===1){
  const descendant=spawn(process.execPath,['-e',"process.on('SIGTERM',()=>process.exit(0));setInterval(()=>{},1000)"],{stdio:'ignore'});
  descendant.once('spawn',()=>{
    fs.appendFileSync(${JSON.stringify(identities)},JSON.stringify(own(descendant.pid))+'\\n');
    process.stdout.write(${JSON.stringify(firstResponse)});
    process.stderr.write('retained first-attempt progress\\n');
  });
  process.on('SIGTERM',()=>{
    if(descendant.exitCode!==null||descendant.signalCode!==null)process.exit(0);
    descendant.once('close',()=>process.exit(0));descendant.kill('SIGTERM');
  });
  setInterval(()=>{},1000);
}else{
  fs.writeFileSync(path.join(directory,'submission.json'),JSON.stringify({schema:'open-hax.github-review/v1',event:'APPROVE',summary:'TRANSPORT_MOCK_ONLY',comments:[]}));
  process.stdout.write(${JSON.stringify(transportResponse({sessionID: "ses_deadline_second"}).toString())});
}
`);
  fs.chmodSync(child, 0o755);
  const prompt = path.join(directory, "prompt.md");
  fs.writeFileSync(prompt, "Complete the full unchanged transport fixture #{{PR_NUMBER}}.\n");
  const process_ = spawn(process.execPath, [runner], { detached: true, stdio: ["ignore", "pipe", "pipe"],
    env: { PATH: `${path.dirname(process.execPath)}:/usr/bin:/bin`, LANG: "C.UTF-8", LC_ALL: "C.UTF-8",
      OPENCODE_BIN: child, PR_NUMBER: "342", REVIEW_MODEL: "fixture/model", REVIEW_EVIDENCE_DIR: directory,
      REVIEW_PROMPT_FILE: prompt, REVIEW_ATTEMPT_TIMEOUT_MS: "400", ...invocation.env } });
  const supervisorIdentity = deadlineProcessIdentity(process_.pid);
  let outerTimedOut = false;
  const output = [], errors = [];
  process_.stdout.on("data", (bytes) => output.push(bytes));
  process_.stderr.on("data", (bytes) => errors.push(bytes));
  /** Stop only fixture-owned identities, retaining the baseline deadline failure. */
  const cleanup = () => {
    const known = fs.existsSync(identities)
      ? fs.readFileSync(identities, "utf8").trim().split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
    for (const expected of [...known.reverse(), supervisorIdentity].filter(Boolean)) {
      if (deadlineProcessIdentity(expected.pid)?.start === expected.start) {
        try { process.kill(expected.pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") throw error; }
      }
    }
  };
  const timer = setTimeout(() => { outerTimedOut = true; cleanup(); }, 3500);
  let force;
  processCleanup = () => {
    clearTimeout(timer); clearTimeout(force); cleanup();
  };
  const result = await new Promise((resolve, reject) => {
    process_.once("error", reject);
    process_.once("close", (code, signal) => resolve({ code, signal }));
    force = setTimeout(() => {
      cleanup();
      if (supervisorIdentity && deadlineProcessIdentity(process_.pid)?.start === supervisorIdentity.start) process_.kill("SIGKILL");
    }, 5000);
  });
  clearTimeout(timer); clearTimeout(force);
  cleanup();
  const owned = fs.readFileSync(identities, "utf8").trim().split(/\r?\n/).map(JSON.parse);
  return { directory, invocation, firstResponse, result, outerTimedOut, owned,
    stdout: Buffer.concat(output).toString(), stderr: Buffer.concat(errors).toString() };
}

test("packaged invocation deadline retains progressing child output and permits only the existing healthy omission recovery", { timeout: 10_000 }, async (t) => {
  const f = await deadlineChildFixture(t);
  assert.ok(f.owned.length >= 2, "the real stub and its owned descendant must both have started");
  assert.deepEqual(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt")), Buffer.from(f.firstResponse));
  assert.equal(fs.readFileSync(path.join(f.directory, "opencode-stderr-attempt-1.log"), "utf8"), "retained first-attempt progress\n");
  t.diagnostic(`owned deadline fixture: ${JSON.stringify({ outerTimedOut: f.outerTimedOut,
    processes: f.owned, remaining: f.owned.map(({ pid }) => deadlineProcessIdentity(pid)),
    actualFirstResponseSHA256: transportSha256(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt"))),
    emittedReviewToolProgress: 3, fixtureAuthority: "TRANSPORT_MOCK_ONLY" })}`);
  assert.equal(f.outerTimedOut, false,
    "the runner must enforce its own attempt deadline before the owning fixture cleanup deadline");
  assert.equal(f.result.code, 0, f.stderr || f.stdout);
  assert.equal(f.result.signal, null);
  assert.deepEqual(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt")), Buffer.from(f.firstResponse));
  assert.equal(fs.readFileSync(path.join(f.directory, "opencode-stderr-attempt-1.log"), "utf8"), "retained first-attempt progress\n");
  const receipt = JSON.parse(fs.readFileSync(path.join(f.directory, "recovery.json"), "utf8"));
  assert.equal(receipt.recovery_reason, "invocation_deadline");
  assert.equal(receipt.attempts.length, 2);
  assert.equal(receipt.attempts[0].invocation_state, "deadline-exceeded");
  assert.equal(receipt.attempts[0].timed_out, true);
  assert.equal(receipt.attempts[0].timeout_ms, 400);
  assert.equal(receipt.attempts[0].cleanup_complete, true);
  assert.equal(receipt.attempts[0].captures_closed, true);
  assert.equal(receipt.attempts[0].canonical_verdict.code, "healthy-unfinished-review");
  assert.equal(receipt.accepted_invocation.attempt, 2);
  assert.equal(fs.existsSync(path.join(f.directory, "model-response-attempt-3.txt")), false);
  for (const expected of f.owned) assert.notEqual(deadlineProcessIdentity(expected.pid)?.start, expected.start,
    `owned fixture process ${expected.pid} must have exited and been reaped`);
});

for (const [name, options] of [
  ["unfinished trace", { code: "unfinished-review", reason: "unestablished-review-trace" }],
  ["denied bash HOST failure", { code: "failed-host-call", reason: "unestablished-review-trace" }],
  ["provider quota", { code: "provider-quota", reason: "quota" }],
  ["provider authentication", { code: "provider-authentication", reason: "authentication" }],
  ["unknown verdict", { code: "unknown", reason: "unknown" }],
  ["unclean process group", { cleanupComplete: false }],
  ["unclosed captures", { capturesClosed: false }],
  ["canonical violation", { violations: [{ code: "retained-host-error" }] }],
  ["present submission", { body: "{}", accepted: true }],
  ["malformed submission", { body: "{broken" }],
]) {
  test(`an invocation deadline cannot turn ${name} into recovery or approval`, async (t) => {
    const directory = fixture(t), calls = [];
    const promise = runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Full unchanged input.",
      expectedContext: { fixtureAuthority: "TRANSPORT_MOCK_ONLY" },
      verifyReviewInvocation: () => ({ ok: options.accepted ?? false,
        reason: options.accepted ? null : options.reason ?? "missing-review-submit",
        reasonKind: options.accepted ? null : options.reason ?? "missing-review-submit",
        code: options.code ?? "healthy-unfinished-review", violations: options.violations ?? [],
        acceptedInvocation: options.accepted ? { sessionID: "ses_forbidden", submissionCallID: "call_submit" } : null,
        sessionID: "ses_forbidden", fixtureAuthority: "TRANSPORT_MOCK_ONLY" }),
      invokeAttempt: async ({ attempt, responseFile, stderrFile }) => {
        calls.push(attempt);
        fs.writeFileSync(responseFile, transportResponse({ submission: false }));
        fs.writeFileSync(stderrFile, "retained partial stderr\n");
        if (options.body !== undefined) fs.writeFileSync(path.join(directory, "submission.json"), options.body);
        return { exitCode: null, signal: "SIGTERM", timedOut: true, timeoutMs: 400,
          cleanupComplete: options.cleanupComplete ?? true, capturesClosed: options.capturesClosed ?? true };
      } });
    await assert.rejects(promise, /deadline/);
    assert.deepEqual(calls, [1]);
    const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
    assert.equal(receipt.accepted_invocation, null);
    assert.equal(receipt.recovery_reason, null);
    assert.equal(receipt.attempts[0].invocation_state, "deadline-exceeded");
    assert.equal(receipt.attempts[0].exit_code, null);
    assert.equal(receipt.attempts[0].exit_signal, "SIGTERM");
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
  });
}

test("a second invocation deadline stops at the unchanged two-attempt limit", async (t) => {
  const directory = fixture(t), calls = [];
  const promise = runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Full unchanged input.",
    expectedContext: { fixtureAuthority: "TRANSPORT_MOCK_ONLY" },
    verifyReviewInvocation: () => ({ ok: false, reason: "missing-review-submit", reasonKind: "missing-review-submit",
      code: "healthy-unfinished-review", violations: [], acceptedInvocation: null,
      fixtureAuthority: "TRANSPORT_MOCK_ONLY" }),
    invokeAttempt: async ({ attempt, responseFile, stderrFile }) => {
      calls.push(attempt);
      fs.writeFileSync(responseFile, transportResponse({ submission: false })); fs.writeFileSync(stderrFile, "");
      return { exitCode: null, signal: "SIGKILL", timedOut: true, timeoutMs: 400,
        cleanupComplete: true, capturesClosed: true };
    } });
  await assert.rejects(promise, /attempt 2.*deadline/);
  assert.deepEqual(calls, [1, 2]);
  const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.equal(receipt.max_attempts, 2); assert.equal(receipt.accepted_invocation, null);
  assert.equal(receipt.recovery_reason, "invocation_deadline");
  assert.ok(receipt.attempts.every((attempt) => attempt.invocation_state === "deadline-exceeded"));
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
});

test("invalid explicit invocation budgets fail before starting a child", (t) => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/opencode-code-review.yml"), "utf8");
  const encoded = workflow.match(/<<'ETA_MU_RECOVERY_RUNNER_BASE64'\n([\s\S]*?)\n\s*ETA_MU_RECOVERY_RUNNER_BASE64/);
  assert.ok(encoded);
  for (const value of ["", "0", "-1", "0.5", "400.0", "4500001", "Infinity", "NaN", " 400", "400\n", "$(echo unsafe)"]) {
    const directory = fixture(t), invocation = stageTransportVerifier(directory);
    const runner = path.join(directory, "runner.mjs"), child = path.join(directory, "child.mjs");
    const started = path.join(directory, "child-started"), prompt = path.join(directory, "prompt.md");
    fs.writeFileSync(runner, Buffer.from(encoded[1].replace(/\s/g, ""), "base64"));
    fs.writeFileSync(child, `#!${process.execPath}\nimport fs from 'node:fs';fs.writeFileSync(${JSON.stringify(started)},'unexpected');\n`);
    fs.chmodSync(child, 0o755); fs.writeFileSync(prompt, "Review full unchanged input.\n");
    const result = spawnSync(process.execPath, [runner], { encoding: "utf8", timeout: 3000,
      env: { PATH: `${path.dirname(process.execPath)}:/usr/bin:/bin`, OPENCODE_BIN: child,
        PR_NUMBER: "342", REVIEW_MODEL: "fixture/model", REVIEW_EVIDENCE_DIR: directory,
        REVIEW_PROMPT_FILE: prompt, REVIEW_ATTEMPT_TIMEOUT_MS: value, ...invocation.env } });
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /REVIEW_ATTEMPT_TIMEOUT_MS must be a positive integer/);
    assert.equal(fs.existsSync(started), false);
    const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
    assert.deepEqual(receipt.attempts, []); assert.equal(receipt.accepted_invocation, null);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-1.txt")), false);
    assert.equal(fs.readFileSync(invocation.output, "utf8"), "");
  }
});

/** Exercise recovery with configurable synthetic failures and captured invocation prompts. */
async function invokeFailure(directory, { events = failureEvents(), stderr = "! permission requested: doom_loop (invalid); auto-rejecting\n", exitCode = 1, submission, secondFails = false, reviewTools = ["review_begin", "review_assess_diff_chunk", "review_submit"] } = {}) {
  const calls = [];
  const promise = runReviewRecovery({
    evidenceDirectory: directory,
    basePrompt: "Complete the full current input using review_begin and review_submit.",
    reviewTools,
    invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
      calls.push({ attempt, prompt });
      if (attempt === 1 || secondFails) {
        fs.writeFileSync(responseFile, events.map((event) => JSON.stringify(event)).join("\n") + "\n");
        fs.writeFileSync(stderrFile, stderr);
        if (submission !== undefined) fs.writeFileSync(path.join(directory, "submission.json"), submission);
        return { exitCode };
      }
      fs.writeFileSync(responseFile, "retained second invocation\n");
      fs.writeFileSync(stderrFile, "");
      fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({ schema: "open-hax.github-review/v1", event: "APPROVE", summary: "fixture", comments: [] }));
      return { exitCode: 0 };
    },
  });
  return { promise, calls };
}

test("a terminal unavailable review tool loop gets one full corrective invocation", async (t) => {
  const directory = fixture(t);
  const { promise, calls } = await invokeFailure(directory);
  const result = await promise;
  assert.deepEqual(calls.map(({ attempt }) => attempt), [1, 2]);
  assert.equal(result.recovery_reason, "unavailable_review_tool");
  assert.equal(result.attempts[0].exit_code, 1);
  assert.equal(result.attempts[0].submission_state, "missing");
  assert.match(calls[1].prompt, /review_begin/);
  assert.match(calls[1].prompt, /review_assess_diff_chunk/);
  assert.match(calls[1].prompt, /do not assume any in-memory state/i);
  assert.match(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), /call_2/);
  assert.equal(result.attempts[1].exit_code, 0);
});

test("repeated invalid tool failure stops at the shared two invocation bound", async (t) => {
  const { promise, calls } = await invokeFailure(fixture(t), { secondFails: true });
  await assert.rejects(promise, /attempt 2 exited 1/);
  assert.deepEqual(calls.map(({ attempt }) => attempt), [1, 2]);
});

test("an unexposed corrected tool does not authorize recovery", async (t) => {
  const { promise, calls } = await invokeFailure(fixture(t), {
    reviewTools: ["review_begin", "review_submit"],
  });
  await assert.rejects(promise, /attempt 1 exited 1/);
  assert.equal(calls.length, 1);
});

for (const [name, transform] of [
  ["quoted model prose", () => [{ type: "text", part: { text: JSON.stringify(failureEvents()) } }]],
  ["cross-session event", (events) => events.map((e, n) => n === 1 ? { ...e, sessionID: "foreign" } : e)],
  ["provider quota terminal error", (events) => events.slice(0, -1).concat({ ...events.at(-1), error: { name: "APIError", data: { message: "quota exceeded" } } })],
  ["nonmatching error before the terminal tool error", (events) => events.slice(0, -1).concat({ ...events.at(-1), timestamp: 3, error: { name: "APIError", data: { message: "quota exceeded" } } }, events.at(-1))],
  ["unknown tool", (events) => events.map((e) => e.part ? { ...e, part: { ...e.part, state: { ...e.part.state, input: { tool: "arbitrary_tool", error: "unavailable" } } } } : e)],
  ["valid tool permission denial", (events) => events.map((e) => e.part ? { ...e, part: { ...e.part, tool: "bash" } } : e)],
  ["duplicate event representations", (events) => [events[0], events[0], events[0], events.at(-1)]],
]) {
  test(`${name} never authorizes recovery`, async (t) => {
    const { promise, calls } = await invokeFailure(fixture(t), { events: transform(failureEvents()) });
    await assert.rejects(promise, /attempt 1 exited 1/);
    assert.equal(calls.length, 1);
  });
}

test("an exit other than 1 does not authorize unavailable-tool recovery", async (t) => {
  const { promise, calls } = await invokeFailure(fixture(t), { exitCode: 2 });
  await assert.rejects(promise, /attempt 1 exited 2/);
  assert.equal(calls.length, 1);
});

for (const submission of ["{broken", "{}", JSON.stringify({ event: "APPROVE" })]) {
  test(`a failed invocation with a present submission cannot recover: ${submission}`, async (t) => {
    const { promise, calls } = await invokeFailure(fixture(t), { submission });
    await assert.rejects(promise);
    assert.equal(calls.length, 1);
  });
}

test("packaged CLI uses structured output and the staged registry for a real child recovery", (t) => {
  const directory = fixture(t);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/opencode-code-review.yml"), "utf8");
  const encoded = workflow.match(/<<'ETA_MU_RECOVERY_RUNNER_BASE64'\n([\s\S]*?)\n\s*ETA_MU_RECOVERY_RUNNER_BASE64/);
  assert.ok(encoded);
  const runner = path.join(directory, "runner.mjs");
  fs.writeFileSync(runner, Buffer.from(encoded[1].replace(/\s/g, ""), "base64"));
  const child = path.join(directory, "fake-opencode.mjs");
  fs.writeFileSync(child, `#!${process.execPath}
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
if (args[0] !== "run" || args[1] !== "--format" || args[2] !== "json") process.exit(9);
const directory = process.env.REVIEW_EVIDENCE_DIR;
const count = path.join(directory, "count.txt");
const attempt = fs.existsSync(count) ? 2 : 1;
fs.writeFileSync(count, String(attempt));
if (attempt === 1) {
  for (const event of ${JSON.stringify(failureEvents())}) console.log(JSON.stringify(event));
  console.error("! permission requested: doom_loop (invalid); auto-rejecting");
  process.exitCode = 1;
} else {
  if (!args.at(-1).includes("review_assess_diff_chunk") || !args.at(-1).includes("review_begin")) process.exit(8);
  fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({ schema: "open-hax.github-review/v1", event: "APPROVE", summary: "fixture", comments: [] }));
  process.stdout.write(${JSON.stringify(transportResponse({ sessionID: "ses_recovery", text: "new full review fixture" }).toString())});
}
`);
  fs.chmodSync(child, 0o755);
  const prompt = path.join(directory, "prompt.md");
  const registry = path.join(directory, "tools.txt");
  fs.writeFileSync(prompt, "Complete review #{{PR_NUMBER}} with review_begin and review_submit.\n");
  fs.writeFileSync(registry, "review_begin\nreview_assess_diff_chunk\nreview_submit\n");
  // Explicit mock transport authority; canonical compiled Muse law is tested separately.
  const invocation = stageTransportVerifier(directory, { registryFile: registry, reviewTools: transportReviewTools });
  const result = spawnSync(process.execPath, [runner], {
    encoding: "utf8", timeout: 10_000,
    env: { ...process.env, OPENCODE_BIN: child, REVIEW_EVIDENCE_DIR: directory,
      REVIEW_PROMPT_FILE: prompt, REVIEW_MODEL: "fixture/model", ...invocation.env, PR_NUMBER: "342" },
  });
  assert.equal(result.status, 0, result.stderr);
  const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.deepEqual(receipt.attempts.map(({ exit_code }) => exit_code), [1, 0]);
  assert.equal(receipt.recovery_reason, "unavailable_review_tool");
  assert.equal(receipt.attempts[0].tool_failure.corrected_tool, "review_assess_diff_chunk");
  assert.match(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), /call_2/);
  assert.match(fs.readFileSync(path.join(directory, "model-response-attempt-2.txt"), "utf8"), /ses_recovery/);
  assert.equal(receipt.accepted_invocation.attempt, 2);
  assert.equal(receipt.accepted_invocation.session_id, "ses_recovery");
  assert.equal(receipt.accepted_invocation.verifier_sha256, invocation.verifierSha256);
  assert.equal(receipt.accepted_invocation.expected_context_sha256,
    transportSha256(JSON.stringify(invocation.expectedContext)));
  assert.equal(fs.readFileSync(invocation.output, "utf8"),
    `review_invocation_sha256=${transportSha256(JSON.stringify(receipt.accepted_invocation))}\n`);
});

// ETA-RECEIVING-001: these callbacks exercise retry transport, not Muse law.
/** Prefix a recognized invalid-tool tail with one emitted structured tool call. */
function mixedUnavailableEvents(tool, state) {
  const events = failureEvents().map((event) => ({ ...event, timestamp: event.timestamp + 1 }));
  return [{ type: "tool_use", timestamp: 1, sessionID: "ses_fixture",
    part: { type: "tool", id: "part_prefix", callID: "call_prefix", sessionID: "ses_fixture",
      tool, state } }, ...events];
}

/** Exercise strict transport with a retained first refusal and a mock second success. */
function strictUnavailableFailure(directory, events, { secondFails = false, exposedTools } = {}) {
  const calls = [];
  const checks = [];
  const refusal = { ok: false, reason: "unestablished-review-trace",
    reasonKind: "unestablished-review-trace", code: "transport-mock-refusal",
    violations: [], acceptedInvocation: null, fixtureAuthority: "TRANSPORT_MOCK_ONLY" };
  const promise = runReviewRecovery({ evidenceDirectory: directory,
    basePrompt: "Review all input using the caller's canonical callback.",
    reviewTools: transportReviewTools, expectedContext: { fixtureAuthority: "TRANSPORT_MOCK_ONLY", ...(exposedTools ? { reviewTools: exposedTools } : {}) },
    /**
     * Capture verifier arguments and return the configured transport-only verdict.
     * @param {Buffer} response - Captured fixture response bytes.
     * @param {Buffer|null} body - Submission bytes, or null for a missing file.
     * @returns {Object} Injected refusal or transport mock success.
     */
    verifyReviewInvocation(response, body) {
      assert.ok(Buffer.isBuffer(response));
      assert.ok(body === null || Buffer.isBuffer(body));
      checks.push({ response: Buffer.from(response), body: body && Buffer.from(body) });
      if (checks.length === 1 || secondFails) return refusal;
      return { ok: true, reason: null, reasonKind: null, code: "transport-mock-success",
        violations: [], sessionID: "ses_recovery", fixtureAuthority: "TRANSPORT_MOCK_ONLY",
        acceptedInvocation: { sessionID: "ses_recovery", submissionCallID: "call_mock_submit" } };
    },
    invokeAttempt: async ({ attempt, responseFile, stderrFile }) => {
      calls.push(attempt);
      if (attempt === 1 || secondFails) {
        fs.writeFileSync(responseFile, events.map((event) => JSON.stringify(event)).join("\n") + "\n");
        fs.writeFileSync(stderrFile, "! permission requested: doom_loop (invalid); auto-rejecting\n");
        return { exitCode: 1 };
      }
      fs.writeFileSync(responseFile, transportResponse({ sessionID: "ses_recovery" }));
      fs.writeFileSync(stderrFile, "");
      fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({
        schema: "open-hax.github-review/v1", event: "APPROVE", summary: "TRANSPORT_MOCK_ONLY", comments: [] }));
      return { exitCode: 0 };
    } });
  return { promise, calls, checks, refusal };
}

for (const [name, tool, state] of [
  ["failed bash", "bash", { status: "error", input: {}, error: "permission denied" }],
  ["failed read", "read", { status: "error", input: {}, error: "file unavailable" }],
  ["failed grep", "grep", { status: "error", input: {}, error: "output overflow" }],
  ["completed HOST with an explicit error", "bash", { status: "completed", input: {}, output: "partial", error: "failure" }],
  ["completed HOST with an empty error string", "bash", { status: "completed", input: {}, output: "partial", error: "" }],
  ["completed HOST with a zero error value", "bash", { status: "completed", input: {}, output: "partial", error: 0 }],
  ["unfinished HOST", "read", { status: "running", input: {} }],
  ["failed review_begin", "review_begin", { status: "completed", input: {}, output: '{"ok?":false,"error":"refused"}' }],
  ["failed review stage", "review_record_stage", { status: "completed", input: {}, output: '{"ok?":false,"error":"refused"}' }],
  ["failed review_submit", "review_submit", { status: "completed", input: {}, output: '{"ok?":false,"error":"refused"}' }],
  ["review return with no literal success", "review_begin", { status: "completed", input: {}, output: '{"ok?":"true"}' }],
  ["malformed review return", "review_begin", { status: "completed", input: {}, output: "{broken" }],
  ["missing review return", "review_begin", { status: "completed", input: {} }],
  ["additional earlier invalid call", "invalid", { status: "completed", input: invalidInput }],
]) {
  test(`known-unavailable mixed prefix refuses ${name} before a second process`, async (t) => {
    const directory = fixture(t);
    const events = mixedUnavailableEvents(tool, state);
    const { promise, calls, checks, refusal } = strictUnavailableFailure(directory, events);
    await assert.rejects(promise, /attempt 1 exited 1/);
    assert.deepEqual(calls, [1]);
    assert.equal(checks.length, 1);
    assert.equal(checks[0].body, null);
    const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
    assert.equal(receipt.accepted_invocation, null);
    assert.equal(receipt.recovery_reason, null);
    assert.equal(receipt.attempts.length, 1);
    assert.deepEqual(receipt.attempts[0].canonical_verdict, refusal);
    assert.equal(receipt.attempts[0].response_sha256, transportSha256(checks[0].response));
    assert.deepEqual(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt")), checks[0].response);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
  });
}

for (const [name, events] of [
  ["clean recognized tail", failureEvents()],
  ["successful HOST prefix", mixedUnavailableEvents("bash", { status: "completed", input: {}, output: "success", error: null })],
  ["successful review prefix", mixedUnavailableEvents("review_begin", { status: "completed", input: {}, output: '{"ok?":true}' })],
  ["false HOST error flag", mixedUnavailableEvents("read", { status: "completed", input: {}, output: "success", error: false })],
  ["failure-shaped nested HOST output", mixedUnavailableEvents("bash", { status: "completed", input: {},
    output: JSON.stringify({ "ok?": false, error: "quoted inert data", type: "error", state: { status: "error" } }) })],
]) {
  test(`known-unavailable mixed prefix retains recovery for ${name}`, async (t) => {
    const directory = fixture(t);
    const { promise, calls, checks, refusal } = strictUnavailableFailure(directory, events);
    const receipt = await promise;
    assert.deepEqual(calls, [1, 2]);
    assert.equal(checks.length, 2);
    assert.equal(receipt.max_attempts, 2);
    assert.equal(receipt.recovery_reason, "unavailable_review_tool");
    assert.deepEqual(receipt.attempts[0].canonical_verdict, refusal);
    assert.deepEqual(receipt.attempts[0].tool_failure.call_ids, ["call_1", "call_2"]);
    assert.equal(receipt.accepted_invocation.attempt, 2);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
  });
}

test("known-unavailable mixed prefix keeps the strict two-process bound for a clean repeated failure", async (t) => {
  const directory = fixture(t);
  const { promise, calls, checks } = strictUnavailableFailure(directory, failureEvents(), { secondFails: true });
  await assert.rejects(promise, /attempt 2 exited 1/);
  assert.deepEqual(calls, [1, 2]);
  assert.equal(checks.length, 2);
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"))).accepted_invocation, null);
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
});

// Complete observer/review registry fixture, matching retained staged DATA.
const prefixRegistry = ["actor_list", "actor_mailbox", "actor_monitor", "agent_list", "muse_phases",
  "phase_conclusions", "phase_filter", "phase_head", "phase_list_active", "phase_list_idle",
  "phase_observations", "phase_tail", "review_assess_diff_chunk", "review_begin", "review_classify_finding",
  "review_propose_finding", "review_read_diff_chunk", "review_record_evidence", "review_status", "review_submit",
  "task_list", "task_status"];

/** Build a healthy HOST prefix and two matching HOST-reported availability lists. */
function registeredUnavailableEvents() {
  const available = [...prefixRegistry, "bash", "glob", "grep", "read", "skill", "invalid"].sort();
  const events = mixedUnavailableEvents("actor_list", { status: "completed", input: {}, output: "inert" });
  for (const event of events.slice(1, -1)) event.part = { ...event.part,
    state: { ...event.part.state, input: { ...invalidInput,
      error: `Model tried to call unavailable tool 'assess_diff_chunk'. Available tools: ${available.join(", ")}.` } } };
  return events;
}

for (const [name, change] of [
  ["missing part type", (e) => { delete e[0].part.type; }],
  ["wrong part type", (e) => { e[0].part.type = "text"; }],
  ["missing part ID", (e) => { delete e[0].part.id; }],
  ["blank part ID", (e) => { e[0].part.id = " "; }],
  ["duplicate part ID across prefix and tail", (e) => { e[0].part.id = e[1].part.id; }],
  ["missing call ID", (e) => { delete e[0].part.callID; }],
  ["blank call ID", (e) => { e[0].part.callID = " "; }],
  ["duplicate call ID across prefix and tail", (e) => { e[0].part.callID = e[1].part.callID; }],
  ["part session mismatch", (e) => { e[0].part.sessionID = "foreign"; }],
  ["missing HOST tool name", (e) => { delete e[0].part.tool; }],
  ["blank HOST tool name", (e) => { e[0].part.tool = " "; }],
  ["missing HOST input", (e) => { delete e[0].part.state.input; }],
  ["array HOST input", (e) => { e[0].part.state.input = []; }],
  ["null HOST input", (e) => { e[0].part.state.input = null; }],
  ["missing HOST output", (e) => { delete e[0].part.state.output; }],
  ["object HOST output", (e) => { e[0].part.state.output = {}; }],
  ["negative timestamp", (e) => { e[0].timestamp = -1; }],
  ["backwards prefix timestamp", (e) => { e[0].timestamp = 3; }],
  ["unknown completed HOST absent from availability", (e) => { e[0].part.tool = "unknown_external_tool"; }],
  ["unexposed review despite advertised availability", (e) => {
    e[0].part.tool = "review_new_control"; e[0].part.state.output = '{"ok?":true}';
    for (const event of e.slice(1, -1)) event.part.state.input.error =
      event.part.state.input.error.replace("Available tools: ", "Available tools: review_new_control, ");
  }],
  ["builtin HOST outside the prepared registry", (e) => { e[0].part.tool = "read"; }],
  ["unknown HOST advertised by both tails but outside the prepared registry", (e) => {
    e[0].part.tool = "unknown_external_tool";
    for (const event of e.slice(1, -1)) event.part.state.input.error =
      event.part.state.input.error.replace("Available tools: ", "Available tools: unknown_external_tool, ");
  }],
  ["prefix tool absent from one tail availability list", (e) => {
    e[2].part.state.input.error = e[2].part.state.input.error.replace("actor_list, ", "");
  }],
]) {
  test(`known-unavailable mixed prefix refuses ${name} with the trusted registry`, async (t) => {
    const directory = fixture(t);
    const events = registeredUnavailableEvents(); change(events);
    const { promise, calls, checks } = strictUnavailableFailure(directory, events, { exposedTools: prefixRegistry });
    await assert.rejects(promise, /attempt 1 exited 1/);
    assert.deepEqual(calls, [1]);
    assert.equal(checks.length, 1);
    const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
    assert.equal(receipt.accepted_invocation, null);
    assert.equal(receipt.recovery_reason, null);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
  });
}

test("known-unavailable mixed prefix retains complete-registry observer recovery", async (t) => {
  const events = registeredUnavailableEvents();
  events.unshift({ ...events[0], timestamp: 0, part: { ...events[0].part,
    id: "part_observer", callID: "call_observer", tool: "actor_mailbox" } });
  const { promise, calls } = strictUnavailableFailure(fixture(t), events, { exposedTools: prefixRegistry });
  const receipt = await promise;
  assert.deepEqual(calls, [1, 2]);
  assert.equal(receipt.recovery_reason, "unavailable_review_tool");
});

test("known-unavailable mixed prefix retains fourteen healthy review reads before the recognized tail", async (t) => {
  const tail = registeredUnavailableEvents().slice(1).map((event) => ({ ...event, timestamp: event.timestamp + 20 }));
  const prefix = Array.from({ length: 14 }, (_, i) => ({ type: "tool_use", timestamp: i + 1,
    sessionID: "ses_fixture", part: { type: "tool", id: `part_read_${i}`, callID: `call_read_${i}`,
      sessionID: "ses_fixture", tool: "review_read_diff_chunk", state: { status: "completed",
        input: { id: i + 1 }, output: JSON.stringify({ "ok?": true, chunk: { id: i + 1, text: "synthetic page" } }) } } }));
  const { promise, calls } = strictUnavailableFailure(fixture(t), [...prefix, ...tail], { exposedTools: prefixRegistry });
  const receipt = await promise;
  assert.deepEqual(calls, [1, 2]);
  assert.deepEqual(receipt.attempts[0].tool_failure.call_ids, ["call_1", "call_2"]);
});

for (const [name, events] of [
  ["failed HOST", mixedUnavailableEvents("bash", { status: "error", input: {}, error: "legacy fixture" })],
  ["failed review", mixedUnavailableEvents("review_begin", { status: "completed", input: {}, output: '{"ok?":false,"error":"legacy fixture"}' })],
  ["malformed prior input", mixedUnavailableEvents("read", { status: "completed", input: [], output: "legacy fixture" })],
  ["unknown prior name", mixedUnavailableEvents("unknown_external_tool", { status: "completed", input: {}, output: "legacy fixture" })],
  ["incomplete prior tool", mixedUnavailableEvents("read", { status: "running", input: {} })],
]) {
  test(`known-unavailable mixed prefix keeps no-callback library behavior for ${name}`, async (t) => {
    // Library compatibility only. The production CLI always supplies Muse.
    const { promise, calls } = await invokeFailure(fixture(t), { events });
    const receipt = await promise;
    assert.deepEqual(calls.map(({ attempt }) => attempt), [1, 2]);
    assert.equal(receipt.recovery_reason, "unavailable_review_tool");
    assert.equal(Object.hasOwn(receipt, "accepted_invocation"), false);
  });
}

// ETA-51A-SOURCE-001: actual supervisor/child transport, not canonical Muse law.
/** Run a locally authored child that emits the supplied strict tail before a mock full recovery. */
function strictTailCLI(t, events) {
  const directory = fixture(t);
  const child = path.join(directory, "tail-transport-child.mjs");
  const runner = fileURLToPath(new URL("./run-opencode-review-recovery.mjs", import.meta.url));
  fs.writeFileSync(child, `#!${process.execPath}
import fs from "node:fs";
import path from "node:path";
const directory = process.env.REVIEW_EVIDENCE_DIR;
const counter = path.join(directory, "child-count.txt");
const attempt = fs.existsSync(counter) ? Number(fs.readFileSync(counter, "utf8")) + 1 : 1;
fs.writeFileSync(counter, String(attempt));
fs.appendFileSync(path.join(directory, "child-pids.txt"), String(process.pid) + "\\n");
if (attempt === 1) {
  for (const event of ${JSON.stringify(events)}) console.log(JSON.stringify(event));
  console.error("! permission requested: doom_loop (invalid); auto-rejecting");
  process.exitCode = 1;
} else {
  fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({
    schema: "open-hax.github-review/v1", event: "APPROVE", summary: "TRANSPORT_MOCK_ONLY", comments: [] }));
  process.stdout.write(${JSON.stringify(transportResponse({ sessionID: "ses_recovery" }).toString())});
}
`);
  fs.chmodSync(child, 0o755);
  const prompt = path.join(directory, "prompt.md");
  fs.writeFileSync(prompt, "Review all current input #{{PR_NUMBER}}.\n");
  const invocation = stageTransportVerifier(directory, { reviewTools: prefixRegistry });
  const result = spawnSync(process.execPath, [runner], {
    encoding: "utf8", timeout: 10_000,
    env: { ...process.env, OPENCODE_BIN: child, REVIEW_EVIDENCE_DIR: directory,
      REVIEW_PROMPT_FILE: prompt, REVIEW_MODEL: "synthetic/fixture", ...invocation.env, PR_NUMBER: "345" },
  });
  const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  const children = Number(fs.readFileSync(path.join(directory, "child-count.txt"), "utf8"));
  const pids = fs.readFileSync(path.join(directory, "child-pids.txt"), "utf8").trim().split("\n");
  t.diagnostic(`tail-only actual CLI observation: ${JSON.stringify({ exit: result.status, children,
    pids, recoveryReason: receipt.recovery_reason, firstVerdict: receipt.attempts[0].canonical_verdict,
    firstResponseSha256: receipt.attempts[0].response_sha256 })}`);
  return { directory, invocation, result, receipt, children, pids };
}

for (const [name, change] of [
  ["negative timestamp", (events) => { events[0].timestamp = -1; }],
  ["backwards tool timestamp", (events) => { events[1].timestamp = 0; }],
  ["backwards terminal timestamp", (events) => { events[2].timestamp = 1; }],
  ["duplicate part ID", (events) => { events[1].part.id = events[0].part.id; }],
  ["blank part ID", (events) => { events[0].part.id = " \t "; }],
  ["missing part ID", (events) => { delete events[0].part.id; }],
  ["nonstring part ID", (events) => { events[0].part.id = 42; }],
  ["whitespace call ID", (events) => { events[0].part.callID = " \t "; }],
]) {
  test(`strict tail-only actual CLI refuses ${name} before a second child`, (t) => {
    const events = failureEvents(); change(events);
    const { directory, invocation, result, receipt, children, pids } = strictTailCLI(t, events);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /attempt 1 exited 1/);
    assert.equal(children, 1);
    assert.equal(pids.length, 1);
    assert.equal(receipt.max_attempts, 2);
    assert.equal(receipt.recovery_reason, null);
    assert.equal(receipt.accepted_invocation, null);
    assert.equal(receipt.attempts.length, 1);
    assert.equal(receipt.attempts[0].exit_code, 1);
    assert.equal(receipt.attempts[0].verification_state, "returned");
    assert.equal(receipt.attempts[0].canonical_verdict.reason, "unestablished-review-trace");
    assert.equal(receipt.attempts[0].canonical_verdict.fixtureAuthority, "TRANSPORT_MOCK_ONLY");
    const firstResponse = events.map((event) => JSON.stringify(event)).join("\n") + "\n";
    assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), firstResponse);
    assert.equal(receipt.attempts[0].response_sha256, transportSha256(firstResponse));
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
    assert.equal(fs.existsSync(path.join(directory, "submission.json")), false);
    assert.equal(fs.readFileSync(invocation.output, "utf8"), "");
  });
}

for (const prefix of [false, true]) {
  test(`strict tail-only actual CLI retains one fresh child for healthy ${prefix ? "read/assessment prefix" : "clean tail"}`, (t) => {
    const events = prefix ? registeredUnavailableEvents().slice(1) : failureEvents();
    if (prefix) {
      for (const event of events) event.timestamp += 2;
      events.unshift(...["review_read_diff_chunk", "review_assess_diff_chunk"].map((tool, i) => ({
        type: "tool_use", timestamp: i + 1, sessionID: "ses_fixture",
        part: { type: "tool", id: `part_healthy_${i}`, callID: `call_healthy_${i}`,
          sessionID: "ses_fixture", tool, state: { status: "completed", input: {},
            output: JSON.stringify({ "ok?": true, fixtureAuthority: "TRANSPORT_MOCK_ONLY" }) } },
      })));
    }
    const { directory, invocation, result, receipt, children, pids } = strictTailCLI(t, events);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(children, 2);
    assert.equal(pids.length, 2);
    assert.equal(new Set(pids).size, 2);
    assert.equal(receipt.max_attempts, 2);
    assert.equal(receipt.recovery_reason, "unavailable_review_tool");
    assert.deepEqual(receipt.attempts.map(({ exit_code }) => exit_code), [1, 0]);
    assert.equal(receipt.attempts[0].canonical_verdict.reason, "unestablished-review-trace");
    assert.deepEqual(receipt.attempts[0].tool_failure.call_ids, ["call_1", "call_2"]);
    assert.equal(receipt.accepted_invocation.attempt, 2);
    assert.equal(receipt.accepted_invocation.session_id, "ses_recovery");
    assert.equal(fs.readFileSync(invocation.output, "utf8"),
      `review_invocation_sha256=${transportSha256(JSON.stringify(receipt.accepted_invocation))}\n`);
    assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-3.txt")), false);
  });
}
