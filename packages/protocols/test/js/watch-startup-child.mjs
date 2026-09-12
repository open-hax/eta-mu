import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createEdnServices, makeEnvelope } from '../../dist/main.js';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'services-watch-startup-'));
const fifo = path.join(directory, 'native-worker-barrier');
const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
let handle;
try {
  const services = createEdnServices(directory);
  execFileSync('mkfifo', [fifo]);
  // With one worker, this real FIFO open holds later asynchronous stat calls.
  // Synchronous Clio reads and writes still use their real file descriptors.
  const blocker = new Promise((resolve, reject) => fs.open(fifo, 'r', (error, fd) => {
    if (error) reject(error);
    else {
      fs.closeSync(fd);
      resolve();
    }
  }));
  const received = [];
  handle = services['watch-events']({}, event => received.push(event['event/type']));
  await services['append-event!'](makeEnvelope('during.initial.stat', {}));
  const statBarrier = new Promise((resolve, reject) => {
    fs.stat(path.join(directory, 'services.edn'), error => error ? reject(error) : resolve());
  });
  // Opening the writer synchronizes with the blocked reader and releases it.
  fs.closeSync(fs.openSync(fifo, 'w'));
  await blocker;
  await statBarrier;
  const deadline = Date.now() + 3000;
  while (received.length === 0 && Date.now() < deadline) await pause(20);
  assert.deepEqual(received, ['during.initial.stat'], 'The first write must arrive without a second write');
  await pause(150);
  assert.deepEqual(received, ['during.initial.stat'], 'Repeated checks must not duplicate an event');
  handle.close();
  handle.close();
  await services['append-event!'](makeEnvelope('after.unsubscribe', {}));
  await pause(150);
  assert.deepEqual(received, ['during.initial.stat'], 'Unsubscribe must prevent subsequent delivery');
  console.log(JSON.stringify({ startup: received[0], delivered: received.length, closed: true }));
} finally {
  handle?.close();
  fs.rmSync(directory, { recursive: true, force: true });
}
