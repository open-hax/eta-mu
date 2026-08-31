(ns rheos.backend.law.document-profile
  "Portable laws for the Markdown document-process adapter.

   Katamorph owns contract/resource meaning and Malli interpretation. Rheos owns
   only this adapter profile and the proposal/rejection payload it emits."
  (:require [malli.core :as m]
            [rheos.backend.law.markdown-document :as markdown-document]))

(def ReferenceId
  [:or :string :keyword])

(def ContractReference
  [:map {:closed true}
   [:contract/id ReferenceId]])

(def ResourceReference
  [:map {:closed true}
   [:resource/id ReferenceId]])

(def DocumentProfile
  [:map {:closed true}
   [:profile/id [:= :rheos/document-process-v1]]
   [:document/id :string]
   [:document/contract ContractReference]
   [:document/resource ResourceReference]
   [:document/schema ReferenceId]
   [:document/sidecar :string]])

(def ProcessSidecar
  [:map {:closed false}
   [:process/schemas [:map-of ReferenceId :any]]
   [:process/value :map]
   [:process/contracts {:optional true} [:vector ContractReference]]
   [:process/resources {:optional true} [:vector ResourceReference]]])

(def AssembledDocument
  [:map {:closed true}
   [:document/profile DocumentProfile]
   [:document/source-path :string]
   [:document/sidecar-path :string]
   [:document/frontmatter-decoding markdown-document/FrontmatterDecoding]
   [:document/body :string]
   [:document/contracts [:vector ContractReference]]
   [:document/resources [:vector ResourceReference]]
   [:document/schema ReferenceId]
   [:document/schema-form :any]
   [:document/value :map]])

(def EventError
  [:map {:closed false}
   [:error/code :keyword]
   [:error/message :string]
   [:error/path {:optional true} [:vector :any]]])

(def Sha256
  [:re #"^[0-9a-f]{64}$"])

(def ProposalPayload
  [:map {:closed true}
   [:type [:= "document-file-change-proposed"]]
   [:change/kind [:enum "add" "change"]]
   [:content/sha256 Sha256]
   [:document AssembledDocument]])

(def RejectionPayload
  [:map {:closed true}
   [:type [:= "document-file-change-rejected"]]
   [:change/kind [:enum "add" "change"]]
   [:content/sha256 {:optional true} Sha256]
   [:document/source-path :string]
   [:document/sidecar-path {:optional true} :string]
   [:document/frontmatter-decoding markdown-document/FrontmatterDecoding]
   [:document/profile {:optional true} DocumentProfile]
   [:errors [:vector EventError]]])

(def ProposalEvent
  [:map {:closed false}
   [:event/type [:= "rheos.document.file-change-proposed"]]
   [:event/id :string]
   [:event/time :string]
   [:session/id :string]
   [:delivery/mode [:= "tell"]]
   [:payload ProposalPayload]])

(def RejectionEvent
  [:map {:closed false}
   [:event/type [:= "rheos.document.file-change-rejected"]]
   [:event/id :string]
   [:event/time :string]
   [:session/id :string]
   [:delivery/mode [:= "tell"]]
   [:payload RejectionPayload]])

(def DocumentFileEvent
  [:or ProposalEvent RejectionEvent])

(defn valid-profile? [profile]
  (m/validate DocumentProfile profile))

(defn valid-sidecar? [sidecar]
  (m/validate ProcessSidecar sidecar))

(defn valid-assembled-document? [document]
  (m/validate AssembledDocument document))

(defn valid-event? [event]
  (m/validate DocumentFileEvent event))
