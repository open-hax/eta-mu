import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.document_state.js";
import "./knoxx.backend.extern.promise.js";
import "./knoxx.backend.extern.row_extra.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.infra.config.js";
import "./knoxx.backend.infra.tooling.js";
goog.provide('knoxx.backend.infra.core_memory');
knoxx.backend.infra.core_memory.parse_json_object = (function knoxx$backend$infra$core_memory$parse_json_object(value){
return knoxx.backend.extern.row_extra.parse_core_memory_extra(value);
});
knoxx.backend.infra.core_memory.row_extra_map = (function knoxx$backend$infra$core_memory$row_extra_map(row){
var or__5162__auto__ = knoxx.backend.extern.row_extra.parse_core_memory_extra(new cljs.core.Keyword(null,"extra","extra",1612569067).cljs$core$IFn$_invoke$arity$1(row));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
});
knoxx.backend.infra.core_memory.workspace_path_pattern = /((?:orgs|packages|services|docs|spec|specs|tools|ecosystems|src|worktrees|\.ημ)\/[A-Za-z0-9._~:\/+-]+)/;
/**
 * Backward-compatible alias for callers/tests using the old devel-lake name.
 */
knoxx.backend.infra.core_memory.devel_path_pattern = knoxx.backend.infra.core_memory.workspace_path_pattern;
knoxx.backend.infra.core_memory.url_pattern = /https?:\/\/[A-Za-z0-9._~:\/?#\[\]@!$&'()*+,;=%-]+/;
knoxx.backend.infra.core_memory.trim_mention_token = (function knoxx$backend$infra$core_memory$trim_mention_token(value){
return clojure.string.replace(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value)),/^[\s`'\"\(\[\{<]+/,""),/[\s`'\"\)\]\}>:;,.!?]+$/,"");
});
knoxx.backend.infra.core_memory.normalize_web_url = (function knoxx$backend$infra$core_memory$normalize_web_url(value){
var raw = knoxx.backend.infra.core_memory.trim_mention_token(value);
if(clojure.string.blank_QMARK_(raw)){
return null;
} else {
try{var parsed = (new URL(raw));
(parsed.hash = "");

if(clojure.string.blank_QMARK_(parsed.pathname)){
(parsed.pathname = "/");
} else {
}

return parsed.toString();
}catch (e27850){var _ = e27850;
return null;
}}
});
knoxx.backend.infra.core_memory.extract_mentioned_urls = (function knoxx$backend$infra$core_memory$extract_mentioned_urls(text){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.core_memory.normalize_web_url,cljs.core.re_seq(knoxx.backend.infra.core_memory.url_pattern,(function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))));
});
knoxx.backend.infra.core_memory.known_extensionless_files = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 6, ["Justfile",null,"Dockerfile",null,"Caddyfile",null,"Makefile",null,"Brewfile",null,"Procfile",null], null), null);
knoxx.backend.infra.core_memory.basename = (function knoxx$backend$infra$core_memory$basename(path){
var G__27859 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path));
var G__27859__$1 = (((G__27859 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__27859,/\//));
if((G__27859__$1 == null)){
return null;
} else {
return cljs.core.last(G__27859__$1);
}
});
knoxx.backend.infra.core_memory.normalize_workspace_path = (function knoxx$backend$infra$core_memory$normalize_workspace_path(path){
return knoxx.backend.infra.document_state.normalize_relative_path(path);
});
knoxx.backend.infra.core_memory.workspace_project_name = (function knoxx$backend$infra$core_memory$workspace_project_name(){
var or__5162__auto__ = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.config.cfg());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "workspace";
}
});
/**
 * Heuristic: treat workspace mentions as file nodes when the token looks like a file.
 * 
 *   Everything else is treated as a directory structural node (<project>:dir:*).
 */
