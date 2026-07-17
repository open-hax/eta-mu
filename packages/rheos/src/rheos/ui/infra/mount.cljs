(ns rheos.ui.infra.mount
  "Browser entry point — mounts the app into the DOM. This is the `:init-fn`
   target for the shadow-cljs :app build."
  (:require [helix.core :refer [$]]
            ["react-dom/client" :as rdom]
            [rheos.ui.domain.layout :as layout]))

(defn ^:export init []
  (let [root (.createRoot rdom (js/document.getElementById "root"))]
    (.render root ($ layout/app))))

(defn ^:dev/after-load dev-reload []
  (js/console.log "Hot reload"))
