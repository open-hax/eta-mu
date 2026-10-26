// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import { assertNumericTimeout, assertNativeBudgetFixture } from "./assessment-timeout-expression-fixture.mjs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { runTrustedWorkflowFixture } from "./assessment-trusted-workflow-fixture.mjs";
import { createNativeAssessmentFixtures } from "./native-assessment-fixture.mjs";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { runReviewRecovery } from "./run-opencode-review-recovery.mjs";
import { stageTransportVerifier, transportResponse, transportReviewTools } from "./review-invocation-fixture.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const { nativeFixture, runNativeDiscoveryFixture, childNetworkAudit } = createNativeAssessmentFixtures({
  root, purpose: "actionability", inputName: "actionability-input.txt",
  schema: "open-hax.actionability-input/v1",
  verifierEnvironmentVariable: "ETA_MU_ACTIONABILITY_VERIFIER_FILE",
  verifierSHAEnvironmentVariable: "ETA_MU_ACTIONABILITY_VERIFIER_SHA256",
  directoryPrefix: "eta-actionability-host-",
  target: { repository_id: "R_fixture", repository_database_id: 3, pr_id: "PR_fixture",
      pr_number: 1, thread_id: "PRRT_fixture", root_comment_id: 7 },
  event: "COMMENT", providerSentinels: false
});

test("actual canonical runner accepts only the complete fixed native file", (t) => {
  const fixture = nativeFixture(t, { legacy: false });
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 0, "valid native purpose must not require basehead.diff");
  const recovery = JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json")));
  assert.equal(recovery.accepted_invocation.canonical_verdict.ok, true);
  assert.equal(recovery.attempts.length, 1, "healthy actual trace has no second invocation");
});

test("final native page omission recovers once using only the exact actionability input", (t) => {
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

/** Check actual first and corrective prompts without inventing supporting gate results. */
test("native first and corrective prompts name only the staged full input", (t) => {
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
      assert.match(prompt, /Complete fixed native input: actionability-input\.txt/);
      assert.match(prompt, /only the review_\* page tools/);
      assert.doesNotMatch(prompt, /summary\.json|deterministic\.log|\.opencode\/review-evidence/);
      assert.match(prompt, /Every review tool call must succeed/);
      assert.match(prompt, /No ordinary diff supporting-file artifacts are staged/);
    }
  }
});

/** Existing mock proves prompt composition only; it grants no canonical verifier credit. */
test("ordinary strict diff prompt retains complete supporting-file reads", async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-diff-supporting-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const fixture = stageTransportVerifier(directory);
  const prompts = [];
  await runReviewRecovery({ evidenceDirectory: directory, basePrompt: "Ordinary transport fixture.",
    reviewTools: transportReviewTools, expectedContext: fixture.expectedContext,
    verifyReviewInvocation: fixture.verifyReviewInvocation, verifierSha256: fixture.verifierSha256,
    invokeAttempt: async ({ prompt, responseFile, stderrFile }) => {
      prompts.push(prompt);
      fs.writeFileSync(responseFile, transportResponse()); fs.writeFileSync(stderrFile, "");
      fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({
        schema: "open-hax.github-review/v1", event: "APPROVE", summary: "Transport fixture only.", comments: [] }));
      return { exitCode: 0 };
    } });
  assert.equal(prompts.length, 1);
  assert.match(prompts[0], /read summary\.json and/);
  assert.match(prompts[0], /deterministic\.log under \.opencode\/review-evidence/);
  assert.match(prompts[0], /required complete deterministic evidence reading/);
  assert.doesNotMatch(prompts[0], /No ordinary diff supporting-file artifacts are staged/);
});

test("a complete legacy file cannot replace a partial native file", (t) => {
  const fixture = nativeFixture(t, { partial: true });
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 1);
  assert.equal(fs.existsSync(fixture.probe), false, "invalid bytes refuse before the child");
  assert.equal(JSON.parse(fs.readFileSync(path.join(fixture.directory, "recovery.json"))).accepted_invocation, null);
});

