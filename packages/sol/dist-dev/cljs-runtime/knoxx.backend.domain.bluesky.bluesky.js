import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.bluesky.client.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.actor.credentials.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.tools.js";
goog.provide('knoxx.backend.domain.bluesky.bluesky');
knoxx.backend.domain.bluesky.bluesky.publish_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Bluesky post text. Keep it concise and under platform limits."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"images","images",1757475080),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional image sources (workspace paths, URLs, or data URLs). Up to 4 images."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"imageAlts","imageAlts",1898333924),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional alt text for each image."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"replyTo","replyTo",-438666350),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional AT-URI of a post to reply to."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.profile_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional Bluesky handle or DID. Defaults to the authenticated account."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.search_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Search query for Bluesky posts or actors."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"posts or actors. Defaults to posts."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum results to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(25)], null)], null)], null)], null);
knoxx.backend.domain.bluesky.bluesky.feed_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Bluesky handle or DID whose feed should be read."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum posts to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(25)], null)], null)], null)], null);
knoxx.backend.domain.bluesky.bluesky.timeline_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum timeline posts to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(25)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cursor","cursor",1011937484),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional pagination cursor from a previous bluesky.timeline call."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.post_uri_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"uri","uri",-774711847),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"AT-URI of the Bluesky post (at://did/collection/rkey)."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.actor_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Bluesky handle or DID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.thread_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"uri","uri",-774711847),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"AT-URI of the root post to read the thread for."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"depth","depth",1768663640),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Depth of replies to fetch. Default 6."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(10)], null)], null)], null)], null);
knoxx.backend.domain.bluesky.bluesky.notifications_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum notifications to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(50)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cursor","cursor",1011937484),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional pagination cursor."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.chat_send_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"convoId","convoId",123601697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Conversation ID (from bluesky.chat.list)."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Message text to send."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"replyToMessageId","replyToMessageId",750443682),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional message ID to reply to within the conversation."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.chat_list_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum conversations to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(50)], null)], null)], null)], null);
knoxx.backend.domain.bluesky.bluesky.chat_read_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"convoId","convoId",123601697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Conversation ID (from bluesky.chat.list)."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"limit","limit",-1355822363),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum messages to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(100)], null)], null)], null)], null);
knoxx.backend.domain.bluesky.bluesky.chat_react_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"convoId","convoId",123601697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Conversation ID."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"messageId","messageId",-260575736),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Message ID to react to."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"emoji","emoji",1031230144),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Emoji reaction (e.g. \u2764\uFE0F, \uD83D\uDD25, \uD83D\uDE02)."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.bluesky.bluesky.bluesky_client = (function knoxx$backend$domain$bluesky$bluesky$bluesky_client(){
return knoxx.backend.domain.bluesky.client.client.cljs$core$IFn$_invoke$arity$0();
});
knoxx.backend.domain.bluesky.bluesky.bluesky_auth_config_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_auth_config_BANG_(runtime){
var credential = (await knoxx.backend.domain.actor.credentials.get_credential_BANG_(runtime,"bluesky"));
var identifier = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.actor.credentials.secret_value.cljs$core$IFn$_invoke$arity$variadic(credential,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"identifier","identifier",-805503498),new cljs.core.Keyword(null,"handle","handle",1538948854),new cljs.core.Keyword(null,"username","username",1605666410)], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"accountIdentifier","accountIdentifier",-2043083613).cljs$core$IFn$_invoke$arity$1(credential);
}
})());
var password = knoxx.backend.domain.actor.credentials.secret_value.cljs$core$IFn$_invoke$arity$variadic(credential,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"appPassword","appPassword",-387211090),new cljs.core.Keyword(null,"app-password","app-password",-2097591655),new cljs.core.Keyword(null,"password","password",417022471)], 0));
if(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(identifier)))) || (clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(password)))))){
throw (new Error("Bluesky actor credential must include identifier and appPassword."));
} else {
}

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"identifier","identifier",-805503498),identifier,new cljs.core.Keyword(null,"password","password",417022471),password], null);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_create_session_BANG_(runtime){
var credentials = (await knoxx.backend.domain.bluesky.bluesky.bluesky_auth_config_BANG_(runtime));
return (await knoxx.backend.domain.bluesky.client.create_session_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),credentials));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_upload_blob_BANG_ = (function knoxx$backend$domain$bluesky$bluesky$bluesky_upload_blob_BANG_(session,buffer,mime_type){
return knoxx.backend.domain.bluesky.client.upload_blob_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,buffer,mime_type);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_create_record_BANG_ = (function knoxx$backend$domain$bluesky$bluesky$bluesky_create_record_BANG_(session,collection,record){
return knoxx.backend.domain.bluesky.client.create_record_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,collection,record);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_delete_record_BANG_ = (function knoxx$backend$domain$bluesky$bluesky$bluesky_delete_record_BANG_(session,collection,rkey){
return knoxx.backend.domain.bluesky.client.delete_record_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,collection,rkey);
});
knoxx.backend.domain.bluesky.bluesky.parse_at_uri = (function knoxx$backend$domain$bluesky$bluesky$parse_at_uri(uri){
var parts = (function (){var G__27951 = uri;
var G__27951__$1 = (((G__27951 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27951)));
if((G__27951__$1 == null)){
return null;
} else {
return clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__27951__$1,/\//);
}
})();
var repo = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(parts,(2),null);
var collection = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(parts,(3),null);
var rkey = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(parts,(4),null);
if(cljs.core.truth_((function (){var and__5160__auto__ = repo;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = collection;
if(cljs.core.truth_(and__5160__auto____$1)){
return rkey;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"repo","repo",-1999060679),repo,new cljs.core.Keyword(null,"collection","collection",-683361892),collection,new cljs.core.Keyword(null,"rkey","rkey",-1712336442),rkey], null);
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.bluesky_resolve_post_BANG_ = (function knoxx$backend$domain$bluesky$bluesky$bluesky_resolve_post_BANG_(uri){
return knoxx.backend.domain.bluesky.client.resolve_post_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),uri);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_post_url = (function knoxx$backend$domain$bluesky$bluesky$bluesky_post_url(handle,uri){
var post_id = (function (){var G__27954 = uri;
var G__27954__$1 = (((G__27954 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27954)));
var G__27954__$2 = (((G__27954__$1 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__27954__$1,/\//));
if((G__27954__$2 == null)){
return null;
} else {
return cljs.core.last(G__27954__$2);
}
})();
if((((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle)))))) && ((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(post_id)))))))){
return (""+"https://bsky.app/profile/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle)+"/post/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(post_id));
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.format_posts = (function knoxx$backend$domain$bluesky$bluesky$format_posts(prefix,rows){
var lines = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__27957){
var map__27959 = p__27957;
var map__27959__$1 = cljs.core.__destructure_map(map__27959);
var displayName = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27959__$1,new cljs.core.Keyword(null,"displayName","displayName",-809144601));
var handle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27959__$1,new cljs.core.Keyword(null,"handle","handle",1538948854));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27959__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var url = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27959__$1,new cljs.core.Keyword(null,"url","url",276297046));
return (""+"- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = cljs.core.not_empty(displayName);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = handle;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle))))))?(""+" (@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle)+")"):null))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(220)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url))))))?(""+"\n  "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)):null)));
}),rows));
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(lines))?null:(""+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(lines)))));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_search_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_search_BANG_(runtime,query,kind,limit){
var kind__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"actors"))?"actors":"posts");
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var payload = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind__$1,"actors"))?(await knoxx.backend.domain.bluesky.client.search_actors_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,query,limit)):(await knoxx.backend.domain.bluesky.client.search_posts_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,query,limit)));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind__$1,"actors")){
var results = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (actor){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"handle","handle",1538948854),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"displayName","displayName",-809144601),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"description","description",-1428560544),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"did","did",593382517),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"url","url",276297046),(function (){var temp__5825__auto__ = (function (){var G__27965 = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(actor);
var G__27965__$1 = (((G__27965 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27965)));
if((G__27965__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__27965__$1);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var handle = temp__5825__auto__;
return (""+"https://bsky.app/profile/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle));
} else {
return null;
}
})()], null);
}),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actors","actors",-1845636398).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),kind__$1,new cljs.core.Keyword(null,"results","results",-1134170113),results], null);
} else {
var results = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (post){
var author = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(post);
var record = new cljs.core.Keyword(null,"record","record",-779106859).cljs$core$IFn$_invoke$arity$1(post);
var handle = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"handle","handle",1538948854),handle,new cljs.core.Keyword(null,"displayName","displayName",-809144601),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"text","text",-1790561697),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"uri","uri",-774711847),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.bluesky.bluesky.bluesky_post_url(handle,new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post))], null);
}),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"posts","posts",760043164).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),kind__$1,new cljs.core.Keyword(null,"results","results",-1134170113),results], null);
}
});
knoxx.backend.domain.bluesky.bluesky.bluesky_profile_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_profile_BANG_(runtime,actor){
var actor__$1 = (await (async function (){var G__27975 = actor;
var G__27975__$1 = (((G__27975 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27975)));
if((G__27975__$1 == null)){
return null;
} else {
return clojure.string.trim(G__27975__$1);
}
})());
var resolved_actor = ((clojure.string.blank_QMARK_(actor__$1))?(await (async function (){var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(session);
}
})()):actor__$1);
var profile = (await knoxx.backend.domain.bluesky.client.profile_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),resolved_actor));
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"did","did",593382517),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"handle","handle",1538948854),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"displayName","displayName",-809144601),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"description","description",-1428560544),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"followersCount","followersCount",635176802),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"followersCount","followersCount",635176802).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"followsCount","followsCount",-1543777013),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"followsCount","followsCount",-1543777013).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"postsCount","postsCount",1128073488),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"postsCount","postsCount",1128073488).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"url","url",276297046),(await (async function (){var temp__5825__auto__ = (await (async function (){var G__27979 = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(profile);
var G__27979__$1 = (((G__27979 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27979)));
if((G__27979__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__27979__$1);
}
})());
if(cljs.core.truth_(temp__5825__auto__)){
var handle = temp__5825__auto__;
return (""+"https://bsky.app/profile/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle));
} else {
return null;
}
})())], null);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_author_feed_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_author_feed_BANG_(actor,limit){
var payload = (await knoxx.backend.domain.bluesky.client.actor_feed_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),null,actor,limit));
var results = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (entry){
var post = new cljs.core.Keyword(null,"post","post",269697687).cljs$core$IFn$_invoke$arity$1(entry);
var author = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(post);
var record = new cljs.core.Keyword(null,"record","record",-779106859).cljs$core$IFn$_invoke$arity$1(post);
var handle = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"handle","handle",1538948854),handle,new cljs.core.Keyword(null,"displayName","displayName",-809144601),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"text","text",-1790561697),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"uri","uri",-774711847),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.bluesky.bluesky.bluesky_post_url(handle,new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post))], null);
}),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"feed","feed",-1566486205).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor,new cljs.core.Keyword(null,"results","results",-1134170113),results], null);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_timeline_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_timeline_BANG_(runtime,limit,cursor){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var payload = (await knoxx.backend.domain.bluesky.client.timeline_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"cursor","cursor",1011937484),cursor], null)));
var results = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (entry){
var post = new cljs.core.Keyword(null,"post","post",269697687).cljs$core$IFn$_invoke$arity$1(entry);
var author = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(post);
var record = new cljs.core.Keyword(null,"record","record",-779106859).cljs$core$IFn$_invoke$arity$1(post);
var handle = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"handle","handle",1538948854),handle,new cljs.core.Keyword(null,"displayName","displayName",-809144601),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"text","text",-1790561697),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"uri","uri",-774711847),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.bluesky.bluesky.bluesky_post_url(handle,new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post))], null);
}),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"feed","feed",-1566486205).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"cursor","cursor",1011937484),new cljs.core.Keyword(null,"cursor","cursor",1011937484).cljs$core$IFn$_invoke$arity$1(payload),new cljs.core.Keyword(null,"results","results",-1134170113),results], null);
});
knoxx.backend.domain.bluesky.bluesky.text__GT_utf8_bytes = (function knoxx$backend$domain$bluesky$bluesky$text__GT_utf8_bytes(text){
return Uint8Array.from(Array.from((new TextEncoder()).encode(text)));
});
knoxx.backend.domain.bluesky.bluesky.build_hashtag_facets = (function knoxx$backend$domain$bluesky$bluesky$build_hashtag_facets(text){
var hashtag_re = (new RegExp("#(\\w+)","g"));
var matches = (function (){var m = hashtag_re.exec(text);
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((m == null)){
return acc;
} else {
var full_match = (m[(0)]);
var tag = (m[(1)]);
var start_char = m.index;
var prefix = text.substring((0),start_char);
var start_byte = knoxx.backend.domain.bluesky.bluesky.text__GT_utf8_bytes(prefix).length;
var end_byte = (start_byte + knoxx.backend.domain.bluesky.bluesky.text__GT_utf8_bytes(full_match).length);
var G__28776 = hashtag_re.exec(text);
var G__28777 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,new cljs.core.PersistentArrayMap(null, 3, ["$type","app.bsky.richtext.facet",new cljs.core.Keyword(null,"index","index",-1531685915),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"byteStart","byteStart",1376045790),start_byte,new cljs.core.Keyword(null,"byteEnd","byteEnd",1658136580),end_byte], null),new cljs.core.Keyword(null,"features","features",-1146962336),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, ["$type","app.bsky.richtext.facet#tag",new cljs.core.Keyword(null,"tag","tag",-1290361223),tag], null)], null)], null));
m = G__28776;
acc = G__28777;
continue;
}
break;
}
})();
if(cljs.core.seq(matches)){
return matches;
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.build_url_facets = (function knoxx$backend$domain$bluesky$bluesky$build_url_facets(text){
var url_re = (new RegExp("(https?://[^\\s]+)","g"));
var matches = (function (){var m = url_re.exec(text);
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((m == null)){
return acc;
} else {
var full_match = (m[(0)]);
var start_char = m.index;
var prefix = text.substring((0),start_char);
var start_byte = knoxx.backend.domain.bluesky.bluesky.text__GT_utf8_bytes(prefix).length;
var end_byte = (start_byte + knoxx.backend.domain.bluesky.bluesky.text__GT_utf8_bytes(full_match).length);
var G__28786 = url_re.exec(text);
var G__28787 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,new cljs.core.PersistentArrayMap(null, 3, ["$type","app.bsky.richtext.facet",new cljs.core.Keyword(null,"index","index",-1531685915),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"byteStart","byteStart",1376045790),start_byte,new cljs.core.Keyword(null,"byteEnd","byteEnd",1658136580),end_byte], null),new cljs.core.Keyword(null,"features","features",-1146962336),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, ["$type","app.bsky.richtext.facet#link",new cljs.core.Keyword(null,"uri","uri",-774711847),full_match], null)], null)], null));
m = G__28786;
acc = G__28787;
continue;
}
break;
}
})();
if(cljs.core.seq(matches)){
return matches;
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.build_facets = (function knoxx$backend$domain$bluesky$bluesky$build_facets(text){
var hashtags = knoxx.backend.domain.bluesky.bluesky.build_hashtag_facets(text);
var urls = knoxx.backend.domain.bluesky.bluesky.build_url_facets(text);
if(cljs.core.truth_((function (){var or__5162__auto__ = hashtags;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return urls;
}
})())){
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(hashtags,urls));
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.load_and_upload_image_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$load_and_upload_image_BANG_(runtime,config,session,alts,idx,img_src){
var source = (await knoxx.backend.domain.media.load_media_source_BANG_(runtime,config,img_src,knoxx.backend.domain.media.multimodal_upload_max_bytes));
var blob_result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_upload_blob_BANG_(session,new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(source)));
var blob = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"blob","blob",1636965233).cljs$core$IFn$_invoke$arity$1(blob_result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return blob_result;
}
})());
var alt = (await (async function (){var or__5162__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(alts,idx,null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alt","alt",-3214426),alt,new cljs.core.Keyword(null,"image","image",-58725096),blob], null);
});
knoxx.backend.domain.bluesky.bluesky.load_and_upload_images_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$load_and_upload_images_BANG_(runtime,config,session,images,alts){
if(cljs.core.seq(images)){
var uploaded = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.bluesky.bluesky.load_and_upload_image_BANG_,runtime,config,session,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([alts], 0)),images))));
return new cljs.core.PersistentArrayMap(null, 2, ["$type","app.bsky.embed.images",new cljs.core.Keyword(null,"images","images",1757475080),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(uploaded))], null);
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.resolve_reply_refs_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$resolve_reply_refs_BANG_(reply_to_uri){
if(clojure.string.blank_QMARK_(reply_to_uri)){
return null;
} else {
var parent = (await knoxx.backend.domain.bluesky.bluesky.bluesky_resolve_post_BANG_(reply_to_uri));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"parent","parent",-878878779),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"uri","uri",-774711847),new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(parent),new cljs.core.Keyword(null,"cid","cid",-1940591320),new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(parent)], null),new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"uri","uri",-774711847),new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(parent),new cljs.core.Keyword(null,"cid","cid",-1940591320),new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(parent)], null)], null);
}
});
knoxx.backend.domain.bluesky.bluesky.bluesky_publish_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_publish_BANG_(runtime,config,text,images,image_alts,reply_to){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var embed = (await knoxx.backend.domain.bluesky.bluesky.load_and_upload_images_BANG_(runtime,config,session,images,image_alts));
var reply_refs = (await knoxx.backend.domain.bluesky.bluesky.resolve_reply_refs_BANG_(reply_to));
var facets = knoxx.backend.domain.bluesky.bluesky.build_facets(text);
var record = (await (async function (){var G__28057 = new cljs.core.PersistentArrayMap(null, 3, ["$type","app.bsky.feed.post",new cljs.core.Keyword(null,"text","text",-1790561697),text,new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()).toISOString()], null);
var G__28057__$1 = (cljs.core.truth_(facets)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28057,new cljs.core.Keyword(null,"facets","facets",-2061519464),facets):G__28057);
var G__28057__$2 = (cljs.core.truth_(embed)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28057__$1,new cljs.core.Keyword(null,"embed","embed",-1354913349),embed):G__28057__$1);
if(cljs.core.truth_(reply_refs)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28057__$2,new cljs.core.Keyword(null,"reply","reply",1144328671),reply_refs);
} else {
return G__28057__$2;
}
})());
var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_record_BANG_(session,"app.bsky.feed.post",record));
var uri = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"uri","uri",-774711847),uri,new cljs.core.Keyword(null,"cid","cid",-1940591320),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"url","url",276297046),(await (async function (){var or__5162__auto__ = knoxx.backend.domain.bluesky.bluesky.bluesky_post_url(new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(session),uri);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())], null);
});
knoxx.backend.domain.bluesky.bluesky.publish_execute = (async function knoxx$backend$domain$bluesky$bluesky$publish_execute(runtime,config,_tool_call_id,params,a,b,c){
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
var text = (await (async function (){var or__5162__auto__ = (params["text"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var images = (await (async function (){var or__5162__auto__ = (params["images"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var image_alts = (await (async function (){var or__5162__auto__ = (params["imageAlts"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var reply_to = (await (async function (){var or__5162__auto__ = (params["replyTo"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(clojure.string.trim(text))){
throw (new Error("text is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Publishing to Bluesky\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_publish_BANG_(runtime,config,text,images,image_alts,reply_to));
return knoxx.backend.domain.text.tool_text_result((""+"Published Bluesky post\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()))),result);
});
knoxx.backend.domain.bluesky.bluesky.profile_execute = (async function knoxx$backend$domain$bluesky$bluesky$profile_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var actor = (await (async function (){var or__5162__auto__ = (params["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Reading Bluesky profile\u2026");

var profile = (await knoxx.backend.domain.bluesky.bluesky.bluesky_profile_BANG_(runtime,actor));
return knoxx.backend.domain.text.tool_text_result((""+"Bluesky profile: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})()))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(profile)))))?null:(""+" (@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(profile))+")")))+"\nFollowers: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"followersCount","followersCount",635176802).cljs$core$IFn$_invoke$arity$1(profile))+" | Following: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"followsCount","followsCount",-1543777013).cljs$core$IFn$_invoke$arity$1(profile))+" | Posts: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"postsCount","postsCount",1128073488).cljs$core$IFn$_invoke$arity$1(profile))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(profile)))))?null:(""+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(profile)))))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(profile)))))?null:(""+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(profile)))))),profile);
});
knoxx.backend.domain.bluesky.bluesky.search_execute = (async function knoxx$backend$domain$bluesky$bluesky$search_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var query = (await (async function (){var or__5162__auto__ = (params["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var kind = (await (async function (){var or__5162__auto__ = (params["kind"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "posts";
}
})());
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((25),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (5);
}
})())));
if(clojure.string.blank_QMARK_(clojure.string.trim(query))){
throw (new Error("query is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Searching Bluesky\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_search_BANG_(runtime,query,kind,limit));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.bluesky.bluesky.format_posts((""+"Bluesky search ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(result))+")"),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)),result);
});
knoxx.backend.domain.bluesky.bluesky.author_feed_execute = (async function knoxx$backend$domain$bluesky$bluesky$author_feed_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var actor = (await (async function (){var or__5162__auto__ = (params["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((25),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (8);
}
})())));
if(clojure.string.blank_QMARK_(clojure.string.trim(actor))){
throw (new Error("actor is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reading Bluesky feed for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)+"\u2026"));

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_author_feed_BANG_(actor,limit));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.bluesky.bluesky.format_posts((""+"Bluesky author feed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)),result);
});
knoxx.backend.domain.bluesky.bluesky.timeline_execute = (async function knoxx$backend$domain$bluesky$bluesky$timeline_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((25),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (8);
}
})())));
var cursor = (await (async function (){var or__5162__auto__ = (params["cursor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Reading authenticated Bluesky timeline\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_timeline_BANG_(runtime,limit,cursor));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.bluesky.bluesky.format_posts("Bluesky timeline",new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)),result);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_repost_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_repost_BANG_(runtime,uri){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var post = (await knoxx.backend.domain.bluesky.bluesky.bluesky_resolve_post_BANG_(uri));
return (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_record_BANG_(session,"app.bsky.feed.repost",new cljs.core.PersistentArrayMap(null, 3, ["$type","app.bsky.feed.repost",new cljs.core.Keyword(null,"subject","subject",-1411880451),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"uri","uri",-774711847),new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post),new cljs.core.Keyword(null,"cid","cid",-1940591320),new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(post)], null),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()).toISOString()], null)));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_like_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_like_BANG_(runtime,uri){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var post = (await knoxx.backend.domain.bluesky.bluesky.bluesky_resolve_post_BANG_(uri));
return (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_record_BANG_(session,"app.bsky.feed.like",new cljs.core.PersistentArrayMap(null, 3, ["$type","app.bsky.feed.like",new cljs.core.Keyword(null,"subject","subject",-1411880451),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"uri","uri",-774711847),new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post),new cljs.core.Keyword(null,"cid","cid",-1940591320),new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(post)], null),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()).toISOString()], null)));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_unlike_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_unlike_BANG_(runtime,uri){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var map__28130 = knoxx.backend.domain.bluesky.bluesky.parse_at_uri(uri);
var map__28130__$1 = cljs.core.__destructure_map(map__28130);
var repo = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28130__$1,new cljs.core.Keyword(null,"repo","repo",-1999060679));
var collection = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28130__$1,new cljs.core.Keyword(null,"collection","collection",-683361892));
var rkey = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28130__$1,new cljs.core.Keyword(null,"rkey","rkey",-1712336442));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = repo;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = collection;
if(cljs.core.truth_(and__5160__auto____$1)){
return rkey;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})()))){
return (await knoxx.backend.domain.bluesky.bluesky.bluesky_delete_record_BANG_(session,collection,rkey));
} else {
throw (new Error((""+"Invalid AT-URI for unlike: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri))));
}
});
knoxx.backend.domain.bluesky.bluesky.bluesky_follow_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_follow_BANG_(runtime,actor){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var profile = (await knoxx.backend.domain.bluesky.bluesky.bluesky_profile_BANG_(runtime,actor));
return (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_record_BANG_(session,"app.bsky.graph.follow",new cljs.core.PersistentArrayMap(null, 3, ["$type","app.bsky.graph.follow",new cljs.core.Keyword(null,"subject","subject",-1411880451),new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(profile),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()).toISOString()], null)));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_unfollow_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_unfollow_BANG_(runtime,uri){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var map__28139 = knoxx.backend.domain.bluesky.bluesky.parse_at_uri(uri);
var map__28139__$1 = cljs.core.__destructure_map(map__28139);
var repo = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28139__$1,new cljs.core.Keyword(null,"repo","repo",-1999060679));
var collection = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28139__$1,new cljs.core.Keyword(null,"collection","collection",-683361892));
var rkey = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28139__$1,new cljs.core.Keyword(null,"rkey","rkey",-1712336442));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = repo;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = collection;
if(cljs.core.truth_(and__5160__auto____$1)){
return rkey;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})()))){
return (await knoxx.backend.domain.bluesky.bluesky.bluesky_delete_record_BANG_(session,collection,rkey));
} else {
throw (new Error((""+"Invalid AT-URI for unfollow: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri))));
}
});
knoxx.backend.domain.bluesky.bluesky.bluesky_delete_post_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_delete_post_BANG_(runtime,uri){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var map__28146 = knoxx.backend.domain.bluesky.bluesky.parse_at_uri(uri);
var map__28146__$1 = cljs.core.__destructure_map(map__28146);
var repo = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28146__$1,new cljs.core.Keyword(null,"repo","repo",-1999060679));
var collection = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28146__$1,new cljs.core.Keyword(null,"collection","collection",-683361892));
var rkey = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28146__$1,new cljs.core.Keyword(null,"rkey","rkey",-1712336442));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = repo;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = collection;
if(cljs.core.truth_(and__5160__auto____$1)){
return rkey;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})()))){
return (await knoxx.backend.domain.bluesky.bluesky.bluesky_delete_record_BANG_(session,collection,rkey));
} else {
throw (new Error((""+"Invalid AT-URI for delete: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri))));
}
});
knoxx.backend.domain.bluesky.bluesky.format_thread_reply = (function knoxx$backend$domain$bluesky$bluesky$format_thread_reply(reply,depth){
var post = new cljs.core.Keyword(null,"post","post",269697687).cljs$core$IFn$_invoke$arity$1(reply);
var author = (cljs.core.truth_(post)?new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(post):null);
var record = (cljs.core.truth_(post)?new cljs.core.Keyword(null,"record","record",-779106859).cljs$core$IFn$_invoke$arity$1(post):null);
var handle = (function (){var or__5162__auto__ = (cljs.core.truth_(author)?new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(author):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var display_name = (function (){var or__5162__auto__ = (cljs.core.truth_(author)?new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(author):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var text = (function (){var or__5162__auto__ = (cljs.core.truth_(record)?new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(record):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var uri = (function (){var or__5162__auto__ = (cljs.core.truth_(post)?new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(post):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var indent = clojure.string.join.cljs$core$IFn$_invoke$arity$2("",cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(depth,"  "));
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(indent)+"- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = cljs.core.not_empty(display_name);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = handle;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(handle))?null:(""+" (@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(handle)+")")))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(text,(180)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(uri))?null:(""+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(indent)+"  "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri)))));
});
knoxx.backend.domain.bluesky.bluesky.collect_thread_replies = (function knoxx$backend$domain$bluesky$bluesky$collect_thread_replies(thread_node,depth,max_depth,acc){
if((depth > max_depth)){
return acc;
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (a,reply){
var new_acc = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(a,knoxx.backend.domain.bluesky.bluesky.format_thread_reply(reply,depth));
var G__28170 = reply;
var G__28171 = (depth + (1));
var G__28172 = max_depth;
var G__28173 = new_acc;
return (knoxx.backend.domain.bluesky.bluesky.collect_thread_replies.cljs$core$IFn$_invoke$arity$4 ? knoxx.backend.domain.bluesky.bluesky.collect_thread_replies.cljs$core$IFn$_invoke$arity$4(G__28170,G__28171,G__28172,G__28173) : knoxx.backend.domain.bluesky.bluesky.collect_thread_replies.call(null,G__28170,G__28171,G__28172,G__28173));
}),acc,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"replies","replies",-1389888974).cljs$core$IFn$_invoke$arity$1(thread_node);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
}
});
knoxx.backend.domain.bluesky.bluesky.bluesky_thread_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_thread_BANG_(uri,depth){
var payload = (await knoxx.backend.domain.bluesky.client.thread_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),null,uri,depth));
var thread = new cljs.core.Keyword(null,"thread","thread",947001524).cljs$core$IFn$_invoke$arity$1(payload);
var root_post = (cljs.core.truth_(thread)?new cljs.core.Keyword(null,"post","post",269697687).cljs$core$IFn$_invoke$arity$1(thread):null);
var root_author = (cljs.core.truth_(root_post)?new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(root_post):null);
var root_record = (cljs.core.truth_(root_post)?new cljs.core.Keyword(null,"record","record",-779106859).cljs$core$IFn$_invoke$arity$1(root_post):null);
var root_handle = (await (async function (){var or__5162__auto__ = (cljs.core.truth_(root_author)?new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(root_author):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var root_display = (await (async function (){var or__5162__auto__ = (cljs.core.truth_(root_author)?new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(root_author):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var root_text = (await (async function (){var or__5162__auto__ = (cljs.core.truth_(root_record)?new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(root_record):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var root_uri = (await (async function (){var or__5162__auto__ = (cljs.core.truth_(root_post)?new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(root_post):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var root_line = (""+"- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = cljs.core.not_empty(root_display);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = root_handle;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})()))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(root_handle))?null:(""+" (@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(root_handle)+")")))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(root_text,(200)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(root_uri))?null:(""+"\n  "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(root_uri)))));
var reply_lines = knoxx.backend.domain.bluesky.bluesky.collect_thread_replies(thread,(1),depth,cljs.core.PersistentVector.EMPTY);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"uri","uri",-774711847),root_uri,new cljs.core.Keyword(null,"text","text",-1790561697),root_text,new cljs.core.Keyword(null,"handle","handle",1538948854),root_handle], null),new cljs.core.Keyword(null,"lines","lines",-700165781),cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [root_line], null),reply_lines)], null);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_notifications_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_notifications_BANG_(runtime,limit){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
return (await knoxx.backend.domain.bluesky.client.notifications_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_followers_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_followers_BANG_(actor,limit){
var payload = (await knoxx.backend.domain.bluesky.client.followers_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),actor,limit));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor,new cljs.core.Keyword(null,"results","results",-1134170113),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (f){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"handle","handle",1538948854),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(f);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"displayName","displayName",-809144601),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(f);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"did","did",593382517),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(f);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()], null);
}),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"followers","followers",1992141885).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))], null);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_follows_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_follows_BANG_(actor,limit){
var payload = (await knoxx.backend.domain.bluesky.client.follows_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),actor,limit));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor","actor",-1830560481),actor,new cljs.core.Keyword(null,"results","results",-1134170113),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (f){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"handle","handle",1538948854),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(f);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"displayName","displayName",-809144601),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(f);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"did","did",593382517),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(f);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()], null);
}),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"follows","follows",-757192277).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))], null);
});
knoxx.backend.domain.bluesky.bluesky.bluesky_chat_list_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_chat_list_BANG_(runtime,limit){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
return (await knoxx.backend.domain.bluesky.client.chat_list_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_chat_messages_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_chat_messages_BANG_(runtime,convo_id,limit){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
return (await knoxx.backend.domain.bluesky.client.chat_read_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,convo_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null)));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_chat_send_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_chat_send_BANG_(runtime,convo_id,text,reply_to_msg_id){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
var msg = (await (async function (){var G__28214 = new cljs.core.PersistentArrayMap(null, 2, ["$type","chat.bsky.convo.defs#messageInput",new cljs.core.Keyword(null,"text","text",-1790561697),text], null);
if((!(clojure.string.blank_QMARK_(reply_to_msg_id)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28214,new cljs.core.Keyword(null,"replyTo","replyTo",-438666350),new cljs.core.PersistentArrayMap(null, 2, ["$type","chat.bsky.convo.defs#messageRef",new cljs.core.Keyword(null,"messageId","messageId",-260575736),reply_to_msg_id], null));
} else {
return G__28214;
}
})());
return (await knoxx.backend.domain.bluesky.client.chat_send_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,convo_id,msg));
});
knoxx.backend.domain.bluesky.bluesky.bluesky_chat_react_BANG_ = (async function knoxx$backend$domain$bluesky$bluesky$bluesky_chat_react_BANG_(runtime,convo_id,message_id,emoji){
var session = (await knoxx.backend.domain.bluesky.bluesky.bluesky_create_session_BANG_(runtime));
return (await knoxx.backend.domain.bluesky.client.chat_react_BANG_(knoxx.backend.domain.bluesky.bluesky.bluesky_client(),session,convo_id,message_id,emoji));
});
knoxx.backend.domain.bluesky.bluesky.repost_execute = (async function knoxx$backend$domain$bluesky$bluesky$repost_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var uri = (await (async function (){var or__5162__auto__ = (params["uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(uri)){
throw (new Error("uri is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Reposting on Bluesky\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_repost_BANG_(runtime,uri));
return knoxx.backend.domain.text.tool_text_result((""+"Reposted Bluesky post\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return uri;
}
})()))),result);
});
knoxx.backend.domain.bluesky.bluesky.like_execute = (async function knoxx$backend$domain$bluesky$bluesky$like_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var uri = (await (async function (){var or__5162__auto__ = (params["uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(uri)){
throw (new Error("uri is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Liking Bluesky post\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_like_BANG_(runtime,uri));
return knoxx.backend.domain.text.tool_text_result((""+"Liked Bluesky post\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return uri;
}
})()))),result);
});
knoxx.backend.domain.bluesky.bluesky.unlike_execute = (async function knoxx$backend$domain$bluesky$bluesky$unlike_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var uri = (await (async function (){var or__5162__auto__ = (params["uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(uri)){
throw (new Error("uri is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Removing Bluesky like\u2026");

(await knoxx.backend.domain.bluesky.bluesky.bluesky_unlike_BANG_(runtime,uri));

return knoxx.backend.domain.text.tool_text_result((""+"Removed like from "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri)),cljs.core.PersistentArrayMap.EMPTY);
});
knoxx.backend.domain.bluesky.bluesky.follow_execute = (async function knoxx$backend$domain$bluesky$bluesky$follow_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var actor = (await (async function (){var or__5162__auto__ = (params["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(actor)){
throw (new Error("actor is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Following "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)+" on Bluesky\u2026"));

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_follow_BANG_(runtime,actor));
return knoxx.backend.domain.text.tool_text_result((""+"Followed "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uri","uri",-774711847).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),result);
});
knoxx.backend.domain.bluesky.bluesky.unfollow_execute = (async function knoxx$backend$domain$bluesky$bluesky$unfollow_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var uri = (await (async function (){var or__5162__auto__ = (params["uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(uri)){
throw (new Error("uri is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Unfollowing on Bluesky\u2026");

(await knoxx.backend.domain.bluesky.bluesky.bluesky_unfollow_BANG_(runtime,uri));

return knoxx.backend.domain.text.tool_text_result((""+"Unfollowed "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri)),cljs.core.PersistentArrayMap.EMPTY);
});
knoxx.backend.domain.bluesky.bluesky.delete_execute = (async function knoxx$backend$domain$bluesky$bluesky$delete_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var uri = (await (async function (){var or__5162__auto__ = (params["uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(uri)){
throw (new Error("uri is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Deleting Bluesky post\u2026");

(await knoxx.backend.domain.bluesky.bluesky.bluesky_delete_post_BANG_(runtime,uri));

return knoxx.backend.domain.text.tool_text_result((""+"Deleted Bluesky post "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uri)),cljs.core.PersistentArrayMap.EMPTY);
});
knoxx.backend.domain.bluesky.bluesky.thread_execute = (async function knoxx$backend$domain$bluesky$bluesky$thread_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var uri = (await (async function (){var or__5162__auto__ = (params["uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var depth = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((10),(await (async function (){var or__5162__auto__ = (params["depth"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (6);
}
})())));
if(clojure.string.blank_QMARK_(uri)){
throw (new Error("uri is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Reading Bluesky thread\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_thread_BANG_(uri,depth));
return knoxx.backend.domain.text.tool_text_result((""+"Bluesky thread\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(result)))),result);
});
knoxx.backend.domain.bluesky.bluesky.notifications_execute = (async function knoxx$backend$domain$bluesky$bluesky$notifications_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((50),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (20);
}
})())));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Reading Bluesky notifications\u2026");

var payload = (await knoxx.backend.domain.bluesky.bluesky.bluesky_notifications_BANG_(runtime,limit));
var notifications = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"notifications","notifications",1685638001).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var lines = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (n){
var author = new cljs.core.Keyword(null,"author","author",2111686192).cljs$core$IFn$_invoke$arity$1(n);
var reason = new cljs.core.Keyword(null,"reason","reason",-2070751759).cljs$core$IFn$_invoke$arity$1(n);
var post = new cljs.core.Keyword(null,"post","post",269697687).cljs$core$IFn$_invoke$arity$1(n);
var text = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(post,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"record","record",-779106859),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return (""+"- ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(reason)+"] "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+" (@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(author);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(text,(120))));
}),notifications);
return knoxx.backend.domain.text.tool_text_result((""+"Bluesky notifications ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(notifications))+")\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",lines))),payload);
});
knoxx.backend.domain.bluesky.bluesky.followers_execute = (async function knoxx$backend$domain$bluesky$bluesky$followers_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var actor = (await (async function (){var or__5162__auto__ = (params["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((50),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})())));
if(clojure.string.blank_QMARK_(actor)){
throw (new Error("actor is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reading followers of "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)+"\u2026"));

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_followers_BANG_(actor,limit));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.bluesky.bluesky.format_posts((""+"Followers of "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)),result);
});
knoxx.backend.domain.bluesky.bluesky.follows_execute = (async function knoxx$backend$domain$bluesky$bluesky$follows_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var actor = (await (async function (){var or__5162__auto__ = (params["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((50),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})())));
if(clojure.string.blank_QMARK_(actor)){
throw (new Error("actor is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reading who "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)+" follows\u2026"));

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_follows_BANG_(actor,limit));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.bluesky.bluesky.format_posts((""+"Follows of "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor)),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)),result);
});
knoxx.backend.domain.bluesky.bluesky.chat_list_execute = (async function knoxx$backend$domain$bluesky$bluesky$chat_list_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((50),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (20);
}
})())));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Listing Bluesky conversations\u2026");

var payload = (await knoxx.backend.domain.bluesky.bluesky.bluesky_chat_list_BANG_(runtime,limit));
var convos = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"convos","convos",-1550229162).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var lines = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (convo){
var members = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"members","members",159001018).cljs$core$IFn$_invoke$arity$1(convo);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var names = clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28431_SHARP_){
var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(p1__28431_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(p1__28431_SHARP_);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
}),members));
var last_msg = new cljs.core.Keyword(null,"lastMessage","lastMessage",-570151790).cljs$core$IFn$_invoke$arity$1(convo);
return (""+"- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(convo))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(names)+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(last_msg)?(""+" \u2014 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(last_msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(80)))):null)));
}),convos);
return knoxx.backend.domain.text.tool_text_result((""+"Bluesky conversations ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(convos))+")\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",lines))),payload);
});
knoxx.backend.domain.bluesky.bluesky.chat_send_execute = (async function knoxx$backend$domain$bluesky$bluesky$chat_send_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var convo_id = (await (async function (){var or__5162__auto__ = (params["convoId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var text = (await (async function (){var or__5162__auto__ = (params["text"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var reply_to = (await (async function (){var or__5162__auto__ = (params["replyToMessageId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(convo_id)){
throw (new Error("convoId is required"));
} else {
}

if(clojure.string.blank_QMARK_(text)){
throw (new Error("text is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Sending Bluesky DM\u2026");

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_chat_send_BANG_(runtime,convo_id,text,reply_to));
return knoxx.backend.domain.text.tool_text_result((""+"Sent DM in conversation "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(convo_id)),result);
});
knoxx.backend.domain.bluesky.bluesky.chat_read_execute = (async function knoxx$backend$domain$bluesky$bluesky$chat_read_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var convo_id = (await (async function (){var or__5162__auto__ = (params["convoId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),(await (async function (){var or__5162__auto__ = (params["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})())));
if(clojure.string.blank_QMARK_(convo_id)){
throw (new Error("convoId is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reading Bluesky DMs in "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(convo_id)+"\u2026"));

var payload = (await knoxx.backend.domain.bluesky.bluesky.bluesky_chat_messages_BANG_(runtime,convo_id,limit));
var messages = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var lines = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (msg){
var sender = new cljs.core.Keyword(null,"sender","sender",1557303285).cljs$core$IFn$_invoke$arity$1(msg);
var text = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var msg_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return (""+"- ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_id)+"] "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(sender);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+" (@"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(sender);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(text,(200))));
}),messages);
return knoxx.backend.domain.text.tool_text_result((""+"Bluesky DMs ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(messages))+")\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",lines))),payload);
});
knoxx.backend.domain.bluesky.bluesky.chat_react_execute = (async function knoxx$backend$domain$bluesky$bluesky$chat_react_execute(runtime,_config,_tool_call_id,params,a,b,c){
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
var convo_id = (await (async function (){var or__5162__auto__ = (params["convoId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var message_id = (await (async function (){var or__5162__auto__ = (params["messageId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var emoji = (await (async function (){var or__5162__auto__ = (params["emoji"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(convo_id)){
throw (new Error("convoId is required"));
} else {
}

if(clojure.string.blank_QMARK_(message_id)){
throw (new Error("messageId is required"));
} else {
}

if(clojure.string.blank_QMARK_(emoji)){
throw (new Error("emoji is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reacting to message "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id)+"\u2026"));

var result = (await knoxx.backend.domain.bluesky.bluesky.bluesky_chat_react_BANG_(runtime,convo_id,message_id,emoji));
return knoxx.backend.domain.text.tool_text_result((""+"Reacted "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(emoji)+" to message "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message_id)),result);
});
knoxx.backend.domain.bluesky.bluesky.publish_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.publish","Bluesky Publish","Publish a post to Bluesky using the configured account.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Post a concise update to Bluesky when public social publishing is useful.",new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use for original posts, replies (replyTo), and image posts (images param).","Always include relevant hashtags in the text body; they will be auto-faceted.","URLs in the text body are auto-faceted as clickable links.","For image posts, provide workspace paths, URLs, or data URLs in the images vector.","When replying, pass the parent post AT-URI as replyTo."], null),knoxx.backend.domain.bluesky.bluesky.publish_params,knoxx.backend.domain.bluesky.bluesky.publish_execute], 0));
knoxx.backend.domain.bluesky.bluesky.profile_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.profile","Bluesky Profile","Read a Bluesky profile by handle or DID, or default to the authenticated account.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read a Bluesky profile by handle or DID, or default to the authenticated account.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to inspect a user's bio, follower count, and posts before engaging.","Leave actor empty to read the authenticated account's own profile.","Accepts handles like @alice.bsky.social or raw DIDs."], null),knoxx.backend.domain.bluesky.bluesky.profile_params,knoxx.backend.domain.bluesky.bluesky.profile_execute], 0));
knoxx.backend.domain.bluesky.bluesky.search_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.search","Bluesky Search","Search public Bluesky posts or actors.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Search public Bluesky posts or actors.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to discover trending topics, find inspiration, or locate specific posts.","Default kind is posts; set kind to actors to search for users.","Hashtag searches work best with the # prefix: #generative, #music, etc."], null),knoxx.backend.domain.bluesky.bluesky.search_params,knoxx.backend.domain.bluesky.bluesky.search_execute], 0));
knoxx.backend.domain.bluesky.bluesky.author_feed_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.author.feed","Bluesky Author Feed","Read recent posts from a specific Bluesky author.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read recent posts from a specific Bluesky author.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to browse a specific creator's recent posts before interacting.","Pass the actor's handle or DID.","Great for finding content to reply to, repost, or draw inspiration from."], null),knoxx.backend.domain.bluesky.bluesky.feed_params,knoxx.backend.domain.bluesky.bluesky.author_feed_execute], 0));
knoxx.backend.domain.bluesky.bluesky.timeline_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.timeline","Bluesky Timeline","Read the authenticated account's Bluesky timeline.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read the authenticated account's Bluesky timeline.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use CONSTANTLY to stay aware of the current vibe and trending content.","This is your primary source of context before posting or engaging.","Pass cursor from a previous call to paginate further back."], null),knoxx.backend.domain.bluesky.bluesky.timeline_params,knoxx.backend.domain.bluesky.bluesky.timeline_execute], 0));
knoxx.backend.domain.bluesky.bluesky.repost_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.repost","Bluesky Repost","Repost (quote-retweet) a Bluesky post by AT-URI.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Repost a Bluesky post to share it with followers.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use when you want to amplify content you find valuable or entertaining.","Pass the full AT-URI of the post to repost.","Reposting builds social capital and signals taste to your followers."], null),knoxx.backend.domain.bluesky.bluesky.post_uri_params,knoxx.backend.domain.bluesky.bluesky.repost_execute], 0));
knoxx.backend.domain.bluesky.bluesky.like_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.like","Bluesky Like","Like a Bluesky post by AT-URI.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Like a Bluesky post to show appreciation.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use generously to signal engagement and build goodwill.","Pass the full AT-URI of the post to like.","Liking is low-cost social capital; do it often for posts that resonate."], null),knoxx.backend.domain.bluesky.bluesky.post_uri_params,knoxx.backend.domain.bluesky.bluesky.like_execute], 0));
knoxx.backend.domain.bluesky.bluesky.unlike_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.unlike","Bluesky Unlike","Remove a like from a Bluesky post by like record AT-URI.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Remove a like from a Bluesky post.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to remove a previous like.","Pass the AT-URI of the like record itself (not the post URI)."], null),knoxx.backend.domain.bluesky.bluesky.post_uri_params,knoxx.backend.domain.bluesky.bluesky.unlike_execute], 0));
knoxx.backend.domain.bluesky.bluesky.follow_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.follow","Bluesky Follow","Follow a Bluesky actor by handle or DID.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Follow a Bluesky user.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to follow creators whose content you want to see in your timeline.","Pass the handle or DID of the actor.","Aggressively curate your following list; unfollow if content quality drops."], null),knoxx.backend.domain.bluesky.bluesky.actor_params,knoxx.backend.domain.bluesky.bluesky.follow_execute], 0));
knoxx.backend.domain.bluesky.bluesky.unfollow_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.unfollow","Bluesky Unfollow","Unfollow a Bluesky actor by follow record AT-URI.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Unfollow a Bluesky user.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to unfollow an actor.","Pass the AT-URI of the follow record (not the actor handle)."], null),knoxx.backend.domain.bluesky.bluesky.post_uri_params,knoxx.backend.domain.bluesky.bluesky.unfollow_execute], 0));
knoxx.backend.domain.bluesky.bluesky.delete_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.delete","Bluesky Delete","Delete one of your own Bluesky posts by AT-URI.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Delete a Bluesky post you authored.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to remove posts that flopped, aged poorly, or were mistakes.","Pass the AT-URI of your own post.","Curate your feed like a gallery; delete without remorse."], null),knoxx.backend.domain.bluesky.bluesky.post_uri_params,knoxx.backend.domain.bluesky.bluesky.delete_execute], 0));
knoxx.backend.domain.bluesky.bluesky.thread_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.thread","Bluesky Thread","Read a Bluesky post thread including replies.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read a post and its reply thread.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to read full conversation threads before jumping in.","Pass the AT-URI of the root post.","Adjust depth for deeper reply trees; default is 6."], null),knoxx.backend.domain.bluesky.bluesky.thread_params,knoxx.backend.domain.bluesky.bluesky.thread_execute], 0));
knoxx.backend.domain.bluesky.bluesky.notifications_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.notifications","Bluesky Notifications","Read notifications for the authenticated Bluesky account.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Check notifications on Bluesky.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use frequently to stay on top of replies, mentions, likes, and follows.","Engagement compounds; respond to replies and mentions promptly.","Notifications reveal who is interacting with you and why."], null),knoxx.backend.domain.bluesky.bluesky.notifications_params,knoxx.backend.domain.bluesky.bluesky.notifications_execute], 0));
knoxx.backend.domain.bluesky.bluesky.followers_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.followers","Bluesky Followers","List followers of a Bluesky actor.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read the followers list of a Bluesky user.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to inspect who follows a given actor.","Pass the actor's handle or DID.","Useful for understanding audience overlap and community composition."], null),knoxx.backend.domain.bluesky.bluesky.feed_params,knoxx.backend.domain.bluesky.bluesky.followers_execute], 0));
knoxx.backend.domain.bluesky.bluesky.follows_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.follows","Bluesky Follows","List accounts a Bluesky actor follows.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read the following list of a Bluesky user.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to discover who a creator follows for taste graph exploration.","Pass the actor's handle or DID.","Great for finding new creators to follow via transitive taste."], null),knoxx.backend.domain.bluesky.bluesky.feed_params,knoxx.backend.domain.bluesky.bluesky.follows_execute], 0));
knoxx.backend.domain.bluesky.bluesky.chat_list_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.chat.list","Bluesky Chat List","List Bluesky DM conversations.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List direct message conversations.",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to see active DM conversations and their last messages.","Start here before reading or sending DMs to get the conversation IDs."], null),knoxx.backend.domain.bluesky.bluesky.chat_list_params,knoxx.backend.domain.bluesky.bluesky.chat_list_execute], 0));
knoxx.backend.domain.bluesky.bluesky.chat_send_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.chat.send","Bluesky Chat Send","Send a direct message in a Bluesky conversation.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Send a DM in a Bluesky chat.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to reply in DM threads.","Pass the convoId from chat.list and the message text.","Use replyToMessageId to thread replies within a conversation."], null),knoxx.backend.domain.bluesky.bluesky.chat_send_params,knoxx.backend.domain.bluesky.bluesky.chat_send_execute], 0));
knoxx.backend.domain.bluesky.bluesky.chat_read_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.chat.read","Bluesky Chat Read","Read messages from a Bluesky DM conversation.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read DMs in a Bluesky conversation.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to read the message history of a specific DM conversation.","Pass the convoId from chat.list.","Check DMs regularly; they may contain collaboration invites or feedback."], null),knoxx.backend.domain.bluesky.bluesky.chat_read_params,knoxx.backend.domain.bluesky.bluesky.chat_read_execute], 0));
knoxx.backend.domain.bluesky.bluesky.chat_react_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"bluesky.chat.react","Bluesky Chat React","Add an emoji reaction to a message in a Bluesky DM.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["React to a Bluesky DM message.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use to react to DM messages with emoji.","Pass convoId, messageId (from chat.read), and an emoji like \u2764\uFE0F or \uD83D\uDD25.","Reactions are lightweight engagement for DMs."], null),knoxx.backend.domain.bluesky.bluesky.chat_react_params,knoxx.backend.domain.bluesky.bluesky.chat_react_execute], 0));
knoxx.backend.domain.bluesky.bluesky.bluesky_tool_factories = new cljs.core.PersistentVector(null, 19, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.publish",knoxx.backend.domain.bluesky.bluesky.publish_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.profile",knoxx.backend.domain.bluesky.bluesky.profile_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.search",knoxx.backend.domain.bluesky.bluesky.search_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.author.feed",knoxx.backend.domain.bluesky.bluesky.author_feed_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.timeline",knoxx.backend.domain.bluesky.bluesky.timeline_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.repost",knoxx.backend.domain.bluesky.bluesky.repost_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.like",knoxx.backend.domain.bluesky.bluesky.like_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.unlike",knoxx.backend.domain.bluesky.bluesky.unlike_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.follow",knoxx.backend.domain.bluesky.bluesky.follow_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.unfollow",knoxx.backend.domain.bluesky.bluesky.unfollow_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.delete",knoxx.backend.domain.bluesky.bluesky.delete_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.thread",knoxx.backend.domain.bluesky.bluesky.thread_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.notifications",knoxx.backend.domain.bluesky.bluesky.notifications_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.followers",knoxx.backend.domain.bluesky.bluesky.followers_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.follows",knoxx.backend.domain.bluesky.bluesky.follows_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.chat.list",knoxx.backend.domain.bluesky.bluesky.chat_list_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.chat.read",knoxx.backend.domain.bluesky.bluesky.chat_read_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.chat.send",knoxx.backend.domain.bluesky.bluesky.chat_send_tool], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["bluesky.chat.react",knoxx.backend.domain.bluesky.bluesky.chat_react_tool], null)], null);
knoxx.backend.domain.bluesky.bluesky.auth_context_allows_tool_QMARK_ = (function knoxx$backend$domain$bluesky$bluesky$auth_context_allows_tool_QMARK_(auth_context,tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
knoxx.backend.domain.bluesky.bluesky.create_allowed_bluesky_tool = (function knoxx$backend$domain$bluesky$bluesky$create_allowed_bluesky_tool(runtime,config,allowed_QMARK_,p__28556){
var vec__28557 = p__28556;
var tool_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28557,(0),null);
var tool_factory = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28557,(1),null);
if(cljs.core.truth_((allowed_QMARK_.cljs$core$IFn$_invoke$arity$1 ? allowed_QMARK_.cljs$core$IFn$_invoke$arity$1(tool_id) : allowed_QMARK_.call(null,tool_id)))){
return (tool_factory.cljs$core$IFn$_invoke$arity$2 ? tool_factory.cljs$core$IFn$_invoke$arity$2(runtime,config) : tool_factory.call(null,runtime,config));
} else {
return null;
}
});
knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools = (function knoxx$backend$domain$bluesky$bluesky$create_bluesky_custom_tools(var_args){
var G__28571 = arguments.length;
switch (G__28571) {
case 2:
return knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.bluesky.bluesky.auth_context_allows_tool_QMARK_,auth_context);
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.bluesky.bluesky.create_allowed_bluesky_tool,runtime,config,allowed_QMARK_),knoxx.backend.domain.bluesky.bluesky.bluesky_tool_factories)));
}));

(knoxx.backend.domain.bluesky.bluesky.create_bluesky_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.bluesky.bluesky.js.map
