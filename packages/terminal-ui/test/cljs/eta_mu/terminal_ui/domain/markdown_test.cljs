(ns eta-mu.terminal-ui.domain.markdown-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.domain.markdown :as md]
            [eta-mu.terminal-ui.shape.ansi :as ansi]))

(deftest header-test
  (testing "headers render bold-cyan and inline styles still apply"
    (is (= [(ansi/style [:bold :cyan] "# Title")] (md/markdown-lines "# Title")))
    (is (= [(ansi/style [:bold :cyan] (str "### " "with " (ansi/bold "bold")))]
           (md/markdown-lines "### with **bold**")))))

(deftest bold-italic-test
  (testing "bold and italic inline styling"
    (is (= [(str "a " (ansi/bold "bold") " b")] (md/markdown-lines "a **bold** b")))
    (is (= [(str "a " (ansi/bold "bold") " b")] (md/markdown-lines "a __bold__ b")))
    (is (= [(str "a " (ansi/dim "ital") " b")] (md/markdown-lines "a *ital* b")))
    (is (= [(str "a " (ansi/dim "ital") " b")] (md/markdown-lines "a _ital_ b")))))

(deftest inline-code-test
  (testing "inline code renders yellow and its contents are protected from bold/italic"
    (is (= [(str "run " (ansi/fg :yellow "npm test") " now")]
           (md/markdown-lines "run `npm test` now")))
    (is (= [(str (ansi/fg :yellow "**not-bold**") " done")]
           (md/markdown-lines "`**not-bold**` done")))))

(deftest bullet-list-test
  (testing "bullet and numbered list markers render cyan, bodies keep inline styles"
    (is (= [(str (ansi/fg :cyan "-") " item one")
            (str (ansi/fg :cyan "1.") " item " (ansi/bold "two"))]
           (md/markdown-lines "- item one\n1. item **two**")))))

(deftest blockquote-test
  (testing "blockquotes render dimmed with a bar"
    (is (= [(ansi/dim "│ quoted")] (md/markdown-lines "> quoted")))))

(deftest fenced-code-block-test
  (testing "fences render a border and code lines render gray, content unstylized"
    (is (= [(ansi/fg :gray "╌╌╌")
            (ansi/fg :gray "│ **raw** `code`")
            (ansi/fg :gray "╌╌╌")]
           (md/markdown-lines "```\n**raw** `code`\n```")))))

(deftest nested-combined-test
  (testing "a combined document: header, prose with inline code, list, quote, fence"
    (let [input "# Report\nResults with `x=1` below.\n- first **item**\n> a note\n```\nraw *text*\n```"
          lines (md/markdown-lines input)]
      (is (= 7 (count lines)))
      (is (= (ansi/style [:bold :cyan] "# Report") (nth lines 0)))
      (is (= (str "Results with " (ansi/fg :yellow "x=1") " below.") (nth lines 1)))
      (is (= (str (ansi/fg :cyan "-") " first " (ansi/bold "item")) (nth lines 2)))
      (is (= (ansi/dim "│ a note") (nth lines 3)))
      (is (= (ansi/fg :gray "╌╌╌") (nth lines 4)))
      (is (= (ansi/fg :gray "│ raw *text*") (nth lines 5))))))

(deftest plain-text-passthrough-test
  (testing "plain lines pass through with inline styling only"
    (is (= ["just text"] (md/markdown-lines "just text")))
    (is (= [""] (md/markdown-lines "")))))
