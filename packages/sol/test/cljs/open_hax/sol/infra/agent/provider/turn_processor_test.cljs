(ns open-hax.sol.infra.agent.provider.turn-processor-test
  (:require [cljs.test :refer [deftest is testing]]
            [open-hax.sol.infra.agent.provider.turn-processor :as provider]))

(deftest multimodal-user-content-is-preserved
  (testing "image URLs and audio data reach the OpenAI request projection"
    (is (= [{:role "user"
             :content [{:type "text" :text "inspect"}
                       {:type "image_url"
                        :image_url {:url "https://example.invalid/image.png"}}
                       {:type "input_audio"
                        :input_audio {:data "dGVzdA==" :format "mp3"}}]}]
           (provider/messages->openai
            [{:role :user
              :content [{:type :text :text "inspect"}
                        {:type :image
                         :url "https://example.invalid/image.png"
                         :mime-type "image/png"}
                        {:type :audio
                         :data "dGVzdA=="
                         :mime-type "audio/mpeg"}]
              :timestamp 1}])))))

(deftest tool-result-media-follows-tool-message
  (testing "tool media is not flattened into a placeholder"
    (is (= [{:role "tool"
             :tool_call_id "call-1"
             :content "(see attached media)"}
            {:role "user"
             :content [{:type "text"
                        :text "Attached media from tool result:"}
                       {:type "image_url"
                        :image_url {:url "data:image/png;base64,aW1hZ2U="}}]}]
           (provider/messages->openai
            [{:role :tool-result
              :tool-call-id "call-1"
              :tool-name "capture"
              :content [{:type :image
                         :data "aW1hZ2U="
                         :mime-type "image/png"}]
              :is-error false
              :timestamp 1}])))))

(deftest unsupported-audio-url-is-explicit
  (testing "an unsupported remote audio URL is rejected instead of dropped"
    (is (thrown-with-msg?
         js/Error
         #"Audio content must be materialized"
         (provider/messages->openai
          [{:role :user
            :content [{:type :audio
                       :url "https://example.invalid/audio.mp3"
                       :mime-type "audio/mpeg"}]
            :timestamp 1}])))))
