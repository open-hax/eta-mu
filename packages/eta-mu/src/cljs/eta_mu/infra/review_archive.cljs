;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-archive
  "Physical artifact boundary only. Native metadata authentication, complete
  immutable Muse verification and privileged wire effects remain separate ports."
  (:require [eta-mu.law.review-archive :as law]
            [eta-mu.shape.review-archive :as zip]
            [eta-mu.domain.review-archive :as domain]
            [eta-mu.extern.review-archive :as host]
            [eta-mu.domain.review-publication :as publication]
            [eta-mu.law.review-publication :as publication-law]))

(defn- layout! [token size]
  (let [ordinary (zip/end-record (host/range-bytes token (max 0 (- size 65557)) (min size 65557)) size)
        at (:offset ordinary)
        previous (when (>= at 20) (host/range-bytes token (- at 20) 20))
        locator (when (and previous (zip/signature? previous 0 117853008)) (zip/zip64-locator previous))
        zip64 (when locator (zip/zip64-end (host/range-bytes token (:offset locator) 56)))]
    (domain/end-layout ordinary locator zip64 size)))

(defn- local! [token entry]
  (let [offset (:local-offset entry)
        fixed (host/range-bytes token offset 30)
        header-size (+ 30 (zip/uint fixed 26 2) (zip/uint fixed 28 2))
        local (zip/local-record (host/range-bytes token offset header-size))
        payload (+ offset header-size)
        payload-end (+ payload (:compressed-size entry))
        gap (- (:next-offset entry) payload-end)
        descriptor? (not (zero? (bit-and (:flags entry) 8)))]
    (when (or (neg? gap) (and (not descriptor?) (not (zero? gap)))
              (and descriptor? (not (contains? #{12 16 20 24} gap)))) (zip/refuse! :zip-local-layout))
    (domain/local! entry local (when descriptor? (zip/descriptor (host/range-bytes token payload-end gap))))
    (assoc entry :payload-offset payload)))

(defn ^:async worker-admit!
  "Internal accepted-source worker entry. The public boundary additionally
  enforces the whole-operation deadline outside this worker's event loop."
  [{:keys [path artifact bounds required-members text-members] :as request}]
  (let [opened (atom nil) start (host/monotonic-ms)]
    (try
      (when-not (host/admission-worker?) (zip/refuse! :archive-runtime))
      (when-not (law/request? request) (zip/refuse! :archive-request))
      (let [physical (host/open! path (:download-bytes bounds) (+ start (:operation-ms bounds)))
            token (:token physical)
            _ (reset! opened token)
            tick! #(domain/time! start (host/monotonic-ms) (:operation-ms bounds))
            _ (domain/artifact! artifact physical (host/wall-ms))
            layout (layout! token (:size-bytes physical))
            _ (when (> (:count layout) (:members bounds)) (zip/refuse! :zip-member-count))
            central (zip/central-records (host/range-bytes token (:central-offset layout) (:central-size layout)) (:members bounds))
            named (mapv #(merge % (host/decode-name (:name-bytes %))) central)
            entries (domain/entries! layout named bounds required-members text-members)
            locals (mapv #(do (tick!) (local! token %)) entries)
            members (atom {})]
        (tick!)
        (doseq [entry locals]
          (tick!)
          (let [remaining (- (:operation-ms bounds) (- (host/monotonic-ms) start))
                decoded (await (host/decode! token (:payload-offset entry) (:compressed-size entry) (:method entry)
                                             (min (:member-bytes bounds) (:size entry))
                                             (contains? (set text-members) (:path entry))
                                             (min remaining (:decode-ms bounds))))]
            (tick!)
            (domain/decoded! entry decoded)
            (swap! members assoc (:path entry) decoded)))
        (tick!)
        (domain/artifact! artifact physical (host/wall-ms))
        {:status :verified
         :artifact (assoc artifact :archive-proof
                          {:origin :trusted-archive-verifier :result :verified
                           :artifact-id (:id artifact) :sha256 (:sha256 physical)
                           :completed-at-ms (host/wall-ms) :bounds bounds
                           :actual {:download-bytes (:size-bytes physical) :members (count entries)
                                    :uncompressed-bytes (reduce + 0 (map :size entries))
                                    :operation-ms (- (host/monotonic-ms) start)}})
         :members @members})
      (catch :default e {:status :refused :code (or (:code (ex-data e)) :archive-host)})
      (finally (when @opened (host/close! @opened))))))

(defn ^:async admit!
  "Verify actual ZIP bytes in a disposable accepted-source NBB worker. The
  outer timer covers runtime startup, file/hash, metadata parsing and decoding;
  cancellation/IPC cleanup is not a whole-API latency guarantee. Native metadata
  still requires independent authentication. No supplied archive-proof counts,
  and JSON meaning remains with the immutable Muse verifier."
  [request]
  (if (publication-law/positive? (get-in request [:bounds :operation-ms]))
    (await (host/bounded-admission! request))
    {:status :refused :code :archive-request}))

(defn ^:async admit-context!
  "Compose the physical boundary with the existing publication core. The
  artifact tuple must already match. This supplies no other verification facts,
  durable claims or native publication authority."
  [context request]
  (if (not= (:artifact request) (get-in context [:snapshot :artifact]))
    {:status :refused :code :archive-context-binding}
    (let [result (await (admit! request))]
      (if (= :verified (:status result))
        (publication/admit (-> context
                               (assoc :now-ms (host/wall-ms))
                               (assoc-in [:snapshot :artifact] (:artifact result))))
        result))))
