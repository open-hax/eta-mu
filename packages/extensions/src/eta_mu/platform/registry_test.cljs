(ns eta-mu.platform.registry-test
  "Tests for registry normalization, linking, and validation."
  (:require
   [cljs.test :refer [deftest is]]
   [eta-mu.platform.registry :as registry]))

(deftest normalize-plugin
  (let [spec {:ημ/kind :plugin
              :ημ/id :plugin/test
              :ημ/entries [{:ημ/kind :tool
                            :ημ/id :tool/research
                            :ημ/capability :capability/research}
                           {:ημ/kind :hook
                            :ημ/id :hook/audit
                            :ημ/event :tool.execute.after}]}]
    (is (= {:tools [{:ημ/kind :tool
                     :ημ/id :tool/research
                     :ημ/capability :capability/research}]
            :hooks [{:ημ/kind :hook
                     :ημ/id :hook/audit
                     :ημ/event :tool.execute.after}]}
           (registry/normalize-plugin spec)))))

(deftest link-capabilities
  (let [capability {:ημ/id :capability/research
                    :ημ/handler (fn [x] x)}
        registry {:tools [{:ημ/id :tool/research
                          :ημ/capability :capability/research}]}
        linked (registry/link-capabilities registry {:capability/research capability})]
    (is (= (:ημ/handler capability)
           (get-in linked [:tools 0 :ημ/handler])))))

(deftest link-capabilities-missing
  (is (thrown? js/Error
               (registry/link-capabilities
                {:tools [{:ημ/id :tool/research
                          :ημ/capability :capability/missing}]}
                {}))))

(deftest validate-duplicate-ids
  (is (thrown? js/Error
               (registry/validate!
                {:tools [{:ημ/id :tool/research}
                         {:ημ/id :tool/research}]})))
  (is (= {:tools [{:ημ/id :tool/research}]
          :hooks [{:ημ/id :hook/audit}]}
         (registry/validate!
          {:tools [{:ημ/id :tool/research}]
           :hooks [{:ημ/id :hook/audit}]}))))

(deftest compose-plugins
  (let [p1 {:ημ/kind :plugin
            :ημ/id :plugin/p1
            :ημ/entries [{:ημ/kind :tool :ημ/id :tool/a :ημ/capability :cap/a}]}
        p2 {:ημ/kind :plugin
            :ημ/id :plugin/p2
            :ημ/entries [{:ημ/kind :hook :ημ/id :hook/b :ημ/event :tool.execute.before}]}
        composed (registry/compose-plugins p1 p2)]
    (is (= 1 (count (:tools composed))))
    (is (= 1 (count (:hooks composed))))))
