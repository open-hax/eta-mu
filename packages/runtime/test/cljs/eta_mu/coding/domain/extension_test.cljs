(ns eta-mu.coding.domain.extension-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.law.extension :as law]
            [eta-mu.coding.domain.extension :as domain]
            [eta-mu.coding.shape.extension :as shape]))

;; ============================================================================
;; Test Fixtures
;; ============================================================================

(defn- make-manifest
  [path]
  {:path path
   :resolved-path (str "/resolved/" path)
   :source-info {:source :local
                 :base-dir "/some/dir"}})

(defn- make-ext
  [path & {:keys [handlers tools commands flags shortcuts]}]
  (cond-> {:manifest (make-manifest path)
           :handlers (or handlers {})
           :tools (or tools {})
           :commands (or commands {})
           :flags (or flags {})
           :shortcuts (or shortcuts {})
           :message-renderers {}}
    (seq handlers) identity))

(defn- tool-def
  [name]
  {:name name
   :label (str "Label " name)
   :description (str "Description " name)
   :parameters {:type "object" :properties {}}})

(defn- handler-fn [event _ctx]
  nil)

(defn- transform-handler [event _ctx]
  {:action :transform :text "transformed"})

(defn- handled-handler [event _ctx]
  {:action :handled})

;; ============================================================================
;; Law Schema Validation
;; ============================================================================

(deftest extension-manifest-schema-test
  (testing "valid extension manifest"
    (is (law/valid-extension-manifest?
         {:path "ext.ts"
          :resolved-path "/resolved/ext.ts"
          :source-info {:source :local
                        :base-dir "/dir"}})))
  (testing "invalid extension manifest"
    (is (not (law/valid-extension-manifest? {:path ""})))))

(deftest tool-definition-schema-test
  (testing "valid tool definition"
    (is (law/valid-tool-definition?
         {:name "my-tool"
          :label "My Tool"
          :description "Does stuff"
          :parameters {}})))
  (testing "invalid tool definition"
    (is (not (law/valid-tool-definition? {:name ""})))))

(deftest extension-event-schema-test
  (testing "valid input event"
    (is (law/valid-extension-event?
         {:type :input
          :text "hello"
          :source :interactive})))
  (testing "valid agent start event"
    (is (law/valid-extension-event?
         {:type :agent_start})))
  (testing "valid session start event"
    (is (law/valid-extension-event?
         {:type :session_start
          :reason :startup})))
  (testing "valid tool call event"
    (is (law/valid-extension-event?
         {:type :tool_call
          :tool-call-id "tc1"
          :tool-name "bash"
          :input {:command "ls"}})))
  (testing "valid tool result event"
    (is (law/valid-extension-event?
         {:type :tool_result
          :tool-call-id "tc1"
          :tool-name "bash"
          :input {:command "ls"}
          :content [{:type :text :text "ok"}]
          :is-error false}))))

;; ============================================================================
;; Domain: Extension State
;; ============================================================================

(deftest create-extension-test
  (testing "creates empty extension state"
    (let [ext (domain/create-extension (make-manifest "ext.ts"))]
      (is (= "ext.ts" (domain/extension-path ext)))
      (is (= {} (:handlers ext)))
      (is (= {} (:tools ext)))
      (is (= {} (:commands ext))))))

(deftest register-handler-test
  (testing "registers handler on extension"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "input" handler-fn))]
      (is (= 1 (count (get-in ext [:handlers "input"])))))))

(deftest get-handlers-test
  (testing "finds handlers across extensions"
    (let [ext1 (-> (domain/create-extension (make-manifest "ext1.ts"))
                   (domain/register-handler "input" handler-fn))
          ext2 (-> (domain/create-extension (make-manifest "ext2.ts"))
                   (domain/register-handler "input" transform-handler))
          handlers (domain/get-handlers [ext1 ext2] "input")]
      (is (= 2 (count handlers)))
      (is (= "ext1.ts" (domain/extension-path (first (first handlers))))))))

