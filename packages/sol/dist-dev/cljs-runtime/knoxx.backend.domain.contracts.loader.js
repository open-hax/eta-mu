import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./cljs.reader.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.domain.resources.namespace_file.js";
import "./knoxx.backend.law.contracts.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.domain.contracts.loader');
knoxx.backend.domain.contracts.loader.contract_class_order = new cljs.core.PersistentVector(null, 18, 5, cljs.core.PersistentVector.EMPTY_NODE, ["agents","actors","roles","capabilities","policies","generators","schedules","source_modes","sources","model_families","models","runtime_features","ingest_sources","actions","triggers","stores","sub_agents","cms"], null);
knoxx.backend.domain.contracts.loader.contract_edn_filename_QMARK_ = (function knoxx$backend$domain$contracts$loader$contract_edn_filename_QMARK_(filename){
return ((typeof filename === 'string') && (((clojure.string.ends_with_QMARK_(filename,".edn")) && ((!(clojure.string.starts_with_QMARK_(filename,".")))))));
});
knoxx.backend.domain.contracts.loader.configured_contracts_dir = (function knoxx$backend$domain$contracts$loader$configured_contracts_dir(config){
var G__25788 = new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735).cljs$core$IFn$_invoke$arity$1(config);
var G__25788__$1 = (((G__25788 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25788)));
var G__25788__$2 = (((G__25788__$1 == null))?null:clojure.string.trim(G__25788__$1));
if((G__25788__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25788__$2);
}
});
knoxx.backend.domain.contracts.loader.default_configured_contracts_dir_QMARK_ = (function knoxx$backend$domain$contracts$loader$default_configured_contracts_dir_QMARK_(value){
return (((value == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value,"contracts")));
});
knoxx.backend.domain.contracts.loader.contract_root_candidates = (function knoxx$backend$domain$contracts$loader$contract_root_candidates(config){
var configured = knoxx.backend.domain.contracts.loader.configured_contracts_dir(config);
if(knoxx.backend.domain.contracts.loader.default_configured_contracts_dir_QMARK_(configured)){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["../contracts","contracts","packages/agents/knoxx/contracts","orgs/open-hax/openplanner/packages/agents/knoxx/contracts"], null);
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [configured], null);
}
});
knoxx.backend.domain.contracts.loader.contract_root_paths = (function knoxx$backend$domain$contracts$loader$contract_root_paths(config){
var cwd = process.cwd();
var resolved = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__25804_SHARP_){
return shadow.esm.esm_import$node_path.resolve(cwd,p1__25804_SHARP_);
}),knoxx.backend.domain.contracts.loader.contract_root_candidates(config))));
var existing = cljs.core.filterv((function (p1__25805_SHARP_){
return shadow.esm.esm_import$node_fs.existsSync(p1__25805_SHARP_);
}),resolved);
if(cljs.core.seq(existing)){
return existing;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [shadow.esm.esm_import$node_path.resolve(cwd,(function (){var or__5162__auto__ = knoxx.backend.domain.contracts.loader.configured_contracts_dir(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "../contracts";
}
})())], null);
}
});
/**
 * First existing contract root (legacy single-root compat).
 */
