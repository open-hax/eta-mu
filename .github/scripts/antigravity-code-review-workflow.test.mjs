// SPDX-License-Identifier: GPL-3.0-or-later
// Dependency-free tests execute the actual trusted preflight, never candidate code.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, appendFileSync, rmSync, symlinkSync, globSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const workflowPath = new URL('../workflows/antigravity-code-review.yml', import.meta.url);
const workflow = existsSync(workflowPath) ? readFileSync(workflowPath, 'utf8') : '';
const registration = readFileSync(new URL('../../scripts/test.bb', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const step = name => {
  const start = workflow.indexOf(`      - name: ${name}\n`);
  assert.notEqual(start, -1, `missing step ${name}`);
  const end = workflow.indexOf('\n      - name:', start + 1);
  return workflow.slice(start, end === -1 ? undefined : end);
};
function literal(source, key) {
  const lines = source.split('\n');
  const index = lines.findIndex(line => line.trim() === `${key}: |`);
  assert.ok(index >= 0, `missing ${key} literal`);
  const indent = lines[index].indexOf(key) + 2;
  const body = [];
  for (const line of lines.slice(index + 1)) {
    if (line.trim() && line.search(/\S/) < indent) break;
    body.push(line.slice(indent));
  }
  return body.join('\n');
}
const head = 'a'.repeat(40);
const base = 'b'.repeat(40);
const runtime = 'c'.repeat(40);
const repo = { full_name: 'open-hax/eta-mu', private: false, id: 123 };
const pr = { number: 42, state: 'open', draft: false, merged: false,
  head: { sha: head, repo }, base: { sha: base, repo } };
const context = { eventName: 'pull_request', repo: { owner: 'open-hax', repo: 'eta-mu' },
  payload: { repository: repo, pull_request: pr } };
const env = { REVIEW_HEAD_SHA: head, REVIEW_BASE_SHA: base, REVIEW_RUNTIME_REVISION: runtime,
  REVIEW_MODEL: 'gemini-3.8-flash-high', REVIEW_WORKER_READY: 'true' };
async function validate({ ctx = context, environment = env, current = pr, repository = repo } = {}) {
  const outputs = {};
  const preflight = new AsyncFunction('github', 'context', 'core', 'process', literal(step('Validate immutable same-repository review request'), 'script'));
  await preflight({ rest: { pulls: { get: async () => ({ data: current }) },
    repos: { get: async () => ({ data: repository }) } } }, ctx,
  { setOutput: (key, value) => { outputs[key] = value; }, info() {} }, { env: environment });
  return outputs;
}

test('same-repository immutable PR admits only the exact configured model', async () => {
  assert.deepEqual(await validate(), { 'head-sha': head, 'base-sha': base, 'runtime-revision': runtime });
  const privateRepository = { ...repo, private: true };
  const privatePR = { ...pr, head: { ...pr.head, repo: privateRepository }, base: { ...pr.base, repo: privateRepository } };
  assert.deepEqual(await validate({ repository: privateRepository, current: privatePR,
    ctx: { ...context, payload: { repository: privateRepository, pull_request: privatePR } } }),
  { 'head-sha': head, 'base-sha': base, 'runtime-revision': runtime });
  for (const [key, value] of [
    ['REVIEW_HEAD_SHA', 'main'], ['REVIEW_BASE_SHA', 'b'.repeat(39)],
    ['REVIEW_RUNTIME_REVISION', `${runtime}; touch /tmp/injected`],
    ['REVIEW_MODEL', 'gemini-flash-latest'], ['REVIEW_MODEL', 'gemini-3.8-flash-high;echo nope'],
    ['REVIEW_WORKER_READY', ''], ['REVIEW_WORKER_READY', 'false'],
  ]) await assert.rejects(validate({ environment: { ...env, [key]: value } }));
});

test('missing provisioning fails explicitly before any persistent runner is allocated', async () => {
  await assert.rejects(validate({ environment: { ...env, REVIEW_WORKER_READY: '' } }), /not provisioned/i);
  assert.match(workflow, /review:\n    needs: preflight\n/);
  assert.doesNotMatch(workflow, /if:.*WORKER_READY/);
});

test('fork, draft, visibility mismatch, closed and non-PR events are refused visibly', async () => {
  for (const ctx of [
    { ...context, eventName: 'pull_request_target' },
    { ...context, eventName: 'workflow_dispatch' },
    { ...context, payload: { ...context.payload, pull_request: undefined } },
    { ...context, payload: { ...context.payload, repository: { ...repo, private: true } } },
  ]) await assert.rejects(validate({ ctx }));
  for (const change of [
    { draft: true }, { state: 'closed' }, { merged: true },
    { head: { ...pr.head, repo: { ...repo, full_name: 'attacker/eta-mu', id: 456 } } },
    { base: { ...pr.base, repo: { ...repo, full_name: 'attacker/eta-mu', id: 456 } } },
  ]) {
    const changed = { ...pr, ...change };
    await assert.rejects(validate({ current: changed }));
    await assert.rejects(validate({ ctx: { ...context, payload: { ...context.payload, pull_request: changed } } }));
  }
  await assert.rejects(validate({ repository: { ...repo, private: true } }));
});

test('current API head and base must still match event and requested immutable tuple', async () => {
  for (const key of ['head', 'base']) {
    const changed = { ...pr, [key]: { ...pr[key], sha: 'd'.repeat(40) } };
    await assert.rejects(validate({ current: changed }));
    await assert.rejects(validate({ ctx: { ...context, payload: { ...context.payload, pull_request: changed } } }));
  }
  await assert.rejects(validate({ current: { ...pr, number: 43 } }));
});

test('reusable interface has no secret channel, write token, publication or executable candidate setup', () => {
  assert.match(workflow, /workflow_call:/);
  for (const name of ['pr_head_sha', 'pr_base_sha', 'review_runtime_revision', 'model']) assert.match(workflow, new RegExp(`      ${name}:`));
  assert.doesNotMatch(workflow, /secrets:|secrets\.|: write|pull_request_target:|createReview|createComment|gh pr|npm install|pnpm|setup-node|setup-java/);
  assert.equal((workflow.match(/contents: read/g) || []).length, 3);
  assert.equal((workflow.match(/pull-requests: read/g) || []).length, 3);
  for (const match of workflow.matchAll(/uses: ([^\s#]+)/g)) assert.match(match[1], /@[a-f0-9]{40}$/);
});

test('persistent runner group and approved local runtime remain external deployment prerequisites', () => {
  assert.match(workflow, /group:.*vars\.ANTIGRAVITY_REVIEW_RUNNER_GROUP.*antigravity-review/);
  assert.match(workflow, /labels: \[self-hosted, Linux, X64, antigravity-review\]/);
  assert.match(workflow, /exact pinned reusable workflow SHA/);
  assert.match(workflow, /enterprise runner group|enterprise group/i);
  const prepare = literal(step('Verify preinstalled trusted runtime and allocate isolated paths'), 'run');
  assert.match(prepare, /git -C "\$ANTIGRAVITY_REVIEW_RUNTIME" rev-parse HEAD/);
  assert.match(prepare, /git -C "\$ANTIGRAVITY_REVIEW_RUNTIME" status --porcelain --untracked-files=all/);
  assert.match(prepare, /mktemp -d "\$runner_temp\/antigravity-review\.XXXXXXXX"/);
  assert.doesNotMatch(prepare, /git (clone|checkout|reset|fetch)|curl|wget/);
});

test('actual provisioning shell rejects changed runtime identity and dirty source before checkout', t => {
  const fixture = mkdtempSync(join(tmpdir(), 'antigravity-workflow-test-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const runtimePath = join(fixture, 'runtime');
  const workerHome = join(fixture, 'worker-home');
  const runnerTemp = join(fixture, 'temp');
  const workspace = join(fixture, 'workspace');
  for (const path of [runtimePath, workerHome, runnerTemp, workspace, join(runtimePath, '.github/antigravity')]) mkdirSync(path, { recursive: true });
  const source = join(runtimePath, '.github/antigravity/review.cljs');
  writeFileSync(source, '; fixture trusted runtime\n');
  const nbb = join(fixture, 'nbb');
  writeFileSync(nbb, '#!/bin/sh\nexit 0\n', { mode: 0o700 });
  const cli = join(fixture, 'agy');
  writeFileSync(cli, '#!/bin/sh\nexit 0\n', { mode: 0o700 });
  const bwrap = join(fixture, 'bwrap');
  const bwrapSource = '#!/bin/sh\nprintf "bubblewrap 0.9.0\\n"\n';
  writeFileSync(bwrap, bwrapSource, { mode: 0o700 });
  const environment = { PATH: process.env.PATH, HOME: workerHome,
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    ANTIGRAVITY_REVIEW_RUNTIME: runtimePath, ANTIGRAVITY_REVIEW_WORKER_HOME: workerHome,
    ANTIGRAVITY_REVIEW_CLI: cli, ANTIGRAVITY_REVIEW_CLI_SHA256: createHash('sha256').update(readFileSync(cli)).digest('hex'),
    ANTIGRAVITY_REVIEW_BWRAP: bwrap, ANTIGRAVITY_REVIEW_BWRAP_SHA256: createHash('sha256').update(readFileSync(bwrap)).digest('hex'),
    ANTIGRAVITY_REVIEW_NBB: nbb, RUNNER_TEMP: runnerTemp, GITHUB_WORKSPACE: workspace,
    GITHUB_OUTPUT: join(fixture, 'outputs'), GITHUB_ENV: join(fixture, 'environment') };
  const git = args => {
    const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: runtimePath, env: environment, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git(['init', '--quiet']);
  git(['add', '.']);
  git(['-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Fixture runtime']);
  environment.REVIEW_RUNTIME_REVISION = git(['rev-parse', 'HEAD']);
  const script = literal(step('Verify preinstalled trusted runtime and allocate isolated paths'), 'run');
  const prepare = overrides => spawnSync('bash', ['-c', script], { env: { ...environment, ...overrides }, encoding: 'utf8' });
  const allowed = prepare({});
  assert.equal(allowed.status, 0, allowed.stderr);
  assert.match(readFileSync(environment.GITHUB_OUTPUT, 'utf8'), /empty-pattern=\/\.antigravity-empty-antigravity-review\./);
  assert.notEqual(prepare({ REVIEW_RUNTIME_REVISION: 'd'.repeat(40) }).status, 0);
  appendFileSync(source, '; tampered\n');
  assert.notEqual(prepare({}).status, 0, 'tracked runtime edits must refuse');
  writeFileSync(source, '; fixture trusted runtime\n');
  const untracked = join(runtimePath, '.github/antigravity/injected.cljs');
  writeFileSync(untracked, '; untracked source\n');
  assert.notEqual(prepare({}).status, 0, 'untracked runtime source must refuse');
  rmSync(untracked);
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_NBB: 'nbb' }).status, 0);
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_CLI: 'agy' }).status, 0);
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_CLI_SHA256: 'sha256:wrong' }).status, 0);
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_CLI_SHA256: '0'.repeat(64) }).status, 0);
  appendFileSync(cli, '# changed CLI\n');
  assert.notEqual(prepare({}).status, 0, 'updated CLI bytes require operator requalification');
  writeFileSync(cli, '#!/bin/sh\nexit 0\n', { mode: 0o700 });
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_BWRAP: 'bwrap' }).status, 0);
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_BWRAP_SHA256: '0'.repeat(64) }).status, 0);
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_BWRAP_SHA256: 'sha256:wrong' }).status, 0);
  writeFileSync(bwrap, '#!/bin/sh\nprintf "bubblewrap 0.8.0\\n"\n', { mode: 0o700 });
  assert.notEqual(prepare({ ANTIGRAVITY_REVIEW_BWRAP_SHA256: createHash('sha256').update(readFileSync(bwrap)).digest('hex') }).status, 0,
    'unsupported bubblewrap version must refuse even when its checksum matches');
  writeFileSync(bwrap, bwrapSource, { mode: 0o700 });
  assert.equal(prepare({}).status, 0);
});

