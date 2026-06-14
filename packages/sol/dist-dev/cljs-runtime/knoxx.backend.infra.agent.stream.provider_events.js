import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.agent.content.js";
import "./knoxx.backend.infra.agent.tools.js";
goog.provide('knoxx.backend.infra.agent.stream.provider_events');
knoxx.backend.infra.agent.stream.provider_events.js_present_QMARK_ = (function knoxx$backend$infra$agent$stream$provider_events$js_present_QMARK_(value){
return (((!((value == null)))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(value,undefined)));
});
knoxx.backend.infra.agent.stream.provider_events.js__GT_data = (function knoxx$backend$infra$agent$stream$provider_events$js__GT_data(value){
if((!(knoxx.backend.infra.agent.stream.provider_events.js_present_QMARK_(value)))){
return null;
} else {
if(typeof value === 'string'){
return value;
} else {
try{return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e21979){var _ = e21979;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
}
}
}
});
knoxx.backend.infra.agent.stream.provider_events.first_js = (function knoxx$backend$infra$agent$stream$provider_events$first_js(var_args){
var args__5903__auto__ = [];
var len__5897__auto___22007 = arguments.length;
var i__5898__auto___22008 = (0);
while(true){
if((i__5898__auto___22008 < len__5897__auto___22007)){
args__5903__auto__.push((arguments[i__5898__auto___22008]));

var G__22009 = (i__5898__auto___22008 + (1));
i__5898__auto___22008 = G__22009;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.infra.agent.stream.provider_events.first_js.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.infra.agent.stream.provider_events.first_js.cljs$core$IFn$_invoke$arity$variadic = (function (values){
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.stream.provider_events.js_present_QMARK_,values));
}));

(knoxx.backend.infra.agent.stream.provider_events.first_js.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.infra.agent.stream.provider_events.first_js.cljs$lang$applyTo = (function (seq21980){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21980));
}));

