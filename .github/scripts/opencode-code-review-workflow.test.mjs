// SPDX-License-Identifier: GPL-3.0-or-later

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { runReviewRecovery } from "./run-opencode-review-recovery.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const workflowPath =
  process.env.ETA_MU_REVIEW_WORKFLOW_PATH ||
  path.join(root, ".github/workflows/opencode-code-review.yml");
const requireFromEtaMu = createRequire(path.join(root, "packages/eta-mu/package.json"));
const YAML = requireFromEtaMu("yaml");
const workflowText = fs.readFileSync(workflowPath, "utf8");
const workflow = YAML.parse(workflowText);
const workflowDocs = fs.readFileSync(path.join(root, "docs/agent-workflows.md"), "utf8");
const recoveryRunnerSource = fs.readFileSync(
  path.join(root, ".github/scripts/run-opencode-review-recovery.mjs"),
  "utf8",
);

function namedStep(jobId, name) {
  const step = workflow.jobs[jobId].steps.find((candidate) => candidate.name === name);
  assert.ok(step, `missing ${jobId} step: ${name}`);
  return step;
}

function runScript(script, cwd, env = {}) {
  return spawnSync("bash", ["-c", script], {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
}

function parseOutput(file) {
  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

function makeRepository(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-review-workflow-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: directory });
  execFileSync("git", ["config", "user.name", "eta-mu workflow test"], { cwd: directory });
  execFileSync("git", ["config", "user.email", "workflow-test@example.invalid"], { cwd: directory });
  fs.writeFileSync(path.join(directory, "tracked.txt"), "revision-bound\n");
  execFileSync("git", ["add", "tracked.txt"], { cwd: directory });
  execFileSync("git", ["commit", "-qm", "fixture"], { cwd: directory });
  const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: directory, encoding: "utf8" }).trim();
  return { directory, sha };
}

const generatedOutputPaths = [
  "packages/legacy/ai/src/models.generated.ts",
  "packages/contracts/output/dist-cli/index.cjs",
  "packages/contracts/output/dist-cli/index.cjs.map",
];

function addGeneratedOutputs(directory) {
  for (const relativePath of generatedOutputPaths) {
    const output = path.join(directory, relativePath);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `checked-in ${relativePath}\n`);
  }
  execFileSync("git", ["add", ...generatedOutputPaths], { cwd: directory });
  execFileSync("git", ["commit", "-qm", "add generated outputs"], { cwd: directory });
  return generatedOutputPaths.map((relativePath) => path.join(directory, relativePath));
}

function guardEnvironment(directory, output, expectedSha, eventHeadSha = expectedSha) {
  return {
    EVENT_PR_HEAD_SHA: eventHeadSha,
    GITHUB_OUTPUT: output,
    GITHUB_WORKSPACE: directory,
    PR_HEAD_SHA: expectedSha,
  };
}

function summaryEnvironment(directory, output, sha, overrides = {}) {
  return {
    CHECKOUT_CLEAN: "true",
    CHECKOUT_EXACT_HEAD: "true",
    CHECKOUT_EXECUTED_SHA: sha,
    CHECKOUT_EXPECTED_SHA: sha,
    GATE_STEP_OUTCOME: "success",
    GITHUB_OUTPUT: output,
    GITHUB_REPOSITORY: "open-hax/fixture",
    GITHUB_WORKSPACE: directory,
    PR_BASE_SHA: "a".repeat(40),
    PR_HEAD_SHA: sha,
    PR_NUMBER: "42",
    ...overrides,
  };
}

function finalGateEnvironment(sha, overrides = {}) {
  return {
    CONTEXT_JOB_RESULT: "success",
    DETERMINISTIC_CLEAN: "true",
    DETERMINISTIC_COMPLETION_SHA: sha,
    DETERMINISTIC_EXACT_HEAD: "true",
    DETERMINISTIC_EXECUTED_SHA: sha,
    DETERMINISTIC_EXPECTED_SHA: sha,
    DETERMINISTIC_JOB_RESULT: "success",
    DETERMINISTIC_OUTPUT_RESULT: "success",
    ELIGIBLE_REVIEW_EVENT: "true",
    PULL_REQUEST_EVENT: "true",
    REVIEW_CLEAN: "true",
    REVIEW_COMPLETION_SHA: sha,
    REVIEW_EXACT_HEAD: "true",
    REVIEW_EXECUTED_SHA: sha,
    REVIEW_EXPECTED_SHA: sha,
    REVIEW_JOB_RESULT: "success",
    ...overrides,
  };
}

test("workflow exposes one stable always-running terminal gate", () => {
  assert.match(workflowText, /^# SPDX-License-Identifier: GPL-3\.0-or-later/m);
  const gate = workflow.jobs.review_gate;
  assert.equal(gate.name, "OpenCode evidence review gate");
  assert.deepEqual(gate.needs, ["deterministic_evidence", "prepare_review_context", "review"]);
  assert.equal(gate.if, "${{ always() }}");
  assert.equal(
    namedStep("review_gate", "Enforce truthful reusable review result").env.PULL_REQUEST_EVENT,
    "${{ github.event.pull_request != null }}",
  );

  const deterministic = workflow.jobs.deterministic_evidence;
  for (const output of ["result", "expected_sha", "executed_sha", "completion_sha", "exact_head", "clean"]) {
    assert.equal(typeof deterministic.outputs[output], "string");
  }
  assert.doesNotMatch(workflow.jobs.review.if, /deterministic_evidence\.outputs\.result/);
});

test("a required reusable head input drives both exact checkout guards", () => {
  const input = workflow.on.workflow_call.inputs.pr_head_sha;
  assert.equal(input.required, true);
  assert.equal(input.type, "string");
  const expectedRef = "${{ inputs.pr_head_sha || github.event.pull_request.head.sha }}";
  const eventHead = "${{ github.event.pull_request.head.sha }}";

  for (const jobId of ["deterministic_evidence", "review"]) {
    const checkout = namedStep(jobId, "Checkout pull request");
    assert.equal(checkout.with.ref, expectedRef);
    assert.equal(checkout.with["persist-credentials"], false);
  }

  for (const [jobId, name] of [
    ["deterministic_evidence", "Verify exact and clean pull request checkout"],
    ["review", "Verify exact and clean review checkout"],
  ]) {
    const guard = namedStep(jobId, name);
    assert.equal(guard.env.PR_HEAD_SHA ?? guard.env.EXPECTED_SHA, expectedRef);
    assert.equal(guard.env.EVENT_PR_HEAD_SHA, eventHead);
    assert.match(guard.run, /git rev-parse HEAD/);
    assert.match(guard.run, /git cat-file -e "\$\{expected_sha\}\^\{commit\}"/);
    assert.match(guard.run, /event_head_matches/);
    assert.match(guard.run, /\^\[0-9a-f\]\{40\}\$/);
    assert.match(guard.run, /\^\[0-9a-f\]\{64\}\$/);
  }
});

test("staging preserves the full immutable diff beyond its bounded preview", (t) => {
  const { directory, sha: base } = makeRepository(t);
  fs.writeFileSync(path.join(directory, "large.txt"), "changed input\n".repeat(26000));
  fs.writeFileSync(path.join(directory, "尾-ημ.txt"), "tail hunk must be reviewed\n");
  execFileSync("git", ["add", "large.txt", "尾-ημ.txt"], { cwd: directory });
  execFileSync("git", ["commit", "-qm", "large full-input fixture"], { cwd: directory });
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: directory, encoding: "utf8" }).trim();
  const event = path.join(directory, "event.json");
  fs.writeFileSync(event, JSON.stringify({ pull_request: {
    number: 42, title: "full input", user: { login: "fixture" },
    head: { ref: "review", sha: head }, base: { ref: "main", sha: base }, draft: false,
  } }));
  const step = namedStep("deterministic_evidence", "Stage pull request diff and context");
  const result = runScript(step.run, directory, {
    GITHUB_WORKSPACE: directory, GITHUB_EVENT_PATH: event, PR_BASE_SHA: base, PR_HEAD_SHA: head,
    GITHUB_REPOSITORY: "open-hax/fixture", GITHUB_RUN_ID: "123", GITHUB_RUN_ATTEMPT: "2",
    GITHUB_WORKFLOW_SHA: head, GITHUB_WORKFLOW_REF: "open-hax/fixture/.github/workflows/review.yml@refs/heads/review",
  });
  assert.equal(result.status, 0, result.stderr);
  const evidence = path.join(directory, ".opencode/review-evidence");
  assert.ok(fs.existsSync(path.join(evidence, "basehead.diff")), "full input was discarded while making the preview");
  const full = fs.readFileSync(path.join(evidence, "basehead.diff"));
  const expected = execFileSync("git", ["diff", "--find-renames", base, head], { cwd: directory });
  assert.ok(full.equals(expected), "full staged bytes must equal exact merge-base/head Git input");
  assert.ok(full.length > 300000);
  assert.match(full.toString("utf8"), /tail hunk must be reviewed/);
  const preview = fs.readFileSync(path.join(evidence, "pr.diff"));
  assert.ok(preview.subarray(0, 300000).equals(full.subarray(0, 300000)));
  assert.doesNotMatch(preview.toString("utf8"), /tail hunk must be reviewed/);
  const manifest = JSON.parse(fs.readFileSync(path.join(evidence, "input-manifest.json"), "utf8"));
  assert.equal(manifest.schema, "open-hax.review-input/v1");
  assert.equal(manifest.base_sha, base);
  assert.equal(manifest.diff_base_sha, base);
  assert.equal(manifest.head_sha, head);
  assert.deepEqual(manifest.full_diff, {
    path: "basehead.diff", bytes: full.length, sha256: createHash("sha256").update(full).digest("hex"),
  });
  assert.equal(manifest.preview.truncated, true);
  assert.equal(manifest.preview.limit_bytes, 300000);
  assert.equal(manifest.provenance.run_id, "123");
  assert.equal(manifest.provenance.run_attempt, "2");
});

test("staging fails closed for an absent base or a mismatched selected head", (t) => {
  const { directory, sha } = makeRepository(t);
  const event = path.join(directory, "event.json");
  fs.writeFileSync(event, JSON.stringify({ pull_request: { number: 42, head: { sha }, base: { sha } } }));
  for (const [base, head] of [["a".repeat(40), sha], [sha, "b".repeat(40)]]) {
    const result = runScript(namedStep("deterministic_evidence", "Stage pull request diff and context").run, directory, {
      GITHUB_WORKSPACE: directory, GITHUB_EVENT_PATH: event, PR_BASE_SHA: base, PR_HEAD_SHA: head,
    });
    assert.notEqual(result.status, 0, "invalid revision must not produce qualified input");
  }
});

