import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "./user_service";
import { CreateUserInput } from "./dto/create_user.input";
import bcrypt from "bcrypt";
import { CreateUserResponse } from "./dto/create_user.response";
import { LoginUserInput } from "./dto/login_user.input";
import JwtService from "../../../services/jwt.service";
import { LoginUserResponse } from "./dto/login_user.response";
import { GetUserResponse } from "./dto/get_user.response";
class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async getCurrentUser(id: string): Promise<GetUserResponse> {
    const user = await this.userService.getUserById(id);

    if (!user) throw new Error("User not found")

    return {
      message: "Get user successfully",
      data: user
    }
  }

  async registerUser(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ): Promise<CreateUserResponse> {
    try {
      const { email, username, password } = request.body;

      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        return reply.status(400).send({
          error: "User already exists",
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userService.createUser({
        email,
        username,
        password: hashedPassword,
      });

      return {
        message: "User created successfully",
        data: {
          user,
        },
      };
    } catch (e) {
      reply.log.error(e);
      return reply.status(500).send({
        error: "Cannot create user",
        message: "Internal server error",
      });
    }
  }

  async loginUser(
    request: FastifyRequest<{ Body: LoginUserInput }>,
    reply: FastifyReply
  ): Promise<LoginUserResponse> {
    try {
      const decodedToken = await this.userService.verifyToken(
        request.body.idToken
      );

      const email = decodedToken.email;
      if (!email) {
        return reply.status(400).send({
          error: "Invalid token",
          message: "Invalid token",
        });
      }

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        return reply.status(400).send({
          error: "User not found",
          message: "User not found",
        });
      }

      const token = await this.jwtService.sign({
        id: user.id,
      });

      return {
        message: "User logged in successfully",
        data: {
          token,
          user,
        },
      };
    } catch (e) {
      console.log("error", e);
      reply.log.error(e);
      return reply.status(500).send({
        error: "Cannot login user",
        message: "Internal server error",
      });
    }
  }
}

export default UserController;
