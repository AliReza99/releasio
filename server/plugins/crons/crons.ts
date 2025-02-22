import { ObjectId } from "mongodb";
import { PlaylistService } from "../../services/playlistService";
import { JobManager } from "../jobManager";
import { SubscriptionService } from "../../services/subscriptionService";
import { Bot } from "../../services/bot";

export const cronsJobManager = new JobManager({
  name: "cronsJobManager",
  cleanStart: true,
  // repeatOnComplete: true,
  limiter: {
    duration: 10000,
    max: 1,
  },
  retry: 3,
  retryDelay: 1000,
  async handler(playlist: { spotifyId: string; _id: ObjectId }) {
    const { spotifyId, _id } = playlist;

    console.log(`[syncing playlist...] `, spotifyId);

    const newTracks = await PlaylistService.sync(_id);

    function reschedule() {
      cronsJobManager.add({
        spotifyId: playlist.spotifyId,
        _id: playlist._id,
      });
    }

    if (newTracks.length === 0) {
      reschedule();
      return;
    }

    const subscriptions = await SubscriptionService.getByPlaylistId(
      playlist._id
    );

    subscriptions.forEach((sub) => {
      const channelId = sub.chatId;
      newTracks.forEach((track) => {
        Bot.scheduleSendMessage(channelId, track.name);
      });
    });

    reschedule();
  },
});

export async function initializeCrons() {
  const playlists = await PlaylistService.getAll();
  playlists.forEach((playlist) => {
    cronsJobManager.add({
      spotifyId: playlist.spotifyId,
      _id: playlist._id,
    });
  });
}
