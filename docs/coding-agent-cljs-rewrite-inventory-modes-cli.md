# Coding Agent CLJS Rewrite — Modes & CLI Inventory

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`  
> Scope: `packages/legacy/coding-agent/src/modes/`, `src/cli/`, `src/cli.ts`, `src/main.ts`, plus `src/bun/cli.ts`.

## Executive Summary

This inventory catalogs the interactive TUI mode, RPC mode, print mode, CLI argument parsing, and the `eta-mu` binary entry points. The goal is to make state machines, command routes, public SDK surfaces, and raw JS interop explicit before Phase 5 porting.

Total TypeScript files inventoried: 47 source files plus 3 theme JSON files and 1 PNG asset.

## Namespace Destination Map

Per the parent epic, files are classified as:

| Layer | Responsibility | Target CLJS namespace pattern |
|-------|----------------|-------------------------------|
| `domain` | Session decisions, tool dispatch, mode routing | `eta_mu.coding.domain.*` |
| `shape` | Config↔session transforms, DTO compatibility | `eta_mu.coding.shape.*` |
| `law` | Malli schemas for CLI args, RPC commands, events | `eta_mu.coding.law.*` |
| `extern` | FS, git, bash, clipboard, SDK, raw JS interop | `eta_mu.coding.extern.*` |
| `infra` | Session orchestration, extension runner, package manager | `eta_mu.coding.infra.*` |
| `cli` | `eta-mu` binary facade and command routing | `eta_mu.coding.cli.*` |

## Binary & Package Contract

### `package.json`

| Field | Value | Preservation note |
|-------|-------|-------------------|
| `name` | `@open-hax/eta-mu-cli` | Must not change. |
| `bin` | `eta-mu`, `eta-mu-beta`, `pi` → `dist/cli.js` | Keep binary names; `dist/cli.js` remains the Node entry. |
| `main` | `./dist/index.js` | Public SDK entry; preserve exports. |
| `exports["."]` | `./dist/index.js` / `./dist/index.d.ts` | Re-exported by `src/index.ts`. |
| `exports["./hooks"]` | `./dist/core/hooks/index.js` | Extension hook contract. |
| `files` | `dist`, `docs`, `examples`, `CHANGELOG.md` | `dist/` layout must keep `modes/interactive/theme/*.json` and `assets/*.png`. |

### Build-time copy rules

```json
{
  "copy-assets": "shx mkdir -p dist/modes/interactive/theme && shx cp src/modes/interactive/theme/*.json dist/modes/interactive/theme/ && shx mkdir -p dist/modes/interactive/assets && shx cp src/modes/interactive/assets/*.png dist/modes/interactive/assets/ ...",
  "copy-binary-assets": "... cp src/modes/interactive/theme/*.json dist/theme/ && ... cp src/modes/interactive/assets/*.png dist/assets/ ..."
}
```

These rules must be preserved or replicated in the CLJS build so theme JSON and the Clankolas PNG survive in both the library and the compiled binary layouts.

## Entry-Point Facades

### `src/cli.ts` (binary entry)

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.entry` (thin Node shell) |
| Public exports | None (side-effect entry). |
| Consumers inside `packages/legacy` | `package.json` `bin`; `src/bun/cli.ts` re-imports it. |
| Raw JS interop | `process.title`, `process.env`, `process.argv`, `process.emitWarning`, `node:module.createRequire`, `node:path`, `undici.setGlobalDispatcher`. |
| Dependencies | Injects default `--extension` flags from `@open-hax/eta-mu-extensions/package.json`; calls `main()` from `src/main.ts`. |
| Thin shell? | **Yes** — keep as a tiny TS/JS shim that requires the CLJS runtime and calls `-main`. |

Key behavior:
- Sets `ETA_MU_CLI`, `ETA_MU_CODING_AGENT`, `PI_CODING_AGENT` env flags.
- Reads `@open-hax/eta-mu-extensions` `package.json` `pi.extensions` and prepends `--extension <abs-path>` to `process.argv` unless `--no-extensions`/`-ne`/`ETA_MU_NO_DEFAULT_EXTENSIONS=1`.
- Configures `undici` global dispatcher with `bodyTimeout: 0, headersTimeout: 0`.

### `src/main.ts` (orchestrator)

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.main` |
| Public exports | `MainOptions`, `main(args, options?)` |
| Consumers inside `packages/legacy` | `src/cli.ts`, `src/index.ts`, `src/bun/cli.ts` (indirectly). |
| Raw JS interop | `process.stdin`/`process.stdout`/`process.stderr`, `process.exit`, `process.cwd`, `process.env`, `node:readline`, `node:path`. |
| Dependencies | Core: `agent-session-runtime`, `agent-session-services`, `session-manager`, `settings-manager`, `auth-storage`, `model-resolver`, `model-registry`, `resource-loader`, `keybindings`. Modes: `InteractiveMode`, `runPrintMode`, `runRpcMode`. TUI: `ProcessTerminal`, `TUI`, `setKeybindings`. AI: model/scoped-model types. Extern: `export-html`, `version-check`, `package-manager-cli`, `migrations`. |
| Thin shell? | **Yes, but large** — keep as TS facade that parses CLI and delegates to CLJS `main` implementation; much of the argument→session option mapping belongs in `shape.*`/`cli.*`. |

Key responsibilities:
1. Offline mode env override.
2. Package/config command early-out (`handlePackageCommand`, `handleConfigCommand`).
3. `kanban` subcommand routing (spawns `@open-hax/kanban-legacy/dist/cli.js`).
4. CLI argument parsing (`parseArgs`).
5. Session manager creation (create/resume/fork/continue/in-memory).
6. Missing-session-cwd prompt (uses `ExtensionSelectorComponent` + TUI).
7. Runtime service creation (`createAgentSessionRuntime`).
8. Mode dispatch: `interactive` | `print`/`json` | `rpc`.
9. Version, export, list-models, help short-circuits.

### `src/bun/cli.ts` (binary compile entry)

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.bun-entry` (thin shell) |
| Public exports | None. |
| Consumers inside `packages/legacy` | `bun build --compile ./dist/bun/cli.js`. |
| Raw JS interop | `process.title`, `process.emitWarning`. |
| Dependencies | `src/config.js` (`APP_NAME`), `src/bun/restore-sandbox-env.js`, `src/bun/register-bedrock.js`, `src/cli.js`. |
| Thin shell? | **Yes** — keep as TS shell; the CLJS runtime should be loaded before the Bedrock register side effect if possible, or this file becomes a minimal Bun-specific shim. |

## CLI Helpers (`src/cli/`)

### `src/cli/args.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.args` (`shape` + `law`) |
| Public exports | `Mode`, `Args`, `isValidThinkingLevel`, `parseArgs`, `printHelp` |
| Consumers inside `packages/legacy` | `src/main.ts`, `src/core/model-resolver.ts` (imports `isValidThinkingLevel`). |
| Raw JS interop | `process.argv` style array only; chalk for help output. |
| Dependencies | `@open-hax/eta-mu-agent-core` (`ThinkingLevel`), `src/config.js`, `src/core/extensions/types.js` (`ExtensionFlag`). |
| Full port? | **Yes** — argument parsing and the `Args` schema are a natural `law`/`shape` target; `printHelp` can stay in a TS shell or move to `cli.*`. |

CLI surface (in `Args`):
- `--provider`, `--model`, `--api-key`, `--system-prompt`, `--append-system-prompt`
- `--thinking`, `--continue`/`--resume`, `--session`, `--fork`, `--session-dir`, `--no-session`
- `--models`, `--tools`/`--no-tools`/`--no-builtin-tools`
- `--extension`/`--no-extensions`, `--skill`/`--no-skills`, `--prompt-template`/`--no-prompt-templates`, `--theme`/`--no-themes`, `--no-context-files`
- `--mode`, `--print`, `--export`, `--list-models`, `--offline`, `--verbose`, `--help`, `--version`
- Positional `@file` args, positional messages, extension `--unknown-flags`.

### `src/cli/file-processor.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.extern.file-processor` |
| Public exports | `ProcessedFiles`, `ProcessFileOptions`, `processFileArguments` |
| Consumers inside `packages/legacy` | `src/main.ts`. |
| Raw JS interop | `node:fs/promises` (`access`, `readFile`, `stat`), `path.resolve`. |
| Dependencies | `@open-hax/eta-mu-ai` (attachment/audio/image types, `audioFormatFromMimeType`), `src/core/tools/path-utils.js`, `src/utils/image-resize.js`, `src/utils/mime.js`. |
| Full port? | **Yes** — mostly boundary adapter work; image resizing is an `extern` concern. |

### `src/cli/initial-message.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.shape.initial-message` |
| Public exports | `InitialMessageInput`, `InitialMessageResult`, `buildInitialMessage` |
| Consumers inside `packages/legacy` | `src/main.ts`. |
| Raw JS interop | None. |
| Dependencies | `@open-hax/eta-mu-ai` types, `src/cli/args.js` types. |
| Full port? | **Yes** — pure data transform. |

### `src/cli/list-models.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.list-models` |
| Public exports | `listModels` |
| Consumers inside `packages/legacy` | `src/main.ts`. |
| Raw JS interop | `process.stdout` via `console.log`. |
| Dependencies | `@open-hax/eta-mu-ai`, `@open-hax/eta-mu-tui` (`fuzzyFilter`), `src/core/auth-guidance.js`, `src/core/model-registry.js`. |
| Full port? | **Yes** — small table-formatting helper. |

### `src/cli/session-picker.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.session-picker` |
| Public exports | `selectSession` |
| Consumers inside `packages/legacy` | `src/main.ts`. |
| Raw JS interop | `process.stdin`/`process.stdout` via TUI. |
| Dependencies | `@open-hax/eta-mu-tui`, `src/core/keybindings.js`, `src/core/session-manager.js`, `src/modes/interactive/components/session-selector.js`. |
| Full port? | **Yes** — thin TUI wrapper around `SessionSelectorComponent`. |

### `src/cli/config-selector.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.config-selector` |
| Public exports | `ConfigSelectorOptions`, `selectConfig` |
| Consumers inside `packages/legacy` | `src/package-manager-cli.ts`. |
| Raw JS interop | TUI. |
| Dependencies | `@open-hax/eta-mu-tui`, `src/core/package-manager.js`, `src/core/settings-manager.js`, `src/modes/interactive/components/config-selector.js`, `src/modes/interactive/theme/theme.js`. |
| Full port? | **Yes** — small wrapper. |

## Mode Orchestration (`src/modes/`)

### `src/modes/index.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.modes` (re-export barrel) |
| Public exports | `InteractiveMode`, `InteractiveModeOptions`, `PrintModeOptions`, `runPrintMode`, `ModelInfo`, `RpcClient`, `RpcClientOptions`, `RpcEventListener`, `runRpcMode`, `RpcCommand`, `RpcResponse`, `RpcSessionState` |
| Consumers inside `packages/legacy` | `src/main.ts`, `src/index.ts`. |
| Raw JS interop | None. |
| Dependencies | Re-exports only. |
| Thin shell? | **Yes** — keep as a re-export shim while submodules move to CLJS. |

### `src/modes/print-mode.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.print-mode` |
| Public exports | `PrintModeOptions`, `runPrintMode` |
| Consumers inside `packages/legacy` | `src/modes/index.ts`, `src/main.ts`. |
| Raw JS interop | `process.stdout` via `writeRawStdout`/`flushRawStdout`, `process.on(SIGTERM/SIGHUP)`, `process.exit`. |
| Dependencies | `@open-hax/eta-mu-ai`, `src/core/agent-session-runtime.js`, `src/core/output-guard.js`, `src/utils/shell.js`. |
| Full port? | **Yes** — headless, mostly event-driven. |

Behavior:
- Subscribes to session events; in `json` mode writes every event as JSONL; in `text` mode writes only the final assistant text block.
- Handles SIGTERM/SIGHUP by disposing runtime and killing detached children.
- Supports `runtimeHost.setRebindSession` for session switches/forks.

## Interactive Mode (`src/modes/interactive/`)

### `src/modes/interactive/interactive-mode.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.interactive-mode` |
| Public exports | `InteractiveModeOptions`, `InteractiveMode`, `isApiKeyLoginProvider`, `getApiKeyProviderDisplayName` |
| Consumers inside `packages/legacy` | `src/modes/index.ts`, `src/main.ts`. |
| Raw JS interop | TUI (`ProcessTerminal`, `TUI`), `process.stdin`/`process.stdout`, `process.on/off(SIGTERM/SIGHUP/SIGINT/SIGCONT/SIGTSTP)`, `process.exit`, `process.kill`, `process.env`, `node:fs`, `node:os`, `node:path`, `node:crypto`, `child_process.spawn`/`spawnSync`, clipboard image read, temp file write. |
| Dependencies | **AI/Agent**: `@open-hax/eta-mu-agent-core`, `@open-hax/eta-mu-ai`. **TUI**: most of `@open-hax/eta-mu-tui`. **Core**: `agent-session`, `agent-session-runtime`, `extensions`, `footer-data-provider`, `keybindings`, `messages`, `model-resolver`, `package-manager`, `resource-loader`, `session-cwd`, `session-manager`, `slash-commands`, `source-info`, `tools/truncate`. **Utils**: `changelog`, `clipboard`, `clipboard-image`, `git`, `shell`, `tools-manager`, `version-check`. **Components**: all interactive components. **Theme**: `theme.js`. |
| Full port? | **Yes** — this is the largest single file (~4,600 lines) and the heart of Phase 5. |

Interactive mode state machine:

```
[constructor]
  → create TUI, containers, editor, footer, keybindings
  → initTheme
[init]
  → register signal handlers
  → load changelog
  → ensure fd/rg tools
  → build header / chat / pending / status / widget / editor / footer layout
  → rebindCurrentSession (bind extensions + subscribe to agent)
  → renderInitialMessages
[run]
  → async checks: version, package updates, tmux keyboard
  → show warnings (migrated providers, model fallback, anthropic subscription)
  → process initialMessage / initialMessages
  → loop: await getUserInput → session.prompt(input)
```

Key event handler states (`handleEvent`):
- `agent_start` — show loader, clear retry state.
- `queue_update` — refresh pending messages display.
- `session_info_changed` — update title/footer.
- `message_start` — add user/custom/assistant message component.
- `message_update` — stream content, spawn `ToolExecutionComponent` for tool calls.
- `message_end` — finalize tools, clear streaming component.
- `tool_execution_start/update/end` — update matching `ToolExecutionComponent`.
- `agent_end` — stop loader, check shutdown.
- `compaction_start/end` — loader, rebuild chat, flush queued messages.
- `auto_retry_start/end` — countdown loader, escape-to-abort.

Built-in slash commands handled in `setupEditorSubmitHandler`:
`/settings`, `/scoped-models`, `/model`, `/export`, `/import`, `/share`, `/copy`, `/name`, `/session`, `/changelog`, `/hotkeys`, `/fork`, `/clone`, `/tree`, `/login`, `/logout`, `/new`, `/compact`, `/reload`, `/debug`, `/arminsayshi`, `/dementedelves`, `/resume`, `/quit`.

Extension UI context (`createExtensionUIContext`) exposes:
`select`, `confirm`, `input`, `notify`, `onTerminalInput`, `setStatus`, `setWorkingMessage`, `setWorkingVisible`, `setWorkingIndicator`, `setHiddenThinkingLabel`, `setWidget`, `setFooter`, `setHeader`, `setTitle`, `custom`, `pasteToEditor`, `setEditorText`, `getEditorText`, `editor`, `addAutocompleteProvider`, `setEditorComponent`, `theme`, `getAllThemes`, `getTheme`, `setTheme`, `getToolsExpanded`, `setToolsExpanded`.

## Interactive Components (`src/modes/interactive/components/`)

Each component maps to `eta_mu.coding.cli.interactive.components.*` (or `eta_mu.coding.cli.*`).

| File | Public exports | Consumers | Proposed CLJS ns | Notes |
|------|----------------|-----------|------------------|-------|
| `components/index.ts` | Barrel of all components | `src/index.ts` | `eta_mu.coding.cli.interactive.components` | Keep as TS re-export shim. |
| `armin.ts` | `ArminComponent` | Interactive easter egg | `eta_mu.coding.cli.interactive.armin` | Pure TUI animation; full port. |
| `assistant-message.ts` | `AssistantMessageComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.assistant-message` | Renders assistant text/thinking; wraps OSC133 zone markers. |
| `bash-execution.ts` | `BashExecutionComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.bash-execution` | Displays bash command + streaming output; uses `truncateTail`. |
| `bordered-loader.ts` | `BorderedLoader` | (exported; used by extensions) | `eta_mu.coding.cli.interactive.bordered-loader` | Full port. |
| `branch-summary-message.ts` | `BranchSummaryMessageComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.branch-summary` | Full port. |
| `compaction-summary-message.ts` | `CompactionSummaryMessageComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.compaction-summary` | Full port. |
| `config-selector.ts` | `ConfigSelectorComponent` | `cli/config-selector.ts` | `eta_mu.coding.cli.interactive.config-selector` | Full port. |
| `countdown-timer.ts` | `CountdownTimer` | `extension-selector.ts`, `extension-input.ts`, `interactive-mode.ts` | `eta_mu.coding.cli.interactive.countdown-timer` | Full port. |
| `custom-editor.ts` | `CustomEditor` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.custom-editor` | Extends TUI `Editor`; wires app keybindings and action handlers. |
| `custom-message.ts` | `CustomMessageComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.custom-message` | Extension-rendered custom messages. |
| `daxnuts.ts` | `DaxnutsComponent` | Interactive easter egg | `eta_mu.coding.cli.interactive.daxnuts` | Pure TUI animation. |
| `diff.ts` | `RenderDiffOptions`, `renderDiff` | `tool-execution.ts` | `eta_mu.coding.cli.interactive.diff` | Uses `diff` library; full port. |
| `dynamic-border.ts` | `DynamicBorder` | Many components | `eta_mu.coding.cli.interactive.dynamic-border` | Full port. |
| `earendil-announcement.ts` | `EarendilAnnouncementComponent` | Interactive easter egg | `eta_mu.coding.cli.interactive.earendil` | Loads bundled PNG asset. |
| `extension-editor.ts` | `ExtensionEditorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.extension-editor` | Spawns `$VISUAL`/`$EDITOR` via `spawnSync`. |
| `extension-input.ts` | `ExtensionInputComponent`, `ExtensionInputOptions` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.extension-input` | Full port. |
| `extension-selector.ts` | `ExtensionSelectorComponent`, `ExtensionSelectorOptions` | `interactive-mode.ts`, `main.ts`, many selectors | `eta_mu.coding.cli.interactive.extension-selector` | Reusable list selector with timeout. |
| `footer.ts` | `FooterComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.footer` | Reads session + `FooterDataProvider`. |
| `keybinding-hints.ts` | `keyHint`, `keyText`, `rawKeyHint` | Many components | `eta_mu.coding.cli.interactive.keybinding-hints` | Pure theme/text helpers. |
| `login-dialog.ts` | `LoginDialogComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.login-dialog` | OAuth/API-key login dialog; uses `child_process.exec` for browser open. |
| `model-selector.ts` | `ModelSelectorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.model-selector` | Full port. |
| `oauth-selector.ts` | `AuthSelectorProvider`, `OAuthSelectorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.oauth-selector` | Full port. |
| `scoped-models-selector.ts` | `ModelsCallbacks`, `ModelsConfig`, `ScopedModelsSelectorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.scoped-models-selector` | Full port. |
| `session-selector.ts` | `SessionSelectorComponent` | `interactive-mode.ts`, `cli/session-picker.ts` | `eta_mu.coding.cli.interactive.session-selector` | Full port; spawns `$EDITOR` for rename. |
| `session-selector-search.ts` | `SortMode`, `NameFilter`, `ParsedSearchQuery`, `MatchResult`, `hasSessionName`, `parseSearchQuery`, `matchSession`, `filterAndSortSessions` | `session-selector.ts` | `eta_mu.coding.cli.interactive.session-search` | Pure data transform. |
| `settings-selector.ts` | `SettingsConfig`, `SettingsCallbacks`, `SettingsSelectorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.settings-selector` | Full port. |
| `show-images-selector.ts` | `ShowImagesSelectorComponent` | (exported; extension usage) | `eta_mu.coding.cli.interactive.show-images-selector` | Full port. |
| `skill-invocation-message.ts` | `SkillInvocationMessageComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.skill-invocation` | Full port. |
| `theme-selector.ts` | `ThemeSelectorComponent` | (exported; extension usage) | `eta_mu.coding.cli.interactive.theme-selector` | Full port. |
| `thinking-selector.ts` | `ThinkingSelectorComponent` | (exported; extension usage) | `eta_mu.coding.cli.interactive.thinking-selector` | Full port. |
| `tool-execution.ts` | `ToolExecutionComponent`, `ToolExecutionOptions` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.tool-execution` | Renders tool calls/results/diffs/images; depends on `createAllToolDefinitions`, `image-convert`. |
| `tree-selector.ts` | `FilterMode`, `TreeSelectorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.tree-selector` | Full port. |
| `user-message.ts` | `UserMessageComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.user-message` | Full port. |
| `user-message-selector.ts` | `UserMessageSelectorComponent` | `interactive-mode.ts` | `eta_mu.coding.cli.interactive.user-message-selector` | Full port. |
| `visual-truncate.ts` | `VisualTruncateResult`, `truncateToVisualLines` | `bash-execution.ts`, `index.ts` | `eta_mu.coding.cli.interactive.visual-truncate` | Pure text utility. |

## Theme System (`src/modes/interactive/theme/`)

### `theme.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.extern.theme` |
| Public exports | `ThemeColor`, `ThemeBg`, `Theme`, `ThemeInfo`, `getAvailableThemes`, `getAvailableThemesWithPaths`, `loadThemeFromPath`, `getThemeByName`, `theme` (global proxy), `setRegisteredThemes`, `initTheme`, `setTheme`, `setThemeInstance`, `onThemeChange`, `stopThemeWatcher`, `getResolvedThemeColors`, `isLightTheme`, `getThemeExportColors`, `highlightCode`, `getLanguageFromPath`, `getMarkdownTheme`, `getSelectListTheme`, `getEditorTheme`, `getSettingsListTheme` |
| Consumers inside `packages/legacy` | `src/index.ts`, `src/modes/interactive/interactive-mode.ts`, `src/modes/interactive/components/*`, `src/core/agent-session.ts`, `src/core/resource-loader.ts`, `src/modes/rpc/rpc-mode.ts`. |
| Raw JS interop | `node:fs` (read/watch), `node:path`, `process.env` (`COLORTERM`, `WT_SESSION`, `TERM`, `TERM_PROGRAM`, `COLORFGBG`), `cli-highlight`, `chalk`. |
| Dependencies | `@open-hax/eta-mu-tui` theme types, `src/config.js`, `src/core/source-info.js`, `src/utils/fs-watch.js`. |
| Full port? | **Yes** — theme loading, color conversion, syntax highlighting. The global `theme` proxy uses `globalThis[Symbol.for("@open-hax/eta-mu-cli:theme")]` to survive jiti/tsx module duplication; CLJS can replace this with a normal atom/var. |

### Theme JSON assets

| File | Purpose | Copy rule |
|------|---------|-----------|
| `dark.json` | Default dark theme | `dist/modes/interactive/theme/dark.json` and `dist/theme/dark.json` |
| `light.json` | Default light theme | `dist/modes/interactive/theme/light.json` and `dist/theme/light.json` |
| `theme-schema.json` | Documentation/validation reference | Copy to `dist/modes/interactive/theme/theme-schema.json` (currently not loaded at runtime). |

### Image asset

| File | Purpose | Copy rule |
|------|---------|-----------|
| `assets/clankolas.png` | Earendil announcement image | `dist/modes/interactive/assets/clankolas.png` and `dist/assets/clankolas.png` |

## RPC Mode (`src/modes/rpc/`)

### `src/modes/rpc/jsonl.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.shape.jsonl` |
| Public exports | `serializeJsonLine`, `attachJsonlLineReader` |
| Consumers inside `packages/legacy` | `src/modes/rpc/rpc-mode.ts`, `src/modes/rpc/rpc-client.ts`. |
| Raw JS interop | `node:stream.Readable`, `node:string_decoder.StringDecoder`, stream `data`/`end` events. |
| Dependencies | None. |
| Full port? | **Yes** — small pure utility; keep strict LF framing contract. |

### `src/modes/rpc/rpc-types.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.law.rpc` |
| Public exports | `RpcCommand`, `RpcSlashCommand`, `RpcSessionState`, `RpcResponse`, `RpcExtensionUIRequest`, `RpcExtensionUIResponse`, `RpcCommandType` |
| Consumers inside `packages/legacy` | `src/modes/index.ts`, `src/index.ts`, `src/modes/rpc/rpc-mode.ts`, `src/modes/rpc/rpc-client.ts`. |
| Raw JS interop | None. |
| Dependencies | `@open-hax/eta-mu-agent-core`, `@open-hax/eta-mu-ai`, `src/core/agent-session.js`, `src/core/bash-executor.js`, `src/core/compaction/index.js`, `src/core/source-info.js`. |
| Full port? | **Yes** — convert to Malli schemas in `law.*`. |

`RpcCommand` union covers:
- Prompting: `prompt`, `steer`, `follow_up`, `abort`, `new_session`
- State: `get_state`
- Model: `set_model`, `cycle_model`, `get_available_models`
- Thinking: `set_thinking_level`, `cycle_thinking_level`
- Queue modes: `set_steering_mode`, `set_follow_up_mode`
- Compaction: `compact`, `set_auto_compaction`
- Retry: `set_auto_retry`, `abort_retry`
- Bash: `bash`, `abort_bash`
- Session: `get_session_stats`, `export_html`, `switch_session`, `fork`, `clone`, `get_fork_messages`, `get_last_assistant_text`, `set_session_name`
- Messages: `get_messages`
- Commands: `get_commands`

### `src/modes/rpc/rpc-mode.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.rpc-mode` |
| Public exports | `runRpcMode`, re-exported RPC types |
| Consumers inside `packages/legacy` | `src/modes/index.ts`, `src/main.ts`. |
| Raw JS interop | `process.stdin` JSONL reader, `process.stdout` via `writeRawStdout`, `process.on(SIGTERM/SIGHUP)`, `process.exit`, `node:crypto.randomUUID`. |
| Dependencies | `src/core/agent-session-runtime.js`, `src/core/extensions/index.js`, `src/core/output-guard.js`, `src/utils/shell.js`, `src/modes/interactive/theme/theme.js`, `src/modes/rpc/jsonl.js`, `src/modes/rpc/rpc-types.js`. |
| Full port? | **Yes** — headless protocol handler. |

RPC mode state machine:

```
[runRpcMode]
  → takeOverStdout
  → rebindSession (subscribe to agent events, output them as JSONL)
  → registerSignalHandlers
  → attachJsonlLineReader on process.stdin
  → for each line:
      - parse JSON
      - if extension_ui_response → resolve pending request
      - else handleCommand → output response
      - checkShutdownRequested
  → on stdin end → shutdown
  → never resolves
```

`ExtensionUIContext` in RPC mode is a **reduced adapter**: it supports `select`, `confirm`, `input`, `notify`, `setStatus`, `setTitle`, `setEditorText`, `editor`, and `setWidget` (string arrays only). TUI-only capabilities (`setWorkingMessage`, `setWorkingVisible`, `setWorkingIndicator`, `setHiddenThinkingLabel`, `setFooter`, `setHeader`, `custom`, `onTerminalInput`, `addAutocompleteProvider`, `setEditorComponent`, theme switching) are no-ops or return unsupported.

### `src/modes/rpc/rpc-client.ts`

| Attribute | Value |
|-----------|-------|
| Proposed CLJS namespace | `eta_mu.coding.cli.rpc-client` |
| Public exports | `RpcClientOptions`, `ModelInfo`, `RpcEventListener`, `RpcClient` |
| Consumers inside `packages/legacy` | `src/modes/index.ts`, `src/index.ts`; used by external SDK consumers and tests. |
| Raw JS interop | `node:child_process.spawn`, `process.stdout`/`stderr`, `process.env`. |
| Dependencies | `@open-hax/eta-mu-agent-core`, `@open-hax/eta-mu-ai`, `src/core/agent-session.js`, `src/core/bash-executor.js`, `src/core/compaction/index.js`, `src/modes/rpc/jsonl.js`, `src/modes/rpc/rpc-types.js`. |
| Full port? | **Yes** — but may remain a TS wrapper if consumers expect a Node `ChildProcess` API. Recommendation: port logic to CLJS and expose a thin TS factory that spawns `node dist/cli.js --mode rpc`. |

`RpcClient` API:
`start(cliPath?)`, `stop()`, `onEvent(listener)`, `getStderr()`, `prompt`, `steer`, `followUp`, `abort`, `newSession`, `getState`, `setModel`, `cycleModel`, `getAvailableModels`, `setThinkingLevel`, `cycleThinkingLevel`, `setSteeringMode`, `setFollowUpMode`, `compact`, `setAutoCompaction`, `setAutoRetry`, `abortRetry`, `bash`, `abortBash`, `getSessionStats`, `exportHtml`, `switchSession`, `fork`, `clone`, `getForkMessages`, `getLastAssistantText`, `setSessionName`, `getMessages`, `getCommands`, `waitForIdle`, `collectEvents`, `promptAndWait`.

## Raw JS Interop Surfaces

| Surface | Files | CLJS mapping |
|---------|-------|--------------|
| CLI args / env | `cli.ts`, `main.ts`, `cli/args.ts` | `extern.process` / `extern.env` |
| Stdin/stdout/stderr | `main.ts`, `print-mode.ts`, `rpc-mode.ts`, `rpc-client.ts`, `list-models.ts` | `extern.io` |
| Process signals / exit | `main.ts`, `print-mode.ts`, `interactive-mode.ts`, `rpc-mode.ts` | `extern.process` |
| Child process spawn | `main.ts`, `interactive-mode.ts`, `rpc-client.ts`, `session-selector.ts`, `extension-editor.ts`, `login-dialog.ts`, `bash-execution.ts` (display only) | `extern.spawn` |
| FS read/write/watch | `theme.ts`, `earendil-announcement.ts`, `extension-editor.ts`, `session-selector.ts`, `file-processor.ts` | `extern.fs` |
| Path | Many | `extern.path` |
| Crypto UUID | `interactive-mode.ts`, `rpc-mode.ts` | `extern.crypto` |
| OS tmpdir/homedir | `interactive-mode.ts`, `extension-editor.ts`, `session-selector.ts` | `extern.os` |
| Clipboard image | `interactive-mode.ts` | `extern.clipboard` |
| HTTP proxy (undici) | `cli.ts` | `extern.http` |
| TUI terminal | `interactive-mode.ts`, `main.ts`, `cli/session-picker.ts`, `cli/config-selector.ts`, all components | `@open-hax/eta-mu-tui` (already a boundary) |
| Syntax highlighting | `theme.ts` | `extern.highlight` (cli-highlight) |
| JSONL stream framing | `jsonl.ts` | `extern.stream` |

## Dependency Map

### On runtime core (`@open-hax/eta-mu-runtime`)

- `main.ts` calls `createSurfaceCommandResult` from `@open-hax/eta-mu-runtime/cljs` for `--version` output.
- `agent-session-runtime` and `agent-session-services` are the primary runtime consumers.

### On agent core (`@open-hax/eta-mu-agent-core`)

- `interactive-mode.ts`, `rpc-types.ts`, `rpc-client.ts`, `rpc-mode.ts`, `custom-editor.ts`, `settings-selector.ts`, `thinking-selector.ts`, `cli/args.ts` import types/events/thinking levels.

### On AI package (`@open-hax/eta-mu-ai`)

- Models, providers, image/attachment/audio content, OAuth provider list, `modelsAreEqual`, `supportsXhigh`.

### On TUI package (`@open-hax/eta-mu-tui`)

- All interactive components and `interactive-mode.ts` depend heavily on TUI primitives: `TUI`, `ProcessTerminal`, `Container`, `Editor`, `Markdown`, `SelectList`, `Loader`, `Input`, `Text`, `Spacer`, `Box`, `Image`, keybinding helpers, fuzzy/filter helpers, overlay APIs.

### On boundary adapters

- `extern.fs`, `extern.spawn`, `extern.clipboard`, `extern.http`, `extern.highlight`, `extern.stream` will be needed as CLJS namespaces.

## Thin Shells vs Full Ports

### Keep as thin TS shells

| File | Reason |
|------|--------|
| `src/cli.ts` | Node shebang binary entry; only env setup and `main()` call. |
| `src/bun/cli.ts` | Bun compile entry; sandbox env + Bedrock register side effects. |
| `src/main.ts` | Public `main()` signature; can become a TS facade over CLJS `main`. |
| `src/modes/index.ts` | Re-export barrel. |
| `src/index.ts` | Public SDK surface; keep as re-export barrel. |

### Port fully to CLJS

| File cluster | Reason |
|--------------|--------|
| `src/cli/args.ts` | Argument schema + parsing → `law`/`shape`. |
| `src/cli/file-processor.ts` | File/image boundary adapter → `extern`/`shape`. |
| `src/cli/initial-message.ts` | Pure message shaping. |
| `src/cli/list-models.ts` | Small formatting helper. |
| `src/cli/session-picker.ts` | TUI wrapper. |
| `src/cli/config-selector.ts` | TUI wrapper. |
| `src/modes/print-mode.ts` | Headless event loop. |
| `src/modes/interactive/interactive-mode.ts` | Core TUI orchestration. |
| `src/modes/interactive/components/*` | All UI components. |
| `src/modes/interactive/theme/theme.ts` | Theme loading/color/highlighting. |
| `src/modes/rpc/jsonl.ts` | Pure JSONL utility. |
| `src/modes/rpc/rpc-types.ts` | Protocol schemas → Malli. |
| `src/modes/rpc/rpc-mode.ts` | JSONL command loop. |
| `src/modes/rpc/rpc-client.ts` | Typed RPC client (or logic port + TS factory). |

### Static assets to preserve

- `src/modes/interactive/theme/dark.json`
- `src/modes/interactive/theme/light.json`
- `src/modes/interactive/theme/theme-schema.json`
- `src/modes/interactive/assets/clankolas.png`

## Recommended Next Task

Port `src/modes/rpc/jsonl.ts`, `src/modes/rpc/rpc-types.ts`, and `src/cli/args.ts` to CLJS first: they are pure data/schema files with no TUI dependencies, giving an early verification target for the `law.*` Malli schemas and the JSONL boundary contract before tackling the interactive TUI surface.
