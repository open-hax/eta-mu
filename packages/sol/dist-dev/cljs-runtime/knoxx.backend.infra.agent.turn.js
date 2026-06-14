import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.hydration.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.infra.agent.message.js";
import "./knoxx.backend.extern.agent_turn_media.js";
import "./knoxx.backend.extern.agent_turn_node.js";
import "./knoxx.backend.extern.agent_turn_prompt.js";
import "./knoxx.backend.extern.agent_turn_result.js";
import "./knoxx.backend.extern.promise.js";
import "./knoxx.backend.domain.agent.agent_templates.js";
import "./knoxx.backend.domain.agent.content.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.infra.agent.policy.js";
import "./knoxx.backend.infra.agent.stream.js";
import "./knoxx.backend.infra.agent.transcript.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.core_memory.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.infra.openplanner.memory.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.shape.agent.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.infra.stores.session_store_registry.js";
import "./knoxx.backend.shape.session_persistence.js";
import "./knoxx.backend.infra.stores.session_titles.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.voice.turn_control.js";
import "./knoxx.backend.domain.agent.agent_context.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.agent.turn');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.turn !== 'undefined') && (typeof knoxx.backend.infra.agent.turn.conversation_access_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.turn.conversation_access_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.turn !== 'undefined') && (typeof knoxx.backend.infra.agent.turn.lounge_messages_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.turn.lounge_messages_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
}
knoxx.backend.infra.agent.turn.ensure_conversation_access_BANG_ = (function knoxx$backend$infra$agent$turn$ensure_conversation_access_BANG_(ctx,conversation_id){
return knoxx.backend.infra.auth.authz.ensure_conversation_access_BANG_(knoxx.backend.infra.agent.turn.conversation_access_STAR_,ctx,conversation_id);
});
knoxx.backend.infra.agent.turn.remember_conversation_access_BANG_ = (function knoxx$backend$infra$agent$turn$remember_conversation_access_BANG_(ctx,conversation_id){
return knoxx.backend.infra.auth.authz.remember_conversation_access_BANG_(knoxx.backend.infra.agent.turn.conversation_access_STAR_,ctx,conversation_id);
});
knoxx.backend.infra.agent.turn.auth_context_for_agent_turn = (function knoxx$backend$infra$agent$turn$auth_context_for_agent_turn(auth_context,agent_spec){
var agent_actor_id = (function (){var G__29399 = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29399__$1 = (((G__29399 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29399)));
var G__29399__$2 = (((G__29399__$1 == null))?null:clojure.string.trim(G__29399__$1));
if((G__29399__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29399__$2);
}
})();
var needs_context_QMARK_ = (function (){var or__5162__auto__ = auth_context;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = agent_actor_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.seq(new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(or__5162__auto____$2){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
}
}
})();
if(cljs.core.truth_(needs_context_QMARK_)){
var G__29413 = (function (){var or__5162__auto__ = auth_context;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var G__29413__$1 = (cljs.core.truth_(agent_actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29413,new cljs.core.Keyword(null,"actorId","actorId",989542370),agent_actor_id):G__29413);
var G__29413__$2 = (((((auth_context == null)) && (cljs.core.seq(new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(agent_spec)))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29413__$1,new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),cljs.core.vec(new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(agent_spec))):G__29413__$1);
if(cljs.core.truth_((function (){var and__5160__auto__ = (auth_context == null);
if(and__5160__auto__){
return new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec);
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29413__$2,new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec)], null));
} else {
return G__29413__$2;
}
} else {
return null;
}
});
knoxx.backend.infra.agent.turn.ensure_session_id = (function knoxx$backend$infra$agent$turn$ensure_session_id(session_id){
var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank(session_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_turn_node.random_uuid_BANG_();
}
});
knoxx.backend.infra.agent.turn.agent_spec_summary = (function knoxx$backend$infra$agent$turn$agent_spec_summary(agent_spec){
if(cljs.core.truth_(agent_spec)){
var G__29455 = cljs.core.PersistentArrayMap.EMPTY;
var G__29455__$1 = (cljs.core.truth_(new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455,new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455);
var G__29455__$2 = (cljs.core.truth_(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$1,new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$1);
var G__29455__$3 = ((cljs.core.seq(new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049).cljs$core$IFn$_invoke$arity$1(agent_spec)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$2,new cljs.core.Keyword(null,"contractActors","contractActors",47284059),cljs.core.vec(new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049).cljs$core$IFn$_invoke$arity$1(agent_spec))):G__29455__$2);
var G__29455__$4 = (cljs.core.truth_(new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$3,new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$3);
var G__29455__$5 = (cljs.core.truth_(new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$4,new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$4);
var G__29455__$6 = (cljs.core.truth_(new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$5,new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$5);
var G__29455__$7 = (cljs.core.truth_(new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$6,new cljs.core.Keyword(null,"hasSystemPrompt","hasSystemPrompt",1356421777),true):G__29455__$6);
var G__29455__$8 = ((cljs.core.seq(new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(agent_spec)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$7,new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),cljs.core.vec(new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(agent_spec))):G__29455__$7);
var G__29455__$9 = (cljs.core.truth_(new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$8,new cljs.core.Keyword(null,"resourcePolicies","resourcePolicies",-1399026364),new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$8);
var G__29455__$10 = (cljs.core.truth_(new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$9,new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353),new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$9);
var G__29455__$11 = (cljs.core.truth_(new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$10,new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$10);
var G__29455__$12 = (cljs.core.truth_(new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$11,new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$11);
var G__29455__$13 = (cljs.core.truth_(new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$12,new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271),new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$12);
var G__29455__$14 = (cljs.core.truth_(new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$13,new cljs.core.Keyword(null,"spawnKind","spawnKind",1648184297),new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$13);
var G__29455__$15 = (cljs.core.truth_(new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$14,new cljs.core.Keyword(null,"triggerId","triggerId",-684068188),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$14);
var G__29455__$16 = (cljs.core.truth_(new cljs.core.Keyword(null,"event-type","event-type",319722813).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$15,new cljs.core.Keyword(null,"eventType","eventType",-1525570624),new cljs.core.Keyword(null,"event-type","event-type",319722813).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$15);
var G__29455__$17 = ((cljs.core.seq(new cljs.core.Keyword(null,"event-types","event-types",-81363635).cljs$core$IFn$_invoke$arity$1(agent_spec)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$16,new cljs.core.Keyword(null,"eventTypes","eventTypes",-1966249997),cljs.core.vec(new cljs.core.Keyword(null,"event-types","event-types",-81363635).cljs$core$IFn$_invoke$arity$1(agent_spec))):G__29455__$16);
var G__29455__$18 = (cljs.core.truth_(new cljs.core.Keyword(null,"event-id","event-id",2130210178).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$17,new cljs.core.Keyword(null,"eventId","eventId",378389360),new cljs.core.Keyword(null,"event-id","event-id",2130210178).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$17);
var G__29455__$19 = (cljs.core.truth_(new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$18,new cljs.core.Keyword(null,"eventScopeId","eventScopeId",1980523873),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$18);
var G__29455__$20 = (cljs.core.truth_(new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$19,new cljs.core.Keyword(null,"scheduleId","scheduleId",-959542790),new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$19);
var G__29455__$21 = (cljs.core.truth_(new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$20,new cljs.core.Keyword(null,"taskSource","taskSource",-1836581389),new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29455__$20);
var G__29455__$22 = (cljs.core.truth_(new cljs.core.Keyword(null,"rendered-task-prompt","rendered-task-prompt",-1157716887).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$21,new cljs.core.Keyword(null,"hasRenderedTaskPrompt","hasRenderedTaskPrompt",269636783),true):G__29455__$21);
if(cljs.core.truth_(new cljs.core.Keyword(null,"deprecated-agent-task-fallback","deprecated-agent-task-fallback",-1642366619).cljs$core$IFn$_invoke$arity$1(agent_spec))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29455__$22,new cljs.core.Keyword(null,"deprecatedAgentTaskFallback","deprecatedAgentTaskFallback",2029033525),true);
} else {
return G__29455__$22;
}
} else {
return null;
}
});
knoxx.backend.infra.agent.turn.build_initial_run = (function knoxx$backend$infra$agent$turn$build_initial_run(run_id,session_id,conversation_id,started_at,model_id,mode,thinking_level,agent_spec,auth_extra,request_messages,config){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"events","events",1792552201),new cljs.core.Keyword(null,"input_tokens","input_tokens",490797322),new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067),new cljs.core.Keyword(null,"settings","settings",1556144875),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"tokens_per_s","tokens_per_s",1005457231),new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"request_messages","request_messages",-1334174565),new cljs.core.Keyword(null,"resources","resources",1632806811),new cljs.core.Keyword(null,"created_at","created_at",1484050750),new cljs.core.Keyword(null,"output_tokens","output_tokens",-1339146498),new cljs.core.Keyword(null,"model","model",331153215)],[cljs.core.PersistentVector.EMPTY,null,cljs.core.PersistentVector.EMPTY,run_id,cljs.core.PersistentVector.EMPTY,null,cljs.core.PersistentVector.EMPTY,(function (){var G__29503 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),session_id,new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),conversation_id,new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429),thinking_level,new cljs.core.Keyword(null,"workspaceRoot","workspaceRoot",493714538),new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config)], null);
if(cljs.core.truth_(agent_spec)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29503,new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),knoxx.backend.infra.agent.turn.agent_spec_summary(agent_spec));
} else {
return G__29503;
}
})(),session_id,conversation_id,null,null,started_at,"running",null,null,request_messages,(function (){var G__29508 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"provider","provider",-302056900),"proxx",new cljs.core.Keyword(null,"collection","collection",-683361892),new cljs.core.Keyword(null,"collection-name","collection-name",600435477).cljs$core$IFn$_invoke$arity$1(config)], null);
if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(agent_spec,new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29508,new cljs.core.Keyword(null,"agentResourcePolicies","agentResourcePolicies",-1357376229),cljs.core.get.cljs$core$IFn$_invoke$arity$2(agent_spec,new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874)));
} else {
return G__29508;
}
})(),started_at,null,model_id]),auth_extra], 0));
});
knoxx.backend.infra.agent.turn.emit_action_task_rendered_event_BANG_ = (function knoxx$backend$infra$agent$turn$emit_action_task_rendered_event_BANG_(run_id,conversation_id,session_id,agent_spec){
var temp__5825__auto__ = knoxx.backend.domain.agent.content.nonblank(new cljs.core.Keyword(null,"rendered-task-prompt","rendered-task-prompt",-1157716887).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(temp__5825__auto__)){
var rendered_task = temp__5825__auto__;
var task_event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"action_task_rendered",(function (){var G__29518 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"preview","preview",451279890),rendered_task], null);
var G__29518__$1 = (cljs.core.truth_(new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29518,new cljs.core.Keyword(null,"task_source","task_source",-1353297465),new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29518);
var G__29518__$2 = (cljs.core.truth_(new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(agent_spec))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29518__$1,new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(agent_spec)):G__29518__$1);
if(cljs.core.truth_(new cljs.core.Keyword(null,"deprecated-agent-task-fallback","deprecated-agent-task-fallback",-1642366619).cljs$core$IFn$_invoke$arity$1(agent_spec))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29518__$2,new cljs.core.Keyword(null,"deprecated_agent_task_fallback","deprecated_agent_task_fallback",75079348),true);
} else {
return G__29518__$2;
}
})());
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,task_event);

return knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",task_event);
} else {
return null;
}
});
knoxx.backend.infra.agent.turn.install_openplanner_event_sink_BANG_ = (function knoxx$backend$infra$agent$turn$install_openplanner_event_sink_BANG_(config){
return knoxx.backend.domain.action.run_state.set_event_stream_sink_BANG_((async function (event){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))){
try{return (await knoxx.backend.infra.clients.openplanner.events_BANG_(client,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697)],["system",event,new cljs.core.Keyword(null,"at","at",1476951349).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(event))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(event))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"at","at",1476951349).cljs$core$IFn$_invoke$arity$1(event))),(""+"knoxx."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(event))),new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(event),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(event))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(event))?(""+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(event))):null))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(new cljs.core.Keyword(null,"preview","preview",451279890).cljs$core$IFn$_invoke$arity$1(event))?(""+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"preview","preview",451279890).cljs$core$IFn$_invoke$arity$1(event))):null)))]))], null)));
}catch (e29525){var _ = e29525;
return null;
}} else {
return null;
}
}));
});
knoxx.backend.infra.agent.turn.persist_initial_run_BANG_ = (async function knoxx$backend$infra$agent$turn$persist_initial_run_BANG_(store,base_run,run_id){
try{return (await knoxx.backend.shape.session_persistence.put_run_BANG_(store,base_run));
}catch (e29536){var err = e29536;
return console.warn("[turn] failed to persist initial run",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.ex_message(err),new cljs.core.Keyword(null,"error-data","error-data",-629352026),cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = cljs.core.ex_data(err);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()))], null)));
}});
knoxx.backend.infra.agent.turn.persist_initial_session_BANG_ = (async function knoxx$backend$infra$agent$turn$persist_initial_session_BANG_(session_payload,session_id){
try{return (await knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$1(session_payload));
}catch (e29546){var err = e29546;
return console.error("[turn] failed to persist initial session",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.ex_message(err),new cljs.core.Keyword(null,"error-data","error-data",-629352026),cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = cljs.core.ex_data(err);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()))], null)));
}});
knoxx.backend.infra.agent.turn.create_initial_run_BANG_ = (function knoxx$backend$infra$agent$turn$create_initial_run_BANG_(run_id,session_id,conversation_id,started_at,model_id,mode,thinking_level,agent_spec,auth_extra,request_messages,config){
var base_run = knoxx.backend.infra.agent.turn.build_initial_run(run_id,session_id,conversation_id,started_at,model_id,mode,thinking_level,agent_spec,auth_extra,request_messages,config);
knoxx.backend.domain.action.run_state.store_run_BANG_(run_id,base_run);

var temp__5825__auto___29924 = cljs.core.deref(knoxx.backend.infra.stores.session_store_registry.session_store_STAR_);
if(cljs.core.truth_(temp__5825__auto___29924)){
var store_29927 = temp__5825__auto___29924;
knoxx.backend.infra.agent.turn.persist_initial_run_BANG_(store_29927,base_run,run_id);
} else {
}

knoxx.backend.infra.agent.turn.install_openplanner_event_sink_BANG_(config);

knoxx.backend.infra.agent.turn.persist_initial_session_BANG_(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var G__29569 = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),new cljs.core.Keyword(null,"created_at","created_at",1484050750),new cljs.core.Keyword(null,"model","model",331153215)],[run_id,mode,session_id,conversation_id,thinking_level,started_at,request_messages,"running",false,started_at,model_id]);
if(cljs.core.truth_(agent_spec)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29569,new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),knoxx.backend.infra.agent.turn.agent_spec_summary(agent_spec));
} else {
return G__29569;
}
})(),auth_extra], 0)),session_id);

