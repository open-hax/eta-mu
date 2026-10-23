// SPDX-License-Identifier: GPL-3.0-or-later
// Raw Node boundary only: own one CLI process group, bounded captures and cleanup.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [cli, workspace, output, timeoutText, maximumText, serializedArgs, transport] = process.argv.slice(2);
const timeout = Number(timeoutText), maximum = Number(maximumText), args = JSON.parse(serializedArgs);
if (transport !== "stream-json" || process.platform !== "linux" || !Number.isSafeInteger(timeout) || timeout < 1 ||
    !Number.isSafeInteger(maximum) || maximum < 1 || !Array.isArray(args) || !args.every(x => typeof x === "string")) {
  throw new Error("unsupported process boundary");
}
const stdout = fs.openSync(path.join(output, "native.stdout.json"), "wx", 0o600);
const stderr = fs.openSync(path.join(output, "native.stderr.log"), "wx", 0o600);
const result = { status: null, signal: null, timed_out: false, oversized: false,
  group_cleanup: false, error: null };
let child, captured = 0, timer, protocolTail = Buffer.alloc(0);
const owner = process.ppid;
fs.writeFileSync(path.join(output, "process-start.json"), `${JSON.stringify({ pid: process.pid, parent_pid: owner })}\n`, { flag: "wx", mode: 0o600 });
const parentWatch = setInterval(() => {
  // Node's process.ppid is a startup snapshot, not a live getppid().
  const stat = fs.readFileSync("/proc/self/stat", "utf8");
  const actualParent = Number(stat.slice(stat.lastIndexOf(")") + 2).split(" ")[1]);
  if (actualParent !== owner) { result.error = "parent-exited"; stop(); process.stdin.destroy(); }
}, 100);
parentWatch.unref();
function stop() {
  if (!child?.pid) return;
  try { process.kill(-child.pid, "SIGKILL"); result.group_cleanup = true; }
  catch (error) { if (error.code === "ESRCH") result.group_cleanup = true; else result.error = error.code; }
}
const onSignal = signal => { result.signal = signal; result.error ||= "cancelled"; stop(); process.stdin.destroy(); };
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(signal, onSignal);
try {
  const inputChunks = [];
  let inputSize = 0;
  for await (const chunk of process.stdin) {
    inputSize += chunk.length;
    if (inputSize > 8 * 1024 * 1024) throw new Error("input too large");
    inputChunks.push(chunk);
  }
  const input = Buffer.concat(inputChunks);
  if (result.signal || result.error) throw new Error(result.error || "cancelled-before-spawn");
  child = spawn(cli, args, { cwd: workspace, env: process.env, detached: true, stdio: ["pipe", "pipe", "pipe"] });
  function capture(fd, bytes) {
    const remaining = Math.max(0, maximum - captured);
    if (remaining) fs.writeSync(fd, bytes.subarray(0, remaining));
    captured += bytes.length;
    if (captured > maximum) { result.oversized = true; stop(); }
    if (fd === stdout && !result.oversized) {
      // Framing only: semantic admission of every event happens in the pure law.
      protocolTail = Buffer.concat([protocolTail, bytes]);
      let newline;
      while ((newline = protocolTail.indexOf(10)) !== -1) {
        const line = protocolTail.subarray(0, newline).toString("utf8");
        protocolTail = protocolTail.subarray(newline + 1);
        try {
          const event = JSON.parse(line);
          if (event?.event === "result" && event.result && typeof event.result === "object" && !Array.isArray(event.result)) child.stdin.end();
        } catch { /* Preserve malformed bytes for final refusal. */ }
      }
    }
  }
  child.stdout.on("data", bytes => capture(stdout, bytes));
  child.stderr.on("data", bytes => capture(stderr, bytes));
  child.stdin.on("error", error => { if (error.code !== "EPIPE") { result.error = error.code; stop(); } });
  timer = setTimeout(() => { result.timed_out = true; stop(); }, timeout);
  await new Promise(resolve => {
    child.once("error", error => { result.error = error.code || error.message; resolve(); });
    child.once("exit", (status, signal) => { result.status = status; result.signal ||= signal; stop(); });
    child.once("close", resolve);
    // EOF before completion can discard a native stream turn.
    child.stdin.write(input);
  });
} catch (error) {
  result.error ||= error.code || error.message;
} finally {
  clearTimeout(timer);
  clearInterval(parentWatch);
  stop();
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) process.off(signal, onSignal);
  fs.closeSync(stdout); fs.closeSync(stderr);
  if (result.error === "parent-exited" || result.signal) fs.rmSync(workspace, { recursive: true, force: true });
}
fs.writeFileSync(path.join(output, "process.json"), `${JSON.stringify(result, null, 2)}\n`, { flag: "wx", mode: 0o600 });
process.stdout.write(JSON.stringify(result));
