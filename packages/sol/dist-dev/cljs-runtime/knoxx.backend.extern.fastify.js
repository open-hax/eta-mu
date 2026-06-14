import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.extern.fastify');
knoxx.backend.extern.fastify.no_content_QMARK_ = (function knoxx$backend$extern$fastify$no_content_QMARK_(x){
return (((x == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(undefined,x)));
});
knoxx.backend.extern.fastify.reply_already_sent_QMARK_ = (function knoxx$backend$extern$fastify$reply_already_sent_QMARK_(reply){
var raw = (reply["raw"]);
return cljs.core.boolean$((function (){var or__5162__auto__ = (reply["sent"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var and__5160__auto__ = raw;
if(cljs.core.truth_(and__5160__auto__)){
return (raw["writableEnded"]);
} else {
return and__5160__auto__;
}
}
})());
});
knoxx.backend.extern.fastify.send_json_BANG_ = (function knoxx$backend$extern$fastify$send_json_BANG_(reply,status,body){
if(knoxx.backend.extern.fastify.reply_already_sent_QMARK_(reply)){
return reply;
} else {
return reply.code(status).type("application/json").send(cljs.core.clj__GT_js(body));
}
});
knoxx.backend.extern.fastify.request_body = (function knoxx$backend$extern$fastify$request_body(request){
var body = (request["body"]);
if(knoxx.backend.extern.fastify.no_content_QMARK_(body)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
if(cljs.core.map_QMARK_(body)){
return body;
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
});
knoxx.backend.extern.fastify.request_body_raw = (function knoxx$backend$extern$fastify$request_body_raw(request){
return (request["body"]);
});
knoxx.backend.extern.fastify.request_headers = (function knoxx$backend$extern$fastify$request_headers(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["headers"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.extern.fastify.request_header = (function knoxx$backend$extern$fastify$request_header(request,k){
return (request["headers"][cljs.core.name(k)]);
});
knoxx.backend.extern.fastify.request_query = (function knoxx$backend$extern$fastify$request_query(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.extern.fastify.request_query_string_map = (function knoxx$backend$extern$fastify$request_query_string_map(request){
var query = (function (){var or__5162__auto__ = (request["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})();
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,key){
var value = (query[key]);
if(knoxx.backend.extern.fastify.no_content_QMARK_(value)){
return acc;
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(value))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,key,cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value)));
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,key,value);

}
}
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(Object.keys(query)));
});
knoxx.backend.extern.fastify.request_params = (function knoxx$backend$extern$fastify$request_params(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["params"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.extern.fastify.request_param = (function knoxx$backend$extern$fastify$request_param(request,k){
return (request["params"][cljs.core.name(k)]);
});
knoxx.backend.extern.fastify.request_method = (function knoxx$backend$extern$fastify$request_method(request){
var or__5162__auto__ = (request["method"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "GET";
}
});
knoxx.backend.extern.fastify.request_hostname = (function knoxx$backend$extern$fastify$request_hostname(request){
var or__5162__auto__ = (request["hostname"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "localhost";
}
});
knoxx.backend.extern.fastify.reply_header_BANG_ = (function knoxx$backend$extern$fastify$reply_header_BANG_(reply,name,value){
return reply.header(name,value);
});
knoxx.backend.extern.fastify.route_options = (function knoxx$backend$extern$fastify$route_options(opts){
return cljs.core.clj__GT_js(opts);
});
knoxx.backend.extern.fastify.route_BANG_ = (function knoxx$backend$extern$fastify$route_BANG_(app,opts){
return app.route(knoxx.backend.extern.fastify.route_options(opts));
});
knoxx.backend.extern.fastify.copy_response_headers_BANG_ = (function knoxx$backend$extern$fastify$copy_response_headers_BANG_(reply,headers){
return headers.forEach((function (value,key){
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["content-encoding",null,"content-length",null,"connection",null,"transfer-encoding",null], null), null),clojure.string.lower_case(key))){
return null;
} else {
return knoxx.backend.extern.fastify.reply_header_BANG_(reply,key,value);
}
}));
});
knoxx.backend.extern.fastify.send_buffer_response_BANG_ = (function knoxx$backend$extern$fastify$send_buffer_response_BANG_(reply,resp,buffer){
return reply.code(resp.status).send(Buffer.from(buffer));
});
knoxx.backend.extern.fastify.query_string = (function knoxx$backend$extern$fastify$query_string(request){
var params = (new URLSearchParams());
var query = (function (){var or__5162__auto__ = (request["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})();
var seq__31643_31750 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(Object.keys(query)));
var chunk__31644_31751 = null;
var count__31645_31752 = (0);
var i__31646_31753 = (0);
while(true){
if((i__31646_31753 < count__31645_31752)){
var key_31754 = chunk__31644_31751.cljs$core$IIndexed$_nth$arity$2(null,i__31646_31753);
var value_31755 = (query[key_31754]);
if(knoxx.backend.extern.fastify.no_content_QMARK_(value_31755)){
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(value_31755))){
var seq__31678_31756 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value_31755));
var chunk__31679_31757 = null;
var count__31680_31758 = (0);
var i__31681_31759 = (0);
while(true){
if((i__31681_31759 < count__31680_31758)){
var item_31760 = chunk__31679_31757.cljs$core$IIndexed$_nth$arity$2(null,i__31681_31759);
params.append(key_31754,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31760)));


var G__31761 = seq__31678_31756;
var G__31762 = chunk__31679_31757;
var G__31763 = count__31680_31758;
var G__31764 = (i__31681_31759 + (1));
seq__31678_31756 = G__31761;
chunk__31679_31757 = G__31762;
count__31680_31758 = G__31763;
i__31681_31759 = G__31764;
continue;
} else {
var temp__5825__auto___31765 = cljs.core.seq(seq__31678_31756);
if(temp__5825__auto___31765){
var seq__31678_31766__$1 = temp__5825__auto___31765;
if(cljs.core.chunked_seq_QMARK_(seq__31678_31766__$1)){
var c__5694__auto___31767 = cljs.core.chunk_first(seq__31678_31766__$1);
var G__31768 = cljs.core.chunk_rest(seq__31678_31766__$1);
var G__31769 = c__5694__auto___31767;
var G__31770 = cljs.core.count(c__5694__auto___31767);
var G__31771 = (0);
seq__31678_31756 = G__31768;
chunk__31679_31757 = G__31769;
count__31680_31758 = G__31770;
i__31681_31759 = G__31771;
continue;
} else {
var item_31772 = cljs.core.first(seq__31678_31766__$1);
params.append(key_31754,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31772)));


var G__31773 = cljs.core.next(seq__31678_31766__$1);
var G__31774 = null;
var G__31775 = (0);
var G__31776 = (0);
seq__31678_31756 = G__31773;
chunk__31679_31757 = G__31774;
count__31680_31758 = G__31775;
i__31681_31759 = G__31776;
continue;
}
} else {
}
}
break;
}
} else {
params.append(key_31754,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31755)));

}
}


var G__31777 = seq__31643_31750;
var G__31778 = chunk__31644_31751;
var G__31779 = count__31645_31752;
var G__31780 = (i__31646_31753 + (1));
seq__31643_31750 = G__31777;
chunk__31644_31751 = G__31778;
count__31645_31752 = G__31779;
i__31646_31753 = G__31780;
continue;
} else {
var temp__5825__auto___31781 = cljs.core.seq(seq__31643_31750);
if(temp__5825__auto___31781){
var seq__31643_31782__$1 = temp__5825__auto___31781;
if(cljs.core.chunked_seq_QMARK_(seq__31643_31782__$1)){
var c__5694__auto___31783 = cljs.core.chunk_first(seq__31643_31782__$1);
var G__31784 = cljs.core.chunk_rest(seq__31643_31782__$1);
var G__31785 = c__5694__auto___31783;
var G__31786 = cljs.core.count(c__5694__auto___31783);
var G__31787 = (0);
seq__31643_31750 = G__31784;
chunk__31644_31751 = G__31785;
count__31645_31752 = G__31786;
i__31646_31753 = G__31787;
continue;
} else {
var key_31788 = cljs.core.first(seq__31643_31782__$1);
var value_31789 = (query[key_31788]);
if(knoxx.backend.extern.fastify.no_content_QMARK_(value_31789)){
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(value_31789))){
var seq__31682_31790 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value_31789));
var chunk__31683_31791 = null;
var count__31684_31792 = (0);
var i__31685_31793 = (0);
while(true){
if((i__31685_31793 < count__31684_31792)){
var item_31794 = chunk__31683_31791.cljs$core$IIndexed$_nth$arity$2(null,i__31685_31793);
params.append(key_31788,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31794)));


var G__31795 = seq__31682_31790;
var G__31796 = chunk__31683_31791;
var G__31797 = count__31684_31792;
var G__31798 = (i__31685_31793 + (1));
seq__31682_31790 = G__31795;
chunk__31683_31791 = G__31796;
count__31684_31792 = G__31797;
i__31685_31793 = G__31798;
continue;
} else {
var temp__5825__auto___31800__$1 = cljs.core.seq(seq__31682_31790);
if(temp__5825__auto___31800__$1){
var seq__31682_31801__$1 = temp__5825__auto___31800__$1;
if(cljs.core.chunked_seq_QMARK_(seq__31682_31801__$1)){
var c__5694__auto___31802 = cljs.core.chunk_first(seq__31682_31801__$1);
var G__31803 = cljs.core.chunk_rest(seq__31682_31801__$1);
var G__31804 = c__5694__auto___31802;
var G__31805 = cljs.core.count(c__5694__auto___31802);
var G__31806 = (0);
seq__31682_31790 = G__31803;
chunk__31683_31791 = G__31804;
count__31684_31792 = G__31805;
i__31685_31793 = G__31806;
continue;
} else {
var item_31807 = cljs.core.first(seq__31682_31801__$1);
params.append(key_31788,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31807)));


var G__31808 = cljs.core.next(seq__31682_31801__$1);
var G__31809 = null;
var G__31810 = (0);
var G__31811 = (0);
seq__31682_31790 = G__31808;
chunk__31683_31791 = G__31809;
count__31684_31792 = G__31810;
i__31685_31793 = G__31811;
continue;
}
} else {
}
}
break;
}
} else {
params.append(key_31788,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31789)));

}
}


