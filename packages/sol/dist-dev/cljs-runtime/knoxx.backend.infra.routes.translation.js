import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.shape.app_shapes.js";
import "./knoxx.backend.infra.clients.openplanner.js";
goog.provide('knoxx.backend.infra.routes.translation');
knoxx.backend.infra.routes.translation.op_client = (function knoxx$backend$infra$routes$translation$op_client(config){
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
});
knoxx.backend.infra.routes.translation.openplanner_ready_QMARK_ = (function knoxx$backend$infra$routes$translation$openplanner_ready_QMARK_(config){
return knoxx.backend.infra.clients.openplanner.enabled_QMARK_(knoxx.backend.infra.routes.translation.op_client(config));
});
knoxx.backend.infra.routes.translation.reply_header_BANG_ = (function knoxx$backend$infra$routes$translation$reply_header_BANG_(reply,name,value){
return reply.header(name,value);
});
knoxx.backend.infra.routes.translation.query = (function knoxx$backend$infra$routes$translation$query(request){
var or__5162__auto__ = (request["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
});
knoxx.backend.infra.routes.translation.params = (function knoxx$backend$infra$routes$translation$params(request){
var or__5162__auto__ = (request["params"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
});
knoxx.backend.infra.routes.translation.body_clj = (function knoxx$backend$infra$routes$translation$body_clj(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.routes.translation.unavailable_BANG_ = (function knoxx$backend$infra$routes$translation$unavailable_BANG_(p__29770,reply){
var map__29772 = p__29770;
var map__29772__$1 = cljs.core.__destructure_map(map__29772);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29772__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var G__29773 = reply;
var G__29774 = (503);
var G__29775 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29773,G__29774,G__29775) : json_response_BANG_.call(null,G__29773,G__29774,G__29775));
});
knoxx.backend.infra.routes.translation.execute_json_route_BANG_ = (async function knoxx$backend$infra$routes$translation$execute_json_route_BANG_(request,reply,ctx,handlers,permission,operation){
var map__29779 = handlers;
var map__29779__$1 = cljs.core.__destructure_map(map__29779);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29779__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29779__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29779__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
try{if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,permission) : ensure_permission_BANG_.call(null,ctx,permission));
} else {
}

var G__29785 = reply;
var G__29786 = (200);
var G__29787 = (await (operation.cljs$core$IFn$_invoke$arity$3 ? operation.cljs$core$IFn$_invoke$arity$3(request,ctx,handlers) : operation.call(null,request,ctx,handlers)));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29785,G__29786,G__29787) : json_response_BANG_.call(null,G__29785,G__29786,G__29787));
}catch (e29784){var err = e29784;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}});
knoxx.backend.infra.routes.translation.execute_ndjson_route_BANG_ = (async function knoxx$backend$infra$routes$translation$execute_ndjson_route_BANG_(request,reply,ctx,handlers,permission,operation){
var map__29803 = handlers;
var map__29803__$1 = cljs.core.__destructure_map(map__29803);
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29803__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29803__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
try{if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,permission) : ensure_permission_BANG_.call(null,ctx,permission));
} else {
}

var text = (await (operation.cljs$core$IFn$_invoke$arity$3 ? operation.cljs$core$IFn$_invoke$arity$3(request,ctx,handlers) : operation.call(null,request,ctx,handlers)));
knoxx.backend.infra.routes.translation.reply_header_BANG_(reply,"Content-Type","application/x-ndjson");

