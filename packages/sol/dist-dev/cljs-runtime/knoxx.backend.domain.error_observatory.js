import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.error_observatory');
knoxx.backend.domain.error_observatory.err_prop = (function knoxx$backend$domain$error_observatory$err_prop(err,prop){
try{return (err[prop]);
}catch (e12358){var _ = e12358;
return null;
}});
knoxx.backend.domain.error_observatory.error_message = (function knoxx$backend$domain$error_observatory$error_message(err){
var or__5162__auto__ = (function (){var G__12364 = knoxx.backend.domain.error_observatory.err_prop(err,"message");
var G__12364__$1 = (((G__12364 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__12364)));
var G__12364__$2 = (((G__12364__$1 == null))?null:clojure.string.trim(G__12364__$1));
if((G__12364__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__12364__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__12373 = err;
var G__12373__$1 = (((G__12373 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__12373)));
var G__12373__$2 = (((G__12373__$1 == null))?null:clojure.string.trim(G__12373__$1));
if((G__12373__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__12373__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Unknown error";
}
}
});
knoxx.backend.domain.error_observatory.ex_data_safe = (function knoxx$backend$domain$error_observatory$ex_data_safe(err){
try{return cljs.core.ex_data(err);
}catch (e12375){var _ = e12375;
return null;
}});
knoxx.backend.domain.error_observatory.json_key = (function knoxx$backend$domain$error_observatory$json_key(k){
if((k instanceof cljs.core.Keyword)){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k)),(1));
} else {
if((k instanceof cljs.core.Symbol)){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k));
} else {
return k;

}
}
});
knoxx.backend.domain.error_observatory.preserve_map_keys = (function knoxx$backend$domain$error_observatory$preserve_map_keys(value){
if(cljs.core.map_QMARK_(value)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p__12382){
var vec__12383 = p__12382;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12383,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12383,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.error_observatory.json_key(k),(knoxx.backend.domain.error_observatory.preserve_map_keys.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.error_observatory.preserve_map_keys.cljs$core$IFn$_invoke$arity$1(v) : knoxx.backend.domain.error_observatory.preserve_map_keys.call(null,v))], null);
})),value);
} else {
if(cljs.core.sequential_QMARK_(value)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.error_observatory.preserve_map_keys,value);
} else {
return value;

}
}
});
knoxx.backend.domain.error_observatory.safe_json = (function knoxx$backend$domain$error_observatory$safe_json(value){
try{return JSON.stringify(cljs.core.clj__GT_js(knoxx.backend.domain.error_observatory.preserve_map_keys(value)),null,(2));
}catch (e12393){var _ = e12393;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
}});
/**
 * Normalize a thrown error into plain data suitable for logs, API responses, and
 * run-event receipts. Context must be intentionally small and secret-free.
 */
