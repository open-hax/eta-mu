(ns rheos.backend.law.frontmatter
  "Law: DESCRIBES which task frontmatter keys a client may mutate.

   This is a shape, not a morphism — pure data plus pure predicates, no I/O.
   `mutable-keys` is the closed set of safe, descriptive fields a board client
   is allowed to write through PATCH /api/task/:uuid/frontmatter.

   Deliberately EXCLUDED:
   - `:status` — must transition through the FSM via POST /api/task/:uuid/status.
   - `:write-id` — server-owned correlation token (see content-parser/inject-write-id).
   - `:source-path` / `:sourcePath` / `:source` — identity/location of the card.
   - `:uuid` — stable identity; never client-mutable.
   - `:created-at` / `:created_at` — provenance, set once at creation.

   Frontmatter keywordizes from YAML with its literal spelling (e.g. `:created_at`),
   so both snake_case and kebab-case spellings of the forbidden keys are listed."
  (:require [clojure.string :as str]))

(def mutable-keys
  "Closed set of frontmatter keys a client may write. Anything outside this set is
   rejected by [[disallowed-keys]]."
  #{:title :priority :labels :points :category :description :estimate :assignee})

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
