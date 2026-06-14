import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.row_extra.js";
import "./knoxx.backend.extern.proxx.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.infra.stores.mongo_session_titles.js";
import "./knoxx.backend.domain.time.js";
import "./knoxx.backend.domain.text.js";
goog.provide('knoxx.backend.infra.stores.session_titles');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles.session_titles_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.session_titles.session_titles_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles.session_title_generation_tail_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.session_titles.session_title_generation_tail_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(Promise.resolve(null));
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles !== 'undefined') && (typeof knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"active","active",1895962068),false,new cljs.core.Keyword(null,"processed","processed",800622264),(0),new cljs.core.Keyword(null,"total","total",1916810418),(0),new cljs.core.Keyword(null,"failed","failed",-1397425762),(0),new cljs.core.Keyword(null,"force","force",781957286),false,new cljs.core.Keyword(null,"started_at","started_at",856896776),null,new cljs.core.Keyword(null,"completed_at","completed_at",1756837256),null,new cljs.core.Keyword(null,"last_error","last_error",153231245),null], null));
}
knoxx.backend.infra.stores.session_titles.SESSION_TITLE_TTL_SECONDS = ((((60) * (60)) * (24)) * (7));
knoxx.backend.infra.stores.session_titles.SESSION_TITLES_CACHE_MAX = (512);
knoxx.backend.infra.stores.session_titles.session_title_key = (function knoxx$backend$infra$stores$session_titles$session_title_key(session_id){
return (""+"knoxx:session-title:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id));
});
knoxx.backend.infra.stores.session_titles.resolved = (function knoxx$backend$infra$stores$session_titles$resolved(value){
return Promise.resolve(value);
});
knoxx.backend.infra.stores.session_titles.run_queued_session_title_task_BANG_ = (async function knoxx$backend$infra$stores$session_titles$run_queued_session_title_task_BANG_(tail,task_fn){
try{(await tail);
}catch (e28308){var __28747 = e28308;
}
return (await (task_fn.cljs$core$IFn$_invoke$arity$0 ? task_fn.cljs$core$IFn$_invoke$arity$0() : task_fn.call(null)));
});
knoxx.backend.infra.stores.session_titles.recover_session_title_tail_BANG_ = (async function knoxx$backend$infra$stores$session_titles$recover_session_title_tail_BANG_(task){
try{return (await task);
}catch (e28310){var _ = e28310;
return null;
}});
/**
 * Serialize Proxx-backed title generation so cache misses cannot fan out into
 * a provider request storm. The returned promise preserves the task result;
 * the queue tail always recovers so one failed naming request does not stall
 * later titles.
 */
knoxx.backend.infra.stores.session_titles.enqueue_session_title_generation_BANG_ = (function knoxx$backend$infra$stores$session_titles$enqueue_session_title_generation_BANG_(task_fn){
var task = knoxx.backend.infra.stores.session_titles.run_queued_session_title_task_BANG_(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_generation_tail_STAR_),task_fn);
cljs.core.reset_BANG_(knoxx.backend.infra.stores.session_titles.session_title_generation_tail_STAR_,knoxx.backend.infra.stores.session_titles.recover_session_title_tail_BANG_(task));

return task;
});
knoxx.backend.infra.stores.session_titles.sanitize_session_title = (function knoxx$backend$infra$stores$session_titles$sanitize_session_title(value){
var text = clojure.string.trim(clojure.string.replace(clojure.string.trim(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\s+/," ")),/^[`'\"“”‘’]+|[`'\"“”‘’]+$/,""));
var lowered = clojure.string.lower_case(text);
var text__$1 = ((clojure.string.starts_with_QMARK_(lowered,"title: "))?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(text,(7)):((clojure.string.starts_with_QMARK_(lowered,"title-"))?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(text,(6)):((clojure.string.starts_with_QMARK_(lowered,"title:"))?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(text,(6)):text
)));
var text__$2 = clojure.string.trim(text__$1);
if(clojure.string.blank_QMARK_(text__$2)){
return null;
} else {
return cljs.core.subs.cljs$core$IFn$_invoke$arity$3(text__$2,(0),cljs.core.min.cljs$core$IFn$_invoke$arity$2((160),((text__$2).length)));
}
});
knoxx.backend.infra.stores.session_titles.heuristic_session_title = (function knoxx$backend$infra$stores$session_titles$heuristic_session_title(seed_text){
var words = clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28319_SHARP_){
return clojure.string.replace(p1__28319_SHARP_,/^[#>*\-\d.\s]+/,"");
}),cljs.core.take.cljs$core$IFn$_invoke$arity$2((2),cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,clojure.string.split_lines((function (){var or__5162__auto__ = seed_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))))));
var cleaned = (function (){var G__28336 = words;
var G__28336__$1 = (((G__28336 == null))?null:clojure.string.lower_case(G__28336));
if((G__28336__$1 == null)){
return null;
} else {
return knoxx.backend.infra.stores.session_titles.sanitize_session_title(G__28336__$1);
}
})();
var or__5162__auto__ = cleaned;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Untitled session";
}
});
knoxx.backend.infra.stores.session_titles.acceptable_session_title_QMARK_ = (function knoxx$backend$infra$stores$session_titles$acceptable_session_title_QMARK_(value){
var title = knoxx.backend.infra.stores.session_titles.sanitize_session_title(value);
var lowered = (function (){var G__28350 = title;
if((G__28350 == null)){
return null;
} else {
return clojure.string.lower_case(G__28350);
}
})();
return cljs.core.boolean$((function (){var and__5160__auto__ = title;
if(cljs.core.truth_(and__5160__auto__)){
return (((cljs.core.count(title) >= (4))) && ((!(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 7, ["res",null,"untitled",null,"chat",null,"untitled session",null,"title",null,"session",null,"new chat",null], null), null),lowered)))));
} else {
return and__5160__auto__;
}
})());
});
knoxx.backend.infra.stores.session_titles.normalize_session_title = (function knoxx$backend$infra$stores$session_titles$normalize_session_title(var_args){
var G__28365 = arguments.length;
switch (G__28365) {
case 1:
return knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1 = (function (value){
return knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$2(value,null);
}));

(knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$2 = (function (value,fallback){
var title = knoxx.backend.infra.stores.session_titles.sanitize_session_title(value);
var fallback_title = knoxx.backend.infra.stores.session_titles.sanitize_session_title(fallback);
if(knoxx.backend.infra.stores.session_titles.acceptable_session_title_QMARK_(title)){
return title;
} else {
if(knoxx.backend.infra.stores.session_titles.acceptable_session_title_QMARK_(fallback_title)){
return fallback_title;
} else {
return null;

}
}
}));

(knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$lang$maxFixedArity = 2);

knoxx.backend.infra.stores.session_titles.session_title_seed_text = (function knoxx$backend$infra$stores$session_titles$session_title_seed_text(rows){
var user_texts = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28368_SHARP_){
return clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(p1__28368_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__28367_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("user",new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__28367_SHARP_));
}),(function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
var substantive = cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (text){
return (((cljs.core.count(text) >= (12))) || ((cljs.core.count(clojure.string.split.cljs$core$IFn$_invoke$arity$2(text,/\s+/)) >= (3))));
}),user_texts));
var combined = (function (){var G__28379 = user_texts;
var G__28379__$1 = (((G__28379 == null))?null:cljs.core.take.cljs$core$IFn$_invoke$arity$2((3),G__28379));
var G__28379__$2 = (((G__28379__$1 == null))?null:clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",G__28379__$1));
var G__28379__$3 = (((G__28379__$2 == null))?null:clojure.string.trim(G__28379__$2));
if((G__28379__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__28379__$3);
}
})();
var fallback = cljs.core.first(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28369_SHARP_){
return clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(p1__28369_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
}),(function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
var or__5162__auto__ = substantive;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = combined;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = fallback;
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
});
knoxx.backend.infra.stores.session_titles.title_from_reasoning_content = (function knoxx$backend$infra$stores$session_titles$title_from_reasoning_content(value){
var text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var or__5162__auto__ = (function (){var G__28397 = cljs.core.re_find(/(?:i(?:'|’)ll|i will) go with\s+[\"“]([^\"”]{4,80})[\"”]/i,text);
var G__28397__$1 = (((G__28397 == null))?null:cljs.core.second(G__28397));
if((G__28397__$1 == null)){
return null;
} else {
return knoxx.backend.infra.stores.session_titles.sanitize_session_title(G__28397__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__28398 = cljs.core.re_seq(/[\"“]([^\"”]{4,80})[\"”]/,text);
var G__28398__$1 = (((G__28398 == null))?null:cljs.core.last(G__28398));
var G__28398__$2 = (((G__28398__$1 == null))?null:cljs.core.second(G__28398__$1));
if((G__28398__$2 == null)){
return null;
} else {
return knoxx.backend.infra.stores.session_titles.sanitize_session_title(G__28398__$2);
}
}
});
knoxx.backend.infra.stores.session_titles.parse_json_object = (function knoxx$backend$infra$stores$session_titles$parse_json_object(value){
return knoxx.backend.extern.row_extra.parse_session_title_extra(value);
});
knoxx.backend.infra.stores.session_titles.session_title_row_entry = (function knoxx$backend$infra$stores$session_titles$session_title_row_entry(row){
var extra = (function (){var or__5162__auto__ = knoxx.backend.extern.row_extra.parse_session_title_extra(new cljs.core.Keyword(null,"extra","extra",1612569067).cljs$core$IFn$_invoke$arity$1(row));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var kind = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"event_kind","event_kind",1009075217).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(extra,new cljs.core.Keyword(null,"kind","kind",-717265803));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(extra,new cljs.core.Keyword(null,"event_kind","event_kind",1009075217));
}
}
}
})();
var raw_title = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(extra,new cljs.core.Keyword(null,"title","title",636505583));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"knoxx.session_title")){
return new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(row);
} else {
return null;
}
}
}
})();
var title = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1(raw_title);
var title_model = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(extra,new cljs.core.Keyword(null,"title_model","title_model",501758950));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(extra,new cljs.core.Keyword(null,"titleModel","titleModel",-2089428163));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"titleModel","titleModel",-2089428163).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(row);
}
}
}
}
})();
var updated_at = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"ts","ts",1617209904).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.time.now_iso();
}
}
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"knoxx.session_title");
if(and__5160__auto__){
return title;
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"title","title",636505583),title,new cljs.core.Keyword(null,"title_model","title_model",501758950),title_model,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),updated_at], null);
} else {
return null;
}
});
knoxx.backend.infra.stores.session_titles.stored_session_title_entry = (function knoxx$backend$infra$stores$session_titles$stored_session_title_entry(session_id,rows){
var temp__5825__auto__ = (function (){var G__28430 = (function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var G__28430__$1 = (((G__28430 == null))?null:cljs.core.reverse(G__28430));
var G__28430__$2 = (((G__28430__$1 == null))?null:cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.session_titles.session_title_row_entry,G__28430__$1));
if((G__28430__$2 == null)){
return null;
} else {
return cljs.core.first(G__28430__$2);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var entry = temp__5825__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(entry,new cljs.core.Keyword(null,"session","session",1008279103),session_id);
} else {
return null;
}
});
/**
 * When session-titles* exceeds SESSION_TITLES_CACHE_MAX, evict oldest entries.
 */
knoxx.backend.infra.stores.session_titles.evict_stale_titles_BANG_ = (function knoxx$backend$infra$stores$session_titles$evict_stale_titles_BANG_(){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.session_titles.session_titles_STAR_,(function (titles){
if((cljs.core.count(titles) <= knoxx.backend.infra.stores.session_titles.SESSION_TITLES_CACHE_MAX)){
return titles;
} else {
var sorted = cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p__28451){
var vec__28456 = p__28451;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28456,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28456,(1),null);
var or__5162__auto__ = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
}),titles);
var drop_n = (cljs.core.count(sorted) - knoxx.backend.infra.stores.session_titles.SESSION_TITLES_CACHE_MAX);
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.drop.cljs$core$IFn$_invoke$arity$2(drop_n,sorted));
}
}));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_,(function (promises){
if((cljs.core.count(promises) <= knoxx.backend.infra.stores.session_titles.SESSION_TITLES_CACHE_MAX)){
return promises;
} else {
var known = cljs.core.set(cljs.core.keys(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_)));
return cljs.core.select_keys(promises,known);
}
}));
});
knoxx.backend.infra.stores.session_titles.persist_cached_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$persist_cached_session_title_BANG_(session_id,entry){
try{return (await knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,entry));
}catch (e28484){var err = e28484;
console.warn("Failed to persist session title cache into Mongo",err);

return null;
}});
knoxx.backend.infra.stores.session_titles.clear_cached_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$clear_cached_session_title_BANG_(session_id){
try{return (await knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$core$IFn$_invoke$arity$1(session_id));
}catch (e28496){var err = e28496;
console.warn("Failed to clear session title cache from Mongo",err);

return null;
}});
knoxx.backend.infra.stores.session_titles.cache_session_title_entry_BANG_ = (function knoxx$backend$infra$stores$session_titles$cache_session_title_entry_BANG_(session_id,title,title_model,updated_at){
var resolved = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"title","title",636505583),(function (){var or__5162__auto__ = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1(title);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Untitled session";
}
})(),new cljs.core.Keyword(null,"title_model","title_model",501758950),title_model,new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),(function (){var or__5162__auto__ = updated_at;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.time.now_iso();
}
})()], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_titles.session_titles_STAR_,cljs.core.assoc,session_id,resolved);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_,cljs.core.dissoc,session_id);

