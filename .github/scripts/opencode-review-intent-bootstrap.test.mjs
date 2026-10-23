// SPDX-License-Identifier: GPL-3.0-or-later
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const cli = resolve(root, 'node_modules/.pnpm/nbb@1.5.212/node_modules/nbb/cli.js');

test('ordinary workflow gates run from a cold NBB package without Babashka', t => {
  const fixture = mkdtempSync(join(tmpdir(), 'eta-intent-bootstrap-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const pkg = join(fixture, 'packages/eta-mu');
  const bin = join(fixture, 'bin');
  mkdirSync(pkg, { recursive: true });
  mkdirSync(bin);
  mkdirSync(join(fixture, '.git'));
  for (const relative of ['contracts/workflows', '.github/workflows', 'packages/eta-mu/commands']) {
    cpSync(join(root, relative), join(fixture, relative), { recursive: true });
  }
  // Copy the actual package config, if any, but never a warmed dependency cache.
  if (existsSync(join(root, 'packages/eta-mu/nbb.edn'))) {
    cpSync(join(root, 'packages/eta-mu/nbb.edn'), join(pkg, 'nbb.edn'));
  }
  symlinkSync(join(root, 'packages/eta-mu/node_modules'), join(pkg, 'node_modules'), 'dir');
  symlinkSync(process.execPath, join(bin, 'node'));
  // The workflow gate suite starts NBB again. Keep that executable pinned too.
  writeFileSync(join(bin, 'nbb'), `#!/bin/sh\nexec node '${cli.replaceAll("'", "'\\''")}' "$@"\n`, { mode: 0o755 });
  const env = { HOME: fixture, PATH: `${bin}:/usr/bin:/bin`, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8', NODE_OPTIONS: '' };
  assert.equal(spawnSync('bb', ['--version'], { env }).error?.code, 'ENOENT', 'fixture must actually exclude bb');
  assert.equal(existsSync(join(pkg, '.nbb')), false, 'fixture starts with no NBB cache');
  const result = spawnSync(process.execPath, [cli, 'commands/workflows_test.cljs'], {
    cwd: pkg, env, encoding: 'utf8', timeout: 60000, maxBuffer: 4194304,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  assert.equal(result.error, undefined, output);
  assert.equal(result.status, 0, output);
  assert.match(output, /Ran \d+ tests containing \d+ assertions\./);
  assert.match(output, /0 failures, 0 errors/);
  assert.doesNotMatch(output, /Downloading dependencies|bb:.*not found/);
  assert.equal(existsSync(join(pkg, '.nbb')), false, 'ordinary gates do not bootstrap Maven dependencies');
});
