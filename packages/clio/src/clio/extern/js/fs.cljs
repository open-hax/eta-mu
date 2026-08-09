(ns clio.extern.js.fs
  (:refer-clojure :exclude [exists?])
  (:require ["node:fs" :as fs]))

(defn exists?
  [path]
  (boolean (fs/existsSync path)))

(defn ensure-dir!
  [path]
  (fs/mkdirSync path #js {:recursive true})
  path)

(defn create-exclusive!
  [path]
  (let [fd (fs/openSync path "wx")]
    (fs/closeSync fd))
  path)

(defn read-text
  [path]
  (fs/readFileSync path "utf8"))

(defn append-text!
  [path text]
  (fs/appendFileSync path text "utf8")
  path)

(defn write-text!
  [path text]
  (fs/writeFileSync path text "utf8")
  path)

(defn rename!
  [from to]
  (fs/renameSync from to)
  to)

(defn delete-if-exists!
  [path]
  (when (exists? path)
    (fs/unlinkSync path))
  path)

(defn remove-tree!
  [path]
  (when (exists? path)
    (fs/rmSync path #js {:recursive true :force true}))
  path)

(defn list-files
  [path]
  (if (exists? path)
    (vec (fs/readdirSync path))
    []))

(defn- sleep-ms!
  [milliseconds]
  (let [buffer (js/SharedArrayBuffer. 4)
        view (js/Int32Array. buffer)]
    (js/Atomics.wait view 0 0 milliseconds))
  nil)

(defn- try-create-lock!
  [lock-path]
  (try
    (create-exclusive! lock-path)
    :acquired
    (catch :default cause
      (if (= "EEXIST" (.-code cause))
        :busy
        (throw cause)))))

(defn- lock-age-ms
  "Milliseconds since lock-path was last written, or nil if it no longer
   exists (already released by its owner or reclaimed by a contender)."
  [lock-path]
  (try
    (- (js/Date.now) (.getTime (.-mtime (fs/statSync lock-path))))
    (catch :default cause
      (if (= "ENOENT" (.-code cause))
        nil
        (throw cause)))))

(defn acquire-lock!
  "Acquire an inter-process lock by exclusively creating `<path>.lock`.
   Returns plain Clojure data; no file handle crosses the extern boundary.

   A lock older than `stale-after-ms` is assumed orphaned by a writer that
   crashed, was killed, or lost power between creating the lock and its
   `finally` releasing it, and is reclaimed by deleting it and retrying
   acquisition rather than waiting out the attempt budget."
  ([path]
   (acquire-lock! path {:attempts 200 :delay-ms 25 :stale-after-ms 60000}))
  ([path {:keys [attempts delay-ms stale-after-ms] :or {stale-after-ms 60000}}]
   (let [lock-path (str path ".lock")]
     (loop [remaining attempts]
       (case (try-create-lock! lock-path)
         :acquired
         {:lock/path lock-path}

         :busy
         (let [age-ms (lock-age-ms lock-path)]
           (cond
             (and age-ms (> age-ms stale-after-ms))
             (do
               (delete-if-exists! lock-path)
               (recur remaining))

             (pos? remaining)
             (do
               (sleep-ms! delay-ms)
               (recur (dec remaining)))

             :else
             (throw
              (ex-info "Timed out acquiring file lock"
                       {:clio/error :clio.extern.fs/lock-timeout
                        :lock/path lock-path})))))))))

(defn release-lock!
  [{:lock/keys [path]}]
  (delete-if-exists! path)
  nil)
