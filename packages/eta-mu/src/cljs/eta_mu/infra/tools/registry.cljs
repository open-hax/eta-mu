(ns eta-mu.infra.tools.registry
  "The default tool vector wired into the agent command and REPL."
  (:require [eta-mu.infra.tools.bash :as bash]
            [eta-mu.infra.tools.edit :as edit]
            [eta-mu.infra.tools.find :as find]
            [eta-mu.infra.tools.grep :as grep]
            [eta-mu.infra.tools.ls :as ls]
            [eta-mu.infra.tools.read :as read]
            [eta-mu.infra.tools.write :as write]))

(def tools
  [read/tool bash/tool edit/tool write/tool find/tool grep/tool ls/tool])
