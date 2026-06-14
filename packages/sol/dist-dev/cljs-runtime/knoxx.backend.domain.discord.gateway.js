import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./shadow.esm.esm_import$discord.js";
import "./shadow.esm.esm_import$$discordjs$voice.js";
import "./shadow.esm.esm_import$prism_media.js";
import "./shadow.esm.esm_import$node_module.js";
import "./shadow.esm.esm_import$node_stream.js";
goog.provide('knoxx.backend.domain.discord.gateway');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.discord !== 'undefined') && (typeof knoxx.backend.domain.discord.gateway !== 'undefined') && (typeof knoxx.backend.domain.discord.gateway.libsodium_wrappers_loaded_QMARK_ !== 'undefined')){
} else {
knoxx.backend.domain.discord.gateway.libsodium_wrappers_loaded_QMARK_ = (function (){var req = shadow.esm.esm_import$node_module.createRequire((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(process.cwd())+"/"));
(req.cljs$core$IFn$_invoke$arity$1 ? req.cljs$core$IFn$_invoke$arity$1("libsodium-wrappers") : req.call(null,"libsodium-wrappers"));

return true;
})();
}
knoxx.backend.domain.discord.gateway.voice_listener_sample_rate = (48000);
knoxx.backend.domain.discord.gateway.voice_listener_channels = (2);
knoxx.backend.domain.discord.gateway.voice_listener_bytes_per_sample = (2);
knoxx.backend.domain.discord.gateway.voice_listener_min_duration_s = 0.8;
knoxx.backend.domain.discord.gateway.voice_listener_silence_debounce_ms = (900);
knoxx.backend.domain.discord.gateway.voice_listener_chunk_threshold_s = (25);
knoxx.backend.domain.discord.gateway.voice_listener_chunk_overlap_s = (5);
knoxx.backend.domain.discord.gateway.voice_listener_chunk_threshold_bytes = (((knoxx.backend.domain.discord.gateway.voice_listener_sample_rate * knoxx.backend.domain.discord.gateway.voice_listener_channels) * knoxx.backend.domain.discord.gateway.voice_listener_bytes_per_sample) * knoxx.backend.domain.discord.gateway.voice_listener_chunk_threshold_s);
knoxx.backend.domain.discord.gateway.voice_listener_chunk_overlap_bytes = (((knoxx.backend.domain.discord.gateway.voice_listener_sample_rate * knoxx.backend.domain.discord.gateway.voice_listener_channels) * knoxx.backend.domain.discord.gateway.voice_listener_bytes_per_sample) * knoxx.backend.domain.discord.gateway.voice_listener_chunk_overlap_s);
knoxx.backend.domain.discord.gateway.intent_bits = (function knoxx$backend$domain$discord$gateway$intent_bits(){
return (shadow.esm.esm_import$discord["GatewayIntentBits"]);
});
knoxx.backend.domain.discord.gateway.partials_enum = (function knoxx$backend$domain$discord$gateway$partials_enum(){
return (shadow.esm.esm_import$discord["Partials"]);
});
knoxx.backend.domain.discord.gateway.events_enum = (function knoxx$backend$domain$discord$gateway$events_enum(){
return (shadow.esm.esm_import$discord["Events"]);
});
knoxx.backend.domain.discord.gateway.channel_type_enum = (function knoxx$backend$domain$discord$gateway$channel_type_enum(){
return (shadow.esm.esm_import$discord["ChannelType"]);
});
knoxx.backend.domain.discord.gateway.Client_class = (function knoxx$backend$domain$discord$gateway$Client_class(){
return (shadow.esm.esm_import$discord["Client"]);
});
/**
 * Wrap raw PCM16LE bytes in a WAV container so ffmpeg (and thus STT) can decode it.
 * 
 * pcm: Node Buffer of signed 16-bit little-endian samples.
 * rate: sample rate in Hz (Discord voice is typically 48000)
 * channels: 1 or 2 (Discord voice is typically 2)
 * 
 * Returns a Node Buffer containing a complete .wav file.
 */
knoxx.backend.domain.discord.gateway.pcm16le__GT_wav_buffer = (function knoxx$backend$domain$discord$gateway$pcm16le__GT_wav_buffer(pcm,rate,channels){
var rate__$1 = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.long$((function (){var or__5162__auto__ = rate;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (48000);
}
})()));
var channels__$1 = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.long$((function (){var or__5162__auto__ = channels;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (2);
}
})()));
var data_size = pcm.length;
var byte_rate = ((rate__$1 * channels__$1) * (2));
var block_align = (channels__$1 * (2));
var wav = Buffer.alloc(((44) + data_size));
wav.write("RIFF",(0));

wav.writeUInt32LE(((36) + data_size),(4));

wav.write("WAVE",(8));

wav.write("fmt ",(12));

wav.writeUInt32LE((16),(16));

wav.writeUInt16LE((1),(20));

wav.writeUInt16LE(channels__$1,(22));

wav.writeUInt32LE(rate__$1,(24));

wav.writeUInt32LE(byte_rate,(28));

wav.writeUInt16LE(block_align,(32));

wav.writeUInt16LE((16),(34));

wav.write("data",(36));

wav.writeUInt32LE(data_size,(40));

pcm.copy(wav,(44));

return wav;
});
knoxx.backend.domain.discord.gateway.member_role_ids = (function knoxx$backend$domain$discord$gateway$member_role_ids(member){
try{var roles = (cljs.core.truth_(member)?member.roles:null);
var cache = (cljs.core.truth_(roles)?roles.cache:null);
if(cljs.core.truth_(cache)){
return cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$member_role_ids_$_iter__33022(s__33023){
return (new cljs.core.LazySeq(null,(function (){
var s__33023__$1 = s__33023;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33023__$1);
if(temp__5825__auto__){
var s__33023__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33023__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33023__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33025 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33024 = (0);
while(true){
if((i__33024 < size__5648__auto__)){
var vec__33031 = cljs.core._nth(c__5647__auto__,i__33024);
var role_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33031,(0),null);
var _role = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33031,(1),null);
cljs.core.chunk_append(b__33025,role_id);

var G__33759 = (i__33024 + (1));
i__33024 = G__33759;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33025),knoxx$backend$domain$discord$gateway$member_role_ids_$_iter__33022(cljs.core.chunk_rest(s__33023__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33025),null);
}
} else {
var vec__33034 = cljs.core.first(s__33023__$2);
var role_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33034,(0),null);
var _role = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33034,(1),null);
return cljs.core.cons(role_id,knoxx$backend$domain$discord$gateway$member_role_ids_$_iter__33022(cljs.core.rest(s__33023__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cache);
})());
} else {
return [];
}
}catch (e33016){if((e33016 instanceof Error)){
var _ = e33016;
return [];
} else {
throw e33016;

}
}});
/**
 * Convert a discord.js Message to a plain JS map.
 */
