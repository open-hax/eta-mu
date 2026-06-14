import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./promesa.core.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.media.blaze_client.js";
import "./knoxx.backend.domain.tools.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.domain.media.blaze');
knoxx.backend.domain.media.blaze.blank__GT_nil = (function knoxx$backend$domain$media$blaze$blank__GT_nil(v){
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
knoxx.backend.domain.media.blaze.config_value = (function knoxx$backend$domain$media$blaze$config_value(config,keyword_key,js_key,camel_key){
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
knoxx.backend.domain.media.blaze.env_value = (function knoxx$backend$domain$media$blaze$env_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___28363 = arguments.length;
var i__5898__auto___28364 = (0);
while(true){
if((i__5898__auto___28364 < len__5897__auto___28363)){
args__5903__auto__.push((arguments[i__5898__auto___28364]));

var G__28366 = (i__5898__auto___28364 + (1));
i__5898__auto___28364 = G__28366;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.media.blaze.env_value.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.media.blaze.env_value.cljs$core$IFn$_invoke$arity$variadic = (function (names){
return cljs.core.some((function (name){
var G__27928 = process;
var G__27928__$1 = (((G__27928 == null))?null:G__27928.env);
var G__27928__$2 = (((G__27928__$1 == null))?null:(G__27928__$1[name]));
if((G__27928__$2 == null)){
return null;
} else {
return knoxx.backend.domain.media.blaze.blank__GT_nil(G__27928__$2);
}
}),names);
}));

(knoxx.backend.domain.media.blaze.env_value.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.media.blaze.env_value.cljs$lang$applyTo = (function (seq27920){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq27920));
}));

knoxx.backend.domain.media.blaze.proxx_api_key = (function knoxx$backend$domain$media$blaze$proxx_api_key(config){
var or__5162__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil(knoxx.backend.domain.media.blaze.config_value(config,new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676),"proxx-auth-token","proxxAuthToken"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze.env_value.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["PROXX_AUTH_TOKEN","PROXY_AUTH_TOKEN"], 0));
}
});
knoxx.backend.domain.media.blaze.now_ms = (function knoxx$backend$domain$media$blaze$now_ms(){
return Date.now();
});
knoxx.backend.domain.media.blaze.safe_json = (function knoxx$backend$domain$media$blaze$safe_json(value){
try{return JSON.stringify(cljs.core.clj__GT_js(value));
}catch (e27941){var err = e27941;
return (""+"{\"log_error\":\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message)+"\"}");
}});
knoxx.backend.domain.media.blaze.log_info_BANG_ = (function knoxx$backend$domain$media$blaze$log_info_BANG_(event,data){
return console.log("[blaze.generate]",event,knoxx.backend.domain.media.blaze.safe_json(data));
});
knoxx.backend.domain.media.blaze.log_warn_BANG_ = (function knoxx$backend$domain$media$blaze$log_warn_BANG_(event,data){
return console.warn("[blaze.generate]",event,knoxx.backend.domain.media.blaze.safe_json(data));
});
knoxx.backend.domain.media.blaze.log_error_BANG_ = (function knoxx$backend$domain$media$blaze$log_error_BANG_(event,data){
return console.error("[blaze.generate]",event,knoxx.backend.domain.media.blaze.safe_json(data));
});
knoxx.backend.domain.media.blaze.summarize_body = (function knoxx$backend$domain$media$blaze$summarize_body(body){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"sample_rate","sample_rate",-732531803),new cljs.core.Keyword(null,"audio_format","audio_format",-2055986297),new cljs.core.Keyword(null,"lyrics_chars","lyrics_chars",-1564147216),new cljs.core.Keyword(null,"prompt_chars","prompt_chars",-474555565),new cljs.core.Keyword(null,"bitrate","bitrate",-1215050921),new cljs.core.Keyword(null,"body_keys","body_keys",542486941),new cljs.core.Keyword(null,"input_chars","input_chars",-380740835),new cljs.core.Keyword(null,"is_instrumental","is_instrumental",-1932552033),new cljs.core.Keyword(null,"lyrics_optimizer","lyrics_optimizer",2126950879),new cljs.core.Keyword(null,"model","model",331153215)],[new cljs.core.Keyword(null,"sample_rate","sample_rate",-732531803).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"audio_format","audio_format",-2055986297).cljs$core$IFn$_invoke$arity$1(body),(((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"lyrics","lyrics",-915658644).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).length),(((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"prompt","prompt",-78109487).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).length),new cljs.core.Keyword(null,"bitrate","bitrate",-1215050921).cljs$core$IFn$_invoke$arity$1(body),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.name,cljs.core.keys(body))),(((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"input","input",556931961).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).length),new cljs.core.Keyword(null,"is_instrumental","is_instrumental",-1932552033).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"lyrics_optimizer","lyrics_optimizer",2126950879).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body)]);
});
knoxx.backend.domain.media.blaze.summarize_payload = (function knoxx$backend$domain$media$blaze$summarize_payload(payload){
var data = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(payload);
var data_audio = ((cljs.core.map_QMARK_(data))?new cljs.core.Keyword(null,"audio","audio",1819127321).cljs$core$IFn$_invoke$arity$1(data):null);
var data_video = ((cljs.core.map_QMARK_(data))?new cljs.core.Keyword(null,"video","video",156888130).cljs$core$IFn$_invoke$arity$1(data):null);
var first_data = ((cljs.core.sequential_QMARK_(data))?cljs.core.first(data):null);
var G__27971 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"response_keys","response_keys",877387526),((cljs.core.map_QMARK_(payload))?cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.name,cljs.core.keys(payload))):null),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(payload),new cljs.core.Keyword(null,"object","object",1474613949),new cljs.core.Keyword(null,"object","object",1474613949).cljs$core$IFn$_invoke$arity$1(payload),new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(payload),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(payload),new cljs.core.Keyword(null,"error_present","error_present",-1758970765),cljs.core.boolean$(knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(payload))),new cljs.core.Keyword(null,"message_present","message_present",-1506611762),cljs.core.boolean$(knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(payload)))], null);
var G__27971__$1 = ((cljs.core.map_QMARK_(data))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27971,new cljs.core.Keyword(null,"data_keys","data_keys",980465776),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.name,cljs.core.keys(data)))):G__27971);
var G__27971__$2 = ((cljs.core.map_QMARK_(first_data))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27971__$1,new cljs.core.Keyword(null,"first_data_keys","first_data_keys",-1994674606),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.name,cljs.core.keys(first_data)))):G__27971__$1);
var G__27971__$3 = ((typeof data_audio === 'string')?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27971__$2,new cljs.core.Keyword(null,"data_audio_chars","data_audio_chars",-234491560),((data_audio).length)):G__27971__$2);
if(typeof data_video === 'string'){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27971__$3,new cljs.core.Keyword(null,"data_video_chars","data_video_chars",2017777647),((data_video).length));
} else {
return G__27971__$3;
}
});
knoxx.backend.domain.media.blaze.proxx_base_url = (function knoxx$backend$domain$media$blaze$proxx_base_url(config){
return knoxx.backend.domain.media.blaze_client.proxx_base_url(config);
});
knoxx.backend.domain.media.blaze.normalize_modality = (function knoxx$backend$domain$media$blaze$normalize_modality(value){
var m = clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "chat";
}
})()))));
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 8, ["image",null,"chat",null,"speech",null,"video",null,"music",null,"text",null,"images",null,"tts",null], null), null),m)){
var G__28006 = m;
switch (G__28006) {
case "text":
return "chat";

break;
case "images":
return "image";

break;
case "speech":
return "tts";

break;
default:
return m;

}
} else {
return "chat";
}
});
knoxx.backend.domain.media.blaze.default_model = (function knoxx$backend$domain$media$blaze$default_model(modality){
var G__28012 = modality;
switch (G__28012) {
case "music":
return "musicgen-small";

break;
case "image":
return "MiniMax-image-01-highspeed";

break;
case "video":
return "qwen3.5-omni-flash-thinking-search";

break;
case "tts":
return "MiniMax-speech-2.8-hd-highspeed";

break;
default:
return "fast-general";

}
});
knoxx.backend.domain.media.blaze.blaze_queue = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"in-flight","in-flight",1251893790),false,new cljs.core.Keyword(null,"waiting","waiting",895906735),cljs.core.PersistentVector.EMPTY], null));
knoxx.backend.domain.media.blaze.candidate_models = (function knoxx$backend$domain$media$blaze$candidate_models(modality,requested_model){
var temp__5823__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil(requested_model);
if(cljs.core.truth_(temp__5823__auto__)){
var model = temp__5823__auto__;
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [model], null);
} else {
var G__28021 = modality;
switch (G__28021) {
case "music":
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["musicgen-small","MiniMax-music-2.6-free","MiniMax-music-2.5-free","MiniMax-music-2.6-highspeed","MiniMax-music-2.5-highspeed"], null);

break;
case "image":
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["MiniMax-image-01-highspeed"], null);

break;
case "video":
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["qwen3.5-omni-flash-thinking-search"], null);

