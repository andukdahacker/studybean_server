import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUserInput,
  CreateUserInputSchema,
} from "./dto/create_user.input";
import { CreateUserResponseSchema } from "./dto/create_user.response";
import { BaseReponseErrorSchema, BaseResponseSchema } from "../../../types/base_response";
import UserService from "./user_service";
import UserController from "./user_controller";
import { LoginUserInput, LoginUserInputSchema } from "./dto/login_user.input";
import JwtService from "../../../services/jwt.service";
import Env from "../../../env";
import { LoginUserResponseSchema } from "./dto/login_user.response";
import authMiddleware from "../../../middlewares/auth.middleware";
import { GetUserResponseSchema } from "./dto/get_user.response";

async function userRoutes(fastify: FastifyInstance, options: Object) {
  const userService = new UserService(fastify.db, fastify.firebaseAuth);
  const jwtSecret = fastify.getEnvs<Env>().JWT_SECRET;
  const jwtService = new JwtService(jwtSecret);
  const userController = new UserController(userService, jwtService);

  fastify.get("/me", {
    schema: {
      description: "Get current user",
      tags: ['users'],
      response: {
        200: GetUserResponseSchema,
        500: BaseReponseErrorSchema,
      }
    },
    preHandler: [authMiddleware],
    handler: (request: FastifyRequest, reply: FastifyReply) => userController.getCurrentUser(request.jwtPayload.id),
    errorHandler: (error, req, rep) => {
      rep.log.error(error);
      return rep.code(500).send({
        message: "Internal server error",
        error: error
      })
    }
  })

  fastify.post("/register", {
    schema: {
      description: "Register user",
      tags: ["users"],
      body: CreateUserInputSchema,
      response: {
        200: CreateUserResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (request: FastifyRequest<{ Body: CreateUserInput }>, reply) =>
      userController.registerUser(request, reply),
  });

  fastify.post("/login", {
    schema: {
      description: "Login user",
      tags: ["users"],
      body: LoginUserInputSchema,
      response: {
        200: LoginUserResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (request: FastifyRequest<{ Body: LoginUserInput }>, reply) =>
      userController.loginUser(request, reply),
  });
}

export default userRoutes;
