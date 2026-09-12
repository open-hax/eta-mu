import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createEdnServices } from '../../dist/main.js';

const writerSource = `
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
const [moduleUrl, directory, barrier] = process.argv.slice(1);
const ledger = directory + '/services.edn';
const originalOpen = fs.openSync;
const originalAppend = fs.appendFileSync;
const handles = new Map();
let interrupted = false;
fs.openSync = (...args) => {
  const fd = originalOpen(...args);
  handles.set(fd, args[0]);
  return fd;
};
fs.appendFileSync = (fd, text, ...options) => {
  if (handles.get(fd) !== ledger || interrupted) return originalAppend(fd, text, ...options);
  interrupted = true;
  const cut = Math.floor(text.length / 2);
  originalAppend(fd, text.slice(0, cut), ...options);
  fs.writeFileSync(barrier + '/partial', 'writer still holds the actual Clio inode lock');
  const deadline = Date.now() + 10000;
  while (!fs.existsSync(barrier + '/reader-attempting')) {
    if (Date.now() > deadline) throw Error('reader never attempted its snapshot');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  }
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
  originalAppend(fd, text.slice(cut), ...options);
};
syncBuiltinESMExports();
const { createEdnServices } = await import(moduleUrl);
const service = createEdnServices(directory);
await service['store-document']({ id: 'concurrent', content: 'complete writer value' });
if (!interrupted) throw Error('writer did not exercise the actual append boundary');
console.log('writer completed and released its lock');
`;

async function until(predicate, message) {
  const deadline = Date.now() + 10000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, message);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function startWriter(directory, barrier) {
  const moduleUrl = new URL('../../dist/main.js', import.meta.url).href;
  const child = spawn(process.execPath,
    ['--input-type=module', '-e', writerSource, moduleUrl, directory, barrier]);
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const closed = new Promise(resolve => child.once('close', (code, signal) => resolve({ code, signal, output })));
  const started = new Promise((resolve, reject) => {
    child.once('spawn', resolve);
    child.once('error', reject);
  });
  return { child, closed, started };
}

function markReaderBoundary(file, marker) {
  const originalOpen = fs.openSync;
  const originalRead = fs.readFileSync;
  const mark = target => {
    if (target === file) fs.writeFileSync(marker, 'reader reached the ledger boundary');
  };
  fs.openSync = (...args) => { mark(args[0]); return originalOpen(...args); };
  fs.readFileSync = (...args) => { mark(args[0]); return originalRead(...args); };
  syncBuiltinESMExports();
  return () => {
    fs.openSync = originalOpen;
    fs.readFileSync = originalRead;
    syncBuiltinESMExports();
  };
}

for (const action of ['query', 'open']) {
  test(`public ${action} waits for a second process to finish its locked EDN append`,
    { timeout: 20000 }, async () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'services-locked-read-'));
      const directory = path.join(root, 'services');
      let worker;
      let restoreReader;
      try {
        const service = createEdnServices(directory);
        await service['store-document']({ id: 'before', content: 'existing history' });
        worker = startWriter(directory, root);
        await worker.started;
        await until(() => fs.existsSync(path.join(root, 'partial')), 'writer must expose a partial append while locked');
        restoreReader = markReaderBoundary(path.join(directory, 'services.edn'), path.join(root, 'reader-attempting'));
        const reading = action === 'open' ? createEdnServices(directory) : service;
        assert.equal((await reading['get-document']('concurrent')).content, 'complete writer value');
        assert.equal((await reading['get-document']('before')).content, 'existing history');
        const result = await worker.closed;
        assert.equal(result.code, 0, result.output);
      } finally {
        restoreReader?.();
        if (worker) {
          if (worker.child.exitCode === null) worker.child.kill();
          await worker.closed;
        }
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
}
