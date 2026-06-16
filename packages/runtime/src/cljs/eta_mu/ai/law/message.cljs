(ns eta-mu.ai.law.message
  "Malli schemas for the canonical AI message/content-part model.

  Canonical shapes use kebab-case keywords. JS DTO conversions live in
  eta-mu.ai.shape.message and preserve the camelCase field names used by
  the legacy TypeScript provider layer.")

(def timestamp-schema
  [:int {:min 0}])

(def audio-format-schema
  [:enum :wav :mp3 :flac :ogg :webm :m4a :aac])

(def text-content-schema
  [:map
   [:type [:= :text]]
   [:text string?]
   [:text-signature {:optional true} [:string {:min 1}]]])

(def image-content-schema
  [:map
   [:type [:= :image]]
   [:data [:string {:min 1}]]
   [:mime-type [:string {:min 1}]]])

(def audio-content-schema
  [:map
   [:type [:= :audio]]
   [:data [:string {:min 1}]]
   [:mime-type [:string {:min 1}]]
   [:format {:optional true} audio-format-schema]])

(def input-content-schema
  [:or text-content-schema image-content-schema audio-content-schema])

(def thinking-content-schema
  [:map
   [:type [:= :thinking]]
   [:thinking string?]
   [:thinking-signature {:optional true} [:string {:min 1}]]
   [:redacted {:optional true} boolean?]])

(def tool-call-schema
  [:map
   [:type [:= :tool-call]]
   [:id [:string {:min 1}]]
   [:name [:string {:min 1}]]
   [:arguments map?]
   [:thought-signature {:optional true} [:string {:min 1}]]])

(def assistant-content-schema
  [:or text-content-schema thinking-content-schema tool-call-schema])

(def content-part-schema
  [:or text-content-schema image-content-schema audio-content-schema thinking-content-schema tool-call-schema])

(def usage-cost-schema
  [:map
   [:input [:and number? [:>= 0]]]
   [:output [:and number? [:>= 0]]]
   [:cache-read [:and number? [:>= 0]]]
   [:cache-write [:and number? [:>= 0]]]
   [:total [:and number? [:>= 0]]]])

(def usage-schema
  [:map
   [:input [:int {:min 0}]]
   [:output [:int {:min 0}]]
   [:cache-read [:int {:min 0}]]
   [:cache-write [:int {:min 0}]]
   [:total-tokens [:int {:min 0}]]
   [:cost usage-cost-schema]])

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
   [:response-id {:optional true} [:string {:min 1}]]
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

(def message-schema
  [:or user-message-schema assistant-message-schema tool-result-message-schema])

(def tool-schema
  [:map
   [:name [:string {:min 1}]]
   [:description [:string {:min 1}]]
   [:parameters any?]])

(def context-schema
  [:map
   [:system-prompt {:optional true} [:string {:min 1}]]
   [:messages [:vector message-schema]]
   [:tools {:optional true} [:vector tool-schema]]])
