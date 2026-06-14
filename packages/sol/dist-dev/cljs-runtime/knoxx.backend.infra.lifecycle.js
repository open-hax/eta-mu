import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.http_server.js";
import "./knoxx.backend.domain.realtime.js";
goog.provide('knoxx.backend.infra.lifecycle');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.lifecycle !== 'undefined') && (typeof knoxx.backend.infra.lifecycle.http_state_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.lifecycle.http_state_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"app","app",-560961707),null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),null,new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"policy-context","policy-context",-10488283),null,new cljs.core.Keyword(null,"cookie-hook?","cookie-hook?",1025238582),false], null));
}
knoxx.backend.infra.lifecycle.remember_context_BANG_ = (function knoxx$backend$infra$lifecycle$remember_context_BANG_(runtime,config,policy_context,cookie_hook_QMARK_){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.lifecycle.http_state_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"policy-context","policy-context",-10488283),policy_context,new cljs.core.Keyword(null,"cookie-hook?","cookie-hook?",1025238582),cookie_hook_QMARK_], 0));

return true;
});
knoxx.backend.infra.lifecycle.remember_app_BANG_ = (function knoxx$backend$infra$lifecycle$remember_app_BANG_(app){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.lifecycle.http_state_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"app","app",-560961707),app);

return app;
});
knoxx.backend.infra.lifecycle.context = (function knoxx$backend$infra$lifecycle$context(){
return cljs.core.select_keys(cljs.core.deref(knoxx.backend.infra.lifecycle.http_state_STAR_),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"policy-context","policy-context",-10488283),new cljs.core.Keyword(null,"cookie-hook?","cookie-hook?",1025238582)], null));
});
knoxx.backend.infra.lifecycle.current_app = (function knoxx$backend$infra$lifecycle$current_app(){
return new cljs.core.Keyword(null,"app","app",-560961707).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.lifecycle.http_state_STAR_));
});
knoxx.backend.infra.lifecycle.close_current_http_BANG_ = (function knoxx$backend$infra$lifecycle$close_current_http_BANG_(){
var app = new cljs.core.Keyword(null,"app","app",-560961707).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.lifecycle.http_state_STAR_));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.lifecycle.http_state_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"app","app",-560961707),null);

knoxx.backend.domain.realtime.stop_BANG_();

if(cljs.core.truth_(app)){
return knoxx.backend.infra.http_server.close_BANG_(app);
} else {
return Promise.resolve(true);
}
});

//# sourceMappingURL=knoxx.backend.infra.lifecycle.js.map
