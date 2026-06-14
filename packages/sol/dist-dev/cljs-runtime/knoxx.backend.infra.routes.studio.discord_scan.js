import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.discord.rest_client.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.tools.js";
import "./knoxx.backend.infra.http.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.routes.studio.discord_scan');
knoxx.backend.infra.routes.studio.discord_scan.discord_scan_audio_extensions = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 12, [".flac",null,".mp4",null,".aiff",null,".webm",null,".mp3",null,".ogg",null,".m4a",null,".wma",null,".aif",null,".wav",null,".aac",null,".opus",null], null), null);
knoxx.backend.infra.routes.studio.discord_scan.discord_scan_image_extensions = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 9, [".bmp",null,".svg",null,".webp",null,".png",null,".tiff",null,".tif",null,".jpg",null,".gif",null,".jpeg",null], null), null);
knoxx.backend.infra.routes.studio.discord_scan.discord_bot_token = (function knoxx$backend$infra$routes$studio$discord_scan$discord_bot_token(config){
var G__29628 = knoxx.backend.domain.tools.live_config(config);
var G__29628__$1 = (((G__29628 == null))?null:new cljs.core.Keyword(null,"discord-bot-token","discord-bot-token",1224757550).cljs$core$IFn$_invoke$arity$1(G__29628));
var G__29628__$2 = (((G__29628__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29628__$1)));
var G__29628__$3 = (((G__29628__$2 == null))?null:clojure.string.trim(G__29628__$2));
if((G__29628__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__29628__$3);
}
});
knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment = (function knoxx$backend$infra$routes$studio$discord_scan$safe_path_segment(value){
var cleaned = (function (){var G__29634 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var G__29634__$1 = (((G__29634 == null))?null:clojure.string.trim(G__29634));
var G__29634__$2 = (((G__29634__$1 == null))?null:clojure.string.replace(G__29634__$1,/[^A-Za-z0-9._-]+/,"_"));
var G__29634__$3 = (((G__29634__$2 == null))?null:clojure.string.replace(G__29634__$2,/_+/,"_"));
var G__29634__$4 = (((G__29634__$3 == null))?null:clojure.string.replace(G__29634__$3,/^_+|_+$/,""));
if((G__29634__$4 == null)){
return null;
} else {
return cljs.core.not_empty(G__29634__$4);
}
})();
var or__5162__auto__ = cleaned;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
});
knoxx.backend.infra.routes.studio.discord_scan.timestamp_token = (function knoxx$backend$infra$routes$studio$discord_scan$timestamp_token(value){
var cleaned = (function (){var G__29639 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var G__29639__$1 = (((G__29639 == null))?null:clojure.string.replace(G__29639,/[^0-9T]+/,""));
if((G__29639__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__29639__$1);
}
})();
var or__5162__auto__ = cleaned;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown-time";
}
});
knoxx.backend.infra.routes.studio.discord_scan.timestamp_ms = (function knoxx$backend$infra$routes$studio$discord_scan$timestamp_ms(value){
var ms = Date.parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(cljs.core.truth_(isNaN(ms))){
return null;
} else {
return ms;
}
});
knoxx.backend.infra.routes.studio.discord_scan.recent_enough_QMARK_ = (function knoxx$backend$infra$routes$studio$discord_scan$recent_enough_QMARK_(cutoff_ms,message){
var temp__5823__auto__ = knoxx.backend.infra.routes.studio.discord_scan.timestamp_ms(new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message));
if(cljs.core.truth_(temp__5823__auto__)){
var ms = temp__5823__auto__;
return (ms >= cutoff_ms);
} else {
return true;
}
});
knoxx.backend.infra.routes.studio.discord_scan.discord_audio_attachment_QMARK_ = (function knoxx$backend$infra$routes$studio$discord_scan$discord_audio_attachment_QMARK_(attachment){
var filename = (function (){var G__29650 = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment);
var G__29650__$1 = (((G__29650 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29650)));
if((G__29650__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29650__$1);
}
})();
var ext = (cljs.core.truth_(filename)?(function (){var G__29651 = cljs.core.re_find(/\.[^.]+$/,filename);
if((G__29651 == null)){
return null;
} else {
return clojure.string.lower_case(G__29651);
}
})():null);
var content_type = (function (){var G__29652 = new cljs.core.Keyword(null,"contentType","contentType",-1462509576).cljs$core$IFn$_invoke$arity$1(attachment);
var G__29652__$1 = (((G__29652 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29652)));
if((G__29652__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29652__$1);
}
})();
var or__5162__auto__ = (function (){var G__29653 = content_type;
if((G__29653 == null)){
return null;
} else {
return clojure.string.starts_with_QMARK_(G__29653,"audio/");
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.contains_QMARK_(knoxx.backend.infra.routes.studio.discord_scan.discord_scan_audio_extensions,ext);
if(or__5162__auto____$1){
return or__5162__auto____$1;
} else {
var and__5160__auto__ = (function (){var G__29655 = content_type;
if((G__29655 == null)){
return null;
} else {
return clojure.string.starts_with_QMARK_(G__29655,"video/");
}
})();
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [".mp4",null,".webm",null], null), null),ext);
} else {
return and__5160__auto__;
}
}
}
});
knoxx.backend.infra.routes.studio.discord_scan.discord_image_attachment_QMARK_ = (function knoxx$backend$infra$routes$studio$discord_scan$discord_image_attachment_QMARK_(attachment){
var filename = (function (){var G__29659 = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment);
var G__29659__$1 = (((G__29659 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29659)));
if((G__29659__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29659__$1);
}
})();
var ext = (cljs.core.truth_(filename)?(function (){var G__29660 = cljs.core.re_find(/\.[^.]+$/,filename);
if((G__29660 == null)){
return null;
} else {
return clojure.string.lower_case(G__29660);
}
})():null);
var content_type = (function (){var G__29661 = new cljs.core.Keyword(null,"contentType","contentType",-1462509576).cljs$core$IFn$_invoke$arity$1(attachment);
var G__29661__$1 = (((G__29661 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29661)));
if((G__29661__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29661__$1);
}
})();
var or__5162__auto__ = (function (){var G__29663 = content_type;
if((G__29663 == null)){
return null;
} else {
return clojure.string.starts_with_QMARK_(G__29663,"image/");
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.contains_QMARK_(knoxx.backend.infra.routes.studio.discord_scan.discord_scan_image_extensions,ext);
}
});
knoxx.backend.infra.routes.studio.discord_scan.discord_list_guilds_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$discord_list_guilds_BANG_(client){
var payload = (await knoxx.backend.domain.discord.rest_client.current_user_guilds_BANG_(client));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (guild){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(guild);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(guild);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown-guild";
}
})()], null);
}),(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
});
knoxx.backend.infra.routes.studio.discord_scan.discord_list_channels_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$discord_list_channels_BANG_(client,guild){
var payload = (await knoxx.backend.domain.discord.rest_client.guild_channels_BANG_(client,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(guild)));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (channel){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(channel);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown-channel";
}
})(),new cljs.core.Keyword(null,"guildId","guildId",-559818490),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(guild),new cljs.core.Keyword(null,"guildName","guildName",119399715),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(guild)], null);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (channel){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [(0),null,(12),null,(11),null,(5),null], null), null),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(channel));
}),(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
knoxx.backend.infra.routes.studio.discord_scan.discord_fetch_channel_messages_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$discord_fetch_channel_messages_BANG_(client,channel_id,before,limit){
var payload = (await knoxx.backend.domain.discord.rest_client.channel_messages_BANG_(client,channel_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(await (async function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (100);
}
})()))),new cljs.core.Keyword(null,"before","before",-1633692388),before], null)));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (message){
var author = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"id","id",-1388402092),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"channelId","channelId",2082229448),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channel_id","channel_id",1180018383).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return channel_id;
}
})(),new cljs.core.Keyword(null,"content","content",15833224),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"authorId","authorId",-1664154012),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"username","username",1605666410).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})(),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"attachments","attachments",-1535547830),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (attachment){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"filename","filename",-1428840783),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "attachment.bin";
}
})(),new cljs.core.Keyword(null,"contentType","contentType",-1462509576),new cljs.core.Keyword(null,"content_type","content_type",52159344).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"size","size",1098693007),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"url","url",276297046),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()], null);
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null);
}),(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
});
knoxx.backend.infra.routes.studio.discord_scan.promise_reduce = (async function knoxx$backend$infra$routes$studio$discord_scan$promise_reduce(items,init,step_fn){
var state = init;
var remaining = cljs.core.seq(items);
while(true){
var temp__5823__auto__ = cljs.core.first(remaining);
if(cljs.core.truth_(temp__5823__auto__)){
var item = temp__5823__auto__;
var next_state = (await (step_fn.cljs$core$IFn$_invoke$arity$2 ? step_fn.cljs$core$IFn$_invoke$arity$2(state,item) : step_fn.call(null,state,item)));
var G__30099 = next_state;
var G__30100 = cljs.core.rest(remaining);
state = G__30099;
remaining = G__30100;
continue;
} else {
return state;
}
break;
}
});
knoxx.backend.infra.routes.studio.discord_scan.list_channels_into_acc_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$list_channels_into_acc_BANG_(client,acc,guild){
var channels = (await knoxx.backend.infra.routes.studio.discord_scan.discord_list_channels_BANG_(client,guild));
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(acc,channels);
});
knoxx.backend.infra.routes.studio.discord_scan.collect_discord_scan_channels_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$collect_discord_scan_channels_BANG_(client,channel_ids,max_channels){
if(cljs.core.seq(channel_ids)){
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (channel_id){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)),new cljs.core.Keyword(null,"name","name",1843675177),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)),new cljs.core.Keyword(null,"guildId","guildId",-559818490),null,new cljs.core.Keyword(null,"guildName","guildName",119399715),"manual"], null);
}),channel_ids));
} else {
var guilds = (await knoxx.backend.infra.routes.studio.discord_scan.discord_list_guilds_BANG_(client));
var channels = (await knoxx.backend.infra.routes.studio.discord_scan.promise_reduce(guilds,cljs.core.PersistentVector.EMPTY,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.studio.discord_scan.list_channels_into_acc_BANG_,client)));
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(max_channels,channels));
}
});
knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_step_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$scan_channel_audio_step_BANG_(client,channel,cutoff_ms,pages_per_channel,limit_per_page,before,page,messages_scanned,attachments){
if((page >= pages_per_channel)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068),messages_scanned,new cljs.core.Keyword(null,"attachments","attachments",-1535547830),attachments], null);
} else {
var messages = (await knoxx.backend.infra.routes.studio.discord_scan.discord_fetch_channel_messages_BANG_(client,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel),before,limit_per_page));
var message_vec = cljs.core.vec(messages);
var matching = cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (message){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (attachment){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(attachment,new cljs.core.Keyword(null,"guildId","guildId",-559818490),new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"guildName","guildName",119399715),new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"channelId","channelId",2082229448),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"channelName","channelName",327631603),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"messageId","messageId",-260575736),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"messageUrl","messageUrl",-1125656742),(cljs.core.truth_(new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel))?(""+"https://discord.com/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message))):null),new cljs.core.Keyword(null,"authorId","authorId",-1664154012),new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message)], 0));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.studio.discord_scan.discord_audio_attachment_QMARK_,new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(message)));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29688_SHARP_){
return knoxx.backend.infra.routes.studio.discord_scan.recent_enough_QMARK_(cutoff_ms,p1__29688_SHARP_);
}),message_vec)], 0)));
var next_attachments = cljs.core.into.cljs$core$IFn$_invoke$arity$2(attachments,matching);
var total_scanned = (messages_scanned + cljs.core.count(message_vec));
var oldest_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs.core.last(message_vec));
var stop_QMARK_ = ((cljs.core.empty_QMARK_(message_vec)) || ((((cljs.core.count(message_vec) < limit_per_page)) || (cljs.core.every_QMARK_((function (p1__29689_SHARP_){
return (!(knoxx.backend.infra.routes.studio.discord_scan.recent_enough_QMARK_(cutoff_ms,p1__29689_SHARP_)));
}),message_vec)))));
if(((stop_QMARK_) || (clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(oldest_id)))))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068),total_scanned,new cljs.core.Keyword(null,"attachments","attachments",-1535547830),next_attachments], null);
} else {
return (await (await (async function (){var G__29702 = client;
var G__29703 = channel;
var G__29704 = cutoff_ms;
var G__29705 = pages_per_channel;
var G__29706 = limit_per_page;
var G__29707 = oldest_id;
var G__29708 = (page + (1));
var G__29709 = total_scanned;
var G__29710 = next_attachments;
return (knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_step_BANG_.cljs$core$IFn$_invoke$arity$9 ? knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_step_BANG_.cljs$core$IFn$_invoke$arity$9(G__29702,G__29703,G__29704,G__29705,G__29706,G__29707,G__29708,G__29709,G__29710) : knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_step_BANG_.call(null,G__29702,G__29703,G__29704,G__29705,G__29706,G__29707,G__29708,G__29709,G__29710));
})()));
}
}
});
knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$scan_channel_audio_BANG_(client,channel,p__29716){
var map__29717 = p__29716;
var map__29717__$1 = cljs.core.__destructure_map(map__29717);
var cutoff_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29717__$1,new cljs.core.Keyword(null,"cutoff-ms","cutoff-ms",634249946));
var pages_per_channel = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29717__$1,new cljs.core.Keyword(null,"pages-per-channel","pages-per-channel",1637798552));
var limit_per_page = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29717__$1,new cljs.core.Keyword(null,"limit-per-page","limit-per-page",-1452552787));
return (await knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_step_BANG_(client,channel,cutoff_ms,pages_per_channel,limit_per_page,null,(0),(0),cljs.core.PersistentVector.EMPTY));
});
knoxx.backend.infra.routes.studio.discord_scan.scan_channel_images_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$scan_channel_images_BANG_(client,channel,p__29736){
var map__29739 = p__29736;
var map__29739__$1 = cljs.core.__destructure_map(map__29739);
var cutoff_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29739__$1,new cljs.core.Keyword(null,"cutoff-ms","cutoff-ms",634249946));
var limit_per_page = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29739__$1,new cljs.core.Keyword(null,"limit-per-page","limit-per-page",-1452552787));
var messages = (await knoxx.backend.infra.routes.studio.discord_scan.discord_fetch_channel_messages_BANG_(client,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel),null,limit_per_page));
var message_vec = cljs.core.vec(messages);
var matching = cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (message){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (attachment){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(attachment,new cljs.core.Keyword(null,"guildId","guildId",-559818490),new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"guildName","guildName",119399715),new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"channelId","channelId",2082229448),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"channelName","channelName",327631603),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"messageId","messageId",-260575736),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"messageUrl","messageUrl",-1125656742),(cljs.core.truth_(new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel))?(""+"https://discord.com/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message))):null),new cljs.core.Keyword(null,"authorId","authorId",-1664154012),new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message)], 0));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.studio.discord_scan.discord_image_attachment_QMARK_,new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(message)));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29727_SHARP_){
return knoxx.backend.infra.routes.studio.discord_scan.recent_enough_QMARK_(cutoff_ms,p1__29727_SHARP_);
}),message_vec)], 0)));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068),cljs.core.count(message_vec),new cljs.core.Keyword(null,"attachments","attachments",-1535547830),matching], null);
});
knoxx.backend.infra.routes.studio.discord_scan.fs_path_exists_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$fs_path_exists_BANG_(node_fs,path){
try{(await node_fs.stat(path));

return true;
}catch (e29756){var _ = e29756;
return false;
}});
knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result = (function knoxx$backend$infra$routes$studio$discord_scan$discord_audio_import_result(var_args){
var G__29777 = arguments.length;
switch (G__29777) {
case 4:
return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$4 = (function (status,file_relative,meta_relative,attachment){
return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$5(status,file_relative,meta_relative,attachment,null);
}));

(knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$5 = (function (status,file_relative,meta_relative,attachment,error){
var G__29807 = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"path","path",-188191168),file_relative,new cljs.core.Keyword(null,"metadata_path","metadata_path",-1336761797),meta_relative,new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"source_url","source_url",-357411357),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment)], null);
if(cljs.core.truth_(error)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29807,new cljs.core.Keyword(null,"error","error",-978969032),error);
} else {
return G__29807;
}
}));

(knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$lang$maxFixedArity = 5);

knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_metadata = (function knoxx$backend$infra$routes$studio$discord_scan$discord_audio_import_metadata(attachment,loaded,file_relative){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.Keyword(null,"source_url","source_url",-357411357),new cljs.core.Keyword(null,"author_id","author_id",1568127108),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"message_url","message_url",-924222674),new cljs.core.Keyword(null,"size","size",1098693007),new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"content_type","content_type",52159344),new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.Keyword(null,"attachment_id","attachment_id",586931570),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"channel_name","channel_name",-2066447531),new cljs.core.Keyword(null,"guild_name","guild_name",1509069398),new cljs.core.Keyword(null,"saved_path","saved_path",-1004894409),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),new cljs.core.Keyword(null,"imported_at","imported_at",558511420),new cljs.core.Keyword(null,"author_username","author_username",-1558121698)],[new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"messageUrl","messageUrl",-1125656742).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(loaded),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(attachment),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contentType","contentType",-1462509576).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(loaded);
}
})(),new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(attachment),"discord-audio-import",new cljs.core.Keyword(null,"channelName","channelName",327631603).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(attachment),file_relative,new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(attachment),(new Date()).toISOString(),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(attachment)]);
});
knoxx.backend.infra.routes.studio.discord_scan.discord_image_import_metadata = (function knoxx$backend$infra$routes$studio$discord_scan$discord_image_import_metadata(attachment,loaded,file_relative){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.Keyword(null,"source_url","source_url",-357411357),new cljs.core.Keyword(null,"author_id","author_id",1568127108),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"message_url","message_url",-924222674),new cljs.core.Keyword(null,"size","size",1098693007),new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"content_type","content_type",52159344),new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.Keyword(null,"attachment_id","attachment_id",586931570),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"channel_name","channel_name",-2066447531),new cljs.core.Keyword(null,"guild_name","guild_name",1509069398),new cljs.core.Keyword(null,"saved_path","saved_path",-1004894409),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),new cljs.core.Keyword(null,"imported_at","imported_at",558511420),new cljs.core.Keyword(null,"author_username","author_username",-1558121698)],[new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"messageUrl","messageUrl",-1125656742).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(loaded),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(attachment),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contentType","contentType",-1462509576).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(loaded);
}
})(),new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(attachment),"discord-image-import",new cljs.core.Keyword(null,"channelName","channelName",327631603).cljs$core$IFn$_invoke$arity$1(attachment),new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(attachment),file_relative,new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(attachment),(new Date()).toISOString(),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(attachment)]);
});
knoxx.backend.infra.routes.studio.discord_scan.import_audio_attachment_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$import_audio_attachment_BANG_(runtime,config,import_root,attachment){
var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var day = (await (async function (){var ts = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if((((ts).length) >= (10))){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$3(ts,(0),(10));
} else {
return "unknown-date";
}
})());
var guild_segment = knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "discord";
}
}
})()));
var channel_segment = knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channelName","channelName",327631603).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "channel";
}
}
})()));
var filename = knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment(new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment));
var file_token = knoxx.backend.infra.routes.studio.discord_scan.timestamp_token(new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(attachment));
var target_name = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_token)+"__"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment(new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(attachment)))+"__"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(attachment)))+"__"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename));
var dir_absolute = shadow.esm.esm_import$node_path.join(workspace_root,import_root,guild_segment,channel_segment,day);
var file_absolute = shadow.esm.esm_import$node_path.join(dir_absolute,target_name);
var file_relative = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(import_root)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_segment)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_segment)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(day)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_name));
var meta_absolute = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_absolute)+".json");
var meta_relative = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_relative)+".json");
var exists_QMARK_ = (await knoxx.backend.infra.routes.studio.discord_scan.fs_path_exists_BANG_(shadow.esm.esm_import$node_fs$promises,file_absolute));
if(cljs.core.truth_(exists_QMARK_)){
return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$4("skipped",file_relative,meta_relative,attachment);
} else {
var loaded = (await knoxx.backend.domain.media.load_media_source_BANG_(runtime,knoxx.backend.domain.tools.live_config(config),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment),knoxx.backend.domain.media.audio_render_max_bytes));
var metadata = knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_metadata(attachment,loaded,file_relative);
(await knoxx.backend.domain.media.fs_mkdir_BANG_(shadow.esm.esm_import$node_fs$promises,dir_absolute,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));

