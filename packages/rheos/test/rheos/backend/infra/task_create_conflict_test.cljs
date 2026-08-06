(ns rheos.backend.infra.task-create-conflict-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [rheos.backend.infra.task-create :as task-create]))

(defn- tmp-dir []
  (path/join (.tmpdir os)
             (str "rheos-create-conflict-test-" (.now js/Date) "-" (rand-int 100000))))

(deftest ^:async refuses-an-existing-target-without-overwriting-it
  (testing "the final write is exclusive, even when the existing file has another uuid"
    (let [dir (tmp-dir)
          tasks-dir (path/join dir "tasks")
          target (path/join tasks-dir "collision-ixeduuid.md")
          project {:id "test" :title "Test" :tasks-dir dir :meta {} :fsm :promethean}
          sentinel "existing card\n"]
      (try
        (await (.mkdir fsp tasks-dir #js {:recursive true}))
        (await (.writeFile fsp target sentinel "utf8"))
        (let [err (try
                    (await (task-create/create-task!
                            {:project project
                             :title "Collision"
                             :uuid "fixeduuid"
                             :source "test"}))
                    nil
                    (catch :default e e))]
          (is (some? err))
          (is (= :refused (:kind (ex-data err))))
          (is (= :create-conflict (:cause (ex-data err))))
          (is (= sentinel (await (.readFile fsp target "utf8")))))
        (finally
          (await (.rm fsp dir #js {:recursive true :force true})))))))
