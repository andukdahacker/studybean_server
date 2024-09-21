import { FastifyInstance, FastifyRequest } from "fastify";
import RoadmapController from "./roadmap_controller";
import RoadmapService from "./roadmap_service";
import {
  CreateRoadmapInput,
  CreateRoadmapInputSchema,
} from "./dto/create_roadmap.input";
import {
  BaseReponseErrorSchema,
  NoDataResponseSchema,
} from "../../../types/base_response";
import Env from "../../../env";
import GoogleGeminiService, {
  GenerateMilestonesInput,
  GenerateMilestonesInputSchema,
} from "../../../services/google_gemini.service";
import { CreateRoadmapResponseSchema } from "./dto/create_roadmap.response";
import { CreateRoadmapWithAiResponseSchema } from "./dto/create_roadmap_with_ai.response";
import SubjectService from "../subjects/subject_service";
import { GenerateMilestonesWithAIResponseSchema } from "./dto/generate_milestone_with_ai.response";
import {
  GetManyRoadmapInput,
  GetManyRoadmapInputSchema,
} from "./dto/get_many_roadmap.input";
import { GetManyRoadmapResponseSchema } from "./dto/get_many_roadmap.response";
import authMiddleware from "../../../middlewares/auth.middleware";
import {
  GetRoadmapInput,
  GetRoadmapInputSchema,
} from "./dto/get_roadmap.input";
import { GetRoadmapResponseSchema } from "./dto/get_roadmap.response";
import {
  AddMilestoneInput,
  AddMilestoneInputSchema,
} from "./dto/add_milestone.input";
import { AddMilestoneResponseSchema } from "./dto/add_milestone.response";
import {
  GetMilestoneInput,
  GetMilestoneInputSchema,
} from "./dto/get_milestone.input";
import { GetMilestoneResponseSchema } from "./dto/get_milestone.response";
import {
  DeleteMilestoneInput,
  DeleteMilestoneInputSchema,
} from "./dto/delete_milestone.input";
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
import { Type } from "@sinclair/typebox";
import { GetActionResponseSchema } from "./dto/get_action.response";
import {
  CreateActionInput,
  CreateActionInputSchema,
} from "./dto/create_action.input";
import { CreateActionResponseSchema } from "./dto/create_action.response";
import {
  DeleteActionInput,
  DeleteActionInputSchema,
} from "./dto/delete_action.input";
import {
  CreateResourceInput,
  CreateResourceInputSchema,
} from "./dto/create_resource.input";
import { CreateResourceResponseSchema } from "./dto/create_resource.response";
import {
  UpdateResourceInput,
  UpdateResourceInputSchema,
} from "./dto/update_resource.input";
import { UpdateResourceResponseSchema } from "./dto/update_resource.response";
import {
  DeleteResourceInput,
  DeleteResourceInputSchema,
} from "./dto/delete_resource.input";

