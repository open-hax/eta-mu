import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.db.policy.js";
import "./knoxx.backend.runtime.state.js";
import "./shadow.esm.esm_import$node_crypto.js";
goog.provide('knoxx.backend.domain.actor.mailbox');
knoxx.backend.domain.actor.mailbox.mailbox_statuses = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 6, ["expired",null,"failed",null,"delivered",null,"acknowledged",null,"pending",null,"superseded",null], null), null);
knoxx.backend.domain.actor.mailbox.mailbox_delivery_modes = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["follow-up",null,"event",null,"direct-run",null,"steer",null,"inbox-only",null], null), null);
knoxx.backend.domain.actor.mailbox.nonblank = (function knoxx$backend$domain$actor$mailbox$nonblank(value){
var G__27353 = value;
var G__27353__$1 = (((G__27353 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27353)));
var G__27353__$2 = (((G__27353__$1 == null))?null:clojure.string.trim(G__27353__$1));
if((G__27353__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27353__$2);
}
});
knoxx.backend.domain.actor.mailbox.normalize_status = (function knoxx$backend$domain$actor$mailbox$normalize_status(status){
var status_STAR_ = (function (){var G__27354 = status;
var G__27354__$1 = (((G__27354 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27354)));
var G__27354__$2 = (((G__27354__$1 == null))?null:clojure.string.trim(G__27354__$1));
var G__27354__$3 = (((G__27354__$2 == null))?null:clojure.string.lower_case(G__27354__$2));
if((G__27354__$3 == null)){
return null;
} else {
return clojure.string.replace(G__27354__$3,/_/,"-");
}
})();
if(cljs.core.contains_QMARK_(knoxx.backend.domain.actor.mailbox.mailbox_statuses,status_STAR_)){
return status_STAR_;
} else {
return "pending";
}
});
knoxx.backend.domain.actor.mailbox.normalize_delivery_mode = (function knoxx$backend$domain$actor$mailbox$normalize_delivery_mode(mode){
var mode_STAR_ = (function (){var G__27355 = mode;
var G__27355__$1 = (((G__27355 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27355)));
var G__27355__$2 = (((G__27355__$1 == null))?null:clojure.string.trim(G__27355__$1));
var G__27355__$3 = (((G__27355__$2 == null))?null:clojure.string.lower_case(G__27355__$2));
if((G__27355__$3 == null)){
return null;
} else {
return clojure.string.replace(G__27355__$3,/_/,"-");
}
})();
var G__27357 = mode_STAR_;
switch (G__27357) {
case "message":
return "follow-up";

break;
case "followup":
return "follow-up";

break;
default:
if(cljs.core.contains_QMARK_(knoxx.backend.domain.actor.mailbox.mailbox_delivery_modes,mode_STAR_)){
return mode_STAR_;
} else {
return "follow-up";
}

}
});
knoxx.backend.domain.actor.mailbox.preview_text = (function knoxx$backend$domain$actor$mailbox$preview_text(content){
var text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = content;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if((((text).length) > (240))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.subs.cljs$core$IFn$_invoke$arity$3(text,(0),(240)))+"\u2026");
} else {
return text;
}
});
knoxx.backend.domain.actor.mailbox.mailbox_event_id = (function knoxx$backend$domain$actor$mailbox$mailbox_event_id(mailbox_id){
return (""+"actor-mailbox-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mailbox_id));
});
knoxx.backend.domain.actor.mailbox.new_mailbox_id = (function knoxx$backend$domain$actor$mailbox$new_mailbox_id(){
return shadow.esm.esm_import$node_crypto.randomUUID();
});
knoxx.backend.domain.actor.mailbox.source_from_context = (function knoxx$backend$domain$actor$mailbox$source_from_context(ctx){
var agent_spec = new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541).cljs$core$IFn$_invoke$arity$1(ctx);
var actor_id = (function (){var or__5162__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(agent_spec));
}
}
}
})();
var contract_id = (function (){var or__5162__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"contractId","contractId",710260199).cljs$core$IFn$_invoke$arity$1(agent_spec));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193).cljs$core$IFn$_invoke$arity$1(agent_spec));
}
}
}
})();
var G__27369 = cljs.core.PersistentArrayMap.EMPTY;
var G__27369__$1 = (cljs.core.truth_(actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27369,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id):G__27369);
var G__27369__$2 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(ctx)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27369__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(ctx))):G__27369__$1);
var G__27369__$3 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ctx)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27369__$2,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ctx))):G__27369__$2);
var G__27369__$4 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27369__$3,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx))):G__27369__$3);
if(cljs.core.truth_(contract_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27369__$4,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),contract_id);
} else {
return G__27369__$4;
}
});
knoxx.backend.domain.actor.mailbox.normalize_target_map = (function knoxx$backend$domain$actor$mailbox$normalize_target_map(target){
var kind = (function (){var or__5162__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"target-type","target-type",-1795727181).cljs$core$IFn$_invoke$arity$1(target));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target)))?"actor":(cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target)))?"session":(cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target)))?"conversation":null
)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"target","target",253001721).cljs$core$IFn$_invoke$arity$1(target));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "unknown";
}
}
}
})();
var G__27411 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"kind","kind",-717265803),kind], null);
var G__27411__$1 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27411,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target))):G__27411);
var G__27411__$2 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27411__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target))):G__27411__$1);
var G__27411__$3 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27411__$2,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target))):G__27411__$2);
var G__27411__$4 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27411__$3,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target))):G__27411__$3);
if(cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"target","target",253001721).cljs$core$IFn$_invoke$arity$1(target)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27411__$4,new cljs.core.Keyword(null,"address","address",559499426),knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"target","target",253001721).cljs$core$IFn$_invoke$arity$1(target)));
} else {
return G__27411__$4;
}
});
knoxx.backend.domain.actor.mailbox.mailbox_entry = (function knoxx$backend$domain$actor$mailbox$mailbox_entry(p__27412){
var map__27413 = p__27412;
var map__27413__$1 = cljs.core.__destructure_map(map__27413);
var target = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"target","target",253001721));
var content_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"content-ref","content-ref",1710065788));
var metadata = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"metadata","metadata",1799301597));
var next_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"next-at","next-at",1830929216));
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
var attempts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"attempts","attempts",1024246729));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"source","source",-433931539));
var delivery_mode = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"delivery-mode","delivery-mode",2042238834));
var preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"preview","preview",451279890));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27413__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var entry_id = (function (){var or__5162__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.actor.mailbox.new_mailbox_id();
}
})();
var G__27422 = new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344),entry_id,new cljs.core.Keyword("mailbox","kind","mailbox/kind",401992993),(function (){var or__5162__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(kind);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "actor-message";
}
})(),new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881),knoxx.backend.domain.actor.mailbox.normalize_status(status),new cljs.core.Keyword("mailbox","source","mailbox/source",-1264954567),(function (){var or__5162__auto__ = source;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),new cljs.core.Keyword("mailbox","target","mailbox/target",1100093613),knoxx.backend.domain.actor.mailbox.normalize_target_map((function (){var or__5162__auto__ = target;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()),new cljs.core.Keyword("mailbox","delivery","mailbox/delivery",1585980392),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),knoxx.backend.domain.actor.mailbox.normalize_delivery_mode(delivery_mode),new cljs.core.Keyword(null,"attempts","attempts",1024246729),(function (){var or__5162__auto__ = attempts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()], null),new cljs.core.Keyword("mailbox","content-ref","mailbox/content-ref",877031624),(function (){var or__5162__auto__ = content_ref;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),new cljs.core.Keyword("mailbox","metadata","mailbox/metadata",-1698257615),(function (){var or__5162__auto__ = metadata;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], null);
var G__27422__$1 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(preview))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27422,new cljs.core.Keyword("mailbox","preview","mailbox/preview",-512838338),knoxx.backend.domain.actor.mailbox.preview_text(preview)):G__27422);
var G__27422__$2 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(next_at))?cljs.core.assoc_in(G__27422__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("mailbox","delivery","mailbox/delivery",1585980392),new cljs.core.Keyword(null,"next-at","next-at",1830929216)], null),knoxx.backend.domain.actor.mailbox.nonblank(next_at)):G__27422__$1);
if(cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(expires_at))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27422__$2,new cljs.core.Keyword("mailbox","expires-at","mailbox/expires-at",-1256489474),knoxx.backend.domain.actor.mailbox.nonblank(expires_at));
} else {
return G__27422__$2;
}
});
knoxx.backend.domain.actor.mailbox.policy_db = (function knoxx$backend$domain$actor$mailbox$policy_db(runtime){
var or__5162__auto__ = new cljs.core.Keyword(null,"policy-context","policy-context",-10488283).cljs$core$IFn$_invoke$arity$1(runtime);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.runtime.state.current_policy_db();
}
});
/**
 * True only when the policy context can execute this namespace's SQL (an
 * injected :query! fn). The Mongo-only policy context (14-05 PG removal)
 * has no :query!, so durable mailbox persistence is disabled until the
 * actor_mailbox_* tables get a Mongo twin — entries still flow live with
 * :mailbox/durable? false.
 */
