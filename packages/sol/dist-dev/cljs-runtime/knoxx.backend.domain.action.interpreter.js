import "./cljs_env.js";
import "./cljs.core.js";
import "./open_hax.contract_runtime.action.interpreter.js";
goog.provide('knoxx.backend.domain.action.interpreter');
/**
 * Resolve an :action/scope declaration {:actions [...] :filters [...]
 * :stores [...]} into a flat scope map keyed by the declared ids.
 */
knoxx.backend.domain.action.interpreter.resolve_scope_decl = (function knoxx$backend$domain$action$interpreter$resolve_scope_decl(config,scope_decl){
return open_hax.contract_runtime.action.interpreter.resolve_scope_decl(config,scope_decl);
});
/**
 * Execute the action facet of a resource with scope injected into ctx.
 * Returns a Promise of the action result.
 */
knoxx.backend.domain.action.interpreter.execute_BANG_ = (function knoxx$backend$domain$action$interpreter$execute_BANG_(var_args){
var G__23039 = arguments.length;
switch (G__23039) {
case 2:
return knoxx.backend.domain.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (ctx,action){
return open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,action);
}));

(knoxx.backend.domain.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (ctx,action,redirects){
return open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,action,redirects);
}));

(knoxx.backend.domain.action.interpreter.execute_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.action.interpreter.js.map
