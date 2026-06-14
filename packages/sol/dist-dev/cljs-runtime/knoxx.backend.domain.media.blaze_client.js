import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.media.blaze_client');

/**
 * @interface
 */
knoxx.backend.domain.media.blaze_client.IBlazeClient = function(){};

var knoxx$backend$domain$media$blaze_client$IBlazeClient$generate_BANG_$dyn_21800 = (function (client,modality,payload,attempt_context){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.media.blaze_client.generate_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,modality,payload,attempt_context) : m__5520__auto__.call(null,client,modality,payload,attempt_context));
} else {
var m__5518__auto__ = (knoxx.backend.domain.media.blaze_client.generate_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,modality,payload,attempt_context) : m__5518__auto__.call(null,client,modality,payload,attempt_context));
} else {
throw cljs.core.missing_protocol("IBlazeClient.generate!",client);
}
}
});
knoxx.backend.domain.media.blaze_client.generate_BANG_ = (function knoxx$backend$domain$media$blaze_client$generate_BANG_(client,modality,payload,attempt_context){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$media$blaze_client$IBlazeClient$generate_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$media$blaze_client$IBlazeClient$generate_BANG_$arity$4(client,modality,payload,attempt_context);
} else {
return knoxx$backend$domain$media$blaze_client$IBlazeClient$generate_BANG_$dyn_21800(client,modality,payload,attempt_context);
}
});

var knoxx$backend$domain$media$blaze_client$IBlazeClient$fetch_generated_media_BANG_$dyn_21805 = (function (client,url){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.media.blaze_client.fetch_generated_media_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,url) : m__5520__auto__.call(null,client,url));
} else {
var m__5518__auto__ = (knoxx.backend.domain.media.blaze_client.fetch_generated_media_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,url) : m__5518__auto__.call(null,client,url));
} else {
throw cljs.core.missing_protocol("IBlazeClient.fetch-generated-media!",client);
}
}
});
knoxx.backend.domain.media.blaze_client.fetch_generated_media_BANG_ = (function knoxx$backend$domain$media$blaze_client$fetch_generated_media_BANG_(client,url){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$media$blaze_client$IBlazeClient$fetch_generated_media_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$media$blaze_client$IBlazeClient$fetch_generated_media_BANG_$arity$2(client,url);
} else {
return knoxx$backend$domain$media$blaze_client$IBlazeClient$fetch_generated_media_BANG_$dyn_21805(client,url);
}
});

knoxx.backend.domain.media.blaze_client.blank__GT_nil = (function knoxx$backend$domain$media$blaze_client$blank__GT_nil(v){
var s = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = v;
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
knoxx.backend.domain.media.blaze_client.config_value = (function knoxx$backend$domain$media$blaze_client$config_value(config,keyword_key,js_key,camel_key){
var or__5162__auto__ = ((cljs.core.map_QMARK_(config))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(config,keyword_key):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.map_QMARK_(config))?null:(config[js_key]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.map_QMARK_(config)){
return null;
} else {
return (config[camel_key]);
}
}
}
});
knoxx.backend.domain.media.blaze_client.env_value = (function knoxx$backend$domain$media$blaze_client$env_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___21810 = arguments.length;
var i__5898__auto___21811 = (0);
while(true){
if((i__5898__auto___21811 < len__5897__auto___21810)){
args__5903__auto__.push((arguments[i__5898__auto___21811]));

var G__21813 = (i__5898__auto___21811 + (1));
i__5898__auto___21811 = G__21813;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.media.blaze_client.env_value.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.media.blaze_client.env_value.cljs$core$IFn$_invoke$arity$variadic = (function (names){
return cljs.core.some((function (name){
var G__21659 = process;
var G__21659__$1 = (((G__21659 == null))?null:G__21659.env);
var G__21659__$2 = (((G__21659__$1 == null))?null:(G__21659__$1[name]));
if((G__21659__$2 == null)){
return null;
} else {
return knoxx.backend.domain.media.blaze_client.blank__GT_nil(G__21659__$2);
}
}),names);
}));

(knoxx.backend.domain.media.blaze_client.env_value.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.media.blaze_client.env_value.cljs$lang$applyTo = (function (seq21658){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21658));
}));

