import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.clients.github.js";
import "./knoxx.backend.infra.db.policy.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$nodemailer.js";
goog.provide('knoxx.backend.infra.auth.session');
knoxx.backend.infra.auth.session.session_secret_mem = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
knoxx.backend.infra.auth.session.session_secret = (function knoxx$backend$infra$auth$session$session_secret(){
var or__5162__auto__ = cljs.core.deref(knoxx.backend.infra.auth.session.session_secret_mem);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var env_secret = (process.env["KNOXX_SESSION_SECRET"]);
var secret = (function (){var or__5162__auto____$1 = (((!(clojure.string.blank_QMARK_(env_secret))))?env_secret:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return shadow.esm.esm_import$node_crypto.randomBytes((32)).toString("hex");
}
})();
cljs.core.reset_BANG_(knoxx.backend.infra.auth.session.session_secret_mem,secret);

return secret;
}
});
knoxx.backend.infra.auth.session.sign_token = (function knoxx$backend$infra$auth$session$sign_token(payload){
var key = knoxx.backend.infra.auth.session.session_secret();
var iv = shadow.esm.esm_import$node_crypto.randomBytes((12));
var data = JSON.stringify(cljs.core.clj__GT_js(payload));
var key_buf = Buffer.from(key,"hex").subarray((0),(32));
var cipher = shadow.esm.esm_import$node_crypto.createCipheriv("aes-256-gcm",key_buf,iv);
var encrypted = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cipher.update(data,"utf8","base64url"))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cipher.final("base64url")));
var tag = cipher.getAuthTag();
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(iv.toString("base64url"))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encrypted)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tag.toString("base64url")));
});
knoxx.backend.infra.auth.session.verify_token = (function knoxx$backend$infra$auth$session$verify_token(token){
try{var key = knoxx.backend.infra.auth.session.session_secret();
var parts = token.split(":");
if((parts.length >= (3))){
var iv_b64 = (parts[(0)]);
var encrypted = (parts[(1)]);
var tag_b64 = (parts[(2)]);
var iv = Buffer.from(iv_b64,"base64url");
var tag = Buffer.from(tag_b64,"base64url");
var key_buf = Buffer.from(key,"hex").subarray((0),(32));
var decipher = shadow.esm.esm_import$node_crypto.createDecipheriv("aes-256-gcm",key_buf,iv);
decipher.setAuthTag(tag);

var decrypted = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(decipher.update(encrypted,"base64url","utf8"))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(decipher.final("utf8")));
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(decrypted),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
}catch (e27356){var _ = e27356;
return null;
}});
knoxx.backend.infra.auth.session.db_session_store = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
knoxx.backend.infra.auth.session.set_db_session_store_BANG_ = (function knoxx$backend$infra$auth$session$set_db_session_store_BANG_(policy_context){
cljs.core.reset_BANG_(knoxx.backend.infra.auth.session.db_session_store,policy_context);

return (knoxx.backend.infra.auth.session.recover_or_persist_session_secret_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.infra.auth.session.recover_or_persist_session_secret_BANG_.cljs$core$IFn$_invoke$arity$1(policy_context) : knoxx.backend.infra.auth.session.recover_or_persist_session_secret_BANG_.call(null,policy_context));
});
/**
 * Recover or persist the session secret for restart-stable tokens.
 */
