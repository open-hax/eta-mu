import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.promise.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.infra.core_memory.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.infra.http.js";
import "./knoxx.backend.infra.eta_mu_session_ingester.js";
import "./knoxx.backend.infra.source.opencode_session_ingester.js";
goog.provide('knoxx.backend.infra.routes.tools.proxy');
knoxx.backend.infra.routes.tools.proxy.enrich_session_summary_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$enrich_session_summary_BANG_(config,summary){
var session_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(summary);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(summary,new cljs.core.Keyword(null,"session","session",1008279103));
}
})());
if(cljs.core.not(session_id)){
return summary;
} else {
try{var rows = (await knoxx.backend.infra.core_memory.fetch_openplanner_session_rows_BANG_(config,session_id));
var contract_id = knoxx.backend.infra.core_memory.session_contract_id_from_rows(rows);
var actor_id = knoxx.backend.infra.core_memory.session_actor_id_from_rows(rows);
var contract_actors = knoxx.backend.infra.core_memory.session_contract_actors_from_rows(rows);
var wire_actors = ((cljs.core.seq(contract_actors))?knoxx.backend.domain.actor.scope.actor_claims__GT_wire(contract_actors):null);
var G__31108 = summary;
var G__31108__$1 = (cljs.core.truth_(contract_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31108,new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),contract_id):G__31108);
var G__31108__$2 = (cljs.core.truth_(actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31108__$1,new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),actor_id):G__31108__$1);
if(cljs.core.seq(wire_actors)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31108__$2,new cljs.core.Keyword(null,"contract_actors","contract_actors",-1493360705),wire_actors);
} else {
return G__31108__$2;
}
}catch (e31032){var _ = e31032;
return summary;
}}
});
knoxx.backend.infra.routes.tools.proxy.now_iso = (function knoxx$backend$infra$routes$tools$proxy$now_iso(){
return (new Date()).toISOString();
});
knoxx.backend.infra.routes.tools.proxy.json_content_type = (function knoxx$backend$infra$routes$tools$proxy$json_content_type(resp){
var or__5162__auto__ = (function (){var G__31120 = resp;
var G__31120__$1 = (((G__31120 == null))?null:(G__31120["headers"]));
if((G__31120__$1 == null)){
return null;
} else {
return G__31120__$1.get("content-type");
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "application/json";
}
});
knoxx.backend.infra.routes.tools.proxy.safe_json = (async function knoxx$backend$infra$routes$tools$proxy$safe_json(resp){
try{return (await resp.json());
}catch (e31128){var _ = e31128;
return null;
}});
knoxx.backend.infra.routes.tools.proxy.safe_text = (async function knoxx$backend$infra$routes$tools$proxy$safe_text(resp){
try{return (await resp.text());
}catch (e31134){var _ = e31134;
return "";
}});
knoxx.backend.infra.routes.tools.proxy.reply_sent_QMARK_ = (function knoxx$backend$infra$routes$tools$proxy$reply_sent_QMARK_(reply){
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
knoxx.backend.infra.routes.tools.proxy.request_query_string = (function knoxx$backend$infra$routes$tools$proxy$request_query_string(req){
var query = (function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var params = (new URLSearchParams());
var seq__31169_31648 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(Object.keys(query)));
var chunk__31170_31649 = null;
var count__31171_31650 = (0);
var i__31172_31651 = (0);
while(true){
if((i__31172_31651 < count__31171_31650)){
var key_31654 = chunk__31170_31649.cljs$core$IIndexed$_nth$arity$2(null,i__31172_31651);
var value_31655 = (query[key_31654]);
if((value_31655 == null)){
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_31655,undefined)){
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(value_31655))){
var seq__31232_31656 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value_31655));
var chunk__31233_31657 = null;
var count__31234_31658 = (0);
var i__31235_31659 = (0);
while(true){
if((i__31235_31659 < count__31234_31658)){
var item_31660 = chunk__31233_31657.cljs$core$IIndexed$_nth$arity$2(null,i__31235_31659);
params.append(key_31654,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31660)));


var G__31662 = seq__31232_31656;
var G__31663 = chunk__31233_31657;
var G__31664 = count__31234_31658;
var G__31665 = (i__31235_31659 + (1));
seq__31232_31656 = G__31662;
chunk__31233_31657 = G__31663;
count__31234_31658 = G__31664;
i__31235_31659 = G__31665;
continue;
} else {
var temp__5825__auto___31666 = cljs.core.seq(seq__31232_31656);
if(temp__5825__auto___31666){
var seq__31232_31668__$1 = temp__5825__auto___31666;
if(cljs.core.chunked_seq_QMARK_(seq__31232_31668__$1)){
var c__5694__auto___31669 = cljs.core.chunk_first(seq__31232_31668__$1);
var G__31670 = cljs.core.chunk_rest(seq__31232_31668__$1);
var G__31671 = c__5694__auto___31669;
var G__31672 = cljs.core.count(c__5694__auto___31669);
var G__31673 = (0);
seq__31232_31656 = G__31670;
chunk__31233_31657 = G__31671;
count__31234_31658 = G__31672;
i__31235_31659 = G__31673;
continue;
} else {
var item_31675 = cljs.core.first(seq__31232_31668__$1);
params.append(key_31654,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31675)));


var G__31676 = cljs.core.next(seq__31232_31668__$1);
var G__31677 = null;
var G__31678 = (0);
var G__31679 = (0);
seq__31232_31656 = G__31676;
chunk__31233_31657 = G__31677;
count__31234_31658 = G__31678;
i__31235_31659 = G__31679;
continue;
}
} else {
}
}
break;
}
} else {
params.append(key_31654,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31655)));

}
}
}


