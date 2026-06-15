(ns eta-mu.coding.domain.diagnostics-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.domain.diagnostics :as diagnostics]))

(deftest resource-collision-test
  (testing "creates a valid collision map"
    (let [collision (diagnostics/resource-collision :skill "bash" "/a" "/b")]
      (is (= :skill (:resource-type collision)))
      (is (= "bash" (:name collision)))
      (is (= "/a" (:winner-path collision)))
      (is (= "/b" (:loser-path collision)))
      (is (nil? (:winner-source collision)))))

  (testing "rejects invalid resource type"
    (is (thrown? js/Error (diagnostics/resource-collision :bad "x" "/a" "/b")))))

(deftest resource-diagnostic-test
  (testing "creates a valid diagnostic map"
    (let [diagnostic (diagnostics/resource-diagnostic :warning "unused import" "/src/x.cljs")]
      (is (= :warning (:type diagnostic)))
      (is (= "unused import" (:message diagnostic)))
      (is (= "/src/x.cljs" (:path diagnostic)))))

  (testing "can include a collision"
    (let [collision (diagnostics/resource-collision :extension "x" "/a" "/b")
          diagnostic (diagnostics/resource-diagnostic :collision "collision" nil collision)]
      (is (= :collision (:type diagnostic)))
      (is (map? (:collision diagnostic)))))

  (testing "rejects invalid diagnostic type"
    (is (thrown? js/Error (diagnostics/resource-diagnostic :info "ok")))))

(deftest stdout-takeover-decisions-test
  (testing "write payload targets stderr when taken over"
    (let [state (diagnostics/stdout-takeover-state :raw-out :raw-err :orig-out)]
      (is (diagnostics/stdout-taken-over? state))
      (is (= {:target :stderr :text "hello"}
             (diagnostics/raw-stdout-write-payload state "hello")))))

  (testing "write payload targets stdout when not taken over"
    (let [state nil]
      (is (not (diagnostics/stdout-taken-over? state)))
      (is (= {:target :stdout :text "hello"}
             (diagnostics/raw-stdout-write-payload state "hello")))))

  (testing "flush payload follows takeover state"
    (let [state (diagnostics/stdout-takeover-state :raw-out :raw-err :orig-out)]
      (is (= {:target :stderr} (diagnostics/flush-stdout-payload state)))
      (is (= {:target :stdout} (diagnostics/flush-stdout-payload nil))))))

(deftest auth-guidance-test
  (testing "login help includes docs path"
    (let [help (diagnostics/provider-login-help "/docs")]
      (is (re-find #"Use /login" help))
      (is (re-find #"/docs/providers.md" help))
      (is (re-find #"/docs/models.md" help))))

  (testing "no API key message names provider"
    (let [help (diagnostics/provider-login-help "/docs")
          msg (diagnostics/format-no-api-key-found-message "openai" help)]
      (is (re-find #"No API key found for openai" msg))
      (is (re-find #"Use /login" msg))))

  (testing "unknown provider falls back to generic text"
    (let [msg (diagnostics/format-no-api-key-found-message "unknown" "help")]
      (is (re-find #"the selected model" msg))))

  (testing "no model selected message includes next step"
    (let [msg (diagnostics/format-no-model-selected-message "help")]
      (is (re-find #"No model selected" msg))
      (is (re-find #"/model" msg))))

  (testing "no models available message"
    (let [msg (diagnostics/format-no-models-available-message "help")]
      (is (re-find #"No models available" msg)))))
