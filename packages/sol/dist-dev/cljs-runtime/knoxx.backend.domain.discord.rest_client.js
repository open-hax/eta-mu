import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.discord.rest_client');

/**
 * @interface
 */
knoxx.backend.domain.discord.rest_client.IDiscordRestClient = function(){};

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$channel_messages_BANG_$dyn_32801 = (function (client,channel_id,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.channel_messages_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,channel_id,opts) : m__5520__auto__.call(null,client,channel_id,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.channel_messages_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,channel_id,opts) : m__5518__auto__.call(null,client,channel_id,opts));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.channel-messages!",client);
}
}
});
/**
 * Fetch channel messages. opts may include :limit, :before, :after, :around.
 */
knoxx.backend.domain.discord.rest_client.channel_messages_BANG_ = (function knoxx$backend$domain$discord$rest_client$channel_messages_BANG_(client,channel_id,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$channel_messages_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$channel_messages_BANG_$arity$3(client,channel_id,opts);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$channel_messages_BANG_$dyn_32801(client,channel_id,opts);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$current_user_guilds_BANG_$dyn_32805 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.current_user_guilds_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.current_user_guilds_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.current-user-guilds!",client);
}
}
});
/**
 * List guilds for the authenticated bot user.
 */
knoxx.backend.domain.discord.rest_client.current_user_guilds_BANG_ = (function knoxx$backend$domain$discord$rest_client$current_user_guilds_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$current_user_guilds_BANG_$arity$1 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$current_user_guilds_BANG_$arity$1(client);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$current_user_guilds_BANG_$dyn_32805(client);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$guild_channels_BANG_$dyn_32807 = (function (client,guild_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.guild_channels_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,guild_id) : m__5520__auto__.call(null,client,guild_id));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.guild_channels_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,guild_id) : m__5518__auto__.call(null,client,guild_id));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.guild-channels!",client);
}
}
});
/**
 * List channels for a guild.
 */
knoxx.backend.domain.discord.rest_client.guild_channels_BANG_ = (function knoxx$backend$domain$discord$rest_client$guild_channels_BANG_(client,guild_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$guild_channels_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$guild_channels_BANG_$arity$2(client,guild_id);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$guild_channels_BANG_$dyn_32807(client,guild_id);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$open_dm_channel_BANG_$dyn_32809 = (function (client,user_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.open_dm_channel_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,user_id) : m__5520__auto__.call(null,client,user_id));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.open_dm_channel_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,user_id) : m__5518__auto__.call(null,client,user_id));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.open-dm-channel!",client);
}
}
});
/**
 * Open or fetch a DM channel with user-id.
 */
knoxx.backend.domain.discord.rest_client.open_dm_channel_BANG_ = (function knoxx$backend$domain$discord$rest_client$open_dm_channel_BANG_(client,user_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$open_dm_channel_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$open_dm_channel_BANG_$arity$2(client,user_id);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$open_dm_channel_BANG_$dyn_32809(client,user_id);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_BANG_$dyn_32812 = (function (client,channel_id,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.create_channel_message_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,channel_id,payload) : m__5520__auto__.call(null,client,channel_id,payload));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.create_channel_message_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,channel_id,payload) : m__5518__auto__.call(null,client,channel_id,payload));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.create-channel-message!",client);
}
}
});
/**
 * Create a channel message from a CLJS Discord JSON payload.
 */
knoxx.backend.domain.discord.rest_client.create_channel_message_BANG_ = (function knoxx$backend$domain$discord$rest_client$create_channel_message_BANG_(client,channel_id,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_BANG_$arity$3(client,channel_id,payload);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_BANG_$dyn_32812(client,channel_id,payload);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_form_BANG_$dyn_32813 = (function (client,channel_id,form_data){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.create_channel_message_form_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,channel_id,form_data) : m__5520__auto__.call(null,client,channel_id,form_data));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.create_channel_message_form_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,channel_id,form_data) : m__5518__auto__.call(null,client,channel_id,form_data));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.create-channel-message-form!",client);
}
}
});
/**
 * Create a channel message using a prepared FormData body for file uploads.
 */
