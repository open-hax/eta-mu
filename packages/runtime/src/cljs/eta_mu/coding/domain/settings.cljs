(ns eta-mu.coding.domain.settings
  "Pure domain functions for settings management.
   No I/O — deep merge, defaults, accessor logic only."
  (:require [eta-mu.coding.law.settings :as law]))

;; ============================================================================
;; Deep Merge
;; ============================================================================

(defn deep-merge-settings
  "Deep merge two settings maps. `overrides` takes precedence.
   Nested maps merge recursively; arrays and primitives override."
  [base overrides]
  (reduce-kv
   (fn [result k v]
     (let [base-val (get result k)]
       (if (and (map? v) (map? base-val))
         (assoc result k (merge base-val v))
         (assoc result k v))))
   base
   overrides))

;; ============================================================================
;; Defaults
;; ============================================================================

(defn apply-defaults
  "Apply default values to a settings map. Only fills in missing keys."
  [settings]
  (deep-merge-settings law/default-settings settings))

(defn get-compaction
  "Return merged compaction settings with defaults."
  [settings]
  (merge (:compaction law/default-settings)
         (:compaction settings)))

(defn get-retry
  "Return merged retry settings with defaults."
  [settings]
  (merge (:retry law/default-settings)
         (:retry settings)))

(defn get-branch-summary
  "Return merged branch summary settings with defaults."
  [settings]
  (merge (:branch-summary law/default-settings)
         (:branch-summary settings)))

(defn get-terminal
  "Return merged terminal settings with defaults."
  [settings]
  (merge (:terminal law/default-settings)
         (:terminal settings)))

(defn get-images
  "Return merged image settings with defaults."
  [settings]
  (merge (:images law/default-settings)
         (:images settings)))

;; ============================================================================
;; Accessors
;; ============================================================================

(defn default-provider
  "Return the default provider, or nil."
  [settings]
  (:default-provider settings))

(defn default-model
  "Return the default model, or nil."
  [settings]
  (:default-model settings))

(defn default-thinking-level
  "Return the default thinking level, or nil."
  [settings]
  (:default-thinking-level settings))

(defn thinking-budget-for-level
  "Return the token budget for a thinking level."
  [settings level]
  (let [budgets (:thinking-budgets settings)
        level-budget (when budgets (get budgets (keyword level)))]
    (or level-budget
        (get law/default-thinking-levels (name level))
        0)))

(defn transport
  "Return the transport type, defaulting to :sse."
  [settings]
  (keyword (or (:transport settings) "sse")))

(defn steering-mode
  "Return the steering mode, defaulting to :one-at-a-time."
  [settings]
  (keyword (or (:steering-mode settings) "one-at-a-time")))

(defn follow-up-mode
  "Return the follow-up mode, defaulting to :one-at-a-time."
  [settings]
  (keyword (or (:follow-up-mode settings) "one-at-a-time")))

(defn theme
  "Return the theme name, or nil."
  [settings]
  (:theme settings))

(defn shell-path
  "Return the custom shell path, or nil."
  [settings]
  (:shell-path settings))

(defn shell-command-prefix
  "Return the shell command prefix, or nil."
  [settings]
  (:shell-command-prefix settings))

(defn npm-command
  "Return the npm command as a vector of strings, or nil."
  [settings]
  (:npm-command settings))

(defn quiet-startup?
  "Return true if quiet startup is enabled."
  [settings]
  (boolean (:quiet-startup settings)))

(defn hide-thinking-block?
  "Return true if the thinking block should be hidden."
  [settings]
  (boolean (:hide-thinking-block settings)))

(defn collapse-changelog?
  "Return true if the changelog should be collapsed after update."
  [settings]
  (boolean (:collapse-changelog settings)))

(defn enable-skill-commands?
  "Return true if skills should be registered as /skill:name commands."
  [settings]
  (if (contains? settings :enable-skill-commands)
    (:enable-skill-commands settings)
    true))

(defn show-images?
  "Return true if terminal images should be shown."
  [settings]
  (boolean (get-in settings [:terminal :show-images] true)))

(defn image-width-cells
  "Return the preferred inline image width in terminal cells."
  [settings]
  (let [w (get-in settings [:terminal :image-width-cells])]
    (if (and (number? w) (pos? w))
      (int w)
      60)))

(defn auto-resize-images?
  "Return true if images should be auto-resized."
  [settings]
  (boolean (get-in settings [:images :auto-resize] true)))

(defn block-images?
  "Return true if images should be blocked."
  [settings]
  (boolean (get-in settings [:images :block-images])))

(defn double-escape-action
  "Return the double-escape action, defaulting to :tree."
  [settings]
  (keyword (or (:double-escape-action settings) "tree")))

(defn tree-filter-mode
  "Return the tree filter mode, defaulting to :default."
  [settings]
  (keyword (or (:tree-filter-mode settings) "default")))

(defn session-dir
  "Return the session directory, or nil."
  [settings]
  (:session-dir settings))

(defn enabled-models
  "Return the enabled model patterns, or nil."
  [settings]
  (:enabled-models settings))

