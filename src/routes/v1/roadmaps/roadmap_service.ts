import { PrismaClient } from "@prisma/client";
import { GenerateMilestonesResponse } from "../../../services/google_gemini.service";
import { AddMilestoneInput } from "./dto/add_milestone.input";
import { CreateActionInput } from "./dto/create_action.input";
import { CreateResourceInput } from "./dto/create_resource.input";
import { CreateRoadmapInput } from "./dto/create_roadmap.input";
import { GetManyRoadmapInput } from "./dto/get_many_roadmap.input";
import { UpdateActionInput } from "./dto/update_action.input";
import { UpdateMilestoneInput } from "./dto/update_milestone.input";
import { UpdateResourceInput } from "./dto/update_resource.input";
import { UploadLocalRoadmapInput } from "./dto/upload_local_roadmap.input";

class RoadmapService {
  constructor(private readonly db: PrismaClient) {}

  async getManyRoadmaps(input: GetManyRoadmapInput, userId: string) {
    return await this.db.roadmap.findMany({
      where: {
        userId: userId,
      },
      take: input.take,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      skip: input.cursor ? 1 : undefined,
      include: {
        milestone: {
          include: {
            action: {
              include: {
                resource: true,
              },
            },
          },
        },
        subject: true,
        user: true,
      },
    });
  }

  async getRoadmapWithId(id: string) {
    return await this.db.roadmap.findUnique({
      where: {
        id,
      },
      include: {
        subject: true,
        user: true,
        milestone: {
          include: {
            action: {
              include: {
                resource: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteRoadmap(roadmapId: string) {
    await this.db.roadmap.delete({
      where: {
        id: roadmapId,
      },
    });
  }

  async updateRoadmapWithMilestones(
    roadmapId: string,
    response: GenerateMilestonesResponse,
  ) {
    const milestones = response.milestones.map(async (milestone) => {
      const milestones = await this.db.milestone.create({
        data: {
          index: milestone.index,
          name: milestone.name,
          roadmap: {
            connect: {
              id: roadmapId,
            },
          },
        },
      });

      const actions = milestone.actions.map(async (action) => {
        await this.db.action.create({
          data: {
            name: action.name,
            description: action.description,
            duration: action.duration,
            durationUnit: action.durationUnit,
            resource: {
              createMany: {
                data: action.resource.map((recommendation) => ({
                  title: recommendation.title,
                  description: recommendation.description,
                  url: recommendation.url,
                })),
              },
            },
            milestone: {
              connect: {
                id: milestones.id,
              },
            },
          },
        });
      });

      await Promise.all(actions);

      return milestones;
    });

    await Promise.all(milestones);
  }

  async createRoadmap(input: CreateRoadmapInput, userId: string) {
    return await this.db.roadmap.create({
      data: {
        subject: {
          connectOrCreate: {
            create: {
              name: input.subjectName,
            },
            where: {
              name: input.subjectName,
            },
          },
        },
        goal: input.goal,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        subject: true,
        milestone: {
          include: {
            action: {
              include: {
                resource: true,
              },
            },
          },
        },
      },
    });
  }

  async createMilestone(input: AddMilestoneInput) {
    return await this.db.milestone.create({
      data: {
        name: input.name,
        index: input.index,
        roadmap: {
          connect: {
            id: input.roadmapId,
          },
        },
      },
      include: {
        action: {
          include: {
            resource: true,
          },
        },
      },
    });
  }

  async getMilestoneById(id: string) {
    return await this.db.milestone.findUnique({
      where: {
        id,
      },
      include: {
        action: {
          include: {
            resource: true,
          },
        },
      },
    });
  }

  async deleteMilestone(id: string) {
    await this.db.milestone.delete({
      where: {
        id,
      },
    });
  }

  async updateAction(input: UpdateActionInput) {
    const action = await this.db.action.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name ? input.name : undefined,
        description: input.description ? input.description : undefined,
        isCompleted: input.isCompleted == null ? undefined : input.isCompleted,
      },
      include: {
        resource: true,
      },
    });

    return action;
  }

  async updateMilestone(input: UpdateMilestoneInput) {
    const milestone = await this.db.milestone.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name ? input.name : undefined,
      },
      include: {
        action: {
          include: {
            resource: true,
          },
        },
      },
    });

    return milestone;
  }

  async createAction(input: CreateActionInput) {
    const action = await this.db.action.create({
      data: {
        name: input.name,
        description: input.description,
        duration: input.duration,
        durationUnit: input.durationUnit,
        milestone: {
          connect: {
            id: input.milestoneId,
          },
        },
      },
      include: {
        resource: true,
      },
    });

    return action;
  }

  async getActionById(id: string) {
    return await this.db.action.findUnique({
      where: {
        id,
      },
      include: {
        resource: true,
      },
    });
  }

  async deleteAction(id: string) {
    await this.db.action.delete({
      where: {
        id,
      },
    });
  }

  async getResource(id: string) {
    return await this.db.actionResource.findUnique({
      where: {
        id,
      },
    });
  }

  async createResource(input: CreateResourceInput) {
    const resource = await this.db.actionResource.create({
      data: {
        title: input.title,
        description: input.description,
        url: input.url,
        resourceType: input.resourceType,
        action: {
          connect: {
            id: input.actionId,
          },
        },
      },
    });

    return resource;
  }

  async updateResource(input: UpdateResourceInput) {
    const resource = await this.db.actionResource.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title ? input.title : undefined,
        description: input.description ? input.description : undefined,
      },
    });

    return resource;
  }

  async deleteResource(id: string) {
    return await this.db.actionResource.delete({
      where: {
        id,
      },
    });
  }

  async uploadLocalRoadmap(input: UploadLocalRoadmapInput, userId: string) {
    const createRoadmap = input.roadmaps.map(async (roadmap) => {
      const newRoadmap = await this.db.roadmap.create({
        data: {
          subject: {
            connectOrCreate: {
              create: {
                name: roadmap.subject?.name ?? "",
              },
              where: {
                name: roadmap.subject?.name ?? "",
              },
            },
          },
          goal: roadmap.goal,
          user: {
            connect: {
              id: userId,
            },
          },
          createdAt: roadmap.createdAt,
          id: roadmap.id,
          milestone: {
            createMany: {
              data:
                roadmap.milestone?.map((milestone) => ({
                  name: milestone.name,
                  index: milestone.index,
                  id: milestone.id,
                })) ?? [],
            },
          },
        },
        include: {
          subject: true,
          milestone: {
            include: {
              action: {
                include: {
                  resource: true,
                },
              },
            },
          },
          user: true,
        },
      });

      return newRoadmap;
    });

    return await Promise.all(createRoadmap);
  }
}

export default RoadmapService;
