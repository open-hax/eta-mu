import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.auth.authz.js";
goog.provide('knoxx.backend.law.guards');
knoxx.backend.law.guards.attach_required_session_BANG_ = (async function knoxx$backend$law$guards$attach_required_session_BANG_(runtime,req,done){
try{var ctx = (await knoxx.backend.infra.auth.authz.resolve_request_context_BANG_(runtime,req));
(req["ctx"] = ctx);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}catch (e29219){var err = e29219;
return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(err) : done.call(null,err));
}});
knoxx.backend.law.guards.attach_optional_session_BANG_ = (async function knoxx$backend$law$guards$attach_optional_session_BANG_(runtime,req,done){
try{var ctx_29231 = (await knoxx.backend.infra.auth.authz.resolve_request_context_BANG_(runtime,req));
(req["ctx"] = ctx_29231);
}catch (e29221){var __29232 = e29221;
(req["ctx"] = null);
}
return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
});
/**
 * Returns a Fastify preHandler that resolves the Knoxx auth context and
 * attaches it to request.ctx.  Calls done(err) on failure so Fastify
 * returns 500 automatically.
 * 
 * Use for routes that require an authenticated context.
 */
knoxx.backend.law.guards.make_session_guard = (function knoxx$backend$law$guards$make_session_guard(runtime){
return (function (req,_reply,done){
knoxx.backend.law.guards.attach_required_session_BANG_(runtime,req,done);

return null;
});
});
/**
 * Returns a Fastify preHandler that opportunistically resolves auth context.
 * On any error (unauthenticated, policy-db unavailable, etc.) attaches nil
 * and continues — handler body should check `(when ctx ...)` before using it.
 * 
 * Use for routes where auth is optional (public endpoints that adapt when
 * a valid session is present).
 */
knoxx.backend.law.guards.make_optional_session_guard = (function knoxx$backend$law$guards$make_optional_session_guard(runtime){
return (function (req,_reply,done){
knoxx.backend.law.guards.attach_optional_session_BANG_(runtime,req,done);

return null;
});
});

//# sourceMappingURL=knoxx.backend.law.guards.js.map
