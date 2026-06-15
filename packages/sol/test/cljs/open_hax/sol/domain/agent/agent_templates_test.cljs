(ns open-hax.sol.domain.agent.agent-templates-test
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.sol.domain.agent.agent-templates :as tpl]))

(deftest template-form?-detects-template
  (testing "Identifies template forms"
    (is (true? (tpl/template-form? '(template {} ["hello"]))))
    (is (true? (tpl/template-form? '(template ["hello"])))))
  (testing "Rejects non-template forms"
    (is (false? (tpl/template-form? '(str "hello"))))
    (is (false? (tpl/template-form? "plain string")))
    (is (false? (tpl/template-form? 42)))
    (is (false? (tpl/template-form? nil)))))

(deftest eval-template-form-literals
  (testing "Passes through literals unchanged"
    (is (= "hello" (tpl/eval-template-form "hello" {})))
    (is (= 42 (tpl/eval-template-form 42 {})))
    (is (= :kw (tpl/eval-template-form :kw {})))
    (is (true? (tpl/eval-template-form true {})))
    (is (nil? (tpl/eval-template-form nil {})))))

(deftest eval-template-form-symbol-lookup
  (testing "Resolves symbols from env"
    (is (= "world" (tpl/eval-template-form 'x {'x "world"})))
    (is (nil? (tpl/eval-template-form 'x {})))))

(deftest eval-template-form-template-call
  (testing "Evaluates template form with default separator"
    (is (= "hello world"
           (tpl/eval-template-form '(template ["hello" "world"]) {}))))
  (testing "Evaluates template form with custom separator"
    (is (= "hello, world"
           (tpl/eval-template-form '(template {:separator ", "} ["hello" "world"]) {}))))
  (testing "Template with env reference"
    (is (= "hi alice"
           (tpl/eval-template-form '(template ["hi" name]) {'name "alice"})))))

(deftest eval-template-form-str
  (testing "str concatenates evaluated args"
    (is (= "hello world"
           (tpl/eval-template-form '(str "hello " "world") {})))
    (is (= "hi alice"
           (tpl/eval-template-form '(str "hi " name) {'name "alice"})))))

(deftest eval-template-form-if
  (testing "if selects branch based on condition"
    (is (= "yes"
           (tpl/eval-template-form '(if flag "yes" "no") {'flag true})))
    (is (= "no"
           (tpl/eval-template-form '(if flag "yes" "no") {'flag false})))
    (is (= "no"
           (tpl/eval-template-form '(if flag "yes" "no") {'flag nil})))))

(deftest eval-template-form-when
  (testing "when returns body when truthy"
    (is (= "ok"
           (tpl/eval-template-form '(when flag "ok") {'flag true})))
    (is (nil? (tpl/eval-template-form '(when flag "ok") {'flag false})))))

(deftest eval-template-form-let
  (testing "let binds variables"
    (is (= "hello alice"
           (tpl/eval-template-form '(let [name "alice"] (str "hello " name)) {})))))

(deftest eval-template-form-get
  (testing "get retrieves values from maps"
    (is (= "val"
           (tpl/eval-template-form '(get m :key) {'m {:key "val"}})))))

(deftest eval-template-form-get-in
  (testing "get-in navigates nested maps"
    (is (= "deep"
           (tpl/eval-template-form '(get-in m [:a :b]) {'m {:a {:b "deep"}}})))))

(deftest eval-template-form-join
  (testing "join concatenates collection with separator"
    (is (= "a, b, c"
           (tpl/eval-template-form '(join ", " items) {'items ["a" "b" "c"]})))))

(deftest eval-template-form-count
  (testing "count returns collection length"
    (is (= 3 (tpl/eval-template-form '(count items) {'items [1 2 3]})))))

(deftest eval-template-form-first-second-last
  (testing "first/second/last access sequence elements"
    (is (= "a" (tpl/eval-template-form '(first items) {'items ["a" "b" "c"]})))
    (is (= "b" (tpl/eval-template-form '(second items) {'items ["a" "b" "c"]})))
    (is (= "c" (tpl/eval-template-form '(last items) {'items ["a" "b" "c"]})))))

(deftest eval-template-form-logic
  (testing "not/and/or"
    (is (false? (tpl/eval-template-form '(not flag) {'flag true})))
    (is (true? (tpl/eval-template-form '(not flag) {'flag false})))
    (is (= "b" (tpl/eval-template-form '(and a b) {'a "a" :b "b"})))
    (is (nil? (tpl/eval-template-form '(and a b) {'a nil :b "b"})))
    (is (= "a" (tpl/eval-template-form '(or a b) {'a "a" :b "b"})))
    (is (= "b" (tpl/eval-template-form '(or a b) {'a nil :b "b"})))))

(deftest eval-template-form-equality
  (testing "equality comparison"
    (is (true? (tpl/eval-template-form '(= a b) {'a "x" :b "x"})))
    (is (false? (tpl/eval-template-form '(= a b) {'a "x" :b "y"})))))

(deftest eval-template-form-map-filter
  (testing "map applies fn to collection"
    (is (= ["HELLO" "WORLD"]
           (tpl/eval-template-form '(map (fn [x] (str x)) items) {'items ["hello" "world"]}))))
  (testing "filter keeps matching elements"
    (is (= [2 4]
           (tpl/eval-template-form '(filter (fn [x] (= 0 (% x 2))) items) {'items [1 2 3 4 5]})))))

(deftest eval-template-form-vector
  (testing "Vectors are evaluated element-wise"
    (is (= ["hi" "alice"]
           (tpl/eval-template-form '["hi" name] {'name "alice"})))))

(deftest eval-template-form-map-literal
  (testing "Map values are evaluated"
    (is (= {:greeting "hello alice"}
           (tpl/eval-template-form '{:greeting (str "hello " name)} {'name "alice"})))))

(deftest prompt-value-trims
  (testing "Trims and returns non-empty strings"
    (is (= "hello" (tpl/prompt-value "  hello  ")))
    (is (nil? (tpl/prompt-value "  ")))
    (is (nil? (tpl/prompt-value nil))))
  (testing "Passes through non-string values"
    (is (= '(template ["x"]) (tpl/prompt-value '(template ["x"]))))))

(deftest prompt-preview-strings
  (testing "Trims string values"
    (is (= "hello" (tpl/prompt-preview " hello ")))
    (is (nil? (tpl/prompt-preview ""))))
  (testing "Template forms get placeholder"
    (is (= "(template …)" (tpl/prompt-preview '(template ["x"])))))
  (testing "Other values are pr-str'd"
    (is (= "42" (tpl/prompt-preview 42)))))

(deftest render-legacy-placeholders-substitutes
  (testing "Replaces {ctx.key} placeholders"
    (is (= "hello alice"
           (tpl/render-legacy-placeholders "hello {ctx.user.name}"
                                          {:user {:name "alice"}}
                                          {})))))

(deftest render-prompt-string-template
  (testing "Renders string prompts with legacy placeholders"
    (is (= "hello bob"
           (tpl/render-prompt "hello {ctx.user.name}"
                              {} {:user {:name "bob"}})))))

(deftest render-prompt-list-template
  (testing "Renders list-form prompts"
    (is (= "hi alice"
           (tpl/render-prompt '(template ["hi" name])
                              {} {'name "alice"})))))

(deftest contract-template-context-merges
  (testing "Builds context from agent-spec and auth-context"
    (let [ctx (tpl/contract-template-context {:actor-id "a1" :role "admin"} {} {})]
      (is (= "a1" (:actor-id ctx)))
      (is (= "a1" (:actorId ctx)))
      (is (= "admin" (:role ctx)))
      (is (= {:actor-id "a1" :role "admin"} (:agent ctx))))))

(deftest render-prompt-with-auth-context
  (testing "Renders legacy placeholders using auth context user/org values"
    (is (= "hello alice"
           (tpl/render-legacy-placeholders "hello {ctx.user.name}"
                                           {:user {:name "alice"}}
                                           {})))
    (is (= "org: myorg"
           (tpl/render-legacy-placeholders "org: {ctx.org.slug}"
                                           {:org {:slug "myorg"}}
                                           {})))
    (is (= "email: a@b.com"
           (tpl/render-legacy-placeholders "email: {ctx.user.email}"
                                           {:user {:email "a@b.com"}}
                                           {})))))

(deftest model-profiles-are-defined
  (testing "Model profiles exist for all expected keys"
    (is (contains? tpl/model-profiles :local-fast))
    (is (contains? tpl/model-profiles :cloud-heavy))
    (is (string? (:model (:local-fast tpl/model-profiles))))))

(deftest default-tool-policies-are-defined
  (testing "Default tool policies list is non-empty"
    (is (pos? (count (tpl/default-tool-policies))))
    (is (every? :toolId (tpl/default-tool-policies)))
    (is (every? :effect (tpl/default-tool-policies)))))

(deftest discord-message-template-context-extracts
  (testing "Extracts discord message fields"
    (let [ctx (tpl/discord-message-template-context
               {:authorUsername "bob" :authorId "u1" :guildName "G"
                :channelName "general" :content "hello"}
               {:timestamp "2024-01-01" :messageId "m1"})]
      (is (= "bob" (:user-name ctx)))
      (is (= "u1" (:user-id ctx)))
      (is (= "G" (:guild ctx)))
      (is (= "general" (:channel ctx)))
      (is (= "hello" (:text ctx)))
      (is (= "m1" (:message-id ctx))))))
