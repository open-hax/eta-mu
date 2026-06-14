import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.action.registry.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.infra.agent.runner.js";
import "./knoxx.backend.infra.tooling.js";
goog.provide('knoxx.backend.domain.action.start_agent_session');
knoxx.backend.domain.action.start_agent_session.nonblank = (function knoxx$backend$domain$action$start_agent_session$nonblank(value){
var G__30079 = value;
var G__30079__$1 = (((G__30079 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30079)));
var G__30079__$2 = (((G__30079__$1 == null))?null:clojure.string.trim(G__30079__$1));
if((G__30079__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30079__$2);
}
});
knoxx.backend.domain.action.start_agent_session.id_token = (function knoxx$backend$domain$action$start_agent_session$id_token(value){
var G__30095 = value;
var G__30095__$1 = (((G__30095 == null))?null:(function (){var G__30097 = G__30095;
var G__30097__$1 = (((value instanceof cljs.core.Keyword))?cljs.core.name(G__30097):G__30097);
if((!((value instanceof cljs.core.Keyword)))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30097__$1));
} else {
return G__30097__$1;
}
})());
var G__30095__$2 = (((G__30095__$1 == null))?null:clojure.string.trim(G__30095__$1));
if((G__30095__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30095__$2);
}
});
knoxx.backend.domain.action.start_agent_session.id_segment = (function knoxx$backend$domain$action$start_agent_session$id_segment(value){
var G__30104 = knoxx.backend.domain.action.start_agent_session.id_token(value);
var G__30104__$1 = (((G__30104 == null))?null:clojure.string.replace(G__30104,/[^A-Za-z0-9._:-]+/,"_"));
var G__30104__$2 = (((G__30104__$1 == null))?null:clojure.string.replace(G__30104__$1,/^_+|_+$/,""));
if((G__30104__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30104__$2);
}
});
knoxx.backend.domain.action.start_agent_session.payload_value = (function knoxx$backend$domain$action$start_agent_session$payload_value(event,k){
var payload = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(payload,k);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.truth_(cljs.core.namespace(k))){
return null;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(payload,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs.core.name(k)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(payload,cljs.core.name(k));
}
}
}
});
knoxx.backend.domain.action.start_agent_session.qualified_name = (function knoxx$backend$domain$action$start_agent_session$qualified_name(value){
if((value instanceof cljs.core.Keyword)){
var temp__5823__auto__ = cljs.core.namespace(value);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(value)));
} else {
return cljs.core.name(value);
}
} else {
if((value == null)){
return null;
} else {
var G__30130 = value;
var G__30130__$1 = (((G__30130 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30130)));
var G__30130__$2 = (((G__30130__$1 == null))?null:clojure.string.trim(G__30130__$1));
if((G__30130__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30130__$2);
}

}
}
});
knoxx.backend.domain.action.start_agent_session.first_nonblank_path = (function knoxx$backend$domain$action$start_agent_session$first_nonblank_path(m,candidates){
return cljs.core.some((function (p__30144){
var vec__30145 = p__30144;
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30145,(0),null);
var source = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30145,(1),null);
var temp__5825__auto__ = knoxx.backend.domain.action.start_agent_session.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(m,path));
if(cljs.core.truth_(temp__5825__auto__)){
var value = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"task","task",-1476607993),value,new cljs.core.Keyword(null,"task-source","task-source",-270341262),source,new cljs.core.Keyword(null,"deprecated-agent-task-fallback?","deprecated-agent-task-fallback?",1485867191),false], null);
} else {
return null;
}
}),candidates);
});
knoxx.backend.domain.action.start_agent_session.action_task_paths = new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"task","task",-1476607993)], null),new cljs.core.Keyword("action","task","action/task",2070756797)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716)], null),new cljs.core.Keyword("action","task-prompt","action/task-prompt",-1744991626)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720)], null),new cljs.core.Keyword("action","task-prompt","action/task-prompt",-1744991626)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"message-template","message-template",-989719339)], null),new cljs.core.Keyword("action","message-template","action/message-template",424973087)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"message_template","message_template",-222108041)], null),new cljs.core.Keyword("action","message-template","action/message-template",424973087)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"user-message","user-message",889829115)], null),new cljs.core.Keyword("action","user-message","action/user-message",1642411117)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"userMessage","userMessage",708828326)], null),new cljs.core.Keyword("action","user-message","action/user-message",1642411117)], null)], null);
knoxx.backend.domain.action.start_agent_session.trigger_task_paths = new cljs.core.PersistentVector(null, 12, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","task","trigger/task",1696692031)], null),new cljs.core.Keyword("trigger","task","trigger/task",1696692031)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","task-prompt","trigger/task-prompt",710537852)], null),new cljs.core.Keyword("trigger","task-prompt","trigger/task-prompt",710537852)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","message-template","trigger/message-template",-1000547)], null),new cljs.core.Keyword("trigger","message-template","trigger/message-template",-1000547)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","user-message","trigger/user-message",1933114611)], null),new cljs.core.Keyword("trigger","user-message","trigger/user-message",1933114611)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","context","trigger/context",357087151),new cljs.core.Keyword(null,"task","task",-1476607993)], null),new cljs.core.Keyword("trigger","context-task","trigger/context-task",-936775636)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword("trigger","task","trigger/task",1696692031)], null),new cljs.core.Keyword("trigger","task","trigger/task",1696692031)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword("trigger","task-prompt","trigger/task-prompt",710537852)], null),new cljs.core.Keyword("trigger","task-prompt","trigger/task-prompt",710537852)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword("trigger","message-template","trigger/message-template",-1000547)], null),new cljs.core.Keyword("trigger","message-template","trigger/message-template",-1000547)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword("trigger","user-message","trigger/user-message",1933114611)], null),new cljs.core.Keyword("trigger","user-message","trigger/user-message",1933114611)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"task","task",-1476607993)], null),new cljs.core.Keyword("trigger","data-task","trigger/data-task",-1139915471)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"message-template","message-template",-989719339)], null),new cljs.core.Keyword("trigger","data-message-template","trigger/data-message-template",-1451249010)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113),new cljs.core.Keyword(null,"task","task",-1476607993)], null),new cljs.core.Keyword("trigger","context-task","trigger/context-task",-936775636)], null)], null);
/**
 * Resolve triggered-agent task text; agent :prompts :task is fallback only.
 */
