import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.promise.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_os.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.eta_mu_session_ingester');
knoxx.backend.infra.eta_mu_session_ingester.HOME_DIR = shadow.esm.esm_import$node_os.homedir();
knoxx.backend.infra.eta_mu_session_ingester.ETA_MU_SESSIONS_ROOT = (function (){var or__5162__auto__ = (process.env["ETA_MU_SESSIONS_ROOT"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return shadow.esm.esm_import$node_path.join(knoxx.backend.infra.eta_mu_session_ingester.HOME_DIR,".\u03B7\u03BC","agent","sessions");
}
})();
knoxx.backend.infra.eta_mu_session_ingester.INGEST_STATE_DIR = (function (){var or__5162__auto__ = (process.env["INGEST_STATE_DIR"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return shadow.esm.esm_import$node_path.join(knoxx.backend.infra.eta_mu_session_ingester.HOME_DIR,".knoxx","eta-mu-ingest-state");
}
})();
knoxx.backend.infra.eta_mu_session_ingester.INGEST_STATE_FILE = shadow.esm.esm_import$node_path.join(knoxx.backend.infra.eta_mu_session_ingester.INGEST_STATE_DIR,"ingested-sessions.json");
knoxx.backend.infra.eta_mu_session_ingester.MAX_EVENTS_PER_BATCH = (200);
knoxx.backend.infra.eta_mu_session_ingester.MAX_TEXT_LENGTH = (12000);
knoxx.backend.infra.eta_mu_session_ingester.ETA_MU_SESSION_PROJECT = (function (){var or__5162__auto__ = (process.env["ETA_MU_SESSION_PROJECT"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "knoxx-session";
}
})();
knoxx.backend.infra.eta_mu_session_ingester.SUPPORTED_EVENT_TYPES = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 7, ["message",null,"thinking_level_change",null,"branch_summary",null,"model_change",null,"compaction",null,"session",null,"custom_message",null], null), null);
knoxx.backend.infra.eta_mu_session_ingester.obj_get = (function knoxx$backend$infra$eta_mu_session_ingester$obj_get(obj,key){
return (obj[key]);
});
knoxx.backend.infra.eta_mu_session_ingester.ensure_state_dir = (function knoxx$backend$infra$eta_mu_session_ingester$ensure_state_dir(){
return shadow.esm.esm_import$node_fs$promises.mkdir(knoxx.backend.infra.eta_mu_session_ingester.INGEST_STATE_DIR,({"recursive": true}));
});
knoxx.backend.infra.eta_mu_session_ingester.load_ingest_state = (async function knoxx$backend$infra$eta_mu_session_ingester$load_ingest_state(){
try{var raw = (await shadow.esm.esm_import$node_fs$promises.readFile(knoxx.backend.infra.eta_mu_session_ingester.INGEST_STATE_FILE,"utf-8"));
return JSON.parse(raw);
}catch (e30584){var _ = e30584;
return ({"sessions": Object.create(null)});
}});
knoxx.backend.infra.eta_mu_session_ingester.save_ingest_state = (async function knoxx$backend$infra$eta_mu_session_ingester$save_ingest_state(state){
(await knoxx.backend.infra.eta_mu_session_ingester.ensure_state_dir());

return shadow.esm.esm_import$node_fs$promises.writeFile(knoxx.backend.infra.eta_mu_session_ingester.INGEST_STATE_FILE,JSON.stringify(state,null,(2)),"utf-8");
});
knoxx.backend.infra.eta_mu_session_ingester.discover_session_files = (async function knoxx$backend$infra$eta_mu_session_ingester$discover_session_files(since_ts){
var since_ts__$1 = (await (async function (){var or__5162__auto__ = since_ts;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
try{var dirs = (await shadow.esm.esm_import$node_fs$promises.readdir(knoxx.backend.infra.eta_mu_session_ingester.ETA_MU_SESSIONS_ROOT));
var dir_results = (await Promise.all(cljs.core.map.cljs$core$IFn$_invoke$arity$2((async function (dir){
var dir_path = shadow.esm.esm_import$node_path.join(knoxx.backend.infra.eta_mu_session_ingester.ETA_MU_SESSIONS_ROOT,dir);
try{var entries = (await shadow.esm.esm_import$node_fs$promises.readdir(dir_path));
return (await Promise.all(cljs.core.map.cljs$core$IFn$_invoke$arity$2((async function (entry){
if(cljs.core.truth_(entry.endsWith(".jsonl"))){
var file_path = shadow.esm.esm_import$node_path.join(dir_path,entry);
try{var s = (await shadow.esm.esm_import$node_fs$promises.stat(file_path));
if((knoxx.backend.infra.eta_mu_session_ingester.obj_get(s,"mtimeMs") > since_ts__$1)){
var match = entry.match(/^[\dT:-]+_(.+)\.jsonl$/);
var session_id = (cljs.core.truth_(match)?(match[(1)]):entry.replace(/\.jsonl$/,""));
return ({"dir": dir, "path": file_path, "sessionId": session_id, "mtime": knoxx.backend.infra.eta_mu_session_ingester.obj_get(s,"mtimeMs"), "size": knoxx.backend.infra.eta_mu_session_ingester.obj_get(s,"size")});
} else {
return null;
}
}catch (e30601){var _ = e30601;
return null;
}} else {
return null;
}
}),entries)));
}catch (e30591){var _ = e30591;
return [];
}}),dirs)));
var flat = cljs.core.filterv(cljs.core.some_QMARK_,cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,r){
if(cljs.core.truth_(cljs.core.array_QMARK_(r))){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(acc,Array.from(r));
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,r);
}
}),cljs.core.PersistentVector.EMPTY,Array.from(dir_results)));
return flat.sort((function (a,b){
return (knoxx.backend.infra.eta_mu_session_ingester.obj_get(a,"mtime") - knoxx.backend.infra.eta_mu_session_ingester.obj_get(b,"mtime"));
}));
}catch (e30588){var _ = e30588;
return [];
}});
knoxx.backend.infra.eta_mu_session_ingester.truncate_text = (function knoxx$backend$infra$eta_mu_session_ingester$truncate_text(text,max_len){
var max_len__$1 = (function (){var or__5162__auto__ = max_len;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.eta_mu_session_ingester.MAX_TEXT_LENGTH;
}
})();
if(((cljs.core.not(text)) || ((text.length <= max_len__$1)))){
return text;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text.slice((0),max_len__$1))+"\n... [truncated "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((text.length - max_len__$1))+" chars]");
}
});
knoxx.backend.infra.eta_mu_session_ingester.extract_text_from_content = (function knoxx$backend$infra$eta_mu_session_ingester$extract_text_from_content(content){
if(cljs.core.truth_(cljs.core.array_QMARK_(content))){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (c){
return knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"text");
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (c){
var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"type"),"text");
if(and__5160__auto__){
return knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"text");
} else {
return and__5160__auto__;
}
}),Array.from(content))));
} else {
return null;
}
});
knoxx.backend.infra.eta_mu_session_ingester.extract_tool_calls = (function knoxx$backend$infra$eta_mu_session_ingester$extract_tool_calls(content){
if(cljs.core.truth_(cljs.core.array_QMARK_(content))){
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (c){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"type"),"toolCall");
}),Array.from(content));
} else {
return null;
}
});
knoxx.backend.infra.eta_mu_session_ingester.extract_thinking = (function knoxx$backend$infra$eta_mu_session_ingester$extract_thinking(content){
if(cljs.core.truth_(cljs.core.array_QMARK_(content))){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (c){
return knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"text");
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (c){
var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"type"),"thinking");
if(and__5160__auto__){
return knoxx.backend.infra.eta_mu_session_ingester.obj_get(c,"text");
} else {
return and__5160__auto__;
}
}),Array.from(content))));
} else {
return null;
}
});
knoxx.backend.infra.eta_mu_session_ingester.env_workspace_roots = (function knoxx$backend$infra$eta_mu_session_ingester$env_workspace_roots(){
return cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__30754_SHARP_){
return clojure.string.blank_QMARK_((function (){var or__5162__auto__ = p1__30754_SHARP_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__30753_SHARP_){
return (process.env[p1__30753_SHARP_]);
}),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["WORKSPACE_ROOT","WORKSPACE_PATH","KNOXX_WORKSPACE_ROOT"], null))));
});
knoxx.backend.infra.eta_mu_session_ingester.strip_path_prefix = (function knoxx$backend$infra$eta_mu_session_ingester$strip_path_prefix(prefix,value){
var clean_prefix = (function (){var G__30777 = prefix;
var G__30777__$1 = (((G__30777 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30777)));
if((G__30777__$1 == null)){
return null;
} else {
return clojure.string.replace(G__30777__$1,/\/+$/,"");
}
})();
if(clojure.string.blank_QMARK_((function (){var or__5162__auto__ = clean_prefix;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())){
return null;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value,clean_prefix)){
return "";
} else {
if(clojure.string.starts_with_QMARK_(value,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clean_prefix)+"/"))){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2(value,(cljs.core.count(clean_prefix) + (1)));
} else {
return null;

}
}
}
});
knoxx.backend.infra.eta_mu_session_ingester.cwd_to_project = (function knoxx$backend$infra$eta_mu_session_ingester$cwd_to_project(cwd){
if(cljs.core.not(cwd)){
return "eta-mu";
} else {
var normalized_cwd = clojure.string.replace(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cwd)),/\\\\/,"/"),/\/+/,"/");
var normalized = (function (){var or__5162__auto__ = cljs.core.some((function (p1__30789_SHARP_){
return knoxx.backend.infra.eta_mu_session_ingester.strip_path_prefix(p1__30789_SHARP_,normalized_cwd);
}),knoxx.backend.infra.eta_mu_session_ingester.env_workspace_roots());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.eta_mu_session_ingester.strip_path_prefix(knoxx.backend.infra.eta_mu_session_ingester.HOME_DIR,normalized_cwd);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return clojure.string.replace(normalized_cwd,/^\//,"");
}
}
})();
if(clojure.string.blank_QMARK_(normalized)){
return "eta-mu";
} else {
return normalized;
}
}
});
knoxx.backend.infra.eta_mu_session_ingester.make_event = (function knoxx$backend$infra$eta_mu_session_ingester$make_event(session_id,kind,ts,text,meta,extra){
var evt = ({"schema": "openplanner.event.v1", "meta": meta, "extra": extra, "source": "eta-mu-session-ingester", "ts": ts, "source_ref": ({"project": knoxx.backend.infra.eta_mu_session_ingester.ETA_MU_SESSION_PROJECT, "session": session_id}), "id": (""+"eta-mu:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(extra.id)), "kind": (""+"eta-mu."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)), "text": knoxx.backend.infra.eta_mu_session_ingester.truncate_text(text,null)});
return evt;
});
knoxx.backend.infra.eta_mu_session_ingester.map_session_event = (function knoxx$backend$infra$eta_mu_session_ingester$map_session_event(eta_mu_event,session_id,cwd){
var id = (function (){var or__5162__auto__ = eta_mu_event.id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})();
return [knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"session_start",eta_mu_event.timestamp,(""+"eta-mu session started in "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cwd)),({"role": "system", "author": "eta-mu", "eta_mu_session_version": eta_mu_event.version, "eta_mu_cwd": cwd}),({"id": id, "eta_mu_session_id": eta_mu_event.id, "eta_mu_version": eta_mu_event.version, "workspace": cwd, "eta_mu_workspace_project": knoxx.backend.infra.eta_mu_session_ingester.cwd_to_project(cwd)}))];
});
knoxx.backend.infra.eta_mu_session_ingester.map_model_change_event = (function knoxx$backend$infra$eta_mu_session_ingester$map_model_change_event(eta_mu_event,session_id){
return [knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"model_change",knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),(""+"Model: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"provider");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"modelId");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),({"role": "system", "author": "eta-mu"}),({"id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "provider": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"provider"), "model_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"modelId")}))];
});
knoxx.backend.infra.eta_mu_session_ingester.map_compaction_event = (function knoxx$backend$infra$eta_mu_session_ingester$map_compaction_event(eta_mu_event,session_id,cwd){
var summary = (function (){var or__5162__auto__ = eta_mu_event.summary;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
if(clojure.string.blank_QMARK_(summary)){
return [];
} else {
return [knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"compaction",eta_mu_event.timestamp,summary,({"role": "system", "author": "eta-mu"}),({"id": eta_mu_event.id, "compaction": true, "eta_mu_workspace_project": knoxx.backend.infra.eta_mu_session_ingester.cwd_to_project(cwd)}))];
}
});
knoxx.backend.infra.eta_mu_session_ingester.map_custom_message_event = (function knoxx$backend$infra$eta_mu_session_ingester$map_custom_message_event(eta_mu_event,session_id,cwd){
var content = knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"content");
if(((cljs.core.not(content)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"display"),false)))){
return [];
} else {
return [knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,(""+"custom."+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"customType");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})())),knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),((typeof content === 'string')?content:JSON.stringify(content)),({"role": "system", "author": "eta-mu"}),({"id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "custom_type": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"customType"), "eta_mu_workspace_project": knoxx.backend.infra.eta_mu_session_ingester.cwd_to_project(cwd)}))];
}
});
knoxx.backend.infra.eta_mu_session_ingester.map_user_message = (function knoxx$backend$infra$eta_mu_session_ingester$map_user_message(eta_mu_event,session_id,msg,cwd){
var text = knoxx.backend.infra.eta_mu_session_ingester.extract_text_from_content(knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"content"));
if(clojure.string.blank_QMARK_(text)){
return [];
} else {
return [knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"message",knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),text,({"role": "user", "author": "user"}),({"id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "eta_mu_message_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "eta_mu_parent_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"parentId"), "eta_mu_workspace_project": knoxx.backend.infra.eta_mu_session_ingester.cwd_to_project(cwd)}))];
}
});
knoxx.backend.infra.eta_mu_session_ingester.map_assistant_message = (function knoxx$backend$infra$eta_mu_session_ingester$map_assistant_message(eta_mu_event,session_id,msg,cwd){
var text = knoxx.backend.infra.eta_mu_session_ingester.extract_text_from_content(knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"content"));
var thinking = knoxx.backend.infra.eta_mu_session_ingester.extract_thinking(knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"content"));
var tool_calls = knoxx.backend.infra.eta_mu_session_ingester.extract_tool_calls(knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"content"));
var model = (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"model");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"provider");
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "unknown";
}
}
})();
var events = [];
if((!(clojure.string.blank_QMARK_(text)))){
events.push(knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"message",knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),text,({"role": "assistant", "author": "eta-mu", "model": model}),({"id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "eta_mu_message_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "eta_mu_parent_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"parentId"), "provider": knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"provider"), "model": knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"model"), "usage": (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"usage");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "stop_reason": (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"stopReason");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
})(), "eta_mu_workspace_project": knoxx.backend.infra.eta_mu_session_ingester.cwd_to_project(cwd)})));
} else {
}

