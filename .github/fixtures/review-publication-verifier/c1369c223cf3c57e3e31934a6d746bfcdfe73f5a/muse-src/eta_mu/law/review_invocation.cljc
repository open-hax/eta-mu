(ns eta-mu.law.review-invocation
  "Pure closure of one complete HOST tool trace. This is not all INPUT49,
   authentication, or authority to invoke a model. GPL-3.0-or-later."
  (:require [clojure.string :as str]))

(def stages ["deterministic" "map-change" "generate-candidates"
             "adversarial-validate" "publish"])

(def review-tools #{"review_begin" "review_read_diff_chunk"
                    "review_assess_diff_chunk" "review_record_evidence"
                    "review_propose_finding" "review_classify_finding"
                    "review_status" "review_submit"})

(def host-tools
  "Known generic host tools. Additional names require actual staged registry
   membership; nested tool output remains data, never a control stream."
  #{"bash" "read" "glob" "grep" "list" "edit" "write" "patch" "apply_patch"
    "todowrite" "todoread" "webfetch" "websearch" "task" "skill"})

(defn- nonblank? [x] (and (string? x) (not (str/blank? x))))
(defn- natural? [x] (and (integer? x) (<= 0 x 9007199254740991)))
(defn- positive? [x] (and (natural? x) (pos? x)))
(defn- sha? [n x] (and (string? x) (boolean (re-matches (re-pattern (str "[0-9a-f]{" n "}")) x))))
(defn- oid? [x] (or (sha? 40 x) (sha? 64 x)))
(defn- success? [call] (true? (get-in call [:part :state :output :ok?])))
(defn- tool [call] (get-in call [:part :tool]))
(defn- input [call] (get-in call [:part :state :input]))
(defn- output [call] (get-in call [:part :state :output]))

