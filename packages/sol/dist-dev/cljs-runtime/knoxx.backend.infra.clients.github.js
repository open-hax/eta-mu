import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.infra.clients.github');

/**
 * @interface
 */
knoxx.backend.infra.clients.github.IGitHubClient = function(){};

var knoxx$backend$infra$clients$github$IGitHubClient$oauth_access_token_BANG_$dyn_29719 = (function (client,code,redirect_uri){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.github.oauth_access_token_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,code,redirect_uri) : m__5520__auto__.call(null,client,code,redirect_uri));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.github.oauth_access_token_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,code,redirect_uri) : m__5518__auto__.call(null,client,code,redirect_uri));
} else {
throw cljs.core.missing_protocol("IGitHubClient.oauth-access-token!",client);
}
}
});
knoxx.backend.infra.clients.github.oauth_access_token_BANG_ = (function knoxx$backend$infra$clients$github$oauth_access_token_BANG_(client,code,redirect_uri){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$github$IGitHubClient$oauth_access_token_BANG_$arity$3 == null)))))){
return client.knoxx$backend$infra$clients$github$IGitHubClient$oauth_access_token_BANG_$arity$3(client,code,redirect_uri);
} else {
return knoxx$backend$infra$clients$github$IGitHubClient$oauth_access_token_BANG_$dyn_29719(client,code,redirect_uri);
}
});

var knoxx$backend$infra$clients$github$IGitHubClient$authenticated_user_BANG_$dyn_29728 = (function (client,access_token){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.github.authenticated_user_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,access_token) : m__5520__auto__.call(null,client,access_token));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.github.authenticated_user_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,access_token) : m__5518__auto__.call(null,client,access_token));
} else {
throw cljs.core.missing_protocol("IGitHubClient.authenticated-user!",client);
}
}
});
knoxx.backend.infra.clients.github.authenticated_user_BANG_ = (function knoxx$backend$infra$clients$github$authenticated_user_BANG_(client,access_token){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$github$IGitHubClient$authenticated_user_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$github$IGitHubClient$authenticated_user_BANG_$arity$2(client,access_token);
} else {
return knoxx$backend$infra$clients$github$IGitHubClient$authenticated_user_BANG_$dyn_29728(client,access_token);
}
});

var knoxx$backend$infra$clients$github$IGitHubClient$authenticated_emails_BANG_$dyn_29731 = (function (client,access_token){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.github.authenticated_emails_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,access_token) : m__5520__auto__.call(null,client,access_token));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.github.authenticated_emails_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,access_token) : m__5518__auto__.call(null,client,access_token));
} else {
throw cljs.core.missing_protocol("IGitHubClient.authenticated-emails!",client);
}
}
});
knoxx.backend.infra.clients.github.authenticated_emails_BANG_ = (function knoxx$backend$infra$clients$github$authenticated_emails_BANG_(client,access_token){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$github$IGitHubClient$authenticated_emails_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$github$IGitHubClient$authenticated_emails_BANG_$arity$2(client,access_token);
} else {
return knoxx$backend$infra$clients$github$IGitHubClient$authenticated_emails_BANG_$dyn_29731(client,access_token);
}
});

