import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.label.audio');
knoxx.backend.domain.label.audio.labels_file = "audio-labels.json";
/**
 * Read the labels JSON file from the workspace root. Returns promise.
 */
knoxx.backend.domain.label.audio.read_labels_file = (async function knoxx$backend$domain$label$audio$read_labels_file(fs,workspace_root){
var path = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(workspace_root)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.label.audio.labels_file));
try{var content = (await fs.readFile(path,"utf8"));
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(content),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e16370){var _ = e16370;
return cljs.core.PersistentArrayMap.EMPTY;
}});
/**
 * Write labels to the JSON file. Returns promise.
 */
knoxx.backend.domain.label.audio.write_labels_file_BANG_ = (function knoxx$backend$domain$label$audio$write_labels_file_BANG_(fs,workspace_root,labels){
var path = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(workspace_root)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.label.audio.labels_file));
var data = JSON.stringify(cljs.core.clj__GT_js(labels),null,(2));
return fs.writeFile(path,data,"utf8");
});
/**
 * Create labels file if it doesn't exist. Returns promise of labels.
 */
knoxx.backend.domain.label.audio.ensure_labels_file_BANG_ = (async function knoxx$backend$domain$label$audio$ensure_labels_file_BANG_(fs,workspace_root){
var path = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(workspace_root)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.label.audio.labels_file));
try{(await fs.stat(path));
}catch (e16375){var __16470 = e16375;
(await knoxx.backend.domain.label.audio.write_labels_file_BANG_(fs,workspace_root,cljs.core.PersistentArrayMap.EMPTY));
}
return (await knoxx.backend.domain.label.audio.read_labels_file(fs,workspace_root));
});
/**
 * Get all labels for a file path. Returns promise.
 */
knoxx.backend.domain.label.audio.get_labels = (async function knoxx$backend$domain$label$audio$get_labels(fs,workspace_root,file_path){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(labels,file_path,cljs.core.PersistentVector.EMPTY);
});
/**
 * Get all unique labels across all files. Returns promise.
 */
knoxx.backend.domain.label.audio.get_all_labels = (async function knoxx$backend$domain$label$audio$get_all_labels(fs,workspace_root){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.concat,cljs.core.vals(labels)))));
});
/**
 * Get all file paths that have a specific label. Returns promise.
 */
knoxx.backend.domain.label.audio.get_files_by_label = (async function knoxx$backend$domain$label$audio$get_files_by_label(fs,workspace_root,label){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.key,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__16386){
var vec__16387 = p__16386;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16387,(0),null);
var labels__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16387,(1),null);
return cljs.core.some((function (p1__16381_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__16381_SHARP_,label);
}),labels__$1);
}),labels)));
});
/**
 * Add a label to a file. Returns promise of updated labels.
 */
knoxx.backend.domain.label.audio.add_label_BANG_ = (async function knoxx$backend$domain$label$audio$add_label_BANG_(fs,workspace_root,file_path,label){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
var current = cljs.core.get.cljs$core$IFn$_invoke$arity$3(labels,file_path,cljs.core.PersistentVector.EMPTY);
var updated = (cljs.core.truth_(cljs.core.some((function (p1__16390_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__16390_SHARP_,label);
}),current))?current:cljs.core.conj.cljs$core$IFn$_invoke$arity$2(current,label));
(await knoxx.backend.domain.label.audio.write_labels_file_BANG_(fs,workspace_root,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(labels,file_path,updated)));

return cljs.core.vec(updated);
});
/**
 * Remove a label from a file. Returns promise of updated labels.
 */
knoxx.backend.domain.label.audio.remove_label_BANG_ = (async function knoxx$backend$domain$label$audio$remove_label_BANG_(fs,workspace_root,file_path,label){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
var current = cljs.core.get.cljs$core$IFn$_invoke$arity$3(labels,file_path,cljs.core.PersistentVector.EMPTY);
var updated = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__16394_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__16394_SHARP_,label);
}),current));
(await knoxx.backend.domain.label.audio.write_labels_file_BANG_(fs,workspace_root,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(labels,file_path,updated)));