knoxx.backend.domain.discord.gateway.map_message = (function knoxx$backend$domain$discord$gateway$map_message(message){
var author = message.author;
var guild = message.guild;
var member = message.member;
return ({"authorId": (function (){var or__5162__auto__ = (cljs.core.truth_(author)?author.id:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "guildId": (function (){var or__5162__auto__ = (cljs.core.truth_(guild)?guild.id:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "content": (function (){var or__5162__auto__ = message.content;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "channelId": message.channelId, "attachments": cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$map_message_$_iter__33044(s__33045){
return (new cljs.core.LazySeq(null,(function (){
var s__33045__$1 = s__33045;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33045__$1);
if(temp__5825__auto__){
var s__33045__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33045__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33045__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33047 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33046 = (0);
while(true){
if((i__33046 < size__5648__auto__)){
var vec__33052 = cljs.core._nth(c__5647__auto__,i__33046);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33052,(0),null);
var att = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33052,(1),null);
cljs.core.chunk_append(b__33047,({"id": att.id, "filename": (function (){var or__5162__auto__ = att.name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "contentType": (function (){var or__5162__auto__ = att.contentType;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "size": (function (){var or__5162__auto__ = att.size;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(), "url": (function (){var or__5162__auto__ = att.url;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()}));

var G__33760 = (i__33046 + (1));
i__33046 = G__33760;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33047),knoxx$backend$domain$discord$gateway$map_message_$_iter__33044(cljs.core.chunk_rest(s__33045__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33047),null);
}
} else {
var vec__33065 = cljs.core.first(s__33045__$2);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33065,(0),null);
var att = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33065,(1),null);
return cljs.core.cons(({"id": att.id, "filename": (function (){var or__5162__auto__ = att.name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "contentType": (function (){var or__5162__auto__ = att.contentType;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "size": (function (){var or__5162__auto__ = att.size;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(), "url": (function (){var or__5162__auto__ = att.url;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()}),knoxx$backend$domain$discord$gateway$map_message_$_iter__33044(cljs.core.rest(s__33045__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(message.attachments);
})()), "authorUsername": (function (){var or__5162__auto__ = (cljs.core.truth_(author)?author.username:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})(), "authorIsBot": cljs.core.boolean$((cljs.core.truth_(author)?author.bot:null)), "id": message.id, "authorRoleIds": knoxx.backend.domain.discord.gateway.member_role_ids(member), "embeds": cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$map_message_$_iter__33074(s__33075){
return (new cljs.core.LazySeq(null,(function (){
var s__33075__$1 = s__33075;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33075__$1);
if(temp__5825__auto__){
var s__33075__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33075__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33075__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33077 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33076 = (0);
while(true){
if((i__33076 < size__5648__auto__)){
var embed = cljs.core._nth(c__5647__auto__,i__33076);
cljs.core.chunk_append(b__33077,({"title": (function (){var or__5162__auto__ = embed.title;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "description": (function (){var or__5162__auto__ = embed.description;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "url": (function (){var or__5162__auto__ = embed.url;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})()}));

var G__33762 = (i__33076 + (1));
i__33076 = G__33762;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33077),knoxx$backend$domain$discord$gateway$map_message_$_iter__33074(cljs.core.chunk_rest(s__33075__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33077),null);
}
} else {
var embed = cljs.core.first(s__33075__$2);
return cljs.core.cons(({"title": (function (){var or__5162__auto__ = embed.title;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "description": (function (){var or__5162__auto__ = embed.description;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "url": (function (){var or__5162__auto__ = embed.url;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})()}),knoxx$backend$domain$discord$gateway$map_message_$_iter__33074(cljs.core.rest(s__33075__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(message.embeds);
})()), "timestamp": (function (){try{return message.createdAt.toISOString();
}catch (e33093){if((e33093 instanceof Error)){
var _ = e33093;
return (new Date()).toISOString();
} else {
throw e33093;

}
}})()});
});
/**
 * Check if a channel is a text-based channel we can read.
 */
knoxx.backend.domain.discord.gateway.readable_text_channel_QMARK_ = (function knoxx$backend$domain$discord$gateway$readable_text_channel_QMARK_(channel){
var and__5160__auto__ = channel;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = cljs.core.fn_QMARK_(channel.isTextBased);
if(and__5160__auto____$1){
return channel.isTextBased();
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
});
/**
 * Sort an array of message maps by timestamp, newest first.
 */
knoxx.backend.domain.discord.gateway.sort_newest_first = (function knoxx$backend$domain$discord$gateway$sort_newest_first(messages){
return Array.from(cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(messages).sort((function (a,b){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((b["timestamp"]))).localeCompare((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((a["timestamp"]))));
})));
});
/**
 * Split text into chunks of ≤2000 chars, preferring paragraph/line/word breaks.
 */
knoxx.backend.domain.discord.gateway.split_message = (function knoxx$backend$domain$discord$gateway$split_message(text){
var normalized = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())).trim();
if((normalized.length <= (2000))){
return [normalized];
} else {
var parts = cljs.core.atom.cljs$core$IFn$_invoke$arity$1([]);
var remaining = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(normalized);
while(true){
if((cljs.core.deref(remaining).length > (2000))){
var r_33765 = cljs.core.deref(remaining);
var split_at_para_33766 = r_33765.lastIndexOf("\n\n",(2000));
var split_at_line_33767 = r_33765.lastIndexOf("\n",(2000));
var split_at_space_33768 = r_33765.lastIndexOf(" ",(2000));
var split_at_33769 = (((split_at_para_33766 > (1000)))?split_at_para_33766:(((split_at_line_33767 > (1000)))?split_at_line_33767:(((split_at_space_33768 > (1000)))?split_at_space_33768:(2000)
)));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(parts,((function (r_33765,split_at_para_33766,split_at_line_33767,split_at_space_33768,split_at_33769,parts,remaining,normalized){
return (function (p){
return p.concat([r_33765.slice((0),split_at_33769).trimEnd()]);
});})(r_33765,split_at_para_33766,split_at_line_33767,split_at_space_33768,split_at_33769,parts,remaining,normalized))
);

cljs.core.reset_BANG_(remaining,r_33765.slice(split_at_33769).trimStart());

continue;
} else {
}
break;
}

if((cljs.core.deref(remaining).length > (0))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(parts,(function (p){
return p.concat([cljs.core.deref(remaining)]);
}));
} else {
}

return cljs.core.deref(parts);
}
});
/**
 * Read an attachment field from either a CLJS map or a plain JS object.
 */
knoxx.backend.domain.discord.gateway.attachment_value = (function knoxx$backend$domain$discord$gateway$attachment_value(attachment,k,js_key){
var or__5162__auto__ = ((cljs.core.map_QMARK_(attachment))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(attachment,k):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.object_QMARK_(attachment)){
return (attachment[js_key]);
} else {
return null;
}
}
});
knoxx.backend.domain.discord.gateway.discord_file_payload = (function knoxx$backend$domain$discord$gateway$discord_file_payload(attachment){
var buffer = (function (){var or__5162__auto__ = knoxx.backend.domain.discord.gateway.attachment_value(attachment,new cljs.core.Keyword(null,"buffer","buffer",617295198),"buffer");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.discord.gateway.attachment_value(attachment,new cljs.core.Keyword(null,"attachment","attachment",-956025313),"attachment");
}
})();
var name = (function (){var or__5162__auto__ = knoxx.backend.domain.discord.gateway.attachment_value(attachment,new cljs.core.Keyword(null,"name","name",1843675177),"name");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.discord.gateway.attachment_value(attachment,new cljs.core.Keyword(null,"filename","filename",-1428840783),"filename");
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "attachment.bin";
}
}
})();
if(cljs.core.truth_(buffer)){
} else {
throw (new Error("Discord attachment is missing file data"));
}

return ({"attachment": buffer, "name": name});
});
/**
 * Return a logger function (or nil) for a given level keyword.
 * 
 * We avoid the old (.-info? log) style because js/console doesn't expose
 * predicate fields; it only exposes methods like .info/.warn/.error.
 */
knoxx.backend.domain.discord.gateway.log_fn = (function knoxx$backend$domain$discord$gateway$log_fn(log,level){
var candidate = (function (){var G__33145 = level;
var G__33145__$1 = (((G__33145 instanceof cljs.core.Keyword))?G__33145.fqn:null);
switch (G__33145__$1) {
case "info":
return (log["info"]);

break;
case "warn":
return (log["warn"]);

break;
case "error":
return (log["error"]);

break;
case "debug":
return (log["debug"]);

break;
default:
return null;

}
})();
if(cljs.core.fn_QMARK_(candidate)){
return (function() { 
var G__33771__delegate = function (args){
try{return candidate.apply(log,cljs.core.to_array(args));
}catch (e33147){if((e33147 instanceof Error)){
var _ = e33147;
return null;
} else {
throw e33147;

}
}};
var G__33771 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__33772__i = 0, G__33772__a = new Array(arguments.length -  0);
while (G__33772__i < G__33772__a.length) {G__33772__a[G__33772__i] = arguments[G__33772__i + 0]; ++G__33772__i;}
  args = new cljs.core.IndexedSeq(G__33772__a,0,null);
} 
return G__33771__delegate.call(this,args);};
G__33771.cljs$lang$maxFixedArity = 0;
G__33771.cljs$lang$applyTo = (function (arglist__33773){
var args = cljs.core.seq(arglist__33773);
return G__33771__delegate(args);
});
G__33771.cljs$core$IFn$_invoke$arity$variadic = G__33771__delegate;
return G__33771;
})()
;
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.notify_message_BANG_ = (function knoxx$backend$domain$discord$gateway$notify_message_BANG_(listeners,log,message){
var mapped = knoxx.backend.domain.discord.gateway.map_message(message);
var log_error = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"error","error",-978969032));
return cljs.core.deref(listeners).forEach((function (listener){
try{return (listener.cljs$core$IFn$_invoke$arity$2 ? listener.cljs$core$IFn$_invoke$arity$2(mapped,message) : listener.call(null,mapped,message));
}catch (e33153){if((e33153 instanceof Error)){
var error = e33153;
if(cljs.core.truth_(log_error)){
return log_error("[discord-gateway] listener failed",error);
} else {
return null;
}
} else {
throw e33153;

}
}}));
});
knoxx.backend.domain.discord.gateway.notify_reaction_BANG_ = (function knoxx$backend$domain$discord$gateway$notify_reaction_BANG_(reaction_listeners,log,reaction,user){
var message = reaction.message;
var emoji = reaction.emoji;
var mapped = ({"emoji": (function (){var or__5162__auto__ = emoji.name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "message": (cljs.core.truth_(message)?knoxx.backend.domain.discord.gateway.map_message(message):null), "messageId": (function (){var or__5162__auto__ = (cljs.core.truth_(message)?message.id:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "channelId": (function (){var or__5162__auto__ = (cljs.core.truth_(message)?message.channelId:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "userId": (function (){var or__5162__auto__ = (cljs.core.truth_(user)?user.id:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "userUsername": (function (){var or__5162__auto__ = (cljs.core.truth_(user)?user.username:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})()});
var log_error = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"error","error",-978969032));
return cljs.core.deref(reaction_listeners).forEach((function (listener){
try{return (listener.cljs$core$IFn$_invoke$arity$3 ? listener.cljs$core$IFn$_invoke$arity$3(mapped,reaction,user) : listener.call(null,mapped,reaction,user));
}catch (e33168){if((e33168 instanceof Error)){
var error = e33168;
if(cljs.core.truth_(log_error)){
return log_error("[discord-gateway] reaction listener failed",error);
} else {
return null;
}
} else {
throw e33168;

}
}}));
});
knoxx.backend.domain.discord.gateway.notify_voice_state_BANG_ = (function knoxx$backend$domain$discord$gateway$notify_voice_state_BANG_(voice_state_listeners,log,old_state,new_state){
var old_channel_id = (cljs.core.truth_(old_state)?old_state.channelId:null);
var new_channel_id = (cljs.core.truth_(new_state)?new_state.channelId:null);
var user = (cljs.core.truth_(new_state)?new_state.member:null);
var user_id = (cljs.core.truth_(user)?user.id:null);
var guild_id = (cljs.core.truth_(new_state)?(function (){
new_state.guild;

return new_state.guild.id;
})()
:null);
var action = (cljs.core.truth_((function (){var and__5160__auto__ = (old_channel_id == null);
if(and__5160__auto__){
return new_channel_id;
} else {
return and__5160__auto__;
}
})())?"join":(cljs.core.truth_((function (){var and__5160__auto__ = old_channel_id;
if(cljs.core.truth_(and__5160__auto__)){
return (new_channel_id == null);
} else {
return and__5160__auto__;
}
})())?"leave":(cljs.core.truth_((function (){var and__5160__auto__ = old_channel_id;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = new_channel_id;
if(cljs.core.truth_(and__5160__auto____$1)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_channel_id,new_channel_id);
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())?"move":null
)));
var mapped = ({"action": action, "userId": user_id, "username": (function (){var or__5162__auto__ = (cljs.core.truth_(user)?user.user:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (cljs.core.truth_(user)?user.username:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})(), "guildId": guild_id, "channelId": (function (){var or__5162__auto__ = new_channel_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return old_channel_id;
}
})(), "oldChannelId": old_channel_id, "newChannelId": new_channel_id});
var log_error = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"error","error",-978969032));
if(cljs.core.truth_(action)){
return cljs.core.deref(voice_state_listeners).forEach((function (listener){
try{return (listener.cljs$core$IFn$_invoke$arity$3 ? listener.cljs$core$IFn$_invoke$arity$3(mapped,old_state,new_state) : listener.call(null,mapped,old_state,new_state));
}catch (e33185){if((e33185 instanceof Error)){
var error = e33185;
if(cljs.core.truth_(log_error)){
return log_error("[discord-gateway] voice state listener failed",error);
} else {
return null;
}
} else {
throw e33185;

}
}}));
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.handle_client_ready = (function knoxx$backend$domain$discord$gateway$handle_client_ready(log_info,ready_client){
if(cljs.core.truth_(log_info)){
var G__33187 = (""+"[discord-gateway] ready as "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (cljs.core.truth_(ready_client.user)?ready_client.user.tag:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})())+" in "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ready_client.guilds.cache.size)+" guilds");
return (log_info.cljs$core$IFn$_invoke$arity$1 ? log_info.cljs$core$IFn$_invoke$arity$1(G__33187) : log_info.call(null,G__33187));
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.handle_message_create = (function knoxx$backend$domain$discord$gateway$handle_message_create(notify_message,message){
return (notify_message.cljs$core$IFn$_invoke$arity$1 ? notify_message.cljs$core$IFn$_invoke$arity$1(message) : notify_message.call(null,message));
});
knoxx.backend.domain.discord.gateway.fetch_partial_BANG_ = (async function knoxx$backend$domain$discord$gateway$fetch_partial_BANG_(x){
if(cljs.core.truth_(x.partial)){
return (await x.fetch());
} else {
return x;
}
});
knoxx.backend.domain.discord.gateway.fetch_reaction_message_BANG_ = (async function knoxx$backend$domain$discord$gateway$fetch_reaction_message_BANG_(reaction){
var message = reaction.message;
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = message;
if(cljs.core.truth_(and__5160__auto__)){
return message.partial;
} else {
return and__5160__auto__;
}
})()))){
(await message.fetch());
} else {
}

return message;
});
knoxx.backend.domain.discord.gateway.handle_reaction_add = (async function knoxx$backend$domain$discord$gateway$handle_reaction_add(log_warn,notify_reaction,reaction,user){
try{var full_reaction = (await knoxx.backend.domain.discord.gateway.fetch_partial_BANG_(reaction));
(await knoxx.backend.domain.discord.gateway.fetch_reaction_message_BANG_(full_reaction));

return (notify_reaction.cljs$core$IFn$_invoke$arity$2 ? notify_reaction.cljs$core$IFn$_invoke$arity$2(full_reaction,user) : notify_reaction.call(null,full_reaction,user));
}catch (e33203){if((e33203 instanceof Error)){
var error = e33203;
if(cljs.core.truth_(log_warn)){
return (log_warn.cljs$core$IFn$_invoke$arity$2 ? log_warn.cljs$core$IFn$_invoke$arity$2("[discord-gateway] reaction ingest failed",error) : log_warn.call(null,"[discord-gateway] reaction ingest failed",error));
} else {
return null;
}
} else {
throw e33203;

}
}});
knoxx.backend.domain.discord.gateway.handle_client_error = (function knoxx$backend$domain$discord$gateway$handle_client_error(log_error,error){
if(cljs.core.truth_(log_error)){
return (log_error.cljs$core$IFn$_invoke$arity$2 ? log_error.cljs$core$IFn$_invoke$arity$2("[discord-gateway] client error",error) : log_error.call(null,"[discord-gateway] client error",error));
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.handle_voice_state_update = (function knoxx$backend$domain$discord$gateway$handle_voice_state_update(notify_voice_state,old_state,new_state){
return (notify_voice_state.cljs$core$IFn$_invoke$arity$2 ? notify_voice_state.cljs$core$IFn$_invoke$arity$2(old_state,new_state) : notify_voice_state.call(null,old_state,new_state));
});
/**
 * Create a new discord.js Client and attach event listeners.
 */
knoxx.backend.domain.discord.gateway.build_discord_client = (function knoxx$backend$domain$discord$gateway$build_discord_client(log,notify_message,notify_reaction,notify_voice_state){
var Client = knoxx.backend.domain.discord.gateway.Client_class();
var GatewayIntentBits = knoxx.backend.domain.discord.gateway.intent_bits();
var Partials = knoxx.backend.domain.discord.gateway.partials_enum();
var Events = knoxx.backend.domain.discord.gateway.events_enum();
var log_info = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"info","info",-317069002));
var log_warn = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"warn","warn",-436710552));
var log_error = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"error","error",-978969032));
var next_client = (new Client(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"intents","intents",-1002507708),new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.DirectMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.DirectMessageReactions,GatewayIntentBits.GuildVoiceStates,GatewayIntentBits.MessageContent], null),new cljs.core.Keyword(null,"partials","partials",-1361599690),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [Partials.Channel,Partials.Message,Partials.Reaction], null)], null))));
next_client.on(Events.ClientReady,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.handle_client_ready,log_info));

next_client.on(Events.MessageCreate,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.handle_message_create,notify_message));

next_client.on(Events.MessageReactionAdd,cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.handle_reaction_add,log_warn,notify_reaction));

next_client.on(Events.Error,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.handle_client_error,log_error));

next_client.on(Events.VoiceStateUpdate,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.handle_voice_state_update,notify_voice_state));

return next_client;
});
knoxx.backend.domain.discord.gateway.ensure_client_BANG_ = (async function knoxx$backend$domain$discord$gateway$ensure_client_BANG_(client_state,ready_promise){
if(cljs.core.truth_(cljs.core.deref(client_state))){
} else {
throw (new Error("Discord gateway client is not started"));
}

if(cljs.core.truth_(cljs.core.deref(ready_promise))){
(await cljs.core.deref(ready_promise));
} else {
}

return cljs.core.deref(client_state);
});
knoxx.backend.domain.discord.gateway.reset_client_state_BANG_ = (function knoxx$backend$domain$discord$gateway$reset_client_state_BANG_(client_state,ready_promise,current_token){
cljs.core.reset_BANG_(client_state,null);

cljs.core.reset_BANG_(ready_promise,null);

return cljs.core.reset_BANG_(current_token,null);
});
knoxx.backend.domain.discord.gateway.log_login_failed_BANG_ = (function knoxx$backend$domain$discord$gateway$log_login_failed_BANG_(log,error){
var temp__5825__auto__ = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"error","error",-978969032));
if(cljs.core.truth_(temp__5825__auto__)){
var log_error = temp__5825__auto__;
return log_error("[discord-gateway] login failed",error);
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.login_client_BANG_ = (async function knoxx$backend$domain$discord$gateway$login_client_BANG_(client_state,ready_promise,current_token,log,new_client,token){
try{(await new_client.login(token));

return new_client;
}catch (e33243){if((e33243 instanceof Error)){
var error = e33243;
knoxx.backend.domain.discord.gateway.log_login_failed_BANG_(log,error);

try{new_client.destroy();
}catch (e33248){if((e33248 instanceof Error)){
var __33776 = e33248;
} else {
throw e33248;

}
}
knoxx.backend.domain.discord.gateway.reset_client_state_BANG_(client_state,ready_promise,current_token);

throw error;
} else {
throw e33243;

}
}});
/**
 * Start the gateway client with a bot token.
 */
knoxx.backend.domain.discord.gateway.gw_start = (async function knoxx$backend$domain$discord$gateway$gw_start(client_state,ready_promise,current_token,_listeners,log,this_stop,build_client,token){
var next_token = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = token;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).trim();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(next_token,"")){
(await (this_stop.cljs$core$IFn$_invoke$arity$0 ? this_stop.cljs$core$IFn$_invoke$arity$0() : this_stop.call(null)));

return null;
} else {
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = cljs.core.deref(client_state);
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(current_token),next_token);
} else {
return and__5160__auto__;
}
})()))){
if(cljs.core.truth_(cljs.core.deref(ready_promise))){
return (await cljs.core.deref(ready_promise));
} else {
return cljs.core.deref(client_state);
}
} else {
(await (this_stop.cljs$core$IFn$_invoke$arity$0 ? this_stop.cljs$core$IFn$_invoke$arity$0() : this_stop.call(null)));

cljs.core.reset_BANG_(current_token,next_token);

var new_client = (build_client.cljs$core$IFn$_invoke$arity$0 ? build_client.cljs$core$IFn$_invoke$arity$0() : build_client.call(null));
var login_promise = knoxx.backend.domain.discord.gateway.login_client_BANG_(client_state,ready_promise,current_token,log,new_client,next_token);
cljs.core.reset_BANG_(client_state,new_client);

cljs.core.reset_BANG_(ready_promise,login_promise);

return (await login_promise);

}
}
});
/**
 * Stop the gateway client.
 */
knoxx.backend.domain.discord.gateway.gw_stop = (async function knoxx$backend$domain$discord$gateway$gw_stop(client_state,ready_promise,current_token){
var temp__5825__auto___33777 = cljs.core.deref(client_state);
if(cljs.core.truth_(temp__5825__auto___33777)){
var client_33778 = temp__5825__auto___33777;
try{(await client_33778.destroy());
}catch (e33260){if((e33260 instanceof Error)){
var __33779 = e33260;
} else {
throw e33260;

}
}} else {
}

knoxx.backend.domain.discord.gateway.reset_client_state_BANG_(client_state,ready_promise,current_token);

return null;
});
/**
 * Get gateway status.
 */
knoxx.backend.domain.discord.gateway.gw_status = (function knoxx$backend$domain$discord$gateway$gw_status(client_state){
var c = cljs.core.deref(client_state);
var G__33264 = ({"started": (!((c == null))), "ready": false, "userId": null, "userTag": null, "guildCount": (0)});
if(cljs.core.truth_(c)){
var G__33266 = G__33264;
(G__33266["ready"] = (function (){try{return c.isReady();
}catch (e33267){if((e33267 instanceof Error)){
var _ = e33267;
return false;
} else {
throw e33267;

}
}})());

(G__33266["userId"] = (function (){try{return c.user.id;
}catch (e33268){if((e33268 instanceof Error)){
var _ = e33268;
return null;
} else {
throw e33268;

}
}})());

(G__33266["userTag"] = (function (){try{return c.user.tag;
}catch (e33272){if((e33272 instanceof Error)){
var _ = e33272;
return null;
} else {
throw e33272;

}
}})());

(G__33266["guildCount"] = (function (){try{return c.guilds.cache.size;
}catch (e33274){if((e33274 instanceof Error)){
var _ = e33274;
return (0);
} else {
throw e33274;

}
}})());

return G__33266;
} else {
return G__33264;
}
});
knoxx.backend.domain.discord.gateway.guild__GT_server = (function knoxx$backend$domain$discord$gateway$guild__GT_server(guild){
return ({"id": guild.id, "name": guild.name, "memberCount": (function (){var or__5162__auto__ = guild.memberCount;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})()});
});
/**
 * List all guilds the bot is in.
 */
knoxx.backend.domain.discord.gateway.gw_list_servers = (async function knoxx$backend$domain$discord$gateway$gw_list_servers(ensure_client){
var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
return cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((await (async function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$gw_list_servers_$_iter__33308(s__33309){
return (new cljs.core.LazySeq(null,(function (){
var s__33309__$1 = s__33309;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33309__$1);
if(temp__5825__auto__){
var s__33309__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33309__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33309__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33311 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33310 = (0);
while(true){
if((i__33310 < size__5648__auto__)){
var vec__33317 = cljs.core._nth(c__5647__auto__,i__33310);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33317,(0),null);
var guild = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33317,(1),null);
cljs.core.chunk_append(b__33311,knoxx.backend.domain.discord.gateway.guild__GT_server(guild));

var G__33780 = (i__33310 + (1));
i__33310 = G__33780;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33311),knoxx$backend$domain$discord$gateway$gw_list_servers_$_iter__33308(cljs.core.chunk_rest(s__33309__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33311),null);
}
} else {
var vec__33321 = cljs.core.first(s__33309__$2);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33321,(0),null);
var guild = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33321,(1),null);
return cljs.core.cons(knoxx.backend.domain.discord.gateway.guild__GT_server(guild),knoxx$backend$domain$discord$gateway$gw_list_servers_$_iter__33308(cljs.core.rest(s__33309__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(active_client.guilds.cache);
})()));
});
knoxx.backend.domain.discord.gateway.guild_channel_entry = (function knoxx$backend$domain$discord$gateway$guild_channel_entry(guild,channel){
return ({"id": channel.id, "name": (function (){var or__5162__auto__ = channel.name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(), "guildId": guild.id, "type": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel.type))});
});
knoxx.backend.domain.discord.gateway.listing_channel_QMARK_ = (function knoxx$backend$domain$discord$gateway$listing_channel_QMARK_(ChannelType,channel){
var and__5160__auto__ = channel;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = knoxx.backend.domain.discord.gateway.readable_text_channel_QMARK_(channel);
if(cljs.core.truth_(and__5160__auto____$1)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(channel.type,ChannelType.DM);
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
});
knoxx.backend.domain.discord.gateway.collect_guild_channels_BANG_ = (async function knoxx$backend$domain$discord$gateway$collect_guild_channels_BANG_(ChannelType,guild){
var fetched = (await guild.channels.fetch());
return cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((await (async function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$collect_guild_channels_BANG__$_iter__33361(s__33362){
return (new cljs.core.LazySeq(null,(function (){
var s__33362__$1 = s__33362;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33362__$1);
if(temp__5825__auto__){
var s__33362__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33362__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33362__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33364 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33363 = (0);
while(true){
if((i__33363 < size__5648__auto__)){
var vec__33367 = cljs.core._nth(c__5647__auto__,i__33363);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33367,(0),null);
var channel = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33367,(1),null);
if(cljs.core.truth_(knoxx.backend.domain.discord.gateway.listing_channel_QMARK_(ChannelType,channel))){
cljs.core.chunk_append(b__33364,knoxx.backend.domain.discord.gateway.guild_channel_entry(guild,channel));

var G__33782 = (i__33363 + (1));
i__33363 = G__33782;
continue;
} else {
var G__33783 = (i__33363 + (1));
i__33363 = G__33783;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33364),knoxx$backend$domain$discord$gateway$collect_guild_channels_BANG__$_iter__33361(cljs.core.chunk_rest(s__33362__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33364),null);
}
} else {
var vec__33372 = cljs.core.first(s__33362__$2);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33372,(0),null);
var channel = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33372,(1),null);
if(cljs.core.truth_(knoxx.backend.domain.discord.gateway.listing_channel_QMARK_(ChannelType,channel))){
return cljs.core.cons(knoxx.backend.domain.discord.gateway.guild_channel_entry(guild,channel),knoxx$backend$domain$discord$gateway$collect_guild_channels_BANG__$_iter__33361(cljs.core.rest(s__33362__$2)));
} else {
var G__33784 = cljs.core.rest(s__33362__$2);
s__33362__$1 = G__33784;
continue;
}
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(fetched);
})()));
});
knoxx.backend.domain.discord.gateway.concat_js_arrays = (function knoxx$backend$domain$discord$gateway$concat_js_arrays(arrays){
var flat = cljs.core.atom.cljs$core$IFn$_invoke$arity$1([]);
var seq__33379_33785 = cljs.core.seq(arrays);
var chunk__33380_33786 = null;
var count__33381_33787 = (0);
var i__33382_33788 = (0);
while(true){
if((i__33382_33788 < count__33381_33787)){
var arr_33789 = chunk__33380_33786.cljs$core$IIndexed$_nth$arity$2(null,i__33382_33788);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(flat,((function (seq__33379_33785,chunk__33380_33786,count__33381_33787,i__33382_33788,arr_33789,flat){
return (function (acc){
return acc.concat(arr_33789);
});})(seq__33379_33785,chunk__33380_33786,count__33381_33787,i__33382_33788,arr_33789,flat))
);


var G__33790 = seq__33379_33785;
var G__33791 = chunk__33380_33786;
var G__33792 = count__33381_33787;
var G__33793 = (i__33382_33788 + (1));
seq__33379_33785 = G__33790;
chunk__33380_33786 = G__33791;
count__33381_33787 = G__33792;
i__33382_33788 = G__33793;
continue;
} else {
var temp__5825__auto___33794 = cljs.core.seq(seq__33379_33785);
if(temp__5825__auto___33794){
var seq__33379_33795__$1 = temp__5825__auto___33794;
if(cljs.core.chunked_seq_QMARK_(seq__33379_33795__$1)){
var c__5694__auto___33796 = cljs.core.chunk_first(seq__33379_33795__$1);
var G__33797 = cljs.core.chunk_rest(seq__33379_33795__$1);
var G__33798 = c__5694__auto___33796;
var G__33799 = cljs.core.count(c__5694__auto___33796);
var G__33800 = (0);
seq__33379_33785 = G__33797;
chunk__33380_33786 = G__33798;
count__33381_33787 = G__33799;
i__33382_33788 = G__33800;
continue;
} else {
var arr_33801 = cljs.core.first(seq__33379_33795__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(flat,((function (seq__33379_33785,chunk__33380_33786,count__33381_33787,i__33382_33788,arr_33801,seq__33379_33795__$1,temp__5825__auto___33794,flat){
return (function (acc){
return acc.concat(arr_33801);
});})(seq__33379_33785,chunk__33380_33786,count__33381_33787,i__33382_33788,arr_33801,seq__33379_33795__$1,temp__5825__auto___33794,flat))
);


var G__33802 = cljs.core.next(seq__33379_33795__$1);
var G__33803 = null;
var G__33804 = (0);
var G__33805 = (0);
seq__33379_33785 = G__33802;
chunk__33380_33786 = G__33803;
count__33381_33787 = G__33804;
i__33382_33788 = G__33805;
continue;
}
} else {
}
}
break;
}

return cljs.core.deref(flat);
});
knoxx.backend.domain.discord.gateway.safe_collect_guild_channels_BANG_ = (async function knoxx$backend$domain$discord$gateway$safe_collect_guild_channels_BANG_(log,ChannelType,guild){
try{return (await knoxx.backend.domain.discord.gateway.collect_guild_channels_BANG_(ChannelType,guild));
}catch (e33390){if((e33390 instanceof Error)){
var err = e33390;
var temp__5825__auto___33806 = knoxx.backend.domain.discord.gateway.log_fn(log,new cljs.core.Keyword(null,"warn","warn",-436710552));
if(cljs.core.truth_(temp__5825__auto___33806)){
var log_warn_33807 = temp__5825__auto___33806;
log_warn_33807("[discord-gateway] listChannels guild failed",guild.id,err);
} else {
}

return [];
} else {
throw e33390;

}
}});
knoxx.backend.domain.discord.gateway.list_all_guild_channels_BANG_ = (async function knoxx$backend$domain$discord$gateway$list_all_guild_channels_BANG_(active_client,log,ChannelType){
var promises = cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__33391){
var vec__33392 = p__33391;
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33392,(0),null);
var guild = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33392,(1),null);
return knoxx.backend.domain.discord.gateway.safe_collect_guild_channels_BANG_(log,ChannelType,guild);
}),active_client.guilds.cache));
var results = (await Promise.all(promises));
return knoxx.backend.domain.discord.gateway.concat_js_arrays(results);
});
/**
 * List channels in a guild or all guilds.
 */
knoxx.backend.domain.discord.gateway.gw_list_channels = (async function knoxx$backend$domain$discord$gateway$gw_list_channels(ensure_client,log,guild_id){
var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
var ChannelType = knoxx.backend.domain.discord.gateway.channel_type_enum();
if(cljs.core.truth_(guild_id)){
var guild = active_client.guilds.cache.get(guild_id);
if(cljs.core.truth_(guild)){
} else {
throw (new Error((""+"Guild not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id))));
}

return (await knoxx.backend.domain.discord.gateway.collect_guild_channels_BANG_(ChannelType,guild));
} else {
return (await knoxx.backend.domain.discord.gateway.list_all_guild_channels_BANG_(active_client,log,ChannelType));
}
});
knoxx.backend.domain.discord.gateway.js_opt = (function knoxx$backend$domain$discord$gateway$js_opt(opts,k){
if(cljs.core.truth_(opts)){
return (opts[k]);
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.bounded_limit = (function knoxx$backend$domain$discord$gateway$bounded_limit(opts,default_limit){
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(function (){var or__5162__auto__ = knoxx.backend.domain.discord.gateway.js_opt(opts,"limit");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default_limit;
}
})()));
});
knoxx.backend.domain.discord.gateway.message_fetch_options = (function knoxx$backend$domain$discord$gateway$message_fetch_options(opts){
return cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.discord.gateway.bounded_limit(opts,(50)),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.gateway.js_opt(opts,"before"),new cljs.core.Keyword(null,"after","after",594996914),knoxx.backend.domain.discord.gateway.js_opt(opts,"after"),new cljs.core.Keyword(null,"around","around",-265975553),knoxx.backend.domain.discord.gateway.js_opt(opts,"around")], null));
});
knoxx.backend.domain.discord.gateway.messages_array = (function knoxx$backend$domain$discord$gateway$messages_array(fetched){
return knoxx.backend.domain.discord.gateway.sort_newest_first(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.map_message,(function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$messages_array_$_iter__33408(s__33409){
return (new cljs.core.LazySeq(null,(function (){
var s__33409__$1 = s__33409;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33409__$1);
if(temp__5825__auto__){
var s__33409__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33409__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33409__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33411 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33410 = (0);
while(true){
if((i__33410 < size__5648__auto__)){
var vec__33421 = cljs.core._nth(c__5647__auto__,i__33410);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33421,(0),null);
var msg = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33421,(1),null);
cljs.core.chunk_append(b__33411,msg);

var G__33808 = (i__33410 + (1));
i__33410 = G__33808;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33411),knoxx$backend$domain$discord$gateway$messages_array_$_iter__33408(cljs.core.chunk_rest(s__33409__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33411),null);
}
} else {
var vec__33424 = cljs.core.first(s__33409__$2);
var _id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33424,(0),null);
var msg = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33424,(1),null);
return cljs.core.cons(msg,knoxx$backend$domain$discord$gateway$messages_array_$_iter__33408(cljs.core.rest(s__33409__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(fetched);
})()));
});
knoxx.backend.domain.discord.gateway.fetch_readable_channel_BANG_ = (async function knoxx$backend$domain$discord$gateway$fetch_readable_channel_BANG_(active_client,channel_id){
var channel = (await active_client.channels.fetch(channel_id));
if(((cljs.core.not(channel)) || (cljs.core.not(knoxx.backend.domain.discord.gateway.readable_text_channel_QMARK_(channel))))){
throw (new Error((""+"Channel not found or not text-based: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id))));
} else {
}

return channel;
});
/**
 * Fetch messages from a channel.
 */
knoxx.backend.domain.discord.gateway.gw_fetch_channel_messages = (async function knoxx$backend$domain$discord$gateway$gw_fetch_channel_messages(ensure_client,channel_id,opts){
var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
var channel = (await knoxx.backend.domain.discord.gateway.fetch_readable_channel_BANG_(active_client,channel_id));
var fetched = (await channel.messages.fetch(knoxx.backend.domain.discord.gateway.message_fetch_options(opts)));
return knoxx.backend.domain.discord.gateway.messages_array(fetched);
});
knoxx.backend.domain.discord.gateway.dm_message_options = (function knoxx$backend$domain$discord$gateway$dm_message_options(opts){
return cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.discord.gateway.bounded_limit(opts,(50)),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.gateway.js_opt(opts,"before")], null));
});
knoxx.backend.domain.discord.gateway.dm_messages_response = (function knoxx$backend$domain$discord$gateway$dm_messages_response(dm,fetched){
return ({"dmChannelId": dm.id, "messages": knoxx.backend.domain.discord.gateway.messages_array(fetched)});
});
/**
 * Fetch DM messages with a user.
 */
knoxx.backend.domain.discord.gateway.gw_fetch_dm_messages = (async function knoxx$backend$domain$discord$gateway$gw_fetch_dm_messages(ensure_client,user_id,opts){
var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
var user = (await active_client.users.fetch(user_id));
var dm = (await user.createDM());
var fetched = (await dm.messages.fetch(knoxx.backend.domain.discord.gateway.dm_message_options(opts)));
return knoxx.backend.domain.discord.gateway.dm_messages_response(dm,fetched);
});
/**
 * Create a filter function for message search.
 */
knoxx.backend.domain.discord.gateway.search_filter_fn = (function knoxx$backend$domain$discord$gateway$search_filter_fn(opts){
var needle = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.domain.discord.gateway.js_opt(opts,"query");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())).toLowerCase();
var target_user_id = knoxx.backend.domain.discord.gateway.js_opt(opts,"userId");
return (function (message){
var content_ok = (function (){var or__5162__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(needle,"");
if(or__5162__auto__){
return or__5162__auto__;
} else {
return (function (){var or__5162__auto____$1 = (message["content"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
})().toLowerCase().includes(needle);
}
})();
var author_ok = ((cljs.core.not(target_user_id)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((message["authorId"]),target_user_id)));
var and__5160__auto__ = content_ok;
if(cljs.core.truth_(and__5160__auto__)){
return author_ok;
} else {
return and__5160__auto__;
}
});
});
knoxx.backend.domain.discord.gateway.search_limit = (function knoxx$backend$domain$discord$gateway$search_limit(opts){
var or__5162__auto__ = knoxx.backend.domain.discord.gateway.js_opt(opts,"limit");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (50);
}
});
knoxx.backend.domain.discord.gateway.search_result = (function knoxx$backend$domain$discord$gateway$search_result(source,key_name,key_value,messages,opts){
var filtered = messages.filter(knoxx.backend.domain.discord.gateway.search_filter_fn(opts));
var limit = knoxx.backend.domain.discord.gateway.search_limit(opts);
var result = ({"messages": filtered.slice((0),limit), "count": cljs.core.min.cljs$core$IFn$_invoke$arity$2(filtered.length,limit), "source": source});
(result[key_name] = key_value);

return result;
});
/**
 * Search messages in a channel or DM.
 */
knoxx.backend.domain.discord.gateway.gw_search_messages = (async function knoxx$backend$domain$discord$gateway$gw_search_messages(this_fn,scope,opts){
var normalized_scope = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = scope;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "channel";
}
})()))).toLowerCase();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(normalized_scope,"dm")){
var result = (await this_fn.fetchDmMessages(knoxx.backend.domain.discord.gateway.js_opt(opts,"userId"),cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(100),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.gateway.js_opt(opts,"before")], null))));
return knoxx.backend.domain.discord.gateway.search_result("gateway-cache","dmChannelId",(result["dmChannelId"]),(result["messages"]),opts);
} else {
var messages = (await this_fn.fetchChannelMessages(knoxx.backend.domain.discord.gateway.js_opt(opts,"channelId"),cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(100),new cljs.core.Keyword(null,"before","before",-1633692388),knoxx.backend.domain.discord.gateway.js_opt(opts,"before"),new cljs.core.Keyword(null,"after","after",594996914),knoxx.backend.domain.discord.gateway.js_opt(opts,"after")], null))));
return knoxx.backend.domain.discord.gateway.search_result("gateway-cache","channelId",knoxx.backend.domain.discord.gateway.js_opt(opts,"channelId"),messages,opts);
}
});
knoxx.backend.domain.discord.gateway.attachment_count = (function knoxx$backend$domain$discord$gateway$attachment_count(attachments){
if((attachments == null)){
return (0);
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(attachments))){
return attachments.length;
} else {
return cljs.core.count(attachments);

}
}
});
knoxx.backend.domain.discord.gateway.message_body_text = (function knoxx$backend$domain$discord$gateway$message_body_text(text,attachments){
var base_text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(((clojure.string.blank_QMARK_(base_text)) && (cljs.core.seq(attachments)))){
return "[attachment]";
} else {
return base_text;
}
});
knoxx.backend.domain.discord.gateway.send_message_payload = (function knoxx$backend$domain$discord$gateway$send_message_payload(chunk,index,reply_to,attachments){
var payload = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content","content",15833224),chunk], null));
if(cljs.core.truth_((function (){var and__5160__auto__ = (index === (0));
if(and__5160__auto__){
return reply_to;
} else {
return and__5160__auto__;
}
})())){
(payload["reply"] = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"messageReference","messageReference",-2136149455),reply_to], null)));
} else {
}

if((((index === (0))) && (cljs.core.seq(attachments)))){
(payload["files"] = cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.discord_file_payload,attachments)));
} else {
}

