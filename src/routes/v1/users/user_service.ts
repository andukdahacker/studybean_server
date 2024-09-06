import { PrismaClient } from "@prisma/client";
import { CreateUserInput } from "./dto/create_user.input";
import { Auth } from "firebase-admin/auth";

class UserService {
  constructor(
    private readonly db: PrismaClient,
    private readonly firebaseAuth: Auth
  ) {}

  async verifyToken(token: string) {
    return await this.firebaseAuth.verifyIdToken(token);
  }

  async getUserByEmail(email: string) {
    return await this.db.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(input: CreateUserInput) {
    return await this.db.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: input.password,
      },
    });
  }
}

export default UserService;
