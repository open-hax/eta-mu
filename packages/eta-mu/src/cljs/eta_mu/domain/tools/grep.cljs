(ns eta-mu.domain.tools.grep
  "Pure decision logic for the `grep` tool: line matching, context windows,
  and output-line formatting for a single file's already-read content."
  (:require [clojure.string :as str]
            [eta-mu.domain.tools.truncate :as truncate]))

(defn- split-lines
  "Split file content into lines, normalizing CRLF/CR to LF."
  [content]
  (-> content
      (str/replace "\r\n" "\n")
      (str/replace "\r" "\n")
      (str/split #"\n" -1)))

(defn build-matcher
  "Build a predicate `(fn [line]) -> bool` from a search pattern.

  `literal?` treats `pattern` as a plain substring instead of a regex."
  [pattern {:keys [ignore-case? literal?]}]
  (if literal?
    (let [needle (cond-> pattern ignore-case? str/lower-case)]
      (fn [line] (str/includes? (cond-> line ignore-case? str/lower-case) needle)))
    (let [flags (if ignore-case? "i" "")
          re (js/RegExp. pattern flags)]
      (fn [line] (.test re line)))))

(defn matching-line-numbers
  "Return the 1-indexed line numbers of `lines` for which `matcher` is true."
  [lines matcher]
  (keep-indexed (fn [idx line] (when (matcher line) (inc idx))) lines))

(defn- format-block
  "Format one match (with surrounding context) into `path:n: text` /
  `path-n- text` lines, tracking whether any line was truncated."
  [relative-path lines line-number context]
  (let [total (count lines)
        start (max 1 (- line-number context))
        end (min total (+ line-number context))]
    (loop [current start block [] any-truncated? false]
      (if (> current end)
        {:block block :truncated? any-truncated?}
        (let [line-text (nth lines (dec current) "")
              {:keys [text truncated?]} (truncate/truncate-line line-text)
              sep (if (= current line-number) ":" "-")]
          (recur (inc current)
                 (conj block (str relative-path sep current sep " " text))
                 (or any-truncated? truncated?)))))))

(defn search-file
  "Search one file's already-read `content` for `pattern`, returning up to
  `limit` matches as formatted output blocks.

  `opts` — `{:ignore-case? bool :literal? bool :context int :limit int}`.

  Returns `{:blocks [\"path:n: text\" ...] :match-count int :lines-truncated? bool}`."
  [relative-path content pattern opts]
  (let [{:keys [context limit] :or {context 0 limit 100}} opts
        lines (split-lines content)
        matcher (build-matcher pattern opts)
        line-numbers (take limit (matching-line-numbers lines matcher))]
    (reduce
     (fn [acc line-number]
       (let [{:keys [block truncated?]} (format-block relative-path lines line-number context)]
         (-> acc
             (update :blocks into block)
             (update :match-count inc)
             (update :lines-truncated? #(or % truncated?)))))
     {:blocks [] :match-count 0 :lines-truncated? false}
     line-numbers)))
