import { FastifyInstance, RouteOptions } from "fastify";

export default async function (fastify: FastifyInstance, _opts: RouteOptions) {
  fastify.get("/", async function (_request, _reply) {
    return { root: true };
  });
}
