/**
 * Root PM2 ecosystem aggregator.
 *
 * Discovers and requires every `ecosystem.config.cjs` found directly under
 * `packages/`, then merges their `apps` arrays. Start the whole workspace
 * dev stack with:
 *
 *   pm2 start ecosystem.config.cjs
 *
 * Or start a single package ecosystem directly from its directory.
 */

const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');

const packageEcosystems = fs
  .readdirSync(packagesDir)
  .map((name) => path.join(packagesDir, name, 'ecosystem.config.cjs'))
  .filter((file) => fs.existsSync(file));

const apps = packageEcosystems.flatMap((file) => {
  const cfg = require(file);
  return cfg && Array.isArray(cfg.apps) ? cfg.apps : [];
});

module.exports = {
  apps,
};
