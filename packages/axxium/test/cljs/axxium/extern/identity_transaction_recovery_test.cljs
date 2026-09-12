(ns axxium.extern.identity-transaction-recovery-test
  "Actual native append uncertainty must retain the one prepared identity response."
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs-module]
            ["node:module" :refer [syncBuiltinESMExports]]
            ["node:os" :as os]
            ["node:path" :as path]))

(def ^:private fs (or (.-default fs-module) fs-module))

(defn- observe-native-failure [file phase refuse? run]
  (let [open (.-openSync fs) append (.-appendFileSync fs) sync (.-fsyncSync fs)
        handles (atom {}) writes (atom 0) attempts (atom 0)
        failure (ex-info "Injected identity transaction durability refusal" {:code :injected-fence})]
    (set! (.-openSync fs)
          (fn [& args]
            (let [fd (.apply open fs (clj->js args))]
              (swap! handles assoc fd (first args)) fd)))
    (set! (.-appendFileSync fs)
          (fn [fd text encoding]
            (when (and (= file (get @handles fd)) (= phase :before-write)) (throw failure))
            (append fd text encoding)
            (when (= file (get @handles fd)) (swap! writes inc))))
    (set! (.-fsyncSync fs)
          (fn [fd]
            (when (and (pos? @writes)
                       (= (get @handles fd) (if (= phase :inode) file (path/dirname file))))
              (when (refuse? (swap! attempts inc)) (throw failure)))
            (sync fd)))
    (syncBuiltinESMExports)
    (try
      (merge (try {:result (run)} (catch :default cause {:error cause}))
             {:writes @writes :fences @attempts :failure failure})
      (finally
        (set! (.-openSync fs) open)
        (set! (.-appendFileSync fs) append)
        (set! (.-fsyncSync fs) sync)
        (syncBuiltinESMExports)))))

(defn- open-service [directory]
  (identity/open! {:provider :edn :directory directory
                   :public-base-url "http://localhost:8787" :rp-id "localhost"}))

(deftest a-visible-login-recovers-its-original-token-before-acknowledging
  (doseq [phase [:inode :parent]]
    (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-login-fence-"))]
      (try
        (let [service (open-service directory)
              browser (host/random-token)
              challenge (identity/challenge! service browser :oauth/github {})
              remote {:issuer "https://github.com" :subject "fence-user"}
              observed (observe-native-failure
                        (str directory "/identity.edn") phase #(= 1 %)
                        #(identity/accept-external! service browser challenge :oauth/github remote))
              result (:result observed)]
          (is (nil? (:error observed)))
          (is (string? (:token result)))
          (is (= 1 (:writes observed)) "Recovery never appends another event")
          (is (= 2 (:fences observed)) "The exact visible event must be durably retried")
          (is (= 1 (count (:canonical/events (store/history (:store service))))))
          (when (:token result)
            (is (= (:principal result)
                   (identity/resolve-principal (open-service directory) (:token result)))))
          (is (= :invalid-challenge
                 (try (identity/accept-external! service browser challenge :oauth/github remote)
                      nil (catch :default cause (:code (ex-data cause)))))))
        (finally (.rmSync fs directory #js {:recursive true :force true}))))))

(deftest nonvisible-errors-and-persistent-fences-never-return-prepared-results
  (doseq [phase [:before-write :inode]]
    (let [directory (.mkdtempSync fs (path/join (os/tmpdir) "axxium-refused-fence-"))]
      (try
        (let [provider (store/create-provider {:provider :edn :directory directory})
              decisions (atom 0)
              observed (observe-native-failure
                        (:file provider) phase (constantly true)
                        #(store/transact!
                          provider
                          (fn [_]
                            (swap! decisions inc)
                            {:operation :fixture
                             :changes [(domain/put :credentials "one" {:accepted true})]
                             :result :must-not-escape})))]
          (is (identical? (:failure observed) (:error observed)))
          (is (nil? (:result observed)))
          (is (= 1 @decisions))
          (is (= (if (= phase :inode) 1 0) (:writes observed)))
          (is (= (if (= phase :inode) 2 0) (:fences observed)))
          (is (= (if (= phase :inode) 1 0)
                 (count (:canonical/events (store/history provider))))))
        (finally (.rmSync fs directory #js {:recursive true :force true}))))))
