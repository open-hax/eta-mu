(ns eta-mu.infra.cli.router-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.component-manifest :as component-manifest]
            [eta-mu.infra.cli.commands.sessions :as sessions]
            [eta-mu.infra.cli.router :as cli-router]))

(deftest cljs-component-manifest-test
  (let [manifest component-manifest/manifest]
    (is (= "1.1.1" (:eta-mu/version manifest)))
    (is (= {"@eta-mu/receipt-river" "0.1.0"
            "@eta-mu/session-mycology" "0.1.0"
            "@eta-mu/fork-tax" "0.1.0"}
           (:components manifest)))
    (is (= {:eta-mu.receipt-river/receipt-recorded 1
            :eta-mu.session-mycology/reflection-recorded 1
            :eta-mu.fork-tax/handoff-recorded 1}
           (:schemas manifest)))))

(deftest ledger-command-surface-test
  (let [registry (cli-router/command-registry)]
    (testing "canonical top-level commands exist"
      (is (fn? (get-in registry ["receipt" :handler])))
      (is (fn? (get-in registry ["session" :handler])))
      (is (fn? (get-in registry ["fork-tax" :handler]))))
    (testing "descriptive aliases share the canonical implementations"
      (is (identical? (get-in registry ["receipt" :handler])
                      (get-in registry ["receipt-river" :handler]))))
    (testing "git compatibility commands delegate to those same handlers"
      (is (identical? (get-in registry ["receipt" :handler])
                      (get-in registry ["git" :subcommands "receipt" :handler])))
      (is (identical? (get-in registry ["session-mycology" :handler])
                      (get-in registry ["git" :subcommands "session" :handler])))
      (is (identical? (get-in registry ["fork-tax" :handler])
                      (get-in registry ["git" :subcommands "fork-tax" :handler]))))
    (testing "persisted agent-session inspection remains available in plural form"
      (is (fn? (get-in registry ["sessions" :handler]))))))

(deftest ^:async session-multiplexer-test
  (let [calls (atom [])
        protocol-stub (fn [context]
                        (swap! calls conj [:protocol (:args context)])
                        (js/Promise.resolve :protocol))
        inspection-stub (fn [context]
                          (swap! calls conj [:inspection (:args context)])
                          (js/Promise.resolve :inspection))]
    (with-redefs [cli-router/session-protocol-handler protocol-stub
                  sessions/handle inspection-stub]
      (doseq [subcommand ["reflect" "schemas"]]
        (is (= :protocol
               (await (cli-router/session-handler {:args [subcommand]})))))
      (doseq [subcommand ["list" "show"]]
        (is (= :inspection
               (await (cli-router/session-handler {:args [subcommand]}))))))
    (is (= [[:protocol ["reflect"]]
            [:protocol ["schemas"]]
            [:inspection ["list"]]
            [:inspection ["show"]]]
           @calls))))
