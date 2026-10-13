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
// Preserve the actual availability fact, then make predecessor dispatch inert.
control.webSocketAvailable = typeof globalThis.WebSocket === "function";
if (control.webSocketAvailable) globalThis.WebSocket = function () {control.fallbackCalls.push("WebSocket");};

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
  if (control.webSocketAvailable) {
    try {Reflect.construct(globalThis.WebSocket, ["wss://inert.invalid"]); results.push({surface:"WebSocket", denied:false});}
    catch (error) {results.push({surface:"WebSocket", denied:error.code === "TEST_NETWORK_FORBIDDEN",
      errorCode:error.code ?? null, actualSurface:error.surface ?? null});}
  }

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
  pid:process.pid, webSocketAvailable:control.webSocketAvailable, results, identities, fallbackCalls:control.fallbackCalls}));
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
  if (mode === "queries" && Number(process.versions.node.split(".")[0]) >= 24) {
    assert.equal(
      result.webSocketAvailable,
      true,
      "actual Node24 WebSocket constructor must be exercised",
    );
    assert.ok(result.results.some((row) => row.surface === "WebSocket"));
  }
  if (mode === "esm") assert.deepEqual(result.identities, [true, true, true, true]);
}

test("UDP and DNS queries plus resolver rebinding deny before inert fallback dispatch", (t) =>
  control(t, "queries"));
test("already imported ESM UDP and DNS exports receive the same denial boundary", (t) =>
  control(t, "esm"));
test("loading the Node boundary alone records a healthy empty audit", (t) => control(t, "noop"));

// Real child-launch controls remain outside zero-denial suite admission. A
// predecessor child can only write an owned marker or read an empty stdin;
// it contains no network code and receives no credentials or user config.
const childLaunchSource = String.raw`
(async () => {
  const fs = require("node:fs"), {spawn, spawnSync} = require("node:child_process");
  const api = process.env.TEST_CHILD_API, mode = process.env.TEST_CHILD_MODE;
  const marker = process.env.TEST_CHILD_MARKER, program = process.env.TEST_CHILD_PROGRAM;
  const preload = process.env.TEST_PRELOAD_FILE;
  const observation = {api, mode, refused:false, errorCode:null, surface:null, pid:null, status:null};
  let args = [program], options = {env:{PATH:process.env.PATH}, timeout:5000};
  if (mode === "inherited") delete options.env;
  else if (mode === "cli") {
    args = ["--require", preload, program];
    options.env = {...process.env}; delete options.env.NODE_OPTIONS;
  } else if (mode === "title-hint") options.env.NODE_OPTIONS = "--title=" + preload;
  else if (mode === "longer-path") options.env.NODE_OPTIONS = "--require " + preload + ".decoy.cjs";
  else if (mode === "late-argv") args = [program, "--require", preload];
  else if (mode !== "missing" && mode !== "overload") throw Error("CONTROL_MODE_REFUSED");
  try {
    if (api === "spawnSync") {
      const child = mode === "overload" ? spawnSync(process.execPath, {...options, input:""})
        : spawnSync(process.execPath, args, options);
      observation.pid = child.pid ?? null; observation.status = child.status;
      if (child.error) throw child.error;
    } else if (api === "spawn") {
      const child = mode === "overload" ? spawn(process.execPath, options) : spawn(process.execPath, args, options);
      observation.pid = child.pid ?? null;
      child.stdin.end();
      observation.status = await new Promise((resolve, reject) => {
        child.once("error", reject); child.once("close", resolve);
      });
    } else throw Error("CONTROL_API_REFUSED");
  } catch (error) {
    observation.refused = true; observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.markerPresent = fs.existsSync(marker);
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function childLaunchControl(t, api, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-child-preload-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const marker = path.join(work, "executed"),
    program = path.join(work, "marker-child.cjs");
  fs.writeFileSync(
    program,
    `require("node:fs").writeFileSync(${JSON.stringify(marker)}, "executed", {mode:0o600, flag:"wx"});\n`,
    { mode: 0o600, flag: "wx" },
  );
  // This path contains the actual preload name but has no network behavior or
  // audit enrollment. A substring match must not qualify it as the boundary.
  const target = mode === "longer-path" ? path.join(work, "target-preload.cjs") : preload;
  if (mode === "longer-path") {
    fs.copyFileSync(preload, target);
    fs.chmodSync(target, 0o600);
    fs.writeFileSync(target + ".decoy.cjs", "// inert longer-path control\n", {
      mode: 0o600,
      flag: "wx",
    });
  }
  const capture = "child-preload-" + api + "-" + mode;
  const parent = spawnSync(process.execPath, ["--eval", childLaunchSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(target),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_MODE: mode,
      TEST_PRELOAD_FILE: target,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_PROGRAM: program,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.node-child-preload-control-evidence/v1",
      parentExit: parent.status,
      observation,
      records,
    }),
  );
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.equal(observation.api, api);
  assert.equal(observation.mode, mode);
  if (mode === "inherited" || mode === "cli") {
    assert.equal(parent.status, 0, parent.stderr);
    assert.equal(observation.refused, false);
    assert.equal(observation.status, 0);
    assert.equal(observation.markerPresent, true);
    assert.ok(Number.isSafeInteger(observation.pid) && observation.pid > 0);
    assert.deepEqual(audit.expectedNodeChildren, [observation.pid]);
    assert.equal(records.length, 2);
    const child = records.find((record) => record.pid === observation.pid);
    assert.ok(child);
    assert.equal(child.parentPid, parent.pid);
    assert.deepEqual(child.expectedNodeChildren, []);
    assert.ok(
      child.kernelAncestry.some(
        (row) =>
          row.pid === child.pid && row.parentPid === parent.pid && /^[0-9]+$/.test(row.startTicks),
      ),
    );
    for (const record of records) assert.equal(record.deniedAttempts, 0);
  } else {
    assert.equal(
      observation.refused,
      true,
      "a direct Node launch without the actual early preload must be refused",
    );
    assert.equal(observation.errorCode, "TEST_NODE_CHILD_PRELOAD_REQUIRED");
    assert.equal(observation.surface, "child_process." + api);
    assert.equal(observation.pid, null, "refusal must precede actual child dispatch");
    assert.equal(observation.markerPresent, false, "unprotected child code must never run");
    assert.equal(records.length, 1);
    assert.deepEqual(audit.expectedNodeChildren, []);
    assert.equal(audit.deniedAttempts, 1);
    assert.equal(parent.status, 97, "catching a refused launch cannot admit a zero-denial suite");
  }
}

for (const api of ["spawnSync", "spawn"]) {
  test(`direct Node ${api} refuses missing or misleading preload before child execution`, (t) => {
    for (const mode of ["missing", "overload", "title-hint", "longer-path", "late-argv"])
      childLaunchControl(t, api, mode);
  });
  test(`direct Node ${api} retains inherited and explicit early preload audit membership`, (t) => {
    for (const mode of ["inherited", "cli"]) childLaunchControl(t, api, mode);
  });
}

// The actual flag must expose the native constructor before an inert replacement
// is installed. Neither predecessor nor repaired control constructs that client.
test("flagged EventSource denies before inert constructor dispatch", (t) => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-eventsource-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const bootstrap = path.join(work, "inert-eventsource.cjs");
  fs.writeFileSync(
    bootstrap,
    String.raw`
const control = globalThis.etaEventSourceControl = {
  available:typeof globalThis.EventSource === "function",
  flag:process.execArgv.includes("--experimental-eventsource"),
  nodeVersion:process.versions.node, fallbackCalls:0,
};
if (!control.available || !control.flag) throw Error("CONTROL_ACTUAL_EVENTSOURCE_FLAG_REQUIRED");
globalThis.EventSource = function () {control.fallbackCalls += 1;};
`,
    { mode: 0o600, flag: "wx" },
  );
  const exercise = String.raw`
let denied = false, errorCode = null, surface = null;
try {new globalThis.EventSource("https://inert.invalid/events");}
catch (error) {denied = error.code === "TEST_NETWORK_FORBIDDEN"; errorCode = error.code ?? null; surface = error.surface ?? null;}
console.log(JSON.stringify({schema:"eta-mu.eventsource-denial-control/v1", pid:process.pid,
  ...globalThis.etaEventSourceControl, denied, errorCode, surface}));