var initial_event_29930 = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"run_started",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"model","model",331153215),model_id,new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069),thinking_level], null));
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,initial_event_29930);

knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",initial_event_29930);

return knoxx.backend.infra.agent.turn.emit_action_task_rendered_event_BANG_(run_id,conversation_id,session_id,agent_spec);
});
/**
 * Extract the final answer and reasoning text from streaming state and assistant message.
 */
knoxx.backend.infra.agent.turn.extract_turn_answer_and_reasoning = (function knoxx$backend$infra$agent$turn$extract_turn_answer_and_reasoning(state,assistant_message){
var answer = (function (){var chunked = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.deref(new cljs.core.Keyword(null,"chunks","chunks",83720431).cljs$core$IFn$_invoke$arity$1(state)));
if(clojure.string.blank_QMARK_(chunked)){
return knoxx.backend.domain.text.assistant_message_text(assistant_message);
} else {
return chunked;
}
})();
var reasoning_text = (function (){var streamed = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.deref(new cljs.core.Keyword(null,"reasoning-chunks","reasoning-chunks",-526618091).cljs$core$IFn$_invoke$arity$1(state)));
var final_reasoning = knoxx.backend.domain.text.assistant_message_reasoning_text(assistant_message);
if(((clojure.string.blank_QMARK_(streamed)) && ((!(clojure.string.blank_QMARK_(final_reasoning)))))){
return final_reasoning;
} else {
if((((!(clojure.string.blank_QMARK_(final_reasoning)))) && ((cljs.core.count(final_reasoning) > cljs.core.count(streamed))))){
return final_reasoning;
} else {
return streamed;

}
}
})();
var think_split = ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(reasoning_text))))?knoxx.backend.infra.agent.message.split_think_tags(answer):null);
var answer__$1 = (cljs.core.truth_((function (){var and__5160__auto__ = think_split;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"hadThinkTags","hadThinkTags",-1568024818).cljs$core$IFn$_invoke$arity$1(think_split);
} else {
return and__5160__auto__;
}
})())?new cljs.core.Keyword(null,"answer","answer",-742633163).cljs$core$IFn$_invoke$arity$1(think_split):answer);
var reasoning_text__$1 = (cljs.core.truth_((function (){var and__5160__auto__ = think_split;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"hadThinkTags","hadThinkTags",-1568024818).cljs$core$IFn$_invoke$arity$1(think_split);
} else {
return and__5160__auto__;
}
})())?new cljs.core.Keyword(null,"reasoning","reasoning",1956143595).cljs$core$IFn$_invoke$arity$1(think_split):reasoning_text);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"answer","answer",-742633163),answer__$1,new cljs.core.Keyword(null,"reasoning-text","reasoning-text",747588637),reasoning_text__$1], null);
});
/**
 * Build the final response map for a completed turn.
 */
knoxx.backend.infra.agent.turn.build_turn_completed_response = (function knoxx$backend$infra$agent$turn$build_turn_completed_response(run_id,conversation_id,session_id,model_id,answer,merged_content_parts,sources,message_parts){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"runId","runId",505587730),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"compare","compare",-530677770),new cljs.core.Keyword(null,"message_parts","message_parts",-1030507719),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),new cljs.core.Keyword(null,"model","model",331153215)],[merged_content_parts,run_id,sources,session_id,conversation_id,run_id,answer,null,message_parts,conversation_id,model_id]);
});
knoxx.backend.infra.agent.turn.finalize_run_record_BANG_ = (function knoxx$backend$infra$agent$turn$finalize_run_record_BANG_(run_id,answer,reasoning_text,sources,elapsed,usage_tokens,assistant_content_parts,hydration,memory_hydration){
return knoxx.backend.domain.action.run_state.update_run_BANG_(run_id,(function (run){
var resource_patch = (function (){var G__29609 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sources","sources",-321166424),sources], null);
var G__29609__$1 = (cljs.core.truth_(hydration)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29609,new cljs.core.Keyword(null,"passiveHydration","passiveHydration",-884994907),cljs.core.select_keys(hydration,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.Keyword(null,"tokens","tokens",-818939304),new cljs.core.Keyword(null,"database","database",1849087575),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486),new cljs.core.Keyword(null,"results","results",-1134170113)], null))):G__29609);
if(cljs.core.truth_(memory_hydration)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29609__$1,new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759),cljs.core.select_keys(memory_hydration,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"hits","hits",-2120002930),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996)], null)));
} else {
return G__29609__$1;
}
})();
var merged_content_parts = knoxx.backend.domain.agent.content.merge_content_parts.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([assistant_content_parts,knoxx.backend.domain.agent.content.reply_attachment_content_parts(new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067).cljs$core$IFn$_invoke$arity$1(run))], 0));
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(run,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),elapsed,new cljs.core.Keyword(null,"input_tokens","input_tokens",490797322),new cljs.core.Keyword(null,"input-tokens","input-tokens",-1422664530).cljs$core$IFn$_invoke$arity$1(usage_tokens),new cljs.core.Keyword(null,"output_tokens","output_tokens",-1339146498),new cljs.core.Keyword(null,"output-tokens","output-tokens",-1759201012).cljs$core$IFn$_invoke$arity$1(usage_tokens),new cljs.core.Keyword(null,"tokens_per_s","tokens_per_s",1005457231),(((((new cljs.core.Keyword(null,"output-tokens","output-tokens",-1759201012).cljs$core$IFn$_invoke$arity$1(usage_tokens) > (0))) && ((elapsed > (0)))))?((1000) * (new cljs.core.Keyword(null,"output-tokens","output-tokens",-1759201012).cljs$core$IFn$_invoke$arity$1(usage_tokens) / elapsed)):null),new cljs.core.Keyword(null,"answer","answer",-742633163),answer,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),merged_content_parts,new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),reasoning_text,new cljs.core.Keyword(null,"sources","sources",-321166424),sources], 0)),new cljs.core.Keyword(null,"resources","resources",1632806811),cljs.core.merge,resource_patch);
}));
});
knoxx.backend.infra.agent.turn.empty_turn_output_QMARK_ = (function knoxx$backend$infra$agent$turn$empty_turn_output_QMARK_(answer,completed_run,merged_content_parts){
return ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(answer)))) && (((cljs.core.empty_QMARK_((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067).cljs$core$IFn$_invoke$arity$1(completed_run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())) && (cljs.core.empty_QMARK_((function (){var or__5162__auto__ = merged_content_parts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())))));
});
knoxx.backend.infra.agent.turn.finalize_empty_turn_output_BANG_ = (async function knoxx$backend$infra$agent$turn$finalize_empty_turn_output_BANG_(config,state,session,run_id,conversation_id,session_id,started_ms,model_id,hydration,memory_hydration,persisted_request_messages,agent_spec,completed_run,merged_content_parts){
var err = (new Error("Agent turn completed without assistant text, tool calls, or content parts"));
var diagnostic = knoxx.backend.domain.error_observatory.log_error_BANG_(new cljs.core.Keyword("agent-turn","empty-output","agent-turn/empty-output",1338433692),new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"model","model",331153215),model_id,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(agent_spec),new cljs.core.Keyword(null,"task-source","task-source",-270341262),new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(agent_spec)], null),err);
var err_text = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(diagnostic);
var failed_event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"run_failed",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),err_text,new cljs.core.Keyword(null,"reason","reason",-2070751759),"empty_output"], null));
var failed_run = knoxx.backend.domain.action.run_state.update_run_BANG_(run_id,(function (run){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(run,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),(Date.now() - started_ms),new cljs.core.Keyword(null,"error","error",-978969032),err_text,new cljs.core.Keyword(null,"reason","reason",-2070751759),"empty_output"], 0));
}));
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,failed_event);

knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",failed_event);

if(cljs.core.truth_(failed_run)){
knoxx.backend.infra.openplanner.memory.index_run_memory_BANG_(config,failed_run,knoxx.backend.infra.core_memory.extract_mentioned_devel_paths,knoxx.backend.infra.core_memory.extract_mentioned_urls);
} else {
}

var final_messages_29964 = knoxx.backend.infra.agent.session.prune_session_messages(agent_spec,knoxx.backend.infra.agent.transcript.transcript_after_turn(session,persisted_request_messages));
(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3(session_id,conversation_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),err_text,new cljs.core.Keyword(null,"messages","messages",345434482),final_messages_29964], null)));

knoxx.backend.domain.action.run_state.clear_event_stream_sink_BANG_();

knoxx.backend.infra.agent.session.remove_agent_session_BANG_(conversation_id);

return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"runId","runId",505587730),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"compare","compare",-530677770),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"message_parts","message_parts",-1030507719),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),new cljs.core.Keyword(null,"model","model",331153215)],[merged_content_parts,run_id,new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(completed_run),session_id,conversation_id,run_id,"",null,err_text,cljs.core.PersistentVector.EMPTY,conversation_id,model_id]);
});
knoxx.backend.infra.agent.turn.finalize_turn_success_BANG_ = (async function knoxx$backend$infra$agent$turn$finalize_turn_success_BANG_(config,state,session,run_id,conversation_id,session_id,started_ms,model_id,_mode,hydration,memory_hydration,persisted_request_messages,agent_spec){
var assistant_message = knoxx.backend.domain.action.run_state.latest_assistant_message(session);
var map__29629 = knoxx.backend.infra.agent.turn.extract_turn_answer_and_reasoning(state,assistant_message);
var map__29629__$1 = cljs.core.__destructure_map(map__29629);
var answer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29629__$1,new cljs.core.Keyword(null,"answer","answer",-742633163));
var reasoning_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29629__$1,new cljs.core.Keyword(null,"reasoning-text","reasoning-text",747588637));
var assistant_content_parts = knoxx.backend.domain.agent.content.assistant_content_parts(assistant_message);
var usage_tokens = knoxx.backend.extern.agent_turn_result.usage_tokens(assistant_message);
var elapsed = (Date.now() - started_ms);
var output_tokens = new cljs.core.Keyword(null,"output-tokens","output-tokens",-1759201012).cljs$core$IFn$_invoke$arity$1(usage_tokens);
var _tokens_per_second = (((((output_tokens > (0))) && ((elapsed > (0)))))?((1000) * (output_tokens / elapsed)):null);
var sources = knoxx.backend.infra.agent.hydration.hydration_sources(hydration);
var message_parts = (await (async function (){var G__29633 = cljs.core.PersistentVector.EMPTY;
var G__29633__$1 = (((!(clojure.string.blank_QMARK_(reasoning_text))))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__29633,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"role","role",-736691072),"thinking",new cljs.core.Keyword(null,"content","content",15833224),reasoning_text,new cljs.core.Keyword(null,"reasoningType","reasoningType",-1978480536),"reasoning_summary"], null)):G__29633);
if((!(clojure.string.blank_QMARK_(answer)))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__29633__$1,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"assistant",new cljs.core.Keyword(null,"content","content",15833224),answer], null));
} else {
return G__29633__$1;
}
})());
var completed_event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"run_completed",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"model","model",331153215),model_id,new cljs.core.Keyword(null,"sources_count","sources_count",723026405),cljs.core.count(sources)], null));
knoxx.backend.domain.action.run_state.record_retrieval_sample_BANG_(new cljs.core.Keyword(null,"retrievalMode","retrievalMode",-1090540764).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_)),elapsed);

knoxx.backend.domain.action.run_state.finalize_run_trace_blocks_BANG_(run_id,"done");

var completed_run = knoxx.backend.infra.agent.turn.finalize_run_record_BANG_(run_id,answer,reasoning_text,sources,elapsed,usage_tokens,assistant_content_parts,hydration,memory_hydration);
var merged_content_parts = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667).cljs$core$IFn$_invoke$arity$1(completed_run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return assistant_content_parts;
}
})()));
var response = knoxx.backend.infra.agent.turn.build_turn_completed_response(run_id,conversation_id,session_id,model_id,answer,merged_content_parts,sources,message_parts);
var _ = (cljs.core.truth_(completed_run)?knoxx.backend.infra.openplanner.memory.index_run_memory_BANG_(config,completed_run,knoxx.backend.infra.core_memory.extract_mentioned_devel_paths,knoxx.backend.infra.core_memory.extract_mentioned_urls):null);
if(knoxx.backend.infra.agent.turn.empty_turn_output_QMARK_(answer,completed_run,merged_content_parts)){
return (await knoxx.backend.infra.agent.turn.finalize_empty_turn_output_BANG_(config,state,session,run_id,conversation_id,session_id,started_ms,model_id,hydration,memory_hydration,persisted_request_messages,agent_spec,completed_run,merged_content_parts));
} else {
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,completed_event);

knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",completed_event);

var final_messages_29989 = knoxx.backend.infra.agent.session.prune_session_messages(agent_spec,knoxx.backend.infra.agent.transcript.transcript_after_turn(session,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(persisted_request_messages,(await (async function (){var G__29636 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"assistant",new cljs.core.Keyword(null,"content","content",15833224),answer], null);
if(cljs.core.seq(merged_content_parts)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29636,new cljs.core.Keyword(null,"content-parts","content-parts",684529019),merged_content_parts);
} else {
return G__29636;
}
})()))));
(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3(session_id,conversation_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"answer","answer",-742633163),answer,new cljs.core.Keyword(null,"messages","messages",345434482),final_messages_29989], null)));

knoxx.backend.domain.action.run_state.clear_event_stream_sink_BANG_();

knoxx.backend.infra.agent.session.remove_agent_session_BANG_(conversation_id);

return response;
}
});
knoxx.backend.infra.agent.turn.finalize_turn_failure_BANG_ = (async function knoxx$backend$infra$agent$turn$finalize_turn_failure_BANG_(config,state,session,run_id,conversation_id,session_id,started_ms,hydration,memory_hydration,persisted_request_messages,agent_spec,err){
var err_text = (await (async function (){var or__5162__auto__ = cljs.core.deref(new cljs.core.Keyword(null,"abort-reason*","abort-reason*",-962330650).cljs$core$IFn$_invoke$arity$1(state));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})());
var error_event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"run_failed",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),err_text], null));
knoxx.backend.domain.action.run_state.finalize_run_trace_blocks_BANG_(run_id,"error");

var failed_run_29993 = knoxx.backend.domain.action.run_state.update_run_BANG_(run_id,(function (run){
var resource_patch = (function (){var G__29640 = cljs.core.PersistentArrayMap.EMPTY;
var G__29640__$1 = (cljs.core.truth_(hydration)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29640,new cljs.core.Keyword(null,"passiveHydration","passiveHydration",-884994907),cljs.core.select_keys(hydration,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.Keyword(null,"tokens","tokens",-818939304),new cljs.core.Keyword(null,"database","database",1849087575),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486),new cljs.core.Keyword(null,"results","results",-1134170113)], null))):G__29640);
if(cljs.core.truth_(memory_hydration)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29640__$1,new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759),cljs.core.select_keys(memory_hydration,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"hits","hits",-2120002930),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996)], null)));
} else {
return G__29640__$1;
}
})();
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(run,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),(Date.now() - started_ms),new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.deref(new cljs.core.Keyword(null,"reasoning-chunks","reasoning-chunks",-526618091).cljs$core$IFn$_invoke$arity$1(state))),new cljs.core.Keyword(null,"error","error",-978969032),err_text], 0)),new cljs.core.Keyword(null,"resources","resources",1632806811),cljs.core.merge,resource_patch);
}));
var __29994 = (cljs.core.truth_(failed_run_29993)?knoxx.backend.infra.openplanner.memory.index_run_memory_BANG_(config,failed_run_29993,knoxx.backend.infra.core_memory.extract_mentioned_devel_paths,knoxx.backend.infra.core_memory.extract_mentioned_urls):null);
knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,error_event);

knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",error_event);

var final_messages_29997 = knoxx.backend.infra.agent.session.prune_session_messages(agent_spec,knoxx.backend.infra.agent.transcript.transcript_after_turn(session,persisted_request_messages));
(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3(session_id,conversation_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),err_text,new cljs.core.Keyword(null,"messages","messages",345434482),final_messages_29997], null)));

knoxx.backend.domain.action.run_state.clear_event_stream_sink_BANG_();

knoxx.backend.infra.agent.session.remove_agent_session_BANG_(conversation_id);

throw err;
});
knoxx.backend.infra.agent.turn.content_part_type = (function knoxx$backend$infra$agent$turn$content_part_type(part){
if((new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part) instanceof cljs.core.Keyword)){
return cljs.core.name(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part));
} else {
if(typeof new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part) === 'string'){
return new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part);
} else {
return null;

}
}
});
knoxx.backend.infra.agent.turn.data_url__GT_image_attachment = (function knoxx$backend$infra$agent$turn$data_url__GT_image_attachment(raw){
if(((typeof raw === 'string') && (clojure.string.starts_with_QMARK_(raw,"data:")))){
var vec__29645 = clojure.string.split.cljs$core$IFn$_invoke$arity$3(raw,/,/,(2));
var meta = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29645,(0),null);
var b64 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29645,(1),null);
var meta__$1 = (function (){var or__5162__auto__ = meta;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var mime = (function (){var G__29649 = meta__$1;
var G__29649__$1 = (((G__29649 == null))?null:clojure.string.replace_first(G__29649,/^data:/,""));
var G__29649__$2 = (((G__29649__$1 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$3(G__29649__$1,/;/,(2)));
var G__29649__$3 = (((G__29649__$2 == null))?null:cljs.core.first(G__29649__$2));
var G__29649__$4 = (((G__29649__$3 == null))?null:clojure.string.trim(G__29649__$3));
if((G__29649__$4 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__29649__$4);
}
})();
var b64__$1 = knoxx.backend.domain.agent.content.nonblank(b64);
if(cljs.core.truth_(b64__$1)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"data","data",-232669377),b64__$1,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime], null);
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.agent.turn.base64_bytes = (function knoxx$backend$infra$agent$turn$base64_bytes(b64){
var temp__5825__auto__ = knoxx.backend.domain.agent.content.nonblank(b64);
if(cljs.core.truth_(temp__5825__auto__)){
var b64__$1 = temp__5825__auto__;
var len = ((b64__$1).length);
var padding = ((clojure.string.ends_with_QMARK_(b64__$1,"=="))?(2):((clojure.string.ends_with_QMARK_(b64__$1,"="))?(1):(0)
));
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(Math.floor(((3) * (len / (4)))) - padding));
} else {
return null;
}
});
knoxx.backend.infra.agent.turn.media_part__GT_eta_mu_attachment = (function knoxx$backend$infra$agent$turn$media_part__GT_eta_mu_attachment(part){
var part_type = knoxx.backend.infra.agent.turn.content_part_type(part);
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["image",null,"video",null,"document",null,"audio",null], null), null),part_type)){
var raw_data = knoxx.backend.domain.agent.content.nonblank(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part));
var parsed = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("image",part_type))?knoxx.backend.infra.agent.turn.data_url__GT_image_attachment(raw_data):null);
var data = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_turn_media.strip_data_url(raw_data);
}
})();
var mime_type = knoxx.backend.domain.agent.content.nonblank((function (){var G__29656 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(parsed);
}
})();
if((G__29656 == null)){
return null;
} else {
return cljs.core.name(G__29656);
}
})());
var filename = knoxx.backend.domain.agent.content.nonblank(new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(part));
if(cljs.core.truth_(data)){
var G__29658 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),part_type,new cljs.core.Keyword(null,"data","data",-232669377),data], null);
var G__29658__$1 = (cljs.core.truth_(mime_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29658,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type):G__29658);
if(cljs.core.truth_((function (){var and__5160__auto__ = filename;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(part_type,"audio");
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29658__$1,new cljs.core.Keyword(null,"filename","filename",-1428840783),filename);
} else {
return G__29658__$1;
}
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.agent.turn.file_processor_style_marker = (function knoxx$backend$infra$agent$turn$file_processor_style_marker(media_part){
var t = knoxx.backend.infra.agent.turn.content_part_type(media_part);
var mime = (function (){var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank(new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(media_part));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,"audio"))?"audio/mpeg":null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,"image")){
return "image/png";
} else {
return null;
}
}
}
})();
var name = (function (){var G__29662 = t;
switch (G__29662) {
case "audio":
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(mime,"audio/wav")){
return "attached-audio.wav";
} else {
return "attached-audio.mp3";
}

break;
case "image":
return "attached-image";

break;
case "video":
return "attached-video";

break;
case "document":
return "attached-document";

break;
default:
return (""+"attached-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(t));

}
})();
var bytes = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(media_part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.agent.turn.base64_bytes(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(media_part));
}
})();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,"audio")){
return (""+"<file name=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"\">[Audio attached: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime)+", "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = bytes;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "?";
}
})())+" bytes.]</file>\n");
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,"image")){
return (""+"<file name=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"\"></file>\n");
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,"video")){
return (""+"<file name=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"\">[Video attached: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime)+", "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = bytes;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "?";
}
})())+" bytes.]</file>\n");
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,"document")){
return (""+"<file name=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"\">[Document attached: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime)+", "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = bytes;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "?";
}
})())+" bytes.]</file>\n");
} else {
return "";

}
}
}
}
});
/**
 * Send the user message to the provider session.
 * 
 * When `timeout-ms` is a positive number the send is raced against a rejection
 * timer. When it is nil, zero, or negative the turn runs unbounded — autonomous
 * (event/cron) agents must be allowed to run as long as they need, and chat
 * turns inherit the same policy via config. The default config sets no timeout.
 */
knoxx.backend.infra.agent.turn.send_user_message_with_timeout_BANG_ = (function knoxx$backend$infra$agent$turn$send_user_message_with_timeout_BANG_(session,content,timeout_ms){
var timeout_ms__$1 = ((typeof timeout_ms === 'number')?timeout_ms:null);
if(cljs.core.truth_((function (){var and__5160__auto__ = timeout_ms__$1;
if(cljs.core.truth_(and__5160__auto__)){
return (timeout_ms__$1 > (0));
} else {
return and__5160__auto__;
}
})())){
return knoxx.backend.extern.promise.race(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.shape.agent.send_user_message_BANG_(session,content),knoxx.backend.extern.promise.reject_after(timeout_ms__$1,(""+"Agent turn timed out after "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(timeout_ms__$1)+"ms"))], null));
} else {
return knoxx.backend.shape.agent.send_user_message_BANG_(session,content);
}
});
/**
 * Send the user message to the provider, stream the response, and finalize the turn.
 * Returns a promise that resolves with the turn response or rejects on error.
 */
