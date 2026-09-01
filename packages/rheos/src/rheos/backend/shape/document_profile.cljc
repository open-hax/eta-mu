(ns rheos.backend.shape.document-profile
  "Pure decoding and assembly for the Rheos Markdown document profile."
  (:require [clojure.string :as str]
            #?(:clj [clojure.edn :as edn]
               :cljs [cljs.reader :as edn])
            [rheos.backend.law.document-profile :as law]))

(def profile-marker "document-process/v1")

(def ^:private profile-fields
  [[:rheos-document :document/id "rheos-document is required"]
   [:rheos-contract :document/contract "rheos-contract is required"]
   [:rheos-resource :document/resource "rheos-resource is required"]
   [:rheos-schema :document/schema "rheos-schema is required"]
   [:rheos-sidecar :document/sidecar "rheos-sidecar is required"]])

(defn- nonblank [value]
  (some-> value str str/trim not-empty))

(defn- reference-id [value]
  (some-> value nonblank keyword))

(defn- profile-error [[frontmatter-key _ message]]
  {:error/code :profile/missing-field
   :error/message message
   :error/path [frontmatter-key]})

(defn decode-profile
  "Decode the flat scalar adapter profile from a lossless Markdown document.

   Returns nil when the document is unprofiled, otherwise a result map with
   `:ok` and either `:profile` or `:errors`. Structural values stay in EDN."
  [document]
  (let [frontmatter (:document/frontmatter-data document)
        marker (nonblank (:rheos-profile frontmatter))]
    (cond
      (nil? marker) nil

      (not= profile-marker marker)
      {:ok false
       :errors [{:error/code :profile/unsupported
                 :error/message (str "unsupported rheos-profile: " marker)
                 :error/path [:rheos-profile]}]}

      :else
      (let [missing (filterv (fn [[frontmatter-key]]
                               (nil? (nonblank (get frontmatter frontmatter-key))))
                             profile-fields)]
        (if (seq missing)
          {:ok false :errors (mapv profile-error missing)}
          (let [profile {:profile/id :rheos/document-process-v1
                         :document/id (nonblank (:rheos-document frontmatter))
                         :document/contract
                         {:contract/id (reference-id (:rheos-contract frontmatter))}
                         :document/resource
                         {:resource/id (reference-id (:rheos-resource frontmatter))}
                         :document/schema (reference-id (:rheos-schema frontmatter))
                         :document/sidecar (nonblank (:rheos-sidecar frontmatter))}]
            (if (law/valid-profile? profile)
              {:ok true :profile profile}
              {:ok false
               :errors [{:error/code :profile/invalid
                         :error/message "document profile failed its Malli law"}]})))))))

(defn- read-edn [raw]
  #?(:clj
     (try
       (let [forms (edn/read-string (str "[" raw "]"))]
         (if (= 1 (count forms))
           {:ok true :value (first forms)}
           {:ok false
            :errors [{:error/code :sidecar/invalid-edn
                      :error/message "sidecar must contain exactly one EDN form"}]}))
       (catch Exception _
         {:ok false
          :errors [{:error/code :sidecar/invalid-edn
                    :error/message "sidecar is not valid EDN"}]}))
     :cljs
     (try
       (let [forms (edn/read-string (str "[" raw "]"))]
         (if (= 1 (count forms))
           {:ok true :value (first forms)}
           {:ok false
            :errors [{:error/code :sidecar/invalid-edn
                      :error/message "sidecar must contain exactly one EDN form"}]}))
       (catch :default _
         {:ok false
          :errors [{:error/code :sidecar/invalid-edn
                    :error/message "sidecar is not valid EDN"}]}))))

(defn decode-sidecar [raw]
  (let [decoded (read-edn raw)]
    (if-not (:ok decoded)
      decoded
      (if (law/valid-sidecar? (:value decoded))
        {:ok true :sidecar (:value decoded)}
        {:ok false
         :errors [{:error/code :sidecar/invalid-shape
                   :error/message "sidecar failed the document-process Malli law"}]}))))

(defn- distinct-references [id-key references]
  (->> references
       (reduce (fn [{:keys [seen values] :as acc} reference]
                 (let [reference-id (get reference id-key)]
                   (if (contains? seen reference-id)
                     acc
                     {:seen (conj seen reference-id)
                      :values (conj values reference)})))
               {:seen #{} :values []})
       :values))

(defn- canonical-reference-id [reference-id]
  (if (keyword? reference-id)
    (subs (str reference-id) 1)
    (str reference-id)))

(defn- find-schema [schemas schema-id missing-schema]
  (let [canonical-schema-id (canonical-reference-id schema-id)]
    (reduce-kv (fn [result candidate-id schema-form]
                 (if (= canonical-schema-id
                        (canonical-reference-id candidate-id))
                   (reduced schema-form)
                   result))
               missing-schema
               schemas)))

(defn assemble
  "Merge one document profile with its parsed EDN sidecar.

   Markdown owns document identity/body. The sidecar owns structural process
   data and may contribute additional Katamorph references."
  [document profile sidecar source-path sidecar-path]
  (let [schema-id (:document/schema profile)
        missing-schema ::missing
        schema-form (find-schema (:process/schemas sidecar)
                                 schema-id
                                 missing-schema)]
    (if (= missing-schema schema-form)
      {:ok false
       :profile profile
       :errors [{:error/code :schema/not-found
                 :error/message (str "sidecar does not define schema " schema-id)
                 :error/path [:process/schemas schema-id]}]}
      (let [contracts (distinct-references
                       :contract/id
                       (into [(:document/contract profile)]
                             (or (:process/contracts sidecar) [])))
            resources (distinct-references
                       :resource/id
                       (into [(:document/resource profile)]
                             (or (:process/resources sidecar) [])))
            value (merge (:process/value sidecar)
                         {:document/id (:document/id profile)
                          :document/body (:document/body document)})
            assembled {:document/profile profile
                       :document/source-path source-path
                       :document/sidecar-path sidecar-path
                       :document/frontmatter-decoding
                       (:document/frontmatter-decoding document)
                       :document/body (:document/body document)
                       :document/contracts contracts
                       :document/resources resources
                       :document/schema schema-id
                       :document/schema-form schema-form
                       :document/value value}]
        (if (law/valid-assembled-document? assembled)
          {:ok true :document assembled}
          {:ok false
           :profile profile
           :errors [{:error/code :document/invalid-assembly
                     :error/message "assembled document failed its Malli law"}]})))))