knoxx.backend.infra.stores.session_titles.evict_stale_titles_BANG_();

knoxx.backend.infra.stores.session_titles.persist_cached_session_title_BANG_(session_id,resolved);

return resolved;
});
knoxx.backend.infra.stores.session_titles.clear_session_title_entry_BANG_ = (function knoxx$backend$infra$stores$session_titles$clear_session_title_entry_BANG_(session_id){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.session_titles.session_titles_STAR_,cljs.core.dissoc,session_id);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_,cljs.core.dissoc,session_id);

knoxx.backend.infra.stores.session_titles.clear_cached_session_title_BANG_(session_id);

return null;
});
knoxx.backend.infra.stores.session_titles.get_cached_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$get_cached_session_title_BANG_(session_id){
var session_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(session_id__$1)){
return null;
} else {
if(cljs.core.contains_QMARK_(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_),session_id__$1)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_),session_id__$1);
} else {
var entry = (await knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$core$IFn$_invoke$arity$1(session_id__$1));
if(cljs.core.truth_(entry)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_titles.session_titles_STAR_,cljs.core.assoc,session_id__$1,entry);
} else {
}

return entry;

}
}
});
knoxx.backend.infra.stores.session_titles.session_title_event = (function knoxx$backend$infra$stores$session_titles$session_title_event(config,session_id,title,title_model){
var event_id = (""+"knoxx:session-title:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id));
var ts = knoxx.backend.domain.time.now_iso();
var normalized_title = (function (){var or__5162__auto__ = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1(title);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Untitled session";
}
})();
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"meta","meta",1499536964),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"source_ref","source_ref",-1854699662),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"text","text",-1790561697)],["openplanner.event.v1",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"role","role",-736691072),"system",new cljs.core.Keyword(null,"author","author",2111686192),"knoxx",new cljs.core.Keyword(null,"model","model",331153215),title_model,new cljs.core.Keyword(null,"tags","tags",1771418977),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["knoxx","session_title","metadata"], null)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"kind","kind",-717265803),"knoxx.session_title",new cljs.core.Keyword(null,"title","title",636505583),normalized_title,new cljs.core.Keyword(null,"title_model","title_model",501758950),title_model,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id], null),"knoxx",ts,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"message","message",-406056002),event_id], null),event_id,"knoxx.session_title",normalized_title]);
});
knoxx.backend.infra.stores.session_titles.persist_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$persist_session_title_BANG_(config,session_id,title,title_model){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
if(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)))) || (cljs.core.not(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))))){
return null;
} else {
try{return (await knoxx.backend.infra.clients.openplanner.events_BANG_(client,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.stores.session_titles.session_title_event(config,session_id,title,title_model)], null)));
}catch (e28527){var err = e28527;
console.warn("Failed to persist session title into OpenPlanner",err);

return null;
}}
});
knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_ = (function knoxx$backend$infra$stores$session_titles$cache_session_title_BANG_(_runtime,_config,session_id,title,title_model){
var session_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var resolved = knoxx.backend.infra.stores.session_titles.cache_session_title_entry_BANG_(session_id__$1,title,title_model,null);
return resolved;
});
knoxx.backend.infra.stores.session_titles.preload_session_title_entry_BANG_ = (async function knoxx$backend$infra$stores$session_titles$preload_session_title_entry_BANG_(config,session_id){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
try{var body = (await knoxx.backend.infra.clients.openplanner.session_BANG_(client,session_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config)], null)));
var temp__5825__auto__ = knoxx.backend.infra.stores.session_titles.stored_session_title_entry(session_id,new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body));
if(cljs.core.truth_(temp__5825__auto__)){
var entry = temp__5825__auto__;
return knoxx.backend.infra.stores.session_titles.cache_session_title_entry_BANG_(session_id,new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(entry));
} else {
return null;
}
}catch (e28531){var _ = e28531;
return null;
}});
knoxx.backend.infra.stores.session_titles.load_session_titles_BANG_ = (async function knoxx$backend$infra$stores$session_titles$load_session_titles_BANG_(_runtime,config){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.not(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))){
return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_);
} else {
try{var body = (await knoxx.backend.infra.clients.openplanner.sessions_BANG_(client,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config)], null)));
var session_ids = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2((64),cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session","session",1008279103),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())))))));
if(cljs.core.seq(session_ids)){
(await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__28536_SHARP_){
return knoxx.backend.infra.stores.session_titles.preload_session_title_entry_BANG_(config,p1__28536_SHARP_);
}),session_ids))));
} else {
}

