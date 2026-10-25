// SPDX-License-Identifier: GPL-3.0-or-later
// Node test loader only; evaluator setup and assertions live in ClojureScript.
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const requireFromEtaMu = createRequire(new URL("../../packages/eta-mu/package.json", import.meta.url));
const { loadFile } = await import(pathToFileURL(requireFromEtaMu.resolve("nbb")).href);
const fixture = await loadFile(fileURLToPath(new URL("./eta_mu/extern/assessment_timeout_expression_fixture.cljs", import.meta.url)));

export const evaluateTimeout = fixture.evaluateTimeout;
export const assertNumericTimeout = fixture.assertNumericTimeout;
export const assertNativeBudgetFixture = fixture.assertNativeBudgetFixture;