knoxx.backend.infra.core_memory.likely_file_path_QMARK_ = (function knoxx$backend$infra$core_memory$likely_file_path_QMARK_(path){
var b = knoxx.backend.infra.core_memory.basename(path);
var or__5162__auto__ = cljs.core.contains_QMARK_(knoxx.backend.infra.core_memory.known_extensionless_files,b);
if(or__5162__auto__){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = clojure.string.starts_with_QMARK_(b,".");
if(or__5162__auto____$1){
return or__5162__auto____$1;
} else {
return cljs.core.re_find(/\./,b);
}
}
});
knoxx.backend.infra.core_memory.workspace_target_node = (function knoxx$backend$infra$core_memory$workspace_target_node(path){
var path__$1 = knoxx.backend.infra.core_memory.normalize_workspace_path(path);
var project_name = knoxx.backend.infra.core_memory.workspace_project_name();
if(clojure.string.blank_QMARK_(path__$1)){
return null;
} else {
if(cljs.core.truth_(knoxx.backend.infra.core_memory.likely_file_path_QMARK_(path__$1))){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"path","path",-188191168),path__$1,new cljs.core.Keyword(null,"target_kind","target_kind",-78093164),"file",new cljs.core.Keyword(null,"target_node_id","target_node_id",-988690835),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(project_name)+":file:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path__$1))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"path","path",-188191168),path__$1,new cljs.core.Keyword(null,"target_kind","target_kind",-78093164),"dir",new cljs.core.Keyword(null,"target_node_id","target_node_id",-988690835),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(project_name)+":dir:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path__$1))], null);
}
}
});
knoxx.backend.infra.core_memory.extract_mentioned_workspace_paths = (function knoxx$backend$infra$core_memory$extract_mentioned_workspace_paths(text){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.core_memory.workspace_target_node,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.second,cljs.core.re_seq(knoxx.backend.infra.core_memory.workspace_path_pattern,(function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))));
});
/**
 * Backward-compatible alias for the workspace path extractor.
 */