break;
case "tts":
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["MiniMax-speech-2.8-hd-highspeed"], null);

break;
default:
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.media.blaze.default_model(modality)], null);

}
}
});




/**
 * Best-effort detection of whether a Blaze payload includes any usable output.
 * 
 * Some upstream/proxy responses may report status=terminated/failed while still
 * including an asset URL or embedded audio/image/video bytes. The known-good
 * Python script treats these as success when an asset can be saved, so Knoxx
 * should only treat logical statuses as fatal when no output is present.
 */
knoxx.backend.domain.media.blaze.payload_has_output_QMARK_ = (function knoxx$backend$domain$media$blaze$payload_has_output_QMARK_(payload){
var data = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(payload);
var data_maps = ((cljs.core.map_QMARK_(data))?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [data], null):((cljs.core.sequential_QMARK_(data))?cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.map_QMARK_,data):cljs.core.PersistentVector.EMPTY
));
var has_direct_QMARK_ = cljs.core.some((function (m){
var or__5162__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"audio","audio",1819127321).cljs$core$IFn$_invoke$arity$1(m));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"video","video",156888130).cljs$core$IFn$_invoke$arity$1(m));
}
}
}),data_maps);
var text = (knoxx.backend.domain.media.blaze.response_text.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.media.blaze.response_text.cljs$core$IFn$_invoke$arity$1(payload) : knoxx.backend.domain.media.blaze.response_text.call(null,payload));
var asset_text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([payload], 0))));
return cljs.core.boolean$((function (){var or__5162__auto__ = has_direct_QMARK_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (knoxx.backend.domain.media.blaze.first_data_url.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.media.blaze.first_data_url.cljs$core$IFn$_invoke$arity$1(asset_text) : knoxx.backend.domain.media.blaze.first_data_url.call(null,asset_text));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (knoxx.backend.domain.media.blaze.first_media_url.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.media.blaze.first_media_url.cljs$core$IFn$_invoke$arity$1(asset_text) : knoxx.backend.domain.media.blaze.first_media_url.call(null,asset_text));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (knoxx.backend.domain.media.blaze.hex_asset_string.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.media.blaze.hex_asset_string.cljs$core$IFn$_invoke$arity$1(payload) : knoxx.backend.domain.media.blaze.hex_asset_string.call(null,payload));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return (knoxx.backend.domain.media.blaze.base64_asset_string.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.media.blaze.base64_asset_string.cljs$core$IFn$_invoke$arity$1(payload) : knoxx.backend.domain.media.blaze.base64_asset_string.call(null,payload));
}
}
}
}
})());
});
knoxx.backend.domain.media.blaze.default_system_prompt = (function knoxx$backend$domain$media$blaze$default_system_prompt(modality){
var G__28058 = modality;
switch (G__28058) {
case "music":
return "You are a music generation endpoint. Return generated audio asset URLs or data URLs when available, plus concise metadata.";

break;
case "image":
return "You are an image generation endpoint. Return generated image asset URLs or data URLs when available, plus concise metadata.";

break;
case "video":
return "You are a video generation endpoint. Return generated video asset URLs or data URLs when available, plus concise metadata.";

break;
case "tts":
return "You are a text-to-speech generation endpoint. Return generated audio asset URLs or data URLs when available, plus concise metadata.";

break;
default:
return "You are BlazeAPI. Produce the requested result concisely.";

}
});
knoxx.backend.domain.media.blaze.parse_json_object = (function knoxx$backend$domain$media$blaze$parse_json_object(raw,label){
var temp__5823__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil(raw);
if(cljs.core.truth_(temp__5823__auto__)){
var text = temp__5823__auto__;
try{var parsed = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(text),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(cljs.core.map_QMARK_(parsed)){
return parsed;
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" must be a JSON object")));
}
}catch (e28060){var err = e28060;
throw (new Error((""+"Invalid "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))));
}} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
});
knoxx.backend.domain.media.blaze.bool_param = (function knoxx$backend$domain$media$blaze$bool_param(params,key){
var v = (params[key]);
if(v === true){
return true;
} else {
if(v === false){
return false;
} else {
if(typeof v === 'number'){
return (!((v === (0))));
} else {
if(typeof v === 'string'){
var G__28063 = clojure.string.lower_case(clojure.string.trim(v));
switch (G__28063) {
case "true":
case "yes":
case "1":
case "on":
return true;

break;
case "false":
case "no":
case "0":
case "off":
return false;

break;
default:
return null;

}
} else {
return null;

}
}
}
}
});
knoxx.backend.domain.media.blaze.prompt_implies_vocals_QMARK_ = (function knoxx$backend$domain$media$blaze$prompt_implies_vocals_QMARK_(prompt){
return cljs.core.boolean$(cljs.core.re_find(/\b(vocal|vocals|voice|singer|singing|sing|song|lyrics|lyric|rap|rapper|spoken|verse|chorus|hook)\b/i,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prompt))));
});
knoxx.backend.domain.media.blaze.output_path_audio_format = (function knoxx$backend$domain$media$blaze$output_path_audio_format(params){
var temp__5825__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil((params["output_path"]));
if(cljs.core.truth_(temp__5825__auto__)){
var raw = temp__5825__auto__;
var lower = clojure.string.lower_case(raw);
if(clojure.string.ends_with_QMARK_(lower,".wav")){
return "wav";
} else {
if(clojure.string.ends_with_QMARK_(lower,".pcm")){
return "pcm";
} else {
if(clojure.string.ends_with_QMARK_(lower,".mp3")){
return "mp3";
} else {
return null;

}
}
}
} else {
return null;
}
});
knoxx.backend.domain.media.blaze.lyric_section_pattern = /^\s*\((Intro|Verse\s*\d*|Pre[- ]?Chorus|Chorus|Final\s+Chorus|Bridge|Hook|Refrain|Interlude|Breakdown|Outro)\)\s*$/;
knoxx.backend.domain.media.blaze.normalize_lyric_section_line = (function knoxx$backend$domain$media$blaze$normalize_lyric_section_line(line){
var temp__5823__auto__ = cljs.core.re_matches(knoxx.backend.domain.media.blaze.lyric_section_pattern,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(line)));
if(cljs.core.truth_(temp__5823__auto__)){
var vec__28094 = temp__5823__auto__;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28094,(0),null);
var section = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28094,(1),null);
return (""+"["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(section)+"]");
} else {
return line;
}
});
knoxx.backend.domain.media.blaze.normalize_music_lyrics = (function knoxx$backend$domain$media$blaze$normalize_music_lyrics(lyrics){
var temp__5825__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil(lyrics);
if(cljs.core.truth_(temp__5825__auto__)){
var text = temp__5825__auto__;
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.media.blaze.normalize_lyric_section_line,clojure.string.split_lines(text)));
} else {
return null;
}
});
knoxx.backend.domain.media.blaze.ensure_vocal_music_prompt = (function knoxx$backend$domain$media$blaze$ensure_vocal_music_prompt(prompt,lyrics){
var text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prompt));
if(cljs.core.truth_((function (){var and__5160__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil(lyrics);
if(cljs.core.truth_(and__5160__auto__)){
return (!(knoxx.backend.domain.media.blaze.prompt_implies_vocals_QMARK_(text)));
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)+" Vocal song arrangement with clear sung or spoken vocal delivery; fit the provided lyrics naturally into verses, choruses, bridge, and outro.");
} else {
return text;
}
});
knoxx.backend.domain.media.blaze.build_body = (function knoxx$backend$domain$media$blaze$build_body(params,modality,model,prompt){
var system_prompt = (function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil((params["system_prompt"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze.default_system_prompt(modality);
}
})();
var payload = knoxx.backend.domain.media.blaze.parse_json_object((params["payload_json"]),"payload_json");
var music_lyrics = knoxx.backend.domain.media.blaze.normalize_music_lyrics((params["lyrics"]));
var music_prompt = knoxx.backend.domain.media.blaze.ensure_vocal_music_prompt(prompt,music_lyrics);
var explicit_instrumental = knoxx.backend.domain.media.blaze.bool_param(params,"is_instrumental");
var instrumental_QMARK_ = (((explicit_instrumental == null))?(music_lyrics == null):explicit_instrumental);
var explicit_lyrics_optimizer = knoxx.backend.domain.media.blaze.bool_param(params,"lyrics_optimizer");
var lyrics_optimizer_QMARK_ = (((explicit_lyrics_optimizer == null))?false:explicit_lyrics_optimizer);
var music_format = (function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil((params["audio_format"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.media.blaze.output_path_audio_format(params);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "mp3";
}
}
})();
var base = (function (){var G__28140 = modality;
switch (G__28140) {
case "image":
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"prompt","prompt",-78109487),prompt], null);

break;
case "video":
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"prompt","prompt",-78109487),prompt], null);

