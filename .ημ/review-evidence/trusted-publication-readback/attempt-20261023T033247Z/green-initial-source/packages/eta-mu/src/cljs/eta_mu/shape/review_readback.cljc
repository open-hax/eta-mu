;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.shape.review-readback
  "Preserve raw native evidence, missing/null positions and native identities.
  An App ID comes only from the response, never the expected publisher."
  (:require [eta-mu.law.review-publication :as publication]))

(defn field-state [raw field]
  (cond (not (contains? raw field)) :missing (nil? (get raw field)) :null :else :observed))

(defn actor [raw]
  (when (and (map? raw) (publication/positive? (:id raw)) (publication/text? (:login raw))
             (contains? #{"Bot" "User" "Organization"} (:type raw)))
    {:id (:id raw) :login (:login raw) :type (case (:type raw) "Bot" :bot "User" :user :organization)}))

(defn identity [raw actor-field]
  (let [native-actor (actor (get raw actor-field))
        app (:performed_via_github_app raw)
        app-id (:id app)]
    {:source :native-api :actor-field actor-field
     :actor-state (field-state raw actor-field) :actor native-actor
     :app-state (field-state raw :performed_via_github_app)
     :app-id app-id :raw-actor (get raw actor-field) :raw-app app
     :installation-association :unsupported
     :publisher (when (and native-actor (publication/positive? app-id))
                  {:app-id app-id :actor native-actor})}))

(defn comment [raw]
  (let [who (identity raw :user)]
    {:id (:id raw) :review-id (:pull_request_review_id raw) :head-sha (:commit_id raw)
     :actor (:actor who) :identity who
     :payload (select-keys raw [:path :line :side :body])
     :position-state (field-state raw :line) :raw raw}))

(defn review [raw comments submitted-at-ms]
  (let [who (identity raw :user)]
    {:id (:id raw) :head-sha (:commit_id raw) :actor (:actor who) :publisher (:publisher who)
     :identity who :event ({"APPROVED" "APPROVE" "COMMENTED" "COMMENT"
                           "CHANGES_REQUESTED" "REQUEST_CHANGES"} (:state raw))
     :native-state (:state raw) :body (:body raw) :receipt-url (:html_url raw)
     :submitted-at-ms submitted-at-ms :comments (mapv comment comments) :complete? true :raw raw}))

(defn status-row [raw merge-sha created-at-ms]
  (let [who (identity raw :creator)]
    {:id (:id raw) :sha merge-sha :sha-source :requested-commit-route
     :actor (:actor who) :publisher (:publisher who) :identity who
     :context (:context raw) :state (keyword (:state raw)) :receipt-url (:target_url raw)
     :receipt-state (field-state raw :target_url) :created-at-ms created-at-ms :raw raw}))
