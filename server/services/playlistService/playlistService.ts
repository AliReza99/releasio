import { ObjectId } from "mongodb";
import { db } from "../../config/db";

const collection = db.collection("playlists");

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
    });

    return createdPlaylist.insertedId;
  }

  static async delete(id: string) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return;
    throw new Error("not found");
  }

  static async getAll() {
    return collection.find().toArray();
  }

  static async getById(id: string) {
    return collection.findOne({ _id: new ObjectId(id) });
  }
}
