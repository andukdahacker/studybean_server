import { Prisma, PrismaClient } from "@prisma/client";
import { CreateRoadmapInput } from "./dto/create_roadmap.input";
import { GenerateMilestonesResponse } from "../../../services/google_gemini.service";

class RoadmapService {
  constructor(private readonly db: PrismaClient) {}

  async getRoadmap(id: string) {
    return await this.db.roadmap.findUnique({
      where: {
        id,
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

  async updateRoadmapWithMilestones(
    roadmapId: string,
    response: GenerateMilestonesResponse
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

  async createRoadmap(input: CreateRoadmapInput) {
    return await this.db.roadmap.create({
      data: {
        subject: {
          connect: {
            id: input.subjectId,
          },
        },
        goal: input.goal,
        duration: input.duration,
        durationUnit: input.durationUnit,
        user: input.userId
          ? {
              connect: {
                id: input.userId,
              },
            }
          : undefined,
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
}

export default RoadmapService;
