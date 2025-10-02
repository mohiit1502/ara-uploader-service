import logger from '../utils/logger';

// Async/queue worker for image validation and processing

// Example job queue (in-memory, for demo)
const jobQueue: Array<() => Promise<void>> = [];
let processing = false;

export function addImageJob(job: () => Promise<void>) {
  jobQueue.push(job);
  processQueue();
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (jobQueue.length > 0) {
    const job = jobQueue.shift();
    if (job) {
      try {
        await job();
      } catch (err) {
        logger.error('[imageProcessor] Error processing job', err);
      }
    }
  }
  processing = false;
}

// Example usage: addImageJob(async () => { ...process image... });

export { };
