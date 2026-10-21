;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-collection
  "Raw fixed GitHub GET transport and accepted registry file edge."
  (:require [eta-mu.law.review-collection :as law]
            [edamame.core :as edamame]
            ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:crypto" :as crypto]))

(defn- refuse! [code] (throw (ex-info "Native collection refused" {:code code})))
(defn monotonic-now [] (.now js/performance))
(defn wall-now [] (.now js/Date))
(defn parse-date-ms [value]
  (when (string? value)
    (let [parsed (js/Date.parse value)]
      (when (js/Number.isFinite parsed) parsed))))

(defn- git-root [directory]
  (loop [current directory]
    (cond
      (.existsSync fs (.join path current ".git")) current
      (= current (.dirname path current)) (refuse! :repository-root)
      :else (recur (.dirname path current)))))

(defn- ^:async cancel-body! [response]
  (try (await (.cancel (.-body response))) (catch :default _ nil)))

(defn ^:async read-body! [response maximum]
  (let [reader (.getReader (.-body response))]
    (loop [chunks [] total 0]
      (let [part (await (.read reader))]
        (if (.-done part)
          {:text (.decode (js/TextDecoder. "utf-8" #js {:fatal true})
                          (js/Buffer.concat (into-array chunks)))
           :bytes total}
          (let [chunk (js/Buffer.from (.-value part))
                size (.-length chunk)
                next-total (+ total size)]
            (when (> next-total maximum)
              (await (.cancel reader))
              (refuse! :response-bytes))
            (recur (conj chunks chunk) next-total)))))))

(defn read-registry! []
  (try
    (let [source (:file (meta #'read-registry!))
          _ (when-not (and (string? source) (.isAbsolute path source)) (refuse! :registry-source))
          package-root (.resolve path (.dirname path source) "../../../..")
          repository-root (git-root package-root)
          source-relative (.relative path repository-root source)
          file (.join path repository-root ".github/review-publication-targets.edn")
          stat (.lstatSync fs file)]
      (when-not (and (= "packages/eta-mu/src/cljs/eta_mu/extern/review_collection.cljs" source-relative)
                     (.isFile stat) (not (.isSymbolicLink stat))
                     (= file (.realpathSync fs file))
                     (<= (.-size stat) 1000000)) (refuse! :registry))
      (let [raw (.readFileSync fs file)
            source (.decode (js/TextDecoder. "utf-8" #js {:fatal true}) raw)
            forms (edamame/parse-string-all source)
            digest (.digest (.update (.createHash crypto "sha256") raw) "hex")]
        (when-not (and (= 1 (count forms)) (map? (first forms))) (refuse! :registry-edn))
        {:registry (first forms) :bytes (.-length raw) :sha256 digest}))
    (catch :default _ {:status :refused :reason :registry})))

(defn ^:async get! [{:keys [url timeout-ms max-bytes] :as request}]
  (when-not (and (law/request? request) (pos? timeout-ms) (pos? max-bytes))
    (refuse! :request))
  (let [controller (js/AbortController.)
        timer (js/setTimeout #(.abort controller) timeout-ms)]
    (try
      (let [response (await (js/fetch url #js {:method "GET" :redirect "error"
                                               :credentials "omit"
                                               :headers #js {"Accept" "application/vnd.github+json"
                                                             "X-GitHub-Api-Version" "2022-11-28"}
                                               :signal (.-signal controller)}))
            status (.-status response)
            length-header (.get (.-headers response) "content-length")
            declared (when length-header (js/Number length-header))]
        (when-not (= "api.github.com" (.-host (js/URL. (.-url response)))) (refuse! :redirect))
        (when (and declared (> declared max-bytes))
          (await (cancel-body! response))
          (refuse! :response-bytes))
        (when-not (= 200 status)
          (await (cancel-body! response))
          (refuse! (if (= 404 status) :native-404 :native-http)))
        (let [{:keys [text bytes]} (await (read-body! response max-bytes))
              response-size bytes]
          (when (> response-size max-bytes) (refuse! :response-bytes))
          (try
            {:status :ok :data (js->clj (js/JSON.parse text) :keywordize-keys true)
             :bytes response-size :next-url (some-> (.get (.-headers response) "link")
                                             (as-> [header] (second (re-find #"<([^>]+)>;\s*rel=\"next\"" header))))}
            (catch :default _ (refuse! :native-json)))))
      (catch :default e
        (if (:code (ex-data e)) (throw e) (refuse! :native-transport)))
      (finally (js/clearTimeout timer)))))
