import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.infra.agent.turn.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.domain.voice.turn_control.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.agent.recovery');
knoxx.backend.infra.agent.recovery.RECOVERED_SESSION_KICKOFF_TIMEOUT_MS = (5000);
knoxx.backend.infra.agent.recovery.RECOVERED_SESSION_KICKOFF_POLL_MS = (25);
knoxx.backend.infra.agent.recovery.recovered_auth_context = (function knoxx$backend$infra$agent$recovery$recovered_auth_context(session){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"permissions","permissions",67803075),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"isSystemAdmin","isSystemAdmin",679314438),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),new cljs.core.Keyword(null,"membershipToolPolicies","membershipToolPolicies",-954353456),new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),new cljs.core.Keyword(null,"membershipId","membershipId",2026001076),new cljs.core.Keyword(null,"userId","userId",575594135),new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618),new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270)],[new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(session),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"permissions","permissions",67803075).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(session),cljs.core.boolean$(new cljs.core.Keyword(null,"is_system_admin","is_system_admin",-723489128).cljs$core$IFn$_invoke$arity$1(session)),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770).cljs$core$IFn$_invoke$arity$1(session),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"membership_tool_policies","membership_tool_policies",2116037883).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"membership_id","membership_id",-171302674).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"user_email","user_email",-926613652).cljs$core$IFn$_invoke$arity$1(session),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"role_slugs","role_slugs",2101192325).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())]);
});
knoxx.backend.infra.agent.recovery.recovered_agent_spec = (function knoxx$backend$infra$agent$recovery$recovered_agent_spec(session){
return new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session);
});
knoxx.backend.infra.agent.recovery.restored_conversation_access_BANG_ = (function knoxx$backend$infra$agent$recovery$restored_conversation_access_BANG_(session){
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var snapshot = cljs.core.select_keys(session,new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770),new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"user_email","user_email",-926613652),new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"role_slugs","role_slugs",2101192325),new cljs.core.Keyword(null,"permissions","permissions",67803075),new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177),new cljs.core.Keyword(null,"membership_tool_policies","membership_tool_policies",2116037883),new cljs.core.Keyword(null,"is_system_admin","is_system_admin",-723489128)], null));
if((((!(clojure.string.blank_QMARK_(conversation_id)))) && (knoxx.backend.infra.auth.authz.auth_snapshot_has_principal_QMARK_(snapshot)))){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.agent.turn.conversation_access_STAR_,cljs.core.assoc,conversation_id,snapshot);
} else {
return null;
}
});
knoxx.backend.infra.agent.recovery.last_session_user_message = (function knoxx$backend$infra$agent$recovery$last_session_user_message(session){
return cljs.core.some((function (message){
var role = (function (){var G__29929 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(message);
var G__29929__$1 = (((G__29929 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29929)));
if((G__29929__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29929__$1);
}
})();
var content = (function (){var G__29934 = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if((G__29934 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29934));
}
})();
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(role,"user")) && ((!(clojure.string.blank_QMARK_(content)))))){
return content;
} else {
return null;
}
}),cljs.core.reverse(cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
knoxx.backend.infra.agent.recovery.wait_for_recovered_turn_kickoff_BANG_ = (function knoxx$backend$infra$agent$recovery$wait_for_recovered_turn_kickoff_BANG_(conversation_id,launch_promise){
if((!((knoxx.backend.domain.voice.turn_control.active_turn(conversation_id) == null)))){
return Promise.resolve(true);
} else {
return (new Promise((function (resolve,reject){
var done_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
var started_ms = Date.now();
var check_BANG_ = (function knoxx$backend$infra$agent$recovery$wait_for_recovered_turn_kickoff_BANG__$_check_BANG_(){
if(cljs.core.truth_(cljs.core.deref(done_QMARK_))){
return null;
} else {
if((!((knoxx.backend.domain.voice.turn_control.active_turn(conversation_id) == null)))){
cljs.core.reset_BANG_(done_QMARK_,true);

return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(true) : resolve.call(null,true));
} else {
if(((Date.now() - started_ms) > knoxx.backend.infra.agent.recovery.RECOVERED_SESSION_KICKOFF_TIMEOUT_MS)){
cljs.core.reset_BANG_(done_QMARK_,true);

var G__29946 = (new Error((""+"Timed out waiting for recovered session kickoff: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(conversation_id))));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__29946) : reject.call(null,G__29946));
} else {
return setTimeout(knoxx$backend$infra$agent$recovery$wait_for_recovered_turn_kickoff_BANG__$_check_BANG_,knoxx.backend.infra.agent.recovery.RECOVERED_SESSION_KICKOFF_POLL_MS);

}
}
}
});
(async function (){
try{return (await launch_promise);
}catch (e29951){var err = e29951;
if(cljs.core.truth_(cljs.core.deref(done_QMARK_))){
return null;
} else {
cljs.core.reset_BANG_(done_QMARK_,true);

return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(err) : reject.call(null,err));
}
}})();

return check_BANG_();
})));
}
});
knoxx.backend.infra.agent.recovery.log_kickoff_failure_BANG_ = (async function knoxx$backend$infra$agent$recovery$log_kickoff_failure_BANG_(send_promise,session_id,conversation_id){
try{return (await send_promise);
}catch (e29952){var err = e29952;
console.error("[knoxx] recovered session failed after kickoff",({"sessionId": session_id, "conversationId": conversation_id, "error": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))}));

return null;
}});
knoxx.backend.infra.agent.recovery.resume_with_message_BANG_ = (async function knoxx$backend$infra$agent$recovery$resume_with_message_BANG_(runtime,config,session_id,conversation_id,run_id,message,model_id,mode,thinking_level,auth_context,agent_spec,wait_for,resume_failed_BANG_){
try{(await knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"recovered_at","recovered_at",-474781568),knoxx.backend.domain.time.now_iso()], null)));