var G__31685 = seq__31169_31648;
var G__31686 = chunk__31170_31649;
var G__31687 = count__31171_31650;
var G__31688 = (i__31172_31651 + (1));
seq__31169_31648 = G__31685;
chunk__31170_31649 = G__31686;
count__31171_31650 = G__31687;
i__31172_31651 = G__31688;
continue;
} else {
var temp__5825__auto___31689 = cljs.core.seq(seq__31169_31648);
if(temp__5825__auto___31689){
var seq__31169_31690__$1 = temp__5825__auto___31689;
if(cljs.core.chunked_seq_QMARK_(seq__31169_31690__$1)){
var c__5694__auto___31691 = cljs.core.chunk_first(seq__31169_31690__$1);
var G__31692 = cljs.core.chunk_rest(seq__31169_31690__$1);
var G__31693 = c__5694__auto___31691;
var G__31694 = cljs.core.count(c__5694__auto___31691);
var G__31695 = (0);
seq__31169_31648 = G__31692;
chunk__31170_31649 = G__31693;
count__31171_31650 = G__31694;
i__31172_31651 = G__31695;
continue;
} else {
var key_31697 = cljs.core.first(seq__31169_31690__$1);
var value_31698 = (query[key_31697]);
if((value_31698 == null)){
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_31698,undefined)){
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(value_31698))){
var seq__31260_31699 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value_31698));
var chunk__31261_31700 = null;
var count__31262_31701 = (0);
var i__31263_31702 = (0);
while(true){
if((i__31263_31702 < count__31262_31701)){
var item_31705 = chunk__31261_31700.cljs$core$IIndexed$_nth$arity$2(null,i__31263_31702);
params.append(key_31697,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31705)));


var G__31706 = seq__31260_31699;
var G__31707 = chunk__31261_31700;
var G__31708 = count__31262_31701;
var G__31709 = (i__31263_31702 + (1));
seq__31260_31699 = G__31706;
chunk__31261_31700 = G__31707;
count__31262_31701 = G__31708;
i__31263_31702 = G__31709;
continue;
} else {
var temp__5825__auto___31710__$1 = cljs.core.seq(seq__31260_31699);
if(temp__5825__auto___31710__$1){
var seq__31260_31711__$1 = temp__5825__auto___31710__$1;
if(cljs.core.chunked_seq_QMARK_(seq__31260_31711__$1)){
var c__5694__auto___31713 = cljs.core.chunk_first(seq__31260_31711__$1);
var G__31714 = cljs.core.chunk_rest(seq__31260_31711__$1);
var G__31715 = c__5694__auto___31713;
var G__31716 = cljs.core.count(c__5694__auto___31713);
var G__31717 = (0);
seq__31260_31699 = G__31714;
chunk__31261_31700 = G__31715;
count__31262_31701 = G__31716;
i__31263_31702 = G__31717;
continue;
} else {
var item_31718 = cljs.core.first(seq__31260_31711__$1);
params.append(key_31697,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_31718)));


var G__31721 = cljs.core.next(seq__31260_31711__$1);
var G__31722 = null;
var G__31723 = (0);
var G__31724 = (0);
seq__31260_31699 = G__31721;
chunk__31261_31700 = G__31722;
count__31262_31701 = G__31723;
i__31263_31702 = G__31724;
continue;
}
} else {
}
}
break;
}
} else {
params.append(key_31697,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_31698)));

}
}
}


