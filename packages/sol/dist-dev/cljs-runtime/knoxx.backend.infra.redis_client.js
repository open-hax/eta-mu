import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./shadow.esm.esm_import$redis.js";
goog.provide('knoxx.backend.infra.redis_client');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.redis_client !== 'undefined') && (typeof knoxx.backend.infra.redis_client.redis_client_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.redis_client.redis_client_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.redis_client !== 'undefined') && (typeof knoxx.backend.infra.redis_client.redis_init_promise_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.redis_client.redis_init_promise_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Coerce common CLJS/JS values into Redis-safe scalar arguments.
 * 
 * Cured the ERR_HTTP_HEADERS_SENT and Redis SADD TypeError.
 * Triumphant manifestation of intent: 'I fixed it bitch'.
 * Onwards to glory.
 */
knoxx.backend.infra.redis_client.redis_arg = (function knoxx$backend$infra$redis_client$redis_arg(value){
if((value == null)){
return null;
} else {
if(typeof value === 'string'){
return value;
} else {
if(typeof value === 'number'){
return value.toString();
} else {
if(cljs.core.boolean_QMARK_(value)){
if(value){
return "true";
} else {
return "false";
}
} else {
if(((cljs.core.map_QMARK_(value)) || (((cljs.core.vector_QMARK_(value)) || (((cljs.core.set_QMARK_(value)) || (cljs.core.seq_QMARK_(value)))))))){
return JSON.stringify(cljs.core.clj__GT_js(value));
} else {
try{var json = (cljs.core.truth_((function (){var and__5160__auto__ = value;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(value,undefined);
if(and__5160__auto____$1){
var or__5162__auto__ = cljs.core.array_QMARK_(value);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("object",goog.typeOf(value));
}
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())?JSON.stringify(value):null);
if(typeof json === 'string'){
return json;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
}
}catch (e32997){var _ = e32997;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
}
}
}
}
}
}
});
/**
 * Create a Redis client from URL. Returns nil if URL is empty or client creation fails.
 */
knoxx.backend.infra.redis_client.create_client = (function knoxx$backend$infra$redis_client$create_client(redis_url){
if(cljs.core.truth_((function (){var and__5160__auto__ = redis_url;
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.blank_QMARK_(redis_url)));
} else {
return and__5160__auto__;
}
})())){
try{var client = shadow.esm.esm_import$redis.createClient(({"url": redis_url}));
client.on("error",(function (err){
return console.error("Redis client error:",err);
}));

client.on("connect",(function (){
return console.log("Redis client connected");
}));

client.on("end",(function (){
return console.warn("Redis client disconnected");
}));

return client;
}catch (e33010){var e = e33010;
console.error("Failed to create Redis client:",e);

return null;
}} else {
return null;
}
});
knoxx.backend.infra.redis_client.connect_redis_client_BANG_ = (async function knoxx$backend$infra$redis_client$connect_redis_client_BANG_(client){
try{(await client.connect());

cljs.core.reset_BANG_(knoxx.backend.infra.redis_client.redis_client_STAR_,client);

return client;
}catch (e33027){var err = e33027;
console.error("Failed to connect Redis client:",err);

cljs.core.reset_BANG_(knoxx.backend.infra.redis_client.redis_client_STAR_,null);

return null;
}finally {cljs.core.reset_BANG_(knoxx.backend.infra.redis_client.redis_init_promise_STAR_,null);
}});
/**
 * Initialize and connect the Redis client from environment.
 * Returns a promise resolving to the connected client or nil.
 */
knoxx.backend.infra.redis_client.init_redis_BANG_ = (async function knoxx$backend$infra$redis_client$init_redis_BANG_(redis_url){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(redis_url)))){
return null;
} else {
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.redis_client.redis_client_STAR_))){
return cljs.core.deref(knoxx.backend.infra.redis_client.redis_client_STAR_);
} else {
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.redis_client.redis_init_promise_STAR_))){
return (await cljs.core.deref(knoxx.backend.infra.redis_client.redis_init_promise_STAR_));
} else {
var temp__5823__auto__ = knoxx.backend.infra.redis_client.create_client(redis_url);
if(cljs.core.truth_(temp__5823__auto__)){
var client = temp__5823__auto__;
var connect_promise = knoxx.backend.infra.redis_client.connect_redis_client_BANG_(client);
cljs.core.reset_BANG_(knoxx.backend.infra.redis_client.redis_init_promise_STAR_,connect_promise);

return (await connect_promise);
} else {
return null;
}

}
}
}
});
/**
 * Get the current connected Redis client, or nil if not initialized.
 */
