(ns axxium.infra.identity-store-recovery-test
  (:require [axxium.domain.identity :as domain]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(deftest retained-ledger-never-authorizes-replacement-of-a-lost-vault-key
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-lost-key-"))
        ledger (str directory "/identity.edn")
        key (str directory "/private/master-key")]
    (try
      (let [provider (store/create-provider {:provider :edn :directory directory})
            reference (store/seal! provider {:fixture "retained private value"})]
        (store/transact! provider
                         (fn [_] {:operation :fixture
                                  :changes [(domain/put :credentials "retained" {:private-ref reference})]}))
        (let [original (fs/readFileSync ledger "utf8")]
          (fs/rmSync (str directory "/schemas") #js {:recursive true :force true})
          (fs/unlinkSync key)
          (is (= :missing-vault-key
                 (try (store/create-provider {:provider :edn :directory directory})
                      nil (catch :default cause (:code (ex-data cause))))))
          (is (false? (fs/existsSync key)))
          (is (= original (fs/readFileSync ledger "utf8")))
          (is (fs/existsSync (str directory "/private/" reference)))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))