return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_);
}catch (e28541){var err = e28541;
console.warn("Failed to preload session titles from OpenPlanner",err);

return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_);
}}
});
knoxx.backend.infra.stores.session_titles.resolve_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$resolve_session_title_BANG_(config,seed_text){
var fallback = knoxx.backend.infra.stores.session_titles.heuristic_session_title(seed_text);
try{var entry = (await knoxx.backend.infra.stores.session_titles.enqueue_session_title_generation_BANG_((function (){
return (knoxx.backend.infra.stores.session_titles.generate_session_title_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.stores.session_titles.generate_session_title_BANG_.cljs$core$IFn$_invoke$arity$2(config,seed_text) : knoxx.backend.infra.stores.session_titles.generate_session_title_BANG_.call(null,config,seed_text));
})));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),(await (async function (){var or__5162__auto__ = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),fallback);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback;
}
})()),new cljs.core.Keyword(null,"title_model","title_model",501758950),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry)], null);
}catch (e28551){var _ = e28551;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),fallback,new cljs.core.Keyword(null,"title_model","title_model",501758950),null], null);
}});
knoxx.backend.infra.stores.session_titles.session_title_model = (function knoxx$backend$infra$stores$session_titles$session_title_model(config){
var or__5162__auto__ = (function (){var G__28560 = new cljs.core.Keyword(null,"session-title-model","session-title-model",-144758404).cljs$core$IFn$_invoke$arity$1(config);
var G__28560__$1 = (((G__28560 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28560)));
var G__28560__$2 = (((G__28560__$1 == null))?null:clojure.string.trim(G__28560__$1));
if((G__28560__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__28560__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__28565 = new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764).cljs$core$IFn$_invoke$arity$1(config);
var G__28565__$1 = (((G__28565 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28565)));
var G__28565__$2 = (((G__28565__$1 == null))?null:clojure.string.trim(G__28565__$1));
if((G__28565__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__28565__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "glm-5";
}
}
});
knoxx.backend.infra.stores.session_titles.session_title_request = (function knoxx$backend$infra$stores$session_titles$session_title_request(config,seed_text){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"model","model",331153215),knoxx.backend.infra.stores.session_titles.session_title_model(config),new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"system",new cljs.core.Keyword(null,"content","content",15833224),"You create very short, useful session titles. Return only the title text, 2 to 6 words, with no quotes, no markdown, and no explanation."], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"user",new cljs.core.Keyword(null,"content","content",15833224),(""+"Create a concise title for this Knoxx session based on the opening request.\n\nRequest:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.domain.text.value__GT_preview_text.cljs$core$IFn$_invoke$arity$2(seed_text,(900));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))], null)], null),new cljs.core.Keyword(null,"temperature","temperature",899018429),0.1,new cljs.core.Keyword(null,"max_tokens","max_tokens",319809413),(24),new cljs.core.Keyword(null,"stream","stream",1534941648),false], null);
});
knoxx.backend.infra.stores.session_titles.completion__GT_session_title = (function knoxx$backend$infra$stores$session_titles$completion__GT_session_title(p__28572,fallback,fallback_model){
var map__28573 = p__28572;
var map__28573__$1 = cljs.core.__destructure_map(map__28573);
var ok_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28573__$1,new cljs.core.Keyword(null,"ok?","ok?",447310304));
var model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28573__$1,new cljs.core.Keyword(null,"model","model",331153215));
var content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28573__$1,new cljs.core.Keyword(null,"content","content",15833224));
var reasoning_content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28573__$1,new cljs.core.Keyword(null,"reasoning-content","reasoning-content",-1591934153));
if(cljs.core.truth_(ok_QMARK_)){
var title_candidate = (function (){var or__5162__auto__ = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1(content);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.stores.session_titles.title_from_reasoning_content(reasoning_content);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return fallback;
}
}
})();
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),(function (){var or__5162__auto__ = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$2(title_candidate,fallback);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback;
}
})(),new cljs.core.Keyword(null,"title_model","title_model",501758950),(function (){var or__5162__auto__ = model;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback_model;
}
})()], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),fallback,new cljs.core.Keyword(null,"title_model","title_model",501758950),null], null);
}
});
knoxx.backend.infra.stores.session_titles.generate_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$generate_session_title_BANG_(config,seed_text){
var fallback = knoxx.backend.infra.stores.session_titles.heuristic_session_title(seed_text);
if(((clojure.string.blank_QMARK_(seed_text)) || (((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config))) || (clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))))))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),fallback,new cljs.core.Keyword(null,"title_model","title_model",501758950),null], null);
} else {
try{return knoxx.backend.infra.stores.session_titles.completion__GT_session_title((await knoxx.backend.extern.proxx.chat_completion_BANG_(config,knoxx.backend.infra.stores.session_titles.session_title_request(config,seed_text))),fallback,knoxx.backend.infra.stores.session_titles.session_title_model(config));
}catch (e28583){var _ = e28583;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),fallback,new cljs.core.Keyword(null,"title_model","title_model",501758950),null], null);
}}
});
knoxx.backend.infra.stores.session_titles.resolve_session_title_from_rows_BANG_ = (async function knoxx$backend$infra$stores$session_titles$resolve_session_title_from_rows_BANG_(config,session_id,rows){
var temp__5823__auto__ = knoxx.backend.infra.stores.session_titles.stored_session_title_entry(session_id,rows);
if(cljs.core.truth_(temp__5823__auto__)){
var stored = temp__5823__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(stored,new cljs.core.Keyword(null,"stored","stored",-892842620),true);
} else {
var seed_text = knoxx.backend.infra.stores.session_titles.session_title_seed_text(cljs.core.vec((await (async function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
var entry = (await knoxx.backend.infra.stores.session_titles.resolve_session_title_BANG_(config,seed_text));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"title_model","title_model",501758950),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"stored","stored",-892842620),false], null);
}
});
knoxx.backend.infra.stores.session_titles.cache_resolved_session_title_BANG_ = (function knoxx$backend$infra$stores$session_titles$cache_resolved_session_title_BANG_(runtime,config,session_id,entry){
if(cljs.core.truth_(new cljs.core.Keyword(null,"stored","stored",-892842620).cljs$core$IFn$_invoke$arity$1(entry))){
return knoxx.backend.infra.stores.session_titles.cache_session_title_entry_BANG_(session_id,new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(entry));
} else {
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry));
}
});
knoxx.backend.infra.stores.session_titles.compute_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$compute_session_title_BANG_(runtime,config,session_id,rows,fetch_session_rows_BANG_){
var temp__5823__auto__ = (await knoxx.backend.infra.stores.session_titles.get_cached_session_title_BANG_(session_id));
if(cljs.core.truth_(temp__5823__auto__)){
var cached = temp__5823__auto__;
return cached;
} else {
try{var resolved_rows = ((cljs.core.seq(rows))?rows:(await (fetch_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2 ? fetch_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2(config,session_id) : fetch_session_rows_BANG_.call(null,config,session_id))));
var entry = (await knoxx.backend.infra.stores.session_titles.resolve_session_title_from_rows_BANG_(config,session_id,resolved_rows));
return knoxx.backend.infra.stores.session_titles.cache_resolved_session_title_BANG_(runtime,config,session_id,entry);
}catch (e28610){var _ = e28610;
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,"Untitled session",null);
}}
});
knoxx.backend.infra.stores.session_titles.ensure_session_title_BANG_ = (function knoxx$backend$infra$stores$session_titles$ensure_session_title_BANG_(runtime,config,session_id,rows,force_QMARK_,fetch_session_rows_BANG_){
var session_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(cljs.core.truth_(force_QMARK_)){
knoxx.backend.infra.stores.session_titles.clear_session_title_entry_BANG_(session_id__$1);
} else {
}

if(clojure.string.blank_QMARK_(session_id__$1)){
return knoxx.backend.infra.stores.session_titles.resolved(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"title","title",636505583),"Untitled session",new cljs.core.Keyword(null,"title_model","title_model",501758950),null], null));
} else {
if(cljs.core.contains_QMARK_(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_),session_id__$1)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_),session_id__$1);
} else {
var title_promise = knoxx.backend.infra.stores.session_titles.compute_session_title_BANG_(runtime,config,session_id__$1,rows,fetch_session_rows_BANG_);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_,cljs.core.assoc,session_id__$1,title_promise);

