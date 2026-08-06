(π-state
  (version "1.1.1")
  (timestamp "20260729T155534Z")
  (branch "agent/ledger-protocol-packages")
  (host "local")
  (base "765b25e9622ef7ca89b76ee5cece440f54c80690")
  (target-base "96d45617d10a3241060ac71c93fb1d0a81e5e654")
  (commits-after-snapshot 462)
  (summary "Extract Receipt River, Session Mycology, and Fork Tax packages; route canonical and compatibility commands; stamp component/schema versions; discover and inventory home-wide Git repositories.")
  (scope
    ("packages/receipt-river"
     "packages/session-mycology"
     "packages/fork-tax"
     "packages/eta-mu protocol delegation"
     "scripts/generate-ledger-metadata.mjs"
     ".ημ/receipt-river/repository-inventory.edn"
     "protocol receipts, reflection, docs, lockfile, and task card"))
  (verification
    ("@eta-mu/receipt-river: 8 tests, 25 assertions"
     "@eta-mu/session-mycology: 2 tests, 6 assertions"
     "@eta-mu/fork-tax: 5 tests, 13 assertions"
     "eta-mu: 152 tests, 342 assertions"))
  (concurrent-dirt
    ("Unrelated .github/workflows modifications and three pre-staged workflow deletions were preserved outside this snapshot."
     "kanban/.events/ledger.edn contains mixed pre-existing and task-event changes and was preserved outside this snapshot."))
  (manifest ".ημ/Π_MANIFEST.sha256"))
