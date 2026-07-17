(ns eta-mu.terminal-ui.domain.markdown
  "Pure markdown-text -> styled-logical-line-vector transform for terminal
  rendering. Covers headers, bold/italic/inline code, fenced code blocks,
  bullet/numbered lists, and blockquotes. No syntax highlighting inside
  fences (v1 gap, recorded on the card).

  Output lines carry ANSI SGR styling via `shape.ansi` and are unwrapped —
  width wrapping happens downstream in `component.text`, which is
  ANSI-aware."
  (:require [clojure.string :as str]
            [eta-mu.terminal-ui.shape.ansi :as ansi]))

(defn- style-bold [segment]
  (-> segment
      (str/replace #"\*\*([^*]+)\*\*" (fn [[_ inner]] (ansi/bold inner)))
      (str/replace #"__([^_]+)__" (fn [[_ inner]] (ansi/bold inner)))))

(defn- style-italic [segment]
  (-> segment
      (str/replace #"(?<!\w)\*([^*\n]+)\*(?!\w)" (fn [[_ inner]] (ansi/dim inner)))
      (str/replace #"(?<!\w)_([^_\n]+)_(?!\w)" (fn [[_ inner]] (ansi/dim inner)))))

(defn style-inline
  "Apply inline styling to one logical line. Backtick-delimited code spans
  are styled yellow and their contents protected from bold/italic rules."
  [text]
  (let [parts (str/split (str text) #"`" -1)]
    (->> parts
         (map-indexed (fn [i seg]
                        (if (odd? i)
                          (ansi/fg :yellow seg)
                          (-> seg style-bold style-italic))))
         (str/join ""))))

(defn- render-header [line]
  (when-let [[_ hashes title] (re-matches #"(#{1,6})\s+(.*)" line)]
    (ansi/style [:bold :cyan] (str hashes " " (style-inline title)))))

(defn- render-bullet [line]
  (when-let [[_ indent marker body] (re-matches #"^(\s*)([-*+]|\d+\.)\s+(.*)$" line)]
    (str indent (ansi/fg :cyan marker) " " (style-inline body))))

(defn- render-blockquote [line]
  (when-let [[_ body] (re-matches #"^>\s?(.*)$" line)]
    (ansi/dim (str "│ " (style-inline body)))))

(defn- render-code-line [line]
  (ansi/fg :gray (str "│ " line)))

(def ^:private fence-border
  (ansi/fg :gray "╌╌╌"))

(defn- fence-line? [line]
  (str/starts-with? (str/trim line) "```"))

(defn markdown-lines
  "Transform markdown `text` into a vector of styled logical lines."
  [text]
  (let [lines (str/split (str text) #"\n" -1)]
    (loop [[line & more] lines
           in-fence? false
           out []]
      (if (nil? line)
        out
        (cond
          (and (fence-line? line) (not in-fence?))
          (recur more true (conj out fence-border))

          (and (fence-line? line) in-fence?)
          (recur more false (conj out fence-border))

          in-fence?
          (recur more true (conj out (render-code-line line)))

          :else
          (recur more false
                 (conj out (or (render-header line)
                               (render-bullet line)
                               (render-blockquote line)
                               (style-inline line)))))))))
