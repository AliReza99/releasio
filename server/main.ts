import "./utils/envs";
import Fastify from "fastify";
import {
  onRequestLogger,
  onResponseLogger,
} from "./middlewares/loggerMiddleware";
// import { SubscriptionService } from "./services/subscriptionService";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:mm:ss",
        ignore: "pid,hostname,reqId",
        // localTime: true,
        // Optional customization
        messageFormat: "{msg} {req.url}",
      },
    },
  },
  disableRequestLogging: true,
});

fastify.addHook("onRequest", onRequestLogger);
fastify.addHook("onResponse", onResponseLogger);

fastify.listen({ port: Number(process.env.PORT || 3000) });

// fastify.post("/subscriptions", async (req, reply) => {
//   const { chatId, playlists } = req.body as {
//     chatId: string;
//     playlists: string[];
//   };

//   if (!chatId || !Array.isArray(playlists)) {
//     reply.status(400).send({ message: "Invalid payload" });
//     return;
//   }

//   const result = await SubscriptionService.create(chatId, playlists);

//   reply.send({ message: "Subscription saved", result });
// });

// fastify.delete("/subscriptions/:id", async (req, reply) => {
//   const { id } = req.params as { id: string };

//   await SubscriptionService.delete(id);

//   reply.send({ message: "Subscription deleted" });
// });

// fastify.get("/subscriptions", async (req, reply) => {
//   const subscriptions = await SubscriptionService.getAll();
//   reply.send(subscriptions);
// });

// fastify.get("/subscriptions/:id", async (req, reply) => {
//   const { id } = req.params as { id: string };

//   const subscription = await SubscriptionService.getById(id);

//   if (!subscription) {
//     reply.status(404).send({ message: "Subscription not found" });
//     return;
//   }

//   reply.send(subscription);
// });
