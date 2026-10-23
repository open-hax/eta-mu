;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-review-readback-test
  "Read-only inert native-protocol controls; never publication authentication."
  (:require [cljs.test :as test :refer [async deftest is]]
            [cljs.reader :as reader]
            [nbb.core :as nbb]
            [clojure.string :as str]
            [eta-mu.domain.review-publication :as publication]
            [eta-mu.law.review-publication :as publication-law]
            [eta-mu.law.review-collection :as collection-law]
            [eta-mu.extern.review-collection :as host]
            ["node:fs" :as fs]))

(nbb/await (nbb/load-file ".github/scripts/opencode_review_publish_test.cljs"))
(doseq [layer ["law" "shape" "domain" "infra"]]
  (let [file (str "packages/eta-mu/src/cljs/eta_mu/" layer "/review_readback."
                  (if (= layer "infra") "cljs" "cljc"))]
    (when (.existsSync fs file) (nbb/await (nbb/load-file file)))))

(defn call-api [name & args]
  (if-let [f (resolve (symbol "eta-mu.infra.review-readback" name))]
    (apply f args)
    {:status :unimplemented :reason :readback-runtime-missing :effects []}))

(defn request []
  (let [base ((resolve 'opencode-review-publish-test/fixture))
        now (host/wall-now)
        context (-> base (assoc :now-ms now)
                    (assoc-in [:snapshot :observed-at-ms] now)
                    (assoc-in [:snapshot :artifact :expires-at-ms] (+ now 1000000))
                    (assoc-in [:snapshot :artifact :archive-proof :completed-at-ms] now)
                    (assoc-in [:snapshot :verification :completed-at-ms] now))
        admission (publication/admit context)]
    {:registry (:registry context) :context context
     :intent {:state :observed :binding (:binding admission) :review-id 91
              :receipt-url "https://github.com/inert/fixture/pull/22#pullrequestreview-91"}
     :bounds {:requests 100 :pages 32 :bytes 1000000 :page-size 2 :operation-ms 10000}}))

(def prefix "https://api.github.com/repos/inert/fixture")
(def raw-actor {:id 7 :login "inert-publisher[bot]" :type "Bot"})
(def raw-app {:id 3152464 :slug "inert-publisher"})
(def at "2026-10-22T00:00:00Z")

(defn raw-review [r]
  {:id 91 :commit_id (get-in r [:intent :binding :tuple :head-sha])
   :state "COMMENTED" :body "Inert verified review." :user raw-actor
   :submitted_at at :html_url (get-in r [:intent :receipt-url])
   :pull_request_url (str prefix "/pulls/22")})

(defn raw-comment [r]
  {:id 101 :pull_request_review_id 91 :user raw-actor :path "src/inert.cljc"
   :line 3 :side "RIGHT" :position 1 :original_position 1 :original_line 3
   :body "Inert inline." :created_at at :updated_at at
   :commit_id (get-in r [:intent :binding :tuple :head-sha])
   :original_commit_id (get-in r [:intent :binding :tuple :head-sha])
   :pull_request_url (str prefix "/pulls/22")})

(defn raw-statuses [r]
  [{:id 113 :context "unrelated/a" :state "failure" :creator {:id 9 :login "someone" :type "User"}
    :created_at at :updated_at at :target_url nil}
   {:id 112 :context "unrelated/b" :state "success" :creator raw-actor
    :created_at at :updated_at at :target_url "https://example.invalid/other"}
   {:id 111 :context publication-law/context :state "success" :creator raw-actor
    :created_at at :updated_at at :target_url (get-in r [:intent :receipt-url])}])

(defn fixture-transport
  ([r calls] (fixture-transport r calls (fn [_ response] response)))
  ([r calls alter]
   (fn [{:keys [url] :as req}]
     (swap! calls conj req)
     (let [tuple (get-in r [:intent :binding :tuple])
           base (:base-sha tuple) head (:head-sha tuple) merge-sha (:merge-sha tuple)
           repository {:id 41 :full_name "inert/fixture" :private false}
           page-match (re-find #"\?per_page=(\d+)&page=(\d+)$" url)
           page-size (when page-match (reader/read-string (nth page-match 1)))
           page (when page-match (reader/read-string (nth page-match 2)))
           all (cond (str/includes? url "/reviews/91/comments?") [(raw-comment r)]
                     (str/includes? url "/statuses?") (raw-statuses r))
           rows (when all (vec (take page-size (drop (* (dec page) page-size) all))))
           data (cond
                  all rows
                  (= url prefix) repository
                  (= url (str prefix "/pulls/22"))
                  {:number 22 :state "open" :draft false :mergeable true
                   :base {:sha base :ref "main" :repo repository}
                   :head {:sha head :repo {:id 52 :full_name "contributor/repo" :private false}}}
                  (str/ends-with? url "/git/ref/heads/main")
                  {:ref "refs/heads/main" :object {:type "commit" :sha base}}
                  (str/ends-with? url "/git/ref/pull/22/merge")
                  {:ref "refs/pull/22/merge" :object {:type "commit" :sha merge-sha}}
                  (str/ends-with? url (str "/commits/" base))
                  {:sha base :commit {:tree {:sha (:head-tree tuple)}}}
                  (str/ends-with? url (str "/commits/" head))
                  {:sha head :commit {:tree {:sha (:head-tree tuple)}}}
                  (str/ends-with? url (str "/commits/" merge-sha))
                  {:sha merge-sha :commit {:tree {:sha (:merge-tree tuple)}}
                   :parents [{:sha base} {:sha head}]}
                  (str/includes? url "/compare/") {:status "ahead" :merge_base_commit {:sha base}}
                  (str/ends-with? url "/pulls/22/reviews/91") (raw-review r)
                  :else {:unexpected-url url})
           next-url (when (and all (< (* page page-size) (count all)))
                      (str (str/replace (first (str/split url #"\?")) #"/repos/inert/fixture" "/repositories/41")
                           "?page=" (inc page) "&per_page=" page-size))]
       (alter req {:status :ok :data data :bytes 100 :next-url next-url})))))

(deftest shared-transport-admits-only-exact-new-readback-routes
  (doseq [url [(str prefix "/pulls/22/reviews/91")
               (str prefix "/pulls/22/reviews/91/comments?per_page=2&page=1")
               (str prefix "/commits/" (get-in (request) [:intent :binding :tuple :merge-sha])
                    "/statuses?per_page=2&page=1")]]
    (is (collection-law/request? {:method :get :url url}))
    (is (not (collection-law/request? {:method :post :url url}))))
  (doseq [suffix ["/pulls/22/reviews" "/pulls/22/reviews/91/comments"
                  "/pulls/22/reviews/91?extra=1" "/pulls/22/reviews/91/comments?per_page=2&page=1&context=x"
                  "/commits/heads/main/statuses?per_page=2&page=1" "/statuses/main"]]
    (is (not (collection-law/request? {:method :get :url (str prefix suffix)})))))

(defn ^:async positive-control [done]
  (let [r (request) calls (atom [])
        result (await (call-api "readback-with!" r (fixture-transport r calls)))]
    (is (= :observed (:status result)) (pr-str result))
    (is (= :unsupported (:qualification result)))
    (is (= :inert-fixture (:transport result)))
    (is (= 2 (:snapshot-passes result)))
    (is (= :matched (get-in result [:comparison :review-content])))
    (is (= 3 (count (get-in result [:native :history :all-statuses]))))
    (is (= 1 (count (get-in result [:native :history :statuses]))))
    (is (= :missing (get-in result [:native :review :identity :app-state])))
    (is (nil? (get-in result [:native :review :publisher])))
    (is (= (raw-review r) (get-in result [:native :review :raw])))
    (is (= [(raw-comment r)] (mapv :raw (get-in result [:native :review :comments]))))
    (is (= [] (:effects result)))
    (is (every? #(= :get (:method %)) @calls))
    (is (= 40 (count @calls)) "Four live tuple reads bracket two complete observation passes.")
    (is (every? #(str/starts-with? (:url %) prefix) @calls)
        "Numeric repository Link targets are validated but every requested URL is rebuilt locally.")
    (done)))
(deftest actual-runtime-observes-stable-complete-pages-without-inventing-identity
  (async done (positive-control done)))

(defn ^:async payload-controls [done]
  (doseq [[label mutate]
          [[:review-body #(assoc % :body "forged")]
           [:review-head #(assoc % :commit_id (apply str (repeat 40 "f")))]
           [:review-event #(assoc % :state "APPROVED")]
           [:review-id #(assoc % :id 92)]
           [:review-actor #(assoc-in % [:user :id] 99)]]]
    (let [r (request) calls (atom [])
          transport (fixture-transport r calls (fn [{:keys [url]} response]
                                                (if (str/ends-with? url "/reviews/91")
                                                  (update response :data mutate) response)))
          result (await (call-api "readback-with!" r transport))]
      (is (= :refused (:status result)) (str label " " (pr-str result)))
      (is (= [] (:effects result)))))
  (doseq [[label mutate] [[:missing (fn [_] [])]
                         [:extra #(conj % (assoc (first %) :id 102))]
                         [:duplicate #(conj % (first %))]
                         [:body #(assoc-in % [0 :body] "forged")]
                         [:head #(assoc-in % [0 :commit_id] (apply str (repeat 40 "f")))]
                         [:membership #(assoc-in % [0 :pull_request_review_id] 92)]
                         [:null-position #(assoc-in % [0 :line] nil)]]]
    (let [r (request) calls (atom [])
          result (await (call-api "readback-with!" r
                         (fixture-transport r calls (fn [{:keys [url]} response]
                                                      (if (str/includes? url "/comments?")
                                                        (update response :data mutate) response)))))]
      (is (= :refused (:status result)) (str label " " (pr-str result)))
      (is (= [] (:effects result)))
      (when (= label :null-position)
        (is (= :null (get-in result [:native :review :comments 0 :position-state])))
        (is (= 3 (get-in result [:native :review :comments 0 :raw :original_line]))))))
  (done))
(deftest exact-review-and-every-inline-payload-are-compared-with-existing-publication-law
  (async done (payload-controls done)))

(defn ^:async pagination-controls [done]
  (doseq [[label alter]
          [[:malformed (fn [_ response] (assoc response :next-url "broken"))]
           [:wrong-route (fn [_ response] (assoc response :next-url (str prefix "/pulls/23/reviews/91/comments?per_page=2&page=2")))]
           [:wrong-page (fn [_ response] (assoc response :next-url (str prefix "/pulls/22/reviews/91/comments?per_page=2&page=9")))]
           [:duplicate-query (fn [_ response] (assoc response :next-url (str prefix "/pulls/22/reviews/91/comments?per_page=2&page=2&page=3")))]
           [:oversized-page (fn [_ response] (update response :data #(vec (repeat 3 (first %)))))]
           [:repeated-page (fn [_ response] (assoc response :data [(raw-comment (request))]
                                                 :next-url (str prefix "/pulls/22/reviews/91/comments?per_page=2&page=2")))]]]
    (let [r (request) calls (atom [])
          result (await (call-api "readback-with!" r
                         (fixture-transport r calls (fn [{:keys [url] :as req} response]
                                                      (if (str/includes? url "/comments?")
                                                        (alter req response) response)))))]
      (is (= :refused (:status result)) (str label " " (pr-str result)))
      (is (= [] (:effects result)))))
  (let [r (assoc-in (request) [:bounds :page-size] 1) calls (atom [])
        result (await (call-api "readback-with!" r (fixture-transport r calls)))]
    (is (= :observed (:status result)) (pr-str result))
    (is (= 2 (count (filter #(str/ends-with? (:url %) "/comments?per_page=1&page=2") @calls)))
        "A full terminal array without Link requires the next local empty page in each pass."))
  (done))
(deftest pagination-validates-components-and-proves-terminal-array-pages
  (async done (pagination-controls done)))

(defn ^:async history-controls [done]
  (doseq [mutate [#(assoc-in % [:data 0 :creator :id] 99)
                  #(assoc-in % [:data 0 :created_at] "2030-01-01T00:00:00Z")
                  #(assoc-in % [:data 0 :target_url] nil)
                  #(update % :data (fn [rows] (conj rows (first rows))))]]
    (let [r (request) calls (atom [])
          result (await (call-api "readback-with!" r
                         (fixture-transport r calls (fn [{:keys [url]} response]
                                                      (if (str/includes? url "/statuses?per_page=2&page=2")
                                                        (mutate response) response)))))]
      (is (= :refused (:status result)) (pr-str result))
      (is (some #(str/includes? (:url %) "/statuses?per_page=2&page=2") @calls))))
  (let [r (request) calls (atom [])
        result (await (call-api "readback-with!" r
                       (fixture-transport r calls
                         (fn [{:keys [url]} response]
                           (if (str/includes? url "/statuses?per_page=2&page=2")
                             (update response :data conj (assoc (first (:data response)) :id 110 :creator {:id 8 :login "unexpected" :type "Bot"}))
                             response)))))]
    (is (= :refused (:status result)))
    (is (= 2 (count (get-in result [:native :history :statuses])))
        "Unexpected writers in the exact context are retained, never filtered away."))
  (done))
(deftest complete-status-history-precedes-context-filtering-and-writer-checks
  (async done (history-controls done)))

(defn ^:async drift-controls [done]
  (doseq [suffix ["/git/ref/heads/main" "/git/ref/pull/22/merge" "/pulls/22"]]
    (let [r (request) calls (atom []) hits (atom 0)
          result (await (call-api "readback-with!" r
                         (fixture-transport r calls
                           (fn [{:keys [url]} response]
                             (if (and (str/ends-with? url suffix) (> (swap! hits inc) 12))
                               (assoc response :data {}) response)))))]
      (is (= :refused (:status result)) (str suffix " " (pr-str result)))))
  (let [r (request) calls (atom []) reviews (atom 0)
        result (await (call-api "readback-with!" r
                       (fixture-transport r calls
                         (fn [{:keys [url]} response]
                           (if (and (str/ends-with? url "/reviews/91") (= 2 (swap! reviews inc)))
                             (assoc-in response [:data :body] "changed between passes") response)))))]
    (is (= :refused (:status result))))
  (done))
(deftest live-tuple-and-two-pass-data-drift-refuse
  (async done (drift-controls done)))

(defn ^:async budget-controls [done]
  (doseq [[key limit] [[:requests 1] [:pages 1] [:bytes 1]]]
    (let [r (assoc-in (request) [:bounds key] limit) calls (atom [])
          result (await (call-api "readback-with!" r (fixture-transport r calls)))]
      (is (= :refused (:status result)))
      (is (= :overbudget (:reason result)))
      (is (= [] (:effects result)))))
  (let [r (request) calls (atom []) start (host/monotonic-now)
        result (await (with-redefs [host/monotonic-now (fn [] (+ start 20000 (count @calls)))]
                        (call-api "readback-with!" (assoc-in r [:bounds :operation-ms] 1)
                                  (fixture-transport r calls))))]
    ;; The actual time-bound response check is separately exercised by the transport below.
    (is (= :refused (:status result))))
  (let [r (request) calls (atom [])
        result (await (call-api "readback-with!" r
                       (fixture-transport r calls (fn [_ response] (assoc response :bytes 1000001)))))]
    (is (= :overbudget (:reason result))))
  (let [r (update-in (request) [:context :snapshot :observed-at-ms] - 400000) calls (atom [])
        result (await (call-api "readback-with!" r (fixture-transport r calls)))]
    (is (= :refused (:status result)))
    (is (empty? @calls)))
  (done))
(deftest request-page-byte-time-and-freshness-bounds-remain-visible
  (async done (budget-controls done)))

(defn ^:async production-controls [done]
  (let [r (request) calls (atom [])
        result (await (with-redefs [host/get! (fn [req] (swap! calls conj req) {})]
                        (call-api "readback!" r)))]
    (is (= :refused (:status result)))
    (is (= :registry (:reason result)))
    (is (= [] (:effects result)))
    (is (empty? @calls) "Caller registry/binding claims cannot enable an absent production registry."))
  (doseq [r [(assoc (request) :registry {})
             (assoc-in (request) [:registry :targets 0 :enabled?] false)
             (update-in (request) [:registry :targets 0] dissoc :setup)]]
    (let [calls (atom []) result (await (call-api "readback-with!" r (fixture-transport r calls)))]
      (is (= :refused (:status result)))
      (is (empty? @calls))))
  (done))
(deftest fixed-production-registry-and-enrollment-refuse-before-any-get
  (async done (production-controls done)))

(defmethod test/report [::test/default :end-run-tests] [result]
  (when-not (test/successful? result) (set! (.-exitCode js/process) 1)))
(test/run-tests 'opencode-review-readback-test)
