import { FastifyReply, FastifyRequest } from "fastify";
import GoogleGeminiService, {
    GenerateMilestonesInput,
    GenerateMilestonesResponse,
} from "../../../services/google_gemini.service";
import S3Service from "../../../services/s3_service";
import { NoDataResponse } from "../../../types/base_response";
import SubjectService from "../subjects/subject_service";
import UserService from "../users/user_service";
import { AddMilestoneInput } from "./dto/add_milestone.input";
import { AddMilestoneResponse } from "./dto/add_milestone.response";
import { CreateActionInput } from "./dto/create_action.input";
import { CreateActionResponse } from "./dto/create_action.response";
import { CreateResourceInput } from "./dto/create_resource.input";
import { CreateResourceResponse } from "./dto/create_resource.response";
import { CreateRoadmapInput } from "./dto/create_roadmap.input";
import { CreateRoadmapResponse } from "./dto/create_roadmap.response";
import { CreateRoadmapWithAiResponse } from "./dto/create_roadmap_with_ai.response";
import { DeleteRoadmapInput } from "./dto/delete_roadmap.input";
import { GenerateMilestonesWithAIResponse } from "./dto/generate_milestone_with_ai.response";
import { GetActionResponse } from "./dto/get_action.response";
import { GetManyRoadmapInput } from "./dto/get_many_roadmap.input";
import { GetManyRoadmapResponse } from "./dto/get_many_roadmap.response";
import { GetMilestoneResponse } from "./dto/get_milestone.response";
import { GetResourceResponse } from "./dto/get_resource.response";
import { GetRoadmapInput } from "./dto/get_roadmap.input";
import { GetRoadmapResponse } from "./dto/get_roadmap.response";
import { UpdateActionInput } from "./dto/update_action.input";
import { UpdateActionResponse } from "./dto/update_action.response";
import { UpdateMilestoneInput } from "./dto/update_milestone.input";
import { UpdateMilestoneResponse } from "./dto/update_milestone.response";
import { UpdateResourceInput } from "./dto/update_resource.input";
import { UpdateResourceResponse } from "./dto/update_resource.response";
import { UpdateResourceNotesInput } from "./dto/update_resource_notes.input";
import { UpdateResourceNotesResponse } from "./dto/update_resource_notes.response";
import { UploadLocalRoadmapInput } from "./dto/upload_local_roadmap.input";
import { UploadLocalRoadmapResponse } from "./dto/upload_local_roadmap.response";
import { UploadResourceFileInput } from "./dto/upload_resource_file.input";
import { UploadResourceFileResponse } from "./dto/upload_resource_file.response";
import RoadmapService from "./roadmap_service";

class RoadmapController {
  constructor(
    private roadmapService: RoadmapService,
    private geminiService: GoogleGeminiService,
    private subjectService: SubjectService,
    private userService: UserService,
    private s3Service: S3Service,
  ) {}

  async updateResourceNotes(
    input: UpdateResourceNotesInput,
  ): Promise<UpdateResourceNotesResponse> {
    const actionResource = await this.roadmapService.updateResourceNotes(input);

    return {
      message: "Resource notes updated successfully",
      data: actionResource,
    };
  }

  async uploadResourceFile(
    file: any,
    data: UploadResourceFileInput,
    bucketName: string,
  ): Promise<UploadResourceFileResponse> {
    const url = await this.s3Service.uploadFile({
      bucketName,
      body: Buffer.from(file),
      fileName: data.fileName,
    });

    const resource = await this.roadmapService.createResource({
      actionId: data.actionId,
      description: data.description,
      title: data.title,
      url: url,
      resourceType: data.resourceType,
    });

    return {
      message: "Upload file successfully",
      data: resource,
    };
  }

  async deleteResourceFile(resourceId: string, bucketName: string) {
    const resource = await this.roadmapService.getResource(resourceId);

    if (!resource) {
      throw new Error("Cannot get resource");
    }

    const s3Url = resource.url;

    const key = s3Url.split("/").pop();

    if (!key) {
      throw new Error("Cannot get key");
    }

    await this.s3Service.deleteFile({ bucketName, key });
  }

