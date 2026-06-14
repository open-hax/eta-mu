import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.db.policy.js";
goog.provide('knoxx.backend.infra.routes.users.admin');
knoxx.backend.infra.routes.users.admin.body_map = (function knoxx$backend$infra$routes$users$admin$body_map(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.routes.users.admin.vec_value = (function knoxx$backend$infra$routes$users$admin$vec_value(value){
return cljs.core.vec((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
});
knoxx.backend.infra.routes.users.admin.param_value = (function knoxx$backend$infra$routes$users$admin$param_value(request,key){
var or__5162__auto__ = (request["params"][key]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
});
knoxx.backend.infra.routes.users.admin.user_payload = (function knoxx$backend$infra$routes$users$admin$user_payload(body,org_id){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"membership-status","membership-status",794952258),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"role-ids","role-ids",652985101),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),new cljs.core.Keyword(null,"is-default","is-default",1401171070)],[new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(body),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"membershipStatus","membershipStatus",639189251).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})(),knoxx.backend.infra.routes.users.admin.vec_value((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["knowledge_worker"], null);
}
})()),new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(body),org_id,knoxx.backend.infra.routes.users.admin.vec_value(new cljs.core.Keyword(null,"roleIds","roleIds",-69584679).cljs$core$IFn$_invoke$arity$1(body)),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})(),new cljs.core.Keyword(null,"externalSubject","externalSubject",-1176915620).cljs$core$IFn$_invoke$arity$1(body),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(body);
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"authProvider","authProvider",1745264718).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "local";
}
})(),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"isDefault","isDefault",809666532).cljs$core$IFn$_invoke$arity$1(body),false)]);
});
knoxx.backend.infra.routes.users.admin.actor_update_payload = (function knoxx$backend$infra$routes$users$admin$actor_update_payload(body){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),knoxx.backend.infra.routes.users.admin.vec_value(new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270).cljs$core$IFn$_invoke$arity$1(body))], null);
});
knoxx.backend.infra.routes.users.admin.credential_payload = (function knoxx$backend$infra$routes$users$admin$credential_payload(body,provider){
var secret_json = new cljs.core.Keyword(null,"secretJson","secretJson",1807839704).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_((function (){var and__5160__auto__ = secret_json;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core.map_QMARK_(secret_json)) && (cljs.core.seq(secret_json)));
} else {
return and__5160__auto__;
}
})())){
} else {
throw (new Error("secretJson is required and must be a non-empty object"));
}

return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"provider","provider",-302056900),provider,new cljs.core.Keyword(null,"kind","kind",-717265803),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "credential";
}
})(),new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778),new cljs.core.Keyword(null,"accountIdentifier","accountIdentifier",-2043083613).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"secret-json","secret-json",-436252008),secret_json,new cljs.core.Keyword(null,"status","status",-1997798413),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})()], null);
});
knoxx.backend.infra.routes.users.admin.membership_roles_payload = (function knoxx$backend$infra$routes$users$admin$membership_roles_payload(body){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"role-ids","role-ids",652985101),knoxx.backend.infra.routes.users.admin.vec_value(new cljs.core.Keyword(null,"roleIds","roleIds",-69584679).cljs$core$IFn$_invoke$arity$1(body)),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),knoxx.backend.infra.routes.users.admin.vec_value(new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270).cljs$core$IFn$_invoke$arity$1(body)),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"replace","replace",-786587770),((cljs.core.contains_QMARK_(body,new cljs.core.Keyword(null,"replace","replace",-786587770)))?new cljs.core.Keyword(null,"replace","replace",-786587770).cljs$core$IFn$_invoke$arity$1(body):true)], null);
});
knoxx.backend.infra.routes.users.admin.require_org_id_BANG_ = (function knoxx$backend$infra$routes$users$admin$require_org_id_BANG_(http_error,org_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)))){
throw (http_error.cljs$core$IFn$_invoke$arity$3 ? http_error.cljs$core$IFn$_invoke$arity$3((400),"org_required","orgId is required") : http_error.call(null,(400),"org_required","orgId is required"));
} else {
return null;
}
});
knoxx.backend.infra.routes.users.admin.unavailable_BANG_ = (function knoxx$backend$infra$routes$users$admin$unavailable_BANG_(json_response_BANG_,reply){
var G__28385 = reply;
var G__28386 = (503);
var G__28387 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__28385,G__28386,G__28387) : json_response_BANG_.call(null,G__28385,G__28386,G__28387));
});
knoxx.backend.infra.routes.users.admin.register_admin_user_index_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_admin_user_index_routes_BANG_(app,runtime,p__28389){
var map__28390 = p__28389;
var map__28390__$1 = cljs.core.__destructure_map(map__28390);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var http_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28390__$1,new cljs.core.Keyword(null,"http-error","http-error",-1040049553));
var G__28393_28874 = app;
var G__28394_28875 = "GET";
var G__28395_28876 = "/api/admin/users";
var G__28396_28877 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = (request["query"]["orgId"]);
var G__28399 = runtime;
var G__28400 = request;
var G__28401 = reply;
var G__28402 = (function (ctx){
if(cljs.core.truth_(org_id)){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.users.read") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.users.read"));
} else {
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.read") : ensure_permission_BANG_.call(null,ctx,"platform.org.read"));
}

