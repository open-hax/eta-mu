import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.media.remote_client');

/**
 * @interface
 */
knoxx.backend.domain.media.remote_client.IRemoteMediaClient = function(){};

var knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_bytes_BANG_$dyn_33226 = (function (client,url,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.media.remote_client.fetch_bytes_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5520__auto__.call(null,client,url,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.media.remote_client.fetch_bytes_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5518__auto__.call(null,client,url,opts));
} else {
throw cljs.core.missing_protocol("IRemoteMediaClient.fetch-bytes!",client);
}
}
});
knoxx.backend.domain.media.remote_client.fetch_bytes_BANG_ = (function knoxx$backend$domain$media$remote_client$fetch_bytes_BANG_(client,url,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_bytes_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_bytes_BANG_$arity$3(client,url,opts);
} else {
return knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_bytes_BANG_$dyn_33226(client,url,opts);
}
});

var knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_text_BANG_$dyn_33231 = (function (client,url,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.media.remote_client.fetch_text_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5520__auto__.call(null,client,url,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.media.remote_client.fetch_text_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5518__auto__.call(null,client,url,opts));
} else {
throw cljs.core.missing_protocol("IRemoteMediaClient.fetch-text!",client);
}
}
});
knoxx.backend.domain.media.remote_client.fetch_text_BANG_ = (function knoxx$backend$domain$media$remote_client$fetch_text_BANG_(client,url,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_text_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_text_BANG_$arity$3(client,url,opts);
} else {
return knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_text_BANG_$dyn_33231(client,url,opts);
}
});

var knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_data_url_BANG_$dyn_33235 = (function (client,url,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.media.remote_client.fetch_data_url_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5520__auto__.call(null,client,url,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.media.remote_client.fetch_data_url_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,url,opts) : m__5518__auto__.call(null,client,url,opts));
} else {
throw cljs.core.missing_protocol("IRemoteMediaClient.fetch-data-url!",client);
}
}
});
knoxx.backend.domain.media.remote_client.fetch_data_url_BANG_ = (function knoxx$backend$domain$media$remote_client$fetch_data_url_BANG_(client,url,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_data_url_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_data_url_BANG_$arity$3(client,url,opts);
} else {
return knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_data_url_BANG_$dyn_33235(client,url,opts);
}
});

knoxx.backend.domain.media.remote_client.sanitize_mime_type = (function knoxx$backend$domain$media$remote_client$sanitize_mime_type(value,fallback){
var raw = (function (){var G__33048 = value;
var G__33048__$1 = (((G__33048 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33048)));
var G__33048__$2 = (((G__33048__$1 == null))?null:clojure.string.trim(G__33048__$1));
if((G__33048__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33048__$2);
}
})();
var trimmed = (cljs.core.truth_(raw)?cljs.core.first(clojure.string.split.cljs$core$IFn$_invoke$arity$2(raw,/;/)):null);
var or__5162__auto__ = trimmed;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = fallback;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "application/octet-stream";
}
}
});
knoxx.backend.domain.media.remote_client.mime_type__GT_extension = (function knoxx$backend$domain$media$remote_client$mime_type__GT_extension(mime_type){
var G__33068 = knoxx.backend.domain.media.remote_client.sanitize_mime_type(mime_type,null);
switch (G__33068) {
case "image/png":
return ".png";

break;
case "image/jpeg":
return ".jpg";

break;
case "image/gif":
return ".gif";

break;
case "image/webp":
return ".webp";

break;
case "image/svg+xml":
return ".svg";

break;
case "audio/mpeg":
return ".mp3";

break;
case "audio/wav":
return ".wav";

break;
case "audio/ogg":
return ".ogg";

break;
case "audio/mp4":
return ".m4a";

break;
case "audio/flac":
return ".flac";

break;
case "audio/aac":
return ".aac";

break;
case "video/mp4":
return ".mp4";

break;
case "video/webm":
return ".webm";

break;
case "video/quicktime":
return ".mov";

break;
case "video/x-msvideo":
return ".avi";

break;
case "application/pdf":
return ".pdf";

break;
case "text/plain":
return ".txt";

break;
case "text/markdown":
return ".md";

break;
case "text/csv":
return ".csv";

break;
case "application/json":
return ".json";

break;
default:
return ".bin";

}
});
knoxx.backend.domain.media.remote_client.infer_upload_filename = (function knoxx$backend$domain$media$remote_client$infer_upload_filename(url,idx,mime_type){
var pathname = (function (){try{return (new URL((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)))).pathname;
}catch (e33071){var _ = e33071;
return "";
}})();
var candidate = (function (){var G__33072 = pathname;
var G__33072__$1 = (((G__33072 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__33072,/\//));
var G__33072__$2 = (((G__33072__$1 == null))?null:cljs.core.last(G__33072__$1));
var G__33072__$3 = (((G__33072__$2 == null))?null:clojure.string.trim(G__33072__$2));
if((G__33072__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__33072__$3);
}
})();
var or__5162__auto__ = candidate;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"attachment-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.remote_client.mime_type__GT_extension(mime_type)));
}
});
knoxx.backend.domain.media.remote_client.ensure_source_size_BANG_ = (function knoxx$backend$domain$media$remote_client$ensure_source_size_BANG_(size,max_bytes,label){
if(cljs.core.truth_((function (){var and__5160__auto__ = max_bytes;
if(cljs.core.truth_(and__5160__auto__)){
return (size > max_bytes);
} else {
return and__5160__auto__;
}
})())){
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" exceeds "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_bytes)+" bytes. Choose a smaller file or summarize it instead.")));
} else {
return null;
}
});
knoxx.backend.domain.media.remote_client.base_headers = (function knoxx$backend$domain$media$remote_client$base_headers(opts){
var G__33089 = new cljs.core.PersistentArrayMap(null, 1, ["User-Agent",(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"user-agent","user-agent",1220426212).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Knoxx-Agent/1.0";
}
})()], null);
if(cljs.core.truth_(new cljs.core.Keyword(null,"authorization","authorization",-166302136).cljs$core$IFn$_invoke$arity$1(opts))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33089,"Authorization",new cljs.core.Keyword(null,"authorization","authorization",-166302136).cljs$core$IFn$_invoke$arity$1(opts));
} else {
return G__33089;
}
});
knoxx.backend.domain.media.remote_client.decode_data_url_source = (function knoxx$backend$domain$media$remote_client$decode_data_url_source(raw_source){
var match = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw_source)).match(/^data:([^;,]+)?(;base64)?,(.*)$/);
if(cljs.core.truth_(match)){
} else {
throw (new Error("Invalid data URL source"));
}

