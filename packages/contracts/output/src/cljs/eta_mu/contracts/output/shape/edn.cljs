(ns eta-mu.contracts.output.shape.edn
  "EDN contract reader and compiler.

   We do not need a custom EDN parser in ClojureScript; we use the native
   `clojure.edn` reader and then normalize the resulting s-expression into the
   shape described by `eta-mu.contracts.output.law.contract`.

   This namespace is therefore a *shape* morphism: EDN string → normalized
   contract map."
  (:require [clojure.edn :as edn]))

(defn- ->id
  "Accept a keyword or string and return its full string id, including any
   keyword namespace."
  [value label]
  (cond
    (keyword? value) (subs (str value) 1)
    (string? value) value
    :else (throw (ex-info (str label " must be a keyword or string")
                          {:value value :label label}))))

(defn- ->string
  [value label]
  (if (string? value)
    value
    (throw (ex-info (str label " must be a string")
                    {:value value :label label}))))

(defn- ->boolean
  ([value label] (->boolean value label false))
  ([value label fallback]
   (cond
     (nil? value) fallback
     (boolean? value) value
     :else (throw (ex-info (str label " must be a boolean")
                           {:value value :label label})))))

(defn- ->int
  ([value label] (->int value label nil))
  ([value label fallback]
   (cond
     (nil? value)
     (if (some? fallback)
       fallback
       (throw (ex-info (str label " is required") {:value value :label label})))
     (int? value) value
     :else (throw (ex-info (str label " must be an integer")
                           {:value value :label label})))))

(defn- ->double
  ([value label] (->double value label nil))
  ([value label fallback]
   (cond
     (nil? value)
     (if (some? fallback)
       fallback
       (throw (ex-info (str label " is required") {:value value :label label})))
     (number? value) (double value)
     :else (throw (ex-info (str label " must be a number")
                           {:value value :label label})))))

(defn- ->keyword
  [value label]
  (if (keyword? value)
    value
    (throw (ex-info (str label " must be a keyword")
                    {:value value :label label}))))

(defn- ->vec
  "Coerce nil to empty vector, otherwise leave vectors/lists as vectors."
  [value]
  (cond
    (nil? value) []
    (vector? value) value
    (seq? value) (vec value)
    :else (throw (ex-info "Expected vector or list" {:value value}))))

(defn- children
  "Return the child forms of a list form, skipping the head."
  [form]
  (rest form))

