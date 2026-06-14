import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_os.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.domain.session_mycology');
knoxx.backend.domain.session_mycology.SPORE_THRESHOLD = 0.72;
knoxx.backend.domain.session_mycology.PROMOTION_MIN_RECURRENCE = Math.max((2),Number((function (){var or__5162__auto__ = (process.env["KNOXX_MYCOLOGY_PROMOTION_MIN_RECURRENCE"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (2);
}
})()));
knoxx.backend.domain.session_mycology.PROMOTION_HINT_P = (function (){var v = Number((function (){var or__5162__auto__ = (process.env["KNOXX_MYCOLOGY_PROMOTION_HINT_P"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return 0.84;
}
})());
return Math.max((0),Math.min((1),(cljs.core.truth_(Number.isFinite(v))?v:0.84)));
})();
knoxx.backend.domain.session_mycology.session_mycology_params = new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Action: reflect to record a retrospective, or list_recent to inspect recent spores."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"efficiencyP","efficiencyP",-1605449599),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Confidence 0..1 that the chosen path was near-minimal."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(0),new cljs.core.Keyword(null,"max","max",61366548),(1)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"frictionP","frictionP",-1971997847),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Confidence 0..1 that the work was harder than it should have been."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(0),new cljs.core.Keyword(null,"max","max",61366548),(1)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"skillCandidateP","skillCandidateP",-1415177379),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Confidence 0..1 that a reusable skill or protocol would compress future effort."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(0),new cljs.core.Keyword(null,"max","max",61366548),(1)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"lesson","lesson",-375763528),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Short lesson from the turn."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"betterPath","betterPath",1468126181),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Better path to try next time."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"candidateName","candidateName",-1573911432),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Candidate skill name if a spore should be incubated."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"candidateDescription","candidateDescription",1287452205),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"One sentence describing the candidate skill."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reuseScope","reuseScope",-1484548913),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional reuse scope: turn, session, or multi-session."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.session_mycology.make_state_dir_fn = (function knoxx$backend$domain$session_mycology$make_state_dir_fn(node_os,node_path){
return (function (){
var G__27580 = node_os.homedir();
var G__27581 = ".knoxx";
var G__27582 = "state";
var G__27583 = "session-mycology";
return (node_path.join.cljs$core$IFn$_invoke$arity$4 ? node_path.join.cljs$core$IFn$_invoke$arity$4(G__27580,G__27581,G__27582,G__27583) : node_path.join.call(null,G__27580,G__27581,G__27582,G__27583));
});
});
knoxx.backend.domain.session_mycology.make_reflections_file_fn = (function knoxx$backend$domain$session_mycology$make_reflections_file_fn(state_dir_fn,node_path){
return (function (){
var G__27591 = (state_dir_fn.cljs$core$IFn$_invoke$arity$0 ? state_dir_fn.cljs$core$IFn$_invoke$arity$0() : state_dir_fn.call(null));
var G__27592 = "turn-reflections.jsonl";
return (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(G__27591,G__27592) : node_path.join.call(null,G__27591,G__27592));
});
});
knoxx.backend.domain.session_mycology.make_spores_file_fn = (function knoxx$backend$domain$session_mycology$make_spores_file_fn(state_dir_fn,node_path){
return (function (){
var G__27595 = (state_dir_fn.cljs$core$IFn$_invoke$arity$0 ? state_dir_fn.cljs$core$IFn$_invoke$arity$0() : state_dir_fn.call(null));
var G__27596 = "skill-spores.jsonl";
return (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(G__27595,G__27596) : node_path.join.call(null,G__27595,G__27596));
});
});
knoxx.backend.domain.session_mycology.make_promotions_file_fn = (function knoxx$backend$domain$session_mycology$make_promotions_file_fn(state_dir_fn,node_path){
return (function (){
var G__27603 = (state_dir_fn.cljs$core$IFn$_invoke$arity$0 ? state_dir_fn.cljs$core$IFn$_invoke$arity$0() : state_dir_fn.call(null));
var G__27604 = "skill-promotions.jsonl";
return (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(G__27603,G__27604) : node_path.join.call(null,G__27603,G__27604));
});
});
knoxx.backend.domain.session_mycology.make_spore_drafts_dir_fn = (function knoxx$backend$domain$session_mycology$make_spore_drafts_dir_fn(state_dir_fn,node_path){
return (function (){
var G__27609 = (state_dir_fn.cljs$core$IFn$_invoke$arity$0 ? state_dir_fn.cljs$core$IFn$_invoke$arity$0() : state_dir_fn.call(null));
var G__27610 = "spores";
return (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(G__27609,G__27610) : node_path.join.call(null,G__27609,G__27610));
});
});
knoxx.backend.domain.session_mycology.now_iso = (function knoxx$backend$domain$session_mycology$now_iso(){
return (new Date()).toISOString();
});
knoxx.backend.domain.session_mycology.clamp_01 = (function knoxx$backend$domain$session_mycology$clamp_01(value,fallback){
var n = Number(value);
if(cljs.core.truth_(Number.isFinite(n))){
return Math.max((0),Math.min((1),n));
} else {
return fallback;
}
});
knoxx.backend.domain.session_mycology.slugify = (function knoxx$backend$domain$session_mycology$slugify(value){
var s = clojure.string.replace(clojure.string.replace(clojure.string.replace(clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),/[^a-z0-9]+/,"-"),/^-+|-$/,""),/--+/,"-");
if(clojure.string.blank_QMARK_(s)){
return "skill-spore";
} else {
return s;
}
});
knoxx.backend.domain.session_mycology.yaml_quote = (function knoxx$backend$domain$session_mycology$yaml_quote(value){
return JSON.stringify((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
});
knoxx.backend.domain.session_mycology.same_cwd = (function knoxx$backend$domain$session_mycology$same_cwd(node_path,a,b){
var and__5160__auto__ = a;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = b;
if(cljs.core.truth_(and__5160__auto____$1)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((node_path.resolve.cljs$core$IFn$_invoke$arity$1 ? node_path.resolve.cljs$core$IFn$_invoke$arity$1(a) : node_path.resolve.call(null,a)),(node_path.resolve.cljs$core$IFn$_invoke$arity$1 ? node_path.resolve.cljs$core$IFn$_invoke$arity$1(b) : node_path.resolve.call(null,b)));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
});
knoxx.backend.domain.session_mycology.normalize_reuse_scope = (function knoxx$backend$domain$session_mycology$normalize_reuse_scope(value){
var v = clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "session";
}
})()))));
if(cljs.core.truth_((function (){var fexpr__27632 = cljs.core.set(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["turn","session","multi-session"], null));
return (fexpr__27632.cljs$core$IFn$_invoke$arity$1 ? fexpr__27632.cljs$core$IFn$_invoke$arity$1(v) : fexpr__27632.call(null,v));
})())){
return v;
} else {
return "session";
}
});
knoxx.backend.domain.session_mycology.reflection_kind = (function knoxx$backend$domain$session_mycology$reflection_kind(reflection){
if(cljs.core.not(reflection)){
return "none";
} else {
var skill_p = knoxx.backend.domain.session_mycology.clamp_01((reflection["skillCandidateP"]),(0));
var fric_p = knoxx.backend.domain.session_mycology.clamp_01((reflection["frictionP"]),(0));
var eff_p = knoxx.backend.domain.session_mycology.clamp_01((reflection["efficiencyP"]),(0));
if((skill_p >= 0.72)){
return "sporeworthy";
} else {
if((fric_p >= 0.68)){
return "gnarly";
} else {
if((((eff_p >= 0.75)) && ((fric_p <= 0.35)))){
return "smooth";
} else {
return "mixed";

}
}
}
}
});
knoxx.backend.domain.session_mycology.append_jsonl_BANG_ = (async function knoxx$backend$domain$session_mycology$append_jsonl_BANG_(node_path,file_path,value){
(await shadow.esm.esm_import$node_fs$promises.mkdir((node_path.dirname.cljs$core$IFn$_invoke$arity$1 ? node_path.dirname.cljs$core$IFn$_invoke$arity$1(file_path) : node_path.dirname.call(null,file_path)),({"recursive": true})));

return (await shadow.esm.esm_import$node_fs$promises.appendFile(file_path,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(JSON.stringify(value))+"\n"),"utf8"));
});
knoxx.backend.domain.session_mycology.make_append_jsonl_fn = (function knoxx$backend$domain$session_mycology$make_append_jsonl_fn(node_path){
return cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.session_mycology.append_jsonl_BANG_,node_path);
});
knoxx.backend.domain.session_mycology.read_jsonl_BANG_ = (async function knoxx$backend$domain$session_mycology$read_jsonl_BANG_(file_path,limit){
try{var text = (await shadow.esm.esm_import$node_fs$promises.readFile(file_path,"utf8"));
var lines = Array.prototype.slice.call(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.identity,clojure.string.split.cljs$core$IFn$_invoke$arity$2(text,/\r?\n/)),(- limit));
return Array.from(lines.map((function (line){
try{return JSON.parse(line);
}catch (e27662){if((e27662 instanceof Error)){
var _ = e27662;
return null;
} else {
throw e27662;

}
}})).filter((function (x){
return x;
})));
}catch (e27653){var _ = e27653;
return [];
}});
knoxx.backend.domain.session_mycology.make_read_jsonl_fn = (function knoxx$backend$domain$session_mycology$make_read_jsonl_fn(){
return knoxx.backend.domain.session_mycology.read_jsonl_BANG_;
});
knoxx.backend.domain.session_mycology.load_recent_spores_BANG_ = (async function knoxx$backend$domain$session_mycology$load_recent_spores_BANG_(read_jsonl_fn,spores_file_fn,node_path,cwd,limit){
var rows = (await (await (async function (){var G__27675 = (spores_file_fn.cljs$core$IFn$_invoke$arity$0 ? spores_file_fn.cljs$core$IFn$_invoke$arity$0() : spores_file_fn.call(null));
var G__27676 = (400);
return (read_jsonl_fn.cljs$core$IFn$_invoke$arity$2 ? read_jsonl_fn.cljs$core$IFn$_invoke$arity$2(G__27675,G__27676) : read_jsonl_fn.call(null,G__27675,G__27676));
})()));
var filtered = rows.filter((function (row){
var or__5162__auto__ = cljs.core.not(cwd);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.domain.session_mycology.same_cwd(node_path,(row["cwd"]),cwd);
}
}));
return Array.from(filtered.slice((filtered.length - limit)).reverse());
});
knoxx.backend.domain.session_mycology.make_load_recent_spores_fn = (function knoxx$backend$domain$session_mycology$make_load_recent_spores_fn(read_jsonl_fn,spores_file_fn,node_path){
return cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.session_mycology.load_recent_spores_BANG_,read_jsonl_fn,spores_file_fn,node_path);
});
knoxx.backend.domain.session_mycology.find_latest_spore_BANG_ = (async function knoxx$backend$domain$session_mycology$find_latest_spore_BANG_(read_jsonl_fn,spores_file_fn,node_path,slug,cwd){
var rows = (await (await (async function (){var G__27685 = (spores_file_fn.cljs$core$IFn$_invoke$arity$0 ? spores_file_fn.cljs$core$IFn$_invoke$arity$0() : spores_file_fn.call(null));
var G__27686 = (400);
return (read_jsonl_fn.cljs$core$IFn$_invoke$arity$2 ? read_jsonl_fn.cljs$core$IFn$_invoke$arity$2(G__27685,G__27686) : read_jsonl_fn.call(null,G__27685,G__27686));
})()));
var filtered = rows.filter((function (row){
var and__5160__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((row["slug"]),slug);
if(and__5160__auto__){
var or__5162__auto__ = cljs.core.not(cwd);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.domain.session_mycology.same_cwd(node_path,(row["cwd"]),cwd);
}
} else {
return and__5160__auto__;
}
}));
var or__5162__auto__ = filtered.at((-1));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return null;
}
});
knoxx.backend.domain.session_mycology.make_find_latest_spore_fn = (function knoxx$backend$domain$session_mycology$make_find_latest_spore_fn(read_jsonl_fn,spores_file_fn,node_path){
return cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.session_mycology.find_latest_spore_BANG_,read_jsonl_fn,spores_file_fn,node_path);
});
knoxx.backend.domain.session_mycology.summarize_spores = (function knoxx$backend$domain$session_mycology$summarize_spores(spores){
if((spores.length === (0))){
return "- none yet";
} else {
return spores.map((function (spore){
return (""+"- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["name"]))+" (recurrence "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["recurrence"]))+", p_skill "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.clamp_01((spore["skillCandidateP"]),(0)).toFixed((2)))+")"+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["description"])));
})).join("\n");
}
});
knoxx.backend.domain.session_mycology.build_spore_skill_draft = (function knoxx$backend$domain$session_mycology$build_spore_skill_draft(spore){
return (""+"---\n"+"name: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"\n"+"description: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["description"])))+"\n"+"disable-model-invocation: true\n"+"metadata:\n  origin: session-mycology-spore\n  recurrence: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["recurrence"]))+"\n---\n\n"+"# "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["name"]))+"\n\n## Goal\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["description"]))+"\n\n"+"## Use This Skill When\n- The same friction pattern recurs.\n\n"+"## Do Not Use This Skill When\n- The pain was only a one-off environment glitch.\n");
});
knoxx.backend.domain.session_mycology.build_spore_contract_draft = (function knoxx$backend$domain$session_mycology$build_spore_contract_draft(spore){
return (""+"(skill-contract\n  (name "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["slug"])))+")\n"+"  (v \"knoxx.skill/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"@0.0.1-spore\")\n"+"  (intent "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["description"])))+")\n\n"+"  (activation\n    (priority 35)\n    (explicit [\"skill:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"\"])\n"+"    (triggers ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["name"]).toLowerCase()))+"]))\n\n"+"  (governance\n    (touch-layer :mutable)\n    (non-override [:mission :directives :safety :license :output-shape])\n    (requires-user-approval false))\n)");
});
knoxx.backend.domain.session_mycology.promotion_eligible_QMARK_ = (function knoxx$backend$domain$session_mycology$promotion_eligible_QMARK_(spore){
if(cljs.core.not(spore)){
return false;
} else {
var reuse_scope = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (spore["reuseScope"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "session";
}
})()));
var recurrence = Number((function (){var or__5162__auto__ = (spore["recurrence"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
var skill_p = knoxx.backend.domain.session_mycology.clamp_01((spore["skillCandidateP"]),(0));
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(reuse_scope,"turn")) && ((recurrence < (knoxx.backend.domain.session_mycology.PROMOTION_MIN_RECURRENCE + (1)))))){
return false;
} else {
if((recurrence >= knoxx.backend.domain.session_mycology.PROMOTION_MIN_RECURRENCE)){
return true;
} else {
if((skill_p >= knoxx.backend.domain.session_mycology.PROMOTION_HINT_P)){
return true;
} else {
return false;

}
}
}
}
});
knoxx.backend.domain.session_mycology.build_live_skill = (function knoxx$backend$domain$session_mycology$build_live_skill(spore){
return (""+"---\nname: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"\ndescription: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["description"])))+"\nlicense: GPL-3.0\nmetadata:\n"+"  origin: session-mycology-promotion\n  promoted-from-spore: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"\n  recurrence: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["recurrence"]))+"\n---\n\n"+"# Skill: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["name"]))+"\n\n## Goal\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["description"]))+"\n");
});
knoxx.backend.domain.session_mycology.build_live_contract = (function knoxx$backend$domain$session_mycology$build_live_contract(spore){
return (""+"(skill-contract\n  (name "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["slug"])))+")\n"+"  (v \"knoxx.skill/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"@0.1.0\")\n\n"+"  (intent "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["description"])))+")\n\n"+"  (activation\n    (explicit [\"skill:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+"\"])\n"+"    (triggers ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote((spore["name"]).toLowerCase()))+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.yaml_quote(clojure.string.replace((spore["slug"]),/-/," ")))+"]))\n\n"+"  (governance\n    (touch-layer :mutable)\n    (non-override [:mission :directives :safety :license :output-shape])\n    (requires-user-approval false))\n)\n");
});
knoxx.backend.domain.session_mycology.promote_spore_to_skill_BANG_ = (async function knoxx$backend$domain$session_mycology$promote_spore_to_skill_BANG_(node_path,node_os,promotions_file_fn,spore){
if((!(knoxx.backend.domain.session_mycology.promotion_eligible_QMARK_(spore)))){
return ({"promoted": false, "eligible": false});
} else {
var home = node_os.homedir();
var dir = (await (async function (){var G__27729 = home;
var G__27730 = ".knoxx";
var G__27731 = "skills";
var G__27732 = (spore["slug"]);
return (node_path.join.cljs$core$IFn$_invoke$arity$4 ? node_path.join.cljs$core$IFn$_invoke$arity$4(G__27729,G__27730,G__27731,G__27732) : node_path.join.call(null,G__27729,G__27730,G__27731,G__27732));
})());
var skill_path = (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(dir,"SKILL.md") : node_path.join.call(null,dir,"SKILL.md"));
var contract_path = (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(dir,"CONTRACT.edn") : node_path.join.call(null,dir,"CONTRACT.edn"));
var append_jsonl_fn = knoxx.backend.domain.session_mycology.make_append_jsonl_fn(node_path);
(await shadow.esm.esm_import$node_fs$promises.mkdir(dir,({"recursive": true})));

var created_skill = (await (async function (){try{(await shadow.esm.esm_import$node_fs$promises.access(skill_path));

return false;
}catch (e27737){var _ = e27737;
(await shadow.esm.esm_import$node_fs$promises.writeFile(skill_path,knoxx.backend.domain.session_mycology.build_live_skill(spore),"utf8"));

return true;
}})());
var created_contract = (await (async function (){try{(await shadow.esm.esm_import$node_fs$promises.access(contract_path));

return false;
}catch (e27738){var _ = e27738;
(await shadow.esm.esm_import$node_fs$promises.writeFile(contract_path,knoxx.backend.domain.session_mycology.build_live_contract(spore),"utf8"));

return true;
}})());
if(((created_skill) || (created_contract))){
(await append_jsonl_fn((promotions_file_fn.cljs$core$IFn$_invoke$arity$0 ? promotions_file_fn.cljs$core$IFn$_invoke$arity$0() : promotions_file_fn.call(null)),({"slug": (spore["slug"]), "sessionFile": (spore["sessionFile"]), "createdSkill": created_skill, "createdContract": created_contract, "name": (spore["name"]), "skillPath": skill_path, "cwd": (spore["cwd"]), "contractPath": contract_path, "ts": knoxx.backend.domain.session_mycology.now_iso(), "recurrence": (spore["recurrence"]), "skillCandidateP": (spore["skillCandidateP"])})));
} else {
}

return ({"promoted": ((created_skill) || (created_contract)), "eligible": true, "skillPath": skill_path, "contractPath": contract_path, "createdSkill": created_skill, "createdContract": created_contract});
}
});
knoxx.backend.domain.session_mycology.make_promote_spore_to_skill_fn = (function knoxx$backend$domain$session_mycology$make_promote_spore_to_skill_fn(node_path,node_os,promotions_file_fn){
return cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.session_mycology.promote_spore_to_skill_BANG_,node_path,node_os,promotions_file_fn);
});
knoxx.backend.domain.session_mycology.write_spore_draft_BANG_ = (async function knoxx$backend$domain$session_mycology$write_spore_draft_BANG_(node_path,node_os,spore_drafts_dir_fn,reflection,spore){
var home = node_os.homedir();
var file_path = (await (async function (){var G__27748 = (spore_drafts_dir_fn.cljs$core$IFn$_invoke$arity$0 ? spore_drafts_dir_fn.cljs$core$IFn$_invoke$arity$0() : spore_drafts_dir_fn.call(null));
var G__27749 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["slug"]))+".md");
return (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(G__27748,G__27749) : node_path.join.call(null,G__27748,G__27749));
})());
var skill_draft = knoxx.backend.domain.session_mycology.build_spore_skill_draft(spore);
var contract_draft = knoxx.backend.domain.session_mycology.build_spore_contract_draft(spore);
var content = (""+"# Skill Spore: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["name"]))+"\n\n"+"- Generated: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["ts"]))+"\n"+"- Recurrence: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["recurrence"]))+"\n"+"- CWD: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["cwd"]))+"\n"+"- Reuse scope: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["reuseScope"]))+"\n"+"- Reflection kind: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["reflectionKind"]))+"\n"+"- p-efficiency: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.clamp_01((reflection["efficiencyP"]),(0)).toFixed((2)))+"\n"+"- p-friction: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.clamp_01((reflection["frictionP"]),(0)).toFixed((2)))+"\n"+"- p-skill-candidate: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.clamp_01((reflection["skillCandidateP"]),(0)).toFixed((2)))+"\n\n"+"## Lesson\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (reflection["lesson"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "_none captured_";
}
})()))+"\n\n"+"## Better path next time\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (reflection["betterPath"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "_none captured_";
}
})()))+"\n\n"+"## Candidate description\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["description"]))+"\n\n"+"## Promotion gate\nPromote this spore into a live skill after either:\n"+"- recurrence >= "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.session_mycology.PROMOTION_MIN_RECURRENCE)+"\n- explicit user request\n- or strong evidence that the pattern generalizes beyond the current task\n\n"+"## Draft SKILL.md\n\n~~~markdown\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(skill_draft)+"~~~\n\n"+"## Draft CONTRACT.edn\n\n~~~edn\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_draft)+"~~~\n\n"+"## Suggested live-skill path\n\n- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var G__27755 = home;
var G__27756 = ".knoxx";
var G__27757 = "skills";
var G__27758 = (spore["slug"]);
var G__27759 = "SKILL.md";
return (node_path.join.cljs$core$IFn$_invoke$arity$5 ? node_path.join.cljs$core$IFn$_invoke$arity$5(G__27755,G__27756,G__27757,G__27758,G__27759) : node_path.join.call(null,G__27755,G__27756,G__27757,G__27758,G__27759));
})()))+"\n- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var G__27760 = home;
var G__27761 = ".knoxx";
var G__27762 = "skills";
var G__27763 = (spore["slug"]);
var G__27764 = "CONTRACT.edn";
return (node_path.join.cljs$core$IFn$_invoke$arity$5 ? node_path.join.cljs$core$IFn$_invoke$arity$5(G__27760,G__27761,G__27762,G__27763,G__27764) : node_path.join.call(null,G__27760,G__27761,G__27762,G__27763,G__27764));
})()))+"\n");
(await shadow.esm.esm_import$node_fs$promises.mkdir((node_path.dirname.cljs$core$IFn$_invoke$arity$1 ? node_path.dirname.cljs$core$IFn$_invoke$arity$1(file_path) : node_path.dirname.call(null,file_path)),({"recursive": true})));

