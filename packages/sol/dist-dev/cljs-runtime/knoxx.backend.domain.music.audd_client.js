import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.music.audd_client');

/**
 * @interface
 */
knoxx.backend.domain.music.audd_client.IAudDClient = function(){};

var knoxx$backend$domain$music$audd_client$IAudDClient$recognize_BANG_$dyn_33568 = (function (client,media){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.music.audd_client.recognize_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,media) : m__5520__auto__.call(null,client,media));
} else {
var m__5518__auto__ = (knoxx.backend.domain.music.audd_client.recognize_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,media) : m__5518__auto__.call(null,client,media));
} else {
throw cljs.core.missing_protocol("IAudDClient.recognize!",client);
}
}
});
knoxx.backend.domain.music.audd_client.recognize_BANG_ = (function knoxx$backend$domain$music$audd_client$recognize_BANG_(client,media){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$music$audd_client$IAudDClient$recognize_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$music$audd_client$IAudDClient$recognize_BANG_$arity$2(client,media);
} else {
return knoxx$backend$domain$music$audd_client$IAudDClient$recognize_BANG_$dyn_33568(client,media);
}
});

var knoxx$backend$domain$music$audd_client$IAudDClient$acoustid_lookup_BANG_$dyn_33578 = (function (client,fingerprint,duration){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.music.audd_client.acoustid_lookup_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,fingerprint,duration) : m__5520__auto__.call(null,client,fingerprint,duration));
} else {
var m__5518__auto__ = (knoxx.backend.domain.music.audd_client.acoustid_lookup_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,fingerprint,duration) : m__5518__auto__.call(null,client,fingerprint,duration));
} else {
throw cljs.core.missing_protocol("IAudDClient.acoustid-lookup!",client);
}
}
});
knoxx.backend.domain.music.audd_client.acoustid_lookup_BANG_ = (function knoxx$backend$domain$music$audd_client$acoustid_lookup_BANG_(client,fingerprint,duration){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$music$audd_client$IAudDClient$acoustid_lookup_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$music$audd_client$IAudDClient$acoustid_lookup_BANG_$arity$3(client,fingerprint,duration);
} else {
return knoxx$backend$domain$music$audd_client$IAudDClient$acoustid_lookup_BANG_$dyn_33578(client,fingerprint,duration);
}
});

var knoxx$backend$domain$music$audd_client$IAudDClient$musicbrainz_recording_BANG_$dyn_33584 = (function (client,mbid){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.music.audd_client.musicbrainz_recording_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,mbid) : m__5520__auto__.call(null,client,mbid));
} else {
var m__5518__auto__ = (knoxx.backend.domain.music.audd_client.musicbrainz_recording_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,mbid) : m__5518__auto__.call(null,client,mbid));
} else {
throw cljs.core.missing_protocol("IAudDClient.musicbrainz-recording!",client);
}
}
});
knoxx.backend.domain.music.audd_client.musicbrainz_recording_BANG_ = (function knoxx$backend$domain$music$audd_client$musicbrainz_recording_BANG_(client,mbid){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$music$audd_client$IAudDClient$musicbrainz_recording_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$music$audd_client$IAudDClient$musicbrainz_recording_BANG_$arity$2(client,mbid);
} else {
return knoxx$backend$domain$music$audd_client$IAudDClient$musicbrainz_recording_BANG_$dyn_33584(client,mbid);
}
});

var knoxx$backend$domain$music$audd_client$IAudDClient$fetch_url_BANG_$dyn_33591 = (function (client,url,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.music.audd_client.fetch_url_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5520__auto__.call(null,client,url,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.music.audd_client.fetch_url_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5518__auto__.call(null,client,url,opts));
} else {
throw cljs.core.missing_protocol("IAudDClient.fetch-url!",client);
}
}
});
knoxx.backend.domain.music.audd_client.fetch_url_BANG_ = (function knoxx$backend$domain$music$audd_client$fetch_url_BANG_(client,url,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$music$audd_client$IAudDClient$fetch_url_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$music$audd_client$IAudDClient$fetch_url_BANG_$arity$3(client,url,opts);
} else {
return knoxx$backend$domain$music$audd_client$IAudDClient$fetch_url_BANG_$dyn_33591(client,url,opts);
}
});

