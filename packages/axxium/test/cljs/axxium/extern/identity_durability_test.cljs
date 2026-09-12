(ns axxium.extern.identity-durability-test
  "Identity projection-only retries obey the same native durability fence as new facts."
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs-module]
            ["node:module" :refer [syncBuiltinESMExports]]
            ["node:os" :as os]
            ["node:path" :as path]))

(def ^:private fs (or (.-default fs-module) fs-module))

(defn- with-sync-observer [observe! run]
  (let [open (.-openSync fs) sync (.-fsyncSync fs) handles (atom {})]
    (set! (.-openSync fs) (fn [& args]
                          (let [fd (.apply open fs (clj->js args))]
                            (swap! handles assoc fd (first args)) fd)))
    (set! (.-fsyncSync fs) (fn [fd] (observe! (get @handles fd)) (sync fd)))
    (syncBuiltinESMExports)
    (try (run)
         (finally (set! (.-openSync fs) open) (set! (.-fsyncSync fs) sync)
                  (syncBuiltinESMExports)))))

(defn- with-observer [file observe! run]
  (with-sync-observer #(when (= file %) (observe!)) run))

(defn- transition [state]
  (if-let [old (get-in state [:credentials "marker"])]
    {:result old}
    {:operation :test-fact :changes [(domain/put :credentials "marker" {:accepted true})]
     :result {:accepted true}}))

(deftest identity-retry-cannot-acknowledge-a-visible-but-unflushed-fact
  (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-durable-retry-"))]
    (try
      (let [provider (store/create-provider {:provider :edn :directory directory})
            file (:file provider)
            attempts (atom 0)]
        (with-observer file #(do (swap! attempts inc) (throw (ex-info "Injected identity fsync failure" {})))
          (fn []
            (is (thrown-with-msg? cljs.core/ExceptionInfo #"Injected identity fsync failure"
                                  (store/transact! provider transition)))
            (is (= {:accepted true} (get-in (store/state provider) [:credentials "marker"])))
            (is (thrown-with-msg? cljs.core/ExceptionInfo #"Injected identity fsync failure"
                                  (store/transact! provider transition)))
            (is (= 2 @attempts))))
        (let [before (.readFileSync fs file "utf8")]
          (with-observer file #(swap! attempts inc)
            #(is (= {:accepted true} (store/transact! provider transition))))
          (is (= 3 @attempts))
          (is (= before (.readFileSync fs file "utf8")))))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(deftest surviving-vault-keys-must-retry-inode-and-parent-durability
  (doseq [phase [:inode :parent]]
    (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-key-force-"))
          private (str directory "/private")
          file (str private "/master-key")
          inode-seen? (atom false)
          trace (atom [])]
      (try
        (with-sync-observer
          (fn [target]
            (when (= file target) (reset! inode-seen? true))
            (when (and @inode-seen? (= target (if (= phase :inode) file private)))
              (throw (ex-info "Injected key creation fence failure" {}))))
          #(is (thrown-with-msg? cljs.core/ExceptionInfo #"Injected key creation fence failure"
                                (host/open-vault! directory false))))
        (let [original (.readFileSync fs file "base64url")]
          (with-observer file #(throw (ex-info "Injected key reopen fence failure" {}))
            #(is (thrown-with-msg? cljs.core/ExceptionInfo #"Injected key reopen fence failure"
                                  (host/open-vault! directory true))))
          (with-sync-observer #(swap! trace conj %)
            #(is (= original (:key (host/open-vault! directory true)))))
          (is (= [file private] (vec (take-last 2 @trace))))
          (is (= original (.readFileSync fs file "base64url"))))
        (finally (.rmSync fs directory #js {:recursive true :force true}))))))

(deftest ceremony-reopen-refuses-a-visible-checkpoint-without-a-successful-fence
  (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-ceremony-force-"))
        options {:provider :edn :directory directory}]
    (try
      (let [provider (store/create-provider options)
            file (:ceremony-file provider)
            renamed? (atom false)
            rename (.-renameSync fs)]
        (set! (.-renameSync fs) (fn [from to]
                                 (rename from to)
                                 (when (= file to) (reset! renamed? true))))
        (syncBuiltinESMExports)
        (try
          (with-sync-observer
            #(when (and @renamed? (= directory %))
               (throw (ex-info "Injected ceremony publication fence failure" {})))
            #(is (thrown-with-msg? cljs.core/ExceptionInfo #"Injected ceremony publication fence failure"
                                  (ceremonies/issue! provider "checkpoint" "browser" :test/pending {} 300000))))
          (finally (set! (.-renameSync fs) rename) (syncBuiltinESMExports)))
        (is @renamed?)
        (is (contains? (ceremonies/entries provider) "checkpoint"))
        (let [before (.readFileSync fs file "utf8")]
          (with-observer file #(throw (ex-info "Injected ceremony reopen fence failure" {}))
            #(is (thrown-with-msg? cljs.core/ExceptionInfo #"Injected ceremony reopen fence failure"
                                  (store/create-provider options))))
          (is (contains? (ceremonies/entries (store/create-provider options)) "checkpoint"))
          (is (= before (.readFileSync fs file "utf8")))))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(deftest ledger-exclusive-create-collisions-reopen-only-valid-winners
  (doseq [name ["identity.edn" "ceremonies.edn"]]
    (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-create-collision-"))
          file (str directory "/" name)
          open (.-openSync fs)
          injected? (atom false)]
      (try
        (set! (.-openSync fs)
              (fn [& args]
                (when (and (= file (first args)) (= "wx" (second args))
                           (compare-and-set! injected? false true))
                  (.closeSync fs (.apply open fs (clj->js args))))
                (.apply open fs (clj->js args))))
        (syncBuiltinESMExports)
        (is (= :edn (try (:provider (store/create-provider {:provider :edn :directory directory}))
                        (catch :default cause (.-code cause)))))
        (is @injected?)
        (finally (set! (.-openSync fs) open) (syncBuiltinESMExports)
                 (.rmSync fs directory #js {:recursive true :force true}))))))

(deftest identity-reopen-must-reflush-an-interrupted-ledger-creation
  (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-create-retry-"))
        file (str directory "/identity.edn")
        attempts (atom 0)
        open-provider #(store/create-provider {:provider :edn :directory directory})
        refuses? #(try (open-provider) false (catch :default _ true))]
    (try
      (with-observer file #(do (swap! attempts inc) (throw (ex-info "Injected identity creation fsync failure" {})))
        (fn []
          (is (refuses?) "Creation must refuse the unsuccessful inode flush")
          (is (.existsSync fs file) "The uncertain creation preserves the visible ledger")
          (is (refuses?) "Reopening must retry the ledger inode flush before returning a provider")
          (is (= 2 @attempts))))
      (with-observer file #(swap! attempts inc)
        (fn []
          (let [provider (open-provider)]
            (is (= {} (:credentials (store/state provider) {}))))))
      (is (= 3 @attempts))
      (is (= "" (.readFileSync fs file "utf8")))
      (finally (.rmSync fs directory #js {:recursive true :force true})))))

(deftest exclusive-create-recovery-refuses-corrupt-winners-and-other-errors
  (doseq [name ["identity.edn" "ceremonies.edn"]
          failure [:corrupt-winner :access-denied]]
    (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-create-refusal-"))
          file (str directory "/" name)
          open (.-openSync fs)
          injected? (atom false)]
      (try
        (set! (.-openSync fs)
              (fn [& args]
                (when (and (= file (first args)) (= "wx" (second args))
                           (compare-and-set! injected? false true))
                  (if (= :corrupt-winner failure)
                    (let [fd (.apply open fs (clj->js args))]
                      (try (.writeFileSync fs fd "{:partial")
                           (finally (.closeSync fs fd))))
                    (throw (doto (js/Error. "Injected create access refusal")
                             (aset "code" "EACCES")))))
                (.apply open fs (clj->js args))))
        (syncBuiltinESMExports)
        (is (try (store/create-provider {:provider :edn :directory directory}) false
                 (catch :default error
                   (or (= :corrupt-winner failure) (= "EACCES" (.-code error))))))
        (is @injected?)
        (when (= :corrupt-winner failure)
          (is (= "{:partial" (.readFileSync fs file "utf8"))))
        (finally (set! (.-openSync fs) open) (syncBuiltinESMExports)
                 (.rmSync fs directory #js {:recursive true :force true}))))))
