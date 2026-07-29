(ns eta-mu.receipt-river.discovery-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.receipt-river.archaeology.provider :as provider]
            [eta-mu.receipt-river.domain.discovery :as discovery]
            [eta-mu.receipt-river.extern.glob :as glob]
            [eta-mu.receipt-river.infra.local-git-provider :as local-git]))

(deftest marker-classification-test
  (is (= :repository
         (discovery/git-marker-kind {:git-marker :directory})))
  (is (= :linked-worktree
         (discovery/git-marker-kind {:git-marker :file
                                     :gitdir "gitdir: /repo/.git/worktrees/w1"})))
  (is (= :submodule
         (discovery/git-marker-kind {:git-marker :file
                                     :gitdir "gitdir: /repo/.git/modules/sub"})))
  (is (= :bare (discovery/git-marker-kind {:bare? true}))))

(deftest relationship-projection-test
  (let [repositories [{:repository/id "r1" :git/common-dir "/repo/.git"
                       :worktree/id "w1"}
                      {:repository/id "r1" :git/common-dir "/repo/.git"
                       :worktree/id "w2"}
                      {:repository/id "r2" :clone/id "c1"
                       :repository/path "/clone"
                       :git/common-dir "/clone/.git"}
                      {:repository/id "r2" :clone/id "c2"
                       :repository/path "/copy"
                       :git/common-dir "/copy/.git"}]
        types (set (map :relationship/type
                        (discovery/relationship-groups repositories)))]
    (is (contains? types :shared-history))
    (is (contains? types :duplicate-clones))))

(deftest exclusion-boundary-test
  (testing "domain exclusion consumes a shaped host-match result"
    (is (discovery/excluded? "/repo/node_modules/pkg"
                             ["/repo/node_modules"]
                             false))
    (is (discovery/excluded? "/repo/build/cache/file"
                             ["**/cache/**"]
                             (glob/matches-any? "/repo/build/cache/file"
                                                ["**/cache/**"])))
    (is (glob/matches-any? "/repo/cache/a.edn"
                           ["/repo/cache/?.edn"]))
    (is (false? (glob/matches-any? "/repo/cache/ab.edn"
                                   ["/repo/cache/?.edn"])))
    (is (false? (glob/matches-any? "/repo/cache/.edn"
                                   ["/repo/cache/?.edn"])))
    (is (glob/matches-any? "/root/cache" ["**/cache/**"]))
    (is (glob/matches-any? "/root/cache/repository" ["**/cache/**"]))
    (is (glob/matches-any? "cache" ["**/cache/**"]))
    (is (false? (glob/matches-any? "/root/cacheable" ["**/cache/**"])))
    (is (false? (discovery/excluded? "/repo/src/cache.cljs"
                                     ["**/cache/**"]
                                     (glob/matches-any? "/repo/src/cache.cljs"
                                                        ["**/cache/**"]))))))

(deftest moved-repository-observation-test
  (let [previous {:repositories [{:repository/id "r1"
                                  :repository/path "/old/repo"}]}
        current {:repositories [{:repository/id "r1"
                                 :repository/path "/new/repo"}]
                 :observations []}
        result (discovery/observe-moves previous current)]
    (is (= [{:observation/type :repository-moved
             :repository/id "r1"
             :previous-paths ["/old/repo"]
             :path "/new/repo"}]
           (:observations result)))))

(deftest clone-added-observation-test
  (let [previous {:repositories [{:repository/id "r1"
                                  :repository/path "/existing/repo"}]}
        current {:repositories [{:repository/id "r1"
                                 :repository/path "/existing/repo"}
                                {:repository/id "r1"
                                 :repository/path "/new/clone"}]
                 :observations []}
        result (discovery/observe-moves previous current)]
    (is (= [{:observation/type :repository-clone-added
             :repository/id "r1"
             :existing-paths ["/existing/repo"]
             :path "/new/clone"}]
           (:observations result)))))

(deftest moved-repository-uses-disappeared-paths-test
  (let [previous {:repositories [{:repository/id "r1"
                                  :repository/path "/old/repo"}
                                 {:repository/id "r1"
                                  :repository/path "/retained/clone"}]}
        current {:repositories [{:repository/id "r1"
                                 :repository/path "/new/repo"}
                                {:repository/id "r1"
                                 :repository/path "/retained/clone"}]
                 :observations []}
        result (discovery/observe-moves previous current)]
    (is (= [{:observation/type :repository-moved
             :repository/id "r1"
             :previous-paths ["/old/repo"]
             :path "/new/repo"}]
           (:observations result)))))

(deftest ^:async trailing-globstar-excludes-repository-root-test
  (let [root (.mkdtempSync fs (path/join (.tmpdir os)
                                         "eta-mu-discovery-exclude-"))
        included (path/join root "included")
        excluded (path/join root "cache")]
    (try
      (doseq [repository [included excluded]]
        (.mkdirSync fs (path/join repository ".git") #js {:recursive true}))
      (let [inventory (await (provider/discover-repositories
                              (local-git/local-git-provider)
                              [root]
                              {:exclude ["**/cache/**"]}))]
        (is (= [included]
               (mapv :repository/path (:repositories inventory)))))
      (finally
        (.rmSync fs root #js {:recursive true :force true})))))

(deftest ^:async safe-filesystem-discovery-test
  (testing "normal, linked, submodule, bare, nested, and symlink shapes are inventoried safely"
    (let [root (.mkdtempSync fs (path/join (.tmpdir os) "eta-mu-discovery-"))
          normal (path/join root "normal")
          nested (path/join normal "nested")
          linked (path/join root "linked")
          submodule (path/join root "submodule")
          bare (path/join root "bare.git")
          fake-loose-repo (path/join bare "objects" "fake-loose-repo")
          cycle (path/join root "cycle")]
      (try
        (doseq [directory [normal nested linked submodule
                           (path/join bare "objects")
                           (path/join bare "refs")
                           (path/join fake-loose-repo ".git")]]
          (.mkdirSync fs directory #js {:recursive true}))
        (.mkdirSync fs (path/join normal ".git"))
        (.mkdirSync fs (path/join nested ".git"))
        (.writeFileSync fs (path/join linked ".git")
                        "gitdir: /missing/.git/worktrees/linked\n")
        (.writeFileSync fs (path/join submodule ".git")
                        "gitdir: /missing/.git/modules/submodule\n")
        (.writeFileSync fs (path/join bare "HEAD") "ref: refs/heads/main\n")
        (.symlinkSync fs root cycle "dir")
        (let [inventory (await (provider/discover-repositories
                                (local-git/local-git-provider)
                                [root]
                                {:exclude []}))
              kinds (set (map :repository/kind (:repositories inventory)))]
          (is (contains? kinds :repository))
          (is (contains? kinds :linked-worktree))
          (is (contains? kinds :submodule))
          (is (contains? kinds :bare))
          (is (= 5 (count (:repositories inventory))))
          (is (not-any? #(str/starts-with? (:repository/path %)
                                           (path/join bare "objects"))
                        (:repositories inventory)))
          (is (some #(= :symlink-not-followed (:observation/type %))
                    (:observations inventory))))
        (finally
          (.rmSync fs root #js {:recursive true :force true}))))))
