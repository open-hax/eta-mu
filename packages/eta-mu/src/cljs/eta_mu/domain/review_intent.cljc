;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-intent
  "Pure replay and transition laws for one shared repository/M/context stream."
  (:require [eta-mu.law.review-intent :as law]
            [eta-mu.shape.review-intent :as shape]))

(defn- refused [reason] {:status :refused :reason reason})

(defn replay
  "Fold a complete Clio canonical stream. Clio validates global causality and
  schemas first; this fold independently checks exact publisher binding,
  predecessor, per-intent version, and active-slot exclusion."
  [lock-key events]
  (let [stream (shape/lock-stream lock-key)]
    (if-not stream
      (refused :lock-key)
      (loop [remaining (seq events), expected-seq 1, predecessor nil, intents {}]
        (if-let [event (first remaining)]
          (let [data (:event/data event)
                intent-key (:intent-key data)
                current-key (some #(when (law/portable-equal? % intent-key) %) (keys intents))
                current (get intents current-key)
                state (:state data)
                version (:intent-version data)
                causes (:event/causes event)
                active-before? (some #(contains? law/active-states (:state %)) (vals intents))
                valid-base? (and (law/intent-event? event)
                                 (= stream (:event/stream event))
                                 (law/portable-equal? expected-seq (:event/seq event))
                                 (law/portable-equal? lock-key (:lock-key data))
                                 (= (if predecessor [predecessor] []) causes))
                valid-state? (case state
                               :reserved (and (nil? current) (not active-before?)
                                              (law/portable-equal? 0 version))
                               :post-started (and current (= :reserved (:state current))
                                                  (law/portable-equal? (:version current) (dec version))
                                                  (law/text? (:owner data))
                                                  (law/text? (:claim-id data)))
                               :post-unknown (and current (= :post-started (:state current))
                                                  (law/portable-equal? (:version current) (dec version)))
                               :ambiguous-absence (and current (= :post-started (:state current))
                                                       (law/portable-equal? (:version current) (dec version)))
                               :observed (and current (contains? law/active-states (:state current))
                                              (law/portable-equal? (:version current) (dec version)))
                               false)
                same-binding? (or (nil? current)
                                  (law/portable-equal? (:binding current) (:binding data)))]
            (if-not (and valid-base? valid-state? same-binding?)
              (refused (cond
                         (not valid-base?) [:publisher-envelope expected-seq
                                            (:event/seq event) (:event/stream event) stream]
                         (not valid-state?) [:publisher-state state version current]
                         (not same-binding?) :publisher-binding))
              (recur (next remaining) (inc expected-seq) (:event/id event)
                     (assoc intents (or current-key intent-key)
                            {:state state :binding (:binding data)
                             :version (law/canonical-natural version)
                             :event-id (:event/id event) :event-seq expected-seq
                             :owner (:owner data) :claim-id (:claim-id data)}))))
          {:status :replayed :lock-key lock-key :stream stream :events (vec events)
           :intents intents :next-seq expected-seq :predecessor predecessor})))))

(defn transition
  "Produce a single append proposal from a freshly admitted binding and replay.
  The proposal itself carries no authority; infra must win the same Clio slot."
  [admission projection command]
  (let [binding (get-in admission [:binding])
        lock-key (:lock-key binding)
        lock-intents (when (= :replayed (:status projection))
                       (vals (:intents projection)))
        active? (some #(contains? law/active-states (:state %)) lock-intents)
        current-key (some #(when (law/portable-equal? % (:intent-key binding)) %)
                          (keys (:intents projection)))
        current (get-in projection [:intents current-key])
        requested (:state command)]
    (cond
      (not= :admitted (:status admission)) (refused :admission)
      (not (and (law/binding? binding)
                (law/portable-equal? lock-key (:lock-key projection)))) (refused :binding)
      (not= :replayed (:status projection)) (refused :history)
      (= requested :reserved)
      (if (or active? current)
        (refused :slot-occupied)
        {:status :append :state :reserved :event-seq (:next-seq projection)
         :intent-version 0 :causes (if-let [id (:predecessor projection)] [id] [])
         :event-data {:lock-key lock-key :intent-key (:intent-key binding)
                      :binding binding :state :reserved :intent-version 0
                      :owner nil :claim-id nil}})
      (= requested :post-started)
      (if (and current (= :reserved (:state current))
               (law/portable-equal? binding (:binding current))
               (law/portable-equal? (:version current) (:expected-version command))
               (law/text? (:owner command)) (law/text? (:claim-id command)))
        (let [version (inc (law/canonical-natural (:version current)))]
          {:status :append :state :post-started :event-seq (:next-seq projection)
           :intent-version version :causes [(:predecessor projection)]
           :event-data {:lock-key lock-key :intent-key (:intent-key binding)
                        :binding binding :state :post-started :intent-version version
                        :owner (:owner command) :claim-id (:claim-id command)}})
        (refused :claim))
      :else (refused :transition))))