test("actionability child uses its fresh home and receives no host credentials", (t) => {
  const fixture = nativeFixture(t);
  const child = runNativeDiscoveryFixture(fixture);
  childNetworkAudit(child);
  assert.equal(child.status, 0);
  const probe = JSON.parse(fs.readFileSync(fixture.probe));
  assert.equal(Object.hasOwn(probe, "GH_TOKEN"), false);
  assert.equal(Object.hasOwn(probe, "GITHUB_TOKEN"), false);
  assert.equal(probe.HOME, fixture.home);
  assert.equal(Object.hasOwn(probe, "GITHUB_OUTPUT"), false);
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

const workflowFile = path.join(root, ".github/workflows/opencode-actionability-assessment.yml");
const workflow = (await import("yaml")).parse(fs.readFileSync(workflowFile, "utf8"));

/** Execute the authored install step with inert npm/profile fixtures, never a model. */
async function installedReviewProfile(t, invalidTool = null) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-actionability-context-"));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const temporary = path.join(directory, "runner"), bin = path.join(directory, "bin");
  const eta = path.join(directory, "eta"), profile = path.join(directory, "profile");
  const modelRoot = path.join(directory, ".actionability/model-root");
  const evidence = path.join(modelRoot, ".opencode/review-evidence");
  for (const name of [temporary, bin, evidence, path.join(profile, "dist"), path.join(profile, "agents"), path.join(directory, "canonical/skills")])
    fs.mkdirSync(name, {recursive: true, mode: 0o700});
  for (const name of ["assessment-runtime/package.json", "assessment-runtime/package-lock.json", "assessment-model-profile/package.json", "assessment-opencode/package.json", "assessment-opencode/package-lock.json"]){
    const destination = path.join(eta, ".github", name);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.copyFileSync(path.join(root, ".github", name), destination);
  }
  fs.writeFileSync(path.join(directory, "package.json"), '{"type":"module"}\n');
  fs.copyFileSync(path.join(root, ".github/assessment-model-profile/package.json"), path.join(profile, "package.json"));
  for (const name of ["package-lock.json", "opencode.json"]) fs.writeFileSync(path.join(profile, name), "{}\n");
  fs.writeFileSync(path.join(profile, "agents/github-reviewer.md"), "Synthetic profile fixture; no model.\n");
  fs.writeFileSync(path.join(profile, "dist/eta-mu-actors.js"), `
export const names = ["review_begin", "review_read_diff_chunk", "review_assess_diff_chunk", "review_record_evidence", "review_propose_finding", "review_classify_finding", "review_status", "review_submit"];
export const dispatched = [];
export async function EtaMuActorsPlugin() {
  const tool = Object.fromEntries([...names, "actor_list"].map(name => [name, {
    description: "Original " + name, args: {id: "unchanged"},
    execute: async (args, ctx) => { dispatched.push(name); return {args, ctx}; }
  }]));
  const invalidTool = ${JSON.stringify(invalidTool)};
  if (invalidTool?.kind === "absent-table") return {};
  if (invalidTool?.kind === "missing") delete tool[invalidTool.name];
  if (invalidTool?.kind === "non-callable") tool[invalidTool.name].execute = null;
  return {tool};
}\n`);
  // npm is inert: only create the expected private executable placeholder.
  fs.writeFileSync(path.join(bin, "npm"), `#!/bin/sh
set -eu
mkdir -p "$3/node_modules"
case "$3" in */.eta-mu-opencode)
 mkdir -p "$3/node_modules/opencode-linux-x64-baseline/bin"
 printf '#!/bin/sh\\nexit 0\\n' > "$3/node_modules/opencode-linux-x64-baseline/bin/opencode"
 chmod 700 "$3/node_modules/opencode-linux-x64-baseline/bin/opencode";; esac
`, {mode: 0o700});
  const step = workflow.jobs.assess.steps.find(s => s.name === "Install isolated credential-free model profile");
  const result = runTrustedWorkflowFixture(import.meta.url, ["-c", step.run], {cwd: directory,
    env: {PATH: `${bin}:${path.dirname(process.execPath)}:/usr/bin:/bin`, RUNNER_TEMP: temporary,
      GITHUB_WORKSPACE: directory, ETA_CHECKOUT: eta, CANONICAL_CHECKOUT: path.join(directory, "canonical"),
      ACTIONABILITY_PROFILE_DIR: profile, ACTIONABILITY_EVIDENCE_DIR: evidence},
    encoding: "utf8", timeout: 15000}, 0);
  return {result, modelRoot, directory,
    wrapper: path.join(temporary, "actionability-model-home/.config/opencode/plugins/eta-mu-actors.js"),
    stagedActors: path.join(temporary, "actionability-model-home/.eta-mu-review/dist/eta-mu-actors.js")};
}

test("installed review tools bind the staged evidence root despite foreign runtime contexts", async (t) => {
  const fixture = await installedReviewProfile(t);
  assert.equal(fixture.result.status, 0, fixture.result.stderr);
  const {EtaMuActorsPlugin} = await import(pathToFileURL(fixture.wrapper));
  const {tool} = await EtaMuActorsPlugin({directory: fixture.modelRoot, worktree: "/"});
  const args = {id: 7}, abort = new AbortController().signal, metadata = () => {};
  const context = Object.freeze({directory: "/foreign", worktree: "/", sessionID: "session", messageID: "message", agent: "reviewer", abort, metadata});
  for (const name of Object.keys(tool).filter(name => name.startsWith("review_"))) {
    const result = await tool[name].execute(args, context);
    assert.equal(result.args, args);
    assert.deepEqual(result.ctx, {...context, directory: fixture.modelRoot, worktree: fixture.modelRoot});
    assert.equal(tool[name].description, "Original " + name);
    assert.deepEqual(tool[name].args, {id: "unchanged"});
  }
  assert.equal((await tool.actor_list.execute(args, context)).ctx, context, "observer tools retain original context");
});

test("installed review profile refuses an unknown or filesystem-root host directory", async (t) => {
  const fixture = await installedReviewProfile(t);
  assert.equal(fixture.result.status, 0, fixture.result.stderr);
  const {EtaMuActorsPlugin} = await import(pathToFileURL(fixture.wrapper));
  for (const directory of [undefined, "", "/", "relative"])
    await assert.rejects(() => EtaMuActorsPlugin({directory, worktree: "/"}), /review directory/);
});

test("installed review profile refuses missing and non-callable tools before dispatch", async (t) => {
  for (const invalidTool of [
    {kind: "missing", name: "review_read_diff_chunk"},
    {kind: "non-callable", name: "review_submit"},
    {kind: "absent-table"},
  ]) {
    const fixture = await installedReviewProfile(t, invalidTool);
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    const {EtaMuActorsPlugin} = await import(pathToFileURL(fixture.wrapper));
    const {dispatched} = await import(pathToFileURL(fixture.stagedActors));
    await assert.rejects(() => EtaMuActorsPlugin({directory: fixture.modelRoot, worktree: "/"}),
      {name: "Error", message: "Missing actionability review tool"}, invalidTool.kind);
    assert.deepEqual(dispatched, [], "incomplete tool tables refuse before any tool executes");
  }
});


test("compiled profile binding resolves the pinned runtime from the ETA checkout and preserves the parent cwd", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-profile-binding-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const eta = path.join(directory, ".actionability/eta");
  const runtime = path.join(directory, ".actionability/runtime");
  const profile = path.join(directory, "profile");
  const canonical = path.join(directory, "canonical");
  const modules = path.join(runtime, "node_modules");
  const source = "packages/eta-mu/src/cljs/eta_mu/extern/actionability_host.cljs";
  const require = createRequire(path.join(root, "packages/eta-mu/package.json"));
  const pinned = JSON.parse(fs.readFileSync(path.join(root, ".github/assessment-runtime/package.json"), "utf8"));
  for (const target of [modules, profile, canonical, path.dirname(path.join(eta, source))])
    fs.mkdirSync(target, { recursive: true });
  for (const name of ["nbb", "yaml"]) {
    const manifest = require.resolve(`${name}/package.json`);
    assert.equal(JSON.parse(fs.readFileSync(manifest, "utf8")).version, pinned.dependencies[name]);
    fs.symlinkSync(path.dirname(manifest), path.join(modules, name), "dir");
  }
  fs.symlinkSync(modules, path.join(eta, "node_modules"), "dir");
  fs.copyFileSync(path.join(root, source), path.join(eta, source));
  fs.writeFileSync(path.join(profile, "owned-fixture.txt"), "Nonempty deterministic profile fixture; no model invocation.\n");
  const verifier = path.join(directory, "verifier.cjs");
  fs.writeFileSync(verifier, "// Owned verifier-byte binding fixture.\n");
  const entry = path.join(eta, "profile-digest.cljs");
  fs.writeFileSync(entry, "(require '[eta-mu.extern.actionability-host :as h]) (println (h/directory-digest (h/env \"ACTIONABILITY_PROFILE_DIR\")))\n");
  const env = { PATH: `${path.dirname(process.execPath)}:${process.env.PATH}`, HOME: directory,
    ETA_CHECKOUT: eta, GITHUB_WORKSPACE: directory, CANONICAL_CHECKOUT: canonical,
    ACTIONABILITY_PROFILE_DIR: profile, REVIEW_INVOCATION_VERIFIER_FILE: verifier,
    GITHUB_OUTPUT: path.join(directory, "outputs"), TEST_PARENT_AFTER: path.join(directory, "parent-cwd") };
  // No ambient NODE_PATH: the hosted runtime is installed only under runtime,
  // and only the ETA checkout receives its node_modules link.
  const neighbor = runTrustedWorkflowFixture(import.meta.url,
    ["-c", 'node "$GITHUB_WORKSPACE/.actionability/runtime/node_modules/nbb/cli.js" -cp "$ETA_CHECKOUT/packages/eta-mu/src/cljs" "$ETA_CHECKOUT/profile-digest.cljs"'],
    { cwd: directory, env, encoding: "utf8", timeout: 15000 }, 1);
  assert.equal(neighbor.status, 0, neighbor.stderr);
  const expectedProfile = neighbor.stdout.trim();
  assert.match(expectedProfile, /^[0-9a-f]{64}$/);
  const step = workflow.jobs.prepare.steps.find(step => step.name === "Bind compiled profile outside the child");
  const result = runTrustedWorkflowFixture(import.meta.url,
    ["-c", `${step.run}\nprintf '%s' "$PWD" > "$TEST_PARENT_AFTER"\n`],
    { cwd: directory, env, encoding: "utf8", timeout: 15000 }, 1);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(env.GITHUB_OUTPUT, "utf8"),
    `profile_sha256=${expectedProfile}\nverifier_sha256=${createHash("sha256").update(fs.readFileSync(verifier)).digest("hex")}\n`);
  assert.equal(fs.readFileSync(env.TEST_PARENT_AFTER, "utf8"), directory);
});


test("direct and reusable routes share exact protected dependency pins", () => {
  assert.ok(workflow.on.workflow_call && workflow.on.workflow_dispatch);
  const expectedPins = { canonical: "8497afdd329c3dcaefb78eec36d8e629a59d9eb2", muse: "45c7a8d572bf44202f52cae2aa8c0f771736a617" };
  assert.equal(workflow.env.CANONICAL_REVISION, expectedPins.canonical);
  assert.equal(workflow.env.MUSE_REVISION, expectedPins.muse);
  assert.equal(workflow.env.ETA_SOURCE_SHA, "${{ inputs.eta_revision || github.workflow_sha }}");
  assert.equal(workflow.env.ACTIONABILITY_CALLED_REVISION, "${{ inputs.eta_revision }}");
  assert.equal(workflow.on.workflow_call.inputs.eta_revision.required, true);
  assert.equal(Object.hasOwn(workflow.on.workflow_dispatch.inputs, "eta_revision"), false);
  const hostEntry = fs.readFileSync(path.join(root, ".github/scripts/opencode_actionability_assessment.cljs"), "utf8");
  assert.match(hostEntry, /direct\? \(or \(nil\? called-revision\) \(= "" called-revision\)\)/);
  assert.match(hostEntry, /:eta-revision eta-revision :direct\? direct\?/);
  const infra = fs.readFileSync(path.join(root, "packages/eta-mu/src/cljs/eta_mu/infra/actionability_assessment.cljs"), "utf8");
  const sourcePins = infra.match(/dependency-pins \{:canonical "([0-9a-f]{40})" :muse "([0-9a-f]{40})"\}/);
  assert.ok(sourcePins, "the canonical source lock must contain both immutable revisions");
  assert.deepEqual({ canonical: sourcePins[1], muse: sourcePins[2] }, expectedPins);
  const guard = workflow.jobs.prepare.steps[0].run;
  const runPins = (changes = {}) => runTrustedWorkflowFixture(import.meta.url, ["-c", guard], { encoding: "utf8", timeout: 15000,
    env: { PATH: process.env.PATH, TARGET_REPOSITORY: "open-hax/eta-mu", TIMEOUT_INPUT: "60", CANONICAL_REVISION: expectedPins.canonical,
      MUSE_REVISION: expectedPins.muse, ...changes } });
  assert.equal(runPins().status, 0, "valid dependency values pass the existing shape guard");
  for (const value of ["", "60.5", "not-a-number", "1e2", "59", "181"]) {
    const refused = runPins({ TIMEOUT_INPUT: value });
    assert.notEqual(refused.status, 0, `invalid time budget must refuse: ${value}`);
    assert.match(refused.stdout, /review_timeout_minutes must be a whole number from 60 through 180/);
  }
  for (const value of ["60", "180"]) assert.equal(runPins({ TIMEOUT_INPUT: value }).status, 0);
  for (const changes of [{ CANONICAL_REVISION: "" }, { MUSE_REVISION: "" },
    { CANONICAL_REVISION: "main" }, { MUSE_REVISION: "malformed" },
    { CANONICAL_REVISION: "a".repeat(39) }, { MUSE_REVISION: "A".repeat(40) }])
    assert.notEqual(runPins(changes).status, 0, "nil or malformed dependency values refuse before native bootstrap");
  assert.equal(workflow.concurrency["cancel-in-progress"], false);
  assert.deepEqual(Object.keys(workflow.jobs), ["prepare", "assess", "publish"]);
  assert.match(workflow.jobs.prepare.steps[0].run, /CANONICAL_REVISION.*MUSE_REVISION/s);
  assert.match(workflow.jobs.prepare.steps[0].run, /TIMEOUT_INPUT >= 60.*TIMEOUT_INPUT <= 180/);
  assert.equal(workflow.on.workflow_call.inputs.review_timeout_minutes.default, 60);
  assert.equal(workflow.jobs.assess["timeout-minutes"], 240);
  assert.match(workflow.jobs.assess.steps.find(step => step.id === "assess")["timeout-minutes"], /> 180 && 180/);
});