knoxx.backend.domain.contracts.loader.contracts_dir_path = (function knoxx$backend$domain$contracts$loader$contracts_dir_path(config){
return cljs.core.first(knoxx.backend.domain.contracts.loader.contract_root_paths(config));
});
knoxx.backend.domain.contracts.loader.safe_path_segment_BANG_ = (function knoxx$backend$domain$contracts$loader$safe_path_segment_BANG_(segment,kind){
var s = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(segment));
if(((clojure.string.blank_QMARK_(s)) || (cljs.core.not(cljs.core.re_matches(/[A-Za-z0-9._-]+/,s))))){
throw (new Error((""+"Invalid "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)+" segment: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(segment))));
} else {
}

return s;
});
knoxx.backend.domain.contracts.loader.normalize_contract_class = (function knoxx$backend$domain$contracts$loader$normalize_contract_class(value){
var raw = (function (){var G__25828 = value;
var G__25828__$1 = (((G__25828 == null))?null:(function (){var G__25829 = G__25828;
var G__25829__$1 = (((value instanceof cljs.core.Keyword))?cljs.core.name(G__25829):G__25829);
if((!((value instanceof cljs.core.Keyword)))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25829__$1));
} else {
return G__25829__$1;
}
})());
var G__25828__$2 = (((G__25828__$1 == null))?null:clojure.string.trim(G__25828__$1));
if((G__25828__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__25828__$2);
}
})();
var G__25836 = raw;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(null,G__25836)){
return "agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("",G__25836)){
return "agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sources",G__25836)){
return "sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("pipelines",G__25836)){
return "pipelines";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("capabilities",G__25836)){
return "capabilities";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("role",G__25836)){
return "roles";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub_agents",G__25836)){
return "sub_agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source_modes",G__25836)){
return "source_modes";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model-families",G__25836)){
return "model_families";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agent",G__25836)){
return "agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model",G__25836)){
return "models";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub-agent",G__25836)){
return "sub_agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest-source",G__25836)){
return "ingest_sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest_source",G__25836)){
return "ingest_sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-configs",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("caps",G__25836)){
return "capabilities";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest-sources",G__25836)){
return "ingest_sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime",G__25836)){
return "runtime_features";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-feature",G__25836)){
return "runtime_features";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-features",G__25836)){
return "runtime_features";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms_config",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("user",G__25836)){
return "actors";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("capability",G__25836)){
return "capabilities";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-block-registry",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_feature",G__25836)){
return "runtime_features";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-block-registries",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agents",G__25836)){
return "agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("schedule",G__25836)){
return "schedules";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub_agent",G__25836)){
return "sub_agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-template",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-templates-registry",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("users",G__25836)){
return "actors";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms_configs",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model-family",G__25836)){
return "model_families";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-template-registries",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-sources",G__25836)){
return "sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_source",G__25836)){
return "sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("action",G__25836)){
return "actions";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub-agents",G__25836)){
return "sub_agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_sources",G__25836)){
return "sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("policies",G__25836)){
return "policies";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("policy",G__25836)){
return "policies";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actors",G__25836)){
return "actors";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("pipeline",G__25836)){
return "pipelines";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model_family",G__25836)){
return "model_families";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("stores",G__25836)){
return "stores";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source-modes",G__25836)){
return "source_modes";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("triggers",G__25836)){
return "triggers";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-source",G__25836)){
return "sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("contracts",G__25836)){
return "agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source",G__25836)){
return "sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("contract",G__25836)){
return "agents";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("generators",G__25836)){
return "generators";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-templates",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source_mode",G__25836)){
return "source_modes";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("generator",G__25836)){
return "generators";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model_families",G__25836)){
return "model_families";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest_sources",G__25836)){
return "ingest_sources";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cap",G__25836)){
return "capabilities";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("models",G__25836)){
return "models";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("human",G__25836)){
return "actors";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("trigger",G__25836)){
return "triggers";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("humans",G__25836)){
return "actors";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source-mode",G__25836)){
return "source_modes";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-config",G__25836)){
return "cms";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("schedules",G__25836)){
return "schedules";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("store",G__25836)){
return "stores";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("roles",G__25836)){
return "roles";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actor",G__25836)){
return "actors";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_features",G__25836)){
return "runtime_features";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actions",G__25836)){
return "actions";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-template-registry",G__25836)){
return "cms";
} else {
throw (new Error((""+"Unknown contract class: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value))));

}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});
knoxx.backend.domain.contracts.loader.stderr_BANG_ = (function knoxx$backend$domain$contracts$loader$stderr_BANG_(var_args){
var args__5903__auto__ = [];
var len__5897__auto___26337 = arguments.length;
var i__5898__auto___26338 = (0);
while(true){
if((i__5898__auto___26338 < len__5897__auto___26337)){
args__5903__auto__.push((arguments[i__5898__auto___26338]));

var G__26339 = (i__5898__auto___26338 + (1));
i__5898__auto___26338 = G__26339;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (parts){
return process.stderr.write((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("",parts))+"\n"));
}));

(knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$lang$applyTo = (function (seq25916){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq25916));
}));

