- ts: 2026-07-10T21:02:59.880974712Z
  session: ses_0b22d17e2ffewi9rOZYs1A9G0w
  task: Organized timestamped notes in docs/notes/
  p-efficiency: 0.8
  p-friction: 0.2
  p-skill-candidate: 0.3
  spore: none
  receipt-refs: 2026-07-10T21:01:46.065Z
  note: Bulk note organization is safely scriptable once categories and slugs are decided; embedding metadata in the script keeps the operation reproducible.
- ts: 2026-07-12T04:42:27.432267638Z
  session: ses_0ab7f4f77ffe5FPx616BgensZf
  task: Fixed bracket mismatches, CLJS interop idioms, and test assertions in terminal-ui-cljs
  p-efficiency: 0.5
  p-friction: 0.7
  p-skill-candidate: 0.8
  spore: none
  receipt-refs: none
  note: Many bracket errors from AI-generated code. CLJS interop gotchas: Map.size is property not method, Segmenter returns iterable not iterator, StringBuffer doesn't exist in Node.js. Pattern: systematic bracket audit + CLJS JS interop idiom checklist.
- ts: 2026-07-12T05:08:31.328988047Z
  session: ses_0ab7f4f77ffe5FPx616BgensZf
  task: Fixed OpenCode extension runtime errors — build-tool return type mismatch
  p-efficiency: 0.7
  p-friction: 0.5
  p-skill-candidate: 0.6
  spore: none
  receipt-refs: none
  note: Extensions returned #js {:content ...} but OpenCode expects Promise<string>. Fix was small (result->string + wrap-execute) but required tracing the full loading chain. Pattern: OpenCode plugin API contract mismatch.
