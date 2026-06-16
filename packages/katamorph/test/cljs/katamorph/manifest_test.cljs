(ns katamorph.manifest-test
  "Tests for the resource manifest grammar — the core of 'data as interpreter'."
  (:require [cljs.test :refer [deftest is testing]]
            [katamorph.manifest :as m]))

;; A composite entry like the ussyverse social-replies resource: it REGISTERS a
;; trigger and a store, and carries an ANONYMOUS action facet (:action/* keys
;; with no :action/id).
(def ussyverse-file
  {:namespace :ussyverse
   :resources
   [{:trigger/id :social-replies
     :trigger/listener "discord_automation"
     :trigger/events [:discord.message]
     :trigger/action :actions/start-agent-session
     :trigger/with {:agent-id "ussyverse_social_replies"}
     :action/scope {:actions [:actions/start-agent-session]
                    :stores [:ussyverse/observed-messages]}
     :store/id :observed-messages
     :store/schema [:map [:message-id :string]]}]})

(defn- def-of [defs kind]
  (some #(when (= kind (:resource/kind %)) (:resource/definition %)) defs))

(deftest namespace-file?-test
  (is (m/namespace-file? ussyverse-file))
  (is (not (m/namespace-file? {:foo 1})))
  (is (not (m/namespace-file? {:namespace :x})) "needs :resources")
  (is (not (m/namespace-file? "nope"))))

(deftest qualified-id-test
  (is (= :ussyverse/social-replies (m/qualified-id :ussyverse :social-replies)))
  (is (= "ussyverse/social-replies" (m/qualified-id-str :ussyverse :social-replies)))
  (is (= :ussyverse/x (m/qualified-id :ussyverse "x")) "string local ids work")
  (is (nil? (m/qualified-id :ussyverse nil))))

(deftest entry-kinds-test
  (testing "registers only kinds whose :K/id key is present, in grammar order"
    (is (= [:trigger :store] (m/entry-kinds (first (:resources ussyverse-file))))))
  (is (= [] (m/entry-kinds {:action/scope {}})) "no :K/id keys → registers nothing"))

(deftest facet-and-anonymous-test
  (let [entry (first (:resources ussyverse-file))]
    (testing "facet-kinds covers every kind the entry speaks about"
      (is (= #{:trigger :action :store} (set (m/facet-kinds entry)))))
    (testing "anonymous facets = spoken-about but not registered"
      (is (= [:action] (m/anonymous-facets entry))))))

(deftest namespace-file-definitions-test
  (let [defs (m/namespace-file-definitions ussyverse-file)]
    (testing "one definition per registered kind"
      (is (= 2 (count defs)))
      (is (= #{:trigger :store} (set (map :resource/kind defs)))))
    (testing "trigger definition carries identity, default :trigger/kind, anonymous facets"
      (let [t (def-of defs :trigger)]
        (is (= :trigger (:contract/kind t)))
        (is (= "ussyverse/social-replies" (:contract/id t)))
        (is (= :ussyverse/social-replies (:resource/qualified-id t)))
        (is (= :event (:trigger/kind t)) "trigger kind defaults to :event")
        (is (= [:action] (:resource/anonymous-facets t)))
        (is (= :actions/start-agent-session (:trigger/action t)) "original keys preserved")))
    (testing "store definition is its own resource with its own identity"
      (let [s (def-of defs :store)]
        (is (= :store (:contract/kind s)))
        (is (= "ussyverse/observed-messages" (:contract/id s)))
        (is (nil? (:trigger/kind s)) "store does not get the trigger default")))))
