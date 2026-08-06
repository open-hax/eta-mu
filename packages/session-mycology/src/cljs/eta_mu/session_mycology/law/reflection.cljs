(ns eta-mu.session-mycology.law.reflection
  "Authoritative schema facts and admissibility law for session reflections."
  (:require [clojure.string :as str]
            [malli.core :as m]))

(def package-name "@eta-mu/session-mycology")
(def package-version "0.1.0")
(def reflection-recorded-schema
  :eta-mu.session-mycology/reflection-recorded)
(def reflection-recorded-version 1)

(def reflection-payload
  [:map
   [:repo :string]
   [:lesson [:and :string
             [:fn {:error/message "lesson must not be blank"}
              (complement str/blank?)]]]
   [:session/id {:optional true} :string]
   [:task/id {:optional true} :string]
   [:receipt/refs {:optional true} [:vector :string]]])

(def reflection-recorded-document
  {:schema/id reflection-recorded-schema
   :schema/version reflection-recorded-version
   :schema/status :current
   :schema/introduced-by
   {:package/version package-version
    :eta-mu/version "1.1.1"}
   :schema/predecessors []
   :schema/required [:repo :lesson]
   :schema/optional [:session/id :task/id :receipt/refs]
   :schema/semantics
   {:lesson "A session-specific retrospective or reusable lesson."
    :separation
    "A reflection is a Session Mycology event, not a Receipt River kind."}
   :schema/examples
   [{:repo "/repo"
     :lesson "Keep protocol schemas in the package that emits them."}]
   :schema/compatibility
   {:reads-unversioned true
    :writes-envelope true}})

(def schema-documents [reflection-recorded-document])
(def schemas
  {[reflection-recorded-schema reflection-recorded-version]
   reflection-recorded-document})
(def current-versions
  {reflection-recorded-schema reflection-recorded-version})

(defn assert-valid
  [payload]
  (when-not (m/validate reflection-payload payload)
    (throw (ex-info
            (str "Invalid session reflection payload: "
                 (pr-str (m/explain reflection-payload payload)))
            {:payload payload
             :explanation (m/explain reflection-payload payload)})))
  payload)
