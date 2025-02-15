import { Telegraf, Context } from "telegraf";

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

      if (match) {
        const playlistId = match[1];
        await Bot.handlePlaylistCommand(ctx, playlistId);
      }
    });
  }

  static async handlePlaylistCommand(ctx: Context, playlistId: string) {
    try {
      await ctx.deleteMessage();
      await ctx.reply(`Playlist updated: ${playlistId}`);
    } catch (error) {
      console.error("Error handling playlist command:", error);
    }
  }
}

Bot.start();
Bot.registerHandlers();
