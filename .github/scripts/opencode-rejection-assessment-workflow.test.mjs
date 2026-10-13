// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const runner = path.join(root, ".github/scripts/run-opencode-review-recovery.mjs");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const tools = ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk",
  "review_record_evidence", "review_propose_finding", "review_classify_finding",
  "review_status", "review_submit"];
const stages = ["deterministic", "map-change", "generate-candidates", "adversarial-validate", "publish"];

// Existing native CLI fixtures use only an inert raw-catalog transport and executable.
const nativeDiscoveryFixtures = new WeakMap();
const nativeDiscoveryChildren = new WeakMap();
function runNativeDiscoveryFixture(fixture) {
  const discovery = nativeDiscoveryFixtures.get(fixture.env);
  assert.ok(discovery, "the inert native discovery fixture must be staged");
  const result = spawnSync(process.execPath, ["--import", discovery.loader, runner],
    { env: fixture.env, encoding: "utf8", timeout: 15000 });
  nativeDiscoveryChildren.set(result, discovery);
  return result;
}
function stageNativeDiscoveryFixture(directory, home, child, env) {
  const id = "mimo-v9.1-flash-free";
  const row = {id,providerID:"opencode",family:"mimo",status:"active",release_date:"2027-01-01",
    api:{id,url:"https://example.invalid/inert",npm:"@ai-sdk/openai-compatible"},
    capabilities:{toolcall:true,input:{text:true},output:{text:true}},cost:{input:0,output:0,cache:{read:0,write:0}}};
  const raw = {opencode:{id:"opencode",api:row.api.url,npm:row.api.npm,models:{[id]:{id,family:"mimo",status:"active",
    release_date:row.release_date,tool_call:true,modalities:{input:["text"],output:["text"]},
    cost:{input:0,output:0,cache_read:0,cache_write:0}}}}};
  fs.mkdirSync(path.join(home,"tmp"),{mode:0o700});
  for (const [relative,bytes] of [["opencode.json",'{"trusted":"inert native CLI fixture"}\n'],
    ["agents/github-reviewer.md","inert native CLI fixture\n"],["plugins/eta-mu-actors.js","// inert native CLI fixture\n"]]) {
    const file=path.join(home,".config/opencode",relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);
  }
  const match=/^--require ("[^"]+"|\/[^ \t\r\n]+)$/.exec(process.env.NODE_OPTIONS??"");
  assert.ok(match,"one actual parent-loaded audit preload is required");
  const preload=match[1].startsWith('"')?JSON.parse(match[1]):match[1];
  const require=createRequire(import.meta.url);assert.ok(path.isAbsolute(preload)&&require.cache[preload]);
  assert.equal(digest(fs.readFileSync(preload)),"5b32fe4ce6f892715502275f345846b363118fe629dc2c2c0ef8bbbacfe9c5bf");
  const auditDirectory=process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR,capture=process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE;
  assert.ok(auditDirectory&&capture);const auditInfo=fs.lstatSync(auditDirectory);
  assert.ok(auditInfo.isDirectory()&&!auditInfo.isSymbolicLink()&&fs.realpathSync(auditDirectory)===auditDirectory);
  assert.equal(auditInfo.mode&0o777,0o700);assert.equal(auditInfo.uid,process.getuid());
  const identities=path.join(directory,"discovery-children.ndjson"),loader=path.join(directory,"inert-catalog-loader.mjs");
  fs.writeFileSync(loader,`globalThis.fetch=async(url,options)=>{if(url!=="https://models.opencode.ai/api.json"||options.redirect!=="error"||options.credentials!=="omit")throw Error("INERT_FETCH_CONTRACT");const r=new Response(${JSON.stringify(JSON.stringify(raw))},{status:200});Object.defineProperty(r,"url",{value:url});return r;};\n`,{flag:"wx",mode:0o600});
  const source=fs.readFileSync(child,"utf8"),anchor='const fs=require("node:fs");\n';assert.equal(source.split(anchor).length,2);
  const enrollment=`process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR=${JSON.stringify(auditDirectory)};process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE=${JSON.stringify(capture)};const preload=${JSON.stringify(preload)};if(require('node:crypto').createHash('sha256').update(fs.readFileSync(preload)).digest('hex')!=="5b32fe4ce6f892715502275f345846b363118fe629dc2c2c0ef8bbbacfe9c5bf")throw Error("TEST_PRELOAD_BYTES_REFUSED");require(preload);fs.appendFileSync(${JSON.stringify(identities)},JSON.stringify({pid:process.pid,parentPid:process.ppid,argv:process.argv.slice(2)})+'\\n');\nif(process.argv[2]==="--version"){process.stdout.write("1.18.18\\n");process.exit(0);}if(process.argv[2]==="models"){process.stdout.write(${JSON.stringify(`opencode/${id}\n${JSON.stringify(row)}\n`)});process.exit(0);}\n`;
  fs.writeFileSync(child,source.replace(anchor,anchor+enrollment));
  Object.assign(env,{REVIEW_MODEL_DISCOVERY:"opencode-free-mimo-flash-v1",REVIEW_EXPECTED_OPENCODE_VERSION:"1.18.18",REVIEW_MODEL:""});
  nativeDiscoveryFixtures.set(env,{loader,identities,auditDirectory,capture});
}

function childNetworkAudit(child) {
  const directory = process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR;
  assert.ok(directory, "the controlled early network blocker is required");
  const audit = JSON.parse(fs.readFileSync(path.join(directory, `${child.pid}.json`), "utf8"));
  assert.equal(audit.schema, "eta-mu.test-network-denial/v1");
  assert.equal(audit.capture, process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE);
  assert.equal(audit.pid, child.pid);
  assert.equal(audit.deniedAttempts, 0);

  const fixture=nativeDiscoveryChildren.get(child);
  if (fixture && fs.existsSync(fixture.identities)) {
    const identities=fs.readFileSync(fixture.identities,"utf8").trim().split("\n").map(JSON.parse);
    assert.equal(new Set(identities.map(row=>row.pid)).size,identities.length);
    for (const identity of identities) {
      assert.equal(identity.parentPid,child.pid);assert.ok(Number.isSafeInteger(identity.pid)&&identity.pid>0);
      const file=path.join(fixture.auditDirectory,`${identity.pid}.json`),info=fs.lstatSync(file);
      assert.ok(info.isFile()&&!info.isSymbolicLink()&&fs.realpathSync(file)===file);
      assert.equal(info.mode&0o777,0o600);assert.equal(info.uid,process.getuid());
      const record=JSON.parse(fs.readFileSync(file,"utf8"));
      assert.equal(record.schema,"eta-mu.test-network-denial/v1");assert.equal(record.capture,fixture.capture);
      assert.equal(record.pid,identity.pid);assert.equal(record.parentPid,child.pid);assert.equal(record.deniedAttempts,0);
      assert.ok(record.kernelAncestry.some(row=>row.pid===identity.pid&&row.parentPid===child.pid&&/^[0-9]+$/.test(row.startTicks)));
      assert.ok(record.kernelAncestry.some(row=>row.pid===child.pid&&row.parentPid===process.pid));
    }
  }
}

