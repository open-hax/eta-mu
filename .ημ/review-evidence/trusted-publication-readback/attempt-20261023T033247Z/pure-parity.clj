(require '[eta-mu.law.review-readback :as law]
         '[eta-mu.shape.review-readback :as shape]
         '[eta-mu.domain.review-readback :as domain])
(def head (apply str (repeat 40 "a")))
(def actor {:id 7 :login "inert[bot]" :type "Bot"})
(def comment {:id 3 :pull_request_review_id 2 :commit_id head :user actor
              :path "a.cljc" :line 4 :side "RIGHT" :body "exact"})
(def review (shape/review {:id 2 :commit_id head :user actor :state "COMMENTED"
                           :body "review" :html_url "https://example.invalid/review/2"}
                          [comment] 100))
(def tuple {:pr-number 1 :head-sha head :merge-sha head})
(def binding {:tuple tuple :publisher {:app-id 3152464 :actor {:id 7 :login "inert[bot]" :type :bot}}
              :publication-payload {:event "COMMENT" :body "review"
                                    :comments [{:path "a.cljc" :line 4 :side "RIGHT" :body "exact"}]}})
(def intent {:review-id 2 :receipt-url "https://example.invalid/review/2"})
(def native {:tuple {:before tuple :after tuple} :review review :history {:statuses []}})
(def cases
  [(law/native-time? 100 101)
   (law/same-tuple? tuple tuple)
   (shape/native-identity {:user actor} :user)
   (shape/native-identity {:user actor :performed_via_github_app {:id 42}} :user)
   (shape/inline-comment (assoc comment :line nil :original_line 4))
   (shape/inline-comment (assoc comment :start_line 1))
   (domain/assess 200 binding intent native)
   (domain/assess 200 binding intent (assoc-in native [:review :comments 0 :payload :body] "forged"))])
(assert (= :observed (:status (nth cases 6))))
(assert (= :unsupported (:qualification (nth cases 6))))
(assert (= :refused (:status (nth cases 7))))
(println (pr-str cases))
