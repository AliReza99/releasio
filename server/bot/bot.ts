import { Telegraf, Context } from "telegraf";
import { Spotify } from "../spotify";
import { SubscriptionService } from "../services/subscriptionService";
import { PlaylistService } from "../services/playlistService";

export const bot = new Telegraf(process.env.BOT_TOKEN!);
export class Bot {
  static start() {
    bot.launch();
    console.log("Telegram bot started");

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }

  static registerHandlers() {
    bot.on("channel_post", async (ctx) => {
      const post = ctx.channelPost;

      if (!("text" in post)) return;

      const match = post.text.match(/^\/playlist\s+(\S+)/);

      if (!match) return;

      const playlistUrl = match[1];
      const spotifyPlaylistId = Spotify.playlistUrlToId(playlistUrl);
      if (!spotifyPlaylistId) return;
      const playlistId = await PlaylistService.create(spotifyPlaylistId);
      await SubscriptionService.create(ctx.chat.id, [playlistId.toString()]);

      await ctx.reply(`Playlist updated.`);
      await ctx.deleteMessage();
    });
  }
}