knoxx.backend.infra.auth.session.recover_or_persist_session_secret_BANG_ = (async function knoxx$backend$infra$auth$session$recover_or_persist_session_secret_BANG_(policy_context){
var env_secret = (process.env["KNOXX_SESSION_SECRET"]);
if((!(clojure.string.blank_QMARK_(env_secret)))){
cljs.core.reset_BANG_(knoxx.backend.infra.auth.session.session_secret_mem,env_secret);

return console.log("[knoxx-session] Using session secret from KNOXX_SESSION_SECRET env");
} else {
try{return cljs.core.reset_BANG_(knoxx.backend.infra.auth.session.session_secret_mem,(await knoxx.backend.infra.db.policy.recover_session_secret_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context))));
}catch (e27358){if((e27358 instanceof Error)){
var err = e27358;
return console.log("[knoxx-session] ERROR loading session secret from DB:",err.message);
} else {
throw e27358;

}
}}
});
knoxx.backend.infra.auth.session.session_field = (function knoxx$backend$infra$auth$session$session_field(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27477 = arguments.length;
var i__5898__auto___27478 = (0);
while(true){
if((i__5898__auto___27478 < len__5897__auto___27477)){
args__5903__auto__.push((arguments[i__5898__auto___27478]));

var G__27480 = (i__5898__auto___27478 + (1));
i__5898__auto___27478 = G__27480;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic = (function (session_data,ks){
return cljs.core.some((function (k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(session_data,k);
}),ks);
}));

(knoxx.backend.infra.auth.session.session_field.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.infra.auth.session.session_field.cljs$lang$applyTo = (function (seq27360){
var G__27361 = cljs.core.first(seq27360);
var seq27360__$1 = cljs.core.next(seq27360);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27361,seq27360__$1);
}));

knoxx.backend.infra.auth.session.normalize_session_data = (function knoxx$backend$infra$auth$session$normalize_session_data(session_data){
var m = ((cljs.core.map_QMARK_(session_data))?session_data:cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(session_data,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"github-id","github-id",-1743240112),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),new cljs.core.Keyword(null,"github-login","github-login",1599861883),new cljs.core.Keyword(null,"raw-token","raw-token",-1226843205),new cljs.core.Keyword(null,"created-at","created-at",-89248644),new cljs.core.Keyword(null,"ip-address","ip-address",719840734)],[knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"email","email",1415816706)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),new cljs.core.Keyword(null,"userAgent","userAgent",-205720749)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),new cljs.core.Keyword(null,"membershipId","membershipId",2026001076)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"userId","userId",575594135)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"github-id","github-id",-1743240112),new cljs.core.Keyword(null,"githubId","githubId",1753445622)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"id","id",-1388402092)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),new cljs.core.Keyword(null,"externalSubject","externalSubject",-1176915620),new cljs.core.Keyword(null,"externalId","externalId",254876339)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"displayName","displayName",-809144601)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),new cljs.core.Keyword(null,"authProvider","authProvider",1745264718)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"github-login","github-login",1599861883),new cljs.core.Keyword(null,"githubLogin","githubLogin",1846056035)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"raw-token","raw-token",-1226843205),new cljs.core.Keyword(null,"_rawToken","_rawToken",-923729563)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"created-at","created-at",-89248644),new cljs.core.Keyword(null,"createdAt","createdAt",-936788)], 0)),knoxx.backend.infra.auth.session.session_field.cljs$core$IFn$_invoke$arity$variadic(m,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"ip-address","ip-address",719840734),new cljs.core.Keyword(null,"ipAddress","ipAddress",843176249)], 0))]);
});
knoxx.backend.infra.auth.session.db_store_session = (async function knoxx$backend$infra$auth$session$db_store_session(token,session_data){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.auth.session.db_session_store))){
var payload = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.auth.session.normalize_session_data(session_data),new cljs.core.Keyword(null,"token","token",-1211463215),token);
try{return (await knoxx.backend.infra.db.policy.create_session_BANG_(knoxx.backend.infra.db.policy.context_pool(cljs.core.deref(knoxx.backend.infra.auth.session.db_session_store)),payload));
}catch (e27414){if((e27414 instanceof Error)){
var _ = e27414;
return null;
} else {
throw e27414;

}
}} else {
return null;
}
});
knoxx.backend.infra.auth.session.db_load_session = (async function knoxx$backend$infra$auth$session$db_load_session(token){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.auth.session.db_session_store))){
try{var temp__5825__auto__ = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1((await knoxx.backend.infra.db.policy.get_session_by_token_BANG_(knoxx.backend.infra.db.policy.context_pool(cljs.core.deref(knoxx.backend.infra.auth.session.db_session_store)),token)));
if(cljs.core.truth_(temp__5825__auto__)){
var s = temp__5825__auto__;
return knoxx.backend.infra.auth.session.normalize_session_data(s);
} else {
return null;
}
}catch (e27423){if((e27423 instanceof Error)){
var _ = e27423;
return null;
} else {
throw e27423;

}
}} else {
return null;
}
});
knoxx.backend.infra.auth.session.session_ttl_seconds = (function knoxx$backend$infra$auth$session$session_ttl_seconds(){
return parseInt((function (){var or__5162__auto__ = (process.env["KNOXX_SESSION_TTL_SECONDS"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "86400";
}
})(),(10));
});
knoxx.backend.infra.auth.session.store_session = (async function knoxx$backend$infra$auth$session$store_session(session_id,data){
var normalized = knoxx.backend.infra.auth.session.normalize_session_data(data);
var token = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"raw-token","raw-token",-1226843205).cljs$core$IFn$_invoke$arity$1(normalized);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
try{(await knoxx.backend.infra.auth.session.db_store_session(token,normalized));
}catch (e27424){if((e27424 instanceof Error)){
var err_27482 = e27424;
console.log("[knoxx-session] WARN: DB store failed:",err_27482.message);
} else {
throw e27424;

}
}
return null;
});
knoxx.backend.infra.auth.session.parse_stored_session = (function knoxx$backend$infra$auth$session$parse_stored_session(raw){
try{return knoxx.backend.infra.auth.session.normalize_session_data(JSON.parse(raw));
}catch (e27425){var _err = e27425;
return null;
}});
knoxx.backend.infra.auth.session.load_session = (async function knoxx$backend$infra$auth$session$load_session(session_id,token){
return (await knoxx.backend.infra.auth.session.db_load_session((await (async function (){var or__5162__auto__ = token;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
});
knoxx.backend.infra.auth.session.delete_session = (async function knoxx$backend$infra$auth$session$delete_session(session_id,token){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = cljs.core.deref(knoxx.backend.infra.auth.session.db_session_store);
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.blank_QMARK_(token)));
} else {
return and__5160__auto__;
}
})()))){
try{(await knoxx.backend.infra.db.policy.delete_session_by_token_BANG_(knoxx.backend.infra.db.policy.context_pool(cljs.core.deref(knoxx.backend.infra.auth.session.db_session_store)),token));
}catch (e27428){if((e27428 instanceof Error)){
var __27483 = e27428;
} else {
throw e27428;

}
}} else {
}

