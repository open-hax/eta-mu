(require '[eta-mu.receipt-river.api :as api]
         '[eta-mu.receipt-river.extern.fs :as fs]
         '[cljs.reader :as reader]
         '[clojure.string :as str]
         '["node:fs" :as node-fs])
(let [input (js->clj (js/JSON.parse (node-fs/readFileSync ".ημ/review-evidence/trusted-publication-preflight/receipt-input.json" "utf8")) :keywordize-keys true)
      payload (update (:payload input) :kind keyword)
      event (api/build-event {:event-id (random-uuid) :recorded-at (:ts payload)
                              :component-manifest {:eta-mu/version "1.1.1"}
                              :command "source-owned receipt API / worker preflight failure execution"
                              :producer {:actor/id "codex" :source/commit (:source input)}
                              :subject {:repository/id "github.com/open-hax/eta-mu" :source/commit (:source input)}
                              :refs [(str "sha256:" (:archive_sha256 input))]} payload)
      line (pr-str event)
      lines (remove str/blank? (str/split-lines (node-fs/readFileSync "receipts.edn" "utf8")))
      valid (api/validate-line line (inc (count lines)))]
  (assert (:ok valid) (pr-str valid))
  (fs/append-text! "receipts.edn" (str line "\n"))
  (let [rows (map-indexed #(api/validate-line %2 (inc %1)) (conj (vec lines) line))]
    (println (pr-str {:rows (count rows) :invalid (count (remove :ok rows)) :errors (reduce + (map #(count (:errors %)) rows)) :prospective-valid (:ok valid)}))))