var G__28403 = runtime;
var G__28404 = reply;
var G__28405 = (200);
var G__28406 = knoxx.backend.infra.db.policy.list_users_BANG_(knoxx.backend.infra.db.policy.context_pool(db),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28403,G__28404,G__28405,G__28406) : policy_db_promise.call(null,G__28403,G__28404,G__28405,G__28406));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28399,G__28400,G__28401,G__28402) : with_request_context_BANG_.call(null,G__28399,G__28400,G__28401,G__28402));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28393_28874,G__28394_28875,G__28395_28876,G__28396_28877) : route_BANG_.call(null,G__28393_28874,G__28394_28875,G__28395_28876,G__28396_28877));

var G__28410 = app;
var G__28411 = "POST";
var G__28412 = "/api/admin/users";
var G__28413 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var org_id = new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body);
var G__28418 = runtime;
var G__28419 = request;
var G__28420 = reply;
var G__28421 = (function (ctx){
knoxx.backend.infra.routes.users.admin.require_org_id_BANG_(http_error,org_id);

(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.users.create") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.users.create"));

var G__28423 = runtime;
var G__28424 = reply;
var G__28425 = (201);
var G__28426 = knoxx.backend.infra.db.policy.create_user_for_context_BANG_(db,knoxx.backend.infra.routes.users.admin.user_payload(body,org_id));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28423,G__28424,G__28425,G__28426) : policy_db_promise.call(null,G__28423,G__28424,G__28425,G__28426));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28418,G__28419,G__28420,G__28421) : with_request_context_BANG_.call(null,G__28418,G__28419,G__28420,G__28421));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28410,G__28411,G__28412,G__28413) : route_BANG_.call(null,G__28410,G__28411,G__28412,G__28413));
});
knoxx.backend.infra.routes.users.admin.register_org_user_read_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_org_user_read_routes_BANG_(app,runtime,p__28432){
var map__28433 = p__28432;
var map__28433__$1 = cljs.core.__destructure_map(map__28433);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28433__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28433__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28433__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28433__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28433__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28433__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var G__28434_28882 = app;
var G__28435_28883 = "GET";
var G__28436_28884 = "/api/admin/orgs/:orgId/users";
var G__28437_28885 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = knoxx.backend.infra.routes.users.admin.param_value(request,"orgId");
var G__28442 = runtime;
var G__28443 = request;
var G__28444 = reply;
var G__28445 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.users.read") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.users.read"));

var G__28447 = runtime;
var G__28448 = reply;
var G__28449 = (200);
var G__28450 = knoxx.backend.infra.db.policy.list_users_BANG_(knoxx.backend.infra.db.policy.context_pool(db),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28447,G__28448,G__28449,G__28450) : policy_db_promise.call(null,G__28447,G__28448,G__28449,G__28450));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28442,G__28443,G__28444,G__28445) : with_request_context_BANG_.call(null,G__28442,G__28443,G__28444,G__28445));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28434_28882,G__28435_28883,G__28436_28884,G__28437_28885) : route_BANG_.call(null,G__28434_28882,G__28435_28883,G__28436_28884,G__28437_28885));

var G__28452 = app;
var G__28453 = "GET";
var G__28454 = "/api/admin/orgs/:orgId/actors";
var G__28455 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = knoxx.backend.infra.routes.users.admin.param_value(request,"orgId");
var G__28459 = runtime;
var G__28460 = request;
var G__28461 = reply;
var G__28462 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.users.read") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.users.read"));

