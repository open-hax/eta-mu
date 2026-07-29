(ns eta-mu.receipt-river.extern.bus
  "Receipt River's stderr adapter for structured bus error events.")

(defn emit-error!
  [error-type details]
  (js/console.error
   (pr-str
    {:event/type :eta-mu.bus/error
     :error/type error-type
     :error/details details})))
