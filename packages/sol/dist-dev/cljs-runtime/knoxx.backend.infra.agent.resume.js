import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.recovery.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.infra.system_instance.js";
import "./knoxx.backend.domain.voice.turn_control.js";
import "./knoxx.backend.domain.time.js";
import "./knoxx.backend.shape.agent.js";
goog.provide('knoxx.backend.infra.agent.resume');
knoxx.backend.infra.agent.resume.STALE_THRESHOLD_MS = (((10) * (60)) * (1000));
knoxx.backend.infra.agent.resume.POST_DRAIN_GRACE_MS = (1000);
knoxx.backend.infra.agent.resume.RECOVERY_INTERVAL_MS = (15000);
knoxx.backend.infra.agent.resume.STARTUP_RESUME_CONCURRENCY = (2);
knoxx.backend.infra.agent.resume.RECOVERY_COOLDOWN_MS = (60000);
knoxx.backend.infra.agent.resume.PROCESS_STARTUP_RESUME_WINDOW_MS = (120000);
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.resume !== 'undefined') && (typeof knoxx.backend.infra.agent.resume.interval_handle_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.resume.interval_handle_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.resume !== 'undefined') && (typeof knoxx.backend.infra.agent.resume.startup_resume_state_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.resume.startup_resume_state_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"attempted?","attempted?",862813422),false,new cljs.core.Keyword(null,"skipped-reason","skipped-reason",1269467663),null], null));
}
knoxx.backend.infra.agent.resume.log_info_BANG_ = (function knoxx$backend$infra$agent$resume$log_info_BANG_(var_args){
var G__30067 = arguments.length;
switch (G__30067) {
case 2:
return knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (app,msg){
return knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,msg,null);
}));

(knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (app,msg,err){
var log = app.log;
if(cljs.core.truth_(err)){
return log.error(msg,err);
} else {
return log.info(msg);
}
}));

(knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.resume.log_warn_BANG_ = (function knoxx$backend$infra$agent$resume$log_warn_BANG_(app,msg){
var log = app.log;
return log.warn(msg);
});
knoxx.backend.infra.agent.resume.auto_resume_enabled_QMARK_ = (function knoxx$backend$infra$agent$resume$auto_resume_enabled_QMARK_(config){
return new cljs.core.Keyword(null,"agent-auto-resume-sessions?","agent-auto-resume-sessions?",801384409).cljs$core$IFn$_invoke$arity$1(config) === true;
});
knoxx.backend.infra.agent.resume.session_last_updated_ms = (function knoxx$backend$infra$agent$resume$session_last_updated_ms(session){
var ts = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"shutdown_requested_at","shutdown_requested_at",1380231631).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"recovered_at","recovered_at",-474781568).cljs$core$IFn$_invoke$arity$1(session);
}
}
}
})();
if(typeof ts === 'number'){
return ts;
} else {
if(typeof ts === 'string'){
try{return (new Date(ts)).getTime();
}catch (e30072){var _ = e30072;
return (0);
}} else {
return (0);

}
}
});
knoxx.backend.infra.agent.resume.session_stale_QMARK_ = (function knoxx$backend$infra$agent$resume$session_stale_QMARK_(session){
var last_ms = knoxx.backend.infra.agent.resume.session_last_updated_ms(session);
return (((last_ms > (0))) && (((Date.now() - last_ms) >= knoxx.backend.infra.agent.resume.STALE_THRESHOLD_MS)));
});
/**
 * True when the session cannot belong to a live run: either stale past the
 * threshold, or stamped by a previous system instance whose process no
 * longer exists. With auto-resume enabled, instance-orphaned sessions are
 * handed to the resume path instead of being treated as dead.
 */
