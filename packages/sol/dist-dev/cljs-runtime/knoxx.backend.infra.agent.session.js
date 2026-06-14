import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.extern.eta_mu.js";
import "./knoxx.backend.extern.extension.js";
import "./knoxx.backend.infra.agent.content_codec.js";
import "./knoxx.backend.infra.agent.history.js";
import "./knoxx.backend.infra.agent.provider.eta_mu.js";
import "./knoxx.backend.infra.agent.session_registry.js";
import "./knoxx.backend.infra.agent.tool_catalog.js";
import "./knoxx.backend.infra.http.js";
import "./knoxx.backend.infra.stores.composite_message_source.js";
import "./knoxx.backend.infra.stores.openplanner_message_source.js";
import "./knoxx.backend.infra.stores.mongo_message_source.js";
import "./knoxx.backend.domain.extension_runtime.js";
import "./knoxx.backend.domain.actor.mailbox.js";
import "./knoxx.backend.domain.agent.agent_context.js";
import "./knoxx.backend.shape.agent.js";
goog.provide('knoxx.backend.infra.agent.session');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.session !== 'undefined') && (typeof knoxx.backend.infra.agent.session.sessions_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.session.sessions_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.infra.agent.session.inactive_ttl_ms = knoxx.backend.infra.agent.session_registry.default_inactive_ttl_ms;
knoxx.backend.infra.agent.session.sweep_interval_ms = (300000);
knoxx.backend.infra.agent.session.active_session_registry = knoxx.backend.infra.agent.session_registry.atom_registry.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.session.sessions_STAR_,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),knoxx.backend.infra.agent.session.inactive_ttl_ms], null));
knoxx.backend.infra.agent.session.restore_agent_context_BANG_ = (function knoxx$backend$infra$agent$session$restore_agent_context_BANG_(previous){
if(cljs.core.truth_(previous)){
return (knoxx.backend.domain.agent.agent_context.set_context_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.agent.agent_context.set_context_BANG_.cljs$core$IFn$_invoke$arity$1(previous) : knoxx.backend.domain.agent.agent_context.set_context_BANG_.call(null,previous));
} else {
return (knoxx.backend.domain.agent.agent_context.clear_context_BANG_.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.clear_context_BANG_.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.clear_context_BANG_.call(null));
}
});
knoxx.backend.infra.agent.session.wrap_tool_execute_with_agent_context_BANG_ = (function knoxx$backend$infra$agent$session$wrap_tool_execute_with_agent_context_BANG_(tool,context){
var temp__5825__auto___29331 = knoxx.backend.extern.eta_mu.tool_execute(tool);
if(cljs.core.truth_(temp__5825__auto___29331)){
var execute_29332 = temp__5825__auto___29331;
knoxx.backend.extern.eta_mu.set_tool_execute_BANG_(tool,(function() { 
var G__29333__delegate = function (args){
var previous = (knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.get_context.call(null));
(knoxx.backend.domain.agent.agent_context.set_context_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.agent.agent_context.set_context_BANG_.cljs$core$IFn$_invoke$arity$1(context) : knoxx.backend.domain.agent.agent_context.set_context_BANG_.call(null,context));

try{return knoxx.backend.extern.eta_mu.with_promise_finally(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(execute_29332,args),(function (){
return knoxx.backend.infra.agent.session.restore_agent_context_BANG_(previous);
}));
}catch (e29207){var err = e29207;
knoxx.backend.infra.agent.session.restore_agent_context_BANG_(previous);

throw err;
}};
var G__29333 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__29335__i = 0, G__29335__a = new Array(arguments.length -  0);
while (G__29335__i < G__29335__a.length) {G__29335__a[G__29335__i] = arguments[G__29335__i + 0]; ++G__29335__i;}
  args = new cljs.core.IndexedSeq(G__29335__a,0,null);
} 
return G__29333__delegate.call(this,args);};
G__29333.cljs$lang$maxFixedArity = 0;
G__29333.cljs$lang$applyTo = (function (arglist__29336){
var args = cljs.core.seq(arglist__29336);
return G__29333__delegate(args);
});
G__29333.cljs$core$IFn$_invoke$arity$variadic = G__29333__delegate;
return G__29333;
})()
);
} else {
}

