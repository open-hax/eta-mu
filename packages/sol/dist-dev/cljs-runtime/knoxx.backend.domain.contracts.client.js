import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.contracts.client');

/**
 * @interface
 */
knoxx.backend.domain.contracts.client.IContractLibrarianClient = function(){};

var knoxx$backend$domain$contracts$client$IContractLibrarianClient$list_contracts_BANG_$dyn_34397 = (function (client,klass){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.contracts.client.list_contracts_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,klass) : m__5520__auto__.call(null,client,klass));
} else {
var m__5518__auto__ = (knoxx.backend.domain.contracts.client.list_contracts_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,klass) : m__5518__auto__.call(null,client,klass));
} else {
throw cljs.core.missing_protocol("IContractLibrarianClient.list-contracts!",client);
}
}
});
knoxx.backend.domain.contracts.client.list_contracts_BANG_ = (function knoxx$backend$domain$contracts$client$list_contracts_BANG_(client,klass){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$list_contracts_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$list_contracts_BANG_$arity$2(client,klass);
} else {
return knoxx$backend$domain$contracts$client$IContractLibrarianClient$list_contracts_BANG_$dyn_34397(client,klass);
}
});

var knoxx$backend$domain$contracts$client$IContractLibrarianClient$read_contract_BANG_$dyn_34399 = (function (client,klass,contract_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.contracts.client.read_contract_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,klass,contract_id) : m__5520__auto__.call(null,client,klass,contract_id));
} else {
var m__5518__auto__ = (knoxx.backend.domain.contracts.client.read_contract_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,klass,contract_id) : m__5518__auto__.call(null,client,klass,contract_id));
} else {
throw cljs.core.missing_protocol("IContractLibrarianClient.read-contract!",client);
}
}
});
knoxx.backend.domain.contracts.client.read_contract_BANG_ = (function knoxx$backend$domain$contracts$client$read_contract_BANG_(client,klass,contract_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$read_contract_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$read_contract_BANG_$arity$3(client,klass,contract_id);
} else {
return knoxx$backend$domain$contracts$client$IContractLibrarianClient$read_contract_BANG_$dyn_34399(client,klass,contract_id);
}
});

var knoxx$backend$domain$contracts$client$IContractLibrarianClient$write_contract_BANG_$dyn_34400 = (function (client,klass,contract_id,edn_text){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.contracts.client.write_contract_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,klass,contract_id,edn_text) : m__5520__auto__.call(null,client,klass,contract_id,edn_text));
} else {
var m__5518__auto__ = (knoxx.backend.domain.contracts.client.write_contract_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,klass,contract_id,edn_text) : m__5518__auto__.call(null,client,klass,contract_id,edn_text));
} else {
throw cljs.core.missing_protocol("IContractLibrarianClient.write-contract!",client);
}
}
});
knoxx.backend.domain.contracts.client.write_contract_BANG_ = (function knoxx$backend$domain$contracts$client$write_contract_BANG_(client,klass,contract_id,edn_text){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$write_contract_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$write_contract_BANG_$arity$4(client,klass,contract_id,edn_text);
} else {
return knoxx$backend$domain$contracts$client$IContractLibrarianClient$write_contract_BANG_$dyn_34400(client,klass,contract_id,edn_text);
}
});

var knoxx$backend$domain$contracts$client$IContractLibrarianClient$validate_contract_BANG_$dyn_34402 = (function (client,klass,edn_text){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.contracts.client.validate_contract_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,klass,edn_text) : m__5520__auto__.call(null,client,klass,edn_text));
} else {
var m__5518__auto__ = (knoxx.backend.domain.contracts.client.validate_contract_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,klass,edn_text) : m__5518__auto__.call(null,client,klass,edn_text));
} else {
throw cljs.core.missing_protocol("IContractLibrarianClient.validate-contract!",client);
}
}
});
knoxx.backend.domain.contracts.client.validate_contract_BANG_ = (function knoxx$backend$domain$contracts$client$validate_contract_BANG_(client,klass,edn_text){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$validate_contract_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$contracts$client$IContractLibrarianClient$validate_contract_BANG_$arity$3(client,klass,edn_text);
} else {
return knoxx$backend$domain$contracts$client$IContractLibrarianClient$validate_contract_BANG_$dyn_34402(client,klass,edn_text);
}
});

