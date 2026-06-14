import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.json.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.extern.fetch');

/**
 * @interface
 */
knoxx.backend.extern.fetch.IHttpClient = function(){};

var knoxx$backend$extern$fetch$IHttpClient$response_BANG_$dyn_29524 = (function (client,request){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.extern.fetch.response_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5520__auto__.call(null,client,request));
} else {
var m__5518__auto__ = (knoxx.backend.extern.fetch.response_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5518__auto__.call(null,client,request));
} else {
throw cljs.core.missing_protocol("IHttpClient.response!",client);
}
}
});
/**
 * Execute request and resolve with the native Response object.
 *   Compatibility escape hatch; prefer json!, text!, or array-buffer!.
 */
knoxx.backend.extern.fetch.response_BANG_ = (function knoxx$backend$extern$fetch$response_BANG_(client,request){
if((((!((client == null)))) && ((!((client.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2 == null)))))){
return client.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2(client,request);
} else {
return knoxx$backend$extern$fetch$IHttpClient$response_BANG_$dyn_29524(client,request);
}
});

var knoxx$backend$extern$fetch$IHttpClient$json_BANG_$dyn_29525 = (function (client,request){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.extern.fetch.json_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5520__auto__.call(null,client,request));
} else {
var m__5518__auto__ = (knoxx.backend.extern.fetch.json_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5518__auto__.call(null,client,request));
} else {
throw cljs.core.missing_protocol("IHttpClient.json!",client);
}
}
});
/**
 * Execute request and resolve with {:ok :status :body :headers}.
 *   :body and :headers are CLJS data.
 */
knoxx.backend.extern.fetch.json_BANG_ = (function knoxx$backend$extern$fetch$json_BANG_(client,request){
if((((!((client == null)))) && ((!((client.knoxx$backend$extern$fetch$IHttpClient$json_BANG_$arity$2 == null)))))){
return client.knoxx$backend$extern$fetch$IHttpClient$json_BANG_$arity$2(client,request);
} else {
return knoxx$backend$extern$fetch$IHttpClient$json_BANG_$dyn_29525(client,request);
}
});

var knoxx$backend$extern$fetch$IHttpClient$text_BANG_$dyn_29528 = (function (client,request){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.extern.fetch.text_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5520__auto__.call(null,client,request));
} else {
var m__5518__auto__ = (knoxx.backend.extern.fetch.text_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5518__auto__.call(null,client,request));
} else {
throw cljs.core.missing_protocol("IHttpClient.text!",client);
}
}
});
/**
 * Execute request and resolve with {:ok :status :body :headers} where :body is text.
 */
knoxx.backend.extern.fetch.text_BANG_ = (function knoxx$backend$extern$fetch$text_BANG_(client,request){
if((((!((client == null)))) && ((!((client.knoxx$backend$extern$fetch$IHttpClient$text_BANG_$arity$2 == null)))))){
return client.knoxx$backend$extern$fetch$IHttpClient$text_BANG_$arity$2(client,request);
} else {
return knoxx$backend$extern$fetch$IHttpClient$text_BANG_$dyn_29528(client,request);
}
});

var knoxx$backend$extern$fetch$IHttpClient$array_buffer_BANG_$dyn_29530 = (function (client,request){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.extern.fetch.array_buffer_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5520__auto__.call(null,client,request));
} else {
var m__5518__auto__ = (knoxx.backend.extern.fetch.array_buffer_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5518__auto__.call(null,client,request));
} else {
throw cljs.core.missing_protocol("IHttpClient.array-buffer!",client);
}
}
});
/**
 * Execute request and resolve with {:ok :status :body :headers} where :body is an ArrayBuffer.
 */
knoxx.backend.extern.fetch.array_buffer_BANG_ = (function knoxx$backend$extern$fetch$array_buffer_BANG_(client,request){
if((((!((client == null)))) && ((!((client.knoxx$backend$extern$fetch$IHttpClient$array_buffer_BANG_$arity$2 == null)))))){
return client.knoxx$backend$extern$fetch$IHttpClient$array_buffer_BANG_$arity$2(client,request);
} else {
return knoxx$backend$extern$fetch$IHttpClient$array_buffer_BANG_$dyn_29530(client,request);
}
});

