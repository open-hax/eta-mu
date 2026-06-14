import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.openplanner.memory.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
goog.provide('knoxx.backend.infra.openplanner.semantic');
knoxx.backend.infra.openplanner.semantic.query_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query","query",-1288509510),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Natural-language semantic search query for the active Knoxx corpus."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"topK","topK",939681881),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum number of matches to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1),new cljs.core.Keyword(null,"max","max",61366548),(10)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maxSnippetChars","maxSnippetChars",190771964),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum snippet length per hit."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(160),new cljs.core.Keyword(null,"max","max",61366548),(1200)], null)], null)], null)], null);
knoxx.backend.infra.openplanner.semantic.bounded_score = (function knoxx$backend$infra$openplanner$semantic$bounded_score(distance){
if(typeof distance === 'number'){
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),((1) - cljs.core.min.cljs$core$IFn$_invoke$arity$2((1),distance)));
} else {
return (0);
}
});
knoxx.backend.infra.openplanner.semantic.metadata_value = (function knoxx$backend$infra$openplanner$semantic$metadata_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27562 = arguments.length;
var i__5898__auto___27563 = (0);
while(true){
if((i__5898__auto___27563 < len__5897__auto___27562)){
args__5903__auto__.push((arguments[i__5898__auto___27563]));

var G__27564 = (i__5898__auto___27563 + (1));
i__5898__auto___27563 = G__27564;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.infra.openplanner.semantic.metadata_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.infra.openplanner.semantic.metadata_value.cljs$core$IFn$_invoke$arity$variadic = (function (metadata,keys){
return cljs.core.some((function (k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(metadata,k);
}),keys);
}));

(knoxx.backend.infra.openplanner.semantic.metadata_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.infra.openplanner.semantic.metadata_value.cljs$lang$applyTo = (function (seq27496){
var G__27497 = cljs.core.first(seq27496);
var seq27496__$1 = cljs.core.next(seq27496);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27497,seq27496__$1);
}));

knoxx.backend.infra.openplanner.semantic.semantic_hit_path = (function knoxx$backend$infra$openplanner$semantic$semantic_hit_path(hit){
var metadata = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"metadata","metadata",1799301597).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.openplanner.semantic.metadata_value.cljs$core$IFn$_invoke$arity$variadic(metadata,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"sourcePath","sourcePath",-986600405),new cljs.core.Keyword(null,"source-path","source-path",-1955873712),new cljs.core.Keyword(null,"source_path","source_path",1529271565),new cljs.core.Keyword(null,"relativePath","relativePath",-608773918),new cljs.core.Keyword(null,"relative-path","relative-path",1848635172),new cljs.core.Keyword(null,"relative_path","relative_path",-1139247997),new cljs.core.Keyword(null,"filePath","filePath",688035028),new cljs.core.Keyword(null,"file-path","file-path",-2005501162),new cljs.core.Keyword(null,"file_path","file_path",-1069511467),new cljs.core.Keyword(null,"path","path",-188191168),new cljs.core.Keyword(null,"file","file",-1269645878),new cljs.core.Keyword(null,"title","title",636505583)], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})()));
});
knoxx.backend.infra.openplanner.semantic.semantic_hit_chunk_count = (function knoxx$backend$infra$openplanner$semantic$semantic_hit_chunk_count(metadata){
var or__5162__auto__ = knoxx.backend.infra.openplanner.semantic.metadata_value.cljs$core$IFn$_invoke$arity$variadic(metadata,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"chunkCount","chunkCount",1427535666),new cljs.core.Keyword(null,"chunk-count","chunk-count",-26830730),new cljs.core.Keyword(null,"chunk_count","chunk_count",219819421),new cljs.core.Keyword(null,"chunks","chunks",83720431)], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
});
knoxx.backend.infra.openplanner.semantic.semantic_hit_result = (function knoxx$backend$infra$openplanner$semantic$semantic_hit_result(max_snippet_chars,hit){
var metadata = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"metadata","metadata",1799301597).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(hit),new cljs.core.Keyword(null,"path","path",-188191168),knoxx.backend.infra.openplanner.semantic.semantic_hit_path(hit),new cljs.core.Keyword(null,"score","score",-1963588780),knoxx.backend.infra.openplanner.semantic.bounded_score(new cljs.core.Keyword(null,"distance","distance",-1671893894).cljs$core$IFn$_invoke$arity$1(hit)),new cljs.core.Keyword(null,"distance","distance",-1671893894),new cljs.core.Keyword(null,"distance","distance",-1671893894).cljs$core$IFn$_invoke$arity$1(hit),new cljs.core.Keyword(null,"indexed","indexed",390758624),true,new cljs.core.Keyword(null,"chunkCount","chunkCount",1427535666),knoxx.backend.infra.openplanner.semantic.semantic_hit_chunk_count(metadata),new cljs.core.Keyword(null,"snippet","snippet",953581994),cljs.core.first(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"document","document",-1329188687).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),max_snippet_chars)),new cljs.core.Keyword(null,"metadata","metadata",1799301597),metadata], null);
});
/**
 * Search OpenPlanner for passive semantic hydration and return the legacy
 * document-result shape expected by agent hydration. Returns a Promise.
 */
