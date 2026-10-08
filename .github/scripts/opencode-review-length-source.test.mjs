// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { transportSha256 as sha256 } from "./review-invocation-fixture.mjs";

const runner = fileURLToPath(new URL("./run-opencode-review-recovery.mjs", import.meta.url));

/**
 * Allocate owned fixture storage and remove it after the control finishes.
 * @param {import("node:test").TestContext} t - Current test lifecycle.
 * @returns {string} Absolute temporary evidence directory.
 */
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "invocation-length-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/**
 * Stage a two-export capability stub for refusal-before-child controls only.
 * Neither callback supplies review law or a verdict. The child writes a canary
 * if incorrectly invoked; every caller of this helper requires its absence.
 * @param {import("node:test").TestContext} t - Current test lifecycle.
 * @returns {{directory: string, verifier: string, output: string, env: Object}} CLI fixture paths and environment.
 */
function cliFixture(t) {
  const directory = fixture(t), verifier = path.join(directory, "capability-only.cjs");
  const prompt = path.join(directory, "prompt.md"), output = path.join(directory, "github-output.txt");
  const child = path.join(directory, "child-must-not-run.mjs");
  fs.writeFileSync(prompt, "Synthetic capability refusal for {{PR_NUMBER}}.\n");
  fs.writeFileSync(path.join(directory, "basehead.diff"), "immutable synthetic full diff\n");
  fs.writeFileSync(path.join(directory, "input-manifest.json"), "{}\n");
  fs.writeFileSync(verifier, `// CAPABILITY STUB ONLY; these callbacks must not execute.
exports.prepareReviewInvocationContext=()=>{throw Error('must not prepare capability stub')};
exports.verifyReviewInvocation=()=>{throw Error('must not verify capability stub')};
`);
  fs.writeFileSync(child, `#!${process.execPath}
import fs from 'node:fs';
fs.writeFileSync(${JSON.stringify(path.join(directory, "child-count.txt"))}, "unexpected child");
process.exit(19);
`, { mode: 0o755 });
  const env = { ...process.env, PR_NUMBER: "342", REVIEW_PROMPT_FILE: prompt,
    REVIEW_EVIDENCE_DIR: directory, OPENCODE_BIN: child, REVIEW_MODEL: "synthetic/fixture",
    REVIEW_INVOCATION_VERIFIER_FILE: verifier, GITHUB_OUTPUT: output };
  return { directory, verifier, output, env };
}

// Finite length recovery: synthetic DATA + qualified locally source-built Muse.
// No fixture is a native invocation, review agreement, approval, or publication.
import { createRequire as lengthCreateRequire } from "node:module";
import { runKnownGrepOverflowReviewRecovery as lengthRun } from "./run-opencode-review-recovery.mjs";
const { assertLengthRecoveryExports: lengthAssembly } = await import("./run-opencode-review-recovery.mjs");
const lengthVerifierFile = process.env.REVIEW_TEST_LENGTH_VERIFIER_FILE;
assert.ok(lengthVerifierFile && path.isAbsolute(lengthVerifierFile), "absolute locally source-built length verifier required");
assert.equal(sha256(fs.readFileSync(lengthVerifierFile)), "980ddda6953c0a55c9cf98697fe2069e1ac40e9c50823d1ca4d884d40a2c4056");
const lengthMuse = lengthCreateRequire(import.meta.url)(lengthVerifierFile);
const lengthTools = ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk", "review_record_evidence",
  "review_propose_finding", "review_classify_finding", "review_status", "review_submit"];
const lengthStages = ["deterministic", "map-change", "generate-candidates", "adversarial-validate", "publish"];
/**
 * Construct local synthetic HOST events for the actual source-built callback.
 * @param {Object} ctx - Prepared canonical input geometry and submission path.
 * @param {string} text - Complete synthetic input.
 * @param {Object} [options] - Session, terminal reason, submit and grep variants.
 * @returns {{events: Object[], body: Buffer|null}} Synthetic trace and optional submission bytes, with no native credit.
 */
