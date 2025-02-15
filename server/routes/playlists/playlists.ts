import { FastifyInstance } from "fastify";
import { PlaylistService } from "../../services/playlistService";

export function playlistRoutes(fastify: FastifyInstance) {
  fastify.get("/playlists", async (req, reply) => {
    const records = await PlaylistService.getAll();
    reply.send(records);
  });

  fastify.get("/playlists/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const record = await PlaylistService.getById(id);

    if (!record) {
      reply.status(404).send({ message: "not found" });
      return;
    }

    reply.send(record);
  });

  fastify.delete("/playlists/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    await PlaylistService.delete(id);

    reply.send({ message: "deleted" });
  });
}