break;
case "music":
var G__28143 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"prompt","prompt",-78109487),music_prompt,new cljs.core.Keyword(null,"lyrics_optimizer","lyrics_optimizer",2126950879),lyrics_optimizer_QMARK_,new cljs.core.Keyword(null,"is_instrumental","is_instrumental",-1932552033),instrumental_QMARK_,new cljs.core.Keyword(null,"sample_rate","sample_rate",-732531803),(function (){var v = (params["sample_rate"]);
if(typeof v === 'number'){
return v;
} else {
return (44100);
}
})(),new cljs.core.Keyword(null,"bitrate","bitrate",-1215050921),(function (){var v = (params["bitrate"]);
if(typeof v === 'number'){
return v;
} else {
return (256000);
}
})(),new cljs.core.Keyword(null,"audio_format","audio_format",-2055986297),music_format], null);
var G__28143__$1 = (cljs.core.truth_(music_lyrics)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28143,new cljs.core.Keyword(null,"lyrics","lyrics",-915658644),music_lyrics):G__28143);
if(typeof (params["duration"]) === 'number'){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28143__$1,new cljs.core.Keyword(null,"duration","duration",1444101068),(params["duration"]));
} else {
return G__28143__$1;
}

break;
case "tts":
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"input","input",556931961),prompt,new cljs.core.Keyword(null,"voice","voice",185716428),"default",new cljs.core.Keyword(null,"response_format","response_format",1229973741),"mp3"], null);

