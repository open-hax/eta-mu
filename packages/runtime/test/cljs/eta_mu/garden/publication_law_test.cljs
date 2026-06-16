(ns eta-mu.garden.publication-law-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.garden.law.publication :as law]
            [eta-mu.garden.shape.block :as block]
            [eta-mu.garden.shape.track :as track]))

(def valid-studio-track
  {:path "/audio/track.mp3"
   :name "track"
   :title "Track Title"
   :artist "Artist"
   :ext ".mp3"
   :duration 185.5
   :labels ["vocal" "demo"]
   :description "A description"})

(def valid-playlist-track
  {:path "/audio/playlist-track.wav"
   :title "Playlist Track"
   :artist "Band"
   :duration 120
   :labels ["live"]
   :source-url "https://example.com/track"})

(deftest studio-track-schema-test
  (testing "valid studio tracks are accepted"
    (is (law/valid-studio-track? valid-studio-track))
    (is (law/valid-studio-track? (track/studio-track valid-studio-track)))
    (is (law/valid-studio-track? {:path "/audio/minimal.ogg"})))

  (testing "malformed studio tracks are rejected"
    (is (not (law/valid-studio-track? {})))
    (is (not (law/valid-studio-track? {:path ""})))
    (is (not (law/valid-studio-track? {:path "/x" :duration "long"})))))

(deftest music-player-permissions-schema-test
  (testing "valid permissions are accepted"
    (is (law/valid-music-player-permissions? {}))
    (is (law/valid-music-player-permissions?
         {:can-go-previous true
          :can-play-pause false
          :can-go-next true
          :can-edit-labels false
          :can-adjust-volume true
          :can-generate-assets false
          :can-remove-from-queue true})))

  (testing "non-boolean permission values are rejected"
    (is (not (law/valid-music-player-permissions? {:can-play-pause "yes"})))))

(deftest playlist-track-ref-schema-test
  (testing "valid track refs are accepted"
    (is (law/valid-playlist-track-ref? valid-playlist-track))
    (is (law/valid-playlist-track-ref? (track/playlist-track-ref valid-playlist-track))))

  (testing "track refs require path and title"
    (is (not (law/valid-playlist-track-ref? {})))
    (is (not (law/valid-playlist-track-ref? {:path "/x"})))
    (is (not (law/valid-playlist-track-ref? {:title "x"})))))

(deftest publication-block-union-test
  (testing "all block subtypes are accepted by the union schema"
    (let [blocks [{:id "b1" :type :hero :title "Hero"}
                  {:id "b2" :type :heading :level 3 :text "Heading"}
                  {:id "b3" :type :rich-text :markdown "Some **markdown**."}
                  {:id "b4" :type :callout :tone :tip :markdown "Tip"}
                  {:id "b5" :type :playlist
                   :layout :broadcast
                   :tracks [valid-playlist-track]}
                  {:id "b6" :type :track :track valid-playlist-track}
                  {:id "b7" :type :divider}
                  {:id "b8" :type :cta :label "Click" :href "/target"}]]
      (is (every? law/valid-publication-block? blocks))
      (is (= (count blocks)
             (count (filter law/valid-publication-block? blocks))))))

  (testing "malformed blocks are rejected"
    (is (not (law/valid-publication-block? {:id "x" :type :heading :level 5 :text "Bad"})))
    (is (not (law/valid-publication-block? {:id "x" :type :hero})))
    (is (not (law/valid-publication-block? {:id "x" :type :playlist :layout :unknown :tracks []})))
    (is (not (law/valid-publication-block? {:id "x" :type :track :track {}})))
    (is (not (law/valid-publication-block? {:id "x" :type :cta :label "" :href ""})))))

(deftest publication-blocks-renderer-props-test
  (testing "valid renderer props are accepted"
    (is (law/valid-publication-blocks-renderer-props?
         {:blocks [{:id "b1" :type :heading :level 2 :text "Hello"}]
          :get-audio-url (fn [path] (str "/audio?path=" path))
          :max-initial-playlist-tracks 10}))
    (is (law/valid-publication-blocks-renderer-props?
         {:blocks []})))

  (testing "malformed renderer props are rejected"
    (is (not (law/valid-publication-blocks-renderer-props?
              {:blocks [{:id "x" :type :unknown}]})))
    (is (not (law/valid-publication-blocks-renderer-props?
              {:blocks [{:id "x" :type :hero}]
               :max-initial-playlist-tracks "all"})))))

