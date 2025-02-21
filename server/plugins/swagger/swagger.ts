import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { getServerAddress } from "../../utils/fastify";

async function setupSwagger(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: "Fastify API",
        description: "",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    logLevel: "warn", // Suppress unnecessary logs
  });

  // show docs url
  fastify.addHook("onListen", async () => {
    fastify.log.info(`Docs at ${getServerAddress(fastify)}/docs`);
  });
}

export default fp(setupSwagger);
