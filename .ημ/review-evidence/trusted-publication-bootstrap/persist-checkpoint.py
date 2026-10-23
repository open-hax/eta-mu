import pathlib,subprocess,json,hashlib,gzip,datetime,socket,re,base64
R=pathlib.Path('/home/err/.local/share/foresight-worktrees/eta-publisher-intent-20261022');D=R/'.ημ/review-evidence/trusted-publication-bootstrap';base='fa117fba0b761f8aa655e26c2ae8675b1af178cd';source='1b76c9e1e6d6122a844ef418b0b4439ac8ee9495'
def sha(b):return hashlib.sha256(b).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def git(*args):return subprocess.check_output(['git',*args],cwd=R)
def run(label,args):
 r=subprocess.run(args,cwd=R,capture_output=True,text=True);(D/(label+'.stdout')).write_text(r.stdout);(D/(label+'.stderr')).write_text(r.stderr);save(D/(label+'.result.json'),{'argv':args,'exit_code':r.returncode});assert r.returncode==0,(label,r.stderr);return r
assert git('rev-parse','HEAD').decode().strip()==source
prefixpaths=['receipts.edn','kanban/.events/ledger.edn','.ημ/session-mycology/ledger.md','.ημ/session-reflections.edn']
prefix={p:git('show',base+':'+p) for p in prefixpaths}
for p,b in prefix.items():assert (R/p).read_bytes()==b,p
card='kanban/tasks/independently-admit-and-publish-review-evidence-from-trusted-default-code-1c707551.md'
cards=[p for p in git('ls-tree','-r','--name-only',base,'kanban').decode().splitlines() if p.endswith('.md')];assert len(cards)==309
for p in cards:assert (R/p).read_bytes()==git('show',base+':'+p),p
# Freeze exact original artifacts before any lossless serialization needed for diff hygiene.
paths=[p for root in [D,R/'.ημ/review-evidence/trusted-publication-intent-errors'] for p in root.rglob('*') if p.is_file()]
files=[]
for p in sorted(paths):
 b=p.read_bytes();f={'path':str(p.relative_to(R)),'bytes':len(b),'sha256':sha(b)}
 try:f['text']=b.decode()
 except UnicodeDecodeError:f['base64']=base64.b64encode(b).decode()
 files.append(f)
raw=(json.dumps({'schema_version':1,'kind':'bootstrap-and-native-finding-causal-captures','source':source,'files':files,'qualification':False},ensure_ascii=False,indent=2)+'\n').encode();packed=gzip.compress(raw,mtime=0);digest=sha(packed);archive=D/(digest+'.json.gz');archive.write_bytes(packed)
for f in files:
 b=f['text'].encode() if 'text'in f else base64.b64decode(f['base64']);assert sha(b)==f['sha256']
transforms=[]
for p in paths:
 b=p.read_bytes()
 if any(re.search(rb'[ \t]+$',l) for l in b.splitlines()):
  q=p.with_suffix(p.suffix+'.json');save(q,{'kind':'byte-preserving-captured-output','original_path':str(p.relative_to(R)),'bytes':len(b),'sha256':sha(b),'text':b.decode(),'archive':str(archive.relative_to(R))});assert json.loads(q.read_text())['text'].encode()==b;transforms.append({'original':str(p.relative_to(R)),'lossless_json':str(q.relative_to(R))});p.unlink()
