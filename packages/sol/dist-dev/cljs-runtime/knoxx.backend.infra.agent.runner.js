import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.voice.turn_control.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.infra.system_instance.js";
import "./knoxx.backend.shape.agent.js";
import "./knoxx.backend.infra.agent.policy.js";
import "./knoxx.backend.infra.agent.turn.js";
import "./knoxx.backend.runtime.state.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.extern.agent_runner.js";
import "./knoxx.backend.extern.agent_turn_node.js";
goog.provide('knoxx.backend.infra.agent.runner');
knoxx.backend.infra.agent.runner.current_runtime = (function knoxx$backend$infra$agent$runner$current_runtime(){
return cljs.core.deref(knoxx.backend.runtime.state.runtime_STAR_);
});
knoxx.backend.infra.agent.runner.normalize_tool_policy = (function knoxx$backend$infra$agent$runner$normalize_tool_policy(policy){
var policy__$1 = knoxx.backend.extern.agent_runner.to_cljs_map(policy);
var tool_id = (function (){var G__29912 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"toolId","toolId",-1935596543).cljs$core$IFn$_invoke$arity$1(policy__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(policy__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"tool_id","tool_id",1550520216).cljs$core$IFn$_invoke$arity$1(policy__$1);
}
}
})();
var G__29912__$1 = (((G__29912 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29912)));
if((G__29912__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__29912__$1);
}
})();
var effect = (function (){var G__29917 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(policy__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "allow";
}
})();
var G__29917__$1 = (((G__29917 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29917)));
if((G__29917__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__29917__$1);
}
})();
if(cljs.core.truth_(tool_id)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),effect], null);
} else {
return null;
}
});
/**
 * Extract a normalized string value from a spec map given keyword alternatives.
 */
