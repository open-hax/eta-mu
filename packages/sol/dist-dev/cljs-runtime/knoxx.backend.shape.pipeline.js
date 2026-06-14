import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.shape.pipeline');
/**
 * Return pipeline steps in dependency order.
 * 
 * This preserves the existing contract used by the runner: steps with fewer
 * declared dependencies run first, and otherwise retain the sort order provided
 * by ClojureScript's stable sort for equal dependency counts.
 */
knoxx.backend.shape.pipeline.dependency_order = (function knoxx$backend$shape$pipeline$dependency_order(steps){
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p1__35400_SHARP_){
return cljs.core.count((function (){var or__5162__auto__ = new cljs.core.Keyword("step","depends-on","step/depends-on",-1452243794).cljs$core$IFn$_invoke$arity$1(p1__35400_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
}),steps));
});
/**
 * Replace {{memory.temp:k}} placeholders in a scalar value from a key/value map.
 */
knoxx.backend.shape.pipeline.interpolate_value = (function knoxx$backend$shape$pipeline$interpolate_value(value,k__GT_v){
if(((typeof value === 'string') && (clojure.string.includes_QMARK_(value,"{{memory.temp:")))){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (s,k){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(k__GT_v,k);
if(cljs.core.truth_(temp__5823__auto__)){
var v = temp__5823__auto__;
return clojure.string.replace(s,(""+"{{memory.temp:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k)+"}}"),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)));
} else {
return s;
}
}),value,cljs.core.keys(k__GT_v));
} else {
return value;
}
});
/**
 * Interpolate all {{memory.temp:}} placeholders in a nested map.
 */
knoxx.backend.shape.pipeline.interpolate_map = (function knoxx$backend$shape$pipeline$interpolate_map(m,k__GT_v){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__35432){
var vec__35433 = p__35432;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__35433,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__35433,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,((cljs.core.map_QMARK_(v))?(knoxx.backend.shape.pipeline.interpolate_map.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.shape.pipeline.interpolate_map.cljs$core$IFn$_invoke$arity$2(v,k__GT_v) : knoxx.backend.shape.pipeline.interpolate_map.call(null,v,k__GT_v)):knoxx.backend.shape.pipeline.interpolate_value(v,k__GT_v))], null);
}),m));
});

//# sourceMappingURL=knoxx.backend.shape.pipeline.js.map
