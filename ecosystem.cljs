(ns ecosystem
  (:require ["./pm2-clj-project/src/clobber/macro.cljs" :as clobber]))

(clobber.macro/defapp "rheos"
  {:script "dist/server.js"
   :cwd "packages/rheos"
   :interpreter "node"
   :exec_mode "fork"
   :instances 1
   :env {:NODE_ENV "production"}
   :max_restarts 5
   :restart_delay 2000
   :autorestart true
   :watch false})

(clobber.macro/ecosystem-output)
