import IORedis from "ioredis";
import { JobsOptions, Queue, Worker, WorkerOptions } from "bullmq";

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("REDIS_HOST and REDIS_PORT must be set");
}

export class JobManager<TJobData extends Record<string, unknown>> {
  queue: Queue;
  worker: Worker;
  name: string;
  retry?: number;
  retryDelay?: number;
  constructor({
    name,
    handler,
    limiter,
    cleanStart = false,
    repeatOnComplete = false,
    onFailed,
    retry,
    retryDelay,
  }: {
    name: string;
    handler: (jobData: TJobData) => void | Promise<void>;
    limiter?: WorkerOptions["limiter"];
    cleanStart?: boolean;
    repeatOnComplete?: boolean;
    onFailed?: (jobData: TJobData, err: Error) => void | Promise<void>;
    retry?: number;
    retryDelay?: number;
  }) {
    this.queue = new Queue(name);
    this.name = name;
    this.retry = retry;
    this.retryDelay = retryDelay;
    this.worker = new Worker<TJobData>(
      name,
      async (job) => {
        await handler(job.data);
      },
      {
        connection: new IORedis({ maxRetriesPerRequest: null }),
        limiter: limiter,
      }
    );

    if (cleanStart) {
      this.deleteAll();
    }

    if (repeatOnComplete) {
      this.worker.on("completed", async (job) => {
        this.add(job.data); // Re-add to queue only after completion
      });
    }

    if (onFailed) {
      this.worker.on("failed", async (job, err) => {
        if (!job) return;
        onFailed(job.data, err);
      });
    }
  }

  add(jobData: TJobData, jobsOption?: JobsOptions) {
    this.queue.add(this.name, jobData, {
      ...(this.retry
        ? {
            attempts: this.retry,
            backoff: { type: "fixed", delay: this.retryDelay },
          }
        : {}),
      ...jobsOption,
    });
  }

  async deleteAll() {
    // await this.queue.drain(); // Clears waiting jobs
    await this.queue.obliterate({ force: true });
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
