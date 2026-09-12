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
import Fastify from 'fastify';
import { createRequire, syncBuiltinESMExports } from 'node:module';
const [moduleUrl, directory, barrier, role, scenario] = process.argv.slice(1);
const native = createRequire(moduleUrl)('fs-ext-extra-prebuilt');
const handles = new Map();
const open = fs.openSync, flock = native.flockSync, generate = crypto.generateKeyPairSync;
let generated = false, held = false;
const wait = file => {
  const deadline = Date.now() + 15000;
  while (!fs.existsSync(file)) {
    if (Date.now() >= deadline) throw Error('ATProto startup barrier timeout');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  }
};
fs.openSync = (...args) => { const fd = open(...args); handles.set(fd, args[0]); return fd; };
crypto.generateKeyPairSync = (...args) => {
  if (!generated) {
    fs.writeFileSync(barrier + '/ready-' + role, 'read-missing-key');
    wait(barrier + '/release-' + role);
    generated = true;
  }
  return generate(...args);
};
native.flockSync = (fd, mode, ...args) => {
  let result;
  try { result = flock(fd, mode, ...args); }
  catch (error) {
    if (role === 'b' && handles.get(fd) === directory + '/identity-operation.lock'
        && ['EAGAIN', 'EWOULDBLOCK', 'EACCES'].includes(error.code)) {
      fs.writeFileSync(barrier + '/contended', 'actual-native-contention');
    }
    throw error;
  }
  if (scenario === 'contention' && role === 'a' && generated && !held
      && handles.get(fd) === directory + '/identity-operation.lock' && mode === 'exnb') {
    held = true;
    fs.writeFileSync(barrier + '/operation-held', 'locked');
    wait(barrier + '/commit');
  }
  return result;
};
syncBuiltinESMExports();
const { createProvider, registerIdentityRoutes } = await import(moduleUrl);
const service = createProvider({ provider: 'edn', directory, 'public-base-url': 'https://identity.example.test',
  providers: { atproto: { 'client-id': 'https://identity.example.test/api/auth/atproto/client-metadata.json' } } });
const app = Fastify({ logger: false });
try {
  await registerIdentityRoutes(app, service);
  const origin = await app.listen({ host: '127.0.0.1', port: 0 });
  const jwks = await fetch(origin + '/api/auth/atproto/jwks.json');
  const metadata = await fetch(origin + '/api/auth/atproto/client-metadata.json');
  const publicKeys = await jwks.json();
  console.log(JSON.stringify({ jwksStatus: jwks.status, metadataStatus: metadata.status,
    publicKeyDigest: crypto.createHash('sha256').update(JSON.stringify(publicKeys)).digest('hex'),
    keyCount: publicKeys.keys.length }));
await new Promise(resolve => setTimeout(resolve, 20));
process.stderr.write('startup fixture diagnostic\\n');
} finally { await app.close(); }
`;

async function until(predicate, description) {
  const deadline = Date.now() + 15000;
  while (!predicate()) {
    assert(Date.now() < deadline, description);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function start(moduleUrl, directory, barrier, role, scenario) {
  const child = spawn(process.execPath, ['--input-type=module', '-e', worker, moduleUrl, directory, barrier, role, scenario]);
  let output = '', stdout = '';
  child.stdout.on('data', value => { output += value; stdout += value; });
  child.stderr.on('data', value => { output += value; });
  const finished = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', code => resolve({ code, output, stdout }));
  });
  return { child, finished };
}

for (const scenario of ['winner-committed', 'contention']) {
  test(`ATProto route startup reuses one durable key after ${scenario}`, { timeout: 45000 }, async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'axxium-atproto-startup-'));
    const directory = path.join(root, 'identity');
    const moduleUrl = process.env.AXXIUM_TEST_MODULE_URL ?? pathToFileURL(path.resolve('dist-lib/index.js')).href;
    const children = [];
    const release = name => fs.writeFileSync(path.join(root, name), 'release');
    try {
      children.push(start(moduleUrl, directory, root, 'a', scenario));
      await until(() => fs.existsSync(path.join(root, 'ready-a')), 'first route startup reads missing client key');
      children.push(start(moduleUrl, directory, root, 'b', scenario));
      await until(() => fs.existsSync(path.join(root, 'ready-b')), 'second route startup also reads missing client key');
      release('release-a');
      if (scenario === 'contention') {
        await until(() => fs.existsSync(path.join(root, 'operation-held')), 'first startup holds the real operation lock');
        release('release-b');
        await until(() => fs.existsSync(path.join(root, 'contended')), 'second startup actually contends on the native lock');
        release('commit');
      } else {
        const first = await children[0].finished;
        assert.equal(first.code, 0, first.output);
        release('release-b');
      }
      const results = await Promise.all(children.map(child => child.finished));
      for (const result of results) assert.equal(result.code, 0, result.output);
      const proofs = results.map(result => JSON.parse(result.stdout.trim().split('\n').at(-1)));
      for (const proof of proofs) {
        assert.equal(proof.jwksStatus, 200);
        assert.equal(proof.metadataStatus, 200);
        assert.equal(proof.keyCount, 1);
      }
      assert.equal(proofs[0].publicKeyDigest, proofs[1].publicKeyDigest);
      const privateBlobs = fs.readdirSync(path.join(directory, 'private')).filter(name => /^[0-9a-f]{64}$/.test(name));
      assert.equal(privateBlobs.length, 1, 'Only the admitted private client key remains after both startups exit');
      assert.equal((fs.readFileSync(path.join(directory, 'identity.edn'), 'utf8').match(/:operation :oauth-client-key-created/g) ?? []).length, 1);
    } finally {
      for (const file of ['release-a', 'release-b', 'commit']) release(file);
      for (const { child } of children) if (child.exitCode === null) child.kill();
      await Promise.allSettled(children.map(child => child.finished));
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}
