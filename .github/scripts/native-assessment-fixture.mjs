// SPDX-License-Identifier: GPL-3.0-or-later
// Inert Node-only discovery/carrier fixtures shared by the three workflow owners.
// Authored trusted Bash fixtures remain at their actual owner call sites.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

const NETWORK_DENY_PRELOAD_SHA256 = "f69bc9b3a31c4c3c1bc1189d6e5abf220d48a6dfb033c2236f9260a11f168372";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const tools = ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk",
  "review_record_evidence", "review_propose_finding", "review_classify_finding",
  "review_status", "review_submit"];
const stages = ["deterministic", "map-change", "generate-candidates", "adversarial-validate", "publish"];

export function createNativeAssessmentFixtures({ root, purpose, inputName, schema,
  verifierEnvironmentVariable, verifierSHAEnvironmentVariable, directoryPrefix,
  target, event = "COMMENT", providerSentinels = false }) {
  const runner = path.join(root, ".github/scripts/run-opencode-review-recovery.mjs");
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
    assert.equal(digest(fs.readFileSync(preload)), NETWORK_DENY_PRELOAD_SHA256);
    const auditDirectory=process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR,capture=process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE;
    assert.ok(auditDirectory&&capture);const auditInfo=fs.lstatSync(auditDirectory);
    assert.ok(auditInfo.isDirectory()&&!auditInfo.isSymbolicLink()&&fs.realpathSync(auditDirectory)===auditDirectory);
    assert.equal(auditInfo.mode&0o777,0o700);assert.equal(auditInfo.uid,process.getuid());
    const identities=path.join(directory,"discovery-children.ndjson"),loader=path.join(directory,"inert-catalog-loader.mjs");
    fs.writeFileSync(loader,`globalThis.fetch=async(url,options)=>{if(url!=="https://models.opencode.ai/api.json"||options.redirect!=="error"||options.credentials!=="omit")throw Error("INERT_FETCH_CONTRACT");const r=new Response(${JSON.stringify(JSON.stringify(raw))},{status:200});Object.defineProperty(r,"url",{value:url});return r;};\n`,{flag:"wx",mode:0o600});
    const source=fs.readFileSync(child,"utf8"),anchor='const fs=require("node:fs");\n';assert.equal(source.split(anchor).length,2);
    const enrollment=`process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR=${JSON.stringify(auditDirectory)};process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE=${JSON.stringify(capture)};const preload=${JSON.stringify(preload)};if(require('node:crypto').createHash('sha256').update(fs.readFileSync(preload)).digest('hex')!==${JSON.stringify(NETWORK_DENY_PRELOAD_SHA256)})throw Error("TEST_PRELOAD_BYTES_REFUSED");require(preload);fs.appendFileSync(${JSON.stringify(identities)},JSON.stringify({pid:process.pid,parentPid:process.ppid,argv:process.argv.slice(2)})+'\\n');\nif(process.argv[2]==="--version"){process.stdout.write("1.18.18\\n");process.exit(0);}if(process.argv[2]==="models"){process.stdout.write(${JSON.stringify(`opencode/${id}\n${JSON.stringify(row)}\n`)});process.exit(0);}\n`;
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
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), directoryPrefix));
    t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
    const verifierFile = process.env[verifierEnvironmentVariable];
    const verifierSha = process.env[verifierSHAEnvironmentVariable];
    assert.ok(verifierFile && path.isAbsolute(verifierFile), "source-built Muse verifier is required");
    assert.match(verifierSha || "", /^[0-9a-f]{64}$/);
    assert.equal(digest(fs.readFileSync(verifierFile)), verifierSha);
    const verifier = createRequire(import.meta.url)(verifierFile);
    const full = Buffer.from(JSON.stringify({ fixture: "inert full native carrier; no native or model call",
      body: "original body ημ 😀\nquoted context retained as data", source: "selected source\n".repeat(1100) }));
    const source = { schema, purpose,
      head_sha: "b".repeat(40), context_sha256: "c".repeat(64), proposal_id: 71,
      proposal_body_sha256: "d".repeat(64), source_inventory_sha256: "e".repeat(64),
      target: structuredClone(target),
      full_input: { path: inputName, bytes: full.length, sha256: digest(full) },
      provenance: { repository: "synthetic/native-context", pull_request: "1", run_id: "2", run_attempt: "1",
        workflow_sha: "d".repeat(40), workflow_ref: "synthetic/native-context/workflow@refs/heads/main" } };
    const submissionFile = path.join(directory, "submission.json");
    const manifest = Buffer.from(JSON.stringify(source));
    const context = verifier.prepareReviewInvocationContext(full, manifest, tools, submissionFile);
    const text = full.toString("utf8");
    const notes = context.pages.map((page) => ({ ...page, note: `Synthetic complete carrier page ${page.id}.` }));
    const body = { schema: "open-hax.github-review/v1", event, comments: [],
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
    call("review_submit", { summary: body.summary }, { "ok?": true, event, file: submissionFile, "inline-comments": 0 });
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
    fs.writeFileSync(path.join(directory, inputName), partial ? full.subarray(0, 10) : full);
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
      + (providerSentinels
        ? `GITHUB_OUTPUT:process.env.GITHUB_OUTPUT,OPENAI_API_KEY:process.env.OPENAI_API_KEY,ETA_MU_APP_PRIVATE_KEY:process.env.ETA_MU_APP_PRIVATE_KEY}));\n`
        : `GITHUB_OUTPUT:process.env.GITHUB_OUTPUT}));\n`)
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
      REVIEW_INPUT_PURPOSE: purpose, REVIEW_CHILD_HOME: home,
      REVIEW_MODEL: "opencode/mimo-v2.6-flash-free", OPENCODE_BIN: child,
      GH_TOKEN: "inert-token-sentinel", GITHUB_TOKEN: "inert-other-sentinel",
      ...(providerSentinels ? { OPENAI_API_KEY: "inert-provider-sentinel", ETA_MU_APP_PRIVATE_KEY: "inert-app-sentinel" } : {}) };
    stageNativeDiscoveryFixture(directory, home, child, env);
    return { directory, home, probe, prompts, env, verifier, context };
  }
  return { nativeFixture, runNativeDiscoveryFixture, childNetworkAudit };
}
