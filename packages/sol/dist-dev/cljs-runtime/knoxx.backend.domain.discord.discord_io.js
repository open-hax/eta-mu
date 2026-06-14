import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.discord.rest_client.js";
import "./knoxx.backend.infra.agent.runner.js";
import "./knoxx.backend.infra.config.js";
goog.provide('knoxx.backend.domain.discord.discord_io');
knoxx.backend.domain.discord.discord_io.discord_token = (function knoxx$backend$domain$discord$discord_io$discord_token(){
var or__5162__auto__ = (function (){var G__69769 = knoxx.backend.infra.config.cfg();
if((G__69769 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"discord-bot-token","discord-bot-token",1224757550).cljs$core$IFn$_invoke$arity$1(G__69769);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error("Discord bot token not configured"));
}
});
knoxx.backend.domain.discord.discord_io.discord_client = (function knoxx$backend$domain$discord$discord_io$discord_client(){
return knoxx.backend.domain.discord.rest_client.client.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.discord.discord_io.discord_token());
});
knoxx.backend.domain.discord.discord_io.map_message = (function knoxx$backend$domain$discord$discord_io$map_message(msg){
var author = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(msg),new cljs.core.Keyword(null,"channelId","channelId",2082229448),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channel_id","channel_id",1180018383).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"content","content",15833224),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(msg);
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
})(),new cljs.core.Keyword(null,"authorIsBot","authorIsBot",-1582823121),cljs.core.boolean$(new cljs.core.Keyword(null,"bot","bot",-950896508).cljs$core$IFn$_invoke$arity$1(author)),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()], null);
});
knoxx.backend.domain.discord.discord_io.sort_newest_first = (function knoxx$backend$domain$discord$discord_io$sort_newest_first(messages){
return cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"timestamp","timestamp",579478971),(function (p1__69778_SHARP_,p2__69777_SHARP_){
return cljs.core.compare(p2__69777_SHARP_,p1__69778_SHARP_);
}),messages);
});
/**
 * Fetch up to `limit` messages from `channel-id` (max 100).
 * Returns Promise<[{:id :channelId :content :authorId :authorUsername :authorIsBot :timestamp}]>.
 */
knoxx.backend.domain.discord.discord_io.read_channel_BANG_ = (function knoxx$backend$domain$discord$discord_io$read_channel_BANG_(var_args){
var args__5903__auto__ = [];
var len__5897__auto___69844 = arguments.length;
var i__5898__auto___69845 = (0);
while(true){
if((i__5898__auto___69845 < len__5897__auto___69844)){
args__5903__auto__.push((arguments[i__5898__auto___69845]));

var G__69846 = (i__5898__auto___69845 + (1));
i__5898__auto___69845 = G__69846;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.domain.discord.discord_io.read_channel_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.domain.discord.discord_io.read_channel_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (channel_id,p__69793){
var vec__69794 = p__69793;
var limit = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__69794,(0),null);
return knoxx.backend.domain.discord.rest_client.channel_messages_BANG_(knoxx.backend.domain.discord.discord_io.discord_client(),channel_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})()))], null)).then((function (payload){
return cljs.core.vec(knoxx.backend.domain.discord.discord_io.sort_newest_first(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.discord_io.map_message,(function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
}));
}));

(knoxx.backend.domain.discord.discord_io.read_channel_BANG_.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.domain.discord.discord_io.read_channel_BANG_.cljs$lang$applyTo = (function (seq69783){
var G__69784 = cljs.core.first(seq69783);
var seq69783__$1 = cljs.core.next(seq69783);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__69784,seq69783__$1);
}));

/**
 * Return messages in `channel-id` whose content contains `query`
 * (case-insensitive). Scans up to 100 messages, returns up to `limit`.
 */
knoxx.backend.domain.discord.discord_io.search_channel_BANG_ = (function knoxx$backend$domain$discord$discord_io$search_channel_BANG_(var_args){
var args__5903__auto__ = [];
var len__5897__auto___69848 = arguments.length;
var i__5898__auto___69849 = (0);
while(true){
if((i__5898__auto___69849 < len__5897__auto___69848)){
args__5903__auto__.push((arguments[i__5898__auto___69849]));

var G__69850 = (i__5898__auto___69849 + (1));
i__5898__auto___69849 = G__69850;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return knoxx.backend.domain.discord.discord_io.search_channel_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(knoxx.backend.domain.discord.discord_io.search_channel_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (channel_id,query,p__69806){
var vec__69807 = p__69806;
var limit = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__69807,(0),null);
return knoxx.backend.domain.discord.discord_io.read_channel_BANG_.cljs$core$IFn$_invoke$arity$variadic(channel_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(100)], 0)).then((function (messages){
var needle = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = query;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})(),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (message){
return clojure.string.includes_QMARK_(clojure.string.lower_case(new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message)),needle);
}),messages)));
}));
}));

