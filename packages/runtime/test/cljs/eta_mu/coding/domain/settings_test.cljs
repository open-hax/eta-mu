(ns eta-mu.coding.domain.settings-test
  (:require [clojure.test :refer [deftest testing is]]
            [eta-mu.coding.law.settings :as law]
            [eta-mu.coding.domain.settings :as domain]
            [eta-mu.coding.shape.settings :as shape]))

;; ============================================================================
;; Shape: Settings JS ↔ CLJS
;; ============================================================================

(deftest settings-roundtrip
  (testing "Settings survive roundtrip through external form"
    (let [settings {:default-provider "anthropic"
                    :default-model "claude-sonnet-4-20250514"
                    :transport "sse"
                    :steering-mode "one-at-a-time"
                    :theme "dark"}
          ext (shape/settings->external settings)
          back (shape/settings-from-external ext)]
      (is (= "anthropic" (:default-provider back)))
      (is (= "claude-sonnet-4-20250514" (:default-model back)))
      (is (= "sse" (:transport back)))
      (is (= "one-at-a-time" (:steering-mode back)))
      (is (= "dark" (:theme back))))))

(deftest settings-from-external-nil
  (testing "nil input returns nil"
    (is (nil? (shape/settings-from-external nil)))
    (is (nil? (shape/settings-from-external nil)))))

(deftest settings-from-external-camelcase
  (testing "CamelCase keys are normalized to kebab-case"
    (let [ext #js {:defaultProvider "openai"
                   :defaultModel "gpt-4o"
                   :steeringMode "all"
                   :hideThinkingBlock true
                   :editorPaddingX 2}
          back (shape/settings-from-external ext)]
      (is (= "openai" (:default-provider back)))
      (is (= "gpt-4o" (:default-model back)))
      (is (= "all" (:steering-mode back)))
      (is (true? (:hide-thinking-block back)))
      (is (= 2 (:editor-padding-x back))))))

(deftest settings->external-kebab
  (testing "kebab-case keys are converted to camelCase"
    (let [settings {:default-provider "anthropic"
                    :steering-mode "all"
                    :hide-thinking-block true}
          ext (shape/settings->external settings)]
      (is (= "anthropic" (.-defaultProvider ext)))
      (is (= "all" (.-steeringMode ext)))
      (is (true? (.-hideThinkingBlock ext))))))

;; ============================================================================
;; Shape: Auth Credential JS ↔ CLJS
;; ============================================================================

(deftest auth-credential-api-key-roundtrip
  (testing "API key credential survives roundtrip"
    (let [cred {:type :api-key :key "sk-abc123"}
          ext (shape/auth-credential->external cred)
          back (shape/auth-credential-from-external ext)]
      (is (= :api-key (:type back)))
      (is (= "sk-abc123" (:key back))))))

(deftest auth-credential-oauth-roundtrip
  (testing "OAuth credential survives roundtrip"
    (let [cred {:type :oauth
                :access-token "tok_123"
                :refresh-token "ref_456"
                :expires 9999999999
                :provider-id "anthropic"}
          ext (shape/auth-credential->external cred)
          back (shape/auth-credential-from-external ext)]
      (is (= :oauth (:type back)))
      (is (= "tok_123" (:access-token back)))
      (is (= "ref_456" (:refresh-token back)))
      (is (= 9999999999 (:expires back)))
      (is (= "anthropic" (:provider-id back))))))

(deftest auth-credential-nil
  (testing "nil input returns nil"
    (is (nil? (shape/auth-credential-from-external nil)))
    (is (nil? (shape/auth-credential->external nil)))))