if((!(clojure.string.blank_QMARK_(thinking)))){
events.push(knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"reasoning",knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),thinking,({"role": "system", "author": "eta-mu", "model": model}),({"id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"))+"-thinking"), "eta_mu_message_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id")})));
} else {
}

var seq__30891_31041 = cljs.core.seq(Array.from(tool_calls));
var chunk__30892_31042 = null;
var count__30893_31043 = (0);
var i__30894_31044 = (0);
while(true){
if((i__30894_31044 < count__30893_31043)){
var tc_31045 = chunk__30892_31042.cljs$core$IIndexed$_nth$arity$2(null,i__30894_31044);
var tool_name_31046 = (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31045,"name");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})();
var args_preview_31047 = (cljs.core.truth_(knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31045,"arguments"))?knoxx.backend.infra.eta_mu_session_ingester.truncate_text(JSON.stringify(knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31045,"arguments")),(2000)):null);
events.push(knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"tool_call",knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),knoxx.backend.infra.eta_mu_session_ingester.truncate_text((""+"Tool: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name_31046)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = args_preview_31047;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),null),({"role": "system", "author": "eta-mu", "model": model}),({"id": (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31045,"id");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id");
}
})(), "eta_mu_message_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "tool_name": tool_name_31046, "tool_call_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31045,"id"), "tool_arguments_preview": args_preview_31047})));


