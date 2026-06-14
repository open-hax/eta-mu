import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.text_delta.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.domain.text.js";
goog.provide('knoxx.backend.domain.agent.content');
/**
 * Return s when it is a non-blank string (after trim).
 */
knoxx.backend.domain.agent.content.nonblank = (function knoxx$backend$domain$agent$content$nonblank(s){
if(typeof s === 'string'){
var trimmed = clojure.string.trim(s);
if(clojure.string.blank_QMARK_(trimmed)){
return null;
} else {
return trimmed;
}
} else {
return null;
}
});
/**
 * Like value->preview-text, but returns nil for blank previews so OR chains keep searching.
 */
knoxx.backend.domain.agent.content.preview_text_nonblank = (function knoxx$backend$domain$agent$content$preview_text_nonblank(value,max_chars){
var preview = (function (){var G__21749 = knoxx.backend.domain.text.value__GT_preview_text.cljs$core$IFn$_invoke$arity$2(value,max_chars);
if((G__21749 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__21749);
}
})();
var lowered = (function (){var G__21755 = preview;
if((G__21755 == null)){
return null;
} else {
return clojure.string.lower_case(G__21755);
}
})();
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["null",null,"undefined",null], null), null),lowered)){
return null;
} else {
return preview;
}
});
knoxx.backend.domain.agent.content.fenced = (function knoxx$backend$domain$agent$content$fenced(lang,text){
return (""+"```"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(lang)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+"\n```");
});
knoxx.backend.domain.agent.content.json_preview_nonblank = (function knoxx$backend$domain$agent$content$json_preview_nonblank(value,max_chars){
if(cljs.core.truth_((function (){var and__5160__auto__ = value;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(value,undefined);
} else {
return and__5160__auto__;
}
})())){
try{var json = JSON.stringify(value,null,(2));
if(typeof json === 'string'){
return knoxx.backend.domain.agent.content.preview_text_nonblank(json,max_chars);
} else {
return null;
}
}catch (e21766){var _ = e21766;
return null;
}} else {
return null;
}
});
knoxx.backend.domain.agent.content.duplicate_normalized_text = (function knoxx$backend$domain$agent$content$duplicate_normalized_text(s){
return clojure.string.lower_case(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(s)),/[\s\W_]+/,""));
});
knoxx.backend.domain.agent.content.boundary_ended_QMARK_ = (function knoxx$backend$domain$agent$content$boundary_ended_QMARK_(s){
return cljs.core.boolean$(cljs.core.re_find(/[\s\W_]$/,s));
});
knoxx.backend.domain.agent.content.diff_appended_text = (function knoxx$backend$domain$agent$content$diff_appended_text(previous,current){
return (knoxx.backend.domain.agent.text_delta.diff_appended_text.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.text_delta.diff_appended_text.cljs$core$IFn$_invoke$arity$2(previous,current) : knoxx.backend.domain.agent.text_delta.diff_appended_text.call(null,previous,current));
});
knoxx.backend.domain.agent.content.media_part_url = (function knoxx$backend$domain$agent$content$media_part_url(part){
var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank((part["url"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank((part["file_url"]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.nonblank((part["fileUrl"]));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (function (){var image_url = (part["image_url"]);
if(typeof image_url === 'string'){
return knoxx.backend.domain.agent.content.nonblank(image_url);
} else {
if(cljs.core.truth_(image_url)){
return knoxx.backend.domain.agent.content.nonblank((image_url["url"]));
} else {
return null;

}
}
})();
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = (function (){var video_url = (part["video_url"]);
if(typeof video_url === 'string'){
return knoxx.backend.domain.agent.content.nonblank(video_url);
} else {
if(cljs.core.truth_(video_url)){
return knoxx.backend.domain.agent.content.nonblank((video_url["url"]));
} else {
return null;

}
}
})();
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = (function (){var audio_url = (part["audio_url"]);
if(typeof audio_url === 'string'){
return knoxx.backend.domain.agent.content.nonblank(audio_url);
} else {
if(cljs.core.truth_(audio_url)){
return knoxx.backend.domain.agent.content.nonblank((audio_url["url"]));
} else {
return null;

}
}
})();
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var source = (part["source"]);
if(cljs.core.truth_((function (){var and__5160__auto__ = source;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("url",(function (){var G__21774 = (source["type"]);
var G__21774__$1 = (((G__21774 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21774)));
if((G__21774__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__21774__$1);
}
})());
} else {
return and__5160__auto__;
}
})())){
return knoxx.backend.domain.agent.content.nonblank((source["url"]));
} else {
return null;
}
}
}
}
}
}
}
});
knoxx.backend.domain.agent.content.media_part_data = (function knoxx$backend$domain$agent$content$media_part_data(part){
var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank((part["data"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank((part["b64_json"]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.nonblank((part["result"]));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (function (){var input_audio = (part["input_audio"]);
if(cljs.core.truth_(input_audio)){
return knoxx.backend.domain.agent.content.nonblank((input_audio["data"]));
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = (function (){var output_audio = (part["output_audio"]);
if(cljs.core.truth_(output_audio)){
return knoxx.backend.domain.agent.content.nonblank((output_audio["data"]));
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var source = (part["source"]);
if(cljs.core.truth_((function (){var and__5160__auto__ = source;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("base64",(function (){var G__21781 = (source["type"]);
var G__21781__$1 = (((G__21781 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21781)));
if((G__21781__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__21781__$1);
}
})());
} else {
return and__5160__auto__;
}
})())){
return knoxx.backend.domain.agent.content.nonblank((source["data"]));
} else {
return null;
}
}
}
}
}
}
});
knoxx.backend.domain.agent.content.media_part_mime_type = (function knoxx$backend$domain$agent$content$media_part_mime_type(part,media_kind){
var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank((part["mimeType"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank((part["mime_type"]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.nonblank((part["mediaType"]));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.agent.content.nonblank((part["media_type"]));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = (function (){var source = (part["source"]);
if(cljs.core.truth_(source)){
var or__5162__auto____$4 = knoxx.backend.domain.agent.content.nonblank((source["media_type"]));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.domain.agent.content.nonblank((source["mime_type"]));
}
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = (function (){var input_audio = (part["input_audio"]);
var format = (cljs.core.truth_(input_audio)?knoxx.backend.domain.agent.content.nonblank((input_audio["format"])):null);
if(cljs.core.truth_(format)){
return (""+"audio/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(format));
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = (function (){var output_audio = (part["output_audio"]);
var format = (cljs.core.truth_(output_audio)?knoxx.backend.domain.agent.content.nonblank((output_audio["format"])):null);
if(cljs.core.truth_(format)){
return (""+"audio/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(format));
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var G__21804 = media_kind;
switch (G__21804) {
case "image":
return "image/png";

break;
case "audio":
return "audio/wav";

break;
case "video":
return "video/mp4";

break;
case "document":
return "application/octet-stream";

break;
default:
return null;

}
}
}
}
}
}
}
}
});
knoxx.backend.domain.agent.content.media_part_filename = (function knoxx$backend$domain$agent$content$media_part_filename(part){
var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank((part["filename"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank((part["file_name"]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.nonblank((part["fileName"]));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.agent.content.nonblank((part["name"]));
}
}
}
});
knoxx.backend.domain.agent.content.media_part_size = (function knoxx$backend$domain$agent$content$media_part_size(part){
var value = (function (){var or__5162__auto__ = (part["size"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (part["bytes"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (part["byte_size"]);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return (part["byteSize"]);
}
}
}
})();
if(typeof value === 'number'){
return value;
} else {
return null;
}
});
knoxx.backend.domain.agent.content.assistant_media_part = (function knoxx$backend$domain$agent$content$assistant_media_part(part){
var raw_type = (function (){var G__21822 = (part["type"]);
var G__21822__$1 = (((G__21822 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21822)));
if((G__21822__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__21822__$1);
}
})();
var media_kind = ((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["image",null,"input_image",null,"output_image",null,"image_url",null], null), null),raw_type))?"image":((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["input_audio",null,"output_audio",null,"audio_url",null,"audio",null], null), null),raw_type))?"audio":((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["output_video",null,"video_url",null,"video",null,"input_video",null], null), null),raw_type))?"video":((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["input_file",null,"document",null,"output_file",null,"file",null], null), null),raw_type))?"document":null
))));
var url = knoxx.backend.domain.agent.content.media_part_url(part);
var raw_data = knoxx.backend.domain.agent.content.media_part_data(part);
var mime_type = knoxx.backend.domain.agent.content.media_part_mime_type(part,media_kind);
var data = (cljs.core.truth_(raw_data)?((clojure.string.starts_with_QMARK_(raw_data,"data:"))?raw_data:(""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime_type)+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw_data))):null);
var filename = knoxx.backend.domain.agent.content.media_part_filename(part);
var size = knoxx.backend.domain.agent.content.media_part_size(part);
if(cljs.core.truth_((function (){var and__5160__auto__ = media_kind;
if(cljs.core.truth_(and__5160__auto__)){
var or__5162__auto__ = url;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return data;
}
} else {
return and__5160__auto__;
}
})())){
var G__21825 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),media_kind], null);
var G__21825__$1 = (cljs.core.truth_(url)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21825,new cljs.core.Keyword(null,"url","url",276297046),url):G__21825);
var G__21825__$2 = (cljs.core.truth_(data)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21825__$1,new cljs.core.Keyword(null,"data","data",-232669377),data):G__21825__$1);
var G__21825__$3 = (cljs.core.truth_(mime_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21825__$2,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type):G__21825__$2);
var G__21825__$4 = (cljs.core.truth_(filename)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21825__$3,new cljs.core.Keyword(null,"filename","filename",-1428840783),filename):G__21825__$3);
if(cljs.core.truth_(size)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21825__$4,new cljs.core.Keyword(null,"size","size",1098693007),size);
} else {
return G__21825__$4;
}
} else {
return null;
}
});
knoxx.backend.domain.agent.content.assistant_content_parts = (function knoxx$backend$domain$agent$content$assistant_content_parts(assistant_message){
var content = (cljs.core.truth_(assistant_message)?(assistant_message["content"]):null);
if(cljs.core.truth_(cljs.core.array_QMARK_(content))){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.agent.content.assistant_media_part,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(content)));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.domain.agent.content.session_message_text = (function knoxx$backend$domain$agent$content$session_message_text(message){
var content = (message["content"]);
if(typeof content === 'string'){
return content;
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(content))){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n\n",cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.text.content_part_text,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(content))));
} else {
if(typeof (message["text"]) === 'string'){
return (message["text"]);
} else {
return "";

}
}
}
});
knoxx.backend.domain.agent.content.content_part_label = (function knoxx$backend$domain$agent$content$content_part_label(part){
var part_type = (((new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part) instanceof cljs.core.Keyword))?cljs.core.name(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part)):((typeof new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part) === 'string')?new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part):null
));
var G__21839 = part_type;
switch (G__21839) {
case "image":
return "image";

break;
case "audio":
return "audio file";

break;
case "video":
return "video";

break;
case "document":
return "document";

break;
default:
return "attachment";

}
});
knoxx.backend.domain.agent.content.content_part_name = (function knoxx$backend$domain$agent$content$content_part_name(part){
var or__5162__auto__ = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.agent.content.content_part_label(part);
}
}
});
knoxx.backend.domain.agent.content.tool_result_media_type = (function knoxx$backend$domain$agent$content$tool_result_media_type(value){
var G__21840 = (function (){var G__21841 = value;
var G__21841__$1 = (((G__21841 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21841)));
if((G__21841__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__21841__$1);
}
})();
switch (G__21840) {
case "image":
case "image_url":
case "output_image":
return "image";

break;
case "audio":
case "audio_url":
case "output_audio":
return "audio";

break;
case "video":
case "video_url":
case "output_video":
return "video";

break;
case "document":
case "file":
case "output_file":
return "document";

break;
default:
return null;

}
});
knoxx.backend.domain.agent.content.tool_result_content_part = (function knoxx$backend$domain$agent$content$tool_result_content_part(part){
var media_type = knoxx.backend.domain.agent.content.tool_result_media_type((part["type"]));
var data = knoxx.backend.domain.agent.content.nonblank((part["data"]));
var url = knoxx.backend.domain.agent.content.nonblank((part["url"]));
var mime_type = (function (){var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank((part["mimeType"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank((part["mime_type"]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.nonblank((part["mediaType"]));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.domain.agent.content.nonblank((part["media_type"]));
}
}
}
})();
var filename = (function (){var or__5162__auto__ = knoxx.backend.domain.agent.content.nonblank((part["filename"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.nonblank((part["fileName"]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.agent.content.nonblank((part["name"]));
}
}
})();
var size = (function (){var value = (function (){var or__5162__auto__ = (part["size"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (part["bytes"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (part["byteSize"]);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return (part["byte_size"]);
}
}
}
})();
if(typeof value === 'number'){
return value;
} else {
return null;
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = media_type;
if(cljs.core.truth_(and__5160__auto__)){
var or__5162__auto__ = data;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return url;
}
} else {
return and__5160__auto__;
}
})())){
var G__21844 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),media_type], null);
var G__21844__$1 = (cljs.core.truth_(data)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21844,new cljs.core.Keyword(null,"data","data",-232669377),data):G__21844);
var G__21844__$2 = (cljs.core.truth_(url)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21844__$1,new cljs.core.Keyword(null,"url","url",276297046),url):G__21844__$1);
var G__21844__$3 = (cljs.core.truth_(mime_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21844__$2,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type):G__21844__$2);
var G__21844__$4 = (cljs.core.truth_(filename)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21844__$3,new cljs.core.Keyword(null,"filename","filename",-1428840783),filename):G__21844__$3);
if(cljs.core.truth_(size)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21844__$4,new cljs.core.Keyword(null,"size","size",1098693007),size);
} else {
return G__21844__$4;
}
} else {
return null;
}
});
knoxx.backend.domain.agent.content.tool_result_content_parts = (function knoxx$backend$domain$agent$content$tool_result_content_parts(tool_result){
var details = (cljs.core.truth_(tool_result)?(tool_result["details"]):null);
var raw_parts = (function (){var or__5162__auto__ = (cljs.core.truth_(tool_result)?(tool_result["content_parts"]):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (cljs.core.truth_(tool_result)?(tool_result["contentParts"]):null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (cljs.core.truth_(details)?(details["content_parts"]):null);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (cljs.core.truth_(details)?(details["contentParts"]):null);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
if(cljs.core.truth_(details)){
return (details["attachments"]);
} else {
return null;
}
}
}
}
}
})();
if(cljs.core.truth_(cljs.core.array_QMARK_(raw_parts))){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.agent.content.tool_result_content_part,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(raw_parts)));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.domain.agent.content.merge_content_parts = (function knoxx$backend$domain$agent$content$merge_content_parts(var_args){
var args__5903__auto__ = [];
var len__5897__auto___21938 = arguments.length;
var i__5898__auto___21939 = (0);
while(true){
if((i__5898__auto___21939 < len__5897__auto___21938)){
args__5903__auto__.push((arguments[i__5898__auto___21939]));

var G__21940 = (i__5898__auto___21939 + (1));
i__5898__auto___21939 = G__21940;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.agent.content.merge_content_parts.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.agent.content.merge_content_parts.cljs$core$IFn$_invoke$arity$variadic = (function (groups){
return cljs.core.vec(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,part){
if(cljs.core.truth_(cljs.core.some((function (p1__21847_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__21847_SHARP_,part);
}),acc))){
return acc;
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,part);
}
}),cljs.core.PersistentVector.EMPTY,cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__21846_SHARP_){
var or__5162__auto__ = p1__21846_SHARP_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([groups], 0))));
}));

