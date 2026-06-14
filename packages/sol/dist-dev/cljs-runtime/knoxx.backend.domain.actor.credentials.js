import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.agent_context.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.db.policy.js";
goog.provide('knoxx.backend.domain.actor.credentials');
knoxx.backend.domain.actor.credentials.current_actor_id = (function knoxx$backend$domain$actor$credentials$current_actor_id(){
var ctx = (function (){var or__5162__auto__ = (knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.get_context.call(null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var spec = new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541).cljs$core$IFn$_invoke$arity$1(ctx);
var G__27486 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(ctx);
}
}
}
}
}
})();
var G__27486__$1 = (((G__27486 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27486)));
var G__27486__$2 = (((G__27486__$1 == null))?null:clojure.string.trim(G__27486__$1));
if((G__27486__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27486__$2);
}
});
knoxx.backend.domain.actor.credentials.normalize_credential = (function knoxx$backend$domain$actor$credentials$normalize_credential(payload){
return new cljs.core.Keyword(null,"credential","credential",-1519132150).cljs$core$IFn$_invoke$arity$1(payload);
});
knoxx.backend.domain.actor.credentials.get_credential_BANG_ = (async function knoxx$backend$domain$actor$credentials$get_credential_BANG_(runtime,provider){
var actor_id = knoxx.backend.domain.actor.credentials.current_actor_id();
var db = knoxx.backend.infra.auth.authz.policy_db(runtime);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)))){
throw (new Error((""+"No current actor_id is available for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)+" credentials. Start the agent with an actor_id and configure it in Admin \u2192 Actors.")));
} else {
if((db == null)){
throw (new Error("Actor credentials require the Knoxx policy database."));
} else {
var result = (await knoxx.backend.infra.db.policy.get_actor_credential_BANG_(db,actor_id,provider));
var temp__5823__auto__ = knoxx.backend.domain.actor.credentials.normalize_credential(result);
if(cljs.core.truth_(temp__5823__auto__)){
var credential = temp__5823__auto__;
return credential;
} else {
throw (new Error((""+"No active "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)+" credentials configured for actor "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)+". Configure them in Admin \u2192 Actors.")));
}

}
}
});
knoxx.backend.domain.actor.credentials.secret_value = (function knoxx$backend$domain$actor$credentials$secret_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27517 = arguments.length;
var i__5898__auto___27518 = (0);
while(true){
if((i__5898__auto___27518 < len__5897__auto___27517)){
args__5903__auto__.push((arguments[i__5898__auto___27518]));

var G__27519 = (i__5898__auto___27518 + (1));
i__5898__auto___27518 = G__27519;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.domain.actor.credentials.secret_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.domain.actor.credentials.secret_value.cljs$core$IFn$_invoke$arity$variadic = (function (credential,keys){
var secrets = new cljs.core.Keyword(null,"secretJson","secretJson",1807839704).cljs$core$IFn$_invoke$arity$1(credential);
return cljs.core.some((function (k){
var G__27505 = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(secrets,k);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(secrets,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(secrets,cljs.core.name(k));
}
}
})();
var G__27505__$1 = (((G__27505 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27505)));
var G__27505__$2 = (((G__27505__$1 == null))?null:clojure.string.trim(G__27505__$1));
if((G__27505__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27505__$2);
}
}),keys);
}));

(knoxx.backend.domain.actor.credentials.secret_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.domain.actor.credentials.secret_value.cljs$lang$applyTo = (function (seq27500){
var G__27501 = cljs.core.first(seq27500);
var seq27500__$1 = cljs.core.next(seq27500);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27501,seq27500__$1);
}));


//# sourceMappingURL=knoxx.backend.domain.actor.credentials.js.map