var G__31049 = seq__30891_31041;
var G__31050 = chunk__30892_31042;
var G__31051 = count__30893_31043;
var G__31052 = (i__30894_31044 + (1));
seq__30891_31041 = G__31049;
chunk__30892_31042 = G__31050;
count__30893_31043 = G__31051;
i__30894_31044 = G__31052;
continue;
} else {
var temp__5825__auto___31053 = cljs.core.seq(seq__30891_31041);
if(temp__5825__auto___31053){
var seq__30891_31054__$1 = temp__5825__auto___31053;
if(cljs.core.chunked_seq_QMARK_(seq__30891_31054__$1)){
var c__5694__auto___31055 = cljs.core.chunk_first(seq__30891_31054__$1);
var G__31059 = cljs.core.chunk_rest(seq__30891_31054__$1);
var G__31060 = c__5694__auto___31055;
var G__31061 = cljs.core.count(c__5694__auto___31055);
var G__31062 = (0);
seq__30891_31041 = G__31059;
chunk__30892_31042 = G__31060;
count__30893_31043 = G__31061;
i__30894_31044 = G__31062;
continue;
} else {
var tc_31064 = cljs.core.first(seq__30891_31054__$1);
var tool_name_31065 = (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31064,"name");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})();
var args_preview_31066 = (cljs.core.truth_(knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31064,"arguments"))?knoxx.backend.infra.eta_mu_session_ingester.truncate_text(JSON.stringify(knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31064,"arguments")),(2000)):null);
events.push(knoxx.backend.infra.eta_mu_session_ingester.make_event(session_id,"tool_call",knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"timestamp"),knoxx.backend.infra.eta_mu_session_ingester.truncate_text((""+"Tool: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name_31065)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = args_preview_31066;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),null),({"role": "system", "author": "eta-mu", "model": model}),({"id": (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31064,"id");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id");
}
})(), "eta_mu_message_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"id"), "tool_name": tool_name_31065, "tool_call_id": knoxx.backend.infra.eta_mu_session_ingester.obj_get(tc_31064,"id"), "tool_arguments_preview": args_preview_31066})));


