import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

for (const [location, invalid] of [
  ['top-level', { 'bad key': true }],
  ['nested', { metadata: { 'bad key': true } }],
]) {
  test(`unreadable ${location} document keys refuse before changing ledger bytes`, async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-invalid-key-'));
    try {
      const service = createEdnServices(directory);
      await service['store-document']({ id: 'prior', content: 'retain this fact' });
      const ledger = path.join(directory, 'services.edn');
      const before = fs.readFileSync(ledger);
      await assert.rejects(service['store-document']({ id: 'invalid', ...invalid }),
        /Identifier does not round trip through persisted EDN/);
      assert.deepEqual(fs.readFileSync(ledger), before, 'refused names cannot poison durable history');

      await service['store-document']({ id: 'valid', metadata: { 'valid-key': true } });
      const reopened = createEdnServices(directory);
      assert.equal((await reopened['get-document']('prior')).content, 'retain this fact');
      assert.deepEqual((await reopened['get-document']('valid')).metadata, { 'valid-key': true });
      assert.equal(await reopened['get-document']('invalid'), null);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
}