return tool;
});
knoxx.backend.infra.agent.session.wrap_custom_tools_with_agent_context_BANG_ = (function knoxx$backend$infra$agent$session$wrap_custom_tools_with_agent_context_BANG_(custom_tools,context){
if(cljs.core.truth_(custom_tools)){
var seq__29209_29337 = cljs.core.seq(knoxx.backend.extern.eta_mu.tool_seq(custom_tools));
var chunk__29210_29338 = null;
var count__29211_29339 = (0);
var i__29212_29340 = (0);
while(true){
if((i__29212_29340 < count__29211_29339)){
var tool_29345 = chunk__29210_29338.cljs$core$IIndexed$_nth$arity$2(null,i__29212_29340);
knoxx.backend.infra.agent.session.wrap_tool_execute_with_agent_context_BANG_(tool_29345,context);


var G__29350 = seq__29209_29337;
var G__29351 = chunk__29210_29338;
var G__29352 = count__29211_29339;
var G__29353 = (i__29212_29340 + (1));
seq__29209_29337 = G__29350;
chunk__29210_29338 = G__29351;
count__29211_29339 = G__29352;
i__29212_29340 = G__29353;
continue;
} else {
var temp__5825__auto___29354 = cljs.core.seq(seq__29209_29337);
if(temp__5825__auto___29354){
var seq__29209_29355__$1 = temp__5825__auto___29354;
if(cljs.core.chunked_seq_QMARK_(seq__29209_29355__$1)){
var c__5694__auto___29356 = cljs.core.chunk_first(seq__29209_29355__$1);
var G__29357 = cljs.core.chunk_rest(seq__29209_29355__$1);
var G__29358 = c__5694__auto___29356;
var G__29359 = cljs.core.count(c__5694__auto___29356);
var G__29360 = (0);
seq__29209_29337 = G__29357;
chunk__29210_29338 = G__29358;
count__29211_29339 = G__29359;
i__29212_29340 = G__29360;
continue;
} else {
var tool_29361 = cljs.core.first(seq__29209_29355__$1);
knoxx.backend.infra.agent.session.wrap_tool_execute_with_agent_context_BANG_(tool_29361,context);


var G__29363 = cljs.core.next(seq__29209_29355__$1);
var G__29364 = null;
var G__29365 = (0);
var G__29366 = (0);
seq__29209_29337 = G__29363;
chunk__29210_29338 = G__29364;
count__29211_29339 = G__29365;
i__29212_29340 = G__29366;
continue;
}
} else {
}
}
break;
}
} else {
}

return custom_tools;
});
knoxx.backend.infra.agent.session.prune_session_messages = (function knoxx$backend$infra$agent$session$prune_session_messages(agent_spec,messages){
return knoxx.backend.infra.agent.history.prune_session_messages(agent_spec,messages);
});
knoxx.backend.infra.agent.session.register_actor_live_route_BANG_ = (async function knoxx$backend$infra$agent$session$register_actor_live_route_BANG_(runtime,conversation_id,session_id,agent_spec){
var temp__5825__auto__ = (await (async function (){var G__29215 = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29215__$1 = (((G__29215 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29215)));
var G__29215__$2 = (((G__29215__$1 == null))?null:clojure.string.trim(G__29215__$1));
if((G__29215__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29215__$2);
}
})());
if(cljs.core.truth_(temp__5825__auto__)){
var actor_id = temp__5825__auto__;
try{return (await knoxx.backend.domain.actor.mailbox.register_live_session_BANG_(runtime,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),(await (async function (){var G__29217 = new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29217__$1 = (((G__29217 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29217)));
var G__29217__$2 = (((G__29217__$1 == null))?null:clojure.string.trim(G__29217__$1));
if((G__29217__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29217__$2);
}
})()),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"registeredBy","registeredBy",1921868146),"agent-runtime",new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec)], null)], null)));
}catch (e29216){var err = e29216;
return console.warn("[actor-mailbox] failed to register live actor route",err.message);
}} else {
return null;
}
});
knoxx.backend.infra.agent.session.active_agent_session = (function knoxx$backend$infra$agent$session$active_agent_session(conversation_id){
return knoxx.backend.infra.agent.session.active_session_registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session$arity$2(null,conversation_id);
});
knoxx.backend.infra.agent.session.active_session_entry = (function knoxx$backend$infra$agent$session$active_session_entry(conversation_id){
return knoxx.backend.infra.agent.session.active_session_registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$arity$2(null,conversation_id);
});
knoxx.backend.infra.agent.session.start_sweep_BANG_ = (function knoxx$backend$infra$agent$session$start_sweep_BANG_(){
return setInterval((function (){
return knoxx.backend.infra.agent.session.active_session_registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$sweep_expired_sessions_BANG_$arity$2(null,Date.now());
}),knoxx.backend.infra.agent.session.sweep_interval_ms);
});
knoxx.backend.infra.agent.session.start_sweep_BANG_();
knoxx.backend.infra.agent.session.fetch_b64_BANG_ = (function knoxx$backend$infra$agent$session$fetch_b64_BANG_(url,media_type){
return knoxx.backend.infra.agent.content_codec.fetch_b64_BANG_(url,media_type);
});
knoxx.backend.infra.agent.session.materialize_BANG_ = (function knoxx$backend$infra$agent$session$materialize_BANG_(part){
return knoxx.backend.infra.agent.content_codec.materialize_BANG_(part);
});
knoxx.backend.infra.agent.session.rehydrate_session_manager_BANG_ = (async function knoxx$backend$infra$agent$session$rehydrate_session_manager_BANG_(message_source,session_manager,conversation_id,agent_spec){
return (await knoxx.backend.infra.agent.history.rehydrate_session_manager_BANG_(message_source,session_manager,conversation_id,agent_spec));
});
knoxx.backend.infra.agent.session.ensure_eta_mu_runtime_BANG_ = (async function knoxx$backend$infra$agent$session$ensure_eta_mu_runtime_BANG_(runtime,config){
return (await knoxx.backend.infra.agent.provider.eta_mu.eta_mu_provider(runtime,config).knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ensure_runtime_BANG_$arity$1(null));
});
knoxx.backend.infra.agent.session.visible_session_signature = (function knoxx$backend$infra$agent$session$visible_session_signature(runtime,config,auth_context,agent_spec){
return knoxx.backend.infra.agent.tool_catalog.visible_session_signature(runtime,config,auth_context,agent_spec);
});
knoxx.backend.infra.agent.session.session_provider_tools = (function knoxx$backend$infra$agent$session$session_provider_tools(runtime,config,tool_auth_context,agent_spec,allowed_tool_ids,_model_id,session_id,conversation_id){
var builtin_tools = knoxx.backend.infra.agent.tool_catalog.builtin_tools(runtime,config,tool_auth_context,agent_spec);
var custom_tools = knoxx.backend.infra.agent.session.wrap_custom_tools_with_agent_context_BANG_(knoxx.backend.infra.agent.tool_catalog.custom_tools(runtime,config,tool_auth_context,agent_spec,allowed_tool_ids),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),agent_spec], null));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"custom-tools","custom-tools",-1003562280),custom_tools,new cljs.core.Keyword(null,"tool-name-allowlist","tool-name-allowlist",2001315015),knoxx.backend.infra.agent.tool_catalog.tool_runtime_names(builtin_tools,custom_tools)], null);
});
knoxx.backend.infra.agent.session.create_session_manager_BANG_ = (async function knoxx$backend$infra$agent$session$create_session_manager_BANG_(var_args){
var G__29220 = arguments.length;
switch (G__29220) {
case 4:
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
case 7:
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
case 8:
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$8((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]),(arguments[(7)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (runtime,config,conversation_id,model_id){
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$6(runtime,config,conversation_id,model_id,null,new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config));
}));

(knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$5 = (async function (runtime,config,conversation_id,model_id,auth_context){
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$6(runtime,config,conversation_id,model_id,auth_context,new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config));
}));

(knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$6 = (async function (runtime,config,conversation_id,model_id,auth_context,thinking_level){
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$7(runtime,config,conversation_id,model_id,auth_context,thinking_level,null);
}));

(knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$7 = (async function (runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id){
return knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$8(runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,null);
}));

(knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$8 = (async function (runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,agent_spec){
var map__29233 = (await knoxx.backend.infra.agent.session.ensure_eta_mu_runtime_BANG_(runtime,config));
var map__29233__$1 = cljs.core.__destructure_map(map__29233);
var auth_storage = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29233__$1,new cljs.core.Keyword(null,"auth-storage","auth-storage",-2076734340));
var model_registry = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29233__$1,new cljs.core.Keyword(null,"model-registry","model-registry",483426168));
var settings_manager = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29233__$1,new cljs.core.Keyword(null,"settings-manager","settings-manager",-963975515));
var loader = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29233__$1,new cljs.core.Keyword(null,"loader","loader",-462395423));
var runtime_dir = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29233__$1,new cljs.core.Keyword(null,"runtime-dir","runtime-dir",-1164830301));
var thinking_level__$1 = knoxx.backend.domain.models.effective_thinking_level(config,model_id,(await (async function (){var or__5162__auto__ = knoxx.backend.domain.models.normalize_thinking_level(thinking_level);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = thinking_level;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "off";
}
}
}
})()));
var model_provider_id = (await (async function (){var or__5162__auto__ = (await (async function (){var G__29236 = knoxx.backend.domain.models.resolve_model_contract(config,model_id);
if((G__29236 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"provider","provider",-302056900).cljs$core$IFn$_invoke$arity$1(G__29236);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "proxx";
}
})());
var provider = knoxx.backend.infra.agent.provider.eta_mu.eta_mu_provider(runtime,config);
var model = provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$resolve_model$arity$5(null,model_registry,model_provider_id,model_id,new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764).cljs$core$IFn$_invoke$arity$1(config));
var allowed_tool_ids = knoxx.backend.infra.agent.tool_catalog.allowed_tool_ids(config,auth_context,agent_spec);
var tool_auth_context = knoxx.backend.infra.agent.tool_catalog.effective_tool_auth_context(auth_context,allowed_tool_ids);
var map__29234 = knoxx.backend.infra.agent.session.session_provider_tools(runtime,config,tool_auth_context,agent_spec,allowed_tool_ids,model_id,session_id,conversation_id);
var map__29234__$1 = cljs.core.__destructure_map(map__29234);
var custom_tools = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29234__$1,new cljs.core.Keyword(null,"custom-tools","custom-tools",-1003562280));
var tool_name_allowlist = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29234__$1,new cljs.core.Keyword(null,"tool-name-allowlist","tool-name-allowlist",2001315015));
var preferred_session_id = (await (async function (){var G__29247 = session_id;
var G__29247__$1 = (((G__29247 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29247)));
var G__29247__$2 = (((G__29247__$1 == null))?null:clojure.string.trim(G__29247__$1));
if((G__29247__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29247__$2);
}
})());
var message_source = knoxx.backend.infra.stores.composite_message_source.__GT_CompositeMessageSource(knoxx.backend.infra.stores.openplanner_message_source.__GT_OpenPlannerMessageSource(config),knoxx.backend.infra.stores.mongo_message_source.__GT_MongoMessageSource(preferred_session_id));
if(knoxx.backend.infra.http.no_content_QMARK_(model)){
return Promise.reject((new Error((""+"No eta-mu model configured for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)))));
} else {
var session_manager = knoxx.backend.extern.eta_mu.make_session_manager_BANG_(new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config),preferred_session_id);
knoxx.backend.extern.eta_mu.append_model_change_BANG_(session_manager,model_provider_id,model_id);

knoxx.backend.extern.eta_mu.append_thinking_level_change_BANG_(session_manager,thinking_level__$1);

var map__29251 = (await knoxx.backend.infra.agent.session.rehydrate_session_manager_BANG_(message_source,session_manager,conversation_id,agent_spec));
var map__29251__$1 = cljs.core.__destructure_map(map__29251);
var session_manager__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29251__$1,new cljs.core.Keyword(null,"session-manager","session-manager",-1140954467));
var session = (await provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$create_session_BANG_$arity$2(null,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"loader","loader",-462395423),new cljs.core.Keyword(null,"runtime-dir","runtime-dir",-1164830301),new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547),new cljs.core.Keyword(null,"settings-manager","settings-manager",-963975515),new cljs.core.Keyword(null,"tool-name-allowlist","tool-name-allowlist",2001315015),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"custom-tools","custom-tools",-1003562280),new cljs.core.Keyword(null,"model-registry","model-registry",483426168),new cljs.core.Keyword(null,"auth-storage","auth-storage",-2076734340),new cljs.core.Keyword(null,"session-manager","session-manager",-1140954467),new cljs.core.Keyword(null,"materialize!","materialize!",946822078),new cljs.core.Keyword(null,"model","model",331153215)],[loader,runtime_dir,new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config),settings_manager,tool_name_allowlist,thinking_level__$1,custom_tools,model_registry,auth_storage,session_manager__$1,knoxx.backend.infra.agent.session.materialize_BANG_,model])));
knoxx.backend.shape.agent.set_thinking_level_BANG_(session,thinking_level__$1);

