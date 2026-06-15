(ns eta-mu.ai.message-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.ai.domain.message :as domain]
            [eta-mu.ai.extern.js :as extern]
            [eta-mu.ai.law.message :as law]
            [eta-mu.ai.shape.message :as shape]
            [malli.core :as m]))

(def timestamp 1780099200000)

(def usage-internal
  {:input 3
   :output 5
   :cache-read 7
   :cache-write 11
   :total-tokens 26
   :cost {:input 0.1
          :output 0.2
          :cache-read 0.03
          :cache-write 0.04
          :total 0.37}})

(deftest law-schema-validation-test
  (testing "canonical schemas accept valid payloads"
    (is (m/validate law/text-content-schema (domain/text-content "hello")))
    (is (m/validate law/image-content-schema (domain/image-content "aW1n" "image/png")))
    (is (m/validate law/audio-content-schema (domain/audio-content "YXVkaW8=" "audio/wav" :wav)))
    (is (m/validate law/thinking-content-schema (domain/thinking-content "hmm" "sig")))
    (is (m/validate law/tool-call-schema (domain/tool-call "call-1" "read" {:path "README.md"})))
    (is (m/validate law/user-message-schema (domain/user-message "hello" timestamp)))
    (is (m/validate law/assistant-message-schema
                    (domain/assistant-message
                     {:content [(domain/text-content "done")]
                      :api "openai-responses"
                      :provider "openai"
                      :model "gpt-test"
                      :usage usage-internal
                      :stop-reason :stop
                      :timestamp timestamp})))
    (is (m/validate law/tool-result-message-schema
                    (domain/tool-result-message
                     {:tool-call-id "call-1"
                      :tool-name "read"
                      :content [(domain/text-content "ok")]
                      :is-error false
                      :timestamp timestamp})))
    (is (m/validate law/context-schema
                    (domain/context
                     {:system-prompt "You are helpful"
                      :messages [(domain/user-message "hello" timestamp)]
                      :tools [(domain/tool "read" "Reads a file" [:map])]}))))

  (testing "canonical schemas reject malformed payloads"
    (is (not (m/validate law/image-content-schema {:type :image :data "aW1n"})))
    (is (not (m/validate law/audio-content-schema {:type :audio :data "x" :mime-type "audio/wav" :format :not-a-format})))
    (is (not (m/validate law/user-message-schema {:role :user :content [] :timestamp timestamp})))
    (is (not (m/validate law/assistant-message-schema
                         {:role :assistant
                          :content []
                          :api "openai-responses"
                          :provider "openai"
                          :model "gpt-test"
                          :usage usage-internal
                          :stop-reason :stop
                          :timestamp timestamp})))))