/** Stage inert host events, checked by the actual selected source-built Muse export. */
function nativeFixture(t, { legacy = true, partial = false, finalCoverage = false, decoyLegacy = false } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-assessment-host-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const verifierFile = process.env.ETA_MU_REJECTION_VERIFIER_FILE;
  const verifierSha = process.env.ETA_MU_REJECTION_VERIFIER_SHA256;
  assert.ok(verifierFile && path.isAbsolute(verifierFile), "source-built Muse verifier is required");
  assert.match(verifierSha || "", /^[0-9a-f]{64}$/);
  assert.equal(digest(fs.readFileSync(verifierFile)), verifierSha);
  const verifier = createRequire(import.meta.url)(verifierFile);
  const full = Buffer.from(JSON.stringify({ fixture: "inert full native carrier; no native or model call",
    body: "original body ημ 😀\nquoted context retained as data", source: "selected source\n".repeat(1100) }));
  const source = { schema: "open-hax.rejection-assessment-input/v1", purpose: "rejection-assessment",
    head_sha: "b".repeat(40), context_sha256: "c".repeat(64), proposal_id: 71,
    proposal_body_sha256: "d".repeat(64), source_inventory_sha256: "e".repeat(64),
    target: { repository_id: "R_fixture", repository_database_id: 3, pr_id: "PR_fixture",
      pr_number: 1, thread_id: "PRRT_fixture", root_comment_id: 7 },
    full_input: { path: "rejection-assessment-input.txt", bytes: full.length, sha256: digest(full) },
    provenance: { repository: "synthetic/native-context", pull_request: "1", run_id: "2", run_attempt: "1",
      workflow_sha: "d".repeat(40), workflow_ref: "synthetic/native-context/workflow@refs/heads/main" } };
  const submissionFile = path.join(directory, "submission.json");
  const manifest = Buffer.from(JSON.stringify(source));
  const context = verifier.prepareReviewInvocationContext(full, manifest, tools, submissionFile);
  const text = full.toString("utf8");
  const notes = context.pages.map((page) => ({ ...page, note: `Synthetic complete carrier page ${page.id}.` }));
  const body = { schema: "open-hax.github-review/v1", event: "COMMENT", comments: [],
    summary: "Synthetic carrier only; no native assessment or publication.", "input-source": source,
    "input-coverage": { chunks: notes.length, delivered: notes.length, assessed: notes.length, missing: [] },
    "input-assessments": notes };
  const events = [];
  const sessionID = "session-native-carrier-fixture";
  const call = (tool, input, output) => {
    const n = events.length + 1;
    events.push({ type: "tool_use", timestamp: n, sessionID,
      part: { type: "tool", id: `part-${n}`, callID: `call-${n}`, sessionID, tool,
        state: { status: "completed", input, output: JSON.stringify(output) } } });
  };
  call("review_begin", {}, { "ok?": true, stage: stages[0], stages, "input-source": source,
    "diff-stats": { files: 1, bytes: text.length, "truncated?": false },
    "input-coverage": { chunks: notes.length, delivered: 0, assessed: 0, missing: notes.map((p) => p.id) } });
  for (const [i, page] of context.pages.entries()) {
    call("review_read_diff_chunk", { id: page.id }, { "ok?": true,
      chunk: { ...page, text: text.slice(page.start, page.end) } });
    call("review_assess_diff_chunk", { id: page.id, note: notes[i].note }, { "ok?": true, "chunk-id": page.id,
      coverage: { chunks: notes.length, delivered: i + 1, assessed: i + 1,
        missing: notes.slice(i + 1).map((p) => p.id) } });
  }
  for (const stage of stages) call("review_record_evidence", { stage, note: "Synthetic complete stage." }, { "ok?": true });
  call("review_submit", { summary: body.summary }, { "ok?": true, event: "COMMENT", file: submissionFile, "inline-comments": 0 });
  events.push({ type: "step_finish", timestamp: events.length + 1, sessionID,
    part: { type: "step-finish", id: "part-stop", sessionID, reason: "stop" } });
  const response = events.map((event) => JSON.stringify(event)).join("\n") + "\n";
  assert.equal(verifier.verifyReviewInvocation(response, JSON.stringify(body), context).ok, true);
  let firstResponse = response;
  if (finalCoverage) {
    const prefix = events.filter((event) => event.type === "tool_use" &&
      event.part.tool !== "review_submit" &&
      !(event.part.tool === "review_assess_diff_chunk" && event.part.state.input.id === notes.length) &&
      event.part.tool !== "review_record_evidence");
    const n = events.length + 1;
    const omitted = { type: "tool_use", timestamp: n, sessionID,
      part: { type: "tool", id: `part-${n}`, callID: `call-${n}`, sessionID, tool: "review_record_evidence",
        state: { status: "completed", input: { stage: "deterministic", note: "Synthetic final-page omission." },
          output: JSON.stringify({ "ok?": false,
            error: `Unassessed full-input chunks remain: ${notes.length}. Read and assess every changed hunk before publishing.` }),
          metadata: { truncated: false } } } };
    const stop = { type: "step_finish", timestamp: n + 1, sessionID,
      part: { type: "step-finish", id: "part-stop", sessionID, reason: "stop" } };
    firstResponse = [...prefix, omitted, stop].map((event) => JSON.stringify(event)).join("\n") + "\n";
    const original = verifier.verifyReviewInvocation(firstResponse, null, context);
    assert.equal(original.ok, false); assert.equal(original.code, "stage-order");
    const projected = verifier.verifyReviewInvocation([...prefix, stop].map((event) => JSON.stringify(event)).join("\n") + "\n", null, context);
    assert.equal(projected.ok, false); assert.equal(projected.code, "healthy-unfinished-review");
    assert.equal(projected.reason, "missing-review-submit");
  }
  fs.writeFileSync(path.join(directory, "rejection-assessment-input.txt"), partial ? full.subarray(0, 10) : full);
  if (legacy) fs.writeFileSync(path.join(directory, "basehead.diff"), decoyLegacy ? "unrelated legacy bytes" : full);
  fs.writeFileSync(path.join(directory, "input-manifest.json"), manifest);
  const home = path.join(directory, "model-home");
  fs.mkdirSync(home, { mode: 0o700 });
  const probe = path.join(directory, "child-environment.json");
  const prompts = path.join(directory, "child-prompts.json");
  const child = path.join(directory, "fixture-child.cjs");
  fs.writeFileSync(child, `#!${process.execPath}\nconst fs=require("node:fs");\n`
    + `const prompts=${JSON.stringify(prompts)}; const previous=fs.existsSync(prompts)?JSON.parse(fs.readFileSync(prompts,"utf8")):[]; fs.writeFileSync(prompts,JSON.stringify([...previous,process.argv.at(-1)]));\n`
    + `fs.writeFileSync(${JSON.stringify(probe)}, JSON.stringify({HOME:process.env.HOME,`
    + `GH_TOKEN:process.env.GH_TOKEN,GITHUB_TOKEN:process.env.GITHUB_TOKEN,NODE_OPTIONS:process.env.NODE_OPTIONS,`
    + `GITHUB_OUTPUT:process.env.GITHUB_OUTPUT,OPENAI_API_KEY:process.env.OPENAI_API_KEY,`
    + `ETA_MU_APP_PRIVATE_KEY:process.env.ETA_MU_APP_PRIVATE_KEY}));\n`
    + (finalCoverage
      ? `const counter=${JSON.stringify(path.join(directory, "invocations.txt"))}; const attempt=fs.existsSync(counter)?Number(fs.readFileSync(counter,"utf8"))+1:1; fs.writeFileSync(counter,String(attempt));\n`
        + `if(attempt===1){process.stdout.write(${JSON.stringify(firstResponse)});}else{fs.writeFileSync(${JSON.stringify(submissionFile)},${JSON.stringify(JSON.stringify(body))});process.stdout.write(${JSON.stringify(response)}); }\n`
      : `fs.writeFileSync(${JSON.stringify(submissionFile)},${JSON.stringify(JSON.stringify(body))});\n`
        + `process.stdout.write(${JSON.stringify(response)});\n`), { mode: 0o700 });
  const output = path.join(directory, "outputs");
  const prompt = path.join(directory, "prompt.txt");
  const registry = path.join(directory, "tools.txt");
  fs.writeFileSync(output, ""); fs.writeFileSync(prompt, "Assess complete inert native carrier for {{PR_NUMBER}}.");
  fs.writeFileSync(registry, tools.join("\n") + "\n");
  const env = { ...process.env, PR_NUMBER: "1", REVIEW_PROMPT_FILE: prompt,
    REVIEW_EVIDENCE_DIR: directory, REVIEW_INVOCATION_VERIFIER_FILE: verifierFile,
    REVIEW_TOOL_REGISTRY_FILE: registry, GITHUB_OUTPUT: output,
    REVIEW_INPUT_PURPOSE: "rejection-assessment", REVIEW_CHILD_HOME: home,
    REVIEW_MODEL: "opencode/mimo-v2.6-flash-free", OPENCODE_BIN: child,
    GH_TOKEN: "inert-token-sentinel", GITHUB_TOKEN: "inert-other-sentinel",
    OPENAI_API_KEY: "inert-provider-sentinel", ETA_MU_APP_PRIVATE_KEY: "inert-app-sentinel" };
  stageNativeDiscoveryFixture(directory, home, child, env);
  return { directory, home, probe, prompts, env, verifier, context };
}

test("actual canonical runner accepts only the complete fixed native file", (t) => {
  const fixture = nativeFixture(t, { legacy: false });
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 0, "valid native purpose must not require basehead.diff");
  const recovery = JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json")));
  assert.equal(recovery.accepted_invocation.canonical_verdict.ok, true);
  assert.equal(recovery.attempts.length, 1, "healthy actual trace has no second invocation");
});

test("final native page omission recovers once using only the exact rejection-assessment input", (t) => {
  for (const options of [{ legacy: false }, { legacy: true, decoyLegacy: true }]) {
    const fixture = nativeFixture(t, { ...options, finalCoverage: true });
    const child = runNativeDiscoveryFixture(fixture);
    childNetworkAudit(child);
    assert.equal(child.status, 0, child.stderr);
    const recovery = JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json")));
    assert.equal(recovery.recovery_reason, "final_input_coverage");
    assert.equal(recovery.attempts.length, 2);
    assert.equal(recovery.attempts[0].canonical_verdict.ok, false, "original stopped trace stays refused");
    assert.equal(recovery.attempts[0].final_input_coverage.accepted_review, false);
    assert.equal(recovery.attempts[0].final_input_coverage.verification_state, "returned");
    assert.equal(recovery.attempts[0].final_input_coverage.full_input_sha256, fixture.context.fullInputSha256);
    assert.equal(recovery.accepted_invocation.attempt, 2);
    assert.equal(recovery.accepted_invocation.canonical_verdict.ok, true);
    assert.equal(fs.readFileSync(path.join(fixture.directory, "invocations.txt"), "utf8"), "2");
  }
});


