#!/usr/bin/env node
/**
 * Foreground launcher for the Rheos backend dev server.
 *
 * `shadow-cljs watch server-dev` compiles dist-dev/server.js and owns hot
 * reload (the node-esm devtools client embedded in the artifact connects back
 * to the watch HTTP server). This launcher waits until the watch server is up
 * AND a *fresh* runnable artifact exists, then imports it — so it never imports
 * a stale artifact whose embedded hot-reload client points at an old shadow
 * port. PM2 runs it with autorestart; on a cold start it polls instead of
 * crash-looping on a missing/stale file.
 *
 * Env:
 *   RHEOS_SHADOW_PORT          shadow watch :http port (default 9634; MUST match
 *                              the :http :port in shadow-cljs.edn)
 *   RHEOS_SHADOW_HOST          shadow base host (default http://127.0.0.1)
 *   RHEOS_BACKEND_DEV_WAIT_MS  max wait for shadow + artifact (default 120000)
 *   RHEOS_BACKEND_DEV_POLL_MS  poll interval (default 500)
 *   RHEOS_BACKEND_DEV_DRY_RUN  "1" => verify only, do not import
 */
import { stat, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const backendDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const serverEntry = join(backendDir, 'dist-dev', 'server.js');

const shadowPort = Number(process.env.RHEOS_SHADOW_PORT || 9634);
const shadowBase = process.env.RHEOS_SHADOW_HOST || 'http://127.0.0.1';
const shadowUrl = `${shadowBase}:${shadowPort}`;
const waitMs = Number(process.env.RHEOS_BACKEND_DEV_WAIT_MS || 120000);
const pollMs = Number(process.env.RHEOS_BACKEND_DEV_POLL_MS || 500);
const dryRun = process.env.RHEOS_BACKEND_DEV_DRY_RUN === '1';

const startMs = Date.now();
const log = (m) => console.log(`[rheos-backend-dev] ${m}`);
const warn = (m) => console.warn(`[rheos-backend-dev] ${m}`);

// CLJS munges `rheos.backend.infra.http-server` -> `rheos.backend.infra.http_server`,
// so the runnable marker MUST use the munged (underscore) form.
const INIT_MARKER = 'rheos.backend.infra.http_server';
const HOTRELOAD_MARKER = 'shadow.cljs.devtools.client.node_esm';

async function shadowReady() {
  try {
    const res = await fetch(shadowUrl, { signal: AbortSignal.timeout(1000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function readArtifact() {
  try {
    const s = await stat(serverEntry);
    if (!s.isFile()) return null;
    const src = await readFile(serverEntry, 'utf8');
    if (!src.includes(INIT_MARKER) || !src.includes(HOTRELOAD_MARKER)) return null;
    return { mtimeMs: s.mtimeMs };
  } catch {
    return null;
  }
}

log(`waiting for shadow-cljs watch at ${shadowUrl} and a fresh ${serverEntry}`);
const deadline = startMs + waitMs;
let proceed = false;
while (!proceed) {
  if (Date.now() > deadline) {
    const art = await readArtifact();
    if (art) {
      warn('timed out waiting for a fresh artifact; importing the existing one');
      proceed = true;
      break;
    }
    console.error(`[rheos-backend-dev] timed out waiting for runnable ${serverEntry}`);
    process.exit(1);
  }
  const [ready, art] = await Promise.all([shadowReady(), readArtifact()]);
  if (ready && art) {
    const fresh = art.mtimeMs >= startMs - 2000;
    if (fresh) {
      log('shadow is ready and a fresh dist-dev/server.js was produced');
      proceed = true;
    } else if (Date.now() - startMs > 15000) {
      // Backend-only restart: shadow already ran its build before we started.
      warn('using existing dist-dev/server.js (shadow ready, no rebuild needed)');
      proceed = true;
    } else {
      await sleep(pollMs);
    }
  } else {
    await sleep(pollMs);
  }
}

if (dryRun) {
  log('dry run complete; not importing dist-dev/server.js');
} else {
  log(`importing ${serverEntry}`);
  await import(pathToFileURL(serverEntry).href);
}
