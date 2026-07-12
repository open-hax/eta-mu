(ns eta-mu.coding.infra.extension-test
  (:require [clojure.test :refer [deftest testing is]]
            [eta-mu.coding.infra.extension :as extension]))

;; ============================================================================
;; Runtime State
;; ============================================================================

(deftest create-extension-runtime-test
  (testing "create-extension-runtime returns empty runtime"
    (let [runtime (extension/create-extension-runtime)]
      (is (map? runtime))
      (is (= {} (:flag-values runtime)))
      (is (= [] (:pending-provider-registrations runtime)))
      (is (nil? (:stale-message runtime))))))

(deftest assert-active-test
  (testing "assert-active! passes when runtime is active"
    (let [runtime (extension/create-extension-runtime)]
      (is (nil? (extension/assert-active! runtime)))))
  (testing "assert-active! throws when runtime is stale"
    (let [runtime (extension/invalidate! (extension/create-extension-runtime) "stale")]
      (is (thrown-with-msg? js/Error #"stale" (extension/assert-active! runtime))))))

(deftest invalidate-test
  (testing "invalidate! sets stale message"
    (let [runtime (extension/invalidate! (extension/create-extension-runtime) "test message")]
      (is (= "test message" (:stale-message runtime)))))
  (testing "invalidate! with nil uses default message"
    (let [runtime (extension/invalidate! (extension/create-extension-runtime) nil)]
      (is (string? (:stale-message runtime))))))

;; ============================================================================
;; Extension Object
;; ============================================================================

(deftest create-extension-test
  (testing "create-extension returns empty extension"
    (let [ext (extension/create-extension "/path/ext" "/resolved/ext")]
      (is (= "/path/ext" (:path ext)))
      (is (= "/resolved/ext" (:resolved-path ext)))
      (is (= {} (:handlers ext)))
      (is (= {} (:tools ext)))
      (is (= {} (:commands ext)))
      (is (= {} (:flags ext)))
      (is (= {} (:shortcuts ext))))))

;; ============================================================================
;; Extension Runner
;; ============================================================================

(deftest create-runner-test
  (testing "create-runner returns runner with extensions"
    (let [ext (extension/create-extension "/ext" "/resolved")
          runtime (extension/create-extension-runtime)
          runner (extension/create-runner [ext] runtime "/cwd")]
      (is (= [ext] (:extensions runner)))
      (is (= runtime (:runtime runner)))
      (is (= "/cwd" (:cwd runner))))))

(deftest create-context-test
  (testing "create-context returns context map"
    (let [runner (extension/create-runner [] (extension/create-extension-runtime) "/cwd")
          ctx (extension/create-context runner)]
      (is (map? ctx))
      (is (= "/cwd" (:cwd ctx)))
      (is (false? (:has-ui ctx)))
      (is (fn? (:is-idle ctx)))
      (is (fn? (:abort ctx)))
      (is (fn? (:shutdown ctx))))))

(deftest create-command-context-test
  (testing "create-command-context includes session control methods"
    (let [runner (extension/create-runner [] (extension/create-extension-runtime) "/cwd")
          ctx (extension/create-command-context runner)]
      (is (fn? (:new-session ctx)))
      (is (fn? (:fork ctx)))
      (is (fn? (:navigate-tree ctx)))
      (is (fn? (:switch-session ctx)))
      (is (fn? (:reload ctx)))
      (is (fn? (:wait-for-idle ctx))))))

;; ============================================================================
;; Event Emission
;; ============================================================================

(deftest has-handlers-test
  (testing "has-handlers? returns false for empty extensions"
    (let [runner (extension/create-runner [] (extension/create-extension-runtime) "/cwd")]
      (is (false? (extension/has-handlers? runner "context")))))
  (testing "has-handlers? returns true when extension has handlers"
    (let [ext (assoc-in (extension/create-extension "/ext" "/resolved") [:handlers "context"] [(fn [e ctx])])
          runner (extension/create-runner [ext] (extension/create-extension-runtime) "/cwd")]
      (is (true? (extension/has-handlers? runner "context"))))))

(deftest emit-test
  (testing "emit returns nil for no handlers"
    (let [runner (extension/create-runner [] (extension/create-extension-runtime) "/cwd")]
      (is (nil? (extension/emit runner {:type "session_start"})))))
  (testing "emit calls handler and returns result"
    (let [ext (assoc-in (extension/create-extension "/ext" "/resolved") [:handlers "session_start"] [(fn [e ctx] {:result "ok"})])
          runner (extension/create-runner [ext] (extension/create-extension-runtime) "/cwd")]
      (is (= {:result "ok"} (extension/emit runner {:type "session_start"}))))))

;; ============================================================================
;; Extension Discovery
;; ============================================================================

(deftest extension-file?-test
  (testing "extension-file? identifies extension files"
    (is (true? (extension/extension-file? "test.ts")))
    (is (true? (extension/extension-file? "test.js")))
    (is (true? (extension/extension-file? "test.cljs")))
    (is (false? (extension/extension-file? "test.py")))
    (is (false? (extension/extension-file? "test.txt")))
    (is (false? (extension/extension-file? "README.md")))))

(deftest expand-path-test
  (testing "expand-path handles tilde"
    (is (string? (extension/expand-path "~/test")))))

;; ============================================================================
;; Extension Loading
;; ============================================================================

(deftest load-extension-unknown-type-test
  (testing "load-extension returns error for unknown type"
    (let [result (extension/load-extension "/path/ext.py" "/cwd" nil)]
      (is (nil? (:extension result)))
      (is (string? (:error result)))
      (is (.includes (:error result) "Unknown extension type")))))

(deftest load-extension-ts-requires-shell-test
  (testing "load-extension returns error for .ts without shell"
    (let [result (extension/load-extension "/path/ext.ts" "/cwd" nil)]
      (is (nil? (:extension result)))
      (is (string? (:error result)))
      (is (.includes (:error result) "TS compatibility shell")))))

(deftest load-extension-js-requires-shell-test
  (testing "load-extension returns error for .js without shell"
    (let [result (extension/load-extension "/path/ext.js" "/cwd" nil)]
      (is (nil? (:extension result)))
      (is (string? (:error result)))
      (is (.includes (:error result) "TS compatibility shell")))))

(deftest load-extensions-empty-test
  (testing "load-extensions returns empty for no paths"
    (let [result (extension/load-extensions [] "/cwd" nil)]
      (is (= [] (:extensions result)))
      (is (= [] (:errors result))))))
