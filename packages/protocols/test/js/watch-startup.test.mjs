import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

test('subscription startup delivers a write made before the native initial stat, then closes', async () => {
  const { stdout, stderr } = await promisify(execFile)(process.execPath,
    [fileURLToPath(new URL('./watch-startup-child.mjs', import.meta.url))],
    { env: { ...process.env, UV_THREADPOOL_SIZE: '1' }, timeout: 10000, maxBuffer: 1024 * 1024 });
  assert.equal(stderr, '');
  assert.deepEqual(JSON.parse(stdout), { startup: 'during.initial.stat', delivered: 1, closed: true });
});
