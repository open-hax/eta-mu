(ns eta-mu.gitops-controller.extern.uri-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.uri :as uri]))

(deftest components-are-encoded-at-the-host-boundary
  (is (= "heads%2Ffeature%20branch"
         (uri/encode-component "heads/feature branch"))))

(deftest api-roots-require-https-and-no-embedded-request-or-credential-data
  (doseq [url ["http://api.github.test" "file:///tmp/github"
               "https://operator:secret@api.github.test"
               "https://api.github.test?token=secret"
               "https://api.github.test/#fragment" "not a URL" nil]]
    (let [error (try (uri/github-api-url! url)
                     nil
                     (catch :default value value))]
      (is (= :invalid-github-api-url (:error/code (ex-data error))))
      (is (= "ETA_MU_GITHUB_API_URL" (:field (ex-data error))))))
  (is (= "https://api.github.test"
         (uri/github-api-url! "https://api.github.test/")))
  (is (= "https://github.enterprise.test/api/v3"
         (uri/github-api-url! "https://github.enterprise.test/api/v3/")))
  (is (= "https://api.github.test/graphql"
         (uri/github-graphql-url "https://api.github.test")))
  (is (= "https://github.enterprise.test/api/graphql"
         (uri/github-graphql-url "https://github.enterprise.test/api/v3"))))