test("staging preserves empty input and distinguishes the native base from the merge base", (t) => {
  const { directory, sha: ancestor } = makeRepository(t);
  const step = namedStep("deterministic_evidence", "Stage pull request diff and context");
  const event = path.join(directory, "event.json");
  const stage = (base, head) => {
    fs.writeFileSync(event, JSON.stringify({ pull_request: { number: 42, head: { sha: head }, base: { sha: base } } }));
    const result = runScript(step.run, directory, {
      GITHUB_WORKSPACE: directory, GITHUB_EVENT_PATH: event, PR_BASE_SHA: base, PR_HEAD_SHA: head,
    });
    assert.equal(result.status, 0, result.stderr);
    const evidence = path.join(directory, ".opencode/review-evidence");
    return {manifest: JSON.parse(fs.readFileSync(path.join(evidence, "input-manifest.json"), "utf8")),
      full: fs.readFileSync(path.join(evidence, "basehead.diff"), "utf8")};
  };
  const empty = stage(ancestor, ancestor);
  assert.equal(empty.full, "");
  assert.equal(empty.manifest.full_diff.bytes, 0);
  assert.equal(empty.manifest.preview.truncated, false);
  fs.writeFileSync(path.join(directory, "head-only.txt"), "head change\n");
  execFileSync("git", ["add", "head-only.txt"], {cwd: directory});
  execFileSync("git", ["commit", "-qm", "head change"], {cwd: directory});
  const head = execFileSync("git", ["rev-parse", "HEAD"], {cwd: directory, encoding: "utf8"}).trim();
  execFileSync("git", ["checkout", "-qb", "base-ahead", ancestor], {cwd: directory});
  fs.writeFileSync(path.join(directory, "base-only.txt"), "unrelated base advance\n");
  execFileSync("git", ["add", "base-only.txt"], {cwd: directory});
  execFileSync("git", ["commit", "-qm", "base advance"], {cwd: directory});
  const base = execFileSync("git", ["rev-parse", "HEAD"], {cwd: directory, encoding: "utf8"}).trim();
  execFileSync("git", ["checkout", "-q", "--detach", head], {cwd: directory});
  const divergent = stage(base, head);
  assert.equal(divergent.manifest.base_sha, base);
  assert.equal(divergent.manifest.diff_base_sha, ancestor);
  assert.equal(divergent.manifest.head_sha, head);
  assert.match(divergent.full, /head change/);
  assert.doesNotMatch(divergent.full, /unrelated base advance/);
});

test("the compiled observer contract pins compatible Muse and allows both full-input tools", () => {
  const museSha = "0b9a91492c8355e6933dc2164d35668cb76d9e60";
  const expectedRef = "${{ inputs.muse_revision || '" + museSha + "' }}";
  assert.equal(workflow.on.workflow_call.inputs.muse_revision.default, museSha,
    "workflow-call default must select the corrected immutable Muse source");
  assert.equal(namedStep("prepare_review_context", "Checkout Muse compatibility compiler").with.ref,
    expectedRef, "direct-PR compiler fallback must match the workflow-call default");
  const assembly = namedStep("prepare_review_context", "Assemble revision-bound review context");
  assert.equal(assembly.env.MUSE_REVISION, expectedRef,
    "artifact provenance must record the same effective Muse selection");
  for (const name of ["review_read_diff_chunk", "review_assess_diff_chunk"]) {
    assert.ok(workflowText.includes(`:${name}`), `missing permission for ${name}`);
    assert.ok(workflowText.includes(`'${name}'`), `missing compiled registry assertion for ${name}`);
  }
});

test("context assembly records Muse and Agents inputs literally without executing ref text", (t) => {
  const { directory, sha } = makeRepository(t);
  const runnerTemp = path.join(directory, "runner-temp");
  fs.mkdirSync(runnerTemp);
  for (const [relativePath, content] of [
    [".review-context/muse/.opencode/dist/fixture.cjs", "// compiled fixture\n"],
    [".review-context/muse/.opencode/plugins/fixture.mjs", "// plugin fixture\n"],
    [".review-context/muse/.opencode/agents/github-reviewer.md", "reviewer fixture\n"],
    [".review-context/muse/.opencode/opencode.json", "{}\n"],
    [".review-context/muse/.opencode/package.json", "{}\n"],
    [".review-context/muse/.opencode/exposed-tools.txt", "observer fixture\n"],
    [".review-context/muse/.ημ/review/evidence-review.md", "prompt fixture\n"],
    [".review-context/muse/.ημ/review/publish-opencode-review.cjs", "// publisher fixture\n"],
    [".review-context/muse/.ημ/review/publish-opencode-review.test.cjs", "// test fixture\n"],
    [".review-context/agents/skills/fixture/SKILL.md", "skill fixture\n"],
  ]) {
    const file = path.join(directory, relativePath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }

  const assembly = namedStep("prepare_review_context", "Assemble revision-bound review context");
  const canary = path.join(directory, "ref-command-canary.txt");
  const adversarialRef = "ref-$(printf${IFS}injected>ref-command-canary.txt)";
  execFileSync("git", ["check-ref-format", "--branch", adversarialRef]);
  for (const [museRevision, agentsRevision] of [
    [undefined, undefined], [sha, sha], [adversarialRef, undefined], [undefined, adversarialRef],
  ]) {
    const inputs = { muse_revision: museRevision, agents_revision: agentsRevision };
    // Actions substitutes expressions in run text but transports env values as
    // data. Exercise that boundary with the complete native assembly script.
    const renderInputs = (text) => text.replace(
      /\$\{\{\s*inputs\.(muse_revision|agents_revision)\s*\|\|\s*'([^']+)'\s*\}\}/g,
      (_expression, input, fallback) => inputs[input] || fallback,
    );
    const result = runScript(renderInputs(assembly.run), directory, {
      RUNNER_TEMP: runnerTemp,
      ...Object.fromEntries(Object.entries(assembly.env ?? {}).map(
        ([name, value]) => [name, renderInputs(value)],
      )),
    });
    assert.equal(fs.existsSync(canary), false, "Review-context ref text executed as Bash source");
    assert.equal(result.status, 0, result.stderr);
    const context = path.join(runnerTemp, "opencode-review-context");
    assert.equal(fs.readFileSync(path.join(context, "metadata/muse-revision.txt"), "utf8"),
      `${museRevision || workflow.on.workflow_call.inputs.muse_revision.default}\n`);
    assert.equal(fs.readFileSync(path.join(context, "metadata/agents-revision.txt"), "utf8"),
      `${agentsRevision || workflow.on.workflow_call.inputs.agents_revision.default}\n`);
    const checksums = runScript("sha256sum --check SHA256SUMS", context);
    assert.equal(checksums.status, 0, checksums.stderr);
  }
});

const inputVerificationName = "Verify full review input against independent Git snapshot";
const finalInputVerificationName = "Reverify full input and bind final submission";

/** Stage native-shaped producer input, including empty, large and retained-attempt cases. */
function fullInputFixture(t, { large = false, baseAhead = false, empty = false, unicode = false, producerAttempt = "2" } = {}) {
  const { directory, sha: ancestor } = makeRepository(t);
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-review-input-"));
  t.after(() => fs.rmSync(scratch, { recursive: true, force: true }));
  if (!empty) {
    fs.writeFileSync(path.join(directory, "large.txt"),
      (unicode ? "changed 😀 ημ input\n" : "changed input\n").repeat(large ? 26000 : 2));
    fs.writeFileSync(path.join(directory, "尾-ημ.txt"), "tail hunk must be reviewed\n");
    execFileSync("git", ["add", "large.txt", "尾-ημ.txt"], { cwd: directory });
    execFileSync("git", ["commit", "-qm", "review input head"], { cwd: directory });
  }
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: directory, encoding: "utf8" }).trim();
  let base = ancestor;
  if (baseAhead) {
    execFileSync("git", ["checkout", "-qb", "advanced-base", ancestor], { cwd: directory });
    fs.writeFileSync(path.join(directory, "base-only.txt"), "unrelated base change\n");
    execFileSync("git", ["add", "base-only.txt"], { cwd: directory });
    execFileSync("git", ["commit", "-qm", "base advanced independently"], { cwd: directory });
    base = execFileSync("git", ["rev-parse", "HEAD"], { cwd: directory, encoding: "utf8" }).trim();
    execFileSync("git", ["checkout", "-q", "--detach", head], { cwd: directory });
  }
  const eventFile = path.join(scratch, "event.json");
  const event = { pull_request: { number: 42, title: "input fixture", user: { login: "fixture" },
    head: { ref: "review", sha: head }, base: { ref: "main", sha: base }, draft: false } };
  fs.writeFileSync(eventFile, JSON.stringify(event));
  const env = {
    GITHUB_WORKSPACE: directory, GITHUB_EVENT_PATH: eventFile, PR_BASE_SHA: base, PR_HEAD_SHA: head,
    GITHUB_REPOSITORY: "open-hax/fixture", GITHUB_RUN_ID: "123", GITHUB_RUN_ATTEMPT: producerAttempt,
    GITHUB_WORKFLOW_SHA: head, GITHUB_WORKFLOW_REF: "open-hax/fixture/.github/workflows/review.yml@refs/pull/42/merge",
    RUNNER_TEMP: scratch,
  };
  const staged = runScript(namedStep("deterministic_evidence", "Stage pull request diff and context").run, directory, env);
  assert.equal(staged.status, 0, staged.stderr);
  const artifactOutput = path.join(scratch, "artifact-output");
  const bound = runScript(namedStep("deterministic_evidence", "Bind deterministic artifact name").run, directory, {
    PR_NUMBER: String(event.pull_request.number), RUN_ID: env.GITHUB_RUN_ID,
    RUN_ATTEMPT: env.GITHUB_RUN_ATTEMPT, GITHUB_OUTPUT: artifactOutput,
  });
  assert.equal(bound.status, 0, bound.stderr);
  return { directory, scratch, base, head, ancestor, env, event,
    artifactName: parseOutput(artifactOutput).name,
    evidence: path.join(directory, ".opencode/review-evidence") };
}

/** Execute the real fresh-checkout/input guard and retain its consumer and trusted outputs. */
function freshReviewInputCheck(fixture, overrides = {}) {
  const consumer = fs.mkdtempSync(path.join(fixture.scratch, "fresh-review-"));
  execFileSync("git", ["clone", "-q", "--no-hardlinks", fixture.directory, consumer]);
  execFileSync("git", ["checkout", "-q", "--detach", fixture.head], { cwd: consumer });
  const evidence = path.join(consumer, ".opencode/review-evidence");
  const env = { ...fixture.env, GITHUB_WORKSPACE: consumer,
    REVIEW_INPUT_PHASE: "fresh",
    ...guardEnvironment(consumer, path.join(fixture.scratch, "guard-output"), fixture.head),
    EXPECTED_SHA: fixture.head, REVIEW_EVIDENCE_ARTIFACT_NAME: fixture.artifactName, ...overrides };
  const guard = runScript(namedStep("review", "Verify exact and clean review checkout").run, consumer, env);
  assert.equal(guard.status, 0, guard.stderr || guard.stdout);
  fs.cpSync(fixture.evidence, evidence, { recursive: true });
  // On the immutable pre-fix workflow the exact-head guard was the only Git
  // check before consuming downloaded input. Preserve that real RED behavior.
  const verification = workflow.jobs.review.steps.find((step) => step.name === inputVerificationName);
  const result = verification ? runScript(verification.run, consumer, env) : guard;
  const invocation = path.join(consumer, "model-or-publication-invoked");
  if (result.status === 0) fs.writeFileSync(invocation, "synthetic invocation boundary\n");
  return { result, evidence, invocation, consumer, env };
}

