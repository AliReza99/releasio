import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { isIgnoredPath } from "./utils";

async function onRequestLogger(request: FastifyRequest) {
  if (isIgnoredPath(request.url)) return;

  request.log.info(`[req] ${request.method}: ${request.url}`);
}

async function onResponseLogger(request: FastifyRequest, reply: FastifyReply) {
  if (isIgnoredPath(request.url)) return;

  if (reply.statusCode >= 500) {
    request.log.error(
      {
        request: `${request.method}: ${request.url}`,
        parameters: request.params,
      },
      `[res] ${request.method}: ${request.url}`
    );
    return;
  }

  request.log.info(
    {
      request: `${request.method}: ${request.url}`,
      parameters: request.params,
    },
    `[res] ${request.method}: ${request.url}`
  );
}

export async function fastifyLoggerPlugin(fastify: FastifyInstance) {
  fastify.addHook("onRequest", onRequestLogger);
  fastify.addHook("onResponse", onResponseLogger);
}