knoxx.backend.domain.contracts.client.trim_trailing_slashes = (function knoxx$backend$domain$contracts$client$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.domain.contracts.client.class_query = (function knoxx$backend$domain$contracts$client$class_query(klass){
return (""+"?kind="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent((function (){var or__5162__auto__ = klass;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "agents";
}
})())));
});
knoxx.backend.domain.contracts.client.contract_url = (function knoxx$backend$domain$contracts$client$contract_url(base_url,path){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.contracts.client.trim_trailing_slashes(base_url))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path));
});
knoxx.backend.domain.contracts.client.text_request_BANG_ = (function knoxx$backend$domain$contracts$client$text_request_BANG_(http_client,base_url,method,path,opts){
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.text_BANG_(http_client,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.contracts.client.contract_url(base_url,path),new cljs.core.Keyword(null,"opts","opts",155075701),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),method], null),opts], 0)),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(30000)], null))),(function (resp){
return promesa.protocols._promise(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], null));
}));
}));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {knoxx.backend.domain.contracts.client.IContractLibrarianClient}
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
knoxx.backend.domain.contracts.client.FetchContractLibrarianClient = (function (base_url,http_client,__meta,__extmap,__hash){
this.base_url = base_url;
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k34288,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__34293 = k34288;
var G__34293__$1 = (((G__34293 instanceof cljs.core.Keyword))?G__34293.fqn:null);
switch (G__34293__$1) {
case "base-url":
return self__.base_url;

break;
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k34288,else__5472__auto__);

}
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__34298){
var vec__34299 = p__34298;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__34299,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__34299,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.contracts.client.FetchContractLibrarianClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"base-url","base-url",9540398),self__.base_url],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__34287){
var self__ = this;
var G__34287__$1 = this;
return (new cljs.core.RecordIter((0),G__34287__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"base-url","base-url",9540398),new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.knoxx$backend$domain$contracts$client$IContractLibrarianClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.knoxx$backend$domain$contracts$client$IContractLibrarianClient$list_contracts_BANG_$arity$2 = (function (_,klass){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.contracts.client.text_request_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),self__.base_url,"GET",(""+"/api/agent/contracts"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.contracts.client.class_query(klass))),null);
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.knoxx$backend$domain$contracts$client$IContractLibrarianClient$read_contract_BANG_$arity$3 = (function (_,klass,contract_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.contracts.client.text_request_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),self__.base_url,"GET",(""+"/api/agent/contracts/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(contract_id))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.contracts.client.class_query(klass))),null);
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.knoxx$backend$domain$contracts$client$IContractLibrarianClient$write_contract_BANG_$arity$4 = (function (_,klass,contract_id,edn_text){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.contracts.client.text_request_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),self__.base_url,"PUT",(""+"/api/agent/contracts/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(contract_id))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.contracts.client.class_query(klass))),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","text/plain; charset=utf-8"], null),new cljs.core.Keyword(null,"body","body",-2049205669),edn_text], null));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.knoxx$backend$domain$contracts$client$IContractLibrarianClient$validate_contract_BANG_$arity$3 = (function (_,klass,edn_text){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.contracts.client.contract_url(self__.base_url,"/api/agent/contracts/validate"),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null),new cljs.core.Keyword(null,"json","json",1279968570),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"edn_text","edn_text",258296122),edn_text,new cljs.core.Keyword(null,"contract_class","contract_class",490905262),klass], null)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(30000)], null))),(function (resp){
return promesa.protocols._promise(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
}));
}));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(self__.base_url,self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1514221916 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this34289,other34290){
var self__ = this;
var this34289__$1 = this;
return (((!((other34290 == null)))) && ((((this34289__$1.constructor === other34290.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this34289__$1.base_url,other34290.base_url)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this34289__$1.http_client,other34290.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this34289__$1.__extmap,other34290.__extmap)))))))));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"base-url","base-url",9540398),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(self__.base_url,self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k34288){
var self__ = this;
var this__5476__auto____$1 = this;
var G__34347 = k34288;
var G__34347__$1 = (((G__34347 instanceof cljs.core.Keyword))?G__34347.fqn:null);
switch (G__34347__$1) {
case "base-url":
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k34288);

}
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__34287){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__34350 = cljs.core.keyword_identical_QMARK_;
var expr__34351 = k__5478__auto__;
if(cljs.core.truth_((pred__34350.cljs$core$IFn$_invoke$arity$2 ? pred__34350.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"base-url","base-url",9540398),expr__34351) : pred__34350.call(null,new cljs.core.Keyword(null,"base-url","base-url",9540398),expr__34351)))){
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(G__34287,self__.http_client,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__34350.cljs$core$IFn$_invoke$arity$2 ? pred__34350.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__34351) : pred__34350.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__34351)))){
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(self__.base_url,G__34287,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(self__.base_url,self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__34287),null));
}
}
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"base-url","base-url",9540398),self__.base_url,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__34287){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(self__.base_url,self__.http_client,G__34287,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"base-url","base-url",1650071925,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.cljs$lang$type = true);

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.contracts.client/FetchContractLibrarianClient",null,(1),null));
}));

(knoxx.backend.domain.contracts.client.FetchContractLibrarianClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.contracts.client/FetchContractLibrarianClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.contracts.client/FetchContractLibrarianClient.
 */
knoxx.backend.domain.contracts.client.__GT_FetchContractLibrarianClient = (function knoxx$backend$domain$contracts$client$__GT_FetchContractLibrarianClient(base_url,http_client){
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(base_url,http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.contracts.client/FetchContractLibrarianClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.contracts.client.map__GT_FetchContractLibrarianClient = (function knoxx$backend$domain$contracts$client$map__GT_FetchContractLibrarianClient(G__34292){
var extmap__5511__auto__ = (function (){var G__34373 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__34292,new cljs.core.Keyword(null,"base-url","base-url",9540398),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], 0));
if(cljs.core.record_QMARK_(G__34292)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__34373);
} else {
return G__34373;
}
})();
return (new knoxx.backend.domain.contracts.client.FetchContractLibrarianClient(new cljs.core.Keyword(null,"base-url","base-url",9540398).cljs$core$IFn$_invoke$arity$1(G__34292),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__34292),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.contracts.client.client = (function knoxx$backend$domain$contracts$client$client(var_args){
var G__34382 = arguments.length;
switch (G__34382) {
case 1:
return knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__34383){
var map__34384 = p__34383;
var map__34384__$1 = cljs.core.__destructure_map(map__34384);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34384__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.domain.contracts.client.__GT_FetchContractLibrarianClient((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.domain.contracts.client.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.domain.contracts.client.js.map
