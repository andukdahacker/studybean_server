import { fastifyMultipart } from "@fastify/multipart";
import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Env from "../../../env";
import authMiddleware from "../../../middlewares/auth.middleware";
import GoogleGeminiService, {
  GenerateMilestonesInput,
  GenerateMilestonesInputSchema,
} from "../../../services/google_gemini.service";
import S3Service from "../../../services/s3_service";
import {
  BaseResponseErrorSchema,
  NoDataResponseSchema,
} from "../../../types/base_response";
import SubjectService from "../subjects/subject_service";
import UserService from "../users/user_service";
import {
  AddMilestoneInput,
  AddMilestoneInputSchema,
} from "./dto/add_milestone.input";
import { AddMilestoneResponseSchema } from "./dto/add_milestone.response";
import {
  CreateActionInput,
  CreateActionInputSchema,
} from "./dto/create_action.input";
import { CreateActionResponseSchema } from "./dto/create_action.response";
import {
  CreateResourceInput,
  CreateResourceInputSchema,
} from "./dto/create_resource.input";
import { CreateResourceResponseSchema } from "./dto/create_resource.response";
import {
  CreateRoadmapInput,
  CreateRoadmapInputSchema,
} from "./dto/create_roadmap.input";
import { CreateRoadmapResponseSchema } from "./dto/create_roadmap.response";
import { CreateRoadmapWithAiResponseSchema } from "./dto/create_roadmap_with_ai.response";
import {
  DeleteActionInput,
  DeleteActionInputSchema,
} from "./dto/delete_action.input";
import {
  DeleteMilestoneInput,
  DeleteMilestoneInputSchema,
} from "./dto/delete_milestone.input";
import {
  DeleteResourceInput,
  DeleteResourceInputSchema,
} from "./dto/delete_resource.input";
import {
  DeleteResourceFileInput,
  DeleteResourceFileInputSchema,
} from "./dto/delete_resource_file.input";
import {
  DeleteRoadmapInput,
  DeleteRoadmapInputSchema,
} from "./dto/delete_roadmap.input";
import { GenerateMilestonesWithAIResponseSchema } from "./dto/generate_milestone_with_ai.response";
import { GetActionResponseSchema } from "./dto/get_action.response";
import {
  GetManyRoadmapInput,
  GetManyRoadmapInputSchema,
} from "./dto/get_many_roadmap.input";
import { GetManyRoadmapResponseSchema } from "./dto/get_many_roadmap.response";
import {
  GetMilestoneInput,
  GetMilestoneInputSchema,
} from "./dto/get_milestone.input";
import { GetMilestoneResponseSchema } from "./dto/get_milestone.response";
import {
  GetRoadmapInput,
  GetRoadmapInputSchema,
} from "./dto/get_roadmap.input";
import { GetRoadmapResponseSchema } from "./dto/get_roadmap.response";
import {
  UpdateActionInput,
  UpdateActionInputSchema,
} from "./dto/update_action.input";
import { UpdateActionResponseSchema } from "./dto/update_action.response";
import {
  UpdateMilestoneInput,
  UpdateMilestoneInputSchema,
} from "./dto/update_milestone.input";
import {
  UpdateMilestoneResponse,
  UpdateMilestoneResponseSchema,
} from "./dto/update_milestone.response";
import {
  UpdateResourceInput,
  UpdateResourceInputSchema,
} from "./dto/update_resource.input";
import { UpdateResourceResponseSchema } from "./dto/update_resource.response";
import {
  UploadLocalRoadmapInput,
  UploadLocalRoadmapInputSchema,
} from "./dto/upload_local_roadmap.input";
import { UploadLocalRoadmapResponseSchema } from "./dto/upload_local_roadmap.response";
import {
  UploadResourceFileInput,
  UploadResourceFileInputSchema,
} from "./dto/upload_resource_file.input";
import { UploadResourceFileResponseSchema } from "./dto/upload_resource_file.response";
import RoadmapController from "./roadmap_controller";
import RoadmapService from "./roadmap_service";

