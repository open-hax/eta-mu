import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.discord.rest_client.js";
import "./knoxx.backend.extern.discord.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.domain.label.quality.js";
import "./knoxx.backend.infra.svg_render.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.actor.credentials.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.tools.js";
goog.provide('knoxx.backend.domain.discord.tools');
knoxx.backend.domain.discord.tools.discord_token_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_token_BANG_(runtime){
var credential = (await knoxx.backend.domain.actor.credentials.get_credential_BANG_(runtime,"discord_bot"));
var token = knoxx.backend.domain.actor.credentials.secret_value.cljs$core$IFn$_invoke$arity$variadic(credential,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"botToken","botToken",1995464313),new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),new cljs.core.Keyword(null,"token","token",-1211463215)], 0));
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)))){
throw (new Error("Discord bot actor credential must include botToken."));
} else {
}

return token;
});
knoxx.backend.domain.discord.tools.discord_client_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_client_BANG_(runtime){
return knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$1((await knoxx.backend.domain.discord.tools.discord_token_BANG_(runtime)));
});
knoxx.backend.domain.discord.tools.discord_attachments = (function knoxx$backend$domain$discord$tools$discord_attachments(message){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (attachment){
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
return "";
}
})(),new cljs.core.Keyword(null,"contentType","contentType",-1462509576),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content_type","content_type",52159344).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contentType","contentType",-1462509576).cljs$core$IFn$_invoke$arity$1(attachment);
}
})(),new cljs.core.Keyword(null,"size","size",1098693007),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(attachment);
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
})());
});
knoxx.backend.domain.discord.tools.discord_embeds = (function knoxx$backend$domain$discord$tools$discord_embeds(message){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (embed){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(embed),new cljs.core.Keyword(null,"description","description",-1428560544),new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(embed),new cljs.core.Keyword(null,"url","url",276297046),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(embed)], null);
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"embeds","embeds",833349080).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
});
knoxx.backend.domain.discord.tools.discord_message__GT_map = (function knoxx$backend$domain$discord$tools$discord_message__GT_map(message){
var author = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"authorId","authorId",-1664154012),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"channelId","channelId",2082229448),new cljs.core.Keyword(null,"attachments","attachments",-1535547830),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965),new cljs.core.Keyword(null,"authorIsBot","authorIsBot",-1582823121),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"embeds","embeds",833349080),new cljs.core.Keyword(null,"timestamp","timestamp",579478971)],[(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channel_id","channel_id",1180018383).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})(),knoxx.backend.domain.discord.tools.discord_attachments(message),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"username","username",1605666410).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})(),cljs.core.boolean$(new cljs.core.Keyword(null,"bot","bot",-950896508).cljs$core$IFn$_invoke$arity$1(author)),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),knoxx.backend.domain.discord.tools.discord_embeds(message),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()]);
});
knoxx.backend.domain.discord.tools.discord_message_line = (function knoxx$backend$domain$discord$tools$discord_message_line(message){
var content = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var attachments = new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(message);
var attachment_text = ((cljs.core.seq(attachments))?(""+" attachments="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (attachment){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(attachment))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(attachment);
if(cljs.core.truth_(temp__5825__auto__)){
var url = temp__5825__auto__;
return (""+" <"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)+">");
} else {
return null;
}
})()));
}),attachments)))):null);
var embeds = new cljs.core.Keyword(null,"embeds","embeds",833349080).cljs$core$IFn$_invoke$arity$1(message);
var embed_text = ((cljs.core.seq(embeds))?(""+" embeds="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (embed){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(embed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "embed";
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(embed);
if(cljs.core.truth_(temp__5825__auto__)){
var url = temp__5825__auto__;
return (""+" <"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)+">");
} else {
return null;
}
})()));
}),embeds)))):null);
return (""+"<"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(message))+" (id:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(message))+")> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(content))?"[no text]":content))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = attachment_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = embed_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
});
knoxx.backend.domain.discord.tools.discord_messages_text = (function knoxx$backend$domain$discord$tools$discord_messages_text(heading,messages){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(heading)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((cljs.core.seq(messages))?(""+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.tools.discord_message_line,messages)))):"\n\nNo messages found.")));
});
knoxx.backend.domain.discord.tools.discord_record_id = (function knoxx$backend$domain$discord$tools$discord_record_id(message){
return (""+"discord:message:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(message))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message)));
});
knoxx.backend.domain.discord.tools.discord_message_quality = (function knoxx$backend$domain$discord$tools$discord_message_quality(message){
return knoxx.backend.domain.label.quality.quality_label(message);
});
knoxx.backend.domain.discord.tools.drop_bad_discord_messages = (function knoxx$backend$domain$discord$tools$drop_bad_discord_messages(messages){
return knoxx.backend.domain.label.quality.drop_bad(messages);
});
knoxx.backend.domain.discord.tools.parse_hours = (function knoxx$backend$domain$discord$tools$parse_hours(value,default_hours){
var n = Number(value);
if(((cljs.core.not(isNaN(n))) && ((n > (0))))){
return n;
} else {
return default_hours;
}
});
knoxx.backend.domain.discord.tools.timestamp_ms = (function knoxx$backend$domain$discord$tools$timestamp_ms(value){
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
knoxx.backend.domain.discord.tools.within_hours_QMARK_ = (function knoxx$backend$domain$discord$tools$within_hours_QMARK_(hours,message){
var temp__5823__auto__ = knoxx.backend.domain.discord.tools.timestamp_ms(new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message));
if(cljs.core.truth_(temp__5823__auto__)){
var ms = temp__5823__auto__;
return (ms >= (Date.now() - (((hours * (60)) * (60)) * (1000))));
} else {
return true;
}
});
knoxx.backend.domain.discord.tools.chronological_discord_messages = (function knoxx$backend$domain$discord$tools$chronological_discord_messages(messages){
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (message){
var or__5162__auto__ = knoxx.backend.domain.discord.tools.timestamp_ms(new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(message));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
}),messages));
});
knoxx.backend.domain.discord.tools.good_first_then_not_bad = (function knoxx$backend$domain$discord$tools$good_first_then_not_bad(messages){
var non_bad = knoxx.backend.domain.discord.tools.drop_bad_discord_messages(messages);
var good = knoxx.backend.domain.discord.tools.chronological_discord_messages(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__28022_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("good",knoxx.backend.domain.discord.tools.discord_message_quality(p1__28022_SHARP_));
}),non_bad));
var not_bad = knoxx.backend.domain.discord.tools.chronological_discord_messages(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__28023_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("good",knoxx.backend.domain.discord.tools.discord_message_quality(p1__28023_SHARP_));
}),non_bad));
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(good,not_bad));
});
knoxx.backend.domain.discord.tools.label_for_record_id = (function knoxx$backend$domain$discord$tools$label_for_record_id(labels,record_id){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(labels,record_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(labels,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(record_id));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
});
knoxx.backend.domain.discord.tools.attach_openplanner_labels_BANG_ = (async function knoxx$backend$domain$discord$tools$attach_openplanner_labels_BANG_(config,messages){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
if(((cljs.core.empty_QMARK_(messages)) || (cljs.core.not(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))))){
return knoxx.backend.domain.discord.tools.good_first_then_not_bad(messages);
} else {
try{var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.tools.discord_record_id,messages);
var response = (await knoxx.backend.infra.clients.openplanner.record_labels_BANG_(client,ids));
var labels = new cljs.core.Keyword(null,"labels","labels",-626734591).cljs$core$IFn$_invoke$arity$1(response);
return knoxx.backend.domain.discord.tools.good_first_then_not_bad(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (message){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(message,new cljs.core.Keyword(null,"openplannerLabels","openplannerLabels",-1625330291),knoxx.backend.domain.discord.tools.label_for_record_id(labels,knoxx.backend.domain.discord.tools.discord_record_id(message)));
}),messages));
}catch (e28059){var error = e28059;
console.warn("[discord-tools] OpenPlanner label lookup failed; failing closed to avoid surfacing crossed/bad messages",error);

return cljs.core.PersistentVector.EMPTY;
}}
});
knoxx.backend.domain.discord.tools.discord_fetch_channel_messages_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_fetch_channel_messages_BANG_(runtime,_config,channel_id,p__28065){
var map__28066 = p__28065;
var map__28066__$1 = cljs.core.__destructure_map(map__28066);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28066__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var before = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28066__$1,new cljs.core.Keyword(null,"before","before",-1633692388));
var after = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28066__$1,new cljs.core.Keyword(null,"after","after",594996914));
var around = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28066__$1,new cljs.core.Keyword(null,"around","around",-265975553));
if(clojure.string.blank_QMARK_(channel_id)){
throw (new Error("channel_id is required"));
} else {
}

