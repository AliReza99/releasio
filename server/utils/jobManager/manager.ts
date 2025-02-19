import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("REDIS_HOST and REDIS_PORT must be set");
}

export class JobManager<TJobData extends Record<string, unknown>> {
  queue: Queue;
  worker: Worker;
  constructor({
    name,
    handler,
  }: {
    name: string;
    handler: (jobData: TJobData) => void;
  }) {
    this.queue = new Queue(name);
    this.worker = new Worker(
      name,
      async (job) => {
        handler(job.data);
      },
      {
        connection: new IORedis({ maxRetriesPerRequest: null }),
      }
    );
  }

  add(jobData: TJobData) {
    if (!this.queue) throw new Error("Queue is not initialized");

    this.queue.add(this.queue.name, jobData);
  }
}