return null;
});
knoxx.backend.infra.auth.session.github_auth_client = (function knoxx$backend$infra$auth$session$github_auth_client(client_id,client_secret){
return knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"client-id","client-id",-464622140),client_id,new cljs.core.Keyword(null,"client-secret","client-secret",477227642),client_secret], null));
});
knoxx.backend.infra.auth.session.exchange_github_code = (function knoxx$backend$infra$auth$session$exchange_github_code(client_id,client_secret,code){
return knoxx.backend.infra.clients.github.oauth_access_token_BANG_(knoxx.backend.infra.auth.session.github_auth_client(client_id,client_secret),code,null);
});
knoxx.backend.infra.auth.session.get_github_user = (function knoxx$backend$infra$auth$session$get_github_user(access_token){
return knoxx.backend.infra.clients.github.authenticated_user_BANG_(knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY),access_token);
});
knoxx.backend.infra.auth.session.get_github_user_emails = (async function knoxx$backend$infra$auth$session$get_github_user_emails(access_token){
try{var emails = (await knoxx.backend.infra.clients.github.authenticated_emails_BANG_(knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY),access_token));
var primary = cljs.core.some((function (e){
if(cljs.core.truth_(new cljs.core.Keyword(null,"primary","primary",817773892).cljs$core$IFn$_invoke$arity$1(e))){
return e;
} else {
return null;
}
}),emails);
var or__5162__auto__ = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(primary);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(cljs.core.first(emails));
}
}catch (e27432){if((e27432 instanceof Error)){
var _ = e27432;
return null;
} else {
throw e27432;

}
}});
knoxx.backend.infra.auth.session.COOKIE_NAME = "knoxx_session";
knoxx.backend.infra.auth.session.secure_origin_QMARK_ = (function knoxx$backend$infra$auth$session$secure_origin_QMARK_(base_url){
try{return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((new URL(base_url)).protocol,"https:");
}catch (e27433){var _ = e27433;
return false;
}});
knoxx.backend.infra.auth.session.set_session_cookie = (function knoxx$backend$infra$auth$session$set_session_cookie(reply,token,base_url){
var secure = knoxx.backend.infra.auth.session.secure_origin_QMARK_(base_url);
var ttl = parseInt((function (){var or__5162__auto__ = (process.env["KNOXX_SESSION_TTL_SECONDS"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "86400";
}
})(),(10));
return reply.setCookie(knoxx.backend.infra.auth.session.COOKIE_NAME,token,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"path","path",-188191168),"/",new cljs.core.Keyword(null,"httpOnly","httpOnly",-1786097473),true,new cljs.core.Keyword(null,"secure","secure",176883900),secure,new cljs.core.Keyword(null,"sameSite","sameSite",2079352839),"Lax",new cljs.core.Keyword(null,"maxAge","maxAge",868089807),ttl], null)));
});
knoxx.backend.infra.auth.session.clear_session_cookie = (function knoxx$backend$infra$auth$session$clear_session_cookie(reply,base_url){
var secure = knoxx.backend.infra.auth.session.secure_origin_QMARK_(base_url);
return reply.clearCookie(knoxx.backend.infra.auth.session.COOKIE_NAME,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"path","path",-188191168),"/",new cljs.core.Keyword(null,"httpOnly","httpOnly",-1786097473),true,new cljs.core.Keyword(null,"secure","secure",176883900),secure,new cljs.core.Keyword(null,"sameSite","sameSite",2079352839),"Lax"], null)));
});
knoxx.backend.infra.auth.session.STATE_TTL = (600);
knoxx.backend.infra.auth.session.pending_states = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
knoxx.backend.infra.auth.session.create_state = (function knoxx$backend$infra$auth$session$create_state(redirect){
var state = shadow.esm.esm_import$node_crypto.randomBytes((16)).toString("hex");
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.auth.session.pending_states,cljs.core.assoc,state,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"redirect","redirect",-1975673286),(function (){var or__5162__auto__ = redirect;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/";
}
})(),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),Date.now()], null));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.auth.session.pending_states,(function (states){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$1((function (p__27444){
var vec__27446 = p__27444;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27446,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27446,(1),null);
return ((Date.now() - new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(v)) < (knoxx.backend.infra.auth.session.STATE_TTL * (1000)));
})),states);
}));

