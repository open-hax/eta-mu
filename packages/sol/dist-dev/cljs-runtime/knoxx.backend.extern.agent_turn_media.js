import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.extern.agent_turn_media');
knoxx.backend.extern.agent_turn_media.nonblank = (function knoxx$backend$extern$agent_turn_media$nonblank(value){
var G__27958 = value;
var G__27958__$1 = (((G__27958 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27958)));
var G__27958__$2 = (((G__27958__$1 == null))?null:clojure.string.trim(G__27958__$1));
if((G__27958__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27958__$2);
}
});
knoxx.backend.extern.agent_turn_media.resolve_media_url = (function knoxx$backend$extern$agent_turn_media$resolve_media_url(value){
if((!(typeof value === 'string'))){
return value;
} else {
if(clojure.string.starts_with_QMARK_(value,"/")){
return (""+"http://127.0.0.1:8000"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
} else {
return value;

}
}
});
knoxx.backend.extern.agent_turn_media.data_url_QMARK_ = (function knoxx$backend$extern$agent_turn_media$data_url_QMARK_(value){
return ((typeof value === 'string') && (clojure.string.starts_with_QMARK_(value,"data:")));
});
knoxx.backend.extern.agent_turn_media.looks_like_url_QMARK_ = (function knoxx$backend$extern$agent_turn_media$looks_like_url_QMARK_(value){
return ((typeof value === 'string') && (((clojure.string.starts_with_QMARK_(value,"http://")) || (clojure.string.starts_with_QMARK_(value,"https://")))));
});
knoxx.backend.extern.agent_turn_media.media_url_QMARK_ = (function knoxx$backend$extern$agent_turn_media$media_url_QMARK_(value){
return ((typeof value === 'string') && (((knoxx.backend.extern.agent_turn_media.looks_like_url_QMARK_(value)) || (clojure.string.starts_with_QMARK_(value,"/")))));
});
knoxx.backend.extern.agent_turn_media.strip_data_url = (function knoxx$backend$extern$agent_turn_media$strip_data_url(raw_data){
var temp__5825__auto__ = knoxx.backend.extern.agent_turn_media.nonblank(raw_data);
if(cljs.core.truth_(temp__5825__auto__)){
var data = temp__5825__auto__;
var comma = data.indexOf(",");
if(((knoxx.backend.extern.agent_turn_media.data_url_QMARK_(data)) && ((comma >= (0))))){
return data.slice((comma + (1)));
} else {
return data;
}
} else {
return null;
}
});
knoxx.backend.extern.agent_turn_media.studio_stream_path = (function knoxx$backend$extern$agent_turn_media$studio_stream_path(value){
try{var url = (new URL(knoxx.backend.extern.agent_turn_media.resolve_media_url(value)));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(url.pathname,"/api/studio/stream")){
return knoxx.backend.extern.agent_turn_media.nonblank(url.searchParams.get("path"));
} else {
return null;
}
}catch (e27970){var _ = e27970;
return null;
}});
knoxx.backend.extern.agent_turn_media.local_knoxx_url_QMARK_ = (function knoxx$backend$extern$agent_turn_media$local_knoxx_url_QMARK_(url){
return ((typeof url === 'string') && (((clojure.string.starts_with_QMARK_(url,"http://127.0.0.1:8000/")) || (((clojure.string.starts_with_QMARK_(url,"http://localhost:8000/")) || (clojure.string.starts_with_QMARK_(url,"http://0.0.0.0:8000/")))))));
});
knoxx.backend.extern.agent_turn_media.auth_header_map = (function knoxx$backend$extern$agent_turn_media$auth_header_map(auth_context,url){
var resolved_url = knoxx.backend.extern.agent_turn_media.resolve_media_url(url);
var auth_email = (function (){var or__5162__auto__ = knoxx.backend.extern.agent_turn_media.nonblank(new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618).cljs$core$IFn$_invoke$arity$1(auth_context));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.extern.agent_turn_media.nonblank(new cljs.core.Keyword(null,"user-email","user-email",2126479881).cljs$core$IFn$_invoke$arity$1(auth_context));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.extern.agent_turn_media.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(auth_context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"email","email",1415816706)], null)));
}
}
})();
var auth_org_slug = (function (){var or__5162__auto__ = knoxx.backend.extern.agent_turn_media.nonblank(new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998).cljs$core$IFn$_invoke$arity$1(auth_context));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.extern.agent_turn_media.nonblank(new cljs.core.Keyword(null,"org-slug","org-slug",-726595051).cljs$core$IFn$_invoke$arity$1(auth_context));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.extern.agent_turn_media.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(auth_context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"slug","slug",2029314850)], null)));
}
}
})();
var auth_membership_id = (function (){var or__5162__auto__ = knoxx.backend.extern.agent_turn_media.nonblank(new cljs.core.Keyword(null,"membershipId","membershipId",2026001076).cljs$core$IFn$_invoke$arity$1(auth_context));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.extern.agent_turn_media.nonblank(new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(auth_context));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.extern.agent_turn_media.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(auth_context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null)));
}
}
})();
var G__27985 = cljs.core.PersistentArrayMap.EMPTY;
var G__27985__$1 = (cljs.core.truth_((function (){var and__5160__auto__ = knoxx.backend.extern.agent_turn_media.local_knoxx_url_QMARK_(resolved_url);
if(and__5160__auto__){
return auth_email;
} else {
return and__5160__auto__;
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27985,new cljs.core.Keyword(null,"x-knoxx-user-email","x-knoxx-user-email",1675999077),auth_email):G__27985);
var G__27985__$2 = (cljs.core.truth_((function (){var and__5160__auto__ = knoxx.backend.extern.agent_turn_media.local_knoxx_url_QMARK_(resolved_url);
if(and__5160__auto__){
return auth_org_slug;
} else {
return and__5160__auto__;
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27985__$1,new cljs.core.Keyword(null,"x-knoxx-org-slug","x-knoxx-org-slug",-388176131),auth_org_slug):G__27985__$1);
if(cljs.core.truth_((function (){var and__5160__auto__ = knoxx.backend.extern.agent_turn_media.local_knoxx_url_QMARK_(resolved_url);
if(and__5160__auto__){
return auth_membership_id;
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27985__$2,new cljs.core.Keyword(null,"x-knoxx-membership-id","x-knoxx-membership-id",1022663929),auth_membership_id);
} else {
return G__27985__$2;
}
});
knoxx.backend.extern.agent_turn_media.auth_headers = (function knoxx$backend$extern$agent_turn_media$auth_headers(auth_context,url){
return cljs.core.clj__GT_js(knoxx.backend.extern.agent_turn_media.auth_header_map(auth_context,url));
});
knoxx.backend.extern.agent_turn_media.ensure_max_bytes_BANG_ = (function knoxx$backend$extern$agent_turn_media$ensure_max_bytes_BANG_(size,max_bytes,message){
if(((typeof size === 'number') && (((typeof max_bytes === 'number') && ((size > max_bytes)))))){
throw (new Error(message));
} else {
return null;
}
});
knoxx.backend.extern.agent_turn_media.fetch_data_url_with_fetch_BANG_ = (async function knoxx$backend$extern$agent_turn_media$fetch_data_url_with_fetch_BANG_(fetch_fn,url,fallback_mime,label,max_bytes,auth_context){
var resolved_url = knoxx.backend.extern.agent_turn_media.resolve_media_url(url);
var label__$1 = (await (async function (){var or__5162__auto__ = label;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "media";
}
})());
var resp = (await (await (async function (){var G__28007 = resolved_url;
var G__28008 = ({"method": "GET", "headers": knoxx.backend.extern.agent_turn_media.auth_headers(auth_context,resolved_url)});
return (fetch_fn.cljs$core$IFn$_invoke$arity$2 ? fetch_fn.cljs$core$IFn$_invoke$arity$2(G__28007,G__28008) : fetch_fn.call(null,G__28007,G__28008));
})()));
if(cljs.core.truth_(resp.ok)){
} else {
throw (new Error((""+"Failed to fetch "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label__$1)+": HTTP "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(resp.status))));
}

var len_header = (await (async function (){var G__28013 = resp;
var G__28013__$1 = (((G__28013 == null))?null:G__28013.headers);
if((G__28013__$1 == null)){
return null;
} else {
return G__28013__$1.get("content-length");
}
})());
var len = (cljs.core.truth_(len_header)?parseInt(len_header,(10)):null);
if(((typeof len === 'number') && (((cljs.core.not(isNaN(len))) && ((((len > (0))) && ((len > max_bytes)))))))){
throw (new Error((""+"Remote "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label__$1)+" exceeds max bytes: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(len))));
} else {
}

var array_buffer = (await resp.arrayBuffer());
var buffer = Buffer.from(array_buffer);
var size = buffer.length;
var _ = knoxx.backend.extern.agent_turn_media.ensure_max_bytes_BANG_(size,max_bytes,(""+"Remote "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label__$1)+" exceeds max bytes: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(size)));
var mime_type = (await (async function (){var or__5162__auto__ = (await (async function (){var G__28029 = resp;
var G__28029__$1 = (((G__28029 == null))?null:G__28029.headers);
if((G__28029__$1 == null)){
return null;
} else {
return G__28029__$1.get("content-type");
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback_mime;
}
})());
var payload = buffer.toString("base64");
return (""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime_type)+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(payload));
});
knoxx.backend.extern.agent_turn_media.fetch_data_url_BANG_ = (function knoxx$backend$extern$agent_turn_media$fetch_data_url_BANG_(url,fallback_mime,label,max_bytes,auth_context){
return knoxx.backend.extern.agent_turn_media.fetch_data_url_with_fetch_BANG_(fetch,url,fallback_mime,label,max_bytes,auth_context);
});

//# sourceMappingURL=knoxx.backend.extern.agent_turn_media.js.map
