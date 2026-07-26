(ns open-hax.sol.infra.agent.media
  "Media materialization for tool results, re-homed from the legacy provider
   boundary to sit next to the turn-processor session adapter.

   Tools whose results carry image/audio parts under :details :content-parts
   (the legacy after-tool-call contract, kept by the MCP bridge) get those
   parts materialized — URLs fetched to base64, inline data passed through —
   and merged into the result :content the session history (and model, as
   provider-shaped placeholders) sees.

   The turn-processor run-loop's after-tool-call hook is synchronous, so the
   materialization seam wraps each tool's async :execute instead: the wrapper
   post-processes the resolved result map."
  (:require [clojure.string :as str]
            [open-hax.sol.extern.promise :as promise]))

(defn- raw-media-part
  [part]
  {:type (some-> (:type part) str)
   :url (some-> (:url part) str not-empty)
   :data (some-> (:data part) str not-empty)
   :mimeType (or (some-> (:mimeType part) str not-empty)
                 (some-> (:mime-type part) str not-empty))})

(defn- media-part?
  [part]
  (contains? #{"image" "audio"} (some-> (:type part) str str/lower-case)))

(defn- result-media-parts
  [result]
  (let [details (:details result)
        raw-parts (or (:content-parts details)
                      (:contentParts details)
                      [])]
    (->> raw-parts
         (map raw-media-part)
         (filter media-part?)
         vec)))

(defn- materialized->content-part
  "Project a materialized media map onto the turn-processor-law input content
   part shape (closed maps: only :type/:data/:mime-type survive)."
  [materialized]
  (when-let [data (some-> (:data materialized) str not-empty)]
    (let [part-type (some-> (:type materialized) str str/lower-case)]
      (cond-> {:type (keyword part-type)
               :data data}
        (some-> (:mimeType materialized) str not-empty)
        (assoc :mime-type (some-> (:mimeType materialized) str not-empty))))))

(defn ^:async materialize-result!
  "Materialize the media parts declared in a tool result's details and append
   them to the result content. Returns the (possibly unchanged) result map;
   a materialization failure never masks the tool's own outcome."
  [materialize! result]
  (let [media-parts (result-media-parts result)]
    (if (seq media-parts)
      (try
        (let [materialized (await (promise/all-vec (mapv materialize! media-parts)))
              good (->> materialized (keep materialized->content-part) vec)]
          (if (seq good)
            (update result :content (fnil into []) good)
            result))
        (catch :default _
          result))
      result)))

(defn wrap-tool
  "Wrap one turn-processor tool descriptor so its :execute result passes
   through materialize-result!. A nil materialize! leaves the tool untouched."
  [materialize! tool]
  (if (and (fn? materialize!) (fn? (:execute tool)))
    (let [execute (:execute tool)]
      (assoc tool :execute
             (^:async fn [id args signal on-update]
               (materialize-result! materialize!
                                    (await (execute id args signal on-update))))))
    tool))

(defn wrap-tools
  "Wrap every tool descriptor in the collection (see wrap-tool)."
  [materialize! tools]
  (if (fn? materialize!)
    (mapv #(wrap-tool materialize! %) (or tools []))
    (vec (or tools []))))
