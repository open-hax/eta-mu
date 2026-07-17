/**
 * Sol PM2 development ecosystem.
 *
 * Sol is the eta-mu ClojureScript agent runtime backend. This file runs the
 * local dev stack:
 *   1. sol-shadow  — shadow-cljs watch with source maps (compiles :server-dev → dist-dev/)
 *   2. sol-backend — nbb launcher that waits for dist-dev/server.js and imports it
 *
 * Usage:
 *   cd packages/sol
 *   pm2 start ecosystem.config.cjs
 *   pm2 logs sol              # all sol-* logs
 *   pm2 stop sol              # stop all
 *   pm2 delete sol            # remove all
 *
 * Dependencies (must be running separately):
 *   - Proxx  on localhost:8789 (or PROXX_BASE_URL)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

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

function tryGitTopLevel(cwd) {
  try {
    return execSync('git rev-parse --show-toplevel', { cwd, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString('utf8')
      .trim();
  } catch (_err) {
    return null;
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

function existingDirectory(...candidates) {
  for (const candidate of candidates.flat().filter(Boolean)) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }
  return '';
}

function requireDirectory(label, value) {
  const resolved = configuredPath(value);
  if (resolved && fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    return resolved;
  }
  throw new Error(`${label} does not exist or is not a directory: ${value}`);
}

const defaultHostEnvPath = path.join(os.homedir(), '.sol', '.env');
const serviceEnvPath = firstNonBlank(
  process.env.SOL_SERVICE_ENV_PATH,
  path.join(backendDir, '.env'),
);
const userEnvPath = firstNonBlank(process.env.SOL_HOST_ENV_PATH, defaultHostEnvPath);
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

const backendGitRoot = tryGitTopLevel(backendDir);
const workspaceRoot = requireDirectory(
  'workspace root',
  envValue('SOL_WORKSPACE_ROOT', envValue('WORKSPACE_ROOT', envValue('WORKSPACE_PATH', backendGitRoot || backendDir))),
);
const workspaceProjectName = envValue(
  'WORKSPACE_PROJECT_NAME',
  envValue('SOL_WORKSPACE_PROJECT', path.basename(workspaceRoot) || 'workspace'),
);

const baseSolEnv = {
  NODE_ENV: 'development',
  SOL_SOURCE_ROOT: backendDir,
  SOL_PM2_ECOSYSTEM_ROOT: backendDir,
  SOL_WORKSPACE_ROOT: workspaceRoot,
  WORKSPACE_ROOT: workspaceRoot,
  WORKSPACE_PATH: workspaceRoot,
  WORKSPACE_PROJECT_NAME: workspaceProjectName,
};

const apps = [
  // ── 1. shadow-cljs watch ──────────────────────────────────────────
  {
    name: 'sol-shadow',
    cwd: backendDir,
    script: 'pnpm',
    args: 'exec shadow-cljs --source-maps watch server-dev',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
    env: {
      ...baseSolEnv,
    },
  },

  // ── 2. Backend (nbb launcher → compiled CLJS) ─────────────────────
  {
    name: 'sol-backend',
    cwd: backendDir,
    script: 'scripts/start-server-dev.cljs',
    interpreter: 'nbb',
    kill_timeout: 45000,
    listen_timeout: 240000,
    wait_ready: true,
    shutdown_with_message: true,
    min_uptime: '120s',
    watch: false,
    autorestart: true,
    max_restarts: 5,
    restart_delay: 30000,
    exp_backoff_restart_delay: 5000,
    env: {
      ...baseSolEnv,
      NODE_ENV: 'development',
      // Sol owns 8001. The server reads SOL_HOST/SOL_PORT first, so set those
      // (not HOST/PORT) — they have no ambient collision and survive
      // `pm2 restart --update-env`, which would otherwise overlay a leaked
      // ambient PORT=8000 (knoxx's port) and cause EADDRINUSE.
      SOL_HOST: envValue('SOL_HOST', '0.0.0.0'),
      SOL_PORT: envValue('SOL_PORT', '8001'),
      WORKSPACE_ROOT: workspaceRoot,
      WORKSPACE_PROJECT_NAME: workspaceProjectName,
      CONTRACTS_DIR: envValue('CONTRACTS_DIR', path.join(backendDir, 'contracts')),
      KNOXX_AGENT_DIR: envValue('KNOXX_AGENT_DIR', '/tmp/sol-agent'),

      // Canonical Proxx (on host via compose port-forward)
      PROXX_BASE_URL: envValue('PROXX_BASE_URL', 'http://127.0.0.1:8789'),
      PROXX_AUTH_TOKEN: envValue('PROXX_AUTH_TOKEN', envValue('PROXY_AUTH_TOKEN', '')),
      PROXX_DEFAULT_MODEL: envValue('PROXX_DEFAULT_MODEL', 'gemma4:31b'),

      // Sol public base URL behind the Cloudflare tunnel.
      SOL_PUBLIC_BASE_URL: envValue('SOL_PUBLIC_BASE_URL', 'https://sol-stealth.promethean.rest'),
      // Knoxx callback/OAuth reachability through the tunnel.
      KNOXX_BASE_URL: envValue('KNOXX_BASE_URL', 'https://knoxx-stealth.promethean.rest'),
      KNOXX_PROVIDER_BASE_URLS: envValue('KNOXX_PROVIDER_BASE_URLS', ''),
      KNOXX_PROVIDER_AUTH_TOKENS: envValue('KNOXX_PROVIDER_AUTH_TOKENS', ''),
      KNOXX_PROVIDER_AUTH_HEADERS: envValue('KNOXX_PROVIDER_AUTH_HEADERS', ''),
      LLAMACPP_API_KEY: envValue('LLAMACPP_API_KEY', 'no-key'),

      // Session/agent tuning
      KNOXX_SHUTDOWN_GRACE_MS: envValue('KNOXX_SHUTDOWN_GRACE_MS', '25000'),
      KNOXX_SHUTDOWN_POLL_MS: envValue('KNOXX_SHUTDOWN_POLL_MS', '250'),
      KNOXX_AGENT_TURN_TIMEOUT_MS: envValue('KNOXX_AGENT_TURN_TIMEOUT_MS', '0'),
      KNOXX_AGENT_COMPACTION_ENABLED: envValue('KNOXX_AGENT_COMPACTION_ENABLED', 'true'),
    },
  },
];

module.exports = {
  apps,
};
