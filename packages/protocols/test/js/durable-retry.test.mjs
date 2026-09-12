import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

test('an envelope retry reflashes an uncertain append before returning a durable result', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-durable-retry-'));
  const file = path.join(directory, 'services.edn');
  const services = createEdnServices(directory);
  const envelope = { 'event/id': 'retry-one', 'event/type': 'observation', payload: { text: 'once' } };
  const originalOpen = fs.openSync;
  const originalSync = fs.fsyncSync;
  const handles = new Map();
  let attempts = 0;
  let refuse = true;
  fs.openSync = (...args) => {
    const fd = originalOpen(...args);
    handles.set(fd, args[0]);
    return fd;
  };
  fs.fsyncSync = fd => {
    if (handles.get(fd) === file) {
      attempts += 1;
      if (refuse) throw new Error('Injected durable ledger refusal');
    }
    return originalSync(fd);
  };
  syncBuiltinESMExports();
  try {
    await assert.rejects(services['append-event!'](envelope), /Injected durable ledger refusal/);
    const visible = fs.readFileSync(file, 'utf8');
    assert.equal(visible.trim().split('\n').length, 1);
    await assert.rejects(services['append-event!'](envelope), /Injected durable ledger refusal/);
    assert.equal(attempts, 2, 'the projection-only retry must reflush the locked ledger');
    refuse = false;
    const accepted = await services['append-event!'](envelope);
    assert.equal(accepted['event/id'], envelope['event/id']);
    assert.equal(attempts, 3);
    assert.equal(fs.readFileSync(file, 'utf8'), visible, 'retry adds no duplicate event');
  } finally {
    fs.openSync = originalOpen;
    fs.fsyncSync = originalSync;
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