function lengthTrace(ctx, text, { session = "ses_length1", finish = "length", submit = false, grep = false } = {}) {
  const events = [], notes = ctx.pages.map(p => ({ ...p, note: `Synthetic material assessment of page ${p.id}.` }));
  const event = (type, part) => {
    const n = events.length + 1;
    events.push({ type, timestamp: n * 10, sessionID: session,
      part: { id: `prt_length${n}`, messageID: `msg_length${n}`, sessionID: session, ...part } });
  };
  const call = (tool, input, output) => event("tool_use", { type: "tool", tool,
    callID: `call_length${events.length + 1}`, state: { status: "completed", input,
      output: typeof output === "string" ? output : JSON.stringify(output),
      time: { start: (events.length + 1) * 10 - 2, end: (events.length + 1) * 10 - 1 } } });
  call("review_begin", {}, { "ok?": true, stage: "deterministic", stages: lengthStages,
    "input-source": ctx.inputSource, "diff-stats": { bytes: text.length, "truncated?": false },
    "input-coverage": { chunks: ctx.pageCount, delivered: 0, assessed: 0, missing: ctx.pages.map(p => p.id) } });
  for (const [i, p] of ctx.pages.entries()) {
    call("review_read_diff_chunk", { id: p.id }, { "ok?": true, chunk: { ...p, text: text.slice(p.start, p.end) } });
    call("review_assess_diff_chunk", { id: p.id, note: notes[i].note }, { "ok?": true, "chunk-id": p.id,
      coverage: { chunks: ctx.pageCount, delivered: i + 1, assessed: i + 1, missing: ctx.pages.slice(i + 1).map(p => p.id) } });
  }
  if (grep) {
    call("grep", { path: "/home/runner/work/proxx/proxx", pattern: "complete-input eta-mu" }, "unused");
    const e = events.at(-1); e.part.state.status = "error";
    e.part.state.error = "Ripgrep JSON record exceeded 65536 bytes"; delete e.part.state.output;
    e.part.state.time = { start: e.timestamp - 2, end: e.timestamp - 1 };
  }
  for (const stage of lengthStages) call("review_record_evidence", { stage, note: `Synthetic ${stage}.` }, { "ok?": true });
  const body = submit ? Buffer.from(JSON.stringify({ schema: "open-hax.github-review/v1", event: "COMMENT",
    summary: "Synthetic complete review; no native credit.", comments: [], "input-source": ctx.inputSource,
    "input-assessments": notes, "input-coverage": { chunks: ctx.pageCount, delivered: ctx.pageCount, assessed: ctx.pageCount, missing: [] } })) : null;
  if (body) call("review_submit", { summary: JSON.parse(body).summary }, { "ok?": true, event: "COMMENT", file: ctx.submissionFile, "inline-comments": 0 });
  event("step_finish", { type: "step-finish", reason: finish });
  return { events, body };
}
/**
 * Assign increasing synthetic timestamps after a deliberate fixture mutation.
 * @param {Object[]} events - Owned synthetic events, never a native trace.
 * @returns {void} Mutates only the local fixture timestamps.
 */
function lengthRetime(events) {
  events.forEach((e, i) => { e.timestamp = (i + 1) * 10; });
}
/**
 * Exercise the shared two-attempt supervisor with canonical local callbacks.
 * @param {import("node:test").TestContext} t - Current test lifecycle.
 * @param {Object} [options] - Synthetic trace, custody and callback fault controls.
 * @returns {Promise<Object>} Captured calls, classifications, metadata and any refusal.
 */