knoxx.backend.domain.media.blaze_client.proxx_api_key = (function knoxx$backend$domain$media$blaze_client$proxx_api_key(config){
var or__5162__auto__ = knoxx.backend.domain.media.blaze_client.blank__GT_nil(knoxx.backend.domain.media.blaze_client.config_value(config,new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676),"proxx-auth-token","proxxAuthToken"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze_client.env_value.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["PROXX_AUTH_TOKEN","PROXY_AUTH_TOKEN"], 0));
}
});
knoxx.backend.domain.media.blaze_client.proxx_base_url = (function knoxx$backend$domain$media$blaze_client$proxx_base_url(config){
return clojure.string.replace((function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze_client.blank__GT_nil(knoxx.backend.domain.media.blaze_client.config_value(config,new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978),"proxx-base-url","proxxBaseUrl"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.media.blaze_client.env_value.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["PROXX_BASE_URL"], 0));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "http://proxx:8789";
}
}
})(),/\/+$/,"");
});
knoxx.backend.domain.media.blaze_client.generation_url = (function knoxx$backend$domain$media$blaze_client$generation_url(config,modality){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.blaze_client.proxx_base_url(config))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var G__21671 = modality;
switch (G__21671) {
case "image":
return "/v1/images/generations";

break;
case "video":
return "/v1/videos/generations";

break;
case "music":
return "/v1/music/generations";

break;
case "tts":
return "/v1/audio/speech";

break;
default:
return "/v1/chat/completions";

}
})()));
});
knoxx.backend.domain.media.blaze_client.generation_headers = (function knoxx$backend$domain$media$blaze_client$generation_headers(config,attempt_context){
var G__21672 = new cljs.core.PersistentArrayMap(null, 3, ["Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze_client.proxx_api_key(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error("PROXX_AUTH_TOKEN/PROXY_AUTH_TOKEN not configured for Proxx-authenticated Blaze proxying"));
}
})())),"Content-Type","application/json","Accept","application/json"], null);
if(cljs.core.truth_(new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517).cljs$core$IFn$_invoke$arity$1(attempt_context))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21672,"X-Open-Hax-Tool-Call-Id",new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517).cljs$core$IFn$_invoke$arity$1(attempt_context));
} else {
return G__21672;
}
});
knoxx.backend.domain.media.blaze_client.checked_json_body_BANG_ = (function knoxx$backend$domain$media$blaze_client$checked_json_body_BANG_(resp){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
} else {
throw (new Error((""+"Proxx Blaze proxy HTTP "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))));
}
});
knoxx.backend.domain.media.blaze_client.checked_media_body_BANG_ = (function knoxx$backend$domain$media$blaze_client$checked_media_body_BANG_(url,resp){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
var arr = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
var buffer = Buffer.from((new Uint8Array(arr)));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"mime-type","mime-type",1058646439),knoxx.backend.domain.media.sanitize_mime_type(cljs.core.get.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"headers","headers",-835030129).cljs$core$IFn$_invoke$arity$1(resp),"content-type"),"application/octet-stream"),new cljs.core.Keyword(null,"buffer","buffer",617295198),buffer,new cljs.core.Keyword(null,"source-url","source-url",569467631),url], null);
} else {
throw (new Error((""+"Generated asset download HTTP "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))));
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {knoxx.backend.domain.media.blaze_client.IBlazeClient}
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
knoxx.backend.domain.media.blaze_client.FetchBlazeClient = (function (config,http_client,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k21684,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__21708 = k21684;
var G__21708__$1 = (((G__21708 instanceof cljs.core.Keyword))?G__21708.fqn:null);
switch (G__21708__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k21684,else__5472__auto__);

}
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__21721){
var vec__21722 = p__21721;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21722,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21722,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.media.blaze-client.FetchBlazeClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__21683){
var self__ = this;
var G__21683__$1 = this;
return (new cljs.core.RecordIter((0),G__21683__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(self__.config,self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1227526503 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this21685,other21686){
var self__ = this;
var this21685__$1 = this;
return (((!((other21686 == null)))) && ((((this21685__$1.constructor === other21686.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21685__$1.config,other21686.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21685__$1.http_client,other21686.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21685__$1.__extmap,other21686.__extmap)))))))));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(self__.config,self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k21684){
var self__ = this;
var this__5476__auto____$1 = this;
var G__21744 = k21684;
var G__21744__$1 = (((G__21744 instanceof cljs.core.Keyword))?G__21744.fqn:null);
switch (G__21744__$1) {
case "config":
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k21684);

}
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__21683){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__21751 = cljs.core.keyword_identical_QMARK_;
var expr__21752 = k__5478__auto__;
if(cljs.core.truth_((pred__21751.cljs$core$IFn$_invoke$arity$2 ? pred__21751.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__21752) : pred__21751.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__21752)))){
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(G__21683,self__.http_client,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21751.cljs$core$IFn$_invoke$arity$2 ? pred__21751.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__21752) : pred__21751.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__21752)))){
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(self__.config,G__21683,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(self__.config,self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__21683),null));
}
}
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.knoxx$backend$domain$media$blaze_client$IBlazeClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.knoxx$backend$domain$media$blaze_client$IBlazeClient$generate_BANG_$arity$4 = (function (_,modality,payload,attempt_context){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.media.blaze_client.generation_url(self__.config,modality),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.media.blaze_client.generation_headers(self__.config,attempt_context),new cljs.core.Keyword(null,"json","json",1279968570),payload], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(1200000)], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.domain.media.blaze_client.checked_json_body_BANG_(resp));
}));
}));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.knoxx$backend$domain$media$blaze_client$IBlazeClient$fetch_generated_media_BANG_$arity$2 = (function (_,url){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.array_buffer_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Accept","image/*,audio/*,video/*,*/*"], null)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(120000000)], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.domain.media.blaze_client.checked_media_body_BANG_(url,resp));
}));
}));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__21683){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(self__.config,self__.http_client,G__21683,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.cljs$lang$type = true);

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.media.blaze-client/FetchBlazeClient",null,(1),null));
}));