// Exact full metadata from the genuine retained dc4 native submission,
// artifact11293745387 / review-attempt-340-37173972128-1, generated by Muse0b.
// All13 assessment ranges/notes are retained as serialized-shape provenance.
// Adapted synthetic fixtures do not inherit its native review verdict.
// Source artifact SHA256: 928a7285f6462186d54f10d4e29976ac81f70da196739785b8637cd396f222f4.
const nativeMetadataShape = {
  "input-source": {
    "schema": "open-hax.review-input/v1",
    "base_sha": "b18764d47c0b8da0b2d31f02d8bdd889323ee65c",
    "head_sha": "dc4e5d605ef60a439bef9497266932ff1fd9902a",
    "diff_base_sha": "b18764d47c0b8da0b2d31f02d8bdd889323ee65c",
    "full_diff": {
      "path": "basehead.diff",
      "bytes": 95938,
      "sha256": "49c733c322fd771393c78f70d64dbf16afde09adc9c4ec2899dffe485cd07b39"
    },
    "preview": {
      "path": "pr.diff",
      "limit_bytes": 300000,
      "truncated": false
    },
    "provenance": {
      "repository": "open-hax/eta-mu",
      "pull_request": "340",
      "run_id": "37173972128",
      "run_attempt": "1",
      "workflow_sha": "acfc2725db1d2441ec01ec2352cba105fb048149",
      "workflow_ref": "open-hax/eta-mu/.github/workflows/opencode-code-review.yml@refs/pull/340/merge"
    }
  },
  "input-coverage": {
    "chunks": 13,
    "delivered": 13,
    "assessed": 13,
    "missing": []
  },
  "input-assessments": [
    {
      "id": 1,
      "start": 0,
      "end": 7876,
      "note": "Hunk 1: adds node:crypto createHash import and three new workflow tests for full-diff staging (preserves >300KB immutable diff with Unicode tail, exact merge-base/head bytes, preview prefix equality, manifest schema fields), fail-closed staging (absent base / mismatched head), and empty/divergent-base staging (base_sha vs diff_base_sha distinction). Assertions look semantically correct: byte equality against git diff, SHA-256 manifest cross-check, preview prefix bound. No defect apparent in this hunk."
    },
    {
      "id": 2,
      "start": 7876,
      "end": 16068,
      "note": "Chunk 2: continues the context-assembly test — exercises adversarial ref text (`ref-$(printf${IFS}injected>...)`) through renderInputs, asserts the canary file is never created (ref text not executed as Bash), validates metadata revision files and SHA256SUMS. Then adds fullInputFixture helper (staging + artifact-name binding) and freshReviewInputCheck helper (fresh clone, exact-head guard, evidence copy, runs the new input-verification step and simulates model invocation boundary). The ordering assertion checks verification runs after download and before context install, publisher test, model run, token creation, and publication. Logic is coherent; no defect apparent."
    },
    {
      "id": 3,
      "start": 16068,
      "end": 23836,
      "note": "Chunk 3: adversarial tests — malicious gate that replaces basehead.diff/pr.diff/manifest with a forged empty diff must fail at fresh-job verification before model invocation; independent verification accepts exact/empty/divergent-base input and records proof schema v1; failed-job rerun records producer attempt 1 and verification attempt 2; forged artifact-name/attempt variants (wrong PR, run, attempt, oversized, trailing newline, non-integer) all rejected; mutated manifest fields (ids, bytes, sha256, path, preview flag, provenance) all rejected. Assertions are consistently fail-closed (non-zero status, no invocation file, no input-verification.json). Sound test design; no defect apparent."
    },
    {
      "id": 4,
      "start": 23836,
      "end": 30597,
      "note": "Chunk 4: end of test file (altered-bytes and altered-preview rejection), diagnostic workflow Muse pin bump 05b4f1c5→0b9a9149, and core staging change in opencode-code-review.yml: adds node_version input (default \"22\"), strict SHA regex + HEAD/event equality checks, explicit merge-base then two-dot git diff to basehead.diff, SHA-256 manifest, preview copy/truncate with suffix, removal of the old `|| true` two-step fallback (now fails closed), and moves MUSE_REVISION/AGENTS_REVISION substitution out of run text into step env (injection hardening). Staging logic consistent: manifest bytes/digest computed on basehead.diff; truncated preview = head -c 300000 + suffix. No defect apparent; checkout depth assumption inherited from prior three-dot diff which also needed merge-base."
    },
    {
      "id": 5,
      "start": 30597,
      "end": 38724,
      "note": "Chunk 5: (a) policy allow-set and compiled registry assertion now include review_read_diff_chunk/review_assess_diff_chunk (consistent with the 22-tool claim); (b) Assemble revision-bound review context moves MUSE_REVISION/AGENTS_REVISION into step env (avoids `${{ }}` injection into run text) with updated Muse default 0b9a9149…; (c) node_version applied to review job setup-node; (d) the new independent verification step: deletes any supplied receipt, re-validates SHAs/event/HEAD, regenerates authoritative diff, Node script cross-checks manifest schema/ids/bytes/sha256/preview/provenance against fresh env + artifact-name regex (PR/run/attempt bound, BigInt attempt ordering), byte-compares downloaded full diff, reconstructs preview incl. truncation suffix, then writes input-verification.json. Fail-closed throughout (strict assert, set -euo pipefail, no continue-on-error). Logic coherent and matches the tests; no defect apparent."
    },
    {
      "id": 6,
      "start": 38724,
      "end": 46916,
      "note": "Chunk 6: adds input-verification.json to the attempt artifact upload path (proof retained); appends session-ledger entries (pure provenance notes, no executable content); docs/agent-workflows.md documents staging semantics (merge-base/head bytes, manifest fields, fail-closed staging, empty diff valid) and the full-input read/assess contract requiring every page assessed before submission — consistent with actual tool behavior observed in this session. No defect apparent."
    },
    {
      "id": 7,
      "start": 46916,
      "end": 54562,
      "note": "Chunk 7: docs/agent-workflows.md tail (producer attempt binding semantics — matches implementation: producer provenance retained, verification_provenance separate), docs/github-automation-architecture.md pin update to 0b9a9149 and diagnostic-subset caveat, and start of new docs/verification/full-review-input.md (verification narrative; mentions historical 446b199 stage — superseded later in same file by the 0b9a9149 section, consistent with workflow). Narrative/chronology, not executable. No defect apparent."
    },
    {
      "id": 8,
      "start": 54562,
      "end": 62754,
      "note": "Chunk 8: remainder of full-review-input.md verification narrative (fresh-job verification rationale, RED malicious-gate fixture, 44/44 suite, final section aligning all selectors to 0b9a9149, node_version interface note) and new kanban task card 256c5dd5 (incoming, scope/acceptance criteria matching the implemented change). Content is documentation/board provenance; claims match observable workflow and tests. No defect apparent."
    },
    {
      "id": 9,
      "start": 62754,
      "end": 70946,
      "note": "Chunk 9: rest of kanban card acceptance criteria (matches implementation) and append-only receipts.edn entries recording RED/GREEN workflow runs, Muse pin progression (05b→7a8788→446b199→0b9a9149), and immutable-input verification history. Provenance data only; internal claims are test records, not executable behavior. No defect apparent."
    },
    {
      "id": 10,
      "start": 70946,
      "end": 79138,
      "note": "Chunk 10: further append-only receipts documenting the grouped native review repairs (ref-command canary test, producer/consumer attempt provenance, forged-manifest attempt acceptance RED), current Muse selector prose correction, and test counts (47 fixtures GREEN on Node 24 and Node 22.20.0). Provenance only. No defect apparent."
    },
    {
      "id": 11,
      "start": 79138,
      "end": 87330,
      "note": "Chunk 11: receipts entries covering the historical-receipt-reader limitation (pre-existing malformed EDN at line 101 explicitly flagged as drift not introduced by this patch) and the Agents-ref step-env correction (hostile ref canary RED→GREEN). Provenance records with explicit non-claims. No defect apparent."
    },
    {
      "id": 12,
      "start": 87330,
      "end": 95522,
      "note": "Chunk 12: receipts entries for the grouped repair decision record (artifact-name regex binding, BigInt attempt ordering, provenance deepEqual retained, 18 forged cases refused) and the reflection/observation records incl. pre-existing EDN reader failure disclosure. Provenance only. No defect apparent."
    },
    {
      "id": 13,
      "start": 95522,
      "end": 95882,
      "note": "Chunk 13 (final): tail of receipts.edn — Agents step-env correction completion, Session Mycology scoring, frozen handoff note, repeat that historical EDN reader failure is pre-existing. End of full diff. All 13/13 pages delivered and assessed."
    }
  ]
};

/** Adapt a provenance-backed transport fixture, or run actual compiled Muse tools locally. */
function completeInputSubmission(checked) {
  if (process.env.ETA_MU_MUSE_TOOL_FIXTURE) {
    return JSON.parse(execFileSync(process.execPath,
      [process.env.ETA_MU_MUSE_TOOL_FIXTURE, checked.consumer], { encoding: "utf8" }));
  }
  const text = fs.readFileSync(path.join(checked.evidence, "basehead.diff"), "utf8");
  const assessments = [];
  // Small fixture intervals exercise coverage closure independently of Muse's
  // reader pagination. Production consumes the tool-written intervals unchanged.
  for (let start = 0; start < text.length;) {
    let end = Math.min(start + 1024, text.length);
    if (end < text.length && /[\uD800-\uDBFF]/.test(text[end - 1])) end -= 1;
    assessments.push({ ...nativeMetadataShape["input-assessments"][0],
      id: assessments.length + 1, start, end,
      note: "Synthetic complete-coverage transport fixture, not a model assessment." });
    start = end;
  }
  return { ...validSubmission(),
    "input-source": JSON.parse(fs.readFileSync(path.join(checked.evidence, "input-manifest.json"))),
    "input-coverage": { ...nativeMetadataShape["input-coverage"],
      chunks: assessments.length, delivered: assessments.length,
      assessed: assessments.length, missing: [] },
    "input-assessments": assessments };
}

/** Model a checksummed context and capture its pre-model checksum-list digest. */
function contextFixture(checked) {
  const context = path.join(checked.consumer, ".review-context");
  fs.mkdirSync(context);
  fs.writeFileSync(path.join(context, "publisher-fixture.cjs"), "// checksummed context fixture\n");
  const checksum = execFileSync("sha256sum", ["publisher-fixture.cjs"], { cwd: context });
  fs.writeFileSync(path.join(context, "SHA256SUMS"), checksum);
  return { context, digest: createHash("sha256").update(checksum).digest("hex") };
}

