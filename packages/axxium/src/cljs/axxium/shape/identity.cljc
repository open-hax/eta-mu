(ns axxium.shape.identity
  "Portable identifier and local redirect normalization."
  (:require [clojure.string :as str]))

(defn normalize-identifier
  "Normalize account lookup identifiers consistently across all clients."
  [value]
  (when (string? value) (-> value str/trim str/lower-case)))

(defn safe-redirect
  "Normalize post-authentication redirects to a local absolute path."
  [value]
  (if (and (string? value) (str/starts-with? value "/")
           (not (str/starts-with? value "//"))
           (not (re-find #"[\\\x00-\x1f\x7f]" value)))
    value "/"))
