// SPDX-License-Identifier: GPL-3.0-or-later

const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");
const test = require("node:test");

const root = path.resolve(__dirname, "../..");
const workflowPath =
  process.env.ETA_MU_REVIEW_WORKFLOW_PATH ||
  path.join(root, ".github/workflows/opencode-code-review.yml");
const requireFromEtaMu = createRequire(path.join(root, "packages/eta-mu/package.json"));
const YAML = requireFromEtaMu("yaml");
const workflowText = fs.readFileSync(workflowPath, "utf8");
const workflow = YAML.parse(workflowText);

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

function guardEnvironment(directory, output, expectedSha) {
  return {
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

  const deterministic = workflow.jobs.deterministic_evidence;
  for (const output of ["result", "expected_sha", "executed_sha", "completion_sha", "exact_head", "clean"]) {
    assert.equal(typeof deterministic.outputs[output], "string");
  }
  assert.doesNotMatch(workflow.jobs.review.if, /deterministic_evidence\.outputs\.result/);
});

test("both pull-request jobs explicitly checkout and guard the event head", () => {
  for (const jobId of ["deterministic_evidence", "review"]) {
    const checkout = namedStep(jobId, "Checkout pull request");
    assert.equal(checkout.with.ref, "${{ github.event.pull_request.head.sha }}");
    assert.equal(checkout.with["persist-credentials"], false);
  }
  assert.match(namedStep("deterministic_evidence", "Verify exact and clean pull request checkout").run, /git rev-parse HEAD/);
  assert.match(namedStep("review", "Verify exact and clean review checkout").run, /git rev-parse HEAD/);
});

test("artifact names do not claim an unverified head revision", () => {
  for (const name of [
    namedStep("deterministic_evidence", "Upload deterministic evidence").with.name,
    namedStep("prepare_review_context", "Upload review context").with.name,
    namedStep("review", "Upload review attempt artifacts").with.name,
  ]) {
    assert.doesNotMatch(name, /pull_request\.head\.sha/);
    assert.match(name, /github\.run_id/);
  }
  assert.equal(namedStep("deterministic_evidence", "Upload deterministic evidence").if, "always()");
  assert.equal(namedStep("review", "Upload review attempt artifacts").if, "always()");
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
    expected_sha: sha,
    executed_sha: sha,
    exact_head: "true",
    clean: "true",
  });
  const evidence = JSON.parse(
    fs.readFileSync(path.join(directory, ".opencode/review-evidence/checkout.json"), "utf8"),
  );
  assert.equal(evidence.executed_sha, sha);
  assert.equal(evidence.exact_head, true);
});

test("deterministic checkout guard rejects a copied expected SHA mismatch", (t) => {
  const { directory, sha } = makeRepository(t);
  const output = path.join(directory, "guard-output");
  const expected = "f".repeat(40);
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
  assert.equal(values.exact_head, "false");
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
  const output = path.join(directory, "review-guard-output");
  const expected = "b".repeat(40);
  const result = runScript(
    namedStep("review", "Verify exact and clean review checkout").run,
    directory,
    guardEnvironment(directory, output, expected),
  );
  assert.notEqual(result.status, 0);
  const values = parseOutput(output);
  assert.equal(values.expected_sha, expected);
  assert.equal(values.executed_sha, sha);
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
