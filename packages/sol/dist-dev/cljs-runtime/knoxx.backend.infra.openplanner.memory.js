import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.stores.session_store_registry.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.shape.session_persistence.js";
import "./knoxx.backend.extern.fastify.js";
import "./knoxx.backend.extern.promise.js";
import "./knoxx.backend.domain.label.quality.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.domain.graph.expansion_policy.js";
import "./knoxx.backend.domain.graph.policy_registry.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.openplanner.memory');
knoxx.backend.infra.openplanner.memory.openplanner_configured_QMARK_ = (function knoxx$backend$infra$openplanner$memory$openplanner_configured_QMARK_(config){
return knoxx.backend.infra.clients.openplanner.enabled_QMARK_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config));
});
knoxx.backend.infra.openplanner.memory.request_query_map = (function knoxx$backend$infra$openplanner$memory$request_query_map(request){
return knoxx.backend.extern.fastify.request_query_string_map(request);
});
/**
 * Infer document kind from file extension for OpenPlanner indexing.
 */
knoxx.backend.infra.openplanner.memory.guess_document_kind = (function knoxx$backend$infra$openplanner$memory$guess_document_kind(rel_path){
var ext = (function (){var G__26903 = clojure.string.lower_case(rel_path);
var G__26903__$1 = (((G__26903 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__26903,/\./));
if((G__26903__$1 == null)){
return null;
} else {
return cljs.core.last(G__26903__$1);
}
})();
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 15, ["js",null,"cljc",null,"rs",null,"ts",null,"mjs",null,"py",null,"cljs",null,"cjs",null,"clj",null,"java",null,"jsx",null,"php",null,"go",null,"tsx",null,"rb",null], null), null),ext)){
return "code";
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["md",null,"rst",null,"txt",null,"mdx",null,"adoc",null], null), null),ext)){
return "docs";
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 7, ["json",null,"toml",null,"yml",null,"yaml",null,"conf",null,"env",null,"ini",null], null), null),ext)){
return "config";
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["xml",null,"csv",null,"tsv",null,"sql",null], null), null),ext)){
return "data";
} else {
return "docs";

}
}
}
}
});
/**
 * Send a document to OpenPlanner's /v1/documents endpoint for indexing.
 * Returns {:ok true, :document ...} on success, or {:ok false ...} on failure.
 */
knoxx.backend.infra.openplanner.memory.upsert_openplanner_document_BANG_ = (async function knoxx$backend$infra$openplanner$memory$upsert_openplanner_document_BANG_(config,p__26927){
var map__26928 = p__26927;
var map__26928__$1 = cljs.core.__destructure_map(map__26928);
var domain = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"domain","domain",1847214937));
var rel_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"rel-path","rel-path",593215642));
var visibility = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"visibility","visibility",1338380893));
var content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"content","content",15833224));
var extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"extra","extra",1612569067));
var title = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"title","title",636505583));
var source_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"source-path","source-path",-1955873712));
var project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"project","project",1124394579));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26928__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
if(cljs.core.truth_(knoxx.backend.infra.openplanner.memory.openplanner_configured_QMARK_(config))){
} else {
throw (new Error("OpenPlanner is not configured"));
}

var doc_id = (await (async function (){var or__5162__auto__ = id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"knoxx-doc:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto____$1 = rel_path;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return crypto.randomUUID();
}
})())));
}
})());
var doc_kind = (await (async function (){var or__5162__auto__ = kind;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.openplanner.memory.guess_document_kind(rel_path);
}
})());
var doc_title = (await (async function (){var or__5162__auto__ = title;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (await (async function (){var G__26987 = rel_path;
var G__26987__$1 = (((G__26987 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__26987,/\//));
if((G__26987__$1 == null)){
return null;
} else {
return cljs.core.last(G__26987__$1);
}
})());
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return doc_id;
}
}
})());
var doc_content = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = content;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var doc_project = (await (async function (){var or__5162__auto__ = project;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "workspace";
}
}
})());
var payload = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"document","document",-1329188687),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"createdBy","createdBy",-1784489851),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"sourcePath","sourcePath",-986600405),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"language","language",-1591107564),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"domain","domain",1847214937),new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword(null,"visibility","visibility",1338380893)],["knoxx-ingestion",doc_content,(await (async function (){var or__5162__auto__ = source_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return rel_path;
}
})()),"knoxx-ingestion",doc_title,doc_project,"en",doc_id,doc_kind,(await (async function (){var or__5162__auto__ = domain;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "general";
}
})()),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"indexed_from","indexed_from",218689940),"knoxx"], null),extra], 0)),(await (async function (){var or__5162__auto__ = visibility;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "internal";
}
})())])], null);
try{var resp = (await knoxx.backend.infra.clients.openplanner.upsert_document_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"document","document",-1329188687).cljs$core$IFn$_invoke$arity$1(payload)));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"document","document",-1329188687),new cljs.core.Keyword(null,"document","document",-1329188687).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"indexed","indexed",390758624),new cljs.core.Keyword(null,"indexed","indexed",390758624).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"rel-path","rel-path",593215642),rel_path], null);
}catch (e27001){var err = e27001;
console.warn("[knoxx] failed to index document into OpenPlanner:",rel_path,err);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),new cljs.core.Keyword(null,"rel-path","rel-path",593215642),rel_path], null);
}});
/**
 * Ingest multiple documents into OpenPlanner with concurrency control.
 * Returns {:ok true, :indexed [...], :failed [...]} summary.
 */
knoxx.backend.infra.openplanner.memory.batch_upsert_openplanner_documents_BANG_ = (async function knoxx$backend$infra$openplanner$memory$batch_upsert_openplanner_documents_BANG_(config,documents,p__27003){
var map__27004 = p__27003;
var map__27004__$1 = cljs.core.__destructure_map(map__27004);
var concurrency = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27004__$1,new cljs.core.Keyword(null,"concurrency","concurrency",595096228),(3));
var project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27004__$1,new cljs.core.Keyword(null,"project","project",1124394579));
var visibility = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27004__$1,new cljs.core.Keyword(null,"visibility","visibility",1338380893),"internal");
var extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27004__$1,new cljs.core.Keyword(null,"extra","extra",1612569067));
if(cljs.core.empty_QMARK_(documents)){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"failed","failed",-1397425762),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"total","total",1916810418),(0),new cljs.core.Keyword(null,"indexed-count","indexed-count",822648260),(0),new cljs.core.Keyword(null,"failed-count","failed-count",-366647954),(0)], null);
} else {
if(cljs.core.not(knoxx.backend.infra.openplanner.memory.openplanner_configured_QMARK_(config))){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"failed","failed",-1397425762),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"total","total",1916810418),cljs.core.count(documents),new cljs.core.Keyword(null,"indexed-count","indexed-count",822648260),(0),new cljs.core.Keyword(null,"failed-count","failed-count",-366647954),cljs.core.count(documents),new cljs.core.Keyword(null,"error","error",-978969032),"OpenPlanner is not configured"], null);
} else {
var chunks = cljs.core.vec(cljs.core.partition_all.cljs$core$IFn$_invoke$arity$2(concurrency,documents));
var results = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"failed","failed",-1397425762),cljs.core.PersistentVector.EMPTY], null));
var process_chunk_BANG_ = (async function (chunk){
var chunk_results = (await knoxx.backend.extern.promise.all_vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (doc){
return knoxx.backend.infra.openplanner.memory.upsert_openplanner_document_BANG_(config,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"project","project",1124394579),project,new cljs.core.Keyword(null,"visibility","visibility",1338380893),visibility,new cljs.core.Keyword(null,"extra","extra",1612569067),extra], null),doc], 0)));
}),chunk)));
var seq__27007_27204 = cljs.core.seq(chunk_results);
var chunk__27008_27205 = null;
var count__27009_27206 = (0);
var i__27010_27207 = (0);
while(true){
if((i__27010_27207 < count__27009_27206)){
var result_27208 = chunk__27008_27205.cljs$core$IIndexed$_nth$arity$2(null,i__27010_27207);
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(result_27208))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.update,new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result_27208], 0));
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.update,new cljs.core.Keyword(null,"failed","failed",-1397425762),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result_27208], 0));
}