knoxx.backend.domain.action.start_agent_session.action_task_input = (function knoxx$backend$domain$action$start_agent_session$action_task_input(action,trigger,resolved){
var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.first_nonblank_path(action,knoxx.backend.domain.action.start_agent_session.action_task_paths);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.first_nonblank_path(trigger,knoxx.backend.domain.action.start_agent_session.trigger_task_paths);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var temp__5825__auto__ = knoxx.backend.domain.action.start_agent_session.nonblank(new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(resolved));
if(cljs.core.truth_(temp__5825__auto__)){
var task = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"task","task",-1476607993),task,new cljs.core.Keyword(null,"task-source","task-source",-270341262),new cljs.core.Keyword("agent","task-prompt","agent/task-prompt",-173682875),new cljs.core.Keyword(null,"deprecated-agent-task-fallback?","deprecated-agent-task-fallback?",1485867191),true], null);
} else {
return null;
}
}
}
});
/**
 * Render the user message for an event-triggered agent session.
 */
knoxx.backend.domain.action.start_agent_session.render_start_message = (function knoxx$backend$domain$action$start_agent_session$render_start_message(trigger,event,task_input,trigger_id){
var payload = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
var task = new cljs.core.Keyword(null,"task","task",-1476607993).cljs$core$IFn$_invoke$arity$1(task_input);
var task_source = new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(task_input);
var task_label = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(task_source,new cljs.core.Keyword("agent","task-prompt","agent/task-prompt",-173682875)))?"Deprecated agent task prompt fallback:":"Action task prompt:");
return (""+"Event: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.action.start_agent_session.qualified_name(new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event)))+"\n"+"Trigger: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return trigger_id;
}
})())+"\n"+"Reason: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","context","trigger/context",357087151),new cljs.core.Keyword(null,"reason","reason",-2070751759)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "trigger action";
}
})())+"\n"+"Channel ID: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.payload_value(event,new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.payload_value(event,new cljs.core.Keyword(null,"channel-id","channel-id",138191095));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())+"\n"+"Author: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.payload_value(event,new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.payload_value(event,new cljs.core.Keyword(null,"author-username","author-username",1462495670));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())+"\n"+"Content: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.payload_value(event,new cljs.core.Keyword(null,"content","content",15833224));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(task))))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(task_label)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(task)+"\n"))));
});
knoxx.backend.domain.action.start_agent_session.action_agent_id = (function knoxx$backend$domain$action$start_agent_session$action_agent_id(ctx,action){
var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"agent-id","agent-id",1570348870)], null)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"agentId","agentId",2025355078)], null)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.action.start_agent_session.nonblank(new cljs.core.Keyword("agent","id","agent/id",-1462765745).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.action.start_agent_session.nonblank(new cljs.core.Keyword("agent","contract","agent/contract",-1980031674).cljs$core$IFn$_invoke$arity$1(ctx));
}
}
}
});
knoxx.backend.domain.action.start_agent_session.actor_id = (function knoxx$backend$domain$action$start_agent_session$actor_id(ctx,resolved){
var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.nonblank(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.action.start_agent_session.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(resolved));
}
});
knoxx.backend.domain.action.start_agent_session.payload_id = (function knoxx$backend$domain$action$start_agent_session$payload_id(event,k){
return knoxx.backend.domain.action.start_agent_session.id_segment(knoxx.backend.domain.action.start_agent_session.payload_value(event,k));
});
knoxx.backend.domain.action.start_agent_session.trigger_id = (function knoxx$backend$domain$action$start_agent_session$trigger_id(trigger,event,agent_id){
var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.id_segment(new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.id_segment(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword("contract","id","contract/id",-872298206)], null)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"triggerId","triggerId",-684068188));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.action.start_agent_session.id_segment(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(event,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("event","generator","event/generator",-736110419),new cljs.core.Keyword("trigger","id","trigger/id",-326368132)], null)));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = knoxx.backend.domain.action.start_agent_session.id_segment(agent_id);
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
return "manual-trigger";
}
}
}
}
}
}
});
knoxx.backend.domain.action.start_agent_session.event_scope_id = (function knoxx$backend$domain$action$start_agent_session$event_scope_id(event){
var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"channel-id","channel-id",138191095));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"threadId","threadId",-440699805));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"thread-id","thread-id",895608538));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword(null,"thread_id","thread_id",1544692526));
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword("schedule","id","schedule/id",-1003403363));
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var or__5162__auto____$7 = knoxx.backend.domain.action.start_agent_session.id_segment(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(event,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("event","generator","event/generator",-736110419),new cljs.core.Keyword("schedule","id","schedule/id",-1003403363)], null)));
if(cljs.core.truth_(or__5162__auto____$7)){
return or__5162__auto____$7;
} else {
var or__5162__auto____$8 = knoxx.backend.domain.action.start_agent_session.id_segment(new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event));
if(cljs.core.truth_(or__5162__auto____$8)){
return or__5162__auto____$8;
} else {
return "event";
}
}
}
}
}
}
}
}
}
});
/**
 * Source/session config declared on the agent contract under :data :source.
 */