(deftest content-shape-roundtrip-test
  (testing "text/image/audio/thinking/tool-call parts round-trip through JS DTOs"
    (let [parts [(domain/text-content "hello" "sig:text")
                 (domain/image-content "aW1n" "image/png")
                 (domain/audio-content "YXVkaW8=" "audio/wav" :wav)
                 (domain/thinking-content "hmm" "sig:think" false)
                 (domain/tool-call "call-1" "read" {:path "README.md"} "sig:tool")]
          js-dtos (mapv shape/content->js parts)
          internal (mapv shape/content-from-js js-dtos)]
      (is (= [:text :image :audio :thinking :tool-call] (mapv :type internal)))
      (is (= "hello" (-> internal first :text)))
      (is (= "sig:text" (-> internal first :text-signature)))
      (is (= "aW1n" (-> internal second :data)))
      (is (= "image/png" (-> internal second :mime-type)))
      (is (= :wav (-> internal (nth 2) :format)))
      (is (= false (-> internal (nth 3) :redacted)))
      (is (= "call-1" (-> internal (nth 4) :id)))
      (is (= "sig:tool" (-> internal (nth 4) :thought-signature)))
      (is (= ["text" "image" "audio" "thinking" "toolCall"]
             (mapv #(-> % extern/value->clj :type) js-dtos)))
      (is (= "sig:text" (-> js-dtos first extern/value->clj :textSignature)))
      (is (= "wav" (-> js-dtos (nth 2) extern/value->clj :format)))))

  (testing "extensibility keys survive round-trips"
    (let [image (merge (domain/image-content "aW1n" "image/png") {:detail "high"})
          audio (merge (domain/audio-content "YXVkaW8=" "audio/wav" :wav) {:language "en"})
          js-image (shape/content->js image)
          js-audio (shape/content->js audio)]
      (is (= "high" (-> js-image extern/value->clj :detail)))
      (is (= "en" (-> js-audio extern/value->clj :language)))
      (is (= "high" (-> js-image shape/content-from-js :detail)))
      (is (= "en" (-> js-audio shape/content-from-js :language))))))

(deftest message-shape-roundtrip-test
  (testing "user, assistant, and tool-result messages round-trip"
    (let [user (domain/user-message [(domain/text-content "hello")] timestamp)
          assistant (domain/assistant-message
                     {:content [(domain/text-content "done" "sig:text")
                                (domain/thinking-content "trace" "sig:think" true)
                                (domain/tool-call "call-1" "read" {:path "README.md"} "sig:tool")]
                      :api "openai-responses"
                      :provider "openai"
                      :model "gpt-test"
                      :response-id "resp-1"
                      :usage usage-internal
                      :stop-reason :tool-use
                      :error-message "soft failure"
                      :timestamp timestamp})
          tool-result (domain/tool-result-message
                       {:tool-call-id "call-1"
                        :tool-name "read"
                        :content [(domain/text-content "ok")]
                        :details {:bytes 2}
                        :is-error false
                        :timestamp timestamp})
          js-dtos [(shape/message->js user)
                   (shape/message->js assistant)
                   (shape/message->js tool-result)]
          internal (mapv shape/message-from-js js-dtos)]
      (is (= [:user :assistant :tool-result] (mapv :role internal)))
      (is (= "hello" (-> internal first :content first :text)))
      (is (= "done" (-> internal second :content first :text)))
      (is (= true (-> internal second :content second :redacted)))
      (is (= "call-1" (-> internal second :content (nth 2) :id)))
      (is (= "resp-1" (-> internal second :response-id)))
      (is (= :tool-use (-> internal second :stop-reason)))
      (is (= "soft failure" (-> internal second :error-message)))
      (is (= "call-1" (-> internal (nth 2) :tool-call-id)))
      (is (= {:bytes 2} (-> internal (nth 2) :details)))
      (is (= ["user" "assistant" "toolResult"] (mapv #(-> % extern/value->clj :role) js-dtos)))
      (is (= "toolUse" (-> js-dtos second extern/value->clj :stopReason)))
      (is (= "resp-1" (-> js-dtos second extern/value->clj :responseId))))))

(deftest usage-shape-roundtrip-test
  (testing "usage converts cache and total token names both ways"
    (let [js-dto (shape/usage->js usage-internal)
          internal (shape/usage-from-js js-dto)
          js-clj (extern/value->clj js-dto)]
      (is (= 7 (:cacheRead js-clj)))
      (is (= 11 (:cacheWrite js-clj)))
      (is (= 26 (:totalTokens js-clj)))
      (is (= usage-internal internal)))))

(deftest tool-and-context-shape-roundtrip-test
  (testing "tools and contexts round-trip through JS DTOs"
    (let [tool (domain/tool "read" "Reads a file" [:map [:path [:string {:min 1}]]])
          context (domain/context
                   {:system-prompt "You are helpful"
                    :messages [(domain/user-message "hello" timestamp)]
                    :tools [tool]})
          js-dto (shape/context->js context)
          internal (shape/context-from-js js-dto)]
      (is (= "You are helpful" (-> js-dto extern/value->clj :systemPrompt)))
      (is (= "read" (-> internal :tools first :name)))
      (is (= "You are helpful" (:system-prompt internal)))
      (is (= 1 (count (:messages internal)))))))

(deftest malformed-js-rejected-test
  (testing "malformed JS DTOs are rejected during conversion"
    (is (thrown? cljs.core/ExceptionInfo (shape/content-from-js (extern/clj->value {:type "image" :data "aW1n"}))))
    (is (thrown? cljs.core/ExceptionInfo (shape/message-from-js (extern/clj->value {:role "assistant" :content [] :api "x" :provider "x" :model "x" :usage usage-internal :stopReason "stop" :timestamp timestamp}))))))