var G__27209 = seq__27007_27204;
var G__27210 = chunk__27008_27205;
var G__27211 = count__27009_27206;
var G__27212 = (i__27010_27207 + (1));
seq__27007_27204 = G__27209;
chunk__27008_27205 = G__27210;
count__27009_27206 = G__27211;
i__27010_27207 = G__27212;
continue;
} else {
var temp__5825__auto___27214 = cljs.core.seq(seq__27007_27204);
if(temp__5825__auto___27214){
var seq__27007_27215__$1 = temp__5825__auto___27214;
if(cljs.core.chunked_seq_QMARK_(seq__27007_27215__$1)){
var c__5694__auto___27216 = cljs.core.chunk_first(seq__27007_27215__$1);
var G__27217 = cljs.core.chunk_rest(seq__27007_27215__$1);
var G__27218 = c__5694__auto___27216;
var G__27219 = cljs.core.count(c__5694__auto___27216);
var G__27220 = (0);
seq__27007_27204 = G__27217;
chunk__27008_27205 = G__27218;
count__27009_27206 = G__27219;
i__27010_27207 = G__27220;
continue;
} else {
var result_27221 = cljs.core.first(seq__27007_27215__$1);
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(result_27221))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.update,new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result_27221], 0));
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.update,new cljs.core.Keyword(null,"failed","failed",-1397425762),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result_27221], 0));
}


var G__27222 = cljs.core.next(seq__27007_27215__$1);
var G__27223 = null;
var G__27224 = (0);
var G__27225 = (0);
seq__27007_27204 = G__27222;
chunk__27008_27205 = G__27223;
count__27009_27206 = G__27224;
i__27010_27207 = G__27225;
continue;
}
} else {
}
}
break;
}

return null;
});
var seq__27019_27226 = cljs.core.seq(chunks);
var chunk__27020_27227 = null;
var count__27021_27228 = (0);
var i__27022_27229 = (0);
while(true){
if((i__27022_27229 < count__27021_27228)){
var chunk_27231 = chunk__27020_27227.cljs$core$IIndexed$_nth$arity$2(null,i__27022_27229);
(await process_chunk_BANG_(chunk_27231));


var G__27232 = seq__27019_27226;
var G__27233 = chunk__27020_27227;
var G__27234 = count__27021_27228;
var G__27235 = (i__27022_27229 + (1));
seq__27019_27226 = G__27232;
chunk__27020_27227 = G__27233;
count__27021_27228 = G__27234;
i__27022_27229 = G__27235;
continue;
} else {
var temp__5825__auto___27236 = cljs.core.seq(seq__27019_27226);
if(temp__5825__auto___27236){
var seq__27019_27237__$1 = temp__5825__auto___27236;
if(cljs.core.chunked_seq_QMARK_(seq__27019_27237__$1)){
var c__5694__auto___27238 = cljs.core.chunk_first(seq__27019_27237__$1);
var G__27239 = cljs.core.chunk_rest(seq__27019_27237__$1);
var G__27240 = c__5694__auto___27238;
var G__27241 = cljs.core.count(c__5694__auto___27238);
var G__27242 = (0);
seq__27019_27226 = G__27239;
chunk__27020_27227 = G__27240;
count__27021_27228 = G__27241;
i__27022_27229 = G__27242;
continue;
} else {
var chunk_27243 = cljs.core.first(seq__27019_27237__$1);
(await process_chunk_BANG_(chunk_27243));


var G__27244 = cljs.core.next(seq__27019_27237__$1);
var G__27245 = null;
var G__27246 = (0);
var G__27247 = (0);
seq__27019_27226 = G__27244;
chunk__27020_27227 = G__27245;
count__27021_27228 = G__27246;
i__27022_27229 = G__27247;
continue;
}
} else {
}
}
break;
}