test("target-native read credentials remain separate from protected publication", () => {
  for (const job of [workflow.jobs.prepare, workflow.jobs.assess]) {
    const sourceGuard = job.steps.findIndex((step) => step.name === "Authenticate protected called source before checkout");
    const publicGuard = job.steps.findIndex((step) => step.name === "Require public native target before checkout");
    const readIndex = job.steps.findIndex((step) => step.id === "target_reader");
    assert.ok(sourceGuard >= 0 && sourceGuard < publicGuard && publicGuard < readIndex);
    const reader = job.steps[readIndex];
    assert.equal(reader.uses, "actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1");
    assert.equal(reader.with.owner, "${{ steps.target_identity.outputs.repository_owner }}");
    assert.equal(reader.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
    assert.deepEqual(Object.fromEntries(Object.entries(reader.with).filter(([key]) => key.startsWith("permission-"))),
      { "permission-metadata": "read", "permission-pull-requests": "read", "permission-issues": "read" });
    assert.equal(reader.with["app-id"], "${{ secrets.ETA_MU_APP_ID }}");
    assert.equal(reader.with["private-key"], "${{ secrets.ETA_MU_APP_PRIVATE_KEY }}");
    const readMints = [reader];
    if (job === workflow.jobs.assess) {
      const refreshIndex = job.steps.findIndex((step) => step.id === "target_reader_after_model");
      const refresh = job.steps[refreshIndex];
      const modelIndex = job.steps.findIndex((step) => step.id === "assess");
      const verifyIndex = job.steps.findIndex((step) => step.name === "Reverify actual accepted invocation and fresh custody");
      assert.ok(modelIndex >= 0 && modelIndex < refreshIndex && refreshIndex + 1 === verifyIndex);
      assert.equal(refresh.uses, reader.uses);
      assert.deepEqual(refresh.with, reader.with, "refresh preserves the exact target installation and read-only scope");
      readMints.push(refresh);
    }
    const nativeSteps = job.steps.filter((step) => ["Fresh native collection and immutable source input",
      "Bind staged input before model execution", "Reverify actual accepted invocation and fresh custody"].includes(step.name));
    assert.equal(nativeSteps.length, job === workflow.jobs.prepare ? 1 : 2);
    for (const step of nativeSteps) {
      const expectedToken = step.name === "Reverify actual accepted invocation and fresh custody"
        ? "${{ steps.target_reader_after_model.outputs.token }}" : "${{ steps.target_reader.outputs.token }}";
      assert.equal(step.env.GH_TOKEN, expectedToken, "target author permission reads use the phase's exact target-scoped token");
      assert.equal(step.env.HOST_RUN_READ_TOKEN, "${{ github.token }}", "owning workflow provenance retains its own read token");
      assert.ok(readIndex < job.steps.indexOf(step));
    }
    for (const step of job.steps.filter((step) => !readMints.includes(step)))
      assert.equal(JSON.stringify(step).includes("secrets.ETA_MU_APP"), false, "only the exact target-scoped read-token mints consume earlier App secrets");
    assert.equal(JSON.stringify(job.outputs || {}).includes("target_reader"), false, "read tokens never cross jobs as outputs");
  }
  assert.equal(workflow.jobs.publish.environment, "actionability-publication");
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
  assert.match(write.run, /opencode_actionability_assessment.cljs.*publish/);
  assert.equal(write.env.PUBLICATION_RESULT_FILE, "${{ runner.temp }}/actionability-publication-result.json");
  assert.doesNotMatch(write.run, /publish\s*>/);
  const observed = workflow.jobs.publish.steps.find((step) => step.uses?.startsWith("actions/upload-artifact@"));
  assert.equal(observed.if, "always()");
  assert.equal(observed.with.path, write.env.PUBLICATION_RESULT_FILE);
  assert.equal(observed.with["if-no-files-found"], "error");
  assert.equal(JSON.stringify(workflow).includes("publish-opencode-review"), false);
  assert.equal(JSON.stringify(workflow).includes("resolveReviewThread"), false);
});

test("actual model step is credential-free with independent input and result bindings", () => {
  const model = workflow.jobs.assess.steps.find((step) => step.id === "assess");
  assert.equal(model.env.REVIEW_INPUT_PURPOSE, "actionability");
  assert.match(model.env.REVIEW_CHILD_HOME, /actionability-model-home/);
  assert.equal(Object.keys(model.env).some((key) => /TOKEN|KEY|SECRET/.test(key)), false);
  assert.equal(model["working-directory"], ".actionability/model-root");
  assert.equal(workflow.jobs.assess.outputs.accepted_sha256, "${{ steps.assess.outputs.review_invocation_sha256 }}");
  const verify = workflow.jobs.assess.steps.find((step) => step.name === "Reverify actual accepted invocation and fresh custody");
  assert.match(verify.env.REVIEW_INVOCATION_VERIFIER_SHA256, /needs.prepare.outputs.verifier_sha256/);
  for (const job of Object.values(workflow.jobs)) {
    for (const step of job.steps.filter((step) => step.uses?.startsWith("actions/checkout@"))) {
      assert.equal(step.with["persist-credentials"], false);
    }
  }
});

for (const route of ["actionability", "rejection", "positive-cohort"]) {
  test(`long assessment refreshes read credentials before native recollection (${route})`, () => {
    const YAML = createRequire(import.meta.url)("yaml");
    const current = YAML.parse(fs.readFileSync(path.join(root, `.github/workflows/opencode-${route}-assessment.yml`), "utf8"));
    const steps = current.jobs.assess.steps;
    const modelIndex = steps.findIndex(step => step.id === "assess");
    const verifyIndex = steps.findIndex(step => step.name === "Reverify actual accepted invocation and fresh custody");
    const before = steps.find(step => step.id === "target_reader");
    const tokens = new Map();
    let elapsedMinutes = 0;
    let recollectionStatus;
    for (const [index, step] of steps.entries()) {
      if (step.uses?.startsWith("actions/create-github-app-token@")) {
        tokens.set(step.id, { createdAt: elapsedMinutes, expiresAt: elapsedMinutes + 60 });
      }
      if (index === modelIndex) {
        assert.equal(Object.keys(step.env).some(key => /TOKEN|KEY|SECRET/.test(key)), false);
        elapsedMinutes = 121;
      }
      if (index === verifyIndex) {
        const tokenRef = /^\$\{\{ steps\.([A-Za-z_]+)\.outputs\.token \}\}$/.exec(step.env.GH_TOKEN);
        assert.ok(tokenRef, `${route}: post-model recollection must select one actual step token`);
        const selected = tokens.get(tokenRef[1]);
        recollectionStatus = selected && selected.expiresAt > elapsedMinutes ? 200 : 401;
      }
    }
    assert.ok(tokens.get("target_reader").expiresAt <= elapsedMinutes,
      `${route}: fixture actually crosses the original installation token expiry`);
    assert.equal(recollectionStatus, 200, `${route}: native recollection requires an unexpired token after long inference`);
    const refreshIndex = steps.findIndex(step => step.id === "target_reader_after_model");
    const refresh = steps[refreshIndex];
    assert.ok(modelIndex < refreshIndex && refreshIndex + 1 === verifyIndex,
      `${route}: mint immediately after the model and immediately before fresh verification`);
    assert.equal(refresh.uses, before.uses);
    assert.deepEqual(refresh.with, before.with, `${route}: refresh preserves exact target scope and read-only permissions`);
    assert.equal(current.jobs.assess.permissions, undefined);
  });
}

for (const route of ["actionability", "rejection", "positive-cohort"]) {
  test(`inference step deadline leaves bounded verification and always-upload headroom (${route})`, () => {
  const YAML = createRequire(import.meta.url)("yaml");

    const current = YAML.parse(fs.readFileSync(path.join(root, `.github/workflows/opencode-${route}-assessment.yml`), "utf8"));
    const job = current.jobs.assess;
    const model = job.steps.find(step => step.id === "assess");
    const verify = job.steps.find(step => step.name === "Reverify actual accepted invocation and fresh custody");
    const upload = job.steps.find(step => step.uses?.startsWith("actions/upload-artifact@"));
    assert.equal(typeof model["timeout-minutes"], "string", `${route}: model step lacks its bounded inference deadline`);
    for (const requested of [60, "60", 120, "120", 180, "180"]) {
      const evaluated = assertNumericTimeout(current, requested, Number(requested));
      assert.equal(job["timeout-minutes"], 240, `${route}: job has a literal deadline with no expression arithmetic`);
      assert.ok(job["timeout-minutes"] - evaluated >= 60, `${route}: every accepted request has at least 60 minutes of cleanup headroom`);
      assert.ok(verify["timeout-minutes"] + upload["timeout-minutes"] < job["timeout-minutes"] - evaluated,
        `${route}: bounded verifier and artifact writer fit within reserved headroom`);
    }
    assert.equal(verify["timeout-minutes"], 30);
    assert.equal(upload["timeout-minutes"], 5);
    assert.equal(upload.if, "always()");
    assert.equal(upload.with["if-no-files-found"], "error");
    assert.ok(job.steps.indexOf(upload) > job.steps.indexOf(model));
    assert.equal(model["continue-on-error"], undefined,
      `${route}: inference timeout remains failed while retained evidence is uploaded`);
  });
}

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
    ACTIONABILITY_JOB_WORKFLOW_SHA: sha,
    ACTIONABILITY_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main",
    ACTIONABILITY_JOB_CHECK_RUN_ID: "103", ACTIONABILITY_PREPARE_CHECK_RUN_ID: "101",
    GITHUB_ENV: path.join(contextDirectory, "github-env"),
    GITHUB_RUN_ATTEMPT: "1", GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_WORKFLOW_SHA: sha, ACTIONABILITY_CALLED_REVISION: "",
    GITHUB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main",
    TEST_BRANCH_JSON: JSON.stringify({ protected: true, commit: { sha } }),
    TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1, head_sha: sha, repository: { full_name: "open-hax/eta-mu" },
      referenced_workflows: [{ sha, path: `open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@${sha}` }] }),
    TEST_COMPARE_STATUS: "identical",
    "BASH_FUNC_gh%%": '() { case "$2" in repos/open-hax/eta-mu) printf "%s\\n" main;; repos/open-hax/eta-mu/branches/main) printf "%s\\n" "$TEST_BRANCH_JSON";; repos/open-hax/eta-mu/actions/runs/31|repos/open-hax/knoxx/actions/runs/31) printf "%s\\n" "$TEST_RUN_JSON";; repos/open-hax/eta-mu/compare/*) printf "%s\\n" "$TEST_COMPARE_STATUS";; *) return 97;; esac; }' };
  const run = (changes = {}) => runTrustedWorkflowFixture(import.meta.url, ["-c", guards[0]], { env: { ...env, ...changes }, encoding: "utf8", timeout: 15000 });
  assert.equal(run().status, 0, "inert native default-branch source admits");
  assert.equal(run({ GITHUB_EVENT_NAME: "pull_request", ACTIONABILITY_CALLED_REVISION: sha }).status, 0, "inert called exact referenced source admits");
  for (const changes of [
    { ACTIONABILITY_JOB_WORKFLOW_SHA: "e".repeat(40) },
    { ACTIONABILITY_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/sibling.yml@refs/heads/main" },
    { ACTIONABILITY_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@" },
    { ACTIONABILITY_JOB_WORKFLOW_SHA: "" },
  ]) {
    const effects = path.join(contextDirectory, `mismatch-${Object.keys(changes)[0]}-${Object.values(changes)[0].length}.txt`);
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", `${guards[0]}\nprintf 'checkout-reached\n' >> "$TEST_EFFECTS"\n`],
      { env: { ...env, GITHUB_EVENT_NAME: "pull_request", ACTIONABILITY_CALLED_REVISION: sha,
        ...changes, TEST_EFFECTS: effects,
        "BASH_FUNC_gh%%": env["BASH_FUNC_gh%%"].replace("() {", '() { printf "native-read\\n" >> "$TEST_EFFECTS";') },
        encoding: "utf8", timeout: 15000 });
    assert.equal(child.status, 1, "a sibling aggregate does not authenticate this job");
    assert.equal(fs.existsSync(effects), false, "mismatch refuses before source reads or modeled checkout");
  }
  const manuallyCalled = { ACTIONABILITY_CALLED_REVISION: sha, GITHUB_REPOSITORY: "open-hax/knoxx",
    GITHUB_WORKFLOW_SHA: "e".repeat(40), GITHUB_WORKFLOW_REF: "open-hax/knoxx/.github/workflows/caller.yml@refs/heads/main",
    TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1, head_sha: "f".repeat(40), repository: { full_name: "open-hax/knoxx" },
      referenced_workflows: [{ sha, path: `open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@${sha}` }] }) };
  assert.notEqual(run(manuallyCalled).status, 0, "foreign callers must dispatch in the owning repository");
  for (const job of Object.values(workflow.jobs)) {
    const authored = job.steps.find((step) => step.name === "Authenticate protected called source before checkout").run;
    const effectsDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-foreign-publication-"));
    const effects = path.join(effectsDirectory, "effects.txt");
    try {
      const foreign = runTrustedWorkflowFixture(import.meta.url, ["-c", `${authored}\nprintf 'publication-reached\n' >> "$TEST_EFFECTS"\n`],
        { env: { ...env, ...manuallyCalled, TEST_EFFECTS: effects,
          "BASH_FUNC_gh%%": '() { printf "native-read\\n" >> "$TEST_EFFECTS"; return 97; }' },
          encoding: "utf8", timeout: 15000 });
      assert.equal(foreign.status, 1);
      assert.equal(fs.existsSync(effects), false, "foreign owner refuses before native reads or modeled publication");
      assert.match(foreign.stdout, /share its publication lock/);
    } finally { fs.rmSync(effectsDirectory, { recursive: true, force: true }); }
  }
  assert.notEqual(run({ ...manuallyCalled, ACTIONABILITY_CALLED_REVISION: "" }).status, 0);
  assert.notEqual(run({ ...manuallyCalled, ACTIONABILITY_CALLED_REVISION: "malformed" }).status, 0);
  assert.notEqual(run({ ...manuallyCalled, ACTIONABILITY_CALLED_REVISION: "e".repeat(40) }).status, 0);
  assert.notEqual(run({ ...manuallyCalled, TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1,
    repository: { full_name: "open-hax/knoxx" }, referenced_workflows: [] }) }).status, 0);
  for (const changes of [
    { GITHUB_WORKFLOW_REF: env.GITHUB_WORKFLOW_REF.replace("/main", "/feature") },
    { TEST_BRANCH_JSON: JSON.stringify({ protected: false, commit: { sha } }) },
    { GITHUB_RUN_ATTEMPT: "2" },
    { ETA_SOURCE_SHA: "e".repeat(40) },
    { GITHUB_EVENT_NAME: "pull_request", ACTIONABILITY_CALLED_REVISION: sha, TEST_COMPARE_STATUS: "diverged" },
    { GITHUB_EVENT_NAME: "pull_request", ACTIONABILITY_CALLED_REVISION: sha, TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: 1, repository: { full_name: "open-hax/eta-mu" }, referenced_workflows: [] }) },
  ]) assert.notEqual(run(changes).status, 0, "untrusted source refuses before checkout");
});