/** Execute the actual final command, or dc4's original completion guard for semantic RED. */
function finalReviewInputCheck(checked, context, overrides = {}) {
  fs.rmSync(checked.invocation, { force: true });
  const output = path.join(checked.consumer, ".opencode/review-evidence/final-outputs");
  const env = { ...checked.env, GITHUB_OUTPUT: output, REVIEW_INPUT_PHASE: "final",
    REVIEW_INPUT_VERIFICATION_SHA256: parseOutput(checked.env.GITHUB_OUTPUT).input_verification_sha256,
    REVIEW_CONTEXT_SHA256: context.digest,
    EXPECTED_SHA: checked.env.PR_HEAD_SHA, EXECUTED_SHA: checked.env.PR_HEAD_SHA,
    INITIAL_EXACT_HEAD: "true", INITIAL_CLEAN: "true", ...overrides };
  const step = workflow.jobs.review.steps.find((candidate) => candidate.name === finalInputVerificationName);
  const legacy = namedStep("review", "Verify review remained revision-bound");
  const result = runScript(step?.run ?? legacy.run, checked.consumer, env);
  const publication = path.join(checked.evidence, "publisher-invoked");
  if (result.status === 0) fs.writeFileSync(publication, "synthetic publisher boundary\n");
  return { result, publication, output, step };
}

test("fresh and final input verification share one command before App mint and publication", () => {
  const fresh = namedStep("review", inputVerificationName);
  const final = namedStep("review", finalInputVerificationName);
  assert.equal(final.run, fresh.run, "fresh/final verification laws must not diverge");
  assert.equal(fresh.env.REVIEW_INPUT_PHASE, "fresh");
  assert.equal(final.env.REVIEW_INPUT_PHASE, "final");
  assert.equal(final.env.REVIEW_INPUT_VERIFICATION_SHA256,
    "${{ steps.review_input.outputs.input_verification_sha256 }}");
  assert.equal(final.env.REVIEW_CONTEXT_SHA256,
    "${{ steps.review_context.outputs.context_sha256 }}");
  assert.equal(final.if, undefined);
  assert.notEqual(final["continue-on-error"], true);
  const steps = workflow.jobs.review.steps;
  assert.ok(steps.indexOf(final) > steps.indexOf(namedStep("review", "Run bounded evidence-first OpenCode review")));
  for (const name of ["Validate final review submission", "Create eta-mu GitHub App token for review publication",
    "Publish actual GitHub pull request review"]) {
    assert.ok(steps.indexOf(final) < steps.indexOf(namedStep("review", name)));
  }
  for (const name of ["Validate final review submission", "Publish actual GitHub pull request review"]) {
    assert.equal(namedStep("review", name).env.REVIEW_SUBMISSION_FILE,
      "${{ steps.final_review_input.outputs.submission_file }}");
  }
});

test("post-guard input, manifest, proof and context mutation stops before publisher", (t) => {
  const fixture = fullInputFixture(t);
  const mutations = [
    (c) => {
      const manifest = JSON.parse(fs.readFileSync(path.join(c.evidence, "input-manifest.json")));
      for (const file of ["basehead.diff", "pr.diff"]) fs.writeFileSync(path.join(c.evidence, file), "");
      manifest.full_diff.bytes = 0;
      manifest.full_diff.sha256 = createHash("sha256").update("").digest("hex");
      manifest.preview.truncated = false;
      fs.writeFileSync(path.join(c.evidence, "input-manifest.json"), JSON.stringify(manifest));
    },
    (c) => fs.appendFileSync(path.join(c.evidence, "basehead.diff"), "changed after verification\n"),
    (c) => fs.writeFileSync(path.join(c.evidence, "pr.diff"), "changed preview\n"),
    (c) => {
      const file = path.join(c.evidence, "input-manifest.json");
      const manifest = JSON.parse(fs.readFileSync(file));
      manifest.provenance.run_id = "999";
      fs.writeFileSync(file, JSON.stringify(manifest));
    },
    (c) => fs.appendFileSync(path.join(c.evidence, "input-manifest.json"), "\n"),
    (c) => fs.writeFileSync(path.join(c.evidence, "input-verification.json"), '{"input_verified":true}'),
    (c) => fs.rmSync(path.join(c.evidence, "input-verification.json")),
    (_c, context) => fs.appendFileSync(path.join(context.context, "publisher-fixture.cjs"), "// replaced\n"),
    (_c, context) => {
      fs.appendFileSync(path.join(context.context, "publisher-fixture.cjs"), "// replaced\n");
      fs.writeFileSync(path.join(context.context, "SHA256SUMS"),
        execFileSync("sha256sum", ["publisher-fixture.cjs"], { cwd: context.context }));
    },
  ];
  for (const mutate of mutations) {
    const checked = freshReviewInputCheck(fixture);
    assert.equal(checked.result.status, 0, checked.result.stderr);
    const context = contextFixture(checked);
    fs.writeFileSync(path.join(checked.evidence, "submission.json"), JSON.stringify(completeInputSubmission(checked)));
    mutate(checked, context);
    const final = finalReviewInputCheck(checked, context);
    assert.notEqual(final.result.status, 0, "post-guard mutation passed the actual publication boundary");
    assert.equal(fs.existsSync(final.publication), false);
  }
});

test("final binding refuses absent, mismatched and incomplete submission metadata", (t) => {
  const fixture = fullInputFixture(t, { unicode: true });
  const mutations = [
    (s) => { delete s["input-source"]; },
    (s) => { delete s["input-coverage"]; },
    (s) => { delete s["input-assessments"]; },
    (s) => { s["input-source"].head_sha = "a".repeat(40); },
    (s) => { s["input-source"].base_sha = "b".repeat(40); },
    (s) => { s["input-source"].full_diff.sha256 = "c".repeat(64); },
    (s) => { s["input-source"].full_diff.bytes += 1; },
    (s) => { s["input-source"].provenance.run_attempt = "1"; },
    (s) => { s["input-coverage"].delivered = 0; },
    (s) => { s["input-coverage"].assessed = 0; },
    (s) => { s["input-coverage"].missing = [1]; },
    (s) => { s["input-coverage"].chunks += 1; },
    (s) => { s["input-assessments"][0].note = " \n "; },
    (s) => { s["input-assessments"][0].start = 1; },
    (s) => { s["input-assessments"][0].end -= 1; },
    (s) => { s["input-assessments"][0].end = s["input-source"].full_diff.bytes; },
    (s) => { s["input-assessments"][0].id = 2; },
  ];
  for (const mutate of mutations) {
    const checked = freshReviewInputCheck(fixture);
    assert.equal(checked.result.status, 0, checked.result.stderr);
    const context = contextFixture(checked);
    const submission = completeInputSubmission(checked);
    mutate(submission);
    fs.writeFileSync(path.join(checked.evidence, "submission.json"), JSON.stringify(submission));
    const final = finalReviewInputCheck(checked, context);
    assert.notEqual(final.result.status, 0, "invalid tool-envelope metadata reached publisher");
    assert.equal(fs.existsSync(final.publication), false);
  }
});

test("final binding accepts complete empty, large, Unicode and retained producer input", (t) => {
  for (const options of [{ empty: true }, { large: true, unicode: true }, { baseAhead: true },
    { unicode: true }, { producerAttempt: "1" }]) {
    const fixture = fullInputFixture(t, options);
    const checked = freshReviewInputCheck(fixture, { GITHUB_RUN_ATTEMPT: "2" });
    assert.equal(checked.result.status, 0, checked.result.stderr);
    const context = contextFixture(checked);
    const bytes = Buffer.from(`${JSON.stringify(completeInputSubmission(checked))}\n`);
    fs.writeFileSync(path.join(checked.evidence, "submission.json"), bytes);
    const final = finalReviewInputCheck(checked, context);
    assert.equal(final.result.status, 0, final.result.stderr);
    if (final.step) {
      const outputs = parseOutput(final.output);
      assert.ok(fs.readFileSync(outputs.submission_file).equals(bytes), "validation must freeze exact tool-written bytes");
      assert.equal(outputs.submission_sha256, createHash("sha256").update(bytes).digest("hex"));
      const proof = JSON.parse(fs.readFileSync(path.join(checked.evidence, "submission-verification.json")));
      assert.equal(proof.input_verified, true);
      assert.equal(proof.provenance.run_attempt, options.producerAttempt || "2");
      assert.equal(proof.verification_provenance.run_attempt, "2");
    }
  }
});

test("final binding follows real omission-only recovery and freezes the unchanged submission", async (t) => {
  const fixture = fullInputFixture(t);
  const checked = freshReviewInputCheck(fixture);
  assert.equal(checked.result.status, 0, checked.result.stderr);
  const context = contextFixture(checked);
  let submitted;
  const result = await runReviewRecovery({ evidenceDirectory: checked.evidence, basePrompt: "fixture review",
    invokeAttempt: async ({ attempt }) => {
      if (attempt === 2) {
        submitted = JSON.stringify(completeInputSubmission(checked));
        fs.writeFileSync(path.join(checked.evidence, "submission.json"), submitted);
      }
      return { exitCode: 0 };
    } });
  assert.deepEqual(result.attempts.map((a) => a.submission_state), ["missing", "present"]);
  const final = finalReviewInputCheck(checked, context);
  assert.equal(final.result.status, 0, final.result.stderr);
  if (final.step) {
    const frozen = parseOutput(final.output).submission_file;
    fs.writeFileSync(path.join(checked.evidence, "submission.json"), JSON.stringify(validSubmission()));
    assert.equal(fs.readFileSync(frozen, "utf8"), submitted, "publisher must consume the validated bytes, not a changed source artifact");
  }
});

test("post-guard mutation during the recovery invocation still stops publication", async (t) => {
  const fixture = fullInputFixture(t);
  const checked = freshReviewInputCheck(fixture);
  assert.equal(checked.result.status, 0, checked.result.stderr);
  const context = contextFixture(checked);
  const result = await runReviewRecovery({ evidenceDirectory: checked.evidence, basePrompt: "fixture review",
    invokeAttempt: async ({ attempt }) => {
      if (attempt === 1) fs.writeFileSync(path.join(checked.evidence, "input-verification.json"), '{"input_verified":true}');
      if (attempt === 2) fs.writeFileSync(path.join(checked.evidence, "submission.json"), JSON.stringify(completeInputSubmission(checked)));
      return { exitCode: 0 };
    } });
  assert.equal(result.attempts.length, 2);
  const final = finalReviewInputCheck(checked, context);
  assert.notEqual(final.result.status, 0, "recovery bypassed the original trusted input receipt");
  assert.equal(fs.existsSync(final.publication), false);
});

