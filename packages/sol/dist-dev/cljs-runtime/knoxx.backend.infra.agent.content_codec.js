import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.message.js";
goog.provide('knoxx.backend.infra.agent.content_codec');

/**
 * @interface
 */
knoxx.backend.infra.agent.content_codec.IContentCodec = function(){};

var knoxx$backend$infra$agent$content_codec$IContentCodec$content_parts__GT_provider$dyn_25881 = (function (codec,content_parts){
var x__5519__auto__ = (((codec == null))?null:codec);
var m__5520__auto__ = (knoxx.backend.infra.agent.content_codec.content_parts__GT_provider[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(codec,content_parts) : m__5520__auto__.call(null,codec,content_parts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.content_codec.content_parts__GT_provider["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(codec,content_parts) : m__5518__auto__.call(null,codec,content_parts));
} else {
throw cljs.core.missing_protocol("IContentCodec.content-parts->provider",codec);
}
}
});
knoxx.backend.infra.agent.content_codec.content_parts__GT_provider = (function knoxx$backend$infra$agent$content_codec$content_parts__GT_provider(codec,content_parts){
if((((!((codec == null)))) && ((!((codec.knoxx$backend$infra$agent$content_codec$IContentCodec$content_parts__GT_provider$arity$2 == null)))))){
return codec.knoxx$backend$infra$agent$content_codec$IContentCodec$content_parts__GT_provider$arity$2(codec,content_parts);
} else {
return knoxx$backend$infra$agent$content_codec$IContentCodec$content_parts__GT_provider$dyn_25881(codec,content_parts);
}
});

var knoxx$backend$infra$agent$content_codec$IContentCodec$provider__GT_content_parts$dyn_25883 = (function (codec,provider_content){
var x__5519__auto__ = (((codec == null))?null:codec);
var m__5520__auto__ = (knoxx.backend.infra.agent.content_codec.provider__GT_content_parts[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(codec,provider_content) : m__5520__auto__.call(null,codec,provider_content));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.content_codec.provider__GT_content_parts["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(codec,provider_content) : m__5518__auto__.call(null,codec,provider_content));
} else {
throw cljs.core.missing_protocol("IContentCodec.provider->content-parts",codec);
}
}
});
knoxx.backend.infra.agent.content_codec.provider__GT_content_parts = (function knoxx$backend$infra$agent$content_codec$provider__GT_content_parts(codec,provider_content){
if((((!((codec == null)))) && ((!((codec.knoxx$backend$infra$agent$content_codec$IContentCodec$provider__GT_content_parts$arity$2 == null)))))){
return codec.knoxx$backend$infra$agent$content_codec$IContentCodec$provider__GT_content_parts$arity$2(codec,provider_content);
} else {
return knoxx$backend$infra$agent$content_codec$IContentCodec$provider__GT_content_parts$dyn_25883(codec,provider_content);
}
});


/**
 * @interface
 */
knoxx.backend.infra.agent.content_codec.IMediaMaterializer = function(){};

var knoxx$backend$infra$agent$content_codec$IMediaMaterializer$materialize_media_BANG_$dyn_25921 = (function (materializer,content_part,auth_context){
var x__5519__auto__ = (((materializer == null))?null:materializer);
var m__5520__auto__ = (knoxx.backend.infra.agent.content_codec.materialize_media_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(materializer,content_part,auth_context) : m__5520__auto__.call(null,materializer,content_part,auth_context));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.content_codec.materialize_media_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(materializer,content_part,auth_context) : m__5518__auto__.call(null,materializer,content_part,auth_context));
} else {
throw cljs.core.missing_protocol("IMediaMaterializer.materialize-media!",materializer);
}
}
});
knoxx.backend.infra.agent.content_codec.materialize_media_BANG_ = (function knoxx$backend$infra$agent$content_codec$materialize_media_BANG_(materializer,content_part,auth_context){
if((((!((materializer == null)))) && ((!((materializer.knoxx$backend$infra$agent$content_codec$IMediaMaterializer$materialize_media_BANG_$arity$3 == null)))))){
return materializer.knoxx$backend$infra$agent$content_codec$IMediaMaterializer$materialize_media_BANG_$arity$3(materializer,content_part,auth_context);
} else {
return knoxx$backend$infra$agent$content_codec$IMediaMaterializer$materialize_media_BANG_$dyn_25921(materializer,content_part,auth_context);
}
});

