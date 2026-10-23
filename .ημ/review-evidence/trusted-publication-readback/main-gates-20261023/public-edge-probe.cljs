(ns public-edge-probe
  (:require [eta-mu.infra.review-readback :as readback]
            [eta-mu.extern.review-collection :as host]
            [eta-mu.shape.review-readback :as shape]
            [nbb.core :as nbb]
            ["node:fs" :as fs]))
(def directory ".ημ/review-evidence/trusted-publication-readback/main-gates-20261023/")
(defn save [label value] (.writeFileSync fs (str directory label ".edn") (str (pr-str value) "\n")))
(defn ^:async probe []
  (let [calls (atom [])
        refusal (await (with-redefs [host/get! (fn [request] (swap! calls conj request) (throw (ex-info "Unexpected GET" {})))]
                         (readback/readback! {:registry {:forged true}})))]
    (save "production-refusal" {:result refusal :get-calls @calls})
    (assert (= {:status :refused :reason :registry :qualification :unsupported :effects []} refusal))
    (assert (empty? @calls))
    (println "PASS fixed production registry refuses caller override before any GET"))
  (let [routes [["native-review" "https://api.github.com/repos/open-hax/eta-mu/pulls/362/reviews/5609238437"]
                ["native-comments-page1" "https://api.github.com/repos/open-hax/eta-mu/pulls/362/reviews/5609238437/comments?per_page=100&page=1"]
                ["native-statuses-page1" "https://api.github.com/repos/open-hax/eta-mu/commits/f299bd6159b9fc32b11922a119464018f9643134/statuses?per_page=100&page=1"]]]
    (loop [remaining routes]
      (when-let [[label url] (first remaining)]
        (let [response (try (await (host/get! {:method :get :url url :timeout-ms 5000 :max-bytes 2000000}))
                            (catch :default e {:status :refused :reason (ex-data e)}))]
          (save label response)
          (assert (= :ok (:status response)) (pr-str response))
          (println "PASS actual public fixed GET" label "bytes" (:bytes response) "next" (:next-url response))
          (when (= label "native-review")
            (let [identity (shape/native-identity (:data response) :user)]
              (save "native-review-identity" identity)
              (assert (= :unsupported (:installation-association identity)))
              (when (not (contains? (:data response) :performed_via_github_app))
                (assert (= :missing (:app-state identity)))
                (assert (nil? (:publisher identity))))))
          (recur (next remaining))))))
  (println "PASS public edge observations only; page1 is not complete traversal, no native publication/authentication/full-readback qualification"))
(nbb/await (probe))