test("every job refuses reruns before native reads and later artifact or token steps", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-actionability-attempt-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const sha = "d".repeat(40);
  const inputUpload = "actionability-input-${{ github.run_id }}-${{ github.run_attempt }}-${{ job.check_run_id }}";
  const profileUpload = "actionability-profile-${{ github.run_id }}-${{ github.run_attempt }}-${{ job.check_run_id }}";
  const inputName = "actionability-input-${{ github.run_id }}-${{ github.run_attempt }}-${{ needs.prepare.outputs.invocation_id }}";
  const profileName = "actionability-profile-${{ github.run_id }}-${{ github.run_attempt }}-${{ needs.prepare.outputs.invocation_id }}";
  const resultName = "actionability-result-${{ github.run_id }}-${{ github.run_attempt }}-${{ needs.prepare.outputs.invocation_id }}";
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
        ACTIONABILITY_JOB_WORKFLOW_SHA: sha,
        ACTIONABILITY_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main",
        ACTIONABILITY_JOB_CHECK_RUN_ID: "103", ACTIONABILITY_PREPARE_CHECK_RUN_ID: "101",
        GITHUB_ENV: path.join(directory, `${jobName}-${called}-${attempt}-github-env`),
        GITHUB_RUN_ATTEMPT: String(attempt), GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_WORKFLOW_SHA: called ? "e".repeat(40) : sha,
        GITHUB_WORKFLOW_REF: called ? "open-hax/eta-mu/.github/workflows/caller.yml@refs/heads/main" : "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main",
        ACTIONABILITY_CALLED_REVISION: called ? sha : "", TEST_EFFECTS: effects,
        TEST_BRANCH_JSON: JSON.stringify({ protected: true, commit: { sha } }),
        TEST_RUN_JSON: JSON.stringify({ id: 31, run_attempt: attempt, head_sha: called ? "f".repeat(40) : sha,
          repository: { full_name: repo }, referenced_workflows: [{ sha, path: `open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@${sha}` }] }),
        "BASH_FUNC_gh%%": ghSpy };
      // The appended marker models continuation after the real authored guard.
      // Native download/token actions are never invoked by this inert test.
      const child = runTrustedWorkflowFixture(import.meta.url, ["-c", `${job.steps[guardIndex].run}\nprintf 'later-step\\n' >> "$TEST_EFFECTS"\n`],
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
  assert.equal(token.with.owner, "${{ steps.target_identity.outputs.repository_owner }}");
  assert.equal(token.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
  const nativeGuard = workflow.jobs.publish.steps.find((step) => step.id === "target_identity");
  assert.ok(nativeGuard, "the token consumes only the guarded native-target output");
  const expectedPins = { CANONICAL_REVISION: "8497afdd329c3dcaefb78eec36d8e629a59d9eb2",
    MUSE_REVISION: "45c7a8d572bf44202f52cae2aa8c0f771736a617" };
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-target-scope-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const target of ["open-hax/another-installed-repo", "open-hax/eta-mu", "open-hax/knoxx"]) {
    const effects = path.join(directory, target.split("/")[1]);
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", `${workflow.jobs.prepare.steps[0].run}\nprintf 'setup-reached\n' >> "$TEST_EFFECTS"\n`],
      { env: { PATH: process.env.PATH, ...expectedPins, TIMEOUT_INPUT: "60", TARGET_REPOSITORY: target,
        TEST_EFFECTS: effects }, encoding: "utf8", timeout: 15000 });
    assert.equal(child.status, 0, child.stderr);
    const output = effects + ".outputs";
    const native = runTrustedWorkflowFixture(import.meta.url, ["-c", nativeGuard.run],
      { env: { PATH: process.env.PATH, TARGET_REPOSITORY: target, TARGET_REPOSITORY_ID: "3",
        GITHUB_OUTPUT: output, TEST_METADATA: JSON.stringify({ full_name: target, id: 3, visibility: "public", private: false }),
        "BASH_FUNC_gh%%": '() { [[ "$#" == 2 && "$1" == api && "$2" == "repos/$TARGET_REPOSITORY" ]] || return 97; printf "%s\\n" "$TEST_METADATA"; }' },
        encoding: "utf8", timeout: 15000 });
    assert.equal(native.error, undefined);
    assert.equal(native.signal, null);
    assert.equal(native.status, 0, native.stderr);
    const names = fs.readFileSync(output, "utf8");
    assert.equal(names, `repository_owner=open-hax\nrepository_name=${target.split("/")[1]}\n`);
    const outputs = Object.fromEntries(names.trimEnd().split("\n").map(line => line.split("=")));
    assert.equal(`${outputs.repository_owner}/${outputs.repository_name}`, target,
      "the explicit token list contains only this validated native target, not an incumbent allowlist");
  }
  for (const [n, target] of ["other-owner/repo", "open-hax/repo,other", "open-hax/repo\nother", "", "open-hax/"].entries()) {
    const effects = path.join(directory, `refusal-${n}`);
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", `${workflow.jobs.prepare.steps[0].run}\nprintf 'setup-reached\n' >> "$TEST_EFFECTS"\n`],
      { env: { PATH: process.env.PATH, ...expectedPins, TIMEOUT_INPUT: "60", TARGET_REPOSITORY: target,
        TEST_EFFECTS: effects }, encoding: "utf8", timeout: 15000 });
    assert.equal(child.status, 1);
    assert.equal(fs.existsSync(effects), false, "malformed/foreign targets refuse before modeled setup");
  }
});