`;
  const capture = "eventsource-control";
  const child = spawnSync(
    process.execPath,
    [
      "--require",
      bootstrap,
      "--require",
      preload,
      "--experimental-eventsource",
      "--eval",
      exercise,
    ],
    {
      cwd: work,
      env: {
        HOME: home,
        TMPDIR: temporary,
        XDG_CONFIG_HOME: path.join(home, ".config"),
        LANG: "C.UTF-8",
        LC_ALL: "C.UTF-8",
        TZ: "UTC",
        ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
        ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      },
      encoding: "utf8",
      timeout: 15000,
    },
  );
  assert.equal(child.error, undefined, child.stderr);
  assert.equal(child.signal, null, child.stderr);
  assert.equal(child.stderr, "", "availability and inert denial must emit no experimental warning");
  const lines = child.stdout.trim().split("\n");
  assert.equal(lines.length, 1, child.stdout);
  const result = JSON.parse(lines[0]),
    files = fs.readdirSync(auditDirectory);
  assert.deepEqual(files, [`${child.pid}.json`]);
  const auditFile = path.join(auditDirectory, files[0]),
    info = fs.lstatSync(auditFile);
  assert.ok(info.isFile() && !info.isSymbolicLink());
  assert.equal(info.mode & 0o777, 0o600);
  assert.equal(info.uid, process.getuid());
  const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.eventsource-denial-control-evidence/v1",
      childExit: child.status,
      result,
      audit,
    }),
  );
  assert.equal(result.schema, "eta-mu.eventsource-denial-control/v1");
  assert.equal(result.pid, child.pid);
  assert.equal(
    result.available,
    true,
    "the real flagged constructor must exist before replacement",
  );
  assert.equal(result.flag, true);
  assert.match(result.nodeVersion, /^\d+\.\d+\.\d+$/);
  assert.equal(result.denied, true);
  assert.equal(result.errorCode, "TEST_NETWORK_FORBIDDEN");
  assert.equal(result.surface, "EventSource");
  assert.equal(result.fallbackCalls, 0);
  assert.equal(audit.schema, "eta-mu.test-network-denial/v1");
  assert.equal(audit.capture, capture);
  assert.equal(audit.pid, child.pid);
  assert.equal(audit.parentPid, process.pid);
  assert.deepEqual(audit.expectedNodeChildren, []);
  assert.equal(audit.deniedAttempts, 1);
  assert.ok(
    audit.kernelAncestry.some(
      (row) =>
        row.pid === child.pid && row.parentPid === process.pid && /^[0-9]+$/.test(row.startTicks),
    ),
  );
  assert.equal(child.status, 97, "a caught EventSource denial still fails the child on exit");
});

// Each exec-file overload is separately registered. The predecessor can only
// write an owned inert marker and print its actual PID; no network code runs.
const execFileLaunchSource = String.raw`
(async () => {
  const fs = require("node:fs"), cp = require("node:child_process");
  const {promisify} = require("node:util");
  const api = process.env.TEST_CHILD_API, mode = process.env.TEST_CHILD_MODE;
  const marker = process.env.TEST_CHILD_MARKER, program = process.env.TEST_CHILD_PROGRAM;
  const preload = process.env.TEST_PRELOAD_FILE;
  const shellProgram = process.env.TEST_CHILD_SHELL_PROGRAM;
  const childFacts = process.env.TEST_CHILD_FACTS;
  const code = fs.readFileSync(program, "utf8");
  const observation = {api, mode, refused:false, errorCode:null, surface:null, pid:null,
    stdoutPid:null, status:null, callbackCalls:0, promisifyChild:false};
  let getterReads = 0;
  let args = [program], options = {env:{PATH:process.env.PATH}, timeout:5000};
  if (["inherited", "second-callback-ignored-options", "second-callback-env-ignored",
      "fourth-callback-env-ignored", "inherited-env-decoy", "esm-inherited",
      "promisify-inherited", "promisify-cli", "explicit-exec-path", "inherited-eval",
      "changing-exec-path"].includes(mode)) delete options.env;
  if (mode === "cli" || mode === "promisify-cli") {
    args = ["--require", preload, program];
    options.env = {...process.env}; delete options.env.NODE_OPTIONS;
  } else if (mode === "title-hint") options.env.NODE_OPTIONS = "--title=" + preload;
  else if (mode === "longer-path") options.env.NODE_OPTIONS = "--require " + preload + ".decoy.cjs";
  else if (mode === "late-argv") args = [program, "--require", preload];
  else if (mode === "inherited-env-decoy") options = Object.assign(Object.create({env:{PATH:process.env.PATH}}), {timeout:5000});
  if (mode === "undefined-env") options.env = undefined;
  else if (mode === "null-env") options.env = null;
  else if (mode === "inherited-enumerable-env") options.env = Object.assign(Object.create({...process.env}), {PATH:process.env.PATH});
  else if (mode === "nonenumerable-node-options") Object.defineProperty(options.env, "NODE_OPTIONS", {value:process.env.NODE_OPTIONS});
  else if (mode.startsWith("changing-options-env")) {
    const missing = mode.endsWith("-missing");
    Object.defineProperty(options, "env", {enumerable:true, get() {
      getterReads += 1;
      return (getterReads === 1) !== missing ? process.env : {PATH:process.env.PATH};
    }});
  } else if (mode.startsWith("changing-node-options")) {
    const environment = {...process.env}, missing = mode.endsWith("-missing");
    Object.defineProperty(environment, "NODE_OPTIONS", {enumerable:true, get() {
      getterReads += 1;
      return (getterReads === 1) !== missing ? process.env.NODE_OPTIONS : undefined;
    }});
    options.env = environment;
  } else if (mode.startsWith("changing-env-value")) {
    const missing = mode.endsWith("-missing");
    options.env = {...process.env, NODE_OPTIONS:{toString() {
      getterReads += 1;
      return (getterReads === 1) !== missing ? process.env.NODE_OPTIONS : "";
    }}};
  } else if (mode.startsWith("changing-argv")) {
    const missing = mode.endsWith("-missing");
    options.env = {...process.env}; delete options.env.NODE_OPTIONS;
    args = missing ? [program, preload, program] : ["--require", preload, program];
    Object.defineProperty(args, missing ? "0" : "1", {enumerable:true, get() {
      getterReads += 1;
      return missing ? (getterReads === 1 ? program : "--require")
        : (getterReads === 1 ? preload : preload + ".decoy.cjs");
    }});
  }
  try {
    if (mode === "non-node") {
      const command = "/usr/bin/python3", shellArgs = [shellProgram, marker];
      if (api === "execFileSync") {
        observation.stdoutPid = Number(cp.execFileSync(command, shellArgs, {encoding:"utf8", env:{PATH:process.env.PATH}, timeout:5000}));
        observation.status = 0;
      } else if (api === "fork" || api === "spawn" || api === "spawnSync") {
        if (api === "spawnSync") {
          const child = cp.spawnSync(command, shellArgs, {encoding:"utf8", env:{PATH:process.env.PATH}, timeout:5000});
          if (child.error) throw child.error;
          observation.pid = child.pid ?? null; observation.status = child.status;
          observation.stdoutPid = Number(child.stdout);
          if (child.stderr !== "") throw Error("CONTROL_CHILD_STDERR_REFUSED");
        } else {
          const child = api === "fork" ? cp.fork(shellProgram, [marker], {execPath:command, execArgv:[], silent:true, env:{PATH:process.env.PATH}, timeout:5000})
            : cp.spawn(command, shellArgs, {env:{PATH:process.env.PATH}, timeout:5000});
          observation.pid = child.pid ?? null;
          let stdout = "", stderr = "";
          child.stdout.on("data", chunk => {stdout += chunk;});
          child.stderr.on("data", chunk => {stderr += chunk;});
          observation.status = await new Promise((resolve, reject) => {child.once("error", reject); child.once("close", resolve);});
          if (stderr !== "") throw Error("CONTROL_CHILD_STDERR_REFUSED");
          observation.stdoutPid = Number(stdout);
        }
      } else {
        const child = cp.execFile(command, shellArgs, {encoding:"utf8", env:{PATH:process.env.PATH}, timeout:5000}, (error, stdout) => {
          observation.callbackCalls += 1; observation.stdoutPid = Number(stdout);
          if (error) throw error;
        });
        observation.pid = child.pid ?? null;
        observation.status = await new Promise((resolve, reject) => {child.once("error", reject); child.once("close", resolve);});
      }
    } else if (api === "fork") {
      options.execArgv = []; options.silent = true;
      if (mode === "cli") {options.execArgv = ["--require", preload]; args = [];}
      else if (mode === "explicit-exec-path") options.execPath = process.execPath;
      else if (mode === "inherited-eval") delete options.execArgv;
      else if (mode === "changing-exec-path") Object.defineProperty(options, "execPath", {enumerable:true, get() {
        getterReads += 1; return getterReads === 1 ? process.execPath : "/bin/sh";
      }});
      else if (mode === "changing-exec-argv") {
        options.env = {...process.env}; delete options.env.NODE_OPTIONS;
        Object.defineProperty(options, "execArgv", {enumerable:true, get() {
          getterReads += 1; return getterReads === 1 ? ["--require", preload] : [];
        }});
      }
      const child = mode === "options-only" ? cp.fork(program, options)
        : mode === "null-args" ? cp.fork(program, null, options)
        : mode === "undefined-args" ? cp.fork(program, undefined, options)
        : cp.fork(program, args, options);
      observation.pid = child.pid ?? null;
      let stdout = "", stderr = "";
      child.stdout.on("data", chunk => {stdout += chunk;});
      child.stderr.on("data", chunk => {stderr += chunk;});
      observation.status = await new Promise((resolve, reject) => {child.once("error", reject); child.once("close", resolve);});
      if (stderr !== "") throw Error("CONTROL_CHILD_STDERR_REFUSED");
      observation.stdoutPid = Number(stdout);
    } else if (api === "spawnSync" || api === "spawn") {
      if (api === "spawnSync") {
        options.input = code; options.encoding = "utf8";
        const child = cp.spawnSync(process.execPath, args, options);
        observation.pid = child.pid ?? null; observation.status = child.status;
        if (child.error) throw child.error;
        if (child.stderr !== "") throw Error("CONTROL_CHILD_STDERR_REFUSED");
        observation.stdoutPid = Number(child.stdout);
      } else {
        const child = cp.spawn(process.execPath, args, options);
        observation.pid = child.pid ?? null;
        let stdout = "", stderr = "";
        child.stdout.on("data", chunk => {stdout += chunk;});
        child.stderr.on("data", chunk => {stderr += chunk;});
        const closed = new Promise((resolve, reject) => {child.once("error", reject); child.once("close", resolve);});
        child.stdin.end(code); observation.status = await closed;
        if (stderr !== "") throw Error("CONTROL_CHILD_STDERR_REFUSED");
        observation.stdoutPid = Number(stdout);
      }
    } else if (api === "execFileSync") {
      options = {...options, input:code, encoding:"utf8"};
      const stdout = mode === "options-only" ? cp.execFileSync(process.execPath, options)
        : mode === "null-args" ? cp.execFileSync(process.execPath, null, options)
        : mode === "undefined-args" ? cp.execFileSync(process.execPath, undefined, options)
        : cp.execFileSync(process.execPath, args, options);
      // Diagnostic stdout cannot supply the missing native launch-PID custody.
      observation.stdoutPid = Number(stdout); observation.status = 0;
    } else {
      const selected = mode.startsWith("esm-") ? (await import("node:child_process")).execFile : cp.execFile;
      let callbackResolve, callbackReject;
      const completion = new Promise((resolve, reject) => {callbackResolve = resolve; callbackReject = reject;});
      const callback = (error, stdout, stderr) => {
        observation.callbackCalls += 1;
        if (error) callbackReject(error); else callbackResolve({stdout, stderr});
      };
      let child, result;
      if (mode.startsWith("promisify-")) {
        const pending = promisify(selected)(process.execPath, args, options);
        child = pending.child; observation.promisifyChild = !!child && typeof child.once === "function";
        result = pending;
      } else {
        if (mode === "third-callback-env" || mode === "fourth-callback-env-ignored" || mode === "second-callback-env-ignored")
          callback.env = {PATH:process.env.PATH};
        child = mode === "options-only" ? selected(process.execPath, options, callback)
          : mode === "null-args" ? selected(process.execPath, null, options, callback)
          : mode === "undefined-args" ? selected(process.execPath, undefined, options, callback)
          : mode === "third-callback-env" ? selected(process.execPath, args, callback)
          : mode === "second-callback-ignored-options" ? selected(process.execPath, callback, {env:{PATH:process.env.PATH}})
          : mode === "second-callback-env-ignored" ? selected(process.execPath, callback, null)
          : selected(process.execPath, args, options, callback);
        result = completion;
      }
      observation.pid = child.pid ?? null;
      const closed = new Promise((resolve, reject) => {child.once("error", reject); child.once("close", resolve);});
      child.stdin.end(code);
      const output = await result; observation.stdoutPid = Number(output.stdout);
      if (output.stderr !== "") throw Error("CONTROL_CHILD_STDERR_REFUSED");
      observation.status = await closed;
    }
  } catch (error) {
    observation.refused = true; observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.childFacts = fs.existsSync(childFacts) ? JSON.parse(fs.readFileSync(childFacts, "utf8")) : null;
  observation.getterReads = getterReads;
  observation.markerPresent = fs.existsSync(marker);
  observation.markerPid = observation.markerPresent ? Number(fs.readFileSync(marker, "utf8")) : null;
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function execFileLaunchControl(t, api, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-execfile-preload-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const marker = path.join(work, "executed"),
    program = path.join(work, "marker-child.cjs"),
    childFacts = path.join(work, "child-facts.json"),
    shellProgram = path.join(work, "marker-child.py");
  fs.writeFileSync(
    program,
    `require("node:fs").writeFileSync(${JSON.stringify(marker)}, String(process.pid), {mode:0o600, flag:"wx"}); require("node:fs").writeFileSync(${JSON.stringify(childFacts)}, JSON.stringify({pid:process.pid, execArgv:process.execArgv}), {mode:0o600, flag:"wx"}); process.stdout.write(String(process.pid)); if(process.connected) process.disconnect();\n`,
    { mode: 0o600, flag: "wx" },
  );
  fs.writeFileSync(
    shellProgram,
    'import os, sys\npid = str(os.getpid())\nfd = os.open(sys.argv[1], os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)\nwith os.fdopen(fd, "w") as marker:\n    marker.write(pid)\nsys.stdout.write(pid)\n',
    {
      mode: 0o600,
      flag: "wx",
    },
  );
  const target =
    mode === "longer-path" || mode === "changing-argv"
      ? path.join(work, "target-preload.cjs")
      : preload;
  if (mode === "longer-path" || mode === "changing-argv") {
    fs.copyFileSync(preload, target);
    fs.chmodSync(target, 0o600);
    fs.writeFileSync(target + ".decoy.cjs", "// inert longer-path control\n", {
      mode: 0o600,
      flag: "wx",
    });
  }
  const capture = "execfile-preload-" + api + "-" + mode;
  const parent = spawnSync(process.execPath, ["--eval", execFileLaunchSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(target),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_MODE: mode,
      TEST_PRELOAD_FILE: target,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_PROGRAM: program,
      TEST_CHILD_SHELL_PROGRAM: shellProgram,
      TEST_CHILD_FACTS: childFacts,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  assert.equal(parent.stderr, "");
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.exec-file-preload-control-evidence/v1",
      parentExit: parent.status,
      observation,
      records,
    }),
  );
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.equal(observation.api, api);
  assert.equal(observation.mode, mode);
  const healthy =
    ["execFile", "spawn", "spawnSync", "fork"].includes(api) &&
    [
      "inherited",
      "cli",
      "second-callback-ignored-options",
      "second-callback-env-ignored",
      "fourth-callback-env-ignored",
      "inherited-env-decoy",
      "esm-inherited",
      "promisify-inherited",
      "promisify-cli",
      "undefined-env",
      "null-env",
      "inherited-enumerable-env",
      "changing-options-env",
      "changing-node-options",
      "changing-env-value",
      "changing-argv",
      "explicit-exec-path",
      "inherited-eval",
      "changing-exec-path",
      "changing-exec-argv",
    ].includes(mode);
  if (mode.startsWith("changing-"))
    assert.equal(observation.getterReads, 1, "capture must evaluate the actual launch value once");
  if (healthy || mode === "non-node") {
    assert.equal(parent.status, 0);
    assert.equal(observation.refused, false);
    assert.equal(observation.status, 0);
    assert.equal(observation.markerPresent, true);
    assert.ok(Number.isSafeInteger(observation.stdoutPid) && observation.stdoutPid > 0);
    assert.equal(observation.markerPid, observation.stdoutPid);
    if (mode.startsWith("promisify-")) assert.equal(observation.promisifyChild, true);
    else if (api === "execFile") assert.equal(observation.callbackCalls, 1);
    if (mode === "non-node") {
      assert.equal(records.length, 1);
      assert.deepEqual(audit.expectedNodeChildren, []);
      if (api === "execFile") assert.equal(observation.pid, observation.stdoutPid);
    } else {
      assert.equal(observation.pid, observation.stdoutPid);
      assert.equal(observation.childFacts.pid, observation.pid);
      if (api === "fork" && mode === "inherited-eval")
        assert.deepEqual(
          observation.childFacts.execArgv,
          [],
          "the inherited eval pair must not recurse into the parent program",
        );
      assert.deepEqual(audit.expectedNodeChildren, [observation.pid]);
      assert.equal(records.length, 2);
      const child = records.find((record) => record.pid === observation.pid);
      assert.ok(child);
      assert.equal(child.parentPid, parent.pid);
      assert.deepEqual(child.expectedNodeChildren, []);
      const parentKernel = audit.kernelAncestry.find((row) => row.pid === parent.pid);
      const childParentKernel = child.kernelAncestry.find((row) => row.pid === parent.pid);
      assert.deepEqual(childParentKernel, parentKernel);
      assert.ok(
        child.kernelAncestry.some(
          (row) =>
            row.pid === child.pid &&
            row.parentPid === parent.pid &&
            /^[0-9]+$/.test(row.startTicks),
        ),
      );
    }
    for (const record of records) assert.equal(record.deniedAttempts, 0);
  } else {
    const enrolledSync =
      api === "execFileSync" && ["inherited", "cli", "inherited-env-decoy"].includes(mode);
    assert.equal(observation.refused, true, "refusal must happen before native exec-file dispatch");
    assert.equal(
      observation.errorCode,
      enrolledSync ? "TEST_NODE_CHILD_PID_CUSTODY_UNAVAILABLE" : "TEST_NODE_CHILD_PRELOAD_REQUIRED",
    );
    assert.equal(observation.surface, "child_process." + api);
    assert.equal(observation.pid, null);
    assert.equal(observation.stdoutPid, null);
    assert.equal(observation.markerPresent, false, "the inert Node child must never execute");
    assert.equal(observation.markerPid, null);
    assert.equal(observation.childFacts, null);
    assert.equal(observation.callbackCalls, 0);
    assert.equal(records.length, 1);
    assert.deepEqual(audit.expectedNodeChildren, []);
    assert.equal(audit.deniedAttempts, 1);
    assert.equal(parent.status, 97, "caught refusal still denies suite admission");
  }
}

for (const mode of [
  "missing",
  "options-only",
  "null-args",
  "undefined-args",
  "third-callback-env",
  "title-hint",
  "longer-path",
  "late-argv",
  "esm-missing",
  "promisify-missing",
  "inherited",
  "cli",
  "second-callback-ignored-options",
  "second-callback-env-ignored",
  "fourth-callback-env-ignored",
  "inherited-env-decoy",
  "esm-inherited",
  "promisify-inherited",
  "promisify-cli",
  "non-node",
  "undefined-env",
  "null-env",
  "inherited-enumerable-env",
  "nonenumerable-node-options",
  "changing-options-env",
  "changing-options-env-missing",
  "changing-node-options",
  "changing-node-options-missing",
  "changing-env-value",
  "changing-env-value-missing",
  "changing-argv",
  "changing-argv-missing",
]) {
  test(`direct execFile ${mode} retains the actual overload and audit boundary`, (t) =>
    execFileLaunchControl(t, "execFile", mode));
}
for (const mode of [
  "missing",
  "options-only",
  "null-args",
  "undefined-args",
  "title-hint",
  "longer-path",
  "late-argv",
  "inherited",
  "cli",
  "inherited-env-decoy",
  "non-node",
]) {
  test(`direct execFileSync ${mode} refuses unauditable Node dispatch or delegates non-Node`, (t) =>
    execFileLaunchControl(t, "execFileSync", mode));
}

for (const api of ["spawn", "spawnSync"]) {
  for (const mode of [
    "changing-options-env",
    "changing-options-env-missing",
    "changing-node-options",
    "changing-node-options-missing",
    "changing-env-value",
    "changing-env-value-missing",
    "changing-argv",
    "changing-argv-missing",
    "non-node",
  ]) {
    test(`direct ${api} ${mode} captures one actual launch view`, (t) =>
      execFileLaunchControl(t, api, mode));
  }
}
for (const mode of [
  "missing",
  "options-only",
  "null-args",
  "undefined-args",
  "inherited",
  "cli",
  "late-argv",
  "title-hint",
  "longer-path",
  "explicit-exec-path",
  "inherited-eval",
  "changing-exec-path",
  "changing-exec-argv",
  "changing-options-env",
  "changing-options-env-missing",
  "non-node",
]) {
  test(`direct fork ${mode} retains actual execPath execArgv and child audit custody`, (t) =>
    execFileLaunchControl(t, "fork", mode));
}

// Shell-backed direct Node launches cannot enroll the shell PID as a Node PID.
// Fork deliberately forces shell:false in native Node; its positive case must
// retain actual returned child/audit custody even when callers pass shell:true.
const shellLaunchSource = String.raw`
(async () => {
  const fs = require("node:fs"), cp = require("node:child_process");
  const api = process.env.TEST_CHILD_API, program = process.env.TEST_CHILD_PROGRAM;
  const marker = process.env.TEST_CHILD_MARKER, facts = process.env.TEST_CHILD_FACTS;
  const observation = {api, shell:true, refused:false, errorCode:null, surface:null, pid:null, status:null};
  const options = {shell:true, timeout:5000};
  try {
    if (api === "spawnSync") {
      const child = cp.spawnSync(process.execPath, [program], {...options, encoding:"utf8"});
      observation.pid = child.pid ?? null; observation.status = child.status;
      if (child.error) throw child.error;
    } else if (api === "spawn" || api === "execFile" || api === "fork") {
      let callbackResolve, callbackReject;
      const completion = new Promise((resolve, reject) => {callbackResolve = resolve; callbackReject = reject;});
      const child = api === "spawn" ? cp.spawn(process.execPath, [program], options)
        : api === "fork" ? cp.fork(program, [], {...options, silent:true, execArgv:[]})
        : cp.execFile(process.execPath, [program], options, (error, stdout, stderr) => {
          if (error) callbackReject(error); else callbackResolve({stdout, stderr});
        });
      observation.pid = child.pid ?? null;
      let stdout = "", stderr = "";
      child.stdout.on("data", chunk => {stdout += chunk;});
      child.stderr.on("data", chunk => {stderr += chunk;});
      observation.status = await new Promise((resolve, reject) => {child.once("error", reject); child.once("close", resolve);});
      if (api === "execFile") await completion;
      observation.stdout = stdout; observation.stderr = stderr;
    } else throw Error("CONTROL_API_REFUSED");
  } catch (error) {
    observation.refused = true; observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.markerPresent = fs.existsSync(marker);
  observation.markerPid = observation.markerPresent ? Number(fs.readFileSync(marker, "utf8")) : null;
  observation.childFacts = fs.existsSync(facts) ? JSON.parse(fs.readFileSync(facts, "utf8")) : null;
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function shellLaunchControl(t, api) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-node-shell-custody-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const marker = path.join(work, "executed"),
    program = path.join(work, "marker-child.cjs"),
    facts = path.join(work, "child-facts.json");
  fs.writeFileSync(
    program,
    `require("node:fs").writeFileSync(${JSON.stringify(marker)}, String(process.pid), {mode:0o600, flag:"wx"}); require("node:fs").writeFileSync(${JSON.stringify(facts)}, JSON.stringify({pid:process.pid, execArgv:process.execArgv}), {mode:0o600, flag:"wx"}); process.stdout.write(String(process.pid)); if(process.connected) process.disconnect();\n`,
    { mode: 0o600, flag: "wx" },
  );
  const capture = "node-shell-custody-" + api;
  const parent = spawnSync(process.execPath, ["--eval", shellLaunchSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(preload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_PROGRAM: program,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_FACTS: facts,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  // Retain actual predecessor warning text and marker/audit observations before
  // GREEN assertions; DEP0190 must not hide dispatch causality in real RED.
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.node-shell-custody-control-evidence/v1",
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
    }),
  );
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.equal(observation.api, api);
  assert.equal(observation.shell, true);
  assert.equal(
    parent.stderr,
    "",
    "qualified launch or pre-dispatch refusal emits no native shell warning",
  );
  if (api === "fork") {
    assert.equal(parent.status, 0);
    assert.equal(observation.refused, false);
    assert.equal(observation.status, 0);
    assert.equal(observation.markerPresent, true);
    assert.ok(Number.isSafeInteger(observation.pid) && observation.pid > 0);
    assert.equal(observation.markerPid, observation.pid);
    assert.equal(Number(observation.stdout), observation.pid);
    assert.equal(observation.stderr, "");
    assert.equal(observation.childFacts.pid, observation.pid);
    assert.deepEqual(observation.childFacts.execArgv, []);
    assert.deepEqual(audit.expectedNodeChildren, [observation.pid]);
    assert.equal(records.length, 2);
    const child = records.find((record) => record.pid === observation.pid);
    assert.ok(child);
    assert.equal(child.parentPid, parent.pid);
    assert.deepEqual(child.expectedNodeChildren, []);
    assert.deepEqual(
      child.kernelAncestry.find((row) => row.pid === parent.pid),
      audit.kernelAncestry.find((row) => row.pid === parent.pid),
    );
    assert.ok(
      child.kernelAncestry.some(
        (row) =>
          row.pid === child.pid && row.parentPid === parent.pid && /^[0-9]+$/.test(row.startTicks),
      ),
    );
    for (const record of records) assert.equal(record.deniedAttempts, 0);
  } else {
    assert.equal(
      observation.refused,
      true,
      "shell PID custody must be refused before actual dispatch",
    );
    assert.equal(observation.errorCode, "TEST_NODE_CHILD_SHELL_PID_CUSTODY_UNAVAILABLE");
    assert.equal(observation.surface, "child_process." + api);
    assert.equal(observation.pid, null);
    assert.equal(observation.status, null);
    assert.equal(observation.markerPresent, false);
    assert.equal(observation.markerPid, null);
    assert.equal(observation.childFacts, null);
    assert.equal(records.length, 1);
    assert.deepEqual(audit.expectedNodeChildren, []);
    assert.equal(audit.deniedAttempts, 1);
    assert.equal(parent.status, 97);
  }
}

for (const api of ["spawn", "spawnSync", "execFile", "fork"]) {
  test(`direct ${api} enrolled shell option preserves honest PID custody`, (t) =>
    shellLaunchControl(t, api));
}

// Shell execution cannot enroll arbitrary Node descendants. These actual
// marker-only controls retain the predecessor's dispatch/audit observations;
// no network call, model invocation or synthetic PID supplies causality.
const shellExecutionSource = String.raw`
(async () => {
  const fs = require("node:fs"), cp = require("node:child_process"), util = require("node:util");
  const api = process.env.TEST_CHILD_API, mode = process.env.TEST_CHILD_MODE;
  const program = process.env.TEST_CHILD_PROGRAM, marker = process.env.TEST_CHILD_MARKER;
  const facts = process.env.TEST_CHILD_FACTS;
  const command = mode === "non-node" ? "printf inert-non-node-shell" : "node " + JSON.stringify(program);
  const options = mode === "stripped" ? {env:{PATH:process.env.PATH}, timeout:5000} : {timeout:5000};
  const observation = {api, mode, refused:false, errorCode:null, surface:null,
    commandPid:null, stdout:null, callbackCalled:false};
  try {
    const esm = api.startsWith("esm-") ? await import("node:child_process") : null;
    if (api === "execSync" || api === "esm-execSync") {
      observation.stdout = (api === "execSync" ? cp.execSync : esm.execSync)(command, {...options, encoding:"utf8"});
    } else if (api === "promisify-exec") {
      const pending = util.promisify(cp.exec)(command, options);
      observation.commandPid = pending.child?.pid ?? null;
      observation.stdout = (await pending).stdout;
    } else {
      const call = api === "esm-exec" ? esm.exec : cp.exec;
      let complete, reject;
      const done = new Promise((resolve, refuse) => {complete = resolve; reject = refuse;});
      const child = call(command, options, (error, stdout) => {
        observation.callbackCalled = true;
        if (error) reject(error); else complete(stdout);
      });
      observation.commandPid = child.pid ?? null;
      observation.stdout = await done;
    }
  } catch (error) {
    observation.refused = true; observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.markerPresent = fs.existsSync(marker);
  observation.childFacts = fs.existsSync(facts) ? JSON.parse(fs.readFileSync(facts, "utf8")) : null;
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function shellExecutionControl(t, api, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-shell-execution-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const program = path.join(work, "marker-child.cjs"),
    marker = path.join(work, "executed"),
    facts = path.join(work, "child-facts.json");
  fs.writeFileSync(
    program,
    `const fs = require("node:fs"); fs.writeFileSync(${JSON.stringify(marker)}, String(process.pid), {mode:0o600, flag:"wx"}); fs.writeFileSync(${JSON.stringify(facts)}, JSON.stringify({pid:process.pid,parentPid:process.ppid,execArgv:process.execArgv}), {mode:0o600,flag:"wx"}); process.stdout.write(String(process.pid));\n`,
    { mode: 0o600, flag: "wx" },
  );
  const capture = "shell-execution-" + api + "-" + mode;
  const parent = spawnSync(process.execPath, ["--eval", shellExecutionSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(preload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_MODE: mode,
      TEST_CHILD_PROGRAM: program,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_FACTS: facts,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.shell-execution-control-evidence/v1",
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
    }),
  );
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.equal(observation.api, api);
  assert.equal(observation.mode, mode);
  assert.equal(parent.stderr, "");
  assert.equal(
    observation.refused,
    true,
    "unsupported shell API must refuse before native dispatch",
  );
  assert.equal(observation.errorCode, "TEST_SHELL_CHILD_PID_CUSTODY_UNAVAILABLE");
  assert.equal(
    observation.surface,
    api.endsWith("execSync") ? "child_process.execSync" : "child_process.exec",
  );
  assert.equal(observation.commandPid, null);
  assert.equal(observation.stdout, null);
  assert.equal(observation.callbackCalled, false);
  assert.equal(observation.markerPresent, false);
  assert.equal(observation.childFacts, null);
  assert.equal(records.length, 1);
  assert.deepEqual(audit.expectedNodeChildren, []);
  assert.equal(audit.deniedAttempts, 1);
  assert.equal(parent.status, 97);
}

for (const api of ["exec", "execSync", "promisify-exec", "esm-exec", "esm-execSync"]) {
  for (const mode of ["stripped", "inherited"]) {
    test(`shell ${api} ${mode} refuses before untracked Node dispatch`, (t) =>
      shellExecutionControl(t, api, mode));
  }
}
for (const api of ["exec", "execSync"]) {
  test(`shell ${api} non-Node text is deliberately outside supported PID custody`, (t) =>
    shellExecutionControl(t, api, "non-node"));
}

// Explicit Unix shell/env launchers and Worker isolates cannot establish the gate's
// PID-only audit custody. Every predecessor payload below only writes owned
// marker/fact files; it has no network operations or credential-bearing input.
const unsupportedLaunchSource = String.raw`
(async () => {
  const fs = require("node:fs"), cp = require("node:child_process");
  const api = process.env.TEST_CHILD_API, launcher = process.env.TEST_CHILD_LAUNCHER;
  const mode = process.env.TEST_CHILD_MODE, program = process.env.TEST_CHILD_PROGRAM;
  const marker = process.env.TEST_CHILD_MARKER, facts = process.env.TEST_CHILD_FACTS;
  const observation = {api, launcher, mode, refused:false, errorCode:null, surface:null,
    commandPid:null, threadId:null, stdout:null, status:null, callbackCalled:false,
    esmBindingSame:null, innerMessage:null, innerStderr:""};
  const options = mode === "stripped" ? {env:{PATH:process.env.PATH}, timeout:5000} : {timeout:5000};
  try {
    if (launcher === "Worker") {
      const threads = require("node:worker_threads");
      const esm = api === "esm-Worker" ? await import("node:worker_threads") : null;
      if (esm) observation.esmBindingSame = esm.Worker === threads.Worker;
      const constructor = esm ? esm.Worker : threads.Worker;
      const workerOptions = {execArgv:[], workerData:{marker, facts}, stdout:true, stderr:true};
      if (mode === "stripped") workerOptions.env = {PATH:process.env.PATH};
      const worker = new constructor(program, workerOptions);
      observation.threadId = worker.threadId;
      worker.stderr.on("data", chunk => {observation.innerStderr += chunk;});
      worker.on("message", message => {observation.innerMessage = message;});
      observation.status = await new Promise((resolve, reject) => {
        worker.once("error", reject); worker.once("exit", resolve);
      });
    } else {
      const shellLauncher = launcher !== "env";
      const command = process.env.TEST_CHILD_COMMAND;
      const args = shellLauncher ? ["-c", 'node "$1"', "marker-control", program] : ["node", program];
      if (api === "spawnSync") {
        const child = cp.spawnSync(command, args, {...options, encoding:"utf8"});
        if (child.error) throw child.error;
        observation.commandPid = child.pid ?? null;
        observation.status = child.status; observation.stdout = child.stdout;
        observation.innerStderr = child.stderr;
      } else if (api === "execFileSync") {
        observation.stdout = cp.execFileSync(command, args, {...options, encoding:"utf8"});
        observation.status = 0;
      } else {
        let complete, reject;
        const done = new Promise((resolve, refuse) => {complete = resolve; reject = refuse;});
        const child = api === "fork" ? cp.fork(program, [], {...options, silent:true, execPath:command,
          execArgv:shellLauncher ? ["-c", 'node "$1"', "marker-control"] : ["node"]})
          : api === "spawn" ? cp.spawn(command, args, options)
          : cp.execFile(command, args, {...options, encoding:"utf8"}, (error, stdout, stderr) => {
            observation.callbackCalled = true; observation.stdout = stdout;
            observation.innerStderr = stderr; if (error) reject(error);
          });
        observation.commandPid = child.pid ?? null;
        if (api !== "execFile") {
          observation.stdout = "";
          child.stdout.on("data", chunk => {observation.stdout += chunk;});
          child.stderr.on("data", chunk => {observation.innerStderr += chunk;});
        }
        child.once("error", reject);
        child.once("close", status => {observation.status = status; complete();});
        await done;
      }
    }
  } catch (error) {
    observation.refused = true; observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.markerPresent = fs.existsSync(marker);
  observation.childFacts = fs.existsSync(facts) ? JSON.parse(fs.readFileSync(facts, "utf8")) : null;
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function unsupportedLaunchControl(t, api, launcher, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-unsupported-launch-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const program = path.join(work, launcher === "Worker" ? "marker-worker.cjs" : "marker-child.cjs"),
    marker = path.join(work, "executed"),
    facts = path.join(work, "child-facts.json");
  const payload =
    launcher === "Worker"
      ? `const fs = require("node:fs"), threads = require("node:worker_threads"); const {marker,facts} = threads.workerData; fs.writeFileSync(marker, String(process.pid), {mode:0o600,flag:"wx"}); fs.writeFileSync(facts, JSON.stringify({pid:process.pid,parentPid:process.ppid,threadId:threads.threadId,isMainThread:threads.isMainThread}), {mode:0o600,flag:"wx"}); threads.parentPort.postMessage({pid:process.pid,threadId:threads.threadId});\n`
      : `const fs = require("node:fs"); fs.writeFileSync(${JSON.stringify(marker)}, String(process.pid), {mode:0o600,flag:"wx"}); fs.writeFileSync(${JSON.stringify(facts)}, JSON.stringify({pid:process.pid,parentPid:process.ppid,execArgv:process.execArgv}), {mode:0o600,flag:"wx"}); process.stdout.write(String(process.pid)); if(process.connected) process.disconnect();\n`;
  fs.writeFileSync(program, payload, { mode: 0o600, flag: "wx" });
  // Existing sh/env controls keep their actual executable coordinates. New
  // bash/dash controls execute installed shells; absent shell names use owned
  // aliases to the actual /bin/sh executable. This proves basename refusal, not
  // availability or behavior of an uninstalled shell implementation.
  const command =
    launcher === "Worker"
      ? ""
      : launcher === "env"
        ? "/usr/bin/env"
        : launcher === "sh"
          ? "/bin/sh"
          : path.join(work, launcher);
  if (!["Worker", "sh", "env"].includes(launcher)) {
    const installed = ["bash", "dash"].includes(launcher) ? "/bin/" + launcher : "/bin/sh";
    assert.ok(fs.statSync(installed).isFile(), "the causal launcher must be a real executable");
    fs.symlinkSync(installed, command);
  }
  const capture = "unsupported-" + api + "-" + launcher + "-" + mode;
  const parent = spawnSync(process.execPath, ["--eval", unsupportedLaunchSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(preload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_LAUNCHER: launcher,
      TEST_CHILD_COMMAND: command,
      TEST_CHILD_MODE: mode,
      TEST_CHILD_PROGRAM: program,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_FACTS: facts,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  // The inherited predecessor Worker may run the marker before its same-PID
  // audit collides. Preserve actual marker, thread and stderr evidence first;
  // that later audit collision is not a pre-launch refusal or a healthy pass.
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.unsupported-launch-control-evidence/v1",
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
    }),
  );
  assert.equal(observation.api, api);
  assert.equal(observation.launcher, launcher);
  assert.equal(observation.mode, mode);
  if (api === "esm-Worker") assert.equal(observation.esmBindingSame, true);
  assert.equal(
    observation.refused,
    true,
    "unsupported launcher must refuse before its inert payload runs",
  );
  assert.equal(
    observation.errorCode,
    launcher === "Worker"
      ? "TEST_WORKER_AUDIT_CUSTODY_UNAVAILABLE"
      : "TEST_INDIRECT_NODE_PID_CUSTODY_UNAVAILABLE",
  );
  assert.equal(
    observation.surface,
    launcher === "Worker" ? "worker_threads.Worker" : "child_process." + api,
  );
  assert.equal(observation.commandPid, null);
  assert.equal(observation.threadId, null);
  assert.equal(observation.stdout, null);
  assert.equal(observation.status, null);
  assert.equal(observation.callbackCalled, false);
  assert.equal(observation.innerMessage, null);
  assert.equal(observation.innerStderr, "");
  assert.equal(observation.markerPresent, false);
  assert.equal(observation.childFacts, null);
  assert.equal(parent.stderr, "");
  assert.equal(records.length, 1);
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.deepEqual(audit.expectedNodeChildren, []);
  assert.equal(audit.deniedAttempts, 1);
  assert.equal(parent.status, 97);
}

for (const api of ["spawn", "spawnSync", "execFile", "execFileSync", "fork"]) {
  for (const launcher of ["sh", "env"]) {
    for (const mode of ["stripped", "inherited"]) {
      test(`indirect launcher ${api} ${launcher} ${mode} refuses before unaudited Node payload`, (t) =>
        unsupportedLaunchControl(t, api, launcher, mode));
    }
  }
}
// Preserve all existing sh/env/fork controls and add every newly refused
// shell basename on each requested public direct process surface. Stripped
// environments expose the predecessor gap using inert marker/fact payloads;
// inherited environments exercise the same pre-dispatch refusal boundary.
for (const api of ["spawn", "spawnSync", "execFile", "execFileSync"]) {
  for (const launcher of [
    "bash",
    "dash",
    "ash",
    "zsh",
    "ksh",
    "ksh93",
    "mksh",
    "pdksh",
    "yash",
    "fish",
    "csh",
    "tcsh",
    "rbash",
    "rksh",
    "rzsh",
  ]) {
    for (const mode of ["stripped", "inherited"]) {
      test(`indirect launcher ${api} ${launcher} ${mode} refuses before unaudited Node payload`, (t) =>
        unsupportedLaunchControl(t, api, launcher, mode));
    }
  }
}
for (const api of ["Worker", "esm-Worker"]) {
  for (const mode of ["stripped", "inherited"]) {
    test(`Worker construction ${api} ${mode} refuses before unaudited isolate payload`, (t) =>
      unsupportedLaunchControl(t, api, "Worker", mode));
  }
}

// Shell selection on a non-Node command uses the same lexical launcher edge.
// Getters must be captured once: probing false then passing live options would
// allow a second true read to execute the owned Node marker through a shell.
const nonNodeShellOptionSource = String.raw`
(async () => {
  const fs = require("node:fs"), cp = require("node:child_process");
  const api = process.env.TEST_CHILD_API, mode = process.env.TEST_CHILD_MODE;
  const program = process.env.TEST_CHILD_PROGRAM, marker = process.env.TEST_CHILD_MARKER;
  const facts = process.env.TEST_CHILD_FACTS;
  const command = "node " + JSON.stringify(program);
  let getterReads = 0;
  const options = {shell:true, timeout:5000, encoding:"utf8"};
  if (mode !== "inherited") options.env = {PATH:process.env.PATH};
  if (mode.startsWith("getter-")) Object.defineProperty(options, "shell", {
    enumerable:true,
    get() {getterReads += 1; return mode === "getter-allow-shell" ? getterReads === 1 : getterReads !== 1;},
  });
  const observation = {api, mode, refused:false, errorCode:null, surface:null,
    commandPid:null, stdout:null, status:null, callbackCalled:false, innerStderr:""};
  try {
    if (api === "spawnSync") {
      const child = cp.spawnSync(command, [], options);
      if (child.error) throw child.error;
      observation.commandPid = child.pid ?? null;
      observation.stdout = child.stdout; observation.status = child.status;
      observation.innerStderr = child.stderr;
    } else if (api === "execFileSync") {
      observation.stdout = cp.execFileSync(command, [], options);
      observation.status = 0;
    } else {
      let complete, reject;
      const done = new Promise((resolve, refuse) => {complete = resolve; reject = refuse;});
      const child = api === "spawn" ? cp.spawn(command, [], options)
        : cp.execFile(command, [], options, (error, stdout, stderr) => {
          observation.callbackCalled = true; observation.stdout = stdout;
          observation.innerStderr = stderr; if (error) reject(error);
        });
      observation.commandPid = child.pid ?? null;
      if (api === "spawn") {
        observation.stdout = "";
        child.stdout.on("data", chunk => {observation.stdout += chunk;});
        child.stderr.on("data", chunk => {observation.innerStderr += chunk;});
      }
      child.once("error", reject);
      child.once("close", status => {observation.status = status; complete();});
      await done;
    }
  } catch (error) {
    observation.refused = true; observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.getterReads = getterReads;
  observation.markerPresent = fs.existsSync(marker);
  observation.childFacts = fs.existsSync(facts) ? JSON.parse(fs.readFileSync(facts, "utf8")) : null;
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function nonNodeShellOptionControl(t, api, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-non-node-shell-option-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const program = path.join(work, "marker-child.cjs"),
    marker = path.join(work, "executed"),
    facts = path.join(work, "child-facts.json");
  fs.writeFileSync(
    program,
    `const fs = require("node:fs"); fs.writeFileSync(${JSON.stringify(marker)}, String(process.pid), {mode:0o600,flag:"wx"}); fs.writeFileSync(${JSON.stringify(facts)}, JSON.stringify({pid:process.pid,parentPid:process.ppid,execArgv:process.execArgv}), {mode:0o600,flag:"wx"}); process.stdout.write(String(process.pid));\n`,
    { mode: 0o600, flag: "wx" },
  );
  const capture = "non-node-shell-" + api + "-" + mode;
  const parent = spawnSync(process.execPath, ["--eval", nonNodeShellOptionSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(preload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_MODE: mode,
      TEST_CHILD_PROGRAM: program,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_FACTS: facts,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.non-node-shell-option-control-evidence/v1",
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
    }),
  );
  assert.equal(observation.api, api);
  assert.equal(observation.mode, mode);
  assert.equal(
    observation.getterReads,
    mode.startsWith("getter-") ? 1 : 0,
    "guard and native dispatch must consume one effective shell value",
  );
  assert.equal(observation.refused, true);
  assert.equal(observation.markerPresent, false);
  assert.equal(observation.childFacts, null);
  assert.equal(parent.stderr, "");
  assert.equal(records.length, 1);
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.deepEqual(audit.expectedNodeChildren, []);
  if (mode === "getter-no-shell") {
    // With the captured shell:false, this compound text is an ordinary absent
    // executable. A second true read would run the real Node marker instead.
    assert.equal(observation.errorCode, "ENOENT");
    assert.equal(observation.surface, null);
    assert.equal(audit.deniedAttempts, 0);
    assert.equal(parent.status, 0);
  } else {
    assert.equal(observation.errorCode, "TEST_SHELL_CHILD_PID_CUSTODY_UNAVAILABLE");
    assert.equal(observation.surface, "child_process." + api);
    assert.equal(observation.commandPid, null);
    assert.equal(observation.stdout, null);
    assert.equal(observation.status, null);
    assert.equal(observation.callbackCalled, false);
    assert.equal(observation.innerStderr, "");
    assert.equal(audit.deniedAttempts, 1);
    assert.equal(parent.status, 97);
  }
}

for (const api of ["spawn", "spawnSync", "execFile", "execFileSync"]) {
  for (const mode of ["stripped", "inherited", "getter-allow-shell", "getter-no-shell"]) {
    test(`public shell option ${api} ${mode} consumes stable custody before dispatch`, (t) =>
      nonNodeShellOptionControl(t, api, mode));
  }
}

// Constructor reflection is a public API path, not an arbitrary native handle.
// A subclass replacement would expose its native Worker superclass. These real
// inert controls exercise prototype/superclass constructor paths and prove the
// standalone replacement has no native Worker reference in those chains.
const workerConstructorSource = String.raw`
(async () => {
  const fs = require("node:fs"), threads = require("node:worker_threads");
  const api = process.env.TEST_CHILD_API, mode = process.env.TEST_CHILD_MODE;
  const program = process.env.TEST_CHILD_PROGRAM, marker = process.env.TEST_CHILD_MARKER;
  const facts = process.env.TEST_CHILD_FACTS;
  const esm = api.startsWith("esm-") ? await import("node:worker_threads") : null;
  const Worker = esm ? esm.Worker : threads.Worker;
  const superclass = Object.getPrototypeOf(Worker);
  const prototypeConstructor = Worker.prototype.constructor;
  const superPath = api.endsWith("superclass");
  const parentPrototypeConstructor = Object.getPrototypeOf(Worker.prototype).constructor;
  const parentPrototypePath = api.endsWith("parent-prototype-constructor");
  const selected = superPath ? superclass : parentPrototypePath ? parentPrototypeConstructor : prototypeConstructor;
  const observation = {api, mode, superclassIsFunctionPrototype:superclass === Function.prototype,
    prototypeIsObjectPrototype:Object.getPrototypeOf(Worker.prototype) === Object.prototype,
    prototypeConstructorSame:prototypeConstructor === Worker,
    parentPrototypeConstructorIsObject:parentPrototypeConstructor === Object,
    esmBindingSame:esm ? esm.Worker === threads.Worker : null,
    refused:false, errorName:null, errorCode:null, surface:null, threadId:null, status:null,
    constructedNonWorker:false, innerStderr:""};
  const options = {execArgv:[], workerData:{marker,facts}, stdout:true, stderr:true};
  if (mode === "stripped") options.env = {PATH:process.env.PATH};
  try {
    const worker = Reflect.construct(selected, [program, options]);
    if (Number.isSafeInteger(worker.threadId) && worker.threadId > 0) {
      observation.threadId = worker.threadId;
      worker.stderr.on("data", chunk => {observation.innerStderr += chunk;});
      observation.status = await new Promise((resolve, reject) => {
        worker.once("error", reject); worker.once("exit", resolve);
      });
    } else observation.constructedNonWorker = true;
  } catch (error) {
    observation.refused = true; observation.errorName = error.name ?? null;
    observation.errorCode = error.code ?? null; observation.surface = error.surface ?? null;
  }
  observation.markerPresent = fs.existsSync(marker);
  observation.childFacts = fs.existsSync(facts) ? JSON.parse(fs.readFileSync(facts,"utf8")) : null;
  console.log(JSON.stringify(observation));
})().catch(error => {console.error(error); process.exitCode = 1;});
`;

function workerConstructorControl(t, api, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-worker-constructor-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const program = path.join(work, "marker-worker.cjs"),
    marker = path.join(work, "executed"),
    facts = path.join(work, "worker-facts.json");
  fs.writeFileSync(
    program,
    'const fs=require("node:fs"),threads=require("node:worker_threads");const {marker,facts}=threads.workerData;fs.writeFileSync(marker,String(process.pid),{mode:0o600,flag:"wx"});fs.writeFileSync(facts,JSON.stringify({pid:process.pid,parentPid:process.ppid,threadId:threads.threadId,isMainThread:threads.isMainThread}),{mode:0o600,flag:"wx"});\n',
    { mode: 0o600, flag: "wx" },
  );
  const capture = "worker-constructor-" + api + "-" + mode;
  const parent = spawnSync(process.execPath, ["--eval", workerConstructorSource], {
    cwd: work,
    env: {
      PATH: path.dirname(process.execPath),
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(preload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      TEST_CHILD_API: api,
      TEST_CHILD_MODE: mode,
      TEST_CHILD_PROGRAM: program,
      TEST_CHILD_MARKER: marker,
      TEST_CHILD_FACTS: facts,
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.worker-constructor-control-evidence/v1",
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
    }),
  );
  assert.equal(observation.api, api);
  assert.equal(observation.mode, mode);
  if (api.startsWith("esm-")) assert.equal(observation.esmBindingSame, true);
  assert.equal(
    observation.superclassIsFunctionPrototype,
    true,
    "replacement must expose no native Worker superclass",
  );
  assert.equal(
    observation.prototypeIsObjectPrototype,
    true,
    "replacement prototype must not retain native Worker ancestry",
  );
  assert.equal(
    observation.prototypeConstructorSame,
    true,
    "prototype constructor must name the same refusal replacement",
  );
  assert.equal(
    observation.parentPrototypeConstructorIsObject,
    true,
    "inherited prototype constructor must be ordinary Object, never native Worker",
  );
  assert.equal(observation.refused, !api.endsWith("parent-prototype-constructor"));
  assert.equal(observation.threadId, null);
  assert.equal(observation.status, null);
  assert.equal(observation.constructedNonWorker, api.endsWith("parent-prototype-constructor"));
  assert.equal(observation.innerStderr, "");
  assert.equal(observation.markerPresent, false);
  assert.equal(observation.childFacts, null);
  assert.equal(parent.stderr, "");
  assert.equal(records.length, 1);
  const audit = records.find((record) => record.pid === parent.pid);
  assert.ok(audit);
  assert.equal(audit.parentPid, process.pid);
  assert.deepEqual(audit.expectedNodeChildren, []);
  if (api.endsWith("parent-prototype-constructor")) {
    // Ordinary Object construction returns no Worker. This is reference
    // absence, not a manufactured denial or a native Worker admission.
    assert.equal(observation.errorName, null);
    assert.equal(observation.errorCode, null);
    assert.equal(observation.surface, null);
    assert.equal(audit.deniedAttempts, 0);
    assert.equal(parent.status, 0);
  } else if (api.endsWith("superclass")) {
    // Function.prototype is not a constructor. This proves reference absence,
    // not a counted Worker denial or a promised predecessor-marker RED row.
    assert.equal(observation.errorName, "TypeError");
    assert.equal(observation.errorCode, null);
    assert.equal(observation.surface, null);
    assert.equal(audit.deniedAttempts, 0);
    assert.equal(parent.status, 0);
  } else {
    assert.equal(observation.errorCode, "TEST_WORKER_AUDIT_CUSTODY_UNAVAILABLE");
    assert.equal(observation.surface, "worker_threads.Worker");
    assert.equal(audit.deniedAttempts, 1);
    assert.equal(parent.status, 97);
  }
}

for (const api of [
  "prototype-constructor",
  "esm-prototype-constructor",
  "superclass",
  "esm-superclass",
  "parent-prototype-constructor",
  "esm-parent-prototype-constructor",
]) {
  for (const mode of ["stripped", "inherited"]) {
    test(`Worker constructor reference ${api} ${mode} has no public native escape`, (t) =>
      workerConstructorControl(t, api, mode));
  }
}

// Original arguments must reach native validation before snapshotting invalid
// option types into apparently valid objects. Compare actual native errors;
// both guarded and reference payloads remain owned inert Python markers.
const originalOptionsSource = String.raw`
(async () => {
  const fs=require("node:fs"),cp=require("node:child_process");
  const api=process.env.TEST_CHILD_API,mode=process.env.TEST_CHILD_MODE;
  const program=process.env.TEST_CHILD_PROGRAM,marker=process.env.TEST_CHILD_MARKER,facts=process.env.TEST_CHILD_FACTS;
  const observation={api,mode,observerPid:process.pid,error:null,commandPid:null,stdoutPid:null,status:null,callbackCalls:0};
  let complete,reject;const done=new Promise((resolve,refuse)=>{complete=resolve;reject=refuse;});
  function optionsCallback(error,stdout){observation.callbackCalls+=1;if(error)reject(error);else observation.stdoutPid=Number(stdout);}
  const options=mode==="string"?"bad":mode==="number"?42:mode==="array"?[]:mode==="null"?null:optionsCallback;
  if(mode==="function-accepted")optionsCallback.env={PATH:process.env.PATH};
  const command="/usr/bin/python3",args=[program,marker,facts];
  try{
    if(api==="spawnSync"){
      const child=cp.spawnSync(command,args,options);if(child.error)throw child.error;
      observation.commandPid=child.pid??null;observation.stdoutPid=Number(child.stdout);observation.status=child.status;
    }else if(api==="execFileSync"){
      observation.stdoutPid=Number(cp.execFileSync(command,args,options));observation.status=0;
    }else{
      const child=api==="spawn"?cp.spawn(command,args,options)
        :mode==="function-accepted"?cp.execFile(command,args,options)
        :cp.execFile(command,args,options,optionsCallback);
      observation.commandPid=child.pid??null;
      if(api==="spawn"){let stdout="";child.stdout.on("data",chunk=>{stdout+=chunk;});child.once("close",()=>{observation.stdoutPid=Number(stdout);});}
      child.once("error",reject);child.once("close",status=>{observation.status=status;complete();});await done;
    }
  }catch(error){observation.error={name:error.name??null,code:error.code??null,message:error.message??null};}
  observation.markerPresent=fs.existsSync(marker);
  observation.childFacts=fs.existsSync(facts)?JSON.parse(fs.readFileSync(facts,"utf8")):null;
  console.log(JSON.stringify(observation));
})().catch(error=>{console.error(error);process.exitCode=1;});
`;

function originalOptionsRun(t, api, mode, guarded) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-original-options-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const program = path.join(work, "marker.py"),
    marker = path.join(work, "executed"),
    facts = path.join(work, "facts.json");
  fs.writeFileSync(
    program,
    'import os,sys,json\npid=os.getpid()\nfd=os.open(sys.argv[1],os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)\nwith os.fdopen(fd,"w") as out: out.write(str(pid))\nfd=os.open(sys.argv[2],os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)\nwith os.fdopen(fd,"w") as out: json.dump({"pid":pid,"parentPid":os.getppid()},out)\nsys.stdout.write(str(pid))\n',
    { mode: 0o600, flag: "wx" },
  );
  const capture = "original-options-" + api + "-" + mode;
  const environment = {
    PATH: path.dirname(process.execPath),
    HOME: home,
    TMPDIR: temporary,
    XDG_CONFIG_HOME: path.join(home, ".config"),
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    TZ: "UTC",
    TEST_CHILD_API: api,
    TEST_CHILD_MODE: mode,
    TEST_CHILD_PROGRAM: program,
    TEST_CHILD_MARKER: marker,
    TEST_CHILD_FACTS: facts,
  };
  if (guarded)
    Object.assign(environment, {
      NODE_OPTIONS: "--require " + JSON.stringify(preload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
    });
  const parent = spawnSync(process.execPath, ["--eval", originalOptionsSource], {
    cwd: work,
    env: environment,
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const lines = parent.stdout.trim().split("\n");
  assert.equal(lines.length, 1, parent.stdout + parent.stderr);
  const observation = JSON.parse(lines[0]);
  const records = fs.readdirSync(auditDirectory).map((name) => {
    const file = path.join(auditDirectory, name),
      info = fs.lstatSync(file);
    assert.ok(info.isFile() && !info.isSymbolicLink());
    assert.equal(info.mode & 0o777, 0o600);
    assert.equal(info.uid, process.getuid());
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(name, `${record.pid}.json`);
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
    assert.ok(
      record.kernelAncestry.some(
        (row) =>
          row.pid === parent.pid &&
          row.parentPid === process.pid &&
          /^[0-9]+$/.test(row.startTicks),
      ),
    );
    return record;
  });
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.original-options-control-evidence/v1",
      guarded,
      parentPid: parent.pid,
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
    }),
  );
  assert.equal(parent.stderr, "");
  assert.equal(parent.status, 0);
  assert.equal(observation.api, api);
  assert.equal(observation.mode, mode);
  if (guarded) {
    assert.equal(records.length, 1);
    const audit = records.find((record) => record.pid === parent.pid);
    assert.ok(audit);
    assert.equal(audit.parentPid, process.pid);
    assert.deepEqual(audit.expectedNodeChildren, []);
    assert.equal(
      audit.deniedAttempts,
      0,
      "ordinary native argument validation is not a network denial",
    );
  } else
    assert.deepEqual(records, [], "native reference has no installed preload or fabricated audit");
  return observation;
}

function originalOptionsControl(t, api, mode, accepted = false) {
  const native = originalOptionsRun(t, api, mode, false),
    guarded = originalOptionsRun(t, api, mode, true);
  assert.deepEqual(
    guarded.error,
    native.error,
    "retain the exact native selected-options error, not a fabricated diagnostic",
  );
  if (accepted) {
    for (const observation of [native, guarded]) {
      assert.equal(observation.error, null);
      assert.equal(observation.markerPresent, true);
      assert.ok(Number.isSafeInteger(observation.stdoutPid) && observation.stdoutPid > 0);
      assert.equal(observation.childFacts.pid, observation.stdoutPid);
      assert.equal(observation.childFacts.parentPid, observation.observerPid);
      if (api !== "execFileSync") assert.equal(observation.commandPid, observation.stdoutPid);
      assert.equal(observation.status, 0);
      if (api === "execFile") assert.equal(observation.callbackCalls, 1);
    }
  } else {
    for (const observation of [native, guarded]) {
      assert.equal(observation.error?.name, "TypeError");
      assert.equal(observation.error?.code, "ERR_INVALID_ARG_TYPE");
      assert.match(observation.error.message, /"options" argument/);
      assert.equal(observation.markerPresent, false);
      assert.equal(observation.childFacts, null);
      assert.equal(observation.commandPid, null);
      assert.equal(observation.stdoutPid, null);
      assert.equal(observation.status, null);
      assert.equal(observation.callbackCalls, 0);
    }
  }
}

for (const api of ["spawn", "spawnSync", "execFile", "execFileSync"]) {
  for (const mode of ["string", "number", "array"]) {
    test(`original selected options ${api} ${mode} preserves native validation before marker`, (t) =>
      originalOptionsControl(t, api, mode));
  }
}
for (const api of ["spawn", "spawnSync"]) {
  for (const mode of ["null", "function"]) {
    test(`original selected options ${api} ${mode} preserves nonnullable object validation`, (t) =>
      originalOptionsControl(t, api, mode));
  }
}
test("original selected options execFileSync function retains downstream native validation", (t) =>
  originalOptionsControl(t, "execFileSync", "function"));
for (const api of ["execFile", "execFileSync"]) {
  test(`original selected options ${api} null retains native accepted marker behavior`, (t) =>
    originalOptionsControl(t, api, "null", true));
}
test("original selected options execFile function retains callback and own environment", (t) =>
  originalOptionsControl(t, "execFile", "function-accepted", true));

// Current-a58 causal successor controls: actual executable aliases, ordered
// preloads and local TCP/HTTP listeners. No model or external connection.
async function aliasInner(config) {
  const cp = require("node:child_process");
  let pathReads = 0,
    cwdReads = 0,
    cwdCoercions = 0;
  const environment = { ...process.env };
  if (config.mode === "missing") delete environment.NODE_OPTIONS;
  let command = config.alias;
  const options = { env: environment, cwd: config.cwd, encoding: "utf8", timeout: 5000 };
  if (config.locator === "relative") command = "./owned-runtime";
  if (config.locator === "path" || config.locator === "getters" || config.locator === "shadow") {
    command = "owned-runtime";
    environment.PATH =
      config.locator === "shadow" ? config.shadowDirectory + ":" + config.cwd : config.cwd;
  }
  if (config.locator === "getters") {
    Object.defineProperty(environment, "PATH", {
      enumerable: true,
      get() {
        pathReads += 1;
        return pathReads === 1 ? config.cwd : "/missing-second-PATH";
      },
    });
    Object.defineProperty(options, "cwd", {
      enumerable: true,
      get() {
        cwdReads += 1;
        return cwdReads === 1 ? config.cwd : "/missing-second-cwd";
      },
    });
  } else if (config.locator === "url-cwd")
    options.cwd = require("node:url").pathToFileURL(config.cwd + "/");
  else if (config.locator === "buffer-cwd") options.cwd = Buffer.from(config.cwd);
  else if (config.locator === "default-path") {
    command = "owned-runtime";
    delete environment.PATH;
  }
  if (config.locator === "absolute-parent") command = config.cwd + "/link/../parent-runtime";
  else if (config.locator === "relative-parent") command = "./link/../parent-runtime";
  else if (config.locator === "path-parent") {
    command = "parent-runtime";
    environment.PATH = "link/..";
  } else if (config.locator === "cwd-parent") {
    command = "./parent-runtime";
    options.cwd = config.cwd + "/link/..";
  } else if (config.locator === "buffer-relative" || config.locator === "buffer-path") {
    options.cwd = Buffer.from(config.decoyDirectory);
    command = config.locator === "buffer-path" ? "owned-runtime" : "./owned-runtime";
    environment.PATH = ".";
  } else if (config.locator === "empty-relative" || config.locator === "empty-path") {
    options.cwd = "";
    command = config.locator === "empty-path" ? "owned-runtime" : "./owned-runtime";
    environment.PATH = ".";
  } else if (config.locator === "sync-empty") {
    command = "./owned-runtime";
    options.cwd = "";
  } else if (config.locator === "sync-custom") {
    command = "./owned-runtime";
    options.cwd = Buffer.from(config.cwd);
    Object.defineProperty(options.cwd, Symbol.toPrimitive, {
      value: () => {
        cwdCoercions += 1;
        return cwdCoercions === 1 ? config.cwd : config.decoyDirectory;
      },
    });
  } else if (config.locator === "sync-byte-string") {
    command = "./parent-runtime";
    options.cwd = new Uint8Array([115]);
  } else if (config.locator === "sync-raw-null") {
    options.cwd = Buffer.from([0]);
    Object.defineProperty(options.cwd, Symbol.toPrimitive, {
      value: () => {
        cwdCoercions += 1;
        return config.cwd;
      },
    });
  }
  if (config.invalid) options.env = environment;
  const observation = {
    api: config.api,
    mode: config.mode,
    locator: config.locator,
    refused: false,
    errorCode: null,
    errorName: null,
    errorMessage: null,
    surface: null,
    commandPid: null,
    status: null,
    pathReads: 0,
    cwdReads: 0,
    cwdCoercions: 0,
  };
  try {
    const args = [config.program, config.marker, config.facts];
    if (config.invalid) {
      const nativeOptions = "bad";
      if (config.api === "spawnSync") cp.spawnSync(command, args, nativeOptions);
      else if (config.api === "spawn") cp.spawn(command, args, nativeOptions);
      else if (config.api === "execFileSync") cp.execFileSync(command, args, nativeOptions);
      else cp.execFile(command, args, nativeOptions, () => {});
    } else if (config.api === "spawnSync") {
      const result = cp.spawnSync(command, args, options);
      observation.commandPid = result.pid ?? null;
      observation.status = result.status;
      if (result.error) throw result.error;
    } else if (config.api === "execFileSync") {
      cp.execFileSync(command, args, options);
      observation.status = 0;
    } else if (config.api === "execFile") {
      await new Promise((resolve, reject) => {
        const child = cp.execFile(command, args, options, (error) => {
          if (error) reject(error);
          else {
            observation.status = 0;
            resolve();
          }
        });
        observation.commandPid = child.pid ?? null;
      });
    } else {
      const child =
        config.api === "fork"
          ? cp.fork(config.program, [config.marker, config.facts], {
              ...options,
              execPath: command,
              silent: true,
            })
          : cp.spawn(command, args, options);
      observation.commandPid = child.pid ?? null;
      await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code) => {
          observation.status = code;
          resolve();
        });
      });
    }
  } catch (error) {
    observation.refused = error.code?.startsWith("TEST_") ?? false;
    observation.errorCode = error.code ?? null;
    observation.errorName = error.name;
    observation.errorMessage = error.message;
    observation.surface = error.surface ?? null;
  }
  observation.pathReads = pathReads;
  observation.cwdReads = cwdReads;
  observation.cwdCoercions = cwdCoercions;
  console.log(JSON.stringify(observation));
}
async function precedenceInner(config) {
  const cp = require("node:child_process");
  const options = { env: { ...process.env }, encoding: "utf8", timeout: 5000 };
  delete options.env.NODE_OPTIONS;
  let argv = ["-r", config.before, "-r", config.guard, config.program, config.marker, config.facts];
  if (config.mode === "equal-before")
    argv = [
      "--require=" + config.before,
      "--require=" + config.guard,
      config.program,
      config.marker,
      config.facts,
    ];
  else if (config.mode === "env-before") {
    options.env.NODE_OPTIONS = "--require " + JSON.stringify(config.before);
    argv = ["--require", config.guard, config.program, config.marker, config.facts];
  } else if (config.mode === "guard-first")
    argv = [
      "--require",
      config.guard,
      "--require",
      config.before,
      config.program,
      config.marker,
      config.facts,
    ];
  else if (config.mode === "env-guard") options.env.NODE_OPTIONS = process.env.NODE_OPTIONS;
  else if (config.mode === "import-first")
    argv = [
      "--import",
      require("node:url").pathToFileURL(config.before).href,
      "--require",
      config.guard,
      config.program,
      config.marker,
      config.facts,
    ];
  const observation = {
    api: config.api,
    mode: config.mode,
    refused: false,
    errorCode: null,
    surface: null,
    commandPid: null,
    status: null,
  };
  try {
    if (config.api === "spawnSync") {
      const child = cp.spawnSync(process.execPath, argv, options);
      observation.commandPid = child.pid ?? null;
      observation.status = child.status;
      if (child.error) throw child.error;
    } else if (config.api === "execFile") {
      await new Promise((resolve, reject) => {
        const child = cp.execFile(process.execPath, argv, options, (error) => {
          if (error) reject(error);
          else {
            observation.status = 0;
            resolve();
          }
        });
        observation.commandPid = child.pid ?? null;
      });
    } else {
      const child =
        config.api === "fork"
          ? cp.fork(config.program, [config.marker, config.facts], {
              ...options,
              execArgv: argv.slice(0, -3),
              silent: true,
            })
          : cp.spawn(process.execPath, argv, options);
      observation.commandPid = child.pid ?? null;
      await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code) => {
          observation.status = code;
          resolve();
        });
      });
    }
  } catch (error) {
    observation.refused = error.code?.startsWith("TEST_") ?? false;
    observation.errorCode = error.code ?? null;
    observation.surface = error.surface ?? null;
  }
  console.log(JSON.stringify(observation));
}
function launchSuccessorControl(
  t,
  family,
  api,
  mode,
  locator = "absolute",
  invalid = false,
  guarded = true,
) {
  assert.ok(fs.existsSync("/proc/self"));
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-a58-launch-successor-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const directory of [auditDirectory, home, temporary])
    fs.mkdirSync(directory, { mode: 0o700 });
  const alias = path.join(work, "owned-runtime");
  fs.symlinkSync(process.execPath, alias);
  assert.equal(fs.realpathSync(alias), fs.realpathSync(process.execPath));
  const marker = path.join(work, "marker"),
    facts = path.join(work, "facts.json"),
    program = path.join(work, "payload.cjs"),
    before = path.join(work, "before.cjs"),
    beforeMarker = path.join(work, "before-marker");
  fs.writeFileSync(
    program,
    'const fs=require("node:fs");const net=require("node:net");fs.writeFileSync(process.argv[2],String(process.pid),{flag:"wx",mode:384});fs.writeFileSync(process.argv[3],JSON.stringify({pid:process.pid,parentPid:process.ppid,cwd:process.cwd(),guardBeforeCapture:globalThis.etaCapturedConnect===undefined?null:globalThis.etaCapturedConnect===net.Socket.prototype.connect}),{flag:"wx",mode:384});\n',
    { flag: "wx", mode: 0o600 },
  );
  fs.writeFileSync(
    before,
    'globalThis.etaCapturedConnect=require("node:net").Socket.prototype.connect;require("node:fs").writeFileSync(' +
      JSON.stringify(beforeMarker) +
      ',"loaded",{flag:"wx",mode:384});\n',
    { flag: "wx", mode: 0o600 },
  );
  const shadowDirectory = path.join(work, "shadow");
  fs.mkdirSync(shadowDirectory, { mode: 0o700 });
  fs.writeFileSync(
    path.join(shadowDirectory, "owned-runtime"),
    '#!/usr/bin/python3\nimport os,sys,json\npid=os.getpid()\nwith open(sys.argv[2],"x") as out: out.write(str(pid))\nwith open(sys.argv[3],"x") as out: json.dump({"pid":pid,"parentPid":os.getppid(),"cwd":os.getcwd(),"guardBeforeCapture":None},out)\n',
    { flag: "wx", mode: 0o700 },
  );
  const otherDirectory = path.join(work, "other"),
    subdirectory = path.join(otherDirectory, "subdir"),
    decoyDirectory = path.join(work, "decoy");
  for (const directory of [
    otherDirectory,
    subdirectory,
    decoyDirectory,
    path.join(work, "s"),
    path.join(work, "115"),
  ])
    fs.mkdirSync(directory, { mode: 0o700 });
  fs.symlinkSync(subdirectory, path.join(work, "link"));
  fs.symlinkSync(process.execPath, path.join(otherDirectory, "parent-runtime"));
  fs.symlinkSync(process.execPath, path.join(work, "115/parent-runtime"));
  const capture =
    "a58-" + family + "-" + api + "-" + mode + "-" + locator + (invalid ? "-invalid" : "");
  const config = {
    api,
    mode,
    locator,
    invalid,
    alias,
    cwd: work,
    program,
    marker,
    facts,
    before,
    guard: preload,
    shadowDirectory,
    decoyDirectory,
  };
  const inner = family === "alias" ? aliasInner : precedenceInner;
  const parent = spawnSync(
    process.execPath,
    [
      "--eval",
      "(" +
        inner.toString() +
        ")(" +
        JSON.stringify(config) +
        ").catch(error=>{console.error(error);process.exitCode=1;});",
    ],
    {
      cwd: work,
      env: {
        HOME: home,
        TMPDIR: temporary,
        XDG_CONFIG_HOME: path.join(home, ".config"),
        LANG: "C.UTF-8",
        LC_ALL: "C.UTF-8",
        TZ: "UTC",
        ...(guarded ? { NODE_OPTIONS: "--require " + JSON.stringify(preload) } : {}),
        ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
        ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      },
      encoding: "utf8",
      timeout: 15000,
    },
  );
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const observation = JSON.parse(parent.stdout.trim()),
    records = fs.readdirSync(auditDirectory).map((file) => {
      assert.match(file, /^[1-9][0-9]*\.json$/);
      const p = path.join(auditDirectory, file),
        info = fs.lstatSync(p);
      assert.ok(info.isFile() && !info.isSymbolicLink());
      assert.equal(info.mode & 0o777, 0o600);
      return JSON.parse(fs.readFileSync(p, "utf8"));
    });
  const markerPresent = fs.existsSync(marker),
    childFacts = fs.existsSync(facts) ? JSON.parse(fs.readFileSync(facts, "utf8")) : null,
    beforePresent = fs.existsSync(beforeMarker);
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.a58-" + family + "-control-evidence/v1",
      guarded,
      parentPid: parent.pid,
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      markerPresent,
      childFacts,
      beforePresent,
      records,
    }),
  );
  assert.equal(parent.stderr, "");
  const parentAudit = records.find((r) => r.pid === parent.pid);
  if (!guarded) {
    assert.equal(locator, "sync-raw-null");
    assert.deepEqual(records, []);
    assert.equal(parent.status, 0);
    assert.equal(observation.errorCode, "ERR_INVALID_ARG_VALUE");
    assert.equal(observation.errorName, "TypeError");
    assert.equal(observation.cwdCoercions, 0);
    assert.equal(markerPresent, false);
    assert.equal(childFacts, null);
    return { observation, parentExit: parent.status };
  }
  assert.ok(parentAudit);
  for (const record of records) {
    assert.equal(record.schema, "eta-mu.test-network-denial/v1");
    assert.equal(record.capture, capture);
  }
  const healthy =
    family === "alias"
      ? mode === "healthy"
      : ["guard-first", "env-guard", "import-first"].includes(mode);
  const nativeRefusal =
      invalid || ["default-path", "sync-raw-null", "sync-empty"].includes(locator),
    nonNode = locator === "shadow";
  const unsupportedSync = family === "alias" && api === "execFileSync" && healthy && !nativeRefusal;
  if (nativeRefusal) {
    assert.equal(parent.status, 0);
    assert.equal(observation.refused, false);
    assert.equal(
      observation.errorCode,
      invalid
        ? "ERR_INVALID_ARG_TYPE"
        : locator === "sync-raw-null"
          ? "ERR_INVALID_ARG_VALUE"
          : "ENOENT",
    );
    assert.equal(markerPresent, false);
    assert.equal(childFacts, null);
    assert.equal(parentAudit.deniedAttempts, 0);
    assert.deepEqual(parentAudit.expectedNodeChildren, []);
    assert.equal(records.length, 1);
  } else if ((!healthy && !nonNode) || unsupportedSync) {
    assert.equal(parent.status, 97);
    assert.equal(observation.refused, true);
    assert.equal(
      observation.errorCode,
      unsupportedSync
        ? "TEST_NODE_CHILD_PID_CUSTODY_UNAVAILABLE"
        : "TEST_NODE_CHILD_PRELOAD_REQUIRED",
    );
    assert.equal(markerPresent, false);
    assert.equal(beforePresent, false);
    assert.equal(childFacts, null);
    assert.equal(observation.commandPid, null);
    assert.equal(parentAudit.deniedAttempts, 1);
    assert.deepEqual(parentAudit.expectedNodeChildren, []);
    assert.equal(records.length, 1);
  } else {
    assert.equal(parent.status, 0);
    assert.equal(observation.status, 0);
    assert.equal(observation.refused, false);
    assert.equal(markerPresent, true);
    assert.ok(childFacts);
    assert.equal(parentAudit.deniedAttempts, 0);
    if (nonNode) {
      assert.deepEqual(parentAudit.expectedNodeChildren, []);
      assert.equal(records.length, 1);
    } else {
      assert.equal(records.length, 2);
      assert.deepEqual(parentAudit.expectedNodeChildren, [childFacts.pid]);
      assert.equal(childFacts.parentPid, parent.pid);
      const childAudit = records.find((r) => r.pid === childFacts.pid);
      assert.ok(childAudit);
      assert.equal(childAudit.parentPid, parent.pid);
      assert.equal(childAudit.deniedAttempts, 0);
      assert.ok(
        childAudit.kernelAncestry.some(
          (r) =>
            r.pid === childFacts.pid && r.parentPid === parent.pid && /^[0-9]+$/.test(r.startTicks),
        ),
      );
      if (family === "precedence") {
        assert.equal(beforePresent, true);
        assert.equal(childFacts.guardBeforeCapture, true);
      }
    }
  }
  if (locator === "getters") {
    assert.equal(observation.pathReads, 1);
    assert.equal(observation.cwdReads, 1);
  }
  if (locator === "sync-custom") assert.equal(observation.cwdCoercions, 1);
  if (locator === "sync-raw-null") assert.equal(observation.cwdCoercions, 0);
  if (childFacts) {
    const expectedCwd =
      locator === "cwd-parent"
        ? otherDirectory
        : locator === "sync-byte-string"
          ? path.join(work, "115")
          : work;
    assert.equal(childFacts.cwd, expectedCwd);
  }
  return { observation, parentExit: parent.status, parentAudit };
}
for (const api of ["spawn", "spawnSync", "execFile", "execFileSync", "fork"]) {
  for (const mode of ["missing", "healthy"])
    test("physical Node alias " + api + " " + mode, (t) =>
      launchSuccessorControl(t, "alias", api, mode),
    );
}
for (const locator of ["relative", "path", "getters"]) {
  for (const mode of ["missing", "healthy"])
    test("physical Node alias selected " + locator + " " + mode, (t) =>
      launchSuccessorControl(t, "alias", "spawnSync", mode, locator),
    );
}
for (const locator of ["url-cwd", "buffer-cwd"])
  test("physical Node alias retains " + locator, (t) =>
    launchSuccessorControl(t, "alias", "spawnSync", "healthy", locator),
  );