test("a fresh review job verifies downloaded input before tools, model or publication", () => {
  const steps = workflow.jobs.review.steps;
  const verification = namedStep("review", inputVerificationName);
  assert.equal(verification.if, undefined);
  assert.notEqual(verification["continue-on-error"], true);
  const index = steps.indexOf(verification);
  assert.ok(index > steps.indexOf(namedStep("review", "Download deterministic evidence")));
  assert.equal(verification.env.REVIEW_EVIDENCE_ARTIFACT_NAME,
    namedStep("review", "Download deterministic evidence").with.name);
  for (const name of ["Verify and install the bounded review context", "Test deterministic review publisher",
    "Run bounded evidence-first OpenCode review", "Create eta-mu GitHub App token for review publication",
    "Publish actual GitHub pull request review"]) {
    assert.ok(index < steps.indexOf(namedStep("review", name)), `input must be verified before ${name}`);
  }
  assert.match(verification.run, /git diff --no-ext-diff --find-renames/);
  assert.match(verification.run, /git merge-base/);
  assert.match(namedStep("review", "Upload review attempt artifacts").with.path, /input-verification\.json/);
});

test("a successful malicious gate cannot replace full input and its matching manifest", (t) => {
  const fixture = fullInputFixture(t);
  const gateFile = path.join(fixture.scratch, "malicious-gate.cjs");
  fs.writeFileSync(gateFile, `
    const fs = require('node:fs'), crypto = require('node:crypto');
    const dir = process.env.GITHUB_WORKSPACE + '/.opencode/review-evidence/';
    const manifest = JSON.parse(fs.readFileSync(dir + 'input-manifest.json'));
    const replacement = Buffer.alloc(0);
    fs.writeFileSync(dir + 'basehead.diff', replacement);
    fs.writeFileSync(dir + 'pr.diff', replacement);
    manifest.full_diff.bytes = 0;
    manifest.full_diff.sha256 = crypto.createHash('sha256').update(replacement).digest('hex');
    manifest.preview.truncated = false;
    fs.writeFileSync(dir + 'input-manifest.json', JSON.stringify(manifest));
  `);
  const gates = runScript(namedStep("deterministic_evidence", "Run deterministic gates").run, fixture.directory,
    { ...fixture.env, CHECKOUT_EXACT_HEAD: "true", CHECKOUT_CLEAN: "true",
      EVIDENCE_GATES_SCRIPT: 'run_gate malicious node "$MALICIOUS_GATE_SCRIPT"', MALICIOUS_GATE_SCRIPT: gateFile });
  assert.equal(gates.status, 0, gates.stderr);
  assert.equal(fs.readFileSync(path.join(fixture.evidence, "statuses.env"), "utf8").trim(), "malicious=0");
  const manifest = JSON.parse(fs.readFileSync(path.join(fixture.evidence, "input-manifest.json")));
  assert.equal(manifest.full_diff.bytes, 0);
  assert.equal(manifest.full_diff.sha256, createHash("sha256").update(Buffer.alloc(0)).digest("hex"));
  const summary = runScript(namedStep("deterministic_evidence", "Summarize deterministic evidence").run,
    fixture.directory, summaryEnvironment(fixture.directory, path.join(fixture.scratch, "summary-output"), fixture.head,
      { PR_BASE_SHA: fixture.base }));
  assert.equal(summary.status, 0, summary.stderr);
  assert.equal(JSON.parse(fs.readFileSync(path.join(fixture.evidence, "summary.json"))).result, "success");
  const checked = freshReviewInputCheck(fixture);
  assert.notEqual(checked.result.status, 0, "a forged empty diff with matching manifest reached the model boundary");
  assert.equal(fs.existsSync(checked.invocation), false, "mismatch must stop model and API publication");
  assert.equal(fs.existsSync(path.join(checked.evidence, "input-verification.json")), false);
});

test("independent review accepts exact large, empty and divergent-base input", (t) => {
  for (const options of [{ large: true }, { empty: true }, { baseAhead: true }]) {
    const fixture = fullInputFixture(t, options);
    const checked = freshReviewInputCheck(fixture);
    assert.equal(checked.result.status, 0, checked.result.stderr);
    const proof = JSON.parse(fs.readFileSync(path.join(checked.evidence, "input-verification.json")));
    assert.equal(proof.schema, "open-hax.review-input-verification/v1");
    assert.equal(proof.input_verified, true);
    assert.equal(proof.base_sha, fixture.base);
    assert.equal(proof.diff_base_sha, fixture.ancestor);
    assert.equal(proof.head_sha, fixture.head);
    assert.equal(proof.full_diff.sha256, createHash("sha256").update(
      fs.readFileSync(path.join(fixture.evidence, "basehead.diff"))).digest("hex"));
    assert.equal(proof.provenance.run_id, "123");
    if (options.large) assert.ok(proof.full_diff.bytes > 300000);
  }
});

test("failed-job rerun verifies retained producer input and records both attempts", (t) => {
  const fixture = fullInputFixture(t, { producerAttempt: "1" });
  assert.equal(fixture.artifactName, "review-evidence-42-123-1");
  const checked = freshReviewInputCheck(fixture, { GITHUB_RUN_ATTEMPT: "2" });
  assert.equal(checked.result.status, 0, checked.result.stderr);
  const proof = JSON.parse(fs.readFileSync(path.join(checked.evidence, "input-verification.json")));
  const manifest = JSON.parse(fs.readFileSync(path.join(fixture.evidence, "input-manifest.json")));
  assert.deepEqual(proof.provenance, manifest.provenance);
  assert.deepEqual(proof.verification_provenance, { ...manifest.provenance, run_attempt: "2" });
  assert.equal(proof.evidence_artifact_name, fixture.artifactName);
  assert.equal(fs.existsSync(checked.invocation), true);
});

test("retained input refuses forged artifact scope, attempts and producer provenance before model", (t) => {
  const fixture = fullInputFixture(t, { producerAttempt: "1" });
  const manifestFile = path.join(fixture.evidence, "input-manifest.json");
  const original = JSON.parse(fs.readFileSync(manifestFile));
  for (const [artifactName, consumerAttempt, producerAttempt] of [
    [undefined, "2", "1"], ["", "2", "1"],
    ["review-context-123-1", "2", "1"], ["review-evidence-42-123-1-extra", "2", "1"],
    ["review-evidence-42-123-1\n", "2", "1"],
    ["review-evidence-43-123-1", "2", "1"], ["review-evidence-42-124-1", "2", "1"],
    ["review-evidence-42-123-0", "2", "0"], ["review-evidence-42-123-01", "2", "01"],
    ["review-evidence-42-123-3", "2", "3"],
    ["review-evidence-42-123-9007199254740993", "2", "9007199254740993"],
    [fixture.artifactName, "2", "2"], [fixture.artifactName, "2", 1],
    [fixture.artifactName, "0", "1"], [fixture.artifactName, "01", "1"],
    [fixture.artifactName, "", "1"], [fixture.artifactName, "2.0", "1"],
    [fixture.artifactName, "2\n", "1"],
  ]) {
    const manifest = structuredClone(original);
    manifest.provenance.run_attempt = producerAttempt;
    fs.writeFileSync(manifestFile, JSON.stringify(manifest));
    fs.writeFileSync(path.join(fixture.evidence, "input-verification.json"), JSON.stringify({ input_verified: true }));
    const checked = freshReviewInputCheck(fixture, {
      REVIEW_EVIDENCE_ARTIFACT_NAME: artifactName, GITHUB_RUN_ATTEMPT: consumerAttempt,
    });
    assert.notEqual(checked.result.status, 0, `invalid producer identity accepted: ${artifactName}/${consumerAttempt}/${producerAttempt}`);
    assert.equal(fs.existsSync(checked.invocation), false);
    assert.equal(fs.existsSync(path.join(checked.evidence, "input-verification.json")), false);
  }
});

test("independent review refuses altered manifest identities, size, hash and provenance", (t) => {
  const fixture = fullInputFixture(t);
  const file = path.join(fixture.evidence, "input-manifest.json");
  const original = JSON.parse(fs.readFileSync(file));
  const mutations = [
    (m) => { m.base_sha = "a".repeat(40); },
    (m) => { m.head_sha = "b".repeat(40); },
    (m) => { m.diff_base_sha = "c".repeat(40); },
    (m) => { m.full_diff.bytes += 1; },
    (m) => { m.full_diff.sha256 = "d".repeat(64); },
    (m) => { m.full_diff.path = "pr.diff"; },
    (m) => { m.preview.truncated = true; },
    (m) => { m.provenance.repository = "other/repo"; },
    (m) => { m.provenance.pull_request = "43"; },
    (m) => { m.provenance.run_id = "122"; },
    (m) => { m.provenance.run_attempt = "1"; },
    (m) => { m.provenance.workflow_sha = "e".repeat(40); },
    (m) => { m.provenance.workflow_ref = "other/workflow"; },
  ];
  for (const mutate of mutations) {
    const changed = structuredClone(original); mutate(changed);
    fs.writeFileSync(file, JSON.stringify(changed));
    const checked = freshReviewInputCheck(fixture);
    assert.notEqual(checked.result.status, 0, "mismatched artifact metadata was accepted");
    assert.equal(fs.existsSync(checked.invocation), false);
  }
  fs.writeFileSync(file, JSON.stringify(original));
  const fullPath = path.join(fixture.evidence, "basehead.diff");
  const full = fs.readFileSync(fullPath);
  const altered = Buffer.from(full); altered[altered.length - 2] ^= 1;
  fs.writeFileSync(fullPath, altered);
  const changedBytes = freshReviewInputCheck(fixture);
  assert.notEqual(changedBytes.result.status, 0, "equal-length changed bytes with untouched manifest were accepted");
  assert.match(changedBytes.result.stderr, /Downloaded full diff differs/);
  assert.equal(fs.existsSync(changedBytes.invocation), false);
  fs.writeFileSync(fullPath, full);
  fs.writeFileSync(path.join(fixture.evidence, "pr.diff"), "altered preview\n");
  const changedPreview = freshReviewInputCheck(fixture);
  assert.notEqual(changedPreview.result.status, 0);
  assert.match(changedPreview.result.stderr, /Preview differs/);
  assert.equal(fs.existsSync(changedPreview.invocation), false);
});

test("both checkout guards reject a valid caller SHA that is not the event PR head", (t) => {
  for (const [jobId, name] of [
    ["deterministic_evidence", "Verify exact and clean pull request checkout"],
    ["review", "Verify exact and clean review checkout"],
  ]) {
    const { directory, sha: eventHeadSha } = makeRepository(t);
    fs.writeFileSync(path.join(directory, "other.txt"), "caller-selected revision\n");
    execFileSync("git", ["add", "other.txt"], { cwd: directory });
    execFileSync("git", ["commit", "-qm", "other revision"], { cwd: directory });
    const callerSha = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: directory,
      encoding: "utf8",
    }).trim();
    const output = path.join(directory, `${jobId}-guard-output`);
    const result = runScript(
      namedStep(jobId, name).run,
      directory,
      guardEnvironment(directory, output, callerSha, eventHeadSha),
    );
    assert.notEqual(result.status, 0, `${jobId} accepted a non-event caller revision`);
    const values = parseOutput(output);
    assert.equal(values.expected_sha, callerSha);
    assert.equal(values.event_head_sha, eventHeadSha);
    assert.equal(values.event_head_matches, "false");
    assert.equal(values.exact_head, "false");
  }
});

