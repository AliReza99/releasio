import { FastifyPluginAsync } from "fastify";
import { JobManager } from "./plugins/jobManager";

const telegramJobManager = new JobManager({
  name: "telegramJobs",
  handler: async ({ to, message }: { to: string; message: string }) => {
    console.log(`[sending message to] `, to, message);
  },
});

const app: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import("./plugins/swagger"));
  await fastify.register(import("./plugins/logger"));
  await fastify.register(import("./services/bot/plugin"));
  // routes
  await fastify.register(import("./routes/subscriptions"));
  await fastify.register(import("./routes/playlists"));
  //
  await fastify.register(import("./plugins/jobManager"), {
    queues: [telegramJobManager.queue!],
  });
};

export default app;