var G__31812 = cljs.core.next(seq__31643_31782__$1);
var G__31813 = null;
var G__31814 = (0);
var G__31815 = (0);
seq__31643_31750 = G__31812;
chunk__31644_31751 = G__31813;
count__31645_31752 = G__31814;
i__31646_31753 = G__31815;
continue;
}
} else {
}
}
break;
}

var encoded = params.toString();
if(clojure.string.blank_QMARK_(encoded)){
return "";
} else {
return (""+"?"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encoded));
}
});
knoxx.backend.extern.fastify.forward_headers = (function knoxx$backend$extern$fastify$forward_headers(request,extra){
var headers = (new Headers());
var source = (function (){var or__5162__auto__ = (request["headers"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})();
var seq__31699_31816 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(Object.keys(source)));
var chunk__31700_31817 = null;
var count__31701_31818 = (0);
var i__31702_31819 = (0);
while(true){
if((i__31702_31819 < count__31701_31818)){
var key_31820 = chunk__31700_31817.cljs$core$IIndexed$_nth$arity$2(null,i__31702_31819);
var lower_31821 = clojure.string.lower_case(key_31820);
var value_31822 = (source[key_31820]);
if((((!(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["host",null,"content-length",null,"connection",null,"transfer-encoding",null], null), null),lower_31821)))) && ((!(knoxx.backend.extern.fastify.no_content_QMARK_(value_31822)))))){
headers.set(key_31820,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31822)));
} else {
}