(knoxx.backend.domain.discord.discord_io.search_channel_BANG_.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(knoxx.backend.domain.discord.discord_io.search_channel_BANG_.cljs$lang$applyTo = (function (seq69800){
var G__69801 = cljs.core.first(seq69800);
var seq69800__$1 = cljs.core.next(seq69800);
var G__69802 = cljs.core.first(seq69800__$1);
var seq69800__$2 = cljs.core.next(seq69800__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__69801,G__69802,seq69800__$2);
}));

/**
 * List guilds the bot is a member of.
 */
knoxx.backend.domain.discord.discord_io.list_guilds_BANG_ = (function knoxx$backend$domain$discord$discord_io$list_guilds_BANG_(){
return knoxx.backend.domain.discord.rest_client.current_user_guilds_BANG_(knoxx.backend.domain.discord.discord_io.discord_client()).then((function (payload){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (guild){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(guild),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(guild)], null);
}),(function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
}));
});
/**
 * List channels in `guild-id` (types 0, 5, 11, 12 only).
 */
knoxx.backend.domain.discord.discord_io.list_channels_BANG_ = (function knoxx$backend$domain$discord$discord_io$list_channels_BANG_(guild_id){
return knoxx.backend.domain.discord.rest_client.guild_channels_BANG_(knoxx.backend.domain.discord.discord_io.discord_client(),guild_id).then((function (payload){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (channel){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(channel),new cljs.core.Keyword(null,"guildId","guildId",-559818490),guild_id,new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(channel);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(channel)], null);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (channel){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [(0),null,(12),null,(11),null,(5),null], null), null),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(channel));
}),(function (){var or__5162__auto__ = payload;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
}));
});
knoxx.backend.domain.discord.discord_io.default_discord_tool_policies = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.read",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.search",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.publish",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.guilds",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"memory_search",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"graph_query",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null)], null);
/**
 * Launch a normal Knoxx direct-mode turn for a Discord-triggered payload.
 * `opts` map accepts :channelId :channelName :authorUsername :content :reason.
 */
knoxx.backend.domain.discord.discord_io.start_agent_session_BANG_ = (function knoxx$backend$domain$discord$discord_io$start_agent_session_BANG_(config,job,p__69839){
var map__69840 = p__69839;
var map__69840__$1 = cljs.core.__destructure_map(map__69840);
var channelId = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__69840__$1,new cljs.core.Keyword(null,"channelId","channelId",2082229448));
var channelName = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__69840__$1,new cljs.core.Keyword(null,"channelName","channelName",327631603));
var authorUsername = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__69840__$1,new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965));
var content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__69840__$1,new cljs.core.Keyword(null,"content","content",15833224));
var reason = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__69840__$1,new cljs.core.Keyword(null,"reason","reason",-2070751759));
var now = Date.now();
var job_agent_spec = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var run_id = (""+"discord-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(job))+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(now));
var conversation_id = (""+"discord-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(job))+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channelId)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(now));
var session_id = (""+"discord-session-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(job))+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(now));
var task_prompt = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
var tool_policies = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.discord.discord_io.default_discord_tool_policies;
}
}
})();
var user_message = (""+"Discord job: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(job))+"\n"+"Reason: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(reason)+"\n"+"Channel ID: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(channelId)+"\n"+"Channel Name: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = channelName;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return channelId;
}
})())+"\n"+"Author: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(authorUsername)+"\n"+"Message: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(content)+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(task_prompt))?null:(""+"Job task prompt:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(task_prompt)+"\n\n")))+"Use discord.read, discord.search, discord.channels, and discord.guilds when they improve confidence. "+"If a response is warranted, send it with discord.publish to the target channel. "+"If not, stay silent.");
var body = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"message","message",-406056002),user_message,new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"context_policy","context_policy",1230169154),new cljs.core.Keyword(null,"task_prompt","task_prompt",1276696196),new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069),new cljs.core.Keyword(null,"memory_hydration","memory_hydration",-1458677455),new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177),new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954),new cljs.core.Keyword(null,"model","model",331153215)],[(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "system_admin";
}
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
}
})(),task_prompt,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contractId","contractId",710260199).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contractId","contractId",710260199).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "off";
}
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
}
})(),tool_policies,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "You are Knoxx's Discord agent.";
}
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "glm-5";
}
}
}
})()]),new cljs.core.Keyword(null,"model","model",331153215),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(job_agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "glm-5";
}
}
}
})()], null);
return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2(config,body).then((function (result){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[discord-io] queued agent run",run_id,"for job",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(job)], 0));

return result;
})).catch((function (err){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[discord-io] failed to queue agent run for job",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(job),":",err.message], 0));

return null;
}));
});

//# sourceMappingURL=knoxx.backend.domain.discord.discord_io.js.map
