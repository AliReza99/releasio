import { FastifyPluginAsync } from "fastify";
import { JobManager } from "./plugins/jobManager";
// import { Bot } from "./bot";

// Bot.start();
// Bot.registerHandlers();

const telegramJobManager = new JobManager({
  name: "telegramJobs",
  handler: async ({ to, message }: { to: string; message: string }) => {
    console.log(`[sending message to] `, to, message);
  },
});

const app: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import("./plugins/swagger"));
  await fastify.register(import("./plugins/logger"));
  // routes
  await fastify.register(import("./routes/subscriptions"));
  await fastify.register(import("./routes/playlists"));
  //
  await fastify.register(import("./plugins/jobManager"), {
    queues: [telegramJobManager.queue!],
  });
};

export default app;