var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
var payload = (await knoxx.backend.domain.discord.rest_client.channel_messages_BANG_(client,channel_id,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"before","before",-1633692388),before,new cljs.core.Keyword(null,"after","after",594996914),after,new cljs.core.Keyword(null,"around","around",-265975553),around], null)));
var messages = cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.tools.discord_message__GT_map,(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"messages","messages",345434482),messages,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(messages),new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id], null);
});
knoxx.backend.domain.discord.tools.discord_scroll_channel_messages_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_scroll_channel_messages_BANG_(runtime,config,channel_id,oldest_seen_id,limit){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((await knoxx.backend.domain.discord.tools.discord_fetch_channel_messages_BANG_(runtime,config,channel_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"before","before",-1633692388),oldest_seen_id], null))),new cljs.core.Keyword(null,"oldestSeenId","oldestSeenId",-1356766638),oldest_seen_id);
});
knoxx.backend.domain.discord.tools.discord_open_dm_channel_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_open_dm_channel_BANG_(runtime,user_id){
if(clojure.string.blank_QMARK_(user_id)){
throw (new Error("user_id is required"));
} else {
}

var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
return (await knoxx.backend.domain.discord.rest_client.open_dm_channel_BANG_(client,user_id));
});
knoxx.backend.domain.discord.tools.discord_fetch_dm_messages_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_fetch_dm_messages_BANG_(runtime,config,user_id,p__28097){
var map__28101 = p__28097;
var map__28101__$1 = cljs.core.__destructure_map(map__28101);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28101__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var before = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28101__$1,new cljs.core.Keyword(null,"before","before",-1633692388));
var channel = (await knoxx.backend.domain.discord.tools.discord_open_dm_channel_BANG_(runtime,user_id));
var channel_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var result = (await knoxx.backend.domain.discord.tools.discord_fetch_channel_messages_BANG_(runtime,config,channel_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"before","before",-1633692388),before], null)));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"dmChannelId","dmChannelId",1364468195),channel_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"userId","userId",575594135),user_id], 0));
});
knoxx.backend.domain.discord.tools.discord_search_result = (function knoxx$backend$domain$discord$tools$discord_search_result(scope,timeframe_hours,user_id,query,limit,result,labelled){
var needle = (function (){var G__28117 = query;
var G__28117__$1 = (((G__28117 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28117)));
if((G__28117__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__28117__$1);
}
})();
var author_id = (function (){var G__28126 = user_id;
var G__28126__$1 = (((G__28126 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28126)));
if((G__28126__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__28126__$1);
}
})();
var filtered = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (50);
}
})(),knoxx.backend.domain.discord.tools.good_first_then_not_bad(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (message){
return ((((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = needle;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))) || (clojure.string.includes_QMARK_(clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message)))),needle)))) && ((((author_id == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(author_id,new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(message))))));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__28112_SHARP_){
return knoxx.backend.domain.discord.tools.within_hours_QMARK_(timeframe_hours,p1__28112_SHARP_);
}),labelled)))));
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"messages","messages",345434482),filtered,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(filtered),new cljs.core.Keyword(null,"scope","scope",-439358418),scope,new cljs.core.Keyword(null,"channelId","channelId",2082229448),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"dmChannelId","dmChannelId",1364468195),new cljs.core.Keyword(null,"dmChannelId","dmChannelId",1364468195).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"source","source",-433931539),"client_side_filter_openplanner_labels",new cljs.core.Keyword(null,"qualityOrder","qualityOrder",1888657940),"good_chronological_then_not_bad_chronological",new cljs.core.Keyword(null,"sinceHours","sinceHours",530839084),timeframe_hours], null);
});
knoxx.backend.domain.discord.tools.discord_search_messages_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_search_messages_BANG_(runtime,config,scope,p__28149){
var map__28154 = p__28149;
var map__28154__$1 = cljs.core.__destructure_map(map__28154);
var channel_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"channel-id","channel-id",138191095));
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291));
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var before = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"before","before",-1633692388));
var after = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"after","after",594996914));
var since_hours = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28154__$1,new cljs.core.Keyword(null,"since-hours","since-hours",124306716));
var scope__$1 = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = scope;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "channel";
}
})()))));
var timeframe_hours = knoxx.backend.domain.discord.tools.parse_hours(since_hours,(168));
var result = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(scope__$1,"dm"))?(await knoxx.backend.domain.discord.tools.discord_fetch_dm_messages_BANG_(runtime,config,user_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(100),new cljs.core.Keyword(null,"before","before",-1633692388),before], null))):(await knoxx.backend.domain.discord.tools.discord_fetch_channel_messages_BANG_(runtime,config,channel_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(100),new cljs.core.Keyword(null,"before","before",-1633692388),before,new cljs.core.Keyword(null,"after","after",594996914),after], null))));
var labelled = (await knoxx.backend.domain.discord.tools.attach_openplanner_labels_BANG_(config,new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(result)));
return knoxx.backend.domain.discord.tools.discord_search_result(scope__$1,timeframe_hours,user_id,query,limit,result,labelled);
});
knoxx.backend.domain.discord.tools.infer_upload_filename = (function knoxx$backend$domain$discord$tools$infer_upload_filename(url,idx){
var pathname = (function (){try{return (new URL((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)))).pathname;
}catch (e28166){var _ = e28166;
return "";
}})();
var candidate = (function (){var G__28167 = pathname;
var G__28167__$1 = (((G__28167 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__28167,/\//));
var G__28167__$2 = (((G__28167__$1 == null))?null:cljs.core.last(G__28167__$1));
var G__28167__$3 = (((G__28167__$2 == null))?null:clojure.string.trim(G__28167__$2));
if((G__28167__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__28167__$3);
}
})();
var or__5162__auto__ = candidate;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"attachment-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)+".bin");
}
});
knoxx.backend.domain.discord.tools.file_url__GT_path = (function knoxx$backend$domain$discord$tools$file_url__GT_path(source){
try{return decodeURIComponent((new URL(source)).pathname);
}catch (e28176){var _ = e28176;
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2(source,(("file://").length));
}});
/**
 * Render an SVG buffer to PNG using headless Chromium. Returns a promise.
 */
knoxx.backend.domain.discord.tools.svg_buffer__GT_png_buffer_BANG_ = (function knoxx$backend$domain$discord$tools$svg_buffer__GT_png_buffer_BANG_(svg_buffer){
var svg_str = knoxx.backend.domain.text.sanitize_svg_content(svg_buffer.toString("utf8"));
return knoxx.backend.infra.svg_render.svg__GT_png(svg_str,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"width","width",-384071477),(600),new cljs.core.Keyword(null,"height","height",1025178622),(300)], null));
});
knoxx.backend.domain.discord.tools.svg_code_block_pattern = /```(?:svg|image\/svg\+xml)\s*\n([\s\S]*?)\n```/is;
/**
 * Pull fenced ```svg code blocks out of message text so they can be rendered
 * and attached as PNGs instead of being sent as raw code.
 */