return payload;
});
knoxx.backend.domain.discord.gateway.send_message_chunks_BANG_ = (async function knoxx$backend$domain$discord$gateway$send_message_chunks_BANG_(channel,chunks,reply_to,attachments){
var seq__33453 = cljs.core.seq(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(chunks)));
var chunk__33454 = null;
var count__33455 = (0);
var i__33456 = (0);
while(true){
if((i__33456 < count__33455)){
var vec__33468 = chunk__33454.cljs$core$IIndexed$_nth$arity$2(null,i__33456);
var index = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33468,(0),null);
var chunk = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33468,(1),null);
(await channel.send(knoxx.backend.domain.discord.gateway.send_message_payload(chunk,index,reply_to,attachments)));


var G__33816 = seq__33453;
var G__33817 = chunk__33454;
var G__33818 = count__33455;
var G__33819 = (i__33456 + (1));
seq__33453 = G__33816;
chunk__33454 = G__33817;
count__33455 = G__33818;
i__33456 = G__33819;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__33453);
if(temp__5825__auto__){
var seq__33453__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__33453__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__33453__$1);
var G__33820 = cljs.core.chunk_rest(seq__33453__$1);
var G__33821 = c__5694__auto__;
var G__33822 = cljs.core.count(c__5694__auto__);
var G__33823 = (0);
seq__33453 = G__33820;
chunk__33454 = G__33821;
count__33455 = G__33822;
i__33456 = G__33823;
continue;
} else {
var vec__33473 = cljs.core.first(seq__33453__$1);
var index = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33473,(0),null);
var chunk = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33473,(1),null);
(await channel.send(knoxx.backend.domain.discord.gateway.send_message_payload(chunk,index,reply_to,attachments)));


