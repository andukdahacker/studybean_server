import { FastifyReply, FastifyRequest } from "fastify";
import RoadmapService from "./roadmap_service";
import { CreateRoadmapInput } from "./dto/create_roadmap.input";
import { CreateRoadmapResponse } from "./dto/create_roadmap.response";
import SubjectService from "../subjects/subject_service";
import { CreateRoadmapWithAiResponse } from "./dto/create_roadmap_with_ai.response";
import GoogleGeminiService, {
  GenerateMilestonesInput,
  GenerateMilestonesResponse,
} from "../../../services/google_gemini.service";
import { GenerateMilestonesWithAIResponse } from "./dto/generate_milestone_with_ai.response";

class RoadmapController {
  constructor(
    private roadmapService: RoadmapService,
    private geminiService: GoogleGeminiService,
    private subjectService: SubjectService
  ) {}

  async generateWithAI(
    request: FastifyRequest<{
      Body: CreateRoadmapInput;
    }>,
    reply: FastifyReply
  ): Promise<CreateRoadmapWithAiResponse> {
    try {
      const roadmap = this.roadmapService.createRoadmap(request.body);

      if (!roadmap) {
        return reply.status(400).send({
          error: "Cannot create roadmap",
          message: "Internal server error",
        });
      }

      const subject = await this.subjectService.getSubject(
        request.body.subjectId
      );

      if (!subject) {
        return reply.status(400).send({
          error: "Cannot get subject",
          message: "Internal server error",
        });
      }

      const generatedResult = this.geminiService.generateRoadmap({
        duration: request.body.duration,
        durationUnit: request.body.durationUnit,
        subjectName: subject.name,
        goal: request.body.goal,
      });

      const [roadmapResponse, generatedResultResponse] = await Promise.all([
        roadmap,
        generatedResult,
      ]);

      if (!generatedResultResponse) {
        return reply.status(400).send({
          error: "Cannot generate roadmap",
          message: "Internal server error",
        });
      }

      if (!roadmapResponse) {
        return reply.status(400).send({
          error: "Cannot create roadmap",
          message: "Internal server error",
        });
      }

      if (!generatedResultResponse.response) {
        return reply.status(400).send({
          error: "Cannot generate roadmap",
          message: "Internal server error",
        });
      }

      const textResult = generatedResultResponse.response.text();

      if (!textResult) {
        return reply.status(400).send({
          error: "Cannot generate roadmap",
          message: "Internal server error",
        });
      }

      const parsedJson: GenerateMilestonesResponse = JSON.parse(textResult);

      await this.roadmapService.updateRoadmapWithMilestones(
        roadmapResponse.id,
        parsedJson
      );

      const roadmapUpdated = await this.roadmapService.getRoadmap(
        roadmapResponse.id
      );

      if (!roadmapUpdated) {
        return reply.status(400).send({
          error: "Cannot get roadmap",
          message: "Internal server error",
        });
      }

      return {
        data: {
          roadmap: roadmapUpdated,
        },
        message: "Roadmap created successfully",
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Roadmap creation failed",
        message: "Internal server error",
      });
    }
  }

  async createRoadmap(
    request: FastifyRequest<{
      Body: CreateRoadmapInput;
    }>,
    reply: FastifyReply
  ): Promise<CreateRoadmapResponse> {
    try {
      const roadmap = await this.roadmapService.createRoadmap(request.body);

      return {
        data: {
          roadmap,
        },
        message: "Roadmap created successfully",
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Roadmap creation failed",
        message: "Internal server error",
      });
    }
  }

  async generateMilestonesWithAI(
    request: FastifyRequest<{ Body: GenerateMilestonesInput }>,
    reply: FastifyReply
  ): Promise<GenerateMilestonesWithAIResponse> {
    try {
      const generatedResult = await this.geminiService.generateRoadmap({
        duration: request.body.duration,
        durationUnit: request.body.durationUnit,
        subjectName: request.body.subjectName,
        goal: request.body.goal,
      });

      const textResult = generatedResult.response.text();

      if (!textResult) {
        return reply.status(400).send({
          error: "Cannot generate roadmap",
          message: "Internal server error",
        });
      }

      const parsedJson: GenerateMilestonesResponse = JSON.parse(textResult);

      console.log(parsedJson);

      return {
        data: parsedJson,
        message: "Milestones generated successfully",
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Generate milestones failed",
        message: "Internal server error",
      });
    }
  }
}

export default RoadmapController;
