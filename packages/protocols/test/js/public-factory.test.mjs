import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

test('public factory rejects absent or blank directory before filesystem effects', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-blank-path-'));
  const previous = process.cwd();
  try {
    process.chdir(directory);
    for (const input of ['', ' \t\n', null, undefined]) {
      assert.throws(() => createEdnServices(input), /requires a non-blank directory/);
      assert.deepEqual(fs.readdirSync(directory), [], 'a rejected path must not initialize the cwd');
    }
  } finally {
    process.chdir(previous);
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('minimum user creation returns a durable server-issued creation timestamp', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-user-time-'));
  try {
    const services = createEdnServices(directory);
    const started = Date.now();
    const accepted = await services['create-user']({ username: 'clock-user', password: 'local-fixture' });
    const user = await services['get-user'](accepted.payload.userId);
    assert.equal(typeof user['created-at'], 'string');
    const created = Date.parse(user['created-at']);
    assert.ok(created >= started && created <= Date.now());
    const replayed = await createEdnServices(directory)['get-user'](accepted.payload.userId);
    assert.equal(replayed['created-at'], user['created-at']);
    assert.equal(replayed.password, undefined);
    assert.equal(replayed.credentials, undefined);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
