(ns eta-mu.receipt-river.domain.discovery
  "Pure repository discovery classification and inventory projections."
  (:require [clojure.string :as str]))

(def default-excluded-dir-names
  #{".cache" ".git" "node_modules"})

(defn git-marker-kind
  [{:keys [git-marker bare? gitdir]}]
  (cond
    bare? :bare
    (= :directory git-marker) :repository
    (and (= :file git-marker) (str/includes? (or gitdir "") "/modules/")) :submodule
    (= :file git-marker) :linked-worktree
    :else nil))

(defn glob-pattern->regex
  "Compile the small glob surface used by discovery exclusions."
  [pattern]
  (let [escaped (-> pattern
                    (str/replace #"[.+^${}()|\[\]\\]" "\\$&")
                    (str/replace "**" "\u0000")
                    (str/replace "*" "[^/]*")
                    (str/replace "\u0000" ".*"))]
    (js/RegExp. (str "^" escaped "$"))))

(defn excluded?
  [path patterns]
  (boolean
   (some (fn [pattern]
           (or (= path pattern)
               (str/starts-with? path (str pattern "/"))
               (.test (glob-pattern->regex pattern) path)))
         patterns)))

(defn relationship-groups
  "Identify worktrees sharing object storage and distinct clones sharing a remote."
  [repositories]
  (let [shared (->> repositories
                    (filter :git/common-dir)
                    (group-by :git/common-dir)
                    (keep (fn [[common-dir repos]]
                            (when (> (count repos) 1)
                              {:relationship/type :shared-history
                               :git/common-dir common-dir
                               :repository/id (:repository/id (first repos))
                               :worktrees (mapv :worktree/id repos)}))))
        clones (->> repositories
                    (group-by :repository/id)
                    (keep (fn [[repository-id repos]]
                            (when (> (count (set (map :git/common-dir repos))) 1)
                              {:relationship/type :duplicate-clones
                               :repository/id repository-id
                               :clones (mapv :clone/id repos)
                               :locations (mapv :repository/path repos)}))))]
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

(defn observe-moves
  "Compare two provider-independent inventories and record repository locations
  that changed while logical repository identity remained stable."
  [previous current]
  (let [previous-paths (->> (:repositories previous)
                            (group-by :repository/id)
                            (map (fn [[repository-id repositories]]
                                   [repository-id
                                    (set (map :repository/path repositories))]))
                            (into {}))
        moved (keep (fn [repository]
                      (let [old-paths (get previous-paths
                                           (:repository/id repository))
                            current-path (:repository/path repository)]
                        (when (and (seq old-paths)
                                   (not (contains? old-paths current-path)))
                          {:observation/type :repository-moved
                           :repository/id (:repository/id repository)
                           :previous-paths (vec (sort old-paths))
                           :path current-path})))
                    (:repositories current))]
    (update current :observations into moved)))
