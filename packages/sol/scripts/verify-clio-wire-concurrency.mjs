import {spawn, spawnSync} from 'node:child_process';
import {mkdtemp, access, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const cwd = join(root, 'packages/clio');
const directory = await mkdtemp(join(tmpdir(), 'sol-wire-concurrency-'));
const workers = [];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const exists = async (path) => {try {await access(path); return true;} catch {return false;}};
const nbb = ['exec', 'nbb', '--classpath', '../sol/src/cljs:../sol/test/fixtures'];
try {
  const init = spawnSync('pnpm', [...nbb, '-e', `(require '[open-hax.sol.infra.agent.clio-store :as store]) (store/open-store ${JSON.stringify(directory)})`], {cwd, encoding: 'utf8', timeout: 30000});
  if (init.status !== 0) throw new Error(`Initialization failed: ${init.stderr}`);
  for (const episode of ['episode-a', 'episode-b']) {
    const child = spawn('pnpm', [...nbb, '-m', 'clio-wire-worker', directory, episode], {cwd});
    let output = ''; let stderr = ''; let failure;
    child.stdout.on('data', chunk => {output += chunk;});
    child.stderr.on('data', chunk => {stderr += chunk;});
    const done = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {child.kill("SIGKILL"); reject(new Error(`Worker ${episode} timed out`));}, 30000);
      child.once("exit", () => clearTimeout(timer));
      child.once('error', reject);
      child.once('exit', code => {
        if (code !== 0) return reject(new Error(`Worker ${episode} failed: ${stderr}`));
        try {resolve(JSON.parse(output.trim().split('\n').at(-1)));} catch (error) {reject(error);}
      });
    });
    // Attach a rejection handler immediately, even while the other worker starts.
    done.catch(error => {failure = error;});
    workers.push({child, done, error: () => failure});
  }
  const deadline = Date.now() + 30000;
  while (!(await exists(join(directory, 'ready-episode-a'))) || !(await exists(join(directory, 'ready-episode-b')))) {
    for (const worker of workers) if (worker.error()) throw worker.error();
    if (Date.now() > deadline) throw new Error('Workers did not reach the shared barrier');
    await sleep(10);
  }
  await writeFile(join(directory, 'go'), 'go');
  const results = await Promise.all(workers.map(worker => worker.done));
  const accepted = results.filter(result => result.status === 'accepted');
  const refused = results.filter(result => result.status === 'refused' && result.code === ':sol.clio/id-collision');
  if (accepted.length !== 1 || refused.length !== 1) throw new Error(`Wire identity admitted twice: ${JSON.stringify(results)}`);
  const replay = spawnSync('pnpm', [...nbb, '-e', `(require '[open-hax.sol.infra.agent.clio-store :as store]) (println (count (store/read-envelopes (store/open-store ${JSON.stringify(directory)}))))`], {cwd, encoding: 'utf8', timeout: 30000});
  if (replay.status !== 0 || replay.stdout.trim().split('\n').at(-1) !== '1') throw new Error(`Replay must contain exactly one envelope: ${replay.stdout} ${replay.stderr}`);
  console.log(JSON.stringify({ok: true, processCount: 2, accepted: accepted.length, refused: refused.length, replayed: 1}));
} finally {
  for (const {child} of workers) if (child.exitCode === null) child.kill('SIGKILL');
  await rm(directory, {recursive: true, force: true});
}
