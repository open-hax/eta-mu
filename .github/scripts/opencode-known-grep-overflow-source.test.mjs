// SPDX-License-Identifier: GPL-3.0-or-later
// Synthetic caller controls against source-built pinned Muse; no native review credit.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runReviewRecovery } from "./run-opencode-review-recovery.mjs";
import { transportSha256 } from "./review-invocation-fixture.mjs";
function fixture(t) {
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),"review-overflow-source-"));
 t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return directory;
}

// Added tests run identically against original source and the additive candidate.
// Old source uses its actual runReviewRecovery; candidate selects the new caller.
const { runKnownGrepOverflowReviewRecovery: knownOverflowRun = runReviewRecovery } =
  await import("./run-opencode-review-recovery.mjs");
const { prepare: canonicalPrepare, verify: canonicalVerify } =
  await import("./review-invocation-canonical-source-fixture.mjs");
const overflowTools = ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk",
  "review_record_evidence", "review_propose_finding", "review_classify_finding", "review_status", "review_submit"];
const overflowStages = ["deterministic", "map-change", "generate-candidates", "adversarial-validate", "publish"];

for (const healthy of [false, true]) {
  test(`actual CLI with source-built Muse: ${healthy ? "healthy review runs once" : "known overflow starts one fresh whole process"}`, t => {
    const directory = fixture(t), full = Buffer.from("synthetic complete CLI diff\n");
    const manifest = Buffer.from(JSON.stringify({ schema: "open-hax.review-input/v1",
      base_sha: "a".repeat(40), head_sha: "b".repeat(40), diff_base_sha: "a".repeat(40),
      full_diff: { path: "basehead.diff", bytes: full.length, sha256: transportSha256(full) },
      provenance: { repository: "synthetic/cli-controls", pull_request: "1", run_id: "2",
        run_attempt: "1", workflow_sha: "d".repeat(40), workflow_ref: "synthetic/workflow" } }));
    fs.writeFileSync(path.join(directory, "basehead.diff"), full);
    fs.writeFileSync(path.join(directory, "input-manifest.json"), manifest);
    const context = canonicalPrepare(full, manifest, overflowTools, path.join(directory, "submission.json"));
    const traces = [overflowTrace(context, full.toString(), { fail: !healthy }),
      overflowTrace(context, full.toString(), { session: "ses_candidate2", fail: false })];
    const child = path.join(directory, "synthetic-child.mjs");
    // This is authored fixture code; it emits synthetic DATA and makes no model call.
    fs.writeFileSync(child, `#!${process.execPath}\nimport fs from "node:fs";\nimport path from "node:path";\nconst directory=${JSON.stringify(directory)};\nconst log=path.join(directory,"children.ndjson");\nconst attempt=fs.existsSync(log)?fs.readFileSync(log,"utf8").trim().split("\\n").length:0;\nfs.appendFileSync(log,JSON.stringify({pid:process.pid,trustedOutputVisible:Object.hasOwn(process.env,"GITHUB_OUTPUT")})+"\\n");\nconst traces=${JSON.stringify(traces.map(x => ({events:x.events,body:x.body.toString()})))};\nif(attempt>=traces.length)process.exit(19);\nfs.writeFileSync(path.join(directory,"submission.json"),traces[attempt].body);\nprocess.stdout.write(traces[attempt].events.map(x=>JSON.stringify(x)).join("\\n")+"\\n");\n`, { mode: 0o755 });
    const prompt = path.join(directory, "prompt.txt"), registry = path.join(directory, "tools.txt");
    const output = path.join(directory, "outputs.txt");
    fs.writeFileSync(prompt, "Review complete input for {{PR_NUMBER}}.\n");
    fs.writeFileSync(registry, overflowTools.join("\n") + "\n");
    fs.writeFileSync(output, "");
    const result = spawnSync(process.execPath, [fileURLToPath(new URL("./run-opencode-review-recovery.mjs", import.meta.url))], {
      encoding: "utf8", timeout: 15000, maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, PR_NUMBER: "1", REVIEW_PROMPT_FILE: prompt, REVIEW_EVIDENCE_DIR: directory,
        REVIEW_TOOL_REGISTRY_FILE: registry, REVIEW_INVOCATION_VERIFIER_FILE: process.env.REVIEW_TEST_CANONICAL_VERIFIER_FILE,
        OPENCODE_BIN: child, REVIEW_MODEL: "synthetic/fixture", GITHUB_OUTPUT: output } });
    assert.ifError(result.error); assert.equal(result.status, 0, result.stderr);
    const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
    const children = fs.readFileSync(path.join(directory, "children.ndjson"), "utf8").trim().split("\n").map(JSON.parse);
    assert.equal(metadata.attempts.length, healthy ? 1 : 2);
    assert.equal(children.length, healthy ? 1 : 2);
    assert.equal(new Set(children.map(x => x.pid)).size, children.length);
    assert.ok(children.every(x => x.trustedOutputVisible === false));
    assert.equal(metadata.accepted_invocation.attempt, healthy ? 1 : 2);
    assert.equal(metadata.accepted_invocation.canonical_verdict.ok, true);
    assert.equal(fs.readFileSync(output, "utf8"), `review_invocation_sha256=${transportSha256(JSON.stringify(metadata.accepted_invocation))}\n`);
    if (!healthy) {
      assert.equal(metadata.attempts[0].canonical_verdict.acceptedInvocation, null);
      assert.equal(metadata.attempts[0].known_grep_overflow_transport.canonical_verdict.ok, false);
      assert.equal(metadata.attempts[0].known_grep_overflow_transport.canonical_verdict.acceptedInvocation, null);
      assert.deepEqual(fs.readFileSync(path.join(directory, "submission-attempt-1.json")), traces[0].body);
    }
  });
}

