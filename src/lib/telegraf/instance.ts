import { Telegraf } from "telegraf";

const BOT_TOKEN = "7646768615:AAGoZIc6v6_lnNhSvgstkXiNlW0PkctKlRU";

// const bot = new Telegraf(BOT_TOKEN);

const globalWithBot = global as typeof global & { bot?: Telegraf };

if (!globalWithBot.bot) {
  console.log(`[bot initiated]`);
  globalWithBot.bot = new Telegraf(BOT_TOKEN);
}

export const bot = globalWithBot.bot;

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
