import { FastifyInstance, FastifyRequest } from "fastify";
import SubjectController from "./subject_controller";
import SubjectService from "./subject_service";
import {
  GetManySubjectInput,
  GetManySubjectInputSchema,
} from "./dto/get_many_subject.input";
import { GetManySubjectResponseSchema } from "./dto/get_many_subject.response";
import { BaseReponseErrorSchema } from "../../../types/base_response";
import {
  CreateSubjectInput,
  CreateSubjectInputSchema,
} from "./dto/create_subject.input";
import { CreateSubjectResponseSchema } from "./dto/create_subject.response";
import {
  GetSubjectInput,
  GetSubjectInputSchema,
} from "./dto/get_subject.input";
import { GetSubjectResponseSchema } from "./dto/get_subject.response";

async function subjectRoutes(fastify: FastifyInstance, opts: any) {
  const subjectController = new SubjectController(
    new SubjectService(fastify.db)
  );

  fastify.post("/", {
    schema: {
      description: "Create subject",
      tags: ["subjects"],
      body: CreateSubjectInputSchema,
      response: {
        200: CreateSubjectResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (request: FastifyRequest<{ Body: CreateSubjectInput }>, reply) =>
      subjectController.createSubject(request, reply),
  });

  fastify.get("/:id", {
    schema: {
      description: "Get subject",
      tags: ["subjects"],
      params: GetSubjectInputSchema,
      response: {
        200: GetSubjectResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (request: FastifyRequest<{ Params: GetSubjectInput }>, reply) =>
      subjectController.getSubject(request, reply),
  });

  fastify.get("/list", {
    schema: {
      description: "Get subject list",
      tags: ["subjects"],
      querystring: GetManySubjectInputSchema,
      response: {
        200: GetManySubjectResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (
      request: FastifyRequest<{ Querystring: GetManySubjectInput }>,
      reply
    ) => subjectController.getSubjectList(request, reply),
  });
}

export default subjectRoutes;