var G__31829 = seq__31699_31816;
var G__31830 = chunk__31700_31817;
var G__31831 = count__31701_31818;
var G__31832 = (i__31702_31819 + (1));
seq__31699_31816 = G__31829;
chunk__31700_31817 = G__31830;
count__31701_31818 = G__31831;
i__31702_31819 = G__31832;
continue;
} else {
var temp__5825__auto___31834 = cljs.core.seq(seq__31699_31816);
if(temp__5825__auto___31834){
var seq__31699_31839__$1 = temp__5825__auto___31834;
if(cljs.core.chunked_seq_QMARK_(seq__31699_31839__$1)){
var c__5694__auto___31842 = cljs.core.chunk_first(seq__31699_31839__$1);
var G__31844 = cljs.core.chunk_rest(seq__31699_31839__$1);
var G__31845 = c__5694__auto___31842;
var G__31846 = cljs.core.count(c__5694__auto___31842);
var G__31847 = (0);
seq__31699_31816 = G__31844;
chunk__31700_31817 = G__31845;
count__31701_31818 = G__31846;
i__31702_31819 = G__31847;
continue;
} else {
var key_31853 = cljs.core.first(seq__31699_31839__$1);
var lower_31854 = clojure.string.lower_case(key_31853);
var value_31855 = (source[key_31853]);
if((((!(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["host",null,"content-length",null,"connection",null,"transfer-encoding",null], null), null),lower_31854)))) && ((!(knoxx.backend.extern.fastify.no_content_QMARK_(value_31855)))))){
headers.set(key_31853,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31855)));
} else {
}


var G__31863 = cljs.core.next(seq__31699_31839__$1);
var G__31864 = null;
var G__31865 = (0);
var G__31866 = (0);
seq__31699_31816 = G__31863;
chunk__31700_31817 = G__31864;
count__31701_31818 = G__31865;
i__31702_31819 = G__31866;
continue;
}
} else {
}
}
break;
}

