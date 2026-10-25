import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const workflow = readFileSync(
  new URL("../.github/workflows/auto-merge.yml", import.meta.url),
  "utf8",
);
const preflight = workflow.match(/node <<'NODE'\n([\s\S]*?)^ {10}NODE$/m)?.[1];
const resolveTarget = workflow
  .match(
    / {6}- name: Resolve target repository[\s\S]*? {8}run: \|\n([\s\S]*?)(?=\n {6}- name:)/m,
  )?.[1]
  ?.replace(/^ {10}/gm, "");

const runPreflight = async ({
  method = "MERGE",
  repository = { allow_auto_merge: true, allow_merge_commit: true },
  status = 200,
  networkError = false,
} = {}) => {
  assert.ok(preflight, "workflow must perform a capability preflight");
  const requests = [];
  const errors = [];
  const process = {
    env: { MERGE_METHOD: method, TARGET_REPOSITORY: "owner/repo", GITHUB_TOKEN: "test-token" },
    exitCode: 0,
  };
  await vm.runInNewContext(preflight, {
    process,
    AbortSignal,
    console: {
      log() {},
      error(message) {
        errors.push(message);
      },
    },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (networkError) throw new Error("network unavailable");
      return { ok: status === 200, status, json: async () => repository };
    },
  });
  return { requests, errors, exitCode: process.exitCode };
};

test("default merge method preserves merge commits and is passed as quoted environment data", () => {
  assert.match(workflow, /merge-method:[\s\S]*?default: "MERGE"/);
  assert.match(workflow, /case "\$MERGE_METHOD" in\n\s+MERGE\|SQUASH\|REBASE\)/);
  assert.match(workflow, /--merge-method "\$MERGE_METHOD"/);
  assert.doesNotMatch(workflow, /--merge-method "\$\{\{ inputs\.merge-method/);
});

test("actual target-resolution shell rejects invalid merge input before credential steps", () => {
  assert.ok(resolveTarget);
  assert.ok(
    workflow.indexOf("name: Resolve target repository") <
      workflow.indexOf("name: Create eta-mu app token"),
  );
  for (const [method, expected] of [
    ["MERGE", 0],
    ["SQUASH", 0],
    ["REBASE", 0],
    ["merge", 1],
    ["MERGE; echo injected", 1],
    ["", 1],
  ]) {
    const result = spawnSync("bash", ["-e", "-c", resolveTarget], {
      encoding: "utf8",
      env: {
        PATH: process.env.PATH,
        TARGET_REPOSITORY: "owner/repo",
        MERGE_METHOD: method,
        GITHUB_OUTPUT: "/dev/null",
      },
    });
    assert.equal(result.status, expected, method);
    assert.doesNotMatch(result.stdout + result.stderr, /injected/);
  }
});

test("enabled auto-merge performs only one bounded repository capability GET", async () => {
  const result = await runPreflight();
  assert.equal(result.exitCode, 0);
  assert.equal(result.requests.length, 1);
  const [{ url, options }] = result.requests;
  assert.equal(url, "https://api.github.com/repos/owner/repo");
  assert.equal(options.method, "GET");
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(options.headers.authorization, "Bearer test-token");
});

for (const [name, input, message] of [
  [
    "disabled auto-merge",
    { repository: { allow_auto_merge: false, allow_merge_commit: true } },
    /auto-merge is disabled/,
  ],
  ["unknown auto-merge", { repository: { allow_merge_commit: true } }, /capability is unknown/],
  [
    "disabled merge commits",
    { repository: { allow_auto_merge: true, allow_merge_commit: false } },
    /MERGE merge method is disabled or unknown/,
  ],
  [
    "unknown merge support",
    { repository: { allow_auto_merge: true } },
    /MERGE merge method is disabled or unknown/,
  ],
  ["permission failure", { status: 403 }, /HTTP 403/],
  ["network failure", { networkError: true }, /network unavailable/],
  ["invalid method", { method: "MERGE; echo injected" }, /Expected MERGE, SQUASH, or REBASE/],
]) {
  test(`${name} fails without any mutation or secret in diagnostics`, async () => {
    const result = await runPreflight(input);
    assert.equal(result.exitCode, 1);
    assert.match(result.errors.join("\n"), message);
    assert.doesNotMatch(result.errors.join("\n"), /test-token/);
    assert.ok(result.requests.every(({ options }) => options.method === "GET"));
    if (name === "invalid method") assert.equal(result.requests.length, 0);
  });
}

for (const [method, field] of [
  ["SQUASH", "allow_squash_merge"],
  ["REBASE", "allow_rebase_merge"],
]) {
  test(`explicit ${method} override requires its repository capability`, async () => {
    assert.equal(
      (await runPreflight({ method, repository: { allow_auto_merge: true, [field]: true } }))
        .exitCode,
      0,
    );
    assert.equal((await runPreflight({ method })).exitCode, 1);
  });
}
