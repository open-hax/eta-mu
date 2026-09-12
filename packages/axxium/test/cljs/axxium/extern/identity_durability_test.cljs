(ns axxium.extern.identity-durability-test
  "Identity projection-only retries obey the same native durability fence as new facts."
  (:require [axxium.domain.identity :as domain]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs-module]
            ["node:module" :refer [syncBuiltinESMExports]]
            ["node:os" :as os]
            ["node:path" :as path]))

(def ^:private fs (or (.-default fs-module) fs-module))

(defn- with-observer [file observe! run]
  (let [open (.-openSync fs) sync (.-fsyncSync fs) handles (atom {})]
    (set! (.-openSync fs) (fn [& args]
                          (let [fd (.apply open fs (clj->js args))]
                            (swap! handles assoc fd (first args)) fd)))
    (set! (.-fsyncSync fs) (fn [fd] (when (= file (get @handles fd)) (observe!)) (sync fd)))
    (syncBuiltinESMExports)
    (try (run)
         (finally (set! (.-openSync fs) open) (set! (.-fsyncSync fs) sync)
                  (syncBuiltinESMExports)))))

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