var G__31069 = cljs.core.next(seq__30891_31054__$1);
var G__31070 = null;
var G__31071 = (0);
var G__31072 = (0);
seq__30891_31041 = G__31069;
chunk__30892_31042 = G__31070;
count__30893_31043 = G__31071;
i__30894_31044 = G__31072;
continue;
}
} else {
}
}
break;
}

return events;
});
knoxx.backend.infra.eta_mu_session_ingester.map_eta_mu_event_to_events = (function knoxx$backend$infra$eta_mu_session_ingester$map_eta_mu_event_to_events(eta_mu_event,session_meta){
var event_type = knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"type");
var session_id = session_meta.sessionId;
var cwd = knoxx.backend.infra.eta_mu_session_ingester.obj_get(session_meta,"cwd");
if((!(cljs.core.contains_QMARK_(knoxx.backend.infra.eta_mu_session_ingester.SUPPORTED_EVENT_TYPES,event_type)))){
return [];
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"session")){
return knoxx.backend.infra.eta_mu_session_ingester.map_session_event(eta_mu_event,session_id,cwd);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"model_change")){
return knoxx.backend.infra.eta_mu_session_ingester.map_model_change_event(eta_mu_event,session_id);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"thinking_level_change")){
return [];
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"compaction")){
return knoxx.backend.infra.eta_mu_session_ingester.map_compaction_event(eta_mu_event,session_id,cwd);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"custom_message")){
return knoxx.backend.infra.eta_mu_session_ingester.map_custom_message_event(eta_mu_event,session_id,cwd);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"message")){
var msg = (function (){var or__5162__auto__ = knoxx.backend.infra.eta_mu_session_ingester.obj_get(eta_mu_event,"message");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})();
var role = knoxx.backend.infra.eta_mu_session_ingester.obj_get(msg,"role");
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(role,"user")){
return knoxx.backend.infra.eta_mu_session_ingester.map_user_message(eta_mu_event,session_id,msg,cwd);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(role,"assistant")){
return knoxx.backend.infra.eta_mu_session_ingester.map_assistant_message(eta_mu_event,session_id,msg,cwd);
} else {
return [];

}
}
} else {
return [];

}
}
}
}
}
}
}
});
knoxx.backend.infra.eta_mu_session_ingester.parse_session_file = (async function knoxx$backend$infra$eta_mu_session_ingester$parse_session_file(file_path){
var raw = (await shadow.esm.esm_import$node_fs$promises.readFile(file_path,"utf-8"));
var lines = raw.split("\n");
var events = [];
var session_meta = ({"sessionId": "unknown", "cwd": "/unknown"});
var seq__30918_31078 = cljs.core.seq(Array.from(lines));
var chunk__30919_31079 = null;
var count__30920_31080 = (0);
var i__30921_31081 = (0);
while(true){
if((i__30921_31081 < count__30920_31080)){
var line_31083 = chunk__30919_31079.cljs$core$IIndexed$_nth$arity$2(null,i__30921_31081);
var trimmed_31084 = line_31083.trim();
if((!(clojure.string.blank_QMARK_(trimmed_31084)))){
try{var parsed_31089 = JSON.parse(trimmed_31084);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(parsed_31089.type,"session")){
(session_meta["sessionId"] = (await (async function (){var or__5162__auto__ = parsed_31089.id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})()));

(session_meta["cwd"] = (await (async function (){var or__5162__auto__ = parsed_31089.cwd;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/unknown";
}
})()));
} else {
}

events.push(parsed_31089);
}catch (e30929){var __31093 = e30929;
}} else {
}


var G__31094 = seq__30918_31078;
var G__31095 = chunk__30919_31079;
var G__31096 = count__30920_31080;
var G__31097 = (i__30921_31081 + (1));
seq__30918_31078 = G__31094;
chunk__30919_31079 = G__31095;
count__30920_31080 = G__31096;
i__30921_31081 = G__31097;
continue;
} else {
var temp__5825__auto___31098 = cljs.core.seq(seq__30918_31078);
if(temp__5825__auto___31098){
var seq__30918_31099__$1 = temp__5825__auto___31098;
if(cljs.core.chunked_seq_QMARK_(seq__30918_31099__$1)){
var c__5694__auto___31100 = cljs.core.chunk_first(seq__30918_31099__$1);
var G__31101 = cljs.core.chunk_rest(seq__30918_31099__$1);
var G__31102 = c__5694__auto___31100;
var G__31103 = cljs.core.count(c__5694__auto___31100);
var G__31104 = (0);
seq__30918_31078 = G__31101;
chunk__30919_31079 = G__31102;
count__30920_31080 = G__31103;
i__30921_31081 = G__31104;
continue;
} else {
var line_31105 = cljs.core.first(seq__30918_31099__$1);
var trimmed_31106 = line_31105.trim();
if((!(clojure.string.blank_QMARK_(trimmed_31106)))){
try{var parsed_31107 = JSON.parse(trimmed_31106);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(parsed_31107.type,"session")){
(session_meta["sessionId"] = (await (async function (){var or__5162__auto__ = parsed_31107.id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})()));

(session_meta["cwd"] = (await (async function (){var or__5162__auto__ = parsed_31107.cwd;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/unknown";
}
})()));
} else {
}

events.push(parsed_31107);
}catch (e30930){var __31109 = e30930;
}} else {
}


var G__31110 = cljs.core.next(seq__30918_31099__$1);
var G__31111 = null;
var G__31112 = (0);
var G__31113 = (0);
seq__30918_31078 = G__31110;
chunk__30919_31079 = G__31111;
count__30920_31080 = G__31112;
i__30921_31081 = G__31113;
continue;
}
} else {
}
}
break;
}