knoxx.backend.domain.error_observatory.error_data = (function knoxx$backend$domain$error_observatory$error_data(boundary,context,err){
var G__12399 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"failed","failed",-1397425762),true,new cljs.core.Keyword(null,"boundary","boundary",-2000996754),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(boundary)),new cljs.core.Keyword(null,"message","message",-406056002),knoxx.backend.domain.error_observatory.error_message(err),new cljs.core.Keyword(null,"context","context",-830191113),(function (){var or__5162__auto__ = context;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], null);
var G__12399__$1 = (cljs.core.truth_((function (){var G__12400 = knoxx.backend.domain.error_observatory.err_prop(err,"name");
var G__12400__$1 = (((G__12400 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__12400)));
var G__12400__$2 = (((G__12400__$1 == null))?null:clojure.string.trim(G__12400__$1));
if((G__12400__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__12400__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__12399,new cljs.core.Keyword(null,"name","name",1843675177),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.error_observatory.err_prop(err,"name")))):G__12399);
var G__12399__$2 = (cljs.core.truth_((function (){var G__12409 = knoxx.backend.domain.error_observatory.err_prop(err,"code");
var G__12409__$1 = (((G__12409 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__12409)));
var G__12409__$2 = (((G__12409__$1 == null))?null:clojure.string.trim(G__12409__$1));
if((G__12409__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__12409__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__12399__$1,new cljs.core.Keyword(null,"code","code",1586293142),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.error_observatory.err_prop(err,"code")))):G__12399__$1);
var G__12399__$3 = (cljs.core.truth_((function (){var G__12411 = (function (){var or__5162__auto__ = knoxx.backend.domain.error_observatory.err_prop(err,"status");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.error_observatory.err_prop(err,"statusCode");
}
})();
var G__12411__$1 = (((G__12411 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__12411)));
var G__12411__$2 = (((G__12411__$1 == null))?null:clojure.string.trim(G__12411__$1));
if((G__12411__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__12411__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__12399__$2,new cljs.core.Keyword(null,"status","status",-1997798413),(function (){var or__5162__auto__ = knoxx.backend.domain.error_observatory.err_prop(err,"status");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.error_observatory.err_prop(err,"statusCode");
}
})()):G__12399__$2);
var G__12399__$4 = (cljs.core.truth_((function (){var G__12415 = knoxx.backend.domain.error_observatory.err_prop(err,"stack");
var G__12415__$1 = (((G__12415 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__12415)));
var G__12415__$2 = (((G__12415__$1 == null))?null:clojure.string.trim(G__12415__$1));
if((G__12415__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__12415__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__12399__$3,new cljs.core.Keyword(null,"stack","stack",-793405930),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.error_observatory.err_prop(err,"stack")))):G__12399__$3);
if(cljs.core.truth_(knoxx.backend.domain.error_observatory.ex_data_safe(err))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__12399__$4,new cljs.core.Keyword(null,"data","data",-232669377),knoxx.backend.domain.error_observatory.ex_data_safe(err));
} else {
return G__12399__$4;
}
});
/**
 * Log an unexpected boundary failure once and return normalized failure data.
 */
knoxx.backend.domain.error_observatory.log_error_BANG_ = (function knoxx$backend$domain$error_observatory$log_error_BANG_(boundary,context,err){
var data = knoxx.backend.domain.error_observatory.error_data(boundary,context,err);
console.error("[knoxx.error]",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(boundary)),knoxx.backend.domain.error_observatory.safe_json(data));

var temp__5825__auto___12492 = new cljs.core.Keyword(null,"stack","stack",-793405930).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(temp__5825__auto___12492)){
var stack_12496 = temp__5825__auto___12492;
console.error("[knoxx.error.stack]",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(boundary)),"\n",stack_12496);
} else {
}

return data;
});
/**
 * Log an expected/degraded boundary outcome as structured data.
 */
knoxx.backend.domain.error_observatory.log_warning_BANG_ = (function knoxx$backend$domain$error_observatory$log_warning_BANG_(boundary,context){
var data = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"failed","failed",-1397425762),false,new cljs.core.Keyword(null,"boundary","boundary",-2000996754),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(boundary)),new cljs.core.Keyword(null,"context","context",-830191113),(function (){var or__5162__auto__ = context;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], null);
console.warn("[knoxx.warn]",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(boundary)),knoxx.backend.domain.error_observatory.safe_json(data));

return data;
});
knoxx.backend.domain.error_observatory.promise_like_QMARK_ = (function knoxx$backend$domain$error_observatory$promise_like_QMARK_(value){
var and__5160__auto__ = value;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.fn_QMARK_(knoxx.backend.domain.error_observatory.err_prop(value,"catch"));
} else {
return and__5160__auto__;
}
});
/**
 * Attach a central log sink to a background promise. Returns the original promise.
 * Use this when a callback is intentionally fire-and-forget.
 */
knoxx.backend.domain.error_observatory.observe_promise_BANG_ = (function knoxx$backend$domain$error_observatory$observe_promise_BANG_(boundary,context,promise){
if(cljs.core.truth_(knoxx.backend.domain.error_observatory.promise_like_QMARK_(promise))){
(async function (){
try{return (await promise);
}catch (e12441){var err = e12441;
knoxx.backend.domain.error_observatory.log_error_BANG_(boundary,context,err);

return null;
}})();
} else {
}

return promise;
});
/**
 * Call f at a boundary. Synchronous exceptions and async rejections are logged;
 * the callback result is returned so callers can still await/chain it.
 */
knoxx.backend.domain.error_observatory.call_observed_BANG_ = (function knoxx$backend$domain$error_observatory$call_observed_BANG_(boundary,context,f){
try{return knoxx.backend.domain.error_observatory.observe_promise_BANG_(boundary,context,(f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null)));
}catch (e12445){var err = e12445;
knoxx.backend.domain.error_observatory.log_error_BANG_(boundary,context,err);

return null;
}});

//# sourceMappingURL=knoxx.backend.domain.error_observatory.js.map
