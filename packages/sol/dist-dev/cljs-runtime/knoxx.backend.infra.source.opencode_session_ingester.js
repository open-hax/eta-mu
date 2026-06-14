import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.clients.opencode.js";
goog.provide('knoxx.backend.infra.source.opencode_session_ingester');
knoxx.backend.infra.source.opencode_session_ingester.opencode_client = (function knoxx$backend$infra$source$opencode_session_ingester$opencode_client(){
return knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
});
knoxx.backend.infra.source.opencode_session_ingester.opencode_server_url = (function knoxx$backend$infra$source$opencode_session_ingester$opencode_server_url(){
return knoxx.backend.infra.clients.opencode.server_url(cljs.core.PersistentArrayMap.EMPTY);
});
knoxx.backend.infra.source.opencode_session_ingester.get_opencode_ingest_status = (async function knoxx$backend$infra$source$opencode_session_ingester$get_opencode_ingest_status(){
try{var parts = (await Promise.all([knoxx.backend.infra.clients.opencode.health_BANG_(knoxx.backend.infra.source.opencode_session_ingester.opencode_client()),knoxx.backend.infra.clients.opencode.sessions_BANG_(knoxx.backend.infra.source.opencode_session_ingester.opencode_client(),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(20),new cljs.core.Keyword(null,"archived","archived",1018596768),true], null))]));
var health = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1((parts[(0)]));
var sessions = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1((parts[(1)]));
return ({"ok": true, "opencodeServerUrl": knoxx.backend.infra.source.opencode_session_ingester.opencode_server_url(), "health": cljs.core.clj__GT_js(health), "recentSessionCount": cljs.core.count((await (async function (){var or__5162__auto__ = sessions;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())), "recentSessions": cljs.core.clj__GT_js(sessions)});
}catch (e38345){var err = e38345;
return ({"ok": false, "opencodeServerUrl": knoxx.backend.infra.source.opencode_session_ingester.opencode_server_url(), "error": err.message});
}});
knoxx.backend.infra.source.opencode_session_ingester.list_opencode_sessions = (async function knoxx$backend$infra$source$opencode_session_ingester$list_opencode_sessions(p__38359){
var map__38370 = p__38359;
var map__38370__$1 = cljs.core.__destructure_map(map__38370);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__38370__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363),(50));
var cursor = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__38370__$1,new cljs.core.Keyword(null,"cursor","cursor",1011937484));
var directory = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__38370__$1,new cljs.core.Keyword(null,"directory","directory",-58912409));
var search = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__38370__$1,new cljs.core.Keyword(null,"search","search",1564939822));
var roots = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__38370__$1,new cljs.core.Keyword(null,"roots","roots",-1088919250));
var archived = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__38370__$1,new cljs.core.Keyword(null,"archived","archived",1018596768),true);
var limit__$1 = cljs.core.min.cljs$core$IFn$_invoke$arity$2((await (async function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (50);
}
})()),(200));
var resp = (await knoxx.backend.infra.clients.opencode.sessions_BANG_(knoxx.backend.infra.source.opencode_session_ingester.opencode_client(),(await (async function (){var G__38373 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit__$1,new cljs.core.Keyword(null,"archived","archived",1018596768),archived], null);
var G__38373__$1 = (cljs.core.truth_(cursor)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__38373,new cljs.core.Keyword(null,"cursor","cursor",1011937484),cursor):G__38373);
var G__38373__$2 = (cljs.core.truth_(directory)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__38373__$1,new cljs.core.Keyword(null,"directory","directory",-58912409),directory):G__38373__$1);
var G__38373__$3 = (cljs.core.truth_(search)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__38373__$2,new cljs.core.Keyword(null,"search","search",1564939822),search):G__38373__$2);
if((!((roots == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__38373__$3,new cljs.core.Keyword(null,"roots","roots",-1088919250),roots);
} else {
return G__38373__$3;
}
})())));
return ({"ok": true, "opencodeServerUrl": knoxx.backend.infra.source.opencode_session_ingester.opencode_server_url(), "sessions": cljs.core.clj__GT_js(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)), "nextCursor": new cljs.core.Keyword(null,"nextCursor","nextCursor",-26071595).cljs$core$IFn$_invoke$arity$1(resp), "has_more": cljs.core.boolean$(new cljs.core.Keyword(null,"nextCursor","nextCursor",-26071595).cljs$core$IFn$_invoke$arity$1(resp))});
});
knoxx.backend.infra.source.opencode_session_ingester.get_opencode_session_messages = (function knoxx$backend$infra$source$opencode_session_ingester$get_opencode_session_messages(session_id){
return knoxx.backend.infra.clients.opencode.session_messages_BANG_(knoxx.backend.infra.source.opencode_session_ingester.opencode_client(),session_id);
});

//# sourceMappingURL=knoxx.backend.infra.source.opencode_session_ingester.js.map
