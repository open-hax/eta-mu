(ns rheos.backend.law.document-profile-test
  #?(:clj (:require [clojure.test :refer [deftest is testing]]
                    [rheos.backend.law.document-profile :as law])
     :cljs (:require [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.law.document-profile :as law])))

(def profile
  {:profile/id :rheos/document-process-v1
   :document/id "translation-review"
   :document/contract {:contract/id :translation/document-v1}
   :document/resource {:resource/id :workflow/translation-review}
   :document/schema :translation/document-v1
   :document/sidecar "translation-review.edn"})

(def assembled-document
  {:document/profile profile
   :document/source-path "/tasks/translation-review.md"
   :document/sidecar-path "/tasks/translation-review.edn"
   :document/frontmatter-decoding
   {:decoder/id :rheos/flat-frontmatter-v1
    :decode/status :partial
    :decode/capabilities #{:top-level-string-scalars}}
   :document/body "Translate this."
   :document/contracts [{:contract/id :translation/document-v1}]
   :document/resources [{:resource/id :workflow/translation-review}]
   :document/schema :translation/document-v1
   :document/schema-form [:map [:document/id :string] [:document/body :string]]
   :document/value {:document/id "translation-review"
                    :document/body "Translate this."}})

(def proposal-event
  {:event/type "rheos.document.file-change-proposed"
   :event/id "proposal-1"
   :event/time "2026-08-31T12:00:00.000Z"
   :session/id "test-session"
   :delivery/mode "tell"
   :payload {:type "document-file-change-proposed"
             :change/kind "change"
             :content/sha256 (apply str (repeat 64 "a"))
             :document assembled-document}})

(def rejection-event
  {:event/type "rheos.document.file-change-rejected"
   :event/id "rejection-1"
   :event/time "2026-08-31T12:00:00.000Z"
   :session/id "test-session"
   :delivery/mode "tell"
   :payload {:type "document-file-change-rejected"
             :change/kind "change"
             :document/source-path "/tasks/translation-review.md"
             :document/frontmatter-decoding
             {:decoder/id :rheos/flat-frontmatter-v1
              :decode/status :partial
              :decode/capabilities #{:top-level-string-scalars}}
             :errors [{:error/code :document/schema-invalid
                       :error/message "Document does not satisfy its schema."}]}})

(deftest profile-requires-every-adapter-reference
  (is (law/valid-profile? profile))
  (doseq [required-key [:document/id :document/contract :document/resource
                        :document/schema :document/sidecar]]
    (testing (str "missing " required-key)
      (is (not (law/valid-profile? (dissoc profile required-key)))))))

(deftest sidecar-keeps-structural-data-out-of-flat-yaml
  (is (law/valid-sidecar?
       {:process/schemas
        {:translation/document-v1
         [:map [:document/id :string] [:document/body :string]]}
        :process/value {:translation/language "fr"}
        :process/contracts [{:contract/id :translation/review-policy}]
        :process/resources [{:resource/id :translation/glossary}]}))
  (is (not (law/valid-sidecar? {:process/value {}}))))

(deftest event-type-is-correlated-with-payload-shape
  (is (law/valid-event? proposal-event))
  (is (law/valid-event? rejection-event))
  (is (not (law/valid-event?
            (assoc proposal-event :event/type
                   "rheos.document.file-change-rejected"))))
  (is (not (law/valid-event?
            (assoc rejection-event :event/type
                   "rheos.document.file-change-proposed")))))
