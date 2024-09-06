import { Static, Type } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { RoadmapSchema } from "./roadmap.schema";

export const CreateRoadmapWithAiResponseSchema = BaseResponseSchema(
  Type.Object({ roadmap: Type.Omit(RoadmapSchema, ["user"]) })
);

export type CreateRoadmapWithAiResponse = Static<
  typeof CreateRoadmapWithAiResponseSchema
>;