var G__33824 = cljs.core.next(seq__33453__$1);
var G__33825 = null;
var G__33826 = (0);
var G__33827 = (0);
seq__33453 = G__33824;
chunk__33454 = G__33825;
count__33455 = G__33826;
i__33456 = G__33827;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.domain.discord.gateway.send_message_result = (function knoxx$backend$domain$discord$gateway$send_message_result(channel_id,chunks,attachments){
return ({"channelId": channel_id, "messageId": "", "sent": true, "timestamp": (new Date()).toISOString(), "chunkCount": chunks.length, "attachmentCount": knoxx.backend.domain.discord.gateway.attachment_count(attachments)});
});
/**
 * Send a message to a channel, splitting into chunks if needed.
 */
knoxx.backend.domain.discord.gateway.gw_send_message = (async function knoxx$backend$domain$discord$gateway$gw_send_message(ensure_client,channel_id,text,reply_to,attachments){
var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
var channel = (await knoxx.backend.domain.discord.gateway.fetch_readable_channel_BANG_(active_client,channel_id));
var chunks = knoxx.backend.domain.discord.gateway.split_message(knoxx.backend.domain.discord.gateway.message_body_text(text,attachments));
(await knoxx.backend.domain.discord.gateway.send_message_chunks_BANG_(channel,chunks,reply_to,attachments));

return knoxx.backend.domain.discord.gateway.send_message_result(channel_id,chunks,attachments);
});
knoxx.backend.domain.discord.gateway.voice_connection_guild_id = (function knoxx$backend$domain$discord$gateway$voice_connection_guild_id(conn){
var or__5162__auto__ = conn.__guildId;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__33481 = conn;
var G__33481__$1 = (((G__33481 == null))?null:G__33481.joinConfig);
if((G__33481__$1 == null)){
return null;
} else {
return G__33481__$1.guildId;
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return conn.guildId;
}
}
});
knoxx.backend.domain.discord.gateway.join_voice_connection_BANG_ = (function knoxx$backend$domain$discord$gateway$join_voice_connection_BANG_(channel_id,channel,guild_id){
var conn = shadow.esm.esm_import$$discordjs$voice.joinVoiceChannel(({"channelId": channel_id, "guildId": guild_id, "adapterCreator": channel.guild.voiceAdapterCreator, "selfDeaf": false, "selfMute": false}));
(conn["__guildId"] = guild_id);

return conn;
});
knoxx.backend.domain.discord.gateway.wait_for_voice_ready_BANG_ = (async function knoxx$backend$domain$discord$gateway$wait_for_voice_ready_BANG_(conn){
try{(await shadow.esm.esm_import$$discordjs$voice.entersState(conn,shadow.esm.esm_import$$discordjs$voice.VoiceConnectionStatus.Ready,(15000)));

console.log("[voice:gw] voice connection ready for guild:",knoxx.backend.domain.discord.gateway.voice_connection_guild_id(conn));

return conn;
}catch (e33485){if((e33485 instanceof Error)){
var err = e33485;
console.error("[voice:gw] voice connection failed to ready:",err.message);

throw err;
} else {
throw e33485;

}
}});
/**
 * Join a voice channel. Returns a VoiceConnection.
 */