/** Actual first/corrective prompt composition; no supporting file or gate is invented. */
test("native first and corrective prompts name only the staged rejection input", (t) => {
  for (const finalCoverage of [false, true]) {
    const fixture = nativeFixture(t, { legacy: false, finalCoverage });
    assert.equal(fs.existsSync(path.join(fixture.directory, "summary.json")), false);
    assert.equal(fs.existsSync(path.join(fixture.directory, "deterministic.log")), false);
    const child = runNativeDiscoveryFixture(fixture);
    childNetworkAudit(child);
    assert.equal(child.status, 0, child.stderr);
    const prompts = JSON.parse(fs.readFileSync(fixture.prompts, "utf8"));
    assert.equal(prompts.length, finalCoverage ? 2 : 1);
    for (const prompt of prompts) {
      assert.match(prompt, /Complete fixed native input: rejection-assessment-input\.txt/);
      assert.match(prompt, /only the review_\* page tools/);
      assert.doesNotMatch(prompt, /summary\.json|deterministic\.log|\.opencode\/review-evidence/);
      assert.match(prompt, /Every review tool call must succeed/);
      assert.match(prompt, /No ordinary diff supporting-file artifacts are staged/);
    }
  }
});

test("a complete legacy file cannot replace a partial native file", (t) => {
  const fixture = nativeFixture(t, { partial: true });
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 1);
  assert.equal(fs.existsSync(fixture.probe), false, "invalid bytes refuse before the child");
  assert.equal(JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json"))).accepted_invocation, null);
});

test("rejection-assessment child uses its fresh home and receives no host credentials", (t) => {
  const fixture = nativeFixture(t);
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 0);
  const probe = JSON.parse(fs.readFileSync(fixture.probe));
  assert.equal(Object.hasOwn(probe, "GH_TOKEN"), false);
  assert.equal(Object.hasOwn(probe, "GITHUB_TOKEN"), false);
  assert.equal(probe.HOME, fixture.home);
  assert.equal(Object.hasOwn(probe, "GITHUB_OUTPUT"), false);
  assert.equal(Object.hasOwn(probe, "OPENAI_API_KEY"), false);
  assert.equal(Object.hasOwn(probe, "ETA_MU_APP_PRIVATE_KEY"), false);
});

