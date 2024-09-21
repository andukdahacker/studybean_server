import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { RoadmapSchema } from "./roadmap.schema";

export const GetRoadmapResponseSchema = BaseResponseSchema(RoadmapSchema);

export type GetRoadmapResponse = Static<typeof GetRoadmapResponseSchema>;
