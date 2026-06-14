import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.discord.gateway.js";
import "./knoxx.backend.domain.discord.rest_client.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.domain.label.quality.js";
import "./knoxx.backend.infra.db.policy.js";
goog.provide('knoxx.backend.domain.discord.source');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.discord !== 'undefined') && (typeof knoxx.backend.domain.discord.source !== 'undefined') && (typeof knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.domain.discord.source.bot_token = (function knoxx$backend$domain$discord$source$bot_token(config){
return new cljs.core.Keyword(null,"discord-bot-token","discord-bot-token",1224757550).cljs$core$IFn$_invoke$arity$1(config);
});
knoxx.backend.domain.discord.source.manager_active_QMARK_ = (function knoxx$backend$domain$discord$source$manager_active_QMARK_(manager){
if(cljs.core.truth_(manager)){
var status = manager.status();
return cljs.core.boolean$((function (){var or__5162__auto__ = (status["ready"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (status["started"]);
}
})());
} else {
return null;
}
});
knoxx.backend.domain.discord.source.active_gateway_entries = (function knoxx$backend$domain$discord$source$active_gateway_entries(){
var actor_entries = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__29971){
var vec__29973 = p__29971;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29973,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29973,(1),null);
return knoxx.backend.domain.discord.source.manager_active_QMARK_(manager);
}),knoxx.backend.domain.discord.gateway.gateway_managers()));
if(cljs.core.seq(actor_entries)){
return actor_entries;
} else {
var temp__5825__auto__ = knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$0();
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
if(cljs.core.truth_(knoxx.backend.domain.discord.source.manager_active_QMARK_(manager))){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null,manager], null)], null);
} else {
return null;
}
} else {
return null;
}
}
});
knoxx.backend.domain.discord.source.active_QMARK_ = (function knoxx$backend$domain$discord$source$active_QMARK_(){
return cljs.core.boolean$(cljs.core.seq(knoxx.backend.domain.discord.source.active_gateway_entries()));
});
knoxx.backend.domain.discord.source.observe_boundary_BANG_ = (function knoxx$backend$domain$discord$source$observe_boundary_BANG_(boundary,context,f){
return knoxx.backend.domain.error_observatory.call_observed_BANG_(boundary,context,f);
});
knoxx.backend.domain.discord.source.gateway_user_id = (function knoxx$backend$domain$discord$source$gateway_user_id(){
var or__5162__auto__ = cljs.core.some((function (p__30004){
var vec__30005 = p__30004;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30005,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30005,(1),null);
var status = manager.status();
var G__30016 = (status["userId"]);
var G__30016__$1 = (((G__30016 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30016)));
var G__30016__$2 = (((G__30016__$1 == null))?null:clojure.string.trim(G__30016__$1));
if((G__30016__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30016__$2);
}
}),knoxx.backend.domain.discord.source.active_gateway_entries());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var temp__5825__auto__ = knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$0();
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
var status = manager.status();
var G__30022 = (status["userId"]);
var G__30022__$1 = (((G__30022 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30022)));
var G__30022__$2 = (((G__30022__$1 == null))?null:clojure.string.trim(G__30022__$1));
if((G__30022__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30022__$2);
}
} else {
return null;
}
}
});
knoxx.backend.domain.discord.source.message_role_ids = (function knoxx$backend$domain$discord$source$message_role_ids(msg){
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"member","member",-2012020816),new cljs.core.Keyword(null,"roles","roles",143379530)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
});
knoxx.backend.domain.discord.source.map_message = (function knoxx$backend$domain$discord$source$map_message(msg){
var author = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"authorId","authorId",-1664154012),new cljs.core.Keyword(null,"guildId","guildId",-559818490),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"channelId","channelId",2082229448),new cljs.core.Keyword(null,"attachments","attachments",-1535547830),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965),new cljs.core.Keyword(null,"authorIsBot","authorIsBot",-1582823121),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"authorRoleIds","authorRoleIds",886933174),new cljs.core.Keyword(null,"embeds","embeds",833349080),new cljs.core.Keyword(null,"timestamp","timestamp",579478971)],[(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channel_id","channel_id",1180018383).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})(),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (attachment){
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
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"username","username",1605666410).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})(),cljs.core.boolean$(new cljs.core.Keyword(null,"bot","bot",-950896508).cljs$core$IFn$_invoke$arity$1(author)),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(msg),knoxx.backend.domain.discord.source.message_role_ids(msg),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (embed){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(embed),new cljs.core.Keyword(null,"description","description",-1428560544),new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(embed),new cljs.core.Keyword(null,"url","url",276297046),new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(embed)], null);
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"embeds","embeds",833349080).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()]);
});
knoxx.backend.domain.discord.source.sort_newest_first = (function knoxx$backend$domain$discord$source$sort_newest_first(messages){
return cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"timestamp","timestamp",579478971),(function (p1__30071_SHARP_,p2__30070_SHARP_){
return cljs.core.compare(p2__30070_SHARP_,p1__30071_SHARP_);
}),messages);
});
knoxx.backend.domain.discord.source.record_id = (function knoxx$backend$domain$discord$source$record_id(message){
return (""+"discord:message:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(message))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message)));
});
knoxx.backend.domain.discord.source.label_for_record_id = (function knoxx$backend$domain$discord$source$label_for_record_id(labels,rid){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(labels,rid);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(labels,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(rid));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
});
knoxx.backend.domain.discord.source.attach_openplanner_labels_BANG_ = (async function knoxx$backend$domain$discord$source$attach_openplanner_labels_BANG_(config,messages){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
if(((cljs.core.empty_QMARK_(messages)) || (cljs.core.not(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))))){
return knoxx.backend.domain.label.quality.good_first_then_not_bad(messages);
} else {
try{var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.source.record_id,messages);
var labels = new cljs.core.Keyword(null,"labels","labels",-626734591).cljs$core$IFn$_invoke$arity$1((await knoxx.backend.infra.clients.openplanner.record_labels_BANG_(client,ids)));
return knoxx.backend.domain.label.quality.good_first_then_not_bad(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (message){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(message,new cljs.core.Keyword(null,"openplannerLabels","openplannerLabels",-1625330291),knoxx.backend.domain.discord.source.label_for_record_id(labels,knoxx.backend.domain.discord.source.record_id(message)));
}),messages));
}catch (e30077){var error = e30077;
console.error("[event runtimes.discord] OpenPlanner label lookup failed; failing closed to avoid surfacing crossed/bad Discord context",error);

return cljs.core.PersistentVector.EMPTY;
}}
});
knoxx.backend.domain.discord.source.fetch_channel_from_gateway_entries_BANG_ = (async function knoxx$backend$domain$discord$source$fetch_channel_from_gateway_entries_BANG_(entries,channel_id,opts){
var temp__5823__auto__ = cljs.core.first(entries);
if(cljs.core.truth_(temp__5823__auto__)){
var vec__30080 = temp__5823__auto__;
var actor_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30080,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30080,(1),null);
try{return (await manager.fetchChannelMessages(channel_id,opts));
}catch (e30084){var err = e30084;
knoxx.backend.domain.error_observatory.log_warning_BANG_(new cljs.core.Keyword("discord-source","fetch-channel-fallback","discord-source/fetch-channel-fallback",-1751453587),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("actor","id","actor/id",-1462607809),actor_id,new cljs.core.Keyword("channel","id","channel/id",-1856754351),channel_id,new cljs.core.Keyword(null,"error","error",-978969032),knoxx.backend.domain.error_observatory.error_message(err)], null));

return (await (await (async function (){var G__30085 = cljs.core.rest(entries);
var G__30086 = channel_id;
var G__30087 = opts;
return (knoxx.backend.domain.discord.source.fetch_channel_from_gateway_entries_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.discord.source.fetch_channel_from_gateway_entries_BANG_.cljs$core$IFn$_invoke$arity$3(G__30085,G__30086,G__30087) : knoxx.backend.domain.discord.source.fetch_channel_from_gateway_entries_BANG_.call(null,G__30085,G__30086,G__30087));
})()));
}} else {
return Promise.reject((new Error((""+"No active Discord actor gateway can read channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)))));
}
});
knoxx.backend.domain.discord.source.read_channel_BANG_ = (async function knoxx$backend$domain$discord$source$read_channel_BANG_(config,channel_id,limit){
var temp__5823__auto__ = cljs.core.seq(knoxx.backend.domain.discord.source.active_gateway_entries());
if(temp__5823__auto__){
var entries = temp__5823__auto__;
var raw = (await knoxx.backend.domain.discord.source.fetch_channel_from_gateway_entries_BANG_(entries,channel_id,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(await (async function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})())))], null))));
var messages = cljs.core.vec(knoxx.backend.domain.discord.source.sort_newest_first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(raw,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))));
return (await knoxx.backend.domain.discord.source.attach_openplanner_labels_BANG_(config,messages));
} else {
var token = knoxx.backend.domain.discord.source.bot_token(config);
if(clojure.string.blank_QMARK_(token)){
return Promise.reject((new Error("Discord bot token not configured")));
} else {
var payload = (await knoxx.backend.domain.discord.rest_client.channel_messages_BANG_(knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$1(token),channel_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(await (async function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})())))], null)));
var messages = cljs.core.vec(knoxx.backend.domain.discord.source.sort_newest_first(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.source.map_message,(await (async function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
return (await knoxx.backend.domain.discord.source.attach_openplanner_labels_BANG_(config,messages));
}
}
});
knoxx.backend.domain.discord.source.list_channels_BANG_ = (async function knoxx$backend$domain$discord$source$list_channels_BANG_(){
var entries = knoxx.backend.domain.discord.source.active_gateway_entries();
if(cljs.core.seq(entries)){
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((async function (p__30109){
var vec__30110 = p__30109;
var actor_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30110,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30110,(1),null);
try{return (await manager.listChannels(null));
}catch (e30115){var err = e30115;
knoxx.backend.domain.error_observatory.log_warning_BANG_(new cljs.core.Keyword("discord-source","list-channels-failed","discord-source/list-channels-failed",-660709271),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("actor","id","actor/id",-1462607809),actor_id,new cljs.core.Keyword(null,"error","error",-978969032),knoxx.backend.domain.error_observatory.error_message(err)], null));

return [];
}}),entries))));
return cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.first,cljs.core.vals(cljs.core.group_by(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__30106_SHARP_){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(p1__30106_SHARP_,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__30105_SHARP_){
return Array.from(p1__30105_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([Array.from(results)], 0)))))));
} else {
var or__5162__auto__ = knoxx.backend.domain.discord.gateway.list_channels.cljs$core$IFn$_invoke$arity$0();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return Promise.resolve([]);
}
}
});
knoxx.backend.domain.discord.source.resolve_channel_ids_BANG_ = (async function knoxx$backend$domain$discord$source$resolve_channel_ids_BANG_(p__30128){
var map__30129 = p__30128;
var map__30129__$1 = cljs.core.__destructure_map(map__30129);
var explicit_channels = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30129__$1,new cljs.core.Keyword(null,"explicit-channels","explicit-channels",1984056567));
var guild_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30129__$1,new cljs.core.Keyword(null,"guild-ids","guild-ids",914840032));
if(cljs.core.seq(guild_ids)){
var channels = (await knoxx.backend.domain.discord.source.list_channels_BANG_());
var rows = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(channels,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var guild_id_set = cljs.core.set(guild_ids);
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (channel){
return cljs.core.contains_QMARK_(guild_id_set,new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(channel));
}),rows))));
} else {
return Promise.resolve(explicit_channels);

}
});
knoxx.backend.domain.discord.source.message_match_kind = (function knoxx$backend$domain$discord$source$message_match_kind(p__30133){
var map__30134 = p__30133;
var map__30134__$1 = cljs.core.__destructure_map(map__30134);
var bot_user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30134__$1,new cljs.core.Keyword(null,"bot-user-id","bot-user-id",1703682999));
var content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30134__$1,new cljs.core.Keyword(null,"content","content",15833224));
var keyword_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30134__$1,new cljs.core.Keyword(null,"keyword?","keyword?",277265542));
var created_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30134__$1,new cljs.core.Keyword(null,"created?","created?",850508195));
var match_all_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30134__$1,new cljs.core.Keyword(null,"match-all?","match-all?",-1394896600));
var text = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(content)+""));
var mention_QMARK_ = (function (){var and__5160__auto__ = bot_user_id;
if(cljs.core.truth_(and__5160__auto__)){
return ((clojure.string.includes_QMARK_(text,(""+"<@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(bot_user_id)+">"))) || (clojure.string.includes_QMARK_(text,(""+"<@!"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(bot_user_id)+">"))));
} else {
return and__5160__auto__;
}
})();
if(cljs.core.truth_(mention_QMARK_)){
return "discord.message.mention";
} else {
if(cljs.core.truth_(keyword_QMARK_)){
return "discord.message.keyword";
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = created_QMARK_;
if(cljs.core.truth_(and__5160__auto__)){
return match_all_QMARK_;
} else {
return and__5160__auto__;
}
})())){
return "discord.message.created";
} else {
return null;

}
}
}
});
knoxx.backend.domain.discord.source.execute_patrol_BANG_ = (function knoxx$backend$domain$discord$source$execute_patrol_BANG_(p__30149){
var map__30150 = p__30149;
var map__30150__$1 = cljs.core.__destructure_map(map__30150);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"config","config",994861415));
var channel_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"channel-ids","channel-ids",780502738));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var unseen_messages = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"unseen-messages","unseen-messages",-938745644));
var remember_latest_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"remember-latest!","remember-latest!",-903750029));
var match_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"match-kind","match-kind",83311455));
var dispatch_message_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30150__$1,new cljs.core.Keyword(null,"dispatch-message!","dispatch-message!",-1354158307));
if(knoxx.backend.domain.discord.source.active_QMARK_()){
return Promise.resolve(null);
} else {
if(cljs.core.seq(channel_ids)){
return Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((async function (channel_id){
try{var messages = (await knoxx.backend.domain.discord.source.read_channel_BANG_(config,channel_id,limit));
var fresh = (unseen_messages.cljs$core$IFn$_invoke$arity$2 ? unseen_messages.cljs$core$IFn$_invoke$arity$2(channel_id,messages) : unseen_messages.call(null,channel_id,messages));
var seq__30158_30313 = cljs.core.seq(fresh);
var chunk__30159_30314 = null;
var count__30160_30315 = (0);
var i__30161_30316 = (0);
while(true){
if((i__30161_30316 < count__30160_30315)){
var message_30317 = chunk__30159_30314.cljs$core$IIndexed$_nth$arity$2(null,i__30161_30316);
var temp__5825__auto___30318 = (match_kind.cljs$core$IFn$_invoke$arity$1 ? match_kind.cljs$core$IFn$_invoke$arity$1(message_30317) : match_kind.call(null,message_30317));
if(cljs.core.truth_(temp__5825__auto___30318)){
var kind_30320 = temp__5825__auto___30318;
knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","patrol-dispatch","discord-source/patrol-dispatch",-723809926),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("channel","id","channel/id",-1856754351),channel_id,new cljs.core.Keyword("event","type","event/type",1532247862),kind_30320,new cljs.core.Keyword("message","id","message/id",1689496141),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message_30317)], null),((function (seq__30158_30313,chunk__30159_30314,count__30160_30315,i__30161_30316,kind_30320,temp__5825__auto___30318,message_30317,messages,fresh,map__30150,map__30150__$1,config,channel_ids,limit,unseen_messages,remember_latest_BANG_,match_kind,dispatch_message_BANG_){
return (function (){
return (dispatch_message_BANG_.cljs$core$IFn$_invoke$arity$2 ? dispatch_message_BANG_.cljs$core$IFn$_invoke$arity$2(message_30317,kind_30320) : dispatch_message_BANG_.call(null,message_30317,kind_30320));
});})(seq__30158_30313,chunk__30159_30314,count__30160_30315,i__30161_30316,kind_30320,temp__5825__auto___30318,message_30317,messages,fresh,map__30150,map__30150__$1,config,channel_ids,limit,unseen_messages,remember_latest_BANG_,match_kind,dispatch_message_BANG_))
);
} else {
}


var G__30321 = seq__30158_30313;
var G__30322 = chunk__30159_30314;
var G__30323 = count__30160_30315;
var G__30324 = (i__30161_30316 + (1));
seq__30158_30313 = G__30321;
chunk__30159_30314 = G__30322;
count__30160_30315 = G__30323;
i__30161_30316 = G__30324;
continue;
} else {
var temp__5825__auto___30326 = cljs.core.seq(seq__30158_30313);
if(temp__5825__auto___30326){
var seq__30158_30327__$1 = temp__5825__auto___30326;
if(cljs.core.chunked_seq_QMARK_(seq__30158_30327__$1)){
var c__5694__auto___30328 = cljs.core.chunk_first(seq__30158_30327__$1);
var G__30329 = cljs.core.chunk_rest(seq__30158_30327__$1);
var G__30330 = c__5694__auto___30328;
var G__30331 = cljs.core.count(c__5694__auto___30328);
var G__30332 = (0);
seq__30158_30313 = G__30329;
chunk__30159_30314 = G__30330;
count__30160_30315 = G__30331;
i__30161_30316 = G__30332;
continue;
} else {
var message_30333 = cljs.core.first(seq__30158_30327__$1);
var temp__5825__auto___30334__$1 = (match_kind.cljs$core$IFn$_invoke$arity$1 ? match_kind.cljs$core$IFn$_invoke$arity$1(message_30333) : match_kind.call(null,message_30333));
if(cljs.core.truth_(temp__5825__auto___30334__$1)){
var kind_30335 = temp__5825__auto___30334__$1;
knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","patrol-dispatch","discord-source/patrol-dispatch",-723809926),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("channel","id","channel/id",-1856754351),channel_id,new cljs.core.Keyword("event","type","event/type",1532247862),kind_30335,new cljs.core.Keyword("message","id","message/id",1689496141),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(message_30333)], null),((function (seq__30158_30313,chunk__30159_30314,count__30160_30315,i__30161_30316,kind_30335,temp__5825__auto___30334__$1,message_30333,seq__30158_30327__$1,temp__5825__auto___30326,messages,fresh,map__30150,map__30150__$1,config,channel_ids,limit,unseen_messages,remember_latest_BANG_,match_kind,dispatch_message_BANG_){
return (function (){
return (dispatch_message_BANG_.cljs$core$IFn$_invoke$arity$2 ? dispatch_message_BANG_.cljs$core$IFn$_invoke$arity$2(message_30333,kind_30335) : dispatch_message_BANG_.call(null,message_30333,kind_30335));
});})(seq__30158_30313,chunk__30159_30314,count__30160_30315,i__30161_30316,kind_30335,temp__5825__auto___30334__$1,message_30333,seq__30158_30327__$1,temp__5825__auto___30326,messages,fresh,map__30150,map__30150__$1,config,channel_ids,limit,unseen_messages,remember_latest_BANG_,match_kind,dispatch_message_BANG_))
);
} else {
}


var G__30340 = cljs.core.next(seq__30158_30327__$1);
var G__30341 = null;
var G__30342 = (0);
var G__30343 = (0);
seq__30158_30313 = G__30340;
chunk__30159_30314 = G__30341;
count__30160_30315 = G__30342;
i__30161_30316 = G__30343;
continue;
}
} else {
}
}
break;
}