return state;
});
knoxx.backend.infra.auth.session.consume_state = (function knoxx$backend$infra$auth$session$consume_state(state){
var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.auth.session.pending_states),state);
if(cljs.core.truth_(temp__5825__auto__)){
var entry = temp__5825__auto__;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.auth.session.pending_states,cljs.core.dissoc,state);

if(((Date.now() - new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(entry)) < (knoxx.backend.infra.auth.session.STATE_TTL * (1000)))){
return entry;
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.auth.session.http_error = (function knoxx$backend$infra$auth$session$http_error(status,message,code){
var err = (new Error(message));
(err.status = status);

(err.code = code);

return err;
});
knoxx.backend.infra.auth.session.ensure_email_membership_BANG_ = (async function knoxx$backend$infra$auth$session$ensure_email_membership_BANG_(policy_context,p__27452){
var map__27453 = p__27452;
var map__27453__$1 = cljs.core.__destructure_map(map__27453);
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27453__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27453__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27453__$1,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231));
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27453__$1,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402));
var normalized_email = (await (async function (){var G__27454 = email;
var G__27454__$1 = (((G__27454 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27454)));
var G__27454__$2 = (((G__27454__$1 == null))?null:clojure.string.trim(G__27454__$1));
if((G__27454__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27454__$2);
}
})());
var headers_like = (cljs.core.truth_(normalized_email)?new cljs.core.PersistentArrayMap(null, 1, ["x-knoxx-user-email",normalized_email], null):null);
if(cljs.core.truth_(normalized_email)){
} else {
throw knoxx.backend.infra.auth.session.http_error((401),"Not authenticated","no_email");
}

(await knoxx.backend.infra.db.policy.sync_user_from_actor_contract_for_context_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"email","email",1415816706),normalized_email,new cljs.core.Keyword(null,"display-name","display-name",694513143),(await (async function (){var or__5162__auto__ = display_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return normalized_email;
}
})()),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),(await (async function (){var or__5162__auto__ = auth_provider;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "github";
}
})()),new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),external_subject], null)));

return (await knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,headers_like));
});
knoxx.backend.infra.auth.session.gh_value = (function knoxx$backend$infra$auth$session$gh_value(gh_user,k){
if(cljs.core.map_QMARK_(gh_user)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(gh_user,k);
} else {
return (gh_user[cljs.core.name(k)]);
}
});
/**
 * Resolve the canonical Knoxx user context by GitHub email.
 * 
 * Email is the canonical username. Actor and role assignment now come from the
 * persisted Knoxx user/membership records rather than being inferred from the
 * OAuth callback environment.
 */