test("unknown purpose and nonprivate or redirected model home refuse before the child", (t) => {
  for (const variant of ["purpose", "mode", "symlink"]) {
    const fixture = nativeFixture(t);
    if (variant === "purpose") fixture.env.REVIEW_INPUT_PURPOSE = "unknown";
    if (variant === "mode") fs.chmodSync(fixture.home, 0o755);
    if (variant === "symlink") {
      const alias = path.join(fixture.directory, "home-alias");
      fs.symlinkSync(fixture.home, alias);
      fixture.env.REVIEW_CHILD_HOME = alias;
    }
    const child = runNativeDiscoveryFixture(fixture);
    childNetworkAudit(child);
    assert.equal(child.status, 1);
    assert.equal(fs.existsSync(fixture.probe), false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json"))).accepted_invocation, null);
  }
});

const workflowFile = path.join(root, ".github/workflows/opencode-rejection-assessment.yml");
const workflow = (await import("yaml")).parse(fs.readFileSync(workflowFile, "utf8"));

test("actual protected canonical API and Muse pins are identical across both routes", () => {
  assert.ok(workflow.on.workflow_call && workflow.on.workflow_dispatch);
  assert.equal(workflow.env.CANONICAL_REVISION, "5cea3e51a15d19277bd642147292c11b82de5369");
  assert.equal(workflow.env.MUSE_REVISION, "b7e4f98f550780a7b484b1525f53ad2934e29dad");
  assert.equal(workflow.env.ETA_SOURCE_SHA, "${{ inputs.eta_revision || github.workflow_sha }}");
  assert.equal(workflow.env.REJECTION_CALLED_REVISION, "${{ inputs.eta_revision }}");
  assert.equal(workflow.on.workflow_call.inputs.eta_revision.required, true);
  assert.equal(Object.hasOwn(workflow.on.workflow_dispatch.inputs, "eta_revision"), false);
  for (const route of [workflow.on.workflow_call, workflow.on.workflow_dispatch]) {
    for (const name of ["root_comment_id", "history_source_sha256", "history_cli_sha256"])
      assert.equal(route.inputs[name].required, true);
  }
  const hostEntry = fs.readFileSync(path.join(root, ".github/scripts/opencode_rejection_assessment.cljs"), "utf8");
  assert.match(hostEntry, /direct\? \(or \(nil\? called-revision\) \(= "" called-revision\)\)/);
  assert.match(hostEntry, /:eta-revision eta-revision :direct\? direct\?/);
  const infra = fs.readFileSync(path.join(root, "packages/eta-mu/src/cljs/eta_mu/infra/rejection_assessment.cljs"), "utf8");
  assert.match(infra, /dependency-pins \{:canonical "5cea3e51a15d19277bd642147292c11b82de5369" :muse "b7e4f98f550780a7b484b1525f53ad2934e29dad"\}/);
  const guard = workflow.jobs.prepare.steps[0].run;
  // Exact protected source pins below do not grant native/history authority for inert scope hashes.
  const runPins = (changes = {}) => spawnSync("bash", ["-c", guard], { encoding: "utf8", timeout: 15000,
    env: { PATH: process.env.PATH, TARGET_REPOSITORY: "open-hax/eta-mu", TIMEOUT_INPUT: "60",
      CANONICAL_REVISION: workflow.env.CANONICAL_REVISION, MUSE_REVISION: workflow.env.MUSE_REVISION,
      REJECTION_HISTORY_SOURCE_SHA256: "e".repeat(64), REJECTION_HISTORY_CLI_SHA256: "f".repeat(64), ...changes } });
  assert.equal(runPins().status, 0);
  for (const value of ["", "60.5", "not-a-number", "1e2", "59", "181"]) {
    const refused = runPins({ TIMEOUT_INPUT: value });
    assert.notEqual(refused.status, 0, `invalid time budget must refuse: ${value}`);
    assert.match(refused.stdout, /review_timeout_minutes must be a whole number from 60 through 180/);
  }
  for (const value of ["60", "180"]) assert.equal(runPins({ TIMEOUT_INPUT: value }).status, 0);
  for (const changes of [{ CANONICAL_REVISION: "" }, { MUSE_REVISION: "" },
    { CANONICAL_REVISION: "main" }, { MUSE_REVISION: "malformed" },
    { CANONICAL_REVISION: "a".repeat(39) }, { MUSE_REVISION: "A".repeat(40) },
    { REJECTION_HISTORY_SOURCE_SHA256: "" }, { REJECTION_HISTORY_CLI_SHA256: "unknown" }])
    assert.notEqual(runPins(changes).status, 0, "missing or malformed source bindings refuse before setup");
  assert.equal(workflow.concurrency["cancel-in-progress"], false);
  assert.deepEqual(Object.keys(workflow.jobs), ["prepare", "assess", "publish"]);
  assert.match(guard, /TIMEOUT_INPUT >= 60.*TIMEOUT_INPUT <= 180/);
  assert.equal(workflow.on.workflow_call.inputs.review_timeout_minutes.default, 60);
  assert.match(workflow.jobs.assess["timeout-minutes"], /> 180 && 180/);
  assert.equal(workflow.env.REJECTION_HISTORY_SOURCE_KIND, "protected-checkout");
  assert.match(workflow.env.REJECTION_HISTORY_SOURCE_FILE, /canonical\/\.ημ\/receipts\.edn$/);
  assert.match(workflow.env.REJECTION_HISTORY_CLI_FILE, /canonical\/skills\/pr-flow\/scripts\/pr\.cljs$/);
});

test("target-native read credentials remain separate from protected publication", () => {
  for (const job of [workflow.jobs.prepare, workflow.jobs.assess]) {
    const sourceGuard = job.steps.findIndex((step) => step.name === "Authenticate protected called source before checkout");
    const publicGuard = job.steps.findIndex((step) => step.name === "Require public native target before checkout");
    const readIndex = job.steps.findIndex((step) => step.id === "target_reader");
    assert.ok(sourceGuard >= 0 && sourceGuard < publicGuard && publicGuard < readIndex);
    const reader = job.steps[readIndex];
    assert.equal(reader.uses, "actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1");
    assert.equal(reader.with.owner, "open-hax");
    assert.equal(reader.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
    assert.deepEqual(Object.fromEntries(Object.entries(reader.with).filter(([key]) => key.startsWith("permission-"))),
      { "permission-metadata": "read", "permission-pull-requests": "read", "permission-issues": "read" });
    assert.equal(reader.with["app-id"], "${{ secrets.ETA_MU_APP_ID }}");
    assert.equal(reader.with["private-key"], "${{ secrets.ETA_MU_APP_PRIVATE_KEY }}");
    const nativeSteps = job.steps.filter((step) => ["Fresh native collection and immutable source input",
      "Bind staged input before model execution", "Reverify actual accepted invocation and fresh custody"].includes(step.name));
    assert.equal(nativeSteps.length, job === workflow.jobs.prepare ? 1 : 2);
    for (const step of nativeSteps) {
      assert.equal(step.env.GH_TOKEN, "${{ steps.target_reader.outputs.token }}", "target author permission reads use the target installation");
      assert.equal(step.env.HOST_RUN_READ_TOKEN, "${{ github.token }}", "owning workflow provenance retains its own read token");
      assert.ok(readIndex < job.steps.indexOf(step));
    }
    for (const step of job.steps.filter((step) => step !== reader))
      assert.equal(JSON.stringify(step).includes("secrets.ETA_MU_APP"), false, "the read-token mint is the only earlier App secret consumer");
    assert.equal(JSON.stringify(job.outputs || {}).includes("target_reader"), false, "read tokens never cross jobs as outputs");
  }
  assert.equal(workflow.jobs.publish.environment, "rejection-assessment-publication");
  const token = workflow.jobs.publish.steps.find((step) => step.id === "publisher");
  assert.equal(token.uses, "actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1");
  assert.equal(token.with["permission-issues"], "write");
  const write = workflow.jobs.publish.steps.find((step) => step.name?.startsWith("Fresh canonical eligibility"));
  assert.match(write.env.ACTIONABILITY_INSTALLATION_ID, /outputs.installation-id/);
  assert.match(write.env.ACTIONABILITY_APP_SLUG, /outputs.app-slug/);
  assert.match(write.env.ACCEPTED_INVOCATION_SHA256, /needs.assess.outputs.accepted_sha256/);
  assert.match(write.env.HOST_RUN_READ_TOKEN, /github.token/);
  assert.match(write.env.PREPARED_INPUT_SHA256, /needs.prepare.outputs.input_sha256/);
  assert.match(write.env.PREPARED_PROFILE_SHA256, /needs.prepare.outputs.profile_sha256/);
  assert.match(write.run, /opencode_rejection_assessment.cljs.*publish/);
  assert.ok(write.env.PUBLICATION_RESULT_FILE);
  assert.doesNotMatch(write.run, /publish\s*>/);
  const observed = workflow.jobs.publish.steps.find((step) => step.uses?.startsWith("actions/upload-artifact@"));
  assert.equal(observed.if, "always()");
  assert.equal(JSON.stringify(workflow).includes("publish-opencode-review"), false);
  assert.equal(JSON.stringify(workflow).includes("resolveReviewThread"), false);
});

test("actual model step is credential-free with independent input and result bindings", () => {
  const model = workflow.jobs.assess.steps.find((step) => step.id === "assess");
  assert.equal(model.env.REVIEW_INPUT_PURPOSE, "rejection-assessment");
  assert.match(model.env.REVIEW_CHILD_HOME, /rejection-assessment-model-home/);
  assert.equal(Object.keys(model.env).some((key) => /TOKEN|KEY|SECRET/.test(key)), false);
  assert.equal(model["working-directory"], ".rejection-assessment/model-root");
  assert.equal(workflow.jobs.assess.outputs.accepted_sha256, "${{ steps.assess.outputs.review_invocation_sha256 }}");
  const verify = workflow.jobs.assess.steps.find((step) => step.name === "Reverify actual accepted invocation and fresh custody");
  assert.match(verify.env.REVIEW_INVOCATION_VERIFIER_SHA256, /needs.prepare.outputs.verifier_sha256/);
  for (const job of Object.values(workflow.jobs)) {
    for (const step of job.steps.filter((step) => step.uses?.startsWith("actions/checkout@"))) {
      assert.equal(step.with["persist-credentials"], false);
    }
  }
});

test("authored bootstrap authenticates source before every checkout on both routes", (t) => {
  const contextDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-job-identity-"));
  t.after(() => fs.rmSync(contextDirectory, { recursive: true, force: true }));
  const guards = Object.values(workflow.jobs).map((job) => {
    const index = job.steps.findIndex((step) => step.name === "Authenticate protected called source before checkout");
    const checkout = job.steps.findIndex((step) => step.uses?.startsWith("actions/checkout@"));
    assert.ok(index >= 0 && index < checkout);
    return job.steps[index].run;
  });
  assert.equal(new Set(guards).size, 1, "same source bootstrap on all three jobs");
  const sha = "d".repeat(40);
  const env = { ...process.env, ETA_SOURCE_SHA: sha, GITHUB_REPOSITORY: "open-hax/eta-mu", GITHUB_RUN_ID: "31",
    REJECTION_JOB_WORKFLOW_SHA: sha,
    REJECTION_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main",
    REJECTION_JOB_CHECK_RUN_ID: "103", REJECTION_PREPARE_CHECK_RUN_ID: "101",
    GITHUB_ENV: path.join(contextDirectory, "github-env"),
    GITHUB_RUN_ATTEMPT: "1", GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_WORKFLOW_SHA: sha, REJECTION_CALLED_REVISION: "",
    GITHUB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main",
    TEST_BRANCH_JSON: JSON.stringify({ protected: true, commit: { sha } }),
    TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1, head_sha: sha, repository: { full_name: "open-hax/eta-mu" },
      referenced_workflows: [{ sha, path: `open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@${sha}` }] }),
    TEST_COMPARE_STATUS: "identical",
    "BASH_FUNC_gh%%": '() { case "$2" in repos/open-hax/eta-mu) printf "%s\\n" main;; repos/open-hax/eta-mu/branches/main) printf "%s\\n" "$TEST_BRANCH_JSON";; repos/open-hax/eta-mu/actions/runs/31|repos/open-hax/knoxx/actions/runs/31) printf "%s\\n" "$TEST_RUN_JSON";; repos/open-hax/eta-mu/compare/*) printf "%s\\n" "$TEST_COMPARE_STATUS";; *) return 97;; esac; }' };
  const run = (changes = {}) => spawnSync("bash", ["-c", guards[0]], { env: { ...env, ...changes }, encoding: "utf8", timeout: 15000 });
  assert.equal(run().status, 0, "inert native default-branch source admits");
  assert.equal(run({ GITHUB_EVENT_NAME: "pull_request", REJECTION_CALLED_REVISION: sha }).status, 0, "inert called exact referenced source admits");
  for (const changes of [
    { REJECTION_JOB_WORKFLOW_SHA: "e".repeat(40) },
    { REJECTION_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/sibling.yml@refs/heads/main" },
    { REJECTION_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@" },
    { REJECTION_JOB_WORKFLOW_SHA: "" },
  ]) {
    const effects = path.join(contextDirectory, `mismatch-${Object.keys(changes)[0]}-${Object.values(changes)[0].length}.txt`);
    const child = spawnSync("bash", ["-c", `${guards[0]}\nprintf 'checkout-reached\n' >> "$TEST_EFFECTS"\n`],
      { env: { ...env, GITHUB_EVENT_NAME: "pull_request", REJECTION_CALLED_REVISION: sha,
        ...changes, TEST_EFFECTS: effects,
        "BASH_FUNC_gh%%": env["BASH_FUNC_gh%%"].replace("() {", '() { printf "native-read\\n" >> "$TEST_EFFECTS";') },
        encoding: "utf8", timeout: 15000 });
    assert.equal(child.status, 1, "a sibling aggregate does not authenticate this job");
    assert.equal(fs.existsSync(effects), false, "mismatch refuses before source reads or modeled checkout");
  }
  const manuallyCalled = { REJECTION_CALLED_REVISION: sha, GITHUB_REPOSITORY: "open-hax/knoxx",
    GITHUB_WORKFLOW_SHA: "e".repeat(40), GITHUB_WORKFLOW_REF: "open-hax/knoxx/.github/workflows/caller.yml@refs/heads/main",
    TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1, head_sha: "f".repeat(40), repository: { full_name: "open-hax/knoxx" },
      referenced_workflows: [{ sha, path: `open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@${sha}` }] }) };
  assert.notEqual(run(manuallyCalled).status, 0, "foreign callers must dispatch in the owning repository");
  for (const job of Object.values(workflow.jobs)) {
    const authored = job.steps.find((step) => step.name === "Authenticate protected called source before checkout").run;
    const effectsDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-foreign-publication-"));
    const effects = path.join(effectsDirectory, "effects.txt");
    try {
      const foreign = spawnSync("bash", ["-c", `${authored}\nprintf 'publication-reached\n' >> "$TEST_EFFECTS"\n`],
        { env: { ...env, ...manuallyCalled, TEST_EFFECTS: effects,
          "BASH_FUNC_gh%%": '() { printf "native-read\\n" >> "$TEST_EFFECTS"; return 97; }' },
          encoding: "utf8", timeout: 15000 });
      assert.equal(foreign.status, 1);
      assert.equal(fs.existsSync(effects), false, "foreign owner refuses before native reads or modeled publication");
      assert.match(foreign.stdout, /share its publication lock/);
    } finally { fs.rmSync(effectsDirectory, { recursive: true, force: true }); }
  }
  assert.notEqual(run({ ...manuallyCalled, REJECTION_CALLED_REVISION: "" }).status, 0);
  assert.notEqual(run({ ...manuallyCalled, REJECTION_CALLED_REVISION: "malformed" }).status, 0);
  assert.notEqual(run({ ...manuallyCalled, REJECTION_CALLED_REVISION: "e".repeat(40) }).status, 0);
  assert.notEqual(run({ ...manuallyCalled, TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1,
    repository: { full_name: "open-hax/knoxx" }, referenced_workflows: [] }) }).status, 0);
  for (const changes of [
    { GITHUB_WORKFLOW_REF: env.GITHUB_WORKFLOW_REF.replace("/main", "/feature") },
    { TEST_BRANCH_JSON: JSON.stringify({ protected: false, commit: { sha } }) },
    { GITHUB_RUN_ATTEMPT: "2" },
    { ETA_SOURCE_SHA: "e".repeat(40) },
    { GITHUB_EVENT_NAME: "pull_request", REJECTION_CALLED_REVISION: sha, TEST_COMPARE_STATUS: "diverged" },
    { GITHUB_EVENT_NAME: "pull_request", REJECTION_CALLED_REVISION: sha, TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1, repository: { full_name: "open-hax/eta-mu" }, referenced_workflows: [] }) },
  ]) assert.notEqual(run(changes).status, 0, "untrusted source refuses before checkout");
});


