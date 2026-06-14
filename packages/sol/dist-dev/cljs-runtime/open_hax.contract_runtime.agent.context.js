import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('open_hax.contract_runtime.agent.context');
if((typeof open_hax !== 'undefined') && (typeof open_hax.contract_runtime !== 'undefined') && (typeof open_hax.contract_runtime.agent !== 'undefined') && (typeof open_hax.contract_runtime.agent.context !== 'undefined') && (typeof open_hax.contract_runtime.agent.context.current_context_STAR_ !== 'undefined')){
} else {
open_hax.contract_runtime.agent.context.current_context_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Set the current agent turn context.
 */
open_hax.contract_runtime.agent.context.set_context_BANG_ = (function open_hax$contract_runtime$agent$context$set_context_BANG_(p__21105){
var map__21106 = p__21105;
var map__21106__$1 = cljs.core.__destructure_map(map__21106);
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21106__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21106__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21106__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var agent_spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21106__$1,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541));
return cljs.core.reset_BANG_(open_hax.contract_runtime.agent.context.current_context_STAR_,(cljs.core.truth_((function (){var and__5160__auto__ = session_id;
if(cljs.core.truth_(and__5160__auto__)){
return conversation_id;
} else {
return and__5160__auto__;
}
})())?(function (){var G__21107 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id], null);
if(cljs.core.truth_(agent_spec)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21107,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),agent_spec);
} else {
return G__21107;
}
})():null));
});
/**
 * Clear the current agent turn context.
 */
open_hax.contract_runtime.agent.context.clear_context_BANG_ = (function open_hax$contract_runtime$agent$context$clear_context_BANG_(){
return cljs.core.reset_BANG_(open_hax.contract_runtime.agent.context.current_context_STAR_,null);
});
/**
 * Get the current agent turn context, or nil if none is active.
 */
open_hax.contract_runtime.agent.context.get_context = (function open_hax$contract_runtime$agent$context$get_context(){
return cljs.core.deref(open_hax.contract_runtime.agent.context.current_context_STAR_);
});

//# sourceMappingURL=open_hax.contract_runtime.agent.context.js.map
