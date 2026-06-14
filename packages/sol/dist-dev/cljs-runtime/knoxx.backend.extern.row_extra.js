import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.extern.json.js";
goog.provide('knoxx.backend.extern.row_extra');
/**
 * Parse row :extra metadata into a CLJS keyword map.
 * 
 * - CLJS maps pass through unchanged.
 * - JSON object strings decode to keyword maps.
 * - Invalid JSON, nil, and non-object JSON return nil.
 */
knoxx.backend.extern.row_extra.parse_row_extra = (function knoxx$backend$extern$row_extra$parse_row_extra(value){
return knoxx.backend.extern.json.parse_object(value);
});
knoxx.backend.extern.row_extra.parse_session_title_extra = (function knoxx$backend$extern$row_extra$parse_session_title_extra(value){
return knoxx.backend.extern.row_extra.parse_row_extra(value);
});
knoxx.backend.extern.row_extra.parse_core_memory_extra = (function knoxx$backend$extern$row_extra$parse_core_memory_extra(value){
return knoxx.backend.extern.row_extra.parse_row_extra(value);
});

//# sourceMappingURL=knoxx.backend.extern.row_extra.js.map
