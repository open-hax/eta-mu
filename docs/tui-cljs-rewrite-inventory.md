# TUI CLJS Rewrite — Inventory and Dependency Map

> Package: `packages/legacy/tui` (`@open-hax/eta-mu-tui`)  
> Source: 22,081 TS lines across 53 files (per epic)  
> Parent epic: `kanban/epics/tui-cljs-rewrite.md`

## Namespace taxonomy

```text
eta_mu.tui.domain.*   component state decisions, input event handling, keybindings, autocomplete
eta_mu.tui.shape.*    props↔CLJS data transforms, text width/ANSI/wrapping helpers
eta_mu.tui.law.*      Malli schemas for component props and terminal state
eta_mu.tui.extern.*   terminal/ANSI/keyboard/image/raw JS interop
eta_mu.tui.web.*      Reagent terminal components
eta_mu.tui.cli.*      stable JS facade exports
```

## Source-file inventory

| File | Lines | Proposed namespace | Public exports | Consumers inside `packages/legacy` | Raw JS interop / coupling notes |
|------|-------|--------------------|----------------|------------------------------------|---------------------------------|
| `src/index.ts` | 106 | `eta_mu.tui.cli.index` | Re-exports all public API | All coding-agent imports | Thin TS compatibility shell; keep as facade in Phase 5 |
| `src/tui.ts` | 1,243 | `eta_mu.tui.domain.tui` | `Component`, `Container`, `Focusable`, `isFocusable`, `TUI`, `CURSOR_MARKER`, `OverlayAnchor`, `OverlayHandle`, `OverlayMargin`, `OverlayOptions`, `SizeValue`, `visibleWidth` | `interactive-mode.ts`, `custom-editor.ts`, `countdown-timer.ts`, `daxnuts.ts`, `armin.ts`, `tool-execution.ts`, `edit-tool-no-full-redraw.test.ts`, `streaming-render-debug.ts`, `main.ts`, `config-selector.ts`, `session-picker.ts`, `rpc-extension-ui.ts`, `overlay-qa-tests.ts`, `doom-component.ts` | `process.env.PI_HARDWARE_CURSOR`, `PI_CLEAR_ON_SHRINK`, `PI_DEBUG_REDRAW`, `PI_TUI_DEBUG`; `process.nextTick`; `fs.appendFileSync`/`writeFileSync`; `os.homedir`; `path.join`; `performance.now`; ANSI escape generation for differential render |
| `src/terminal.ts` | 395 | `eta_mu.tui.extern.terminal` | `Terminal` (interface), `ProcessTerminal` | `interactive-mode.ts`, `main.ts`, `config-selector.ts`, `session-picker.ts`, `streaming-render-debug.ts`, `rpc-extension-ui.ts` | `process.stdin`/`stdout`, `setRawMode`, `SIGWINCH`, `SIGKILL` (drain), `koffi`/`kernel32` on Windows, bracketed paste, Kitty protocol query/enable/disable, OSC 9;4 progress |
| `src/stdin-buffer.ts` | 411 | `eta_mu.tui.extern.stdin-buffer` | `StdinBuffer`, `StdinBufferEventMap`, `StdinBufferOptions` | Used only by `ProcessTerminal` (internal) | `EventEmitter`, `Buffer`, `setTimeout`/`clearTimeout`, CSI/OSC/DCS/APC sequence completion |
| `src/terminal-image.ts` | 414 | `eta_mu.tui.extern.image` | `ImageProtocol`, `TerminalCapabilities`, `CellDimensions`, `ImageDimensions`, `ImageRenderOptions`, `allocateImageId`, `calculateImageRows`, `deleteAllKittyImages`, `deleteKittyImage`, `detectCapabilities`, `encodeITerm2`, `encodeKitty`, `getCapabilities`, `getCellDimensions`, `getGifDimensions`, `getImageDimensions`, `getJpegDimensions`, `getPngDimensions`, `getWebpDimensions`, `hyperlink`, `imageFallback`, `isImageLine`, `renderImage`, `resetCapabilitiesCache`, `setCapabilities`, `setCellDimensions` | `tool-execution.ts`, `render-utils.ts`, `earendil-announcement.ts`, `image.ts`, `terminal-image.test.ts` | `process.env.TERM_PROGRAM`, `TERM`, `COLORTERM`, `TMUX`, `KITTY_WINDOW_ID`, `WEZTERM_PANE`, `ITERM_SESSION_ID`, etc.; `Buffer` for base64→binary parsing; Kitty/iTerm2 ANSI sequences; OSC 8 hyperlinks |
| `src/keys.ts` | 1,400 | `eta_mu.tui.extern.keyboard` (parsing), `eta_mu.tui.domain.keys` (identifiers) | `Key`, `KeyId`, `KeyEventType`, `decodeKittyPrintable`, `decodePrintableKey`, `isKeyRelease`, `isKeyRepeat`, `isKittyProtocolActive`, `matchesKey`, `parseKey`, `setKittyProtocolActive` | `interactive-mode.ts`, `custom-editor.ts`, `extension-editor.ts`, `extension-input.ts`, `extension-selector.ts`, `login-dialog.ts`, `keybinding-hints.ts`, `doom-keys.ts`, `modal-editor.ts`, `overlay-test.ts`, `overlay-qa-tests.ts`, `plan-mode/index.ts`, `preset.ts`, `question.ts`, `questionnaire.ts`, `snake.ts`, `space-invaders.ts`, `summarize.ts`, `tic-tac-toe.ts`, `todo.ts`, many tests | `process.env.WT_SESSION`, `SSH_CONNECTION`, `SSH_CLIENT`, `SSH_TTY`; Kitty CSI-u / xterm modifyOtherKeys parsing; legacy escape sequence tables |
| `src/keybindings.ts` | 244 | `eta_mu.tui.domain.keybindings`, `eta_mu.tui.law.keybindings` | `Keybinding`, `KeybindingConflict`, `KeybindingDefinition`, `KeybindingDefinitions`, `Keybindings`, `KeybindingsConfig`, `KeybindingsManager`, `TUI_KEYBINDINGS`, `getKeybindings`, `setKeybindings` | `interactive-mode.ts`, `main.ts`, `session-picker.ts`, `cancellable-loader.ts`, `settings-selector.ts`, `extension-selector.ts`, `extension-input.ts`, `extension-editor.ts`, `login-dialog.ts`, `user-message-selector.ts`, `keybinding-hints.ts`, `coding-agent/src/core/keybindings.ts` (extends `TUI_KEYBINDINGS`), many tests | Declarative types extended by coding-agent (`AppKeybindings`); no raw JS interop |
| `src/autocomplete.ts` | 783 | `eta_mu.tui.domain.autocomplete`, `eta_mu.tui.extern.autocomplete` | `AutocompleteItem`, `AutocompleteProvider`, `AutocompleteSuggestions`, `SlashCommand`, `CombinedAutocompleteProvider` | `interactive-mode.ts`, `editor.ts`, `interactive-mode-status.test.ts` | `child_process.spawn` (fd), `fs.readdirSync`/`statSync`, `os.homedir`, `path` — file-system interop for `@`/`/` completion |
| `src/utils.ts` | 1,085 | `eta_mu.tui.shape.text`, `eta_mu.tui.extern.ansi` | `applyBackgroundToLine`, `extractAnsiCode`, `extractSegments`, `getSegmenter`, `isPunctuationChar`, `isWhitespaceChar`, `sliceByColumn`, `sliceWithWidth`, `truncateToWidth`, `visibleWidth`, `wrapTextWithAnsi` | Widespread: `footer.ts`, `bash-execution.ts`, `bash.ts`, `tool-execution.ts`, `custom-footer.ts`, `modal-editor.ts`, `overlay-test.ts`, `overlay-qa-tests.ts`, `question.ts`, `questionnaire.ts`, `tic-tac-toe.ts`, `todo.ts`, many tests | `Intl.Segmenter`, `get-east-asian-width` npm package; ANSI SGR/OSC/APC extraction and tracking (pooled tracker) |
| `src/fuzzy.ts` | 133 | `eta_mu.tui.domain.fuzzy` | `FuzzyMatch`, `fuzzyFilter`, `fuzzyMatch` | `interactive-mode.ts`, `settings-list.ts`, `session-selector-search.ts`, `list-models.ts`, `fuzzy.test.ts` | Pure algorithm; no raw interop |
| `src/kill-ring.ts` | 46 | `eta_mu.tui.domain.kill-ring` | `KillRing` | `editor.ts`, `input.ts` | Pure data structure |
| `src/undo-stack.ts` | 28 | `eta_mu.tui.domain.undo-stack` | `UndoStack<S>` | `editor.ts`, `input.ts` | `structuredClone` |
| `src/editor-component.ts` | 74 | `eta_mu.tui.shape.editor-component` | `EditorComponent` (interface) | `interactive-mode.ts`, `custom-editor.ts`, `extension-editor.ts`, `extension-input.ts`, `export-html-whitespace.test.ts`, `dynamic-border.ts`, `doom-component.ts`, `armin.ts` | No raw interop; shape contract for custom editors |
| `src/components/editor.ts` | 2,292 | `eta_mu.tui.domain.editor`, `eta_mu.tui.web.editor` | `Editor`, `EditorOptions`, `EditorTheme`, `TextChunk`, `wordWrapLine` | `interactive-mode.ts`, `custom-editor.ts`, `extension-editor.ts`, `extension-input.ts`, `question.ts`, `questionnaire.ts`, `editor.test.ts` | `setTimeout` (autocomplete debounce), `AbortController`, bracketed-paste handling, paste-marker segmentation, depends on `SelectList`, `KillRing`, `UndoStack`, keybindings |
| `src/components/input.ts` | 503 | `eta_mu.tui.domain.input`, `eta_mu.tui.web.input` | `Input` | `interactive-mode.ts`, `login-dialog.ts`, `extension-input.ts`, `rpc-extension-ui.ts`, `input.test.ts` | `KillRing`, `UndoStack`, keybindings |
| `src/components/select-list.ts` | 229 | `eta_mu.tui.domain.select-list`, `eta_mu.tui.web.select-list` | `SelectList`, `SelectItem`, `SelectListLayoutOptions`, `SelectListTheme`, `SelectListTruncatePrimaryContext` | `interactive-mode.ts`, `editor.ts`, `config-selector.ts`, `model-selector.ts`, `oauth-selector.ts`, `scoped-models-selector.ts`, `session-selector.ts`, `settings-selector.ts`, `show-images-selector.ts`, `theme-selector.ts`, `thinking-selector.ts`, `tree-selector.ts`, `preset.ts`, `rpc-extension-ui.ts` | keybindings |
| `src/components/settings-list.ts` | 250 | `eta_mu.tui.domain.settings-list`, `eta_mu.tui.web.settings-list` | `SettingsList`, `SettingItem`, `SettingsListOptions`, `SettingsListTheme` | `interactive-mode.ts`, `settings-selector.ts`, `tools.ts` | Uses `Input` for search, `fuzzyFilter`, keybindings |
| `src/components/markdown.ts` | 852 | `eta_mu.tui.domain.markdown`, `eta_mu.tui.web.markdown` | `Markdown`, `MarkdownTheme`, `DefaultTextStyle` | `interactive-mode.ts`, `assistant-message.ts`, `branch-summary-message.ts`, `compaction-summary-message.ts`, `custom-message.ts`, `skill-invocation-message.ts`, `user-message.ts`, `summarize.ts`, `subagent/index.ts`, `message-renderer.ts`, `markdown.test.ts` | `marked` npm package; `terminal-image` (hyperlinks, `isImageLine`) |
| `src/components/image.ts` | 104 | `eta_mu.tui.web.image` | `Image`, `ImageOptions`, `ImageTheme` | `interactive-mode.ts`, `tool-execution.ts`, `earendil-announcement.ts` | Kitty/iTerm2 ANSI via `terminal-image` |
| `src/components/loader.ts` | 86 | `eta_mu.tui.web.loader` | `Loader`, `LoaderIndicatorOptions` | `interactive-mode.ts`, `bash-execution.ts`, `bordered-loader.ts`, `tool-execution.ts` | `setInterval`/`clearInterval`, depends on `Text` |
| `src/components/cancellable-loader.ts` | 40 | `eta_mu.tui.web.cancellable-loader` | `CancellableLoader` | `interactive-mode.ts`, `bordered-loader.ts` | `AbortController`; extends `Loader` |
| `src/components/box.ts` | 137 | `eta_mu.tui.web.box` | `Box` | `interactive-mode.ts`, `assistant-message.ts`, `branch-summary-message.ts`, `compaction-summary-message.ts`, `custom-message.ts`, `skill-invocation-message.ts`, `user-message.ts`, `tool-execution.ts`, `message-renderer.ts`, `user-message.ts` | Depends on `utils` |
| `src/components/text.ts` | 106 | `eta_mu.tui.web.text` | `Text` | Very widespread: most interactive components and tests | Depends on `utils` |
| `src/components/truncated-text.ts` | 65 | `eta_mu.tui.web.truncated-text` | `TruncatedText` | `interactive-mode.ts`, `visual-truncate.ts` | Depends on `utils` |
| `src/components/spacer.ts` | 28 | `eta_mu.tui.web.spacer` | `Spacer` | Widespread across components and tests | None |