/** Author synthetic native-shaped DATA using geometry from unchanged Muse. */
function overflowTrace(context, text, { session = "ses_candidate1", fail = true, submit = true } = {}) {
  const events = [], notes = context.pages.map((p) => ({ ...p, note: `Synthetic assessment ${p.id}; no native review credit.` }));
  const event = (type, part) => {
    const n = events.length + 1, timestamp = n * 10;
    events.push({ type, timestamp, sessionID: session,
      part: { id: `prt_candidate${n}`, messageID: `msg_candidate${n}`, sessionID: session, ...part } });
  };
  const call = (tool, input, output) => event("tool_use", { type: "tool", tool,
    callID: `call_candidate${events.length + 1}`, state: { status: "completed", input,
      output: typeof output === "string" ? output : JSON.stringify(output),
      time: { start: (events.length + 1) * 10 - 2, end: (events.length + 1) * 10 - 1 } } });
  call("review_begin", {}, { "ok?": true, stage: overflowStages[0], stages: overflowStages,
    "input-source": context.inputSource, "diff-stats": { bytes: text.length },
    "input-coverage": { chunks: context.pageCount, delivered: 0, assessed: 0, missing: context.pages.map(p => p.id) } });
  call("review_record_evidence", { stage: "deterministic", note: "Synthetic deterministic evidence." }, { "ok?": true });
  for (const [i, page] of context.pages.entries()) {
    call("review_read_diff_chunk", { id: page.id }, { "ok?": true, chunk: { ...page, text: text.slice(page.start, page.end) } });
    call("review_assess_diff_chunk", { id: page.id, note: notes[i].note }, { "ok?": true, "chunk-id": page.id,
      coverage: { chunks: context.pageCount, delivered: i + 1, assessed: i + 1, missing: context.pages.slice(i + 1).map(p => p.id) } });
  }
  if (fail) {
    call("grep", { path: "/home/runner/work/proxx/proxx", pattern: "complete-input eta-mu" }, "unused");
    const state = events.at(-1).part.state;
    state.status = "error"; state.error = "Ripgrep JSON record exceeded 65536 bytes"; delete state.output;
    call("grep", { path: "/home/runner/work/proxx/proxx/.opencode/review-evidence", include: "basehead.diff", pattern: "eta-mu" }, "Later successful search does not clear failure.");
  }
  for (const stage of overflowStages.slice(1)) call("review_record_evidence", { stage, note: `Synthetic ${stage}.` }, { "ok?": true });
  const body = Buffer.from(JSON.stringify({ schema: "open-hax.github-review/v1", event: "COMMENT",
    summary: "Synthetic whole invocation only; no native model review.", comments: [],
    "input-source": context.inputSource, "input-assessments": notes,
    "input-coverage": { chunks: context.pageCount, delivered: context.pageCount, assessed: context.pageCount, missing: [] } }));
  if (submit) call("review_submit", { summary: JSON.parse(body).summary }, { "ok?": true, event: "COMMENT", file: context.submissionFile, "inline-comments": 0 });
  event("step_finish", { type: "step-finish", reason: "stop" });
  return { events, body: submit ? body : null };
}

