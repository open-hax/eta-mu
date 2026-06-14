import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
goog.provide('knoxx.backend.extern.agent_turn_node');
knoxx.backend.extern.agent_turn_node.random_uuid_BANG_ = (function knoxx$backend$extern$agent_turn_node$random_uuid_BANG_(){
return shadow.esm.esm_import$node_crypto.randomUUID();
});
knoxx.backend.extern.agent_turn_node.file_data_url_with_fs_BANG_ = (async function knoxx$backend$extern$agent_turn_node$file_data_url_with_fs_BANG_(node_fs,absolute_path,mime_type,label,max_bytes){
var mime_type__$1 = (await (async function (){var or__5162__auto__ = mime_type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "application/octet-stream";
}
})());
var label__$1 = (await (async function (){var or__5162__auto__ = label;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "media";
}
})());
var stat = (await node_fs.stat(absolute_path));
if(cljs.core.truth_(stat.isFile())){
} else {
throw (new Error((""+"Attached "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label__$1)+" is not a file")));
}

var size = stat.size;
if((size > max_bytes)){
throw (new Error((""+"Attached "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label__$1)+" exceeds max bytes: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(size)+"; max="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_bytes))));
} else {
}

var buffer = (await node_fs.readFile(absolute_path));
return (""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime_type__$1)+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(buffer.toString("base64")));
});
knoxx.backend.extern.agent_turn_node.file_data_url_BANG_ = (function knoxx$backend$extern$agent_turn_node$file_data_url_BANG_(absolute_path,mime_type,label,max_bytes){
return knoxx.backend.extern.agent_turn_node.file_data_url_with_fs_BANG_(shadow.esm.esm_import$node_fs$promises,absolute_path,mime_type,label,max_bytes);
});

//# sourceMappingURL=knoxx.backend.extern.agent_turn_node.js.map
