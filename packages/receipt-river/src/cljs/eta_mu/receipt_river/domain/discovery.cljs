(ns eta-mu.receipt-river.domain.discovery
  "Pure repository discovery classification and inventory projections."
  (:require [clojure.set :as set]
            [clojure.string :as str]))

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

(defn excluded?
  [path patterns glob-match?]
  (boolean
   (or glob-match?
       (some (fn [pattern]
               (or (= path pattern)
                   (str/starts-with? path (str pattern "/"))))
             patterns))))

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
        current-paths (->> (:repositories current)
                           (group-by :repository/id)
                           (map (fn [[repository-id repositories]]
                                  [repository-id
                                   (set (map :repository/path repositories))]))
                           (into {}))
        location-observations
        (mapcat
         (fn [[repository-id new-paths]]
           (let [old-paths (get previous-paths repository-id #{})
                 added-paths (set/difference new-paths old-paths)
                 removed-paths (set/difference old-paths new-paths)
                 retained-paths (set/intersection old-paths new-paths)
                 move-pairs (map vector
                                 (sort removed-paths)
                                 (sort added-paths))
                 moved-paths (set (map second move-pairs))
                 clone-paths (sort (set/difference added-paths moved-paths))
                 existing-paths (-> retained-paths
                                    (set/union moved-paths)
                                    sort
                                    vec)
                 moves (map (fn [[old-path new-path]]
                              {:observation/type :repository-moved
                               :repository/id repository-id
                               :previous-paths [old-path]
                               :path new-path})
                            move-pairs)
                 clones (map (fn [new-path]
                               {:observation/type :repository-clone-added
                                :repository/id repository-id
                                :existing-paths existing-paths
                                :path new-path})
                             clone-paths)]
             (if (seq old-paths)
               (concat moves clones)
               [])))
         current-paths)]
    (update current :observations into location-observations)))
