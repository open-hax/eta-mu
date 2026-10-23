;; SPDX-License-Identifier: GPL-3.0-or-later
(ns review
  (:require [antigravity.extern.host :as host]
            [antigravity.infra.review :as review]
            [nbb.core :as nbb]))

(try
  (let [source-root (host/absolute (host/join (host/parent nbb/*file*) "../.."))]
    (host/stdout! (str (host/json (review/main! (vec *command-line-args*) source-root)) "\n")))
  (catch :default error
    (host/stderr! (str (host/json {:status :refused :message (ex-message error) :error (ex-data error)}) "\n"))
    (host/exit-code! 1)))
