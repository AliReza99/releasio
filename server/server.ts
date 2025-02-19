import Fastify from "fastify";

export const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:mm:ss",
        ignore: "pid,hostname,reqId",
      },
    },
  },
  disableRequestLogging: true,
});
