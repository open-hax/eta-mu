(ns eta-mu.receipt-river.infra.local-git-provider
  "Lightweight local-Git archaeology provider.

  Discovery never follows symlinks and records inaccessible paths as
  observations. Git metadata directories are recognized but never traversed."
  (:require [clojure.string :as str]
            [eta-mu.receipt-river.archaeology.provider :as provider]
            [eta-mu.receipt-river.domain.discovery :as discovery]
            [eta-mu.receipt-river.extern.crypto :as crypto]
            [eta-mu.receipt-river.extern.fs :as fs]
            [eta-mu.receipt-river.extern.glob :as glob]
            [eta-mu.receipt-river.extern.git :as git]
            [eta-mu.receipt-river.extern.runtime :as runtime]))

(defn- stable-id [value]
  (crypto/short-sha256 value 24))

(defn- marker [path]
  (let [git-path (fs/join path ".git")
        bare? (and (fs/path-exists? (fs/join path "HEAD"))
                   (fs/path-exists? (fs/join path "objects"))
                   (fs/path-exists? (fs/join path "refs")))]
    (cond
      bare? {:path path :bare? true}
      (not (fs/path-exists? git-path)) nil
      (fs/directory? git-path) {:path path :git-marker :directory}
      :else {:path path
             :git-marker :file
             :gitdir (str/trim (fs/read-text git-path))})))

(defn- scan-root
  [root exclusions]
  (let [candidates (atom [])
        observations (atom [])]
    ((fn walk! [path]
       (try
         (cond
           (discovery/excluded? path
                                exclusions
                                (glob/matches-any? path exclusions))
           nil

           (fs/symbolic-link? path)
           (swap! observations conj
                  {:observation/type :symlink-not-followed :path path})

           (fs/directory? path)
           (let [candidate (marker path)]
             (when candidate
               (swap! candidates conj candidate))
             (when-not (:bare? candidate)
               (doseq [name (fs/entries path)]
                 (when-not (contains? discovery/default-excluded-dir-names name)
                   (walk! (fs/join path name))))))

           :else nil)
         (catch :default error
           (swap! observations conj
                  {:observation/type :inaccessible
                   :path path
                   :message (ex-message error)}))))
     root)
    {:candidates @candidates :observations @observations}))

(defn- ^:async git-value [path args]
  (let [{:keys [exit stdout]} (await (git/exec-at path args))]
    (when (zero? exit) stdout)))

(defn- ^:async enrich [candidate]
  (let [path (:path candidate)
        kind (discovery/git-marker-kind candidate)
        [common-dir head root-commits remote toplevel]
        (await
         (runtime/await-all
          [(git-value path ["rev-parse" "--path-format=absolute"
                            "--git-common-dir"])
           (git-value path ["rev-parse" "HEAD"])
           (git-value path ["rev-list" "--max-parents=0" "HEAD"])
           (git-value path ["remote" "get-url" "origin"])
           (git-value path ["rev-parse" "--show-toplevel"])]))
        worktree-path (or toplevel path)
        identity-source (or remote root-commits common-dir path)]
    {:repository/id (stable-id identity-source)
     :repository/path path
     :repository/kind kind
     :repository/remote-status (if remote :configured :absent)
     :clone/id (stable-id (or common-dir path))
     :git/remote remote
     :git/head head
     :git/root-commits root-commits
     :git/common-dir common-dir
     :worktree/id (when (not= :bare kind) (stable-id worktree-path))
     :worktree/path (when (not= :bare kind) worktree-path)
     :location/status :observed}))

(defn- unsupported [operation]
  (throw (ex-info
          (str operation " is not implemented by the first local-Git provider slice")
          {:operation operation})))

(defn- ^:async discover*
  [roots options]
  (let [exclusions (:exclude options)
        scans (mapv #(scan-root % exclusions) roots)
        candidates (->> scans (mapcat :candidates) distinct vec)
        observations (mapcat :observations scans)
        rows (await (runtime/await-all (mapv enrich candidates)))]
    (discovery/inventory
     roots exclusions rows observations)))

(defrecord LocalGitProvider []
  provider/ArchaeologyProvider
  (discover-repositories [_ roots options]
    (discover* roots options))
  (register-repository [_ path]
    (if-let [candidate (marker path)]
      (enrich candidate)
      (throw (ex-info (str "Not a Git repository: " path)
                      {:path path}))))
  (list-references [_ _] (unsupported "list-references"))
  (find-path-history [_ _ _] (unsupported "find-path-history"))
  (read-object [_ _ _] (unsupported "read-object"))
  (find-introducing-commits [_ _] (unsupported "find-introducing-commits"))
  (governing-files-at [_ _ _ _] (unsupported "governing-files-at"))
  (export-evidence-packet [_ _] (unsupported "export-evidence-packet")))

(defn local-git-provider []
  (->LocalGitProvider))
