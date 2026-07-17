#!/usr/bin/env bb

(require '[babashka.process :as p]
         '[cheshire.core :as json]
         '[clojure.edn :as edn]
         '[clojure.java.io :as io]
         '[clojure.pprint :as pprint]
         '[clojure.string :as str])
(import '[java.security MessageDigest]
        '[java.time Instant])

(defn sha256-hex [s]
  (let [digest (.digest (MessageDigest/getInstance "SHA-256") (.getBytes s "UTF-8"))]
    (apply str (map #(format "%02x" %) digest))))

(defn now-iso [] (str (Instant/now)))

(defn interpolate [s ctx]
  (str/replace (str s) #"\{([^{}|]+)(?:\|(\d+))?\}"
               (fn [[_ path trunc]]
                 (let [v (get-in ctx (mapv keyword (str/split path #"/")))]
                   (if trunc
                     (subs (str v) 0 (min (count (str v)) (parse-long trunc)))
                     (str v))))))

(defn parse-json-events [out]
  (keep (fn [line]
          (try (json/parse-string line true)
               (catch Exception _ nil)))
        (str/split-lines (str out))))

(defn strip-fences [s]
  (-> (str/trim (str s))
      (str/replace #"^```(?:json)?\s*" "")
      (str/replace #"\s*```$" "")))

(defn extract-json [texts]
  (some (fn [t]
          (let [t (strip-fences t)]
            (or (try (json/parse-string t true) (catch Exception _ nil))
                (let [i (.indexOf t "{") j (.lastIndexOf t "}")]
                  (when (and (>= i 0) (> j i))
                    (try (json/parse-string (subs t i (inc j)) true)
                         (catch Exception _ nil)))))))
        (reverse texts)))

(defn run-agent!
  [{:keys [prompt agent model dir title timeout-ms]}]
  (let [args (cond-> ["opencode" "run" "--format" "json"]
               title (into ["--title" title])
               dir (into ["--dir" dir])
               model (into ["-m" model])
               agent (into ["--agent" agent])
               true (conj prompt))
        started (System/currentTimeMillis)
        proc (p/process args {:out :string :err :string :in ""})
        res (deref proc timeout-ms ::timeout)]
    (if (= res ::timeout)
      (do (p/destroy-tree proc)
          {:error (str "agent timeout after " timeout-ms "ms")})
      (let [events (parse-json-events (:out res))
            texts (keep #(when (= "text" (:type %)) (get-in % [:part :text])) events)
            tokens (reduce + 0 (keep #(when (= "step_finish" (:type %))
                                      (get-in % [:part :tokens :total])) events))
            err-ev (some #(when (= "error" (:type %)) %) events)
            base {:tokens tokens :duration-ms (- (System/currentTimeMillis) started)}]
        (cond
          err-ev (merge base {:error (or (get-in err-ev [:error :data :message]) "opencode error")})
          (empty? texts) (merge base {:error (str "no text output; stderr: "
                                                  (subs (str/trim (str (:err res))) 0
                                                        (min 300 (count (str/trim (str (:err res)))))))})
          :else (if-let [parsed (extract-json texts)]
                  (merge base {:result parsed})
                  (merge base {:error "no parseable JSON object in agent output"
                               :raw (let [raw (last texts)]
                                      (subs raw 0 (min 500 (count raw))))})))))))

(def journal-lock (Object.))

(defn append-journal! [journal-path event]
  (locking journal-lock
    (spit journal-path (str (json/generate-string (assoc event :ts (now-iso))) "\n") :append true)))

(defn load-journal [journal-path]
  (if (.exists (io/file journal-path))
    (->> (str/split-lines (slurp journal-path))
         (keep (fn [line] (try (json/parse-string line true) (catch Exception _ nil)))))
    []))

(defn job-key [desc] (str "v2:" (sha256-hex (pr-str desc))))

(defn cached-results [journal]
  (into {} (comp (filter #(= "result" (:type %)))
                 (map (juxt :key :result)))
        journal))

(defn dispatch!
  [{:keys [journal-path cache agent model dir timeout-ms label prompt desc]}]
  (let [k (job-key desc)]
    (if-let [hit (get cache k)]
      (do (println (str "  [cached] " label)) hit)
      (do (append-journal! journal-path {:type "started" :key k :label label})
          (println (str "  [spawn ] " label))
          (let [r (run-agent! {:prompt prompt :agent agent :model model
                               :dir dir :timeout-ms timeout-ms})]
            (if (:error r)
              (do (append-journal! journal-path {:type "error" :key k :label label
                                                 :error (:error r)})
                  (println (str "  [error ] " label " :: " (:error r)))
                  nil)
              (do (append-journal! journal-path {:type "result" :key k :label label
                                                 :result (:result r) :tokens (:tokens r)
                                                 :duration-ms (:duration-ms r)})
                  (println (str "  [done  ] " label " (" (:duration-ms r) "ms, "
                                (:tokens r) " tok)"))
                  (:result r))))))))

(defn pmap-bounded [n f xs]
  (if (and n (pos? n) (< n (count xs)))
    (mapcat identity (map (fn [chunk] (doall (pmap f chunk))) (partition-all n xs)))
    (doall (pmap f xs))))

(defn structured-suffix [schema]
  (str "\n\nRespond with ONLY a JSON object (no markdown fences, no commentary) matching this JSON Schema:\n"
       (json/generate-string schema)))

(defn cartesian-items [wf bindings]
  (reduce (fn [acc {:keys [bind from]}]
            (for [a acc v (get-in wf from)] (assoc a bind v)))
          [{}] bindings))

(defn run-map-agent-stage [wf stage {:keys [journal-path cache limit]}]
  (let [run-cfg (:run wf)
        repo (get-in wf [:vars :repo])
        schema (get (:schemas wf) (:stage/schema stage))
        items0 (cartesian-items wf (get-in stage [:stage/items :cartesian]))
        items (if limit (take limit items0) items0)]
    (println (str "== stage " (:stage/id stage) " [" (:stage/phase stage) "] :: "
                  (count items) " jobs"))
    (pmap-bounded
     (:max-concurrency run-cfg)
     (fn [job]
       (let [ctx (merge job {:repo repo})
             label (interpolate (:stage/label stage) ctx)
             prompt (str (interpolate (:stage/prompt stage) ctx)
                         (structured-suffix schema))
             desc {:stage (:stage/id stage) :agent (:stage/agent stage)
                   :model (:model run-cfg) :job (into (sorted-map) job)}
             result (dispatch! {:journal-path journal-path :cache cache
                                :agent (:stage/agent stage) :model (:model run-cfg)
                                :dir (:dir run-cfg) :timeout-ms (:agent-timeout-ms run-cfg)
                                :label label :prompt prompt :desc desc})]
         {:job job :result result}))
     items)))

(defn run-vote-fan-out-stage [wf stage prior {:keys [journal-path cache limit]}]
  (let [run-cfg (:run wf)
        repo (get-in wf [:vars :repo])
        schema (get (:schemas wf) (:stage/schema stage))
        votes (:stage/votes stage 2)
        quorum (:stage/quorum stage 2)
        finding-path (:stage/finding-path stage [:findings])
        review-jobs (filter :result prior)
        jobs (vec (for [{:keys [job result]} review-jobs
                        finding (get-in result finding-path)
                        n (range 1 (inc votes))]
                    {:card (:card job) :finding finding :vote {:n n}
                     :card-key (:key (:card job)) :lens-key (:key (:lens job))}))
        jobs (if limit (take limit jobs) jobs)]
    (println (str "== stage " (:stage/id stage) " [" (:stage/phase stage) "] :: "
                  (count jobs) " skeptic votes over "
                  (count (distinct (map (juxt :card-key :lens-key) review-jobs))) " reviews"))
    (let [verdicts (pmap-bounded
                    (:max-concurrency run-cfg)
                    (fn [{:keys [card finding vote] :as j}]
                      (let [ctx (merge j {:repo repo})
                            label (interpolate (:stage/label stage) ctx)
                            prompt (str (interpolate (:stage/prompt stage) ctx)
                                        (structured-suffix schema))
                            desc {:stage (:stage/id stage) :agent (:stage/agent stage)
                                  :model (:model run-cfg)
                                  :card (:key card) :finding finding :vote (:n vote)}
                            result (dispatch! {:journal-path journal-path :cache cache
                                               :agent (:stage/agent stage) :model (:model run-cfg)
                                               :dir (:dir run-cfg) :timeout-ms (:agent-timeout-ms run-cfg)
                                               :label label :prompt prompt :desc desc})]
                        (assoc j :verdict result)))
                    jobs)
          by-finding (vals (group-by (juxt (comp :key :card)
                                           (comp :title :finding)
                                           (comp :file :finding)) verdicts))]
      (mapv (fn [group]
              (let [{:keys [finding card-key lens-key]} (first group)
                    votes-in (keep :verdict group)
                    not-refuted (count (remove :refuted votes-in))]
                (assoc finding
                       :card card-key :lens lens-key
                       :survives (>= not-refuted quorum)
                       :reasons (mapv :reason votes-in))))
            by-finding))))

(defn run-stage [wf stage stage-outputs opts]
  (case (:stage/kind stage)
    :map-agent (run-map-agent-stage wf stage opts)
    :vote-fan-out (let [prior (get stage-outputs (:stage/over stage))]
                    (run-vote-fan-out-stage wf stage prior opts))
    :return stage
    (throw (ex-info (str "unknown stage kind: " (:stage/kind stage)) {:stage stage}))))

(defn run-workflow [wf {:keys [fresh limit]}]
  (let [wf-id (name (:workflow/id wf))
        run-dir (io/file ".ημ" "runs" wf-id)
        journal-path (str (io/file run-dir "journal.jsonl"))]
    (.mkdirs run-dir)
    (when fresh (io/delete-file journal-path true))
    (let [journal (load-journal journal-path)
          cache (cached-results journal)
          opts {:journal-path journal-path :cache cache :limit limit}
          _ (println (str "workflow " wf-id " :: journal " (count journal) " events, "
                          (count cache) " cached results"))
          stage-outputs (reduce (fn [outputs stage]
                                  (if (= :return (:stage/kind stage))
                                    outputs
                                    (assoc outputs (:stage/id stage)
                                           (run-stage wf stage outputs opts))))
                                {} (:stages wf))
          flat (vec (get stage-outputs :verify []))
          confirmed (vec (filter :survives flat))
          result {:workflow/id (:workflow/id wf)
                  :ημ/kind :ultra/run-result
                  :finished-at (now-iso)
                  :raw-findings (count flat)
                  :confirmed confirmed
                  :all flat}
          result-file (str (io/file run-dir
                                    (str (str/replace (now-iso) ":" "-") "-result.edn")))]
      (spit result-file (with-out-str (pprint/pprint result)))
      (println (str "\n== result :: " (count flat) " raw findings, "
                    (count confirmed) " confirmed after skeptic votes"))
      (doseq [f confirmed]
        (println (str "  CONFIRMED [" (:severity f) "] " (:card f) "/" (:lens f)
                      ": " (:title f) " (" (:file f) ")")))
      (println (str "result written: " result-file))
      result)))

(defn plan-workflow [wf]
  (let [review (first (filter #(= :map-agent (:stage/kind %)) (:stages wf)))
        verify (first (filter #(= :vote-fan-out (:stage/kind %)) (:stages wf)))
        items (cartesian-items wf (get-in review [:stage/items :cartesian]))
        repo (get-in wf [:vars :repo])]
    (println (str "workflow " (name (:workflow/id wf)) " — " (get-in wf [:meta :description])))
    (println (str "model: " (get-in wf [:run :model])
                  " | timeout: " (get-in wf [:run :agent-timeout-ms]) "ms"
                  " | concurrency: " (get-in wf [:run :max-concurrency])))
    (println (str "\nstage :review — " (count items) " agent jobs:"))
    (doseq [job items]
      (println (str "  " (interpolate (:stage/label review) (merge job {:repo repo})))))
    (println (str "\nstage :verify — " (:stage/votes verify) " skeptic votes per finding, quorum "
                  (:stage/quorum verify) " (findings discovered at runtime)"))
    (println "\nfirst review prompt:\n")
    (println (interpolate (:stage/prompt review) (merge (first items) {:repo repo})))
    (println (structured-suffix (get (:schemas wf) (:stage/schema review))))))

(defn usage []
  (println "usage:")
  (println "  bb scripts/ultra.bb plan <workflow.edn>")
  (println "  bb scripts/ultra.bb run  <workflow.edn> [--fresh] [--limit N]")
  (System/exit 1))

(defn -main [& args]
  (let [[cmd wf-path & flags] args]
    (when (or (nil? cmd) (nil? wf-path)) (usage))
    (let [wf (edn/read-string (slurp wf-path))
          fresh (some #{"--fresh"} flags)
      limit (some #(second (str/split % #"=")) (filter #(str/starts-with? % "--limit") flags))
          limit (when limit (parse-long limit))]
      (case cmd
        "plan" (plan-workflow wf)
        "run" (run-workflow wf {:fresh (boolean fresh) :limit limit})
        (usage)))))

(when (= *file* (System/getProperty "babashka.file"))
  (apply -main *command-line-args*))
