import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.stores.session_store_registry.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.shape.session_persistence.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.stores.session_flush');
knoxx.backend.infra.stores.session_flush.DEFAULT_INACTIVE_THRESHOLD_MS = ((((12) * (60)) * (60)) * (1000));
knoxx.backend.infra.stores.session_flush.FLUSH_INTERVAL_MS = (((20) * (60)) * (1000));
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.session_flush !== 'undefined') && (typeof knoxx.backend.infra.stores.session_flush.interval_handle_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.session_flush.interval_handle_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.stores.session_flush.run_inactive_QMARK_ = (function knoxx$backend$infra$stores$session_flush$run_inactive_QMARK_(run,threshold_ms){
var updated_ms = (function (){try{return (new Date((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())).getTime();
}catch (e30409){var _ = e30409;
return (0);
}})();
return ((cljs.core.not(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(run))) && ((((updated_ms > (0))) && (((Date.now() - updated_ms) >= threshold_ms)))));
});
knoxx.backend.infra.stores.session_flush.archive_stale_run_BANG_ = (async function knoxx$backend$infra$stores$session_flush$archive_stale_run_BANG_(store,run){
var archived = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(run,new cljs.core.Keyword(null,"status","status",-1997798413),"failed",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error","error",-978969032),"session-ttl-expired",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], 0));
try{return (await knoxx.backend.shape.session_persistence.put_run_BANG_(store,archived));
}catch (e30419){var err = e30419;
return console.warn("[session-flush] stale run archive failed",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.ex_message(err)], null)));
}});
knoxx.backend.infra.stores.session_flush.archive_stale_session_runs_BANG_ = (async function knoxx$backend$infra$stores$session_flush$archive_stale_session_runs_BANG_(store,session_id,threshold_ms){
try{var runs = (await knoxx.backend.shape.session_persistence.list_active_runs(store,session_id));
return (await Promise.all(cljs.core.clj__GT_js(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (run){
if(knoxx.backend.infra.stores.session_flush.run_inactive_QMARK_(run,threshold_ms)){
return knoxx.backend.infra.stores.session_flush.archive_stale_run_BANG_(store,run);
} else {
return null;
}
}),runs))));
}catch (e30421){var _ = e30421;
return null;
}});
/**
 * Scan all active sessions in Mongo for runs that have been inactive
 * longer than `threshold-ms` and archive them to OpenPlanner.
 */
knoxx.backend.infra.stores.session_flush.flush_stale_runs_BANG_ = (async function knoxx$backend$infra$stores$session_flush$flush_stale_runs_BANG_(threshold_ms){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.infra.stores.session_store_registry.session_store_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var store = temp__5825__auto__;
try{var ids = cljs.core.vec((await knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$0()));
return (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__30425_SHARP_){
return knoxx.backend.infra.stores.session_flush.archive_stale_session_runs_BANG_(store,p1__30425_SHARP_,threshold_ms);
}),ids))));
}catch (e30426){var err = e30426;
return console.warn("[session-flush] flush scan failed",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.ex_message(err)], null)));
}} else {
return null;
}
});
/**
 * Start the background flush job. Safe to call multiple times — guards
 * against duplicate intervals created by shadow-cljs hot reload.
 * 
 * `threshold-ms` (from config :run-stale-flush-ms) is how long a run may go
 * without updates, with no active stream, before it is archived as dead. It
 * should be well above any expected real turn duration so genuinely active
 * long runs are never wrongly failed.
 */
knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_ = (function knoxx$backend$infra$stores$session_flush$start_periodic_flush_BANG_(var_args){
var G__30436 = arguments.length;
switch (G__30436) {
case 0:
return knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.stores.session_flush.DEFAULT_INACTIVE_THRESHOLD_MS);
}));

(knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (threshold_ms){
var threshold_ms__$1 = ((((typeof threshold_ms === 'number') && ((threshold_ms > (0)))))?threshold_ms:knoxx.backend.infra.stores.session_flush.DEFAULT_INACTIVE_THRESHOLD_MS);
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.stores.session_flush.interval_handle_STAR_))){
return null;
} else {
cljs.core.reset_BANG_(knoxx.backend.infra.stores.session_flush.interval_handle_STAR_,setInterval((function (){
return knoxx.backend.infra.stores.session_flush.flush_stale_runs_BANG_(threshold_ms__$1);
}),knoxx.backend.infra.stores.session_flush.FLUSH_INTERVAL_MS));

return console.info("[session-flush] periodic stale-run flush started",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"interval-ms","interval-ms",592351679),knoxx.backend.infra.stores.session_flush.FLUSH_INTERVAL_MS,new cljs.core.Keyword(null,"threshold-ms","threshold-ms",-998273187),threshold_ms__$1], null)));
}
}));

(knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * Stop the background flush job. Called on hot reload before-load.
 */
knoxx.backend.infra.stores.session_flush.stop_periodic_flush_BANG_ = (function knoxx$backend$infra$stores$session_flush$stop_periodic_flush_BANG_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.infra.stores.session_flush.interval_handle_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var h = temp__5825__auto__;
clearInterval(h);

return cljs.core.reset_BANG_(knoxx.backend.infra.stores.session_flush.interval_handle_STAR_,null);
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.infra.stores.session_flush.js.map
