import { PrismaClient } from "@prisma/client";
import { GetManySubjectInput } from "./dto/get_many_subject.input";
import { CreateSubjectInput } from "./dto/create_subject.input";

class SubjectService {
  constructor(private readonly db: PrismaClient) {}

  async getSubject(name: string) {
    return await this.db.subject.findUnique({
      where: {
        name: name,
      },
    });
  }

  async createSubject(input: CreateSubjectInput) {
    return await this.db.subject.create({
      data: {
        name: input.name,
      },
    });
  }

  async getManySubjects(input: GetManySubjectInput) {
    const subjects = await this.db.subject.findMany({
      skip: input.cursor ? 1 : undefined,
      cursor: input.cursor
        ? {
            id: input.cursor,
          }
        : undefined,
      take: input.take,
      where: {
        name: {
          contains: input.name,
          mode: "insensitive",
        },
      },
    });

    return subjects;
  }
}

export default SubjectService;
