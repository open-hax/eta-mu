import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.control.catalog.js";
import "./knoxx.backend.domain.driver.builtin.js";
import "./knoxx.backend.domain.resources.loader.js";
import "./knoxx.backend.runtime.roles.js";
goog.provide('knoxx.backend.infra.control_config');
knoxx.backend.infra.control_config.resource_records = (function knoxx$backend$infra$control_config$resource_records(config){
knoxx.backend.domain.driver.builtin.register_built_in_drivers_BANG_();

return knoxx.backend.domain.resources.loader.load_all_resources_sync(config);
});
/**
 * Return the resource-native event runtime control catalog.
 * 
 * Agents, triggers, actions, schedules, and generators are intentionally kept
 * separate. Legacy persisted job overrides are not interpreted here; runtime
 * behavior must come from resources that satisfy boundary contracts.
 */
knoxx.backend.infra.control_config.event_control_config = (function knoxx$backend$infra$control_config$event_control_config(config){
return knoxx.backend.domain.control.catalog.catalog(knoxx.backend.infra.control_config.resource_records(config));
});
knoxx.backend.infra.control_config.event_role_options = (function knoxx$backend$infra$control_config$event_role_options(config){
return (knoxx.backend.runtime.roles.list_role_slugs.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.runtime.roles.list_role_slugs.cljs$core$IFn$_invoke$arity$1(config) : knoxx.backend.runtime.roles.list_role_slugs.call(null,config));
});
knoxx.backend.infra.control_config.event_generator_kind_options = (function knoxx$backend$infra$control_config$event_generator_kind_options(config){
return knoxx.backend.domain.control.catalog.generator_kind_options(knoxx.backend.infra.control_config.resource_records(config));
});
knoxx.backend.infra.control_config.event_trigger_kind_options = (function knoxx$backend$infra$control_config$event_trigger_kind_options(){
return knoxx.backend.domain.control.catalog.trigger_kind_options;
});
/**
 * Compatibility persistence hook for old admin clients.
 * 
 * The new runtime is resource-backed, so this stores only the submitted control
 * view for client round-tripping and does not become runtime truth.
 */
knoxx.backend.infra.control_config.persist_event_control_BANG_ = (async function knoxx$backend$infra$control_config$persist_event_control_BANG_(control){
return control;
});
/**
 * Load a legacy persisted admin control snapshot, if present. Runtime truth is
 * still the resource catalog returned by event-control-config.
 */
knoxx.backend.infra.control_config.load_event_control = (async function knoxx$backend$infra$control_config$load_event_control(){
return null;
});

//# sourceMappingURL=knoxx.backend.infra.control_config.js.map
