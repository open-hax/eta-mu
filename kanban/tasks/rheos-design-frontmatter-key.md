---
uuid: "rheos-design-frontmatter-key"
title: "Admit design links through Rheos shared frontmatter updates"
status: "incoming"
type: "task"
priority: "P1"
points: "3"
labels: "rheos, frontmatter, hygiene, truth"
parent: "rheos-cli-card-lifecycle-authority"
category: "tasks"
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