## Test-file inventory

| File | Tests focus | Depends on |
|------|-------------|------------|
| `test/autocomplete.test.ts` | `CombinedAutocompleteProvider` path/`@`/slash completion | `src/autocomplete.js` |
| `test/bug-regression-isimageline-startswith-bug.test.ts` | `isImageLine` prefix bug | `src/terminal-image.js` |
| `test/editor.test.ts` | `Editor`: history, CSI-u, Unicode, wrapping, kill-ring, undo | `src/components/editor.js`, `src/utils.js`, `test-themes.js`, `virtual-terminal.js` |
| `test/fuzzy.test.ts` | `fuzzyMatch`, `fuzzyFilter` | `src/fuzzy.js` |
| `test/input.test.ts` | `Input`: rendering, kill-ring, undo | `src/components/input.js`, `src/utils.js` |
| `test/keybindings.test.ts` | `KeybindingsManager`, conflicts, user bindings | `src/keybindings.js` |
| `test/keys.test.ts` | `matchesKey`, `parseKey`, Kitty/modifyOtherKeys | `src/keys.js` |
| `test/markdown.test.ts` | `Markdown` rendering | `src/components/markdown.js` |
| `test/overlay-non-capturing.test.ts` | non-capturing overlay focus behavior | `src/tui.js` |
| `test/overlay-options.test.ts` | overlay sizing/anchoring | `src/tui.js` |
| `test/overlay-short-content.test.ts` | overlay compositing with short content | `src/tui.js` |
| `test/regression-regional-indicator-width.test.ts` | `visibleWidth` regional indicator handling | `src/utils.js` |
| `test/select-list.test.ts` | `SelectList` navigation/filtering | `src/components/select-list.js` |
| `test/stdin-buffer.test.ts` | `StdinBuffer` sequence parsing | `src/stdin-buffer.js` |
| `test/terminal-image.test.ts` | image encoding, dimensions, fallback | `src/terminal-image.js` |
| `test/truncated-text.test.ts` | `TruncatedText` rendering | `src/components/truncated-text.js` |
| `test/truncate-to-width.test.ts` | `truncateToWidth`, `visibleWidth` | `src/utils.js` |
| `test/tui-cell-size-input.test.ts` | TUI cell-size response consumption | `src/tui.js`, `src/terminal-image.js` |
| `test/tui-overlay-style-leak.test.ts` | overlay style isolation | `src/tui.js` |
| `test/tui-render.test.ts` | TUI differential/full rendering, resize, shrinkage | `src/tui.js`, `virtual-terminal.js` |
| `test/wrap-ansi.test.ts` | `wrapTextWithAnsi` | `src/utils.js` |