test("every job refuses reruns before native reads and later artifact or token steps", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-assessment-attempt-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const sha = "d".repeat(40);
  const inputUpload = "rejection-assessment-input-${{ github.run_id }}-${{ github.run_attempt }}-${{ job.check_run_id }}";
  const profileUpload = "rejection-assessment-profile-${{ github.run_id }}-${{ github.run_attempt }}-${{ job.check_run_id }}";
  const inputName = "rejection-assessment-input-${{ github.run_id }}-${{ github.run_attempt }}-${{ needs.prepare.outputs.invocation_id }}";
  const profileName = "rejection-assessment-profile-${{ github.run_id }}-${{ github.run_attempt }}-${{ needs.prepare.outputs.invocation_id }}";
  const resultName = "rejection-assessment-result-${{ github.run_id }}-${{ github.run_attempt }}-${{ needs.prepare.outputs.invocation_id }}";
  const uploads = (job) => job.steps.filter((step) => step.uses?.startsWith("actions/upload-artifact@"));
  const downloads = (job) => job.steps.filter((step) => step.uses?.startsWith("actions/download-artifact@"));
  assert.deepEqual(uploads(workflow.jobs.prepare).map((step) => step.with.name), [inputUpload, profileUpload]);
  assert.deepEqual(downloads(workflow.jobs.assess).map((step) => step.with.name), [inputName, profileName]);
  assert.ok(uploads(workflow.jobs.assess).some((step) => step.with.name === resultName));
  assert.deepEqual(downloads(workflow.jobs.publish).map((step) => step.with.name), [resultName, profileName]);
  const ghSpy = '() { printf "native-read\\n" >> "$TEST_EFFECTS"; case "$2" in repos/open-hax/eta-mu) printf "%s\\n" main;; repos/open-hax/eta-mu/branches/main) printf "%s\\n" "$TEST_BRANCH_JSON";; repos/open-hax/eta-mu/actions/runs/31|repos/open-hax/knoxx/actions/runs/31) printf "%s\\n" "$TEST_RUN_JSON";; repos/open-hax/eta-mu/compare/*) printf "%s\\n" identical;; *) return 97;; esac; }';
  for (const [jobName, job] of Object.entries(workflow.jobs)) {
    const guardIndex = job.steps.findIndex((step) => step.name === "Authenticate protected called source before checkout");
    assert.ok(guardIndex >= 0);
    for (const [index, step] of job.steps.entries()) {
      if (step.uses?.startsWith("actions/checkout@") || step.uses?.startsWith("actions/download-artifact@") || step.uses?.startsWith("actions/create-github-app-token@"))
        assert.ok(guardIndex < index, "the actual guard precedes every checkout/download/token action");
    }
    for (const called of [false, true]) for (const attempt of [1, 2, 3]) {
      const effects = path.join(directory, `${jobName}-${called}-${attempt}.txt`);
      const repo = "open-hax/eta-mu";
      const env = { PATH: process.env.PATH, ETA_SOURCE_SHA: sha, GITHUB_REPOSITORY: repo, GITHUB_RUN_ID: "31",
        REJECTION_JOB_WORKFLOW_SHA: sha,
        REJECTION_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main",
        REJECTION_JOB_CHECK_RUN_ID: "103", REJECTION_PREPARE_CHECK_RUN_ID: "101",
        GITHUB_ENV: path.join(directory, `${jobName}-${called}-${attempt}-github-env`),
        GITHUB_RUN_ATTEMPT: String(attempt), GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_WORKFLOW_SHA: called ? "e".repeat(40) : sha,
        GITHUB_WORKFLOW_REF: called ? "open-hax/eta-mu/.github/workflows/caller.yml@refs/heads/main" : "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@refs/heads/main",
        REJECTION_CALLED_REVISION: called ? sha : "", TEST_EFFECTS: effects,
        TEST_BRANCH_JSON: JSON.stringify({ protected: true, commit: { sha } }),
        TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: attempt, head_sha: called ? "f".repeat(40) : sha,
          repository: { full_name: repo }, referenced_workflows: [{ sha, path: `open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@${sha}` }] }),
        "BASH_FUNC_gh%%": ghSpy };
      // The appended marker models continuation after the real authored guard.
      // Native download/token actions are never invoked by this inert test.
      const child = spawnSync("bash", ["-c", `${job.steps[guardIndex].run}\nprintf 'later-step\\n' >> "$TEST_EFFECTS"\n`],
        { env, encoding: "utf8", timeout: 15000 });
      assert.equal(child.error, undefined);
      assert.equal(child.signal, null);
      if (attempt === 1) {
        assert.equal(child.status, 0, `${jobName} fresh ${called ? "called" : "direct"} run admits`);
        assert.match(fs.readFileSync(effects, "utf8"), /native-read/);
        assert.match(fs.readFileSync(effects, "utf8"), /later-step/);
      } else {
        assert.equal(child.status, 1, `${jobName} matching native attempt ${attempt} refuses`);
        assert.equal(fs.existsSync(effects), false, "no native spy read or modeled later effect occurs");
        assert.match(child.stdout, /requires a fresh workflow run/);
      }
    }
  }
});

/** The exact first guard rejects unsupported App-owner input before setup. */
test("publisher token scopes exactly the validated installed target", (t) => {
  const token = workflow.jobs.publish.steps.find((step) => step.id === "publisher");
  assert.equal(token.with.owner, "open-hax");
  assert.equal(token.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
  const nativeGuard = workflow.jobs.publish.steps.find((step) => step.id === "target_identity");
  assert.ok(nativeGuard, "the token consumes only the guarded native-target output");
  const expectedPins = { CANONICAL_REVISION: "d".repeat(40),
    MUSE_REVISION: "b7e4f98f550780a7b484b1525f53ad2934e29dad",
    REJECTION_HISTORY_SOURCE_SHA256: "e".repeat(64), REJECTION_HISTORY_CLI_SHA256: "f".repeat(64) };
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-target-scope-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const target of ["open-hax/another-installed-repo", "open-hax/eta-mu", "open-hax/knoxx"]) {
    const effects = path.join(directory, target.split("/")[1]);
    const child = spawnSync("bash", ["-c", `${workflow.jobs.prepare.steps[0].run}\nprintf 'setup-reached\n' >> "$TEST_EFFECTS"\n`],
      { env: { PATH: process.env.PATH, ...expectedPins, TIMEOUT_INPUT: "60", TARGET_REPOSITORY: target,
        TEST_EFFECTS: effects }, encoding: "utf8", timeout: 15000 });
    assert.equal(child.status, 0, child.stderr);
    const output = effects + ".outputs";
    const native = spawnSync("bash", ["-c", nativeGuard.run],
      { env: { PATH: process.env.PATH, TARGET_REPOSITORY: target, TARGET_REPOSITORY_ID: "3",
        GITHUB_OUTPUT: output, TEST_METADATA: JSON.stringify({ full_name: target, id: 3, visibility: "public", private: false }),
        "BASH_FUNC_gh%%": '() { [[ "$#" == 2 && "$1" == api && "$2" == "repos/$TARGET_REPOSITORY" ]] || return 97; printf "%s\\n" "$TEST_METADATA"; }' },
        encoding: "utf8", timeout: 15000 });
    assert.equal(native.error, undefined);
    assert.equal(native.signal, null);
    assert.equal(native.status, 0, native.stderr);
    const names = fs.readFileSync(output, "utf8");
    assert.equal(names, `repository_name=${target.split("/")[1]}\n`);
    const repositoryName = names.slice("repository_name=".length).trimEnd();
    assert.equal(`${token.with.owner}/${repositoryName}`, target,
      "the explicit token list contains only this validated native target, not an incumbent allowlist");
  }
  for (const [n, target] of ["other-owner/repo", "open-hax/repo,other", "open-hax/repo\nother", "", "open-hax/"].entries()) {
    const effects = path.join(directory, `refusal-${n}`);
    const child = spawnSync("bash", ["-c", `${workflow.jobs.prepare.steps[0].run}\nprintf 'setup-reached\n' >> "$TEST_EFFECTS"\n`],
      { env: { PATH: process.env.PATH, ...expectedPins, TIMEOUT_INPUT: "60", TARGET_REPOSITORY: target,
        TEST_EFFECTS: effects }, encoding: "utf8", timeout: 15000 });
    assert.equal(child.status, 1);
    assert.equal(fs.existsSync(effects), false, "malformed/foreign targets refuse before modeled setup");
  }
});