knoxx.backend.infra.agent.turn.prompt_and_await_BANG_ = (async function knoxx$backend$infra$agent$turn$prompt_and_await_BANG_(config,session_id,run_id,conversation_id,started_ms,model_id,mode,session,message,prompt_content_parts,hydration,memory_hydration,persisted_request_messages,agent_spec){
var state = knoxx.backend.infra.agent.stream.make_stream_state(run_id,conversation_id,session_id,knoxx.backend.domain.time.now_iso(),started_ms,knoxx.backend.extern.agent_turn_node.random_uuid_BANG_);
var abort_BANG_ = (function (reason){
return knoxx.backend.infra.agent.stream.request_abort_BANG_(state,session,reason);
});
var _registered = knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$core$IFn$_invoke$arity$3(state,abort_BANG_,agent_spec);
var unsubscribe = knoxx.backend.shape.agent.subscribe_BANG_(session,knoxx.backend.infra.agent.stream.build_subscribe_handler(state,session));
var parts = (await (async function (){var or__5162__auto__ = prompt_content_parts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var media_parts = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.turn.media_part__GT_eta_mu_attachment,parts));
var omitted_count = cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(cljs.core.count(parts) - cljs.core.count(media_parts)));
var turn_message = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank(new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var attachment_markers = ((cljs.core.seq(media_parts))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.turn.file_processor_style_marker,media_parts)):null);
var base_text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = attachment_markers;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.agent.hydration.build_agent_user_message(turn_message,hydration,memory_hydration)));
var final_text = (await (async function (){var G__29670 = base_text;
if((omitted_count > (0))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29670)+"\n\n"+"[Note: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(omitted_count)+" unsupported attachment(s) were omitted for this model/runtime.]");
} else {
return G__29670;
}
})());
var content = knoxx.backend.extern.agent_turn_prompt.prompt_content(media_parts,final_text);
knoxx.backend.extern.agent_turn_prompt.log_prompt_BANG_(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"model-id","model-id",-467101728),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"parts-count","parts-count",342585412),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"omitted-count","omitted-count",961717846),new cljs.core.Keyword(null,"media-parts-count","media-parts-count",1959616188),new cljs.core.Keyword(null,"run-id","run-id",-1745267908)],[model_id,conversation_id,session_id,cljs.core.count(parts),content,mode,omitted_count,cljs.core.count(media_parts),run_id]));

var G__29671_30057 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),agent_spec], null);
(knoxx.backend.domain.agent.agent_context.set_context_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.agent.agent_context.set_context_BANG_.cljs$core$IFn$_invoke$arity$1(G__29671_30057) : knoxx.backend.domain.agent.agent_context.set_context_BANG_.call(null,G__29671_30057));

try{var _ = (await knoxx.backend.infra.agent.turn.send_user_message_with_timeout_BANG_(session,content,new cljs.core.Keyword(null,"agent-turn-timeout-ms","agent-turn-timeout-ms",1064040143).cljs$core$IFn$_invoke$arity$1(config)));
(knoxx.backend.domain.agent.agent_context.clear_context_BANG_.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.clear_context_BANG_.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.clear_context_BANG_.call(null));

(unsubscribe.cljs$core$IFn$_invoke$arity$0 ? unsubscribe.cljs$core$IFn$_invoke$arity$0() : unsubscribe.call(null));

return (await knoxx.backend.infra.agent.turn.finalize_turn_success_BANG_(config,state,session,run_id,conversation_id,session_id,started_ms,model_id,mode,hydration,memory_hydration,persisted_request_messages,agent_spec));
}catch (e29673){var err = e29673;
(knoxx.backend.domain.agent.agent_context.clear_context_BANG_.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.clear_context_BANG_.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.clear_context_BANG_.call(null));

(unsubscribe.cljs$core$IFn$_invoke$arity$0 ? unsubscribe.cljs$core$IFn$_invoke$arity$0() : unsubscribe.call(null));

knoxx.backend.domain.voice.turn_control.unregister_active_turn_BANG_.cljs$core$IFn$_invoke$arity$2(conversation_id,run_id);

return (await knoxx.backend.infra.agent.turn.finalize_turn_failure_BANG_(config,state,session,run_id,conversation_id,session_id,started_ms,hydration,memory_hydration,persisted_request_messages,agent_spec,err));
}});
knoxx.backend.infra.agent.turn.studio_stream_path = (function knoxx$backend$infra$agent$turn$studio_stream_path(value){
return knoxx.backend.extern.agent_turn_media.studio_stream_path(value);
});
knoxx.backend.infra.agent.turn.read_workspace_media_data_url_BANG_ = (function knoxx$backend$infra$agent$turn$read_workspace_media_data_url_BANG_(runtime,config,max_bytes,raw_path,fallback_mime,label){
var normalized = knoxx.backend.domain.media.normalize_tool_path_arg(raw_path);
var map__29678 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__29678__$1 = cljs.core.__destructure_map(map__29678);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29678__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29678__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
var mime = (function (){var or__5162__auto__ = knoxx.backend.domain.media.workspace_media_mime_type(relative);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback_mime;
}
})();
return knoxx.backend.extern.agent_turn_node.file_data_url_BANG_(absolute,mime,label,max_bytes);
});
knoxx.backend.infra.agent.turn.fetch_media_data_url_BANG_ = (function knoxx$backend$infra$agent$turn$fetch_media_data_url_BANG_(runtime,config,auth_context,max_bytes,url,fallback_mime,label){
var temp__5823__auto__ = knoxx.backend.infra.agent.turn.studio_stream_path(url);
if(cljs.core.truth_(temp__5823__auto__)){
var stream_path = temp__5823__auto__;
return knoxx.backend.infra.agent.turn.read_workspace_media_data_url_BANG_(runtime,config,max_bytes,stream_path,fallback_mime,label);
} else {
return knoxx.backend.extern.agent_turn_media.fetch_data_url_BANG_(url,fallback_mime,label,max_bytes,auth_context);
}
});
knoxx.backend.infra.agent.turn.materialize_part_BANG_ = (async function knoxx$backend$infra$agent$turn$materialize_part_BANG_(runtime,config,auth_context,max_bytes,part){
var part_type = knoxx.backend.infra.agent.turn.content_part_type(part);
if(cljs.core.not((await (async function (){var fexpr__29681 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["image",null,"audio",null], null), null);
return (fexpr__29681.cljs$core$IFn$_invoke$arity$1 ? fexpr__29681.cljs$core$IFn$_invoke$arity$1(part_type) : fexpr__29681.call(null,part_type));
})()))){
return part;
} else {
if(knoxx.backend.extern.agent_turn_media.data_url_QMARK_(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part))){
return part;
} else {
if(knoxx.backend.extern.agent_turn_media.media_url_QMARK_(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part))){
var data_url = (await knoxx.backend.infra.agent.turn.fetch_media_data_url_BANG_(runtime,config,auth_context,max_bytes,new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(part_type,"audio"))?"audio/mpeg":"image/png"),part_type));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(part,new cljs.core.Keyword(null,"url","url",276297046)),new cljs.core.Keyword(null,"data","data",-232669377),data_url);
} else {
if(knoxx.backend.extern.agent_turn_media.media_url_QMARK_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part))){
var data_url = (await knoxx.backend.infra.agent.turn.fetch_media_data_url_BANG_(runtime,config,auth_context,max_bytes,new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(part_type,"audio"))?"audio/mpeg":"image/png"),part_type));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(part,new cljs.core.Keyword(null,"url","url",276297046)),new cljs.core.Keyword(null,"data","data",-232669377),data_url);
} else {
return part;

}
}
}
}
});
knoxx.backend.infra.agent.turn.materialize_content_parts_BANG_ = (function knoxx$backend$infra$agent$turn$materialize_content_parts_BANG_(runtime,config,model_id,auth_context,max_bytes,parts){
var parts__$1 = cljs.core.vec((function (){var or__5162__auto__ = parts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var should_materialize_QMARK_ = cljs.core.some((function (part){
var part_type = knoxx.backend.infra.agent.turn.content_part_type(part);
var and__5160__auto__ = (function (){var fexpr__29690 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["image",null,"audio",null], null), null);
return (fexpr__29690.cljs$core$IFn$_invoke$arity$1 ? fexpr__29690.cljs$core$IFn$_invoke$arity$1(part_type) : fexpr__29690.call(null,part_type));
})();
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.models.model_supports_input_QMARK_(config,model_id,part_type);
} else {
return and__5160__auto__;
}
}),parts__$1);
if(cljs.core.not((function (){var and__5160__auto__ = cljs.core.seq(parts__$1);
if(and__5160__auto__){
return should_materialize_QMARK_;
} else {
return and__5160__auto__;
}
})())){
return Promise.resolve(parts__$1);
} else {
return knoxx.backend.extern.promise.all_vec(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__29687_SHARP_){
return knoxx.backend.infra.agent.turn.materialize_part_BANG_(runtime,config,auth_context,max_bytes,p1__29687_SHARP_);
}),parts__$1));
}
});
knoxx.backend.infra.agent.turn.emit_hydration_event_BANG_ = (function knoxx$backend$infra$agent$turn$emit_hydration_event_BANG_(run_id,conversation_id,session_id,event_type,hydration,resource_patch){
var event = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,event_type,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"ok",new cljs.core.Keyword(null,"hits","hits",-2120002930),cljs.core.count(new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(hydration)),new cljs.core.Keyword(null,"elapsed_ms","elapsed_ms",-325114493),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486).cljs$core$IFn$_invoke$arity$1(hydration)], null));
knoxx.backend.domain.action.run_state.update_run_BANG_(run_id,(function (run){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$4(run,new cljs.core.Keyword(null,"resources","resources",1632806811),cljs.core.merge,resource_patch),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso());
}));

