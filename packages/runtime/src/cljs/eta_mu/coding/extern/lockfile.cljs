(ns eta-mu.coding.extern.lockfile
  (:require [eta-mu.coding.extern.fs :as fs]))

(defn lockfile-path
  "Return the lock path for a target file or directory."
  [target]
  (str target ".lock"))

(defn acquire-lock!
  "Acquire an advisory lock for `target`.
   Uses an exclusive file write (O_EXCL) through the fs adapter.
   Options: :retries (default 100), :retry-delay-ms (default 50).
   Returns {:ok true :lock-path path} or {:ok false :error :code :lock-path}."
  ([target] (acquire-lock! target {}))
  ([target {:keys [retries retry-delay-ms]
            :or {retries 100 retry-delay-ms 50}}]
   (let [lock-path (lockfile-path target)
         pid (str (.-pid (.-process js/globalThis)))
         start (js/Date.now)]
     (loop [attempt 0]
       (let [write-res (fs/write-text-file! lock-path pid)]
         (if (:ok write-res)
           {:ok true :lock-path lock-path :owner pid}
           (if (and (< attempt retries)
                    (< (- (js/Date.now) start) (* retries retry-delay-ms)))
             (do (js/setTimeout identity retry-delay-ms)
                 (recur (inc attempt)))
             {:ok false
              :error (str "Could not acquire lock: " (:error write-res))
              :code "ELOCK"
              :lock-path lock-path})))))))

(defn release-lock!
  "Release the advisory lock for `target`."
  [target]
  (let [lock-path (lockfile-path target)
        res (fs/delete-file! lock-path)]
    (if (:ok res)
      {:ok true :lock-path lock-path}
      {:ok false
       :error (:error res)
       :code (or (:code res) "EUNLOCK")
       :lock-path lock-path})))

(defn with-lock!
  "Acquire a lock for `target`, execute `(f)`, then release the lock.
   Returns the result of `f` wrapped in {:ok true :value} or {:ok false :error}."
  ([target f] (with-lock! target {} f))
  ([target opts f]
   (let [acquired (acquire-lock! target opts)]
     (if (:ok acquired)
       (try
         {:ok true :value (f) :lock-path (:lock-path acquired)}
         (catch js/Error e
           {:ok false
            :error (.-message e)
            :code (or (.-code e) "ELOCKFN")})
         (finally
           (release-lock! target)))
       acquired))))