/** Emulate immutable artifact-name lookup only; no upload/download API is called. */
test("same-run reusable invocations have unique artifacts and consume their own producer", () => {
  const upload = (job) => job.steps.filter((s) => s.uses?.startsWith("actions/upload-artifact@"));
  const download = (job) => job.steps.filter((s) => s.uses?.startsWith("actions/download-artifact@"));
  const render = (name, id) => name.replaceAll("${{ github.run_id }}", "31")
    .replaceAll("${{ github.run_attempt }}", "1")
    .replaceAll("${{ job.check_run_id }}", id)
    .replaceAll("${{ needs.prepare.outputs.invocation_id }}", id);
  const artifacts = new Map();
  for (const id of ["101", "201"]) {
    for (const [phase, job] of Object.entries(workflow.jobs)) {
      for (const step of download(job)) {
        const name = render(step.with.name, id);
        assert.equal(artifacts.get(name), id, "every consumer selects its own exact producer");
      }
      for (const step of upload(job)) {
        const name = render(step.with.name, id);
        assert.equal(artifacts.has(name), false, `a repeated identical target still needs a distinct ${phase} artifact`);
        artifacts.set(name, id);
      }
    }
  }
  assert.equal(artifacts.size, 8, "input, profile, result, publication for each invocation");
  assert.equal(workflow.jobs.prepare.outputs.invocation_id, "${{ job.check_run_id }}");
  assert.equal(workflow.jobs.assess.outputs.check_run_id, "${{ job.check_run_id }}");
  for (const job of Object.values(workflow.jobs)) {
    const guard = job.steps.find((step) => step.name === "Authenticate protected called source before checkout");
    assert.equal(guard.env.REJECTION_JOB_WORKFLOW_SHA, "${{ job.workflow_sha }}");
    assert.equal(guard.env.REJECTION_JOB_WORKFLOW_REF, "${{ job.workflow_ref }}");
    assert.equal(guard.env.REJECTION_JOB_CHECK_RUN_ID, "${{ job.check_run_id }}");
  }
});

/** Exercise the actual authored visibility guard with native-shaped inert reads. */
test("every target checkout requires exact native identity and known public visibility", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-public-target-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const publicTarget = { full_name: "open-hax/another-installed-repo", id: 3, visibility: "public", private: false };
  const cases = [
    ["public", publicTarget, 0],
    ["private", { ...publicTarget, visibility: "private", private: true }, 0],
    ["internal", { ...publicTarget, visibility: "internal", private: true }, 0],
    ["contradictory", { ...publicTarget, private: true }, 0],
    ["unknown", { ...publicTarget, visibility: null }, 0],
    ["missing-visibility", { full_name: publicTarget.full_name, id: 3, private: false }, 0],
    ["missing-private", { full_name: publicTarget.full_name, id: 3, visibility: "public" }, 0],
    ["wrong-id", { ...publicTarget, id: 4 }, 0],
    ["wrong-name", { ...publicTarget, full_name: "open-hax/other" }, 0],
    ["unavailable", {}, 44],
    ["malformed", "not JSON", 0],
  ];
  for (const [jobName, job] of Object.entries(workflow.jobs)) {
    const index = job.steps.findIndex((step) => step.name === "Require public native target before checkout");
    assert.ok(index >= 0, "every job needs the public-target gate");
    const guard = job.steps[index];
    assert.equal(guard.id, "target_identity");
    const token = job.steps.find((step) => step.uses?.startsWith("actions/create-github-app-token@"));
    assert.equal(token.with.owner, "open-hax");
    assert.equal(token.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
    assert.equal(guard.env.GH_TOKEN, "${{ github.token }}");
    assert.equal(Object.keys(guard.env).some((key) => /KEY|SECRET/.test(key)), false);
    for (const [later, step] of job.steps.entries()) {
      if (step.uses?.startsWith("actions/checkout@") || step.uses?.startsWith("actions/create-github-app-token@"))
        assert.ok(index < later, "native visibility is checked before every checkout or App credential");
    }
    for (const [name, metadata, readExit] of cases) {
      const effects = path.join(directory, jobName + "-" + name);
      const output = effects + ".outputs";
      const child = spawnSync("bash", ["-c", guard.run + '\nprintf \'checkout-reached\\n\' >> "$TEST_EFFECTS"\n'],
        { env: { PATH: process.env.PATH, TARGET_REPOSITORY: publicTarget.full_name, TARGET_REPOSITORY_ID: "3",
          GITHUB_OUTPUT: output, TEST_EFFECTS: effects, TEST_METADATA: typeof metadata === "string" ? metadata : JSON.stringify(metadata),
          TEST_READ_EXIT: String(readExit),
          "BASH_FUNC_gh%%": '() { [[ "$#" == 2 && "$1" == api && "$2" == "repos/$TARGET_REPOSITORY" ]] || return 97; [[ "$TEST_READ_EXIT" == 0 ]] || return "$TEST_READ_EXIT"; printf "%s\\n" "$TEST_METADATA"; }' },
          encoding: "utf8", timeout: 15000 });
      assert.equal(child.error, undefined);
      assert.equal(child.signal, null);
      if (name === "public") {
        assert.equal(child.status, 0, jobName + " admits the exact public target");
        assert.match(fs.readFileSync(effects, "utf8"), /checkout-reached/);
        assert.equal(fs.readFileSync(output, "utf8"), "repository_name=another-installed-repo\n");
      } else {
        assert.notEqual(child.status, 0, jobName + " refuses " + name + " native metadata");
        assert.equal(fs.existsSync(effects), false, "refusal occurs before modeled checkout/App continuation");
        assert.equal(fs.existsSync(output), false, "native refusal emits no token repository selection");
      }
    }
  }
});

/** Execute the actual shell carrier with inert host outcomes, never a native write. */
test("publication carrier preserves terminal bytes and an honest startup-crash fallback", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-publication-terminal-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const write = workflow.jobs.publish.steps.find((step) => step.name?.startsWith("Fresh canonical eligibility"));
  const posted = { status: "unestablished", outcome: "posted", "refusal-code": "native-readback-error",
    "actual-write-outcome": { outcome: "posted", "http-status": 201 }, "actual-post-response": { id: 7002 },
    "write-intent-performed": true, "retry-performed": false, admitted: false };
  const observed = { status: "observed", "record-id": 7002, "review-credit": false };
  const deduplicated = { ...observed, outcome: "already-observed", "write-performed": false };
  for (const [name, exitCode, terminal] of [["startup-crash", 71, null], ["empty-success", 0, null],
    ["refused-readback", 1, posted], ["observed", 0, observed], ["deduplicated", 0, deduplicated]]) {
    const file = path.join(directory, name + ".json");
    const terminalBytes = terminal ? JSON.stringify(terminal) + "\n" : "";
    const child = spawnSync("bash", ["-c", write.run],
      { env: { PATH: process.env.PATH, PUBLICATION_RESULT_FILE: file, ETA_CHECKOUT: "/inert/eta", CANONICAL_CHECKOUT: "/inert/canonical",
        TEST_HOST_EXIT: String(exitCode), TEST_TERMINAL: terminalBytes,
        "BASH_FUNC_node%%": '() { if [[ -n "$TEST_TERMINAL" ]]; then printf "%s" "$TEST_TERMINAL" > "$PUBLICATION_RESULT_FILE"; fi; return "$TEST_HOST_EXIT"; }' },
        encoding: "utf8", timeout: 15000 });
    assert.equal(child.error, undefined);
    assert.equal(child.signal, null);
    assert.equal(child.status, terminal || exitCode !== 0 ? exitCode : 1);
    assert.equal(fs.existsSync(file), true, name + " must retain a terminal result after the actual shell invocation");
    const retainedBytes = fs.readFileSync(file, "utf8");
    const retained = JSON.parse(retainedBytes);
    if (terminal) assert.equal(retainedBytes, terminalBytes, "host-written terminal bytes survive both failure and success");
    else {
      assert.equal(retained.status, "unestablished");
      assert.equal(retained.outcome, "unknown", "startup failure cannot establish whether a write occurred");
      assert.equal(retained["write-intent-performed"], null);
      assert.equal(retained["retry-performed"], false);
      assert.equal(retained.admitted, false);
      assert.equal(retained["native-resolution-performed"], false);
      assert.equal(retained["review-credit"], false);
    }
  }
});


