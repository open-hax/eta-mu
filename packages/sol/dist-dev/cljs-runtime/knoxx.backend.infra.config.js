import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.infra.config');
knoxx.backend.infra.config.env_path_list = (function knoxx$backend$infra$config$env_path_list(k){
var raw = (function (){var G__25617 = (process.env[k]);
var G__25617__$1 = (((G__25617 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25617)));
if((G__25617__$1 == null)){
return null;
} else {
return clojure.string.trim(G__25617__$1);
}
})();
if(clojure.string.blank_QMARK_((function (){var or__5162__auto__ = raw;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())){
return cljs.core.PersistentVector.EMPTY;
} else {
return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (value){
var G__25618 = value;
var G__25618__$1 = (((G__25618 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25618)));
var G__25618__$2 = (((G__25618__$1 == null))?null:clojure.string.trim(G__25618__$1));
if((G__25618__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25618__$2);
}
}),clojure.string.split.cljs$core$IFn$_invoke$arity$2(raw,/:/))));
}
});
knoxx.backend.infra.config.env = (function knoxx$backend$infra$config$env(k,default$){
var or__5162__auto__ = (process.env[k]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default$;
}
});
knoxx.backend.infra.config.env_first = (function knoxx$backend$infra$config$env_first(keys,default$){
var or__5162__auto__ = cljs.core.some((function (k){
var value = (process.env[k]);
if(clojure.string.blank_QMARK_((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())){
return null;
} else {
return value;
}
}),keys);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default$;
}
});
knoxx.backend.infra.config.env_int = (function knoxx$backend$infra$config$env_int(k,default$){
var raw = (process.env[k]);
var parsed = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = raw;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),(10));
if(cljs.core.truth_(Number.isFinite(parsed))){
return parsed;
} else {
return default$;
}
});
knoxx.backend.infra.config.env_kv_map = (function knoxx$backend$infra$config$env_kv_map(k){
var raw = (function (){var G__25653 = (process.env[k]);
var G__25653__$1 = (((G__25653 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25653)));
if((G__25653__$1 == null)){
return null;
} else {
return clojure.string.trim(G__25653__$1);
}
})();
if(clojure.string.blank_QMARK_((function (){var or__5162__auto__ = raw;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (entry){
var vec__25664 = clojure.string.split.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(entry)),/=/,(2));
var left = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25664,(0),null);
var right = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25664,(1),null);
var key = (function (){var G__25669 = left;
var G__25669__$1 = (((G__25669 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25669)));
var G__25669__$2 = (((G__25669__$1 == null))?null:clojure.string.trim(G__25669__$1));
if((G__25669__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25669__$2);
}
})();
var value = (function (){var G__25676 = right;
var G__25676__$1 = (((G__25676 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25676)));
var G__25676__$2 = (((G__25676__$1 == null))?null:clojure.string.trim(G__25676__$1));
if((G__25676__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25676__$2);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = key;
if(cljs.core.truth_(and__5160__auto__)){
return value;
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [key,value], null);
} else {
return null;
}
}),clojure.string.split.cljs$core$IFn$_invoke$arity$2(raw,/,/))));
}
});
knoxx.backend.infra.config.base_server_config = (function knoxx$backend$infra$config$base_server_config(){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"shutdown-grace-ms","shutdown-grace-ms",-1671726656),new cljs.core.Keyword(null,"knoxx-default-actor-id","knoxx-default-actor-id",1539819560),new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143),new cljs.core.Keyword(null,"app-name","app-name",-268811251),new cljs.core.Keyword(null,"port","port",1534937262),new cljs.core.Keyword(null,"shutdown-poll-ms","shutdown-poll-ms",1512160015),new cljs.core.Keyword(null,"host","host",-1558485167),new cljs.core.Keyword(null,"knoxx-admin-url","knoxx-admin-url",238625622),new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),new cljs.core.Keyword(null,"knoxx-default-agent-contract","knoxx-default-agent-contract",-620088071),new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524),new cljs.core.Keyword(null,"knoxx-api-key","knoxx-api-key",-1142749154)],[knoxx.backend.infra.config.env_int("KNOXX_SHUTDOWN_GRACE_MS",(25000)),knoxx.backend.infra.config.env("KNOXX_DEFAULT_ACTOR_ID","chat_primary"),knoxx.backend.infra.config.env("KNOXX_BASE_URL","http://localhost:8000"),knoxx.backend.infra.config.env("APP_NAME","Knoxx Backend CLJS"),parseInt(knoxx.backend.infra.config.env("PORT","8000"),(10)),knoxx.backend.infra.config.env_int("KNOXX_SHUTDOWN_POLL_MS",(250)),knoxx.backend.infra.config.env("HOST","0.0.0.0"),knoxx.backend.infra.config.env("KNOXX_ADMIN_URL","http://localhost"),knoxx.backend.infra.config.env("CONTRACTS_DIR","contracts"),knoxx.backend.infra.config.env("KNOXX_DEFAULT_AGENT_CONTRACT","knoxx_default"),knoxx.backend.infra.config.env("KNOXX_DEFAULT_ROLE","knowledge_worker"),knoxx.backend.infra.config.env("KNOXX_API_KEY","")]);
});
knoxx.backend.infra.config.workspace_config = (function knoxx$backend$infra$config$workspace_config(){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"project-name","project-name",1486861539),new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811),new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547),new cljs.core.Keyword(null,"extra-workspace-roots","extra-workspace-roots",-21056439),new cljs.core.Keyword(null,"openplanner-api-key","openplanner-api-key",5324020),new cljs.core.Keyword(null,"collection-name","collection-name",600435477),new cljs.core.Keyword(null,"openplanner-base-url","openplanner-base-url",2028278103),new cljs.core.Keyword(null,"music-library-root","music-library-root",1834434652),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900)],[knoxx.backend.infra.config.env_first(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["WORKSPACE_PROJECT_NAME","KNOXX_WORKSPACE_PROJECT"], null),"workspace"),knoxx.backend.infra.config.env("KMS_INGESTION_URL","http://127.0.0.1:3003"),knoxx.backend.infra.config.env_first(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["WORKSPACE_ROOT","WORKSPACE_PATH","KNOXX_WORKSPACE_ROOT"], null),"/app/workspace"),knoxx.backend.infra.config.env_path_list("KNOXX_EXTRA_WORKSPACE_ROOTS"),knoxx.backend.infra.config.env("OPENPLANNER_API_KEY",""),knoxx.backend.infra.config.env("KNOXX_COLLECTION_NAME","workspace_docs"),(function (){var or__5162__auto__ = (process.env["OPENPLANNER_BASE_URL"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (process.env["OPENPLANNER_URL"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "http://host.docker.internal:7777";
}
}
})(),(function (){var value = (function (){var G__25708 = (process.env["KNOXX_MUSIC_LIBRARY_ROOT"]);
var G__25708__$1 = (((G__25708 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25708)));
if((G__25708__$1 == null)){
return null;
} else {
return clojure.string.trim(G__25708__$1);
}
})();
if(clojure.string.blank_QMARK_((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())){
return null;
} else {
return value;
}
})(),knoxx.backend.infra.config.env("KNOXX_SESSION_PROJECT_NAME","knoxx-session")]);
});
knoxx.backend.infra.config.provider_config = (function knoxx$backend$infra$config$provider_config(){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"provider-auth-headers","provider-auth-headers",2087960896),new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676),new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978),new cljs.core.Keyword(null,"proxx-embed-model","proxx-embed-model",-289269914),new cljs.core.Keyword(null,"provider-base-urls","provider-base-urls",1933293909),new cljs.core.Keyword(null,"provider-auth-tokens","provider-auth-tokens",1365293080),new cljs.core.Keyword(null,"model-lab-openai-api-key","model-lab-openai-api-key",1371814107),new cljs.core.Keyword(null,"proxx-default-model","proxx-default-model",-927829764),new cljs.core.Keyword(null,"session-title-model","session-title-model",-144758404)],[knoxx.backend.infra.config.env_kv_map("KNOXX_PROVIDER_AUTH_HEADERS"),knoxx.backend.infra.config.env("PROXX_AUTH_TOKEN",""),knoxx.backend.infra.config.env("PROXX_BASE_URL","http://proxx:8789"),knoxx.backend.infra.config.env("PROXX_EMBED_MODEL","nomic-embed-text:latest"),knoxx.backend.infra.config.env_kv_map("KNOXX_PROVIDER_BASE_URLS"),knoxx.backend.infra.config.env_kv_map("KNOXX_PROVIDER_AUTH_TOKENS"),knoxx.backend.infra.config.env("MODEL_LAB_OPENAI_API_KEY",""),(function (){var value = (process.env["PROXX_DEFAULT_MODEL"]);
if(((typeof value === 'string') && ((!(clojure.string.blank_QMARK_(value)))))){
return value;
} else {
return null;
}
})(),(function (){var value = (process.env["KNOXX_SESSION_TITLE_MODEL"]);
if(((typeof value === 'string') && ((!(clojure.string.blank_QMARK_(value)))))){
return value;
} else {
return null;
}
})()]);
});
knoxx.backend.infra.config.integration_config = (function knoxx$backend$infra$config$integration_config(){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"shibboleth-base-url","shibboleth-base-url",-351013125),knoxx.backend.infra.config.env("SHIBBOLETH_BASE_URL",""),new cljs.core.Keyword(null,"shibboleth-ui-url","shibboleth-ui-url",358926658),knoxx.backend.infra.config.env("SHIBBOLETH_UI_URL",""),new cljs.core.Keyword(null,"gmail-app-email","gmail-app-email",-654288582),knoxx.backend.infra.config.env("GMAIL_APP_EMAIL",""),new cljs.core.Keyword(null,"gmail-app-password","gmail-app-password",-1448333374),knoxx.backend.infra.config.env("GMAIL_APP_PASSWORD",""),new cljs.core.Keyword(null,"discord-bot-token","discord-bot-token",1224757550),"",new cljs.core.Keyword(null,"audd-api-token","audd-api-token",-1668649966),knoxx.backend.infra.config.env("AUDD_API_TOKEN",""),new cljs.core.Keyword(null,"acoustid-api-key","acoustid-api-key",-1190639229),knoxx.backend.infra.config.env("ACOUSTID_API_KEY","")], null);
});
knoxx.backend.infra.config.voice_config = (function knoxx$backend$infra$config$voice_config(){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"voxx-url","voxx-url",-1259052170),knoxx.backend.infra.config.env("VOXX_URL","http://127.0.0.1:8787"),new cljs.core.Keyword(null,"voxx-api-key","voxx-api-key",2053708716),knoxx.backend.infra.config.env("VOICE_GATEWAY_API_KEY","dev-token"),new cljs.core.Keyword(null,"voxx-voice-id","voxx-voice-id",-652120125),knoxx.backend.infra.config.env("KNOXX_VOXX_VOICE_ID","af_jessica"),new cljs.core.Keyword(null,"voxx-model-id","voxx-model-id",2106305693),knoxx.backend.infra.config.env("KNOXX_VOXX_MODEL_ID","kokoro"),new cljs.core.Keyword(null,"voxx-default-speed","voxx-default-speed",-370827943),knoxx.backend.infra.config.env("KNOXX_VOXX_DEFAULT_SPEED",knoxx.backend.infra.config.env("VOICE_GATEWAY_TTS_DEFAULT_SPEED","1.15")),new cljs.core.Keyword(null,"stt-base-url","stt-base-url",-12292445),knoxx.backend.infra.config.env("KNOXX_STT_BASE_URL","")], null);
});
knoxx.backend.infra.config.agent_config = (function knoxx$backend$infra$config$agent_config(){
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"agent-dir","agent-dir",-1644183343),knoxx.backend.infra.config.env("KNOXX_AGENT_DIR","/tmp/knoxx-agent"),new cljs.core.Keyword(null,"agent-compaction-enabled?","agent-compaction-enabled?",2081520583),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("false",clojure.string.lower_case(knoxx.backend.infra.config.env("KNOXX_AGENT_COMPACTION_ENABLED","true"))),new cljs.core.Keyword(null,"agent-compaction-reserve-tokens","agent-compaction-reserve-tokens",-1610115454),knoxx.backend.infra.config.env_int("KNOXX_AGENT_COMPACTION_RESERVE_TOKENS",(16384)),new cljs.core.Keyword(null,"agent-compaction-keep-recent-tokens","agent-compaction-keep-recent-tokens",-1603219081),knoxx.backend.infra.config.env_int("KNOXX_AGENT_COMPACTION_KEEP_RECENT_TOKENS",(20000)),new cljs.core.Keyword(null,"agent-turn-timeout-ms","agent-turn-timeout-ms",1064040143),knoxx.backend.infra.config.env_int("KNOXX_AGENT_TURN_TIMEOUT_MS",(0)),new cljs.core.Keyword(null,"run-stale-flush-ms","run-stale-flush-ms",1133804815),knoxx.backend.infra.config.env_int("KNOXX_RUN_STALE_FLUSH_MS",((((12) * (60)) * (60)) * (1000))),new cljs.core.Keyword(null,"agent-auto-resume-sessions?","agent-auto-resume-sessions?",801384409),cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("true",clojure.string.lower_case(knoxx.backend.infra.config.env("KNOXX_AGENT_AUTO_RESUME_SESSIONS","false"))),new cljs.core.Keyword(null,"agent-system-prompt","agent-system-prompt",-1576864491),knoxx.backend.infra.config.env("KNOXX_AGENT_SYSTEM_PROMPT",(""+"You are Knoxx, the grounded workspace assistant for the active workspace corpus. "+"Preserve multi-turn context within the active conversation, use workspace tools when needed, "+"cite file paths when they matter, and prefer grounded synthesis over shallow enumeration. "+"Treat passive semantic hydration as helpful but incomplete; when corpus grounding matters, "+"use semantic_query, semantic_read, and graph_query instead of guessing. "+"Long-term conversational memory lives in OpenPlanner; when the user asks about previous sessions, "+"prior decisions, or your own earlier actions, use memory_search and memory_session instead of pretending to remember."))], null);
});
knoxx.backend.infra.config.sandbox_config = (function knoxx$backend$infra$config$sandbox_config(){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"sandbox-default-ttl-seconds","sandbox-default-ttl-seconds",496927585),new cljs.core.Keyword(null,"sandbox-user","sandbox-user",-1538943230),new cljs.core.Keyword(null,"sandbox-dockerfile","sandbox-dockerfile",-1861024314),new cljs.core.Keyword(null,"sandbox-docker-bin","sandbox-docker-bin",1250465191),new cljs.core.Keyword(null,"sandbox-max-ttl-seconds","sandbox-max-ttl-seconds",-1582249113),new cljs.core.Keyword(null,"sandbox-root-dir","sandbox-root-dir",-246015478),new cljs.core.Keyword(null,"sandbox-image","sandbox-image",-212790096),new cljs.core.Keyword(null,"sandbox-build-context","sandbox-build-context",-1046564842),new cljs.core.Keyword(null,"sandbox-workdir","sandbox-workdir",-1309321735)],[knoxx.backend.infra.config.env_int("KNOXX_SANDBOX_TTL_SECONDS",(1800)),knoxx.backend.infra.config.env("DOCKER_USER","1000:1000"),knoxx.backend.infra.config.env("KNOXX_SANDBOX_DOCKERFILE","docker/sandbox/Dockerfile"),knoxx.backend.infra.config.env("KNOXX_SANDBOX_DOCKER_BIN","docker"),knoxx.backend.infra.config.env_int("KNOXX_SANDBOX_MAX_TTL_SECONDS",(86400)),knoxx.backend.infra.config.env("KNOXX_SANDBOX_ROOT_DIR","/tmp/knoxx-agent/sandboxes"),knoxx.backend.infra.config.env("KNOXX_SANDBOX_IMAGE","knoxx-sandbox:latest"),knoxx.backend.infra.config.env("KNOXX_SANDBOX_BUILD_CONTEXT","docker/sandbox"),knoxx.backend.infra.config.env("KNOXX_SANDBOX_WORKDIR","/workspace")]);
});
knoxx.backend.infra.config.mcp_config = (function knoxx$backend$infra$config$mcp_config(){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"openplanner-mcp-tool-name","openplanner-mcp-tool-name",1459761280),new cljs.core.Keyword(null,"mcp-servers","mcp-servers",1662585091),new cljs.core.Keyword(null,"openplanner-mcp-base-url","openplanner-mcp-base-url",1563571366),new cljs.core.Keyword(null,"openplanner-mcp-source","openplanner-mcp-source",210725804),new cljs.core.Keyword(null,"mcp-enabled","mcp-enabled",-2146653267),new cljs.core.Keyword(null,"shoedelussy-mcp-tool-name","shoedelussy-mcp-tool-name",2046051346),new cljs.core.Keyword(null,"shoedelussy-mcp-base-url","shoedelussy-mcp-base-url",1454013907),new cljs.core.Keyword(null,"openplanner-mcp-project","openplanner-mcp-project",-468146115),new cljs.core.Keyword(null,"shoedelussy-mcp-shared-secret","shoedelussy-mcp-shared-secret",386556861)],[knoxx.backend.infra.config.env("OPENPLANNER_MCP_TOOL_NAME","openplanner"),knoxx.backend.infra.config.env("MCP_SERVERS",""),knoxx.backend.infra.config.env("OPENPLANNER_MCP_BASE_URL","http://openplanner-mcp:8010"),knoxx.backend.infra.config.env("KNOXX_OPENPLANNER_SOURCE","knoxx"),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.config.env("MCP_ENABLED","false"),"false"),knoxx.backend.infra.config.env("SHOEDELUSSY_MCP_TOOL_NAME","shoedelussy"),knoxx.backend.infra.config.env("SHOEDELUSSY_MCP_BASE_URL",""),knoxx.backend.infra.config.env_first(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["KNOXX_OPENPLANNER_PROJECT","WORKSPACE_PROJECT_NAME","KNOXX_WORKSPACE_PROJECT"], null),"workspace"),knoxx.backend.infra.config.env("SHOEDELUSSY_MCP_SHARED_SECRET","")]);
});
/**
 * Read Knoxx backend runtime configuration from environment variables.
 * 
 * NOTE: This namespace is intentionally *env-only*.
 * Any derived runtime state belongs elsewhere.
 */
knoxx.backend.infra.config.cfg = (function knoxx$backend$infra$config$cfg(){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.config.base_server_config(),knoxx.backend.infra.config.workspace_config(),knoxx.backend.infra.config.provider_config(),knoxx.backend.infra.config.integration_config(),knoxx.backend.infra.config.voice_config(),knoxx.backend.infra.config.agent_config(),knoxx.backend.infra.config.sandbox_config(),knoxx.backend.infra.config.mcp_config()], 0));
});

//# sourceMappingURL=knoxx.backend.infra.config.js.map
