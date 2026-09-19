import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp, rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {finishWorkers} from '../../scripts/clio-wire-workers.mjs';

test('timed-out worker cleanup waits for inherited pipes to close before deleting its fixture', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'sol-worker-close-'));
  const descendant = `
    const {existsSync} = require('node:fs');
    process.stdout.write('ready\\n');
    setTimeout(() => console.log(existsSync(process.argv[1]) ? 'present' : 'missing'), 150);
    setTimeout(() => {}, 300);
  `;
  const child = spawn(process.execPath, ['-e', `
    require('node:child_process').spawn(process.execPath, ['-e', ${JSON.stringify(descendant)}, process.argv[1]], {stdio: ['ignore', 1, 2]});
    setInterval(() => {}, 1000);
  `, directory]);
  const closed = new Promise(resolve => child.once('close', resolve));
  let output = '';
  const ready = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', () => reject(new Error('worker closed before announcing readiness')));
    child.stdout.on('data', chunk => {
      output += chunk;
      if (output.includes('ready\n')) resolve();
    });
  });
  const timer = setTimeout(() => child.kill('SIGKILL'), 3000);
  try {
    await ready;
    const done = Promise.reject(new Error('simulated timeout before process close'));
    await Promise.allSettled([done]);
    await finishWorkers([{child, done, closed}], directory);
    await closed;
    assert.match(output, /\npresent\n/, 'the still-open worker pipes must retain the fixture');
    assert.equal(existsSync(directory), false, 'the fixture is removed after all workers close');
  } finally {
    clearTimeout(timer);
    if (child.exitCode === null) child.kill('SIGKILL');
    await closed;
    await rm(directory, {recursive: true, force: true});
  }
});