knoxx.backend.domain.action.start_agent_session.agent_source_config = (function knoxx$backend$domain$action$start_agent_session$agent_source_config(resolved){
var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resolved,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"source","source",-433931539)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
});
/**
 * True when the agent contract asks event runs to share one session per
 * trigger+scope instead of minting a fresh session for every event.
 */
knoxx.backend.domain.action.start_agent_session.sticky_session_source_QMARK_ = (function knoxx$backend$domain$action$start_agent_session$sticky_session_source_QMARK_(source){
return cljs.core.boolean$((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"stickySession","stickySession",1252676028).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"sticky-session","sticky-session",-380337644).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"sticky_session","sticky_session",-495460458).cljs$core$IFn$_invoke$arity$1(source);
}
}
})());
});
knoxx.backend.domain.action.start_agent_session.session_max_messages = (function knoxx$backend$domain$action$start_agent_session$session_max_messages(source){
var value = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sessionMaxMessages","sessionMaxMessages",-734097286).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"session-max-messages","session-max-messages",-565171561).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"session_max_messages","session_max_messages",13587375).cljs$core$IFn$_invoke$arity$1(source);
}
}
})();
if(((typeof value === 'number') && ((value > (0))))){
return value;
} else {
return null;
}
});
/**
 * Context policy for the spawned agent: the contract's own policy, with the
 * source's sessionMaxMessages as the message cap when none is set.
 */
