import pathlib,json,hashlib,gzip,subprocess,re
R=pathlib.Path.cwd();D=R/'.ημ/review-evidence/trusted-publication-readback';base='cd9751d01a2b93123281d032f42a83fb4b9d42cb';source='6e1f088fcd81dba5e9edaf526e453962875215c6'
def sha(b):return hashlib.sha256(b).hexdigest()
def save(p,v):p.write_text(json.dumps(v,indent=2,ensure_ascii=False)+'\n')
def git(*a):return subprocess.check_output(['git',*a])
assert not(D/'checkpoint.json').exists()
i=json.loads((D/'receipt-input.json').read_text());assert i['source']==source;digest=i['archive_sha256'];archive=D/(digest+'.json.gz');assert sha(archive.read_bytes())==digest;raw=gzip.decompress(archive.read_bytes());files=json.loads(raw)['files']
receipt=(R/'receipts.edn').read_bytes().splitlines()[-1];assert source.encode()in receipt and digest.encode()in receipt;receiptsha=sha(receipt)
assert ':rows 359, :invalid 71, :errors 118, :prospective-valid true' in json.loads((D/'append-receipt.json').read_text())['stdout']
assert receiptsha in (R/'.ημ/session-mycology/ledger.md').read_text()
prefix={p:git('show',base+':'+p)for p in ['receipts.edn','kanban/.events/ledger.edn','.ημ/session-mycology/ledger.md','.ημ/session-reflections.edn']}
proof={p:{'base_bytes':len(b),'base_sha256':sha(b),'current_bytes':len((R/p).read_bytes()),'prefix_preserved':(R/p).read_bytes().startswith(b)}for p,b in prefix.items()};assert all(x['prefix_preserved']for x in proof.values())
card='kanban/tasks/independently-admit-and-publish-review-evidence-from-trusted-default-code-1c707551.md';old=git('show',base+':'+card).decode();new=(R/card).read_text();norm=lambda text:re.sub(r'^write-id:.*\n','',text,flags=re.M);assert norm(new).startswith(norm(old).removesuffix('---')) and new.endswith('---')
paths=[p for p in git('ls-tree','-r','--name-only',base,'kanban').decode().splitlines()if p.endswith('.md')];assert len(paths)==309
for p in paths:
 if p!=card:assert (R/p).read_bytes()==git('show',base+':'+p),p
encoded=[]
for entry in files:
 p=D/entry['path']
 if not p.exists():
  replacement=p.with_name(p.name+'.json');v=json.loads(replacement.read_text());assert v['original_path']==entry['path'] and sha(v['text'].encode())==entry['sha256'];encoded.append({'original':entry['path'],'lossless_json':str(replacement.relative_to(D)),'sha256':entry['sha256']})
 else:assert sha(p.read_bytes())==entry['sha256'],entry['path']
checkpoint={'schema_version':1,'source':source,'previous_published_head':base,'red':'28de0da1197d23fc839061aef76936975048f4ca','initial_green':'6fa625cd66658d850241d0d3f762ef5eb6ba8746','independent_finding_red':'141c11e3bb285c427b2d51c7ea746d09072998cd','green':source,'archive':str(archive.relative_to(R)),'archive_sha256':digest,'archive_raw_sha256':sha(raw),'captures':len(files),'lossless_representations':encoded,'focused':'readback10/130;collection30/224;publication17/557+138parity;eightnewportablevalues','full_checks':'CLI194/587+workflows11/199;owninglint/release0warnings; testcleanupdiagnostic retained','native_probe':'actualpublicGETreview/commentspage1/statuspage1 plusproductionabsentregistryrefusal; notcompletetraversal/installation/authentication','independent_review':'6fa inlineAppconflict reproduced; causal repair and successor8controls; original_commit_id existinglaw limit retained','prefixes':proof,'cards_preserved':309,'publisher':'in_progress/Codex/5points','qualification':False,'CMS_Cephalon':'paused','limits':['KnownreviewID required;unknownPOSTdiscoveryunfinished','OriginalG/caller/inputcustody and complete authenticated publication/composition/adoption unfinished','NativeAppmetadata doesnotproveinstallationassociation','TwoAPIstablepasses/terminalpages donotindependentlyproveprovideromissionabsence','EarlierCD975Sandboxproof sourcebound, notsuccessorqualification']}
save(D/'checkpoint.json',checkpoint)
attempt=(json.dumps({'checkpoint_sha256':sha((D/'checkpoint.json').read_bytes()),'receipt_sha256':receiptsha,'prefixes':proof,'qualified':False},indent=2)+'\n').encode();(D/(sha(attempt)+'.json')).write_bytes(attempt)
save(D/'checkpoint-resume.json',{'original_execution':'persist-readback.py reached final card-prefix assertion after archive, native card comment, validated receipt and mycology append. It incorrectly required trailing newline after closing card marker.','observed_state':'Rheos card closes with --- and no newline, old body/frontmatter otherwise preserved modulo write-id and additive comments.','resume':'Read-only validation and checkpoint write only. No receipt/card/mycology append repeated.','cards_preserved':309,'prefixes':proof,'archive_original_entries_verified':len(files),'receipt_sha256':receiptsha})
with(D/'README.md').open('a')as out:out.write('Initial persist-readback.py reached the final card-prefix check after side effects, then refused its incorrect newline assumption. resume-checkpoint.py verified actual closing-marker shape and all original archive entries, wrote only checkpoint metadata and repeated no append. Do not rerun either append script.\n')
print(json.dumps({'source':source,'archive':digest,'captures':len(files),'encoded':encoded,'cards':309,'receipt_rows':359,'historical_invalid':71,'historical_errors':118},indent=2))