test("physical Node alias respects first non-Node PATH executable", (t) =>
  launchSuccessorControl(t, "alias", "spawnSync", "missing", "shadow"));
test("physical Node alias retains native default-PATH ENOENT", (t) =>
  launchSuccessorControl(t, "alias", "spawnSync", "missing", "default-path"));
for (const api of ["spawn", "spawnSync", "execFile", "execFileSync"])
  test("physical Node alias preserves original invalid options " + api, (t) =>
    launchSuccessorControl(t, "alias", api, "missing", "absolute", true),
  );
for (const api of ["spawn", "spawnSync", "execFile", "fork"])
  test("preload precedence refuses earlier CLI require " + api, (t) =>
    launchSuccessorControl(t, "precedence", api, "cli-before"),
  );
for (const mode of ["equal-before", "env-before", "guard-first", "env-guard", "import-first"])
  test("preload precedence " + mode, (t) =>
    launchSuccessorControl(t, "precedence", "spawnSync", mode),
  );
for (const locator of ["absolute-parent", "relative-parent", "path-parent", "cwd-parent"]) {
  for (const mode of ["missing", "healthy"])
    test("physical Node alias kernel " + locator + " " + mode, (t) =>
      launchSuccessorControl(t, "alias", "spawnSync", mode, locator),
    );
}
for (const api of ["spawn", "execFile", "fork"])
  for (const locator of ["buffer-relative", "buffer-path"]) {
    for (const mode of ["missing", "healthy"])
      test("physical Node alias native async Buffer " + api + " " + locator + " " + mode, (t) =>
        launchSuccessorControl(t, "alias", api, mode, locator),
      );
  }
