(ns eta-mu.receipt-river.discovery-test
  (:require [cljs.test :refer [deftest is testing]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.receipt-river.archaeology.provider :as provider]
            [eta-mu.receipt-river.domain.discovery :as discovery]
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

(deftest ^:async safe-filesystem-discovery-test
  (testing "normal, linked, submodule, bare, nested, and symlink shapes are inventoried safely"
    (let [root (.mkdtempSync fs (path/join (.tmpdir os) "eta-mu-discovery-"))
          normal (path/join root "normal")
          nested (path/join normal "nested")
          linked (path/join root "linked")
          submodule (path/join root "submodule")
          bare (path/join root "bare.git")
          cycle (path/join root "cycle")]
      (try
        (doseq [directory [normal nested linked submodule
                           (path/join bare "objects")
                           (path/join bare "refs")]]
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
          (is (some #(= :symlink-not-followed (:observation/type %))
                    (:observations inventory))))
        (finally
          (.rmSync fs root #js {:recursive true :force true}))))))
