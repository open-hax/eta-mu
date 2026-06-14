import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.remote.runtime.api.js";
goog.provide('shadow.remote.runtime.shared');
shadow.remote.runtime.shared.init_state = (function shadow$remote$runtime$shared$init_state(client_info){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info,new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218),(0),new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),cljs.core.PersistentArrayMap.EMPTY], null);
});
shadow.remote.runtime.shared.now = (function shadow$remote$runtime$shared$now(){
return Date.now();
});
shadow.remote.runtime.shared.get_client_id = (function shadow$remote$runtime$shared$get_client_id(p__16821){
var map__16822 = p__16821;
var map__16822__$1 = cljs.core.__destructure_map(map__16822);
var runtime = map__16822__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16822__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var or__5162__auto__ = new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("runtime has no assigned runtime-id",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null));
}
});
shadow.remote.runtime.shared.relay_msg = (function shadow$remote$runtime$shared$relay_msg(runtime,msg){
var self_id_17007 = shadow.remote.runtime.shared.get_client_id(runtime);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"to","to",192099007).cljs$core$IFn$_invoke$arity$1(msg),self_id_17007)){
shadow.remote.runtime.api.relay_msg(runtime,msg);
} else {
Promise.resolve((1)).then((function (){
var G__16830 = runtime;
var G__16831 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"from","from",1815293044),self_id_17007);
return (shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2 ? shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2(G__16830,G__16831) : shadow.remote.runtime.shared.process.call(null,G__16830,G__16831));
}));
}

return msg;
});
shadow.remote.runtime.shared.reply = (function shadow$remote$runtime$shared$reply(runtime,p__16833,res){
var map__16834 = p__16833;
var map__16834__$1 = cljs.core.__destructure_map(map__16834);
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16834__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16834__$1,new cljs.core.Keyword(null,"from","from",1815293044));
var res__$1 = (function (){var G__16835 = res;
var G__16835__$1 = (cljs.core.truth_(call_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__16835,new cljs.core.Keyword(null,"call-id","call-id",1043012968),call_id):G__16835);
if(cljs.core.truth_(from)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__16835__$1,new cljs.core.Keyword(null,"to","to",192099007),from);
} else {
return G__16835__$1;
}
})();
return shadow.remote.runtime.api.relay_msg(runtime,res__$1);
});
shadow.remote.runtime.shared.call = (function shadow$remote$runtime$shared$call(var_args){
var G__16838 = arguments.length;
switch (G__16838) {
case 3:
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3 = (function (runtime,msg,handlers){
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4(runtime,msg,handlers,(0));
}));

(shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4 = (function (p__16840,msg,handlers,timeout_after_ms){
var map__16842 = p__16840;
var map__16842__$1 = cljs.core.__destructure_map(map__16842);
var runtime = map__16842__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16842__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
if(cljs.core.map_QMARK_(msg)){
} else {
throw (new Error("Assert failed: (map? msg)"));
}

if(cljs.core.map_QMARK_(handlers)){
} else {
throw (new Error("Assert failed: (map? handlers)"));
}

if(cljs.core.nat_int_QMARK_(timeout_after_ms)){
} else {
throw (new Error("Assert failed: (nat-int? timeout-after-ms)"));
}

var call_id = new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,cljs.core.update,new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218),cljs.core.inc);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),call_id], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"handlers","handlers",79528781),handlers,new cljs.core.Keyword(null,"called-at","called-at",607081160),shadow.remote.runtime.shared.now(),new cljs.core.Keyword(null,"msg","msg",-1386103444),msg,new cljs.core.Keyword(null,"timeout","timeout",-318625318),timeout_after_ms], null));

return shadow.remote.runtime.api.relay_msg(runtime,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"call-id","call-id",1043012968),call_id));
}));

(shadow.remote.runtime.shared.call.cljs$lang$maxFixedArity = 4);

