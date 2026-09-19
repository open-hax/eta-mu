#!/usr/bin/env node
// Consumer proof: compiled exports, real TCP, encrypted Clio replay, logout.
// The fixture owns and removes its temporary data. No external OAuth account is used.
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import Fastify from 'fastify';
import * as axxium from '../dist-lib/index.js';

const directory = mkdtempSync(join(tmpdir(), 'axxium-consumer-'));
const origin = 'http://localhost:8787';
const options = {provider: 'edn', directory, 'public-base-url': origin,
  providers: {github: {'client-id': 'local-consumer-client', 'client-secret': 'local-consumer-secret'}}};
const app = Fastify();
const password = 'temporary consumer verification password';
try {
  for (const name of ['createProvider', 'registerIdentityRoutes', 'requestToken', 'resolvePrincipal']) {
    assert.equal(typeof axxium[name], 'function', `Missing built API export ${name}`);
  }
  const service = axxium.createProvider(options);
  await axxium.registerIdentityRoutes(app, service);
  const address = await app.listen({host: '127.0.0.1', port: 0});
  const registered = await fetch(`${address}/api/auth/signup`, {
    method: 'POST', headers: {'content-type': 'application/json', origin},
    body: JSON.stringify({username: 'consumer-test', email: 'consumer@example.test', password}),
  });
  assert.equal(registered.status, 200, await registered.clone().text());
  const cookie = registered.headers.get('set-cookie').split(';')[0];
  const token = cookie.slice(cookie.indexOf('=') + 1);
  assert.equal(axxium.resolvePrincipal(service, token)['principal/username'], 'consumer-test');
  const reopened = axxium.createProvider(options);
  assert.equal(axxium.resolvePrincipal(reopened, token)['principal/username'], 'consumer-test');
  assert.ok(!readFileSync(join(directory, 'identity.edn'), 'utf8').includes(password));
  assert.ok(!readFileSync(join(directory, 'identity.edn'), 'utf8').includes(token));
  const current = await fetch(`${address}/api/auth/me`, {headers: {cookie}});
  assert.equal(current.status, 200);
  const forged = await fetch(`${address}/api/auth/me`, {
    headers: {'x-knoxx-user-email': 'consumer@example.test'},
  });
  assert.equal(forged.status, 401);
  const oldLink = await fetch(`${address}/api/auth/providers/github/login?link=true`, {headers: {cookie}});
  assert.equal(oldLink.status, 405);
  const link = await fetch(`${address}/api/auth/providers/github/link`, {
    method: 'POST', headers: {cookie, origin, 'content-type': 'application/json'}, body: '{}',
  });
  assert.equal(link.status, 200, await link.clone().text());
  assert.equal(new URL((await link.json()).authorizationUrl).origin, 'https://github.com');
  const refused = await fetch(`${address}/api/auth/logout`, {
    method: 'POST', headers: {cookie, origin: 'https://attacker.example'},
  });
  assert.equal(refused.status, 403);
  const logout = await fetch(`${address}/api/auth/logout`, {method: 'POST', headers: {cookie, origin}});
  assert.equal(logout.status, 200);
  assert.equal(axxium.resolvePrincipal(reopened, token), null);
  console.log('PASS compiled ESM exports → real TCP signup → private Clio restart → authenticated read');
  console.log('PASS forged identity header and foreign Origin refused → committed logout invalidates reopened session');
  console.log('PASS navigational GET linking refused → authenticated POST returns provider authorization URL');
  console.log('WARN real external OAuth logins need operator provider configuration; this fixture makes no such claim');
} finally {
  await app.close();
  rmSync(directory, {recursive: true, force: true});
}
