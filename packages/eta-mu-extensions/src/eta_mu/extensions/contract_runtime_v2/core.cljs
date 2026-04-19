(ns eta-mu.extensions.contract-runtime-v2.core
  (:require [clojure.string :as str]
            [cljs.reader :as reader]))

(def path-param-keys #{"path" "file" "dir" "root" "cwd" "target" "source" "dest"})

;; ── String / EDN utils ──────────────────────────────────────────

(defn strip-whitespace [s]
  (str/replace (or s "") #"\s+" ""))

(defn strip-comment-lines [text]
  (->> (str/split (or text "") #"\r?\n")
       (remove #(str/starts-with? (str/trim %) ";;"))
       (str/join "\n")))

(defn path-param-from-tool-call [params]
  (some (fn [k] (get params k)) path-param-keys))

(defn normalize-contract-forms [text]
  (let [cleaned (strip-comment-lines text)]
    (try
      (let [form (reader/read-string cleaned)]
        (cond
          (map? form)    [form]
          (vector? form) form
          :else          [{:contract/kind :unknown :raw cleaned}]))
      (catch :default _
        [{:contract/kind :unknown :raw (or text "")}]))))

(defn contract-kind [m]
  (or (:contract/kind m)
      (when (:actor/id m) :actor)
      nil))

(defn prompt-block-for-map [m raw-text]
  (let [kind (contract-kind m)]
    (cond
      (= kind :actor)
      (let [sys (:system m)]
        (cond
          (string? sys) sys
          (map? sys)    (str "[fn-ref: " (:fn-ref sys) "]")
          :else         nil))
      :else
      (or (:raw m) raw-text))))

(defn apply-map-dispatch [acc m raw-text]
  (let [kind   (contract-kind m)
        prompt (prompt-block-for-map m raw-text)]
    (cond-> acc
      (= kind :actor)       (update :actors      (fnil conj []) m)
      (= kind :policy)      (update :policies    (fnil conj []) m)
      (= kind :fulfillment) (update :fulfills    (fnil conj []) m)
      (= kind :capability)  (assoc-in [:caps  (str (:capability/id m))] m)
      (= kind :role)        (assoc-in [:roles (str (:role/id m))]        m)
      (and (string? prompt) (not (str/blank? prompt)))
      (update :prompt-blocks (fnil conj []) prompt))))

(defn build-prompt-append [principle-text prompt-blocks]
  (let [blocks (filter #(and (string? %) (not (str/blank? %)))
                       (concat [(when (and principle-text (not (str/blank? principle-text)))
                                  (str "## PRINCIPLE.edn\n\n" principle-text))]
                               prompt-blocks))]
    (when (seq blocks)
      (str "## Eta Mu Contract Runtime v2\n\n"
           "The following blocks were loaded from PRINCIPLE.edn and cwd-relative CONTRACT.edn files.\n"
           "Use them as active contract material. Unknown blocks are preserved as prompt text.\n\n"
           (str/join "\n\n" blocks)))))

(defn cache-entry-fresh? [now-ms entry ttl-ms]
  (when entry
    (< (- now-ms (get entry "loaded-at" 0)) ttl-ms)))

(defn walk-up-paths
  "Pure upward walk over path strings. Returns CONTRACT.edn candidate paths root->leaf.
   `join-path` and `dirname` are injected for testability."
  [join-path dirname start-dir stop-dir existing?]
  (loop [cur start-dir acc []]
    (let [candidate (join-path cur "CONTRACT.edn")
          acc*      (if (existing? candidate) (conj acc candidate) acc)
          parent    (dirname cur)]
      (if (or (= cur stop-dir) (= cur parent))
        (vec (reverse acc*))
        (recur parent acc*)))))

;; ── Policy evaluation ─────────────────────────────────────────
;;
;; Policy shape (EDN):
;;
;;   {:contract/kind   :policy
;;    :contract/id     "some.unique.id"
;;    :policy/on       :before-tool-call          ; required - when this fires
;;    :policy/match    {:tool/name "write_file"}  ; required - what it matches against
;;    :policy/action   :block | :warn | :note      ; required - what to do on match
;;    :policy/reason   "Human-readable explanation" ; optional
;;    :policy/ttl-ms   60000}                      ; optional - overrides global TTL
;;
;; Tool-call shape passed to evaluate-policies:
;;
;;   {:tool/name   "write_file"
;;    :tool/params {:path "/etc/passwd" ...}}
;;
;; Result shape:
;;
;;   {:action  :block | :warn | :note | :allow
;;    :reason  str | nil
;;    :policy  map | nil    ; the matching policy, if any
;;    :matches [map ...]    ; all matching policies
;;   }

(defn policy-matches?
  "True if policy fires for the given tool-call.
  Matching rules (AND across all keys present in :policy/match):
  - :tool/name  - exact string match
  - :tool/param - {param-key pred-or-val}: val = exact, fn = predicate"
  [policy tool-call]
  (let [match (get policy :policy/match {})]
    (every? (fn [[k v]]
              (cond
                (= k :tool/name)
                (= v (:tool/name tool-call))

                (= k :tool/params)
                (every? (fn [[pk pv]]
                          (let [actual (get-in tool-call [:tool/params pk])]
                            (if (fn? pv) (pv actual) (= pv actual))))
                        v)

                ;; unknown match key -> conservative: does not match
                :else false))
            match)))

(def action-severity
  "Higher number = more severe. Used to pick the strongest action."
  {:block 3 :warn 2 :note 1 :allow 0})

(defn strongest-action [actions]
  (->> actions
       (map #(get action-severity % 0))
       (apply max 0)
       (fn [n] (some (fn [[k v]] (when (= v n) k)) action-severity))))

(defn evaluate-policies
  "Pure reducer. Given a seq of policy maps and a tool-call map, returns a
  result map describing the strongest matching policy action.

  Nearest-wins TTL: policies with :policy/ttl-ms are considered time-sensitive;
  pass `now-ms` and `loaded-at` (ms) to enable TTL filtering.
  If ttl-ms is omitted, the policy is always active."
  ([policies tool-call]
   (evaluate-policies policies tool-call nil nil))
  ([policies tool-call now-ms loaded-at]
   (let [active  (filter (fn [p]
                           (let [ttl (get p :policy/ttl-ms)]
                             (if (and ttl now-ms loaded-at)
                               (< (- now-ms loaded-at) ttl)
                               true)))
                         policies)
         matches (filter #(policy-matches? % tool-call) active)]
     (if (empty? matches)
       {:action :allow :reason nil :policy nil :matches []}
       (let [action (strongest-action (map :policy/action matches))
             winner (first (filter #(= action (:policy/action %)) matches))]
         {:action  action
          :reason  (:policy/reason winner)
          :policy  winner
          :matches (vec matches)})))))
