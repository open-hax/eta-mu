// SPDX-License-Identifier: GPL-3.0-or-later
// Execute the real package workflow Bash gates; compiler exit zero alone is insufficient.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const requireFromEtaMu = createRequire(path.join(root, 'packages/eta-mu/package.json'));
const YAML = requireFromEtaMu('yaml');
const regressionPath = '.github/scripts/package-warning-gates.test.mjs';
const warningLogs = [
  'WARNING: namespace diagnostic',
  'warning: namespace diagnostic',
  '[WARNING] dependency problem',
  '[warning] dependency problem',
  '[Warning] dependency problem',
  'Warning namespace diagnostic',
  '[:test] Build completed. (12 files, 1 compiled, 1 warning, 0.1s)',
  '[:test] Build completed. (12 files, 1 compiled, 2 warnings, 0.1s)',
  '[:test] Build completed. (12 files, 1 compiled, 12 WARNINGS, 0.1s)',
  'linting took 10ms, errors: 0, warnings: 2',
];

for (const [slug, label] of [['sol', 'Sol'], ['axxium', 'Axxium']]) {
  const workflow = YAML.parse(fs.readFileSync(path.join(root, `.github/workflows/${slug}-ci.yml`), 'utf8'));
  for (const name of [`Test ${label}`, `Build ${label} server`]) {
    test(`${name} rejects warning logs even when the compiler exits zero`, t => {
      const step = workflow.jobs.verify.steps.find(candidate => candidate.name === name);
      assert.ok(step, `Missing workflow step: ${name}`);
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'eta-package-warning-gate-'));
      t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
      const bin = path.join(directory, 'bin');
      fs.mkdirSync(bin);
      fs.writeFileSync(path.join(bin, 'pnpm'), '#!/bin/sh\nprintf "%s\\n" "Ran 1 tests containing 1 assertions." "0 failures, 0 errors." "$ETA_WARNING_FIXTURE"\nexit "$ETA_COMPILER_EXIT"\n', { mode: 0o755 });
      const run = (log, exit = 0) => spawnSync('bash', ['--noprofile', '--norc', '-eo', 'pipefail', '-c', step.run], {
        cwd: directory, encoding: 'utf8', timeout: 5000,
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, ETA_WARNING_FIXTURE: log, ETA_COMPILER_EXIT: String(exit) },
      });
      for (const log of ['[:test] Build completed. (12 files, 1 compiled, 0 warnings, 0.1s)',
        'linting took 10ms, errors: 0, warnings: 0']) {
        const result = run(log);
        assert.equal(result.status, 0, `Zero-warning log was refused: ${result.stderr || result.stdout}`);
      }
      for (const log of warningLogs) {
        const result = run(log);
        assert.equal(result.status, 1, `Warning escaped ${name}: ${log}\n${result.stderr || result.stdout}`);
      }
      assert.equal(run('0 warnings', 23).status, 23, 'The tee pipeline must preserve compiler failure.');
    });
  }
  test(`${label} CI runs this regression whenever its script changes`, () => {
    for (const trigger of ['pull_request', 'push']) assert.ok(workflow.on[trigger].paths.includes(regressionPath));
    assert.ok(workflow.jobs.verify.steps.some(step => step.run === `node --test ${regressionPath}`));
  });
}
