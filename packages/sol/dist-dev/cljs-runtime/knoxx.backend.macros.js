import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.macros');
knoxx.backend.macros.contains_await_QMARK_ = (function knoxx$backend$macros$contains_await_QMARK_(form){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"await","await",1341799365,null),form)){
return true;
} else {
if(cljs.core.seq_QMARK_(form)){
return cljs.core.boolean$(cljs.core.some(knoxx.backend.macros.contains_await_QMARK_,form));
} else {
if(cljs.core.coll_QMARK_(form)){
return cljs.core.boolean$(cljs.core.some(knoxx.backend.macros.contains_await_QMARK_,form));
} else {
return false;

}
}
}
});
knoxx.backend.macros.handler_fn_form = (function knoxx$backend$macros$handler_fn_form(args,body){
if(knoxx.backend.macros.contains_await_QMARK_(body)){
return cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((new cljs.core.List(null,cljs.core.with_meta(new cljs.core.Symbol("cljs.core","fn","cljs.core/fn",-1065745098,null),cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.array_map,cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((new cljs.core.List(null,new cljs.core.Keyword(null,"file","file",-1269645878),null,(1),null)),(new cljs.core.List(null,"knoxx/backend/macros.cljc",null,(1),null)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(new cljs.core.List(null,new cljs.core.Keyword(null,"line","line",212345235),null,(1),null)),(new cljs.core.List(null,32,null,(1),null)),(new cljs.core.List(null,new cljs.core.Keyword(null,"column","column",2078222095),null,(1),null)),(new cljs.core.List(null,15,null,(1),null)),(new cljs.core.List(null,new cljs.core.Keyword(null,"end-line","end-line",1837326455),null,(1),null)),(new cljs.core.List(null,32,null,(1),null)),(new cljs.core.List(null,new cljs.core.Keyword(null,"end-column","end-column",1425389514),null,(1),null)),(new cljs.core.List(null,17,null,(1),null)),(new cljs.core.List(null,new cljs.core.Keyword(null,"async","async",1050769601),null,(1),null)),(new cljs.core.List(null,true,null,(1),null))], 0)))))),null,(1),null)),(new cljs.core.List(null,args,null,(1),null)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([body], 0))));
} else {
return cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((new cljs.core.List(null,new cljs.core.Symbol("cljs.core","fn","cljs.core/fn",-1065745098,null),null,(1),null)),(new cljs.core.List(null,args,null,(1),null)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([body], 0))));
}
});

//# sourceMappingURL=knoxx.backend.macros.js.map
