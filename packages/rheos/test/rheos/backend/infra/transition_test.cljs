(ns rheos.backend.infra.transition-test
  "The refusal half of the single write path.

   [[rheos.backend.infra.transition/move-task!]] is the only way a status
   changes, so a status the FSM does not recognise has to die here — returning
   `{:ok false}` *and* leaving both the card file and the ledger untouched. The
   `in_review` bug wrote three cards into a state the board could not render or
   transition out of; a refusal that still writes is the same bug."
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.transition :as transition]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-transition-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- write-task! [dir uuid status]
  (let [file-path (path/join dir (str uuid ".md"))
        raw (str "---\n"
                 "uuid: \"" uuid "\"\n"
                 "title: \"Task One\"\n"
                 "status: \"" status "\"\n"
                 "priority: \"P3\"\n"
                 "---\n\n# Task One\n\nBody")]
    (.writeFile fsp file-path raw "utf8")))

(defn- ^:async ledger-lines
  "Number of events on disk, 0 when the ledger has not been created.

   Only a missing file counts as zero. Swallowing any other read failure would
   let these tests report 'no event was appended' when they simply could not
   look — the refusal assertions would then pass without evidence."
  [dir]
  (let [ledger-path (path/join dir ".events" "ledger.edn")]
    (try
      (let [raw (await (.readFile fsp ledger-path "utf8"))]
        (count (remove #(= "" %) (.split (str raw) "\n"))))
      (catch :default error
        (if (= "ENOENT" (.-code error)) 0 (throw error))))))

(defn- ^:async with-card
  "Run `f` against a temp board holding one card at `status`, then assert on the
   file and ledger it left behind. `f` receives {:project :task}."
  [status f]
  (let [dir (tmp-dir)
        _ (await (.mkdir fsp dir #js {:recursive true}))
        _ (await (write-task! dir "t1" status))
        source-path (path/join dir "t1.md")
        project {:id "test" :title "Test" :tasks-dir dir :fsm "promethean" :meta {}}
        task {:uuid "t1" :status status :source-path source-path}
        before (await (.readFile fsp source-path "utf8"))
        ledger-before (await (ledger-lines dir))
        captured (atom [])
        unsub (events/subscribe! #(swap! captured conj %))]
    (try
      (let [result (await (f {:project project :task task}))]
        {:result result
         :before before
         :after (await (.readFile fsp source-path "utf8"))
         :ledger-before ledger-before
         :ledger-after (await (ledger-lines dir))
         :events @captured})
      (finally
        (unsub)
        (await (.rm fsp dir #js {:recursive true :force true}))))))

(deftest ^:async move-to-a-non-fsm-status-is-refused-and-writes-nothing
  (testing "`in_review` is not an FSM state — the write path must refuse it"
    (let [{:keys [result before after ledger-before ledger-after events]}
          (await (with-card "review"
                   (fn [{:keys [project task]}]
                     (transition/move-task! {:project project :task task
                                             :new-status "in_review"
                                             :source "test"}))))]
      (is (false? (:ok result)))
      (is (= "review" (:from result)))
      (is (= "in_review" (:to result)))
      (is (re-find #"No transition" (str (:reason result))))
      (is (= before after) "the card file is byte-identical")
      (is (re-find #"status: \"review\"" after) "and still holds its real status")
      (is (= ledger-before ledger-after) "no event was appended")
      (is (empty? events) "and none was published"))))

(deftest ^:async move-from-a-non-fsm-status-is-refused-and-writes-nothing
  (testing "a card already stranded on a bogus status cannot move either"
    (let [{:keys [result before after ledger-before ledger-after]}
          (await (with-card "in_review"
                   (fn [{:keys [project task]}]
                     (transition/move-task! {:project project :task task
                                             :new-status "done"
                                             :source "test"}))))]
      (is (false? (:ok result)))
      (is (re-find #"No transition" (str (:reason result))))
      (is (= before after) "the card file is byte-identical")
      (is (= ledger-before ledger-after) "no event was appended"))))

(deftest ^:async move-across-a-missing-edge-is-refused-and-writes-nothing
  (testing "both states real, edge absent — same refusal, same silence on disk"
    (let [{:keys [result before after ledger-before ledger-after]}
          (await (with-card "breakdown"
                   (fn [{:keys [project task]}]
                     (transition/move-task! {:project project :task task
                                             :new-status "done"
                                             :source "test"}))))]
      (is (false? (:ok result)))
      (is (= before after) "the card file is byte-identical")
      (is (= ledger-before ledger-after) "no event was appended"))))

(deftest ^:async a-legal-move-does-write
  (testing "the refusal tests above would pass on a write path that never writes"
    (let [{:keys [result before after ledger-before ledger-after events]}
          (await (with-card "breakdown"
                   (fn [{:keys [project task]}]
                     (transition/move-task! {:project project :task task
                                             :new-status "ready"
                                             :source "test"}))))]
      (is (:ok result))
      (is (not= before after) "the card file was rewritten")
      (is (re-find #"status: \"ready\"" after))
      (is (= (inc ledger-before) ledger-after) "exactly one event was appended")
      (is (some #(= "status-change" (:type %)) events)))))
