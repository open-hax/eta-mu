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

(defn native-identity [raw actor-field]
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

(defn inline-comment [raw]
  (let [who (native-identity raw :user)]
    {:id (:id raw) :review-id (:pull_request_review_id raw) :head-sha (:commit_id raw)
     :actor (:actor who) :identity who
     :payload (cond-> (select-keys raw [:path :line :side :body])
                (some? (:start_line raw)) (assoc :start_line (:start_line raw))
                (some? (:start_side raw)) (assoc :start_side (:start_side raw))
                (some? (:in_reply_to_id raw)) (assoc :in_reply_to_id (:in_reply_to_id raw)))
     :position-state (field-state raw :line) :raw raw}))

(defn review [raw comments submitted-at-ms]
  (let [who (native-identity raw :user)]
    {:id (:id raw) :head-sha (:commit_id raw) :actor (:actor who) :publisher (:publisher who)
     :identity who :event ({"APPROVED" "APPROVE" "COMMENTED" "COMMENT"
                           "CHANGES_REQUESTED" "REQUEST_CHANGES"} (:state raw))
     :native-state (:state raw) :body (:body raw) :receipt-url (:html_url raw)
     :submitted-at-ms submitted-at-ms :comments (mapv inline-comment comments) :complete? true :raw raw}))

(defn status-row [raw merge-sha created-at-ms]
  (let [who (native-identity raw :creator)]
    {:id (:id raw) :sha merge-sha :sha-source :requested-commit-route
     :actor (:actor who) :publisher (:publisher who) :identity who
     :context (:context raw) :state (keyword (:state raw)) :receipt-url (:target_url raw)
     :receipt-state (field-state raw :target_url) :created-at-ms created-at-ms :raw raw}))
