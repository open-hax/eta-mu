import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";
import { MODELS } from "../src/models.generated.js";

// Catalog feeds can omit every model for an otherwise supported provider.
// Compile the real registry against that boundary, without network access.
test("registry compiles when supported providers are absent from the catalog", () => {
	const root = fileURLToPath(new URL("../", import.meta.url));
	const fixture = mkdtempSync(join(root, ".model-catalog-"));
	try {
		cpSync(join(root, "src"), fixture, { recursive: true });
		const model = Object.values(MODELS.anthropic)[0];
		writeFileSync(join(fixture, "models.generated.ts"), `import type { Model } from "./types.js";\nexport const MODELS = { anthropic: { fixture: ${JSON.stringify(model)} satisfies Model<"anthropic-messages"> } } as const;\n`);
		writeFileSync(join(fixture, "catalog-contract.ts"), [
			'import { getModel, getModels } from "./models.js";',
			'import type { Api, Model } from "./types.js";',
			'const models: Model<Api>[] = getModels("opencode");',
			'getModel("opencode", "temporarily-unlisted");',
			'const present: Model<"anthropic-messages"> = getModel("anthropic", "fixture");',
			'// @ts-expect-error Listed providers still require valid model ids.',
			'getModel("anthropic", "invalid-model-id");',
			'void [models, present];',
		].join("\n"));
		execFileSync(join(root, "../../../node_modules/.bin/tsgo"), [
			"--noEmit", "--strict", "--skipLibCheck", "--target", "ES2022",
			"--module", "NodeNext", join(fixture, "catalog-contract.ts"),
		], { cwd: root, stdio: "inherit" });
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
});