async function roadmapRoutes(fastify: FastifyInstance, opts: any) {
  const geminiKey = fastify.getEnvs<Env>().GOOGLE_GEMINI_API_KEY;
  const roadmapController = new RoadmapController(
    new RoadmapService(fastify.db),
    new GoogleGeminiService(geminiKey),
    new SubjectService(fastify.db)
  );

  fastify.register(roadmapPrivateRoutes);

  fastify.post("/generateMilestonesWithAI", {
    schema: {
      description: "Generate milestones with AI",
      tags: ["roadmaps"],
      body: GenerateMilestonesInputSchema,
      response: {
        200: GenerateMilestonesWithAIResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (
      request: FastifyRequest<{
        Body: GenerateMilestonesInput;
      }>,
      reply
    ) => roadmapController.generateMilestonesWithAI(request, reply),
  });
}

async function roadmapPrivateRoutes(fastify: FastifyInstance, opts: any) {
  const geminiKey = fastify.getEnvs<Env>().GOOGLE_GEMINI_API_KEY;
  const jwtSecret = fastify.getEnvs<Env>().JWT_SECRET;
  const roadmapController = new RoadmapController(
    new RoadmapService(fastify.db),
    new GoogleGeminiService(geminiKey),
    new SubjectService(fastify.db)
  );

  fastify.addHook("onRequest", async (request, reply) =>
    authMiddleware(request, reply, jwtSecret)
  );

  fastify.get("/:id", {
    schema: {
      description: "Get roadmap",
      tags: ["roadmaps"],
      params: GetRoadmapInputSchema,
      response: {
        200: GetRoadmapResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (request: FastifyRequest<{ Params: GetRoadmapInput }>, reply) =>
      roadmapController.getRoadmap(request, reply),
  });

  fastify.get("/list", {
    schema: {
      description: "Get roadmap list",
      tags: ["roadmaps"],
      querystring: GetManyRoadmapInputSchema,
      response: {
        200: GetManyRoadmapResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (
      request: FastifyRequest<{ Querystring: GetManyRoadmapInput }>,
      reply
    ) => roadmapController.getRoadmapList(request, reply),
  });

  fastify.post("/", {
    schema: {
      description: "Create roadmap",
      tags: ["roadmaps"],
      body: CreateRoadmapInputSchema,
      response: {
        200: CreateRoadmapResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: (
      request: FastifyRequest<{
        Body: CreateRoadmapInput;
        Querystring: { withAI: boolean };
      }>,
      reply
    ) => roadmapController.createRoadmap(request, reply),
  });

  fastify.post("/createRoadmapWithAI", {
    schema: {
      description: "Generate roadmap with AI",
      tags: ["roadmaps"],
      body: CreateRoadmapInputSchema,
      response: {
        200: CreateRoadmapWithAiResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{
        Body: CreateRoadmapInput;
      }>,
      reply
    ) => roadmapController.generateWithAI(request, reply),
  });

  fastify.post("/addMilestone", {
    schema: {
      description: "Add milestone",
      tags: ["roadmaps"],
      body: AddMilestoneInputSchema,
      response: {
        200: AddMilestoneResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: AddMilestoneInput }>,
      reply
    ) => roadmapController.addMilestone(request, reply),
  });

  fastify.get("/milestone/:id", {
    schema: {
      description: "Get milestone",
      tags: ["roadmaps"],
      params: GetMilestoneInputSchema,
      response: {
        200: GetMilestoneResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: GetMilestoneInput }>,
      reply
    ) => roadmapController.getMilestone(request, reply),
  });

  fastify.delete("/milestone/:id", {
    schema: {
      description: "Delete milestone",
      tags: ["roadmaps"],
      params: DeleteMilestoneInputSchema,
      response: {
        200: NoDataResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: DeleteMilestoneInput }>,
      reply
    ) => roadmapController.deleteMilestone(request, reply),
  });

  fastify.put("/milestone", {
    schema: {
      description: "Update milestone",
      tags: ["roadmaps"],
      body: UpdateMilestoneInputSchema,
      response: {
        200: UpdateMilestoneResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: UpdateMilestoneInput }>,
      reply
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
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: CreateActionInput }>,
      reply
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
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply
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
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: UpdateActionInput }>,
      reply
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
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: DeleteActionInput }>,
      reply
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
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: CreateResourceInput }>,
      reply
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
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: UpdateResourceInput }>,
      reply
    ) => roadmapController.updateResource(request.body),
    errorHandler: (error, request, reply) => {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Update resource failed",
        message: "Internal server error",
      });
    },
  });

  fastify.delete("resource/:id", {
    schema: {
      description: "Delete resource",
      tags: ["roadmaps"],
      params: DeleteResourceInputSchema,
      response: {
        200: NoDataResponseSchema,
        400: BaseReponseErrorSchema,
        500: BaseReponseErrorSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: DeleteResourceInput }>,
      reply
    ) => roadmapController.deleteResource(request.params.id),
  });
}

export default roadmapRoutes;
