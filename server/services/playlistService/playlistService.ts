import { ObjectId } from "mongodb";
import { db } from "../../db";
import { Spotify } from "../spotify";

type PlaylistRecord = {
  spotifyId: string;
  tracks: {
    addedAt: string;
    name: string;
    id: string;
    urls: {
      spotify: string;
    };
  }[];
  syncedAt: string;
  createdAt: string;
};

const collection = db.collection<PlaylistRecord>("playlists");

export class PlaylistService {
  static async create(spotifyPlaylistId: string) {
    const foundedPlaylist = await collection.findOne({
      spotifyId: spotifyPlaylistId,
    });

    if (foundedPlaylist) {
      return foundedPlaylist._id;
    }

    const createdPlaylist = await collection.insertOne({
      spotifyId: spotifyPlaylistId,
      tracks: [],
      syncedAt: new Date().toISOString(), // we're only going to add tracks **after** the time of creation of playlist
      createdAt: new Date().toISOString(),
    });

    return createdPlaylist.insertedId;
  }

  static async update(
    id: string | ObjectId,
    updatedRecord: Partial<PlaylistRecord>
  ) {
    return await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: updatedRecord }
    );
  }

  static async sync(id: string | ObjectId) {
    const record = await PlaylistService.getById(id);

    if (!record) {
      throw new Error("NOT_FOUND");
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
      // syncedAt: new Date().toISOString(), //TODO: should be uncommented
      tracks: sortedTracks,
    });

    return newTracks;
  }

  static async delete(id: string) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return;
    throw new Error("not found");
  }

  static async getAll() {
    return collection.find().sort({ _id: -1 }).toArray();
  }

  static async getById(id: string | ObjectId) {
    return collection.findOne({ _id: new ObjectId(id) });
  }
}