var mime_type = knoxx.backend.domain.media.remote_client.sanitize_mime_type((match[(1)]),"application/octet-stream");
var base64_QMARK_ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(";base64",(function (){var or__5162__auto__ = (match[(2)]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var payload = (function (){var or__5162__auto__ = (match[(3)]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var buffer = ((base64_QMARK_)?Buffer.from(payload,"base64"):Buffer.from(decodeURIComponent(payload),"utf8"));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"buffer","buffer",617295198),buffer,new cljs.core.Keyword(null,"mime-type","mime-type",1058646439),mime_type,new cljs.core.Keyword(null,"filename","filename",-1428840783),(""+"upload"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.remote_client.mime_type__GT_extension(mime_type))),new cljs.core.Keyword(null,"size","size",1098693007),buffer.length,new cljs.core.Keyword(null,"source-kind","source-kind",-1955827566),"data_url"], null);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.domain.media.remote_client.IRemoteMediaClient}
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
knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient = (function (http_client,__meta,__extmap,__hash){
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k33113,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__33137 = k33113;
var G__33137__$1 = (((G__33137 instanceof cljs.core.Keyword))?G__33137.fqn:null);
switch (G__33137__$1) {
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k33113,else__5472__auto__);

}
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__33140){
var vec__33141 = p__33140;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33141,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33141,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.media.remote-client.FetchRemoteMediaClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__33112){
var self__ = this;
var G__33112__$1 = this;
return (new cljs.core.RecordIter((0),G__33112__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (619786148 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this33114,other33115){
var self__ = this;
var this33114__$1 = this;
return (((!((other33115 == null)))) && ((((this33114__$1.constructor === other33115.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33114__$1.http_client,other33115.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33114__$1.__extmap,other33115.__extmap)))))));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_bytes_BANG_$arity$3 = (function (_,url,opts){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.array_buffer_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.media.remote_client.base_headers(opts),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"headers","headers",-835030129).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], 0))], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?(function (){var mime_type = knoxx.backend.domain.media.remote_client.sanitize_mime_type(cljs.core.get.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"headers","headers",-835030129).cljs$core$IFn$_invoke$arity$1(resp),"content-type"),new cljs.core.Keyword(null,"fallback-mime-type","fallback-mime-type",-717271244).cljs$core$IFn$_invoke$arity$1(opts));
var buffer = Buffer.from((new Uint8Array(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp))));
var size = buffer.length;
knoxx.backend.domain.media.remote_client.ensure_source_size_BANG_(size,new cljs.core.Keyword(null,"max-bytes","max-bytes",-552902639).cljs$core$IFn$_invoke$arity$1(opts),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Remote media";
}
})());

