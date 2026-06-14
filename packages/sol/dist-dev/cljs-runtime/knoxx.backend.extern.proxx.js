import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.json.js";
import "./knoxx.backend.infra.http.js";
goog.provide('knoxx.backend.extern.proxx');
knoxx.backend.extern.proxx.trim_trailing_slashes = (function knoxx$backend$extern$proxx$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.extern.proxx.bearer_headers = (function knoxx$backend$extern$proxx$bearer_headers(token){
var headers = ({"Content-Type": "application/json"});
if(clojure.string.blank_QMARK_(token)){
} else {
(headers["Authorization"] = (""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)));
}

return headers;
});
knoxx.backend.extern.proxx.chat_completions_url = (function knoxx$backend$extern$proxx$chat_completions_url(config){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.extern.proxx.trim_trailing_slashes(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config)))+"/v1/chat/completions");
});
knoxx.backend.extern.proxx.normalize_chat_completion_response = (function knoxx$backend$extern$proxx$normalize_chat_completion_response(resp){
var ok_QMARK_ = new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp) === true;
var status = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp);
var body = knoxx.backend.extern.json.to_cljs(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
var first_choice = cljs.core.first(new cljs.core.Keyword(null,"choices","choices",1385611597).cljs$core$IFn$_invoke$arity$1(body));
var message = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(first_choice);
var content = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(first_choice);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
var reasoning_content = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"reasoning_content","reasoning_content",-2036695848).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"reasoningContent","reasoningContent",617146014).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
var G__28174 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok?","ok?",447310304),ok_QMARK_,new cljs.core.Keyword(null,"status","status",-1997798413),status], null);
var G__28174__$1 = (cljs.core.truth_(new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28174,new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body)):G__28174);
var G__28174__$2 = ((cljs.core.seq((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(content))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28174__$1,new cljs.core.Keyword(null,"content","content",15833224),content):G__28174__$1);
var G__28174__$3 = ((cljs.core.seq((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(reasoning_content))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28174__$2,new cljs.core.Keyword(null,"reasoning-content","reasoning-content",-1591934153),reasoning_content):G__28174__$2);
if((!((body == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28174__$3,new cljs.core.Keyword(null,"body","body",-2049205669),body);
} else {
return G__28174__$3;
}
});
/**
 * POST a CLJS chat completion request map through fetch-json and return a CLJS
 * response map. Accepts fetch-json as an argument so tests do not mutate global
 * vars while async suites are running.
 */
knoxx.backend.extern.proxx.chat_completion_with_fetch_BANG_ = (async function knoxx$backend$extern$proxx$chat_completion_with_fetch_BANG_(fetch_json,config,request){
return knoxx.backend.extern.proxx.normalize_chat_completion_response((await (await (async function (){var G__28181 = knoxx.backend.extern.proxx.chat_completions_url(config);
var G__28182 = ({"method": "POST", "headers": knoxx.backend.extern.proxx.bearer_headers(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config)), "body": knoxx.backend.extern.json.stringify(request)});
return (fetch_json.cljs$core$IFn$_invoke$arity$2 ? fetch_json.cljs$core$IFn$_invoke$arity$2(G__28181,G__28182) : fetch_json.call(null,G__28181,G__28182));
})())));
});
/**
 * POST a CLJS chat completion request map to Proxx and return a CLJS response
 * map containing :ok?, :status, :model, :content, and :reasoning-content when
 * present. Raw JS fetch/JSON shapes are confined here.
 */
knoxx.backend.extern.proxx.chat_completion_BANG_ = (function knoxx$backend$extern$proxx$chat_completion_BANG_(config,request){
return knoxx.backend.extern.proxx.chat_completion_with_fetch_BANG_(knoxx.backend.infra.http.fetch_json,config,request);
});

//# sourceMappingURL=knoxx.backend.extern.proxx.js.map