return title_promise;

}
}
});
knoxx.backend.infra.stores.session_titles.prime_session_title_BANG_ = (async function knoxx$backend$infra$stores$session_titles$prime_session_title_BANG_(runtime,config,session_id,seed_text){
var temp__5823__auto__ = (await knoxx.backend.infra.stores.session_titles.get_cached_session_title_BANG_(session_id));
if(cljs.core.truth_(temp__5823__auto__)){
var cached = temp__5823__auto__;
return cached;
} else {
try{var entry = (await knoxx.backend.infra.stores.session_titles.resolve_session_title_BANG_(config,seed_text));
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry));
}catch (e28634){var _ = e28634;
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,knoxx.backend.infra.stores.session_titles.heuristic_session_title(seed_text),null);
}}
});
knoxx.backend.infra.stores.session_titles.maybe_prime_session_title_BANG_ = (function knoxx$backend$infra$stores$session_titles$maybe_prime_session_title_BANG_(runtime,config,session_id,seed_text){
var session_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var seed_text__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = seed_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if((((!(clojure.string.blank_QMARK_(session_id__$1)))) && ((((!(clojure.string.blank_QMARK_(seed_text__$1)))) && ((!(cljs.core.contains_QMARK_(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_),session_id__$1)))))))){
var title_promise = knoxx.backend.infra.stores.session_titles.prime_session_title_BANG_(runtime,config,session_id__$1,seed_text__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_,cljs.core.assoc,session_id__$1,title_promise);

return title_promise;
} else {
return null;
}
});
knoxx.backend.infra.stores.session_titles.session_ids_from_response = (function knoxx$backend$infra$stores$session_titles$session_ids_from_response(body,limit){
var G__28674 = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session","session",1008279103),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
if(cljs.core.truth_(limit)){
return cljs.core.take.cljs$core$IFn$_invoke$arity$2(limit,G__28674);
} else {
return G__28674;
}
});
knoxx.backend.infra.stores.session_titles.init_backfill_state_BANG_ = (function knoxx$backend$infra$stores$session_titles$init_backfill_state_BANG_(session_ids,force){
return cljs.core.reset_BANG_(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_,new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"active","active",1895962068),true,new cljs.core.Keyword(null,"processed","processed",800622264),(0),new cljs.core.Keyword(null,"total","total",1916810418),cljs.core.count(session_ids),new cljs.core.Keyword(null,"failed","failed",-1397425762),(0),new cljs.core.Keyword(null,"force","force",781957286),cljs.core.boolean$(force),new cljs.core.Keyword(null,"started_at","started_at",856896776),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"completed_at","completed_at",1756837256),null,new cljs.core.Keyword(null,"last_error","last_error",153231245),null], null));
});
knoxx.backend.infra.stores.session_titles.complete_backfill_BANG_ = (function knoxx$backend$infra$stores$session_titles$complete_backfill_BANG_(){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"active","active",1895962068),false,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"completed_at","completed_at",1756837256),knoxx.backend.domain.time.now_iso()], 0));

