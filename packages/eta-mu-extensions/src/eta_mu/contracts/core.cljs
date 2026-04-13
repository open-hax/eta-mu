(ns eta-mu.contracts.core
  "Core contract compilation and validation logic.
   Pure CLJS implementation - no external EDN parser needed."
  (:require [clojure.edn :as edn]
            [clojure.string :as str]
            [goog.object :as gobj]))

;; ============================================================
;; Contract Compilation (EDN → Normalized Contract)
;; ============================================================

(defn contract-compile-error
  [message]
  (ex-info message {:type :contract-compile-error}))

(defn keyword->id
  "Convert keyword to string id (strips leading colon)."
  [kw]
  (cond
    (keyword? kw) (name kw)
    (and (string? kw) (str/starts-with? kw ":")) (subs kw 1)
    :else (str kw)))

(defn- find-child
  [form head]
  (some (fn [entry]
          (when (and (sequential? entry) (= (first entry) head))
            entry))
        (rest form)))

(defn- require-child
  [form head]
  (or (find-child form head)
      (throw (contract-compile-error (str "Missing required form (" head " ...)")))))

(defn- list-children
  [form]
  (filter sequential? (rest form)))

(defn- parse-string-vector
  [value]
  (if (nil? value) [] (mapv keyword->id value)))

