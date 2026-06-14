import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.agent_templates.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.infra.registry.tools.js";
goog.provide('knoxx.backend.domain.contracts.roles');
/**
 * Set of keyword namespaces that are standard resource kind prefixes.
 * These are stripped during id normalization; non-standard namespaces are preserved.
 */
knoxx.backend.domain.contracts.roles.standard_namespaces = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 19, ["capabilities",null,"role",null,"agent",null,"model",null,"sub-agent",null,"ingest-source",null,"runtime-feature",null,"schedule",null,"model-family",null,"action",null,"policy",null,"source",null,"generator",null,"cap",null,"trigger",null,"source-mode",null,"store",null,"roles",null,"actor",null], null), null);
/**
 * Convert a value to a string id. Preserves namespace-qualified keywords
 * (e.g. :deploy/greeter-role -> "deploy/greeter-role") while stripping
 * standard namespaces like :role/ or :cap/.
 */
knoxx.backend.domain.contracts.roles.keywordish_id = (function knoxx$backend$domain$contracts$roles$keywordish_id(value){
if((value instanceof cljs.core.Keyword)){
var ns_part = cljs.core.namespace(value);
var name_part = (function (){var G__26466 = value;
var G__26466__$1 = (((G__26466 == null))?null:cljs.core.name(G__26466));
var G__26466__$2 = (((G__26466__$1 == null))?null:clojure.string.trim(G__26466__$1));
if((G__26466__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26466__$2);
}
})();
if(cljs.core.truth_(name_part)){
if(cljs.core.truth_((function (){var and__5160__auto__ = ns_part;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not((knoxx.backend.domain.contracts.roles.standard_namespaces.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.contracts.roles.standard_namespaces.cljs$core$IFn$_invoke$arity$1(ns_part) : knoxx.backend.domain.contracts.roles.standard_namespaces.call(null,ns_part)));
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns_part)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name_part));
} else {
return name_part;
}
} else {
return null;
}
} else {
if(typeof value === 'string'){
var G__26471 = value;
var G__26471__$1 = (((G__26471 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26471)));
var G__26471__$2 = (((G__26471__$1 == null))?null:clojure.string.trim(G__26471__$1));
if((G__26471__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26471__$2);
}
} else {
if((value == null)){
return null;
} else {
var G__26481 = value;
var G__26481__$1 = (((G__26481 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26481)));
var G__26481__$2 = (((G__26481__$1 == null))?null:clojure.string.trim(G__26481__$1));
if((G__26481__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26481__$2);
}

}
}
}
});
/**
 * Generate candidate ids for lookup. For qualified ids (containing /),
 * also generates the unqualified local name as a fallback candidate.
 */
knoxx.backend.domain.contracts.roles.id_candidates = (function knoxx$backend$domain$contracts$roles$id_candidates(value){
var raw = knoxx.backend.domain.contracts.roles.keywordish_id(value);
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [raw,(cljs.core.truth_((function (){var and__5160__auto__ = raw;
if(cljs.core.truth_(and__5160__auto__)){
return clojure.string.includes_QMARK_(raw,"/");
} else {
return and__5160__auto__;
}
})())?cljs.core.last(clojure.string.split.cljs$core$IFn$_invoke$arity$2(raw,/\//)):null),(function (){var G__26511 = raw;
if((G__26511 == null)){
return null;
} else {
return clojure.string.replace(G__26511,/_/,"-");
}
})(),(function (){var G__26522 = raw;
if((G__26522 == null)){
return null;
} else {
return clojure.string.replace(G__26522,/-/,"_");
}
})(),(cljs.core.truth_((function (){var G__26523 = raw;
if((G__26523 == null)){
return null;
} else {
return clojure.string.starts_with_QMARK_(G__26523,"cap_");
}
})())?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(raw,(4)):null)], null))));
});
knoxx.backend.domain.contracts.roles.contract_record = (function knoxx$backend$domain$contracts$roles$contract_record(config,contract_class,id){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var candidates = cljs.core.set(knoxx.backend.domain.contracts.roles.id_candidates(id));
return cljs.core.some((function (record){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record))) && (cljs.core.contains_QMARK_(candidates,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record))))){
return record;
} else {
return null;
}
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config));
});
knoxx.backend.domain.contracts.roles.contract_by_id = (function knoxx$backend$domain$contracts$roles$contract_by_id(config,contract_class,id){
var G__26540 = knoxx.backend.domain.contracts.roles.contract_record(config,contract_class,id);
if((G__26540 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(G__26540);
}
});
/**
 * List canonical role contract IDs from parsed contract records.
 * 
 * IDs come from :role/id through contracts.loader identity extraction, not from
 * filenames or contracts/roles directory placement.
 */
knoxx.backend.domain.contracts.roles.list_role_slugs = (function knoxx$backend$domain$contracts$roles$list_role_slugs(config){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26546_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("roles",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26546_SHARP_));
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config))))));
});
/**
 * Return the canonical role contract id when it exists.
 * 
 * This intentionally does not fall back to a default role: missing role claims
 * are contract drift and should be visible to callers.
 */
