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
}
