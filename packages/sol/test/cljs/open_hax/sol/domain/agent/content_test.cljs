(ns open-hax.sol.domain.agent.content-test
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.sol.domain.agent.content :as c]))

(deftest nonblank-trims-and-returns
  (testing "Returns trimmed non-blank string"
    (is (= "hello" (c/nonblank "  hello  "))))
  (testing "Returns nil for blank strings"
    (is (nil? (c/nonblank "   ")))
    (is (nil? (c/nonblank "")))
    (is (nil? (c/nonblank nil)))
    (is (nil? (c/nonblank 42)))))

(deftest fenced-wraps-in-code-block
  (testing "Wraps text in fenced code block"
    (is (= "```js\nconsole.log(1)\n```"
           (c/fenced "js" "console.log(1)")))
    (is (= "```\n\n```"
           (c/fenced nil nil)))))

(deftest content-part-label-returns-kind
  (testing "Returns correct label for each type"
    (is (= "image" (c/content-part-label {:type :image})))
    (is (= "image" (c/content-part-label {:type "image"})))
    (is (= "audio file" (c/content-part-label {:type :audio})))
    (is (= "video" (c/content-part-label {:type :video})))
    (is (= "document" (c/content-part-label {:type :document})))
    (is (= "attachment" (c/content-part-label {:type :unknown})))
    (is (= "attachment" (c/content-part-label {})))))

(deftest content-part-name-fallback
  (testing "Returns filename, url, or label"
    (is (= "test.png" (c/content-part-name {:filename "test.png" :type :image})))
    (is (= "http://example.com/img.png" (c/content-part-name {:url "http://example.com/img.png" :type :image})))
    (is (= "image" (c/content-part-name {:type :image})))))

(deftest tool-result-media-type-maps-types
  (testing "Maps OpenAI-style types to media kinds"
    (is (= "image" (c/tool-result-media-type "image")))
    (is (= "image" (c/tool-result-media-type "image_url")))
    (is (= "image" (c/tool-result-media-type "output_image")))
    (is (= "audio" (c/tool-result-media-type "audio")))
    (is (= "audio" (c/tool-result-media-type "input_audio")))
    (is (= "video" (c/tool-result-media-type "video")))
    (is (= "document" (c/tool-result-media-type "file")))
    (is (= "document" (c/tool-result-media-type "output_file")))
    (is (nil? (c/tool-result-media-type "text")))
    (is (nil? (c/tool-result-media-type nil)))))

(deftest merge-content-parts-deduplicates
  (testing "Merges and deduplicates parts"
    (let [p1 {:type :image :url "a.png"}
          p2 {:type :text :text "hello"}
          p3 {:type :image :url "a.png"}]
      (is (= [p1 p2] (c/merge-content-parts [p1] [p2] [p3])))))
  (testing "Handles nil groups"
    (is (= [{:type :text :text "hi"}]
           (c/merge-content-parts nil [{:type :text :text "hi"}] nil)))))

(deftest session-message-text-from-string-content
  (testing "Returns string content directly"
    (is (= "hello" (c/session-message-text #js {:content "hello"})))))

(deftest session-message-text-from-array-content
  (testing "Joins text parts from array content"
    (is (= "hello\n\nworld"
           (c/session-message-text #js {:content #js [#js {:type "text" :text "hello"}
                                                       #js {:type "text" :text "world"}]})))))

(deftest session-message-text-fallback
  (testing "Falls back to message text property"
    (is (= "fallback" (c/session-message-text #js {:text "fallback"}))))
  (testing "Returns empty string for no content"
    (is (= "" (c/session-message-text #js {})))))

(deftest reply-attachment-content-parts-filters
  (testing "Filters for workspace_media.attach tool receipts"
    (let [receipts [{:tool_name "workspace_media.attach"
                     :content_parts [{:type "image" :url "a.png"}]}
                    {:tool_name "other.tool"
                     :content_parts [{:type "text" :text "hi"}]}]]
      (is (= [{:type "image" :url "a.png"}]
             (c/reply-attachment-content-parts receipts))))))