knoxx.backend.infra.agent.content_codec.fetch_b64_BANG_ = (async function knoxx$backend$infra$agent$content_codec$fetch_b64_BANG_(url,media_type){
var r = (await fetch(url));
if(cljs.core.truth_(r.ok)){
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(media_type)+" fetch failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(r.status))));
}

var ab = (await r.arrayBuffer());
var buf = Buffer.from(ab);
return (""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(media_type)+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(buf.toString("base64")));
});
knoxx.backend.infra.agent.content_codec.audio_format = (function knoxx$backend$infra$agent$content_codec$audio_format(mime){
return knoxx.backend.infra.agent.message.mime__GT_audio_format(mime);
});
knoxx.backend.infra.agent.content_codec.media_map = (function knoxx$backend$infra$agent$content_codec$media_map(part_type,data,mime){
var G__25599 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),part_type,new cljs.core.Keyword(null,"data","data",-232669377),data,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime], null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("audio",part_type)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25599,new cljs.core.Keyword(null,"format","format",-1306924766),(function (){var or__5162__auto__ = knoxx.backend.infra.agent.content_codec.audio_format(mime);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "mp3";
}
})());
} else {
return G__25599;
}
});
knoxx.backend.infra.agent.content_codec.materialize_BANG_ = (async function knoxx$backend$infra$agent$content_codec$materialize_BANG_(part){
var part_type = (await (async function (){var G__25604 = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part);
var G__25604__$1 = (((G__25604 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25604)));
if((G__25604__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__25604__$1);
}
})());
var url = (await (async function (){var G__25608 = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part);
var G__25608__$1 = (((G__25608 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25608)));
if((G__25608__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__25608__$1);
}
})());
var data = (await (async function (){var G__25610 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part);
var G__25610__$1 = (((G__25610 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25610)));
if((G__25610__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__25610__$1);
}
})());
var mime = (await (async function (){var or__5162__auto__ = (await (async function (){var G__25612 = new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(part);
var G__25612__$1 = (((G__25612 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25612)));
if((G__25612__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__25612__$1);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("audio",part_type)){
return "audio/mpeg";
} else {
return "image/png";
}
}
})());
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = data;
if(cljs.core.truth_(and__5160__auto__)){
return clojure.string.starts_with_QMARK_(data,"data:");
} else {
return and__5160__auto__;
}
})()))){
return Promise.resolve((await (async function (){var comma = data.indexOf(",");
return knoxx.backend.infra.agent.content_codec.media_map(part_type,(((comma >= (0)))?data.slice((comma + (1))):data),mime);
})()));
} else {
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = data;
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.starts_with_QMARK_(data,"http")));
} else {
return and__5160__auto__;
}
})()))){
return Promise.resolve(knoxx.backend.infra.agent.content_codec.media_map(part_type,data,mime));
} else {
if(cljs.core.truth_(url)){
var data_url = (await knoxx.backend.infra.agent.content_codec.fetch_b64_BANG_(url,mime));
var comma = data_url.indexOf(",");
return knoxx.backend.infra.agent.content_codec.media_map(part_type,(((comma >= (0)))?data_url.slice((comma + (1))):data_url),mime);
} else {
return Promise.resolve(null);

}
}
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
 * @implements {knoxx.backend.infra.agent.content_codec.IContentCodec}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.content_codec.DefaultContentCodec = (function (__meta,__extmap,__hash){
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k25624,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__25641 = k25624;
switch (G__25641) {
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k25624,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__25647){
var vec__25650 = p__25647;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25650,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25650,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.content-codec.DefaultContentCodec{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__25623){
var self__ = this;
var G__25623__$1 = this;
return (new cljs.core.RecordIter((0),G__25623__$1,0,cljs.core.PersistentVector.EMPTY,(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.content_codec.DefaultContentCodec(self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (0 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (909300687 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this25625,other25626){
var self__ = this;
var this25625__$1 = this;
return (((!((other25626 == null)))) && ((((this25625__$1.constructor === other25626.constructor)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this25625__$1.__extmap,other25626.__extmap)))));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.knoxx$backend$infra$agent$content_codec$IContentCodec$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.knoxx$backend$infra$agent$content_codec$IContentCodec$content_parts__GT_provider$arity$2 = (function (_,content_parts){
var self__ = this;
var ___$1 = this;
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.message.stored_content_part__GT_agent_part,(function (){var or__5162__auto__ = content_parts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.knoxx$backend$infra$agent$content_codec$IContentCodec$provider__GT_content_parts$arity$2 = (function (_,provider_content){
var self__ = this;
var ___$1 = this;
return cljs.core.vec((function (){var or__5162__auto__ = provider_content;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.EMPTY,k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.content_codec.DefaultContentCodec(self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k25624){
var self__ = this;
var this__5476__auto____$1 = this;
return cljs.core.contains_QMARK_(self__.__extmap,k25624);
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__25623){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__25718 = cljs.core.keyword_identical_QMARK_;
var expr__25719 = k__5478__auto__;
return (new knoxx.backend.infra.agent.content_codec.DefaultContentCodec(self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__25623),null));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__25623){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.content_codec.DefaultContentCodec(G__25623,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.cljs$lang$type = true);

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.content-codec/DefaultContentCodec",null,(1),null));
}));

(knoxx.backend.infra.agent.content_codec.DefaultContentCodec.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.content-codec/DefaultContentCodec");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.content-codec/DefaultContentCodec.
 */
knoxx.backend.infra.agent.content_codec.__GT_DefaultContentCodec = (function knoxx$backend$infra$agent$content_codec$__GT_DefaultContentCodec(){
return (new knoxx.backend.infra.agent.content_codec.DefaultContentCodec(null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.content-codec/DefaultContentCodec, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.content_codec.map__GT_DefaultContentCodec = (function knoxx$backend$infra$agent$content_codec$map__GT_DefaultContentCodec(G__25628){
var extmap__5511__auto__ = (function (){var G__25749 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$1(G__25628);
if(cljs.core.record_QMARK_(G__25628)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__25749);
} else {
return G__25749;
}
})();
return (new knoxx.backend.infra.agent.content_codec.DefaultContentCodec(null,cljs.core.not_empty(extmap__5511__auto__),null));
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.infra.agent.content_codec.IMediaMaterializer}
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
knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer = (function (__meta,__extmap,__hash){
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k25752,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__25772 = k25752;
switch (G__25772) {
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k25752,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__25777){
var vec__25778 = p__25777;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25778,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25778,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.content-codec.DefaultMediaMaterializer{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__25751){
var self__ = this;
var G__25751__$1 = this;
return (new cljs.core.RecordIter((0),G__25751__$1,0,cljs.core.PersistentVector.EMPTY,(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer(self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (0 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1108161726 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this25753,other25754){
var self__ = this;
var this25753__$1 = this;
return (((!((other25754 == null)))) && ((((this25753__$1.constructor === other25754.constructor)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this25753__$1.__extmap,other25754.__extmap)))));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.knoxx$backend$infra$agent$content_codec$IMediaMaterializer$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.knoxx$backend$infra$agent$content_codec$IMediaMaterializer$materialize_media_BANG_$arity$3 = (function (_,content_part,_auth_context){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.agent.content_codec.materialize_BANG_(content_part);
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.EMPTY,k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer(self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k25752){
var self__ = this;
var this__5476__auto____$1 = this;
return cljs.core.contains_QMARK_(self__.__extmap,k25752);
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__25751){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__25839 = cljs.core.keyword_identical_QMARK_;
var expr__25840 = k__5478__auto__;
return (new knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer(self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__25751),null));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__25751){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer(G__25751,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.cljs$lang$type = true);

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.content-codec/DefaultMediaMaterializer",null,(1),null));
}));

(knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.content-codec/DefaultMediaMaterializer");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.content-codec/DefaultMediaMaterializer.
 */
knoxx.backend.infra.agent.content_codec.__GT_DefaultMediaMaterializer = (function knoxx$backend$infra$agent$content_codec$__GT_DefaultMediaMaterializer(){
return (new knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer(null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.content-codec/DefaultMediaMaterializer, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.content_codec.map__GT_DefaultMediaMaterializer = (function knoxx$backend$infra$agent$content_codec$map__GT_DefaultMediaMaterializer(G__25756){
var extmap__5511__auto__ = (function (){var G__25870 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$1(G__25756);
if(cljs.core.record_QMARK_(G__25756)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__25870);
} else {
return G__25870;
}
})();
return (new knoxx.backend.infra.agent.content_codec.DefaultMediaMaterializer(null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.content_codec.default_content_codec = knoxx.backend.infra.agent.content_codec.__GT_DefaultContentCodec();
knoxx.backend.infra.agent.content_codec.default_media_materializer = knoxx.backend.infra.agent.content_codec.__GT_DefaultMediaMaterializer();

//# sourceMappingURL=knoxx.backend.infra.agent.content_codec.js.map
