(ns axxium.extern.identity-checkpoint-recovery-test
  (:require [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(deftest initialized-store-refuses-lost-ceremony-checkpoint
  (doseq [issued? [false true]]
    (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-lost-checkpoint-"))
          configuration {:provider :edn :directory directory}]
      (try
        (let [provider (store/create-provider configuration)
              checkpoint (:ceremony-file provider)
              ledger (:file provider)
              key (str directory "/private/master-key")]
          (when issued?
            (ceremonies/issue! provider "challenge" "browser" :pgp-login {:proof "retained"} 300000))
          (let [original-checkpoint (fs/readFileSync checkpoint)
                original-ledger (fs/readFileSync ledger)
                original-key (fs/readFileSync key)]
            (fs/unlinkSync checkpoint)
            (is (= :clio.ledger/missing-file
                   (try (store/state provider) nil
                        (catch :default cause (:clio/error (ex-data cause)))))
                "A running handle refuses a missing checkpoint")
            (is (= :missing-ceremonies
                   (try (store/create-provider configuration) nil
                        (catch :default cause (:code (ex-data cause)))))
                "Restart cannot replace lost admission history with an empty checkpoint")
            (is (false? (fs/existsSync checkpoint)))
            (is (true? (.equals original-ledger (fs/readFileSync ledger))) "Identity bytes remain unchanged")
            (is (true? (.equals original-key (fs/readFileSync key))) "Vault key bytes remain unchanged")
            ;; Only restoration of the exact retained artifact re-enables open.
            (fs/writeFileSync checkpoint original-checkpoint)
            (let [reopened (store/create-provider configuration)]
              (is (= (when issued? {:proof "retained"})
                     (ceremonies/private-value reopened "challenge"))))))
        (finally (fs/rmSync directory #js {:recursive true :force true}))))))
