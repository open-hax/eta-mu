import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

test('membership queries find false and null values before and after replay', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-membership-'));
  try {
    const services = createEdnServices(directory);
    for (const record of [{ id: 'false', value: false }, { id: 'true', value: true },
      { id: 'null', value: null }, { id: 'missing' }, { id: 'zero', value: 0 }]) {
      await services['store-document'](record);
    }
    for (const opened of [services, createEdnServices(directory)]) {
      for (const [members, included, excluded] of [
        [[false], ['false'], ['missing', 'null', 'true', 'zero']],
        [[null], ['missing', 'null'], ['false', 'true', 'zero']],
        [[false, null], ['false', 'missing', 'null'], ['true', 'zero']],
        [[true], ['true'], ['false', 'missing', 'null', 'zero']],
        [[], [], ['false', 'missing', 'null', 'true', 'zero']]]) {
        for (const [operator, expected] of [['$in', included], ['$nin', excluded]]) {
          const found = await opened['query-documents']({ value: { [operator]: members } });
          assert.deepEqual(found.map(row => row.id), expected, `${operator} ${JSON.stringify(members)}`);
        }
      }
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('NaN range operands do not match persisted finite values', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-nan-range-'));
  try {
    const services = createEdnServices(directory);
    await services['store-document']({ id: 'finite', value: 1 });
    await services['store-document']({ id: 'vector', value: [1] });
    await services['store-document']({ id: 'nested-vector', value: [[1]] });
    for (const opened of [services, createEdnServices(directory)]) {
      for (const operator of ['$gt', '$gte', '$lt', '$lte']) {
        for (const operand of [NaN, [NaN], [[NaN]]]) {
          assert.deepEqual(await opened['query-documents']({ value: { [operator]: operand } }), [], operator);
        }
      }
      assert.deepEqual((await opened['query-documents']({ value: { $gte: 1 } })).map(row => row.id), ['finite']);
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

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
