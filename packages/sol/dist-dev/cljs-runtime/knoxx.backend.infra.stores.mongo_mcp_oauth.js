import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_mcp_oauth');
knoxx.backend.infra.stores.mongo_mcp_oauth.CLIENTS_COLLECTION = "knoxx_mcp_clients";
knoxx.backend.infra.stores.mongo_mcp_oauth.CODES_COLLECTION = "knoxx_mcp_codes";
knoxx.backend.infra.stores.mongo_mcp_oauth.TOKENS_COLLECTION = "knoxx_mcp_tokens";
knoxx.backend.infra.stores.mongo_mcp_oauth.clients_coll = (function knoxx$backend$infra$stores$mongo_mcp_oauth$clients_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_mcp_oauth.CLIENTS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_mcp_oauth.codes_coll = (function knoxx$backend$infra$stores$mongo_mcp_oauth$codes_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_mcp_oauth.CODES_COLLECTION);
});
knoxx.backend.infra.stores.mongo_mcp_oauth.tokens_coll = (function knoxx$backend$infra$stores$mongo_mcp_oauth$tokens_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_mcp_oauth.TOKENS_COLLECTION);
});
/**
 * Create required indexes. Idempotent.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$setup_indexes_BANG_(db){
var clients = knoxx.backend.infra.stores.mongo_mcp_oauth.clients_coll(db);
var codes = knoxx.backend.infra.stores.mongo_mcp_oauth.codes_coll(db);
var tokens = knoxx.backend.infra.stores.mongo_mcp_oauth.tokens_coll(db);
(await clients.createIndex(({"client_id": (1)}),({"unique": true})));

(await codes.createIndex(({"code": (1)}),({"unique": true})));

(await codes.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));

(await tokens.createIndex(({"access_token": (1)}),({"unique": true})));

(await tokens.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));

(await tokens.createIndex(({"membership_id": (1)})));

return true;
});
knoxx.backend.infra.stores.mongo_mcp_oauth.keywordize = (function knoxx$backend$infra$stores$mongo_mcp_oauth$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Read registered OAuth client by client_id.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$get_client_BANG_(var_args){
var G__30403 = arguments.length;
switch (G__30403) {
case 1:
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (client_id){
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),client_id);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,client_id){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return client_id;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.clients_coll(db);
var result = (await c.findOne(({"client_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(client_id))})));
if(cljs.core.truth_(result)){
return JSON.stringify(cljs.core.clj__GT_js(knoxx.backend.infra.stores.mongo_mcp_oauth.keywordize(result)));
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Store registered OAuth client.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$set_client_BANG_(var_args){
var G__30420 = arguments.length;
switch (G__30420) {
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (client_id,client_json){
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),client_id,client_json);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,client_id,client_json){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return client_id;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.clients_coll(db);
var now = (new Date());
var parsed = JSON.parse(client_json);
var doc = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"client_id","client_id",48809273),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(client_id)),new cljs.core.Keyword(null,"client_data","client_data",1400217354),parsed,new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),null], null);
(await c.updateOne(({"client_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(client_id))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"client_data","client_data",1400217354),parsed], null)), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Read OAuth auth code.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$get_code_BANG_(var_args){
var G__30452 = arguments.length;
switch (G__30452) {
case 1:
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (code){
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),code);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,code){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return code;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.codes_coll(db);
var result = (await c.findOne(({"code": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(code))})));
if(cljs.core.truth_(result)){
var doc = knoxx.backend.infra.stores.mongo_mcp_oauth.keywordize(result);
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(doc,(0)) > Date.now())){
return JSON.stringify(cljs.core.clj__GT_js(new cljs.core.Keyword(null,"code_data","code_data",1253013211).cljs$core$IFn$_invoke$arity$1(doc)));
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Store OAuth auth code with TTL.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$set_code_BANG_(var_args){
var G__30487 = arguments.length;
switch (G__30487) {
case 3:
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (code,code_json,ttl_seconds){
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.mongo_client.get_db(),code,code_json,ttl_seconds);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (db,code,code_json,ttl_seconds){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return code;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.codes_coll(db);
var now = (new Date());
var parsed = JSON.parse(code_json);
var doc = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"code","code",1586293142),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(code)),new cljs.core.Keyword(null,"code_data","code_data",1253013211),parsed,new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (ttl_seconds * (1000)))))], null);
(await c.updateOne(({"code": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(code))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"code_data","code_data",1253013211),parsed,new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(doc)], null)), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Delete OAuth auth code.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$delete_code_BANG_(var_args){
var G__30523 = arguments.length;
switch (G__30523) {
case 1:
return knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (code){
return knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),code);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,code){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return code;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.codes_coll(db);
(await c.deleteOne(({"code": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(code))})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Read access token.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$get_token_BANG_(var_args){
var G__30562 = arguments.length;
switch (G__30562) {
case 1:
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (access_token){
return knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),access_token);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,access_token){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return access_token;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.tokens_coll(db);
var result = (await c.findOne(({"access_token": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token))})));
if(cljs.core.truth_(result)){
var doc = knoxx.backend.infra.stores.mongo_mcp_oauth.keywordize(result);
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(doc,(0)) > Date.now())){
return JSON.stringify(cljs.core.clj__GT_js(new cljs.core.Keyword(null,"token_data","token_data",-1543696449).cljs$core$IFn$_invoke$arity$1(doc)));
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Store access token with TTL.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$set_token_BANG_(var_args){
var G__30622 = arguments.length;
switch (G__30622) {
case 4:
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (access_token,token_json,ttl_seconds,membership_id){
return knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$core$IFn$_invoke$arity$5(knoxx.backend.infra.mongo_client.get_db(),access_token,token_json,ttl_seconds,membership_id);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$core$IFn$_invoke$arity$5 = (async function (db,access_token,token_json,ttl_seconds,membership_id){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return access_token;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.tokens_coll(db);
var now = (new Date());
var parsed = JSON.parse(token_json);
var doc = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"access_token","access_token",1591156073),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token)),new cljs.core.Keyword(null,"token_data","token_data",-1543696449),parsed,new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = membership_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (ttl_seconds * (1000)))))], null);
(await c.updateOne(({"access_token": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"token_data","token_data",-1543696449),parsed,new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = membership_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(doc)], null)), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$lang$maxFixedArity = 5);

/**
 * Delete access token.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$delete_token_BANG_(var_args){
var G__30645 = arguments.length;
switch (G__30645) {
case 1:
return knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (access_token){
return knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),access_token);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,access_token){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return access_token;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.tokens_coll(db);
(await c.deleteOne(({"access_token": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token))})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * List all tokens for a membership.
 */
knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_ = (async function knoxx$backend$infra$stores$mongo_mcp_oauth$list_tokens_for_membership_BANG_(var_args){
var G__30657 = arguments.length;
switch (G__30657) {
case 1:
return knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (membership_id){
return knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),membership_id);
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,membership_id){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return membership_id;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_mcp_oauth.tokens_coll(db);
var cursor = c.find(({"membership_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id))}));
var results = (await cursor.toArray());
return cljs.core.vec((await (async function (){var iter__5649__auto__ = (function knoxx$backend$infra$stores$mongo_mcp_oauth$iter__30676(s__30677){
return (new cljs.core.LazySeq(null,(function (){
var s__30677__$1 = s__30677;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__30677__$1);
if(temp__5825__auto__){
var s__30677__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__30677__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__30677__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__30679 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__30678 = (0);
while(true){
if((i__30678 < size__5648__auto__)){
var doc = cljs.core._nth(c__5647__auto__,i__30678);
var d = knoxx.backend.infra.stores.mongo_mcp_oauth.keywordize(doc);
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(d,(0)) > Date.now())){
cljs.core.chunk_append(b__30679,JSON.stringify(cljs.core.clj__GT_js(new cljs.core.Keyword(null,"token_data","token_data",-1543696449).cljs$core$IFn$_invoke$arity$1(d))));

var G__30832 = (i__30678 + (1));
i__30678 = G__30832;
continue;
} else {
var G__30835 = (i__30678 + (1));
i__30678 = G__30835;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__30679),knoxx$backend$infra$stores$mongo_mcp_oauth$iter__30676(cljs.core.chunk_rest(s__30677__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__30679),null);
}
} else {
var doc = cljs.core.first(s__30677__$2);
var d = knoxx.backend.infra.stores.mongo_mcp_oauth.keywordize(doc);
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(d,(0)) > Date.now())){
return cljs.core.cons(JSON.stringify(cljs.core.clj__GT_js(new cljs.core.Keyword(null,"token_data","token_data",-1543696449).cljs$core$IFn$_invoke$arity$1(d))),knoxx$backend$infra$stores$mongo_mcp_oauth$iter__30676(cljs.core.rest(s__30677__$2)));
} else {
var G__30845 = cljs.core.rest(s__30677__$2);
s__30677__$1 = G__30845;
continue;
}
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(results);
})()));
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_mcp_oauth.js.map
