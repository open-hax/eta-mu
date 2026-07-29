(ns eta-mu.session-mycology.law.reflection
  "Admissibility law for reflection-recorded payloads."
  (:require [clojure.string :as str]
            [malli.core :as m]))

(def reflection-payload
  [:map
   [:repo :string]
   [:lesson [:and :string
             [:fn {:error/message "lesson must not be blank"}
              (complement str/blank?)]]]
   [:session/id {:optional true} :string]
   [:task/id {:optional true} :string]
   [:receipt/refs {:optional true} [:vector :string]]])

(defn assert-valid
  [payload]
  (when-not (m/validate reflection-payload payload)
    (throw (ex-info
            (str "Invalid session reflection payload: "
                 (pr-str (m/explain reflection-payload payload)))
            {:payload payload
             :explanation (m/explain reflection-payload payload)})))
  payload)
