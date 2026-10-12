// SPDX-License-Identifier: GPL-3.0-or-later
// Sensitivity controls only: the real Node builtin objects are used, but every
// query/send fallback is replaced with an inert counter before the target preload.
// An expected predecessor failure therefore cannot send UDP or perform DNS.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const preload = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "assessment-network-deny-preload.cjs",
);
const bootstrapSource = String.raw`
const dns = require("node:dns"), promises = require("node:dns/promises"), dgram = require("node:dgram");
const control = globalThis.etaNetworkDenialControl = {fallbackCalls:[], surfaces:[]};
const queries = (owner) => Object.getOwnPropertyNames(owner).filter(name =>
  (name === "lookup" || name === "lookupService" || name === "reverse" || name.startsWith("resolve"))
  && typeof owner[name] === "function");
const enroll = (owner, prefix, names) => {
  for (const name of names) {
    if (typeof owner[name] !== "function") throw new Error("CONTROL_API_UNAVAILABLE:" + prefix + "." + name);
    const surface = prefix + "." + name;
    owner[name] = function () {control.fallbackCalls.push(surface); return null;};
    control.surfaces.push({owner, name, surface});
  }
};
for (const [owner, prefix] of [[dns,"dns"], [promises,"dns.promises"],
  [dns.Resolver.prototype,"dns.Resolver"], [promises.Resolver.prototype,"dns.promises.Resolver"]]) {
  for (const name of ["resolve", "resolve4", "resolve6", "reverse"])
    if (typeof owner[name] !== "function") throw new Error("CONTROL_DNS_API_UNAVAILABLE:" + prefix + "." + name);
  enroll(owner, prefix, queries(owner));
}
enroll(dgram, "dgram", ["createSocket"]);
enroll(dgram.Socket.prototype, "dgram.Socket", ["bind", "connect", "send", "sendto",
  "addMembership", "dropMembership", "addSourceSpecificMembership", "dropSourceSpecificMembership"]);
`;
const exerciseSource = String.raw`
const control = globalThis.etaNetworkDenialControl;
const mode = process.env.TEST_NETWORK_CONTROL_MODE;
const results = [], identities = [];
const attempt = (owner, name, surface) => {
  try {Reflect.apply(owner[name], owner, []); results.push({surface, denied:false});}
  catch (error) {results.push({surface, denied:error.code === "TEST_NETWORK_FORBIDDEN",
    errorCode:error.code ?? null, actualSurface:error.surface ?? null});}
};
const {createRequire} = await import("node:module");
const require = createRequire(process.env.TEST_PRELOAD_FILE);
if (mode === "esm") {
  // Import BEFORE loading the target, so removing syncBuiltinESMExports is a
  // meaningful adverse. Fallbacks are already inert; no native query can escape.
  const dnsESM = await import("node:dns"), promisesESM = await import("node:dns/promises"), dgramESM = await import("node:dgram");
  require(process.env.TEST_PRELOAD_FILE);
  const dns = require("node:dns"), promises = require("node:dns/promises"), dgram = require("node:dgram");
  identities.push(dnsESM.lookup === dns.lookup, dnsESM.resolve4 === dns.resolve4,
    promisesESM.resolve4 === promises.resolve4, dgramESM.createSocket === dgram.createSocket);
  attempt(dnsESM, "lookup", "dns.lookup");
  attempt(dnsESM, "resolve4", "dns.resolve4");
  attempt(promisesESM, "resolve4", "dns.promises.resolve4");
  attempt(dgramESM, "createSocket", "dgram.createSocket");
} else if (mode === "queries") {
  for (const {owner, name, surface} of control.surfaces) attempt(owner, name, surface);
  // Empty server configuration is local state only, with no query. The following
  // query calls must still reach the patched prototypes after native rebinding.
  const dns = require("node:dns"), promises = require("node:dns/promises");
  dns.setServers([]);
  attempt(dns, "resolve4", "dns.Resolver.resolve4");
  attempt(promises, "resolve4", "dns.promises.resolve4");
  promises.setServers([]);
  attempt(promises, "resolve4", "dns.promises.Resolver.resolve4");
} else if (mode !== "noop") throw new Error("CONTROL_MODE_REFUSED");
console.log(JSON.stringify({schema:"eta-mu.network-denial-control/v1", mode,
  pid:process.pid, results, identities, fallbackCalls:control.fallbackCalls}));
`;

