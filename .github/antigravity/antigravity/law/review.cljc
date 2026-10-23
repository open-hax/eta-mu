;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.law.review
  "Portable admission for bounded advisory CLI reviews. No publication authority."
  (:require [clojure.string :as str]))

(def model "gemini-3.8-flash-high")
(def cli-version "1.4.6")
(def schema "open-hax.antigravity-review/v1")
(def limits {:files 256 :file-bytes 262144 :diff-bytes 1048576
             :input-bytes 4194304 :prompt-bytes 65536 :response-bytes 2097152})

(defn text? [x] (and (string? x) (not (str/blank? x))))
(defn commit? [x] (and (string? x) (boolean (re-matches #"(?:[0-9a-f]{40}|[0-9a-f]{64})" x))))
(defn digest? [x] (and (string? x) (boolean (re-matches #"[0-9a-f]{64}" x))))
(defn path? [x]
  (and (text? x) (not (str/starts-with? x "/"))
       (not (str/includes? x "\\")) (not (re-find #"[\x00-\x1f\x7f]" x))
       (every? #(not (contains? #{"" "." ".." ".git"} %)) (str/split x #"/"))))

(defn input-errors [{:keys [base head paths files diff_digest diff-bytes input-bytes prompt-bytes]}]
  (cond-> []
    (not (and (commit? base) (commit? head) (not= base head))) (conj :revisions)
    (not (digest? diff_digest)) (conj :diff-digest)
    (not (and (vector? paths) (seq paths) (every? path? paths)
              (= (count paths) (count (distinct paths)))
              (<= (count paths) (:files limits)))) (conj :paths)
    (not (and (vector? files) (= paths (mapv :path files))
              (every? (fn [{:keys [base-mode head-mode base-bytes head-bytes binary?]}]
                        (and (contains? #{"000000" "100644" "100755"} base-mode)
                             (contains? #{"000000" "100644" "100755"} head-mode)
                             (false? binary?)
                             (every? #(and (integer? %) (<= 0 % (:file-bytes limits)))
                                     [base-bytes head-bytes]))) files))) (conj :files)
    (not (and (integer? diff-bytes) (<= 1 diff-bytes (:diff-bytes limits)))) (conj :diff-size)
    (not (and (integer? input-bytes) (<= 1 input-bytes (:input-bytes limits)))) (conj :input-size)
    (not (and (integer? prompt-bytes) (<= 1 prompt-bytes (:prompt-bytes limits)))) (conj :prompt-size)))

(def finding-keys #{:path :line :title :body :confidence :evidence :failure_trace})
(def result-keys #{:schema :status :diff_digest :base :head :model :scope_complete :reviewed_paths :summary :findings :questions})
(defn finding? [changed-lines finding]
  (and (map? finding) (= finding-keys (set (keys finding)))
       (path? (:path finding)) (integer? (:line finding))
       (contains? (get changed-lines (:path finding) #{}) (:line finding))
       (every? text? ((juxt :title :body) finding))
       (number? (:confidence finding)) (<= 0.85 (:confidence finding) 1)
       (every? #(and (vector? %) (seq %) (every? text? %))
               ((juxt :evidence :failure_trace) finding))))

(defn result-errors [input changed-lines result]
  (let [findings (:findings result) paths (:reviewed_paths result)]
    (cond-> []
      (not (and (map? result) (= result-keys (set (keys result)))
                (= schema (:schema result)))) (conj :schema)
      (not= [(:base input) (:head input) model] ((juxt :base :head :model) result)) (conj :binding)
      (not (and (digest? (:diff_digest result)) (= (:diff_digest input) (:diff_digest result)))) (conj :diff-digest)
      (not= (if (empty? findings) "clean" "findings") (:status result)) (conj :status)
      (not (and (true? (:scope_complete result)) (vector? paths)
                (= (count paths) (count (distinct paths)))
                (= (set (:paths input)) (set paths)))) (conj :scope)
      (not (text? (:summary result))) (conj :summary)
      (not (and (vector? findings) (<= (count findings) 100)
                (every? #(finding? changed-lines %) findings)
                (= (count findings) (count (distinct (map (juxt :path :line :title) findings)))))) (conj :findings)
      (not (and (vector? (:questions result)) (<= (count (:questions result)) 100)
                (every? text? (:questions result)))) (conj :questions))))

(defn envelope-errors [expected events]
  (let [initial (filter #(= "init" (:event %)) events)
        results (filter #(= "result" (:event %)) events)
        init (:init (first initial))
        result (:result (first results))]
    (cond-> []
      (not (and (= 1 (count initial)) (= "init" (:event (first events)))
                (= (:cwd expected) (:cwd init)) (= model (:model init))
                (= "antigravity-reviewer" (:agent init)) (= "plan" (:permission_mode init))
                (= [] (:tools init)))) (conj :native-init)
      (not (and (= 1 (count results)) (= "result" (:event (last events)))
                (text? (:conversation_id (first initial)))
                (= (:conversation_id (first initial)) (:conversation_id result))
                (= "SUCCESS" (:status result)) (map? (:structured_output result)))) (conj :native-result)
      (not (every? (fn [event]
                     (or (contains? #{"init" "result"} (:event event))
                         (let [step (:step_update event)]
                           (and (= "step_update" (:event event))
                                (map? step)
                                (every? #{:conversation_id :step_index :state :step_type :text_delta :duration_seconds :usage} (keys step))
                                (= (:conversation_id (first initial)) (:conversation_id step))
                                (integer? (:step_index step)) (<= 0 (:step_index step))
                                (contains? #{"ACTIVE" "DONE"} (:state step))
                                (contains? #{"user_input" "agent_response"} (:step_type step)))))) events))
      (conj :native-effects))))

(defn native-json-errors
  "Native JSON has no tool-event trace. Strict-profile custody is an independent prerequisite."
  [expected-schema native]
  (cond-> []
    (not (and (map? native) (text? (:conversation_id native)) (= "SUCCESS" (:status native))
              (map? (:structured_output native))
              (integer? (:num_turns native)) (<= 1 (:num_turns native) 32)
              (number? (:duration_seconds native)) (<= 0 (:duration_seconds native))
              (every? #{:conversation_id :status :response :duration_seconds :num_turns
                        :structured_output :json_schema :usage} (keys native))))
    (conj :native-result)
    (not= expected-schema (:json_schema native)) (conj :native-schema)))
