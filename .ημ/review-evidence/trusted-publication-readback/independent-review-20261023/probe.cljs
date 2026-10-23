;; SPDX-License-Identifier: GPL-3.0-or-later
(ns independent-readback-probe
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
(when (.existsSync fs "packages/eta-mu/src/cljs/eta_mu/infra/review_readback.cljs")
  (nbb/await (nbb/load-file "packages/eta-mu/src/cljs/eta_mu/infra/review_readback.cljs")))

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


(defn ^:async run-probes []
  (let [r (request)
        cases [[:review-url "/reviews/91" #(assoc % :html_url "https://example.invalid/wrong") :refused]
               [:review-membership "/reviews/91" #(assoc % :pull_request_url (str prefix "/pulls/23")) :refused]
               [:inline-actor "/comments?" #(mapv (fn [x] (assoc-in x [:user :login] "wrong")) %) :refused]
               [:inline-original-commit "/comments?" #(mapv (fn [x] (assoc x :original_commit_id (apply str (repeat 40 "f")))) %) :observed]
               [:inline-app-conflict "/comments?" #(mapv (fn [x] (assoc x :performed_via_github_app {:id 42})) %) :observed]
               [:status-commit "/statuses?" #(mapv (fn [x] (assoc x :sha (apply str (repeat 40 "f")))) %) :refused]
               [:status-unrelated-invalid-time "/statuses?" #(mapv (fn [x] (if (= "unrelated/a" (:context x)) (assoc x :created_at "invalid") x)) %) :refused]]]
    (loop [remaining cases rows []]
      (if-let [[label suffix mutate expected] (first remaining)]
        (let [calls (atom [])
              result (await (call-api "readback-with!" r
                              (fixture-transport r calls
                                (fn [{:keys [url]} response]
                                  (if (if (= suffix "/reviews/91") (str/ends-with? url suffix) (str/includes? url suffix)) (update response :data mutate) response)))))
              row {:case label :expected expected :status (:status result) :reason (:reason result)
                   :qualification (:qualification result) :effects (:effects result)
                   :calls (count @calls)
                   :inline-identity (get-in result [:native :review :comments 0 :identity])}]
          (when-not (and (= expected (:status result)) (= :unsupported (:qualification result)) (= [] (:effects result)))
            (throw (ex-info "Independent control failed" row)))
          (recur (next remaining) (conj rows row)))
        (prn {:source "6fa625cd66658d850241d0d3f762ef5eb6ba8746" :passed (count rows) :probes rows})))))
(nbb/await (run-probes))
