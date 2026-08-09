(ns clio.extern.js.fs
  (:refer-clojure :exclude [exists?])
  (:require ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:fs" :as fs]))

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

(defn hard-link!
  [from to]
  (fs/linkSync from to)
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

(defn- native-constant
  [name]
  (aget (.-constants fs-ext) name))

(defn- windows?
  []
  (= "win32" (.-platform js/process)))

(defn- unsupported-flock?
  [cause]
  (contains? #{"ENOSYS" "ENOTSUP" "EOPNOTSUPP"} (.-code cause)))

(defn- acquire-unix-lock!
  [fd]
  ;; flock gives open-file-description exclusion on local filesystems, which
  ;; also protects separate descriptors in one Node process. Some NFS mounts
  ;; do not implement flock, so an unsupported-flock error is deliberately not
  ;; fatal. The mandatory whole-file F_SETLKW below is the Unix authority and
  ;; the path used by NFS implementations that support POSIX record locking.
  (try
    (fs-ext/flockSync fd "ex")
    (catch :default cause
      (when-not (unsupported-flock? cause)
        (throw cause))))
  (fs-ext/fcntlSync fd "setlkw" (native-constant "F_WRLCK") 0 0))

(defn- acquire-native-lock!
  [fd]
  (if (windows?)
    ;; Lock the complete 64-bit byte range. LockFileEx permits locking beyond
    ;; EOF, so future appends remain covered by the same kernel lock.
    (fs-ext/lockFileExSync
     fd
     (native-constant "LOCKFILE_EXCLUSIVE_LOCK")
     0 0 0xffffffff 0xffffffff)
    (acquire-unix-lock! fd)))

(defn acquire-lock!
  "Open the ledger itself and hold an OS-backed exclusive lock on its inode.

   The descriptor stays open for the entire read/validate/append critical
   section. The kernel releases the lock automatically if the process exits,
   is killed, or crashes; there is no stale lockfile, lease, PID record,
   reclamation path, or fencing token to race. Hard-link and symlink aliases
   reach the same inode and therefore the same lock.

   Unix uses a whole-file blocking fcntl write lock as the mandatory lock,
   with flock as an additional local-filesystem guard when the filesystem
   supports it. Windows uses an exclusive LockFileEx range covering the full
   file address space."
  [path]
  (let [fd (fs/openSync path "a+")]
    (try
      (acquire-native-lock! fd)
      {:lock/path path :lock/fd fd}
      (catch :default cause
        (fs/closeSync fd)
        (throw cause)))))

(defn read-locked-text
  "Read the locked ledger through the same descriptor that owns the lock.
   Supplying the fd keeps Node from opening a second descriptor while the
   POSIX record lock is held."
  [{:lock/keys [fd]}]
  (fs/readFileSync fd "utf8"))

(defn append-locked-text!
  "Append through the descriptor that owns the kernel lock."
  [{:lock/keys [fd path]} text]
  (fs/appendFileSync fd text "utf8")
  path)

(defn release-lock!
  "Close the owning descriptor. Kernel file locks are released by close even
   when the holder is unwinding from an exception."
  [{:lock/keys [fd]}]
  (fs/closeSync fd)
  nil)
