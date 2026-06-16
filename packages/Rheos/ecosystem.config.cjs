/**
 * Rheos (kanban-cljs) PM2 development ecosystem.
 *
 * Rheos is the ClojureScript kanban board backend + web UI. This file runs the
 * local dev stack:
 *   1. rheos-shadow  — shadow-cljs watch with source maps (compiles :server-dev
 *                      → dist-dev/ and :app → dist/web/js, hot-reload owner)
 *   2. rheos-backend — launcher that waits for dist-dev/server.js then imports it
 *
 * The board's orchestrator chat is proxied to an agent backend whose API Sol
 * reimplements. KNOXX_BASE_URL therefore points at Sol (127.0.0.1:8001), not
 * knoxx (127.0.0.1:8000).
 *
 * Usage:
 *   cd packages/Rheos
 *   pm2 start ecosystem.config.cjs
 *   pm2 logs rheos             # all rheos-* logs
 *   pm2 stop rheos             # stop all
 *   pm2 delete rheos           # remove all
 *
 * Dependencies (must be running separately):
 *   - Sol agent backend on 127.0.0.1:8001 (see packages/sol/ecosystem.config.cjs)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const backendDir = __dirname;

function loadSimpleEnv(envPath) {
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    return raw.split(/\r?\n/).reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return acc;
      const idx = trimmed.indexOf('=');
      if (idx < 0) return acc;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1);
      if (!key) return acc;
      acc[key] = value;
      return acc;
    }, {});
  } catch (_err) {
    return {};
  }
}

function firstNonBlank(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function configuredPath(value, baseDir = backendDir) {
  if (!value) return '';
  if (value === '~') return os.homedir();
  if (value.startsWith('~/')) return path.join(os.homedir(), value.slice(2));
  if (path.isAbsolute(value)) return value;
  return path.resolve(baseDir, value);
}

const serviceEnvPath = firstNonBlank(
  process.env.RHEOS_SERVICE_ENV_PATH,
  path.join(backendDir, '.env'),
);
const userEnvPath = firstNonBlank(
  process.env.RHEOS_HOST_ENV_PATH,
  path.join(os.homedir(), '.rheos', '.env'),
);
const serviceEnv = loadSimpleEnv(configuredPath(serviceEnvPath));
const userEnv = loadSimpleEnv(configuredPath(userEnvPath));
const hostEnv = new Proxy({ ...serviceEnv, ...userEnv }, {
  get(target, prop) {
    if (typeof prop === 'string' && process.env[prop] !== undefined) {
      return process.env[prop];
    }
    return target[prop];
  },
});

function envValue(key, fallback = '') {
  return firstNonBlank(process.env[key], hostEnv[key], fallback);
}

const baseEnv = {
  NODE_ENV: 'development',
  RHEOS_SOURCE_ROOT: backendDir,
  RHEOS_PM2_ECOSYSTEM_ROOT: backendDir,
};

const backendEnv = {
  ...baseEnv,
  // Rheos owns 8791 via the namespaced KANBAN_PORT (no ambient-PORT leak risk).
  KANBAN_HOST: envValue('KANBAN_HOST', '127.0.0.1'),
  KANBAN_PORT: envValue('KANBAN_PORT', '8791'),

  // Orchestrator chat proxy target. Sol and knoxx expose the same chat API;
  // only the route prefix differs. Default to Sol (8001, /api/agent). To use
  // knoxx instead, set RHEOS_AGENT_BASE_URL=http://127.0.0.1:8000 and
  // RHEOS_AGENT_PREFIX=/api/knoxx. These dedicated vars are used (not the legacy
  // KNOXX_BASE_URL) so an ambient KNOXX_BASE_URL can't silently re-point us.
  RHEOS_AGENT_BASE_URL: envValue('RHEOS_AGENT_BASE_URL', 'http://127.0.0.1:8001'),
  RHEOS_AGENT_PREFIX: envValue('RHEOS_AGENT_PREFIX', '/api/agent'),
  KNOXX_API_KEY: envValue('KNOXX_API_KEY', ''),
  KANBAN_ORCHESTRATOR_AGENT: envValue('KANBAN_ORCHESTRATOR_AGENT', 'kanban_orchestrator'),
  // Model the orchestrator chat runs on (forwarded to Sol). mimo-v2.5-pro is far
  // faster than the gemma4:31b default that left the board chat feeling dead.
  RHEOS_ORCHESTRATOR_MODEL: envValue('RHEOS_ORCHESTRATOR_MODEL', 'mimo-v2.5-pro'),
};

// Optional kanban config path — only forward when explicitly set.
const kanbanConfig = envValue('KANBAN_CONFIG', '../../kanban/openhax.kanban.json');
if (kanbanConfig) backendEnv.KANBAN_CONFIG = kanbanConfig;

const apps = [
  // ── 1. shadow-cljs watch (backend :server-dev + browser :app) ──────
  {
    name: 'rheos-shadow',
    cwd: backendDir,
    script: 'pnpm',
    args: 'exec shadow-cljs --source-maps watch server-dev app',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
    env: { ...baseEnv },
  },

  // ── 2. Backend (waiter → compiled CLJS dev artifact) ───────────────
  {
    name: 'rheos-backend',
    cwd: backendDir,
    script: 'scripts/start-server-dev.mjs',
    interpreter: 'node',
    kill_timeout: 10000,
    min_uptime: '30s',
    watch: false,
    autorestart: true,
    max_restarts: 20,
    restart_delay: 5000,
    exp_backoff_restart_delay: 2000,
    env: { ...backendEnv },
  },
];

module.exports = {
  apps,
};