knoxx.backend.infra.redis_client.get_client = (function knoxx$backend$infra$redis_client$get_client(){
return cljs.core.deref(knoxx.backend.infra.redis_client.redis_client_STAR_);
});
/**
 * Get a value from Redis.
 */
knoxx.backend.infra.redis_client.get_key = (async function knoxx$backend$infra$redis_client$get_key(client,key){
try{return (await client.get(knoxx.backend.infra.redis_client.redis_arg(key)));
}catch (e33050){var err = e33050;
console.error("Redis GET error:",err);

return null;
}});
/**
 * Set a value in Redis with optional TTL (seconds).
 */
knoxx.backend.infra.redis_client.set_key = (async function knoxx$backend$infra$redis_client$set_key(var_args){
var G__33063 = arguments.length;
switch (G__33063) {
case 3:
return knoxx.backend.infra.redis_client.set_key.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.redis_client.set_key.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.redis_client.set_key.cljs$core$IFn$_invoke$arity$3 = (async function (client,key,value){
return knoxx.backend.infra.redis_client.set_key.cljs$core$IFn$_invoke$arity$4(client,key,value,null);
}));

(knoxx.backend.infra.redis_client.set_key.cljs$core$IFn$_invoke$arity$4 = (async function (client,key,value,ttl){
var key_SINGLEQUOTE_ = knoxx.backend.infra.redis_client.redis_arg(key);
var value_SINGLEQUOTE_ = knoxx.backend.infra.redis_client.redis_arg(value);
try{return (await (cljs.core.truth_(ttl)?client.set(key_SINGLEQUOTE_,value_SINGLEQUOTE_,({"EX": ttl})):client.set(key_SINGLEQUOTE_,value_SINGLEQUOTE_)));
}catch (e33070){var err = e33070;
return console.error("Redis SET error:",err);
}}));

(knoxx.backend.infra.redis_client.set_key.cljs$lang$maxFixedArity = 4);

/**
 * Set a JSON value in Redis with optional TTL.
 */
knoxx.backend.infra.redis_client.set_json = (async function knoxx$backend$infra$redis_client$set_json(var_args){
var G__33081 = arguments.length;
switch (G__33081) {
case 3:
return knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$3 = (async function (client,key,value){
return knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$4(client,key,value,null);
}));

(knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$4 = (async function (client,key,value,ttl){
try{(await client.set(knoxx.backend.infra.redis_client.redis_arg(key),JSON.stringify(cljs.core.clj__GT_js(value))));

if(cljs.core.truth_(ttl)){
return (await client.expire(knoxx.backend.infra.redis_client.redis_arg(key),ttl));
} else {
return null;
}
}catch (e33086){var err = e33086;
return console.error("Redis SET JSON error:",err);
}}));

(knoxx.backend.infra.redis_client.set_json.cljs$lang$maxFixedArity = 4);

/**
 * Get a JSON value from Redis, parsed to CLJ.
 */
knoxx.backend.infra.redis_client.get_json = (async function knoxx$backend$infra$redis_client$get_json(client,key){
try{var temp__5825__auto__ = (await client.get(knoxx.backend.infra.redis_client.redis_arg(key)));
if(cljs.core.truth_(temp__5825__auto__)){
var value = temp__5825__auto__;
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(value),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
}catch (e33094){var err = e33094;
console.error("Redis GET JSON error:",err);

return null;
}});
/**
 * Delete a key from Redis.
 */
knoxx.backend.infra.redis_client.del = (async function knoxx$backend$infra$redis_client$del(client,key){
try{return (await client.del(knoxx.backend.infra.redis_client.redis_arg(key)));
}catch (e33108){var err = e33108;
return console.error("Redis DEL error:",err);
}});
/**
 * Add member to set.
 */
knoxx.backend.infra.redis_client.sadd = (async function knoxx$backend$infra$redis_client$sadd(client,key,member){
try{return (await client.sAdd(knoxx.backend.infra.redis_client.redis_arg(key),knoxx.backend.infra.redis_client.redis_arg(member)));
}catch (e33111){var err = e33111;
return console.error("Redis SADD error:",err);
}});
/**
 * Remove member from set.
 */
knoxx.backend.infra.redis_client.srem = (async function knoxx$backend$infra$redis_client$srem(client,key,member){
try{return (await client.sRem(knoxx.backend.infra.redis_client.redis_arg(key),knoxx.backend.infra.redis_client.redis_arg(member)));
}catch (e33122){var err = e33122;
return console.error("Redis SREM error:",err);
}});
/**
 * Get all members of a set.
 */
knoxx.backend.infra.redis_client.smembers = (async function knoxx$backend$infra$redis_client$smembers(client,key){
try{return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1((await client.sMembers(knoxx.backend.infra.redis_client.redis_arg(key))));
}catch (e33128){var err = e33128;
console.error("Redis SMEMBERS error:",err);

return cljs.core.PersistentVector.EMPTY;
}});
/**
 * Set TTL on a key.
 */
knoxx.backend.infra.redis_client.expire = (async function knoxx$backend$infra$redis_client$expire(client,key,ttl_seconds){
try{return (await client.expire(knoxx.backend.infra.redis_client.redis_arg(key),ttl_seconds));
}catch (e33132){var err = e33132;
return console.error("Redis EXPIRE error:",err);
}});
/**
 * Push a value to the head of a Redis list.
 */
knoxx.backend.infra.redis_client.lpush = (async function knoxx$backend$infra$redis_client$lpush(client,key,value){
try{return (await client.lPush(knoxx.backend.infra.redis_client.redis_arg(key),knoxx.backend.infra.redis_client.redis_arg(value)));
}catch (e33135){var err = e33135;
return console.error("Redis LPUSH error:",err);
}});
/**
 * Push a JSON-encoded value to the head of a Redis list.
 */
knoxx.backend.infra.redis_client.lpush_json = (async function knoxx$backend$infra$redis_client$lpush_json(client,key,value){
try{return (await client.lPush(knoxx.backend.infra.redis_client.redis_arg(key),JSON.stringify(cljs.core.clj__GT_js(value))));
}catch (e33138){var err = e33138;
return console.error("Redis LPUSH JSON error:",err);
}});
/**
 * Get a range of elements from a Redis list.
 */
knoxx.backend.infra.redis_client.lrange = (async function knoxx$backend$infra$redis_client$lrange(client,key,start,stop){
try{var items = (await client.lRange(knoxx.backend.infra.redis_client.redis_arg(key),start,stop));
if(cljs.core.truth_(cljs.core.array_QMARK_(items))){
return cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(items));
} else {
return cljs.core.PersistentVector.EMPTY;
}
}catch (e33144){var err = e33144;
console.error("Redis LRANGE error:",err);

return cljs.core.PersistentVector.EMPTY;
}});
/**
 * Get a range of elements from a Redis list, parsing each as JSON.
 */
knoxx.backend.infra.redis_client.lrange_json = (async function knoxx$backend$infra$redis_client$lrange_json(client,key,start,stop){
try{var items = (await client.lRange(knoxx.backend.infra.redis_client.redis_arg(key),start,stop));
if(cljs.core.truth_(cljs.core.array_QMARK_(items))){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (item){
try{return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(item),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e33151){var _ = e33151;
return null;
}}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(items)));
} else {
return cljs.core.PersistentVector.EMPTY;
}
}catch (e33148){var err = e33148;
console.error("Redis LRANGE JSON error:",err);

return cljs.core.PersistentVector.EMPTY;
}});
/**
 * Get the length of a Redis list.
 */
knoxx.backend.infra.redis_client.llen = (async function knoxx$backend$infra$redis_client$llen(client,key){
try{var or__5162__auto__ = (await client.lLen(knoxx.backend.infra.redis_client.redis_arg(key)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
}catch (e33159){var err = e33159;
console.error("Redis LLEN error:",err);

return (0);
}});
/**
 * Ping Redis to check connection.
 */
knoxx.backend.infra.redis_client.ping = (async function knoxx$backend$infra$redis_client$ping(client){
try{return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((await client.ping()),"PONG");
}catch (e33166){var err = e33166;
console.error("Redis PING error:",err);

return false;
}});
/**
 * Close Redis connection.
 */
knoxx.backend.infra.redis_client.quit = (async function knoxx$backend$infra$redis_client$quit(client){
cljs.core.reset_BANG_(knoxx.backend.infra.redis_client.redis_client_STAR_,null);

cljs.core.reset_BANG_(knoxx.backend.infra.redis_client.redis_init_promise_STAR_,null);

if(cljs.core.truth_(client)){
try{return (await client.quit());
}catch (e33169){var err = e33169;
return console.error("Redis QUIT error:",err);
}} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.infra.redis_client.js.map