knoxx.backend.domain.discord.gateway.gw_join_voice = (async function knoxx$backend$domain$discord$gateway$gw_join_voice(ensure_client,channel_id){
console.log("[voice:gw] joining channel:",channel_id);

var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
var channel = (await active_client.channels.fetch(channel_id));
if(cljs.core.truth_(channel)){
} else {
console.error("[voice:gw] channel not found:",channel_id);

throw (new Error((""+"Channel not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id))));
}

var guild_id = channel.guildId;
var conn = knoxx.backend.domain.discord.gateway.join_voice_connection_BANG_(channel_id,channel,guild_id);
console.log("[voice:gw] channel found:",channel_id,"guild:",guild_id,"selfDeaf:false");

console.log("[voice:gw] joinVoiceChannel returned, waiting for ready state\u2026");

return (await knoxx.backend.domain.discord.gateway.wait_for_voice_ready_BANG_(conn));
});
/**
 * Leave a voice channel for a guild.
 */
knoxx.backend.domain.discord.gateway.gw_leave_voice = (function knoxx$backend$domain$discord$gateway$gw_leave_voice(connections,guild_id){
var temp__5825__auto___33834 = connections.get(guild_id);
if(cljs.core.truth_(temp__5825__auto___33834)){
var conn_33835 = temp__5825__auto___33834;
conn_33835.destroy();

connections.delete(guild_id);
} else {
}

return Promise.resolve(true);
});
/**
 * Play an audio buffer (PCM s16le 48kHz stereo or any ffmpeg-decodable) in the voice connection.
 */
knoxx.backend.domain.discord.gateway.gw_play_audio = (function knoxx$backend$domain$discord$gateway$gw_play_audio(connections,guild_id,audio_buffer){
var conn = connections.get(guild_id);
if(cljs.core.not(conn)){
return Promise.reject((new Error((""+"No voice connection for guild: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id)))));
} else {
var player = (function (){var or__5162__auto__ = conn.__audioPlayer;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var p = shadow.esm.esm_import$$discordjs$voice.createAudioPlayer();
(conn["__audioPlayer"] = p);

conn.subscribe(p);

return p;
}
})();
var stream = (new shadow.esm.esm_import$node_stream.Readable(({"read": (function (){
return null;
})})));
var _ = (function (){
stream.push(audio_buffer);

return stream.push(null);
})()
;
var resource = shadow.esm.esm_import$$discordjs$voice.createAudioResource(stream,({"inputType": (shadow.esm.esm_import$$discordjs$voice["StreamType"]).Arbitrary}));
player.play(resource);

return Promise.resolve(true);
}
});
/**
 * Subscribe to audio from a specific user. Returns an unsubscribe function.
 */
knoxx.backend.domain.discord.gateway.gw_subscribe_voice = (function knoxx$backend$domain$discord$gateway$gw_subscribe_voice(connections,guild_id,user_id,callback){
var conn = connections.get(guild_id);
if(cljs.core.not(conn)){
return Promise.reject((new Error((""+"No voice connection for guild: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id)))));
} else {
var receiver = conn.receiver;
var opus_stream = receiver.subscribe(user_id,({"mode": "opus"}));
opus_stream.on("data",(function (chunk){
return (callback.cljs$core$IFn$_invoke$arity$2 ? callback.cljs$core$IFn$_invoke$arity$2(user_id,chunk) : callback.call(null,user_id,chunk));
}));

return Promise.resolve((function (){
return opus_stream.destroy();
}));
}
});
knoxx.backend.domain.discord.gateway.voice_member_entry = (function knoxx$backend$domain$discord$gateway$voice_member_entry(member){
var user = member.user;
return ({"userId": user.id, "username": user.username, "displayName": (function (){var or__5162__auto__ = member.displayName;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return user.username;
}
})(), "isBot": cljs.core.boolean$(user.bot), "isMuted": cljs.core.boolean$(member.mute), "isDeaf": cljs.core.boolean$(member.deaf), "isSpeaking": false});
});
knoxx.backend.domain.discord.gateway.fetch_guild_BANG_ = (async function knoxx$backend$domain$discord$gateway$fetch_guild_BANG_(active_client,guild_id){
var guild = (await active_client.guilds.fetch(guild_id));
if(cljs.core.truth_(guild)){
} else {
throw (new Error((""+"Guild not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id))));
}

return guild;
});
knoxx.backend.domain.discord.gateway.fetch_guild_channel_BANG_ = (async function knoxx$backend$domain$discord$gateway$fetch_guild_channel_BANG_(guild,channel_id){
var channel = (await guild.channels.fetch(channel_id));
if(cljs.core.truth_(channel)){
} else {
throw (new Error((""+"Channel not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channel_id))));
}

return channel;
});
/**
 * List members in a voice channel.
 */
knoxx.backend.domain.discord.gateway.gw_list_voice_members = (async function knoxx$backend$domain$discord$gateway$gw_list_voice_members(ensure_client,guild_id,channel_id){
var active_client = (await (ensure_client.cljs$core$IFn$_invoke$arity$0 ? ensure_client.cljs$core$IFn$_invoke$arity$0() : ensure_client.call(null)));
var guild = (await knoxx.backend.domain.discord.gateway.fetch_guild_BANG_(active_client,guild_id));
var channel = (await knoxx.backend.domain.discord.gateway.fetch_guild_channel_BANG_(guild,channel_id));
return cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((await (async function (){var iter__5649__auto__ = (function knoxx$backend$domain$discord$gateway$gw_list_voice_members_$_iter__33516(s__33517){
return (new cljs.core.LazySeq(null,(function (){
var s__33517__$1 = s__33517;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33517__$1);
if(temp__5825__auto__){
var s__33517__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33517__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33517__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33519 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33518 = (0);
while(true){
if((i__33518 < size__5648__auto__)){
var vec__33521 = cljs.core._nth(c__5647__auto__,i__33518);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33521,(0),null);
var member = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33521,(1),null);
cljs.core.chunk_append(b__33519,knoxx.backend.domain.discord.gateway.voice_member_entry(member));

var G__33841 = (i__33518 + (1));
i__33518 = G__33841;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33519),knoxx$backend$domain$discord$gateway$gw_list_voice_members_$_iter__33516(cljs.core.chunk_rest(s__33517__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33519),null);
}
} else {
var vec__33524 = cljs.core.first(s__33517__$2);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33524,(0),null);
var member = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33524,(1),null);
return cljs.core.cons(knoxx.backend.domain.discord.gateway.voice_member_entry(member),knoxx$backend$domain$discord$gateway$gw_list_voice_members_$_iter__33516(cljs.core.rest(s__33517__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(channel.members);
})()));
});
knoxx.backend.domain.discord.gateway.voice_listener_create_decoder = (function knoxx$backend$domain$discord$gateway$voice_listener_create_decoder(){
var OpusDecoder = (function (){var G__33527 = shadow.esm.esm_import$prism_media;
var G__33527__$1 = (((G__33527 == null))?null:(G__33527["opus"]));
if((G__33527__$1 == null)){
return null;
} else {
return (G__33527__$1["Decoder"]);
}
})();
if(cljs.core.fn_QMARK_(OpusDecoder)){
} else {
throw (new Error("prism-media Opus decoder unavailable"));
}

return (new OpusDecoder(({"rate": (48000), "channels": (2), "frameSize": (960)})));
});
knoxx.backend.domain.discord.gateway.voice_listener_flush_audio_BANG_ = (function knoxx$backend$domain$discord$gateway$voice_listener_flush_audio_BANG_(pcm_buffers,silence_timers,on_audio,uid){
var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(pcm_buffers),uid);
if(cljs.core.truth_(temp__5825__auto__)){
var buf = temp__5825__auto__;
var pcm = Buffer.concat(Array.from(buf));
var duration_s = (((pcm.length / knoxx.backend.domain.discord.gateway.voice_listener_sample_rate) / knoxx.backend.domain.discord.gateway.voice_listener_bytes_per_sample) / knoxx.backend.domain.discord.gateway.voice_listener_channels);
var wav = knoxx.backend.domain.discord.gateway.pcm16le__GT_wav_buffer(pcm,knoxx.backend.domain.discord.gateway.voice_listener_sample_rate,knoxx.backend.domain.discord.gateway.voice_listener_channels);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(pcm_buffers,cljs.core.dissoc,uid);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(silence_timers,cljs.core.dissoc,uid);

if((duration_s < knoxx.backend.domain.discord.gateway.voice_listener_min_duration_s)){
return console.log("[voice:listener] skipping very short audio for",uid,"duration:",duration_s,"s");
} else {
console.log("[voice:listener] calling on-audio for",uid,"wav bytes:",wav.length,"duration:",duration_s,"s");

return (on_audio.cljs$core$IFn$_invoke$arity$2 ? on_audio.cljs$core$IFn$_invoke$arity$2(uid,wav) : on_audio.call(null,uid,wav));
}
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.voice_listener_chunk_and_flush_BANG_ = (function knoxx$backend$domain$discord$gateway$voice_listener_chunk_and_flush_BANG_(pcm_buffers,on_audio,uid){
var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(pcm_buffers),uid);
if(cljs.core.truth_(temp__5825__auto__)){
var buf = temp__5825__auto__;
var total_pcm = Buffer.concat(Array.from(buf));
var total_len = total_pcm.length;
if((total_len > knoxx.backend.domain.discord.gateway.voice_listener_chunk_overlap_bytes)){
var flush_len = (total_len - knoxx.backend.domain.discord.gateway.voice_listener_chunk_overlap_bytes);
var flush_pcm = total_pcm.slice((0),flush_len);
var keep_pcm = total_pcm.slice(flush_len);
var duration_s = (((flush_len / knoxx.backend.domain.discord.gateway.voice_listener_sample_rate) / knoxx.backend.domain.discord.gateway.voice_listener_bytes_per_sample) / knoxx.backend.domain.discord.gateway.voice_listener_channels);
var overlap_s = (((knoxx.backend.domain.discord.gateway.voice_listener_chunk_overlap_bytes / knoxx.backend.domain.discord.gateway.voice_listener_sample_rate) / knoxx.backend.domain.discord.gateway.voice_listener_bytes_per_sample) / knoxx.backend.domain.discord.gateway.voice_listener_channels);
var wav = knoxx.backend.domain.discord.gateway.pcm16le__GT_wav_buffer(flush_pcm,knoxx.backend.domain.discord.gateway.voice_listener_sample_rate,knoxx.backend.domain.discord.gateway.voice_listener_channels);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(pcm_buffers,cljs.core.assoc,uid,[keep_pcm]);

console.log("[voice:listener] chunk-flush for",uid,"flushed:",duration_s,"s","overlap-kept:",overlap_s,"s");

return (on_audio.cljs$core$IFn$_invoke$arity$2 ? on_audio.cljs$core$IFn$_invoke$arity$2(uid,wav) : on_audio.call(null,uid,wav));
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.voice_listener_destroy_user_streams_BANG_ = (function knoxx$backend$domain$discord$gateway$voice_listener_destroy_user_streams_BANG_(streams,decoders,uid){
var temp__5825__auto___33843 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(streams),uid);
if(cljs.core.truth_(temp__5825__auto___33843)){
var audio_stream_33844 = temp__5825__auto___33843;
try{audio_stream_33844.destroy();
}catch (e33531){if((e33531 instanceof Error)){
var __33845 = e33531;
} else {
throw e33531;

}
}
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(streams,cljs.core.dissoc,uid);
} else {
}

var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(decoders),uid);
if(cljs.core.truth_(temp__5825__auto__)){
var decoder = temp__5825__auto__;
try{decoder.destroy();
}catch (e33535){if((e33535 instanceof Error)){
var __33846 = e33535;
} else {
throw e33535;

}
}
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(decoders,cljs.core.dissoc,uid);
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.voice_listener_on_start_speaking = (function knoxx$backend$domain$discord$gateway$voice_listener_on_start_speaking(receiver,pcm_buffers,streams,decoders,active_users,silence_timers,on_start,on_audio){
return (function (user_id){
var uid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id));
var temp__5825__auto___33847 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(silence_timers),uid);
if(cljs.core.truth_(temp__5825__auto___33847)){
var t_33848 = temp__5825__auto___33847;
clearTimeout(t_33848);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(silence_timers,cljs.core.dissoc,uid);
} else {
}

if(cljs.core.contains_QMARK_(cljs.core.deref(active_users),uid)){
return null;
} else {
console.log("[voice:listener] >>> SPEAKING START:",uid);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(active_users,cljs.core.conj,uid);

if(cljs.core.truth_(on_start)){
(on_start.cljs$core$IFn$_invoke$arity$1 ? on_start.cljs$core$IFn$_invoke$arity$1(uid) : on_start.call(null,uid));
} else {
}

if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(pcm_buffers),uid))){
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(pcm_buffers,cljs.core.assoc,uid,[]);
}

var audio_stream = receiver.subscribe(uid);
var decoder = knoxx.backend.domain.discord.gateway.voice_listener_create_decoder();
audio_stream.pipe(decoder);

decoder.on("data",(function (pcm_chunk){
var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(pcm_buffers),uid);
if(cljs.core.truth_(temp__5825__auto__)){
var buf = temp__5825__auto__;
buf.push(pcm_chunk);

var current_size = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,b){
return (acc + b.length);
}),(0),buf);
if((current_size > knoxx.backend.domain.discord.gateway.voice_listener_chunk_threshold_bytes)){
return knoxx.backend.domain.discord.gateway.voice_listener_chunk_and_flush_BANG_(pcm_buffers,on_audio,uid);
} else {
return null;
}
} else {
return null;
}
}));

decoder.on("error",(function (p1__33536_SHARP_){
return console.error("[voice:listener] decoder error for",uid,":",p1__33536_SHARP_.message);
}));

audio_stream.on("error",(function (p1__33537_SHARP_){
return console.error("[voice:listener] audio stream error for",uid,":",p1__33537_SHARP_.message);
}));

audio_stream.on("end",(function (){
return console.log("[voice:listener] audio stream ended for",uid);
}));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(streams,cljs.core.assoc,uid,audio_stream);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(decoders,cljs.core.assoc,uid,decoder);
}
});
});
knoxx.backend.domain.discord.gateway.voice_listener_on_end_speaking = (function knoxx$backend$domain$discord$gateway$voice_listener_on_end_speaking(streams,decoders,active_users,silence_timers,flush_audio_BANG_){
return (function (user_id){
var uid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id));
console.log("[voice:listener] >>> SPEAKING END:",uid);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(active_users,cljs.core.disj,uid);

knoxx.backend.domain.discord.gateway.voice_listener_destroy_user_streams_BANG_(streams,decoders,uid);

var t = setTimeout((function (){
return (flush_audio_BANG_.cljs$core$IFn$_invoke$arity$1 ? flush_audio_BANG_.cljs$core$IFn$_invoke$arity$1(uid) : flush_audio_BANG_.call(null,uid));
}),knoxx.backend.domain.discord.gateway.voice_listener_silence_debounce_ms);
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(silence_timers,cljs.core.assoc,uid,t);
});
});
knoxx.backend.domain.discord.gateway.voice_listener_stop_BANG_ = (function knoxx$backend$domain$discord$gateway$voice_listener_stop_BANG_(guild_id,speaking_map,on_start_speaking,on_end_speaking,pcm_buffers,streams,decoders,active_users,silence_timers,flush_audio_BANG_){
return (function (){
console.log("[voice:listener] stopping for guild:",guild_id);

speaking_map.removeListener("start",on_start_speaking);

speaking_map.removeListener("end",on_end_speaking);

var seq__33546_33849 = cljs.core.seq(cljs.core.deref(streams));
var chunk__33547_33850 = null;
var count__33548_33851 = (0);
var i__33549_33852 = (0);
while(true){
if((i__33549_33852 < count__33548_33851)){
var vec__33560_33854 = chunk__33547_33850.cljs$core$IIndexed$_nth$arity$2(null,i__33549_33852);
var __33855 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33560_33854,(0),null);
var s_33856 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33560_33854,(1),null);
try{s_33856.destroy();
}catch (e33563){if((e33563 instanceof Error)){
var __33858__$1 = e33563;
} else {
throw e33563;

}
}

var G__33859 = seq__33546_33849;
var G__33860 = chunk__33547_33850;
var G__33861 = count__33548_33851;
var G__33862 = (i__33549_33852 + (1));
seq__33546_33849 = G__33859;
chunk__33547_33850 = G__33860;
count__33548_33851 = G__33861;
i__33549_33852 = G__33862;
continue;
} else {
var temp__5825__auto___33863 = cljs.core.seq(seq__33546_33849);
if(temp__5825__auto___33863){
var seq__33546_33864__$1 = temp__5825__auto___33863;
if(cljs.core.chunked_seq_QMARK_(seq__33546_33864__$1)){
var c__5694__auto___33865 = cljs.core.chunk_first(seq__33546_33864__$1);
var G__33866 = cljs.core.chunk_rest(seq__33546_33864__$1);
var G__33867 = c__5694__auto___33865;
var G__33868 = cljs.core.count(c__5694__auto___33865);
var G__33869 = (0);
seq__33546_33849 = G__33866;
chunk__33547_33850 = G__33867;
count__33548_33851 = G__33868;
i__33549_33852 = G__33869;
continue;
} else {
var vec__33564_33870 = cljs.core.first(seq__33546_33864__$1);
var __33871 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33564_33870,(0),null);
var s_33872 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33564_33870,(1),null);
try{s_33872.destroy();
}catch (e33567){if((e33567 instanceof Error)){
var __33873__$1 = e33567;
} else {
throw e33567;

}
}

var G__33874 = cljs.core.next(seq__33546_33864__$1);
var G__33875 = null;
var G__33876 = (0);
var G__33877 = (0);
seq__33546_33849 = G__33874;
chunk__33547_33850 = G__33875;
count__33548_33851 = G__33876;
i__33549_33852 = G__33877;
continue;
}
} else {
}
}
break;
}

var seq__33569_33878 = cljs.core.seq(cljs.core.deref(decoders));
var chunk__33570_33879 = null;
var count__33571_33880 = (0);
var i__33572_33881 = (0);
while(true){
if((i__33572_33881 < count__33571_33880)){
var vec__33585_33882 = chunk__33570_33879.cljs$core$IIndexed$_nth$arity$2(null,i__33572_33881);
var __33883 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33585_33882,(0),null);
var d_33884 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33585_33882,(1),null);
try{d_33884.destroy();
}catch (e33589){if((e33589 instanceof Error)){
var __33886__$1 = e33589;
} else {
throw e33589;

}
}

var G__33887 = seq__33569_33878;
var G__33888 = chunk__33570_33879;
var G__33889 = count__33571_33880;
var G__33890 = (i__33572_33881 + (1));
seq__33569_33878 = G__33887;
chunk__33570_33879 = G__33888;
count__33571_33880 = G__33889;
i__33572_33881 = G__33890;
continue;
} else {
var temp__5825__auto___33891 = cljs.core.seq(seq__33569_33878);
if(temp__5825__auto___33891){
var seq__33569_33892__$1 = temp__5825__auto___33891;
if(cljs.core.chunked_seq_QMARK_(seq__33569_33892__$1)){
var c__5694__auto___33893 = cljs.core.chunk_first(seq__33569_33892__$1);
var G__33894 = cljs.core.chunk_rest(seq__33569_33892__$1);
var G__33895 = c__5694__auto___33893;
var G__33896 = cljs.core.count(c__5694__auto___33893);
var G__33897 = (0);
seq__33569_33878 = G__33894;
chunk__33570_33879 = G__33895;
count__33571_33880 = G__33896;
i__33572_33881 = G__33897;
continue;
} else {
var vec__33592_33898 = cljs.core.first(seq__33569_33892__$1);
var __33899 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33592_33898,(0),null);
var d_33900 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33592_33898,(1),null);
try{d_33900.destroy();
}catch (e33595){if((e33595 instanceof Error)){
var __33901__$1 = e33595;
} else {
throw e33595;

}
}

var G__33902 = cljs.core.next(seq__33569_33892__$1);
var G__33903 = null;
var G__33904 = (0);
var G__33905 = (0);
seq__33569_33878 = G__33902;
chunk__33570_33879 = G__33903;
count__33571_33880 = G__33904;
i__33572_33881 = G__33905;
continue;
}
} else {
}
}
break;
}

var seq__33597_33906 = cljs.core.seq(cljs.core.deref(silence_timers));
var chunk__33598_33907 = null;
var count__33599_33908 = (0);
var i__33600_33909 = (0);
while(true){
if((i__33600_33909 < count__33599_33908)){
var vec__33609_33910 = chunk__33598_33907.cljs$core$IIndexed$_nth$arity$2(null,i__33600_33909);
var uid_33911 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33609_33910,(0),null);
var t_33912 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33609_33910,(1),null);
clearTimeout(t_33912);

(flush_audio_BANG_.cljs$core$IFn$_invoke$arity$1 ? flush_audio_BANG_.cljs$core$IFn$_invoke$arity$1(uid_33911) : flush_audio_BANG_.call(null,uid_33911));


var G__33913 = seq__33597_33906;
var G__33914 = chunk__33598_33907;
var G__33915 = count__33599_33908;
var G__33916 = (i__33600_33909 + (1));
seq__33597_33906 = G__33913;
chunk__33598_33907 = G__33914;
count__33599_33908 = G__33915;
i__33600_33909 = G__33916;
continue;
} else {
var temp__5825__auto___33917 = cljs.core.seq(seq__33597_33906);
if(temp__5825__auto___33917){
var seq__33597_33918__$1 = temp__5825__auto___33917;
if(cljs.core.chunked_seq_QMARK_(seq__33597_33918__$1)){
var c__5694__auto___33919 = cljs.core.chunk_first(seq__33597_33918__$1);
var G__33920 = cljs.core.chunk_rest(seq__33597_33918__$1);
var G__33921 = c__5694__auto___33919;
var G__33922 = cljs.core.count(c__5694__auto___33919);
var G__33923 = (0);
seq__33597_33906 = G__33920;
chunk__33598_33907 = G__33921;
count__33599_33908 = G__33922;
i__33600_33909 = G__33923;
continue;
} else {
var vec__33622_33924 = cljs.core.first(seq__33597_33918__$1);
var uid_33925 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33622_33924,(0),null);
var t_33926 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33622_33924,(1),null);
clearTimeout(t_33926);

(flush_audio_BANG_.cljs$core$IFn$_invoke$arity$1 ? flush_audio_BANG_.cljs$core$IFn$_invoke$arity$1(uid_33925) : flush_audio_BANG_.call(null,uid_33925));


var G__33927 = cljs.core.next(seq__33597_33918__$1);
var G__33928 = null;
var G__33929 = (0);
var G__33930 = (0);
seq__33597_33906 = G__33927;
chunk__33598_33907 = G__33928;
count__33599_33908 = G__33929;
i__33600_33909 = G__33930;
continue;
}
} else {
}
}
break;
}

cljs.core.reset_BANG_(pcm_buffers,cljs.core.PersistentArrayMap.EMPTY);

cljs.core.reset_BANG_(streams,cljs.core.PersistentArrayMap.EMPTY);

cljs.core.reset_BANG_(decoders,cljs.core.PersistentArrayMap.EMPTY);

cljs.core.reset_BANG_(active_users,cljs.core.PersistentHashSet.EMPTY);

return cljs.core.reset_BANG_(silence_timers,cljs.core.PersistentArrayMap.EMPTY);
});
});
/**
 * Start voice capture and return a Promise of a stop function.
 */
knoxx.backend.domain.discord.gateway.gw_start_voice_listener = (function knoxx$backend$domain$discord$gateway$gw_start_voice_listener(connections,guild_id,on_start,on_audio){
console.log("[voice:listener] starting for guild:",guild_id,"connections:",connections.size);

var conn = connections.get(guild_id);
if(cljs.core.not(conn)){
console.error("[voice:listener] no connection for guild:",guild_id);

return Promise.reject((new Error((""+"No voice connection for guild: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id)))));
} else {
var receiver = conn.receiver;
var speaking_map = receiver.speaking;
var pcm_buffers = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var streams = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var decoders = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var active_users = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
var silence_timers = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var flush_audio_BANG_ = (function (p1__33626_SHARP_){
return knoxx.backend.domain.discord.gateway.voice_listener_flush_audio_BANG_(pcm_buffers,silence_timers,on_audio,p1__33626_SHARP_);
});
var on_start_speaking = knoxx.backend.domain.discord.gateway.voice_listener_on_start_speaking(receiver,pcm_buffers,streams,decoders,active_users,silence_timers,on_start,on_audio);
var on_end_speaking = knoxx.backend.domain.discord.gateway.voice_listener_on_end_speaking(streams,decoders,active_users,silence_timers,flush_audio_BANG_);
console.log("[voice:listener] attaching listeners");

speaking_map.on("start",on_start_speaking);

speaking_map.on("end",on_end_speaking);

return Promise.resolve(knoxx.backend.domain.discord.gateway.voice_listener_stop_BANG_(guild_id,speaking_map,on_start_speaking,on_end_speaking,pcm_buffers,streams,decoders,active_users,silence_timers,flush_audio_BANG_));
}
});
knoxx.backend.domain.discord.gateway.destroy_voice_connections_BANG_ = (function knoxx$backend$domain$discord$gateway$destroy_voice_connections_BANG_(voice_connections){
voice_connections.forEach((function (conn,_key){
try{return conn.destroy();
}catch (e33630){if((e33630 instanceof Error)){
var _ = e33630;
return null;
} else {
throw e33630;

}
}}));

return voice_connections.clear();
});
knoxx.backend.domain.discord.gateway.gateway_stop_BANG_ = (function knoxx$backend$domain$discord$gateway$gateway_stop_BANG_(voice_connections,this_stop){
knoxx.backend.domain.discord.gateway.destroy_voice_connections_BANG_(voice_connections);

return (this_stop.cljs$core$IFn$_invoke$arity$0 ? this_stop.cljs$core$IFn$_invoke$arity$0() : this_stop.call(null));
});
knoxx.backend.domain.discord.gateway.gateway_restart_BANG_ = (async function knoxx$backend$domain$discord$gateway$gateway_restart_BANG_(this_stop,this_fn,token){
(await (this_stop.cljs$core$IFn$_invoke$arity$0 ? this_stop.cljs$core$IFn$_invoke$arity$0() : this_stop.call(null)));

return (await (this_fn.cljs$core$IFn$_invoke$arity$0 ? this_fn.cljs$core$IFn$_invoke$arity$0() : this_fn.call(null)).start(token));
});
knoxx.backend.domain.discord.gateway.register_gateway_listener_BANG_ = (function knoxx$backend$domain$discord$gateway$register_gateway_listener_BANG_(listener_set,listener){
cljs.core.deref(listener_set).add(listener);

return (function (){
return cljs.core.deref(listener_set).delete(listener);
});
});
knoxx.backend.domain.discord.gateway.gateway_join_voice_BANG_ = (async function knoxx$backend$domain$discord$gateway$gateway_join_voice_BANG_(ensure_client,voice_connections,channel_id){
var conn = (await knoxx.backend.domain.discord.gateway.gw_join_voice(ensure_client,channel_id));
var guild_id = knoxx.backend.domain.discord.gateway.voice_connection_guild_id(conn);
voice_connections.set(guild_id,conn);

return ({"guildId": guild_id, "channelId": channel_id, "joined": true});
});
knoxx.backend.domain.discord.gateway.gateway_active_voice_connection = (function knoxx$backend$domain$discord$gateway$gateway_active_voice_connection(voice_connections,guild_id){
if(cljs.core.truth_(guild_id)){
return voice_connections.get(guild_id);
} else {
if((voice_connections.size > (0))){
var entries = voice_connections.entries();
return entries.next().value;
} else {
return null;
}
}
});
knoxx.backend.domain.discord.gateway.gateway_lifecycle_methods = (function knoxx$backend$domain$discord$gateway$gateway_lifecycle_methods(client_state,ready_promise,current_token,listeners,log,this_stop,build_client,this_fn,voice_connections){
return ({"start": (function (token){
return knoxx.backend.domain.discord.gateway.gw_start(client_state,ready_promise,current_token,listeners,log,this_stop,build_client,token);
}), "stop": (function (){
return knoxx.backend.domain.discord.gateway.gateway_stop_BANG_(voice_connections,this_stop);
}), "restart": (function (token){
return knoxx.backend.domain.discord.gateway.gateway_restart_BANG_(this_stop,this_fn,token);
}), "status": (function (){
return knoxx.backend.domain.discord.gateway.gw_status(client_state);
})});
});
knoxx.backend.domain.discord.gateway.gateway_listener_methods = (function knoxx$backend$domain$discord$gateway$gateway_listener_methods(listeners,reaction_listeners,voice_state_listeners){
return ({"onMessage": (function (listener){
return knoxx.backend.domain.discord.gateway.register_gateway_listener_BANG_(listeners,listener);
}), "onReaction": (function (listener){
return knoxx.backend.domain.discord.gateway.register_gateway_listener_BANG_(reaction_listeners,listener);
}), "onVoiceStateUpdate": (function (listener){
return knoxx.backend.domain.discord.gateway.register_gateway_listener_BANG_(voice_state_listeners,listener);
})});
});
knoxx.backend.domain.discord.gateway.gateway_message_methods = (function knoxx$backend$domain$discord$gateway$gateway_message_methods(ensure_client,log,this_fn){
return ({"listServers": (function (){
return knoxx.backend.domain.discord.gateway.gw_list_servers(ensure_client);
}), "listChannels": (function (guild_id){
return knoxx.backend.domain.discord.gateway.gw_list_channels(ensure_client,log,guild_id);
}), "fetchChannelMessages": (function (channel_id,opts){
return knoxx.backend.domain.discord.gateway.gw_fetch_channel_messages(ensure_client,channel_id,opts);
}), "fetchDmMessages": (function (user_id,opts){
return knoxx.backend.domain.discord.gateway.gw_fetch_dm_messages(ensure_client,user_id,opts);
}), "searchMessages": (function (scope,opts){
return knoxx.backend.domain.discord.gateway.gw_search_messages((this_fn.cljs$core$IFn$_invoke$arity$0 ? this_fn.cljs$core$IFn$_invoke$arity$0() : this_fn.call(null)),scope,opts);
}), "sendMessage": (function (channel_id,text,reply_to,attachments){
return knoxx.backend.domain.discord.gateway.gw_send_message(ensure_client,channel_id,text,reply_to,attachments);
})});
});
knoxx.backend.domain.discord.gateway.gateway_voice_methods = (function knoxx$backend$domain$discord$gateway$gateway_voice_methods(ensure_client,voice_connections){
return ({"joinVoice": (function (channel_id){
return knoxx.backend.domain.discord.gateway.gateway_join_voice_BANG_(ensure_client,voice_connections,channel_id);
}), "leaveVoice": (function (guild_id){
knoxx.backend.domain.discord.gateway.gw_leave_voice(voice_connections,guild_id);

return ({"guildId": guild_id, "left": true});
}), "playAudio": (function (guild_id,audio_buffer){
return knoxx.backend.domain.discord.gateway.gw_play_audio(voice_connections,guild_id,audio_buffer);
}), "subscribeVoice": (function (guild_id,user_id,callback){
return knoxx.backend.domain.discord.gateway.gw_subscribe_voice(voice_connections,guild_id,user_id,callback);
}), "startVoiceListener": (function (guild_id,on_start,on_audio){
return knoxx.backend.domain.discord.gateway.gw_start_voice_listener(voice_connections,guild_id,on_start,on_audio);
}), "getVoiceConnection": (function (guild_id){
return knoxx.backend.domain.discord.gateway.gateway_active_voice_connection(voice_connections,guild_id);
}), "listVoiceMembers": (function (guild_id,channel_id){
return knoxx.backend.domain.discord.gateway.gw_list_voice_members(ensure_client,guild_id,channel_id);
})});
});
knoxx.backend.domain.discord.gateway.build_gateway_manager_methods = (function knoxx$backend$domain$discord$gateway$build_gateway_manager_methods(client_state,ready_promise,current_token,listeners,reaction_listeners,voice_state_listeners,log,this_stop,build_client,ensure_client,voice_connections,this_fn){
return Object.assign(({}),knoxx.backend.domain.discord.gateway.gateway_lifecycle_methods(client_state,ready_promise,current_token,listeners,log,this_stop,build_client,this_fn,voice_connections),knoxx.backend.domain.discord.gateway.gateway_listener_methods(listeners,reaction_listeners,voice_state_listeners),knoxx.backend.domain.discord.gateway.gateway_message_methods(ensure_client,log,this_fn),knoxx.backend.domain.discord.gateway.gateway_voice_methods(ensure_client,voice_connections));
});
/**
 * Parse gateway manager options from a CLJS map or JS object.
 */
knoxx.backend.domain.discord.gateway.parse_gateway_manager_opts = (function knoxx$backend$domain$discord$gateway$parse_gateway_manager_opts(opts){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"log","log",-1595516004),(function (){var or__5162__auto__ = ((cljs.core.map_QMARK_(opts))?new cljs.core.Keyword(null,"log","log",-1595516004).cljs$core$IFn$_invoke$arity$1(opts):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.object_QMARK_(opts))?(opts["log"]):null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return console;
}
}
})(),new cljs.core.Keyword(null,"set-default?","set-default?",-1700805320),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,(function (){var or__5162__auto__ = ((cljs.core.map_QMARK_(opts))?new cljs.core.Keyword(null,"set-default?","set-default?",-1700805320).cljs$core$IFn$_invoke$arity$1(opts):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.object_QMARK_(opts))?(opts["setDefault"]):null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return true;
}
}
})())], null);
});
knoxx.backend.domain.discord.gateway.gateway_manager_state = (function knoxx$backend$domain$discord$gateway$gateway_manager_state(){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"client-state","client-state",-885057982),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null),new cljs.core.Keyword(null,"ready-promise","ready-promise",-674475632),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null),new cljs.core.Keyword(null,"current-token","current-token",428531321),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null),new cljs.core.Keyword(null,"listeners","listeners",394544445),cljs.core.atom.cljs$core$IFn$_invoke$arity$1((new Set())),new cljs.core.Keyword(null,"reaction-listeners","reaction-listeners",1466786327),cljs.core.atom.cljs$core$IFn$_invoke$arity$1((new Set())),new cljs.core.Keyword(null,"voice-state-listeners","voice-state-listeners",1479904065),cljs.core.atom.cljs$core$IFn$_invoke$arity$1((new Set())),new cljs.core.Keyword(null,"voice-connections","voice-connections",-250242391),(new Map())], null);
});
knoxx.backend.domain.discord.gateway.gateway_manager_deps = (function knoxx$backend$domain$discord$gateway$gateway_manager_deps(log,p__33668){
var map__33669 = p__33668;
var map__33669__$1 = cljs.core.__destructure_map(map__33669);
var client_state = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33669__$1,new cljs.core.Keyword(null,"client-state","client-state",-885057982));
var ready_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33669__$1,new cljs.core.Keyword(null,"ready-promise","ready-promise",-674475632));
var listeners = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33669__$1,new cljs.core.Keyword(null,"listeners","listeners",394544445));
var reaction_listeners = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33669__$1,new cljs.core.Keyword(null,"reaction-listeners","reaction-listeners",1466786327));
var voice_state_listeners = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33669__$1,new cljs.core.Keyword(null,"voice-state-listeners","voice-state-listeners",1479904065));
var notify_message = cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.notify_message_BANG_,listeners,log);
var notify_reaction = cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.notify_reaction_BANG_,reaction_listeners,log);
var notify_voice_state = cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.notify_voice_state_BANG_,voice_state_listeners,log);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"build-client","build-client",-1704284901),cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.discord.gateway.build_discord_client,log,notify_message,notify_reaction,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([notify_voice_state], 0)),new cljs.core.Keyword(null,"ensure-client","ensure-client",1517566845),cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.ensure_client_BANG_,client_state,ready_promise)], null);
});
knoxx.backend.domain.discord.gateway.create_gateway_manager_object_BANG_ = (function knoxx$backend$domain$discord$gateway$create_gateway_manager_object_BANG_(log,p__33674){
var map__33675 = p__33674;
var map__33675__$1 = cljs.core.__destructure_map(map__33675);
var state = map__33675__$1;
var client_state = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"client-state","client-state",-885057982));
var ready_promise = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"ready-promise","ready-promise",-674475632));
var current_token = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"current-token","current-token",428531321));
var listeners = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"listeners","listeners",394544445));
var reaction_listeners = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"reaction-listeners","reaction-listeners",1466786327));
var voice_state_listeners = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"voice-state-listeners","voice-state-listeners",1479904065));
var voice_connections = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33675__$1,new cljs.core.Keyword(null,"voice-connections","voice-connections",-250242391));
var map__33676 = knoxx.backend.domain.discord.gateway.gateway_manager_deps(log,state);
var map__33676__$1 = cljs.core.__destructure_map(map__33676);
var build_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33676__$1,new cljs.core.Keyword(null,"build-client","build-client",-1704284901));
var ensure_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33676__$1,new cljs.core.Keyword(null,"ensure-client","ensure-client",1517566845));
var this_stop = (function (){
return knoxx.backend.domain.discord.gateway.gw_stop(client_state,ready_promise,current_token);
});
var this_obj = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var this_fn = (function knoxx$backend$domain$discord$gateway$create_gateway_manager_object_BANG__$_this_fn(){
return cljs.core.deref(this_obj);
});
cljs.core.reset_BANG_(this_obj,knoxx.backend.domain.discord.gateway.build_gateway_manager_methods(client_state,ready_promise,current_token,listeners,reaction_listeners,voice_state_listeners,log,this_stop,build_client,ensure_client,voice_connections,this_fn));

