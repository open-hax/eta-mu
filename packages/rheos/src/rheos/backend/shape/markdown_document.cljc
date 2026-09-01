(ns rheos.backend.shape.markdown-document
  (:require [clojure.string :as str]
            [rheos.backend.shape.frontmatter :as frontmatter]))

(def partial-decoding
  {:decoder/id :rheos/flat-frontmatter-v1
   :decode/status :partial
   :decode/capabilities #{:top-level-string-scalars
                          :top-level-string-sequences}})

(defn- line-at [raw offset]
  (let [end (or (str/index-of raw "\n" offset) (count raw))
        raw-line (subs raw offset end)
        line (if (str/ends-with? raw-line "\r")
               (subs raw-line 0 (dec (count raw-line)))
               raw-line)]
    {:line line :end end :next (when (< end (count raw)) (inc end))}))

(defn- delimiter? [line]
  (= "---" (str/trimr line)))

(defn- content-end [raw closing-start]
  (let [newline-pos (dec closing-start)
        cr-pos (dec newline-pos)]
    (cond
      (and (>= cr-pos 0) (= \return (nth raw cr-pos))) cr-pos
      (>= newline-pos 0) newline-pos
      :else closing-start)))

(defn- split-frontmatter [raw]
  (let [{opening :line start :next} (line-at raw 0)]
    (when (and start (delimiter? opening))
      (loop [offset start]
        (let [{line :line end :end next :next} (line-at raw offset)]
          (cond
            (delimiter? line)
            [(subs raw start (max start (content-end raw offset)))
             (subs raw (or next end))]

            next (recur next)
            :else nil))))))

(defn parse [raw]
  (if-let [[frontmatter-raw body] (split-frontmatter raw)]
    {:document/format :markdown
     :document/frontmatter-present? true
     :document/frontmatter-raw frontmatter-raw
     :document/frontmatter-data (frontmatter/parse-flat frontmatter-raw)
     :document/frontmatter-decoding partial-decoding
     :document/body body}
    {:document/format :markdown
     :document/frontmatter-present? false
     :document/frontmatter-raw nil
     :document/frontmatter-data {}
     :document/body raw}))
