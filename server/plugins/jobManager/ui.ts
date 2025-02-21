import { FastifyInstance } from "fastify";
import { FastifyAdapter } from "@bull-board/fastify";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { getServerAddress } from "../../utils/fastify";

const serverAdapter = new FastifyAdapter();

export function registerBullBoard(
  fastify: FastifyInstance,
  { queues }: { queues: Queue[] }
) {
  createBullBoard({
    queues: queues.map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });

  serverAdapter.setBasePath("/ui");

  fastify.register(serverAdapter.registerPlugin(), {
    prefix: "/ui",
    basePath: "/ui",
  });

  fastify.addHook("onListen", async () => {
    fastify.log.info(`jobs at ${getServerAddress(fastify)}/ui`);
  });
}
