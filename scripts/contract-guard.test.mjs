import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { findContractRedefinitions, guardDirectories } from "./contract-guard.mjs";

test("detects multiline definitions with metadata", () => {
  const source = "(def\n  ^:private\n  ModelContract\n  [:map])\n";
  assert.deepEqual(findContractRedefinitions(source, "fixture.cljs"), [
    "fixture.cljs:3: (def ModelContract ...)",
  ]);
});

test("ignores definitions in comments, strings, quoted data, and discarded forms", () => {
  const source = [
    "; (def ModelContract [:map])",
    '(def harmless "(def ModelContract [:map])")',
    "'(def ModelContract [:map])",
    "(quote (def ModelContract [:map]))",
    "#_(def ModelContract [:map])",
    "",
  ].join("\n");
  assert.deepEqual(findContractRedefinitions(source, "fixture.cljs"), []);
});

test("honors the reviewed allow marker on the preceding line", () => {
  const source = [";; contract-guard: allow", "(def", "  ModelContract", "  [:map])", ""].join(
    "\n",
  );
  assert.deepEqual(findContractRedefinitions(source, "fixture.cljs"), []);
});

test("terminates when a source directory symlink points back to an ancestor", (t) => {
  const root = mkdtempSync(join(tmpdir(), "contract-guard-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const nested = join(root, "src");
  mkdirSync(nested);
  writeFileSync(join(nested, "safe.cljs"), "(def harmless 1)\n");
  symlinkSync(root, join(nested, "loop"), "dir");
  assert.deepEqual(guardDirectories([root]), []);
});