test("actual host config admits only the exact personal fork before dependency setup", () => {
  const canonical = path.resolve(path.dirname(process.env.ACTIONABILITY_POLICY_FILE), "../..");
  const sha = "a".repeat(40);
  const env = { ...process.env, TARGET_REPOSITORY: "riatzukiza/knoxx", TARGET_REPOSITORY_ID: "1401249297",
    TARGET_HEAD_SHA: sha, TARGET_PR_NUMBER: "15", TARGET_THREAD_ID: "PRRT_fixture", TARGET_PROPOSAL_ID: "7001",
    CANONICAL_CHECKOUT: canonical, GITHUB_WORKFLOW_SHA: sha, ETA_SOURCE_SHA: sha,
    ACTIONABILITY_JOB_WORKFLOW_SHA: sha, ACTIONABILITY_CALLED_REVISION: "",
    ACTIONABILITY_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main",
    GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_RUN_ID: "31", GITHUB_RUN_ATTEMPT: "1",
    GITHUB_REPOSITORY: "open-hax/eta-mu", ACTIONABILITY_PREPARE_CHECK_RUN_ID: "101",
    GITHUB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-actionability-assessment.yml@refs/heads/main",
    ACTIONABILITY_HOST_HOME: "" };
  delete env.ACTIONABILITY_ASSESS_CHECK_RUN_ID; // The prepare phase has no optional assess identity.
  const nbb = path.join(root, "packages/eta-mu/node_modules/nbb/cli.js");
  const run = changes => {
    const result = spawnSync(process.execPath, [nbb, "-cp",
      `${root}/packages/eta-mu/src/cljs:${canonical}/skills/pr-flow/scripts`,
      path.join(root, ".github/scripts/opencode_actionability_assessment.cljs"), "prepare"],
      { cwd: root, env: { ...env, ...changes }, encoding: "utf8", timeout: 15000 });
    assert.equal(result.error, undefined);
    assert.equal(result.signal, null);
    assert.equal(result.status, 1, "the fixture intentionally stops before dependency setup or native I/O");
    const records = result.stderr.split("\n").filter(Boolean).map(line => JSON.parse(line));
    assert.equal(records.length, 1, "the actual host returns one structured refusal");
    return records[0].code;
  };
  assert.equal(run({}), "missing-host-input", "exact fork config reaches the intentionally absent dependency HOME");
  assert.equal(run({ TARGET_REPOSITORY: "open-hax/another-installed-repo", TARGET_REPOSITORY_ID: "3" }), "missing-host-input");
  for (const changes of [{ TARGET_REPOSITORY: "riatzukiza/proxx" }, { TARGET_REPOSITORY_ID: "1401249298" },
    { TARGET_REPOSITORY: "Riatzukiza/knoxx" }, { TARGET_REPOSITORY: "riatzukiza/knoxx/extra" },
    { TARGET_REPOSITORY: "riatzukiza/knoxx,other" }, { TARGET_REPOSITORY: "riatzukiza/knoxx\nother" }])
    assert.equal(run(changes), "host-input", "non-exact personal inputs refuse in the actual host guard");
  for (const value of ["01401249297", "1401249297.0"])
    assert.equal(run({ TARGET_REPOSITORY_ID: value }), "native-coordinate");
});