var send_promise = knoxx.backend.infra.agent.turn.send_agent_turn_BANG_(runtime,config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"model","model",331153215)],[conversation_id,session_id,auth_context,mode,thinking_level,agent_spec,run_id,message,model_id]));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wait_for,new cljs.core.Keyword(null,"kickoff","kickoff",-1736115645))){
knoxx.backend.infra.agent.recovery.log_kickoff_failure_BANG_(send_promise,session_id,conversation_id);

(await knoxx.backend.infra.agent.recovery.wait_for_recovered_turn_kickoff_BANG_(conversation_id,send_promise));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),true,new cljs.core.Keyword(null,"wait_for","wait_for",-1748516157),"kickoff"], null);
} else {
(await send_promise);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),true], null);
}
}catch (e29963){var err = e29963;
return (resume_failed_BANG_.cljs$core$IFn$_invoke$arity$1 ? resume_failed_BANG_.cljs$core$IFn$_invoke$arity$1(err) : resume_failed_BANG_.call(null,err));
}});
knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_ = (async function knoxx$backend$infra$agent$recovery$resume_recovered_session_BANG_(var_args){
var G__29972 = arguments.length;
switch (G__29972) {
case 3:
return knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (runtime,config,session){
return knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,session,null);
}));

(knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (runtime,config,session,opts){
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var run_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})());
var model_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})());
var mode = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mode","mode",654403691).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "direct";
}
})());
var wait_for = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"wait-for","wait-for",603509654).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"completion","completion",-731716930);
}
})());
var thinking_level = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "off";
}
}
})());
var auth_context = knoxx.backend.infra.agent.recovery.recovered_auth_context(session);
var agent_spec = knoxx.backend.infra.agent.recovery.recovered_agent_spec(session);
var message = knoxx.backend.infra.agent.recovery.last_session_user_message(session);
var resume_failed_BANG_ = (async function (err){
console.error("[knoxx] failed to resume recovered session",({"sessionId": session_id, "conversationId": conversation_id, "error": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))}));

(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3(session_id,conversation_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),(""+"Session recovery failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session)], null)));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
});
knoxx.backend.infra.agent.recovery.restored_conversation_access_BANG_(session);

if(((clojure.string.blank_QMARK_(conversation_id)) || (clojure.string.blank_QMARK_(session_id)))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),"missing session or conversation id"], null);
} else {
if(clojure.string.blank_QMARK_(message)){
(await knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$8(runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,agent_spec));

(await knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"waiting_input",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"recovered_at","recovered_at",-474781568),knoxx.backend.domain.time.now_iso()], null)));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"resumed","resumed",897761340),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),"no pending user message to resume"], null);
} else {
return (await knoxx.backend.infra.agent.recovery.resume_with_message_BANG_(runtime,config,session_id,conversation_id,run_id,message,model_id,mode,thinking_level,auth_context,agent_spec,wait_for,resume_failed_BANG_));

}
}
}));

(knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.agent.recovery.recover_active_agent_sessions_BANG_ = (async function knoxx$backend$infra$agent$recovery$recover_active_agent_sessions_BANG_(runtime,config){
var sessions = (await knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$0());
var items = cljs.core.vec(sessions);
if(cljs.core.seq(items)){
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__29998_SHARP_){
return knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,p1__29998_SHARP_);
}),items))));
return cljs.core.vec(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});

//# sourceMappingURL=knoxx.backend.infra.agent.recovery.js.map