/** Run local candidate controls using the same source canonical callback throughout. */
async function overflowExercise(t, options = {}) {
  const directory = fixture(t), checks = [], invocations = [], pids = [];
  const full = options.large ? Buffer.from("diff\n" + "a".repeat(60 * 8192 - 5)) : Buffer.from("diff\n");
  const source = { schema: "open-hax.review-input/v1", base_sha: "a".repeat(40), head_sha: "b".repeat(40), diff_base_sha: "a".repeat(40),
    full_diff: { path: "basehead.diff", bytes: full.length, sha256: transportSha256(full) },
    provenance: { repository: "synthetic/overflow-controls", pull_request: "1", run_id: "2", run_attempt: "1", workflow_sha: "d".repeat(40), workflow_ref: "synthetic/workflow" } };
  const manifest = Buffer.from(JSON.stringify(source));
  const context = canonicalPrepare(full, manifest, overflowTools, path.join(directory, "submission.json"));
  const first = overflowTrace(context, full.toString(), { submit: options.submit !== false, fail: options.healthy !== true });
  options.change?.(first.events, context);
  const raw = Buffer.from(first.events.map(e => JSON.stringify(e)).join(options.crlf ? "\r\n" : "\n") + (options.crlf ? "\r\n" : "\n"));
  const body = first.body;
  const second = overflowTrace(context, full.toString(), { session: options.sameSession ? "ses_candidate1" : "ses_candidate2", fail: !!options.secondFails, submit: !options.secondMissing });
  options.secondChange?.(second.events);
  let error, result;
  if (options.preexisting) {
    fs.writeFileSync(path.join(directory, "model-response-attempt-1.txt"), raw);
    fs.writeFileSync(path.join(directory, "opencode-stderr-attempt-1.log"), "");
    fs.writeFileSync(path.join(directory, "submission.json"), body);
    fs.writeFileSync(path.join(directory, "recovery.json"), JSON.stringify({
      schema: "open-hax.review-recovery/v1", max_attempts: 2, recovery_reason: null, accepted_invocation: null,
      attempts: [{attempt:1, exit_code:0, invocation_state:"completed", verification_state:"returned",
        submission_state:"present", response_file:"model-response-attempt-1.txt", stderr_file:"opencode-stderr-attempt-1.log",
        response_sha256:transportSha256(raw), stderr_sha256:transportSha256(""), submission_sha256:transportSha256(body),
        canonical_verdict:canonicalVerify(raw,body,context)}] }));
  }
  const verifier = (response, submissionBytes, ctx) => {
    const verdict = canonicalVerify(response, submissionBytes, ctx);
    checks.push({ response: Buffer.from(response), body: submissionBytes && Buffer.from(submissionBytes), verdict });
    if (checks.length === 1 && options.originalVerdict) return { ...verdict, ...options.originalVerdict };
    if (checks.length === 2 && invocations.length === 1) {
      options.mutateDuringDerived?.(directory, ctx);
      if (options.derivedVerdict) return { ...verdict, ...options.derivedVerdict };
      if (options.derivedThrows) throw new Error("synthetic canonical callback fault");
    }
    if (invocations.length === 2) options.mutateDuringSecond?.(directory, ctx);
    return verdict;
  };
  try {
    result = await knownOverflowRun({ evidenceDirectory: directory, basePrompt: "Review whole immutable input.",
      expectedContext: context, reviewTools: options.unexposed ? [] : overflowTools,
      ...(options.noCallback ? {} : { verifyReviewInvocation: verifier }),
      invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
        invocations.push({ attempt, prompt });
        if (attempt === 2) {
          assert.equal(fs.existsSync(path.join(directory, "submission.json")), false);
          if (body) assert.deepEqual(fs.readFileSync(path.join(directory, "submission-attempt-1.json")), body);
          options.beforeSecond?.(directory);
          if (options.secondThrows) throw new Error("synthetic child rejection");
        }
        const bytes = attempt === 1 ? raw : Buffer.from(second.events.map(e => JSON.stringify(e)).join("\n") + "\n");
        // Authored owner-test child code, never an archive executable or model.
        const child = spawnSync(process.execPath, ["-e", "process.stdin.pipe(process.stdout); process.stderr.write(String(process.pid));"], { input: bytes, maxBuffer: 4 * 1024 * 1024 });
        assert.equal(child.status, 0); pids.push(Number(child.stderr.toString()));
        fs.writeFileSync(responseFile, child.stdout); fs.writeFileSync(stderrFile, "");
        const writtenBody = attempt === 1 ? body : second.body;
        if (writtenBody !== null) fs.writeFileSync(path.join(directory, "submission.json"), options.malformed ? "{broken" : writtenBody);
        if (attempt === 1 && options.collision) fs.writeFileSync(path.join(directory, options.collision), "retained collision sentinel");
        return { exitCode: attempt === 1 ? options.exitCode ?? 0 : options.secondExit ?? 0 };
      } });
  } catch (caught) { error = caught; }
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json")));
  return { directory, context, raw, body, checks, invocations, pids, metadata, result, error };
}

