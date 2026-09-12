import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

test('logical children reject null before querying empty or populated projections', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-logical-child-'));
  try {
    const services = createEdnServices(directory);
    for (const populated of [false, true]) {
      if (populated) await services['store-document']({ id: 'private', visible: false });
      for (const query of [{ $or: [null] }, { $and: [null] },
        { $and: [{ $or: [{ visible: true }, null] }] }]) {
        await assert.rejects(services['query-documents'](query), /Logical query children must be maps/);
        await assert.rejects(services['query-events'](query), /Logical query children must be maps/);
        let handle;
        try {
          assert.throws(() => { handle = services['watch-events'](query, () => undefined); },
            /Logical query children must be maps/);
        } finally {
          handle?.close();
        }
      }
    }
    assert.deepEqual((await services['query-documents']({ $or: [{}] })).map(row => row.id), ['private']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('range queries retain same-kind matches across heterogeneous stored fields and replay', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-range-types-'));
  try {
    const services = createEdnServices(directory);
    for (const [id, value] of [['number-low', 2], ['number-high', 10], ['string-low', 'a'],
      ['string-high', 'z'], ['boolean', true], ['null', null], ['map', { n: 3 }], ['vector', [3]]]) {
      await services['store-document']({ id, value });
    }
    await services['store-document']({ id: 'missing' });
    for (const opened of [services, createEdnServices(directory)]) {
      for (const [operator, operand, expected] of [
        ['$gt', 2, ['number-high']], ['$gte', 10, ['number-high']],
        ['$lt', 10, ['number-low']], ['$lte', 2, ['number-low']],
        ['$gt', 'a', ['string-high']], ['$gte', 'z', ['string-high']],
        ['$lt', 'z', ['string-low']], ['$lte', 'a', ['string-low']]]) {
        const found = await opened['query-documents']({ value: { [operator]: operand } });
        assert.deepEqual(found.map(row => row.id), expected, `${operator} ${operand}`);
      }
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
