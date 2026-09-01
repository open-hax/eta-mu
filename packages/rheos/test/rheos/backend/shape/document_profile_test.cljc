(ns rheos.backend.shape.document-profile-test
  #?(:clj (:require [clojure.test :refer [deftest is testing]]
                    [rheos.backend.shape.document-profile :as profile]
                    [rheos.backend.shape.markdown-document :as markdown])
     :cljs (:require [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.shape.document-profile :as profile]
                     [rheos.backend.shape.markdown-document :as markdown])))

(def markdown-source
  (str "---\n"
       "rheos-profile: document-process/v1\n"
       "rheos-document: translation-review\n"
       "rheos-contract: translation/document-v1\n"
       "rheos-resource: workflow/translation-review\n"
       "rheos-schema: translation/document-v1\n"
       "rheos-sidecar: translation-review.edn\n"
       "---\n"
       "Translate this document."))

(def sidecar-source
  (str "{:process/schemas "
       "{:translation/document-v1 "
       "[:map {:closed true} [:translation/language :string] "
       "[:document/id :string] [:document/body :string]]} "
       ":process/value {:translation/language \"fr\"} "
       ":process/contracts [{:contract/id :translation/review-policy} "
       "{:contract/id :translation/document-v1}] "
       ":process/resources [{:resource/id :translation/glossary}]}"))

(deftest flat-frontmatter-decodes-reference-profile
  (let [document (markdown/parse markdown-source)
        result (profile/decode-profile document)]
    (is (:ok result))
    (is (= :translation/document-v1
           (get-in result [:profile :document/contract :contract/id])))
    (is (= :workflow/translation-review
           (get-in result [:profile :document/resource :resource/id])))
    (is (= :partial
           (get-in document [:document/frontmatter-decoding :decode/status])))))

(deftest unprofiled-markdown-is-not-rejected
  (is (nil? (profile/decode-profile (markdown/parse "---\ntitle: Note\n---\nBody")))))

(deftest missing-profile-fields-fail-closed
  (let [document (markdown/parse
                  (str "---\nrheos-profile: document-process/v1\n"
                       "rheos-document: translation-review\n---\nBody"))
        result (profile/decode-profile document)]
    (is (false? (:ok result)))
    (is (= #{:rheos-contract :rheos-resource :rheos-schema :rheos-sidecar}
           (set (map (comp first :error/path) (:errors result)))))))

(deftest sidecar-decoding-and-merge-are-deterministic
  (let [document (markdown/parse markdown-source)
        document-profile (:profile (profile/decode-profile document))
        sidecar (:sidecar (profile/decode-sidecar sidecar-source))
        result (profile/assemble document document-profile sidecar
                                 "/workspace/translation.md"
                                 "/workspace/translation-review.edn")]
    (is (:ok result))
    (is (= {:translation/language "fr"
            :document/id "translation-review"
            :document/body "Translate this document."}
           (get-in result [:document :document/value])))
    (is (= [{:contract/id :translation/document-v1}
            {:contract/id :translation/review-policy}]
           (get-in result [:document :document/contracts]))
        "frontmatter owns the primary ref and duplicate sidecar refs collapse")
    (is (= [{:resource/id :workflow/translation-review}
            {:resource/id :translation/glossary}]
           (get-in result [:document :document/resources])))))

(deftest malformed-and-schema-less-sidecars-are-rejected
  (testing "malformed EDN"
    (is (= :sidecar/invalid-edn
           (get-in (profile/decode-sidecar "{") [:errors 0 :error/code]))))
  (testing "trailing EDN forms"
    (is (= :sidecar/invalid-edn
           (get-in (profile/decode-sidecar (str sidecar-source " {}"))
                   [:errors 0 :error/code]))))
  (testing "malformed trailing EDN"
    (is (= :sidecar/invalid-edn
           (get-in (profile/decode-sidecar (str sidecar-source " ["))
                   [:errors 0 :error/code]))))
  (testing "selected schema must exist"
    (let [document (markdown/parse markdown-source)
          document-profile (:profile (profile/decode-profile document))
          sidecar {:process/schemas {:other/schema [:map]}
                   :process/value {}}
          result (profile/assemble document document-profile sidecar "a.md" "a.edn")]
      (is (false? (:ok result)))
      (is (= :schema/not-found (get-in result [:errors 0 :error/code])))))
  (testing "string and keyword schema identifiers share one lookup identity"
    (let [document (markdown/parse markdown-source)
          document-profile (:profile (profile/decode-profile document))
          schema-form [:map]
          sidecar {:process/schemas {"translation/document-v1" schema-form}
                   :process/value {}}
          result (profile/assemble document document-profile sidecar "a.md" "a.edn")]
      (is (:ok result))
      (is (= schema-form (get-in result [:document :document/schema-form])))))
  (testing "duplicate canonical schema identifiers are ambiguous in either order"
    (let [document (markdown/parse markdown-source)
          document-profile (:profile (profile/decode-profile document))
          first-form [:map [:first :string]]
          second-form [:map [:second :string]]]
      (doseq [schemas [(array-map :translation/document-v1 first-form
                                  "translation/document-v1" second-form)
                       (array-map "translation/document-v1" second-form
                                  :translation/document-v1 first-form)]]
        (let [result (profile/assemble
                      document document-profile
                      {:process/schemas schemas :process/value {}}
                      "a.md" "a.edn")]
          (is (false? (:ok result)))
          (is (= :schema/ambiguous
                 (get-in result [:errors 0 :error/code])))))))
  (testing "string and keyword reference identifiers deduplicate canonically"
    (let [document (markdown/parse markdown-source)
          document-profile (:profile (profile/decode-profile document))
          sidecar {:process/schemas {:translation/document-v1 [:map]}
                   :process/value {}
                   :process/contracts [{:contract/id "translation/document-v1"}]
                   :process/resources [{:resource/id "workflow/translation-review"}]}
          result (profile/assemble document document-profile sidecar "a.md" "a.edn")]
      (is (:ok result))
      (is (= [{:contract/id :translation/document-v1}]
             (get-in result [:document :document/contracts])))
      (is (= [{:resource/id :workflow/translation-review}]
             (get-in result [:document :document/resources]))))))
