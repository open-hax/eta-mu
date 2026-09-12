import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';

const worker = `
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
const [moduleUrl, directory, barrier, id] = process.argv.slice(1);
const original = fs.openSync;
fs.openSync = function(file, flags, ...rest) {
  if (file === directory + '/services.edn' && flags === 'wx') {
    fs.writeFileSync(barrier + '/ready-' + id, 'ready');
    const deadline = Date.now() + 10000;
    while (!fs.existsSync(barrier + '/release-' + id)) {
      if (Date.now() >= deadline) throw Error('open barrier timed out');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  return original.call(fs, file, flags, ...rest);
};
syncBuiltinESMExports();
const { createEdnServices } = await import(moduleUrl);
const service = createEdnServices(directory);
if (id === 'a') {
  await service['store-document']({ id: 'winner', content: 'original history' });
  fs.writeFileSync(barrier + '/winner-complete', 'complete');
} else {
  const winner = await service['get-document']('winner');
  if (winner?.content !== 'original history') throw Error('winner history was lost');
  await service['store-document']({ id: 'reopened', content: 'second process' });
}
console.log('opened-' + id);
`;

async function until(predicate, description) {
  const deadline = Date.now() + 10000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, description);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function start(moduleUrl, directory, barrier, id) {
  const child = spawn(process.execPath, ['--input-type=module', '-e', worker, moduleUrl, directory, barrier, id]);
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const finished = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal, output }));
  });
  return { child, finished };
}

test('two actual processes reopen an exclusive-create winner without losing its history', { timeout: 20000 }, async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clio-concurrent-open-'));
  const directory = path.join(root, 'services');
  const moduleUrl = pathToFileURL(path.resolve('dist/main.js')).href;
  const children = [];
  try {
    for (const id of ['a', 'b']) children.push(start(moduleUrl, directory, root, id));
    await until(() => ['a', 'b'].every(id => fs.existsSync(path.join(root, `ready-${id}`))),
      'both processes must reach the real exclusive create after their absent-ledger checks');
    fs.writeFileSync(path.join(root, 'release-a'), 'release');
    await until(() => fs.existsSync(path.join(root, 'winner-complete')), 'the winner must durably append before the loser resumes');
    fs.writeFileSync(path.join(root, 'release-b'), 'release');
    const results = await Promise.all(children.map(child => child.finished));
    for (const result of results) assert.equal(result.code, 0, result.output);
    const { createEdnServices } = await import(moduleUrl);
    const replayed = createEdnServices(directory);
    assert.equal((await replayed['get-document']('winner')).content, 'original history');
    assert.equal((await replayed['get-document']('reopened')).content, 'second process');
  } finally {
    for (const { child } of children) if (child.exitCode === null) child.kill();
    await Promise.allSettled(children.map(child => child.finished));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
