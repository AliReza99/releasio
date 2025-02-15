import "./utils/envs";
import Fastify from "fastify";
import {
  onRequestLogger,
  onResponseLogger,
} from "./middlewares/loggerMiddleware";
import { setupSwagger } from "./config/swagger";
import { subscriptionRoutes } from "./routes/subscriptions";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:mm:ss",
        ignore: "pid,hostname,reqId",
      },
    },
  },
  disableRequestLogging: true,
});

fastify.addHook("onRequest", onRequestLogger);
fastify.addHook("onResponse", onResponseLogger);

await setupSwagger(fastify);

fastify.listen({ port: Number(process.env.PORT || 3000) });

fastify.register(subscriptionRoutes);