(defn compile-section
  [form]
  (let [id-elem (second (require-child form 'id))
        heading-elem (second (require-child form 'heading))
        required-elem (some-> (find-child form 'required) second)
        order-elem (some-> (find-child form 'order) second)
        cardinality-elem (some-> (find-child form 'cardinality) second keyword->id)
        allowed-types-elem (some-> (find-child form 'allowed-node-types) second)
        local-rules-elem (some-> (find-child form 'local-rules) second)]
    {:id (keyword->id id-elem)
     :heading (str heading-elem)
     :required (if (nil? required-elem) false (boolean required-elem))
     :order (or order-elem 0)
     :cardinality (if (= cardinality-elem "many") :many :one)
     :allowed-node-types (parse-string-vector allowed-types-elem)
     :local-rule-ids (parse-string-vector local-rules-elem)}))

(defn compile-rule
  [form]
  (let [id-elem (second (require-child form 'id))
        kind-elem (some-> (find-child form 'kind) second keyword->id)
        check-elem (some-> (find-child form 'check) second keyword->id)
        section-elem (some-> (find-child form 'section) second)
        min-elem (some-> (find-child form 'min) second)
        max-elem (some-> (find-child form 'max) second)
        exactly-elem (some-> (find-child form 'exactly) second)]
    (cond-> {:id (keyword->id id-elem) :kind kind-elem :check check-elem}
      section-elem (assoc :section-id (keyword->id section-elem))
      min-elem (assoc :min min-elem)
      max-elem (assoc :max max-elem)
      exactly-elem (assoc :exactly exactly-elem))))

(defn compile-repair-template
  [form]
  {:id (keyword->id (second (require-child form 'id)))
   :when-rule-id (keyword->id (second (require-child form 'when)))
   :text (str (second (require-child form 'text)))})

(defn compile-review-criterion
  [form]
  {:id (keyword->id (second (require-child form 'id)))
   :weight (second (require-child form 'weight))})

(defn compile-contract
  [source]
  (let [form (try (edn/read-string source)
                  (catch :default e
                    (throw (contract-compile-error (str "EDN parse error: " (.-message e))))))
        head (first form)
        _ (when (not= head 'agent-output-contract)
            (throw (contract-compile-error "Root form must be (agent-output-contract ...)")))
        name-elem (second (require-child form 'name))
        version-elem (second (require-child form 'v))
        target-form (require-child form 'target)
        structure-form (require-child form 'structure)
        rules-form (require-child form 'rules)
        repair-form (require-child form 'repair)
        review-form (require-child form 'review)
        sections (->> (list-children structure-form)
                      (filter #(= (first %) 'section))
                      (mapv compile-section)
                      (sort-by :order))
        rules (->> (list-children rules-form)
                   (filter #(= (first %) 'rule))
                   (mapv compile-rule))
        repair-templates (->> (list-children repair-form)
                              (filter #(= (first %) 'template))
                              (mapv compile-repair-template))
        review-criteria (some-> (find-child review-form 'criteria)
                                list-children
                                (->> (filter #(= (first %) 'criterion)))
                                (mapv compile-review-criterion))
        review-policy {:enabled (if-let [en (some-> (find-child review-form 'enabled) second)]
                                  (boolean en) true)
                       :reviewer-family (some-> (find-child review-form 'reviewer-family) second keyword->id)
                       :threshold (or (some-> (find-child review-form 'threshold) second) 0.8)
                       :criteria (or review-criteria [])}
        repair-max-retries (or (some-> (find-child repair-form 'max-retries) second) 0)]
    {:name (str name-elem)
     :version (str version-elem)
     :target-format (keyword->id (second (require-child target-form 'format)))
     :target-ast (keyword->id (second (require-child target-form 'ast)))
     :target-root (keyword->id (second (require-child target-form 'root)))
     :repair-max-retries repair-max-retries
     :sections sections
     :sections-by-id (zipmap (map :id sections) sections)
     :sections-by-heading (zipmap (map :heading sections) sections)
     :rules rules
     :rules-by-id (zipmap (map :id rules) rules)
     :repair-templates repair-templates
     :repair-templates-by-rule-id (group-by :when-rule-id repair-templates)
     :review review-policy}))

;; ============================================================
;; Markdown Extraction (simple regex-based for now)
;; ============================================================

(defn extract-markdown-sections
  "Extract sections from markdown using regex.
   Returns {:sections [{:heading, :content}]}."
  [markdown]
  (let [lines (str/split-lines markdown)
        sections (atom [])
        current-section (atom nil)]
    (doseq [line lines]
      (if-let [heading-match (re-matches #"^##\s+(.+)$" line)]
        (do
          (when @current-section
            (swap! sections conj @current-section))
          (reset! current-section {:heading (str/trim (second heading-match))
                                   :content (atom [])}))
        (when @current-section
          (swap! (:content @current-section) conj line))))
    (when @current-section
      (swap! sections conj @current-section))
    {:sections (mapv (fn [s] {:heading (:heading s)
                             :content (str/join "\n" @(:content s))})
                     @sections)}))

(defn count-semantic-items
  "Count semantic items in section content (paragraphs, list items)."
  [section]
  (let [content (:content section "")
        ;; Count bullet points and numbered items
        list-items (count (re-seq #"^\s*[-*+]|\d+\." content))
        ;; Count non-empty, non-heading lines
        non-empty-lines (count (filter #(and (not (str/blank? %))
                                             (not (re-matches #"^#" %)))
                                       (str/split-lines content)))]
    (max 1 (max list-items (int (/ non-empty-lines 3))))))

;; ============================================================
;; Validation
;; ============================================================

(defn build-failure
  [contract {:keys [rule-id section-id heading expected actual message]}]
  (merge {:rule-id (or rule-id "unknown")
          :message (or message (str "Violation of " rule-id))}
         (when section-id {:section-id section-id})
         (when heading {:heading heading})
         (when expected {:expected expected})
         (when actual {:actual actual})))

(defn validate-markdown-response
  [contract markdown]
  (let [{:keys [sections]} (extract-markdown-sections markdown)
        headings (map :heading sections)
        expected-headings (map :heading (:sections contract))
        failures (atom [])]
    ;; Check required sections
    (doseq [section-def (:sections contract)]
      (when (:required section-def)
        (when-not (some #(= (:heading section-def) %) headings)
          (swap! failures conj
                 (build-failure contract
                   {:rule-id "rule/required-section"
                    :section-id (:id section-def)
                    :heading (:heading section-def)
                    :message (str "Missing required section `" (:heading section-def) "`")})))))
    ;; Check section order
    (when-not (= headings (take (count headings) expected-headings))
      (swap! failures conj
             (build-failure contract
               {:rule-id "rule/section-order"
                :expected {:headings expected-headings}
                :actual {:headings headings}
                :message (str "Section order mismatch")})))
    ;; Check count rules
    (doseq [rule (:rules contract)]
      (when-let [section-id (:section-id rule)]
        (when-let [section-def (get (:sections-by-id contract) section-id)]
          (when-let [section (first (filter #(= (:heading section-def) (:heading %)) sections))]
            (let [count (count-semantic-items section)]
              (cond
                (and (:exactly rule) (not= count (:exactly rule)))
                (swap! failures conj
                       (build-failure contract
                         {:rule-id (:id rule)
                          :section-id section-id
                          :heading (:heading section-def)
                          :message (str "Section `" (:heading section-def) "` must have exactly " (:exactly rule) " items")}))

                (and (:min rule) (< count (:min rule)))
                (swap! failures conj
                       (build-failure contract
                         {:rule-id (:id rule)
                          :section-id section-id
                          :heading (:heading section-def)
                          :message (str "Section `" (:heading section-def) "` must have at least " (:min rule) " items")}))

                (and (:max rule) (> count (:max rule)))
                (swap! failures conj
                       (build-failure contract
                         {:rule-id (:id rule)
                          :section-id section-id
                          :heading (:heading section-def)
                          :message (str "Section `" (:heading section-def) "` must have at most " (:max rule) " items")}))))))))
    {:ok (empty? @failures)
     :sections sections
     :failures @failures}))

(defn to-failure-report
  [contract result]
  {:contract (:name contract)
   :version (:version contract)
   :stage "structure"
   :ok (:ok result)
   :failures (:failures result)})

(defn compile-repair-prompt
  [contract result]
  (when-not (:ok result)
    (str/join "\n\n"
      (for [failure (:failures result)]
        (or (:message failure) (str "Violation: " (:rule-id failure)))))))
