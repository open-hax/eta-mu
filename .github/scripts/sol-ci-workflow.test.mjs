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
const requireFromEtaMu = createRequire(path.join(root, "packages/eta-mu/package.json"));
const YAML = requireFromEtaMu("yaml");
const workflowPath = path.join(root, ".github/workflows/sol-ci.yml");
const workflowText = fs.readFileSync(workflowPath, "utf8");
const workflow = YAML.parse(workflowText);
const verify = workflow.jobs.verify;
const trustedWorkflowPath = path.join(root, ".github/workflows/sol-trusted-integration.yml");
const trustedWorkflowText = fs.readFileSync(trustedWorkflowPath, "utf8");
const trustedWorkflow = YAML.parse(trustedWorkflowText);
const trustedVerify = trustedWorkflow.jobs.verify;

function namedStep(name) {
  const step = verify.steps.find((candidate) => candidate.name === name);
  assert.ok(step, `missing Sol CI step: ${name}`);
  return step;
}

function namedTrustedStep(name) {
  const step = trustedVerify.steps.find((candidate) => candidate.name === name);
  assert.ok(step, `missing trusted Sol integration step: ${name}`);
  return step;
}

function makeRepository(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-sol-ci-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: directory });
  execFileSync("git", ["config", "user.name", "sol-ci-test"], { cwd: directory });
  execFileSync("git", ["config", "user.email", "sol-ci@example.invalid"], { cwd: directory });
  fs.writeFileSync(path.join(directory, "sol.txt"), "exact head\n");
  execFileSync("git", ["add", "sol.txt"], { cwd: directory });
  execFileSync("git", ["commit", "-qm", "fixture"], { cwd: directory });
  const sha = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: directory,
    encoding: "utf8",
  }).trim();
  return { directory, sha };
}

