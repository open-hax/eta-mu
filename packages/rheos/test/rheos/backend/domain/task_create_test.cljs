(ns rheos.backend.domain.task-create-test
  (:require [cljs.test :refer [deftest testing is]]
            [clojure.string :as str]
            [rheos.backend.domain.task-create :as task-create]))

(deftest slugify-falls-back-when-title-has-no-word-characters
  (testing "A punctuation-only title still yields a usable slug"
    (is (= "task" (task-create/slugify "!!!" "task")))
    (is (= "a-b-c" (task-create/slugify "A  B  C" "task")))
    (is (= "trimmed" (task-create/slugify "  --Trimmed--  " "task")))))

(deftest frontmatter-pairs-are-ordered
  (testing "Frontmatter is emitted as ordered pairs so new cards are diff-stable"
    (let [pairs (task-create/frontmatter-pairs
                 {:uuid "u" :title "T" :status "incoming" :card-type "task"
                  :priority "P1" :points "3" :labels ["x" "y"] :parent "p"
                  :category "tasks" :write-id "w" :created-at "now"})]
      (is (= [:uuid :title :status :type :priority :points :labels :parent
              :category :write-id :created_at]
             (mapv first pairs)))
      (is (= "x, y" (second (nth pairs 6))) "labels serialize as a comma list"))))

(deftest card-file-name-suffixes-only-a-divergent-uuid
  (testing "A card whose uuid is its slug owns the bare file name"
    (is (= "same-name.md" (task-create/card-file-name "same-name" "same-name"))))
  (testing "A deliberate or collision-derived uuid gets a suffix, never a probe"
    (is (= "collision-ixeduuid.md" (task-create/card-file-name "collision" "fixeduuid")))
    (is (= "collision-short.md" (task-create/card-file-name "collision" "short")))))

(deftest check-card-dir-refuses-what-the-board-cannot-see
  (let [within? (fn [root candidate] (or (= root candidate)
                                         (str/starts-with? candidate (str root "/"))))
        project {:tasks-dir "/board"}]
    (testing "A directory inside the task root is returned unchanged"
      (is (= "/board/tasks" (task-create/check-card-dir! project "/board/tasks" nil within?))))
    (testing "A directory outside the task root is refused"
      (is (= :refused
             (:kind (ex-data (try (task-create/check-card-dir!
                                   project "/elsewhere" "../elsewhere" within?)
                                  nil (catch :default e e)))))))
    (testing "A directory outside the configured card projection is refused"
      (let [projected (assoc project :card-projection {:paths ["/board/tasks"]})]
        (is (= "/board/tasks" (task-create/check-card-dir! projected "/board/tasks" nil within?)))
        (is (= :refused
               (:kind (ex-data (try (task-create/check-card-dir!
                                     projected "/board/epics" nil within?)
                                    nil (catch :default e e))))))))))

(deftest render-card-defaults-the-body-and-the-priority
  (testing "An unauthored card gets a gate-able skeleton and P3"
    (let [{:keys [raw body]} (task-create/render-card
                              {:uuid "u" :title "T" :status "incoming"
                               :card-type "task" :write-id "w" :created-at "now"})]
      (is (re-find #"## Acceptance criteria" body))
      (is (re-find #"priority: \"P3\"" raw))))
  (testing "An authored body is used verbatim, trimmed"
    (let [{:keys [raw body]} (task-create/render-card
                              {:uuid "u" :title "T" :status "incoming"
                               :card-type "task" :priority "P0" :write-id "w"
                               :created-at "now" :body "  # T\n\nMy own words.  "})]
      (is (= "# T\n\nMy own words." body))
      (is (re-find #"My own words\." raw))
      (is (not (re-find #"## Acceptance criteria" raw))))))
