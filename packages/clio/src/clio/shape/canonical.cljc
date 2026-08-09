(ns clio.shape.canonical)

(declare canonical-form)

(defn- canonical-map
  [value]
  [:map
   (->> value
        (map (fn [[k v]] [(canonical-form k) (canonical-form v)]))
        (sort-by (comp pr-str first))
        vec)])

(defn- canonical-set
  [value]
  [:set
   (->> value
        (map canonical-form)
        (sort-by pr-str)
        vec)])

(defn canonical-form
  "Convert supported Clojure data into an explicitly typed, deterministically
   ordered form suitable for hashing. Foreign/runtime objects are rejected so a
   schema hash can never accidentally depend on a JS object's identity or print
   representation."
  [value]
  (cond
    (nil? value) [:nil]
    (boolean? value) [:boolean value]
    (string? value) [:string value]
    (keyword? value) [:keyword (namespace value) (name value)]
    (symbol? value) [:symbol (namespace value) (name value)]
    (number? value) [:number (str value)]
    (map? value) (canonical-map value)
    (set? value) (canonical-set value)
    (vector? value) [:vector (mapv canonical-form value)]
    (list? value) [:list (mapv canonical-form value)]
    (seq? value) [:seq (mapv canonical-form value)]
    :else
    (throw
     (ex-info "Unsupported value in canonical EDN"
              {:clio/error :clio.canonical/unsupported-value
               :value value
               :value-type (str (type value))}))))

(defn canonical-edn
  [value]
  (pr-str (canonical-form value)))
