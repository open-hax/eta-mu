(ns eta-mu.extensions.contract-runtime-v2.core
  (:require [clojure.string :as str]
            [cljs.reader :as reader]))

(def path-param-keys #{"path" "file" "dir" "root" "cwd" "target" "source" "dest"})

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
  (let [kind (contract-kind m)
        prompt (prompt-block-for-map m raw-text)]
    (cond-> acc
      (= kind :actor)
      (update :actors (fnil conj []) m)

      (= kind :policy)
      (update :policies (fnil conj []) m)

      (= kind :fulfillment)
      (update :fulfills (fnil conj []) m)

      (= kind :capability)
      (assoc-in [:caps (str (:capability/id m))] m)

      (= kind :role)
      (assoc-in [:roles (str (:role/id m))] m)

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
          acc* (if (existing? candidate) (conj acc candidate) acc)
          parent (dirname cur)]
      (if (or (= cur stop-dir) (= cur parent))
        (vec (reverse acc*))
        (recur parent acc*)))))