test('actual always cleanup removes only the generated job root and exact checkout residual', t => {
  const fixture = mkdtempSync(join(tmpdir(), 'antigravity-cleanup-test-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const runnerTemp = join(fixture, 'temp');
  const workspace = join(fixture, 'workspace');
  const outside = join(fixture, 'outside');
  for (const path of [runnerTemp, workspace, outside]) mkdirSync(path);
  const sentinel = join(outside, 'preserved');
  writeFileSync(sentinel, 'unrelated');
  const root = join(runnerTemp, 'antigravity-review.Ab12Cd34');
  const residual = join(workspace, '.antigravity-objects-antigravity-review.Ab12Cd34');
  mkdirSync(root);
  mkdirSync(residual);
  symlinkSync(outside, join(root, 'untrusted-link'));
  const cleanup = step("Remove only this job's isolated review files");
  assert.match(cleanup, /if:.*always\(\)/);
  assert.ok(workflow.indexOf('Upload review evidence including failure diagnostics') < workflow.indexOf("Remove only this job's isolated review files"));
  const script = literal(cleanup, 'run');
  const remove = path => spawnSync('bash', ['-c', script], { encoding: 'utf8', env: {
    PATH: process.env.PATH, RUNNER_TEMP: runnerTemp, GITHUB_WORKSPACE: workspace, REVIEW_EVIDENCE_ROOT: path,
  } });
  for (const path of [runnerTemp, `${runnerTemp}/../outside`, outside, 'antigravity-review.Ab12Cd34', `${runnerTemp}/nested/../antigravity-review.Ab12Cd34`, `${runnerTemp}/antigravity-review.Ab12Cd34/`, `${runnerTemp}/antigravity-review.*`]) {
    assert.notEqual(remove(path).status, 0, `must reject cleanup root ${path}`);
    assert.ok(existsSync(root));
    assert.ok(existsSync(residual));
    assert.ok(existsSync(sentinel));
  }
  assert.equal(remove(root).status, 0);
  assert.ok(!existsSync(root));
  assert.ok(!existsSync(residual));
  assert.ok(existsSync(sentinel), 'child symlinks must not cause traversal');
  symlinkSync(outside, root);
  assert.notEqual(remove(root).status, 0, 'root symlink must refuse');
  assert.ok(existsSync(sentinel));
});

test('candidate checkout is credential-free and only provides sparse git objects', () => {
  const checkout = step('Fetch candidate git objects without candidate execution');
  assert.match(checkout, /persist-credentials: false/);
  assert.match(checkout, /submodules: false/);
  assert.match(checkout, /lfs: false/);
  assert.match(checkout, /sparse-checkout-cone-mode: false/);
  assert.match(checkout, /sparse-checkout:.*steps\.paths\.outputs\.empty-pattern/);
  assert.match(checkout, /fetch-depth: 0/);
  const invoke = literal(step('Run approved trusted review runtime'), 'run');
  assert.match(invoke, /mv -- "\$GITHUB_WORKSPACE\/\$REVIEW_CHECKOUT_PATH" "\$REVIEW_CANDIDATE_PATH"/);
  assert.match(invoke, /cd -- "\$ANTIGRAVITY_REVIEW_RUNTIME"/);
  assert.match(invoke, /"\$ANTIGRAVITY_REVIEW_NBB" -cp "\$ANTIGRAVITY_REVIEW_RUNTIME\/\.github\/antigravity"/);
  for (const arg of ['repo', 'base', 'head', 'output', 'worker-home', 'cli', 'cli-sha256', 'bwrap', 'bwrap-sha256']) assert.match(invoke, new RegExp(`--${arg} "`));
});

test('untrusted expressions enter env/with fields, never shell or JavaScript source', () => {
  const lines = workflow.split('\n');
  for (const key of ['run', 'script']) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== `${key}: |`) continue;
      const indent = lines[i].search(/\S/) + 2;
      const source = [];
      for (const line of lines.slice(i + 1)) {
        if (line.trim() && line.search(/\S/) < indent) break;
        source.push(line);
      }
      assert.doesNotMatch(source.join('\n'), /\$\{\{/);
    }
  }
});

test('errors retain review artifacts and test suite is registered', () => {
  const upload = step('Upload review evidence including failure diagnostics');
  assert.match(upload, /if:.*always\(\)/);
  assert.match(upload, /if-no-files-found: warn/);
  assert.match(upload, /include-hidden-files: false/);
  assert.match(registration, /:label "antigravity-review-workflow"/);
  assert.match(registration, /"\.github\/scripts\/antigravity-code-review-workflow\.test\.mjs"/);
});

test('actual artifact globs retain a pre-init native failure log and complete input before cleanup', t => {
  const root = mkdtempSync(join(tmpdir(), 'antigravity-failure-evidence-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const output = join(root, 'output');
  mkdirSync(output);
  const failureLog = join(output, 'native.stderr.log');
  const completeInput = join(output, 'input.txt');
  writeFileSync(failureLog, 'fixture: CLI exited 1 before init; stdout contained zero bytes\n');
  writeFileSync(completeInput, '{"complete_candidate":"all UTF-8 bytes: Ω; no truncation"}\n');
  writeFileSync(join(output, 'native.stdout.json'), '');
  writeFileSync(join(output, 'process.json'), '{"status":1}\n');
  mkdirSync(join(output, 'workspace'));
  const workspaceFile = join(output, 'workspace', 'input.txt');
  writeFileSync(workspaceFile, 'temporary model workspace');
  const unrelatedLog = join(output, 'unrelated.log');
  writeFileSync(unrelatedLog, 'outside the explicitly retained native diagnostics');
  const upload = step('Upload review evidence including failure diagnostics');
  const patterns = literal(upload, 'path').trim().split('\n')
    .map(line => line.replaceAll('${{ steps.paths.outputs.evidence-root }}', root));
  const retained = new Set(globSync(patterns));
  assert.ok(retained.has(failureLog), 'the actual native failure diagnostic must survive the artifact selection');
  assert.ok(retained.has(completeInput), 'the complete native input must survive the artifact selection');
  assert.equal(readFileSync(failureLog, 'utf8'), 'fixture: CLI exited 1 before init; stdout contained zero bytes\n');
  assert.equal(readFileSync(completeInput, 'utf8'), '{"complete_candidate":"all UTF-8 bytes: Ω; no truncation"}\n');
  assert.ok(!retained.has(workspaceFile), 'temporary workspace files must not broaden artifact collection');
  assert.ok(!retained.has(unrelatedLog), 'only the explicit native diagnostic log is retained');
  assert.match(upload, /if:.*always\(\)/);
  assert.ok(workflow.indexOf('Upload review evidence including failure diagnostics') < workflow.indexOf("Remove only this job's isolated review files"));
});