knoxx.backend.domain.music.audd_client.configured_QMARK_ = (function knoxx$backend$domain$music$audd_client$configured_QMARK_(value){
return (!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value)))));
});
knoxx.backend.domain.music.audd_client.checked_body_BANG_ = (function knoxx$backend$domain$music$audd_client$checked_body_BANG_(resp,label){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" failed ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))));
}
});
knoxx.backend.domain.music.audd_client.audd_form = (function knoxx$backend$domain$music$audd_client$audd_form(api_token,p__33471){
var map__33472 = p__33471;
var map__33472__$1 = cljs.core.__destructure_map(map__33472);
var buffer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33472__$1,new cljs.core.Keyword(null,"buffer","buffer",617295198));
var mime_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33472__$1,new cljs.core.Keyword(null,"mime-type","mime-type",1058646439));
var filename = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33472__$1,new cljs.core.Keyword(null,"filename","filename",-1428840783));
var form = (new FormData());
form.append("api_token",api_token);

form.append("return","apple_music,spotify,deezer");

form.append("file",(new Blob([buffer],({"type": mime_type}))),filename);

return form;
});
knoxx.backend.domain.music.audd_client.acoustid_url = (function knoxx$backend$domain$music$audd_client$acoustid_url(api_key,fingerprint,duration){
var params = (new URLSearchParams());
params.set("client",api_key);

params.set("duration",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = duration;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})())));

params.set("fingerprint",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(fingerprint)));

params.set("meta","recordings+recordingids+releasegroups");

return (""+"https://api.acoustid.org/v2/lookup?"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(params.toString()));
});
knoxx.backend.domain.music.audd_client.musicbrainz_url = (function knoxx$backend$domain$music$audd_client$musicbrainz_url(mbid){
return (""+"https://musicbrainz.org/ws/2/recording/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mbid))))+"?inc=isrcs+releases+release-groups&fmt=json");
});
knoxx.backend.domain.music.audd_client.sleep_BANG_ = (function knoxx$backend$domain$music$audd_client$sleep_BANG_(ms){
return (new Promise((function (resolve){
return setTimeout(resolve,ms);
})));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.domain.music.audd_client.IAudDClient}
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
knoxx.backend.domain.music.audd_client.FetchAudDClient = (function (config,http_client,timeout_ms,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.timeout_ms = timeout_ms;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k33487,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__33495 = k33487;
var G__33495__$1 = (((G__33495 instanceof cljs.core.Keyword))?G__33495.fqn:null);
switch (G__33495__$1) {
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
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k33487,else__5472__auto__);

}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__33496){
var vec__33497 = p__33496;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33497,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33497,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.knoxx$backend$domain$music$audd_client$IAudDClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.knoxx$backend$domain$music$audd_client$IAudDClient$recognize_BANG_$arity$2 = (function (_,media){
var self__ = this;
var ___$1 = this;
var audd_token = new cljs.core.Keyword(null,"audd-api-token","audd-api-token",-1668649966).cljs$core$IFn$_invoke$arity$1(self__.config);
if((!(knoxx.backend.domain.music.audd_client.configured_QMARK_(audd_token)))){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"AUDD_API_TOKEN not configured",new cljs.core.Keyword(null,"hint","hint",439639918),"Set AUDD_API_TOKEN to enable music identification"], null));
} else {
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),"https://api.audd.io/",new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"form","form",-1624062471),knoxx.backend.domain.music.audd_client.audd_form(audd_token,media)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.domain.music.audd_client.checked_body_BANG_(resp,"AudD recognition"));
}));
}));
}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.knoxx$backend$domain$music$audd_client$IAudDClient$acoustid_lookup_BANG_$arity$3 = (function (_,fingerprint,duration){
var self__ = this;
var ___$1 = this;
var acoustid_key = new cljs.core.Keyword(null,"acoustid-api-key","acoustid-api-key",-1190639229).cljs$core$IFn$_invoke$arity$1(self__.config);
if((!(knoxx.backend.domain.music.audd_client.configured_QMARK_(acoustid_key)))){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"ACOUSTID_API_KEY not configured",new cljs.core.Keyword(null,"hint","hint",439639918),"Set acoustid-api-key in Knoxx config to enable AcoustID lookups"], null));
} else {
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.music.audd_client.acoustid_url(acoustid_key,fingerprint,duration),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.domain.music.audd_client.checked_body_BANG_(resp,"AcoustID lookup"));
}));
}));
}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.knoxx$backend$domain$music$audd_client$IAudDClient$musicbrainz_recording_BANG_$arity$2 = (function (_,mbid){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.music.audd_client.sleep_BANG_((1100))),(function (___$2){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.music.audd_client.musicbrainz_url(mbid),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["User-Agent","Knoxx-Agent/1.0 (discord bot)"], null)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.domain.music.audd_client.checked_body_BANG_(resp,"MusicBrainz recording lookup"));
}));
}));
}));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.knoxx$backend$domain$music$audd_client$IAudDClient$fetch_url_BANG_$arity$3 = (function (_,url,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),opts,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.music.audd-client.FetchAudDClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__33486){
var self__ = this;
var G__33486__$1 = this;
return (new cljs.core.RecordIter((0),G__33486__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1426564966 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this33488,other33489){
var self__ = this;
var this33488__$1 = this;
return (((!((other33489 == null)))) && ((((this33488__$1.constructor === other33489.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33488__$1.config,other33489.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33488__$1.http_client,other33489.http_client)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33488__$1.timeout_ms,other33489.timeout_ms)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33488__$1.__extmap,other33489.__extmap)))))))))));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k33487){
var self__ = this;
var this__5476__auto____$1 = this;
var G__33530 = k33487;
var G__33530__$1 = (((G__33530 instanceof cljs.core.Keyword))?G__33530.fqn:null);
switch (G__33530__$1) {
case "config":
case "http-client":
case "timeout-ms":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k33487);

}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__33486){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__33532 = cljs.core.keyword_identical_QMARK_;
var expr__33533 = k__5478__auto__;
if(cljs.core.truth_((pred__33532.cljs$core$IFn$_invoke$arity$2 ? pred__33532.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__33533) : pred__33532.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__33533)))){
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(G__33486,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__33532.cljs$core$IFn$_invoke$arity$2 ? pred__33532.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33533) : pred__33532.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33533)))){
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(self__.config,G__33486,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__33532.cljs$core$IFn$_invoke$arity$2 ? pred__33532.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__33533) : pred__33532.call(null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__33533)))){
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(self__.config,self__.http_client,G__33486,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__33486),null));
}
}
}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__33486){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(self__.config,self__.http_client,self__.timeout_ms,G__33486,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null),new cljs.core.Symbol(null,"timeout-ms","timeout-ms",-1900214363,null)], null);
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.cljs$lang$type = true);

