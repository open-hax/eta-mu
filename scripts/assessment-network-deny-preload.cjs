// Test-only network boundary. Load before NBB captures native globals.
// SPDX-License-Identifier: GPL-3.0-or-later
const fs = require("node:fs");
const path = require("node:path");
const directory = process.env.ETA_MU_TEST_NETWORK_AUDIT_DIR;
const capture = process.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE;
if (!directory || !capture || !/^[a-zA-Z0-9-]+$/.test(capture)) throw new Error("TEST_AUDIT_BINDING_REQUIRED");
const stat = fs.lstatSync(directory);
if (!stat.isDirectory() || stat.isSymbolicLink() || fs.realpathSync(directory) !== path.resolve(directory)
    || (stat.mode & 511) !== 448 || stat.uid !== process.getuid()) throw new Error("TEST_AUDIT_DIRECTORY_REFUSED");
const audit = {schema:"eta-mu.test-network-denial/v1", deniedAttempts:0, pid:process.pid, parentPid:process.ppid,
  capture, expectedNodeChildren:[]};
// Record PID identities at startup, including non-Node shell intermediaries.
// No arguments, environment or command text are read.
audit.kernelAncestry = [];
let ancestorPid = process.pid;
const seenAncestors = new Set();
for (let depth = 0; ancestorPid !== 0 && depth < 64; depth += 1) {
  if (seenAncestors.has(ancestorPid)) throw new Error("TEST_ANCESTRY_CYCLE");
  seenAncestors.add(ancestorPid);
  const raw = fs.readFileSync(`/proc/${ancestorPid}/stat`, "utf8");
  const close = raw.lastIndexOf(")");
  if (close < 0) throw new Error("TEST_ANCESTRY_STAT_REFUSED");
  const fields = raw.slice(close + 2).trim().split(/\s+/);
  if (!/^[0-9]+$/.test(fields[1]) || !/^[0-9]+$/.test(fields[19])) throw new Error("TEST_ANCESTRY_IDENTITY_REFUSED");
  const parentPid = Number(fields[1]);
  if (!Number.isSafeInteger(parentPid) || parentPid < 0) throw new Error("TEST_ANCESTRY_PARENT_REFUSED");
  audit.kernelAncestry.push({pid:ancestorPid, parentPid, startTicks:fields[19]});
  ancestorPid = parentPid;
}
if (ancestorPid !== 0) throw new Error("TEST_ANCESTRY_INCOMPLETE");
const childProcess = require("node:child_process");
const hasPreload = (options) => (options?.env ?? process.env).NODE_OPTIONS?.includes(__filename);
const originalSync = childProcess.spawnSync;
childProcess.spawnSync = function(command, args, options) {
  const result = originalSync.apply(this, arguments);
  if (path.basename(command) === "node" && hasPreload(options) && Number.isSafeInteger(result.pid)) audit.expectedNodeChildren.push(result.pid);
  return result;
};
const originalSpawn = childProcess.spawn;
childProcess.spawn = function(command, args, options) {
  const child = originalSpawn.apply(this, arguments);
  if (path.basename(command) === "node" && hasPreload(options)) child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
  return child;
};
const deny = (surface) => function () {
  audit.deniedAttempts += 1;
  const error = new Error("TEST_NETWORK_FORBIDDEN");
  error.code = "TEST_NETWORK_FORBIDDEN";
  error.surface = surface;
  throw error;
};
globalThis.fetch = deny("fetch");
if (typeof globalThis.WebSocket === "function") globalThis.WebSocket = deny("WebSocket");
for (const name of ["node:http", "node:https"]) {
  const module = require(name);
  module.request = deny(name + ".request");
  module.get = deny(name + ".get");
  if (module.Agent?.prototype?.createConnection) module.Agent.prototype.createConnection = deny(name + ".Agent.createConnection");
}
const net = require("node:net");
net.connect = deny("net.connect");
net.createConnection = deny("net.createConnection");
net.Socket.prototype.connect = deny("net.Socket.connect");
require("node:tls").connect = deny("tls.connect");
// This is a Node API test boundary, not an OS network sandbox. Native/internal
// handles, alternate runtimes and non-Node descendants are outside this claim.
const dgram = require("node:dgram");
dgram.createSocket = deny("dgram.createSocket");
for (const name of ["bind", "connect", "send", "sendto", "addMembership", "dropMembership",
  "addSourceSpecificMembership", "dropSourceSpecificMembership"]) {
  if (typeof dgram.Socket.prototype[name] === "function") dgram.Socket.prototype[name] = deny("dgram.Socket." + name);
}
const dns = require("node:dns");
const dnsPromises = require("node:dns/promises");
for (const [module, surface] of [[dns, "dns"], [dnsPromises, "dns.promises"],
  [dns.Resolver.prototype, "dns.Resolver"], [dnsPromises.Resolver.prototype, "dns.promises.Resolver"]]) {
  // Cover available query APIs on the approved Node runtime, including newer
  // resolve variants. Config-only methods are retained. Both prototypes matter:
  // either setServers() can rebind exports to their resolver query functions.
  for (const name of Object.getOwnPropertyNames(module)) {
    if ((name === "lookup" || name === "lookupService" || name === "reverse" || name.startsWith("resolve"))
        && typeof module[name] === "function") module[name] = deny(surface + "." + name);
  }
}
require("node:module").syncBuiltinESMExports();
process.on("exit", () => {
  try {
    fs.writeFileSync(path.join(directory, String(process.pid) + ".json"), JSON.stringify(audit) + "\n", {mode:384, flag:"wx"});
  } catch {
    process.stderr.write("TEST_AUDIT_WRITE_REFUSED\n");
    process.exitCode = 97;
  }
  if (audit.deniedAttempts !== 0) process.exitCode = 97;
});
