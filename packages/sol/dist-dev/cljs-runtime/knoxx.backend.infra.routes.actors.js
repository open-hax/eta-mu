import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.actor.mailbox.js";
import "./knoxx.backend.domain.event.dispatch.js";
import "./knoxx.backend.macros.js";
goog.provide('knoxx.backend.infra.routes.actors');
knoxx.backend.infra.routes.actors.query_param = (function knoxx$backend$infra$routes$actors$query_param(var_args){
var args__5903__auto__ = [];
var len__5897__auto___30966 = arguments.length;
var i__5898__auto___30967 = (0);
while(true){
if((i__5898__auto___30967 < len__5897__auto___30966)){
args__5903__auto__.push((arguments[i__5898__auto___30967]));

var G__30968 = (i__5898__auto___30967 + (1));
i__5898__auto___30967 = G__30968;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic = (function (request,names){
return cljs.core.some((function (name){
var value = (request["query"][name]);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))){
return null;
} else {
return value;
}
}),names);
}));

(knoxx.backend.infra.routes.actors.query_param.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.infra.routes.actors.query_param.cljs$lang$applyTo = (function (seq30540){
var G__30541 = cljs.core.first(seq30540);
var seq30540__$1 = cljs.core.next(seq30540);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__30541,seq30540__$1);
}));

knoxx.backend.infra.routes.actors.body_map = (function knoxx$backend$infra$routes$actors$body_map(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.routes.actors.statuses_from_body = (function knoxx$backend$infra$routes$actors$statuses_from_body(body){
var raw = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"statuses","statuses",710922046).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(body);
}
})();
if(cljs.core.sequential_QMARK_(raw)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.actor.mailbox.normalize_status,raw);
} else {
if(typeof raw === 'string'){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.actor.mailbox.normalize_status(raw)], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["pending","failed"], null);

}
}
});
knoxx.backend.infra.routes.actors.current_actor_id = (function knoxx$backend$infra$routes$actors$current_actor_id(ctx){
var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(ctx);
}
}
});
knoxx.backend.infra.routes.actors.api_entry = (function knoxx$backend$infra$routes$actors$api_entry(entry){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"delivery","delivery",-1844470516),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"acknowledgedAt","acknowledgedAt",-2025454257),new cljs.core.Keyword(null,"preview","preview",451279890),new cljs.core.Keyword(null,"lastError","lastError",845794675),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"target","target",253001721),new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword(null,"deliveredAt","deliveredAt",510515582),new cljs.core.Keyword(null,"contentRef","contentRef",625680927)],[new cljs.core.Keyword("mailbox","updated-at","mailbox/updated-at",-779421100).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","expires-at","mailbox/expires-at",-1256489474).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","created-at","mailbox/created-at",-1406815032).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","delivery","mailbox/delivery",1585980392).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","source","mailbox/source",-1264954567).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","acknowledged-at","mailbox/acknowledged-at",1312417597).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","preview","mailbox/preview",-512838338).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","last-error","mailbox/last-error",997868945).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","kind","mailbox/kind",401992993).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","target","mailbox/target",1100093613).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","metadata","mailbox/metadata",-1698257615).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","delivered-at","mailbox/delivered-at",-1353109945).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","content-ref","mailbox/content-ref",877031624).cljs$core$IFn$_invoke$arity$1(entry)]);
});
knoxx.backend.infra.routes.actors.api_result = (function knoxx$backend$infra$routes$actors$api_result(result){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"entries","entries",-86943161),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.actors.api_entry,new cljs.core.Keyword(null,"entries","entries",-86943161).cljs$core$IFn$_invoke$arity$1(result)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"durable","durable",-216004834),cljs.core.boolean$(new cljs.core.Keyword(null,"durable?","durable?",2084525683).cljs$core$IFn$_invoke$arity$1(result))], 0)),new cljs.core.Keyword(null,"durable?","durable?",2084525683));
});
knoxx.backend.infra.routes.actors.retry_dispatches_BANG_ = (function knoxx$backend$infra$routes$actors$retry_dispatches_BANG_(entries){
return Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (entry){
return knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.actor.mailbox.retry_request_event(entry));
}),entries)));
});
knoxx.backend.infra.routes.actors.actor_mailbox_list_route_BANG_ = (function knoxx$backend$infra$routes$actors$actor_mailbox_list_route_BANG_(app,runtime,config,deps){
var map__30667 = deps;
var map__30667__$1 = cljs.core.__destructure_map(map__30667);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30667__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30680 = app;
var G__30681 = "GET";
var G__30682 = "/api/admin/config/actors/mailbox";
var G__30683 = (function (){var obj30688 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var result = (await knoxx.backend.domain.actor.mailbox.list_entries_BANG_(runtime,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"status","status",-1997798413),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["status"], 0)),new cljs.core.Keyword(null,"target-actor-id","target-actor-id",1128799845),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["target_actor_id","targetActorId","actor_id","actorId"], 0)),new cljs.core.Keyword(null,"target-session-id","target-session-id",-1929186990),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["target_session_id","targetSessionId","session_id","sessionId"], 0)),new cljs.core.Keyword(null,"source-actor-id","source-actor-id",-1224551760),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["source_actor_id","sourceActorId"], 0)),new cljs.core.Keyword(null,"source-run-id","source-run-id",-2000058256),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["source_run_id","sourceRunId","run_id","runId"], 0)),new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["limit"], 0))], null)));
var G__30696 = reply;
var G__30697 = (200);
var G__30698 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.actors.api_result(result),new cljs.core.Keyword(null,"ok","ok",967785236),true);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30696,G__30697,G__30698) : json_response_BANG_.call(null,G__30696,G__30697,G__30698));
}catch (e30693){var err = e30693;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj30688;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30680,G__30681,G__30682,G__30683) : route_BANG_.call(null,G__30680,G__30681,G__30682,G__30683));
});
knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_ = (async function knoxx$backend$infra$routes$actors$acknowledge_mailbox_BANG_(var_args){
var G__30732 = arguments.length;
switch (G__30732) {
case 5:
return knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$5 = (async function (runtime,reply,error_response_BANG_,json_response_BANG_,mailbox_id){
return knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$6(runtime,reply,error_response_BANG_,json_response_BANG_,mailbox_id,null);
}));

(knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$6 = (async function (runtime,reply,error_response_BANG_,json_response_BANG_,mailbox_id,target_actor_id){
try{var entry = (await knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,mailbox_id,target_actor_id));
if(cljs.core.truth_(entry)){
var G__30755 = reply;
var G__30756 = (200);
var G__30757 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"entry","entry",505168823),knoxx.backend.infra.routes.actors.api_entry(entry)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30755,G__30756,G__30757) : json_response_BANG_.call(null,G__30755,G__30756,G__30757));
} else {
var G__30761 = reply;
var G__30762 = (404);
var G__30763 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"mailbox entry not found"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30761,G__30762,G__30763) : json_response_BANG_.call(null,G__30761,G__30762,G__30763));
}
}catch (e30749){var err = e30749;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}}));

(knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$lang$maxFixedArity = 6);

knoxx.backend.infra.routes.actors.actor_mailbox_ack_route_BANG_ = (function knoxx$backend$infra$routes$actors$actor_mailbox_ack_route_BANG_(app,runtime,config,deps){
var map__30773 = deps;
var map__30773__$1 = cljs.core.__destructure_map(map__30773);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30773__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30783 = app;
var G__30784 = "POST";
var G__30785 = "/api/admin/config/actors/mailbox/:mailboxId/ack";
var G__30786 = (function (){var obj30788 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

return knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$5(runtime,reply,error_response_BANG_,json_response_BANG_,(request["params"]["mailboxId"]));
}catch (e30792){var err = e30792;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj30788;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30783,G__30784,G__30785,G__30786) : route_BANG_.call(null,G__30783,G__30784,G__30785,G__30786));
});
knoxx.backend.infra.routes.actors.actor_mailbox_retry_route_BANG_ = (function knoxx$backend$infra$routes$actors$actor_mailbox_retry_route_BANG_(app,runtime,config,deps){
var map__30798 = deps;
var map__30798__$1 = cljs.core.__destructure_map(map__30798);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30798__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30806 = app;
var G__30807 = "POST";
var G__30808 = "/api/admin/config/actors/mailbox/retry";
var G__30809 = (function (){var obj30815 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var body = knoxx.backend.infra.routes.actors.body_map(request);
var dispatch_events_QMARK_ = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,new cljs.core.Keyword(null,"dispatch_events","dispatch_events",1219095071).cljs$core$IFn$_invoke$arity$1(body));
var result = (await knoxx.backend.domain.actor.mailbox.retry_eligible_BANG_(runtime,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"mailbox-id","mailbox-id",796861681),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mailbox_id","mailbox_id",1368174469).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"mailboxId","mailboxId",-395830287).cljs$core$IFn$_invoke$arity$1(body);
}
})()),new cljs.core.Keyword(null,"statuses","statuses",710922046),knoxx.backend.infra.routes.actors.statuses_from_body(body),new cljs.core.Keyword(null,"max-attempts","max-attempts",1686564297),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"max_attempts","max_attempts",541538771).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"maxAttempts","maxAttempts",250760336).cljs$core$IFn$_invoke$arity$1(body);
}
})()),new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.Keyword(null,"limit","limit",-1355822363).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"delay-seconds","delay-seconds",-1391031133),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"delay_seconds","delay_seconds",2065814715).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"delaySeconds","delaySeconds",1562379005).cljs$core$IFn$_invoke$arity$1(body);
}
})())], null)));
var entries = new cljs.core.Keyword(null,"entries","entries",-86943161).cljs$core$IFn$_invoke$arity$1(result);
if(((dispatch_events_QMARK_) && (cljs.core.seq(entries)))){
var G__30900 = reply;
var G__30901 = (202);
var G__30902 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.actors.api_result(result),new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"retry_event_count","retry_event_count",-1329491888),cljs.core.count(entries),new cljs.core.Keyword(null,"dispatches","dispatches",-331249187),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await knoxx.backend.infra.routes.actors.retry_dispatches_BANG_(entries)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30900,G__30901,G__30902) : json_response_BANG_.call(null,G__30900,G__30901,G__30902));
} else {
var G__30903 = reply;
var G__30904 = (202);
var G__30905 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.actors.api_result(result),new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"retry_event_count","retry_event_count",-1329491888),(0)], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30903,G__30904,G__30905) : json_response_BANG_.call(null,G__30903,G__30904,G__30905));
}
}catch (e30830){var err = e30830;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj30815;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30806,G__30807,G__30808,G__30809) : route_BANG_.call(null,G__30806,G__30807,G__30808,G__30809));
});
knoxx.backend.infra.routes.actors.actor_mailbox_self_list_route_BANG_ = (function knoxx$backend$infra$routes$actors$actor_mailbox_self_list_route_BANG_(app,runtime,config,deps){
var map__30907 = deps;
var map__30907__$1 = cljs.core.__destructure_map(map__30907);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30907__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30908 = app;
var G__30909 = "GET";
var G__30910 = "/api/actors/mailbox";
var G__30911 = (function (){var obj30913 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));

var actor_id = knoxx.backend.infra.routes.actors.current_actor_id(ctx);
var box = (await (async function (){var G__30927 = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["box"], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "inbox";
}
})());
var G__30927__$1 = (((G__30927 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30927)));
if((G__30927__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__30927__$1);
}
})());
var filters = (await (async function (){var G__30928 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["status"], 0)),new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.infra.routes.actors.query_param.cljs$core$IFn$_invoke$arity$variadic(request,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["limit"], 0))], null);
var G__30928__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(box,"outbox"))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30928,new cljs.core.Keyword(null,"source-actor-id","source-actor-id",-1224551760),actor_id):G__30928);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(box,"outbox")){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30928__$1,new cljs.core.Keyword(null,"target-actor-id","target-actor-id",1128799845),actor_id);
} else {
return G__30928__$1;
}
})());
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)))){
var G__30931 = reply;
var G__30932 = (403);
var G__30933 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"current actor is not available"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30931,G__30932,G__30933) : json_response_BANG_.call(null,G__30931,G__30932,G__30933));
} else {
var result = (await knoxx.backend.domain.actor.mailbox.list_entries_BANG_(runtime,filters));
var G__30934 = reply;
var G__30935 = (200);
var G__30936 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.actors.api_result(result),new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"box","box",1530920394),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(box,"outbox"))?"outbox":"inbox"),new cljs.core.Keyword(null,"actorId","actorId",989542370),actor_id], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30934,G__30935,G__30936) : json_response_BANG_.call(null,G__30934,G__30935,G__30936));
}
}catch (e30917){var err = e30917;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj30913;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30908,G__30909,G__30910,G__30911) : route_BANG_.call(null,G__30908,G__30909,G__30910,G__30911));
});
knoxx.backend.infra.routes.actors.actor_mailbox_self_ack_route_BANG_ = (function knoxx$backend$infra$routes$actors$actor_mailbox_self_ack_route_BANG_(app,runtime,config,deps){
var map__30943 = deps;
var map__30943__$1 = cljs.core.__destructure_map(map__30943);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30943__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30944 = app;
var G__30945 = "POST";
var G__30946 = "/api/actors/mailbox/:mailboxId/ack";
var G__30947 = (function (){var obj30949 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));

var actor_id = knoxx.backend.infra.routes.actors.current_actor_id(ctx);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)))){
var G__30957 = reply;
var G__30958 = (403);
var G__30959 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"current actor is not available"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30957,G__30958,G__30959) : json_response_BANG_.call(null,G__30957,G__30958,G__30959));
} else {
return knoxx.backend.infra.routes.actors.acknowledge_mailbox_BANG_.cljs$core$IFn$_invoke$arity$6(runtime,reply,error_response_BANG_,json_response_BANG_,(request["params"]["mailboxId"]),actor_id);
}
}catch (e30954){var err = e30954;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj30949;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30944,G__30945,G__30946,G__30947) : route_BANG_.call(null,G__30944,G__30945,G__30946,G__30947));
});
knoxx.backend.infra.routes.actors.register_actor_routes_BANG_ = (function knoxx$backend$infra$routes$actors$register_actor_routes_BANG_(app,runtime,config,deps){
knoxx.backend.infra.routes.actors.actor_mailbox_list_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.actors.actor_mailbox_ack_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.actors.actor_mailbox_retry_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.actors.actor_mailbox_self_list_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.actors.actor_mailbox_self_ack_route_BANG_(app,runtime,config,deps);

return null;
});

//# sourceMappingURL=knoxx.backend.infra.routes.actors.js.map