(knoxx.backend.domain.agent.content.merge_content_parts.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.agent.content.merge_content_parts.cljs$lang$applyTo = (function (seq21849){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21849));
}));

knoxx.backend.domain.agent.content.reply_attachment_content_parts = (function knoxx$backend$domain$agent$content$reply_attachment_content_parts(tool_receipts){
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__21861_SHARP_){
var or__5162__auto__ = new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667).cljs$core$IFn$_invoke$arity$1(p1__21861_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"contentParts","contentParts",1395809695).cljs$core$IFn$_invoke$arity$1(p1__21861_SHARP_);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__21860_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("workspace_media.attach",new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(p1__21860_SHARP_));
}),(function (){var or__5162__auto__ = tool_receipts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], 0)));
});
knoxx.backend.domain.agent.content.model_ready_content_parts = (function knoxx$backend$domain$agent$content$model_ready_content_parts(config,model_id,content_parts){
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (part){
var part__$1 = ((cljs.core.map_QMARK_(part))?part:cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(part,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
var part_type = (((new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part__$1) instanceof cljs.core.Keyword))?cljs.core.name(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part__$1)):((typeof new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part__$1) === 'string')?new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part__$1):null
));
if((((part_type == null)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(part_type,"text")) || (knoxx.backend.domain.models.model_supports_input_QMARK_(config,model_id,part_type)))))){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [part__$1], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(part_type,"audio")){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"text","text",-1790561697),(""+"Uploaded audio source '"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.content.content_part_name(part__$1))+"' is available, but model "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)+" does not declare audio input. Use audio.spectrogram if you need an image-friendly audio view.")], null)], null);
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"text","text",-1790561697),(""+"Uploaded "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.content.content_part_label(part__$1))+" '"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.content.content_part_name(part__$1))+"' is available, but model "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)+" does not declare "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(part_type)+" input.")], null)], null);

}
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var or__5162__auto__ = content_parts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()], 0)));
});

//# sourceMappingURL=knoxx.backend.domain.agent.content.js.map
