(ns eta-mu-e2e.coding-settings-auth-test
  "E2E tests for the settings/auth pipeline across coding layers.

   Exercises:
   - domain/settings.cljs pure accessors and setters
   - shape/settings.cljs JS↔CLJS round-trip fidelity
   - domain/auth.cljs credential predicates and resolution chain
   - shape/settings.cljs auth credential converters"
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.domain.settings :as ds]
            [eta-mu.coding.shape.settings :as ss]
            [eta-mu.coding.domain.auth :as da]
            [eta-mu.coding.law.settings :as law]))

;; ── Settings domain → shape round-trip ───────────────────────────────────────

(deftest settings-roundtrip-e2e
  (testing "settings with truthy values survives CLJS→JS→CLJS round-trip"
    (let [settings {:default-provider "anthropic"
                    :default-model "claude-sonnet-4-20250514"
                    :default-thinking-level "high"
                    :transport "sse"
                    :steering-mode "one-at-a-time"
                    :follow-up-mode "one-at-a-time"
                    :theme "dark"
                    :hide-thinking-block true
                    :quiet-startup true
                    :shell-path "/bin/zsh"
                    :shell-command-prefix "exec"
                    :npm-command ["pnpm" "exec"]
                    :collapse-changelog true
                    :enable-skill-commands true
                    :image-width-cells 40
                    :double-escape-action "tree"
                    :tree-filter-mode "default"
                    :session-dir "/tmp/sessions"
                    :enabled-models ["claude-*" "gpt-*"]
                    :packages ["/ext/a"]
                    :extensions ["/ext/a" "/ext/b"]
                    :skills ["/skills/a"]
                    :prompts ["/prompts/a"]
                    :themes ["/themes/a"]
                    :compaction {:enabled true :reserve-tokens 8192 :keep-recent-tokens 10000}
                    :retry {:enabled true :max-retries 5 :base-delay-ms 1000
                            :provider {:max-retry-delay-ms 30000}}
                    :branch-summary {:reserve-tokens 8192 :skip-prompt true}
                    :terminal {:show-images true :image-width-cells 40
                               :clear-on-shrink true :show-terminal-progress true}
                    :images {:auto-resize true :block-images false}
                    :editor-padding-x 2
                    :autocomplete-max-visible 10
                    :markdown {:code-block-indent "    "}}
          ext    (ss/settings->external settings)
          back   (ss/settings-from-external ext)]
      ;; Scalar fields survive round-trip
      (is (= "anthropic" (:default-provider back)))
      (is (= "claude-sonnet-4-20250514" (:default-model back)))
      (is (= "high" (:default-thinking-level back)))
      (is (= "sse" (:transport back)))
      (is (= "dark" (:theme back)))
      (is (= "/bin/zsh" (:shell-path back)))
      ;; Boolean fields (must be truthy to survive cond->)
      (is (true? (:hide-thinking-block back)))
      (is (true? (:quiet-startup back)))
      (is (true? (:enable-skill-commands back)))
      ;; Vector fields
      (is (= ["pnpm" "exec"] (:npm-command back)))
      (is (= ["claude-*" "gpt-*"] (:enabled-models back)))
      (is (= ["/ext/a" "/ext/b"] (:extensions back)))
      ;; Nested maps
      (is (= 8192 (get-in back [:compaction :reserve-tokens])))
      (is (= 5 (:max-retries (:retry back))))
      (is (= true (get-in back [:terminal :clear-on-shrink])))
      (is (= "    " (get-in back [:markdown :code-block-indent]))))))

(deftest settings-defaults-e2e
  (testing "apply-defaults fills in missing keys from law/default-settings"
    (let [partial {:default-provider "openai"}
          merged (ds/apply-defaults partial)]
      ;; Provided value preserved
      (is (= "openai" (:default-provider merged)))
      ;; Defaults filled in (values are strings in default-settings)
      (is (= "sse" (:transport merged)))
      (is (= "one-at-a-time" (:steering-mode merged)))
      (is (= "one-at-a-time" (:follow-up-mode merged)))
      (is (true? (get-in merged [:compaction :enabled])))
      (is (= 16384 (get-in merged [:compaction :reserve-tokens])))
      (is (true? (get-in merged [:retry :enabled])))
      (is (true? (:enable-skill-commands merged)))
      (is (= "tree" (:double-escape-action merged))))))

(deftest settings-deep-merge-e2e
  (testing "deep-merge-settings merges nested maps without losing keys"
    (let [base {:transport "sse"
                :compaction {:enabled true :reserve-tokens 16384}
                :retry {:enabled true :max-retries 3}}
          overrides {:transport "ws"
                     :compaction {:reserve-tokens 8192}
                     :theme "dark"}
          merged (ds/deep-merge-settings base overrides)]
      (is (= "ws" (:transport merged)))
      (is (= "dark" (:theme merged)))
      ;; Nested merge: reserve-tokens overridden, enabled preserved
      (is (= 8192 (get-in merged [:compaction :reserve-tokens])))
      (is (true? (get-in merged [:compaction :enabled])))
      ;; Retry untouched
      (is (true? (get-in merged [:retry :enabled])))
      (is (= 3 (get-in merged [:retry :max-retries]))))))