shadow.remote.runtime.shared.trigger_BANG_ = (function shadow$remote$runtime$shared$trigger_BANG_(var_args){
var args__5903__auto__ = [];
var len__5897__auto___17031 = arguments.length;
var i__5898__auto___17032 = (0);
while(true){
if((i__5898__auto___17032 < len__5897__auto___17031)){
args__5903__auto__.push((arguments[i__5898__auto___17032]));

var G__17033 = (i__5898__auto___17032 + (1));
i__5898__auto___17032 = G__17033;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__16852,ev,args){
var map__16853 = p__16852;
var map__16853__$1 = cljs.core.__destructure_map(map__16853);
var runtime = map__16853__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16853__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var seq__16855 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__16858 = null;
var count__16859 = (0);
var i__16860 = (0);
while(true){
if((i__16860 < count__16859)){
var ext = chunk__16858.cljs$core$IIndexed$_nth$arity$2(null,i__16860);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__17048 = seq__16855;
var G__17049 = chunk__16858;
var G__17050 = count__16859;
var G__17051 = (i__16860 + (1));
seq__16855 = G__17048;
chunk__16858 = G__17049;
count__16859 = G__17050;
i__16860 = G__17051;
continue;
} else {
var G__17053 = seq__16855;
var G__17054 = chunk__16858;
var G__17055 = count__16859;
var G__17056 = (i__16860 + (1));
seq__16855 = G__17053;
chunk__16858 = G__17054;
count__16859 = G__17055;
i__16860 = G__17056;
continue;
}
} else {
var temp__5825__auto__ = cljs.core.seq(seq__16855);
if(temp__5825__auto__){
var seq__16855__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__16855__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__16855__$1);
var G__17057 = cljs.core.chunk_rest(seq__16855__$1);
var G__17058 = c__5694__auto__;
var G__17059 = cljs.core.count(c__5694__auto__);
var G__17060 = (0);
seq__16855 = G__17057;
chunk__16858 = G__17058;
count__16859 = G__17059;
i__16860 = G__17060;
continue;
} else {
var ext = cljs.core.first(seq__16855__$1);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__17062 = cljs.core.next(seq__16855__$1);
var G__17063 = null;
var G__17064 = (0);
var G__17065 = (0);
seq__16855 = G__17062;
chunk__16858 = G__17063;
count__16859 = G__17064;
i__16860 = G__17065;
continue;
} else {
var G__17067 = cljs.core.next(seq__16855__$1);
var G__17068 = null;
var G__17069 = (0);
var G__17070 = (0);
seq__16855 = G__17067;
chunk__16858 = G__17068;
count__16859 = G__17069;
i__16860 = G__17070;
continue;
}
}
} else {
return null;
}
}
break;
}
}));

(shadow.remote.runtime.shared.trigger_BANG_.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(shadow.remote.runtime.shared.trigger_BANG_.cljs$lang$applyTo = (function (seq16844){
var G__16845 = cljs.core.first(seq16844);
var seq16844__$1 = cljs.core.next(seq16844);
var G__16846 = cljs.core.first(seq16844__$1);
var seq16844__$2 = cljs.core.next(seq16844__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__16845,G__16846,seq16844__$2);
}));

shadow.remote.runtime.shared.welcome = (function shadow$remote$runtime$shared$welcome(p__16886,p__16887){
var map__16888 = p__16886;
var map__16888__$1 = cljs.core.__destructure_map(map__16888);
var runtime = map__16888__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16888__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__16890 = p__16887;
var map__16890__$1 = cljs.core.__destructure_map(map__16890);
var msg = map__16890__$1;
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16890__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(state_ref,cljs.core.assoc,new cljs.core.Keyword(null,"client-id","client-id",-464622140),client_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"welcome","welcome",-578152123),true], 0));

var map__16896 = cljs.core.deref(state_ref);
var map__16896__$1 = cljs.core.__destructure_map(map__16896);
var client_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16896__$1,new cljs.core.Keyword(null,"client-info","client-info",1958982504));
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16896__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
shadow.remote.runtime.shared.relay_msg(runtime,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"hello","hello",-245025397),new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info], null));

return shadow.remote.runtime.shared.trigger_BANG_(runtime,new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125));
});
shadow.remote.runtime.shared.ping = (function shadow$remote$runtime$shared$ping(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"pong","pong",-172484958)], null));
});
shadow.remote.runtime.shared.request_supported_ops = (function shadow$remote$runtime$shared$request_supported_ops(p__16903,msg){
var map__16904 = p__16903;
var map__16904__$1 = cljs.core.__destructure_map(map__16904);
var runtime = map__16904__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16904__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"supported-ops","supported-ops",337914702),new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.disj.cljs$core$IFn$_invoke$arity$variadic(cljs.core.set(cljs.core.keys(new cljs.core.Keyword(null,"ops","ops",1237330063).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))),new cljs.core.Keyword(null,"welcome","welcome",-578152123),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),new cljs.core.Keyword(null,"tool-disconnect","tool-disconnect",189103996)], 0))], null));
});
shadow.remote.runtime.shared.unknown_relay_op = (function shadow$remote$runtime$shared$unknown_relay_op(msg){
return console.warn("unknown-relay-op",msg);
});
shadow.remote.runtime.shared.unknown_op = (function shadow$remote$runtime$shared$unknown_op(msg){
return console.warn("unknown-op",msg);
});
shadow.remote.runtime.shared.add_extension_STAR_ = (function shadow$remote$runtime$shared$add_extension_STAR_(p__16906,key,p__16907){
var map__16908 = p__16906;
var map__16908__$1 = cljs.core.__destructure_map(map__16908);
var state = map__16908__$1;
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16908__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
var map__16910 = p__16907;
var map__16910__$1 = cljs.core.__destructure_map(map__16910);
var spec = map__16910__$1;
var ops = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16910__$1,new cljs.core.Keyword(null,"ops","ops",1237330063));
var transit_write_handlers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16910__$1,new cljs.core.Keyword(null,"transit-write-handlers","transit-write-handlers",1886308716));
if(cljs.core.contains_QMARK_(extensions,key)){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("extension already registered",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),key,new cljs.core.Keyword(null,"spec","spec",347520401),spec], null));
} else {
}

