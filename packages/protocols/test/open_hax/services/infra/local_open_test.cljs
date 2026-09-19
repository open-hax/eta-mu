(ns open-hax.services.infra.local-open-test
  (:require [clio.extern.js.fs :as fs]
            [clio.infra.ledger :as ledger]
            [cljs.test :refer [deftest is]]
            [open-hax.services.infra.local :as local]
            ["node:fs" :as node-fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- directory [] (node-fs/mkdtempSync (path/join (os/tmpdir) "services-open-")))
(defn- remove! [directory] (node-fs/rmSync directory #js {:recursive true :force true}))

(deftest concurrent-winner-is-validated-instead-of-suppressing-all-create-errors
  (doseq [corrupt? [false true]]
    (let [directory (directory)
          create! ledger/create-ledger!
          pending? (atom true)]
      (try
        (with-redefs [ledger/create-ledger!
                      (fn [file]
                        (when (compare-and-set! pending? true false)
                          (create! file)
                          (when corrupt? (node-fs/appendFileSync file "{:unfinished [")))
                        (create! file))]
          (let [result (try {:store (local/open! directory)}
                            (catch :default error {:error error}))]
            (if corrupt?
              (is (= :clio.ledger/invalid-edn (:clio/error (ex-data (:error result)))))
              (do (is (:store result))
                  (when (:store result)
                    (is (= {} (local/state (:store result)))))))))
        (finally (remove! directory))))))

(deftest initialized-missing-ledger-and-unrelated-create-failures-still-refuse
  (let [directory (directory)
        failure (ex-info "injected write failure" {:fixture :write-failure})]
    (try
      (with-redefs [ledger/create-ledger! (fn [_] (throw failure))]
        (is (identical? failure (try (local/open! directory) nil (catch :default error error)))))
      (local/open! directory)
      (node-fs/unlinkSync (str directory "/services.edn"))
      (is (= :missing-ledger
             (try (local/open! directory) nil (catch :default error (:services/error (ex-data error))))))
      (is (false? (fs/exists? (str directory "/services.edn"))))
      (finally (remove! directory)))))
