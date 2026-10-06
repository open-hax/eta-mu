// SPDX-License-Identifier: GPL-3.0-or-later
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runReviewRecovery } from "./run-opencode-review-recovery.mjs";

const permissionError = "The user rejected permission to use this specific tool call.";
const invalidInput = {
  tool: "assess_diff_chunk",
  error: "Model tried to call unavailable tool 'assess_diff_chunk'. Available tools: invalid, review_assess_diff_chunk, review_begin, review_submit.",
};

/** Build fixture events for two completed invalid calls and terminal permission rejection. */
function failureEvents() {
  const sessionID = "ses_fixture";
  return [1, 2].map((n) => ({
    type: "tool_use", timestamp: n, sessionID,
    part: { type: "tool", id: `part_${n}`, callID: `call_${n}`, sessionID,
      tool: "invalid", state: { status: "completed", input: invalidInput } },
  })).concat({ type: "error", timestamp: 4, sessionID,
    error: { name: "UnknownError", data: { message: permissionError } } });
}

/** Create an isolated test directory and register its removal after the test. */
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "review-tool-recovery-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** Exercise recovery with configurable synthetic failures and captured invocation prompts. */
async function invokeFailure(directory, { events = failureEvents(), stderr = "! permission requested: doom_loop (invalid); auto-rejecting\n", exitCode = 1, submission, secondFails = false } = {}) {
  const calls = [];
  const promise = runReviewRecovery({
    evidenceDirectory: directory,
    basePrompt: "Complete the full current input using review_begin and review_submit.",
    reviewTools: ["review_begin", "review_assess_diff_chunk", "review_submit"],
    invokeAttempt: async ({ attempt, prompt, responseFile, stderrFile }) => {
      calls.push({ attempt, prompt });
      if (attempt === 1 || secondFails) {
        fs.writeFileSync(responseFile, events.map((event) => JSON.stringify(event)).join("\n") + "\n");
        fs.writeFileSync(stderrFile, stderr);
        if (submission !== undefined) fs.writeFileSync(path.join(directory, "submission.json"), submission);
        return { exitCode };
      }
      fs.writeFileSync(responseFile, "retained second invocation\n");
      fs.writeFileSync(stderrFile, "");
      fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({ schema: "open-hax.github-review/v1", event: "APPROVE", summary: "fixture", comments: [] }));
      return { exitCode: 0 };
    },
  });
  return { promise, calls };
}

test("a terminal unavailable review tool loop gets one full corrective invocation", async (t) => {
  const directory = fixture(t);
  const { promise, calls } = await invokeFailure(directory);
  const result = await promise;
  assert.deepEqual(calls.map(({ attempt }) => attempt), [1, 2]);
  assert.equal(result.recovery_reason, "unavailable_review_tool");
  assert.equal(result.attempts[0].exit_code, 1);
  assert.equal(result.attempts[0].submission_state, "missing");
  assert.match(calls[1].prompt, /review_begin/);
  assert.match(calls[1].prompt, /review_assess_diff_chunk/);
  assert.match(calls[1].prompt, /do not assume any in-memory state/i);
  assert.match(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), /call_2/);
  assert.equal(result.attempts[1].exit_code, 0);
});

test("repeated invalid tool failure stops at the shared two invocation bound", async (t) => {
  const { promise, calls } = await invokeFailure(fixture(t), { secondFails: true });
  await assert.rejects(promise, /attempt 2 exited 1/);
  assert.deepEqual(calls.map(({ attempt }) => attempt), [1, 2]);
});

for (const [name, transform] of [
  ["quoted model prose", () => [{ type: "text", part: { text: JSON.stringify(failureEvents()) } }]],
  ["cross-session event", (events) => events.map((e, n) => n === 1 ? { ...e, sessionID: "foreign" } : e)],
  ["provider quota terminal error", (events) => events.slice(0, -1).concat({ ...events.at(-1), error: { name: "APIError", data: { message: "quota exceeded" } } })],
  ["unknown tool", (events) => events.map((e) => e.part ? { ...e, part: { ...e.part, state: { ...e.part.state, input: { tool: "arbitrary_tool", error: "unavailable" } } } } : e)],
  ["valid tool permission denial", (events) => events.map((e) => e.part ? { ...e, part: { ...e.part, tool: "bash" } } : e)],
  ["duplicate event representations", (events) => [events[0], events[0], events[0], events.at(-1)]],
]) {
  test(`${name} never authorizes recovery`, async (t) => {
    const { promise, calls } = await invokeFailure(fixture(t), { events: transform(failureEvents()) });
    await assert.rejects(promise, /attempt 1 exited 1/);
    assert.equal(calls.length, 1);
  });
}

