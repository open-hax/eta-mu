(ns clio.shape.canonical)

(declare canonical-form)

(def ^:private max-safe-integer 9007199254740991)
(def ^:private two52 4503599627370496)
(def ^:private two53 9007199254740992)

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

(defn- non-portable!
  [value]
  (throw
   (ex-info
    "Only cross-runtime-safe integers and exactly representable finite real numbers are portable; encode other numeric metadata as an explicit string"
    {:clio/error :clio.canonical/non-portable-number
     :value value})))

(defn- integer-digits
  "Decimal digits of an integer-valued number, computed arithmetically
   (quot/mod, one digit at a time) so host printing never decides the form:
   JVM str of an integer-valued Double carries a trailing .0 and switches to
   exponent notation (1e20 -> \"1.0E20\"), JavaScript's does neither. Used
   wherever an integer-valued floating number must produce the same string
   its ClojureScript twin (for which integer? already holds) produces via
   str."
  [n]
  (let [negative? (neg? n)
        magnitude (if negative? (- n) n)]
    (str
     (when negative? "-")
     (if (zero? magnitude)
       "0"
       (loop [n magnitude digits '()]
         (if (zero? n)
           (apply str digits)
           (recur (quot n 10) (conj digits (str (int (mod n 10)))))))))))

(defn- integer-valued?
  "Whether a non-integer-typed number carries a zero fractional part, i.e.
   denotes an integer on both runtimes. ClojureScript folds this into
   integer? itself; the JVM needs the arithmetic check so a Double read from
   the same EDN text hashes identically to its ClojureScript twin."
  [value]
  (zero? (mod value 1)))

(defn- exact-double-coercion?
  "ClojureScript numbers already are IEEE-754 doubles. On the JVM, ratios,
   BigDecimals, and other exact numeric types may lose information when
   coerced to double. Accept them only when the shared double is exactly the
   same numeric value; this rejects overflow, underflow, and rounding aliases
   before they can collapse distinct values onto one canonical identity."
  [_value _d]
  #?(:clj (and (finite? _d) (== _value _d))
     :cljs true))

(defn- real-decomposition
  "Sign, mantissa, and binary exponent of a finite nonzero double, as
   value = sign x mantissa x 2^exponent with mantissa an integer in
   [2^52, 2^53). Halving and doubling are exact in IEEE 754 arithmetic, so
   the normalization loop loses no precision and both runtimes compute the
   same triple for the same value without any host printing involved."
  [d]
  (let [negative? (< d 0)
        m (if negative? (- d) d)]
    (loop [m m e 0]
      (cond
        (>= m two53) (recur (/ m 2) (inc e))
        (< m two52) (recur (* m 2) (dec e))
        :else {:sign (if negative? -1 1) :mantissa m :exponent e}))))

(defn- canonical-real
  "Encode a finite, non-integer-valued number by its exact IEEE 754
   decomposition rather than its decimal string, because the decimal string
   is host-decided: JVM renders 1e-7 as \"1.0E-7\" where JavaScript renders
   \"1e-7\". JVM-only exact numeric types are admitted only when their double
   coercion is exact; otherwise two distinct exact values could hash as the
   same JavaScript number. -0.0 canonicalizes to +0.0 because (= -0.0 0.0)
   holds on both runtimes and zero has no decomposition."
  [value]
  (let [d (double value)]
    (when-not (exact-double-coercion? value d)
      (non-portable! value))
    (if (zero? d)
      [:number :real 1 "0" 0]
      (let [{:keys [sign mantissa exponent]} (real-decomposition d)]
        [:number :real sign (integer-digits mantissa) exponent]))))

(defn- canonical-number
  [value]
  (cond
    (and (integer? value)
         (<= (- max-safe-integer) value max-safe-integer))
    [:number :safe-integer (str value)]

    ;; An integer? beyond the safe range is exact-integer data a double
    ;; coercion would silently corrupt (JVM BigInteger 2^53+1; on
    ;; ClojureScript an integer-valued double like 1e20, which the JVM reads
    ;; as a Double and rejects a few clauses down — both runtimes refuse).
    (integer? value)
    (non-portable! value)

    ;; NaN/Infinity have no portable form and stay rejected.
    (not (finite? value))
    (non-portable! value)

    ;; A floating/decimal number with a zero fractional part denotes an
    ;; integer; ClojureScript's integer? already routed its twin to the
    ;; safe-integer branch, so this must encode identically. JVM Double 1e20
    ;; lands here beyond the safe range and is refused, matching
    ;; ClojureScript's integer? refusal above.
    (integer-valued? value)
    (if (<= (- max-safe-integer) value max-safe-integer)
      [:number :safe-integer (integer-digits value)]
      (non-portable! value))

    ;; A committed event's payload may legitimately contain non-integer data
    ;; (a schema can declare :double). Plain doubles are the shared floating
    ;; representation. JVM ratios/BigDecimals are accepted only when their
    ;; conversion to that shared representation is exact.
    :else
    (canonical-real value)))

(defn canonical-form
  "Convert supported Clojure data into a deterministically ordered semantic
   form suitable for cross-runtime hashing. Equal sequential collections share
   one representation. Numbers are encoded so the same EDN text hashes
   identically on both runtimes: safe integers by their digits, finite reals
   by exact IEEE 754 decomposition; unsafe integers, lossy JVM-only numeric
   values, and NaN/Infinity are rejected rather than being assigned ambiguous
   cross-runtime identities."
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