return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"indexed","indexed",390758624),new cljs.core.Keyword(null,"indexed","indexed",390758624).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(results)),new cljs.core.Keyword(null,"failed","failed",-1397425762),new cljs.core.Keyword(null,"failed","failed",-1397425762).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(results)),new cljs.core.Keyword(null,"total","total",1916810418),cljs.core.count(documents),new cljs.core.Keyword(null,"indexed-count","indexed-count",822648260),cljs.core.count(new cljs.core.Keyword(null,"indexed","indexed",390758624).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(results))),new cljs.core.Keyword(null,"failed-count","failed-count",-366647954),cljs.core.count(new cljs.core.Keyword(null,"failed","failed",-1397425762).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(results)))], null);

}
}
});
knoxx.backend.infra.openplanner.memory.planner_row_timestamp_ms = (function knoxx$backend$infra$openplanner$memory$planner_row_timestamp_ms(row){
var ts = new cljs.core.Keyword(null,"ts","ts",1617209904).cljs$core$IFn$_invoke$arity$1(row);
if(typeof ts === 'number'){
return ts;
} else {
if(typeof ts === 'string'){
var parsed = Date.parse(ts);
if(cljs.core.truth_(isNaN(parsed))){
return Date.now();
} else {
return parsed;
}
} else {
return Date.now();

}
}
});
knoxx.backend.infra.openplanner.memory.planner_row__GT_agent_message = (function knoxx$backend$infra$openplanner$memory$planner_row__GT_agent_message(row){
var role = (function (){var G__27037 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(row);
if((G__27037 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27037));
}
})();
var text = (function (){var G__27039 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(row);
if((G__27039 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27039));
}
})();
var parts = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(row,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(row,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667)], null));
}
})();
if(((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["user",null,"assistant",null,"system",null], null), null),role)) && ((!(clojure.string.blank_QMARK_(text)))))){
var text_block = ({"type": "text", "text": text});
var content_arr = ((cljs.core.seq(parts))?cljs.core.clj__GT_js(cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [text_block], null),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("image",new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(p))){
return ({"type": "image_url", "image_url": ({"url": (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(p))+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p)));
}
})()})});
} else {
return ({"type": "text", "text": (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()});
}
}),parts))):[text_block]);
return ({"role": role, "content": content_arr, "timestamp": knoxx.backend.infra.openplanner.memory.planner_row_timestamp_ms(row)});
} else {
return null;
}
});
knoxx.backend.infra.openplanner.memory.rehydrate_session_manager_BANG_ = (async function knoxx$backend$infra$openplanner$memory$rehydrate_session_manager_BANG_(config,session_manager,conversation_id,_model_id){
if(((clojure.string.blank_QMARK_(conversation_id)) || (cljs.core.not(knoxx.backend.infra.openplanner.memory.openplanner_configured_QMARK_(config))))){
return session_manager;
} else {
try{var body = (await knoxx.backend.infra.clients.openplanner.session_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),conversation_id,null));
var seq__27047_27249 = cljs.core.seq((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var chunk__27048_27250 = null;
var count__27049_27251 = (0);
var i__27050_27252 = (0);
while(true){
if((i__27050_27252 < count__27049_27251)){
var row_27253 = chunk__27048_27250.cljs$core$IIndexed$_nth$arity$2(null,i__27050_27252);
var temp__5825__auto___27254 = knoxx.backend.infra.openplanner.memory.planner_row__GT_agent_message(row_27253);
if(cljs.core.truth_(temp__5825__auto___27254)){
var message_27255 = temp__5825__auto___27254;
session_manager.appendMessage(message_27255);
} else {
}


var G__27256 = seq__27047_27249;
var G__27257 = chunk__27048_27250;
var G__27258 = count__27049_27251;
var G__27259 = (i__27050_27252 + (1));
seq__27047_27249 = G__27256;
chunk__27048_27250 = G__27257;
count__27049_27251 = G__27258;
i__27050_27252 = G__27259;
continue;
} else {
var temp__5825__auto___27260 = cljs.core.seq(seq__27047_27249);
if(temp__5825__auto___27260){
var seq__27047_27261__$1 = temp__5825__auto___27260;
if(cljs.core.chunked_seq_QMARK_(seq__27047_27261__$1)){
var c__5694__auto___27262 = cljs.core.chunk_first(seq__27047_27261__$1);
var G__27263 = cljs.core.chunk_rest(seq__27047_27261__$1);
var G__27264 = c__5694__auto___27262;
var G__27265 = cljs.core.count(c__5694__auto___27262);
var G__27266 = (0);
seq__27047_27249 = G__27263;
chunk__27048_27250 = G__27264;
count__27049_27251 = G__27265;
i__27050_27252 = G__27266;
continue;
} else {
var row_27267 = cljs.core.first(seq__27047_27261__$1);
var temp__5825__auto___27268__$1 = knoxx.backend.infra.openplanner.memory.planner_row__GT_agent_message(row_27267);
if(cljs.core.truth_(temp__5825__auto___27268__$1)){
var message_27269 = temp__5825__auto___27268__$1;
session_manager.appendMessage(message_27269);
} else {
}


var G__27270 = cljs.core.next(seq__27047_27261__$1);
var G__27271 = null;
var G__27272 = (0);
var G__27273 = (0);
seq__27047_27249 = G__27270;
chunk__27048_27250 = G__27271;
count__27049_27251 = G__27272;
i__27050_27252 = G__27273;
continue;
}
} else {
}
}
break;
}

return session_manager;
}catch (e27045){var err = e27045;
console.warn("[knoxx] failed to rehydrate session from OpenPlanner",err);

return session_manager;
}}
});
knoxx.backend.infra.openplanner.memory.first_result_array = (function knoxx$backend$infra$openplanner$memory$first_result_array(value){
var items = (function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var first_item = cljs.core.first(items);
if(cljs.core.sequential_QMARK_(first_item)){
return cljs.core.vec(first_item);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.infra.openplanner.memory.vector_result_hits = (function knoxx$backend$infra$openplanner$memory$vector_result_hits(result){
var ids = knoxx.backend.infra.openplanner.memory.first_result_array(new cljs.core.Keyword(null,"ids","ids",-998535796).cljs$core$IFn$_invoke$arity$1(result));
var docs = knoxx.backend.infra.openplanner.memory.first_result_array(new cljs.core.Keyword(null,"documents","documents",-1582333455).cljs$core$IFn$_invoke$arity$1(result));
var metas = knoxx.backend.infra.openplanner.memory.first_result_array(new cljs.core.Keyword(null,"metadatas","metadatas",-1319371457).cljs$core$IFn$_invoke$arity$1(result));
var distances = knoxx.backend.infra.openplanner.memory.first_result_array(new cljs.core.Keyword(null,"distances","distances",-1026444268).cljs$core$IFn$_invoke$arity$1(result));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$3((function (idx,id){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"document","document",-1329188687),cljs.core.nth.cljs$core$IFn$_invoke$arity$3(docs,idx,""),new cljs.core.Keyword(null,"metadata","metadata",1799301597),cljs.core.nth.cljs$core$IFn$_invoke$arity$3(metas,idx,cljs.core.PersistentArrayMap.EMPTY),new cljs.core.Keyword(null,"distance","distance",-1671893894),cljs.core.nth.cljs$core$IFn$_invoke$arity$3(distances,idx,null)], null);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(ids)),ids);
});
knoxx.backend.infra.openplanner.memory.hit_metadata = (function knoxx$backend$infra$openplanner$memory$hit_metadata(hit){
var or__5162__auto__ = new cljs.core.Keyword(null,"metadata","metadata",1799301597).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = hit;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
});
knoxx.backend.infra.openplanner.memory.hit_text = (function knoxx$backend$infra$openplanner$memory$hit_text(hit){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"snippet","snippet",953581994).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"document","document",-1329188687).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})()));
});
knoxx.backend.infra.openplanner.memory.reasoning_memory_hit_QMARK_ = (function knoxx$backend$infra$openplanner$memory$reasoning_memory_hit_QMARK_(hit){
var metadata = knoxx.backend.infra.openplanner.memory.hit_metadata(hit);
var kind = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
var role = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
var id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"parent_id","parent_id",-1999171020).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"parent-id","parent-id",-1400729131).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})()));
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"knoxx.reasoning")) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,"reasoning")) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"node_type","node_type",-1629889898).cljs$core$IFn$_invoke$arity$1(metadata),"reasoning")) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"node-type","node-type",129492462).cljs$core$IFn$_invoke$arity$1(metadata),"reasoning")) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(role,"reasoning")) || (clojure.string.includes_QMARK_(id,":reasoning")))))))))));
});
knoxx.backend.infra.openplanner.memory.operational_failure_memory_hit_QMARK_ = (function knoxx$backend$infra$openplanner$memory$operational_failure_memory_hit_QMARK_(hit){
var text = knoxx.backend.infra.openplanner.memory.hit_text(hit);
return cljs.core.boolean$((function (){var or__5162__auto__ = cljs.core.re_find(/\b403\s+No upstream providers are allowed\b/i,text);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.re_find(/\bNo upstream providers are allowed for this tenant and request\b/i,text);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.re_find(/\bprovider_not_allowed\b/i,text);
}
}
})());
});
knoxx.backend.infra.openplanner.memory.default_memory_hit_QMARK_ = (function knoxx$backend$infra$openplanner$memory$default_memory_hit_QMARK_(hit){
return (((!(knoxx.backend.infra.openplanner.memory.reasoning_memory_hit_QMARK_(hit)))) && ((((!(knoxx.backend.infra.openplanner.memory.operational_failure_memory_hit_QMARK_(hit)))) && (knoxx.backend.domain.label.quality.not_bad_QMARK_(hit)))));
});
knoxx.backend.infra.openplanner.memory.default_memory_hits = (function knoxx$backend$infra$openplanner$memory$default_memory_hits(hits,limit){
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(limit,knoxx.backend.domain.label.quality.good_first_then_not_bad(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.openplanner.memory.default_memory_hit_QMARK_,(function (){var or__5162__auto__ = hits;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
});
knoxx.backend.infra.openplanner.memory.fetch_session_summary_BANG_ = (async function knoxx$backend$infra$openplanner$memory$fetch_session_summary_BANG_(config,session_id){
var rows = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1((await knoxx.backend.infra.clients.openplanner.session_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),session_id,null)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var row = (await (async function (){var or__5162__auto__ = cljs.core.last(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27083_SHARP_){
return ((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["assistant",null,"system",null], null), null),new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__27083_SHARP_))) && (knoxx.backend.infra.openplanner.memory.default_memory_hit_QMARK_(p1__27083_SHARP_)));
}),rows));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.last(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.openplanner.memory.default_memory_hit_QMARK_,rows));
}
})());
if(cljs.core.truth_(row)){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(row)], null);
} else {
return null;
}
});
knoxx.backend.infra.openplanner.memory.openplanner_recent_session_summaries_BANG_ = (async function knoxx$backend$infra$openplanner$memory$openplanner_recent_session_summaries_BANG_(config){
var session_ids = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2((4),cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session","session",1008279103),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1((await knoxx.backend.infra.clients.openplanner.sessions_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config)], null))));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))))));
if(cljs.core.seq(session_ids)){
var results = (await knoxx.backend.extern.promise.all_vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__27087_SHARP_){
return knoxx.backend.infra.openplanner.memory.fetch_session_summary_BANG_(config,p1__27087_SHARP_);
}),session_ids)));
return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,results));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.infra.openplanner.memory.openplanner_memory_search_BANG_ = (async function knoxx$backend$infra$openplanner$memory$openplanner_memory_search_BANG_(config,p__27089){
var map__27090 = p__27089;
var map__27090__$1 = cljs.core.__destructure_map(map__27090);
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27090__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
var k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27090__$1,new cljs.core.Keyword(null,"k","k",-2146297393));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27090__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));

