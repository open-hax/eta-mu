import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.extern.promise');
/**
 * Promise.all for a CLJS collection of promises. Returns a JS Promise whose
 * resolution value is the native JS array produced by Promise.all.
 */
knoxx.backend.extern.promise.all = (function knoxx$backend$extern$promise$all(promises){
return Promise.all(cljs.core.clj__GT_js(cljs.core.vec(promises)));
});
/**
 * Promise.all for a CLJS collection of promises. Resolves to a CLJS vector.
 */
knoxx.backend.extern.promise.all_vec = (async function knoxx$backend$extern$promise$all_vec(promises){
var values = (await knoxx.backend.extern.promise.all(promises));
if(cljs.core.truth_(cljs.core.array_QMARK_(values))){
return cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(values));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
/**
 * Return a Promise that rejects with an Error after timeout-ms.
 */
knoxx.backend.extern.promise.reject_after = (function knoxx$backend$extern$promise$reject_after(timeout_ms,message){
return (new Promise((function (_resolve,reject){
return setTimeout((function (){
var G__25579 = (new Error(message));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__25579) : reject.call(null,G__25579));
}),timeout_ms);
})));
});
/**
 * Promise.race for a CLJS collection of promises.
 */
knoxx.backend.extern.promise.race = (function knoxx$backend$extern$promise$race(promises){
return Promise.race(cljs.core.clj__GT_js(cljs.core.vec(promises)));
});

//# sourceMappingURL=knoxx.backend.extern.promise.js.map