knoxx.backend.domain.discord.tools.extract_inline_svg_code_blocks = (function knoxx$backend$domain$discord$tools$extract_inline_svg_code_blocks(text){
var raw_text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var matches = cljs.core.re_seq(knoxx.backend.domain.discord.tools.svg_code_block_pattern,raw_text);
var svg_blocks = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__28196_SHARP_){
return clojure.string.includes_QMARK_(clojure.string.lower_case(p1__28196_SHARP_),"<svg");
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28195_SHARP_){
return clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__28195_SHARP_)));
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.second,matches))));
var cleaned_text = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__28205){
var vec__28206 = p__28205;
var full_match = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28206,(0),null);
var _svg = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28206,(1),null);
return clojure.string.replace(acc,full_match,"[image]");
}),raw_text,matches);
var attachment_urls = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (svg){
return (""+"data:image/svg+xml;charset=utf-8,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(svg)));
}),svg_blocks);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),cleaned_text,new cljs.core.Keyword(null,"attachmentUrls","attachmentUrls",1857227267),attachment_urls], null);
});
/**
 * If the resolved attachment is an SVG, render it to PNG transparently.
 * On render failure, returns original attachment.
 */
knoxx.backend.domain.discord.tools.maybe_render_svg_BANG_ = (async function knoxx$backend$domain$discord$tools$maybe_render_svg_BANG_(p__28209){
var map__28210 = p__28209;
var map__28210__$1 = cljs.core.__destructure_map(map__28210);
var attachment = map__28210__$1;
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28210__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var mimeType = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28210__$1,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690));
var buffer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28210__$1,new cljs.core.Keyword(null,"buffer","buffer",617295198));
if(cljs.core.truth_((await (async function (){var or__5162__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(mimeType,"image/svg+xml");
if(or__5162__auto__){
return or__5162__auto__;
} else {
var G__28211 = name;
var G__28211__$1 = (((G__28211 == null))?null:clojure.string.lower_case(G__28211));
if((G__28211__$1 == null)){
return null;
} else {
return clojure.string.ends_with_QMARK_(G__28211__$1,".svg");
}
}
})()))){
try{var png_buf = (await knoxx.backend.domain.discord.tools.svg_buffer__GT_png_buffer_BANG_(buffer));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),(cljs.core.truth_((await (async function (){var G__28247 = name;
var G__28247__$1 = (((G__28247 == null))?null:clojure.string.lower_case(G__28247));
if((G__28247__$1 == null)){
return null;
} else {
return clojure.string.ends_with_QMARK_(G__28247__$1,".svg");
}
})()))?clojure.string.replace(name,/\.svg$/i,".png"):(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "attachment";
}
})()))+".png")),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),"image/png",new cljs.core.Keyword(null,"buffer","buffer",617295198),png_buf], null);
}catch (e28213){var error = e28213;
console.warn("[discord-tools] SVG render failed; uploading original SVG",error);

return attachment;
}} else {
return attachment;
}
});
knoxx.backend.domain.discord.tools.data_url_upload_attachment = (function knoxx$backend$domain$discord$tools$data_url_upload_attachment(source,idx){
var data_start = source.indexOf(",");
var metadata = (((data_start >= (0)))?cljs.core.subs.cljs$core$IFn$_invoke$arity$3(source,(5),data_start):null);
var payload = (((data_start >= (0)))?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(source,(data_start + (1))):null);
if((((metadata == null)) || ((payload == null)))){
throw (new Error("Invalid data URL attachment"));
} else {
}

var metadata_parts = clojure.string.split.cljs$core$IFn$_invoke$arity$2(metadata,/;/);
var mime_type = knoxx.backend.domain.media.sanitize_mime_type(cljs.core.first(metadata_parts),"application/octet-stream");
var base64_QMARK_ = cljs.core.boolean$(cljs.core.some(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, ["base64",null], null), null),cljs.core.rest(metadata_parts)));
var buffer = ((base64_QMARK_)?Buffer.from(payload,"base64"):Buffer.from(decodeURIComponent(payload),"utf8"));
knoxx.backend.domain.media.ensure_source_size_BANG_(buffer.length,knoxx.backend.domain.media.workspace_media_max_bytes,"Discord attachment");

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),(""+"attachment-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.mime_type__GT_extension(mime_type))),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type,new cljs.core.Keyword(null,"buffer","buffer",617295198),buffer], null);
});
knoxx.backend.domain.discord.tools.http_upload_attachment_BANG_ = (async function knoxx$backend$domain$discord$tools$http_upload_attachment_BANG_(source,idx){
var map__28301 = (await knoxx.backend.domain.discord.rest_client.fetch_attachment_BANG_(knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$1(null),source));
var map__28301__$1 = cljs.core.__destructure_map(map__28301);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28301__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28301__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28301__$1,new cljs.core.Keyword(null,"headers","headers",-835030129));
var body = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28301__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
if(cljs.core.truth_(ok)){
var buffer = Buffer.from(body);
var mime_type = knoxx.backend.domain.media.sanitize_mime_type(cljs.core.get.cljs$core$IFn$_invoke$arity$2(headers,"content-type"),knoxx.backend.domain.media.workspace_media_mime_type(source));
knoxx.backend.domain.media.ensure_source_size_BANG_(buffer.length,knoxx.backend.domain.media.workspace_media_max_bytes,"Discord attachment");

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),knoxx.backend.domain.discord.tools.infer_upload_filename(source,idx),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type,new cljs.core.Keyword(null,"buffer","buffer",617295198),buffer], null);
} else {
throw (new Error((""+"Attachment fetch failed "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status))));
}
});
knoxx.backend.domain.discord.tools.local_upload_attachment_BANG_ = (async function knoxx$backend$domain$discord$tools$local_upload_attachment_BANG_(runtime,config,source,idx){
var raw_source = ((knoxx.backend.domain.media.source_file_url_QMARK_(source))?knoxx.backend.domain.discord.tools.file_url__GT_path(source):source);
var loaded = (await knoxx.backend.domain.media.load_media_source_BANG_(runtime,config,raw_source,knoxx.backend.domain.media.workspace_media_max_bytes));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(loaded);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"attachment-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.mime_type__GT_extension(new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(loaded))));
}
})()),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),knoxx.backend.domain.media.sanitize_mime_type(new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(loaded),"application/octet-stream"),new cljs.core.Keyword(null,"buffer","buffer",617295198),new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(loaded)], null);
});
/**
 * Fetch an attachment from a URL, data URL, or local file path.
 * Returns a promise resolving to {:name :mimeType :buffer}.
 * SVG files are automatically rendered to PNG before upload.
 */
