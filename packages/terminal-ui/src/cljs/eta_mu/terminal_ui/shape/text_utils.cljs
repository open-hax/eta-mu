(ns eta-mu.terminal-ui.shape.text-utils
  "ANSI-aware text utilities for terminal rendering.
  All functions are pure."
  (:require [clojure.string]
            ["get-east-asian-width" :as eaw]))

;; ---------------------------------------------------------------------------
;; Private helpers
;; ---------------------------------------------------------------------------

(declare new-ansi-tracker update-tracker-from-text)

(def ^:private segmenter
  (js/Intl.Segmenter. js/undefined #js {:granularity "grapheme"}))

(defn- segment-iter
  "Get a grapheme segment iterator for text."
  ^js [text]
  (js* "(~{})[Symbol.iterator]()" (.segment segmenter text)))

(def ^:private ^:const width-cache-size 512)
(def ^:private width-cache (js/Map.))

(defn- printable-ascii?
  ^boolean [^string s]
  (let [len (.-length s)]
    (loop [i 0]
      (if (>= i len) true
          (let [c (.charCodeAt s i)]
            (if (and (>= c 0x20) (<= c 0x7e))
              (recur (inc i)) false))))))

(def ^:private zero-width-re
  (js/RegExp. "^[\\p{Default_Ignorable_Code_Point}\\p{Control}\\p{Mark}\\p{Surrogate}]+$" "v"))
(def ^:private leading-non-printing-re
  (js/RegExp. "^[\\p{Default_Ignorable_Code_Point}\\p{Control}\\p{Format}\\p{Mark}\\p{Surrogate}]+" "v"))
(def ^:private rgi-emoji-re
  (js/RegExp. "^\\p{RGI_Emoji}$" "v"))

(defn- emoji-width
  ^number [^string segment]
  (let [cp (.codePointAt segment 0)]
    (or (and (>= cp 0x1f000) (<= cp 0x1fbff) 2)
        (and (>= cp 0x2300) (<= cp 0x23ff) 0)
        (and (>= cp 0x2600) (<= cp 0x27bf) 0)
        (and (>= cp 0x2b50) (<= cp 0x2b55) 0)
        (and (> (.-length segment) 2) 2)
        nil)))

(defn- grapheme-width
  ^number [^string segment]
  (cond
    (.test zero-width-re segment) 0
    (let [ew (emoji-width segment)]
      (and ew (.test rgi-emoji-re segment))) 2
    :else
    (let [base (.replace segment leading-non-printing-re "")
          cp (.codePointAt base 0)]
      (if (nil? cp) 0
          (let [cp (js/Number cp)]
            (if (and (>= cp 0x1f1e6) (<= cp 0x1f1ff))
              2
              (let [w (eaw/eastAsianWidth cp)]
                (if (> (.-length segment) 1)
                  (loop [i 1 total w]
                    (if (>= i (.-length segment)) total
                        (let [c (.codePointAt segment i)]
                          (if (and (>= c 0xff00) (<= c 0xffef))
                            (recur (inc i) (+ total (eaw/eastAsianWidth c)))
                            (recur (inc i) total)))))
                  w))))))))

(defn extract-ansi-code
  "Extract ANSI escape at pos. Returns nil or #js {:code :length}."
  [^string str pos]
  (when (and (< pos (.-length str)) (= (.charAt str pos) "\u001b"))
    (let [nc (.charAt str (inc pos))]
      (cond
        (= nc "[")
        (loop [j (+ pos 2)]
          (if (>= j (.-length str)) nil
              (if (re-find #"[mGKHJ]" (.charAt str j))
                #js {:code (.substring str pos (inc j)) :length (- (inc j) pos)}
                (recur (inc j)))))
        (= nc "]")
        (loop [j (+ pos 2)]
          (if (>= j (.-length str)) nil
              (cond
                (= (.charAt str j) "\u0007")
                #js {:code (.substring str pos (inc j)) :length (- (inc j) pos)}
                (and (= (.charAt str j) "\u001b") (= (.charAt str (inc j)) "\\"))
                #js {:code (.substring str pos (+ j 2)) :length (- (+ j 2) pos)}
                :else (recur (inc j)))))
        (= nc "_")
        (loop [j (+ pos 2)]
          (if (>= j (.-length str)) nil
              (cond
                (= (.charAt str j) "\u0007")
                #js {:code (.substring str pos (inc j)) :length (- (inc j) pos)}
                (and (= (.charAt str j) "\u001b") (= (.charAt str (inc j)) "\\"))
                #js {:code (.substring str pos (+ j 2)) :length (- (+ j 2) pos)}
                :else (recur (inc j)))))
        :else nil))))

(defn- strip-ansi [^string s]
  (loop [i 0 result ""]
    (if (>= i (.-length s)) result
        (if-let [ansi (extract-ansi-code s i)]
          (recur (+ i (.-length ansi)) result)
          (recur (inc i) (str result (.charAt s i)))))))

(defn- segment-width
  "Calculate visible width by iterating graphemes."
  ^number [^string clean]
  (loop [iter (segment-iter clean) total 0]
    (let [n (.next iter)]
      (if (.-done n) total
          (recur iter
                 (+ total (grapheme-width (.-segment (.-value n)))))))))

;; ---------------------------------------------------------------------------
;; Public API
;; ---------------------------------------------------------------------------

(defn visible-width
  "Calculate visible terminal column width. ANSI/tabs/graphemes handled."
  ^number [^string str]
  (cond
    (empty? str) 0
    (printable-ascii? str) (.-length str)
    :else
    (if-let [cached (.get width-cache str)]
      cached
      (let [clean (-> str
                      (cond-> (.includes str "\t")
                        (.replace (js/RegExp. "\t" "g") "   "))
                      (cond-> (.includes str "\u001b")
                        strip-ansi))
            width (segment-width clean)]
        (when (>= (.-size width-cache) width-cache-size)
          (let [fk (.next (.keys width-cache))]
            (when-not (.-done fk) (.delete width-cache (.-value fk)))))
        (.set width-cache str width)
        width))))

;; ---------------------------------------------------------------------------
;; Word wrapping
;; ---------------------------------------------------------------------------

(defn- tokenize-with-ansi
  "Split text into whitespace/non-whitespace tokens, keeping ANSI attached."
  [text]
  (loop [i 0 tokens (transient []) current "" pending "" in-ws? false]
    (if (>= i (.-length text))
      (persistent! (let [f (str current pending)]
                     (if (empty? f) tokens (conj! tokens f))))
      (if-let [ansi (extract-ansi-code text i)]
        (recur (+ i (.-length ansi)) tokens current (str pending (.-code ansi)) in-ws?)
        (let [ch (.charAt text i)
              ch-ws? (= ch " ")
              switching (and (not= ch-ws? in-ws?) (not= current ""))]
          (if switching
            (recur (inc i) (conj! tokens current) (str pending ch) "" ch-ws?)
            (recur (inc i) tokens (str current pending ch) "" ch-ws?)))))))

(defn- wrap-physical-line
  "Wrap a single physical line (no newlines) to width."
  [line width]
  (if (or (nil? line) (= line "")) [""]
      (if (<= (visible-width line) width) [line]
          (let [tokens (tokenize-with-ansi line)]
            (loop [toks tokens buf "" bw 0 out (transient [])]
              (if (empty? toks)
                (persistent! (if (empty? buf) out (conj! out buf)))
                (let [tok (first toks)
                      toks' (rest toks)
                      tw (visible-width tok)
                      ws? (= (.trim tok) "")
                      total (+ bw tw)]
                  (if (and (> total width) (> bw 0))
                    (recur toks'
                           (if ws? "" tok)
                           (if ws? 0 tw)
                           (conj! out (.trimEnd buf)))
                    (recur toks'
                           (str buf tok)
                           total
                           out)))))))))

(defn wrap-text-with-ansi
  "Word-wrap text preserving ANSI codes across line breaks.
  Returns vector of lines, each ≤ width visible columns."
  [text width]
  (if (or (nil? text) (= text "")) [""]
      (let [lines (.split text "\n")
            ^js tracker (new-ansi-tracker)
            result (array)]
        (loop [i 0]
          (if (>= i (.-length lines))
            (vec result)
            (let [line (aget lines i)
                  prefix (if (> (count result) 0) (.getActiveCodes tracker) "")
                  wrapped (wrap-physical-line (str prefix line) width)]
              (doseq [w wrapped] (.push result w))
              (update-tracker-from-text line tracker)
              (recur (inc i))))))))

;; ---------------------------------------------------------------------------
;; Truncation
;; ---------------------------------------------------------------------------

(defn- finalize-truncated
  [prefix pw ellipsis ew max-width pad?]
  (let [reset "\u001b[0m"
        vis (+ pw ew)
        r (if (> (.-length ellipsis) 0)
            (str prefix reset ellipsis reset)
            (str prefix reset))]
    (if pad? (str r (apply str (repeat (max 0 (- max-width vis)) " "))) r)))

(defn- truncate-simple
  "Truncate ASCII-only text."
  [text max-width ew ellipsis pad?]
  (if (<= (.-length text) max-width)
    (if pad? (str text (apply str (repeat (- max-width (.-length text)) " "))) text)
    (let [target (- max-width ew)]
      (finalize-truncated (.substring text 0 target) target ellipsis ew max-width pad?))))

(defn- truncate-grapheme
  "Truncate text with grapheme-aware logic."
  [text max-width ew ellipsis pad?]
  (let [target (- max-width ew)]
    (loop [i 0 result "" rw 0 visible 0 keep? true overflow? false]
      (if (>= i (.-length text))
        (if overflow?
          (finalize-truncated result rw ellipsis ew max-width pad?)
          (if pad? (str text (apply str (repeat (max 0 (- max-width visible)) " "))) text))
        (if-let [ansi (extract-ansi-code text i)]
          (recur (+ i (.-length ansi)) result rw visible keep? overflow?)
          (if (= (.charAt text i) "\t")
            (let [nv (+ visible 3)]
              (if (and keep? (<= (+ rw 3) target))
                (recur (inc i) (str result "\t") (+ rw 3) nv keep? overflow?)
                (recur (inc i) result rw nv false overflow?)))
            (let [text-end (loop [te (inc i)]
                             (if (or (>= te (.-length text))
                                     (extract-ansi-code text te))
                               te (recur (inc te))))
                   sr (loop [iter (segment-iter (.substring text i text-end))
                            r result rw2 rw]
                       (let [n (.next iter)]
                         (if (.-done n)
                           {:r r :rw rw2}
                           (let [seg (.-segment (.-value n))
                                 w (grapheme-width seg)
                                 nv (+ visible w)]
                             (if (> nv max-width)
                               {:r r :rw rw2 :overflowed true}
                               (if (and keep? (<= (+ rw2 w) target))
                                 (recur nil (str r seg) (+ rw2 w))
                                 (recur nil r rw2)))))))]
              (recur text-end (:r sr) (:rw sr)
                     (+ visible (- (:rw sr) rw))
                     keep?
                     (or overflow? (:overflowed sr))))))))))

(defn truncate-to-width
  "Truncate text to fit within maxWidth, adding ellipsis if needed."
  ([text max-width] (truncate-to-width text max-width "..." false))
  ([text max-width ellipsis] (truncate-to-width text max-width ellipsis false))
  ([text max-width ellipsis pad?]
   (if (<= max-width 0) ""
       (if (= text "")
         (if pad? (apply str (repeat max-width " ")) "")
         (let [ew (visible-width ellipsis)]
           (if (>= ew max-width)
             (if (<= (visible-width text) max-width)
               (if pad? (str text (apply str (repeat (- max-width (visible-width text)) " "))) text)
               "")
             (if (printable-ascii? text)
               (truncate-simple text max-width ew ellipsis pad?)
               (truncate-grapheme text max-width ew ellipsis pad?))))))))

;; ---------------------------------------------------------------------------
;; Column slicing
;; ---------------------------------------------------------------------------

(defn slice-with-width
  "Extract visible columns from a line. Returns {:text :width}."
  ([line start-col length] (slice-with-width line start-col length false))
  ([line start-col length strict?]
   (if (<= length 0) {:text "" :width 0}
       (let [end-col (+ start-col length)]
         (loop [i 0 cc 0 result "" rw 0 pa ""]
           (if (>= i (.-length line))
             {:text result :width rw}
             (if-let [ansi (extract-ansi-code line i)]
               (if (and (>= cc start-col) (< cc end-col))
                 (recur (+ i (.-length ansi)) cc (str result (.-code ansi)) rw pa)
                 (recur (+ i (.-length ansi)) cc result rw (str pa (.-code ansi))))
               (let [text-end (loop [te (inc i)]
                                (if (or (>= te (.-length line))
                                        (extract-ansi-code line te))
                                  te (recur (inc te))))]
                  (loop [iter (segment-iter (.substring line i text-end))
                        r result rw2 rw]
                   (let [n (.next iter)]
                     (if (.-done n)
                       {:text r :width rw2}
                       (let [seg (.-segment (.-value n))
                             w (grapheme-width seg)]
                         (if (>= cc end-col)
                           {:text r :width rw2}
                           (if (and (>= cc start-col) (< cc end-col))
                             (if (and strict? (> (+ cc w) end-col))
                               {:text r :width rw2}
                               (let [nr (if (empty? pa) (str r seg) (str r pa seg))]
                                 (recur nil nr (+ rw2 w))))
                              (recur nil r rw2)))))))))))))))

(defn slice-by-column
  "Extract visible columns from a line."
  ([line start-col length] (slice-by-column line start-col length false))
  ([line start-col length strict?]
   (:text (slice-with-width line start-col length strict?))))

;; ---------------------------------------------------------------------------
;; Background application
;; ---------------------------------------------------------------------------

(defn apply-background-to-line
  "Apply bg-fn to line, padding to width."
  [line width bg-fn]
  (let [vis (visible-width line)
        padding (apply str (repeat (max 0 (- width vis)) " "))]
    (bg-fn (str line padding))))

;; ---------------------------------------------------------------------------
;; Character classification
;; ---------------------------------------------------------------------------

(defn is-whitespace-char?
  ^boolean [^string char]
  (boolean (re-find #"\s" char)))

(defn is-punctuation-char?
  ^boolean [^string char]
  (let [c (.charCodeAt char 0)]
    (or (== c 0x28) (== c 0x29) (== c 0x5B) (== c 0x5D) (== c 0x7B) (== c 0x7D)
        (== c 0x3C) (== c 0x3E) (== c 0x2C) (== c 0x2E) (== c 0x3B) (== c 0x3A)
        (== c 0x27) (== c 0x22) (== c 0x21) (== c 0x3F) (== c 0x2B) (== c 0x2D)
        (== c 0x2A) (== c 0x2F) (== c 0x5C) (== c 0x7C) (== c 0x26) (== c 0x25)
        (== c 0x5E) (== c 0x24) (== c 0x23) (== c 0x40) (== c 0x7E) (== c 0x60))))

;; ---------------------------------------------------------------------------
;; AnsiCodeTracker + overlay extraction
;; ---------------------------------------------------------------------------

(defn- new-ansi-tracker []
  (let [state (atom {:bold false :dim false :italic false :underline false
                     :blink false :inverse false :hidden false :strikethrough false
                     :fg nil :bg nil :hyperlink nil})]
    (reify Object
      (getActiveCodes [_]
        (let [{:keys [bold dim italic underline blink inverse hidden strikethrough
                      fg bg hyperlink]} @state
              codes (cond-> []
                bold (conj "1") dim (conj "2") italic (conj "3")
                underline (conj "4") blink (conj "5") inverse (conj "7")
                hidden (conj "8") strikethrough (conj "9")
                fg (conj fg) bg (conj bg))
              base (if (seq codes) (str "\u001b[" (clojure.string/join ";" codes) "m") "")]
          (if hyperlink (str base "\u001b]8;;" hyperlink "\u001b\\") base)))
      (getLineEndReset [_]
        (let [{:keys [underline hyperlink]} @state]
          (str (when underline "\u001b[24m")
               (when hyperlink "\u001b]8;;\\"))))
      (process [_ ansi-code]
        (cond
          (.startsWith ansi-code "\u001b]8;")
          (let [m (.match ansi-code #"\u001b\]8;[^;]*;([^\u001b\u0007]*)")]
            (swap! state assoc :hyperlink (when m (aget m 1))))
          (.endsWith ansi-code "m")
          (when-let [match (.match ansi-code #"\u001b\[([\d;]*)m")]
            (let [params (aget match 1)]
              (if (or (= params "") (= params "0"))
                (swap! state assoc :bold false :dim false :italic false :underline false
                       :blink false :inverse false :hidden false :strikethrough false
                       :fg nil :bg nil)
                (let [parts (.split params ";")]
                  (loop [i 0 s @state]
                    (when (< i (count parts))
                      (let [code (js/parseInt (aget parts i) 10)
                            s' (cond
                                 (or (= code 38) (= code 48))
                                 (cond
                                   (and (= (aget parts (inc i)) "5") (aget parts (+ i 2)))
                                   (let [cc (str code ";" (aget parts (inc i)) ";" (aget parts (+ i 2)))]
                                     (if (= code 38) (assoc s :fg cc) (assoc s :bg cc)))
                                   (and (= (aget parts (inc i)) "2") (aget parts (+ i 4)))
                                   (let [cc (str code ";2;" (aget parts (+ i 2)) ";"
                                                  (aget parts (+ i 3)) ";" (aget parts (+ i 4)))]
                                     (if (= code 38) (assoc s :fg cc) (assoc s :bg cc)))
                                   :else s)
                                 (= code 0)  (assoc s :bold false :dim false :italic false :underline false
                                                        :blink false :inverse false :hidden false :strikethrough false
                                                        :fg nil :bg nil)
                                 (= code 1)  (assoc s :bold true)
                                 (= code 2)  (assoc s :dim true)
                                 (= code 3)  (assoc s :italic true)
                                 (= code 4)  (assoc s :underline true)
                                 (= code 5)  (assoc s :blink true)
                                 (= code 7)  (assoc s :inverse true)
                                 (= code 8)  (assoc s :hidden true)
                                 (= code 9)  (assoc s :strikethrough true)
                                 (= code 22) (assoc s :bold false :dim false)
                                 (= code 23) (assoc s :italic false)
                                 (= code 24) (assoc s :underline false)
                                 (= code 25) (assoc s :blink false)
                                 (= code 27) (assoc s :inverse false)
                                 (= code 28) (assoc s :hidden false)
                                 (= code 29) (assoc s :strikethrough false)
                                 (= code 39) (assoc s :fg nil)
                                  (= code 49) (assoc s :bg nil)
                                  (<= 30 code 37)  (assoc s :fg (str code))
                                  (<= 90 code 97)  (assoc s :fg (str code))
                                  (<= 40 code 47)  (assoc s :bg (str code))
                                  (<= 100 code 107) (assoc s :bg (str code))
                                 :else s)]
                        (recur (inc i) s'))))))))
          :else nil))
      (clear [_]
        (reset! state {:bold false :dim false :italic false :underline false
                       :blink false :inverse false :hidden false :strikethrough false
                       :fg nil :bg nil :hyperlink nil})))))

(defn- update-tracker-from-text [text tracker]
  (loop [i 0]
    (when (< i (.-length text))
      (if-let [ansi (extract-ansi-code text i)]
        (do (.process tracker (.-code ansi))
            (recur (+ i (.-length ansi))))
        (recur (inc i))))))

(defn extract-segments
  "Extract before/after segments for overlay compositing."
  [line before-end after-start after-len]
  (let [after-end (+ after-start after-len)
        tracker (new-ansi-tracker)]
    (loop [i 0 cc 0
           before "" bw 0
           after "" aw 0
           pa "" started? false]
      (if (>= i (.-length line))
        {:before before :before-width bw :after after :after-width aw}
        (if-let [ansi (extract-ansi-code line i)]
          (do (.process tracker (.-code ansi))
              (if (< cc before-end)
                (recur (+ i (.-length ansi)) cc before bw after aw
                       (str pa (.-code ansi)) started?)
                (if (and (>= cc after-start) (< cc after-end) started?)
                  (recur (+ i (.-length ansi)) cc before bw
                         (str after (.-code ansi)) aw pa started?)
                  (recur (+ i (.-length ansi)) cc before bw after aw pa started?))))
          (let [text-end (loop [te (inc i)]
                           (if (or (>= te (.-length line))
                                   (extract-ansi-code line te))
                             te (recur (inc te))))
                 sr (loop [iter (segment-iter (.substring line i text-end))
                          b before bw2 bw a after aw2 aw pa-inner pa started?-inner started?]
                     (let [n (.next iter)]
                       (if (.-done n)
                         {:b b :bw bw2 :a a :aw aw2 :pa pa-inner :started? started?-inner}
                         (let [seg (.-segment (.-value n))
                               w (grapheme-width seg)]
                           (cond
                             (< cc before-end)
                             (let [nb (if (empty? pa-inner) (str b seg) (str b pa-inner seg))]
                                (recur nil nb (+ bw2 w) a aw2 "" started?-inner))
                             (and (>= cc after-start) (< cc after-end))
                             (let [ns? (or started?-inner true)
                                   na (if-not started?-inner
                                        (str (.getActiveCodes tracker) seg)
                                        (str a pa-inner seg))]
                                (recur nil b bw2 na (+ aw2 w) "" ns?))
                             :else
                             (recur nil b bw2 a aw2 pa-inner started?-inner))))))]
            (recur text-end (+ cc (:bw sr))
                   (:b sr) (:bw sr)
                   (:a sr) (:aw sr)
                   (:pa sr) (:started? sr))))))))