(remember_latest_BANG_.cljs$core$IFn$_invoke$arity$2 ? remember_latest_BANG_.cljs$core$IFn$_invoke$arity$2(channel_id,messages) : remember_latest_BANG_.call(null,channel_id,messages));

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"fetched","fetched",1610343604),cljs.core.count(messages),new cljs.core.Keyword(null,"fresh","fresh",-1182453442),cljs.core.count(fresh)], null);
}catch (e30152){var err = e30152;
knoxx.backend.domain.error_observatory.log_error_BANG_(new cljs.core.Keyword("discord-source","patrol-channel","discord-source/patrol-channel",601599672),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("channel","id","channel/id",-1856754351),channel_id], null),err);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"error","error",-978969032),true], null);
}}),channel_ids)));
} else {
return Promise.resolve(null);
}
}
});
knoxx.backend.domain.discord.source.summarize_channel = (function knoxx$backend$domain$discord$source$summarize_channel(channel_id,messages){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (message){
var attachments = new cljs.core.Keyword(null,"attachments","attachments",-1535547830).cljs$core$IFn$_invoke$arity$1(message);
var attachment_text = ((cljs.core.seq(attachments))?(""+" attachments="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (a){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(a))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(a))?(""+" <"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(a))+">"):null)));
}),attachments)))):null);
return (""+"["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"] <"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(message))+" (id:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(message))+")> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.subs.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message),(0),cljs.core.min.cljs$core$IFn$_invoke$arity$2((180),cljs.core.count(new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message)))))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = attachment_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
}),cljs.core.take.cljs$core$IFn$_invoke$arity$2((8),cljs.core.remove.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"authorIsBot","authorIsBot",-1582823121),messages))));
});
knoxx.backend.domain.discord.source.image_attachments = (function knoxx$backend$domain$discord$source$image_attachments(rows){
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2((8),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (attachment){
var G__30212 = new cljs.core.Keyword(null,"contentType","contentType",-1462509576).cljs$core$IFn$_invoke$arity$1(attachment);
var G__30212__$1 = (((G__30212 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30212)));
var G__30212__$2 = (((G__30212__$1 == null))?null:clojure.string.lower_case(G__30212__$1));
if((G__30212__$2 == null)){
return null;
} else {
return clojure.string.starts_with_QMARK_(G__30212__$2,"image/");
}
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"url","url",276297046),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p__30216){
var map__30217 = p__30216;
var map__30217__$1 = cljs.core.__destructure_map(map__30217);
var messages = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30217__$1,new cljs.core.Keyword(null,"messages","messages",345434482));
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"attachments","attachments",-1535547830),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([messages], 0));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([rows], 0))))));
});
knoxx.backend.domain.discord.source.execute_synthesis_BANG_ = (async function knoxx$backend$domain$discord$source$execute_synthesis_BANG_(p__30220){
var map__30221 = p__30220;
var map__30221__$1 = cljs.core.__destructure_map(map__30221);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30221__$1,new cljs.core.Keyword(null,"config","config",994861415));
var channel_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30221__$1,new cljs.core.Keyword(null,"channel-ids","channel-ids",780502738));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30221__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var dispatch_summary_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30221__$1,new cljs.core.Keyword(null,"dispatch-summary!","dispatch-summary!",455883021));
if(cljs.core.not(cljs.core.seq(channel_ids))){
return Promise.resolve(null);
} else {
var fetch_row_BANG_ = (async function (channel_id){
try{var messages = (await knoxx.backend.domain.discord.source.read_channel_BANG_(config,channel_id,limit));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"messages","messages",345434482),messages], null);
}catch (e30229){var err = e30229;
knoxx.backend.domain.error_observatory.log_warning_BANG_(new cljs.core.Keyword("discord-source","synthesis-channel-empty","discord-source/synthesis-channel-empty",978407142),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("channel","id","channel/id",-1856754351),channel_id,new cljs.core.Keyword(null,"error","error",-978969032),knoxx.backend.domain.error_observatory.error_message(err)], null));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"messages","messages",345434482),cljs.core.PersistentVector.EMPTY], null);
}});
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(fetch_row_BANG_,channel_ids))));
var G__30247 = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
return (dispatch_summary_BANG_.cljs$core$IFn$_invoke$arity$1 ? dispatch_summary_BANG_.cljs$core$IFn$_invoke$arity$1(G__30247) : dispatch_summary_BANG_.call(null,G__30247));
}
});
knoxx.backend.domain.discord.source.bind_gateways_BANG_ = (async function knoxx$backend$domain$discord$source$bind_gateways_BANG_(p__30256){
var map__30257 = p__30256;
var map__30257__$1 = cljs.core.__destructure_map(map__30257);
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30257__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var on_message_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30257__$1,new cljs.core.Keyword(null,"on-message!","on-message!",-607128138));
var on_voice_state_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30257__$1,new cljs.core.Keyword(null,"on-voice-state!","on-voice-state!",2001605581));
var temp__5825__auto___30360 = cljs.core.deref(knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_);
if(cljs.core.truth_(temp__5825__auto___30360)){
var unsubscribe_30361 = temp__5825__auto___30360;
(unsubscribe_30361.cljs$core$IFn$_invoke$arity$0 ? unsubscribe_30361.cljs$core$IFn$_invoke$arity$0() : unsubscribe_30361.call(null));

cljs.core.reset_BANG_(knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_,null);
} else {
}

