import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.db.policy.js";
import "./knoxx.backend.infra.routes.users.admin.js";
goog.provide('knoxx.backend.infra.routes.admin');
knoxx.backend.infra.routes.admin.body_map = (function knoxx$backend$infra$routes$admin$body_map(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.routes.admin.register_admin_bootstrap_routes_BANG_ = (function knoxx$backend$infra$routes$admin$register_admin_bootstrap_routes_BANG_(app,runtime,p__28880){
var map__28881 = p__28880;
var map__28881__$1 = cljs.core.__destructure_map(map__28881);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var ensure_any_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"ensure-any-permission!","ensure-any-permission!",1999271593));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28881__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var G__28886_29143 = app;
var G__28887_29144 = "GET";
var G__28888_29145 = "/api/admin/bootstrap";
var G__28889_29146 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var G__28891 = runtime;
var G__28892 = request;
var G__28893 = reply;
var G__28894 = (function (ctx){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.read") : ensure_permission_BANG_.call(null,ctx,"platform.org.read"));

var G__28895 = runtime;
var G__28896 = reply;
var G__28897 = (200);
var G__28898 = knoxx.backend.infra.db.policy.bootstrap_context_BANG_(db);
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28895,G__28896,G__28897,G__28898) : policy_db_promise.call(null,G__28895,G__28896,G__28897,G__28898));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28891,G__28892,G__28893,G__28894) : with_request_context_BANG_.call(null,G__28891,G__28892,G__28893,G__28894));
} else {
var G__28899 = reply;
var G__28900 = (503);
var G__28901 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__28899,G__28900,G__28901) : json_response_BANG_.call(null,G__28899,G__28900,G__28901));
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28886_29143,G__28887_29144,G__28888_29145,G__28889_29146) : route_BANG_.call(null,G__28886_29143,G__28887_29144,G__28888_29145,G__28889_29146));

var G__28902_29147 = app;
var G__28903_29148 = "GET";
var G__28904_29149 = "/api/admin/permissions";
var G__28905_29150 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var G__28906 = runtime;
var G__28907 = request;
var G__28908 = reply;
var G__28909 = (function (ctx){
var G__28911_29152 = ctx;
var G__28912_29153 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["platform.roles.manage","org.roles.read"], null);
var G__28913_29154 = "permission_denied";
var G__28914_29155 = "Role permission metadata is outside the current Knoxx scope";
(ensure_any_permission_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_any_permission_BANG_.cljs$core$IFn$_invoke$arity$4(G__28911_29152,G__28912_29153,G__28913_29154,G__28914_29155) : ensure_any_permission_BANG_.call(null,G__28911_29152,G__28912_29153,G__28913_29154,G__28914_29155));

var G__28916 = runtime;
var G__28917 = reply;
var G__28918 = (200);
var G__28919 = knoxx.backend.infra.db.policy.list_permissions_BANG_(knoxx.backend.infra.db.policy.context_pool(db));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28916,G__28917,G__28918,G__28919) : policy_db_promise.call(null,G__28916,G__28917,G__28918,G__28919));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28906,G__28907,G__28908,G__28909) : with_request_context_BANG_.call(null,G__28906,G__28907,G__28908,G__28909));
} else {
var G__28920 = reply;
var G__28921 = (503);
var G__28922 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__28920,G__28921,G__28922) : json_response_BANG_.call(null,G__28920,G__28921,G__28922));
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28902_29147,G__28903_29148,G__28904_29149,G__28905_29150) : route_BANG_.call(null,G__28902_29147,G__28903_29148,G__28904_29149,G__28905_29150));