knoxx.backend.domain.discord.rest_client.create_channel_message_form_BANG_ = (function knoxx$backend$domain$discord$rest_client$create_channel_message_form_BANG_(client,channel_id,form_data){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_form_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_form_BANG_$arity$3(client,channel_id,form_data);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_form_BANG_$dyn_32813(client,channel_id,form_data);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$add_reaction_BANG_$dyn_32818 = (function (client,channel_id,message_id,emoji){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.add_reaction_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,channel_id,message_id,emoji) : m__5520__auto__.call(null,client,channel_id,message_id,emoji));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.add_reaction_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,channel_id,message_id,emoji) : m__5518__auto__.call(null,client,channel_id,message_id,emoji));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.add-reaction!",client);
}
}
});
/**
 * Add the bot user's reaction to a message.
 */
knoxx.backend.domain.discord.rest_client.add_reaction_BANG_ = (function knoxx$backend$domain$discord$rest_client$add_reaction_BANG_(client,channel_id,message_id,emoji){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$add_reaction_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$add_reaction_BANG_$arity$4(client,channel_id,message_id,emoji);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$add_reaction_BANG_$dyn_32818(client,channel_id,message_id,emoji);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_thread_BANG_$dyn_32821 = (function (client,channel_id,message_id,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.create_thread_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,channel_id,message_id,payload) : m__5520__auto__.call(null,client,channel_id,message_id,payload));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.create_thread_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,channel_id,message_id,payload) : m__5518__auto__.call(null,client,channel_id,message_id,payload));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.create-thread!",client);
}
}
});
/**
 * Create a thread in a channel, or from a message when message-id is present.
 */
knoxx.backend.domain.discord.rest_client.create_thread_BANG_ = (function knoxx$backend$domain$discord$rest_client$create_thread_BANG_(client,channel_id,message_id,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_thread_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_thread_BANG_$arity$4(client,channel_id,message_id,payload);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_thread_BANG_$dyn_32821(client,channel_id,message_id,payload);
}
});

var knoxx$backend$domain$discord$rest_client$IDiscordRestClient$fetch_attachment_BANG_$dyn_32822 = (function (client,url){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.discord.rest_client.fetch_attachment_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,url) : m__5520__auto__.call(null,client,url));
} else {
var m__5518__auto__ = (knoxx.backend.domain.discord.rest_client.fetch_attachment_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,url) : m__5518__auto__.call(null,client,url));
} else {
throw cljs.core.missing_protocol("IDiscordRestClient.fetch-attachment!",client);
}
}
});
/**
 * Fetch arbitrary attachment media. Resolves {:ok :status :headers :body ArrayBuffer}.
 */
knoxx.backend.domain.discord.rest_client.fetch_attachment_BANG_ = (function knoxx$backend$domain$discord$rest_client$fetch_attachment_BANG_(client,url){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$fetch_attachment_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$fetch_attachment_BANG_$arity$2(client,url);
} else {
return knoxx$backend$domain$discord$rest_client$IDiscordRestClient$fetch_attachment_BANG_$dyn_32822(client,url);
}
});

knoxx.backend.domain.discord.rest_client.discord_base_url = "https://discord.com/api/v10";
knoxx.backend.domain.discord.rest_client.bot_headers = (function knoxx$backend$domain$discord$rest_client$bot_headers(var_args){
var G__32430 = arguments.length;
switch (G__32430) {
case 1:
return knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1 = (function (token){
return knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$2(token,true);
}));

(knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$2 = (function (token,json_QMARK_){
var G__32444 = new cljs.core.PersistentArrayMap(null, 1, ["Authorization",(""+"Bot "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token))], null);
if(cljs.core.truth_(json_QMARK_)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32444,"Content-Type","application/json");
} else {
return G__32444;
}
}));

(knoxx.backend.domain.discord.rest_client.bot_headers.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.discord.rest_client.require_token_BANG_ = (function knoxx$backend$domain$discord$rest_client$require_token_BANG_(token){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)))){
throw (new Error("Discord bot token not configured"));
} else {
}

