import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.infra.clients.proxx.js";
goog.provide('knoxx.backend.infra.agent.provider');
knoxx.backend.infra.agent.provider.response_model_items = (function knoxx$backend$infra$agent$provider$response_model_items(resp){
var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resp,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.Keyword(null,"data","data",-232669377)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.infra.agent.provider.item_model_id = (function knoxx$backend$infra$agent$provider$item_model_id(item){
var raw = ((cljs.core.map_QMARK_(item))?new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(item):null);
if(cljs.core.truth_((function (){var and__5160__auto__ = raw;
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw)))));
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw));
} else {
return null;
}
});
/**
 * Fetch available model ids from Proxx /v1/models so Knoxx's eta-mu model registry includes
 * local Ollama (gemma4, qwen, etc) as well as upstream hosted models.
 * 
 * Returns a Promise of vector of strings.
 */
knoxx.backend.infra.agent.provider.fetch_proxx_model_ids_BANG_ = (async function knoxx$backend$infra$agent$provider$fetch_proxx_model_ids_BANG_(config){
if((!(knoxx.backend.infra.clients.proxx.configured_QMARK_(config)))){
return cljs.core.PersistentVector.EMPTY;
} else {
try{var resp = (await knoxx.backend.infra.clients.proxx.models_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (model_id){
return knoxx.backend.domain.models.allowlisted_model_id_QMARK_(config,model_id);
}),cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.provider.item_model_id,knoxx.backend.infra.agent.provider.response_model_items(resp))))));
} else {
return cljs.core.PersistentVector.EMPTY;
}
}catch (e21333){var _err = e21333;
return cljs.core.PersistentVector.EMPTY;
}}
});

//# sourceMappingURL=knoxx.backend.infra.agent.provider.js.map
