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

for (const failedPhase of ['inode', 'parent']) {
  test(`reopening a ledger left by failed creation at ${failedPhase} retries both fences`, () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-create-retry-'));
    const file = path.join(directory, 'services.edn');
    const originalOpen = fs.openSync;
    const originalSync = fs.fsyncSync;
    const handles = new Map();
    const trace = [];
    let phase = 'create';
    let inodeSeen = false;
    fs.openSync = (...args) => {
      const fd = originalOpen(...args);
      handles.set(fd, args[0]);
      return fd;
    };
    fs.fsyncSync = fd => {
      const target = handles.get(fd);
      trace.push(target);
      if (target === file) inodeSeen = true;
      if ((phase === 'create' && inodeSeen && target === (failedPhase === 'inode' ? file : directory))
          || (phase === 'reopen' && target === file)) {
        throw new Error('Injected creation or reopen force refusal');
      }
      return originalSync(fd);
    };
    syncBuiltinESMExports();
    try {
      assert.throws(() => createEdnServices(directory), /synchronization failed/);
      assert.equal(fs.existsSync(file), true, 'the failed creation leaves its visible inode');
      phase = 'reopen';
      assert.throws(() => createEdnServices(directory), /Injected creation or reopen force refusal/);
      phase = 'recover';
      trace.length = 0;
      createEdnServices(directory);
      const inode = trace.lastIndexOf(file);
      assert.ok(inode >= 0, 'the existing ledger inode must be flushed during open');
      assert.equal(trace[inode + 1], directory, 'the inode fence must precede the parent fence');
      assert.equal(fs.readFileSync(file, 'utf8'), '');
    } finally {
      fs.openSync = originalOpen;
      fs.fsyncSync = originalSync;
      syncBuiltinESMExports();
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
}