return token;
});
knoxx.backend.domain.discord.rest_client.query_url = (function knoxx$backend$domain$discord$rest_client$query_url(base,params){
var search = (new URLSearchParams());
var seq__32461_32825 = cljs.core.seq(params);
var chunk__32462_32826 = null;
var count__32463_32827 = (0);
var i__32464_32828 = (0);
while(true){
if((i__32464_32828 < count__32463_32827)){
var vec__32480_32829 = chunk__32462_32826.cljs$core$IIndexed$_nth$arity$2(null,i__32464_32828);
var k_32830 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32480_32829,(0),null);
var v_32831 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32480_32829,(1),null);
if((((v_32831 == null)) || (((typeof v_32831 === 'string') && (clojure.string.blank_QMARK_(v_32831)))))){
} else {
search.append(cljs.core.name(k_32830),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v_32831)));
}


var G__32832 = seq__32461_32825;
var G__32833 = chunk__32462_32826;
var G__32834 = count__32463_32827;
var G__32835 = (i__32464_32828 + (1));
seq__32461_32825 = G__32832;
chunk__32462_32826 = G__32833;
count__32463_32827 = G__32834;
i__32464_32828 = G__32835;
continue;
} else {
var temp__5825__auto___32836 = cljs.core.seq(seq__32461_32825);
if(temp__5825__auto___32836){
var seq__32461_32837__$1 = temp__5825__auto___32836;
if(cljs.core.chunked_seq_QMARK_(seq__32461_32837__$1)){
var c__5694__auto___32838 = cljs.core.chunk_first(seq__32461_32837__$1);
var G__32840 = cljs.core.chunk_rest(seq__32461_32837__$1);
var G__32841 = c__5694__auto___32838;
var G__32842 = cljs.core.count(c__5694__auto___32838);
var G__32843 = (0);
seq__32461_32825 = G__32840;
chunk__32462_32826 = G__32841;
count__32463_32827 = G__32842;
i__32464_32828 = G__32843;
continue;
} else {
var vec__32509_32844 = cljs.core.first(seq__32461_32837__$1);
var k_32845 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32509_32844,(0),null);
var v_32846 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32509_32844,(1),null);
if((((v_32846 == null)) || (((typeof v_32846 === 'string') && (clojure.string.blank_QMARK_(v_32846)))))){
} else {
search.append(cljs.core.name(k_32845),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v_32846)));
}


var G__32848 = cljs.core.next(seq__32461_32837__$1);
var G__32849 = null;
var G__32850 = (0);
var G__32851 = (0);
seq__32461_32825 = G__32848;
chunk__32462_32826 = G__32849;
count__32463_32827 = G__32850;
i__32464_32828 = G__32851;
continue;
}
} else {
}
}
break;
}

