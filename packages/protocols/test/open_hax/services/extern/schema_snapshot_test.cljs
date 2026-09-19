(ns open-hax.services.extern.schema-snapshot-test
  (:require [clio.extern.js.fs :as fs]
            [clio.infra.runtime :as runtime]
            [clio.infra.schema-store :as schema-store]
            [clio.law.schema :as schema]
            [cljs.test :refer [deftest is]]
            [open-hax.openplanner-protocols :as protocols]
            [open-hax.records.edn.services :as services]
            [open-hax.services.infra.local :as local]
            [open-hax.services.law.local :as law]
            ["node:fs" :as node-fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- publish! [directory]
  (let [catalog (assoc law/catalog :fixture/new
                       (schema/event-schema :fixture/new :map))
        publisher (runtime/open (str directory "/schemas") catalog)]
    (runtime/append! publisher (str directory "/services.edn") :open-hax.services/changed
                     {:event/stream "open-hax/services" :event/seq 1 :event/causes []
                      :event/actor "new-deployment" :event/subject "document"
                      :event/data {:changes [{:op :put :collection :documents :id "new"
                                             :value {:id "new" :content "new revision"}}]}})
    (:schema/root (:schema/current publisher))))

(deftest ^:async service-snapshot-loads-revisions-after-capturing-visible-events
  (doseq [action [:query :open]]
    (let [directory (node-fs/mkdtempSync (path/join (os/tmpdir) "services-schema-race-"))
          original-acquire fs/acquire-read-lock!
          pending? (atom true)
          published-root (atom nil)]
      (try
        (let [old-service (services/create-edn-services directory)
              result
              (with-redefs [fs/acquire-read-lock!
                            (fn [file]
                              (when (and (= file (str directory "/services.edn"))
                                         (compare-and-set! pending? true false))
                                ;; Real schema publication and admitted append occur
                                ;; after the old reader's revision refresh, before
                                ;; its actual owning-descriptor snapshot begins.
                                (reset! published-root (publish! directory)))
                              (original-acquire file))]
                (try
                  {:document (await (protocols/get-document
                                     (if (= action :open)
                                       (services/create-edn-services directory)
                                       old-service) "new"))}
                  (catch :default cause {:error (:clio/error (ex-data cause))})))]
          (is (false? @pending?) "The writer crossed the actual ledger snapshot boundary")
          (is (= {:document {:id "new" :content "new revision"}} result)
              "A legitimate newly published revision is available to query and reopen")
          ;; Refresh must not turn genuinely missing schema history into success.
          (node-fs/unlinkSync (str directory "/schemas/" @published-root ".edn"))
          (is (= :clio.schema/unknown-revision
                 (try (await (protocols/get-document old-service "new")) nil
                      (catch :default cause (:clio/error (ex-data cause)))))))
        (finally (node-fs/rmSync directory #js {:recursive true :force true}))))))

(deftest durability-schema-loader-failure-releases-its-owning-lock
  (let [directory (node-fs/mkdtempSync (path/join (os/tmpdir) "services-schema-refusal-"))
        failure (ex-info "Injected schema read refusal" {:fixture :schema-refusal})]
    (try
      (let [store (local/open! directory)
            original (node-fs/readFileSync (:file store) "utf8")]
        (with-redefs [schema-store/load-revisions (fn [_] (throw failure))]
          (is (identical? failure
                          (try (runtime/ensure-durable! (:runtime store) (:file store)) nil
                               (catch :default cause cause)))))
        (is (= original (node-fs/readFileSync (:file store) "utf8")))
        (is (nil? (try (runtime/ensure-durable! (:runtime store) (:file store)) nil
                       (catch :default cause cause)))
            "A failed revision load releases its descriptor and native lock")
        (is (= {} (local/state store))))
      (finally (node-fs/rmSync directory #js {:recursive true :force true})))))
