import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.infra.clients.opencode');

/**
 * @interface
 */
knoxx.backend.infra.clients.opencode.IOpenCodeClient = function(){};

var knoxx$backend$infra$clients$opencode$IOpenCodeClient$health_BANG_$dyn_38280 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.opencode.health_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.opencode.health_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenCodeClient.health!",client);
}
}
});
knoxx.backend.infra.clients.opencode.health_BANG_ = (function knoxx$backend$infra$clients$opencode$health_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$opencode$IOpenCodeClient$health_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$opencode$IOpenCodeClient$health_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$opencode$IOpenCodeClient$health_BANG_$dyn_38280(client);
}
});

var knoxx$backend$infra$clients$opencode$IOpenCodeClient$sessions_BANG_$dyn_38283 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.opencode.sessions_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.opencode.sessions_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenCodeClient.sessions!",client);
}
}
});
knoxx.backend.infra.clients.opencode.sessions_BANG_ = (function knoxx$backend$infra$clients$opencode$sessions_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$opencode$IOpenCodeClient$sessions_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$opencode$IOpenCodeClient$sessions_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$opencode$IOpenCodeClient$sessions_BANG_$dyn_38283(client,opts);
}
});

var knoxx$backend$infra$clients$opencode$IOpenCodeClient$session_messages_BANG_$dyn_38296 = (function (client,session_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.opencode.session_messages_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,session_id) : m__5520__auto__.call(null,client,session_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.opencode.session_messages_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,session_id) : m__5518__auto__.call(null,client,session_id));
} else {
throw cljs.core.missing_protocol("IOpenCodeClient.session-messages!",client);
}
}
});
knoxx.backend.infra.clients.opencode.session_messages_BANG_ = (function knoxx$backend$infra$clients$opencode$session_messages_BANG_(client,session_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$opencode$IOpenCodeClient$session_messages_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$opencode$IOpenCodeClient$session_messages_BANG_$arity$2(client,session_id);
} else {
return knoxx$backend$infra$clients$opencode$IOpenCodeClient$session_messages_BANG_$dyn_38296(client,session_id);
}
});