(deftest auth-credential-invalid-type
  (testing "Invalid type returns nil"
    (is (nil? (shape/auth-credential-from-external #js {:type "invalid"})))))

;; ============================================================================
;; Domain: Deep Merge
;; ============================================================================

(deftest deep-merge-settings-basic
  (testing "Basic deep merge with override"
    (let [base {:default-provider "anthropic" :transport "sse"}
          over {:default-provider "openai" :theme "dark"}
          result (domain/deep-merge-settings base over)]
      (is (= "openai" (:default-provider result)))
      (is (= "sse" (:transport result)))
      (is (= "dark" (:theme result))))))

(deftest deep-merge-settings-nested
  (testing "Nested maps merge recursively"
    (let [base {:compaction {:enabled true :reserve-tokens 16384}}
          over {:compaction {:enabled false}}
          result (domain/deep-merge-settings base over)]
      (is (false? (get-in result [:compaction :enabled])))
      (is (= 16384 (get-in result [:compaction :reserve-tokens]))))))

(deftest deep-merge-settings-empty
  (testing "Empty override returns base unchanged"
    (let [base {:default-provider "anthropic"}
          result (domain/deep-merge-settings base {})]
      (is (= "anthropic" (:default-provider result))))))

;; ============================================================================
;; Domain: Defaults
;; ============================================================================

(deftest apply-defaults-fills-missing
  (testing "apply-defaults fills in missing keys"
    (let [settings {:default-provider "openai"}
          result (domain/apply-defaults settings)]
      (is (= "openai" (:default-provider result)))
      (is (= "one-at-a-time" (:steering-mode result)))
      (is (= "sse" (:transport result)))
      (is (map? (:compaction result)))
      (is (map? (:retry result))))))

(deftest apply-defaults-preserve-existing
  (testing "apply-defaults does not overwrite existing keys"
    (let [settings {:steering-mode "all" :transport "websocket"}
          result (domain/apply-defaults settings)]
      (is (= "all" (:steering-mode result)))
      (is (= "websocket" (:transport result))))))

(deftest get-compaction-defaults
  (testing "get-compaction returns defaults when no settings"
    (let [result (domain/get-compaction {})]
      (is (true? (:enabled result)))
      (is (= 16384 (:reserve-tokens result)))
      (is (= 20000 (:keep-recent-tokens result))))))

(deftest get-compaction-override
  (testing "get-compaction merges override with defaults"
    (let [result (domain/get-compaction {:compaction {:enabled false}})]
      (is (false? (:enabled result)))
      (is (= 16384 (:reserve-tokens result))))))

(deftest get-retry-defaults
  (testing "get-retry returns defaults when no settings"
    (let [result (domain/get-retry {})]
      (is (true? (:enabled result)))
      (is (= 3 (:max-retries result)))
      (is (= 2000 (:base-delay-ms result))))))

(deftest get-terminal-defaults
  (testing "get-terminal returns defaults when no settings"
    (let [result (domain/get-terminal {})]
      (is (true? (:show-images result)))
      (is (= 60 (:image-width-cells result))))))

(deftest get-images-defaults
  (testing "get-images returns defaults when no settings"
    (let [result (domain/get-images {})]
      (is (true? (:auto-resize result)))
      (is (false? (:block-images result))))))

;; ============================================================================
;; Domain: Accessors
;; ============================================================================

(deftest default-provider-accessor
  (testing "default-provider returns value"
    (is (= "anthropic" (domain/default-provider {:default-provider "anthropic"})))
    (is (nil? (domain/default-provider {})))))

(deftest default-model-accessor
  (testing "default-model returns value"
    (is (= "gpt-4o" (domain/default-model {:default-model "gpt-4o"})))
    (is (nil? (domain/default-model {})))))

(deftest default-thinking-level-accessor
  (testing "default-thinking-level returns value"
    (is (= "high" (domain/default-thinking-level {:default-thinking-level "high"})))
    (is (nil? (domain/default-thinking-level {})))))

(deftest thinking-budget-for-level
  (testing "thinking-budget-for-level uses custom budget when available"
    (is (= 50000 (domain/thinking-budget-for-level {:thinking-budgets {:high 50000}} "high"))))
  (testing "thinking-budget-for-level uses default when no custom"
    (is (= 32768 (domain/thinking-budget-for-level {} "high"))))
  (testing "thinking-budget-for-level returns 0 for unknown"
    (is (= 0 (domain/thinking-budget-for-level {} "unknown")))))

(deftest transport-accessor
  (testing "transport returns keyword"
    (is (= :sse (domain/transport {})))
    (is (= :websocket (domain/transport {:transport "websocket"})))))

(deftest steering-mode-accessor
  (testing "steering-mode returns keyword"
    (is (= :one-at-a-time (domain/steering-mode {})))
    (is (= :all (domain/steering-mode {:steering-mode "all"})))))

(deftest follow-up-mode-accessor
  (testing "follow-up-mode returns keyword"
    (is (= :one-at-a-time (domain/follow-up-mode {})))))

(deftest theme-accessor
  (testing "theme returns value"
    (is (= "dark" (domain/theme {:theme "dark"})))
    (is (nil? (domain/theme {})))))

(deftest shell-path-accessor
  (testing "shell-path returns value"
    (is (= "/bin/zsh" (domain/shell-path {:shell-path "/bin/zsh"})))
    (is (nil? (domain/shell-path {})))))

(deftest npm-command-accessor
  (testing "npm-command returns vector"
    (is (= ["pnpm" "install"] (domain/npm-command {:npm-command ["pnpm" "install"]})))
    (is (nil? (domain/npm-command {})))))

(deftest quiet-startup-accessor
  (testing "quiet-startup? returns boolean"
    (is (true? (domain/quiet-startup? {:quiet-startup true})))
    (is (false? (domain/quiet-startup? {})))))

(deftest hide-thinking-block-accessor
  (testing "hide-thinking-block? returns boolean"
    (is (true? (domain/hide-thinking-block? {:hide-thinking-block true})))
    (is (false? (domain/hide-thinking-block? {})))))

(deftest collapse-changelog-accessor
  (testing "collapse-changelog? returns boolean"
    (is (true? (domain/collapse-changelog? {:collapse-changelog true})))
    (is (false? (domain/collapse-changelog? {})))))

(deftest enable-skill-commands-accessor
  (testing "enable-skill-commands? defaults to true"
    (is (true? (domain/enable-skill-commands? {}))))
  (testing "enable-skill-commands? respects setting"
    (is (false? (domain/enable-skill-commands? {:enable-skill-commands false})))))

(deftest show-images-accessor
  (testing "show-images? defaults to true"
    (is (true? (domain/show-images? {}))))
  (testing "show-images? respects nested setting"
    (is (false? (domain/show-images? {:terminal {:show-images false}})))))

(deftest image-width-cells-accessor
  (testing "image-width-cells defaults to 60"
    (is (= 60 (domain/image-width-cells {}))))
  (testing "image-width-cells respects setting"
    (is (= 40 (domain/image-width-cells {:terminal {:image-width-cells 40}})))))

(deftest double-escape-action-accessor
  (testing "double-escape-action defaults to :tree"
    (is (= :tree (domain/double-escape-action {}))))
  (testing "double-escape-action respects setting"
    (is (= :fork (domain/double-escape-action {:double-escape-action "fork"})))))

(deftest tree-filter-mode-accessor
  (testing "tree-filter-mode defaults to :default"
    (is (= :default (domain/tree-filter-mode {})))))

(deftest packages-accessor
  (testing "packages returns vector"
    (is (= ["pkg1"] (domain/packages {:packages ["pkg1"]})))
    (is (= [] (domain/packages {})))))

(deftest extension-paths-accessor
  (testing "extension-paths returns vector"
    (is (= ["ext1"] (domain/extension-paths {:extensions ["ext1"]})))
    (is (= [] (domain/extension-paths {})))))

(deftest skill-paths-accessor
  (testing "skill-paths returns vector"
    (is (= ["skill1"] (domain/skill-paths {:skills ["skill1"]})))
    (is (= [] (domain/skill-paths {})))))

;; ============================================================================
;; Domain: Setters
;; ============================================================================

(deftest set-default-provider
  (testing "set-default-provider returns updated settings"
    (let [result (domain/set-default-provider {} "openai")]
      (is (= "openai" (:default-provider result))))))

(deftest set-default-model
  (testing "set-default-model returns updated settings"
    (let [result (domain/set-default-model {} "gpt-4o")]
      (is (= "gpt-4o" (:default-model result))))))

(deftest set-default-model-and-provider
  (testing "set-default-model-and-provider returns updated settings"
    (let [result (domain/set-default-model-and-provider {} "anthropic" "claude-sonnet-4-20250514")]
      (is (= "anthropic" (:default-provider result)))
      (is (= "claude-sonnet-4-20250514" (:default-model result))))))

(deftest set-default-thinking-level
  (testing "set-default-thinking-level returns updated settings"
    (let [result (domain/set-default-thinking-level {} "high")]
      (is (= "high" (:default-thinking-level result))))))

(deftest set-transport
  (testing "set-transport returns updated settings with keyword"
    (let [result (domain/set-transport {} :websocket)]
      (is (= "websocket" (:transport result))))))

(deftest set-steering-mode
  (testing "set-steering-mode returns updated settings with keyword"
    (let [result (domain/set-steering-mode {} :all)]
      (is (= "all" (:steering-mode result))))))

(deftest set-follow-up-mode
  (testing "set-follow-up-mode returns updated settings"
    (let [result (domain/set-follow-up-mode {} :all)]
      (is (= "all" (:follow-up-mode result))))))

(deftest set-theme
  (testing "set-theme returns updated settings"
    (let [result (domain/set-theme {} "dark")]
      (is (= "dark" (:theme result))))))

(deftest set-hide-thinking-block
  (testing "set-hide-thinking-block returns updated settings"
    (is (true? (:hide-thinking-block (domain/set-hide-thinking-block {} true))))
    (is (false? (:hide-thinking-block (domain/set-hide-thinking-block {} false))))))

(deftest set-quiet-startup
  (testing "set-quiet-startup returns updated settings"
    (is (true? (:quiet-startup (domain/set-quiet-startup {} true))))))

(deftest set-shell-path
  (testing "set-shell-path returns updated settings"
    (let [result (domain/set-shell-path {} "/bin/zsh")]
      (is (= "/bin/zsh" (:shell-path result))))))

(deftest set-npm-command
  (testing "set-npm-command returns updated settings"
    (let [result (domain/set-npm-command {} ["pnpm" "install"])]
      (is (= ["pnpm" "install"] (:npm-command result))))))

(deftest set-collapse-changelog
  (testing "set-collapse-changelog returns updated settings"
    (is (true? (:collapse-changelog (domain/set-collapse-changelog {} true))))))

(deftest set-compaction
  (testing "set-compaction merges with existing"
    (let [result (domain/set-compaction {:compaction {:enabled false}} {:reserve-tokens 32768})]
      (is (false? (get-in result [:compaction :enabled])))
      (is (= 32768 (get-in result [:compaction :reserve-tokens]))))))

(deftest set-retry
  (testing "set-retry merges with existing"
    (let [result (domain/set-retry {:retry {:max-retries 5}} {:base-delay-ms 5000})]
      (is (= 5 (get-in result [:retry :max-retries])))
      (is (= 5000 (get-in result [:retry :base-delay-ms]))))))

(deftest set-terminal
  (testing "set-terminal merges with existing"
    (let [result (domain/set-terminal {:terminal {:show-images false}} {:image-width-cells 40})]
      (is (false? (get-in result [:terminal :show-images])))
      (is (= 40 (get-in result [:terminal :image-width-cells]))))))

(deftest set-images
  (testing "set-images merges with existing"
    (let [result (domain/set-images {:images {:auto-resize false}} {:block-images true})]
      (is (false? (get-in result [:images :auto-resize])))
      (is (true? (get-in result [:images :block-images]))))))

;; ============================================================================
;; Domain: Package Source
;; ============================================================================

(deftest package-source-string
  (testing "package-source-string extracts string from string"
    (is (= "pkg1" (domain/package-source-string "pkg1"))))
  (testing "package-source-string extracts source from map"
    (is (= "pkg1" (domain/package-source-string {:source "pkg1" :extensions ["ext1"]})))))

(deftest package-source-filter
  (testing "package-source-filter returns nil for string"
    (is (nil? (domain/package-source-filter "pkg1"))))
  (testing "package-source-filter returns filter map for map"
    (let [result (domain/package-source-filter {:source "pkg1" :extensions ["ext1"]})]
      (is (= ["ext1"] (:extensions result)))
      (is (not (contains? result :source))))))