var query = search.toString();
if(clojure.string.blank_QMARK_(query)){
return base;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base)+"?"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(query));
}
});
knoxx.backend.domain.discord.rest_client.discord_json_BANG_ = (function knoxx$backend$domain$discord$rest_client$discord_json_BANG_(http_client,url,opts,timeout_ms,label){
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_(http_client,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),opts,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),timeout_ms], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp):(function (){throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" Discord API error "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))))})()));
}));
}));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.domain.discord.rest_client.IDiscordRestClient}
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
knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient = (function (bot_token,http_client,timeout_ms,user_agent,__meta,__extmap,__hash){
this.bot_token = bot_token;
this.http_client = http_client;
this.timeout_ms = timeout_ms;
this.user_agent = user_agent;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k32531,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__32548 = k32531;
var G__32548__$1 = (((G__32548 instanceof cljs.core.Keyword))?G__32548.fqn:null);
switch (G__32548__$1) {
case "bot-token":
return self__.bot_token;

break;
case "http-client":
return self__.http_client;

break;
case "timeout-ms":
return self__.timeout_ms;

break;
case "user-agent":
return self__.user_agent;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k32531,else__5472__auto__);

}
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__32553){
var vec__32556 = p__32553;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32556,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32556,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.discord.rest-client.FetchDiscordRestClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),self__.bot_token],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),self__.user_agent],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__32530){
var self__ = this;
var G__32530__$1 = this;
return (new cljs.core.RecordIter((0),G__32530__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),new cljs.core.Keyword(null,"user-agent","user-agent",1220426212)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,self__.http_client,self__.timeout_ms,self__.user_agent,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (4 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-199507810 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this32532,other32533){
var self__ = this;
var this32532__$1 = this;
return (((!((other32533 == null)))) && ((((this32532__$1.constructor === other32533.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this32532__$1.bot_token,other32533.bot_token)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this32532__$1.http_client,other32533.http_client)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this32532__$1.timeout_ms,other32533.timeout_ms)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this32532__$1.user_agent,other32533.user_agent)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this32532__$1.__extmap,other32533.__extmap)))))))))))));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),null,new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,self__.http_client,self__.timeout_ms,self__.user_agent,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k32531){
var self__ = this;
var this__5476__auto____$1 = this;
var G__32591 = k32531;
var G__32591__$1 = (((G__32591 instanceof cljs.core.Keyword))?G__32591.fqn:null);
switch (G__32591__$1) {
case "bot-token":
case "http-client":
case "timeout-ms":
case "user-agent":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k32531);

}
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__32530){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__32605 = cljs.core.keyword_identical_QMARK_;
var expr__32606 = k__5478__auto__;
if(cljs.core.truth_((pred__32605.cljs$core$IFn$_invoke$arity$2 ? pred__32605.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),expr__32606) : pred__32605.call(null,new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),expr__32606)))){
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(G__32530,self__.http_client,self__.timeout_ms,self__.user_agent,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__32605.cljs$core$IFn$_invoke$arity$2 ? pred__32605.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__32606) : pred__32605.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__32606)))){
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,G__32530,self__.timeout_ms,self__.user_agent,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__32605.cljs$core$IFn$_invoke$arity$2 ? pred__32605.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__32606) : pred__32605.call(null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__32606)))){
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,self__.http_client,G__32530,self__.user_agent,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__32605.cljs$core$IFn$_invoke$arity$2 ? pred__32605.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),expr__32606) : pred__32605.call(null,new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),expr__32606)))){
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,self__.http_client,self__.timeout_ms,G__32530,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,self__.http_client,self__.timeout_ms,self__.user_agent,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__32530),null));
}
}
}
}
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),self__.bot_token,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),self__.user_agent,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__32530){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(self__.bot_token,self__.http_client,self__.timeout_ms,self__.user_agent,G__32530,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$fetch_attachment_BANG_$arity$2 = (function (_,url){
var self__ = this;
var ___$1 = this;
return knoxx.backend.extern.fetch.array_buffer_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["User-Agent",(function (){var or__5162__auto__ = self__.user_agent;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Knoxx-Agent/1.0";
}
})()], null)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$add_reaction_BANG_$arity$4 = (function (_,channel_id,message_id,emoji){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"/messages/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id)+"/reactions/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(emoji))+"/@me"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"PUT",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$2(self__.bot_token,false)], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"Add reaction");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_form_BANG_$arity$3 = (function (_,channel_id,form_data){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"/messages"),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$2(self__.bot_token,false),new cljs.core.Keyword(null,"body","body",-2049205669),form_data], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})(),"Create multipart message");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_channel_message_BANG_$arity$3 = (function (_,channel_id,payload){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"/messages"),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1(self__.bot_token),new cljs.core.Keyword(null,"json","json",1279968570),payload], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"Create message");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$create_thread_BANG_$arity$4 = (function (_,channel_id,message_id,payload){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

var url = ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id))))?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"/threads"):(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"/messages/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id)+"/threads"));
return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),url,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1(self__.bot_token),new cljs.core.Keyword(null,"json","json",1279968570),payload], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"Create thread");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$guild_channels_BANG_$arity$2 = (function (_,guild_id){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/guilds/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id)+"/channels"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1(self__.bot_token)], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"List channels");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$channel_messages_BANG_$arity$3 = (function (_,channel_id,p__32710){
var self__ = this;
var map__32711 = p__32710;
var map__32711__$1 = cljs.core.__destructure_map(map__32711);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32711__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var before = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32711__$1,new cljs.core.Keyword(null,"before","before",-1633692388));
var after = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32711__$1,new cljs.core.Keyword(null,"after","after",594996914));
var around = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32711__$1,new cljs.core.Keyword(null,"around","around",-265975553));
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),knoxx.backend.domain.discord.rest_client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/channels/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id)+"/messages"),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (50);
}
})())),new cljs.core.Keyword(null,"before","before",-1633692388),before,new cljs.core.Keyword(null,"after","after",594996914),after,new cljs.core.Keyword(null,"around","around",-265975553),around], null)),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1(self__.bot_token)], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"Fetch messages");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$open_dm_channel_BANG_$arity$2 = (function (_,user_id){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/users/@me/channels"),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1(self__.bot_token),new cljs.core.Keyword(null,"json","json",1279968570),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recipient_id","recipient_id",1697655384),user_id], null)], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"Open DM channel");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.prototype.knoxx$backend$domain$discord$rest_client$IDiscordRestClient$current_user_guilds_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.discord.rest_client.require_token_BANG_(self__.bot_token);