return session;
}
}));

(knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$lang$maxFixedArity = 8);

knoxx.backend.infra.agent.session.construct_session_and_ext_ctx_BANG_ = (async function knoxx$backend$infra$agent$session$construct_session_and_ext_ctx_BANG_(runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,agent_spec,current_tool_signature,life_cycle_event_name){
var next_session = (await knoxx.backend.infra.agent.session.create_session_manager_BANG_.cljs$core$IFn$_invoke$arity$8(runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,agent_spec));
var ctx = knoxx.backend.domain.extension_runtime.build_extension_ctx.cljs$core$IFn$_invoke$arity$variadic(runtime,config,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"model-id","model-id",-467101728),model_id,new cljs.core.Keyword(null,"auth-context","auth-context",320032325),auth_context], 0));
knoxx.backend.domain.extension_runtime.dispatch_event(life_cycle_event_name,knoxx.backend.extern.extension.event_payload(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),conversation_id,new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),session_id], null)),ctx);

knoxx.backend.infra.agent.session.active_session_registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$put_active_session_BANG_$arity$3(null,conversation_id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"session","session",1008279103),next_session,new cljs.core.Keyword(null,"model-id","model-id",-467101728),model_id,new cljs.core.Keyword(null,"tool-signature","tool-signature",1310639957),current_tool_signature,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec)], null));

