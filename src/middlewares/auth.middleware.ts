import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import JwtService from "../services/jwt.service";
import Env from "../env";

declare module "fastify" {
  interface FastifyRequest {
    jwtPayload: JwtPayload;
  }
}

async function authMiddleware(fastify: FastifyInstance, options: Object) {
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const jwtService = new JwtService(fastify.getEnvs<Env>().JWT_SECRET);

      if (!request.headers.authorization) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Unauthorized",
        });
      }

      const token = request.headers.authorization.split(" ")[1];
      if (!token) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Unauthorized",
        });
      }

      try {
        const decoded = await jwtService.verify<JwtPayload>(token);
        if (!decoded) {
          return reply.status(401).send({
            error: "Unauthorized",
            message: "Unauthorized",
          });
        }

        request.jwtPayload = decoded;
      } catch (error) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Unauthorized",
        });
      }
    }
  );
}

export default authMiddleware;
