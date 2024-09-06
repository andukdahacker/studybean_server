import { Static, Type } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { RoadmapSchema } from "./roadmap.schema";

export const CreateRoadmapResponseSchema = BaseResponseSchema(
  Type.Object({
    roadmap: Type.Omit(RoadmapSchema, ["user"]),
  })
);

export type CreateRoadmapResponse = Static<typeof CreateRoadmapResponseSchema>;
