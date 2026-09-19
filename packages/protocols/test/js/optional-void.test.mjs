import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {createEdnServices} from '../../dist/main.js';

function fixture(prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return {directory, services: createEdnServices(directory)};
}

test('explicit undefined optional arguments behave like omission and preserve null refusal', async () => {
  const {directory, services} = fixture('services-optional-');
  try {
    const session = await services['create-session'](undefined);
    assert.equal(typeof session.id, 'string');
    await services['add-node']({id: 'a'});
    await services['add-node']({id: 'b'});
    await services['add-edge']({source: 'a', target: 'b'});
    assert.deepEqual(await services['query-neighbors']('a', undefined), ['b']);
    assert.deepEqual((await services.traverse('a', undefined)).map(row => row.id), ['a', 'b']);
    assert.deepEqual(await services['query-by-label']('missing', undefined), []);
    await assert.rejects(services['create-session'](null), /must be a map/);
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
});

test('every declared Promise<void> acknowledges durable completion with undefined', async () => {
  const {directory, services} = fixture('services-void-');
  try {
    const session = await services['create-session']();
    await services['store-document']({id: 'document'});
    await services['create-label']({id: 'review'});
    const results = [
      await services['close-session'](session.id),
      await services['archive-document']('document'),
      await services['apply-label']('review', 'document', 'document'),
      await services['emit-to-room']('room', 'changed', {id: 'document'}),
    ];
    assert.deepEqual(results, [undefined, undefined, undefined, undefined]);
    const reopened = createEdnServices(directory);
    assert.equal(await reopened['get-session'](session.id), null);
    assert.equal((await reopened['get-document']('document')).archived, true);
    assert.equal((await reopened['query-by-label']('review')).length, 1);
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
});
