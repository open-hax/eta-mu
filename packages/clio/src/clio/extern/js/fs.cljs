(ns clio.extern.js.fs
  (:refer-clojure :exclude [exists?])
  (:require ["node:fs" :as fs]
            ["node:path" :as node-path]
            [clio.shape.edn :as edn]))

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
  [lock-path record-text]
  (try
    (create-exclusive-with-content! lock-path record-text)
    :acquired
    (catch :default cause
      (if (= "EEXIST" (.-code cause))
        :busy
        (throw cause)))))

(defn- random-token
  []
  (str (js/Date.now) "-" (js/Math.random)))

(defn- proc-stat-start-time
  "The start time (in clock ticks since boot, /proc/<pid>/stat field 22) of
   pid, or nil where the process is gone or /proc does not exist (macOS,
   Windows). The comm field is parenthesized and may itself contain spaces,
   so fields are split only after its closing paren."
  [pid]
  (try
    (let [stat (fs/readFileSync (str "/proc/" pid "/stat") "utf8")
          after-comm (.substring stat (inc (.lastIndexOf stat ")")))
          fields (.split (.trim after-comm) #"\s+")]
      (aget fields 19))
    (catch :default _ nil)))

(defn- own-start-time
  []
  (proc-stat-start-time (.-pid js/process)))

(defn- lock-record-text
  [token]
  (pr-str {:lock/pid (.-pid js/process)
           :lock/started (own-start-time)
           :lock/token token}))

(defn- lock-identity
  "The ownership record plus inode identity (dev+ino) of the lock file at
   lock-path, or nil if it no longer exists (already released by its owner or
   reclaimed by a contender). The inode distinguishes 'the same lock file I
   inspected' from 'a fresh lock a contender created at this path after
   reclaiming the one I inspected'. An unparseable record reads as nil, which
   callers treat as unknown ownership and fall back to age on."
  [lock-path]
  (try
    (let [stat (fs/statSync lock-path)
          record (try (edn/read-one (read-text lock-path))
                      (catch :default _ nil))]
      {:lock/dev (.-dev stat)
       :lock/ino (.-ino stat)
       :lock/mtime-ms (.getTime (.-mtime stat))
       :lock/record record})
    (catch :default cause
      (if (= "ENOENT" (.-code cause))
        nil
        (throw cause)))))

(defn- process-alive?
  "Whether pid names a live process, checked without sending it a real
   signal. `kill(pid, 0)` only validates that the target exists and is
   signalable; a thrown ESRCH means no such process, any other error (most
   commonly EPERM, a process we lack permission to signal) means it exists."
  [pid]
  (try
    (.kill js/process pid 0)
    true
    (catch :default cause
      (not= "ESRCH" (.-code cause)))))

(defn- owner-alive?
  "Whether the lock's recorded owner still exists. pid liveness is necessary
   but not sufficient: a crashed writer's pid can be reused by an unrelated
   long-lived process before the orphaned lock is inspected, and kill(pid, 0)
   would then report that process as the owner, blocking reclamation for its
   whole lifetime. Where /proc exists, the start time recorded at lock
   creation disambiguates — a reused pid belongs to a process started at a
   different time. Where /proc does not exist (or an older lock record
   carries no start time), falls back to pid liveness alone."
  [{:lock/keys [pid started]}]
  (let [current (proc-stat-start-time pid)]
    (if (and started current)
      (= started current)
      (process-alive? pid))))

(defn- reclaimable-identity
  "The identity of lock-path's lock if it may be reclaimed right now, else
   nil. A lock whose recorded owner process is still alive is never
   reclaimable, no matter its age — an overrun read+validate phase in a live
   writer must not let a contender in. A lock the PID record can't establish
   liveness for (missing/corrupt, e.g. between another reclaimer's rename and
   its own recreate) falls back to the age-based safety net rather than
   waiting on it forever. The returned identity is what a reclaimer must
   re-verify at the destructive step — see try-reclaim-stale-lock!."
  [lock-path stale-after-ms]
  (when-let [identity (lock-identity lock-path)]
    (let [record (:lock/record identity)]
      (if (:lock/pid record)
        (when-not (owner-alive? record)
          identity)
        (when (> (- (js/Date.now) (:lock/mtime-ms identity)) stale-after-ms)
          identity)))))

(defn- try-reclaim-stale-lock!
  "Attempt to claim reclamation of a stale lock by atomically renaming it
   aside — then verify the renamed file is still the exact lock that was
   inspected (same dev+ino, same ownership token) before deleting it.

   Renaming is atomic at the OS level: when two contenders race on the same
   stale lock, at most one rename succeeds and the other gets ENOENT. The
   identity check closes the subtler race that raw rename-aside leaves open:
   the loser of that race, acting on its earlier staleness observation, would
   otherwise rename aside and delete the *fresh* lock the winner went on to
   create, letting both processes enter the critical section. On mismatch the
   file is renamed back untouched and reclamation aborts. (In the vanishing
   gap where a third party creates a lock while one is renamed aside, the
   rename-back can displace it — displaced holders are caught by the
   lock-owned? commit fence in infra.ledger, so at most one process ever
   commits.)"
  [lock-path expected]
  (let [claim-path (str lock-path ".reclaim-" (random-token))]
    (try
      (fs/renameSync lock-path claim-path)
      (let [actual (lock-identity claim-path)]
        (if (and (= (:lock/dev actual) (:lock/dev expected))
                 (= (:lock/ino actual) (:lock/ino expected))
                 (= (get-in actual [:lock/record :lock/token])
                    (get-in expected [:lock/record :lock/token])))
          (do (delete-if-exists! claim-path) true)
          (do
            (try (fs/renameSync claim-path lock-path)
                 (catch :default _))
            false)))
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
   this process's pid and a fresh ownership token. Returns plain Clojure data;
   no file handle crosses the extern boundary.

   A lock is reclaimed, rather than waited out, once its recorded owner
   process is confirmed dead (crashed, killed, or lost power between creating
   the lock and its `finally` releasing it) — see `reclaimable-identity`. Liveness,
   not age, decides this: an overrun read+validate phase in a writer that is
   still alive must never let a contender in, no matter how long it runs.
   Reclamation itself is race-safe: see `try-reclaim-stale-lock!`. The
   ownership token additionally lets a caller whose lock was reclaimed detect
   it (`lock-owned?`) instead of blindly assuming it still holds the critical
   section, and prevents `release-lock!` from deleting a different owner's
   lock."
  ([path]
   (acquire-lock! path {:attempts 200 :delay-ms 25 :stale-after-ms 60000}))
  ([path {:keys [attempts delay-ms stale-after-ms] :or {stale-after-ms 60000}}]
   (let [lock-path (canonical-lock-path path)
         token (random-token)
         record-text (lock-record-text token)]
     (loop [remaining attempts]
       (case (try-create-lock! lock-path record-text)
         :acquired
         {:lock/path lock-path :lock/token token}

          :busy
          (let [identity (reclaimable-identity lock-path stale-after-ms)]
            (cond
              identity
              (do
                (try-reclaim-stale-lock! lock-path identity)
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
  (= token (get-in (lock-identity path) [:lock/record :lock/token])))

(defn release-lock!
  "Delete the lock only if it still holds this caller's token. If the lock was
   reclaimed as stale while this caller held it, the file now belongs to a
   different owner and must not be deleted out from under them."
  [lock]
  (when (lock-owned? lock)
    (delete-if-exists! (:lock/path lock)))
  nil)
