import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.message.js";
import "./knoxx.backend.domain.agent.content.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.shape.agent.js";
goog.provide('knoxx.backend.infra.agent.transcript');
/**
 * Exported simplified variant (no content-parts).  Used by tests and recovery.
 */
knoxx.backend.infra.agent.transcript.session__GT_stored_messages = (function knoxx$backend$infra$agent$transcript$session__GT_stored_messages(session){
var msgs = (cljs.core.truth_(session)?knoxx.backend.shape.agent.messages(session):null);
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (message){
var role = (function (){var G__28124 = (message["role"]);
if((G__28124 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28124));
}
})();
var content = (message["content"]);
var text = ((typeof content === 'string')?knoxx.backend.domain.agent.content.nonblank(content):(cljs.core.truth_(cljs.core.array_QMARK_(content))?knoxx.backend.domain.agent.content.nonblank(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n\n",cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.text.content_part_text,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(content))))):(function (){var G__28127 = (message["text"]);
if((G__28127 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__28127);
}
})()
));
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["user",null,"assistant",null,"system",null], null), null),role);
if(and__5160__auto__){
return text;
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"content","content",15833224),text], null);
} else {
return null;
}
}),msgs));
});
goog.exportSymbol('knoxx.backend.infra.agent.transcript.session__GT_stored_messages', knoxx.backend.infra.agent.transcript.session__GT_stored_messages);
/**
 * Internal richer variant that preserves assistant content-parts and compaction summaries.
 */
knoxx.backend.infra.agent.transcript.transcript_messages = (function knoxx$backend$infra$agent$transcript$transcript_messages(session){
var msgs = (cljs.core.truth_(session)?knoxx.backend.shape.agent.messages(session):null);
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (message){
var role = (function (){var G__28138 = (message["role"]);
if((G__28138 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28138));
}
})();
var summary = (function (){var G__28141 = (message["summary"]);
if((G__28141 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__28141);
}
})();
var text = (function (){var G__28142 = knoxx.backend.domain.agent.content.session_message_text(message);
if((G__28142 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__28142);
}
})();
var usage = (function (){var temp__5825__auto__ = (message["usage"]);
if(cljs.core.truth_(temp__5825__auto__)){
var raw_usage = temp__5825__auto__;
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(raw_usage,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
})();
var parts = knoxx.backend.domain.agent.content.assistant_content_parts(message);
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("compactionSummary",role);
if(and__5160__auto__){
return summary;
} else {
return and__5160__auto__;
}
})())){
var G__28144 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"summary","summary",380847952),summary,new cljs.core.Keyword(null,"content","content",15833224),summary], null);
if(typeof (message["tokensBefore"]) === 'number'){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28144,new cljs.core.Keyword(null,"tokensBefore","tokensBefore",1192561651),(message["tokensBefore"]));
} else {
return G__28144;
}
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["user",null,"assistant",null,"system",null], null), null),role);
if(and__5160__auto__){
var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.seq(parts);
}
} else {
return and__5160__auto__;
}
})())){
var G__28147 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"role","role",-736691072),role], null);
var G__28147__$1 = (cljs.core.truth_(text)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28147,new cljs.core.Keyword(null,"content","content",15833224),text):G__28147);
var G__28147__$2 = ((cljs.core.seq(parts))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28147__$1,new cljs.core.Keyword(null,"content-parts","content-parts",684529019),parts):G__28147__$1);
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("assistant",role);
if(and__5160__auto__){
return usage;
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28147__$2,new cljs.core.Keyword(null,"usage","usage",-1583752910),usage);
} else {
return G__28147__$2;
}
} else {
return null;

}
}
}),msgs));
});
knoxx.backend.infra.agent.transcript.append_message_if_novel = (function knoxx$backend$infra$agent$transcript$append_message_if_novel(messages,message){
var items = cljs.core.vec((function (){var or__5162__auto__ = messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var last_message = cljs.core.peek(items);
var comparable = (function (entry){
return cljs.core.select_keys(entry,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"content-parts","content-parts",684529019)], null));
});
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(comparable(last_message),comparable(message))){
return items;
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(items,message);
}
});
knoxx.backend.infra.agent.transcript.requested_system_prompt = (function knoxx$backend$infra$agent$transcript$requested_system_prompt(agent_spec){
var G__28165 = new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__28165__$1 = (((G__28165 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28165)));
var G__28165__$2 = (((G__28165__$1 == null))?null:clojure.string.trim(G__28165__$1));
if((G__28165__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__28165__$2);
}
});
knoxx.backend.infra.agent.transcript.ensure_system_message = (function knoxx$backend$infra$agent$transcript$ensure_system_message(messages,agent_spec){
return knoxx.backend.infra.agent.message.sync_system_message(messages,knoxx.backend.infra.agent.transcript.requested_system_prompt(agent_spec));
});
knoxx.backend.infra.agent.transcript.transcript_before_prompt = (function knoxx$backend$infra$agent$transcript$transcript_before_prompt(session,user_message,agent_spec){
return knoxx.backend.infra.agent.transcript.append_message_if_novel(knoxx.backend.infra.agent.transcript.ensure_system_message(knoxx.backend.infra.agent.transcript.transcript_messages(session),agent_spec),user_message);
});
knoxx.backend.infra.agent.transcript.transcript_after_turn = (function knoxx$backend$infra$agent$transcript$transcript_after_turn(session,fallback_messages){
var snapshot = knoxx.backend.infra.agent.transcript.transcript_messages(session);
if(cljs.core.seq(snapshot)){
return snapshot;
} else {
return cljs.core.vec(fallback_messages);
}
});

//# sourceMappingURL=knoxx.backend.infra.agent.transcript.js.map
