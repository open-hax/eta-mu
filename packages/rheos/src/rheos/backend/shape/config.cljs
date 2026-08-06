(ns rheos.backend.shape.config
  "Decode a board config file's bytes into one Clojure shape.

   Two formats reach the board — EDN, which is canonical, and the deprecated
   JSON — and they disagree about how a key is spelled: `tasksDir` in JSON,
   `:tasks-dir` in EDN. Rather than teach every reader both spellings, both are
   normalized here, once, so everything downstream reads kebab-case only.

   This is pure shape: format dispatch and a recursive key morphism, no
   filesystem. Finding the file and reading it belongs to
   [[rheos.backend.infra.config]]."
  (:require [cljs.reader :as reader]
            [clojure.string :as str]))

(def default-config-names
  "Config file names, in discovery precedence. EDN is preferred; JSON still
   loads and warns."
  ["openhax.kanban.edn" "kanban.edn"
   "openhax.kanban.json" "kanban.json"])

(defn normalize-key [k]
  (if (or (keyword? k) (string? k))
    (-> (name k)
        (str/replace #"([a-z0-9])([A-Z])" "$1-$2")
        str/lower-case
        keyword)
    k))

(defn normalize-config
  "Normalize EDN and legacy JSON config into one kebab-case Clojure shape."
  [value]
  (cond
    (map? value)
    (into {} (map (fn [[k v]] [(normalize-key k) (normalize-config v)]) value))

    (vector? value)
    (mapv normalize-config value)

    (sequential? value)
    (mapv normalize-config value)

    :else value))

(defn config-format [config-path]
  (let [lower (str/lower-case (str config-path))]
    (cond
      (str/ends-with? lower ".edn") :edn
      (str/ends-with? lower ".json") :json
      :else :unknown)))

(defn parse-config-content
  "Parse one config file by extension and return the normalized config map."
  [config-path raw]
  (normalize-config
   (case (config-format config-path)
     :edn (reader/read-string raw)
     :json (js->clj (js/JSON.parse raw) :keywordize-keys true)
     (throw (ex-info (str "Unsupported Rheos config format: " config-path)
                     {:config-path config-path})))))
