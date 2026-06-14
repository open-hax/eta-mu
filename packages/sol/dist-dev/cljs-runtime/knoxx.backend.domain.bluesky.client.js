import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.bluesky.client');

/**
 * @interface
 */
knoxx.backend.domain.bluesky.client.IBlueskyClient = function(){};

var knoxx$backend$domain$bluesky$client$IBlueskyClient$create_session_BANG_$dyn_34064 = (function (client,credentials){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.create_session_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,credentials) : m__5520__auto__.call(null,client,credentials));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.create_session_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,credentials) : m__5518__auto__.call(null,client,credentials));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.create-session!",client);
}
}
});
knoxx.backend.domain.bluesky.client.create_session_BANG_ = (function knoxx$backend$domain$bluesky$client$create_session_BANG_(client,credentials){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$create_session_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$create_session_BANG_$arity$2(client,credentials);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$create_session_BANG_$dyn_34064(client,credentials);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$upload_blob_BANG_$dyn_34065 = (function (client,session,buffer,mime_type){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.upload_blob_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,buffer,mime_type) : m__5520__auto__.call(null,client,session,buffer,mime_type));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.upload_blob_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,buffer,mime_type) : m__5518__auto__.call(null,client,session,buffer,mime_type));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.upload-blob!",client);
}
}
});
knoxx.backend.domain.bluesky.client.upload_blob_BANG_ = (function knoxx$backend$domain$bluesky$client$upload_blob_BANG_(client,session,buffer,mime_type){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$upload_blob_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$upload_blob_BANG_$arity$4(client,session,buffer,mime_type);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$upload_blob_BANG_$dyn_34065(client,session,buffer,mime_type);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$create_record_BANG_$dyn_34072 = (function (client,session,collection,record){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.create_record_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,collection,record) : m__5520__auto__.call(null,client,session,collection,record));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.create_record_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,collection,record) : m__5518__auto__.call(null,client,session,collection,record));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.create-record!",client);
}
}
});
knoxx.backend.domain.bluesky.client.create_record_BANG_ = (function knoxx$backend$domain$bluesky$client$create_record_BANG_(client,session,collection,record){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$create_record_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$create_record_BANG_$arity$4(client,session,collection,record);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$create_record_BANG_$dyn_34072(client,session,collection,record);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$delete_record_BANG_$dyn_34074 = (function (client,session,collection,rkey){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.delete_record_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,collection,rkey) : m__5520__auto__.call(null,client,session,collection,rkey));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.delete_record_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,collection,rkey) : m__5518__auto__.call(null,client,session,collection,rkey));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.delete-record!",client);
}
}
});
knoxx.backend.domain.bluesky.client.delete_record_BANG_ = (function knoxx$backend$domain$bluesky$client$delete_record_BANG_(client,session,collection,rkey){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$delete_record_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$delete_record_BANG_$arity$4(client,session,collection,rkey);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$delete_record_BANG_$dyn_34074(client,session,collection,rkey);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$resolve_post_BANG_$dyn_34078 = (function (client,uri){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.resolve_post_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,uri) : m__5520__auto__.call(null,client,uri));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.resolve_post_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,uri) : m__5518__auto__.call(null,client,uri));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.resolve-post!",client);
}
}
});
knoxx.backend.domain.bluesky.client.resolve_post_BANG_ = (function knoxx$backend$domain$bluesky$client$resolve_post_BANG_(client,uri){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$resolve_post_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$resolve_post_BANG_$arity$2(client,uri);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$resolve_post_BANG_$dyn_34078(client,uri);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$profile_BANG_$dyn_34079 = (function (client,actor){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.profile_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,actor) : m__5520__auto__.call(null,client,actor));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.profile_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,actor) : m__5518__auto__.call(null,client,actor));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.profile!",client);
}
}
});
knoxx.backend.domain.bluesky.client.profile_BANG_ = (function knoxx$backend$domain$bluesky$client$profile_BANG_(client,actor){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$profile_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$profile_BANG_$arity$2(client,actor);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$profile_BANG_$dyn_34079(client,actor);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$search_posts_BANG_$dyn_34080 = (function (client,session,query,limit){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.search_posts_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,query,limit) : m__5520__auto__.call(null,client,session,query,limit));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.search_posts_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,query,limit) : m__5518__auto__.call(null,client,session,query,limit));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.search-posts!",client);
}
}
});
knoxx.backend.domain.bluesky.client.search_posts_BANG_ = (function knoxx$backend$domain$bluesky$client$search_posts_BANG_(client,session,query,limit){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$search_posts_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$search_posts_BANG_$arity$4(client,session,query,limit);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$search_posts_BANG_$dyn_34080(client,session,query,limit);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$search_actors_BANG_$dyn_34081 = (function (client,session,query,limit){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.search_actors_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,query,limit) : m__5520__auto__.call(null,client,session,query,limit));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.search_actors_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,query,limit) : m__5518__auto__.call(null,client,session,query,limit));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.search-actors!",client);
}
}
});
knoxx.backend.domain.bluesky.client.search_actors_BANG_ = (function knoxx$backend$domain$bluesky$client$search_actors_BANG_(client,session,query,limit){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$search_actors_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$search_actors_BANG_$arity$4(client,session,query,limit);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$search_actors_BANG_$dyn_34081(client,session,query,limit);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$actor_feed_BANG_$dyn_34082 = (function (client,session,actor,limit){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.actor_feed_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,actor,limit) : m__5520__auto__.call(null,client,session,actor,limit));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.actor_feed_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,actor,limit) : m__5518__auto__.call(null,client,session,actor,limit));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.actor-feed!",client);
}
}
});
knoxx.backend.domain.bluesky.client.actor_feed_BANG_ = (function knoxx$backend$domain$bluesky$client$actor_feed_BANG_(client,session,actor,limit){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$actor_feed_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$actor_feed_BANG_$arity$4(client,session,actor,limit);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$actor_feed_BANG_$dyn_34082(client,session,actor,limit);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$timeline_BANG_$dyn_34083 = (function (client,session,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.timeline_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,session,opts) : m__5520__auto__.call(null,client,session,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.timeline_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,session,opts) : m__5518__auto__.call(null,client,session,opts));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.timeline!",client);
}
}
});
knoxx.backend.domain.bluesky.client.timeline_BANG_ = (function knoxx$backend$domain$bluesky$client$timeline_BANG_(client,session,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$timeline_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$timeline_BANG_$arity$3(client,session,opts);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$timeline_BANG_$dyn_34083(client,session,opts);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$thread_BANG_$dyn_34085 = (function (client,session,uri,depth){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.thread_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,uri,depth) : m__5520__auto__.call(null,client,session,uri,depth));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.thread_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,uri,depth) : m__5518__auto__.call(null,client,session,uri,depth));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.thread!",client);
}
}
});
knoxx.backend.domain.bluesky.client.thread_BANG_ = (function knoxx$backend$domain$bluesky$client$thread_BANG_(client,session,uri,depth){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$thread_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$thread_BANG_$arity$4(client,session,uri,depth);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$thread_BANG_$dyn_34085(client,session,uri,depth);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$notifications_BANG_$dyn_34086 = (function (client,session,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.notifications_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,session,opts) : m__5520__auto__.call(null,client,session,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.notifications_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,session,opts) : m__5518__auto__.call(null,client,session,opts));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.notifications!",client);
}
}
});
knoxx.backend.domain.bluesky.client.notifications_BANG_ = (function knoxx$backend$domain$bluesky$client$notifications_BANG_(client,session,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$notifications_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$notifications_BANG_$arity$3(client,session,opts);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$notifications_BANG_$dyn_34086(client,session,opts);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$followers_BANG_$dyn_34087 = (function (client,actor,limit){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.followers_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,actor,limit) : m__5520__auto__.call(null,client,actor,limit));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.followers_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,actor,limit) : m__5518__auto__.call(null,client,actor,limit));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.followers!",client);
}
}
});
knoxx.backend.domain.bluesky.client.followers_BANG_ = (function knoxx$backend$domain$bluesky$client$followers_BANG_(client,actor,limit){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$followers_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$followers_BANG_$arity$3(client,actor,limit);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$followers_BANG_$dyn_34087(client,actor,limit);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$follows_BANG_$dyn_34090 = (function (client,actor,limit){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.follows_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,actor,limit) : m__5520__auto__.call(null,client,actor,limit));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.follows_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,actor,limit) : m__5518__auto__.call(null,client,actor,limit));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.follows!",client);
}
}
});
knoxx.backend.domain.bluesky.client.follows_BANG_ = (function knoxx$backend$domain$bluesky$client$follows_BANG_(client,actor,limit){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$follows_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$follows_BANG_$arity$3(client,actor,limit);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$follows_BANG_$dyn_34090(client,actor,limit);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_list_BANG_$dyn_34091 = (function (client,session,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.chat_list_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,session,opts) : m__5520__auto__.call(null,client,session,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.chat_list_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,session,opts) : m__5518__auto__.call(null,client,session,opts));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.chat-list!",client);
}
}
});
knoxx.backend.domain.bluesky.client.chat_list_BANG_ = (function knoxx$backend$domain$bluesky$client$chat_list_BANG_(client,session,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_list_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_list_BANG_$arity$3(client,session,opts);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_list_BANG_$dyn_34091(client,session,opts);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_read_BANG_$dyn_34093 = (function (client,session,convo_id,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.chat_read_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,convo_id,opts) : m__5520__auto__.call(null,client,session,convo_id,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.chat_read_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,convo_id,opts) : m__5518__auto__.call(null,client,session,convo_id,opts));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.chat-read!",client);
}
}
});
knoxx.backend.domain.bluesky.client.chat_read_BANG_ = (function knoxx$backend$domain$bluesky$client$chat_read_BANG_(client,session,convo_id,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_read_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_read_BANG_$arity$4(client,session,convo_id,opts);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_read_BANG_$dyn_34093(client,session,convo_id,opts);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_send_BANG_$dyn_34097 = (function (client,session,convo_id,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.chat_send_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,session,convo_id,payload) : m__5520__auto__.call(null,client,session,convo_id,payload));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.chat_send_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,session,convo_id,payload) : m__5518__auto__.call(null,client,session,convo_id,payload));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.chat-send!",client);
}
}
});
knoxx.backend.domain.bluesky.client.chat_send_BANG_ = (function knoxx$backend$domain$bluesky$client$chat_send_BANG_(client,session,convo_id,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_send_BANG_$arity$4 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_send_BANG_$arity$4(client,session,convo_id,payload);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_send_BANG_$dyn_34097(client,session,convo_id,payload);
}
});

var knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_react_BANG_$dyn_34098 = (function (client,session,convo_id,message_id,emoji){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.bluesky.client.chat_react_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$5(client,session,convo_id,message_id,emoji) : m__5520__auto__.call(null,client,session,convo_id,message_id,emoji));
} else {
var m__5518__auto__ = (knoxx.backend.domain.bluesky.client.chat_react_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$5(client,session,convo_id,message_id,emoji) : m__5518__auto__.call(null,client,session,convo_id,message_id,emoji));
} else {
throw cljs.core.missing_protocol("IBlueskyClient.chat-react!",client);
}
}
});
knoxx.backend.domain.bluesky.client.chat_react_BANG_ = (function knoxx$backend$domain$bluesky$client$chat_react_BANG_(client,session,convo_id,message_id,emoji){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_react_BANG_$arity$5 == null)))))){
return client.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_react_BANG_$arity$5(client,session,convo_id,message_id,emoji);
} else {
return knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_react_BANG_$dyn_34098(client,session,convo_id,message_id,emoji);
}
});

knoxx.backend.domain.bluesky.client.bluesky_service_base_url = "https://bsky.social";
knoxx.backend.domain.bluesky.client.bluesky_public_base_url = "https://public.api.bsky.app";
knoxx.backend.domain.bluesky.client.bluesky_chat_base_url = "https://api.bsky.chat";
knoxx.backend.domain.bluesky.client.query_url = (function knoxx$backend$domain$bluesky$client$query_url(base,params){
var search = (new URLSearchParams());
var seq__33809_34101 = cljs.core.seq(params);
var chunk__33810_34102 = null;
var count__33811_34103 = (0);
var i__33812_34104 = (0);
while(true){
if((i__33812_34104 < count__33811_34103)){
var vec__33831_34105 = chunk__33810_34102.cljs$core$IIndexed$_nth$arity$2(null,i__33812_34104);
var k_34106 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33831_34105,(0),null);
var v_34107 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33831_34105,(1),null);
if((((v_34107 == null)) || (((typeof v_34107 === 'string') && (clojure.string.blank_QMARK_(v_34107)))))){
} else {
search.append(cljs.core.name(k_34106),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v_34107)));
}


