// SPDX-License-Identifier: GPL-3.0-or-later
// Test-only actual Clio parent-directory-fsync fault after a real file append.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const input = await new Promise((resolveInput, reject) => {
  let value = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    value += chunk;
    if (Buffer.byteLength(value) > 131072) reject(new Error('input-bound'));
  });
  process.stdin.on('end', () => resolveInput(value));
});

try {
  const request = JSON.parse(input);
  const root = resolve(request.root);
  const pkg = resolve(root, 'packages/eta-mu');
  const runtime = resolve(pkg, 'intent-runtime');
  const cli = resolve(root, 'node_modules/.pnpm/nbb@1.5.212/node_modules/nbb/cli.js');
  const driver = resolve(runtime, 'barrier_entry.cljs');
  const result = spawnSync(process.execPath,
    ['--max-old-space-size=128', cli, '-cp', '../test/cljs', driver],
    { cwd: runtime,
      env: { HOME: '/tmp', PATH: '/usr/bin:/bin', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8',
             NODE_OPTIONS: '',
             INTENT_TEST_FAIL_DIRECTORY_SYNC: request.ledgerDirectory },
      input: request.workerRequest, encoding: 'utf8', timeout: 8000, maxBuffer: 1048576,
      killSignal: 'SIGKILL', windowsHide: true });
  process.stdout.write(JSON.stringify({ status: result.status, error: result.error?.code ?? null,
                                        stdout: result.stdout ?? '', stderr: result.stderr ?? '',
                                        workerInputLength: request.workerRequest?.length ?? null,
                                        workerInputStart: request.workerRequest?.slice(0, 160) ?? null }));
} catch (error) {
  process.stdout.write(JSON.stringify({ status: null, error: error?.message ?? 'test-harness',
                                        stdout: '', stderr: '' }));
  process.exitCode = 2;
}