(knoxx.backend.domain.media.blaze_client.FetchBlazeClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.media.blaze-client/FetchBlazeClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.media.blaze-client/FetchBlazeClient.
 */
knoxx.backend.domain.media.blaze_client.__GT_FetchBlazeClient = (function knoxx$backend$domain$media$blaze_client$__GT_FetchBlazeClient(config,http_client){
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(config,http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.media.blaze-client/FetchBlazeClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.media.blaze_client.map__GT_FetchBlazeClient = (function knoxx$backend$domain$media$blaze_client$map__GT_FetchBlazeClient(G__21696){
var extmap__5511__auto__ = (function (){var G__21779 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__21696,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], 0));
if(cljs.core.record_QMARK_(G__21696)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__21779);
} else {
return G__21779;
}
})();
return (new knoxx.backend.domain.media.blaze_client.FetchBlazeClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__21696),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__21696),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.media.blaze_client.client = (function knoxx$backend$domain$media$blaze_client$client(var_args){
var G__21782 = arguments.length;
switch (G__21782) {
case 1:
return knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__21785){
var map__21786 = p__21785;
var map__21786__$1 = cljs.core.__destructure_map(map__21786);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21786__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.domain.media.blaze_client.__GT_FetchBlazeClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.domain.media.blaze_client.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.domain.media.blaze_client.js.map