  async getRoadmap(
    request: FastifyRequest<{ Params: GetRoadmapInput }>,
    reply: FastifyReply,
  ): Promise<GetRoadmapResponse> {
    try {
      const roadmap = await this.roadmapService.getRoadmapWithId(
        request.params.id,
      );

      if (!roadmap) {
        return reply.code(404).send({
          message: "Roadmap not found",
          error: "Cannot find roadmap with id: " + request.params.id,
        });
      }

      return {
        message: "Get roadmap successfully",
        data: roadmap,
      };
    } catch (e) {
      reply.log.error(e);
      return reply.code(500).send({
        error: e,
        message: "Internal server error",
      });
    }
  }

  async getRoadmapList(
    request: FastifyRequest<{ Querystring: GetManyRoadmapInput }>,
    reply: FastifyReply,
  ): Promise<GetManyRoadmapResponse> {
    try {
      const roadmaps = await this.roadmapService.getManyRoadmaps(
        request.query,
        request.jwtPayload.id,
      );

      if (roadmaps.length < request.query.take) {
        return {
          message: "Get roadmaps successfully",
          data: {
            nodes: roadmaps,
            pageInfo: { hasNextPage: false, cursor: null },
          },
        };
      }

      const cursor = roadmaps[roadmaps.length - 1].id;
      const nextCall = await this.roadmapService.getManyRoadmaps(
        {
          ...request.query,
          cursor,
        },
        request.jwtPayload.id,
      );

      if (nextCall.length === 0) {
        return {
          message: "Get roadmaps successfully",
          data: {
            nodes: roadmaps,
            pageInfo: { hasNextPage: false, cursor: null },
          },
        };
      }

      return {
        message: "Get roadmaps successfully",
        data: {
          nodes: roadmaps,
          pageInfo: { hasNextPage: true, cursor },
        },
      };
    } catch (e) {
      reply.log.error(e);
      return reply.status(500).send({
        error: "Cannot get roadmaps",
        message: "Internal server error",
      });
    }
  }

  async deleteRoadmap(
    input: DeleteRoadmapInput,
    userId: string,
  ): Promise<NoDataResponse> {
    const roadmap = await this.roadmapService.getRoadmapWithId(input.id);

    if (!roadmap) throw new Error("Roadmap not found");

    if (roadmap.userId != userId) throw new Error("Forbidden");

    await this.roadmapService.deleteRoadmap(input.id);

    return {
      message: "Deleted roadmap successfully",
    };
  }

