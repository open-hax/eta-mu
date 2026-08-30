(ns rheos.backend.law.frontmatter
  "Law: DESCRIBES which task frontmatter keys a client may mutate.

   This is a shape, not a morphism — pure data plus pure predicates, no I/O.
   `mutable-keys` is the closed set of safe fields a board client is allowed to
   write through PATCH /api/task/:uuid/frontmatter.

   Deliberately EXCLUDED:
   - `:status` — must transition through the FSM via POST /api/task/:uuid/status.
   - `:write-id` — server-owned correlation token (see content-parser/inject-write-id).
   - `:source-path` / `:sourcePath` / `:source` — identity/location of the card.
   - `:uuid` — stable identity; never client-mutable.
   - `:created-at` / `:created_at` — provenance, set once at creation.

   Frontmatter keywordizes from YAML with its literal spelling (e.g. `:created_at`),
   so both snake_case and kebab-case spellings of the forbidden keys are listed."
  (:require [clojure.string :as str]))

(def descriptive-keys
  "Existing descriptive frontmatter accepted by the update endpoint."
  #{:title :priority :labels :points :category :description :estimate :assignee})

(def planning-keys
  "The metadata Issue #234 will lock with the card body after breakdown. This
   patch only makes dependency newly writable; the shared future guard can
   consume the complete planning set without reconstructing it from endpoints."
  #{:title :priority :labels :points :parent :dependency})

(def card-id-pattern
  "Line-safe card identifier grammar. Dependency values are serialized inside
   quoted inline arrays, so accepting quotes or line breaks would let an
   otherwise valid update alter the surrounding frontmatter syntax."
  #"^[a-zA-Z0-9][a-zA-Z0-9._-]*$")

(def mutable-keys
  "Closed set of frontmatter keys a client may write. Anything outside this set is
   rejected by [[disallowed-keys]]."
  (conj descriptive-keys :dependency))

(def status-key
  "The FSM-governed key. Routed to its own endpoint, never accepted here."
  :status)

(def forbidden-keys
  "Identity/correlation/provenance keys that are never client-mutable. Listed in
   both snake_case and kebab-case because frontmatter keywordizes verbatim."
  #{:status :write-id :write_id
    :source-path :sourcePath :source
    :uuid
    :created-at :created_at})

(defn mutable-key?
  "True when `k` (a keyword) names a client-mutable frontmatter field."
  [k]
  (contains? mutable-keys k))

(defn status-update?
  "True when `updates` attempts to set the FSM-governed `:status`."
  [updates]
  (contains? updates status-key))

(defn disallowed-keys
  "The seq of keys in `updates` that are NOT client-mutable (status excluded —
   callers reject that with a dedicated FSM message). Empty when the update is clean."
  [updates]
  (vec (remove #(or (mutable-key? %) (= status-key %)) (keys updates))))

(defn disallowed-keys-message
  "Human-readable rejection string naming the offending keys."
  [ks]
  (str "frontmatter keys not allowed: " (str/join ", " (map name ks))))

(defn planning-value-errors
  "Describe malformed planning metadata in `updates`. Dependency is always a
   vector of line-safe card ids; an empty vector is the explicit clear operation."
  [updates]
  (cond-> []
    (and (contains? updates :dependency)
         (not (and (vector? (:dependency updates))
                   (every? #(and (string? %)
                                 (re-matches card-id-pattern %))
                           (:dependency updates)))))
    (conj {:key :dependency
           :message (str "dependency must be a vector of card ids using only "
                         "letters, digits, '.', '_' or '-' (use [] to clear)")})))

(defn planning-value-errors-message [errors]
  (str/join "; " (map :message errors)))