knoxx.backend.infra.agent.stream.provider_events.tool_input_preview = (function knoxx$backend$infra$agent$stream$provider_events$tool_input_preview(tool_name,raw_args,args_by_key){
var or__5162__auto__ = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(args_by_key));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,new cljs.core.Keyword(null,"toolArgs","toolArgs",-1880478624).cljs$core$IFn$_invoke$arity$1(args_by_key));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,new cljs.core.Keyword(null,"args","args",1315556576).cljs$core$IFn$_invoke$arity$1(args_by_key));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,new cljs.core.Keyword(null,"arguments","arguments",-1182834456).cljs$core$IFn$_invoke$arity$1(args_by_key));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,new cljs.core.Keyword(null,"input","input",556931961).cljs$core$IFn$_invoke$arity$1(args_by_key));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,new cljs.core.Keyword(null,"parameters","parameters",-1229919748).cljs$core$IFn$_invoke$arity$1(args_by_key));
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,raw_args);
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var G__21982 = knoxx.backend.infra.agent.stream.provider_events.js__GT_data(raw_args);
if((G__21982 == null)){
return null;
} else {
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__21982], 0));
}
}
}
}
}
}
}
}
});
knoxx.backend.infra.agent.stream.provider_events.normalize_message_update = (function knoxx$backend$infra$agent$stream$provider_events$normalize_message_update(event){
var assistant_event = (event["assistantMessageEvent"]);
var assistant_event_type = (function (){var G__21988 = (assistant_event["type"]);
if((G__21988 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21988));
}
})();
var delta = (function (){var or__5162__auto__ = (assistant_event["delta"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (assistant_event["text"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (assistant_event["reasoning"]);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (assistant_event["thinking"]);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return "";
}
}
}
}
})();
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"type","type",1174270348),"message_update",new cljs.core.Keyword(null,"raw","raw",1604651272),event,new cljs.core.Keyword(null,"assistant-message-event","assistant-message-event",102205383),assistant_event,new cljs.core.Keyword(null,"assistant-event-type","assistant-event-type",1217286506),assistant_event_type,new cljs.core.Keyword(null,"delta","delta",108939957),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = delta;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"partial-message","partial-message",-1433009206),(assistant_event["partial"]),new cljs.core.Keyword(null,"tool-call","tool-call",-770496172),(assistant_event["toolCall"]),new cljs.core.Keyword(null,"message","message",-406056002),(event["message"])], null);
});
knoxx.backend.infra.agent.stream.provider_events.normalize_message_end = (function knoxx$backend$infra$agent$stream$provider_events$normalize_message_end(event){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"message_end",new cljs.core.Keyword(null,"raw","raw",1604651272),event,new cljs.core.Keyword(null,"message","message",-406056002),(event["message"])], null);
});
knoxx.backend.infra.agent.stream.provider_events.normalize_tool_start = (function knoxx$backend$infra$agent$stream$provider_events$normalize_tool_start(event){
var tool_name = (function (){var or__5162__auto__ = (event["toolName"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "tool";
}
})();
var args_by_key = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"params","params",710516235),(event["params"]),new cljs.core.Keyword(null,"toolArgs","toolArgs",-1880478624),(event["toolArgs"]),new cljs.core.Keyword(null,"args","args",1315556576),(event["args"]),new cljs.core.Keyword(null,"arguments","arguments",-1182834456),(event["arguments"]),new cljs.core.Keyword(null,"input","input",556931961),(event["input"]),new cljs.core.Keyword(null,"parameters","parameters",-1229919748),(event["parameters"])], null);
var raw_args = knoxx.backend.infra.agent.stream.provider_events.first_js.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(args_by_key),new cljs.core.Keyword(null,"toolArgs","toolArgs",-1880478624).cljs$core$IFn$_invoke$arity$1(args_by_key),new cljs.core.Keyword(null,"args","args",1315556576).cljs$core$IFn$_invoke$arity$1(args_by_key),new cljs.core.Keyword(null,"arguments","arguments",-1182834456).cljs$core$IFn$_invoke$arity$1(args_by_key),new cljs.core.Keyword(null,"input","input",556931961).cljs$core$IFn$_invoke$arity$1(args_by_key),new cljs.core.Keyword(null,"parameters","parameters",-1229919748).cljs$core$IFn$_invoke$arity$1(args_by_key)], 0));
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"type","type",1174270348),"tool_execution_start",new cljs.core.Keyword(null,"raw","raw",1604651272),event,new cljs.core.Keyword(null,"tool-name","tool-name",613742581),tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),(event["toolCallId"]),new cljs.core.Keyword(null,"raw-args","raw-args",2108189532),raw_args,new cljs.core.Keyword(null,"input-raw","input-raw",523867075),knoxx.backend.infra.agent.stream.provider_events.js__GT_data(raw_args),new cljs.core.Keyword(null,"input-preview","input-preview",-811479635),knoxx.backend.infra.agent.stream.provider_events.tool_input_preview(tool_name,raw_args,args_by_key)], null);
});
knoxx.backend.infra.agent.stream.provider_events.normalize_tool_update = (function knoxx$backend$infra$agent$stream$provider_events$normalize_tool_update(event){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"type","type",1174270348),"tool_execution_update",new cljs.core.Keyword(null,"raw","raw",1604651272),event,new cljs.core.Keyword(null,"tool-name","tool-name",613742581),(function (){var or__5162__auto__ = (event["toolName"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "tool";
}
})(),new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),(event["toolCallId"]),new cljs.core.Keyword(null,"preview","preview",451279890),(function (){var or__5162__auto__ = knoxx.backend.domain.agent.content.preview_text_nonblank((event["delta"]),(400));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.preview_text_nonblank((event["update"]),(400));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.preview_text_nonblank((event["message"]),(400));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.agent.content.preview_text_nonblank((event["statusMessage"]),(400));
}
}
}
})()], null);
});
knoxx.backend.infra.agent.stream.provider_events.normalize_tool_end = (function knoxx$backend$infra$agent$stream$provider_events$normalize_tool_end(event){
var raw_result = knoxx.backend.infra.agent.stream.provider_events.first_js.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(event["result"]),(event["toolResult"]),(event["output"])], 0));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"raw","raw",1604651272),new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"is-error","is-error",-127926898),new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),new cljs.core.Keyword(null,"result-preview","result-preview",-1269259984),new cljs.core.Keyword(null,"tool-name","tool-name",613742581),new cljs.core.Keyword(null,"raw-result","raw-result",1277815737),new cljs.core.Keyword(null,"content-parts","content-parts",684529019),new cljs.core.Keyword(null,"result-raw","result-raw",1572789151)],[event,"tool_execution_end",cljs.core.boolean$((event["isError"])),(event["toolCallId"]),(function (){var or__5162__auto__ = knoxx.backend.domain.agent.content.preview_text_nonblank((event["result"]),(20000));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.preview_text_nonblank((event["toolResult"]),(20000));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.agent.content.preview_text_nonblank((event["output"]),(20000));
}
}
})(),(function (){var or__5162__auto__ = (event["toolName"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "tool";
}
})(),raw_result,knoxx.backend.domain.agent.content.tool_result_content_parts(raw_result),knoxx.backend.infra.agent.stream.provider_events.js__GT_data(raw_result)]);
});
knoxx.backend.infra.agent.stream.provider_events.normalize_turn_end = (function knoxx$backend$infra$agent$stream$provider_events$normalize_turn_end(event){
var tool_results = (function (){var or__5162__auto__ = (event["toolResults"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})();
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),"turn_end",new cljs.core.Keyword(null,"raw","raw",1604651272),event,new cljs.core.Keyword(null,"tool-results","tool-results",-888507743),tool_results,new cljs.core.Keyword(null,"tool-result-count","tool-result-count",1416542362),(function (){var or__5162__auto__ = tool_results.length;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()], null);
});
knoxx.backend.infra.agent.stream.provider_events.normalize = (function knoxx$backend$infra$agent$stream$provider_events$normalize(event){
var G__21998 = (function (){var G__21999 = (event["type"]);
if((G__21999 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21999));
}
})();
switch (G__21998) {
case "message_update":
return knoxx.backend.infra.agent.stream.provider_events.normalize_message_update(event);

break;
case "message_end":
return knoxx.backend.infra.agent.stream.provider_events.normalize_message_end(event);

break;
case "tool_execution_start":
return knoxx.backend.infra.agent.stream.provider_events.normalize_tool_start(event);

break;
case "tool_execution_update":
return knoxx.backend.infra.agent.stream.provider_events.normalize_tool_update(event);

break;
case "tool_execution_end":
return knoxx.backend.infra.agent.stream.provider_events.normalize_tool_end(event);

break;
case "turn_end":
return knoxx.backend.infra.agent.stream.provider_events.normalize_turn_end(event);

break;
case "agent_end":
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"agent_end",new cljs.core.Keyword(null,"raw","raw",1604651272),event], null);

break;
default:
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),null,new cljs.core.Keyword(null,"raw","raw",1604651272),event], null);

}
});

//# sourceMappingURL=knoxx.backend.infra.agent.stream.provider_events.js.map