var G__28463 = runtime;
var G__28464 = reply;
var G__28465 = (200);
var G__28466 = (async function (){
(await knoxx.backend.infra.db.policy.sync_actor_contracts_for_context_BANG_(db));

return knoxx.backend.infra.db.policy.list_users_BANG_(knoxx.backend.infra.db.policy.context_pool(db),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
})();
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28463,G__28464,G__28465,G__28466) : policy_db_promise.call(null,G__28463,G__28464,G__28465,G__28466));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28459,G__28460,G__28461,G__28462) : with_request_context_BANG_.call(null,G__28459,G__28460,G__28461,G__28462));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28452,G__28453,G__28454,G__28455) : route_BANG_.call(null,G__28452,G__28453,G__28454,G__28455));
});
knoxx.backend.infra.routes.users.admin.register_org_user_create_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_org_user_create_routes_BANG_(app,runtime,p__28468){
var map__28469 = p__28468;
var map__28469__$1 = cljs.core.__destructure_map(map__28469);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var seq__28470 = cljs.core.seq(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["POST","/api/admin/orgs/:orgId/users"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["POST","/api/admin/orgs/:orgId/actors"], null)], null));
var chunk__28471 = null;
var count__28472 = (0);
var i__28473 = (0);
while(true){
if((i__28473 < count__28472)){
var vec__28528 = chunk__28471.cljs$core$IIndexed$_nth$arity$2(null,i__28473);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28528,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28528,(1),null);
var G__28532_28923 = app;
var G__28533_28924 = method;
var G__28534_28925 = path;
var G__28535_28926 = ((function (seq__28470,chunk__28471,count__28472,i__28473,G__28532_28923,G__28533_28924,G__28534_28925,vec__28528,method,path,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise){
return (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = knoxx.backend.infra.routes.users.admin.param_value(request,"orgId");
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var G__28537 = runtime;
var G__28538 = request;
var G__28539 = reply;
var G__28540 = ((function (seq__28470,chunk__28471,count__28472,i__28473,G__28537,G__28538,G__28539,org_id,body,db,temp__5823__auto__,G__28532_28923,G__28533_28924,G__28534_28925,vec__28528,method,path,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise){
return (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.users.create") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.users.create"));

var G__28542 = runtime;
var G__28543 = reply;
var G__28544 = (201);
var G__28545 = knoxx.backend.infra.db.policy.create_user_for_context_BANG_(db,knoxx.backend.infra.routes.users.admin.user_payload(body,org_id));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28542,G__28543,G__28544,G__28545) : policy_db_promise.call(null,G__28542,G__28543,G__28544,G__28545));
});})(seq__28470,chunk__28471,count__28472,i__28473,G__28537,G__28538,G__28539,org_id,body,db,temp__5823__auto__,G__28532_28923,G__28533_28924,G__28534_28925,vec__28528,method,path,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise))
;
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28537,G__28538,G__28539,G__28540) : with_request_context_BANG_.call(null,G__28537,G__28538,G__28539,G__28540));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});})(seq__28470,chunk__28471,count__28472,i__28473,G__28532_28923,G__28533_28924,G__28534_28925,vec__28528,method,path,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise))
;
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28532_28923,G__28533_28924,G__28534_28925,G__28535_28926) : route_BANG_.call(null,G__28532_28923,G__28533_28924,G__28534_28925,G__28535_28926));


