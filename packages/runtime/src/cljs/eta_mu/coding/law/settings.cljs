(ns eta-mu.coding.law.settings
  "Malli schemas for coding-agent settings, compaction, retry, terminal, and auth."
  (:require [malli.core :as m]))

;; ============================================================================
;; Settings Sub-Schemas
;; ============================================================================

(def compaction-settings-schema
  [:map
   [:enabled {:optional true} boolean?]
   [:reserve-tokens {:optional true} [:int {:min 0}]]
   [:keep-recent-tokens {:optional true} [:int {:min 0}]]])

(def branch-summary-settings-schema
  [:map
   [:reserve-tokens {:optional true} [:int {:min 0}]]
   [:skip-prompt {:optional true} boolean?]])

(def provider-retry-settings-schema
  [:map
   [:timeout-ms {:optional true} [:int {:min 1}]]
   [:max-retries {:optional true} [:int {:min 0}]]
   [:max-retry-delay-ms {:optional true} [:int {:min 1}]]])

(def retry-settings-schema
  [:map
   [:enabled {:optional true} boolean?]
   [:max-retries {:optional true} [:int {:min 0}]]
   [:base-delay-ms {:optional true} [:int {:min 1}]]
   [:provider {:optional true} provider-retry-settings-schema]])

(def terminal-settings-schema
  [:map
   [:show-images {:optional true} boolean?]
   [:image-width-cells {:optional true} [:int {:min 1}]]
   [:clear-on-shrink {:optional true} boolean?]
   [:show-terminal-progress {:optional true} boolean?]])

(def image-settings-schema
  [:map
   [:auto-resize {:optional true} boolean?]
   [:block-images {:optional true} boolean?]])

(def thinking-budgets-settings-schema
  [:map
   [:minimal {:optional true} [:int {:min 0}]]
   [:low {:optional true} [:int {:min 0}]]
   [:medium {:optional true} [:int {:min 0}]]
   [:high {:optional true} [:int {:min 0}]]])

(def markdown-settings-schema
  [:map
   [:code-block-indent {:optional true} string?]])

(def warning-settings-schema
  [:map
   [:anthropic-extra-usage {:optional true} boolean?]])

(def package-source-schema
  [:or string? [:map [:source string?]
                      [:extensions {:optional true} [:vector string?]]
                      [:skills {:optional true} [:vector string?]]
                      [:prompts {:optional true} [:vector string?]]
                      [:themes {:optional true} [:vector string?]]]])

;; ============================================================================
;; Top-Level Settings Schema
;; ============================================================================

(def settings-schema
  [:map
   [:last-changelog-version {:optional true} string?]
   [:default-provider {:optional true} string?]
   [:default-model {:optional true} string?]
   [:default-thinking-level {:optional true} [:enum "off" "minimal" "low" "medium" "high" "xhigh"]]
   [:transport {:optional true} [:enum "sse" "websocket"]]
   [:steering-mode {:optional true} [:enum "all" "one-at-a-time"]]
   [:follow-up-mode {:optional true} [:enum "all" "one-at-a-time"]]
   [:theme {:optional true} string?]
   [:compaction {:optional true} compaction-settings-schema]
   [:branch-summary {:optional true} branch-summary-settings-schema]
   [:retry {:optional true} retry-settings-schema]
   [:hide-thinking-block {:optional true} boolean?]
   [:shell-path {:optional true} string?]
   [:quiet-startup {:optional true} boolean?]
   [:shell-command-prefix {:optional true} string?]
   [:npm-command {:optional true} [:vector string?]]
   [:collapse-changelog {:optional true} boolean?]
   [:packages {:optional true} [:vector package-source-schema]]
   [:extensions {:optional true} [:vector string?]]
   [:skills {:optional true} [:vector string?]]
   [:prompts {:optional true} [:vector string?]]
   [:themes {:optional true} [:vector string?]]
   [:enable-skill-commands {:optional true} boolean?]
   [:terminal {:optional true} terminal-settings-schema]
   [:images {:optional true} image-settings-schema]
   [:enabled-models {:optional true} [:vector string?]]
   [:double-escape-action {:optional true} [:enum "fork" "tree" "none"]]
   [:tree-filter-mode {:optional true} [:enum "default" "no-tools" "user-only" "labeled-only" "all"]]
   [:thinking-budgets {:optional true} thinking-budgets-settings-schema]
   [:editor-padding-x {:optional true} [:int {:min 0 :max 3}]]
   [:autocomplete-max-visible {:optional true} [:int {:min 3 :max 20}]]
   [:show-hardware-cursor {:optional true} boolean?]
   [:markdown {:optional true} markdown-settings-schema]
   [:warnings {:optional true} warning-settings-schema]
   [:session-dir {:optional true} string?]])

;; ============================================================================
;; Defaults
;; ============================================================================

(def default-settings
  {:steering-mode "one-at-a-time"
   :follow-up-mode "one-at-a-time"
   :transport "sse"
   :compaction {:enabled true :reserve-tokens 16384 :keep-recent-tokens 20000}
   :branch-summary {:reserve-tokens 16384 :skip-prompt false}
   :retry {:enabled true :max-retries 3 :base-delay-ms 2000
           :provider {:max-retry-delay-ms 60000}}
   :terminal {:show-images true :image-width-cells 60 :clear-on-shrink false
              :show-terminal-progress false}
   :images {:auto-resize true :block-images false}
   :enable-skill-commands true
   :double-escape-action "tree"
   :tree-filter-mode "default"
   :editor-padding-x 0
   :autocomplete-max-visible 5
   :markdown {:code-block-indent "  "}})

(def default-thinking-levels
  {"off" 0 "minimal" 1024 "low" 4096 "medium" 10240 "high" 32768})

;; ============================================================================
;; Validation
;; ============================================================================

(defn validate-settings
  "Validate a settings map. Returns nil on success, or a vector of error maps."
  [settings]
  (m/explain settings-schema settings))