for (const locator of ["empty-relative", "empty-path"])
  test("physical Node alias native async empty cwd " + locator, (t) =>
    launchSuccessorControl(t, "alias", "spawn", "missing", locator),
  );
test("physical Node alias preserves sync empty cwd native ENOENT", (t) =>
  launchSuccessorControl(t, "alias", "spawnSync", "missing", "sync-empty"));
test("physical Node alias captures sync custom primitive once", (t) =>
  launchSuccessorControl(t, "alias", "spawnSync", "healthy", "sync-custom"));
for (const mode of ["missing", "healthy"])
  test("physical Node alias native sync Uint8Array string " + mode, (t) =>
    launchSuccessorControl(t, "alias", "spawnSync", mode, "sync-byte-string"),
  );
test("physical Node alias preserves raw-NUL native validation before coercion", (t) => {
  const reference = launchSuccessorControl(
    t,
    "alias",
    "spawnSync",
    "missing",
    "sync-raw-null",
    false,
    false,
  );
  const guarded = launchSuccessorControl(t, "alias", "spawnSync", "missing", "sync-raw-null");
  assert.deepEqual(
    {
      name: guarded.observation.errorName,
      code: guarded.observation.errorCode,
      message: guarded.observation.errorMessage,
    },
    {
      name: reference.observation.errorName,
      code: reference.observation.errorCode,
      message: reference.observation.errorMessage,
    },
  );
});
async function listenerInner(config) {
  const { createRequire } = await import("node:module"),
    require = createRequire(config.guard);
  const netESM = await import("node:net"),
    moduleESM = await import("node:" + config.api);
  require(config.guard);
  const owner = config.mode === "esm" ? moduleESM : require("node:" + config.api);
  const server = owner.createServer(),
    observation = {
      api: config.api,
      mode: config.mode,
      denied: false,
      errorCode: null,
      surface: null,
      bound: false,
      address: null,
      wildcardAddress: null,
      closeCompleted: false,
      listeningAfter: null,
      esmListenSame: netESM.Server.prototype.listen === require("node:net").Server.prototype.listen,
    };
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, () => {
        observation.bound = true;
        observation.address = server.address();
        observation.wildcardAddress = ["::", "0.0.0.0"].includes(observation.address?.address)
          ? observation.address.address
          : null;
        server.close((error) => {
          if (error) reject(error);
          else {
            observation.closeCompleted = true;
            resolve();
          }
        });
      });
    });
  } catch (error) {
    observation.denied = error.code === "TEST_NETWORK_FORBIDDEN";
    observation.errorCode = error.code ?? null;
    observation.surface = error.surface ?? null;
  }
  if (server.listening)
    await new Promise((resolve, reject) =>
      server.close((error) => {
        if (error) reject(error);
        else {
          observation.closeCompleted = observation.bound;
          resolve();
        }
      }),
    );
  observation.listeningAfter = server.listening;
  console.log(JSON.stringify(observation));
}
function listenerSuccessorControl(t, api, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-a58-listener-successor-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const auditDirectory = path.join(work, "audits"),
    home = path.join(work, "home");
  for (const dir of [auditDirectory, home]) fs.mkdirSync(dir, { mode: 0o700 });
  const capture = "a58-listener-" + api + "-" + mode,
    config = { guard: preload, api, mode };
  const child = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      "(" +
        listenerInner.toString() +
        ")(" +
        JSON.stringify(config) +
        ").catch(error=>{console.error(error);process.exitCode=1;});",
    ],
    {
      cwd: work,
      env: {
        HOME: home,
        LANG: "C.UTF-8",
        LC_ALL: "C.UTF-8",
        TZ: "UTC",
        ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
        ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      },
      encoding: "utf8",
      timeout: 15000,
    },
  );
  assert.equal(child.error, undefined, child.stderr);
  assert.equal(child.signal, null, child.stderr);
  const observation = JSON.parse(child.stdout.trim()),
    files = fs.readdirSync(auditDirectory);
  assert.deepEqual(files, [String(child.pid) + ".json"]);
  const audit = JSON.parse(fs.readFileSync(path.join(auditDirectory, files[0]), "utf8"));
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.a58-listener-control-evidence/v1",
      childExit: child.status,
      childStderr: child.stderr,
      observation,
      audit,
    }),
  );
  assert.equal(child.stderr, "");
  assert.equal(child.status, 97);
  assert.equal(observation.denied, true);
  assert.equal(observation.errorCode, "TEST_NETWORK_FORBIDDEN");
  assert.equal(observation.surface, "net.Server.listen");
  assert.equal(observation.bound, false);
  assert.equal(observation.address, null);
  assert.equal(observation.esmListenSame, true);
  assert.equal(audit.schema, "eta-mu.test-network-denial/v1");
  assert.equal(audit.capture, capture);
  assert.equal(audit.pid, child.pid);
  assert.equal(audit.deniedAttempts, 1);
  assert.deepEqual(audit.expectedNodeChildren, []);
}
for (const api of ["net", "http", "https"])
  for (const mode of ["cjs", "esm"])
    test("TCP listener " + api + " " + mode + " refuses before local bind", (t) =>
      listenerSuccessorControl(t, api, mode),
    );