return knoxx.backend.domain.discord.rest_client.discord_json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.rest_client.discord_base_url)+"/users/@me/guilds"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.domain.discord.rest_client.bot_headers.cljs$core$IFn$_invoke$arity$1(self__.bot_token)], null),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),"List guilds");
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"bot-token","bot-token",789503496,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null),new cljs.core.Symbol(null,"timeout-ms","timeout-ms",-1900214363,null),new cljs.core.Symbol(null,"user-agent","user-agent",-1434009557,null)], null);
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.cljs$lang$type = true);

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.discord.rest-client/FetchDiscordRestClient",null,(1),null));
}));

(knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.discord.rest-client/FetchDiscordRestClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.discord.rest-client/FetchDiscordRestClient.
 */
knoxx.backend.domain.discord.rest_client.__GT_FetchDiscordRestClient = (function knoxx$backend$domain$discord$rest_client$__GT_FetchDiscordRestClient(bot_token,http_client,timeout_ms,user_agent){
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(bot_token,http_client,timeout_ms,user_agent,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.discord.rest-client/FetchDiscordRestClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.discord.rest_client.map__GT_FetchDiscordRestClient = (function knoxx$backend$domain$discord$rest_client$map__GT_FetchDiscordRestClient(G__32539){
var extmap__5511__auto__ = (function (){var G__32752 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__32539,new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),new cljs.core.Keyword(null,"user-agent","user-agent",1220426212)], 0));
if(cljs.core.record_QMARK_(G__32539)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__32752);
} else {
return G__32752;
}
})();
return (new knoxx.backend.domain.discord.rest_client.FetchDiscordRestClient(new cljs.core.Keyword(null,"bot-token","bot-token",-851028031).cljs$core$IFn$_invoke$arity$1(G__32539),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__32539),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(G__32539),new cljs.core.Keyword(null,"user-agent","user-agent",1220426212).cljs$core$IFn$_invoke$arity$1(G__32539),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.discord.rest_client.client = (function knoxx$backend$domain$discord$rest_client$client(var_args){
var G__32771 = arguments.length;
switch (G__32771) {
case 1:
return knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$1 = (function (bot_token){
return knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$2(bot_token,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$2 = (function (bot_token,p__32779){
var map__32782 = p__32779;
var map__32782__$1 = cljs.core.__destructure_map(map__32782);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32782__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32782__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
var user_agent = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32782__$1,new cljs.core.Keyword(null,"user-agent","user-agent",1220426212));
return knoxx.backend.domain.discord.rest_client.__GT_FetchDiscordRestClient(bot_token,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (15000);
}
})(),user_agent);
}));

(knoxx.backend.domain.discord.rest_client.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.domain.discord.rest_client.js.map
