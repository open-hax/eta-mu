import "./cljs_env.js";
import "./cljs.core.js";
import "./malli.core.js";
import "./malli.error.js";
goog.provide('knoxx.backend.shape.session_persistence');
knoxx.backend.shape.session_persistence.RunStatus = new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),"queued","running","completed","failed","waiting_input","cancelled"], null);
/**
 * Runtime status vocabulary accepts current stream values plus legacy
 * trace/persistence values during migration. Prefer running/completed/failed at
 * runtime; translate done/error only at compatibility boundaries.
 */
knoxx.backend.shape.session_persistence.ToolReceiptStatus = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),"running","completed","failed","done","error"], null);
knoxx.backend.shape.session_persistence.TraceBlockStatus = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),"streaming","done","error","completed","failed"], null);
knoxx.backend.shape.session_persistence.ToolReceipt = new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"status","status",-1997798413),knoxx.backend.shape.session_persistence.ToolReceiptStatus], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"started_at","started_at",856896776),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ended_at","ended_at",1150683059),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"input_preview","input_preview",2048529734),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"result_preview","result_preview",215554859),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null)], null);
knoxx.backend.shape.session_persistence.TraceBlock = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),new cljs.core.Keyword(null,"tool_call","tool_call",1265726908),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),new cljs.core.Keyword(null,"agent_message","agent_message",-522809201)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"status","status",-1997798413),knoxx.backend.shape.session_persistence.TraceBlockStatus], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"at","at",1476951349),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.shape.session_persistence.Message = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),"user","assistant","system"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.shape.session_persistence.KnoxxRun = new cljs.core.PersistentVector(null, 18, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"status","status",-1997798413),knoxx.backend.shape.session_persistence.RunStatus], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),knoxx.backend.shape.session_persistence.Message], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),knoxx.backend.shape.session_persistence.ToolReceipt], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),knoxx.backend.shape.session_persistence.TraceBlock], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null)], null);
knoxx.backend.shape.session_persistence.valid_run_QMARK_ = (function knoxx$backend$shape$session_persistence$valid_run_QMARK_(run){
return malli.core.validate.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.session_persistence.KnoxxRun,run);
});
knoxx.backend.shape.session_persistence.explain_run = (function knoxx$backend$shape$session_persistence$explain_run(run){
return malli.error.humanize.cljs$core$IFn$_invoke$arity$1(malli.core.explain.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.session_persistence.KnoxxRun,run));
});
knoxx.backend.shape.session_persistence.assert_run_BANG_ = (function knoxx$backend$shape$session_persistence$assert_run_BANG_(run,ctx){
if(cljs.core.truth_(knoxx.backend.shape.session_persistence.valid_run_QMARK_(run))){
return null;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ctx)+": invalid KnoxxRun"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"errors","errors",-908790718),knoxx.backend.shape.session_persistence.explain_run(run),new cljs.core.Keyword(null,"run","run",-1821166653),cljs.core.select_keys(run,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"status","status",-1997798413)], null))], null));
}
});

/**
 * @interface
 */
knoxx.backend.shape.session_persistence.ISessionStore = function(){};

var knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$dyn_26244 = (function (store,run){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.shape.session_persistence.put_run_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,run) : m__5520__auto__.call(null,store,run));
} else {
var m__5518__auto__ = (knoxx.backend.shape.session_persistence.put_run_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,run) : m__5518__auto__.call(null,store,run));
} else {
throw cljs.core.missing_protocol("ISessionStore.put-run!",store);
}
}
});
/**
 * Persist a full KnoxxRun. Validates against KnoxxRun schema.
 *   Resolves to the stored run map.
 */
knoxx.backend.shape.session_persistence.put_run_BANG_ = (function knoxx$backend$shape$session_persistence$put_run_BANG_(store,run){
if((((!((store == null)))) && ((!((store.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2 == null)))))){
return store.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2(store,run);
} else {
return knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$dyn_26244(store,run);
}
});

var knoxx$backend$shape$session_persistence$ISessionStore$get_run$dyn_26253 = (function (store,run_id){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.shape.session_persistence.get_run[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,run_id) : m__5520__auto__.call(null,store,run_id));
} else {
var m__5518__auto__ = (knoxx.backend.shape.session_persistence.get_run["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,run_id) : m__5518__auto__.call(null,store,run_id));
} else {
throw cljs.core.missing_protocol("ISessionStore.get-run",store);
}
}
});
/**
 * Fetch a KnoxxRun by run-id.
 *   Resolves to a KnoxxRun map or nil.
 */
