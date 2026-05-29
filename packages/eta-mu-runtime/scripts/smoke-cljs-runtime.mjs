const mod = await import("../dist-cljs/index.js");

const expected = [
  "createEtaBelief",
  "createBreathEpisode",
  "createEtaMuState",
  "selectPanelsFromContext",
  "rankCheapMuCandidates",
  "recommendBreath",
  "createActionBatch",
];

for (const key of expected) {
  if (typeof mod[key] !== "function") {
    throw new Error(`missing CLJS ESM export: ${key}`);
  }
}

const belief = mod.createEtaBelief({ urgency: 2, ambiguity: -1 });
if (belief.urgency !== 1 || belief.ambiguity !== 0) {
  throw new Error(`createEtaBelief smoke failed: ${JSON.stringify(belief)}`);
}

const batch = mod.createActionBatch({
  repo: "open-hax/proxx",
  trigger: "scheduler.tick",
  target: "open-hax/proxx",
  summary: "cheap reconcile loop found no action",
  belief: mod.createEtaBelief(),
});

if (batch.kind !== "eta-mu-action-batch.v1") {
  throw new Error(`createActionBatch smoke failed: ${JSON.stringify(batch)}`);
}

console.log(JSON.stringify({ ok: true, exports: expected, batchKind: batch.kind }));
