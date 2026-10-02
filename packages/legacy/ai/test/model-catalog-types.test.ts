import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { expect, test } from "vitest";
import type { Model } from "../src/types.js";

// Catalog feeds can omit every model for an otherwise supported provider.
// Compile the real registry against that boundary, without network access.
test("registry compiles when supported providers are absent from the catalog", () => {
	const root = fileURLToPath(new URL("../", import.meta.url));
	const fixture = mkdtempSync(join(root, ".model-catalog-"));
	try {
		cpSync(join(root, "src"), fixture, { recursive: true });
		const model: Model<"anthropic-messages"> = {
			id: "fixture", name: "Synthetic fixture", api: "anthropic-messages",
			provider: "anthropic", baseUrl: "https://fixture.invalid", reasoning: false,
			input: ["text"], cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
			contextWindow: 1024, maxTokens: 128,
		};
		writeFileSync(join(fixture, "models.generated.ts"), `import type { Model } from "./types.js";\nexport const MODELS = { anthropic: { fixture: ${JSON.stringify(model)} satisfies Model<"anthropic-messages"> } } as const;\n`);
		writeFileSync(join(fixture, "catalog-contract.ts"), [
			'import { getModel, getModels } from "./models.js";',
			'import type { Api, Model } from "./types.js";',
			'const models: Model<Api>[] = getModels("opencode");',
			'const absent: Model<Api> | undefined = getModel("opencode", "temporarily-unlisted");',
			'// @ts-expect-error Absent-provider results must be checked before use.',
			'const unsafe: Model<Api> = getModel("opencode", "temporarily-unlisted");',
			'if (absent) { const checked: Model<Api> = absent; void checked; }',
			'const provider: "anthropic" | "opencode" = Math.random() ? "anthropic" : "opencode";',
			'// @ts-expect-error A provider union can include an omitted provider.',
			'const unsafeUnion: Model<Api> = getModel(provider, "fixture");',
			'const present: Model<"anthropic-messages"> = getModel("anthropic", "fixture");',
			'// @ts-expect-error Listed providers still require valid model ids.',
			'getModel("anthropic", "invalid-model-id");',
			'void [models, present, unsafe, unsafeUnion];',
		].join("\n"));
		execFileSync(join(root, "../../../node_modules/.bin/tsgo"), [
			"--noEmit", "--strict", "--skipLibCheck", "--target", "ES2022",
			"--module", "NodeNext", join(fixture, "catalog-contract.ts"),
		], { cwd: root, stdio: "inherit" });
		execFileSync(join(root, "../../../node_modules/.bin/tsgo"), [
			"--strict", "--skipLibCheck", "--target", "ES2022", "--module", "NodeNext",
			"--outDir", join(fixture, "out"), join(fixture, "models.ts"),
		], { cwd: root, stdio: "inherit" });
		const output = execFileSync(process.execPath, ["--input-type=module", "-e", [
			`import { getModel, getModels } from ${JSON.stringify(pathToFileURL(join(fixture, "out/models.js")).href)};`,
			'console.log(JSON.stringify([getModel("opencode", "temporarily-unlisted") === undefined, getModels("opencode"), getModel("anthropic", "fixture").api]));',
		].join("\n")], { cwd: root, encoding: "utf8" });
		expect(JSON.parse(output)).toEqual([true, [], "anthropic-messages"]);
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
});