knoxx.backend.domain.action.start_agent_session.sticky_context_policy = (function knoxx$backend$domain$action$start_agent_session$sticky_context_policy(resolved,source){
var base = new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(resolved);
var max_messages = knoxx.backend.domain.action.start_agent_session.session_max_messages(source);
var has_cap_QMARK_ = cljs.core.some((function (p1__30299_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(base,p1__30299_SHARP_);
}),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"max-messages","max-messages",-1089461657),new cljs.core.Keyword(null,"maxMessages","maxMessages",1680581379),new cljs.core.Keyword(null,"max_messages","max_messages",-755082145)], null));
if(cljs.core.truth_((function (){var and__5160__auto__ = max_messages;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not(has_cap_QMARK_);
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((function (){var or__5162__auto__ = base;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),new cljs.core.Keyword(null,"max-messages","max-messages",-1089461657),max_messages);
} else {
return base;
}
});
/**
 * Return run, conversation, and session ids for event-triggered agent actions.
 * 
 * Default ids embed the spawn timestamp so concurrent runs never collide.
 * With {:sticky? true} the conversation and session ids drop the timestamp so
 * every event for the same trigger+scope (e.g. Discord channel) continues one
 * persistent session; only the run id stays unique per spawn.
 */
knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers = (function knoxx$backend$domain$action$start_agent_session$triggered_session_identifiers(var_args){
var G__30325 = arguments.length;
switch (G__30325) {
case 4:
return knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$core$IFn$_invoke$arity$4 = (function (trigger,event,agent_id,ts){
return knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$core$IFn$_invoke$arity$5(trigger,event,agent_id,ts,null);
}));

(knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$core$IFn$_invoke$arity$5 = (function (trigger,event,agent_id,ts,p__30359){
var map__30362 = p__30359;
var map__30362__$1 = cljs.core.__destructure_map(map__30362);
var sticky_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30362__$1,new cljs.core.Keyword(null,"sticky?","sticky?",-760710127));
var trigger_id_SINGLEQUOTE_ = knoxx.backend.domain.action.start_agent_session.trigger_id(trigger,event,agent_id);
var scope_id = knoxx.backend.domain.action.start_agent_session.event_scope_id(event);
var run_id = (""+"trigger-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id_SINGLEQUOTE_)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ts));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),trigger_id_SINGLEQUOTE_,new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009),scope_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),(cljs.core.truth_(sticky_QMARK_)?(""+"trigger-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id_SINGLEQUOTE_)+"-sticky-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope_id)):(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope_id))),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(cljs.core.truth_(sticky_QMARK_)?(""+"trigger-session-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id_SINGLEQUOTE_)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope_id)):(""+"trigger-session-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id_SINGLEQUOTE_)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope_id)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ts)))], null);
}));

(knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$lang$maxFixedArity = 5);

/**
 * Return audit metadata that should follow an event-triggered run into the run store and OpenPlanner.
 */
knoxx.backend.domain.action.start_agent_session.triggered_audit_metadata = (function knoxx$backend$domain$action$start_agent_session$triggered_audit_metadata(_trigger,event,ids){
var event_types = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.action.start_agent_session.qualified_name,new cljs.core.Keyword("event","types","event/types",753963593).cljs$core$IFn$_invoke$arity$1(event))));
var schedule_id = (function (){var or__5162__auto__ = knoxx.backend.domain.action.start_agent_session.payload_id(event,new cljs.core.Keyword("schedule","id","schedule/id",-1003403363));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.action.start_agent_session.id_segment(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(event,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("event","generator","event/generator",-736110419),new cljs.core.Keyword("schedule","id","schedule/id",-1003403363)], null)));
}
})();
var G__30389 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(ids),new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009).cljs$core$IFn$_invoke$arity$1(ids)], null);
var G__30389__$1 = (cljs.core.truth_(new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30389,new cljs.core.Keyword(null,"event_id","event_id",-767275570),new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event)):G__30389);
var G__30389__$2 = (cljs.core.truth_(new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30389__$1,new cljs.core.Keyword(null,"event_type","event_type",1569866042),knoxx.backend.domain.action.start_agent_session.qualified_name(new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event))):G__30389__$1);
var G__30389__$3 = ((cljs.core.seq(event_types))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30389__$2,new cljs.core.Keyword(null,"event_types","event_types",-752038707),event_types):G__30389__$2);
if(cljs.core.truth_(schedule_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30389__$3,new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),schedule_id);
} else {
return G__30389__$3;
}
});
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword("actions","start-agent-session","actions/start-agent-session",-1377218838),(function (p__30399,action){
var map__30400 = p__30399;
var map__30400__$1 = cljs.core.__destructure_map(map__30400);
var ctx = map__30400__$1;
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30400__$1,new cljs.core.Keyword(null,"config","config",994861415));
var event = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30400__$1,new cljs.core.Keyword(null,"event","event",301435442));
var trigger = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30400__$1,new cljs.core.Keyword(null,"trigger","trigger",103466139));
var agent_id = knoxx.backend.domain.action.start_agent_session.action_agent_id(ctx,action);
var resolved = knoxx.backend.infra.tooling.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,agent_id,knoxx.backend.domain.action.start_agent_session.actor_id(ctx,null));
var actor_id_SINGLEQUOTE_ = knoxx.backend.domain.action.start_agent_session.actor_id(ctx,resolved);
var ts = Date.now();
var source = knoxx.backend.domain.action.start_agent_session.agent_source_config(resolved);
var ids = knoxx.backend.domain.action.start_agent_session.triggered_session_identifiers.cljs$core$IFn$_invoke$arity$5(trigger,event,agent_id,ts,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sticky?","sticky?",-760710127),knoxx.backend.domain.action.start_agent_session.sticky_session_source_QMARK_(source)], null));
var task_input = knoxx.backend.domain.action.start_agent_session.action_task_input(action,trigger,resolved);
var rendered_message = knoxx.backend.domain.action.start_agent_session.render_start_message(trigger,event,task_input,new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(ids));
if(cljs.core.truth_(new cljs.core.Keyword(null,"deprecated-agent-task-fallback?","deprecated-agent-task-fallback?",1485867191).cljs$core$IFn$_invoke$arity$1(task_input))){
knoxx.backend.domain.error_observatory.log_warning_BANG_(new cljs.core.Keyword("action","start-agent-session.deprecated-agent-task-prompt","action/start-agent-session.deprecated-agent-task-prompt",-2092166307),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"agent-id","agent-id",1570348870),agent_id,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id_SINGLEQUOTE_,new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518).cljs$core$IFn$_invoke$arity$1(ids),new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event)], null));
} else {
}

