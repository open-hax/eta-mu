;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.shape.stream
  "Portable NDJSON payload and terminal projection. Admission belongs to law.review.")

(defn user-message [content] {:event "user" :message {:content content}})
(defn terminal [events] (:result (peek events)))
