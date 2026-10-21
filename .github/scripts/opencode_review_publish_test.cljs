;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-publish-test
  "Pure data controls only: no archive/native/runtime/model qualification."
  (:require [cljs.test :as test :refer [deftest is testing]]
            [nbb.core :as nbb]
            [clojure.walk :as walk]
            [eta-mu.law.review-publication :as law]
            ["node:fs" :as fs]))

(defn sha [ch] (apply str (repeat 40 ch)))
(defn digest [ch] (apply str (repeat 64 ch)))
(def now 2000000000)
(def publisher {:app-id 3152464 :actor {:id 7 :login "inert-publisher[bot]" :type :bot}})
(def sources {:caller (sha "a") :eta (sha "b") :muse (sha "c") :verifier (digest "d") :build (digest "e")})
(def commands [["pnpm" "install"] ["pnpm" "lint"] ["pnpm" "test"] ["pnpm" "build"]
               ["nbb" "validate"] ["bb" "check"] ["node" "contracts"]])
(def tuple {:pr-number 22 :base-sha (sha "1") :head-sha (sha "2") :event-sha (sha "3")
            :merge-sha (sha "4") :merge-parents [(sha "1") (sha "2")]
            :head-tree (sha "5") :merge-tree (sha "5") :base-ancestor? true
            :mergeable? true :state :open :draft? false})