note='Executed bootstrap and native finding repairs at source '+source+'. Package-wide NBB config moved into dedicated intent-runtime entrypoints; cold ordinary workflows run without bb on configured NBB 1.5.211 and fixed 1.5.212. RED b0ac577cfd3c899d4baac553c870d47918933850 precedes GREEN 14cb2742bfd1a15d5ab450b8f3ee6d3a64147790. Native classifier P1 RED 328a22c99caa2a1ed56fbbf5a7bef7c9567bc609 reproduces 24 failures before GREEN '+source+'. Unknown append errors retain append-outcome and exact recovery; typed admission refusals remain. Exact parsed collection trace detects a fourth real GET that the prior substring oracle missed. Intent25/143, collection30/224, review-workflow339, CLI194/587 plus workflows11/199, zero-warning lint/release pass. Ambient-provider failure retained; removing four named provider variables makes the no-provider fixture valid. Independent actual public probes pass private one-use capability, opaque recovery/second-use refusal, no recovery authority and fresh-clock failure. Captures archived with exact hashes. Publisher remains in_progress/Codex/5points; 309 states/planning and four ledger prefixes preserved. Original G/caller, full authenticated publication/composition, native publication/readback/status and protected adoption remain unfinished. No old Sandbox credit, credentials/gates/pins/merge/deployment or paused CMS/Cephalon advance.'
run('publisher-before',['node','packages/rheos/dist/cli.cjs','read-task','ed4e2a2a-6055-4d53-9cea-f3971c707551'])
run('publisher-comment',['node','packages/rheos/dist/cli.cjs','comment','ed4e2a2a-6055-4d53-9cea-f3971c707551','--text',note])
run('publisher-after',['node','packages/rheos/dist/cli.cjs','read-task','ed4e2a2a-6055-4d53-9cea-f3971c707551'])
a=json.loads((D/'publisher-before.stdout').read_text());b=json.loads((D/'publisher-after.stdout').read_text());assert {k:v for k,v in a['frontmatter'].items()if k!='write-id'}=={k:v for k,v in b['frontmatter'].items()if k!='write-id'}
now=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z');payload={'ts':now,'kind':'catalog','repo':'open-hax/eta-mu','origin':'stabilization/trusted-publication-bootstrap/execution','owner':'codex','dod':'Persist strict intent boundary, cold bootstrap and native classifier/trace causal repairs','pi':'eta-mu','host':socket.gethostname(),'manifest':str(archive.relative_to(R))+'; existing publisher card; causal tests/source and execution checkpoint','refs':'open-hax/eta-mu#362; source '+source,'note':note,'tests':'Intent25/143; collection30/224; review-workflow339; CLI194/587 and workflows11/199; owning/scoped lint0warnings; release0warnings; independent real public adapter probe passes. Initial ambient-provider failure retained.','decisions':'Preserve all309states/planning, four historical prefixes, root pins and paused CMS/Cephalon. Publisher in_progress. No protected adoption/native qualification or credential waiver.','drift':'Whole ledger retains71invalid rows/118errors; validate prospective event only. Earlier unarchived temporary captures lost; retained 809archive and fresh runs remain authoritative.'}
save(D/'receipt-input.json',{'payload':payload,'source':source,'archive_sha256':digest})
clj='''(require '[eta-mu.receipt-river.api :as api]
         '[eta-mu.receipt-river.extern.fs :as fs]
         '[cljs.reader :as reader]
         '[clojure.string :as str]
         '["node:fs" :as node-fs])
(let [input (js->clj (js/JSON.parse (node-fs/readFileSync ".ημ/review-evidence/trusted-publication-bootstrap/receipt-input.json" "utf8")) :keywordize-keys true)
      payload (update (:payload input) :kind keyword)
      event (api/build-event {:event-id (random-uuid) :recorded-at (:ts payload)
                              :component-manifest {:eta-mu/version "1.1.1"}
                              :command "source-owned receipt API / cold-bootstrap and native finding execution"
                              :producer {:actor/id "codex" :source/commit (:source input)}
                              :subject {:repository/id "github.com/open-hax/eta-mu" :source/commit (:source input)}
                              :refs [(str "sha256:" (:archive_sha256 input))]} payload)
      line (pr-str event)
      lines (remove str/blank? (str/split-lines (node-fs/readFileSync "receipts.edn" "utf8")))
      valid (api/validate-line line (inc (count lines)))]
  (assert (:ok valid) (pr-str valid))
  (fs/append-text! "receipts.edn" (str line "\\n"))
  (let [rows (map-indexed #(api/validate-line %2 (inc %1)) (conj (vec lines) line))]
    (println (pr-str {:rows (count rows) :invalid (count (remove :ok rows)) :errors (reduce + (map #(count (:errors %)) rows)) :prospective-valid (:ok valid)}))))
'''
(D/'append-receipt.cljs').write_text(clj);run('append-receipt',['nbb','-cp','packages/receipt-river/src/cljs',str(D/'append-receipt.cljs')])
new=(R/'receipts.edn').read_bytes();assert new.startswith(prefix['receipts.edn']);suffix=new[len(prefix['receipts.edn']):];assert len(suffix.splitlines())==1;ref=sha(suffix)
with (R/'.ημ/session-mycology/ledger.md').open('a')as f:f.write('\n- ts: '+now+'\n  session: codex/stabilization-portfolio\n  task: Repair cold NBB bootstrap and preserve unknown append uncertainty\n  p-efficiency: 0.8\n  p-friction: 0.65\n  p-skill-candidate: 0.5\n  spore: none\n  receipt-refs: '+ref+'\n  note: Scope dependency bootstrapping to its worker, reproduce cold behavior with actual ordinary workflow tests, and parse exact call traces. Preserve causal source failures, lint discovery and ambient provider failure. Fresh public opaque recovery and one-use probes replace lost temporary captures without inventing source custody. No new spore or promotion.\n')
# No reflection event is fabricated; its existing prefix remains exactly unchanged.
for p in cards:
 if p!=card:assert (R/p).read_bytes()==git('show',base+':'+p),p
 else:
  def stablefront(b):return re.sub(rb'(?m)^write-id:.*\n',b'',b.split(b'---',2)[1])
  assert stablefront((R/p).read_bytes())==stablefront(git('show',base+':'+p))