(defn packages
  "Return the configured package sources."
  [settings]
  (or (:packages settings) []))

(defn extension-paths
  "Return the configured extension paths."
  [settings]
  (or (:extensions settings) []))

(defn skill-paths
  "Return the configured skill paths."
  [settings]
  (or (:skills settings) []))

(defn prompt-paths
  "Return the configured prompt template paths."
  [settings]
  (or (:prompts settings) []))

(defn theme-paths
  "Return the configured theme paths."
  [settings]
  (or (:themes settings) []))

;; ============================================================================
;; Setters (pure — return new settings map)
;; ============================================================================

(defn set-default-provider
  "Return settings with the default provider updated."
  [settings provider]
  (assoc settings :default-provider provider))

(defn set-default-model
  "Return settings with the default model updated."
  [settings model]
  (assoc settings :default-model model))

(defn set-default-model-and-provider
  "Return settings with both default model and provider updated."
  [settings provider model]
  (assoc settings :default-provider provider :default-model model))

(defn set-default-thinking-level
  "Return settings with the default thinking level updated."
  [settings level]
  (assoc settings :default-thinking-level level))

(defn set-transport
  "Return settings with the transport updated."
  [settings transport]
  (assoc settings :transport (name transport)))

(defn set-steering-mode
  "Return settings with the steering mode updated."
  [settings mode]
  (assoc settings :steering-mode (name mode)))

(defn set-follow-up-mode
  "Return settings with the follow-up mode updated."
  [settings mode]
  (assoc settings :follow-up-mode (name mode)))

(defn set-theme
  "Return settings with the theme updated."
  [settings theme-name]
  (assoc settings :theme theme-name))

(defn set-hide-thinking-block
  "Return settings with hide-thinking-block updated."
  [settings hide?]
  (assoc settings :hide-thinking-block (boolean hide?)))

(defn set-quiet-startup
  "Return settings with quiet-startup updated."
  [settings quiet?]
  (assoc settings :quiet-startup (boolean quiet?)))

(defn set-shell-path
  "Return settings with the shell path updated."
  [settings path]
  (assoc settings :shell-path path))

(defn set-shell-command-prefix
  "Return settings with the shell command prefix updated."
  [settings prefix]
  (assoc settings :shell-command-prefix prefix))

(defn set-npm-command
  "Return settings with the npm command updated."
  [settings command]
  (assoc settings :npm-command command))

(defn set-collapse-changelog
  "Return settings with collapse-changelog updated."
  [settings collapse?]
  (assoc settings :collapse-changelog (boolean collapse?)))

(defn set-packages
  "Return settings with the packages list updated."
  [settings pkgs]
  (assoc settings :packages pkgs))

(defn set-extension-paths
  "Return settings with the extension paths updated."
  [settings paths]
  (assoc settings :extensions paths))

(defn set-skill-paths
  "Return settings with the skill paths updated."
  [settings paths]
  (assoc settings :skills paths))

(defn set-prompt-paths
  "Return settings with the prompt template paths updated."
  [settings paths]
  (assoc settings :prompts paths))

(defn set-theme-paths
  "Return settings with the theme paths updated."
  [settings paths]
  (assoc settings :themes paths))

(defn set-enable-skill-commands
  "Return settings with enable-skill-commands updated."
  [settings enabled?]
  (assoc settings :enable-skill-commands (boolean enabled?)))

(defn set-enabled-models
  "Return settings with enabled-models updated."
  [settings patterns]
  (assoc settings :enabled-models patterns))

(defn set-double-escape-action
  "Return settings with double-escape-action updated."
  [settings action]
  (assoc settings :double-escape-action (name action)))

(defn set-tree-filter-mode
  "Return settings with tree-filter-mode updated."
  [settings mode]
  (assoc settings :tree-filter-mode (name mode)))

(defn set-session-dir
  "Return settings with session-dir updated."
  [settings dir]
  (assoc settings :session-dir dir))

(defn set-compaction
  "Return settings with compaction settings merged."
  [settings compaction]
  (assoc settings :compaction (merge (get-compaction settings) compaction)))

(defn set-retry
  "Return settings with retry settings merged."
  [settings retry]
  (assoc settings :retry (merge (get-retry settings) retry)))

(defn set-terminal
  "Return settings with terminal settings merged."
  [settings terminal]
  (assoc settings :terminal (merge (get-terminal settings) terminal)))

(defn set-images
  "Return settings with image settings merged."
  [settings images]
  (assoc settings :images (merge (get-images settings) images)))

(defn set-warnings
  "Return settings with warnings settings merged."
  [settings warnings]
  (assoc settings :warnings warnings))

;; ============================================================================
;; Package Source Matching
;; ============================================================================

(defn package-source-string
  "Extract the source string from a package source (string or map)."
  [pkg]
  (if (string? pkg) pkg (:source pkg)))

(defn package-source-filter
  "Extract the filter map from a package source, or nil."
  [pkg]
  (when (map? pkg)
    (dissoc pkg :source)))