if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.contracts !== 'undefined') && (typeof knoxx.backend.domain.contracts.loader !== 'undefined') && (typeof knoxx.backend.domain.contracts.loader.sync_contract_record_cache_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.contracts.loader.sync_contract_record_cache_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.domain.contracts.loader.sync_contract_record_cache_ttl_ms = (2000);
knoxx.backend.domain.contracts.loader.now_ms = (function knoxx$backend$domain$contracts$loader$now_ms(){
return Date.now();
});
knoxx.backend.domain.contracts.loader.invalidate_sync_contract_cache_BANG_ = (function knoxx$backend$domain$contracts$loader$invalidate_sync_contract_cache_BANG_(){
return cljs.core.reset_BANG_(knoxx.backend.domain.contracts.loader.sync_contract_record_cache_STAR_,null);
});
/**
 * Returns absolute path if entry is a non-hidden .edn file, else nil.
 */
knoxx.backend.domain.contracts.loader.entry__GT_file_path = (function knoxx$backend$domain$contracts$loader$entry__GT_file_path(ent){
if(cljs.core.truth_((function (){var and__5160__auto__ = ent.isFile();
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.contracts.loader.contract_edn_filename_QMARK_(ent.name);
} else {
return and__5160__auto__;
}
})())){
return shadow.esm.esm_import$node_path.join(ent.parentPath,ent.name);
} else {
return null;
}
});
/**
 * Find all .edn files under root via recursive readdir. Returns Promise<vector<string>>.
 */
knoxx.backend.domain.contracts.loader.discover_contract_files_BANG_ = (async function knoxx$backend$domain$contracts$loader$discover_contract_files_BANG_(root){
try{var entries = (await shadow.esm.esm_import$node_fs$promises.readdir(root,({"withFileTypes": true, "recursive": true})));
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.loader.entry__GT_file_path,Array.from(entries)));
}catch (e25980){var err = e25980;
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] readdir failed: ",root," \u2014 ",err.message], 0));

