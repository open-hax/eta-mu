import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.hydration.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.infra.config.js";
import "./knoxx.backend.runtime.state.js";
goog.provide('knoxx.backend.domain.mcp.mcp_expose');
/**
 * Resolve the effective CLJS config map.
 * 
 * server.mjs currently holds a JS object (from core/config-js), but the tool
 * factories expect a CLJS map with keyword keys. We prefer the live in-memory
 * config (runtime.state/config*) because it includes enrich-config and any
 * admin overrides, falling back to runtime-config/cfg if needed.
 */
knoxx.backend.domain.mcp.mcp_expose.resolve_config = (function knoxx$backend$domain$mcp$mcp_expose$resolve_config(config){
if(cljs.core.map_QMARK_(config)){
return config;
} else {
var or__5162__auto__ = cljs.core.deref(knoxx.backend.runtime.state.config_STAR_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.config.cfg();
}

}
});
knoxx.backend.domain.mcp.mcp_expose.sub_agent_aware_tool_names = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["agents.spawn",null,"triggers.fire",null], null), null);
knoxx.backend.domain.mcp.mcp_expose.display_value = (function knoxx$backend$domain$mcp$mcp_expose$display_value(value){
if((value instanceof cljs.core.Keyword)){
var temp__5823__auto__ = cljs.core.namespace(value);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(value)));
} else {
return cljs.core.name(value);
}
} else {
if((value == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));

}
}
});
knoxx.backend.domain.mcp.mcp_expose.compact_text = (function knoxx$backend$domain$mcp$mcp_expose$compact_text(value,max_len){
var text = (function (){var G__30451 = value;
var G__30451__$1 = (((G__30451 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30451)));
var G__30451__$2 = (((G__30451__$1 == null))?null:clojure.string.replace(G__30451__$1,/\s+/," "));
var G__30451__$3 = (((G__30451__$2 == null))?null:clojure.string.trim(G__30451__$2));
if((G__30451__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__30451__$3);
}
})();
if(cljs.core.truth_(text)){
if((cljs.core.count(text) > max_len)){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.subs.cljs$core$IFn$_invoke$arity$3(text,(0),max_len))+"\u2026");
} else {
return text;
}
} else {
return null;
}
});
knoxx.backend.domain.mcp.mcp_expose.sub_agent_record__GT_metadata = (function knoxx$backend$domain$mcp$mcp_expose$sub_agent_record__GT_metadata(record){
var contract = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
var caps = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.mcp.mcp_expose.display_value,new cljs.core.Keyword("sub-agent","capabilities","sub-agent/capabilities",1435665929).cljs$core$IFn$_invoke$arity$1(contract))));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"capabilities","capabilities",212739361),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"thinking","thinking",2063777387),new cljs.core.Keyword(null,"summary","summary",380847952),new cljs.core.Keyword(null,"timeoutMs","timeoutMs",-716622575),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"parentCapabilities","parentCapabilities",-1409036833),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"model","model",331153215)],[(function (){var or__5162__auto__ = new cljs.core.Keyword("sub-agent","role","sub-agent/role",819618552).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30458 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"role","role",-736691072)], null));
if((G__30458 == null)){
return null;
} else {
return knoxx.backend.domain.mcp.mcp_expose.display_value(G__30458);
}
}
})(),caps,(function (){var G__30459 = new cljs.core.Keyword("sub-agent","mode","sub-agent/mode",-974519373).cljs$core$IFn$_invoke$arity$1(contract);
if((G__30459 == null)){
return null;
} else {
return knoxx.backend.domain.mcp.mcp_expose.display_value(G__30459);
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword("sub-agent","thinking","sub-agent/thinking",372087731).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30462 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"thinking","thinking",2063777387)], null));
if((G__30462 == null)){
return null;
} else {
return knoxx.backend.domain.mcp.mcp_expose.display_value(G__30462);
}
}
})(),(function (){var or__5162__auto__ = knoxx.backend.domain.mcp.mcp_expose.compact_text(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"task","task",-1476607993)], null)),(220));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.mcp.mcp_expose.compact_text(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"system","system",-29381724)], null)),(220));
}
})(),new cljs.core.Keyword("sub-agent","timeout-ms","sub-agent/timeout-ms",-942662874).cljs$core$IFn$_invoke$arity$1(contract),new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(contract),"sub-agent",(function (){var G__30475 = new cljs.core.Keyword("sub-agent","parent-capabilities","sub-agent/parent-capabilities",-2116028020).cljs$core$IFn$_invoke$arity$1(contract);
if((G__30475 == null)){
return null;
} else {
return knoxx.backend.domain.mcp.mcp_expose.display_value(G__30475);
}
})(),new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(contract),(function (){var or__5162__auto__ = new cljs.core.Keyword("sub-agent","model","sub-agent/model",1269193863).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"model","model",331153215)], null));
}
})()]);
});
knoxx.backend.domain.mcp.mcp_expose.sub_agent_catalog = (function knoxx$backend$domain$mcp$mcp_expose$sub_agent_catalog(cfg){
try{return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (contract){
return knoxx.backend.domain.mcp.mcp_expose.sub_agent_record__GT_metadata(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"contract","contract",798152745),contract], null));
}),cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("contract","id","contract/id",-872298206),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30486_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(p1__30486_SHARP_));
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"contract","contract",798152745),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30485_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub_agents",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__30485_SHARP_));
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(cfg))))));
}catch (e30488){var err = e30488;
console.warn("[knoxx-mcp] failed to load sub-agent metadata",err);

return cljs.core.PersistentVector.EMPTY;
}});
knoxx.backend.domain.mcp.mcp_expose.append_sub_agent_description = (function knoxx$backend$domain$mcp$mcp_expose$append_sub_agent_description(description,ids){
var base = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = description;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(cljs.core.seq(ids)){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base)+"\n\nKnoxx sub-agents advertised by this MCP server: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",ids))+". Use these ids when constructing Knoxx sub-agent payloads.");
} else {
return base;
}
});
knoxx.backend.domain.mcp.mcp_expose.attach_sub_agent_metadata_BANG_ = (function knoxx$backend$domain$mcp$mcp_expose$attach_sub_agent_metadata_BANG_(tool,catalog){
var tool_name = (function (){var G__30502 = (tool["name"]);
var G__30502__$1 = (((G__30502 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30502)));
var G__30502__$2 = (((G__30502__$1 == null))?null:clojure.string.trim(G__30502__$1));
if((G__30502__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30502__$2);
}
})();
var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),catalog);
if(((cljs.core.seq(ids)) && (cljs.core.contains_QMARK_(knoxx.backend.domain.mcp.mcp_expose.sub_agent_aware_tool_names,tool_name)))){
var meta_30589 = (function (){var or__5162__auto__ = (tool["_meta"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})();
(meta_30589["knoxx/subAgents"] = cljs.core.clj__GT_js(catalog));

(meta_30589["knoxx/subAgentIds"] = cljs.core.clj__GT_js(ids));

(tool["_meta"] = meta_30589);

(tool["knoxxSubAgents"] = cljs.core.clj__GT_js(catalog));

(tool["description"] = knoxx.backend.domain.mcp.mcp_expose.append_sub_agent_description((tool["description"]),ids));
} else {
}

return tool;
});
knoxx.backend.domain.mcp.mcp_expose.attach_sub_agent_metadata_to_tools_BANG_ = (function knoxx$backend$domain$mcp$mcp_expose$attach_sub_agent_metadata_to_tools_BANG_(tools,cfg){
var catalog = knoxx.backend.domain.mcp.mcp_expose.sub_agent_catalog(cfg);
var seq__30524_30592 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = tools;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})()));
var chunk__30525_30593 = null;
var count__30526_30595 = (0);
var i__30527_30596 = (0);
while(true){
if((i__30527_30596 < count__30526_30595)){
var tool_30602 = chunk__30525_30593.cljs$core$IIndexed$_nth$arity$2(null,i__30527_30596);
knoxx.backend.domain.mcp.mcp_expose.attach_sub_agent_metadata_BANG_(tool_30602,catalog);


var G__30604 = seq__30524_30592;
var G__30605 = chunk__30525_30593;
var G__30606 = count__30526_30595;
var G__30607 = (i__30527_30596 + (1));
seq__30524_30592 = G__30604;
chunk__30525_30593 = G__30605;
count__30526_30595 = G__30606;
i__30527_30596 = G__30607;
continue;
} else {
var temp__5825__auto___30609 = cljs.core.seq(seq__30524_30592);
if(temp__5825__auto___30609){
var seq__30524_30610__$1 = temp__5825__auto___30609;
if(cljs.core.chunked_seq_QMARK_(seq__30524_30610__$1)){
var c__5694__auto___30611 = cljs.core.chunk_first(seq__30524_30610__$1);
var G__30612 = cljs.core.chunk_rest(seq__30524_30610__$1);
var G__30613 = c__5694__auto___30611;
var G__30614 = cljs.core.count(c__5694__auto___30611);
var G__30615 = (0);
seq__30524_30592 = G__30612;
chunk__30525_30593 = G__30613;
count__30526_30595 = G__30614;
i__30527_30596 = G__30615;
continue;
} else {
var tool_30617 = cljs.core.first(seq__30524_30610__$1);
knoxx.backend.domain.mcp.mcp_expose.attach_sub_agent_metadata_BANG_(tool_30617,catalog);


var G__30618 = cljs.core.next(seq__30524_30610__$1);
var G__30619 = null;
var G__30620 = (0);
var G__30621 = (0);
seq__30524_30592 = G__30618;
chunk__30525_30593 = G__30619;
count__30526_30595 = G__30620;
i__30527_30596 = G__30621;
continue;
}
} else {
}
}
break;
}

