(ns eta-mu.infra.tools.registry
  "The default tool vector wired into the agent command and REPL."
  (:require [eta-mu.infra.tools.bash :as bash]
            [eta-mu.infra.tools.edit :as edit]
            [eta-mu.infra.tools.read :as read]
            [eta-mu.infra.tools.write :as write]))

(def tools
  [read/tool bash/tool edit/tool write/tool])
