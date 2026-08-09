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

(defn- acquire-native-lock!
  [fd]
  (if (windows?)
    ;; Lock the complete 64-bit byte range. LockFileEx permits locking beyond
    ;; EOF, so future appends remain covered by the same kernel lock.
    (fs-ext/lockFileExSync
     fd
     (native-constant "LOCKFILE_EXCLUSIVE_LOCK")
     0 0 0xffffffff 0xffffffff)
    (do
      ;; flock is tied to the open file description, so separate descriptors
      ;; in this process still exclude one another. fcntl adds POSIX record
      ;; locking for filesystems such as NFS that participate in fcntl locks.
      ;; Every Clio writer takes both in this order.
      (fs-ext/flockSync fd "ex")
      (fs-ext/fcntlSync fd "setlkw" (native-constant "F_WRLCK") 0 0))))

(defn acquire-lock!
  "Open the ledger itself and hold an OS-backed exclusive lock on its inode.

   The descriptor stays open for the entire read/validate/append critical
   section. The kernel releases the lock automatically if the process exits,
   is killed, or crashes; there is no stale lockfile, lease, PID record,
   reclamation path, or fencing token to race. Hard-link and symlink aliases
   reach the same inode and therefore the same lock.

   Unix takes flock plus a whole-file blocking fcntl write lock. flock gives
   open-file-description exclusion (including separate descriptors in one
   process); fcntl provides the network-filesystem coordination path used by
   NFS implementations that support POSIX record locking. Windows uses an
   exclusive LockFileEx range covering the full file address space."
  [path]
  (let [fd (fs/openSync path "a+")]
    (try
      (acquire-native-lock! fd)
      {:lock/path path :lock/fd fd}
      (catch :default cause
        (fs/closeSync fd)
        (throw cause)))))

(defn read-locked-text
  "Read the entire locked ledger through the descriptor that owns the lock.
   This intentionally avoids opening and closing a second descriptor while a
   POSIX fcntl lock is held."
  [{:lock/keys [fd]}]
  (let [size (.-size (fs/fstatSync fd))
        buffer (js/Buffer.alloc size)
        bytes-read (if (zero? size)
                     0
                     (fs/readSync fd buffer 0 size 0))]
    (.toString buffer "utf8" 0 bytes-read)))

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
