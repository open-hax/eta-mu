import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.auth.session.js";
import "./knoxx.backend.infra.db.policy.js";
import "./shadow.esm.esm_import$node_crypto.js";
goog.provide('knoxx.backend.infra.routes.auth');
knoxx.backend.infra.routes.auth.body_map = (function knoxx$backend$infra$routes$auth$body_map(req){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (req["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.routes.auth.map_value = (function knoxx$backend$infra$routes$auth$map_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___30914 = arguments.length;
var i__5898__auto___30915 = (0);
while(true){
if((i__5898__auto___30915 < len__5897__auto___30914)){
args__5903__auto__.push((arguments[i__5898__auto___30915]));

var G__30916 = (i__5898__auto___30915 + (1));
i__5898__auto___30915 = G__30916;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.infra.routes.auth.map_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.infra.routes.auth.map_value.cljs$core$IFn$_invoke$arity$variadic = (function (m,ks){
return cljs.core.some((function (p1__30422_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,p1__30422_SHARP_);
}),ks);
}));

(knoxx.backend.infra.routes.auth.map_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.infra.routes.auth.map_value.cljs$lang$applyTo = (function (seq30423){
var G__30424 = cljs.core.first(seq30423);
var seq30423__$1 = cljs.core.next(seq30423);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__30424,seq30423__$1);
}));

knoxx.backend.infra.routes.auth.env_truthy_QMARK_ = (function knoxx$backend$infra$routes$auth$env_truthy_QMARK_(key){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["yes",null,"true",null,"on",null,"y",null,"1",null], null), null),clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (process.env[key]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))));
});
knoxx.backend.infra.routes.auth.local_password_enabled_QMARK_ = (function knoxx$backend$infra$routes$auth$local_password_enabled_QMARK_(){
var node_env = (function (){var G__30438 = (process.env["NODE_ENV"]);
var G__30438__$1 = (((G__30438 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30438)));
var G__30438__$2 = (((G__30438__$1 == null))?null:clojure.string.trim(G__30438__$1));
if((G__30438__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__30438__$2);
}
})();
return ((knoxx.backend.infra.routes.auth.env_truthy_QMARK_("KNOXX_LOCAL_PASSWORD_AUTH_ENABLED")) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_env,"production")));
});
knoxx.backend.infra.routes.auth.local_host_QMARK_ = (function knoxx$backend$infra$routes$auth$local_host_QMARK_(host){
return cljs.core.boolean$(cljs.core.re_find(/^(localhost|127\.0\.0\.1|\[::1\])(:|$)/,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(host))));
});
knoxx.backend.infra.routes.auth.request_base_url = (function knoxx$backend$infra$routes$auth$request_base_url(req,configured_base_url){
var headers = req.headers;
var host = (function (){var G__30460 = (function (){var or__5162__auto__ = (headers["x-forwarded-host"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (headers["host"]);
}
})();
var G__30460__$1 = (((G__30460 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30460)));
var G__30460__$2 = (((G__30460__$1 == null))?null:clojure.string.trim(G__30460__$1));
if((G__30460__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30460__$2);
}
})();
var proto = (function (){var G__30474 = (function (){var or__5162__auto__ = (headers["x-forwarded-proto"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(knoxx.backend.infra.routes.auth.local_host_QMARK_(host)){
return "http";
} else {
return null;
}
}
})();
var G__30474__$1 = (((G__30474 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30474)));
var G__30474__$2 = (((G__30474__$1 == null))?null:clojure.string.trim(G__30474__$1));
if((G__30474__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30474__$2);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = host;
if(cljs.core.truth_(and__5160__auto__)){
return proto;
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(proto)+"://"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(host));
} else {
return configured_base_url;
}
});
knoxx.backend.infra.routes.auth.password_hash = (function knoxx$backend$infra$routes$auth$password_hash(password){
var salt = shadow.esm.esm_import$node_crypto.randomBytes((16)).toString("hex");
var hash = shadow.esm.esm_import$node_crypto.scryptSync((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(password)),salt,(64)).toString("hex");
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"algorithm","algorithm",739262820),"scrypt",new cljs.core.Keyword(null,"salt","salt",-587171712),salt,new cljs.core.Keyword(null,"hash","hash",-13781596),hash], null);
});
knoxx.backend.infra.routes.auth.verify_password_QMARK_ = (function knoxx$backend$infra$routes$auth$verify_password_QMARK_(password,secret_json){
try{var salt = new cljs.core.Keyword(null,"salt","salt",-587171712).cljs$core$IFn$_invoke$arity$1(secret_json);
var expected = new cljs.core.Keyword(null,"hash","hash",-13781596).cljs$core$IFn$_invoke$arity$1(secret_json);
var expected_buf = Buffer.from((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(expected)),"hex");
var actual_buf = shadow.esm.esm_import$node_crypto.scryptSync((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(password)),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(salt)),expected_buf.length);
var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("scrypt",new cljs.core.Keyword(null,"algorithm","algorithm",739262820).cljs$core$IFn$_invoke$arity$1(secret_json));
if(and__5160__auto__){
var and__5160__auto____$1 = (expected_buf.length > (0));
if(and__5160__auto____$1){
return shadow.esm.esm_import$node_crypto.timingSafeEqual(expected_buf,actual_buf);
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
}catch (e30503){var _ = e30503;
return false;
}});
knoxx.backend.infra.routes.auth.password_too_short_QMARK_ = (function knoxx$backend$infra$routes$auth$password_too_short_QMARK_(password){
return ((((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(password))).length) < (8));
});
knoxx.backend.infra.routes.auth.store_local_password_BANG_ = (async function knoxx$backend$infra$routes$auth$store_local_password_BANG_(policy_context,ctx,password){
return (await knoxx.backend.infra.db.policy.upsert_actor_credential_for_context_BANG_(policy_context,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),new cljs.core.Keyword(null,"provider","provider",-302056900),"local",new cljs.core.Keyword(null,"kind","kind",-717265803),"password",new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"email","email",1415816706)], null)),new cljs.core.Keyword(null,"secret-json","secret-json",-436252008),knoxx.backend.infra.routes.auth.password_hash(password),new cljs.core.Keyword(null,"status","status",-1997798413),"active"], null)));
});
knoxx.backend.infra.routes.auth.register_auth_config_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_auth_config_route_BANG_(app,public_base_url,github_enabled){
return app.get("/api/auth/config",(function (_req,reply){
return reply.send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"githubEnabled","githubEnabled",1802398475),github_enabled,new cljs.core.Keyword(null,"localPasswordEnabled","localPasswordEnabled",-1920319027),knoxx.backend.infra.routes.auth.local_password_enabled_QMARK_(),new cljs.core.Keyword(null,"publicBaseUrl","publicBaseUrl",-1021789883),public_base_url,new cljs.core.Keyword(null,"loginUrl","loginUrl",-889403941),(cljs.core.truth_(github_enabled)?"/api/auth/login":null),new cljs.core.Keyword(null,"localLoginUrl","localLoginUrl",-214287305),"/api/auth/local/login"], null)));
}));
});
knoxx.backend.infra.routes.auth.signup_handler_BANG_ = (async function knoxx$backend$infra$routes$auth$signup_handler_BANG_(req,reply,policy_context,public_base_url){
try{var body = knoxx.backend.infra.routes.auth.body_map(req);
var email = clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))));
var password = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"password","password",417022471).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var display_name = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = knoxx.backend.infra.routes.auth.map_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"displayName","displayName",-809144601),new cljs.core.Keyword(null,"display_name","display_name",-1494335013)], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return email;
}
})()))));
if(clojure.string.blank_QMARK_(email)){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"email is required"], null)));
} else {
if(((knoxx.backend.infra.routes.auth.local_password_enabled_QMARK_()) && (knoxx.backend.infra.routes.auth.password_too_short_QMARK_(password)))){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"password must be at least 8 characters"], null)));
} else {
var org = (await knoxx.backend.infra.db.policy.ensure_self_org_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),email,(await (async function (){var or__5162__auto__ = display_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return email;
}
})())));
var _ = (await knoxx.backend.infra.db.policy.create_user_for_context_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),(await (async function (){var or__5162__auto__ = display_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return email;
}
})()),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["basic-user"], null),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),((clojure.string.blank_QMARK_(password))?"signup":"local"),new cljs.core.Keyword(null,"status","status",-1997798413),"active",new cljs.core.Keyword(null,"membership-status","membership-status",794952258),"active",new cljs.core.Keyword(null,"is-default","is-default",1401171070),true], null)));
var ctx = (await knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 2, ["x-knoxx-user-email",email,"x-knoxx-org-slug",new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org)], null)));
var ___$1 = ((clojure.string.blank_QMARK_(password))?null:(await knoxx.backend.infra.routes.auth.store_local_password_BANG_(policy_context,ctx,password)));
var result = (await knoxx.backend.infra.auth.session.create_session_from_context_BANG_(reply,knoxx.backend.infra.routes.auth.request_base_url(req,public_base_url),ctx,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),(await (async function (){var or__5162__auto__ = display_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return email;
}
})()),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),((clojure.string.blank_QMARK_(password))?"signup":"local")], null)));
return reply.send(cljs.core.clj__GT_js(result));

}
}
}catch (e30563){var err = e30563;
return reply.code((await (async function (){var or__5162__auto__ = err.statusCode;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = err.status;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (500);
}
}
})())).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Signup failed";
}
})())], null)));
}});
knoxx.backend.infra.routes.auth.register_signup_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_signup_route_BANG_(app,policy_context,public_base_url){
return app.post("/api/auth/signup",(function (req,reply){
if(cljs.core.not(policy_context)){
return reply.code((503)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Knoxx policy database is not configured"], null)));
} else {
return knoxx.backend.infra.routes.auth.signup_handler_BANG_(req,reply,policy_context,public_base_url);
}
}));
});
knoxx.backend.infra.routes.auth.local_login_handler_BANG_ = (async function knoxx$backend$infra$routes$auth$local_login_handler_BANG_(req,reply,policy_context,public_base_url){
try{var body = knoxx.backend.infra.routes.auth.body_map(req);
var email = clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"username","username",1605666410).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())))));
var password = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"password","password",417022471).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if((!(knoxx.backend.infra.routes.auth.local_password_enabled_QMARK_()))){
return reply.code((503)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Local password auth is disabled"], null)));
} else {
if(((clojure.string.blank_QMARK_(email)) || (clojure.string.blank_QMARK_(password)))){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"email and password are required"], null)));
} else {
var auth_record = (await knoxx.backend.infra.db.policy.local_password_auth_record_for_context_BANG_(policy_context,email));
if(cljs.core.not(knoxx.backend.infra.routes.auth.verify_password_QMARK_(password,new cljs.core.Keyword(null,"secret-json","secret-json",-436252008).cljs$core$IFn$_invoke$arity$1(auth_record)))){
return reply.code((401)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Invalid username or password"], null)));
} else {
var ctx = (await knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 2, ["x-knoxx-user-email",new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(auth_record),"x-knoxx-membership-id",new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(auth_record)], null)));
var result = (await knoxx.backend.infra.auth.session.create_session_from_context_BANG_(reply,knoxx.backend.infra.routes.auth.request_base_url(req,public_base_url),ctx,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(auth_record),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"display-name","display-name",694513143).cljs$core$IFn$_invoke$arity$1(auth_record),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"local"], null)));
return reply.send(cljs.core.clj__GT_js(result));
}

}
}
}catch (e30634){var err = e30634;
return reply.code((await (async function (){var or__5162__auto__ = err.statusCode;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = err.status;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (500);
}
}
})())).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Login failed";
}
})())], null)));
}});
knoxx.backend.infra.routes.auth.register_local_login_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_local_login_route_BANG_(app,policy_context,public_base_url){
return app.post("/api/auth/local/login",(function (req,reply){
if(cljs.core.not(policy_context)){
return reply.code((503)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Knoxx policy database is not configured"], null)));
} else {
return knoxx.backend.infra.routes.auth.local_login_handler_BANG_(req,reply,policy_context,public_base_url);
}
}));
});
knoxx.backend.infra.routes.auth.register_login_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_login_route_BANG_(app,public_base_url,github_enabled,client_id){
return app.get("/api/auth/login",(function (req,reply){
if(cljs.core.not(github_enabled)){
return reply.code((503)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"GitHub OAuth not configured"], null)));
} else {
var redirect = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (function (){var G__30662 = req;
var G__30662__$1 = (((G__30662 == null))?null:(G__30662["query"]));
if((G__30662__$1 == null)){
return null;
} else {
return (G__30662__$1["redirect"]);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/";
}
})()));
var state = knoxx.backend.infra.auth.session.create_state(redirect);
var callback_url = (new URL("/api/auth/callback/github",public_base_url)).toString();
var authorize_url = (new URL("https://github.com/login/oauth/authorize"));
authorize_url.searchParams.set("client_id",client_id);