knoxx.backend.infra.agent.resume.session_dead_QMARK_ = (function knoxx$backend$infra$agent$resume$session_dead_QMARK_(config,session){
return ((knoxx.backend.infra.agent.resume.session_stale_QMARK_(session)) || ((((!(knoxx.backend.infra.agent.resume.auto_resume_enabled_QMARK_(config)))) && ((!(knoxx.backend.infra.system_instance.owned_by_current_instance_QMARK_(session)))))));
});
knoxx.backend.infra.agent.resume.runtime_processing_session_QMARK_ = (function knoxx$backend$infra$agent$resume$runtime_processing_session_QMARK_(conversation_id){
var active = knoxx.backend.infra.agent.session.active_agent_session(conversation_id);
var active_streaming_QMARK_ = (function (){var and__5160__auto__ = active;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(active);
} else {
return and__5160__auto__;
}
})();
var active_turn_QMARK_ = (function (){var and__5160__auto__ = active;
if(cljs.core.truth_(and__5160__auto__)){
try{return (!((knoxx.backend.shape.agent.current_turn(active) == null)));
}catch (e30076){if((e30076 instanceof Error)){
var _ = e30076;
return false;
} else {
throw e30076;

}
}} else {
return and__5160__auto__;
}
})();
var registered_turn_QMARK_ = (!((knoxx.backend.domain.voice.turn_control.active_turn(conversation_id) == null)));
var or__5162__auto__ = active_streaming_QMARK_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = active_turn_QMARK_;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return registered_turn_QMARK_;
}
}
});
/**
 * A session is 'hot' if it was updated very recently. Recovery skips hot
 * sessions so that in-flight runs (e.g. those orphaned by event runtimes/reload!)
 * have time to finish naturally instead of being duplicated.
 */
knoxx.backend.infra.agent.resume.session_hot_QMARK_ = (function knoxx$backend$infra$agent$resume$session_hot_QMARK_(session){
var last_ms = knoxx.backend.infra.agent.resume.session_last_updated_ms(session);
return (((last_ms > (0))) && (((Date.now() - last_ms) < knoxx.backend.infra.agent.resume.RECOVERY_COOLDOWN_MS)));
});
knoxx.backend.infra.agent.resume.session_resumable_QMARK_ = (function knoxx$backend$infra$agent$resume$session_resumable_QMARK_(session){
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return (((!(knoxx.backend.infra.agent.resume.session_hot_QMARK_(session)))) && (cljs.core.not(knoxx.backend.infra.agent.resume.runtime_processing_session_QMARK_(conversation_id))));
});
knoxx.backend.infra.agent.resume.abort_stale_session_BANG_ = (async function knoxx$backend$infra$agent$resume$abort_stale_session_BANG_(session){
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(session_id)){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"action","action",-811238024),"abort_skipped",new cljs.core.Keyword(null,"reason","reason",-2070751759),"missing session_id"], null);
} else {
try{(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3(session_id,conversation_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),((knoxx.backend.infra.system_instance.owned_by_current_instance_QMARK_(session))?"Session aborted automatically: stale (> 10 min)":"Session aborted automatically: orphaned by previous system instance"),new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session)], null)));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"action","action",-811238024),"aborted",new cljs.core.Keyword(null,"reason","reason",-2070751759),"stale"], null);
}catch (e30083){var err = e30083;
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"action","action",-811238024),"abort_failed",new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}}
});
knoxx.backend.infra.agent.resume.resume_session_BANG_ = (async function knoxx$backend$infra$agent$resume$resume_session_BANG_(runtime,config,session){
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if((!(knoxx.backend.infra.agent.resume.session_resumable_QMARK_(session)))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),"already_processing"], null);
} else {
try{var result = (await knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,session,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"wait-for","wait-for",603509654),new cljs.core.Keyword(null,"kickoff","kickoff",-1736115645)], null)));
if(cljs.core.truth_(new cljs.core.Keyword(null,"resumed","resumed",897761340).cljs$core$IFn$_invoke$arity$1(result))){
} else {
console.warn("[agent-resume] session did not resume",({"sessionId": session_id, "conversationId": conversation_id, "reason": new cljs.core.Keyword(null,"reason","reason",-2070751759).cljs$core$IFn$_invoke$arity$1(result)}));
}

return result;
}catch (e30096){var err = e30096;
console.error("[agent-resume] resume failed",({"sessionId": session_id, "conversationId": conversation_id, "error": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))}));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}}
});
/**
 * Run promise-returning item-fn over items with bounded concurrency.
 * This keeps startup recovery active without launching hundreds of agent turns at once.
 */