async function roadmapRoutes(fastify: FastifyInstance, opts: any) {
  const env = fastify.getEnvs<Env>();
  const geminiKey = env.GOOGLE_GEMINI_API_KEY;

  const roadmapController = new RoadmapController(
    new RoadmapService(fastify.db),
    new GoogleGeminiService(geminiKey),
    new SubjectService(fastify.db),
    new UserService(fastify.db, fastify.firebaseAuth),
    new S3Service(fastify.s3, { cloudfrontDomain: env.S3_CLOUDFRONT_DOMAIN }),
  );

  fastify.post("/generateMilestonesWithAI", {
    schema: {
      description: "Generate milestones with AI",
      tags: ["roadmaps"],
      body: GenerateMilestonesInputSchema,
      response: {
        200: GenerateMilestonesWithAIResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    handler: (
      request: FastifyRequest<{
        Body: GenerateMilestonesInput;
      }>,
      reply: FastifyReply,
    ) => roadmapController.generateMilestonesWithAI(request, reply),
  });

  fastify.get("/:id", {
    schema: {
      description: "Get roadmap",
      tags: ["roadmaps"],
      params: GetRoadmapInputSchema,
      response: {
        200: GetRoadmapResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: (
      request: FastifyRequest<{ Params: GetRoadmapInput }>,
      reply: FastifyReply,
    ) => roadmapController.getRoadmap(request, reply),
  });

  fastify.get("/list", {
    schema: {
      description: "Get roadmap list",
      tags: ["roadmaps"],
      querystring: GetManyRoadmapInputSchema,
      response: {
        200: GetManyRoadmapResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: (
      request: FastifyRequest<{ Querystring: GetManyRoadmapInput }>,
      reply: FastifyReply,
    ) => roadmapController.getRoadmapList(request, reply),
  });

  fastify.post("/", {
    schema: {
      description: "Create roadmap",
      tags: ["roadmaps"],
      body: CreateRoadmapInputSchema,
      response: {
        200: CreateRoadmapResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: (
      request: FastifyRequest<{
        Body: CreateRoadmapInput;
        Querystring: { withAI: boolean };
      }>,
      reply: FastifyReply,
    ) => roadmapController.createRoadmap(request, reply),
  });

  fastify.post("/createRoadmapWithAI", {
    schema: {
      description: "Generate roadmap with AI",
      tags: ["roadmaps"],
      body: CreateRoadmapInputSchema,
      response: {
        200: CreateRoadmapWithAiResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{
        Body: CreateRoadmapInput;
      }>,
      _reply: FastifyReply,
    ) => roadmapController.generateWithAI(request.body, request.jwtPayload.id),
    errorHandler: async (error, _request, reply) => {
      reply.log.error(error);

      return reply.status(500).send({
        message: "Internal server error",
        error: error,
      });
    },
  });

  fastify.delete("/", {
    schema: {
      description: "Delete roadmap",
      tags: ["roadmap"],
      body: DeleteRoadmapInputSchema,
      response: {
        200: NoDataResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: DeleteRoadmapInput }>,
      reply: FastifyReply,
    ) => roadmapController.deleteRoadmap(request.body, request.jwtPayload.id),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        message: "Internal server error",
        error: error,
      });
    },
  });

  fastify.post("/addMilestone", {
    schema: {
      description: "Add milestone",
      tags: ["roadmaps"],
      body: AddMilestoneInputSchema,
      response: {
        200: AddMilestoneResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: AddMilestoneInput }>,
      reply: FastifyReply,
    ) => roadmapController.addMilestone(request, reply),
  });

  fastify.get("/milestone/:id", {
    schema: {
      description: "Get milestone",
      tags: ["roadmaps"],
      params: GetMilestoneInputSchema,
      response: {
        200: GetMilestoneResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Params: GetMilestoneInput }>,
      reply: FastifyReply,
    ) => roadmapController.getMilestone(request, reply),
  });

  fastify.delete("/milestone/:id", {
    schema: {
      description: "Delete milestone",
      tags: ["roadmaps"],
      params: DeleteMilestoneInputSchema,
      response: {
        200: NoDataResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Params: DeleteMilestoneInput }>,
      reply: FastifyReply,
    ) => roadmapController.deleteMilestone(request, reply),
  });

  fastify.put("/milestone", {
    schema: {
      description: "Update milestone",
      tags: ["roadmaps"],
      body: UpdateMilestoneInputSchema,
      response: {
        200: UpdateMilestoneResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: UpdateMilestoneInput }>,
      reply: FastifyReply,
    ): Promise<UpdateMilestoneResponse> => {
      try {
        return await roadmapController.updateMilestone(request.body);
      } catch (e) {
        reply.log.error(e);
        return reply.status(500).send({
          error: "Update milestone failed",
          message: "Internal server error",
        });
      }
    },
  });

  fastify.post("/action", {
    schema: {
      description: "Create action",
      tags: ["roadmaps"],
      body: CreateActionInputSchema,
      response: {
        200: CreateActionResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: CreateActionInput }>,
      reply: FastifyReply,
    ) => roadmapController.createAction(request.body),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Create action failed",
        message: "Internal server error",
      });
    },
  });

  fastify.get("/action/:id", {
    schema: {
      description: "Get action",
      tags: ["roadmaps"],
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: GetActionResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => roadmapController.getAction(request.params.id),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Get action failed",
        message: "Internal server error",
      });
    },
  });

  fastify.put("/action", {
    schema: {
      description: "Update action",
      tags: ["roadmaps"],
      body: UpdateActionInputSchema,
      response: {
        200: UpdateActionResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: UpdateActionInput }>,
      reply: FastifyReply,
    ) => {
      try {
        return await roadmapController.updateAction(request.body);
      } catch (e) {
        reply.log.error(e);
        return reply.status(500).send({
          error: "Update action failed",
          message: "Internal server error",
        });
      }
    },
  });

  fastify.delete("/action/:id", {
    schema: {
      description: "Delete action",
      tags: ["roadmaps"],
      params: DeleteActionInputSchema,
      response: {
        200: NoDataResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Params: DeleteActionInput }>,
      reply: FastifyReply,
    ) => roadmapController.deleteAction(request.params.id),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Delete action failed",
        message: "Internal server error",
      });
    },
  });

  fastify.post("/resource", {
    schema: {
      description: "Create resource",
      tags: ["roadmaps"],
      body: CreateResourceInputSchema,
      response: {
        200: CreateResourceResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: CreateResourceInput }>,
      reply: FastifyReply,
    ) => roadmapController.createResource(request.body),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Create resource failed",
        message: "Internal server error",
      });
    },
  });

  fastify.put("/resource", {
    schema: {
      description: "Update resource",
      tags: ["roadmaps"],
      body: UpdateResourceInputSchema,
      response: {
        200: UpdateResourceResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: UpdateResourceInput }>,
      reply: FastifyReply,
    ) => roadmapController.updateResource(request.body),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Update resource failed",
        message: "Internal server error",
      });
    },
  });

  fastify.delete("/resource/:id", {
    schema: {
      description: "Delete resource",
      tags: ["roadmaps"],
      params: DeleteResourceInputSchema,
      response: {
        200: NoDataResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Params: DeleteResourceInput }>,
      reply: FastifyReply,
    ) =>
      roadmapController.deleteResource(
        request.params.id,
        env.S3_CLOUDFRONT_DOMAIN,
        env.S3_BUCKET_NAME,
      ),
  });

  fastify.post("/uploadLocalRoadmaps", {
    schema: {
      description: "Upload local roadmaps",
      tags: ["roadmaps"],
      body: UploadLocalRoadmapInputSchema,
      response: {
        200: UploadLocalRoadmapResponseSchema,
        400: BaseResponseErrorSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: UploadLocalRoadmapInput }>,
      reply: FastifyReply,
    ) =>
      roadmapController.uploadLocalRoadmap(request.body, request.jwtPayload.id),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Upload local roadmaps failed",
        message: "Internal server error",
      });
    },
  });

  fastify.register(fastifyMultipart, {
    attachFieldsToBody: "keyValues",
  });

  fastify.post("/resource/uploadFile", {
    schema: {
      description: "Create action resource with file",
      tags: ["roadmaps"],
      consumes: ["multipart/form-data"],
      body: UploadResourceFileInputSchema,
      response: {
        200: UploadResourceFileResponseSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Body: UploadResourceFileInput }>,
      _reply: FastifyReply,
    ) => {
      const file = request.body.file;

      if (!file) throw new Error("File not found");

      return await roadmapController.uploadResourceFile(
        file,
        request.body,
        env.S3_BUCKET_NAME,
      );
    },
    errorHandler: (error, _req, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: error,
        message: "Internal server error",
      });
    },
  });

  fastify.delete("/resource/:resourceId/deleteFile", {
    schema: {
      description: "Delete a resource file",
      tags: ["roadmaps"],
      params: DeleteResourceFileInputSchema,
      response: {
        200: NoDataResponseSchema,
        500: BaseResponseErrorSchema,
      },
    },
    preHandler: [authMiddleware],
    handler: async (
      request: FastifyRequest<{ Params: DeleteResourceFileInput }>,
      _reply: FastifyReply,
    ) =>
      await roadmapController.deleteResourceFile(
        request.params.resourceId,
        env.S3_BUCKET_NAME,
      ),
    errorHandler: (error, _req, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: error,
        message: "Internal server error",
        tags: ["roadmaps"],
      });
    },
  });
}

export default roadmapRoutes;