var query__$1 = clojure.string.trim((await (async function (){var or__5162__auto__ = query;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var map__27094 = knoxx.backend.domain.graph.expansion_policy.bounded_search_params(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$0(),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"k","k",-2146297393),k], null));
var map__27094__$1 = cljs.core.__destructure_map(map__27094);
var k__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27094__$1,new cljs.core.Keyword(null,"k","k",-2146297393));
var fetch_k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27094__$1,new cljs.core.Keyword(null,"fetch-k","fetch-k",1709948293));
if(clojure.string.blank_QMARK_(query__$1)){
throw Error("Must provide query string for memory search");
} else {
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),query__$1,new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.Keyword(null,"hits","hits",-2120002930),knoxx.backend.infra.openplanner.memory.default_memory_hits(knoxx.backend.infra.openplanner.memory.vector_result_hits(new cljs.core.Keyword(null,"result","result",1415092211).cljs$core$IFn$_invoke$arity$1((await knoxx.backend.infra.clients.openplanner.vector_search_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),(await (async function (){var G__27096 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"q","q",689001697),query__$1,new cljs.core.Keyword(null,"k","k",-2146297393),fetch_k,new cljs.core.Keyword(null,"source","source",-433931539),"knoxx",new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config)], null);
if((!(clojure.string.blank_QMARK_(session_id)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27096,new cljs.core.Keyword(null,"session","session",1008279103),session_id);
} else {
return G__27096;
}
})()))))),k__$1)], null);
}
});
knoxx.backend.infra.openplanner.memory.openplanner_graph_query_BANG_ = (function knoxx$backend$infra$openplanner$memory$openplanner_graph_query_BANG_(config,p__27099){
var map__27100 = p__27099;
var map__27100__$1 = cljs.core.__destructure_map(map__27100);
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27100__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
var lake = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27100__$1,new cljs.core.Keyword(null,"lake","lake",805586599));
var node_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27100__$1,new cljs.core.Keyword(null,"node-type","node-type",129492462));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27100__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var edge_limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27100__$1,new cljs.core.Keyword(null,"edge-limit","edge-limit",4816756));
var map__27101 = knoxx.backend.domain.graph.expansion_policy.bounded_expand_params(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$0(),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"edge-limit","edge-limit",4816756),edge_limit], null));
var map__27101__$1 = cljs.core.__destructure_map(map__27101);
var limit__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27101__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var max_cost = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27101__$1,new cljs.core.Keyword(null,"max-cost","max-cost",-2074270100));
var node_types = ((clojure.string.blank_QMARK_((function (){var or__5162__auto__ = node_type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))?null:cljs.core.vec(clojure.string.split.cljs$core$IFn$_invoke$arity$2(node_type,/,/)));
var lakes = ((clojure.string.blank_QMARK_((function (){var or__5162__auto__ = lake;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))?null:cljs.core.vec(clojure.string.split.cljs$core$IFn$_invoke$arity$2(lake,/,/)));
return knoxx.backend.infra.clients.openplanner.graph_memory_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),(function (){var G__27102 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"q","q",689001697),(function (){var or__5162__auto__ = query;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"k","k",-2146297393),limit__$1,new cljs.core.Keyword(null,"includeText","includeText",-1104106275),true], null);
var G__27102__$1 = (cljs.core.truth_(node_types)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27102,new cljs.core.Keyword(null,"nodeTypes","nodeTypes",1617837637),node_types):G__27102);
var G__27102__$2 = (cljs.core.truth_(lakes)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27102__$1,new cljs.core.Keyword(null,"lakes","lakes",-1032595818),lakes):G__27102__$1);
if(cljs.core.truth_(max_cost)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27102__$2,new cljs.core.Keyword(null,"maxCost","maxCost",-1281687611),max_cost);
} else {
return G__27102__$2;
}
})());
});
knoxx.backend.infra.openplanner.memory.openplanner_semantic_search_BANG_ = (async function knoxx$backend$infra$openplanner$memory$openplanner_semantic_search_BANG_(config,p__27108){
var map__27109 = p__27108;
var map__27109__$1 = cljs.core.__destructure_map(map__27109);
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27109__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
var k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27109__$1,new cljs.core.Keyword(null,"k","k",-2146297393));
var project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27109__$1,new cljs.core.Keyword(null,"project","project",1124394579));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27109__$1,new cljs.core.Keyword(null,"source","source",-433931539));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27109__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var visibility = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27109__$1,new cljs.core.Keyword(null,"visibility","visibility",1338380893));
var query__$1 = clojure.string.trim((await (async function (){var or__5162__auto__ = query;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var k__$1 = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),cljs.core.min.cljs$core$IFn$_invoke$arity$2((20),(await (async function (){var or__5162__auto__ = k;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (10);
}
})())));
if(clojure.string.blank_QMARK_(query__$1)){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),"",new cljs.core.Keyword(null,"hits","hits",-2120002930),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"none","none",1333468478)], null);
} else {
var body = (await knoxx.backend.infra.clients.openplanner.vector_search_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),(await (async function (){var G__27113 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"q","q",689001697),query__$1,new cljs.core.Keyword(null,"k","k",-2146297393),k__$1,new cljs.core.Keyword(null,"project","project",1124394579),(await (async function (){var or__5162__auto__ = project;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "workspace";
}
}
})())], null);
var G__27113__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27113,new cljs.core.Keyword(null,"source","source",-433931539),source):G__27113);
var G__27113__$2 = (cljs.core.truth_(kind)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27113__$1,new cljs.core.Keyword(null,"kind","kind",-717265803),kind):G__27113__$1);
if(cljs.core.truth_(visibility)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27113__$2,new cljs.core.Keyword(null,"visibility","visibility",1338380893),visibility);
} else {
return G__27113__$2;
}
})())));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),query__$1,new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.Keyword(null,"hits","hits",-2120002930),knoxx.backend.infra.openplanner.memory.vector_result_hits(new cljs.core.Keyword(null,"result","result",1415092211).cljs$core$IFn$_invoke$arity$1(body))], null);
}
});
knoxx.backend.infra.openplanner.memory.openplanner_graph_export_BANG_ = (function knoxx$backend$infra$openplanner$memory$openplanner_graph_export_BANG_(config,request){
return knoxx.backend.infra.clients.openplanner.graph_export_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),knoxx.backend.infra.openplanner.memory.request_query_map(request));
});
knoxx.backend.infra.openplanner.memory.operational_failure_text_QMARK_ = (function knoxx$backend$infra$openplanner$memory$operational_failure_text_QMARK_(text){
var text__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text));
return cljs.core.boolean$((function (){var or__5162__auto__ = cljs.core.re_find(/\b403\s+No upstream providers are allowed\b/i,text__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.re_find(/\bNo upstream providers are allowed for this tenant and request\b/i,text__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.re_find(/\bprovider_not_allowed\b/i,text__$1);
}
}
})());
});
knoxx.backend.infra.openplanner.memory.quality_label_extra = (function knoxx$backend$infra$openplanner$memory$quality_label_extra(quality,explicit_meaning){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"openplanner_labels","openplanner_labels",-669573727),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"claim_system","claim_system",-320128383),"knoxx-auto-quality-v1",new cljs.core.Keyword(null,"quality","quality",147850199),quality,new cljs.core.Keyword(null,"explicit_meaning","explicit_meaning",1062627523),explicit_meaning,new cljs.core.Keyword(null,"labels","labels",-626734591),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+"quality:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(quality))], null),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], null)], null);
});
knoxx.backend.infra.openplanner.memory.output_quality_extra = (function knoxx$backend$infra$openplanner$memory$output_quality_extra(text){
if(knoxx.backend.infra.openplanner.memory.operational_failure_text_QMARK_(text)){
return knoxx.backend.infra.openplanner.memory.quality_label_extra("bad","operational provider error, not useful assistant output");
} else {
return null;
}
});
knoxx.backend.infra.openplanner.memory.openplanner_event = (function knoxx$backend$infra$openplanner$memory$openplanner_event(config,p__27120){
var map__27121 = p__27120;
var map__27121__$1 = cljs.core.__destructure_map(map__27121);
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var session = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"session","session",1008279103));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"model","model",331153215));
var role = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"role","role",-736691072));
var extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"extra","extra",1612569067));
var ts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"ts","ts",1617209904));
var project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"project","project",1124394579));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27121__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"meta","meta",1499536964),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"source_ref","source_ref",-1854699662),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"text","text",-1790561697)],["openplanner.event.v1",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"author","author",2111686192),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(role,"user"))?"user":"knoxx"),new cljs.core.Keyword(null,"model","model",331153215),model,new cljs.core.Keyword(null,"tags","tags",1771418977),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["knoxx",kind,role], null)], null),extra,"knoxx",(function (){var or__5162__auto__ = ts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.time.now_iso();
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"project","project",1124394579),(function (){var or__5162__auto__ = project;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config);
}
})(),new cljs.core.Keyword(null,"session","session",1008279103),session,new cljs.core.Keyword(null,"message","message",-406056002),message], null),id,kind,text]);
});
knoxx.backend.infra.openplanner.memory.tool_receipt_summary_text = (function knoxx$backend$infra$openplanner$memory$tool_receipt_summary_text(receipt){
return (""+"Tool: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "tool";
}
}
})())+"\nStatus: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"input_preview","input_preview",2048529734).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(temp__5825__auto__)){
var input = temp__5825__auto__;
return (""+"\nInput:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(input));
} else {
return null;
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"result_preview","result_preview",215554859).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(temp__5825__auto__)){
var result = temp__5825__auto__;
return (""+"\nOutput:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(result));
} else {
return null;
}
})()));
});
knoxx.backend.infra.openplanner.memory.sanitize_tool_receipt_for_indexing = (function knoxx$backend$infra$openplanner$memory$sanitize_tool_receipt_for_indexing(receipt){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(receipt,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667)),new cljs.core.Keyword(null,"contentParts","contentParts",1395809695)),new cljs.core.Keyword(null,"attachments","attachments",-1535547830));
});
knoxx.backend.infra.openplanner.memory.run_summary_text = (function knoxx$backend$infra$openplanner$memory$run_summary_text(run){
return (""+"Run "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run))+"\nMode: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(run,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"settings","settings",1556144875),new cljs.core.Keyword(null,"mode","mode",654403691)], null)))+"\nModel: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run))+"\nStatus: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"answer","answer",-742633163).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(temp__5825__auto__)){
var answer = temp__5825__auto__;
return (""+"\nAnswer:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(answer));
} else {
return null;
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(temp__5825__auto__)){
var error = temp__5825__auto__;
return (""+"\nError:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(error));
} else {
return null;
}
})()));
});
/**
 * Extract a normalized string value from a spec map given keyword alternatives.
 */
