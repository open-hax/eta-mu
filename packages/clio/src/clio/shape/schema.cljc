(ns clio.shape.schema)

(def uuid-string-schema
  [:string {:min 36 :max 36}])

(def hash-schema
  [:string {:min 64 :max 64}])

(def schema-ref-schema
  [:map {:closed true}
   [:schema/root hash-schema]
   [:schema/id :keyword]
   [:schema/hash hash-schema]])

(def bootstrap-schema
  "The deliberately small, fixed protocol foothold needed to discover the
   historical event schema. It is not itself an event schema and therefore does
   not belong to the addressable Merkle catalog. Complete event-envelope changes
   are versioned because event-schema emits the envelope into every catalog leaf."
  [:map
   [:event/id uuid-string-schema]
   [:event/schema schema-ref-schema]
   [:event/type :keyword]])

(defn event-schema
  "Construct a complete event schema for an event type. The returned value is
   plain Clojure data, so it can itself be canonically hashed and stored."
  [event-type data-schema]
  [:map {:closed true}
   [:event/id uuid-string-schema]
   [:event/schema schema-ref-schema]
   [:event/type [:= event-type]]
   [:event/stream [:string {:min 1}]]
   [:event/seq [:int {:min 1}]]
   [:event/causes [:vector uuid-string-schema]]
   [:event/actor [:string {:min 1}]]
   [:event/subject [:string {:min 1}]]
   [:event/at [:string {:min 1}]]
   [:event/data data-schema]])

(defn merge-catalogs
  [& catalogs]
  (reduce
   (fn [acc catalog]
     (reduce-kv
      (fn [acc schema-id schema-form]
        (if-let [old (get acc schema-id)]
          (if (= old schema-form)
            acc
            (throw
             (ex-info "Conflicting definitions for schema id"
                      {:clio/error :clio.schema/conflicting-definition
                       :schema/id schema-id
                       :first old
                       :second schema-form})))
          (assoc acc schema-id schema-form)))
      acc
      catalog))
   {}
   catalogs))
