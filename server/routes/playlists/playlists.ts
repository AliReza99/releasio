import { FastifyInstance } from "fastify";
import { PlaylistService } from "../../services/playlistService";
import { Spotify } from "../../services/spotify";
import { to } from "await-to-js";

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

  fastify.post("/playlists/:id/sync", async (req, reply) => {
    const { id } = req.params as { id: string };

    const [err, newTracks] = await to(PlaylistService.sync(id));

    if (err?.message === "NOT_FOUND") {
      reply.status(404).send({ message: "not found" });
      return;
    }
    if (err) {
      reply.status(500).send({ message: err.message });
      return;
    }

    reply.send({ message: `${newTracks.length} tracks updated` });
  });
}