return ({"events": events, "sessionMeta": session_meta});
});
knoxx.backend.infra.eta_mu_session_ingester.ingest_session_file = (async function knoxx$backend$infra$eta_mu_session_ingester$ingest_session_file(file_path,_session_file_meta,client){
var map__30937 = (await knoxx.backend.infra.eta_mu_session_ingester.parse_session_file(file_path));
var map__30937__$1 = cljs.core.__destructure_map(map__30937);
var events = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30937__$1,new cljs.core.Keyword(null,"events","events",1792552201));
var session_meta = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30937__$1,new cljs.core.Keyword(null,"session-meta","session-meta",2135624586));
var all_op_events = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,eta_mu_event){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(Array.from(acc),Array.from(knoxx.backend.infra.eta_mu_session_ingester.map_eta_mu_event_to_events(eta_mu_event,session_meta)));
}),[],Array.from(events));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(all_op_events.length,(0))){
return ({"sessionId": session_meta.sessionId, "eventsIngested": (0), "batches": (0)});
} else {
var promises = [];
var events_ingested = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
var batches = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
var i_31116 = (0);
while(true){
if((i_31116 < all_op_events.length)){
var batch_31118 = all_op_events.slice(i_31116,(i_31116 + knoxx.backend.infra.eta_mu_session_ingester.MAX_EVENTS_PER_BATCH));
promises.push(((function (i_31116,batch_31118,promises,events_ingested,batches,map__30937,map__30937__$1,events,session_meta,all_op_events){
return (async function (){
try{(await knoxx.backend.infra.clients.openplanner.events_BANG_(client,batch_31118));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(events_ingested,cljs.core._PLUS_,batch_31118.length);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(batches,cljs.core.inc);
}catch (e30942){var err = e30942;
return console.error((""+"[eta-mu-ingester] Batch failed for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_meta.sessionId)+":"),err.message);
}});})(i_31116,batch_31118,promises,events_ingested,batches,map__30937,map__30937__$1,events,session_meta,all_op_events))
());

var G__31119 = (i_31116 + knoxx.backend.infra.eta_mu_session_ingester.MAX_EVENTS_PER_BATCH);
i_31116 = G__31119;
continue;
} else {
}
break;
}

(await Promise.all(promises));

return ({"sessionId": session_meta.sessionId, "eventsIngested": cljs.core.deref(events_ingested), "batches": cljs.core.deref(batches)});
}
});
/**
 * Aggregate ingest results into a summary JS object.
 */