knoxx.backend.infra.clients.github.configured_QMARK_ = (function knoxx$backend$infra$clients$github$configured_QMARK_(value){
return (!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))));
});
knoxx.backend.infra.clients.github.checked_body_BANG_ = (function knoxx$backend$infra$clients$github$checked_body_BANG_(resp,label){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" failed ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))));
}
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
 * @implements {cljs.core.ICloneable}
 * @implements {knoxx.backend.infra.clients.github.IGitHubClient}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.clients.github.FetchGitHubClient = (function (config,http_client,timeout_ms,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.timeout_ms = timeout_ms;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k29606,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__29616 = k29606;
var G__29616__$1 = (((G__29616 instanceof cljs.core.Keyword))?G__29616.fqn:null);
switch (G__29616__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
case "timeout-ms":
return self__.timeout_ms;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k29606,else__5472__auto__);

}
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__29633){
var vec__29635 = p__29633;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29635,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29635,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.clients.github.FetchGitHubClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__29605){
var self__ = this;
var G__29605__$1 = this;
return (new cljs.core.RecordIter((0),G__29605__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-848619824 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this29607,other29608){
var self__ = this;
var this29607__$1 = this;
return (((!((other29608 == null)))) && ((((this29607__$1.constructor === other29608.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29607__$1.config,other29608.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29607__$1.http_client,other29608.http_client)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29607__$1.timeout_ms,other29608.timeout_ms)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29607__$1.__extmap,other29608.__extmap)))))))))));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k29606){
var self__ = this;
var this__5476__auto____$1 = this;
var G__29659 = k29606;
var G__29659__$1 = (((G__29659 instanceof cljs.core.Keyword))?G__29659.fqn:null);
switch (G__29659__$1) {
case "config":
case "http-client":
case "timeout-ms":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k29606);

}
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__29605){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__29661 = cljs.core.keyword_identical_QMARK_;
var expr__29662 = k__5478__auto__;
if(cljs.core.truth_((pred__29661.cljs$core$IFn$_invoke$arity$2 ? pred__29661.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__29662) : pred__29661.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__29662)))){
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(G__29605,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__29661.cljs$core$IFn$_invoke$arity$2 ? pred__29661.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__29662) : pred__29661.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__29662)))){
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(self__.config,G__29605,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__29661.cljs$core$IFn$_invoke$arity$2 ? pred__29661.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__29662) : pred__29661.call(null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__29662)))){
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(self__.config,self__.http_client,G__29605,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__29605),null));
}
}
}
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__29605){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(self__.config,self__.http_client,self__.timeout_ms,G__29605,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.knoxx$backend$infra$clients$github$IGitHubClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.knoxx$backend$infra$clients$github$IGitHubClient$oauth_access_token_BANG_$arity$3 = (function (_,code,redirect_uri){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),"https://github.com/login/oauth/access_token",new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 2, ["Content-Type","application/json","Accept","application/json"], null),new cljs.core.Keyword(null,"json","json",1279968570),(function (){var G__29672 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"client_id","client_id",48809273),new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(self__.config),new cljs.core.Keyword(null,"client_secret","client_secret",-1199052995),new cljs.core.Keyword(null,"client-secret","client-secret",477227642).cljs$core$IFn$_invoke$arity$1(self__.config),new cljs.core.Keyword(null,"code","code",1586293142),code], null);
if(knoxx.backend.infra.clients.github.configured_QMARK_(redirect_uri)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29672,new cljs.core.Keyword(null,"redirect_uri","redirect_uri",-1479457764),redirect_uri);
} else {
return G__29672;
}
})()], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null))),(function (resp){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.clients.github.checked_body_BANG_(resp,"GitHub token exchange")),(function (body){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(body))?(function (){throw (new Error((""+"GitHub OAuth error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"error_description","error_description",1071682680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(body);
}
})()))))})():new cljs.core.Keyword(null,"access_token","access_token",1591156073).cljs$core$IFn$_invoke$arity$1(body)));
}));
}));
}));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.knoxx$backend$infra$clients$github$IGitHubClient$authenticated_user_BANG_$arity$2 = (function (_,access_token){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),"https://api.github.com/user",new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 2, ["Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token)),"Accept","application/json"], null)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.infra.clients.github.checked_body_BANG_(resp,"GitHub user lookup"));
}));
}));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.prototype.knoxx$backend$infra$clients$github$IGitHubClient$authenticated_emails_BANG_$arity$2 = (function (_,access_token){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),"https://api.github.com/user/emails",new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 2, ["Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token)),"Accept","application/json"], null)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.infra.clients.github.checked_body_BANG_(resp,"GitHub email lookup"));
}));
}));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null),new cljs.core.Symbol(null,"timeout-ms","timeout-ms",-1900214363,null)], null);
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.cljs$lang$type = true);

(knoxx.backend.infra.clients.github.FetchGitHubClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.clients.github/FetchGitHubClient",null,(1),null));
}));

(knoxx.backend.infra.clients.github.FetchGitHubClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.clients.github/FetchGitHubClient");
}));

/**
 * Positional factory function for knoxx.backend.infra.clients.github/FetchGitHubClient.
 */
knoxx.backend.infra.clients.github.__GT_FetchGitHubClient = (function knoxx$backend$infra$clients$github$__GT_FetchGitHubClient(config,http_client,timeout_ms){
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(config,http_client,timeout_ms,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.clients.github/FetchGitHubClient, taking a map of keywords to field values.
 */
knoxx.backend.infra.clients.github.map__GT_FetchGitHubClient = (function knoxx$backend$infra$clients$github$map__GT_FetchGitHubClient(G__29610){
var extmap__5511__auto__ = (function (){var G__29704 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__29610,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], 0));
if(cljs.core.record_QMARK_(G__29610)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__29704);
} else {
return G__29704;
}
})();
return (new knoxx.backend.infra.clients.github.FetchGitHubClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__29610),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__29610),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(G__29610),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.clients.github.client = (function knoxx$backend$infra$clients$github$client(var_args){
var G__29710 = arguments.length;
switch (G__29710) {
case 1:
return knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.github.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__29714){
var map__29715 = p__29714;
var map__29715__$1 = cljs.core.__destructure_map(map__29715);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29715__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29715__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
return knoxx.backend.infra.clients.github.__GT_FetchGitHubClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})());
}));

(knoxx.backend.infra.clients.github.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.clients.github.js.map
