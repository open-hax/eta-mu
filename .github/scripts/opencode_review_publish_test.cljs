;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-publish-test
  "Pure data controls only: no archive/native/runtime/model qualification."
  (:require [cljs.test :as test :refer [deftest is testing]]
            [nbb.core :as nbb]
            [clojure.walk :as walk]
            [cljs.reader :as reader]
            [eta-mu.law.review-publication :as law]
            ["node:fs" :as fs]
            ["node:child_process" :as cp]))

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
   :status-policy {:max-writes 4 :observation-max-age-ms 300000}})
(def artifact
  {:id 71 :run-id 61 :attempt 2 :size-bytes 100 :sha256 (digest "a") :expires-at-ms (+ now 100000000)
   :archive-proof {:origin :trusted-archive-verifier :result :verified :artifact-id 71
                   :sha256 (digest "a") :completed-at-ms now
                   :bounds {:download-bytes 1000 :members 10 :member-bytes 1000
                            :uncompressed-bytes 10000 :operation-ms 1000 :decode-ms 1000}}})
(def submission {:schema "open-hax.github-review/v1" :event "COMMENT" :summary "Inert verified review." :comments
                 [{:path "src/inert.cljc" :line 3 :side "RIGHT" :body "Inert inline."
                   :severity "low" :blocking false}]})
(def publication-payload
  {:event "COMMENT" :body "Inert verified review."
   :comments [{:path "src/inert.cljc" :line 3 :side "RIGHT" :body "Inert inline."}]})
(def verification
  {:origin :trusted-independent-verifier :result :verified :sources sources :tuple tuple
   :artifact-id 71 :artifact-sha256 (digest "a") :run-id 61 :attempt 2
   :full-input (digest "b") :input-verification (digest "c") :trace (digest "d")
   :submission (digest "e") :invocation (digest "f") :discovery (digest "0") :context (digest "1")
   :submission-envelope submission
   :publisher-validation {:origin :trusted-publisher-validator :result :verified
                          :module-source (:muse sources) :module-sha256 (digest "2")
                          :submission-sha256 (digest "e") :payload publication-payload}
   :page-count 36 :verified-page-count 36 :completed-at-ms now})
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
              :artifact artifact :verification (assoc verification :submission-envelope submission)
              :submission submission}})

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
            :event (:event publication-payload) :body (:body publication-payload) :complete? true
            :comments [{:id 101 :review-id 91 :head-sha (:head-sha tuple) :actor (:actor publisher)
                        :payload (first (:comments publication-payload))}]}})
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
  (is (not (law/status-policy? {:max-writes 1 :observation-max-age-ms 300001})))
  (is (not (law/status-policy? {:max-writes 1 :observation-max-age-ms 1000 :refresh-ms 1000})))
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

(deftest actual-compatible-approved-empty-envelope-remains-a-positive-path
  (let [envelope (assoc submission :event "APPROVE" :comments [])
        payload (assoc publication-payload :event "APPROVE" :comments [])
        c (-> (fixture) (assoc-in [:snapshot :submission] envelope)
              (assoc-in [:snapshot :verification :submission-envelope] envelope)
              (assoc-in [:snapshot :verification :publisher-validation :payload] payload))
        a (decision :admit c)
        r (-> (readback a) (assoc-in [:review :event] "APPROVE")
              (assoc-in [:review :comments] []))]
    (is (= :admitted (:status a)))
    (is (= :write-status (:action (decision :status-plan a (observed-intent a) r (history)))))))

