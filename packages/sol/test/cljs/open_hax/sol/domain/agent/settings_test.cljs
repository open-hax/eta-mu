(ns open-hax.sol.domain.agent.settings-test
  "Coverage for sol's plain-data agent settings: compaction/retry policy and
   per-provider auth resolution (the SettingsManager/AuthStorage replacement)."
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.sol.domain.agent.settings :as settings]))

(deftest compaction-settings-keep-the-legacy-defaults
  (testing "empty config yields enabled compaction with the legacy token budgets"
    (is (= {:enabled true :reserve-tokens 16384 :keep-recent-tokens 20000}
           (settings/compaction-settings {}))))
  (testing "config overrides win, including explicit disable"
    (is (= {:enabled false :reserve-tokens 4096 :keep-recent-tokens 1000}
           (settings/compaction-settings {:agent-compaction-enabled? false
                                          :agent-compaction-reserve-tokens 4096
                                          :agent-compaction-keep-recent-tokens 1000})))))

(deftest retry-policy-keeps-the-legacy-fixed-policy
  (testing "context-policy carries retry maxRetries 1 alongside compaction"
    (is (= {:compaction {:enabled true :reserve-tokens 16384 :keep-recent-tokens 20000}
            :retry {:enabled true :max-retries 1}}
           (settings/context-policy {})))))

(deftest provider-auth-resolves-proxx-from-config
  (testing "proxx reads :proxx-auth-token and composes the full endpoint"
    (is (= {"proxx" {:api-key "tok"
                     :base-url "http://proxx:8789/v1/chat/completions"}}
           (settings/provider-auth {:proxx-auth-token "tok"
                                    :proxx-base-url "http://proxx:8789"}
                                   (fn [_] nil)))))
  (testing "a blank proxx token yields no :api-key"
    (is (= {"proxx" {:base-url "http://proxx:8789/v1/chat/completions"}}
           (settings/provider-auth {:proxx-auth-token "  "
                                    :proxx-base-url "http://proxx:8789/"}
                                   (fn [_] nil))))))

(deftest provider-auth-resolves-env-tokens-per-provider
  (let [env (fn [name] (get {"OPENROUTES_KEY" "sk-live" "EMPTY_KEY" "  "} name))]
    (testing "configured env vars resolve through the injected lookup"
      (is (= {"proxx" {:base-url "http://proxx:8789/v1/chat/completions"}
              "openrout.es" {:api-key "sk-live"
                             :base-url "https://openrout.es/api/v1/chat/completions"}}
             (settings/provider-auth {:proxx-base-url "http://proxx:8789"
                                      :provider-auth-tokens {"openrout.es" "OPENROUTES_KEY"}
                                      :provider-base-urls {"openrout.es" "https://openrout.es/api"}}
                                     env))))
    (testing "unset or blank env values produce no :api-key; base-url-only providers still appear"
      (is (= {"proxx" {:base-url "http://proxx:8789/v1/chat/completions"}
              "other" {}
              "missing" {}
              "base-only" {:base-url "http://base-only/v1/chat/completions"}}
             (settings/provider-auth {:proxx-base-url "http://proxx:8789"
                                      :provider-auth-tokens {"other" "EMPTY_KEY"
                                                             "missing" "UNSET_VAR"}
                                      :provider-base-urls {"base-only" "http://base-only"}}
                                     env))))
    (testing "keyword config keys (EDN config) normalize to provider id strings"
      (is (= {"proxx" {:base-url "http://proxx:8789/v1/chat/completions"}
              "openrout.es" {:api-key "sk-live"}}
             (settings/provider-auth {:proxx-base-url "http://proxx:8789"
                                      :provider-auth-tokens {:openrout.es "OPENROUTES_KEY"}}
                                     env))))))

(deftest provider-auth-preserves-generic-proxx-settings
  (let [env (fn [name] (get {"GENERIC_PROXX_KEY" "generic-token"} name))]
    (is (= {"proxx" {:api-key "generic-token"
                     :base-url "https://generic-proxx.example/v1/chat/completions"}}
           (settings/provider-auth
            {:provider-auth-tokens {"proxx" "GENERIC_PROXX_KEY"}
             :provider-base-urls {"proxx" "https://generic-proxx.example"}}
            env)))))