knoxx.backend.infra.agent.resume.run_limited_BANG_ = (async function knoxx$backend$infra$agent$resume$run_limited_BANG_(items,limit,item_fn){
var queue = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.vec(items));
var results = [];
var worker = (async function knoxx$backend$infra$agent$resume$run_limited_BANG__$_worker(){
while(true){
var temp__5823__auto__ = cljs.core.first(cljs.core.deref(queue));
if(cljs.core.truth_(temp__5823__auto__)){
var item = temp__5823__auto__;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(queue,cljs.core.subvec,(1));

try{results.push((await (item_fn.cljs$core$IFn$_invoke$arity$1 ? item_fn.cljs$core$IFn$_invoke$arity$1(item) : item_fn.call(null,item))));
}catch (e30103){var err_30304 = e30103;
results.push(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err_30304))], null));
}
continue;
} else {
return results;
}
break;
}
});
var worker_count = cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),limit),cljs.core.count(items));
if((worker_count === (0))){
return results;
} else {
(await Promise.all(cljs.core.clj__GT_js(cljs.core.repeatedly.cljs$core$IFn$_invoke$arity$2(worker_count,worker))));

return results;
}
});
knoxx.backend.infra.agent.resume.process_sessions_BANG_ = (async function knoxx$backend$infra$agent$resume$process_sessions_BANG_(runtime,app,config,sessions){
var map__30113 = cljs.core.group_by((function (p1__30107_SHARP_){
return knoxx.backend.infra.agent.resume.session_dead_QMARK_(config,p1__30107_SHARP_);
}),sessions);
var map__30113__$1 = cljs.core.__destructure_map(map__30113);
var stale = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30113__$1,true);
var recent = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30113__$1,false);
var resumable_recent = ((knoxx.backend.infra.agent.resume.auto_resume_enabled_QMARK_(config))?cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.resume.session_resumable_QMARK_,recent):cljs.core.PersistentVector.EMPTY);
if(cljs.core.seq(stale)){
knoxx.backend.infra.agent.resume.log_warn_BANG_(app,(""+"[agent-resume] aborting "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(stale))+" dead session(s) (stale or orphaned by restart)"));
} else {
}

if(((cljs.core.seq(recent)) && ((!(knoxx.backend.infra.agent.resume.auto_resume_enabled_QMARK_(config)))))){
knoxx.backend.infra.agent.resume.log_warn_BANG_(app,(""+"[agent-resume] auto resume disabled; leaving "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(recent))+" recent running session(s) untouched"));
} else {
}

if(cljs.core.seq(resumable_recent)){
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,(""+"[agent-resume] resuming "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(resumable_recent))+" recent session(s)"));
} else {
}

try{(await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.resume.abort_stale_session_BANG_,stale))));
}catch (e30126){var err_30309 = e30126;
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] abort batch error",err_30309);
}
try{(await knoxx.backend.infra.agent.resume.run_limited_BANG_(resumable_recent,knoxx.backend.infra.agent.resume.STARTUP_RESUME_CONCURRENCY,(function (p1__30108_SHARP_){
return knoxx.backend.infra.agent.resume.resume_session_BANG_(runtime,config,p1__30108_SHARP_);
})));
}catch (e30127){var err_30310 = e30127;
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] resume batch error",err_30310);
}
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"stale","stale",395586896),cljs.core.count(stale),new cljs.core.Keyword(null,"resumed","resumed",897761340),cljs.core.count(resumable_recent),new cljs.core.Keyword(null,"skipped","skipped",-1144887090),(cljs.core.count(recent) - cljs.core.count(resumable_recent))], null);
});
knoxx.backend.infra.agent.resume.process_uptime_ms = (function knoxx$backend$infra$agent$resume$process_uptime_ms(){
return Math.round(((1000) * process.uptime()));
});
/**
 * Fire-and-forget scan of Mongo running sessions on startup.
 * At true process startup every running document was stamped by a previous
 * system instance, so it is aborted (auto-resume off) or resumed
 * (auto-resume on) immediately — no staleness wait.
 * Returns a promise for testability, but callers should not await it
 * on the critical startup path.
 */