(await knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3(shadow.esm.esm_import$node_fs$promises,file_absolute,new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(loaded)));

(await knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4(shadow.esm.esm_import$node_fs$promises,meta_absolute,JSON.stringify(cljs.core.clj__GT_js(metadata),null,(2)),"utf8"));

return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$4("imported",file_relative,meta_relative,attachment);
}
});
knoxx.backend.infra.routes.studio.discord_scan.import_image_attachment_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$import_image_attachment_BANG_(runtime,config,import_root,attachment){
var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var day = (await (async function (){var ts = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if((((ts).length) >= (10))){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$3(ts,(0),(10));
} else {
return "unknown-date";
}
})());
var guild_segment = knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "discord";
}
}
})()));
var channel_segment = knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channelName","channelName",327631603).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "channel";
}
}
})()));
var filename = knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment(new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment));
var file_token = knoxx.backend.infra.routes.studio.discord_scan.timestamp_token(new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(attachment));
var target_name = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_token)+"__"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment(new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(attachment)))+"__"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.studio.discord_scan.safe_path_segment(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(attachment)))+"__"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename));
var dir_absolute = shadow.esm.esm_import$node_path.join(workspace_root,import_root,guild_segment,channel_segment,day);
var file_absolute = shadow.esm.esm_import$node_path.join(dir_absolute,target_name);
var file_relative = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(import_root)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_segment)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_segment)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(day)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_name));
var meta_absolute = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_absolute)+".json");
var meta_relative = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_relative)+".json");
var exists_QMARK_ = (await knoxx.backend.infra.routes.studio.discord_scan.fs_path_exists_BANG_(shadow.esm.esm_import$node_fs$promises,file_absolute));
if(cljs.core.truth_(exists_QMARK_)){
return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$4("skipped",file_relative,meta_relative,attachment);
} else {
var loaded = (await knoxx.backend.domain.media.load_media_source_BANG_(runtime,knoxx.backend.domain.tools.live_config(config),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment),knoxx.backend.domain.media.multimodal_upload_max_bytes));
var metadata = knoxx.backend.infra.routes.studio.discord_scan.discord_image_import_metadata(attachment,loaded,file_relative);
(await knoxx.backend.domain.media.fs_mkdir_BANG_(shadow.esm.esm_import$node_fs$promises,dir_absolute,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));

