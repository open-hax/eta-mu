(ns eta-mu.terminal-ui.shape.ansi
  "Minimal ANSI SGR color/style helpers for terminal rendering.

  Pure string functions; no terminal I/O. Unknown style keywords are dropped
  rather than throwing, so callers can compose freely."
  (:require [clojure.string :as str]))

(def ^:private code
  {:reset 0 :bold 1 :dim 2
   :black 30 :red 31 :green 32 :yellow 33 :blue 34 :magenta 35 :cyan 36 :white 37
   :gray 90})

(defn style
  "Wrap `text` in the ANSI SGR codes named by `styles` (a keyword or a
  sequence of keywords). Returns `text` unchanged if none of the styles are
  recognized."
  [styles text]
  (let [styles (if (sequential? styles) styles [styles])
        codes (keep code styles)]
    (if (seq codes)
      (str "[" (str/join ";" codes) "m" text "[0m")
      text)))

(defn fg
  "Wrap `text` in a single foreground color."
  [color text]
  (style [color] text))

(defn bold
  "Wrap `text` in the bold SGR code."
  [text]
  (style [:bold] text))

(defn dim
  "Wrap `text` in the dim SGR code."
  [text]
  (style [:dim] text))
