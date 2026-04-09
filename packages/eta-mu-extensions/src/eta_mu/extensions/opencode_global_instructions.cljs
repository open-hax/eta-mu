(ns eta-mu.extensions.opencode-global-instructions
  "Loads operation-mindfuck .lisp files and appends them to the system prompt.

  Migrated from: ~/.pi/agent/extensions/opencode-global-instructions.ts"
  (:require-macros [eta-mu.core :as em])
  (:require [clojure.string :as str]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(def PI-OPMF-DIR (path/join (os/homedir) ".pi" "agent" "operation-mindfuck"))
(def LEGACY-OPMF-DIR (path/join (os/homedir) ".config" "opencode" "operation-mindfuck"))

(defn resolve-opmf-dir []
  (cond
    (.existsSync fs PI-OPMF-DIR) PI-OPMF-DIR
    (.existsSync fs LEGACY-OPMF-DIR) LEGACY-OPMF-DIR
    :else nil))

(defn load-opmf []
  (let [opmf-dir (resolve-opmf-dir)]
    (when opmf-dir
      (let [entries (.readdirSync fs opmf-dir #js {:withFileTypes true})
            files (->> (js/Array.from entries)
                       (filter #(and (.isFile %) (.endsWith (.-name %) ".lisp")))
                       (map #(.-name %))
                       (sort (fn [a b]
                               (.localeCompare a b "en" #js {:numeric true :sensitivity "base"}))))
            parts (->> (map #(let [file-path (path/join opmf-dir %)
                                   content (.trimEnd (.readFileSync fs file-path "utf8"))]
                               (when (not (str/blank? content))
                                 (str ";; --- " % " ---\n" content)))
                             files)
                       (filter identity))]
        (when (seq parts)
          (str "## OpenCode Global Instructions (operation-mindfuck)\n"
               "This block is appended after all AGENTS.md instructions and has priority on conflicts.\n\n"
               (str/join "\n\n" parts)))))))

(em/defextension opencode-global-instructions
  :name "opencode-global-instructions"
  :description "Inject operation-mindfuck .lisp files into system prompt"

  (em/on "before_agent_start"
    :handler (fn [event ctx]
               (let [opmf (load-opmf)]
                 (when opmf
                   (aset event "systemPrompt"
                     (str (aget event "systemPrompt") "\n\n" opmf)))))))
