(ns eta-mu.garden.law.publication
  (:require [malli.core :as m]))

(def studio-track-schema
  [:map {:closed false}
   [:path [:string {:min 1}]]
   [:name {:optional true} [:maybe [:string {:min 1}]]]
   [:title {:optional true} [:maybe [:string {:min 1}]]]
   [:artist {:optional true} [:maybe [:string {:min 1}]]]
   [:ext {:optional true} [:maybe [:string {:min 1}]]]
   [:duration {:optional true} [:maybe number?]]
   [:labels {:optional true} [:maybe [:vector [:string {:min 1}]]]]
   [:description {:optional true} [:maybe [:string {:min 1}]]]])

(def music-player-permissions-schema
  [:map {:closed false}
   [:can-go-previous {:optional true} [:maybe boolean?]]
   [:can-play-pause {:optional true} [:maybe boolean?]]
   [:can-go-next {:optional true} [:maybe boolean?]]
   [:can-edit-labels {:optional true} [:maybe boolean?]]
   [:can-adjust-volume {:optional true} [:maybe boolean?]]
   [:can-generate-assets {:optional true} [:maybe boolean?]]
   [:can-remove-from-queue {:optional true} [:maybe boolean?]]])

(def playlist-track-ref-schema
  [:map {:closed false}
   [:path [:string {:min 1}]]
   [:title [:string {:min 1}]]
   [:artist {:optional true} [:maybe [:string {:min 1}]]]
   [:duration {:optional true} [:maybe number?]]
   [:mime {:optional true} [:maybe [:string {:min 1}]]]
   [:labels {:optional true} [:maybe [:vector [:string {:min 1}]]]]
   [:description {:optional true} [:maybe [:string {:min 1}]]]
   [:source-url {:optional true} [:maybe [:string {:min 1}]]]])

(def base-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type keyword?]
   [:hidden {:optional true} [:maybe boolean?]]])

(def hero-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :hero]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:title [:string {:min 1}]]
   [:subtitle {:optional true} [:maybe [:string {:min 1}]]]
   [:image-path {:optional true} [:maybe [:string {:min 1}]]]
   [:audio-path {:optional true} [:maybe [:string {:min 1}]]]])

(def heading-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :heading]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:level [:enum 2 3 4]]
   [:text [:string {:min 1}]]])

(def rich-text-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :rich-text]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:markdown string?]])

(def callout-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :callout]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:tone [:enum :note :tip :warning :promo]]
   [:title {:optional true} [:maybe [:string {:min 1}]]]
   [:markdown string?]])

(def playlist-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :playlist]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:title {:optional true} [:maybe [:string {:min 1}]]]
   [:description {:optional true} [:maybe [:string {:min 1}]]]
   [:layout [:enum :compact :cards :broadcast]]
   [:tracks [:vector playlist-track-ref-schema]]
   [:show-labels {:optional true} [:maybe boolean?]]
   [:show-descriptions {:optional true} [:maybe boolean?]]
   [:show-duration {:optional true} [:maybe boolean?]]])

(def track-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :track]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:track playlist-track-ref-schema]
   [:commentary {:optional true} [:maybe [:string {:min 1}]]]
   [:show-player {:optional true} [:maybe boolean?]]])

(def divider-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :divider]]
   [:hidden {:optional true} [:maybe boolean?]]])

(def cta-block-schema
  [:map {:closed false}
   [:id [:string {:min 1}]]
   [:type [:= :cta]]
   [:hidden {:optional true} [:maybe boolean?]]
   [:label [:string {:min 1}]]
   [:href [:string {:min 1}]]
   [:tone {:optional true} [:maybe [:enum :primary :secondary]]]])

(def publication-block-schema
  [:or
   hero-block-schema
   heading-block-schema
   rich-text-block-schema
   callout-block-schema
   playlist-block-schema
   track-block-schema
   divider-block-schema
   cta-block-schema])

(def publication-blocks-renderer-props-schema
  [:map {:closed false}
   [:blocks [:vector publication-block-schema]]
   [:get-audio-url {:optional true} [:maybe ifn?]]
   [:max-initial-playlist-tracks {:optional true} [:maybe number?]]])

(defn valid-studio-track?
  "Return true when `value` satisfies the `StudioTrack` schema."
  [value]
  (m/validate studio-track-schema value))

(defn valid-music-player-permissions?
  "Return true when `value` satisfies the `MusicPlayerPermissions` schema."
  [value]
  (m/validate music-player-permissions-schema value))

(defn valid-playlist-track-ref?
  "Return true when `value` satisfies the `PlaylistTrackRef` schema."
  [value]
  (m/validate playlist-track-ref-schema value))

(defn valid-publication-block?
  "Return true when `value` satisfies the `PublicationBlock` union schema."
  [value]
  (m/validate publication-block-schema value))

(defn valid-publication-blocks-renderer-props?
  "Return true when `value` satisfies the `PublicationBlocksRenderer` props schema."
  [value]
  (m/validate publication-blocks-renderer-props-schema value))
