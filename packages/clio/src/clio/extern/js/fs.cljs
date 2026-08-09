(ns clio.extern.js.fs
  (:refer-clojure :exclude [exists?])
  (:require ["node:fs" :as fs]
            ["node:path" :as node-path]))

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

(defn- create-exclusive-with-content!
  [path content]
  (fs/writeFileSync path content #js {:flag "wx"})
  path)

(defn- try-create-lock!
  [lock-path token]
  (try
    (create-exclusive-with-content! lock-path token)
    :acquired
    (catch :default cause
      (if (= "EEXIST" (.-code cause))
        :busy
        (throw cause)))))

(defn- random-token
  []
  (str (js/Date.now) "-" (js/Math.random)))

(defn- current-lock-token
  "The token currently written into lock-path, or nil if it no longer exists."
  [lock-path]
  (try
    (read-text lock-path)
    (catch :default cause
      (if (= "ENOENT" (.-code cause))
        nil
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

(defn- try-reclaim-stale-lock!
  "Attempt to claim reclamation of a stale lock by atomically renaming it
   aside. Renaming is atomic at the OS level: when two contenders race on the
   same stale lock, at most one rename succeeds and the other gets ENOENT.
   Without this, two contenders could both decide the lock is stale, both
   unconditionally delete it, and both believe they hold the fresh lock each
   then creates — the exact ownership race an unconditional delete permits."
  [lock-path]
  (let [claim-path (str lock-path ".reclaim-" (js/Math.random))]
    (try
      (fs/renameSync lock-path claim-path)
      (delete-if-exists! claim-path)
      true
      (catch :default cause
        (if (= "ENOENT" (.-code cause))
          false
          (throw cause))))))

(defn- canonical-lock-path
  "Resolve path's containing directory to its real filesystem location before
   deriving the lock path, so two callers reaching the same ledger through
   different symlinked directory paths contend for one lock file instead of
   two independent ones. A hard link to the same file under a different name
   within the same real directory is a known residual gap this does not
   cover — that needs inode identity (dev+ino), not a path string."
  [path]
  (str (fs/realpathSync (node-path/dirname path))
       node-path/sep
       (node-path/basename path)
       ".lock"))

(defn acquire-lock!
  "Acquire an inter-process lock by exclusively creating `<path>.lock` holding
   a fresh ownership token. Returns plain Clojure data; no file handle crosses
   the extern boundary.

   A lock older than `stale-after-ms` is assumed orphaned by a writer that
   crashed, was killed, or lost power between creating the lock and its
   `finally` releasing it, and reclamation is attempted rather than waiting
   out the attempt budget. Reclamation itself is race-safe: see
   `try-reclaim-stale-lock!`. The ownership token additionally lets a caller
   whose lock was reclaimed detect it (`lock-owned?`) instead of blindly
   assuming it still holds the critical section, and prevents `release-lock!`
   from deleting a different owner's lock."
  ([path]
   (acquire-lock! path {:attempts 200 :delay-ms 25 :stale-after-ms 60000}))
  ([path {:keys [attempts delay-ms stale-after-ms] :or {stale-after-ms 60000}}]
   (let [lock-path (canonical-lock-path path)
         token (random-token)]
     (loop [remaining attempts]
       (case (try-create-lock! lock-path token)
         :acquired
         {:lock/path lock-path :lock/token token}

         :busy
         (let [age-ms (lock-age-ms lock-path)]
           (cond
             (and age-ms (> age-ms stale-after-ms))
             (do
               (try-reclaim-stale-lock! lock-path)
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

(defn lock-owned?
  "Whether lock still holds the exact token it was acquired with, i.e. this
   caller has not been reclaimed as a stale owner by a contender."
  [{:lock/keys [path token]}]
  (= token (current-lock-token path)))

(defn release-lock!
  "Delete the lock only if it still holds this caller's token. If the lock was
   reclaimed as stale while this caller held it, the file now belongs to a
   different owner and must not be deleted out from under them."
  [lock]
  (when (lock-owned? lock)
    (delete-if-exists! (:lock/path lock)))
  nil)
