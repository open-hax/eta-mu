import {rm} from 'node:fs/promises';

/** Stop owned workers before releasing their shared filesystem fixture. */
export async function finishWorkers(workers, directory) {
  for (const {child} of workers) if (child.exitCode === null) child.kill('SIGKILL');
  await Promise.allSettled(workers.map(worker => worker.closed));
  await rm(directory, {recursive: true, force: true});
}
