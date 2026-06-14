import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('open_hax.contract_runtime.store.protocol');

/**
 * @interface
 */
open_hax.contract_runtime.store.protocol.IStore = function(){};

var open_hax$contract_runtime$store$protocol$IStore$_insert$dyn_22219 = (function (this$,doc){
var x__5519__auto__ = (((this$ == null))?null:this$);
var m__5520__auto__ = (open_hax.contract_runtime.store.protocol._insert[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(this$,doc) : m__5520__auto__.call(null,this$,doc));
} else {
var m__5518__auto__ = (open_hax.contract_runtime.store.protocol._insert["_"]);
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
open_hax.contract_runtime.store.protocol._insert = (function open_hax$contract_runtime$store$protocol$_insert(this$,doc){
if((((!((this$ == null)))) && ((!((this$.open_hax$contract_runtime$store$protocol$IStore$_insert$arity$2 == null)))))){
return this$.open_hax$contract_runtime$store$protocol$IStore$_insert$arity$2(this$,doc);
} else {
return open_hax$contract_runtime$store$protocol$IStore$_insert$dyn_22219(this$,doc);
}
});

var open_hax$contract_runtime$store$protocol$IStore$_find$dyn_22220 = (function (this$,query){
var x__5519__auto__ = (((this$ == null))?null:this$);
var m__5520__auto__ = (open_hax.contract_runtime.store.protocol._find[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(this$,query) : m__5520__auto__.call(null,this$,query));
} else {
var m__5518__auto__ = (open_hax.contract_runtime.store.protocol._find["_"]);
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
open_hax.contract_runtime.store.protocol._find = (function open_hax$contract_runtime$store$protocol$_find(this$,query){
if((((!((this$ == null)))) && ((!((this$.open_hax$contract_runtime$store$protocol$IStore$_find$arity$2 == null)))))){
return this$.open_hax$contract_runtime$store$protocol$IStore$_find$arity$2(this$,query);
} else {
return open_hax$contract_runtime$store$protocol$IStore$_find$dyn_22220(this$,query);
}
});

/**
 * Insert a document into a store. Returns Promise<doc>.
 */
open_hax.contract_runtime.store.protocol.insert_BANG_ = (function open_hax$contract_runtime$store$protocol$insert_BANG_(store,doc){
return open_hax.contract_runtime.store.protocol._insert(store,doc);
});
/**
 * Query a store. Query is a map of field -> expected value; :limit caps the
 * result count. Returns Promise<vector<doc>>.
 */
open_hax.contract_runtime.store.protocol.find_docs = (function open_hax$contract_runtime$store$protocol$find_docs(store,query){
return open_hax.contract_runtime.store.protocol._find(store,query);
});

//# sourceMappingURL=open_hax.contract_runtime.store.protocol.js.map
