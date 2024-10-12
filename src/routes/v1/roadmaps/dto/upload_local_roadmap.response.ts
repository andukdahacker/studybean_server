import { Static, Type } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { RoadmapSchema } from "./roadmap.schema";

export const UploadLocalRoadmapResponseSchema = BaseResponseSchema(
  Type.Object({
    roadmaps: Type.Array(RoadmapSchema),
  })
);

export type UploadLocalRoadmapResponse = Static<
  typeof UploadLocalRoadmapResponseSchema
>;
