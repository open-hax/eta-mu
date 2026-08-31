(ns rheos.backend.domain.document-event
  "Pure adjudication and event shaping for typed Markdown file changes."
  (:require [katamorph.schema.validation :as katamorph-validation]
            [rheos.backend.law.document-profile :as law]))

(defn- validation-errors [errors]
  (mapv (fn [error]
          (cond-> {:error/code :schema/invalid-value
                   :error/message (or (:message error)
                                      "assembled document does not satisfy its schema")}
            (vector? (:path error)) (assoc :error/path (:path error))))
        errors))

(defn adjudicate
  "Validate the assembled document value through Katamorph's Malli boundary."
  [assembly]
  (if-not (:ok assembly)
    assembly
    #?(:clj
       (try
         (let [document (:document assembly)
               result (katamorph-validation/validate-schema
                       (:document/schema-form document)
                       (:document/value document))]
           (if (:ok result)
             assembly
             {:ok false
              :profile (:document/profile document)
              :errors (validation-errors (:errors result))}))
         (catch Exception _
           {:ok false
            :profile (get-in assembly [:document :document/profile])
            :errors [{:error/code :schema/invalid-form
                      :error/message "selected Malli schema form is invalid"}]}))
       :cljs
       (try
         (let [document (:document assembly)
               result (katamorph-validation/validate-schema
                       (:document/schema-form document)
                       (:document/value document))]
           (if (:ok result)
             assembly
             {:ok false
              :profile (:document/profile document)
              :errors (validation-errors (:errors result))}))
         (catch :default _
           {:ok false
            :profile (get-in assembly [:document :document/profile])
            :errors [{:error/code :schema/invalid-form
                      :error/message "selected Malli schema form is invalid"}]})))))

(defn- base-envelope [{:keys [board-id event-id event-time event-type]} payload]
  {:event/type event-type
   :event/id event-id
   :event/time event-time
   :session/id board-id
   :delivery/mode "tell"
   :payload payload})

(defn- assert-event [event]
  (when-not (law/valid-event? event)
    (throw (ex-info "Rheos produced an invalid document file event"
                    {:event/type (:event/type event)})))
  event)

(defn proposal-envelope
  [{:keys [change-kind content-sha256] :as context} document]
  (let [contracts (:document/contracts document)
        resources (:document/resources document)
        envelope (-> (base-envelope
                      (assoc context
                             :event-type "rheos.document.file-change-proposed")
                      {:type "document-file-change-proposed"
                       :change/kind change-kind
                       :content/sha256 content-sha256
                       :document document})
                     (assoc :contracts (mapv :contract/id contracts)
                            :contract/refs contracts
                            :resource/refs resources))]
    (assert-event envelope)))

(defn rejection-envelope
  [{:keys [change-kind content-sha256 source-path sidecar-path
           frontmatter-decoding profile]
    :as context}
   errors]
  (let [payload (cond-> {:type "document-file-change-rejected"
                         :change/kind change-kind
                         :document/source-path source-path
                         :document/frontmatter-decoding frontmatter-decoding
                         :errors errors}
                  content-sha256 (assoc :content/sha256 content-sha256)
                  sidecar-path (assoc :document/sidecar-path sidecar-path)
                  (law/valid-profile? profile) (assoc :document/profile profile))
        envelope (base-envelope
                  (assoc context
                         :event-type "rheos.document.file-change-rejected")
                  payload)]
    (assert-event envelope)))