knoxx.backend.infra.agent.resume.resume_on_startup_BANG_ = (async function knoxx$backend$infra$agent$resume$resume_on_startup_BANG_(runtime,app,config){
var temp__5823__auto__ = knoxx.backend.infra.mongo_client.get_db();
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
try{var sessions = (await knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$1(db));
var running = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30131_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__30131_SHARP_));
}),sessions));
var result = ((cljs.core.seq(running))?(await knoxx.backend.infra.agent.resume.process_sessions_BANG_(runtime,app,config,running)):new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"stale","stale",395586896),(0),new cljs.core.Keyword(null,"resumed","resumed",897761340),(0),new cljs.core.Keyword(null,"skipped","skipped",-1144887090),(0)], null));
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,(""+"[agent-resume] startup scan complete: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result], 0)))));

return result;
}catch (e30135){var err = e30135;
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] startup scan failed",err);

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}} else {
knoxx.backend.infra.agent.resume.log_warn_BANG_(app,"[agent-resume] MongoDB unavailable; skipping startup scan");

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"skipped","skipped",-1144887090),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"mongodb_not_connected"], null);
}
});
/**
 * Run startup recovery once per Node process, not once per shadow-cljs reload.
 * 
 * Failure mode this prevents: a source edit triggers before/after-load, the HTTP
 * app restarts in-process, and recovery treats that hot reload like a process
 * crash, spawning duplicate recovered agent jobs. Real PM2/process restarts still
 * run recovery because process uptime is near zero.
 */
knoxx.backend.infra.agent.resume.resume_on_process_startup_BANG_ = (function knoxx$backend$infra$agent$resume$resume_on_process_startup_BANG_(runtime,app,config){
var uptime_ms = knoxx.backend.infra.agent.resume.process_uptime_ms();
if(cljs.core.truth_(new cljs.core.Keyword(null,"attempted?","attempted?",862813422).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.resume.startup_resume_state_STAR_)))){
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,(""+"[agent-resume] startup scan skipped: already attempted in this Node process "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.deref(knoxx.backend.infra.agent.resume.startup_resume_state_STAR_)], 0)))));

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"skipped","skipped",-1144887090),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"already_attempted"], null));
} else {
if((uptime_ms > knoxx.backend.infra.agent.resume.PROCESS_STARTUP_RESUME_WINDOW_MS)){
cljs.core.reset_BANG_(knoxx.backend.infra.agent.resume.startup_resume_state_STAR_,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"attempted?","attempted?",862813422),true,new cljs.core.Keyword(null,"skipped-reason","skipped-reason",1269467663),"process_uptime_exceeded",new cljs.core.Keyword(null,"uptime_ms","uptime_ms",-1111755918),uptime_ms], null));

knoxx.backend.infra.agent.resume.log_warn_BANG_(app,(""+"[agent-resume] startup scan skipped: process uptime "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uptime_ms)+"ms indicates shadow-cljs hot reload, not process startup"));

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"skipped","skipped",-1144887090),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"process_uptime_exceeded",new cljs.core.Keyword(null,"uptime_ms","uptime_ms",-1111755918),uptime_ms], null));
} else {
cljs.core.reset_BANG_(knoxx.backend.infra.agent.resume.startup_resume_state_STAR_,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"attempted?","attempted?",862813422),true,new cljs.core.Keyword(null,"skipped-reason","skipped-reason",1269467663),null,new cljs.core.Keyword(null,"uptime_ms","uptime_ms",-1111755918),uptime_ms], null));

return knoxx.backend.infra.agent.resume.resume_on_startup_BANG_(runtime,app,config);

}
}
});
/**
 * Log the abort/skip/resume decision for one recovery tick.
 */
knoxx.backend.infra.agent.resume.log_recovery_partition_BANG_ = (function knoxx$backend$infra$agent$resume$log_recovery_partition_BANG_(app,config,p__30166){
var map__30167 = p__30166;
var map__30167__$1 = cljs.core.__destructure_map(map__30167);
var stale = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30167__$1,new cljs.core.Keyword(null,"stale","stale",395586896));
var recent = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30167__$1,new cljs.core.Keyword(null,"recent","recent",449517715));
var resumable = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30167__$1,new cljs.core.Keyword(null,"resumable","resumable",574669715));
if(cljs.core.seq(stale)){
knoxx.backend.infra.agent.resume.log_warn_BANG_(app,(""+"[agent-resume] aborting "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(stale))+" dead session(s) (stale or orphaned by restart)"));
} else {
}

