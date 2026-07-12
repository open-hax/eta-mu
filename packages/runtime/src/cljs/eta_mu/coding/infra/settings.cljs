(ns eta-mu.coding.infra.settings
  "Settings manager: file I/O, load, save, merge, and accessors.
   Depends on extern/fs, extern/lockfile, domain/settings, shape/settings.
   
   Error handling policy:
   - ENOENT (file not found): return defaults silently (expected on first run)
   - Parse errors: throw to fail-fast (user needs to know settings are corrupt)
   - Permission errors: throw to fail-fast
   - Callers may catch for graceful degradation if needed."
  (:require [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.domain.settings :as domain]
            [eta-mu.coding.shape.settings :as shape]))

(defonce settings-state (atom {}))

(defn settings-path
  "Return the settings file path."
  []
  (str (fs/config-dir) "/settings.json"))

(defn load-settings!
  "Load settings from disk and apply defaults. Returns the loaded settings map.
   
   Error handling policy:
   - ENOENT: return defaults silently (expected on first run)
   - Parse errors: throw to fail-fast (settings file is corrupt)
   - Permission errors: throw to fail-fast"
  []
  (let [path (settings-path)
        result (fs/read-json-file path)]
    (cond
      ;; Success: parse and merge with defaults
      (:ok result)
      (let [ext (shape/settings-from-external (:data result))
            merged (domain/apply-defaults ext)]
        (reset! settings-state merged)
        merged)
      
      ;; ENOENT: first run, return defaults silently
      (= "ENOENT" (:code result))
      (let [merged (domain/apply-defaults {})]
        (reset! settings-state merged)
        merged)
      
      ;; All other errors: throw to fail-fast
      :else
      (throw (ex-info (str "Failed to read settings: " path " - " (:error result))
                      {:code (:code result) :path path})))))

(defn save-settings!
  "Persist the current in-memory settings to disk."
  []
  (let [path (settings-path)
        ext (shape/settings->external @settings-state)]
    (fs/write-json-file! path ext)))

(defn get-settings
  "Return the current in-memory settings map."
  []
  @settings-state)

(defn update-settings!
  "Apply a function to the current settings, save, and return the result."
  [f]
  (let [new-settings (f @settings-state)]
    (reset! settings-state new-settings)
    (save-settings!)
    new-settings))

(defn merge-settings!
  "Deep-merge overrides into the current settings, save, and return the result."
  [overrides]
  (update-settings! #(domain/deep-merge-settings % overrides)))

;; ============================================================================
;; Convenience Accessors
;; ============================================================================

(defn default-provider []
  (domain/default-provider @settings-state))

(defn default-model []
  (domain/default-model @settings-state))

(defn default-thinking-level []
  (domain/default-thinking-level @settings-state))

(defn transport []
  (domain/transport @settings-state))

(defn steering-mode []
  (domain/steering-mode @settings-state))

(defn follow-up-mode []
  (domain/follow-up-mode @settings-state))

(defn theme []
  (domain/theme @settings-state))

(defn shell-path []
  (domain/shell-path @settings-state))

(defn shell-command-prefix []
  (domain/shell-command-prefix @settings-state))

(defn npm-command []
  (domain/npm-command @settings-state))

(defn quiet-startup? []
  (domain/quiet-startup? @settings-state))

(defn hide-thinking-block? []
  (domain/hide-thinking-block? @settings-state))

(defn collapse-changelog? []
  (domain/collapse-changelog? @settings-state))

(defn enable-skill-commands? []
  (domain/enable-skill-commands? @settings-state))

(defn show-images? []
  (domain/show-images? @settings-state))

(defn image-width-cells []
  (domain/image-width-cells @settings-state))

(defn auto-resize-images? []
  (domain/auto-resize-images? @settings-state))

(defn block-images? []
  (domain/block-images? @settings-state))

(defn double-escape-action []
  (domain/double-escape-action @settings-state))

(defn tree-filter-mode []
  (domain/tree-filter-mode @settings-state))

(defn session-dir []
  (domain/session-dir @settings-state))

(defn enabled-models []
  (domain/enabled-models @settings-state))

(defn packages []
  (domain/packages @settings-state))

(defn extension-paths []
  (domain/extension-paths @settings-state))

(defn skill-paths []
  (domain/skill-paths @settings-state))

(defn prompt-paths []
  (domain/prompt-paths @settings-state))

(defn theme-paths []
  (domain/theme-paths @settings-state))

(defn get-compaction []
  (domain/get-compaction @settings-state))

(defn get-retry []
  (domain/get-retry @settings-state))

(defn get-branch-summary []
  (domain/get-branch-summary @settings-state))

(defn get-terminal []
  (domain/get-terminal @settings-state))

(defn get-images []
  (domain/get-images @settings-state))

(defn thinking-budget-for-level [level]
  (domain/thinking-budget-for-level @settings-state level))

(defn set-default-provider! [provider]
  (update-settings! #(domain/set-default-provider % provider)))

(defn set-default-model! [model]
  (update-settings! #(domain/set-default-model % model)))

(defn set-default-model-and-provider! [provider model]
  (update-settings! #(domain/set-default-model-and-provider % provider model)))

(defn set-default-thinking-level! [level]
  (update-settings! #(domain/set-default-thinking-level % level)))

(defn set-transport! [transport]
  (update-settings! #(domain/set-transport % transport)))

(defn set-steering-mode! [mode]
  (update-settings! #(domain/set-steering-mode % mode)))

(defn set-follow-up-mode! [mode]
  (update-settings! #(domain/set-follow-up-mode % mode)))

(defn set-theme! [theme-name]
  (update-settings! #(domain/set-theme % theme-name)))

(defn set-hide-thinking-block! [hide?]
  (update-settings! #(domain/set-hide-thinking-block % hide?)))

(defn set-quiet-startup! [quiet?]
  (update-settings! #(domain/set-quiet-startup % quiet?)))

(defn set-shell-path! [path]
  (update-settings! #(domain/set-shell-path % path)))

(defn set-shell-command-prefix! [prefix]
  (update-settings! #(domain/set-shell-command-prefix % prefix)))

(defn set-npm-command! [command]
  (update-settings! #(domain/set-npm-command % command)))

(defn set-collapse-changelog! [collapse?]
  (update-settings! #(domain/set-collapse-changelog % collapse?)))

(defn set-compaction! [compaction]
  (update-settings! #(domain/set-compaction % compaction)))

(defn set-retry! [retry]
  (update-settings! #(domain/set-retry % retry)))

(defn set-terminal! [terminal]
  (update-settings! #(domain/set-terminal % terminal)))

(defn set-images! [images]
  (update-settings! #(domain/set-images % images)))
