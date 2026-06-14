import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.domain.extension_runtime.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.shape.agent.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.agent.runtime');
knoxx.backend.domain.extension_runtime.init_BANG_();
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.runtime !== 'undefined') && (typeof knoxx.backend.infra.agent.runtime.eta_mu_runtime_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.runtime.eta_mu_runtime_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.runtime !== 'undefined') && (typeof knoxx.backend.infra.agent.runtime.eta_mu_module_promise_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.runtime.eta_mu_module_promise_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.agent.runtime.configured_extra_root_records = (function knoxx$backend$infra$agent$runtime$configured_extra_root_records(node_path,config){
var music_root = (function (){var G__29370 = new cljs.core.Keyword(null,"music-library-root","music-library-root",1834434652).cljs$core$IFn$_invoke$arity$1(config);
var G__29370__$1 = (((G__29370 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29370)));
var G__29370__$2 = (((G__29370__$1 == null))?null:clojure.string.trim(G__29370__$1));
if((G__29370__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29370__$2);
}
})();
var extra_roots = cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (raw){
var G__29371 = raw;
var G__29371__$1 = (((G__29371 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29371)));
var G__29371__$2 = (((G__29371__$1 == null))?null:clojure.string.trim(G__29371__$1));
if((G__29371__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29371__$2);
}
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"extra-workspace-roots","extra-workspace-roots",-21056439).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return cljs.core.vec(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,entry){
if(cljs.core.truth_(cljs.core.some((function (p1__29362_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(p1__29362_SHARP_),new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(entry));
}),acc))){
return acc;
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,entry);
}
}),cljs.core.PersistentVector.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((cljs.core.truth_(music_root)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alias","alias",-2039751630),"Music",new cljs.core.Keyword(null,"root","root",-448657453),node_path.resolve(music_root)], null)], null):null),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (raw_root){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alias","alias",-2039751630),null,new cljs.core.Keyword(null,"root","root",-448657453),node_path.resolve(raw_root)], null);
}),extra_roots))));
});
knoxx.backend.infra.agent.runtime.allowed_root_records = (function knoxx$backend$infra$agent$runtime$allowed_root_records(node_path,config){
return cljs.core.vec(cljs.core.cons(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alias","alias",-2039751630),null,new cljs.core.Keyword(null,"root","root",-448657453),node_path.resolve(new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config))], null),knoxx.backend.infra.agent.runtime.configured_extra_root_records(node_path,config)));
});
knoxx.backend.infra.agent.runtime.root_relative_path = (function knoxx$backend$infra$agent$runtime$root_relative_path(node_path,root,candidate){
var rel = node_path.relative(root,candidate);
if(cljs.core.truth_((function (){var or__5162__auto__ = clojure.string.starts_with_QMARK_(rel,"..");
if(or__5162__auto__){
return or__5162__auto__;
} else {
return node_path.isAbsolute(rel);
}
})())){
return null;
} else {
return rel;
}
});
knoxx.backend.infra.agent.runtime.resolve_workspace_path = (function knoxx$backend$infra$agent$runtime$resolve_workspace_path(_runtime,config,raw_path){
var node_path = shadow.esm.esm_import$node_path;
var requested = (function (){var G__29406 = raw_path;
var G__29406__$1 = (((G__29406 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29406)));
var G__29406__$2 = (((G__29406__$1 == null))?null:clojure.string.trim(G__29406__$1));
if((G__29406__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29406__$2);
}
})();
var roots = knoxx.backend.infra.agent.runtime.allowed_root_records(node_path,config);
var music_root = cljs.core.some((function (p1__29403_SHARP_){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("Music",new cljs.core.Keyword(null,"alias","alias",-2039751630).cljs$core$IFn$_invoke$arity$1(p1__29403_SHARP_))){
return p1__29403_SHARP_;
} else {
return null;
}
}),roots);
var candidate = (cljs.core.truth_(node_path.isAbsolute((function (){var or__5162__auto__ = requested;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))?node_path.resolve(requested):(cljs.core.truth_((function (){var and__5160__auto__ = requested;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = music_root;
if(cljs.core.truth_(and__5160__auto____$1)){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(requested,"Music")) || (clojure.string.starts_with_QMARK_(requested,"Music/")));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())?(function (){var suffix = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(requested,cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.count(requested),(("Music/").length)));
return node_path.resolve(new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(music_root),suffix);
})():node_path.resolve(new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config),(function (){var or__5162__auto__ = requested;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())
));
var matched_root = cljs.core.some((function (root_record){
if(cljs.core.truth_(knoxx.backend.infra.agent.runtime.root_relative_path(node_path,new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(root_record),candidate))){
return root_record;
} else {
return null;
}
}),roots);
if(cljs.core.truth_(matched_root)){
} else {
throw (new Error("Path escapes allowed workspace roots"));
}

return candidate;
});
knoxx.backend.infra.agent.runtime.queue_agent_control_BANG_ = (async function knoxx$backend$infra$agent$runtime$queue_agent_control_BANG_(_runtime,_config,p__29435){
var map__29437 = p__29435;
var map__29437__$1 = cljs.core.__destructure_map(map__29437);
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29437__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29437__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29437__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29437__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29437__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var metadata = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29437__$1,new cljs.core.Keyword(null,"metadata","metadata",1799301597));
if(clojure.string.blank_QMARK_(conversation_id)){
return Promise.reject((new Error("conversation_id is required for live controls")));
} else {
if(clojure.string.blank_QMARK_(message)){
return Promise.reject((new Error("message is required for live controls")));
} else {
var temp__5823__auto__ = knoxx.backend.infra.agent.session.active_agent_session(conversation_id);
if(cljs.core.truth_(temp__5823__auto__)){
var session = temp__5823__auto__;
if(cljs.core.not(knoxx.backend.shape.agent.streaming_QMARK_(session))){
return Promise.reject((new Error("No active running turn is available for live controls")));
} else {
var preview = (((cljs.core.count(message) > (240)))?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.subs.cljs$core$IFn$_invoke$arity$3(message,(0),(240)))+"\u2026"):message);
var event_type = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"follow_up"))?"follow_up_queued":"steer_queued");
var failure_type = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"follow_up"))?"follow_up_failed":"steer_failed");
var metadata__$1 = (await (async function (){var or__5162__auto__ = metadata;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var invoke = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"follow_up"))?(function (){
return knoxx.backend.shape.agent.follow_up_BANG_(session,message);
}):(function (){
return knoxx.backend.shape.agent.steer_BANG_(session,message);
}));
try{(await invoke());

var event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,event_type,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"queued",new cljs.core.Keyword(null,"preview","preview",451279890),preview,new cljs.core.Keyword(null,"metadata","metadata",1799301597),metadata__$1], null));
if(cljs.core.truth_(run_id)){
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,event);
} else {
}

knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",event);

return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"kind","kind",-717265803),kind], null);
}catch (e29450){var err = e29450;
var event_29491 = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,failure_type,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),new cljs.core.Keyword(null,"preview","preview",451279890),preview,new cljs.core.Keyword(null,"metadata","metadata",1799301597),metadata__$1], null));
if(cljs.core.truth_(run_id)){
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,event_29491);
} else {
}

knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",event_29491);

throw err;
}}
} else {
return Promise.reject((new Error("Conversation is not active in the agent runtime")));
}

}
}
});

//# sourceMappingURL=knoxx.backend.infra.agent.runtime.js.map
