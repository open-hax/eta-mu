(ns eta-mu.receipt-river.extern.glob
  "Raw JavaScript regular-expression boundary for discovery exclusion globs."
  (:require [clojure.string :as str]))

(defn- pattern->regex
  [pattern]
  (let [escaped (-> pattern
                    (str/replace #"[.+^${}()|\[\]\\]" "\\$&")
                    (str/replace "?" "[^/]")
                    (str/replace "**" "\u0000")
                    (str/replace "*" "[^/]*")
                    (str/replace "\u0000" ".*"))]
    (js/RegExp. (str "^" escaped "$"))))

(defn matches-any?
  [path patterns]
  (boolean
   (some #(.test (pattern->regex %) path) patterns)))
