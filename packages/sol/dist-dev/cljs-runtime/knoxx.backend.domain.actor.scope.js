import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.actor.scope');
knoxx.backend.domain.actor.scope.wildcard_actor = new cljs.core.Keyword(null,"*","*",-1294732318);
knoxx.backend.domain.actor.scope.legacy_chat_actor_id = "chat_primary";
knoxx.backend.domain.actor.scope.normalize_actor_claim = (function knoxx$backend$domain$actor$scope$normalize_actor_claim(value){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value,knoxx.backend.domain.actor.scope.wildcard_actor)){
return knoxx.backend.domain.actor.scope.wildcard_actor;
} else {
if((value instanceof cljs.core.Keyword)){
var normalized = (function (){var G__17229 = value;
var G__17229__$1 = (((G__17229 == null))?null:cljs.core.name(G__17229));
var G__17229__$2 = (((G__17229__$1 == null))?null:clojure.string.trim(G__17229__$1));
if((G__17229__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__17229__$2);
}
})();
if(cljs.core.truth_(normalized)){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(normalized,"*")){
return knoxx.backend.domain.actor.scope.wildcard_actor;
} else {
return normalized;
}
} else {
return null;
}
} else {
if(typeof value === 'string'){
var normalized = (function (){var G__17235 = value;
var G__17235__$1 = (((G__17235 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__17235)));
var G__17235__$2 = (((G__17235__$1 == null))?null:clojure.string.trim(G__17235__$1));
if((G__17235__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__17235__$2);
}
})();
if(cljs.core.truth_(normalized)){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(normalized,"*")){
return knoxx.backend.domain.actor.scope.wildcard_actor;
} else {
return normalized;
}
} else {
return null;
}
} else {
if((value == null)){
return null;
} else {
var G__17243 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
return (knoxx.backend.domain.actor.scope.normalize_actor_claim.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.actor.scope.normalize_actor_claim.cljs$core$IFn$_invoke$arity$1(G__17243) : knoxx.backend.domain.actor.scope.normalize_actor_claim.call(null,G__17243));

}
}
}
}
});
knoxx.backend.domain.actor.scope.normalize_actor_claims = (function knoxx$backend$domain$actor$scope$normalize_actor_claims(value){
var items = ((cljs.core.set_QMARK_(value))?value:((cljs.core.sequential_QMARK_(value))?value:(((value == null))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [value], null)
)));
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.actor.scope.normalize_actor_claim),items);
});
knoxx.backend.domain.actor.scope.normalized_contract_actors = (function knoxx$backend$domain$actor$scope$normalized_contract_actors(var_args){
var G__17256 = arguments.length;
switch (G__17256) {
case 1:
return knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$1 = (function (contract){
return knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$2(contract,null);
}));

(knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$2 = (function (contract,missing_fallback_actor_id){
var declared = knoxx.backend.domain.actor.scope.normalize_actor_claims(new cljs.core.Keyword("contract","actors","contract/actors",-1138019932).cljs$core$IFn$_invoke$arity$1(contract));
var legacy = knoxx.backend.domain.actor.scope.normalize_actor_claim(new cljs.core.Keyword("contract","actor","contract/actor",1959324173).cljs$core$IFn$_invoke$arity$1(contract));
var merged = (function (){var G__17275 = declared;
var G__17275__$1 = (cljs.core.truth_(legacy)?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__17275,legacy):G__17275);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("knoxx_default",(function (){var G__17278 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(contract);
var G__17278__$1 = (((G__17278 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__17278)));
if((G__17278__$1 == null)){
return null;
} else {
return clojure.string.trim(G__17278__$1);
}
})())){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__17275__$1,knoxx.backend.domain.actor.scope.wildcard_actor);
} else {
return G__17275__$1;
}
})();
if(cljs.core.seq(merged)){
return merged;
} else {
var fallback = knoxx.backend.domain.actor.scope.normalize_actor_claim(missing_fallback_actor_id);
if(cljs.core.truth_(fallback)){
return cljs.core.PersistentHashSet.createAsIfByAssoc([fallback]);
} else {
return cljs.core.PersistentHashSet.EMPTY;
}

}
}));

(knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.actor.scope.agent_role_claims = (function knoxx$backend$domain$actor$scope$agent_role_claims(contract){
var legacy_roles = (function (){var or__5162__auto__ = new cljs.core.Keyword("actor","roles","actor/roles",186081855).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var agent_roles = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"roles","roles",143379530)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var agent_role = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"role","role",-736691072)], null));
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(legacy_roles,agent_roles,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([((cljs.core.sequential_QMARK_(agent_role))?agent_role:(cljs.core.truth_(agent_role)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [agent_role], null):cljs.core.PersistentVector.EMPTY
))], 0))));
});
knoxx.backend.domain.actor.scope.normalize_agent_contract = (function knoxx$backend$domain$actor$scope$normalize_agent_contract(contract){
if((!(cljs.core.map_QMARK_(contract)))){
return contract;
} else {
var actors = knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$1(contract);
var G__17292 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.Keyword("contract","actor","contract/actor",1959324173));
if(cljs.core.seq(actors)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__17292,new cljs.core.Keyword("contract","actors","contract/actors",-1138019932),actors);
} else {
return G__17292;
}
}
});
knoxx.backend.domain.actor.scope.actor_allowed_QMARK_ = (function knoxx$backend$domain$actor$scope$actor_allowed_QMARK_(actors,actor_id){
var claims = knoxx.backend.domain.actor.scope.normalize_actor_claims(actors);
var wanted = knoxx.backend.domain.actor.scope.normalize_actor_claim(actor_id);
var or__5162__auto__ = cljs.core.contains_QMARK_(claims,knoxx.backend.domain.actor.scope.wildcard_actor);
if(or__5162__auto__){
return or__5162__auto__;
} else {
var and__5160__auto__ = wanted;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(claims,wanted);
} else {
return and__5160__auto__;
}
}
});
knoxx.backend.domain.actor.scope.effective_actor_id = (function knoxx$backend$domain$actor$scope$effective_actor_id(actors,requested_actor_id,default_actor_id){
var claims = knoxx.backend.domain.actor.scope.normalize_actor_claims(actors);
var requested = knoxx.backend.domain.actor.scope.normalize_actor_claim(requested_actor_id);
var fallback = knoxx.backend.domain.actor.scope.normalize_actor_claim(default_actor_id);
var concrete_claims = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.createAsIfByAssoc([knoxx.backend.domain.actor.scope.wildcard_actor]),claims)));
if(cljs.core.truth_((function (){var and__5160__auto__ = requested;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(claims,requested);
} else {
return and__5160__auto__;
}
})())){
return requested;
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = fallback;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(claims,fallback);
} else {
return and__5160__auto__;
}
})())){
return fallback;
} else {
if(cljs.core.seq(concrete_claims)){
return cljs.core.first(concrete_claims);
} else {
return fallback;

}
}
}
});
knoxx.backend.domain.actor.scope.actor_claims__GT_wire = (function knoxx$backend$domain$actor$scope$actor_claims__GT_wire(actors){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (claim){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(claim,knoxx.backend.domain.actor.scope.wildcard_actor)){
return "*";
} else {
return claim;
}
}),knoxx.backend.domain.actor.scope.normalize_actor_claims(actors))));
});
/**
 * Resolve the default actor id for a membership with the given role slugs.
 */
knoxx.backend.domain.actor.scope.default_membership_actor_id = (function knoxx$backend$domain$actor$scope$default_membership_actor_id(role_slugs){
var normalized_slugs = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__17303_SHARP_){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__17303_SHARP_)),/-/,"_");
}),role_slugs));
if(cljs.core.contains_QMARK_(normalized_slugs,"system_admin")){
return "system_admin";
} else {
return "workspace_user";
}
});

//# sourceMappingURL=knoxx.backend.domain.actor.scope.js.map