var G__28927 = app;
var G__28928 = "GET";
var G__28929 = "/api/admin/tools";
var G__28930 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var G__28931 = runtime;
var G__28932 = request;
var G__28933 = reply;
var G__28934 = (function (ctx){
var G__28935_29159 = ctx;
var G__28936_29160 = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["platform.roles.manage","org.tool_policy.read","org.user_policy.read"], null);
var G__28937_29161 = "permission_denied";
var G__28938_29162 = "Tool policy metadata is outside the current Knoxx scope";
(ensure_any_permission_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_any_permission_BANG_.cljs$core$IFn$_invoke$arity$4(G__28935_29159,G__28936_29160,G__28937_29161,G__28938_29162) : ensure_any_permission_BANG_.call(null,G__28935_29159,G__28936_29160,G__28937_29161,G__28938_29162));

var G__28939 = runtime;
var G__28940 = reply;
var G__28941 = (200);
var G__28942 = knoxx.backend.infra.db.policy.list_tools_BANG_(knoxx.backend.infra.db.policy.context_pool(db));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28939,G__28940,G__28941,G__28942) : policy_db_promise.call(null,G__28939,G__28940,G__28941,G__28942));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28931,G__28932,G__28933,G__28934) : with_request_context_BANG_.call(null,G__28931,G__28932,G__28933,G__28934));
} else {
var G__28943 = reply;
var G__28944 = (503);
var G__28945 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__28943,G__28944,G__28945) : json_response_BANG_.call(null,G__28943,G__28944,G__28945));
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28927,G__28928,G__28929,G__28930) : route_BANG_.call(null,G__28927,G__28928,G__28929,G__28930));
});
knoxx.backend.infra.routes.admin.register_admin_org_routes_BANG_ = (function knoxx$backend$infra$routes$admin$register_admin_org_routes_BANG_(app,runtime,p__28954){
var map__28955 = p__28954;
var map__28955__$1 = cljs.core.__destructure_map(map__28955);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var G__28960_29163 = app;
var G__28961_29164 = "GET";
var G__28962_29165 = "/api/admin/orgs";
var G__28963_29166 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var G__28965 = runtime;
var G__28966 = request;
var G__28967 = reply;
var G__28968 = (function (ctx){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.read") : ensure_permission_BANG_.call(null,ctx,"platform.org.read"));

var G__28969 = runtime;
var G__28970 = reply;
var G__28971 = (200);
var G__28972 = knoxx.backend.infra.db.policy.list_orgs_BANG_(knoxx.backend.infra.db.policy.context_pool(db));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28969,G__28970,G__28971,G__28972) : policy_db_promise.call(null,G__28969,G__28970,G__28971,G__28972));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28965,G__28966,G__28967,G__28968) : with_request_context_BANG_.call(null,G__28965,G__28966,G__28967,G__28968));
} else {
var G__28973 = reply;
var G__28974 = (503);
var G__28975 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__28973,G__28974,G__28975) : json_response_BANG_.call(null,G__28973,G__28974,G__28975));
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28960_29163,G__28961_29164,G__28962_29165,G__28963_29166) : route_BANG_.call(null,G__28960_29163,G__28961_29164,G__28962_29165,G__28963_29166));

var G__28976 = app;
var G__28977 = "POST";
var G__28978 = "/api/admin/orgs";
var G__28979 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var G__28984 = runtime;
var G__28985 = request;
var G__28986 = reply;
var G__28987 = (function (ctx){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : ensure_permission_BANG_.call(null,ctx,"platform.org.create"));

var G__28988 = runtime;
var G__28989 = reply;
var G__28990 = (201);
var G__28991 = knoxx.backend.infra.db.policy.create_org_for_context_BANG_(db,knoxx.backend.infra.routes.admin.body_map(request));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__28988,G__28989,G__28990,G__28991) : policy_db_promise.call(null,G__28988,G__28989,G__28990,G__28991));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__28984,G__28985,G__28986,G__28987) : with_request_context_BANG_.call(null,G__28984,G__28985,G__28986,G__28987));
} else {
var G__28992 = reply;
var G__28993 = (503);
var G__28994 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__28992,G__28993,G__28994) : json_response_BANG_.call(null,G__28992,G__28993,G__28994));
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__28976,G__28977,G__28978,G__28979) : route_BANG_.call(null,G__28976,G__28977,G__28978,G__28979));
});
knoxx.backend.infra.routes.admin.register_admin_role_routes_BANG_ = (function knoxx$backend$infra$routes$admin$register_admin_role_routes_BANG_(app,runtime,p__28999){
var map__29000 = p__28999;
var map__29000__$1 = cljs.core.__destructure_map(map__29000);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var http_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29000__$1,new cljs.core.Keyword(null,"http-error","http-error",-1040049553));
var G__29001_29167 = app;
var G__29002_29168 = "GET";
var G__29003_29169 = "/api/admin/orgs/:orgId/roles";
var G__29004_29170 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = (function (){var or__5162__auto__ = (request["params"]["orgId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__29009 = runtime;
var G__29010 = request;
var G__29011 = reply;
var G__29012 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.roles.read") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.roles.read"));

var G__29017 = runtime;
var G__29018 = reply;
var G__29019 = (200);
var G__29020 = knoxx.backend.infra.db.policy.list_roles_BANG_(knoxx.backend.infra.db.policy.context_pool(db),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__29017,G__29018,G__29019,G__29020) : policy_db_promise.call(null,G__29017,G__29018,G__29019,G__29020));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29009,G__29010,G__29011,G__29012) : with_request_context_BANG_.call(null,G__29009,G__29010,G__29011,G__29012));
} else {
var G__29026 = reply;
var G__29027 = (503);
var G__29028 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29026,G__29027,G__29028) : json_response_BANG_.call(null,G__29026,G__29027,G__29028));
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29001_29167,G__29002_29168,G__29003_29169,G__29004_29170) : route_BANG_.call(null,G__29001_29167,G__29002_29168,G__29003_29169,G__29004_29170));