knoxx.backend.infra.core_memory.extract_mentioned_devel_paths = (function knoxx$backend$infra$core_memory$extract_mentioned_devel_paths(text){
return knoxx.backend.infra.core_memory.extract_mentioned_workspace_paths(text);
});
knoxx.backend.infra.core_memory.session_visible_QMARK_ = (function knoxx$backend$infra$core_memory$session_visible_QMARK_(ctx,rows){
if((ctx == null)){
return true;
} else {
if(knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)){
return true;
} else {
var extras = cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.core_memory.row_extra_map,rows);
var org_ids = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (p1__27871_SHARP_){
var G__27876 = p1__27871_SHARP_;
var G__27876__$1 = (((G__27876 == null))?null:new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(G__27876));
var G__27876__$2 = (((G__27876__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27876__$1)));
if((G__27876__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27876__$2);
}
})),extras);
var membership_ids = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (p1__27872_SHARP_){
var G__27882 = p1__27872_SHARP_;
var G__27882__$1 = (((G__27882 == null))?null:new cljs.core.Keyword(null,"membership_id","membership_id",-171302674).cljs$core$IFn$_invoke$arity$1(G__27882));
var G__27882__$2 = (((G__27882__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27882__$1)));
if((G__27882__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27882__$2);
}
})),extras);
var user_ids = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (p1__27873_SHARP_){
var G__27885 = p1__27873_SHARP_;
var G__27885__$1 = (((G__27885 == null))?null:new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(G__27885));
var G__27885__$2 = (((G__27885__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27885__$1)));
if((G__27885__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27885__$2);
}
})),extras);
var same_org_QMARK_ = cljs.core.contains_QMARK_(org_ids,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.auth.authz.ctx_org_id(ctx))));
if(cljs.core.empty_QMARK_(org_ids)){
return knoxx.backend.infra.auth.authz.ctx_permitted_QMARK_(ctx,"agent.memory.cross_session");
} else {
if((!(same_org_QMARK_))){
return false;
} else {
if(knoxx.backend.infra.auth.authz.ctx_permitted_QMARK_(ctx,"agent.memory.cross_session")){
return true;
} else {
return ((cljs.core.contains_QMARK_(membership_ids,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.auth.authz.ctx_membership_id(ctx))))) || (cljs.core.contains_QMARK_(user_ids,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.auth.authz.ctx_user_id(ctx))))));

}
}
}

}
}
});
knoxx.backend.infra.core_memory.session_extra_value_from_rows = (function knoxx$backend$infra$core_memory$session_extra_value_from_rows(rows,keys){
return cljs.core.some((function (row){
var extra = knoxx.backend.infra.core_memory.row_extra_map(row);
return cljs.core.some((function (k){
var G__27887 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(extra,k);
var G__27887__$1 = (((G__27887 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27887)));
var G__27887__$2 = (((G__27887__$1 == null))?null:clojure.string.trim(G__27887__$1));
if((G__27887__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27887__$2);
}
}),keys);
}),cljs.core.reverse(cljs.core.vec((function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
knoxx.backend.infra.core_memory.session_contract_id_from_rows = (function knoxx$backend$infra$core_memory$session_contract_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contractId","contractId",710260199)], null));
});
knoxx.backend.infra.core_memory.session_contract_actors_from_rows = (function knoxx$backend$infra$core_memory$session_contract_actors_from_rows(rows){
return cljs.core.some((function (row){
var extra = knoxx.backend.infra.core_memory.row_extra_map(row);
var actors = knoxx.backend.domain.actor.scope.normalize_actor_claims((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contract_actors","contract_actors",-1493360705).cljs$core$IFn$_invoke$arity$1(extra);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049).cljs$core$IFn$_invoke$arity$1(extra);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"contractActors","contractActors",47284059).cljs$core$IFn$_invoke$arity$1(extra);
}
}
})());
if(cljs.core.seq(actors)){
return actors;
} else {
return null;
}
}),cljs.core.reverse(cljs.core.vec((function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
knoxx.backend.infra.core_memory.session_actor_id_from_rows = (function knoxx$backend$infra$core_memory$session_actor_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null));
});
knoxx.backend.infra.core_memory.session_sub_agent_id_from_rows = (function knoxx$backend$infra$core_memory$session_sub_agent_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792)], null));
});
knoxx.backend.infra.core_memory.session_parent_agent_id_from_rows = (function knoxx$backend$infra$core_memory$session_parent_agent_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200)], null));
});
knoxx.backend.infra.core_memory.session_parent_run_id_from_rows = (function knoxx$backend$infra$core_memory$session_parent_run_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367),new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271)], null));
});
knoxx.backend.infra.core_memory.session_spawn_kind_from_rows = (function knoxx$backend$infra$core_memory$session_spawn_kind_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959),new cljs.core.Keyword(null,"spawnKind","spawnKind",1648184297)], null));
});
knoxx.backend.infra.core_memory.session_trigger_id_from_rows = (function knoxx$backend$infra$core_memory$session_trigger_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),new cljs.core.Keyword(null,"triggerId","triggerId",-684068188)], null));
});
knoxx.backend.infra.core_memory.session_event_type_from_rows = (function knoxx$backend$infra$core_memory$session_event_type_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_type","event_type",1569866042),new cljs.core.Keyword(null,"event-type","event-type",319722813),new cljs.core.Keyword(null,"eventType","eventType",-1525570624),new cljs.core.Keyword(null,"trigger_event_type","trigger_event_type",-1033685510),new cljs.core.Keyword(null,"trigger-event-type","trigger-event-type",463301244),new cljs.core.Keyword(null,"triggerEventType","triggerEventType",1990874681)], null));
});
knoxx.backend.infra.core_memory.session_event_types_from_rows = (function knoxx$backend$infra$core_memory$session_event_types_from_rows(rows){
return cljs.core.some((function (row){
var extra = knoxx.backend.infra.core_memory.row_extra_map(row);
var values = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"event_types","event_types",-752038707).cljs$core$IFn$_invoke$arity$1(extra);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"event-types","event-types",-81363635).cljs$core$IFn$_invoke$arity$1(extra);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"eventTypes","eventTypes",-1966249997).cljs$core$IFn$_invoke$arity$1(extra);
}
}
})();
if(cljs.core.sequential_QMARK_(values)){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,values))));
} else {
return null;
}
}),cljs.core.reverse(cljs.core.vec((function (){var or__5162__auto__ = rows;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
knoxx.backend.infra.core_memory.session_event_id_from_rows = (function knoxx$backend$infra$core_memory$session_event_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_id","event_id",-767275570),new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"eventId","eventId",378389360)], null));
});
knoxx.backend.infra.core_memory.session_event_scope_id_from_rows = (function knoxx$backend$infra$core_memory$session_event_scope_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009),new cljs.core.Keyword(null,"eventScopeId","eventScopeId",1980523873)], null));
});
knoxx.backend.infra.core_memory.session_schedule_id_from_rows = (function knoxx$backend$infra$core_memory$session_schedule_id_from_rows(rows){
return knoxx.backend.infra.core_memory.session_extra_value_from_rows(rows,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193),new cljs.core.Keyword(null,"scheduleId","scheduleId",-959542790)], null));
});
knoxx.backend.infra.core_memory.session_summary_scope_from_rows = (function knoxx$backend$infra$core_memory$session_summary_scope_from_rows(rows){
var contract_id = knoxx.backend.infra.core_memory.session_contract_id_from_rows(rows);
var actor_id = knoxx.backend.infra.core_memory.session_actor_id_from_rows(rows);
var contract_actors = knoxx.backend.infra.core_memory.session_contract_actors_from_rows(rows);
var wire_actors = ((cljs.core.seq(contract_actors))?knoxx.backend.domain.actor.scope.actor_claims__GT_wire(contract_actors):null);
var sub_agent_id = knoxx.backend.infra.core_memory.session_sub_agent_id_from_rows(rows);
var parent_agent_id = knoxx.backend.infra.core_memory.session_parent_agent_id_from_rows(rows);
var parent_run_id = knoxx.backend.infra.core_memory.session_parent_run_id_from_rows(rows);
var spawn_kind = knoxx.backend.infra.core_memory.session_spawn_kind_from_rows(rows);
var trigger_id = knoxx.backend.infra.core_memory.session_trigger_id_from_rows(rows);
var event_type = knoxx.backend.infra.core_memory.session_event_type_from_rows(rows);
var event_types = knoxx.backend.infra.core_memory.session_event_types_from_rows(rows);
var event_id = knoxx.backend.infra.core_memory.session_event_id_from_rows(rows);
var event_scope_id = knoxx.backend.infra.core_memory.session_event_scope_id_from_rows(rows);
var schedule_id = knoxx.backend.infra.core_memory.session_schedule_id_from_rows(rows);
var G__27895 = cljs.core.PersistentArrayMap.EMPTY;
var G__27895__$1 = (cljs.core.truth_(contract_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895,new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),contract_id):G__27895);
var G__27895__$2 = (cljs.core.truth_(actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$1,new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),actor_id):G__27895__$1);
var G__27895__$3 = ((cljs.core.seq(wire_actors))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$2,new cljs.core.Keyword(null,"contract_actors","contract_actors",-1493360705),wire_actors):G__27895__$2);
var G__27895__$4 = (cljs.core.truth_(sub_agent_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$3,new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),sub_agent_id):G__27895__$3);
var G__27895__$5 = (cljs.core.truth_(parent_agent_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$4,new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),parent_agent_id):G__27895__$4);
var G__27895__$6 = (cljs.core.truth_(parent_run_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$5,new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),parent_run_id):G__27895__$5);
var G__27895__$7 = (cljs.core.truth_(spawn_kind)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$6,new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),spawn_kind):G__27895__$6);
var G__27895__$8 = (cljs.core.truth_(trigger_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$7,new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),trigger_id):G__27895__$7);
var G__27895__$9 = (cljs.core.truth_(event_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$8,new cljs.core.Keyword(null,"event_type","event_type",1569866042),event_type):G__27895__$8);
var G__27895__$10 = ((cljs.core.seq(event_types))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$9,new cljs.core.Keyword(null,"event_types","event_types",-752038707),event_types):G__27895__$9);
var G__27895__$11 = (cljs.core.truth_(event_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$10,new cljs.core.Keyword(null,"event_id","event_id",-767275570),event_id):G__27895__$10);
var G__27895__$12 = (cljs.core.truth_(event_scope_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$11,new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),event_scope_id):G__27895__$11);
if(cljs.core.truth_(schedule_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27895__$12,new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),schedule_id);
} else {
return G__27895__$12;
}
});
knoxx.backend.infra.core_memory.session_actor_claims_from_rows = (function knoxx$backend$infra$core_memory$session_actor_claims_from_rows(config,rows){
var legacy_fallback = cljs.core.PersistentHashSet.createAsIfByAssoc([knoxx.backend.domain.actor.scope.legacy_chat_actor_id]);
var or__5162__auto__ = (function (){var G__27897 = knoxx.backend.infra.core_memory.session_actor_id_from_rows(rows);
var G__27897__$1 = (((G__27897 == null))?null:(new cljs.core.PersistentVector(null,1,(5),cljs.core.PersistentVector.EMPTY_NODE,[G__27897],null)));
if((G__27897__$1 == null)){
return null;
} else {
return knoxx.backend.domain.actor.scope.normalize_actor_claims(G__27897__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.core_memory.session_contract_actors_from_rows(rows);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (function (){var G__27898 = knoxx.backend.infra.core_memory.session_contract_id_from_rows(rows);
var G__27898__$1 = (((G__27898 == null))?null:knoxx.backend.infra.tooling.resolve_agent_contract.cljs$core$IFn$_invoke$arity$2(G__27898,config));
var G__27898__$2 = (((G__27898__$1 == null))?null:new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049).cljs$core$IFn$_invoke$arity$1(G__27898__$1));
if((G__27898__$2 == null)){
return null;
} else {
return knoxx.backend.domain.actor.scope.normalize_actor_claims(G__27898__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return legacy_fallback;
}
}
}
});
knoxx.backend.infra.core_memory.actor_claim_includes_QMARK_ = (function knoxx$backend$infra$core_memory$actor_claim_includes_QMARK_(actors,actor_id){
var wanted = knoxx.backend.domain.actor.scope.normalize_actor_claim(actor_id);
var and__5160__auto__ = wanted;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(knoxx.backend.domain.actor.scope.normalize_actor_claims(actors),wanted);
} else {
return and__5160__auto__;
}
});
knoxx.backend.infra.core_memory.session_matches_page_actor_filter_QMARK_ = (function knoxx$backend$infra$core_memory$session_matches_page_actor_filter_QMARK_(config,rows,include_actor_id,exclude_actor_ids){
var include_actor_id__$1 = (function (){var G__27903 = include_actor_id;
var G__27903__$1 = (((G__27903 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27903)));
var G__27903__$2 = (((G__27903__$1 == null))?null:clojure.string.trim(G__27903__$1));
if((G__27903__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27903__$2);
}
})();
var exclude_actor_ids__$1 = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27901_SHARP_){
var G__27904 = p1__27901_SHARP_;
var G__27904__$1 = (((G__27904 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27904)));
var G__27904__$2 = (((G__27904__$1 == null))?null:clojure.string.trim(G__27904__$1));
if((G__27904__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27904__$2);
}
}),(function (){var or__5162__auto__ = exclude_actor_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
var actors = knoxx.backend.infra.core_memory.session_actor_claims_from_rows(config,rows);
var and__5160__auto__ = (function (){var or__5162__auto__ = clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = include_actor_id__$1;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(actors,include_actor_id__$1);
}
})();
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_any_QMARK_((function (p1__27902_SHARP_){
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(actors,p1__27902_SHARP_);
}),exclude_actor_ids__$1);
} else {
return and__5160__auto__;
}
});
knoxx.backend.infra.core_memory.session_matches_contract_filter_QMARK_ = (function knoxx$backend$infra$core_memory$session_matches_contract_filter_QMARK_(config,rows,contract_id){
var target = (function (){var G__27905 = contract_id;
var G__27905__$1 = (((G__27905 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27905)));
var G__27905__$2 = (((G__27905__$1 == null))?null:clojure.string.trim(G__27905__$1));
if((G__27905__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27905__$2);
}
})();
if(cljs.core.not(target)){
return true;
} else {
var actors = knoxx.backend.infra.core_memory.session_actor_claims_from_rows(config,rows);
var contract_actors = knoxx.backend.infra.core_memory.session_contract_actors_from_rows(rows);
var or__5162__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.core_memory.session_contract_id_from_rows(rows));
if(or__5162__auto__){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.core_memory.session_sub_agent_id_from_rows(rows));
if(or__5162__auto____$1){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.core_memory.session_parent_agent_id_from_rows(rows));
if(or__5162__auto____$2){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.core_memory.session_actor_id_from_rows(rows));
if(or__5162__auto____$3){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.infra.core_memory.actor_claim_includes_QMARK_(contract_actors,target);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.infra.core_memory.actor_claim_includes_QMARK_(actors,target);
}
}
}
}
}
}
});
knoxx.backend.infra.core_memory.session_visible_for_page_actor_QMARK_ = (function knoxx$backend$infra$core_memory$session_visible_for_page_actor_QMARK_(config,rows,page_actor_id){
return knoxx.backend.infra.core_memory.session_matches_page_actor_filter_QMARK_(config,rows,page_actor_id,cljs.core.PersistentVector.EMPTY);
});
knoxx.backend.infra.core_memory.fetch_openplanner_session_mode_rows_BANG_ = (async function knoxx$backend$infra$core_memory$fetch_openplanner_session_mode_rows_BANG_(config,session_id,mode,opts){
var body = (await knoxx.backend.infra.clients.openplanner.session_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),session_id,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"mode","mode",654403691),mode], null),opts], 0))));
return cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
});
knoxx.backend.infra.core_memory.fetch_openplanner_session_rows_BANG_ = (function knoxx$backend$infra$core_memory$fetch_openplanner_session_rows_BANG_(config,session_id){
return knoxx.backend.infra.core_memory.fetch_openplanner_session_mode_rows_BANG_(config,session_id,"full",cljs.core.PersistentArrayMap.EMPTY);
});
knoxx.backend.infra.core_memory.fetch_openplanner_session_visibility_rows_BANG_ = (function knoxx$backend$infra$core_memory$fetch_openplanner_session_visibility_rows_BANG_(config,session_id){
return knoxx.backend.infra.core_memory.fetch_openplanner_session_mode_rows_BANG_(config,session_id,"visibility",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(1)], null));
});
knoxx.backend.infra.core_memory.authorized_session_ids_BANG_ = (async function knoxx$backend$infra$core_memory$authorized_session_ids_BANG_(config,ctx,session_ids){
var session_ids__$1 = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,session_ids))));
if((((ctx == null)) || (((knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)) || (cljs.core.empty_QMARK_(session_ids__$1)))))){
return cljs.core.set(session_ids__$1);
} else {
var results = (await knoxx.backend.extern.promise.all_vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((async function (session_id){
try{var rows = (await knoxx.backend.infra.core_memory.fetch_openplanner_session_rows_BANG_(config,session_id));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"allowed","allowed",1436019743),knoxx.backend.infra.core_memory.session_visible_QMARK_(ctx,rows)], null);
}catch (e27915){var _ = e27915;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"allowed","allowed",1436019743),false], null);
}}),session_ids__$1)));
return cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session","session",1008279103),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"allowed","allowed",1436019743),results)));
}
});
knoxx.backend.infra.core_memory.hit_session_id = (function knoxx$backend$infra$core_memory$hit_session_id(hit){
var or__5162__auto__ = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(hit,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword(null,"session","session",1008279103)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(hit,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"session","session",1008279103)], null));
}
}
});
knoxx.backend.infra.core_memory.hit_text = (function knoxx$backend$infra$core_memory$hit_text(hit){
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
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(hit,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return "";
}
}
}
}
})()));
});
knoxx.backend.infra.core_memory.reasoning_hit_QMARK_ = (function knoxx$backend$infra$core_memory$reasoning_hit_QMARK_(hit){
var metadata = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"metadata","metadata",1799301597).cljs$core$IFn$_invoke$arity$1(hit);
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
})();
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
knoxx.backend.infra.core_memory.operational_failure_hit_QMARK_ = (function knoxx$backend$infra$core_memory$operational_failure_hit_QMARK_(hit){
var text = knoxx.backend.infra.core_memory.hit_text(hit);
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
knoxx.backend.infra.core_memory.filter_authorized_memory_hits_BANG_ = (async function knoxx$backend$infra$core_memory$filter_authorized_memory_hits_BANG_(config,ctx,hits){
var hits__$1 = cljs.core.vec(hits);
var session_ids = cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.core_memory.hit_session_id,hits__$1);
var allowed = (await knoxx.backend.infra.core_memory.authorized_session_ids_BANG_(config,ctx,session_ids));
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (hit){
return ((cljs.core.contains_QMARK_(allowed,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.core_memory.hit_session_id(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))) && ((((!(knoxx.backend.infra.core_memory.reasoning_hit_QMARK_(hit)))) && ((!(knoxx.backend.infra.core_memory.operational_failure_hit_QMARK_(hit)))))));
}),hits__$1));
});

//# sourceMappingURL=knoxx.backend.infra.core_memory.js.map
