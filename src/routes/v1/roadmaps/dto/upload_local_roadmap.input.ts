import { Static, Type } from "@sinclair/typebox";
import { RoadmapSchema } from "./roadmap.schema";

export const UploadLocalRoadmapInputSchema = Type.Object({
  roadmaps: Type.Array(RoadmapSchema),
});

export type UploadLocalRoadmapInput = Static<
  typeof UploadLocalRoadmapInputSchema
>;
