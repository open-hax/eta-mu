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
// Accept the single guard NODE_OPTIONS used by this test gate, or the FIRST
// CLI require. NODE_OPTIONS requires run before CLI requires; an earlier
// unknown require cannot be rescued by a later guard. CJS requires precede
// imports on the pinned Node runtime. Ambiguous options prove no enrollment.
const hasPreload = (args, options) => {
  const argv = Array.isArray(args) ? args : [];
  const configuration = Array.isArray(args) ? options : args ?? options;
  const nodeOptions = (configuration?.env ?? process.env).NODE_OPTIONS;
  if (["--require " + __filename, "--require " + JSON.stringify(__filename),
    "--require=" + __filename, "--require=" + JSON.stringify(__filename),
    "-r " + __filename, "-r " + JSON.stringify(__filename)].includes(nodeOptions)) return true;
  if (nodeOptions != null && nodeOptions !== "") return false;
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (option === "--require" || option === "-r") {
      return argv[++index] === __filename;
    } else if (typeof option === "string" && option.startsWith("--require=")) {
      return option.slice("--require=".length) === __filename;
    } else if (option === "--import") index += 1;
    else if (!(typeof option === "string" && option.startsWith("--import="))) return false;
  }
  return false;
};
const guardNodeChild = (_command, args, options, surface) => {
  if (!hasPreload(args, options)) {
    audit.deniedAttempts += 1;
    const error = new Error("TEST_NODE_CHILD_PRELOAD_REQUIRED");
    error.code = "TEST_NODE_CHILD_PRELOAD_REQUIRED";
    error.surface = surface;
    throw error;
  }
  return true;
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
// Resolve the first accessible executable using the captured Linux launch
// cwd and PATH, then compare physical file identity with this Node executable.
// Original command/argv remain native dispatch inputs. Failed lookups delegate
// to native validation/error behavior; this is not arbitrary launcher or
// filesystem-mutation confinement.
const nodeExecutableIdentity = fs.statSync(process.execPath, {bigint:true});
const nativeURL = require("node:url");
// Named deterministic workflow fixtures are a separate trusted-author surface.
// A single Node --test root claims the private per-suite binding directory;
// only its actual immediate test worker may register this capability. Generic
// child_process APIs keep the shell/env refusal regardless of this capability.
const fixtureCrypto = require("node:crypto");
const fixtureCallSites = require("node:util").getCallSites;
const fixtureRoot = path.resolve(__dirname, "..");
const fixtureOwnerNames = ["opencode-actionability-assessment-workflow.test.mjs",
  "opencode-rejection-assessment-workflow.test.mjs", "opencode-positive-cohort-assessment-workflow.test.mjs"];
const fixtureHelper = path.join(fixtureRoot, ".github/scripts/assessment-trusted-workflow-fixture.mjs");
const fixtureDigest = bytes => fixtureCrypto.createHash("sha256").update(bytes).digest("hex");
const fixtureFile = file => {
  const info = fs.lstatSync(file);
  if (!info.isFile() || info.isSymbolicLink() || fs.realpathSync(file) !== file || info.uid !== process.getuid())
    throw new Error("TEST_TRUSTED_FIXTURE_SOURCE_REFUSED");
  return {path:file, dev:info.dev, ino:info.ino, sha256:fixtureDigest(fs.readFileSync(file))};
};
const fixtureUnchanged = held => {
  const current = fixtureFile(held.path);
  return current.dev === held.dev && current.ino === held.ino && current.sha256 === held.sha256;
};
let fixtureOwner = null;
const fixtureBindingDirectory = process.env.ETA_MU_TEST_TRUSTED_FIXTURE_BINDING_DIR;
if (fixtureBindingDirectory && typeof process.argv[1] === "string") {
  const entry = path.resolve(process.argv[1]);
  if (fixtureOwnerNames.some(name => entry === path.join(fixtureRoot, ".github/scripts", name))) {
    const info = fs.lstatSync(fixtureBindingDirectory);
    if (!info.isDirectory() || info.isSymbolicLink() || fs.realpathSync(fixtureBindingDirectory) !== fixtureBindingDirectory
        || (info.mode & 511) !== 448 || info.uid !== process.getuid()) throw new Error("TEST_TRUSTED_FIXTURE_BINDING_REFUSED");
    const bindingFile = path.join(fixtureBindingDirectory, "root.json");
    const ownerSource = fixtureFile(entry), helperSource = fixtureFile(fixtureHelper);
    if (process.execArgv.includes("--test") && !fs.existsSync(bindingFile)) {
      fs.writeFileSync(bindingFile, JSON.stringify({schema:"eta-mu.trusted-fixture-root/v1", capture,
        pid:process.pid, parentPid:process.ppid, startTicks:audit.kernelAncestry[0].startTicks,
        ownerSource, helperSource}) + "\n", {mode:0o600, flag:"wx"});
    } else if (process.env.NODE_TEST_CONTEXT === "child-v8" && fs.existsSync(bindingFile)) {
      const rootInfo = fs.lstatSync(bindingFile), root = JSON.parse(fs.readFileSync(bindingFile,"utf8"));
      if (rootInfo.isFile() && !rootInfo.isSymbolicLink() && (rootInfo.mode & 511) === 384 && rootInfo.uid === process.getuid()
          && root.schema === "eta-mu.trusted-fixture-root/v1" && root.capture === capture && root.pid === process.ppid
          && root.ownerSource.path === entry && root.ownerSource.sha256 === ownerSource.sha256
          && root.helperSource.path === fixtureHelper && root.helperSource.sha256 === helperSource.sha256
          && audit.kernelAncestry.some(row => row.pid === root.pid && row.startTicks === root.startTicks)) {
        fixtureOwner = {rootPid:root.pid, ownerSource, helperSource, rootFile:fixtureFile(bindingFile)};
        audit.trustedFixtureOwner = {rootPid:root.pid, ownerPath:entry, ownerSHA256:ownerSource.sha256,
          helperSHA256:helperSource.sha256};
        audit.trustedWorkflowFixtureCount = 0;
      }
    }
  }
}
const isByteArray = require("node:util").types.isUint8Array;
const byteArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);
const byteArrayLength = Object.getOwnPropertyDescriptor(byteArrayPrototype, "length").get;
const byteArraySet = Uint8Array.prototype.set;
const byteArrayIncludes = Uint8Array.prototype.includes;
const nativeBufferFrom = Buffer.from;
const nativeIsBuffer = Buffer.isBuffer;
// Preserve Node's accepted raw-byte cwd validation. Async process_wrap ignores
// typed cwd; sync CopyJsString coerces it. Copy bytes without custom iterators,
// then freeze the one sync primitive so guard and native dispatch agree.
const captureLaunchCwd = (value, synchronous) => {
  if (value instanceof nativeURL.URL) return nativeURL.fileURLToPath(value);
  if (!isByteArray(value)) return value;
  let copy = new Uint8Array(Reflect.apply(byteArrayLength, value, []));
  Reflect.apply(byteArraySet, copy, [value]);
  if (Reflect.apply(nativeIsBuffer, Buffer, [value])) copy = Reflect.apply(nativeBufferFrom, Buffer, [copy]);
  if (synchronous && !Reflect.apply(byteArrayIncludes, copy, [0])) {
    const primitive = String(value);
    Object.defineProperty(copy, Symbol.toPrimitive, {value:() => primitive});
  }
  return copy;
};
const directNode = (command, configuration, synchronous = false) => {
  if (typeof command !== "string" || !command || command.includes("\0")) return false;
  let selectedCwd = configuration.cwd;
  if (isByteArray(selectedCwd)) {
    if (Reflect.apply(byteArrayIncludes, selectedCwd, [0])) return false;
    // Sync native CString uses the captured primitive through its first NUL;
    // async native ignores accepted byte-array cwd entirely.
    selectedCwd = synchronous ? String(selectedCwd).split("\0", 1)[0] : undefined;
  }
  if (selectedCwd != null && typeof selectedCwd !== "string") return false;
  if (typeof selectedCwd === "string" && selectedCwd.includes("\0")) return false;
  if (synchronous && selectedCwd === "") return false;
  const parentCwd = process.cwd();
  const cwd = selectedCwd == null || !synchronous && selectedCwd === "" ? parentCwd
    : path.isAbsolute(selectedCwd) ? selectedCwd : parentCwd + "/" + selectedCwd;
  try {if (!fs.statSync(cwd).isDirectory()) return false;} catch {return false;}
  if (command === process.execPath || path.basename(command) === "node") return true;
  // Never collapse symlink/.. components: native chdir/exec follows them in
  // kernel order, unlike path.resolve/path.join/fs.realpathSync normalization.
  const fromCwd = file => path.isAbsolute(file) ? file : cwd + "/" + file;
  const candidates = command.includes("/") ? [fromCwd(command)]
    : (configuration.env.PATH ?? "/usr/bin:/bin").split(":").map(entry => fromCwd(entry ? entry + "/" + command : command));
  for (const candidate of candidates) {
    try {
      const identity = fs.statSync(candidate, {bigint:true});
      if (!identity.isFile()) continue;
      fs.accessSync(candidate, fs.constants.X_OK);
      return identity.dev === nodeExecutableIdentity.dev && identity.ino === nodeExecutableIdentity.ino;
    } catch (error) {
      if (["ENOENT", "ENOTDIR", "EACCES"].includes(error.code)) continue;
      return false;
    }
  }
  return false;
};
const launchArgv = args => {
  if (!Array.isArray(args)) return args;
  const argv = [], length = args.length;
  for (let index = 0; index < length; index += 1) argv.push(`${args[index]}`);
  return argv;
};
const launchEnvironment = (configuration, synchronous = false) => {
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
  return {...configuration, cwd:captureLaunchCwd(configuration.cwd, synchronous), env:environment};
};
const spawnLaunchArguments = (args, options, synchronous = false) => {
  let argv = args;
  if (Array.isArray(args)) argv = launchArgv(args);
  else if (args == null) argv = [];
  else if (typeof args === "object") {options = args; argv = [];}
  return [argv, launchEnvironment({...options}, synchronous)];
};
// Explicit Unix shell/env executables can hide unaudited Node descendants.
// Refuse these bounded launcher basenames before dispatch, without parsing shell
// text or guessing a PID. Arbitrary renamed launchers and native handles remain
// outside this test instrumentation claim; other non-Node commands delegate.
const indirectLauncherNames = new Set([
  "sh", "bash", "dash", "ash", "zsh", "ksh", "ksh93", "mksh", "pdksh",
  "yash", "fish", "csh", "tcsh", "rbash", "rksh", "rzsh", "env",
]);
const guardIndirectLauncher = (command, surface) => {
  if (typeof command !== "string" || !indirectLauncherNames.has(path.basename(command))) return;
  audit.deniedAttempts += 1;
  const error = new Error("TEST_INDIRECT_NODE_PID_CUSTODY_UNAVAILABLE");
  error.code = "TEST_INDIRECT_NODE_PID_CUSTODY_UNAVAILABLE";
  error.surface = surface;
  throw error;
};
// A non-Node immediate command can still select Node's lexical shell.
// Consume the same captured options that native dispatch receives; never
// probe a live getter and then delegate its original mutable configuration.
const guardNonNodeShell = (configuration, surface) => {
  if (!configuration.shell) return;
  audit.deniedAttempts += 1;
  const error = new Error("TEST_SHELL_CHILD_PID_CUSTODY_UNAVAILABLE");
  error.code = "TEST_SHELL_CHILD_PID_CUSTODY_UNAVAILABLE";
  error.surface = surface;
  throw error;
};
// Preserve native validation of the original overload-selected options before
// spreading. The original API rejects these invariant types before dispatch,
// retaining its own exact error and zero network-denial credit.
const invalidSpawnOptions = (args, options) => {
  const selected = !Array.isArray(args) && args != null && typeof args === "object" ? args : options;
  return selected !== undefined && (selected === null || typeof selected !== "object" || Array.isArray(selected));
};
const invalidExecFileOptions = (args, options, synchronous) => {
  const selected = !Array.isArray(args) && args != null && typeof args === "object" ? args
    : typeof args === "function" ? null : options;
  if (selected == null) return false;
  if (typeof selected === "function") return synchronous;
  return typeof selected !== "object" || Array.isArray(selected);
};
const originalSync = childProcess.spawnSync;
childProcess.spawnSync = function(command, args, options) {
  if (invalidSpawnOptions(args, options)) return originalSync.apply(this, arguments);
  guardIndirectLauncher(command, "child_process.spawnSync");
  const launch = spawnLaunchArguments(args, options, true);
  const node = directNode(command, launch[1], true);
  if (node) {
    guardNodeChild(command, launch[0], launch[1], "child_process.spawnSync");
    guardNodeShell(launch[1], "child_process.spawnSync");
  } else guardNonNodeShell(launch[1], "child_process.spawnSync");
  const result = originalSync.call(this, command, ...launch);
  if (node && Number.isSafeInteger(result.pid)) audit.expectedNodeChildren.push(result.pid);
  return result;
};
const originalSpawn = childProcess.spawn;
childProcess.spawn = function(command, args, options) {
  if (invalidSpawnOptions(args, options)) return originalSpawn.apply(this, arguments);
  guardIndirectLauncher(command, "child_process.spawn");
  const launch = spawnLaunchArguments(args, options);
  const node = directNode(command, launch[1]);
  if (node) {
    guardNodeChild(command, launch[0], launch[1], "child_process.spawn");
    guardNodeShell(launch[1], "child_process.spawn");
  } else guardNonNodeShell(launch[1], "child_process.spawn");
  const child = originalSpawn.call(this, command, ...launch);
  if (node) child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
  return child;
};
// execFile and fork use Node's lexical launcher, so patched exported spawn
// is not sufficient. Their overload rules differ and remain explicit here.
const execFileLaunchArguments = (args, options, callback, synchronous = false) => {
  let argv = [];
  if (Array.isArray(args)) argv = launchArgv(args);
  else if (args != null && typeof args === "object") {callback = options; options = args;}
  else if (typeof args === "function") {callback = args; options = null;}
  else if (args != null) argv = args;
  if (typeof options === "function") callback = options;
  return [argv, launchEnvironment({...options}, synchronous), callback];
};
const originalExecFile = childProcess.execFile;
childProcess.execFile = function(command, args, options, callback) {
  if (invalidExecFileOptions(args, options, false)) return originalExecFile.apply(this, arguments);
  guardIndirectLauncher(command, "child_process.execFile");
  const launch = execFileLaunchArguments(args, options, callback);
  const node = directNode(command, launch[1]);
  if (node) {
    guardNodeChild(command, launch[0], launch[1], "child_process.execFile");
    guardNodeShell(launch[1], "child_process.execFile");
  } else guardNonNodeShell(launch[1], "child_process.execFile");
  const child = originalExecFile.call(this, command, ...launch);
  if (node) child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
  return child;
};
// The capability accepts only an exact registered Bash argv/program from the
// captured trusted owner, not a public child_process shell exemption. A source
// or caller mismatch refuses before dispatch. Actual Node journal/ancestry is
// checked after the synchronous fixture and before its result is admitted.
const refuseTrustedFixture = code => {
  audit.deniedAttempts += 1;
  const error = new Error(code); error.code = code; error.surface = "trusted-workflow-fixture"; throw error;
};
const fixtureCaller = ownerURL => {
  if (!fixtureOwner) return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_OWNER_REFUSED");
  let ownerPath;
  try {ownerPath = nativeURL.fileURLToPath(ownerURL);} catch {return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_CALLER_REFUSED");}
  const sites = fixtureCallSites(8).map(row => row.scriptName);
  const normalize = name => name.startsWith("file:") ? nativeURL.fileURLToPath(name) : name;
  const external = sites.map(normalize).filter(name => name !== __filename);
  if (ownerPath !== fixtureOwner.ownerSource.path || external[0] !== fixtureHelper || external[1] !== ownerPath)
    return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_CALLER_REFUSED");
  try {
    if (!fixtureUnchanged(fixtureOwner.ownerSource) || !fixtureUnchanged(fixtureOwner.helperSource)
        || !fixtureUnchanged(fixtureOwner.rootFile))
      return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_SOURCE_REFUSED");
  } catch (error) {
    if (error.surface === "trusted-workflow-fixture") throw error;
    return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_SOURCE_REFUSED");
  }
};
const fixtureAuditRecords = () => fs.readdirSync(directory).map(name => {
  const file = path.join(directory,name), info = fs.lstatSync(file);
  if (!/^[1-9][0-9]*\.json$/.test(name) || !info.isFile() || info.isSymbolicLink() || (info.mode & 511) !== 384
      || info.uid !== process.getuid() || info.size < 1 || info.size > 65536) throw new Error("TEST_TRUSTED_FIXTURE_AUDIT_REFUSED");
  const record = JSON.parse(fs.readFileSync(file,"utf8"));
  if (record.schema !== audit.schema || record.capture !== capture || name !== `${record.pid}.json`
      || !Array.isArray(record.kernelAncestry) || !Array.isArray(record.expectedNodeChildren))
    throw new Error("TEST_TRUSTED_FIXTURE_AUDIT_REFUSED");
  return record;
});
module.exports.registerTrustedWorkflowFixture = function(ownerURL, args, expectedNodeChildren = 0) {
  fixtureCaller(ownerURL);
  if (!Array.isArray(args) || !Number.isSafeInteger(expectedNodeChildren) || expectedNodeChildren < 0 || expectedNodeChildren > 16)
    return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_PROGRAM_REFUSED");
  const argv = launchArgv(args);
  if (!argv.every(value => typeof value === "string" && !value.includes("\0"))
      || !((argv.length === 2 && argv[0] === "-c") || (argv.length === 7
        && JSON.stringify(argv.slice(0,6)) === JSON.stringify(["--noprofile","--norc","-e","-o","pipefail","-c"]))))
    return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_PROGRAM_REFUSED");
  Object.freeze(argv);
  const argvSHA256 = fixtureDigest(JSON.stringify(argv)), programSHA256 = fixtureDigest(argv.at(-1));
  return Object.freeze({run(options) {
    fixtureCaller(ownerURL);
    const configuration = launchEnvironment({...options},true);
    if (configuration.shell) return refuseTrustedFixture("TEST_TRUSTED_FIXTURE_PROGRAM_REFUSED");
    configuration.env.NODE_OPTIONS = "--require " + JSON.stringify(__filename);
    configuration.env.ETA_MU_TEST_NETWORK_AUDIT_DIR = directory;
    configuration.env.ETA_MU_TEST_NETWORK_AUDIT_CAPTURE = capture;
    // Descendants inherit instrumentation but never the trusted fixture root
    // capability: their native parent is not the one held Node --test root.
    configuration.env.ETA_MU_TEST_TRUSTED_FIXTURE_BINDING_DIR = fixtureBindingDirectory;
    const before = new Set(fixtureAuditRecords().map(record => record.pid));
    // Capturing options/cwd/env may invoke author getters. Rebind afterward,
    // immediately before dispatch; the native call receives this stable view.
    fixtureCaller(ownerURL);
    const result = originalSync.call(childProcess,"bash",argv,configuration);
    const row = {schema:"eta-mu.trusted-workflow-fixture/v1", capture, ownerPid:process.pid,
      ownerPath:fixtureOwner.ownerSource.path, ownerSHA256:fixtureOwner.ownerSource.sha256,
      helperSHA256:fixtureOwner.helperSource.sha256, rootPid:fixtureOwner.rootPid,
      argvSHA256, programSHA256, actualPid:result.pid ?? null, status:result.status,
      signal:result.signal, errorCode:result.error?.code ?? null, expectedNodeCount:expectedNodeChildren,
      actualNodeChildren:[], custodyQualified:false};
    let failure = null;
    try {
      // Actual native execution is not admission. Retain changed source/root
      // as an unqualified outcome rather than returning fixture proof.
      if (!fixtureUnchanged(fixtureOwner.ownerSource) || !fixtureUnchanged(fixtureOwner.helperSource)
          || !fixtureUnchanged(fixtureOwner.rootFile)) throw new Error("TEST_TRUSTED_FIXTURE_SOURCE_REFUSED");
      if (!Number.isSafeInteger(result.pid) || result.pid <= 0 || result.signal !== null || result.error)
        throw new Error("TEST_TRUSTED_FIXTURE_OUTCOME_REFUSED");
      const children = fixtureAuditRecords().filter(record => !before.has(record.pid));
      if (children.length !== expectedNodeChildren) throw new Error("TEST_TRUSTED_FIXTURE_NODE_CUSTODY_REFUSED");
      const ids = new Set(children.map(record => record.pid));
      for (const child of children) {
        const immediate = child.kernelAncestry[0];
        const nativeLauncher = child.kernelAncestry.find(held => held.pid === result.pid && held.parentPid === process.pid);
        if (!immediate || immediate.pid !== child.pid || immediate.parentPid !== child.parentPid
            || !/^[0-9]+$/.test(immediate.startTicks) || !nativeLauncher || !/^[0-9]+$/.test(nativeLauncher.startTicks)
            || child.deniedAttempts !== 0 || !child.expectedNodeChildren.every(pid => ids.has(pid)))
          throw new Error("TEST_TRUSTED_FIXTURE_NODE_CUSTODY_REFUSED");
        row.actualNodeChildren.push({pid:child.pid,parentPid:child.parentPid,startTicks:immediate.startTicks,
          launcherStartTicks:nativeLauncher.startTicks});
      }
      row.custodyQualified = true;
      audit.expectedNodeChildren.push(...row.actualNodeChildren.map(child => child.pid));
    } catch (error) {failure = error.message;}
    const journal = path.join(fixtureBindingDirectory, `${process.pid}.jsonl`);
    fs.appendFileSync(journal, JSON.stringify(row)+"\n",{mode:0o600});
    audit.trustedWorkflowFixtureCount += 1;
    if (failure) return refuseTrustedFixture(failure);
    return result;
  }});
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
  if (invalidExecFileOptions(args, options, true)) return originalExecFileSync.apply(this, arguments);
  guardIndirectLauncher(command, "child_process.execFileSync");
  const launch = execFileLaunchArguments(args, options, undefined, true);
  const node = directNode(command, launch[1], true);
  if (!node) {
    guardNonNodeShell(launch[1], "child_process.execFileSync");
    return originalExecFileSync.call(this, command, launch[0], launch[1]);
  }
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
  guardIndirectLauncher(configuration.execPath, "child_process.fork");
  let execArgv = configuration.execArgv || process.execArgv;
  // Native fork removes the inherited parent eval pair before launching its
  // module. Capture that same choice instead of reintroducing eval recursion.
  if (execArgv === process.execArgv && process._eval != null) {
    const index = execArgv.lastIndexOf(process._eval);
    if (index > 0) {execArgv = execArgv.slice(); execArgv.splice(index - 1, 2);}
  }
  configuration.execArgv = launchArgv(execArgv);
  const argv = launchArgv(args);
  const effective = launchEnvironment(configuration);
  const node = directNode(configuration.execPath, effective);
  if (node) guardNodeChild(configuration.execPath, configuration.execArgv, effective, "child_process.fork");
  const child = originalFork.call(this, modulePath, argv, effective);
  if (node) child.once("spawn", () => audit.expectedNodeChildren.push(child.pid));
  return child;
};
// PID-only audit records cannot enroll a Worker isolate or its denials.
// Refuse construction before launching even when it inherits this preload;
// Standalone replacement retains no native constructor/prototype chain. CJS
// and ESM expose the same replacement after syncBuiltinESMExports below.
const workerThreads = require("node:worker_threads");
workerThreads.Worker = class Worker {
  constructor() {
    audit.deniedAttempts += 1;
    const error = new Error("TEST_WORKER_AUDIT_CUSTODY_UNAVAILABLE");
    error.code = "TEST_WORKER_AUDIT_CUSTODY_UNAVAILABLE";
    error.surface = "worker_threads.Worker";
    throw error;
  }
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
// HTTP, HTTPS and ESM Server views inherit this same actual prototype.
net.Server.prototype.listen = deny("net.Server.listen");
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