break;
default:
var G__28145 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"stream","stream",1534941648),false,new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"system",new cljs.core.Keyword(null,"content","content",15833224),system_prompt], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role","role",-736691072),"user",new cljs.core.Keyword(null,"content","content",15833224),prompt], null)], null)], null);
var G__28145__$1 = (((!(((params["temperature"]) == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28145,new cljs.core.Keyword(null,"temperature","temperature",899018429),(params["temperature"])):G__28145);
var G__28145__$2 = (((!(((params["max_tokens"]) == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28145__$1,new cljs.core.Keyword(null,"max_tokens","max_tokens",319809413),(params["max_tokens"])):G__28145__$1);
if(cljs.core.truth_(knoxx.backend.domain.media.blaze.blank__GT_nil((params["response_format"])))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28145__$2,new cljs.core.Keyword(null,"response_format","response_format",1229973741),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),knoxx.backend.domain.media.blaze.blank__GT_nil((params["response_format"]))], null));
} else {
return G__28145__$2;
}

}
})();
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([base,payload], 0));
});
knoxx.backend.domain.media.blaze.failed_payload_message = (function knoxx$backend$domain$media$blaze$failed_payload_message(payload){
var status = (function (){var G__28150 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(payload);
var G__28150__$1 = (((G__28150 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28150)));
if((G__28150__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__28150__$1);
}
})();
var error = knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(payload));
var message = knoxx.backend.domain.media.blaze.blank__GT_nil(new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(payload));
var status_msg = knoxx.backend.domain.media.blaze.blank__GT_nil(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(payload,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"analysis_info","analysis_info",-805311070),new cljs.core.Keyword(null,"status_msg","status_msg",669815518)], null)));
var no_output_QMARK_ = new cljs.core.Keyword(null,"_blaze_no_output","_blaze_no_output",1244916674).cljs$core$IFn$_invoke$arity$1(payload) === true;
var has_output_QMARK_ = knoxx.backend.domain.media.blaze.payload_has_output_QMARK_(payload);
if(((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["terminated",null,"failed",null,"error",null,"cancelled",null,"canceled",null], null), null),status)) && ((!(has_output_QMARK_))))){
return (""+"Blaze returned "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status)+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = (function (){var or__5162__auto__ = error;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return message;
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var detail = temp__5825__auto__;
return (""+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(detail));
} else {
return null;
}
})()));
} else {
if(cljs.core.truth_((function (){var or__5162__auto__ = no_output_QMARK_;
if(or__5162__auto__){
return or__5162__auto__;
} else {
var and__5160__auto__ = status_msg;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.re_find(/usage limit exceeded|daily usage limit/i,status_msg);
} else {
return and__5160__auto__;
}
}
})())){
return (""+"Blaze returned no output"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = (function (){var or__5162__auto__ = status_msg;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = error;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return message;
}
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var detail = temp__5825__auto__;
return (""+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(detail));
} else {
return null;
}
})()));
} else {
return null;

}
}
});
knoxx.backend.domain.media.blaze.generate_payload_BANG_ = (function knoxx$backend$domain$media$blaze$generate_payload_BANG_(config,body,modality,log_context){
var start_ms = knoxx.backend.domain.media.blaze.now_ms();
knoxx.backend.domain.media.blaze.log_info_BANG_("request-start",cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(log_context,new cljs.core.Keyword(null,"body","body",-2049205669),knoxx.backend.domain.media.blaze.summarize_body(body)));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze_client.generate_BANG_(knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$1(config),modality,body,log_context)),(function (payload_clj){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.log_info_BANG_("payload",cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(log_context,new cljs.core.Keyword(null,"elapsed_ms","elapsed_ms",-325114493),(knoxx.backend.domain.media.blaze.now_ms() - start_ms),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"payload","payload",-383036092),knoxx.backend.domain.media.blaze.summarize_payload(payload_clj)], 0)))),(function (_){
return promesa.protocols._mcat(promesa.protocols._promise((function (){var temp__5825__auto__ = knoxx.backend.domain.media.blaze.failed_payload_message(payload_clj);
if(cljs.core.truth_(temp__5825__auto__)){
var failure = temp__5825__auto__;
knoxx.backend.domain.media.blaze.log_warn_BANG_("logical-failure",cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(log_context,new cljs.core.Keyword(null,"elapsed_ms","elapsed_ms",-325114493),(knoxx.backend.domain.media.blaze.now_ms() - start_ms),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"failure","failure",720415879),failure,new cljs.core.Keyword(null,"payload","payload",-383036092),knoxx.backend.domain.media.blaze.summarize_payload(payload_clj)], 0)));

throw (new Error(failure));
} else {
return null;
}
})()),(function (___$1){
return promesa.protocols._promise(payload_clj);
}));
}));
}));
}));
});
knoxx.backend.domain.media.blaze.content_part_text = (function knoxx$backend$domain$media$blaze$content_part_text(part){
if(typeof part === 'string'){
return part;
} else {
if(cljs.core.map_QMARK_(part)){
var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"image_url","image_url",-1356964050).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(temp__5825__auto__)){
var nested = temp__5825__auto__;
if(cljs.core.map_QMARK_(nested)){
return new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(nested);
} else {
return nested;
}
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = (function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"audio_url","audio_url",1511955128).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(temp__5825__auto__)){
var nested = temp__5825__auto__;
if(cljs.core.map_QMARK_(nested)){
return new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(nested);
} else {
return nested;
}
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = (function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"video_url","video_url",-1220813811).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(temp__5825__auto__)){
var nested = temp__5825__auto__;
if(cljs.core.map_QMARK_(nested)){
return new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(nested);
} else {
return nested;
}
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([part], 0));
}
}
}
}
}
}
} else {
if(cljs.core.sequential_QMARK_(part)){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.media.blaze.content_part_text,part));
} else {
if((part == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(part));

}
}
}
}
});
knoxx.backend.domain.media.blaze.response_text = (function knoxx$backend$domain$media$blaze$response_text(payload){
var choice = cljs.core.first(new cljs.core.Keyword(null,"choices","choices",1385611597).cljs$core$IFn$_invoke$arity$1(payload));
var message = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(choice);
var content = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(choice);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"output_text","output_text",1741102032).cljs$core$IFn$_invoke$arity$1(payload);
}
}
})();
var or__5162__auto__ = knoxx.backend.domain.media.blaze.content_part_text(content);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__28180 = payload;
var G__28180__$1 = (((G__28180 == null))?null:new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(G__28180));
var G__28180__$2 = (((G__28180__$1 == null))?null:cljs.core.first(G__28180__$1));
if((G__28180__$2 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(G__28180__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (function (){var G__28188 = payload;
var G__28188__$1 = (((G__28188 == null))?null:new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(G__28188));
if((G__28188__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(G__28188__$1);
}
})();
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (function (){var G__28193 = payload;
var G__28193__$1 = (((G__28193 == null))?null:new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(G__28193));
if((G__28193__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"audio","audio",1819127321).cljs$core$IFn$_invoke$arity$1(G__28193__$1);
}
})();
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = (function (){var G__28194 = payload;
var G__28194__$1 = (((G__28194 == null))?null:new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(G__28194));
if((G__28194__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"video","video",156888130).cljs$core$IFn$_invoke$arity$1(G__28194__$1);
}
})();
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([payload], 0));
}
}
}
}
}
});
knoxx.backend.domain.media.blaze.data_url_pattern = /data:([^;,\s]+);base64,([A-Za-z0-9+\/=]+)/;
knoxx.backend.domain.media.blaze.http_url_pattern = /https?:\/\/[^\s\]\)\}\"'<>]+/;
knoxx.backend.domain.media.blaze.first_data_url = (function knoxx$backend$domain$media$blaze$first_data_url(text){
var temp__5825__auto__ = cljs.core.re_find(knoxx.backend.domain.media.blaze.data_url_pattern,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)));
if(cljs.core.truth_(temp__5825__auto__)){
var vec__28198 = temp__5825__auto__;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28198,(0),null);
var mime = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28198,(1),null);
var b64 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28198,(2),null);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mime-type","mime-type",1058646439),mime,new cljs.core.Keyword(null,"buffer","buffer",617295198),Buffer.from(b64,"base64")], null);
} else {
return null;
}
});
knoxx.backend.domain.media.blaze.likely_media_url_QMARK_ = (function knoxx$backend$domain$media$blaze$likely_media_url_QMARK_(url){
var or__5162__auto__ = cljs.core.re_find(/\.(png|jpe?g|webp|gif|svg|mp3|wav|ogg|m4a|flac|aac|mp4|webm|mov)(\?|$)/i,url);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.re_find(/(image|audio|video|music|file|asset|download|output)/i,url);
}
});
knoxx.backend.domain.media.blaze.first_media_url = (function knoxx$backend$domain$media$blaze$first_media_url(text){
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.media.blaze.likely_media_url_QMARK_,cljs.core.re_seq(knoxx.backend.domain.media.blaze.http_url_pattern,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)))));
});
knoxx.backend.domain.media.blaze.payload_strings = (function knoxx$backend$domain$media$blaze$payload_strings(value){
if(typeof value === 'string'){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [value], null);
} else {
if(cljs.core.map_QMARK_(value)){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.media.blaze.payload_strings,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.vals(value)], 0));
} else {
if(cljs.core.sequential_QMARK_(value)){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.media.blaze.payload_strings,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([value], 0));
} else {
return cljs.core.PersistentVector.EMPTY;

}
}
}
});
knoxx.backend.domain.media.blaze.hex_asset_string = (function knoxx$backend$domain$media$blaze$hex_asset_string(payload){
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (value){
return (((cljs.core.count(value) > (1000))) && (((cljs.core.even_QMARK_(cljs.core.count(value))) && (cljs.core.boolean$(cljs.core.re_matches(/[0-9A-Fa-f]+/,value))))));
}),knoxx.backend.domain.media.blaze.payload_strings(payload)));
});
knoxx.backend.domain.media.blaze.base64_asset_string = (function knoxx$backend$domain$media$blaze$base64_asset_string(payload){
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (value){
return (((cljs.core.count(value) > (1000))) && ((((cljs.core.mod(cljs.core.count(value),(4)) === (0))) && (((cljs.core.not(cljs.core.re_find(/^https?:\/\//,value))) && (cljs.core.boolean$(cljs.core.re_matches(/[A-Za-z0-9+\/=]+/,value))))))));
}),knoxx.backend.domain.media.blaze.payload_strings(payload)));
});
knoxx.backend.domain.media.blaze.modality_mime_type = (function knoxx$backend$domain$media$blaze$modality_mime_type(modality){
var G__28223 = modality;
switch (G__28223) {
case "image":
return "image/png";

break;
case "video":
return "video/mp4";

break;
case "music":
return "audio/mpeg";

break;
case "tts":
return "audio/mpeg";

break;
default:
return "application/octet-stream";

}
});
knoxx.backend.domain.media.blaze.fetch_media_url_BANG_ = (function knoxx$backend$domain$media$blaze$fetch_media_url_BANG_(config,url){
knoxx.backend.domain.media.blaze.log_info_BANG_("asset-download-start",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"url","url",276297046),url], null));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze_client.fetch_generated_media_BANG_(knoxx.backend.domain.media.blaze_client.client.cljs$core$IFn$_invoke$arity$1(config),url)),(function (asset){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.log_info_BANG_("asset-download-complete",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"mime_type","mime_type",1613436611),new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(asset),new cljs.core.Keyword(null,"bytes","bytes",1175866680),new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(asset).length], null))),(function (___20890__auto__){
return promesa.protocols._promise(asset);
}));
}));
}));
});
knoxx.backend.domain.media.blaze.default_output_path = (function knoxx$backend$domain$media$blaze$default_output_path(modality,mime_type){
var folder = (function (){var G__28242 = modality;
switch (G__28242) {
case "music":
return "Music/blaze";

break;
case "image":
return "Images/blaze";

break;
case "video":
return "Video/blaze";

break;
case "tts":
return "Voice/blaze";

break;
default:
return "Blaze/chat";

}
})();
var ext = knoxx.backend.domain.media.mime_type__GT_extension(mime_type);
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(folder)+"/blaze-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_crypto.randomUUID())+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ext));
});
knoxx.backend.domain.media.blaze.response_output_path = (function knoxx$backend$domain$media$blaze$response_output_path(){
return (""+"Blaze/responses/blaze-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_crypto.randomUUID())+".json");
});
knoxx.backend.domain.media.blaze.write_buffer_BANG_ = (function knoxx$backend$domain$media$blaze$write_buffer_BANG_(runtime,config,raw_output_path,buffer){
var map__28256 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,raw_output_path);
var map__28256__$1 = cljs.core.__destructure_map(map__28256);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28256__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28256__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20900__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.mkdir(shadow.esm.esm_import$node_path.dirname(absolute),({"recursive": true}))),(function (___20890__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.writeFile(absolute,buffer)),(function (___20890__auto____$1){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.log_info_BANG_("asset-write",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"workspace_path","workspace_path",-13396809),relative,new cljs.core.Keyword(null,"bytes","bytes",1175866680),buffer.length], null))),(function (___20890__auto____$2){
return promesa.protocols._promise(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"absolute-path","absolute-path",-1285195449),absolute,new cljs.core.Keyword(null,"workspace-path","workspace-path",918930789),relative,new cljs.core.Keyword(null,"bytes","bytes",1175866680),buffer.length], null));
}));
}));
}));
}));
});
knoxx.backend.domain.media.blaze.write_response_json_BANG_ = (function knoxx$backend$domain$media$blaze$write_response_json_BANG_(runtime,config,payload){
var raw = JSON.stringify(cljs.core.clj__GT_js(payload),null,(2));
return knoxx.backend.domain.media.blaze.write_buffer_BANG_(runtime,config,knoxx.backend.domain.media.blaze.response_output_path(),Buffer.from(raw,"utf8"));
});
knoxx.backend.domain.media.blaze.maybe_save_asset_BANG_ = (function knoxx$backend$domain$media$blaze$maybe_save_asset_BANG_(runtime,config,modality,output_path,text,payload){
var temp__5823__auto__ = knoxx.backend.domain.media.blaze.first_data_url(text);
if(cljs.core.truth_(temp__5823__auto__)){
var data = temp__5823__auto__;
return knoxx.backend.domain.media.blaze.write_buffer_BANG_(runtime,config,(function (){var or__5162__auto__ = output_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze.default_output_path(modality,new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(data));
}
})(),new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(data));
} else {
var temp__5823__auto____$1 = knoxx.backend.domain.media.blaze.hex_asset_string(payload);
if(cljs.core.truth_(temp__5823__auto____$1)){
var hex = temp__5823__auto____$1;
return knoxx.backend.domain.media.blaze.write_buffer_BANG_(runtime,config,(function (){var or__5162__auto__ = output_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze.default_output_path(modality,knoxx.backend.domain.media.blaze.modality_mime_type(modality));
}
})(),Buffer.from(hex,"hex"));
} else {
var temp__5823__auto____$2 = knoxx.backend.domain.media.blaze.base64_asset_string(payload);
if(cljs.core.truth_(temp__5823__auto____$2)){
var b64 = temp__5823__auto____$2;
return knoxx.backend.domain.media.blaze.write_buffer_BANG_(runtime,config,(function (){var or__5162__auto__ = output_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze.default_output_path(modality,knoxx.backend.domain.media.blaze.modality_mime_type(modality));
}
})(),Buffer.from(b64,"base64"));
} else {
var temp__5823__auto____$3 = knoxx.backend.domain.media.blaze.first_media_url(text);
if(cljs.core.truth_(temp__5823__auto____$3)){
var url = temp__5823__auto____$3;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.fetch_media_url_BANG_(config,url)),(function (asset){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.write_buffer_BANG_(runtime,config,(function (){var or__5162__auto__ = output_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.blaze.default_output_path(modality,new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(asset));
}
})(),new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(asset))),(function (saved){
return promesa.protocols._promise(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(saved,new cljs.core.Keyword(null,"source-url","source-url",569467631),new cljs.core.Keyword(null,"source-url","source-url",569467631).cljs$core$IFn$_invoke$arity$1(asset)));
}));
}));
}));
} else {
return promesa.core.resolved(null);
}
}
}
}
});
knoxx.backend.domain.media.blaze.error_message = (function knoxx$backend$domain$media$blaze$error_message(err){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return err;
}
})()));
});
knoxx.backend.domain.media.blaze.attempt_generation_BANG_ = (async function knoxx$backend$domain$media$blaze$attempt_generation_BANG_(config,params,modality,prompt,models,attempts,log_context){
var temp__5823__auto__ = cljs.core.first(models);
if(cljs.core.truth_(temp__5823__auto__)){
var model = temp__5823__auto__;
var body = knoxx.backend.domain.media.blaze.build_body(params,modality,model,prompt);
var attempt_context = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(log_context,new cljs.core.Keyword(null,"attempt_index","attempt_index",-1007073116),(cljs.core.count(attempts) + (1)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"model","model",331153215),model], 0));
knoxx.backend.domain.media.blaze.log_info_BANG_("attempt-start",cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(attempt_context,new cljs.core.Keyword(null,"remaining_models","remaining_models",-711438219),cljs.core.count(models)));

try{var payload = (await knoxx.backend.domain.media.blaze.generate_payload_BANG_(config,body,modality,attempt_context));
knoxx.backend.domain.media.blaze.log_info_BANG_("attempt-ok",cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(attempt_context,new cljs.core.Keyword(null,"payload","payload",-383036092),knoxx.backend.domain.media.blaze.summarize_payload(payload)));

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"payload","payload",-383036092),payload,new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"attempts","attempts",1024246729),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(attempts,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"status","status",-1997798413),"ok"], null))], null);
}catch (e28290){var err = e28290;
var msg = knoxx.backend.domain.media.blaze.error_message(err);
var next_attempts = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(attempts,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),msg], null));
knoxx.backend.domain.media.blaze.log_warn_BANG_("attempt-failed",cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(attempt_context,new cljs.core.Keyword(null,"error","error",-978969032),msg,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"attempts","attempts",1024246729),next_attempts], 0)));