var G__34109 = seq__33809_34101;
var G__34110 = chunk__33810_34102;
var G__34111 = count__33811_34103;
var G__34112 = (i__33812_34104 + (1));
seq__33809_34101 = G__34109;
chunk__33810_34102 = G__34110;
count__33811_34103 = G__34111;
i__33812_34104 = G__34112;
continue;
} else {
var temp__5825__auto___34113 = cljs.core.seq(seq__33809_34101);
if(temp__5825__auto___34113){
var seq__33809_34114__$1 = temp__5825__auto___34113;
if(cljs.core.chunked_seq_QMARK_(seq__33809_34114__$1)){
var c__5694__auto___34115 = cljs.core.chunk_first(seq__33809_34114__$1);
var G__34116 = cljs.core.chunk_rest(seq__33809_34114__$1);
var G__34117 = c__5694__auto___34115;
var G__34118 = cljs.core.count(c__5694__auto___34115);
var G__34119 = (0);
seq__33809_34101 = G__34116;
chunk__33810_34102 = G__34117;
count__33811_34103 = G__34118;
i__33812_34104 = G__34119;
continue;
} else {
var vec__33837_34120 = cljs.core.first(seq__33809_34114__$1);
var k_34121 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33837_34120,(0),null);
var v_34122 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33837_34120,(1),null);
if((((v_34122 == null)) || (((typeof v_34122 === 'string') && (clojure.string.blank_QMARK_(v_34122)))))){
} else {
search.append(cljs.core.name(k_34121),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v_34122)));
}


