;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-positive-cohort-assessment-test
  "Actual canonical source with inert native transport; no model/native agreement credit."
  (:require [cljs.test :refer [deftest is async run-tests]] [clojure.string :as str]
            [test-positive-thread :as fixture]
            [pr-flow.positive-thread :as positive]
            [eta-mu.infra.positive-cohort-assessment :as assessment]
            [eta-mu.extern.actionability-host :as host]))

(def accepted (apply str (repeat 64 "f")))
(def protocol "Inert protocol text; actual adopted canonical APIs supply all semantic admission.")
(defn refusal-code [f] (try (f) nil (catch :default e (:code (ex-data e)))))
(defn control []
  (let [{:keys [raws proposal assessment targets]} (fixture/cohort-fixture)
        raw (atom raws) issues (atom [proposal]) permissions (atom "admin") effects (atom [])
        cfg {:repo "open-hax/knoxx" :repository-database-id 1199983316 :pr-number 388
             :head (get-in (first fixture/seeds) [:root :commit_id])
             :thread-id (ffirst targets) :root-comment-id (second (first targets)) :proposal-id (:id proposal)
             :policy {:review/positive-bot-thread fixture/profile}
             :provenance {:repository "open-hax/eta-mu" :pull_request "388" :run_id "31" :run_attempt "1"
                          :workflow_sha (apply str (repeat 40 "d")) :workflow_ref "inert/protected/source"}}
        inventory {:head (:head cfg) :sha256 (apply str (repeat 64 "e")) :files []}
        read (fn [& args]
               (let [endpoint (second args)]
                 (cond
                   (= endpoint "repos/open-hax/knoxx/issues/388/comments") [@issues]
                   (str/includes? endpoint "/permission") {:permission @permissions}
                   (= endpoint "graphql")
                   (apply (get-in (fixture/cohort-collected @issues @raw []) [:deps :read-json]) args)
                   :else (throw (ex-info "Unexpected inert transport" {:args args})))))
        deps {:read-json read :history-text "" :protected-history-text ""
              :history-source {:source-kind "inert-fixture" :source-sha256 (host/sha256 "")}
              :protocol-text protocol :accepted-sha256 accepted
              :verify-sources! #(swap! effects conj :sources) :verify-run! #(swap! effects conj :run)
              :inventory! (fn [] inventory)
              :canonical-inventory! (fn [] {:head (apply str (repeat 40 "c")) :sha256 (host/sha256 protocol)
                                           :files [{:path "inert-canonical-source" :blob (apply str (repeat 40 "c"))
                                                    :text protocol :sha256 (host/sha256 protocol)}]})
              :publisher-proof! (fn [] {:user assessment/expected-publisher
                                       :repositories [{:id 1199983316 :full_name "open-hax/knoxx"}]})
              :get-comment! (fn [id] (some #(when (= id (:id %)) %) @issues))}
        snapshot (assessment/collect deps cfg)
        request (assessment/request! snapshot (:proposal-id cfg))
        input (assessment/prepare-input snapshot inventory request "" protocol (:provenance cfg))
        deps (assoc deps :verify-invocation! (fn [] {:source (:manifest input) :accepted-sha256 accepted
                                                   :submission {:event "APPROVE" :comments [] :summary (:body assessment)}})
                    :post! (fn [_ _ body]
                             (swap! effects conj :post)
                             (swap! issues conj (assoc assessment :body body))
                             (js/Promise.resolve {:outcome :posted :record {:id (:id assessment)}})))]
    {:raw raw :issues issues :permissions permissions :effects effects :config cfg :inventory inventory
     :input input :deps deps :assessment assessment}))

(deftest unresolved-pins-refuse-without-native-or-inference-effects
  (with-redefs [assessment/dependency-pins {:canonical "UNADOPTED_POSITIVE_COHORT_V2"
                                           :muse "UNADOPTED_POSITIVE_COHORT_INPUT"}]
    (is (= :unadopted-dependency-pins (refusal-code assessment/require-protected-dependencies!))))
  (is (= "b23845012508fd598a56dea34d6be38ede5c7136" (:canonical assessment/dependency-pins)))
  (is (= "b9e47da4f445106310c7b9dc98fe3a3ef9ea50d5" (:muse assessment/dependency-pins))))

(deftest complete-two-member-input-and-source-rebinding
  (let [{:keys [deps config input raw]} (control) source (:manifest input)]
    (is (= "positive-cohort-assessment" (:purpose source)))
    (is (= "open-hax.positive-cohort-assessment-input/v1" (:schema source)))
    (is (= "positive-cohort-assessment-input.txt" (get-in source [:full_input :path])))
    (is (= 2 (count (get-in source [:target :cohort_targets]))))
    (is (not (contains? (:target source) :thread_id)))
    (doseq [s fixture/seeds]
      (is (str/includes? (:text input) (host/json (get-in s [:root :body]))))
      (is (str/includes? (:text input) (host/json (get-in s [:source :body])))))
    (is (= (:selected (assessment/collect deps config)) (:selected (assessment/rebind-input deps config source))))
    (doseq [bad [(assoc source :purpose "rejection-assessment")
                 (assoc source :proposal_id 1)
                 (assoc-in source [:target :cohort_targets] (pop (get-in source [:target :cohort_targets])))
                 (assoc-in source [:full_input :sha256] (apply str (repeat 64 "a")))]]
      (is (= :fresh-input-binding (refusal-code #(assessment/rebind-input deps config bad)))))
    (swap! raw assoc-in [1 :comments :nodes 0 :body] "Actual other-member context changed.")
    (is (= :fresh-input-binding (refusal-code #(assessment/rebind-input deps config source))))))

(defn ^:async sole-append-control! [done]
  (try
    (let [{:keys [deps config effects issues]} (control)
          result (await (assessment/publish deps config))]
      (is (= :observed (:status result)))
      (is (= 1 (count (filter #{:post} @effects))))
      (is (= 2 (count @issues)))
      (is (every? :qualified? (:member-proofs result)))
      (is (every? #(false? (:settled? %)) (:member-proofs result)))
      (is (false? (:admitted result)))
      (is (false? (:resolution-performed result)))
      (is (false? (:review-credit result)))
      (let [refused? (try (await (assessment/publish deps config)) false (catch :default _ true))]
        (when-not refused? (is false "A duplicate fresh publication cannot write again"))
        (is (= 1 (count (filter #{:post} @effects))))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest actual-sole-append-qualifies-both-without-settlement-or-replay
  (async done (sole-append-control! done)))

(defn ^:async adverse-controls! []
  (doseq [variant [:omitted :scalar :uncertain :wrong-bot :self-app :extra-token-repository :permissions :adverse-event :missing-comments :inline-comments]]
    (let [{:keys [deps config effects permissions assessment] :as c} (control)
          snapshot (assessment/collect deps config)
          proposal (positive/latest-proposal (:selected snapshot))
          rows (nth (:payload (positive/protocol assessment)) 10)
          body (fixture/assessment-text (:selected snapshot) (:proposal-id config)
                                       (get-in proposal [:source :body-sha256])
                                       (case variant :omitted (pop rows) :scalar [42]
                                         :uncertain (assoc-in rows [1 2] "uncertain") rows))
          deps (assoc deps :verify-invocation! (fn [] {:source (get-in c [:input :manifest]) :accepted-sha256 accepted
                                                      :submission {:event (if (= variant :adverse-event) "REQUEST_CHANGES" "APPROVE")
                                                                   :comments (case variant :missing-comments nil :inline-comments [{:body "Inert adverse inline"}] []) :summary body}}))
          deps (case variant
                 :wrong-bot (assoc deps :publisher-proof! (fn [] {:user (assoc assessment/expected-publisher :node_id "BOT_wrong") :repositories []}))
                 :self-app (assoc deps :publisher-proof! (fn [] {:user {:login "github-actions" :id 41898282 :node_id "MDM6Qm90NDE4OTgyODI=" :type "Bot"}
                                                                :repositories [{:id 1199983316 :full_name "open-hax/knoxx"}]}))
                 :extra-token-repository (assoc deps :publisher-proof! (fn [] {:user assessment/expected-publisher
                                                                              :repositories [{:id 1199983316 :full_name "open-hax/knoxx"} {:id 1 :full_name "inert/extra"}]}))
                 :permissions (do (reset! permissions "read") deps)
                 deps)
          refused (try (await (assessment/publish deps config)) false (catch :default _ true))]
      (is refused (str variant))
      (is (empty? (filter #{:post} @effects)) (str variant)))))

(defn ^:async adverse-completion! [done]
  (try (await (adverse-controls!))
       (catch :default e (is false (str e)))
       (finally (done))))
(deftest adverse-member-principal-grant-and-permission-controls
  (async done (adverse-completion! done)))

(defn ^:async post-get-churn-control! [done]
  (try
    (let [{:keys [deps config raw effects]} (control)
          get (:get-comment! deps)
          changed (assoc deps :get-comment! (fn [id]
                                             (let [actual (get id)]
                                               (swap! raw assoc-in [1 :comments :nodes 0 :body] "Other member edited during GET.")
                                               actual)))
          result (await (assessment/publish changed config))]
      (is (= :unestablished (:status result)))
      (is (= :posted (:outcome result)))
      (is (= :post-get-context-change (:refusal-code result)))
      (is (= 1 (count (filter #{:post} @effects))))
      (is (false? (:retry-performed result))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest post-get-other-member-churn-retains-one-outcome-and-does-not-retry
  (async done (post-get-churn-control! done)))

(defn ^:async uncertain-post! [post r n body]
  (await (post r n body))
  {:outcome :uncertain :http-status nil})
(defn ^:async uncertain-post-control! [done]
  (try
    (let [{:keys [deps config effects]} (control)
          changed (assoc deps :post! (partial uncertain-post! (:post! deps)))
          result (await (assessment/publish changed config))]
      (is (= :unestablished (:status result)))
      (is (= :uncertain (:outcome result)))
      (is (:native-readback-observed result))
      (is (= 1 (count (filter #{:post} @effects))))
      (is (false? (:retry-performed result))))
    (catch :default e (is false (str e)))
    (finally (done))))
(deftest uncertain-native-post-keeps-observed-readback-without-success-credit
  (async done (uncertain-post-control! done)))

(run-tests 'opencode-positive-cohort-assessment-test)
