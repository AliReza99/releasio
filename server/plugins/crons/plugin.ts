import { FastifyInstance } from "fastify";
import { initializeCrons } from "./crons";

export function cronsPlugin(fastify: FastifyInstance) {
  fastify.addHook("onReady", async () => {
    console.log(`[crons started] `);
    initializeCrons();
  });

  fastify.addHook("onClose", async () => {});
}
