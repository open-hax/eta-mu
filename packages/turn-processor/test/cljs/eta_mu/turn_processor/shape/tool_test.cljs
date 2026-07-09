(ns eta-mu.turn-processor.shape.tool-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.turn-processor.shape.tool :as shape]))

(deftest tool->openai-test
  (testing "canonical tool converts to OpenAI function definition"
    (let [tool {:name "read" :label "Read" :description "Reads a file" :parameters [:map]}
          dto (shape/tool->openai tool)]
      (is (= "function" (:type dto)))
      (is (= "read" (get-in dto [:function :name])))
      (is (= "Reads a file" (get-in dto [:function :description])))
      (is (= [:map] (get-in dto [:function :parameters]))))))

(deftest openai->tool-test
  (testing "wrapped OpenAI tool converts to canonical tool"
    (let [tool (shape/openai->tool {:type "function"
                                        :function {:name "write"
                                                   :description "Writes a file"
                                                   :parameters [:map]}})]
      (is (= "write" (:name tool)))
      (is (= "Writes a file" (:description tool)))))
  (testing "bare OpenAI function converts to canonical tool"
    (let [tool (shape/openai->tool {:name "delete" :description "Deletes" :parameters [:map]})]
      (is (= "delete" (:name tool))))))

(deftest tools->openai-test
  (testing "multiple tools convert"
    (let [tools [{:name "a" :label "A" :description "A" :parameters [:map]}
                 {:name "b" :label "B" :description "B" :parameters [:map]}]
          dtos (shape/tools->openai tools)]
      (is (= 2 (count dtos)))
      (is (= "a" (get-in dtos [0 :function :name]))))))

(deftest openai-context-test
  (testing "context includes OpenAI tools"
    (let [context {:system-prompt "sys"
                   :messages []
                   :tools [{:name "read" :label "Read" :description "Reads" :parameters [:map]}]}
          openai-ctx (shape/openai-context context)]
      (is (= "function" (-> openai-ctx :tools first :type))))))

(deftest validate-tools-test
  (testing "valid tools return nil"
    (is (nil? (shape/validate-tools [{:name "x" :label "X" :description "X" :parameters [:map]}]))))
  (testing "invalid tools return errors"
    (is (seq (shape/validate-tools [{:name ""}])))))