(deftest has-handlers-test
  (testing "detects presence of handlers"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "input" handler-fn))]
      (is (domain/has-handlers? [ext] "input"))
      (is (not (domain/has-handlers? [ext] "context"))))))

;; ============================================================================
;; Domain: Tool Registration
;; ============================================================================

(deftest register-tool-test
  (testing "registers tool on extension"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-tool (tool-def "my-tool")))]
      (is (contains? (:tools ext) "my-tool"))
      (is (= "my-tool" (get-in ext [:tools "my-tool" :definition :name]))))))

(deftest get-all-registered-tools-test
  (testing "collects tools across extensions, first wins"
    (let [ext1 (-> (domain/create-extension (make-manifest "ext1.ts"))
                   (domain/register-tool (tool-def "shared")))
          ext2 (-> (domain/create-extension (make-manifest "ext2.ts"))
                   (domain/register-tool (tool-def "shared"))
                   (domain/register-tool (tool-def "unique")))
          tools (domain/get-all-registered-tools [ext1 ext2])]
      (is (= 2 (count tools)))
      (is (some #(= "shared" (:name (:definition %))) tools))
      (is (some #(= "unique" (:name (:definition %))) tools)))))

(deftest get-tool-definition-test
  (testing "finds tool definition by name"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-tool (tool-def "my-tool")))]
      (is (= "my-tool" (:name (domain/get-tool-definition [ext] "my-tool"))))
      (is (nil? (domain/get-tool-definition [ext] "other"))))))

;; ============================================================================
;; Domain: Command Registration
;; ============================================================================

(deftest register-command-test
  (testing "registers command on extension"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-command "test-cmd" {:description "A test command"}))]
      (is (contains? (:commands ext) "test-cmd")))))

(deftest resolve-command-names-test
  (testing "disambiguates duplicate command names"
    (let [ext1 (-> (domain/create-extension (make-manifest "ext1.ts"))
                   (domain/register-command "shared" {:description "cmd1"}))
          ext2 (-> (domain/create-extension (make-manifest "ext2.ts"))
                   (domain/register-command "shared" {:description "cmd2"}))
          resolved (domain/resolve-command-names [ext1 ext2])]
      (is (= 2 (count resolved)))
      (is (= "shared:1" (:invocation-name (first resolved))))
      (is (= "shared:2" (:invocation-name (second resolved)))))))

(deftest get-command-test
  (testing "finds command by invocation name"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-command "test-cmd" {:description "A test command"}))]
      (is (= "test-cmd" (:invocation-name (domain/get-command [ext] "test-cmd"))))
      (is (nil? (domain/get-command [ext] "other"))))))

;; ============================================================================
;; Domain: Flag Registration
;; ============================================================================

(deftest register-flag-test
  (testing "registers flag on extension"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-flag "my-flag" {:type :boolean :default true}))]
      (is (contains? (:flags ext) "my-flag")))))

(deftest get-all-flags-test
  (testing "collects flags across extensions, first wins"
    (let [ext1 (-> (domain/create-extension (make-manifest "ext1.ts"))
                   (domain/register-flag "shared" {:type :boolean}))
          ext2 (-> (domain/create-extension (make-manifest "ext2.ts"))
                   (domain/register-flag "shared" {:type :string}))
          flags (domain/get-all-flags [ext1 ext2])]
      (is (= 1 (count flags)))
      (is (= :boolean (:type (get flags "shared")))))))

(deftest apply-flag-defaults-test
  (testing "applies default values to flag-values"
    (let [flags {"a" {:default true} "b" {:default "hello"} "c" {:type :boolean}}
          result (domain/apply-flag-defaults {} flags)]
      (is (true? (get result "a")))
      (is (= "hello" (get result "b")))
      (is (nil? (get result "c")))))
  (testing "does not override existing values"
    (let [flags {"a" {:default true}}
          result (domain/apply-flag-defaults {"a" false} flags)]
      (is (false? (get result "a"))))))

