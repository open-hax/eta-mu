(ns eta-mu.receipt-river.archaeology.provider
  "Provider boundary between package interpretation and repository evidence.")

(defprotocol ArchaeologyProvider
  (discover-repositories [provider roots options])
  (register-repository [provider path])
  (list-references [provider repository])
  (find-path-history [provider repository patterns])
  (read-object [provider repository object-id])
  (find-introducing-commits [provider occurrence])
  (governing-files-at [provider repository commit path])
  (export-evidence-packet [provider query]))
