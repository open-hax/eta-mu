import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.extern.json');
/**
 * Convert a JS value tree to CLJS data with keywordized map keys.
 * Existing CLJS maps/vectors are returned in equivalent CLJS form.
 */
knoxx.backend.extern.json.to_cljs = (function knoxx$backend$extern$json$to_cljs(value){
if((value == null)){
return null;
} else {
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(cljs.core.vector_QMARK_(value)){
return value;
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
}
});
/**
 * Parse a JSON object string into a CLJS map. Returns nil for invalid JSON or
 * non-object values. CLJS maps pass through unchanged.
 */
knoxx.backend.extern.json.parse_object = (function knoxx$backend$extern$json$parse_object(value){
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(typeof value === 'string'){
try{var parsed = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(value),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(cljs.core.map_QMARK_(parsed)){
return parsed;
} else {
return null;
}
}catch (e25770){var _ = e25770;
return null;
}} else {
return null;

}
}
});
/**
 * Stringify a CLJS value for a JSON request body.
 */
knoxx.backend.extern.json.stringify = (function knoxx$backend$extern$json$stringify(value){
return JSON.stringify(cljs.core.clj__GT_js(value));
});

//# sourceMappingURL=knoxx.backend.extern.json.js.map