(knoxx.backend.domain.music.audd_client.FetchAudDClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.music.audd-client/FetchAudDClient",null,(1),null));
}));

(knoxx.backend.domain.music.audd_client.FetchAudDClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.music.audd-client/FetchAudDClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.music.audd-client/FetchAudDClient.
 */
knoxx.backend.domain.music.audd_client.__GT_FetchAudDClient = (function knoxx$backend$domain$music$audd_client$__GT_FetchAudDClient(config,http_client,timeout_ms){
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(config,http_client,timeout_ms,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.music.audd-client/FetchAudDClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.music.audd_client.map__GT_FetchAudDClient = (function knoxx$backend$domain$music$audd_client$map__GT_FetchAudDClient(G__33490){
var extmap__5511__auto__ = (function (){var G__33542 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__33490,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], 0));
if(cljs.core.record_QMARK_(G__33490)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__33542);
} else {
return G__33542;
}
})();
return (new knoxx.backend.domain.music.audd_client.FetchAudDClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__33490),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__33490),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(G__33490),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.music.audd_client.client = (function knoxx$backend$domain$music$audd_client$client(var_args){
var G__33545 = arguments.length;
switch (G__33545) {
case 1:
return knoxx.backend.domain.music.audd_client.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.music.audd_client.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.music.audd_client.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.music.audd_client.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.music.audd_client.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__33554){
var map__33555 = p__33554;
var map__33555__$1 = cljs.core.__destructure_map(map__33555);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33555__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33555__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
return knoxx.backend.domain.music.audd_client.__GT_FetchAudDClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})());
}));

(knoxx.backend.domain.music.audd_client.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.domain.music.audd_client.js.map
