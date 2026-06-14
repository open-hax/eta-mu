import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.agent.reasoning');
open_hax.contract_runtime.agent.reasoning.think_open = "<think>";
open_hax.contract_runtime.agent.reasoning.think_close = "</think>";
/**
 * Extract a leading <think>...</think> block from assistant text.
 */
open_hax.contract_runtime.agent.reasoning.split_think_tags = (function open_hax$contract_runtime$agent$reasoning$split_think_tags(text){
var text__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var open_idx = text__$1.indexOf(open_hax.contract_runtime.agent.reasoning.think_open);
var close_idx = text__$1.indexOf(open_hax.contract_runtime.agent.reasoning.think_close);
if((((open_idx >= (0))) && ((((close_idx >= (0))) && ((((open_idx < (64))) && ((close_idx > open_idx)))))))){
var thinking = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(text__$1,(open_idx + ((open_hax.contract_runtime.agent.reasoning.think_open).length)),close_idx);
var after = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(text__$1,(close_idx + ((open_hax.contract_runtime.agent.reasoning.think_close).length)));
var before = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(text__$1,(0),open_idx);
var answer = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = before;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = after;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),clojure.string.trim(thinking),new cljs.core.Keyword(null,"answer","answer",-742633163),clojure.string.trim(answer),new cljs.core.Keyword(null,"hadThinkTags","hadThinkTags",-1568024818),true], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),"",new cljs.core.Keyword(null,"answer","answer",-742633163),text__$1,new cljs.core.Keyword(null,"hadThinkTags","hadThinkTags",-1568024818),false], null);
}
});
/**
 * Route one provider text delta through the <think> state machine.
 * 
 * Returns {:mode <next-mode> :emissions [{:kind :agent_message|:reasoning
 *                                         :delta string}]}.
 */
open_hax.contract_runtime.agent.reasoning.route_think_delta = (function open_hax$contract_runtime$agent$reasoning$route_think_delta(p__15419){
var map__15422 = p__15419;
var map__15422__$1 = cljs.core.__destructure_map(map__15422);
var mode = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15422__$1,new cljs.core.Keyword(null,"mode","mode",654403691));
var last_assistant_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15422__$1,new cljs.core.Keyword(null,"last-assistant-text","last-assistant-text",-109059266));
var delta = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15422__$1,new cljs.core.Keyword(null,"delta","delta",108939957));
var mode__$1 = (function (){var or__5162__auto__ = mode;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"off","off",606440789);
}
})();
var delta__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = delta;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var last_assistant_text__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = last_assistant_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(clojure.string.blank_QMARK_(delta__$1)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),mode__$1,new cljs.core.Keyword(null,"emissions","emissions",925663162),cljs.core.PersistentVector.EMPTY], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(mode__$1,new cljs.core.Keyword(null,"off","off",606440789))){
var idx = delta__$1.indexOf(open_hax.contract_runtime.agent.reasoning.think_open);
if((((idx >= (0))) && (((clojure.string.blank_QMARK_(last_assistant_text__$1)) && ((idx < (64))))))){
var before = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(delta__$1,(0),idx);
var after = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(delta__$1,(idx + ((open_hax.contract_runtime.agent.reasoning.think_open).length)));
var routed_after = (function (){var G__15456 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"thinking","thinking",2063777387),new cljs.core.Keyword(null,"last-assistant-text","last-assistant-text",-109059266),last_assistant_text__$1,new cljs.core.Keyword(null,"delta","delta",108939957),after], null);
return (open_hax.contract_runtime.agent.reasoning.route_think_delta.cljs$core$IFn$_invoke$arity$1 ? open_hax.contract_runtime.agent.reasoning.route_think_delta.cljs$core$IFn$_invoke$arity$1(G__15456) : open_hax.contract_runtime.agent.reasoning.route_think_delta.call(null,G__15456));
})();
var before_emissions = (function (){var G__15461 = cljs.core.PersistentVector.EMPTY;
if(cljs.core.seq(clojure.string.trim(before))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__15461,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"agent_message","agent_message",-522809201),new cljs.core.Keyword(null,"delta","delta",108939957),before], null));
} else {
return G__15461;
}
})();
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"mode","mode",654403691).cljs$core$IFn$_invoke$arity$1(routed_after),new cljs.core.Keyword(null,"emissions","emissions",925663162),cljs.core.into.cljs$core$IFn$_invoke$arity$2(before_emissions,new cljs.core.Keyword(null,"emissions","emissions",925663162).cljs$core$IFn$_invoke$arity$1(routed_after))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),mode__$1,new cljs.core.Keyword(null,"emissions","emissions",925663162),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"agent_message","agent_message",-522809201),new cljs.core.Keyword(null,"delta","delta",108939957),delta__$1], null)], null)], null);
}
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(mode__$1,new cljs.core.Keyword(null,"thinking","thinking",2063777387))){
var idx = delta__$1.indexOf(open_hax.contract_runtime.agent.reasoning.think_close);
if((idx >= (0))){
var thinking = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(delta__$1,(0),idx);
var after = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(delta__$1,(idx + ((open_hax.contract_runtime.agent.reasoning.think_close).length)));
var emissions = (function (){var G__15467 = cljs.core.PersistentVector.EMPTY;
var G__15467__$1 = ((cljs.core.seq(thinking))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__15467,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),new cljs.core.Keyword(null,"delta","delta",108939957),thinking], null)):G__15467);
if(cljs.core.seq(after)){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__15467__$1,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"agent_message","agent_message",-522809201),new cljs.core.Keyword(null,"delta","delta",108939957),after], null));
} else {
return G__15467__$1;
}
})();
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"done","done",-889844188),new cljs.core.Keyword(null,"emissions","emissions",925663162),emissions], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),mode__$1,new cljs.core.Keyword(null,"emissions","emissions",925663162),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),new cljs.core.Keyword(null,"delta","delta",108939957),delta__$1], null)], null)], null);
}
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),mode__$1,new cljs.core.Keyword(null,"emissions","emissions",925663162),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"agent_message","agent_message",-522809201),new cljs.core.Keyword(null,"delta","delta",108939957),delta__$1], null)], null)], null);

}
}
}
});

//# sourceMappingURL=open_hax.contract_runtime.agent.reasoning.js.map
