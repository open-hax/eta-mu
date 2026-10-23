;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.law.sandbox
  "Trusted strict effect policy. Static native tool advertisements are not grants.")

(def version "bubblewrap 0.9.0")
(def settings {:toolPermission "strict" :allowNonWorkspaceAccess false
               :permissions {:allow [] :ask []
                             :deny ["command(*)" "read_file(*)" "write_file(*)"
                                    "read_url(*)" "execute_url(*)" "mcp(*)"]}
               :useG1Credits false})
(defn settings? [candidate] (= settings candidate))