knoxx.backend.shape.session_persistence.get_run = (function knoxx$backend$shape$session_persistence$get_run(store,run_id){
if((((!((store == null)))) && ((!((store.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2 == null)))))){
return store.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2(store,run_id);
} else {
return knoxx$backend$shape$session_persistence$ISessionStore$get_run$dyn_26253(store,run_id);
}
});

var knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$dyn_26257 = (function (store,run_id,patch){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.shape.session_persistence.patch_run_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(store,run_id,patch) : m__5520__auto__.call(null,store,run_id,patch));
} else {
var m__5518__auto__ = (knoxx.backend.shape.session_persistence.patch_run_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(store,run_id,patch) : m__5518__auto__.call(null,store,run_id,patch));
} else {
throw cljs.core.missing_protocol("ISessionStore.patch-run!",store);
}
}
});
/**
 * Merge patch into the stored run. patch must not violate KnoxxRun invariants.
 *   Resolves to the updated KnoxxRun.
 */
knoxx.backend.shape.session_persistence.patch_run_BANG_ = (function knoxx$backend$shape$session_persistence$patch_run_BANG_(store,run_id,patch){
if((((!((store == null)))) && ((!((store.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3 == null)))))){
return store.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3(store,run_id,patch);
} else {
return knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$dyn_26257(store,run_id,patch);
}
});

var knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$dyn_26261 = (function (store,session_id){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.shape.session_persistence.list_active_runs[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,session_id) : m__5520__auto__.call(null,store,session_id));
} else {
var m__5518__auto__ = (knoxx.backend.shape.session_persistence.list_active_runs["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,session_id) : m__5518__auto__.call(null,store,session_id));
} else {
throw cljs.core.missing_protocol("ISessionStore.list-active-runs",store);
}
}
});
/**
 * List KnoxxRuns for session-id where status ∈ #{running queued waiting_input}.
 *   Resolves to a vector of KnoxxRun maps.
 */
knoxx.backend.shape.session_persistence.list_active_runs = (function knoxx$backend$shape$session_persistence$list_active_runs(store,session_id){
if((((!((store == null)))) && ((!((store.knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$arity$2 == null)))))){
return store.knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$arity$2(store,session_id);
} else {
return knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$dyn_26261(store,session_id);
}
});

var knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$dyn_26263 = (function (store,run_id,opts){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.shape.session_persistence.complete_run_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(store,run_id,opts) : m__5520__auto__.call(null,store,run_id,opts));
} else {
var m__5518__auto__ = (knoxx.backend.shape.session_persistence.complete_run_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(store,run_id,opts) : m__5518__auto__.call(null,store,run_id,opts));
} else {
throw cljs.core.missing_protocol("ISessionStore.complete-run!",store);
}
}
});
/**
 * Finalize a run: set status, answer, error, trace_blocks.
 *   opts: {:status :answer :error :trace_blocks :messages}
 *   Resolves to the finalized KnoxxRun.
 */
knoxx.backend.shape.session_persistence.complete_run_BANG_ = (function knoxx$backend$shape$session_persistence$complete_run_BANG_(store,run_id,opts){
if((((!((store == null)))) && ((!((store.knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$arity$3 == null)))))){
return store.knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$arity$3(store,run_id,opts);
} else {
return knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$dyn_26263(store,run_id,opts);
}
});

var knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$dyn_26269 = (function (store,run_id){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.shape.session_persistence.delete_run_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,run_id) : m__5520__auto__.call(null,store,run_id));
} else {
var m__5518__auto__ = (knoxx.backend.shape.session_persistence.delete_run_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,run_id) : m__5518__auto__.call(null,store,run_id));
} else {
throw cljs.core.missing_protocol("ISessionStore.delete-run!",store);
}
}
});
/**
 * Remove a run from this store. Idempotent.
 *   Resolves to true.
 */
knoxx.backend.shape.session_persistence.delete_run_BANG_ = (function knoxx$backend$shape$session_persistence$delete_run_BANG_(store,run_id){
if((((!((store == null)))) && ((!((store.knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$arity$2 == null)))))){
return store.knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$arity$2(store,run_id);
} else {
return knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$dyn_26269(store,run_id);
}
});


//# sourceMappingURL=knoxx.backend.shape.session_persistence.js.map