(defn context-valid?
  "Validate caller-bound, canonically prepared geometry; this is not native
   source authority. Preserve the existing manifest's SHA40-or-SHA64 grammar."
  [{:keys [input-source pages page-count full-input-sha256 review-tools submission-file]}]
  (let [p (:provenance input-source) d (:full_diff input-source)]
    (and (map? input-source) (= "open-hax.review-input/v1" (:schema input-source))
         (every? #(oid? (get input-source %)) [:base_sha :head_sha :diff_base_sha])
         (map? d) (= "basehead.diff" (:path d)) (natural? (:bytes d)) (sha? 64 (:sha256 d))
         (map? p) (every? #(nonblank? (get p %))
                         [:repository :pull_request :run_id :run_attempt :workflow_ref])
         (oid? (:workflow_sha p))
         (vector? pages)
         (= (count pages) page-count) (= (:sha256 d) full-input-sha256)
         (loop [remaining pages id 1 start 0]
           (if-let [page (first remaining)]
             (and (map? page) (= id (:id page)) (= start (:start page))
                  (natural? (:start page)) (positive? (:end page)) (< start (:end page))
                  (recur (next remaining) (inc id) (:end page)))
             true))
         (vector? review-tools) (every? nonblank? review-tools)
         (= (count review-tools) (count (set review-tools)))
         (every? (set review-tools) eta-mu.law.review-invocation/review-tools)
         (nonblank? submission-file))))

(defn- event-error [events expected-session]
  (let [sessions (set (map :session-id events))
        calls (filter #(= "tool_use" (:type %)) events)
        call-ids (map #(get-in % [:part :call-id]) calls)
        part-ids (map #(get-in % [:part :id]) calls)]
    (cond
      (not (and (vector? events) (seq events))) :missing-host-events
      (some #(not (and (map? %) (#{"step_start" "step_finish" "text" "tool_use"} (:type %))
                        (natural? (:timestamp %)) (nonblank? (:session-id %))
                        (map? (:part %)) (nonblank? (get-in % [:part :id]))
                        (= (:session-id %) (get-in % [:part :session-id]))
                        (= ({"step_start" "step-start" "step_finish" "step-finish"
                             "text" "text" "tool_use" "tool"} (:type %))
                           (get-in % [:part :type])))) events) :host-event-schema
      (not (apply <= (map :timestamp events))) :host-event-time-order
      (not= 1 (count sessions)) :host-session-binding
      (and expected-session (not= sessions #{expected-session})) :expected-session-binding
      (or (not (every? nonblank? call-ids)) (not= (count call-ids) (count (set call-ids)))
          (not= (count part-ids) (count (set part-ids)))) :host-call-cardinality
      (some #(not (and (= "tool" (get-in % [:part :type]))
                        (nonblank? (tool %)) (= "completed" (get-in % [:part :state :status]))
                        (map? (input %)) (not (get-in % [:part :state :error])))) calls) :host-tool-schema
      (not (and (= "step_finish" (:type (last events)))
                (= "stop" (get-in (last events) [:part :reason])))) :unterminated-host-trace
      :else nil)))

(defn- call-error [calls {:keys [pages review-tools]}]
  (let [page-by-id (into {} (map (juxt :id identity) pages))]
    (some
     (fn [call]
       (let [name (tool call) args (input call) result (output call) id (:id args)
             page (get page-by-id id)]
         (cond
           (= "invalid" name) :unavailable-host-tool
           (and (str/starts-with? name "review_") (not (contains? (set review-tools) name))) :unexposed-review-tool
           (and (str/starts-with? name "review_") (not (contains? eta-mu.law.review-invocation/review-tools name))) :unknown-review-tool
           (and (not (str/starts-with? name "review_"))
                (not (or (contains? host-tools name) (contains? (set review-tools) name)))) :unknown-host-tool
           (not (str/starts-with? name "review_")) (when-not (string? result) :host-tool-output)
           (not (and (map? result) (or (true? (:ok? result)) (false? (:ok? result))))) :review-tool-output
           (and (false? (:ok? result)) (not (nonblank? (:error result)))) :review-tool-output
           (and (#{"review_read_diff_chunk" "review_assess_diff_chunk"} name)
                (not (and (positive? id) page))) :page-id-binding
           (and (= "review_assess_diff_chunk" name) (not (nonblank? (:note args)))) :assessment-note-shape
           (and (= "review_record_evidence" name)
                (not (and ((set stages) (:stage args)) (nonblank? (:note args))))) :stage-input-shape
           (and (= "review_submit" name) (not (nonblank? (:summary args)))) :submission-call-shape
           (and (= "review_read_diff_chunk" name) (success? call)
                (not (and (map? (:chunk result))
                          (= (select-keys page [:id :start :end]) (select-keys (:chunk result) [:id :start :end]))
                          (string? (get-in result [:chunk :text]))
                          (= (- (:end page) (:start page)) (count (get-in result [:chunk :text])))))) :returned-page-binding
           (and (= "review_assess_diff_chunk" name) (success? call)
                (not (and (= id (:chunk-id result))
                          (map? (:coverage result)) (= (count pages) (get-in result [:coverage :chunks]))
                          (every? #(and (natural? %) (<= % (count pages)))
                                  [(get-in result [:coverage :delivered]) (get-in result [:coverage :assessed])])
                          (vector? (get-in result [:coverage :missing]))
                          (every? page-by-id (get-in result [:coverage :missing]))))) :returned-assessment-binding
           :else nil)))
     calls)))

(defn last-read-violations
  "Original LAST predicate over ALL calls, including failed read/assessment
   calls and calls around resets. Never partition by host session or keep only
   the final assessment. Positions are complete host event positions."
  [calls]
  (let [last-read (into {} (for [c calls :when (= "review_read_diff_chunk" (tool c))]
                            [(:id (input c)) (:position c)]))]
    (vec (for [c calls :when (= "review_assess_diff_chunk" (tool c))
               :let [r (get last-read (:id (input c)))]
               :when (not (and r (< r (:position c))))]
           {:id (:id (input c)) :assessment-position (:position c)
            :last-read-position r}))))

(defn- witnessed-stale? [calls violations]
  (some (fn [{:keys [id assessment-position last-read-position]}]
          (and last-read-position (> last-read-position assessment-position)
               (some #(and (= assessment-position (:position %)) (success? %)) calls)
               (some #(and (= "review_read_diff_chunk" (tool %)) (success? %)
                           (= id (:id (input %))) (> (:position %) assessment-position)) calls)
               (some #(and (= "review_read_diff_chunk" (tool %)) (success? %)
                           (= id (:id (input %))) (< (:position %) assessment-position)) calls)))
        violations))

(defn- begin-admitted? [calls review-calls begins]
  (let [successful (filterv success? begins) first-begin (first successful)]
    (and (= 1 (count successful)) (= first-begin (first review-calls))
         (every? (fn [c]
                   (or (= c first-begin)
                       (and (false? (:ok? (output c))) (true? (:restart-required? (output c)))
                            (> (:position c) (:position first-begin))
                            (let [prior (filterv #(< (:position %) (:position c)) calls)]
                              (witnessed-stale? prior (last-read-violations prior))))))
                 begins))))

(defn- serialized-error [submission context calls]
  (when submission
    (let [pages (:pages context) notes (into {} (for [c calls :when (and (= "review_assess_diff_chunk" (tool c)) (success? c))]
                                                [(:id (input c)) (:note (input c))]))
          assessments (:input-assessments submission)]
      (cond
        (not (and (map? submission) (= "open-hax.github-review/v1" (:schema submission))
                  (#{"APPROVE" "COMMENT" "REQUEST_CHANGES"} (:event submission))
                  (nonblank? (:summary submission)) (vector? (:comments submission)))) :serialized-submission-schema
        (not= (:input-source context) (:input-source submission)) :serialized-source-binding
        (not (and (vector? assessments)
                  (= (mapv #(select-keys % [:id :start :end]) pages)
                     (mapv #(select-keys % [:id :start :end]) assessments))
                  (every? #(and (nonblank? (:note %)) (= (get notes (:id %)) (:note %))) assessments)
                  (= {:chunks (count pages) :delivered (count pages) :assessed (count pages) :missing []}
                     (:input-coverage submission)))) :serialized-assessment-binding
        :else nil))))

(defn- submit-bound? [submission context submits]
  (let [call (first submits) result (output call)]
    (and (= 1 (count submits)) (success? call)
         (= (:summary submission) (:summary (input call)))
         (= (:event submission) (:event result))
         (= (:submission-file context) (:file result))
         (= (count (:comments submission)) (:inline-comments result)))))

(defn verify
  "Consume shaped host events, optional actual submission, trusted full-input
   context. :stale-review-coverage is an observed cause, never retry authority.
   Missing/malformed/session/source/cardinality evidence is unestablished."
  [events submission context]
  (let [calls (vec (keep-indexed #(when (= "tool_use" (:type %2)) (assoc %2 :position (inc %1))) events))
        review-calls (filterv #(contains? review-tools (tool %)) calls)
        begins (filterv #(= "review_begin" (tool %)) review-calls)
        submits (filterv #(= "review_submit" (tool %)) review-calls)
        stage-calls (filterv #(= "review_record_evidence" (tool %)) review-calls)
        stage-names (mapv #(get (input %) :stage) stage-calls)
        violations (last-read-violations calls)
        begin (first (filter success? begins)) began (output begin)
        code (cond
               (not (context-valid? context)) :trusted-context-unestablished
               :else (or (event-error events (:session-id context))
                         (call-error calls context)
                         (when (and (seq review-calls) (not (begin-admitted? calls review-calls begins))) :begin-cardinality)
                         (when (and begin (not (and (= "deterministic" (:stage began)) (= stages (:stages began))
                                         (= (:input-source context) (:input-source began))
                                         (= (or (:end (last (:pages context))) 0) (get-in began [:diff-stats :bytes]))
                                         (= {:chunks (count (:pages context)) :delivered 0 :assessed 0
                                             :missing (mapv :id (:pages context))}
                                            (:input-coverage began))))) :begin-source-binding)
                         (when-not (and (<= (count stage-calls) 5)
                                         (= stage-names (vec (take (count stage-calls) stages)))
                                         (every? success? stage-calls)) :stage-order)
                         (when (> (count submits) 1) :submit-cardinality)
                         (when (and (some #(true? (:restart-required? (output %))) review-calls)
                                    (not (witnessed-stale? calls violations))) :restart-without-host-witness)
                         (serialized-error submission context calls)
                         (when (and submission (not (submit-bound? submission context submits))) :actual-submit-binding)))
        refuse (fn [kind reason] {:ok? false :reason-kind kind :code reason :violations violations})]
    (cond
      code (refuse :unestablished-review-trace code)
      (and (seq violations) (witnessed-stale? calls violations)) (refuse :stale-review-coverage :last-read-order)
      (seq violations) (refuse :unestablished-review-trace :read-assessment-not-established)
      (not (every? success? review-calls)) (refuse :unestablished-review-trace :failed-review-tool)
      (and (nil? submission) (empty? submits))
      (refuse :missing-review-submit :healthy-unfinished-review)
      (not begin) (refuse :unestablished-review-trace :begin-not-established)
      (not= stages stage-names) (refuse :unestablished-review-trace :incomplete-five-stages)
      (not (and submission (= 1 (count submits))
                (= "review_submit" (tool (last review-calls))))) (refuse :unestablished-review-trace :submission-not-established)
      :else
      (let [submit (first submits)
            reads (filterv #(= "review_read_diff_chunk" (tool %)) review-calls)
            assessed (filterv #(= "review_assess_diff_chunk" (tool %)) review-calls)
            ids (set (map :id (:pages context)))]
        (cond
          (not (and (= ids (set (map #(get (input %) :id) reads)))
                    (= ids (set (map #(get (input %) :id) assessed))))) (refuse :unestablished-review-trace :incomplete-page-calls)
          (not (and (< (:position begin) (:position (first stage-calls)))
                    ;; The producer requires full coverage when adversarial
                    ;; validation completes and admits the publish stage.
                    (or (empty? assessed) (< (apply max (map :position assessed)) (:position (nth stage-calls 3))))
                    (< (:position (last stage-calls)) (:position submit)))) (refuse :unestablished-review-trace :stage-chronology)
          (not (submit-bound? submission context submits)) (refuse :unestablished-review-trace :actual-submit-binding)
          :else {:ok? true :reason-kind nil :code :verified-review-invocation
                 :session-id (:session-id (first events)) :review-call-count (count review-calls)
                 :page-count (count ids) :violations []
                 :accepted-invocation {:session-id (:session-id (first events))
                                       :submission-call-id (get-in submit [:part :call-id])
                                       :submission-position (:position submit)
                                       :submission-file (:submission-file context)
                                       :full-input-sha256 (:full-input-sha256 context)
                                       :page-count (count ids)}})))))
