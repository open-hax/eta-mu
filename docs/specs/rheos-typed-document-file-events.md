# Rheos typed document file events

Status: implementation draft
Owner card: `rheos-typed-document-file-events`
Parent: `workflow-dsl-kanban-reference`

## Outcome

Rheos treats Markdown as a human editing adapter for typed document-process
proposals. A profiled document points at Katamorph contract/resource identities,
a named Malli schema, and a relative EDN sidecar. An add/change file event reads
and validates those inputs, then appends exactly one typed proposal or rejection
event. The event is evidence for a later workflow interpreter; it is not accepted
workflow state by itself.

## Profile surface

The existing lossless Markdown parser remains a deliberately partial YAML
decoder. The profile therefore uses only top-level string scalars:

```yaml
---
rheos-profile: document-process/v1
rheos-document: translation-review
rheos-contract: translation/document-v1
rheos-resource: workflow/translation-review
rheos-schema: translation/document-v1
rheos-sidecar: translation-review.edn
---
```

The EDN sidecar owns structural values:

```clojure
{:process/schemas
 {:translation/document-v1
  [:map {:closed true}
   [:document/id :string]
   [:document/body :string]
   [:translation/language :string]]}
 :process/value
 {:translation/language "fr"}
 :process/contracts
 [{:contract/id :translation/review-policy}]
 :process/resources
 [{:resource/id :translation/glossary}]}
```

The Markdown profile's document/body fields have precedence over same-named
sidecar values. Contract and resource references are combined without duplicate
identities. The selected schema must exist in `:process/schemas` and the assembled
value must pass Katamorph's Malli validation boundary.

## Event contract

Successful validation emits `rheos.document.file-change-proposed`. The payload
contains the document identity, source/sidecar paths, change kind, SHA-256 source
hash, frontmatter decoder provenance, contract/resource references, schema
identity, and assembled value.

Any profiled-document failure emits `rheos.document.file-change-rejected` with
the same source identity/provenance that could be recovered plus stable error
data. It emits no proposal and invokes no workflow action.

## Security and authority

- Sidecar paths must be non-empty, relative, and resolve inside the configured
  Rheos task root.
- Only add/change events are interpreted in this slice; deletion stays explicit
  future work.
- Unprofiled Markdown preserves existing Kanban watcher behavior byte-for-byte.
- The typed event is a proposal. Accepted state still belongs to a future
  deterministic event fold and rematerialization path.
- Sol and Knoxx may later consume the same event fixture, but neither runtime is
  made an authority for the Markdown source or Katamorph vocabulary here.

## Construction phases

1. Law: document profile, sidecar, assembled value, and proposal/rejection shapes.
2. Shape: profile normalization, EDN decoding, deterministic merge.
3. Extern: contained path resolution, Node file reads, SHA-256 digest.
4. Domain: Katamorph-backed adjudication and pure event construction.
5. Infra: watcher orchestration and ledger append for profiled documents.
6. Verification: law/shape/domain/infra tests, kondo, Rheos tests, release build.

## Deferred

Git commit/worldline attribution, accepted-state folds, Markdown pull/push/sync,
sidecar-only watch events, action execution, and Sol/Knoxx transport integration
remain separately owned work.