function control(t, mode) {
  assert.ok(fs.existsSync("/proc/self"), "the actual audit contract requires Linux /proc");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-network-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const bootstrap = path.join(work, "inert-builtins.cjs");
  fs.writeFileSync(bootstrap, bootstrapSource, { mode: 0o600, flag: "wx" });
  const capture = "denial-control-" + mode;
  const args = ["--require", bootstrap];
  if (mode !== "esm") args.push("--require", preload);
  args.push("--input-type=module", "--eval", exerciseSource);
  // No inherited NODE_OPTIONS, GH/App/provider keys or user auth/config home.
  const child = spawnSync(process.execPath, args, {
    cwd: work,
    env: {
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      TEST_NETWORK_CONTROL_MODE: mode,
      TEST_PRELOAD_FILE: preload,
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(child.error, undefined, child.stderr);
  assert.equal(child.signal, null, child.stderr);
  const output = child.stdout.trim().split("\n");
  assert.equal(output.length, 1, child.stdout + child.stderr);
  const result = JSON.parse(output[0]);
  const files = fs.readdirSync(auditDirectory);
  assert.deepEqual(files, [`${child.pid}.json`], child.stdout + child.stderr);
  const auditFile = path.join(auditDirectory, files[0]),
    info = fs.lstatSync(auditFile);
  assert.ok(info.isFile() && !info.isSymbolicLink());
  assert.equal(info.mode & 0o777, 0o600);
  assert.equal(info.uid, process.getuid());
  const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
  // Retain actual adverse records as adverse evidence, never as zero-denial
  // suite admission. The gate invokes these controls outside test-suite!/audit!.
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.network-denial-control-evidence/v1",
      mode,
      childExit: child.status,
      result,
      audit,
    }),
  );
  assert.equal(result.schema, "eta-mu.network-denial-control/v1");
  assert.equal(result.mode, mode);
  assert.equal(result.pid, child.pid);
  assert.equal(audit.schema, "eta-mu.test-network-denial/v1");
  assert.equal(audit.capture, capture);
  assert.equal(audit.pid, child.pid);
  assert.equal(audit.parentPid, process.pid);
  assert.deepEqual(audit.expectedNodeChildren, []);
  assert.ok(
    audit.kernelAncestry.some(
      (row) =>
        row.pid === child.pid && row.parentPid === process.pid && /^[0-9]+$/.test(row.startTicks),
    ),
  );
  assert.deepEqual(
    result.fallbackCalls,
    [],
    "no controlled original query/send dispatch was reached",
  );
  for (const observed of result.results) {
    assert.equal(observed.denied, true, observed.surface);
    assert.equal(observed.errorCode, "TEST_NETWORK_FORBIDDEN", observed.surface);
    assert.equal(observed.actualSurface, observed.surface);
  }
  if (mode === "noop") {
    assert.deepEqual(result.results, []);
    assert.equal(child.status, 0);
    assert.equal(audit.deniedAttempts, 0);
  } else {
    assert.ok(result.results.length > 0);
    assert.equal(child.status, 97, "a caught denial still fails the actual child on exit");
    assert.equal(
      audit.deniedAttempts,
      result.results.length,
      "every attempted API contributes one actual audit denial",
    );
  }
  if (mode === "esm") assert.deepEqual(result.identities, [true, true, true, true]);
}

test("UDP and DNS queries plus resolver rebinding deny before inert fallback dispatch", (t) =>
  control(t, "queries"));
test("already imported ESM UDP and DNS exports receive the same denial boundary", (t) =>
  control(t, "esm"));
test("loading the Node boundary alone records a healthy empty audit", (t) => control(t, "noop"));
