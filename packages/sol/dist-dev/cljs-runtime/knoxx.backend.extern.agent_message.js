import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.extern.agent_message');
knoxx.backend.extern.agent_message.mime__GT_audio_format = (function knoxx$backend$extern$agent_message$mime__GT_audio_format(mime_type){
var mime = (function (){var G__25649 = mime_type;
var G__25649__$1 = (((G__25649 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25649)));
if((G__25649__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__25649__$1);
}
})();
var G__25650 = mime;
switch (G__25650) {
case "audio/mpeg":
return "mp3";

break;
case "audio/mp4":
return "mp4";

break;
case "audio/wav":
return "wav";

break;
case "audio/x-wav":
return "wav";

break;
case "audio/ogg":
return "ogg";

break;
case "audio/flac":
return "flac";

break;
case "audio/aac":
return "aac";

break;
default:
var G__25651 = mime;
var G__25651__$1 = (((G__25651 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__25651,/\//));
if((G__25651__$1 == null)){
return null;
} else {
return cljs.core.second(G__25651__$1);
}

}
});
knoxx.backend.extern.agent_message.data_url_raw = (function knoxx$backend$extern$agent_message$data_url_raw(data){
var comma = data.indexOf(",");
if((comma >= (0))){
return data.slice((comma + (1)));
} else {
return data;
}
});
knoxx.backend.extern.agent_message.data_url_mime = (function knoxx$backend$extern$agent_message$data_url_mime(data,fallback){
var or__5162__auto__ = cljs.core.second(cljs.core.re_find(/data:([^;,]+)/,data));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback;
}
});
knoxx.backend.extern.agent_message.audio_part = (function knoxx$backend$extern$agent_message$audio_part(data,mime_type){
return ({"type": "audio", "data": data, "mimeType": mime_type, "format": (function (){var or__5162__auto__ = knoxx.backend.extern.agent_message.mime__GT_audio_format(mime_type);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "mp3";
}
})()});
});
knoxx.backend.extern.agent_message.content_part__GT_agent_part = (function knoxx$backend$extern$agent_message$content_part__GT_agent_part(part){
var part_type = (function (){var G__25658 = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part);
var G__25658__$1 = (((G__25658 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25658)));
if((G__25658__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__25658__$1);
}
})();
var text = (function (){var G__25659 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(part);
if((G__25659 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25659));
}
})();
var url = (function (){var G__25661 = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part);
if((G__25661 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25661));
}
})();
var data = (function (){var G__25662 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part);
if((G__25662 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25662));
}
})();
var mime_type = (function (){var G__25663 = new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(part);
if((G__25663 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25663));
}
})();
var filename = (function (){var G__25664 = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(part);
if((G__25664 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25664));
}
})();
var G__25666 = part_type;
switch (G__25666) {
case "text":
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)))))){
return ({"type": "text", "text": text});
} else {
return null;
}

break;
case "image":
if(((typeof data === 'string') && ((((!(clojure.string.blank_QMARK_(data)))) && (clojure.string.starts_with_QMARK_(data,"data:")))))){
return ({"type": "image", "data": knoxx.backend.extern.agent_message.data_url_raw(data), "mimeType": knoxx.backend.extern.agent_message.data_url_mime(data,(function (){var or__5162__auto__ = mime_type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "image/png";
}
})())});
} else {
if(((typeof data === 'string') && ((!(clojure.string.blank_QMARK_(data)))))){
return ({"type": "image", "data": data, "mimeType": (function (){var or__5162__auto__ = mime_type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "image/png";
}
})()});
} else {
if(((typeof url === 'string') && ((!(clojure.string.blank_QMARK_(url)))))){
return ({"type": "image_url", "image_url": ({"url": url})});
} else {
return null;

}
}
}

break;
case "audio":
if(((typeof data === 'string') && ((((!(clojure.string.blank_QMARK_(data)))) && (clojure.string.starts_with_QMARK_(data,"data:")))))){
var mime = knoxx.backend.extern.agent_message.data_url_mime(data,(function (){var or__5162__auto__ = mime_type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "audio/mpeg";
}
})());
return knoxx.backend.extern.agent_message.audio_part(knoxx.backend.extern.agent_message.data_url_raw(data),mime);
} else {
if(((typeof data === 'string') && ((!(clojure.string.blank_QMARK_(data)))))){
return knoxx.backend.extern.agent_message.audio_part(data,mime_type);
} else {
if(((typeof url === 'string') && ((!(clojure.string.blank_QMARK_(url)))))){
return knoxx.backend.extern.agent_message.audio_part(url,mime_type);
} else {
return null;

}
}
}

break;
case "video":
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = data;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return url;
}
})())))))){
return ({"type": "video", "data": (function (){var or__5162__auto__ = data;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return url;
}
})(), "mimeType": mime_type});
} else {
return null;
}

break;
case "document":
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = data;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return url;
}
})())))))){
return ({"type": "document", "data": (function (){var or__5162__auto__ = data;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return url;
}
})(), "mimeType": mime_type, "filename": filename});
} else {
return null;
}

break;
default:
return null;

}
});
knoxx.backend.extern.agent_message.text_payload = (function knoxx$backend$extern$agent_message$text_payload(content){
return [({"type": "text", "text": content})];
});
knoxx.backend.extern.agent_message.default_usage = (function knoxx$backend$extern$agent_message$default_usage(){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"input","input",556931961),(0),new cljs.core.Keyword(null,"output","output",-1105869043),(0),new cljs.core.Keyword(null,"cacheRead","cacheRead",1934988063),(0),new cljs.core.Keyword(null,"cacheWrite","cacheWrite",-543722637),(0),new cljs.core.Keyword(null,"totalTokens","totalTokens",-1826569811),(0)], null);
});
knoxx.backend.extern.agent_message.stored_message__GT_agent_message = (function knoxx$backend$extern$agent_message$stored_message__GT_agent_message(message){
var role = (function (){var G__25673 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(message);
if((G__25673 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25673));
}
})();
var content = (function (){var G__25678 = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if((G__25678 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25678));
}
})();
var content_parts = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.agent_message.content_part__GT_agent_part,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content-parts","content-parts",684529019).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var payload = ((cljs.core.seq(content_parts))?cljs.core.clj__GT_js(content_parts):(((!(clojure.string.blank_QMARK_(content))))?knoxx.backend.extern.agent_message.text_payload(content):null
));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("compactionSummary",role)){
var temp__5825__auto__ = (function (){var G__25683 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"summary","summary",380847952).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
}
})();
var G__25683__$1 = (((G__25683 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25683)));
var G__25683__$2 = (((G__25683__$1 == null))?null:clojure.string.trim(G__25683__$1));
if((G__25683__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25683__$2);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var summary = temp__5825__auto__;
return ({"role": "compactionSummary", "summary": summary, "tokensBefore": (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tokensBefore","tokensBefore",1192561651).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tokens-before","tokens-before",1576569301).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (0);
}
}
})(), "timestamp": Date.now()});
} else {
return null;
}
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["user",null,"assistant",null,"system",null], null), null),role);
if(and__5160__auto__){
return payload;
} else {
return and__5160__auto__;
}
})())){
var agent_message = ({"role": role, "content": payload, "timestamp": Date.now()});
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("assistant",role)){
(agent_message["usage"] = cljs.core.clj__GT_js((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"usage","usage",-1583752910).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.agent_message.default_usage();
}
})()));
} else {
}

return agent_message;
} else {
return null;
}
}
});

//# sourceMappingURL=knoxx.backend.extern.agent_message.js.map