return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_);
});
knoxx.backend.infra.stores.session_titles.record_backfill_error_BANG_ = (function knoxx$backend$infra$stores$session_titles$record_backfill_error_BANG_(err){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_,(function (state){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$3(state,new cljs.core.Keyword(null,"processed","processed",800622264),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.inc,(0))),new cljs.core.Keyword(null,"failed","failed",-1397425762),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.inc,(0))),new cljs.core.Keyword(null,"last_error","last_error",153231245),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)));
}));
});
knoxx.backend.infra.stores.session_titles.backfill_one_session_BANG_ = (async function knoxx$backend$infra$stores$session_titles$backfill_one_session_BANG_(runtime,config,fetch_session_rows_BANG_,force,session_id){
if(cljs.core.truth_(force)){
knoxx.backend.infra.stores.session_titles.clear_session_title_entry_BANG_(session_id);
} else {
}

try{var title_rows_28843 = (await (fetch_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2 ? fetch_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2(config,session_id) : fetch_session_rows_BANG_.call(null,config,session_id)));
var entry_28844 = (await knoxx.backend.infra.stores.session_titles.resolve_session_title_from_rows_BANG_(config,session_id,title_rows_28843));
knoxx.backend.infra.stores.session_titles.cache_resolved_session_title_BANG_(runtime,config,session_id,entry_28844);
}catch (e28691){var __28845 = e28691;
knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,"Untitled session",null);
}
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_,cljs.core.update,new cljs.core.Keyword(null,"processed","processed",800622264),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.inc,(0)));
});
knoxx.backend.infra.stores.session_titles.fail_backfill_BANG_ = (function knoxx$backend$infra$stores$session_titles$fail_backfill_BANG_(err){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"active","active",1895962068),false,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"completed_at","completed_at",1756837256),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"last_error","last_error",153231245),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], 0));

