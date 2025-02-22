import { Telegraf } from "telegraf";
import { Spotify } from "../spotify";
import { SubscriptionService } from "../subscriptionService";
import { PlaylistService } from "../playlistService";
import { JobManager } from "../../plugins/jobManager";

export const bot = new Telegraf(process.env.BOT_TOKEN!);

// Note: old messages will be start to sent automatically
export const telegramJobManager = new JobManager({
  name: "telegramJobManager",
  cleanStart: true,
  limiter: {
    duration: 10000,
    max: 1,
  },
  retry: 3,
  retryDelay: 1000,
  async handler({ chatId, message }: { chatId: number; message: string }) {
    await Bot.sendMessage(chatId, message);
  },
});

export class Bot {
  static start() {
    bot.launch();
    console.log("Telegram bot started");

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }

  static stop() {
    bot.stop();
  }

  static registerHandlers() {
    bot.on("channel_post", async (ctx) => {
      const post = ctx.channelPost;

      if (!("text" in post)) return;

      const match = post.text.match(/^\/playlist\s+(\S+)/);

      if (!match) return;

      const playlistUrl = match[1];
      const spotifyPlaylistId = Spotify.playlistUrlToId(playlistUrl);
      if (!spotifyPlaylistId) {
        await ctx.reply(`invalid spotify playlist url.`);
        return;
      }
      const playlistId = await PlaylistService.create(spotifyPlaylistId);
      await SubscriptionService.create(ctx.chat.id, [playlistId.toString()]);

      await ctx.reply(`Playlist updated.`);
      await ctx.deleteMessage();
    });
  }

  static async sendMessage(chatId: number, message: string) {
    console.log(`[sending message] `, chatId, message);
    await bot.telegram.sendMessage(chatId, message);
  }

  static scheduleSendMessage(chatId: number, message: string) {
    telegramJobManager.add({ chatId, message });
  }
}