Test infrastructure (not `.test.ts`): `virtual-terminal.ts`, `test-themes.ts`, `key-tester.ts`, `chat-simple.ts`, `image-test.ts`, `viewport-overwrite-repro.ts`.

## Public exports and consumers summary

All `packages/legacy` consumers are in `packages/legacy/coding-agent`. No runtime-core or boundary-adapter package imports `@open-hax/eta-mu-tui` today.

| Export group | Primary consumers (relative to `packages/legacy/coding-agent`) |
|--------------|----------------------------------------------------------------|
| `TUI`, `ProcessTerminal`, `Terminal` | `src/main.ts`, `src/modes/interactive/interactive-mode.ts`, `src/cli/config-selector.ts`, `src/cli/session-picker.ts`, tests/examples |
| `Component`, `Container`, `Focusable`, `OverlayHandle`, `OverlayOptions`, `CURSOR_MARKER` | Most interactive components (`assistant-message`, `tool-execution`, `session-selector`, etc.) and extension examples |
| `Editor` + theme/options | `interactive-mode.ts`, `custom-editor.ts`, `extension-editor.ts`, `extension-input.ts`, extension examples |
| `Input` | `interactive-mode.ts`, `login-dialog.ts`, `extension-input.ts` |
| `Markdown` + theme | Message components and extension examples |
| `SelectList` + theme/options | Selectors (`model`, `session`, `settings`, `theme`, `thinking`, `tree`, etc.) and extension examples |
| `SettingsList` + theme | `settings-selector.ts`, extension examples |
| `Image` + capabilities | `tool-execution.ts`, `earendil-announcement.ts` |
| `Loader`/`CancellableLoader` | `bash-execution.ts`, `bordered-loader.ts`, `tool-execution.ts` |
| `Box`, `Text`, `Spacer`, `TruncatedText` | Widespread layout use across interactive components |
| `getKeybindings`, `setKeybindings`, `TUI_KEYBINDINGS`, `KeyId`, `Keybinding` | `interactive-mode.ts`, `main.ts`, `session-picker.ts`, `coding-agent/src/core/keybindings.ts` (extends registry), selectors, tests |
| `matchesKey`, `Key`, `parseKey`, `isKeyRelease`, `decodeKittyPrintable`/`decodePrintableKey` | Custom input handling in components and extension examples |
| `fuzzyFilter`, `fuzzyMatch` | `settings-list.ts`, `session-selector-search.ts`, `list-models.ts` |
| `visibleWidth`, `truncateToWidth`, `wrapTextWithAnsi` | Footer, message rendering, tests, many extension examples |
| `CombinedAutocompleteProvider`, `AutocompleteProvider`, `SlashCommand` | `interactive-mode.ts`, `editor.ts`, tests |
| `getCapabilities`, `getImageDimensions`, `imageFallback` | `render-utils.ts` (tool rendering) |