knoxx.backend.infra.eta_mu_session_ingester.aggregate_ingest_results = (async function knoxx$backend$infra$eta_mu_session_ingester$aggregate_ingest_results(results_atom,files,to_ingest,state){
(await knoxx.backend.infra.eta_mu_session_ingester.save_ingest_state(state));

var results = cljs.core.deref(results_atom);
var total_events = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (sum,r){
return (sum + (function (){var or__5162__auto__ = r.eventsIngested;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
}),(0),Array.from(results));
var errors = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (cnt,r){
if(cljs.core.truth_(r.error)){
return (cnt + (1));
} else {
return cnt;
}
}),(0),Array.from(results));
return ({"ok": true, "scanned": files.length, "newSessions": to_ingest.length, "ingested": (to_ingest.length - errors), "totalEvents": total_events, "errors": errors, "details": results});
});
/**
 * Ingest a single session file and update state.
 */
knoxx.backend.infra.eta_mu_session_ingester.ingest_single_session_BANG_ = (async function knoxx$backend$infra$eta_mu_session_ingester$ingest_single_session_BANG_(file,state,results_atom,client){
try{var result = (await knoxx.backend.infra.eta_mu_session_ingester.ingest_session_file(file.path,file,client));
(state.sessions[file.sessionId] = ({"mtime": file.mtime, "eventCount": result.eventsIngested, "ingestedAt": (new Date()).toISOString(), "dir": file.dir, "size": file.size}));

return cljs.core.deref(results_atom).push(result);
}catch (e30960){var err = e30960;
console.error((""+"[eta-mu-ingester] Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(file.sessionId)+":"),err.message);

return cljs.core.deref(results_atom).push(({"sessionId": file.sessionId, "error": err.message, "eventsIngested": (0), "batches": (0)}));
}});
knoxx.backend.infra.eta_mu_session_ingester.run_eta_mu_session_ingest = (async function knoxx$backend$infra$eta_mu_session_ingester$run_eta_mu_session_ingest(p__30963){
var map__30964 = p__30963;
var map__30964__$1 = cljs.core.__destructure_map(map__30964);
var openplanner_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30964__$1,new cljs.core.Keyword(null,"openplanner-client","openplanner-client",-1926799348));
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30964__$1,new cljs.core.Keyword(null,"config","config",994861415));
var force = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__30964__$1,new cljs.core.Keyword(null,"force","force",781957286),false);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__30964__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363),(50));
var session_dirs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30964__$1,new cljs.core.Keyword(null,"session-dirs","session-dirs",-866597807));
var client = (await (async function (){var or__5162__auto__ = openplanner_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.truth_(config)){
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
} else {
return null;
}
}
})());
if(cljs.core.truth_(client)){
} else {
throw (new Error("OpenPlanner client or config is required"));
}

