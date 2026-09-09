// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { assertCandidate, assertEnvironment, assertHumanApproval, verifyPremerge } from "./sol-premerge.mjs";

const head = "a".repeat(40);
const machinery = "b".repeat(40);
const repository = { full_name: "open-hax/eta-mu", default_branch: "main" };
const branch = { commit: { sha: machinery }, protected: true };
const candidate = {
  number: 328, state: "open", merged: false,
  head: { sha: head, repo: { full_name: repository.full_name } },
  base: { ref: "main", repo: { full_name: repository.full_name } },
};
const envelope = {
  eventName: "workflow_dispatch", runAttempt: 1, number: 328, headSha: head,
  repository: repository.full_name, ref: "refs/heads/main", sha: machinery,
  workflowRef: "open-hax/eta-mu/.github/workflows/sol-premerge.yml@refs/heads/main",
  workflowSha: machinery,
};
const environment = {
  name: "sol-premerge", id: 42, can_admins_bypass: false,
  protection_rules: [{ type: "required_reviewers", prevent_self_review: false, reviewers: [{ type: "User" }] }],
  deployment_branch_policy: { protected_branches: false, custom_branch_policies: true },
};
const policies = [{ name: "main", type: "branch" }];
const approval = { state: "approved", user: { login: "human", type: "User" }, environments: [{ id: 42 }] };

test("Sol promotion binds immutable candidate and trusted default-branch machinery", () => {
  assert.doesNotThrow(() => assertCandidate(envelope, repository, branch, candidate));
  for (const change of [
    { headSha: "main" }, { workflowSha: "main" }, { eventName: "pull_request_target" },
    { runAttempt: 2 }, { number: 0 }, { repository: "fork/eta-mu" },
    { ref: "refs/heads/candidate" }, { sha: head }, { workflowRef: "fork/eta-mu/.github/workflows/sol-premerge.yml@refs/heads/main" },
  ]) assert.throws(() => assertCandidate({ ...envelope, ...change }, repository, branch, candidate));
  assert.throws(() => assertCandidate(envelope, repository, { ...branch, protected: false }, candidate));
  assert.throws(() => assertCandidate(envelope, repository, { ...branch, commit: { sha: head } }, candidate));
  for (const change of [
    { number: 329 }, { state: "closed" }, { merged: true },
    { head: { ...candidate.head, sha: machinery } },
    { head: { ...candidate.head, repo: { full_name: "fork/eta-mu" } } },
    { base: { ...candidate.base, ref: "staging" } },
    { base: { ...candidate.base, repo: { full_name: "fork/eta-mu" } } },
  ]) assert.throws(() => assertCandidate(envelope, repository, branch, { ...candidate, ...change }));
});

test("Sol promotion rejects missing review and permissive deployment policy", () => {
  assert.doesNotThrow(() => assertEnvironment(environment, policies, "main"));
  for (const change of [
    { name: "production" }, { id: undefined }, { protection_rules: [] },
    { can_admins_bypass: true }, { can_admins_bypass: undefined }, { can_admins_bypass: null },
    { protection_rules: [{ type: "required_reviewers", prevent_self_review: true, reviewers: [] }] },
    { deployment_branch_policy: null },
    { deployment_branch_policy: { protected_branches: true, custom_branch_policies: false } },
  ]) assert.throws(() => assertEnvironment({ ...environment, ...change }, policies, "main"));
  for (const value of [[], [{ name: "*", type: "branch" }], [{ name: "main", type: "tag" }], [...policies, { name: "candidate", type: "branch" }]]) {
    assert.throws(() => assertEnvironment(environment, value, "main"));
  }
});

test("Sol promotion needs this run's human approval even after an environment bypass", () => {
  assert.doesNotThrow(() => assertHumanApproval([approval], 42));
  assert.doesNotThrow(() => assertHumanApproval([{ ...approval, user: { login: "dispatcher", type: "User" } }], 42));
  for (const value of [
    [], [{ ...approval, environments: [{ id: 99 }] }], [{ ...approval, state: "rejected" }],
    [{ ...approval, user: { login: "agent", type: "Bot" } }],
    [{ ...approval, user: { login: "agent[bot]", type: "User" } }],
    [approval, { ...approval, state: "rejected" }],
  ]) assert.throws(() => assertHumanApproval(value, 42));
});

