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
// Accept the single preload option used by this test gate, or an exact early
// CLI require. Ambiguous options and program arguments cannot prove enrollment.
const hasPreload = (args, options) => {
  const argv = Array.isArray(args) ? args : [];
  const configuration = Array.isArray(args) ? options : args ?? options;
  const nodeOptions = (configuration?.env ?? process.env).NODE_OPTIONS;
  if (["--require " + __filename, "--require " + JSON.stringify(__filename),
    "--require=" + __filename, "--require=" + JSON.stringify(__filename),
    "-r " + __filename, "-r " + JSON.stringify(__filename)].includes(nodeOptions)) return true;
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (option === "--require" || option === "-r") {
      if (argv[++index] === __filename) return true;
    } else if (typeof option === "string" && option.startsWith("--require=")) {
      if (option.slice("--require=".length) === __filename) return true;
    } else if (option === "--import") index += 1;
    else if (!(typeof option === "string" && option.startsWith("--import="))) return false;
  }
  return false;
};
const guardNodeChild = (command, args, options, surface) => {
  const node = typeof command === "string" && (command === process.execPath || path.basename(command) === "node");
  if (node && !hasPreload(args, options)) {
    audit.deniedAttempts += 1;
    const error = new Error("TEST_NODE_CHILD_PRELOAD_REQUIRED");
    error.code = "TEST_NODE_CHILD_PRELOAD_REQUIRED";
    error.surface = surface;
    throw error;
  }
  return node;
};
// A shell-backed direct Node launch returns a shell PID, not a Node PID.
// Refuse that unsupported custody before dispatch, even with actual preload.
const guardNodeShell = (configuration, surface) => {
  if (configuration.shell) {
    audit.deniedAttempts += 1;
    const error = new Error("TEST_NODE_CHILD_SHELL_PID_CUSTODY_UNAVAILABLE");
    error.code = "TEST_NODE_CHILD_SHELL_PID_CUSTODY_UNAVAILABLE";
    error.surface = surface;
    throw error;
  }
};
// Guard and native dispatch consume one captured launch view. This current
// Linux test boundary does not claim arbitrary monkeypatch/native-handle safety.
const directNode = command => typeof command === "string" && (command === process.execPath || path.basename(command) === "node");
const launchArgv = args => {
  if (!Array.isArray(args)) return args;
  const argv = [], length = args.length;
  for (let index = 0; index < length; index += 1) argv.push(`${args[index]}`);
  return argv;
};
const launchEnvironment = configuration => {
  const sourceEnv = configuration.env || {...process.env};
  const environment = Object.create(null), keys = [];
  // Node intentionally includes inherited enumerable env keys, then omits
  // undefined values while constructing actual string environment pairs.
  for (const key in sourceEnv) keys.push(key);
  for (const key of keys) {
    const value = sourceEnv[key];
    if (value !== undefined) environment[key] = `${value}`;
  }
  // Retain Node's Linux coverage propagation and explicit-own omission when
  // turning the effective environment into stable own data properties.
  const ownCoverage = Object.prototype.hasOwnProperty.call(sourceEnv, "NODE_V8_COVERAGE");
  if (process.env.NODE_V8_COVERAGE && !ownCoverage) environment.NODE_V8_COVERAGE = process.env.NODE_V8_COVERAGE;
  else if (ownCoverage && !Object.prototype.hasOwnProperty.call(environment, "NODE_V8_COVERAGE"))
    Object.defineProperty(environment, "NODE_V8_COVERAGE", {value:undefined});
  return {...configuration, env:environment};
};
const spawnLaunchArguments = (args, options) => {
  let argv = args;
  if (Array.isArray(args)) argv = launchArgv(args);
  else if (args == null) argv = [];
  else if (typeof args === "object") {options = args; argv = [];}
  return [argv, launchEnvironment({...options})];
};
const originalSync = childProcess.spawnSync;
childProcess.spawnSync = function(command, args, options) {
  if (!directNode(command)) return originalSync.apply(this, arguments);
  const launch = spawnLaunchArguments(args, options);
  guardNodeChild(command, launch[0], launch[1], "child_process.spawnSync");
  guardNodeShell(launch[1], "child_process.spawnSync");
  const result = originalSync.call(this, command, ...launch);
  if (Number.isSafeInteger(result.pid)) audit.expectedNodeChildren.push(result.pid);
  return result;
};
const originalSpawn = childProcess.spawn;
childProcess.spawn = function(command, args, options) {
  if (!directNode(command)) return originalSpawn.apply(this, arguments);
  const launch = spawnLaunchArguments(args, options);
  guardNodeChild(command, launch[0], launch[1], "child_process.spawn");
  guardNodeShell(launch[1], "child_process.spawn");
  const child = originalSpawn.call(this, command, ...launch);
  child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
  return child;
};
// execFile and fork use Node's lexical launcher, so patched exported spawn
// is not sufficient. Their overload rules differ and remain explicit here.
const execFileLaunchArguments = (args, options, callback) => {
  let argv = [];
  if (Array.isArray(args)) argv = launchArgv(args);
  else if (args != null && typeof args === "object") {callback = options; options = args;}
  else if (typeof args === "function") {callback = args; options = null;}
  else if (args != null) argv = args;
  if (typeof options === "function") callback = options;
  return [argv, launchEnvironment({...options}), callback];
};
const originalExecFile = childProcess.execFile;
childProcess.execFile = function(command, args, options, callback) {
  const node = directNode(command);
  if (!node) return originalExecFile.apply(this, arguments);
  const launch = execFileLaunchArguments(args, options, callback);
  guardNodeChild(command, launch[0], launch[1], "child_process.execFile");
  guardNodeShell(launch[1], "child_process.execFile");
  const child = originalExecFile.call(this, command, ...launch);
  child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
  return child;
};
// Native custom promisification closes over the original, unguarded execFile.
// Preserve the documented result and actual .child through the guarded API.
Object.defineProperty(childProcess.execFile, require("node:util").promisify.custom, {
  enumerable:false,
  value:function(...args) {
    let resolve, reject;
    const promise = new Promise((accept, refuse) => {resolve = accept; reject = refuse;});
    promise.child = childProcess.execFile(...args, (error, stdout, stderr) => {
      if (error != null) {error.stdout = stdout; error.stderr = stderr; reject(error);}
      else resolve({stdout, stderr});
    });
    return promise;
  },
});
const originalExecFileSync = childProcess.execFileSync;
childProcess.execFileSync = function(command, args, options) {
  const node = directNode(command);
  if (!node) return originalExecFileSync.apply(this, arguments);
  const launch = execFileLaunchArguments(args, options);
  guardNodeChild(command, launch[0], launch[1], "child_process.execFileSync");
  // Native execFileSync returns stdout without its launch PID. Enrollment
  // cannot establish actual parent membership, so refuse before dispatch.
  audit.deniedAttempts += 1;
  const error = new Error("TEST_NODE_CHILD_PID_CUSTODY_UNAVAILABLE");
  error.code = "TEST_NODE_CHILD_PID_CUSTODY_UNAVAILABLE";
  error.surface = "child_process.execFileSync";
  throw error;
};
// exec and execSync interpret arbitrary shell text and expose no trustworthy
// Node descendant PID. Refuse these two public shell surfaces before dispatch.
// This deliberately includes non-Node shell commands; use supported direct
// spawn/execFile APIs instead. No command parsing or guessed PID supplies proof.
const refuseShellExecution = surface => function() {
  audit.deniedAttempts += 1;
  const error = new Error("TEST_SHELL_CHILD_PID_CUSTODY_UNAVAILABLE");
  error.code = "TEST_SHELL_CHILD_PID_CUSTODY_UNAVAILABLE";
  error.surface = surface;
  throw error;
};
childProcess.exec = refuseShellExecution("child_process.exec");
childProcess.execSync = refuseShellExecution("child_process.execSync");
// The replacement has no copied native custom promisifier closing over exec.
// util.promisify wraps the actual refusal and rejects before any shell launch.
const originalFork = childProcess.fork;
childProcess.fork = function(modulePath, args, options) {
  if (args != null && typeof args === "object" && !Array.isArray(args)) {options = args; args = [];}
  else if (args == null) args = [];
  const configuration = {...options, shell:false};
  configuration.execPath ||= process.execPath;
  let execArgv = configuration.execArgv || process.execArgv;
  // Native fork removes the inherited parent eval pair before launching its
  // module. Capture that same choice instead of reintroducing eval recursion.
  if (execArgv === process.execArgv && process._eval != null) {
    const index = execArgv.lastIndexOf(process._eval);
    if (index > 0) {execArgv = execArgv.slice(); execArgv.splice(index - 1, 2);}
  }
  configuration.execArgv = launchArgv(execArgv);
  const argv = launchArgv(args);
  const node = directNode(configuration.execPath);
  const effective = node ? launchEnvironment(configuration) : configuration;
  if (node) guardNodeChild(configuration.execPath, configuration.execArgv, effective, "child_process.fork");
  const child = originalFork.call(this, modulePath, argv, effective);
  if (node) child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
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
if (typeof globalThis.EventSource === "function") globalThis.EventSource = deny("EventSource");
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