test("Sol pull-request validation checks out the immutable PR head", (t) => {
  assert.ok(workflow.on.pull_request);
  assert.ok(workflow.on.push);
  assert.equal(workflow.on.pull_request_target, undefined);
  assert.deepEqual(workflow.permissions, { contents: "read" });

  const exactRef = "${{ github.event_name == 'pull_request' && github.event.pull_request.head.sha || github.sha }}";
  const checkout = namedStep("Check out exact event revision");
  assert.equal(checkout.with.ref, exactRef);
  assert.equal(checkout.with["persist-credentials"], false);
  assert.equal(checkout.with["fetch-depth"], 1);

  const guard = namedStep("Verify exact and clean checkout");
  assert.equal(guard.env.EXPECTED_SHA, exactRef);
  assert.match(guard.run, /git rev-parse HEAD/);
  assert.match(guard.run, /git status --porcelain --untracked-files=all/);

  const { directory, sha } = makeRepository(t);
  const result = spawnSync("bash", ["-c", guard.run], {
    cwd: directory,
    env: { ...process.env, EXPECTED_SHA: sha },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("pull-request-controlled Sol execution has no private dependency capability or bytes", () => {
  const serialized = JSON.stringify(verify);
  for (const pattern of [
    /secrets\.ETA_MU_APP_(?:ID|PRIVATE_KEY)/,
    /actions\/create-github-app-token/,
    /steps\.dependency-token\.outputs\.token/,
    /http\.https:\/\/github\.com\/\.extraheader/,
    /private-dependency read token/i,
  ]) {
    assert.doesNotMatch(serialized, pattern);
  }

  const lint = namedStep("Lint Sol public source and tests");
  assert.equal(lint.if, undefined);
  assert.equal(lint["working-directory"], "packages/sol");
  assert.match(lint.run, /clj-kondo --lint src\/cljs test\/cljs/);
  assert.match(lint.run, /node \.\.\/\.\.\/scripts\/contract-guard\.mjs src\/cljs test\/cljs/);
  assert.doesNotMatch(lint.run, /pnpm(?:\s|$)/);
  assert.doesNotMatch(lint.run, /packages\/sol\/(?:test|build)(?:\s|$)/);

  const boundary = namedStep("Record pull-request private-integration boundary");
  assert.equal(boundary.if, "${{ github.event_name == 'pull_request' }}");
  assert.match(boundary.run, /exact-head public-source lint only/);
  assert.match(boundary.run, /intentionally absent/);
});

test("private Sol dependency resolution and executable gates live in a push-only workflow", () => {
  assert.deepEqual(Object.keys(trustedWorkflow.on), ["push"]);
  assert.ok(trustedWorkflow.on.push);
  assert.equal(trustedWorkflow.on.pull_request, undefined);
  assert.equal(trustedWorkflow.on.pull_request_target, undefined);
  assert.equal(trustedWorkflow.on.workflow_dispatch, undefined);
  assert.equal(trustedWorkflow.on.workflow_call, undefined);
  assert.deepEqual(trustedWorkflow.on.push.branches, ["main", "staging"]);
  assert.deepEqual(trustedWorkflow.permissions, { contents: "read" });

  const checkout = namedTrustedStep("Check out canonical push revision");
  assert.equal(checkout.with.ref, "${{ github.sha }}");
  assert.equal(checkout.with["persist-credentials"], false);

  const token = namedTrustedStep("Create private-dependency read token");
  assert.match(token.uses, /^actions\/create-github-app-token@[0-9a-f]{40}$/);
  assert.match(token.with.repositories, /^katamorph\nevent-ledger\s*$/);
  assert.equal(token.with["permission-contents"], "read");

  assert.match(namedTrustedStep("Test Sol").run, /packages\/sol test/);
  assert.match(namedTrustedStep("Build Sol server").run, /packages\/sol build/);
  assert.equal(namedTrustedStep("Remove private Git authorization").if, "${{ always() }}");
});

test("trusted Sol evidence is a sealed logs-only artifact", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eta-mu-sol-evidence-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const name of ["sol-lint.log", "sol-test.log", "sol-build.log"]) {
    fs.writeFileSync(path.join(directory, name), `${name}\n`);
  }
  fs.mkdirSync(path.join(directory, "packages/sol/.shadow-cljs/builds/server/dev/out"), { recursive: true });
  fs.writeFileSync(path.join(directory, "packages/sol/.shadow-cljs/private-source.cljs"), "private bytes\n");
  fs.writeFileSync(path.join(directory, "packages/sol/.shadow-cljs/builds/server/dev/out/main.js.map"), "{}\n");

  const evidenceDirectory = path.join(directory, "runner-temp/sol-validation-evidence");
  const seal = namedTrustedStep("Seal bounded Sol validation evidence");
  assert.equal(seal.if, "${{ always() }}");
  const result = spawnSync("bash", ["-c", seal.run], {
    cwd: directory,
    env: {
      ...process.env,
      RUNNER_TEMP: path.join(directory, "runner-temp"),
      SOL_EVIDENCE_DIRECTORY: evidenceDirectory,
    },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(
    fs.readdirSync(evidenceDirectory).sort(),
    ["SHA256SUMS", "sol-build.log", "sol-lint.log", "sol-test.log"],
  );
  assert.doesNotMatch(fs.readFileSync(path.join(evidenceDirectory, "SHA256SUMS"), "utf8"), /shadow-cljs|\.map/);

  const upload = namedTrustedStep("Upload Sol validation evidence");
  assert.equal(upload.with.path, "${{ runner.temp }}/sol-validation-evidence");
  assert.equal(upload.with["if-no-files-found"], "error");
  assert.doesNotMatch(JSON.stringify(upload.with), /shadow-cljs|\.map/);
});

test("Sol workflow actions are immutable and the stable check name remains Sol CI / verify", () => {
  assert.equal(workflow.name, "Sol CI");
  assert.ok(verify);
  assert.equal(trustedWorkflow.name, "Sol Trusted Integration");
  assert.ok(trustedVerify);
  assert.match(workflowText, /^# SPDX-License-Identifier: GPL-3\.0-or-later/m);
  assert.match(trustedWorkflowText, /^# SPDX-License-Identifier: GPL-3\.0-or-later/m);
  for (const step of [...verify.steps, ...trustedVerify.steps].filter((candidate) => candidate.uses)) {
    assert.match(step.uses, /@[0-9a-f]{40}$/, `${step.name} action is not pinned to a commit`);
  }
});
