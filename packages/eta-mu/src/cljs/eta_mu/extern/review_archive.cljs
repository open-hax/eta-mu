;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-archive
  "Sealed bounded file bytes and disposable decoding workers. No member is
  extracted, imported, executed or exposed as a raw host object to the domain."
  (:require ["node:fs" :as fs]
            ["node:crypto" :as crypto]
            ["node:worker_threads" :refer [Worker]]))

(defonce ^:private handles (atom {}))
(defonce ^:private workers (atom #{}))
(defn monotonic-ms [] (.now js/performance))
(defn wall-ms [] (.now js/Date))
(defn resources [] {:handles (count @handles) :workers (count @workers)})
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
 if(workerData.method===8){const r=z.inflateRawSync(input,{info:true,maxOutputLength:workerData.maximum});bytes=r.buffer;consumed=r.engine.bytesWritten;}
 else {if(input.length>workerData.maximum)throw Error('bound');bytes=input;consumed=input.length;}
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
    (let [copy (js/Uint8Array. length)
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
                                            (if (.-ok message)
                                              (resolve (js->clj (.-value message) :keywordize-keys true))
                                              (reject (ex-info "Decoder refused" {:code :archive-decode})))))
                  (.once worker "error" (fn [_] (reject (ex-info "Decoder failed" {:code :archive-decode}))))
                  (.once worker "exit" (fn [_] (reject (ex-info "Decoder exited" {:code :archive-decode})))))))
        (finally
          (when @timer (js/clearTimeout @timer))
          (await (.terminate worker))
          (swap! workers disj worker))))))
