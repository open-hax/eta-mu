import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.infra.store.protocol');

/**
 * @interface
 */
knoxx.backend.infra.store.protocol.IStore = function(){};

var knoxx$backend$infra$store$protocol$IStore$_insert$dyn_55168 = (function (this$,doc){
var x__5519__auto__ = (((this$ == null))?null:this$);
var m__5520__auto__ = (knoxx.backend.infra.store.protocol._insert[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(this$,doc) : m__5520__auto__.call(null,this$,doc));
} else {
var m__5518__auto__ = (knoxx.backend.infra.store.protocol._insert["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(this$,doc) : m__5518__auto__.call(null,this$,doc));
} else {
throw cljs.core.missing_protocol("IStore.-insert",this$);
}
}
});
/**
 * Insert one schema-guarded document. Returns Promise<doc>.
 */
knoxx.backend.infra.store.protocol._insert = (function knoxx$backend$infra$store$protocol$_insert(this$,doc){
if((((!((this$ == null)))) && ((!((this$.knoxx$backend$infra$store$protocol$IStore$_insert$arity$2 == null)))))){
return this$.knoxx$backend$infra$store$protocol$IStore$_insert$arity$2(this$,doc);
} else {
return knoxx$backend$infra$store$protocol$IStore$_insert$dyn_55168(this$,doc);
}
});

var knoxx$backend$infra$store$protocol$IStore$_find$dyn_55169 = (function (this$,query){
var x__5519__auto__ = (((this$ == null))?null:this$);
var m__5520__auto__ = (knoxx.backend.infra.store.protocol._find[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(this$,query) : m__5520__auto__.call(null,this$,query));
} else {
var m__5518__auto__ = (knoxx.backend.infra.store.protocol._find["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(this$,query) : m__5518__auto__.call(null,this$,query));
} else {
throw cljs.core.missing_protocol("IStore.-find",this$);
}
}
});
/**
 * Find documents matching a field-equality query map.
 *                     The :limit key caps the result count. Returns Promise<vector>.
 */
knoxx.backend.infra.store.protocol._find = (function knoxx$backend$infra$store$protocol$_find(this$,query){
if((((!((this$ == null)))) && ((!((this$.knoxx$backend$infra$store$protocol$IStore$_find$arity$2 == null)))))){
return this$.knoxx$backend$infra$store$protocol$IStore$_find$arity$2(this$,query);
} else {
return knoxx$backend$infra$store$protocol$IStore$_find$dyn_55169(this$,query);
}
});

/**
 * Insert a document into a store. Returns Promise<doc>.
 */
knoxx.backend.infra.store.protocol.insert_BANG_ = (function knoxx$backend$infra$store$protocol$insert_BANG_(store,doc){
return knoxx.backend.infra.store.protocol._insert(store,doc);
});
/**
 * Query a store. Query is a map of field -> expected value; :limit caps the
 * result count. Returns Promise<vector<doc>>.
 */
knoxx.backend.infra.store.protocol.find_docs = (function knoxx$backend$infra$store$protocol$find_docs(store,query){
return knoxx.backend.infra.store.protocol._find(store,query);
});

//# sourceMappingURL=knoxx.backend.infra.store.protocol.js.map