return cljs.core.PersistentVector.EMPTY;
}});
knoxx.backend.domain.contracts.loader.keyword__GT_str = (function knoxx$backend$domain$contracts$loader$keyword__GT_str(v){
if((v instanceof cljs.core.Keyword)){
return cljs.core.name(v);
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v));
}
});
knoxx.backend.domain.contracts.loader.extract_contract_identity = (function knoxx$backend$domain$contracts$loader$extract_contract_identity(raw){
var kind = (function (){var G__26013 = (function (){var or__5162__auto__ = (cljs.core.truth_(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(raw))?"actors":null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (cljs.core.truth_(new cljs.core.Keyword("role","id","role/id",-1375589954).cljs$core$IFn$_invoke$arity$1(raw))?"roles":null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (cljs.core.truth_(new cljs.core.Keyword("cap","id","cap/id",-1388434846).cljs$core$IFn$_invoke$arity$1(raw))?"capabilities":null);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (cljs.core.truth_(new cljs.core.Keyword("model","id","model/id",-1274892501).cljs$core$IFn$_invoke$arity$1(raw))?"models":null);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = (cljs.core.truth_(new cljs.core.Keyword("generator","id","generator/id",-1134211231).cljs$core$IFn$_invoke$arity$1(raw))?"generators":null);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = (cljs.core.truth_(new cljs.core.Keyword("schedule","id","schedule/id",-1003403363).cljs$core$IFn$_invoke$arity$1(raw))?"schedules":null);
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"generator","generator",-572962281),new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(raw)))?"generators":null);
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var or__5162__auto____$7 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"schedule","schedule",349275266),new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(raw)))?"schedules":null);
if(cljs.core.truth_(or__5162__auto____$7)){
return or__5162__auto____$7;
} else {
var or__5162__auto____$8 = (cljs.core.truth_(new cljs.core.Keyword("source-mode","id","source-mode/id",-1519550945).cljs$core$IFn$_invoke$arity$1(raw))?"source_modes":null);
if(cljs.core.truth_(or__5162__auto____$8)){
return or__5162__auto____$8;
} else {
var or__5162__auto____$9 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"source-mode","source-mode",725702471),new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(raw)))?"source_modes":null);
if(cljs.core.truth_(or__5162__auto____$9)){
return or__5162__auto____$9;
} else {
var or__5162__auto____$10 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(raw)))?"sources":null);
if(cljs.core.truth_(or__5162__auto____$10)){
return or__5162__auto____$10;
} else {
var or__5162__auto____$11 = (cljs.core.truth_(new cljs.core.Keyword("runtime-feature","id","runtime-feature/id",-160005037).cljs$core$IFn$_invoke$arity$1(raw))?"runtime_features":null);
if(cljs.core.truth_(or__5162__auto____$11)){
return or__5162__auto____$11;
} else {
var or__5162__auto____$12 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721),new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(raw)))?"runtime_features":null);
if(cljs.core.truth_(or__5162__auto____$12)){
return or__5162__auto____$12;
} else {
var or__5162__auto____$13 = (cljs.core.truth_(new cljs.core.Keyword("model-family","id","model-family/id",969625548).cljs$core$IFn$_invoke$arity$1(raw))?"model_families":null);
if(cljs.core.truth_(or__5162__auto____$13)){
return or__5162__auto____$13;
} else {
var or__5162__auto____$14 = new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$14)){
return or__5162__auto____$14;
} else {
return new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(raw);
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
})();
var G__26013__$1 = (((G__26013 == null))?null:knoxx.backend.domain.contracts.loader.keyword__GT_str(G__26013));
var G__26013__$2 = (((G__26013__$1 == null))?null:clojure.string.trim(G__26013__$1));
if((G__26013__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26013__$2);
}
})();
var id = (function (){var G__26048 = (function (){var or__5162__auto__ = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword("role","id","role/id",-1375589954).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword("cap","id","cap/id",-1388434846).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = new cljs.core.Keyword("model","id","model/id",-1274892501).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = new cljs.core.Keyword("model-family","id","model-family/id",969625548).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var or__5162__auto____$7 = new cljs.core.Keyword("generator","id","generator/id",-1134211231).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$7)){
return or__5162__auto____$7;
} else {
var or__5162__auto____$8 = new cljs.core.Keyword("schedule","id","schedule/id",-1003403363).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$8)){
return or__5162__auto____$8;
} else {
var or__5162__auto____$9 = new cljs.core.Keyword("source-mode","id","source-mode/id",-1519550945).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$9)){
return or__5162__auto____$9;
} else {
var or__5162__auto____$10 = new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(raw);
if(cljs.core.truth_(or__5162__auto____$10)){
return or__5162__auto____$10;
} else {
return new cljs.core.Keyword("runtime-feature","id","runtime-feature/id",-160005037).cljs$core$IFn$_invoke$arity$1(raw);
}
}
}
}
}
}
}
}
}
}
}
})();
var G__26048__$1 = (((G__26048 == null))?null:knoxx.backend.domain.contracts.loader.keyword__GT_str(G__26048));
var G__26048__$2 = (((G__26048__$1 == null))?null:clojure.string.trim(G__26048__$1));
if((G__26048__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26048__$2);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = kind;
if(cljs.core.truth_(and__5160__auto__)){
return id;
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [kind,id], null);
} else {
return null;
}
});
knoxx.backend.domain.contracts.loader.validate_and_build = (function knoxx$backend$domain$contracts$loader$validate_and_build(file_path,edn_text,raw){
var vec__26069 = knoxx.backend.domain.contracts.loader.extract_contract_identity(raw);
var raw_kind = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26069,(0),null);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26069,(1),null);
if(cljs.core.truth_((function (){var and__5160__auto__ = raw_kind;
if(cljs.core.truth_(and__5160__auto__)){
return id;
} else {
return and__5160__auto__;
}
})())){
} else {
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] missing :contract/id or :contract/kind: ",file_path], 0));

throw (new Error("missing identity"));
}

var kind = knoxx.backend.domain.contracts.loader.normalize_contract_class(raw_kind);
var valid = knoxx.backend.law.contracts.validate.cljs$core$IFn$_invoke$arity$2(kind,raw);
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(valid))){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok?","ok?",447310304),true,new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),kind,new cljs.core.Keyword(null,"contract","contract",798152745),raw,new cljs.core.Keyword(null,"file-path","file-path",-2005501162),file_path,new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text))], null);
} else {
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] validation failed: ",file_path," \u2014 ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(valid)], 0))], 0));