var G__31725 = cljs.core.next(seq__31169_31690__$1);
var G__31726 = null;
var G__31727 = (0);
var G__31728 = (0);
seq__31169_31648 = G__31725;
chunk__31170_31649 = G__31726;
count__31171_31650 = G__31727;
i__31172_31651 = G__31728;
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
knoxx.backend.infra.routes.tools.proxy.reply_send_with_content_type_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$reply_send_with_content_type_BANG_(reply,status,content_type,body){
if(knoxx.backend.infra.routes.tools.proxy.reply_sent_QMARK_(reply)){
return null;
} else {
var reply_STAR_ = reply.code(status);
reply_STAR_.header("content-type",content_type);

return reply_STAR_.send(body);
}
});
knoxx.backend.infra.routes.tools.proxy.send_proxy_error_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$send_proxy_error_BANG_(reply,prefix,err){
if(knoxx.backend.infra.routes.tools.proxy.reply_sent_QMARK_(reply)){
return null;
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (err["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})()))], null));
}
});
knoxx.backend.infra.routes.tools.proxy.request_body = (function knoxx$backend$infra$routes$tools$proxy$request_body(req){
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["HEAD",null,"GET",null], null), null),(req["method"]))){
return undefined;
} else {
return JSON.stringify((req["body"]));
}
});
knoxx.backend.infra.routes.tools.proxy.proxy_fetch_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$proxy_fetch_BANG_(target_url,req,reply,headers,error_prefix){
try{var resp = (await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3(target_url,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),(req["method"]),new cljs.core.Keyword(null,"headers","headers",-835030129),headers,new cljs.core.Keyword(null,"body","body",-2049205669),knoxx.backend.infra.routes.tools.proxy.request_body(req)], null),(60000)));
var content_type = knoxx.backend.infra.routes.tools.proxy.json_content_type(resp);
var body = ((clojure.string.includes_QMARK_(content_type,"application/json"))?(await knoxx.backend.infra.routes.tools.proxy.safe_json(resp)):(await knoxx.backend.infra.routes.tools.proxy.safe_text(resp)));
return knoxx.backend.infra.routes.tools.proxy.reply_send_with_content_type_BANG_(reply,resp.status,content_type,body);
}catch (e31307){var err = e31307;
return knoxx.backend.infra.routes.tools.proxy.send_proxy_error_BANG_(reply,error_prefix,err);
}});
knoxx.backend.infra.routes.tools.proxy.kms_base_url = (function knoxx$backend$infra$routes$tools$proxy$kms_base_url(config){
var or__5162__auto__ = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "http://localhost:3003";
}
});
knoxx.backend.infra.routes.tools.proxy.system_kms_headers = (function knoxx$backend$infra$routes$tools$proxy$system_kms_headers(){
return new cljs.core.PersistentArrayMap(null, 2, ["x-knoxx-user-email","system-admin@open-hax.local","x-knoxx-org-slug","open-hax"], null);
});
knoxx.backend.infra.routes.tools.proxy.find_kms_source_jobs_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$find_kms_source_jobs_BANG_(kms_base,kms_headers,driver_type){
try{var sources_r = (await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kms_base)+"/api/ingestion/sources?tenant_id=knoxx-session"),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"headers","headers",-835030129),kms_headers], null),(15000)));
var sources = (cljs.core.truth_(sources_r.ok)?(await (async function (){try{return (await sources_r.json());
}catch (e31348){var _ = e31348;
return (new Array());
}})()):(new Array()));
var source = (cljs.core.truth_(cljs.core.array_QMARK_(sources))?sources:(new Array())).find((function (s){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((s["driver_type"]),driver_type);
}));
if(cljs.core.not(source)){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(driver_type)+" source not found"),new cljs.core.Keyword(null,"sources","sources",-321166424),sources], null);
} else {
var jobs_r = (await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kms_base)+"/api/ingestion/jobs?tenant_id=knoxx-session&source_id="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((source["source_id"]))),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"headers","headers",-835030129),kms_headers], null),(15000)));
var jobs = (cljs.core.truth_(jobs_r.ok)?(await (async function (){try{return (await jobs_r.json());
}catch (e31364){var _ = e31364;
return (new Array());
}})()):(new Array()));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"source","source",-433931539),source,new cljs.core.Keyword(null,"jobs","jobs",-313607120),jobs], null);
}
}catch (e31345){var _ = e31345;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"Failed to fetch ingestion sources"], null);
}});
knoxx.backend.infra.routes.tools.proxy.session_status_handler_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$session_status_handler_BANG_(config,payload_key,status_BANG_,driver_type){
try{var kms_base = knoxx.backend.infra.routes.tools.proxy.kms_base_url(config);
var kms_headers = knoxx.backend.infra.routes.tools.proxy.system_kms_headers();
var vec__31386 = (await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(await (async function (){try{return (await (status_BANG_.cljs$core$IFn$_invoke$arity$0 ? status_BANG_.cljs$core$IFn$_invoke$arity$0() : status_BANG_.call(null)));
}catch (e31394){var err = e31394;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),err.message], null);
}})()),knoxx.backend.infra.routes.tools.proxy.find_kms_source_jobs_BANG_(kms_base,kms_headers,driver_type)], null)));
var local = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31386,(0),null);
var kms = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31386,(1),null);
return cljs.core.PersistentArrayMap.createAsIfByAssoc([new cljs.core.Keyword(null,"ok","ok",967785236),true,payload_key,local,new cljs.core.Keyword(null,"kms_ingestion","kms_ingestion",-1094306099),kms,new cljs.core.Keyword(null,"time","time",1385887882),knoxx.backend.infra.routes.tools.proxy.now_iso()]);
}catch (e31385){var err = e31385;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),err.message], null);
}});
knoxx.backend.infra.routes.tools.proxy.register_session_status_route_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_session_status_route_BANG_(app,config,path,payload_key,status_BANG_,driver_type){
return app.get(path,(async function (_req,reply){
var result = (await knoxx.backend.infra.routes.tools.proxy.session_status_handler_BANG_(config,payload_key,status_BANG_,driver_type));
return knoxx.backend.infra.http.json_response_BANG_(reply,(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(result))?(200):(500)),result);
}));
});
knoxx.backend.infra.routes.tools.proxy.eta_mu_session_list_handler_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$eta_mu_session_list_handler_BANG_(req){
var q = (await (async function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
return (await knoxx.backend.infra.eta_mu_session_ingester.list_eta_mu_sessions(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.min.cljs$core$IFn$_invoke$arity$2(parseInt((await (async function (){var or__5162__auto__ = (q["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "50";
}
})()),(10)),(200)),new cljs.core.Keyword(null,"offset","offset",296498311),parseInt((await (async function (){var or__5162__auto__ = (q["offset"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "0";
}
})()),(10)),new cljs.core.Keyword(null,"workspace","workspace",-1096735709),(q["workspace"])], null)));
});
knoxx.backend.infra.routes.tools.proxy.eta_mu_session_list_responder_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$eta_mu_session_list_responder_BANG_(req,reply){
try{var result = (await knoxx.backend.infra.routes.tools.proxy.eta_mu_session_list_handler_BANG_(req));
return reply.send(result);
}catch (e31427){var err = e31427;
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}});
knoxx.backend.infra.routes.tools.proxy.register_eta_mu_session_list_route_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_eta_mu_session_list_route_BANG_(app){
return app.get("/api/admin/eta-mu-sessions",(function (req,reply){
return knoxx.backend.infra.routes.tools.proxy.eta_mu_session_list_responder_BANG_(req,reply);
}));
});
knoxx.backend.infra.routes.tools.proxy.source_ingest_request_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$source_ingest_request_BANG_(kms_base,kms_headers,driver_type,force_QMARK_,reply){
try{var sources_r = (await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kms_base)+"/api/ingestion/sources?tenant_id=knoxx-session"),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"headers","headers",-835030129),kms_headers], null),(20000)));
var sources = (cljs.core.truth_(sources_r.ok)?(await (async function (){try{return (await sources_r.json());
}catch (e31459){var _ = e31459;
return (new Array());
}})()):(new Array()));
var source = (cljs.core.truth_(cljs.core.array_QMARK_(sources))?sources:(new Array())).find((function (s){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((s["driver_type"]),driver_type);
}));
if(cljs.core.not(source)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(404),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(driver_type)+" source not found in ingestion service")], null));
} else {
var job_r = (await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kms_base)+"/api/ingestion/jobs"),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),kms_headers,new cljs.core.Keyword(null,"body","body",-2049205669),JSON.stringify(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"source_id","source_id",73146202),(source["source_id"]),new cljs.core.Keyword(null,"full_scan","full_scan",-2139904185),force_QMARK_], null)))], null),(20000)));
var job = (cljs.core.truth_(job_r.ok)?(await (async function (){try{return (await job_r.json());
}catch (e31466){var _ = e31466;
return (await knoxx.backend.infra.routes.tools.proxy.safe_json(job_r));
}})()):(await knoxx.backend.infra.routes.tools.proxy.safe_json(job_r)));
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"job","job",850873087),job], null));
}
}catch (e31454){var err = e31454;
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),err.message], null));
}});
knoxx.backend.infra.routes.tools.proxy.register_session_ingest_route_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_session_ingest_route_BANG_(app,config,path,driver_type){
return app.post(path,(function (req,reply){
var kms_headers = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.tools.proxy.system_kms_headers(),"content-type","application/json");
var body = (function (){var or__5162__auto__ = (req["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
return knoxx.backend.infra.routes.tools.proxy.source_ingest_request_BANG_(knoxx.backend.infra.routes.tools.proxy.kms_base_url(config),kms_headers,driver_type,cljs.core.boolean$((body["force"])),reply);
}));
});
knoxx.backend.infra.routes.tools.proxy.opencode_session_list_handler_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$opencode_session_list_handler_BANG_(req){
var q = (await (async function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
return (await knoxx.backend.infra.source.opencode_session_ingester.list_opencode_sessions(new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.min.cljs$core$IFn$_invoke$arity$2(parseInt((await (async function (){var or__5162__auto__ = (q["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "50";
}
})()),(10)),(200)),new cljs.core.Keyword(null,"cursor","cursor",1011937484),(q["cursor"]),new cljs.core.Keyword(null,"directory","directory",-58912409),(q["directory"]),new cljs.core.Keyword(null,"search","search",1564939822),(q["search"]),new cljs.core.Keyword(null,"roots","roots",-1088919250),(((!(((q["roots"]) == null))))?cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("true",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((q["roots"])))):null),new cljs.core.Keyword(null,"archived","archived",1018596768),(((!(((q["archived"]) == null))))?cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("true",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((q["archived"])))):true)], null)));
});
knoxx.backend.infra.routes.tools.proxy.opencode_session_list_responder_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$opencode_session_list_responder_BANG_(req,reply){
try{var result = (await knoxx.backend.infra.routes.tools.proxy.opencode_session_list_handler_BANG_(req));
return reply.send(result);
}catch (e31518){var err = e31518;
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}});
knoxx.backend.infra.routes.tools.proxy.register_opencode_session_list_route_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_opencode_session_list_route_BANG_(app){
return app.get("/api/admin/opencode-sessions",(function (req,reply){
return knoxx.backend.infra.routes.tools.proxy.opencode_session_list_responder_BANG_(req,reply);
}));
});
knoxx.backend.infra.routes.tools.proxy.register_ingestion_service_proxy_route_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_ingestion_service_proxy_route_BANG_(app,config){
return app.all("/api/ingestion/*",(function (req,reply){
var sub_path = ((req["params"])["*"]);
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.tools.proxy.kms_base_url(config))+"/api/ingestion/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sub_path)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.tools.proxy.request_query_string(req)));
var headers = Object.assign((new Object()),(req["headers"]));
Reflect.deleteProperty(headers,"host");

Reflect.deleteProperty(headers,"connection");

Reflect.deleteProperty(headers,"content-length");

return knoxx.backend.infra.routes.tools.proxy.proxy_fetch_BANG_(target_url,req,reply,headers,"Ingestion proxy error");
}));
});
knoxx.backend.infra.routes.tools.proxy.openplanner_proxy_handler_BANG_ = (async function knoxx$backend$infra$routes$tools$proxy$openplanner_proxy_handler_BANG_(config,req,reply){
try{var body = knoxx.backend.infra.routes.tools.proxy.request_body(req);
var sub_path = ((req["params"])["*"]);
var fwd_headers = new cljs.core.PersistentArrayMap(null, 2, ["x-knoxx-user-email",(await (async function (){var or__5162__auto__ = ((req["headers"])["x-knoxx-user-email"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),"x-knoxx-org-slug",(await (async function (){var or__5162__auto__ = ((req["headers"])["x-knoxx-org-slug"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())], null);
var request_STAR_ = (await (async function (){var G__31558 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"method","method",55703592),(req["method"]),new cljs.core.Keyword(null,"path","path",-188191168),sub_path,new cljs.core.Keyword(null,"query-string","query-string",-1018845061),knoxx.backend.infra.routes.tools.proxy.request_query_string(req),new cljs.core.Keyword(null,"headers","headers",-835030129),fwd_headers], null);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(body,undefined)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31558,new cljs.core.Keyword(null,"body","body",-2049205669),body);
} else {
return G__31558;
}
})());
var resp = (await knoxx.backend.infra.clients.openplanner.forward_v1_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),request_STAR_));
var content_type = knoxx.backend.infra.routes.tools.proxy.json_content_type(resp);
var resp_body = (await ((clojure.string.includes_QMARK_(content_type,"application/json"))?knoxx.backend.infra.routes.tools.proxy.safe_json(resp):knoxx.backend.infra.routes.tools.proxy.safe_text(resp)));
return knoxx.backend.infra.routes.tools.proxy.reply_send_with_content_type_BANG_(reply,resp.status,content_type,resp_body);
}catch (e31548){var err = e31548;
return knoxx.backend.infra.routes.tools.proxy.send_proxy_error_BANG_(reply,"OpenPlanner proxy error",err);
}});
knoxx.backend.infra.routes.tools.proxy.register_openplanner_proxy_routes_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_openplanner_proxy_routes_BANG_(app,config){
app.get("/api/openplanner/v1/sessions",(async function (req,reply){
var body = (await knoxx.backend.infra.clients.openplanner.sessions_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))));
var enriched = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__31568_SHARP_){
return knoxx.backend.infra.routes.tools.proxy.enrich_session_summary_BANG_(config,p1__31568_SHARP_);
}),cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))))));
return reply.send(cljs.core.clj__GT_js(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(body,new cljs.core.Keyword(null,"rows","rows",850049680),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(enriched)))));
}));