return null;
});
knoxx.backend.infra.stores.session_titles.run_session_title_backfill_BANG_ = (async function knoxx$backend$infra$stores$session_titles$run_session_title_backfill_BANG_(runtime,config,session_ids,force,fetch_session_rows_BANG_){
try{var seq__28701_28846 = cljs.core.seq(session_ids);
var chunk__28702_28847 = null;
var count__28703_28848 = (0);
var i__28704_28849 = (0);
while(true){
if((i__28704_28849 < count__28703_28848)){
var session_id_28850 = chunk__28702_28847.cljs$core$IIndexed$_nth$arity$2(null,i__28704_28849);
try{(await knoxx.backend.infra.stores.session_titles.backfill_one_session_BANG_(runtime,config,fetch_session_rows_BANG_,force,session_id_28850));
}catch (e28709){var err_28851 = e28709;
knoxx.backend.infra.stores.session_titles.record_backfill_error_BANG_(err_28851);
}

var G__28852 = seq__28701_28846;
var G__28853 = chunk__28702_28847;
var G__28854 = count__28703_28848;
var G__28855 = (i__28704_28849 + (1));
seq__28701_28846 = G__28852;
chunk__28702_28847 = G__28853;
count__28703_28848 = G__28854;
i__28704_28849 = G__28855;
continue;
} else {
var temp__5825__auto___28856 = cljs.core.seq(seq__28701_28846);
if(temp__5825__auto___28856){
var seq__28701_28857__$1 = temp__5825__auto___28856;
if(cljs.core.chunked_seq_QMARK_(seq__28701_28857__$1)){
var c__5694__auto___28858 = cljs.core.chunk_first(seq__28701_28857__$1);
var G__28859 = cljs.core.chunk_rest(seq__28701_28857__$1);
var G__28860 = c__5694__auto___28858;
var G__28861 = cljs.core.count(c__5694__auto___28858);
var G__28862 = (0);
seq__28701_28846 = G__28859;
chunk__28702_28847 = G__28860;
count__28703_28848 = G__28861;
i__28704_28849 = G__28862;
continue;
} else {
var session_id_28863 = cljs.core.first(seq__28701_28857__$1);
try{(await knoxx.backend.infra.stores.session_titles.backfill_one_session_BANG_(runtime,config,fetch_session_rows_BANG_,force,session_id_28863));
}catch (e28710){var err_28864 = e28710;
knoxx.backend.infra.stores.session_titles.record_backfill_error_BANG_(err_28864);
}

var G__28866 = cljs.core.next(seq__28701_28857__$1);
var G__28867 = null;
var G__28868 = (0);
var G__28869 = (0);
seq__28701_28846 = G__28866;
chunk__28702_28847 = G__28867;
count__28703_28848 = G__28868;
i__28704_28849 = G__28869;
continue;
}
} else {
}
}
break;
}

return knoxx.backend.infra.stores.session_titles.complete_backfill_BANG_();
}catch (e28700){var err = e28700;
return knoxx.backend.infra.stores.session_titles.fail_backfill_BANG_(err);
}});
knoxx.backend.infra.stores.session_titles.start_session_title_backfill_BANG_ = (async function knoxx$backend$infra$stores$session_titles$start_session_title_backfill_BANG_(runtime,config,p__28718,fetch_session_rows_BANG_){
var map__28719 = p__28718;
var map__28719__$1 = cljs.core.__destructure_map(map__28719);
var force = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28719__$1,new cljs.core.Keyword(null,"force","force",781957286));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28719__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
if(cljs.core.truth_(new cljs.core.Keyword(null,"active","active",1895962068).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_)))){
return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_);
} else {
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
try{var body = (await knoxx.backend.infra.clients.openplanner.sessions_BANG_(client,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config)], null)));
var session_ids = cljs.core.vec(knoxx.backend.infra.stores.session_titles.session_ids_from_response(body,limit));
knoxx.backend.infra.stores.session_titles.init_backfill_state_BANG_(session_ids,force);

if(cljs.core.empty_QMARK_(session_ids)){
return knoxx.backend.infra.stores.session_titles.complete_backfill_BANG_();
} else {
knoxx.backend.infra.stores.session_titles.run_session_title_backfill_BANG_(runtime,config,session_ids,force,fetch_session_rows_BANG_);

return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_);
}
}catch (e28724){var err = e28724;
knoxx.backend.infra.stores.session_titles.fail_backfill_BANG_(err);

return cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_);
}}
});

//# sourceMappingURL=knoxx.backend.infra.stores.session_titles.js.map
