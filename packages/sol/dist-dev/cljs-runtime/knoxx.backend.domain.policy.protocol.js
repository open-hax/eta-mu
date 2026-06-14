import "./cljs_env.js";
import "./cljs.core.js";
import "./open_hax.contracts.schema.js";
goog.provide('knoxx.backend.domain.policy.protocol');
knoxx.backend.domain.policy.protocol.validate_contract_BANG_ = (function knoxx$backend$domain$policy$protocol$validate_contract_BANG_(contract_class,value){
return open_hax.contracts.schema.assert_BANG_(contract_class,value);
});
knoxx.backend.domain.policy.protocol.validate_actor_BANG_ = (function knoxx$backend$domain$policy$protocol$validate_actor_BANG_(actor){
return knoxx.backend.domain.policy.protocol.validate_contract_BANG_(new cljs.core.Keyword(null,"actor","actor",-1830560481),actor);
});

/**
 * @interface
 */
knoxx.backend.domain.policy.protocol.PolicyStore = function(){};

var knoxx$backend$domain$policy$protocol$PolicyStore$list_contracts$dyn_26167 = (function (store,contract_class){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.list_contracts[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,contract_class) : m__5520__auto__.call(null,store,contract_class));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.list_contracts["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,contract_class) : m__5518__auto__.call(null,store,contract_class));
} else {
throw cljs.core.missing_protocol("PolicyStore.list-contracts",store);
}
}
});
/**
 * Return a promise or value containing contract-shaped maps for contract-class.
 */
knoxx.backend.domain.policy.protocol.list_contracts = (function knoxx$backend$domain$policy$protocol$list_contracts(store,contract_class){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$PolicyStore$list_contracts$arity$2 == null)))))){
return store.knoxx$backend$domain$policy$protocol$PolicyStore$list_contracts$arity$2(store,contract_class);
} else {
return knoxx$backend$domain$policy$protocol$PolicyStore$list_contracts$dyn_26167(store,contract_class);
}
});

var knoxx$backend$domain$policy$protocol$PolicyStore$get_contract$dyn_26168 = (function (store,contract_class,contract_id){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.get_contract[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(store,contract_class,contract_id) : m__5520__auto__.call(null,store,contract_class,contract_id));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.get_contract["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(store,contract_class,contract_id) : m__5518__auto__.call(null,store,contract_class,contract_id));
} else {
throw cljs.core.missing_protocol("PolicyStore.get-contract",store);
}
}
});
/**
 * Return one contract-shaped map by class/id, or nil.
 */
knoxx.backend.domain.policy.protocol.get_contract = (function knoxx$backend$domain$policy$protocol$get_contract(store,contract_class,contract_id){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$PolicyStore$get_contract$arity$3 == null)))))){
return store.knoxx$backend$domain$policy$protocol$PolicyStore$get_contract$arity$3(store,contract_class,contract_id);
} else {
return knoxx$backend$domain$policy$protocol$PolicyStore$get_contract$dyn_26168(store,contract_class,contract_id);
}
});

var knoxx$backend$domain$policy$protocol$PolicyStore$upsert_contract_BANG_$dyn_26173 = (function (store,contract_class,contract){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.upsert_contract_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(store,contract_class,contract) : m__5520__auto__.call(null,store,contract_class,contract));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.upsert_contract_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(store,contract_class,contract) : m__5518__auto__.call(null,store,contract_class,contract));
} else {
throw cljs.core.missing_protocol("PolicyStore.upsert-contract!",store);
}
}
});
/**
 * Validate and persist a contract-shaped map.
 */
knoxx.backend.domain.policy.protocol.upsert_contract_BANG_ = (function knoxx$backend$domain$policy$protocol$upsert_contract_BANG_(store,contract_class,contract){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_contract_BANG_$arity$3 == null)))))){
return store.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_contract_BANG_$arity$3(store,contract_class,contract);
} else {
return knoxx$backend$domain$policy$protocol$PolicyStore$upsert_contract_BANG_$dyn_26173(store,contract_class,contract);
}
});