(defn- find-child
  "Find the immediate child form whose head equals `head`."
  [form head]
  (first (filter #(= (first %) head) (children form))))

(defn- require-child
  [form head]
  (or (find-child form head)
      (throw (ex-info (str "Missing required form (" head " ...)") {:form form :head head}))))

(defn- parse-string-vector
  "Parse a vector of keyword/string values into a vector of strings."
  [value label]
  (->> (->vec value)
       (mapv #(->id % label))))

(defn- parse-section
  [form]
  {:id (->id (second (require-child form 'id)) "section id")
   :heading (->string (second (require-child form 'heading)) "section heading")
   :required (->boolean (second (find-child form 'required)) "section required" false)
   :order (->int (second (find-child form 'order)) "section order")
   :cardinality (->keyword (second (find-child form 'cardinality)) "section cardinality")
   :allowed-node-types (parse-string-vector (second (find-child form 'allowed-node-types))
                                            "section allowed-node-types")
   :local-rule-ids (parse-string-vector (second (find-child form 'local-rules))
                                        "section local-rules")})

(defn- parse-rule
  [form]
  (merge
   {:id (->id (second (require-child form 'id)) "rule id")
    :kind (->id (second (find-child form 'kind)) "rule kind")
    :check (->id (second (find-child form 'check)) "rule check")}
   (when-let [section (second (find-child form 'section))]
     {:section-id (->id section "rule section")})
   (when-let [min-value (second (find-child form 'min))]
     {:min (->int min-value "rule min")})
   (when-let [max-value (second (find-child form 'max))]
     {:max (->int max-value "rule max")})
   (when-let [exactly (second (find-child form 'exactly))]
     {:exactly (->int exactly "rule exactly")})))

(defn- parse-repair-template
  [form]
  {:id (->id (second (require-child form 'id)) "repair template id")
   :when-rule-id (->id (second (require-child form 'when)) "repair template rule id")
   :text (->string (second (require-child form 'text)) "repair template text")})

(defn- parse-criterion
  [form]
  {:id (->id (second (require-child form 'id)) "criterion id")
   :weight (->double (second (require-child form 'weight)) "criterion weight")})

(defn- to-record
  "Index a sequence of maps by their `:id` value."
  [items]
  (reduce (fn [acc item] (assoc acc (:id item) item)) {} items))

(defn- group-templates
  [templates]
  (reduce (fn [acc template]
              (update acc (:when-rule-id template) (fnil conj []) template))
          {}
          templates))

(defn- lists->vectors
  "Recursively convert seqs to vectors for a normalized, immutable contract shape."
  [form]
  (cond
    (seq? form) (vec (map lists->vectors form))
    (vector? form) (vec (map lists->vectors form))
    :else form))

(defn- key-string
  "Restore a JSON keywordized key to its original string form, including any
   namespace."
  [k]
  (cond
    (keyword? k) (if (namespace k)
                   (str (namespace k) "/" (name k))
                   (name k))
    :else (str k)))

(defn- keywordize-key
  [k]
  (if (keyword? k) k (keyword k)))

(defn- keywordize-keys
  "Convert all map keys to keywords."
  [m]
  (when (map? m)
    (reduce-kv (fn [acc k v]
                 (assoc acc (keywordize-key k) v))
               {}
               m)))

(defn- coerce-section
  [section]
  (-> (keywordize-keys section)
      (update :cardinality keyword)
      (update :allowed-node-types #(mapv str %))
      (update :local-rule-ids #(mapv str %))))

(defn- coerce-rule
  [rule]
  (let [r (keywordize-keys rule)]
    (cond-> r
      (:section-id r) (update :section-id str)
      (:min r) (update :min int)
      (:max r) (update :max int)
      (:exactly r) (update :exactly int)
      true (update :kind str)
      true (update :check str)
      true (update :id str))))

(defn- coerce-repair-template
  [template]
  (-> (keywordize-keys template)
      (update :id str)
      (update :when-rule-id str)
      (update :text str)))

(defn- coerce-criterion
  [criterion]
  (-> (keywordize-keys criterion)
      (update :id str)
      (update :weight double)))

(defn- coerce-review
  [review]
  (let [r (keywordize-keys review)]
    (cond-> r
      (:reviewer-family r) (update :reviewer-family str)
      true (update :criteria #(mapv coerce-criterion %)))))

(defn- coerce-arbitration
  [arbitration]
  (mapv #(cond
           (string? %) %
           (vector? %) (coerce-arbitration %)
           (keyword? %) %
           :else (str %))
        arbitration))

(defn- coerce-indexed-map
  [coerce-value m]
  (reduce-kv (fn [acc k v]
               (assoc acc (key-string k) (coerce-value v)))
             {}
             m))

(defn coerce-json-contract
  "Coerce a contract map decoded from JSON back into the normalized CLJS shape
   expected by `law.contract/normalized-contract-schema`. JSON turns keywords
   into strings, so we restore the structure and enum keywords."
  [contract]
  (let [c (keywordize-keys contract)]
    (-> c
        (update :sections #(mapv coerce-section %))
        (update :sections-by-id #(coerce-indexed-map coerce-section %))
        (update :sections-by-heading #(coerce-indexed-map coerce-section %))
        (update :rules #(mapv coerce-rule %))
        (update :rules-by-id #(coerce-indexed-map coerce-rule %))
        (update :repair-templates #(mapv coerce-repair-template %))
        (update :repair-templates-by-rule-id #(coerce-indexed-map (partial mapv coerce-repair-template) %))
        (update :review coerce-review)
        (update :arbitration coerce-arbitration))))


(defn parse-edn-form
  "Read an EDN string into a Clojure data structure."
  [source]
  (edn/read-string source))

(defn compile-agent-output-contract
  "Compile an EDN `(agent-output-contract ...)` form into a normalized contract
   map matching `eta-mu.contracts.output.law.contract/normalized-contract-schema`."
  [source]
  (let [form (parse-edn-form source)]
    (when-not (and (seq? form) (= (first form) 'agent-output-contract))
      (throw (ex-info "Contract root must be an (agent-output-contract ...) form"
                      {:form form})))

    (let [structure (require-child form 'structure)
          rules-form (require-child form 'rules)
          repair-form (require-child form 'repair)
          review-form (require-child form 'review)
          arbitration-form (require-child form 'arbitration)
          sections (->> (children structure)
                        (filter #(= (first %) 'section))
                        (map parse-section)
                        (sort-by :order)
                        vec)
          sections-by-id (to-record sections)
          sections-by-heading (reduce #(assoc %1 (:heading %2) %2) {} sections)
          rules (->> (children rules-form)
                     (filter #(= (first %) 'rule))
                     (map parse-rule)
                     vec)
          rules-by-id (to-record rules)
          repair-templates (->> (children repair-form)
                                (filter #(= (first %) 'template))
                                (map parse-repair-template)
                                vec)
          repair-templates-by-rule-id (group-templates repair-templates)
          criteria (->> (children (require-child review-form 'criteria))
                        (filter #(= (first %) 'criterion))
                        (map parse-criterion)
                        vec)
          review (cond-> {:enabled (->boolean (second (find-child review-form 'enabled))
                                       "review enabled" true)
                            :threshold (->double (second (find-child review-form 'threshold))
                                       "review threshold" 0.8)
                            :criteria criteria}
                     (find-child review-form 'reviewer-family)
                     (assoc :reviewer-family (->id (second (find-child review-form 'reviewer-family))
                                                      "reviewer family")))
          target (require-child form 'target)]

      {:name (->string (second (require-child form 'name)) "contract name")
       :version (->string (second (require-child form 'v)) "contract version")
       :target-format (->id (second (require-child target 'format)) "target format")
       :target-ast (->id (second (require-child target 'ast)) "target ast")
       :target-root (->id (second (require-child target 'root)) "target root")
       :repair-max-retries (->int (second (find-child repair-form 'max-retries))
                                  "repair max-retries" 0)
       :sections sections
       :sections-by-id sections-by-id
       :sections-by-heading sections-by-heading
       :rules rules
       :rules-by-id rules-by-id
       :repair-templates repair-templates
       :repair-templates-by-rule-id repair-templates-by-rule-id
       :review review
       :arbitration (lists->vectors (vec (children arbitration-form)))})))