;; ============================================================================
;; Domain: Input Event Handling
;; ============================================================================

(deftest emit-input-event-continue-test
  (testing "returns continue when no handler modifies"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "input" handler-fn))]
      (is (= {:action :continue}
             (domain/emit-input-event [ext] "hello" nil :interactive))))))

(deftest emit-input-event-transform-test
  (testing "returns transform when handler modifies"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "input" transform-handler))]
      (is (= {:action :transform :text "transformed"}
             (domain/emit-input-event [ext] "hello" nil :interactive))))))

(deftest emit-input-event-handled-test
  (testing "returns handled when handler consumes"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "input" handled-handler))]
      (is (= {:action :handled}
             (domain/emit-input-event [ext] "hello" nil :interactive))))))

;; ============================================================================
;; Domain: Context Event Handling
;; ============================================================================

(deftest emit-context-event-test
  (testing "passes through when no handler modifies"
    (let [messages [{:role :user :content "hello"}]
          ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "context" handler-fn))]
      (is (= messages (domain/emit-context-event [ext] messages)))))
  (testing "replaces messages when handler returns new messages"
    (let [messages [{:role :user :content "hello"}]
          new-messages [{:role :assistant :content "hi"}]
          handler (fn [_ _] {:messages new-messages})
          ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "context" handler))]
      (is (= new-messages (domain/emit-context-event [ext] messages))))))

;; ============================================================================
;; Domain: Tool Call Interception
;; ============================================================================

(deftest emit-tool-call-event-test
  (testing "returns nil when no handler blocks"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "tool_call" handler-fn))]
      (is (nil? (domain/emit-tool-call-event [ext] "tc1" "bash" {})))))
  (testing "returns block when handler blocks"
    (let [handler (fn [_ _] {:block true :reason "not allowed"})
          ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "tool_call" handler))]
      (is (= {:block? true :reason "not allowed"}
             (domain/emit-tool-call-event [ext] "tc1" "bash" {}))))))

;; ============================================================================
;; Domain: Tool Result Interception
;; ============================================================================

(deftest emit-tool-result-event-test
  (testing "returns nil when no handler modifies"
    (let [ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "tool_result" handler-fn))]
      (is (nil? (domain/emit-tool-result-event [ext] "tc1" "bash" {} [] false)))))
  (testing "returns modifications when handler changes result"
    (let [handler (fn [event _] {:is-error true})
          ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "tool_result" handler))]
      (is (= {:is-error true}
             (domain/emit-tool-result-event [ext] "tc1" "bash" {} [] false))))))

;; ============================================================================
;; Domain: Resources Discovery
;; ============================================================================

(deftest emit-resources-discover-test
  (testing "collects resource paths from extensions"
    (let [handler (fn [_ _] {:skill-paths ["/skills/test"] :theme-paths ["/themes/dark"]})
          ext (-> (domain/create-extension (make-manifest "ext.ts"))
                  (domain/register-handler "resources_discover" handler))]
      (let [result (domain/emit-resources-discover [ext] "/cwd" :startup)]
        (is (= ["/skills/test"] (:skill-paths result)))
        (is (= ["/themes/dark"] (:theme-paths result)))
        (is (= [] (:prompt-paths result)))))))

;; ============================================================================
;; Domain: Extension Discovery
;; ============================================================================

(deftest expand-home-test
  (testing "expands ~ to home directory"
    (is (= "/home/user/.config" (domain/expand-home "~/.config" "/home/user"))))
  (testing "expands ~/ to home directory"
    (is (= "/home/user/.config" (domain/expand-home "~/.config" "/home/user"))))
  (testing "leaves absolute paths unchanged"
    (is (= "/etc/config" (domain/expand-home "/etc/config" "/home/user")))))

