import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import JwtService from "../services/jwt.service";
import Env from "../env";
import { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    jwtPayload: JwtPayload & { id: string };
  }
}

async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  secret: string
) {
  const jwtService = new JwtService(secret);

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
    const decoded = await jwtService.verify<JwtPayload & { id: string }>(token);
    if (!decoded) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Unauthorized",
      });
    }

    request.jwtPayload = decoded;
  } catch (error) {
    return reply.status(401).send({
      error: error,
      message: "Unauthorized",
    });
  }
}

export default authMiddleware;
