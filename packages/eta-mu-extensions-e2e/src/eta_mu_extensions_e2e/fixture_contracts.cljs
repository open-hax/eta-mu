(ns eta-mu-extensions-e2e.fixture-contracts)

(def block-contract
  {:contracts
   [{:id "deny-shell"
     :when {:tool/name "shell"}
     :decision :block
     :message "No shell."}]})

(def notify-contract
  {:contracts
   [{:id "notify-write"
     :when {:tool/name "write_file"}
     :fulfill {:action :notify
               :message "tool={tool/name} dry={dry-run} error={tool/error?}"}}]})

(def error-contract
  {:contracts
   [{:id "notify-error"
     :when {:tool/error? true}
     :fulfill {:action :notify
               :message "error path for {tool/name}"}}]})
