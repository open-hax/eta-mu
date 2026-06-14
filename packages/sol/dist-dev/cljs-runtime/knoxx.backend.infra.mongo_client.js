import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.infra.mongo_client');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.mongo_client !== 'undefined') && (typeof knoxx.backend.infra.mongo_client.mongo_client_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.mongo_client.mongo_client_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.mongo_client !== 'undefined') && (typeof knoxx.backend.infra.mongo_client.mongo_db_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.mongo_client.mongo_db_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.mongo_client !== 'undefined') && (typeof knoxx.backend.infra.mongo_client.mongo_init_promise_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.mongo_client.mongo_init_promise_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Resolve MongoDB connection string from environment.
 */
knoxx.backend.infra.mongo_client.mongo_url = (function knoxx$backend$infra$mongo_client$mongo_url(){
var or__5162__auto__ = (process.env["MONGODB_URI"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (process.env["OPENPLANNER_MONGODB_URI"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "mongodb://localhost:27017";
}
}
});
/**
 * Resolve MongoDB database name from environment.
 */
knoxx.backend.infra.mongo_client.mongo_db_name = (function knoxx$backend$infra$mongo_client$mongo_db_name(){
var or__5162__auto__ = (process.env["MONGODB_DB"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (process.env["OPENPLANNER_MONGODB_DB"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "openplanner";
}
}
});
/**
 * Connect to MongoDB and cache client + db. Returns the Db instance.
 */
knoxx.backend.infra.mongo_client.connect_mongo_BANG_ = (async function knoxx$backend$infra$mongo_client$connect_mongo_BANG_(){
try{var MongoClient = require("mongodb").MongoClient;
var url = knoxx.backend.infra.mongo_client.mongo_url();
var client = (new MongoClient(url,({"serverSelectionTimeoutMS": (5000)})));
var _ = (await client.connect());
var db = client.db(knoxx.backend.infra.mongo_client.mongo_db_name());
cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_client_STAR_,client);

cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_db_STAR_,db);

console.log("[mongo-client] Connected to MongoDB:",url,"/",knoxx.backend.infra.mongo_client.mongo_db_name());

return db;
}catch (e25584){var err = e25584;
console.error("[mongo-client] FATAL: failed to connect to MongoDB at",knoxx.backend.infra.mongo_client.mongo_url());

console.error("[mongo-client] Error:",err.message);

if(cljs.core.truth_(err.stack)){
console.error("[mongo-client] Stack:",err.stack);
} else {
}

cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_client_STAR_,null);

cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_db_STAR_,null);

return null;
}finally {cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_init_promise_STAR_,null);
}});
/**
 * Initialize MongoDB connection if not already connected.
 */
knoxx.backend.infra.mongo_client.init_mongo_BANG_ = (async function knoxx$backend$infra$mongo_client$init_mongo_BANG_(){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_db_STAR_))){
return cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_db_STAR_);
} else {
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_init_promise_STAR_))){
return (await cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_init_promise_STAR_));
} else {
var connect_promise = knoxx.backend.infra.mongo_client.connect_mongo_BANG_();
cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_init_promise_STAR_,connect_promise);

return (await connect_promise);

}
}
});
/**
 * Get the current MongoDB Db instance, or nil if not connected.
 */
knoxx.backend.infra.mongo_client.get_db = (function knoxx$backend$infra$mongo_client$get_db(){
return cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_db_STAR_);
});
/**
 * Get the current MongoDB Client instance, or nil if not connected.
 */
knoxx.backend.infra.mongo_client.get_client = (function knoxx$backend$infra$mongo_client$get_client(){
return cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_client_STAR_);
});
/**
 * Close MongoDB connection.
 */
knoxx.backend.infra.mongo_client.close_mongo_BANG_ = (async function knoxx$backend$infra$mongo_client$close_mongo_BANG_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.infra.mongo_client.mongo_client_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var client = temp__5825__auto__;
try{(await client.close());
}catch (e25598){var err_25621 = e25598;
console.error("[mongo-client] Error closing connection:",err_25621);
}
cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_client_STAR_,null);

return cljs.core.reset_BANG_(knoxx.backend.infra.mongo_client.mongo_db_STAR_,null);
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.infra.mongo_client.js.map
