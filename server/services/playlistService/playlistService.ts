import { ObjectId } from "mongodb";
import { db } from "../../config/db";

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

  static async delete(id: string) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return;
    throw new Error("not found");
  }

  static async getAll() {
    return collection.find().sort({ _id: -1 }).toArray();
  }

  static async getById(id: string) {
    return collection.findOne({ _id: new ObjectId(id) });
  }
}
