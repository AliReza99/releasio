import { bot } from "./instance";

const logs: unknown[] = [];
function initiateBot() {
  bot.command("playlist", (ctx) => {
    const args = ctx.message.text.split(" ").slice(1); // Extract arguments
    const playlistId = args[0];

    logs.push(ctx);

    if (!playlistId) {
      ctx.reply("Please provide a playlist ID. Example: /playlist 123");
      return;
    }

    ctx.reply(`You requested playlist with ID: ${playlistId}`);
  });

  bot.launch();
}

initiateBot();

export function getLogs() {
  return logs;
}
