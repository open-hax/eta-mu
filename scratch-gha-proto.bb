#!/usr/bin/env bb
;; Feasibility probe: can an EDN workflow declaration + a pinned action registry
;; emit byte-comparable GitHub Actions YAML from Babashka alone?
;; Reproduces .github/workflows/main-pr-gate.yml.

(require '[clj-yaml.core :as yaml]
         '[clojure.string :as str]
         '[clojure.data :as data])

;; ── The action registry: one pin per action, for the whole repo ──────────────
(def actions
  {:checkout       "actions/checkout@93cb6efe18208431cddfb8368fd83d5badbf9bfd"
   :setup-java     "actions/setup-java@c1e323688fd81a25caa38c78aa6df2d33d3e20d9"
   :setup-clojure  "DeLaGuardo/setup-clojure@ada62bb3282a01a296659d48378b812b8e097360"
   :setup-pnpm     "pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1"
   :setup-node     "actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444"})

;; ── Reusable toolchain fragments — the thing YAML cannot factor out ──────────
(defn checkout [] {:uses (:checkout actions) :with {:persist-credentials false}})
(defn jvm-clojure []
  [{:uses (:setup-java actions)    :with {:distribution "temurin" :java-version "21"}}
   {:uses (:setup-clojure actions) :with {:bb "1.13.219" :clj-kondo "2025.10.23"}}])
(defn node-pnpm []
  [{:uses (:setup-pnpm actions) :with {:version "10.14.0" :run_install false}}
   {:uses (:setup-node actions) :with {:node-version 20}}])

;; ── The declaration ─────────────────────────────────────────────────────────
(def workflow
  {:name "eta-mu-main-pr-gate"
   :on {:pull_request {:branches ["main"]
                       :paths ["packages/legacy/docs/**"
                               "packages/legacy/github/**"
                               ".github/workflows/*.yml"]}}
   :jobs
   {:main-lint  {:name "main-lint" :runs-on "ubuntu-latest" :timeout 15
                 :steps [(checkout)
                         {:run "echo \"services/ removed; no deploy scripts to lint in current layout\""}]}
    :eta-mu-lint {:name "eta-mu-lint" :runs-on "ubuntu-latest" :timeout 20
                  :steps (concat [(checkout)] (jvm-clojure) (node-pnpm)
                                 [{:run "pnpm install --no-frozen-lockfile"}
                                  {:run "pnpm --dir packages/extensions build"}
                                  {:run "pnpm lint"}])}
    :main-tests {:name "main-tests" :runs-on "ubuntu-latest" :timeout 15
                 :node 22
                 :steps [(checkout)
                         {:uses (:setup-node actions) :with {:node-version 22 :package-manager-cache false}}
                         {:run "node --test packages/legacy/docs/tests/*.test.cjs"}]}
    :main-build {:name "main-build" :runs-on "ubuntu-latest" :timeout 30
                 :steps [(checkout)
                         {:run "echo \"services/ removed; no docker compose build in current layout\""}]}}})

;; ── The projection ──────────────────────────────────────────────────────────
(defn- emit-job [j]
  (cond-> {"name" (:name j)
           "runs-on" (:runs-on j)}
    (:timeout j) (assoc "timeout-minutes" (:timeout j))
    true (assoc "permissions" {})
    true (assoc "steps" (mapv (fn [s]
                                (cond-> {}
                                  (:uses s) (assoc "uses" (:uses s))
                                  (:with s) (assoc "with" (into {} (map (fn [[k v]] [(name k) v]) (:with s))))
                                  (:run s) (assoc "run" (:run s))))
                              (:steps j)))))

(defn emit [w]
  {"name" (:name w)
   "on" {"pull_request" {"branches" (get-in w [:on :pull_request :branches])
                         "paths" (get-in w [:on :pull_request :paths])}}
   "jobs" (into {} (map (fn [[k v]] [(name k) (emit-job v)]) (:jobs w)))})

(let [generated (emit workflow)
      on-disk (yaml/parse-string (slurp ".github/workflows/main-pr-gate.yml"))
      ;; normalize: clj-yaml gives keywords; compare as plain nested strings
      norm (fn [x] (clojure.walk/postwalk #(if (keyword? %) (name %) %) x))
      a (norm generated)
      b (norm (update on-disk :on identity))
      b (clojure.walk/postwalk #(if (= % true) "true" %) b)
      a (clojure.walk/postwalk #(if (= % true) "true" %) a)]
  (println "=== generated YAML ===")
  (println (yaml/generate-string generated :dumper-options {:flow-style :block}))
  (let [[only-gen only-disk _] (data/diff a b)]
    (println "=== semantic diff vs .github/workflows/main-pr-gate.yml ===")
    (println "only in generated:" (pr-str only-gen))
    (println "only on disk     :" (pr-str only-disk))))
