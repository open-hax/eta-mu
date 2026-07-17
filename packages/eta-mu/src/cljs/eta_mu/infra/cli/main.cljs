(ns eta-mu.infra.cli.main
  "Eta-mu CLI entry point."
  (:require [eta-mu.infra.cli.router :as router]))

(defn main []
  (router/main))