var G__28293 = config;
var G__28294 = params;
var G__28295 = modality;
var G__28296 = prompt;
var G__28297 = cljs.core.rest(models);
var G__28298 = next_attempts;
var G__28299 = log_context;
return (knoxx.backend.domain.media.blaze.attempt_generation_BANG_.cljs$core$IFn$_invoke$arity$7 ? knoxx.backend.domain.media.blaze.attempt_generation_BANG_.cljs$core$IFn$_invoke$arity$7(G__28293,G__28294,G__28295,G__28296,G__28297,G__28298,G__28299) : knoxx.backend.domain.media.blaze.attempt_generation_BANG_.call(null,G__28293,G__28294,G__28295,G__28296,G__28297,G__28298,G__28299));
}} else {
knoxx.backend.domain.media.blaze.log_error_BANG_("all-attempts-failed",cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(log_context,new cljs.core.Keyword(null,"attempts","attempts",1024246729),attempts));

return Promise.reject((new Error((""+"Proxx Blaze "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(modality)+" generation failed for all candidate models: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([attempts], 0)))))));
}
});
knoxx.backend.domain.media.blaze.blaze_generate_params = new cljs.core.PersistentVector(null, 16, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt","prompt",-78109487),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Prompt for BlazeAPI. For media, include style, duration/size, format, language, and any safety/copyright constraints."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"modality","modality",-2007555412),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Generation mode: chat, image, video, music, or tts. Default chat."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional exact Blaze public model ID. If omitted, blaze.generate tries same-modality candidate models only: music 2.6 then 2.5; image MiniMax then Qwen image models; video Qwen video-capable models; TTS MiniMax speech."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Workspace-relative output path for a returned asset. If omitted, uses Images/blaze, Video/blaze, Music/blaze, or Voice/blaze."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional system prompt for the Blaze chat-completions request."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"payload_json","payload_json",1533789905),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Advanced: JSON object merged into the OpenAI-compatible chat/completions payload. Use only for Blaze-specific fields."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"lyrics","lyrics",-915658644),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Music only: explicit lyrics. If omitted and the prompt does not imply vocals, blaze.generate defaults to instrumental music."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"is_instrumental","is_instrumental",-1932552033),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Music only: force instrumental true/false. Defaults true for ambient/instrumental prompts with no lyrics, false for vocal/song prompts."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"lyrics_optimizer","lyrics_optimizer",2126950879),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Music only: force Blaze lyrics_optimizer true/false. Defaults true only for non-instrumental music without explicit lyrics."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"audio_format","audio_format",-2055986297),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Music/TTS output format hint such as mp3, wav, or pcm. For music, output_path .wav/.mp3/.pcm also influences this."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sample_rate","sample_rate",-732531803),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Music only: sample rate. Default 44100."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"bitrate","bitrate",-1215050921),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Music only: bitrate. Default 256000."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"temperature","temperature",899018429),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional sampling temperature."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(0),new cljs.core.Keyword(null,"max","max",61366548),(2)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"max_tokens","max_tokens",319809413),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional max token limit."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"response_format","response_format",1229973741),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional OpenAI-compatible response_format type, e.g. json_object."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.media.blaze.blaze_music_generate_params = new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt","prompt",-78109487),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"INSTRUMENTAL ONLY \u2014 Music style prompt. Describe arrangement, genre, BPM, key, mood, mix notes, and instruments. Do NOT include lyrics here. Current models (musicgen-small) generate instrumentals only."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional exact music model ID. Defaults through candidate order: musicgen-small (local free, instrumental only). MiniMax models require API key and may support vocals but are not currently available."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Workspace-relative output path. Defaults to Music/blaze/<uuid>.wav. The extension .wav or .mp3 sets audio_format unless audio_format is provided. IMPORTANT: musicgen-small returns WAV, so use .wav extension to avoid format confusion."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"is_instrumental","is_instrumental",-1932552033),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Always true for current models. musicgen-small is instrumental-only. Leave unset."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"audio_format","audio_format",-2055986297),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Output format hint: wav or mp3. If omitted, inferred from output_path extension or wav. musicgen-small returns WAV."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sample_rate","sample_rate",-732531803),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Sample rate. Default 44100."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"bitrate","bitrate",-1215050921),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Bitrate. Default 256000."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"duration","duration",1444101068),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Duration in seconds. Default 5 for musicgen-small. ALWAYS set to 30+ for usable music. musicgen-small max is around 30s."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"payload_json","payload_json",1533789905),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Advanced: JSON object merged into the Proxx /v1/music/generations payload. Use only for Blaze-specific music fields."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.media.blaze.blaze_image_generate_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt","prompt",-78109487),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Image prompt for Proxx/Blaze image generation. Include subject, style, composition, aspect/size, and constraints."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional exact Blaze image model ID. Defaults through MiniMax/Qwen image candidates."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Workspace-relative output path. Defaults to Images/blaze/<uuid> with the detected image extension."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"payload_json","payload_json",1533789905),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Advanced: JSON object merged into the Proxx /v1/images/generations payload."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.media.blaze.blaze_video_generate_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt","prompt",-78109487),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Video prompt for Proxx/Blaze video generation. Include subject, action, camera, duration, style, and constraints."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional exact Blaze video model ID. Defaults through Qwen video-capable candidates."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Workspace-relative output path. Defaults to Video/blaze/<uuid> with the detected video extension."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"payload_json","payload_json",1533789905),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Advanced: JSON object merged into the Proxx /v1/videos/generations payload."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.media.blaze.execute_for_modality = (function knoxx$backend$domain$media$blaze$execute_for_modality(modality,tool_name,runtime,config,tool_call_id,params,a,b,c){
var next_params = Object.assign(({}),params);
(next_params["modality"] = modality);

