(ns eta-mu.garden.shape.track
  (:require [clojure.string :as str]
            [eta-mu.garden.extern.js :as host]))

(defrecord StudioTrack [path name title artist ext duration labels description])
(defrecord PlaylistTrackRef [path title artist duration mime labels description source-url])

(defn studio-track
  "Construct a `StudioTrack` record from a map, defaulting absent fields to nil."
  [{:keys [path name title artist ext duration labels description]}]
  (when path
    (->StudioTrack path name title artist ext duration labels description)))

(defn playlist-track-ref
  "Construct a `PlaylistTrackRef` record from a map, requiring `path` and `title`."
  [{:keys [path title artist duration mime labels description source-url]}]
  (when (and path title)
    (->PlaylistTrackRef path title artist duration mime labels description source-url)))

(defn track-title
  "Resolve the display title for a track-like map.

   Mirrors the legacy precedence: title, name, basename of path, path."
  [track]
  (or (:title track)
      (:name track)
      (some-> (:path track) (str/split "/") last)
      (:path track)))

(def ^:private ext->icon
  {".mp3" "🎵"
   ".wav" "🔊"
   ".ogg" "🎶"
   ".flac" "🎼"
   ".m4a" "🎤"})

(defn file-icon
  "Return an emoji icon for an audio file extension."
  [ext]
  (get ext->icon ext "🎧"))

(defn audio-url-for-path
  "Build a streaming URL for an audio path.

   Optional `audio-url-base` defaults to `/api/studio/stream`."
  ([path]
   (audio-url-for-path path "/api/studio/stream"))
  ([path audio-url-base]
   (str audio-url-base "?path=" (host/encode-uri-component path))))

(defn studio-track->playlist-ref
  "Project a `StudioTrack` into a `PlaylistTrackRef` using the same title rules."
  [track]
  (when track
    (playlist-track-ref
     {:path (:path track)
      :title (track-title track)
      :artist (:artist track)
      :duration (:duration track)
      :labels (:labels track)
      :description (:description track)})))

(defn js->studio-track
  "Decode a JavaScript studio-track value into a `StudioTrack` record."
  [value]
  (some-> value host/value->clj studio-track))

(defn js->playlist-track-ref
  "Decode a JavaScript playlist-track-ref value into a `PlaylistTrackRef` record."
  [value]
  (some-> value host/value->clj playlist-track-ref))