var G__29029_29171 = app;
var G__29030_29172 = "POST";
var G__29031_29173 = "/api/admin/orgs/:orgId/roles";
var G__29032_29174 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = (function (){var or__5162__auto__ = (request["params"]["orgId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var payload = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.admin.body_map(request),new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id);
var G__29033 = runtime;
var G__29034 = request;
var G__29035 = reply;
var G__29036 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.roles.create") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.roles.create"));

var G__29041 = runtime;
var G__29042 = reply;
var G__29043 = (201);
var G__29044 = knoxx.backend.infra.db.policy.create_role_for_context_BANG_(db,payload);
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__29041,G__29042,G__29043,G__29044) : policy_db_promise.call(null,G__29041,G__29042,G__29043,G__29044));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29033,G__29034,G__29035,G__29036) : with_request_context_BANG_.call(null,G__29033,G__29034,G__29035,G__29036));
} else {
var G__29048 = reply;
var G__29049 = (503);
var G__29050 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29048,G__29049,G__29050) : json_response_BANG_.call(null,G__29048,G__29049,G__29050));
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29029_29171,G__29030_29172,G__29031_29173,G__29032_29174) : route_BANG_.call(null,G__29029_29171,G__29030_29172,G__29031_29173,G__29032_29174));

var G__29055 = app;
var G__29056 = "PATCH";
var G__29057 = "/api/admin/roles/:roleId/tool-policies";
var G__29058 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var role_id = (function (){var or__5162__auto__ = (request["params"]["roleId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__29059 = runtime;
var G__29060 = request;
var G__29061 = reply;
var G__29062 = (function (ctx){
var G__29064 = runtime;
var G__29065 = reply;
var G__29066 = (200);
var G__29067 = (async function (){
var result = (await knoxx.backend.infra.db.policy.get_role_BANG_(knoxx.backend.infra.db.policy.context_pool(db),role_id));
var role = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(role)){
} else {
throw (http_error.cljs$core$IFn$_invoke$arity$3 ? http_error.cljs$core$IFn$_invoke$arity$3((404),"role_not_found","role not found") : http_error.call(null,(404),"role_not_found","role not found"));
}

var G__29077_29176 = ctx;
var G__29078_29177 = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(role);
var G__29079_29178 = "org.tool_policy.update";
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(G__29077_29176,G__29078_29177,G__29079_29178) : ensure_org_scope_BANG_.call(null,G__29077_29176,G__29078_29177,G__29079_29178));

return knoxx.backend.infra.db.policy.set_role_tool_policies_BANG_(knoxx.backend.infra.db.policy.context_pool(db),role_id,(await (async function (){var body = knoxx.backend.infra.routes.admin.body_map(request);
var or__5162__auto__ = new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177).cljs$core$IFn$_invoke$arity$1(body);
}
}
})()));
})();
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__29064,G__29065,G__29066,G__29067) : policy_db_promise.call(null,G__29064,G__29065,G__29066,G__29067));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29059,G__29060,G__29061,G__29062) : with_request_context_BANG_.call(null,G__29059,G__29060,G__29061,G__29062));
} else {
var G__29086 = reply;
var G__29087 = (503);
var G__29088 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29086,G__29087,G__29088) : json_response_BANG_.call(null,G__29086,G__29087,G__29088));
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29055,G__29056,G__29057,G__29058) : route_BANG_.call(null,G__29055,G__29056,G__29057,G__29058));
});
knoxx.backend.infra.routes.admin.register_admin_data_lake_routes_BANG_ = (function knoxx$backend$infra$routes$admin$register_admin_data_lake_routes_BANG_(app,runtime,p__29099){
var map__29100 = p__29099;
var map__29100__$1 = cljs.core.__destructure_map(map__29100);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29100__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29100__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29100__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_org_scope_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29100__$1,new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29100__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var policy_db_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29100__$1,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935));
var G__29101_29182 = app;
var G__29102_29183 = "GET";
var G__29103_29184 = "/api/admin/orgs/:orgId/data-lakes";
var G__29104_29185 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = (function (){var or__5162__auto__ = (request["params"]["orgId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__29109 = runtime;
var G__29110 = request;
var G__29111 = reply;
var G__29112 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.datalakes.read") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.datalakes.read"));

var G__29113 = runtime;
var G__29114 = reply;
var G__29115 = (200);
var G__29116 = knoxx.backend.infra.db.policy.list_data_lakes_BANG_(knoxx.backend.infra.db.policy.context_pool(db),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__29113,G__29114,G__29115,G__29116) : policy_db_promise.call(null,G__29113,G__29114,G__29115,G__29116));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29109,G__29110,G__29111,G__29112) : with_request_context_BANG_.call(null,G__29109,G__29110,G__29111,G__29112));
} else {
var G__29120 = reply;
var G__29121 = (503);
var G__29122 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29120,G__29121,G__29122) : json_response_BANG_.call(null,G__29120,G__29121,G__29122));
}
});
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29101_29182,G__29102_29183,G__29103_29184,G__29104_29185) : route_BANG_.call(null,G__29101_29182,G__29102_29183,G__29103_29184,G__29104_29185));