knoxx.backend.infra.openplanner.memory.spec_value = (function knoxx$backend$infra$openplanner$memory$spec_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27278 = arguments.length;
var i__5898__auto___27279 = (0);
while(true){
if((i__5898__auto___27279 < len__5897__auto___27278)){
args__5903__auto__.push((arguments[i__5898__auto___27279]));

var G__27280 = (i__5898__auto___27279 + (1));
i__5898__auto___27279 = G__27280;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic = (function (spec,keys){
var G__27127 = cljs.core.some((function (k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(spec,k);
}),keys);
var G__27127__$1 = (((G__27127 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27127)));
var G__27127__$2 = (((G__27127__$1 == null))?null:clojure.string.trim(G__27127__$1));
if((G__27127__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27127__$2);
}
}));

(knoxx.backend.infra.openplanner.memory.spec_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.infra.openplanner.memory.spec_value.cljs$lang$applyTo = (function (seq27125){
var G__27126 = cljs.core.first(seq27125);
var seq27125__$1 = cljs.core.next(seq27125);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27126,seq27125__$1);
}));

knoxx.backend.infra.openplanner.memory.run_scope_extra = (function knoxx$backend$infra$openplanner$memory$run_scope_extra(run){
var base = cljs.core.select_keys(run,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770),new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"user_email","user_email",-926613652),new cljs.core.Keyword(null,"membership_id","membership_id",-171302674)], null));
var agent_spec = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(run,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"settings","settings",1556144875),new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(run);
}
})();
var contract_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622)], 0));
var actor_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"actor-id","actor-id",897721067)], 0));
var contract_actors = knoxx.backend.domain.actor.scope.actor_claims__GT_wire((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contractActors","contractActors",47284059).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
})());
var sub_agent_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479)], 0));
var parent_agent_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925)], 0));
var parent_run_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271),new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367)], 0));
var spawn_kind = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"spawnKind","spawnKind",1648184297),new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959)], 0));
var trigger_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"triggerId","triggerId",-684068188),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518)], 0));
var event_type = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"eventType","eventType",-1525570624),new cljs.core.Keyword(null,"event-type","event-type",319722813)], 0));
var event_types = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"eventTypes","eventTypes",-1966249997).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"event-types","event-types",-81363635).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})()))));
var event_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"eventId","eventId",378389360),new cljs.core.Keyword(null,"event-id","event-id",2130210178)], 0));
var event_scope_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"eventScopeId","eventScopeId",1980523873),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009)], 0));
var schedule_id = knoxx.backend.infra.openplanner.memory.spec_value.cljs$core$IFn$_invoke$arity$variadic(agent_spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"scheduleId","scheduleId",-959542790),new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193)], 0));
var G__27135 = base;
var G__27135__$1 = (cljs.core.truth_(contract_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135,new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),contract_id):G__27135);
var G__27135__$2 = (cljs.core.truth_(actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$1,new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),actor_id):G__27135__$1);
var G__27135__$3 = ((cljs.core.seq(contract_actors))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$2,new cljs.core.Keyword(null,"contract_actors","contract_actors",-1493360705),contract_actors):G__27135__$2);
var G__27135__$4 = (cljs.core.truth_(sub_agent_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$3,new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),sub_agent_id):G__27135__$3);
var G__27135__$5 = (cljs.core.truth_(parent_agent_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$4,new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),parent_agent_id):G__27135__$4);
var G__27135__$6 = (cljs.core.truth_(parent_run_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$5,new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),parent_run_id):G__27135__$5);
var G__27135__$7 = (cljs.core.truth_(spawn_kind)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$6,new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),spawn_kind):G__27135__$6);
var G__27135__$8 = (cljs.core.truth_(trigger_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$7,new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),trigger_id):G__27135__$7);
var G__27135__$9 = (cljs.core.truth_(event_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$8,new cljs.core.Keyword(null,"event_type","event_type",1569866042),event_type):G__27135__$8);
var G__27135__$10 = ((cljs.core.seq(event_types))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$9,new cljs.core.Keyword(null,"event_types","event_types",-752038707),event_types):G__27135__$9);
var G__27135__$11 = (cljs.core.truth_(event_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$10,new cljs.core.Keyword(null,"event_id","event_id",-767275570),event_id):G__27135__$10);
var G__27135__$12 = (cljs.core.truth_(event_scope_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$11,new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),event_scope_id):G__27135__$11);
if(cljs.core.truth_(schedule_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27135__$12,new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),schedule_id);
} else {
return G__27135__$12;
}
});
knoxx.backend.infra.openplanner.memory.session_node_kind = (function knoxx$backend$infra$openplanner$memory$session_node_kind(node_type){
var G__27162 = node_type;
switch (G__27162) {
case "tool_call":
return "tool_call";

break;
case "tool_result":
return "tool_result";

break;
case "reasoning":
return "reasoning";

break;
default:
return "message";

}
});
knoxx.backend.infra.openplanner.memory.session_graph_node_event = (function knoxx$backend$infra$openplanner$memory$session_graph_node_event(config,p__27163){
var map__27164 = p__27163;
var map__27164__$1 = cljs.core.__destructure_map(map__27164);
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var session = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"session","session",1008279103));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"model","model",331153215));
var event_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"event-id","event-id",2130210178));
var extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"extra","extra",1612569067));
var node_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"node-type","node-type",129492462));
var ts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"ts","ts",1617209904));
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var node_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27164__$1,new cljs.core.Keyword(null,"node-id","node-id",779482292));
return knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["system",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"lake","lake",805586599),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"node_id","node_id",-1781409174),node_id,new cljs.core.Keyword(null,"node_type","node_type",-1629889898),node_type,new cljs.core.Keyword(null,"node_kind","node_kind",-1510972914),knoxx.backend.infra.openplanner.memory.session_node_kind(node_type),new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"entity_key","entity_key",-535942535),node_id], null),extra], 0)),ts,new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),event_id,"graph.node",message,session,text,model]));
});
knoxx.backend.infra.openplanner.memory.session_graph_edge_event = (function knoxx$backend$infra$openplanner$memory$session_graph_edge_event(config,p__27166){
var map__27167 = p__27166;
var map__27167__$1 = cljs.core.__destructure_map(map__27167);
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var session = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"session","session",1008279103));
var event_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"event-id","event-id",2130210178));
var target_node_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"target-node-id","target-node-id",1474740067));
var edge_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"edge-type","edge-type",1113487045));
var target_lake = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"target-lake","target-lake",-1039226));
var extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"extra","extra",1612569067));
var source_lake = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"source-lake","source-lake",2133547533));
var source_node_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"source-node-id","source-node-id",823076653));
var ts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27167__$1,new cljs.core.Keyword(null,"ts","ts",1617209904));
return knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697)],["system",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"lake","lake",805586599),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"edge_id","edge_id",629853454),event_id,new cljs.core.Keyword(null,"edge_type","edge_type",1140519228),edge_type,new cljs.core.Keyword(null,"source_node_id","source_node_id",-525446610),source_node_id,new cljs.core.Keyword(null,"target_node_id","target_node_id",-988690835),target_node_id,new cljs.core.Keyword(null,"source_lake","source_lake",-657789362),source_lake,new cljs.core.Keyword(null,"target_lake","target_lake",656087470),target_lake], null),extra], 0)),ts,new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),event_id,"graph.edge",message,session,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(source_node_id)+" -> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_node_id))]));
});
knoxx.backend.infra.openplanner.memory.session_text_graph_events = (function knoxx$backend$infra$openplanner$memory$session_text_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,p__27168){
var map__27169 = p__27168;
var map__27169__$1 = cljs.core.__destructure_map(map__27169);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"model","model",331153215));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var scope_extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052));
var node_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"node-type","node-type",129492462));
var ts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"ts","ts",1617209904));
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var node_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27169__$1,new cljs.core.Keyword(null,"node-id","node-id",779482292));
var safe_text = (function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var workspace_project = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "workspace";
}
})();
var node_event = knoxx.backend.infra.openplanner.memory.session_graph_node_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"node-type","node-type",129492462),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"node-id","node-id",779482292),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(node_id)+":node"),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id], null),scope_extra,knoxx.backend.infra.openplanner.memory.output_quality_extra(safe_text)], 0)),node_type,ts,node_id,label,node_id,conversation_id,safe_text,model]));
var workspace_edges = (function (){var iter__5649__auto__ = (function knoxx$backend$infra$openplanner$memory$session_text_graph_events_$_iter__27172(s__27173){
return (new cljs.core.LazySeq(null,(function (){
var s__27173__$1 = s__27173;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__27173__$1);
if(temp__5825__auto__){
var s__27173__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__27173__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__27173__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__27175 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__27174 = (0);
while(true){
if((i__27174 < size__5648__auto__)){
var map__27177 = cljs.core._nth(c__5647__auto__,i__27174);
var map__27177__$1 = cljs.core.__destructure_map(map__27177);
var path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27177__$1,new cljs.core.Keyword(null,"path","path",-188191168));
var target_node_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27177__$1,new cljs.core.Keyword(null,"target_node_id","target_node_id",-988690835));
var target_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27177__$1,new cljs.core.Keyword(null,"target_kind","target_kind",-78093164));
cljs.core.chunk_append(b__27175,knoxx.backend.infra.openplanner.memory.session_graph_edge_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"target-node-id","target-node-id",1474740067),new cljs.core.Keyword(null,"edge-type","edge-type",1113487045),new cljs.core.Keyword(null,"target-lake","target-lake",-1039226),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source-lake","source-lake",2133547533),new cljs.core.Keyword(null,"source-node-id","source-node-id",823076653),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103)],[(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(node_id)+":mentions_workspace:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_node_id)),target_node_id,"mentions_workspace_path",workspace_project,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"path","path",-188191168),path,new cljs.core.Keyword(null,"target_kind","target_kind",-78093164),target_kind], null),scope_extra], 0)),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),node_id,ts,node_id,conversation_id])));