if(((cljs.core.seq(recent)) && ((!(knoxx.backend.infra.agent.resume.auto_resume_enabled_QMARK_(config)))))){
knoxx.backend.infra.agent.resume.log_warn_BANG_(app,(""+"[agent-resume] auto resume disabled; periodic recovery leaving "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(recent))+" recent running session(s) untouched"));
} else {
}

if(cljs.core.seq(resumable)){
return knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,(""+"[agent-resume] resuming "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(resumable))+" recent session(s)"));
} else {
return null;
}
});
/**
 * Abort dead sessions and resume resumable ones; errors are logged, not thrown.
 */
knoxx.backend.infra.agent.resume.run_recovery_batches_BANG_ = (async function knoxx$backend$infra$agent$resume$run_recovery_batches_BANG_(runtime,app,config,p__30180){
var map__30182 = p__30180;
var map__30182__$1 = cljs.core.__destructure_map(map__30182);
var stale = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30182__$1,new cljs.core.Keyword(null,"stale","stale",395586896));
var resumable = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30182__$1,new cljs.core.Keyword(null,"resumable","resumable",574669715));
try{(await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.resume.abort_stale_session_BANG_,stale))));
}catch (e30183){var err_30344 = e30183;
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] abort batch error",err_30344);
}
try{return (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__30175_SHARP_){
return knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,p1__30175_SHARP_,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"wait-for","wait-for",603509654),new cljs.core.Keyword(null,"kickoff","kickoff",-1736115645)], null));
}),resumable))));
}catch (e30187){var err = e30187;
return knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] resume batch error",err);
}});
knoxx.backend.infra.agent.resume.attempt_recovery_BANG_ = (async function knoxx$backend$infra$agent$resume$attempt_recovery_BANG_(runtime,app,config){
var temp__5823__auto__ = knoxx.backend.infra.mongo_client.get_db();
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
try{var sessions = (await knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$1(db));
var running = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30194_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__30194_SHARP_));
}),sessions));
var map__30199 = cljs.core.group_by((function (p1__30195_SHARP_){
return knoxx.backend.infra.agent.resume.session_dead_QMARK_(config,p1__30195_SHARP_);
}),running);
var map__30199__$1 = cljs.core.__destructure_map(map__30199);
var stale = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30199__$1,true);
var recent = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30199__$1,false);
var resumable = ((knoxx.backend.infra.agent.resume.auto_resume_enabled_QMARK_(config))?cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.resume.session_resumable_QMARK_,recent):cljs.core.PersistentVector.EMPTY);
var partition = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"stale","stale",395586896),stale,new cljs.core.Keyword(null,"recent","recent",449517715),recent,new cljs.core.Keyword(null,"resumable","resumable",574669715),resumable], null);
knoxx.backend.infra.agent.resume.log_recovery_partition_BANG_(app,config,partition);

(await knoxx.backend.infra.agent.resume.run_recovery_batches_BANG_(runtime,app,config,partition));

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"stale","stale",395586896),cljs.core.count(stale),new cljs.core.Keyword(null,"resumed","resumed",897761340),cljs.core.count(resumable),new cljs.core.Keyword(null,"skipped","skipped",-1144887090),(cljs.core.count(recent) - cljs.core.count(resumable))], null);
}catch (e30196){var err = e30196;
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] recovery tick error",err);

knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$3(app,"[agent-resume] mongo:",(knoxx.backend.infra.mongo_client.get_db() == null));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"skipped","skipped",-1144887090),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"mongodb_not_connected"], null);
}
});
knoxx.backend.infra.agent.resume.start_periodic_recovery_BANG_ = (function knoxx$backend$infra$agent$resume$start_periodic_recovery_BANG_(runtime,app,config){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.agent.resume.interval_handle_STAR_))){
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,"[agent-resume] periodic recovery already running; keeping existing interval");
} else {
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,"[agent-resume] starting periodic recovery interval");
}