return cljs.core.deref(this_obj);
});
/**
 * Create a Discord gateway manager. Returns a JS object with async methods.
 */
knoxx.backend.domain.discord.gateway.createDiscordGatewayManager = (function knoxx$backend$domain$discord$gateway$createDiscordGatewayManager(opts){
var map__33681 = knoxx.backend.domain.discord.gateway.parse_gateway_manager_opts(opts);
var map__33681__$1 = cljs.core.__destructure_map(map__33681);
var log = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33681__$1,new cljs.core.Keyword(null,"log","log",-1595516004));
var set_default_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33681__$1,new cljs.core.Keyword(null,"set-default?","set-default?",-1700805320));
var manager = knoxx.backend.domain.discord.gateway.create_gateway_manager_object_BANG_(log,knoxx.backend.domain.discord.gateway.gateway_manager_state());
if(cljs.core.truth_(set_default_QMARK_)){
(knoxx.backend.domain.discord.gateway.set_manager_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.discord.gateway.set_manager_BANG_.cljs$core$IFn$_invoke$arity$1(manager) : knoxx.backend.domain.discord.gateway.set_manager_BANG_.call(null,manager));
} else {
}

return manager;
});
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.discord !== 'undefined') && (typeof knoxx.backend.domain.discord.gateway !== 'undefined') && (typeof knoxx.backend.domain.discord.gateway.manager_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.discord.gateway.manager_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.discord !== 'undefined') && (typeof knoxx.backend.domain.discord.gateway !== 'undefined') && (typeof knoxx.backend.domain.discord.gateway.actor_managers_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.discord.gateway.actor_managers_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Store the gateway manager instance for CLJS API access.
 */
knoxx.backend.domain.discord.gateway.set_manager_BANG_ = (function knoxx$backend$domain$discord$gateway$set_manager_BANG_(m){
return cljs.core.reset_BANG_(knoxx.backend.domain.discord.gateway.manager_STAR_,m);
});
/**
 * Returns the legacy/default gateway manager instance, or an actor-owned manager.
 */
knoxx.backend.domain.discord.gateway.gateway_manager = (function knoxx$backend$domain$discord$gateway$gateway_manager(var_args){
var G__33686 = arguments.length;
switch (G__33686) {
case 0:
return knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
}));

(knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$1 = (function (actor_id){
var temp__5823__auto__ = (function (){var G__33689 = actor_id;
var G__33689__$1 = (((G__33689 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33689)));
var G__33689__$2 = (((G__33689__$1 == null))?null:clojure.string.trim(G__33689__$1));
if((G__33689__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33689__$2);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var id = temp__5823__auto__;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.discord.gateway.actor_managers_STAR_),id);
} else {
return cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
}
}));

(knoxx.backend.domain.discord.gateway.gateway_manager.cljs$lang$maxFixedArity = 1);

/**
 * Returns a map of actor-id to actor-owned Discord gateway managers.
 */
knoxx.backend.domain.discord.gateway.gateway_managers = (function knoxx$backend$domain$discord$gateway$gateway_managers(){
return cljs.core.deref(knoxx.backend.domain.discord.gateway.actor_managers_STAR_);
});
knoxx.backend.domain.discord.gateway.credential_value = (function knoxx$backend$domain$discord$gateway$credential_value(credential,k){
var or__5162__auto__ = ((cljs.core.map_QMARK_(credential))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(credential,k):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.map_QMARK_(credential))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(credential,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k)):null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = ((cljs.core.map_QMARK_(credential))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(credential,cljs.core.name(k)):null);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
if(cljs.core.object_QMARK_(credential)){
return (credential[cljs.core.name(k)]);
} else {
return null;
}
}
}
}
});
knoxx.backend.domain.discord.gateway.credential_secret_value = (function knoxx$backend$domain$discord$gateway$credential_secret_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___33959 = arguments.length;
var i__5898__auto___33960 = (0);
while(true){
if((i__5898__auto___33960 < len__5897__auto___33959)){
args__5903__auto__.push((arguments[i__5898__auto___33960]));

var G__33961 = (i__5898__auto___33960 + (1));
i__5898__auto___33960 = G__33961;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.domain.discord.gateway.credential_secret_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.domain.discord.gateway.credential_secret_value.cljs$core$IFn$_invoke$arity$variadic = (function (credential,ks){
var secrets = knoxx.backend.domain.discord.gateway.credential_value(credential,new cljs.core.Keyword(null,"secretJson","secretJson",1807839704));
return cljs.core.some((function (k){
var G__33697 = (function (){var or__5162__auto__ = knoxx.backend.domain.discord.gateway.credential_value(secrets,k);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.discord.gateway.credential_value(secrets,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.discord.gateway.credential_value(secrets,cljs.core.name(k));
}
}
})();
var G__33697__$1 = (((G__33697 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33697)));
var G__33697__$2 = (((G__33697__$1 == null))?null:clojure.string.trim(G__33697__$1));
if((G__33697__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33697__$2);
}
}),ks);
}));

(knoxx.backend.domain.discord.gateway.credential_secret_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.domain.discord.gateway.credential_secret_value.cljs$lang$applyTo = (function (seq33692){
var G__33693 = cljs.core.first(seq33692);
var seq33692__$1 = cljs.core.next(seq33692);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__33693,seq33692__$1);
}));

