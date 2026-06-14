import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.agent.tool_lifecycle');
/**
 * Per-turn occurrence tracking for provider tool-call ids.
 */
open_hax.contract_runtime.agent.tool_lifecycle.empty_tool_call_id_state = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"counts","counts",234305892),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"active","active",1895962068),cljs.core.PersistentArrayMap.EMPTY], null);
open_hax.contract_runtime.agent.tool_lifecycle.tool_call_alias_key = (function open_hax$contract_runtime$agent$tool_lifecycle$tool_call_alias_key(tool_name,tool_call_id){
var or__5162__auto__ = (function (){var G__22308 = tool_call_id;
var G__22308__$1 = (((G__22308 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22308)));
var G__22308__$2 = (((G__22308__$1 == null))?null:clojure.string.trim(G__22308__$1));
if((G__22308__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__22308__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"tool:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto____$1 = (function (){var G__22309 = tool_name;
var G__22309__$1 = (((G__22309 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22309)));
var G__22309__$2 = (((G__22309__$1 == null))?null:clojure.string.trim(G__22309__$1));
if((G__22309__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__22309__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "tool";
}
})()));
}
});
/**
 * Uniquify a provider tool-call id at tool_execution_start.
 * 
 * Providers can reuse index-based ids across rounds (proxx/ollama emit call_0
 * for the first tool call of every round) or omit ids entirely. Receipts,
 * lifecycle events, and trace blocks keyed by the raw id then collapse onto
 * the first call. Returns {:state <next id-state> :tool-call-id <unique id>}:
 * the raw id for its first occurrence, raw#N for repeats, and tool:<name>#N
 * when the provider sent no id.
 */
open_hax.contract_runtime.agent.tool_lifecycle.resolve_tool_call_start_id = (function open_hax$contract_runtime$agent$tool_lifecycle$resolve_tool_call_start_id(id_state,p__22312){
var map__22313 = p__22312;
var map__22313__$1 = cljs.core.__destructure_map(map__22313);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22313__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var tool_call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22313__$1,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999));
var raw = (function (){var G__22315 = tool_call_id;
var G__22315__$1 = (((G__22315 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22315)));
var G__22315__$2 = (((G__22315__$1 == null))?null:clojure.string.trim(G__22315__$1));
if((G__22315__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__22315__$2);
}
})();
var alias_key = open_hax.contract_runtime.agent.tool_lifecycle.tool_call_alias_key(tool_name,tool_call_id);
var n = (cljs.core.get_in.cljs$core$IFn$_invoke$arity$3(id_state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"counts","counts",234305892),alias_key], null),(0)) + (1));
var unique_id = (cljs.core.truth_((function (){var and__5160__auto__ = raw;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(n,(1));
} else {
return and__5160__auto__;
}
})())?raw:(cljs.core.truth_(raw)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw)+"#"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)):(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias_key)+"#"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(n))
));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"state","state",-1988618099),cljs.core.assoc_in(cljs.core.assoc_in(id_state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"counts","counts",234305892),alias_key], null),n),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active","active",1895962068),alias_key], null),unique_id),new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),unique_id], null);
});
/**
 * Resolve a raw provider tool-call id (or bare tool name) to the unique id
 * registered by its most recent tool start, or nil when none started.
 */
