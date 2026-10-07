---
category: "tasks"
labels: "rheos, frontmatter, hygiene, truth"
parent: "rheos-cli-card-lifecycle-authority"
type: "task"
write-id: "1791402930875-0.gevzklxhavj9d77081"
points: "3"
title: "Admit design links through Rheos shared frontmatter updates"
priority: "P1"
status: "in_progress"
uuid: "rheos-design-frontmatter-key"
created_at: "2026-10-07T16:20:00Z"
---

# Admit design links through Rheos shared frontmatter updates

## Context

Truth requires feature cards to link their grounding design using `design:`
frontmatter and a body reference. Its reviewed active-influence work cannot
add the missing metadata through canonical Rheos: the shared mutable-key set
omits `:design`. This was verified in standalone `open-hax/rheos` main
`ef3c4abf1ea75199486f693e9470df3fec88dd49`, freshly fetched on 2026-10-07.
No failed board mutation or implementation is claimed.

The existing CLI already accepts generic `--set key=value` and delegates to
`kanban_update_frontmatter`. That tool and the HTTP PATCH handler consult the
same `rheos.backend.law.frontmatter` policy before the existing writer. This
is a missing descriptive key in that policy, not a missing write protocol.

## Outcome

An operator can set or replace a card's design reference through the current
CLI, MCP and HTTP paths, preserving their common write and event behavior.
Truth can then use the qualified upstream artifact to maintain its design link.

## Scope

- Implement in standalone `open-hax/rheos`; eta-mu retains this canonical
  lifecycle card. Do not repair the extracted package's compatibility copy.
- Add only `:design` to the shared mutable-key law. Preserve the existing
  value/serialization policy; this slice does not make path validity a law.
- Keep the pure policy portable: move this one host-neutral namespace to
  `.cljc` without changing its namespace or adapter interfaces.
- Update the existing CLI help, MCP tool description and CLI reference where
  they enumerate permitted keys.
- Add meaningful shared-law and actual adapter regression coverage.

Complexity 3, scope 3, effort 3: one policy key, existing adapters, focused
round-trip and refusal contracts. Re-scope if adapter redesign is necessary.

## Non-goals

No value coercion, path-existence enforcement, card migration, `create --design`
flag, new endpoint, alternate parser, new event type, body-lock change, status
transition bypass, identity mutation, or Truth-local board implementation.
The separate `frontmatter-value-typing-decision` remains unresolved and unchanged.

## Acceptance criteria

- [ ] The pure law accepts `:design` and continues to reject all previously
  protected identity/provenance fields and unknown keys. Status retains its
  dedicated transition-only refusal.
- [ ] Through the actual CLI/tool and HTTP PATCH boundaries, setting and
  replacing `design` on isolated fixture cards gives identical value readback
  and the existing changed-key ledger event, once per successful mutation.
- [ ] Existing body/comments, unrelated frontmatter and the prior event-ledger
  prefix remain intact; normal server-owned write-id behavior is retained.
- [ ] A mixed update containing `design` and a forbidden key refuses the whole
  update before any card write or changed-key event. Empty updates preserve the
  existing no-op contract.
- [ ] RED demonstrates the current missing-key refusal through those adapter
  boundaries; GREEN passes the relevant upstream tests/build and zero-warning
  lint. Tests must not substitute a second frontmatter writer or policy.
- [ ] Source and documentation identify the same permitted key set. Publish
  an immutable qualified upstream artifact identity for downstream consumption.

## Verification

Start from the standalone source's existing `agent_tools_test.cljs` and
`task_edit_test.cljs` seams, plus the real HTTP handler. Record exact RED/GREEN
commands and results in its own receipts; keep fixture data isolated. Use
Rheos for all canonical board reads, comments and transitions. After upstream
qualification, Truth's owner records the chosen artifact/hash and performs
its ordinary metadata edit and scope refinement; this card alone grants no
Truth feature implementation or gameplay acceptance.

## Risks

The older lifecycle epic mentions donor paths and obsolete interfaces; the
fresh standalone source controls implementation facts. An unknown or missing
design file remains descriptive text under the existing value policy, not an
automatically verified design. New parser or coercion work would exceed this
three-point repair and belongs in a separately reviewed slice.

---

