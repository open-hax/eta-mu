(ns eta-mu.terminal-ui.component.message
  "Render canonical agent-message content (user text, assistant text, tool
  calls, tool results) into wrapped terminal lines via `component.text`.

  Content is accepted as a plain string or a vector of `{:type :text :text
  ...}`-shaped content parts (non-text parts are dropped); this keeps the
  package decoupled from the turn-processor law schemas."
  (:require [clojure.string :as str]
            [eta-mu.terminal-ui.component.text :as text-c]
            [eta-mu.terminal-ui.shape.ansi :as ansi]))

(defn- content->text [content]
  (cond
    (string? content) content
    (sequential? content) (->> content
                               (filter #(= (:type %) :text))
                               (map :text)
                               (str/join ""))
    :else (str content)))

(defn render-lines
  "Wrap `text` at `width` with no padding, returning a vector of lines."
  [text width]
  ((:render (text-c/text text {:padding-x 0 :padding-y 0})) width))

(defn user-message
  "Render a user message with a `you` label."
  [content width]
  (render-lines (str (ansi/style [:bold :cyan] "you") " " (content->text content)) width))

(defn assistant-message
  "Render an assistant message with an `assistant` label."
  [content width]
  (render-lines (str (ansi/style [:bold :green] "assistant") " " (content->text content)) width))

(defn thinking
  "Render a dimmed thinking block."
  [content width]
  (render-lines (ansi/dim (str "thinking… " (content->text content))) width))

(defn tool-call
  "Render a tool invocation: name and arguments."
  [tool-name args width]
  (render-lines (str (ansi/style [:bold :yellow] (str "▶ " tool-name)) " " (pr-str args)) width))

(defn tool-result
  "Render a tool result: a success/error marker, the tool name, and its
  output content."
  [tool-name is-error content width]
  (let [status (if is-error (ansi/style [:bold :red] "✗") (ansi/style [:bold :green] "✓"))
        header (render-lines (str status " " (ansi/style [:bold] tool-name)) width)
        body (render-lines (content->text content) width)]
    (vec (concat header body))))
