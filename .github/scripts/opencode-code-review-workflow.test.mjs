// SPDX-License-Identifier: GPL-3.0-or-later

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
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
  assert.match(token.with.repositories, /^katamorph\nevent-ledger\s*$/);

  const mirror = namedStep("deterministic_evidence", "Mirror private Git dependencies");
  assert.match(mirror.if, /dependency-token\.outputs\.token/);
  assert.match(mirror.run, /clone --mirror/);
  assert.match(mirror.run, /mirror_repository katamorph/);
  assert.match(mirror.run, /mirror_repository event-ledger/);

  const gates = namedStep("deterministic_evidence", "Run deterministic gates").run;
  assert.match(gates, /url\.file:\/\/\$mirrors\/katamorph\.git\.insteadOf/);
  assert.match(gates, /url\.file:\/\/\$mirrors\/event-ledger\.git\.insteadOf/);
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
