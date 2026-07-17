# Coding Agent CLJS Rewrite — Core Inventory

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Scope: `packages/legacy/coding-agent/src/core/*` and `src/utils/*`
> Namespace taxonomy: `eta_mu.coding.{domain,shape,law,infra,extern,cli}.*`

## Summary

This document catalogs every source file and public export under `packages/legacy/coding-agent/src/core/` and `src/utils/`. Each module is classified into the target CLJS namespace taxonomy, with its public exports, internal consumers inside `packages/legacy`, raw JS interop surfaces, and dependencies on runtime/agent/AI/boundary packages.

The inventory deliberately excludes `src/modes/`, `src/cli.ts`, `src/main.ts`, `src/config.ts`, and `src/core/hooks/` — those are covered by the sibling task `coding-agent-cljs-rewrite-inventory-modes-cli`.

---

## Public entry points

### `src/index.ts`

- **Destination**: `eta_mu.coding.cli.index` (re-export façade) / split per underlying module
- **Public exports**: Re-exports the full public surface of the package:
  - `AgentSession`, config, events, `parseSkillBlock`, `SessionStats` from `core/agent-session`
  - `AuthStorage`, `FileAuthStorageBackend`, `InMemoryAuthStorageBackend`, credential types from `core/auth-storage`
  - Compaction functions/types from `core/compaction`
  - `EventBus` from `core/event-bus`
  - Extension types, `defineTool`, `ExtensionRunner`, tool-result type guards from `core/extensions`
  - `convertToLlm` from `core/messages`
  - `ModelRegistry` from `core/model-registry`
  - `DefaultPackageManager`, package types from `core/package-manager`
  - `DefaultResourceLoader`, `loadProjectContextFiles` from `core/resource-loader`
  - SDK runtime/session factories from `core/sdk`
  - `SessionManager` and session entry types from `core/session-manager`
  - `SettingsManager`, settings types from `core/settings-manager`
  - Skill loading/types from `core/skills`
  - `createSyntheticSourceInfo` from `core/source-info`
  - Tool factories/types from `core/tools`
  - `main`, `MainOptions` from `main` (out of scope)
  - Mode classes from `modes/` (out of scope)
  - Components/theme from `modes/interactive/` (out of scope)
  - `copyToClipboard` from `utils/clipboard`
  - `parseFrontmatter`/`stripFrontmatter` from `utils/frontmatter`
  - `getShellConfig` from `utils/shell`
- **Consumers**: External packages and the `eta-mu` binary; this is the published package surface.
- **Raw JS interop**: None directly.
- **Dependencies**: All of the re-exported modules.

### `src/core/index.ts`

- **Destination**: `eta_mu.coding.infra.index` (core shared re-export façade)
- **Public exports**: Smaller subset for mode authors and internal consumers:
  - `AgentSession`, types from `agent-session`
  - `AgentSessionRuntime`, `createAgentSessionRuntime` from `agent-session-runtime`
  - `AgentSessionServices`, `createAgentSessionServices`, `createAgentSessionFromServices` from `agent-session-services`
  - `executeBashWithOperations`, `BashExecutorOptions`, `BashResult` from `bash-executor`
  - `CompactionResult` from `compaction`
  - `EventBus` from `event-bus`
  - Extension types, `defineTool`, `discoverAndLoadExtensions`, `ExtensionRunner` from `extensions`
  - `createSyntheticSourceInfo` from `source-info`
- **Consumers**: `src/index.ts`, `src/modes/*`, `src/core/sdk.ts`.
- **Raw JS interop**: None directly.
- **Dependencies**: Re-exported modules only.

---

## Session domain

### `src/core/agent-session.ts`

- **Destination**: `eta_mu.coding.domain.session`
- **Public exports**:
  - `AgentSession` class
  - Types: `AgentSessionConfig`, `AgentSessionEvent`, `AgentSessionEventListener`, `ModelCycleResult`, `ParsedSkillBlock`, `PromptOptions`, `SessionStats`, `ExtensionBindings`
  - Function: `parseSkillBlock`
- **Consumers**:
  - `src/core/sdk.ts` constructs `AgentSession`
  - `src/core/agent-session-runtime.ts` calls methods and accesses `extensionRunner`
  - `src/core/index.ts` and `src/index.ts` re-export
  - `src/modes/interactive/interactive-mode.ts` and `src/modes/rpc/rpc-client.ts` subscribe to events and drive prompts
- **Raw JS interop**:
  - `node:fs` (`existsSync`, `mkdirSync`, `readFileSync`, `writeFileSync`) for skill block expansion
  - `node:path` (`basename`, `dirname`, `resolve`)
  - `setTimeout` for retry/auto-compaction kick
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`Agent`, events, state, tools)
  - `@open-hax/eta-mu-ai` (`AssistantMessage`, `AttachmentContent`, `ImageContent`, `InputContent`, `Message`, `Model`, `TextContent`, `isContextOverflow`, `modelsAreEqual`, `resetApiProviders`, `supportsXhigh`)
  - `@open-hax/eta-mu-tui` (`theme`)
  - Internal: `auth-guidance`, `bash-executor`, `compaction`, `defaults`, `export-html`, `extensions`, `messages`, `model-registry`, `prompt-templates`, `resource-loader`, `session-manager`, `settings-manager`, `slash-commands`, `source-info`, `system-prompt`, `tools/bash`, `tools/index`, `tools/tool-definition-wrapper`, `utils/frontmatter`, `utils/sleep`

### `src/core/agent-session-runtime.ts`

- **Destination**: `eta_mu.coding.infra.runtime`
- **Public exports**:
  - `AgentSessionRuntime` class
  - `CreateAgentSessionRuntimeResult`, `CreateAgentSessionRuntimeFactory`
  - `SessionImportFileNotFoundError`
  - `createAgentSessionRuntime`
  - Re-exports from `agent-session-services`
- **Consumers**:
  - `src/core/sdk.ts` via `createAgentSession`
  - `src/modes/interactive/interactive-mode.ts` for `/new`, `/resume`, `/fork`, import
  - `src/index.ts` and `src/core/index.ts` re-export
