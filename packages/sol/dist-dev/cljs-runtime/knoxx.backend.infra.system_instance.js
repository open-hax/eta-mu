import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.extern.agent_turn_node.js";
goog.provide('knoxx.backend.infra.system_instance');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.system_instance !== 'undefined') && (typeof knoxx.backend.infra.system_instance.instance_id_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.system_instance.instance_id_STAR_ = knoxx.backend.extern.agent_turn_node.random_uuid_BANG_();
}
/**
 * UUID identifying the current system instance.
 */
knoxx.backend.infra.system_instance.current_id = (function knoxx$backend$infra$system_instance$current_id(){
return knoxx.backend.infra.system_instance.instance_id_STAR_;
});
/**
 * True when the document's :system_instance_id was stamped by this instance.
 * Documents without the field (legacy writers) are never owned.
 */
knoxx.backend.infra.system_instance.owned_by_current_instance_QMARK_ = (function knoxx$backend$infra$system_instance$owned_by_current_instance_QMARK_(doc){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036).cljs$core$IFn$_invoke$arity$1(doc);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),knoxx.backend.infra.system_instance.instance_id_STAR_);
});

//# sourceMappingURL=knoxx.backend.infra.system_instance.js.map
