import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.agent.resume.js";
import "./knoxx.backend.domain.discord.gateway.js";
import "./knoxx.backend.infra.event_runtime.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.infra.db.policy.js";
import "./knoxx.backend.runtime.state.js";
import "./knoxx.backend.infra.svg_render.js";
import "./knoxx.backend.domain.voice.turn_control.js";
goog.provide('knoxx.backend.infra.graceful_shutdown');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.graceful_shutdown !== 'undefined') && (typeof knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"installed?","installed?",-345006478),false,new cljs.core.Keyword(null,"in-progress?","in-progress?",-689790546),false,new cljs.core.Keyword(null,"promise","promise",1767129287),null,new cljs.core.Keyword(null,"signal","signal",-1984951589),null], null));
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.graceful_shutdown !== 'undefined') && (typeof knoxx.backend.infra.graceful_shutdown.shutdown_target_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.graceful_shutdown.shutdown_target_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"app","app",-560961707),null,new cljs.core.Keyword(null,"config","config",994861415),null], null));
}
knoxx.backend.infra.graceful_shutdown.log_info_BANG_ = (function knoxx$backend$infra$graceful_shutdown$log_info_BANG_(app,message){
var temp__5823__auto__ = (function (){var G__31023 = app;
if((G__31023 == null)){
return null;
} else {
return G__31023.log;
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var logger = temp__5823__auto__;
return logger.info(message);
} else {
return console.log(message);
}
});
knoxx.backend.infra.graceful_shutdown.log_warn_BANG_ = (function knoxx$backend$infra$graceful_shutdown$log_warn_BANG_(app,message){
var temp__5823__auto__ = (function (){var G__31025 = app;
if((G__31025 == null)){
return null;
} else {
return G__31025.log;
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var logger = temp__5823__auto__;
return logger.warn(message);
} else {
return console.warn(message);
}
});
knoxx.backend.infra.graceful_shutdown.log_error_BANG_ = (function knoxx$backend$infra$graceful_shutdown$log_error_BANG_(app,message,err){
var temp__5823__auto__ = (function (){var G__31028 = app;
if((G__31028 == null)){
return null;
} else {
return G__31028.log;
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var logger = temp__5823__auto__;
return logger.error(message,err);
} else {
return console.error(message,err);
}
});
knoxx.backend.infra.graceful_shutdown.close_server_BANG_ = (async function knoxx$backend$infra$graceful_shutdown$close_server_BANG_(app){
try{var result = app.close();
if((!((result == null)))){
return (await result);
} else {
return true;
}
}catch (e31030){var err = e31030;
knoxx.backend.infra.graceful_shutdown.log_error_BANG_(app,"[shutdown] failed to close Fastify cleanly",err);

return false;
}});
knoxx.backend.infra.graceful_shutdown.run_shutdown_BANG_ = (async function knoxx$backend$infra$graceful_shutdown$run_shutdown_BANG_(app,config,signal){
try{cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"in-progress?","in-progress?",-689790546),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"signal","signal",-1984951589),signal], 0));

knoxx.backend.infra.graceful_shutdown.log_info_BANG_(app,(""+"[shutdown] received "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(signal)+"; draining Knoxx"));

knoxx.backend.infra.agent.resume.stop_periodic_recovery_BANG_();

knoxx.backend.infra.event_runtime.stop_BANG_();

knoxx.backend.domain.discord.gateway.stop_BANG_();

knoxx.backend.domain.realtime.stop_BANG_();

var parts_31174 = (await Promise.all([knoxx.backend.infra.graceful_shutdown.close_server_BANG_(app),knoxx.backend.infra.agent.resume.wait_for_turns_and_flush_BANG_(app,config)]));
var drain_result_31175 = (parts_31174[(1)]);
if(cljs.core.truth_((drain_result_31175["timed_out"]))){
var active_turns_31182 = knoxx.backend.domain.voice.turn_control.active_turn_entries();
var count_31183 = (await knoxx.backend.infra.agent.resume.mark_sessions_resumable_BANG_(active_turns_31182,signal));
knoxx.backend.infra.graceful_shutdown.log_warn_BANG_(app,(""+"[shutdown] marked "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(count_31183)+" active session(s) resumable for restart"));
} else {
}

(await Promise.all(cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.svg_render.shutdown_BANG_(),(await (async function (){var temp__5825__auto__ = knoxx.backend.runtime.state.current_policy_db();
if(cljs.core.truth_(temp__5825__auto__)){
var policy_context = temp__5825__auto__;
return knoxx.backend.infra.db.policy.close_BANG_(policy_context);
} else {
return null;
}
})())], null))));

knoxx.backend.infra.graceful_shutdown.log_info_BANG_(app,"[shutdown] graceful shutdown complete");

return process.exit((0));
}catch (e31039){var err = e31039;
knoxx.backend.infra.graceful_shutdown.log_error_BANG_(app,"[shutdown] graceful shutdown failed",err);

return process.exit((1));
}});
knoxx.backend.infra.graceful_shutdown.begin_shutdown_BANG_ = (function knoxx$backend$infra$graceful_shutdown$begin_shutdown_BANG_(app,config,signal){
var temp__5823__auto__ = new cljs.core.Keyword(null,"promise","promise",1767129287).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_));
if(cljs.core.truth_(temp__5823__auto__)){
var existing = temp__5823__auto__;
return existing;
} else {
var signal__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = signal;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "shutdown";
}
})()));
var shutdown_promise = knoxx.backend.infra.graceful_shutdown.run_shutdown_BANG_(app,config,signal__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"promise","promise",1767129287),shutdown_promise);

return shutdown_promise;
}
});
knoxx.backend.infra.graceful_shutdown.begin_current_shutdown_BANG_ = (function knoxx$backend$infra$graceful_shutdown$begin_current_shutdown_BANG_(signal){
var map__31115 = cljs.core.deref(knoxx.backend.infra.graceful_shutdown.shutdown_target_STAR_);
var map__31115__$1 = cljs.core.__destructure_map(map__31115);
var app = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31115__$1,new cljs.core.Keyword(null,"app","app",-560961707));
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31115__$1,new cljs.core.Keyword(null,"config","config",994861415));
if(cljs.core.truth_(app)){
return knoxx.backend.infra.graceful_shutdown.begin_shutdown_BANG_(app,config,signal);
} else {
console.warn("[shutdown] no active HTTP app; exiting");

return process.exit((0));
}
});
knoxx.backend.infra.graceful_shutdown.install_BANG_ = (function knoxx$backend$infra$graceful_shutdown$install_BANG_(app,config){
cljs.core.reset_BANG_(knoxx.backend.infra.graceful_shutdown.shutdown_target_STAR_,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"app","app",-560961707),app,new cljs.core.Keyword(null,"config","config",994861415),config], null));

if(cljs.core.truth_(new cljs.core.Keyword(null,"installed?","installed?",-345006478).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_)))){
return null;
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.graceful_shutdown.shutdown_state_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"installed?","installed?",-345006478),true);

process.on("SIGINT",(function (){
return knoxx.backend.infra.graceful_shutdown.begin_current_shutdown_BANG_("SIGINT");
}));

process.on("SIGTERM",(function (){
return knoxx.backend.infra.graceful_shutdown.begin_current_shutdown_BANG_("SIGTERM");
}));

process.on("message",(function (message){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message)),"shutdown")){
return knoxx.backend.infra.graceful_shutdown.begin_current_shutdown_BANG_("pm2:shutdown");
} else {
return null;
}
}));

return true;
}
});

//# sourceMappingURL=knoxx.backend.infra.graceful_shutdown.js.map