for (const submission of ["{broken", "{}", JSON.stringify({ event: "APPROVE" })]) {
  test(`a failed invocation with a present submission cannot recover: ${submission}`, async (t) => {
    const { promise, calls } = await invokeFailure(fixture(t), { submission });
    await assert.rejects(promise);
    assert.equal(calls.length, 1);
  });
}

test("packaged CLI uses structured output and the staged registry for a real child recovery", (t) => {
  const directory = fixture(t);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/opencode-code-review.yml"), "utf8");
  const encoded = workflow.match(/<<'ETA_MU_RECOVERY_RUNNER_BASE64'\n([\s\S]*?)\n\s*ETA_MU_RECOVERY_RUNNER_BASE64/);
  assert.ok(encoded);
  const runner = path.join(directory, "runner.mjs");
  fs.writeFileSync(runner, Buffer.from(encoded[1].replace(/\s/g, ""), "base64"));
  const child = path.join(directory, "fake-opencode.mjs");
  fs.writeFileSync(child, `#!${process.execPath}
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
if (args[0] !== "run" || args[1] !== "--format" || args[2] !== "json") process.exit(9);
const directory = process.env.REVIEW_EVIDENCE_DIR;
const count = path.join(directory, "count.txt");
const attempt = fs.existsSync(count) ? 2 : 1;
fs.writeFileSync(count, String(attempt));
if (attempt === 1) {
  for (const event of ${JSON.stringify(failureEvents())}) console.log(JSON.stringify(event));
  console.error("! permission requested: doom_loop (invalid); auto-rejecting");
  process.exitCode = 1;
} else {
  if (!args.at(-1).includes("review_assess_diff_chunk") || !args.at(-1).includes("review_begin")) process.exit(8);
  fs.writeFileSync(path.join(directory, "submission.json"), JSON.stringify({ schema: "open-hax.github-review/v1", event: "APPROVE", summary: "fixture", comments: [] }));
  console.log(JSON.stringify({ type: "text", timestamp: 5, sessionID: "ses_recovery", part: { text: "new full review fixture" } }));
}
`);
  fs.chmodSync(child, 0o755);
  const prompt = path.join(directory, "prompt.md");
  const registry = path.join(directory, "tools.txt");
  fs.writeFileSync(prompt, "Complete review #{{PR_NUMBER}} with review_begin and review_submit.\n");
  fs.writeFileSync(registry, "review_begin\nreview_assess_diff_chunk\nreview_submit\n");
  const result = spawnSync(process.execPath, [runner], {
    encoding: "utf8", timeout: 10_000,
    env: { ...process.env, OPENCODE_BIN: child, REVIEW_EVIDENCE_DIR: directory,
      REVIEW_PROMPT_FILE: prompt, REVIEW_MODEL: "fixture/model", REVIEW_TOOL_REGISTRY_FILE: registry, PR_NUMBER: "342" },
  });
  assert.equal(result.status, 0, result.stderr);
  const receipt = JSON.parse(fs.readFileSync(path.join(directory, "recovery.json"), "utf8"));
  assert.deepEqual(receipt.attempts.map(({ exit_code }) => exit_code), [1, 0]);
  assert.equal(receipt.recovery_reason, "unavailable_review_tool");
  assert.equal(receipt.attempts[0].tool_failure.corrected_tool, "review_assess_diff_chunk");
  assert.match(fs.readFileSync(path.join(directory, "model-response-attempt-1.txt"), "utf8"), /call_2/);
  assert.match(fs.readFileSync(path.join(directory, "model-response-attempt-2.txt"), "utf8"), /ses_recovery/);
});