knoxx.backend.infra.auth.session.ensure_user_membership_BANG_ = (function knoxx$backend$infra$auth$session$ensure_user_membership_BANG_(policy_context,gh_user,email){
return knoxx.backend.infra.auth.session.ensure_email_membership_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),(function (){var or__5162__auto__ = knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"name","name",1843675177));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"login","login",55217519));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return email;
}
}
})(),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"github",new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),(cljs.core.truth_(knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"id","id",-1388402092)))?(""+"github:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"id","id",-1388402092)))):null)], null));
});
knoxx.backend.infra.auth.session.configured_api_key = (function knoxx$backend$infra$auth$session$configured_api_key(){
var G__27458 = (process.env["KNOXX_API_KEY"]);
var G__27458__$1 = (((G__27458 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27458)));
var G__27458__$2 = (((G__27458__$1 == null))?null:clojure.string.trim(G__27458__$1));
if((G__27458__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27458__$2);
}
});
knoxx.backend.infra.auth.session.request_api_key = (function knoxx$backend$infra$auth$session$request_api_key(req){
var G__27460 = (function (){var or__5162__auto__ = (req.headers["x-api-key"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (req.headers["X-API-Key"]);
}
})();
var G__27460__$1 = (((G__27460 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27460)));
var G__27460__$2 = (((G__27460__$1 == null))?null:clojure.string.trim(G__27460__$1));
if((G__27460__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27460__$2);
}
});
knoxx.backend.infra.auth.session.api_key_auth_email = (function knoxx$backend$infra$auth$session$api_key_auth_email(){
var node_env = (function (){var G__27461 = (process.env["NODE_ENV"]);
var G__27461__$1 = (((G__27461 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27461)));
var G__27461__$2 = (((G__27461__$1 == null))?null:clojure.string.trim(G__27461__$1));
if((G__27461__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__27461__$2);
}
})();
var G__27462 = (function (){var or__5162__auto__ = (process.env["KNOXX_API_KEY_USER_EMAIL"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_env,"production")){
return "pi@open-hax.local";
} else {
return null;
}
}
})();
var G__27462__$1 = (((G__27462 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27462)));
var G__27462__$2 = (((G__27462__$1 == null))?null:clojure.string.trim(G__27462__$1));
if((G__27462__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27462__$2);
}
});
knoxx.backend.infra.auth.session.valid_api_key_request_QMARK_ = (function knoxx$backend$infra$auth$session$valid_api_key_request_QMARK_(req){
var expected = knoxx.backend.infra.auth.session.configured_api_key();
var provided = knoxx.backend.infra.auth.session.request_api_key(req);
var and__5160__auto__ = expected;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = provided;
if(cljs.core.truth_(and__5160__auto____$1)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(expected,provided);
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
});
knoxx.backend.infra.auth.session.ensure_api_key_membership_BANG_ = (async function knoxx$backend$infra$auth$session$ensure_api_key_membership_BANG_(policy_context){
var temp__5823__auto__ = knoxx.backend.infra.auth.session.api_key_auth_email();
if(cljs.core.truth_(temp__5823__auto__)){
var email = temp__5823__auto__;
return (await knoxx.backend.infra.auth.session.ensure_email_membership_BANG_(policy_context,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),"Pi",new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"api-key",new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),(""+"api-key:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email))], null)));
} else {
throw knoxx.backend.infra.auth.session.http_error((401),"Knoxx API key user email is not configured","api_key_identity_missing");
}
});
knoxx.backend.infra.auth.session.session_context_headers = (function knoxx$backend$infra$auth$session$session_context_headers(session_data){
var G__27463 = new cljs.core.PersistentArrayMap(null, 2, ["x-knoxx-user-email",new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(session_data),"x-knoxx-org-slug",new cljs.core.Keyword(null,"org-slug","org-slug",-726595051).cljs$core$IFn$_invoke$arity$1(session_data)], null);
if(cljs.core.truth_(new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(session_data))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27463,"x-knoxx-membership-id",new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(session_data));
} else {
return G__27463;
}
});
knoxx.backend.infra.auth.session.resolve_cookie_auth_context = (async function knoxx$backend$infra$auth$session$resolve_cookie_auth_context(req,policy_context){
var cookie_token = (await (async function (){var G__27464 = req;
var G__27464__$1 = (((G__27464 == null))?null:(G__27464["cookies"]));
if((G__27464__$1 == null)){
return null;
} else {
return (G__27464__$1[knoxx.backend.infra.auth.session.COOKIE_NAME]);
}
})());
if(cljs.core.truth_(cookie_token)){
} else {
throw knoxx.backend.infra.auth.session.http_error((401),"Not authenticated","no_session");
}

var payload = knoxx.backend.infra.auth.session.verify_token(cookie_token);
var session_id = new cljs.core.Keyword(null,"sid","sid",1815016414).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(session_id)){
} else {
throw knoxx.backend.infra.auth.session.http_error((401),"Invalid session token","invalid_token");
}

var session_data = (await knoxx.backend.infra.auth.session.load_session(session_id,cookie_token));
if(cljs.core.truth_(session_data)){
} else {
throw knoxx.backend.infra.auth.session.http_error((401),"Session expired","session_expired");
}

return (await knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,knoxx.backend.infra.auth.session.session_context_headers(session_data)));
});
knoxx.backend.infra.auth.session.github_session_data = (function knoxx$backend$infra$auth$session$github_session_data(fresh_ctx,gh_user,email,raw_token){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"github-id","github-id",-1743240112),new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),new cljs.core.Keyword(null,"github-login","github-login",1599861883),new cljs.core.Keyword(null,"raw-token","raw-token",-1226843205),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[email,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(fresh_ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(fresh_ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"actor-id","actor-id",897721067)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(fresh_ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
}
})(),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(fresh_ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(fresh_ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"id","id",-1388402092)),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(fresh_ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"slug","slug",2029314850)], null)),(function (){var or__5162__auto__ = knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"name","name",1843675177));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"login","login",55217519));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return email;
}
}
})(),"github",knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"login","login",55217519)),raw_token,(new Date()).toISOString()]);
});
/**
 * Create session from resolved context, set cookie, and redirect.
 */