(await shadow.esm.esm_import$node_fs$promises.writeFile(file_path,content,"utf8"));

return file_path;
});
knoxx.backend.domain.session_mycology.make_write_spore_draft_fn = (function knoxx$backend$domain$session_mycology$make_write_spore_draft_fn(node_path,node_os,spore_drafts_dir_fn){
return cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.session_mycology.write_spore_draft_BANG_,node_path,node_os,spore_drafts_dir_fn);
});
knoxx.backend.domain.session_mycology.execute_reflect_action = (async function knoxx$backend$domain$session_mycology$execute_reflect_action(params,cwd,session_file,model_label,node_path,append_jsonl_fn,reflections_file_fn,find_latest_spore_fn,spore_drafts_dir_fn,write_spore_draft_fn,spores_file_fn,promote_spore_to_skill_fn){
var reflection = ({"efficiencyP": knoxx.backend.domain.session_mycology.clamp_01((params["efficiencyP"]),0.5), "sessionFile": session_file, "betterPath": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (params["betterPath"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).trim(), "frictionP": knoxx.backend.domain.session_mycology.clamp_01((params["frictionP"]),0.5), "cwd": cwd, "ts": knoxx.backend.domain.session_mycology.now_iso(), "lesson": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (params["lesson"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).trim(), "skillCandidateP": knoxx.backend.domain.session_mycology.clamp_01((params["skillCandidateP"]),0.5), "model": model_label});
(await (await (async function (){var G__27784 = (reflections_file_fn.cljs$core$IFn$_invoke$arity$0 ? reflections_file_fn.cljs$core$IFn$_invoke$arity$0() : reflections_file_fn.call(null));
var G__27785 = reflection;
return (append_jsonl_fn.cljs$core$IFn$_invoke$arity$2 ? append_jsonl_fn.cljs$core$IFn$_invoke$arity$2(G__27784,G__27785) : append_jsonl_fn.call(null,G__27784,G__27785));
})()));

var name = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (params["candidateName"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).trim();
var description = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (params["candidateDescription"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))).trim();
var should_incubate = (((name.length > (0))) && ((((description.length > (0))) && (((((reflection["skillCandidateP"]) >= 0.72)) || (((reflection["frictionP"]) >= 0.68)))))));
if((!(should_incubate))){
return knoxx.backend.domain.text.tool_text_result((""+"Recorded reflection (p_eff="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((reflection["efficiencyP"]).toFixed((2)))+", p_fric="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((reflection["frictionP"]).toFixed((2)))+", p_skill="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((reflection["skillCandidateP"]).toFixed((2)))+"). No spore incubated."),({"reflection": reflection}));
} else {
var slug = knoxx.backend.domain.session_mycology.slugify(name);
var prior = (await (find_latest_spore_fn.cljs$core$IFn$_invoke$arity$2 ? find_latest_spore_fn.cljs$core$IFn$_invoke$arity$2(slug,cwd) : find_latest_spore_fn.call(null,slug,cwd)));
var prior_recurrence = Number((await (async function (){var or__5162__auto__ = (cljs.core.truth_(prior)?(prior["recurrence"]):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()));
var prior_draft_path = (cljs.core.truth_(prior)?(prior["draftPath"]):null);
var spore = ({"description": description, "efficiencyP": (reflection["efficiencyP"]), "slug": slug, "sessionFile": session_file, "reflectionKind": knoxx.backend.domain.session_mycology.reflection_kind(reflection), "name": name, "frictionP": (reflection["frictionP"]), "cwd": cwd, "reuseScope": knoxx.backend.domain.session_mycology.normalize_reuse_scope((params["reuseScope"])), "ts": knoxx.backend.domain.session_mycology.now_iso(), "recurrence": Math.max((1),(prior_recurrence + (1))), "reflectionTs": (reflection["ts"]), "skillCandidateP": (reflection["skillCandidateP"]), "model": model_label});
(spore["draftPath"] = (await (async function (){var or__5162__auto__ = prior_draft_path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__27801 = (spore_drafts_dir_fn.cljs$core$IFn$_invoke$arity$0 ? spore_drafts_dir_fn.cljs$core$IFn$_invoke$arity$0() : spore_drafts_dir_fn.call(null));
var G__27802 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)+".md");
return (node_path.join.cljs$core$IFn$_invoke$arity$2 ? node_path.join.cljs$core$IFn$_invoke$arity$2(G__27801,G__27802) : node_path.join.call(null,G__27801,G__27802));
}
})()));

(await (write_spore_draft_fn.cljs$core$IFn$_invoke$arity$2 ? write_spore_draft_fn.cljs$core$IFn$_invoke$arity$2(reflection,spore) : write_spore_draft_fn.call(null,reflection,spore)));

(await (await (async function (){var G__27803 = (spores_file_fn.cljs$core$IFn$_invoke$arity$0 ? spores_file_fn.cljs$core$IFn$_invoke$arity$0() : spores_file_fn.call(null));
var G__27804 = spore;
return (append_jsonl_fn.cljs$core$IFn$_invoke$arity$2 ? append_jsonl_fn.cljs$core$IFn$_invoke$arity$2(G__27803,G__27804) : append_jsonl_fn.call(null,G__27803,G__27804));
})()));

var promotion = (await (promote_spore_to_skill_fn.cljs$core$IFn$_invoke$arity$1 ? promote_spore_to_skill_fn.cljs$core$IFn$_invoke$arity$1(spore) : promote_spore_to_skill_fn.call(null,spore)));
return knoxx.backend.domain.text.tool_text_result((""+"Recorded reflection (p_eff="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((reflection["efficiencyP"]).toFixed((2)))+", p_fric="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((reflection["frictionP"]).toFixed((2)))+", p_skill="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((reflection["skillCandidateP"]).toFixed((2)))+"). Incubated spore: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+" -> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((spore["draftPath"]))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_((promotion["promoted"]))?(""+" | promoted live skill: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((promotion["skillPath"]))):null))),({"reflection": reflection, "spore": spore, "promotion": promotion}));
}
});
knoxx.backend.domain.session_mycology.session_mycology_execute_BANG_ = (async function knoxx$backend$domain$session_mycology$session_mycology_execute_BANG_(params,ctx,load_recent_spores_fn,execute_reflect_action){
var action = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (params["action"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "reflect";
}
})()))).trim().toLowerCase();
var cwd = (await (async function (){var or__5162__auto__ = (ctx["cwd"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return process.cwd();
}
})());
var session_file = (await (async function (){var or__5162__auto__ = (ctx["sessionFile"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var model_label = (await (async function (){var or__5162__auto__ = (ctx["modelLabel"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})());
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(action,"list_recent")){
var spores = (await (load_recent_spores_fn.cljs$core$IFn$_invoke$arity$2 ? load_recent_spores_fn.cljs$core$IFn$_invoke$arity$2(cwd,(5)) : load_recent_spores_fn.call(null,cwd,(5))));
return knoxx.backend.domain.text.tool_text_result((((spores.length > (0)))?knoxx.backend.domain.session_mycology.summarize_spores(spores):"- none yet"),({"spores": spores}));
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(action,"reflect")){
return Promise.reject((new Error((""+"Unknown session_mycology action: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((params["action"]))))));
} else {
return (execute_reflect_action.cljs$core$IFn$_invoke$arity$4 ? execute_reflect_action.cljs$core$IFn$_invoke$arity$4(params,cwd,session_file,model_label) : execute_reflect_action.call(null,params,cwd,session_file,model_label));

}
}
});
knoxx.backend.domain.session_mycology.make_execute_fn = (function knoxx$backend$domain$session_mycology$make_execute_fn(node_path,node_os){
var state_dir_fn = knoxx.backend.domain.session_mycology.make_state_dir_fn(node_os,node_path);
var reflections_file_fn = knoxx.backend.domain.session_mycology.make_reflections_file_fn(state_dir_fn,node_path);
var spores_file_fn = knoxx.backend.domain.session_mycology.make_spores_file_fn(state_dir_fn,node_path);
var promotions_file_fn = knoxx.backend.domain.session_mycology.make_promotions_file_fn(state_dir_fn,node_path);
var spore_drafts_dir_fn = knoxx.backend.domain.session_mycology.make_spore_drafts_dir_fn(state_dir_fn,node_path);
var append_jsonl_fn = knoxx.backend.domain.session_mycology.make_append_jsonl_fn(node_path);
var read_jsonl_fn = knoxx.backend.domain.session_mycology.make_read_jsonl_fn();
var load_recent_spores_fn = knoxx.backend.domain.session_mycology.make_load_recent_spores_fn(read_jsonl_fn,spores_file_fn,node_path);
var find_latest_spore_fn = knoxx.backend.domain.session_mycology.make_find_latest_spore_fn(read_jsonl_fn,spores_file_fn,node_path);
var promote_spore_to_skill_fn = knoxx.backend.domain.session_mycology.make_promote_spore_to_skill_fn(node_path,node_os,promotions_file_fn);
var write_spore_draft_fn = knoxx.backend.domain.session_mycology.make_write_spore_draft_fn(node_path,node_os,spore_drafts_dir_fn);
var execute_reflect = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.session_mycology.execute_reflect_action,node_path,append_jsonl_fn,reflections_file_fn,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([find_latest_spore_fn,spore_drafts_dir_fn,write_spore_draft_fn,spores_file_fn,promote_spore_to_skill_fn], 0));
return (function (_tcid,params,_sig,_on_update,ctx){
return knoxx.backend.domain.session_mycology.session_mycology_execute_BANG_(params,ctx,load_recent_spores_fn,execute_reflect);
});
});
knoxx.backend.domain.session_mycology.make_session_mycology_tool = (function knoxx$backend$domain$session_mycology$make_session_mycology_tool(execute_fn){
return cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"session_mycology","Session Mycology",(""+"Record a per-turn retrospective with p-scores and incubate reusable skill spores when work felt harder than it should have.\n"+"At the end of each substantive turn, silently run a tiny retrospective:\n"+"- p-efficiency = confidence the path was near-minimal.\n"+"- p-friction = confidence the work felt harder than it should have.\n"+"- p-skill-candidate = confidence a reusable skill or protocol would compress future effort.\n"+"If you have enough evidence, call session_mycology with action=\"reflect\" near the end of the turn.\n"+"If p-skill-candidate >= "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(0.72.toFixed((2)))+" and the pattern seems reusable beyond the immediate task, include candidateName and candidateDescription.\n"+"Skip the tool for tiny conversational turns or when evidence is too thin."),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Call session_mycology to record retrospection and incubate skill spores.",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Call session_mycology with action=\"reflect\" near the end of substantive turns.","Include candidateName and candidateDescription when p-skill-candidate is high and the pattern feels reusable.","Use action=\"list_recent\" when the user asks about prior spores or skill incubation status.","Keep the loop quiet; do not narrate the retrospective unless the user asks."], null),knoxx.backend.domain.session_mycology.session_mycology_params,execute_fn], 0));
});
knoxx.backend.domain.session_mycology.create_session_mycology_tools = (function knoxx$backend$domain$session_mycology$create_session_mycology_tools(var_args){
var G__27813 = arguments.length;
switch (G__27813) {
case 2:
return knoxx.backend.domain.session_mycology.create_session_mycology_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.session_mycology.create_session_mycology_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.session_mycology.create_session_mycology_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.session_mycology.create_session_mycology_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.session_mycology.create_session_mycology_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
var execute_fn = knoxx.backend.domain.session_mycology.make_execute_fn(shadow.esm.esm_import$node_path,shadow.esm.esm_import$node_os);
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("session_mycology"))?knoxx.backend.domain.session_mycology.make_session_mycology_tool(execute_fn)(runtime,config):null)], null))));
}));

(knoxx.backend.domain.session_mycology.create_session_mycology_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.session_mycology.js.map
