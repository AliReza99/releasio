import { FastifyPluginAsync } from "fastify";
import { JobManager } from "./plugins/jobManager";
import { cronsJobManager } from "./plugins/crons/crons";
import { telegramJobManager } from "./services/bot";

const app: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import("./plugins/swagger"));
  await fastify.register(import("./plugins/logger"));
  await fastify.register(import("./plugins/crons"));
  //
  await fastify.register(import("./services/bot/plugin"));
  // routes
  await fastify.register(import("./routes/subscriptions"));
  await fastify.register(import("./routes/playlists"));
  //
  await fastify.register(import("./plugins/jobManager"), {
    queues: [cronsJobManager.queue, telegramJobManager.queue],
  });
};

export default app;