var G__28946 = seq__28470;
var G__28947 = chunk__28471;
var G__28948 = count__28472;
var G__28949 = (i__28473 + (1));
seq__28470 = G__28946;
chunk__28471 = G__28947;
count__28472 = G__28948;
i__28473 = G__28949;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28470);
if(temp__5825__auto__){
var seq__28470__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28470__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28470__$1);
var G__28950 = cljs.core.chunk_rest(seq__28470__$1);
var G__28951 = c__5694__auto__;
var G__28952 = cljs.core.count(c__5694__auto__);
var G__28953 = (0);
seq__28470 = G__28950;
chunk__28471 = G__28951;
count__28472 = G__28952;
i__28473 = G__28953;
continue;
} else {
var vec__28548 = cljs.core.first(seq__28470__$1);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28548,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28548,(1),null);
var G__28552_28956 = app;
var G__28553_28957 = method;
var G__28554_28958 = path;
var G__28555_28959 = ((function (seq__28470,chunk__28471,count__28472,i__28473,G__28552_28956,G__28553_28957,G__28554_28958,vec__28548,method,path,seq__28470__$1,temp__5825__auto__,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise){
return (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = knoxx.backend.infra.routes.users.admin.param_value(request,"orgId");
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var G__28561 = runtime;
var G__28562 = request;
var G__28563 = reply;
var G__28564 = ((function (seq__28470,chunk__28471,count__28472,i__28473,G__28561,G__28562,G__28563,org_id,body,db,temp__5823__auto__,G__28552_28956,G__28553_28957,G__28554_28958,vec__28548,method,path,seq__28470__$1,temp__5825__auto__,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise){
return (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.users.create") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.users.create"));

var G__28566 = runtime;
var G__28567 = reply;
var G__28568 = (201);
var G__28569 = knoxx.backend.infra.db.policy.create_user_for_context_BANG_(db,knoxx.backend.infra.routes.users.admin.user_payload(body,org_id));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28566,G__28567,G__28568,G__28569) : policy_db_promise.call(null,G__28566,G__28567,G__28568,G__28569));
});})(seq__28470,chunk__28471,count__28472,i__28473,G__28561,G__28562,G__28563,org_id,body,db,temp__5823__auto__,G__28552_28956,G__28553_28957,G__28554_28958,vec__28548,method,path,seq__28470__$1,temp__5825__auto__,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise))
;
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28561,G__28562,G__28563,G__28564) : with_request_context_BANG_.call(null,G__28561,G__28562,G__28563,G__28564));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});})(seq__28470,chunk__28471,count__28472,i__28473,G__28552_28956,G__28553_28957,G__28554_28958,vec__28548,method,path,seq__28470__$1,temp__5825__auto__,map__28469,map__28469__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise))
;
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28552_28956,G__28553_28957,G__28554_28958,G__28555_28959) : route_BANG_.call(null,G__28552_28956,G__28553_28957,G__28554_28958,G__28555_28959));


var G__28980 = cljs.core.next(seq__28470__$1);
var G__28981 = null;
var G__28982 = (0);
var G__28983 = (0);
seq__28470 = G__28980;
chunk__28471 = G__28981;
count__28472 = G__28982;
i__28473 = G__28983;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.infra.routes.users.admin.register_user_actor_update_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_user_actor_update_routes_BANG_(app,runtime,p__28574){
var map__28575 = p__28574;
var map__28575__$1 = cljs.core.__destructure_map(map__28575);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var http_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"http-error","http-error",-1040049553));
var seq__28576 = cljs.core.seq(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["PATCH","/api/admin/users/:userId"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["PATCH","/api/admin/actors/:userId"], null)], null));
var chunk__28577 = null;
var count__28578 = (0);
var i__28579 = (0);
while(true){
if((i__28579 < count__28578)){
var vec__28660 = chunk__28577.cljs$core$IIndexed$_nth$arity$2(null,i__28579);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28660,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28660,(1),null);
var G__28663_28995 = app;
var G__28664_28996 = method;
var G__28665_28997 = path;
var G__28666_28998 = ((function (seq__28576,chunk__28577,count__28578,i__28579,G__28663_28995,G__28664_28996,G__28665_28997,vec__28660,method,path,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var user_id = knoxx.backend.infra.routes.users.admin.param_value(request,"userId");
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var org_id = new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body);
var G__28670 = runtime;
var G__28671 = request;
var G__28672 = reply;
var G__28673 = ((function (seq__28576,chunk__28577,count__28578,i__28579,G__28670,G__28671,G__28672,user_id,body,org_id,db,temp__5823__auto__,G__28663_28995,G__28664_28996,G__28665_28997,vec__28660,method,path,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (ctx){
knoxx.backend.infra.routes.users.admin.require_org_id_BANG_(http_error,org_id);

(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.members.update") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.members.update"));

var G__28675 = runtime;
var G__28676 = reply;
var G__28677 = (200);
var G__28678 = knoxx.backend.infra.db.policy.update_user_actor_for_context_BANG_(db,user_id,knoxx.backend.infra.routes.users.admin.actor_update_payload(body));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28675,G__28676,G__28677,G__28678) : policy_db_promise.call(null,G__28675,G__28676,G__28677,G__28678));
});})(seq__28576,chunk__28577,count__28578,i__28579,G__28670,G__28671,G__28672,user_id,body,org_id,db,temp__5823__auto__,G__28663_28995,G__28664_28996,G__28665_28997,vec__28660,method,path,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28670,G__28671,G__28672,G__28673) : with_request_context_BANG_.call(null,G__28670,G__28671,G__28672,G__28673));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});})(seq__28576,chunk__28577,count__28578,i__28579,G__28663_28995,G__28664_28996,G__28665_28997,vec__28660,method,path,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28663_28995,G__28664_28996,G__28665_28997,G__28666_28998) : route_BANG_.call(null,G__28663_28995,G__28664_28996,G__28665_28997,G__28666_28998));


