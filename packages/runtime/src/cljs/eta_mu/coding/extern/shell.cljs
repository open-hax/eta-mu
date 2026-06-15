(ns eta-mu.coding.extern.shell
  (:require [clojure.string :as str]))

(defn default-windows-shell-candidates
  "Return the default list of Windows Git Bash candidate paths."
  []
  (let [process (.-process js/globalThis)
        program-files (or (.-ProgramFiles process) "")
        program-files-x86 (or (aget (.-env process) "ProgramFiles(x86)") "")]
    (cond-> []
      (seq program-files) (conj (str program-files "\\Git\\bin\\bash.exe"))
      (seq program-files-x86) (conj (str program-files-x86 "\\Git\\bin\\bash.exe")))))

(defn default-unix-shell-candidates
  "Return the default list of Unix shell candidate names/paths."
  []
  ["/bin/bash" "bash" "sh"])

(defn- resolve-shell
  "Return the first candidate that exists according to `exists?`."
  [candidates exists?]
  (first (filter exists? candidates)))

(defn resolve-shell-config
  "Pure shell config resolution.
   `opts` may include :platform, :custom-shell-path, :exists? (fn [path] boolean),
   and :find-bash (fn [] path-or-nil).
   Returns {:ok true :shell path :args [\"-c\"]} or {:ok false :error :code}."
  [{:keys [platform custom-shell-path exists? find-bash]
    :or {platform (.-platform (.-process js/globalThis))}}]
  (cond
    custom-shell-path
    (if (and exists? (exists? custom-shell-path))
      {:ok true :shell custom-shell-path :args ["-c"]}
      {:ok false :error (str "Custom shell path not found: " custom-shell-path) :code "ESHELL"})

    (= platform "win32")
    (let [candidates (default-windows-shell-candidates)
          found (when exists? (resolve-shell candidates exists?))]
      (if found
        {:ok true :shell found :args ["-c"]}
        (if-let [bash (when find-bash (find-bash))]
          {:ok true :shell bash :args ["-c"]}
          {:ok false :error "No bash shell found on Windows" :code "ESHELL"})))

    :else
    (let [candidates (default-unix-shell-candidates)
          found (when exists? (resolve-shell candidates exists?))]
      (if found
        {:ok true :shell found :args ["-c"]}
        (if-let [bash (when find-bash (find-bash))]
          {:ok true :shell bash :args ["-c"]}
          {:ok true :shell "sh" :args ["-c"]})))))

(defn sanitize-binary-output
  "Remove control characters and Unicode format characters that break display."
  [s]
  (->> (js/Array.from (str s))
       (filter (fn [char]
                 (let [code (.codePointAt char 0)]
                   (or (= code 0x09) (= code 0x0a) (= code 0x0d)
                       (and (> code 0x1f) (not (<= 0xfff9 code 0xfffb)))))))
       (str/join "")))
