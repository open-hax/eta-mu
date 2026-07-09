(ns eta-mu.extern.child-process
  "Node child_process boundary."
  (:require [clojure.string :as string]
            ["node:child_process" :as cp]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(defn- module-dir
  "Return the directory containing the executing bundle, or cwd if unknown."
  []
  (or (when (and (exists? js/__filename) js/__filename)
        (path/dirname js/__filename))
      (js/process.cwd)))

(defn- candidate-package-roots
  "Return candidate directories for a package, searched from cwd and the module dir."
  [package-name]
  (let [segments (string/split package-name #"/")
        relative (apply str "node_modules/" (interpose "/" segments))
        base (module-dir)]
    [(path/resolve (js/process.cwd) relative)
     (path/resolve base relative)
     (path/resolve base ".." relative)
     (path/resolve base ".." ".." relative)]))

(defn- resolve-package-root
  "Find the package root by locating package.json. Handles ESM packages that do not
  export package.json."
  [package-name]
  (or (try
        (when-let [resolved (js/require.resolve (str package-name "/package.json"))]
          (path/dirname resolved))
        (catch :default _ nil))
      (some (fn [candidate]
              (let [pkg-json (path/join candidate "package.json")]
                (when (.existsSync fs pkg-json) candidate)))
            (candidate-package-roots package-name))))

(defn exec-capture
  "Execute a command with args, capture stdout/stderr, and return a promise of
  {:exit <code> :stdout <string> :stderr <string>}.

  Stdio is piped; the current working directory is process.cwd()."
  [command args]
  (js/Promise.
    (fn [resolve _reject]
      (let [stdout (atom "")
            stderr (atom "")
            child (.spawn cp command (clj->js args) #js {"stdio" "pipe" "cwd" (js/process.cwd)})]
        (.on (.-stdout child) "data" (fn [data] (swap! stdout str data)))
        (.on (.-stderr child) "data" (fn [data] (swap! stderr str data)))
        (.on child "close" (fn [code] (resolve {:exit (or code 0) :stdout @stdout :stderr @stderr})))
        (.on child "error" (fn [err] (resolve {:exit 1 :stdout @stdout :stderr (.-message err)})))))))

(defn spawn-inherit
  "Spawn a command with inherited stdio and return a promise that resolves with its exit code."
  [command args]
  (js/Promise.
    (fn [resolve _reject]
      (let [child (.spawn cp command (clj->js args) #js {"stdio" "inherit" "cwd" (js/process.cwd)})]
        (.on child "close" (fn [code] (resolve (or code 0))))
        (.on child "error" (fn [err]
                             (js/console.error (str "Failed to spawn '" command "': " (.-message err)))
                             (resolve 1)))))))

(defn resolve-legacy-cli-path
  "Resolve the legacy @open-hax/eta-mu-cli dist/cli.js path, or nil if not installed."
  []
  (when-let [root (resolve-package-root "@open-hax/eta-mu-cli")]
    (let [candidate (path/join root "dist" "cli.js")]
      (when (.existsSync fs candidate)
        candidate))))

(defn resolve-rheos-path
  "Resolve the @open-hax/rheos dist/cli.cjs path, or nil if not installed."
  []
  (when-let [root (resolve-package-root "@open-hax/rheos")]
    (let [candidate (path/join root "dist" "cli.cjs")]
      (when (.existsSync fs candidate)
        candidate))))

(defn resolve-contracts-output-path
  "Resolve the @eta-mu/contracts-output dist-cli/index.cjs path, or nil if not installed."
  []
  (when-let [root (resolve-package-root "@eta-mu/contracts-output")]
    (let [candidate (path/join root "dist-cli" "index.cjs")]
      (when (.existsSync fs candidate)
        candidate))))
