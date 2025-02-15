import { FastifyInstance } from "fastify";
import { SubscriptionService } from "../../services/subscriptionService";

export function subscriptionRoutes(fastify: FastifyInstance) {
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
}