knoxx.backend.domain.discord.tools.fetch_discord_upload_attachment_BANG_ = (async function knoxx$backend$domain$discord$tools$fetch_discord_upload_attachment_BANG_(runtime,config,url,idx){
var source = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = url;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(source)){
throw (new Error("Empty attachment source"));
} else {
if(knoxx.backend.domain.media.source_data_url_QMARK_(source)){
return knoxx.backend.domain.discord.tools.data_url_upload_attachment(source,idx);
} else {
if(knoxx.backend.domain.media.source_http_url_QMARK_(source)){
return (await knoxx.backend.domain.discord.tools.http_upload_attachment_BANG_(source,idx));
} else {
return (await knoxx.backend.domain.discord.tools.local_upload_attachment_BANG_(runtime,config,source,idx));

}
}
}
});
knoxx.backend.domain.discord.tools.discord_message_chunks = (function knoxx$backend$domain$discord$tools$discord_message_chunks(normalized){
var chunk_size = (2000);
var base_text = ((clojure.string.blank_QMARK_(normalized))?"[attachment]":normalized);
var remaining = base_text;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((cljs.core.count(remaining) <= chunk_size)){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,remaining);
} else {
var slice = remaining.lastIndexOf("\n\n",chunk_size);
var split_at = (((slice > ((chunk_size * 0.5) | 0)))?slice:chunk_size);
var G__28790 = clojure.string.trim(cljs.core.subs.cljs$core$IFn$_invoke$arity$2(remaining,split_at));
var G__28791 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,clojure.string.trim(cljs.core.subs.cljs$core$IFn$_invoke$arity$3(remaining,(0),split_at)));
remaining = G__28790;
acc = G__28791;
continue;
}
break;
}
});
knoxx.backend.domain.discord.tools.discord_message_payload = (function knoxx$backend$domain$discord$tools$discord_message_payload(chunk,reply_to,state){
var G__28331 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content","content",15833224),chunk], null);
if(cljs.core.truth_((function (){var and__5160__auto__ = reply_to;
if(cljs.core.truth_(and__5160__auto__)){
return (new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(state) == null);
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28331,new cljs.core.Keyword(null,"message_reference","message_reference",-2008207798),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"message_id","message_id",663757010),reply_to], null));
} else {
return G__28331;
}
});
knoxx.backend.domain.discord.tools.post_discord_message_chunk_BANG_ = (function knoxx$backend$domain$discord$tools$post_discord_message_chunk_BANG_(client,channel_id,reply_to,file_list,chunk,state){
return knoxx.backend.domain.discord.rest_client.create_channel_message_form_BANG_(client,channel_id,knoxx.backend.extern.discord.message_form_data(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"payload","payload",-383036092),knoxx.backend.domain.discord.tools.discord_message_payload(chunk,reply_to,state),new cljs.core.Keyword(null,"files","files",-472457450),file_list], null)));
});
knoxx.backend.domain.discord.tools.post_discord_message_chunks_BANG_ = (async function knoxx$backend$domain$discord$tools$post_discord_message_chunks_BANG_(client,channel_id,reply_to,file_list,chunks){
var G__28341 = cljs.core.seq(chunks);
var vec__28342 = G__28341;
var seq__28343 = cljs.core.seq(vec__28342);
var first__28344 = cljs.core.first(seq__28343);
var seq__28343__$1 = cljs.core.next(seq__28343);
var chunk = first__28344;
var remaining = seq__28343__$1;
var state = null;
var G__28341__$1 = G__28341;
var state__$1 = state;
while(true){
var vec__28351 = G__28341__$1;
var seq__28352 = cljs.core.seq(vec__28351);
var first__28353 = cljs.core.first(seq__28352);
var seq__28352__$1 = cljs.core.next(seq__28352);
var chunk__$1 = first__28353;
var remaining__$1 = seq__28352__$1;
var state__$2 = state__$1;
if(cljs.core.truth_(chunk__$1)){
var G__28798 = remaining__$1;
var G__28799 = (await knoxx.backend.domain.discord.tools.post_discord_message_chunk_BANG_(client,channel_id,reply_to,file_list,chunk__$1,state__$2));
G__28341__$1 = G__28798;
state__$1 = G__28799;
continue;
} else {
return state__$2;
}
break;
}
});
knoxx.backend.domain.discord.tools.resolve_discord_upload_attachment_BANG_ = (async function knoxx$backend$domain$discord$tools$resolve_discord_upload_attachment_BANG_(runtime,config,idx,url){
return (await knoxx.backend.domain.discord.tools.maybe_render_svg_BANG_((await knoxx.backend.domain.discord.tools.fetch_discord_upload_attachment_BANG_(runtime,config,url,idx))));
});
knoxx.backend.domain.discord.tools.discord_send_message_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_send_message_BANG_(runtime,config,channel_id,text,reply_to,attachment_urls){
var raw_text = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
var map__28357 = knoxx.backend.domain.discord.tools.extract_inline_svg_code_blocks(raw_text);
var map__28357__$1 = cljs.core.__destructure_map(map__28357);
var text__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28357__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var attachmentUrls = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28357__$1,new cljs.core.Keyword(null,"attachmentUrls","attachmentUrls",1857227267));
var extracted_urls = (((((!(clojure.string.blank_QMARK_(text__$1)))) && (clojure.string.includes_QMARK_(text__$1,"data:image/"))))?cljs.core.vec(cljs.core.re_seq(/data:image\/[^;]+;base64,[A-Za-z0-9+\/=]+/,text__$1)):null);
var text_for_discord = ((cljs.core.seq(extracted_urls))?cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (txt,url){
return clojure.string.replace(txt,url,"[image]");
}),text__$1,extracted_urls):text__$1);
var normalized = clojure.string.trim(text_for_discord);
var all_urls = cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = attachment_urls;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),(await (async function (){var or__5162__auto__ = attachmentUrls;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([extracted_urls], 0)));
if(clojure.string.blank_QMARK_(channel_id)){
throw (new Error("channel_id is required"));
} else {
}

if(((clojure.string.blank_QMARK_(normalized)) && (cljs.core.empty_QMARK_(all_urls)))){
throw (new Error("text or attachment_urls is required"));
} else {
}

var file_list = (await knoxx.backend.extern.discord.promise_all_vector(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.tools.resolve_discord_upload_attachment_BANG_,runtime,config),all_urls)));
var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
var chunks = knoxx.backend.domain.discord.tools.discord_message_chunks(normalized);
var result = (await knoxx.backend.domain.discord.tools.post_discord_message_chunks_BANG_(client,channel_id,reply_to,file_list,chunks));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"messageId","messageId",-260575736),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"sent","sent",-1537501490),true,new cljs.core.Keyword(null,"timestamp","timestamp",579478971),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"chunkCount","chunkCount",1427535666),cljs.core.count(chunks),new cljs.core.Keyword(null,"attachmentCount","attachmentCount",2014220145),cljs.core.count(file_list)], null);
});
/**
 * Add an emoji reaction to a Discord message.
 */
