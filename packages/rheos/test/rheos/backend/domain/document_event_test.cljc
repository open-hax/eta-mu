(ns rheos.backend.domain.document-event-test
  #?(:clj (:require [clojure.test :refer [deftest is testing]]
                    [rheos.backend.domain.document-event :as event]
                    [rheos.backend.law.document-profile :as law])
     :cljs (:require [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.domain.document-event :as event]
                     [rheos.backend.law.document-profile :as law])))

(def profile
  {:profile/id :rheos/document-process-v1
   :document/id "translation-review"
   :document/contract {:contract/id :translation/document-v1}
   :document/resource {:resource/id :workflow/translation-review}
   :document/schema :translation/document-v1
   :document/sidecar "translation-review.edn"})

(def assembled
  {:document/profile profile
   :document/source-path "/workspace/translation.md"
   :document/sidecar-path "/workspace/translation.edn"
   :document/frontmatter-decoding
   {:decoder/id :rheos/flat-frontmatter-v1
    :decode/status :partial
    :decode/capabilities #{:top-level-string-scalars}}
   :document/body "Translate this."
   :document/contracts [{:contract/id :translation/document-v1}]
   :document/resources [{:resource/id :workflow/translation-review}]
   :document/schema :translation/document-v1
   :document/schema-form
   [:map {:closed true}
    [:document/id :string]
    [:document/body :string]
    [:translation/language :string]]
   :document/value {:document/id "translation-review"
                    :document/body "Translate this."
                    :translation/language "fr"}})

(def context
  {:board-id "knowledge"
   :event-id "event-1"
   :event-time "2026-08-31T00:00:00.000Z"
   :change-kind "change"
   :content-sha256 (apply str (repeat 64 "a"))
   :source-path "/workspace/translation.md"
   :sidecar-path "/workspace/translation.edn"
   :frontmatter-decoding (:document/frontmatter-decoding assembled)
   :profile profile})

(deftest katamorph-validates-the-assembled-value
  (is (:ok (event/adjudicate {:ok true :document assembled})))
  (let [result (event/adjudicate
                {:ok true
                 :document (assoc assembled :document/value
                                  {:document/id "translation-review"
                                   :document/body "Translate this."
                                   :translation/language 42})})]
    (is (false? (:ok result)))
    (is (= :schema/invalid-value (get-in result [:errors 0 :error/code])))))

(deftest proposal-carries-contract-resource-and-decoder-provenance
  (let [envelope (event/proposal-envelope context assembled)]
    (is (law/valid-event? envelope))
    (is (= "rheos.document.file-change-proposed" (:event/type envelope)))
    (is (= [:translation/document-v1] (:contracts envelope)))
    (is (= [{:contract/id :translation/document-v1}] (:contract/refs envelope)))
    (is (= [{:resource/id :workflow/translation-review}] (:resource/refs envelope)))
    (is (= :partial
           (get-in envelope
                   [:payload :document :document/frontmatter-decoding
                    :decode/status])))))

(deftest rejection-carries-errors-and-never-a-document-value
  (let [envelope (event/rejection-envelope
                  context
                  [{:error/code :schema/invalid-value
                    :error/message "wrong type"
                    :error/path [:translation/language]}])]
    (is (law/valid-event? envelope))
    (is (= "rheos.document.file-change-rejected" (:event/type envelope)))
    (is (= :schema/invalid-value
           (get-in envelope [:payload :errors 0 :error/code])))
    (is (nil? (get-in envelope [:payload :document/value])))))

(deftest invalid-malli-form-is-a-typed-rejection
  (testing "an unreadable schema cannot escape as a thrown runtime error"
    (let [result (event/adjudicate
                  {:ok true
                   :document (assoc assembled :document/schema-form [:not-a-schema])})]
      (is (false? (:ok result)))
      (is (= :schema/invalid-form (get-in result [:errors 0 :error/code]))))))
