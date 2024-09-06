import { FastifyReply, FastifyRequest } from "fastify";
import SubjectService from "./subject_service";
import { GetManySubjectInput } from "./dto/get_many_subject.input";
import { GetManySubjectResponse } from "./dto/get_many_subject.response";
import { CreateSubjectInput } from "./dto/create_subject.input";
import { CreateSubjectResponse } from "./dto/create_subject.response";
import { GetSubjectResponse } from "./dto/get_subject.response";
import { GetSubjectInput } from "./dto/get_subject.input";

class SubjectController {
  constructor(private subjectService: SubjectService) {}

  async createSubject(
    request: FastifyRequest<{ Body: CreateSubjectInput }>,
    reply: FastifyReply
  ): Promise<CreateSubjectResponse> {
    try {
      const subject = await this.subjectService.createSubject(request.body);

      return {
        message: "Subject created successfully",
        data: {
          subject,
        },
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Subject creation failed",
        message: "Internal server error",
      });
    }
  }

  async getSubject(
    request: FastifyRequest<{ Params: GetSubjectInput }>,
    reply: FastifyReply
  ): Promise<GetSubjectResponse> {
    try {
      const subject = await this.subjectService.getSubject(request.params.id);

      if (!subject) {
        return reply
          .code(404)
          .send({ error: "Subject not found", message: "Subject not found" });
      }

      return {
        message: "Subject fetched successfully",
        data: {
          subject,
        },
      };
    } catch (error) {
      reply.log.error(error);
      return reply
        .code(500)
        .send({ error: "Subject not found", message: "Internal server error" });
    }
  }

  async getSubjectList(
    request: FastifyRequest<{ Querystring: GetManySubjectInput }>,
    reply: FastifyReply
  ): Promise<GetManySubjectResponse> {
    try {
      const subjects = await this.subjectService.getManySubjects(request.query);

      if (subjects.length < request.query.take) {
        return {
          message: "Subjects fetched successfully",
          data: {
            nodes: subjects,
            pageInfo: { hasNextPage: false, cursor: null },
          },
        };
      }

      const cursor = subjects[subjects.length - 1].id;

      const nextCall = await this.subjectService.getManySubjects({
        ...request.query,
        cursor,
      });

      if (nextCall.length === 0) {
        return {
          message: "Subjects fetched successfully",
          data: {
            nodes: subjects,
            pageInfo: { hasNextPage: false, cursor: null },
          },
        };
      }

      return {
        message: "Subjects fetched successfully",
        data: {
          nodes: subjects,
          pageInfo: { hasNextPage: true, cursor },
        },
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Subjects not found",
        message: "Internal server error",
      });
    }
  }
}

export default SubjectController;
