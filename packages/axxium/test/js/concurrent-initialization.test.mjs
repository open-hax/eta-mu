import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';

const worker = `
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire, syncBuiltinESMExports } from 'node:module';
const native = createRequire(import.meta.url)('fs-ext-extra-prebuilt');
const [moduleUrl, directory, barrier, role] = process.argv.slice(1);
const handles = new Map();
const open = fs.openSync, write = fs.writeFileSync, exists = fs.existsSync, flock = native.flockSync;
let ledgerChecks = 0;
const wait = file => {
  const deadline = Date.now() + 15000;
  while (!exists(file)) {
    if (Date.now() >= deadline) throw Error('initialization barrier timeout');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  }
};
fs.openSync = (...args) => {
  const fd = open(...args);
  handles.set(fd, args[0]);
  return fd;
};
fs.writeFileSync = (...args) => {
  const result = write(...args);
  if (role === 'a' && handles.get(args[0]) === directory + '/private/master-key') {
    write(barrier + '/key-visible', 'ready');
    wait(barrier + '/release');
  }
  return result;
};
fs.existsSync = file => {
  const result = exists(file);
  if (role === 'b' && file === directory + '/identity.edn' && ++ledgerChecks === 2 && !result) {
    // The old opener has already observed private state and a missing ledger.
    write(barrier + '/reader-boundary', 'missing-history-decision');
  }
  return result;
};
native.flockSync = (fd, ...args) => {
  if (role === 'b' && handles.get(fd) === directory + '/identity-initialization.lock') {
    write(barrier + '/reader-boundary', 'initialization-lock');
  }
  return flock(fd, ...args);
};
syncBuiltinESMExports();
const { createProvider } = await import(moduleUrl);
createProvider({ provider: 'edn', directory, 'public-base-url': 'http://localhost' });
console.log(JSON.stringify({ key: crypto.createHash('sha256').update(fs.readFileSync(directory + '/private/master-key')).digest('hex') }));
`;

async function until(predicate, description) {
  const deadline = Date.now() + 15000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, description);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function start(moduleUrl, directory, barrier, role) {
  const child = spawn(process.execPath, ['--input-type=module', '-e', worker, moduleUrl, directory, barrier, role]);
  let output = '';
  child.stdout.on('data', value => { output += value; });
  child.stderr.on('data', value => { output += value; });
  const finished = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', code => resolve({ code, output }));
  });
  return { child, finished };
}

test('concurrent first openers do not mistake an in-progress vault for lost history', { timeout: 25000 }, async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'axxium-concurrent-init-'));
  const directory = path.join(root, 'identity');
  const moduleUrl = process.env.AXXIUM_TEST_MODULE_URL ?? pathToFileURL(path.resolve('dist-lib/index.js')).href;
  const children = [];
  try {
    children.push(start(moduleUrl, directory, root, 'a'));
    await until(() => fs.existsSync(path.join(root, 'key-visible')), 'writer reaches visible key before its creation fence');
    children.push(start(moduleUrl, directory, root, 'b'));
    await until(() => fs.existsSync(path.join(root, 'reader-boundary')), 'second opener reaches initialization admission');
    fs.writeFileSync(path.join(root, 'release'), 'release');
    const results = await Promise.all(children.map(child => child.finished));
    for (const result of results) assert.equal(result.code, 0, result.output);
    assert.equal(JSON.parse(results[0].output).key, JSON.parse(results[1].output).key);
  } finally {
    fs.writeFileSync(path.join(root, 'release'), 'release');
    for (const { child } of children) if (child.exitCode === null) child.kill();
    await Promise.allSettled(children.map(child => child.finished));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
