(ns eta-mu.coding.extern.clipboard
  "Platform clipboard read/write. All JS interop is local to this extern namespace."
  (:require [clojure.string :as str]))

(def ^:private child-process (js/require "node:child_process"))
(def ^:private fs (js/require "node:fs"))
(def ^:private node-path (js/require "node:path"))
(def ^:private node-os (js/require "node:os"))

(def ^:private max-osc52-encoded-length 100000)

(defn- run-sync
  "Run a command synchronously via execSync. Returns a trimmed string or nil on failure."
  [command]
  (try
    (let [result (.execSync child-process command
                            #js {:encoding "utf8"
                                 :timeout 5000
                                 :stdio #js ["pipe" "pipe" "ignore"]
                                 :maxBuffer (* 50 1024 1024)})]
      (when result
        (let [s (str/trim (str result))]
          (when-not (str/blank? s) s))))
    (catch js/Error _ nil)))

(defn- spawn-sync-buffer
  "Run a command synchronously via spawnSync, returning a raw Buffer or nil on failure."
  [command args]
  (try
    (let [result (.spawnSync child-process command (clj->js args)
                             #js {:timeout 3000
                                  :maxBuffer (* 50 1024 1024)})]
      (when (and (zero? (.-status result)) (not (.-error result)))
        (.-stdout result)))
    (catch js/Error _ nil)))

(defn is-wayland?
  "Return true when the current session is Wayland."
  []
  (let [env (.-env js/process)]
    (or (boolean (aget env "WAYLAND_DISPLAY"))
        (= (aget env "XDG_SESSION_TYPE") "wayland"))))