async function lengthExercise(t, options = {}) {
  const directory = fixture(t), full = Buffer.from("diff --git a/a b/a\n+Unicode € boundary\n" + "x".repeat(9000));
  const manifest = Buffer.from(JSON.stringify({ schema: "open-hax.review-input/v1", base_sha: "a".repeat(40), head_sha: "b".repeat(40), diff_base_sha: "a".repeat(40),
    full_diff: { path: "basehead.diff", bytes: full.length, sha256: sha256(full) }, provenance: { repository: "synthetic/length-controls", pull_request: "1", run_id: "2", run_attempt: "1", workflow_sha: "d".repeat(40), workflow_ref: "synthetic/workflow" } }));
  const sourceFile = path.join(directory, "trusted-source-identity.txt");
  // Law executes ONLY the approved local module above; this file tests source custody.
  const sourceBytes = Buffer.from("owned synthetic source-custody sentinel\n");
  fs.writeFileSync(sourceFile, sourceBytes);
  fs.writeFileSync(path.join(directory, "basehead.diff"), full);
  fs.writeFileSync(path.join(directory, "input-manifest.json"), manifest);
  const ctx = lengthMuse.prepareReviewInvocationContext(full, manifest, lengthTools, path.join(directory, "submission.json"));
  const first = lengthTrace(ctx, full.toString(), { finish: options.firstFinish ?? "length", submit: !!options.firstSubmit, grep: !!options.firstGrep });
  const second = lengthTrace(ctx, full.toString(), { session: options.sameSession ? "ses_length1" : "ses_length2",
    finish: options.secondLength ? "length" : "stop", submit: !options.secondMissing && !options.secondLength, grep: !!options.secondGrep });
  options.changeFirst?.(first.events, ctx); lengthRetime(first.events);
  const encode = events => Buffer.from(events.map(e => JSON.stringify(e)).join("\n") + "\n");
  const raw = encode(first.events), secondRaw = encode(second.events), calls = [], classifiers = [], verifications = [];
  const mutation = kind => {
    if (kind === "response" || kind === "stderr") fs.appendFileSync(path.join(directory, kind === "response" ? "model-response-attempt-1.txt" : "opencode-stderr-attempt-1.log"), "changed");
    if (kind === "source") fs.appendFileSync(sourceFile, "changed");
    if (kind === "diff") fs.appendFileSync(path.join(directory, "basehead.diff"), "changed");
    if (kind === "manifest") fs.appendFileSync(path.join(directory, "input-manifest.json"), "changed");
    if (kind === "context") ctx.pages[0].end -= 1;
    if (kind === "submission") fs.writeFileSync(path.join(directory, "submission.json"), "{}");
  };
  let error, result;
  try {
    options.setup?.(directory, ctx, sourceFile);
    result = await lengthRun({ evidenceDirectory: directory, basePrompt: "Review full immutable input.", reviewTools: lengthTools,
      expectedContext: options.noContext ? undefined : ctx, verifierFile: sourceFile, verifierSha256: sha256(sourceBytes),
      verifyReviewInvocation: options.noStrict ? undefined : (response, body, context) => {
        const verdict = lengthMuse.verifyReviewInvocation(response, body, context);
        verifications.push(verdict);
        if (options.duringVerify && calls.length === 1) mutation(options.duringVerify);
        if (options.bufferVerify) response[0] ^= 1;
        if (options.duringSecondVerify && calls.length === 2) mutation(options.duringSecondVerify);
        return verdict;
      },
      ...(options.noClassifier ? {} : { classifyLengthEndedReview: options.invalidCallback ? {} : async (response, body, context, custody) => {
        assert.equal(body, null); assert.ok(Buffer.isBuffer(response)); assert.equal(context.fullDiff, full.toString());
        assert.deepEqual(custody.contextBefore, context); assert.deepEqual(custody.contextAfter, context);
        assert.equal(custody.invocationState, "completed"); assert.equal(custody.exitCode, 0);
        if (options.callbackThrows) throw new Error("owned classifier callback fault");
        const verdict = lengthMuse.classifyLengthEndedReview(response, body, context, custody); classifiers.push(verdict);
        if (options.duringClassify) mutation(options.duringClassify);
        if (options.bufferClassify) response[0] ^= 1;
        if (options.custodyClassify) custody.responseSha256After = "f".repeat(64);
        if (options.lengthContextClassify) context.fullDiff += "changed";
        return options.callbackResult ? options.callbackResult(verdict) : verdict;
      } }),
      invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
        calls.push({ attempt, prompt });
        if (options.childThrows) throw new Error("owned child fault");
        fs.writeFileSync(responseFile, attempt === 1 ? raw : secondRaw); fs.writeFileSync(stderrFile, "owned child stderr\n");
        const body = attempt === 1 ? first.body : second.body;
        if (body) fs.writeFileSync(path.join(directory, "submission.json"), options.malformedSubmit ? "{broken" : body);
        if (options.collision && attempt === 1) fs.writeFileSync(path.join(directory, "model-response-attempt-2.txt"), "retained collision");
        return { exitCode: options.exitCode ?? 0 };
      } });
  } catch (caught) { error = caught; }
  const metadataFile = path.join(directory, "recovery.json");
  const metadata = fs.existsSync(metadataFile) ? JSON.parse(fs.readFileSync(metadataFile)) : null;
  if (process.env.REVIEW_LENGTH_WITNESS_FILE) fs.appendFileSync(process.env.REVIEW_LENGTH_WITNESS_FILE,
    JSON.stringify({ test: t.name, options: Object.keys(options), calls, classifiers, verifications, metadata,
      error: error?.message ?? null, originalFirstTrace: raw.toString(), originalFirstSubmission: first.body?.toString() ?? null }) + "\n");
  return { directory, calls, classifiers, verifications, metadata, error, result, raw, secondRaw };
}
test("finite-length source: healthy full input before FIRST and LAST gets exactly one fresh complete invocation", async t => {
  const f = await lengthExercise(t); assert.ifError(f.error);
  assert.deepEqual(f.calls.map(c => c.attempt), [1, 2]); assert.match(f.calls[1].prompt, /length.*without submission/);
  assert.match(f.calls[1].prompt, /review_begin/); assert.match(f.calls[1].prompt, /Corrective attempt 2 of 2/);
  assert.equal(f.verifications[0].ok, false); assert.equal(f.verifications[0].code, "unterminated-host-trace");
  assert.equal(f.metadata.attempts[0].canonical_verdict.acceptedInvocation, null);
  assert.equal(f.metadata.attempts[0].length_ended_review.result.eligible, true);
  assert.equal(f.metadata.recovery_reason, "length_ended_unfinished_review");
  assert.equal(f.metadata.accepted_invocation.attempt, 2); assert.equal(f.metadata.accepted_invocation.session_id, "ses_length2");
  assert.deepEqual(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt")), f.raw);
  assert.equal(fs.existsSync(path.join(f.directory, "model-response-attempt-3.txt")), false);
});
const lengthNegatives = {
  "premature FIRST": e => { const n = e.findIndex(x => x.part.tool === "review_record_evidence"); e.splice(1, 0, e.splice(n, 1)[0]); },
  "post-FIRST reassessment": e => { const x = structuredClone(e.find(x => x.part.tool === "review_assess_diff_chunk")); x.part.id += "extra"; x.part.callID += "extra"; e.splice(e.length - 1, 0, x); },
  "stale LAST": e => { const x = structuredClone(e.find(x => x.part.tool === "review_read_diff_chunk")); x.part.id += "extra"; x.part.callID += "extra"; e.splice(e.length - 1, 0, x); },
  "wrong session": e => { e[1].sessionID = e[1].part.sessionID = "ses_foreign"; },
  "wrong source": e => { const x = JSON.parse(e[0].part.state.output); x["input-source"].head_sha = "c".repeat(40); e[0].part.state.output = JSON.stringify(x); },
  "failed HOST": e => { e.splice(e.length - 1, 0, { type: "tool_use", timestamp: 1, sessionID: "ses_length1", part: { type: "tool", id: "prt_failed", sessionID: "ses_length1", callID: "call_failed", tool: "read", state: { status: "error", input: {}, error: "owned failure" } } }); },
  "failed review tool": e => { const x = e.find(x => x.part.tool === "review_assess_diff_chunk"); x.part.state.output = JSON.stringify({ "ok?": false, error: "owned failure" }); },
  "different returned page": e => { const x = e.find(x => x.part.tool === "review_read_diff_chunk"), o = JSON.parse(x.part.state.output); o.chunk.text = "!" + o.chunk.text.slice(1); x.part.state.output = JSON.stringify(o); },
  "missing page assessment": e => { e.splice(e.findIndex(x => x.part.tool === "review_assess_diff_chunk"), 1); },
  "duplicate begin": e => { const x = structuredClone(e[0]); x.part.id += "extra"; x.part.callID += "extra"; e.splice(1, 0, x); },
  "unknown terminal": e => { e.at(-1).part.reason = "unknown"; },
};
for (const [name, changeFirst] of Object.entries(lengthNegatives)) test(`finite-length source refusal: ${name}`, async t => {
  const f = await lengthExercise(t, { changeFirst }); assert.ok(f.error);
  assert.deepEqual(f.calls.map(x => x.attempt), [1]); assert.equal(f.metadata.accepted_invocation, null);
  assert.equal(f.classifiers[0]?.eligible, false);
});
for (const phase of ["duringVerify", "duringClassify", "duringSecondVerify"]) for (const kind of ["response", "stderr", "diff", "manifest", "source", "context", "submission"])
  test(`finite-length custody refusal: ${phase} ${kind}`, async t => {
    const f = await lengthExercise(t, { [phase]: kind }); assert.ok(f.error);
    assert.equal(f.calls.length, phase === "duringSecondVerify" ? 2 : 1);
    assert.equal(f.metadata.accepted_invocation, null);
  });
for (const name of ["callbackThrows", "bufferClassify", "bufferVerify", "custodyClassify", "lengthContextClassify", "collision", "invalidCallback", "childThrows"])
  test(`finite-length caller refusal: ${name}`, async t => {
    const f = await lengthExercise(t, { [name]: true }); assert.ok(f.error);
    assert.ok(f.calls.length <= 1); assert.equal(f.metadata.accepted_invocation, null);
  });
for (const [name, callbackResult] of [
  ["null output", () => null], ["accepted output", r => ({ ...r, ok: true, acceptedInvocation: {} })],
  ["wrong source digest", r => ({ ...r, fullInputSha256: "f".repeat(64) })],
  ["wrong response digest", r => ({ ...r, responseSha256: "f".repeat(64) })],
  ["nonserializable output", () => ({ eligible: 1n })],
]) test(`finite-length output refusal: ${name}`, async t => {
  const f = await lengthExercise(t, { callbackResult }); assert.ok(f.error);
  assert.equal(f.calls.length, 1); assert.equal(f.metadata.accepted_invocation, null);
});
for (const options of [ { exitCode: 1 }, { firstSubmit: true }, { firstSubmit: true, malformedSubmit: true },
  { noClassifier: true }, { sameSession: true }, { secondLength: true }, { secondGrep: true }, { secondMissing: true } ])
  test(`finite-length terminal/shared MAX2: ${JSON.stringify(options)}`, async t => {
    const f = await lengthExercise(t, options); assert.ok(f.error);
    assert.ok(f.calls.length <= 2); assert.equal(f.metadata.accepted_invocation, null);
    if (options.sameSession || options.secondLength || options.secondGrep || options.secondMissing) assert.equal(f.calls.length, 2);
    else assert.equal(f.calls.length, 1);
  });
test("finite-length mixed MAX2: known grep first then length second has no third", async t => {
  const f = await lengthExercise(t, { firstFinish: "stop", firstGrep: true, secondLength: true }); assert.ok(f.error);
  assert.deepEqual(f.calls.map(x => x.attempt), [1, 2]);
  assert.equal(f.metadata.recovery_reason, "known_grep_overflow_transport"); assert.equal(f.metadata.accepted_invocation, null);
});
test("finite-length healthy accepted first review does not call classifier or repeat", async t => {
  const f = await lengthExercise(t, { firstFinish: "stop", firstSubmit: true }); assert.ifError(f.error);
  assert.equal(f.calls.length, 1); assert.equal(f.classifiers.length, 0); assert.equal(f.metadata.accepted_invocation.attempt, 1);
});

for (const healthy of [false, true]) test(`finite-length actual CLI source-built callback: ${healthy ? "healthy once" : "length then fresh complete child"}`, t => {
  const directory = fixture(t), full = Buffer.from("local CLI Unicode € full input\n");
  const manifest = Buffer.from(JSON.stringify({ schema: "open-hax.review-input/v1", base_sha: "a".repeat(40), head_sha: "b".repeat(40), diff_base_sha: "a".repeat(40),
    full_diff: { path: "basehead.diff", bytes: full.length, sha256: sha256(full) }, provenance: { repository: "synthetic/cli-length", pull_request: "1", run_id: "2", run_attempt: "1", workflow_sha: "d".repeat(40), workflow_ref: "synthetic/workflow" } }));
  fs.writeFileSync(path.join(directory, "basehead.diff"), full); fs.writeFileSync(path.join(directory, "input-manifest.json"), manifest);
  const ctx = lengthMuse.prepareReviewInvocationContext(full, manifest, lengthTools, path.join(directory, "submission.json"));
  const traces = [lengthTrace(ctx, full.toString(), { finish: healthy ? "stop" : "length", submit: healthy }),
    lengthTrace(ctx, full.toString(), { session: "ses_length2", finish: "stop", submit: true })];
  const child = path.join(directory, "local-child.mjs"), log = path.join(directory, "children.ndjson");
  // Locally authored child transports synthetic bytes only; no provider call.
  fs.writeFileSync(child, `#!${process.execPath}
import fs from 'node:fs';
const log=${JSON.stringify(log)}, dir=${JSON.stringify(directory)};
const attempt=fs.existsSync(log)?fs.readFileSync(log,'utf8').trim().split('\\n').length:0;
fs.appendFileSync(log,JSON.stringify({pid:process.pid,outputVisible:process.env.GITHUB_OUTPUT!==undefined,prompt:process.argv.at(-1)})+'\\n');
const traces=${JSON.stringify(traces.map(r => ({ events: r.events, body: r.body?.toString() ?? null })))};
if(attempt>=traces.length)process.exit(19);
if(traces[attempt].body)fs.writeFileSync(dir+'/submission.json',traces[attempt].body);
process.stdout.write(traces[attempt].events.map(e=>JSON.stringify(e)).join('\\n')+'\\n');
`, { mode: 0o755 });
  const output = path.join(directory, "output.txt"), prompt = path.join(directory, "prompt.txt"), registry = path.join(directory, "tools.txt");
  fs.writeFileSync(output, ""); fs.writeFileSync(prompt, "Review whole input for {{PR_NUMBER}}.\n"); fs.writeFileSync(registry, lengthTools.join("\n") + "\n");
  const result = spawnSync(process.execPath, [runner], { encoding: "utf8", timeout: 10000,
    env: { ...process.env, PR_NUMBER: "1", REVIEW_PROMPT_FILE: prompt, REVIEW_EVIDENCE_DIR: directory,
      REVIEW_INVOCATION_VERIFIER_FILE: lengthVerifierFile, REVIEW_TOOL_REGISTRY_FILE: registry,
      OPENCODE_BIN: child, REVIEW_MODEL: "synthetic/local-child", GITHUB_OUTPUT: output } });
  if (process.env.REVIEW_LENGTH_WITNESS_FILE) fs.appendFileSync(process.env.REVIEW_LENGTH_WITNESS_FILE, JSON.stringify({ test: t.name, phase: "child-diagnostic", status: result.status, stderr: result.stderr, childMode: fs.statSync(child).mode, shebang: fs.readFileSync(child, "utf8").split("\n")[0], execPath: process.execPath }) + "\n");
  assert.ifError(result.error); assert.equal(result.status, 0, result.stderr);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  const children = fs.readFileSync(log, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(children.length, healthy ? 1 : 2); assert.equal(new Set(children.map(x => x.pid)).size, children.length);
  assert.ok(children.every(x => x.outputVisible === false));
  assert.equal(metadata.accepted_invocation.expected_context_sha256, sha256(JSON.stringify(ctx)));
  assert.equal(metadata.accepted_invocation.verifier_sha256, sha256(fs.readFileSync(lengthVerifierFile)));
  assert.equal(metadata.length_recovery.expected_context_sha256, sha256(JSON.stringify(ctx)));
  assert.notEqual(metadata.length_recovery.length_context_sha256, sha256(JSON.stringify(ctx)));
  assert.equal(fs.readFileSync(output, "utf8"), `review_invocation_sha256=${sha256(JSON.stringify(metadata.accepted_invocation))}\n`);
  if (!healthy) {
    assert.equal(metadata.attempts[0].canonical_verdict.ok, false); assert.equal(metadata.attempts[0].length_ended_review.result.eligible, true);
    assert.equal(metadata.attempts[0].canonical_verdict.acceptedInvocation, null);
    assert.equal(metadata.attempts[0].length_ended_review.verifier_sha256, sha256(fs.readFileSync(lengthVerifierFile)));
    assert.match(children[1].prompt, /review_begin/);
  }
  if (process.env.REVIEW_LENGTH_WITNESS_FILE) fs.appendFileSync(process.env.REVIEW_LENGTH_WITNESS_FILE,
    JSON.stringify({ test: t.name, children, metadata, stdoutSha256: sha256(result.stdout), stderr: result.stderr,
      trustedOutput: fs.readFileSync(output, "utf8"), nativeCredit: false }) + "\n");
});

for (const options of [{ noStrict: true }, { noContext: true }]) test(`finite-length setup refusal: ${JSON.stringify(options)}`, async t => {
  const f = await lengthExercise(t, options); assert.ok(f.error); assert.equal(f.calls.length, 0);
  assert.equal(f.metadata.accepted_invocation, null); assert.equal(f.metadata.length_recovery.state, "rejected");
  assert.match(f.metadata.length_recovery.error, /strict invocation verification and context/);
});
for (const exportValue of ["MISSING", "null", "{}"])
  test(`finite-length source assembly missing/partial export refuses before any child: ${exportValue}`, t => {
    const f = cliFixture(t);
    // Existing two-export transport fixture is preserved; only this NEW test
    // adds a deliberately absent/nonfunction third export to its owned copy.
    if (exportValue !== "MISSING") fs.appendFileSync(f.verifier, `exports.classifyLengthEndedReview=${exportValue};\n`);
    const staged = lengthCreateRequire(import.meta.url)(f.verifier);
    assert.throws(() => lengthAssembly(staged), /staged length source must export.*classifyLengthEndedReview/);
    assert.equal(fs.existsSync(path.join(f.directory, "recovery.json")), false);
    assert.equal(fs.existsSync(path.join(f.directory, "child-count.txt")), false);
  });

for (const exportValue of ["null", "{}"]) test(`finite-length CLI malformed PRESENT classifier export refuses before child: ${exportValue}`, t => {
  const f = cliFixture(t); fs.appendFileSync(f.verifier, `exports.classifyLengthEndedReview=${exportValue};\n`);
  const result = spawnSync(process.execPath, [runner], { env: f.env, encoding: "utf8", timeout: 10000 });
  assert.ifError(result.error); assert.equal(result.status, 1);
  const metadata = JSON.parse(fs.readFileSync(path.join(f.directory, "recovery.json")));
  assert.match(metadata.setup_error, /staged length source must export.*classifyLengthEndedReview/);
  assert.deepEqual(metadata.attempts, []); assert.equal(metadata.accepted_invocation, null);
  assert.equal(fs.existsSync(f.output), false); assert.equal(fs.existsSync(path.join(f.directory, "child-count.txt")), false);
});
test("finite-length source assembly accepts all three actual local source-built exports", () => {
  assert.doesNotThrow(() => lengthAssembly(lengthMuse));
});
test("finite-length source: a length-ended healthy stage PREFIX earns only the second complete slot", async t => {
  const f = await lengthExercise(t, { changeFirst: events => {
    for (let i = events.length - 1; i >= 0; --i) if (events[i].part.tool === "review_record_evidence" &&
      ["generate-candidates", "adversarial-validate", "publish"].includes(events[i].part.state.input.stage)) events.splice(i, 1);
  } });
  assert.ifError(f.error); assert.equal(f.calls.length, 2);
  assert.deepEqual(f.classifiers[0].recordedStages, ["deterministic", "map-change"]);
  assert.equal(f.metadata.attempts[0].canonical_verdict.acceptedInvocation, null);
  assert.equal(f.metadata.accepted_invocation.attempt, 2);
});
test("finite-length setup fatal UTF8 refuses before first child", async t => {
  const f = await lengthExercise(t, { setup: directory => fs.writeFileSync(path.join(directory, "basehead.diff"), Buffer.from([0xff])) });
  assert.ok(f.error); assert.equal(f.calls.length, 0); assert.equal(f.metadata.accepted_invocation, null);
  assert.equal(f.metadata.length_recovery.state, "rejected");
});

test("finite-length setup without strict callback preserves pre-existing owned history byte-exact", async t => {
  const directory = fixture(t), historical = Buffer.from('owned pre-existing recovery sentinel\n');
  const file = path.join(directory, "recovery.json"); fs.writeFileSync(file, historical);
  let children = 0;
  await assert.rejects(lengthRun({ evidenceDirectory: directory, basePrompt: "Synthetic setup refusal.",
    classifyLengthEndedReview: () => { throw new Error("must not call classifier"); },
    invokeAttempt: () => { children += 1; throw new Error("must not invoke child"); } }), /pre-existing invocation evidence/);
  assert.equal(children, 0); assert.deepEqual(fs.readFileSync(file), historical);
});