knoxx.backend.extern.fetch.option_key = (function knoxx$backend$extern$fetch$option_key(k){
if((k instanceof cljs.core.Keyword)){
return cljs.core.name(k);
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k));
}
});
knoxx.backend.extern.fetch.js_option_value = (function knoxx$backend$extern$fetch$js_option_value(k,value){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(k,"headers")){
if(cljs.core.map_QMARK_(value)){
return cljs.core.clj__GT_js(value);
} else {
return value;
}
} else {
if(((cljs.core.map_QMARK_(value)) || (((cljs.core.vector_QMARK_(value)) || (cljs.core.set_QMARK_(value)))))){
return cljs.core.clj__GT_js(value);
} else {
return value;

}
}
});
knoxx.backend.extern.fetch.header_key_QMARK_ = (function knoxx$backend$extern$fetch$header_key_QMARK_(headers,wanted){
return cljs.core.boolean$(cljs.core.some((function (k){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(clojure.string.lower_case(cljs.core.name(k)),wanted);
}),cljs.core.keys(headers)));
});
knoxx.backend.extern.fetch.json_headers = (function knoxx$backend$extern$fetch$json_headers(headers){
var headers__$1 = (function (){var or__5162__auto__ = headers;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
if(knoxx.backend.extern.fetch.header_key_QMARK_(headers__$1,"content-type")){
return headers__$1;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(headers__$1,"Content-Type","application/json");
}
});
knoxx.backend.extern.fetch.request_opts = (function knoxx$backend$extern$fetch$request_opts(p__29262){
var map__29263 = p__29262;
var map__29263__$1 = cljs.core.__destructure_map(map__29263);
var opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29263__$1,new cljs.core.Keyword(null,"opts","opts",155075701));
var method = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29263__$1,new cljs.core.Keyword(null,"method","method",55703592));
var headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29263__$1,new cljs.core.Keyword(null,"headers","headers",-835030129));
var json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29263__$1,new cljs.core.Keyword(null,"json","json",1279968570));
var body = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29263__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var form = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29263__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
var map__29264 = ((cljs.core.map_QMARK_(opts))?new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"method","method",55703592),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"method","method",55703592).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return method;
}
})(),new cljs.core.Keyword(null,"headers","headers",-835030129),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"headers","headers",-835030129).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return headers;
}
})(),new cljs.core.Keyword(null,"json","json",1279968570),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"json","json",1279968570).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return json;
}
})(),new cljs.core.Keyword(null,"body","body",-2049205669),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return body;
}
})(),new cljs.core.Keyword(null,"form","form",-1624062471),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"form","form",-1624062471).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return form;
}
})()], null):new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"headers","headers",-835030129),headers,new cljs.core.Keyword(null,"json","json",1279968570),json,new cljs.core.Keyword(null,"body","body",-2049205669),body,new cljs.core.Keyword(null,"form","form",-1624062471),form], null));
var map__29264__$1 = cljs.core.__destructure_map(map__29264);
var method__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29264__$1,new cljs.core.Keyword(null,"method","method",55703592));
var headers__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29264__$1,new cljs.core.Keyword(null,"headers","headers",-835030129));
var json__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29264__$1,new cljs.core.Keyword(null,"json","json",1279968570));
var body__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29264__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var form__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29264__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
if(cljs.core.truth_((function (){var and__5160__auto__ = opts;
if(cljs.core.truth_(and__5160__auto__)){
return (!(cljs.core.map_QMARK_(opts)));
} else {
return and__5160__auto__;
}
})())){
return opts;
} else {
var G__29275 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),(function (){var or__5162__auto__ = method__$1;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "GET";
}
})()], null);
var G__29275__$1 = ((cljs.core.seq(headers__$1))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29275,new cljs.core.Keyword(null,"headers","headers",-835030129),headers__$1):G__29275);
var G__29275__$2 = (((!((json__$1 == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__29275__$1,new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.extern.fetch.json_headers(headers__$1),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669),knoxx.backend.extern.json.stringify(json__$1)], 0)):G__29275__$1);
var G__29275__$3 = (((!((body__$1 == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29275__$2,new cljs.core.Keyword(null,"body","body",-2049205669),body__$1):G__29275__$2);
if((!((form__$1 == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29275__$3,new cljs.core.Keyword(null,"body","body",-2049205669),form__$1);
} else {
return G__29275__$3;
}
}
});
knoxx.backend.extern.fetch.opts__GT_js = (function knoxx$backend$extern$fetch$opts__GT_js(opts,signal){
var out = (new Object());
if(cljs.core.truth_(opts)){
if(cljs.core.map_QMARK_(opts)){
var seq__29296_29547 = cljs.core.seq(opts);
var chunk__29298_29548 = null;
var count__29299_29549 = (0);
var i__29300_29550 = (0);
while(true){
if((i__29300_29550 < count__29299_29549)){
var vec__29327_29551 = chunk__29298_29548.cljs$core$IIndexed$_nth$arity$2(null,i__29300_29550);
var k_29552 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29327_29551,(0),null);
var value_29553 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29327_29551,(1),null);
if((!((value_29553 == null)))){
var jk_29554 = knoxx.backend.extern.fetch.option_key(k_29552);
(out[jk_29554] = knoxx.backend.extern.fetch.js_option_value(jk_29554,value_29553));
} else {
}


var G__29557 = seq__29296_29547;
var G__29558 = chunk__29298_29548;
var G__29559 = count__29299_29549;
var G__29560 = (i__29300_29550 + (1));
seq__29296_29547 = G__29557;
chunk__29298_29548 = G__29558;
count__29299_29549 = G__29559;
i__29300_29550 = G__29560;
continue;
} else {
var temp__5825__auto___29561 = cljs.core.seq(seq__29296_29547);
if(temp__5825__auto___29561){
var seq__29296_29562__$1 = temp__5825__auto___29561;
if(cljs.core.chunked_seq_QMARK_(seq__29296_29562__$1)){
var c__5694__auto___29563 = cljs.core.chunk_first(seq__29296_29562__$1);
var G__29564 = cljs.core.chunk_rest(seq__29296_29562__$1);
var G__29565 = c__5694__auto___29563;
var G__29566 = cljs.core.count(c__5694__auto___29563);
var G__29567 = (0);
seq__29296_29547 = G__29564;
chunk__29298_29548 = G__29565;
count__29299_29549 = G__29566;
i__29300_29550 = G__29567;
continue;
} else {
var vec__29334_29568 = cljs.core.first(seq__29296_29562__$1);
var k_29569 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29334_29568,(0),null);
var value_29570 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29334_29568,(1),null);
if((!((value_29570 == null)))){
var jk_29574 = knoxx.backend.extern.fetch.option_key(k_29569);
(out[jk_29574] = knoxx.backend.extern.fetch.js_option_value(jk_29574,value_29570));
} else {
}


var G__29575 = cljs.core.next(seq__29296_29562__$1);
var G__29576 = null;
var G__29577 = (0);
var G__29578 = (0);
seq__29296_29547 = G__29575;
chunk__29298_29548 = G__29576;
count__29299_29549 = G__29577;
i__29300_29550 = G__29578;
continue;
}
} else {
}
}
break;
}
} else {
Object.assign(out,opts);
}
} else {
}