return tools;
});
/**
 * Return the same JS tool objects the Knoxx agent runtime uses.
 * 
 * Parameters:
 * - runtime: JS runtime bundle passed from server.mjs
 * - config: Knoxx config map
 * - ctx-js: a CLJS request context map, or a JS object at this JS-facing boundary
 * 
 * Returns: a JS array of tool objects.
 * Each tool has at least:
 * - name (string)
 * - description (string)
 * - parameters (TypeBox schema)
 * - execute (fn)
 * 
 *   NOTE: This is a JS-facing compatibility entrypoint. Internal CLJS code should
 * pass context maps directly; native objects are decoded here only for external
 * callers.
 */
knoxx.backend.domain.mcp.mcp_expose.create_knoxx_custom_tools_js = (function knoxx$backend$domain$mcp$mcp_expose$create_knoxx_custom_tools_js(runtime,config,ctx_js){
var ctx = ((cljs.core.map_QMARK_(ctx_js))?ctx_js:(cljs.core.truth_(ctx_js)?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(ctx_js,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):null
));
var cfg = knoxx.backend.domain.mcp.mcp_expose.resolve_config(config);
var tools = knoxx.backend.infra.agent.hydration.create_knoxx_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,cfg,ctx);
return knoxx.backend.domain.mcp.mcp_expose.attach_sub_agent_metadata_to_tools_BANG_(tools,cfg);
});

//# sourceMappingURL=knoxx.backend.domain.mcp.mcp_expose.js.map
