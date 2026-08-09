(ns clio.shape.canonical)

(declare canonical-form)

(def ^:private max-safe-integer 9007199254740991)

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

(defn- canonical-number
  [value]
  (if (and (integer? value)
           (<= (- max-safe-integer) value max-safe-integer))
    [:number :safe-integer (str value)]
    (throw
     (ex-info
      "Schema identity only permits cross-runtime-safe integer numbers; encode other numeric metadata as an explicit string"
      {:clio/error :clio.canonical/non-portable-number
       :value value}))))

(defn canonical-form
  "Convert supported Clojure data into a deterministically ordered semantic
   form suitable for cross-runtime hashing. Equal sequential collections share
   one representation. Non-integer or unsafe numeric metadata is rejected rather
   than hashing differently in Clojure and ClojureScript."
  [value]
  (cond
    (nil? value) [:nil]
    (boolean? value) [:boolean value]
    (string? value) [:string value]
    (keyword? value) [:keyword (namespace value) (name value)]
    (symbol? value) [:symbol (namespace value) (name value)]
    (number? value) (canonical-number value)
    (map? value) (canonical-map value)
    (set? value) (canonical-set value)
    (sequential? value) [:sequential (mapv canonical-form value)]
    :else
    (throw
     (ex-info "Unsupported value in canonical EDN"
              {:clio/error :clio.canonical/unsupported-value
               :value value
               :value-type (str (type value))}))))

(defn canonical-edn
  [value]
  (pr-str (canonical-form value)))