knoxx.backend.domain.discord.tools.discord_react_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_react_BANG_(runtime,channel_id,message_id,emoji){
if(clojure.string.blank_QMARK_(channel_id)){
throw (new Error("channel_id is required"));
} else {
}

if(clojure.string.blank_QMARK_(message_id)){
throw (new Error("message_id is required"));
} else {
}

if(clojure.string.blank_QMARK_(emoji)){
throw (new Error("emoji is required"));
} else {
}

var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
(await knoxx.backend.domain.discord.rest_client.add_reaction_BANG_(client,channel_id,message_id,emoji));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"messageId","messageId",-260575736),message_id,new cljs.core.Keyword(null,"emoji","emoji",1031230144),emoji,new cljs.core.Keyword(null,"reacted","reacted",523485502),true], null);
});
/**
 * Create a thread in a channel or from a message.
 */
knoxx.backend.domain.discord.tools.discord_thread_create_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_thread_create_BANG_(runtime,channel_id,message_id,name,auto_archive_duration){
if(clojure.string.blank_QMARK_(channel_id)){
throw (new Error("channel_id is required"));
} else {
}

if(clojure.string.blank_QMARK_(name)){
throw (new Error("name is required"));
} else {
}

var body = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"auto_archive_duration","auto_archive_duration",-1199207961),(await (async function (){var or__5162__auto__ = auto_archive_duration;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1440);
}
})()),new cljs.core.Keyword(null,"type","type",1174270348),(11)], null);
var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
var result = (await knoxx.backend.domain.discord.rest_client.create_thread_BANG_(client,channel_id,message_id,body));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"threadId","threadId",-440699805),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"messageId","messageId",-260575736),(await (async function (){var or__5162__auto__ = message_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"created","created",-704993748),true], null);
});
knoxx.backend.domain.discord.tools.discord_list_guilds_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_list_guilds_BANG_(runtime){
var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
var payload = (await knoxx.backend.domain.discord.rest_client.current_user_guilds_BANG_(client));
var servers = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (guild){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"id","id",-1388402092),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(guild);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(guild);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"memberCount","memberCount",-1747037792),new cljs.core.Keyword(null,"approximate_member_count","approximate_member_count",-1624478051).cljs$core$IFn$_invoke$arity$1(guild)], null);
}),(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"servers","servers",1881102005),servers,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(servers)], null);
});
knoxx.backend.domain.discord.tools.text_channel_type_QMARK_ = (function knoxx$backend$domain$discord$tools$text_channel_type_QMARK_(channel){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [(0),null,(12),null,(11),null,(5),null], null), null),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(channel));
});
knoxx.backend.domain.discord.tools.discord_list_guild_channels_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_list_guild_channels_BANG_(runtime,guild_id){
var client = (await knoxx.backend.domain.discord.tools.discord_client_BANG_(runtime));
var payload = (await knoxx.backend.domain.discord.rest_client.guild_channels_BANG_(client,guild_id));
var channels = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (channel){
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
return "";
}
})(),new cljs.core.Keyword(null,"guildId","guildId",-559818490),guild_id,new cljs.core.Keyword(null,"type","type",1174270348),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(channel);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))], null);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.tools.text_channel_type_QMARK_,(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"channels","channels",1132759174),channels,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(channels)], null);
});
knoxx.backend.domain.discord.tools.discord_list_channels_BANG_ = (async function knoxx$backend$domain$discord$tools$discord_list_channels_BANG_(runtime,guild_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = guild_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))){
var result = (await knoxx.backend.domain.discord.tools.discord_list_guilds_BANG_(runtime));
var payloads = (await knoxx.backend.extern.discord.promise_all_vector(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (server){
return knoxx.backend.domain.discord.tools.discord_list_guild_channels_BANG_(runtime,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(server));
}),new cljs.core.Keyword(null,"servers","servers",1881102005).cljs$core$IFn$_invoke$arity$1(result))));
var channels = cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"channels","channels",1132759174),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([payloads], 0)));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"channels","channels",1132759174),channels,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(channels)], null);
} else {
return (await knoxx.backend.domain.discord.tools.discord_list_guild_channels_BANG_(runtime,guild_id));
}
});
knoxx.backend.domain.discord.tools.strip_path_delims = (function knoxx$backend$domain$discord$tools$strip_path_delims(s){
return knoxx.backend.extern.discord.trim_path_delims(s);
});
knoxx.backend.domain.discord.tools.tool_params = (function knoxx$backend$domain$discord$tools$tool_params(params){
return knoxx.backend.extern.discord.normalize_tool_params(params);
});
knoxx.backend.domain.discord.tools.pget = (function knoxx$backend$domain$discord$tools$pget(var_args){
var G__28416 = arguments.length;
switch (G__28416) {
case 2:
return knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2 = (function (params,k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(params,k);
}));

(knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3 = (function (params,k,fallback_k){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(params,k);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(params,fallback_k);
}
}));

(knoxx.backend.domain.discord.tools.pget.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.discord.tools.discord_send_execute = (async function knoxx$backend$domain$discord$tools$discord_send_execute(runtime,config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var channel_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var text = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"content","content",15833224));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var reply_to = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"reply_to","reply_to",64284531),new cljs.core.Keyword(null,"replyTo","replyTo",-438666350));
var attachment_urls = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.tools.strip_path_delims,(await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"attachment_urls","attachment_urls",178655562),new cljs.core.Keyword(null,"attachmentUrls","attachmentUrls",1857227267));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Sending Discord message to "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_send_message_BANG_(runtime,config,channel_id,text,reply_to,attachment_urls));
return knoxx.backend.domain.text.tool_text_result((""+"Sent Discord message "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(result))+" to channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)),result);
});
knoxx.backend.domain.discord.tools.send_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to send the message to. Use discord.list.channels to discover IDs."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Message content to send. Long messages will be chunked automatically."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reply_to","reply_to",64284531),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional message ID to reply to."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"attachment_urls","attachment_urls",178655562),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional attachment sources to upload: HTTP(S) URLs, data URLs, absolute file paths, or workspace-relative paths (e.g. sandbox output files, generated images)."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null)], null);
knoxx.backend.domain.discord.tools.discord_send_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.send","Discord Send","Send a message to a Discord channel, optionally as a reply to an existing message.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Send a Discord message or reply to a specific message id.",new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.publish or discord.send to share results in a Discord channel.","Provide channelId/channel_id and content/text.","Include attachmentUrls/attachment_urls to upload files, images, or generated assets.","Pass file paths as plain strings (e.g. Graphics/seal.svg or Voice/clip.mp3). Do NOT wrap them in <|\"| delimiters.","To mention a user, use <@user_id> in the text. Do NOT use @username \u2014 it will not ping."], null),knoxx.backend.domain.discord.tools.send_params,knoxx.backend.domain.discord.tools.discord_send_execute], 0));
knoxx.backend.domain.discord.tools.channel_messages_params = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to fetch messages from."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum number of messages to fetch (default 50, max 100)."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(100)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"before","before",-1633692388),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Fetch messages before this message ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"after","after",594996914),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Fetch messages after this message ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"around","around",-265975553),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Fetch messages around this message ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.tools.channel_messages_execute = (async function knoxx$backend$domain$discord$tools$channel_messages_execute(runtime,config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var channel_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Fetching Discord messages from channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_fetch_channel_messages_BANG_(runtime,config,channel_id,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363)),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"before","before",-1633692388)),new cljs.core.Keyword(null,"after","after",594996914),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"after","after",594996914)),new cljs.core.Keyword(null,"around","around",-265975553),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"around","around",-265975553))], null)));
var messages = (await knoxx.backend.domain.discord.tools.attach_openplanner_labels_BANG_(config,new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(result)));
var filtered = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"messages","messages",345434482),messages,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(messages)], 0));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.discord.tools.discord_messages_text((""+"Fetched "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"count","count",2139924085).cljs$core$IFn$_invoke$arity$1(filtered))+" non-bad messages from channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"."),messages),filtered);
});
knoxx.backend.domain.discord.tools.channel_messages_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.channel.messages","Discord Channel Messages","Fetch messages from a Discord channel with before/after/around cursors.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Fetch channel messages from Discord with pagination cursors when you need exact transcript context.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use this when you know the channel id and need exact message history.","Use before/after/around for precise pagination."], null),knoxx.backend.domain.discord.tools.channel_messages_params,knoxx.backend.domain.discord.tools.channel_messages_execute], 0));
knoxx.backend.domain.discord.tools.channel_scroll_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to fetch older messages from."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"oldest_seen_id","oldest_seen_id",-1348923865),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Oldest message ID already seen; fetch messages before this."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum number of older messages to fetch."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(100)], null)], null)], null)], null);
knoxx.backend.domain.discord.tools.channel_scroll_execute = (async function knoxx$backend$domain$discord$tools$channel_scroll_execute(runtime,config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var channel_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var oldest_seen_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"oldest_seen_id","oldest_seen_id",-1348923865),new cljs.core.Keyword(null,"oldestSeenId","oldestSeenId",-1356766638));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Scrolling older Discord messages in channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_scroll_channel_messages_BANG_(runtime,config,channel_id,oldest_seen_id,knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363))));
var messages = (await knoxx.backend.domain.discord.tools.attach_openplanner_labels_BANG_(config,new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(result)));
var filtered = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"messages","messages",345434482),messages,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(messages)], 0));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.discord.tools.discord_messages_text((""+"Fetched older non-bad messages before "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(oldest_seen_id)+"."),messages),filtered);
});
knoxx.backend.domain.discord.tools.channel_scroll_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.channel.scroll","Discord Channel Scroll","Scroll older channel messages by fetching messages before the oldest already-seen message id.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Scroll backwards in a Discord channel once you already know the oldest seen id.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.channel.scroll as sugar over discord.channel.messages before=oldest_seen_id.","Useful for paging backward through long histories."], null),knoxx.backend.domain.discord.tools.channel_scroll_params,knoxx.backend.domain.discord.tools.channel_scroll_execute], 0));
knoxx.backend.domain.discord.tools.dm_messages_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord user ID whose DM channel should be read."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum number of DM messages to fetch."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(100)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"before","before",-1633692388),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Fetch DM messages before this message ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.tools.dm_messages_execute = (async function knoxx$backend$domain$discord$tools$dm_messages_execute(runtime,config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var user_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"userId","userId",575594135));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Fetching Discord DM messages for user "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_fetch_dm_messages_BANG_(runtime,config,user_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363)),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"before","before",-1633692388))], null)));
var messages = (await knoxx.backend.domain.discord.tools.attach_openplanner_labels_BANG_(config,new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(result)));
var filtered = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"messages","messages",345434482),messages,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(messages)], 0));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.discord.tools.discord_messages_text((""+"Fetched "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"count","count",2139924085).cljs$core$IFn$_invoke$arity$1(filtered))+" non-bad DM messages for user "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)+"."),messages),filtered);
});
knoxx.backend.domain.discord.tools.dm_messages_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.dm.messages","Discord DM Messages","Fetch messages from the DM channel shared with a Discord user.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read DM history with a Discord user by user id.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use this when the relevant conversation is in DMs rather than a guild channel.","Provide the target user id."], null),knoxx.backend.domain.discord.tools.dm_messages_params,knoxx.backend.domain.discord.tools.dm_messages_execute], 0));
knoxx.backend.domain.discord.tools.search_params = new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"scope","scope",-439358418),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Search scope: channel or dm."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to search when scope=channel."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Discord user ID to search against when scope=dm or to filter author."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional substring query to filter messages by content."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum number of matching messages to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(100)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"before","before",-1633692388),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Fetch messages before this message ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"after","after",594996914),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Fetch messages after this message ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"since_hours","since_hours",-3911670),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Prefer matching messages within this many hours (default 168); pass a larger value to override the timeframe."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"min","min",444991522),(1)], null)], null)], null)], null);
knoxx.backend.domain.discord.tools.search_execute = (async function knoxx$backend$domain$discord$tools$search_execute(runtime,config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var scope = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"scope","scope",-439358418));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "channel";
}
})());
var channel_id = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
var user_id = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"userId","userId",575594135));
var query = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Searching Discord messages in scope "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_search_messages_BANG_(runtime,config,scope,new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"channel-id","channel-id",138191095),channel_id,new cljs.core.Keyword(null,"user-id","user-id",-206822291),user_id,new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363)),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"before","before",-1633692388)),new cljs.core.Keyword(null,"after","after",594996914),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"after","after",594996914)),new cljs.core.Keyword(null,"since-hours","since-hours",124306716),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"since_hours","since_hours",-3911670),new cljs.core.Keyword(null,"sinceHours","sinceHours",530839084))], null)));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.discord.tools.discord_messages_text((""+"Found "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"count","count",2139924085).cljs$core$IFn$_invoke$arity$1(result))+" matching Discord messages."),new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(result)),result);
});
knoxx.backend.domain.discord.tools.search_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.search","Discord Search","Search channel or DM messages by content and/or author using client-side filtering.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Search Discord messages by text and scope to find relevant discussion quickly.",new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use scope=channel with channel_id for guild channels or scope=dm with user_id for DMs.","Messages marked bad in OpenPlanner labels are never shown.","Matching good-marked messages are returned first in chronological order, then unbad messages chronologically.","The default timeframe is 168 hours; pass since_hours to override when needed.","This falls back to client-side filtering when native search is unavailable."], null),knoxx.backend.domain.discord.tools.search_params,knoxx.backend.domain.discord.tools.search_execute], 0));
knoxx.backend.domain.discord.tools.list_servers_params = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461)], null);
knoxx.backend.domain.discord.tools.list_servers_execute = (async function knoxx$backend$domain$discord$tools$list_servers_execute(runtime,_config,_tool_call_id,_params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Listing Discord servers\u2026");

var result = (await knoxx.backend.domain.discord.tools.discord_list_guilds_BANG_(runtime));
var lines = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (server){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(server))+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(server))+")");
}),new cljs.core.Keyword(null,"servers","servers",1881102005).cljs$core$IFn$_invoke$arity$1(result)));
return knoxx.backend.domain.text.tool_text_result((""+"Discord servers:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(lines)),result);
});
knoxx.backend.domain.discord.tools.list_servers_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.list.servers","Discord List Servers","List all Discord servers/guilds the bot can access.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List Discord servers before choosing channels or replying into a guild.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use this before discord.list.channels when you need discovery.","Do not guess guild ids."], null),knoxx.backend.domain.discord.tools.list_servers_params,knoxx.backend.domain.discord.tools.list_servers_execute], 0));
knoxx.backend.domain.discord.tools.guilds_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.guilds","Discord Guilds","List Discord guilds/servers the bot is in.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List Discord guilds to discover available servers.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Alias for discord.list.servers.","Use before listing channels or posting to a specific server."], null),knoxx.backend.domain.discord.tools.list_servers_params,knoxx.backend.domain.discord.tools.list_servers_execute], 0));
knoxx.backend.domain.discord.tools.list_channels_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional guild/server ID. If omitted, returns channels across all visible guilds."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.tools.list_channels_execute = (async function knoxx$backend$domain$discord$tools$list_channels_execute(runtime,_config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var guild_id = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.Keyword(null,"guildId","guildId",-559818490));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Listing Discord channels\u2026");

