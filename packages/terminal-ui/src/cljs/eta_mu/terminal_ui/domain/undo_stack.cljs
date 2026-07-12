(ns eta-mu.terminal-ui.domain.undo-stack
  "Generic undo stack with clone-on-push semantics.")

(defn undo-stack
  "Create a new empty UndoStack. Returns an atom-backed map."
  []
  (let [stack (atom [])]
    {     :push (fn [state]
              (swap! stack conj state))
     :pop (fn []
            (when (pos? (count @stack))
              (let [top (peek @stack)]
                (swap! stack pop)
                top)))
     :clear (fn [] (reset! stack []))
     :length (fn [] (count @stack))}))