if(cljs.core.truth_(policy_db)){
try{var result = (await knoxx.backend.infra.db.policy.list_actor_credentials_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_db),"discord_bot"));
var _started = (await knoxx.backend.domain.discord.gateway.start_actor_gateways_BANG_((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"credentials","credentials",1373178854).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
var managers = knoxx.backend.domain.discord.gateway.gateway_managers();
var _ = console.log("[discord-source] binding gateways for actors:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.keys(managers)], 0)));
var unsubscribes = cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p__30269){
var vec__30270 = p__30269;
var actor_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30270,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30270,(1),null);
var status = manager.status();
var bot_user_id = (function (){var G__30273 = (status["userId"]);
var G__30273__$1 = (((G__30273 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30273)));
var G__30273__$2 = (((G__30273__$1 == null))?null:clojure.string.trim(G__30273__$1));
if((G__30273__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30273__$2);
}
})();
var ___$1 = console.log("[discord-source] binding actor:",actor_id,"bot:",bot_user_id);
var msg_unsub = manager.onMessage((function (mapped,_raw){
var msg = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(mapped,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"gatewayActorId","gatewayActorId",1232391533),actor_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"gatewayBotUserId","gatewayBotUserId",-989125696),bot_user_id], 0));
return knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","gateway-message-dispatch","discord-source/gateway-message-dispatch",-998344578),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("actor","id","actor/id",-1462607809),actor_id,new cljs.core.Keyword("bot","user-id","bot/user-id",-206778826),bot_user_id,new cljs.core.Keyword("message","id","message/id",1689496141),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(msg),new cljs.core.Keyword("channel","id","channel/id",-1856754351),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(msg)], null),(function (){
return (on_message_BANG_.cljs$core$IFn$_invoke$arity$1 ? on_message_BANG_.cljs$core$IFn$_invoke$arity$1(msg) : on_message_BANG_.call(null,msg));
}));
}));
var voice_unsub = manager.onVoiceStateUpdate((function (mapped,_old,_new){
var state = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(mapped,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"gatewayActorId","gatewayActorId",1232391533),actor_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"gatewayBotUserId","gatewayBotUserId",-989125696),bot_user_id], 0));
return knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","gateway-voice-state-dispatch","discord-source/gateway-voice-state-dispatch",1550173529),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("actor","id","actor/id",-1462607809),actor_id,new cljs.core.Keyword("bot","user-id","bot/user-id",-206778826),bot_user_id,new cljs.core.Keyword("user","id","user/id",-1375756663),new cljs.core.Keyword(null,"userId","userId",575594135).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword("channel","id","channel/id",-1856754351),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(state)], null),(function (){
return (on_voice_state_BANG_.cljs$core$IFn$_invoke$arity$1 ? on_voice_state_BANG_.cljs$core$IFn$_invoke$arity$1(state) : on_voice_state_BANG_.call(null,state));
}));
}));
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [msg_unsub,voice_unsub], null);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([managers], 0)));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[event runtimes] bound",(cljs.core.count(unsubscribes) / (2)),"Discord actor gateway(s)"], 0));

