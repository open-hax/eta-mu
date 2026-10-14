// SPDX-License-Identifier: GPL-3.0-or-later
// Fixture-only adapter for authored deterministic workflow programs. Generic
// child_process shell launches remain refused. Registration retains fixed argv
// and source custody; Node descendants need actual audited kernel ancestry.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export function runTrustedWorkflowFixture(ownerURL, args, options, expectedNodeChildren = 0) {
  const match = /^--require ("[^"]+"|\/[^ \t\r\n]+)$/.exec(process.env.NODE_OPTIONS ?? "");
  assert.ok(match, "one actual early audit preload is required for a trusted workflow fixture");
  const preload = match[1].startsWith('"') ? JSON.parse(match[1]) : match[1];
  assert.ok(require.cache[preload], "the actual preload must already be loaded");
  const fixture = require(preload).registerTrustedWorkflowFixture(ownerURL,args,expectedNodeChildren);
  return fixture.run(options);
}
