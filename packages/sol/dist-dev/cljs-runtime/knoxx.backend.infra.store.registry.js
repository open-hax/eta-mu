import "./cljs_env.js";
import "./cljs.core.js";
import "./open_hax.contract_runtime.store.registry.js";
goog.provide('knoxx.backend.infra.store.registry');
/**
 * Register a store instance under its qualified id. Returns the store.
 */
knoxx.backend.infra.store.registry.register_store_BANG_ = (function knoxx$backend$infra$store$registry$register_store_BANG_(store_id,store){
return open_hax.contract_runtime.store.registry.register_store_BANG_(store_id,store);
});
/**
 * Return the registered store instance for an id, or nil.
 */
knoxx.backend.infra.store.registry.registered_store = (function knoxx$backend$infra$store$registry$registered_store(store_id){
return open_hax.contract_runtime.store.registry.registered_store(store_id);
});
/**
 * Return all registered store ids.
 */
knoxx.backend.infra.store.registry.store_ids = (function knoxx$backend$infra$store$registry$store_ids(){
return open_hax.contract_runtime.store.registry.store_ids();
});
/**
 * Drop all registered store instances. Test escape hatch.
 */
knoxx.backend.infra.store.registry.reset_stores_BANG_ = (function knoxx$backend$infra$store$registry$reset_stores_BANG_(){
return open_hax.contract_runtime.store.registry.reset_stores_BANG_();
});
/**
 * Resolve a store instance by id, instantiating a memory-backed store from
 * its resource definition on first use. Returns nil when no store resource
 * declares the id.
 */
knoxx.backend.infra.store.registry.get_store_BANG_ = (function knoxx$backend$infra$store$registry$get_store_BANG_(config,store_id){
return open_hax.contract_runtime.store.registry.get_store_BANG_(config,store_id);
});

//# sourceMappingURL=knoxx.backend.infra.store.registry.js.map
