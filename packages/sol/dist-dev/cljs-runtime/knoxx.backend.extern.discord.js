import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.extern.discord');
knoxx.backend.extern.discord.gateway_started_QMARK_ = (function knoxx$backend$extern$discord$gateway_started_QMARK_(manager){
if((!((manager == null)))){
var status = manager.status();
return cljs.core.boolean$((function (){var or__5162__auto__ = (status["ready"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (status["started"]);
}
})());
} else {
return null;
}
});
/**
 * Resolve a CLJS collection of promises into a CLJS vector of JS/CLJS results.
 */
knoxx.backend.extern.discord.promise_all_vector = (async function knoxx$backend$extern$discord$promise_all_vector(promises){
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.vec(promises))));
return cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(results));
});
/**
 * Build Discord multipart message FormData from a CLJS payload and files.
 * 
 * Files are CLJS maps with :name, :mimeType, and :buffer.
 */
knoxx.backend.extern.discord.message_form_data = (function knoxx$backend$extern$discord$message_form_data(p__26644){
var map__26645 = p__26644;
var map__26645__$1 = cljs.core.__destructure_map(map__26645);
var payload = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26645__$1,new cljs.core.Keyword(null,"payload","payload",-383036092));
var files = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26645__$1,new cljs.core.Keyword(null,"files","files",-472457450));
var form = (new FormData());
form.append("payload_json",JSON.stringify(cljs.core.clj__GT_js(payload)));

var seq__26647_26679 = cljs.core.seq(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,(function (){var or__5162__auto__ = files;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var chunk__26648_26680 = null;
var count__26649_26681 = (0);
var i__26650_26682 = (0);
while(true){
if((i__26650_26682 < count__26649_26681)){
var vec__26663_26687 = chunk__26648_26680.cljs$core$IIndexed$_nth$arity$2(null,i__26650_26682);
var idx_26688 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26663_26687,(0),null);
var file_26689 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26663_26687,(1),null);
form.append((""+"files["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx_26688)+"]"),(new Blob([new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(file_26689)],({"type": new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(file_26689)}))),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(file_26689));


var G__26690 = seq__26647_26679;
var G__26691 = chunk__26648_26680;
var G__26692 = count__26649_26681;
var G__26693 = (i__26650_26682 + (1));
seq__26647_26679 = G__26690;
chunk__26648_26680 = G__26691;
count__26649_26681 = G__26692;
i__26650_26682 = G__26693;
continue;
} else {
var temp__5825__auto___26694 = cljs.core.seq(seq__26647_26679);
if(temp__5825__auto___26694){
var seq__26647_26695__$1 = temp__5825__auto___26694;
if(cljs.core.chunked_seq_QMARK_(seq__26647_26695__$1)){
var c__5694__auto___26696 = cljs.core.chunk_first(seq__26647_26695__$1);
var G__26697 = cljs.core.chunk_rest(seq__26647_26695__$1);
var G__26698 = c__5694__auto___26696;
var G__26699 = cljs.core.count(c__5694__auto___26696);
var G__26700 = (0);
seq__26647_26679 = G__26697;
chunk__26648_26680 = G__26698;
count__26649_26681 = G__26699;
i__26650_26682 = G__26700;
continue;
} else {
var vec__26671_26701 = cljs.core.first(seq__26647_26695__$1);
var idx_26702 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26671_26701,(0),null);
var file_26703 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26671_26701,(1),null);
form.append((""+"files["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx_26702)+"]"),(new Blob([new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(file_26703)],({"type": new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(file_26703)}))),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(file_26703));


var G__26704 = cljs.core.next(seq__26647_26695__$1);
var G__26705 = null;
var G__26706 = (0);
var G__26707 = (0);
seq__26647_26679 = G__26704;
chunk__26648_26680 = G__26705;
count__26649_26681 = G__26706;
i__26650_26682 = G__26707;
continue;
}
} else {
}
}
break;
}

return form;
});
/**
 * Convert raw runtime params to a CLJS keyword map.
 */
knoxx.backend.extern.discord.normalize_tool_params = (function knoxx$backend$extern$discord$normalize_tool_params(params){
if((params == null)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
if(cljs.core.map_QMARK_(params)){
return params;
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(params,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
});
/**
 * Convert a CLJS vector of runtime tool objects into the JS array expected by eta-mu.
 */
knoxx.backend.extern.discord.tool_array = (function knoxx$backend$extern$discord$tool_array(tools){
return cljs.core.clj__GT_js(cljs.core.vec(tools));
});
knoxx.backend.extern.discord.trim_path_delims = (function knoxx$backend$extern$discord$trim_path_delims(s){
return clojure.string.trim(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/<\\|\"|\"[|>]/,""));
});

//# sourceMappingURL=knoxx.backend.extern.discord.js.map
