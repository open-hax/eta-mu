(ns eta-mu.coding.shape.settings
  "JS↔CLJS converters for settings and auth credential maps."
  (:require [eta-mu.coding.extern.fs :as fs]))

;; ============================================================================
;; Settings — JS ↔ CLJS
;; ============================================================================

(defn settings-from-external
  "Convert an external (JS) settings object to internal (CLJS) form.
   Normalizes kebab-case keys."
  [js-settings]
  (when-not js-settings nil)
  (when js-settings
    (let [m (fs/to-clj js-settings)]
      (cond-> {}
        (:lastChangelogVersion m) (assoc :last-changelog-version (:lastChangelogVersion m))
        (:defaultProvider m) (assoc :default-provider (:defaultProvider m))
        (:defaultModel m) (assoc :default-model (:defaultModel m))
        (:defaultThinkingLevel m) (assoc :default-thinking-level (:defaultThinkingLevel m))
        (:transport m) (assoc :transport (:transport m))
        (:steeringMode m) (assoc :steering-mode (:steeringMode m))
        (:followUpMode m) (assoc :follow-up-mode (:followUpMode m))
        (:theme m) (assoc :theme (:theme m))
        (:compaction m) (assoc :compaction (:compaction m))
        (:branchSummary m) (assoc :branch-summary (:branchSummary m))
        (:retry m) (assoc :retry (:retry m))
        (:hideThinkingBlock m) (assoc :hide-thinking-block (:hideThinkingBlock m))
        (:shellPath m) (assoc :shell-path (:shellPath m))
        (:quietStartup m) (assoc :quiet-startup (:quietStartup m))
        (:shellCommandPrefix m) (assoc :shell-command-prefix (:shellCommandPrefix m))
        (:npmCommand m) (assoc :npm-command (:npmCommand m))
        (:collapseChangelog m) (assoc :collapse-changelog (:collapseChangelog m))
        (:packages m) (assoc :packages (:packages m))
        (:extensions m) (assoc :extensions (:extensions m))
        (:skills m) (assoc :skills (:skills m))
        (:prompts m) (assoc :prompts (:prompts m))
        (:themes m) (assoc :themes (:themes m))
        (:enableSkillCommands m) (assoc :enable-skill-commands (:enableSkillCommands m))
        (:terminal m) (assoc :terminal (:terminal m))
        (:images m) (assoc :images (:images m))
        (:enabledModels m) (assoc :enabled-models (:enabledModels m))
        (:doubleEscapeAction m) (assoc :double-escape-action (:doubleEscapeAction m))
        (:treeFilterMode m) (assoc :tree-filter-mode (:treeFilterMode m))
        (:thinkingBudgets m) (assoc :thinking-budgets (:thinkingBudgets m))
        (:editorPaddingX m) (assoc :editor-padding-x (:editorPaddingX m))
        (:autocompleteMaxVisible m) (assoc :autocomplete-max-visible (:autocompleteMaxVisible m))
        (:showHardwareCursor m) (assoc :show-hardware-cursor (:showHardwareCursor m))
        (:markdown m) (assoc :markdown (:markdown m))
        (:warnings m) (assoc :warnings (:warnings m))
        (:sessionDir m) (assoc :session-dir (:sessionDir m))))))

(defn settings->external
  "Convert an internal (CLJS) settings object to external (JS) form.
   Normalizes camelCase keys."
  [settings]
  (when settings
    (fs/to-js
     (cond-> {}
       (:last-changelog-version settings) (assoc :lastChangelogVersion (:last-changelog-version settings))
       (:default-provider settings) (assoc :defaultProvider (:default-provider settings))
       (:default-model settings) (assoc :defaultModel (:default-model settings))
       (:default-thinking-level settings) (assoc :defaultThinkingLevel (:default-thinking-level settings))
       (:transport settings) (assoc :transport (:transport settings))
       (:steering-mode settings) (assoc :steeringMode (:steering-mode settings))
       (:follow-up-mode settings) (assoc :followUpMode (:follow-up-mode settings))
       (:theme settings) (assoc :theme (:theme settings))
       (:compaction settings) (assoc :compaction (:compaction settings))
       (:branch-summary settings) (assoc :branchSummary (:branch-summary settings))
       (:retry settings) (assoc :retry (:retry settings))
       (:hide-thinking-block settings) (assoc :hideThinkingBlock (:hide-thinking-block settings))
       (:shell-path settings) (assoc :shellPath (:shell-path settings))
       (:quiet-startup settings) (assoc :quietStartup (:quiet-startup settings))
       (:shell-command-prefix settings) (assoc :shellCommandPrefix (:shell-command-prefix settings))
       (:npm-command settings) (assoc :npmCommand (:npm-command settings))
       (:collapse-changelog settings) (assoc :collapseChangelog (:collapse-changelog settings))
       (:packages settings) (assoc :packages (:packages settings))
       (:extensions settings) (assoc :extensions (:extensions settings))
       (:skills settings) (assoc :skills (:skills settings))
       (:prompts settings) (assoc :prompts (:prompts settings))
       (:themes settings) (assoc :themes (:themes settings))
       (:enable-skill-commands settings) (assoc :enableSkillCommands (:enable-skill-commands settings))
       (:terminal settings) (assoc :terminal (:terminal settings))
       (:images settings) (assoc :images (:images settings))
       (:enabled-models settings) (assoc :enabledModels (:enabled-models settings))
       (:double-escape-action settings) (assoc :doubleEscapeAction (:double-escape-action settings))
       (:tree-filter-mode settings) (assoc :treeFilterMode (:tree-filter-mode settings))
       (:thinking-budgets settings) (assoc :thinkingBudgets (:thinking-budgets settings))
       (:editor-padding-x settings) (assoc :editorPaddingX (:editor-padding-x settings))
       (:autocomplete-max-visible settings) (assoc :autocompleteMaxVisible (:autocomplete-max-visible settings))
       (:show-hardware-cursor settings) (assoc :showHardwareCursor (:show-hardware-cursor settings))
       (:markdown settings) (assoc :markdown (:markdown settings))
       (:warnings settings) (assoc :warnings (:warnings settings))
       (:session-dir settings) (assoc :sessionDir (:session-dir settings))))))

;; ============================================================================
;; Auth Credential — JS ↔ CLJS
;; ============================================================================

(defn auth-credential-from-external
  "Convert an external auth credential to internal form."
  [cred]
  (when cred
    (let [m (fs/to-clj cred)]
      (case (:type m)
        "api_key" {:type :api-key :key (:key m)}
        "oauth" {:type :oauth
                 :access-token (:accessToken m)
                 :refresh-token (:refreshToken m)
                 :expires (:expires m)
                 :provider-id (:providerId m)}
        nil))))

(defn auth-credential->external
  "Convert an internal auth credential to external form."
  [cred]
  (when cred
    (fs/to-js
     (case (:type cred)
       :api-key {:type "api_key" :key (:key cred)}
       :oauth {:type "oauth"
               :accessToken (:access-token cred)
               :refreshToken (:refresh-token cred)
               :expires (:expires cred)
               :providerId (:provider-id cred)}
       nil))))