return cljs.core.reduce_kv((function (state__$1,op_kw,op_handler){
if(cljs.core.truth_(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063),op_kw], null)))){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("op already registered",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),key,new cljs.core.Keyword(null,"op","op",-1882987955),op_kw], null));
} else {
}

return cljs.core.assoc_in(state__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063),op_kw], null),op_handler);
}),cljs.core.assoc_in(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),key], null),spec),ops);
});
shadow.remote.runtime.shared.add_extension = (function shadow$remote$runtime$shared$add_extension(p__16921,key,spec){
var map__16923 = p__16921;
var map__16923__$1 = cljs.core.__destructure_map(map__16923);
var runtime = map__16923__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16923__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,shadow.remote.runtime.shared.add_extension_STAR_,key,spec);

var temp__5829__auto___17112 = new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125).cljs$core$IFn$_invoke$arity$1(spec);
if((temp__5829__auto___17112 == null)){
} else {
var on_welcome_17113 = temp__5829__auto___17112;
if(cljs.core.truth_(new cljs.core.Keyword(null,"welcome","welcome",-578152123).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))){
(on_welcome_17113.cljs$core$IFn$_invoke$arity$0 ? on_welcome_17113.cljs$core$IFn$_invoke$arity$0() : on_welcome_17113.call(null));
} else {
}
}

return runtime;
});
shadow.remote.runtime.shared.add_defaults = (function shadow$remote$runtime$shared$add_defaults(runtime){
return shadow.remote.runtime.shared.add_extension(runtime,new cljs.core.Keyword("shadow.remote.runtime.shared","defaults","shadow.remote.runtime.shared/defaults",-1821257543),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"welcome","welcome",-578152123),(function (p1__16927_SHARP_){
return shadow.remote.runtime.shared.welcome(runtime,p1__16927_SHARP_);
}),new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),(function (p1__16928_SHARP_){
return shadow.remote.runtime.shared.unknown_relay_op(p1__16928_SHARP_);
}),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),(function (p1__16929_SHARP_){
return shadow.remote.runtime.shared.unknown_op(p1__16929_SHARP_);
}),new cljs.core.Keyword(null,"ping","ping",-1670114784),(function (p1__16930_SHARP_){
return shadow.remote.runtime.shared.ping(runtime,p1__16930_SHARP_);
}),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),(function (p1__16931_SHARP_){
return shadow.remote.runtime.shared.request_supported_ops(runtime,p1__16931_SHARP_);
})], null)], null));
});
shadow.remote.runtime.shared.del_extension_STAR_ = (function shadow$remote$runtime$shared$del_extension_STAR_(state,key){
var ext = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),key], null));
if(cljs.core.not(ext)){
return state;
} else {
return cljs.core.reduce_kv((function (state__$1,op_kw,op_handler){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(state__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063)], null),cljs.core.dissoc,op_kw);
}),cljs.core.update.cljs$core$IFn$_invoke$arity$4(state,new cljs.core.Keyword(null,"extensions","extensions",-1103629196),cljs.core.dissoc,key),new cljs.core.Keyword(null,"ops","ops",1237330063).cljs$core$IFn$_invoke$arity$1(ext));
}
});
shadow.remote.runtime.shared.del_extension = (function shadow$remote$runtime$shared$del_extension(p__16941,key){
var map__16942 = p__16941;
var map__16942__$1 = cljs.core.__destructure_map(map__16942);
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16942__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(state_ref,shadow.remote.runtime.shared.del_extension_STAR_,key);
});
shadow.remote.runtime.shared.unhandled_call_result = (function shadow$remote$runtime$shared$unhandled_call_result(call_config,msg){
return console.warn("unhandled call result",msg,call_config);
});
shadow.remote.runtime.shared.unhandled_client_not_found = (function shadow$remote$runtime$shared$unhandled_client_not_found(p__16946,msg){
var map__16947 = p__16946;
var map__16947__$1 = cljs.core.__destructure_map(map__16947);
var runtime = map__16947__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16947__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic(runtime,new cljs.core.Keyword(null,"on-client-not-found","on-client-not-found",-642452849),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([msg], 0));
});
shadow.remote.runtime.shared.reply_unknown_op = (function shadow$remote$runtime$shared$reply_unknown_op(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"msg","msg",-1386103444),msg], null));
});
shadow.remote.runtime.shared.process = (function shadow$remote$runtime$shared$process(p__16951,p__16952){
var map__16954 = p__16951;
var map__16954__$1 = cljs.core.__destructure_map(map__16954);
var runtime = map__16954__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16954__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__16957 = p__16952;
var map__16957__$1 = cljs.core.__destructure_map(map__16957);
var msg = map__16957__$1;
var op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16957__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16957__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
var state = cljs.core.deref(state_ref);
var op_handler = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063),op], null));
if(cljs.core.truth_(call_id)){
var cfg = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),call_id], null));
var call_handler = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cfg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"handlers","handlers",79528781),op], null));
if(cljs.core.truth_(call_handler)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(state_ref,cljs.core.update,new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),cljs.core.dissoc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([call_id], 0));