proof={p:{'base_bytes':len(b),'base_sha256':sha(b),'current_bytes':len((R/p).read_bytes()),'prefix_preserved':(R/p).read_bytes().startswith(b)} for p,b in prefix.items()};assert all(x['prefix_preserved']for x in proof.values())
execution={'schema_version':1,'source':source,'previous_published_head':base,'bootstrap_red':'b0ac577cfd3c899d4baac553c870d47918933850','bootstrap_green':'14cb2742bfd1a15d5ab450b8f3ee6d3a64147790','finding_red':'328a22c99caa2a1ed56fbbf5a7bef7c9567bc609','finding_green':source,'archive':str(archive.relative_to(R)),'archive_sha256':digest,'archive_raw_sha256':sha(raw),'captures':len(files),'lossless_output_representations':transforms,'gates':{'intent':'25 tests /143 assertions','collection':'30/224','review_workflow':'339 Node tests','cold_workflow':'11/199, absent bb, configured1.5.211 and fixed1.5.212','CLI':'194/587 + workflows11/199; provider-free rerun','lint_release':'zero errors/warnings; one preexisting info','independent_public_probe':'one-use authority, alternate factory refusal, real visible uncertainty opaque recovery, second-use refusal, fresh-clock failure'},'retained_failures':['original cold bb-not-found','24 classifier causal failures','extra fourth GET old oracle passes/new exact oracle fails','first lint cache/entry-name failure','ambient provider no-provider fixture failure'],'prefixes':proof,'cards_preserved':309,'publisher':'in_progress/Codex/5points','qualification':False,'limits':['No original event G/executed caller custody','No complete authenticated publication/reconstruction composition','No native publication/readback/status or protected adoption','No accepted pin or credential/grant/protection/workflow/caller changes','Prior Sandbox and carrier warnings remain source-bound; successor hosted proof pending','CMS/Cephalon paused']}
save(D/'checkpoint.json',execution);print('PASS',len(files),'archived captures;309 card states/planning;four prefixes;prospective typed receipt')