return updated;
});
/**
 * Set all labels for a file (replaces existing). Returns promise.
 */
knoxx.backend.domain.label.audio.set_labels_BANG_ = (async function knoxx$backend$domain$label$audio$set_labels_BANG_(fs,workspace_root,file_path,new_labels){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
(await knoxx.backend.domain.label.audio.write_labels_file_BANG_(fs,workspace_root,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(labels,file_path,cljs.core.vec(new_labels))));

return cljs.core.vec(new_labels);
});
/**
 * Sanitize a label for use as a directory name.
 */
knoxx.backend.domain.label.audio.sanitize_dirname = (function knoxx$backend$domain$label$audio$sanitize_dirname(label){
return clojure.string.replace(clojure.string.replace(clojure.string.lower_case(label),/[^a-z0-9]+/,"-"),/^-|-$/,"");
});
knoxx.backend.domain.label.audio.create_symlink_BANG_ = (async function knoxx$backend$domain$label$audio$create_symlink_BANG_(fs,node_path,label_dir,file_path){
var filename = node_path.basename(file_path);
var link_path = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label_dir)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename));
try{return (await fs.symlink(file_path,link_path));
}catch (e16401){var _ = e16401;
return null;
}});
/**
 * Create symlinks for a single label. Returns promise.
 */
knoxx.backend.domain.label.audio.create_symlinks_for_label = (async function knoxx$backend$domain$label$audio$create_symlinks_for_label(fs,node_path,audio_dir,label,files){
var label_dir = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(audio_dir)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.label.audio.sanitize_dirname(label)));
try{(await fs.mkdir(label_dir,({"recursive": true})));
}catch (e16407){var __16504 = e16407;
}
return (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.label.audio.create_symlink_BANG_,fs,node_path,label_dir),files))));
});
knoxx.backend.domain.label.audio.count_dir_files = (async function knoxx$backend$domain$label$audio$count_dir_files(fs,dp){
try{var stat = (await fs.stat(dp));
if(cljs.core.truth_(stat.isDirectory())){
try{var f = (await fs.readdir(dp));
return cljs.core.count(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(f));
}catch (e16411){var _ = e16411;
return (0);
}} else {
return (0);
}
}catch (e16408){var _ = e16408;
return (0);
}});
/**
 * Count total symlinks in audio directory. Returns promise.
 */
knoxx.backend.domain.label.audio.count_symlinks = (async function knoxx$backend$domain$label$audio$count_symlinks(fs,audio_dir){
try{var dirs = (await fs.readdir(audio_dir));
var dir_paths = cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (d){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(audio_dir)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(d));
}),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(dirs));
var counts = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.label.audio.count_dir_files,fs),dir_paths))));
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._PLUS_,(0),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(counts));
}catch (e16414){var _ = e16414;
return (0);
}});
/**
 * Create symlink directory structure for labeled files.
 * Creates ./audio/<label>/ symlinks pointing to original files.
 * Returns promise of symlink count.
 */
knoxx.backend.domain.label.audio.sync_symlinks_BANG_ = (async function knoxx$backend$domain$label$audio$sync_symlinks_BANG_(fs,node_path,workspace_root){
var labels = (await knoxx.backend.domain.label.audio.ensure_labels_file_BANG_(fs,workspace_root));
var audio_dir = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(workspace_root)+"/audio");
var all_labels = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.concat,cljs.core.vals(labels)));
var label_files = (function (label){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.key,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__16420){
var vec__16444 = p__16420;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16444,(0),null);
var lbls = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16444,(1),null);
return cljs.core.some((function (p1__16415_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__16415_SHARP_,label);
}),lbls);
}),labels));
});
try{(await fs.mkdir(audio_dir,({"recursive": true})));
}catch (e16451){var __16522 = e16451;
}
var process_label = (function (label){
return knoxx.backend.domain.label.audio.create_symlinks_for_label(fs,node_path,audio_dir,label,label_files(label));
});
(await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2(process_label,all_labels))));

return (await knoxx.backend.domain.label.audio.count_symlinks(fs,audio_dir));
});

//# sourceMappingURL=knoxx.backend.domain.label.audio.js.map
