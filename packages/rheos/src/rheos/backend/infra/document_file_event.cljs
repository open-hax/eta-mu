(ns rheos.backend.infra.document-file-event
  "Effect orchestration for profiled Markdown add/change events."
  (:require [open-hax.openplanner-protocols :as protocols]
            [rheos.backend.domain.document-event :as document-event]
            [rheos.backend.extern.document-source :as source]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.shape.document-profile :as document-profile]
            [rheos.backend.shape.markdown-document :as markdown]))

(defn- event-context
  [board-id file-path change-kind document profile sidecar-path content-sha256]
  {:board-id board-id
   :event-id (source/event-id)
   :event-time (source/iso-now)
   :change-kind change-kind
   :content-sha256 content-sha256
   :source-path file-path
   :sidecar-path sidecar-path
   :frontmatter-decoding (:document/frontmatter-decoding document)
   :profile profile})

(defn- ^:async append! [tasks-dir envelope]
  (when-not (:valid (protocols/validate-envelope envelope))
    (throw (ex-info "Rheos refused a non-canonical event envelope"
                    {:event/type (:event/type envelope)})))
  (await (protocols/append-event! (ledger/get-ledger tasks-dir) envelope))
  envelope)

(defn- ^:async reject!
  [board-id tasks-dir file-path change-kind document profile sidecar-path digest errors]
  (await (append!
          tasks-dir
          (document-event/rejection-envelope
           (event-context board-id file-path change-kind document profile
                          sidecar-path digest)
           errors))))

(defn ^:async handle-file-event!
  "Append one typed proposal or rejection for a profiled Markdown add/change.

   Returns nil for unprofiled Markdown and unlink events so the legacy Kanban
   watcher remains the only interpreter for those inputs."
  [board-id tasks-dir file-path event-type]
  (when-not (= "unlink" event-type)
    (let [source-result (await (source/read-text-result! file-path))]
      (when (:ok source-result)
        (let [document-raw (:text source-result)
              document (assoc (markdown/parse document-raw)
                              :document/source-path file-path)
              profile-result (document-profile/decode-profile document)]
          (when profile-result
            (if-not (:ok profile-result)
              (await (reject! board-id tasks-dir file-path event-type document nil nil
                              (source/content-sha256 document-raw "")
                              (:errors profile-result)))
              (let [profile (:profile profile-result)
                    path-result (await (source/resolve-contained-sidecar!
                                        tasks-dir file-path
                                        (:document/sidecar profile)))]
                (if-not (:ok path-result)
                  (await (reject! board-id tasks-dir file-path event-type document profile nil
                                  (source/content-sha256 document-raw "")
                                  (:errors path-result)))
                  (let [sidecar-path (:path path-result)
                        sidecar-source-result (await (source/read-text-result! sidecar-path))]
                    (if-not (:ok sidecar-source-result)
                      (await (reject! board-id tasks-dir file-path event-type document profile
                                      sidecar-path
                                      (source/content-sha256 document-raw "")
                                      (:errors sidecar-source-result)))
                      (let [sidecar-raw (:text sidecar-source-result)
                            digest (source/content-sha256 document-raw sidecar-raw)
                            sidecar-result (document-profile/decode-sidecar sidecar-raw)]
                        (if-not (:ok sidecar-result)
                          (await (reject! board-id tasks-dir file-path event-type document profile
                                          sidecar-path digest (:errors sidecar-result)))
                          (let [assembly (document-profile/assemble
                                          document profile (:sidecar sidecar-result)
                                          file-path sidecar-path)
                                verdict (document-event/adjudicate assembly)]
                            (if (:ok verdict)
                              (await (append!
                                      tasks-dir
                                      (document-event/proposal-envelope
                                       (event-context board-id file-path event-type document
                                                      profile sidecar-path digest)
                                       (:document verdict))))
                              (await (reject! board-id tasks-dir file-path event-type document
                                              profile sidecar-path digest
                                              (:errors verdict))))))))))))))))))
