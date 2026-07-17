(ns eta-mu.domain.receipt
  "Pure receipt-river logic for the eta-mu CLI.

  Operates on a target repo root and a line-oriented EDN file at
  `<repo-root>/receipts.edn`. The format is the same append-only EDN used by
  the pi receipt-river extension."
  (:require [clojure.edn :as edn]
            [clojure.string :as str]
            [eta-mu.extern.fs :as fs]))

(def known-kinds
  #{:push-truth :artifact-hash :test-run :build :decision :drift :catalog
    :observation :field-impact :truth :refutation :adjudication})

(def required-keys
  [:ts :kind :repo :origin :owner :dod :pi :host :manifest :refs])

(defn now-iso
  "Return an ISO-8601 timestamp for the current instant."
  []
  (.toISOString (js/Date.)))

(defn clean-field
  "Trim whitespace and collapse newlines; return fallback if blank."
  ([value] (clean-field value "none"))
  ([value fallback]
   (let [s (-> (str (or value ""))
               (.replace #"\r?\n+" " ")
               (.replace #"\s+" " ")
               (.trim))]
     (if (pos? (.-length s)) s fallback))))

(defn normalize-kind
  "Return a keyword kind, throwing for unknown kinds."
  [value fallback]
  (let [raw (clean-field value (name fallback))
        kind (keyword (if (str/starts-with? raw ":") (subs raw 1) raw))]
    (if (contains? known-kinds kind)
      kind
      (throw (js/Error. (str "Unknown receipt kind: " kind))))))

(defn read-lines
  "Read non-empty lines from a file path."
  [file-path]
  (if-not (fs/file-exists? file-path)
    []
    (-> (fs/read-file file-path)
        (str/split-lines)
        (->> (filter seq)))))

(defn tail-lines
  "Return the last n lines from a file path."
  [file-path n]
  (let [all (read-lines file-path)]
    (if (<= (count all) n)
      all
      (drop (- (count all) n) all))))

(defn validate-line
  "Validate a single EDN receipt line. Returns a map with :ok, :line, :event,
  and :errors."
  [line line-number]
  (let [errors (atom [])]
    (try
      (let [event (edn/read-string line)]
        (when-not (map? event)
          (swap! errors conj "event is not a map"))
        (doseq [k required-keys]
          (when-not (contains? event k)
            (swap! errors conj (str "missing required key: " (name k)))))
        (when-let [kind (:kind event)]
          (when-not (contains? known-kinds kind)
            (swap! errors conj (str "unknown kind: " kind))))
        (when-let [ts (:ts event)]
          (when (js/Number.isNaN (js/Date.parse ts))
            (swap! errors conj (str "invalid ts: " ts))))
        {:ok (zero? (count @errors))
         :line-number line-number
         :event event
         :errors @errors
         :line line})
      (catch :default e
        {:ok false
         :line-number line-number
         :event nil
         :errors [(str "invalid EDN: " (.-message e))]
         :line line}))))

(defn validate-file
  "Validate the last n lines of a receipt file. Returns a map with :ok, :file,
  :count, :failures, and :last."
  [file-path n]
  (if-not (fs/file-exists? file-path)
    {:ok false
     :file file-path
     :count 0
     :failures [{:line-number 0 :errors ["file does not exist"]}]
     :last nil}
    (let [rows (map-indexed #(validate-line %2 (inc %1)) (tail-lines file-path n))
          failures (remove :ok rows)]
      {:ok (zero? (count failures))
       :file file-path
       :count (count rows)
       :failures failures
       :last (last rows)})))

(defn build-record
  "Build a receipt record map from parameters."
  [params repo-root fallback-kind]
  (let [record {:ts (clean-field (:ts params) (now-iso))
                :kind (normalize-kind (:kind params) fallback-kind)
                :repo repo-root
                :origin (clean-field (:origin params) "pi")
                :owner (clean-field (:owner params) "receipt-river")
                :dod (clean-field (:dod params) (or (:owner params) "receipt-river"))
                :pi (clean-field (:pi params) "0.1.0")
                :host (clean-field (:host params) "local")
                :manifest (clean-field (:manifest params) "none")
                :refs (clean-field (:refs params) "none")}
        optionals (select-keys params [:note :tests :decisions :drift])]
    (reduce (fn [acc [k v]]
              (let [clean (clean-field v "")]
                (if (str/blank? clean) acc (assoc acc k clean))))
            record
            optionals)))

(defn format-line
  "Render a receipt record as an EDN line."
  [record]
  (pr-str record))