knoxx.backend.domain.contracts.roles.normalize_role = (function knoxx$backend$domain$contracts$roles$normalize_role(config,role){
var or__5162__auto__ = (function (){var G__26585 = knoxx.backend.domain.contracts.roles.contract_record(config,"roles",role);
if((G__26585 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__26585);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.contracts.roles.keywordish_id(role);
}
});
knoxx.backend.domain.contracts.roles.normalize_cap_id = (function knoxx$backend$domain$contracts$roles$normalize_cap_id(v){
return knoxx.backend.domain.contracts.roles.keywordish_id(v);
});
/**
 * Legacy helper retained for callers. It no longer names a file path; it returns
 * the canonical-ish capability id candidate used for contract identity lookup.
 */
knoxx.backend.domain.contracts.roles.cap_id__GT_slug = (function knoxx$backend$domain$contracts$roles$cap_id__GT_slug(cap_id){
var or__5162__auto__ = (function (){var G__26598 = knoxx.backend.domain.contracts.roles.contract_record(cljs.core.PersistentArrayMap.EMPTY,"capabilities",cap_id);
if((G__26598 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__26598);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__26602 = cap_id;
var G__26602__$1 = (((G__26602 == null))?null:knoxx.backend.domain.contracts.roles.keywordish_id(G__26602));
if((G__26602__$1 == null)){
return null;
} else {
return clojure.string.replace(G__26602__$1,/^cap_/,"");
}
}
});
/**
 * Return normalized capability ids for a role contract.
 */
knoxx.backend.domain.contracts.roles.role_capability_ids = (function knoxx$backend$domain$contracts$roles$role_capability_ids(config,role){
var role_map = knoxx.backend.domain.contracts.roles.contract_by_id(config,"roles",role);
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.roles.normalize_cap_id,(function (){var or__5162__auto__ = new cljs.core.Keyword("role","capabilities","role/capabilities",208971087).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
/**
 * Return a vector of tool ids for one capability id.
 */
knoxx.backend.domain.contracts.roles.capability_tool_ids = (function knoxx$backend$domain$contracts$roles$capability_tool_ids(config,cap){
var temp__5823__auto__ = knoxx.backend.domain.contracts.roles.contract_by_id(config,"capabilities",cap);
if(cljs.core.truth_(temp__5823__auto__)){
var cap_map = temp__5823__auto__;
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,new cljs.core.Keyword("cap","tools","cap/tools",-1241568196).cljs$core$IFn$_invoke$arity$1(cap_map))))));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
/**
 * Return a vector of tool ids for a role contract.
 */
knoxx.backend.domain.contracts.roles.role_tool_ids = (function knoxx$backend$domain$contracts$roles$role_tool_ids(config,role){
var cap_ids = knoxx.backend.domain.contracts.roles.role_capability_ids(config,role);
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (cap_id){
return knoxx.backend.domain.contracts.roles.capability_tool_ids(config,cap_id);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cap_ids], 0)))));
});
/**
 * Return vector of {:id :label :description} tool entries for a role.
 */
knoxx.backend.domain.contracts.roles.role_tools = (function knoxx$backend$domain$contracts$roles$role_tools(config,role){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (tool_id){
var map__26651 = knoxx.backend.infra.registry.tools.get_tool(tool_id);
var map__26651__$1 = cljs.core.__destructure_map(map__26651);
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26651__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var description = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26651__$1,new cljs.core.Keyword(null,"description","description",-1428560544));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"id","id",-1388402092),tool_id,new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"description","description",-1428560544),description], null);
}),knoxx.backend.domain.contracts.roles.role_tool_ids(config,role));
});
/**
 * Load a role contract map by canonical role identity.
 */
knoxx.backend.domain.contracts.roles.role_contract = (function knoxx$backend$domain$contracts$roles$role_contract(config,role){
return knoxx.backend.domain.contracts.roles.contract_by_id(config,"roles",role);
});
/**
 * Return a vector of permission code strings for a role contract.
 */
knoxx.backend.domain.contracts.roles.role_permissions = (function knoxx$backend$domain$contracts$roles$role_permissions(config,role){
var role_map = knoxx.backend.domain.contracts.roles.role_contract(config,role);
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(function (){var or__5162__auto__ = new cljs.core.Keyword("role","permissions","role/permissions",54401385).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
});
/**
 * Return the role-level system prompt value if present.
 */
knoxx.backend.domain.contracts.roles.role_system_prompt = (function knoxx$backend$domain$contracts$roles$role_system_prompt(config,role){
var role_map = knoxx.backend.domain.contracts.roles.role_contract(config,role);
var prompt = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(role_map,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"system","system",-29381724)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(role_map,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("role","prompts","role/prompts",12162071),new cljs.core.Keyword(null,"system","system",-29381724)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword("role","system-prompt","role/system-prompt",317144079).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword("role","system_prompt","role/system_prompt",-658802636).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954).cljs$core$IFn$_invoke$arity$1(role_map);
}
}
}
}
}
})();
return knoxx.backend.domain.agent.agent_templates.prompt_value(prompt);
});
/**
 * Return the role-level task prompt value if present.
 */
knoxx.backend.domain.contracts.roles.role_task_prompt = (function knoxx$backend$domain$contracts$roles$role_task_prompt(config,role){
var role_map = knoxx.backend.domain.contracts.roles.role_contract(config,role);
var prompt = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(role_map,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"task","task",-1476607993)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(role_map,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("role","prompts","role/prompts",12162071),new cljs.core.Keyword(null,"task","task",-1476607993)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword("role","task-prompt","role/task-prompt",-352874186).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword("role","task_prompt","role/task_prompt",1274238458).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(role_map);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"task_prompt","task_prompt",1276696196).cljs$core$IFn$_invoke$arity$1(role_map);
}
}
}
}
}
})();
return knoxx.backend.domain.agent.agent_templates.prompt_value(prompt);
});

//# sourceMappingURL=knoxx.backend.domain.contracts.roles.js.map