return cljs.core.reset_BANG_(knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_,(function (){
var seq__30282 = cljs.core.seq(unsubscribes);
var chunk__30283 = null;
var count__30284 = (0);
var i__30285 = (0);
while(true){
if((i__30285 < count__30284)){
var unsubscribe = chunk__30283.cljs$core$IIndexed$_nth$arity$2(null,i__30285);
knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","gateway-unsubscribe","discord-source/gateway-unsubscribe",413668417),cljs.core.PersistentArrayMap.EMPTY,unsubscribe);


var G__30368 = seq__30282;
var G__30369 = chunk__30283;
var G__30370 = count__30284;
var G__30371 = (i__30285 + (1));
seq__30282 = G__30368;
chunk__30283 = G__30369;
count__30284 = G__30370;
i__30285 = G__30371;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__30282);
if(temp__5825__auto__){
var seq__30282__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__30282__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__30282__$1);
var G__30372 = cljs.core.chunk_rest(seq__30282__$1);
var G__30373 = c__5694__auto__;
var G__30374 = cljs.core.count(c__5694__auto__);
var G__30375 = (0);
seq__30282 = G__30372;
chunk__30283 = G__30373;
count__30284 = G__30374;
i__30285 = G__30375;
continue;
} else {
var unsubscribe = cljs.core.first(seq__30282__$1);
knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","gateway-unsubscribe","discord-source/gateway-unsubscribe",413668417),cljs.core.PersistentArrayMap.EMPTY,unsubscribe);


var G__30376 = cljs.core.next(seq__30282__$1);
var G__30377 = null;
var G__30378 = (0);
var G__30379 = (0);
seq__30282 = G__30376;
chunk__30283 = G__30377;
count__30284 = G__30378;
i__30285 = G__30379;
continue;
}
} else {
return null;
}
}
break;
}
}));
}catch (e30260){var err = e30260;
knoxx.backend.domain.error_observatory.log_error_BANG_(new cljs.core.Keyword("discord-source","bind-gateways","discord-source/bind-gateways",-165521095),cljs.core.PersistentArrayMap.EMPTY,err);

return null;
}} else {
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[event runtimes] policy DB unavailable; Discord actor gateways not bound"], 0));
}
});
knoxx.backend.domain.discord.source.stop_BANG_ = (function knoxx$backend$domain$discord$source$stop_BANG_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var unsubscribe = temp__5825__auto__;
knoxx.backend.domain.discord.source.observe_boundary_BANG_(new cljs.core.Keyword("discord-source","stop-unsubscribe","discord-source/stop-unsubscribe",2096535355),cljs.core.PersistentArrayMap.EMPTY,unsubscribe);

return cljs.core.reset_BANG_(knoxx.backend.domain.discord.source.gateway_unsubscribe_STAR_,null);
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.domain.discord.source.js.map