knoxx.backend.infra.agent.runner.spec_value = (function knoxx$backend$infra$agent$runner$spec_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___30073 = arguments.length;
var i__5898__auto___30074 = (0);
while(true){
if((i__5898__auto___30074 < len__5897__auto___30073)){
args__5903__auto__.push((arguments[i__5898__auto___30074]));

var G__30075 = (i__5898__auto___30074 + (1));
i__5898__auto___30074 = G__30075;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic = (function (spec,keys){
var G__29926 = cljs.core.some((function (k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(spec,k);
}),keys);
var G__29926__$1 = (((G__29926 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29926)));
if((G__29926__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__29926__$1);
}
}));

(knoxx.backend.infra.agent.runner.spec_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.infra.agent.runner.spec_value.cljs$lang$applyTo = (function (seq29920){
var G__29921 = cljs.core.first(seq29920);
var seq29920__$1 = cljs.core.next(seq29920);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__29921,seq29920__$1);
}));

knoxx.backend.infra.agent.runner.normalize_agent_spec = (function knoxx$backend$infra$agent$runner$normalize_agent_spec(value){
var spec = knoxx.backend.extern.agent_runner.to_cljs_map(value);
var contract_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"agent_id","agent_id",-1820880197),new cljs.core.Keyword(null,"agent-id","agent-id",1570348870),new cljs.core.Keyword(null,"agentId","agentId",2025355078)], 0));
var actor_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], 0));
var role = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"role_slug","role_slug",219656703),new cljs.core.Keyword(null,"role-slug","role-slug",-617706766),new cljs.core.Keyword(null,"roleSlug","roleSlug",-867274708)], 0));
var system_prompt = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})();
var task_prompt = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"task_prompt","task_prompt",1276696196).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})();
var task_source = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"task_source","task_source",-1353297465),new cljs.core.Keyword(null,"task-source","task-source",-270341262),new cljs.core.Keyword(null,"taskSource","taskSource",-1836581389)], 0));
var rendered_task_prompt = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rendered_task_prompt","rendered_task_prompt",-1449951109).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"rendered-task-prompt","rendered-task-prompt",-1157716887).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"renderedTaskPrompt","renderedTaskPrompt",-531402673).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})();
var deprecated_agent_task_fallback = cljs.core.boolean$((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"deprecated_agent_task_fallback","deprecated_agent_task_fallback",75079348).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"deprecated-agent-task-fallback","deprecated-agent-task-fallback",-1642366619).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"deprecatedAgentTaskFallback","deprecatedAgentTaskFallback",2029033525).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})());
var model = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"model","model",331153215)], 0));
var thinking_level = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429),new cljs.core.Keyword(null,"reasoning_effort","reasoning_effort",-375529027),new cljs.core.Keyword(null,"reasoning-effort","reasoning-effort",-1891634506),new cljs.core.Keyword(null,"reasoningEffort","reasoningEffort",1501429170)], 0));
var tool_policies = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.runner.normalize_tool_policy,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
}
})()));
var resource_policies = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"resource_policies","resource_policies",-1190579829).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"resourcePolicies","resourcePolicies",-1399026364).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})();
var sources = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"runtime_sources","runtime_sources",1950634872).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"runtime-sources","runtime-sources",1613079145).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"runtimeSources","runtimeSources",919462928).cljs$core$IFn$_invoke$arity$1(spec);
}
}
}
})();
var memory_hydration = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"memory_hydration","memory_hydration",-1458677455).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})();
var context_policy = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"context_policy","context_policy",1230169154).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(spec);
}
}
}
})();
var sub_agent_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792)], 0));
var parent_agent_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200)], 0));
var parent_run_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367),new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271)], 0));
var spawn_kind = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959),new cljs.core.Keyword(null,"spawnKind","spawnKind",1648184297)], 0));
var trigger_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),new cljs.core.Keyword(null,"triggerId","triggerId",-684068188)], 0));
var event_type = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"event_type","event_type",1569866042),new cljs.core.Keyword(null,"event-type","event-type",319722813),new cljs.core.Keyword(null,"eventType","eventType",-1525570624),new cljs.core.Keyword(null,"trigger_event_type","trigger_event_type",-1033685510),new cljs.core.Keyword(null,"trigger-event-type","trigger-event-type",463301244),new cljs.core.Keyword(null,"triggerEventType","triggerEventType",1990874681)], 0));
var event_types = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"event_types","event_types",-752038707).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"event-types","event-types",-81363635).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"eventTypes","eventTypes",-1966249997).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (cljs.core.truth_(event_type)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [event_type], null):null);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
}
}
})()))));
var event_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"event_id","event_id",-767275570),new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"eventId","eventId",378389360)], 0));
var event_scope_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009),new cljs.core.Keyword(null,"eventScopeId","eventScopeId",1980523873)], 0));
var schedule_id = knoxx.backend.infra.agent.runner.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193),new cljs.core.Keyword(null,"scheduleId","scheduleId",-959542790)], 0));
var G__29962 = cljs.core.PersistentArrayMap.EMPTY;
var G__29962__$1 = (cljs.core.truth_(contract_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),contract_id):G__29962);
var G__29962__$2 = (cljs.core.truth_(actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id):G__29962__$1);
var G__29962__$3 = (cljs.core.truth_(role)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$2,new cljs.core.Keyword(null,"role","role",-736691072),role):G__29962__$2);
var G__29962__$4 = (((!((system_prompt == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$3,new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),system_prompt):G__29962__$3);
var G__29962__$5 = (((!((task_prompt == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$4,new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),task_prompt):G__29962__$4);
var G__29962__$6 = (cljs.core.truth_(task_source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$5,new cljs.core.Keyword(null,"task-source","task-source",-270341262),task_source):G__29962__$5);
var G__29962__$7 = (((!((rendered_task_prompt == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$6,new cljs.core.Keyword(null,"rendered-task-prompt","rendered-task-prompt",-1157716887),rendered_task_prompt):G__29962__$6);
var G__29962__$8 = ((deprecated_agent_task_fallback)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$7,new cljs.core.Keyword(null,"deprecated-agent-task-fallback","deprecated-agent-task-fallback",-1642366619),true):G__29962__$7);
var G__29962__$9 = (cljs.core.truth_(model)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$8,new cljs.core.Keyword(null,"model","model",331153215),model):G__29962__$8);
var G__29962__$10 = (cljs.core.truth_(thinking_level)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$9,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),thinking_level):G__29962__$9);
var G__29962__$11 = ((cljs.core.seq(tool_policies))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$10,new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),tool_policies):G__29962__$10);
var G__29962__$12 = (cljs.core.truth_(resource_policies)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$11,new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874),resource_policies):G__29962__$11);
var G__29962__$13 = ((cljs.core.seq(sources))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$12,new cljs.core.Keyword(null,"sources","sources",-321166424),sources):G__29962__$12);
var G__29962__$14 = (cljs.core.truth_(memory_hydration)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$13,new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082),memory_hydration):G__29962__$13);
var G__29962__$15 = (cljs.core.truth_(context_policy)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$14,new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557),context_policy):G__29962__$14);
var G__29962__$16 = (cljs.core.truth_(sub_agent_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$15,new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),sub_agent_id):G__29962__$15);
var G__29962__$17 = (cljs.core.truth_(parent_agent_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$16,new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),parent_agent_id):G__29962__$16);
var G__29962__$18 = (cljs.core.truth_(parent_run_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$17,new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367),parent_run_id):G__29962__$17);
var G__29962__$19 = (cljs.core.truth_(spawn_kind)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$18,new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959),spawn_kind):G__29962__$18);
var G__29962__$20 = (cljs.core.truth_(trigger_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$19,new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),trigger_id):G__29962__$19);
var G__29962__$21 = (cljs.core.truth_(event_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$20,new cljs.core.Keyword(null,"event-type","event-type",319722813),event_type):G__29962__$20);
var G__29962__$22 = ((cljs.core.seq(event_types))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$21,new cljs.core.Keyword(null,"event-types","event-types",-81363635),event_types):G__29962__$21);
var G__29962__$23 = (cljs.core.truth_(event_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$22,new cljs.core.Keyword(null,"event-id","event-id",2130210178),event_id):G__29962__$22);
var G__29962__$24 = (cljs.core.truth_(event_scope_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$23,new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009),event_scope_id):G__29962__$23);
if(cljs.core.truth_(schedule_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29962__$24,new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193),schedule_id);
} else {
return G__29962__$24;
}
});
knoxx.backend.infra.agent.runner.direct_start_payload__GT_turn_params = (function knoxx$backend$infra$agent$runner$direct_start_payload__GT_turn_params(payload){
var payload__$1 = knoxx.backend.extern.agent_runner.to_cljs_map(payload);
var auth_context = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"auth_context","auth_context",-1323760790).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
})();
var template_context = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"template_context","template_context",-471388281).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"template-context","template-context",-946500342).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"templateContext","templateContext",-1162427352).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
}
})();
var G__29980 = new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
})(),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
})(),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
})(),new cljs.core.Keyword(null,"message","message",-406056002),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"content-parts","content-parts",684529019),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"content-parts","content-parts",684529019).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})(),new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(payload__$1),new cljs.core.Keyword(null,"mode","mode",654403691),"direct",new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),knoxx.backend.infra.agent.runner.normalize_agent_spec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
})())], null);
var G__29980__$1 = (cljs.core.truth_(template_context)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29980,new cljs.core.Keyword(null,"template-context","template-context",-946500342),template_context):G__29980);
if(cljs.core.truth_(auth_context)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29980__$1,new cljs.core.Keyword(null,"auth-context","auth-context",320032325),auth_context);
} else {
return G__29980__$1;
}
});
knoxx.backend.infra.agent.runner.policy_model = (function knoxx$backend$infra$agent$runner$policy_model(config,body){
var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764).cljs$core$IFn$_invoke$arity$1(config);
}
}
}
});
knoxx.backend.infra.agent.runner.accepted_response = (function knoxx$backend$infra$agent$runner$accepted_response(body){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"queued","queued",1701634607),true,new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"model","model",331153215),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
}
})()], null);
});
knoxx.backend.infra.agent.runner.log_and_record_async_spawn_error_BANG_ = (function knoxx$backend$infra$agent$runner$log_and_record_async_spawn_error_BANG_(body,err){
var diagnostic = knoxx.backend.extern.agent_runner.error_diagnostic(body,err);
var run_id = new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(body);
var conversation_id = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body);
var session_id = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body);
var event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"async_spawn_failed",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(diagnostic),new cljs.core.Keyword(null,"diagnostic","diagnostic",901076516),diagnostic], null));
knoxx.backend.extern.agent_runner.log_async_spawn_error_BANG_(body,err);

