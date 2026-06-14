import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_studio');
knoxx.backend.infra.stores.mongo_policy_studio.STUDIO_STATE_COLLECTION = "knoxx_studio_state";
knoxx.backend.infra.stores.mongo_policy_studio.STUDIO_AUDIO_ASSETS_COLLECTION = "knoxx_studio_audio_assets";
knoxx.backend.infra.stores.mongo_policy_studio.state_coll = (function knoxx$backend$infra$stores$mongo_policy_studio$state_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_studio.STUDIO_STATE_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_studio.assets_coll = (function knoxx$backend$infra$stores$mongo_policy_studio$assets_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_studio.STUDIO_AUDIO_ASSETS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_studio.keywordize = (function knoxx$backend$infra$stores$mongo_policy_studio$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Create studio-state indexes. Idempotent.
 * Unique on (user_id, org_id, kind) mirrors PG's UNIQUE constraint.
 */
knoxx.backend.infra.stores.mongo_policy_studio.setup_state_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$setup_state_indexes_BANG_(db){
var coll = knoxx.backend.infra.stores.mongo_policy_studio.state_coll(db);
(await coll.createIndex(({"user_id": (1), "org_id": (1), "kind": (1)}),({"unique": true})));

return true;
});
/**
 * Return the state_json map for a user+org+kind, or nil.
 */
knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$get_studio_state_BANG_(var_args){
var G__25620 = arguments.length;
switch (G__25620) {
case 3:
return knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (user_id,org_id,kind){
return knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.mongo_client.get_db(),user_id,org_id,kind);
}));

(knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (db,user_id,org_id,kind){
var coll = knoxx.backend.infra.stores.mongo_policy_studio.state_coll(db);
var doc = knoxx.backend.infra.stores.mongo_policy_studio.keywordize((await coll.findOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "kind": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind))}))));
return new cljs.core.Keyword(null,"state_json","state_json",-1414766988).cljs$core$IFn$_invoke$arity$1(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Upsert studio state. Returns true on success.
 * Mirrors PG's ON CONFLICT (user_id,org_id,kind) DO UPDATE.
 */
knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$put_studio_state_BANG_(var_args){
var G__25633 = arguments.length;
switch (G__25633) {
case 4:
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (user_id,org_id,kind,state){
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$5(knoxx.backend.infra.mongo_client.get_db(),user_id,org_id,kind,state);
}));

(knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$5 = (async function (db,user_id,org_id,kind,state){
var coll = knoxx.backend.infra.stores.mongo_policy_studio.state_coll(db);
var now = (new Date());
var state_js = ((typeof state === 'string')?JSON.parse(state):cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = state;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())));
(await coll.updateOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "kind": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"state_json","state_json",-1414766988),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(state_js,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),now], null)), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"user_id","user_id",993497112),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)),new cljs.core.Keyword(null,"org_id","org_id",1380185385),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)),new cljs.core.Keyword(null,"kind","kind",-717265803),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)),new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return true;
}));

(knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$lang$maxFixedArity = 5);

/**
 * Return the playlist items vector for a user+org, or [].
 * Reads kind='playlist' and extracts :items from state_json.
 */
knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$get_studio_playlist_BANG_(var_args){
var G__25679 = arguments.length;
switch (G__25679) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (user_id,org_id){
return knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),user_id,org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,user_id,org_id){
var state = (await knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4(db,user_id,org_id,"playlist"));
var or__5162__auto__ = new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}));

(knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Upsert the playlist state. Returns true on success.
 */
knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$put_studio_playlist_BANG_(var_args){
var G__25692 = arguments.length;
switch (G__25692) {
case 3:
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (user_id,org_id,items){
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4(user_id,org_id,"playlist",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"items","items",1031954938),(await (async function (){var or__5162__auto__ = items;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null));
}));

(knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (db,user_id,org_id,items){
return knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$5(db,user_id,org_id,"playlist",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"items","items",1031954938),(await (async function (){var or__5162__auto__ = items;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null));
}));

(knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Create audio-asset indexes. Idempotent.
 * Unique on (audio_path, asset_type) mirrors PG's UNIQUE constraint.
 */
knoxx.backend.infra.stores.mongo_policy_studio.setup_assets_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$setup_assets_indexes_BANG_(db){
var coll = knoxx.backend.infra.stores.mongo_policy_studio.assets_coll(db);
(await coll.createIndex(({"audio_path": (1), "asset_type": (1)}),({"unique": true})));

return true;
});
/**
 * Return {:image-data :mime-type :width :height} for an audio asset, or nil.
 * image_data is returned as a Node Buffer.
 */
knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$get_audio_asset_BANG_(var_args){
var G__25727 = arguments.length;
switch (G__25727) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (audio_path,asset_type){
return knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),audio_path,asset_type);
}));

(knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,audio_path,asset_type){
var coll = knoxx.backend.infra.stores.mongo_policy_studio.assets_coll(db);
var doc = knoxx.backend.infra.stores.mongo_policy_studio.keywordize((await coll.findOne(({"audio_path": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(audio_path)), "asset_type": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(asset_type))}))));
if(cljs.core.truth_(doc)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"image-data","image-data",-377483758),new cljs.core.Keyword(null,"image_data","image_data",1901448026).cljs$core$IFn$_invoke$arity$1(doc),new cljs.core.Keyword(null,"mime-type","mime-type",1058646439),new cljs.core.Keyword(null,"mime_type","mime_type",1613436611).cljs$core$IFn$_invoke$arity$1(doc),new cljs.core.Keyword(null,"width","width",-384071477),new cljs.core.Keyword(null,"width","width",-384071477).cljs$core$IFn$_invoke$arity$1(doc),new cljs.core.Keyword(null,"height","height",1025178622),new cljs.core.Keyword(null,"height","height",1025178622).cljs$core$IFn$_invoke$arity$1(doc)], null);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Upsert an audio asset. image-data should be a Node Buffer or base64 string.
 * Returns true on success.
 * Mirrors PG's ON CONFLICT (audio_path, asset_type) DO UPDATE.
 */
knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_studio$save_audio_asset_BANG_(var_args){
var G__25768 = arguments.length;
switch (G__25768) {
case 6:
return knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
case 7:
return knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$6 = (async function (audio_path,asset_type,image_data,mime_type,width,height){
return knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$7(knoxx.backend.infra.mongo_client.get_db(),audio_path,asset_type,image_data,mime_type,width,height);
}));

(knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$7 = (async function (db,audio_path,asset_type,image_data,mime_type,width,height){
var coll = knoxx.backend.infra.stores.mongo_policy_studio.assets_coll(db);
var now = (new Date());
var buffer = ((typeof image_data === 'string')?Buffer.from(image_data,"base64"):image_data);
(await coll.updateOne(({"audio_path": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(audio_path)), "asset_type": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(asset_type))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"image_data","image_data",1901448026),buffer,new cljs.core.Keyword(null,"mime_type","mime_type",1613436611),(await (async function (){var or__5162__auto__ = mime_type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "image/png";
}
})()),new cljs.core.Keyword(null,"width","width",-384071477),width,new cljs.core.Keyword(null,"height","height",1025178622),height,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),now], null)), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"audio_path","audio_path",-1131629752),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(audio_path)),new cljs.core.Keyword(null,"asset_type","asset_type",1884668736),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(asset_type)),new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return true;
}));

(knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$lang$maxFixedArity = 7);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_studio.js.map
