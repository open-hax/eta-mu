# @eta-mu/document-history

Immutable document revisions, causal conflict projection, and disposable EDN/Markdown
snapshots. Clio directly owns ledger creation, locked append, schema history,
canonicalization, and projection hashing. This package owns document revision semantics;
applications own authorization and publication policy.

## Use from ClojureScript

Keep `packages/document-history` and its sibling `packages/clio` together when consuming
an immutable eta-mu Git revision. `deps.edn` declares the sibling dependency. A Shadow
consumer can add both `src` paths and Clio's pinned Maven dependencies. Install the native
JavaScript dependency `fs-ext-extra-prebuilt` **2.2.9** in the consumer's Node environment.
No mutable main branch, copied Clio implementation, or database adapter is required.

```clojure
(ns app.infra.documents
  (:require [document-history.infra.store :as documents]))

(def store (documents/open! "/state/.ημ/documents"))
(def first-save
  (documents/commit! store
    {:document/id "welcome"
     :document/metadata {:title "Welcome" :labels #{:guide}}
     :document/markdown "# Welcome\n"
     :revision/actor "actor:alice"
     :revision/parents []}))

(documents/commit! store
  {:document/id "welcome"
   :document/metadata {:title "Welcome" :labels #{:guide :reviewed}}
   :document/markdown "# Welcome\n\nReviewed content.\n"
   :revision/actor "actor:alice"
   :revision/parents [(:commit/revision first-save)]})

(documents/read! store "welcome")
(documents/read-revision! store "welcome" (:commit/revision first-save))
(documents/list! store)
```

The API is synchronous, matching Clio's locked filesystem API. A successful `commit!`
returns the current projection with `:commit/revision` identifying **this write**.
Concurrent writers can finish between append and read; `:revision/selected` may identify
another displayed head. Use `read-revision!` with `:commit/revision` when returning the
exact saved branch and its immutable Markdown source path.

`seed!` accepts the same command with empty parents. It imports only if the document
has no accepted history, returning `:seed/created?`. A stable per-document Clio kernel
lock covers read-check-and-commit. Its inode remains in place permanently, and process
exit releases the kernel lock. Parentless normal commits share this lock so a seed's
empty check and append are linearizable. If normal creation won, the seed returns the
existing projection. If the seed won, a later independent normal root claim is still
retained. Parented edits remain independent partitions; initialization is not a
permanent uniqueness constraint.

## Authority and conflict semantics

A revision records the complete EDN metadata map and Markdown string, actor, Clio UUID,
Clio ISO timestamp, and editor-observed causal parents. Every save gets a distinct Clio
stream at sequence 1. There is no shared revision allocator. Physical partitions are
independent of logical document identity.

Two edits with the same parents remain two heads. Canonical order provides a stable
head for display; it does not resolve conflicts. Timestamps are recorded exactly as
Clio produces them, but equal timestamps and clock skew never erase a sibling. A
resolution is another full revision whose parents explicitly include both heads. All
previous metadata and bodies remain in the ledger.

The caller must send the revisions the editor actually observed. Substituting current
server heads for a stale editor would falsely turn a concurrent edit into a causal
successor. Unknown or cross-document parents are refused before publication.

Each read replays finalized partitions through Clio; snapshots never decide current
state. A projection contains:

- `:document/id`, `:document/metadata`, `:document/markdown`;
- `:revision/selected`, `:revision/heads`, `:revision/conflicted?`;
- `:revision/history`, containing immutable `:revision/id`, `:revision/at`,
  `:revision/actor`, `:revision/parents`, metadata, and Markdown for every revision;
- `:projection/source-hash`, `:snapshot/metadata-path`, `:snapshot/markdown-path`.

`read-revision!` folds only the named revision's causal ancestry. The full current
history and sibling heads remain available through `read!`.

## Storage

The resolved storage root must be beneath a `.ημ` path component:

```text
.ημ/documents/
  schemas/<Clio-schema-root>.edn
  ledgers/<event-uuid>.edn
  ledgers/.pending-<event-uuid>       # not admitted; interrupted work only
  seeds/<document-id>.lock           # stable initialization lock inode
  snapshots/<document-id>/<source-hash>/
    metadata.edn                    # plain EDN metadata map
    document.md                     # selected revision's exact Markdown
    snapshot.edn                    # history, heads, provenance and hash
```

Clio creates and appends each unique pending partition while holding its own native
lock. A hard link publishes the fully appended inode under its final name without
replacing any existing ledger; the pending name is then removed. Readers ignore hidden
pending names. A killed operation before publication has not accepted that revision;
it can leave a pending file for operator inspection. No partial record is silently
accepted, and malformed finalized partitions fail closed.

Snapshot directories are assembled privately and published atomically at their content
address. Existing contents are verified against replay. An older projector finishing
last writes an older address and cannot change current authority. Snapshots can be
deleted and rebuilt from the ledger; schema history and finalized ledgers must remain.
A projection failure after ledger publication does not remove the accepted event.
This API promises completed appends/publication, not power-loss durability beyond the
filesystem and Clio's current implementation.

Only safe 1–100 character document IDs are accepted. Metadata must round-trip through
Clio's strict EDN reader and portable canonical data rules: plain maps, sets,
sequences, keywords, symbols, strings, booleans, nil, and supported finite numbers.
Host objects, functions, tagged records, and unsupported numeric values are refused.
Applications should enforce their own content-size and field-level policies.

Revision parents use Clio's UUID identity predicate directly, matching finalized
ledger admission. Accepted uppercase or mixed-case identity strings are preserved
exactly in history and causal references; document-history does not normalize them.

## Rheos and Knoxx ownership

Rheos already describes canonical lifecycle events and disposable EDN snapshots in
`docs/notes/design/rheos-ledger-authority-and-branch-projections.md`. Its current task
runtime still reads Markdown as authority, rewrites files before recording events, and
uses the older EventAdmission adapter. Its pure YAML task-edit helpers are not generic
EDN document history. This package supplies the reusable document responsibility
without moving CMS policy into Clio or importing the Rheos application into Knoxx.

Rheos's canonical task fold, Git/worldline visibility, and Markdown push/pull/sync
remain separately owned by its existing cards. This change does not claim those runtime
migrations are complete. Knoxx integrates this package for CMS revision persistence
while retaining organization authorization and its publication domain.

## Validation

```bash
pnpm --dir packages/document-history test
pnpm --dir packages/document-history lint
bb scripts/test.bb --only document-history
bb scripts/lint.bb --only document-history --kondo-only
```

The same real-filesystem suite runs in NBB and compiled ClojureScript. Shadow's automatic
post-compile execution is disabled; the script explicitly runs the resulting Node
bundle once. A deliberate failing-assertion probe verifies the script exits nonzero,
rather than trusting compiler output that can print failed tests and still exit zero. It starts two
independent writer processes, including equal timestamp siblings and concurrent
initial imports. It also verifies 1/10/100 partitions, duplicate records, explicit
resolution, immutable branch snapshots, deleted snapshots, stale projection writes,
invalid command refusal, imported UUID extension and resolution, interrupted unpublished files, initialization-lock interleavings,
symlink refusal before directory creation, and bounded worker startup failures. `.github/workflows/document-history-ci.yml`
runs the root-selected package gates on relevant PRs and main/staging changes.