## Raw JS interop surfaces

These modules must be wrapped in `extern.*` namespaces and backed by boundary adapters in the CLJS runtime:

| Surface | Module | JS APIs / npm packages |
|---------|--------|------------------------|
| Terminal I/O | `src/terminal.ts` | `process.stdin`, `process.stdout`, `setRawMode`, `SIGWINCH`, `koffi`/`kernel32` (Windows VT input), `os.homedir`, `path`, `fs` (write log) |
| Stdin buffering | `src/stdin-buffer.ts` | `events.EventEmitter`, `Buffer`, `setTimeout`/`clearTimeout` |
| Keyboard parsing | `src/keys.ts` | `process.env` terminal-detection heuristics, `String.fromCodePoint` |
| Image encoding | `src/terminal-image.ts` | `Buffer` (base64→binary), `process.env` capability detection, Kitty/iTerm2 ANSI sequences, OSC 8 hyperlinks |
| ANSI/text layout | `src/utils.ts` | `Intl.Segmenter`, `get-east-asian-width` |
| File completion | `src/autocomplete.ts` | `child_process.spawn` (fd), `fs.readdirSync`/`statSync`, `os.homedir`, `path` |
| Markdown | `src/components/markdown.ts` | `marked` tokenizer/parser |
| Timers | `src/components/editor.ts`, `src/components/loader.ts`, `src/tui.ts` | `setTimeout`/`setInterval`/`clearTimeout`/`clearInterval`, `performance.now` |
| Process env | `src/tui.ts`, `src/terminal-image.ts`, `src/keys.ts` | `process.env.PI_*`, `TERM*`, `WT_SESSION`, `SSH_*`, `KITTY_*`, etc. |