/** Execute the owned host-runtime prefix only; npm is inert except the offline corrupt-lock refusal. */
test("all host jobs require the committed lock and propagate npm ci failure without fallback", (t) => {
  const runtimeSource = path.join(root, ".github/assessment-runtime");
  const packageBytes = fs.readFileSync(path.join(runtimeSource, "package.json"));
  const lockBytes = fs.readFileSync(path.join(runtimeSource, "package-lock.json"));
  const manifest = JSON.parse(packageBytes);
  const lock = JSON.parse(lockBytes);
  assert.equal(manifest.private, true);
  assert.deepEqual(manifest.dependencies, { nbb: "1.5.211", yaml: "2.9.0" });
  assert.equal(Object.hasOwn(manifest, "scripts"), false);
  assert.equal(lock.lockfileVersion, 3);
  assert.deepEqual(lock.packages[""].dependencies, manifest.dependencies);
  for (const [name, entry] of Object.entries(lock.packages)) if (name !== "") {
    assert.ok(entry.resolved && entry.integrity, `${name} retains its recorded tarball and integrity`);
  }
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-assessment-locked-runtime-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const runtime = ".rejection-assessment/runtime";
  const symlink = `ln -s "$GITHUB_WORKSPACE/${runtime}/node_modules" "$ETA_CHECKOUT/node_modules"`;
  const names = { prepare: "Install pinned one-shot host runtime",
    assess: "Install isolated credential-free model profile", publish: "Install protected one-shot publisher runtime" };
  for (const [jobName, job] of Object.entries(workflow.jobs)) {
    const step = job.steps.find((candidate) => candidate.name === names[jobName]);
    assert.ok(step, `${jobName} has its actual host-runtime installation step`);
    const lines = step.run.trimEnd().split("\n");
    const end = lines.findIndex((line) => line.trim() === symlink);
    assert.ok(end >= 0, "the checked prefix ends at the actual runtime consumer link");
    const prefix = lines.slice(0, end + 1).join("\n");
    for (const variant of ["intact", "missing-lock", "ci-failure"]) {
      const owned = path.join(directory, `${jobName}-${variant}`);
      const eta = path.join(owned, ".rejection-assessment/eta");
      const source = path.join(eta, ".github/assessment-runtime");
      const temp = path.join(owned, "temp");
      const evidence = path.join(owned, "evidence");
      const profile = path.join(owned, "profile");
      for (const file of [source, temp, evidence, profile]) fs.mkdirSync(file, { recursive: true });
      fs.writeFileSync(path.join(source, "package.json"), packageBytes);
      if (variant !== "missing-lock") fs.writeFileSync(path.join(source, "package-lock.json"), lockBytes);
      const calls = path.join(owned, "npm-calls.txt");
      const continued = path.join(owned, "continued.txt");
      const child = spawnSync("bash", ["-c", prefix + '\nprintf "runtime-ready\\n" > "$TEST_CONTINUED"\n'], {
        cwd: owned, encoding: "utf8", timeout: 15000,
        env: { PATH: process.env.PATH, ETA_CHECKOUT: eta, GITHUB_WORKSPACE: owned, RUNNER_TEMP: temp,
          REJECTION_EVIDENCE_DIR: evidence, REJECTION_PROFILE_DIR: profile, TEST_NPM_CALLS: calls,
          TEST_CONTINUED: continued, TEST_NPM_EXIT: variant === "ci-failure" ? "73" : "0",
          "BASH_FUNC_npm%%": '() { printf "%s\\n" "$*" >> "$TEST_NPM_CALLS"; '
            + '[[ "$*" == "ci --prefix .rejection-assessment/runtime --ignore-scripts --no-audit --no-fund" ]] || return 97; '
            + 'cmp "$ETA_CHECKOUT/.github/assessment-runtime/package.json" .rejection-assessment/runtime/package.json || return 98; '
            + 'cmp "$ETA_CHECKOUT/.github/assessment-runtime/package-lock.json" .rejection-assessment/runtime/package-lock.json || return 98; '
            + 'return "$TEST_NPM_EXIT"; }' },
      });
      assert.equal(child.error, undefined);
      assert.equal(child.signal, null);
      if (variant === "intact") {
        assert.equal(child.status, 0, child.stderr);
        assert.equal(fs.readFileSync(continued, "utf8"), "runtime-ready\n");
        assert.equal(fs.readlinkSync(path.join(eta, "node_modules")), path.join(owned, runtime, "node_modules"));
      } else {
        assert.notEqual(child.status, 0, `${jobName} refuses ${variant}`);
        assert.equal(fs.existsSync(continued), false, "no host/model/publisher continuation follows a refused install");
        assert.equal(fs.existsSync(path.join(eta, "node_modules")), false);
      }
      const recorded = fs.existsSync(calls) ? fs.readFileSync(calls, "utf8").trimEnd().split("\n") : [];
      assert.deepEqual(recorded, variant === "missing-lock" ? [] :
        [`ci --prefix ${runtime} --ignore-scripts --no-audit --no-fund`], "no ad-hoc install or failure fallback is permitted");
      if (variant === "ci-failure") assert.equal(child.status, 73, "the actual npm failure propagates");
    }
  }
  // Actual npm rejects a corrupted staged lock offline, before running any installed runtime.
  const corrupt = path.join(directory, "corrupt-lock");
  fs.mkdirSync(corrupt);
  fs.writeFileSync(path.join(corrupt, "package.json"), packageBytes);
  fs.writeFileSync(path.join(corrupt, "package-lock.json"), "{broken-lock\n");
  const userConfig = path.join(corrupt, "user.npmrc");
  const globalConfig = path.join(corrupt, "global.npmrc");
  fs.writeFileSync(userConfig, "");
  fs.writeFileSync(globalConfig, "");
  const refused = spawnSync("npm", ["ci", "--prefix", corrupt, "--ignore-scripts", "--no-audit", "--no-fund", "--offline", "--cache", path.join(corrupt, "cache")], {
    encoding: "utf8", timeout: 15000,
    env: { PATH: process.env.PATH, HOME: corrupt, NPM_CONFIG_USERCONFIG: userConfig, NPM_CONFIG_GLOBALCONFIG: globalConfig,
      NPM_CONFIG_UPDATE_NOTIFIER: "false",
      NODE_OPTIONS: process.env.NODE_OPTIONS, ETA_MU_TEST_NETWORK_AUDIT_DIR: process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE },
  });
  assert.equal(refused.error, undefined);
  assert.equal(refused.signal, null);
  childNetworkAudit(refused);
  assert.notEqual(refused.status, 0, "a corrupt lock cannot produce a runtime");
  assert.match(refused.stderr, /EUSAGE|EJSONPARSE/, "refusal must be npm lock validation, not an unrelated setup failure");
  assert.equal(fs.existsSync(path.join(corrupt, "node_modules/nbb/cli.js")), false);
});


/** All owning jobs declare discovery; an empty input selects the current checked native ID. */
test("native workflow requires dynamic anonymous discovery through verification and publication", () => {
  const YAML=createRequire(import.meta.url)("yaml");
  const workflow=YAML.parse(fs.readFileSync(path.join(root,".github/workflows/opencode-rejection-assessment.yml"),"utf8"));
  assert.equal(workflow.env.REVIEW_MODEL_DISCOVERY,"opencode-free-mimo-flash-v1");
  assert.equal(workflow.env.REVIEW_EXPECTED_OPENCODE_VERSION,"1.18.18");
  const assess=workflow.jobs.assess.steps.find(step=>step.name==="Actual bounded credential-free invocation");
  assert.equal(assess.env.REVIEW_MODEL,"");
  assert.equal(assess.env.REVIEW_INPUT_PURPOSE,"rejection-assessment");
  assert.equal(assess["working-directory"],".rejection-assessment/model-root");
  const profile=workflow.jobs.assess.steps.find(step=>step.name==="Install isolated credential-free model profile");
  assert.ok(profile.run.includes('mkdir -m 700 "$MODEL_HOME/tmp"'));
});