test("toolchain setup defaults on when the input is absent and honors an explicit false", () => {
  const expected =
    "${{ !contains(toJSON(inputs), '\"setup_eta_mu_toolchain\"') || inputs.setup_eta_mu_toolchain }}";
  for (const name of [
    "Set up Java 21",
    "Set up Clojure CLI 1.12.5.1654",
    "Set up pnpm 10.14.0",
  ]) {
    const condition = namedStep("deterministic_evidence", name).if;
    assert.equal(condition, expected);
    assert.doesNotMatch(condition, /github\.event_name/);
  }

  const setupEnabled = (inputs) =>
    !("setup_eta_mu_toolchain" in inputs) || inputs.setup_eta_mu_toolchain;
  assert.equal(setupEnabled({}), true, "direct pull_request input key is absent");
  assert.equal(
    setupEnabled({ setup_eta_mu_toolchain: true }),
    true,
    "workflow_call default or explicit true installs",
  );
  assert.equal(
    setupEnabled({ setup_eta_mu_toolchain: false }),
    false,
    "workflow_call explicit false opts out",
  );

  const clojure = namedStep("deterministic_evidence", "Set up Clojure CLI 1.12.5.1654");
  assert.equal(clojure.with.bb, "1.13.219");
  assert.equal(clojure.with["clj-kondo"], "2025.10.23");
});

test("default deterministic gates mirror private Git dependencies without persisting auth", () => {
  const setupCondition =
    "${{ !contains(toJSON(inputs), '\"setup_eta_mu_toolchain\"') || inputs.setup_eta_mu_toolchain }}";
  const detect = namedStep("deterministic_evidence", "Detect eta-mu app credentials");
  assert.equal(detect.if, setupCondition);

  const token = namedStep("deterministic_evidence", "Create cross-repository read token");
  assert.match(token.uses, /^actions\/create-github-app-token@[0-9a-f]{40}$/);
  assert.match(token.with.repositories, /^katamorph\s*$/);

  const mirror = namedStep("deterministic_evidence", "Mirror private Git dependencies");
  assert.match(mirror.if, /dependency-token\.outputs\.token/);
  assert.match(mirror.run, /clone --mirror/);
  assert.match(mirror.run, /mirror_repository katamorph/);
  assert.doesNotMatch(mirror.run, /event-ledger/);

  const gates = namedStep("deterministic_evidence", "Run deterministic gates").run;
  assert.match(gates, /url\.file:\/\/\$mirrors\/katamorph\.git\.insteadOf/);
  assert.doesNotMatch(gates, /event-ledger/);
  assert.match(gates, /trap remove_mirror_rewrites EXIT/);
});

test("the default reusable evidence script executes every declared gate", (t) => {
  const { directory } = makeRepository(t);
  addGeneratedOutputs(directory);
  const fakeBin = path.join(directory, "fake-bin");
  const fakePnpm = path.join(fakeBin, "pnpm");
  fs.mkdirSync(fakeBin, { recursive: true });
  fs.writeFileSync(fakePnpm, "#!/bin/sh\nexit 0\n");
  fs.chmodSync(fakePnpm, 0o755);
  const runnerTemp = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-review-runner-"));
  t.after(() => fs.rmSync(runnerTemp, { recursive: true, force: true }));

  const result = runScript(
    namedStep("deterministic_evidence", "Run deterministic gates").run,
    directory,
    {
      CHECKOUT_CLEAN: "true",
      CHECKOUT_EXACT_HEAD: "true",
      EVIDENCE_GATES_SCRIPT:
        workflow.on.workflow_call.inputs.evidence_gates_script.default,
      GITHUB_WORKSPACE: directory,
      PATH: `${fakeBin}:${process.env.PATH}`,
      RUNNER_TEMP: runnerTemp,
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(
    parseOutput(path.join(directory, ".opencode/review-evidence/statuses.env")),
    {
      install: "0",
      bootstrap_extensions: "0",
      lint: "0",
      test: "0",
      generated_outputs_baseline: "0",
      build: "0",
      generated_outputs_restore: "0",
    },
  );
});

test("artifact names do not claim an unverified head revision", () => {
  for (const name of [
    namedStep("deterministic_evidence", "Upload deterministic evidence").with.name,
    namedStep("prepare_review_context", "Upload review context").with.name,
    namedStep("review", "Upload review attempt artifacts").with.name,
  ]) {
    assert.doesNotMatch(name, /pull_request\.head\.sha/);
  }
  assert.equal(
    namedStep("deterministic_evidence", "Bind deterministic artifact name").env.RUN_ID,
    "${{ github.run_id }}",
  );
  assert.equal(
    namedStep("prepare_review_context", "Bind review-context artifact name").env.RUN_ID,
    "${{ github.run_id }}",
  );
  assert.match(namedStep("review", "Upload review attempt artifacts").with.name, /github\.run_id/);
  assert.equal(namedStep("deterministic_evidence", "Upload deterministic evidence").if, "always()");
  assert.equal(namedStep("review", "Upload review attempt artifacts").if, "always()");
});

test("review downloads the immutable artifact names emitted by prerequisite jobs", () => {
  assert.equal(
    workflow.jobs.deterministic_evidence.outputs.artifact_name,
    "${{ steps.deterministic_artifact_name.outputs.name }}",
  );
  assert.equal(
    workflow.jobs.prepare_review_context.outputs.artifact_name,
    "${{ steps.context_artifact_name.outputs.name }}",
  );

  const evidenceDownload = namedStep("review", "Download deterministic evidence");
  const contextDownload = namedStep("review", "Download Muse tools and global skills");
  assert.equal(evidenceDownload.with.name, "${{ needs.deterministic_evidence.outputs.artifact_name }}");
  assert.equal(contextDownload.with.name, "${{ needs.prepare_review_context.outputs.artifact_name }}");
  assert.doesNotMatch(evidenceDownload.with.name, /github\.run_attempt/);
  assert.doesNotMatch(contextDownload.with.name, /github\.run_attempt/);
});

function packagedRecoveryRunner() {
  const assembly = namedStep("prepare_review_context", "Assemble revision-bound review context");
  const match = assembly.run.match(
    /<<'ETA_MU_RECOVERY_RUNNER_BASE64'\n([\s\S]*?)\nETA_MU_RECOVERY_RUNNER_BASE64/,
  );
  assert.ok(match, "review context must carry the bounded recovery runner payload");
  return Buffer.from(match[1].replace(/\s+/g, ""), "base64").toString("utf8");
}

test("review context packages the exact runner for reusable-workflow callers", () => {
  assert.equal(packagedRecoveryRunner(), recoveryRunnerSource);
  assert.equal(
    namedStep("review", "Run bounded evidence-first OpenCode review").run,
    "node .review-context/machinery/run-opencode-review-recovery.mjs",
  );
});

test("workflow bounds recovery before validating and publishing the submission", () => {
  const recovery = namedStep("review", "Run bounded evidence-first OpenCode review");
  assert.match(recovery.run, /run-opencode-review-recovery\.mjs/);

  const steps = workflow.jobs.review.steps.map((step) => step.name);
  const validateIndex = steps.indexOf("Validate final review submission");
  const uploadIndex = steps.indexOf("Upload review attempt artifacts");
  const publishIndex = steps.indexOf("Publish actual GitHub pull request review");
  assert.ok(validateIndex > steps.indexOf(recovery.name));
  assert.ok(uploadIndex > validateIndex);
  assert.ok(publishIndex > uploadIndex);

  const uploadPaths = namedStep("review", "Upload review attempt artifacts").with.path;
  assert.match(uploadPaths, /model-response-attempt-1\.txt/);
  assert.match(uploadPaths, /model-response-attempt-2\.txt/);
  assert.match(uploadPaths, /opencode-stderr-attempt-1\.log/);
  assert.match(uploadPaths, /opencode-stderr-attempt-2\.log/);
  assert.match(uploadPaths, /recovery\.json/);
});

test("operator docs distinguish in-job recovery from a failed-job rerun", () => {
  assert.match(workflowDocs, /exactly one corrective model invocation/i);
  assert.match(workflowDocs, /missing `review_submit`/i);
  assert.match(workflowDocs, /failed-job re-run/i);
  assert.match(workflowDocs, /prerequisite jobs? emitted/i);
  assert.match(workflowDocs, /malformed.*fail closed/is);
  assert.match(workflowDocs, /invocation that rejects.*null exit code/is);
  assert.match(workflowDocs, /stream files are finalized/is);
});

function recoveryFixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-review-recovery-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return {
    directory,
    submissionFile: path.join(directory, "submission.json"),
  };
}

function validSubmission() {
  return {
    schema: "open-hax.github-review/v1",
    event: "APPROVE",
    summary: "No confirmed defects survived validation.",
    comments: [],
  };
}

test("first-pass submission does not invoke recovery", async (t) => {
  const { directory, submissionFile } = recoveryFixture(t);
  const calls = [];
  const result = await runReviewRecovery({
    evidenceDirectory: directory,
    basePrompt: "review the change",
    submissionFile,
    invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
      calls.push({ attempt, prompt });
      fs.writeFileSync(responseFile, "first response\n");
      fs.writeFileSync(stderrFile, "first stderr\n");
      fs.writeFileSync(submissionFile, `${JSON.stringify(validSubmission())}\n`);
      return { exitCode: 0 };
    },
  });

  assert.equal(calls.length, 1);
  assert.equal(result.attempts.length, 1);
  assert.equal(result.attempts[0].submission_state, "present");
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "first response\n");
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
});

test("one omitted submission receives exactly one corrective attempt", async (t) => {
  const { directory, submissionFile } = recoveryFixture(t);
  const calls = [];
  const result = await runReviewRecovery({
    evidenceDirectory: directory,
    basePrompt: "review the change",
    submissionFile,
    invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
      calls.push({ attempt, prompt });
      fs.writeFileSync(responseFile, `response ${attempt}\n`);
      fs.writeFileSync(stderrFile, `stderr ${attempt}\n`);
      if (attempt === 2) {
        fs.writeFileSync(submissionFile, `${JSON.stringify(validSubmission())}\n`);
      }
      return { exitCode: 0 };
    },
  });

  assert.deepEqual(calls.map(({ attempt }) => attempt), [1, 2]);
  assert.match(calls[1].prompt, /corrective attempt 2 of 2/i);
  assert.match(calls[1].prompt, /review_submit/);
  assert.deepEqual(result.attempts.map(({ submission_state }) => submission_state), ["missing", "present"]);
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "response 1\n");
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-2.txt"), "utf8"), "response 2\n");
});

