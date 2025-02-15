import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function setupSwagger(fastify: FastifyInstance) {
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
    const address = fastify.server.address();
    const host =
      typeof address === "string"
        ? address
        : address !== null
        ? `http://localhost:${address.port}`
        : "";

    fastify.log.info(`Docs at ${host}/docs`);
  });
}