knoxx.backend.domain.actor.mailbox.database_enabled_QMARK_ = (function knoxx$backend$domain$actor$mailbox$database_enabled_QMARK_(runtime){
return cljs.core.boolean$(new cljs.core.Keyword(null,"query!","query!",1326722454).cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.actor.mailbox.policy_db(runtime)));
});
knoxx.backend.domain.actor.mailbox.query_BANG_ = (function knoxx$backend$domain$actor$mailbox$query_BANG_(runtime,sql,params){
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.policy_db(runtime);
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
return knoxx.backend.infra.db.policy.query_BANG_(db,sql,params);
} else {
return Promise.resolve(null);
}
});
knoxx.backend.domain.actor.mailbox.json_param = (function knoxx$backend$domain$actor$mailbox$json_param(value){
return JSON.stringify(cljs.core.clj__GT_js((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()));
});
knoxx.backend.domain.actor.mailbox.rows = (function knoxx$backend$domain$actor$mailbox$rows(result){
var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.domain.actor.mailbox.row__GT_route = (function knoxx$backend$domain$actor$mailbox$row__GT_route(row){
if(cljs.core.truth_(row)){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"last-seen-at","last-seen-at",1929467667),new cljs.core.Keyword(null,"last_seen_at","last_seen_at",89142124).cljs$core$IFn$_invoke$arity$1(row)], null);
} else {
return null;
}
});
knoxx.backend.domain.actor.mailbox.register_live_session_BANG_ = (function knoxx$backend$domain$actor$mailbox$register_live_session_BANG_(runtime,p__27426){
var map__27427 = p__27426;
var map__27427__$1 = cljs.core.__destructure_map(map__27427);
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var contract_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"source","source",-433931539));
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27427__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(actor_id);
if(cljs.core.truth_(temp__5823__auto__)){
var actor_id_STAR_ = temp__5823__auto__;
return knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"INSERT INTO actor_mailbox_routes (actor_id, conversation_id, session_id, run_id, contract_id, status, source_json, expires_at, last_seen_at)\n             VALUES ($1, $2, $3, $4, $5, 'active', $6::jsonb, COALESCE($7::timestamptz, NOW() + interval '30 minutes'), NOW())\n             ON CONFLICT (actor_id) DO UPDATE SET\n               conversation_id = EXCLUDED.conversation_id,\n               session_id = EXCLUDED.session_id,\n               run_id = EXCLUDED.run_id,\n               contract_id = EXCLUDED.contract_id,\n               status = 'active',\n               source_json = EXCLUDED.source_json,\n               expires_at = EXCLUDED.expires_at,\n               last_seen_at = NOW()\n             RETURNING *",new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [actor_id_STAR_,knoxx.backend.domain.actor.mailbox.nonblank(conversation_id),knoxx.backend.domain.actor.mailbox.nonblank(session_id),knoxx.backend.domain.actor.mailbox.nonblank(run_id),knoxx.backend.domain.actor.mailbox.nonblank(contract_id),knoxx.backend.domain.actor.mailbox.json_param(source),knoxx.backend.domain.actor.mailbox.nonblank(expires_at)], null));
} else {
return Promise.resolve(null);
}
});
knoxx.backend.domain.actor.mailbox.unregister_live_session_BANG_ = (function knoxx$backend$domain$actor$mailbox$unregister_live_session_BANG_(runtime,conversation_id){
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(conversation_id);
if(cljs.core.truth_(temp__5823__auto__)){
var conversation_id_STAR_ = temp__5823__auto__;
return knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"UPDATE actor_mailbox_routes\n             SET status = 'inactive', last_seen_at = NOW()\n             WHERE conversation_id = $1",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [conversation_id_STAR_], null));
} else {
return Promise.resolve(null);
}
});
knoxx.backend.domain.actor.mailbox.resolve_actor_session_BANG_ = (async function knoxx$backend$domain$actor$mailbox$resolve_actor_session_BANG_(runtime,actor_id){
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(actor_id);
if(cljs.core.truth_(temp__5823__auto__)){
var actor_id_STAR_ = temp__5823__auto__;
var result = (await knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"SELECT * FROM actor_mailbox_routes\n                 WHERE actor_id = $1\n                   AND status = 'active'\n                   AND (expires_at IS NULL OR expires_at > NOW())\n                 ORDER BY last_seen_at DESC\n                 LIMIT 1",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [actor_id_STAR_], null)));
var G__27429 = cljs.core.first(knoxx.backend.domain.actor.mailbox.rows(result));
if((G__27429 == null)){
return null;
} else {
return knoxx.backend.domain.actor.mailbox.row__GT_route(G__27429);
}
} else {
return null;
}
});
knoxx.backend.domain.actor.mailbox.create_entry_BANG_ = (async function knoxx$backend$domain$actor$mailbox$create_entry_BANG_(runtime,raw_entry){
var entry = knoxx.backend.domain.actor.mailbox.mailbox_entry(raw_entry);
var target = new cljs.core.Keyword("mailbox","target","mailbox/target",1100093613).cljs$core$IFn$_invoke$arity$1(entry);
var source = new cljs.core.Keyword("mailbox","source","mailbox/source",-1264954567).cljs$core$IFn$_invoke$arity$1(entry);
var delivery = new cljs.core.Keyword("mailbox","delivery","mailbox/delivery",1585980392).cljs$core$IFn$_invoke$arity$1(entry);
if((!(knoxx.backend.domain.actor.mailbox.database_enabled_QMARK_(runtime)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(entry,new cljs.core.Keyword("mailbox","durable?","mailbox/durable?",771149223),false);
} else {
(await knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"INSERT INTO actor_mailbox_entries\n                   (id, kind, status,\n                    source_actor_id, source_session_id, source_conversation_id, source_run_id, source_json,\n                    target_kind, target_actor_id, target_session_id, target_conversation_id, target_run_id, target_json,\n                    delivery_mode, attempts, next_at, expires_at,\n                    content_ref_json, metadata_json, preview)\n                   VALUES\n                   ($1::uuid, $2, $3,\n                    $4, $5, $6, $7, $8::jsonb,\n                    $9, $10, $11, $12, $13, $14::jsonb,\n                    $15, $16, $17::timestamptz, $18::timestamptz,\n                    $19::jsonb, $20::jsonb, $21)\n                   RETURNING *",new cljs.core.PersistentVector(null, 21, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","kind","mailbox/kind",401992993).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(source),knoxx.backend.domain.actor.mailbox.json_param(source),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(target),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(target),knoxx.backend.domain.actor.mailbox.json_param(target),new cljs.core.Keyword(null,"mode","mode",654403691).cljs$core$IFn$_invoke$arity$1(delivery),new cljs.core.Keyword(null,"attempts","attempts",1024246729).cljs$core$IFn$_invoke$arity$1(delivery),new cljs.core.Keyword(null,"next-at","next-at",1830929216).cljs$core$IFn$_invoke$arity$1(delivery),new cljs.core.Keyword("mailbox","expires-at","mailbox/expires-at",-1256489474).cljs$core$IFn$_invoke$arity$1(entry),knoxx.backend.domain.actor.mailbox.json_param(new cljs.core.Keyword("mailbox","content-ref","mailbox/content-ref",877031624).cljs$core$IFn$_invoke$arity$1(entry)),knoxx.backend.domain.actor.mailbox.json_param(new cljs.core.Keyword("mailbox","metadata","mailbox/metadata",-1698257615).cljs$core$IFn$_invoke$arity$1(entry)),new cljs.core.Keyword("mailbox","preview","mailbox/preview",-512838338).cljs$core$IFn$_invoke$arity$1(entry)], null)));

return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(entry,new cljs.core.Keyword("mailbox","durable?","mailbox/durable?",771149223),true);
}
});
knoxx.backend.domain.actor.mailbox.mark_delivery_BANG_ = (function knoxx$backend$domain$actor$mailbox$mark_delivery_BANG_(runtime,mailbox_id,status,p__27430){
var map__27431 = p__27430;
var map__27431__$1 = cljs.core.__destructure_map(map__27431);
var content_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27431__$1,new cljs.core.Keyword(null,"content-ref","content-ref",1710065788));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27431__$1,new cljs.core.Keyword(null,"error","error",-978969032));
var attempts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27431__$1,new cljs.core.Keyword(null,"attempts","attempts",1024246729));
var next_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27431__$1,new cljs.core.Keyword(null,"next-at","next-at",1830929216));
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(mailbox_id);
if(cljs.core.truth_(temp__5823__auto__)){
var mailbox_id_STAR_ = temp__5823__auto__;
if((!(knoxx.backend.domain.actor.mailbox.database_enabled_QMARK_(runtime)))){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344),mailbox_id_STAR_,new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881),knoxx.backend.domain.actor.mailbox.normalize_status(status),new cljs.core.Keyword("mailbox","durable?","mailbox/durable?",771149223),false], null));
} else {
return knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"UPDATE actor_mailbox_entries\n               SET status = $2,\n                   attempts = COALESCE($3, attempts),\n                   next_at = COALESCE($4::timestamptz, next_at),\n                   delivered_at = CASE WHEN $2 = 'delivered' THEN NOW() ELSE delivered_at END,\n                   acknowledged_at = CASE WHEN $2 = 'acknowledged' THEN NOW() ELSE acknowledged_at END,\n                   content_ref_json = COALESCE($5::jsonb, content_ref_json),\n                   last_error = $6,\n                   updated_at = NOW()\n               WHERE id = $1::uuid",new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [mailbox_id_STAR_,knoxx.backend.domain.actor.mailbox.normalize_status(status),attempts,knoxx.backend.domain.actor.mailbox.nonblank(next_at),(cljs.core.truth_(content_ref)?knoxx.backend.domain.actor.mailbox.json_param(content_ref):null),knoxx.backend.domain.actor.mailbox.nonblank(error)], null));
}
} else {
return Promise.resolve(null);
}
});
knoxx.backend.domain.actor.mailbox.mark_delivered_BANG_ = (function knoxx$backend$domain$actor$mailbox$mark_delivered_BANG_(runtime,mailbox_id,content_ref){
return knoxx.backend.domain.actor.mailbox.mark_delivery_BANG_(runtime,mailbox_id,"delivered",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content-ref","content-ref",1710065788),content_ref], null));
});
knoxx.backend.domain.actor.mailbox.mark_failed_BANG_ = (function knoxx$backend$domain$actor$mailbox$mark_failed_BANG_(runtime,mailbox_id,error){
return knoxx.backend.domain.actor.mailbox.mark_delivery_BANG_(runtime,mailbox_id,"failed",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(error))], null));
});
knoxx.backend.domain.actor.mailbox.json_value = (function knoxx$backend$domain$actor$mailbox$json_value(value){
if((value == null)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(cljs.core.vector_QMARK_(value)){
return value;
} else {
if(typeof value === 'string'){
try{return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(value),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e27434){var _ = e27434;
return cljs.core.PersistentArrayMap.EMPTY;
}} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(value))){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
}
}
}
});
knoxx.backend.domain.actor.mailbox.row__GT_entry = (function knoxx$backend$domain$actor$mailbox$row__GT_entry(row){
if(cljs.core.truth_(row)){
var source = knoxx.backend.domain.actor.mailbox.json_value(new cljs.core.Keyword(null,"source_json","source_json",836680895).cljs$core$IFn$_invoke$arity$1(row));
var target = knoxx.backend.domain.actor.mailbox.json_value(new cljs.core.Keyword(null,"target_json","target_json",790241715).cljs$core$IFn$_invoke$arity$1(row));
var delivery = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"delivery_mode","delivery_mode",1148525338).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"attempts","attempts",1024246729),new cljs.core.Keyword(null,"attempts","attempts",1024246729).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"next-at","next-at",1830929216),new cljs.core.Keyword(null,"next_at","next_at",1161402430).cljs$core$IFn$_invoke$arity$1(row)], null);
var content_ref = knoxx.backend.domain.actor.mailbox.json_value(new cljs.core.Keyword(null,"content_ref_json","content_ref_json",43452013).cljs$core$IFn$_invoke$arity$1(row));
var metadata = knoxx.backend.domain.actor.mailbox.json_value(new cljs.core.Keyword(null,"metadata_json","metadata_json",2009778443).cljs$core$IFn$_invoke$arity$1(row));
var G__27435 = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344),new cljs.core.Keyword("mailbox","kind","mailbox/kind",401992993),new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881),new cljs.core.Keyword("mailbox","created-at","mailbox/created-at",-1406815032),new cljs.core.Keyword("mailbox","content-ref","mailbox/content-ref",877031624),new cljs.core.Keyword("mailbox","delivery","mailbox/delivery",1585980392),new cljs.core.Keyword("mailbox","target","mailbox/target",1100093613),new cljs.core.Keyword("mailbox","metadata","mailbox/metadata",-1698257615),new cljs.core.Keyword("mailbox","updated-at","mailbox/updated-at",-779421100),new cljs.core.Keyword("mailbox","source","mailbox/source",-1264954567)],[new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(row),content_ref,delivery,target,metadata,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(row),source]);
var G__27435__$1 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"preview","preview",451279890).cljs$core$IFn$_invoke$arity$1(row)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27435,new cljs.core.Keyword("mailbox","preview","mailbox/preview",-512838338),new cljs.core.Keyword(null,"preview","preview",451279890).cljs$core$IFn$_invoke$arity$1(row)):G__27435);
var G__27435__$2 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"last_error","last_error",153231245).cljs$core$IFn$_invoke$arity$1(row)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27435__$1,new cljs.core.Keyword("mailbox","last-error","mailbox/last-error",997868945),new cljs.core.Keyword(null,"last_error","last_error",153231245).cljs$core$IFn$_invoke$arity$1(row)):G__27435__$1);
var G__27435__$3 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"delivered_at","delivered_at",-111493400).cljs$core$IFn$_invoke$arity$1(row)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27435__$2,new cljs.core.Keyword("mailbox","delivered-at","mailbox/delivered-at",-1353109945),new cljs.core.Keyword(null,"delivered_at","delivered_at",-111493400).cljs$core$IFn$_invoke$arity$1(row)):G__27435__$2);
var G__27435__$4 = (cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"acknowledged_at","acknowledged_at",-583975125).cljs$core$IFn$_invoke$arity$1(row)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27435__$3,new cljs.core.Keyword("mailbox","acknowledged-at","mailbox/acknowledged-at",1312417597),new cljs.core.Keyword(null,"acknowledged_at","acknowledged_at",-583975125).cljs$core$IFn$_invoke$arity$1(row)):G__27435__$3);
if(cljs.core.truth_(knoxx.backend.domain.actor.mailbox.nonblank(new cljs.core.Keyword(null,"expires_at","expires_at",-423028958).cljs$core$IFn$_invoke$arity$1(row)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27435__$4,new cljs.core.Keyword("mailbox","expires-at","mailbox/expires-at",-1256489474),new cljs.core.Keyword(null,"expires_at","expires_at",-423028958).cljs$core$IFn$_invoke$arity$1(row));
} else {
return G__27435__$4;
}
} else {
return null;
}
});
knoxx.backend.domain.actor.mailbox.add_filter = (function knoxx$backend$domain$actor$mailbox$add_filter(p__27436,p__27437){
var map__27438 = p__27436;
var map__27438__$1 = cljs.core.__destructure_map(map__27438);
var clauses = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27438__$1,new cljs.core.Keyword(null,"clauses","clauses",1454841241));
var params = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27438__$1,new cljs.core.Keyword(null,"params","params",710516235));
var vec__27439 = p__27437;
var clause_fn = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27439,(0),null);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27439,(1),null);
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(value);
if(cljs.core.truth_(temp__5823__auto__)){
var value_STAR_ = temp__5823__auto__;
var idx = (cljs.core.count(params) + (1));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"clauses","clauses",1454841241),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(clauses,(clause_fn.cljs$core$IFn$_invoke$arity$1 ? clause_fn.cljs$core$IFn$_invoke$arity$1(idx) : clause_fn.call(null,idx))),new cljs.core.Keyword(null,"params","params",710516235),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(params,value_STAR_)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"clauses","clauses",1454841241),clauses,new cljs.core.Keyword(null,"params","params",710516235),params], null);
}
});
knoxx.backend.domain.actor.mailbox.positive_int = (function knoxx$backend$domain$actor$mailbox$positive_int(value,fallback,max_value){
var parsed = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),(10));
if(cljs.core.truth_(isNaN(parsed))){
return fallback;
} else {
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(max_value,cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),parsed));
}
});
knoxx.backend.domain.actor.mailbox.list_entries_BANG_ = (async function knoxx$backend$domain$actor$mailbox$list_entries_BANG_(runtime,p__27442){
var map__27443 = p__27442;
var map__27443__$1 = cljs.core.__destructure_map(map__27443);
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27443__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var target_actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27443__$1,new cljs.core.Keyword(null,"target-actor-id","target-actor-id",1128799845));
var target_session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27443__$1,new cljs.core.Keyword(null,"target-session-id","target-session-id",-1929186990));
var source_actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27443__$1,new cljs.core.Keyword(null,"source-actor-id","source-actor-id",-1224551760));
var source_run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27443__$1,new cljs.core.Keyword(null,"source-run-id","source-run-id",-2000058256));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27443__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
if((!(knoxx.backend.domain.actor.mailbox.database_enabled_QMARK_(runtime)))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"entries","entries",-86943161),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"durable?","durable?",2084525683),false], null);
} else {
var map__27445 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.actor.mailbox.add_filter,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"clauses","clauses",1454841241),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"params","params",710516235),cljs.core.PersistentVector.EMPTY], null),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (idx){
return (""+"status = $"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx));
}),status], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (idx){
return (""+"target_actor_id = $"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx));
}),target_actor_id], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (idx){
return (""+"target_session_id = $"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx));
}),target_session_id], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (idx){
return (""+"source_actor_id = $"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx));
}),source_actor_id], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (idx){
return (""+"source_run_id = $"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx));
}),source_run_id], null)], null));
var map__27445__$1 = cljs.core.__destructure_map(map__27445);
var clauses = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27445__$1,new cljs.core.Keyword(null,"clauses","clauses",1454841241));
var params = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27445__$1,new cljs.core.Keyword(null,"params","params",710516235));
var limit_STAR_ = knoxx.backend.domain.actor.mailbox.positive_int(limit,(50),(500));
var limit_idx = (cljs.core.count(params) + (1));
var where_sql = ((cljs.core.seq(clauses))?(""+" WHERE "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(" AND ",clauses))):"");
var result = (await knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,(""+"SELECT * FROM actor_mailbox_entries"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(where_sql)+" ORDER BY created_at DESC LIMIT $"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(limit_idx)),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(params,limit_STAR_)));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"entries","entries",-86943161),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.actor.mailbox.row__GT_entry,knoxx.backend.domain.actor.mailbox.rows(result)),new cljs.core.Keyword(null,"durable?","durable?",2084525683),true], null);
}
});
knoxx.backend.domain.actor.mailbox.acknowledge_entry_impl_BANG_ = (async function knoxx$backend$domain$actor$mailbox$acknowledge_entry_impl_BANG_(runtime,mailbox_id,target_actor_id){
var temp__5823__auto__ = knoxx.backend.domain.actor.mailbox.nonblank(mailbox_id);
if(cljs.core.truth_(temp__5823__auto__)){
var mailbox_id_STAR_ = temp__5823__auto__;
if((!(knoxx.backend.domain.actor.mailbox.database_enabled_QMARK_(runtime)))){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344),mailbox_id_STAR_,new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881),"acknowledged",new cljs.core.Keyword("mailbox","durable?","mailbox/durable?",771149223),false], null);
} else {
var result = (await knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"UPDATE actor_mailbox_entries\n                    SET status = 'acknowledged', acknowledged_at = NOW(), updated_at = NOW()\n                    WHERE id = $1::uuid\n                      AND ($2::text IS NULL OR target_actor_id = $2)\n                    RETURNING *",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mailbox_id_STAR_,knoxx.backend.domain.actor.mailbox.nonblank(target_actor_id)], null)));
var G__27449 = cljs.core.first(knoxx.backend.domain.actor.mailbox.rows(result));
if((G__27449 == null)){
return null;
} else {
return knoxx.backend.domain.actor.mailbox.row__GT_entry(G__27449);
}
}
} else {
throw (new Error("mailbox id is required"));
}
});
knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_ = (function knoxx$backend$domain$actor$mailbox$acknowledge_entry_BANG_(var_args){
var G__27451 = arguments.length;
switch (G__27451) {
case 2:
return knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (runtime,mailbox_id){
return knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,mailbox_id,null);
}));

(knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,mailbox_id,target_actor_id){
return knoxx.backend.domain.actor.mailbox.acknowledge_entry_impl_BANG_(runtime,mailbox_id,target_actor_id);
}));

(knoxx.backend.domain.actor.mailbox.acknowledge_entry_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.actor.mailbox.retry_request_event = (function knoxx$backend$domain$actor$mailbox$retry_request_event(entry){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.actor.mailbox.mailbox_event_id(new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344).cljs$core$IFn$_invoke$arity$1(entry)))+"-retry-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(Date.now())),new cljs.core.Keyword(null,"sourceKind","sourceKind",-1570414889),"actor",new cljs.core.Keyword(null,"eventKind","eventKind",2138897648),"actors.mailbox.retry-requested",new cljs.core.Keyword(null,"payload","payload",-383036092),new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"mailboxId","mailboxId",-395830287),new cljs.core.Keyword("mailbox","id","mailbox/id",-1664073344).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword("mailbox","status","mailbox/status",-754673881).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"target","target",253001721),new cljs.core.Keyword("mailbox","target","mailbox/target",1100093613).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword("mailbox","source","mailbox/source",-1264954567).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"delivery","delivery",-1844470516),new cljs.core.Keyword("mailbox","delivery","mailbox/delivery",1585980392).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"contentRef","contentRef",625680927),new cljs.core.Keyword("mailbox","content-ref","mailbox/content-ref",877031624).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword("mailbox","metadata","mailbox/metadata",-1698257615).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"preview","preview",451279890),new cljs.core.Keyword("mailbox","preview","mailbox/preview",-512838338).cljs$core$IFn$_invoke$arity$1(entry)], null)], null);
});
knoxx.backend.domain.actor.mailbox.retry_eligible_BANG_ = (async function knoxx$backend$domain$actor$mailbox$retry_eligible_BANG_(runtime,p__27455){
var map__27456 = p__27455;
var map__27456__$1 = cljs.core.__destructure_map(map__27456);
var mailbox_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27456__$1,new cljs.core.Keyword(null,"mailbox-id","mailbox-id",796861681));
var statuses = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27456__$1,new cljs.core.Keyword(null,"statuses","statuses",710922046));
var max_attempts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27456__$1,new cljs.core.Keyword(null,"max-attempts","max-attempts",1686564297));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27456__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var delay_seconds = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27456__$1,new cljs.core.Keyword(null,"delay-seconds","delay-seconds",-1391031133));
if((!(knoxx.backend.domain.actor.mailbox.database_enabled_QMARK_(runtime)))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"entries","entries",-86943161),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"durable?","durable?",2084525683),false], null);
} else {
var statuses_STAR_ = (await (async function (){var or__5162__auto__ = cljs.core.seq(statuses);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["pending","failed"], null);
}
})());
var max_attempts_STAR_ = knoxx.backend.domain.actor.mailbox.positive_int(max_attempts,(5),(100));
var limit_STAR_ = knoxx.backend.domain.actor.mailbox.positive_int(limit,(25),(200));
var delay_seconds_STAR_ = (await (async function (){var parsed = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = delay_seconds;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()))),(10));
if(cljs.core.truth_(isNaN(parsed))){
return (0);
} else {
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),parsed);
}
})());
var result = (await knoxx.backend.domain.actor.mailbox.query_BANG_(runtime,"WITH candidates AS (\n                     SELECT id\n                     FROM actor_mailbox_entries\n                     WHERE status = ANY($1::text[])\n                       AND attempts < $2\n                       AND (next_at IS NULL OR next_at <= NOW())\n                       AND (expires_at IS NULL OR expires_at > NOW())\n                       AND ($5::uuid IS NULL OR id = $5::uuid)\n                     ORDER BY created_at ASC\n                     LIMIT $3\n                     FOR UPDATE SKIP LOCKED\n                   )\n                   UPDATE actor_mailbox_entries m\n                   SET status = 'pending',\n                       attempts = m.attempts + 1,\n                       next_at = CASE WHEN $4::int > 0 THEN NOW() + ($4::text || ' seconds')::interval ELSE NULL END,\n                       last_error = NULL,\n                       updated_at = NOW()\n                   FROM candidates\n                   WHERE m.id = candidates.id\n                   RETURNING m.*",new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [statuses_STAR_,max_attempts_STAR_,limit_STAR_,delay_seconds_STAR_,knoxx.backend.domain.actor.mailbox.nonblank(mailbox_id)], null)));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"entries","entries",-86943161),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.actor.mailbox.row__GT_entry,knoxx.backend.domain.actor.mailbox.rows(result)),new cljs.core.Keyword(null,"durable?","durable?",2084525683),true], null);
}
});

//# sourceMappingURL=knoxx.backend.domain.actor.mailbox.js.map