knoxx.backend.infra.clients.opencode.blank__GT_nil = (function knoxx$backend$infra$clients$opencode$blank__GT_nil(value){
var s = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(s)){
return null;
} else {
return s;
}
});
knoxx.backend.infra.clients.opencode.env = (function knoxx$backend$infra$clients$opencode$env(name){
var G__37923 = process;
var G__37923__$1 = (((G__37923 == null))?null:G__37923.env);
var G__37923__$2 = (((G__37923__$1 == null))?null:(G__37923__$1[name]));
if((G__37923__$2 == null)){
return null;
} else {
return knoxx.backend.infra.clients.opencode.blank__GT_nil(G__37923__$2);
}
});
knoxx.backend.infra.clients.opencode.base_url = (function knoxx$backend$infra$clients$opencode$base_url(config){
return clojure.string.replace((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"opencode-server-url","opencode-server-url",1944561220).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.clients.opencode.env("OPENCODE_SERVER_URL");
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "http://127.0.0.1:4096";
}
}
})(),/\/+$/,"");
});
knoxx.backend.infra.clients.opencode.basic_auth_token = (function knoxx$backend$infra$clients$opencode$basic_auth_token(){
var password = knoxx.backend.infra.clients.opencode.env("OPENCODE_SERVER_PASSWORD");
var username = (function (){var or__5162__auto__ = knoxx.backend.infra.clients.opencode.env("OPENCODE_SERVER_USERNAME");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "opencode";
}
})();
var Buffer = (globalThis["Buffer"]);
if(cljs.core.truth_((function (){var and__5160__auto__ = password;
if(cljs.core.truth_(and__5160__auto__)){
return Buffer;
} else {
return and__5160__auto__;
}
})())){
return Buffer.from((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(username)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(password)),"utf8").toString("base64");
} else {
return null;
}
});
knoxx.backend.infra.clients.opencode.auth_headers = (function knoxx$backend$infra$clients$opencode$auth_headers(){
var G__37996 = new cljs.core.PersistentArrayMap(null, 1, ["accept","application/json"], null);
if(cljs.core.truth_(knoxx.backend.infra.clients.opencode.basic_auth_token())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__37996,"authorization",(""+"Basic "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.opencode.basic_auth_token())));
} else {
return G__37996;
}
});
knoxx.backend.infra.clients.opencode.present_query_value_QMARK_ = (function knoxx$backend$infra$clients$opencode$present_query_value_QMARK_(value){
return (((!((value == null)))) && ((!(((typeof value === 'string') && (clojure.string.blank_QMARK_(value)))))));
});
knoxx.backend.infra.clients.opencode.append_query_BANG_ = (function knoxx$backend$infra$clients$opencode$append_query_BANG_(url,params){
var seq__38031_38313 = cljs.core.seq((function (){var or__5162__auto__ = params;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var chunk__38032_38314 = null;
var count__38033_38315 = (0);
var i__38034_38316 = (0);
while(true){
if((i__38034_38316 < count__38033_38315)){
var vec__38068_38317 = chunk__38032_38314.cljs$core$IIndexed$_nth$arity$2(null,i__38034_38316);
var k_38318 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__38068_38317,(0),null);
var v_38319 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__38068_38317,(1),null);
if(knoxx.backend.infra.clients.opencode.present_query_value_QMARK_(v_38319)){
url.searchParams.set(cljs.core.name(k_38318),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v_38319)));
} else {
}


var G__38321 = seq__38031_38313;
var G__38322 = chunk__38032_38314;
var G__38323 = count__38033_38315;
var G__38324 = (i__38034_38316 + (1));
seq__38031_38313 = G__38321;
chunk__38032_38314 = G__38322;
count__38033_38315 = G__38323;
i__38034_38316 = G__38324;
continue;
} else {
var temp__5825__auto___38325 = cljs.core.seq(seq__38031_38313);
if(temp__5825__auto___38325){
var seq__38031_38326__$1 = temp__5825__auto___38325;
if(cljs.core.chunked_seq_QMARK_(seq__38031_38326__$1)){
var c__5694__auto___38327 = cljs.core.chunk_first(seq__38031_38326__$1);
var G__38328 = cljs.core.chunk_rest(seq__38031_38326__$1);
var G__38329 = c__5694__auto___38327;
var G__38330 = cljs.core.count(c__5694__auto___38327);
var G__38331 = (0);
seq__38031_38313 = G__38328;
chunk__38032_38314 = G__38329;
count__38033_38315 = G__38330;
i__38034_38316 = G__38331;
continue;
} else {
var vec__38090_38332 = cljs.core.first(seq__38031_38326__$1);
var k_38333 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__38090_38332,(0),null);
var v_38334 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__38090_38332,(1),null);
if(knoxx.backend.infra.clients.opencode.present_query_value_QMARK_(v_38334)){
url.searchParams.set(cljs.core.name(k_38333),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v_38334)));
} else {
}


var G__38335 = cljs.core.next(seq__38031_38326__$1);
var G__38336 = null;
var G__38337 = (0);
var G__38338 = (0);
seq__38031_38313 = G__38335;
chunk__38032_38314 = G__38336;
count__38033_38315 = G__38337;
i__38034_38316 = G__38338;
continue;
}
} else {
}
}
break;
}

