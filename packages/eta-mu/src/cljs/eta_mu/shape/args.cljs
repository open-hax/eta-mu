(ns eta-mu.shape.args
  "Small, permissive argument parsing helpers.

  The router does not validate flags; it only separates positional tokens from
  `--flag` and `--flag=value` tokens. Each command handler interprets its own flags."
  (:require [clojure.string :as str]))

(defn- split-flag-value [token]
  (let [idx (str/index-of token "=")]
    (if (and idx (> idx 2))
      [(subs token 2 idx) (subs token (inc idx))]
      [(subs token 2) nil])))

(defn parse
  "Parse a token sequence into {:positional [...] :flags {key value-or-true}}.

  `--flag`       → boolean true
  `--flag value` → string value (when value does not start with -)
  `--flag=value` → string value
  Unknown positional tokens are collected in order."
  [tokens]
  (loop [remaining tokens
         positional []
         flags {}]
    (if (empty? remaining)
      {:positional positional :flags flags}
      (let [token (first remaining)
             next-token (second remaining)]
        (cond
          (str/starts-with? token "--")
          (let [[flag-name raw-value] (split-flag-value token)]
            (if (some? raw-value)
              (recur (rest remaining) positional (assoc flags flag-name raw-value))
              (if (and next-token (not (str/starts-with? next-token "-")))
                (recur (drop 2 remaining) positional (assoc flags flag-name next-token))
                (recur (rest remaining) positional (assoc flags flag-name true)))))

          (str/starts-with? token "-")
          (let [flag-name (subs token 1)]
            (recur (rest remaining) positional (assoc flags flag-name true)))

          :else
          (recur (rest remaining) (conj positional token) flags))))))

(defn flag
  "Return a flag value, or nil if absent."
  [parsed key]
  (get (:flags parsed) key))

(defn boolean-flag? [parsed key]
  (boolean (get (:flags parsed) key)))

(defn help? [parsed]
  (or (boolean-flag? parsed "help")
      (boolean-flag? parsed "h")))

(defn version? [parsed]
  (or (boolean-flag? parsed "version")
      (boolean-flag? parsed "v")))