knoxx.backend.domain.action.run_state.append_run_event_BANG_(run_id,event);

return knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(session_id,"events",event);
});
/**
 * Resolve the effective model-id for a turn.
 */
knoxx.backend.infra.agent.turn.resolve_turn_model = (function knoxx$backend$infra$agent$turn$resolve_turn_model(config,model,agent_spec){
var requested_model = (function (){var or__5162__auto__ = model;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
})();
var or__5162__auto__ = requested_model;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.agent.hydration.ensure_settings_BANG_(config));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764).cljs$core$IFn$_invoke$arity$1(config);
}
}
});
/**
 * Resolve the effective thinking level for a turn.
 */
knoxx.backend.infra.agent.turn.resolve_turn_thinking_level = (function knoxx$backend$infra$agent$turn$resolve_turn_thinking_level(config,model_id,thinking_level,agent_spec){
var thinking_level_raw = (function (){var or__5162__auto__ = thinking_level;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
})();
var parsed_thinking_level = (cljs.core.truth_(thinking_level_raw)?knoxx.backend.domain.models.normalize_thinking_level(thinking_level_raw):null);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"thinking-level-raw","thinking-level-raw",827943395),thinking_level_raw,new cljs.core.Keyword(null,"parsed-thinking-level","parsed-thinking-level",-672045585),parsed_thinking_level,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),knoxx.backend.domain.models.effective_thinking_level(config,model_id,(function (){var or__5162__auto__ = parsed_thinking_level;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = thinking_level_raw;
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
})())], null);
});
knoxx.backend.infra.agent.turn.persist_running_session_update_BANG_ = (async function knoxx$backend$infra$agent$turn$persist_running_session_update_BANG_(session_id,conversation_id,run_id,persisted_request_messages){
try{return (await knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"messages","messages",345434482),persisted_request_messages,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id], null)));
}catch (e29725){var err = e29725;
return console.error("[turn] failed to update session",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.ex_message(err)], null)));
}});
/**
 * Resolve turn parameters from the request and agent-spec.
 * Returns a map of resolved values or throws for invalid inputs.
 */
knoxx.backend.infra.agent.turn.prepare_turn_context = (function knoxx$backend$infra$agent$turn$prepare_turn_context(runtime,config,p__29732){
var map__29735 = p__29732;
var map__29735__$1 = cljs.core.__destructure_map(map__29735);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"model","model",331153215));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var auth_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"auth-context","auth-context",320032325));
var template_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"template-context","template-context",-946500342));
var mode = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"mode","mode",654403691));
var thinking_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953));
var agent_spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29735__$1,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541));
var conversation_id__$1 = (function (){var or__5162__auto__ = conversation_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_turn_node.random_uuid_BANG_();
}
})();
var session_id__$1 = knoxx.backend.infra.agent.turn.ensure_session_id(session_id);
var auth_context__$1 = knoxx.backend.infra.agent.turn.auth_context_for_agent_turn(auth_context,agent_spec);
var agent_spec__$1 = knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$core$IFn$_invoke$arity$3(agent_spec,auth_context__$1,template_context);
var _ = knoxx.backend.infra.agent.turn.ensure_conversation_access_BANG_(auth_context__$1,conversation_id__$1);
var ___$1 = knoxx.backend.infra.agent.turn.remember_conversation_access_BANG_(auth_context__$1,conversation_id__$1);
var mode__$1 = (function (){var or__5162__auto__ = mode;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "direct";
}
})();
var model_id = knoxx.backend.infra.agent.turn.resolve_turn_model(config,model,agent_spec__$1);
var map__29741 = knoxx.backend.infra.agent.turn.resolve_turn_thinking_level(config,model_id,thinking_level,agent_spec__$1);
var map__29741__$1 = cljs.core.__destructure_map(map__29741);
var thinking_level_raw = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29741__$1,new cljs.core.Keyword(null,"thinking-level-raw","thinking-level-raw",827943395));
var parsed_thinking_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29741__$1,new cljs.core.Keyword(null,"parsed-thinking-level","parsed-thinking-level",-672045585));
var thinking_level__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29741__$1,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953));
var run_id__$1 = (function (){var or__5162__auto__ = run_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_turn_node.random_uuid_BANG_();
}
})();
var started_at = knoxx.backend.domain.time.now_iso();
var started_ms = Date.now();
var existing_messages = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.stores.mongo_session_store.get_session_sync(session_id__$1));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var seeded_messages = knoxx.backend.infra.agent.transcript.ensure_system_message(existing_messages,agent_spec__$1);
var auth_extra = knoxx.backend.infra.auth.authz.auth_snapshot(auth_context__$1);
if(cljs.core.truth_((function (){var and__5160__auto__ = thinking_level_raw;
if(cljs.core.truth_(and__5160__auto__)){
return (parsed_thinking_level == null);
} else {
return and__5160__auto__;
}
})())){
throw (new Error((""+"Unsupported thinking level: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(thinking_level_raw)+". Expected one of off, minimal, low, medium, high, xhigh.")));
} else {
}

return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"model-id","model-id",-467101728),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"seeded-messages","seeded-messages",1731725219),new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"started-at","started-at",1318767912),new cljs.core.Keyword(null,"started-ms","started-ms",1106122505),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"auth-extra","auth-extra",1406610354),new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"message","message",-406056002)],[model_id,conversation_id__$1,session_id__$1,seeded_messages,auth_context__$1,started_at,started_ms,mode__$1,thinking_level__$1,auth_extra,agent_spec__$1,run_id__$1,message]);
});
/**
 * Run passive hydration, memory hydration, content materialization, and session
 * setup in parallel.  Returns a promise that resolves to the 4-element result vector.
 */
