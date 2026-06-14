import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.extern.agent_runner');
knoxx.backend.extern.agent_runner.to_cljs = (function knoxx$backend$extern$agent_runner$to_cljs(value){
if((value == null)){
return null;
} else {
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(cljs.core.vector_QMARK_(value)){
return value;
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
}
});
knoxx.backend.extern.agent_runner.to_cljs_map = (function knoxx$backend$extern$agent_runner$to_cljs_map(value){
var value__$1 = knoxx.backend.extern.agent_runner.to_cljs(value);
if(cljs.core.map_QMARK_(value__$1)){
return value__$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
});
knoxx.backend.extern.agent_runner.err_prop = (function knoxx$backend$extern$agent_runner$err_prop(err,prop){
try{return (err[prop]);
}catch (e35246){var _ = e35246;
return null;
}});
knoxx.backend.extern.agent_runner.err_message = (function knoxx$backend$extern$agent_runner$err_message(err){
var or__5162__auto__ = (function (){var G__35248 = knoxx.backend.extern.agent_runner.err_prop(err,"message");
var G__35248__$1 = (((G__35248 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__35248)));
var G__35248__$2 = (((G__35248__$1 == null))?null:clojure.string.trim(G__35248__$1));
if((G__35248__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__35248__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__35250 = err;
var G__35250__$1 = (((G__35250 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__35250)));
var G__35250__$2 = (((G__35250__$1 == null))?null:clojure.string.trim(G__35250__$1));
if((G__35250__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__35250__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Unknown error";
}
}
});
knoxx.backend.extern.agent_runner.safe_ex_data = (function knoxx$backend$extern$agent_runner$safe_ex_data(err){
try{return cljs.core.ex_data(err);
}catch (e35258){var _ = e35258;
return null;
}});
knoxx.backend.extern.agent_runner.safe_json = (function knoxx$backend$extern$agent_runner$safe_json(value){
try{return JSON.stringify(cljs.core.clj__GT_js(value),null,(2));
}catch (e35266){var _ = e35266;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
}});
knoxx.backend.extern.agent_runner.error_diagnostic = (function knoxx$backend$extern$agent_runner$error_diagnostic(body,err){
var G__35280 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"message","message",-406056002),knoxx.backend.extern.agent_runner.err_message(err),new cljs.core.Keyword(null,"runId","runId",505587730),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"model","model",331153215),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
}
})(),new cljs.core.Keyword(null,"contractId","contractId",710260199),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622)], null)),new cljs.core.Keyword(null,"actorId","actorId",989542370),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"actor-id","actor-id",897721067)], null))], null);
var G__35280__$1 = (cljs.core.truth_((function (){var G__35281 = knoxx.backend.extern.agent_runner.err_prop(err,"name");
var G__35281__$1 = (((G__35281 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__35281)));
var G__35281__$2 = (((G__35281__$1 == null))?null:clojure.string.trim(G__35281__$1));
if((G__35281__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__35281__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__35280,new cljs.core.Keyword(null,"name","name",1843675177),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.extern.agent_runner.err_prop(err,"name")))):G__35280);
var G__35280__$2 = (cljs.core.truth_((function (){var G__35286 = knoxx.backend.extern.agent_runner.err_prop(err,"stack");
var G__35286__$1 = (((G__35286 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__35286)));
var G__35286__$2 = (((G__35286__$1 == null))?null:clojure.string.trim(G__35286__$1));
if((G__35286__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__35286__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__35280__$1,new cljs.core.Keyword(null,"stack","stack",-793405930),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.extern.agent_runner.err_prop(err,"stack")))):G__35280__$1);
if(cljs.core.truth_(knoxx.backend.extern.agent_runner.safe_ex_data(err))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__35280__$2,new cljs.core.Keyword(null,"data","data",-232669377),knoxx.backend.extern.agent_runner.safe_ex_data(err));
} else {
return G__35280__$2;
}
});
knoxx.backend.extern.agent_runner.log_async_spawn_error_BANG_ = (function knoxx$backend$extern$agent_runner$log_async_spawn_error_BANG_(body,err){
var diagnostic = knoxx.backend.extern.agent_runner.error_diagnostic(body,err);
console.error("[agents.runner] async direct spawn failed",knoxx.backend.extern.agent_runner.safe_json(diagnostic));

var temp__5825__auto__ = new cljs.core.Keyword(null,"stack","stack",-793405930).cljs$core$IFn$_invoke$arity$1(diagnostic);
if(cljs.core.truth_(temp__5825__auto__)){
var stack = temp__5825__auto__;
return console.error("[agents.runner] stack\n",stack);
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.extern.agent_runner.js.map
