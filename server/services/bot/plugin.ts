import { FastifyInstance } from "fastify";
import { Bot } from "./bot";

export default function telegramBotPlugin(fastify: FastifyInstance) {
  fastify.addHook("onReady", async () => {
    Bot.start();
    Bot.registerHandlers();
  });

  fastify.addHook("onClose", async () => {
    Bot.stop();
  });
}