if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.agent.resume.interval_handle_STAR_))){
return null;
} else {
return cljs.core.reset_BANG_(knoxx.backend.infra.agent.resume.interval_handle_STAR_,setInterval((async function (){
try{return (await knoxx.backend.infra.agent.resume.attempt_recovery_BANG_(runtime,app,config));
}catch (e30213){var _ = e30213;
return null;
}}),knoxx.backend.infra.agent.resume.RECOVERY_INTERVAL_MS));
}
});
knoxx.backend.infra.agent.resume.stop_periodic_recovery_BANG_ = (function knoxx$backend$infra$agent$resume$stop_periodic_recovery_BANG_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.infra.agent.resume.interval_handle_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var id = temp__5825__auto__;
clearInterval(id);

return cljs.core.reset_BANG_(knoxx.backend.infra.agent.resume.interval_handle_STAR_,null);
} else {
return null;
}
});
/**
 * Called by graceful-shutdown when active turns time out.
 */
knoxx.backend.infra.agent.resume.mark_sessions_resumable_BANG_ = (async function knoxx$backend$infra$agent$resume$mark_sessions_resumable_BANG_(active_turns,signal){
var stamp = knoxx.backend.domain.time.now_iso();
if(cljs.core.seq(active_turns)){
(await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__30222){
var map__30227 = p__30222;
var map__30227__$1 = cljs.core.__destructure_map(map__30227);
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30227__$1,new cljs.core.Keyword(null,"session_id","session_id",1584799627));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30227__$1,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30227__$1,new cljs.core.Keyword(null,"run_id","run_id",-556768024));
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"shutdown_requested_at","shutdown_requested_at",1380231631),stamp,new cljs.core.Keyword(null,"shutdown_signal","shutdown_signal",-2065919667),signal], null));
}
}),active_turns))));
} else {
}

return cljs.core.count(active_turns);
});
/**
 * Wait for turn-control to drain, then give the session store a grace window to persist.
 * Returns a promise.
 */
knoxx.backend.infra.agent.resume.wait_for_turns_and_flush_BANG_ = (function knoxx$backend$infra$agent$resume$wait_for_turns_and_flush_BANG_(app,config){
var grace_ms = (function (){var v = new cljs.core.Keyword(null,"shutdown-grace-ms","shutdown-grace-ms",-1671726656).cljs$core$IFn$_invoke$arity$1(config);
if(((typeof v === 'number') && ((v > (0))))){
return v;
} else {
return (25000);
}
})();
var poll_ms = (function (){var v = new cljs.core.Keyword(null,"shutdown-poll-ms","shutdown-poll-ms",1512160015).cljs$core$IFn$_invoke$arity$1(config);
if(((typeof v === 'number') && ((v > (0))))){
return v;
} else {
return (250);
}
})();
var deadline = (Date.now() + grace_ms);
return (new Promise((function (resolve){
var poll = (function knoxx$backend$infra$agent$resume$wait_for_turns_and_flush_BANG__$_poll(){
var remaining = knoxx.backend.domain.voice.turn_control.active_turn_count();
if((remaining === (0))){
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,(""+"[agent-resume] turns drained; waiting "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.agent.resume.POST_DRAIN_GRACE_MS)+"ms for session-store flush"));

return setTimeout((function (){
var G__30289 = ({"timed_out": false, "remaining": (0)});
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(G__30289) : resolve.call(null,G__30289));
}),knoxx.backend.infra.agent.resume.POST_DRAIN_GRACE_MS);
} else {
if((Date.now() >= deadline)){
var G__30293 = ({"timed_out": true, "remaining": remaining});
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(G__30293) : resolve.call(null,G__30293));
} else {
return setTimeout(knoxx$backend$infra$agent$resume$wait_for_turns_and_flush_BANG__$_poll,poll_ms);

}
}
});
var initial = knoxx.backend.domain.voice.turn_control.active_turn_count();
if((initial > (0))){
knoxx.backend.infra.agent.resume.log_info_BANG_.cljs$core$IFn$_invoke$arity$2(app,(""+"[agent-resume] waiting for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(initial)+" active turn(s)"));
} else {
}

return poll();
})));
});

//# sourceMappingURL=knoxx.backend.infra.agent.resume.js.map
