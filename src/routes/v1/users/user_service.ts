import { PrismaClient } from "@prisma/client";
import { CreateUserInput } from "./dto/create_user.input";
import { Auth } from "firebase-admin/auth";

class UserService {
  constructor(
    private readonly db: PrismaClient,
    private readonly firebaseAuth: Auth
  ) { }

  async getUserById(id: string) {
    return await this.db.user.findUnique({
      where: {
        id
      }
    })
  }

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

  async decreaseCredits(userId: string) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) throw new Error('Cannot find user');

    if (user.credits >= 1) {
      const updatedUser = await this.db.user.update({
        where: {
          id: userId
        },
        data: {
          credits: user.credits - 1,
        }
      })

      return updatedUser;
    }

    if (user.paidCredits >= 1) {
      const updatedUser = await this.db.user.update({
        where: {
          id: userId,
        },
        data: {
          paidCredits: user.paidCredits - 1
        }
      })

      return updatedUser;
    }

    throw new Error('User does not have sufficient credits');
  }
}

export default UserService;
