(ns eta-mu.terminal-ui.domain.kill-ring
  "Ring buffer for Emacs-style kill/yank operations.")

(defn kill-ring
  "Create a new empty KillRing. Returns an atom-backed map."
  []
  (let [ring (atom [])]
    {:push (fn [text opts]
              (when-not (empty? text)
                (let [{:keys [prepend accumulate]} opts]
                  (if (and accumulate (pos? (count @ring)))
                    (let [last-entry (peek @ring)]
                      (swap! ring pop)
                      (swap! ring conj (if prepend (str text last-entry) (str last-entry text))))
                    (swap! ring conj text)))))
     :peek (fn [] (when (pos? (count @ring)) (peek @ring)))
     :rotate (fn []
               (when (> (count @ring) 1)
                 (let [last-entry (peek @ring)]
                   (swap! ring pop)
                   (swap! ring #(vec (cons last-entry %))))))
     :length (fn [] (count @ring))}))
