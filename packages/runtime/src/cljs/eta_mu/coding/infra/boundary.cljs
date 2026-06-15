(ns eta-mu.coding.infra.boundary)

(def implemented-boundaries
  [{:boundary :fs
    :namespace "eta-mu.coding.extern.fs"
    :contract "coding-agent filesystem read/write/list/delete/copy/stat"}
   {:boundary :path
    :namespace "eta-mu.coding.extern.path"
    :contract "path string manipulation"}
   {:boundary :process-exec
    :namespace "eta-mu.coding.extern.process-exec"
    :contract "child process spawn/execute"}
   {:boundary :git
    :namespace "eta-mu.coding.extern.git"
    :contract "git CLI orchestration"}
   {:boundary :shell
    :namespace "eta-mu.coding.extern.shell"
    :contract "shell config resolution (pure, no I/O)"}
   {:boundary :lockfile
    :namespace "eta-mu.coding.extern.lockfile"
    :contract "advisory file locking"}
   {:boundary :fs-watch
    :namespace "eta-mu.coding.extern.fs-watch"
    :contract "fs.watch/fs.watchFile wrapper"}])

(defn boundary-inventory
  "Return the inventory of implemented and planned coding extern boundaries."
  []
  {:implemented implemented-boundaries
   :planned []})
