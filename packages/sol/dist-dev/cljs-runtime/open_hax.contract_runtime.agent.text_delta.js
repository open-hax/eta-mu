import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.agent.text_delta');
open_hax.contract_runtime.agent.text_delta.duplicate_normalized_text = (function open_hax$contract_runtime$agent$text_delta$duplicate_normalized_text(s){
return clojure.string.lower_case(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(s)),/[\s\W_]+/,""));
});
open_hax.contract_runtime.agent.text_delta.boundary_ended_QMARK_ = (function open_hax$contract_runtime$agent$text_delta$boundary_ended_QMARK_(s){
return cljs.core.boolean$(cljs.core.re_find(/[\s\W_]$/,s));
});
open_hax.contract_runtime.agent.text_delta.duplicated_prefix_QMARK_ = (function open_hax$contract_runtime$agent$text_delta$duplicated_prefix_QMARK_(previous,appended){
var or__5162__auto__ = (function (){var and__5160__auto__ = clojure.string.starts_with_QMARK_(appended,previous);
if(and__5160__auto__){
var remaining = appended.slice(cljs.core.count(previous));
return (((cljs.core.count(remaining) > (0))) && (cljs.core.boolean$(cljs.core.re_find(/^[\s\W_]/,remaining))));
} else {
return and__5160__auto__;
}
})();
if(or__5162__auto__){
return or__5162__auto__;
} else {
return ((open_hax.contract_runtime.agent.text_delta.boundary_ended_QMARK_(previous)) && (((cljs.core.seq(open_hax.contract_runtime.agent.text_delta.duplicate_normalized_text(previous))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.agent.text_delta.duplicate_normalized_text(appended),open_hax.contract_runtime.agent.text_delta.duplicate_normalized_text(previous))))));
}
});
open_hax.contract_runtime.agent.text_delta.max_overlap = (function open_hax$contract_runtime$agent$text_delta$max_overlap(left,right){
var n = cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.count(left),cljs.core.count(right));
while(true){
if((n === (0))){
return (0);
} else {
if(clojure.string.ends_with_QMARK_(left,right.slice((0),n))){
return n;
} else {
var G__22307 = (n - (1));
n = G__22307;
continue;

}
}
break;
}
});
/**
 * Return only the suffix in current that has not already appeared at the end of
 * previous. Handles provider cumulative chunks and duplicated-prefix glitches.
 */
open_hax.contract_runtime.agent.text_delta.diff_appended_text = (function open_hax$contract_runtime$agent$text_delta$diff_appended_text(previous,current){
var previous__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = previous;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var current__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = current;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(clojure.string.blank_QMARK_(current__$1)){
return "";
} else {
if(clojure.string.blank_QMARK_(previous__$1)){
return current__$1;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current__$1,previous__$1)){
return "";
} else {
if(clojure.string.starts_with_QMARK_(current__$1,previous__$1)){
var appended = current__$1.slice(((previous__$1).length));
if(open_hax.contract_runtime.agent.text_delta.duplicated_prefix_QMARK_(previous__$1,appended)){
return appended.slice(((previous__$1).length));
} else {
return appended;
}
} else {
return current__$1.slice(open_hax.contract_runtime.agent.text_delta.max_overlap(previous__$1,current__$1));

}
}
}
}
});
/**
 * Pure version of stream replay-prefix suppression.
 * 
 * Inputs:
 * - previous: cumulative text already emitted
 * - replay-offset: offset into previous when an in-progress replay is being
 *   suppressed, or nil/0 when no replay is active
 * - delta: next provider delta
 * 
 * Returns {:delta <safe delta> :replay-offset <next offset or nil>}.
 */
open_hax.contract_runtime.agent.text_delta.suppress_replayed_prefix_delta = (function open_hax$contract_runtime$agent$text_delta$suppress_replayed_prefix_delta(previous,replay_offset,delta){
var previous__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = previous;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var delta__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = delta;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var offset = cljs.core.long$((function (){var or__5162__auto__ = replay_offset;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
var delta_len = ((delta__$1).length);
var previous_len = ((previous__$1).length);
var prior_has_boundary_QMARK_ = cljs.core.boolean$(cljs.core.re_find(/[\s\W_]/,previous__$1));
var next_offset = (function (value){
if((value < previous_len)){
return value;
} else {
return null;
}
});
if(clojure.string.blank_QMARK_(delta__$1)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"delta","delta",108939957),"",new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601),(((offset > (0)))?offset:null)], null);
} else {
if((offset > (0))){
var expected = previous__$1.slice(offset,cljs.core.min.cljs$core$IFn$_invoke$arity$2(previous_len,(offset + delta_len)));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(delta__$1,expected)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"delta","delta",108939957),"",new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601),next_offset((offset + delta_len))], null);
} else {
if(clojure.string.starts_with_QMARK_(delta__$1,expected)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"delta","delta",108939957),delta__$1.slice(cljs.core.count(expected)),new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601),null], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"delta","delta",108939957),delta__$1,new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601),null], null);

}
}
} else {
if(((prior_has_boundary_QMARK_) && ((((!(cljs.core.boolean$(cljs.core.re_find(/\s$/,previous__$1))))) && (((clojure.string.starts_with_QMARK_(previous__$1,delta__$1)) && ((delta_len < previous_len)))))))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"delta","delta",108939957),"",new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601),next_offset(delta_len)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"delta","delta",108939957),delta__$1,new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601),null], null);

}
}
}
});

//# sourceMappingURL=open_hax.contract_runtime.agent.text_delta.js.map
