(ns eta-mu.gitops-controller.extern.fs
  "Narrow durable-filesystem boundary."
  (:require ["node:crypto" :as crypto]
            ["node:fs/promises" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn join [& parts]
  (.apply (.-join path) path (to-array parts)))

(defn basename [value]
  (.basename path value))

(defn dirname [value]
  (.dirname path value))

(defn ^:async ensure-directory! [directory]
  (await (.mkdir fs directory #js {:recursive true})))

(defn ^:async read-text [file]
  (await (.readFile fs file "utf8")))

(defn ^:async read-optional-text [file]
  (try
    (await (read-text file))
    (catch :default error
      (if (= "ENOENT" (.-code error))
        nil
        (throw error)))))

(defn ^:async read-secret-file [file]
  (.trim (await (read-text file))))

(defn ^:async sync-directory! [directory]
  (let [handle (await (.open fs directory "r"))]
    (try
      (await (.sync handle))
      (finally
        (await (.close handle))))))

(defn- temporary-publication-file [file]
  (join (dirname file)
        (str "." (basename file) "." (.-pid js/process) "."
             (.randomUUID crypto) ".tmp")))

(defn ^:async remove-file-if-present! [file]
  (try
    (await (.unlink fs file))
    true
    (catch :default error
      (if (= "ENOENT" (.-code error))
        false
        (throw error)))))

(defn ^:async write-exclusive!
  "Durably publish complete immutable bytes without ever exposing a partial
  destination. A same-directory hard link supplies atomic no-replace semantics."
  [file contents]
  (let [directory (dirname file)
        temporary-file (temporary-publication-file file)]
    (try
      (let [handle (await (.open fs temporary-file "wx"))]
        (try
          (await (.writeFile handle contents))
          (await (.sync handle))
          (finally
            (await (.close handle)))))
      (try
        (await (.link fs temporary-file file))
        (await (sync-directory! directory))
        true
        (catch :default error
          (if (= "EEXIST" (.-code error))
            false
            (throw error))))
      (finally
        (when (await (remove-file-if-present! temporary-file))
          (await (sync-directory! directory)))))))

(defn ^:async durable-writable? [directory]
  (let [probe (join directory
                    (str ".eta-mu-readiness." (.randomUUID crypto) ".probe"))]
    (try
      (let [created? (await (write-exclusive! probe "ready\n"))]
        (when-not created?
          (throw (ex-info "readiness probe path already exists"
                          {:directory directory})))
        (await (remove-file-if-present! probe))
        (await (sync-directory! directory))
        true)
      (catch :default _
        false))))

(defn- ^:async assert-append-boundary! [file]
  (try
    (let [handle (await (.open fs file "r"))]
      (try
        (let [size (.-size (await (.stat handle)))]
          (when (pos? size)
            (let [last-byte (js/Buffer.alloc 1)
                  result (await (.read handle last-byte 0 1 (dec size)))]
              (when-not (and (= 1 (.-bytesRead result))
                             (= 10 (aget last-byte 0)))
                (throw
                 (ex-info "append-only ledger has an unterminated final line"
                          {:error/code :unterminated-ledger-tail
                           :file file}))))))
        (finally
          (await (.close handle)))))
    (catch :default error
      (when-not (= "ENOENT" (.-code error))
        (throw error)))))

(defn- ^:async write-all! [handle bytes]
  (loop [offset 0]
    (when (< offset (.-length bytes))
      (let [result (await (.write handle bytes offset
                                  (- (.-length bytes) offset) nil))
            written (.-bytesWritten result)]
        (when-not (pos? written)
          (throw (ex-info "durable append made no forward progress"
                          {:error/code :durable-append-stalled})))
        (recur (+ offset written))))))

(defn ^:async append-line!
  "Append one fsynced LF-terminated record. The caller must preserve the
  controller's single-writer invariant; the boundary check prevents a live
  process from appending behind a torn record that only startup may repair."
  [file line]
  (when (or (.includes line "\n") (.includes line "\r"))
    (throw (ex-info "append-only ledger records must occupy exactly one line"
                    {:error/code :invalid-ledger-line})))
  (await (assert-append-boundary! file))
  (let [handle (await (.open fs file "a"))
        bytes (js/Buffer.from (str line "\n") "utf8")]
    (try
      (await (write-all! handle bytes))
      (await (.sync handle))
      (finally
        (await (.close handle)))))
  (await (sync-directory! (dirname file))))

(defn ^:async read-complete-text!
  "Read a newline-delimited file. When explicitly enabled for startup, an
  unterminated final byte range is first durably quarantined and then removed.
  Complete corrupt records are deliberately left to the parser to reject."
  [file repair-unterminated-tail?]
  (let [bytes (await (.readFile fs file))
        length (.-length bytes)]
    (cond
      (zero? length)
      {:text "" :repaired? false}

      (= 10 (aget bytes (dec length)))
      {:text (.toString bytes "utf8") :repaired? false}

      (not repair-unterminated-tail?)
      (throw (ex-info "append-only ledger has an unterminated final line"
                      {:error/code :unterminated-ledger-tail
                       :file file}))

      :else
      (let [last-newline (.lastIndexOf bytes 10)
            complete-length (inc last-newline)
            complete-bytes (.subarray bytes 0 complete-length)
            tail (.subarray bytes complete-length)
            quarantine-file
            (join (dirname file)
                  (str "." (basename file) ".unterminated-tail."
                       (.randomUUID crypto) ".bin"))]
        (when-not (await (write-exclusive! quarantine-file tail))
          (throw (ex-info "unterminated ledger quarantine already exists"
                          {:error/code :ledger-quarantine-conflict
                           :file file})))
        (let [handle (await (.open fs file "r+"))]
          (try
            (await (.truncate handle complete-length))
            (await (.sync handle))
            (finally
              (await (.close handle)))))
        (await (sync-directory! (dirname file)))
        {:text (.toString complete-bytes "utf8")
         :repaired? true
         :quarantine-file quarantine-file}))))

(defn ^:async durable-appendable?
  "Prove an append-only file can be opened and fsynced without adding evidence.
  Opening with `a` also creates a missing ledger before readiness is reported."
  [file]
  (try
    (await (assert-append-boundary! file))
    (let [handle (await (.open fs file "a"))]
      (try
        (await (.sync handle))
        (finally
          (await (.close handle)))))
    (await (sync-directory! (dirname file)))
    true
    (catch :default _
      false)))

(defn ^:async entries [directory]
  (-> (await (.readdir fs directory)) array-seq vec))

(defn ^:async path-exists? [file]
  (try
    (await (.access fs file))
    true
    (catch :default error
      (if (= "ENOENT" (.-code error))
        false
        (throw error)))))

(defn ^:async writable? [directory]
  (try
    (await (.access fs directory (.-W_OK (.-constants fs))))
    true
    (catch :default _ false)))

(defn ^:async temporary-directory! []
  (await (.mkdtemp fs (join (.tmpdir os) "eta-mu-gitops-controller-"))))

(defn ^:async remove-tree! [directory]
  (await (.rm fs directory #js {:recursive true :force true})))
