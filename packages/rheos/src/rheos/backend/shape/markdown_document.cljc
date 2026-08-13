(ns rheos.backend.shape.markdown-document
  (:require [clojure.string :as str]
            [malli.core :as m]
            [rheos.backend.shape.frontmatter :as frontmatter]))

(def MarkdownDocument
  [:map {:closed false}
   [:document/format [:= :markdown]]
   [:document/source-path {:optional true} :string]
   [:document/frontmatter-present? :boolean]
   [:document/frontmatter/raw [:maybe :string]]
   [:document/frontmatter/data :map]
   [:document/body :string]])

(defn valid? [document]
  (m/validate MarkdownDocument document))

(defn- opening-newline [raw]
  (when-let [line-end (str/index-of raw "\n")]
    (let [prefix (subs raw 0 line-end)
          crlf? (str/ends-with? prefix "\r")
          line (if crlf? (subs prefix 0 (dec (count prefix))) prefix)]
      (when (= "---" (str/trimr line))
        (if crlf? "\r\n" "\n")))))

(defn- delimiter-line? [line]
  (= "---" (str/trimr line)))

(defn- split-frontmatter [raw newline]
  (let [opening-end (str/index-of raw newline)
        start (+ opening-end (count newline))]
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