test("Sol revalidation fails before execution when approval or current head changes", async () => {
  const outputs = [];
  const context = { repo: { owner: "open-hax", repo: "eta-mu" }, eventName: "workflow_dispatch", ref: envelope.ref, sha: machinery, runId: 12, actor: "dispatcher[bot]" };
  const env = { GITHUB_WORKFLOW_REF: envelope.workflowRef, GITHUB_WORKFLOW_SHA: machinery, GITHUB_RUN_ATTEMPT: "1", SOL_PR_NUMBER: "328", SOL_HEAD_SHA: head };
  let pr = candidate;
  let reviews = [approval];
  let currentEnvironment = environment;
  let currentPolicies = policies;
  const github = {
    rest: {
      repos: { get: async () => ({ data: repository }), getBranch: async () => ({ data: branch }), getEnvironment: async () => ({ data: currentEnvironment }), listDeploymentBranchPolicies: "policies" },
      pulls: { get: async () => ({ data: pr }) },
    },
    // Octokit normalizes object-wrapped list endpoints before applying the
    // optional mapper, then concatenates all pages into the returned array.
    paginate: async (route, args, map) => map ? [].concat(map({ data: currentPolicies })) : currentPolicies,
    request: async route => { assert.match(route, /\/approvals$/); return { data: reviews }; },
  };
  const options = { github, context, env, core: { setOutput: (...args) => outputs.push(args), info: () => {} }, requireApproval: true };
  await verifyPremerge(options);
  assert.deepEqual(outputs, [["head-sha", head], ["pr-number", "328"]]);
  reviews = [];
  await assert.rejects(verifyPremerge(options), /A human/);
  reviews = [approval];
  currentEnvironment = { ...environment, can_admins_bypass: true };
  await assert.rejects(verifyPremerge(options), /sol-premerge requires/);
  currentEnvironment = environment;
  currentPolicies = [...policies, { name: "candidate", type: "branch" }];
  await assert.rejects(verifyPremerge(options), /sol-premerge requires/);
  currentPolicies = policies;
  pr = { ...candidate, head: { ...candidate.head, sha: machinery } };
  await assert.rejects(verifyPremerge(options), /exact approved candidate/);
  await assert.rejects(verifyPremerge({ ...options, env: { ...env, SOL_PR_NUMBER: "328;evil" } }), /Invalid Sol/);
  assert.equal(outputs.length, 2, "rejected context must produce no trusted outputs");
});

// The small bootstrap PR precedes the controller package on main. Both existing
// eta-mu and the controller pin yaml 2.9.0; support either scoped public install.
function loadYaml() {
  for (const packageName of ["eta-mu", "gitops-controller"]) {
    try {
      return createRequire(new URL(`../../packages/${packageName}/package.json`, import.meta.url))("yaml");
    } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
    }
  }
  throw new Error("Install the frozen public eta-mu or controller dependencies before running Sol workflow contracts.");
}
const YAML = loadYaml();
const workflow = YAML.parse(fs.readFileSync(new URL("../workflows/sol-premerge.yml", import.meta.url), "utf8"));
const contractWorkflow = YAML.parse(fs.readFileSync(new URL("../workflows/sol-premerge-contract.yml", import.meta.url), "utf8"));

test("Sol validation rejects zero-exit warnings from lint, tests, and build without leaking logs", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "sol-premerge-zero-warnings-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const bin = path.join(directory, "bin");
  const logs = path.join(directory, "logs");
  fs.mkdirSync(bin);
  fs.mkdirSync(logs);
  fs.writeFileSync(path.join(bin, "git"), '#!/bin/sh\nif [ "$1" = "rev-parse" ]; then printf "%s\\n" "$EXPECTED_SHA"; fi\n', { mode: 0o755 });
  fs.writeFileSync(path.join(bin, "pnpm"), `#!${process.execPath}\nconst fs = require('node:fs');
const command = process.argv.at(-1);
if (command === 'lint') console.log(process.env.SOL_FIXTURE_LINT);
if (command === 'test') console.log('Ran 1 tests containing 1 assertions.\\n0 failures, 0 errors.\\n' + process.env.SOL_FIXTURE_TEST);
if (command === 'build') { fs.mkdirSync('packages/sol/dist', { recursive: true }); fs.writeFileSync('packages/sol/dist/server.js', 'compiled'); console.log(process.env.SOL_FIXTURE_BUILD); }
`, { mode: 0o755 });
  const step = workflow.jobs.verify.steps.find(step => step.name === "Verify and test approved candidate");
  const run = (fixture = {}) => spawnSync("bash", ["-c", step.run], {
    cwd: directory, encoding: "utf8",
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, RUNNER_TEMP: logs, EXPECTED_SHA: head,
      SOL_FIXTURE_LINT: "linting took 10ms, errors: 0, warnings: 0", SOL_FIXTURE_TEST: "", SOL_FIXTURE_BUILD: "", ...fixture },
  });
  const clean = run();
  assert.equal(clean.status, 0, clean.stderr || clean.stdout);
  for (const fixture of [
    { SOL_FIXTURE_LINT: "src/private.cljs:1:1: warning: private diagnostic" },
    { SOL_FIXTURE_LINT: "linting took 10ms, errors: 0, warnings: 1" },
    { SOL_FIXTURE_TEST: "warning: private diagnostic" },
    { SOL_FIXTURE_BUILD: "WARNING: private diagnostic" },
  ]) {
    const result = run(fixture);
    assert.notEqual(result.status, 0, JSON.stringify(fixture));
    assert.doesNotMatch(result.stdout + result.stderr, /private diagnostic/);
  }
});