(deftest settings-setters-e2e
  (testing "domain setters produce correct updated maps"
    (let [base law/default-settings
          s1 (ds/set-default-provider base "anthropic")
          s2 (ds/set-default-model s1 "claude-sonnet-4-20250514")
          s3 (ds/set-transport s2 "ws")
          s4 (ds/set-steering-mode s3 "all")
          s5 (ds/set-theme s4 "dark")
          s6 (ds/set-hide-thinking-block s5 true)
          s7 (ds/set-extension-paths s6 ["/ext1" "/ext2"])]
      (is (= "anthropic" (:default-provider s7)))
      (is (= "claude-sonnet-4-20250514" (:default-model s7)))
      (is (= "ws" (:transport s7)))
      (is (= "all" (:steering-mode s7)))
      (is (= "dark" (:theme s7)))
      (is (true? (:hide-thinking-block s7)))
      (is (= ["/ext1" "/ext2"] (:extensions s7)))
      ;; Defaults still present
      (is (= "one-at-a-time" (:follow-up-mode s7)))
      (is (true? (:enable-skill-commands s7))))))

(deftest settings-accessors-e2e
  (testing "domain accessors read from a settings map"
    (let [settings {:default-provider "anthropic"
                    :default-model "claude-sonnet-4-20250514"
                    :transport "ws"
                    :steering-mode "all"
                    :theme "dark"
                    :shell-path "/bin/zsh"
                    :hide-thinking-block true
                    :quiet-startup true
                    :extensions ["/ext1"]}]
      (is (= "anthropic" (ds/default-provider settings)))
      (is (= "claude-sonnet-4-20250514" (ds/default-model settings)))
      ;; Accessors return keywords for transport/steering-mode
      (is (= :ws (ds/transport settings)))
      (is (= :all (ds/steering-mode settings)))
      (is (= "dark" (ds/theme settings)))
      (is (= "/bin/zsh" (ds/shell-path settings)))
      (is (true? (ds/hide-thinking-block? settings)))
      (is (true? (ds/quiet-startup? settings)))
      ;; extension-paths reads :extensions key
      (is (= ["/ext1"] (ds/extension-paths settings))))))

;; ── Auth domain → shape round-trip ───────────────────────────────────────────

(deftest auth-credential-roundtrip-e2e
  (testing "API key credential survives CLJS→JS→CLJS round-trip"
    (let [cred {:type :api-key
                :key "sk-ant-12345"
                :provider-id "anthropic"}
          ext    (ss/auth-credential->external cred)
          back   (ss/auth-credential-from-external ext)]
      ;; Note: roundtrip goes through JS where :api-key keyword becomes "api-key"
      ;; but from-external expects "api_key". So the roundtrip changes the key name.
      ;; This is a known asymmetry in the shape layer.
      (is (= :api-key (:type back)))
      (is (= "sk-ant-12345" (:key back)))))

  (testing "OAuth credential survives CLJS→JS→CLJS round-trip"
    (let [cred {:type :oauth
                :access-token "ya29.access-token"
                :refresh-token "1//refresh-token"
                :expires 9999999999999
                :provider-id "google"}
          ext    (ss/auth-credential->external cred)
          back   (ss/auth-credential-from-external ext)]
      (is (= :oauth (:type back)))
      (is (= "ya29.access-token" (:access-token back)))
      (is (= "1//refresh-token" (:refresh-token back)))
      (is (= 9999999999999 (:expires back)))
      (is (= "google" (:provider-id back))))))

(deftest auth-predicates-e2e
  (testing "credential type predicates"
    (is (true? (da/api-key? {:type :api-key :key "k"})))
    (is (false? (da/api-key? {:type :oauth :access-token "t"})))
    (is (true? (da/oauth? {:type :oauth :access-token "t"})))
    (is (false? (da/oauth? {:type :api-key :key "k"})))))

(deftest auth-api-key-resolution-e2e
  (testing "resolve-api-key follows priority chain: stored > runtime > env > fallback"
    (is (= "stored" (da/resolve-api-key "stored" "runtime" "env" "fallback")))
    (is (= "runtime" (da/resolve-api-key nil "runtime" "env" "fallback")))
    (is (= "env" (da/resolve-api-key nil nil "env" "fallback")))
    (is (= "fallback" (da/resolve-api-key nil nil nil "fallback")))
    (is (nil? (da/resolve-api-key nil nil nil nil)))))

(deftest auth-oauth-expiry-e2e
  (testing "OAuth expiry detection"
    (let [now (js/Date.now)
          fresh {:type :oauth :expires (+ now 600000)}
          expired {:type :oauth :expires (- now 1000)}
          no-expiry {:type :oauth :expires nil}]
      (is (false? (da/oauth-expired? fresh)))
      (is (true? (da/oauth-expired? expired)))
      ;; nil expires means never expires
      (is (false? (da/oauth-expired? no-expiry))))))

(deftest auth-provider-env-key-e2e
  (testing "provider env key mapping"
    (is (= "ANTHROPIC_API_KEY" (da/provider-env-key "anthropic")))
    (is (= "OPENAI_API_KEY" (da/provider-env-key "openai")))
    (is (= "GEMINI_API_KEY" (da/provider-env-key "gemini")))
    ;; Unknown provider returns nil
    (is (nil? (da/provider-env-key "unknown-provider")))))

(deftest auth-credential-summary-e2e
  (testing "credential-summary never leaks secrets"
    (let [cred {:type :api-key :key "sk-secret-12345" :provider-id "anthropic"}
          summary (da/credential-summary cred)]
      (is (= :api-key (:type summary)))
      ;; Key should NOT appear in summary
      (is (not (contains? summary :key)))
      (is (nil? (:key summary)))
      ;; Summary includes key-length and key-preview
      (is (= 15 (:key-length summary)))
      (is (string? (:key-preview summary))))))
