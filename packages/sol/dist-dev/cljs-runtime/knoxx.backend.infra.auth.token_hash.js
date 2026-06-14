import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.esm.esm_import$node_crypto.js";
goog.provide('knoxx.backend.infra.auth.token_hash');
/**
 * Salted sha256 hex digest of a session token for at-rest storage.
 */
knoxx.backend.infra.auth.token_hash.hash_token = (function knoxx$backend$infra$auth$token_hash$hash_token(token,salt){
var h = shadow.esm.esm_import$node_crypto.createHash("sha256");
h.update((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(salt)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)),"utf8");

return h.digest("hex");
});
/**
 * Deterministic 12-hex-char lookup prefix for a token (unsalted).
 */
knoxx.backend.infra.auth.token_hash.token_prefix = (function knoxx$backend$infra$auth$token_hash$token_prefix(token){
var h = shadow.esm.esm_import$node_crypto.createHash("sha256");
h.update((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)),"utf8");

return cljs.core.subs.cljs$core$IFn$_invoke$arity$3(h.digest("hex"),(0),(12));
});
/**
 * 16 random bytes as hex.
 */
knoxx.backend.infra.auth.token_hash.generate_salt = (function knoxx$backend$infra$auth$token_hash$generate_salt(){
return shadow.esm.esm_import$node_crypto.randomBytes((16)).toString("hex");
});
/**
 * 32 random bytes as hex — used for the persisted session secret.
 */
knoxx.backend.infra.auth.token_hash.generate_secret = (function knoxx$backend$infra$auth$token_hash$generate_secret(){
return shadow.esm.esm_import$node_crypto.randomBytes((32)).toString("hex");
});

//# sourceMappingURL=knoxx.backend.infra.auth.token_hash.js.map
