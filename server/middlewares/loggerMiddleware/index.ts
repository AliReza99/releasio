import { FastifyRequest, FastifyReply } from "fastify";

export async function onRequestLogger(request: FastifyRequest) {
  request.log.info(`[req] ${request.method}: ${request.url}`);
}

export async function onResponseLogger(
  request: FastifyRequest,
  reply: FastifyReply
) {
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
