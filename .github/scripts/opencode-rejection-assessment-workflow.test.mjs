// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { runTrustedWorkflowFixture } from "./assessment-trusted-workflow-fixture.mjs";
import { createNativeAssessmentFixtures } from "./native-assessment-fixture.mjs";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const { nativeFixture, runNativeDiscoveryFixture, childNetworkAudit } = createNativeAssessmentFixtures({
  root, purpose: "rejection-assessment", inputName: "rejection-assessment-input.txt",
  schema: "open-hax.rejection-assessment-input/v1",
  verifierEnvironmentVariable: "ETA_MU_REJECTION_VERIFIER_FILE",
  verifierSHAEnvironmentVariable: "ETA_MU_REJECTION_VERIFIER_SHA256",
  directoryPrefix: "eta-rejection-assessment-host-",
  target: { repository_id: "R_fixture", repository_database_id: 3, pr_id: "PR_fixture",
      pr_number: 1, thread_id: "PRRT_fixture", root_comment_id: 7 },
  event: "COMMENT", providerSentinels: true
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

/** Execute the authored install step with inert npm/profile fixtures, never a model. */
async function installedReviewProfile(t, invalidTool = null) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-context-"));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const temporary = path.join(directory, "runner"), bin = path.join(directory, "bin");
  const eta = path.join(directory, "eta"), profile = path.join(directory, "profile");
  const modelRoot = path.join(directory, ".rejection-assessment/model-root");
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
      REJECTION_PROFILE_DIR: profile, REJECTION_EVIDENCE_DIR: evidence},
    encoding: "utf8", timeout: 15000}, 0);
  return {result, modelRoot, directory,
    wrapper: path.join(temporary, "rejection-assessment-model-home/.config/opencode/plugins/eta-mu-actors.js"),
    stagedActors: path.join(temporary, "rejection-assessment-model-home/.eta-mu-review/dist/eta-mu-actors.js")};
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
      {name: "Error", message: "Missing rejection review tool"}, invalidTool.kind);
    assert.deepEqual(dispatched, [], "incomplete tool tables refuse before any tool executes");
  }
});

test("compiled profile binding resolves the pinned runtime from the ETA checkout and preserves the parent cwd", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-rejection-profile-binding-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const eta = path.join(directory, ".rejection-assessment/eta");
  const runtime = path.join(directory, ".rejection-assessment/runtime");
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
  fs.writeFileSync(entry, "(require '[eta-mu.extern.actionability-host :as h]) (println (h/directory-digest (h/env \"REJECTION_PROFILE_DIR\")))\n");
  const env = { PATH: `${path.dirname(process.execPath)}:${process.env.PATH}`, HOME: directory,
    ETA_CHECKOUT: eta, GITHUB_WORKSPACE: directory, CANONICAL_CHECKOUT: canonical,
    REJECTION_PROFILE_DIR: profile, REVIEW_INVOCATION_VERIFIER_FILE: verifier,
    GITHUB_OUTPUT: path.join(directory, "outputs"), TEST_PARENT_AFTER: path.join(directory, "parent-cwd") };
  // No ambient NODE_PATH: the hosted runtime is installed only under runtime,
  // and only the ETA checkout receives its node_modules link.
  const neighbor = runTrustedWorkflowFixture(import.meta.url,
    ["-c", 'node "$GITHUB_WORKSPACE/.rejection-assessment/runtime/node_modules/nbb/cli.js" -cp "$ETA_CHECKOUT/packages/eta-mu/src/cljs" "$ETA_CHECKOUT/profile-digest.cljs"'],
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
  const runPins = (changes = {}) => runTrustedWorkflowFixture(import.meta.url, ["-c", guard], { encoding: "utf8", timeout: 15000,
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
  assert.equal(workflow.jobs.assess["timeout-minutes"], 240);
  assert.match(workflow.jobs.assess.steps.find(step => step.id === "assess")["timeout-minutes"], /> 180 && 180/);
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
  const run = (changes = {}) => runTrustedWorkflowFixture(import.meta.url, ["-c", guards[0]], { env: { ...env, ...changes }, encoding: "utf8", timeout: 15000 });
  assert.equal(run().status, 0, "inert native default-branch source admits");
  assert.equal(run({ GITHUB_EVENT_NAME: "pull_request", REJECTION_CALLED_REVISION: sha }).status, 0, "inert called exact referenced source admits");
  for (const changes of [
    { REJECTION_JOB_WORKFLOW_SHA: "e".repeat(40) },
    { REJECTION_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/sibling.yml@refs/heads/main" },
    { REJECTION_JOB_WORKFLOW_REF: "open-hax/eta-mu/.github/workflows/opencode-rejection-assessment.yml@" },
    { REJECTION_JOB_WORKFLOW_SHA: "" },
  ]) {
    const effects = path.join(contextDirectory, `mismatch-${Object.keys(changes)[0]}-${Object.values(changes)[0].length}.txt`);
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", `${guards[0]}\nprintf 'checkout-reached\n' >> "$TEST_EFFECTS"\n`],
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
      const foreign = runTrustedWorkflowFixture(import.meta.url, ["-c", `${authored}\nprintf 'publication-reached\n' >> "$TEST_EFFECTS"\n`],
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
    assert.equal(names, `repository_name=${target.split("/")[1]}\n`);
    const repositoryName = names.slice("repository_name=".length).trimEnd();
    assert.equal(`${token.with.owner}/${repositoryName}`, target,
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
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", write.run],
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
      const child = runTrustedWorkflowFixture(import.meta.url, ["-c", prefix + '\nprintf "runtime-ready\\n" > "$TEST_CONTINUED"\n'], {
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
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", stageTail + '\nprintf "ready\\n" > "$TEST_CONTINUED"\n'], {
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
    const child = runTrustedWorkflowFixture(import.meta.url, ["-c", installTail + '\nprintf "ready\\n" > "$TEST_CONTINUED"\n'], {
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
