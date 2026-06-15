(ns eta-mu.coding.extern.shell-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.extern.shell :as shell]))

(deftest resolve-shell-config-test
  (testing "Unix shell resolution order"
    (is (= "/bin/bash" (:shell (shell/resolve-shell-config {:platform "unix" :exists? #(= % "/bin/bash")}))))
    (is (= "bash" (:shell (shell/resolve-shell-config {:platform "unix" :exists? #(= % "bash")}))))
    (is (= "sh" (:shell (shell/resolve-shell-config {:platform "unix" :exists? (constantly false)}))))
    (is (= "/custom/sh" (:shell (shell/resolve-shell-config {:platform "unix" :custom-shell-path "/custom/sh" :exists? #(= % "/custom/sh")}))))))

(deftest resolve-shell-config-windows-test
  (testing "Windows shell resolution order"
    (let [found (shell/resolve-shell-config {:platform "win32" :exists? #(= % "C:\\Git\\bin\\bash.exe") :custom-shell-path "C:\\Git\\bin\\bash.exe"})]
      (is (:ok found))
      (is (= "C:\\Git\\bin\\bash.exe" (:shell found))))))

(deftest sanitize-binary-output-test
  (is (= "abc\n\t\r" (shell/sanitize-binary-output "abc\n\t\r\u0000\uFFF9"))))
