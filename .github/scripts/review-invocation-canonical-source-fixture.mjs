// SPDX-License-Identifier: GPL-3.0-or-later
// Tests consume the exact source-built C136 callback. No private review law.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
const file=process.env.REVIEW_TEST_CANONICAL_VERIFIER_FILE;
if (!file || !path.isAbsolute(file)) throw new Error("Provide an absolute source-built C136 verifier for canonical caller tests");
if (createHash("sha256").update(fs.readFileSync(file)).digest("hex")!=="d9fea235fddec9581ba1be959e596f32b82588f78cef5fd76d55f04d24b91030") throw new Error("Source-built C136 verifier bytes differ from qualified callback");
const verifier=createRequire(import.meta.url)(file);
export const prepare=(full,manifest,tools,submissionFile)=>verifier.prepareReviewInvocationContext(full,manifest,tools,submissionFile);
export const verify=(response,body,context)=>verifier.verifyReviewInvocation(response,body,context);