authorize_url.searchParams.set("redirect_uri",callback_url);

authorize_url.searchParams.set("state",state);

authorize_url.searchParams.set("scope","read:user user:email");

return reply.redirect(authorize_url.toString());
}
}));
});
knoxx.backend.infra.routes.auth.register_github_callback_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_github_callback_route_BANG_(app,policy_context,public_base_url,github_enabled,client_id,client_secret){
return app.get("/api/auth/callback/github",(function (req,reply){
if(cljs.core.not(github_enabled)){
return reply.code((503)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"GitHub OAuth not configured"], null)));
} else {
var code = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (function (){var G__30692 = req;
var G__30692__$1 = (((G__30692 == null))?null:(G__30692["query"]));
if((G__30692__$1 == null)){
return null;
} else {
return (G__30692__$1["code"]);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var state_val = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (function (){var G__30694 = req;
var G__30694__$1 = (((G__30694 == null))?null:(G__30694["query"]));
if((G__30694__$1 == null)){
return null;
} else {
return (G__30694__$1["state"]);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(((clojure.string.blank_QMARK_(code)) || (clojure.string.blank_QMARK_(state_val)))){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Missing code or state"], null)));
} else {
var temp__5823__auto__ = knoxx.backend.infra.auth.session.consume_state(state_val);
if(cljs.core.truth_(temp__5823__auto__)){
var state_entry = temp__5823__auto__;
return knoxx.backend.infra.auth.session.handle_github_callback(policy_context,reply,client_id,client_secret,state_entry,code,public_base_url);
} else {
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Invalid or expired state parameter"], null)));
}
}
}
}));
});
knoxx.backend.infra.routes.auth.logout_handler_BANG_ = (async function knoxx$backend$infra$routes$auth$logout_handler_BANG_(req,reply,public_base_url){
var cookie_token = (await (async function (){var G__30725 = req;
var G__30725__$1 = (((G__30725 == null))?null:(G__30725["cookies"]));
if((G__30725__$1 == null)){
return null;
} else {
return (G__30725__$1[knoxx.backend.infra.auth.session.COOKIE_NAME]);
}
})());
if(cljs.core.truth_(cookie_token)){
var payload_30938 = knoxx.backend.infra.auth.session.verify_token(cookie_token);
var temp__5825__auto___30939 = new cljs.core.Keyword(null,"sid","sid",1815016414).cljs$core$IFn$_invoke$arity$1(payload_30938);
if(cljs.core.truth_(temp__5825__auto___30939)){
var session_id_30940 = temp__5825__auto___30939;
try{(await knoxx.backend.infra.auth.session.delete_session(session_id_30940,cookie_token));
}catch (e30731){var __30941 = e30731;
}} else {
}
} else {
}

knoxx.backend.infra.auth.session.clear_session_cookie(reply,public_base_url);

return reply.send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ok","ok",967785236),true], null)));
});
knoxx.backend.infra.routes.auth.register_logout_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_logout_route_BANG_(app,public_base_url){
return app.post("/api/auth/logout",(function (req,reply){
return knoxx.backend.infra.routes.auth.logout_handler_BANG_(req,reply,public_base_url);
}));
});
knoxx.backend.infra.routes.auth.invite_redeem_handler_BANG_ = (async function knoxx$backend$infra$routes$auth$invite_redeem_handler_BANG_(req,reply,policy_context,public_base_url){
try{var body = knoxx.backend.infra.routes.auth.body_map(req);
var code = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"code","code",1586293142).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
var email = clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (req.headers["x-knoxx-user-email"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())))));
if(clojure.string.blank_QMARK_(code)){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Invite code is required"], null)));
} else {
if(clojure.string.blank_QMARK_(email)){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"email is required"], null)));
} else {
var result = (await knoxx.backend.infra.db.policy.redeem_invite_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),code,email));
var invite = new cljs.core.Keyword(null,"invite","invite",126355381).cljs$core$IFn$_invoke$arity$1(result);
var ctx = (await knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 2, ["x-knoxx-user-email",new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(invite),"x-knoxx-org-id",new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(invite)], null)));
var session = (await knoxx.backend.infra.auth.session.create_session_from_context_BANG_(reply,knoxx.backend.infra.routes.auth.request_base_url(req,public_base_url),ctx,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(invite),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(invite),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"invite"], null)));
return reply.send(cljs.core.clj__GT_js(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(session,new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"invite","invite",126355381),invite], 0))));

}
}
}catch (e30764){var err = e30764;
return reply.code((await (async function (){var or__5162__auto__ = err.status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (500);
}
})())).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Invite redemption failed";
}
})())], null)));
}});
knoxx.backend.infra.routes.auth.register_invite_redeem_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_invite_redeem_route_BANG_(app,policy_context,public_base_url){
return app.post("/api/auth/invite/redeem",(function (req,reply){
return knoxx.backend.infra.routes.auth.invite_redeem_handler_BANG_(req,reply,policy_context,public_base_url);
}));
});
knoxx.backend.infra.routes.auth.invite_create_handler_BANG_ = (async function knoxx$backend$infra$routes$auth$invite_create_handler_BANG_(req,reply,policy_context,runtime,public_base_url){
try{var body = knoxx.backend.infra.routes.auth.body_map(req);
var ctx = (await knoxx.backend.infra.auth.session.resolve_auth_context(req,policy_context));
var org_id = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.routes.auth.map_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"org_id","org_id",1380185385)], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
}
})());
var email = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(body);
var role_slugs = cljs.core.vec((await (async function (){var or__5162__auto__ = knoxx.backend.infra.routes.auth.map_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270),new cljs.core.Keyword(null,"role_slugs","role_slugs",2101192325)], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["basic-user"], null);
}
})()));
if(clojure.string.blank_QMARK_(email)){
return reply.code((400)).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"email is required"], null)));
} else {
knoxx.backend.infra.auth.authz.ensure_org_scope_BANG_(ctx,org_id,"org.users.invite");

var result = (await knoxx.backend.infra.db.policy.create_invite_for_context_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),role_slugs,new cljs.core.Keyword(null,"inviter-membership-id","inviter-membership-id",294607735),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null))], null)));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.auth.map_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"send-email","send-email",-1552066115),new cljs.core.Keyword(null,"sendEmail","sendEmail",926377577),new cljs.core.Keyword(null,"send_email","send_email",739500103)], 0)),false)){
try{(await knoxx.backend.infra.auth.session.send_invite_email(runtime,new cljs.core.Keyword(null,"invite","invite",126355381).cljs$core$IFn$_invoke$arity$1(result),email,public_base_url));
}catch (e30868){var err_30953 = e30868;
console.error("[knoxx-session] Failed to send invite email:",err_30953.message);
}} else {
}

