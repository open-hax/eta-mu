import "./cljs_env.js";
import "./cljs.core.js";
import "./malli.core.js";
import "./malli.error.js";
goog.provide('knoxx.backend.law.store');
/**
 * Compile a Malli schema into a document guard.
 * The guard returns the document unchanged when valid and throws ex-info with
 * humanized :errors when invalid. A nil schema yields a pass-through guard.
 */
knoxx.backend.law.store.compile_schema_guard = (function knoxx$backend$law$store$compile_schema_guard(schema){
if((schema == null)){
return cljs.core.identity;
} else {
var validator = malli.core.validator.cljs$core$IFn$_invoke$arity$1(schema);
var explainer = malli.core.explainer.cljs$core$IFn$_invoke$arity$1(schema);
return (function knoxx$backend$law$store$compile_schema_guard_$_guard(doc){
if(cljs.core.truth_((validator.cljs$core$IFn$_invoke$arity$1 ? validator.cljs$core$IFn$_invoke$arity$1(doc) : validator.call(null,doc)))){
return doc;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Store document failed schema validation",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"errors","errors",-908790718),malli.error.humanize.cljs$core$IFn$_invoke$arity$1((explainer.cljs$core$IFn$_invoke$arity$1 ? explainer.cljs$core$IFn$_invoke$arity$1(doc) : explainer.call(null,doc))),new cljs.core.Keyword(null,"doc","doc",1913296891),doc], null));
}
});
}
});

//# sourceMappingURL=knoxx.backend.law.store.js.map
