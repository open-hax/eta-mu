(ns open-hax.sol.extern.ledger-sync-fault
  "Inject a ledger fsync failure while retaining actual Node files and descriptors."
  (:require ["node:fs" :as module-fs]
            ["node:module" :refer [syncBuiltinESMExports]]))

(def ^:private native (or (.-default module-fs) module-fs))

(defn with-failure!
  "Fail synchronization of the named ledger only, restoring Node exports afterward."
  [file operation]
  (let [original-open (.-openSync native)
        original-sync (.-fsyncSync native)
        handles (atom {})]
    (set! (.-openSync native)
          (fn [& args]
            (let [fd (.apply original-open native (clj->js args))]
              (swap! handles assoc fd (first args))
              fd)))
    (set! (.-fsyncSync native)
          (fn [fd]
            (when (= file (get @handles fd))
              (throw (ex-info "Injected ledger synchronization failure" {:sol/test-error :ledger-sync})))
            (original-sync fd)))
    (syncBuiltinESMExports)
    (try (operation)
         (finally
           (set! (.-openSync native) original-open)
           (set! (.-fsyncSync native) original-sync)
           (syncBuiltinESMExports)))))
