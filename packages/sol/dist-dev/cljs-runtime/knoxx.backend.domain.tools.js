import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.tools.js";
import "./knoxx.backend.runtime.state.js";
goog.provide('knoxx.backend.domain.tools');
/**
 * Convert a Malli schema to a Pi tool :parameters JS object.
 */
knoxx.backend.domain.tools.__GT_params = (function knoxx$backend$domain$tools$__GT_params(schema){
return knoxx.backend.extern.tools.parameters(schema);
});
knoxx.backend.domain.tools.create_tool_obj = (function knoxx$backend$domain$tools$create_tool_obj(name,label,description,prompt,prompt_guidelines,params,execute,runtime,config){
return knoxx.backend.extern.tools.tool_definition(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"description","description",-1428560544),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"parameters-schema","parameters-schema",772116426),new cljs.core.Keyword(null,"execute","execute",-129499188),new cljs.core.Keyword(null,"prompt-guidelines","prompt-guidelines",-1132305296),new cljs.core.Keyword(null,"prompt-snippet","prompt-snippet",1567378482),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"runtime","runtime",-1331573996)],[description,config,name,params,execute,prompt_guidelines,prompt,label,runtime]));
});
/**
 * Call an on-update callback with a text status update.
 */
knoxx.backend.domain.tools.maybe_tool_update_BANG_ = (function knoxx$backend$domain$tools$maybe_tool_update_BANG_(f,text){
return knoxx.backend.extern.tools.send_update_BANG_(f,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"text",new cljs.core.Keyword(null,"text","text",-1790561697),text], null)], null)], null));
});
knoxx.backend.domain.tools.type_optional = (function knoxx$backend$domain$tools$type_optional(Type,schema){
return knoxx.backend.extern.tools.type_optional(Type,schema);
});
knoxx.backend.domain.tools.sanitize_custom_tool_name = (function knoxx$backend$domain$tools$sanitize_custom_tool_name(tool){
return knoxx.backend.extern.tools.sanitize_custom_tool_name(tool);
});
knoxx.backend.domain.tools.sanitize_custom_tools = (function knoxx$backend$domain$tools$sanitize_custom_tools(tools){
return knoxx.backend.extern.tools.sanitize_custom_tools(tools);
});
/**
 * Filter a collection of tool objects to only those whose name (or originalName)
 * appears in allowed-tool-ids.
 */
knoxx.backend.domain.tools.filter_custom_tools_by_allow_set = (function knoxx$backend$domain$tools$filter_custom_tools_by_allow_set(tools,allowed_tool_ids){
return knoxx.backend.extern.tools.filter_custom_tools_by_allow_set(tools,allowed_tool_ids);
});
/**
 * Parse JSON string to Clojure data.
 */
knoxx.backend.domain.tools.json_parse = (function knoxx$backend$domain$tools$json_parse(text){
return knoxx.backend.extern.tools.parse_json(text);
});
/**
 * Resolve live config, preferring the runtime atom.
 */
knoxx.backend.domain.tools.live_config = (function knoxx$backend$domain$tools$live_config(config){
var or__5162__auto__ = cljs.core.deref(knoxx.backend.runtime.state.config_STAR_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return config;
}
});
/**
 * Classify an agent spec into a tool-suite keyword.
 */
knoxx.backend.domain.tools.agent_custom_tool_suite = (function knoxx$backend$domain$tools$agent_custom_tool_suite(agent_spec){
var role = (function (){var G__33011 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__33011__$1 = (((G__33011 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33011)));
var G__33011__$2 = (((G__33011__$1 == null))?null:clojure.string.trim(G__33011__$1));
if((G__33011__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__33011__$2);
}
})();
var contract_id = (function (){var G__33013 = new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__33013__$1 = (((G__33013 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33013)));
var G__33013__$2 = (((G__33013__$1 == null))?null:clojure.string.trim(G__33013__$1));
if((G__33013__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__33013__$2);
}
})();
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(role,"contract_librarian")) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(contract_id,"contract_librarian")))){
return new cljs.core.Keyword(null,"contract-librarian","contract-librarian",638098080);
} else {
return new cljs.core.Keyword(null,"knoxx","knoxx",-1928448572);
}
});

//# sourceMappingURL=knoxx.backend.domain.tools.js.map
