import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.reasoning.js";
import "./knoxx.backend.extern.agent_message.js";
goog.provide('knoxx.backend.infra.agent.message');
knoxx.backend.infra.agent.message.stored_session_message__GT_agent_message = (function knoxx$backend$infra$agent$message$stored_session_message__GT_agent_message(message){
return knoxx.backend.extern.agent_message.stored_message__GT_agent_message(message);
});
knoxx.backend.infra.agent.message.planner_row__GT_stored_session_message = (function knoxx$backend$infra$agent$message$planner_row__GT_stored_session_message(row){
var role = (function (){var G__19503 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(row);
if((G__19503 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19503));
}
})();
var text = (function (){var G__19504 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(row);
if((G__19504 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19504));
}
})();
if(((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["user",null,"assistant",null,"system",null], null), null),role)) && ((!(clojure.string.blank_QMARK_(text)))))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"content","content",15833224),text], null);
} else {
return null;
}
});
knoxx.backend.infra.agent.message.comparable_session_message = (function knoxx$backend$infra$agent$message$comparable_session_message(message){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),(function (){var G__19505 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(message);
if((G__19505 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19505));
}
})(),new cljs.core.Keyword(null,"content","content",15833224),(function (){var G__19506 = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if((G__19506 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19506));
}
})()], null);
});
knoxx.backend.infra.agent.message.merge_restored_session_messages = (function knoxx$backend$infra$agent$message$merge_restored_session_messages(base_messages,overlay_messages){
var base = cljs.core.vec((function (){var or__5162__auto__ = base_messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var overlay = cljs.core.vec((function (){var or__5162__auto__ = overlay_messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var base_STAR_ = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.message.comparable_session_message,base);
var overlay_STAR_ = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.message.comparable_session_message,overlay);
var overlap = (function (){var n = cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.count(base_STAR_),cljs.core.count(overlay_STAR_));
while(true){
if((n === (0))){
return (0);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.subvec.cljs$core$IFn$_invoke$arity$2(base_STAR_,(cljs.core.count(base_STAR_) - n)),cljs.core.subvec.cljs$core$IFn$_invoke$arity$3(overlay_STAR_,(0),n))){
return n;
} else {
var G__19694 = (n - (1));
n = G__19694;
continue;

}
}
break;
}
})();
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(base,cljs.core.subvec.cljs$core$IFn$_invoke$arity$2(overlay,overlap));
});
knoxx.backend.infra.agent.message.sync_system_message = (function knoxx$backend$infra$agent$message$sync_system_message(messages,system_prompt){
var items = cljs.core.vec((function (){var or__5162__auto__ = messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var prompt = (function (){var G__19544 = system_prompt;
var G__19544__$1 = (((G__19544 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19544)));
var G__19544__$2 = (((G__19544__$1 == null))?null:clojure.string.trim(G__19544__$1));
if((G__19544__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__19544__$2);
}
})();
if(cljs.core.not(prompt)){
return items;
} else {
var system_index = cljs.core.reduce_kv((function (_,idx,entry){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("system",(function (){var G__19554 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(entry);
var G__19554__$1 = (((G__19554 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19554)));
if((G__19554__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__19554__$1);
}
})())){
return cljs.core.reduced(idx);
} else {
return null;
}
}),null,items);
if((!((system_index == null)))){
var updated = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(items,system_index,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"system",new cljs.core.Keyword(null,"content","content",15833224),prompt], null));
return cljs.core.vec(cljs.core.keep_indexed.cljs$core$IFn$_invoke$arity$2((function (idx,entry){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("system",(function (){var G__19583 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(entry);
var G__19583__$1 = (((G__19583 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__19583)));
if((G__19583__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__19583__$1);
}
})())) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(idx,system_index)))){
return entry;
} else {
return null;
}
}),updated));
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"system",new cljs.core.Keyword(null,"content","content",15833224),prompt], null)], null),items);
}
}
});
knoxx.backend.infra.agent.message.message_text_size = (function knoxx$backend$infra$agent$message$message_text_size(message){
return ((((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"summary","summary",380847952).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()))).length) + cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._PLUS_,(0),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__19591_SHARP_){
return (((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(p1__19591_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(p1__19591_SHARP_);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(p1__19591_SHARP_);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})()))).length);
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content-parts","content-parts",684529019).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"contentParts","contentParts",1395809695).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})())));
});
knoxx.backend.infra.agent.message.stored_content_part__GT_agent_part = (function knoxx$backend$infra$agent$message$stored_content_part__GT_agent_part(part){
return knoxx.backend.extern.agent_message.content_part__GT_agent_part(part);
});
knoxx.backend.infra.agent.message.mime__GT_audio_format = (function knoxx$backend$infra$agent$message$mime__GT_audio_format(mime_type){
return knoxx.backend.extern.agent_message.mime__GT_audio_format(mime_type);
});
/**
 * Extract a leading <think>...</think> block from assistant text.
 * 
 * Some Gemma-family models emit thinking traces inline instead of as structured
 * reasoning parts. This keeps the assistant answer clean while preserving
 * the trace in :reasoning.
 */
knoxx.backend.infra.agent.message.split_think_tags = (function knoxx$backend$infra$agent$message$split_think_tags(text){
return (knoxx.backend.domain.agent.reasoning.split_think_tags.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.agent.reasoning.split_think_tags.cljs$core$IFn$_invoke$arity$1(text) : knoxx.backend.domain.agent.reasoning.split_think_tags.call(null,text));
});
knoxx.backend.infra.agent.message.content_part_type = (function knoxx$backend$infra$agent$message$content_part_type(part){
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

//# sourceMappingURL=knoxx.backend.infra.agent.message.js.map
