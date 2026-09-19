(ns open-hax.sol.law.episode-event
  "Sol's existing episode wire and principal-reference contracts.

   These shapes remain readable after retiring open-hax/event-ledger. Clio owns
   the durable event envelope, admission, history validation, and replay. Sol
   owns only the application payload; Axxium still owns principal authority."
  (:require [clio.law.schema :as clio-schema]
            [malli.core :as m]
            [malli.error :as me]))

(def resource-ref-schema
  [:map
   [:resource/id :string]
   [:resource/revision {:optional true} :string]])

(def principal-binding-schema
  [:map
   [:binding/version [:= 1]]
   [:principal/actor-id :string]
   [:principal/entity-id :string]
   [:principal/kind [:enum "human" "agent" "service" "automation"]]
   [:principal/org-id {:optional true} :string]
   [:actor/resource {:optional true} resource-ref-schema]])

(def actor-schema
  [:map
   [:actor-id :string]
   [:actor-kind :string]
   [:actor-node {:optional true} :string]
   [:principal/binding {:optional true} principal-binding-schema]])

(def envelope-schema
  [:map
   [:envelope/version {:optional true} [:= 1]]
   [:event/id {:optional true} :string]
   [:event/type :string]
   [:event/time {:optional true} :string]
   [:event/from {:optional true} actor-schema]
   [:event/to {:optional true} actor-schema]
   [:causal/root {:optional true} :string]
   [:causal/parent {:optional true} :string]
   [:causal/compensates {:optional true} :string]
   [:session/id {:optional true} :string]
   [:turn/id {:optional true} :string]
   [:run/id {:optional true} :string]
   [:episode/id {:optional true} :string]
   [:delivery/mode {:optional true} [:enum "tell" "ask" "stream" "ack-required"]]
   [:delivery/id {:optional true} :string]
   [:payload {:optional true} :map]
   [:contracts {:optional true} [:vector :string]]
   [:contract/refs {:optional true} [:vector resource-ref-schema]]
   [:expectations {:optional true} :map]])

(def stored-envelope-schema
  [:and envelope-schema
   [:map
    [:event/id [:string {:min 1}]]
    [:event/time [:string {:min 1}]]
    [:event/from [:map [:actor-id [:string {:min 1}]]]]
    [:episode/id [:string {:min 1}]]
    [:run/id [:string {:min 1}]]
    [:causal/root [:string {:min 1}]]]])

(def catalog
  {:sol/episode-emitted
   (clio-schema/event-schema :sol/episode-emitted stored-envelope-schema)})

(defn validate-envelope
  "Validate the public Sol payload without loading a database driver."
  [envelope]
  (if (m/validate envelope-schema envelope)
    {:valid true}
    {:valid false
     :errors (me/humanize (m/explain envelope-schema envelope))}))

(defn validate-stored-envelope!
  [envelope]
  (when-not (m/validate stored-envelope-schema envelope)
    (throw (ex-info "Sol episode is missing durable identity or attribution"
                    {:sol/error :sol.clio/invalid-episode
                     :errors (me/humanize
                              (m/explain stored-envelope-schema envelope))})))
  envelope)
