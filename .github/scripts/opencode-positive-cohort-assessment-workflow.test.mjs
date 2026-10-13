// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import { runTrustedWorkflowFixture } from "./assessment-trusted-workflow-fixture.mjs";
import { createNativeAssessmentFixtures } from "./native-assessment-fixture.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const { nativeFixture, runNativeDiscoveryFixture, childNetworkAudit } = createNativeAssessmentFixtures({
  root, purpose: "positive-cohort-assessment", inputName: "positive-cohort-assessment-input.txt",
  schema: "open-hax.positive-cohort-assessment-input/v1",
  verifierEnvironmentVariable: "ETA_MU_POSITIVE_COHORT_VERIFIER_FILE",
  verifierSHAEnvironmentVariable: "ETA_MU_POSITIVE_COHORT_VERIFIER_SHA256",
  directoryPrefix: "eta-positive-cohort-assessment-host-",
  target: { repository_id: "R_fixture", repository_database_id: 3, pr_id: "PR_fixture",
      pr_number: 1, repository: "synthetic/native-context",
      cohort_targets: [["PRRT_fixture_a", 7], ["PRRT_fixture_b", 8]] },
  event: "APPROVE", providerSentinels: true
});

const workflowFile = path.join(root, ".github/workflows/opencode-positive-cohort-assessment.yml");
const workflow = (await import("yaml")).parse(fs.readFileSync(workflowFile, "utf8"));

function assertFixedNativePrompts(fixture, expectedCount) {
  const prompts = JSON.parse(fs.readFileSync(fixture.prompts, "utf8"));
  assert.equal(prompts.length, expectedCount);
  for (const prompt of prompts) {
    assert.match(prompt, /Complete fixed native input: positive-cohort-assessment-input\.txt\./);
    assert.match(prompt, /Use only the review_\* page tools to read and assess every full-input page/);
    assert.doesNotMatch(prompt, /Supporting-file HOST read contract/);
    assert.doesNotMatch(prompt, /Start at offset 1/);
  }
}

test("actual compiled cohort verifier and supervisor accept complete fixed input", (t) => {
  const fixture = nativeFixture(t, { legacy: false });
  assert.equal(fixture.context.inputSource.target.cohort_targets.length, 2);
  assert.equal("thread_id" in fixture.context.inputSource.target, false);
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 0, child.stderr);
  const recovery = JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json")));
  assert.equal(recovery.accepted_invocation.canonical_verdict.ok, true);
  assert.equal(recovery.attempts.length, 1);
  assertFixedNativePrompts(fixture, 1);
  const env = JSON.parse(fs.readFileSync(fixture.probe));
  for (const name of ["GH_TOKEN", "GITHUB_TOKEN", "OPENAI_API_KEY", "ETA_MU_APP_PRIVATE_KEY", "GITHUB_OUTPUT"])
    assert.equal(env[name], undefined);
});

test("missing discovery mode refuses before old legacy input or any model dispatch", (t) => {
  const fixture = nativeFixture(t, { legacy: true });
  delete fixture.env.REVIEW_MODEL_DISCOVERY;
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 1);
  assert.equal(fs.existsSync(fixture.probe), false);
  assert.equal(fs.existsSync(path.join(fixture.directory, "submission.json")), false);
  assert.match(JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json"))).setup_error,
    /native review requires checked model discovery/);
});

test("truncated cohort input cannot be repaired by complete legacy bytes", (t) => {
  const fixture = nativeFixture(t, { legacy: true, partial: true });
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 1);
  assert.equal(fs.existsSync(fixture.probe), false);
  assert.equal(fs.existsSync(path.join(fixture.directory, "submission.json")), false);
});

test("final cohort page omission retains refusal and uses one complete recovery", (t) => {
  const fixture = nativeFixture(t, { legacy: false, finalCoverage: true });
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 0, child.stderr);
  const recovery = JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json")));
  assert.equal(recovery.attempts.length, 2);
  assertFixedNativePrompts(fixture, 2);
  assert.equal(recovery.attempts[0].canonical_verdict.ok, false);
  assert.equal(recovery.accepted_invocation.attempt, 2);
  assert.equal(fs.readFileSync(path.join(fixture.directory, "invocations.txt"), "utf8"), "2");
});

test("authored workflow refuses unresolved pins before any native or setup command", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eta-positive-cohort-pins-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const step = workflow.jobs.prepare.steps[0];
  const child = runTrustedWorkflowFixture(import.meta.url, ["--noprofile", "--norc", "-e", "-o", "pipefail", "-c", step.run], {
    encoding: "utf8", cwd: dir, env: { ...process.env, TARGET_REPOSITORY: "open-hax/knoxx",
      POSITIVE_COHORT_HISTORY_SOURCE_SHA256: "a".repeat(64), POSITIVE_COHORT_HISTORY_CLI_SHA256: "b".repeat(64),
      TIMEOUT_INPUT: "60", CANONICAL_REVISION: "UNADOPTED_POSITIVE_COHORT_V2", MUSE_REVISION: "UNADOPTED_POSITIVE_COHORT_INPUT" },
  });
  assert.equal(child.status, 1);
  assert.match(child.stdout + child.stderr, /dependency pins are not adopted/);
  assert.deepEqual(fs.readdirSync(dir), []);
});

