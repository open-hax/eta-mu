(ns eta-mu.garden.shape.block
  (:require [clojure.string :as str]
            [eta-mu.garden.extern.js :as host]
            [eta-mu.garden.shape.track :as track]))

(defn- normalize-key
  "Convert string keys (typically snake_case) into kebab-case keywords."
  [k]
  (if (keyword? k)
    k
    (-> (name k)
         (str/replace "_" "-")
         keyword)))

(defn- normalize-keys
  "Normalize all keys of a map to kebab-case keywords."
  [m]
  (into {} (map (fn [[k v]] [(normalize-key k) v])) m))

(defn- ->kw
  "Coerce a string or keyword to a keyword."
  [v]
  (cond
    (keyword? v) v
    (string? v) (keyword v)
    :else nil))

(defn- non-empty-string
  "Return a non-empty, trimmed string, or nil."
  [v]
  (when (string? v)
    (let [trimmed (str/trim v)]
      (when (pos? (count trimmed))
        trimmed))))

(defn- non-empty-string-vector
  "Return a vector of non-empty strings, or nil."
  [v]
  (when (coll? v)
    (vec (keep non-empty-string v))))

(defn normalize-track
  "Coerce a raw map into a `PlaylistTrackRef` record.

   Mirrors `normalizeTrack` from the legacy renderer: requires `path`,
   defaults `title` to `path`, drops malformed fields, and coerces booleans."
  [value]
  (when (map? value)
    (let [m (normalize-keys value)
          path (non-empty-string (:path m))
          title (or (non-empty-string (:title m)) path)]
      (when (and path title)
        (track/playlist-track-ref
         {:path path
          :title title
          :artist (non-empty-string (:artist m))
          :duration (when (host/finite-number? (:duration m))
                      (:duration m))
          :mime (non-empty-string (:mime m))
          :labels (non-empty-string-vector (:labels m))
          :description (non-empty-string (:description m))
          :source-url (non-empty-string (:source-url m))})))))

(defn normalize-block
  "Coerce a raw map into an internal `PublicationBlock` map, or nil.

   `index` supplies the fallback id suffix when no id is present."
  [value index]
  (when (map? value)
    (let [m (normalize-keys value)
          type (normalize-key (:type m))
          id (or (non-empty-string (:id m)) (str "block-" index))
          hidden (true? (:hidden m))]
      (case type
        :hero
        (when-let [title (non-empty-string (:title m))]
          {:id id
           :type :hero
           :hidden hidden
           :title title
           :subtitle (non-empty-string (:subtitle m))
           :image-path (non-empty-string (:image-path m))
           :audio-path (non-empty-string (:audio-path m))})

        :heading
        (when-let [text (non-empty-string (:text m))]
          (let [level (:level m)]
            {:id id
             :type :heading
             :hidden hidden
             :level (if (#{3 4} level) level 2)
             :text text}))

        :rich-text
        {:id id
         :type :rich-text
         :hidden hidden
         :markdown (or (non-empty-string (:markdown m)) "")}

        :callout
        (let [tone (->kw (:tone m))
              tone (if (#{:tip :warning :promo} tone) tone :note)]
          {:id id
           :type :callout
           :hidden hidden
           :tone tone
           :title (non-empty-string (:title m))
           :markdown (or (non-empty-string (:markdown m)) "")})

        :playlist
        (let [tracks (vec (keep normalize-track (:tracks m)))
              layout (->kw (:layout m))
              layout (if (#{:cards :broadcast} layout) layout :compact)]
          {:id id
           :type :playlist
           :hidden hidden
           :title (non-empty-string (:title m))
           :description (non-empty-string (:description m))
           :layout layout
           :tracks tracks
           :show-labels (true? (:show-labels m))
           :show-descriptions (true? (:show-descriptions m))
           :show-duration (true? (:show-duration m))})

        :track
        (when-let [track (normalize-track (:track m))]
          {:id id
           :type :track
           :hidden hidden
           :track track
           :commentary (non-empty-string (:commentary m))
           :show-player (not (false? (:show-player m)))})

        :divider
        {:id id :type :divider :hidden hidden}

        :cta
        (let [label (non-empty-string (:label m))
              href (non-empty-string (:href m))
              tone (->kw (:tone m))
              tone (if (= :secondary tone) :secondary :primary)]
          (when (and label href)
            {:id id
             :type :cta
             :hidden hidden
             :label label
             :href href
             :tone tone}))

        nil))))

(defn extract-publication-blocks
  "Extract and normalize visible publication blocks from metadata.

   Accepts either a CLJS map or a JavaScript object. Returns a vector of
   internal `PublicationBlock` maps, omitting hidden blocks."
  [metadata]
    (let [metadata (if (map? metadata) metadata (host/value->clj metadata))]
    (if (and (map? metadata) (coll? (:blocks metadata)))
      (vec (keep-indexed (fn [index raw]
                           (when-let [block (normalize-block raw index)]
                             (when-not (:hidden block)
                               block)))
                         (:blocks metadata)))
      [])))