open_hax.contract_runtime.agent.tool_lifecycle.active_tool_call_id = (function open_hax$contract_runtime$agent$tool_lifecycle$active_tool_call_id(id_state,p__22319){
var map__22320 = p__22319;
var map__22320__$1 = cljs.core.__destructure_map(map__22320);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22320__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var tool_call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22320__$1,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999));
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(id_state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active","active",1895962068),open_hax.contract_runtime.agent.tool_lifecycle.tool_call_alias_key(tool_name,tool_call_id)], null));
});
open_hax.contract_runtime.agent.tool_lifecycle.start_receipt = (function open_hax$contract_runtime$agent$tool_lifecycle$start_receipt(receipt,p__22325){
var map__22326 = p__22325;
var map__22326__$1 = cljs.core.__destructure_map(map__22326);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22326__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var input_raw = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22326__$1,new cljs.core.Keyword(null,"input-raw","input-raw",523867075));
var input_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22326__$1,new cljs.core.Keyword(null,"input-preview","input-preview",-811479635));
var at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22326__$1,new cljs.core.Keyword(null,"at","at",1476951349));
var G__22328 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([receipt,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"started_at","started_at",856896776),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"started_at","started_at",856896776).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return at;
}
})()], null)], 0));
var G__22328__$1 = (((!((input_raw == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22328,new cljs.core.Keyword(null,"input","input",556931961),input_raw):G__22328);
if(cljs.core.truth_(input_preview)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22328__$1,new cljs.core.Keyword(null,"input_preview","input_preview",2048529734),input_preview);
} else {
return G__22328__$1;
}
});
open_hax.contract_runtime.agent.tool_lifecycle.update_receipt = (function open_hax$contract_runtime$agent$tool_lifecycle$update_receipt(receipt,p__22335){
var map__22336 = p__22335;
var map__22336__$1 = cljs.core.__destructure_map(map__22336);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22336__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22336__$1,new cljs.core.Keyword(null,"preview","preview",451279890));
var append_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22336__$1,new cljs.core.Keyword(null,"append-preview","append-preview",-448270901));
var G__22338 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([receipt,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"status","status",-1997798413),"running"], null)], 0));
if(cljs.core.truth_(preview)){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__22338,new cljs.core.Keyword(null,"updates","updates",2013983452),(function (){var or__5162__auto__ = append_preview;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.conj;
}
})(),preview);
} else {
return G__22338;
}
});
open_hax.contract_runtime.agent.tool_lifecycle.end_receipt = (function open_hax$contract_runtime$agent$tool_lifecycle$end_receipt(receipt,p__22339){
var map__22340 = p__22339;
var map__22340__$1 = cljs.core.__destructure_map(map__22340);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22340__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var is_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22340__$1,new cljs.core.Keyword(null,"is-error","is-error",-127926898));
var result_raw = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22340__$1,new cljs.core.Keyword(null,"result-raw","result-raw",1572789151));
var result_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22340__$1,new cljs.core.Keyword(null,"result-preview","result-preview",-1269259984));
var content_parts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22340__$1,new cljs.core.Keyword(null,"content-parts","content-parts",684529019));
var at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22340__$1,new cljs.core.Keyword(null,"at","at",1476951349));
var G__22344 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([receipt,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"status","status",-1997798413),(cljs.core.truth_(is_error)?"failed":"completed"),new cljs.core.Keyword(null,"ended_at","ended_at",1150683059),at,new cljs.core.Keyword(null,"is_error","is_error",-700121398),cljs.core.boolean$(is_error)], null)], 0));
var G__22344__$1 = (((!((result_raw == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22344,new cljs.core.Keyword(null,"result","result",1415092211),result_raw):G__22344);
var G__22344__$2 = (cljs.core.truth_(result_preview)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22344__$1,new cljs.core.Keyword(null,"result_preview","result_preview",215554859),result_preview):G__22344__$1);
if(cljs.core.seq(content_parts)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22344__$2,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),content_parts);
} else {
return G__22344__$2;
}
});
open_hax.contract_runtime.agent.tool_lifecycle.trace_event = (function open_hax$contract_runtime$agent$tool_lifecycle$trace_event(phase,p__22346){
var map__22352 = p__22346;
var map__22352__$1 = cljs.core.__destructure_map(map__22352);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var tool_call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999));
var input_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"input-preview","input-preview",-811479635));
var preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"preview","preview",451279890));
var result_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"result-preview","result-preview",-1269259984));
var is_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"is-error","is-error",-127926898));
var at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22352__$1,new cljs.core.Keyword(null,"at","at",1476951349));
var G__22354 = phase;
var G__22354__$1 = (((G__22354 instanceof cljs.core.Keyword))?G__22354.fqn:null);
switch (G__22354__$1) {
case "start":
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"type","type",1174270348),"tool_start",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"preview","preview",451279890),input_preview,new cljs.core.Keyword(null,"at","at",1476951349),at], null);

break;
case "update":
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"type","type",1174270348),"tool_update",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"preview","preview",451279890),preview,new cljs.core.Keyword(null,"at","at",1476951349),at], null);

break;
case "end":
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"type","type",1174270348),"tool_end",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"preview","preview",451279890),result_preview,new cljs.core.Keyword(null,"is_error","is_error",-700121398),is_error,new cljs.core.Keyword(null,"at","at",1476951349),at], null);

break;
default:
throw (new Error((""+"No matching clause: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22354__$1))));

}
});
open_hax.contract_runtime.agent.tool_lifecycle.run_event_extra = (function open_hax$contract_runtime$agent$tool_lifecycle$run_event_extra(phase,p__22355){
var map__22358 = p__22355;
var map__22358__$1 = cljs.core.__destructure_map(map__22358);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var tool_call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999));
var input_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"input-preview","input-preview",-811479635));
var preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"preview","preview",451279890));
var result_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"result-preview","result-preview",-1269259984));
var is_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"is-error","is-error",-127926898));
var count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"count","count",2139924085));
var streak = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22358__$1,new cljs.core.Keyword(null,"streak","streak",1229213332));
var G__22360 = phase;
var G__22360__$1 = (((G__22360 instanceof cljs.core.Keyword))?G__22360.fqn:null);
switch (G__22360__$1) {
case "start":
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"preview","preview",451279890),input_preview], null);

break;
case "update":
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"preview","preview",451279890),preview], null);

break;
case "end":
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"status","status",-1997798413),(cljs.core.truth_(is_error)?"failed":"completed"),new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"is_error","is_error",-700121398),cljs.core.boolean$(is_error),new cljs.core.Keyword(null,"preview","preview",451279890),result_preview], null);

break;
case "death-spiral":
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"count","count",2139924085),count,new cljs.core.Keyword(null,"streak","streak",1229213332),streak], null);

break;
default:
throw (new Error((""+"No matching clause: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22360__$1))));

}
});

//# sourceMappingURL=open_hax.contract_runtime.agent.tool_lifecycle.js.map