var G__27286 = (i__27174 + (1));
i__27174 = G__27286;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__27175),knoxx$backend$infra$openplanner$memory$session_text_graph_events_$_iter__27172(cljs.core.chunk_rest(s__27173__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__27175),null);
}
} else {
var map__27178 = cljs.core.first(s__27173__$2);
var map__27178__$1 = cljs.core.__destructure_map(map__27178);
var path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27178__$1,new cljs.core.Keyword(null,"path","path",-188191168));
var target_node_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27178__$1,new cljs.core.Keyword(null,"target_node_id","target_node_id",-988690835));
var target_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27178__$1,new cljs.core.Keyword(null,"target_kind","target_kind",-78093164));
return cljs.core.cons(knoxx.backend.infra.openplanner.memory.session_graph_edge_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"target-node-id","target-node-id",1474740067),new cljs.core.Keyword(null,"edge-type","edge-type",1113487045),new cljs.core.Keyword(null,"target-lake","target-lake",-1039226),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source-lake","source-lake",2133547533),new cljs.core.Keyword(null,"source-node-id","source-node-id",823076653),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103)],[(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(node_id)+":mentions_workspace:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_node_id)),target_node_id,"mentions_workspace_path",workspace_project,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"path","path",-188191168),path,new cljs.core.Keyword(null,"target_kind","target_kind",-78093164),target_kind], null),scope_extra], 0)),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),node_id,ts,node_id,conversation_id])),knoxx$backend$infra$openplanner$memory$session_text_graph_events_$_iter__27172(cljs.core.rest(s__27173__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__((extract_mentioned_devel_paths.cljs$core$IFn$_invoke$arity$1 ? extract_mentioned_devel_paths.cljs$core$IFn$_invoke$arity$1(safe_text) : extract_mentioned_devel_paths.call(null,safe_text)));
})();
var web_edges = (function (){var iter__5649__auto__ = (function knoxx$backend$infra$openplanner$memory$session_text_graph_events_$_iter__27179(s__27180){
return (new cljs.core.LazySeq(null,(function (){
var s__27180__$1 = s__27180;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__27180__$1);
if(temp__5825__auto__){
var s__27180__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__27180__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__27180__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__27182 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__27181 = (0);
while(true){
if((i__27181 < size__5648__auto__)){
var url = cljs.core._nth(c__5647__auto__,i__27181);
cljs.core.chunk_append(b__27182,knoxx.backend.infra.openplanner.memory.session_graph_edge_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"target-node-id","target-node-id",1474740067),new cljs.core.Keyword(null,"edge-type","edge-type",1113487045),new cljs.core.Keyword(null,"target-lake","target-lake",-1039226),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source-lake","source-lake",2133547533),new cljs.core.Keyword(null,"source-node-id","source-node-id",823076653),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103)],[(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(node_id)+":mentions_web:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)),(""+"web:url:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)),"mentions_web_url","web",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"url","url",276297046),url], null),scope_extra], 0)),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),node_id,ts,node_id,conversation_id])));

var G__27287 = (i__27181 + (1));
i__27181 = G__27287;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__27182),knoxx$backend$infra$openplanner$memory$session_text_graph_events_$_iter__27179(cljs.core.chunk_rest(s__27180__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__27182),null);
}
} else {
var url = cljs.core.first(s__27180__$2);
return cljs.core.cons(knoxx.backend.infra.openplanner.memory.session_graph_edge_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"target-node-id","target-node-id",1474740067),new cljs.core.Keyword(null,"edge-type","edge-type",1113487045),new cljs.core.Keyword(null,"target-lake","target-lake",-1039226),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source-lake","source-lake",2133547533),new cljs.core.Keyword(null,"source-node-id","source-node-id",823076653),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103)],[(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(node_id)+":mentions_web:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)),(""+"web:url:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)),"mentions_web_url","web",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"url","url",276297046),url], null),scope_extra], 0)),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),node_id,ts,node_id,conversation_id])),knoxx$backend$infra$openplanner$memory$session_text_graph_events_$_iter__27179(cljs.core.rest(s__27180__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__((extract_mentioned_urls.cljs$core$IFn$_invoke$arity$1 ? extract_mentioned_urls.cljs$core$IFn$_invoke$arity$1(safe_text) : extract_mentioned_urls.call(null,safe_text)));
})();
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_event], null),cljs.core.concat.cljs$core$IFn$_invoke$arity$2(workspace_edges,web_edges));
});
knoxx.backend.infra.openplanner.memory.fail_open_indexing_BANG_ = (async function knoxx$backend$infra$openplanner$memory$fail_open_indexing_BANG_(run,indexing_promise){
try{return (await indexing_promise);
}catch (e27187){var err = e27187;
console.warn("[openplanner-memory] run indexing failed",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"phase","phase",575722892),"index-run-memory",new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"run-status","run-status",-1763380443),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"error-message","error-message",1756021561),cljs.core.ex_message(err),new cljs.core.Keyword(null,"error-data","error-data",-629352026),cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = cljs.core.ex_data(err);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())),new cljs.core.Keyword(null,"fail-open","fail-open",-553578804),true], null)));