var G__29005 = seq__28576;
var G__29006 = chunk__28577;
var G__29007 = count__28578;
var G__29008 = (i__28579 + (1));
seq__28576 = G__29005;
chunk__28577 = G__29006;
count__28578 = G__29007;
i__28579 = G__29008;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28576);
if(temp__5825__auto__){
var seq__28576__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28576__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28576__$1);
var G__29013 = cljs.core.chunk_rest(seq__28576__$1);
var G__29014 = c__5694__auto__;
var G__29015 = cljs.core.count(c__5694__auto__);
var G__29016 = (0);
seq__28576 = G__29013;
chunk__28577 = G__29014;
count__28578 = G__29015;
i__28579 = G__29016;
continue;
} else {
var vec__28682 = cljs.core.first(seq__28576__$1);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28682,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28682,(1),null);
var G__28687_29021 = app;
var G__28688_29022 = method;
var G__28689_29023 = path;
var G__28690_29024 = ((function (seq__28576,chunk__28577,count__28578,i__28579,G__28687_29021,G__28688_29022,G__28689_29023,vec__28682,method,path,seq__28576__$1,temp__5825__auto__,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var user_id = knoxx.backend.infra.routes.users.admin.param_value(request,"userId");
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var org_id = new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body);
var G__28692 = runtime;
var G__28693 = request;
var G__28694 = reply;
var G__28695 = ((function (seq__28576,chunk__28577,count__28578,i__28579,G__28692,G__28693,G__28694,user_id,body,org_id,db,temp__5823__auto__,G__28687_29021,G__28688_29022,G__28689_29023,vec__28682,method,path,seq__28576__$1,temp__5825__auto__,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (ctx){
knoxx.backend.infra.routes.users.admin.require_org_id_BANG_(http_error,org_id);

(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.members.update") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.members.update"));

var G__28696 = runtime;
var G__28697 = reply;
var G__28698 = (200);
var G__28699 = knoxx.backend.infra.db.policy.update_user_actor_for_context_BANG_(db,user_id,knoxx.backend.infra.routes.users.admin.actor_update_payload(body));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28696,G__28697,G__28698,G__28699) : policy_db_promise.call(null,G__28696,G__28697,G__28698,G__28699));
});})(seq__28576,chunk__28577,count__28578,i__28579,G__28692,G__28693,G__28694,user_id,body,org_id,db,temp__5823__auto__,G__28687_29021,G__28688_29022,G__28689_29023,vec__28682,method,path,seq__28576__$1,temp__5825__auto__,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28692,G__28693,G__28694,G__28695) : with_request_context_BANG_.call(null,G__28692,G__28693,G__28694,G__28695));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});})(seq__28576,chunk__28577,count__28578,i__28579,G__28687_29021,G__28688_29022,G__28689_29023,vec__28682,method,path,seq__28576__$1,temp__5825__auto__,map__28575,map__28575__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28687_29021,G__28688_29022,G__28689_29023,G__28690_29024) : route_BANG_.call(null,G__28687_29021,G__28688_29022,G__28689_29023,G__28690_29024));