- **Raw JS interop**:
  - `node:fs` (`copyFileSync`, `existsSync`, `mkdirSync`)
  - `node:path` (`basename`, `join`, `resolve`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` types
  - Internal: `agent-session`, `agent-session-services`, `extensions`, `sdk`, `session-cwd`, `session-manager`

### `src/core/agent-session-services.ts`

- **Destination**: `eta_mu.coding.infra.services`
- **Public exports**:
  - `AgentSessionRuntimeDiagnostic`
  - `CreateAgentSessionServicesOptions`, `CreateAgentSessionFromServicesOptions`
  - `AgentSessionServices`
  - `createAgentSessionServices`, `createAgentSessionFromServices`
- **Consumers**:
  - `src/core/sdk.ts`
  - `src/core/agent-session-runtime.ts`
  - `src/core/index.ts` and `src/index.ts`
- **Raw JS interop**:
  - `node:path` (`join`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`ThinkingLevel`)
  - `@open-hax/eta-mu-ai` (`Model`)
  - Internal: `auth-storage`, `config`, `extensions`, `model-registry`, `resource-loader`, `sdk`, `session-manager`, `settings-manager`

### `src/core/session-manager.ts`

- **Destination**: `eta_mu.coding.domain.session-store`
- **Public exports**:
  - `SessionManager` class with static factories `create`, `open`, `continueRecent`, `inMemory`, `forkFrom`, `list`, `listAll`
  - Entry types: `SessionHeader`, `SessionEntryBase`, `SessionMessageEntry`, `ThinkingLevelChangeEntry`, `ModelChangeEntry`, `CompactionEntry`, `BranchSummaryEntry`, `CustomEntry`, `LabelEntry`, `SessionInfoEntry`, `CustomMessageEntry`
  - `FileEntry`, `SessionTreeNode`, `SessionContext`, `SessionInfo`, `ReadonlySessionManager`, `SessionListProgress`
  - `CURRENT_SESSION_VERSION`
  - Helpers: `buildSessionContext`, `getDefaultSessionDir`, `getLatestCompactionEntry`, `loadEntriesFromFile`, `findMostRecentSession`, `migrateSessionEntries`, `parseSessionEntries`
- **Consumers**:
  - `src/core/agent-session.ts` appends messages/model/thinking/compaction entries
  - `src/core/agent-session-runtime.ts` opens/creates sessions during switch/fork
  - `src/core/sdk.ts` creates initial session
  - `src/core/resource-loader.ts` not used directly but session data flows through `AgentSession`
  - `src/core/extensions/runner.ts` exposes `sessionManager` to extensions
  - `src/core/compaction/*` reads `SessionManager` for context
- **Raw JS interop**:
  - `node:crypto` (`randomUUID`)
  - `node:fs` sync (`appendFileSync`, `closeSync`, `existsSync`, `mkdirSync`, `openSync`, `readdirSync`, `readFileSync`, `readSync`, `statSync`, `writeFileSync`)
  - `node:fs/promises` (`readdir`, `readFile`, `stat`)
  - `node:path` (`join`, `resolve`)
  - `uuid` (`v7`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentMessage`)
  - `@open-hax/eta-mu-ai` (`InputContent`, `Message`)
  - Internal: `config`, `messages`

### `src/core/session-cwd.ts`

- **Destination**: `eta_mu.coding.domain.session-store`
- **Public exports**:
  - `SessionCwdIssue`
  - `getMissingSessionCwdIssue`, `formatMissingSessionCwdError`, `formatMissingSessionCwdPrompt`
  - `MissingSessionCwdError`, `assertSessionCwdExists`
- **Consumers**:
  - `src/core/agent-session-runtime.ts`
  - `src/core/sdk.ts`
- **Raw JS interop**:
  - `node:fs` (`existsSync`)
- **Dependencies**: None external.

---

## Tool domain

### `src/core/tools/index.ts`

- **Destination**: `eta_mu.coding.domain.tools`
- **Public exports**:
  - Re-exports from each tool module (`bash`, `edit`, `find`, `grep`, `ls`, `read`, `write`, `truncate`, `file-mutation-queue`)
  - Types: `Tool`, `ToolDef`, `ToolName`
  - `allToolNames`
  - `ToolsOptions`
  - Factories: `createToolDefinition`, `createTool`, `createCodingToolDefinitions`, `createReadOnlyToolDefinitions`, `createAllToolDefinitions`, `createCodingTools`, `createReadOnlyTools`, `createAllTools`
- **Consumers**:
  - `src/core/agent-session.ts` calls `createAllToolDefinitions`
  - `src/core/sdk.ts` re-exports and uses `createCodingTools`, `createReadTool`, etc.
  - `src/core/extensions/types.ts` references `ToolDefinition`
  - `src/index.ts` re-exports
- **Raw JS interop**: None (delegates to tool modules).
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`, all tool modules

### `src/core/tools/bash.ts`

- **Destination**: `eta_mu.coding.domain.tools.bash`
- **Public exports**:
  - `BashToolInput`, `BashToolDetails`, `BashOperations`, `BashSpawnContext`, `BashSpawnHook`, `BashToolOptions`
  - `createLocalBashOperations`, `createBashToolDefinition`, `createBashTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/bash-executor.ts` consumes `BashOperations`
  - `src/core/agent-session.ts` calls `createLocalBashOperations` and `executeBash`
  - `src/core/sdk.ts` re-exports `createBashTool`
- **Raw JS interop**:
  - `node:crypto` (`randomBytes`)
  - `node:fs` (`createWriteStream`, `existsSync`)
  - `node:os` (`tmpdir`)
  - `node:path` (`join`)
  - `child_process` (`spawn`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - `@open-hax/eta-mu-tui` (`Container`, `Text`, `truncateToWidth`)
  - Internal: `extensions/types`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `utils/child-process`, `utils/shell`, `modes/interactive/components/*`, `modes/interactive/theme/theme`

### `src/core/tools/read.ts`

- **Destination**: `eta_mu.coding.domain.tools.read`
- **Public exports**:
  - `ReadToolInput`, `ReadToolDetails`, `ReadOperations`, `ReadToolOptions`
  - `createReadToolDefinition`, `createReadTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/sdk.ts` re-exports `createReadTool`
- **Raw JS interop**:
  - `node:fs` (`constants`)
  - `node:fs/promises` (`access`, `readFile`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - `@open-hax/eta-mu-ai` (`Api`, `ImageContent`, `Model`, `TextContent`)
  - `@open-hax/eta-mu-tui` (`Text`)
  - Internal: `extensions/types`, `tools/path-utils`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `utils/image-resize`, `utils/mime`, `modes/interactive/components/keybinding-hints`, `modes/interactive/theme/theme`

### `src/core/tools/write.ts`

- **Destination**: `eta_mu.coding.domain.tools.write`
- **Public exports**:
  - `WriteToolInput`, `WriteOperations`, `WriteToolOptions`
  - `createWriteToolDefinition`, `createWriteTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/sdk.ts` re-exports `createWriteTool`
- **Raw JS interop**:
  - `node:fs/promises` (`writeFile`)
  - `node:path` (`dirname`, `join`, `resolve`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`, `tools/path-utils`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `modes/interactive/components/keybinding-hints`, `modes/interactive/theme/theme`

### `src/core/tools/edit.ts`

- **Destination**: `eta_mu.coding.domain.tools.edit`
- **Public exports**:
  - `EditToolInput`, `EditToolDetails`, `EditOperations`, `EditToolOptions`
  - `createEditToolDefinition`, `createEditTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/sdk.ts` re-exports `createEditTool`
- **Raw JS interop**:
  - `node:fs/promises` (`readFile`, `writeFile`)
  - `node:path` (`resolve`)
  - `diff` package
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`, `tools/edit-diff`, `tools/path-utils`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `modes/interactive/theme/theme`

### `src/core/tools/edit-diff.ts`

- **Destination**: `eta_mu.coding.domain.tools.edit`
- **Public exports**:
  - `detectLineEnding`, `normalizeToLF`, `restoreLineEndings`, `normalizeForFuzzyMatch`
  - `FuzzyMatchResult`, `Edit`, `AppliedEditsResult`
  - `fuzzyFindText`, `stripBom`, `applyEditsToNormalizedContent`, `generateDiffString`
  - `EditDiffResult`, `EditDiffError`
- **Consumers**:
  - `src/core/tools/edit.ts`
- **Raw JS interop**: None (pure string/algorithm module).
- **Dependencies**: `diff` package.

### `src/core/tools/grep.ts`

- **Destination**: `eta_mu.coding.domain.tools.grep`
- **Public exports**:
  - `GrepToolInput`, `GrepToolDetails`, `GrepOperations`, `GrepToolOptions`
  - `createGrepToolDefinition`, `createGrepTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/sdk.ts` re-exports `createGrepTool`
- **Raw JS interop**:
  - `child_process` (`spawn`)
  - `node:fs` (`existsSync`)
  - `node:path` (`resolve`)
  - `node:stream` (`Readable`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `utils/shell`, `utils/tools-manager`, `modes/interactive/theme/theme`

### `src/core/tools/find.ts`

- **Destination**: `eta_mu.coding.domain.tools.find`
- **Public exports**:
  - `FindToolInput`, `FindToolDetails`, `FindOperations`, `FindToolOptions`
  - `createFindToolDefinition`, `createFindTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/sdk.ts` re-exports `createFindTool`
- **Raw JS interop**:
  - `child_process` (`spawn`)
  - `node:fs` (`existsSync`)
  - `node:path` (`resolve`)
  - `node:stream` (`Readable`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `utils/shell`, `utils/tools-manager`, `modes/interactive/theme/theme`

### `src/core/tools/ls.ts`

- **Destination**: `eta_mu.coding.domain.tools.ls`
- **Public exports**:
  - `LsToolInput`, `LsToolDetails`, `LsOperations`, `LsToolOptions`
  - `createLsToolDefinition`, `createLsTool`
- **Consumers**:
  - `src/core/tools/index.ts`
  - `src/core/sdk.ts` re-exports `createLsTool`
- **Raw JS interop**:
  - `node:fs` (`Dirent`, `readdirSync`, `statSync`)
  - `node:path` (`basename`, `join`, `relative`, `resolve`)
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`, `tools/path-utils`, `tools/render-utils`, `tools/tool-definition-wrapper`, `tools/truncate`, `modes/interactive/theme/theme`

### `src/core/tools/truncate.ts`

- **Destination**: `eta_mu.coding.shape.truncate`
- **Public exports**:
  - `DEFAULT_MAX_LINES`, `DEFAULT_MAX_BYTES`, `GREP_MAX_LINE_LENGTH`
  - `TruncationResult`, `TruncationOptions`
  - `formatSize`, `truncateHead`, `truncateTail`, `truncateLine`
- **Consumers**:
  - All tool modules (`bash`, `read`, `write`, `edit`, `grep`, `find`, `ls`)
  - `src/core/bash-executor.ts`
  - `src/core/tools/index.ts` and `src/index.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/core/tools/path-utils.ts`

- **Destination**: `eta_mu.coding.shape.path`
- **Public exports**:
  - `expandPath`, `resolveToCwd`, `resolveReadPath`
- **Consumers**:
  - `src/core/tools/read.ts`, `write.ts`, `ls.ts`
- **Raw JS interop**:
  - `node:path` (`isAbsolute`, `join`, `resolve`)
  - `node:os` (`homedir`)
- **Dependencies**: None.

### `src/core/tools/render-utils.ts`

- **Destination**: `eta_mu.coding.shape.tool-render`
- **Public exports**:
  - `shortenPath`, `str`, `replaceTabs`, `normalizeDisplayText`, `getTextOutput`
  - `ToolRenderResultLike`, `invalidArgText`
- **Consumers**:
  - All tool modules
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-tui` (`theme` access via dynamic import type only)

### `src/core/tools/tool-definition-wrapper.ts`

- **Destination**: `eta_mu.coding.domain.tools`
- **Public exports**:
  - `wrapToolDefinition`, `wrapToolDefinitions`
- **Consumers**:
  - All tool modules (`bash`, `read`, `write`, `edit`, `grep`, `find`, `ls`)
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`

### `src/core/tools/file-mutation-queue.ts`

- **Destination**: `eta_mu.coding.domain.tools.queue`
- **Public exports**:
  - `withFileMutationQueue`
- **Consumers**:
  - `src/core/tools/index.ts` and `src/core/sdk.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

---

## Extension domain

### `src/core/extensions/index.ts`

- **Destination**: `eta_mu.coding.domain.extensions`
- **Public exports**:
  - Re-exports from `loader.ts`, `runner.ts`, `types.ts`, `wrapper.ts`
  - `SlashCommandInfo`, `SlashCommandSource` from `slash-commands`
  - `SourceInfo` from `source-info`
  - Type guards and tool wrappers
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/agent-session-services.ts`
  - `src/core/sdk.ts`
  - `src/core/resource-loader.ts`
  - `src/index.ts` and `src/core/index.ts`
- **Raw JS interop**: None.
- **Dependencies**: Internal re-exports.

### `src/core/extensions/types.ts`

- **Destination**: `eta_mu.coding.law.extensions` + `eta_mu.coding.shape.extensions`
- **Public exports**: ~100 event types, handler types, context types, `ToolDefinition`, `defineTool`, type guards (`isBashToolResult`, etc.).
- **Consumers**:
  - Every extension consumer and the public SDK
  - `src/core/extensions/runner.ts`, `loader.ts`, `wrapper.ts`
  - `src/core/tools/*` (uses `ToolDefinition`)
  - `src/index.ts`, `src/core/index.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentMessage`, `AgentTool`)
  - `@open-hax/eta-mu-ai` (`ImageContent`, `Message`, `Model`)
  - `@open-hax/eta-mu-tui` (`KeyId`)
  - Internal: `keybindings`, `system-prompt`, `slash-commands`, `source-info`

### `src/core/extensions/runner.ts`

- **Destination**: `eta_mu.coding.infra.runner`
- **Public exports**:
  - `ExtensionRunner` class
  - `ExtensionErrorListener`, `NewSessionHandler`, `ForkHandler`, `NavigateTreeHandler`, `SwitchSessionHandler`, `ReloadHandler`, `ShutdownHandler`
  - `emitSessionShutdownEvent`
- **Consumers**:
  - `src/core/agent-session.ts` constructs and binds runner
  - `src/core/agent-session-runtime.ts` emits shutdown
  - `src/core/extensions/index.ts`
  - `src/modes/interactive/interactive-mode.ts` binds UI/command contexts
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentMessage`)
  - `@open-hax/eta-mu-ai` (`ImageContent`, `Model`)
  - `@open-hax/eta-mu-tui` (`KeyId`)
  - Internal: `diagnostics`, `extensions/types`, `keybindings`, `model-registry`, `session-manager`, `system-prompt`, `modes/interactive/theme/theme`

### `src/core/extensions/loader.ts`

- **Destination**: `eta_mu.coding.infra.loader`
- **Public exports**:
  - `loadExtensions`, `loadExtensionFromFactory`, `createExtensionRuntime`, `discoverAndLoadExtensions`
- **Consumers**:
  - `src/core/resource-loader.ts`
  - `src/core/extensions/index.ts`
- **Raw JS interop**:
  - `@mariozechner/jiti` for TS/JS extension import
  - `node:fs` (`existsSync`, `readFileSync`)
  - `node:path` (`basename`, `dirname`, `extname`, `join`, `resolve`)
- **Dependencies**:
  - Internal: `diagnostics`, `event-bus`, `extensions/types`

### `src/core/extensions/wrapper.ts`

- **Destination**: `eta_mu.coding.domain.extensions`
- **Public exports**:
  - `wrapRegisteredTool`, `wrapRegisteredTools`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/extensions/index.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentTool`)
  - Internal: `extensions/types`

---

## Resource / package infrastructure

### `src/core/resource-loader.ts`

- **Destination**: `eta_mu.coding.infra.resources`
- **Public exports**:
  - `ResourceLoader` interface
  - `ResourceExtensionPaths`
  - `DefaultResourceLoader`, `DefaultResourceLoaderOptions`
  - `loadProjectContextFiles`
  - Re-exports `ResourceCollision`, `ResourceDiagnostic`
- **Consumers**:
  - `src/core/agent-session-services.ts`
  - `src/core/sdk.ts`
  - `src/core/agent-session.ts`
  - `src/index.ts` and `src/core/index.ts`
- **Raw JS interop**:
  - `node:fs` (`existsSync`, `readdirSync`, `readFileSync`, `statSync`)
  - `node:os` (`homedir`)
  - `node:path` (`join`, `resolve`, `sep`)
- **Dependencies**:
  - `chalk`
  - `@open-hax/eta-mu-tui` (`Theme`, `loadThemeFromPath`)
  - Internal: `config`, `diagnostics`, `event-bus`, `extensions/loader`, `extensions/types`, `package-manager`, `prompt-templates`, `settings-manager`, `skills`, `source-info`, `utils/paths`

### `src/core/package-manager.ts`

- **Destination**: `eta_mu.coding.infra.packages`
- **Public exports**:
  - `PackageManager` interface
  - `DefaultPackageManager`
  - Types: `PathMetadata`, `ResolvedResource`, `ResolvedPaths`, `MissingSourceAction`, `ProgressEvent`, `ProgressCallback`, `PackageUpdate`, `ConfiguredPackage`
- **Consumers**:
  - `src/core/resource-loader.ts`
  - `src/package-manager-cli.ts`
  - `src/index.ts`
- **Raw JS interop**:
  - `node:child_process` (`spawn`, `spawnSync`, `ChildProcess` types)
  - `node:crypto` (`createHash`)
  - `node:fs` (`existsSync`, `mkdirSync`, `readdirSync`, `readFileSync`, `rmSync`, `statSync`, `writeFileSync`)
  - `node:os` (`homedir`, `tmpdir`)
  - `node:path` (`basename`, `dirname`, `join`, `relative`, `resolve`, `sep`)
  - `node:stream` (`Readable`)
  - `glob`, `ignore`, `minimatch`
- **Dependencies**:
  - Internal: `config`, `diagnostics` (type), `output-guard`, `settings-manager`, `utils/git`, `utils/paths`

### `src/package-manager-cli.ts`

- **Destination**: `eta_mu.coding.cli.packages`
- **Public exports**:
  - `PackageCommand`
  - `handlePackageCommand`, `handleConfigCommand`
- **Consumers**:
  - `src/cli.ts` (out of scope)
- **Raw JS interop**:
  - `child_process` (`spawn`)
  - `process` exit
- **Dependencies**:
  - `chalk`
  - Internal: `cli/config-selector`, `config`, `core/package-manager`, `core/settings-manager`, `utils/version-check`

---

## Settings, auth, and model infrastructure

### `src/core/settings-manager.ts`

- **Destination**: `eta_mu.coding.infra.settings`
- **Public exports**:
  - `SettingsManager` class
  - `FileSettingsStorage`, `InMemorySettingsStorage`
  - Types: `Settings`, `SettingsScope`, `SettingsStorage`, `SettingsError`, plus nested settings interfaces (`CompactionSettings`, `RetrySettings`, `ImageSettings`, `PackageSource`, etc.)
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/agent-session-services.ts`
  - `src/core/sdk.ts`
  - `src/core/resource-loader.ts`
  - `src/core/package-manager.ts`
  - `src/package-manager-cli.ts`
  - `src/index.ts`
- **Raw JS interop**:
  - `node:fs` (`existsSync`, `mkdirSync`, `readFileSync`, `writeFileSync`)
  - `node:os` (`homedir`)
  - `node:path` (`dirname`, `join`)
  - `proper-lockfile`
- **Dependencies**:
  - `@open-hax/eta-mu-ai` (`Transport`)
  - Internal: `config`

### `src/core/auth-storage.ts`

- **Destination**: `eta_mu.coding.infra.auth`
- **Public exports**:
  - `AuthStorage` class
  - `FileAuthStorageBackend`, `InMemoryAuthStorageBackend`
  - `AuthStorageBackend` interface
  - Types: `ApiKeyCredential`, `OAuthCredential`, `AuthCredential`, `AuthStorageData`, `AuthStatus`
- **Consumers**:
  - `src/core/agent-session-services.ts`
  - `src/core/sdk.ts`
  - `src/core/model-registry.ts`
  - `src/index.ts`
- **Raw JS interop**:
  - `node:fs` (`chmodSync`, `existsSync`, `mkdirSync`, `readFileSync`, `writeFileSync`)
  - `node:path` (`dirname`, `join`)
  - `proper-lockfile`
- **Dependencies**:
  - `@open-hax/eta-mu-ai` (`findEnvKeys`, `getEnvApiKey`, `OAuthCredentials`, `OAuthLoginCallbacks`, `OAuthProviderId`)
  - `@open-hax/eta-mu-ai/oauth` (`getOAuthApiKey`, `getOAuthProvider`, `getOAuthProviders`)
  - Internal: `config`, `resolve-config-value`

### `src/core/model-registry.ts`

- **Destination**: `eta_mu.coding.infra.models`
- **Public exports**:
  - `ModelRegistry` class
  - `ResolvedRequestAuth`
  - `ProviderConfigInput`
  - `clearApiKeyCache`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/agent-session-services.ts`
  - `src/core/sdk.ts`
  - `src/core/extensions/runner.ts`
  - `src/index.ts`
- **Raw JS interop**:
  - `node:fs` (`existsSync`, `readFileSync`)
  - `node:path` (`join`)
- **Dependencies**:
  - `@open-hax/eta-mu-ai` (extensive: models, providers, registerApiProvider, resetApiProviders, stream types, etc.)
  - `@open-hax/eta-mu-ai/oauth` (`registerOAuthProvider`, `resetOAuthProviders`)
  - `typebox`, `typebox/compile`, `typebox/error`
  - Internal: `auth-storage`, `config`, `resolve-config-value`

### `src/core/resolve-config-value.ts`

- **Destination**: `eta_mu.coding.infra.config-value`
- **Public exports** (inferred from imports): `resolveConfigValue`, `resolveConfigValueOrThrow`, `resolveConfigValueUncached`, `resolveHeadersOrThrow`, `clearConfigValueCache`
- **Consumers**:
  - `src/core/auth-storage.ts`
  - `src/core/model-registry.ts`
- **Raw JS interop**:
  - `child_process` (`execSync`, `spawnSync`)
- **Dependencies**: None external.

---

## Message / compaction / prompt / diagnostics shape

### `src/core/messages.ts`

- **Destination**: `eta_mu.coding.shape.messages`
- **Public exports**:
  - Message types: `BashExecutionMessage`, `CustomMessage`, `BranchSummaryMessage`, `CompactionSummaryMessage`
  - Constants: `COMPACTION_SUMMARY_PREFIX/SUFFIX`, `BRANCH_SUMMARY_PREFIX/SUFFIX`
  - `bashExecutionToText`
  - `createBranchSummaryMessage`, `createCompactionSummaryMessage`, `createCustomMessage`
  - `convertToLlm`
  - Module augmentation for `@open-hax/eta-mu-agent-core` custom message types
- **Consumers**:
  - `src/core/session-manager.ts`
  - `src/core/agent-session.ts`
  - `src/core/sdk.ts`
  - `src/core/compaction/*`
  - `src/index.ts` (via `convertToLlm`)
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-agent-core` (`AgentMessage`)
  - `@open-hax/eta-mu-ai` (`InputContent`, `Message`)

### `src/core/diagnostics.ts`

- **Destination**: `eta_mu.coding.law.diagnostics`
- **Public exports**:
  - `ResourceCollision`, `ResourceDiagnostic`
- **Consumers**:
  - `src/core/resource-loader.ts`
  - `src/core/extensions/runner.ts`
  - `src/core/package-manager.ts` (type)
  - `src/core/extensions/loader.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/core/output-guard.ts`

- **Destination**: `eta_mu.coding.extern.stdout`
- **Public exports**:
  - `takeOverStdout`, `restoreStdout`, `isStdoutTakenOver`, `writeRawStdout`, `flushRawStdout`
- **Consumers**:
  - `src/core/package-manager.ts`
  - `src/modes/interactive/*` (out of scope)
- **Raw JS interop**:
  - `process.stdout.write`, `process.stderr.write` monkey-patching
- **Dependencies**: None.

### `src/core/bash-executor.ts`

- **Destination**: `eta_mu.coding.extern.bash`
- **Public exports**:
  - `BashExecutorOptions`, `BashResult`
  - `executeBashWithOperations`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/index.ts` and `src/index.ts`
- **Raw JS interop**:
  - `node:crypto` (`randomBytes`)
  - `node:fs` (`createWriteStream`)
  - `node:os` (`tmpdir`)
  - `node:path` (`join`)
  - `strip-ansi`
- **Dependencies**:
  - Internal: `tools/bash`, `tools/truncate`, `utils/shell`

### `src/core/exec.ts`

- **Destination**: `eta_mu.coding.extern.exec`
- **Public exports**:
  - `ExecOptions`, `ExecResult`
  - `execCommand`
- **Consumers**:
  - Extensions and custom tools
- **Raw JS interop**:
  - `node:child_process` (`spawn`)
- **Dependencies**:
  - Internal: `utils/child-process`

### `src/core/event-bus.ts`

- **Destination**: `eta_mu.coding.infra.events`
- **Public exports** (inferred from imports): `createEventBus`, `EventBus`, `EventBusController`
- **Consumers**:
  - `src/core/resource-loader.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/core/source-info.ts`

- **Destination**: `eta_mu.coding.shape.source`
- **Public exports** (inferred): `SourceInfo`, `createSourceInfo`, `createSyntheticSourceInfo`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/resource-loader.ts`
  - `src/core/extensions/*`
  - `src/core/skills.ts`
  - `src/index.ts`, `src/core/index.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/core/slash-commands.ts`

- **Destination**: `eta_mu.coding.shape.commands`
- **Public exports** (inferred): `SlashCommandInfo`, `SlashCommandSource`
- **Consumers**:
  - `src/core/extensions/types.ts`
  - `src/core/extensions/index.ts`
- **Raw JS interop**: None.
- **Dependencies**: Internal: `source-info`

### `src/core/skills.ts`

- **Destination**: `eta_mu.coding.domain.skills`
- **Public exports** (inferred from `src/index.ts`): `loadSkills`, `loadSkillsFromDir`, `formatSkillsForPrompt`, plus `Skill`, `SkillFrontmatter`, `LoadSkillsFromDirOptions`, `LoadSkillsResult`
- **Consumers**:
  - `src/core/resource-loader.ts`
  - `src/core/agent-session.ts`
  - `src/index.ts`
- **Raw JS interop**:
  - `node:fs`/`node:path` for skill discovery
- **Dependencies**:
  - Internal: `source-info`, `utils/frontmatter`

### `src/core/prompt-templates.ts`

- **Destination**: `eta_mu.coding.domain.prompts`
- **Public exports** (inferred): `PromptTemplate`, `loadPromptTemplates`, `expandPromptTemplate`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/resource-loader.ts`
  - `src/core/sdk.ts`
- **Raw JS interop**:
  - `node:fs` for template discovery
- **Dependencies**:
  - Internal: `source-info`, `utils/frontmatter`

### `src/core/system-prompt.ts`

- **Destination**: `eta_mu.coding.domain.prompts`
- **Public exports** (inferred): `buildSystemPrompt`, `BuildSystemPromptOptions`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/extensions/types.ts`
  - `src/core/extensions/runner.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - Internal: `skills`

### `src/core/defaults.ts`

- **Destination**: `eta_mu.coding.domain.defaults`
- **Public exports** (inferred): `DEFAULT_THINKING_LEVEL`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/sdk.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/core/timings.ts`

- **Destination**: `eta_mu.coding.infra.timings`
- **Public exports** (inferred): `time`
- **Consumers**:
  - `src/core/sdk.ts`
- **Raw JS interop**:
  - `console.time` / `console.timeEnd`
- **Dependencies**: None.

### `src/core/auth-guidance.ts`

- **Destination**: `eta_mu.coding.domain.auth`
- **Public exports** (inferred): `formatNoApiKeyFoundMessage`, `formatNoModelSelectedMessage`, `formatNoModelsAvailableMessage`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/sdk.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/core/model-resolver.ts`

- **Destination**: `eta_mu.coding.domain.models`
- **Public exports** (inferred): `defaultModelPerProvider`, `findExactModelReferenceMatch`, `parseModelPattern`, `resolveCliModel`, `findInitialModel`, plus result types
- **Consumers**:
  - `src/core/sdk.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-ai` (models/providers)

### `src/core/keybindings.ts`

- **Destination**: `eta_mu.coding.shape.keybindings`
- **Public exports** (inferred): `KeybindingsConfig`
- **Consumers**:
  - `src/core/extensions/runner.ts`
  - `src/core/extensions/types.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

---

## Compaction domain

### `src/core/compaction/index.ts`

- **Destination**: `eta_mu.coding.domain.compaction`
- **Public exports** (inferred): Re-exports compaction helpers and types.
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/index.ts`
- **Raw JS interop**: None.
- **Dependencies**: Internal compaction modules.

### `src/core/compaction/compaction.ts`

- **Destination**: `eta_mu.coding.domain.compaction`
- **Public exports**: `compact`, `prepareCompaction`, `shouldCompact`, `calculateContextTokens`, `estimateContextTokens`, plus result types.
- **Consumers**:
  - `src/core/compaction/index.ts`
  - `src/core/agent-session.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-ai`
  - Internal: `messages`

### `src/core/compaction/branch-summarization.ts`

- **Destination**: `eta_mu.coding.domain.compaction`
- **Public exports**: `collectEntriesForBranchSummary`, `generateBranchSummary`, plus types.
- **Consumers**:
  - `src/core/compaction/index.ts`
  - `src/core/agent-session.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - `@open-hax/eta-mu-ai`
  - Internal: `session-manager`

### `src/core/compaction/utils.ts`

- **Destination**: `eta_mu.coding.domain.compaction`
- **Public exports** (inferred): utility helpers for compaction math/serialization.
- **Consumers**: `compaction/*`
- **Raw JS interop**: None.
- **Dependencies**: None.

---

## Extern / utility modules (`src/utils/*`)

### `src/utils/shell.ts`

- **Destination**: `eta_mu.coding.extern.shell`
- **Public exports**:
  - `ShellConfig`, `getShellConfig`, `getShellEnv`
  - `sanitizeBinaryOutput`
  - `trackDetachedChildPid`, `untrackDetachedChildPid`, `killTrackedDetachedChildren`, `killProcessTree`
- **Consumers**:
  - `src/core/tools/bash.ts`
  - `src/core/bash-executor.ts`
  - `src/index.ts`
- **Raw JS interop**:
  - `child_process` (`spawn`, `spawnSync`)
  - `node:fs` (`existsSync`)
  - `node:path` (`delimiter`)
- **Dependencies**:
  - Internal: `config`

### `src/utils/child-process.ts`

- **Destination**: `eta_mu.coding.extern.process`
- **Public exports**:
  - `waitForChildProcess`
- **Consumers**:
  - `src/core/tools/bash.ts`
  - `src/core/exec.ts`
- **Raw JS interop**:
  - `node:child_process` (`ChildProcess`)
- **Dependencies**: None.

### `src/utils/clipboard.ts`

- **Destination**: `eta_mu.coding.extern.clipboard`
- **Public exports**:
  - `copyToClipboard`
- **Consumers**:
  - `src/index.ts`
  - `src/modes/interactive/*` (out of scope)
- **Raw JS interop**:
  - `child_process` (`execSync`, `spawn`)
  - `node:os` (`platform`)
  - Terminal OSC 52 escape sequences
- **Dependencies**:
  - Internal: `clipboard-image`, `clipboard-native`

### `src/utils/clipboard-native.ts`

- **Destination**: `eta_mu.coding.extern.clipboard`
- **Public exports**:
  - `ClipboardModule`
  - `clipboard` (optional native module handle)
- **Consumers**:
  - `src/utils/clipboard.ts`
  - `src/utils/clipboard-image.ts`
- **Raw JS interop**:
  - `node:module` (`createRequire`)
  - Optional native dependency `@mariozechner/clipboard`
- **Dependencies**: None.

### `src/utils/clipboard-image.ts`

- **Destination**: `eta_mu.coding.extern.clipboard`
- **Public exports**:
  - `ClipboardImage`
  - `isWaylandSession`
  - `extensionForImageMimeType`
  - `readClipboardImage`
- **Consumers**:
  - `src/utils/clipboard.ts`
  - `src/modes/interactive/*` (out of scope)
- **Raw JS interop**:
  - `child_process` (`spawnSync`)
  - `node:crypto` (`randomUUID`)
  - `node:fs` (`readFileSync`, `unlinkSync`)
  - `node:os` (`tmpdir`)
  - `node:path` (`join`)
  - `wl-paste`, `xclip`, `powershell.exe`, `wslpath`
- **Dependencies**:
  - Internal: `clipboard-native`, `photon`

### `src/utils/photon.ts`

- **Destination**: `eta_mu.coding.extern.image`
- **Public exports**:
  - `PhotonImageType`
  - `loadPhoton` (inferred)
- **Consumers**:
  - `src/utils/clipboard-image.ts`
  - `src/utils/image-resize.ts` (inferred)
- **Raw JS interop**:
  - `@silvia-odwyer/photon-node` WASM native module
- **Dependencies**:
  - `@silvia-odwyer/photon-node`

### `src/utils/image-resize.ts`

- **Destination**: `eta_mu.coding.extern.image`
- **Public exports**:
  - `ImageResizeOptions`, `ResizedImage`
  - `resizeImage`, `formatDimensionNote` (inferred)
- **Consumers**:
  - `src/core/tools/read.ts`
- **Raw JS interop**:
  - `@silvia-odwyer/photon-node` via `photon.ts`
- **Dependencies**:
  - Internal: `photon`

### `src/utils/image-convert.ts`

- **Destination**: `eta_mu.coding.extern.image`
- **Public exports**: image conversion helpers (inferred from filename).
- **Consumers**:
  - Likely `src/modes/interactive/*` (out of scope)
- **Raw JS interop**:
  - Image binaries / WASM
- **Dependencies**: Internal image/photon modules.

### `src/utils/exif-orientation.ts`

- **Destination**: `eta_mu.coding.extern.image`
- **Public exports**: `applyExifOrientation`
- **Consumers**:
  - Image pipeline
- **Raw JS interop**: Binary EXIF parsing.
- **Dependencies**: None.

### `src/utils/mime.ts`

- **Destination**: `eta_mu.coding.extern.mime`
- **Public exports**: `detectSupportedImageMimeTypeFromFile` (inferred)
- **Consumers**:
  - `src/core/tools/read.ts`
- **Raw JS interop**:
  - `file-type` package
- **Dependencies**:
  - `file-type`

### `src/utils/frontmatter.ts`

- **Destination**: `eta_mu.coding.shape.frontmatter`
- **Public exports**:
  - `parseFrontmatter`, `stripFrontmatter`
- **Consumers**:
  - `src/core/agent-session.ts`
  - `src/core/skills.ts`
  - `src/core/prompt-templates.ts`
  - `src/index.ts`
- **Raw JS interop**: None.
- **Dependencies**:
  - `yaml`

### `src/utils/paths.ts`

- **Destination**: `eta_mu.coding.shape.path`
- **Public exports**:
  - `canonicalizePath`, `isLocalPath`
- **Consumers**:
  - `src/core/resource-loader.ts`
  - `src/core/package-manager.ts`
  - `src/core/tools/path-utils.ts`
- **Raw JS interop**: None.
- **Dependencies**: None.

### `src/utils/git.ts`

- **Destination**: `eta_mu.coding.extern.git`
- **Public exports**:
  - `GitSource`
  - `parseGitUrl`
- **Consumers**:
  - `src/core/package-manager.ts`
- **Raw JS interop**: None (URL parsing only).
- **Dependencies**:
  - `hosted-git-info` (inferred from package.json)

### `src/utils/tools-manager.ts`

- **Destination**: `eta_mu.coding.extern.tools`
- **Public exports**:
  - `getToolPath`
  - `ensureTool`
- **Consumers**:
  - `src/core/tools/grep.ts`
  - `src/core/tools/find.ts`
  - Startup/tool-install paths
- **Raw JS interop**:
  - `child_process` (`spawnSync`)
  - `node:fs` (`chmodSync`, `createWriteStream`, `existsSync`, `mkdirSync`, `readdirSync`, `renameSync`, `rmSync`)
  - `node:os` (`arch`, `platform`)
  - `node:path` (`join`)
  - `node:stream` (`Readable`), `node:stream/promises` (`pipeline`)
  - Network `fetch` to GitHub releases
  - `extract-zip`
- **Dependencies**:
  - `chalk`
  - Internal: `config`

### `src/utils/sleep.ts`

- **Destination**: `eta_mu.coding.infra.async`
- **Public exports**:
  - `sleep`
- **Consumers**:
  - `src/core/agent-session.ts`
- **Raw JS interop**: `setTimeout`.
- **Dependencies**: None.

### `src/utils/fs-watch.ts`

- **Destination**: `eta_mu.coding.extern.fs`
- **Public exports**:
  - `FS_WATCH_RETRY_DELAY_MS`
  - `closeWatcher`, `watchWithErrorHandler`
- **Consumers**:
  - Theme / settings watchers (out of scope)
- **Raw JS interop**:
  - `node:fs` (`FSWatcher`, `watch`)
- **Dependencies**: None.

### `src/utils/version-check.ts`

- **Destination**: `eta_mu.coding.extern.network`
- **Public exports**:
  - `comparePackageVersions`, `isNewerPackageVersion`
  - `getLatestPiVersion`, `checkForNewPiVersion`
- **Consumers**:
  - `src/package-manager-cli.ts`
- **Raw JS interop**:
  - Network `fetch` to npm/GitHub
- **Dependencies**: None.

### `src/utils/changelog.ts`

- **Destination**: `eta_mu.coding.shape.changelog`
- **Public exports**:
  - `ChangelogEntry`
  - `parseChangelog`, `compareVersions`, `getNewEntries`
  - Re-exports `getChangelogPath` from `config`
- **Consumers**:
  - `src/modes/interactive/*` (out of scope)
- **Raw JS interop**:
  - File read
- **Dependencies**:
  - Internal: `config`

---

## Tool contract matrix

| Tool | Schema (TypeBox) | Side effects | Tests expected |
|------|------------------|--------------|----------------|
| `read` | `path`, `offset?`, `limit?` | FS read, image resize | `read.test.ts` |
| `write` | `path`, `content` | FS write | `write.test.ts` |
| `edit` | `old_text`, `new_text`, `path?` | FS read/write, diff | `edit.test.ts` |
| `bash` | `command`, `timeout?` | Spawn shell, temp file | `bash.test.ts` |
| `grep` | `path`, `regex`, `output?` | Spawn `rg` | `grep.test.ts` |
| `find` | `path`, `glob?` | Spawn `fd`/`find` | `find.test.ts` |
| `ls` | `path` | FS readdir/stat | `ls.test.ts` |

All tools implement `ToolDefinition` (name, label, description, parameters, execute, renderCall, renderResult) and are wrapped into `AgentTool` via `tool-definition-wrapper.ts`.

---

## Extension contract matrix

| Concern | Type/contract | Notes |
|---------|---------------|-------|
| Manifest | Extension factory + `defineTool` | Loaded by `extensions/loader.ts` with `@mariozechner/jiti` |
| Runtime API | `ExtensionContext`, `ExtensionActions`, `ExtensionCommandContext` | Bound by `ExtensionRunner.bindCore` / `bindCommandContext` |
| Events | ~30 event types in `extensions/types.ts` | Emitted by `ExtensionRunner` |
| Tools | `RegisteredTool` / `ToolDefinition` | Wrapped by `extensions/wrapper.ts` |
| Commands | `RegisteredCommand` / `ResolvedCommand` | Names de-duplicated by occurrence |
| Flags | `ExtensionFlag` + `flagValues` map | Applied during service creation |
| Shortcuts | `ExtensionShortcut` | Conflicts with built-in keybindings detected |
| Provider registration | `ProviderConfig` / `ProviderConfigInput` | Registered into `ModelRegistry` |
| UI | `ExtensionUIContext` | Implemented by interactive mode |

---

## External dependency map

| Package | Used by core/utils modules | CLJS boundary plan |
|---------|---------------------------|--------------------|
| `@open-hax/eta-mu-runtime` | Event bus, envelope primitives | Reuse CLJS runtime primitives |
| `@open-hax/eta-mu-agent-core` | `Agent`, `AgentTool`, `AgentMessage`, state | Ported by `agent-cljs-rewrite` epic |
| `@open-hax/eta-mu-ai` | Models, streaming, `Message`, OAuth | Ported by `ai-cljs-rewrite` epic |
| `@open-hax/eta-mu-tui` | `Theme`, components, keybindings | Ported by `tui-cljs-rewrite` epic |
| `@open-hax/eta-mu-extensions` | Extension examples only | Keep as compatibility targets |
| `typebox` | Tool schemas in `tools/*`, `model-registry` | Replace with Malli (`law.*`) |
| `proper-lockfile` | `auth-storage.ts`, `settings-manager.ts` | Wrap in `extern.lock` |
| `chalk` | `resource-loader.ts`, `tools-manager.ts`, `package-manager-cli.ts` | Replace with Reagent/theme utils |
| `glob`, `ignore`, `minimatch` | `package-manager.ts` | Wrap in `extern.fs` / `extern.pattern` |
| `extract-zip` | `tools-manager.ts` | Wrap in `extern.archive` |
| `file-type` | `utils/mime.ts` | Wrap in `extern.mime` |
| `@silvia-odwyer/photon-node` | `utils/photon.ts`, image resize/convert | Wrap in `extern.image` |
| `@mariozechner/clipboard` | `utils/clipboard-native.ts` | Wrap in `extern.clipboard` |
| `@mariozechner/jiti` | `extensions/loader.ts` | Keep as Node extern for extension loading |
| `yaml` | `utils/frontmatter.ts` | Use CLJS yaml library |
| `uuid` | `session-manager.ts` | Use CLJS uuid |
| `diff` | `tools/edit.ts`, `tools/edit-diff.ts` | Use CLJS diff lib |
| `strip-ansi` | `tools/bash.ts`, `bash-executor.ts` | Small regex replacement |
| `marked`, `cli-highlight` | Theme/markdown rendering (out of scope) | Covered by TUI epic |

---

## Proposed namespace mapping

```text
eta_mu.coding.domain.session          AgentSession, session lifecycle, model cycling
eta_mu.coding.domain.session-store    SessionManager, entries, tree, branching, cwd checks
eta_mu.coding.domain.tools            Tool definitions, wrappers, dispatch
eta_mu.coding.domain.tools.<name>     Per-tool implementations
eta_mu.coding.domain.extensions       Extension API surface, tool wrappers, type guards
eta_mu.coding.domain.compaction       Compaction + branch summarization
eta_mu.coding.domain.skills           Skill loading/formatting
eta_mu.coding.domain.prompts          Prompt templates, system prompt builder
eta_mu.coding.domain.models           Model resolution helpers
eta_mu.coding.domain.auth             Auth guidance messages
eta_mu.coding.domain.defaults         Constants

eta_mu.coding.shape.messages          Message DTOs, convertToLlm
eta_mu.coding.shape.path              Path helpers
eta_mu.coding.shape.tool-render       Tool rendering helpers
eta_mu.coding.shape.frontmatter       Frontmatter parser
eta_mu.coding.shape.source            SourceInfo / provenance
eta_mu.coding.shape.keybindings       Keybinding config types
eta_mu.coding.shape.changelog         Changelog parsing
eta_mu.coding.shape.truncate          Truncation helpers

eta_mu.coding.law.extensions          Malli schemas for ToolDefinition, events, contexts
eta_mu.coding.law.tools               Malli tool input schemas
eta_mu.coding.law.diagnostics         ResourceDiagnostic schemas
eta_mu.coding.law.settings            Settings schemas
eta_mu.coding.law.session             Session entry schemas

eta_mu.coding.infra.runtime           AgentSessionRuntime
eta_mu.coding.infra.services          Service factory
eta_mu.coding.infra.runner            ExtensionRunner
eta_mu.coding.infra.loader            Extension loading
eta_mu.coding.infra.resources         DefaultResourceLoader
eta_mu.coding.infra.packages          DefaultPackageManager
eta_mu.coding.infra.settings          SettingsManager
eta_mu.coding.infra.auth              AuthStorage
eta_mu.coding.infra.models            ModelRegistry
eta_mu.coding.infra.events            EventBus
eta_mu.coding.infra.config-value      resolve-config-value
eta_mu.coding.infra.async             sleep
eta_mu.coding.infra.timings           time helper

eta_mu.coding.extern.fs               FS helpers, glob/ignore/pattern
eta_mu.coding.extern.git              Git URL parsing
eta_mu.coding.extern.bash             Bash executor / BashOperations
eta_mu.coding.extern.exec             Generic execCommand
eta_mu.coding.extern.shell            Shell config, process tree killing
eta_mu.coding.extern.process          Child process helpers
eta_mu.coding.extern.clipboard        Clipboard read/write
eta_mu.coding.extern.image            Photon / image resize / EXIF / MIME
eta_mu.coding.extern.tools            fd/rg tool downloader
eta_mu.coding.extern.stdout           Output guard
eta_mu.coding.extern.network          Version check / fetch helpers
eta_mu.coding.extern.lock             proper-lockfile wrapper
eta_mu.coding.extern.archive          zip extraction
eta_mu.coding.extern.mime             MIME detection

eta_mu.coding.cli.packages            package-manager-cli handlers
eta_mu.coding.cli.index               Top-level public re-export façade
```

---

## Notes and blockers

1. **Raw interop boundaries**: FS, git URL parsing, bash/child-process, clipboard, image conversion, and SDK/model calls must each be wrapped in `extern.*` namespaces with conversion regression tests.
2. **Schema migration**: TypeBox schemas in `tools/*` and `model-registry.ts` must be replaced with Malli schemas under `law.*`.
3. **Agent/AI/TUI coupling**: `AgentSession` is tightly coupled to `@open-hax/eta-mu-agent-core`, `@open-hax/eta-mu-ai`, and `@open-hax/eta-mu-tui`. CLJS ports of those packages are prerequisites for Phase 2 domain work.
4. **Extension loading**: `extensions/loader.ts` uses `@mariozechner/jiti` to import arbitrary TS/JS extension files. This must remain a Node extern even after CLJS migration.
5. **Package manager**: `DefaultPackageManager` runs `npm`, `git`, and shell commands. It should be kept as an `extern` orchestration namespace.
6. **No source code changes**: This inventory does not modify any `.ts` source or test files; it only documents surface contracts.