var G__34123 = cljs.core.next(seq__33809_34114__$1);
var G__34124 = null;
var G__34125 = (0);
var G__34126 = (0);
seq__33809_34101 = G__34123;
chunk__33810_34102 = G__34124;
count__33811_34103 = G__34125;
i__33812_34104 = G__34126;
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
knoxx.backend.domain.bluesky.client.bearer_token = (function knoxx$backend$domain$bluesky$client$bearer_token(session){
var or__5162__auto__ = new cljs.core.Keyword(null,"accessJwt","accessJwt",366644135).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"access-jwt","access-jwt",-867845458).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.map_QMARK_(session)){
return null;
} else {
return (session["accessJwt"]);
}
}
}
});
knoxx.backend.domain.bluesky.client.session_did = (function knoxx$backend$domain$bluesky$client$session_did(session){
var or__5162__auto__ = new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.map_QMARK_(session)){
return null;
} else {
return (session["did"]);
}
}
});
knoxx.backend.domain.bluesky.client.json_request_BANG_ = (function knoxx$backend$domain$bluesky$client$json_request_BANG_(http_client,p__33853){
var map__33857 = p__33853;
var map__33857__$1 = cljs.core.__destructure_map(map__33857);
var method = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33857__$1,new cljs.core.Keyword(null,"method","method",55703592));
var url = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33857__$1,new cljs.core.Keyword(null,"url","url",276297046));
var headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33857__$1,new cljs.core.Keyword(null,"headers","headers",-835030129));
var body = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33857__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33857__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33857__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),(function (){var G__33885 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"headers","headers",-835030129),headers], null);
if((!((body == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33885,new cljs.core.Keyword(null,"json","json",1279968570),body);
} else {
return G__33885;
}
})(),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp):(function (){throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" error "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))))})()));
}));
}));
});
knoxx.backend.domain.bluesky.client.json_get_BANG_ = (function knoxx$backend$domain$bluesky$client$json_get_BANG_(http_client,url,headers,label){
return knoxx.backend.domain.bluesky.client.json_request_BANG_(http_client,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"headers","headers",-835030129),headers,new cljs.core.Keyword(null,"label","label",1718410804),label], null));
});
knoxx.backend.domain.bluesky.client.json_post_BANG_ = (function knoxx$backend$domain$bluesky$client$json_post_BANG_(http_client,url,headers,body,label){
return knoxx.backend.domain.bluesky.client.json_request_BANG_(http_client,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"headers","headers",-835030129),headers,new cljs.core.Keyword(null,"body","body",-2049205669),body,new cljs.core.Keyword(null,"label","label",1718410804),label], null));
});
knoxx.backend.domain.bluesky.client.public_headers = (function knoxx$backend$domain$bluesky$client$public_headers(){
return new cljs.core.PersistentArrayMap(null, 2, ["Accept","application/json","User-Agent","Knoxx-Agent/1.0"], null);
});
knoxx.backend.domain.bluesky.client.json_headers = (function knoxx$backend$domain$bluesky$client$json_headers(){
return new cljs.core.PersistentArrayMap(null, 2, ["Content-Type","application/json","User-Agent","Knoxx-Agent/1.0"], null);
});
knoxx.backend.domain.bluesky.client.auth_headers = (function knoxx$backend$domain$bluesky$client$auth_headers(session){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.bluesky.client.public_headers(),"Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bearer_token(session))));
});
knoxx.backend.domain.bluesky.client.auth_json_headers = (function knoxx$backend$domain$bluesky$client$auth_json_headers(session){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.bluesky.client.json_headers(),"Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bearer_token(session))));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {knoxx.backend.domain.bluesky.client.IBlueskyClient}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.domain.bluesky.client.FetchBlueskyClient = (function (http_client,__meta,__extmap,__hash){
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k33932,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__33962 = k33932;
var G__33962__$1 = (((G__33962 instanceof cljs.core.Keyword))?G__33962.fqn:null);
switch (G__33962__$1) {
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k33932,else__5472__auto__);

}
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__33964){
var vec__33965 = p__33964;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33965,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33965,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.bluesky.client.FetchBlueskyClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__33931){
var self__ = this;
var G__33931__$1 = this;
return (new cljs.core.RecordIter((0),G__33931__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-2042500107 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this33933,other33934){
var self__ = this;
var this33933__$1 = this;
return (((!((other33934 == null)))) && ((((this33933__$1.constructor === other33934.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33933__$1.http_client,other33934.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33933__$1.__extmap,other33934.__extmap)))))));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k33932){
var self__ = this;
var this__5476__auto____$1 = this;
var G__33986 = k33932;
var G__33986__$1 = (((G__33986 instanceof cljs.core.Keyword))?G__33986.fqn:null);
switch (G__33986__$1) {
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k33932);

}
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__33931){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__33987 = cljs.core.keyword_identical_QMARK_;
var expr__33988 = k__5478__auto__;
if(cljs.core.truth_((pred__33987.cljs$core$IFn$_invoke$arity$2 ? pred__33987.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33988) : pred__33987.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33988)))){
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(G__33931,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__33931),null));
}
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$create_record_BANG_$arity$4 = (function (_,session,collection,record){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_post_BANG_(self__.http_client,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/com.atproto.repo.createRecord"),knoxx.backend.domain.bluesky.client.auth_json_headers(session),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"repo","repo",-1999060679),knoxx.backend.domain.bluesky.client.session_did(session),new cljs.core.Keyword(null,"collection","collection",-683361892),collection,new cljs.core.Keyword(null,"record","record",-779106859),record], null),"Bluesky create record");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$create_session_BANG_$arity$2 = (function (_,credentials){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_post_BANG_(self__.http_client,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/com.atproto.server.createSession"),knoxx.backend.domain.bluesky.client.json_headers(),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"identifier","identifier",-805503498),new cljs.core.Keyword(null,"identifier","identifier",-805503498).cljs$core$IFn$_invoke$arity$1(credentials),new cljs.core.Keyword(null,"password","password",417022471),new cljs.core.Keyword(null,"password","password",417022471).cljs$core$IFn$_invoke$arity$1(credentials)], null),"Bluesky auth");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$notifications_BANG_$arity$3 = (function (_,session,p__33992){
var self__ = this;
var map__33993 = p__33992;
var map__33993__$1 = cljs.core.__destructure_map(map__33993);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33993__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var cursor = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33993__$1,new cljs.core.Keyword(null,"cursor","cursor",1011937484));
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/app.bsky.notification.listNotifications"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"cursor","cursor",1011937484),cursor], null)),knoxx.backend.domain.bluesky.client.auth_headers(session),"Bluesky notifications");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$upload_blob_BANG_$arity$4 = (function (_,session,buffer,mime_type){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/com.atproto.repo.uploadBlob"),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 2, ["Content-Type",mime_type,"Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bearer_token(session)))], null),new cljs.core.Keyword(null,"body","body",-2049205669),buffer], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(60000)], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp):(function (){throw (new Error((""+"Blob upload error "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))))})()));
}));
}));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$thread_BANG_$arity$4 = (function (_,_session,uri,depth){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_public_base_url)+"/xrpc/app.bsky.feed.getPostThread"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"uri","uri",-774711847),uri,new cljs.core.Keyword(null,"depth","depth",1768663640),depth], null)),knoxx.backend.domain.bluesky.client.public_headers(),"Bluesky thread");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$follows_BANG_$arity$3 = (function (_,actor,limit){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_public_base_url)+"/xrpc/app.bsky.graph.getFollows"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.public_headers(),"Bluesky follows");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$delete_record_BANG_$arity$4 = (function (_,session,collection,rkey){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_post_BANG_(self__.http_client,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/com.atproto.repo.deleteRecord"),knoxx.backend.domain.bluesky.client.auth_json_headers(session),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"repo","repo",-1999060679),knoxx.backend.domain.bluesky.client.session_did(session),new cljs.core.Keyword(null,"collection","collection",-683361892),collection,new cljs.core.Keyword(null,"rkey","rkey",-1712336442),rkey], null),"Bluesky delete record");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_react_BANG_$arity$5 = (function (_,session,convo_id,message_id,emoji){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_post_BANG_(self__.http_client,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_chat_base_url)+"/xrpc/chat.bsky.convo.addReaction"),knoxx.backend.domain.bluesky.client.auth_json_headers(session),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"convoId","convoId",123601697),convo_id,new cljs.core.Keyword(null,"messageId","messageId",-260575736),message_id,new cljs.core.Keyword(null,"value","value",305978217),emoji], null),"Bluesky chat react");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_read_BANG_$arity$4 = (function (_,session,convo_id,p__33996){
var self__ = this;
var map__33997 = p__33996;
var map__33997__$1 = cljs.core.__destructure_map(map__33997);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33997__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_chat_base_url)+"/xrpc/chat.bsky.convo.getMessages"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"convoId","convoId",123601697),convo_id,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.auth_headers(session),"Bluesky chat messages");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$search_actors_BANG_$arity$4 = (function (_,session,query,limit){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/app.bsky.actor.searchActors"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"q","q",689001697),query,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.auth_headers(session),"Bluesky search");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$profile_BANG_$arity$2 = (function (_,actor){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_public_base_url)+"/xrpc/app.bsky.actor.getProfile"),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor], null)),knoxx.backend.domain.bluesky.client.public_headers(),"Bluesky profile");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$timeline_BANG_$arity$3 = (function (_,session,p__33999){
var self__ = this;
var map__34000 = p__33999;
var map__34000__$1 = cljs.core.__destructure_map(map__34000);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34000__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var cursor = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34000__$1,new cljs.core.Keyword(null,"cursor","cursor",1011937484));
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/app.bsky.feed.getTimeline"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"cursor","cursor",1011937484),cursor], null)),knoxx.backend.domain.bluesky.client.auth_headers(session),"Bluesky timeline");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$followers_BANG_$arity$3 = (function (_,actor,limit){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_public_base_url)+"/xrpc/app.bsky.graph.getFollowers"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.public_headers(),"Bluesky followers");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_send_BANG_$arity$4 = (function (_,session,convo_id,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_post_BANG_(self__.http_client,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_chat_base_url)+"/xrpc/chat.bsky.convo.sendMessage"),knoxx.backend.domain.bluesky.client.auth_json_headers(session),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"convoId","convoId",123601697),convo_id,new cljs.core.Keyword(null,"message","message",-406056002),payload], null),"Bluesky chat send");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$chat_list_BANG_$arity$3 = (function (_,session,p__34005){
var self__ = this;
var map__34006 = p__34005;
var map__34006__$1 = cljs.core.__destructure_map(map__34006);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34006__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_chat_base_url)+"/xrpc/chat.bsky.convo.listConvos"),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.auth_headers(session),"Bluesky chat list");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$resolve_post_BANG_$arity$2 = (function (_,uri){
var self__ = this;
var ___$1 = this;
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_public_base_url)+"/xrpc/app.bsky.feed.getPosts"),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"uris","uris",-253706916),uri], null)),knoxx.backend.domain.bluesky.client.public_headers(),"Bluesky resolve post")),(function (payload){
return promesa.protocols._promise((function (){var post = cljs.core.first((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"posts","posts",760043164).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
if(cljs.core.truth_(post)){
} else {
throw (new Error((""+"Could not resolve post: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri))));
}

return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"uri","uri",-774711847),uri,new cljs.core.Keyword(null,"cid","cid",-1940591320),new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(post),new cljs.core.Keyword(null,"text","text",-1790561697),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(post,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"record","record",-779106859),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"authorHandle","authorHandle",1083116491),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(post,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"author","author",2111686192),new cljs.core.Keyword(null,"handle","handle",1538948854)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"authorDid","authorDid",1300931110),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(post,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"author","author",2111686192),new cljs.core.Keyword(null,"did","did",593382517)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()], null);
})());
}));
}));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$actor_feed_BANG_$arity$4 = (function (_,_session,actor,limit){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_public_base_url)+"/xrpc/app.bsky.feed.getAuthorFeed"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.public_headers(),"Bluesky author feed");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.knoxx$backend$domain$bluesky$client$IBlueskyClient$search_posts_BANG_$arity$4 = (function (_,session,query,limit){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.bluesky.client.json_get_BANG_(self__.http_client,knoxx.backend.domain.bluesky.client.query_url((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.bluesky.client.bluesky_service_base_url)+"/xrpc/app.bsky.feed.searchPosts"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"q","q",689001697),query,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)),knoxx.backend.domain.bluesky.client.auth_headers(session),"Bluesky search");
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__33931){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(self__.http_client,G__33931,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.cljs$lang$type = true);

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.bluesky.client/FetchBlueskyClient",null,(1),null));
}));