  async generateWithAI(
    input: CreateRoadmapInput,
    userId: string,
  ): Promise<CreateRoadmapWithAiResponse> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new Error("Cannot find user");
    }

    if (user.credits < 1 && user.paidCredits < 1) {
      throw new Error("Not enough credits");
    }

    const roadmap = await this.roadmapService.createRoadmap(input, userId);

    if (!roadmap) {
      throw new Error("Cannot create roadmap");
    }

    const subject = await this.subjectService.getSubject(input.subjectName);

    if (!subject) {
      throw new Error("Cannot get subject");
    }

    const generatedResult = this.geminiService.generateRoadmap({
      subjectName: subject.name,
      goal: input.goal,
    });

    const [roadmapResponse, generatedResultResponse] = await Promise.all([
      roadmap,
      generatedResult,
    ]);

    if (!generatedResultResponse) {
      throw new Error("Cannot generate roadmap");
    }

    if (!roadmapResponse) {
      throw new Error("Cannot generate roadmap");
    }

    if (!generatedResultResponse.response) {
      throw new Error("Cannot generate roadmap");
    }

    const textResult = generatedResultResponse.response.text();

    if (!textResult) {
      throw new Error("Cannot generate roadmap");
    }

    const parsedJson: GenerateMilestonesResponse = JSON.parse(textResult);

    await this.roadmapService.updateRoadmapWithMilestones(
      roadmapResponse.id,
      parsedJson,
    );

    const roadmapUpdated = await this.roadmapService.getRoadmapWithId(
      roadmapResponse.id,
    );

    if (!roadmapUpdated) {
      throw new Error("Cannot generate roadmap");
    }

    await this.userService.decreaseCredits(userId);

    return {
      data: {
        roadmap: roadmapUpdated,
      },
      message: "Roadmap created successfully",
    };
  }

  async createRoadmap(
    request: FastifyRequest<{
      Body: CreateRoadmapInput;
    }>,
    reply: FastifyReply,
  ): Promise<CreateRoadmapResponse> {
    try {
      const roadmap = await this.roadmapService.createRoadmap(
        request.body,
        request.jwtPayload.id,
      );

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
    reply: FastifyReply,
  ): Promise<GenerateMilestonesWithAIResponse> {
    try {
      const generatedResult = await this.geminiService.generateRoadmap({
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

  async addMilestone(
    request: FastifyRequest<{
      Body: AddMilestoneInput;
    }>,
    reply: FastifyReply,
  ): Promise<AddMilestoneResponse> {
    try {
      const milestone = await this.roadmapService.createMilestone(request.body);

      return {
        data: milestone,
        message: "Milestone added successfully",
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Add milestone failed",
        message: "Internal server error",
      });
    }
  }

  async getMilestone(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<GetMilestoneResponse> {
    try {
      const milestone = await this.roadmapService.getMilestoneById(
        request.params.id,
      );

      if (!milestone) {
        return reply.status(400).send({
          error: "Cannot get milestone",
          message: "Internal server error",
        });
      }

      return {
        data: milestone,
        message: "Milestone retrieved successfully",
      };
    } catch (error) {
      reply.log.error(error);
      return reply.status(500).send({
        error: "Get milestone failed",
        message: "Internal server error",
      });
    }
  }

  async deleteMilestone(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<NoDataResponse> {
    try {
      await this.roadmapService.deleteMilestone(request.params.id);

      return {
        message: "Milestone deleted successfully",
      };
    } catch (e) {
      reply.log.error(e);

      return reply.status(500).send({
        error: "Delete milestone failed",
        message: "Internal server error",
      });
    }
  }

  async updateMilestone(
    input: UpdateMilestoneInput,
  ): Promise<UpdateMilestoneResponse> {
    const milestone = await this.roadmapService.updateMilestone(input);

    return {
      data: milestone,
      message: "Milestone updated successfully",
    };
  }

  async createAction(input: CreateActionInput): Promise<CreateActionResponse> {
    const action = await this.roadmapService.createAction(input);

    return {
      data: action,
      message: "Action created successfully",
    };
  }

  async updateAction(input: UpdateActionInput): Promise<UpdateActionResponse> {
    const action = await this.roadmapService.updateAction(input);

    return {
      data: action,
      message: "Action updated successfully",
    };
  }

  async getAction(id: string): Promise<GetActionResponse> {
    const action = await this.roadmapService.getActionById(id);

    if (!action) {
      throw new Error("Action not found");
    }

    return {
      data: action,
      message: "Action retrieved successfully",
    };
  }

  async deleteAction(id: string): Promise<NoDataResponse> {
    await this.roadmapService.deleteAction(id);

    return {
      message: "Action deleted successfully",
    };
  }

  async getResource(id: string): Promise<GetResourceResponse> {
    const resource = await this.roadmapService.getResource(id);

    if (!resource) {
      throw new Error("Resource not found");
    }

    return {
      data: resource,
      message: "Resource retrieved successfully",
    };
  }

  async createResource(
    input: CreateResourceInput,
  ): Promise<CreateResourceResponse> {
    const resource = await this.roadmapService.createResource(input);

    return {
      data: resource,
      message: "Resource created successfully",
    };
  }

  async updateResource(
    input: UpdateResourceInput,
  ): Promise<UpdateResourceResponse> {
    const resource = await this.roadmapService.updateResource(input);

    return {
      data: resource,
      message: "Resource updated successfully",
    };
  }

  async deleteResource(
    id: string,
    cloudFrontDomain: string,
    bucketName: string,
  ): Promise<NoDataResponse> {
    const resource = await this.roadmapService.getResource(id);

    if (!resource) throw new Error("Cannot get resource");

    if (resource.url.startsWith(cloudFrontDomain)) {
      const key = resource.url.substring(cloudFrontDomain.length + 1);
      await this.s3Service.deleteFile({ key, bucketName });
    }

    await this.roadmapService.deleteResource(id);

    return {
      message: "Resource deleted successfully",
    };
  }

  async uploadLocalRoadmap(
    input: UploadLocalRoadmapInput,
    userId: string,
  ): Promise<UploadLocalRoadmapResponse> {
    const roadmap = await this.roadmapService.uploadLocalRoadmap(input, userId);

    return {
      data: {
        roadmaps: roadmap,
      },
      message: "Roadmap uploaded successfully",
    };
  }
}

export default RoadmapController;