test("the independent bootstrap contract runs on exact public source without private capability", () => {
  assert.ok(contractWorkflow.on.pull_request);
  assert.ok(contractWorkflow.on.push);
  assert.equal(contractWorkflow.on.pull_request_target, undefined);
  assert.deepEqual(contractWorkflow.permissions, { contents: "read" });
  const steps = contractWorkflow.jobs.contract.steps;
  assert.equal(steps[0].with.ref, "${{ github.event.pull_request.head.sha || github.sha }}");
  assert.equal(steps[0].with["persist-credentials"], false);
  assert.match(steps.find(step => step.name === "Install existing public workflow parser").run, /pnpm --filter eta-mu install --frozen-lockfile --ignore-scripts/);
  assert.equal(steps.at(-1).run, "node --test .github/scripts/sol-premerge.test.mjs");
  for (const step of steps) if (step.uses) assert.match(step.uses, /@[a-f0-9]{40}$/);
  assert.doesNotMatch(JSON.stringify(contractWorkflow), /secrets\.|create-github-app-token|clojure -P|environment/);
  for (const trigger of [contractWorkflow.on.pull_request, contractWorkflow.on.push]) {
    for (const path of [".github/scripts/sol-premerge.mjs", ".github/scripts/sol-premerge.test.mjs", ".github/workflows/sol-premerge.yml", ".github/workflows/sol-premerge-contract.yml"]) {
      assert.ok(trigger.paths.includes(path), `bootstrap CI misses ${path}`);
    }
  }
});

test("Sol protected execution has a fresh dispatch, immutable machinery, and no live dependency credential", () => {
  assert.deepEqual(Object.keys(workflow.on), ["workflow_dispatch"]);
  assert.deepEqual(Object.keys(workflow.on.workflow_dispatch.inputs), ["pr_number", "head_sha"]);
  assert.equal(workflow.jobs.verify.environment.name, "sol-premerge");
  assert.match(workflow.jobs.verify.environment.url, /needs\.candidate\.outputs\.head-sha/);
  const steps = workflow.jobs.verify.steps;
  const index = name => {
    const result = steps.findIndex(step => step.name === name);
    assert.notEqual(result, -1, `missing ${name}`);
    return result;
  };
  const trustedCheckout = steps[index("Check out trusted workflow machinery")];
  assert.equal(trustedCheckout.with.ref, "${{ github.workflow_sha }}");
  assert.equal(trustedCheckout.with["persist-credentials"], false);
  assert.ok(index("Revalidate exact candidate and human approval") < index("Create private-dependency read token"));
  assert.ok(index("Create private-dependency read token") < index("Prefetch canonical immutable dependencies"));
  assert.ok(index("Prefetch canonical immutable dependencies") < index("Revoke dependency token before candidate checkout"));
  assert.ok(index("Revoke dependency token before candidate checkout") < index("Revalidate candidate immediately before execution"));
  assert.ok(index("Revalidate candidate immediately before execution") < index("Check out approved exact candidate"));
  assert.ok(index("Check out approved exact candidate") < index("Verify and test approved candidate"));
  const token = steps[index("Create private-dependency read token")];
  assert.match(token.with.repositories, /^katamorph\nevent-ledger\s*$/);
  assert.equal(token.with["permission-contents"], "read");
  assert.equal(token.with["app-id"], "${{ secrets.SOL_PREMERGE_APP_ID }}");
  assert.equal(token.with["private-key"], "${{ secrets.SOL_PREMERGE_APP_PRIVATE_KEY }}");
  const prefetch = steps[index("Prefetch canonical immutable dependencies")];
  assert.equal(prefetch["working-directory"], "packages/sol");
  assert.match(prefetch.run, /clojure -P/);
  assert.doesNotMatch(prefetch.run, /git config --global|candidate/);
  const revoke = steps[index("Revoke dependency token before candidate checkout")];
  assert.match(revoke.if, /always\(\)/);
  assert.match(revoke.with.script, /DELETE \/installation\/token/);
  const execution = steps[index("Verify and test approved candidate")];
  assert.equal(execution.if, undefined, "failed prefetch/revoke must block execution");
  assert.equal(execution["working-directory"], "candidate");
  assert.match(execution.run, /packages\/sol test/);
  assert.match(execution.run, /packages\/sol build/);
  assert.match(execution.run, /0 failures, 0 errors/);
  assert.match(execution.run, /Ran \[1-9\]/);
  assert.doesNotMatch(JSON.stringify(execution), /secrets\.|dependency-token|DEPENDENCY_TOKEN/);
  for (const job of Object.values(workflow.jobs)) {
    for (const step of job.steps) {
      if (step.uses) assert.match(step.uses, /@[a-f0-9]{40}$/);
      assert.doesNotMatch(step.uses ?? "", /upload-artifact|cache@/);
    }
  }
});

