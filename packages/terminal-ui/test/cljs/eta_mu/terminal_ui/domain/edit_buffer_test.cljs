(ns eta-mu.terminal-ui.domain.edit-buffer-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.terminal-ui.domain.edit-buffer :as eb]))

(deftest insert-and-delete-test
  (testing "insert at cursor, backspace, delete-forward"
    (let [b (eb/buffer)]
      (is (= {:text "hello" :cursor 5} (-> b (eb/insert "hello"))))
      (is (= {:text "helo" :cursor 2}
             (-> (eb/buffer "hello") (eb/move-char -2) (eb/delete-back))))
      (is (= {:text "helo" :cursor 3}
             (-> (eb/buffer "hello") (eb/move-char -2) (eb/delete-forward))))
      (is (= (eb/buffer "") (eb/delete-back (eb/buffer)))
          "backspace at 0 is a no-op")
      (is (= (eb/buffer "ab") (eb/delete-forward (eb/buffer "ab")))
          "delete-forward at end is a no-op"))))

(deftest char-movement-is-clamped-test
  (testing "cursor never leaves the text"
    (is (= 0 (:cursor (eb/move-char (eb/buffer "ab") -10))))
    (is (= 2 (:cursor (eb/move-char (eb/buffer "ab") 10))))))

(deftest word-movement-test
  (testing "word-jump forward lands at the end of the next word, backward at the start of the previous"
    (let [b (eb/buffer "foo bar  baz")]
      (is (= 3 (:cursor (eb/move-word (assoc b :cursor 0) 1))))
      (is (= 7 (:cursor (eb/move-word (assoc b :cursor 3) 1))))
      (is (= 12 (:cursor (eb/move-word (assoc b :cursor 7) 1))))
      (is (= 12 (:cursor (eb/move-word (assoc b :cursor 12) 1)))
          "forward at end is stable")
      (is (= 9 (:cursor (eb/move-word (assoc b :cursor 12) -1))))
      (is (= 4 (:cursor (eb/move-word (assoc b :cursor 9) -1))))
      (is (= 0 (:cursor (eb/move-word (assoc b :cursor 4) -1))))
      (is (= 0 (:cursor (eb/move-word (assoc b :cursor 0) -1)))
          "backward at start is stable"))))

(deftest home-end-test
  (testing "home/end address the current line, not the whole buffer"
    (let [b (eb/buffer "one\ntwo three\nfour")]
      (is (= 4 (:cursor (eb/move-home (assoc b :cursor 9)))))
      (is (= 13 (:cursor (eb/move-end (assoc b :cursor 9)))))
      (is (= 0 (:cursor (eb/move-home (assoc b :cursor 0)))))
      (is (= 18 (:cursor (eb/move-end (assoc b :cursor 18))))))))

(deftest multi-line-cursor-test
  (testing "cursor-line-col is derived from embedded newlines"
    (let [b (eb/buffer "ab\ncde\nf")]
      (is (= [0 0] (eb/cursor-line-col (assoc b :cursor 0))))
      (is (= [0 2] (eb/cursor-line-col (assoc b :cursor 2))))
      (is (= [1 0] (eb/cursor-line-col (assoc b :cursor 3))))
      (is (= [1 3] (eb/cursor-line-col (assoc b :cursor 6))))
      (is (= [2 1] (eb/cursor-line-col (assoc b :cursor 8))))
      (is (= 3 (eb/line-count b))))))

(deftest line-movement-test
  (testing "up/down preserves the goal column where possible and clamps to short lines"
    (let [b (eb/buffer "ab\ncde\nf")]
      (is (= [1 2] (eb/cursor-line-col (eb/move-line (assoc b :cursor 2) 1))))
      (is (= [2 1] (eb/cursor-line-col (eb/move-line (assoc b :cursor 6) 1)))
          "column 3 clamps to the short line's end")
      (is (= [0 1] (eb/cursor-line-col (eb/move-line (assoc b :cursor 8) -2))))
      (is (= [0 0] (eb/cursor-line-col (eb/move-line (assoc b :cursor 0) -1)))
          "up on the first line is a no-op")
      (is (= [2 1] (eb/cursor-line-col (eb/move-line (assoc b :cursor 8) 5)))
          "down past the last line clamps"))))

(deftest multi-line-composition-test
  (testing "a buffer with embedded newlines edits and addresses correctly"
    (let [b (-> (eb/buffer)
                (eb/insert "first line")
                (eb/insert "\n")
                (eb/insert "second"))]
      (is (= "first line\nsecond" (:text b)))
      (is (= [1 6] (eb/cursor-line-col b)))
      (is (= {:text "first line\nsecon" :cursor 16} (eb/delete-back b)))
      (is (= [1 0] (eb/cursor-line-col (-> b (eb/move-line -1) (eb/move-char 5))))))))

(deftest history-recall-test
  (testing "prev walks older entries, next restores the in-progress stash"
    (let [h (-> (eb/history)
                (eb/history-push "first")
                (eb/history-push "second"))
          [h1 t1] (eb/history-prev h "wip")
          [h2 t2] (eb/history-prev h1 t1)
          [h3 t3] (eb/history-prev h2 t2)
          [h4 t4] (eb/history-next h3 t3)
          [h5 t5] (eb/history-next h4 t4)]
      (is (= "second" t1))
      (is (= "first" t2))
      (is (= "first" t3) "prev at the oldest entry stays put")
      (is (= "second" t4))
      (is (= "wip" t5) "next past the newest entry restores the stash")
      (is (nil? (:index h5))))))

(deftest history-ignores-blank-test
  (testing "blank submissions are not recorded"
    (is (= [] (:entries (eb/history-push (eb/history) "   "))))
    (is (= [] (:entries (eb/history-push (eb/history) ""))))))

(deftest submit-test
  (testing "submit returns the text and a fresh buffer"
    (is (= ["hello" {:text "" :cursor 0}] (eb/submit (eb/buffer "hello"))))))