test("only the exact public Knoxx development fork adds a target installation scope", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-exact-knoxx-fork-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const target = "riatzukiza/knoxx";
  const id = "1401249297";
  const metadata = { full_name: target, id: Number(id), node_id: "R_kgDOU4VeEQ", visibility: "public", private: false };
  const base = { PATH: process.env.PATH, TARGET_REPOSITORY: target, TARGET_REPOSITORY_ID: id,
    TIMEOUT_INPUT: "60", CANONICAL_REVISION: workflow.env.CANONICAL_REVISION, MUSE_REVISION: workflow.env.MUSE_REVISION };
  const early = workflow.jobs.prepare.steps[0].run;
  for (const [name, changes, accepted] of [
    ["exact-fork", {}, true], ["org", { TARGET_REPOSITORY: "open-hax/knoxx", TARGET_REPOSITORY_ID: "3" }, true],
    ["other-personal", { TARGET_REPOSITORY: "riatzukiza/proxx" }, false],
    ["wrong-id", { TARGET_REPOSITORY_ID: "1401249298" }, false],
    ["leading-zero", { TARGET_REPOSITORY_ID: "01401249297" }, false],
    ["empty-id", { TARGET_REPOSITORY_ID: "" }, false],
    ["alias", { TARGET_REPOSITORY: "Riatzukiza/knoxx" }, false],
    ["extra-slash", { TARGET_REPOSITORY: "riatzukiza/knoxx/extra" }, false],
    ["comma", { TARGET_REPOSITORY: "riatzukiza/knoxx,other" }, false],
    ["newline", { TARGET_REPOSITORY: "riatzukiza/knoxx\nother" }, false],
  ]) {
    const effects = path.join(directory, `early-${name}`);
    const actual = runTrustedWorkflowFixture(import.meta.url, ["-c", `${early}\nprintf reached > "$TEST_EFFECTS"\n`],
      { env: { ...base, ...changes, TEST_EFFECTS: effects }, encoding: "utf8", timeout: 15000 });
    assert.equal(actual.error, undefined);
    assert.equal(actual.signal, null);
    assert.equal(actual.status === 0, accepted, `early guard: ${name}`);
    assert.equal(fs.existsSync(effects), accepted, "refusal precedes modeled native setup");
  }
  const cases = [
    ["exact", metadata, "0", true],
    ["wrong-node", { ...metadata, node_id: "R_other" }, "0", false],
    ["missing-node", { ...metadata, node_id: undefined }, "0", false],
    ["wrong-id", { ...metadata, id: Number(id) + 1 }, "0", false],
    ["string-id", { ...metadata, id }, "0", false],
    ["wrong-name", { ...metadata, full_name: "riatzukiza/proxx" }, "0", false],
    ["private", { ...metadata, visibility: "private", private: true }, "0", false],
    ["unknown-visibility", { ...metadata, visibility: null }, "0", false],
    ["missing-private", { ...metadata, private: undefined }, "0", false],
    ["contradiction", { ...metadata, private: true }, "0", false],
    ["failed-read", {}, "44", false],
    ["malformed", "not-json", "0", false],
  ];
  let tokenCount = 0;
  for (const [jobName, job] of Object.entries(workflow.jobs)) {
    const identity = job.steps.findIndex(step => step.id === "target_identity");
    for (const [index, step] of job.steps.entries()) {
      if (!step.uses?.startsWith("actions/create-github-app-token@")) continue;
      tokenCount++;
      assert.ok(identity < index, `${jobName}: identity precedes the actual App token action`);
      assert.equal(step.with.owner, "${{ steps.target_identity.outputs.repository_owner }}");
      assert.equal(step.with.repositories, "${{ steps.target_identity.outputs.repository_name }}");
    }
    for (const [name, row, readExit, accepted] of cases) {
      const output = path.join(directory, `${jobName}-${name}.outputs`);
      const effects = output + ".effects";
      const actual = runTrustedWorkflowFixture(import.meta.url, ["-c", `${job.steps[identity].run}\nprintf reached > "$TEST_EFFECTS"\n`],
        { env: { ...base, GITHUB_OUTPUT: output, TEST_EFFECTS: effects, TEST_READ_EXIT: readExit,
          TEST_METADATA: typeof row === "string" ? row : JSON.stringify(row),
          "BASH_FUNC_gh%%": '() { [[ "$#" == 2 && "$1" == api && "$2" == "repos/$TARGET_REPOSITORY" ]] || return 97; [[ "$TEST_READ_EXIT" == 0 ]] || return "$TEST_READ_EXIT"; printf "%s\\n" "$TEST_METADATA"; }' },
          encoding: "utf8", timeout: 15000 });
      assert.equal(actual.error, undefined);
      assert.equal(actual.signal, null);
      assert.equal(actual.status === 0, accepted, `${jobName}: native ${name}`);
      assert.equal(fs.existsSync(output), accepted, "refused identity supplies no token scope");
      assert.equal(fs.existsSync(effects), accepted, "refused identity precedes modeled checkout and token effects");
      if (accepted) assert.equal(fs.readFileSync(output, "utf8"), "repository_owner=riatzukiza\nrepository_name=knoxx\n");
    }
  }
  assert.equal(tokenCount, 4, "three job scopes include the retained post-model read-token refresh");
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
    assert.equal(guard.env.ACTIONABILITY_JOB_WORKFLOW_SHA, "${{ job.workflow_sha }}");
    assert.equal(guard.env.ACTIONABILITY_JOB_WORKFLOW_REF, "${{ job.workflow_ref }}");
    assert.equal(guard.env.ACTIONABILITY_JOB_CHECK_RUN_ID, "${{ job.check_run_id }}");
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
    assert.equal(token.with.owner, "${{ steps.target_identity.outputs.repository_owner }}");
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
      const child = runTrustedWorkflowFixture(import.meta.url, ["-c", guard.run + '\nprintf \'checkout-reached\\n\' >> "$TEST_EFFECTS"\n'],
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
        assert.equal(fs.readFileSync(output, "utf8"), "repository_owner=open-hax\nrepository_name=another-installed-repo\n");
      } else {
        assert.notEqual(child.status, 0, jobName + " refuses " + name + " native metadata");
        assert.equal(fs.existsSync(effects), false, "refusal occurs before modeled checkout/App continuation");
        assert.equal(fs.existsSync(output), false, "native refusal emits no token repository selection");
      }
    }
  }
});