var G__29037 = cljs.core.next(seq__28576__$1);
var G__29038 = null;
var G__29039 = (0);
var G__29040 = (0);
seq__28576 = G__29037;
chunk__28577 = G__29038;
count__28578 = G__29039;
i__28579 = G__29040;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.infra.routes.users.admin.register_user_credential_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_user_credential_routes_BANG_(app,runtime,p__28707){
var map__28708 = p__28707;
var map__28708__$1 = cljs.core.__destructure_map(map__28708);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var http_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28708__$1,new cljs.core.Keyword(null,"http-error","http-error",-1040049553));
var seq__28711 = cljs.core.seq(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["PUT","/api/admin/users/:userId/credentials/:provider"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["PUT","/api/admin/actors/:userId/credentials/:provider"], null)], null));
var chunk__28712 = null;
var count__28713 = (0);
var i__28714 = (0);
while(true){
if((i__28714 < count__28713)){
var vec__28752 = chunk__28712.cljs$core$IIndexed$_nth$arity$2(null,i__28714);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28752,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28752,(1),null);
var G__28755_29051 = app;
var G__28756_29052 = method;
var G__28757_29053 = path;
var G__28758_29054 = ((function (seq__28711,chunk__28712,count__28713,i__28714,G__28755_29051,G__28756_29052,G__28757_29053,vec__28752,method,path,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var user_id = knoxx.backend.infra.routes.users.admin.param_value(request,"userId");
var provider = knoxx.backend.infra.routes.users.admin.param_value(request,"provider");
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var org_id = new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body);
var G__28761 = runtime;
var G__28762 = request;
var G__28763 = reply;
var G__28764 = ((function (seq__28711,chunk__28712,count__28713,i__28714,G__28761,G__28762,G__28763,user_id,provider,body,org_id,db,temp__5823__auto__,G__28755_29051,G__28756_29052,G__28757_29053,vec__28752,method,path,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (ctx){
knoxx.backend.infra.routes.users.admin.require_org_id_BANG_(http_error,org_id);

(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.user_policy.update") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.user_policy.update"));

var G__28765 = runtime;
var G__28766 = reply;
var G__28767 = (200);
var G__28768 = knoxx.backend.infra.db.policy.upsert_actor_credential_for_context_BANG_(db,user_id,knoxx.backend.infra.routes.users.admin.credential_payload(body,provider));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28765,G__28766,G__28767,G__28768) : policy_db_promise.call(null,G__28765,G__28766,G__28767,G__28768));
});})(seq__28711,chunk__28712,count__28713,i__28714,G__28761,G__28762,G__28763,user_id,provider,body,org_id,db,temp__5823__auto__,G__28755_29051,G__28756_29052,G__28757_29053,vec__28752,method,path,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28761,G__28762,G__28763,G__28764) : with_request_context_BANG_.call(null,G__28761,G__28762,G__28763,G__28764));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});})(seq__28711,chunk__28712,count__28713,i__28714,G__28755_29051,G__28756_29052,G__28757_29053,vec__28752,method,path,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28755_29051,G__28756_29052,G__28757_29053,G__28758_29054) : route_BANG_.call(null,G__28755_29051,G__28756_29052,G__28757_29053,G__28758_29054));


var G__29068 = seq__28711;
var G__29069 = chunk__28712;
var G__29070 = count__28713;
var G__29071 = (i__28714 + (1));
seq__28711 = G__29068;
chunk__28712 = G__29069;
count__28713 = G__29070;
i__28714 = G__29071;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28711);
if(temp__5825__auto__){
var seq__28711__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28711__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28711__$1);
var G__29073 = cljs.core.chunk_rest(seq__28711__$1);
var G__29074 = c__5694__auto__;
var G__29075 = cljs.core.count(c__5694__auto__);
var G__29076 = (0);
seq__28711 = G__29073;
chunk__28712 = G__29074;
count__28713 = G__29075;
i__28714 = G__29076;
continue;
} else {
var vec__28769 = cljs.core.first(seq__28711__$1);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28769,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28769,(1),null);
var G__28772_29081 = app;
var G__28773_29082 = method;
var G__28774_29083 = path;
var G__28775_29084 = ((function (seq__28711,chunk__28712,count__28713,i__28714,G__28772_29081,G__28773_29082,G__28774_29083,vec__28769,method,path,seq__28711__$1,temp__5825__auto__,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var user_id = knoxx.backend.infra.routes.users.admin.param_value(request,"userId");
var provider = knoxx.backend.infra.routes.users.admin.param_value(request,"provider");
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
var org_id = new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(body);
var G__28778 = runtime;
var G__28779 = request;
var G__28780 = reply;
var G__28781 = ((function (seq__28711,chunk__28712,count__28713,i__28714,G__28778,G__28779,G__28780,user_id,provider,body,org_id,db,temp__5823__auto__,G__28772_29081,G__28773_29082,G__28774_29083,vec__28769,method,path,seq__28711__$1,temp__5825__auto__,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error){
return (function (ctx){
knoxx.backend.infra.routes.users.admin.require_org_id_BANG_(http_error,org_id);

(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.user_policy.update") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.user_policy.update"));

var G__28782 = runtime;
var G__28783 = reply;
var G__28784 = (200);
var G__28785 = knoxx.backend.infra.db.policy.upsert_actor_credential_for_context_BANG_(db,user_id,knoxx.backend.infra.routes.users.admin.credential_payload(body,provider));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28782,G__28783,G__28784,G__28785) : policy_db_promise.call(null,G__28782,G__28783,G__28784,G__28785));
});})(seq__28711,chunk__28712,count__28713,i__28714,G__28778,G__28779,G__28780,user_id,provider,body,org_id,db,temp__5823__auto__,G__28772_29081,G__28773_29082,G__28774_29083,vec__28769,method,path,seq__28711__$1,temp__5825__auto__,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28778,G__28779,G__28780,G__28781) : with_request_context_BANG_.call(null,G__28778,G__28779,G__28780,G__28781));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});})(seq__28711,chunk__28712,count__28713,i__28714,G__28772_29081,G__28773_29082,G__28774_29083,vec__28769,method,path,seq__28711__$1,temp__5825__auto__,map__28708,map__28708__$1,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_org_scope_BANG_,policy_db,policy_db_promise,http_error))
;
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28772_29081,G__28773_29082,G__28774_29083,G__28775_29084) : route_BANG_.call(null,G__28772_29081,G__28773_29082,G__28774_29083,G__28775_29084));