var knoxx$backend$domain$policy$protocol$PolicyStore$list_actors$dyn_26177 = (function (store){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.list_actors[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(store) : m__5520__auto__.call(null,store));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.list_actors["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(store) : m__5518__auto__.call(null,store));
} else {
throw cljs.core.missing_protocol("PolicyStore.list-actors",store);
}
}
});
/**
 * Return actor contract maps validated by the shared contract schema.
 */
knoxx.backend.domain.policy.protocol.list_actors = (function knoxx$backend$domain$policy$protocol$list_actors(store){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$PolicyStore$list_actors$arity$1 == null)))))){
return store.knoxx$backend$domain$policy$protocol$PolicyStore$list_actors$arity$1(store);
} else {
return knoxx$backend$domain$policy$protocol$PolicyStore$list_actors$dyn_26177(store);
}
});

var knoxx$backend$domain$policy$protocol$PolicyStore$get_actor$dyn_26189 = (function (store,actor_id){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.get_actor[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,actor_id) : m__5520__auto__.call(null,store,actor_id));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.get_actor["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,actor_id) : m__5518__auto__.call(null,store,actor_id));
} else {
throw cljs.core.missing_protocol("PolicyStore.get-actor",store);
}
}
});
/**
 * Return one actor contract map validated by the shared contract schema, or nil.
 */
knoxx.backend.domain.policy.protocol.get_actor = (function knoxx$backend$domain$policy$protocol$get_actor(store,actor_id){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$PolicyStore$get_actor$arity$2 == null)))))){
return store.knoxx$backend$domain$policy$protocol$PolicyStore$get_actor$arity$2(store,actor_id);
} else {
return knoxx$backend$domain$policy$protocol$PolicyStore$get_actor$dyn_26189(store,actor_id);
}
});

var knoxx$backend$domain$policy$protocol$PolicyStore$upsert_actor_BANG_$dyn_26197 = (function (store,actor){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.upsert_actor_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,actor) : m__5520__auto__.call(null,store,actor));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.upsert_actor_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,actor) : m__5518__auto__.call(null,store,actor));
} else {
throw cljs.core.missing_protocol("PolicyStore.upsert-actor!",store);
}
}
});
/**
 * Validate and persist one actor contract map.
 */
knoxx.backend.domain.policy.protocol.upsert_actor_BANG_ = (function knoxx$backend$domain$policy$protocol$upsert_actor_BANG_(store,actor){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_actor_BANG_$arity$2 == null)))))){
return store.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_actor_BANG_$arity$2(store,actor);
} else {
return knoxx$backend$domain$policy$protocol$PolicyStore$upsert_actor_BANG_$dyn_26197(store,actor);
}
});


/**
 * @interface
 */
knoxx.backend.domain.policy.protocol.ActorCredentialStore = function(){};

var knoxx$backend$domain$policy$protocol$ActorCredentialStore$list_actor_credentials$dyn_26208 = (function (store,provider){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.list_actor_credentials[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,provider) : m__5520__auto__.call(null,store,provider));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.list_actor_credentials["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,provider) : m__5518__auto__.call(null,store,provider));
} else {
throw cljs.core.missing_protocol("ActorCredentialStore.list-actor-credentials",store);
}
}
});
/**
 * Return active actor credential state rows for provider. Implementations must not expose this through public contract APIs.
 */
knoxx.backend.domain.policy.protocol.list_actor_credentials = (function knoxx$backend$domain$policy$protocol$list_actor_credentials(store,provider){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$ActorCredentialStore$list_actor_credentials$arity$2 == null)))))){
return store.knoxx$backend$domain$policy$protocol$ActorCredentialStore$list_actor_credentials$arity$2(store,provider);
} else {
return knoxx$backend$domain$policy$protocol$ActorCredentialStore$list_actor_credentials$dyn_26208(store,provider);
}
});

