import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.extern.js');
/**
 * Convert a CLJS map/vector tree to a plain JS value.
 */
knoxx.backend.extern.js.object = (function knoxx$backend$extern$js$object(value){
return cljs.core.clj__GT_js(value);
});
/**
 * Return a fresh empty JS object.
 */
knoxx.backend.extern.js.empty_object = (function knoxx$backend$extern$js$empty_object(){
return ({});
});
/**
 * Return a seq for a native JS array, or an empty vector for non-arrays.
 */
knoxx.backend.extern.js.js_array_seq = (function knoxx$backend$extern$js$js_array_seq(value){
if(cljs.core.truth_(cljs.core.array_QMARK_(value))){
return cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});

//# sourceMappingURL=knoxx.backend.extern.js.js.map
