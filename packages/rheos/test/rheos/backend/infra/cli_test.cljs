(ns rheos.backend.infra.cli-test
  (:require [cljs.test :refer [deftest is testing]]
            [rheos.backend.infra.cli :as cli]))

(deftest parses-bare-boolean-flags-without-consuming-the-next-option
  (testing "--force-status is a presence flag and leaves following options intact"
    (let [parsed (cli/parse-args
                  ["create" "--title" "Forced"
                   "--status" "in_progress"
                   "--force-status"
                   "--priority" "P0"])
          flags (:flags parsed)]
      (is (= "create" (:command parsed)))
      (is (= "Forced" (get flags "title")))
      (is (= "in_progress" (get flags "status")))
      (is (true? (get flags "force-status")))
      (is (= "P0" (get flags "priority"))))))

(deftest parses-explicit-boolean-values
  (testing "boolean flags may also be written with true or false"
    (is (true? (get-in (cli/parse-args ["board" "list" "--verbose" "true"])
                       [:flags "verbose"])))
    (is (false? (get-in (cli/parse-args ["create" "--force-status" "false"])
                        [:flags "force-status"])))))
