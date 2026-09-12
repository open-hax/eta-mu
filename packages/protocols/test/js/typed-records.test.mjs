import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

test('actual typed consumer narrows generic records and observes nullable updates', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-typed-records-'));
  try {
    const require = createRequire(import.meta.url);
    execFileSync(process.execPath, [require.resolve('typescript/lib/tsc.js'), '--strict', '--target', 'es2022',
      '--module', 'nodenext', '--outDir', path.join(directory, 'consumer'), 'test/types/graph-neighbors.mts'], { stdio: 'pipe' });
    const consumer = await import(pathToFileURL(path.join(directory, 'consumer', 'graph-neighbors.mjs')).href);
    await consumer.verifyGenericRecordConsumer(createEdnServices(path.join(directory, 'ledger')));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('typed user timestamp is immutable across public update and replay', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-user-immutable-'));
  try {
    const services = createEdnServices(path.join(directory, 'users'));
    const created = await services['create-user']({ username: 'immutable-time', password: 'fixture' });
    const id = created.payload.userId;
    const before = await services['get-user'](id);
    await assert.rejects(services['update-user'](id, { 'created-at': 42 }), /identity is immutable/);
    assert.equal((await createEdnServices(path.join(directory, 'users'))['get-user'](id))['created-at'], before['created-at']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('public record writes reject non-maps without appending changes', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-record-maps-'));
  try {
    const services = createEdnServices(directory);
    const session = await services['create-session']({});
    const before = fs.readFileSync(path.join(directory, 'services.edn'), 'utf8');
    for (const operation of ['create-session', 'store-document', 'add-node', 'add-edge', 'create-translation', 'create-label']) {
      await assert.rejects(services[operation](null), /must be a map/);
    }
    await assert.rejects(services['update-session'](session.id, null), /must be a map/);
    await assert.rejects(services['batch-translate']([null]), /must be a map/);
    assert.equal(fs.readFileSync(path.join(directory, 'services.edn'), 'utf8'), before);
    const document = await services['store-document']({ id: 'valid', content: 'still accepted' });
    assert.equal(document.content, 'still accepted');
    assert.deepEqual((await services['query-documents']({})).map(row => row.id), ['valid']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('neighbor queries refuse malformed projected identities without discarding stored edges', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-neighbor-contract-'));
  try {
    const services = createEdnServices(directory);
    await services['add-node']({ id: 'origin' });
    const malformed = await services['add-edge']({ id: 'bad-edge', source: 'origin', target: 42 });
    assert.equal(malformed.target, 42, 'generic storage preserves the supplied application field');
    await assert.rejects(services['query-neighbors']('origin'), /Neighbor identities must be strings/);
    await assert.rejects(createEdnServices(directory)['query-neighbors']('origin'), /Neighbor identities must be strings/);
    assert.deepEqual(await services['query-neighbors']('unrelated'), []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