(knoxx.backend.domain.bluesky.client.FetchBlueskyClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.bluesky.client/FetchBlueskyClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.bluesky.client/FetchBlueskyClient.
 */
knoxx.backend.domain.bluesky.client.__GT_FetchBlueskyClient = (function knoxx$backend$domain$bluesky$client$__GT_FetchBlueskyClient(http_client){
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.bluesky.client/FetchBlueskyClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.bluesky.client.map__GT_FetchBlueskyClient = (function knoxx$backend$domain$bluesky$client$map__GT_FetchBlueskyClient(G__33939){
var extmap__5511__auto__ = (function (){var G__34051 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__33939,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
if(cljs.core.record_QMARK_(G__33939)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__34051);
} else {
return G__34051;
}
})();
return (new knoxx.backend.domain.bluesky.client.FetchBlueskyClient(new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__33939),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.bluesky.client.client = (function knoxx$backend$domain$bluesky$client$client(var_args){
var G__34059 = arguments.length;
switch (G__34059) {
case 0:
return knoxx.backend.domain.bluesky.client.client.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.domain.bluesky.client.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.bluesky.client.client.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.domain.bluesky.client.client.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.bluesky.client.client.cljs$core$IFn$_invoke$arity$1 = (function (p__34060){
var map__34061 = p__34060;
var map__34061__$1 = cljs.core.__destructure_map(map__34061);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34061__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.domain.bluesky.client.__GT_FetchBlueskyClient((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.domain.bluesky.client.client.cljs$lang$maxFixedArity = 1);


//# sourceMappingURL=knoxx.backend.domain.bluesky.client.js.map
