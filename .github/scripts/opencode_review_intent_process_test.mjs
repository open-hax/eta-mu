// SPDX-License-Identifier: GPL-3.0-or-later
// Test-only launcher for two independent fixed Clio worker processes.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const maxInput = 131072;
const maxOutput = 1048576;
const input = await new Promise((resolveInput, reject) => {
  let value = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    value += chunk;
    if (Buffer.byteLength(value) > maxInput) reject(new Error('input-bound'));
  });
  process.stdin.on('end', () => resolveInput(value));
});

function fail(message) {
  process.stdout.write(JSON.stringify({ status: 'refused', reason: message }));
  process.exitCode = 2;
}

try {
  const request = JSON.parse(input);
  const root = resolve(request.root);
  const barrier = resolve(request.barrier);
  if (!barrier.startsWith('/tmp/') || !Array.isArray(request.requests) || request.requests.length !== 2) {
    fail('test-request');
  } else {
    mkdirSync(barrier, { recursive: false });
    const pkg = resolve(root, 'packages/eta-mu');
    const runtime = resolve(pkg, 'intent-runtime');
    const cli = resolve(root, 'node_modules/.pnpm/nbb@1.5.212/node_modules/nbb/cli.js');
    const worker = resolve(runtime, 'barrier_entry.cljs');
    const children = request.requests.map((edn, i) => {
      const workerId = i === 0 ? 'a' : 'b';
      const child = spawn(process.execPath,
        ['--max-old-space-size=128', cli,
         '-cp', '../test/cljs', worker],
        { cwd: runtime, env: { HOME: '/tmp', PATH: '/usr/bin:/bin', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8',
                          NODE_OPTIONS: '', INTENT_TEST_BARRIER: barrier,
                          INTENT_TEST_WORKER_ID: workerId },
          stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
      let stdout = '';
      let stderr = '';
      child.stdout.setEncoding('utf8').on('data', part => { stdout += part; });
      child.stderr.setEncoding('utf8').on('data', part => { stderr += part; });
      child.stdin.end(edn);
      const done = new Promise(resolveDone => {
        const timer = setTimeout(() => child.kill('SIGKILL'), 8000);
        child.on('close', code => {
          clearTimeout(timer);
          resolveDone({ code, stdout, stderr });
        });
      });
      return { child, done, index: i };
    });
    const deadline = Date.now() + 5000;
    while (!(existsSync(resolve(barrier, 'ready-a')) && existsSync(resolve(barrier, 'ready-b')))) {
      if (Date.now() >= deadline) {
        for (const item of children) item.child.kill('SIGKILL');
        const partial = await Promise.all(children.map(item => item.done));
        throw new Error(`barrier-timeout ${JSON.stringify(partial)}`);
      }
      await new Promise(resolveWait => setTimeout(resolveWait, 10));
    }
    writeFileSync(resolve(barrier, 'release'), 'release', { flag: 'wx' });
    const results = await Promise.all(children.map(item => item.done));
    if (results.some(result => Buffer.byteLength(result.stdout) > maxOutput || Buffer.byteLength(result.stderr) > maxOutput)) {
      throw new Error('output-bound');
    }
    const proposals = ['a', 'b'].map(id => readFileSync(resolve(barrier, `ready-${id}`), 'utf8'));
    process.stdout.write(JSON.stringify({ status: 'complete', results, proposals }));
  }
} catch (error) {
  fail(error?.message || 'test-harness');
}