knoxx.backend.domain.discord.gateway.credential_actor_id = (function knoxx$backend$domain$discord$gateway$credential_actor_id(credential){
var G__33701 = (function (){var or__5162__auto__ = knoxx.backend.domain.discord.gateway.credential_value(credential,new cljs.core.Keyword(null,"actorId","actorId",989542370));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.discord.gateway.credential_value(credential,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.discord.gateway.credential_value(credential,new cljs.core.Keyword(null,"actor_id","actor_id",2086217260));
}
}
})();
var G__33701__$1 = (((G__33701 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33701)));
var G__33701__$2 = (((G__33701__$1 == null))?null:clojure.string.trim(G__33701__$1));
if((G__33701__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33701__$2);
}
});
knoxx.backend.domain.discord.gateway.credential_bot_token = (function knoxx$backend$domain$discord$gateway$credential_bot_token(credential){
return knoxx.backend.domain.discord.gateway.credential_secret_value.cljs$core$IFn$_invoke$arity$variadic(credential,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"botToken","botToken",1995464313),new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),new cljs.core.Keyword(null,"token","token",-1211463215)], 0));
});
knoxx.backend.domain.discord.gateway.ensure_actor_manager_BANG_ = (function knoxx$backend$domain$discord$gateway$ensure_actor_manager_BANG_(actor_id){
var actor_id__$1 = (function (){var G__33702 = actor_id;
var G__33702__$1 = (((G__33702 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33702)));
var G__33702__$2 = (((G__33702__$1 == null))?null:clojure.string.trim(G__33702__$1));
if((G__33702__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33702__$2);
}
})();
if(cljs.core.truth_(actor_id__$1)){
} else {
throw (new Error("actor id is required for Discord actor gateway"));
}

var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.discord.gateway.actor_managers_STAR_),actor_id__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var manager = knoxx.backend.domain.discord.gateway.createDiscordGatewayManager(({"log": console, "setDefault": false}));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.discord.gateway.actor_managers_STAR_,cljs.core.assoc,actor_id__$1,manager);