/** Run the authored model install/staging tails with inert npm; real npm validates corrupt locks offline. */
test("model child retains a matching profile lock and refuses incomplete locked installations", (t) => {
  const profileSource = path.join(root, ".github/assessment-model-profile");
  const cliSource = path.join(root, ".github/assessment-opencode");
  const profilePackage = fs.readFileSync(path.join(profileSource, "package.json"));
  const profileLock = fs.readFileSync(path.join(profileSource, "package-lock.json"));
  const cliPackage = fs.readFileSync(path.join(cliSource, "package.json"));
  const cliLock = fs.readFileSync(path.join(cliSource, "package-lock.json"));
  assert.deepEqual(JSON.parse(profilePackage), { type: "module", dependencies: {
    "@opencode-ai/plugin": "1.17.18", zod: "4.1.8" } });
  assert.deepEqual(JSON.parse(cliPackage).dependencies, {
    "opencode-ai": "1.18.18", "opencode-linux-x64-baseline": "1.18.18" });
  for (const [manifestBytes, lockBytes] of [[profilePackage, profileLock], [cliPackage, cliLock]]) {
    const lock = JSON.parse(lockBytes);
    assert.equal(lock.lockfileVersion, 3);
    assert.deepEqual(lock.packages[""].dependencies, JSON.parse(manifestBytes).dependencies);
    for (const [name, entry] of Object.entries(lock.packages)) if (name !== "") {
      assert.ok(entry.resolved && entry.integrity, `${name} has a locked tarball and integrity`);
    }
  }
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-assessment-model-lock-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const stage = workflow.jobs.prepare.steps.find(step => step.name === "Reuse protected read-only Muse profile compilation");
  const stageLines = stage.run.trimEnd().split("\n");
  const stageStart = stageLines.findIndex(line => line.includes('/.opencode/package.json"'));
  assert.ok(stageStart >= 0);
  const stageTail = "set -euo pipefail\n" + stageLines.slice(stageStart).join("\n");
  for (const variant of ["trusted-lock", "generated-lock", "missing-lock", "manifest-mismatch"]) {
    const owned = path.join(directory, "stage-" + variant), temp = path.join(owned, "temp"), eta = path.join(owned, "eta");
    const output = path.join(temp, "rejection-assessment-muse-build/.opencode"), profile = path.join(owned, "profile"), evidence = path.join(owned, "evidence");
    const source = path.join(eta, ".github/assessment-model-profile"), continued = path.join(owned, "continued");
    for (const folder of [output, profile, evidence, source]) fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(source, "package.json"), profilePackage);
    if (variant !== "missing-lock") fs.writeFileSync(path.join(source, "package-lock.json"), profileLock);
    const generated = variant === "manifest-mismatch"
      ? Buffer.from(JSON.stringify({ type: "module", dependencies: { "@opencode-ai/plugin": "0.0.0", zod: "4.1.8" } })) : profilePackage;
    fs.writeFileSync(path.join(output, "package.json"), generated);
    fs.writeFileSync(path.join(output, "exposed-tools.txt"), "inert tools\n");
    const generatedLock = Buffer.concat([profileLock, Buffer.from("\n")]);
    if (variant === "generated-lock") fs.writeFileSync(path.join(output, "package-lock.json"), generatedLock);
    const child = spawnSync("bash", ["-c", stageTail + '\nprintf "ready\\n" > "$TEST_CONTINUED"\n'], {
      encoding: "utf8", timeout: 15000,
      env: { PATH: process.env.PATH, RUNNER_TEMP: temp, ETA_CHECKOUT: eta,
        REJECTION_PROFILE_DIR: profile, REJECTION_EVIDENCE_DIR: evidence, TEST_CONTINUED: continued },
    });
    assert.equal(child.error, undefined); assert.equal(child.signal, null);
    const success = variant === "trusted-lock" || variant === "generated-lock";
    assert.equal(child.status === 0, success, child.stderr);
    assert.equal(fs.existsSync(continued), success, "a missing lock or changed generated manifest stops profile staging");
    assert.deepEqual(fs.readFileSync(path.join(profile, "package.json")), generated, "the compiler manifest is never replaced");
    if (success) assert.deepEqual(fs.readFileSync(path.join(profile, "package-lock.json")),
      variant === "generated-lock" ? generatedLock : profileLock, "the selected lock is staged byte-exactly");
    else assert.equal(fs.existsSync(path.join(profile, "package-lock.json")), false);
  }
  const install = workflow.jobs.assess.steps.find(step => step.name === "Install isolated credential-free model profile");
  const installLines = install.run.trimEnd().split("\n");
  const installStart = installLines.findIndex(line => line.trim() === 'MODEL_HOME="$RUNNER_TEMP/rejection-assessment-model-home"');
  assert.ok(installStart >= 0);
  const installTail = "set -euo pipefail\n" + installLines.slice(installStart).join("\n");
  const invoke = workflow.jobs.assess.steps.find(step => step.name === "Actual bounded credential-free invocation");
  assert.equal(invoke.env.OPENCODE_BIN,
    "${{ runner.temp }}/rejection-assessment-model-home/.eta-mu-opencode/node_modules/opencode-linux-x64-baseline/bin/opencode");
  for (const variant of ["intact", "missing-profile-lock", "manifest-mismatch", "profile-ci-failure", "missing-cli-lock", "cli-ci-failure", "missing-cli-executable"]) {
    const owned = path.join(directory, "install-" + variant), eta = path.join(owned, "eta"), temp = path.join(owned, "temp");
    const profile = path.join(owned, "profile"), canonical = path.join(owned, "canonical"), modelHome = path.join(temp, "rejection-assessment-model-home");
    for (const folder of [profile, modelHome, path.join(profile, "dist"), path.join(profile, "agents"), path.join(canonical, "skills")])
      fs.mkdirSync(folder, { recursive: true, mode: 0o700 });
    for (const [name, bytes] of [["package.json", profilePackage], ["opencode.json", Buffer.from("{}\n")], ["agents/github-reviewer.md", Buffer.from("inert\n")]])
      fs.writeFileSync(path.join(profile, name), bytes);
    if (variant !== "missing-profile-lock") fs.writeFileSync(path.join(profile, "package-lock.json"), profileLock);
    if (variant === "manifest-mismatch") fs.writeFileSync(path.join(profile, "package.json"), "{}\n");
    for (const [name, packageBytes, lockBytes] of [["assessment-model-profile", profilePackage, profileLock], ["assessment-opencode", cliPackage, cliLock]]) {
      const source = path.join(eta, ".github", name); fs.mkdirSync(source, { recursive: true });
      fs.writeFileSync(path.join(source, "package.json"), packageBytes);
      if (!(variant === "missing-cli-lock" && name === "assessment-opencode")) fs.writeFileSync(path.join(source, "package-lock.json"), lockBytes);
    }
    const calls = path.join(owned, "npm-calls"), continued = path.join(owned, "continued");
    const child = spawnSync("bash", ["-c", installTail + '\nprintf "ready\\n" > "$TEST_CONTINUED"\n'], {
      encoding: "utf8", timeout: 15000,
      env: { PATH: process.env.PATH, RUNNER_TEMP: temp, ETA_CHECKOUT: eta, CANONICAL_CHECKOUT: canonical,
        REJECTION_PROFILE_DIR: profile, TEST_VARIANT: variant, TEST_NPM_CALLS: calls, TEST_CONTINUED: continued,
        "BASH_FUNC_npm%%": '() { printf "%s\\n" "$*" >> "$TEST_NPM_CALLS"; [[ "$1" == ci && "$2" == --prefix ]] || return 97; '
          + 'if [[ "$3" == */.eta-mu-review ]]; then [[ "$TEST_VARIANT" != profile-ci-failure ]] || return 73; '
          + 'else [[ "$TEST_VARIANT" != cli-ci-failure ]] || return 74; '
          + 'if [[ "$TEST_VARIANT" != missing-cli-executable ]]; then mkdir -p "$3/node_modules/opencode-linux-x64-baseline/bin"; '
          + 'printf "#!/bin/sh\\nexit 0\\n" > "$3/node_modules/opencode-linux-x64-baseline/bin/opencode"; '
          + 'chmod 700 "$3/node_modules/opencode-linux-x64-baseline/bin/opencode"; fi; fi; }' },
    });
    assert.equal(child.error, undefined); assert.equal(child.signal, null);
    assert.equal(child.status === 0, variant === "intact", child.stderr);
    assert.equal(fs.existsSync(continued), variant === "intact", "failed setup cannot reach model invocation");
    const profileCall = `ci --prefix ${modelHome}/.eta-mu-review --ignore-scripts --no-audit --no-fund`;
    const cliCall = `ci --prefix ${modelHome}/.eta-mu-opencode --ignore-scripts --no-audit --no-fund --omit=optional`;
    const expected = ["missing-profile-lock", "manifest-mismatch"].includes(variant) ? []
      : ["profile-ci-failure", "missing-cli-lock"].includes(variant) ? [profileCall] : [profileCall, cliCall];
    assert.deepEqual(fs.existsSync(calls) ? fs.readFileSync(calls, "utf8").trimEnd().split("\n") : [], expected,
      "only locked prefix installs run; no global install or fallback is allowed");
    if (variant === "profile-ci-failure") assert.equal(child.status, 73);
    if (variant === "cli-ci-failure") assert.equal(child.status, 74);
    if (variant === "intact") {
      assert.deepEqual(fs.readFileSync(path.join(modelHome, ".eta-mu-review/package.json")), profilePackage);
      assert.deepEqual(fs.readFileSync(path.join(modelHome, ".eta-mu-review/package-lock.json")), profileLock);
      assert.deepEqual(fs.readFileSync(path.join(modelHome, ".eta-mu-opencode/package-lock.json")), cliLock);
    }
  }
  for (const [name, packageBytes] of [["profile", profilePackage], ["cli", cliPackage]]) {
    const corrupt = path.join(directory, "corrupt-" + name); fs.mkdirSync(corrupt);
    fs.writeFileSync(path.join(corrupt, "package.json"), packageBytes);
    fs.writeFileSync(path.join(corrupt, "package-lock.json"), "{broken-lock\n");
    const userConfig = path.join(corrupt, "user.npmrc"), globalConfig = path.join(corrupt, "global.npmrc");
    fs.writeFileSync(userConfig, ""); fs.writeFileSync(globalConfig, "");
    const refused = spawnSync("npm", ["ci", "--prefix", corrupt, "--ignore-scripts", "--no-audit", "--no-fund", "--offline", "--cache", path.join(corrupt, "cache")], {
      encoding: "utf8", timeout: 15000,
      env: { PATH: process.env.PATH, HOME: corrupt, NPM_CONFIG_USERCONFIG: userConfig, NPM_CONFIG_GLOBALCONFIG: globalConfig,
        NPM_CONFIG_UPDATE_NOTIFIER: "false", NODE_OPTIONS: process.env.NODE_OPTIONS,
        ETA_MU_TEST_NETWORK_AUDIT_DIR: process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR,
        ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE },
    });
    assert.equal(refused.error, undefined); assert.equal(refused.signal, null); childNetworkAudit(refused);
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /EUSAGE|EJSONPARSE/, "actual npm lock validation refuses corrupted profile and CLI locks");
    assert.equal(fs.existsSync(path.join(corrupt, "node_modules")), false);
  }
});