return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"buffer","buffer",617295198),buffer,new cljs.core.Keyword(null,"mime-type","mime-type",1058646439),mime_type,new cljs.core.Keyword(null,"filename","filename",-1428840783),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.remote_client.infer_upload_filename(url,(0),mime_type);
}
})(),new cljs.core.Keyword(null,"size","size",1098693007),size,new cljs.core.Keyword(null,"source-kind","source-kind",-1955827566),"url",new cljs.core.Keyword(null,"source-url","source-url",569467631),url], null);
})():(function (){throw (new Error((""+"Failed to fetch source "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))))})()));
}));
}));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_text_BANG_$arity$3 = (function (_,url,opts){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.text_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.media.remote_client.base_headers(opts),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"headers","headers",-835030129).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], 0))], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp):(function (){throw (new Error((""+"Failed to fetch text "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)))))})()));
}));
}));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_data_url_BANG_$arity$3 = (function (this$,url,opts){
var self__ = this;
var this$__$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(this$__$1.knoxx$backend$domain$media$remote_client$IRemoteMediaClient$fetch_bytes_BANG_$arity$3(null,url,opts)),(function (source){
return promesa.protocols._promise((""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(source))+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(source).toString("base64"))));
}));
}));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k33113){
var self__ = this;
var this__5476__auto____$1 = this;
var G__33188 = k33113;
var G__33188__$1 = (((G__33188 instanceof cljs.core.Keyword))?G__33188.fqn:null);
switch (G__33188__$1) {
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k33113);

}
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__33112){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__33194 = cljs.core.keyword_identical_QMARK_;
var expr__33195 = k__5478__auto__;
if(cljs.core.truth_((pred__33194.cljs$core$IFn$_invoke$arity$2 ? pred__33194.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33195) : pred__33194.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33195)))){
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(G__33112,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__33112),null));
}
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__33112){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(self__.http_client,G__33112,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.cljs$lang$type = true);

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.media.remote-client/FetchRemoteMediaClient",null,(1),null));
}));

(knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.media.remote-client/FetchRemoteMediaClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.media.remote-client/FetchRemoteMediaClient.
 */
knoxx.backend.domain.media.remote_client.__GT_FetchRemoteMediaClient = (function knoxx$backend$domain$media$remote_client$__GT_FetchRemoteMediaClient(http_client){
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.media.remote-client/FetchRemoteMediaClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.media.remote_client.map__GT_FetchRemoteMediaClient = (function knoxx$backend$domain$media$remote_client$map__GT_FetchRemoteMediaClient(G__33116){
var extmap__5511__auto__ = (function (){var G__33204 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__33116,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
if(cljs.core.record_QMARK_(G__33116)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__33204);
} else {
return G__33204;
}
})();
return (new knoxx.backend.domain.media.remote_client.FetchRemoteMediaClient(new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__33116),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.media.remote_client.client = (function knoxx$backend$domain$media$remote_client$client(var_args){
var G__33207 = arguments.length;
switch (G__33207) {
case 0:
return knoxx.backend.domain.media.remote_client.client.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.domain.media.remote_client.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.media.remote_client.client.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.domain.media.remote_client.client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.media.remote_client.client.cljs$core$IFn$_invoke$arity$1 = (function (p__33209){
var map__33210 = p__33209;
var map__33210__$1 = cljs.core.__destructure_map(map__33210);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33210__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.domain.media.remote_client.__GT_FetchRemoteMediaClient((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.domain.media.remote_client.client.cljs$lang$maxFixedArity = 1);

knoxx.backend.domain.media.remote_client.decode_data_url_BANG_ = (function knoxx$backend$domain$media$remote_client$decode_data_url_BANG_(raw_source,opts){
var decoded = knoxx.backend.domain.media.remote_client.decode_data_url_source(raw_source);
knoxx.backend.domain.media.remote_client.ensure_source_size_BANG_(new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(decoded),new cljs.core.Keyword(null,"max-bytes","max-bytes",-552902639).cljs$core$IFn$_invoke$arity$1(opts),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Source media";
}
})());

return decoded;
});

//# sourceMappingURL=knoxx.backend.domain.media.remote_client.js.map
