import "dotenv/config";
import Fastify from "fastify";

async function main() {
  const fastify = Fastify({
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

  const port = Number(process.env.PORT || 3000);
  const appUrl = process.env.APP_URL || `http://localhost:${port}`;

  await fastify.register(import("./app"), {
    url: appUrl,
  });

  await fastify.listen({ port: port });
}

main();