## Dependencies on runtime core, coding-agent interactive mode, and boundary adapters

- **No upstream dependency on runtime core or boundary adapters.** `@open-hax/eta-mu-tui` is a leaf legacy package. It does not import any other `packages/legacy/*` or `packages/*` workspace package.
- **coding-agent interactive mode is the dominant downstream consumer.** ~60+ source and test files import the package, with the heaviest concentration in `src/modes/interactive/components/*` and `src/modes/interactive/interactive-mode.ts`.
- **Extension surface coupling.** `src/core/extensions/loader.ts` re-exports `@open-hax/eta-mu-tui` to extensions as `_bundledPiTui`, and `src/core/extensions/types.ts` references `KeyId` and `EditorComponent` in the extension API. The CLJS rewrite must preserve this stable facade for existing extensions.
- **Keybinding extension coupling.** `src/core/keybindings.ts` extends `TUI_KEYBINDINGS` via TypeScript declaration merging (`declare module "@open-hax/eta-mu-tui"`). The CLJS port needs an equivalent open registry for app-level keybindings.
- **Boundary adapter blockers.** `extern.terminal`, `extern.stdin-buffer`, `extern.keyboard`, and `extern.image` cannot be fully ported until the CLJS boundary-adapter patterns for Node.js `process` I/O, `Buffer`, and `child_process` are established.