knoxx.backend.infra.auth.session.create_session_and_redirect_BANG_ = (async function knoxx$backend$infra$auth$session$create_session_and_redirect_BANG_(policy_context,reply,gh_user,email,state_entry,public_base_url){
var fresh_ctx = (await knoxx.backend.infra.auth.session.ensure_user_membership_BANG_(policy_context,gh_user,email));
var session_id = shadow.esm.esm_import$node_crypto.randomUUID();
var raw_token = knoxx.backend.infra.auth.session.sign_token(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sid","sid",1815016414),session_id], null));
var session_data = knoxx.backend.infra.auth.session.github_session_data(fresh_ctx,gh_user,email,raw_token);
(await knoxx.backend.infra.auth.session.store_session(session_id,session_data));

knoxx.backend.infra.auth.session.set_session_cookie(reply,raw_token,public_base_url);

console.log((""+"[knoxx-session] GitHub login: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)));

return reply.redirect((new URL(new cljs.core.Keyword(null,"redirect","redirect",-1975673286).cljs$core$IFn$_invoke$arity$1(state_entry),public_base_url)).toString());
});
knoxx.backend.infra.auth.session.local_session_data = (function knoxx$backend$infra$auth$session$local_session_data(ctx,session_options,raw_token){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),new cljs.core.Keyword(null,"raw-token","raw-token",-1226843205),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(session_options);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"email","email",1415816706)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})(),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"actor-id","actor-id",897721067)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
}
})(),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"slug","slug",2029314850)], null)),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"display-name","display-name",694513143).cljs$core$IFn$_invoke$arity$1(session_options);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"display-name","display-name",694513143)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"email","email",1415816706)], null));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231).cljs$core$IFn$_invoke$arity$1(session_options);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "local";
}
})(),raw_token,(new Date()).toISOString()]);
});
knoxx.backend.infra.auth.session.create_session_from_context_BANG_ = (async function knoxx$backend$infra$auth$session$create_session_from_context_BANG_(reply,public_base_url,ctx,session_options){
var session_id = shadow.esm.esm_import$node_crypto.randomUUID();
var raw_token = knoxx.backend.infra.auth.session.sign_token(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sid","sid",1815016414),session_id], null));
var session_data = knoxx.backend.infra.auth.session.local_session_data(ctx,session_options,raw_token);
(await knoxx.backend.infra.auth.session.store_session(session_id,session_data));

knoxx.backend.infra.auth.session.set_session_cookie(reply,raw_token,public_base_url);

return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(ctx),new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"actor","actor",-1830560481).cljs$core$IFn$_invoke$arity$1(ctx),new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(ctx),new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"membership","membership",254556333).cljs$core$IFn$_invoke$arity$1(ctx)], null);
});
knoxx.backend.infra.auth.session.redirect_unwhitelisted_BANG_ = (function knoxx$backend$infra$auth$session$redirect_unwhitelisted_BANG_(reply,gh_user,email,public_base_url){
var invite_url = (new URL("/login",public_base_url));
invite_url.searchParams.set("error","not_whitelisted");

invite_url.searchParams.set("email",email);

invite_url.searchParams.set("github_login",(function (){var or__5162__auto__ = knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"login","login",55217519));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());

return reply.redirect(invite_url.toString());
});
/**
 * Create a session for whitelisted email, otherwise redirect to invite page.
 */