return null;
}
});
/**
 * Validate one expanded namespace resource definition into a contract record.
 */
knoxx.backend.domain.contracts.loader.namespace_resource_record = (function knoxx$backend$domain$contracts$loader$namespace_resource_record(file_path,edn_text,p__26078){
var map__26079 = p__26078;
var map__26079__$1 = cljs.core.__destructure_map(map__26079);
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26079__$1,new cljs.core.Keyword("resource","kind","resource/kind",-1047940985));
var definition = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26079__$1,new cljs.core.Keyword("resource","definition","resource/definition",-1547661004));
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(cljs.core.name(kind));
var valid = knoxx.backend.law.contracts.validate.cljs$core$IFn$_invoke$arity$2(klass,definition);
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(valid))){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok?","ok?",447310304),true,new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(definition),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),klass,new cljs.core.Keyword(null,"contract","contract",798152745),definition,new cljs.core.Keyword(null,"file-path","file-path",-2005501162),file_path,new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text))], null);
} else {
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] namespace resource validation failed: ",file_path," ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("resource","qualified-id","resource/qualified-id",341105296).cljs$core$IFn$_invoke$arity$1(definition)], 0))," \u2014 ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(valid)], 0))], 0));

return null;
}
});
/**
 * Parse + validate a single .edn file into a vector of contract records.
 * Namespace files ({:namespace ... :resources [...]}) expand to one record per
 * interpreter kind per resource entry; plain contract files yield one record.
 */
knoxx.backend.domain.contracts.loader.parse_contract_file_records_BANG_ = (function knoxx$backend$domain$contracts$loader$parse_contract_file_records_BANG_(file_path,edn_text){
try{var raw = cljs.reader.read_string.cljs$core$IFn$_invoke$arity$1((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text)));
if(cljs.core.truth_((knoxx.backend.domain.resources.namespace_file.namespace_file_QMARK_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.resources.namespace_file.namespace_file_QMARK_.cljs$core$IFn$_invoke$arity$1(raw) : knoxx.backend.domain.resources.namespace_file.namespace_file_QMARK_.call(null,raw)))){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.contracts.loader.namespace_resource_record,file_path,edn_text),(knoxx.backend.domain.resources.namespace_file.namespace_file_definitions.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.resources.namespace_file.namespace_file_definitions.cljs$core$IFn$_invoke$arity$1(raw) : knoxx.backend.domain.resources.namespace_file.namespace_file_definitions.call(null,raw))));
} else {
var temp__5823__auto__ = knoxx.backend.domain.contracts.loader.validate_and_build(file_path,edn_text,raw);
if(cljs.core.truth_(temp__5823__auto__)){
var record = temp__5823__auto__;
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [record], null);
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
}catch (e26083){var err = e26083;
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] parse error: ",file_path," \u2014 ",err.message], 0));

return cljs.core.PersistentVector.EMPTY;
}});
knoxx.backend.domain.contracts.loader.read_contract_file_BANG_ = (async function knoxx$backend$domain$contracts$loader$read_contract_file_BANG_(file_path){
try{return knoxx.backend.domain.contracts.loader.parse_contract_file_records_BANG_(file_path,(await shadow.esm.esm_import$node_fs$promises.readFile(file_path,"utf8")));
}catch (e26088){var err = e26088;
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] read error: ",file_path," \u2014 ",err.message], 0));

return null;
}});
/**
 * First-wins dedup on [contractClass id]. Logs collisions to stderr.
 */
knoxx.backend.domain.contracts.loader.dedup_contracts = (function knoxx$backend$domain$contracts$loader$dedup_contracts(records){
var seen = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,r){
var k = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(r),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(r)], null);
if(cljs.core.truth_((function (){var fexpr__26091 = cljs.core.deref(seen);
return (fexpr__26091.cljs$core$IFn$_invoke$arity$1 ? fexpr__26091.cljs$core$IFn$_invoke$arity$1(k) : fexpr__26091.call(null,k));
})())){
knoxx.backend.domain.contracts.loader.stderr_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[contracts] collision on ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([k], 0))," \u2014 keeping first, ignoring ",new cljs.core.Keyword(null,"file-path","file-path",-2005501162).cljs$core$IFn$_invoke$arity$1(r)], 0));