Planning admission at 9f33ae0a56fc479a824fb754d3b7fa9493adb791: fresh pr-flow PASS with 11 passing checks, native exact-head MiMo APPROVED review5445961334 and zero unresolved findings. The one available planning cohort is complete; authenticated CodeRabbit quota6043679214 is bound to request6043676716 until 2026-10-07T18:42:20Z, not an approval; Codex6042134501 has UNKNOWN reset. Root read the full current review. Admit only this three-point shared design-key slice in standalone open-hax/rheos at ef3c4abf1ea75199486f693e9470df3fec88dd49. RED proposal SHA256 98f68e7769c751c4f10dfca41a1faf4c74d23b3e772225d2cb887c93228dace4 exercises existing pure policy, actual tool/CLI/HTTP writer and refusal/event boundaries. Public empty updates retain refusals and inner writer no-op; successful serialization preserves supported parsed content, not arbitrary raw YAML. No Truth implementation admission, merge, auto-merge, runtime release or board policy duplication.

Root releases one actual Rheos design-field RED compile+explicitNode attempt red-01 in isolatedef3c4ab.13newtests frozen;188pins/fourfilesets verified. Runner2eca5d96c621fd63c5246f63a6776bae9af79b12e3b2d538b525c6c464191280;manifest4573f88a. One shared280swork300total2GiB2CPU, sanitizedJVMenv, force-spawn existingtesttarget then explicitNode exit; coldShadow3.5.5cache means completionconditional. Compile/timeouts/errors are not meaningfulRED. Native closed with238PIDsabsent; subsequentclockRED closed5.778s16/9715F0E/PID2306106absent. This owns sole runtime lane; no auto retry/extension/sourceimplementation/merge.

Observed Rheos design-field RED at ef3c4ab: actual compile exit0 and explicitNode exit1 both report166tests1361assertions73failures0errors. All73failures are newdesignpolicy/realtool/CLI/HTTP acceptance assertions; existingrefusalcontrols pass.35.339s total;all4observedPIDsabsent and188pinsunchanged. Root closuref639dafa8bc2ac87e56e9e2ddba30513100b421a1dda91ab92b9433b33ed7bad. RED is qualified; portablelaw/key/discoverability GREEN may proceed, no consumeractivation/merge.

Root releases exactly one local GREEN green-01 qualification in separate Rheos worktree atRED171c4f22. Four source/docs edits independently PASS1dcef665 plus one ^js hint eabf67f3 preserving all assertions. Root verified finalmanifest146c4a58c801a57d9a4278023008f98277baae43c2a54483355d54b322fa22e0,supervisor51ebbd58825eedf29e8f6bf5460a04ca14577fd2c3d006ed200a52e1ca497e42,54rows224pins480warmfiles/archiveroundtrip. Seven real gates: callerfixture,lint,LSP,classpathedcompiletest,explicitNode,releasefourtargets,actualCIcompletedoutputs. Shared580swork600stotal,2GiBJavaheap2processors,ownedprocessgroups/rawlogs/reap; no retry/extension or aggregateOSmemoryclaim. All prior released Life/clock/Rheos/native lanes closed; sole runtime lane root-owned. No hostedapproval,publication,operationalCLIactivation,PR48admission,merge or parentcompletion from this release.

Local shared Rheos GREEN is qualified: green-01 completed all7gates in102.476824754s, callerfixture/lint/LSP, actualcompileautorun166tests1361assertions0F0E, explicitNode same0F0E, server/cli/github-sync/app releases all0compilerwarnings, actualCIcompleted-output guard passed. Root closure faf2a602c52d2d9f9c71e7fcfb3724ca694ba8a7c0953a3180feee91cefd7c8a verifies224protectedpins,50rawexecutionfiles,all18recordedPIDsabsent/reaped andcleanownedgroups. Only design mutable-key law moved .cljc plus3existingdiscoverylists andone ^js HTTPtesthint; assertionsunchanged. Raw pnpm missing NPM_TOKEN substitution advisory andsource-map-support advisory preserved; neither is a compiler or lint diagnostic. No retry. All localruntime lanes nowclosed,retainedprimaryuntouched. Publication andhostedreview next; no operationalCLIactivation,PR48admission,merge,parentcompletion or Gate claim.

Shared implementation now published for review: https://github.com/open-hax/rheos/pull/6 at fb202a9c98ae6b613e9c4949da2ff05442c78f98 (ready,auto-mergeoff). ExactRED171c4f22 preserved; localGREENall7gates102.477s166/13610F0E fourreleasebuilds0compilerwarnings,18PIDsabsent.107newtextualdiagnosticoriginals losslesslypacked/independentlyroundtripped; package0a21b0b0,independentauditd1ec8fb4,92cumulativeno-renamepaths. Allraworiginals and480filegeneratedwarmbackup remainpreserved. NativeCodeRabbitpending requestdedup,MiMohostedpending;Codex6045627413UNKNOWNnoretry. Historicalplanningadmission remains at9f33ae0. Card staysInProgress pendingnative reviews/lawful downstream adoption; no merge,auto-merge,TruthPR48admission orprimaryactivation.

---