test("protected prepare assess publish boundaries retain exact source and model custody", () => {
  assert.equal(workflow.env.CANONICAL_REVISION, "b23845012508fd598a56dea34d6be38ede5c7136");
  assert.equal(workflow.env.MUSE_REVISION, "b9e47da4f445106310c7b9dc98fe3a3ef9ea50d5");
  assert.equal(workflow.concurrency.group, "native-pr-assessment-${{ inputs.target_repository_id }}-${{ inputs.pr_number }}");
  assert.equal(workflow.concurrency["cancel-in-progress"], false);
  const model = workflow.jobs.assess.steps.find(step => step.id === "assess");
  assert.equal(model.env.REVIEW_INPUT_PURPOSE, "positive-cohort-assessment");
  assert.equal(model.env.REVIEW_MODEL, "");
  assert.equal(Object.keys(model.env).some(name => /TOKEN|KEY|SECRET/.test(name)), false);
  assert.equal(workflow.env.REVIEW_MODEL_DISCOVERY, "opencode-free-mimo-flash-v1");
  assert.equal(workflow.env.REVIEW_EXPECTED_OPENCODE_VERSION, "1.18.18");
  for (const job of Object.values(workflow.jobs)) {
    assert.equal(job.steps[0].name, job === workflow.jobs.prepare
      ? "Refuse pending dependency pins and malformed time budget" : "Authenticate protected called source before checkout");
    const guard = job.steps.findIndex(step => step.name === "Authenticate protected called source before checkout");
    const checkout = job.steps.findIndex(step => step.uses?.startsWith("actions/checkout@"));
    assert.ok(guard >= 0 && guard < checkout);
    for (const step of job.steps.filter(step => step.uses?.startsWith("actions/checkout@")))
      assert.equal(step.with["persist-credentials"], false);
  }
  const publisher = workflow.jobs.publish.steps.find(step => step.id === "publisher");
  assert.equal(publisher.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
  assert.equal(publisher.with["permission-issues"], "write");
  const write = workflow.jobs.publish.steps.find(step => step.name?.startsWith("Fresh canonical eligibility"));
  assert.equal(write.env.ACCEPTED_INVOCATION_SHA256, "${{ needs.assess.outputs.accepted_sha256 }}");
  assert.equal(workflow.jobs.publish.environment, "positive-cohort-assessment-publication");
  assert.equal(JSON.stringify(workflow).includes("resolveReviewThread"), false);
  assert.equal(JSON.stringify(workflow).includes("publish-opencode-review"), false);
});


test("all native assessment purposes share one repository and PR publication lock", async () => {
  const { parse } = await import("yaml");
  const workflows = [
    "opencode-actionability-assessment.yml",
    "opencode-rejection-assessment.yml",
    "opencode-positive-cohort-assessment.yml",
  ].map((file) => parse(fs.readFileSync(path.join(root, ".github/workflows", file), "utf8")));
  const expected = "native-pr-assessment-${{ inputs.target_repository_id }}-${{ inputs.pr_number }}";
  // Substitute only these known fixture coordinates, not Actions expression semantics.
  const key = (parsed, repositoryId, pr, thread) => parsed.concurrency.group
    .replaceAll("${{ inputs.target_repository_id }}", repositoryId)
    .replaceAll("${{ inputs.pr_number }}", pr)
    .replaceAll("${{ inputs.thread_id }}", thread);
  const repositoryId = "1199983316";
  const pr = "388";
  const threads = ["PRRT_kwDOR4ZK1M6rn7BT", "PRRT_kwDOR4ZK1M6rn7Bc"];
  const samePr = key(workflows[0], repositoryId, pr, threads[0]);
  for (const parsed of workflows) {
    for (const thread of threads) {
      assert.equal(key(parsed, repositoryId, pr, thread), samePr);
      assert.notEqual(key(parsed, "1199983317", pr, thread), samePr);
      assert.notEqual(key(parsed, repositoryId, "389", thread), samePr);
    }
  }
  assert.equal(samePr, "native-pr-assessment-1199983316-388");
  for (const parsed of workflows) {
    assert.equal(parsed.concurrency.group, expected);
    assert.equal(parsed.concurrency["cancel-in-progress"], false);
    assert.equal(parsed.concurrency.queue, undefined);
  }
});
