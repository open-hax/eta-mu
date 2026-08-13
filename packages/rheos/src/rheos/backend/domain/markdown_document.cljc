(ns rheos.backend.domain.markdown-document
  (:require [clojure.string :as str]
            [rheos.backend.domain.frontmatter :as frontmatter]))

(defn- opening-newline [raw]
  (cond
    (str/starts-with? raw "---\r\n") "\r\n"
    (str/starts-with? raw "---\n") "\n"
    :else nil))

(defn- delimiter-line? [line]
  (= "---" (str/trim line)))

(defn- split-frontmatter [raw newline]
  (let [start (+ 3 (count newline))]
    (loop [line-start start]
      (let [line-end (str/index-of raw newline line-start)
            content-end (or line-end (count raw))
            line (subs raw line-start content-end)]
        (cond
          (delimiter-line? line)
          (let [frontmatter-end (if (= line-start start)
                                  start
                                  (- line-start (count newline)))
                body-start (if line-end
                             (+ line-end (count newline))
                             content-end)]
            [(subs raw start frontmatter-end)
             (subs raw body-start)])

          line-end
          (recur (+ line-end (count newline)))

          :else nil)))))

(defn parse [raw]
  (if-let [newline (opening-newline raw)]
    (if-let [[frontmatter-raw body] (split-frontmatter raw newline)]
      {:document/format :markdown
       :document/frontmatter-present? true
       :document/frontmatter/raw frontmatter-raw
       :document/frontmatter/data (frontmatter/parse-flat frontmatter-raw)
       :document/body body}
      {:document/format :markdown
       :document/frontmatter-present? false
       :document/frontmatter/raw nil
       :document/frontmatter/data {}
       :document/body raw})
    {:document/format :markdown
     :document/frontmatter-present? false
     :document/frontmatter/raw nil
     :document/frontmatter/data {}
     :document/body raw}))
