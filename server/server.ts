import "./utils/envs";
import "./bot";
import "./spotify";
import Fastify from "fastify";
import { SubscriptionService } from "./services/subscriptionService";

const fastify = Fastify({ logger: true });

fastify.post("/subscriptions", async (req, reply) => {
  const { chatId, playlists } = req.body as {
    chatId: string;
    playlists: string[];
  };

  if (!chatId || !Array.isArray(playlists)) {
    reply.status(400).send({ message: "Invalid payload" });
    return;
  }

  const result = await SubscriptionService.create(chatId, playlists);

  reply.send({ message: "Subscription saved", result });
});

fastify.delete("/subscriptions/:id", async (req, reply) => {
  const { id } = req.params as { id: string };

  await SubscriptionService.delete(id);

  reply.send({ message: "Subscription deleted" });
});

fastify.get("/subscriptions", async (req, reply) => {
  const subscriptions = await SubscriptionService.getAll();
  reply.send(subscriptions);
});

fastify.get("/subscriptions/:id", async (req, reply) => {
  const { id } = req.params as { id: string };

  const subscription = await SubscriptionService.getById(id);

  if (!subscription) {
    reply.status(404).send({ message: "Subscription not found" });
    return;
  }

  reply.send(subscription);
});

fastify.listen({ port: 4000 }, (err, address) => {
  if (err) throw err;
  console.log(`🚀 Server running at ${address}`);
});
