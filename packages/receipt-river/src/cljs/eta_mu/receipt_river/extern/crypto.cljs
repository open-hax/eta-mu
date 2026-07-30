(ns eta-mu.receipt-river.extern.crypto
  "Raw Node hashing boundary for stable local repository identities."
  (:require ["node:crypto" :as crypto]))

(defn short-sha256 [value length]
  (subs (.digest (.update (.createHash crypto "sha256") value) "hex")
        0
        length))