(deftest resolve-extension-path-test
  (testing "resolves absolute paths"
    (is (= "/etc/ext.ts" (domain/resolve-extension-path "/etc/ext.ts" "/cwd" "/home"))))
  (testing "resolves relative paths"
    (is (= "/cwd/ext.ts" (domain/resolve-extension-path "ext.ts" "/cwd" "/home"))))
  (testing "expands and resolves home paths"
    (is (= "/home/user/ext.ts" (domain/resolve-extension-path "~/ext.ts" "/cwd" "/home/user")))))

(deftest is-extension-file-test
  (testing "recognizes extension files"
    (is (domain/is-extension-file? "ext.ts"))
    (is (domain/is-extension-file? "ext.js"))
    (is (domain/is-extension-file? "ext.cljs")))
  (testing "rejects non-extension files"
    (is (not (domain/is-extension-file? "readme.md")))
    (is (not (domain/is-extension-file? "package.json")))))

(deftest dedupe-paths-test
  (testing "removes duplicate paths"
    (is (= ["/a" "/b"] (domain/dedupe-paths ["/a" "/b" "/a"])))))

;; ============================================================================
;; Shape: Manifest Conversion
;; ============================================================================

(deftest manifest-from-external-test
  (testing "converts external manifest to internal"
    (let [result (shape/manifest-from-external
                  {:path "ext.ts"
                   :resolvedPath "/resolved/ext.ts"
                   :source "local"
                   :baseDir "/dir"})]
      (is (= "ext.ts" (:path result)))
      (is (= "/resolved/ext.ts" (:resolved-path result)))
      (is (= :local (get-in result [:source-info :source])))
      (is (= "/dir" (get-in result [:source-info :base-dir]))))))

(deftest manifest->external-test
  (testing "converts internal manifest to external"
    (let [manifest {:path "ext.ts"
                    :resolved-path "/resolved/ext.ts"
                    :source-info {:source :local :base-dir "/dir"}}
          result (shape/manifest->external manifest)]
      (is (= "ext.ts" (:path result)))
      (is (= "/resolved/ext.ts" (:resolvedPath result)))
      (is (= "local" (:source result)))
      (is (= "/dir" (:baseDir result))))))

;; ============================================================================
;; Shape: Tool Definition Conversion
;; ============================================================================

(deftest tool-definition-from-external-test
  (testing "converts external tool definition"
    (let [result (shape/tool-definition-from-external
                  {:name "bash"
                   :label "Bash"
                   :description "Run bash"
                   :promptSnippet "Run commands"
                   :parameters {:type "object"}})]
      (is (= "bash" (:name result)))
      (is (= "Bash" (:label result)))
      (is (= "Run commands" (:prompt-snippet result)))
      (is (= {:type "object"} (:parameters result))))))

(deftest tool-definition->external-test
  (testing "converts internal tool definition"
    (let [tool {:name "bash"
                :label "Bash"
                :description "Run bash"
                :prompt-snippet "Run commands"
                :parameters {:type "object"}
                :execution-mode :parallel}
          result (shape/tool-definition->external tool)]
      (is (= "bash" (:name result)))
      (is (= "parallel" (:executionMode result))))))

;; ============================================================================
;; Shape: Event Conversion
;; ============================================================================

(deftest event-from-external-input-test
  (testing "converts external input event"
    (let [result (shape/event-from-external
                  {:type "input"
                   :text "hello"
                   :source "interactive"})]
      (is (= :input (:type result)))
      (is (= "hello" (:text result)))
      (is (= :interactive (:source result))))))

(deftest event-from-external-session-start-test
  (testing "converts external session_start event"
    (let [result (shape/event-from-external
                  {:type "session_start"
                   :reason "startup"})]
      (is (= :session_start (:type result)))
      (is (= :startup (:reason result))))))

(deftest event-from-external-agent-start-test
  (testing "converts external agent_start event"
    (let [result (shape/event-from-external {:type "agent_start"})]
      (is (= :agent_start (:type result))))))

