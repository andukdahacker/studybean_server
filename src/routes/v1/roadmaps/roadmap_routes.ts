import { FastifyInstance, FastifyRequest } from "fastify";
import RoadmapController from "./roadmap_controller";
import RoadmapService from "./roadmap_service";
import {
  CreateRoadmapInput,
  CreateRoadmapInputSchema,
} from "./dto/create_roadmap.input";
import { BaseReponseErrorSchema } from "../../../types/base_response";
import Env from "../../../env";
import GoogleGeminiService, {
  GenerateMilestonesInput,
  GenerateMilestonesInputSchema,
  GenerateMilestonesResponseSchema,
} from "../../../services/google_gemini.service";
import { CreateRoadmapResponseSchema } from "./dto/create_roadmap.response";
import { CreateRoadmapWithAiResponseSchema } from "./dto/create_roadmap_with_ai.response";
import SubjectService from "../subjects/subject_service";
import { GenerateMilestonesWithAIResponseSchema } from "./dto/generate_milestone_with_ai.response";

async function roadmapRoutes(fastify: FastifyInstance, opts: any) {
  const geminiKey = fastify.getEnvs<Env>().GOOGLE_GEMINI_API_KEY;
  const roadmapController = new RoadmapController(
    new RoadmapService(fastify.db),
    new GoogleGeminiService(geminiKey),
    new SubjectService(fastify.db)
  );

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

export default roadmapRoutes;