knoxx.backend.infra.auth.session.check_whitelist_and_session_BANG_ = (async function knoxx$backend$infra$auth$session$check_whitelist_and_session_BANG_(policy_context,reply,gh_user,email,state_entry,public_base_url){
var whitelisted = (await (async function (){try{(await knoxx.backend.infra.auth.session.ensure_user_membership_BANG_(policy_context,gh_user,email));

return true;
}catch (e27466){if((e27466 instanceof Error)){
var _ = e27466;
return false;
} else {
throw e27466;

}
}})());
if((!(whitelisted))){
return knoxx.backend.infra.auth.session.redirect_unwhitelisted_BANG_(reply,gh_user,email,public_base_url);
} else {
return (await knoxx.backend.infra.auth.session.create_session_and_redirect_BANG_(policy_context,reply,gh_user,email,state_entry,public_base_url));
}
});
knoxx.backend.infra.auth.session.redirect_oauth_error_BANG_ = (function knoxx$backend$infra$auth$session$redirect_oauth_error_BANG_(reply,public_base_url,err){
console.error("[knoxx-session] GitHub OAuth callback error:",err.message);

var error_url = (new URL("/login",public_base_url));
error_url.searchParams.set("error","oauth_failed");

error_url.searchParams.set("message",err.message);

return reply.redirect(error_url.toString());
});
knoxx.backend.infra.auth.session.handle_github_callback = (async function knoxx$backend$infra$auth$session$handle_github_callback(policy_context,reply,client_id,client_secret,state_entry,code,public_base_url){
try{var access_token = (await knoxx.backend.infra.auth.session.exchange_github_code(client_id,client_secret,code));
var gh_user = (await knoxx.backend.infra.auth.session.get_github_user(access_token));
if(cljs.core.truth_(knoxx.backend.infra.auth.session.gh_value(gh_user,new cljs.core.Keyword(null,"id","id",-1388402092)))){
} else {
throw (new Error("GitHub user lookup failed"));
}

var email = (await knoxx.backend.infra.auth.session.get_github_user_emails(access_token));
if(cljs.core.truth_(email)){
} else {
throw (new Error("Could not retrieve GitHub email"));
}

return (await knoxx.backend.infra.auth.session.check_whitelist_and_session_BANG_(policy_context,reply,gh_user,email,state_entry,public_base_url));
}catch (e27467){if((e27467 instanceof Error)){
var err = e27467;
return knoxx.backend.infra.auth.session.redirect_oauth_error_BANG_(reply,public_base_url,err);
} else {
throw e27467;

}
}});
knoxx.backend.infra.auth.session.invite_url = (function knoxx$backend$infra$auth$session$invite_url(invite_code,email,public_base_url){
try{var u = (new URL("/login",public_base_url));
u.searchParams.set("invite",invite_code);

u.searchParams.set("email",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)));

return u.toString();
}catch (e27468){var _ = e27468;
return "";
}});
knoxx.backend.infra.auth.session.invite_email_config = (function knoxx$backend$infra$auth$session$invite_email_config(invite,email,public_base_url){
var smtp_user = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (process.env["KNOXX_SMTP_USER"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var invite_code = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (invite["code"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"smtp-host","smtp-host",-1937071855),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (process.env["KNOXX_SMTP_HOST"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"smtp-port","smtp-port",697738986),parseInt((function (){var or__5162__auto__ = (process.env["KNOXX_SMTP_PORT"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "587";
}
})(),(10)),new cljs.core.Keyword(null,"smtp-user","smtp-user",358133154),smtp_user,new cljs.core.Keyword(null,"smtp-pass","smtp-pass",310541449),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (process.env["KNOXX_SMTP_PASS"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"from","from",1815293044),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (process.env["KNOXX_EMAIL_FROM"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = smtp_user;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())),new cljs.core.Keyword(null,"email","email",1415816706),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)),new cljs.core.Keyword(null,"invite-code","invite-code",-1465740024),invite_code,new cljs.core.Keyword(null,"invite-url","invite-url",262586186),knoxx.backend.infra.auth.session.invite_url(invite_code,email,public_base_url)], null);
});
knoxx.backend.infra.auth.session.invite_email_ready_QMARK_ = (function knoxx$backend$infra$auth$session$invite_email_ready_QMARK_(p__27469){
var map__27470 = p__27469;
var map__27470__$1 = cljs.core.__destructure_map(map__27470);
var smtp_host = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"smtp-host","smtp-host",-1937071855));
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"from","from",1815293044));
var smtp_user = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"smtp-user","smtp-user",358133154));
var smtp_pass = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"smtp-pass","smtp-pass",310541449));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var invite_code = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"invite-code","invite-code",-1465740024));
var invite_url = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27470__$1,new cljs.core.Keyword(null,"invite-url","invite-url",262586186));
return cljs.core.not_any_QMARK_(clojure.string.blank_QMARK_,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [smtp_host,from,smtp_user,smtp_pass,email,invite_code,invite_url], null));
});
knoxx.backend.infra.auth.session.invite_email_message = (function knoxx$backend$infra$auth$session$invite_email_message(p__27471){
var map__27472 = p__27471;
var map__27472__$1 = cljs.core.__destructure_map(map__27472);
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27472__$1,new cljs.core.Keyword(null,"from","from",1815293044));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27472__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var invite_url = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27472__$1,new cljs.core.Keyword(null,"invite-url","invite-url",262586186));
return ({"from": from, "to": email, "subject": "Knoxx invite", "text": (""+"You have been invited to Knoxx.\n\nInvite link: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(invite_url)+"\n")});
});
/**
 * Best-effort invite email sender; always resolves, including when disabled.
 */
knoxx.backend.infra.auth.session.send_invite_email = (async function knoxx$backend$infra$auth$session$send_invite_email(_runtime,invite,email,public_base_url){
try{var map__27474 = knoxx.backend.infra.auth.session.invite_email_config(invite,email,public_base_url);
var map__27474__$1 = cljs.core.__destructure_map(map__27474);
var config = map__27474__$1;
var smtp_host = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27474__$1,new cljs.core.Keyword(null,"smtp-host","smtp-host",-1937071855));
var smtp_port = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27474__$1,new cljs.core.Keyword(null,"smtp-port","smtp-port",697738986));
var smtp_user = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27474__$1,new cljs.core.Keyword(null,"smtp-user","smtp-user",358133154));
var smtp_pass = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27474__$1,new cljs.core.Keyword(null,"smtp-pass","smtp-pass",310541449));
if(knoxx.backend.infra.auth.session.invite_email_ready_QMARK_(config)){
var transporter = shadow.esm.esm_import$nodemailer.default.createTransport(({"host": smtp_host, "port": smtp_port, "secure": false, "auth": ({"user": smtp_user, "pass": smtp_pass})}));
return (await transporter.sendMail(knoxx.backend.infra.auth.session.invite_email_message(config)));
} else {
return null;
}
}catch (e27473){if((e27473 instanceof Error)){
var err = e27473;
console.warn("[knoxx-session] send-invite-email error:",err.message);

return null;
} else {
throw e27473;

}
}});
knoxx.backend.infra.auth.session.protected_auth_path_QMARK_ = (function knoxx$backend$infra$auth$session$protected_auth_path_QMARK_(req){
return cljs.core.not((function (){var and__5160__auto__ = req.url.startsWith("/api/auth/");
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not(req.url.startsWith("/api/auth/context"));
} else {
return and__5160__auto__;
}
})());
});
knoxx.backend.infra.auth.session.set_session_headers_BANG_ = (function knoxx$backend$infra$auth$session$set_session_headers_BANG_(headers,session_data){
(headers["x-knoxx-user-email"] = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(session_data));

if(cljs.core.truth_(new cljs.core.Keyword(null,"org-slug","org-slug",-726595051).cljs$core$IFn$_invoke$arity$1(session_data))){
(headers["x-knoxx-org-slug"] = new cljs.core.Keyword(null,"org-slug","org-slug",-726595051).cljs$core$IFn$_invoke$arity$1(session_data));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(session_data))){
return (headers["x-knoxx-membership-id"] = new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(session_data));
} else {
return null;
}
});
knoxx.backend.infra.auth.session.hydrate_session_headers_BANG_ = (async function knoxx$backend$infra$auth$session$hydrate_session_headers_BANG_(reply,headers,session_id,cookie_token){
try{var session_data = (await knoxx.backend.infra.auth.session.load_session(session_id,cookie_token));
if(cljs.core.not(session_data)){
return knoxx.backend.infra.auth.session.clear_session_cookie(reply,(await (async function (){var or__5162__auto__ = (process.env["KNOXX_PUBLIC_BASE_URL"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "http://localhost";
}
})()));
} else {
return knoxx.backend.infra.auth.session.set_session_headers_BANG_(headers,session_data);
}
}catch (e27475){if((e27475 instanceof Error)){
var _ = e27475;
return null;
} else {
throw e27475;

}
}});
knoxx.backend.infra.auth.session.create_session_hook = (function knoxx$backend$infra$auth$session$create_session_hook(_policy_context){
return (function knoxx$backend$infra$auth$session$create_session_hook_$_session_hook(req,reply){
if(knoxx.backend.infra.auth.session.protected_auth_path_QMARK_(req)){
var headers = req.headers;
var header_email = clojure.string.trim((function (){var or__5162__auto__ = (headers["x-knoxx-user-email"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var header_mid = clojure.string.trim((function (){var or__5162__auto__ = (headers["x-knoxx-membership-id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var cookie_token = (function (){var G__27476 = req;
var G__27476__$1 = (((G__27476 == null))?null:(G__27476["cookies"]));
if((G__27476__$1 == null)){
return null;
} else {
return (G__27476__$1[knoxx.backend.infra.auth.session.COOKIE_NAME]);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = clojure.string.blank_QMARK_(header_email);
if(and__5160__auto__){
var and__5160__auto____$1 = clojure.string.blank_QMARK_(header_mid);
if(and__5160__auto____$1){
return cookie_token;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())){
var temp__5825__auto__ = new cljs.core.Keyword(null,"sid","sid",1815016414).cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.auth.session.verify_token(cookie_token));
if(cljs.core.truth_(temp__5825__auto__)){
var session_id = temp__5825__auto__;
return knoxx.backend.infra.auth.session.hydrate_session_headers_BANG_(reply,headers,session_id,cookie_token);
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
});
});
knoxx.backend.infra.auth.session.resolve_auth_context = (function knoxx$backend$infra$auth$session$resolve_auth_context(req,policy_context){
var header_email = clojure.string.trim((function (){var or__5162__auto__ = (req.headers["x-knoxx-user-email"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var header_mid = clojure.string.trim((function (){var or__5162__auto__ = (req.headers["x-knoxx-membership-id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if((((!(clojure.string.blank_QMARK_(header_email)))) || ((!(clojure.string.blank_QMARK_(header_mid)))))){
return knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,req.headers);
} else {
if(cljs.core.truth_(knoxx.backend.infra.auth.session.valid_api_key_request_QMARK_(req))){
return knoxx.backend.infra.auth.session.ensure_api_key_membership_BANG_(policy_context);
} else {
return knoxx.backend.infra.auth.session.resolve_cookie_auth_context(req,policy_context);

}
}
});

//# sourceMappingURL=knoxx.backend.infra.auth.session.js.map
