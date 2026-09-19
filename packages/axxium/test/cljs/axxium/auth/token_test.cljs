(ns axxium.auth.token-test
  (:require [axxium.auth.token :as token]
            [axxium.config :as cfg]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]))

(def test-config
  {:jwt/secret "legacy-token-test-secret-with-sufficient-length"
   :jwt/issuer "axxium-test"
   :jwt/audience "downstream-test"
   :jwt/expiry-hours 2})

(deftest ^:async legacy-token-signature-and-claims-test
  (with-redefs [cfg/config test-config]
    (doseq [actor [{:id "actor.test" :entity_id "entity.test"
                   :email "actor@example.test" :capabilities ["article/write"]
                   :roles ["editor"] :status "active"}
                  {:actor/id "actor.test" :actor/entity-id "entity.test"
                   :actor/email "actor@example.test" :actor/capabilities ["article/write"]
                   :actor/roles ["editor"] :actor/status "active"}]]
      (let [signed (await (token/create-token actor))
            claims (await (token/verify-token signed))]
        (is (string? signed))
        (is (= {:sub "actor.test" :entity-id "entity.test" :email "actor@example.test"
                :capabilities ["article/write"] :roles ["editor"] :status "active"
                :iss "axxium-test" :aud "downstream-test"}
               (dissoc claims :iat :exp)))
        (is (= 7200 (- (:exp claims) (:iat claims))))
        (let [[header payload signature] (str/split signed #"\.")
              tampered (str header "." payload "."
                            (if (str/starts-with? signature "A") "B" "A")
                            (subs signature 1))]
          (try
            (await (token/verify-token tampered))
            (is false "changed signature must be refused")
            (catch :default _ (is true))))))))

(deftest ^:async legacy-token-issuer-audience-and-expiry-test
  (let [signed (with-redefs [cfg/config test-config]
                 (await (token/create-token {:id "actor.test"})))]
    (doseq [changed [(assoc test-config :jwt/issuer "different-issuer")
                     (assoc test-config :jwt/audience "different-audience")
                     (assoc test-config :jwt/secret "different-key-with-sufficient-length")]]
      (with-redefs [cfg/config changed]
        (try
          (await (token/verify-token signed))
          (is false "verification must enforce the configured authority")
          (catch :default _ (is true)))))
    (let [expired (with-redefs [cfg/config (assoc test-config :jwt/expiry-hours -1)]
                    (await (token/create-token {:id "actor.test"})))]
      (with-redefs [cfg/config test-config]
        (try
          (await (token/verify-token expired))
          (is false "expired JWT must be refused")
          (catch :default _ (is true)))))))