test("Sol result publication is a separate exact-head job without source or private logs", () => {
  const publish = workflow.jobs.publish;
  assert.deepEqual(publish.needs, ["candidate", "verify"]);
  assert.equal(publish.permissions.checks, "write");
  assert.equal(workflow.jobs.verify.permissions, undefined);
  assert.equal(workflow.permissions.checks, undefined);
  assert.equal(publish.steps.length, 1);
  const step = publish.steps[0];
  assert.doesNotMatch(JSON.stringify(publish), /checkout@|download-artifact|secrets\./);
  assert.match(step.with.script, /pr\.head\.sha !== head/);
  assert.match(step.with.script, /head_sha: head/);
  assert.match(step.with.script, /name: 'Sol pre-merge \/ test-build'/);
  assert.match(step.with.script, /VERIFY_RESULT === 'success' \? 'success' : 'failure'/);
});

test("Sol publisher maps only the protected job result and rejects head or authority drift", async () => {
  const step = workflow.jobs.publish.steps[0];
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const publish = new AsyncFunction("github", "context", "process", step.with.script);
  let pr = candidate;
  let currentBranch = branch;
  const records = [];
  const github = { rest: {
    repos: { get: async () => ({ data: repository }), getBranch: async () => ({ data: currentBranch }) },
    pulls: { get: async () => ({ data: pr }) },
    checks: { create: async value => records.push(value) },
  } };
  const context = { repo: { owner: "open-hax", repo: "eta-mu" }, eventName: "workflow_dispatch", ref: envelope.ref, sha: machinery, runId: 12 };
  const env = { VERIFIED_HEAD: head, VERIFIED_PR: "328", VERIFY_RESULT: "success", GITHUB_WORKFLOW_SHA: machinery, GITHUB_WORKFLOW_REF: envelope.workflowRef, GITHUB_RUN_ATTEMPT: "1" };
  await publish(github, context, { env });
  assert.equal(records[0].head_sha, head);
  assert.equal(records[0].conclusion, "success");
  for (const result of ["failure", "cancelled", "skipped", "source-controlled-success"]) {
    await publish(github, context, { env: { ...env, VERIFY_RESULT: result } });
    assert.equal(records.at(-1).conclusion, "failure");
  }
  const count = records.length;
  pr = { ...candidate, head: { ...candidate.head, sha: machinery } };
  await assert.rejects(publish(github, context, { env }), /Candidate changed/);
  pr = candidate;
  currentBranch = { ...branch, commit: { sha: head } };
  await assert.rejects(publish(github, context, { env }), /authority changed/);
  currentBranch = branch;
  await assert.rejects(publish(github, context, { env: { ...env, GITHUB_RUN_ATTEMPT: "2" } }), /authority changed/);
  assert.equal(records.length, count);
});
