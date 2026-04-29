#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

process.env.ETA_MU_CLI = "true";
process.env.PI_CODING_AGENT = "true";

const defaultEtaMuExtensions = [
	"dist/pi/cljs-receipt-river/index.ts",
	"dist/pi/cljs-session-mycology/index.ts",
	"dist/pi/cljs-contract-runtime/index.ts",
	"dist/pi/cljs-contract-runtime-v2/index.ts",
	"dist/pi/cljs-opmf-contract-gate/index.ts",
	"dist/pi/cljs-opencode-global-instructions/index.ts",
	"dist/pi/cljs-bootstrap/index.ts",
	"dist/pi/cljs-task-timing/index.ts",
	"dist/pi/cljs-graph-memory/index.ts",
	"dist/pi/cljs-websearch-open-hax/index.ts",
	"dist/pi/cljs-image-render/index.ts",
	"dist/pi/cljs-chronos/index.ts",
	"dist/pi/cljs-custom-providers/index.ts",
];

function injectDefaultEtaMuExtensions() {
	if (process.env.ETA_MU_NO_DEFAULT_EXTENSIONS === "1") return;
	if (process.argv.includes("--no-extensions") || process.argv.includes("-ne")) return;

	const require = createRequire(import.meta.url);
	const extensionsPackageJson = require.resolve("@open-hax/eta-mu-extensions/package.json");
	const extensionsRoot = dirname(extensionsPackageJson);
	const extensionArgs = defaultEtaMuExtensions.flatMap((extensionPath) => ["--extension", join(extensionsRoot, extensionPath)]);
	process.argv.splice(2, 0, ...extensionArgs);
}

injectDefaultEtaMuExtensions();

const codingAgentIndex = fileURLToPath(await import.meta.resolve("@mariozechner/pi-coding-agent"));
const codingAgentCli = join(dirname(codingAgentIndex), "cli.js");

await import(pathToFileURL(codingAgentCli).href);
