(ns clio.domain.schema
  (:require [clio.law.event :as event-law]
            [clio.shape.canonical :as canonical]
            [clio.shape.schema :as shape]
            [clojure.string :as str]
            [malli.core :as m]))

(defn- fail!
  [type message data]
  (throw (ex-info message (assoc data :clio/error type))))

(defn- empty-namespace-node
  [path]
  {:namespace/path path
   :namespace/schemas {}
   :namespace/children {}})

(defn- insert-schema
  [node path schema-name schema-form]
  (if (empty? path)
    (assoc-in node [:namespace/schemas schema-name] schema-form)
    (let [segment (first path)
          child-path (conj (:namespace/path node) segment)
          child (get-in node [:namespace/children segment]
                        (empty-namespace-node child-path))]
      (assoc-in node
                [:namespace/children segment]
                (insert-schema child (rest path) schema-name schema-form)))))

(defn catalog-tree
  "Build a namespace trie from a flat {qualified-schema-id -> Malli form}
   catalog. The trie is logical structure: source file boundaries never enter
   the hash."
  [catalog]
  (reduce-kv
   (fn [root schema-id schema-form]
     (when-not (and (keyword? schema-id) (namespace schema-id))
       (fail! :clio.schema/unqualified-id
              "Schema ids must be namespace-qualified keywords"
              {:schema/id schema-id}))
     (insert-schema root
                    (str/split (namespace schema-id) #"\.")
                    (name schema-id)
                    schema-form))
   (empty-namespace-node [])
   catalog))

(defn- schema-id
  [path schema-name]
  (keyword (str/join "." path) schema-name))

(declare merkleize-node)

(defn- merkleize-schemas
  [hash-fn path schemas]
  (into
   (sorted-map)
   (map (fn [[schema-name schema-form]]
          (let [id (schema-id path schema-name)
                hash (hash-fn
                      (canonical/canonical-edn
                       [:schema id schema-form]))]
            [schema-name
             {:schema/id id
              :schema/form schema-form
              :merkle/hash hash}])))
   schemas))

(defn- merkleize-children
  [hash-fn children]
  (into
   (sorted-map)
   (map (fn [[segment child]]
          [segment (merkleize-node hash-fn child)]))
   children))

(defn merkleize-node
  [hash-fn node]
  (let [path (:namespace/path node)
        schemas (merkleize-schemas hash-fn path (:namespace/schemas node))
        children (merkleize-children hash-fn (:namespace/children node))
        preimage
        [:namespace
         path
         (mapv (fn [[name schema]] [name (:merkle/hash schema)]) schemas)
         (mapv (fn [[segment child]] [segment (:merkle/hash child)]) children)]
        hash (hash-fn (canonical/canonical-edn preimage))]
    {:namespace/path path
     :namespace/schemas schemas
     :namespace/children children
     :merkle/hash hash}))

(defn- collect-schema-hashes
  [node]
  (let [local
        (into {}
              (map (fn [[_ schema]]
                     [(:schema/id schema) (:merkle/hash schema)]))
              (:namespace/schemas node))
        descendants
        (mapcat (comp seq collect-schema-hashes val)
                (:namespace/children node))]
    (into local descendants)))

(defn materialize
  "Derive an automatic schema revision. No manually maintained version number is
   involved: the root is a Merkle hash over namespace structure and schema data,
   while each schema also receives its own stable leaf hash."
  [hash-fn catalog]
  (let [tree (->> catalog catalog-tree (merkleize-node hash-fn))]
    {:schema/root (:merkle/hash tree)
     :schema/catalog catalog
     :schema/hashes (collect-schema-hashes tree)
     :schema/tree tree}))

(defn schema-ref
  [revision schema-id]
  (let [schema-hash (get-in revision [:schema/hashes schema-id])]
    (when-not schema-hash
      (fail! :clio.schema/unknown-schema
             "Schema id is not present in revision"
             {:schema/id schema-id
              :schema/root (:schema/root revision)}))
    {:schema/root (:schema/root revision)
     :schema/id schema-id
     :schema/hash schema-hash}))

(defn revision-index
  [revisions]
  (reduce
   (fn [index revision]
     (let [root (:schema/root revision)]
       (if-let [old (get index root)]
         (if (= (:schema/catalog old) (:schema/catalog revision))
           index
           (fail! :clio.schema/root-collision
                  "Same schema root describes different catalogs"
                  {:schema/root root}))
         (assoc index root revision))))
   {}
   revisions))

(defn compatible-revisions
  "Return every known revision in which schema-id has exactly schema-hash. This
   is what lets an unchanged event shape remain valid across unrelated catalog
   changes without a manual version bump."
  [revisions schema-id schema-hash]
  (->> revisions
       (filter #(= schema-hash (get-in % [:schema/hashes schema-id])))
       (sort-by :schema/root)
       vec))

(defn resolve-event-schema
  "Resolve an event through its recorded whole-catalog root, then report every
   other known catalog revision carrying the exact same schema leaf. An unknown
   root is refused even if its claimed leaf hash happens to be familiar: leaf
   compatibility is not a substitute for source-revision provenance."
  [revisions event]
  (let [{:schema/keys [root id hash]} (:event/schema event)
        by-root (revision-index revisions)
        revision (get by-root root)]
    (when-not revision
      (fail! :clio.schema/unknown-revision
             "Event references a schema revision that is not available"
             {:schema/root root :schema/id id :schema/hash hash}))
    (let [known-hash (get-in revision [:schema/hashes id])]
      (when-not known-hash
        (fail! :clio.schema/unknown-schema
               "Event references a schema absent from its catalog revision"
               {:schema/root root :schema/id id}))
      (when-not (= hash known-hash)
        (fail! :clio.schema/hash-mismatch
               "Event schema leaf hash does not match its catalog revision"
               {:schema/root root
                :schema/id id
                :event/schema-hash hash
                :known/schema-hash known-hash}))
      {:revision revision
       :compatible/revisions (compatible-revisions revisions id hash)
       :schema/id id
       :schema/form (get-in revision [:schema/catalog id])})))

(defn validate-event!
  "Validate the bootstrap, semantic identity laws, then the exact historical
   Malli event schema selected by content-derived schema metadata."
  [revisions event]
  (when-not (m/validate shape/bootstrap-schema event)
    (fail! :clio.schema/invalid-bootstrap
           "Event does not contain a readable schema bootstrap"
           {:explain (m/explain shape/bootstrap-schema event)
            :event event}))
  (when-not (event-law/event-identity-valid? event)
    (fail! :clio.schema/invalid-identity
           "Event identity, stream sequence, or causal ids are invalid"
           {:event event}))
  (let [resolved (resolve-event-schema revisions event)
        schema-id (:schema/id resolved)
        schema-form (:schema/form resolved)]
    (when-not (= schema-id (:event/type event))
      (fail! :clio.schema/type-mismatch
             "Event type must equal its schema id"
             {:event/type (:event/type event)
              :schema/id schema-id}))
    (when-not (m/validate schema-form event)
      (fail! :clio.schema/invalid-event
             "Event does not match its historical Malli schema"
             {:schema/id schema-id
              :explain (m/explain schema-form event)
              :event event})))
  event)