var G__29123 = app;
var G__29124 = "POST";
var G__29125 = "/api/admin/orgs/:orgId/data-lakes";
var G__29126 = (function (request,reply){
var temp__5823__auto__ = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var org_id = (function (){var or__5162__auto__ = (request["params"]["orgId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var payload = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.admin.body_map(request),new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id);
var G__29128 = runtime;
var G__29129 = request;
var G__29130 = reply;
var G__29131 = (function (ctx){
(ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3 ? ensure_org_scope_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,org_id,"org.datalakes.create") : ensure_org_scope_BANG_.call(null,ctx,org_id,"org.datalakes.create"));

var G__29135 = runtime;
var G__29136 = reply;
var G__29137 = (201);
var G__29138 = knoxx.backend.infra.db.policy.create_data_lake_for_context_BANG_(db,payload);
return (policy_db_promise.cljs$core$IFn$_invoke$arity$4 ? policy_db_promise.cljs$core$IFn$_invoke$arity$4(G__29135,G__29136,G__29137,G__29138) : policy_db_promise.call(null,G__29135,G__29136,G__29137,G__29138));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29128,G__29129,G__29130,G__29131) : with_request_context_BANG_.call(null,G__29128,G__29129,G__29130,G__29131));
} else {
var G__29139 = reply;
var G__29140 = (503);
var G__29141 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29139,G__29140,G__29141) : json_response_BANG_.call(null,G__29139,G__29140,G__29141));
}
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29123,G__29124,G__29125,G__29126) : route_BANG_.call(null,G__29123,G__29124,G__29125,G__29126));
});
knoxx.backend.infra.routes.admin.register_admin_routes_BANG_ = (function knoxx$backend$infra$routes$admin$register_admin_routes_BANG_(app,runtime,deps){
knoxx.backend.infra.routes.admin.register_admin_bootstrap_routes_BANG_(app,runtime,deps);

knoxx.backend.infra.routes.admin.register_admin_org_routes_BANG_(app,runtime,deps);

knoxx.backend.infra.routes.users.admin.register_user_admin_routes_BANG_(app,runtime,deps);

knoxx.backend.infra.routes.admin.register_admin_role_routes_BANG_(app,runtime,deps);

knoxx.backend.infra.routes.admin.register_admin_data_lake_routes_BANG_(app,runtime,deps);

return null;
});

//# sourceMappingURL=knoxx.backend.infra.routes.admin.js.map