var G__29090 = cljs.core.next(seq__28711__$1);
var G__29091 = null;
var G__29092 = (0);
var G__29093 = (0);
seq__28711 = G__29090;
chunk__28712 = G__29091;
count__28713 = G__29092;
i__28714 = G__29093;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.infra.routes.users.admin.register_membership_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_membership_routes_BANG_(app,runtime,p__28792){
var map__28793 = p__28792;
var map__28793__$1 = cljs.core.__destructure_map(map__28793);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var http_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28793__$1,new cljs.core.Keyword(null,"http-error","http-error",-1040049553));
var G__28794_29095 = app;
var G__28795_29096 = "GET";
var G__28796_29097 = "/api/admin/orgs/:orgId/memberships";
var G__28797_29098 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = knoxx.backend.infra.routes.users.admin.param_value(request,"orgId");
var G__28801 = runtime;
var G__28802 = request;
var G__28803 = reply;
var G__28804 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.members.read") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.members.read"));

var G__28805 = runtime;
var G__28806 = reply;
var G__28807 = (200);
var G__28808 = knoxx.backend.infra.db.policy.list_memberships_BANG_(knoxx.backend.infra.db.policy.context_pool(db),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28805,G__28806,G__28807,G__28808) : policy_db_promise.call(null,G__28805,G__28806,G__28807,G__28808));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28801,G__28802,G__28803,G__28804) : with_request_context_BANG_.call(null,G__28801,G__28802,G__28803,G__28804));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28794_29095,G__28795_29096,G__28796_29097,G__28797_29098) : route_BANG_.call(null,G__28794_29095,G__28795_29096,G__28796_29097,G__28797_29098));