// Named deterministic workflow fixtures retain a separate source/caller/PID
// capability. Every adverse payload only writes owned marker/fact files; the
// missing-audit case is retained as a failed post-dispatch custody observation.
function trustedWorkflowFixtureControl(t, mode) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "eta-trusted-workflow-control-"));
  fs.chmodSync(work, 0o700);
  t.after(() => fs.rmSync(work, { recursive: true, force: true }));
  const scripts = path.join(work, "scripts"),
    ownerDir = path.join(work, ".github/scripts");
  const auditDirectory = path.join(work, "audits"),
    binding = path.join(work, "binding");
  const home = path.join(work, "home"),
    temporary = path.join(work, "tmp");
  for (const dir of [scripts, ownerDir, auditDirectory, binding, home, temporary])
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const heldPreload = path.join(scripts, "assessment-network-deny-preload.cjs");
  const heldHelper = path.join(ownerDir, "assessment-trusted-workflow-fixture.mjs");
  fs.copyFileSync(preload, heldPreload);
  fs.copyFileSync(
    path.join(path.dirname(preload), "../.github/scripts/assessment-trusted-workflow-fixture.mjs"),
    heldHelper,
  );
  const owner = path.join(ownerDir, "opencode-actionability-assessment-workflow.test.mjs");
  const marker = path.join(work, "marker"),
    facts = path.join(work, "node-facts.json"),
    payload = path.join(work, "payload.cjs");
  fs.writeFileSync(
    payload,
    `const fs=require("node:fs");fs.writeFileSync(${JSON.stringify(marker)},String(process.pid));fs.writeFileSync(${JSON.stringify(facts)},JSON.stringify({pid:process.pid,parentPid:process.ppid,preloadLoaded:!!require.cache[${JSON.stringify(heldPreload)}]}));\n`,
    { flag: "wx", mode: 0o600 },
  );
  const foreign = path.join(work, "foreign.mjs"),
    child = path.join(work, "child.mjs");
  fs.writeFileSync(
    foreign,
    `import {runTrustedWorkflowFixture as run} from ${JSON.stringify(heldHelper)};export const foreign=(owner,args,options)=>run(owner,args,options);\n`,
    { flag: "wx", mode: 0o600 },
  );
  fs.writeFileSync(
    child,
    `import {runTrustedWorkflowFixture as run} from ${JSON.stringify(heldHelper)};let code=null;try{run(${JSON.stringify(new URL("file:" + owner).href)},["-c","printf child"],{encoding:"utf8"});}catch(e){code=e.code;}console.log(JSON.stringify({code}));\n`,
    { flag: "wx", mode: 0o600 },
  );
  const ownerSource = `import test from "node:test";import fs from "node:fs";import cp from "node:child_process";import {createRequire} from "node:module";import {runTrustedWorkflowFixture as run} from ${JSON.stringify(heldHelper)};import {foreign} from ${JSON.stringify(foreign)};
  test("trusted fixture control",()=>{
    const mode=${JSON.stringify(mode)}, marker=${JSON.stringify(marker)};
    const opts={encoding:"utf8",timeout:5000,env:{PATH:${JSON.stringify(path.dirname(process.execPath) + ":/usr/bin:/bin")},FIXTURE_NODE:${JSON.stringify(process.execPath)},FIXTURE_PAYLOAD:${JSON.stringify(payload)}}};
    const observation={mode,code:null,status:null,pid:null,stdout:null,childStatus:null,markerPresent:false,nodeFacts:null};
    if(mode.startsWith("getter-mutated-"))Object.defineProperty(opts,"cwd",{enumerable:true,get(){
      const changed=mode==="getter-mutated-owner"?${JSON.stringify(owner)}:mode==="getter-mutated-helper"?${JSON.stringify(heldHelper)}:${JSON.stringify(path.join(binding, "root.json"))};
      fs.appendFileSync(changed," ");return ${JSON.stringify(work)};
    }});
    opts.env.FIXTURE_OWNER=${JSON.stringify(owner)};
    try{
      if(mode==="mutated-owner")fs.appendFileSync(${JSON.stringify(owner)},"\\n// changed\\n");
      if(mode==="mutated-helper")fs.appendFileSync(${JSON.stringify(heldHelper)},"\\n// changed\\n");
      if(mode==="mutated-root")fs.appendFileSync(${JSON.stringify(path.join(binding, "root.json"))}," ");
      if(mode==="source-symlink"){
        const copy=${JSON.stringify(owner + ".copy")};fs.copyFileSync(${JSON.stringify(owner)},copy);fs.unlinkSync(${JSON.stringify(owner)});fs.symlinkSync(copy,${JSON.stringify(owner)});
      }
      let result;
      if(mode==="generic-shell")result=cp.spawnSync("/bin/bash",["-c",'"$FIXTURE_NODE" "$FIXTURE_PAYLOAD"'],opts);
      else if(mode==="imported-caller")result=foreign(import.meta.url,["-c","printf imported"],opts);
      else if(mode==="unregistered-caller")result=createRequire(import.meta.url)(${JSON.stringify(heldPreload)}).registerTrustedWorkflowFixture(import.meta.url,["-c","printf unregistered"]).run(opts);
      else if(mode==="child-caller"){
        result=cp.spawnSync(process.execPath,[${JSON.stringify(child)}],{...opts,env:{...process.env},encoding:"utf8"});
        observation.childStatus=result.status;observation.code=JSON.parse(result.stdout).code;
      }else{
        const program=mode==="node-exec"?'exec "$FIXTURE_NODE" "$FIXTURE_PAYLOAD"'
          :mode==="node-grandchild"?'"$FIXTURE_NODE" "$FIXTURE_PAYLOAD"; printf done'
          :mode==="node-missing-audit"?'env -u NODE_OPTIONS "$FIXTURE_NODE" "$FIXTURE_PAYLOAD"'
          :mode==="program-mutated-owner"?'printf changed >> "$FIXTURE_OWNER"; printf trusted'
          :"printf trusted";
        const args=["-c",program];
        if(mode==="captured-program")Object.defineProperty(opts,"cwd",{enumerable:true,get(){args[1]='"$FIXTURE_NODE" "$FIXTURE_PAYLOAD"';return ${JSON.stringify(work)};}});
        result=run(import.meta.url,args,opts,mode.startsWith("node-")?1:0);
      }
      observation.status=result.status;observation.pid=result.pid;observation.stdout=result.stdout;
    }catch(e){observation.code=e.code??e.message;}
    observation.markerPresent=fs.existsSync(marker);observation.nodeFacts=fs.existsSync(${JSON.stringify(facts)})?JSON.parse(fs.readFileSync(${JSON.stringify(facts)},"utf8")):null;
    console.log("TRUSTED_FIXTURE_CONTROL:"+JSON.stringify(observation));
  });\n`;
  fs.writeFileSync(owner, ownerSource, { flag: "wx", mode: 0o600 });
  const entry =
    mode === "lookalike-entry"
      ? path.join(work, "lookalike/.github/scripts", path.basename(owner))
      : owner;
  if (entry !== owner) {
    fs.mkdirSync(path.dirname(entry), { recursive: true, mode: 0o700 });
    fs.copyFileSync(owner, entry);
  }
  const capture = "trusted-fixture-" + mode;
  const parent = spawnSync(process.execPath, ["--test", entry], {
    cwd: work,
    encoding: "utf8",
    timeout: 15000,
    env: {
      PATH: path.dirname(process.execPath) + ":/usr/bin:/bin",
      HOME: home,
      TMPDIR: temporary,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      TZ: "UTC",
      NODE_OPTIONS: "--require " + JSON.stringify(heldPreload),
      ETA_MU_TEST_NETWORK_AUDIT_DIR: auditDirectory,
      ETA_MU_TEST_NETWORK_AUDIT_CAPTURE: capture,
      ETA_MU_TEST_TRUSTED_FIXTURE_BINDING_DIR: binding,
    },
  });
  assert.equal(parent.error, undefined, parent.stderr);
  assert.equal(parent.signal, null, parent.stderr);
  const line = parent.stdout
    .split("\n")
    .find((value) => value.includes("TRUSTED_FIXTURE_CONTROL:"));
  assert.ok(line, parent.stdout + parent.stderr);
  const observation = JSON.parse(line.slice(line.indexOf("TRUSTED_FIXTURE_CONTROL:") + 24));
  const records = fs
    .readdirSync(auditDirectory)
    .map((name) => JSON.parse(fs.readFileSync(path.join(auditDirectory, name), "utf8")));
  const journal = fs
    .readdirSync(binding)
    .filter((name) => name.endsWith(".jsonl"))
    .flatMap((name) =>
      fs.readFileSync(path.join(binding, name), "utf8").trim().split("\n").map(JSON.parse),
    );
  const bbChecks = [];
  if (["shell-zero", "node-exec", "node-grandchild", "captured-program"].includes(mode)) {
    const source = fs.readFileSync(path.join(path.dirname(preload), "test-assessments.bb"), "utf8");
    const marker = "(let [work (str (.toRealPath";
    assert.equal(source.split(marker).length, 2, "retain the actual owning BB reader definitions");
    const check = path.join(work, "actual-journal-check.bb"),
      rootPid = JSON.parse(fs.readFileSync(path.join(binding, "root.json"), "utf8")).pid;
    const runCheck = (directory) => {
      fs.writeFileSync(
        check,
        source.slice(0, source.indexOf(marker)) +
          `\n(audit! ${JSON.stringify(auditDirectory)} ${JSON.stringify(directory)} ${JSON.stringify(capture)} ${rootPid})\n`,
        { mode: 0o600 },
      );
      return spawnSync("bb", [check], {
        cwd: work,
        encoding: "utf8",
        timeout: 15000,
        env: { PATH: process.env.PATH, HOME: home, LANG: "C.UTF-8", LC_ALL: "C.UTF-8" },
      });
    };
    const healthy = runCheck(binding);
    bbChecks.push({
      scope: "actual owning BB audit reader",
      exit: healthy.status,
      stdout: healthy.stdout,
      stderr: healthy.stderr,
    });
    assert.equal(healthy.error, undefined, healthy.stderr);
    assert.equal(healthy.status, 0, healthy.stdout + healthy.stderr);
    assert.match(healthy.stdout, /bound Node processes, zero denied attempts/);
    if (mode === "node-grandchild") {
      const adverse = path.join(work, "adverse-binding");
      fs.cpSync(binding, adverse, { recursive: true });
      const name = fs.readdirSync(adverse).find((value) => value.endsWith(".jsonl"));
      const rows = fs
        .readFileSync(path.join(adverse, name), "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse);
      rows[0].actualPid += 1000000;
      fs.writeFileSync(path.join(adverse, name), rows.map(JSON.stringify).join("\n") + "\n");
      const refused = runCheck(adverse);
      bbChecks.push({
        scope: "copied journal with wrong native Bash PID",
        exit: refused.status,
        stdout: refused.stdout,
        stderr: refused.stderr,
      });
      assert.equal(refused.error, undefined, refused.stderr);
      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /Trusted workflow fixture Node ancestry refused/);
    }
  }
  t.diagnostic(
    JSON.stringify({
      schema: "eta-mu.trusted-workflow-fixture-control/v1",
      mode,
      parentExit: parent.status,
      parentStderr: parent.stderr,
      observation,
      records,
      journal,
      bbChecks,
    }),
  );
  assert.equal(observation.mode, mode);
  const success = ["shell-zero", "node-exec", "node-grandchild", "captured-program"].includes(mode);
  if (success) {
    assert.equal(parent.status, 0, parent.stdout + parent.stderr);
    assert.equal(observation.code, null);
    assert.equal(observation.status, 0);
    assert.ok(observation.pid > 0);
    assert.equal(journal.length, 1);
    const row = journal[0];
    assert.equal(row.actualPid, observation.pid);
    assert.equal(row.custodyQualified, true);
    assert.equal(row.status, 0);
    assert.equal(row.signal, null);
    assert.equal(row.errorCode, null);
    if (mode.startsWith("node-")) {
      assert.equal(observation.markerPresent, true);
      assert.equal(observation.nodeFacts.preloadLoaded, true);
      assert.equal(row.actualNodeChildren.length, 1);
      const held = row.actualNodeChildren[0];
      assert.equal(held.pid, observation.nodeFacts.pid);
      const record = records.find((value) => value.pid === held.pid);
      assert.ok(record);
      assert.equal(record.deniedAttempts, 0);
      assert.ok(
        record.kernelAncestry.some(
          (value) =>
            value.pid === row.actualPid &&
            value.parentPid === row.ownerPid &&
            value.startTicks === held.launcherStartTicks,
        ),
      );
      assert.equal(
        mode === "node-exec" ? held.pid === row.actualPid : held.parentPid === row.actualPid,
        true,
      );
    } else {
      assert.equal(observation.stdout, "trusted");
      assert.equal(observation.markerPresent, false);
      assert.deepEqual(row.actualNodeChildren, []);
    }
    assert.ok(records.every((value) => value.deniedAttempts === 0));
  } else if (mode === "child-caller") {
    assert.equal(parent.status, 0, parent.stdout + parent.stderr);
    assert.equal(observation.childStatus, 97);
    assert.equal(observation.code, "TEST_TRUSTED_FIXTURE_OWNER_REFUSED");
    assert.equal(observation.markerPresent, false);
    assert.equal(journal.length, 0);
    const denied = records.filter((value) => value.deniedAttempts === 1);
    assert.equal(denied.length, 1);
    assert.ok(records.some((value) => value.expectedNodeChildren.includes(denied[0].pid)));
  } else {
    assert.equal(parent.status, 1, parent.stdout + parent.stderr);
    const code =
      mode === "generic-shell"
        ? "TEST_INDIRECT_NODE_PID_CUSTODY_UNAVAILABLE"
        : mode === "lookalike-entry"
          ? "TEST_TRUSTED_FIXTURE_OWNER_REFUSED"
          : ["imported-caller", "unregistered-caller"].includes(mode)
            ? "TEST_TRUSTED_FIXTURE_CALLER_REFUSED"
            : mode === "node-missing-audit"
              ? "TEST_TRUSTED_FIXTURE_NODE_CUSTODY_REFUSED"
              : "TEST_TRUSTED_FIXTURE_SOURCE_REFUSED";
    assert.equal(observation.code, code);
    assert.ok(records.some((value) => value.deniedAttempts === 1));
    assert.equal(observation.markerPresent, mode === "node-missing-audit");
    if (mode === "node-missing-audit") {
      assert.equal(observation.nodeFacts.preloadLoaded, false);
      assert.equal(journal.length, 1);
      assert.equal(journal[0].custodyQualified, false);
      assert.deepEqual(journal[0].actualNodeChildren, []);
    } else if (mode === "program-mutated-owner") {
      assert.equal(journal.length, 1);
      assert.equal(journal[0].custodyQualified, false);
      assert.ok(journal[0].actualPid > 0);
      assert.equal(journal[0].status, 0);
    } else assert.equal(journal.length, 0);
  }
}
for (const mode of [
  "shell-zero",
  "node-exec",
  "node-grandchild",
  "captured-program",
  "generic-shell",
  "imported-caller",
  "unregistered-caller",
  "lookalike-entry",
  "child-caller",
  "mutated-owner",
  "mutated-helper",
  "mutated-root",
  "source-symlink",
  "node-missing-audit",
  "getter-mutated-owner",
  "getter-mutated-helper",
  "getter-mutated-root",
  "program-mutated-owner",
]) {
  test(`trusted workflow fixture ${mode} binds source caller native PID and actual Node custody`, (t) =>
    trustedWorkflowFixtureControl(t, mode));
}