return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2(config,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ids),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(ids),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ids),new cljs.core.Keyword(null,"message","message",-406056002),rendered_message,new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"context_policy","context_policy",1230169154),new cljs.core.Keyword(null,"task_source","task_source",-1353297465),new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069),new cljs.core.Keyword(null,"memory_hydration","memory_hydration",-1458677455),new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177),new cljs.core.Keyword(null,"deprecated_agent_task_fallback","deprecated_agent_task_fallback",75079348),new cljs.core.Keyword(null,"rendered_task_prompt","rendered_task_prompt",-1449951109),new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954),new cljs.core.Keyword(null,"model","model",331153215)],[new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(resolved),knoxx.backend.domain.action.start_agent_session.sticky_context_policy(resolved,source),(function (){var G__30404 = new cljs.core.Keyword(null,"task-source","task-source",-270341262).cljs$core$IFn$_invoke$arity$1(task_input);
if((G__30404 == null)){
return null;
} else {
return knoxx.backend.domain.action.start_agent_session.qualified_name(G__30404);
}
})(),agent_id,new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(resolved),actor_id_SINGLEQUOTE_,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"deprecated-agent-task-fallback?","deprecated-agent-task-fallback?",1485867191).cljs$core$IFn$_invoke$arity$1(task_input),new cljs.core.Keyword(null,"task","task",-1476607993).cljs$core$IFn$_invoke$arity$1(task_input),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(resolved)]),knoxx.backend.domain.action.start_agent_session.triggered_audit_metadata(trigger,event,ids)], 0)),new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(resolved)], null));
}));
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword("actions","start-agent","actions/start-agent",1301822298),(function (ctx,action){
return knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(action,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","start-agent-session","actions/start-agent-session",-1377218838)));
}));

//# sourceMappingURL=knoxx.backend.domain.action.start_agent_session.js.map
