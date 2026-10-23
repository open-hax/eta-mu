;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-readback
  "Bounded read-only review/comments/status runtime. Reuses the fixed GET edge,
  live tuple collector and shared budget. No write or authentication authority."
  (:require [eta-mu.law.review-publication :as publication-law]
            [eta-mu.law.review-collection :as collection-law]
            [eta-mu.law.review-readback :as law]
            [eta-mu.shape.review-readback :as shape]
            [eta-mu.domain.review-publication :as publication]
            [eta-mu.domain.review-collection :as collection-domain]
            [eta-mu.domain.review-readback :as domain]
            [eta-mu.extern.review-collection :as host]
            [eta-mu.infra.review-collection :as collection]))

(defn- refuse [reason] {:status :refused :reason reason :qualification :unsupported :effects []})
(defn- fail! [reason] (throw (ex-info "Native readback refused" {:code reason})))

(defn- ^:async array-pages! [read route row? bounds repository-id]
  (loop [page 1 items []]
    (let [response (await (read (str route "?per_page=" (:page-size bounds) "&page=" page)))
          rows (:data response) next-url (:next-url response)
          all (when (vector? rows) (into items rows))]
      (when-not (and (vector? rows) (<= (count rows) (:page-size bounds))
                     (every? row? rows) (law/unique-rows? all))
        (fail! :pagination-shape-or-identity))
      (when (and (some? next-url)
                 (or (empty? rows)
                     (not (collection-law/pagination-link?
                            (host/decode-pagination-link next-url) repository-id
                            route page (:page-size bounds)))))
        (fail! :pagination))
      ;; Array endpoints expose no total_count. Even without Link, a full page
      ;; requires a further local page; never interpret a full page as absence.
      (if (or (some? next-url) (= (count rows) (:page-size bounds)))
        (recur (inc page) all)
        {:items all :pages page :complete? true :completeness :api-terminal-observed}))))

(defn- checked-time [now raw field]
  (let [time (host/parse-date-ms (get raw field))]
    (when-not (law/native-time? now time) (fail! :native-time))
    time))

(defn- ^:async observe! [read entry intent bounds]
  (let [binding (:binding intent) n (get-in binding [:tuple :pr-number])
        repository-id (get-in entry [:repository :id])
        root (str "https://api.github.com/repos/" (get-in entry [:repository :full-name]))
        pull-route (str root "/pulls/" n)
        review-route (str pull-route "/reviews/" (:review-id intent))
        merge-sha (get-in binding [:tuple :merge-sha])
        before (await (collection/read-tuple! read entry n))
        review-response (await (read review-route))
        raw-review (:data review-response)
        comments (await (array-pages! read (str review-route "/comments") law/raw-comment? bounds repository-id))
        statuses (await (array-pages! read (str root "/commits/" merge-sha "/statuses")
                                     law/raw-status? bounds repository-id))
        after (await (collection/read-tuple! read entry n))
        now (host/wall-now)]
    (when-not (= before after) (fail! :snapshot-drift))
    (when-not (and (law/raw-review? raw-review)
                   (= pull-route (:pull_request_url raw-review)))
      (fail! :native-review-shape))
    (doseq [comment (:items comments)]
      (when-not (= pull-route (:pull_request_url comment)) (fail! :comment-membership))
      (checked-time now comment :created_at)
      (checked-time now comment :updated_at))
    (let [all-statuses
          (mapv (fn [raw]
                  (when (and (contains? raw :sha) (not= merge-sha (:sha raw)))
                    (fail! :status-commit))
                  (shape/status-row raw merge-sha (checked-time now raw :created_at)))
                (:items statuses))]
      {:tuple {:before before :after after}
       :review (shape/review raw-review (:items comments) (checked-time now raw-review :submitted_at))
       :comments-pagination (dissoc comments :items)
       :history {:all-statuses all-statuses
                 ;; All native rows and IDs are traversed/validated before this
                 ;; context selection. A different writer in this context stays.
                 :statuses (filterv #(= publication-law/context (:context %)) all-statuses)
                 :pagination (dissoc statuses :items) :complete? true
                 :last-write-outcome :unobserved}})))

(defn- preflight [request]
  (let [registry (:registry request)
        context (assoc (:context request) :registry registry :now-ms (host/wall-now))
        collector (:collector context)
        admission (publication/admit context)
        intent (:intent request)]
    (cond
      (not= :accepted (collection-domain/enrollment registry (:target-id context)
                                                   (:mode collector) (:event collector)
                                                   (:fixture-id collector)))
      (refuse :enrollment)
      (not= :admitted (:status admission)) (refuse [:admission (:reason admission)])
      (not (and (= (:binding admission) (:binding intent))
                 (contains? #{:post-started :post-unknown :observed} (:state intent))
                 (publication-law/positive? (:review-id intent))
                 (publication-law/https-url? (:receipt-url intent))
                 (collection-law/bounds? (:bounds request)))) (refuse :request)
      :else admission)))

(defn- ^:async read-recorded! [get observations url]
  (let [response (await (get url))]
    (swap! observations conj (assoc response :url url))
    response))

(defn- ^:async collect! [request transport transport-kind]
  (let [initial (try (preflight request) (catch :default _ (refuse :request)))]
    (if-not (= :admitted (:status initial))
      initial
      (let [bounds (:bounds request) start (host/monotonic-now)
            {:keys [get state]} (collection/make-reader transport bounds start)
            observations (atom []) native (atom nil)
            read (partial read-recorded! get observations)
            decorate (fn [result]
                       (assoc result :transport transport-kind :native @native
                              :observations @observations :native-reads (:request-log @state)
                              :budgets (dissoc @state :request-log)))]
        (try
          (let [first-pass (await (observe! read (:entry initial) (:intent request) bounds))
                _ (reset! native first-pass)
                second-pass (await (observe! read (:entry initial) (:intent request) bounds))
                final (preflight request)]
            (when-not (= first-pass second-pass) (fail! :snapshot-drift))
            (when-not (and (= :admitted (:status final))
                           (= (:binding initial) (:binding final))) (fail! :admission-drift))
            (when (>= (- (host/monotonic-now) start) (:operation-ms bounds)) (fail! :overbudget))
            (decorate (assoc (domain/assess (host/wall-now) (:binding initial) (:intent request) first-pass)
                              :observed-at-ms (host/wall-now) :snapshot-passes 2
                              :registry-provenance (:registry-provenance request))))
          (catch :default error
            (decorate (refuse (or (:code (ex-data error)) :native-readback)))))))))

(defn ^:async readback-with!
  "Explicit inert fixture seam. Supplied native-shaped maps cannot authenticate
  a publisher or installation, even when they match every expected field."
  [request transport]
  (await (collect! request transport :inert-fixture)))

(defn ^:async readback!
  "Production read-only entry. Caller registry claims are replaced by the
  existing fixed registry reader before any GET. No token access or writes."
  [request]
  (let [{:keys [registry status reason bytes sha256]} (host/read-registry!)]
    (if (= :refused status)
      (refuse reason)
      (await (collect! (assoc request :registry registry
                                      :registry-provenance {:source-file-bytes bytes
                                                            :source-file-sha256 sha256
                                                            :adoption :unverified})
                       host/get! :fixed-public-get)))))