var limit__$1 = (await (async function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (50);
}
})());
try{var state = (await (cljs.core.truth_(force)?Promise.resolve(({"sessions": Object.create(null)})):knoxx.backend.infra.eta_mu_session_ingester.load_ingest_state()));
var all_files = (await knoxx.backend.infra.eta_mu_session_ingester.discover_session_files((0)));
var files = (cljs.core.truth_(session_dirs)?all_files.filter((function (f){
return cljs.core.some((function (d){
return f.dir.includes(d);
}),session_dirs);
})):all_files);
var new_files = (cljs.core.truth_(force)?files:files.filter((function (f){
var existing = (state.sessions[f.sessionId]);
return ((cljs.core.not(existing)) || (((function (){var or__5162__auto____$1 = existing.mtime;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (0);
}
})() < f.mtime)));
})));
var to_ingest = new_files.slice((0),limit__$1);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(to_ingest.length,(0))){
return ({"ok": true, "scanned": files.length, "newSessions": (0), "ingested": (0), "totalEvents": (0), "skipped": (files.length - to_ingest.length)});
} else {
var results_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1([]);
var seq__30971_31130 = cljs.core.seq(Array.from(to_ingest));
var chunk__30972_31131 = null;
var count__30973_31132 = (0);
var i__30974_31133 = (0);
while(true){
if((i__30974_31133 < count__30973_31132)){
var file_31136 = chunk__30972_31131.cljs$core$IIndexed$_nth$arity$2(null,i__30974_31133);
(await knoxx.backend.infra.eta_mu_session_ingester.ingest_single_session_BANG_(file_31136,state,results_atom,client));


var G__31137 = seq__30971_31130;
var G__31138 = chunk__30972_31131;
var G__31139 = count__30973_31132;
var G__31140 = (i__30974_31133 + (1));
seq__30971_31130 = G__31137;
chunk__30972_31131 = G__31138;
count__30973_31132 = G__31139;
i__30974_31133 = G__31140;
continue;
} else {
var temp__5825__auto___31145 = cljs.core.seq(seq__30971_31130);
if(temp__5825__auto___31145){
var seq__30971_31146__$1 = temp__5825__auto___31145;
if(cljs.core.chunked_seq_QMARK_(seq__30971_31146__$1)){
var c__5694__auto___31147 = cljs.core.chunk_first(seq__30971_31146__$1);
var G__31149 = cljs.core.chunk_rest(seq__30971_31146__$1);
var G__31151 = c__5694__auto___31147;
var G__31152 = cljs.core.count(c__5694__auto___31147);
var G__31154 = (0);
seq__30971_31130 = G__31149;
chunk__30972_31131 = G__31151;
count__30973_31132 = G__31152;
i__30974_31133 = G__31154;
continue;
} else {
var file_31159 = cljs.core.first(seq__30971_31146__$1);
(await knoxx.backend.infra.eta_mu_session_ingester.ingest_single_session_BANG_(file_31159,state,results_atom,client));


var G__31160 = cljs.core.next(seq__30971_31146__$1);
var G__31161 = null;
var G__31162 = (0);
var G__31163 = (0);
seq__30971_31130 = G__31160;
chunk__30972_31131 = G__31161;
count__30973_31132 = G__31162;
i__30974_31133 = G__31163;
continue;
}
} else {
}
}
break;
}

return (await knoxx.backend.infra.eta_mu_session_ingester.aggregate_ingest_results(results_atom,files,to_ingest,state));
}
}catch (e30965){var err = e30965;
return ({"ok": false, "error": err.message});
}});
knoxx.backend.infra.eta_mu_session_ingester.get_eta_mu_ingest_status = (async function knoxx$backend$infra$eta_mu_session_ingester$get_eta_mu_ingest_status(){
var vec__30984 = (await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.eta_mu_session_ingester.load_ingest_state(),knoxx.backend.infra.eta_mu_session_ingester.discover_session_files((0))], null)));
var state = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30984,(0),null);
var all_files = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30984,(1),null);
var state__$1 = state;
var ingested_ids = (new Set(Object.keys(state__$1.sessions)));
var pending = all_files.filter((function (f){
return cljs.core.not(ingested_ids.has(f.sessionId));
}));
var stale = all_files.filter((function (f){
var existing = (state__$1.sessions[f.sessionId]);
var and__5160__auto__ = existing;
if(cljs.core.truth_(and__5160__auto__)){
return ((function (){var or__5162__auto__ = existing.mtime;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < f.mtime);
} else {
return and__5160__auto__;
}
}));
var total_ingested = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (sum,s){
return (sum + (function (){var or__5162__auto__ = (s["eventCount"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
}),(0),Object.values(state__$1.sessions));
var last_ingested = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (max_val,s){
var at = (s["ingestedAt"]);
if(cljs.core.truth_((function (){var and__5160__auto__ = at;
if(cljs.core.truth_(and__5160__auto__)){
return (at.length() > max_val.length());
} else {
return and__5160__auto__;
}
})())){
return at;
} else {
return max_val;
}
}),"",Object.values(state__$1.sessions));
var recent = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__30991){
var vec__30992 = p__30991;
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30992,(0),null);
var s = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30992,(1),null);
return ({"sessionId": id, "eventCount": (s["eventCount"]), "ingestedAt": (s["ingestedAt"]), "dir": (s["dir"])});
}),cljs.core.take.cljs$core$IFn$_invoke$arity$2((10),cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3((function (p__30996){
var vec__30997 = p__30996;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30997,(0),null);
var s = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30997,(1),null);
return (s["ingestedAt"]);
}),(function (p1__30982_SHARP_,p2__30983_SHARP_){
return (p1__30982_SHARP_ > p2__30983_SHARP_);
}),Object.entries(state__$1.sessions))));
return ({"recentIngested": cljs.core.clj__GT_js(recent), "staleSessions": stale.length, "totalIngestedEvents": total_ingested, "totalSessionFiles": all_files.length, "etaMuSessionsRoot": knoxx.backend.infra.eta_mu_session_ingester.ETA_MU_SESSIONS_ROOT, "lastIngestedAt": last_ingested, "ingestedSessions": ingested_ids.size, "ok": true, "pendingSessions": pending.length});
});
knoxx.backend.infra.eta_mu_session_ingester.list_eta_mu_sessions = (async function knoxx$backend$infra$eta_mu_session_ingester$list_eta_mu_sessions(p__31002){
var map__31003 = p__31002;
var map__31003__$1 = cljs.core.__destructure_map(map__31003);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__31003__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363),(50));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__31003__$1,new cljs.core.Keyword(null,"offset","offset",296498311),(0));
var workspace = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31003__$1,new cljs.core.Keyword(null,"workspace","workspace",-1096735709));
var all_files = (await knoxx.backend.infra.eta_mu_session_ingester.discover_session_files((0)));
var filtered = (cljs.core.truth_(workspace)?all_files.filter((function (f){
return f.dir.includes(workspace);
})):all_files);
var sorted = filtered.sort((function (a,b){
return (b.mtime - a.mtime);
}));
var total = sorted.length;
var page = sorted.slice(offset,(offset + limit));
var sessions = (await Promise.all(cljs.core.map.cljs$core$IFn$_invoke$arity$2((async function (f){
try{var raw = (await shadow.esm.esm_import$node_fs$promises.readFile(f.path,"utf-8"));
var lines = raw.split("\n");
var first_line = cljs.core.some((function (l){
if((!(clojure.string.blank_QMARK_(l.trim())))){
return l;
} else {
return null;
}
}),Array.from(lines));
if(cljs.core.not(first_line)){
return ({"sessionId": f.sessionId, "workspace": f.dir, "lastModified": (new Date(f.mtime)).toISOString(), "fileSize": f.size, "dir": f.dir});
} else {
try{var header = JSON.parse(first_line.trim());
var msg_count = (await (async function (){var or__5162__auto__ = raw.match((new RegExp("\"type\":\"message\"","g"))).length();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
var tool_count = (await (async function (){var or__5162__auto__ = raw.match((new RegExp("\"type\":\"toolCall\"","g"))).length();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
return ({"sessionId": (await (async function (){var or__5162__auto__ = header.id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return f.sessionId;
}
})()), "workspace": (await (async function (){var or__5162__auto__ = header.cwd;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return f.dir;
}
})()), "startTime": header.timestamp, "lastModified": (new Date(f.mtime)).toISOString(), "messageCount": msg_count, "toolCallCount": tool_count, "fileSize": f.size, "dir": f.dir});
}catch (e31010){var _ = e31010;
return ({"sessionId": f.sessionId, "workspace": f.dir, "lastModified": (new Date(f.mtime)).toISOString(), "fileSize": f.size, "dir": f.dir});
}}
}catch (e31005){var _ = e31005;
return ({"sessionId": f.sessionId, "workspace": f.dir, "lastModified": (new Date(f.mtime)).toISOString(), "fileSize": f.size, "dir": f.dir});
}}),Array.from(page))));
var valid = sessions.filter(cljs.core.some_QMARK_);
return ({"ok": true, "sessions": valid, "total": total, "offset": offset, "limit": limit, "has_more": ((offset + valid.length) < total)});
});

//# sourceMappingURL=knoxx.backend.infra.eta_mu_session_ingester.js.map
