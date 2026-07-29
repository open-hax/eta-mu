(ns eta-mu.receipt-river.discovery-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.receipt-river.archaeology.provider :as provider]
            [eta-mu.receipt-river.domain.discovery :as discovery]
            [eta-mu.receipt-river.extern.git :as git]
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
  (is (= :submodule
         (discovery/git-marker-kind {:git-marker :file
                                     :gitdir "gitdir: ../.git/modules/sub"})))
  (testing "a repository living under a directory named modules stays a worktree"
    (is (= :linked-worktree
           (discovery/git-marker-kind
            {:git-marker :file
             :gitdir "gitdir: /repo/modules/main/.git/worktrees/w1"}))))
  (is (= :bare (discovery/git-marker-kind {:bare? true}))))

(deftest git-dir-verification-test
  (testing "bare candidates are already confirmed by the structural Git probe"
    (is (discovery/verified-git-dir? {:bare? true} nil)))
  (testing "a failed probe never yields a repository row"
    (is (not (discovery/verified-git-dir? {:git-marker :directory} nil)))
    (is (not (discovery/verified-git-dir? {:git-marker :file} ""))))
  (testing "a directory marker must resolve Git at the candidate itself"
    (is (discovery/verified-git-dir? {:git-marker :directory} ".git\n"))
    (is (not (discovery/verified-git-dir? {:git-marker :directory}
                                          "/enclosing/repo/.git"))))
  (testing "marker files resolve metadata elsewhere without escalating"
    (is (discovery/verified-git-dir? {:git-marker :file}
                                     "/repo/.git/worktrees/w1"))))

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

(deftest simultaneous-move-and-clone-observation-test
  (let [previous {:repositories [{:repository/id "r1"
                                  :repository/path "/old/repo"}
                                 {:repository/id "r1"
                                  :repository/path "/retained/clone"}]}
        current {:repositories [{:repository/id "r1"
                                 :repository/path "/a-new/repo"}
                                {:repository/id "r1"
                                 :repository/path "/retained/clone"}
                                {:repository/id "r1"
                                 :repository/path "/z-new/clone"}]
                 :observations []}
        result (discovery/observe-moves previous current)]
    (is (= [{:observation/type :repository-moved
             :repository/id "r1"
             :previous-paths ["/old/repo"]
             :path "/a-new/repo"}
            {:observation/type :repository-clone-added
             :repository/id "r1"
             :existing-paths ["/a-new/repo" "/retained/clone"]
             :path "/z-new/clone"}]
           (:observations result)))))

(deftest signaled-git-close-is-failure-test
  (is (= {:exit 1
          :signal "SIGTERM"
          :stdout "partial"
          :stderr ""}
         (git/close-result nil "SIGTERM" " partial\n" ""))))

(deftest ^:async trailing-globstar-excludes-repository-root-test
  (let [root (.mkdtempSync fs (path/join (.tmpdir os)
                                         "eta-mu-discovery-exclude-"))
        included (path/join root "included")
        excluded (path/join root "cache")]
    (try
      (doseq [repository [included excluded]]
        (let [{:keys [exit stderr]}
              (await (git/exec-at root ["init" "-q" repository]))]
          (is (zero? exit) stderr)))
      (let [inventory (await (provider/discover-repositories
                              (local-git/local-git-provider)
                              [root]
                              {:exclude ["**/cache/**"]}))]
        (is (= [included]
               (mapv :repository/path (:repositories inventory)))))
      (finally
        (.rmSync fs root #js {:recursive true :force true})))))

(deftest ^:async repository-enrichment-has-bounded-concurrency-test
  (let [root (.mkdtempSync fs (path/join (.tmpdir os)
                                         "eta-mu-discovery-bounded-"))
        in-flight (atom 0)
        maximum-in-flight (atom 0)
        delayed-git
        (fn [_path args]
          (let [active (swap! in-flight inc)
                stdout (if (= ["rev-parse" "--git-dir"] (vec args))
                         ".git"
                         "value")]
            (swap! maximum-in-flight max active)
            (js/Promise.
             (fn [resolve _reject]
               (js/setTimeout
                (fn []
                  (swap! in-flight dec)
                  (resolve {:exit 0
                            :signal nil
                            :stdout stdout
                            :stderr ""}))
                5)))))]
    (try
      (doseq [index (range 9)]
        (.mkdirSync fs
                    (path/join root (str "repo-" index) ".git")
                    #js {:recursive true}))
      (with-redefs [git/exec-at delayed-git]
        (let [inventory (await (provider/discover-repositories
                                (local-git/local-git-provider)
                                [root]
                                {:exclude []}))]
          (is (= 9 (count (:repositories inventory))))
          (is (<= @maximum-in-flight 24))
          (is (> @maximum-in-flight 5))))
      (finally
        (.rmSync fs root #js {:recursive true :force true})))))

(deftest ^:async safe-filesystem-discovery-test
  (testing "normal, linked, submodule, bare, nested, and symlink shapes are inventoried safely"
    (let [root (.mkdtempSync fs (path/join (.tmpdir os) "eta-mu-discovery-"))
          normal (path/join root "normal")
          nested (path/join normal "nested")
          linked (path/join root "linked")
          submodule (path/join root "submodule")
          submodule-gitdir (path/join normal ".git" "modules" "submodule")
          bare (path/join root "bare.git")
          fake-loose-repo (path/join bare "objects" "fake-loose-repo")
          fake-bare (path/join root "not-a-bare-repository")
          fake-marker (path/join normal "empty-marker")
          cycle (path/join root "cycle")]
      (try
        (doseq [[cwd args] [[root ["init" "-q" normal]]
                            [normal ["-c" "user.email=tests@eta-mu"
                                     "-c" "user.name=eta-mu tests"
                                     "commit" "--allow-empty" "-q" "-m" "root"]]
                            [root ["init" "-q" nested]]
                            [normal ["worktree" "add" "-q" linked]]
                            [root ["init" "--bare" "-q" bare]]]]
          (let [{:keys [exit stderr]} (await (git/exec-at cwd args))]
            (is (zero? exit) stderr)))
        (.mkdirSync fs (path/join normal ".git" "modules") #js {:recursive true})
        (let [{:keys [exit stderr]}
              (await (git/exec-at root ["init" "-q"
                                        (str "--separate-git-dir="
                                             submodule-gitdir)
                                        submodule]))]
          (is (zero? exit) stderr))
        (doseq [directory [(path/join fake-loose-repo ".git")
                           (path/join fake-bare "objects")
                           (path/join fake-bare "refs")
                           (path/join fake-marker ".git")]]
          (.mkdirSync fs directory #js {:recursive true}))
        (.writeFileSync fs (path/join fake-bare "HEAD")
                        "ref: refs/heads/main\n")
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
          (is (not-any? #(= fake-bare (:repository/path %))
                        (:repositories inventory)))
          (is (not-any? #(str/starts-with? (:repository/path %)
                                           (path/join bare "objects"))
                        (:repositories inventory)))
          (testing "an empty .git directory inside a repository is not a repository"
            (is (not-any? #(= fake-marker (:repository/path %))
                          (:repositories inventory)))
            (is (some #(and (= :unverified-git-marker (:observation/type %))
                            (= fake-marker (:path %)))
                      (:observations inventory))))
          (is (some #(= :symlink-not-followed (:observation/type %))
                    (:observations inventory))))
        (finally
          (.rmSync fs root #js {:recursive true :force true}))))))