return manager;
}
});
knoxx.backend.domain.discord.gateway.start_actor_gateway_BANG_ = (async function knoxx$backend$domain$discord$gateway$start_actor_gateway_BANG_(actor_id,token){
var manager = knoxx.backend.domain.discord.gateway.ensure_actor_manager_BANG_(actor_id);
(await manager.start(token));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actorId","actorId",989542370),actor_id,new cljs.core.Keyword(null,"status","status",-1997798413),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(manager.status(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], null);
});
knoxx.backend.domain.discord.gateway.credential__GT_actor_gateway_start = (function knoxx$backend$domain$discord$gateway$credential__GT_actor_gateway_start(credential){
var actor_id = knoxx.backend.domain.discord.gateway.credential_actor_id(credential);
var token = knoxx.backend.domain.discord.gateway.credential_bot_token(credential);
if(cljs.core.truth_((function (){var and__5160__auto__ = actor_id;
if(cljs.core.truth_(and__5160__auto__)){
return token;
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actorId","actorId",989542370),actor_id,new cljs.core.Keyword(null,"token","token",-1211463215),token], null);
} else {
return null;
}
});
knoxx.backend.domain.discord.gateway.actor_gateway_starts = (function knoxx$backend$domain$discord$gateway$actor_gateway_starts(credentials){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.credential__GT_actor_gateway_start,cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = credentials;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))));
});
knoxx.backend.domain.discord.gateway.stop_inactive_actor_gateways_BANG_ = (function knoxx$backend$domain$discord$gateway$stop_inactive_actor_gateways_BANG_(active_actor_ids){
var seq__33708 = cljs.core.seq(cljs.core.deref(knoxx.backend.domain.discord.gateway.actor_managers_STAR_));
var chunk__33709 = null;
var count__33710 = (0);
var i__33711 = (0);
while(true){
if((i__33711 < count__33710)){
var vec__33720 = chunk__33709.cljs$core$IIndexed$_nth$arity$2(null,i__33711);
var actor_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33720,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33720,(1),null);
if(cljs.core.contains_QMARK_(active_actor_ids,actor_id)){
} else {
try{manager.stop();
}catch (e33725){if((e33725 instanceof Error)){
var __33970 = e33725;
} else {
throw e33725;

}
}finally {cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.actor_managers_STAR_,cljs.core.dissoc,actor_id);
}}


var G__33971 = seq__33708;
var G__33972 = chunk__33709;
var G__33973 = count__33710;
var G__33974 = (i__33711 + (1));
seq__33708 = G__33971;
chunk__33709 = G__33972;
count__33710 = G__33973;
i__33711 = G__33974;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__33708);
if(temp__5825__auto__){
var seq__33708__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__33708__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__33708__$1);
var G__33975 = cljs.core.chunk_rest(seq__33708__$1);
var G__33976 = c__5694__auto__;
var G__33977 = cljs.core.count(c__5694__auto__);
var G__33978 = (0);
seq__33708 = G__33975;
chunk__33709 = G__33976;
count__33710 = G__33977;
i__33711 = G__33978;
continue;
} else {
var vec__33726 = cljs.core.first(seq__33708__$1);
var actor_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33726,(0),null);
var manager = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33726,(1),null);
if(cljs.core.contains_QMARK_(active_actor_ids,actor_id)){
} else {
try{manager.stop();
}catch (e33731){if((e33731 instanceof Error)){
var __33979 = e33731;
} else {
throw e33731;

}
}finally {cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.discord.gateway.actor_managers_STAR_,cljs.core.dissoc,actor_id);
}}


var G__33980 = cljs.core.next(seq__33708__$1);
var G__33981 = null;
var G__33982 = (0);
var G__33983 = (0);
seq__33708 = G__33980;
chunk__33709 = G__33981;
count__33710 = G__33982;
i__33711 = G__33983;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.domain.discord.gateway.start_actor_gateway_best_effort_BANG_ = (async function knoxx$backend$domain$discord$gateway$start_actor_gateway_best_effort_BANG_(p__33733){
var map__33734 = p__33733;
var map__33734__$1 = cljs.core.__destructure_map(map__33734);
var actorId = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33734__$1,new cljs.core.Keyword(null,"actorId","actorId",989542370));
var token = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33734__$1,new cljs.core.Keyword(null,"token","token",-1211463215));
try{return (await knoxx.backend.domain.discord.gateway.start_actor_gateway_BANG_(actorId,token));
}catch (e33735){if((e33735 instanceof Error)){
var err = e33735;
console.warn("[discord-gateway] actor gateway start failed",actorId,err.message);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actorId","actorId",989542370),actorId,new cljs.core.Keyword(null,"error","error",-978969032),err.message], null);
} else {
throw e33735;

}
}});
knoxx.backend.domain.discord.gateway.start_actor_gateways_BANG_ = (async function knoxx$backend$domain$discord$gateway$start_actor_gateways_BANG_(credentials){
var valid = knoxx.backend.domain.discord.gateway.actor_gateway_starts(credentials);
var active_actor_ids = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"actorId","actorId",989542370),valid));
var starts = cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.gateway.start_actor_gateway_best_effort_BANG_,valid));
knoxx.backend.domain.discord.gateway.stop_inactive_actor_gateways_BANG_(active_actor_ids);

return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await Promise.all(starts)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
/**
 * Returns true if the gateway client exists.
 */
knoxx.backend.domain.discord.gateway.started_QMARK_ = (function knoxx$backend$domain$discord$gateway$started_QMARK_(){
return (!((cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_) == null)));
});
/**
 * Returns true if the gateway client is connected and ready.
 */
knoxx.backend.domain.discord.gateway.ready_QMARK_ = (function knoxx$backend$domain$discord$gateway$ready_QMARK_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
var s = manager.status();
return cljs.core.boolean$((s["ready"]));
} else {
return null;
}
});
/**
 * Get gateway status as a JS object.
 */
knoxx.backend.domain.discord.gateway.status = (function knoxx$backend$domain$discord$gateway$status(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.status();
} else {
return null;
}
});
/**
 * Start the Discord gateway with the given token.
 */
knoxx.backend.domain.discord.gateway.start_BANG_ = (function knoxx$backend$domain$discord$gateway$start_BANG_(token){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.start(token);
} else {
return null;
}
});
/**
 * Stop the Discord gateway client.
 */
knoxx.backend.domain.discord.gateway.stop_BANG_ = (function knoxx$backend$domain$discord$gateway$stop_BANG_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.stop();
} else {
return null;
}
});
/**
 * Stop and restart with the given token.
 */
knoxx.backend.domain.discord.gateway.restart_BANG_ = (function knoxx$backend$domain$discord$gateway$restart_BANG_(token){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.restart(token);
} else {
return null;
}
});
/**
 * Register a message listener. Returns an unsubscribe function.
 */
knoxx.backend.domain.discord.gateway.on_message_BANG_ = (function knoxx$backend$domain$discord$gateway$on_message_BANG_(listener){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.onMessage(listener);
} else {
return null;
}
});
/**
 * Register a reaction listener. Returns an unsubscribe function.
 */
knoxx.backend.domain.discord.gateway.on_reaction_BANG_ = (function knoxx$backend$domain$discord$gateway$on_reaction_BANG_(listener){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.onReaction(listener);
} else {
return null;
}
});
/**
 * Register a voice state update listener. Returns an unsubscribe function.
 */
knoxx.backend.domain.discord.gateway.on_voice_state_update_BANG_ = (function knoxx$backend$domain$discord$gateway$on_voice_state_update_BANG_(listener){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.onVoiceStateUpdate(listener);
} else {
return null;
}
});
/**
 * List all guilds the bot is in. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.list_servers = (function knoxx$backend$domain$discord$gateway$list_servers(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.listServers();
} else {
return null;
}
});
/**
 * List channels in a guild (or all guilds if guild-id is nil). Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.list_channels = (function knoxx$backend$domain$discord$gateway$list_channels(var_args){
var G__33744 = arguments.length;
switch (G__33744) {
case 0:
return knoxx.backend.domain.discord.gateway.list_channels.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.domain.discord.gateway.list_channels.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.gateway.list_channels.cljs$core$IFn$_invoke$arity$0 = (function (){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.listChannels();
} else {
return null;
}
}));

(knoxx.backend.domain.discord.gateway.list_channels.cljs$core$IFn$_invoke$arity$1 = (function (guild_id){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.listChannels(guild_id);
} else {
return null;
}
}));

(knoxx.backend.domain.discord.gateway.list_channels.cljs$lang$maxFixedArity = 1);

/**
 * Fetch messages from a channel. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.fetch_channel_messages = (function knoxx$backend$domain$discord$gateway$fetch_channel_messages(channel_id,opts){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.fetchChannelMessages(channel_id,opts);
} else {
return null;
}
});
/**
 * Fetch DM messages with a user. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.fetch_dm_messages = (function knoxx$backend$domain$discord$gateway$fetch_dm_messages(user_id,opts){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.fetchDmMessages(user_id,opts);
} else {
return null;
}
});
/**
 * Search messages in a channel or DM. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.search_messages = (function knoxx$backend$domain$discord$gateway$search_messages(scope,opts){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.searchMessages(scope,opts);
} else {
return null;
}
});
/**
 * Send a message to a channel. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.send_message = (function knoxx$backend$domain$discord$gateway$send_message(var_args){
var G__33751 = arguments.length;
switch (G__33751) {
case 3:
return knoxx.backend.domain.discord.gateway.send_message.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.domain.discord.gateway.send_message.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.gateway.send_message.cljs$core$IFn$_invoke$arity$3 = (function (channel_id,text,reply_to){
return knoxx.backend.domain.discord.gateway.send_message.cljs$core$IFn$_invoke$arity$4(channel_id,text,reply_to,null);
}));

(knoxx.backend.domain.discord.gateway.send_message.cljs$core$IFn$_invoke$arity$4 = (function (channel_id,text,reply_to,attachments){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.sendMessage(channel_id,text,reply_to,attachments);
} else {
return null;
}
}));

(knoxx.backend.domain.discord.gateway.send_message.cljs$lang$maxFixedArity = 4);

/**
 * Join a voice channel. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.join_voice = (function knoxx$backend$domain$discord$gateway$join_voice(channel_id){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.joinVoice(channel_id);
} else {
return null;
}
});
/**
 * Leave a voice channel for a guild. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.leave_voice = (function knoxx$backend$domain$discord$gateway$leave_voice(guild_id){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.leaveVoice(guild_id);
} else {
return null;
}
});
/**
 * Play an audio buffer in a voice channel. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.play_audio = (function knoxx$backend$domain$discord$gateway$play_audio(guild_id,audio_buffer){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.playAudio(guild_id,audio_buffer);
} else {
return null;
}
});
/**
 * Start listening for voice input. Returns a Promise of a stop function.
 */
knoxx.backend.domain.discord.gateway.start_voice_listener = (function knoxx$backend$domain$discord$gateway$start_voice_listener(guild_id,on_start,on_audio){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.startVoiceListener(guild_id,on_start,on_audio);
} else {
return null;
}
});
/**
 * Get the current voice connection for a guild.
 */
knoxx.backend.domain.discord.gateway.get_voice_connection = (function knoxx$backend$domain$discord$gateway$get_voice_connection(guild_id){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.getVoiceConnection(guild_id);
} else {
return null;
}
});
/**
 * List members in a voice channel. Returns a Promise.
 */
knoxx.backend.domain.discord.gateway.list_voice_members = (function knoxx$backend$domain$discord$gateway$list_voice_members(guild_id,channel_id){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.domain.discord.gateway.manager_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var manager = temp__5825__auto__;
return manager.listVoiceMembers(guild_id,channel_id);
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.domain.discord.gateway.js.map
