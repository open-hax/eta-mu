from pathlib import Path
import subprocess,sys,json,hashlib,datetime
artifact=Path(__file__).resolve().parent
root=Path.cwd()
label=sys.argv[1]
cmd=sys.argv[2:]
paths=['scripts/test.bb', 'packages/eta-mu/src/cljs/eta_mu/law/review_collection.cljc', 'packages/eta-mu/src/cljs/eta_mu/domain/review_publication.cljc', 'packages/eta-mu/src/cljs/eta_mu/infra/review_collection.cljs', '.github/scripts/opencode_review_readback_test.cljs', 'packages/eta-mu/src/cljs/eta_mu/law/review_readback.cljc', 'packages/eta-mu/src/cljs/eta_mu/shape/review_readback.cljc', 'packages/eta-mu/src/cljs/eta_mu/domain/review_readback.cljc', 'packages/eta-mu/src/cljs/eta_mu/infra/review_readback.cljs']
meta={"command":cmd,"started_at":datetime.datetime.now(datetime.timezone.utc).isoformat(),"head":subprocess.check_output(["git","rev-parse","HEAD"],text=True).strip(),"hashes":{p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in paths if (root/p).is_file()}}
(artifact/(label+".start.json")).write_text(json.dumps(meta,indent=2)+"\n")
with (artifact/(label+".stdout.txt")).open("wb") as out,(artifact/(label+".stderr.txt")).open("wb") as err:
 result=subprocess.run(cmd,stdout=out,stderr=err)
meta.update(exit_code=result.returncode,finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
(artifact/(label+".result.json")).write_text(json.dumps(meta,indent=2)+"\n")
print(json.dumps({"label":label,"exit_code":result.returncode,"artifact":str(artifact)}))
sys.exit(result.returncode)
