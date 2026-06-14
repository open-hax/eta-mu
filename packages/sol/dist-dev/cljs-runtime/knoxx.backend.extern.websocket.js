import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.extern.websocket');
knoxx.backend.extern.websocket.client_socket = (function knoxx$backend$extern$websocket$client_socket(socket){
var or__5162__auto__ = (socket["socket"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return socket;
}
});
knoxx.backend.extern.websocket.message_data__GT_string = (function knoxx$backend$extern$websocket$message_data__GT_string(value){
if(typeof value === 'string'){
return value;
} else {
if((value instanceof Buffer)){
return value.toString("utf8");
} else {
if((value instanceof Uint8Array)){
return Buffer.from(value).toString("utf8");
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));

}
}
}
});
knoxx.backend.extern.websocket.send_json_BANG_ = (function knoxx$backend$extern$websocket$send_json_BANG_(socket,payload){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),(socket["readyState"]))){
return socket.send(JSON.stringify(cljs.core.clj__GT_js(payload)));
} else {
return null;
}
});
knoxx.backend.extern.websocket.close_BANG_ = (function knoxx$backend$extern$websocket$close_BANG_(var_args){
var G__36745 = arguments.length;
switch (G__36745) {
case 1:
return knoxx.backend.extern.websocket.close_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 3:
return knoxx.backend.extern.websocket.close_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.extern.websocket.close_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (socket){
return knoxx.backend.extern.websocket.close_BANG_.cljs$core$IFn$_invoke$arity$3(socket,(1000),"");
}));

(knoxx.backend.extern.websocket.close_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (socket,code,reason){
if(cljs.core.truth_(socket)){
try{return socket.close(code,reason);
}catch (e36747){var _ = e36747;
return null;
}} else {
return null;
}
}));

(knoxx.backend.extern.websocket.close_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.extern.websocket.on_BANG_ = (function knoxx$backend$extern$websocket$on_BANG_(socket,event_name,handler){
return socket.on(event_name,handler);
});
knoxx.backend.extern.websocket.voice_stream_event = (function knoxx$backend$extern$websocket$voice_stream_event(payload){
var audio = (payload["audio"]);
var is_final = (payload["isFinal"]) === true;
if(typeof audio === 'string'){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),"audio",new cljs.core.Keyword(null,"audio","audio",1819127321),audio,new cljs.core.Keyword(null,"alignment","alignment",1040093386),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((payload["alignment"]),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"normalized_alignment","normalized_alignment",-162749980),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((payload["normalizedAlignment"]),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], null);
} else {
if(is_final){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"final",new cljs.core.Keyword(null,"isFinal","isFinal",150442431),true], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"event",new cljs.core.Keyword(null,"payload","payload",-383036092),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(payload,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], null);

}
}
});

//# sourceMappingURL=knoxx.backend.extern.websocket.js.map