if(cljs.core.truth_(run_id)){
knoxx.backend.domain.action.run_state.update_run_BANG_(run_id,(function (run){
var G__29999 = run;
if(cljs.core.truth_(run)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__29999,new cljs.core.Keyword(null,"status","status",-1997798413),"failed",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(diagnostic)], 0));
} else {
return G__29999;
}
}));

knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,event);
} else {
}

return diagnostic;
});
knoxx.backend.infra.agent.runner.send_turn_and_record_BANG_ = (async function knoxx$backend$infra$agent$runner$send_turn_and_record_BANG_(runtime,config,body){
try{(await knoxx.backend.infra.agent.turn.send_agent_turn_BANG_(runtime,config,body));

return null;
}catch (e30015){var err = e30015;
return knoxx.backend.infra.agent.runner.log_and_record_async_spawn_error_BANG_(body,err);
}});
knoxx.backend.infra.agent.runner.queue_turn_BANG_ = (async function knoxx$backend$infra$agent$runner$queue_turn_BANG_(runtime,config,body){
(await knoxx.backend.infra.agent.policy.validate_chat_policy_BANG_(new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(body),knoxx.backend.infra.agent.runner.policy_model(config,body)));

knoxx.backend.infra.agent.runner.send_turn_and_record_BANG_(runtime,config,body);

return knoxx.backend.infra.agent.runner.accepted_response(body);
});
knoxx.backend.infra.agent.runner.busy_error = (function knoxx$backend$infra$agent$runner$busy_error(message){
return Promise.reject((new Error(message)));
});
knoxx.backend.infra.agent.runner.DISPATCH_RECLAIM_COOLDOWN_MS = (60000);
/**
 * True when this process is actively executing work for the conversation.
 */
