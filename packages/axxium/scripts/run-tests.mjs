import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('..', import.meta.url));
const guard = fileURLToPath(new URL('./shadow-test-error-guard.cjs', import.meta.url));
const environment = {
  ...process.env,
  NODE_OPTIONS: [process.env.NODE_OPTIONS, `--require ${JSON.stringify(guard)}`].filter(Boolean).join(' '),
};

function run(command, args, requireSummary = false) {
  const result = spawnSync(command, args, { cwd: directory, env: environment, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  if (result.error) process.stderr.write(`${result.error.message}\n`);
  if (result.error || result.signal || result.status !== 0 || output.includes('[shadow-test-guard] FATAL')) return false;
  return !requireSummary || (/Ran [1-9][0-9]* tests? containing [1-9][0-9]* assertions?\./.test(output)
    && /0 failures, 0 errors\./.test(output)
    && !/(?:[1-9][0-9]* failures|[1-9][0-9]* errors)/.test(output));
}

if (!run('pnpm', ['exec', 'shadow-cljs', 'compile', 'test'])
    || !run(process.execPath, ['target/test.cjs'], true)) process.exitCode = 1;