knoxx.backend.infra.agent.turn.hydrate_and_materialize_BANG_ = (async function knoxx$backend$infra$agent$turn$hydrate_and_materialize_BANG_(runtime,config,p__29753,content_parts){
var map__29754 = p__29753;
var map__29754__$1 = cljs.core.__destructure_map(map__29754);
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var mode = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"mode","mode",654403691));
var model_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"model-id","model-id",-467101728));
var thinking_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953));
var agent_spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541));
var auth_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29754__$1,new cljs.core.Keyword(null,"auth-context","auth-context",320032325));
var max_bytes = (32000000);
return (await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.agent.hydration.passive_hydration_BANG_.cljs$core$IFn$_invoke$arity$5(runtime,config,mode,message,auth_context),knoxx.backend.infra.agent.hydration.passive_memory_hydration_BANG_.cljs$core$IFn$_invoke$arity$5(config,conversation_id,message,auth_context,agent_spec),knoxx.backend.infra.agent.turn.materialize_content_parts_BANG_(runtime,config,model_id,auth_context,max_bytes,content_parts),knoxx.backend.infra.agent.session.ensure_agent_session_BANG_.cljs$core$IFn$_invoke$arity$8(runtime,config,conversation_id,model_id,auth_context,thinking_level,session_id,agent_spec)], null)));
});
/**
 * Orchestrate a full agent turn: validate, hydrate, create run, prompt, and stream.
 * Returns a Promise that resolves with the turn response or rejects on error.
 */
knoxx.backend.infra.agent.turn.send_agent_turn_BANG_ = (async function knoxx$backend$infra$agent$turn$send_agent_turn_BANG_(runtime,config,p__29776){
var map__29778 = p__29776;
var map__29778__$1 = cljs.core.__destructure_map(map__29778);
var turn_request = map__29778__$1;
var content_parts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29778__$1,new cljs.core.Keyword(null,"content-parts","content-parts",684529019));
var ctx = knoxx.backend.infra.agent.turn.prepare_turn_context(runtime,config,turn_request);
var map__29788 = ctx;
var map__29788__$1 = cljs.core.__destructure_map(map__29788);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var model_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"model-id","model-id",-467101728));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var seeded_messages = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"seeded-messages","seeded-messages",1731725219));
var started_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"started-at","started-at",1318767912));
var started_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"started-ms","started-ms",1106122505));
var mode = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"mode","mode",654403691));
var thinking_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953));
var auth_extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"auth-extra","auth-extra",1406610354));
var agent_spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29788__$1,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541));
(await knoxx.backend.infra.agent.policy.enforce_chat_policy_BANG_(new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(ctx),model_id));

knoxx.backend.infra.stores.session_titles.maybe_prime_session_title_BANG_(runtime,config,conversation_id,message);

var hydration_results = (await knoxx.backend.infra.agent.turn.hydrate_and_materialize_BANG_(runtime,config,ctx,content_parts));
var start_turn_BANG_ = (knoxx.backend.infra.agent.turn.process_hydration_results_and_start_turn_BANG_.cljs$core$IFn$_invoke$arity$14 ? knoxx.backend.infra.agent.turn.process_hydration_results_and_start_turn_BANG_.cljs$core$IFn$_invoke$arity$14(runtime,config,run_id,session_id,conversation_id,started_at,started_ms,model_id,mode,thinking_level,agent_spec,auth_extra,seeded_messages,message) : knoxx.backend.infra.agent.turn.process_hydration_results_and_start_turn_BANG_.call(null,runtime,config,run_id,session_id,conversation_id,started_at,started_ms,model_id,mode,thinking_level,agent_spec,auth_extra,seeded_messages,message));
return (await (start_turn_BANG_.cljs$core$IFn$_invoke$arity$1 ? start_turn_BANG_.cljs$core$IFn$_invoke$arity$1(hydration_results) : start_turn_BANG_.call(null,hydration_results)));
});
knoxx.backend.infra.agent.turn.process_hydration_results_and_start_turn_BANG_ = (function knoxx$backend$infra$agent$turn$process_hydration_results_and_start_turn_BANG_(_runtime,config,run_id,session_id,conversation_id,started_at,started_ms,model_id,mode,thinking_level,agent_spec,auth_extra,seeded_messages,message){
return (function (p__29853){
var vec__29854 = p__29853;
var hydration = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29854,(0),null);
var memory_hydration = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29854,(1),null);
var materialized_content_parts = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29854,(2),null);
var session = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29854,(3),null);
var materialized_content_parts__$1 = cljs.core.vec((function (){var or__5162__auto__ = materialized_content_parts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var turn_message = knoxx.backend.domain.agent.content.nonblank(message);
var user_message = ((cljs.core.seq(materialized_content_parts__$1))?new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"role","role",-736691072),"user",new cljs.core.Keyword(null,"content","content",15833224),turn_message,new cljs.core.Keyword(null,"content-parts","content-parts",684529019),materialized_content_parts__$1], null):new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"user",new cljs.core.Keyword(null,"content","content",15833224),turn_message], null));
var prompt_content_parts = knoxx.backend.domain.agent.content.model_ready_content_parts(config,model_id,materialized_content_parts__$1);
var request_messages = knoxx.backend.infra.agent.session.prune_session_messages(agent_spec,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(seeded_messages,user_message));
knoxx.backend.infra.agent.turn.create_initial_run_BANG_(run_id,session_id,conversation_id,started_at,model_id,mode,thinking_level,agent_spec,auth_extra,request_messages,config);

if(cljs.core.truth_(hydration)){
knoxx.backend.infra.agent.turn.emit_hydration_event_BANG_(run_id,conversation_id,session_id,"passive_hydration",hydration,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"passiveHydration","passiveHydration",-884994907),cljs.core.select_keys(hydration,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.Keyword(null,"tokens","tokens",-818939304),new cljs.core.Keyword(null,"database","database",1849087575),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486),new cljs.core.Keyword(null,"results","results",-1134170113)], null))], null));
} else {
}

if(cljs.core.seq(new cljs.core.Keyword(null,"hits","hits",-2120002930).cljs$core$IFn$_invoke$arity$1(memory_hydration))){
knoxx.backend.infra.agent.turn.emit_hydration_event_BANG_(run_id,conversation_id,session_id,"memory_hydration",memory_hydration,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759),cljs.core.select_keys(memory_hydration,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"hits","hits",-2120002930),new cljs.core.Keyword(null,"elapsedMs","elapsedMs",1350426486),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996)], null))], null));
} else {
}

var persisted_request_messages = knoxx.backend.infra.agent.session.prune_session_messages(agent_spec,knoxx.backend.infra.agent.transcript.transcript_before_prompt(session,user_message,agent_spec));
knoxx.backend.infra.agent.turn.persist_running_session_update_BANG_(session_id,conversation_id,run_id,persisted_request_messages);

return knoxx.backend.infra.agent.turn.prompt_and_await_BANG_(config,session_id,run_id,conversation_id,started_ms,model_id,mode,session,turn_message,prompt_content_parts,hydration,memory_hydration,persisted_request_messages,agent_spec);
});
});

//# sourceMappingURL=knoxx.backend.infra.agent.turn.js.map