return acc;
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(seen,cljs.core.conj,k);

return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,r);
}
}),cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,records));
});
/**
 * Synchronously find all .edn files under root. Runtime sync consumers must
 * still parse the files through parse-contract-file! so identity comes from the
 * contract body, not from the directory or filename.
 */
knoxx.backend.domain.contracts.loader.discover_contract_files_sync = (function knoxx$backend$domain$contracts$loader$discover_contract_files_sync(root){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.loader.entry__GT_file_path,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_fs.readdirSync(root,({"withFileTypes": true, "recursive": true})))));
});
knoxx.backend.domain.contracts.loader.load_all_contracts_sync_uncached = (function knoxx$backend$domain$contracts$loader$load_all_contracts_sync_uncached(config){
return knoxx.backend.domain.contracts.loader.dedup_contracts(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (file_path){
return knoxx.backend.domain.contracts.loader.parse_contract_file_records_BANG_(file_path,shadow.esm.esm_import$node_fs.readFileSync(file_path,"utf8"));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.contracts.loader.discover_contract_files_sync,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.contracts.loader.contract_root_paths(config)], 0)))], 0)));
});
/**
 * Synchronously load all contract records through the same parser/validator and
 * [contractClass id] dedup path as load-all-contracts!. This is the escape hatch
 * for startup/runtime code that cannot await but still must not use filepath or
 * folder placement as contract truth.
 * 
 * A short process-local cache prevents startup/model resolution from reparsing
 * the entire contract tree dozens of times in the same tick. Invalid contracts
 * are still omitted; they must not pin the event loop or block HTTP startup.
 */
knoxx.backend.domain.contracts.loader.load_all_contracts_sync = (function knoxx$backend$domain$contracts$loader$load_all_contracts_sync(config){
var now = knoxx.backend.domain.contracts.loader.now_ms();
var roots = knoxx.backend.domain.contracts.loader.contract_root_paths(config);
var cached = cljs.core.deref(knoxx.backend.domain.contracts.loader.sync_contract_record_cache_STAR_);
if(cljs.core.truth_((function (){var and__5160__auto__ = cached;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(roots,new cljs.core.Keyword(null,"roots","roots",-1088919250).cljs$core$IFn$_invoke$arity$1(cached))) && (((now - new cljs.core.Keyword(null,"ts","ts",1617209904).cljs$core$IFn$_invoke$arity$1(cached)) < knoxx.backend.domain.contracts.loader.sync_contract_record_cache_ttl_ms)));
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.Keyword(null,"records","records",1326822832).cljs$core$IFn$_invoke$arity$1(cached);
} else {
var records = knoxx.backend.domain.contracts.loader.load_all_contracts_sync_uncached(config);
cljs.core.reset_BANG_(knoxx.backend.domain.contracts.loader.sync_contract_record_cache_STAR_,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ts","ts",1617209904),now,new cljs.core.Keyword(null,"roots","roots",-1088919250),roots,new cljs.core.Keyword(null,"records","records",1326822832),records], null));

return records;
}
});
knoxx.backend.domain.contracts.loader.find_contract_record_sync = (function knoxx$backend$domain$contracts$loader$find_contract_record_sync(config,contract_class,contract_id){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var wanted_id = (function (){var G__26116 = contract_id;
var G__26116__$1 = (((G__26116 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26116)));
var G__26116__$2 = (((G__26116__$1 == null))?null:clojure.string.trim(G__26116__$1));
if((G__26116__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26116__$2);
}
})();
return cljs.core.some((function (record){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record))))){
return record;
} else {
return null;
}
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config));
});
knoxx.backend.domain.contracts.loader.contract_sync = (function knoxx$backend$domain$contracts$loader$contract_sync(config,contract_class,contract_id){
var G__26126 = knoxx.backend.domain.contracts.loader.find_contract_record_sync(config,contract_class,contract_id);
if((G__26126 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(G__26126);
}
});
/**
 * Discover all .edn files under all contract roots, parse+validate each,
 * deduplicate on [kind id]. Returns Promise<vector<contract-record>>.
 */
knoxx.backend.domain.contracts.loader.load_all_contracts_BANG_ = (async function knoxx$backend$domain$contracts$loader$load_all_contracts_BANG_(config){
var roots = knoxx.backend.domain.contracts.loader.contract_root_paths(config);
var file_lists = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.loader.discover_contract_files_BANG_,roots))));
var files = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__26130_SHARP_){
return Array.from(p1__26130_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([Array.from(file_lists)], 0))));
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.loader.read_contract_file_BANG_,files))));
return knoxx.backend.domain.contracts.loader.dedup_contracts(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.identity,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,Array.from(results))], 0)));
});
knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_ = (async function knoxx$backend$domain$contracts$loader$list_contract_ids_BANG_(var_args){
var G__26147 = arguments.length;
switch (G__26147) {
case 1:
return knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (config){
return knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$core$IFn$_invoke$arity$2(config,"agents");
}));

(knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (config,contract_class){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var all = (await knoxx.backend.domain.contracts.loader.load_all_contracts_BANG_(config));
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26144_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26144_SHARP_),klass);
}),all))));
}));

(knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.contracts.loader.list_agent_contract_ids_BANG_ = (function knoxx$backend$domain$contracts$loader$list_agent_contract_ids_BANG_(config){
return knoxx.backend.domain.contracts.loader.list_contract_ids_BANG_.cljs$core$IFn$_invoke$arity$2(config,"agents");
});
knoxx.backend.domain.contracts.loader.resolve_contracts_dir = (function knoxx$backend$domain$contracts$loader$resolve_contracts_dir(config){
var or__5162__auto__ = cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26152_SHARP_){
return shadow.esm.esm_import$node_fs.existsSync(p1__26152_SHARP_);
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26153_SHARP_){
return shadow.esm.esm_import$node_path.resolve(process.cwd(),p1__26153_SHARP_);
}),knoxx.backend.domain.contracts.loader.contract_root_candidates(config))));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return shadow.esm.esm_import$node_path.resolve(process.cwd(),(function (){var or__5162__auto____$1 = knoxx.backend.domain.contracts.loader.configured_contracts_dir(config);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "../contracts";
}
})());
}
});
knoxx.backend.domain.contracts.loader.contract_class_dir_paths = (function knoxx$backend$domain$contracts$loader$contract_class_dir_paths(config,contract_class){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26163_SHARP_){
return shadow.esm.esm_import$node_path.join(p1__26163_SHARP_,klass);
}),knoxx.backend.domain.contracts.loader.contract_root_paths(config));
});
/**
 * Search for {id}.edn under {root}/{class} recursively.
 */
knoxx.backend.domain.contracts.loader.find_contract_file_recursive = (function knoxx$backend$domain$contracts$loader$find_contract_file_recursive(root,klass,filename){
try{var entries = shadow.esm.esm_import$node_fs.readdirSync(shadow.esm.esm_import$node_path.join(root,klass),({"withFileTypes": true, "recursive": true}));
return cljs.core.some((function (ent){
if(cljs.core.truth_((function (){var and__5160__auto__ = ent.isFile();
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(ent.name,filename);
} else {
return and__5160__auto__;
}
})())){
return shadow.esm.esm_import$node_path.join(ent.parentPath,ent.name);
} else {
return null;
}
}),entries);
}catch (e26188){var _ = e26188;
return null;
}});
knoxx.backend.domain.contracts.loader.contract_file_path = (function knoxx$backend$domain$contracts$loader$contract_file_path(var_args){
var G__26209 = arguments.length;
switch (G__26209) {
case 2:
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$2 = (function (config,contract_id){
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3(config,"agents",contract_id);
}));

(knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3 = (function (config,contract_class,contract_id){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var id = knoxx.backend.domain.contracts.loader.safe_path_segment_BANG_(contract_id,"contract-id");
var filename = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(id)+".edn");
var identity_path = (function (){var G__26225 = knoxx.backend.domain.contracts.loader.find_contract_record_sync(config,klass,id);
if((G__26225 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"file-path","file-path",-2005501162).cljs$core$IFn$_invoke$arity$1(G__26225);
}
})();
var existing = cljs.core.some((function (root){
return knoxx.backend.domain.contracts.loader.find_contract_file_recursive(root,klass,filename);
}),knoxx.backend.domain.contracts.loader.contract_root_paths(config));
var or__5162__auto__ = identity_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = existing;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return shadow.esm.esm_import$node_path.join(knoxx.backend.domain.contracts.loader.resolve_contracts_dir(config),klass,filename);
}
}
}));