var result = (await knoxx.backend.domain.discord.tools.discord_list_channels_BANG_(runtime,guild_id));
var lines = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (channel){
return (""+"#"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(channel))+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel))+") guild="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel)));
}),new cljs.core.Keyword(null,"channels","channels",1132759174).cljs$core$IFn$_invoke$arity$1(result)));
return knoxx.backend.domain.text.tool_text_result((""+"Discord channels:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(lines)),result);
});
knoxx.backend.domain.discord.tools.list_channels_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.list.channels","Discord List Channels","List channels in one Discord guild or across all visible guilds.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List Discord channels to discover readable/postable targets.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["If guild_id is omitted, returns channels across all visible guilds.","Use returned channel ids with discord.channel.messages or discord.send."], null),knoxx.backend.domain.discord.tools.list_channels_params,knoxx.backend.domain.discord.tools.list_channels_execute], 0));
knoxx.backend.domain.discord.tools.channels_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord guild ID to list channels for."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.tools.channels_execute = (function knoxx$backend$domain$discord$tools$channels_execute(runtime,config,tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
return knoxx.backend.domain.discord.tools.list_channels_execute(runtime,config,tool_call_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"guildId","guildId",-559818490),new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959))], null),a,b,c);
});
knoxx.backend.domain.discord.tools.channels_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.channels","Discord Channels","List channels in a Discord guild.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List channels in a Discord guild to find the right channel for reading or posting.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Alias for discord.list.channels.","Use guildId/guild_id when you already know the server."], null),knoxx.backend.domain.discord.tools.channels_params,knoxx.backend.domain.discord.tools.channels_execute], 0));
knoxx.backend.domain.discord.tools.react_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID containing the message to react to."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord message ID to react to."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"emoji","emoji",1031230144),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Emoji to react with (e.g. \uD83D\uDC4D, \uD83C\uDF89, \uD83D\uDC80)."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.tools.react_execute = (async function knoxx$backend$domain$discord$tools$react_execute(runtime,_config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var channel_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var message_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.Keyword(null,"messageId","messageId",-260575736));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var emoji = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"emoji","emoji",1031230144));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reacting to message "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id)+" with "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(emoji)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_react_BANG_(runtime,channel_id,message_id,emoji));
return knoxx.backend.domain.text.tool_text_result((""+"Reacted with "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(emoji)+" to message "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id)),result);
});
knoxx.backend.domain.discord.tools.react_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.react","Discord React","Add an emoji reaction to a Discord message.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["React to a Discord message with an emoji.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.react to add emoji reactions to messages.","Provide channel_id, message_id, and an emoji (e.g. \uD83D\uDC4D, \uD83C\uDF89, \uD83D\uDC80)."], null),knoxx.backend.domain.discord.tools.react_params,knoxx.backend.domain.discord.tools.react_execute], 0));
knoxx.backend.domain.discord.tools.thread_create_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to create the thread in."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional message ID to create a thread from. If omitted, creates a standalone thread in the channel."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Name of the thread (max 100 chars)."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auto_archive_duration","auto_archive_duration",-1199207961),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Auto-archive duration in minutes: 60, 1440 (default), 4320, or 10080."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null)], null);
knoxx.backend.domain.discord.tools.thread_create_execute = (async function knoxx$backend$domain$discord$tools$thread_create_execute(runtime,_config,_tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})());
var channel_id = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var message_id = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"message_id","message_id",663757010),new cljs.core.Keyword(null,"messageId","messageId",-260575736));
var name = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"name","name",1843675177));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var auto_archive = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"auto_archive_duration","auto_archive_duration",-1199207961),new cljs.core.Keyword(null,"autoArchiveDuration","autoArchiveDuration",659831726));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Creating thread '"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"' in channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"\u2026"));

