(ns open-hax.services.infra.providers
  "Explicit service provider selection. Configuration errors never select a fallback."
  (:require [open-hax.records.edn.services :as edn]
            [open-hax.records.services :as services]
            [open-hax.records.mongo.event-admission :as mongo-events]
            [open-hax.records.mongo.session-management :as mongo-sessions]
            [open-hax.records.mongo.document-storage :as mongo-documents]
            [open-hax.records.mongo.graph-operations :as mongo-graph]
            [open-hax.records.mongo.translation-management :as mongo-translations]
            [open-hax.records.mongo.label-management :as mongo-labels]
            [open-hax.records.mongo.user-management :as mongo-users]
            [open-hax.records.mongo.realtime-subscription :as realtime]
            [open-hax.services.law.local :as law]))

(defmulti create-provider :provider)

(defmethod create-provider :edn [{:keys [directory overrides]}]
  (law/validate-overrides! overrides)
  (law/validate-directory! directory)
  (let [provider (edn/create-edn-services directory)]
    (if (seq overrides)
      (services/compose
       (merge (zipmap [:events :sessions :documents :graph :translations :labels :users :realtime]
                      (repeat provider))
              overrides))
      provider)))

(defmethod create-provider :mongo [{:keys [db document-collection overrides]
                                   :or {document-collection "documents"}}]
  (law/validate-overrides! overrides)
  (law/require! (some? db) :missing-database
                "The Mongo provider requires an explicitly connected database")
  (services/compose
   (merge {:events (mongo-events/->MongoEventAdmission db)
           :sessions (mongo-sessions/->MongoSessionManagement db)
           :documents (mongo-documents/->MongoDocumentStorage db document-collection)
           :graph (mongo-graph/->MongoGraphOperations db)
           :translations (mongo-translations/->MongoTranslationManagement db)
           :labels (mongo-labels/->MongoLabelManagement db)
           :users (mongo-users/->MongoUserManagement db)
           :realtime (realtime/create-subscription-manager)}
          overrides)))

(defmethod create-provider :default [{:keys [provider]}]
  (throw (ex-info "Unknown service provider; register its protocol adapter explicitly"
                  {:services/error :unknown-provider :provider provider})))