if(cljs.core.truth_(signal)){
(out["signal"] = signal);
} else {
}

return out;
});
knoxx.backend.extern.fetch.response__GT_base_map = (function knoxx$backend$extern$fetch$response__GT_base_map(resp){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),resp.ok,new cljs.core.Keyword(null,"status","status",-1997798413),resp.status,new cljs.core.Keyword(null,"headers","headers",-835030129),(function (){var headers = resp.headers;
var acc = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
if(cljs.core.truth_(headers)){
headers.forEach((function (value,key){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(acc,cljs.core.assoc,clojure.string.lower_case(key),value);
}));
} else {
}

return cljs.core.deref(acc);
})()], null);
});
/**
 * Parse a JSON object string into a CLJS map. Returns nil for invalid JSON or
 * non-object values. CLJS maps pass through unchanged.
 */
knoxx.backend.extern.fetch.parse_json_object = (function knoxx$backend$extern$fetch$parse_json_object(value){
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(typeof value === 'string'){
try{var parsed = knoxx.backend.extern.json.to_cljs(JSON.parse(value));
if(cljs.core.map_QMARK_(parsed)){
return parsed;
} else {
return null;
}
}catch (e29362){var _ = e29362;
return null;
}} else {
return null;

}
}
});
knoxx.backend.extern.fetch.parse_json_text = (function knoxx$backend$extern$fetch$parse_json_text(text){
if(clojure.string.blank_QMARK_(text)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
try{return knoxx.backend.extern.json.to_cljs(JSON.parse(text));
}catch (e29369){var _ = e29369;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"raw","raw",1604651272),text], null);
}}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {knoxx.backend.extern.fetch.IHttpClient}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.extern.fetch.NativeFetchClient = (function (default_timeout_ms,fetch_fn,__meta,__extmap,__hash){
this.default_timeout_ms = default_timeout_ms;
this.fetch_fn = fetch_fn;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k29387,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__29402 = k29387;
var G__29402__$1 = (((G__29402 instanceof cljs.core.Keyword))?G__29402.fqn:null);
switch (G__29402__$1) {
case "default-timeout-ms":
return self__.default_timeout_ms;

break;
case "fetch-fn":
return self__.fetch_fn;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k29387,else__5472__auto__);

}
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__29406){
var vec__29407 = p__29406;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29407,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29407,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.extern.fetch.NativeFetchClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),self__.default_timeout_ms],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383),self__.fetch_fn],null))], null),self__.__extmap));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__29386){
var self__ = this;
var G__29386__$1 = this;
return (new cljs.core.RecordIter((0),G__29386__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.extern.fetch.NativeFetchClient(self__.default_timeout_ms,self__.fetch_fn,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.knoxx$backend$extern$fetch$IHttpClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2 = (function (_,p__29426){
var self__ = this;
var map__29427 = p__29426;
var map__29427__$1 = cljs.core.__destructure_map(map__29427);
var request = map__29427__$1;
var url = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29427__$1,new cljs.core.Keyword(null,"url","url",276297046));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29427__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
var ___$1 = this;
var controller = (new AbortController());
var effective_timeout_ms = (function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = self__.default_timeout_ms;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (30000);
}
}
})();
var timeout_id = setTimeout((function (){
return controller.abort();
}),effective_timeout_ms);
var request_init = knoxx.backend.extern.fetch.opts__GT_js(knoxx.backend.extern.fetch.request_opts(request),controller.signal);
var do_fetch = (function (){var or__5162__auto__ = self__.fetch_fn;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fetch;
}
})();
return (do_fetch.cljs$core$IFn$_invoke$arity$2 ? do_fetch.cljs$core$IFn$_invoke$arity$2(url,request_init) : do_fetch.call(null,url,request_init)).finally((function (){
return clearTimeout(timeout_id);
}));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.knoxx$backend$extern$fetch$IHttpClient$json_BANG_$arity$2 = (function (client,request){
var self__ = this;
var client__$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(client__$1.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2(null,request)),(function (resp){
return promesa.protocols._mcat(promesa.protocols._promise(resp.text()),(function (body){
return promesa.protocols._promise(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.extern.fetch.response__GT_base_map(resp),new cljs.core.Keyword(null,"body","body",-2049205669),knoxx.backend.extern.fetch.parse_json_text(body)));
}));
}));
}));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.knoxx$backend$extern$fetch$IHttpClient$text_BANG_$arity$2 = (function (client,request){
var self__ = this;
var client__$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(client__$1.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2(null,request)),(function (resp){
return promesa.protocols._mcat(promesa.protocols._promise(resp.text()),(function (body){
return promesa.protocols._promise(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.extern.fetch.response__GT_base_map(resp),new cljs.core.Keyword(null,"body","body",-2049205669),body));
}));
}));
}));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.knoxx$backend$extern$fetch$IHttpClient$array_buffer_BANG_$arity$2 = (function (client,request){
var self__ = this;
var client__$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(client__$1.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2(null,request)),(function (resp){
return promesa.protocols._mcat(promesa.protocols._promise(resp.arrayBuffer()),(function (body){
return promesa.protocols._promise(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.extern.fetch.response__GT_base_map(resp),new cljs.core.Keyword(null,"body","body",-2049205669),body));
}));
}));
}));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1819047135 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this29388,other29389){
var self__ = this;
var this29388__$1 = this;
return (((!((other29389 == null)))) && ((((this29388__$1.constructor === other29389.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29388__$1.default_timeout_ms,other29389.default_timeout_ms)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29388__$1.fetch_fn,other29389.fetch_fn)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29388__$1.__extmap,other29389.__extmap)))))))));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),null,new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.extern.fetch.NativeFetchClient(self__.default_timeout_ms,self__.fetch_fn,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k29387){
var self__ = this;
var this__5476__auto____$1 = this;
var G__29464 = k29387;
var G__29464__$1 = (((G__29464 instanceof cljs.core.Keyword))?G__29464.fqn:null);
switch (G__29464__$1) {
case "default-timeout-ms":
case "fetch-fn":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k29387);

}
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__29386){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__29472 = cljs.core.keyword_identical_QMARK_;
var expr__29473 = k__5478__auto__;
if(cljs.core.truth_((pred__29472.cljs$core$IFn$_invoke$arity$2 ? pred__29472.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),expr__29473) : pred__29472.call(null,new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),expr__29473)))){
return (new knoxx.backend.extern.fetch.NativeFetchClient(G__29386,self__.fetch_fn,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__29472.cljs$core$IFn$_invoke$arity$2 ? pred__29472.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383),expr__29473) : pred__29472.call(null,new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383),expr__29473)))){
return (new knoxx.backend.extern.fetch.NativeFetchClient(self__.default_timeout_ms,G__29386,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.extern.fetch.NativeFetchClient(self__.default_timeout_ms,self__.fetch_fn,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__29386),null));
}
}
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),self__.default_timeout_ms,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383),self__.fetch_fn,null))], null),self__.__extmap));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__29386){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.extern.fetch.NativeFetchClient(self__.default_timeout_ms,self__.fetch_fn,G__29386,self__.__extmap,self__.__hash));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.extern.fetch.NativeFetchClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"default-timeout-ms","default-timeout-ms",-2042979716,null),new cljs.core.Symbol(null,"fetch-fn","fetch-fn",1682847910,null)], null);
}));