return reply.send(text);
}catch (e29811){var err = e29811;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}});
knoxx.backend.infra.routes.translation.register_json_route_BANG_ = (function knoxx$backend$infra$routes$translation$register_json_route_BANG_(app,method,path,runtime,config,handlers,permission,operation){
return knoxx.backend.shape.app_shapes.route_BANG_(app,method,path,(function (request,reply){
if(cljs.core.not(knoxx.backend.infra.routes.translation.openplanner_ready_QMARK_(config))){
return knoxx.backend.infra.routes.translation.unavailable_BANG_(handlers,reply);
} else {
var G__29817 = runtime;
var G__29818 = request;
var G__29819 = reply;
var G__29820 = (function (ctx){
return knoxx.backend.infra.routes.translation.execute_json_route_BANG_(request,reply,ctx,handlers,permission,operation);
});
var fexpr__29816 = new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046).cljs$core$IFn$_invoke$arity$1(handlers);
return (fexpr__29816.cljs$core$IFn$_invoke$arity$4 ? fexpr__29816.cljs$core$IFn$_invoke$arity$4(G__29817,G__29818,G__29819,G__29820) : fexpr__29816.call(null,G__29817,G__29818,G__29819,G__29820));
}
}));
});
knoxx.backend.infra.routes.translation.register_ndjson_route_BANG_ = (function knoxx$backend$infra$routes$translation$register_ndjson_route_BANG_(app,method,path,runtime,config,handlers,permission,operation){
return knoxx.backend.shape.app_shapes.route_BANG_(app,method,path,(function (request,reply){
if(cljs.core.not(knoxx.backend.infra.routes.translation.openplanner_ready_QMARK_(config))){
return knoxx.backend.infra.routes.translation.unavailable_BANG_(handlers,reply);
} else {
var G__29838 = runtime;
var G__29839 = request;
var G__29840 = reply;
var G__29841 = (function (ctx){
return knoxx.backend.infra.routes.translation.execute_ndjson_route_BANG_(request,reply,ctx,handlers,permission,operation);
});
var fexpr__29837 = new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046).cljs$core$IFn$_invoke$arity$1(handlers);
return (fexpr__29837.cljs$core$IFn$_invoke$arity$4 ? fexpr__29837.cljs$core$IFn$_invoke$arity$4(G__29838,G__29839,G__29840,G__29841) : fexpr__29837.call(null,G__29838,G__29839,G__29840,G__29841));
}
}));
});
knoxx.backend.infra.routes.translation.translation_segments_op = (function knoxx$backend$infra$routes$translation$translation_segments_op(config){
return (function (request,_ctx,_handlers){
var q = knoxx.backend.infra.routes.translation.query(request);
return knoxx.backend.infra.clients.openplanner.translation_segments_BANG_(knoxx.backend.infra.routes.translation.op_client(config),new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"project","project",1124394579),(function (){var or__5162__auto__ = (q["project"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
}
})(),new cljs.core.Keyword(null,"limit","limit",-1355822363),(function (){var or__5162__auto__ = (q["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "50";
}
})(),new cljs.core.Keyword(null,"offset","offset",296498311),(function (){var or__5162__auto__ = (q["offset"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "0";
}
})(),new cljs.core.Keyword(null,"status","status",-1997798413),(q["status"]),new cljs.core.Keyword(null,"source_lang","source_lang",-931946297),(q["source_lang"]),new cljs.core.Keyword(null,"target_lang","target_lang",220363042),(q["target_lang"]),new cljs.core.Keyword(null,"domain","domain",1847214937),(q["domain"])], null));
});
});
knoxx.backend.infra.routes.translation.label_segment_op = (function knoxx$backend$infra$routes$translation$label_segment_op(config){
return (function (request,ctx,p__29858){
var map__29859 = p__29858;
var map__29859__$1 = cljs.core.__destructure_map(map__29859);
var ctx_user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29859__$1,new cljs.core.Keyword(null,"ctx-user-id","ctx-user-id",-259951088));
var ctx_user_email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29859__$1,new cljs.core.Keyword(null,"ctx-user-email","ctx-user-email",-64148717));
var ctx_org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29859__$1,new cljs.core.Keyword(null,"ctx-org-id","ctx-org-id",949922116));
var body = knoxx.backend.infra.routes.translation.body_clj(request);
var body_with_auth = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([body,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"labeler_id","labeler_id",-843194266),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (ctx_user_id.cljs$core$IFn$_invoke$arity$1 ? ctx_user_id.cljs$core$IFn$_invoke$arity$1(ctx) : ctx_user_id.call(null,ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})())),new cljs.core.Keyword(null,"labeler_email","labeler_email",-1161180430),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (ctx_user_email.cljs$core$IFn$_invoke$arity$1 ? ctx_user_email.cljs$core$IFn$_invoke$arity$1(ctx) : ctx_user_email.call(null,ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})())),new cljs.core.Keyword(null,"org_id","org_id",1380185385),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (ctx_org_id.cljs$core$IFn$_invoke$arity$1 ? ctx_org_id.cljs$core$IFn$_invoke$arity$1(ctx) : ctx_org_id.call(null,ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))], null)], 0));
return knoxx.backend.infra.clients.openplanner.label_translation_segment_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(knoxx.backend.infra.routes.translation.params(request)["id"]),body_with_auth);
});
});
knoxx.backend.infra.routes.translation.export_sft_op = (function knoxx$backend$infra$routes$translation$export_sft_op(config){
return (function (request,_ctx,_handlers){
var q = knoxx.backend.infra.routes.translation.query(request);
return knoxx.backend.infra.clients.openplanner.translation_export_sft_BANG_(knoxx.backend.infra.routes.translation.op_client(config),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"project","project",1124394579),(function (){var or__5162__auto__ = (q["project"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
}
})(),new cljs.core.Keyword(null,"target_lang","target_lang",220363042),(q["target_lang"]),new cljs.core.Keyword(null,"include_corrected","include_corrected",609452324),(q["include_corrected"])], null));
});
});
knoxx.backend.infra.routes.translation.create_segments_batch_op = (function knoxx$backend$infra$routes$translation$create_segments_batch_op(config){
return (function (request,ctx,p__29878){
var map__29879 = p__29878;
var map__29879__$1 = cljs.core.__destructure_map(map__29879);
var ctx_org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29879__$1,new cljs.core.Keyword(null,"ctx-org-id","ctx-org-id",949922116));
return knoxx.backend.infra.clients.openplanner.create_translation_segments_batch_BANG_(knoxx.backend.infra.routes.translation.op_client(config),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.translation.body_clj(request),new cljs.core.Keyword(null,"org_id","org_id",1380185385),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (ctx_org_id.cljs$core$IFn$_invoke$arity$1 ? ctx_org_id.cljs$core$IFn$_invoke$arity$1(ctx) : ctx_org_id.call(null,ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
});
});
knoxx.backend.infra.routes.translation.documents_op = (function knoxx$backend$infra$routes$translation$documents_op(config){
return (function (request,_ctx,_handlers){
var q = knoxx.backend.infra.routes.translation.query(request);
return knoxx.backend.infra.clients.openplanner.translation_documents_BANG_(knoxx.backend.infra.routes.translation.op_client(config),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"project","project",1124394579),(function (){var or__5162__auto__ = (q["project"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
}
})(),new cljs.core.Keyword(null,"target_lang","target_lang",220363042),(q["target_lang"]),new cljs.core.Keyword(null,"source_lang","source_lang",-931946297),(q["source_lang"]),new cljs.core.Keyword(null,"garden_id","garden_id",1092752211),(q["garden_id"])], null));
});
});
knoxx.backend.infra.routes.translation.review_document_op = (function knoxx$backend$infra$routes$translation$review_document_op(config){
return (function (request,ctx,p__29891){
var map__29895 = p__29891;
var map__29895__$1 = cljs.core.__destructure_map(map__29895);
var ctx_user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29895__$1,new cljs.core.Keyword(null,"ctx-user-id","ctx-user-id",-259951088));
var ctx_user_email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29895__$1,new cljs.core.Keyword(null,"ctx-user-email","ctx-user-email",-64148717));
var p = knoxx.backend.infra.routes.translation.params(request);
var body_with_auth = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.routes.translation.body_clj(request),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"labeler_id","labeler_id",-843194266),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (ctx_user_id.cljs$core$IFn$_invoke$arity$1 ? ctx_user_id.cljs$core$IFn$_invoke$arity$1(ctx) : ctx_user_id.call(null,ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})())),new cljs.core.Keyword(null,"labeler_email","labeler_email",-1161180430),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (ctx_user_email.cljs$core$IFn$_invoke$arity$1 ? ctx_user_email.cljs$core$IFn$_invoke$arity$1(ctx) : ctx_user_email.call(null,ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})()))], null)], 0));
return knoxx.backend.infra.clients.openplanner.review_translation_document_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(p["documentId"]),(p["targetLang"]),body_with_auth);
});
});
knoxx.backend.infra.routes.translation.batches_op = (function knoxx$backend$infra$routes$translation$batches_op(config){
return (function (request,_ctx,_handlers){
var q = knoxx.backend.infra.routes.translation.query(request);
return knoxx.backend.infra.clients.openplanner.translation_batches_BANG_(knoxx.backend.infra.routes.translation.op_client(config),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),(q["status"]),new cljs.core.Keyword(null,"garden_id","garden_id",1092752211),(q["garden_id"]),new cljs.core.Keyword(null,"target_lang","target_lang",220363042),(q["target_lang"])], null));
});
});
knoxx.backend.infra.routes.translation.register_segment_routes_BANG_ = (function knoxx$backend$infra$routes$translation$register_segment_routes_BANG_(app,runtime,config,handlers){
knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/segments",runtime,config,handlers,"org.translations.read",knoxx.backend.infra.routes.translation.translation_segments_op(config));

knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/segments/:id",runtime,config,handlers,"org.translations.read",(function (request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.translation_segment_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(knoxx.backend.infra.routes.translation.params(request)["id"]));
}));

knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"POST","/api/translations/segments/:id/labels",runtime,config,handlers,"org.translations.review",knoxx.backend.infra.routes.translation.label_segment_op(config));

return knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"POST","/api/translations/segments/batch",runtime,config,handlers,"org.translations.manage",knoxx.backend.infra.routes.translation.create_segments_batch_op(config));
});
knoxx.backend.infra.routes.translation.register_export_routes_BANG_ = (function knoxx$backend$infra$routes$translation$register_export_routes_BANG_(app,runtime,config,handlers){
knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/export/manifest",runtime,config,handlers,"org.translations.export",(function (request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.translation_export_manifest_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(function (){var or__5162__auto__ = (knoxx.backend.infra.routes.translation.query(request)["project"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
}
})());
}));

return knoxx.backend.infra.routes.translation.register_ndjson_route_BANG_(app,"GET","/api/translations/export/sft",runtime,config,handlers,"org.translations.export",knoxx.backend.infra.routes.translation.export_sft_op(config));
});
knoxx.backend.infra.routes.translation.register_document_routes_BANG_ = (function knoxx$backend$infra$routes$translation$register_document_routes_BANG_(app,runtime,config,handlers){
knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/documents",runtime,config,handlers,"org.translations.read",knoxx.backend.infra.routes.translation.documents_op(config));

knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/documents/:documentId/:targetLang",runtime,config,handlers,"org.translations.read",(function (request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.translation_document_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(knoxx.backend.infra.routes.translation.params(request)["documentId"]),(knoxx.backend.infra.routes.translation.params(request)["targetLang"]));
}));

return knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"POST","/api/translations/documents/:documentId/:targetLang/review",runtime,config,handlers,"org.translations.review",knoxx.backend.infra.routes.translation.review_document_op(config));
});
knoxx.backend.infra.routes.translation.register_translation_batch_routes_BANG_ = (function knoxx$backend$infra$routes$translation$register_translation_batch_routes_BANG_(app,runtime,config,handlers){
knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"POST","/api/translations/batches",runtime,config,handlers,"org.translations.manage",(function (request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.create_translation_batch_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(request["body"]));
}));

knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/batches",runtime,config,handlers,"org.translations.read",knoxx.backend.infra.routes.translation.batches_op(config));

knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/batches/next",runtime,config,handlers,"org.translations.manage",(function (_request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.next_translation_batch_BANG_(knoxx.backend.infra.routes.translation.op_client(config));
}));

knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"GET","/api/translations/batches/:id",runtime,config,handlers,"org.translations.read",(function (request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.translation_batch_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(knoxx.backend.infra.routes.translation.params(request)["id"]));
}));

return knoxx.backend.infra.routes.translation.register_json_route_BANG_(app,"POST","/api/translations/batches/:id/status",runtime,config,handlers,"org.translations.manage",(function (request,_ctx,_handlers){
return knoxx.backend.infra.clients.openplanner.update_translation_batch_status_BANG_(knoxx.backend.infra.routes.translation.op_client(config),(knoxx.backend.infra.routes.translation.params(request)["id"]),(request["body"]));
}));
});
knoxx.backend.infra.routes.translation.register_translation_routes_BANG_ = (function knoxx$backend$infra$routes$translation$register_translation_routes_BANG_(app,runtime,config,handlers){
knoxx.backend.infra.routes.translation.register_segment_routes_BANG_(app,runtime,config,handlers);

knoxx.backend.infra.routes.translation.register_export_routes_BANG_(app,runtime,config,handlers);

knoxx.backend.infra.routes.translation.register_document_routes_BANG_(app,runtime,config,handlers);

return knoxx.backend.infra.routes.translation.register_translation_batch_routes_BANG_(app,runtime,config,handlers);
});

//# sourceMappingURL=knoxx.backend.infra.routes.translation.js.map
