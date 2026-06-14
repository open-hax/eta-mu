import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.esm.esm_import$pg.js";
goog.provide('knoxx.backend.extern.pg');
knoxx.backend.extern.pg.create_pool_BANG_ = (function knoxx$backend$extern$pg$create_pool_BANG_(p__28634){
var map__28636 = p__28634;
var map__28636__$1 = cljs.core.__destructure_map(map__28636);
var connection_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28636__$1,new cljs.core.Keyword(null,"connection-string","connection-string",71626353));
var max = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28636__$1,new cljs.core.Keyword(null,"max","max",61366548));
var idle_timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28636__$1,new cljs.core.Keyword(null,"idle-timeout-ms","idle-timeout-ms",1806965382));
var connect_timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28636__$1,new cljs.core.Keyword(null,"connect-timeout-ms","connect-timeout-ms",-86082976));
return (new shadow.esm.esm_import$pg.Pool(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"connectionString","connectionString",631814971),connection_string,new cljs.core.Keyword(null,"max","max",61366548),(function (){var or__5162__auto__ = max;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (6);
}
})(),new cljs.core.Keyword(null,"idleTimeoutMillis","idleTimeoutMillis",-229649233),(function (){var or__5162__auto__ = idle_timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})(),new cljs.core.Keyword(null,"connectionTimeoutMillis","connectionTimeoutMillis",-1543900585),(function (){var or__5162__auto__ = connect_timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),new cljs.core.Keyword(null,"allowExitOnIdle","allowExitOnIdle",-916282161),true], null))));
});
knoxx.backend.extern.pg.keywordize_rows = (function knoxx$backend$extern$pg$keywordize_rows(result){
var r = (cljs.core.truth_(Array.isArray(result))?(result[(result.length - (1))]):result);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"rows","rows",850049680),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__28652_SHARP_){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(p1__28652_SHARP_,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(r.rows)),new cljs.core.Keyword(null,"row-count","row-count",1060167988),r.rowCount], null);
});
/**
 * Execute parameterized SQL against pool-or-client.
 * Returns Promise<{:rows [keywordized-CLJS-maps] :row-count N}>.
 */
knoxx.backend.extern.pg.query_BANG_ = (function knoxx$backend$extern$pg$query_BANG_(conn,sql_str,params){
var params_arr = ((cljs.core.seq(params))?cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(params):null);
return conn.query(sql_str,params_arr).then(knoxx.backend.extern.pg.keywordize_rows);
});
/**
 * Execute SQL and return Promise<first-row-as-CLJS-map | nil>.
 */
knoxx.backend.extern.pg.query_one_BANG_ = (function knoxx$backend$extern$pg$query_one_BANG_(conn,sql_str,params){
return knoxx.backend.extern.pg.query_BANG_(conn,sql_str,params).then((function (p__28677){
var map__28678 = p__28677;
var map__28678__$1 = cljs.core.__destructure_map(map__28678);
var rows = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28678__$1,new cljs.core.Keyword(null,"rows","rows",850049680));
return cljs.core.first(rows);
}));
});
/**
 * Run (f client) inside a PG transaction.
 * f receives a pg client; pass it to query!/query-one! in place of the pool.
 */
knoxx.backend.extern.pg.with_transaction_BANG_ = (function knoxx$backend$extern$pg$with_transaction_BANG_(pool,f){
return pool.connect().then((function (client){
return client.query("BEGIN").then((function (){
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(client) : f.call(null,client));
})).then((function (result){
return client.query("COMMIT").then((function (){
return client.release(true);
})).then((function (){
return result;
}));
})).catch((function (err){
return client.query("ROLLBACK").then((function (){
return client.release(false);
})).then((function (){
throw err;
}));
}));
}));
});
/**
 * Attach an error handler to the pool.
 */
knoxx.backend.extern.pg.on_pool_error_BANG_ = (function knoxx$backend$extern$pg$on_pool_error_BANG_(pool,handler){
return pool.on("error",handler);
});
/**
 * Attach a connect handler to the pool.
 */
knoxx.backend.extern.pg.on_pool_connect_BANG_ = (function knoxx$backend$extern$pg$on_pool_connect_BANG_(pool,handler){
return pool.on("connect",handler);
});
/**
 * Drain the pool.
 */
knoxx.backend.extern.pg.end_pool_BANG_ = (function knoxx$backend$extern$pg$end_pool_BANG_(pool){
return pool.end();
});

//# sourceMappingURL=knoxx.backend.extern.pg.js.map
