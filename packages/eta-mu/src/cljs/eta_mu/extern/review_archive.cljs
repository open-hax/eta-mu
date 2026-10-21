;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-archive
  "Sealed bounded file bytes and disposable decoding workers. No member is
  extracted, imported, executed or exposed as a raw host object to the domain."
  (:require [cljs.reader :as reader]
            ["node:fs" :as fs]
            ["node:crypto" :as crypto]
            ["node:path" :as path]
            ["node:module" :refer [createRequire]]
            ["node:worker_threads" :as threads :refer [Worker]]))

(defonce ^:private handles (atom {}))
(defonce ^:private workers (atom #{}))
(defn monotonic-ms [] (.now js/performance))
(defn wall-ms [] (.now js/Date))
(defn resources [] {:handles (count @handles) :workers (count @workers)})
(defn admission-worker? []
  (and (false? threads/isMainThread)
       (= "eta-mu.review-archive.worker/v1" (.-mode threads/workerData))))
(defn- fail! [code] (throw (ex-info "Archive boundary refused" {:code code})))
(defn- digest [bytes] (.digest (.update (.createHash crypto "sha256") bytes) "hex"))

(defn open!
  "Read exactly one bounded regular non-symlink file; detect growth and changed
  file identity, size or timestamps. The sealed buffer stays inside this extern."
  [file maximum deadline]
  (let [before (.lstatSync fs file)
        flags (bit-or (.-O_RDONLY (.-constants fs)) (.-O_NOFOLLOW (.-constants fs)))]
    (when-not (and (.isFile before) (not (.isSymbolicLink before))
                   (pos? (.-size before)) (<= (.-size before) maximum)) (fail! :archive-file))
    (let [fd (.openSync fs file flags)]
      (try
        (let [stat (.fstatSync fs fd)
              size (.-size stat)]
          (when-not (and (.isFile stat) (= (.-dev before) (.-dev stat))
                         (= (.-ino before) (.-ino stat)) (= (.-size before) size)
                         (<= size maximum)) (fail! :archive-file-changed))
          (let [bytes (.alloc js/Buffer size)]
            (loop [at 0]
              (when (>= (monotonic-ms) deadline) (fail! :archive-operation-time))
              (when (< at size)
                (let [n (.readSync fs fd bytes at (min 65536 (- size at)) at)]
                  (when (zero? n) (fail! :archive-truncated-file))
                  (recur (+ at n)))))
            (let [after (.fstatSync fs fd) extra (.alloc js/Buffer 1)]
              (when-not (and (zero? (.readSync fs fd extra 0 1 size))
                             (= size (.-size after)) (= (.-mtimeMs stat) (.-mtimeMs after))
                             (= (.-ctimeMs stat) (.-ctimeMs after))) (fail! :archive-file-changed)))
            (let [token (str (random-uuid))]
              (swap! handles assoc token bytes)
              {:token token :size-bytes size :sha256 (digest bytes)})))
        (finally (.closeSync fs fd))))))

(defn close! [token] (swap! handles dissoc token) nil)
(defn range-bytes [token offset length]
  (let [bytes (get @handles token)]
    (when-not (and bytes (integer? offset) (integer? length) (<= 0 offset) (<= 0 length)
                   (<= (+ offset length) (.-length bytes))) (fail! :zip-byte-range))
    (vec (.subarray bytes offset (+ offset length)))))

(defn decode-name [bytes]
  (let [text (.decode (js/TextDecoder. "utf-8" #js {:fatal true :ignoreBOM true})
                      (.from js/Buffer (clj->js bytes)))]
    {:path text :alias (.toLowerCase (.normalize (.replace text #"/$" "") "NFC"))}))

(def ^:private decoder-source
  "const {parentPort,workerData}=require('node:worker_threads');
const z=require('node:zlib'), c=require('node:crypto');
try {
 const input=Buffer.from(workerData.bytes);
 let bytes,consumed;
 if(workerData.method===8){const r=z.inflateRawSync(input,{info:true,maxOutputLength:Math.max(1,workerData.maximum)});bytes=r.buffer;consumed=r.engine.bytesWritten;}
 else {if(input.length>workerData.maximum)throw Error('bound');bytes=input;consumed=input.length;}
 if(bytes.length>workerData.maximum)throw Error('declared output bound');
 const value={size:bytes.length,consumed,crc32:z.crc32(bytes),sha256:c.createHash('sha256').update(bytes).digest('hex'),base64:bytes.toString('base64')};
 if(workerData.text)value.text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);
 parentPort.postMessage({ok:true,value});
}catch(_){parentPort.postMessage({ok:false});}")

(defn ^:async decode!
  "Decode a bounded compressed slice in an isolated disposable worker. A hard
  timer terminates a stalled decoder. The worker receives bytes, never a path."
  [token offset length method maximum text? timeout-ms]
  (let [sealed (get @handles token)]
    (when-not (and sealed (<= 0 offset) (<= 0 length) (<= (+ offset length) (.-length sealed))
                   (pos? timeout-ms)) (fail! :zip-byte-range))
    (let [deadline (+ (monotonic-ms) timeout-ms)
          copy (js/Uint8Array. length)
          _ (.set copy (.subarray sealed offset (+ offset length)))
          worker (Worker. decoder-source
                          #js {:eval true :env #js {} :execArgv #js []
                               :workerData #js {:bytes (.-buffer copy) :method method
                                                :maximum maximum :text text?}
                               :transferList #js [(.-buffer copy)]})
          timer (atom nil)]
      (swap! workers conj worker)
      (try
        (await (js/Promise.
                (fn [resolve reject]
                  (reset! timer (js/setTimeout #(reject (ex-info "Decoder deadline" {:code :archive-decode-time})) timeout-ms))
                  (.once worker "message" (fn [message]
                                            (if (>= (monotonic-ms) deadline)
                                              (reject (ex-info "Decoder deadline" {:code :archive-decode-time}))
                                              (if (.-ok message)
                                              (resolve (js->clj (.-value message) :keywordize-keys true))
                                              (reject (ex-info "Decoder refused" {:code :archive-decode}))))))
                  (.once worker "error" (fn [_] (reject (ex-info "Decoder failed" {:code :archive-decode}))))
                  (.once worker "exit" (fn [_] (reject (ex-info "Decoder exited" {:code :archive-decode})))))))
        (finally
          (let [_ (when @timer (js/clearTimeout @timer))
                _ (await (.terminate worker))]
            (swap! workers disj worker)))))))

(defn- accepted-runtime []
  ;; This adapter is a source-NBB capability. Anchor it to the executing
  ;; accepted module, never cwd, request data or an uploaded source path.
  ;; A compiled/npm layout without that source capability refuses explicitly.
  (let [source (:file (meta #'open!))]
    (when-not (and (string? source) (.isAbsolute path source)
                   (.isFile (.lstatSync fs source))) (fail! :archive-runtime))
    (let [package-root (.resolve path (.dirname path source) "../../../..")
          package-file (.join path package-root "package.json")
          package (js/JSON.parse (.readFileSync fs package-file "utf8"))
          require (createRequire package-file)
          nbb (.resolve require "nbb")
          version (aget (.-dependencies package) "nbb")]
      (when-not (and (= "eta-mu" (.-name package)) (string? version)
                     (re-matches #"\d+\.\d+\.\d+" version)) (fail! :archive-runtime))
      {:nbb nbb :version version :classpath (.join path package-root "src/cljs")})))

(def ^:private admission-source
  "const {parentPort,workerData}=require('node:worker_threads');
const {pathToFileURL}=require('node:url');
(async()=>{try{
 const api=await import(pathToFileURL(workerData.nbb).href);
 if(api.version()!==workerData.version)throw Error('runtime version');
 api.addClassPath(workerData.classpath);
 const run=await api.loadString(\"(require '[eta-mu.infra.review-archive :as archive] '[cljs.reader :as reader]) (defn ^:async bounded-run [raw] (let [result (await (archive/worker-admit! (reader/read-string raw)))] (pr-str result))) (fn [raw] (bounded-run raw))\",{disableConfig:true});
 parentPort.postMessage({ok:true,result:await run(workerData.request)});
}catch(_){parentPort.postMessage({ok:false});}})();")

(defn ^:async bounded-admission!
  "Fixed accepted-source worker bridge. No request value is source code, a
  module location, interpreter option or environment. Termination also stops
  nested decoder workers; a late bridge result cannot qualify."
  [request]
  (let [start (monotonic-ms)
        maximum (get-in request [:bounds :operation-ms])
        result
        (await
         (try
           (let [{:keys [nbb version classpath]} (accepted-runtime)
                 deadline (+ start maximum)
                 worker (Worker. admission-source
                                 #js {:eval true :env #js {} :execArgv #js []
                                      :workerData #js {:mode "eta-mu.review-archive.worker/v1"
                                                       :nbb nbb :version version :classpath classpath
                                                       :request (pr-str request)}})
                 timer (atom nil)]
             (swap! workers conj worker)
             (try
               (await
                (js/Promise.
                 (fn [resolve reject]
                   (reset! timer (js/setTimeout #(reject (ex-info "Admission deadline" {:code :archive-operation-time}))
                                               (max 0 (- deadline (monotonic-ms)))))
                   (.once worker "message"
                          (fn [message]
                            (if (>= (monotonic-ms) deadline)
                              (reject (ex-info "Admission deadline" {:code :archive-operation-time}))
                              (if (.-ok message)
                                (try
                                  (let [decoded (reader/read-string (.-result message))]
                                    (when-not (and (map? decoded) (contains? #{:verified :refused} (:status decoded)))
                                      (fail! :archive-runtime))
                                    (resolve decoded))
                                  (catch :default _ (reject (ex-info "Admission bridge" {:code :archive-runtime}))))
                                (reject (ex-info "Admission runtime" {:code :archive-runtime}))))))
                   (.once worker "error" (fn [_] (reject (ex-info "Admission runtime" {:code :archive-runtime}))))
                   (.once worker "exit" (fn [_] (reject (ex-info "Admission exited" {:code :archive-runtime})))))))
               (finally
                 (let [_ (when @timer (js/clearTimeout @timer))
                       _ (await (.terminate worker))]
                   (swap! workers disj worker)))))
           (catch :default e {:status :refused :code (or (:code (ex-data e)) :archive-runtime)})))
        elapsed (- (monotonic-ms) start)]
    (cond
      (or (neg? elapsed) (>= elapsed maximum)) {:status :refused :code :archive-operation-time}
      (= :verified (:status result)) (assoc-in result [:artifact :archive-proof :actual :operation-ms] elapsed)
      :else result)))