knoxx.backend.infra.agent.runner.runtime_owns_live_run_QMARK_ = (function knoxx$backend$infra$agent$runner$runtime_owns_live_run_QMARK_(conversation_id){
var agent_session = knoxx.backend.infra.agent.session.active_agent_session(conversation_id);
var or__5162__auto__ = (function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(agent_session);
} else {
return and__5160__auto__;
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (!((knoxx.backend.domain.voice.turn_control.active_turn(conversation_id) == null)));
}
});
/**
 * Best-effort epoch millis of the session document's last update.
 */
knoxx.backend.infra.agent.runner.session_updated_ms = (function knoxx$backend$infra$agent$runner$session_updated_ms(session){
var ts = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(session);
}
})();
if(typeof ts === 'number'){
return ts;
} else {
if(typeof ts === 'string'){
var ms = (new Date(ts)).getTime();
if(cljs.core.truth_(isNaN(ms))){
return (0);
} else {
return ms;
}
} else {
return (0);

}
}
});
/**
 * True when the document is old enough that a live-but-unregistered run
 * (e.g. one orphaned in-memory by a hot reload) cannot plausibly own it.
 */
knoxx.backend.infra.agent.runner.session_cold_QMARK_ = (function knoxx$backend$infra$agent$runner$session_cold_QMARK_(session){
return ((Date.now() - knoxx.backend.infra.agent.runner.session_updated_ms(session)) >= knoxx.backend.infra.agent.runner.DISPATCH_RECLAIM_COOLDOWN_MS);
});
/**
 * Mark a running session document that no live run owns as failed so the
 * pending dispatch can proceed. Returns true on success; failures are
 * logged and the caller falls through to the normal busy error.
 */
knoxx.backend.infra.agent.runner.reclaim_orphaned_session_BANG_ = (async function knoxx$backend$infra$agent$runner$reclaim_orphaned_session_BANG_(body,session,reason){
try{console.warn("[agent-runner] reclaiming orphaned session",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body))),"-",reason);

(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body))),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),(""+"Session reclaimed by dispatch: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(reason)),new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session)], null)));

return true;
}catch (e30048){var err = e30048;
console.warn("[agent-runner] orphan reclaim failed:",err);

return false;
}});
/**
 * Reclaim an orphaned running session, then dispatch the pending turn.
 */
