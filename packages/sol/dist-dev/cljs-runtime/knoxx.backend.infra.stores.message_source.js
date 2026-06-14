import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.infra.stores.message_source');

/**
 * @interface
 */
knoxx.backend.infra.stores.message_source.IMessageSource = function(){};

var knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$dyn_25731 = (function (src,conversation_id){
var x__5519__auto__ = (((src == null))?null:src);
var m__5520__auto__ = (knoxx.backend.infra.stores.message_source.fetch_messages_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(src,conversation_id) : m__5520__auto__.call(null,src,conversation_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.stores.message_source.fetch_messages_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(src,conversation_id) : m__5518__auto__.call(null,src,conversation_id));
} else {
throw cljs.core.missing_protocol("IMessageSource.fetch-messages!",src);
}
}
});
/**
 * Returns Promise<vec<stored-session-message-map>>.
 *   Each map has at minimum :role and :content keys.
 */
knoxx.backend.infra.stores.message_source.fetch_messages_BANG_ = (function knoxx$backend$infra$stores$message_source$fetch_messages_BANG_(src,conversation_id){
if((((!((src == null)))) && ((!((src.knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$arity$2 == null)))))){
return src.knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$arity$2(src,conversation_id);
} else {
return knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$dyn_25731(src,conversation_id);
}
});


//# sourceMappingURL=knoxx.backend.infra.stores.message_source.js.map
