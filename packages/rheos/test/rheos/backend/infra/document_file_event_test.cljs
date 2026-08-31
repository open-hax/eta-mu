(ns rheos.backend.infra.document-file-event-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [open-hax.openplanner-protocols :as protocols]
            [rheos.backend.infra.document-file-event :as document-file-event]
            [rheos.backend.infra.ledger :as ledger]))

(defn- tmp-dir []
  (path/join (.tmpdir os)
             (str "rheos-document-event-" (.now js/Date) "-" (rand-int 100000))))

(def fixture-root
  (path/resolve "test/fixtures/document-process"))

(defn- markdown-source [sidecar]
  (str "---\n"
       "rheos-profile: document-process/v1\n"
       "rheos-document: translation-review\n"
       "rheos-contract: translation/document-v1\n"
       "rheos-resource: workflow/translation-review\n"
       "rheos-schema: translation/document-v1\n"
       "rheos-sidecar: " sidecar "\n"
       "---\n"
       "Translate this document."))

(defn- sidecar-source [language-value]
  (str "{:process/schemas "
       "{:translation/document-v1 "
       "[:map {:closed true} [:translation/language :string] "
       "[:document/id :string] [:document/body :string]]} "
       ":process/value {:translation/language " language-value "} "
       ":process/contracts [{:contract/id :translation/review-policy}] "
       ":process/resources [{:resource/id :translation/glossary}]}"))

(deftest ^:async profiled-file-change-appends-one-valid-proposal
  (let [root (tmp-dir)
        markdown-path (path/join root "translation.md")
        sidecar-path (path/join root "translation-review.edn")
        fixture-markdown (await (.readFile fsp
                                           (path/join fixture-root "translation-review.md")
                                           "utf8"))
        fixture-sidecar (await (.readFile fsp
                                          (path/join fixture-root "translation-review.edn")
                                          "utf8"))]
    (await (.mkdir fsp root #js {:recursive true}))
    (await (.writeFile fsp markdown-path fixture-markdown "utf8"))
    (await (.writeFile fsp sidecar-path fixture-sidecar "utf8"))
    (try
      (let [result (await (document-file-event/handle-file-event!
                           "knowledge" root markdown-path "change"))
            recorded (await (protocols/query-events (ledger/get-ledger root) {}))]
        (is (= "rheos.document.file-change-proposed" (:event/type result)))
        (is (= 1 (count recorded)))
        (is (= :translation/document-v1
               (get-in result [:payload :document :document/schema])))
        (is (= "fr"
               (get-in result
                       [:payload :document :document/value
                        :translation/language]))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest ^:async invalid-schema-value-appends-rejection-not-proposal
  (let [root (tmp-dir)
        markdown-path (path/join root "translation.md")
        sidecar-path (path/join root "translation.edn")]
    (await (.mkdir fsp root #js {:recursive true}))
    (await (.writeFile fsp markdown-path (markdown-source "translation.edn") "utf8"))
    (await (.writeFile fsp sidecar-path (sidecar-source "42") "utf8"))
    (try
      (let [result (await (document-file-event/handle-file-event!
                           "knowledge" root markdown-path "add"))]
        (is (= "rheos.document.file-change-rejected" (:event/type result)))
        (is (= :schema/invalid-value
               (get-in result [:payload :errors 0 :error/code])))
        (is (nil? (get-in result [:payload :document/value]))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest ^:async escaping-sidecar-path-appends-a-typed-rejection
  (let [root (tmp-dir)
        markdown-path (path/join root "translation.md")]
    (await (.mkdir fsp root #js {:recursive true}))
    (await (.writeFile fsp markdown-path
                       (markdown-source "../../outside.edn") "utf8"))
    (try
      (let [result (await (document-file-event/handle-file-event!
                           "knowledge" root markdown-path "change"))]
        (is (= "rheos.document.file-change-rejected" (:event/type result)))
        (is (= :sidecar/path-escape
               (get-in result [:payload :errors 0 :error/code]))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest ^:async unprofiled-markdown-remains-outside-the-new-event-path
  (let [root (tmp-dir)
        markdown-path (path/join root "note.md")]
    (await (.mkdir fsp root #js {:recursive true}))
    (await (.writeFile fsp markdown-path "---\ntitle: Note\n---\nBody" "utf8"))
    (try
      (testing "no typed event is appended"
        (is (nil? (await (document-file-event/handle-file-event!
                          "knowledge" root markdown-path "change"))))
        (is (empty? (await (protocols/query-events (ledger/get-ledger root) {})))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))
