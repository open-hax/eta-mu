import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.actor.mailbox.js";
import "./knoxx.backend.domain.agent.agent_context.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.infra.clients.knoxx_control.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
goog.provide('knoxx.backend.domain.actor.tools');
knoxx.backend.domain.actor.tools.send_message_params = new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"target","target",253001721),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Target address: parent, self, conversation:<id>, conversation-id:<id>, session:<id>, session-id:<id>, actor:<id>, actor-id:<id>, or a raw conversation/session id when target_type is provided."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Message content to deliver."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Delivery mode: message (default follow-up), steer, follow-up, or event."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"target_type","target_type",-66014761),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional hint for raw target: parent, self, conversation, session, actor, or event."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Explicit conversation id override."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Explicit session id override."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional target/current run id for audit linkage."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata_json","metadata_json",2009778443),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional JSON object with lineage/audit metadata, e.g. parentRunId or subAgentId."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.actor.tools.fetch_json_BANG_ = (function knoxx$backend$domain$actor$tools$fetch_json_BANG_(config,method,path,body){
return knoxx.backend.infra.clients.knoxx_control.request_json_BANG_(knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.tools.live_config(config)),method,path,body);
});
knoxx.backend.domain.actor.tools.normalize_mode = (function knoxx$backend$domain$actor$tools$normalize_mode(mode){
var mode_STAR_ = (function (){var G__27493 = mode;
var G__27493__$1 = (((G__27493 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27493)));
var G__27493__$2 = (((G__27493__$1 == null))?null:clojure.string.trim(G__27493__$1));
var G__27493__$3 = (((G__27493__$2 == null))?null:clojure.string.lower_case(G__27493__$2));
if((G__27493__$3 == null)){
return null;
} else {
return clojure.string.replace(G__27493__$3,/_/,"-");
}
})();
var G__27495 = mode_STAR_;
switch (G__27495) {
case "steer":
return "steer";

break;
case "follow-up":
return "follow-up";

break;
case "followup":
return "follow-up";

break;
case "event":
return "event";

break;
case "message":
return "message";

break;
default:
return "message";

}
});
knoxx.backend.domain.actor.tools.normalize_target_type = (function knoxx$backend$domain$actor$tools$normalize_target_type(target_type){
var G__27498 = target_type;
var G__27498__$1 = (((G__27498 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27498)));
var G__27498__$2 = (((G__27498__$1 == null))?null:clojure.string.trim(G__27498__$1));
var G__27498__$3 = (((G__27498__$2 == null))?null:clojure.string.lower_case(G__27498__$2));
var G__27498__$4 = (((G__27498__$3 == null))?null:clojure.string.replace(G__27498__$3,/_/,"-"));
if((G__27498__$4 == null)){
return null;
} else {
return cljs.core.not_empty(G__27498__$4);
}
});
knoxx.backend.domain.actor.tools.parse_metadata = (function knoxx$backend$domain$actor$tools$parse_metadata(metadata_json){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(metadata_json)))){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
return knoxx.backend.domain.tools.json_parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(metadata_json)));
}
});
knoxx.backend.domain.actor.tools.nonblank = (function knoxx$backend$domain$actor$tools$nonblank(value){
var G__27504 = value;
var G__27504__$1 = (((G__27504 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27504)));
var G__27504__$2 = (((G__27504__$1 == null))?null:clojure.string.trim(G__27504__$1));
if((G__27504__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27504__$2);
}
});
knoxx.backend.domain.actor.tools.prefixed_target = (function knoxx$backend$domain$actor$tools$prefixed_target(target){
var t = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(target)));
var idx = t.indexOf(":");
if((idx > (0))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),knoxx.backend.domain.actor.tools.normalize_target_type(t.slice((0),idx)),new cljs.core.Keyword(null,"id","id",-1388402092),knoxx.backend.domain.actor.tools.nonblank(t.slice((idx + (1))))], null);
} else {
return null;
}
});
knoxx.backend.domain.actor.tools.current_context = (function knoxx$backend$domain$actor$tools$current_context(){
var or__5162__auto__ = (knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.get_context.call(null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
});
knoxx.backend.domain.actor.tools.parent_context = (function knoxx$backend$domain$actor$tools$parent_context(ctx,metadata){
var agent_spec = new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541).cljs$core$IFn$_invoke$arity$1(ctx);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(function (){var or__5162__auto__ = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parentConversationId","parentConversationId",-64718550).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent-conversation-id","parent-conversation-id",-1886944426).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent_conversation_id","parent_conversation_id",-882361166).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parentConversationId","parentConversationId",-64718550).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent-conversation-id","parent-conversation-id",-1886944426).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent_conversation_id","parent_conversation_id",-882361166).cljs$core$IFn$_invoke$arity$1(agent_spec));
}
}
}
}
}
})(),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(function (){var or__5162__auto__ = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parentSessionId","parentSessionId",1674230329).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent-session-id","parent-session-id",975696106).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent_session_id","parent_session_id",-44051626).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parentSessionId","parentSessionId",1674230329).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent-session-id","parent-session-id",975696106).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent_session_id","parent_session_id",-44051626).cljs$core$IFn$_invoke$arity$1(agent_spec));
}
}
}
}
}
})(),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),(function (){var or__5162__auto__ = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014).cljs$core$IFn$_invoke$arity$1(metadata));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.domain.actor.tools.nonblank(new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014).cljs$core$IFn$_invoke$arity$1(agent_spec));
}
}
}
}
}
})()], null);
});
knoxx.backend.domain.actor.tools.resolve_target_sync = (function knoxx$backend$domain$actor$tools$resolve_target_sync(params,metadata){
var ctx = knoxx.backend.domain.actor.tools.current_context();
var target = knoxx.backend.domain.actor.tools.nonblank((function (){var or__5162__auto__ = (params["target"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "self";
}
})());
var type_hint = knoxx.backend.domain.actor.tools.normalize_target_type((params["target_type"]));
var parsed = knoxx.backend.domain.actor.tools.prefixed_target(target);
var target_type = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return type_hint;
}
})();
var target_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.truth_((function (){var fexpr__27524 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["parent",null,"event",null,"self",null], null), null);
return (fexpr__27524.cljs$core$IFn$_invoke$arity$1 ? fexpr__27524.cljs$core$IFn$_invoke$arity$1(target) : fexpr__27524.call(null,target));
})())){
return null;
} else {
return target;
}
}
})();
var explicit_conversation_id = knoxx.backend.domain.actor.tools.nonblank((function (){var or__5162__auto__ = (params["conversation_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["conversationId"]);
}
})());
var explicit_session_id = knoxx.backend.domain.actor.tools.nonblank((function (){var or__5162__auto__ = (params["session_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["sessionId"]);
}
})());
var explicit_run_id = knoxx.backend.domain.actor.tools.nonblank((function (){var or__5162__auto__ = (params["run_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["runId"]);
}
})());
var parent = knoxx.backend.domain.actor.tools.parent_context(ctx,metadata);
var G__27527 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"target","target",253001721),target,new cljs.core.Keyword(null,"target-type","target-type",-1795727181),target_type,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),explicit_conversation_id,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),explicit_session_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),(function (){var or__5162__auto__ = explicit_run_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx);
}
})()], null);
var G__27527__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,"self"))?cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__27527,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(function (){var or__5162__auto__ = explicit_conversation_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ctx);
}
})(),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(function (){var or__5162__auto__ = explicit_session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(ctx);
}
})(),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),(function (){var or__5162__auto__ = explicit_run_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx);
}
})()], null)], 0)):G__27527);
var G__27527__$2 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,"parent"))?cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__27527__$1,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(function (){var or__5162__auto__ = explicit_conversation_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(parent);
}
})(),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(function (){var or__5162__auto__ = explicit_session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(parent);
}
})(),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),(function (){var or__5162__auto__ = explicit_run_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(parent);
}
})()], null)], 0)):G__27527__$1);
var G__27527__$3 = (cljs.core.truth_((function (){var fexpr__27530 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["conversation",null,"conversationid",null,"conversation-id",null], null), null);
return (fexpr__27530.cljs$core$IFn$_invoke$arity$1 ? fexpr__27530.cljs$core$IFn$_invoke$arity$1(target_type) : fexpr__27530.call(null,target_type));
})())?cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__27527__$2,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(function (){var or__5162__auto__ = explicit_conversation_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return target_id;
}
})()], null)], 0)):G__27527__$2);
var G__27527__$4 = (cljs.core.truth_((function (){var fexpr__27532 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["sessionid",null,"session-id",null,"session",null], null), null);
return (fexpr__27532.cljs$core$IFn$_invoke$arity$1 ? fexpr__27532.cljs$core$IFn$_invoke$arity$1(target_type) : fexpr__27532.call(null,target_type));
})())?cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__27527__$3,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(function (){var or__5162__auto__ = explicit_session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return target_id;
}
})()], null)], 0)):G__27527__$3);
var G__27527__$5 = (cljs.core.truth_((function (){var fexpr__27534 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["actorid",null,"actor-id",null,"actor",null], null), null);
return (fexpr__27534.cljs$core$IFn$_invoke$arity$1 ? fexpr__27534.cljs$core$IFn$_invoke$arity$1(target_type) : fexpr__27534.call(null,target_type));
})())?cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__27527__$4,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),target_id], null)], 0)):G__27527__$4);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("event",target_type)){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__27527__$5,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"event-target","event-target",1020690123),target_id], null)], 0));
} else {
return G__27527__$5;
}
});
knoxx.backend.domain.actor.tools.resolve_session_conversation_BANG_ = (async function knoxx$backend$domain$actor$tools$resolve_session_conversation_BANG_(target){
var session_id = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target);
var conversation_id = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target);
if(cljs.core.truth_((await (async function (){var or__5162__auto__ = conversation_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)));
}
})()))){
return target;
} else {
var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(target,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(session);
}
})()));
}
});
knoxx.backend.domain.actor.tools.delivery_mode = (function knoxx$backend$domain$actor$tools$delivery_mode(mode){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("message",mode)){
return "follow-up";
} else {
return mode;
}
});
knoxx.backend.domain.actor.tools.control_path = (function knoxx$backend$domain$actor$tools$control_path(mode){
var G__27547 = knoxx.backend.domain.actor.tools.delivery_mode(mode);
switch (G__27547) {
case "steer":
return "/api/knoxx/steer";

break;
case "follow-up":
return "/api/knoxx/follow-up";

break;
default:
return "/api/knoxx/follow-up";

}
});
knoxx.backend.domain.actor.tools.event_payload = (function knoxx$backend$domain$actor$tools$event_payload(target,content,metadata,current,mailbox_id){
var G__27548 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sourceKind","sourceKind",-1570414889),"actor",new cljs.core.Keyword(null,"eventKind","eventKind",2138897648),"actors.message",new cljs.core.Keyword(null,"payload","payload",-383036092),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"sourceRunId","sourceRunId",-334289727),new cljs.core.Keyword(null,"sourceConversationId","sourceConversationId",-1312528671),new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"sourceSessionId","sourceSessionId",228673635),new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"mailboxId","mailboxId",-395830287),new cljs.core.Keyword(null,"runId","runId",505587730),new cljs.core.Keyword(null,"targetType","targetType",1097784409),new cljs.core.Keyword(null,"target","target",253001721),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),new cljs.core.Keyword(null,"metadata","metadata",1799301597)],[new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(current),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(current),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(current),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target),content,mailbox_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"target-type","target-type",-1795727181).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"target","target",253001721).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target),metadata])], null);
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mailbox_id)))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27548,new cljs.core.Keyword(null,"id","id",-1388402092),knoxx.backend.domain.actor.mailbox.mailbox_event_id(mailbox_id));
} else {
return G__27548;
}
});
knoxx.backend.domain.actor.tools.send_event_BANG_ = (function knoxx$backend$domain$actor$tools$send_event_BANG_(config,target,content,metadata,mailbox_id){
return knoxx.backend.domain.actor.tools.fetch_json_BANG_(config,"POST","/api/admin/config/events/dispatch",knoxx.backend.domain.actor.tools.event_payload(target,content,metadata,knoxx.backend.domain.actor.tools.current_context(),mailbox_id));
});
knoxx.backend.domain.actor.tools.send_control_BANG_ = (function knoxx$backend$domain$actor$tools$send_control_BANG_(config,target,mode,content,metadata){
var conversation_id = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target);
var session_id = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target);
var run_id = new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(conversation_id)))){
return Promise.reject((new Error("conversation_id is required for steer/follow-up actor messages")));
} else {
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)))){
return Promise.reject((new Error("session_id is required for steer/follow-up actor messages")));
} else {
return knoxx.backend.domain.actor.tools.fetch_json_BANG_(config,"POST",knoxx.backend.domain.actor.tools.control_path(mode),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"message","message",-406056002),content,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"metadata","metadata",1799301597),metadata], null));

}
}
});
knoxx.backend.domain.actor.tools.resolve_actor_route_BANG_ = (async function knoxx$backend$domain$actor$tools$resolve_actor_route_BANG_(runtime,target){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target);
if(cljs.core.truth_(and__5160__auto__)){
return ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target))))) && (clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target))))));
} else {
return and__5160__auto__;
}
})()))){
var route = (await knoxx.backend.domain.actor.mailbox.resolve_actor_session_BANG_(runtime,new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target)));
if(cljs.core.truth_(route)){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([target,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(route),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(route),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(route);
}
})()),new cljs.core.Keyword(null,"resolved-actor-route","resolved-actor-route",-1522711213),route], null)], 0));
} else {
return target;
}
} else {
return target;
}
});
knoxx.backend.domain.actor.tools.mailbox_delivery_mode = (function knoxx$backend$domain$actor$tools$mailbox_delivery_mode(mode){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("event",mode)){
return "event";
} else {
return knoxx.backend.domain.actor.tools.delivery_mode(mode);
}
});
knoxx.backend.domain.actor.tools.create_mailbox_entry_BANG_ = (function knoxx$backend$domain$actor$tools$create_mailbox_entry_BANG_(runtime,target,mode,content,metadata){
var current = knoxx.backend.domain.actor.tools.current_context();
return knoxx.backend.domain.actor.mailbox.create_entry_BANG_(runtime,new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"kind","kind",-717265803),"actor-message",new cljs.core.Keyword(null,"status","status",-1997798413),"pending",new cljs.core.Keyword(null,"source","source",-433931539),knoxx.backend.domain.actor.mailbox.source_from_context(current),new cljs.core.Keyword(null,"target","target",253001721),target,new cljs.core.Keyword(null,"delivery-mode","delivery-mode",2042238834),knoxx.backend.domain.actor.tools.mailbox_delivery_mode(mode),new cljs.core.Keyword(null,"content-ref","content-ref",1710065788),(function (){var G__27566 = cljs.core.PersistentArrayMap.EMPTY;
var G__27566__$1 = (cljs.core.truth_(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27566,new cljs.core.Keyword(null,"target-run-id","target-run-id",-218529148),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target)):G__27566);
if(cljs.core.truth_(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(current))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27566__$1,new cljs.core.Keyword(null,"source-run-id","source-run-id",-2000058256),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(current));
} else {
return G__27566__$1;
}
})(),new cljs.core.Keyword(null,"metadata","metadata",1799301597),metadata,new cljs.core.Keyword(null,"preview","preview",451279890),content], null));
});
knoxx.backend.domain.actor.tools.mailbox_id = (function knoxx$backend$domain$actor$tools$mailbox_id(entry){
return new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344).cljs$core$IFn$_invoke$arity$1(entry);
});
knoxx.backend.domain.actor.tools.delivery_content_ref = (function knoxx$backend$domain$actor$tools$delivery_content_ref(mode,result,mailbox_id){
var G__27571 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"delivery-mode","delivery-mode",2042238834),knoxx.backend.domain.actor.tools.mailbox_delivery_mode(mode)], null);
var G__27571__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("event",mode))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27571,new cljs.core.Keyword(null,"event-id","event-id",2130210178),knoxx.backend.domain.actor.mailbox.mailbox_event_id(mailbox_id)):G__27571);
if(cljs.core.map_QMARK_(result)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27571__$1,new cljs.core.Keyword(null,"result","result",1415092211),result);
} else {
return G__27571__$1;
}
});
knoxx.backend.domain.actor.tools.mark_failed_and_rethrow_BANG_ = (async function knoxx$backend$domain$actor$tools$mark_failed_and_rethrow_BANG_(runtime,mailbox_id,err){
try{(await knoxx.backend.domain.actor.mailbox.mark_failed_BANG_(runtime,mailbox_id,err));
}catch (e27574){var __27710 = e27574;
}
throw err;
});
knoxx.backend.domain.actor.tools.deliver_actor_message_BANG_ = (async function knoxx$backend$domain$actor$tools$deliver_actor_message_BANG_(runtime,config,mode,content,metadata,resolved_target,entry){
var mailbox_id = knoxx.backend.domain.actor.tools.mailbox_id(entry);
var metadata_STAR_ = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(metadata,new cljs.core.Keyword(null,"mailboxId","mailboxId",-395830287),mailbox_id);
try{var result = (await ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("event",mode))?knoxx.backend.domain.actor.tools.send_event_BANG_(config,resolved_target,content,metadata_STAR_,mailbox_id):knoxx.backend.domain.actor.tools.send_control_BANG_(config,resolved_target,mode,content,metadata_STAR_)));
var result_STAR_ = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
try{(await knoxx.backend.domain.actor.mailbox.mark_delivered_BANG_(runtime,mailbox_id,knoxx.backend.domain.actor.tools.delivery_content_ref(mode,result_STAR_,mailbox_id)));
}catch (e27577){var __27742 = e27577;
}
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"entry","entry",505168823),entry,new cljs.core.Keyword(null,"target","target",253001721),resolved_target,new cljs.core.Keyword(null,"result","result",1415092211),result_STAR_], null);
}catch (e27576){var err = e27576;
return (await knoxx.backend.domain.actor.tools.mark_failed_and_rethrow_BANG_(runtime,mailbox_id,err));
}});
knoxx.backend.domain.actor.tools.actors_send_message_execute = (async function knoxx$backend$domain$actor$tools$actors_send_message_execute(runtime,config,_tool_call_id,params,a,b,c){
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
var content = (await (async function (){var or__5162__auto__ = (params["content"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var mode = knoxx.backend.domain.actor.tools.normalize_mode((params["mode"]));
var metadata = knoxx.backend.domain.actor.tools.parse_metadata((await (async function (){var or__5162__auto__ = (params["metadata_json"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["metadataJson"]);
}
})()));
var target = knoxx.backend.domain.actor.tools.resolve_target_sync(params,metadata);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(content)))){
throw (new Error("content is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Sending actor message via "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mode)+"\u2026"));

var session_target = (await knoxx.backend.domain.actor.tools.resolve_session_conversation_BANG_(target));
var resolved_target = (await knoxx.backend.domain.actor.tools.resolve_actor_route_BANG_(runtime,session_target));
var entry = (await knoxx.backend.domain.actor.tools.create_mailbox_entry_BANG_(runtime,resolved_target,mode,content,metadata));
var map__27590 = (await knoxx.backend.domain.actor.tools.deliver_actor_message_BANG_(runtime,config,mode,content,metadata,resolved_target,entry));
var map__27590__$1 = cljs.core.__destructure_map(map__27590);
var entry__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27590__$1,new cljs.core.Keyword(null,"entry","entry",505168823));
var target__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27590__$1,new cljs.core.Keyword(null,"target","target",253001721));
var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27590__$1,new cljs.core.Keyword(null,"result","result",1415092211));
var summary = (""+"Sent actor message to "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"target","target",253001721).cljs$core$IFn$_invoke$arity$1(target__$1))+" via "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("message",mode))?"follow-up":mode)));
return knoxx.backend.domain.text.tool_text_result(summary,new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"tool","tool",-1298696470),"actors.send-message",new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"mailbox_id","mailbox_id",1368174469),knoxx.backend.domain.actor.tools.mailbox_id(entry__$1),new cljs.core.Keyword(null,"mailbox_durable","mailbox_durable",-1111734957),cljs.core.boolean$(new cljs.core.Keyword("mailbox","durable?","mailbox/durable?",771149223).cljs$core$IFn$_invoke$arity$1(entry__$1)),new cljs.core.Keyword(null,"target","target",253001721),target__$1,new cljs.core.Keyword(null,"result","result",1415092211),result], null));
});
knoxx.backend.domain.actor.tools.actors_send_message_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"actors.send-message","Actors Send Message","Send an actor-to-actor message to a parent, sibling, session, conversation, actor target, or event queue.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Route asynchronous child-agent progress or results to another actor/session as steer, follow-up, or event while preserving lineage metadata.",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use target=parent from sub-agents when parentConversationId/parentSessionId is present in metadata or agent context.","Use mode=follow-up for busy targets; use mode=steer only for immediate interruption/steering.","Use mode=event when no live session target is available but an auditable mailbox-style event should be emitted.","Pass metadata_json with parentRunId, subAgentId, resultKey, or other lineage labels for auditability."], null),knoxx.backend.domain.actor.tools.send_message_params,knoxx.backend.domain.actor.tools.actors_send_message_execute], 0));
knoxx.backend.domain.actor.tools.create_actors_custom_tools = (function knoxx$backend$domain$actor$tools$create_actors_custom_tools(var_args){
var G__27597 = arguments.length;
switch (G__27597) {
case 2:
return knoxx.backend.domain.actor.tools.create_actors_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.actor.tools.create_actors_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.actor.tools.create_actors_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.actor.tools.create_actors_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.actor.tools.create_actors_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
if((((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,"actors.send-message")))){
return cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.actor.tools.actors_send_message_tool(runtime,config)], null));
} else {
return cljs.core.clj__GT_js(cljs.core.PersistentVector.EMPTY);
}
}));

(knoxx.backend.domain.actor.tools.create_actors_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.actor.tools.js.map
