import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { discoverAndLoadExtensions } from "../src/core/extensions/loader.ts";

describe("ClojureScript extensions", () => {
	let tempDir;
	let extensionsDir;

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-ext-cljs-test-"));
		extensionsDir = path.join(tempDir, "extensions");
		fs.mkdirSync(extensionsDir, { recursive: true });
	});

	afterEach(() => {
		fs.rmSync(tempDir, { recursive: true, force: true });
	});

	const cljsExtension = `
(ns hello-cljs)

(defn ^:export init [pi]
  (.registerCommand pi "hello-cljs"
    #js {:description "Say hello from ClojureScript"
         :handler (fn [_args ctx]
                    (when-let [ui (.-ui ctx)]
                      (.notify ui "Hello from ClojureScript!" "info")))}))
`;

	it(
		"discovers, compiles, and loads a .cljs extension",
		async () => {
			fs.writeFileSync(path.join(extensionsDir, "hello.cljs"), cljsExtension);

			const result = await discoverAndLoadExtensions([], tempDir, tempDir);

			expect(result.errors).toHaveLength(0);
			expect(result.extensions).toHaveLength(1);
			expect(path.basename(result.extensions[0].path)).toBe("hello.cljs");
			expect(result.extensions[0].commands.has("hello-cljs")).toBe(true);
		},
		120000,
	);

	it(
		"caches compiled ClojureScript extensions",
		async () => {
			fs.writeFileSync(path.join(extensionsDir, "hello.cljs"), cljsExtension);

			const first = await discoverAndLoadExtensions([], tempDir, tempDir);
			expect(first.errors).toHaveLength(0);
			expect(first.extensions).toHaveLength(1);

			const second = await discoverAndLoadExtensions([], tempDir, tempDir);
			expect(second.errors).toHaveLength(0);
			expect(second.extensions).toHaveLength(1);
		},
		120000,
	);

	it(
		"reports compilation errors for invalid ClojureScript",
		async () => {
			fs.writeFileSync(path.join(extensionsDir, "invalid.cljs"), "(ns invalid)\n(this is not valid cljs");

			const result = await discoverAndLoadExtensions([], tempDir, tempDir);

			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].path).toContain("invalid.cljs");
			expect(result.extensions).toHaveLength(0);
		},
		120000,
	);

	it(
		"compiles a defextension-based .cljs extension",
		async () => {
			const source = [
				"(ns hello-dsl",
				"  (:require-macros [eta-mu.core :as em]))",
				"",
				"(em/defextension hello-dsl",
				"  :description \"DSL test\"",
				"  (em/command greet",
				"    :description \"Say greet\"",
				"    :handler (fn [_args ctx]",
				"               (when-let [ui (.-ui ctx)]",
				"                 (.notify ui \"Hello from DSL\" \"info\")))))",
			].join("\n");
			fs.writeFileSync(path.join(extensionsDir, "hello_dsl.cljs"), source);

			const result = await discoverAndLoadExtensions([], tempDir, tempDir);

			expect(result.errors).toHaveLength(0);
			expect(result.extensions).toHaveLength(1);
			expect(result.extensions[0].commands.has("greet")).toBe(true);
			const cmd = result.extensions[0].commands.get("greet");
			expect(cmd.description).toBe("Say greet");
		},
		120000,
	);

	it(
		"compiles a defextension tool",
		async () => {
			const source = [
				"(ns tool-dsl",
				"  (:require-macros [eta-mu.core :as em]))",
				"",
				"(em/defextension tool-dsl",
				"  :description \"Tool DSL test\"",
				"  (em/tool \"echo-tool\"",
				"    :label \"Echo\"",
				"    :description \"Echoes a message\"",
				"    :parameters {:message {:type \"string\" :description \"Message\"}}",
				"    :execute (fn [_tcid params _signal _onUpdate _ctx]",
				"               (let [msg (aget params \"message\")]",
				"                 #js {:content #js [#js {:type \"text\" :text msg}]}))))",
			].join("\n");
			fs.writeFileSync(path.join(extensionsDir, "tool_dsl.cljs"), source);

			const result = await discoverAndLoadExtensions([], tempDir, tempDir);

			expect(result.errors).toHaveLength(0);
			expect(result.extensions).toHaveLength(1);
			expect(result.extensions[0].tools.has("echo-tool")).toBe(true);
			const tool = result.extensions[0].tools.get("echo-tool");
			expect(tool.definition.label).toBe("Echo");
			expect(tool.definition.parameters.type).toBe("object");
		},
		120000,
	);

	it(
		"compiles a defextension event handler",
		async () => {
			const source = [
				"(ns event-dsl",
				"  (:require-macros [eta-mu.core :as em]))",
				"",
				"(em/defextension event-dsl",
				"  :description \"Event DSL test\"",
				"  (em/on \"ping\"",
				"    :handler (fn [event] (js/console.log event))))",
			].join("\n");
			fs.writeFileSync(path.join(extensionsDir, "event_dsl.cljs"), source);

			const result = await discoverAndLoadExtensions([], tempDir, tempDir);

			expect(result.errors).toHaveLength(0);
			expect(result.extensions).toHaveLength(1);
			expect(result.extensions[0].handlers.has("ping")).toBe(true);
			const handlers = result.extensions[0].handlers.get("ping");
			expect(handlers).toHaveLength(1);
		},
		120000,
	);
});
