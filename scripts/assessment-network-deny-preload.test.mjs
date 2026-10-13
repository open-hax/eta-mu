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
      const command = "/bin/sh", shellArgs = ["-c", 'umask 077; printf "%s" "$$" > "$1"; printf "%s" "$$"', "marker-control", marker];
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
    shellProgram = path.join(work, "marker-child.sh");
  fs.writeFileSync(
    program,
    `require("node:fs").writeFileSync(${JSON.stringify(marker)}, String(process.pid), {mode:0o600, flag:"wx"}); require("node:fs").writeFileSync(${JSON.stringify(childFacts)}, JSON.stringify({pid:process.pid, execArgv:process.execArgv}), {mode:0o600, flag:"wx"}); process.stdout.write(String(process.pid)); if(process.connected) process.disconnect();\n`,
    { mode: 0o600, flag: "wx" },
  );
  fs.writeFileSync(shellProgram, 'umask 077; printf "%s" "$$" > "$1"; printf "%s" "$$"\n', {
    mode: 0o600,
    flag: "wx",
  });
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