(await knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3(shadow.esm.esm_import$node_fs$promises,file_absolute,new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(loaded)));

(await knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4(shadow.esm.esm_import$node_fs$promises,meta_absolute,JSON.stringify(cljs.core.clj__GT_js(metadata),null,(2)),"utf8"));

return knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$4("imported",file_relative,meta_relative,attachment);
}
});
knoxx.backend.infra.routes.studio.discord_scan.write_scan_manifest_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$write_scan_manifest_BANG_(_runtime,config,import_root,manifest){
var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var stamp = knoxx.backend.infra.routes.studio.discord_scan.timestamp_token(new cljs.core.Keyword(null,"scanned_at","scanned_at",1147989499).cljs$core$IFn$_invoke$arity$1(manifest));
var dir_absolute = shadow.esm.esm_import$node_path.join(workspace_root,import_root,"_scan_logs");
var file_name = (""+"scan-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(stamp)+".json");
var file_absolute = shadow.esm.esm_import$node_path.join(dir_absolute,file_name);
var file_relative = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(import_root)+"/_scan_logs/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file_name));
(await knoxx.backend.domain.media.fs_mkdir_BANG_(shadow.esm.esm_import$node_fs$promises,dir_absolute,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));

(await knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4(shadow.esm.esm_import$node_fs$promises,file_absolute,JSON.stringify(cljs.core.clj__GT_js(manifest),null,(2)),"utf8"));

return file_relative;
});
knoxx.backend.infra.routes.studio.discord_scan.bounded_body_int = (function knoxx$backend$infra$routes$studio$discord_scan$bounded_body_int(body,key_name,default$,min_value,max_value){
var value = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body[key_name]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default$;
}
})())),(10));
if(cljs.core.truth_(isNaN(value))){
return default$;
} else {
return cljs.core.max.cljs$core$IFn$_invoke$arity$2(min_value,cljs.core.min.cljs$core$IFn$_invoke$arity$2(value,max_value));
}
});
knoxx.backend.infra.routes.studio.discord_scan.scan_request_options = (function knoxx$backend$infra$routes$studio$discord_scan$scan_request_options(body,default_import_root){
var channel_ids = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["channel_ids"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})()))));
var since_hours = knoxx.backend.infra.routes.studio.discord_scan.bounded_body_int(body,"since_hours",(336),(1),(8760));
var pages_per_channel = knoxx.backend.infra.routes.studio.discord_scan.bounded_body_int(body,"pages_per_channel",(2),(1),(20));
var limit_per_page = knoxx.backend.infra.routes.studio.discord_scan.bounded_body_int(body,"limit_per_page",(100),(1),(100));
var max_channels = knoxx.backend.infra.routes.studio.discord_scan.bounded_body_int(body,"max_channels",(50),(1),(500));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"channel-ids","channel-ids",780502738),channel_ids,new cljs.core.Keyword(null,"max-channels","max-channels",1456729856),max_channels,new cljs.core.Keyword(null,"import-root","import-root",1996845422),(function (){var or__5162__auto__ = knoxx.backend.domain.media.normalize_tool_path_arg((body["import_root"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default_import_root;
}
})(),new cljs.core.Keyword(null,"scan-options","scan-options",-1735848242),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"cutoff-ms","cutoff-ms",634249946),(Date.now() - (((since_hours * (60)) * (60)) * (1000))),new cljs.core.Keyword(null,"pages-per-channel","pages-per-channel",1637798552),pages_per_channel,new cljs.core.Keyword(null,"limit-per-page","limit-per-page",-1452552787),limit_per_page], null)], null);
});
knoxx.backend.infra.routes.studio.discord_scan.scan_channel_into_state_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$scan_channel_into_state_BANG_(client,scan_channel_BANG_,scan_options,state,channel){
var result = (await (scan_channel_BANG_.cljs$core$IFn$_invoke$arity$3 ? scan_channel_BANG_.cljs$core$IFn$_invoke$arity$3(client,channel,scan_options) : scan_channel_BANG_.call(null,client,channel,scan_options)));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068),(new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068).cljs$core$IFn$_invoke$arity$1(state) + new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068).cljs$core$IFn$_invoke$arity$1(result)),new cljs.core.Keyword(null,"attachments","attachments",-1535547830),cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(result))], null);
});
knoxx.backend.infra.routes.studio.discord_scan.collect_attachments_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$collect_attachments_BANG_(client,channels,scan_channel_BANG_,scan_options){
return (await knoxx.backend.infra.routes.studio.discord_scan.promise_reduce(channels,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068),(0),new cljs.core.Keyword(null,"attachments","attachments",-1535547830),cljs.core.PersistentVector.EMPTY], null),cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.routes.studio.discord_scan.scan_channel_into_state_BANG_,client,scan_channel_BANG_,scan_options)));
});
knoxx.backend.infra.routes.studio.discord_scan.import_attachment_into_results_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$import_attachment_into_results_BANG_(runtime,config,import_root,import_attachment_BANG_,results,attachment){
try{var result = (await (import_attachment_BANG_.cljs$core$IFn$_invoke$arity$4 ? import_attachment_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,import_root,attachment) : import_attachment_BANG_.call(null,runtime,config,import_root,attachment)));
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(results,result);
}catch (e29953){var error = e29953;
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(results,knoxx.backend.infra.routes.studio.discord_scan.discord_audio_import_result.cljs$core$IFn$_invoke$arity$5("failed","","",attachment,(await (async function (){var or__5162__auto__ = error.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(error));
}
})())));
}});
knoxx.backend.infra.routes.studio.discord_scan.import_attachment_results_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$import_attachment_results_BANG_(runtime,config,import_root,attachments,import_attachment_BANG_){
return (await knoxx.backend.infra.routes.studio.discord_scan.promise_reduce(attachments,cljs.core.PersistentVector.EMPTY,cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.studio.discord_scan.import_attachment_into_results_BANG_,runtime,config,import_root,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([import_attachment_BANG_], 0))));
});
knoxx.backend.infra.routes.studio.discord_scan.scan_summary = (function knoxx$backend$infra$routes$studio$discord_scan$scan_summary(import_root,channels,messages_scanned,attachments,results){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"skipped_count","skipped_count",617412737),new cljs.core.Keyword(null,"failed_count","failed_count",-2009747228),new cljs.core.Keyword(null,"channels","channels",1132759174),new cljs.core.Keyword(null,"imported_count","imported_count",484068756),new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"import_root","import_root",-1753448747),new cljs.core.Keyword(null,"messages_scanned","messages_scanned",-243158219),new cljs.core.Keyword(null,"attachments_found","attachments_found",1061501240),new cljs.core.Keyword(null,"channels_scanned","channels_scanned",152781658),new cljs.core.Keyword(null,"scanned_at","scanned_at",1147989499),new cljs.core.Keyword(null,"results","results",-1134170113)],[cljs.core.count(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29967_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("skipped",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__29967_SHARP_));
}),results)),cljs.core.count(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29968_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("failed",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__29968_SHARP_));
}),results)),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (channel){
return cljs.core.select_keys(channel,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"guildId","guildId",-559818490),new cljs.core.Keyword(null,"guildName","guildName",119399715)], null));
}),cljs.core.take.cljs$core$IFn$_invoke$arity$2((50),channels)),cljs.core.count(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29966_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("imported",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__29966_SHARP_));
}),results)),true,import_root,messages_scanned,cljs.core.count(attachments),cljs.core.count(channels),(new Date()).toISOString(),cljs.core.vec(results)]);
});
knoxx.backend.infra.routes.studio.discord_scan.run_discord_media_scan_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$run_discord_media_scan_BANG_(runtime,config,p__29991,scan_channel_BANG_,import_attachment_BANG_){
var map__29992 = p__29991;
var map__29992__$1 = cljs.core.__destructure_map(map__29992);
var client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29992__$1,new cljs.core.Keyword(null,"client","client",-1323448117));
var channel_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29992__$1,new cljs.core.Keyword(null,"channel-ids","channel-ids",780502738));
var max_channels = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29992__$1,new cljs.core.Keyword(null,"max-channels","max-channels",1456729856));
var import_root = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29992__$1,new cljs.core.Keyword(null,"import-root","import-root",1996845422));
var scan_options = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29992__$1,new cljs.core.Keyword(null,"scan-options","scan-options",-1735848242));
var channels = (await knoxx.backend.infra.routes.studio.discord_scan.collect_discord_scan_channels_BANG_(client,channel_ids,max_channels));
var map__29995 = (await knoxx.backend.infra.routes.studio.discord_scan.collect_attachments_BANG_(client,channels,scan_channel_BANG_,scan_options));
var map__29995__$1 = cljs.core.__destructure_map(map__29995);
var messages_scanned = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29995__$1,new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068));
var attachments = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29995__$1,new cljs.core.Keyword(null,"attachments","attachments",-1535547830));
var results = (await knoxx.backend.infra.routes.studio.discord_scan.import_attachment_results_BANG_(runtime,config,import_root,attachments,import_attachment_BANG_));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"channels","channels",1132759174),channels,new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068),messages_scanned,new cljs.core.Keyword(null,"attachments","attachments",-1535547830),attachments,new cljs.core.Keyword(null,"results","results",-1134170113),results], null);
});
knoxx.backend.infra.routes.studio.discord_scan.handle_discord_media_scan_BANG_ = (async function knoxx$backend$infra$routes$studio$discord_scan$handle_discord_media_scan_BANG_(runtime,config,reply,body,default_import_root,scan_channel_BANG_,import_attachment_BANG_,failure_message){
var token = knoxx.backend.infra.routes.studio.discord_scan.discord_bot_token(config);
var options = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.studio.discord_scan.scan_request_options(body,default_import_root),new cljs.core.Keyword(null,"client","client",-1323448117),(cljs.core.truth_(token)?knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$2(token,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),"Knoxx-Studio/1.0"], null)):null));
if(cljs.core.not(token)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(503),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Discord bot token is not configured"], null));
} else {
try{var map__30020 = (await knoxx.backend.infra.routes.studio.discord_scan.run_discord_media_scan_BANG_(runtime,config,options,scan_channel_BANG_,import_attachment_BANG_));
var map__30020__$1 = cljs.core.__destructure_map(map__30020);
var channels = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30020__$1,new cljs.core.Keyword(null,"channels","channels",1132759174));
var messages_scanned = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30020__$1,new cljs.core.Keyword(null,"messages-scanned","messages-scanned",805888068));
var attachments = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30020__$1,new cljs.core.Keyword(null,"attachments","attachments",-1535547830));
var results = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30020__$1,new cljs.core.Keyword(null,"results","results",-1134170113));
var summary = knoxx.backend.infra.routes.studio.discord_scan.scan_summary(new cljs.core.Keyword(null,"import-root","import-root",1996845422).cljs$core$IFn$_invoke$arity$1(options),channels,messages_scanned,attachments,results);
var manifest_path = (await knoxx.backend.infra.routes.studio.discord_scan.write_scan_manifest_BANG_(runtime,config,new cljs.core.Keyword(null,"import-root","import-root",1996845422).cljs$core$IFn$_invoke$arity$1(options),summary));
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(summary,new cljs.core.Keyword(null,"manifest_path","manifest_path",-2086066483),manifest_path));
}catch (e30017){var err = e30017;
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(failure_message)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}}
});
knoxx.backend.infra.routes.studio.discord_scan.studio_discord_audio_scan_BANG_ = (function knoxx$backend$infra$routes$studio$discord_scan$studio_discord_audio_scan_BANG_(app,runtime,config,deps){
var map__30034 = deps;
var map__30034__$1 = cljs.core.__destructure_map(map__30034);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30034__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30037 = app;
var G__30038 = "POST";
var G__30039 = "/api/studio/discord-audio-scan";
var G__30040 = (function (request,reply){
var G__30041 = runtime;
var G__30042 = request;
var G__30043 = reply;
var G__30044 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

return knoxx.backend.infra.routes.studio.discord_scan.handle_discord_media_scan_BANG_(runtime,config,reply,(function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),"Audio/discord-imports",knoxx.backend.infra.routes.studio.discord_scan.scan_channel_audio_BANG_,knoxx.backend.infra.routes.studio.discord_scan.import_audio_attachment_BANG_,"Discord audio scan failed: ");
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30041,G__30042,G__30043,G__30044) : with_request_context_BANG_.call(null,G__30041,G__30042,G__30043,G__30044));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30037,G__30038,G__30039,G__30040) : route_BANG_.call(null,G__30037,G__30038,G__30039,G__30040));
});
knoxx.backend.infra.routes.studio.discord_scan.studio_discord_image_scan_BANG_ = (function knoxx$backend$infra$routes$studio$discord_scan$studio_discord_image_scan_BANG_(app,runtime,config,deps){
var map__30056 = deps;
var map__30056__$1 = cljs.core.__destructure_map(map__30056);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30056__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30058 = app;
var G__30059 = "POST";
var G__30060 = "/api/studio/discord-image-scan";
var G__30061 = (function (request,reply){
var G__30062 = runtime;
var G__30063 = request;
var G__30064 = reply;
var G__30065 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

return knoxx.backend.infra.routes.studio.discord_scan.handle_discord_media_scan_BANG_(runtime,config,reply,(function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),"discord/images",knoxx.backend.infra.routes.studio.discord_scan.scan_channel_images_BANG_,knoxx.backend.infra.routes.studio.discord_scan.import_image_attachment_BANG_,"Discord image scan failed: ");
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30062,G__30063,G__30064,G__30065) : with_request_context_BANG_.call(null,G__30062,G__30063,G__30064,G__30065));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30058,G__30059,G__30060,G__30061) : route_BANG_.call(null,G__30058,G__30059,G__30060,G__30061));
});

//# sourceMappingURL=knoxx.backend.infra.routes.studio.discord_scan.js.map
