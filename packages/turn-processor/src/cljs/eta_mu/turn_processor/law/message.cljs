(ns eta-mu.turn-processor.law.message
  "Malli schemas for agent messages and content parts.

  Canonical shapes use kebab-case keywords. These schemas are the contract
  surface for the turn processor; JS DTO conversions live in shape.message."
  (:require [malli.core :as m]))

(def timestamp-schema
  [:int {:min 0}])

(def text-content-schema
  [:map
   [:type [:= :text]]
   [:text string?]])

(def image-content-schema
  [:map
   [:type [:= :image]]
   [:data [:string {:min 1}]]
   [:mime-type [:string {:min 1}]]])

(def audio-content-schema
  [:map
   [:type [:= :audio]]
   [:data [:string {:min 1}]]
   [:mime-type [:string {:min 1}]]])

(def input-content-schema
  [:or text-content-schema image-content-schema audio-content-schema])

(def thinking-content-schema
  [:map
   [:type [:= :thinking]]
   [:thinking string?]])

(def tool-call-schema
  [:map
   [:type [:= :tool-call]]
   [:id [:string {:min 1}]]
   [:name [:string {:min 1}]]
   [:arguments map?]])

(def assistant-content-schema
  [:or text-content-schema thinking-content-schema tool-call-schema])

(def content-part-schema
  [:or text-content-schema image-content-schema audio-content-schema thinking-content-schema tool-call-schema])

(def usage-schema
  [:map
   [:input [:int {:min 0}]]
   [:output [:int {:min 0}]]
   [:cache-read [:int {:min 0}]]
   [:cache-write [:int {:min 0}]]
   [:total-tokens [:int {:min 0}]]])

(def stop-reason-schema
  [:enum :stop :length :tool-use :error :aborted])

(def user-message-schema
  [:map
   [:role [:= :user]]
   [:content [:or string? [:vector {:min 1} input-content-schema]]]
   [:timestamp timestamp-schema]])

(def assistant-message-schema
  [:map
   [:role [:= :assistant]]
   [:content [:vector {:min 1} assistant-content-schema]]
   [:api [:string {:min 1}]]
   [:provider [:string {:min 1}]]
   [:model [:string {:min 1}]]
   [:usage usage-schema]
   [:stop-reason stop-reason-schema]
   [:error-message {:optional true} [:string {:min 1}]]
   [:timestamp timestamp-schema]])

(def tool-result-message-schema
  [:map
   [:role [:= :tool-result]]
   [:tool-call-id [:string {:min 1}]]
   [:tool-name [:string {:min 1}]]
   [:content [:vector input-content-schema]]
   [:details {:optional true} any?]
   [:is-error boolean?]
   [:timestamp timestamp-schema]])

(def agent-message-schema
  [:or user-message-schema assistant-message-schema tool-result-message-schema])

(defn valid-message? [x]
  (m/validate agent-message-schema x))

(defn explain-message [x]
  (m/explain agent-message-schema x))