var seq__31710_31867 = cljs.core.seq(extra);
var chunk__31711_31868 = null;
var count__31712_31869 = (0);
var i__31713_31870 = (0);
while(true){
if((i__31713_31870 < count__31712_31869)){
var vec__31725_31874 = chunk__31711_31868.cljs$core$IIndexed$_nth$arity$2(null,i__31713_31870);
var key_31875 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31725_31874,(0),null);
var value_31876 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31725_31874,(1),null);
if((value_31876 == null)){
headers.delete(key_31875);
} else {
headers.set(key_31875,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31876)));
}


var G__31877 = seq__31710_31867;
var G__31878 = chunk__31711_31868;
var G__31879 = count__31712_31869;
var G__31880 = (i__31713_31870 + (1));
seq__31710_31867 = G__31877;
chunk__31711_31868 = G__31878;
count__31712_31869 = G__31879;
i__31713_31870 = G__31880;
continue;
} else {
var temp__5825__auto___31881 = cljs.core.seq(seq__31710_31867);
if(temp__5825__auto___31881){
var seq__31710_31882__$1 = temp__5825__auto___31881;
if(cljs.core.chunked_seq_QMARK_(seq__31710_31882__$1)){
var c__5694__auto___31883 = cljs.core.chunk_first(seq__31710_31882__$1);
var G__31884 = cljs.core.chunk_rest(seq__31710_31882__$1);
var G__31885 = c__5694__auto___31883;
var G__31886 = cljs.core.count(c__5694__auto___31883);
var G__31887 = (0);
seq__31710_31867 = G__31884;
chunk__31711_31868 = G__31885;
count__31712_31869 = G__31886;
i__31713_31870 = G__31887;
continue;
} else {
var vec__31735_31888 = cljs.core.first(seq__31710_31882__$1);
var key_31889 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31735_31888,(0),null);
var value_31890 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31735_31888,(1),null);
if((value_31890 == null)){
headers.delete(key_31889);
} else {
headers.set(key_31889,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31890)));
}


var G__31891 = cljs.core.next(seq__31710_31882__$1);
var G__31892 = null;
var G__31893 = (0);
var G__31894 = (0);
seq__31710_31867 = G__31891;
chunk__31711_31868 = G__31892;
count__31712_31869 = G__31893;
i__31713_31870 = G__31894;
continue;
}
} else {
}
}
break;
}

return headers;
});
knoxx.backend.extern.fastify.forward_body = (function knoxx$backend$extern$fastify$forward_body(request){
var method = clojure.string.upper_case(knoxx.backend.extern.fastify.request_method(request));
var body = knoxx.backend.extern.fastify.request_body_raw(request);
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["HEAD",null,"GET",null], null), null),method)){
return null;
} else {
if(((typeof body === 'string') || ((((body instanceof Uint8Array)) || ((((body instanceof ArrayBuffer)) || ((body instanceof Buffer)))))))){
return body;
} else {
if(knoxx.backend.extern.fastify.no_content_QMARK_(body)){
return null;
} else {
return JSON.stringify(body);

}
}
}
});
knoxx.backend.extern.fastify.stream_body_options = (function knoxx$backend$extern$fastify$stream_body_options(request){
var method = clojure.string.upper_case(knoxx.backend.extern.fastify.request_method(request));
var body = knoxx.backend.extern.fastify.forward_body(request);
var content_type = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.extern.fastify.request_header(request,new cljs.core.Keyword(null,"content-type","content-type",-508222634));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["HEAD",null,"GET",null], null), null),method)){
return ({});
} else {
if((!((body == null)))){
return ({"body": body});
} else {
if(clojure.string.includes_QMARK_(content_type,"multipart/form-data")){
return ({"body": (request["raw"]), "duplex": "half"});
} else {
return ({});

}
}
}
});
knoxx.backend.extern.fastify.forward_request_init = (function knoxx$backend$extern$fastify$forward_request_init(request,method,extra_headers,extra){
var base = ({"method": method, "headers": knoxx.backend.extern.fastify.forward_headers(request,extra_headers)});
return Object.assign(base,knoxx.backend.extern.fastify.stream_body_options(request),cljs.core.clj__GT_js(extra));
});
knoxx.backend.extern.fastify.error_status = (function knoxx$backend$extern$fastify$error_status(err,default_status){
var or__5162__auto__ = (err["statusCode"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (err["status"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return default_status;
}
}
});
knoxx.backend.extern.fastify.error_message = (function knoxx$backend$extern$fastify$error_message(err){
var or__5162__auto__ = (err["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
});
knoxx.backend.extern.fastify.error_code = (function knoxx$backend$extern$fastify$error_code(err){
return (err["code"]);
});

//# sourceMappingURL=knoxx.backend.extern.fastify.js.map