var G__28809 = app;
var G__28810 = "PATCH";
var G__28811 = "/api/admin/memberships/:membershipId/roles";
var G__28812 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var membership_id = knoxx.backend.infra.routes.users.admin.param_value(request,"membershipId");
var G__28813 = runtime;
var G__28814 = request;
var G__28815 = reply;
var G__28816 = (function (ctx){
var G__28817 = runtime;
var G__28818 = reply;
var G__28819 = (200);
var G__28820 = (async function (){
var result = (await knoxx.backend.infra.db.policy.get_membership_BANG_(knoxx.backend.infra.db.policy.context_pool(db),membership_id));
var membership = new cljs.core.Keyword(null,"membership","membership",254556333).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(membership)){
} else {
throw (http_error.cljs$core$IFn$_invoke$arity$3 ? http_error.cljs$core$IFn$_invoke$arity$3((404),"membership_not_found","membership not found") : http_error.call(null,(404),"membership_not_found","membership not found"));
}

var G__28821_29117 = ctx;
var G__28822_29118 = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(membership);
var G__28823_29119 = "org.members.update";
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(G__28821_29117,G__28822_29118,G__28823_29119) : ensure_org_scope_BANG_.call(null,G__28821_29117,G__28822_29118,G__28823_29119));

return knoxx.backend.infra.db.policy.set_membership_roles_for_context_BANG_(db,membership_id,knoxx.backend.infra.routes.users.admin.membership_roles_payload(knoxx.backend.infra.routes.users.admin.body_map(request)));
})();
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28817,G__28818,G__28819,G__28820) : policy_db_promise.call(null,G__28817,G__28818,G__28819,G__28820));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28813,G__28814,G__28815,G__28816) : with_request_context_BANG_.call(null,G__28813,G__28814,G__28815,G__28816));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28809,G__28810,G__28811,G__28812) : route_BANG_.call(null,G__28809,G__28810,G__28811,G__28812));
});
knoxx.backend.infra.routes.users.admin.register_membership_policy_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_membership_policy_routes_BANG_(app,runtime,p__28824){
var map__28825 = p__28824;
var map__28825__$1 = cljs.core.__destructure_map(map__28825);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var http_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28825__$1,new cljs.core.Keyword(null,"http-error","http-error",-1040049553));
var G__28827 = app;
var G__28828 = "PATCH";
var G__28829 = "/api/admin/memberships/:membershipId/tool-policies";
var G__28830 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var membership_id = knoxx.backend.infra.routes.users.admin.param_value(request,"membershipId");
var G__28831 = runtime;
var G__28832 = request;
var G__28833 = reply;
var G__28834 = (function (ctx){
var G__28835 = runtime;
var G__28836 = reply;
var G__28837 = (200);
var G__28838 = (async function (){
var result = (await knoxx.backend.infra.db.policy.get_membership_BANG_(knoxx.backend.infra.db.policy.context_pool(db),membership_id));
var membership = new cljs.core.Keyword(null,"membership","membership",254556333).cljs$core$IFn$_invoke$arity$1(result);
var body = knoxx.backend.infra.routes.users.admin.body_map(request);
if(cljs.core.truth_(membership)){
} else {
throw (http_error.cljs$core$IFn$_invoke$arity$3 ? http_error.cljs$core$IFn$_invoke$arity$3((404),"membership_not_found","membership not found") : http_error.call(null,(404),"membership_not_found","membership not found"));
}

var G__28840_29132 = ctx;
var G__28841_29133 = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(membership);
var G__28842_29134 = "org.user_policy.update";
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(G__28840_29132,G__28841_29133,G__28842_29134) : ensure_org_scope_BANG_.call(null,G__28840_29132,G__28841_29133,G__28842_29134));

return knoxx.backend.infra.db.policy.set_membership_tool_policies_BANG_(knoxx.backend.infra.db.policy.context_pool(db),membership_id,new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(body));
})();
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28835,G__28836,G__28837,G__28838) : policy_db_promise.call(null,G__28835,G__28836,G__28837,G__28838));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28831,G__28832,G__28833,G__28834) : with_request_context_BANG_.call(null,G__28831,G__28832,G__28833,G__28834));
} else {
return knoxx.backend.infra.routes.users.admin.unavailable_BANG_(json_response_BANG_,reply);
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28827,G__28828,G__28829,G__28830) : route_BANG_.call(null,G__28827,G__28828,G__28829,G__28830));
});
knoxx.backend.infra.routes.users.admin.register_user_admin_routes_BANG_ = (function knoxx$backend$infra$routes$users$admin$register_user_admin_routes_BANG_(app,runtime,handlers){
knoxx.backend.infra.routes.users.admin.register_admin_user_index_routes_BANG_(app,runtime,handlers);

knoxx.backend.infra.routes.users.admin.register_org_user_read_routes_BANG_(app,runtime,handlers);

knoxx.backend.infra.routes.users.admin.register_org_user_create_routes_BANG_(app,runtime,handlers);

knoxx.backend.infra.routes.users.admin.register_user_actor_update_routes_BANG_(app,runtime,handlers);

knoxx.backend.infra.routes.users.admin.register_user_credential_routes_BANG_(app,runtime,handlers);

knoxx.backend.infra.routes.users.admin.register_membership_routes_BANG_(app,runtime,handlers);

knoxx.backend.infra.routes.users.admin.register_membership_policy_routes_BANG_(app,runtime,handlers);

return null;
});

//# sourceMappingURL=knoxx.backend.infra.routes.users.admin.js.map