(next_params["tool_name"] = tool_name);

return (knoxx.backend.domain.media.blaze.blaze_generate_execute.cljs$core$IFn$_invoke$arity$7 ? knoxx.backend.domain.media.blaze.blaze_generate_execute.cljs$core$IFn$_invoke$arity$7(runtime,config,tool_call_id,next_params,a,b,c) : knoxx.backend.domain.media.blaze.blaze_generate_execute.call(null,runtime,config,tool_call_id,next_params,a,b,c));
});
knoxx.backend.domain.media.blaze.blaze_music_generate_execute = (function knoxx$backend$domain$media$blaze$blaze_music_generate_execute(runtime,config,tool_call_id,params,a,b,c){
return knoxx.backend.domain.media.blaze.execute_for_modality("music","music.generate_song",runtime,config,tool_call_id,params,a,b,c);
});
knoxx.backend.domain.media.blaze.blaze_image_generate_execute = (function knoxx$backend$domain$media$blaze$blaze_image_generate_execute(runtime,config,tool_call_id,params,a,b,c){
return knoxx.backend.domain.media.blaze.execute_for_modality("image","image.generate",runtime,config,tool_call_id,params,a,b,c);
});
knoxx.backend.domain.media.blaze.blaze_video_generate_execute = (function knoxx$backend$domain$media$blaze$blaze_video_generate_execute(runtime,config,tool_call_id,params,a,b,c){
return knoxx.backend.domain.media.blaze.execute_for_modality("video","video.generate",runtime,config,tool_call_id,params,a,b,c);
});
knoxx.backend.domain.media.blaze.blaze_generate_execute = (function knoxx$backend$domain$media$blaze$blaze_generate_execute(runtime,config,tool_call_id,params,a,b,c){
var on_update = (function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})();
var tool_name = (function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil((params["tool_name"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "blaze.generate";
}
})();
var prompt = (function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze.blank__GT_nil((params["prompt"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name)+": prompt required")));
}
})();
var modality = knoxx.backend.domain.media.blaze.normalize_modality((params["modality"]));
var requested_model = knoxx.backend.domain.media.blaze.blank__GT_nil((params["model"]));
var models = knoxx.backend.domain.media.blaze.candidate_models(modality,requested_model);
var output_path = knoxx.backend.domain.media.normalize_tool_path_arg((params["output_path"]));
var _api_key = (function (){var or__5162__auto__ = knoxx.backend.domain.media.blaze.proxx_api_key(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name)+": PROXX_AUTH_TOKEN/PROXY_AUTH_TOKEN not configured for Proxx-authenticated Blaze proxying")));
}
})();
var log_context = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),new cljs.core.Keyword(null,"tool","tool",-1298696470),new cljs.core.Keyword(null,"modality","modality",-2007555412),new cljs.core.Keyword(null,"candidate_models","candidate_models",-1687297073),new cljs.core.Keyword(null,"prompt_chars","prompt_chars",-474555565),new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.Keyword(null,"explicit_model","explicit_model",1474721626),new cljs.core.Keyword(null,"proxx_base_url","proxx_base_url",-1095634245),new cljs.core.Keyword(null,"endpoint","endpoint",447890044)],[knoxx.backend.domain.media.blaze.blank__GT_nil(tool_call_id),tool_name,modality,models,((prompt).length),output_path,cljs.core.boolean$(requested_model),knoxx.backend.domain.media.blaze.proxx_base_url(config),(function (){var G__28323 = modality;
switch (G__28323) {
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
})()]);
knoxx.backend.domain.media.blaze.log_info_BANG_("execute-start",log_context);

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Proxx Blaze "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(modality)+" generation via "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",models))+"\u2026"));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.attempt_generation_BANG_(config,params,modality,prompt,models,cljs.core.PersistentVector.EMPTY,log_context)),(function (result){
return promesa.protocols._mcat(promesa.protocols._promise(new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(result)),(function (model){
return promesa.protocols._mcat(promesa.protocols._promise(new cljs.core.Keyword(null,"payload","payload",-383036092).cljs$core$IFn$_invoke$arity$1(result)),(function (payload){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.response_text(payload)),(function (text){
return promesa.protocols._mcat(promesa.protocols._promise((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([payload], 0))))),(function (asset_text){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.maybe_save_asset_BANG_(runtime,config,modality,output_path,asset_text,payload)),(function (saved){
return promesa.protocols._mcat(promesa.protocols._promise((cljs.core.truth_(saved)?null:knoxx.backend.domain.media.blaze.write_response_json_BANG_(runtime,config,payload))),(function (response_artifact){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.media.blaze.log_info_BANG_("execute-complete",cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(log_context,new cljs.core.Keyword(null,"model","model",331153215),model,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"attempts","attempts",1024246729),new cljs.core.Keyword(null,"attempts","attempts",1024246729).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"saved_asset","saved_asset",1697334574),cljs.core.boolean$(saved),new cljs.core.Keyword(null,"asset_workspace_path","asset_workspace_path",798027564),new cljs.core.Keyword(null,"workspace-path","workspace-path",918930789).cljs$core$IFn$_invoke$arity$1(saved),new cljs.core.Keyword(null,"response_artifact_workspace_path","response_artifact_workspace_path",-442122082),new cljs.core.Keyword(null,"workspace-path","workspace-path",918930789).cljs$core$IFn$_invoke$arity$1(response_artifact)], 0)))),(function (_){
return promesa.protocols._promise(knoxx.backend.domain.text.tool_text_result((""+"Proxx Blaze "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(modality)+" response from "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model)+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(saved)?(""+". Saved asset: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"workspace-path","workspace-path",918930789).cljs$core$IFn$_invoke$arity$1(saved))+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"bytes","bytes",1175866680).cljs$core$IFn$_invoke$arity$1(saved))+" bytes). Use workspace_media.attach to embed it."):(""+". No media URL/data URL was found; saved JSON response: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"workspace-path","workspace-path",918930789).cljs$core$IFn$_invoke$arity$1(response_artifact))+".")))),(function (){var G__28333 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"provider","provider",-302056900),"blaze",new cljs.core.Keyword(null,"via","via",-1904457336),"proxx",new cljs.core.Keyword(null,"endpoint","endpoint",447890044),(function (){var G__28334 = modality;
switch (G__28334) {
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
})(),new cljs.core.Keyword(null,"modality","modality",-2007555412),modality,new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"attempts","attempts",1024246729),new cljs.core.Keyword(null,"attempts","attempts",1024246729).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"response_text","response_text",-322191075),text], null);
var G__28333__$1 = (cljs.core.truth_(saved)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28333,new cljs.core.Keyword(null,"asset","asset",-280274466),saved):G__28333);
if(cljs.core.truth_(response_artifact)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28333__$1,new cljs.core.Keyword(null,"response_artifact","response_artifact",-592667498),response_artifact);
} else {
return G__28333__$1;
}
})()));
}));
}));
}));
}));
}));
}));
}));
}));
}));
});
knoxx.backend.domain.media.blaze.blaze_generate_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"blaze.generate","Blaze Generate","Generate chat, image, video, music, or TTS assets through Proxx's authenticated BlazeAPI proxy routes.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use Proxx-backed BlazeAPI for multimodal generation when a Blaze model ID is requested or when the user wants external AI-generated image/video/music/TTS assets.",new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use model IDs exactly as shown on BlazeAPI's Models page.","This tool authenticates to Proxx with PROXX_AUTH_TOKEN; Knoxx does not need direct BLAZE_API_KEY access.","Use modality=image, video, music, or tts so Proxx can call the correct Blaze endpoint.","Do not substitute another modality: video failures must remain video failures after all video model candidates are exhausted.","After a successful asset save, call workspace_media.attach on the returned path to embed it in the response."], null),knoxx.backend.domain.media.blaze.blaze_generate_params,knoxx.backend.domain.media.blaze.blaze_generate_execute], 0));
knoxx.backend.domain.media.blaze.blaze_music_generate_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"music.generate_song","Generate Instrumental","Generate INSTRUMENTAL music through Proxx's authenticated BlazeAPI music endpoint. Current default model (musicgen-small) produces instrumentals only \u2014 NO VOCALS, NO LYRICS.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use this tool for AI-generated instrumental music, beats, soundscapes, and backing tracks. Do NOT use for vocal songs or lyrics. For vocal synthesis, use voice.openutau_project + voice.openutau_render. Do not use the generic blaze.generate tool for music.",new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["INSTRUMENTAL ONLY: Current models do not generate vocals. musicgen-small is a local instrumental diffusion model.","Describe arrangement, genre, BPM, key, mood, mix notes, and instruments in prompt.","Use output_path under Music/ with .wav extension. musicgen-small returns WAV format.","ALWAYS set duration to 30+ seconds. Default is 5 seconds which is not usable music.","After a successful asset save, call workspace_media.attach on the returned path to embed it in the response."], null),knoxx.backend.domain.media.blaze.blaze_music_generate_params,knoxx.backend.domain.media.blaze.blaze_music_generate_execute], 0));
knoxx.backend.domain.media.blaze.blaze_image_generate_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"image.generate","Generate Image","Generate an image asset through Proxx's authenticated BlazeAPI image endpoint.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use this dedicated Proxx/Blaze image tool when the user wants an AI-generated image. Do not route image requests through music or video tools.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Save generated images under Images/ or Graphics/ with a descriptive output_path when useful.","After a successful asset save, call workspace_media.attach on the returned path to embed it in the response."], null),knoxx.backend.domain.media.blaze.blaze_image_generate_params,knoxx.backend.domain.media.blaze.blaze_image_generate_execute], 0));
knoxx.backend.domain.media.blaze.blaze_video_generate_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"video.generate","Generate Video","Generate a video asset through Proxx's authenticated BlazeAPI video endpoint.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use this dedicated Proxx/Blaze video tool when the user wants an AI-generated video. Do not route video requests through music or image tools.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Save generated videos under Video/ with a descriptive output_path when useful.","After a successful asset save, call workspace_media.attach on the returned path to embed it in the response."], null),knoxx.backend.domain.media.blaze.blaze_video_generate_params,knoxx.backend.domain.media.blaze.blaze_video_generate_execute], 0));
/**
 * Create BlazeAPI-backed generation tools.
 */
knoxx.backend.domain.media.blaze.create_blaze_custom_tools = (function knoxx$backend$domain$media$blaze$create_blaze_custom_tools(var_args){
var G__28346 = arguments.length;
switch (G__28346) {
case 2:
return knoxx.backend.domain.media.blaze.create_blaze_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.media.blaze.create_blaze_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.media.blaze.create_blaze_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.media.blaze.create_blaze_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.media.blaze.create_blaze_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("music.generate_song"))?knoxx.backend.domain.media.blaze.blaze_music_generate_tool(runtime,config):null),((allowed_QMARK_("image.generate"))?knoxx.backend.domain.media.blaze.blaze_image_generate_tool(runtime,config):null),((allowed_QMARK_("video.generate"))?knoxx.backend.domain.media.blaze.blaze_video_generate_tool(runtime,config):null),((allowed_QMARK_("blaze.generate"))?knoxx.backend.domain.media.blaze.blaze_generate_tool(runtime,config):null)], null))));
}));

(knoxx.backend.domain.media.blaze.create_blaze_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.media.blaze.js.map