return null;
}});
/**
 * Persist the completed run to the session store AND project it into the
 * OpenPlanner event ledger. Both writes are required: the store is the
 * authoritative run record (knoxx_runs), while the ledger projection
 * (knoxx.message / knoxx.run events) is the only source the /v1/sessions
 * list and resume reads consume. Treating these as either/or made every
 * post-cutover thread invisible to the REST API (regression 2026-06-06).
 */
knoxx.backend.infra.openplanner.memory.index_run_memory_BANG_ = (function knoxx$backend$infra$openplanner$memory$index_run_memory_BANG_(config,run,extract_mentioned_devel_paths,extract_mentioned_urls){
if(cljs.core.not(knoxx.backend.infra.openplanner.memory.openplanner_configured_QMARK_(config))){
return Promise.resolve(null);
} else {
return knoxx.backend.infra.openplanner.memory.fail_open_indexing_BANG_(run,(function (){var store = cljs.core.deref(knoxx.backend.infra.stores.session_store_registry.session_store_STAR_);
var store_write = (cljs.core.truth_(store)?knoxx.backend.shape.session_persistence.put_run_BANG_(store,run):Promise.resolve(null));
var ledger_write = (knoxx.backend.infra.openplanner.memory.project_run_into_event_ledger_BANG_.cljs$core$IFn$_invoke$arity$4 ? knoxx.backend.infra.openplanner.memory.project_run_into_event_ledger_BANG_.cljs$core$IFn$_invoke$arity$4(config,run,extract_mentioned_devel_paths,extract_mentioned_urls) : knoxx.backend.infra.openplanner.memory.project_run_into_event_ledger_BANG_.call(null,config,run,extract_mentioned_devel_paths,extract_mentioned_urls));
return Promise.all([store_write,ledger_write]);
})());
}
});
knoxx.backend.infra.openplanner.memory.legacy_run_context = (function knoxx$backend$infra$openplanner$memory$legacy_run_context(config,run){
var conversation_id = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(run);
var session_id = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run);
var run_id = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run);
var scope_extra = knoxx.backend.infra.openplanner.memory.run_scope_extra(run);
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052),new cljs.core.Keyword(null,"common-extra","common-extra",-537713232),new cljs.core.Keyword(null,"session-project","session-project",-925999312),new cljs.core.Keyword(null,"request-text","request-text",2038241266),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"trace-blocks","trace-blocks",-955398857),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"reasoning-text","reasoning-text",747588637)],[conversation_id,session_id,scope_extra,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"mode","mode",654403691),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(run,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"settings","settings",1556144875),new cljs.core.Keyword(null,"mode","mode",654403691)], null))], null),scope_extra], 0)),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),(function (){var or__5162__auto__ = (function (){var G__27188 = new cljs.core.Keyword(null,"request_messages","request_messages",-1334174565).cljs$core$IFn$_invoke$arity$1(run);
var G__27188__$1 = (((G__27188 == null))?null:cljs.core.first(G__27188));
if((G__27188__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(G__27188__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"answer","answer",-742633163).cljs$core$IFn$_invoke$arity$1(run),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),run_id,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"reasoning","reasoning",1956143595).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()]);
});
knoxx.backend.infra.openplanner.memory.sanitized_request_content_parts = (function knoxx$backend$infra$openplanner$memory$sanitized_request_content_parts(run){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("image",new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(p))) && (((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(p))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p))))))))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),"image",new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.subs.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p),(0),cljs.core.min.cljs$core$IFn$_invoke$arity$2((2048),cljs.core.count(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p)))),new cljs.core.Keyword(null,"truncated","truncated",298102102),true], null);
} else {
return cljs.core.select_keys(p,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"url","url",276297046),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
}
}),(function (){var or__5162__auto__ = (function (){var G__27189 = new cljs.core.Keyword(null,"request_messages","request_messages",-1334174565).cljs$core$IFn$_invoke$arity$1(run);
var G__27189__$1 = (((G__27189 == null))?null:cljs.core.first(G__27189));
if((G__27189__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"content-parts","content-parts",684529019).cljs$core$IFn$_invoke$arity$1(G__27189__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
});
knoxx.backend.infra.openplanner.memory.legacy_base_events = (function knoxx$backend$infra$openplanner$memory$legacy_base_events(config,run,ctx){
var map__27190 = ctx;
var map__27190__$1 = cljs.core.__destructure_map(map__27190);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"session-project","session-project",-925999312));
var request_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"request-text","request-text",2038241266));
var answer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"answer","answer",-742633163));
var reasoning_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"reasoning-text","reasoning-text",747588637));
var trace_blocks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"trace-blocks","trace-blocks",-955398857));
var common_extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27190__$1,new cljs.core.Keyword(null,"common-extra","common-extra",-537713232));
var summary_text = knoxx.backend.infra.openplanner.memory.run_summary_text(run);
var G__27191 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["user",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([common_extra,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),knoxx.backend.infra.openplanner.memory.sanitized_request_content_parts(run)], null)], 0)),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(run),session_project,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":user"),"knoxx.message",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":user"),conversation_id,request_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)])),knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["system",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([common_extra,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832),new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114).cljs$core$IFn$_invoke$arity$1(run)], null),knoxx.backend.infra.openplanner.memory.output_quality_extra(summary_text)], 0)),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run),session_project,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":summary"),"knoxx.run",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":summary"),conversation_id,summary_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)]))], null);
var G__27191__$1 = (((!(clojure.string.blank_QMARK_((function (){var or__5162__auto__ = answer;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__27191,knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["assistant",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([common_extra,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),trace_blocks], null),knoxx.backend.infra.openplanner.memory.output_quality_extra(answer)], 0)),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run),session_project,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":assistant"),"knoxx.message",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":assistant"),conversation_id,answer,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)]))):G__27191);
if((!(clojure.string.blank_QMARK_(reasoning_text)))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__27191__$1,knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["system",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([common_extra,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run)], null)], 0)),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run),session_project,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":reasoning"),"knoxx.reasoning",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":reasoning"),conversation_id,reasoning_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)])));
} else {
return G__27191__$1;
}
});
knoxx.backend.infra.openplanner.memory.tool_graph_events = (function knoxx$backend$infra$openplanner$memory$tool_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,ctx,receipt,tool_id,tool_ts,call_text,result_text){
var map__27193 = ctx;
var map__27193__$1 = cljs.core.__destructure_map(map__27193);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27193__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27193__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27193__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var session_project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27193__$1,new cljs.core.Keyword(null,"session-project","session-project",-925999312));
var scope_extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27193__$1,new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052));
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.openplanner.memory.session_text_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052),new cljs.core.Keyword(null,"node-type","node-type",129492462),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"node-id","node-id",779482292),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[conversation_id,session_id,scope_extra,"tool_call",tool_ts,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_project)+":run:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":tool-call:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)),(""+"Tool call \u00B7 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return tool_id;
}
})())),run_id,call_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run","run",-1821166653).cljs$core$IFn$_invoke$arity$1(ctx))])),knoxx.backend.infra.openplanner.memory.session_text_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052),new cljs.core.Keyword(null,"node-type","node-type",129492462),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"node-id","node-id",779482292),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[conversation_id,session_id,scope_extra,"tool_result",tool_ts,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_project)+":run:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":tool-result:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)),(""+"Tool result \u00B7 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return tool_id;
}
})())),run_id,result_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run","run",-1821166653).cljs$core$IFn$_invoke$arity$1(ctx))])));
});
knoxx.backend.infra.openplanner.memory.legacy_tool_events = (function knoxx$backend$infra$openplanner$memory$legacy_tool_events(config,run,extract_mentioned_devel_paths,extract_mentioned_urls,ctx){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (receipt){
var tool_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "tool";
}
})();
var tool_ts = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"ended_at","ended_at",1150683059).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"started_at","started_at",856896776).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run);
}
}
})();
var summary_text = knoxx.backend.infra.openplanner.memory.tool_receipt_summary_text(receipt);
var call_text = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"input_preview","input_preview",2048529734).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return summary_text;
}
})();
var result_text = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"result_preview","result_preview",215554859).cljs$core$IFn$_invoke$arity$1(receipt);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return summary_text;
}
})();
var ctx_STAR_ = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ctx,new cljs.core.Keyword(null,"run","run",-1821166653),run);
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["system",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"common-extra","common-extra",-537713232).cljs$core$IFn$_invoke$arity$1(ctx),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"receipt","receipt",1871350913),knoxx.backend.infra.openplanner.memory.sanitize_tool_receipt_for_indexing(receipt)], null)], 0)),tool_ts,new cljs.core.Keyword(null,"session-project","session-project",-925999312).cljs$core$IFn$_invoke$arity$1(ctx),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx))+":tool:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)),"knoxx.tool_receipt",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx))+":tool:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ctx),summary_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)]))], null),knoxx.backend.infra.openplanner.memory.tool_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,ctx_STAR_,receipt,tool_id,tool_ts,call_text,result_text));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067).cljs$core$IFn$_invoke$arity$1(run)], 0));
});
knoxx.backend.infra.openplanner.memory.legacy_message_graph_events = (function knoxx$backend$infra$openplanner$memory$legacy_message_graph_events(config,run,extract_mentioned_devel_paths,extract_mentioned_urls,ctx){
var map__27195 = ctx;
var map__27195__$1 = cljs.core.__destructure_map(map__27195);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var session_project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"session-project","session-project",-925999312));
var request_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"request-text","request-text",2038241266));
var answer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"answer","answer",-742633163));
var reasoning_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"reasoning-text","reasoning-text",747588637));
var scope_extra = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27195__$1,new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052));
return cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.openplanner.memory.session_text_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052),new cljs.core.Keyword(null,"node-type","node-type",129492462),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"node-id","node-id",779482292),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[conversation_id,session_id,scope_extra,"user_message",new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(run),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_project)+":run:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":user"),"User message",run_id,request_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)])),((clojure.string.blank_QMARK_((function (){var or__5162__auto__ = answer;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))?null:knoxx.backend.infra.openplanner.memory.session_text_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052),new cljs.core.Keyword(null,"node-type","node-type",129492462),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"node-id","node-id",779482292),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[conversation_id,session_id,scope_extra,"assistant_message",new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_project)+":run:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":assistant"),"Assistant message",run_id,answer,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)]))),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([((clojure.string.blank_QMARK_(reasoning_text))?null:knoxx.backend.infra.openplanner.memory.session_text_graph_events(config,extract_mentioned_devel_paths,extract_mentioned_urls,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"scope-extra","scope-extra",-1362977052),new cljs.core.Keyword(null,"node-type","node-type",129492462),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"node-id","node-id",779482292),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[conversation_id,session_id,scope_extra,"reasoning",new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_project)+":run:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":reasoning"),"Reasoning",run_id,reasoning_text,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)])))], 0));
});
knoxx.backend.infra.openplanner.memory.legacy_media_events = (function knoxx$backend$infra$openplanner$memory$legacy_media_events(config,run,ctx){
var content_parts = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
if(cljs.core.seq(content_parts)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],["system",cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"common-extra","common-extra",-537713232).cljs$core$IFn$_invoke$arity$1(ctx),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"content_parts_count","content_parts_count",648994127),cljs.core.count(content_parts),new cljs.core.Keyword(null,"content_parts_summary","content_parts_summary",-1938191944),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27196_SHARP_){
return cljs.core.select_keys(p1__27196_SHARP_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"url","url",276297046)], null));
}),content_parts)], null)], 0)),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"session-project","session-project",-925999312).cljs$core$IFn$_invoke$arity$1(ctx),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx))+":media"),"knoxx.run.media",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(ctx))+":media"),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ctx),(""+"Media context: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(content_parts))+" part(s)"+" \u2014 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "?";
}
})())+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "?";
}
})())+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "(inline)";
}
}
})()));
}),content_parts)))),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)]))], null);
} else {
return null;
}
});
knoxx.backend.infra.openplanner.memory.legacy_run_events = (function knoxx$backend$infra$openplanner$memory$legacy_run_events(config,run,extract_mentioned_devel_paths,extract_mentioned_urls){
var ctx = knoxx.backend.infra.openplanner.memory.legacy_run_context(config,run);
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.openplanner.memory.legacy_base_events(config,run,ctx),knoxx.backend.infra.openplanner.memory.legacy_message_graph_events(config,run,extract_mentioned_devel_paths,extract_mentioned_urls,ctx),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.openplanner.memory.legacy_tool_events(config,run,extract_mentioned_devel_paths,extract_mentioned_urls,ctx),knoxx.backend.infra.openplanner.memory.legacy_media_events(config,run,ctx)], 0)));
});
/**
 * Translate a completed run into openplanner.event.v1 envelopes and append
 * them to the event ledger via the REST client. REST (not direct Mongo) so
 * the run text still flows through vector indexing and graph derivation.
 */
knoxx.backend.infra.openplanner.memory.project_run_into_event_ledger_BANG_ = (async function knoxx$backend$infra$openplanner$memory$project_run_into_event_ledger_BANG_(config,run,extract_mentioned_devel_paths,extract_mentioned_urls){
var all_events = knoxx.backend.infra.openplanner.memory.legacy_run_events(config,run,extract_mentioned_devel_paths,extract_mentioned_urls);
try{return (await knoxx.backend.infra.clients.openplanner.events_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),all_events));
}catch (e27198){var err = e27198;
console.warn("[knoxx] failed to index run memory into OpenPlanner",err);

return null;
}});

//# sourceMappingURL=knoxx.backend.infra.openplanner.memory.js.map
