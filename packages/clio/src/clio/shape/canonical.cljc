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

(defn- finite?
  "##Inf/##-Inf are portable reader literals recognized by both Clojure and
   ClojureScript, so this needs no runtime-specific interop and stays inside
   shape.*'s host-free boundary."
  [value]
  (and (= value value) ; excludes NaN, which is never equal to itself
       (not= value ##Inf)
       (not= value ##-Inf)))

(defn- canonical-number
  [value]
  (cond
    (and (integer? value)
         (<= (- max-safe-integer) value max-safe-integer))
    [:number :safe-integer (str value)]

    (and (not (integer? value)) (finite? value))
    ;; A committed event's payload may legitimately contain non-integer data
    ;; (a schema can declare :double); the decimal string of a finite double
    ;; is the same value on both runtimes for ordinary literals. NaN/Infinity
    ;; have no portable decimal form and stay rejected, as do unsafe integers,
    ;; which is the narrower restriction schema-identity hashing depends on.
    [:number :real (str value)]

    :else
    (throw
     (ex-info
      "Only cross-runtime-safe integers and finite real numbers are portable; encode other numeric metadata as an explicit string"
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