return app.all("/api/openplanner/*",(function (req,reply){
return knoxx.backend.infra.routes.tools.proxy.openplanner_proxy_handler_BANG_(config,req,reply);
}));
});
/**
 * Register all proxy endpoints on the fastify app.
 */
knoxx.backend.infra.routes.tools.proxy.register_proxy_routes_BANG_ = (function knoxx$backend$infra$routes$tools$proxy$register_proxy_routes_BANG_(app,config){
knoxx.backend.infra.routes.tools.proxy.register_session_status_route_BANG_(app,config,"/api/admin/eta-mu-sessions/status",new cljs.core.Keyword(null,"legacy","legacy",1434943289),knoxx.backend.infra.eta_mu_session_ingester.get_eta_mu_ingest_status,"eta-mu-sessions");

knoxx.backend.infra.routes.tools.proxy.register_eta_mu_session_list_route_BANG_(app);

knoxx.backend.infra.routes.tools.proxy.register_session_ingest_route_BANG_(app,config,"/api/admin/eta-mu-sessions/ingest","eta-mu-sessions");

knoxx.backend.infra.routes.tools.proxy.register_session_status_route_BANG_(app,config,"/api/admin/opencode-sessions/status",new cljs.core.Keyword(null,"opencode","opencode",-161843607),knoxx.backend.infra.source.opencode_session_ingester.get_opencode_ingest_status,"opencode-sessions");

knoxx.backend.infra.routes.tools.proxy.register_opencode_session_list_route_BANG_(app);

knoxx.backend.infra.routes.tools.proxy.register_session_ingest_route_BANG_(app,config,"/api/admin/opencode-sessions/ingest","opencode-sessions");

knoxx.backend.infra.routes.tools.proxy.register_ingestion_service_proxy_route_BANG_(app,config);

return knoxx.backend.infra.routes.tools.proxy.register_openplanner_proxy_routes_BANG_(app,config);
});

//# sourceMappingURL=knoxx.backend.infra.routes.tools.proxy.js.map