return (call_handler.cljs$core$IFn$_invoke$arity$1 ? call_handler.cljs$core$IFn$_invoke$arity$1(msg) : call_handler.call(null,msg));
} else {
if(cljs.core.truth_(op_handler)){
return (op_handler.cljs$core$IFn$_invoke$arity$1 ? op_handler.cljs$core$IFn$_invoke$arity$1(msg) : op_handler.call(null,msg));
} else {
return shadow.remote.runtime.shared.unhandled_call_result(cfg,msg);

}
}
} else {
if(cljs.core.truth_(op_handler)){
return (op_handler.cljs$core$IFn$_invoke$arity$1 ? op_handler.cljs$core$IFn$_invoke$arity$1(msg) : op_handler.call(null,msg));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client-not-found","client-not-found",-1754042614),op)){
return shadow.remote.runtime.shared.unhandled_client_not_found(runtime,msg);
} else {
return shadow.remote.runtime.shared.reply_unknown_op(runtime,msg);

}
}
}
});
shadow.remote.runtime.shared.run_on_idle = (function shadow$remote$runtime$shared$run_on_idle(state_ref){
var seq__16964 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__16966 = null;
var count__16967 = (0);
var i__16968 = (0);
while(true){
if((i__16968 < count__16967)){
var map__16989 = chunk__16966.cljs$core$IIndexed$_nth$arity$2(null,i__16968);
var map__16989__$1 = cljs.core.__destructure_map(map__16989);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16989__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null));


var G__17143 = seq__16964;
var G__17144 = chunk__16966;
var G__17145 = count__16967;
var G__17146 = (i__16968 + (1));
seq__16964 = G__17143;
chunk__16966 = G__17144;
count__16967 = G__17145;
i__16968 = G__17146;
continue;
} else {
var G__17147 = seq__16964;
var G__17148 = chunk__16966;
var G__17149 = count__16967;
var G__17150 = (i__16968 + (1));
seq__16964 = G__17147;
chunk__16966 = G__17148;
count__16967 = G__17149;
i__16968 = G__17150;
continue;
}
} else {
var temp__5825__auto__ = cljs.core.seq(seq__16964);
if(temp__5825__auto__){
var seq__16964__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__16964__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__16964__$1);
var G__17151 = cljs.core.chunk_rest(seq__16964__$1);
var G__17152 = c__5694__auto__;
var G__17153 = cljs.core.count(c__5694__auto__);
var G__17154 = (0);
seq__16964 = G__17151;
chunk__16966 = G__17152;
count__16967 = G__17153;
i__16968 = G__17154;
continue;
} else {
var map__16993 = cljs.core.first(seq__16964__$1);
var map__16993__$1 = cljs.core.__destructure_map(map__16993);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16993__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null));


var G__17156 = cljs.core.next(seq__16964__$1);
var G__17157 = null;
var G__17158 = (0);
var G__17159 = (0);
seq__16964 = G__17156;
chunk__16966 = G__17157;
count__16967 = G__17158;
i__16968 = G__17159;
continue;
} else {
var G__17160 = cljs.core.next(seq__16964__$1);
var G__17161 = null;
var G__17162 = (0);
var G__17163 = (0);
seq__16964 = G__17160;
chunk__16966 = G__17161;
count__16967 = G__17162;
i__16968 = G__17163;
continue;
}
}
} else {
return null;
}
}
break;
}
});

//# sourceMappingURL=shadow.remote.runtime.shared.js.map