test("repeated omission fails closed after two retained attempts", async (t) => {
  const { directory, submissionFile } = recoveryFixture(t);
  const calls = [];
  await assert.rejects(
    runReviewRecovery({
      evidenceDirectory: directory,
      basePrompt: "review the change",
      submissionFile,
      invokeAttempt: async ({ attempt, responseFile, stderrFile }) => {
        calls.push(attempt);
        fs.writeFileSync(responseFile, `response ${attempt}\n`);
        fs.writeFileSync(stderrFile, `stderr ${attempt}\n`);
        return { exitCode: 0 };
      },
    }),
    /omitted review_submit after 2 attempts/,
  );
  assert.deepEqual(calls, [1, 2]);
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.deepEqual(recovery.attempts.map(({ submission_state }) => submission_state), ["missing", "missing"]);
});

test("malformed submission fails closed without consuming the recovery attempt", async (t) => {
  const { directory, submissionFile } = recoveryFixture(t);
  const calls = [];
  await assert.rejects(
    runReviewRecovery({
      evidenceDirectory: directory,
      basePrompt: "review the change",
      submissionFile,
      invokeAttempt: async ({ attempt, responseFile, stderrFile }) => {
        calls.push(attempt);
        fs.writeFileSync(responseFile, "malformed response\n");
        fs.writeFileSync(stderrFile, "malformed stderr\n");
        fs.writeFileSync(submissionFile, "{broken\n");
        return { exitCode: 0 };
      },
    }),
    /malformed review submission/,
  );
  assert.deepEqual(calls, [1]);
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
});

test("non-zero completed invocation records its evidence and does not retry", async (t) => {
  const { directory, submissionFile } = recoveryFixture(t);
  const calls = [];
  await assert.rejects(
    runReviewRecovery({
      evidenceDirectory: directory,
      basePrompt: "review the change",
      submissionFile,
      invokeAttempt: async ({ attempt, responseFile, stderrFile }) => {
        calls.push(attempt);
        fs.writeFileSync(responseFile, "failed response\n");
        fs.writeFileSync(stderrFile, "failed stderr\n");
        return { exitCode: 17 };
      },
    }),
    /attempt 1 exited 17/,
  );

  assert.deepEqual(calls, [1]);
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.deepEqual(recovery.attempts, [
    {
      attempt: 1,
      exit_code: 17,
      invocation_state: "completed",
      response_file: "model-response-attempt-1.txt",
      stderr_file: "opencode-stderr-attempt-1.log",
      submission_state: "missing",
    },
  ]);
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "failed response\n");
  assert.equal(fs.readFileSync(path.join(directory, "opencode-stderr-attempt-1.log"), "utf8"), "failed stderr\n");
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
});

test("rejected invocation is recorded once and rethrows the original error", async (t) => {
  const { directory, submissionFile } = recoveryFixture(t);
  const invocationError = new Error("fixture invocation rejected");
  await assert.rejects(
    runReviewRecovery({
      evidenceDirectory: directory,
      basePrompt: "review the change",
      submissionFile,
      invokeAttempt: async () => {
        throw invocationError;
      },
    }),
    (error) => error === invocationError,
  );

  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.equal(recovery.attempts.length, 1);
  assert.deepEqual(recovery.attempts[0], {
    attempt: 1,
    exit_code: null,
    invocation_state: "rejected",
    response_file: "model-response-attempt-1.txt",
    stderr_file: "opencode-stderr-attempt-1.log",
    submission_state: "missing",
    invocation_error: "fixture invocation rejected",
  });
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "");
  assert.equal(fs.readFileSync(path.join(directory, "opencode-stderr-attempt-1.log"), "utf8"), "");
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
});

test("recovery CLI preserves both real child-process streams", (t) => {
  const { directory } = recoveryFixture(t);
  const promptFile = path.join(directory, "prompt.md");
  const fakeOpenCode = path.join(directory, "fake-opencode.mjs");
  const packagedRunner = path.join(directory, "run-opencode-review-recovery.mjs");
  fs.writeFileSync(promptFile, "Review pull request #{{PR_NUMBER}}.\n");
  fs.writeFileSync(packagedRunner, packagedRecoveryRunner());
  fs.writeFileSync(
    fakeOpenCode,
    `#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const evidence = process.env.REVIEW_EVIDENCE_DIR;
const countFile = path.join(evidence, "fake-count.txt");
const attempt = fs.existsSync(countFile) ? Number(fs.readFileSync(countFile, "utf8")) + 1 : 1;
fs.writeFileSync(countFile, String(attempt));
console.log("model response " + attempt);
console.error("model stderr " + attempt);
if (attempt === 2) {
  fs.writeFileSync(path.join(evidence, "submission.json"), JSON.stringify(${JSON.stringify(validSubmission())}) + "\\n");
}
`,
  );
  fs.chmodSync(fakeOpenCode, 0o755);

  const result = spawnSync(
    process.execPath,
    [packagedRunner],
    {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        OPENCODE_BIN: fakeOpenCode,
        PR_NUMBER: "296",
        REVIEW_EVIDENCE_DIR: directory,
        REVIEW_MODEL: "fixture/model",
        REVIEW_PROMPT_FILE: promptFile,
      },
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "model response 1\n");
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-2.txt"), "utf8"), "model response 2\n");
  assert.equal(fs.readFileSync(path.join(directory, "opencode-stderr-attempt-1.log"), "utf8"), "model stderr 1\n");
  assert.equal(fs.readFileSync(path.join(directory, "opencode-stderr-attempt-2.log"), "utf8"), "model stderr 2\n");
  assert.deepEqual(
    JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8")).attempts.map(
      ({ submission_state }) => submission_state,
    ),
    ["missing", "present"],
  );
});

test("recovery CLI finalizes streams and records a spawn failure", (t) => {
  const { directory } = recoveryFixture(t);
  const promptFile = path.join(directory, "prompt.md");
  const packagedRunner = path.join(directory, "run-opencode-review-recovery.mjs");
  fs.writeFileSync(promptFile, "Review pull request #{{PR_NUMBER}}.\n");
  fs.writeFileSync(packagedRunner, packagedRecoveryRunner());

  const result = spawnSync(process.execPath, [packagedRunner], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    env: {
      ...process.env,
      OPENCODE_BIN: path.join(directory, "missing-opencode"),
      PR_NUMBER: "296",
      REVIEW_EVIDENCE_DIR: directory,
      REVIEW_MODEL: "fixture/model",
      REVIEW_PROMPT_FILE: promptFile,
    },
  });

  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ENOENT/);
  assert.equal(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), "");
  assert.equal(fs.readFileSync(path.join(directory, "opencode-stderr-attempt-1.log"), "utf8"), "");
  const recovery = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.equal(recovery.attempts.length, 1);
  assert.equal(recovery.attempts[0].invocation_state, "rejected");
  assert.match(recovery.attempts[0].invocation_error, /ENOENT/);
  assert.equal(fs.existsSync(path.join(directory, "model-response-attempt-2.txt")), false);
});

test("deterministic checkout guard records independently executed SHA", (t) => {
  const { directory, sha } = makeRepository(t);
  const output = path.join(directory, "guard-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Verify exact and clean pull request checkout").run,
    directory,
    guardEnvironment(directory, output, sha),
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(parseOutput(output), {
    event_head_sha: sha,
    expected_sha: sha,
    executed_sha: sha,
    expected_commit: "true",
    event_head_matches: "true",
    exact_head: "true",
    clean: "true",
  });
  const evidence = JSON.parse(
    fs.readFileSync(path.join(directory, ".opencode/review-evidence/checkout.json"), "utf8"),
  );
  assert.equal(evidence.event_head_sha, sha);
  assert.equal(evidence.event_head_matches, true);
  assert.equal(evidence.executed_sha, sha);
  assert.equal(evidence.exact_head, true);
});

test("deterministic checkout guard rejects a copied expected SHA mismatch", (t) => {
  const { directory, sha } = makeRepository(t);
  fs.writeFileSync(path.join(directory, "other.txt"), "other revision\n");
  execFileSync("git", ["add", "other.txt"], { cwd: directory });
  execFileSync("git", ["commit", "-qm", "other revision"], { cwd: directory });
  const expected = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: directory,
    encoding: "utf8",
  }).trim();
  execFileSync("git", ["checkout", "-q", "--detach", sha], { cwd: directory });
  const output = path.join(directory, "guard-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Verify exact and clean pull request checkout").run,
    directory,
    guardEnvironment(directory, output, expected),
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Expected pull-request head/);
  const values = parseOutput(output);
  assert.equal(values.expected_sha, expected);
  assert.equal(values.executed_sha, sha);
  assert.equal(values.expected_commit, "true");
  assert.equal(values.exact_head, "false");
});

test("deterministic checkout guard rejects a non-commit reusable target", (t) => {
  const { directory } = makeRepository(t);
  const output = path.join(directory, "guard-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Verify exact and clean pull request checkout").run,
    directory,
    guardEnvironment(directory, output, "main"),
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /not an available immutable commit/);
  assert.equal(parseOutput(output).expected_commit, "false");
});

test("deterministic checkout guard rejects a dirty tree", (t) => {
  const { directory, sha } = makeRepository(t);
  fs.writeFileSync(path.join(directory, "unexpected.txt"), "dirty\n");
  const output = path.join(directory, "guard-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Verify exact and clean pull request checkout").run,
    directory,
    guardEnvironment(directory, output, sha),
  );
  assert.notEqual(result.status, 0);
  assert.equal(parseOutput(output).clean, "false");
});

test("review checkout independently rejects an expected SHA mismatch", (t) => {
  const { directory, sha } = makeRepository(t);
  fs.writeFileSync(path.join(directory, "other.txt"), "other revision\n");
  execFileSync("git", ["add", "other.txt"], { cwd: directory });
  execFileSync("git", ["commit", "-qm", "other revision"], { cwd: directory });
  const expected = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: directory,
    encoding: "utf8",
  }).trim();
  execFileSync("git", ["checkout", "-q", "--detach", sha], { cwd: directory });
  const output = path.join(directory, "review-guard-output");
  const result = runScript(
    namedStep("review", "Verify exact and clean review checkout").run,
    directory,
    guardEnvironment(directory, output, expected),
  );
  assert.notEqual(result.status, 0);
  const values = parseOutput(output);
  assert.equal(values.expected_sha, expected);
  assert.equal(values.executed_sha, sha);
  assert.equal(values.expected_commit, "true");
  assert.equal(values.exact_head, "false");
});

