import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./malli.json_schema.js";
goog.provide('knoxx.backend.extern.tools');
/**
 * Convert a Malli schema to a Pi/eta-mu runtime JS parameters object.
 */
knoxx.backend.extern.tools.parameters = (function knoxx$backend$extern$tools$parameters(schema){
return cljs.core.clj__GT_js(malli.json_schema.transform.cljs$core$IFn$_invoke$arity$1(schema));
});
knoxx.backend.extern.tools.tool_definition = (function knoxx$backend$extern$tools$tool_definition(p__32549){
var map__32551 = p__32549;
var map__32551__$1 = cljs.core.__destructure_map(map__32551);
var description = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"description","description",-1428560544));
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"config","config",994861415));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var parameters_schema = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"parameters-schema","parameters-schema",772116426));
var execute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"execute","execute",-129499188));
var prompt_guidelines = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"prompt-guidelines","prompt-guidelines",-1132305296));
var prompt_snippet = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"prompt-snippet","prompt-snippet",1567378482));
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32551__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
return ({"name": name, "label": label, "description": description, "promptSnippet": prompt_snippet, "promptGuidelines": cljs.core.clj__GT_js(prompt_guidelines), "parameters": knoxx.backend.extern.tools.parameters(parameters_schema), "execute": cljs.core.partial.cljs$core$IFn$_invoke$arity$3(execute,runtime,config)});
});
/**
 * Call a tool runtime update callback with a CLJS payload map.
 */
knoxx.backend.extern.tools.send_update_BANG_ = (function knoxx$backend$extern$tools$send_update_BANG_(f,payload){
if(cljs.core.fn_QMARK_(f)){
var G__32565 = cljs.core.clj__GT_js(payload);
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(G__32565) : f.call(null,G__32565));
} else {
return null;
}
});
knoxx.backend.extern.tools.type_optional = (function knoxx$backend$extern$tools$type_optional(Type,schema){
return Type.Optional(schema);
});
knoxx.backend.extern.tools.js_array_seq = (function knoxx$backend$extern$tools$js_array_seq(value){
if(cljs.core.truth_(cljs.core.array_QMARK_(value))){
return cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.extern.tools.replace_tool_name = (function knoxx$backend$extern$tools$replace_tool_name(text,original_name,sanitized_name){
var G__32587 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text));
if((G__32587 == null)){
return null;
} else {
return clojure.string.replace(G__32587,original_name,sanitized_name);
}
});
knoxx.backend.extern.tools.sanitize_tool_guidelines = (function knoxx$backend$extern$tools$sanitize_tool_guidelines(guidelines,original_name,sanitized_name){
return cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (guideline){
return (""+"Use "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sanitized_name)+" (canonical "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(original_name)+") when "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.extern.tools.replace_tool_name(guideline,original_name,sanitized_name)));
}),knoxx.backend.extern.tools.js_array_seq(guidelines)));
});
knoxx.backend.extern.tools.sanitize_custom_tool_name = (function knoxx$backend$extern$tools$sanitize_custom_tool_name(tool){
var name = (function (){var G__32651 = (tool["name"]);
if((G__32651 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32651));
}
})();
var sanitized = (function (){var G__32680 = name;
var G__32680__$1 = (((G__32680 == null))?null:clojure.string.replace(G__32680,/[^A-Za-z0-9_-]/,"_"));
if((G__32680__$1 == null)){
return null;
} else {
return clojure.string.replace(G__32680__$1,/_+/,"_");
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = sanitized;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(sanitized,name);
} else {
return and__5160__auto__;
}
})())){
(tool["name"] = sanitized);

(tool["originalName"] = name);

var temp__5825__auto___32756 = (function (){var G__32694 = (tool["description"]);
if((G__32694 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32694));
}
})();
if(cljs.core.truth_(temp__5825__auto___32756)){
var description_32757 = temp__5825__auto___32756;
(tool["description"] = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(description_32757)+" Call this tool as `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sanitized)+"`. Canonical tool id: `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"`."));
} else {
}

var temp__5825__auto___32758 = (function (){var G__32701 = (tool["promptSnippet"]);
if((G__32701 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32701));
}
})();
if(cljs.core.truth_(temp__5825__auto___32758)){
var snippet_32759 = temp__5825__auto___32758;
(tool["promptSnippet"] = (""+"Call as `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sanitized)+"` (canonical `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"`). "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.extern.tools.replace_tool_name(snippet_32759,name,sanitized))));
} else {
}

var temp__5825__auto___32760 = (tool["promptGuidelines"]);
if(cljs.core.truth_(temp__5825__auto___32760)){
var guidelines_32768 = temp__5825__auto___32760;
(tool["promptGuidelines"] = knoxx.backend.extern.tools.sanitize_tool_guidelines(guidelines_32768,name,sanitized));
} else {
}
} else {
}

return tool;
});
knoxx.backend.extern.tools.sanitize_custom_tools = (function knoxx$backend$extern$tools$sanitize_custom_tools(tools){
return cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.tools.sanitize_custom_tool_name,knoxx.backend.extern.tools.js_array_seq(tools)));
});
knoxx.backend.extern.tools.filter_custom_tools_by_allow_set = (function knoxx$backend$extern$tools$filter_custom_tools_by_allow_set(tools,allowed_tool_ids){
if((allowed_tool_ids == null)){
return tools;
} else {
return cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (tool){
var runtime_id = (function (){var G__32723 = tool;
var G__32723__$1 = (((G__32723 == null))?null:(G__32723["name"]));
var G__32723__$2 = (((G__32723__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32723__$1)));
var G__32723__$3 = (((G__32723__$2 == null))?null:clojure.string.trim(G__32723__$2));
if((G__32723__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__32723__$3);
}
})();
var original_id = (function (){var G__32725 = tool;
var G__32725__$1 = (((G__32725 == null))?null:(G__32725["originalName"]));
var G__32725__$2 = (((G__32725__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32725__$1)));
var G__32725__$3 = (((G__32725__$2 == null))?null:clojure.string.trim(G__32725__$2));
if((G__32725__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__32725__$3);
}
})();
var or__5162__auto__ = (function (){var and__5160__auto__ = runtime_id;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(allowed_tool_ids,runtime_id);
} else {
return and__5160__auto__;
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var and__5160__auto__ = original_id;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(allowed_tool_ids,original_id);
} else {
return and__5160__auto__;
}
}
}),knoxx.backend.extern.tools.js_array_seq(tools)));
}
});
knoxx.backend.extern.tools.parse_json = (function knoxx$backend$extern$tools$parse_json(text){
try{return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(text),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e32729){var err = e32729;
throw (new Error((""+"Invalid JSON: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))));
}});

//# sourceMappingURL=knoxx.backend.extern.tools.js.map
