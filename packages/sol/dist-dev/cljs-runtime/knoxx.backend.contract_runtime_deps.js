import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.action.registry.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.filter.registry.js";
import "./knoxx.backend.domain.resources.loader.js";
import "./knoxx.backend.infra.store.registry.js";
goog.provide('knoxx.backend.contract_runtime_deps');
/**
 * Build the :contract-runtime/deps map for injection into config.
 */
knoxx.backend.contract_runtime_deps.build_deps = (function knoxx$backend$contract_runtime_deps$build_deps(){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"list-resource-ids","list-resource-ids",-866070080),new cljs.core.Keyword(null,"run-action!","run-action!",-814564479),new cljs.core.Keyword(null,"load-resources","load-resources",2061423403),new cljs.core.Keyword(null,"get-resource","get-resource",-2146213108),new cljs.core.Keyword(null,"get-action","get-action",2039230544),new cljs.core.Keyword(null,"get-store","get-store",-1957650510),new cljs.core.Keyword(null,"get-scope-declaration","get-scope-declaration",1952167348),new cljs.core.Keyword(null,"resource-class","resource-class",2041510648),new cljs.core.Keyword(null,"filter-fn","filter-fn",1689475675)],[(function (config,resource_kind){
return knoxx.backend.domain.resources.loader.list_resource_ids_sync(config,resource_kind);
}),(function (ctx,action){
return knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,action);
}),(function (config){
return knoxx.backend.domain.resources.loader.load_all_resources_sync(config);
}),(function (config,resource_kind,resource_id){
return knoxx.backend.domain.resources.loader.resource_record_sync(config,resource_kind,resource_id);
}),(function (kind){
return knoxx.backend.domain.action.registry.get_action(kind);
}),(function (config,store_id){
return knoxx.backend.infra.store.registry.get_store_BANG_(config,store_id);
}),(function (kind){
return knoxx.backend.domain.action.registry.get_scope_declaration(kind);
}),(function (resource_kind){
return knoxx.backend.domain.resources.loader.resource_class(resource_kind);
}),(function (filter_id){
return (knoxx.backend.domain.filter.registry.filter_fn.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.filter.registry.filter_fn.cljs$core$IFn$_invoke$arity$1(filter_id) : knoxx.backend.domain.filter.registry.filter_fn.call(null,filter_id));
})]);
});
/**
 * Inject contract-runtime dependencies into the runtime config.
 * Call this during bootstrap to wire the contract runtime.
 */
knoxx.backend.contract_runtime_deps.inject_deps_BANG_ = (function knoxx$backend$contract_runtime_deps$inject_deps_BANG_(config){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(config,new cljs.core.Keyword("contract-runtime","deps","contract-runtime/deps",1088243236),knoxx.backend.contract_runtime_deps.build_deps());
});

//# sourceMappingURL=knoxx.backend.contract_runtime_deps.js.map