test("deterministic summary reports success only for exact clean zero exits", (t) => {
  const { directory, sha } = makeRepository(t);
  const evidenceDirectory = path.join(directory, ".opencode/review-evidence");
  fs.mkdirSync(evidenceDirectory, { recursive: true });
  fs.writeFileSync(path.join(evidenceDirectory, "statuses.env"), "unit=0\nintegration=0\n");
  const output = path.join(directory, "summary-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Summarize deterministic evidence").run,
    directory,
    summaryEnvironment(directory, output, sha),
  );
  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(fs.readFileSync(path.join(evidenceDirectory, "summary.json"), "utf8"));
  assert.equal(summary.schema, "open-hax.review-evidence/v2");
  assert.equal(summary.result, "success");
  assert.equal(summary.expected_head_sha, sha);
  assert.equal(summary.executed_sha, sha);
  assert.equal(summary.completion_sha, sha);
  assert.equal(summary.head_sha, sha);
  assert.equal(summary.exact_head, true);
  assert.equal(parseOutput(output).result, "success");
});

test("deterministic summary stays available and red when a gate fails", (t) => {
  const { directory, sha } = makeRepository(t);
  const evidenceDirectory = path.join(directory, ".opencode/review-evidence");
  fs.mkdirSync(evidenceDirectory, { recursive: true });
  fs.writeFileSync(path.join(evidenceDirectory, "statuses.env"), "unit=1\nintegration=0\n");
  const output = path.join(directory, "summary-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Summarize deterministic evidence").run,
    directory,
    summaryEnvironment(directory, output, sha),
  );
  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(fs.readFileSync(path.join(evidenceDirectory, "summary.json"), "utf8"));
  assert.equal(summary.result, "failure");
  assert.deepEqual(summary.statuses, { unit: 1, integration: 0 });
  assert.equal(parseOutput(output).result, "failure");
});

test("deterministic summary never labels mismatched evidence exact-head", (t) => {
  const { directory, sha } = makeRepository(t);
  const evidenceDirectory = path.join(directory, ".opencode/review-evidence");
  fs.mkdirSync(evidenceDirectory, { recursive: true });
  fs.writeFileSync(path.join(evidenceDirectory, "statuses.env"), "unit=0\n");
  const output = path.join(directory, "summary-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Summarize deterministic evidence").run,
    directory,
    summaryEnvironment(directory, output, sha, { CHECKOUT_EXECUTED_SHA: "e".repeat(40) }),
  );
  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(fs.readFileSync(path.join(evidenceDirectory, "summary.json"), "utf8"));
  assert.equal(summary.result, "failure");
  assert.equal(summary.exact_head, false);
  assert.equal(summary.head_sha, null);
  assert.match(summary.errors.join("\n"), /not one exact pull-request head/);
});

test("deterministic summary fails closed when status output is missing", (t) => {
  const { directory, sha } = makeRepository(t);
  const output = path.join(directory, "summary-output");
  const result = runScript(
    namedStep("deterministic_evidence", "Summarize deterministic evidence").run,
    directory,
    summaryEnvironment(directory, output, sha),
  );
  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(
    fs.readFileSync(path.join(directory, ".opencode/review-evidence/summary.json"), "utf8"),
  );
  assert.equal(summary.result, "failure");
  assert.match(summary.errors.join("\n"), /statuses\.env is missing/);
});

test("build gate archives and restores every explicit tracked generated output", (t) => {
  const { directory } = makeRepository(t);
  const outputs = addGeneratedOutputs(directory);
  const runnerTemp = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-review-runner-"));
  t.after(() => fs.rmSync(runnerTemp, { recursive: true, force: true }));
  const mutation = generatedOutputPaths
    .map((relativePath) => `printf 'regenerated ${relativePath}' > ${relativePath}`)
    .join("; ");
  const result = runScript(
    namedStep("deterministic_evidence", "Run deterministic gates").run,
    directory,
    {
      CHECKOUT_CLEAN: "true",
      CHECKOUT_EXACT_HEAD: "true",
      EVIDENCE_GATES_SCRIPT: `run_gate_preserving_generated_outputs build bash -c "${mutation}"`,
      GITHUB_WORKSPACE: directory,
      RUNNER_TEMP: runnerTemp,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  for (const [index, output] of outputs.entries()) {
    const relativePath = generatedOutputPaths[index];
    assert.equal(fs.readFileSync(output, "utf8"), `checked-in ${relativePath}\n`);
    const archived = path.join(directory, ".opencode/review-evidence/generated", relativePath);
    assert.equal(fs.readFileSync(archived, "utf8"), `regenerated ${relativePath}`);
    assert.match(fs.readFileSync(`${archived}.sha256`, "utf8"), /^[0-9a-f]{64}\s+/);
  }
  assert.deepEqual(
    parseOutput(path.join(directory, ".opencode/review-evidence/statuses.env")),
    {
      generated_outputs_baseline: "0",
      build: "0",
      generated_outputs_restore: "0",
    },
  );
  assert.equal(
    execFileSync("git", ["diff", "--name-only"], { cwd: directory, encoding: "utf8" }),
    "",
  );
});

test("build gate never hides a generated-output mutation that predates the build", (t) => {
  const { directory } = makeRepository(t);
  const [catalog] = addGeneratedOutputs(directory);
  fs.writeFileSync(catalog, "unexpected prior mutation\n");
  const runnerTemp = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-review-runner-"));
  t.after(() => fs.rmSync(runnerTemp, { recursive: true, force: true }));
  const result = runScript(
    namedStep("deterministic_evidence", "Run deterministic gates").run,
    directory,
    {
      CHECKOUT_CLEAN: "true",
      CHECKOUT_EXACT_HEAD: "true",
      EVIDENCE_GATES_SCRIPT: "run_gate_preserving_generated_outputs build bash -c true",
      GITHUB_WORKSPACE: directory,
      RUNNER_TEMP: runnerTemp,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(catalog, "utf8"), "unexpected prior mutation\n");
  assert.deepEqual(
    parseOutput(path.join(directory, ".opencode/review-evidence/statuses.env")),
    {
      generated_outputs_baseline: "1",
      build: "0",
      generated_outputs_restore: "125",
    },
  );
  assert.match(
    execFileSync("git", ["diff", "--name-only"], { cwd: directory, encoding: "utf8" }),
    /models\.generated\.ts/,
  );
});

test("review completion permits only review artifacts and preserves revision", (t) => {
  const { directory, sha } = makeRepository(t);
  fs.mkdirSync(path.join(directory, ".opencode/review-evidence"), { recursive: true });
  fs.mkdirSync(path.join(directory, ".review-context"), { recursive: true });
  fs.writeFileSync(path.join(directory, ".opencode/review-evidence/model-response.txt"), "response\n");
  fs.writeFileSync(path.join(directory, ".review-context/context.txt"), "context\n");
  const output = path.join(directory, "review-output");
  const result = runScript(
    namedStep("review", "Verify review remained revision-bound").run,
    directory,
    {
      EXPECTED_SHA: sha,
      EXECUTED_SHA: sha,
      GITHUB_OUTPUT: output,
      INITIAL_CLEAN: "true",
      INITIAL_EXACT_HEAD: "true",
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(parseOutput(output), {
    expected_sha: sha,
    executed_sha: sha,
    completion_sha: sha,
    exact_head: "true",
    clean: "true",
  });
});

test("review completion rejects tracked mutation", (t) => {
  const { directory, sha } = makeRepository(t);
  fs.writeFileSync(path.join(directory, "tracked.txt"), "mutated\n");
  const output = path.join(directory, "review-output");
  const result = runScript(
    namedStep("review", "Verify review remained revision-bound").run,
    directory,
    {
      EXPECTED_SHA: sha,
      EXECUTED_SHA: sha,
      GITHUB_OUTPUT: output,
      INITIAL_CLEAN: "true",
      INITIAL_EXACT_HEAD: "true",
    },
  );
  assert.notEqual(result.status, 0);
  assert.equal(parseOutput(output).clean, "false");
});

test("review completion rejects untracked files outside bounded artifacts", (t) => {
  const { directory, sha } = makeRepository(t);
  fs.mkdirSync(path.join(directory, ".opencode"), { recursive: true });
  fs.writeFileSync(path.join(directory, ".opencode/unexpected.txt"), "unexpected\n");
  const output = path.join(directory, "review-output");
  const result = runScript(
    namedStep("review", "Verify review remained revision-bound").run,
    directory,
    {
      EXPECTED_SHA: sha,
      EXECUTED_SHA: sha,
      GITHUB_OUTPUT: output,
      INITIAL_CLEAN: "true",
      INITIAL_EXACT_HEAD: "true",
    },
  );
  assert.notEqual(result.status, 0);
  assert.equal(parseOutput(output).clean, "false");
});

test("terminal gate passes only the complete successful exact-head tuple", (t) => {
  const { directory, sha } = makeRepository(t);
  const script = namedStep("review_gate", "Enforce truthful reusable review result").run;
  const success = runScript(script, directory, finalGateEnvironment(sha));
  assert.equal(success.status, 0, success.stderr);

  const failures = [
    { DETERMINISTIC_JOB_RESULT: "failure" },
    { DETERMINISTIC_OUTPUT_RESULT: "failure" },
    { DETERMINISTIC_OUTPUT_RESULT: "" },
    { CONTEXT_JOB_RESULT: "failure" },
    { REVIEW_JOB_RESULT: "skipped" },
    { DETERMINISTIC_EXECUTED_SHA: "d".repeat(40) },
    { REVIEW_COMPLETION_SHA: "c".repeat(40) },
    { DETERMINISTIC_EXACT_HEAD: "false" },
    { REVIEW_CLEAN: "false" },
  ];
  for (const mutation of failures) {
    const result = runScript(script, directory, finalGateEnvironment(sha, mutation));
    assert.notEqual(result.status, 0, JSON.stringify(mutation));
    assert.match(result.stderr, /::error::OpenCode evidence review gate/);
  }
});

test("terminal gate treats unsupported pull requests as explicitly not applicable", (t) => {
  const { directory, sha } = makeRepository(t);
  const script = namedStep("review_gate", "Enforce truthful reusable review result").run;
  for (const mutation of [{ ELIGIBLE_REVIEW_EVENT: "false" }]) {
    const result = runScript(script, directory, finalGateEnvironment(sha, {
      ...mutation,
      CONTEXT_JOB_RESULT: "skipped",
      DETERMINISTIC_JOB_RESULT: "skipped",
      DETERMINISTIC_OUTPUT_RESULT: "",
      REVIEW_JOB_RESULT: "skipped",
    }));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /not applicable to draft or fork pull requests/);
  }
});

test("terminal gate fails closed without pull request context", (t) => {
  const { directory, sha } = makeRepository(t);
  const script = namedStep("review_gate", "Enforce truthful reusable review result").run;
  for (const pullRequestEvent of ["false", ""]) {
    const result = runScript(script, directory, finalGateEnvironment(sha, {
      PULL_REQUEST_EVENT: pullRequestEvent,
      ELIGIBLE_REVIEW_EVENT: "false",
      CONTEXT_JOB_RESULT: "skipped",
      DETERMINISTIC_JOB_RESULT: "skipped",
      DETERMINISTIC_OUTPUT_RESULT: "",
      REVIEW_JOB_RESULT: "skipped",
    }));
    assert.notEqual(result.status, 0, pullRequestEvent);
    assert.match(result.stderr, /pull_request_context=missing/);
  }
});
