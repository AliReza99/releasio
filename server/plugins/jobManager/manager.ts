import IORedis from "ioredis";
import { JobsOptions, Queue, Worker } from "bullmq";

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("REDIS_HOST and REDIS_PORT must be set");
}

export class JobManager<TJobData extends Record<string, unknown>> {
  queue: Queue;
  worker: Worker;
  name: string;
  constructor({
    name,
    handler,
  }: {
    name: string;
    handler: (jobData: TJobData) => void;
  }) {
    this.queue = new Queue(name);
    this.name = name;
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

  add(jobData: TJobData, jobsOption?: JobsOptions) {
    this.queue.add(this.name, jobData, jobsOption);
  }

  /**
   * @deprecated this method is deprecated
   */
  async removeRepeatable() {
    const repeatableJobs = await this.queue.getRepeatableJobs();

    for (const repeatableJob of repeatableJobs) {
      await this.queue.removeRepeatableByKey(repeatableJob.key);
    }
  }
}