test("known grep overflow candidate: exact failure and present submission retain custody before a fresh accepted synthetic process", async t => {
  const f = await overflowExercise(t);
  assert.ifError(f.error);
  assert.deepEqual(f.invocations.map(x => x.attempt), [1, 2]);
  assert.equal(new Set(f.pids).size, 2);
  assert.equal(f.checks.length, 3);
  assert.equal(f.checks[0].verdict.code, "host-tool-schema");
  assert.equal(f.checks[0].verdict.acceptedInvocation, null);
  assert.equal(f.checks[1].body, null);
  assert.equal(f.checks[1].verdict.code, "healthy-unfinished-review");
  assert.equal(f.checks[1].verdict.ok, false);
  assert.equal(f.checks[1].verdict.acceptedInvocation, null);
  const proof = f.metadata.attempts[0].known_grep_overflow_transport;
  assert.equal(proof.accepted_review, false);
  assert.equal(proof.omitted_lines.length, 2);
  assert.equal(proof.original_submission_sha256, transportSha256(f.body));
  assert.equal(f.metadata.attempts[0].retained_submission_sha256, transportSha256(f.body));
  assert.deepEqual(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt")), f.raw);
  assert.equal(f.metadata.recovery_reason, "known_grep_overflow_transport");
  assert.equal(f.metadata.accepted_invocation.attempt, 2);
  assert.equal(f.metadata.accepted_invocation.session_id, "ses_candidate2");
  assert.match(f.invocations[1].prompt, /Corrective attempt 2 of 2/);
  assert.match(f.invocations[1].prompt, /explicit grep include/);
  assert.match(f.invocations[1].prompt, /STOP on any actual HOST/);
});

for (const [name, options] of [["missing submission", { submit: false }], ["CRLF raw-byte retention", { crlf: true }], ["synthetic fresh whole60-page process", { large: true }]]) {
  test(`known grep overflow candidate: ${name}`, async t => {
    const f = await overflowExercise(t, options); assert.ifError(f.error);
    assert.equal(f.metadata.attempts.length, 2); assert.equal(f.metadata.max_attempts, 2);
    assert.equal(f.metadata.attempts[0].canonical_verdict.code, "host-tool-schema");
    assert.equal(f.metadata.attempts[0].canonical_verdict.ok, false);
    assert.equal(f.metadata.accepted_invocation.attempt, 2);
    const proof = f.metadata.attempts[0].known_grep_overflow_transport;
    const rawLines = f.raw.toString().match(/[^\n]*\n|[^\n]+$/g);
    assert.deepEqual(fs.readFileSync(path.join(f.directory, proof.projection_file)),
      Buffer.from(rawLines.filter((_, i) => !proof.omitted_lines.includes(i + 1)).join("")));
    assert.deepEqual(fs.readFileSync(path.join(f.directory, proof.omitted_file)),
      Buffer.from(rawLines.filter((_, i) => proof.omitted_lines.includes(i + 1)).join("")));
    assert.equal(fs.existsSync(path.join(f.directory, "model-response-attempt-3.txt")), false);
  });
}

const overflowMutationCases = [
  ["unknown overflow wording", e => { e.find(x => x.part.state?.status === "error").part.state.error = "output overflow"; }],
  ["read error", e => { e.find(x => x.part.state?.status === "error").part.tool = "read"; }],
  ["bash error", e => { e.find(x => x.part.state?.status === "error").part.tool = "bash"; }],
  ["permission denial", e => { e.find(x => x.part.state?.status === "error").part.state.error = "permission denied"; }],
  ["timeout", e => { e.find(x => x.part.state?.status === "error").part.state.error = "timeout"; }],
  ["auth error", e => { e.find(x => x.part.state?.status === "error").part.state.error = "authentication failure"; }],
  ["extra include input", e => { e.find(x => x.part.state?.status === "error").part.state.input.include = "*"; }],
  ["different path", e => { e.find(x => x.part.state?.status === "error").part.state.input.path = "/arbitrary"; }],
  ["different pattern", e => { e.find(x => x.part.state?.status === "error").part.state.input.pattern = "arbitrary"; }],
  ["completed status with explicit error", e => { e.find(x => x.part.state?.status === "error").part.state.status = "completed"; }],
  ["failure carries partial output", e => { e.find(x => x.part.state?.status === "error").part.state.output = "partial"; }],
  ["second HOST error", e => { const later=e.find(x => x.part.tool === "grep" && x.part.state.status === "completed");later.part.state.status="error";later.part.state.error="unknown"; }],
  ["missing failed call ID", e => { delete e.find(x => x.part.state?.status === "error").part.callID; }],
  ["blank failed call ID", e => { e.find(x => x.part.state?.status === "error").part.callID = " "; }],
  ["duplicate call ID", e => { e.find(x => x.part.state?.status === "error").part.callID = e[0].part.callID; }],
  ["duplicate part ID", e => { e.find(x => x.part.state?.status === "error").part.id = e[0].part.id; }],
  ["foreign native session", e => { e.find(x => x.part.state?.status === "error").part.sessionID = "ses_foreign"; }],
  ["missing message ID", e => { delete e.find(x => x.part.state?.status === "error").part.messageID; }],
  ["unsafe timestamp", e => { e.find(x => x.part.state?.status === "error").timestamp = 1e20; }],
  ["reversed time", e => { e.find(x => x.part.state?.status === "error").part.state.time.end = 1; }],
  ["future time", e => { const f=e.find(x => x.part.state?.status === "error"); f.part.state.time.end=f.timestamp+1; }],
  ["missing time", e => { delete e.find(x => x.part.state?.status === "error").part.state.time; }],
  ["failed review in later tail", e => { const c=e.find(x => x.part.state?.input?.stage === "publish");c.part.state.output=JSON.stringify({"ok?":false,error:"actual failed review"}); }],
  ["bad five-stage tail", e => { e.find(x => x.part.state?.input?.stage === "publish").part.state.input.stage = "map-change"; }],
  ["failed submit", e => { e.find(x => x.part.tool === "review_submit").part.state.output=JSON.stringify({"ok?":false,error:"actual submit failure"}); }],
  ["prose-only spoof", e => { const f=e.find(x => x.part.state?.status === "error");f.type="text";f.part={type:"text",id:f.part.id,messageID:f.part.messageID,sessionID:f.sessionID,text:JSON.stringify(f)}; }],
  ["nested-output spoof", e => { const f=e.find(x => x.part.state?.status === "error");f.part.tool="read";f.part.state={status:"completed",input:{},output:JSON.stringify(f),time:f.part.state.time}; }],
  ["unknown HOST in later tail", e => { e.find(x => x.part.tool === "grep" && x.part.state.status === "completed").part.tool="unknown_host"; }],
];
for (const [name, change] of overflowMutationCases) test(`known grep overflow candidate: denies ${name}`, async t => {
  const f = await overflowExercise(t, { change });
  if (name.endsWith("spoof")) {
    assert.ifError(f.error); assert.equal(f.metadata.accepted_invocation.attempt, 1);
    assert.equal(f.metadata.recovery_reason, null);
    assert.equal(f.metadata.attempts[0].known_grep_overflow_transport, undefined);
  } else { assert.ok(f.error, name); assert.equal(f.metadata.accepted_invocation, null); }
  assert.equal(f.invocations.length, 1);
  assert.deepEqual(fs.readFileSync(path.join(f.directory, "model-response-attempt-1.txt")), f.raw);
});

for (const [name, options] of [
  ["nonzero exit", { exitCode: 1 }], ["malformed submission", { malformed: true }], ["unexposed review_submit", { unexposed: true }],
  ["wrong original code", { originalVerdict: { code: "unknown" } }],
  ["original LAST violations", { originalVerdict: { violations: [{ id: 1 }] } }],
  ["derived unknown refusal", { derivedVerdict: { code: "unknown" } }],
  ["derived unexpected acceptance", { derivedVerdict: { ok: true, reason: null, reasonKind: null, sessionID: "ses_projection", acceptedInvocation: { sessionID: "ses_projection" } } }],
  ["derived LAST violations", { derivedVerdict: { violations: [{ id: 1 }] } }],
  ["derived callback fault", { derivedThrows: true }],
  ["derived file collision", { collision: "known-grep-overflow-attempt-1.DERIVED.ndjson" }],
  ["retained submission collision", { collision: "submission-attempt-1.json" }],
  ["response2 collision", { collision: "model-response-attempt-2.txt" }],
  ["response custody change", { mutateDuringDerived: d => fs.appendFileSync(path.join(d,"model-response-attempt-1.txt"),"mutated") }],
  ["stderr custody change", { mutateDuringDerived: d => fs.appendFileSync(path.join(d,"opencode-stderr-attempt-1.log"),"mutated") }],
  ["submission custody change", { mutateDuringDerived: d => fs.appendFileSync(path.join(d,"submission.json")," ") }],
  ["derived custody change", { mutateDuringDerived: d => fs.appendFileSync(path.join(d,"known-grep-overflow-attempt-1.DERIVED.ndjson")," ") }],
  ["omitted custody change", { mutateDuringDerived: d => fs.appendFileSync(path.join(d,"known-grep-overflow-attempt-1.OMITTED.ndjson")," ") }],
  ["context custody change", { mutateDuringDerived: (d,ctx) => {ctx.pageCount=2;} }],
]) test(`known grep overflow candidate: denies ${name} before retry`, async t => {
  const f = await overflowExercise(t, options); assert.ok(f.error);
  assert.equal(f.invocations.length,1); assert.equal(f.metadata.accepted_invocation,null);
  if(options.collision) assert.equal(fs.readFileSync(path.join(f.directory,options.collision),"utf8"),"retained collision sentinel");
});

for (const [name, options] of [
  ["same exact overflow", { secondFails: true }], ["missing submit", { secondMissing: true }],
  ["nonzero exit", { secondExit: 1 }], ["child rejection", { secondThrows: true }],
  ["same session", { sameSession: true }],
  ["retained first submission tampering", { mutateDuringSecond: d => fs.appendFileSync(path.join(d,"submission-attempt-1.json")," ") }],
  ["first stderr tampering", { mutateDuringSecond: d => fs.appendFileSync(path.join(d,"opencode-stderr-attempt-1.log"),"mutated") }],
  ["second stderr tampering", { mutateDuringSecond: d => fs.appendFileSync(path.join(d,"opencode-stderr-attempt-2.log"),"mutated") }],
]) test(`known grep overflow candidate: MAX2 rejects ${name} without a third process`, async t => {
  const f = await overflowExercise(t, options); assert.ok(f.error);
  assert.deepEqual(f.invocations.map(x=>x.attempt),[1,2]);
  assert.equal(f.metadata.accepted_invocation,null); assert.equal(f.metadata.max_attempts,2);
  assert.equal(fs.existsSync(path.join(f.directory,"model-response-attempt-3.txt")),false);
});

test("known grep overflow candidate: healthy completed review remains single process", async t => {
  const f = await overflowExercise(t, { healthy: true }); assert.ifError(f.error);
  assert.equal(f.invocations.length,1); assert.equal(f.checks.length,1);
  assert.equal(f.metadata.accepted_invocation.attempt,1); assert.equal(f.metadata.recovery_reason,null);
  assert.equal(f.metadata.attempts[0].known_grep_overflow_transport,undefined);
});

 test("known grep overflow candidate: pre-existing recognized failed history cannot authorize a new process", async t => {
  const f=await overflowExercise(t,{preexisting:true});assert.ok(f.error);
  assert.match(f.error.message,/pre-existing invocation evidence/);
  assert.equal(f.invocations.length,0);assert.equal(f.checks.length,0);
  assert.equal(f.metadata.accepted_invocation,null);assert.equal(f.metadata.recovery_reason,null);
  assert.equal(f.metadata.attempts[0].known_grep_overflow_transport,undefined);
  assert.deepEqual(fs.readFileSync(path.join(f.directory,"model-response-attempt-1.txt")),f.raw);
 });