(knoxx.backend.extern.fetch.NativeFetchClient.cljs$lang$type = true);

(knoxx.backend.extern.fetch.NativeFetchClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.extern.fetch/NativeFetchClient",null,(1),null));
}));

(knoxx.backend.extern.fetch.NativeFetchClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.extern.fetch/NativeFetchClient");
}));

/**
 * Positional factory function for knoxx.backend.extern.fetch/NativeFetchClient.
 */
knoxx.backend.extern.fetch.__GT_NativeFetchClient = (function knoxx$backend$extern$fetch$__GT_NativeFetchClient(default_timeout_ms,fetch_fn){
return (new knoxx.backend.extern.fetch.NativeFetchClient(default_timeout_ms,fetch_fn,null,null,null));
});

/**
 * Factory function for knoxx.backend.extern.fetch/NativeFetchClient, taking a map of keywords to field values.
 */
knoxx.backend.extern.fetch.map__GT_NativeFetchClient = (function knoxx$backend$extern$fetch$map__GT_NativeFetchClient(G__29396){
var extmap__5511__auto__ = (function (){var G__29487 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__29396,new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383)], 0));
if(cljs.core.record_QMARK_(G__29396)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__29487);
} else {
return G__29487;
}
})();
return (new knoxx.backend.extern.fetch.NativeFetchClient(new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053).cljs$core$IFn$_invoke$arity$1(G__29396),new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383).cljs$core$IFn$_invoke$arity$1(G__29396),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.extern.fetch.default_client = knoxx.backend.extern.fetch.__GT_NativeFetchClient((30000),null);
knoxx.backend.extern.fetch.native_client = (function knoxx$backend$extern$fetch$native_client(var_args){
var G__29500 = arguments.length;
switch (G__29500) {
case 0:
return knoxx.backend.extern.fetch.native_client.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.extern.fetch.native_client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.extern.fetch.native_client.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.extern.fetch.native_client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.extern.fetch.native_client.cljs$core$IFn$_invoke$arity$1 = (function (p__29508){
var map__29511 = p__29508;
var map__29511__$1 = cljs.core.__destructure_map(map__29511);
var default_timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29511__$1,new cljs.core.Keyword(null,"default-timeout-ms","default-timeout-ms",611456053));
var fetch_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29511__$1,new cljs.core.Keyword(null,"fetch-fn","fetch-fn",42316383));
return knoxx.backend.extern.fetch.__GT_NativeFetchClient((function (){var or__5162__auto__ = default_timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})(),fetch_fn);
}));

(knoxx.backend.extern.fetch.native_client.cljs$lang$maxFixedArity = 1);


//# sourceMappingURL=knoxx.backend.extern.fetch.js.map