knoxx.backend.infra.openplanner.semantic.semantic_search_documents_BANG_ = (async function knoxx$backend$infra$openplanner$semantic$semantic_search_documents_BANG_(_runtime,config,p__27520,_auth_context){
var map__27521 = p__27520;
var map__27521__$1 = cljs.core.__destructure_map(map__27521);
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27521__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
var top_k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27521__$1,new cljs.core.Keyword(null,"top-k","top-k",-1255881544));
var max_snippet_chars = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27521__$1,new cljs.core.Keyword(null,"max-snippet-chars","max-snippet-chars",785562463));
var k = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((10),(await (async function (){var or__5162__auto__ = top_k;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (5);
}
})())));
var max_snippet_chars__$1 = cljs.core.max.cljs$core$IFn$_invoke$arity$2((160),cljs.core.min.cljs$core$IFn$_invoke$arity$2((1200),(await (async function (){var or__5162__auto__ = max_snippet_chars;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (240);
}
})())));
var result = (await knoxx.backend.infra.openplanner.memory.openplanner_semantic_search_BANG_(config,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"k","k",-2146297393),k], null)));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"database","database",1849087575),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"name","name",1843675177),"OpenPlanner"], null),new cljs.core.Keyword(null,"results","results",-1134170113),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.openplanner.semantic.semantic_hit_result,max_snippet_chars__$1),cljs.core.take.cljs$core$IFn$_invoke$arity$2(k,new cljs.core.Keyword(null,"hits","hits",-2120002930).cljs$core$IFn$_invoke$arity$1(result)))], null);
});
knoxx.backend.infra.openplanner.semantic.semantic_query_execute = (async function knoxx$backend$infra$openplanner$semantic$semantic_query_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var query = (await (async function (){var or__5162__auto__ = (params["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var top_k = (await (async function (){var or__5162__auto__ = (params["topK"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["top_k"]);
}
})());
var max_snippet_chars = (await (async function (){var or__5162__auto__ = (params["maxSnippetChars"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["max_snippet_chars"]);
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Searching corpus via OpenPlanner\u2026");

var result = (await knoxx.backend.infra.openplanner.semantic.semantic_search_documents_BANG_(runtime,config,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"top-k","top-k",-1255881544),(await (async function (){var or__5162__auto__ = top_k;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (5);
}
})()),new cljs.core.Keyword(null,"max-snippet-chars","max-snippet-chars",785562463),(await (async function (){var or__5162__auto__ = max_snippet_chars;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (600);
}
})())], null),null));
return knoxx.backend.domain.text.tool_text_result(knoxx.backend.domain.text.semantic_search_result_text(result),result);
});
knoxx.backend.infra.openplanner.semantic.semantic_query_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"semantic_query","Semantic Query","Search the active Knoxx knowledge corpus for semantically relevant documents and snippets.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Search the active Knoxx corpus by meaning and retrieve the most relevant documents/snippets.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use semantic_query when you need grounded workspace knowledge beyond what passive hydration already exposed.","Prefer semantic_query over guessing when the answer may live in notes, uploaded documents, or indexed corpus files.","Follow semantic_query with semantic_read when one result looks promising and you need exact source text."], null),knoxx.backend.infra.openplanner.semantic.query_params,knoxx.backend.infra.openplanner.semantic.semantic_query_execute], 0));
knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools = (function knoxx$backend$infra$openplanner$semantic$create_semantic_custom_tools(var_args){
var G__27553 = arguments.length;
switch (G__27553) {
case 2:
return knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(((((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,"semantic_query"))))?knoxx.backend.infra.openplanner.semantic.semantic_query_tool(runtime,config):null)], null))));
}));

(knoxx.backend.infra.openplanner.semantic.create_semantic_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.openplanner.semantic.js.map
