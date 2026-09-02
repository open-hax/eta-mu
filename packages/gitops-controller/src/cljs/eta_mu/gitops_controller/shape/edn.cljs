(ns eta-mu.gitops-controller.shape.edn
  "Strict, deterministic EDN records for durable controller evidence."
  (:require [edamame.core :as edamame]))

(def ^:private edn-only-options
  ;; edamame otherwise accepts Clojure reader extensions that are not EDN.
  {:all false})

(defn- canonical-compare [left right]
  (compare (pr-str left) (pr-str right)))

(defn- canonicalize [value]
  (cond
    (map? value)
    (into (sorted-map-by canonical-compare)
          (map (fn [[key nested]]
                 [(canonicalize key) (canonicalize nested)]))
          value)

    (set? value)
    (into (sorted-set-by canonical-compare) (map canonicalize) value)

    (vector? value)
    (mapv canonicalize value)

    (list? value)
    (apply list (map canonicalize value))

    (sequential? value)
    (doall (map canonicalize value))

    :else value))

(defn encode
  "Encode plain data as one deterministic EDN form without a terminator."
  [value]
  (let [encoded (pr-str (canonicalize value))]
    (when (or (.includes encoded "\n") (.includes encoded "\r"))
      (throw (ex-info "EDN record must occupy exactly one physical line"
                      {:error/code :invalid-edn-record})))
    encoded))

(defn read-one
  "Read exactly one EDN form and require true end-of-input."
  [text]
  (let [forms
        (try
          (edamame/parse-string-all text edn-only-options)
          (catch :default cause
            (throw (ex-info "Expected exactly one EDN form"
                            {:error/code :invalid-edn-record
                             :cause (str cause)}))))]
    (when-not (= 1 (count forms))
      (throw (ex-info "Expected exactly one EDN form"
                      {:error/code :invalid-edn-record
                       :form-count (count forms)})))
    (first forms)))
