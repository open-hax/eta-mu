(ns rheos.backend.domain.task-create-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.domain.events :as events]
            [rheos.backend.domain.task-create :as task-create]
            [rheos.backend.shape.content-parser :as content-parser]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-create-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- ^:async scratch-project
  "A project rooted at a fresh temp dir, with `epics/` and `tasks/` present so
   conventional placement is exercised."
  [& {:keys [fsm] :or {fsm :promethean}}]
  (let [dir (tmp-dir)]
    (await (.mkdir fsp (path/join dir "epics") #js {:recursive true}))
    (await (.mkdir fsp (path/join dir "tasks") #js {:recursive true}))
    {:id "test" :title "Test" :tasks-dir dir :meta {} :fsm fsm}))

(defn- cleanup! [project]
  (.rm fsp (:tasks-dir project) #js {:recursive true :force true}))

(defn- ^:async frontmatter-of [file-path]
  (:frontmatter (content-parser/parse-task-content
                 (await (.readFile fsp file-path "utf8")))))

(deftest ^:async creates-root-epic-in-epics-dir
  (testing "A root epic needs no parent and lands in the conventional epics dir"
    (let [project (await (scratch-project))]
      (try
        (let [result (await (task-create/create-task!
                             {:project project :title "Ledger Cutover"
                              :card-type "epic" :priority "P0" :points "13"
                              :labels ["ledger" "cutover"] :source "test"}))
              fm (await (frontmatter-of (:source-path result)))]
          (is (:ok result))
          (is (= "ledger-cutover" (:uuid result)) "uuid defaults to the title slug")
          (is (= "epic" (:card-type result)))
          (is (= "epics" (path/basename (path/dirname (:source-path result)))))
          (is (= "epics" (:category fm)))
          (is (= "P0" (:priority fm)))
          (is (= "13" (:points fm)))
          (is (= "ledger, cutover" (:labels fm)))
          (is (nil? (:parent fm)) "a root card records no parent")
          (is (string? (:write-id fm))))
        (finally (await (cleanup! project)))))))

(deftest ^:async creates-child-task-in-tasks-dir
  (testing "A child card records its parent and lands in the tasks dir"
    (let [project (await (scratch-project))]
      (try
        (let [parent (await (task-create/create-task!
                             {:project project :title "Parent Epic"
                              :card-type "epic" :source "test"}))
              child (await (task-create/create-task!
                            {:project project :title "Child Slice"
                             :parent (:uuid parent) :source "test"}))
              fm (await (frontmatter-of (:source-path child)))]
          (is (= "parent-epic" (:parent child)))
          (is (= "parent-epic" (:parent fm)))
          (is (= "task" (:type fm)))
          (is (= "tasks" (path/basename (path/dirname (:source-path child))))))
        (finally (await (cleanup! project)))))))

(deftest ^:async enters-at-fsm-initial-state
  (testing "A new card enters at the FSM's initial state, not a hardcoded status"
    (let [project (await (scratch-project))]
      (try
        (let [result (await (task-create/create-task!
                             {:project project :title "Fresh" :source "test"}))]
          (is (= (task-create/initial-status project) (:status result)))
          (is (= "incoming" (:status result))))
        (finally (await (cleanup! project)))))))

(deftest ^:async refuses-non-initial-status-without-force
  (testing "Creating straight into a mid-workflow status is refused, but forceable"
    (let [project (await (scratch-project))]
      (try
        (let [refused (try
                        (await (task-create/create-task!
                                {:project project :title "Sneak In"
                                 :status "in_progress" :source "test"}))
                        nil
                        (catch :default e e))]
          (is (some? refused) "should throw")
          (is (= :refused (:kind (ex-data refused))))
          (let [forced (await (task-create/create-task!
                               {:project project :title "Sneak In"
                                :status "in_progress" :force-status? true
                                :source "test"}))]
            (is (= "in_progress" (:status forced)))))
        (finally (await (cleanup! project)))))))

(deftest ^:async refuses-duplicate-uuid-and-writes-nothing
  (testing "A taken uuid is refused and no second file appears"
    (let [project (await (scratch-project))]
      (try
        (let [_ (await (task-create/create-task!
                        {:project project :title "Only One" :source "test"}))
              err (try (await (task-create/create-task!
                               {:project project :title "Different Title"
                                :uuid "only-one" :source "test"}))
                       nil
                       (catch :default e e))
              files (await (.readdir fsp (path/join (:tasks-dir project) "tasks")))]
          (is (some? err))
          (is (= :refused (:kind (ex-data err))))
          (is (= 1 (count files)) "the refused create wrote no file"))
        (finally (await (cleanup! project)))))))

(deftest ^:async refuses-unknown-parent
  (testing "A parent that does not exist is a not-found, not a silent orphan"
    (let [project (await (scratch-project))]
      (try
        (let [err (try (await (task-create/create-task!
                               {:project project :title "Orphan"
                                :parent "no-such-card" :source "test"}))
                       nil
                       (catch :default e e))]
          (is (some? err))
          (is (= :not-found (:kind (ex-data err)))))
        (finally (await (cleanup! project)))))))

(deftest ^:async refuses-blank-title-and-unknown-type
  (testing "Usage failures are classified as :usage"
    (let [project (await (scratch-project))]
      (try
        (let [blank (try (await (task-create/create-task!
                                 {:project project :title "  " :source "test"}))
                         nil (catch :default e e))
              bad-type (try (await (task-create/create-task!
                                    {:project project :title "T"
                                     :card-type "saga" :source "test"}))
                            nil (catch :default e e))]
          (is (= :usage (:kind (ex-data blank))))
          (is (= :usage (:kind (ex-data bad-type)))))
        (finally (await (cleanup! project)))))))

(deftest ^:async emits-task-created-event
  (testing "Creation is a ledger fact carrying enough payload to reconstruct the card"
    (let [project (await (scratch-project))
          captured (atom [])
          unsub (events/subscribe! #(swap! captured conj %))]
      (try
        (let [result (await (task-create/create-task!
                             {:project project :title "Recorded Card"
                              :card-type "epic" :body "# Recorded Card\n\nAuthored."
                              :source "test"}))
              created (first (filter #(= "task-created" (:type %)) @captured))]
          (is (some? created) "a task-created event was published")
          (is (= (:uuid result) (:task-id created)))
          (is (= "Recorded Card" (:title created)))
          (is (= "epic" (:card-type created)))
          (is (= "incoming" (:status created)))
          (is (= (:source-path result) (:source-path created)))
          (is (re-find #"Authored\." (:body created))
              "the authored body travels with the event, so a fold can rebuild it")
          (is (= "test" (:source created))))
        (finally
          (unsub)
          (await (cleanup! project)))))))

(deftest ^:async authored-body-replaces-the-template
  (testing "A supplied body is used verbatim; otherwise a skeleton is written"
    (let [project (await (scratch-project))]
      (try
        (let [templated (await (task-create/create-task!
                                {:project project :title "Templated" :source "test"}))
              authored (await (task-create/create-task!
                               {:project project :title "Authored"
                                :body "# Authored\n\nMy own words." :source "test"}))
              t-raw (await (.readFile fsp (:source-path templated) "utf8"))
              a-raw (await (.readFile fsp (:source-path authored) "utf8"))]
          (is (re-find #"## Acceptance criteria" t-raw) "skeleton body keeps the card gate-able")
          (is (re-find #"My own words\." a-raw))
          (is (not (re-find #"## Acceptance criteria" a-raw))))
        (finally (await (cleanup! project)))))))

(deftest ^:async slug-collision-gets-a-distinct-uuid-and-file
  (testing "Two cards with the same title coexist"
    (let [project (await (scratch-project))]
      (try
        (let [first-card (await (task-create/create-task!
                                 {:project project :title "Same Name" :source "test"}))
              second-card (await (task-create/create-task!
                                  {:project project :title "Same Name" :source "test"}))]
          (is (= "same-name" (:uuid first-card)))
          (is (not= (:uuid first-card) (:uuid second-card)))
          (is (not= (:source-path first-card) (:source-path second-card))))
        (finally (await (cleanup! project)))))))

(deftest ^:async refuses-directory-escaping-the-task-root
  (testing "--dir cannot write outside the project"
    (let [project (await (scratch-project))]
      (try
        (let [err (try (await (task-create/create-task!
                               {:project project :title "Escape"
                                :dir "../../elsewhere" :source "test"}))
                       nil (catch :default e e))]
          (is (some? err))
          (is (= :refused (:kind (ex-data err)))))
        (finally (await (cleanup! project)))))))

(deftest ^:async refuses-directory-outside-the-card-projection
  (testing "A card written outside the configured projection would be invisible"
    (let [base (await (scratch-project))
          project (assoc base :card-projection
                         {:paths [(path/join (:tasks-dir base) "tasks")]})]
      (try
        (let [err (try (await (task-create/create-task!
                               {:project project :title "Unseen"
                                :card-type "epic" :source "test"}))
                       nil (catch :default e e))
              ok (await (task-create/create-task!
                         {:project project :title "Seen" :source "test"}))]
          (is (some? err) "epics/ is outside the projection, so creating there is refused")
          (is (= :refused (:kind (ex-data err))))
          (is (:ok ok) "tasks/ is inside the projection"))
        (finally (await (cleanup! project)))))))

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
