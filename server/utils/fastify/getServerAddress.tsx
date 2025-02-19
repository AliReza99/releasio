import { FastifyInstance } from "fastify";

export function getServerAddress(fastify: FastifyInstance) {
  const address = fastify.server.address();
  const host =
    typeof address === "string"
      ? address
      : address !== null
      ? `http://localhost:${address.port}`
      : "";

  return host;
}
