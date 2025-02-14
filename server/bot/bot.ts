import { Telegraf, Context } from "telegraf";
import { config } from "dotenv";
import { to } from "await-to-js";
import { db } from "../mongodb";
config();

export const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.on("channel_post", async (ctx) => {
  const post = ctx.channelPost;

  // Ensure the message contains text
  if (!("text" in post)) return;

  const text = post.text;
  const match = text?.match(/^\/playlist\s+(\S+)/);

  if (match) {
    const playlistId = match[1];

    try {
      // Delete the original message
      await ctx.deleteMessage();

      // Send a response
      await ctx.reply(`Playlist updated`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// const [tokenError, tokenDoc] = await to(
//   db.collection("subscriptions").deleteOne({
//     chat_id: 1,
//     // playlist_id: "37i9dQZF1DXcBWIGoYBM5M",
//     // subscribed_at: ISODate("2025-02-14T12:00:00Z"),
//   })
// );

// console.log(`[tokenDoc] `, tokenDoc);