## Recommended remaining task breakdown and point estimates

| Phase | Task | Points | Depends on |
|-------|------|--------|------------|
| Phase 2 | Terminal extern adapters (`terminal`, `stdin-buffer`, `terminal-image`, raw `keys` parsing) with conversion tests | 5 | Boundary-adapter patterns |
| Phase 3a | Core domain/utils (`utils`, `fuzzy`, `kill-ring`, `undo-stack`, `keybindings`, `autocomplete`) | 5 | Phase 2 (keybinding interop) |
| Phase 3b | Web components (`box`, `text`, `spacer`, `truncated-text`, `loader`, `markdown`, `image`, `select-list`, `settings-list`) | 5 | Phase 3a |
| Phase 3c | Input/editor components (`input`, `editor`) | 5 | Phase 3a, Phase 3b (`select-list` for autocomplete) |
| Phase 4 | Test parity — port tests or run legacy tests against CLJS components | 3 | Phases 3a–3c |
| Phase 5 | CLI facade (`src/index.ts` thin TS shell) | 2 | Phases 3–4 |
| Phase 6 | Cutover — delete obsolete TS modules after parity | 1 | Phase 5 |

## Verification notes

- `pnpm --filter @open-hax/eta-mu-tui test` should continue to pass while legacy TS remains authoritative.
- `node scripts/ts-line-count.mjs packages/legacy/tui` is the guard for the TypeScript deprecation policy; net TS line count must not increase across commits.
- The only existing CLJS references to TUI are none; this inventory is the prerequisite for creating them.
