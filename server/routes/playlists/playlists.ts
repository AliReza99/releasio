import { FastifyInstance } from "fastify";
import { PlaylistService } from "../../services/playlistService";
import { Spotify } from "../../spotify";
import moment from "moment";

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

    const record = await PlaylistService.getById(id);

    if (!record) {
      reply.status(404).send({ message: "not found" });
      return;
    }

    const playlistItems = await Spotify.getAllPlaylistItems(record.spotifyId);

    const newTracks = playlistItems
      .map((item) => {
        if (!item.track) return null;

        return {
          addedAt: item.added_at,
          name: item.track.name,
          id: item.track.id,
          urls: {
            spotify: item.track.external_urls.spotify,
          },
        };
      })
      .filter(Boolean)
      .filter((item) => {
        return (
          new Date(item.addedAt).getTime() > new Date(record.syncedAt).getTime()
        );
      });

    const trackMap = new Map<string, (typeof newTracks)[0]>();

    [...record.tracks, ...newTracks].forEach((track) => {
      trackMap.set(track.id, track); // This ensures only the latest entry per ID is kept
    });

    const sortedTracks = Array.from(trackMap.values()).sort(
      (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
    );

    await PlaylistService.update(record._id, {
      syncedAt: new Date().toISOString(),
      tracks: sortedTracks,
    });

    reply.send({ message: `${newTracks.length} tracks updated` });
  });
}