knoxx.backend.infra.agent.runner.reclaim_and_dispatch_BANG_ = (async function knoxx$backend$infra$agent$runner$reclaim_and_dispatch_BANG_(runtime,config,body,session,reason){
(await knoxx.backend.infra.agent.runner.reclaim_orphaned_session_BANG_(body,session,reason));

return (await knoxx.backend.infra.agent.runner.queue_turn_BANG_(runtime,config,body));
});
/**
 * Resolve the session busy-gate for a direct spawn.
 * 
 * running + stamped by a previous system instance  → reclaim, dispatch
 * running + no live run here + document gone cold  → reclaim, dispatch
 * running + live run in this instance              → busy error
 * otherwise                                        → dispatch
 */
knoxx.backend.infra.agent.runner.dispatch_with_session_gate_BANG_ = (async function knoxx$backend$infra$agent$runner$dispatch_with_session_gate_BANG_(runtime,config,body){
var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body)));
var can_send_result = knoxx.backend.infra.stores.mongo_session_store.session_can_send_QMARK_(session);
var conversation_id = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body);
var agent_session = knoxx.backend.infra.agent.session.active_agent_session(conversation_id);
if(cljs.core.truth_(new cljs.core.Keyword(null,"can-send","can-send",-704220819).cljs$core$IFn$_invoke$arity$1(can_send_result))){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(agent_session);
} else {
return and__5160__auto__;
}
})()))){
return (await knoxx.backend.infra.agent.runner.busy_error("agent_already_processing: active stream"));
} else {
return (await knoxx.backend.infra.agent.runner.queue_turn_BANG_(runtime,config,body));
}
} else {
if((!(knoxx.backend.infra.system_instance.owned_by_current_instance_QMARK_(session)))){
return (await knoxx.backend.infra.agent.runner.reclaim_and_dispatch_BANG_(runtime,config,body,session,"owned by previous system instance (restart)"));
} else {
if(((cljs.core.not(knoxx.backend.infra.agent.runner.runtime_owns_live_run_QMARK_(conversation_id))) && (knoxx.backend.infra.agent.runner.session_cold_QMARK_(session)))){
return (await knoxx.backend.infra.agent.runner.reclaim_and_dispatch_BANG_(runtime,config,body,session,"no live run in current system instance"));
} else {
return (await knoxx.backend.infra.agent.runner.busy_error((""+"agent_already_processing: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"reason","reason",-2070751759).cljs$core$IFn$_invoke$arity$1(can_send_result)))));

}
}
}
});
knoxx.backend.infra.agent.runner.normalize_body = (function knoxx$backend$infra$agent$runner$normalize_body(_runtime,payload){
var params = knoxx.backend.infra.agent.runner.direct_start_payload__GT_turn_params(payload);
var provided_session_id = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(params);
var session_id = knoxx.backend.infra.agent.turn.ensure_session_id(provided_session_id);
var conversation_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(params);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_turn_node.random_uuid_BANG_();
}
})();
var run_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(params);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_turn_node.random_uuid_BANG_();
}
})();
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(params,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"mode","mode",654403691),"direct"], 0));
});
knoxx.backend.infra.agent.runner.spawn_direct_BANG_ = (function knoxx$backend$infra$agent$runner$spawn_direct_BANG_(var_args){
var G__30069 = arguments.length;
switch (G__30069) {
case 2:
return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (config,payload){
return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.agent.runner.current_runtime(),config,payload);
}));

(knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,payload){
if(cljs.core.not(runtime)){
return knoxx.backend.infra.agent.runner.busy_error("Knoxx runtime unavailable for direct agent spawn");
} else {
var payload__$1 = knoxx.backend.extern.agent_runner.to_cljs_map(payload);
var body = knoxx.backend.infra.agent.runner.normalize_body(runtime,payload__$1);
var provided_session_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(payload__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(payload__$1);
}
})();
if(cljs.core.not(provided_session_id)){
return knoxx.backend.infra.agent.runner.queue_turn_BANG_(runtime,config,body);
} else {
return knoxx.backend.infra.agent.runner.dispatch_with_session_gate_BANG_(runtime,config,body);
}
}
}));

(knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.agent.runner.js.map
