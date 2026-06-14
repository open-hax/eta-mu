import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.condition.registry.js";
goog.provide('knoxx.backend.domain.condition.builtin');
/**
 * True if the Discord message payload mentions the bot user.
 * Call: (conditions/discord.mention event)
 */
knoxx.backend.domain.condition.builtin.condition_discord_mention = (function knoxx$backend$domain$condition$builtin$condition_discord_mention(event){
var payload = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var bot_user_id = (function (){var G__24407 = new cljs.core.Keyword(null,"gatewayBotUserId","gatewayBotUserId",-989125696).cljs$core$IFn$_invoke$arity$1(payload);
var G__24407__$1 = (((G__24407 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__24407)));
var G__24407__$2 = (((G__24407__$1 == null))?null:clojure.string.trim(G__24407__$1));
if((G__24407__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__24407__$2);
}
})();
var content = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return cljs.core.boolean$((function (){var and__5160__auto__ = bot_user_id;
if(cljs.core.truth_(and__5160__auto__)){
return ((clojure.string.includes_QMARK_(content,(""+"<@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(bot_user_id)+">"))) || (clojure.string.includes_QMARK_(content,(""+"<@!"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(bot_user_id)+">"))));
} else {
return and__5160__auto__;
}
})());
});
/**
 * True if the Discord message content contains any of the supplied keywords.
 * Keywords are compared case-insensitively.
 * Call: (conditions/discord.keyword event ["frankie" "yap"])
 */
knoxx.backend.domain.condition.builtin.condition_discord_keyword = (function knoxx$backend$domain$condition$builtin$condition_discord_keyword(event,keywords){
var payload = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var content = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var kw_list = ((cljs.core.sequential_QMARK_(keywords))?keywords:cljs.core.PersistentVector.EMPTY);
var or__5162__auto__ = cljs.core.empty_QMARK_(kw_list);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return cljs.core.some((function (p1__24410_SHARP_){
return clojure.string.includes_QMARK_(content,clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__24410_SHARP_))));
}),kw_list);
}
});
/**
 * True if the Discord message is from one of the specified channel IDs.
 * Call: (conditions/discord.channel event ["123" "456"])
 */
knoxx.backend.domain.condition.builtin.condition_discord_channel = (function knoxx$backend$domain$condition$builtin$condition_discord_channel(event,channels){
var payload = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var channel_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"channel-id","channel-id",138191095).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
var ch_list = ((cljs.core.sequential_QMARK_(channels))?channels:cljs.core.PersistentVector.EMPTY);
return ((cljs.core.empty_QMARK_(ch_list)) || (cljs.core.contains_QMARK_(cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,ch_list)),channel_id)));
});
/**
 * True if the Discord message author ID is in the allowed set.
 * Call: (conditions/discord.author event ["123"])
 */
knoxx.backend.domain.condition.builtin.condition_discord_author = (function knoxx$backend$domain$condition$builtin$condition_discord_author(event,author_ids){
var payload = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var author_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"author-id","author-id",807115351).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
var id_list = ((cljs.core.sequential_QMARK_(author_ids))?author_ids:cljs.core.PersistentVector.EMPTY);
return ((cljs.core.empty_QMARK_(id_list)) || (cljs.core.contains_QMARK_(cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,id_list)),author_id)));
});
/**
 * Always returns true.
 */
knoxx.backend.domain.condition.builtin.condition_always = (function knoxx$backend$domain$condition$builtin$condition_always(var_args){
var args__5903__auto__ = [];
var len__5897__auto___24467 = arguments.length;
var i__5898__auto___24468 = (0);
while(true){
if((i__5898__auto___24468 < len__5897__auto___24467)){
args__5903__auto__.push((arguments[i__5898__auto___24468]));

var G__24469 = (i__5898__auto___24468 + (1));
i__5898__auto___24468 = G__24469;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.condition.builtin.condition_always.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.condition.builtin.condition_always.cljs$core$IFn$_invoke$arity$variadic = (function (_){
return true;
}));

(knoxx.backend.domain.condition.builtin.condition_always.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.condition.builtin.condition_always.cljs$lang$applyTo = (function (seq24433){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq24433));
}));

/**
 * Always returns false.
 */
knoxx.backend.domain.condition.builtin.condition_never = (function knoxx$backend$domain$condition$builtin$condition_never(var_args){
var args__5903__auto__ = [];
var len__5897__auto___24477 = arguments.length;
var i__5898__auto___24478 = (0);
while(true){
if((i__5898__auto___24478 < len__5897__auto___24477)){
args__5903__auto__.push((arguments[i__5898__auto___24478]));

var G__24479 = (i__5898__auto___24478 + (1));
i__5898__auto___24478 = G__24479;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.condition.builtin.condition_never.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.condition.builtin.condition_never.cljs$core$IFn$_invoke$arity$variadic = (function (_){
return false;
}));

(knoxx.backend.domain.condition.builtin.condition_never.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.condition.builtin.condition_never.cljs$lang$applyTo = (function (seq24453){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq24453));
}));

/**
 * Register all built-in conditions. Call once at startup.
 */
knoxx.backend.domain.condition.builtin.register_builtins_BANG_ = (function knoxx$backend$domain$condition$builtin$register_builtins_BANG_(){
(knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("conditions","discord.mention","conditions/discord.mention",299816536),knoxx.backend.domain.condition.builtin.condition_discord_mention) : knoxx.backend.domain.condition.registry.register_condition_BANG_.call(null,new cljs.core.Keyword("conditions","discord.mention","conditions/discord.mention",299816536),knoxx.backend.domain.condition.builtin.condition_discord_mention));

(knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("conditions","discord.keyword","conditions/discord.keyword",-1446716665),knoxx.backend.domain.condition.builtin.condition_discord_keyword) : knoxx.backend.domain.condition.registry.register_condition_BANG_.call(null,new cljs.core.Keyword("conditions","discord.keyword","conditions/discord.keyword",-1446716665),knoxx.backend.domain.condition.builtin.condition_discord_keyword));

(knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("conditions","discord.channel","conditions/discord.channel",-1537049562),knoxx.backend.domain.condition.builtin.condition_discord_channel) : knoxx.backend.domain.condition.registry.register_condition_BANG_.call(null,new cljs.core.Keyword("conditions","discord.channel","conditions/discord.channel",-1537049562),knoxx.backend.domain.condition.builtin.condition_discord_channel));

(knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("conditions","discord.author","conditions/discord.author",1878094174),knoxx.backend.domain.condition.builtin.condition_discord_author) : knoxx.backend.domain.condition.registry.register_condition_BANG_.call(null,new cljs.core.Keyword("conditions","discord.author","conditions/discord.author",1878094174),knoxx.backend.domain.condition.builtin.condition_discord_author));

(knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("conditions","always","conditions/always",-825408266),knoxx.backend.domain.condition.builtin.condition_always) : knoxx.backend.domain.condition.registry.register_condition_BANG_.call(null,new cljs.core.Keyword("conditions","always","conditions/always",-825408266),knoxx.backend.domain.condition.builtin.condition_always));

return (knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.condition.registry.register_condition_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("conditions","never","conditions/never",-897200327),knoxx.backend.domain.condition.builtin.condition_never) : knoxx.backend.domain.condition.registry.register_condition_BANG_.call(null,new cljs.core.Keyword("conditions","never","conditions/never",-897200327),knoxx.backend.domain.condition.builtin.condition_never));
});

//# sourceMappingURL=knoxx.backend.domain.condition.builtin.js.map
