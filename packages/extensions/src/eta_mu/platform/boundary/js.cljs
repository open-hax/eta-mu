(ns eta-mu.platform.boundary.js
  "Primitive JavaScript / ημ boundary conversions.

  This namespace is the only place in the platform layer that may use
  `js->clj`, `clj->js`, `#js`, `aset`, `aget`, and raw JS predicates without
  naming a specific contract. Every decoder/encoder pair is named and tested.
  Domain and infrastructure code must call these functions rather than using
  raw interop.

  The wire policy these functions implement lives in `eta-mu.platform.law`.")

(defn js-obj?
  "Return true if `x` is a plain JS object (not an array or function)."
  [x]
  (and (object? x) (not (array? x)) (not (fn? x))))

(defn- js-array? [x]
  (array? x))

(defn decode-keyword
  "Decode a string to a keyword. Passes keywords through. Rejects non-string
  values with a clear error."
  [x]
  (cond
    (keyword? x) x
    (string? x)  (keyword x)
    (nil? x)     nil
    :else        (throw (ex-info "Cannot decode keyword"
                                 {:value x :type (type x)}))))

(defn encode-keyword
  "Encode a keyword as a string. Passes strings through."
  [x]
  (cond
    (keyword? x)
    (if-let [ns (namespace x)]
      (str ns "/" (name x))
      (name x))

    (string? x) x
    (nil? x) nil
    :else (throw (ex-info "Cannot encode keyword"
                          {:value x :type (type x)}))))

(defn decode-uuid
  "Decode a string to a UUID."
  [x]
  (cond
    (uuid? x)   x
    (string? x) (uuid x)
    (nil? x)    nil
    :else       (throw (ex-info "Cannot decode UUID"
                                {:value x :type (type x)}))))

(defn encode-uuid
  "Encode a UUID as a canonical string."
  [x]
  (cond
    (uuid? x)   (str x)
    (string? x) x
    (nil? x)    nil
    :else       (throw (ex-info "Cannot encode UUID"
                                {:value x :type (type x)}))))

(defn decode-instant
  "Decode a string to an instant (JS Date)."
  [x]
  (cond
    (inst? x)   x
    (string? x) (js/Date. x)
    (number? x) (js/Date. x)
    (nil? x)    nil
    :else       (throw (ex-info "Cannot decode instant"
                                {:value x :type (type x)}))))

(defn encode-instant
  "Encode an instant as an RFC 3339 / ISO 8601 string."
  [x]
  (cond
    (inst? x)   (.toISOString x)
    (string? x) x
    (nil? x)    nil
    :else       (throw (ex-info "Cannot encode instant"
                                {:value x :type (type x)}))))

(defn decode-vector
  "Decode a JS array into a vector, applying `decode-item` to each element."
  [decode-item xs]
  (when-not (nil? xs)
    (if (js-array? xs)
      (mapv decode-item xs)
      (throw (ex-info "Cannot decode vector: value is not an array"
                      {:value xs :type (type xs)})))))

(defn encode-vector
  "Encode a vector into a JS array, applying `encode-item` to each element."
  [encode-item xs]
  (when-not (nil? xs)
    (if (vector? xs)
      (into-array (map encode-item xs))
      (throw (ex-info "Cannot encode vector: value is not a vector"
                      {:value xs :type (type xs)})))))

(defn decode-set
  "Decode a JS array into a set, applying `decode-item` to each element."
  [decode-item xs]
  (when-not (nil? xs)
    (if (js-array? xs)
      (set (map decode-item xs))
      (throw (ex-info "Cannot decode set: value is not an array"
                      {:value xs :type (type xs)})))))

(defn encode-set
  "Encode a set into a JS array, applying `encode-item` to each element."
  [encode-item xs]
  (when-not (nil? xs)
    (if (set? xs)
      (into-array (map encode-item xs))
      (throw (ex-info "Cannot encode set: value is not a set"
                      {:value xs :type (type xs)})))))

(defn decode-map
  "Decode a JS object into a Clojure map with keyword keys, applying
  `decode-value` to each value. Nested JS arrays are left as JS arrays so that
  the per-value decoder can decide their shape."
  [decode-value x]
  (when-not (nil? x)
    (if (js-obj? x)
      (let [keys (js/Object.keys x)]
        (into {} (map (fn [k]
                          [(decode-keyword k)
                           (decode-value (aget x k))])
                        keys)))
      (throw (ex-info "Cannot decode map: value is not a JS object"
                      {:value x :type (type x)})))))

(defn encode-map
  "Encode a Clojure map into a JS object, applying `encode-value` to each value."
  [encode-value x]
  (when-not (nil? x)
    (if (map? x)
      (let [obj (js-obj)]
        (doseq [[k v] x]
          (aset obj (encode-keyword k) (encode-value v)))
        obj)
      (throw (ex-info "Cannot encode map: value is not a map"
                      {:value x :type (type x)})))))

(defn- scalar-type
  "Classify a value as an ημ scalar type keyword."
  [x]
  (cond
    (nil? x)      :nil
    (string? x)   :string
    (number? x)   :number
    (boolean? x)  :boolean
    (keyword? x)  :keyword
    (uuid? x)     :uuid
    (inst? x)     :instant
    (vector? x)   :vector
    (set? x)      :set
    (map? x)      :map
    (js-array? x) :vector
    (js-obj? x)   :map
    :else         :unknown))

(defn decode
  "Universal, lossy decode from JS/JSON-ish values to ημ values.

  This is convenient for tests and small scripts. Production boundaries should
  use the named decoders above and a declared schema."
  [x]
  (case (scalar-type x)
    :nil     nil
    :string  x
    :number  x
    :boolean x
    :keyword (decode-keyword x)
    :uuid    (decode-uuid x)
    :instant (decode-instant x)
    :vector  (decode-vector decode x)
    :set     (decode-set decode x)
    :map     (decode-map decode x)
    x))

(defn encode
  "Universal, lossy encode from ημ values to JS/JSON-ish values.

  Production boundaries should use the named encoders above and a declared schema."
  [x]
  (case (scalar-type x)
    :nil     nil
    :string  x
    :number  x
    :boolean x
    :keyword (encode-keyword x)
    :uuid    (encode-uuid x)
    :instant (encode-instant x)
    :vector  (encode-vector encode x)
    :set     (encode-set encode x)
    :map     (encode-map encode x)
    x))