(deftest normalize-track-test
  (testing "normalize-track coerces and defaults fields"
    (let [track (block/normalize-track
                 {"path" "/audio/a.mp3"
                  "title" "  Title  "
                  "artist" "Artist"
                  "duration" 100
                  "labels" ["  x  " "  " "y"]
                  "description" "Desc"
                  "source_url" "https://x"})]
      (is (some? track))
      (is (= "/audio/a.mp3" (:path track)))
      (is (= "Title" (:title track)))
      (is (= ["x" "y"] (:labels track)))
      (is (record? track))))

  (testing "normalize-track falls back title to path and rejects invalid input"
    (let [track (block/normalize-track {"path" "/audio/b.mp3"})]
      (is (= "/audio/b.mp3" (:title track))))
    (is (nil? (block/normalize-track {})))
    (is (nil? (block/normalize-track {"path" ""})))
    (is (nil? (block/normalize-track "not a map")))))

(deftest normalize-block-test
  (testing "normalize-block produces schema-valid blocks from raw maps"
    (let [hero (block/normalize-block {"type" "hero" "id" "h1" "title" "Hero"} 0)
          heading (block/normalize-block {"type" "heading" "text" "Hi"} 1)
          cta (block/normalize-block {"type" "cta" "label" "Go" "href" "/go" "tone" "secondary"} 2)]
      (is (law/valid-publication-block? hero))
      (is (= :hero (:type hero)))
      (is (= "block-1" (:id heading)))
      (is (= 2 (:level heading)))
      (is (= :secondary (:tone cta)))))

  (testing "normalize-block handles every block kind with defaults"
    (let [blocks [(block/normalize-block {"type" "rich_text" "id" "rt"} 0)
                  (block/normalize-block {"type" "callout" "id" "co" "tone" "warning"} 1)
                  (block/normalize-block {"type" "divider" "id" "d"} 2)
                  (block/normalize-block {"type" "playlist" "id" "pl" "tracks" []} 3)
                  (block/normalize-block {"type" "track" "id" "tr" "track" valid-playlist-track} 4)]]
      (is (every? law/valid-publication-block? blocks))
      (is (= "" (:markdown (first blocks))))
      (is (= :warning (:tone (second blocks))))
      (is (= :compact (:layout (nth blocks 3))))
      (is (true? (:show-player (nth blocks 4)))))))

(deftest extract-publication-blocks-test
  (testing "extract-publication-blocks normalizes visible blocks from JS metadata"
    (let [blocks (block/extract-publication-blocks
                  #js {:blocks #js [#js {"type" "hero" "title" "H" "hidden" false}
                                    #js {"type" "heading" "text" "T"}
                                    #js {"type" "unknown" "id" "skip"}
                                    #js {"type" "divider" "id" "d" "hidden" true}]
                       :extra "ignored"})]
      (is (= 2 (count blocks)))
      (is (= [:hero :heading] (mapv :type blocks)))
      (is (every? law/valid-publication-block? blocks))))

  (testing "extract-publication-blocks is defensive with bad input"
    (is (= [] (block/extract-publication-blocks nil)))
    (is (= [] (block/extract-publication-blocks {})))
    (is (= [] (block/extract-publication-blocks "string")))))

(deftest track-view-model-test
  (testing "track-title follows the legacy precedence"
    (is (= "Title" (track/track-title {:path "/x" :name "Name" :title "Title"})))
    (is (= "Name" (track/track-title {:path "/x" :name "Name"})))
    (is (= "x" (track/track-title {:path "/a/x"})))
    (is (= "" (track/track-title {:path "/a/x" :name ""}))))

  (testing "file-icon maps known extensions and defaults"
    (is (= "🎵" (track/file-icon ".mp3")))
    (is (= "🔊" (track/file-icon ".wav")))
    (is (= "🎧" (track/file-icon ".xyz"))))

  (testing "audio-url-for-path encodes the path"
    (is (= "/api/studio/stream?path=%2Faudio%2Ftrack%20a.mp3"
           (track/audio-url-for-path "/audio/track a.mp3")))
    (is (= "https://cdn.example/stream?path=%2Fx"
           (track/audio-url-for-path "/x" "https://cdn.example/stream")))))

(deftest shape-to-law-roundtrip-test
  (testing "normalized blocks and tracks satisfy law schemas"
    (let [external {"type" "playlist"
                    "id" "pl-1"
                    "title" "Mix"
                    "layout" "cards"
                    "tracks" [{"path" "/audio/one.mp3" "title" "One"}
                              {"path" "/audio/two.mp3" "title" ""}
                              {"path" "" "title" "Three"}]
                    "show_labels" true}
          block (block/normalize-block external 0)]
      (is (law/valid-publication-block? block))
      (is (= 2 (count (:tracks block))))
      (is (true? (:show-labels block)))
      (is (law/valid-playlist-track-ref? (first (:tracks block)))))))