(deftest event-from-external-tool-call-test
  (testing "converts external tool_call event"
    (let [result (shape/event-from-external
                  {:type "tool_call"
                   :toolCallId "tc1"
                   :toolName "bash"
                   :input {:command "ls"}})]
      (is (= :tool_call (:type result)))
      (is (= "tc1" (:tool-call-id result)))
      (is (= "bash" (:tool-name result)))
      (is (= {:command "ls"} (:input result))))))

(deftest event->external-input-test
  (testing "converts internal input event to external"
    (let [event {:type :input :text "hello" :source :interactive}
          result (shape/event->external event)]
      (is (= "input" (:type result)))
      (is (= "hello" (:text result)))
      (is (= "interactive" (:source result))))))

(deftest event->external-agent-start-test
  (testing "converts internal agent_start event to external"
    (let [result (shape/event->external {:type :agent_start})]
      (is (= "agent_start" (:type result))))))

(deftest event->external-tool-call-test
  (testing "converts internal tool_call event to external"
    (let [event {:type :tool_call
                 :tool-call-id "tc1"
                 :tool-name "bash"
                 :input {:command "ls"}}
          result (shape/event->external event)]
      (is (= "tool_call" (:type result)))
      (is (= "tc1" (:toolCallId result)))
      (is (= "bash" (:toolName result))))))

;; ============================================================================
;; Shape: Extension State Conversion
;; ============================================================================

(deftest extension-from-external-test
  (testing "converts external extension to internal"
    (let [result (shape/extension-from-external
                  {:path "ext.ts"
                   :tools {"my-tool" {:definition {:name "my-tool"
                                                   :label "My Tool"
                                                   :description "Does stuff"
                                                   :parameters {}}
                                       :sourceInfo {:source "local"}}}
                   :commands {"cmd" {:name "cmd"
                                    :sourceInfo {:source "local"}}}})]
      (is (= "ext.ts" (get-in result [:manifest :path])))
      (is (contains? (:tools result) "my-tool"))
      (is (= "my-tool" (get-in result [:tools "my-tool" :definition :name])))
      (is (contains? (:commands result) "cmd")))))

(deftest extension->external-test
  (testing "converts internal extension to external"
    (let [ext {:manifest {:path "ext.ts"
                          :resolved-path "/resolved/ext.ts"
                          :source-info {:source :local :base-dir "/dir"}}
               :handlers {}
               :tools {"my-tool" {:definition {:name "my-tool"
                                               :label "My Tool"
                                               :description "Does stuff"
                                               :parameters {}}
                                   :source-info {:source :local}}}
               :commands {}
               :flags {}
               :shortcuts {}
               :message-renderers {}}
          result (shape/extension->external ext)]
      (is (= "ext.ts" (:path result)))
      (is (= "/resolved/ext.ts" (:resolvedPath result)))
      (is (contains? (:tools result) "my-tool")))))

;; ============================================================================
;; Shape: Result Conversion
;; ============================================================================

(deftest input-event-result->external-test
  (testing "converts continue"
    (is (= {:action "continue"}
           (shape/input-event-result->external {:action :continue}))))
  (testing "converts handled"
    (is (= {:action "handled"}
           (shape/input-event-result->external {:action :handled}))))
  (testing "converts transform"
    (is (= {:action "transform" :text "hello"}
           (shape/input-event-result->external {:action :transform :text "hello"})))))

(deftest tool-call-event-result->external-test
  (testing "converts block result"
    (is (= {:block true :reason "no"}
           (shape/tool-call-event-result->external {:block? true :reason "no"}))))
  (testing "converts nil result"
    (is (= {} (shape/tool-call-event-result->external nil)))))

(deftest session-before-result->external-test
  (testing "converts cancel result"
    (is (= {:cancel true}
           (shape/session-before-result->external {:cancel true}))))
  (testing "converts fork result with skip"
    (is (= {:skipConversationRestore true}
           (shape/session-before-result->external {:skip-conversation-restore true})))))