return reply.send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"invite","invite",126355381),new cljs.core.Keyword(null,"invite","invite",126355381).cljs$core$IFn$_invoke$arity$1(result)], null)));
}
}catch (e30812){var err = e30812;
return reply.code((await (async function (){var or__5162__auto__ = err.status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (500);
}
})())).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Invite creation failed";
}
})())], null)));
}});
knoxx.backend.infra.routes.auth.register_invite_create_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_invite_create_route_BANG_(app,policy_context,runtime,public_base_url){
return app.post("/api/auth/invite",(function (req,reply){
return knoxx.backend.infra.routes.auth.invite_create_handler_BANG_(req,reply,policy_context,runtime,public_base_url);
}));
});
knoxx.backend.infra.routes.auth.invite_list_handler_BANG_ = (async function knoxx$backend$infra$routes$auth$invite_list_handler_BANG_(req,reply,policy_context){
try{var ctx = (await knoxx.backend.infra.auth.session.resolve_auth_context(req,policy_context));
var org_id = (await (async function (){var or__5162__auto__ = (await (async function (){var G__30887 = req;
var G__30887__$1 = (((G__30887 == null))?null:(G__30887["query"]));
if((G__30887__$1 == null)){
return null;
} else {
return (G__30887__$1["orgId"]);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
}
})());
var status = (await (async function (){var G__30895 = req;
var G__30895__$1 = (((G__30895 == null))?null:(G__30895["query"]));
if((G__30895__$1 == null)){
return null;
} else {
return (G__30895__$1["status"]);
}
})());
knoxx.backend.infra.auth.authz.ensure_org_scope_BANG_(ctx,org_id,"org.users.invite");

var result = (await knoxx.backend.infra.db.policy.list_invites_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),(await (async function (){var G__30899 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null);
if(cljs.core.truth_(status)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30899,new cljs.core.Keyword(null,"status","status",-1997798413),status);
} else {
return G__30899;
}
})())));
return reply.send(cljs.core.clj__GT_js(result));
}catch (e30882){var err = e30882;
return reply.code((await (async function (){var or__5162__auto__ = err.status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (401);
}
})())).send(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Unauthorized";
}
})())], null)));
}});
knoxx.backend.infra.routes.auth.register_invite_list_route_BANG_ = (function knoxx$backend$infra$routes$auth$register_invite_list_route_BANG_(app,policy_context){
return app.get("/api/auth/invites",(function (req,reply){
return knoxx.backend.infra.routes.auth.invite_list_handler_BANG_(req,reply,policy_context);
}));
});
knoxx.backend.infra.routes.auth.register_auth_routes = (function knoxx$backend$infra$routes$auth$register_auth_routes(app,opts){
var public_base_url = (function (){var or__5162__auto__ = (process.env["KNOXX_PUBLIC_BASE_URL"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "http://localhost";
}
})();
var policy_context = new cljs.core.Keyword(null,"policy-context","policy-context",-10488283).cljs$core$IFn$_invoke$arity$1(opts);
var runtime = new cljs.core.Keyword(null,"runtime","runtime",-1331573996).cljs$core$IFn$_invoke$arity$1(opts);
var client_id = (function (){var or__5162__auto__ = (process.env["KNOXX_GITHUB_OAUTH_CLIENT_ID"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var client_secret = (function (){var or__5162__auto__ = (process.env["KNOXX_GITHUB_OAUTH_CLIENT_SECRET"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var github_enabled = (((!(clojure.string.blank_QMARK_(client_id)))) && ((!(clojure.string.blank_QMARK_(client_secret)))));
if(cljs.core.truth_(policy_context)){
knoxx.backend.infra.auth.session.set_db_session_store_BANG_(policy_context);
} else {
}

knoxx.backend.infra.routes.auth.register_auth_config_route_BANG_(app,public_base_url,github_enabled);

knoxx.backend.infra.routes.auth.register_signup_route_BANG_(app,policy_context,public_base_url);

knoxx.backend.infra.routes.auth.register_local_login_route_BANG_(app,policy_context,public_base_url);

knoxx.backend.infra.routes.auth.register_login_route_BANG_(app,public_base_url,github_enabled,client_id);

knoxx.backend.infra.routes.auth.register_github_callback_route_BANG_(app,policy_context,public_base_url,github_enabled,client_id,client_secret);

knoxx.backend.infra.routes.auth.register_logout_route_BANG_(app,public_base_url);

knoxx.backend.infra.routes.auth.register_invite_redeem_route_BANG_(app,policy_context,public_base_url);

knoxx.backend.infra.routes.auth.register_invite_create_route_BANG_(app,policy_context,runtime,public_base_url);

return knoxx.backend.infra.routes.auth.register_invite_list_route_BANG_(app,policy_context);
});

//# sourceMappingURL=knoxx.backend.infra.routes.auth.js.map
