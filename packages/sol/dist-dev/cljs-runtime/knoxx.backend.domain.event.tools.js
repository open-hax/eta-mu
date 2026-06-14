import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.clients.knoxx_control.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
goog.provide('knoxx.backend.domain.event.tools');
knoxx.backend.domain.event.tools.status_params = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461)], null);
knoxx.backend.domain.event.tools.trigger_fire_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Trigger resource id to exercise immediately."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.event.tools.dispatch_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"generator_kind","generator_kind",-654374277),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Event generator/provenance kind such as manual, discord, github, or cron."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_type","event_type",1569866042),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Event type string such as manual.note or discord.message."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"payload_json","payload_json",1533789905),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional JSON object payload for the event."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.event.tools.spawn_agent_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"User message or task to give the one-off agent."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional model id override."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent_spec_json","agent_spec_json",-968990915),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional JSON object with direct-start style agent_spec fields such as role, contract_id, actor_id, system_prompt, task_prompt, thinking_level, and tool_policies."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.event.tools.fetch_json_BANG_ = (function knoxx$backend$domain$event$tools$fetch_json_BANG_(config,method,path,body){
return knoxx.backend.infra.clients.knoxx_control.request_json_BANG_(knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.tools.live_config(config)),method,path,body);
});
knoxx.backend.domain.event.tools.events_status_BANG_ = (async function knoxx$backend$domain$event$tools$events_status_BANG_(config){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await knoxx.backend.domain.event.tools.fetch_json_BANG_(config,"GET","/api/admin/config/events",null)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.domain.event.tools.events_dispatch_BANG_ = (async function knoxx$backend$domain$event$tools$events_dispatch_BANG_(config,generator_kind,event_type,payload){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await knoxx.backend.domain.event.tools.fetch_json_BANG_(config,"POST","/api/admin/config/events/dispatch",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("event","generator","event/generator",-736110419),(await (async function (){var G__27503 = cljs.core.PersistentArrayMap.EMPTY;
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(generator_kind)))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27503,new cljs.core.Keyword(null,"kind","kind",-717265803),generator_kind);
} else {
return G__27503;
}
})()),new cljs.core.Keyword("event","type","event/type",1532247862),event_type,new cljs.core.Keyword("event","payload","event/payload",242016970),payload], null))),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.domain.event.tools.trigger_fire_BANG_ = (async function knoxx$backend$domain$event$tools$trigger_fire_BANG_(config,trigger_id){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await knoxx.backend.domain.event.tools.fetch_json_BANG_(config,"POST",(""+"/api/admin/triggers/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(trigger_id))+"/fire"),null)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.domain.event.tools.events_status_execute = (async function knoxx$backend$domain$event$tools$events_status_execute(_runtime,config,_tool_call_id,_params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Reading events runtime state\u2026");

var result = (await knoxx.backend.domain.event.tools.events_status_BANG_(config));
var control = new cljs.core.Keyword(null,"control","control",1892578036).cljs$core$IFn$_invoke$arity$1(result);
var runtime_state = new cljs.core.Keyword(null,"runtime","runtime",-1331573996).cljs$core$IFn$_invoke$arity$1(result);
var resources = new cljs.core.Keyword(null,"resources","resources",1632806811).cljs$core$IFn$_invoke$arity$1(control);
var triggers = new cljs.core.Keyword(null,"trigger","trigger",103466139).cljs$core$IFn$_invoke$arity$1(resources);
return knoxx.backend.domain.text.tool_text_result((""+"Events runtime running="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"running","running",1554969103).cljs$core$IFn$_invoke$arity$1(runtime_state))+", triggers="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(triggers))+", actions="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"action","action",-811238024).cljs$core$IFn$_invoke$arity$1(resources)))+", schedules="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"schedule","schedule",349275266).cljs$core$IFn$_invoke$arity$1(resources)))+", generators="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"generator","generator",-572962281).cljs$core$IFn$_invoke$arity$1(resources)))),result);
});
knoxx.backend.domain.event.tools.trigger_fire_execute = (async function knoxx$backend$domain$event$tools$trigger_fire_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var trigger_id = (await (async function (){var or__5162__auto__ = (params["trigger_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["triggerId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(clojure.string.blank_QMARK_(trigger_id)){
throw (new Error("trigger_id is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Firing trigger "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id)+"\u2026"));

var result = (await knoxx.backend.domain.event.tools.trigger_fire_BANG_(config,trigger_id));
return knoxx.backend.domain.text.tool_text_result((""+"Fired trigger "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id)),result);
});
knoxx.backend.domain.event.tools.events_dispatch_execute = (async function knoxx$backend$domain$event$tools$events_dispatch_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var generator_kind = (await (async function (){var or__5162__auto__ = (params["generator_kind"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["generatorKind"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "manual";
}
}
})());
var event_type = (await (async function (){var or__5162__auto__ = (params["event_type"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["eventType"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "manual.event";
}
}
})());
var payload_json = (await (async function (){var or__5162__auto__ = (params["payload_json"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["payloadJson"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var payload = ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(payload_json))))?cljs.core.PersistentArrayMap.EMPTY:knoxx.backend.domain.tools.json_parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(payload_json))));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Dispatching event "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(event_type)+"\u2026"));

var result = (await knoxx.backend.domain.event.tools.events_dispatch_BANG_(config,generator_kind,event_type,payload));
return knoxx.backend.domain.text.tool_text_result((""+"Dispatched event "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(event_type)+" matched triggers: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767).cljs$core$IFn$_invoke$arity$1(result)))),result);
});
knoxx.backend.domain.event.tools.agent_spawn_execute = (async function knoxx$backend$domain$event$tools$agent_spawn_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var message = (await (async function (){var or__5162__auto__ = (params["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var model = (await (async function (){var or__5162__auto__ = (params["model"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})());
var agent_spec_json = (await (async function (){var or__5162__auto__ = (params["agent_spec_json"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["agentSpecJson"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var agent_spec = ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(agent_spec_json))))?cljs.core.PersistentArrayMap.EMPTY:knoxx.backend.domain.tools.json_parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(agent_spec_json))));
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message)))){
throw (new Error("message is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Spawning one-off agent run\u2026");

var result = (await knoxx.backend.domain.event.tools.fetch_json_BANG_(config,"POST","/api/knoxx/direct/start",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"message","message",-406056002),message,new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),agent_spec], null)));
var result_STAR_ = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
return knoxx.backend.domain.text.tool_text_result((""+"Spawned one-off agent run "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(result_STAR_))),result_STAR_);
});
knoxx.backend.domain.event.tools.events_status_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"events.status","Events Status","Inspect the current events runtime state and resource catalog.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Inspect events, triggers, actions, schedules, generators, and runtime state.",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use this before dispatching events, firing triggers, or resetting the runtime."], null),knoxx.backend.domain.event.tools.status_params,knoxx.backend.domain.event.tools.events_status_execute], 0));
knoxx.backend.domain.event.tools.events_dispatch_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"events.dispatch","Events Dispatch","Dispatch a normalized event onto the events runtime.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Publish a manual or synthetic event so matching trigger contracts can react immediately.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use generator_kind/manual for synthetic events you want to test immediately.","Put complex payload fields into payload_json as a JSON object string."], null),knoxx.backend.domain.event.tools.dispatch_params,knoxx.backend.domain.event.tools.events_dispatch_execute], 0));
knoxx.backend.domain.event.tools.trigger_fire_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"triggers.fire","Triggers Fire","Exercise a trigger resource immediately.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Dispatch one of a trigger resource's observed events through the event runtime.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use this for manual trigger testing after inspecting events.status.","Provide the exact trigger resource id."], null),knoxx.backend.domain.event.tools.trigger_fire_params,knoxx.backend.domain.event.tools.trigger_fire_execute], 0));
knoxx.backend.domain.event.tools.agents_spawn_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"agents.spawn","Agents Spawn","Launch a one-off Knoxx agent run without creating or mutating trigger/schedule contracts.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Spawn a normal Knoxx agent directly through the shared agent runtime.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use this for one-off agent execution.","Pass direct-start style agent overrides in agent_spec_json when you need a specific role, contract, actor, or tool policy surface."], null),knoxx.backend.domain.event.tools.spawn_agent_params,knoxx.backend.domain.event.tools.agent_spawn_execute], 0));
knoxx.backend.domain.event.tools.create_events_custom_tools = (function knoxx$backend$domain$event$tools$create_events_custom_tools(var_args){
var G__27559 = arguments.length;
switch (G__27559) {
case 2:
return knoxx.backend.domain.event.tools.create_events_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.event.tools.create_events_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.event.tools.create_events_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.event.tools.create_events_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.event.tools.create_events_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("events.status"))?knoxx.backend.domain.event.tools.events_status_tool(runtime,config):null),((allowed_QMARK_("events.dispatch"))?knoxx.backend.domain.event.tools.events_dispatch_tool(runtime,config):null),((allowed_QMARK_("triggers.fire"))?knoxx.backend.domain.event.tools.trigger_fire_tool(runtime,config):null),((allowed_QMARK_("agents.spawn"))?knoxx.backend.domain.event.tools.agents_spawn_tool(runtime,config):null)], null))));
}));

(knoxx.backend.domain.event.tools.create_events_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.event.tools.js.map