/** Execute only the shell carrier with an inert failing host, never a native write. */
test("publication carrier preserves terminal bytes and an honest startup-crash fallback", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-publication-terminal-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const write = workflow.jobs.publish.steps.find((step) => step.name?.startsWith("Fresh canonical eligibility"));
  const posted = { status: "unestablished", outcome: "posted", "refusal-code": "native-readback-error",
    "actual-write-outcome": { outcome: "posted", "http-status": 201 }, "actual-post-response": { id: 7002 },
    "write-intent-performed": true, "retry-performed": false, admitted: false };
  const qualified = { status: "qualified", "record-id": 7002, "review-credit": false };
  for (const [name, exitCode, terminal] of [["startup-crash", 71, null], ["empty-success", 0, null], ["refused-readback", 1, posted], ["qualified", 0, qualified]]) {
    const file = path.join(directory, name + ".json");
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", write.run],
      { env: { PATH: process.env.PATH, PUBLICATION_RESULT_FILE: file, ETA_CHECKOUT: "/inert/eta", CANONICAL_CHECKOUT: "/inert/canonical",
        TEST_HOST_EXIT: String(exitCode), TEST_TERMINAL: terminal ? JSON.stringify(terminal) : "",
        "BASH_FUNC_node%%": '() { if [[ -n "$TEST_TERMINAL" ]]; then printf "%s\\n" "$TEST_TERMINAL" > "$PUBLICATION_RESULT_FILE"; fi; return "$TEST_HOST_EXIT"; }' },
        encoding: "utf8", timeout: 15000 });
    assert.equal(child.error, undefined);
    assert.equal(child.signal, null);
    assert.equal(child.status, terminal || exitCode !== 0 ? exitCode : 1);
    const retained = JSON.parse(fs.readFileSync(file, "utf8"));
    if (terminal) assert.deepEqual(retained, terminal, "host-written terminal bytes survive both failure and success");
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
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-actionability-locked-runtime-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const runtime = ".actionability/runtime";
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
      const eta = path.join(owned, ".actionability/eta");
      const source = path.join(eta, ".github/assessment-runtime");
      const temp = path.join(owned, "temp");
      const evidence = path.join(owned, "evidence");
      const profile = path.join(owned, "profile");
      for (const file of [source, temp, evidence, profile]) fs.mkdirSync(file, { recursive: true });
      const privateHostLeaves = [path.join(temp, "actionability-host-home"), evidence, profile];
      if (jobName === "prepare") for (const folder of privateHostLeaves) {
        fs.mkdirSync(folder, {recursive: true});
        fs.chmodSync(folder, 0o755);
      }
      fs.writeFileSync(path.join(source, "package.json"), packageBytes);
      if (variant !== "missing-lock") fs.writeFileSync(path.join(source, "package-lock.json"), lockBytes);
      const calls = path.join(owned, "npm-calls.txt");
      const continued = path.join(owned, "continued.txt");
      const child = runTrustedWorkflowFixture(import.meta.url, ["-c", prefix + '\nprintf "runtime-ready\\n" > "$TEST_CONTINUED"\n'], {
        cwd: owned, encoding: "utf8", timeout: 15000,
        env: { PATH: process.env.PATH, ETA_CHECKOUT: eta, GITHUB_WORKSPACE: owned, RUNNER_TEMP: temp,
          ACTIONABILITY_EVIDENCE_DIR: evidence, ACTIONABILITY_PROFILE_DIR: profile, TEST_NPM_CALLS: calls,
          TEST_CONTINUED: continued, TEST_NPM_EXIT: variant === "ci-failure" ? "73" : "0",
          "BASH_FUNC_npm%%": '() { printf "%s\\n" "$*" >> "$TEST_NPM_CALLS"; '
            + '[[ "$*" == "ci --prefix .actionability/runtime --ignore-scripts --no-audit --no-fund" ]] || return 97; '
            + 'cmp "$ETA_CHECKOUT/.github/assessment-runtime/package.json" .actionability/runtime/package.json || return 98; '
            + 'cmp "$ETA_CHECKOUT/.github/assessment-runtime/package-lock.json" .actionability/runtime/package-lock.json || return 98; '
            + 'return "$TEST_NPM_EXIT"; }' },
      });
      assert.equal(child.error, undefined);
      assert.equal(child.signal, null);
      if (variant === "intact") {
        assert.equal(child.status, 0, child.stderr);
        assert.equal(fs.readFileSync(continued, "utf8"), "runtime-ready\n");
        if (jobName === "prepare") for (const folder of privateHostLeaves)
          assert.equal(fs.statSync(folder).mode & 0o777, 0o700, "actual host-runtime step keeps each owned leaf private");
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
  const workflow=YAML.parse(fs.readFileSync(path.join(root,".github/workflows/opencode-actionability-assessment.yml"),"utf8"));
  assert.equal(workflow.env.REVIEW_MODEL_DISCOVERY,"opencode-free-mimo-flash-v1");
  assert.equal(workflow.env.REVIEW_EXPECTED_OPENCODE_VERSION,"1.18.18");
  const assess=workflow.jobs.assess.steps.find(step=>step.name==="Actual bounded credential-free invocation");
  assert.equal(assess.env.REVIEW_MODEL,"");
  assert.equal(assess.env.REVIEW_INPUT_PURPOSE,"actionability");
  assert.equal(assess["working-directory"],".actionability/model-root");
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
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-actionability-model-lock-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const stage = workflow.jobs.prepare.steps.find(step => step.name === "Reuse protected read-only Muse profile compilation");
  const stageLines = stage.run.trimEnd().split("\n");
  const stageStart = stageLines.findIndex(line => line.includes('/.opencode/package.json"'));
  assert.ok(stageStart >= 0);
  const stageTail = "set -euo pipefail\n" + stageLines.slice(stageStart).join("\n");
  for (const variant of ["trusted-lock", "generated-lock", "missing-lock", "manifest-mismatch"]) {
    const owned = path.join(directory, "stage-" + variant), temp = path.join(owned, "temp"), eta = path.join(owned, "eta");
    const output = path.join(temp, "actionability-muse-build/.opencode"), profile = path.join(owned, "profile"), evidence = path.join(owned, "evidence");
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
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", stageTail + '\nprintf "ready\\n" > "$TEST_CONTINUED"\n'], {
      encoding: "utf8", timeout: 15000,
      env: { PATH: process.env.PATH, RUNNER_TEMP: temp, ETA_CHECKOUT: eta,
        ACTIONABILITY_PROFILE_DIR: profile, ACTIONABILITY_EVIDENCE_DIR: evidence, TEST_CONTINUED: continued },
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
  const installStart = installLines.findIndex(line => line.trim() === 'MODEL_HOME="$RUNNER_TEMP/actionability-model-home"');
  assert.ok(installStart >= 0);
  const installTail = "set -euo pipefail\n" + installLines.slice(installStart).join("\n");
  const invoke = workflow.jobs.assess.steps.find(step => step.name === "Actual bounded credential-free invocation");
  assert.equal(invoke.env.OPENCODE_BIN,
    "${{ runner.temp }}/actionability-model-home/.eta-mu-opencode/node_modules/opencode-linux-x64-baseline/bin/opencode");
  for (const variant of ["intact", "missing-profile-lock", "manifest-mismatch", "profile-ci-failure", "missing-cli-lock", "cli-ci-failure", "missing-cli-executable"]) {
    const owned = path.join(directory, "install-" + variant), eta = path.join(owned, "eta"), temp = path.join(owned, "temp");
    const profile = path.join(owned, "profile"), canonical = path.join(owned, "canonical"), modelHome = path.join(temp, "actionability-model-home");
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
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", installTail + '\nprintf "ready\\n" > "$TEST_CONTINUED"\n'], {
      encoding: "utf8", timeout: 15000,
      env: { PATH: process.env.PATH, RUNNER_TEMP: temp, ETA_CHECKOUT: eta, CANONICAL_CHECKOUT: canonical,
        ACTIONABILITY_PROFILE_DIR: profile, TEST_VARIANT: variant, TEST_NPM_CALLS: calls, TEST_CONTINUED: continued,
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

test("native reader limits retain bounded assessment and one-shot publication headroom", () => {
  const YAML = createRequire(path.join(root, "packages/eta-mu/package.json"))("yaml");
  const source = fs.readFileSync(path.join(root, "packages/eta-mu/src/cljs/eta_mu/extern/actionability_host.cljs"), "utf8");
  const reader = source.slice(source.indexOf("(defn gh-json"), source.indexOf("(defn- source-git-input"));
  const limits = reader.match(/:timeout\s+\(if paginated\?\s+(\d+)\s+(\d+)\)/);
  assert.ok(limits, "actual synchronous native reader must retain distinct bounded deadlines");
  const [paginatedMilliseconds, singleMilliseconds] = limits.slice(1).map(Number);
  assert.equal(paginatedMilliseconds, 120000);
  assert.equal(singleMilliseconds, 15000);
  for (const name of ["actionability", "rejection", "positive-cohort"]) {
    const parsed = YAML.parse(fs.readFileSync(path.join(root, `.github/workflows/opencode-${name}-assessment.yml`), "utf8"));
    const assess = parsed.jobs.assess;
    const model = assess.steps.find((step) => step.id === "assess");
    const verify = assess.steps.find((step) => step.name === "Reverify actual accepted invocation and fresh custody");
    const refresh = assess.steps.findIndex((step) => step.id === "target_reader_after_model");
    const upload = assess.steps.find((step) => step.uses?.startsWith("actions/upload-artifact@"));
    assertNumericTimeout(parsed, 180, 180);
    assertNumericTimeout(parsed, "180", 180);
    assert.ok(assess["timeout-minutes"] >= 180 + verify["timeout-minutes"] + upload["timeout-minutes"] + 25,
      "max model execution, final host reads and upload retain separate setup headroom");
    assert.equal(assess["timeout-minutes"], 240);
    assert.equal(verify["timeout-minutes"], 30);
    assert.equal(upload["timeout-minutes"], 5);
    assert.ok(verify["timeout-minutes"] * 60000 > 2 * paginatedMilliseconds + 2 * singleMilliseconds,
      "individual native deadlines fit in final verification; author/page growth can still exhaust its bounded budget");
    assert.equal(refresh + 1, assess.steps.indexOf(verify));
    assert.equal(verify.env.GH_TOKEN, "${{ steps.target_reader_after_model.outputs.token }}");
    assert.equal(Object.keys(model.env).some((key) => /TOKEN|KEY|SECRET/.test(key)), false);
    const publish = parsed.jobs.publish;
    const operation = publish.steps.find((step) => step.name?.startsWith("Fresh canonical eligibility"));
    const resultUpload = publish.steps.find((step) => step.uses?.startsWith("actions/upload-artifact@"));
    const mint = publish.steps.findIndex((step) => step.id === "publisher");
    assert.equal(publish["timeout-minutes"], 60);
    assert.equal(operation["timeout-minutes"], 45);
    assert.equal(resultUpload["timeout-minutes"], 5);
    assert.ok(publish["timeout-minutes"] >= operation["timeout-minutes"] + resultUpload["timeout-minutes"] + 10);
    assert.equal(mint + 1, publish.steps.indexOf(operation), "one-shot operation begins immediately after its actual publication token mint");
    assert.equal(resultUpload.if, "always()");
    assert.equal(resultUpload.with["if-no-files-found"], "error");
    assert.match(operation.run, /"retry-performed":false/);
  }
});

test("actual BB assessment entry checks deployed Node before denial source or network work", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-bb-node-preflight-control-"));
  fs.chmodSync(directory, 0o700);
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const scripts = path.join(directory, "scripts");
  const bin = path.join(directory, "bin");
  const home = path.join(directory, "home");
  const temporary = path.join(directory, "tmp");
  for (const part of [scripts, bin, home, temporary]) fs.mkdirSync(part, { mode: 0o700 });
  const entry = path.join(scripts, "test-assessments.bb");
  fs.copyFileSync(path.join(root, "scripts/test-assessments.bb"), entry);
  const calls = path.join(directory, "calls.jsonl");
  const forbidden = path.join(directory, "forbidden-stage");
  const outerAudit = process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR;
  const outerCapture = process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE;
  assert.equal(Boolean(outerAudit), Boolean(outerCapture), "partial outer audit bindings refuse");
  const auditDirectory = outerAudit || path.join(directory, "probe-audit");
  const auditCapture = outerCapture || "bb-node-preflight-probe";
  if (!outerAudit) fs.mkdirSync(auditDirectory, { mode: 0o700 });
  const auditStat = fs.lstatSync(auditDirectory);
  assert.equal(auditStat.isDirectory(), true);
  assert.equal(auditStat.isSymbolicLink(), false);
  assert.equal(auditStat.mode & 0o777, 0o700);
  assert.equal(auditStat.uid, process.getuid());
  assert.equal(fs.realpathSync(auditDirectory), path.resolve(auditDirectory));
  assert.match(auditCapture, /^[a-zA-Z0-9-]+$/);
  const physicalPreload = fs.realpathSync(path.join(root, "scripts/assessment-network-deny-preload.cjs"));
  const preloadDigest = (bytes) => createRequire(import.meta.url)("node:crypto").createHash("sha256").update(bytes).digest("hex");
  const preloadSHA256 = preloadDigest(fs.readFileSync(physicalPreload));
  const nodeWrapper = `#!/usr/bin/python3\nimport json,os,pathlib,subprocess,sys\nargs=sys.argv[1:]\nfile=pathlib.Path(${JSON.stringify(calls)})\nif args==["-p","process.versions.node.split('.')[0]"]:\n env=dict(os.environ)\n env.update({"NODE_OPTIONS":${JSON.stringify("--require " + JSON.stringify(physicalPreload))},"ETA_MU_TEST_NETWORK_AUDIT_DIR":${JSON.stringify(auditDirectory)},"ETA_MU_TEST_NETWORK_AUDIT_CAPTURE":${JSON.stringify(auditCapture)}})\n child=subprocess.Popen([${JSON.stringify(process.execPath)},*args],env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE)\n stdout,stderr=child.communicate()\n with file.open("a") as out:out.write(json.dumps({"kind":"actual-node-major","argv":args,"reported":stdout.decode().strip(),"status":child.returncode,"nodePid":child.pid,"pythonPid":os.getpid(),"pythonParentPid":os.getppid()})+"\\n")\n sys.stdout.buffer.write(stdout);sys.stderr.buffer.write(stderr);sys.exit(child.returncode)\nwith file.open("a") as out:out.write(json.dumps({"kind":"blocked-denial-stage","argv":args})+"\\n")\nsys.exit(97)\n`;
  fs.writeFileSync(path.join(bin, "node"), nodeWrapper, { flag: "wx", mode: 0o700 });
  for (const name of ["git", "pnpm", "npm", "bash", "tar", "java", "clojure"]) {
    fs.writeFileSync(path.join(bin, name), `#!/usr/bin/python3\nimport pathlib,sys\npathlib.Path(${JSON.stringify(forbidden)}).write_text(${JSON.stringify(name)})\nsys.exit(98)\n`, { flag: "wx", mode: 0o700 });
  }
  const result = spawnSync("bb", ["-Djava.io.tmpdir=" + temporary, entry], { cwd: directory, encoding: "utf8", timeout: 15000,
    env: { PATH: `${bin}:${process.env.PATH || "/usr/local/bin:/usr/bin:/bin"}`, HOME: home, TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"), LANG: "C.UTF-8", LC_ALL: "C.UTF-8", TZ: "UTC" } });
  assert.equal(result.error, undefined, result.stderr);
  assert.equal(result.signal, null, result.stderr);
  assert.equal(result.status, 1, "controlled entry terminates before registered suite or source traffic");
  assert.equal(fs.existsSync(forbidden), false, "no public source, build or network stage is dispatched");
  const rows = fs.existsSync(calls) ? fs.readFileSync(calls, "utf8").trim().split("\n").map(JSON.parse) : [];
  assert.ok(rows.length > 0, result.stdout + result.stderr);
  assert.equal(rows[0].kind, "actual-node-major", "real Node major must be checked before the first denial control");
  assert.equal(rows[0].reported, process.versions.node.split(".")[0]);
  assert.equal(rows[0].status, 0);
  assert.ok(Number.isSafeInteger(result.pid) && result.pid > 0);
  assert.ok(Number.isSafeInteger(rows[0].nodePid) && rows[0].nodePid > 0);
  assert.ok(Number.isSafeInteger(rows[0].pythonPid) && rows[0].pythonPid > 0);
  assert.equal(rows[0].pythonParentPid, result.pid);
  assert.equal(preloadDigest(fs.readFileSync(physicalPreload)), preloadSHA256);
  const auditFile = path.join(auditDirectory, `${rows[0].nodePid}.json`);
  const recordStat = fs.lstatSync(auditFile);
  assert.equal(recordStat.isFile(), true);
  assert.equal(recordStat.isSymbolicLink(), false);
  assert.equal(recordStat.mode & 0o777, 0o600);
  assert.equal(recordStat.uid, process.getuid());
  assert.ok(recordStat.size > 0 && recordStat.size <= 65536);
  const nodeAudit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
  assert.equal(nodeAudit.schema, "eta-mu.test-network-denial/v1");
  assert.equal(nodeAudit.capture, auditCapture);
  assert.equal(nodeAudit.pid, rows[0].nodePid);
  assert.equal(nodeAudit.parentPid, rows[0].pythonPid);
  assert.equal(nodeAudit.deniedAttempts, 0);
  assert.deepEqual(nodeAudit.expectedNodeChildren, []);
  assert.ok(Array.isArray(nodeAudit.kernelAncestry));
  const expectedChain = [rows[0].nodePid, rows[0].pythonPid, result.pid, process.pid];
  assert.deepEqual(nodeAudit.kernelAncestry.slice(0, 4).map((entry) => entry.pid), expectedChain);
  for (const [index, ancestor] of nodeAudit.kernelAncestry.slice(0, 4).entries()) {
    assert.match(ancestor.startTicks, /^[0-9]+$/);
    if (index < 3) assert.equal(ancestor.parentPid, expectedChain[index + 1]);
  }
  if (rows[0].reported === "24") {
    assert.equal(rows.length, 2);
    assert.equal(rows[1].kind, "blocked-denial-stage");
    assert.deepEqual(rows[1].argv, ["--test", "scripts/assessment-network-deny-preload.test.mjs"]);
    assert.match(result.stderr, /Assessment prerequisite failed/);
  } else {
    assert.equal(rows.length, 1, "unsupported runtime refuses before any denial-control launch");
    assert.match(result.stderr, /Assessment controls require deployed Node major 24/);
  }
  t.diagnostic(JSON.stringify({ schema: "eta-mu.bb-required-node-preflight-control/v1",
    actualNodeVersion: process.versions.node, bbExit: result.status, bbPID: result.pid,
    calls: rows, ownerNodePID: process.pid, auditDirectory, auditCapture,
    auditScope: outerAudit ? "owning outer audit" : "fixture-owned standalone audit",
    physicalPreload, preloadSHA256, auditFile, nodeAudit,
    forbiddenStagePresent: fs.existsSync(forbidden), stdout: result.stdout, stderr: result.stderr }));
});

test("publisher deadline accommodates the concrete bounded two-author read-plan simulation", () => {
  const YAML = createRequire(path.join(root, "packages/eta-mu/package.json"))("yaml");
  const source = fs.readFileSync(path.join(root, "packages/eta-mu/src/cljs/eta_mu/extern/actionability_host.cljs"), "utf8");
  const reader = source.slice(source.indexOf("(defn gh-json"), source.indexOf("(defn- source-git-input"));
  const limits = reader.match(/:timeout\s+\(if paginated\?\s+(\d+)\s+(\d+)\)/);
  assert.ok(limits);
  const [paginated, single] = limits.slice(1).map(Number);
  assert.match(source, /\/attempts\/" run-attempt "\/jobs"\)[\s\S]*?"--paginate" "--slurp"/);
  assert.match(source, /\/files\?per_page=100"\) "--paginate" "--slurp"/);
  // Simulation only: four publication custody boundaries, one native thread page,
  // two distinct human authors and two selected preservation source paths per
  // boundary. Additional authors, pages, source paths and local Git work may
  // exhaust the bounded operation; this is not a real API timing measurement.
  const plan = [];
  for (const phase of ["initial eligibility", "pre-write rebind", "post-write recollect", "post-GET rebind"]) {
    plan.push({ phase, name: "run jobs", milliseconds: paginated });
    plan.push({ phase, name: "PR changed files", milliseconds: paginated });
    plan.push({ phase, name: "complete issue corpus", milliseconds: paginated });
    for (const name of ["owning repository", "owning run", "eta repository", "protected branch", "reusable compare",
      "one GraphQL thread page", "human permission A", "human permission B", "preservation source A", "preservation source B"])
      plan.push({ phase, name, milliseconds: single });
  }
  plan.push({ phase: "publisher proof", name: "installation repositories", milliseconds: paginated });
  for (const name of ["App metadata", "installation metadata", "publisher Bot identity", "one POST", "exact comment GET"])
    plan.push({ phase: "publisher proof and terminal readback", name, milliseconds: single });
  const milliseconds = plan.reduce((clock, read) => clock + read.milliseconds, 0);
  assert.equal(plan.filter((read) => read.name === "run jobs").length, 4);
  assert.equal(plan.filter((read) => read.name === "PR changed files").length, 4);
  assert.equal(milliseconds, 2235000);
  for (const purpose of ["actionability", "rejection", "positive-cohort"]) {
    const parsed = YAML.parse(fs.readFileSync(path.join(root, `.github/workflows/opencode-${purpose}-assessment.yml`), "utf8"));
    const operation = parsed.jobs.publish.steps.find((step) => step.name?.startsWith("Fresh canonical eligibility"));
    const upload = parsed.jobs.publish.steps.find((step) => step.uses?.startsWith("actions/upload-artifact@"));
    assert.ok(operation["timeout-minutes"] * 60000 > milliseconds,
      `${purpose}: bounded native read-plan simulation must fit before the one-shot operation deadline`);
    assert.ok(parsed.jobs.publish["timeout-minutes"] >= operation["timeout-minutes"] + upload["timeout-minutes"] + 10,
      `${purpose}: upload and setup retain separate time after the bounded operation`);
  }
});

// Actual dispatch strings and workflow-call numbers use the same authored gate.
for (const route of ["actionability", "rejection", "positive-cohort"]) {
  test(`native timeout typing and prepare refusal (${route})`, () => {
    const YAML = createRequire(import.meta.url)("yaml");
    const current = YAML.parse(fs.readFileSync(path.join(root, `.github/workflows/opencode-${route}-assessment.yml`), "utf8"));
    const guard = current.jobs.prepare.steps[0].run;
    const env = { PATH: process.env.PATH, TARGET_REPOSITORY: "open-hax/eta-mu",
      CANONICAL_REVISION: current.env.CANONICAL_REVISION, MUSE_REVISION: current.env.MUSE_REVISION,
      REJECTION_HISTORY_SOURCE_SHA256: "a".repeat(64), REJECTION_HISTORY_CLI_SHA256: "b".repeat(64),
      POSITIVE_COHORT_HISTORY_SOURCE_SHA256: "a".repeat(64), POSITIVE_COHORT_HISTORY_CLI_SHA256: "b".repeat(64) };
    const run = value => runTrustedWorkflowFixture(import.meta.url, ["-c", guard], {
      env: { ...env, TIMEOUT_INPUT: String(value) }, encoding: "utf8", timeout: 15000 });
    assertNativeBudgetFixture(current, run);
  });
}