(def entry
  {:repository {:id 41 :full-name "inert/fixture" :public? true} :enabled? true :fixture? false
   :sources sources :publisher publisher
   :producer {:id 51 :path ".github/workflows/producer.yml" :source-sha (sha "a")
              :required-jobs ["producer"] :commands commands}
   :setup {:repository-id 41 :default-sha (sha "b") :app-id 3152464
           :proof (digest "6") :custody-proof (digest "7") :protection-proof (digest "8")
           :permissions #{:statuses-write :pull-requests-write}}
   :hosted-proof {:source-sha (sha "b") :sha256 (digest "9")}
   :status-policy {:max-writes 4}})
(def artifact
  {:id 71 :run-id 61 :attempt 2 :size-bytes 100 :sha256 (digest "a") :expires-at-ms (+ now 100000000)
   :archive-proof {:origin :trusted-archive-verifier :result :verified :artifact-id 71
                   :sha256 (digest "a") :completed-at-ms now
                   :bounds {:download-bytes 1000 :members 10 :member-bytes 1000
                            :uncompressed-bytes 10000 :operation-ms 1000 :decode-ms 1000}}})
(def verification
  {:origin :trusted-independent-verifier :result :verified :sources sources :tuple tuple
   :artifact-id 71 :artifact-sha256 (digest "a") :run-id 61 :attempt 2
   :full-input (digest "b") :input-verification (digest "c") :trace (digest "d")
   :submission (digest "e") :invocation (digest "f") :discovery (digest "0") :context (digest "1")
   :page-count 36 :verified-page-count 36 :completed-at-ms now})
(def submission {:event "APPROVE" :body "Inert verified review." :comments
                 [{:path "src/inert.cljc" :line 3 :side "RIGHT" :body "Inert inline."}]})
(defn fixture []
  {:now-ms now :target-id 41 :registry {:source-sha (sha "b") :targets [entry]}
   :collector {:event :schedule :mode :ordinary :source-sha (sha "b")
               :accepted-default-sha (sha "b") :adopted-default-sha (sha "b")
               :registry-source-sha (sha "b")}
   :snapshot {:repository (:repository entry) :tuple tuple :sources sources :setup (:setup entry)
              :hosted-proof (:hosted-proof entry) :publisher publisher :observed-at-ms now
              :run {:id 61 :attempt 2 :workflow-id 51 :workflow-path ".github/workflows/producer.yml"
                    :workflow-source-sha (sha "a") :base-sha (:base-sha tuple) :head-sha (:head-sha tuple)
                    :event-sha (:event-sha tuple) :status :completed :conclusion :success
                    :jobs [{:id 81 :name "producer" :status :completed :conclusion :success}] :commands commands}
              :artifact artifact :verification verification :submission submission}})

;; Until a domain namespace exists, every behavior test sees the explicit
;; missing implementation. Once present, load errors propagate; no fallback or
;; skipped test can hide a broken implementation.
(defn decision [operation & args]
  (if-let [f (resolve (symbol "eta-mu.domain.review-publication" (name operation)))]
    (apply f args)
    {:status :unimplemented :effects []}))
(defn admitted [] (decision :admit (fixture)))
(defn intent [admission]
  {:state :reserved :binding (:binding admission) :version 0})
(defn claim [admission]
  {:origin :trusted-durable-store :operation :claim-review-post :outcome :won
   :intent-key (get-in admission [:binding :intent-key]) :lock-key (get-in admission [:binding :lock-key])
   :owner "inert-worker" :claim-id "inert-claim" :previous-version 0 :version 1})
(defn readback [admission]
  {:origin :trusted-native-readback :intent-key (get-in admission [:binding :intent-key])
   :tuple tuple :observed-at-ms now :receipt-url "https://example.invalid/review/91"
   :review {:id 91 :publisher publisher :head-sha (:head-sha tuple)
            :event (:event submission) :body (:body submission) :complete? true
            :comments [{:id 101 :payload (first (:comments submission))}]}})
(defn history []
  {:origin :trusted-native-status-history :complete? true :observed-at-ms now
   :last-write-outcome :none :statuses []})
(defn observed-intent [admission]
  (assoc (intent admission) :state :observed :review-id 91 :receipt-url "https://example.invalid/review/91"))
(defn status-row [at]
  {:id 111 :publisher publisher :sha (:merge-sha tuple) :context law/context
   :state :success :receipt-url "https://example.invalid/review/91" :created-at-ms at})

(deftest actual-law-contracts-reject-malformed-values
  (is (law/registry? (:registry (fixture))))
  (is (law/verification? verification))
  (is (law/tuple? tuple))
  (is (law/commit? (sha "a")))
  (is (law/commit? (digest "a")))
  (is (not (law/commit? (str (sha "a") "a"))))
  (doseq [x [nil ##NaN ##Inf -1 1.5 9007199254740992 "1"]] (is (not (law/natural? x))))
  (is (not (law/status-policy? {:max-writes 1 :refresh-ms (* 7 law/default-refresh-ms)})))
  (is (not (law/status-history? (dissoc (history) :complete?))))
  (is (not (law/verification? {:acceptedInvocation true}))))

(deftest complete-independent-evidence-produces-exact-binding-without-effects
  (let [a (admitted)]
    (is (= :admitted (:status a)))
    (is (= [] (:effects a)))
    (is (= [41 (:merge-sha tuple) law/context] (get-in a [:binding :lock-key])))
    (is (= tuple (get-in a [:binding :tuple])))
    (is (= sources (get-in a [:binding :sources])))
    (is (= 71 (get-in a [:binding :artifact :id])))
    (is (= 2 (get-in a [:binding :run :attempt])))
    (is (= submission (get-in a [:binding :submission])))))

(deftest native-private-enrollment-and-both-git-object-formats
  (let [private (-> (fixture)
                    (assoc-in [:registry :targets 0 :repository :public?] false)
                    (assoc-in [:snapshot :repository :public?] false))
        sha256 (walk/postwalk #(if (and (string? %) (= 40 (count %)) (law/commit? %))
                                (digest (subs % 0 1)) %) (fixture))]
    (is (= :admitted (:status (decision :admit private))))
    (is (= :admitted (:status (decision :admit sha256))))
    (is (= :refused (:status (decision :admit (assoc-in private [:snapshot :repository :public?] true)))))))

(deftest ordinary-enrollment-and-source-custody-refuse-before-all-effects
  (doseq [[label change]
          [[:empty #(assoc-in % [:registry :targets] [])]
           [:disabled #(assoc-in % [:registry :targets 0 :enabled?] false)]
           [:unknown #(assoc % :target-id 42)]
           [:unadopted #(assoc-in % [:collector :adopted-default-sha] (sha "f"))]
           [:candidate-source #(assoc-in % [:collector :source-sha] (sha "f"))]
           [:registry-source #(assoc-in % [:collector :registry-source-sha] (sha "f"))]
           [:custody #(assoc-in % [:snapshot :setup :custody-proof] (digest "f"))]
           [:grant #(update-in % [:snapshot :setup :permissions] disj :statuses-write)]
           [:hosted-proof #(assoc-in % [:snapshot :hosted-proof :sha256] (digest "f"))]
           [:publisher #(assoc-in % [:snapshot :publisher :app-id] 1)]]]
    (testing (name label)
      (let [r (decision :admit (change (fixture)))]
        (is (= :refused (:status r))) (is (= [] (:effects r)))))))

(deftest fixture-bootstrap-is-explicit-and-does-not-enroll-an-ordinary-target
  (let [c (-> (fixture)
              (assoc-in [:registry :targets 0 :enabled?] false)
              (assoc-in [:registry :targets 0 :fixture?] true)
              (update-in [:registry :targets 0] dissoc :hosted-proof)
              (assoc-in [:collector :event] :workflow-dispatch)
              (assoc-in [:collector :mode] :qualification-only)
              (assoc-in [:collector :fixture-id] 41))]
    (is (= :admitted (:status (decision :admit c))))
    (doseq [bad [(assoc-in c [:collector :event] :schedule)
                 (assoc-in c [:collector :event] :workflow-run)
                 (assoc-in c [:collector :fixture-id] 42)
                 (assoc-in c [:registry :targets 0 :fixture?] false)]]
      (is (= :refused (:status (decision :admit bad)))))))

(deftest native-evidence-mutations-never-authorize-effects
  (doseq [[label change]
          [[:repository #(assoc-in % [:snapshot :repository :id] 42)]
           [:base #(assoc-in % [:snapshot :tuple :base-sha] (sha "f"))]
           [:parents #(assoc-in % [:snapshot :tuple :merge-parents] [(sha "2") (sha "1")])]
           [:tree #(assoc-in % [:snapshot :tuple :merge-tree] (sha "f"))]
           [:ancestor #(assoc-in % [:snapshot :tuple :base-ancestor?] false)]
           [:workflow #(assoc-in % [:snapshot :run :workflow-id] 52)]
           [:workflow-source #(assoc-in % [:snapshot :run :workflow-source-sha] (sha "f"))]
           [:commands #(update-in % [:snapshot :run :commands] pop)]
           [:job #(assoc-in % [:snapshot :run :jobs 0 :conclusion] :failure)]
           [:missing-job #(assoc-in % [:snapshot :run :jobs] [])]
           [:duplicate-job #(update-in % [:snapshot :run :jobs] conj {:id 82 :name "producer" :status :completed :conclusion :success})]
           [:artifact-run #(assoc-in % [:snapshot :artifact :run-id] 62)]
           [:attempt #(assoc-in % [:snapshot :artifact :attempt] 1)]
           [:digest #(assoc-in % [:snapshot :artifact :sha256] (digest "f"))]
           [:expired #(assoc-in % [:snapshot :artifact :expires-at-ms] now)]
           [:archive #(assoc-in % [:snapshot :artifact :archive-proof :result] :unverified)]
           [:bounds #(update-in % [:snapshot :artifact :archive-proof :bounds] dissoc :decode-ms)]
           [:forged-verdict #(assoc-in % [:snapshot :verification] {:acceptedInvocation true})]
           [:pages #(assoc-in % [:snapshot :verification :verified-page-count] 35)]
           [:verifier #(assoc-in % [:snapshot :verification :sources :verifier] (digest "f"))]
           [:trace #(update-in % [:snapshot :verification] dissoc :trace)]
           [:future-proof #(assoc-in % [:snapshot :verification :completed-at-ms] (inc now))]
           [:clock #(assoc % :now-ms -1)]]]
    (testing (name label)
      (let [r (decision :admit (change (fixture)))]
        (is (= :refused (:status r))) (is (= [] (:effects r))))))
  (let [r (decision :admit (assoc-in (fixture) [:snapshot :tuple :mergeable?] :unknown))]
    (is (= :pending (:status r))) (is (= [] (:effects r)))))

(deftest one-publication-requires-a-source-bound-winning-durable-claim
  (let [a (admitted) i (intent a) c (claim a)
        reserve (decision :publication-plan a nil nil)
        needs-claim (decision :publication-plan a i nil)
        post (decision :publication-plan a i c)]
    (is (= :reserve-intent (:action reserve)))
    (is (= [:reserve-intent] (mapv :type (:effects reserve))))
    (is (= :claim-review-post (:action needs-claim)))
    (is (= [:claim-review-post] (mapv :type (:effects needs-claim))))
    (is (= :post-review (:action post)))
    (is (= [:post-review] (mapv :type (:effects post))))
    (is (= (:head-sha tuple) (get-in post [:effects 0 :head-sha])))
    (is (= :post-started (get-in post [:intent :state])))
    (is (= :discover-review (:action (decision :publication-plan a (:intent post) nil))))
    (doseq [bad [(assoc c :outcome :lost) (assoc c :origin :candidate)
                 (assoc c :intent-key [:other]) (assoc c :lock-key [:other])
                 (assoc c :previous-version 1 :version 2)]]
      (is (= [] (:effects (decision :publication-plan a i bad)))))
    (doseq [state [:post-started :post-unknown :observed :ambiguous-absence]]
      (is (not-any? #(= :post-review (:type %))
                    (:effects (decision :publication-plan a (assoc i :state state) c)))))))

(deftest status-success-requires-exact-native-review-and-all-inline-readback
  (let [a (admitted) i (observed-intent a) r (readback a)
        p (decision :status-plan a i r (history))]
    (is (= :write-status (:action p)))
    (is (= [:post-status] (mapv :type (:effects p))))
    (is (= :success (get-in p [:effects 0 :state])))
    (is (= (:merge-sha tuple) (get-in p [:effects 0 :sha])))
    (is (= law/context (get-in p [:effects 0 :context])))
    (is (= (+ now law/default-refresh-ms) (:next-refresh-at-ms p)))
    (doseq [bad [(assoc-in r [:review :publisher :app-id] 1)
                 (assoc-in r [:review :head-sha] (sha "f"))
                 (assoc-in r [:review :event] "COMMENT")
                 (assoc-in r [:review :body] "changed")
                 (assoc-in r [:review :comments] [])
                 (assoc-in r [:review :comments 0 :payload :body] "changed")
                 (assoc-in r [:review :comments 0 :id] nil)
                 (assoc-in r [:review :complete?] false)
                 (assoc-in r [:tuple :base-sha] (sha "f"))
                 (assoc r :intent-key [:other])
                 (assoc r :receipt-url "https://example.invalid/other")]]
      (is (= [] (:effects (decision :status-plan a i bad (history))))))))

(deftest status-dedup-refresh-history-budget-and-unknown-outcome
  (let [a (admitted) i (observed-intent a) r (readback a)
        fresh (assoc (history) :statuses [(status-row (- now 10))])
        due (assoc (history) :statuses [(status-row (- now law/default-refresh-ms))])]
    (is (= :unchanged (:action (decision :status-plan a i r fresh))))
    (is (= [] (:effects (decision :status-plan a i r fresh))))
    (let [p (decision :status-plan a i r due)]
      (is (= :write-status (:action p)))
      (is (= [:post-status] (mapv :type (:effects p))))
      (is (= (:merge-sha tuple) (get-in p [:effects 0 :sha]))))
    (doseq [bad [(assoc fresh :complete? false)
                 (assoc fresh :last-write-outcome :unknown)
                 (assoc-in fresh [:statuses 0 :created-at-ms] (inc now))
                 (assoc-in fresh [:statuses 0 :sha] (:head-sha tuple))
                 (assoc-in fresh [:statuses 0 :publisher :app-id] 1)
                 (assoc-in fresh [:statuses 0 :context] "other")
                 (assoc-in fresh [:statuses 0 :receipt-url] "https://example.invalid/other")
                 (assoc fresh :statuses (mapv #(assoc (status-row (- now law/default-refresh-ms)) :id %) [1 2 3 4]))]]
      (is (= [] (:effects (decision :status-plan a i r bad)))))
    (is (= :discover-status (:action (decision :status-plan a i r (assoc fresh :last-write-outcome :unknown)))))))

(deftest shared-merge-lock-is-not-a-per-pr-approval-or-intent
  (let [a (admitted)
        b (decision :admit (-> (fixture)
                              (assoc-in [:snapshot :tuple :pr-number] 23)
                              (assoc-in [:snapshot :verification :tuple :pr-number] 23)))]
    (is (= :admitted (:status b)))
    (is (= (get-in a [:binding :lock-key]) (get-in b [:binding :lock-key])))
    (is (not= (get-in a [:binding :intent-key]) (get-in b [:binding :intent-key])))
    (is (= :publication-evidence-integrity (get-in b [:binding :status-meaning])))
    (is (false? (get-in b [:binding :merge-approval?])))))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/domain/review_publication.cljc")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/domain/review_publication.cljc")))
(test/run-tests 'opencode-review-publish-test)