knoxx.backend.infra.agent.session.register_actor_live_route_BANG_(runtime,conversation_id,session_id,agent_spec);

return next_session;
});
knoxx.backend.infra.agent.session.ensure_agent_session_BANG_ = (function knoxx$backend$infra$agent$session$ensure_agent_session_BANG_(var_args){
var G__29267 = arguments.length;
switch (G__29267) {
case 4:
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
case 7:
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
case 8:
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$8((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]),(arguments[(7)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (runtime,config,conversation_id,model_id){
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$6(runtime,config,conversation_id,model_id,null,new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config));
}));

(knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (runtime,config,conversation_id,model_id,auth_context){
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$6(runtime,config,conversation_id,model_id,auth_context,new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config));
}));

(knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$6 = (function (runtime,config,conversation_id,model_id,auth_context,thinking_level){
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$7(runtime,config,conversation_id,model_id,auth_context,thinking_level,null);
}));

(knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$7 = (function (runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id){
return knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$8(runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,null);
}));

(knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$8 = (function (runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,agent_spec){
var thinking_level__$1 = knoxx.backend.domain.models.effective_thinking_level(config,model_id,(function (){var or__5162__auto__ = knoxx.backend.domain.models.normalize_thinking_level(thinking_level);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = thinking_level;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"agent-thinking-level","agent-thinking-level",1959324030).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "off";
}
}
}
})());
var current_tool_signature = knoxx.backend.infra.agent.session.visible_session_signature(runtime,config,auth_context,agent_spec);
var construct_this_session_BANG_ = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.agent.session.construct_session_and_ext_ctx_BANG_,runtime,config,conversation_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([model_id,auth_context,thinking_level__$1,session_id,agent_spec,current_tool_signature], 0));
var temp__5823__auto__ = knoxx.backend.infra.agent.session.active_session_entry(conversation_id);
if(cljs.core.truth_(temp__5823__auto__)){
var entry = temp__5823__auto__;
var session = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(entry);
var active_model = new cljs.core.Keyword(null,"model-id","model-id",-467101728).cljs$core$IFn$_invoke$arity$1(entry);
var active_tool_signature = new cljs.core.Keyword(null,"tool-signature","tool-signature",1310639957).cljs$core$IFn$_invoke$arity$1(entry);
if((((!((session == null)))) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(active_model)),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = active_tool_signature;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = current_tool_signature;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))))))){
knoxx.backend.shape.agent.set_thinking_level_BANG_(session,thinking_level__$1);

knoxx.backend.infra.agent.session.register_actor_live_route_BANG_(runtime,conversation_id,session_id,agent_spec);

return Promise.resolve(session);
} else {
return construct_this_session_BANG_("session_switch");
}
} else {
return construct_this_session_BANG_("session_start");
}
}));

(knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$lang$maxFixedArity = 8);

/**
 * Dispatch session_shutdown to extensions, then release the in-process session entry.
 */
knoxx.backend.infra.agent.session.remove_agent_session_BANG_ = (function knoxx$backend$infra$agent$session$remove_agent_session_BANG_(conversation_id){
var temp__5825__auto___29436 = knoxx.backend.infra.agent.session.active_session_entry(conversation_id);
if(cljs.core.truth_(temp__5825__auto___29436)){
var entry_29438 = temp__5825__auto___29436;
var ctx_29439 = knoxx.backend.domain.extension_runtime.build_extension_ctx.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.extern.extension.empty_event_payload(),cljs.core.PersistentArrayMap.EMPTY,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(entry_29438)], 0));
knoxx.backend.domain.extension_runtime.dispatch_event("session_shutdown",knoxx.backend.extern.extension.event_payload(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),conversation_id], null)),ctx_29439);
} else {
}

knoxx.backend.infra.agent.session.active_session_registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$remove_active_session_BANG_$arity$2(null,conversation_id);

return null;
});

//# sourceMappingURL=knoxx.backend.infra.agent.session.js.map
