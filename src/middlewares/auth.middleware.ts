import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    jwtPayload: JwtPayload & { id: string };
  }
}

async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
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
    const decoded = await request.jwtService.verify<
      JwtPayload & { id: string }
    >(token);
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
