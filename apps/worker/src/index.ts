import { BackgroundWorker } from './worker';

export const WORKER_NAME = 'The Capsule Async Media & Retention Worker';

if (require.main === module) {
  const worker = new BackgroundWorker();
  worker.start();
}