var result = (await knoxx.backend.domain.discord.tools.discord_thread_create_BANG_(runtime,channel_id,message_id,name,auto_archive));
return knoxx.backend.domain.text.tool_text_result((""+"Created thread "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"threadId","threadId",-440699805).cljs$core$IFn$_invoke$arity$1(result))+" named '"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"'"),result);
});
knoxx.backend.domain.discord.tools.thread_create_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.thread.create","Discord Thread Create","Create a Discord thread from a message or in a channel.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Create a thread to spin off a conversation.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.thread.create to start a thread from a message or in a channel.","Provide channel_id and a name. Optionally pass message_id to create a thread from that message.","After creating a thread, use the returned threadId as channel_id with discord.send to post in it."], null),knoxx.backend.domain.discord.tools.thread_create_params,knoxx.backend.domain.discord.tools.thread_create_execute], 0));
knoxx.backend.domain.discord.tools.publish_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to post the message to."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Message content to post to the Discord channel."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"attachment_urls","attachment_urls",178655562),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional attachment sources to upload: HTTP(S) URLs, data URLs, absolute file paths, or workspace-relative paths (e.g. sandbox output files, generated images)."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null)], null);
knoxx.backend.domain.discord.tools.publish_execute = (function knoxx$backend$domain$discord$tools$publish_execute(runtime,config,tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
return knoxx.backend.domain.discord.tools.discord_send_execute(runtime,config,tool_call_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),(function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"text","text",-1790561697),(function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"text","text",-1790561697));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"attachment_urls","attachment_urls",178655562),(function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"attachment_urls","attachment_urls",178655562),new cljs.core.Keyword(null,"attachmentUrls","attachmentUrls",1857227267));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()], null),a,b,c);
});
knoxx.backend.domain.discord.tools.publish_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.publish","Discord Publish","Post a message to a Discord channel using the configured Knoxx Discord bot.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Post updates, summaries, or notifications to Discord channels.",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.publish or discord.send to share results in a Discord channel.","Provide channelId/channel_id and content/text.","Include attachmentUrls/attachment_urls to upload files, images, or generated assets.","To mention a user, use <@user_id> in the text. Do NOT use @username \u2014 it will not ping."], null),knoxx.backend.domain.discord.tools.publish_params,knoxx.backend.domain.discord.tools.publish_execute], 0));
knoxx.backend.domain.discord.tools.read_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord channel ID to read messages from."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum number of messages to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(100)], null)], null)], null)], null);
knoxx.backend.domain.discord.tools.read_execute = (function knoxx$backend$domain$discord$tools$read_execute(runtime,config,tool_call_id,params,a,b,c){
var params__$1 = knoxx.backend.domain.discord.tools.tool_params(params);
return knoxx.backend.domain.discord.tools.channel_messages_execute(runtime,config,tool_call_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),(function (){var or__5162__auto__ = knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$3(params__$1,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.Keyword(null,"channelId","channelId",2082229448));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.discord.tools.pget.cljs$core$IFn$_invoke$arity$2(params__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363))], null),a,b,c);
});
knoxx.backend.domain.discord.tools.read_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.read","Discord Read","Read recent messages from a Discord channel.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read recent messages from a Discord channel to understand context.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.read as a simple alias for discord.channel.messages.","For pagination or cursors, use discord.channel.messages or discord.channel.scroll directly."], null),knoxx.backend.domain.discord.tools.read_params,knoxx.backend.domain.discord.tools.read_execute], 0));
knoxx.backend.domain.discord.tools.create_discord_custom_tools = (function knoxx$backend$domain$discord$tools$create_discord_custom_tools(var_args){
var G__28605 = arguments.length;
switch (G__28605) {
case 2:
return knoxx.backend.domain.discord.tools.create_discord_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.discord.tools.create_discord_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.tools.create_discord_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.discord.tools.create_discord_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.discord.tools.create_discord_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
return knoxx.backend.extern.discord.tool_array(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 13, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("discord.publish"))?knoxx.backend.domain.discord.tools.publish_tool(runtime,config):null),((allowed_QMARK_("discord.send"))?knoxx.backend.domain.discord.tools.discord_send_tool(runtime,config):null),((allowed_QMARK_("discord.react"))?knoxx.backend.domain.discord.tools.react_tool(runtime,config):null),((allowed_QMARK_("discord.thread.create"))?knoxx.backend.domain.discord.tools.thread_create_tool(runtime,config):null),((allowed_QMARK_("discord.read"))?knoxx.backend.domain.discord.tools.read_tool(runtime,config):null),((allowed_QMARK_("discord.channel.messages"))?knoxx.backend.domain.discord.tools.channel_messages_tool(runtime,config):null),((allowed_QMARK_("discord.channel.scroll"))?knoxx.backend.domain.discord.tools.channel_scroll_tool(runtime,config):null),((allowed_QMARK_("discord.dm.messages"))?knoxx.backend.domain.discord.tools.dm_messages_tool(runtime,config):null),((allowed_QMARK_("discord.search"))?knoxx.backend.domain.discord.tools.search_tool(runtime,config):null),((allowed_QMARK_("discord.guilds"))?knoxx.backend.domain.discord.tools.guilds_tool(runtime,config):null),((allowed_QMARK_("discord.list.servers"))?knoxx.backend.domain.discord.tools.list_servers_tool(runtime,config):null),((allowed_QMARK_("discord.channels"))?knoxx.backend.domain.discord.tools.channels_tool(runtime,config):null),((allowed_QMARK_("discord.list.channels"))?knoxx.backend.domain.discord.tools.list_channels_tool(runtime,config):null)], null)));
}));

(knoxx.backend.domain.discord.tools.create_discord_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.discord.tools.js.map
