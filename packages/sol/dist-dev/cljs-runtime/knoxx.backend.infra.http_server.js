import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.esm.esm_import$fastify.js";
import "./shadow.esm.esm_import$$fastify$cors.js";
import "./shadow.esm.esm_import$$fastify$websocket.js";
import "./shadow.esm.esm_import$$fastify$multipart.js";
import "./shadow.esm.esm_import$$fastify$cookie.js";
import "./shadow.esm.esm_import$$fastify$formbody.js";
goog.provide('knoxx.backend.infra.http_server');
knoxx.backend.infra.http_server.create_app_BANG_ = (function knoxx$backend$infra$http_server$create_app_BANG_(){
return shadow.esm.esm_import$fastify.default(({"logger": true, "bodyLimit": (((50) * (1024)) * (1024)), "requestTimeout": (600000), "connectionTimeout": (600000), "forceCloseConnections": true}));
});
/**
 * Allow Content-Type: application/json with empty bodies.
 * 
 * Fastify's default parser throws FST_ERR_CTP_EMPTY_JSON_BODY, but some
 * endpoints are intentionally POST-without-body.
 */
knoxx.backend.infra.http_server.ensure_json_empty_body_parser_BANG_ = (function knoxx$backend$infra$http_server$ensure_json_empty_body_parser_BANG_(app){
return app.addContentTypeParser("application/json",({"parseAs": "string"}),(function (_req,body,done){
try{var G__30028 = null;
var G__30029 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(body,""))?({}):JSON.parse(body));
return (done.cljs$core$IFn$_invoke$arity$2 ? done.cljs$core$IFn$_invoke$arity$2(G__30028,G__30029) : done.call(null,G__30028,G__30029));
}catch (e30023){var err = e30023;
return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(err) : done.call(null,err));
}}));
});
knoxx.backend.infra.http_server.add_hook_BANG_ = (function knoxx$backend$infra$http_server$add_hook_BANG_(app,hook_name,handler){
return app.addHook(hook_name,handler);
});
knoxx.backend.infra.http_server.register_default_plugins_BANG_ = (async function knoxx$backend$infra$http_server$register_default_plugins_BANG_(app){
(await app.register(shadow.esm.esm_import$$fastify$cors.default,({"origin": true})));

(await app.register(shadow.esm.esm_import$$fastify$cookie.default));

(await app.register(shadow.esm.esm_import$$fastify$formbody.default));

(await app.register(shadow.esm.esm_import$$fastify$multipart.default,({"limits": ({"fileSize": (((50) * (1024)) * (1024)), "fieldSize": (((1) * (1024)) * (1024)), "files": (10)})})));

return (await app.register(shadow.esm.esm_import$$fastify$websocket.default));
});
knoxx.backend.infra.http_server.listen_BANG_ = (function knoxx$backend$infra$http_server$listen_BANG_(app,host,port){
return app.listen(({"host": host, "port": port}));
});
knoxx.backend.infra.http_server.close_BANG_ = (function knoxx$backend$infra$http_server$close_BANG_(app){
try{var result = app.close();
if((!((result == null)))){
return result;
} else {
return Promise.resolve(true);
}
}catch (e30052){var err = e30052;
return Promise.reject(err);
}});

//# sourceMappingURL=knoxx.backend.infra.http_server.js.map
