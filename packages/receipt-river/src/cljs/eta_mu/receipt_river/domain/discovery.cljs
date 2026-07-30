(ns eta-mu.receipt-river.domain.discovery
  "Pure repository discovery classification and inventory projections."
  (:require [clojure.set :as set]
            [clojure.string :as str]))

(def default-excluded-dir-names
  #{".cache" ".git" "node_modules"})

(defn submodule-gitdir?
  "Recognize a submodule marker by its `.git/modules/` metadata structure rather
  than by any ancestor directory that happens to be named `modules`."
  [gitdir]
  (let [target (-> (or gitdir "")
                   (str/replace #"^gitdir:\s*" "")
                   str/trim)]
    (or (str/includes? target "/.git/modules/")
        (str/starts-with? target ".git/modules/"))))

(defn git-marker-kind
  [{:keys [git-marker bare? gitdir]}]
  (cond
    bare? :bare
    (= :directory git-marker) :repository
    (and (= :file git-marker) (submodule-gitdir? gitdir)) :submodule
    (= :file git-marker) :linked-worktree
    :else nil))

(defn verified-git-dir?
  "Confirm that a `git rev-parse --git-dir` probe found the candidate's own
  metadata instead of failing or escalating to an enclosing repository.

  Bare candidates are already confirmed structurally and by Git. A directory
  marker is authoritative only when Git resolves the repository at the candidate
  itself, which it reports as the relative `.git`. A `.git` file marker resolves
  to metadata living elsewhere, and Git refuses to escalate past a marker file,
  so a successful probe is conclusive."
  [{:keys [git-marker bare?]} git-dir]
  (cond
    bare? true
    (str/blank? git-dir) false
    (= :directory git-marker) (= ".git" (str/trim git-dir))
    :else true))

(defn excluded?
  [path patterns glob-match?]
  (boolean
   (or glob-match?
       (some (fn [pattern]
               (or (= path pattern)
                   (str/starts-with? path (str pattern "/"))))
             patterns))))

(defn- primary-clone-row
  [rows]
  (first
   (sort-by
    (juxt #(if (= :linked-worktree (:repository/kind %)) 1 0)
          :repository/path)
    rows)))

(defn relationship-groups
  "Identify worktrees sharing object storage and distinct clones sharing a remote."
  [repositories]
  (let [shared (->> repositories
                    (filter :git/common-dir)
                    (group-by :git/common-dir)
                    (keep (fn [[common-dir repos]]
                            (let [worktrees (->> repos
                                                (keep :worktree/id)
                                                distinct
                                                sort
                                                vec)]
                              (when (> (count worktrees) 1)
                                {:relationship/type :shared-history
                                 :git/common-dir common-dir
                                 :repository/id (:repository/id (first repos))
                                 :worktrees worktrees})))))
        clones (->> repositories
                    (group-by :repository/id)
                    (keep
                     (fn [[repository-id repos]]
                       (let [clone-rows (->> repos
                                             (filter :clone/id)
                                             (group-by :clone/id)
                                             (map (fn [[clone-id rows]]
                                                    [clone-id
                                                     (primary-clone-row rows)]))
                                             (sort-by first)
                                             vec)]
                         (when (> (count clone-rows) 1)
                           {:relationship/type :duplicate-clones
                            :repository/id repository-id
                            :clones (mapv first clone-rows)
                            :locations (mapv (comp :repository/path second)
                                             clone-rows)})))))]
    (vec (concat shared clones))))

(defn inventory
  [roots exclusions repositories observations]
  {:inventory/version 1
   :provider/id :local-git
   :roots (vec roots)
   :exclusions (vec exclusions)
   :repositories (vec repositories)
   :relationships (relationship-groups repositories)
   :observations (vec observations)})

(defn- path-set
  [rows]
  (set (map :repository/path rows)))

(defn- rows-by
  [key-fn rows]
  (group-by key-fn rows))

(defn- clone-added-observation
  [repository-id existing-paths row]
  {:observation/type :repository-clone-added
   :repository/id repository-id
   :clone/id (:clone/id row)
   :existing-paths (vec (sort existing-paths))
   :path (:repository/path row)})

(defn- worktree-added-observation
  [repository-id clone-id existing-paths row]
  {:observation/type :repository-worktree-added
   :repository/id repository-id
   :clone/id clone-id
   :worktree/id (:worktree/id row)
   :existing-paths (vec (sort existing-paths))
   :path (:repository/path row)})

(defn- worktree-moved-observation
  [repository-id clone-id old-row new-row]
  {:observation/type :repository-worktree-moved
   :repository/id repository-id
   :clone/id clone-id
   :worktree/id (:worktree/id new-row)
   :previous-paths [(:repository/path old-row)]
   :path (:repository/path new-row)})

(defn- ambiguous-location-observation
  [observation-type repository-id previous-paths paths extra]
  (merge
   {:observation/type observation-type
    :repository/id repository-id
    :previous-paths (vec (sort previous-paths))
    :paths (vec (sort paths))}
   extra))

(defn- worktree-observations
  [repository-id clone-id old-rows new-rows]
  (let [old-paths (path-set old-rows)
        new-paths (path-set new-rows)
        added-paths (set/difference new-paths old-paths)
        removed-paths (set/difference old-paths new-paths)
        retained-paths (set/intersection old-paths new-paths)
        old-by-path (rows-by :repository/path old-rows)
        new-by-path (rows-by :repository/path new-rows)]
    (cond
      (and (= 1 (count removed-paths))
           (= 1 (count added-paths)))
      [(worktree-moved-observation
        repository-id
        clone-id
        (first (get old-by-path (first removed-paths)))
        (first (get new-by-path (first added-paths))))]

      (and (empty? removed-paths)
           (seq added-paths))
      (mapv #(worktree-added-observation
              repository-id
              clone-id
              retained-paths
              (first (get new-by-path %)))
            (sort added-paths))

      (or (seq removed-paths)
          (seq added-paths))
      [(ambiguous-location-observation
        :repository-worktree-location-change-ambiguous
        repository-id
        removed-paths
        added-paths
        {:clone/id clone-id})]

      :else
      [])))

(defn- identity-observations
  [repository-id old-rows new-rows]
  (let [old-by-clone (rows-by :clone/id old-rows)
        new-by-clone (rows-by :clone/id new-rows)
        old-clones (set (keys old-by-clone))
        new-clones (set (keys new-by-clone))
        retained-clones (set/intersection old-clones new-clones)
        removed-clones (set/difference old-clones new-clones)
        added-clones (set/difference new-clones old-clones)
        retained-observations
        (mapcat
         (fn [clone-id]
           (worktree-observations repository-id
                                  clone-id
                                  (get old-by-clone clone-id)
                                  (get new-by-clone clone-id)))
         (sort retained-clones))
        existing-paths (->> retained-clones
                            (mapcat #(path-set (get new-by-clone %)))
                            set)
        clone-transition
        (cond
          (and (= 1 (count removed-clones))
               (= 1 (count added-clones))
               (= 1 (count (get old-by-clone (first removed-clones))))
               (= 1 (count (get new-by-clone (first added-clones)))))
          (let [old-row (first (get old-by-clone (first removed-clones)))
                new-row (first (get new-by-clone (first added-clones)))]
            [{:observation/type :repository-moved
              :repository/id repository-id
              :previous-paths [(:repository/path old-row)]
              :path (:repository/path new-row)}])

          (and (seq removed-clones)
               (seq added-clones))
          [(ambiguous-location-observation
            :repository-location-change-ambiguous
            repository-id
            (mapcat #(path-set (get old-by-clone %)) removed-clones)
            (mapcat #(path-set (get new-by-clone %)) added-clones)
            {})]

          (seq added-clones)
          (mapv
           (fn [clone-id]
             (clone-added-observation
              repository-id
              existing-paths
              (primary-clone-row (get new-by-clone clone-id))))
           (sort added-clones))

          :else
          [])]
    (concat retained-observations clone-transition)))

(defn- legacy-location-observations
  [repository-id old-rows new-rows]
  (let [old-paths (path-set old-rows)
        new-paths (path-set new-rows)
        added-paths (set/difference new-paths old-paths)
        removed-paths (set/difference old-paths new-paths)
        retained-paths (set/intersection old-paths new-paths)]
    (cond
      (and (= 1 (count removed-paths))
           (= 1 (count added-paths)))
      [{:observation/type :repository-moved
        :repository/id repository-id
        :previous-paths [(first removed-paths)]
        :path (first added-paths)}]

      (and (seq removed-paths)
           (seq added-paths))
      [(ambiguous-location-observation
        :repository-location-change-ambiguous
        repository-id
        removed-paths
        added-paths
        {})]

      (and (empty? removed-paths)
           (seq added-paths))
      (mapv (fn [path]
              {:observation/type :repository-clone-added
               :repository/id repository-id
               :existing-paths (vec (sort retained-paths))
               :path path})
            (sort added-paths))

      :else
      [])))

(defn observe-moves
  "Compare two provider-independent inventories and record repository locations
  that changed while logical repository identity remained stable.

  Clone and worktree identities are used when present. Ambiguous path changes are
  reported explicitly rather than inventing causality from lexical path order."
  [previous current]
  (let [previous-by-repository (rows-by :repository/id (:repositories previous))
        current-by-repository (rows-by :repository/id (:repositories current))
        location-observations
        (mapcat
         (fn [[repository-id new-rows]]
           (let [old-rows (get previous-by-repository repository-id [])]
             (when (seq old-rows)
               (if (every? :clone/id (concat old-rows new-rows))
                 (identity-observations repository-id old-rows new-rows)
                 (legacy-location-observations repository-id old-rows new-rows)))))
         (sort-by key current-by-repository))]
    (update current :observations into location-observations)))