(knoxx.backend.domain.contracts.loader.contract_file_path.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.contracts.loader.role_file_path = (function knoxx$backend$domain$contracts$loader$role_file_path(config,slug){
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3(config,"roles",slug);
});
knoxx.backend.domain.contracts.loader.capability_file_path = (function knoxx$backend$domain$contracts$loader$capability_file_path(config,slug){
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3(config,"capabilities",slug);
});
knoxx.backend.domain.contracts.loader.actor_file_path = (function knoxx$backend$domain$contracts$loader$actor_file_path(config,actor_id){
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3(config,"actors",actor_id);
});
knoxx.backend.domain.contracts.loader.read_edn_file_BANG_ = (async function knoxx$backend$domain$contracts$loader$read_edn_file_BANG_(file_path){
var text = (await shadow.esm.esm_import$node_fs$promises.readFile(file_path,"utf8"));
return cljs.reader.read_string.cljs$core$IFn$_invoke$arity$1((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)));
});
knoxx.backend.domain.contracts.loader.ensure_dir_BANG_ = (function knoxx$backend$domain$contracts$loader$ensure_dir_BANG_(dir){
return shadow.esm.esm_import$node_fs$promises.mkdir(dir,({"recursive": true}));
});
knoxx.backend.domain.contracts.loader.write_edn_file_BANG_ = (async function knoxx$backend$domain$contracts$loader$write_edn_file_BANG_(file_path,edn_text){
knoxx.backend.domain.contracts.loader.invalidate_sync_contract_cache_BANG_();

var dir = shadow.esm.esm_import$node_path.dirname(file_path);
(await knoxx.backend.domain.contracts.loader.ensure_dir_BANG_(dir));

return (await shadow.esm.esm_import$node_fs$promises.writeFile(file_path,edn_text,"utf8"));
});
knoxx.backend.domain.contracts.loader.list_contract_ids_sync = (function knoxx$backend$domain$contracts$loader$list_contract_ids_sync(config,contract_class){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26260_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26260_SHARP_));
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config))))));
});
knoxx.backend.domain.contracts.loader.load_contract_BANG_ = (async function knoxx$backend$domain$contracts$loader$load_contract_BANG_(var_args){
var G__26278 = arguments.length;
switch (G__26278) {
case 2:
return knoxx.backend.domain.contracts.loader.load_contract_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.contracts.loader.load_contract_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.loader.load_contract_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (config,contract_id){
return knoxx.backend.domain.contracts.loader.load_contract_BANG_.cljs$core$IFn$_invoke$arity$3(config,"agents",contract_id);
}));

(knoxx.backend.domain.contracts.loader.load_contract_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (config,contract_class,contract_id){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var wanted_id = (await (async function (){var G__26303 = contract_id;
var G__26303__$1 = (((G__26303 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26303)));
var G__26303__$2 = (((G__26303__$1 == null))?null:clojure.string.trim(G__26303__$1));
if((G__26303__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26303__$2);
}
})());
var records = (await knoxx.backend.domain.contracts.loader.load_all_contracts_BANG_(config));
var temp__5823__auto__ = cljs.core.some((function (candidate){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(candidate))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(candidate))))){
return candidate;
} else {
return null;
}
}),records);
if(cljs.core.truth_(temp__5823__auto__)){
var record = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok?","ok?",447310304),true,new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458),new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"contract","contract",798152745),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,"agents"))?knoxx.backend.domain.actor.scope.normalize_agent_contract(new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record)):new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record)),new cljs.core.Keyword(null,"validation","validation",-2141396518),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.PersistentVector.EMPTY], null)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok?","ok?",447310304),false,new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458),"",new cljs.core.Keyword(null,"contract","contract",798152745),null,new cljs.core.Keyword(null,"validation","validation",-2141396518),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"path","path",-188191168),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"message","message",-406056002),"Contract not found"], null)], null)], null)], null);
}
}));

(knoxx.backend.domain.contracts.loader.load_contract_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.contracts.loader.js.map