return url;
});
knoxx.backend.infra.clients.opencode.response_body_BANG_ = (function knoxx$backend$infra$clients$opencode$response_body_BANG_(resp,label){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"nextCursor","nextCursor",-26071595),cljs.core.get.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"headers","headers",-835030129).cljs$core$IFn$_invoke$arity$1(resp),"x-next-cursor")], null);
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" failed ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))));
}
});
knoxx.backend.infra.clients.opencode.request_json_BANG_ = (function knoxx$backend$infra$clients$opencode$request_json_BANG_(http_client,config,api_path,params){
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.infra.clients.opencode.append_query_BANG_((new URL((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.opencode.base_url(config))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(api_path)))),params).toString(),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.clients.opencode.auth_headers()], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(60000)], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.infra.clients.opencode.response_body_BANG_(resp,"OpenCode request"));
}));
}));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {knoxx.backend.infra.clients.opencode.IOpenCodeClient}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.clients.opencode.FetchOpenCodeClient = (function (config,http_client,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k38172,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__38212 = k38172;
var G__38212__$1 = (((G__38212 instanceof cljs.core.Keyword))?G__38212.fqn:null);
switch (G__38212__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k38172,else__5472__auto__);

}
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__38216){
var vec__38218 = p__38216;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__38218,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__38218,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.clients.opencode.FetchOpenCodeClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__38171){
var self__ = this;
var G__38171__$1 = this;
return (new cljs.core.RecordIter((0),G__38171__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(self__.config,self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-563907033 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this38173,other38174){
var self__ = this;
var this38173__$1 = this;
return (((!((other38174 == null)))) && ((((this38173__$1.constructor === other38174.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this38173__$1.config,other38174.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this38173__$1.http_client,other38174.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this38173__$1.__extmap,other38174.__extmap)))))))));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(self__.config,self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k38172){
var self__ = this;
var this__5476__auto____$1 = this;
var G__38234 = k38172;
var G__38234__$1 = (((G__38234 instanceof cljs.core.Keyword))?G__38234.fqn:null);
switch (G__38234__$1) {
case "config":
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k38172);

}
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__38171){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__38240 = cljs.core.keyword_identical_QMARK_;
var expr__38241 = k__5478__auto__;
if(cljs.core.truth_((pred__38240.cljs$core$IFn$_invoke$arity$2 ? pred__38240.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__38241) : pred__38240.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__38241)))){
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(G__38171,self__.http_client,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__38240.cljs$core$IFn$_invoke$arity$2 ? pred__38240.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__38241) : pred__38240.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__38241)))){
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(self__.config,G__38171,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(self__.config,self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__38171),null));
}
}
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__38171){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(self__.config,self__.http_client,G__38171,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.knoxx$backend$infra$clients$opencode$IOpenCodeClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.knoxx$backend$infra$clients$opencode$IOpenCodeClient$health_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.opencode.request_json_BANG_(self__.http_client,self__.config,"/global/health",cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.knoxx$backend$infra$clients$opencode$IOpenCodeClient$sessions_BANG_$arity$2 = (function (_,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.opencode.request_json_BANG_(self__.http_client,self__.config,"/experimental/session",opts);
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.knoxx$backend$infra$clients$opencode$IOpenCodeClient$session_messages_BANG_$arity$2 = (function (_,session_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.opencode.request_json_BANG_(self__.http_client,self__.config,(""+"/session/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id))))+"/message"),cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.cljs$lang$type = true);

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.clients.opencode/FetchOpenCodeClient",null,(1),null));
}));

(knoxx.backend.infra.clients.opencode.FetchOpenCodeClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.clients.opencode/FetchOpenCodeClient");
}));

/**
 * Positional factory function for knoxx.backend.infra.clients.opencode/FetchOpenCodeClient.
 */
knoxx.backend.infra.clients.opencode.__GT_FetchOpenCodeClient = (function knoxx$backend$infra$clients$opencode$__GT_FetchOpenCodeClient(config,http_client){
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(config,http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.clients.opencode/FetchOpenCodeClient, taking a map of keywords to field values.
 */
knoxx.backend.infra.clients.opencode.map__GT_FetchOpenCodeClient = (function knoxx$backend$infra$clients$opencode$map__GT_FetchOpenCodeClient(G__38187){
var extmap__5511__auto__ = (function (){var G__38250 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__38187,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], 0));
if(cljs.core.record_QMARK_(G__38187)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__38250);
} else {
return G__38250;
}
})();
return (new knoxx.backend.infra.clients.opencode.FetchOpenCodeClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__38187),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__38187),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.clients.opencode.client = (function knoxx$backend$infra$clients$opencode$client(var_args){
var G__38258 = arguments.length;
switch (G__38258) {
case 0:
return knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.opencode.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__38264){
var map__38265 = p__38264;
var map__38265__$1 = cljs.core.__destructure_map(map__38265);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__38265__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.infra.clients.opencode.__GT_FetchOpenCodeClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.infra.clients.opencode.client.cljs$lang$maxFixedArity = 2);

knoxx.backend.infra.clients.opencode.server_url = (function knoxx$backend$infra$clients$opencode$server_url(config){
return knoxx.backend.infra.clients.opencode.base_url(config);
});

//# sourceMappingURL=knoxx.backend.infra.clients.opencode.js.map