var knoxx$backend$domain$policy$protocol$ActorCredentialStore$get_actor_credential$dyn_26232 = (function (store,actor_id,provider){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.get_actor_credential[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(store,actor_id,provider) : m__5520__auto__.call(null,store,actor_id,provider));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.get_actor_credential["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(store,actor_id,provider) : m__5518__auto__.call(null,store,actor_id,provider));
} else {
throw cljs.core.missing_protocol("ActorCredentialStore.get-actor-credential",store);
}
}
});
/**
 * Return actor credential state for provider. Implementations must not expose this through public contract APIs.
 */
knoxx.backend.domain.policy.protocol.get_actor_credential = (function knoxx$backend$domain$policy$protocol$get_actor_credential(store,actor_id,provider){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$ActorCredentialStore$get_actor_credential$arity$3 == null)))))){
return store.knoxx$backend$domain$policy$protocol$ActorCredentialStore$get_actor_credential$arity$3(store,actor_id,provider);
} else {
return knoxx$backend$domain$policy$protocol$ActorCredentialStore$get_actor_credential$dyn_26232(store,actor_id,provider);
}
});

var knoxx$backend$domain$policy$protocol$ActorCredentialStore$upsert_actor_credential_BANG_$dyn_26237 = (function (store,actor_id,provider,credential){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.upsert_actor_credential_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(store,actor_id,provider,credential) : m__5520__auto__.call(null,store,actor_id,provider,credential));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.upsert_actor_credential_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(store,actor_id,provider,credential) : m__5518__auto__.call(null,store,actor_id,provider,credential));
} else {
throw cljs.core.missing_protocol("ActorCredentialStore.upsert-actor-credential!",store);
}
}
});
/**
 * Persist mutable actor credential state.
 */
knoxx.backend.domain.policy.protocol.upsert_actor_credential_BANG_ = (function knoxx$backend$domain$policy$protocol$upsert_actor_credential_BANG_(store,actor_id,provider,credential){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$ActorCredentialStore$upsert_actor_credential_BANG_$arity$4 == null)))))){
return store.knoxx$backend$domain$policy$protocol$ActorCredentialStore$upsert_actor_credential_BANG_$arity$4(store,actor_id,provider,credential);
} else {
return knoxx$backend$domain$policy$protocol$ActorCredentialStore$upsert_actor_credential_BANG_$dyn_26237(store,actor_id,provider,credential);
}
});


/**
 * @interface
 */
knoxx.backend.domain.policy.protocol.ActorProjectionStore = function(){};

var knoxx$backend$domain$policy$protocol$ActorProjectionStore$sync_actor_projections_BANG_$dyn_26243 = (function (store,actors){
var x__5519__auto__ = (((store == null))?null:store);
var m__5520__auto__ = (knoxx.backend.domain.policy.protocol.sync_actor_projections_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(store,actors) : m__5520__auto__.call(null,store,actors));
} else {
var m__5518__auto__ = (knoxx.backend.domain.policy.protocol.sync_actor_projections_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(store,actors) : m__5518__auto__.call(null,store,actors));
} else {
throw cljs.core.missing_protocol("ActorProjectionStore.sync-actor-projections!",store);
}
}
});
/**
 * Sync canonical actor contracts into projection storage such as SQL memberships/users.
 */
knoxx.backend.domain.policy.protocol.sync_actor_projections_BANG_ = (function knoxx$backend$domain$policy$protocol$sync_actor_projections_BANG_(store,actors){
if((((!((store == null)))) && ((!((store.knoxx$backend$domain$policy$protocol$ActorProjectionStore$sync_actor_projections_BANG_$arity$2 == null)))))){
return store.knoxx$backend$domain$policy$protocol$ActorProjectionStore$sync_actor_projections_BANG_$arity$2(store,actors);
} else {
return knoxx$backend$domain$policy$protocol$ActorProjectionStore$sync_actor_projections_BANG_$dyn_26243(store,actors);
}
});


//# sourceMappingURL=knoxx.backend.domain.policy.protocol.js.map
