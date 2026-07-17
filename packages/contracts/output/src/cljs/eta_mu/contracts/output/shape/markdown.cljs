(ns eta-mu.contracts.output.shape.markdown
  "Pure ClojureScript markdown parsing for output contract gates.
   Produces an AST with enough structure for section extraction, node-type
   checks, and semantic item counting. No raw JS interop.

   AST node types are strings (\"paragraph\", \"heading\", etc.) to match the
   Malli schemas in eta-mu.contracts.output.law.contract."
  (:require [clojure.string :as str]
            [eta-mu.contracts.output.extern.js :as extern]))

(defn node-text
  "Recursively extract plain text from a markdown node."
  [node]
  (cond
    (nil? node) ""
    (string? (:value node)) (:value node)
    (seq (:children node)) (str/join "" (map node-text (:children node)))
    :else ""))

(defn- find-next-delimiter
  "Find the index of the next occurrence of delimiter in text starting at start."
  [text delimiter start]
  (str/index-of text delimiter start))

(defn- parse-inline-children
  "Parse inline emphasis/strong markers into text/emphasis/strong nodes."
  [text]
  (let [len (count text)]
    (loop [i 0
           children []
           current ""]
      (if (>= i len)
        (cond-> children
          (seq current) (conj {:type "text" :value current}))
        (let [c (nth text i)
              next-c (when (< (inc i) len) (nth text (inc i)))
              process-delimiter
              (fn [delim node-type]
                (let [delim-len (count delim)
                      end (find-next-delimiter text delim (+ i delim-len))]
                  (if end
                    [(+ end delim-len)
                     (cond-> children
                       (seq current) (conj {:type "text" :value current})
                       true (conj {:type node-type
                                   :children (parse-inline-children
                                              (subs text (+ i delim-len) end))}))
                     ""]
                    [(inc i) children (str current c)])))
              [i' children' current']
              (cond
                (and (= c \*) (= next-c \*)) (process-delimiter "**" "strong")
                (= c \*) (process-delimiter "*" "emphasis")
                (and (= c \_) (= next-c \_)) (process-delimiter "__" "strong")
                (= c \_) (process-delimiter "_" "emphasis")
                :else [(inc i) children (str current c)])]
          (recur i' children' current'))))))

(defn- heading-line? [line]
  (when-let [m (re-matches #"^(#{1,6})\s+(.*)$" line)]
    [(count (nth m 1)) (str/trim (nth m 2))]))

(defn- unordered-list-line? [line]
  (when-let [m (re-matches #"^[-*]\s+(.*)$" line)]
    (str/trim (nth m 1))))

(defn- ordered-list-line? [line]
  (when-let [m (re-matches #"^(\d+)\.\s+(.*)$" line)]
    [(extern/parse-int (nth m 1)) (str/trim (nth m 2))]))

(defn- blockquote-line? [line]
  (when-let [m (re-matches #"^>\s?(.*)$" line)]
    (nth m 1)))

(defn- code-fence-line? [line]
  (when-let [m (re-matches #"^(```+)\s*(\w*)$" line)]
    [(nth m 1) (nth m 2)]))

(defn- table-line? [line]
  (and (str/starts-with? line "|")
       (str/ends-with? line "|")))

(defn- thematic-break-line? [line]
  (re-matches #"^(---|\*\*\*|___)\s*$" line))

(defn- line-block-type
  "Classify a single markdown line by the block type it starts or continues."
  [line]
  (cond
    (str/blank? line) :blank
    (thematic-break-line? line) :thematic-break
    (heading-line? line) :heading
    (code-fence-line? line) :code-fence
    (table-line? line) :table
    (unordered-list-line? line) :unordered-list
    (ordered-list-line? line) :ordered-list
    (blockquote-line? line) :blockquote
    :else :paragraph))

(defn- continuable-block-type?
  [type]
  (#{:paragraph :unordered-list :ordered-list :blockquote :table} type))

(defn- split-into-blocks
  "Split markdown lines into blocks. A new block starts on every non-continuable
   block marker (heading, thematic break, code fence) and when the block type
   changes (e.g. paragraph → list). Consecutive continuable lines of the same
   type stay together."
  [lines]
  (letfn [(flush [current blocks]
            (if (seq current)
              (conj blocks (vec current))
              blocks))]
    (loop [lines lines
           current []
           current-type nil
           fence nil
           blocks []]
      (if (empty? lines)
        (flush current blocks)
        (let [line (first lines)
              type (line-block-type line)]
          (cond
            fence
            (let [new-current (conj current line)]
              (if (str/starts-with? line fence)
                (recur (rest lines) [] nil nil (flush new-current blocks))
                (recur (rest lines) new-current :code-fence fence blocks)))

            (= type :blank)
            (recur (rest lines) [] nil nil (flush current blocks))

            (= type :code-fence)
            (let [fence-marker (first (code-fence-line? line))]
              (recur (rest lines) [line] :code-fence fence-marker blocks))

            (or (nil? current-type) (= type current-type))
            (if (continuable-block-type? type)
              (recur (rest lines) (conj current line) type nil blocks)
              (recur (rest lines) [line] type nil (flush current blocks)))

            :else
            (recur (rest lines) [line] type nil (flush current blocks))))))))

(defn- heading-block? [block]
  (when-let [m (re-matches #"^(#{1,6})\s+(.*)$" (first block))]
    [(count (nth m 1)) (str/trim (nth m 2))]))

(defn- unordered-list-block? [block]
  (when (every? #(re-matches #"^[-*]\s+.*$" %) block)
    (mapv #(str/trim (subs % 2)) block)))

(defn- ordered-list-block? [block]
  (when (every? #(re-matches #"^(\d+)\.\s+.*$" %) block)
    (mapv #(str/trim (subs % (inc (str/index-of % ". ")))) block)))

(defn- blockquote-block? [block]
  (when (every? #(re-matches #"^>\s?.*$" %) block)
    (mapv #(or (second (re-matches #"^>\s?(.*)$" %)) "") block)))

(defn- code-fence-block? [block]
  (and (>= (count block) 2)
       (re-matches #"^(```+).*" (first block))
       (re-matches #"^(```+)\s*$" (last block))))

(defn- table-block? [block]
  (every? #(and (str/starts-with? % "|") (str/ends-with? % "|")) block))

(defn- thematic-break-block? [block]
  (and (= 1 (count block))
       (re-matches #"^(---|\*\*\*|___)\s*$" (first block))))

(defn- parse-table
  [block]
  {:type "table"
   :children (mapv (fn [row]
                     {:type "tableRow"
                      :children (mapv (fn [cell]
                                        {:type "tableCell"
                                         :children (parse-inline-children (str/trim cell))})
                                      (remove str/blank? (str/split row #"\|")))})
                   block)})

(defn- parse-block
  [block]
  (cond
    (thematic-break-block? block)
    {:type "thematicBreak"}

    (heading-block? block)
    (let [[depth text] (heading-block? block)]
      {:type "heading"
       :depth depth
       :children (parse-inline-children text)})

    (code-fence-block? block)
    {:type "code"
     :value (str/join "\n" (butlast (rest block)))}

    (table-block? block)
    (parse-table block)

    (unordered-list-block? block)
    (let [items (unordered-list-block? block)]
      {:type "list"
       :ordered false
       :children (mapv (fn [item]
                         {:type "listItem"
                          :children [{:type "paragraph"
                                      :children (parse-inline-children item)}]})
                       items)})

    (ordered-list-block? block)
    (let [items (ordered-list-block? block)]
      {:type "list"
       :ordered true
       :children (mapv (fn [item]
                         {:type "listItem"
                          :children [{:type "paragraph"
                                      :children (parse-inline-children item)}]})
                       items)})

    (blockquote-block? block)
    {:type "blockquote"
     :children [{:type "paragraph"
                 :children (parse-inline-children (str/join " " block))}]}

    :else
    {:type "paragraph"
     :children (parse-inline-children (str/join " " (map str/trim block)))}))

(defn parse-markdown-ast
  "Parse a markdown string into an AST shaped like MDAST."
  [markdown]
  {:type :root
   :children (mapv parse-block (split-into-blocks (str/split-lines markdown)))})

(def ^:private known-section-names
  #{"signal" "evidence" "frames" "countermoves" "next"})

(defn- paragraph->bold-heading
  "If paragraph is a single-line bold phrase matching a known section name,
   return an h2 heading node; otherwise nil."
  [node]
  (let [children (:children node)]
    (when (and (= (:type node) "paragraph")
               (or (= 1 (count children))
                   (= 2 (count children)))
               (= (:type (first children)) "strong"))
      (let [strong (first children)
            strong-children (:children strong)]
        (when (and (= 1 (count strong-children))
                   (= (:type (first strong-children)) "text"))
          (let [text-child (first strong-children)
                heading-text (-> (:value text-child)
                                 str/trim
                                 (str/replace #":$" ""))
                lower-text (str/lower-case heading-text)]
            (when (and (known-section-names lower-text)
                       (or (= 1 (count children))
                           (let [second-child (second children)]
                             (and (= (:type second-child) "text")
                                  (str/blank? (str/replace (:value second-child) #":$" ""))))))
              {:type "heading"
               :depth 2
               :children [{:type "text" :value heading-text}]})))))))

(defn- normalize-bold-headings
  "Convert top-level bold single-line paragraphs for known section names into
   h2 headings. Bold subheadings inside sections are NOT affected because they
   are nested inside section nodes, not top level."
  [ast]
  (update ast :children
          (fn [children]
            (mapv (fn [node]
                    (or (paragraph->bold-heading node) node))
                  children))))

(defn extract-markdown-sections
  "Extract top-level h2 sections from markdown. Returns an extracted document
   with ast, preface nodes, and sections."
  [markdown]
  (let [ast (normalize-bold-headings (parse-markdown-ast markdown))
        children (:children ast)]
    (loop [nodes children
           preface []
           sections []
           current nil]
      (if (empty? nodes)
        {:ast ast
         :prefaceNodes preface
         :sections (if current (conj sections current) sections)}
        (let [node (first nodes)]
          (if (and (= (:type node) "heading")
                   (= (:depth node) 2))
            (let [section {:heading (str/trim (node-text node))
                           :nodes []}]
              (recur (rest nodes)
                     preface
                     (if current (conj sections current) sections)
                     section))
            (if current
              (recur (rest nodes)
                     preface
                     sections
                     (update current :nodes conj node))
              (recur (rest nodes)
                     (conj preface node)
                     sections
                     current))))))))

(defn count-semantic-items
  "Count semantic items in a section for cardinality rules."
  [section]
  (reduce (fn [acc node]
            (cond
              (and (= (:type node) "list")
                   (seq (:children node)))
              (+ acc (count (:children node)))

              (#{"paragraph" "blockquote" "code" "table"} (:type node))
              (inc acc)

              :else acc))
          0
          (:nodes section)))
