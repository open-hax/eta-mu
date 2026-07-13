---
status: incubating
created: 2026-07-12T04:42:41.022441694Z
source-session: ses_0ab7f4f77ffe5FPx616BgensZf
source-task: Fix CLJS JS interop and bracket mismatches in AI-generated code
p-efficiency: 0.5
p-friction: 0.5
p-skill-candidate: 0.85
promoted-to: ""
rejected-reason: ""
---

## Problem
AI-generated ClojureScript frequently has bracket mismatches, and uses JS interop patterns that don't work: Map.size as method call (it's a property), Segmenter.segment returns iterable not iterator (needs Symbol.iterator), StringBuffer doesn't exist in Node.js, nil passes as null not undefined

## Pattern
Any CLJS code touching JS APIs needs a post-generation interop audit

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
After generating CLJS with JS interop, run: 1) bracket balance check, 2) Map property audit (size/keys/values are properties not methods), 3) iterator protocol check (segment/filter etc return iterables), 4) Node.js API availability check, 5) nil vs undefined for JS constructors

## Receipt refs
- none