(defn is-wsl?
  "Return true when running inside WSL."
  []
  (let [env (.-env js/process)]
    (if (or (aget env "WSL_DISTRO_NAME") (aget env "WSLENV"))
      true
      (try
        (let [release (.readFileSync fs "/proc/version" "utf8")]
          (boolean (re-find #"(?i)microsoft|wsl" release)))
        (catch js/Error _ false)))))

(defn is-termux?
  "Return true when running inside Termux."
  []
  (boolean (aget (.-env js/process) "TERMUX_VERSION")))

(defn is-remote?
  "Return true when connected via SSH or MOSH."
  []
  (let [env (.-env js/process)]
    (boolean (or (aget env "SSH_CONNECTION")
                 (aget env "SSH_CLIENT")
                 (aget env "MOSH_CONNECTION")))))

(defn copy-text!
  "Copy `text` to the system clipboard. Throws on failure."
  [text]
  (let [platform (.-platform js/process)
        opts #js {:input text :timeout 5000 :stdio #js ["pipe" "ignore" "ignore"]}
        osc52 (fn []
                 (let [encoded (.toString (js/Buffer.from text) "base64")]
                   (when (<= (count encoded) max-osc52-encoded-length)
                     (.write js/process.stdout (str "\u001b]52;c;" encoded "\u0007"))
                     true)))]
    (cond
      (= platform "darwin")
      (do (.execSync child-process "pbcopy" opts)
          (when (is-remote?) (osc52)))

      (= platform "win32")
      (do (.execSync child-process "clip" opts)
          (when (is-remote?) (osc52)))

      (is-termux?)
      (do (try
            (.execSync child-process "termux-clipboard-set" opts)
            (catch js/Error _
              (.execSync child-process "xclip -selection clipboard" opts)))
          (when (is-remote?) (osc52)))

      (and (is-wayland?) (aget (.-env js/process) "WAYLAND_DISPLAY"))
      (let [proc (.spawn child-process "wl-copy" #js [] #js {:stdio #js ["pipe" "ignore" "ignore"]})]
        (.on (.-stdin proc) "error" (fn [_]))
        (.write (.-stdin proc) text)
        (.end (.-stdin proc))
        (.unref proc)
        (when (is-remote?) (osc52)))

      (aget (.-env js/process) "DISPLAY")
      (do (try
            (.execSync child-process "xclip -selection clipboard" opts)
            (catch js/Error _
              (.execSync child-process "xsel --clipboard --input" opts)))
          (when (is-remote?) (osc52)))

      :else
      (or (osc52)
          (throw (js/Error. "Failed to copy to clipboard"))))))

(defn paste-text
  "Read text from the system clipboard. Returns a string or nil."
  []
  (cond
    (is-termux?)
    (run-sync "termux-clipboard-get")

    (and (is-wayland?) (aget (.-env js/process) "WAYLAND_DISPLAY"))
    (or (run-sync "wl-paste --no-newline")
        (run-sync "xclip -selection clipboard -o"))

    (is-wsl?)
    (or (run-sync "wl-paste --no-newline")
        (run-sync "xclip -selection clipboard -o")
        (run-sync "powershell.exe -NoProfile -Command \"Get-Clipboard\""))

    (aget (.-env js/process) "DISPLAY")
    (or (run-sync "xclip -selection clipboard -o")
        (run-sync "xsel --clipboard --output"))

    :else
    nil))

(defn- read-clipboard-image-wl-paste
  "Try reading a clipboard image via wl-paste."
  []
  (when-let [list (spawn-sync-buffer "wl-paste" #js ["--list-types"])]
    (let [types (-> (.toString list "utf-8")
                    (str/split #"\r?\n")
                    (->> (map str/trim)
                         (filterv #(not (str/blank? %)))))
          preferred (first (filter #(re-find #"^image/" %) types))]
      (when preferred
        (when-let [data (spawn-sync-buffer "wl-paste" #js ["--type" preferred "--no-newline"])]
          (when (pos? (.-length data))
            {:ok true :bytes (js/Uint8Array. data) :mime-type preferred}))))))

(defn- read-clipboard-image-xclip
  "Try reading a clipboard image via xclip."
  []
  (let [targets (spawn-sync-buffer "xclip" #js ["-selection" "clipboard" "-t" "TARGETS" "-o"])
        try-types (if targets
                    (let [ts (-> (.toString targets "utf-8")
                                (str/split #"\r?\n")
                                (->> (map str/trim)
                                     (filterv #(not (str/blank? %)))))]
                      (or (seq (filter #(re-find #"^image/" %) ts))
                          ["image/png" "image/jpeg" "image/webp" "image/gif"]))
                    ["image/png" "image/jpeg" "image/webp" "image/gif"])]
    (first
      (keep (fn [mime]
              (when-let [data (spawn-sync-buffer "xclip" #js ["-selection" "clipboard" "-t" mime "-o"])]
                (when (pos? (.-length data))
                  {:ok true :bytes (js/Uint8Array. data) :mime-type mime})))
            try-types))))

(defn- read-clipboard-image-powershell
  "Try reading a clipboard image via PowerShell (WSL fallback)."
  []
  (let [tmp-file (node-path.join (.tmpdir node-os) (str "pi-wsl-clip-" (random-uuid) ".png"))
        win-path (run-sync (str "wslpath -w " tmp-file))]
    (when win-path
      (let [ps-script (str "Add-Type -AssemblyName System.Windows.Forms;"
                           "Add-Type -AssemblyName System.Drawing;"
                           "$path = $env:PI_WSL_CLIPBOARD_IMAGE_PATH;"
                           "$img = [System.Windows.Forms.Clipboard]::GetImage();"
                           "if ($img) { $img.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); Write-Output 'ok' }"
                           "else { Write-Output 'empty' }")
            env (clj->js (merge (js->clj (.-env js/process))
                                {"PI_WSL_CLIPBOARD_IMAGE_PATH" win-path}))
            result (try
                     (.execSync child-process
                                (str "powershell.exe -NoProfile -Command \"" ps-script "\"")
                                #js {:timeout 5000 :env env :encoding "utf8"})
                     (catch js/Error _ nil))]
        (when (= (str/trim (str result)) "ok")
          (let [bytes (.readFileSync fs tmp-file)]
            (try (.unlinkSync fs tmp-file) (catch js/Error _))
            (when (pos? (.-length bytes))
              {:ok true :bytes (js/Uint8Array. bytes) :mime-type "image/png"})))))))

(defn read-clipboard-image
  "Read an image from the clipboard.
   Returns {:ok true :bytes Uint8Array :mime-type string} or {:ok false :error string}."
  []
  (cond
    (is-termux?)
    {:ok false :error "Termux does not support clipboard images"}

    (not= (.-platform js/process) "linux")
    {:ok false :error (str "Platform not supported: " (.-platform js/process))}

    :else
    (let [wsl (is-wsl?)
          wayland (is-wayland?)]
      (if (or wayland wsl)
        (or (read-clipboard-image-wl-paste)
            (read-clipboard-image-xclip)
            (when wsl (read-clipboard-image-powershell))
            {:ok false :error "No clipboard image found"})
        (or (read-clipboard-image-xclip)
            {:ok false :error "No clipboard image found"})))))

(defn extension-for-mime-type
  "Return the file extension for an image MIME type, or nil."
  [mime-type]
  (let [base (-> (str/lower-case mime-type)
                 (str/split ";")
                 first
                 str/trim)]
    (case base
      "image/png"  "png"
      "image/jpeg" "jpg"
      "image/webp" "webp"
      "image/gif"  "gif"
      nil)))
