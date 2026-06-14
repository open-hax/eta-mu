import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.shape.parse.js";
goog.provide('knoxx.backend.shape.memory_sessions');
knoxx.backend.shape.memory_sessions.max_session_list_page_size = (80);
knoxx.backend.shape.memory_sessions.max_session_list_upstream_page_size = (50);
knoxx.backend.shape.memory_sessions.session_list_limit = (function knoxx$backend$shape$memory_sessions$session_list_limit(value){
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.memory_sessions.max_session_list_page_size,cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(function (){var or__5162__auto__ = knoxx.backend.shape.parse.parse_positive_int(value);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (12);
}
})()));
});
knoxx.backend.shape.memory_sessions.session_list_upstream_page_size = (function knoxx$backend$shape$memory_sessions$session_list_upstream_page_size(limit,offset){
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.memory_sessions.max_session_list_upstream_page_size,cljs.core.max.cljs$core$IFn$_invoke$arity$2((10),((cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),offset) + cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),limit)) + (1))));
});
knoxx.backend.shape.memory_sessions.normalized_actor_id = (function knoxx$backend$shape$memory_sessions$normalized_actor_id(value){
var G__29372 = value;
var G__29372__$1 = (((G__29372 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29372)));
var G__29372__$2 = (((G__29372__$1 == null))?null:clojure.string.trim(G__29372__$1));
if((G__29372__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29372__$2);
}
});
knoxx.backend.shape.memory_sessions.normalized_actor_ids = (function knoxx$backend$shape$memory_sessions$normalized_actor_ids(value){
var items = (((value == null))?cljs.core.PersistentVector.EMPTY:((typeof value === 'string')?clojure.string.split.cljs$core$IFn$_invoke$arity$2(value,/,/):(cljs.core.truth_(cljs.core.array_QMARK_(value))?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(value):((cljs.core.sequential_QMARK_(value))?value:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [value], null)
))));
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.memory_sessions.normalized_actor_id,items)));
});
knoxx.backend.shape.memory_sessions.query_options = (function knoxx$backend$shape$memory_sessions$query_options(query){
var limit = knoxx.backend.shape.memory_sessions.session_list_limit((query["limit"]));
var actor_id = (function (){var G__29408 = (function (){var or__5162__auto__ = (query["actorId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (query["actor"]);
}
})();
if((G__29408 == null)){
return null;
} else {
return knoxx.backend.shape.memory_sessions.normalized_actor_id(G__29408);
}
})();
var exclude_actor_ids = knoxx.backend.shape.memory_sessions.normalized_actor_ids((function (){var or__5162__auto__ = (query["excludeActorIds"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (query["excludeActorId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (query["excludeActors"]);
}
}
})());
var contract_id = (function (){var G__29422 = (function (){var or__5162__auto__ = (query["contractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (query["contract_id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (query["contract"]);
}
}
})();
if((G__29422 == null)){
return null;
} else {
return knoxx.backend.shape.memory_sessions.normalized_actor_id(G__29422);
}
})();
var offset_raw = (query["offset"]);
var offset_parsed = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = offset_raw;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "0";
}
})())),(10));
var offset = (cljs.core.truth_((function (){var and__5160__auto__ = Number.isFinite(offset_parsed);
if(cljs.core.truth_(and__5160__auto__)){
return (offset_parsed >= (0));
} else {
return and__5160__auto__;
}
})())?offset_parsed:(0));
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"offset","offset",296498311),offset,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733),exclude_actor_ids,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),contract_id,new cljs.core.Keyword(null,"upstream-page-size","upstream-page-size",-19639857),knoxx.backend.shape.memory_sessions.session_list_upstream_page_size(limit,offset),new cljs.core.Keyword(null,"needed-count","needed-count",-1582276084),((offset + cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),limit)) + (1))], null);
});
knoxx.backend.shape.memory_sessions.page_state = (function knoxx$backend$shape$memory_sessions$page_state(value,p__29443,cache){
var map__29445 = p__29443;
var map__29445__$1 = cljs.core.__destructure_map(map__29445);
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29445__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29445__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29445__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var exclude_actor_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29445__$1,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733));
var contract_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29445__$1,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
var map__29449 = value;
var map__29449__$1 = cljs.core.__destructure_map(map__29449);
var rows = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29449__$1,new cljs.core.Keyword(null,"rows","rows",850049680));
var has_more = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29449__$1,new cljs.core.Keyword(null,"has_more","has_more",1574898779));
var all_rows = cljs.core.vec(rows);
var visible_total = cljs.core.count(all_rows);
var page_rows = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),limit),cljs.core.drop.cljs$core$IFn$_invoke$arity$2(offset,all_rows)));
var page_has_more = (function (){var or__5162__auto__ = has_more;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (visible_total > (offset + cljs.core.count(page_rows)));
}
})();
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"page-rows","page-rows",-1632298366),new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.Keyword(null,"offset","offset",296498311),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"cache","cache",-1237023054),new cljs.core.Keyword(null,"visible-total","visible-total",1330681107),new cljs.core.Keyword(null,"page-has-more","page-has-more",1421769724)],[page_rows,limit,offset,actor_id,exclude_actor_ids,contract_id,cache,visible_total,page_has_more]);
});
knoxx.backend.shape.memory_sessions.response_payload = (function knoxx$backend$shape$memory_sessions$response_payload(p__29464){
var map__29465 = p__29464;
var map__29465__$1 = cljs.core.__destructure_map(map__29465);
var rows = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29465__$1,new cljs.core.Keyword(null,"rows","rows",850049680));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29465__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29465__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var page_has_more = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29465__$1,new cljs.core.Keyword(null,"page-has-more","page-has-more",1421769724));
var visible_total = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29465__$1,new cljs.core.Keyword(null,"visible-total","visible-total",1330681107));
var cache = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29465__$1,new cljs.core.Keyword(null,"cache","cache",-1237023054));
var G__29469 = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"rows","rows",850049680),rows,new cljs.core.Keyword(null,"offset","offset",296498311),offset,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"has_more","has_more",1574898779),page_has_more,new cljs.core.Keyword(null,"cache","cache",-1237023054),cache], null);
if(cljs.core.not(page_has_more)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29469,new cljs.core.Keyword(null,"total","total",1916810418),visible_total);
} else {
return G__29469;
}
});

//# sourceMappingURL=knoxx.backend.shape.memory_sessions.js.map