(deftest accepted-collector-code-and-registry-advance-independently-of-producer-pins
  (let [central (sha "d")
        c (-> (fixture)
              (assoc-in [:registry :source-sha] central)
              (update :collector merge {:source-sha central :accepted-default-sha central
                                         :adopted-default-sha central :registry-source-sha central})
              (assoc-in [:registry :targets 0 :setup :default-sha] central)
              (assoc-in [:snapshot :setup :default-sha] central)
              (assoc-in [:registry :targets 0 :hosted-proof :source-sha] central)
              (assoc-in [:snapshot :hosted-proof :source-sha] central))
        a (decision :admit c)]
    (is (= :admitted (:status a)))
    (is (= sources (get-in a [:binding :sources])))
    (is (= central (get-in a [:binding :collector-source])))
    (is (= central (get-in a [:binding :registry-source])))
    (is (not= (get-in (admitted) [:binding :intent-key]) (get-in a [:binding :intent-key])))))

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
           [:submission-binding #(assoc-in % [:snapshot :submission :body] "Unverified replacement.")]
           [:omitted-verified-envelope #(update-in % [:snapshot :verification] dissoc :submission-envelope)]
           [:omitted-publisher-proof #(update-in % [:snapshot :verification] dissoc :publisher-validation)]
           [:publisher-proof-source #(assoc-in % [:snapshot :verification :publisher-validation :module-source] (sha "f"))]
           [:publisher-proof-digest #(assoc-in % [:snapshot :verification :publisher-validation :submission-sha256] (digest "f"))]
           [:publisher-origin #(assoc-in % [:snapshot :verification :publisher-validation :origin] :candidate)]
           [:verification-origin #(assoc-in % [:snapshot :verification :origin] :candidate)]
           [:archive-origin #(assoc-in % [:snapshot :artifact :archive-proof :origin] :candidate)]
           [:snapshot-clock #(assoc-in % [:snapshot :observed-at-ms] (inc now))]
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
    (is (= :pending (:status p)) "A proposed POST is not native status success")
    (is (= [:post-status] (mapv :type (:effects p))))
    (is (= :success (get-in p [:effects 0 :state])))
    (is (= (:merge-sha tuple) (get-in p [:effects 0 :sha])))
    (is (= law/context (get-in p [:effects 0 :context])))
    (is (= (+ now law/default-refresh-ms) (:next-refresh-at-ms p)))
    (doseq [bad [(assoc-in r [:review :publisher :app-id] 1)
                 (assoc-in r [:review :head-sha] (sha "f"))
                 (assoc-in r [:review :event] "APPROVE")
                 (assoc-in r [:review :body] "changed")
                 (assoc-in r [:review :comments] [])
                 (assoc-in r [:review :comments 0 :payload :body] "changed")
                 (assoc-in r [:review :comments 0 :id] nil)
                 (assoc-in r [:review :comments 0 :actor :id] 8)
                 (assoc-in r [:review :comments 0 :actor :login] "another[bot]")
                 (assoc-in r [:review :comments 0 :actor :type] :user)
                 (assoc-in r [:review :comments 0 :head-sha] (sha "f"))
                 (assoc-in r [:review :comments 0 :review-id] 92)
                 (update-in r [:review :comments 0] dissoc :actor)
                 (update-in r [:review :comments 0] dissoc :head-sha)
                 (update-in r [:review :comments 0] dissoc :review-id)
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
                 (assoc-in fresh [:statuses 0 :receipt-url] "not-a-native-receipt-url")
                 (assoc fresh :statuses (mapv #(assoc (status-row (- now law/default-refresh-ms)) :id %) [1 2 3 4]))]]
      (is (= [] (:effects (decision :status-plan a i r bad)))))
    (is (= :discover-status (:action (decision :status-plan a i r (assoc fresh :last-write-outcome :unknown)))))))

(deftest shared-merge-history-keeps-prior-receipts-without-borrowing-another-pr-review
  (let [a (admitted)
        b (decision :admit (-> (fixture)
                              (assoc-in [:snapshot :tuple :pr-number] 23)
                              (assoc-in [:snapshot :verification :tuple :pr-number] 23)))
        url "https://example.invalid/review/92"
        i (assoc (observed-intent b) :review-id 92 :receipt-url url)
        r (-> (readback b) (assoc :tuple (get-in b [:binding :tuple]) :receipt-url url)
              (assoc-in [:review :id] 92) (assoc-in [:review :comments 0 :review-id] 92))
        prior (assoc (history) :statuses [(status-row (- now 10))])
        p (decision :status-plan b i r prior)]
    (is (= (get-in a [:binding :lock-key]) (get-in b [:binding :lock-key])))
    (is (not= (get-in a [:binding :intent-key]) (get-in b [:binding :intent-key])))
    (is (= :write-status (:action p)) "Previous PR receipt does not permanently block shared M")
    (is (= :pending (:status p)))
    (is (= url (get-in p [:effects 0 :receipt-url])))
    (is (= 1 (get-in p [:effects 0 :expected-write-count])))
    (let [confirmed (assoc-in prior [:statuses 0 :receipt-url] url)
          unchanged (decision :status-plan b i r confirmed)]
      (is (= :unchanged (:action unchanged)))
      (is (= :qualified (:status unchanged)))
      (is (= [] (:effects unchanged))))))

(deftest current-native-observation-budget-and-final-fresh-success-dedup
  (let [later (+ now law/default-refresh-ms)
        aged (assoc (fixture) :now-ms later)
        recollected (-> aged (assoc-in [:snapshot :observed-at-ms] later)
                        (assoc-in [:snapshot :artifact :archive-proof :completed-at-ms] later)
                        (assoc-in [:snapshot :verification :completed-at-ms] later))
        a (decision :admit recollected)
        i (observed-intent a)
        r (assoc (readback a) :observed-at-ms later)
        h (assoc (history) :observed-at-ms later :statuses [(status-row now)])]
    (is (= :refused (:status (decision :admit aged))))
    (is (= :admitted (:status a)))
    (is (= :write-status (:action (decision :status-plan a i r h))))
    (doseq [bad [(assoc r :observed-at-ms now)]]
      (is (= [] (:effects (decision :status-plan a i bad h)))))
    (is (= [] (:effects (decision :status-plan a i r (assoc h :observed-at-ms now)))))
    (doseq [path [[:snapshot :observed-at-ms]
                  [:snapshot :artifact :archive-proof :completed-at-ms]
                  [:snapshot :verification :completed-at-ms]]]
      (is (= :refused (:status (decision :admit (assoc-in recollected path now))))))
    (doseq [budget [nil 0 -1 ##Inf 300001 law/default-refresh-ms]]
      (is (= :refused (:status (decision :admit (assoc-in recollected [:registry :targets 0 :status-policy :observation-max-age-ms] budget))))))
    (let [full (assoc h :statuses (mapv #(assoc (status-row (- later 10)) :id %) [1 2 3 4]))
          unchanged (decision :status-plan a i r full)]
      (is (= :qualified (:status unchanged)))
      (is (= :unchanged (:action unchanged)))
      (is (= [] (:effects unchanged))))))

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

(deftest verified-envelope-must-bind-every-native-publication-field
  (testing "a matching digest/origin does not bind an independently supplied payload"
    (doseq [[label change]
            [[:event #(assoc % :event "APPROVE")]
             [:body #(assoc % :body "Unverified replacement.")]
             [:inline-body #(assoc-in % [:comments 0 :body] "Unverified inline.")]
             [:inline-path #(assoc-in % [:comments 0 :path] "src/other.cljc")]
             [:inline-line #(assoc-in % [:comments 0 :line] 4)]
             [:inline-side #(assoc-in % [:comments 0 :side] "LEFT")]
             [:missing-inline #(assoc % :comments [])]
             [:extra-inline #(update % :comments conj {:path "src/other.cljc" :line 4 :side "RIGHT" :body "Extra."})]
             [:unnormalized-inline #(assoc-in % [:comments 0 :severity] "low")]]]
      (let [context (update-in (fixture) [:snapshot :verification :publisher-validation :payload] change)
            a (decision :admit context)]
        (is (= :refused (:status a)) (str label ": " (pr-str a)))
        (is (= [] (:effects a)) (name label)))))
  (testing "the exact Muse projection preserves text/order and drops envelope-only metadata"
    (let [envelope (-> submission
                       (assoc :event "REQUEST_CHANGES" :summary "  Inert μ summary.\n")
                       (assoc-in [:comments 0 :body] "  Inert μ inline.\n")
                       (assoc-in [:comments 0 :severity] "high")
                       (assoc-in [:comments 0 :blocking] true)
                       (assoc-in [:comments 0 :confidence] 0.75)
                       (update :comments conj {:path "src/second.cljc" :line 7 :side "RIGHT"
                                               :body "Second raw inline.\n" :severity "low" :blocking false}))
          ;; Actual pinned Muse publishReview maps precisely these native fields;
          ;; it neither trims raw text nor forwards envelope-only inline metadata.
          payload {:event "REQUEST_CHANGES" :body "  Inert μ summary.\n"
                   :comments [{:path "src/inert.cljc" :line 3 :side "RIGHT" :body "  Inert μ inline.\n"}
                              {:path "src/second.cljc" :line 7 :side "RIGHT" :body "Second raw inline.\n"}]}
          context (-> (fixture) (assoc-in [:snapshot :submission] envelope)
                      (assoc-in [:snapshot :verification :submission-envelope] envelope)
                      (assoc-in [:snapshot :verification :publisher-validation :payload] payload))
          a (decision :admit context)
          post (decision :publication-plan a (intent a) (claim a))]
      (is (= :admitted (:status a)))
      (is (= :post-review (:action post)))
      (is (= payload (get-in post [:effects 0 :payload])))
      (is (= payload (get-in a [:binding :publication-payload])))
      (is (= :refused (:status (decision :admit
                                (update-in context [:snapshot :verification :publisher-validation :payload :comments]
                                           #(vec (reverse %))))))))))

(def malformed-policy-values [nil "86400000" true false {} [] ##NaN ##Inf ##-Inf -1 0 1.5 9007199254740992])
(defn policy-cases []
  (concat
   [{:case :default-refresh :policy {:max-writes 4 :observation-max-age-ms 300000} :valid? true}
    {:case :minimum-interval :policy {:max-writes 1 :observation-max-age-ms 1 :refresh-ms 2} :valid? true}
    {:case :maximum-interval :policy {:max-writes law/maximum-safe-integer :observation-max-age-ms 300000
                                     :refresh-ms 518400000} :valid? true}
    {:case :missing-observation :policy {:max-writes 4} :valid? false}
    {:case :missing-write-bound :policy {:observation-max-age-ms 1000} :valid? false}
    {:case :equal-observation-refresh :policy {:max-writes 4 :observation-max-age-ms 1000 :refresh-ms 1000} :valid? false}
    {:case :observation-over-bound :policy {:max-writes 4 :observation-max-age-ms 300001} :valid? false}
    {:case :refresh-over-bound :policy {:max-writes 4 :observation-max-age-ms 1000 :refresh-ms 518400001} :valid? false}]
   (map-indexed (fn [index value] {:case [:whole-policy index] :policy value :valid? false})
                [nil "policy" true false [] {} ##NaN ##Inf -1 0 1.5])
   (for [field [:refresh-ms :observation-max-age-ms :max-writes]
         [index value] (map-indexed vector malformed-policy-values)]
     {:case [field index] :policy (assoc (:status-policy entry) field value) :valid? false})))

(defn- portable-result [operation args]
  (try {:value (if (= :status-policy? operation)
                 (apply law/status-policy? args)
                 (apply decision operation args))}
       (catch :default _ {:threw true})))

(deftest malformed-status-policy-refuses-without-host-coercion-or-throw
  (doseq [{:keys [case policy valid?]} (policy-cases)]
    (is (= {:value valid?} (portable-result :status-policy? [policy])) (pr-str case))
    (let [result (portable-result :admit [(assoc-in (fixture) [:registry :targets 0 :status-policy] policy)])]
      (is (= (if valid? :admitted :refused) (get-in result [:value :status])) (pr-str [case result]))
      (is (= [] (get-in result [:value :effects])) (pr-str case)))))

(defn- complete-decision-cases [kind context]
  (let [a (decision :admit context) i (intent a) c (claim a)
        post (decision :publication-plan a i c)
        observed (observed-intent a)
        r (cond-> (readback a)
            (= kind :approve) (assoc-in [:review :event] "APPROVE")
            (= kind :approve) (assoc-in [:review :comments] []))
        h (history) fresh (assoc h :statuses [(status-row now)])]
    (mapv (fn [[label operation args]] {:case [kind label] :operation operation :args args})
          [[:admit :admit [context]]
           [:reserve :publication-plan [a nil nil]]
           [:claim :publication-plan [a i nil]]
           [:post-proposal :publication-plan [a i c]]
           [:repeat-block :publication-plan [a (:intent post) nil]]
           [:unknown :publication-plan [a (assoc i :state :post-unknown) nil]]
           [:ambiguous-absence :publication-plan [a (assoc i :state :ambiguous-absence) nil]]
           [:status-proposal :status-plan [a observed r h]]
           [:confirmed-status :status-plan [a observed r fresh]]
           [:unknown-status :status-plan [a observed r (assoc fresh :last-write-outcome :unknown)]]
           [:wrong-inline-membership :status-plan [a observed (assoc-in r [:review :id] 999) h]]])))

(deftest complete-portable-decisions-and-malformed-policy-match-babashka
  ;; Compare complete Clojure data from both actual hosts. Independent policy
  ;; expectations above prevent two equally wrong implementations passing parity.
  (let [approve (-> (fixture)
                    (assoc-in [:snapshot :submission] (assoc submission :event "APPROVE" :comments []))
                    (assoc-in [:snapshot :verification :submission-envelope] (assoc submission :event "APPROVE" :comments []))
                    (assoc-in [:snapshot :verification :publisher-validation :payload] (assoc publication-payload :event "APPROVE" :comments [])))
        rows (vec (concat (complete-decision-cases :comment (fixture))
                          (complete-decision-cases :approve approve)
                          (mapcat (fn [{:keys [case policy]}]
                                    [{:case [:policy case] :operation :status-policy? :args [policy]}
                                     {:case [:registry case] :operation :admit
                                      :args [(assoc-in (fixture) [:registry :targets 0 :status-policy] policy)]}])
                                  (policy-cases))))
        expected (mapv (fn [{:keys [case operation args]}]
                         {:case case :result (portable-result operation args)}) rows)
        script (str "(require '[clojure.edn :as edn] '[eta-mu.law.review-publication :as law] '[eta-mu.domain.review-publication :as publication])"
                    "(let [rows (edn/read-string (slurp *in*))] (prn (mapv (fn [{case-name :case :keys [operation args]}] "
                    "{:case case-name :result (try {:value (apply (case operation :status-policy? law/status-policy? :admit publication/admit "
                    ":publication-plan publication/publication-plan :status-plan publication/status-plan) args)} "
                    "(catch Exception _ {:threw true}))}) rows)))")
        result (cp/spawnSync "bb" #js ["-cp" "packages/eta-mu/src/cljs" "-e" script]
                             #js {:encoding "utf8" :input (pr-str rows) :timeout 30000})]
    (is (= 0 (.-status result)) (str (.-stdout result) (.-stderr result)))
    (is (= "" (.-stderr result)) "Babashka diagnostics remain qualification failures")
    (when (= 0 (.-status result))
      (let [actual (reader/read-string (.-stdout result))]
        (is (= (count expected) (count actual)))
        (doseq [[expected-row actual-row] (map vector expected actual)]
          (is (= expected-row actual-row) (str "Complete NBB/Babashka data parity: " (:case expected-row)))))
      (println "Complete NBB/Babashka parity cases:" (count rows)))))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/domain/review_publication.cljc")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/domain/review_publication.cljc")))
(when (= nbb/*file* (nbb/invoked-file))
  (test/run-tests 'opencode-review-publish-test))
