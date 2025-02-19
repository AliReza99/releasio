import "./utils/envs";
import Fastify from "fastify";
import {
  onRequestLogger,
  onResponseLogger,
} from "./middlewares/loggerMiddleware";
import { setupSwagger } from "./config/swagger";
import { subscriptionRoutes } from "./routes/subscriptions";
import { Bot } from "./bot";
import { playlistRoutes } from "./routes/playlists";
import { registerBullBoard } from "./utils/jobManager/ui";
import { JobManager } from "./utils/jobManager";
import { fastify } from "./server";

Bot.start();
Bot.registerHandlers();

await setupSwagger(fastify);

fastify.addHook("onRequest", onRequestLogger);
fastify.addHook("onResponse", onResponseLogger);

fastify.listen({ port: Number(process.env.PORT || 3000) });

fastify.register(subscriptionRoutes);
fastify.register(playlistRoutes);

const telegramJobManager = new JobManager({
  name: "telegramJobs",
  handler: async ({ to, message }: { to: string; message: string }) => {
    console.log(`[sending message to] `, to, message);
  },
});

registerBullBoard(fastify, [telegramJobManager.queue!]);

// telegramJobManager.add({
//   to: "9815",
//   message: "Hello there",
// });
